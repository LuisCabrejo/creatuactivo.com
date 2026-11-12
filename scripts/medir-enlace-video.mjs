/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * ¿Cuánta gente abre el enlace directo al video, y cuánta lo ve? (12 nov 2026, Director)
 *
 * `creatuactivo.com/{slug}/video` es el enlace que va en el pie de una publicación
 * («le dejo un video de cuatro minutos»): abre la Presentación con el video ya en
 * ventana. Deja dos rastros, y este script lee los dos:
 *
 *   1. LA APERTURA — una fila en `page_visits` por cada vez que alguien abre el
 *      enlace (page_entry `/{slug}/video`), con el socio, el dispositivo y la cookie
 *      del navegador. La escribe src/app/[slug]/[destino]/page.tsx.
 *   2. EL VIDEO — la ficha de quien lo empezó llegando por el enlace lleva
 *      `device_info.presentacion_video.enlace = true`, con el segundo más lejano que
 *      vio. La escribe /api/track/presentacion.
 *
 *   node scripts/medir-enlace-video.mjs [--dias 7]
 *
 * ⚠️ Una apertura no es una persona: quien toca dos veces cuenta dos; por eso va
 * también la cuenta de navegadores (la cookie). Sin cookie, la apertura se cuenta
 * pero no se distingue de otra.
 * ⚠️ Las dos tablas no se cruzan persona por persona: la primera va por socio y por
 * día; la segunda es el total del periodo. Quien abre y no toca «Ver el video» está
 * en la primera y no en la segunda: esa diferencia es lo que se mide.
 * ⚠️ Se excluyen las fichas de socios (`es_socio`, `dispositivo_del_socio`), como en
 * medir-video-presentacion.mjs. Quien vio el video por el botón de la pantalla 1 no
 * entra aquí: ese total lo da medir-video-presentacion.mjs.
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
import { createClient } from '@supabase/supabase-js';

const i = process.argv.indexOf('--dias');
const dias = i > -1 ? Number(process.argv[i + 1]) : 7;
const desde = new Date(Date.now() - dias * 864e5).toISOString();
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const dia = (t) => new Date(t).toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
const pct = (n, d) => (d ? `${Math.round((100 * n) / d)} %` : '—');

// ── 1. Las aperturas, por día y por socio ───────────────────────────────────
const { data: visitas, error: e1 } = await sb
  .from('page_visits')
  .select('mentor_ref_id, page_entry, timestamp, dispositivo, visitante')
  .like('page_entry', '%/video')
  .gte('timestamp', desde);
if (e1) { console.error(e1.message); process.exit(1); }

const filas = new Map();
const navegadores = new Set();
let total = 0;
for (const v of visitas ?? []) {
  if (!/^\/[^/]+\/video$/.test(v.page_entry ?? '')) continue;
  total++;
  const k = `${dia(v.timestamp)} · ${v.mentor_ref_id}`;
  const f = filas.get(k) ?? { aperturas: 0, navegadores: new Set(), sinCookie: 0, celular: 0 };
  f.aperturas++;
  if (v.visitante) { f.navegadores.add(v.visitante); navegadores.add(v.visitante); } else f.sinCookie++;
  if (v.dispositivo && v.dispositivo !== 'computador') f.celular++;
  filas.set(k, f);
}

console.log(`\nEl enlace directo al video (/{slug}/video) · últimos ${dias} días\n`);
console.log('1. Aperturas, por día y por socio');
if (!filas.size) console.log('   Todavía nadie lo ha abierto con la medición puesta (desde el 12 nov 2026).');
else {
  console.log(`   ${'día · socio'.padEnd(40)} aperturas  navegadores  celular/tableta`);
  for (const [k, f] of [...filas].sort()) {
    console.log(`   ${k.padEnd(40)} ${String(f.aperturas).padStart(9)}  ${String(f.navegadores.size + f.sinCookie).padStart(11)}  ${String(f.celular).padStart(15)}`);
  }
  console.log(`   Total: ${total} aperturas · ${navegadores.size} navegadores con cookie`);
}

// ── 2. Quién empezó el video llegando por el enlace, y hasta dónde lo vio ────
const { data: fichas, error: e2 } = await sb
  .from('prospects')
  .select('fingerprint_id, device_info, updated_at')
  .not('device_info->presentacion_video', 'is', null)
  .gte('updated_at', desde);
if (e2) { console.error(e2.message); process.exit(1); }

const vistas = [];
for (const f of fichas ?? []) {
  const di = f.device_info ?? {};
  if (di.dispositivo_del_socio === true || di.es_socio === true) continue;
  const pv = di.presentacion_video;
  if (pv?.enlace !== true || !pv.dur) continue;
  vistas.push({ seg: pv.seg ?? 0, dur: pv.dur });
}
const n = vistas.length;
const llega = (c) => vistas.filter((x) => x.seg / x.dur >= c).length;
console.log('\n2. El video, para quien llegó por el enlace');
if (!n) console.log('   Todavía nadie lo ha empezado por el enlace.');
else {
  const mediana = vistas.map((x) => x.seg).sort((a, b) => a - b)[Math.floor(n / 2)];
  console.log(`   ${n} personas lo empezaron · mediana ${Math.floor(mediana / 60)}:${String(mediana % 60).padStart(2, '0')}`);
  console.log(`   25 %: ${pct(llega(0.25), n)}   50 %: ${pct(llega(0.5), n)}   75 %: ${pct(llega(0.75), n)}   95 %: ${pct(llega(0.95), n)}`);
  if (navegadores.size) console.log(`   De ${navegadores.size} navegadores que abrieron el enlace, lo empezaron ${n} (${pct(n, navegadores.size)}).`);
  if (n < 30) console.log('   Con menos de ~30 personas, estos porcentajes son ruido.');
}
console.log('');
