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
import { detectarPidePieza, declaraPerfil, RE_PREGUNTA_EMPRESA_GANO, RE_OBJECION_PRESUPUESTO, RE_YA_SE_INSCRIBIO, preguntaCuantoCubreLaCompra, preguntaPorModoWaze, RE_TENGO_CODIGO, RE_ACTIVO_EN_GANO, RE_CAMBIO_DE_EQUIPO } from '../src/lib/queswa-conductor.ts';
import { mencionaElReto } from '../src/lib/puerta-reto.ts';
import { paqueteParaNivelesSocio, pasoNivelesSocio } from '../src/lib/wa-simulador.ts';
import { detectarPideAcceso, detectarDistribuidorQuiereActivarse } from '../src/lib/wa-activacion-distribuidor.ts';
// ⚠️ `wa-onboarding` se importa con require: tsx lo compila como CommonJS y el
// lexer de Node se detiene en la «ñ» de `notificarDueño`, así que todo export
// posterior en orden alfabético «no existe» para un import con llaves.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { pideEnlaceCatalogo, detectarPideFuncionDashboard, esSoloAgradecimiento } = require('../src/lib/wa-onboarding.ts') as typeof import('../src/lib/wa-onboarding.ts');
import { esAceptacion, detectarPidePersona, detectarPreguntaCharla, detectarIntencionCompra } from '../src/lib/wa-pedido.ts';
import { RE_ACEPTACION_PELADA } from '../src/lib/wa-radicacion.ts';
import { esSoloSaludo, vieneDelVideoComoFunciona, vieneDelVideoDoceNiveles, videoDeReelVisto, niegaHaberVistoVideo } from '../src/lib/wa-apertura.ts';

