/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Los gestos como respuesta (Director, 11 oct 2026) — sin red.
 *
 *   npx tsx scripts/prueba-gestos.mts
 *
 * Qué emojis cuentan como «sí» y a qué preguntas responde un gesto. Los casos
 * son los textos reales con que terminaron Adazuni (10 oct) y Cifuentes (16 sep).
 */
import { gestoAfirma, preguntaFinalSiNo } from '../src/lib/wa-gestos';

let fallas = 0;
const es = (cond: boolean, nombre: string) => {
  console.log(`${cond ? '✅' : '❌'} ${nombre}`);
  if (!cond) fallas++;
};

console.log('── 1. Qué gestos asienten ──');
for (const e of ['👍', '👍🏽', '❤️', '🙏', '🙏🏻', '👌', '✅', '🙌', '😊', '🔥', '😂', '💯'])
  es(gestoAfirma('reaction', e), `${e} es un sí`);
for (const e of ['👎', '👎🏿', '😡', '😢', '🤔', '🙄', '❌'])
  es(!gestoAfirma('reaction', e), `${e} no es un sí`);
es(!gestoAfirma('reaction', ''), 'una reacción retirada (emoji vacío) no es un sí');
es(gestoAfirma('sticker'), 'un sticker cuenta como sí');

console.log('\n── 2. A qué preguntas responde un gesto ──');
const siNo = [
  // Adazuni, 10 oct
  '¿Le muestro cómo crece ese porcentaje sin que le toque conseguir a todos los clientes usted?',
  'Lo de antes.\n\n¿Quiere verlo en el simulador, con la cifra de cada nivel?',
  'Esa comisión le entra a medida que se compran los paquetes.\n\n¿Le detallo exactamente qué productos trae el paquete Inicial?',
  '¿Le muestro las ganancias por la compra de paquetes empresariales en su sistema?',
  '¿Le muestro el catálogo completo con precios?',
];
for (const t of siNo) es(!!preguntaFinalSiNo(t), `sí/no: «${t.split('\n').pop()}»`);

const noSiNo = [
  'Pregunte lo que quiera, sin ningún afán. ¿Por dónde prefiere empezar?',
  '¿Con cuál de los tres paquetes se identifica más?',
  '¿Qué inquietud quiere que le ayude a resolver?',
  '¿Cómo se llama?',
  '¿Lo hablamos mañana, o en dos días?',
  'Juegue con los números y arme el escenario que prefiera.',
  'Arme el escenario que quiera ver: el resultado sale al instante. [Simulador enviado]',
];
for (const t of noSiNo) es(!preguntaFinalSiNo(t), `no responde: «${t.split('\n').pop()}»`);

console.log(fallas ? `\n❌ ${fallas} falla(s)` : '\n✅ Todo en verde');
process.exit(fallas ? 1 : 0);
