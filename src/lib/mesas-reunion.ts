/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * El enlace de la reunión de cada convocatoria en línea (src/lib/mesas.ts), SOLO de
 * servidor: lo devuelve /api/mesa a quien acaba de reservar, y nunca se escribe en la
 * página. Que el enlace llegue solo al reservar es lo que hace privado el espacio.
 *
 * Solo lo importan rutas de servidor (/api/mesa); nunca un componente 'use client'.
 *
 * La llave es `Mesa.id`. La variable de entorno `REUNION_<ID en mayúsculas, con _>`
 * pisa el valor de aquí (para cambiar el enlace en Vercel sin desplegar). Vacío:
 * la confirmación dice que el enlace le llega por WhatsApp.
 */

const ENLACES: Record<string, string> = {
  'taller-dos-socios-2026-11-16': '',
};

export function enlaceReunion(eventoId: string): string | null {
  const variable = `REUNION_${eventoId.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
  const enlace = (process.env[variable] || ENLACES[eventoId] || '').trim();
  return /^https:\/\//.test(enlace) ? enlace : null;
}
