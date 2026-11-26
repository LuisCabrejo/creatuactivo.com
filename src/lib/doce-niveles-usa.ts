/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Los 12 Niveles para Estados Unidos (Director, 26 nov 2026: «para la estrategia de
 * los 12 niveles vamos a usar por defecto 6 cajas»; textos aprobados el mismo día).
 *
 * Los candados de Colombia (NIVELES_01 y NIVELES_02, arsenal_12_niveles) traen la
 * entrada por el Kit de Inicio de cuatro cajas y las cifras en pesos escritas
 * dentro del texto, así que a un prospecto de Estados Unidos le llegaban pesos y un
 * Kit que allá no existe. Un solo arsenal (las copias por país colisionan en el
 * vector): para Estados Unidos el texto exacto lo pone el backend, aquí, y lo usan
 * el conductor (nodos 2.34 y 2.35) y el motor (candado dictado).
 *
 * Las cifras: 6 cajas al mes por distribuidor = 102 PV, unos 115,20 CV (la
 * presentación del liderazgo de EE. UU., knowledge_base/paises/USA_2026.md §7), al
 * 10 % base del Binario. Nivel 12: 8,190 distribuidores, 4,095 pares × 115,20 CV =
 * 471,744 CV emparejados → $47,174.40. Facturación: 8,190 × 6 cajas × $25 (al por
 * mayor) = $1,228,500 → la regalía es el 3.84 %. Es la misma cuenta que la pantalla
 * de los números de /servilleta/estados-unidos.
 *
 * ⚠️ El simulador del Flow de WhatsApp sigue calculando con cuatro cajas (56 CV):
 * por eso en el canal estos nodos no adjuntan la tarjeta del simulador a un número
 * de Estados Unidos. En la web el enlace lleva a la presentación de allá, que ya
 * calcula con 6 cajas.
 */

/** Los fragmentos de Colombia que en Estados Unidos se reemplazan por su texto. */
export const ID_NIVELES_01 = 'arsenal_12_niveles_NIVELES_01';
export const ID_NIVELES_02 = 'arsenal_12_niveles_NIVELES_02';

/** NIVELES_01 para Estados Unidos: qué es la estrategia. */
export const NIVELES_01_US = [
  'La primera duda que suele surgir es si le toca conseguir cientos de clientes usted solo. No: su sistema factura con lo que compran sus clientes, sus distribuidores y los clientes de cada uno de ellos, y de todo eso a usted le queda un porcentaje.',
  '',
  'Los 12 Niveles es nuestra estrategia para construirlo paso a paso. La lógica es la duplicación 2×2: usted conecta mínimo dos distribuidores, ellos conectan a otros dos, y así se multiplica el sistema.',
  '',
  'El ejemplo se calcula con 6 cajas de producto al mes por distribuidor y el 10 % base del Binario.',
  '',
  'Al nivel 12, su sistema llega a 8,190 distribuidores consumiendo, y la regalía mensual supera los **$47,000 USD**: exactamente el 10 % del GCV, el volumen comisionable grupal. Y ese nivel es la base, no el techo.',
].join('\n');

/** La pregunta de cierre de NIVELES_01 en Estados Unidos: ofrece la tabla, que el
 *  «sí» trae dictada (nodo 2.35; la detecta «nivel por nivel»). No ofrece el
 *  simulador del Flow, que calcula con cuatro cajas. */
export const CIERRE_NIVELES_01_US = '¿Le muestro lo que genera la estrategia, nivel por nivel?';

/** NIVELES_02 para Estados Unidos: cómo se gana y la tabla, con 6 cajas al 10 %. */
export const NIVELES_02_US = [
  'En Los 12 Niveles, usted gana a través de la **Regalía de Equipo al 10%**, el porcentaje base del Binario.',
  '',
  '**¿Cómo funciona?**',
  '',
  'Le pagan por todas las compras realizadas en su sistema. En el ejemplo, cada distribuidor consume 6 cajas al mes (unos 115 CV). La compañía empareja cada punto de su canal izquierdo con su equivalente en el canal derecho y le paga el 10% sobre ese volumen, liquidado por ciclos semanales.',
  '',
  '**Proyección con 6 cajas al mes (10%):**',
  '',
  '| Distribuidores consumiendo | CV al mes por lado | Regalía mensual 10% |',
  '|----------------------------|--------------------|---------------------|',
  '| 30 | 1,728 | $172.80 |',
  '| 126 | 7,257.60 | $725.76 |',
  '| 510 | 29,376 | $2,937.60 |',
  '| 2,046 | 117,849.60 | $11,784.96 |',
  '| 8,190 | 471,744 | $47,174.40 |',
  '',
  'Ese tamaño lo construye la duplicación 2×2 — usted conecta mínimo dos, cada uno conecta otros dos — hasta llegar, al nivel 12, a los **8,190 distribuidores**. Con el sistema completo, la regalía mensual supera los **$47,000 USD** (en cifra exacta, $47,174.40: 471,744 CV emparejados al mes, al 10%): no los regala nadie — son el **10% del volumen emparejado** de un sistema que, con sus distribuidores y sus clientes comprando sus 6 cajas al mes, **factura más de $1.2 millones de dólares mensuales** en producto. Su comisión es el **3.84%** de esa facturación.',
  '',
  'Por eso se repite: mientras sus distribuidores y sus clientes sigan comprando, hay comisión; si dejan de comprar, no la hay. La compañía no paga por gente vinculada — paga un porcentaje de lo que se vende.',
  '',
  '**⚠️ Importante:** Estos números son el potencial matemático bajo duplicación perfecta. Las comisiones reales dependen del crecimiento y consumo de su sistema. No son resultados garantizados.',
].join('\n');

/** La pregunta de cierre de NIVELES_02, la misma de Colombia. */
export const CIERRE_NIVELES_02_US = '¿Le muestro las ganancias por la compra de paquetes empresariales en su sistema?';

/** El texto de Estados Unidos que reemplaza un candado de Colombia, con su pregunta
 *  de cierre, o null si ese fragmento no tiene versión de allá. */
export function candadoEstadosUnidos(idFragmento: string): string | null {
  if (idFragmento === ID_NIVELES_01) return `${NIVELES_01_US}\n\n${CIERRE_NIVELES_01_US}`;
  if (idFragmento === ID_NIVELES_02) return `${NIVELES_02_US}\n\n${CIERRE_NIVELES_02_US}`;
  return null;
}

/** Lo que Queswa sabe del Kit en Estados Unidos: allá no existe el Kit de Inicio de
 *  cuatro cajas. La entrada menor es el kit de material de afiliado, $25, sin
 *  producto (Director, 26 nov 2026): dato de referencia, no la entrada de la
 *  estrategia de los 12 niveles. */
export const PIN_KIT_US = `🎒 KIT EN ESTADOS UNIDOS — el material recuperado es de Colombia:
• En Estados Unidos no hay Kit de Inicio de cuatro cajas. Si el contexto lo nombra o trae [PRECIO_KIT], no lo ofrezcas ni lo cotices.
• Las formas de empezar allá son los tres paquetes empresariales: ESP-1 Inicial $205 USD · ESP-2 Empresarial $510 USD · ESP-3 Visionario $1,020 USD.
• Solo si preguntan por la inversión mínima: existe un kit de material de afiliado de $25 USD, sin producto, que abre el código. No es la entrada de la estrategia de los 12 niveles.`;
