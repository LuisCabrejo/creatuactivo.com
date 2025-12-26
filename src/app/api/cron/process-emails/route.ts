/**
 * Copyright © 2025 CreaTuActivo.com
 * Cron Job - Procesa cola de emails de la Soap Opera Sequence
 *
 * Se ejecuta diariamente a las 9:00 AM (UTC-5 Colombia = 14:00 UTC)
 * Vercel Cron: "0 14 * * *"
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import {
  Email1Backstory,
  Email2Wall,
  Email3Epiphany,
  Email4HiddenPlan,
  Email5Urgency,
  SOAP_OPERA_SEQUENCE,
} from '@/emails/soap-opera';

// Lazy initialization
let resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

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

// Mapeo de componentes
const emailComponents = {
  Email1Backstory,
  Email2Wall,
  Email3Epiphany,
  Email4HiddenPlan,
  Email5Urgency,
};

export async function GET(request: NextRequest) {
  // Verificar que viene de Vercel Cron o es una llamada autorizada
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // En producción, verificar el secret
  if (process.env.NODE_ENV === 'production' && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  console.log('🔄 [CRON] Iniciando procesamiento de cola de emails...');

  try {
    // Obtener leads que necesitan emails (no han completado la secuencia)
    const { data: leads, error } = await getSupabaseClient()
      .from('funnel_leads')
      .select('*')
      .eq('email_sequence_completed', false)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ [CRON] Error obteniendo leads:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      console.log('✅ [CRON] No hay leads pendientes');
      return NextResponse.json({
        success: true,
        message: 'No hay leads pendientes',
        processed: 0,
      });
    }

    console.log(`📋 [CRON] Procesando ${leads.length} leads...`);

    let processed = 0;
    let errors = 0;

    for (const lead of leads) {
      const createdAt = new Date(lead.created_at);
      const now = new Date();
      const daysSinceRegistration = Math.floor(
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      const lastEmailSent = lead.last_email_sent || 0;

      // Encontrar el siguiente email que debe recibir
      const nextEmail = SOAP_OPERA_SEQUENCE.find(
        s => s.id > lastEmailSent && s.delayDays <= daysSinceRegistration
      );

      if (!nextEmail) {
        // Si ya recibió todos los emails, marcar como completado
        if (lastEmailSent >= 5) {
          await getSupabaseClient()
            .from('funnel_leads')
            .update({ email_sequence_completed: true })
            .eq('id', lead.id);
        }
        continue;
      }

      // Enviar el email
      const firstName = lead.name?.split(' ')[0] || 'Hola';
      const Component = emailComponents[nextEmail.component as keyof typeof emailComponents];

      if (!Component) {
        console.error(`❌ [CRON] Componente ${nextEmail.component} no encontrado`);
        errors++;
        continue;
      }

      const subject = nextEmail.subject
        .replace('{{firstName}}', firstName);

      try {
        const { data: emailResult, error: emailError } = await getResendClient().emails.send({
          from: 'CreaTuActivo <noreply@creatuactivo.com>',
          to: lead.email,
          subject: subject,
          react: Component({ firstName, freedomDays: lead.freedom_days || 0 }),
          tags: [{ name: 'sequence', value: 'soap-opera' }],
        });

        if (emailError) {
          console.error(`❌ [CRON] Error enviando email ${nextEmail.id} a ${lead.email}:`, emailError);
          errors++;
          continue;
        }

        // Actualizar tracking
        await getSupabaseClient()
          .from('funnel_leads')
          .update({
            last_email_sent: nextEmail.id,
            last_email_sent_at: new Date().toISOString(),
            email_sequence_completed: nextEmail.id >= 5,
          })
          .eq('id', lead.id);

        console.log(`✅ [CRON] Email ${nextEmail.id} enviado a ${lead.email}`);
        processed++;

      } catch (err) {
        console.error(`❌ [CRON] Exception enviando a ${lead.email}:`, err);
        errors++;
      }

      // Rate limiting: esperar 100ms entre emails
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`✅ [CRON] Completado: ${processed} enviados, ${errors} errores`);

    return NextResponse.json({
      success: true,
      processed,
      errors,
      total: leads.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ [CRON] Error general:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
