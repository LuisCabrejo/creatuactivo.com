/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Los avisos con contexto: lo que el socio —o el equipo— necesita saber de quien
 * le está escribiendo a Queswa, dicho de una vez.
 *
 * Nace del caso Aldo Moller (6 oct 2026, Director el 8 oct). Escribió desde
 * Canadá, dijo que ya era distribuidor de Gano Excel con su código, preguntó por
 * Canadá, Chile y Brasil y eligió el ESP-3. Nadie se enteró de nada: llegó sin
 * socio, y sin socio no salía ningún aviso —el de WhatsApp se cancelaba y el
 * Dashboard descartaba la ficha—. Para el Director era justo el prospecto que
 * más interesaba: alguien que ya hace Gano Excel trae equipo y abre un país.
 *
 * Cuatro avisos, aprobados por el Director el 8 oct 2026:
 *   1. LLEGADA    — primer mensaje: nombre, país, por dónde llegó, qué escribió.
 *   2. REGRESO    — vuelve a escribir después de seis horas o más.
 *   3. DESTACADO  — la conversación dice algo que vale la pena: ya es distribuidor,
 *                   nombra otro país, eligió paquete. Lo resume Haiku.
 *   4. PROMESA    — el modelo le escribió a la persona «le aviso al equipo»: el
 *                   aviso sale de verdad. A Aldo se lo prometió tres veces.
 *
 * Sin socio, el destinatario es el EQUIPO (`EQUIPO_CONSTRUCTOR_ID`, el Director).
 *
 * Canales, en este orden:
 *   · push del Dashboard: no tiene ventana de 24 h ni plantilla, y es el único
 *     que siempre llega. ⚠️ En la LLEGADA con socio no se manda: el Dashboard ya
 *     avisa esa ficha nueva por su cuenta, y serían dos;
 *   · texto de WhatsApp, solo dentro de la ventana de 24 h (fuera de ella Meta lo
 *     acepta y lo descarta después: ver wa-ventana.ts);
 *   · correo al equipo, si el texto no pudo salir y el aviso pide acción
 *     (destacado y promesa).
 *
 * Nunca lanza: un aviso que falla no puede tumbar el turno de la persona.
 * En ensayo (`WA_DRY_RUN=1`) solo escribe en el log.
 */
import Anthropic from '@anthropic-ai/sdk';
import { sendText } from './wa-channel';
import { dentroDeVentana, normalizarWhatsApp } from './wa-onboarding';
import { avisarPorCorreo } from './wa-radicacion';
import { esBsuid, nombrePais, paisDeContactoWA, paisesNombrados } from './paises';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supa = any;
type Turno = { role: string; content: string };

const DASHBOARD_URL = () => process.env.DASHBOARD_URL || 'https://queswa.app';
const EQUIPO_CONSTRUCTOR_ID = () => process.env.EQUIPO_CONSTRUCTOR_ID || 'luis-cabrejo-1288';
const WHATSAPP_EQUIPO = () => process.env.WHATSAPP_EQUIPO || '573206805737';
const enEnsayo = () => process.env.WA_DRY_RUN === '1';

const HORAS_PARA_REGRESO = 6;
const MINUTOS_ENTRE_DESTACADOS = 10;
const MAX_DESTACADOS = 3;

// ─── A quién ─────────────────────────────────────────────────────────────────

export interface Destinatario {
  /** El `constructor_id` de texto (luis-cabrejo-1288): es la llave del push. */
  constructorId: string;
  whatsapp?: string;
  /** Primer nombre del socio, para abrir el texto. Al equipo no se le nombra. */
  nombreCorto?: string;
  esEquipo: boolean;
}

export function destinatarioDe(
  socio?: { constructorId?: string | null; nombre?: string | null; whatsapp?: string | null } | null,
): Destinatario {
  if (socio?.constructorId) {
    return {
      constructorId: socio.constructorId,
      whatsapp: socio.whatsapp ?? undefined,
      nombreCorto: (socio.nombre ?? '').trim().split(/\s+/)[0] || undefined,
      esEquipo: false,
    };
  }
  return { constructorId: EQUIPO_CONSTRUCTOR_ID(), whatsapp: WHATSAPP_EQUIPO(), esEquipo: true };
}

