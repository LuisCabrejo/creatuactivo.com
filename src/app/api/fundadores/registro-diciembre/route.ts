/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extraer datos del formulario
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const shippingAddress = formData.get('shippingAddress') as string;
    const correspondenceAddress = formData.get('correspondenceAddress') as string;
    const bankEntity = formData.get('bankEntity') as string;
    const accountNumber = formData.get('accountNumber') as string;
    const accountType = formData.get('accountType') as string;

    // Extraer archivos de documento de identidad
    const idDocument1 = formData.get('idDocument1') as File | null;
    const idDocument2 = formData.get('idDocument2') as File | null;

    // Preparar attachments
    const attachments: { filename: string; content: Buffer }[] = [];

    if (idDocument1) {
      const buffer1 = Buffer.from(await idDocument1.arrayBuffer());
      attachments.push({
        filename: `documento_${fullName.replace(/\s+/g, '_')}_1.${idDocument1.name.split('.').pop()}`,
        content: buffer1,
      });
    }

    if (idDocument2) {
      const buffer2 = Buffer.from(await idDocument2.arrayBuffer());
      attachments.push({
        filename: `documento_${fullName.replace(/\s+/g, '_')}_2.${idDocument2.name.split('.').pop()}`,
        content: buffer2,
      });
    }

    // Fecha actual
    const now = new Date();
    const fechaRegistro = now.toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    // Enviar email con Resend
    const { error } = await resend.emails.send({
      from: 'CreaTuActivo <notificaciones@creatuactivo.com>',
      to: ['sistema@creatuactivo.com'],
      replyTo: email,
      subject: `🔥 Nuevo Registro Reto 12 Días - ${fullName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 32px; }
            h1 { color: #f59e0b; margin-bottom: 8px; }
            h2 { color: #60a5fa; font-size: 16px; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #334155; padding-bottom: 8px; }
            .badge { display: inline-block; background: linear-gradient(135deg, #dc2626, #f59e0b); color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-bottom: 16px; }
            .field { margin-bottom: 12px; }
            .label { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .value { color: #ffffff; font-size: 16px; margin-top: 4px; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; text-align: center; }
            .highlight { background: #1e40af20; border: 1px solid #1e40af40; border-radius: 8px; padding: 16px; margin: 16px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="badge">🔥 RETO DE LOS 12 DÍAS</div>
            <h1>Nuevo Registro de Fundador</h1>
            <p style="color: #94a3b8;">Registrado el ${fechaRegistro}</p>

            <h2>👤 Datos Personales</h2>
            <div class="field">
              <div class="label">Nombre Completo</div>
              <div class="value">${fullName}</div>
            </div>
            <div class="field">
              <div class="label">Correo Electrónico</div>
              <div class="value"><a href="mailto:${email}" style="color: #60a5fa;">${email}</a></div>
            </div>
            <div class="field">
              <div class="label">Teléfono / WhatsApp</div>
              <div class="value"><a href="https://wa.me/${phone.replace(/\D/g, '')}" style="color: #22c55e;">${phone}</a></div>
            </div>

            <h2>📍 Direcciones</h2>
            <div class="field">
              <div class="label">Dirección de Envío</div>
              <div class="value">${shippingAddress}</div>
            </div>
            <div class="field">
              <div class="label">Dirección de Correspondencia</div>
              <div class="value">${correspondenceAddress}</div>
            </div>

            <h2>🏦 Datos Bancarios</h2>
            <div class="highlight">
              <div class="field">
                <div class="label">Entidad Bancaria</div>
                <div class="value">${bankEntity}</div>
              </div>
              <div class="field">
                <div class="label">Tipo de Cuenta</div>
                <div class="value">${accountType === 'ahorros' ? 'Cuenta de Ahorros' : 'Cuenta Corriente'}</div>
              </div>
              <div class="field">
                <div class="label">Número de Cuenta</div>
                <div class="value" style="font-family: monospace; font-size: 18px;">${accountNumber}</div>
              </div>
            </div>

            <h2>📎 Documentos Adjuntos</h2>
            <p style="color: #94a3b8;">
              ${attachments.length} archivo(s) de documento de identidad adjuntos a este correo.
            </p>

            <div class="footer">
              <p>Este registro fue enviado desde la página del Reto de los 12 Días</p>
              <p>© ${new Date().getFullYear()} CreaTuActivo.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: attachments,
    });

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // También enviar confirmación al usuario
    await resend.emails.send({
      from: 'CreaTuActivo <notificaciones@creatuactivo.com>',
      to: [email],
      subject: '🔥 ¡Recibimos tu registro para el Reto de los 12 Días!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 32px; }
            h1 { color: #f59e0b; }
            .badge { display: inline-block; background: linear-gradient(135deg, #dc2626, #f59e0b); color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-bottom: 16px; }
            .cta { display: inline-block; background: linear-gradient(135deg, #1e40af, #7c3aed); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 24px; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="badge">🔥 RETO DE LOS 12 DÍAS</div>
            <h1>¡Hola ${fullName.split(' ')[0]}!</h1>

            <p style="font-size: 18px; color: #e2e8f0;">
              Hemos recibido tu registro para el <strong>Reto de los 12 Días</strong>.
            </p>

            <p style="color: #94a3b8;">
              Nuestro equipo revisará tu información y te contactaremos pronto
              para confirmar tu posición como Fundador y darte los siguientes pasos.
            </p>

            <p style="color: #94a3b8;">
              Mientras tanto, prepárate para construir el mejor diciembre de tu vida.
              Recuerda: <strong style="color: #60a5fa;">2 personas</strong> — eso es todo
              lo que necesitas para activar la duplicación.
            </p>

            <p style="text-align: center;">
              <a href="https://creatuactivo.com/proyeccion-fundadores" class="cta">
                Ver Mi Proyección
              </a>
            </p>

            <div class="footer">
              <p>Si tienes alguna pregunta, responde a este correo o contáctanos por WhatsApp.</p>
              <p>© ${new Date().getFullYear()} CreaTuActivo.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing registration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
