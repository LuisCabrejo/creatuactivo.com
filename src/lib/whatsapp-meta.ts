/**
 * Copyright © 2026 CreaTuActivo.com
 * WhatsApp Meta Cloud API — Reemplaza SendPulse como BSP
 *
 * Misma interfaz pública que sendpulse.ts para migración sin fricción:
 *   sendWhatsAppTemplate(prospect, constructor) → { whatsappSent, error? }
 *
 * v1.1 — Julio 2026: la llamada a Meta se delega en `wa-channel.ts` (capa de
 * canal única). Aquí solo queda la regla de negocio de esta plantilla concreta:
 * qué enlace se arma y qué variables la rellenan.
 */

import { sendTemplate } from './wa-channel';

/** Plantilla de captación. Body: "Hola {{1}}, aquí está tu acceso al Mapa de Salida: {{2}}" */
const TEMPLATE_NAME = 'acceso_mapa_salida';
const TEMPLATE_LANG = 'es';

// ─── Tipos públicos (idénticos a sendpulse.ts) ────────────────────────────────
export interface ProspectData {
  name: string
  whatsapp: string   // +57XXXXXXXXXX
  email?: string
  archetype?: string
  mapaUrl?: string
  fingerprint?: string
}

export interface ConstructorInfo {
  constructorId: string
  name: string
  whatsapp?: string
}

// ─── Función principal ────────────────────────────────────────────────────────
/**
 * Envía la plantilla `acceso_mapa_salida` via Meta Cloud API directa.
 * Drop-in replacement de SendPulse — misma firma, mismo resultado.
 */
export async function sendWhatsAppTemplate(
  prospect: ProspectData,
  constructor: ConstructorInfo,
): Promise<{ whatsappSent: boolean; contactId?: string; error?: string }> {

  const mapaLink = prospect.mapaUrl
    ?? `https://creatuactivo.com/mapa-de-salida/${constructor.constructorId}`;

  const firstName = prospect.name.split(' ')[0];

  const result = await sendTemplate(
    prospect.whatsapp,
    TEMPLATE_NAME,
    TEMPLATE_LANG,
    [firstName, mapaLink],   // {{1}} nombre, {{2}} enlace
  );

  return {
    whatsappSent: result.ok,
    ...(result.messageId && { contactId: result.messageId }),
    ...(result.error && { error: result.error }),
  };
}
