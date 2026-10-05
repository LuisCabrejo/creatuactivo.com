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

import { sendTemplate, sendReplyButtons, normalizePhone, type WAButton, type BotonPlantilla, type WAResult } from '@/lib/wa-channel';
import {
  destinoDelSocio, datosFormulario, tokenFormulario, formatoPesos, razonParaPlantilla, enviarFormularioDestino,
  type DestinoSocio,
} from '@/lib/wa-destino-socio';

export { destinoDelSocio } from '@/lib/wa-destino-socio';
import { ultimoMensajeDePersona, dentroDeVentana } from '@/lib/wa-ventana';

/**
 * Una plantilla nueva cada semana (Director, 20 sep 2026).
 *
 * v7 (5 oct 2026) — el MODO WAZE, en DOS plantillas según lo que el socio tenga
 * anotado en Ajustes de Cuenta (`socio_referencias`; ver wa-destino-socio.ts):
 *   • `lunes_socio_v7_ruta` — quien anotó las tres (lo que necesita al mes, la
 *     vida que quiere y su razón): su punto de partida, su destino y su razón con
 *     SUS cifras y SUS palabras · [Actualizar destino] abre el formulario con lo
 *     suyo ya escrito. Sin recordatorio: no tiene nada pendiente.
 *   • `lunes_socio_v7` — los demás: «¿Ya conoce mi modo Waze?» · [Anotarlo
 *     ahora] abre el formulario «Su destino» sin salir de WhatsApp ·
 *     [Recuérdemelo a las 2].
 * Lo que el Director descartó al verlo completo: ofrecerle al socio con destino
 * «¿a quién tiene en mente? Le redacto el mensaje» —el mensaje es de PROPÓSITO,
 * no de tareas— y mandarlo a queswa.app a anotar, con el inicio de sesión de por
 * medio. Las v6 (botones de respuesta) quedaron aprobadas y sin uso.
 * Textos sometidos con `scripts/someter-plantilla-lunes-socio.mjs`; cambiar los
 * dos lados a la vez.
 */
// v8: las mismas de v7, con el botón atado al formulario `destino_socio_v2`.
export const PLANTILLA_LUNES_SOCIO = 'lunes_socio_v8';
export const PLANTILLA_LUNES_RUTA = 'lunes_socio_v8_ruta';

/** Lo que devuelve cada botón de respuesta (payload de la plantilla e id del interactivo). Los atiende el nodo 1.39 del webhook. */
export const BOTON_LUNES = {
  anotar: 'lunes_waze_anotar',
  recordar: 'lunes_waze_recordar',
} as const;

const B_ANOTAR: WAButton = { id: BOTON_LUNES.anotar, title: 'Anotarlo ahora' };
const B_RECORDAR: WAButton = { id: BOTON_LUNES.recordar, title: 'Recuérdemelo a las 2' };

/** Texto del mensaje con destino — el mismo de la plantilla `lunes_socio_v7_ruta`. */
export function cuerpoLunesRuta(nombre: string, destino: DestinoSocio): string {
  return (
    `Hola ${nombre} 👋, iniciamos semana y estoy en modo Waze para usted: sé de dónde parte y a dónde va.\n\n` +
    `📍 Punto de partida: lo que necesita hoy, ${formatoPesos(destino.gastoMes)} al mes.\n\n` +
    `🏁 Destino: la vida que quiere, ${formatoPesos(destino.vidaMes)} al mes.\n\n` +
    `❤️ Su razón: «${razonParaPlantilla(destino.razon)}».\n\n` +
    'Ese es el destino con el que trabajo para usted. Cuando quiera, aquí estoy; y si su destino cambió, lo actualizamos en un minuto.'
  );
}

/** Texto del gancho — el mismo de la plantilla `lunes_socio_v7`. */
export function cuerpoLunesSocio(nombre: string): string {
  return (
    `Hola ${nombre} 👋, iniciamos semana. ¿Ya conoce mi modo Waze?\n\n` +
    'Igual que Waze, le marco la ruta hacia donde usted quiere llegar. Solo me falta saber a dónde va: lo que necesita al mes, la vida que quiere y su razón.\n\n' +
    'Son tres datos y un minuto, aquí mismo. Si hoy está a mil, se lo recuerdo a las 2 p. m.'
  );
}

/**
 * El mensaje que le toca a cada socio: el texto (para el historial), cómo va por
 * plantilla y cómo va dentro de la ventana, donde sale igual y sin costo.
 */
