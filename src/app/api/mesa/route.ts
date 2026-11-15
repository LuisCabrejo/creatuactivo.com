/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /api/mesa — las sillas de una mesa privada (ver src/lib/mesas.ts).
 *
 * GET ?evento=villavicencio → { ocupadas: { "10:00": [1, 3], … }, nombres: { "10:00":
 *   { "1": "Ana" }, … } }. Del nombre sale solo el primero (Director, 10 nov 2026: cada
 *   silla reservada lleva el primer nombre); ni apellidos ni teléfonos salen a la página.
 * En línea (Mesa.modalidad 'en_linea'): el POST no trae silla; el servidor toma el primer
 *   puesto libre y, si otra persona lo tomó un instante antes, prueba el siguiente. La
 *   respuesta trae el enlace de la reunión (src/lib/mesas-reunion.ts), que no está en
 *   la página. Un WhatsApp reserva un solo puesto: si ya reservó, se le devuelve el suyo.
 * POST { evento, horario, silla, nombre, whatsapp } → reserva. La unicidad de la tabla
 *   (evento, horario, silla) reparte la silla: si otra persona la tomó un instante
 *   antes, 409. Un mismo WhatsApp reserva hasta dos sillas por evento (él y quien lo
 *   acompañe). Cada reserva le llega a Luis como push en queswa.app (al tocarlo abre el
 *   panel, /vip/{evento}/panel) y por correo.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { MESAS, enLinea, horaCerrada, horaTexto, normalizarWhatsapp } from '@/lib/mesas';
import type { Mesa } from '@/lib/mesas';
import { clavePanel } from '@/lib/mesas-panel';
import { enlaceReunion } from '@/lib/mesas-reunion';

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

/** «ana maría pérez» → «Ana»: solo el primer nombre, con mayúscula inicial. */
function primerNombre(nombre: string): string {
  const p = (nombre || '').trim().split(/\s+/)[0] || '';
  return p.charAt(0).toLocaleUpperCase('es') + p.slice(1).toLocaleLowerCase('es');
}

