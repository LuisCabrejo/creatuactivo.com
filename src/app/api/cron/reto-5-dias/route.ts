/**
 * Copyright © 2025 CreaTuActivo.com
 * Cron Job - Procesa emails del Reto 5 Días
 *
 * Se ejecuta diariamente a las 8:00 AM (UTC-5 Colombia = 13:00 UTC)
 * Vercel Cron: "0 13 * * *"
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import {
  Dia1Diagnostico,
  Dia2Vehiculos,
  Dia3Modelo,
  Dia4Estigma,
  Dia5Invitacion,
} from '@/emails/reto-5-dias';

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

// Configuración de la secuencia (Soap Opera Sequence optimizada v4)
const RETO_5_DIAS_SEQUENCE = [
  { day: 1, subject: '[COORDENADA 01] Diagnóstico Estructural Habilitado', component: 'Dia1Diagnostico' },
  { day: 2, subject: '[COORDENADA 02] El Techo Técnico (Análisis de Escalabilidad)', component: 'Dia2Vehiculos' },
  { day: 3, subject: 'Las 3 promesas que le hice a mi esposa (y las 2 que rompí)', component: 'Dia3Modelo' },
  { day: 4, subject: 'Gané dinero, pero perdí mi vida (La verdad del E-commerce)', component: 'Dia4Estigma' },
  { day: 5, subject: 'Tu turno de cumplir promesas', component: 'Dia5Invitacion' },
];

// Mapeo de componentes
const emailComponents = {
  Dia1Diagnostico,
  Dia2Vehiculos,
  Dia3Modelo,
  Dia4Estigma,
  Dia5Invitacion,
};

export async function GET(request: NextRequest) {
  // Verificar autorización
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (process.env.NODE_ENV === 'production' && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  console.log('🔄 [RETO-CRON] Iniciando procesamiento de emails Reto 5 Días...');

  try {
    // Obtener leads del Reto 5 Días que no han completado la secuencia
    const { data: leads, error } = await getSupabaseClient()
      .from('funnel_leads')
      .select('*')
      .eq('step', 'mapa_registered')
      .or('reto_email_day.is.null,reto_email_day.lt.5')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ [RETO-CRON] Error obteniendo leads:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      console.log('✅ [RETO-CRON] No hay leads pendientes');
      return NextResponse.json({
        success: true,
        message: 'No hay leads pendientes del Reto 5 Días',
        processed: 0,
      });
    }

    console.log(`📋 [RETO-CRON] Procesando ${leads.length} leads del Reto...`);

    let processed = 0;
    let skipped = 0;
    let errors = 0;

    for (const lead of leads) {
      const registeredAt = new Date(lead.created_at);
      const now = new Date();
      const daysSinceRegistration = Math.floor(
        (now.getTime() - registeredAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      // El día actual del reto (1-5, basado en días desde registro)
      // Día 0 = registro (email de confirmación ya enviado)
      // Día 1 = un día después, etc.
      const currentRetoDay = daysSinceRegistration + 1;
      
      // Último email enviado (null o 0 = ninguno del reto)
      const lastEmailDay = lead.reto_email_day || 0;

      // Si ya está en día 5 completado, saltar
      if (lastEmailDay >= 5) {
        skipped++;
        continue;
      }

      // Si el día actual no es mayor al último email, saltar
      // (ya recibió el email de hoy o aún no es hora)
      if (currentRetoDay <= lastEmailDay) {
        skipped++;
        continue;
      }

      // Encontrar el email que corresponde enviar
      // Enviamos el siguiente email después del último enviado
      const nextDay = lastEmailDay + 1;
      
      // No enviar más de un email por día
      if (nextDay > currentRetoDay) {
        skipped++;
        continue;
      }

      // Máximo día 5
      if (nextDay > 5) {
        skipped++;
        continue;
      }

      const emailConfig = RETO_5_DIAS_SEQUENCE.find(e => e.day === nextDay);
      if (!emailConfig) {
        skipped++;
        continue;
      }

      // Enviar el email
      const firstName = lead.name?.split(' ')[0] || 'Hola';
      const Component = emailComponents[emailConfig.component as keyof typeof emailComponents];

      if (!Component) {
        console.error(`❌ [RETO-CRON] Componente ${emailConfig.component} no encontrado`);
        errors++;
        continue;
      }

      try {
        // Optimistic lock: reclamar el registro antes de enviar
        // Si otro proceso ya envió este día, el update devuelve 0 filas → skip
        const { data: claimed } = await getSupabaseClient()
          .from('funnel_leads')
          .update({
            reto_email_day: nextDay,
            reto_last_email_at: new Date().toISOString(),
          })
          .eq('id', lead.id)
          .eq('reto_email_day', lastEmailDay)
          .select('id') as { data: { id: string }[] | null };

        if (!claimed || claimed.length === 0) {
          console.log(`⏭️ [RETO-CRON] Día ${nextDay} ya fue reclamado por otro proceso para ${lead.email}`);
          skipped++;
          continue;
        }

        // id 11-15 para distinguir la secuencia reto vs soap-opera (id 1-5)
        const trackingUrl = `https://creatuactivo.com/api/email-open?e=${Buffer.from(lead.email.toLowerCase()).toString('base64')}&id=${10 + nextDay}`
        const emailHtml = await render(Component({ firstName, trackingUrl }));

        const { error: emailError } = await getResendClient().emails.send({
          from: 'Luis de CreaTuActivo <hola@creatuactivo.com>',
          to: [lead.email],
          replyTo: 'hola@creatuactivo.com',
          subject: emailConfig.subject.replace('{{firstName}}', firstName),
          html: emailHtml,
        });

        if (emailError) {
          console.error(`❌ [RETO-CRON] Error enviando día ${nextDay} a ${lead.email}:`, emailError);
          // Revertir el claim si el email falló
          await getSupabaseClient()
            .from('funnel_leads')
            .update({ reto_email_day: lastEmailDay })
            .eq('id', lead.id);
          errors++;
          continue;
        }

        console.log(`✅ [RETO-CRON] Día ${nextDay} enviado a ${lead.email}`);
        processed++;

      } catch (err) {
        console.error(`❌ [RETO-CRON] Exception enviando a ${lead.email}:`, err);
        errors++;
      }

      // Rate limiting: esperar 550ms entre emails (Resend limit: 2 req/s = 500ms)
      await new Promise(resolve => setTimeout(resolve, 550));
    }

    console.log(`✅ [RETO-CRON] Completado: ${processed} enviados, ${skipped} saltados, ${errors} errores`);

    return NextResponse.json({
      success: true,
      processed,
      skipped,
      errors,
      total: leads.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ [RETO-CRON] Error general:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