export function mensajeLunes(d: { primerNombre: string; constructorId: string; telefono: string }, destino: DestinoSocio | null) {
  const token = tokenFormulario(d.constructorId);
  const datos = datosFormulario(destino);
  if (destino) {
    const texto = cuerpoLunesRuta(d.primerNombre, destino);
    return {
      texto,
      plantilla: PLANTILLA_LUNES_RUTA,
      parametros: [d.primerNombre, formatoPesos(destino.gastoMes), formatoPesos(destino.vidaMes), razonParaPlantilla(destino.razon)],
      botones: [{ tipo: 'flow', token, data: datos }] as BotonPlantilla[],
      enVentana: (): Promise<WAResult> => enviarFormularioDestino(d.telefono, d.constructorId, destino, texto, 'Actualizar destino'),
    };
  }
  const texto = cuerpoLunesSocio(d.primerNombre);
  return {
    texto,
    plantilla: PLANTILLA_LUNES_SOCIO,
    parametros: [d.primerNombre],
    botones: [{ tipo: 'flow', token, data: datos }, { tipo: 'quick_reply', payload: BOTON_LUNES.recordar }] as BotonPlantilla[],
    // Un mensaje interactivo lleva formulario O botones, no los dos: dentro de la
    // ventana van los dos botones, y [Anotarlo ahora] trae el formulario (nodo 1.39).
    enVentana: (): Promise<WAResult> => sendReplyButtons(d.telefono, texto, [B_ANOTAR, B_RECORDAR]),
  };
}

// ─── Lo que pasa cuando toca un botón (nodo 1.39 del webhook) ─────────────────

/** ¿El mensaje es uno de los botones del lunes? Por id/payload y, de respaldo, por el texto exacto del botón. */
export function botonDelLunes(opcion: string | undefined, texto: string | undefined): keyof typeof BOTON_LUNES | null {
  for (const [k, id] of Object.entries(BOTON_LUNES)) if (opcion === id) return k as keyof typeof BOTON_LUNES;
  const t = (texto ?? '').trim().toLowerCase();
  if (t === 'anotarlo ahora') return 'anotar';
  if (t === 'recuérdemelo a las 2' || t === 'recuerdemelo a las 2') return 'recordar';
  return null;
}

/** El cuerpo del formulario cuando se pide dentro de la conversación. */
export const CUERPO_FORMULARIO = 'Son tres datos y un minuto, y quedan guardados en sus Ajustes de Cuenta de queswa.app.';

/** Las 2 p. m. de Bogotá de hoy; si ya pasaron, las de mañana. */
export function proximasDosPM(ahora: Date): { cuando: Date; manana: boolean } {
  const b = bogota(ahora);
  const hoy = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate(), 14 - OFFSET_BOGOTA_H);
  const manana = ahora.getTime() >= hoy;
  return { cuando: new Date(manana ? hoy + 864e5 : hoy), manana };
}

export function respuestaRecordar(manana: boolean): string {
  return manana ? 'Listo. Mañana a las 2 p. m. le escribo.' : 'Listo. A las 2 p. m. le escribo.';
}

/**
 * El tema del acuerdo (`wa_acuerdos.que`). Valor fijo a propósito: el cron de
 * acuerdos lo reconoce y, en vez del recordatorio genérico, le devuelve el
 * formulario. Fuera de la ventana cae a la plantilla `recordatorio_acuerdo`,
 * donde el tema se lee bien solo («…para retomar lo de anotar su destino»).
 */
export const QUE_LUNES = { anotar: 'lo de anotar su destino' } as const;

export function recordatorioLunes(que: string, nombre?: string | null): { texto: string; cta: string } | null {
  if (que !== QUE_LUNES.anotar) return null;
  const hola = `Hola${nombre ? ', ' + nombre.split(/\s+/)[0] : ''}.`;
  return { texto: `${hola} Como quedamos: para marcarle la ruta solo me falta su destino. Se lo dejo a un toque.`, cta: 'Anotar mi destino' };
}

/**
 * La línea de la semana, retomada en el saludo del socio (`saludoDeSocio` en
 * wa-onboarding.ts). Ese saludo sale una sola vez por socio, y casi siempre como
 * respuesta a un mensaje de lunes (Erika, Liliana y Adriana el 14 sep, Nidia el
 * 21, Milton el 28): si no retoma lo que el lunes le acaba de contar, le ofrece
 * otra cosa. Cambia cada semana JUNTO con `PLANTILLA_LUNES_SOCIO` y
 * `cuerpoLunesSocio()`.
 *
 * El puente tiene que entenderse solo: lo lee también el socio que no recibió el
 * mensaje de esta semana (al que calla le llega uno al mes). La oferta es UNA
 * pregunta y es de redactar para una persona, que el canal sí hace. `null` = el
 * saludo sale sin puente y cierra con la oferta de siempre.
 *
 * v6 (5 oct 2026): `null`. Los botones del modo Waze los atiende el nodo 1.39
 * antes del saludo, y el saludo cierra con la oferta de redactar, que es la
 * misma de [Arranquemos].
 */
