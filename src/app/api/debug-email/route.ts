/**
 * Copyright © 2025 CreaTuActivo.com
 * Debug endpoint para diagnosticar problemas de email
 * TEMPORAL - Eliminar después de debugging
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { Reto5DiasConfirmationEmail } from '@/emails/Reto5DiasConfirmation';

export async function GET(request: NextRequest) {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const testEmail = 'luiscabrejo7@gmail.com'; // Tu email personal

    // Test 1: Verificar que el template renderiza correctamente
    console.log('🧪 Test 1: Renderizando template...');
    let emailHtml: string;
    try {
      emailHtml = await render(
        Reto5DiasConfirmationEmail({ firstName: 'Test' })
      );
      (results.tests as unknown[]).push({
        test: 'Template Render',
        status: 'success',
        htmlLength: emailHtml.length
      });
      console.log('✅ Template renderizado:', emailHtml.length, 'caracteres');
    } catch (renderError: unknown) {
      (results.tests as unknown[]).push({
        test: 'Template Render',
        status: 'failed',
        error: renderError instanceof Error ? renderError.message : 'Unknown error'
      });
      return NextResponse.json(results);
    }

    // Test 2: Enviar desde test@creatuactivo.com (que sabemos funciona)
    console.log('🧪 Test 2: Enviando desde test@...');
    try {
      const { data: data1, error: error1 } = await resend.emails.send({
        from: 'Test CreaTuActivo <test@creatuactivo.com>',
        to: [testEmail],
        subject: '[DEBUG] Test desde test@creatuactivo.com',
        html: '<p>Este es un test desde test@creatuactivo.com</p>',
      });
      (results.tests as unknown[]).push({
        test: 'Send from test@',
        status: error1 ? 'failed' : 'success',
        emailId: data1?.id,
        error: error1?.message
      });
      console.log(error1 ? '❌ Error test@:' : '✅ Enviado test@:', error1?.message || data1?.id);
    } catch (e: unknown) {
      (results.tests as unknown[]).push({
        test: 'Send from test@',
        status: 'exception',
        error: e instanceof Error ? e.message : 'Unknown error'
      });
    }

    // Test 3: Enviar desde notificaciones@creatuactivo.com
    console.log('🧪 Test 3: Enviando desde notificaciones@...');
    try {
      const { data: data2, error: error2 } = await resend.emails.send({
        from: 'CreaTuActivo <notificaciones@creatuactivo.com>',
        to: [testEmail],
        subject: '[DEBUG] Test desde notificaciones@creatuactivo.com',
        html: '<p>Este es un test desde notificaciones@creatuactivo.com</p>',
      });
      (results.tests as unknown[]).push({
        test: 'Send from notificaciones@',
        status: error2 ? 'failed' : 'success',
        emailId: data2?.id,
        error: error2?.message
      });
      console.log(error2 ? '❌ Error notificaciones@:' : '✅ Enviado notificaciones@:', error2?.message || data2?.id);
    } catch (e: unknown) {
      (results.tests as unknown[]).push({
        test: 'Send from notificaciones@',
        status: 'exception',
        error: e instanceof Error ? e.message : 'Unknown error'
      });
    }

    // Test 4: Enviar el template real del Reto desde test@
    console.log('🧪 Test 4: Enviando template real desde test@...');
    try {
      const { data: data3, error: error3 } = await resend.emails.send({
        from: 'CreaTuActivo <test@creatuactivo.com>',
        to: [testEmail],
        subject: '¡Test, tu registro al Reto 5 Días está confirmado!',
        html: emailHtml,
      });
      (results.tests as unknown[]).push({
        test: 'Send Reto template from test@',
        status: error3 ? 'failed' : 'success',
        emailId: data3?.id,
        error: error3?.message
      });
      console.log(error3 ? '❌ Error template:' : '✅ Enviado template:', error3?.message || data3?.id);
    } catch (e: unknown) {
      (results.tests as unknown[]).push({
        test: 'Send Reto template from test@',
        status: 'exception',
        error: e instanceof Error ? e.message : 'Unknown error'
      });
    }

    results.summary = {
      totalTests: (results.tests as unknown[]).length,
      passed: (results.tests as Array<{status: string}>).filter(t => t.status === 'success').length,
      failed: (results.tests as Array<{status: string}>).filter(t => t.status !== 'success').length
    };

    return NextResponse.json(results, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    results.error = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(results, { status: 500 });
  }
}
