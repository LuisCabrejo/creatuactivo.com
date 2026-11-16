/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Envío y registro de los WhatsApp de una convocatoria de /vip (16 nov 2026). Lo
 * usan /api/mesa (la confirmación sale sola en el momento de reservar) y
 * /api/mesa/whatsapp (el panel, para enviar en bloque a quien falte). Cada envío
 * queda en `convocatoria_envios` (evento, plantilla, whatsapp): nadie recibe dos
 * veces, y una fila «excluido» saca a esa persona de la lista.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { sendTemplate } from '@/lib/wa-channel';
import {
  CONVOCATORIAS_WA,
  PLANTILLA_CONFIRMACION,
  PLANTILLA_RECORDATORIO,
  PLANTILLA_ULTIMA_LLAMADA,
  primerNombreWa,
} from '@/lib/wa-plantillas-convocatoria';

export type DestinoEnvio = { whatsapp: string; nombre: string; constructor_id: string | null };
export type ResultadoEnvio = { ok: boolean; messageId?: string; error?: string };

export async function registrarEnvio(
  db: SupabaseClient,
  eventoId: string,
  plantilla: string,
  d: DestinoEnvio,
  r: ResultadoEnvio
) {
  await db
    .from('convocatoria_envios')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .upsert({
      evento: eventoId,
      plantilla,
      whatsapp: d.whatsapp,
      nombre: d.nombre,
      constructor_id: d.constructor_id,
      estado: r.ok ? 'enviado' : 'fallo',
      error: r.ok ? null : (r.error || '').slice(0, 500),
      message_id: r.messageId ?? null,
      enviado_at: new Date().toISOString(),
    } as any);
}

/** ¿Ya la recibió (o se le excluyó)? */
export async function yaRecibio(db: SupabaseClient, eventoId: string, plantilla: string, whatsapp: string) {
  const { data } = await db
    .from('convocatoria_envios')
    .select('estado')
    .eq('evento', eventoId)
    .eq('plantilla', plantilla)
    .eq('whatsapp', whatsapp)
    .in('estado', ['enviado', 'excluido'])
    .limit(1);
  return !!(data && data.length);
}

/**
 * La confirmación con el enlace de la reunión (plantilla UTILITY). Si la
 * convocatoria no tiene plantillas, no hace nada (null). No lanza: la reserva
 * nunca depende de que WhatsApp responda.
 */
export async function enviarConfirmacion(
  db: SupabaseClient,
  eventoId: string,
  d: DestinoEnvio
): Promise<ResultadoEnvio | null> {
  const datos = CONVOCATORIAS_WA[eventoId];
  if (!datos) return null;
  try {
    const r = await sendTemplate(
      d.whatsapp,
      PLANTILLA_CONFIRMACION,
      'es',
      [primerNombreWa(d.nombre) || 'socio', datos.eventoTexto, datos.cuandoTexto],
      datos.codigoMeet
    );
    await registrarEnvio(db, eventoId, PLANTILLA_CONFIRMACION, d, r);
    return r;
  } catch (e) {
    const r = { ok: false, error: e instanceof Error ? e.message : String(e) };
    try {
      await registrarEnvio(db, eventoId, PLANTILLA_CONFIRMACION, d, r);
    } catch {
      /* el registro tampoco tumba la reserva */
    }
    return r;
  }
}

// ─── El recordatorio de 45 minutos antes (16 nov 2026) ────────────────────────

const digitosWa = (w: string | null | undefined) => (w || '').replace(/\D/g, '');

async function recibieron(db: SupabaseClient, eventoId: string, plantilla: string): Promise<Set<string>> {
  const { data } = await db
    .from('convocatoria_envios')
    .select('whatsapp')
    .eq('evento', eventoId)
    .eq('plantilla', plantilla)
    .in('estado', ['enviado', 'excluido']);
  return new Set(((data || []) as { whatsapp: string }[]).map((f) => f.whatsapp));
}

export interface PlanRecordatorio {
  inscritos: DestinoEnvio[];
  noInscritos: DestinoEnvio[];
  /** +1: Meta no les entrega MARKETING. */
  aMano: DestinoEnvio[];
  recordatorioAprobado: boolean;
  ultimaLlamadaAprobada: boolean;
}

/**
 * A quién le toca el recordatorio: los inscritos que no lo han recibido, y los
 * distribuidores activos que no se inscribieron (sin el anfitrión, sin los
 * excluidos de la invitación y sin quien ya recibió la última llamada).
 */
