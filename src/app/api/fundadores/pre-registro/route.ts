/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * API: Pre-registro Reto 12 Días (Simplificado)
 * Solo captura datos básicos: nombre, email, teléfono, paquete
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import PreRegistroUserEmail from '@/emails/PreRegistroUser';
import PreRegistroAdminEmail from '@/emails/PreRegistroAdmin';

const resend = new Resend(process.env.RESEND_API_KEY);

interface PreRegistroData {
  fullName: string;
  email: string;
  phone: string;
  selectedPackage: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: PreRegistroData = await request.json();
    const { fullName, email, phone, selectedPackage } = data;

    // Validación básica
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Fecha actual en Colombia
    const now = new Date();
    const fechaRegistro = now.toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const firstName = fullName.split(' ')[0];

    // Email para Admin
    const adminEmailHtml = await render(
      PreRegistroAdminEmail({
        fullName,
        email,
        phone,
        selectedPackage: selectedPackage || 'No especificado',
        fechaRegistro,
      })
    );

    const { error: adminError } = await resend.emails.send({
      from: 'CreaTuActivo <notificaciones@creatuactivo.com>',
      to: ['sistema@creatuactivo.com'],
      replyTo: email,
      subject: `🔥 Pre-registro Reto 12 Días - ${fullName}`,
      html: adminEmailHtml,
    });

    if (adminError) {
      console.error('Error sending admin email:', adminError);
      return NextResponse.json({ error: 'Failed to send admin email' }, { status: 500 });
    }

    // Email para Usuario
    const userEmailHtml = await render(
      PreRegistroUserEmail({
        firstName,
        selectedPackage: selectedPackage || 'Por definir',
      })
    );

    await resend.emails.send({
      from: 'CreaTuActivo <notificaciones@creatuactivo.com>',
      to: [email],
      subject: `🎯 ¡${firstName}, tu pre-registro está confirmado!`,
      html: userEmailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing pre-registro:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
