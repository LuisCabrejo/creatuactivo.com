/**
 * Repite una conversación real de punta a punta —webhook, conductor, motor—
 * contra un servidor LOCAL, sin escribirle a nadie.
 *
 *   1. Levantar el servidor de ensayo (otro puerto, modo ensayo):
 *        NEXT_PUBLIC_SITE_URL=http://localhost:3055 WA_DRY_RUN=1 npx next dev -p 3055
 *      ⚠️ En una COPIA del proyecto si ya hay un `next dev` corriendo en esta
 *      carpeta: dos servidores sobre el mismo `.next` se pisan.
 *   2. npx tsx scripts/repetir-por-webhook.mts [--base http://localhost:3055] [--log <archivo del servidor>] [--hasta 29]
 *
 * Por qué existe (24 sep 2026): las pruebas del motor no ven el webhook —los
 * botones, las fotos, el simulador, la pareja, la radicación viven allá—, y la
 * prueba del Director falló justamente en esos nodos. Con `WA_DRY_RUN=1` la
 * capa del canal anota cada envío en el log del servidor con la marca
 * `[WA_DRY_RUN]` en vez de mandarlo a Meta; este script manda los mensajes como
 * los manda Meta y lee esas marcas.
 *
 * Usa un número ficticio y BORRA su rastro al empezar y al terminar (prospecto,
 * conversación, guarda de reenvíos). La primera línea va sin «vengo del
 * enlace de…»: con socio, el ensayo le avisaría a su Centro de Mando.
 */
import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local', quiet: true });
const arg = (n: string, d: string) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg('--base', 'http://localhost:3055');
const LOG = arg('--log', '');
const HASTA = Number(arg('--hasta', '29'));
// Retomar desde un turno, sobre las filas que dejó una corrida con --conservar.
const DESDE = Number(arg('--desde', '1'));
const TEL = '573009990024';
const HUELLA = `wa_${TEL}`;
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

type Entrada = { texto?: string; boton?: { id: string; title: string }; flow?: Record<string, string> };
const { filas } = JSON.parse(fs.readFileSync(new URL('./fixtures/prueba-director-24sep.json', import.meta.url), 'utf8')) as { filas: { messages: { role: string; content: string }[] }[] };
const entradas: Entrada[] = filas.map((f, i) => {
  const u = f.messages.find((m) => m.role === 'user')!.content;
  if (i === 0) return { texto: 'Hola Queswa' };
  // Los botones de la apertura: en la prueba se tocaron, no se escribieron.
  const BOTONES: Record<string, string> = { 'Cómo funciona': 'apertura_sistema', 'Cómo entra el dinero': 'apertura_dinero', 'Qué debo hacer yo': 'apertura_rol' };
  if (BOTONES[u]) return { boton: { id: BOTONES[u], title: u } };
  const niveles = u.match(/simulador de Los 12 Niveles: nivel (\d+)/);
  if (niveles) return { flow: { tipo: 'niveles', nivel: niveles[1] } };
  const gen = u.match(/paquete (ESP-\d), con (\d+) paquetes/);
  if (gen) return { flow: { paquete: gen[1], cantidad: gen[2] } };
  return { texto: u };
});

async function limpiar() {
  await s.from('nexus_conversations').delete().eq('fingerprint_id', HUELLA);
  await s.from('prospects').delete().eq('fingerprint_id', HUELLA);
  await s.from('pending_activations').delete().eq('fingerprint_id', HUELLA);
  const { data } = await s.from('wa_mensajes_procesados').select('wamid, identidad').like('wamid', 'wamid.ensayo.%');
  const ids = (data ?? []).map((r: { wamid: string }) => r.wamid);
  if (ids.length) await s.from('wa_mensajes_procesados').delete().in('wamid', ids);
}

function payload(e: Entrada, wamid: string) {
  const msg: Record<string, unknown> = { from: TEL, id: wamid, timestamp: String(Math.floor(Date.now() / 1000)) };
  if (e.texto) Object.assign(msg, { type: 'text', text: { body: e.texto } });
  if (e.boton) Object.assign(msg, { type: 'interactive', interactive: { type: 'button_reply', button_reply: e.boton } });
  if (e.flow) Object.assign(msg, { type: 'interactive', interactive: { type: 'nfm_reply', nfm_reply: { response_json: JSON.stringify(e.flow), body: 'Sent', name: 'flow' } } });
  return {
    object: 'whatsapp_business_account',
    entry: [{ id: 'ensayo', changes: [{ field: 'messages', value: {
      messaging_product: 'whatsapp',
      metadata: { display_phone_number: '573000000000', phone_number_id: 'ensayo' },
      contacts: [{ profile: { name: 'Ensayo' }, wa_id: TEL }],
      messages: [msg],
    } }] }],
  };
}

