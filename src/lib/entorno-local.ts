/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * ¿Esta visita viene de una copia del sitio que corre en un computador?
 *
 * ⛔ Localhost no escribe visitas en la base de producción (Director, 11 oct
 * 2026: «que las visitas desde localhost no generen avisos»). El sitio en
 * desarrollo usa la MISMA base que el de producción, así que cada prueba
 * creaba una ficha de prospecto y el Dashboard la anunciaba como un visitante:
 * ocho «Avance de prospecto» en dos minutos el 10 oct, y doce fichas de
 * localhost que todavía aparecían como visitantes. El Dashboard filtra desde ese
 * día por la dirección de la ficha (`esEntornoDePrueba`), pero hay escrituras que
 * no la llevan —el avance de la presentación, la captura del chat—, así que el
 * corte va en el origen: tracking.js, las rutas /api/track/* y el motor.
 *
 * Para probar el seguimiento en local a propósito: `PERMITIR_TRACKING_LOCAL=1`
 * en el servidor, y `localStorage.setItem('tracking_local', '1')` en el navegador.
 */

const RE_HOST_LOCAL = /^(localhost|127\.|0\.0\.0\.0$|\[::1\]$|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)|\.local(host)?$/i;

export function esHostLocal(host: string | null | undefined): boolean {
  return !!host && RE_HOST_LOCAL.test(host.toLowerCase());
}

function hostDe(url: string | null | undefined): string | null {
  if (!url) return null;
  try { return new URL(url).hostname; } catch { return null; }
}

/** La petición viene de una página local, o la atiende un servidor local. */
export function esPeticionLocal(req: Request): boolean {
  if (process.env.PERMITIR_TRACKING_LOCAL === '1') return false;
  return [req.headers.get('origin'), req.headers.get('referer'), req.url].some((u) => esHostLocal(hostDe(u)));
}
