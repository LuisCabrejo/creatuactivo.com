/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados. Software propietario y confidencial.
 *
 * La puerta de «la máquina de ventas» (18 oct 2026).
 *
 * Desde ese día el segundo elemento se llama así en todas partes (Director, tras
 * presentarla en vivo: la gente llega «en seis u ocho»): la Presentación, el
 * candado de `WHY_02` v6.76, el video «Cómo funciona» v6, la Home y el Dashboard.
 * El candado lo dice en su CUERPO, pero el cuerpo no se vectoriza: quien sale de
 * la reunión y le pregunta a Queswa «¿qué es la máquina de ventas?» caía en
 * `WHY_PROD_01` (el producto) o en `COMP_VENTA_01` (la venta al detal), medido
 * con `medir-recuperacion-voyage`.
 *
 * Es PUERTA (`PUERTAS_INICIAL` en route.ts) y no una línea en el índice de
 * `WHY_02` porque el índice se probó primero y DILUYE: con la frase añadida,
 * `WHY_02` ganaba las tres preguntas de la máquina pero perdía dos de las suyas
 * del benchmark de producción («en qué consiste, cómo es que funciona»: 0,543 →
 * 0,503, por debajo de PERFIL_02; «no entiendo de qué se trata el negocio»:
 * 0,597 → 0,550, por debajo de FREQ_21). Hasta la versión corta perdía. La
 * puerta no toca el vector: el término abre `WHY_02` de frente, y se dicta
 * porque el fragmento lleva candado.
 *
 * La llave son dos palabras en orden: «máquina» y, a lo sumo dos palabras
 * después, «venta/ventas» («máquina de ventas», «maquina de venta», «la
 * máquina esa de ventas»). «Máquina» sola NO abre nada: es la de café (Luvoco)
 * o «¿eres una máquina?» (FREQ_01). Las dos palabras toleran un tropiezo del
 * dedo por distancia de edición, con la transposición como un solo error.
 *
 * Casos de tolerancia a typos en `scripts/prueba-typos.mts`.
 */

import { normalizarDuro } from './texto-normalizar';
import { parecida } from './puerta-costo-tecnologia';

export function preguntaPorLaMaquinaDeVentas(texto: string): boolean {
  const palabras = normalizarDuro(texto).split(/[^a-z0-9ñ]+/).filter(Boolean);
  for (let i = 0; i < palabras.length; i++) {
    if (!parecida(palabras[i], ['maquina'])) continue;
    for (let j = i + 1; j <= Math.min(i + 3, palabras.length - 1); j++) {
      if (parecida(palabras[j], ['venta', 'ventas'])) return true;
    }
  }
  return false;
}
