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
import { CONVOCATORIAS_WA, PLANTILLA_CONFIRMACION, primerNombreWa } from '@/lib/wa-plantillas-convocatoria';

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
