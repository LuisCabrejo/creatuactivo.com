/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * ¿La fuente única de normalización se comporta como las nueve copias que
 * reemplazó? (12 sep 2026)
 *
 * Las implementaciones VIEJAS quedan escritas aquí, tal cual estaban en cada
 * archivo, y se enfrentan a las nuevas sobre los casos que muerden: la eñe —que
 * el rango de diacríticos convierte en `n`, a propósito—, el apóstrofo que
 * decide si «O'Brien» queda `obrien` u `o-brien`, la puntuación que en el cotejo
 * duro se vuelve espacio y en el slug se borra, y los espacios dobles.
 *
 * ⚠️ Esto NO prueba que la normalización sea correcta: prueba que NO CAMBIÓ. Si
 * algún día se decide cambiarla a propósito, este arnés debe fallar — y ahí se
 * actualiza a mano, sabiendo exactamente qué se está moviendo.
 *
 *   npx tsx scripts/prueba-normalizacion.mts
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const N = require('../src/lib/texto-normalizar.ts') as typeof import('../src/lib/texto-normalizar');

// Las implementaciones VIEJAS, tal cual estaban en cada archivo.
const viejoSuave = (t: string) => (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const viejoDuro = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const viejoSlug = (t: string) =>
  t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
const viejoSlugGuion = (t: string) =>
  (t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim();
const viejoSinTildes = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const CASOS = [
  '', 'Sí', 'Señora', 'año', 'niño', 'Ganocafé 3 en 1', '¿Cuánto vale?', "María José O'Brien",
  'Liliana  Patricia   Moreno', 'me duele la cabeza', '¡Dale!', 'GANO SCHOKOLADE', 'compañero',
  'Ana-María', 'Café, bebidas y suplementos.', 'dame un aimgane', 'Sii', 'claro que sí',
  'ESP-3 — Visionario · $4.500.000', 'Ñoño', 'ÁÉÍÓÚ àèìòù âêîôû äëïöü ãõ ç',
];

let fallos = 0;
function cmp(nombre: string, viejo: (t: string) => string, nuevo: (t: string) => string) {
  let malos = 0;
  for (const c of CASOS) {
    const a = viejo(c), b = nuevo(c);
    if (a !== b) { console.log(`  ❌ ${nombre} «${c}» → viejo «${a}» · nuevo «${b}»`); malos++; }
  }
  fallos += malos;
  if (!malos) console.log(`  ✅ ${nombre}: ${CASOS.length} casos idénticos`);
}

console.log('\n── La fuente única contra las nueve copias que reemplazó ──');
cmp('cotejo suave', viejoSuave, N.normalizarSuave);
cmp('cotejo duro', viejoDuro, N.normalizarDuro);
cmp('slug', viejoSlug, (t) => N.normalizarParaSlug(t));
cmp('slug con guion', viejoSlugGuion, (t) => N.normalizarParaSlug(t, true));
cmp('solo diacríticos', viejoSinTildes, N.sinDiacriticos);

console.log('\n── Lo que la normalización debe hacer, dicho aparte ──');
const es = (ok: boolean, q: string) => { console.log(`  ${ok ? '✅' : '❌'} ${q}`); if (!ok) fallos++; };
es(N.normalizarSuave('Año') === 'ano', 'la eñe se vuelve n — los patrones se escriben SIN eñe');
es(N.normalizarSuave('¿Sí?') === '¿si?', 'el cotejo suave CONSERVA la puntuación: el «?» es señal');
es(N.normalizarDuro('¿Ganocafé-3en1?') === 'ganocafe 3en1', 'el duro vuelve espacio la puntuación, no la borra');
es(N.normalizarParaSlug("O'Brien") === 'obrien', 'el slug la borra: de eso depende constructor_id');
es(N.normalizarParaSlug('Ana-María', true) === 'ana-maria', 'y conserva el guion cuando se le pide');

console.log(fallos ? `\n❌ ${fallos} fallo(s)\n` : '\n✅ Todo idéntico\n');
process.exit(fallos ? 1 : 0);
