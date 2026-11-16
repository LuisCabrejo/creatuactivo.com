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
 *   Al reservar, Queswa le envía por WhatsApp la confirmación con el enlace
 *   (plantilla confirmacion_evento_v1, src/lib/convocatoria-envios.ts); la
 *   respuesta dice si salió (`whatsappEnviado`). La reserva no depende de eso.
 *   Invitados (body.tipo 'invitado', cupo aparte desde el puesto 101): `ref` es el
 *   constructor_id del socio cuyo enlace usó (se valida contra private_users) o, sin
 *   enlace, `invitadoPor` es el nombre que escribió. Al socio que invitó le llega un
 *   push para su seguimiento. Al distribuidor que no tiene foto en queswa.app se le
 *   responde `sugerirFoto: true` (se cruza su WhatsApp con private_users).
 * POST { evento, horario, silla, nombre, whatsapp } → reserva. La unicidad de la tabla
 *   (evento, horario, silla) reparte la silla: si otra persona la tomó un instante
 *   antes, 409. Un mismo WhatsApp reserva hasta dos sillas por evento (él y quien lo
 *   acompañe). Cada reserva le llega a Luis como push en queswa.app (al tocarlo abre el
 *   panel, /vip/{evento}/panel) y por correo.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { MESAS, PRIMER_PUESTO_INVITADO, enLinea, horaCerrada, horaTexto, nombreValido, normalizarWhatsapp } from '@/lib/mesas';
