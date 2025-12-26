/**
 * Copyright © 2025 CreaTuActivo.com
 * Test endpoint para diagnosticar emails del funnel
 * DELETE AFTER TESTING
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { Email1Backstory } from '@/emails/soap-opera';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  const testEmail = request.nextUrl.searchParams.get('email') || 'sistema@creatuactivo.com';
  const logs: string[] = [];

  logs.push(`🔍 Test iniciado: ${new Date().toISOString()}`);
  logs.push(`📧 Email destino: ${testEmail}`);
  logs.push(`🔑 RESEND_API_KEY exists: ${!!process.env.RESEND_API_KEY}`);
  logs.push(`🔑 RESEND_API_KEY prefix: ${process.env.RESEND_API_KEY?.substring(0, 8)}...`);

  try {
    // Step 1: Renderizar email
    logs.push('📝 Renderizando Email1Backstory...');

    const emailHtml = await render(
      Email1Backstory({ firstName: 'Test', freedomDays: 5 })
    );

    logs.push(`✅ Email renderizado: ${emailHtml.length} caracteres`);
    logs.push(`📄 Preview HTML: ${emailHtml.substring(0, 200)}...`);

    // Step 2: Enviar email
    logs.push('📤 Enviando email via Resend...');

    const { data, error } = await resend.emails.send({
      from: 'CreaTuActivo <notificaciones@creatuactivo.com>',
      to: [testEmail],
      subject: '[TEST] Email 1 Backstory - Funnel',
      html: emailHtml,
    });

    if (error) {
      logs.push(`❌ Error de Resend: ${JSON.stringify(error)}`);
      return NextResponse.json({
        success: false,
        error: error,
        logs: logs,
      }, { status: 500 });
    }

    logs.push(`✅ Email enviado exitosamente!`);
    logs.push(`📨 ID: ${data?.id}`);

    return NextResponse.json({
      success: true,
      emailId: data?.id,
      logs: logs,
    });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logs.push(`💥 Exception: ${errorMessage}`);
    logs.push(`📚 Stack: ${err instanceof Error ? err.stack : 'N/A'}`);

    return NextResponse.json({
      success: false,
      error: errorMessage,
      logs: logs,
    }, { status: 500 });
  }
}
