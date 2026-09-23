/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La pregunta de cierre con DOS SALIDAS — el fallo que más gente nos cuesta.
 *
 * ── EL DATO (investigación del 23 sep 2026) ──────────────────────────────────
 *
 * Sobre 819 turnos de personas reales en 30 días:
 *
 *   · abandono normal en turnos que no son el primero ........  15 %
 *   · abandono tras un «sí» que cayó al vector ...............  71 %   (41 casos)
 *   · de esos 41, eran preguntas de dos salidas ..............  16, y 15 mataron el hilo
 *
 * Las frases reales: «¿Cuál de los dos tiene en su pedido?» (5 veces, 5 muertes),
 * «¿Cuál de los dos va más con su rutina?» (3 de 3), «¿Prefiere el tinto solo o
 * le gusta con crema y dulce?». La persona no elige: contesta «sí», el motor
 * busca con esa pregunta como ancla, la pregunta no es de ningún fragmento, y
 * devuelve lo que se le parezca. La persona pidió elegir y recibió un discurso.
 *
 * ── POR QUÉ EN CÓDIGO Y NO EN EL PROMPT ──────────────────────────────────────
 *
 * La regla existe desde el 7 ago 2026 —*una sola pregunta, una sola salida*— y
 * el modelo la sigue rompiendo, porque esas preguntas las compone él y no salen
 * de ningún fragmento. Una regla que no se sostiene con disciplina se sostiene
 * con arquitectura, igual que pasó con las cabeceras del arsenal y los typos.
 *
 * ── QUÉ HACE, Y QUÉ NO ───────────────────────────────────────────────────────
 *
 * PODA la pregunta y deja el cuerpo. No la reescribe: un modelo que corrige su
 * propio texto conserva el error y cambia el envoltorio, que es la razón por la
 * que el guardarraíl de salud reemplaza en vez de pedir corrección. Y cerrar sin
 * pregunta está permitido por la directriz del Director (23 sep 2026): *la
 * pregunta final no es obligatoria; si no hay nada útil que ofrecer, cierre sin
 * pregunta*.
 *
 * ⚠️ Solo mira la pregunta que CIERRA el texto. Una disyuntiva en mitad del
 * cuerpo es prosa normal («si son diez clientes o diez mil») y no se toca.
 */

/**
 * Dos formas de la misma falla, las dos vistas en producción:
 *  1. La elección explícita entre dos cosas ya nombradas: «¿cuál de los dos…?»
 *  2. La oferta disyuntiva: «¿le muestro X o prefiere Y?»
 *
 * ⚠️ NO entra «¿Con cuál arranca?», que es la pregunta de seguimiento de
 * `FREQ_30` y está aprobada: es abierta, no ofrece dos caminos cerrados.
 */
const RE_DOS_SALIDAS = new RegExp(
  '¿[^?¿]*(' +
    // 1 — la elección entre dos
    'cu[aá]l(es)?\\s+(de\\s+(los|las)\\s+dos|de\\s+esos|de\\s+esas|de\\s+estos|de\\s+estas' +
      '|va\\s+m[aá]s|se\\s+acerca\\s+m[aá]s|le\\s+suena\\s+m[aá]s|prefiere\\s+de)' +
    // 2 — la oferta con «o» en medio
    '|(prefiere|le\\s+gusta|le\\s+provoca|quiere|le\\s+muestro|le\\s+cuento|le\\s+env[ií]o|le\\s+paso' +
      '|empezamos|seguimos|arrancamos)[^?¿]{0,90}\\s+o\\s+[^?¿]{0,90}' +
  ')[^?¿]*\\?', 'i');

/** El texto tras la pregunta: espacios, emojis o un cierre corto. Nada más. */
const COLA_TOLERADA = 40;

/**
 * La pregunta de dos salidas con la que CIERRA el texto, o `null`.
 *
 * Devuelve la pregunta para que quien llame la registre: el motivo del bloqueo
 * es lo primero que se quiere leer al diagnosticar.
 */
export function detectarPreguntaDeDosSalidas(texto: string): string | null {
  const t = (texto || '').trim();
  if (!t) return null;
  const preguntas = t.match(/¿[^?¿]{5,200}\?/g);
  if (!preguntas || !preguntas.length) return null;
  const ultima = preguntas[preguntas.length - 1];
  // Tiene que CERRAR el texto: lo que venga detrás es cola, no otro párrafo.
  const cola = t.slice(t.lastIndexOf(ultima) + ultima.length);
  if (cola.replace(/\s/g, '').length > COLA_TOLERADA) return null;
  return RE_DOS_SALIDAS.test(ultima) ? ultima : null;
}

/** Lo que queda del texto tras quitarle la pregunta de dos salidas. */
const MINIMO_UTIL = 60;

/**
 * Poda la pregunta de dos salidas y devuelve el cuerpo.
 *
 * ⚠️ Si al podarla no queda una respuesta útil —el turno era la pregunta y poco
 * más—, devuelve el texto INTACTO. Un turno vacío es peor que uno con una
 * pregunta mala, y quien llama ya lo registró para la cola de revisión.
 */
export function podarPreguntaDeDosSalidas(texto: string): string {
  const pregunta = detectarPreguntaDeDosSalidas(texto);
  if (!pregunta) return texto;
  const t = (texto || '').trim();
  const i = t.lastIndexOf(pregunta);
  const cuerpo = (t.slice(0, i) + t.slice(i + pregunta.length)).replace(/\s+$/, '').trim();
  return cuerpo.length >= MINIMO_UTIL ? cuerpo : texto;
}
