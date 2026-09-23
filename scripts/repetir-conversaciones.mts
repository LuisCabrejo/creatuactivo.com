/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Repite conversaciones REALES contra producción y compara con lo que se
 * entregó aquel día.
 *
 *   npx tsx scripts/repetir-conversaciones.mts [--largos 5] [--marcados] [--huella wa_57…]
 *
 *   --largos N   repite los N hilos con más interacción (los que más camino recorrieron)
 *   --marcados   repite solo los turnos que algún detector marcó
 *   --huella     repite un hilo concreto
 *
 * ── POR QUÉ ASÍ Y NO RELEYENDO TODO ──────────────────────────────────────────
 *
 * Idea del Director (23 sep 2026): «hemos venido trabajando en las soluciones a
 * medida que se han ido presentando, así que releer las 40 conversaciones no
 * sería asertivo. Mejor probar las preguntas donde hubo problemas y confirmar
 * que ahora se entregan bien, y probar los flujos más normales para auditar qué
 * pasaría si alguien sigue un camino parecido».
 *
 * Es regresión contra la realidad en vez de contra casos inventados.
 *
 * ── LO QUE ESTA PRUEBA NO VE ─────────────────────────────────────────────────
 *
 * Llama al MOTOR, no al webhook. Los nodos dictados por el canal —apertura,
 * botones, Flow del simulador, guardarraíl de salud de ENTRADA, fotos— no pasan
 * por aquí. Un turno que en su día lo resolvió el webhook va a salir distinto, y
 * eso NO es una regresión: es que la prueba no llega ahí. Los turnos dictados
 * salen marcados con «(lo resolvió el canal)».
 *
 * ⚠️ Por lo mismo, el arnés **emula la poda de la pregunta de dos salidas**: en
 * el tenant `whatsapp` esa poda vive en el webhook, no en el motor, así que sin
 * emularla el arnés mostraría preguntas que la persona nunca vería. Mismo
 * criterio que `prueba-conversacion.mjs`, que emula la derivación de salud.
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { detectarPreguntaDeDosSalidas, podarPreguntaDeDosSalidas } from '../src/lib/guardarrail-pregunta.ts';
import { huellasDePersonas, detectoresDeterministas } from '../src/lib/revisar-turnos.ts';

const arg = (k: string, d?: string) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg('--base', 'https://creatuactivo.com')!;
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const desde = new Date(Date.now() - 30 * 864e5).toISOString();
const bog = (iso: string) => new Date(iso).toLocaleString('es-CO', { timeZone: 'America/Bogota', hour12: false });

let filas: any[] = [];
for (let f = 0; ; f += 1000) {
  const r = await s.from('nexus_conversations').select('fingerprint_id,created_at,messages,metadata')
    .gt('created_at', desde).order('created_at').range(f, f + 999);
  if (r.error) throw r.error; filas = filas.concat(r.data); if (r.data.length < 1000) break;
}
const personas = await huellasDePersonas(s, desde);
const P = filas.filter((f) => personas.has(f.fingerprint_id));
const H: Record<string, any[]> = {};
for (const f of P) (H[f.fingerprint_id] ||= []).push(f);
for (const ts of Object.values(H)) ts.sort((a, b) => a.created_at.localeCompare(b.created_at));

const usr = (t: any) => (t.messages || []).find((m: any) => m.role === 'user')?.content || '';
const bot = (t: any) => (t.messages || []).find((m: any) => m.role === 'assistant')?.content || '';
const delCanal = (t: any) => { const m = String(t.metadata?.search_method || ''); return !m || m === '-'; };

let hilos = Object.entries(H);
const unaHuella = arg('--huella');
if (unaHuella) hilos = hilos.filter(([fp]) => fp === unaHuella);
else hilos = hilos.sort((a, b) => b[1].length - a[1].length).slice(0, Number(arg('--largos', '5')));

const soloMarcados = process.argv.includes('--marcados');
console.log(`\n🔁 Repitiendo ${hilos.length} hilo(s) contra ${BASE}\n${'═'.repeat(76)}`);

// ⚠️ Comparar por TEXTO no sirve: el modelo nunca repite palabra por palabra, y
// «85 cambiaron» no dice nada. Lo que importa es si algún detector se enciende
// AHORA que antes no lo hacía, y si se apaga alguno que sí lo hacía.
let canal = 0, mejoraron = 0, empeoraron = 0, igualDeBien = 0;
const detOf = (texto: string, meta: any) =>
  detectoresDeterministas({ fingerprint_id: null, created_at: '', messages: [{ role: 'assistant', content: texto }], metadata: meta ?? {} } as any, null, new Set());

for (const [fp, ts] of hilos) {
  console.log(`\n\n████ ${fp} · ${ts.length} turnos · ${bog(ts[0].created_at)}`);
  const historia: { role: string; content: string }[] = [];
  for (let i = 0; i < ts.length; i++) {
    const t = ts[i];
    const pregunta = usr(t);
    const antes = bot(t);
    if (!pregunta.trim()) { historia.push({ role: 'assistant', content: antes }); continue; }
    if (soloMarcados && !t.metadata?.marcado) { historia.push({ role: 'user', content: pregunta }, { role: 'assistant', content: antes }); continue; }
    if (delCanal(t)) {
      canal++;
      console.log(`\n── ${i + 1} · «${pregunta.slice(0, 64)}»   (lo resolvió el canal — la prueba no llega ahí)`);
      historia.push({ role: 'user', content: pregunta }, { role: 'assistant', content: antes });
      continue;
    }
    let ahora = '';
    try {
      const r = await fetch(`${BASE}/api/nexus`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'whatsapp' },
        body: JSON.stringify({ messages: [...historia, { role: 'user', content: pregunta }],
          sessionId: `rep_${fp}`, fingerprint: `rep_${fp}` }),
      });
      ahora = (await r.text()).replace(/\0/g, '').trim();
      ahora = podarPreguntaDeDosSalidas(ahora);   // lo que el webhook haría
    } catch (e) { ahora = `(error: ${e})`; }

    const dAntes = detOf(antes, t.metadata);
    const dAhora = detOf(ahora, t.metadata);
    const nuevos = dAhora.filter((d) => !dAntes.includes(d));
    const curados = dAntes.filter((d) => !dAhora.includes(d));
    if (nuevos.length) empeoraron++; else if (curados.length) mejoraron++; else igualDeBien++;

    const señal = nuevos.length ? '🔴 EMPEORÓ' : curados.length ? '🟢 se curó ' : '·  sin cambio';
    console.log(`\n── ${i + 1} · «${pregunta.slice(0, 62)}»   [${t.metadata?.search_method || '-'}]`);
    console.log(`   ${señal}${nuevos.length ? '  ahora: ' + nuevos.join(', ') : ''}${curados.length ? '  ya no: ' + curados.join(', ') : ''}`);
    if (nuevos.length || process.argv.includes('--detalle')) {
      console.log(`   antes: «${antes.slice(0, 140).replace(/\n/g, ' ')}…»`);
      console.log(`   ahora: «${ahora.slice(0, 140).replace(/\n/g, ' ')}…»`);
    }
    historia.push({ role: 'user', content: pregunta }, { role: 'assistant', content: ahora });
  }
}
console.log(`\n\n${'═'.repeat(76)}`);
console.log(`🟢 se curaron: ${mejoraron}   ·   sin cambio: ${igualDeBien}   ·   🔴 empeoraron: ${empeoraron}   ·   los resolvió el canal: ${canal}`);
if (empeoraron) process.exit(1);