export const SEMANA_EN_SALUDO_SOCIO: { puente: string; oferta: string } | null = null;

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

/**
 * `todos` (Director, 5 oct 2026 — el primer lunes del modo Waze): a todos los
 * distribuidores registrados, sin la cadencia mensual del que calla. Sigue
 * valiendo uno por semana. ⚠️ Es una excepción de un envío, no el nuevo default:
 * la cadencia existe porque insistirle a quien no contesta es lo que Meta lee
 * como spam, y el bloqueo lo paga el número de todos.
 */
export async function decidir(supabase: Supa, ahora = new Date(), opts: { todos?: boolean } = {}): Promise<Decision[]> {
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
    else if (d.telefono.startsWith('1') && !dentroDeVentana(ultimoMensajeSocio, ahora)) {
      // Meta no entrega plantillas de MARKETING a números de EE. UU.: la acepta con
      // 200 y la tumba después. Dentro de la ventana sí le llega el texto libre.
      accion = 'omitir'; motivo = 'EE. UU. fuera de ventana: Meta no entrega MARKETING';
    }
    else if (opts.todos) {
      motivo = dias(ultimoMensajeSocio) <= DIAS_CONVERSACION_RECIENTE ? 'conversa: semanal' : 'envío a todos (5 oct)';
    }
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
/**
 * `opts` es para PROBAR en un teléfono antes de mandar a todos: `variante:
 * 'gancho'` manda el gancho aunque el socio tenga destino, y `forzarPlantilla`
 * manda la plantilla aunque esté en ventana (es la que reciben casi todos).
 */
export async function enviarLunesA(
  supabase: Supa, d: Destinatario, ahora = new Date(), ultimoMensajeSocio?: string | null,
  opts: { variante?: 'gancho'; forzarPlantilla?: boolean } = {},
): Promise<ResultadoEnvio> {
  const semana = semanaISO(ahora);
  const destino = opts.variante === 'gancho' ? null : await destinoDelSocio(supabase, d.constructorId);
  const m = mensajeLunes(d, destino);
  const texto = m.texto;
  const ultimo = ultimoMensajeSocio === undefined ? await ultimoMensajeDelSocio(supabase, d) : ultimoMensajeSocio;
  const enVentana = opts.forzarPlantilla ? false : dentroDeVentana(ultimo, ahora);
  let via: ResultadoEnvio['via'] = enVentana ? 'texto' : 'plantilla';
  // Dentro de la ventana va el mismo texto con su botón, sin costo.
  let res = enVentana
    ? await m.enVentana()
    : await sendTemplate(d.telefono, m.plantilla, 'es', m.parametros, undefined, m.botones);
  // Si el texto libre falló en la llamada (no por ventana: eso no falla ahí), la plantilla es el respaldo.
  if (!res.ok && enVentana) {
    res = await sendTemplate(d.telefono, m.plantilla, 'es', m.parametros, undefined, m.botones);
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

export async function enviarLunes(
  supabase: Supa, ahora = new Date(),
  opts: { solo?: string; todos?: boolean; variante?: 'gancho'; forzarPlantilla?: boolean } = {},
): Promise<{ decisiones: Decision[]; resultados: ResultadoEnvio[] }> {
  const decisiones = await decidir(supabase, ahora, { todos: opts.todos });
  const resultados: ResultadoEnvio[] = [];
  for (const dec of decisiones) {
    if (dec.accion !== 'enviar') continue;
    if (opts.solo && dec.d.constructorId !== opts.solo) continue;
    try {
      resultados.push(await enviarLunesA(supabase, dec.d, ahora, dec.ultimoMensajeSocio, { variante: opts.variante, forzarPlantilla: opts.forzarPlantilla }));
    } catch (err) {
      console.error(`❌ [Lunes socio] Falló ${dec.d.constructorId}:`, err);
      resultados.push({ constructorId: dec.d.constructorId, nombre: dec.d.nombre, via: null, ok: false, error: String((err as Error)?.message ?? err) });
    }
  }
  return { decisiones, resultados };
}
