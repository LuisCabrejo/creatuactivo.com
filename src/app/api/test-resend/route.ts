// /src/app/api/test-resend/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Iniciando test Resend...');

    // 1. Verificar variable de entorno
    const apiKey = process.env.RESEND_API_KEY;
    console.log('🔑 API Key:', apiKey ? `PRESENTE (${apiKey.substring(0, 8)}...)` : 'NO ENCONTRADA');

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY no configurado en variables de entorno',
        step: 'env_check'
      }, { status: 500 });
    }

    // 2. Importar Resend
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    console.log('📦 Resend client instanciado correctamente');

    // 3. Test básico de envío
    console.log('📧 Enviando email de prueba...');

    const result = await resend.emails.send({
      from: 'Test CreaTuActivo <test@creatuactivo.com>',
      to: 'luiscabrejo7@gmail.com', // Cambia por tu email
      subject: '🧪 Test Resend - Verificación de Sistema',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e40af;">✅ Test Resend Exitoso</h2>
          <p>Este email confirma que Resend está configurado correctamente en CreaTuActivo.com</p>

          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Detalles del test:</strong><br>
            • Fecha: ${new Date().toLocaleString('es-CO')}<br>
            • API Key: ${apiKey.substring(0, 8)}...<br>
            • Servidor: Vercel Functions<br>
          </div>

          <p>Si recibes este email, la configuración DNS y la API de Resend están funcionando perfectamente.</p>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="font-size: 14px; color: #64748b;">
            CreaTuActivo.com - Sistema de Email Testing
          </p>
        </div>
      `
    });

    console.log('✅ Email enviado:', result);

    return NextResponse.json({
      success: true,
      message: 'Email de prueba enviado correctamente',
      emailId: result.data?.id,
      details: {
        from: 'test@creatuactivo.com',
        to: 'luis@creatuactivo.com',
        subject: '🧪 Test Resend - Verificación de Sistema',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ Error en test Resend:', error);

    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.stack,
      step: 'email_send'
    }, { status: 500 });
  }
}

// También permitir POST para mayor flexibilidad
export async function POST(request: NextRequest) {
  return GET(request);
}