// ─── Piezas del texto ────────────────────────────────────────────────────────

/** «Constructor» es el relleno del canal cuando WhatsApp no manda nombre. */
function nombreDe(nombre: string | null | undefined): string | null {
  const limpio = (nombre ?? '').trim();
  return limpio && /\p{L}/u.test(limpio) && !/^constructor$/i.test(limpio) ? limpio : null;
}

/**
 * El país solo cuando NO es Colombia: casi todos escriben desde aquí y repetirlo
 * en cada aviso es ruido; el que viene de afuera es justo la noticia.
 */
function paisQueSeDice(contacto: string): string | null {
  const codigo = paisDeContactoWA(contacto);
  return codigo && codigo !== 'CO' ? nombrePais(codigo) : null;
}

export function quien(nombre: string | null | undefined, contacto: string, conAsteriscos = true): string {
  const n = nombreDe(nombre);
  const pais = paisQueSeDice(contacto);
  const base = n ? (conAsteriscos ? `*${n}*` : n) : 'Una persona';
  return pais ? `${base} (${pais})` : base;
}

/** El teléfono que se le puede marcar, o por qué no lo hay. */
export function lineaContacto(contacto: string, conInvitacion = false): string {
  if (esBsuid(contacto)) {
    return 'Escribe con nombre de usuario de WhatsApp: no vemos su teléfono, así que la conversación sigue por Queswa.';
  }
  const digitos = contacto.replace(/\D/g, '');
  const tel = digitos.startsWith('57') && digitos.length === 12 ? digitos.slice(2) : `+${digitos}`;
  return conInvitacion ? `Su número es ${tel}, por si quiere escribirle usted mismo.` : `Su número es ${tel}.`;
}

