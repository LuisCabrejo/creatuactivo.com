/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * ¿En qué paso de la presentación se va la gente? (6 nov 2026)
 *
 * Los hitos de /servilleta (pantallas 4, 6 y 9) no ven dentro de la pantalla 5, que
 * tiene diez beats, ni de la 8, que tiene tres, y entre los hitos 4 y 6 era donde se
 * iba la gente (5 de 22 en los 60 días anteriores). Desde el 6 nov 2026 la página
 * guarda el paso más lejano, beat incluido (`device_info.presentacion_paso`, por
 * /api/track/presentacion). Este script cuenta en qué paso se quedó cada persona.
 *
 *   node scripts/medir-avance-presentacion.mjs [--dias 30]
 *
 * ⚠️ Se excluye al socio presentando en vivo (`dispositivo_del_socio`) y a quien es
 * socio (`es_socio`). Quien rueda el video salta a la pantalla 9 al terminarlo: se
 * cuenta aparte, porque su paso no dice qué pantallas del deck pasó.
 * Con unas 11 personas al mes, esto dice dónde se va la gente, no qué versión gana.
 * Si cambian los beats de la pantalla 5 o de la 8, se actualiza PASOS.
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
import { createClient } from '@supabase/supabase-js';

const i = process.argv.indexOf('--dias');
const dias = i > -1 ? Number(process.argv[i + 1]) : 30;
const desde = new Date(Date.now() - dias * 864e5).toISOString();
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Los pasos del deck, en orden (BEATS en src/app/servilleta/page.tsx, 6 nov 2026).
const PASOS = [
  [1, 0, '1 · en qué creemos'],
  [2, 0, '2 · la oportunidad'],
  [3, 0, '3 · dos sectores'],
  [4, 0, '4 · el dolor, en cifras'],
  [5, 0, '5.0 · la solución'],
  [5, 1, '5.1 · un fabricante'],
  [5, 2, '5.2 · una máquina de ventas'],
  [5, 3, '5.3 · una herramienta'],
  [5, 4, '5.4 · las tres quietas'],
  [5, 5, '5.5 · la unión (Queswa.app)'],
  [5, 6, '5.6 · su día: compartir'],
  [5, 7, '5.7 · su día: Queswa'],
  [5, 8, '5.8 · su día: recibir'],
  [5, 9, '5.9 · la diferencia (propiedad)'],
  [6, 0, '6 · el producto'],
  [7, 0, '7 · la pregunta'],
  [8, 0, '8.0 · cómo se gana'],
  [8, 1, '8.1 · los 12 niveles'],
  [8, 2, '8.2 · el bono GEN5'],
  [9, 0, '9 · el siguiente paso'],
];
const nombre = (p) => PASOS.find(([s, b]) => s === p.pantalla && b === p.beat)?.[2] ?? `${p.pantalla}.${p.beat} · (fuera del mapa)`;
const orden = (p) => p.pantalla * 100 + p.beat;

const { data, error } = await sb
  .from('prospects')
  .select('device_info, updated_at')
  .not('device_info->presentacion_paso', 'is', null)
  .gte('updated_at', desde);
if (error) { console.error(error.message); process.exit(1); }

const pasos = [];
let excluidos = 0, conVideo = 0, wa = 0;
for (const f of data ?? []) {
  const di = f.device_info ?? {};
  if (di.dispositivo_del_socio === true || di.es_socio === true) { excluidos++; continue; }
  const p = di.presentacion_paso;
  if (!Number.isInteger(p?.pantalla) || !Number.isInteger(p?.beat)) continue;
  // Vio el video hasta el final: el deck saltó a la 9 sin pasar por las demás.
  const v = di.presentacion_video;
  if (v?.dur && v.seg / v.dur >= 0.95) { conVideo++; continue; }
  if (di.presentacion_whatsapp === true) wa++;
  pasos.push(p);
}

console.log(`\nEl avance en la presentación · últimos ${dias} días · ${excluidos} fichas de socio excluidas`);
console.log(`${conVideo} vieron el video completo (no cuentan abajo)\n`);
if (!pasos.length) {
  console.log('Todavía nadie la ha pasado con la medición puesta (desde el 6 nov 2026).');
  process.exit(0);
}
const n = pasos.length;
console.log(`${n} personas pasaron el deck · ${wa} tocaron el WhatsApp del final\n`);
console.log('  se quedó en                          personas   siguen después');
let restantes = n;
for (const [s, b, rotulo] of PASOS) {
  const aqui = pasos.filter((p) => p.pantalla === s && p.beat === b).length;
  restantes -= aqui;
  if (!aqui) continue;
  console.log(`  ${rotulo.padEnd(36)} ${String(aqui).padStart(3)}        ${Math.round((100 * (restantes)) / n)} %`);
}
const fuera = pasos.filter((p) => !PASOS.some(([s, b]) => s === p.pantalla && b === p.beat));
for (const p of fuera.sort((a, b) => orden(a) - orden(b))) console.log(`  ${nombre(p)}`);
console.log('');