// El patrón de la gerente del hogar vive en `patrones_inicial` de route.ts (el
// benchmark del clasificador solo lee literales de ahí); se lee por su comentario.
import { readFileSync } from 'node:fs';
const RE_HOGAR = (() => {
  const m = readFileSync('src/app/api/nexus/route.ts', 'utf8')
    .match(/PERFIL_03 — gerente del hogar[\s\S]*?\n\s*\/((?:[^/\\\n]|\\.)+)\/([gimsuy]*)\s*,/);
  if (!m) throw new Error('No se encontró el patrón PERFIL_03 en route.ts');
  return new RegExp(m[1], m[2]);
})();

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
  { nombre: 'aceptación pelada · porfavor', fn: (t) => RE_ACEPTACION_PELADA.test(t.trim()), frase: 'si porfavor', llaves: ['porfavor'], tope: 4,
    nota: 'el «Si porfavor» de Isabella (22 sep) cayó al CQR y recibió la tabla de suplementos — la cola `por\\s?fa[a-z]*` cubre porfa/porfavor/por favor; misma cola en `_aceptacionPelada` de route.ts' },
  { nombre: 'esSoloAgradecimiento', fn: esSoloAgradecimiento, frase: 'muchas gracias', llaves: ['gracias', 'muchas'], tope: 6,
    nota: 'nodo 1.393: el socio que agradece recibe una cortesía, no una tarea (6 oct 2026)' },
  { nombre: 'preguntaPorModoWaze', fn: preguntaPorModoWaze, frase: 'qué es el modo waze', llaves: ['waze', 'modo'], tope: 3,
    nota: 'nodos 1.392 (socio) y 2.235 (prospecto), 5 oct 2026' },
  { nombre: 'detectarPideFuncionDashboard', fn: detectarPideFuncionDashboard, frase: 'redáctame un mensaje para dueños de restaurantes', llaves: ['redáctame', 'restaurantes'], tope: 3,
    nota: 'el mensaje para un NEGOCIO va al Centro de Mando; el de una persona se queda (16 sep 2026)' },
  { nombre: 'esSoloSaludo',            fn: esSoloSaludo,          frase: 'buenas tardes', llaves: ['buenas'], tope: 4,
    nota: 'un saludo mal escrito se va al motor en vez de recibir la apertura con botones' },
  { nombre: 'declaraPerfil · empresario', fn: declaraPerfil, frase: 'ya tengo un negocio propio y me va bien', llaves: ['negocio'], tope: 0,
    nota: 'si no dispara, al empresario le sale la respuesta escrita para quien no tiene negocio (23 sep 2026)' },
  { nombre: 'declaraPerfil · freelance',  fn: declaraPerfil, frase: 'soy independiente, para qué me sirve', llaves: ['independiente'], tope: 0 },
  { nombre: 'mencionaElReto',          fn: mencionaElReto,        frase: 'cómo va el reto de Luis', llaves: ['reto'], tope: 0 },
  { nombre: 'detectarPidePersona · reunión', fn: detectarPidePersona, frase: 'quiero una reunión para saber cómo iniciar', llaves: ['reunión', 'quiero'], tope: 1,
    nota: 'pedir una reunión es pedir una persona — el video del día 15 dice que Luis se reúne con interesados (21 sep 2026)' },
  { nombre: 'detectarPreguntaCharla',   fn: detectarPreguntaCharla, frase: 'dónde da esas charlas', llaves: ['charlas', 'dónde'], tope: 0,
    nota: 'las charlas de Luis: dónde viven y aviso al socio (21 sep 2026)' },
  { nombre: 'pregunta empresa · gano excel', fn: (t) => RE_PREGUNTA_EMPRESA_GANO.test(t), frase: 'gano excel que es? que productos venden', llaves: ['excel'], tope: 0,
    nota: 'la mitad de empresa de la pregunta mixta antepone las credenciales al candado de WHY_PROD_01 (27 sep 2026); tolera exel/ecxel' },
  { nombre: 'vieneDelVideoComoFunciona', fn: vieneDelVideoComoFunciona, frase: 'Hola Queswa, vengo del enlace de luis-cabrejo. Ya vi el video de cómo funciona.', llaves: ['video', 'funciona'], tope: 7,
    nota: 'el texto lo pre-llena el enlace del reel (28 sep 2026); solo importa si la persona lo edita' },
  { nombre: 'vieneDelVideoDoceNiveles', fn: vieneDelVideoDoceNiveles, frase: 'Hola Queswa, vengo del enlace de luis-cabrejo. Ya vi el video de los 12 niveles.', llaves: ['video', 'niveles'], tope: 7,
    nota: 'ídem, enlace del reel de los 12 Niveles (28 sep 2026)' },
  { nombre: 'videoDeReelVisto · dinero', fn: (t) => videoDeReelVisto(t) === 'apertura_dinero', frase: 'Hola Queswa, vengo del enlace de luis-cabrejo. Ya vi el video de cómo entra el dinero.', llaves: ['video', 'dinero'], tope: 7,
    nota: 'lo pre-llena el enlace del reel (28 sep 2026); solo importa si la persona lo edita' },
  { nombre: 'niegaHaberVistoVideo', fn: niegaHaberVistoVideo, frase: 'no he visto el video', llaves: ['visto', 'video'], tope: 0,
    nota: 'tras llegar por un reel sin ver el video (28 sep 2026): «no lo he visto», «¿cuál video?»' },
  { nombre: 'videoDeReelVisto · rol', fn: (t) => videoDeReelVisto(t) === 'apertura_rol', frase: 'Hola Queswa, vengo del enlace de luis-cabrejo. Ya vi el video de qué debo hacer yo.', llaves: ['video', 'hacer'], tope: 7,
    nota: 'lo pre-llena el enlace del reel (28 sep 2026); solo importa si la persona lo edita' },
  { nombre: 'clasificador · ama de casa', fn: (t) => RE_HOGAR.test(t), frase: 'soy ama de casa', llaves: ['casa', 'ama'], tope: 0,
    nota: 'PERFIL_03 (28 sep 2026): sin patrón, el CQR la mandaba a WHY_01' },
  { nombre: 'clasificador · gerente del hogar', fn: (t) => RE_HOGAR.test(t), frase: 'soy gerente del hogar', llaves: ['hogar', 'gerente'], tope: 0 },
  { nombre: 'objeción de presupuesto', fn: (t) => RE_OBJECION_PRESUPUESTO.test(t), frase: 'eso afecta mi presupuesto', llaves: ['presupuesto', 'afecta'], tope: 0,
    nota: 'la objeción baja el candado a material (Yesid, 29 sep 2026); si no dispara, se dicta «Claro que sí… ¿Le ayudo a abrir su código?»' },
  { nombre: 'detectarIntencionCompra · montar', fn: detectarIntencionCompra, frase: 'quiero montar un pedido', llaves: ['montar', 'pedido'], tope: 8,
    nota: 'Ru, 28 sep 2026: si no dispara, quien vino a comprar recibe el video del negocio y nadie avisa al socio' },
  { nombre: 'ya se inscribió antes → NET_02', fn: (t) => RE_YA_SE_INSCRIBIO.test(t), frase: 'me inscribí en una ocasión pero no desarrollé el negocio', llaves: ['inscribí', 'ocasión'], tope: 6,
    nota: 'Eduardo, 29 sep 2026: si no dispara, se le dicta «usted ya logró que su negocio funcione»' },
  { nombre: 'cuánto cubre la compra (2.50)', fn: preguntaCuantoCubreLaCompra, frase: 'cuánto tengo que vender para pagar mi caja', llaves: ['vender', 'pagar', 'caja'], tope: 8,
    nota: 'Yesid, 29 sep 2026: si no dispara, el modelo inventa los sobres y la regla del ingreso' },
  { nombre: 'niveles a la tarifa del paquete (2.221, socio)', fn: (t) => paqueteParaNivelesSocio(t, ''), frase: 'la misma tabla con el visionario', llaves: ['tabla', 'visionario'], tope: 3,
    nota: 'Miguel Barahona, 1 oct 2026: si no dispara, el modelo compone la tabla y el guardarraíl la bloquea' },
  { nombre: 'la estrategia → el video (2.222, socio)', fn: (t) => pasoNivelesSocio(t, '', false) === 'video', frase: 'dame la estrategia de los doce niveles', llaves: ['estrategia', 'doce', 'niveles'], tope: 0,
    nota: 'el Director, 2 oct 2026: pidió la estrategia y recibió el texto compuesto en vez del video' },
  { nombre: 'la estrategia en detalle (2.223, socio)', fn: (t) => pasoNivelesSocio(t, '', false) === 'detalle', frase: 'los doce niveles en detalle', llaves: ['doce', 'niveles', 'detalle'], tope: 0 },
  { nombre: 'el socio pide su acceso (2.226)', fn: detectarPideAcceso, frase: 'mándeme el acceso a queswa.app', llaves: ['mándeme', 'acceso'], tope: 0,
    nota: 'Miguel Barahona, 3 oct 2026: si no dispara, el modelo compone que el equipo ya se lo envió' },
  { nombre: 'distribuidor del socio quiere activarse (2.225)', fn: (t) => detectarDistribuidorQuiereActivarse(t, ''), frase: 'tiene código conmigo y quiere trabajar', llaves: ['código', 'conmigo', 'quiere'], tope: 0,
    nota: 'Carolina, 3 oct 2026: si no dispara, su distribuidora recibe la invitación de frío con el enlace de prospecto' },
  { nombre: 'ya tiene su código (2.51)', fn: (t) => RE_TENGO_CODIGO.test(t), frase: 'ya soy distribuidor, tengo mi codigo', llaves: ['tengo', 'codigo'], tope: 0,
    nota: 'Aldo Moller, 6 oct 2026: si no dispara, Queswa supone la compañía y le vende el paquete' },
  { nombre: 'activo en Gano con otro equipo (2.51a)', fn: (t) => RE_ACTIVO_EN_GANO.test(t), frase: 'estoy en gano con otro equipo', llaves: ['estoy', 'gano', 'equipo'], tope: 0 },
  { nombre: 'cambiarse de equipo (2.51c)', fn: (t) => RE_CAMBIO_DE_EQUIPO.test(t), frase: 'me puedo pasar a su equipo', llaves: ['puedo', 'pasar', 'equipo'], tope: 0,
    nota: 'si no dispara, el modelo compone la regla de traslado' },
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
