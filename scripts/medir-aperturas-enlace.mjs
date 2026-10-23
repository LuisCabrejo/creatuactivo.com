/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * ¿Cuántos abren Queswa y no le escriben? (6 oct 2026, caso Felipe)
 *
 * El enlace del socio (/{slug}/queswa y los de los videos) redirige a WhatsApp
 * con el mensaje escrito; la persona tiene que tocar «Enviar». Las aperturas se
 * registran en `page_visits` desde el 6 oct; los primeros mensajes, en
 * `nexus_conversations` («Hola Queswa, vengo del enlace de {slug}»). La primera
 * tabla los cruza por día y por socio.
 *
 * ⭐ POR DISPOSITIVO (13 oct 2026, Director, caso Wilson Romero): desde ese día en
 * el computador Queswa conversa en la web y en el celular sigue en WhatsApp, y
 * cada apertura —el enlace, el orbe, los botones y el final del video de la Home—
 * queda con su dispositivo, a dónde llevó y la cookie del navegador (`visitante`).
 * La segunda tabla sigue cada navegador hasta su conversación:
 *   · web       → la ficha web con esa cookie (prospects.cookie_id) y una fila suya
 *                 en nexus_conversations después de la apertura;
 *   · whatsapp  → la ficha de WhatsApp atada a esa cookie (device_info.web_cookie,
 *                 el enlace) o a la huella de ese navegador (device_info.web_fingerprint,
 *                 el orbe).
 *
 *   node scripts/medir-aperturas-enlace.mjs [--dias 7]
 *
 * 🛑 SIN CÓDIGO EN EL MENSAJE (desde el 20 oct 2026): el mensaje que abre WhatsApp
 * ya no lleva la cookie del navegador (` c:…`, el enlace) ni la huella del orbe
 * (` w:…`), así que el webhook no ata la ficha de WhatsApp al navegador. La
 * SEGUNDA tabla, que sigue cada navegador por device_info.web_cookie y
 * web_fingerprint, va a mostrar WhatsApp cerca de 0 % aunque la gente escriba:
 * no es un dato, es la ausencia del código. La comparación válida es la PRIMERA
 * tabla: aperturas contra «escribieron», por socio y por día.
 *
 * Qué pasó y contra qué se compara (dispositivo.ts tiene la historia):
 *   · hasta el 20 oct, el celular iba a WhatsApp con código: 13 de 32 navegadores
 *     del enlace del socio conversaron (41 %);
 *   · del 21 al 23 oct, todos al chat web: 4 de 24 (17 %);
 *   · desde el 23 oct, el celular y la tableta vuelven a WhatsApp, sin código.
 *     El 30 oct se mide la semana con `--dias 7` contra esas dos líneas base.
 *
 * ⚠️ Una apertura no es una persona: quien toca dos veces cuenta dos (por eso la
 * segunda tabla cuenta también navegadores). Y el primer mensaje puede llegar
 * horas después, o al día siguiente. Sin cookie (navegador que las bloquea) la
 * apertura se cuenta pero no se puede seguir.
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
import { createClient } from '@supabase/supabase-js';

const i = process.argv.indexOf('--dias');
const dias = i > -1 ? Number(process.argv[i + 1]) : 7;
const desde = new Date(Date.now() - dias * 864e5).toISOString();
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { data: visitas } = await sb
  .from('page_visits')
  .select('mentor_ref_id, page_entry, timestamp, dispositivo, sistema, destino, origen, visitante')
  .gte('timestamp', desde);
const { data: conv } = await sb.from('nexus_conversations').select('fingerprint_id, messages, created_at').like('fingerprint_id', 'wa_%').gte('created_at', desde);

const RE_ENLACE = /\/(queswa|acceso|como-funciona|estrategia|como-entra-el-dinero|que-debo-hacer-yo)$/;
const dia = (t) => new Date(t).toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });

// ── 1. El enlace del socio, por día y por socio ─────────────────────────────
const filas = new Map();
const clave = (d, slug) => `${d} · ${slug}`;
for (const v of visitas ?? []) {
  if (!RE_ENLACE.test(v.page_entry)) continue;
  const k = clave(dia(v.timestamp), v.mentor_ref_id); const f = filas.get(k) ?? { aperturas: 0, web: 0, escribieron: new Set() };
  f.aperturas++; if (v.destino === 'web') f.web++; filas.set(k, f);
}
for (const c of conv ?? []) {
  for (const m of c.messages ?? []) {
    const r = m.role === 'user' && String(m.content ?? '').match(/vengo del enlace de ([a-z0-9-]+)/i);
    if (!r) continue;
    const k = clave(dia(c.created_at), r[1].toLowerCase()); const f = filas.get(k) ?? { aperturas: 0, web: 0, escribieron: new Set() };
    f.escribieron.add(c.fingerprint_id); filas.set(k, f);
  }
}
const orden = [...filas.entries()].sort(([a], [b]) => a.localeCompare(b));
let A = 0, E = 0, W = 0;
console.log(`Aperturas del enlace vs personas que escribieron por WhatsApp — últimos ${dias} días\n`);
for (const [k, f] of orden) {
  A += f.aperturas; E += f.escribieron.size; W += f.web;
  const web = f.web ? ` · ${f.web} al chat web` : '';
  console.log(`${k.padEnd(42)} abrieron ${String(f.aperturas).padStart(3)} · escribieron ${String(f.escribieron.size).padStart(3)}${web}`);
}
const aWhatsApp = A - W;
console.log(`\nTotal: ${A} aperturas (${aWhatsApp} a WhatsApp, ${W} al chat web) · ${E} escribieron por WhatsApp${aWhatsApp ? ` · ${Math.round((E / aWhatsApp) * 100)}% de las que fueron a WhatsApp` : ''}`);
console.log('(Las aperturas se registran desde el 6 oct 2026, y el dispositivo desde el 13 oct. Del 21 al 23 oct todos los');
console.log('dispositivos fueron al chat web; desde el 23 oct el celular y la tableta vuelven a WhatsApp, sin código.)');
console.log('⭐ Esta tabla es la que se compara: sin código en el mensaje, la de abajo no puede seguir a WhatsApp.');