import type { Mesa } from '@/lib/mesas';
import { clavePanel } from '@/lib/mesas-panel';
import { enlaceReunion } from '@/lib/mesas-reunion';
import { enviarConfirmacion, yaRecibio } from '@/lib/convocatoria-envios';
import { PLANTILLA_CONFIRMACION } from '@/lib/wa-plantillas-convocatoria';

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
async function reservarPuesto(
  mesa: Mesa,
  horario: string,
  nombre: string,
  whatsapp: string,
  invitadoDe: string | null
): Promise<number | null> {
  const desde = invitadoDe ? PRIMER_PUESTO_INVITADO : 1;
  const cupo = invitadoDe ? mesa.cupoInvitados ?? 0 : mesa.sillas;
  for (let intento = 0; intento < 6; intento++) {
    const { data, error } = await getSupabase()
      .from('reservas_mesa')
      .select('silla')
      .eq('evento', mesa.id)
      .eq('horario', horario);
    if (error) throw new Error(error.message);
    const tomadas = new Set(((data || []) as { silla: number }[]).map((f) => f.silla));
    const libre = Array.from({ length: cupo }, (_, i) => desde + i).find((n) => !tomadas.has(n));
    if (!libre) return null;
    const { error: e2 } = await getSupabase()
      .from('reservas_mesa')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert({ evento: mesa.id, horario, silla: libre, nombre, whatsapp, invitado_de: invitadoDe, camara_aceptada_at: new Date().toISOString() } as any);
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
    if (!nombreValido(nombre)) {
      return NextResponse.json({ error: 'Escriba su nombre (con letras, sin números).' }, { status: 400 });
    }
    // En línea, la cámara encendida es condición de entrada (Director, 15 nov 2026):
    // la página la pide con una casilla y aquí se exige y se guarda.
    if (enLinea(mesa) && body?.camara !== true) {
      return NextResponse.json({ error: 'Confirme que entra con la cámara encendida.' }, { status: 400 });
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
      const invitado = body?.tipo === 'invitado' && (mesa.cupoInvitados ?? 0) > 0;

      // Quién invitó: el socio del enlace (validado) o el nombre que escribió.
      let invitadoDe: string | null = null;
      let socioQueInvito: { constructor_id: string; name: string | null } | null = null;
      if (invitado) {
        const ref = String(body?.ref || '').trim().slice(0, 80);
        if (ref) {
          const { data } = await getSupabase()
            .from('private_users')
            .select('constructor_id, name')
            .eq('constructor_id', ref)
            .maybeSingle();
          socioQueInvito = (data as { constructor_id: string; name: string | null } | null) ?? null;
        }
        const escrito = String(body?.invitadoPor || '').trim().replace(/\s+/g, ' ').slice(0, 80);
        if (socioQueInvito) invitadoDe = socioQueInvito.constructor_id;
        else if (escrito.length >= 2) invitadoDe = `texto:${escrito}`;
        else return NextResponse.json({ error: 'Escriba quién lo invitó.' }, { status: 400 });
      }

      // Quien ya reservó con ese WhatsApp recibe su mismo puesto (abrió el enlace dos veces).
      const { data: previa } = await getSupabase()
        .from('reservas_mesa')
        .select('silla')
        .eq('evento', mesa.id)
        .eq('whatsapp', whatsapp)
        .limit(1);
      const yaTenia = (previa as { silla: number }[] | null)?.[0]?.silla;

      // El distribuidor sin foto en queswa.app: se le sugiere ponerla.
      let sugerirFoto = false;
      if (!invitado) {
        const { data: socio } = await getSupabase()
          .from('private_users')
          .select('profile_photo_url')
          .in('whatsapp', [`+${whatsapp}`, whatsapp])
          .limit(1);
        const fila = (socio as { profile_photo_url: string | null }[] | null)?.[0];
        sugerirFoto = !!fila && !(fila.profile_photo_url || '').trim();
      }

      // La confirmación por WhatsApp sale sola al reservar (Director, 16 nov 2026). Quien
      // vuelve a reservar con su número y aún no la tiene, también la recibe.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = getSupabase() as any;
      const confirmar = async () => {
        if (await yaRecibio(db, mesa.id, PLANTILLA_CONFIRMACION, whatsapp)) return true;
        const r = await enviarConfirmacion(db, mesa.id, { whatsapp, nombre, constructor_id: null });
        return !!r?.ok;
      };

      if (yaTenia) {
        const whatsappEnviado = await confirmar();
        return NextResponse.json({ ok: true, puesto: yaTenia, reunion, repetida: true, sugerirFoto, whatsappEnviado });
      }

      const puesto = await reservarPuesto(mesa, horario, nombre, whatsapp, invitadoDe);
      if (!puesto) {
        return NextResponse.json(
          { error: invitado ? 'Los cupos para invitados se completaron.' : 'Los cupos se completaron.', lleno: true },
          { status: 409 }
        );
      }

      const { data: todas } = await getSupabase()
        .from('reservas_mesa')
        .select('silla')
        .eq('evento', mesa.id);
      const puestos = ((todas || []) as { silla: number }[]).map((f) => f.silla);
      const deInvitados = puestos.filter((n) => n >= PRIMER_PUESTO_INVITADO).length;
      const deEquipo = puestos.length - deInvitados;
      const quien = socioQueInvito?.name || (invitadoDe?.startsWith('texto:') ? invitadoDe.slice(6) : null);

      await avisar(mesa, String(body.evento), horario, nombre, whatsapp, {
        titulo: `Taller · ${deEquipo}/${mesa.sillas} equipo · ${deInvitados}/${mesa.cupoInvitados ?? 0} invitados`,
        cuerpo: invitado
          ? `${nombre} reservó como invitado${quien ? ` de ${quien}` : ''}.`
          : `${nombre} reservó su puesto.`,
        asunto: invitado
          ? `Taller · invitado: ${nombre}${quien ? ` (de ${quien})` : ''}`
          : `Taller · puesto ${puesto}: ${nombre}`,
      });

      // Al socio que invitó, para su seguimiento (si no es el mismo anfitrión).
      if (socioQueInvito && socioQueInvito.constructor_id !== mesa.anfitrion) {
        await empujar(socioQueInvito.constructor_id, {
          title: 'Su invitado reservó su puesto',
          body: `${nombre} va al taller de mañana a las ${horaTexto(horario)}. Escríbale para acompañarlo.`,
          url: `https://wa.me/${whatsapp}`,
        });
      }

      const whatsappEnviado = await confirmar();
      return NextResponse.json({ ok: true, puesto, reunion, sugerirFoto, whatsappEnviado });
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
  const llave = clavePanel(mesa.id);
  await empujar(mesa.anfitrion, {
    title: texto.titulo,
    body: texto.cuerpo,
    url: llave
      ? `https://creatuactivo.com/vip/${clave}/panel?clave=${llave}`
      : `https://creatuactivo.com/vip/${clave}`,
  });

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

/** Un push a la app de un socio (queswa.app). No lanza: un aviso caído no tumba la reserva. */
async function empujar(constructorId: string, aviso: { title: string; body: string; url: string }) {
  try {
    const dashboard = process.env.DASHBOARD_URL || 'https://queswa.app';
    const secreto = process.env.WA_BRIDGE_SECRET?.trim();
    await fetch(`${dashboard}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(secreto ? { 'x-push-secret': secreto } : {}) },
      body: JSON.stringify({ constructorId, type: 'new_prospect', ...aviso }),
      signal: AbortSignal.timeout(6000),
    });
  } catch (e) {
    console.error('⚠️ [MESA] push:', e);
  }
}
