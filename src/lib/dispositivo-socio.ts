/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * «Este dispositivo es mío» — el socio marca el teléfono o el computador con el
 * que mira sus propios enlaces, y la campanita deja de avisarle de sí mismo.
 *
 * Por qué existe (1 oct 2026): la campanita de queswa.app avisaba «Un visitante
 * avanzó a su Presentación» y era el propio Director, revisando la presentación
 * desde su Mac. Su navegador cuenta como visitante anónimo, y el Dashboard solo
 * silenciaba las fichas de socio, no el dispositivo del socio.
 *
 * El enlace es /mi-dispositivo?c={constructor_id}&f={firma}. La firma es un HMAC
 * con `WA_BRIDGE_SECRET` (el secreto que los dos repositorios ya comparten) sobre
 * `dispositivo:{constructor_id}` — con su propio prefijo, para que no sirva como
 * el token del vínculo por WhatsApp (`tokenDeVinculoSocio`) ni al revés. Sin la
 * firma, nadie puede marcar un dispositivo a nombre de un socio: un prospecto
 * que lo hiciera dejaría de generarle avisos a su socio.
 *
 * Web Crypto a propósito: la usa una ruta Edge.
 */

export async function firmaDispositivoSocio(constructorId: string, secreto = process.env.WA_BRIDGE_SECRET): Promise<string | null> {
  const clave = (secreto || '').trim();
  if (!clave || !constructorId) return null;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(clave), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const firma = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(`dispositivo:${constructorId.toLowerCase()}`)));
  let bin = '';
  for (const byte of firma) bin += String.fromCharCode(byte);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '').slice(0, 22);
}

export async function verificarFirmaDispositivo(constructorId: string, firma: string): Promise<boolean> {
  const esperada = await firmaDispositivoSocio(constructorId);
  return !!esperada && !!firma && esperada === firma;
}
