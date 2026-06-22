/**
 * Copyright © 2026 CreaTuActivo.com
 * API Subscribe — captura de correos para la newsletter ("Manténgase al día con
 * la IA en los negocios"). Reusa la tabla `funnel_leads` (source: 'newsletter') y,
 * si hay fingerprint, adjunta el correo al prospecto vía update_prospect_data.
 * Envía bienvenida institucional al suscriptor + aviso al equipo (sistema@creatuactivo.com).
 * Reemplaza el CTA de "Diagnóstico de 5 Días" como puerta de entrada suave (jun 2026).
 *
 * Single opt-in. Pendiente (endurecimiento opcional): doble verificación + link de baja
 * con token (hoy la baja es "responder con baja", manual).
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const EQUIPO_EMAIL = process.env.EQUIPO_DIRECTIVO_EMAIL || 'sistema@creatuactivo.com';
const FROM_WELCOME = 'Equipo CreaTuActivo <hola@creatuactivo.com>';
const FROM_NOTIF = 'CreaTuActivo Notificaciones <hola@creatuactivo.com>';

let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseClient;
}

let resendClient: Resend | null = null;
function getResend() {
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

function welcomeHtml(firstName: string | null): string {
  const saludo = firstName ? `Hola ${firstName},` : 'Hola,';
  return `
  <div style="background:#0F1115;padding:40px 0;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:520px;margin:0 auto;background:#15171C;border:1px solid rgba(197,160,89,0.2);border-radius:8px;padding:40px 32px;">
      <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#C5A059;margin:0 0 24px;">CreaTuActivo</p>
      <h1 style="font-family:Georgia,serif;font-size:22px;color:#FFFFFF;margin:0 0 20px;line-height:1.3;">Quedó suscrito.</h1>
      <p style="font-size:15px;line-height:1.7;color:#A3A3A3;margin:0 0 18px;">${saludo}</p>
      <p style="font-size:15px;line-height:1.7;color:#A3A3A3;margin:0 0 18px;">Gracias por suscribirse. Aquí le compartiremos, sin ruido y a su ritmo, cómo se usa la inteligencia artificial para <span style="color:#FFFFFF;">ser dueño de una empresa digital</span> y construir ingresos que no dependen de su presencia.</p>
      <p style="font-size:15px;line-height:1.7;color:#A3A3A3;margin:0 0 28px;">Le escribiremos solo cuando haya algo que valga su tiempo.</p>
      <p style="font-size:15px;line-height:1.7;color:#C5A059;margin:0;">— Equipo CreaTuActivo</p>
      <div style="border-top:1px solid rgba(255,255,255,0.08);margin-top:32px;padding-top:16px;">
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#6B6B5A;margin:0;">Recibió este correo porque se suscribió en creatuactivo.com. Si no desea seguir recibiéndolos, responda a este correo con la palabra "baja".</p>
      </div>
    </div>
  </div>`;
}

function notifHtml(email: string, name: string | null, when: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222;line-height:1.6;">
    <p style="margin:0 0 8px;"><strong>Nuevo suscriptor a la newsletter</strong></p>
    <p style="margin:0;">Correo: <strong>${email}</strong><br/>
    Nombre: ${name || '—'}<br/>
    Origen: newsletter · creatuactivo.com<br/>
    Fecha: ${when}</p>
  </div>`;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const email = (data?.email || '').toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }
    const name = data?.name?.trim() || null;
    const firstName = name ? name.split(' ')[0] : null;
    const fingerprint = data?.fingerprint || null;
    const now = new Date().toISOString();

    // 1) Lista de suscriptores (reusa funnel_leads)
    const { error: leadError } = await getSupabase()
      .from('funnel_leads')
      .upsert(
        { email, name, source: 'newsletter', step: 'newsletter_subscribed', created_at: now, updated_at: now },
        { onConflict: 'email', ignoreDuplicates: false }
      );
    if (leadError) {
      console.error('❌ [SUBSCRIBE] funnel_leads:', leadError.message);
      return NextResponse.json({ error: 'No se pudo guardar' }, { status: 500 });
    }

    // 2) Adjuntar el correo al prospecto si llega su fingerprint (no bloquea)
    if (fingerprint) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (getSupabase().rpc as any)('update_prospect_data', {
          p_fingerprint_id: fingerprint,
          p_data: { email, consent_granted: true, newsletter_optin: true, funnel_source: 'newsletter' },
          p_constructor_id: null,
        });
      } catch { /* opcional */ }
    }

    // 3) Bienvenida al suscriptor (no bloquea la captura)
    try {
      await getResend().emails.send({
        from: FROM_WELCOME,
        to: [email],
        replyTo: 'hola@creatuactivo.com',
        subject: 'Quedó suscrito · CreaTuActivo',
        html: welcomeHtml(firstName),
      });
    } catch (e) {
      console.error('⚠️ [SUBSCRIBE] welcome email:', e);
    }

    // 4) Aviso al equipo (no bloquea)
    try {
      await getResend().emails.send({
        from: FROM_NOTIF,
        to: [EQUIPO_EMAIL],
        replyTo: email,
        subject: `Nuevo suscriptor: ${email}`,
        html: notifHtml(email, name, now),
      });
    } catch (e) {
      console.error('⚠️ [SUBSCRIBE] team notif:', e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('❌ [SUBSCRIBE]', e);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
