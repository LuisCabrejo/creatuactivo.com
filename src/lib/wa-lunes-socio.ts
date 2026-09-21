/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El mensaje de los lunes de Queswa a cada distribuidor.
 *
 * ── DE DÓNDE SALE ─────────────────────────────────────────────────────────────
 *
 * El 14 sep 2026 Meta le mandó al Director, por defecto, su mensaje de lunes de
 * WhatsApp Business. Decisión suya: Queswa hace lo mismo con los socios —les desea
 * la semana y les recuerda para qué está: metas, redactar el mensaje de contacto
 * y resolver dudas antes de que se las hagan a ellos—. El texto es del Director,
 * con familiaridad y sus cuatro emoticones; lo firma el socio del distribuidor.
 *
 * ── LAS REGLAS ────────────────────────────────────────────────────────────────
 *
 * • **Solo distribuidores.** `private_users` activos con WhatsApp y rol
 *   constructor, menos las cuentas de sistema (la tienda, el admin). La lista se
 *   auditó a mano el 14 sep 2026: 20 personas más el Director.
 *
 * • **Texto libre si se puede; plantilla si toca — y la ventana se decide ANTES.**
 *   Dentro de la ventana de 24 h `sendText` entra y no cuesta nada; fuera, la
 *   plantilla `lunes_socio`. ⚠️ No se «intenta texto y se cae a plantilla»: fuera
 *   de ventana la API acepta el texto (200 + wamid) y lo tumba un segundo después
 *   por el webhook (131047). Pasó con el primer envío al Director. La ventana la
 *   dice `wa-ventana.ts` mirando el último mensaje DE LA PERSONA. Meta la clasifica como MARKETING (es Queswa tomando
 *   la iniciativa, no una respuesta a algo pedido): ~90 pesos por envío, y cuenta
 *   contra la calificación del número que atiende a los prospectos.
 *
 * • **Por eso, semanal solo a quien conversa; mensual al que calla.** Quien le ha
 *   escrito a Queswa en los últimos 30 días lo recibe cada lunes. Quien no, cada
 *   cuatro semanas. Insistirle cada semana a quien no contesta es exactamente lo
 *   que Meta lee como spam, y el bloqueo lo paga el número entero.
 *
 * • **Uno por semana, y nunca de madrugada.** La tabla `wa_lunes_socio_envios`
 *   guarda un envío por socio y semana ISO; las horas de silencio (21:00–07:00
 *   Bogotá) se respetan igual que en el cron de acuerdos.
 *
 * • **Queda en el historial.** El envío se anota en `nexus_conversations` con la
 *   huella del socio, para que cuando él responda «soy todo oídos» Queswa vea
 *   que fue ella quien abrió.
 *
 * ⚠️ Un socio que falla NUNCA aborta el lote.
 */

import { sendText, sendTemplate, normalizePhone } from '@/lib/wa-channel';
import { ultimoMensajeDePersona, dentroDeVentana } from '@/lib/wa-ventana';

/** v2 desde el 14 sep 2026: una línea en blanco entre viñetas. `lunes_socio` (v1) quedó sin uso — Meta no dejó editarla dos veces el mismo día. */
export const PLANTILLA_LUNES_SOCIO = 'lunes_socio_v4';

/** Mismo texto que la plantilla (scripts/someter-plantilla-lunes-socio.mjs). Cambiar los dos a la vez. */
export function cuerpoLunesSocio(nombre: string): string {
  return (
    `Hola ${nombre} 👋, espero que esté genial y vamos por una gran semana.\n\n` +
    'Aquí estoy para ayudarle:\n\n' +
    '🎯 A cumplir sus metas.\n\n' +
    '✍️ A redactarle el mensaje para esa persona que tiene en mente.\n\n' +
    '💬 A responderle cualquier duda de los productos o del proyecto, antes de que se la hagan a usted.\n\n' +
    '📲 Estamos en constante innovación para mejorar su experiencia. Le invito a completar su información en Ajustes de Cuenta: así me pongo la 10 para ayudarle con sus objetivos.\n\n' +
    'Soy todo oídos.'
  );
}

/** Cuentas de sistema que viven en private_users con WhatsApp pero no son personas. */
const CORREOS_EXCLUIDOS = new Set(['admin@ganocafe.online', 'sistema@creatuactivo.com']);

const DIAS_CONVERSACION_RECIENTE = 30;
const DIAS_ENTRE_ENVIOS_SI_CALLA = 28;

const OFFSET_BOGOTA_H = -5;
const SILENCIO_DESDE = 21;
const SILENCIO_HASTA = 7;

