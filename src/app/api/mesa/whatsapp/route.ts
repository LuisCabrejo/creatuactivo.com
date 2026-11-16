/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /api/mesa/whatsapp — Queswa le escribe por WhatsApp a la gente de una convocatoria
 * de /vip (taller del 16 nov 2026), operado desde el panel de la convocatoria en el
 * celular del Director, sin la Mac: el token de WhatsApp vive en Vercel.
 *
 * Auth: la llave del panel (`clave`, src/lib/mesas-panel.ts), la misma del enlace
 * del push de cada reserva. Sin ella, 404.
 *
 * GET  ?evento=&clave=                → estado de las dos plantillas (y su categoría)
 *                                       y cuántos faltan por recibir cada una.
 * POST { evento, clave, accion, dry } → accion:
 *   'someter'   somete las plantillas que no existan (la invitación con el flyer;
 *               si la subida de la imagen falla, sin imagen, y lo dice).
 *   'invitar'   la invitación a cada distribuidor activo de queswa.app con WhatsApp
 *               que no se haya inscrito ni la haya recibido ya. Sin el anfitrión.
 *               Los +1 no reciben MARKETING: se listan para enviarlos a mano.
 *   'confirmar' la confirmación con el enlace de Meet a cada inscrito que no la
 *               haya recibido.
 *   'recordar'  el recordatorio de 45 minutos antes, a mano (lo mismo que hace el
 *               cron /api/cron/recordatorio-convocatoria a su hora).
 *   Con dry: true no envía nada: devuelve a quiénes les llegaría.
 *
 * Cada envío queda en `convocatoria_envios` (evento, plantilla, whatsapp): nadie
 * recibe dos veces. Una fila con estado «excluido» saca a esa persona de la lista. Solo se envía una plantilla APROBADA.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MESAS } from '@/lib/mesas';
import { claveValida } from '@/lib/mesas-panel';
import { createTemplate, listTemplates, sendTemplate, subirMuestraPlantilla } from '@/lib/wa-channel';
import { enviarRecordatorio, planRecordatorio, registrarEnvio } from '@/lib/convocatoria-envios';
import {
  CONVOCATORIAS_WA,
  PLANTILLA_CONFIRMACION,
  PLANTILLA_INVITACION,
  PLANTILLA_RECORDATORIO,
  PLANTILLA_ULTIMA_LLAMADA,
  plantillaConfirmacion,
  plantillaInvitacion,
  plantillaRecordatorio,
  plantillaUltimaLlamada,
  primerNombreWa,
} from '@/lib/wa-plantillas-convocatoria';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type Destino = { whatsapp: string; nombre: string; constructor_id: string | null };

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    global: { fetch: (url, init) => fetch(url, { ...init, cache: 'no-store' }) },
  });
}

const digitos = (w: string | null | undefined) => (w || '').replace(/\D/g, '');

function autorizar(evento: string | null, clave: string | null) {
  const mesa = evento ? MESAS[evento] : undefined;
  const datos = mesa ? CONVOCATORIAS_WA[mesa.id] : undefined;
  if (!mesa || !datos || !claveValida(mesa.id, clave)) return null;
  return { mesa, datos };
}

async function plantillas() {
  const { templates, error } = await listTemplates();
  const de = (n: string) => templates.find((t) => t.name === n) ?? null;
  return {
    confirmacion: de(PLANTILLA_CONFIRMACION),
    invitacion: de(PLANTILLA_INVITACION),
    recordatorio: de(PLANTILLA_RECORDATORIO),
    ultimaLlamada: de(PLANTILLA_ULTIMA_LLAMADA),
    todas: templates,
    error,
  };
}

async function yaEnviados(eventoId: string, plantilla: string): Promise<Set<string>> {
  const { data } = await db()
    .from('convocatoria_envios')
    .select('whatsapp')
    .eq('evento', eventoId)
    .eq('plantilla', plantilla)
    // «excluido»: alguien que el Director sacó a mano de la lista (15 nov 2026:
    // la cuenta «Ganocafé Online», que es del negocio y no de una persona).
    .in('estado', ['enviado', 'excluido']);
  return new Set(((data || []) as { whatsapp: string }[]).map((f) => f.whatsapp));
}

