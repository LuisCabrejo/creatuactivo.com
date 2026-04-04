/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Webhook WhatsApp Cloud API — Adaptador de canal para motor Queswa
 * Recibe mensajes inbound de Meta, los pasa al motor Queswa, devuelve respuesta via API de Meta.
 *
 * Fase 3 del Handoff WABA + Queswa (Abril 2026)
 * Motor: /api/nexus (no modificado) — este archivo es solo el adaptador de canal
 */

// src/app/api/whatsapp/webhook/route.ts
// WABA Webhook — Adaptador canal WhatsApp → Queswa → WhatsApp
// Tenant: whatsapp (system prompt 'queswa_whatsapp' en Supabase)

import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs'; // Node porque necesitamos leer stream completo antes de responder a Meta
export const maxDuration = 30;

// ─── Supabase client (lazy) ───────────────────────────────────────────────────
let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseClient;
}

// ─── GET: Handshake de verificación de Meta ───────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode      = searchParams.get('hub.mode');
  const token     = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ [WA Webhook] Handshake Meta verificado');
    return new Response(challenge, { status: 200 });
  }

  console.warn('⚠️ [WA Webhook] Handshake fallido — token incorrecto');
  return new Response('Forbidden', { status: 403 });
}

// ─── POST: Mensajes inbound de Meta ───────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Meta también envía actualizaciones de estado (entregado, leído) — ignorarlas
    const messages = body?.entry?.[0]?.changes?.[0]?.value?.messages;
    if (!messages || messages.length === 0) {
      return new Response('OK', { status: 200 });
    }

    const message     = messages[0];
    const contact     = body.entry[0].changes[0].value.contacts?.[0];
    const phoneNumber = message.from as string;           // ej: "573001234567"
    const messageText = message.text?.body as string | undefined;
    const contactName = (contact?.profile?.name as string | undefined) || 'Constructor';

    // Solo procesar mensajes de texto por ahora
    if (!messageText) {
      return new Response('OK', { status: 200 });
    }

    console.log(`📥 [WA Webhook] ${contactName} (${phoneNumber}): "${messageText}"`);

    // ─── 1. Registrar número en Supabase si es primera vez ─────────────────────
    // Guardamos el número WA como fingerprint_id con prefijo "wa_" para distinguirlo
    // de fingerprints de navegador. Esto dispara el trigger de la secuencia de 5 días.
    const waFingerprint = `wa_${phoneNumber}`;
    const supabase = getSupabase();

    const { data: existingProspect } = await supabase
      .from('prospects')
      .select('id')
      .eq('fingerprint_id', waFingerprint)
      .maybeSingle();

    if (!existingProspect) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase as any)
        .from('prospects')
        .insert({
          fingerprint_id: waFingerprint,
          device_info: {
            channel: 'whatsapp',
            phone: phoneNumber,
            name: contactName,
          },
          stage: 'awareness',
          source: 'whatsapp_inbound',
        });

      if (insertError) {
        console.error('⚠️ [WA Webhook] Error insertando prospect:', insertError.message);
        // No bloquear el flujo — continuar con la respuesta aunque el insert falle
      } else {
        console.log(`✅ [WA Webhook] Nuevo prospect registrado: ${waFingerprint}`);
      }
    }

    // ─── 2. Llamar al motor Queswa ──────────────────────────────────────────────
    // El motor en /api/nexus usa x-tenant-id para cargar el system prompt.
    // Tenant 'whatsapp' → RPC get_tenant_system_prompt → row 'queswa_whatsapp' en Supabase.
    // Fallback automático a nexus_main si el row no existe aún.
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://creatuactivo.com';

    const nexusResponse = await fetch(`${baseUrl}/api/nexus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': 'whatsapp',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: messageText }],
        sessionId: waFingerprint,
        fingerprint: waFingerprint,
      }),
    });

    if (!nexusResponse.ok) {
      console.error(`❌ [WA Webhook] Motor Queswa retornó ${nexusResponse.status}`);
      await sendWhatsAppMessage(phoneNumber, 'Hubo un error procesando tu mensaje. Intenta de nuevo en un momento.');
      return new Response('OK', { status: 200 });
    }

    // ─── 3. Consumir stream de texto plano (StreamingTextResponse = text/plain) ──
    const reader  = nexusResponse.body?.getReader();
    const decoder = new TextDecoder();
    let queswaReply = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        queswaReply += decoder.decode(value, { stream: true });
      }
    }

    queswaReply = queswaReply.trim();
    console.log(`💬 [WA Webhook] Queswa responde: "${queswaReply.slice(0, 80)}..."`);

    // ─── 4. Enviar respuesta al número del héroe via Meta API ──────────────────
    if (queswaReply) {
      await sendWhatsAppMessage(phoneNumber, queswaReply);
    }

    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('❌ [WA Webhook] Error inesperado:', error);
    // Siempre responder 200 a Meta — si respondemos 5xx Meta reintenta el mensaje
    return new Response('OK', { status: 200 });
  }
}

// ─── Utilidad: enviar mensaje de texto via WhatsApp Cloud API ─────────────────
async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const systemToken   = process.env.WHATSAPP_SYSTEM_TOKEN;

  if (!phoneNumberId || !systemToken) {
    console.error('❌ [WA Webhook] Faltan variables WHATSAPP_PHONE_NUMBER_ID o WHATSAPP_SYSTEM_TOKEN');
    return;
  }

  const metaUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

  const response = await fetch(metaUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${systemToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`❌ [WA Webhook] Error enviando mensaje a Meta: ${response.status} — ${errorBody}`);
  } else {
    console.log(`✅ [WA Webhook] Mensaje enviado a ${to}`);
  }
}
