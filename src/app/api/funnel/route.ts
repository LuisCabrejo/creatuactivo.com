/**
 * Copyright © 2025 CreaTuActivo.com
 * API Funnel — Calculadora de Días de Libertad
 *
 * Guarda leads de la calculadora en Supabase y dispara el primer correo
 * de la secuencia Soap Opera. Los funnels reto / mapa-de-salida / diagnóstico
 * de 5 días fueron eliminados (jul 2026); este endpoint conserva solo la
 * calculadora y los eventos de tracking de página.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { Email1Backstory } from '@/emails/soap-opera';

const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://queswa.app'

// Eventos que son solo tracking de página (no requieren email)
const PAGE_VIEW_STEPS = ['vio_pagina_gracias', 'vio_catalogo', 'vio_calculadora', 'vio_bridge_auditoria']

// Notifica al constructor en el dashboard (fire-and-forget)
async function notifyConstructor(constructorId: string, title: string, body: string, url = '/inteligencia/primer-iniciar') {
  fetch(`${DASHBOARD_URL}/api/push/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ constructorId, type: 'new_prospect', title, body, url }),
  }).catch(() => { /* silencioso */ })
}

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
    const isPageViewEvent = PAGE_VIEW_STEPS.includes(data.step)

    // Los eventos de tracking de página solo necesitan fingerprint, no email
    if (!isPageViewEvent) {
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
    }

    // ── Notificaciones push al constructor ───────────────────────────────────
    const constructorRef: string | null = data.constructor_ref || null

    if (data.step === 'vio_pagina_gracias' && constructorRef) {
      notifyConstructor(
        constructorRef,
        `👀 ¡Tu prospecto está en la página de confirmación!`,
        `Alguien llegó a tu página de confirmación. Momento de contactar.`
      )
    }

    if (data.step === 'vio_catalogo' && constructorRef) {
      notifyConstructor(
        constructorRef,
        `🛍️ ¡Un prospecto está viendo tu catálogo!`,
        `Alguien está revisando los productos de Gano Excel en tu enlace.`
      )
    }

    if (data.step === 'vio_calculadora' && constructorRef) {
      notifyConstructor(
        constructorRef,
        `🧮 ¡Tu prospecto está calculando su libertad!`,
        `Alguien referido por ti está usando la Calculadora de Días de Libertad.`
      )
    }

    if (data.step === 'calculator_completed' && constructorRef) {
      const nombre = data.name?.split(' ')[0] || 'Un prospecto'
      notifyConstructor(
        constructorRef,
        `✅ ¡${nombre} completó la Calculadora!`,
        `${nombre} acaba de ver su número de Días de Libertad y entró al embudo.`
      )
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Si es solo evento de página (sin email), registrar y salir
    if (isPageViewEvent) {
      console.log('📍 [FUNNEL] Page view:', data.step, '| fingerprint:', data.fingerprint, '| ref:', constructorRef)

      // Para vio_calculadora: actualizar DB para disparar Supabase Realtime → bell del dashboard
      if (data.step === 'vio_calculadora' && data.fingerprint && constructorRef) {
        ;(async () => {
          const { data: uuidData } = await getSupabaseClient()
            .from('private_users')
            .select('id')
            .eq('constructor_id', constructorRef)
            .maybeSingle()
          const uuid = (uuidData as any)?.id
          if (uuid) {
            await (getSupabaseClient().rpc as any)('update_prospect_data', {
              p_fingerprint_id: data.fingerprint,
              p_data: { interest_level: 5 },
              p_constructor_id: uuid,
            })
            console.log('✅ [FUNNEL] Prospect actualizado por vio_calculadora')
          }
        })().catch(() => {})
      }

      return NextResponse.json({ success: true, message: 'Evento de página registrado' })
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
    if (data.step === 'calculator_completed') {
      prospectData.interest_level = 6;
      prospectData.calculator_completed = true;
      prospectData.calculator_completed_at = new Date().toISOString();
    } else {
      prospectData.interest_level = 4;
    }

    // Resolver el UUID del constructor a partir del constructorRef (slug)
    let constructorUUID: string | null = null
    if (constructorRef) {
      const { data: userData } = await getSupabaseClient()
        .from('private_users')
        .select('id')
        .eq('constructor_id', constructorRef)
        .maybeSingle()
      constructorUUID = (userData as any)?.id || null
      if (constructorUUID) {
        console.log('✅ [FUNNEL] Constructor UUID resuelto:', constructorUUID, 'para ref:', constructorRef)
      } else {
        console.warn('⚠️ [FUNNEL] No se encontró UUID para constructorRef:', constructorRef)
      }
    }

    // Llamar al RPC update_prospect_data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: rpcError } = await (getSupabaseClient().rpc as any)('update_prospect_data', {
      p_fingerprint_id: fingerprint,
      p_data: prospectData,
      p_constructor_id: constructorUUID
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
    const trackingUrl = `https://creatuactivo.com/api/email-open?e=${Buffer.from(email.toLowerCase()).toString('base64')}&id=1`
    const emailHtml = await render(
      Email1Backstory({ firstName, freedomDays: freedomDays || 0, trackingUrl })
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
