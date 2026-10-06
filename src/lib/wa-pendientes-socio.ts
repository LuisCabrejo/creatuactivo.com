/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Los pendientes del socio, en modo Waze (Director, 6 oct 2026).
 *
 * Cada semana, a quien le falte algo en sus Ajustes de Cuenta, Queswa le dice qué
 * le falta para marcarle la ruta completa, y el botón trae lo que le abre cada
 * cosa. La intención es que el socio vea el propósito —llevarlo de donde está a
 * donde quiere estar— y no una lista de tareas: «no importa el costo, lo que
 * requerimos es que los distribuidores desarrollen confianza y cariño con Queswa».
 *
 * Los cuatro pendientes, verificables contra la base (nada que el socio palomee):
 *   destino        → socio_referencias (lo que necesita, la vida que quiere, su razón)
 *   gano           → gano_credentials
 *   foto           → private_users.profile_photo_url
 *   notificaciones → push_subscriptions con is_active
 *
 * ⚠️ En iPhone las notificaciones solo se activan desde la app instalada en la
 * pantalla de inicio, no desde el navegador al que lleva el botón.
 *
 * Plantilla `ruta_pendientes_v1` (scripts/someter-plantilla-destino.mjs); el
 * cron es /api/cron/wa-pendientes-socio, los jueves.
 */

import { sendTemplate, sendReplyButtons, sendCtaUrl, sendText, type WAButton } from '@/lib/wa-channel';
import { dentroDeVentana } from '@/lib/wa-ventana';
import { destinoDelSocio, enlaceAjustes, TEXTO_BOTON_AJUSTES } from '@/lib/wa-destino-socio';
import { destinatarios, ultimoMensajeDelSocio, semanaISO, type Destinatario } from '@/lib/wa-lunes-socio';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supa = any;

export const PLANTILLA_PENDIENTES = 'ruta_pendientes_v1';
export const BOTON_PENDIENTES = 'pendientes_ver';
const B_VER: WAButton = { id: BOTON_PENDIENTES, title: 'Ver qué me abre' };
/** Marca en `nexus_conversations.metadata.nodo`: un envío por socio y semana ISO. */
export const NODO_PENDIENTES = 'ruta_pendientes';

export type Pendiente = 'destino' | 'gano' | 'foto' | 'notificaciones';

export async function pendientesDelSocio(supabase: Supa, constructorId: string): Promise<Pendiente[]> {
  const [destino, { count: gano }, { data: u }, { count: push }] = await Promise.all([
    destinoDelSocio(supabase, constructorId),
    supabase.from('gano_credentials').select('constructor_id', { count: 'exact', head: true }).eq('constructor_id', constructorId),
    supabase.from('private_users').select('profile_photo_url').eq('constructor_id', constructorId).maybeSingle(),
    supabase.from('push_subscriptions').select('id', { count: 'exact', head: true }).eq('constructor_id', constructorId).eq('is_active', true),
  ]);
  const p: Pendiente[] = [];
  if (!destino) p.push('destino');
  if (!gano) p.push('gano');
  if (!String(u?.profile_photo_url ?? '').trim()) p.push('foto');
  if (!push) p.push('notificaciones');
  return p;
}

const NOMBRE: Record<Pendiente, string> = {
  destino: 'su destino',
  gano: 'su contraseña de Gano',
  foto: 'su foto',
  notificaciones: 'activar sus notificaciones',
};

/** «su destino, su foto y activar sus notificaciones» — la variable de la plantilla, en una línea. */
export function listaPendientes(p: Pendiente[]): string {
  const n = p.map(k => NOMBRE[k]);
  return n.length <= 1 ? (n[0] ?? '') : `${n.slice(0, -1).join(', ')} y ${n[n.length - 1]}`;
}

/** El mismo texto de la plantilla, para quien está dentro de la ventana. */
export function cuerpoPendientes(nombre: string, p: Pendiente[]): string {
  return `Hola ${nombre} 👋, estoy en modo Waze para usted y quiero marcarle la ruta completa. En sus Ajustes de Cuenta me falta ${listaPendientes(p)}: cada cosa le abre algo.`;
}

const LO_QUE_ABRE: Record<Pendiente, string> = {
  destino: '🏁 *Su destino:* le marco la ruta hacia la vida que quiere.',
  gano: '🛰️ *Su contraseña de Gano:* veo cómo avanza su sistema y le cargo la compra cuando la necesite, sin entrar al back office.',
  notificaciones: '🔔 *Las notificaciones:* le aviso al instante cuando alguien llega por su enlace.',
  foto: '📸 *Su foto:* es la que ven las personas en las páginas de los videos que usted comparte.',
};
const ORDEN_LO_QUE_ABRE: Pendiente[] = ['destino', 'gano', 'notificaciones', 'foto'];

/** Lo que trae el botón [Ver qué me abre]: solo lo que le falta, cada cosa con lo que le abre. */
export function textoLoQueAbre(p: Pendiente[]): string {
  const lineas = ORDEN_LO_QUE_ABRE.filter(k => p.includes(k)).map(k => LO_QUE_ABRE[k]);
  return `${lineas.join('\n\n')}\n\nTodo se ajusta en un minuto en queswa.app.`;
}