// ── 2. Por dispositivo: cada navegador, hasta su conversación ───────────────
const conDato = (visitas ?? []).filter((v) => v.dispositivo);
if (!conDato.length) {
  console.log('\nTodavía no hay aperturas con dispositivo en este periodo.');
  process.exit(0);
}

const cookies = [...new Set(conDato.map((v) => v.visitante).filter(Boolean))];
const lotes = (arr, n = 200) => Array.from({ length: Math.ceil(arr.length / n) }, (_, k) => arr.slice(k * n, k * n + n));

// Fichas web de esos navegadores (la cookie la deja el salto del enlace o tracking.js).
const fichasWeb = [];
for (const l of lotes(cookies)) {
  const { data } = await sb.from('prospects').select('fingerprint_id, cookie_id').in('cookie_id', l).not('fingerprint_id', 'like', 'wa_%');
  fichasWeb.push(...(data ?? []));
}
const huellaDeCookie = new Map(fichasWeb.map((f) => [f.cookie_id, f.fingerprint_id]));
const huellas = [...new Set(fichasWeb.map((f) => f.fingerprint_id))];

// ¿Conversó en la web? Una fila en nexus_conversations con su huella.
const conversacionesWeb = new Map(); // huella → primera fecha
for (const l of lotes(huellas)) {
  const { data } = await sb.from('nexus_conversations').select('fingerprint_id, created_at').in('fingerprint_id', l).gte('created_at', desde);
  for (const c of data ?? []) {
    const prev = conversacionesWeb.get(c.fingerprint_id);
    if (!prev || c.created_at < prev) conversacionesWeb.set(c.fingerprint_id, c.created_at);
  }
}

// ¿Escribió por WhatsApp? Su ficha de WhatsApp atada a la cookie o a la huella.
const escribioPorWhatsApp = new Set(); // cookie
for (const l of lotes(cookies)) {
  const { data } = await sb.from('prospects').select('device_info').like('fingerprint_id', 'wa_%').in('device_info->>web_cookie', l);
  for (const f of data ?? []) escribioPorWhatsApp.add(f.device_info?.web_cookie);
}
const cookieDeHuella = new Map(fichasWeb.map((f) => [f.fingerprint_id, f.cookie_id]));
for (const l of lotes(huellas)) {
  const { data } = await sb.from('prospects').select('device_info').like('fingerprint_id', 'wa_%').in('device_info->>web_fingerprint', l);
  for (const f of data ?? []) { const c = cookieDeHuella.get(f.device_info?.web_fingerprint); if (c) escribioPorWhatsApp.add(c); }
}

const grupos = new Map();
for (const v of conDato) {
  const k = [v.dispositivo, v.origen ?? '—', v.destino ?? '—'].join('|');
  const g = grupos.get(k) ?? { aperturas: 0, navegadores: new Set(), conversaron: new Set(), sistemas: new Map() };
  g.aperturas++;
  g.sistemas.set(v.sistema ?? 'otro', (g.sistemas.get(v.sistema ?? 'otro') ?? 0) + 1);
  if (v.visitante) {
    g.navegadores.add(v.visitante);
    const huella = huellaDeCookie.get(v.visitante);
    const conversoWeb = v.destino === 'web' && huella && conversacionesWeb.has(huella) && conversacionesWeb.get(huella) >= v.timestamp;
    const conversoWA = v.destino === 'whatsapp' && escribioPorWhatsApp.has(v.visitante);
    if (conversoWeb || conversoWA) g.conversaron.add(v.visitante);
  }
  grupos.set(k, g);
}

console.log(`\nPor dispositivo — aperturas con dispositivo anotado, últimos ${dias} días\n`);
console.log(`${'Dispositivo'.padEnd(12)}${'Origen'.padEnd(9)}${'Destino'.padEnd(10)}${'Aperturas'.padStart(10)}${'Navegadores'.padStart(13)}${'Conversaron'.padStart(13)}   Sistemas`);
for (const [k, g] of [...grupos.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const [d, o, de] = k.split('|');
  const sistemas = [...g.sistemas.entries()].sort((a, b) => b[1] - a[1]).map(([s, n]) => `${s} ${n}`).join(', ');
  const pct = g.navegadores.size ? ` (${Math.round((g.conversaron.size / g.navegadores.size) * 100)}%)` : '';
  console.log(`${d.padEnd(12)}${o.padEnd(9)}${de.padEnd(10)}${String(g.aperturas).padStart(10)}${String(g.navegadores.size).padStart(13)}${String(g.conversaron.size).padStart(13)}${pct}   ${sistemas}`);
}
console.log('\nConversaron = navegadores que, después de abrir, tienen conversación: en la web, una fila suya en');
console.log('nexus_conversations; en WhatsApp, una ficha atada a su cookie o a su huella.');
console.log('\n🛑 Desde el 20 oct 2026 el mensaje a WhatsApp no lleva el código del navegador (c:) ni la huella del');
console.log('orbe (w:), y el webhook no ata la ficha de WhatsApp al navegador: en las filas con destino whatsapp,');
console.log('«Conversaron» queda cerca de 0 aunque la gente escriba. Compare con la PRIMERA tabla (aperturas contra');
console.log('«escribieron», por socio y por día); esta solo sirve para las filas con destino web.');
