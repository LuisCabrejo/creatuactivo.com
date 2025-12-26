/**
 * Copyright © 2025 CreaTuActivo.com
 * API para enviar emails de la Soap Opera Sequence
 *
 * Puede ser llamado por:
 * - Cron job (Vercel Cron o similar)
 * - Manualmente para testing
 * - Trigger desde otro servicio
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
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

export async function POST(request: NextRequest) {
  try {
    const { action, email, emailNumber, firstName, freedomDays } = await request.json();

    // Enviar un email específico (para testing o triggers directos)
    if (action === 'send_single') {
      if (!email || !emailNumber) {
        return NextResponse.json(
          { error: 'email y emailNumber son requeridos' },
          { status: 400 }
        );
      }

      const result = await sendSingleEmail({
        to: email,
        emailNumber,
        firstName: firstName || 'Hola',
        freedomDays: freedomDays || 0,
      });

      return NextResponse.json(result);
    }

    // Procesar cola de emails pendientes
    if (action === 'process_queue') {
      const result = await processEmailQueue();
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'action inválida. Usar: send_single o process_queue' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ [EMAIL] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Enviar un email específico
async function sendSingleEmail({
  to,
  emailNumber,
  firstName,
  freedomDays,
}: {
  to: string;
  emailNumber: number;
  firstName: string;
  freedomDays: number;
}) {
  const sequenceItem = SOAP_OPERA_SEQUENCE.find(s => s.id === emailNumber);
  if (!sequenceItem) {
    return { success: false, error: `Email ${emailNumber} no encontrado en la secuencia` };
  }

  const Component = emailComponents[sequenceItem.component as keyof typeof emailComponents];
  if (!Component) {
    return { success: false, error: `Componente ${sequenceItem.component} no encontrado` };
  }

  // Preparar subject con variables
  const subject = sequenceItem.subject.replace('{{firstName}}', firstName);

  try {
    const { data, error } = await getResendClient().emails.send({
      from: 'CreaTuActivo <noreply@creatuactivo.com>',
      to: to,
      subject: subject,
      react: Component({ firstName, freedomDays }),
      tags: [{ name: 'sequence', value: 'soap-opera' }],
    });

    if (error) {
      console.error(`❌ [EMAIL] Error enviando email ${emailNumber}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`✅ [EMAIL] Email ${emailNumber} enviado a ${to}:`, data?.id);
    return { success: true, emailId: data?.id, emailNumber };

  } catch (err) {
    console.error(`❌ [EMAIL] Exception enviando email ${emailNumber}:`, err);
    return { success: false, error: String(err) };
  }
}

// Procesar cola de emails pendientes
async function processEmailQueue() {
  console.log('🔄 [EMAIL] Procesando cola de emails...');

  // Obtener leads que necesitan recibir emails
  const { data: leads, error } = await getSupabaseClient()
    .from('funnel_leads')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ [EMAIL] Error obteniendo leads:', error);
    return { success: false, error: error.message, processed: 0 };
  }

  if (!leads || leads.length === 0) {
    return { success: true, message: 'No hay leads pendientes', processed: 0 };
  }

  let processed = 0;
  let errors = 0;

  for (const lead of leads) {
    // Calcular qué email debe recibir basado en la fecha de registro
    const createdAt = new Date(lead.created_at);
    const now = new Date();
    const daysSinceRegistration = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Determinar el último email enviado (si tenemos tracking)
    const lastEmailSent = lead.last_email_sent || 0;

    // Encontrar el siguiente email a enviar
    const nextEmail = SOAP_OPERA_SEQUENCE.find(
      s => s.id > lastEmailSent && s.delayDays <= daysSinceRegistration
    );

    if (nextEmail) {
      const result = await sendSingleEmail({
        to: lead.email,
        emailNumber: nextEmail.id,
        firstName: lead.name?.split(' ')[0] || 'Hola',
        freedomDays: lead.freedom_days || 0,
      });

      if (result.success) {
        // Actualizar el lead con el último email enviado
        await getSupabaseClient()
          .from('funnel_leads')
          .update({
            last_email_sent: nextEmail.id,
            last_email_sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', lead.id);

        processed++;
      } else {
        errors++;
      }
    }
  }

  console.log(`✅ [EMAIL] Procesamiento completado: ${processed} enviados, ${errors} errores`);
  return { success: true, processed, errors, total: leads.length };
}

// GET para health check o testing manual
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    sequence: SOAP_OPERA_SEQUENCE.map(s => ({
      id: s.id,
      name: s.name,
      delayDays: s.delayDays,
    })),
    usage: {
      send_single: 'POST { action: "send_single", email: "...", emailNumber: 1-5 }',
      process_queue: 'POST { action: "process_queue" }',
    },
  });
}