const filasDeHuella = async () => (await s.from('nexus_conversations').select('created_at, messages, metadata').eq('fingerprint_id', HUELLA).order('created_at')).data ?? [];

if (DESDE <= 1) await limpiar();
const salida: string[] = [];
const escribir = (t: string) => { console.log(t); salida.push(t); };
escribir(`Ensayo por webhook · ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })} · ${BASE}`);

for (let i = DESDE - 1; i < Math.min(HASTA, entradas.length); i++) {
  const e = entradas[i];
  const antes = (await filasDeHuella()).length;
  const tamLog = LOG && fs.existsSync(LOG) ? fs.statSync(LOG).size : 0;
  const wamid = `wamid.ensayo.${Date.now()}.${i + 1}`;
  const t0 = Date.now();
  const r = await fetch(`${BASE}/api/whatsapp/webhook`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload(e, wamid)) });
  if (!r.ok) { escribir(`❌ turno ${i + 1}: el webhook respondió ${r.status}`); break; }
  // Espera a que el turno quede guardado Y a que el webhook termine de mandar:
  // el motor guarda el turno ANTES de que el webhook lo envíe (piso de escritura,
  // pausas entre partes), así que esperar solo la fila atribuía los envíos al
  // turno siguiente. Se da por cerrado cuando hay fila, hubo envío y lleva
  // cinco segundos sin salir nada más.
  const leerEnvios = () => (LOG && fs.existsSync(LOG)
    // ⚠️ Se corta en BYTES: el log trae tildes y emojis, y cortar el texto con
    // el tamaño en bytes se saltaba las líneas nuevas.
    ? fs.readFileSync(LOG).subarray(tamLog).toString('utf8').split('\n').filter((l) => l.includes('[WA_DRY_RUN]'))
      .map((l) => JSON.parse(l.slice(l.indexOf('{'))) as Record<string, unknown>)
      .filter((x) => x.to === TEL && x.tipo !== 'escribiendo')
    : []);
  let filasAhora = antes;
  let envios: Record<string, unknown>[] = [];
  let ultimoCambio = Date.now();
  while (Date.now() - t0 < 100_000) {
    await new Promise((res) => setTimeout(res, 1000));
    filasAhora = (await filasDeHuella()).length;
    const ahora = leerEnvios();
    if (ahora.length !== envios.length) { envios = ahora; ultimoCambio = Date.now(); }
    const quieto = Date.now() - ultimoCambio > 5000;
    if (filasAhora > antes && (LOG ? envios.length > 0 && quieto : true)) break;
  }
  const ms = Date.now() - t0;
  const fila = (await filasDeHuella()).at(-1);
  const meta = (fila?.metadata ?? {}) as Record<string, unknown>;
  escribir(`\n══ ${i + 1} · ${(ms / 1000).toFixed(1)} s · ${meta.search_method ?? meta.nodo ?? '—'}${meta.envoltura ? ` · envoltura ${JSON.stringify(meta.envoltura)}` : ''}${meta.supervisor ? ` · supervisor ${JSON.stringify(meta.supervisor)}` : ''}${meta.oferta_cambiada ? ` · oferta ${meta.oferta_cambiada}` : ''}`);
  escribir(`[PERSONA] ${e.texto ?? e.boton?.title ?? JSON.stringify(e.flow)}`);
  if (envios.length) {
    for (const x of envios) {
      const cuerpo = (x.text ?? x.caption ?? x.bodyText ?? '') as string;
      escribir(`[${String(x.tipo).toUpperCase()}] ${x.link ? `${x.link}\n` : ''}${cuerpo}`);
    }
  } else if (filasAhora > antes) {
    escribir(`[GUARDADO] ${fila?.messages?.find((m: { role: string }) => m.role === 'assistant')?.content ?? ''}`);
  } else {
    escribir('[SIN RESPUESTA EN 100 s]');
  }
}

const archivo = `/private/tmp/ensayo-webhook-${Date.now()}.txt`;
fs.writeFileSync(archivo, salida.join('\n'));
console.log(`\nTranscripción: ${archivo}`);
if (!process.argv.includes('--conservar')) await limpiar();