export async function planRecordatorio(
  db: SupabaseClient,
  eventoId: string,
  anfitrion: string,
  plantillas: { name: string; status: string }[]
): Promise<PlanRecordatorio> {
  const aprobada = (n: string) => plantillas.some((t) => t.name === n && t.status === 'APPROVED');

  const { data: reservas } = await db.from('reservas_mesa').select('whatsapp, nombre').eq('evento', eventoId);
  const yaRecordados = await recibieron(db, eventoId, PLANTILLA_RECORDATORIO);
  const inscritosWa = new Set<string>();
  const inscritos: DestinoEnvio[] = [];
  for (const r of (reservas || []) as { whatsapp: string; nombre: string }[]) {
    const w = digitosWa(r.whatsapp);
    if (inscritosWa.has(w)) continue;
    inscritosWa.add(w);
    if (!yaRecordados.has(w)) inscritos.push({ whatsapp: w, nombre: r.nombre, constructor_id: null });
  }

  const { data: socios } = await db
    .from('private_users')
    .select('constructor_id, name, whatsapp')
    .eq('role', 'constructor')
    .eq('status', 'active')
    .not('whatsapp', 'is', null);
  const excluidos = new Set<string>();
  {
    const { data } = await db
      .from('convocatoria_envios')
      .select('whatsapp')
      .eq('evento', eventoId)
      .eq('estado', 'excluido');
    for (const f of (data || []) as { whatsapp: string }[]) excluidos.add(f.whatsapp);
  }
  const yaLlamados = await recibieron(db, eventoId, PLANTILLA_ULTIMA_LLAMADA);
  const vistos = new Set<string>();
  const noInscritos: DestinoEnvio[] = [];
  const aMano: DestinoEnvio[] = [];
  for (const u of (socios || []) as { constructor_id: string | null; name: string | null; whatsapp: string | null }[]) {
    const w = digitosWa(u.whatsapp);
    if (w.length < 10 || vistos.has(w) || u.constructor_id === anfitrion) continue;
    vistos.add(w);
    if (inscritosWa.has(w) || excluidos.has(w) || yaLlamados.has(w)) continue;
    const d = { whatsapp: w, nombre: u.name || '', constructor_id: u.constructor_id };
    (w.startsWith('1') ? aMano : noInscritos).push(d);
  }

  return {
    inscritos,
    noInscritos,
    aMano,
    recordatorioAprobado: aprobada(PLANTILLA_RECORDATORIO),
    ultimaLlamadaAprobada: aprobada(PLANTILLA_ULTIMA_LLAMADA),
  };
}

/**
 * Envía el recordatorio. A los inscritos, con recordatorio_evento_v1; si Meta aún
 * no la aprobó, con la confirmación (ya aprobada: mismo botón y la cámara), para
 * que a nadie le falte el enlace. A los no inscritos, la última llamada, solo si
 * está aprobada (no hay respaldo para ellos). Todo queda registrado con la llave
 * del recordatorio o de la última llamada: nadie lo recibe dos veces.
 */
export async function enviarRecordatorio(db: SupabaseClient, eventoId: string, plan: PlanRecordatorio) {
  const datos = CONVOCATORIAS_WA[eventoId];
  if (!datos) return { inscritos: 0, noInscritos: 0, fallos: [] as { nombre: string; error: string }[], respaldo: false };
  const fallos: { nombre: string; error: string }[] = [];
  let okInscritos = 0;
  let okNoInscritos = 0;

  for (const d of plan.inscritos) {
    const nombre = primerNombreWa(d.nombre) || 'socio';
    const r = plan.recordatorioAprobado
      ? await sendTemplate(d.whatsapp, PLANTILLA_RECORDATORIO, 'es', [nombre, datos.horaTexto, datos.eventoTexto], datos.codigoMeet)
      : await sendTemplate(d.whatsapp, PLANTILLA_CONFIRMACION, 'es', [nombre, datos.eventoTexto, datos.cuandoTexto], datos.codigoMeet);
    await registrarEnvio(db, eventoId, PLANTILLA_RECORDATORIO, d, r);
    if (r.ok) okInscritos++;
    else fallos.push({ nombre: d.nombre, error: r.error || 'error' });
  }

  if (plan.ultimaLlamadaAprobada) {
    for (const d of plan.noInscritos) {
      const r = await sendTemplate(d.whatsapp, PLANTILLA_ULTIMA_LLAMADA, 'es', [primerNombreWa(d.nombre) || 'socio']);
      await registrarEnvio(db, eventoId, PLANTILLA_ULTIMA_LLAMADA, d, r);
      if (r.ok) okNoInscritos++;
      else fallos.push({ nombre: d.nombre, error: r.error || 'error' });
    }
  }

  return { inscritos: okInscritos, noInscritos: okNoInscritos, fallos, respaldo: !plan.recordatorioAprobado };
}
