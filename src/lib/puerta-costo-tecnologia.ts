/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados. Software propietario y confidencial.
 *
 * La puerta del costo de la tecnología (16 oct 2026).
 *
 * La tecnología no tiene costo (Director): creatuactivo.com, queswa.app y Queswa
 * vienen con el sistema de distribución, y lo que se paga es producto. La
 * respuesta escrita es `FREQ_43`, con candado. Hasta hoy no existía, y quien
 * preguntaba «¿qué valor cuesta adquirir la membresía de Queswa?» (11 jul 2026)
 * recibía una respuesta compuesta.
 *
 * Es PUERTA (`PUERTAS_INICIAL` en route.ts) y no solo vector porque «¿cuánto
 * cuesta Queswa?» nunca llegaba a buscar: `pideListaPreciosEarly` atrapa todo
 * «cuánto cuesta…» y le servía las tablas de precios del catálogo; el modelo
 * compuso entonces «queda incluido en el paquete», que deja creer que la
 * tecnología hace parte del precio. route.ts usa esta misma función para que el
 * detector de precios la deje pasar.
 *
 * La llave son dos cosas en el mismo mensaje: de QUÉ se habla (Queswa, la
 * tecnología, la aplicación, la plataforma) y que se pregunta por un COSTO.
 * Las dos toleran el dedo torpe por distancia de edición, con la transposición
 * como un solo error (mismo criterio que `declaraPerfil` en el conductor).
 *
 * ⚠️ Tres trampas que la llave evita:
 *  · «cuenta» está a una letra de «cuesta» («¿cómo creo mi cuenta en la app?»)
 *    y «costa» de «costo» («¿funciona la aplicación en Costa Rica?»): se excluyen
 *    por nombre, antes de medir la distancia.
 *  · «Hola, Queswa» es un saludo, no el tema: el vocativo del comienzo se quita
 *    antes de buscar el sujeto. Si no, «Hola Queswa, ¿cuánto cuesta el
 *    Cordygold?» abriría la puerta.
 *  · Si el mensaje nombra un producto, un paquete, el envío o cómo empezar, la
 *    pregunta es por ESO: tiene su propia respuesta con precio.
 *
 * Casos de tolerancia a typos en `scripts/prueba-typos.mts`.
 */

import { normalizarDuro, normalizarSuave } from './texto-normalizar';
import { detectarProducto } from './wa-productos';

// Damerau-Levenshtein corto: la transposición cuenta como un solo error.
function distancia(a: string, b: string): number {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1,
        m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        m[i][j] = Math.min(m[i][j], m[i - 2][j - 2] + 1);
      }
    }
  return m[a.length][b.length];
}

/** ¿La palabra es una de las claves, o una clave con un tropiezo? (La usa
 *  también `puerta-maquina-ventas.ts`.) */
export function parecida(palabra: string, claves: string[], tolerancia = 1): boolean {
  return claves.some((c) => palabra === c || (palabra.length >= 4 && distancia(palabra, c) <= tolerancia));
}

// «Tecnología» admite dos tropiezos («tegnolojia»); las demás, uno. «Aplicación»
// con dos sería también «explicación».
const SUJETO = ['queswa', 'keswa', 'aplicacion', 'plataforma'];
const SUJETO_DOS = ['tecnologia'];
const SUJETO_EXACTO = ['app', 'apps', 'aplicaciones'];
const COSTO = ['cuesta', 'cuestan', 'costo', 'costos', 'precio', 'cobran', 'mensualidad', 'membresia', 'suscripcion', 'gratis', 'gratuita', 'gratuito', 'licencia'];
const COSTO_EXACTO = ['cobra', 'cobro'];
// Palabras corrientes a una letra de una clave de costo. «Precios», en plural,
// es la lista de los productos («¿en la app veo los precios?»), no un costo.
const NO_ES_COSTO = ['cuenta', 'cuentas', 'cuento', 'costa', 'corto', 'cortos', 'puesta', 'precios'];

const RE_FRASE_DE_COSTO = /cuanto (vale|valen|es|sale|toca pagar|hay que pagar)|(hay que|toca|tengo que|tendria que|debo|se debe) pagar|se paga|pagar (algo|aparte|mensual)|pago mensual/;
// El saludo con el nombre: «Hola, Queswa…» o «Queswa, …» (con su coma).
const RE_VOCATIVO = /^\s*(?:(?:hola|buenas(?: tardes| noches)?|buenos dias|buen dia)[\s,!.]*([a-z]{4,8})[\s,!.:]|([a-z]{4,8})\s*[,.!:])/;
// El mensaje pregunta por otra cosa que tiene su propio precio.
const RE_OTRO_OBJETO = /paquete|\bkit\b|\besp ?\d|producto|\bcafe|ganocafe|\bcaja|envio|domicilio|pedido|empezar|empiezo|iniciar|arrancar|entrar|vincul|afili|inversion|invertir|maquina|capsula/;

/** ¿El mensaje pregunta si la tecnología (Queswa, la app, la plataforma) tiene costo? */
export function preguntaPorCostoDeTecnologia(texto: string): boolean {
  if (typeof texto !== 'string') return false;
  let suave = normalizarSuave(texto);
  if (!suave.trim() || suave.length > 220) return false;

  // «Hola Queswa, …»: el nombre del saludo no es el tema.
  const voc = suave.match(RE_VOCATIVO);
  const nombre = voc && (voc[1] || voc[2]);
  if (nombre && parecida(nombre, ['queswa', 'keswa'])) suave = suave.slice(voc![0].length);

  const t = normalizarDuro(suave);
  if (RE_OTRO_OBJETO.test(t) || detectarProducto(texto)) return false;
  const palabras = t.split(' ');

  const sujeto = palabras.some((p) => SUJETO_EXACTO.includes(p) || parecida(p, SUJETO) || parecida(p, SUJETO_DOS, 2));
  if (!sujeto) return false;

  return RE_FRASE_DE_COSTO.test(t)
    || palabras.some((p) => !NO_ES_COSTO.includes(p) && (COSTO_EXACTO.includes(p) || parecida(p, COSTO)));
}
