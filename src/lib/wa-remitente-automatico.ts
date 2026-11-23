/**
 * ¿Escribe otra máquina? — el freno para no conversar con un bot.
 *
 * El 17 nov 2026 el chatbot de un operador telefónico le escribió al WABA y
 * Queswa le contestó 35 veces en 42 minutos («Escribe el número de la opción…»,
 * «Has superado el número máximo de intentos»…), casi todas con una llamada a
 * Sonnet. Un bot no se cansa: sin freno, el bucle dura lo que dure el otro bot,
 * y cada respuesta que nadie lee le baja calidad al número ante Meta.
 *
 * La regla: al primer mensaje con forma de bot se le contesta una vez (puede
 * haber una persona detrás que se equivocó de chat); del segundo en adelante,
 * silencio. Y fuera de la forma, dos frenos de volumen: el mismo texto largo
 * por tercera vez en diez minutos, o una ráfaga que ninguna persona escribe.
 *
 * Nunca aplica al socio, y nunca al texto que pre-llena un enlace nuestro
 * («Vengo del enlace de…», «soy socio»): quien toca el enlace del reel tres
 * veces es una persona, y la atiende el nodo «Sigo aquí».
 */

/** Frases de menú y de sistema que escriben los bots de atención. */
const RE_FORMA_DE_BOT = new RegExp([
  'escrib[ae]s? (solo )?el n[uú]mero de la opci[oó]n',
  'digitar o escribir solo el n[uú]mero',
  'elige una de las opciones',
  'has superado el n[uú]mero m[aá]ximo de intentos',
  'soy tu asistente virtual',
  'este chat (est[aá] siendo|ser[aá]) (grabado|monitoreado)',
  'nuestro chat finaliz[oó]',
  'iniciaremos una nueva conversaci[oó]n',
  'si quieres iniciar una nueva conversaci[oó]n',
  'no entend[ií] tu mensaje',
  'responde con el n[uú]mero',
  'marca (la opci[oó]n|el n[uú]mero)',
  'mensaje autom[aá]tico',
  'respuesta autom[aá]tica',
].join('|'), 'i');

const RE_TEXTO_NUESTRO = /vengo del enlace|soy socio|ya vi el video|acabo de usar el simulador|quiero pedir:/i;

export interface TurnoReciente { texto: string; at: number }

const norm = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

export function tieneFormaDeBot(texto: string): boolean {
  return RE_FORMA_DE_BOT.test(texto || '');
}

/**
 * Devuelve el motivo para callar, o null si se atiende. `recientes` son los
 * mensajes de la persona ya atendidos (no el actual), con su hora en ms.
 */
export function motivoParaCallar(mensaje: string, recientes: TurnoReciente[], ahora = Date.now()): string | null {
  if (!mensaje || RE_TEXTO_NUESTRO.test(mensaje)) return null;
  const en = (min: number) => recientes.filter((r) => ahora - r.at <= min * 60_000);

  if (tieneFormaDeBot(mensaje) && en(30).some((r) => tieneFormaDeBot(r.texto))) {
    return 'forma de bot, otra vez';
  }
  const m = norm(mensaje);
  if (m.length >= 40 && en(10).filter((r) => norm(r.texto) === m).length >= 2) {
    return 'el mismo texto por tercera vez';
  }
  if (en(3).length >= 10) {
    return 'ráfaga de mensajes';
  }
  return null;
}
