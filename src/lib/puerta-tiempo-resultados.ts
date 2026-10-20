/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados. Software propietario y confidencial.
 *
 * La puerta de «¿en cuánto tiempo se ven resultados?» del NEGOCIO (20 oct 2026).
 *
 * El video del día 44 cuenta que Luis trabajaba dos horas por sus sueños al
 * terminar su jornada, y la auditoría del guion preguntó: «¿cuánto se demoró en
 * ver resultados haciéndolo después del trabajo?». La respuesta es `FREQ_04` 🔒
 * (cuándo se ve el primer ingreso), pero «resultados» es también la palabra de
 * la ficha de producto `FAQ_02` («¿cuánto tiempo para notar beneficios?»), que
 * ganaba por 0.017 (0.581 contra 0.564) y el modelo respondía con la energía y
 * el descanso: una pregunta de negocio terminaba en afirmaciones de salud.
 *
 * La llave son tres cosas en el mismo mensaje: el TIEMPO (cuánto se demora, en
 * cuánto tiempo, cuándo empieza), el RESULTADO (resultados, ver plata, el primer
 * ingreso, empezar a ganar) y el NEGOCIO (el trabajo, haciéndolo, el negocio, la
 * plata). Se aparta si el mensaje habla de TOMAR o de sentir un producto: eso es
 * de `FAQ_02` y está bien que lo sea.
 *
 * Casos de tolerancia a typos en `scripts/prueba-typos.mts`.
 */

import { normalizarDuro, normalizarSuave } from './texto-normalizar';
import { detectarProducto } from './wa-productos';

const RE_TIEMPO = /cuanto (tiempo|se demor|demor|tard|se tard|toma)|en cuanto tiempo|cuando (empiez|empez|comienz|se empie|se ve|veo|se ven)|que tan rapido|se demoro|se tardo|demora uno|tarda uno/;
const RE_RESULTADO = /resultado|ver (la )?(plata|dinero|ganancia|ingreso)|ganar|ganancia|retorno|recuper|primer (ingreso|pago)|empez\w* a (ganar|dar|producir|ver)|a dar (plata|dinero|frutos)/;
const RE_NEGOCIO = /negocio|trabajo|haciendolo|haciendo esto|trabajando|despues de la jornada|luis|su empresa|el sistema|plata|dinero|ingreso|ganar|retorno|recuper/;
// Tomar, consumir o sentir: la pregunta es por el producto.
const RE_PRODUCTO = /\btom(a|o|ar|ando|arlo|andolo)\b|consum|\bcafe|capsula|producto|beneficio|cuerpo|energia|salud|sentir|notar|bajar de peso|dormir|descans/;

/** ¿El mensaje pregunta en cuánto tiempo se ven resultados del negocio? */
export function preguntaPorTiempoDeResultados(texto: string): boolean {
  if (typeof texto !== 'string') return false;
  const t = normalizarDuro(normalizarSuave(texto));
  if (!t.trim() || t.length > 220) return false;
  if (RE_PRODUCTO.test(t) || detectarProducto(texto)) return false;
  return RE_TIEMPO.test(t) && RE_RESULTADO.test(t) && RE_NEGOCIO.test(t);
}
