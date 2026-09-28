/**
 * ¿El detector de videos por intención reconoce las formas en que la gente pide
 * cada video, y deja pasar lo que tiene otra respuesta? (28 sep 2026)
 *
 * Uso: npx tsx scripts/prueba-videos-intencion.mts [--detalle]
 * Llama a Voyage (fracciones de centavo). Exit 1 si alguna frase cae mal.
 * Las frases de aquí NO están entre los ejemplos del detector: medir con los
 * propios ejemplos sería circular.
 */
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { leerIntencionDeVideo, UMBRAL, MARGEN_CONTRASTE, MARGEN_ENTRE_VIDEOS, type VideoIntencion } from '../src/lib/queswa-videos-intencion.ts';

const detalle = process.argv.includes('--detalle');
const CASOS: Array<[string, VideoIntencion | null]> = [
  // Cómo funciona
  ['cómo es que funciona todo esto', 'apertura_sistema'],
  ['me puede explicar el negocio por favor', 'apertura_sistema'],
  ['no me queda claro cómo funciona', 'apertura_sistema'],
  ['como funsiona', 'apertura_sistema'],
  ['explíqueme de qué va esto', 'apertura_sistema'],
  ['y eso cómo funciona?', 'apertura_sistema'],
  // Cómo entra el dinero
  ['y quién es el que paga', 'apertura_dinero'],
  ['de donde sale la plata', 'apertura_dinero'],
  ['cómo es que uno recibe dinero aquí', 'apertura_dinero'],
  ['y la ganancia de dónde viene', 'apertura_dinero'],
  ['cómo me llega el dinero a mí', 'apertura_dinero'],
  ['de dnde sale el dinero', 'apertura_dinero'],
  // Qué debo hacer yo
  ['qué tendría que hacer yo', 'apertura_rol'],
  ['y mi trabajo cuál sería', 'apertura_rol'],
  ['qué hago yo exactamente', 'apertura_rol'],
  ['cómo sería el día a día', 'apertura_rol'],
  ['y a mí qué me tocaría', 'apertura_rol'],
  ['que tengo q hacer yo', 'apertura_rol'],
  ['qué es lo que yo haría', 'apertura_rol'],
  // Tienen otra respuesta
  ['cuánto se gana al mes', null],
  ['cuánto cuesta el paquete', null],
  ['qué tengo que hacer para inscribirme', null],
  ['cuánto tiempo hay que dedicarle', null],
  ['yo no sé vender, ¿igual puedo?', null],
  ['soy médico, ¿esto me sirve?', null],
  ['esto no es una pirámide?', null],
  ['qué es creatuactivo', null],
  ['cuánto vale el café', null],
  ['cómo funciona el binario', null],
  ['cuándo pagan las comisiones', null],
  ['quién paga el envío', null],
  ['qué son los 12 niveles', null],
  ['ok gracias', null],
  ['déjeme lo pienso y le aviso', null],
  ['cómo hago el pedido', null],
  ['quiero empezar hoy', null],
  // más difíciles (segunda pasada)
  ['hola buenas tardes', null],
  ['buenas noches, vengo del enlace de luis-cabrejo', null],
  ['cómo funciona el envío', null],
  ['cómo funciona la garantía de los productos', null],
  ['cuánto le queda a uno por cada cliente', null],
  ['necesito hablar con una persona', null],
  ['me pueden mandar el catálogo', null],
  ['qué pasa si no vendo nada', null],
  ['cómo funciona eso de que el cliente queda a mi nombre', null],
  // «qué hacen ustedes» es la pregunta de WHY_01 (qué es CreaTuActivo), no la del modelo
  ['pero entonces qué es lo que hacen ustedes', null],
  ['en pocas palabras cómo es el negocio', 'apertura_sistema'],
  ['a ver, y uno de qué vive aquí', 'apertura_dinero'],
  // Conocido (28 sep 2026): queda por debajo del umbral y sigue al motor. Subirla con
  // un ejemplo («¿Quién paga las comisiones?») arrastró «¿cuándo pagan las comisiones?».
  ['quién le paga a uno las comisiones', null],
  ['y en la práctica qué tendría que hacer', 'apertura_rol'],
  ['cuál es el trabajo que uno hace', 'apertura_rol'],
  // tercera pasada: frases que el detector no ha visto
  ['explíquemelo fácil, cómo funciona', 'apertura_sistema'],
  ['y la empresa cómo es que opera', 'apertura_sistema'],
  ['de dónde sacan para pagarle a uno', 'apertura_dinero'],
  ['y la plata de las ganancias quién la paga', 'apertura_dinero'],
  ['bueno y yo qué parte haría', 'apertura_rol'],
  ['qué me tocaría hacer a mí en el día', 'apertura_rol'],
  ['cuánto me tocaría invertir', null],
  ['cómo funciona lo del kit de inicio', null],
  ['me interesa pero no tengo plata', null],
  ['y si un cliente no me paga', null],
  ['qué hago si quiero cancelar', null],
];

let fallos = 0;
for (const [frase, esperado] of CASOS) {
  const l = await leerIntencionDeVideo(frase);
  if (!l) { console.log(`❌ ${frase} → sin lectura`); fallos++; continue; }
  const ok = l.video === esperado;
  if (!ok) fallos++;
  const p = l.puntajes;
  const linea = `${ok ? '✅' : '❌'} ${frase.padEnd(40)} → ${String(l.video).padEnd(17)} (esperado ${esperado})  sis ${p.apertura_sistema.puntaje.toFixed(3)} · din ${p.apertura_dinero.puntaje.toFixed(3)} · rol ${p.apertura_rol.puntaje.toFixed(3)} · contraste ${p.contraste.puntaje.toFixed(3)}`;
  console.log(linea);
  if (detalle || !ok) console.log(`      contraste más cercano: «${p.contraste.ejemplo}»`);
}
console.log(`\nUmbral ${UMBRAL} · margen contra contraste ${MARGEN_CONTRASTE} · entre videos ${MARGEN_ENTRE_VIDEOS}`);
console.log(fallos ? `\n❌ ${fallos} de ${CASOS.length} caen mal` : `\n✅ ${CASOS.length} de ${CASOS.length}`);
process.exit(fallos ? 1 : 0);