const escapar = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export async function GET(request: NextRequest) {
  const clave = request.nextUrl.searchParams.get('evento') || '';
  const mesa = MESAS[clave];
  if (!mesa) return NextResponse.json({ error: 'Mesa no encontrada' }, { status: 404 });

  const { data, error } = await getSupabase()
    .from('reservas_mesa')
    .select('horario, silla, nombre')
    .eq('evento', mesa.id);
  if (error) {
    console.error('❌ [MESA] GET:', error.message);
    return NextResponse.json({ error: 'No se pudo leer' }, { status: 500 });
  }

  const ocupadas: Record<string, number[]> = Object.fromEntries(mesa.horarios.map((h) => [h, []]));
  const nombres: Record<string, Record<number, string>> = Object.fromEntries(mesa.horarios.map((h) => [h, {}]));
  for (const fila of (data || []) as { horario: string; silla: number; nombre: string }[]) {
    if (!ocupadas[fila.horario]) continue;
    ocupadas[fila.horario].push(fila.silla);
    nombres[fila.horario][fila.silla] = primerNombre(fila.nombre);
  }
  return NextResponse.json(
    { ocupadas, nombres },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

/**
 * Reserva en línea: primer puesto libre, con reintento si otra persona lo tomó en el
 * mismo instante. Devuelve el puesto, o null si el cupo se llenó.
 */
async function reservarPuesto(mesa: Mesa, horario: string, nombre: string, whatsapp: string): Promise<number | null> {
  for (let intento = 0; intento < 6; intento++) {
    const { data, error } = await getSupabase()
      .from('reservas_mesa')
      .select('silla')
      .eq('evento', mesa.id)
      .eq('horario', horario);
    if (error) throw new Error(error.message);
    const tomadas = new Set(((data || []) as { silla: number }[]).map((f) => f.silla));
    const libre = Array.from({ length: mesa.sillas }, (_, i) => i + 1).find((n) => !tomadas.has(n));
    if (!libre) return null;
    const { error: e2 } = await getSupabase()
      .from('reservas_mesa')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert({ evento: mesa.id, horario, silla: libre, nombre, whatsapp } as any);
    if (!e2) return libre;
    if (e2.code !== '23505') throw new Error(e2.message);
  }
  throw new Error('Demasiadas reservas al mismo tiempo');
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
    if (!enLinea(mesa) && (!Number.isInteger(silla) || silla < 1 || silla > mesa.sillas)) {
      return NextResponse.json({ error: 'Esa silla no existe.' }, { status: 400 });
    }
    if (nombre.length < 2) {
      return NextResponse.json({ error: 'Escriba su nombre.' }, { status: 400 });
    }
    if (!whatsapp) {
      return NextResponse.json({ error: 'Revise su número de WhatsApp.' }, { status: 400 });
    }
    if (horaCerrada(mesa, horario)) {
      return NextResponse.json(
        { error: enLinea(mesa) ? 'Las inscripciones ya se cerraron.' : 'Esa mesa ya empezó. Elija otra hora.' },
        { status: 409 }
      );
    }

    if (enLinea(mesa)) {
      const reunion = enlaceReunion(mesa.id);
      // Quien ya reservó con ese WhatsApp recibe su mismo puesto (abrió el enlace dos veces).
      const { data: previa } = await getSupabase()
        .from('reservas_mesa')
        .select('silla')
        .eq('evento', mesa.id)
        .eq('whatsapp', whatsapp)
        .limit(1);
      const yaTenia = (previa as { silla: number }[] | null)?.[0]?.silla;
      if (yaTenia) return NextResponse.json({ ok: true, puesto: yaTenia, reunion, repetida: true });

      const puesto = await reservarPuesto(mesa, horario, nombre, whatsapp);
      if (!puesto) {
        return NextResponse.json({ error: 'Los cupos se completaron.', lleno: true }, { status: 409 });
      }
      const { count: tomadas } = await getSupabase()
        .from('reservas_mesa')
        .select('id', { count: 'exact', head: true })
        .eq('evento', mesa.id);
      const libres = Math.max(0, mesa.sillas - (tomadas ?? 0));
      await avisar(mesa, String(body.evento), horario, nombre, whatsapp, {
        titulo: `Taller · ${tomadas ?? '?'} de ${mesa.sillas}`,
        cuerpo: `${nombre} reservó su puesto. ${
          libres === 0 ? 'Los cupos quedaron completos.' : libres === 1 ? 'Queda 1 cupo.' : `Quedan ${libres} cupos.`
        }`,
        asunto: `Taller · puesto ${puesto}: ${nombre}`,
      });
      return NextResponse.json({ ok: true, puesto, reunion });
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

    const { count: tomadas } = await getSupabase()
      .from('reservas_mesa')
      .select('id', { count: 'exact', head: true })
      .eq('evento', mesa.id)
      .eq('horario', horario);
    const libres = Math.max(0, mesa.sillas - (tomadas ?? 0));
    await avisar(mesa, String(body.evento), horario, nombre, whatsapp, {
      titulo: `Mesa VIP · ${horaTexto(horario)}`,
      cuerpo: `${nombre} reservó la silla ${silla}. ${
        libres === 0 ? 'La mesa quedó completa.' : libres === 1 ? 'Queda 1 silla libre.' : `Quedan ${libres} sillas libres.`
      }`,
      asunto: `Mesa ${mesa.ciudad} · ${horaTexto(horario)} · silla ${silla}: ${nombre}`,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('❌ [MESA]', e);
    return NextResponse.json({ error: 'No se pudo reservar. Intente de nuevo.' }, { status: 500 });
  }
}

/**
 * Push a la app de quien presenta (queswa.app), con el panel al tocarlo, y correo.
 * Ninguno de los dos bloquea la reserva.
 */
async function avisar(
  mesa: Mesa,
  clave: string,
  horario: string,
  nombre: string,
  whatsapp: string,
  texto: { titulo: string; cuerpo: string; asunto: string }
) {
  try {
    const llave = clavePanel(mesa.id);
    const dashboard = process.env.DASHBOARD_URL || 'https://queswa.app';
    const secreto = process.env.WA_BRIDGE_SECRET?.trim();
    await fetch(`${dashboard}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(secreto ? { 'x-push-secret': secreto } : {}) },
      body: JSON.stringify({
        constructorId: mesa.anfitrion,
        type: 'new_prospect',
        title: texto.titulo,
        body: texto.cuerpo,
        url: llave
          ? `https://creatuactivo.com/vip/${clave}/panel?clave=${llave}`
          : `https://creatuactivo.com/vip/${clave}`,
      }),
      signal: AbortSignal.timeout(6000),
    });
  } catch (e) {
    console.error('⚠️ [MESA] push:', e);
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'CreaTuActivo Notificaciones <hola@creatuactivo.com>',
      to: [AVISO_EMAIL],
      subject: texto.asunto,
      html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222;line-height:1.6;">
        <p style="margin:0 0 8px;"><strong>Nueva reserva</strong></p>
        <p style="margin:0;">${escapar(mesa.fechaTexto)} · ${escapar(horaTexto(horario))}<br/>
        Nombre: <strong>${escapar(nombre)}</strong><br/>
        WhatsApp: <a href="https://wa.me/${whatsapp}">+${whatsapp}</a><br/>
        Lugar: ${escapar(mesa.lugar)}${mesa.direccion ? `, ${escapar(mesa.ciudad)}` : ''}</p>
      </div>`,
    });
  } catch (e) {
    console.error('⚠️ [MESA] aviso:', e);
  }
}
