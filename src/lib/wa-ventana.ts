/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * ¿Está esta persona dentro de la ventana de 24 h de WhatsApp?
 *
 * 🔴 POR QUÉ EXISTE (14 sep 2026). El texto libre fuera de la ventana NO falla en
 * la llamada: la Cloud API responde 200 con un `wamid` y un segundo después manda
 * por el webhook un estado `failed` con el código 131047 («Re-engagement
 * message»). Así que «sendText devolvió ok» no prueba nada, y el patrón «intento
 * texto libre y si falla mando plantilla» deja a la persona SIN mensaje mientras
 * el registro dice entregado. Se vio con el primer envío del mensaje de los lunes:
 * el Director estaba a 40 h de su último mensaje, el texto salió «ok», y en
 * `wa_envios_fallidos` quedó el 131047.
 *
 * La ventana la abre solo un mensaje DE LA PERSONA en las últimas 24 h. Por eso
 * aquí se mira el último turno con `role: 'user'` en `nexus_conversations` (una
 * fila con solo `assistant` —un envío nuestro— no cuenta), por cualquiera de sus
 * huellas: `wa_<teléfono>` y, si es socio, las vinculadas a su cuenta.
 */

const VENTANA_MS = 24 * 3600_000;
/** Margen: Meta cuenta desde que el mensaje llegó a sus servidores, y nosotros desde que lo guardamos. */
const MARGEN_MS = 10 * 60_000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supa = any;

/** Última vez que la persona (por estas huellas) le escribió a Queswa, o null si nunca. */
export async function ultimoMensajeDePersona(supabase: Supa, huellas: string[]): Promise<string | null> {
  if (!huellas.length) return null;
  const { data } = await supabase
    .from('nexus_conversations')
    .select('created_at, messages')
    .in('fingerprint_id', huellas)
    .order('created_at', { ascending: false })
    .limit(8);
  for (const fila of data ?? []) {
    const msgs = Array.isArray(fila.messages) ? fila.messages : [];
    const suyo = msgs.filter((m: { role?: string; timestamp?: string }) => m?.role === 'user');
    if (!suyo.length) continue;
    const ts = suyo[suyo.length - 1]?.timestamp;
    return typeof ts === 'string' && !isNaN(new Date(ts).getTime()) ? ts : fila.created_at;
  }
  return null;
}

export function dentroDeVentana(ultimoMensaje: string | null, ahora = new Date()): boolean {
  if (!ultimoMensaje) return false;
  return ahora.getTime() - new Date(ultimoMensaje).getTime() < VENTANA_MS - MARGEN_MS;
}

/** Atajo por teléfono (huella `wa_<teléfono>`), para quien no tiene cuenta. */
export async function enVentanaPorTelefono(supabase: Supa, telefono: string, ahora = new Date()): Promise<boolean> {
  return dentroDeVentana(await ultimoMensajeDePersona(supabase, [`wa_${telefono}`]), ahora);
}
