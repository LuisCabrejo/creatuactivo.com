/**
 * Test endpoint para enviar emails del Reto 5 Días
 * USO: GET /api/test-reto-email?day=1&email=tu@email.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import {
  Dia1Diagnostico,
  Dia2Vehiculos,
  Dia3Modelo,
  Dia4Estigma,
  Dia5Invitacion,
} from '@/emails/reto-5-dias';

const resend = new Resend(process.env.RESEND_API_KEY);

const emailComponents = {
  1: { Component: Dia1Diagnostico, subject: '🎯 Día 1: Tu métrica más importante' },
  2: { Component: Dia2Vehiculos, subject: '🚗 Día 2: Por qué tu plan no funciona' },
  3: { Component: Dia3Modelo, subject: '📐 Día 3: La fórmula que lo cambió todo' },
  4: { Component: Dia4Estigma, subject: '🎭 Día 4: La verdad incómoda' },
  5: { Component: Dia5Invitacion, subject: '🚀 Día 5: Tu invitación está lista' },
};

export async function GET(request: NextRequest) {
  // 🔒 Protegido — solo para uso interno con CRON_SECRET
  const secret = request.headers.get('x-admin-secret') || request.nextUrl.searchParams.get('secret')
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url);
  const day = parseInt(searchParams.get('day') || '1');
  const email = searchParams.get('email') || 'luiscabrejo7@gmail.com';
  const firstName = searchParams.get('name') || 'Luis';

  if (day < 1 || day > 5) {
    return NextResponse.json({ error: 'Day must be 1-5' }, { status: 400 });
  }

  const config = emailComponents[day as keyof typeof emailComponents];
  
  try {
    const emailHtml = await render(config.Component({ firstName }));

    const { data, error } = await resend.emails.send({
      from: 'Luis de CreaTuActivo <reto@creatuactivo.com>',
      to: [email],
      subject: `[TEST] ${config.subject}`,
      html: emailHtml,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Email Día ${day} enviado a ${email}`,
      emailId: data?.id,
    });

  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
