/**
 * Copyright © 2025 CreaTuActivo.com
 * API Funnel - Endpoint para Calculadora y Reto 5 Días
 *
 * Guarda leads del funnel Russell Brunson en Supabase
 * Envía notificación WhatsApp via Twilio (Sandbox para testing)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { Email1Backstory } from '@/emails/soap-opera';
import { Reto5DiasConfirmationEmail } from '@/emails/Reto5DiasConfirmation';

// Twilio configuration
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

// Lazy initialization de Resend client
let resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// Helper para reintentos con backoff exponencial
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`⏳ Reintento ${attempt + 1}/${maxRetries} en ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

// Lazy initialization de Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseClient;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validaciones básicas
    if (!data.email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    console.log('🎯 [FUNNEL] Lead:', data.email, '| step:', data.step);

    // Generar fingerprint único si no existe
    const crypto = require('crypto');
    const fingerprintData = `${data.email}-${data.whatsapp || ''}-${Date.now()}`;
    const fingerprint = data.fingerprint || crypto.createHash('sha256').update(fingerprintData).digest('hex');

    // Preparar datos para guardar
    const prospectData: Record<string, unknown> = {
      email: data.email.toLowerCase().trim(),
      consent_granted: true,
      funnel_source: data.source || 'calculadora',
      funnel_step: data.step || 'lead_captured',
    };

    // Agregar datos opcionales si existen
    if (data.name) prospectData.name = data.name.trim();
    if (data.whatsapp) {
      prospectData.phone = data.whatsapp.trim();
      prospectData.whatsapp = data.whatsapp.trim();
    }

    // Datos específicos de la calculadora
    if (data.situation) prospectData.calculator_situation = data.situation;
    if (data.monthlyExpenses) prospectData.calculator_expenses = data.monthlyExpenses;
    if (data.passiveIncome) prospectData.calculator_passive_income = data.passiveIncome;
    if (data.freedomDays !== undefined) prospectData.calculator_freedom_days = data.freedomDays;

    // Nivel de interés basado en el paso del funnel
    if (data.step === 'reto_registered') {
      prospectData.interest_level = 8;
      prospectData.reto_registered = true;
      prospectData.reto_registered_at = new Date().toISOString();
    } else if (data.step === 'calculator_completed') {
      prospectData.interest_level = 6;
      prospectData.calculator_completed = true;
      prospectData.calculator_completed_at = new Date().toISOString();
    } else {
      prospectData.interest_level = 4;
    }


    // Llamar al RPC update_prospect_data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rpcResult, error: rpcError } = await (getSupabaseClient().rpc as any)('update_prospect_data', {
      p_fingerprint_id: fingerprint,
      p_data: prospectData,
      p_constructor_id: null // Sin constructor específico para el funnel general
    });

    if (rpcError) {
      console.error('❌ [FUNNEL] Error en RPC:', rpcError);

      // Fallback: insertar directamente en funnel_leads si el RPC falla
      const { error: insertError } = await getSupabaseClient()
        .from('funnel_leads')
        .upsert({
          email: data.email.toLowerCase().trim(),
          name: data.name || null,
          whatsapp: data.whatsapp || null,
          source: data.source || 'calculadora',
          step: data.step || 'lead_captured',
          situation: data.situation || null,
          monthly_expenses: data.monthlyExpenses || null,
          passive_income: data.passiveIncome || null,
          freedom_days: data.freedomDays || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        });

      if (insertError) {
        console.error('❌ [FUNNEL] Error en fallback insert:', insertError);
        return NextResponse.json(
          { error: 'Error guardando datos', details: insertError.message },
          { status: 500 }
        );
      }

      console.log('✅ [FUNNEL] Lead guardado (fallback)');
    } else {
      console.log('✅ [FUNNEL] Lead guardado');

      // También guardar en funnel_leads para tracking de emails
      await getSupabaseClient()
        .from('funnel_leads')
        .upsert({
          email: data.email.toLowerCase().trim(),
          name: data.name || null,
          whatsapp: data.whatsapp || null,
          source: data.source || 'calculadora',
          step: data.step || 'lead_captured',
          situation: data.situation || null,
          monthly_expenses: data.monthlyExpenses || null,
          passive_income: data.passiveIncome || null,
          freedom_days: data.freedomDays || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email',
          ignoreDuplicates: false
        });
    }

    // Enviar primer email de la secuencia (async, no bloquea la respuesta)
    if (data.step === 'calculator_completed' && data.email) {
      sendFirstEmail(data.email, data.name, data.freedomDays).catch(err => {
        console.error('❌ [FUNNEL] Error Email 1:', err);
      });
    }

    // Enviar WhatsApp de bienvenida para Reto 5 Días (async, no bloquea la respuesta)
    if (data.step === 'reto_registered' && data.whatsapp) {
      sendWhatsAppMessage(data.whatsapp, data.name).catch(err => {
        console.error('❌ [FUNNEL] Error WhatsApp:', err);
      });
    }

    // Enviar email de confirmación para Reto 5 Días
    if (data.step === 'reto_registered' && data.email) {
      sendRetoWelcomeEmail(data.email, data.name, data.whatsapp || null).catch(err => {
        console.error('❌ [FUNNEL] Error Email Reto:', err);
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Lead guardado exitosamente',
      fingerprint: fingerprint
    });

  } catch (error) {
    console.error('❌ [FUNNEL] Error general:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función para enviar WhatsApp via Twilio
async function sendWhatsAppMessage(
  to: string,
  name: string | null
) {
  // Verificar configuración de Twilio
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.log('⚠️ [WHATSAPP] Twilio no configurado, saltando envío');
    return;
  }

  // Formatear número (asegurar formato internacional)
  let phoneNumber = to.replace(/\D/g, ''); // Solo números
  if (phoneNumber.startsWith('57') && phoneNumber.length === 12) {
    // Ya tiene código de país Colombia
  } else if (phoneNumber.length === 10) {
    phoneNumber = '57' + phoneNumber; // Agregar código Colombia
  }

  const whatsappTo = `whatsapp:+${phoneNumber}`;
  const firstName = name?.split(' ')[0] || 'Hola';

  // Mensaje de bienvenida al Reto 5 Días
  // Nota: En sandbox solo podemos usar templates pre-aprobados
  // Para mensajes personalizados necesitamos WhatsApp Business API en producción

  try {
    // Usar la API de Twilio con autenticación Account SID + Auth Token
    const credentials = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: TWILIO_WHATSAPP_FROM,
          To: whatsappTo,
          // Mensaje directo para sandbox (no requiere template aprobado)
          Body: `¡Hola ${firstName}! 👋

Bienvenido al Reto 5 Días de CreaTuActivo.

Tu registro está confirmado. Mañana recibirás el Día 1: "El Diagnóstico".

Guarda este número para no perderte ningún mensaje.

- Luis de CreaTuActivo`,
        }).toString(),
      }
    );

    const result = await response.json();

    if (response.ok) {
      console.log('✅ [WHATSAPP] Mensaje enviado a', whatsappTo, '| SID:', result.sid);
    } else {
      console.error('❌ [WHATSAPP] Error:', result.message || result);
    }
  } catch (err) {
    console.error('❌ [WHATSAPP] Exception:', err);
  }
}

// Función para enviar email de bienvenida al Reto 5 Días
async function sendRetoWelcomeEmail(
  email: string,
  name: string | null,
  whatsapp: string | null
) {
  const firstName = name?.split(' ')[0] || 'Hola';

  try {
    const emailHtml = await render(
      Reto5DiasConfirmationEmail({ firstName })
    );

    // Usar withRetry para manejar timeouts temporales
    const result = await withRetry(async () => {
      const { data, error } = await getResendClient().emails.send({
        from: 'Luis de CreaTuActivo <hola@creatuactivo.com>',
        to: [email],
        replyTo: 'hola@creatuactivo.com',
        subject: `¡${firstName}, tu registro al Reto 5 Días está confirmado!`,
        html: emailHtml,
      });

      if (error) {
        throw new Error(error.message || 'Error enviando email');
      }

      return data;
    }, 3, 1000); // 3 reintentos, empezando con 1s de delay

    console.log('📧 [EMAIL RETO] Enviado a', email, '| ID:', result?.id);

    // Actualizar el lead con el tracking
    await getSupabaseClient()
      .from('funnel_leads')
      .update({
        last_email_sent: 0, // Email 0 = bienvenida
        last_email_sent_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase());

    // Enviar notificación al admin
    await sendAdminNotification(email, name, whatsapp);

  } catch (err) {
    console.error('❌ [EMAIL RETO] Exception:', err);
  }
}

// Función para notificar al admin de nuevo registro
async function sendAdminNotification(
  userEmail: string,
  name: string | null,
  whatsapp: string | null
) {
  const firstName = name?.split(' ')[0] || 'Sin nombre';
  const phoneClean = whatsapp?.replace(/\D/g, '') || '';
  const fechaRegistro = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const adminHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; background-color: #0f172a; color: #f8fafc;">
      <div style="margin-bottom: 24px;">
        <span style="color: #f59e0b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Reto 5 Días</span>
        <h1 style="margin: 8px 0 0; color: #f8fafc; font-size: 28px; font-weight: 700;">Nuevo Registro</h1>
        <p style="margin: 8px 0 0; color: #64748b; font-size: 14px;">${fechaRegistro}</p>
      </div>

      <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <p style="margin: 0 0 16px; color: #f8fafc; font-size: 14px; font-weight: 600;">Datos del Prospecto</p>

        <p style="margin: 0 0 4px; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Nombre</p>
        <p style="margin: 0 0 16px; color: #f8fafc; font-size: 16px;">${name || 'No proporcionado'}</p>

        <p style="margin: 0 0 4px; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Correo</p>
        <p style="margin: 0 0 16px;"><a href="mailto:${userEmail}" style="color: #3b82f6; font-size: 16px; text-decoration: none;">${userEmail}</a></p>

        <p style="margin: 0 0 4px; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">WhatsApp</p>
        <p style="margin: 0;"><a href="https://wa.me/${phoneClean}" style="color: #22c55e; font-size: 16px; text-decoration: none;">${whatsapp || 'No proporcionado'}</a></p>
      </div>

      ${phoneClean ? `
      <div style="margin-bottom: 24px;">
        <a href="https://wa.me/${phoneClean}?text=Hola%20${encodeURIComponent(firstName)}%2C%20soy%20Luis%20de%20CreaTuActivo.%20Vi%20que%20te%20registraste%20en%20el%20Reto%20de%205%20D%C3%ADas.%20%C2%BFTienes%20alguna%20pregunta%3F"
           style="display: block; background-color: #22c55e; color: #ffffff; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center;">
          Contactar por WhatsApp
        </a>
      </div>
      ` : ''}

      <hr style="border: none; border-top: 1px solid #334155; margin: 0 0 24px;">
      <p style="margin: 0; color: #64748b; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} CreaTuActivo.com - Sistema de Notificaciones</p>
    </div>
  `;

  try {
    const { error } = await getResendClient().emails.send({
      from: 'CreaTuActivo Notificaciones <hola@creatuactivo.com>',
      to: ['luiscabrejo7@gmail.com', 'notificaciones@creatuactivo.com'],
      subject: `🎯 Nuevo registro Reto 5 Días: ${firstName}`,
      html: adminHtml,
    });

    if (error) {
      console.error('❌ [ADMIN NOTIFY] Error:', error);
    } else {
      console.log('✅ [ADMIN NOTIFY] Notificación enviada para', userEmail);
    }
  } catch (err) {
    console.error('❌ [ADMIN NOTIFY] Exception:', err);
  }
}

// Función para enviar el primer email de la secuencia
async function sendFirstEmail(
  email: string,
  name: string | null,
  freedomDays: number | null
) {
  const firstName = name?.split(' ')[0] || 'Hola';

  try {
    const emailHtml = await render(
      Email1Backstory({ firstName, freedomDays: freedomDays || 0 })
    );

    const { data, error } = await getResendClient().emails.send({
      from: 'Luis de CreaTuActivo <hola@creatuactivo.com>',
      to: [email],
      replyTo: 'hola@creatuactivo.com',
      subject: `${firstName}, tu resultado + mi historia`,
      html: emailHtml,
    });

    if (error) {
      console.error('❌ [EMAIL] Error:', error);
      return;
    }

    console.log('📧 [EMAIL] Enviado a', email, '| ID:', data?.id);

    // Actualizar el lead con el tracking
    await getSupabaseClient()
      .from('funnel_leads')
      .update({
        last_email_sent: 1,
        last_email_sent_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase());

  } catch (err) {
    console.error('❌ [EMAIL] Exception:', err);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
