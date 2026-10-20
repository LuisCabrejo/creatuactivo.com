/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados. Software propietario y confidencial.
 *
 * La puerta de «¿con cuánta plata se arranca?» (20 oct 2026).
 *
 * El video del día 43 preguntó en voz alta «¿a qué horas y con qué plata?», y la
 * pregunta vuelve escrita de mil maneras: «con cuánta plata se arranca», «cuánto
 * necesito para empezar», «con cuánto dinero inicio». La respuesta es `FREQ_03`
 * —las cuatro formas de empezar, con su precio—, y hasta hoy llegaba solo si el
 * vector acertaba: ninguna puerta la abría con la palabra «plata» ni con
 * «arrancar», y `preguntaSoloPorPrecio` tampoco la reconocía, así que el turno
 * quedaba expuesto a los pines de comisión.
 *
 * La llave son dos cosas en el mismo mensaje: el DINERO (plata, dinero, capital,
 * inversión… o un «cuánto» a secas) y el ARRANQUE (arrancar, empezar, iniciar,
 * vincularse…). Las dos toleran el dedo torpe con la misma distancia de
 * `puerta-costo-tecnologia.ts`.
 *
 * ⚠️ Cuatro trampas que la llave evita:
 *  · «¿Cuánta plata le entra a uno?» pregunta por la GANANCIA: «entra» está a una
 *    letra de «entrar» y se excluye por nombre.
 *  · «¿Con cuánto empiezo a ganar?» y «¿cuánto se gana al arrancar?» son de
 *    compensación: cualquier palabra de ganancia cierra la puerta.
 *  · «¿Cuánto tiempo toma arrancar?» o «¿cuántas personas necesito para
 *    empezar?» no preguntan por plata.
 *  · Si nombra un producto, pregunta por ESE precio, que tiene su respuesta.
 *
 * Casos de tolerancia a typos en `scripts/prueba-typos.mts`.
 */

import { normalizarDuro, normalizarSuave } from './texto-normalizar';
import { parecida } from './puerta-costo-tecnologia';
import { detectarProducto } from './wa-productos';

// «Inversión» e «invertir» admiten dos tropiezos; las demás, uno.
const DINERO = ['plata', 'platica', 'dinero', 'capital', 'presupuesto', 'billete', 'monto'];
// Lo que cuesta, dicho sin «plata». «Vale» y «sale» no van: solas son «de
// acuerdo» y «resulta», y con «cuánto» al lado ya entran.
const COSTO_EXACTO = ['cuesta', 'costo', 'precio', 'valor'];
const DINERO_DOS = ['inversion', 'invertir'];
const CUANTO = ['cuanto', 'cuanta', 'cuantos'];
const ARRANQUE = [
  'arranca', 'arrancar', 'arranco', 'arrancamos', 'arrancan', 'arranque',
  'empieza', 'empezar', 'empiezo', 'empezamos', 'empiezan',
  'inicia', 'iniciar', 'inicio', 'iniciamos',
  'comienza', 'comenzar', 'comienzo',
  'vincularme', 'vincularse', 'afiliarme', 'afiliarse', 'inscribirme', 'inscribirse',
  'unirme', 'unirse', 'entrar', 'montar', 'meterme',
];
// Palabras corrientes a una letra de una clave de arranque.
const NO_ES_ARRANQUE = ['entra', 'entran', 'entre', 'montan', 'monta', 'unirte'];

// La pregunta es por lo que se gana, no por lo que se pone.
// «Gano» a secas es el verbo; «Gano Excel», la empresa.
const RE_GANANCIA = /\bgan(a|an|ar|aria|ancia|ancias)\b|\bgano\b(?! ?excel)|comision|binario|\bgen ?5\b|regalia|\bbono|utilidad|rendimiento|retorno|recuper|\b(me|le|nos|les) pagan?\b|\bpagan\b|empez\w* a (ganar|ver|recibir|cobrar|generar|producir)/;
// «¿Cuánto tiempo…?», «¿cuántas personas…?»: el «cuánto» no es de plata.
const RE_OTRA_CANTIDAD = /cuant[oa]s? (tiempo|dias|semanas|meses|anos|horas|personas|gente|clientes|socios|referidos)|cuanto (se )?(demora|tarda|dura|toma|demoro|tardo)/;

/** ¿El mensaje pregunta con cuánta plata se arranca? */
export function preguntaPorPlataParaEmpezar(texto: string): boolean {
  if (typeof texto !== 'string') return false;
  const suave = normalizarSuave(texto);
  if (!suave.trim() || suave.length > 220) return false;

  const t = normalizarDuro(suave);
  if (RE_GANANCIA.test(t) || RE_OTRA_CANTIDAD.test(t) || detectarProducto(texto)) return false;
  const palabras = t.split(' ');

  // «¿Con qué plata?», tal como lo dijo el video, ya es la pregunta.
  if (/con que (plata|platica|dinero)/.test(t)) return true;

  const arranque = palabras.some((p) => !NO_ES_ARRANQUE.includes(p) && parecida(p, ARRANQUE));
  if (!arranque) return false;
  // «Cuánto» y las palabras de costo, exactas: «cuando» está a una letra.
  return palabras.some((p) => parecida(p, DINERO) || parecida(p, DINERO_DOS, 2) || CUANTO.includes(p) || COSTO_EXACTO.includes(p));
}
