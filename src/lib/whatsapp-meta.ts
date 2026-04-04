/**
 * Copyright © 2026 CreaTuActivo.com
 * WhatsApp Meta Cloud API — Reemplaza SendPulse como BSP
 *
 * Misma interfaz pública que sendpulse.ts para migración sin fricción:
 *   sendWhatsAppTemplate(prospect, constructor) → { whatsappSent, error? }
 *
 * Usa WHATSAPP_SYSTEM_TOKEN + WHATSAPP_PHONE_NUMBER_ID directamente.
 * Sin intermediario, sin costo por mensaje BSP.
 */

const META_API_VERSION = 'v22.0';

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
 *
 * Template acceso_mapa_salida (crear en Meta WhatsApp Manager):
 *   Body: "Hola {{1}}, aquí está tu acceso al Mapa de Salida: {{2}}"
 *   Variables: {{1}} = nombre, {{2}} = URL del mapa
 */
export async function sendWhatsAppTemplate(
  prospect: ProspectData,
  constructor: ConstructorInfo,
): Promise<{ whatsappSent: boolean; contactId?: string; error?: string }> {

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const systemToken   = process.env.WHATSAPP_SYSTEM_TOKEN;

  if (!phoneNumberId || !systemToken) {
    const msg = '[WA Meta] Faltan WHATSAPP_PHONE_NUMBER_ID o WHATSAPP_SYSTEM_TOKEN';
    console.error(msg);
    return { whatsappSent: false, error: msg };
  }

  const mapaLink = prospect.mapaUrl
    ?? `https://creatuactivo.com/mapa-de-salida/${constructor.constructorId}`;

  const firstName = prospect.name.split(' ')[0];

  // Normalizar número: Meta requiere formato internacional sin "+" (ej: 573001234567)
  const toNumber = prospect.whatsapp.replace(/^\+/, '').replace(/\s/g, '');

  const url = `https://graph.facebook.com/${META_API_VERSION}/${phoneNumberId}/messages`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${systemToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: toNumber,
        type: 'template',
        template: {
          name: 'acceso_mapa_salida',
          language: { code: 'es' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: firstName },   // {{1}} nombre
                { type: 'text', text: mapaLink },    // {{2}} enlace
              ],
            },
          ],
        },
      }),
    });

    const data = await response.json() as any;

    if (!response.ok) {
      const msg = `[WA Meta] Error Meta API ${response.status}: ${JSON.stringify(data)}`;
      console.error(msg);
      return { whatsappSent: false, error: msg };
    }

    const messageId = data?.messages?.[0]?.id;
    console.log(`✅ [WA Meta] acceso_mapa_salida enviado → ${toNumber} (msg: ${messageId})`);
    return { whatsappSent: true, contactId: messageId };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('❌ [WA Meta] sendWhatsAppTemplate error:', msg);
    return { whatsappSent: false, error: msg };
  }
}
