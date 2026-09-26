/**
 * © CreaTuActivo.com — Propietario y confidencial.
 *
 * ¿Cuánto gasta Queswa en Anthropic, y cuánto de eso es gente?
 *
 *   node scripts/consumo-anthropic.mjs [--dias 7] [--desde 2026-09-26] [--conversaciones 10]
 *
 * Lee `metadata.consumo` de `nexus_conversations` (los tokens de cada llamada del
 * turno, que el motor guarda desde el 26 sep 2026 — ver src/lib/consumo-anthropic.ts),
 * aplica los precios de abajo y reparte por origen:
 *
 *   whatsapp · web · dashboard · pruebas
 *
 * «pruebas» = la fila trae `metadata.origen = 'prueba'` (la petición llegó con
 * `x-queswa-origen: prueba`) o su huella es de un arnés conocido.
 *
 * ⚠️ Lo que NO ve: las llamadas que un script le hace a Anthropic por su cuenta
 * (el juez de Opus de `auditar-guion-queswa.mjs`), y las de Haiku del webhook
 * (radicación, acuerdos) y del correo de handoff. Esas solo están en la consola
 * de Anthropic; con ANTHROPIC_API_KEY_PRUEBAS definida, las de los scripts salen
 * en su propia clave.
 *
 * Las filas anteriores al 26 sep no traen tokens: se cuentan como «sin medir».
 */
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local', quiet: true });

// Dólares por millón de tokens, precios de lista de Anthropic al 26 sep 2026.
// La caché de 5 minutos cobra la escritura a 1,25× y la lectura a 0,1× de la entrada.
const PRECIOS = [
  { prefijo: 'claude-sonnet-4-6', entrada: 3, salida: 15 },
  { prefijo: 'claude-sonnet-5', entrada: 2, salida: 10 },
  { prefijo: 'claude-haiku-4-5', entrada: 1, salida: 5 },
  { prefijo: 'claude-opus-5-5', entrada: 4, salida: 20 },
  { prefijo: 'claude-opus-5', entrada: 5, salida: 25 },
];
const ESCRITURA = 1.25;
const LECTURA = 0.1;

const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const dias = Number(arg('--dias', 7));
const desde = arg('--desde', null) ?? new Date(Date.now() - dias * 864e5).toISOString().slice(0, 10);
const topConversaciones = Number(arg('--conversaciones', 10));

const HUELLA_DE_ARNES = /^rep_|^wa_5730\d{9,}$|^wa_(conv|e3)_|probe|^web_p_|q23/;
const SIN_MODELO = /dictad|puerta|backend_dictador|conductor_web|dashboard_ai|salud_entrada|radicacion/;

function origenDe(fila) {
  const f = fila.fingerprint_id || '';
  if (fila.metadata?.origen === 'prueba' || HUELLA_DE_ARNES.test(f)) return 'pruebas';
  if (f.startsWith('dash_')) return 'dashboard';
  if (f.startsWith('wa_')) return 'whatsapp';
  return 'web';
}

const desconocidos = new Set();
function dolares(c) {
  const p = PRECIOS.find((x) => (c.modelo || '').startsWith(x.prefijo));
  if (!p) { desconocidos.add(c.modelo || '(vacío)'); return 0; }
  return (c.entrada * p.entrada
    + c.cache_escritura * p.entrada * ESCRITURA
    + c.cache_lectura * p.entrada * LECTURA
    + c.salida * p.salida) / 1e6;
}

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const filas = [];
for (let de = 0; ; de += 1000) {
  const { data, error } = await s.from('nexus_conversations')
    .select('fingerprint_id, created_at, metadata')
    .gte('created_at', `${desde}T00:00:00Z`)
    .order('created_at', { ascending: true })
    .range(de, de + 999);
  if (error) { console.error('❌', error.message); process.exit(1); }
  filas.push(...data);
  if (data.length < 1000) break;
}

