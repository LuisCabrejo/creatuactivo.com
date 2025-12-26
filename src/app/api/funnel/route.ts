/**
 * Copyright © 2025 CreaTuActivo.com
 * API Funnel - Endpoint para Calculadora y Reto 5 Días
 *
 * Guarda leads del funnel Russell Brunson en Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { Email1Backstory } from '@/emails/soap-opera';

// Lazy initialization de Resend client
let resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
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
    }

    // Enviar primer email de la secuencia (async, no bloquea la respuesta)
    if (data.step === 'calculator_completed' && data.email) {
      sendFirstEmail(data.email, data.name, data.freedomDays).catch(err => {
        console.error('❌ [FUNNEL] Error Email 1:', err);
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
      from: 'CreaTuActivo <notificaciones@creatuactivo.com>',
      to: [email],
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
