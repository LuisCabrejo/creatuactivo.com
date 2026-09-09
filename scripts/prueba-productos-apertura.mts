/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La página de productos abre como asesora, y Queswa no redacta piezas
 * publicitarias desde el canal (decisiones del Director, 9 sep 2026). `npx tsx`.
 *
 *   npx tsx scripts/prueba-productos-apertura.mts        (exit 1 si falla)
 *
 * Reproduce los primeros mensajes reales de Liliana y Patricia (el texto del
 * orbe de /productos con el ref de ganocafe-online), los dos copys aprobados,
 * el «sí» a la oferta del portafolio, y los cuatro pedidos de piezas de Patricia
 * contra lo que NO es una pieza: la presentación del producto y el mensaje
 * personal que el socio le pide a Queswa para un amigo.
 */
import {
  vieneDeProductos, preguntaTrasOrbeProductos, construirAperturaProductos, aperturaRetornoProductos,
  APERTURA_PRODUCTOS_OPCIONES,
} from '../src/lib/wa-apertura.ts';
import { atenderFoto, atenderPidePieza, detectarPidePieza, TEXTO_NO_PIEZAS } from '../src/lib/queswa-conductor.ts';
import { familiaOfrecida } from '../src/lib/wa-productos.ts';
import { detectarClaimSaludEnSalida } from '../src/lib/wa-guardarrail-salud.ts';

let fallos = 0;
const es = (cond: boolean, m: string) => { console.log(`${cond ? '✅' : '❌'} ${m}`); if (!cond) fallos++; };

console.log('\n── 1. Llegar desde /productos ──');
const LILIANA = 'Hola Queswa, vengo del enlace de ganocafe-online-1716. Quiero preguntar por los productos.';
const PATRICIA = 'Hola Queswa, vengo del enlace de ganocafe-online-1716. Quiero preguntar por los productos. quiero saber qué producto me rcomendarías para hacer una limpieza a mi organismo con los productos, ¿qué me recomiendas hacer? Gracias';
const SIN_REF = 'Hola Queswa, quiero preguntar por los productos';
es(vieneDeProductos(LILIANA) && vieneDeProductos(PATRICIA) && vieneDeProductos(SIN_REF), 'los tres textos del orbe se reconocen');
es(!vieneDeProductos('Hola Queswa, vengo del enlace de luis-cabrejo'), 'el enlace general NO es la página de productos');
es(preguntaTrasOrbeProductos(LILIANA) === '', 'Liliana no trae pregunta detrás → apertura dictada');
es(preguntaTrasOrbeProductos(PATRICIA).startsWith('quiero saber qué producto'), 'Patricia trae pregunta detrás → responde el motor en modo asesora');

console.log('\n── 2. Los copys aprobados ──');
const APERTURA = construirAperturaProductos('Luis Cabrejo Parra', undefined);
es(APERTURA === 'Hola. Un gusto saludarle.\n\nSoy Queswa, la inteligencia artificial que asiste a Luis Cabrejo. Atiendo a cientos de personas, las 24 horas.\n\nAquí puede preguntar lo que quiera de los productos: qué lleva cada uno, cómo se prepara, en qué presentación viene y cuánto cuesta. La línea es de Gano Excel, con extracto propio de Ganoderma y registro sanitario en cada producto.\n\n¿Le muestro el portafolio completo?', 'apertura nueva = copy aprobado');
es(aperturaRetornoProductos('Liliana') === 'Qué bueno que vuelva, Liliana. Aquí sigo con su conversación, y ahora vamos con los productos. ¿Le muestro el portafolio completo?', 'retorno = copy aprobado');
es(APERTURA_PRODUCTOS_OPCIONES.length === 2 && APERTURA_PRODUCTOS_OPCIONES.every((o) => o.title.length <= 20), 'dos botones, cada título cabe en los 20 caracteres de Meta');
es(!detectarClaimSaludEnSalida(APERTURA) && !detectarClaimSaludEnSalida(TEXTO_NO_PIEZAS), 'los textos pasan el filtro de salud');

console.log('\n── 3. El «sí» a la oferta del portafolio ──');
for (const oferta of [APERTURA, aperturaRetornoProductos('Liliana'), TEXTO_NO_PIEZAS]) {
  es(familiaOfrecida(oferta) === 'portafolio', `la oferta se reconoce: «${oferta.trim().split('\n').pop()}»`);
  const foto = atenderFoto('Sí', [{ role: 'assistant', content: oferta }]);
  es(!!foto && /portafolio/i.test(foto.url) && foto.cierraTurno, '«Sí» → imagen del portafolio, turno cerrado');
}
es(familiaOfrecida('¿Le muestro el catálogo completo con precios?') === null, 'la oferta del catálogo NO es el portafolio');

console.log('\n── 4. Las piezas publicitarias ──');
for (const t of [
  'puedes  hacerme un video publicitario para poner en mis estados de whats app, que suene atractivo y ganador para que la gente se una al proyecto?',
  'armeme el guión',
  'puedes crear una diapositiva?',
  'armeme ese contenido por favor',
  'necesito un flyer de los productos',
  'hazme un post para instagram',
]) es(detectarPidePieza(t), `pieza: «${t.slice(0, 60)}»`);
for (const t of [
  '¿en qué presentación viene?',
  'redáctame un mensaje para mi amigo Andrés, tiene una ferretería',
  'quiero ver el video del reel',
  '¿hay un video que explique el negocio?',
  'me interesa el café, ¿cuánto vale?',
  'Cómo funciona',
]) es(!detectarPidePieza(t), `NO es pieza: «${t}»`);
es(atenderPidePieza('armeme el guión')?.texto === TEXTO_NO_PIEZAS, 'el nodo dicta el texto aprobado');

console.log(fallos ? `\n❌ ${fallos} fallo(s)` : '\n✅ Todo en verde');
process.exit(fallos ? 1 : 0);