async function inscritos(eventoId: string): Promise<{ whatsapp: string; nombre: string }[]> {
  const { data } = await db().from('reservas_mesa').select('whatsapp, nombre').eq('evento', eventoId);
  return ((data || []) as { whatsapp: string; nombre: string }[]).map((r) => ({ whatsapp: digitos(r.whatsapp), nombre: r.nombre }));
}

/** Distribuidores para la invitación: activos, con WhatsApp, sin inscribirse y sin haberla recibido. */
async function destinosInvitacion(eventoId: string, anfitrion: string) {
  const { data } = await db()
    .from('private_users')
    .select('constructor_id, name, whatsapp')
    .eq('role', 'constructor')
    .eq('status', 'active')
    .not('whatsapp', 'is', null);
  const inscritosWa = new Set((await inscritos(eventoId)).map((r) => r.whatsapp));
  const enviados = await yaEnviados(eventoId, PLANTILLA_INVITACION);
  const vistos = new Set<string>();
  const enviar: Destino[] = [];
  const aMano: Destino[] = [];
  let omitidos = 0;
  for (const u of (data || []) as { constructor_id: string | null; name: string | null; whatsapp: string | null }[]) {
    const w = digitos(u.whatsapp);
    if (w.length < 10 || vistos.has(w) || u.constructor_id === anfitrion) continue;
    vistos.add(w);
    if (inscritosWa.has(w) || enviados.has(w)) { omitidos++; continue; }
    const d = { whatsapp: w, nombre: u.name || '', constructor_id: u.constructor_id };
    (w.startsWith('1') ? aMano : enviar).push(d);
  }
  return { enviar, aMano, omitidos };
}

async function destinosConfirmacion(eventoId: string) {
  const enviados = await yaEnviados(eventoId, PLANTILLA_CONFIRMACION);
  const vistos = new Set<string>();
  const enviar: Destino[] = [];
  for (const r of await inscritos(eventoId)) {
    if (vistos.has(r.whatsapp) || enviados.has(r.whatsapp)) continue;
    vistos.add(r.whatsapp);
    enviar.push({ whatsapp: r.whatsapp, nombre: r.nombre, constructor_id: null });
  }
  return { enviar, omitidos: enviados.size };
}

