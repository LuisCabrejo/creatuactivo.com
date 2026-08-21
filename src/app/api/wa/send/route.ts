/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * POST /api/wa/send — envío humano por el canal de WhatsApp.
 *
 * Body:
 *   { to, type: 'text',     text }
 *   { to, type: 'template', templateName, languageCode?, parameters?, buttonUrlParam? }
 *
 * Ejerce `whatsapp_business_messaging`. Consumidor: proxy /api/admin/wa del
 * Dashboard (queswa.app). Auth: header x-wa-bridge-secret.
 */

import { assertBridgeSecret } from '@/lib/wa-bridge-auth';
import { sendText, sendTemplate } from '@/lib/wa-channel';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface SendBody {
  to?: string
  type?: 'text' | 'template'
  text?: string
  templateName?: string
  languageCode?: string
  parameters?: string[]
  /** Sufijo dinámico del botón de URL de la plantilla (ej. token de acceso). */
  buttonUrlParam?: string
}

export async function POST(request: Request) {
  const denied = assertBridgeSecret(request);
  if (denied) return denied;

  let body: SendBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'JSON inválido' }, { status: 400 });
  }

  const to = body.to?.trim();
  if (!to) {
    return Response.json({ ok: false, error: 'Falta el número destino' }, { status: 400 });
  }

  if (body.type === 'text') {
    const text = body.text?.trim();
    if (!text) {
      return Response.json({ ok: false, error: 'El mensaje está vacío' }, { status: 400 });
    }
    const result = await sendText(to, text);
    return Response.json(result, { status: result.ok ? 200 : 502 });
  }

  if (body.type === 'template') {
    const templateName = body.templateName?.trim();
    if (!templateName) {
      return Response.json({ ok: false, error: 'Falta el nombre de la plantilla' }, { status: 400 });
    }
    const result = await sendTemplate(
      to,
      templateName,
      body.languageCode?.trim() || 'es',
      (body.parameters ?? []).map((p) => String(p)),
      body.buttonUrlParam?.trim() || undefined,
    );
    return Response.json(result, { status: result.ok ? 200 : 502 });
  }

  return Response.json(
    { ok: false, error: "type debe ser 'text' o 'template'" },
    { status: 400 },
  );
}