function citar(texto: string, max = 160): string {
  const t = (texto || '').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

/** «hace 3 horas» · «ayer» · «hace 2 días». */
export function haceCuanto(desdeISO: string, ahora = new Date()): string {
  const horas = (ahora.getTime() - new Date(desdeISO).getTime()) / 36e5;
  if (horas < 24) return `hace ${Math.max(1, Math.round(horas))} horas`;
  const dias = Math.round(horas / 24);
  return dias <= 1 ? 'ayer' : `hace ${dias} días`;
}

export interface OrigenLlegada {
  /** Llegó por el enlace de este socio. */
  porEnlace?: boolean;
  /** Nombre de quien le pasó el enlace (el pase de otro prospecto). */
  compartidoPor?: string | null;
  anuncio?: boolean;
  /** El primer mensaje, ya sin marcadores. */
  texto: string;
}

export function origenDeLlegada(o: OrigenLlegada): string {
  if (o.compartidoPor) return `por el enlace que le pasó ${o.compartidoPor}`;
  if (o.anuncio) return 'por un anuncio';
  if (o.porEnlace) return 'por su enlace';
  if (/quiero preguntar por los productos/i.test(o.texto)) return 'desde la página de productos de creatuactivo.com';
  if (/vengo de creatuactivo\.com|quiero saber c[oó]mo funciona/i.test(o.texto)) return 'desde creatuactivo.com, sin enlace de socio';
  return 'escribiendo directo al número de Queswa';
}

// ─── Entrega ─────────────────────────────────────────────────────────────────

interface Entrega {
  push?: { titulo: string; cuerpo: string };
  texto: string;
  /** Si el texto no sale, ¿se manda por correo? Solo lo que pide acción. */
  correo?: { asunto: string } | null;
}

/** El push del Dashboard. Devuelve si salió; nunca lanza. */
export async function pushAlDashboard(constructorId: string, titulo: string, cuerpo: string): Promise<boolean> {
  if (enEnsayo()) {
    console.log(`[WA_DRY_RUN] push → ${constructorId}: «${titulo}» ${cuerpo}`);
    return true;
  }
  try {
    const r = await fetch(`${DASHBOARD_URL()}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        constructorId,
        type: 'new_prospect',
        title: titulo,
        body: citar(cuerpo, 220),
        url: `${DASHBOARD_URL()}/centro-de-expansion`,
      }),
      signal: AbortSignal.timeout(6000),
    });
    return r.ok;
  } catch (err) {
    console.error(`⚠️ [Avisos] Push «${titulo}» falló:`, err);
    return false;
  }
}

async function entregar(supabase: Supa, dest: Destinatario, e: Entrega, etiqueta: string): Promise<string> {
  if (enEnsayo()) {
    console.log(`[WA_DRY_RUN] aviso «${etiqueta}» → ${dest.constructorId}${e.push ? ` · push «${e.push.titulo}»` : ''}\n${e.texto}`);
    return 'ensayo';
  }
  const hecho: string[] = [];

  if (e.push) hecho.push(await pushAlDashboard(dest.constructorId, e.push.titulo, e.push.cuerpo) ? 'push' : 'push falló');

  let textoSalio = false;
  if (dest.whatsapp) {
    try {
      if (await dentroDeVentana(supabase, dest.whatsapp)) {
        const r = await sendText(normalizarWhatsApp(dest.whatsapp), e.texto);
        textoSalio = r.ok;
        hecho.push(r.ok ? 'whatsapp' : `whatsapp falló: ${r.error}`);
      } else {
        hecho.push('whatsapp fuera de ventana');
      }
    } catch (err) {
      console.error(`⚠️ [Avisos] WhatsApp «${etiqueta}» falló:`, err);
    }
  }

  if (!textoSalio && e.correo) {
    await avisarPorCorreo(e.correo.asunto, e.texto.replace(/\*/g, '').split('\n'));
    hecho.push('correo');
  }

  console.log(`🔔 [Avisos] «${etiqueta}» → ${dest.constructorId}: ${hecho.join(' · ') || 'nada salió'}`);
  return hecho.join(' · ');
}

async function marcarFicha(supabase: Supa, fingerprint: string, datos: Record<string, unknown>): Promise<void> {
  try {
    await supabase.rpc('update_prospect_data', { p_fingerprint_id: fingerprint, p_data: datos, p_constructor_id: undefined });
  } catch (err) {
    console.error('⚠️ [Avisos] No se pudo marcar la ficha:', err);
  }
}

// ─── 1. Llegada ──────────────────────────────────────────────────────────────

export function textoLlegada(dest: Destinatario, nombre: string | null | undefined, contacto: string, origen: string, primerMensaje: string): string {
  const pais = paisQueSeDice(contacto);
  const n = nombreDe(nombre);
  const sujeto = n ? `*${n}*` : 'Una persona';
  const saludo = dest.nombreCorto ? `${dest.nombreCorto}, ` : '';
  return [
    `👋 ${saludo}${sujeto} acaba de escribirme${pais ? ` desde *${pais}*` : ''}.`,
    `Llegó ${origen}. Su primer mensaje: «${citar(primerMensaje)}».`,
    lineaContacto(contacto, true),
    'Yo sigo conversando: explico, resuelvo las dudas y le aviso si decide avanzar.',
  ].join('\n\n');
}

export async function avisarLlegada(
  supabase: Supa,
  args: { dest: Destinatario; nombre?: string | null; contacto: string; origen: string; primerMensaje: string },
): Promise<void> {
  try {
    const { dest, nombre, contacto, origen, primerMensaje } = args;
    await entregar(supabase, dest, {
      // Con socio, el Dashboard ya avisa la ficha nueva: el push sería doble.
      push: dest.esEquipo
        ? { titulo: `👋 ${quien(nombre, contacto, false)} le escribió a Queswa`, cuerpo: `Llegó ${origen}. «${citar(primerMensaje, 120)}»` }
        : undefined,
      texto: textoLlegada(dest, nombre, contacto, origen, primerMensaje),
    }, 'llegada');
  } catch (err) {
    console.error('⚠️ [Avisos] Llegada:', err);
  }
}

// ─── 2. Regreso ──────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function recapDeFicha(di: Record<string, any> | null | undefined): string[] {
  const lineas: string[] = [];
  if (!di) return lineas;
  if (typeof di.occupation === 'string' && /distribuid|socio/i.test(di.occupation)) lineas.push('Dijo que ya es distribuidor de Gano Excel.');
  if (typeof di.package === 'string' && di.package) lineas.push(`Ya había elegido el ${di.package}.`);
  return lineas;
}

export function textoRegreso(dest: Destinatario, nombre: string | null | undefined, contacto: string, hace: string, mensaje: string, recap: string[]): string {
  const saludo = dest.nombreCorto ? `${dest.nombreCorto}, ` : '';
  return [
    `🔁 ${saludo}${quien(nombre, contacto)} volvió a escribirme. La conversación anterior fue ${hace}.`,
    `Ahora escribió: «${citar(mensaje)}».`,
    ...(recap.length ? [recap.join(' ')] : []),
    lineaContacto(contacto, true),
  ].join('\n\n');
}

/**
 * El último mensaje de la persona ANTES de este turno. El aviso corre en segundo
 * plano y un nodo dictado puede guardar el turno antes de que la consulta llegue:
 * sin el corte por hora, el «anterior» sería el mensaje de ahora y el regreso no
 * se vería nunca. Misma lectura que `ultimoMensajeDePersona` (wa-ventana.ts).
 */
async function mensajeAnteriorDePersona(supabase: Supa, fingerprint: string, antesDe: string): Promise<string | null> {
  const { data } = await supabase
    .from('nexus_conversations')
    .select('created_at, messages')
    .eq('fingerprint_id', fingerprint)
    .lt('created_at', antesDe)
    .order('created_at', { ascending: false })
    .limit(8);
  for (const fila of data ?? []) {
    const suyo = (Array.isArray(fila.messages) ? fila.messages : []).filter((m: { role?: string }) => m?.role === 'user');
    if (!suyo.length) continue;
    const ts = suyo[suyo.length - 1]?.timestamp;
    return typeof ts === 'string' && !isNaN(new Date(ts).getTime()) ? ts : fila.created_at;
  }
  return null;
}

/** Vuelve a escribir tras seis horas o más. */
export async function avisarSiRegresa(
  supabase: Supa,
  args: {
    /** Se resuelve solo si de verdad hay regreso: casi nunca lo hay. */
    destino: () => Promise<Destinatario>;
    fingerprint: string; nombre?: string | null; contacto: string; mensaje: string;
    /** Cuándo llegó este mensaje: lo de después es de este mismo turno. */
    inicioTurno: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deviceInfo?: Record<string, any> | null;
  },
): Promise<void> {
  try {
    const { fingerprint, nombre, contacto, mensaje, deviceInfo, inicioTurno } = args;
    const anterior = await mensajeAnteriorDePersona(supabase, fingerprint, inicioTurno);
    if (!anterior) return;
    const horas = (Date.now() - new Date(anterior).getTime()) / 36e5;
    if (horas < HORAS_PARA_REGRESO) return;
    // Dos mensajes seguidos tras la pausa ven los dos la misma pausa: uno avisa.
    const ultimoAviso = deviceInfo?.aviso_regreso_en as string | undefined;
    if (ultimoAviso && (Date.now() - new Date(ultimoAviso).getTime()) / 36e5 < HORAS_PARA_REGRESO) return;
    await marcarFicha(supabase, fingerprint, { aviso_regreso_en: new Date().toISOString() });

    const dest = await args.destino();
    const hace = haceCuanto(anterior);
    await entregar(supabase, dest, {
      push: { titulo: `🔁 ${quien(nombre, contacto, false)} volvió a escribirle a Queswa`, cuerpo: `La conversación anterior fue ${hace}. «${citar(mensaje, 120)}»` },
      texto: textoRegreso(dest, nombre, contacto, hace, mensaje, recapDeFicha(deviceInfo)),
    }, 'regreso');
  } catch (err) {
    console.error('⚠️ [Avisos] Regreso:', err);
  }
}

// ─── 3. Destacado ────────────────────────────────────────────────────────────

/** «Ya soy distribuidor», «tengo mi código»: distinto de NET_02, que es pasado. */
export const RE_DISTRIBUIDOR_ACTIVO = /\b(ya\s+)?soy\s+(distribuidor|distribuidora|socio|socia)\b|\btengo\s+(mi|un|el)\s+c[oó]digo\b|\bestoy\s+(activ[oa]\s+)?en\s+gano\b|\bsoy\s+de\s+gano\b|\btrabajo\s+con\s+gano\b/i;

export type TipoSenal = 'distribuidor' | 'paises' | 'paquete';

export interface Senales {
  tipos: TipoSenal[];
  paises: string[];
  paquete?: string;
  /** El nodo 2.51 confirmó que su código es de Gano Excel, con otro equipo. */
  otroEquipoGano?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function leerSenales(textosDeLaPersona: string[], di: Record<string, any> | null | undefined): Senales {
  const todo = textosDeLaPersona.join('\n');
  const tipos: TipoSenal[] = [];
  // El nodo 2.51 lo deja anotado: a «¿Su código es de Gano Excel?» basta un «sí».
  const distribuidor = di?.distribuidor_otro_equipo === true || RE_DISTRIBUIDOR_ACTIVO.test(todo) || (typeof di?.occupation === 'string' && /distribuid|socio/i.test(di.occupation));
  if (distribuidor) tipos.push('distribuidor');
  const paises = paisesNombrados(todo).filter((p) => p !== 'Colombia');
  if (paises.length) tipos.push('paises');
  const paquete = typeof di?.package === 'string' && di.package ? di.package : undefined;
  if (paquete) tipos.push('paquete');
  return { tipos, paises, paquete, otroEquipoGano: di?.distribuidor_otro_equipo === true };
}

function vinetasDeRespaldo(s: Senales): string[] {
  const v: string[] = [];
  if (s.tipos.includes('distribuidor')) v.push(s.otroEquipoGano ? '· Ya es distribuidor de Gano Excel, con otro equipo.' : '· Dice que ya es distribuidor.');
  if (s.paises.length) v.push(`· Le interesa ${s.paises.join(', ').replace(/, ([^,]*)$/, ' y $1')}.`);
  if (s.paquete) v.push(`· Eligió el ${s.paquete}.`);
  return v;
}

let _anthropic: Anthropic | null = null;

async function resumirConHaiku(historial: Turno[]): Promise<string[] | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    _anthropic ||= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const hilo = historial.slice(-30).map((m) => m.role === 'user'
      ? `PERSONA: ${citar(m.content, 600)}`
      : `QUESWA: ${citar(m.content, 280)}`).join('\n');
    const r = await _anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{ role: 'user', content:
        'Lee esta conversación entre una persona y Queswa, la asistente de CreaTuActivo (un negocio de distribución de los productos de Gano Excel).\n\n'
        + 'Escribe de 2 a 4 viñetas para el dueño del negocio con lo que LA PERSONA dijo de sí misma o eligió: de dónde es, a qué se dedica, si ya es distribuidor de Gano Excel, qué países le interesan, qué paquete eligió, qué pidió.\n\n'
        + 'Reglas: solo hechos que la persona dijo o eligió; nada de lo que Queswa le explicó; nada inventado; sin adjetivos ni recomendaciones. '
        + 'Cada viñeta empieza con «· » y con un verbo («Ya es distribuidor…», «Le interesa…», «Pidió…»), sin «él» ni «ella», y tiene menos de 90 caracteres. '
        + 'Responde solo las viñetas.\n\n'
        + hilo,
      }],
    }, { timeout: 8000 });
    const texto = r.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
    const vinetas = texto.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('·')).slice(0, 4);
    return vinetas.length ? vinetas : null;
  } catch (err) {
    console.error('⚠️ [Avisos] Haiku no resumió:', err);
    return null;
  }
}

export function textoDestacado(dest: Destinatario, nombre: string | null | undefined, contacto: string, vinetas: string[]): string {
  const saludo = dest.nombreCorto ? `${dest.nombreCorto}, ` : '';
  return [
    `⭐ ${saludo}${quien(nombre, contacto)} vale la pena:`,
    vinetas.join('\n'),
    `Le conviene escribirle usted. ${lineaContacto(contacto)}`,
  ].join('\n\n');
}

/**
 * Se revisa después de cada respuesta del motor. Sale la primera vez que hay una
 * señal, y otra vez si aparece una señal NUEVA (Aldo: ya es distribuidor a las
 * 20:23, eligió el ESP-3 a las 21:20), con diez minutos de por medio y un tope
 * de tres por persona. Se cuenta desde el segundo mensaje: el primero ya lo
 * cuenta el aviso de llegada.
 */
export async function revisarDestacado(
  supabase: Supa,
  args: { dest: Destinatario; fingerprint: string; nombre?: string | null; contacto: string; historial: Turno[]; mensaje: string },
): Promise<void> {
  try {
    const { dest, fingerprint, nombre, contacto, historial, mensaje } = args;
    const textosPersona = [...historial.filter((m) => m.role === 'user').map((m) => m.content), mensaje];
    if (textosPersona.length < 2) return;

    // La ficha fresca: el motor acaba de capturar lo de este turno.
    const { data: ficha } = await supabase.from('prospects').select('device_info').eq('fingerprint_id', fingerprint).maybeSingle();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const di: Record<string, any> = ficha?.device_info ?? {};
    if (di.es_socio === true) return;

    const senales = leerSenales(textosPersona, di);
    const yaAvisadas: string[] = Array.isArray(di.aviso_destacado_senales) ? di.aviso_destacado_senales : [];
    const nuevas = senales.tipos.filter((t) => !yaAvisadas.includes(t));
    if (!nuevas.length) return;
    const n = Number(di.aviso_destacado_n ?? 0);
    if (n >= MAX_DESTACADOS) return;
    if (di.aviso_destacado_en && (Date.now() - new Date(di.aviso_destacado_en).getTime()) / 6e4 < MINUTOS_ENTRE_DESTACADOS) return;

    // Se marca ANTES de resumir: dos turnos seguidos no avisan dos veces.
    await marcarFicha(supabase, fingerprint, {
      aviso_destacado_en: new Date().toISOString(),
      aviso_destacado_n: n + 1,
      aviso_destacado_senales: [...new Set([...yaAvisadas, ...senales.tipos])],
    });

    const vinetas = (await resumirConHaiku([...historial, { role: 'user', content: mensaje }])) ?? vinetasDeRespaldo(senales);
    await entregar(supabase, dest, {
      push: { titulo: `⭐ ${quien(nombre, contacto, false)} vale la pena`, cuerpo: vinetas.map((v) => v.replace(/^·\s*/, '')).join(' · ') },
      texto: textoDestacado(dest, nombre, contacto, vinetas),
      correo: { asunto: `[Queswa] ${quien(nombre, contacto, false)} vale la pena` },
    }, `destacado (${nuevas.join(', ')})`);
  } catch (err) {
    console.error('⚠️ [Avisos] Destacado:', err);
  }
}

// ─── 4. La promesa del modelo ────────────────────────────────────────────────

/**
 * Frases en que el MODELO da por hecho un aviso al equipo o al socio. Solo
 * indicativo y primera persona: «¿quiere que le avise al equipo?» es una oferta
 * —su «sí» lo atiende el nodo 2.46— y «se lo confirma el equipo» es la válvula
 * de NET_02, que no promete nada. «Cuando alguien está listo, le aviso» (EAM_01)
 * le habla al socio de sus prospectos: no lleva destinatario y no entra.
 */
const RE_PROMESA_DE_AVISO = /\b((ahora\s+mismo\s+)?le\s+aviso\s+(al\s+equipo|a\s+(su|el|la)\s+soci[oa]|a\s+luis)|ya\s+le\s+avis[eé]\s+(al|a)\b|le\s+voy\s+a\s+avisar\s+(al|a)\b|le\s+transmito\b|le\s+incluyo\b[^.?!\n]{0,60}\baviso\b|coordino\s+(con\s+el\s+equipo|que\s+el\s+equipo)|le\s+notifico\s+al\s+equipo|le\s+comunico\s+al\s+equipo)/i;

/** Devuelve la oración que promete, o null. */
export function detectarPromesaDeAviso(texto: string): string | null {
  if (!texto || !RE_PROMESA_DE_AVISO.test(texto)) return null;
  const oraciones = texto.split(/(?<=[.!?])\s+|\n+/).map((o) => o.trim()).filter(Boolean);
  return oraciones.find((o) => RE_PROMESA_DE_AVISO.test(o)) ?? citar(texto, 200);
}

export function textoPromesa(dest: Destinatario, nombre: string | null | undefined, contacto: string, pidio: string, promesa: string): string {
  const saludo = dest.nombreCorto ? `${dest.nombreCorto}, ` : '';
  return [
    `📌 ${saludo}${saludo ? 'le' : 'Le'} dije a ${quien(nombre, contacto)} que el equipo le escribe.`,
    `Lo que pidió: «${citar(pidio)}»`,
    `Lo que le dije: «${citar(promesa, 200)}»`,
    lineaContacto(contacto),
  ].join('\n\n');
}

export async function avisarPromesa(
  supabase: Supa,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: { dest: Destinatario; fingerprint: string; nombre?: string | null; contacto: string; pidio: string; promesa: string; deviceInfo?: Record<string, any> | null },
): Promise<void> {
  try {
    const { dest, fingerprint, nombre, contacto, pidio, promesa, deviceInfo } = args;
    // Aldo recibió la promesa en cuatro turnos seguidos: un aviso basta.
    const ultimo = deviceInfo?.aviso_promesa_en as string | undefined;
    if (ultimo && (Date.now() - new Date(ultimo).getTime()) / 36e5 < HORAS_PARA_REGRESO) return;
    await marcarFicha(supabase, fingerprint, { aviso_promesa_en: new Date().toISOString() });
    await entregar(supabase, dest, {
      push: { titulo: `📌 ${quien(nombre, contacto, false)} espera que el equipo le escriba`, cuerpo: `Pidió: «${citar(pidio, 140)}»` },
      texto: textoPromesa(dest, nombre, contacto, pidio, promesa),
      correo: { asunto: `[Queswa] ${quien(nombre, contacto, false)} espera que el equipo le escriba` },
    }, 'promesa');
  } catch (err) {
    console.error('⚠️ [Avisos] Promesa:', err);
  }
}

// ─── La ficha web y la de WhatsApp son la misma persona ─────────────────────

/**
 * El orbe del sitio pone al final del texto prellenado un marcador con el
 * comienzo de la huella del navegador (`w:31ebf4f5`), igual que el pase lleva
 * `de:xxxxxx`. Con él, la ficha del navegador queda con el nombre y el país de
 * quien escribió, y lo que haga después en la web (ver la presentación completa,
 * tocar el botón de WhatsApp) llega al Dashboard con su nombre. Hasta el 8 oct
 * 2026 eran dos fichas sin relación: Aldo escribió por WhatsApp a las 20:19 y
 * su computador vio la presentación como «un visitante».
 */
export function extraerHuellaWeb(texto: string | undefined): string | null {
  const m = (texto ?? '').match(/(?:^|\s)w:([0-9a-f]{8})\b/i);
  return m ? m[1].toLowerCase() : null;
}

export function limpiarHuellaWeb(texto: string): string {
  const limpio = texto.replace(/\s*(?:^|\s)w:[0-9a-f]{8}\b\s*/gi, ' ').replace(/\s{2,}/g, ' ').trim();
  return limpio.length ? limpio : texto;
}

export async function atarHuellaWeb(
  supabase: Supa,
  args: { prefijo: string; fingerprintWA: string; nombre?: string | null; contacto: string },
): Promise<void> {
  try {
    const { data } = await supabase
      .from('prospects')
      .select('fingerprint_id, device_info')
      .like('fingerprint_id', `${args.prefijo}%`)
      .not('fingerprint_id', 'like', 'wa_%')
      .limit(2);
    // Dos huellas con el mismo comienzo: no se adivina.
    if (!data || data.length !== 1) return;
    const web = data[0];
    const datosWeb: Record<string, unknown> = { whatsapp_fingerprint: args.fingerprintWA };
    const n = nombreDe(args.nombre);
    if (n && !nombreDe(web.device_info?.name)) datosWeb.name = n;
    const codigo = paisDeContactoWA(args.contacto);
    if (codigo && !web.device_info?.pais) { datosWeb.pais = nombrePais(codigo); datosWeb.pais_codigo = codigo; }
    await marcarFicha(supabase, web.fingerprint_id, datosWeb);
    await marcarFicha(supabase, args.fingerprintWA, { web_fingerprint: web.fingerprint_id });
    console.log(`🔗 [Avisos] Ficha web ${web.fingerprint_id.slice(0, 12)}… atada a ${args.fingerprintWA}`);
  } catch (err) {
    console.error('⚠️ [Avisos] No se pudo atar la ficha web:', err);
  }
}