function bogota(d: Date): Date { return new Date(d.getTime() + OFFSET_BOGOTA_H * 3600_000); }
export function enSilencioBogota(ahora: Date): boolean {
  const h = bogota(ahora).getUTCHours();
  return h >= SILENCIO_DESDE || h < SILENCIO_HASTA;
}
export function esLunesBogota(ahora: Date): boolean { return bogota(ahora).getUTCDay() === 1; }

/** Semana ISO en Bogotá: `2026-W38`. Un envío por socio y semana. */
export function semanaISO(ahora: Date): string {
  const d = bogota(ahora);
  const fecha = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dia = fecha.getUTCDay() || 7;
  fecha.setUTCDate(fecha.getUTCDate() + 4 - dia);
  const inicioAno = new Date(Date.UTC(fecha.getUTCFullYear(), 0, 1));
  const semana = Math.ceil((((fecha.getTime() - inicioAno.getTime()) / 864e5) + 1) / 7);
  return `${fecha.getUTCFullYear()}-W${String(semana).padStart(2, '0')}`;
}

/** Celular colombiano a formato Meta: 10 dígitos que empiezan por 3 → 57 delante. */
export function telefonoMeta(raw: string): string | null {
  const d = normalizePhone(raw);
  if (/^3\d{9}$/.test(d)) return `57${d}`;
  if (/^573\d{9}$/.test(d)) return d;
  return d.length >= 10 ? d : null;
}

export interface Destinatario {
  constructorId: string;
  nombre: string;
  primerNombre: string;
  telefono: string;
  email: string;
}

