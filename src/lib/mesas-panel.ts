/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La llave del panel de una mesa (/vip/{evento}/panel?clave=…), solo de servidor.
 * Sale de WA_BRIDGE_SECRET (ya vive en Vercel y en .env.local), así que no hace falta
 * una variable nueva; cambiar ese secreto cambia también estas llaves.
 */
import { createHmac, timingSafeEqual } from 'crypto';

export function clavePanel(eventoId: string): string | null {
  const secreto = process.env.WA_BRIDGE_SECRET?.trim();
  if (!secreto) return null;
  return createHmac('sha256', secreto).update(`panel-mesa:${eventoId}`).digest('hex').slice(0, 24);
}

export function claveValida(eventoId: string, clave: string | undefined | null): boolean {
  const buena = clavePanel(eventoId);
  if (!buena || !clave || clave.length !== buena.length) return false;
  return timingSafeEqual(Buffer.from(buena), Buffer.from(clave));
}