const porOrigen = {};
const porConversacion = {};
for (const fila of filas) {
  const o = origenDe(fila);
  const a = (porOrigen[o] ??= { medidos: 0, sinMedir: 0, dolares: 0, tokens: 0, modelos: {}, claves: {} });
  const consumo = Array.isArray(fila.metadata?.consumo) ? fila.metadata.consumo : [];
  if (!consumo.length) {
    const m = fila.metadata?.search_method;
    if (m && !SIN_MODELO.test(m)) a.sinMedir++;
    continue;
  }
  a.medidos++;
  // Desde el 26 sep las filas de prueba dicen qué clave pagó el turno.
  if (fila.metadata?.clave) a.claves[fila.metadata.clave] = (a.claves[fila.metadata.clave] || 0) + 1;
  let usdFila = 0;
  for (const c of consumo) {
    const usd = dolares(c);
    usdFila += usd;
    const tok = c.entrada + c.cache_escritura + c.cache_lectura + c.salida;
    a.tokens += tok;
    const mm = (a.modelos[`${c.modelo} · ${c.etapa}`] ??= { llamadas: 0, dolares: 0, lectura: 0, escritura: 0, entrada: 0, salida: 0 });
    mm.llamadas++; mm.dolares += usd;
    mm.lectura += c.cache_lectura; mm.escritura += c.cache_escritura; mm.entrada += c.entrada; mm.salida += c.salida;
  }
  a.dolares += usdFila;
  if (o === 'whatsapp' || o === 'web') {
    const k = fila.fingerprint_id || '(web sin huella)';
    const cv = (porConversacion[k] ??= { origen: o, turnos: 0, dolares: 0 });
    cv.turnos++; cv.dolares += usdFila;
  }
}

const usd = (n) => `$${n.toFixed(n < 1 ? 3 : 2)}`;
console.log(`\nConsumo de Anthropic en nexus_conversations desde el ${desde}\n`);
const total = Object.values(porOrigen).reduce((t, a) => t + a.dolares, 0);
for (const [o, a] of Object.entries(porOrigen).sort((x, y) => y[1].dolares - x[1].dolares)) {
  if (!a.medidos && !a.sinMedir) continue;
  const parte = total ? ` (${Math.round((a.dolares / total) * 100)} %)` : '';
  const prom = a.medidos ? ` · ${usd(a.dolares / a.medidos)} por turno` : '';
  const claves = Object.entries(a.claves).map(([k, n]) => `${n} con la clave ${k}`).join(', ');
  console.log(`▸ ${o.padEnd(10)} ${usd(a.dolares)}${parte} · ${a.medidos} turnos medidos${prom}${a.sinMedir ? ` · ${a.sinMedir} con modelo sin medir` : ''}${claves ? ` · ${claves}` : ''}`);
  for (const [k, m] of Object.entries(a.modelos).sort((x, y) => y[1].dolares - x[1].dolares)) {
    const hit = m.lectura + m.escritura + m.entrada ? Math.round((m.lectura / (m.lectura + m.escritura + m.entrada)) * 100) : 0;
    console.log(`    ${k.padEnd(44)} ${String(m.llamadas).padStart(4)} llamadas · ${usd(m.dolares).padStart(7)} · entrada desde caché ${hit} % · salida media ${Math.round(m.salida / m.llamadas)}`);
  }
}
console.log(`\n  Total medido: ${usd(total)}`);

const conv = Object.entries(porConversacion).sort((x, y) => y[1].dolares - x[1].dolares).slice(0, topConversaciones);
if (conv.length) {
  console.log(`\nLas ${conv.length} conversaciones que más costaron (gente, no pruebas):`);
  for (const [k, c] of conv) console.log(`    ${k.padEnd(28)} ${c.origen.padEnd(9)} ${String(c.turnos).padStart(3)} turnos · ${usd(c.dolares)}`);
}
if (desconocidos.size) console.log(`\n⚠️ Modelos sin precio en la tabla (contados en $0): ${[...desconocidos].join(', ')}`);
console.log('\n⚠️ No incluye lo que los scripts le piden a Anthropic por su cuenta (el juez de auditar-guion) ni el Haiku del webhook: eso está en la consola.\n');
