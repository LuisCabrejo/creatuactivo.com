/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * ¿Los detectores de ENTRADA aguantan un dedo torpe?
 *
 *   npx tsx scripts/prueba-typos.mts            (exit 1 si EMPEORA)
 *   npx tsx scripts/prueba-typos.mts --detalle  (lista cada deformación)
 *
 * ── POR QUÉ ES UNA LÍNEA BASE Y NO UN APROBADO/FALLIDO ───────────────────────
 *
 * La primera corrida midió **28 deformaciones** que rompen un detector, en 8 de
 * 11 casos. Exigirlos todos hoy dejaría la batería roja desde el primer día, y
 * una batería que siempre falla no la mira nadie. Así que registra el estado que
 * hay y **falla solo si aumenta**: el día que alguien escriba un patrón nuevo
 * que no tolera un typo, esta prueba lo caza en el mismo commit — que es
 * exactamente lo que no pasó con `aimgane` ni con `Redácta`.
 *
 * ⚠️ Al arreglar un detector, BAJE su número aquí. El tope no se sube nunca sin
 * una razón escrita al lado: subirlo es aceptar que una persona reciba silencio
 * por una letra.
 *
 * El generador y su fundamento → scripts/lib/typos.mts
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { typosQueRompen } from './lib/typos.mts';
import { pideImagen, detectarProducto, detectarFamilia } from '../src/lib/wa-productos.ts';
import { detectarPidePieza } from '../src/lib/queswa-conductor.ts';
// ⚠️ `wa-onboarding` se importa con require: tsx lo compila como CommonJS y el
// lexer de Node se detiene en la «ñ» de `notificarDueño`, así que todo export
// posterior en orden alfabético «no existe» para un import con llaves.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { pideEnlaceCatalogo } = require('../src/lib/wa-onboarding.ts') as typeof import('../src/lib/wa-onboarding.ts');
import { esAceptacion } from '../src/lib/wa-pedido.ts';
import { esSoloSaludo } from '../src/lib/wa-apertura.ts';

const DETALLE = process.argv.includes('--detalle');

/** `tope` = deformaciones que hoy rompen el detector. Se BAJA al arreglarlo. */
const CASOS: { nombre: string; fn: (t: string) => unknown; frase: string; llaves: string[]; tope: number; nota?: string }[] = [
  // Los dos que fallaron con personas reales van primero.
  { nombre: 'pideImagen · portafolio', fn: pideImagen, frase: 'dame una imagen de todos los productos', llaves: ['imagen', 'productos'], tope: 0,
    nota: 'el «aimgane» del Director (12 sep) — arreglado con distancia de edición' },
  { nombre: 'pideImagen · foto',       fn: pideImagen, frase: 'quiero la foto del ganocafe', llaves: ['foto'], tope: 1 },
  { nombre: 'detectarProducto · cordygold', fn: detectarProducto, frase: 'cuánto cuesta el cordygold', llaves: ['cordygold'], tope: 0,
    nota: 'arreglado el 12 sep con una segunda pasada por distancia' },
  { nombre: 'detectarProducto · ganocafe',  fn: detectarProducto, frase: 'precio del ganocafe 3 en 1', llaves: ['ganocafe'], tope: 0 },
  { nombre: 'detectarFamilia · bebidas',    fn: detectarFamilia,  frase: 'muéstreme las bebidas', llaves: ['bebidas'], tope: 3 },
  { nombre: 'detectarFamilia · portafolio', fn: detectarFamilia,  frase: 'muéstreme todos los productos', llaves: ['productos'], tope: 3 },
  { nombre: 'detectarPidePieza',       fn: detectarPidePieza,     frase: 'hazme un video para instagram', llaves: ['video', 'hazme'], tope: 7,
    nota: 'el «Redácta» de Patricia (11 sep) sí está cubierto; el verbo y el sustantivo, no' },
  { nombre: 'pideEnlaceCatalogo',      fn: pideEnlaceCatalogo,    frase: 'mándame el catálogo', llaves: ['catálogo'], tope: 3 },
  { nombre: 'esAceptacion',            fn: esAceptacion,          frase: 'sí, claro', llaves: ['claro'], tope: 0 },
  { nombre: 'esSoloSaludo',            fn: esSoloSaludo,          frase: 'buenas tardes', llaves: ['buenas'], tope: 4,
    nota: 'un saludo mal escrito se va al motor en vez de recibir la apertura con botones' },
];

let peor = 0, mejor = 0, base = 0, rotos = 0;
console.log(`🖐️  ¿Los detectores de entrada aguantan un dedo torpe?  (${CASOS.length} casos)\n`);
for (const c of CASOS) {
  if (!c.fn(c.frase)) { console.log(`⚠️  ${c.nombre} — la frase base NO dispara: el caso está mal escrito`); rotos++; continue; }
  const fallos = typosQueRompen(c.fn, c.frase, c.llaves);
  base += c.tope;
  const n = fallos.length;
  const señal = n > c.tope ? '🔴 EMPEORÓ' : n < c.tope ? '🟢 mejoró  ' : n === 0 ? '✅ tolera  ' : '·  igual   ';
  if (n > c.tope) peor++; if (n < c.tope) mejor++;
  console.log(`${señal} ${c.nombre.padEnd(30)} ${n}/${c.tope}${c.nota ? '   — ' + c.nota : ''}`);
  if (DETALLE) for (const f of fallos) console.log(`            · ${f.como.padEnd(16)} «${f.frase}»`);
}
const total = CASOS.reduce((a, c) => a + (c.fn(c.frase) ? typosQueRompen(c.fn, c.frase, c.llaves).length : 0), 0);
console.log(`\n${'─'.repeat(70)}`);
console.log(`deformaciones que rompen un detector: ${total} · línea base: ${base}`);
if (rotos) console.log(`⚠️  ${rotos} caso(s) con la frase base rota — arréglelos, no cuentan como tolerancia`);
if (peor) { console.log(`\n🔴 ${peor} detector(es) EMPEORARON. Un typo nuevo deja a alguien sin respuesta.`); process.exit(1); }
if (mejor) console.log(`\n🟢 ${mejor} detector(es) mejoraron — baje su \`tope\` en este archivo.`);
else console.log('\n✅ Nadie empeoró.');
process.exit(rotos ? 1 : 0);