export const SIN_PENDIENTES = 'Ya no le falta nada en sus Ajustes de Cuenta: su ruta está completa.';

/** ¿Tocó [Ver qué me abre]? Por payload y, de respaldo, por el texto exacto. */
export function esBotonPendientes(opcion: string | undefined, texto: string | undefined): boolean {
  return opcion === BOTON_PENDIENTES || (texto ?? '').trim().toLowerCase() === 'ver qué me abre';
}

/** Nodo del webhook: lo que le abre cada pendiente y el botón a sus Ajustes, en la sección que toca. */
export async function atenderVerPendientes(supabase: Supa, telefono: string, constructorId: string): Promise<string> {
  const p = await pendientesDelSocio(supabase, constructorId);
  if (!p.length) { await sendText(telefono, SIN_PENDIENTES); return SIN_PENDIENTES; }
  const texto = textoLoQueAbre(p);
  const seccion = p.includes('destino') ? 'ajustes-destino' as const : p.includes('gano') ? 'ajustes-gano' as const : 'ajustes' as const;
  const url = await enlaceAjustes(constructorId, seccion);
  if (url && (await sendCtaUrl(telefono, texto, TEXTO_BOTON_AJUSTES, url)).ok) return texto;
  const conPregunta = `${texto} ¿Le mando el acceso?`;
  await sendText(telefono, conPregunta);
  return conPregunta;
}

// ─── El envío semanal ─────────────────────────────────────────────────────────

export interface DecisionPendientes { d: Destinatario; pendientes: Pendiente[]; accion: 'enviar' | 'omitir'; motivo: string; ultimoMensaje: string | null }

export async function decidirPendientes(supabase: Supa, ahora = new Date()): Promise<DecisionPendientes[]> {
  const semana = semanaISO(ahora);
  const { data: yaEnviados } = await supabase.from('nexus_conversations').select('fingerprint_id')
    .eq('metadata->>nodo', NODO_PENDIENTES).eq('metadata->>semana', semana);
  const enviados = new Set((yaEnviados ?? []).map((r: { fingerprint_id: string }) => r.fingerprint_id));
  const out: DecisionPendientes[] = [];
  for (const d of await destinatarios(supabase)) {
    const pendientes = await pendientesDelSocio(supabase, d.constructorId);
    const ultimoMensaje = await ultimoMensajeDelSocio(supabase, d);
    let accion: DecisionPendientes['accion'] = 'enviar', motivo = listaPendientes(pendientes);
    if (!pendientes.length) { accion = 'omitir'; motivo = 'no le falta nada'; }
    else if (enviados.has(`wa_${d.telefono}`)) { accion = 'omitir'; motivo = 'ya lo recibió esta semana'; }
    else if (d.telefono.startsWith('1') && !dentroDeVentana(ultimoMensaje, ahora)) { accion = 'omitir'; motivo = 'EE. UU. fuera de ventana: Meta no entrega MARKETING'; }
    out.push({ d, pendientes, accion, motivo, ultimoMensaje });
  }
  return out;
}

export async function enviarPendientesA(supabase: Supa, x: DecisionPendientes, ahora = new Date()): Promise<{ ok: boolean; via: 'texto' | 'plantilla'; error?: string }> {
  const texto = cuerpoPendientes(x.d.primerNombre, x.pendientes);
  const enVentana = dentroDeVentana(x.ultimoMensaje, ahora);
  let via: 'texto' | 'plantilla' = enVentana ? 'texto' : 'plantilla';
  const plantilla = () => sendTemplate(x.d.telefono, PLANTILLA_PENDIENTES, 'es', [x.d.primerNombre, listaPendientes(x.pendientes)], undefined, [{ tipo: 'quick_reply', payload: BOTON_PENDIENTES }]);
  let r = enVentana ? await sendReplyButtons(x.d.telefono, texto, [B_VER]) : await plantilla();
  if (!r.ok && enVentana) { r = await plantilla(); via = 'plantilla'; }
  if (r.ok) {
    const huella = `wa_${x.d.telefono}`;
    await supabase.from('nexus_conversations').insert({
      fingerprint_id: huella, session_id: huella,
      messages: [{ role: 'assistant', content: texto, timestamp: ahora.toISOString() }],
      metadata: { nodo: NODO_PENDIENTES, semana: semanaISO(ahora), via, pendientes: x.pendientes },
    });
  }
  return { ok: r.ok, via, error: r.ok ? undefined : r.error };
}

export async function enviarPendientes(supabase: Supa, ahora = new Date(), opts: { solo?: string } = {}) {
  const decisiones = await decidirPendientes(supabase, ahora);
  const resultados: Array<{ nombre: string; ok: boolean; via: string; error?: string }> = [];
  for (const x of decisiones) {
    if (x.accion !== 'enviar' || (opts.solo && x.d.constructorId !== opts.solo)) continue;
    try { resultados.push({ nombre: x.d.nombre, ...(await enviarPendientesA(supabase, x, ahora)) }); }
    catch (e) { resultados.push({ nombre: x.d.nombre, ok: false, via: '-', error: String((e as Error)?.message ?? e) }); }
  }
  return { decisiones, resultados };
}
