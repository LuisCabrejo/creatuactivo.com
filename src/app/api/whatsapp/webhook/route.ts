/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Webhook WhatsApp Cloud API — Adaptador de canal para motor Queswa
 * Recibe mensajes inbound de Meta, los pasa al motor Queswa, devuelve respuesta via API de Meta.
 *
 * v1.2 — Abril 2026
 * - CTWA: detecta referral de anuncios Meta (Mapa de Salida) y guarda atribución
 * - Fix source: usa SERVICE_ROLE_KEY para garantizar el insert en prospects
 * - pageContext: pasa contexto CTWA al motor para saludo personalizado
 */

// src/app/api/whatsapp/webhook/route.ts
// WABA Webhook — Adaptador canal WhatsApp → Queswa → WhatsApp
// Tenant: whatsapp (system prompt 'queswa_whatsapp' en Supabase)

import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const maxDuration = 30;

// ─── Supabase client con service role (garantiza insert sin RLS) ──────────────
let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!  // service role evita RLS en inserts
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

    // Meta envía actualizaciones de estado (entregado, leído) — ignorarlas
    const messages = body?.entry?.[0]?.changes?.[0]?.value?.messages;
    if (!messages || messages.length === 0) {
      return new Response('OK', { status: 200 });
    }

    const message     = messages[0];
    const contact     = body.entry[0].changes[0].value.contacts?.[0];
    const phoneNumber = message.from as string;
    const messageText = message.text?.body as string | undefined;
    const contactName = (contact?.profile?.name as string | undefined) || 'Constructor';

    // ─── Detectar CTWA (Click-To-WhatsApp Ads) ────────────────────────────────
    // Meta incluye `referral` cuando el mensaje viene de un anuncio
    const referral = message.referral as {
      source_url?: string;
      source_type?: string;   // "ad" | "post" | "unknown"
      source_id?: string;     // Ad ID
      headline?: string;      // Texto del anuncio
      body?: string;
      ctwa_clid?: string;     // Click ID para atribución
    } | undefined;

    const isCTWA    = !!referral?.source_type;
    const isMapaCTA = isCTWA && (
      referral?.headline?.toLowerCase().includes('mapa') ||
      referral?.body?.toLowerCase().includes('mapa') ||
      messageText?.toLowerCase().includes('mapa')
    );

    if (isCTWA) {
      console.log(`📢 [WA Webhook] CTWA detectado — ad: ${referral?.source_id}, headline: "${referral?.headline}"`);
    }

    // Solo procesar mensajes de texto
    if (!messageText) {
      return new Response('OK', { status: 200 });
    }

    console.log(`📥 [WA Webhook] ${contactName} (${phoneNumber}): "${messageText}" ${isCTWA ? '[CTWA]' : ''}`);

    // ─── 1. Registrar prospect en Supabase ────────────────────────────────────
    const waFingerprint = `wa_${phoneNumber}`;
    const supabase = getSupabase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingProspect } = await (supabase as any)
      .from('prospects')
      .select('id, source')
      .eq('fingerprint_id', waFingerprint)
      .maybeSingle();

    if (!existingProspect) {
      // Primer mensaje — crear prospect con atribución completa
      const source = isCTWA ? 'whatsapp_ctwa' : 'whatsapp_inbound';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase as any)
        .from('prospects')
        .insert({
          fingerprint_id: waFingerprint,
          stage: 'awareness',
          source,
          device_info: {
            channel: 'whatsapp',
            phone: phoneNumber,
            name: contactName,
            ...(isCTWA && {
              ctwa_clid:      referral?.ctwa_clid,
              ad_id:          referral?.source_id,
              ad_headline:    referral?.headline,
              ad_source_type: referral?.source_type,
            }),
          },
        });

      if (insertError) {
        console.error('⚠️ [WA Webhook] Error insertando prospect:', insertError.message);
      } else {
        console.log(`✅ [WA Webhook] Prospect registrado: ${waFingerprint} (${source})`);
      }
    } else if (isCTWA && existingProspect.source !== 'whatsapp_ctwa') {
      // Prospect ya existe pero vino ahora desde un anuncio — actualizar atribución
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('prospects')
        .update({ source: 'whatsapp_ctwa' })
        .eq('fingerprint_id', waFingerprint);
    }

    // ─── 2. Llamar al motor Queswa ────────────────────────────────────────────
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://creatuactivo.com';

    // pageContext le dice al motor el origen del mensaje para que Queswa
    // pueda personalizar el saludo en flujos CTWA / Mapa de Salida
    const pageContext = isCTWA
      ? `whatsapp_ctwa${isMapaCTA ? '_mapa_de_salida' : ''}`
      : 'whatsapp_inbound';

    const nexusResponse = await fetch(`${baseUrl}/api/nexus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': 'whatsapp',
      },
      body: JSON.stringify({
        messages:    [{ role: 'user', content: messageText }],
        sessionId:   waFingerprint,
        fingerprint: waFingerprint,
        pageContext,
      }),
    });

    if (!nexusResponse.ok) {
      console.error(`❌ [WA Webhook] Motor Queswa retornó ${nexusResponse.status}`);
      await sendWhatsAppMessage(phoneNumber, 'Hubo un error procesando tu mensaje. Intenta de nuevo en un momento.');
      return new Response('OK', { status: 200 });
    }

    // ─── 3. Consumir stream text/plain ───────────────────────────────────────
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
    console.log(`💬 [WA Webhook] Queswa responde (${pageContext}): "${queswaReply.slice(0, 80)}..."`);

    // ─── 4. Enviar respuesta al héroe via Meta API ────────────────────────────
    if (queswaReply) {
      await sendWhatsAppMessage(phoneNumber, queswaReply);
    }

    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('❌ [WA Webhook] Error inesperado:', error);
    return new Response('OK', { status: 200 });
  }
}

// ─── Utilidad: enviar mensaje de texto via WhatsApp Cloud API ─────────────────
async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const systemToken   = process.env.WHATSAPP_SYSTEM_TOKEN;

  if (!phoneNumberId || !systemToken) {
    console.error('❌ [WA Webhook] Faltan WHATSAPP_PHONE_NUMBER_ID o WHATSAPP_SYSTEM_TOKEN');
    return;
  }

  const metaUrl = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;

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
    console.error(`❌ [WA Webhook] Error Meta API: ${response.status} — ${errorBody}`);
  } else {
    console.log(`✅ [WA Webhook] Mensaje enviado a ${to}`);
  }
}