async function registrar(eventoId: string, plantilla: string, d: Destino, r: { ok: boolean; messageId?: string; error?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await registrarEnvio(db() as any, eventoId, plantilla, d, r);
}

const resumen = (t: { status: string; category?: string; headerFormat?: string } | null) =>
  t ? { estado: t.status, categoria: t.category ?? null, conImagen: t.headerFormat === 'IMAGE' } : null;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const ok = autorizar(q.get('evento'), q.get('clave'));
  if (!ok) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  const p = await plantillas();
  const inv = await destinosInvitacion(ok.mesa.id, ok.mesa.anfitrion);
  const conf = await destinosConfirmacion(ok.mesa.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rec = await planRecordatorio(db() as any, ok.mesa.id, ok.mesa.anfitrion, p.todas);
  return NextResponse.json(
    {
      confirmacion: resumen(p.confirmacion),
      invitacion: resumen(p.invitacion),
      recordatorio: resumen(p.recordatorio),
      ultimaLlamada: resumen(p.ultimaLlamada),
      errorMeta: p.error ?? null,
      pendientes: {
        invitacion: inv.enviar.length,
        invitacionAMano: inv.aMano.length,
        confirmacion: conf.enviar.length,
        recordatorioInscritos: rec.inscritos.length,
        recordatorioNoInscritos: rec.noInscritos.length,
      },
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(request: NextRequest) {
  let body: { evento?: string; clave?: string; accion?: string; dry?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }
  const ok = autorizar(body.evento ?? null, body.clave ?? null);
  if (!ok) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  const { mesa, datos } = ok;

  if (body.accion === 'someter') {
    const p = await plantillas();
    const resultados: Record<string, unknown> = {};
    if (p.confirmacion) resultados.confirmacion = { yaExiste: true, ...resumen(p.confirmacion) };
    else resultados.confirmacion = await createTemplate(plantillaConfirmacion());
    if (p.invitacion) {
      resultados.invitacion = { yaExiste: true, ...resumen(p.invitacion) };
    } else {
      const muestra = await subirMuestraPlantilla(datos.flyer);
      const r = await createTemplate(plantillaInvitacion(muestra.handle));
      resultados.invitacion = { ...r, conImagen: !!muestra.handle, errorImagen: muestra.error ?? null };
    }
    if (p.recordatorio) resultados.recordatorio = { yaExiste: true, ...resumen(p.recordatorio) };
    else resultados.recordatorio = await createTemplate(plantillaRecordatorio());
    if (p.ultimaLlamada) resultados.ultimaLlamada = { yaExiste: true, ...resumen(p.ultimaLlamada) };
    else resultados.ultimaLlamada = await createTemplate(plantillaUltimaLlamada());
    return NextResponse.json(resultados);
  }

  if (body.accion === 'recordar') {
    const p = await plantillas();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plan = await planRecordatorio(db() as any, mesa.id, mesa.anfitrion, p.todas);
    if (body.dry) {
      return NextResponse.json({
        dry: true,
        recordatorioAprobado: plan.recordatorioAprobado,
        ultimaLlamadaAprobada: plan.ultimaLlamadaAprobada,
        inscritos: plan.inscritos.map((d) => ({ nombre: d.nombre, whatsapp: d.whatsapp })),
        noInscritos: plan.noInscritos.map((d) => ({ nombre: d.nombre, whatsapp: d.whatsapp })),
        aMano: plan.aMano.map((d) => ({ nombre: d.nombre, whatsapp: d.whatsapp })),
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(await enviarRecordatorio(db() as any, mesa.id, plan));
  }

  if (body.accion === 'invitar' || body.accion === 'confirmar') {
    const invitar = body.accion === 'invitar';
    const nombrePlantilla = invitar ? PLANTILLA_INVITACION : PLANTILLA_CONFIRMACION;
    const lista = invitar ? await destinosInvitacion(mesa.id, mesa.anfitrion) : { ...(await destinosConfirmacion(mesa.id)), aMano: [] as Destino[] };
    const verLista = (l: Destino[]) => l.map((d) => ({ nombre: d.nombre, whatsapp: d.whatsapp }));

    if (body.dry) {
      return NextResponse.json({ dry: true, enviar: verLista(lista.enviar), aMano: verLista(lista.aMano), omitidos: lista.omitidos });
    }

    const p = await plantillas();
    const t = invitar ? p.invitacion : p.confirmacion;
    if (!t || t.status !== 'APPROVED') {
      return NextResponse.json(
        { error: `La plantilla ${nombrePlantilla} todavía no está aprobada (${t?.status ?? 'no existe'}).` },
        { status: 409 }
      );
    }

    let enviados = 0;
    const fallos: { nombre: string; whatsapp: string; error: string }[] = [];
    for (const d of lista.enviar) {
      const nombre = primerNombreWa(d.nombre) || 'socio';
      const r = invitar
        ? await sendTemplate(d.whatsapp, nombrePlantilla, 'es', [nombre], undefined, undefined, t.headerFormat === 'IMAGE' ? datos.flyer : undefined)
        : await sendTemplate(d.whatsapp, nombrePlantilla, 'es', [nombre, datos.eventoTexto, datos.cuandoTexto], datos.codigoMeet);
      await registrar(mesa.id, nombrePlantilla, d, r);
      if (r.ok) enviados++;
      else fallos.push({ nombre: d.nombre, whatsapp: d.whatsapp, error: r.error || 'error' });
    }
    return NextResponse.json({ enviados, fallos, aMano: verLista(lista.aMano), omitidos: lista.omitidos });
  }

  return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 });
}
