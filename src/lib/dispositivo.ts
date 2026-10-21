/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * ¿Desde qué dispositivo llega la persona? — una sola respuesta para el servidor
 * (el enlace del socio) y el navegador (el orbe y los botones del sitio).
 *
 * Decisión del Director, 13 oct 2026 (caso Wilson Romero): en el COMPUTADOR,
 * Queswa conversa en creatuactivo.com; en el CELULAR y la TABLETA sigue en
 * WhatsApp, como estaba. Wilson tocó dos veces el enlace del video desde un
 * computador de escritorio, el navegador intentó abrir WhatsApp y él lo leyó
 * como un error: en un computador WhatsApp casi nunca está abierto, y lo que la
 * gente espera al tocar «Hable con Queswa» es la pantalla de un chat. En el
 * teléfono, en cambio, WhatsApp es un toque y nos da su número desde el primer
 * mensaje.
 *
 * 🛑 Desde el 20 oct 2026 el celular y la tableta también conversan en la web
 * (ver `conversaPorWhatsApp`). Los comentarios que digan «en el celular,
 * WhatsApp» describen lo que había antes.
 *
 * ⚠️ Solo por el agente de usuario (y la pista `Sec-CH-UA-Mobile` de Chrome),
 * igual en los dos lados, para que el servidor y el navegador decidan lo mismo.
 * Por eso el iPad con Safari moderno —que se anuncia como Mac— cuenta como
 * computador: conversa en la web, donde el chat funciona igual de bien.
 */

export type Dispositivo = 'celular' | 'tableta' | 'computador';

/** Robots de buscadores, de vista previa y de medición: no son personas, no se cuentan. */
const RE_ROBOT = /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|applebot|ahrefs|semrush|mj12bot|petalbot|bytespider|gptbot|claudebot|ccbot|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|telegrambot|skypeuripreview|pinterestbot|whatsapp\/|headlesschrome|lighthouse|pagespeed|[a-z]bot\/|crawler|spider/i;

export function esRobot(agente: string | null | undefined): boolean {
  return RE_ROBOT.test(agente || '');
}

/**
 * `pistaMovil`: la cabecera `Sec-CH-UA-Mobile` (`?1` en un teléfono) o, en el
 * navegador, `navigator.userAgentData.mobile`. Chrome recorta cada vez más el
 * agente de usuario; la pista es la señal que queda.
 */
export function dispositivoDe(agente: string | null | undefined, pistaMovil?: string | boolean | null): Dispositivo {
  const ua = agente || '';
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'tableta';
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return 'tableta';
  if (/Mobi|iPhone|iPod|Android|IEMobile|Opera Mini|BlackBerry|webOS/i.test(ua)) return 'celular';
  if (pistaMovil === true || pistaMovil === '?1') return 'celular';
  return 'computador';
}

export function sistemaDe(agente: string | null | undefined): string {
  const ua = agente || '';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/CrOS/i.test(ua)) return 'ChromeOS';
  if (/Mac OS X|Macintosh/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'otro';
}

/**
 * 🛑 Desde el 20 oct 2026 Queswa conversa en la web en TODOS los dispositivos
 * (Director). De 20 personas que tocaron el enlace de Queswa ese día en el
 * celular, 12 no tocaron Enviar en WhatsApp: llegaban a un chat vacío con el
 * mensaje escrito en la casilla y un código al final («c:qutufvia84») que se
 * ve sospechoso. Conversión antes que medición: el chat web abre con Queswa ya
 * hablando. Se pierde el número que WhatsApp daba desde el primer mensaje.
 * Para volver a WhatsApp en el celular: `return d !== 'computador'`.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function conversaPorWhatsApp(_d: Dispositivo): boolean {
  return false;
}

/**
 * El dispositivo de este navegador. Fuera del navegador (servidor, compilación)
 * responde `celular`: el comportamiento de antes del 13 oct, que era WhatsApp
 * para todos.
 */
export function dispositivoDelNavegador(): Dispositivo {
  if (typeof navigator === 'undefined') return 'celular';
  const datos = (navigator as unknown as { userAgentData?: { mobile?: boolean } }).userAgentData;
  return dispositivoDe(navigator.userAgent, datos?.mobile ?? null);
}
