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
 * 🛑 Del 20 al 23 oct 2026 el celular y la tableta también conversaron en la
 * web (Director, 20 oct: de 20 personas que tocaron el enlace ese día en el
 * celular, 12 no tocaron Enviar en WhatsApp; el sospechoso era el código
 * « c:…» al final del mensaje). Medido el 23 oct con
 * `node scripts/medir-aperturas-enlace.mjs --dias 7`, el enlace del socio desde
 * el celular convirtió peor en la web: a WhatsApp, 13 de 32 navegadores
 * conversaron (41 %); al chat web, 4 de 24 (17 %), y cinco de las seis
 * conversaciones web no pasaron de dos mensajes. Decisión del Director, 23 oct:
 * WhatsApp otra vez en el celular y la tableta, SIN el código. El código era el
 * sospechoso, no WhatsApp; lo que se prueba ahora es WhatsApp sin código, y se
 * mide el 30 oct contra esas dos líneas base (ver `conversaPorWhatsApp`).
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
 * El celular y la tableta conversan con Queswa en WhatsApp; el computador, en la web.
 *
 * 🛑 La historia de esta línea, para que nadie la «arregle» sin medir:
 *   · 13 oct 2026: `d !== 'computador'` (caso Wilson Romero, ver la cabecera).
 *   · 20 oct: `false` para todos. De 20 personas que tocaron el enlace ese día en
 *     el celular, 12 no tocaron Enviar en WhatsApp: llegaban a un chat vacío con
 *     el mensaje escrito y un código al final («c:qutufvia84») que se veía
 *     sospechoso. Se quitó el código Y se mandó a todos al chat web, a la vez.
 *   · 23 oct: medido con `medir-aperturas-enlace.mjs --dias 7`, el enlace del
 *     socio desde el celular conversó 41 % en WhatsApp (13 de 32 navegadores,
 *     hasta el 20 oct) y 17 % en la web (4 de 24, del 21 al 23; cinco de las seis
 *     conversaciones web se quedaron en dos mensajes). Vuelve WhatsApp, y el
 *     código sigue fuera: la variable que se prueba es WhatsApp sin código.
 *     En producción desde el 23 oct 2026 (hora de Bogotá en el commit).
 *     Se mide el 30 oct contra las dos líneas base de arriba.
 * Sin código, el webhook no ata la ficha de WhatsApp al navegador: la tabla por
 * dispositivo del script no sirve para WhatsApp; se compara con la primera.
 */
export function conversaPorWhatsApp(d: Dispositivo): boolean {
  return d !== 'computador';
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
