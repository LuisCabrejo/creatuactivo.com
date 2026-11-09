/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /api/mesa — las sillas de una mesa privada (ver src/lib/mesas.ts).
 *
 * GET ?evento=villavicencio → { ocupadas: { "10:00": [1, 3], … } }. Solo números de
 *   silla: ni nombres ni teléfonos salen a la página.
 * POST { evento, horario, silla, nombre, whatsapp } → reserva. La unicidad de la tabla
 *   (evento, horario, silla) reparte la silla: si otra persona la tomó un instante
 *   antes, 409. Un mismo WhatsApp reserva hasta dos sillas por evento (él y quien lo
 *   acompañe). Cada reserva le llega a Luis por correo.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { MESAS, horaCerrada, horaTexto, normalizarWhatsapp } from '@/lib/mesas';

export const dynamic = 'force-dynamic';

const AVISO_EMAIL = process.env.EQUIPO_DIRECTIVO_EMAIL || 'sistema@creatuactivo.com';
const MAX_POR_WHATSAPP = 2;

let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseClient;
}

const escapar = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export async function GET(request: NextRequest) {
  const clave = request.nextUrl.searchParams.get('evento') || '';
  const mesa = MESAS[clave];
  if (!mesa) return NextResponse.json({ error: 'Mesa no encontrada' }, { status: 404 });

  const { data, error } = await getSupabase()
    .from('reservas_mesa')
    .select('horario, silla')
    .eq('evento', mesa.id);
  if (error) {
    console.error('❌ [MESA] GET:', error.message);
    return NextResponse.json({ error: 'No se pudo leer' }, { status: 500 });
  }

  const ocupadas: Record<string, number[]> = Object.fromEntries(mesa.horarios.map((h) => [h, []]));
  for (const fila of (data || []) as { horario: string; silla: number }[]) {
    ocupadas[fila.horario]?.push(fila.silla);
  }
  return NextResponse.json(
    { ocupadas },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const mesa = MESAS[String(body?.evento || '')];
    if (!mesa) return NextResponse.json({ error: 'Mesa no encontrada' }, { status: 404 });

    const horario = String(body?.horario || '');
    const silla = Number(body?.silla);
    const nombre = String(body?.nombre || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    const whatsapp = normalizarWhatsapp(String(body?.whatsapp || ''));

    if (!mesa.horarios.includes(horario)) {
      return NextResponse.json({ error: 'Esa hora no existe.' }, { status: 400 });
    }
    if (!Number.isInteger(silla) || silla < 1 || silla > mesa.sillas) {
      return NextResponse.json({ error: 'Esa silla no existe.' }, { status: 400 });
    }
    if (nombre.length < 2) {
      return NextResponse.json({ error: 'Escriba su nombre.' }, { status: 400 });
    }
    if (!whatsapp) {
      return NextResponse.json({ error: 'Revise su número de WhatsApp.' }, { status: 400 });
    }
    if (horaCerrada(mesa, horario)) {
      return NextResponse.json({ error: 'Esa mesa ya empezó. Elija otra hora.' }, { status: 409 });
    }

    const { count } = await getSupabase()
      .from('reservas_mesa')
      .select('id', { count: 'exact', head: true })
      .eq('evento', mesa.id)
      .eq('whatsapp', whatsapp);
    if ((count ?? 0) >= MAX_POR_WHATSAPP) {
      return NextResponse.json(
        { error: 'Ese número ya tiene sus sillas reservadas.' },
        { status: 409 }
      );
    }

    const { error } = await getSupabase()
      .from('reservas_mesa')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert({ evento: mesa.id, horario, silla, nombre, whatsapp } as any);
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Alguien acaba de tomar esa silla. Elija otra.', tomada: true },
          { status: 409 }
        );
      }
      console.error('❌ [MESA] POST:', error.message);
      return NextResponse.json({ error: 'No se pudo reservar. Intente de nuevo.' }, { status: 500 });
    }

    // Aviso a Luis (no bloquea la reserva)
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'CreaTuActivo Notificaciones <hola@creatuactivo.com>',
        to: [AVISO_EMAIL],
        subject: `Mesa ${mesa.ciudad} · ${horaTexto(horario)} · silla ${silla}: ${nombre}`,
        html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222;line-height:1.6;">
          <p style="margin:0 0 8px;"><strong>Nueva reserva de silla</strong></p>
          <p style="margin:0;">${escapar(mesa.fechaTexto)} · ${escapar(horaTexto(horario))} · silla ${silla}<br/>
          Nombre: <strong>${escapar(nombre)}</strong><br/>
          WhatsApp: <a href="https://wa.me/${whatsapp}">+${whatsapp}</a><br/>
          Lugar: ${escapar(mesa.lugar)}, ${escapar(mesa.ciudad)}</p>
        </div>`,
      });
    } catch (e) {
      console.error('⚠️ [MESA] aviso:', e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('❌ [MESA]', e);
    return NextResponse.json({ error: 'No se pudo reservar. Intente de nuevo.' }, { status: 500 });
  }
}
