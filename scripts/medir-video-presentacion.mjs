/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * ¿Hasta dónde ven la presentación en video? (2 nov 2026, fase 2 de la auditoría visual)
 *
 * El botón «VER LA PRESENTACIÓN EN VIDEO» de /servilleta reporta el segundo más lejano
 * que vio cada persona y la versión del video (`device_info.presentacion_video`, por
 * /api/track/presentacion). Este script cuenta, por versión, cuántos lo empezaron, qué
 * parte llegó a cada cuarto y en qué pantalla se fueron los que no terminaron.
 *
 *   node scripts/medir-video-presentacion.mjs [--dias 30]
 *
 * ⚠️ Se excluye al socio presentando en vivo (`dispositivo_del_socio`) y a quien es
 * socio (`es_socio`): ellos ruedan el video para otro y no dicen nada de la retención.
 * Solo cuenta /servilleta: el mismo video mandado por WhatsApp como archivo no
 * reporta nada. Con pocas personas por versión (menos de ~30) la diferencia entre
 * dos versiones es ruido: se compara cuando las dos la pasan.
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
import { createClient } from '@supabase/supabase-js';

const i = process.argv.indexOf('--dias');
const dias = i > -1 ? Number(process.argv[i + 1]) : 30;
const desde = new Date(Date.now() - dias * 864e5).toISOString();
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Dónde empieza cada pantalla, por versión (la línea de tiempo que imprime armar.py).
const PANTALLAS = {
  v8: [[0, '1 · credo'], [7.7, '2 · la oportunidad'], [16.7, '3 · los dos sectores'], [25.0, '4 · el dolor'],
    [44.4, '5 · la solución'], [62.5, '5 · los tres elementos'], [82.9, '5 · la unión'], [92.9, '5 · la propiedad'],
    [106.7, '6 · el producto'], [121.7, '7 · la pregunta'], [126.4, '8 · cómo se gana'],
    [135.8, '8 · quien inicia con usted'], [148.4, '8 · los 12 niveles'], [171.5, '8 · el pago'], [178.7, '9 · el cierre']],
};
const pantalla = (v, seg) => {
  const p = PANTALLAS[v];
  if (!p) return '—';
  let n = p[0][1];
  for (const [t, nombre] of p) if (seg >= t) n = nombre;
  return n;
};

const { data, error } = await sb
  .from('prospects')
  .select('fingerprint_id, device_info, updated_at')
  .not('device_info->presentacion_video', 'is', null)
  .gte('updated_at', desde);
if (error) { console.error(error.message); process.exit(1); }

const porVersion = new Map();
let excluidos = 0;
for (const f of data ?? []) {
  const di = f.device_info ?? {};
  if (di.dispositivo_del_socio === true || di.es_socio === true) { excluidos++; continue; }
  const pv = di.presentacion_video;
  if (!pv?.v || !pv.dur) continue;
  if (!porVersion.has(pv.v)) porVersion.set(pv.v, []);
  porVersion.get(pv.v).push({ seg: pv.seg, dur: pv.dur });
}

console.log(`\nLa presentación en video · últimos ${dias} días · ${excluidos} fichas de socio excluidas\n`);
if (!porVersion.size) console.log('Todavía nadie la ha visto con la medición puesta (desde el 2 nov 2026).');
const pct = (n, d) => (d ? `${Math.round((100 * n) / d)} %` : '—');
for (const [v, vistas] of [...porVersion].sort()) {
  const n = vistas.length;
  const llega = (c) => vistas.filter((x) => x.seg / x.dur >= c).length;
  const mediana = [...vistas].map((x) => x.seg).sort((a, b) => a - b)[Math.floor(n / 2)];
  console.log(`${v} · ${n} personas lo empezaron · mediana ${Math.floor(mediana / 60)}:${String(mediana % 60).padStart(2, '0')}`);
  console.log(`   25 %: ${pct(llega(0.25), n)}   50 %: ${pct(llega(0.5), n)}   75 %: ${pct(llega(0.75), n)}   95 %: ${pct(llega(0.95), n)}`);
  // Dónde se fue quien no llegó al 95 %.
  const salidas = new Map();
  for (const x of vistas) if (x.seg / x.dur < 0.95) salidas.set(pantalla(v, x.seg), (salidas.get(pantalla(v, x.seg)) ?? 0) + 1);
  if (salidas.size) {
    console.log('   se fueron en:');
    const orden = (PANTALLAS[v] ?? []).map((p) => p[1]);
    for (const [p, k] of [...salidas].sort((a, b) => orden.indexOf(a[0]) - orden.indexOf(b[0]))) console.log(`     ${p.padEnd(28)} ${k}`);
  }
  console.log('');
}