export interface Decision {
  d: Destinatario;
  accion: 'enviar' | 'omitir';
  motivo: string;
  ultimoMensajeSocio: string | null;
  ultimoEnvio: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supa = any;

export async function destinatarios(supabase: Supa): Promise<Destinatario[]> {
  const { data, error } = await supabase
    .from('private_users')
    .select('constructor_id, name, whatsapp, email, role')
    .eq('status', 'active')
    .eq('role', 'constructor')
    .not('whatsapp', 'is', null)
    .order('name');
  if (error) throw error;
  const out: Destinatario[] = [];
  for (const u of data ?? []) {
    if (CORREOS_EXCLUIDOS.has(String(u.email ?? '').toLowerCase())) continue;
    const telefono = telefonoMeta(String(u.whatsapp));
    if (!telefono) continue;
    const nombre = String(u.name ?? '').replace(/\s+/g, ' ').trim();
    // Capitalizado: hay nombres guardados en mayúscula sostenida («MONICA») y el
    // saludo los repetiría a gritos. Solo la primera letra, con tildes intactas.
    const crudo = nombre.split(' ')[0] || 'buenas';
    const primerNombre = crudo.charAt(0).toLocaleUpperCase('es') + crudo.slice(1).toLocaleLowerCase('es');
    out.push({ constructorId: u.constructor_id, nombre, primerNombre, telefono, email: u.email });
  }
  return out;
}

/** Última vez que ESTE socio le escribió a Queswa por WhatsApp (por teléfono o por huella vinculada). Solo cuentan SUS mensajes, no los nuestros. */
export async function ultimoMensajeDelSocio(supabase: Supa, d: Destinatario): Promise<string | null> {
  const huellas = new Set<string>([`wa_${d.telefono}`]);
  const { data: vinculadas } = await supabase
    .from('device_info')
    .select('fingerprint')
    .eq('socio_constructor_id', d.constructorId);
  for (const v of vinculadas ?? []) if (v.fingerprint) huellas.add(String(v.fingerprint));
  return ultimoMensajeDePersona(supabase, [...huellas]);
}

export async function decidir(supabase: Supa, ahora = new Date()): Promise<Decision[]> {
  const lista = await destinatarios(supabase);
  const semana = semanaISO(ahora);
  const { data: envios, error } = await supabase
    .from('wa_lunes_socio_envios')
    .select('constructor_id, semana, created_at')
    .eq('ok', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  const ultimoEnvioPor = new Map<string, string>();
  const enviadoEstaSemana = new Set<string>();
  for (const e of envios ?? []) {
    if (!ultimoEnvioPor.has(e.constructor_id)) ultimoEnvioPor.set(e.constructor_id, e.created_at);
    if (e.semana === semana) enviadoEstaSemana.add(e.constructor_id);
  }

  const decisiones: Decision[] = [];
  for (const d of lista) {
    const ultimoMensajeSocio = await ultimoMensajeDelSocio(supabase, d);
    const ultimoEnvio = ultimoEnvioPor.get(d.constructorId) ?? null;
    const dias = (t: string | null) => (t ? (ahora.getTime() - new Date(t).getTime()) / 864e5 : Infinity);
    let accion: Decision['accion'] = 'enviar';
    let motivo = dias(ultimoMensajeSocio) <= DIAS_CONVERSACION_RECIENTE ? 'conversa: semanal' : 'primer envío';
    if (enviadoEstaSemana.has(d.constructorId)) { accion = 'omitir'; motivo = 'ya recibió el de esta semana'; }
    else if (dias(ultimoMensajeSocio) > DIAS_CONVERSACION_RECIENTE && dias(ultimoEnvio) < DIAS_ENTRE_ENVIOS_SI_CALLA) {
      accion = 'omitir'; motivo = `sin conversación en ${DIAS_CONVERSACION_RECIENTE} días: mensual (último envío hace ${Math.round(dias(ultimoEnvio))} d)`;
    } else if (dias(ultimoMensajeSocio) > DIAS_CONVERSACION_RECIENTE && ultimoEnvio) {
      motivo = 'no conversa: toca el mensual';
    }
    decisiones.push({ d, accion, motivo, ultimoMensajeSocio, ultimoEnvio });
  }
  return decisiones;
}

export interface ResultadoEnvio {
  constructorId: string;
  nombre: string;
  via: 'texto' | 'plantilla' | null;
  ok: boolean;
  error?: string;
}

/** Manda el mensaje a un destinatario: texto libre si está en ventana, plantilla si no. Registra siempre. */
export async function enviarLunesA(supabase: Supa, d: Destinatario, ahora = new Date(), ultimoMensajeSocio?: string | null): Promise<ResultadoEnvio> {
  const semana = semanaISO(ahora);
  const texto = cuerpoLunesSocio(d.primerNombre);
  const ultimo = ultimoMensajeSocio === undefined ? await ultimoMensajeDelSocio(supabase, d) : ultimoMensajeSocio;
  const enVentana = dentroDeVentana(ultimo, ahora);
  let via: ResultadoEnvio['via'] = enVentana ? 'texto' : 'plantilla';
  let res = enVentana
    ? await sendText(d.telefono, texto)
    : await sendTemplate(d.telefono, PLANTILLA_LUNES_SOCIO, 'es', [d.primerNombre]);
  // Si el texto libre falló en la llamada (no por ventana: eso no falla ahí), la plantilla es el respaldo.
  if (!res.ok && enVentana) {
    res = await sendTemplate(d.telefono, PLANTILLA_LUNES_SOCIO, 'es', [d.primerNombre]);
    via = 'plantilla';
  }
  if (!res.ok) via = null;
  try {
    await supabase.from('wa_lunes_socio_envios').insert({
      constructor_id: d.constructorId, telefono: d.telefono, semana,
      via: via ?? (enVentana ? 'texto' : 'plantilla'), wamid: res.messageId ?? null, ok: res.ok, error: res.ok ? null : (res.error ?? 'desconocido'),
    });
  } catch (err) { console.error('⚠️ [Lunes socio] No se pudo registrar el envío:', err); }
  if (res.ok) {
    try {
      const huella = `wa_${d.telefono}`;
      await supabase.from('nexus_conversations').insert({
        fingerprint_id: huella, session_id: huella,
        messages: [{ role: 'assistant', content: texto, timestamp: ahora.toISOString() }],
      });
    } catch (err) { console.error('⚠️ [Lunes socio] No se pudo anotar en el historial:', err); }
  }
  return { constructorId: d.constructorId, nombre: d.nombre, via, ok: res.ok, error: res.ok ? undefined : res.error };
}

export async function enviarLunes(supabase: Supa, ahora = new Date(), opts: { solo?: string } = {}): Promise<{ decisiones: Decision[]; resultados: ResultadoEnvio[] }> {
  const decisiones = await decidir(supabase, ahora);
  const resultados: ResultadoEnvio[] = [];
  for (const dec of decisiones) {
    if (dec.accion !== 'enviar') continue;
    if (opts.solo && dec.d.constructorId !== opts.solo) continue;
    try {
      resultados.push(await enviarLunesA(supabase, dec.d, ahora, dec.ultimoMensajeSocio));
    } catch (err) {
      console.error(`❌ [Lunes socio] Falló ${dec.d.constructorId}:`, err);
      resultados.push({ constructorId: dec.d.constructorId, nombre: dec.d.nombre, via: null, ok: false, error: String((err as Error)?.message ?? err) });
    }
  }
  return { decisiones, resultados };
}
