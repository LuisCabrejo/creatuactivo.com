/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * GET /api/wa/assets — activos de la cuenta de WhatsApp Business.
 *
 * Devuelve el número emisor real + las plantillas de la WABA. La lectura de
 * plantillas (GET /{WABA_ID}/message_templates) es lo que ejerce el permiso
 * `whatsapp_business_management`.
 *
 * Consumidor: proxy /api/admin/wa del Dashboard (queswa.app).
 * Auth: header x-wa-bridge-secret.
 */

import { assertBridgeSecret } from '@/lib/wa-bridge-auth';
import { getPhoneAsset, listTemplates } from '@/lib/wa-channel';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const denied = assertBridgeSecret(request);
  if (denied) return denied;

  const [phone, tpl] = await Promise.all([getPhoneAsset(), listTemplates()]);

  return Response.json({
    asset:     phone.asset ?? null,
    templates: tpl.templates,
    // Errores no bloqueantes: si falla una lectura, la consola muestra el resto
    // y avisa, en vez de quedarse en blanco.
    errors: {
      ...(phone.error && { asset: phone.error }),
      ...(tpl.error   && { templates: tpl.error }),
    },
  });
}
