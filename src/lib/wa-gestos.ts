/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Los gestos —una reacción o un sticker— como respuesta (Director, 11 oct 2026).
 *
 * Hasta ese día el webhook los callaba todos, a propósito: «son gestos de
 * asentimiento, no consultas». Pero un gesto sobre una pregunta de sí o no ES la
 * respuesta. Dos prospectos se fueron así sin que nadie lo notara:
 *   · Cifuentes (16 sep): a «¿Quiere verlo en el simulador?» respondió con dos
 *     gestos y no recibió nada.
 *   · Adazuni Maldonado (San Diego, 10 oct): reaccionaba y escribía «Sí»; a la
 *     última pregunta solo reaccionó, y ahí terminó la conversación.
 *
 * La lectura del Director: casi todos los emojis asienten —el corazón es «me
 * encanta», las manos juntas son «por favor»—. Y el costo de equivocarse no es
 * simétrico: si Queswa toma un gesto como «sí» y no lo era, la persona recibe lo
 * que se le había ofrecido; si calla, la persona espera y se va. Por eso cuentan
 * todos, menos los que dicen que no (👎, enojo, tristeza, duda).
 *
 * Tres condiciones, y las tres las decide el webhook con estas funciones:
 *   1. el gesto no es negativo (`gestoAfirma`);
 *   2. el último mensaje de Queswa terminó en una pregunta de sí o no
 *      (`preguntaFinalSiNo`): a «¿Por dónde prefiere empezar?» un 👍 no responde
 *      nada, y a «¿mañana, o en dos días?» tampoco;
 *   3. la persona no escribió nada después de esa pregunta —ni antes del gesto
 *      ni en la espera—: Adazuni reaccionaba y escribía «Sí» diez segundos más
 *      tarde, y tomar los dos le habría hecho avanzar dos pasos de un golpe.
 */

/** Cuánto se espera antes de tomar el gesto como «sí»: si escribe en ese rato, manda lo que escribió. */
export const ESPERA_GESTO_S = 20;
/** Un gesto sobre una pregunta más vieja que esto ya no responde a nada. */
export const VIGENCIA_PREGUNTA_H = 24;

// Los que dicen que no. Se comparan sin el tono de piel ni el selector de variación.
const NEGATIVOS = new Set([
  '👎', '😡', '😠', '🤬', '😢', '😭', '😞', '😔', '😟', '😕', '🙁', '☹', '😩', '😫', '😤',
  '🤔', '🙄', '😒', '😐', '😑', '🤨', '😬', '💔', '❌', '🚫', '✖', '⛔',
]);

const limpiarEmoji = (e: string) => e.replace(/[\u{1F3FB}-\u{1F3FF}\u{FE0F}\u{FE0E}]/gu, '').trim();

/**
 * ¿Este gesto dice que sí? Un sticker no se puede leer, y casi siempre es un
 * «ok» o un «gracias»: cuenta. Una reacción vacía es una reacción RETIRADA.
 */
export function gestoAfirma(tipo: 'reaction' | 'sticker', emoji?: string | null): boolean {
  if (tipo === 'sticker') return true;
  const e = limpiarEmoji(emoji ?? '');
  if (!e) return false;
  return !NEGATIVOS.has(e);
}

// Una pregunta que arranca con estas palabras pide un dato, no un sí.
const RE_INTERROGATIVA = /^(qu[eé]|cu[aá]l(es)?|c[oó]mo|cu[aá]ndo|d[oó]nde|qui[eé]n(es)?|cu[aá]nt[oa]s?|por\s+(qu[eé]|d[oó]nde)|para\s+qu[eé]|a\s+(qu[eé]|cu[aá]l|qui[eé]n)|de\s+(qu[eé]|cu[aá]l)|con\s+(qu[eé]|cu[aá]l|qui[eé]n)|en\s+(qu[eé]|cu[aá]l))(?![a-záéíóúñ])/i;

/**
 * La pregunta con la que termina un mensaje de Queswa, si es de sí o no. Devuelve
 * null si el mensaje no termina en pregunta, si la pregunta pide un dato
 * («¿Por dónde prefiere empezar?», «¿Con cuál se identifica?») o si ofrece dos
 * salidas («¿mañana, o en dos días?»).
 */
export function preguntaFinalSiNo(texto: string | null | undefined): string | null {
  const t = (texto ?? '').trim();
  if (!t.endsWith('?')) return null;
  const inicio = t.lastIndexOf('¿');
  if (inicio < 0) return null;
  const pregunta = t.slice(inicio + 1, -1).replace(/[*_]/g, '').trim();
  if (!pregunta || RE_INTERROGATIVA.test(pregunta)) return null;
  if (/,\s*o\s+|\so\s+(en|el|la|los|las|un|una|si|por)\s/i.test(pregunta)) return null;
  return pregunta;
}
