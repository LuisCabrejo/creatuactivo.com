/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El destino del socio — el MODO WAZE (Director, 5 oct 2026).
 *
 * Waze necesita dos cosas: a dónde va y dónde está. El DESTINO son las
 * referencias que el socio anota en Ajustes de Cuenta (`socio_referencias`, idea
 * Waze del Director del 19 sep): lo que necesita al mes, la vida que quiere y su
 * razón. La UBICACIÓN es su contraseña de Gano, con la que Queswa lee cómo va su
 * sistema en el back office.
 *
 * El destino se anota SIN SALIR DE WHATSAPP: el formulario «Su destino» (Flow
 * `destino_socio`, scripts/publicar-flow-destino.mjs) y, al guardar, se escribe en
 * la misma tabla que lee el Dashboard — queda aplicado en sus Ajustes de Cuenta en
 * ese instante. La ubicación sí se pone en queswa.app: la confirmación lleva un
 * botón que abre la sesión y lo deja en la sección de Gano.
 *
 * ⚠️ Son cifras de GASTO que el socio escribe, nunca lo que el negocio le va a
 * pagar (Ley 1700 de 2013). Queswa las repite con SUS palabras.
 * ⛔ «Le marco la ruta», nunca «lo llevo»: llevarlo es prometer el resultado.
 */

import { sendCtaUrl, sendText, sendFlow, type WAResult } from '@/lib/wa-channel';

/**
 * El Flow «Su destino» (`destino_socio_v2`, 5 oct 2026, con las explicaciones de
 * Ajustes de Cuenta). La env permite cambiarlo sin desplegar. ⚠️ El botón de las
 * plantillas del lunes queda atado al formulario con que se sometieron: cambiar
 * este id exige someterlas de nuevo.
 */
export const FLOW_DESTINO_ID = process.env.WHATSAPP_FLOW_DESTINO_ID || '967176575826968';
export const PANTALLA_DESTINO = 'DESTINO';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supa = any;

export interface DestinoSocio { gastoMes: number; vidaMes: number; razon: string }

export function formatoPesos(n: number): string {
  return '$' + Math.round(n).toLocaleString('de-DE');
}

/**
 * La razón tal como la escribió, lista para ir dentro de «…» en una sola línea:
 * Meta rechaza variables con saltos de línea, tabulaciones o más de cuatro
 * espacios seguidos. Sin comillas propias ni punto final (las pone el texto).
 */
export function razonParaPlantilla(razon: string, max = 160): string {
  let t = razon.replace(/[\r\n\t]+/g, ' ').replace(/[«»"“”]/g, '').replace(/\s{2,}/g, ' ').trim().replace(/[.\s]+$/, '');
  if (t.length > max) t = t.slice(0, max).replace(/\s+\S*$/, '') + '…';
  return t;
}

/**
 * El destino vigente. Lo que necesita al mes vale también si venía de Proyección
 * (`private_users.gastos_mensuales`), igual que en `/api/socio/pendientes` del
 * Dashboard, que es quien decide qué le falta. `null` si falta alguna de las tres.
 */
export async function destinoDelSocio(supabase: Supa, constructorId: string): Promise<DestinoSocio | null> {
  const [{ data: ref }, { data: u }] = await Promise.all([
    supabase.from('socio_referencias').select('gasto_mes, vida_deseada_mes, para_quien')
      .eq('constructor_id', constructorId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('private_users').select('gastos_mensuales').eq('constructor_id', constructorId).maybeSingle(),
  ]);
  const gastoMes = Number(ref?.gasto_mes || u?.gastos_mensuales || 0);
  const vidaMes = Number(ref?.vida_deseada_mes || 0);
  const razon = String(ref?.para_quien ?? '').trim();
  if (!(gastoMes > 0) || !(vidaMes > 0) || !razon) return null;
  return { gastoMes, vidaMes, razon };
}

/** Con qué abre el formulario: lo suyo ya escrito, o en blanco. */
export function datosFormulario(d: DestinoSocio | null): Record<string, string> {
  return d
    ? { gasto: String(Math.round(d.gastoMes)), vida: String(Math.round(d.vidaMes)), razon: d.razon.slice(0, 300) }
    : { gasto: '', vida: '', razon: '' };
}

/** Token de correlación del formulario: vuelve en el `nfm_reply`. No es de seguridad. */
export function tokenFormulario(constructorId: string): string {
  return `destino:${constructorId}:${Date.now()}`;
}

/**
 * Una cifra en pesos tal como la escribe un pulgar. El teclado es numérico, pero
 * igual llegan «2.500.000», «2500000,00» o «2.5» (en millones). Lo de tres
 * cifras o menos se lee en millones: nadie necesita $3 al mes.
 */
export function leerPesos(raw: unknown): number {
  const t = String(raw ?? '').trim().replace(/\s|\$/g, '');
  if (!t) return 0;
  if (/^\d{1,3}([.,]\d{1,2})?$/.test(t)) return Math.round(parseFloat(t.replace(',', '.')) * 1_000_000);
  const n = Number(t.replace(/[.,]\d{1,2}$/, '').replace(/\D/g, ''));
  return Number.isFinite(n) && n < 1e11 ? n : 0;
}

/** El formulario devuelto (`nfm_reply`). `null` si no es el de destino o viene incompleto. */
export function leerFormularioDestino(r: Record<string, unknown>): DestinoSocio | null {
  if (r?.tipo !== 'destino') return null;
  const gastoMes = leerPesos(r.gasto);
  const vidaMes = leerPesos(r.vida);
  const razon = String(r.razon ?? '').trim().slice(0, 300);
  if (!(gastoMes > 0) || !(vidaMes > 0) || !razon) return null;
  return { gastoMes, vidaMes, razon };
}

/**
 * Guarda una versión nueva de las referencias, igual que `guardarReferencias`
 * del Dashboard: fila completa (lo que no llega se conserva de la vigente) y
 * `private_users.gastos_mensuales` en sincronía, que Proyección sigue leyendo.
 */
export async function guardarDestinoSocio(supabase: Supa, constructorId: string, d: DestinoSocio): Promise<boolean> {
  try {
    const { data: ult } = await supabase.from('socio_referencias').select('*')
      .eq('constructor_id', constructorId).order('created_at', { ascending: false }).limit(1).maybeSingle();
    const { error } = await supabase.from('socio_referencias').insert({
      constructor_id: constructorId,
      primero_a_resolver: ult?.primero_a_resolver ?? null,
      gasto_mes: d.gastoMes,
      vida_deseada_mes: d.vidaMes,
      vida_deseada_texto: ult?.vida_deseada_texto ?? null,
      para_quien: d.razon,
      escala: ult?.escala ?? null,
      paso_semana: ult?.paso_semana ?? null,
      fuente: 'queswa',
      created_at: new Date().toISOString(),
    });
    if (error) { console.error('⚠️ [Destino] No se pudo guardar:', error.message); return false; }
    await supabase.from('private_users').update({ gastos_mensuales: d.gastoMes }).eq('constructor_id', constructorId);
    return true;
  } catch (e) {
    console.error('⚠️ [Destino] Falló al guardar:', e);
    return false;
  }
}

export async function tieneContrasenaGano(supabase: Supa, constructorId: string): Promise<boolean> {
  const { count } = await supabase.from('gano_credentials').select('constructor_id', { count: 'exact', head: true }).eq('constructor_id', constructorId);
  return (count ?? 0) > 0;
}

/** La confirmación: su destino con sus cifras, y la ubicación si le falta. */
export function confirmacionDestino(nombre: string, d: DestinoSocio, conGano: boolean): string {
  return (
    `Listo${nombre ? ', ' + nombre : ''}. Ya tengo su destino:\n\n` +
    `📍 Punto de partida: lo que necesita hoy, ${formatoPesos(d.gastoMes)} al mes.\n\n` +
    `🏁 Destino: la vida que quiere, ${formatoPesos(d.vidaMes)} al mes.\n\n` +
    `❤️ Su razón: «${razonParaPlantilla(d.razon)}».\n\n` +
    (conGano
      ? 'Quedó guardado en sus Ajustes de Cuenta; allá lo puede ver o cambiar cuando quiera.'
      : 'Quedó guardado en sus Ajustes de Cuenta. Ahora me falta su ubicación: con su contraseña de Gano veo cómo va su sistema y le marco la ruta desde donde está.')
  );
}

export const TEXTO_BOTON_AJUSTES = 'Ir a mis Ajustes';

/**
 * El enlace que abre queswa.app con la sesión iniciada y lo deja en Ajustes de
 * Cuenta (`/api/auth/enlace-canal` del Dashboard, con la llave del puente).
 * `null` si no se pudo: la confirmación cae al «¿Le mando el acceso?» de siempre.
 */
export async function enlaceAjustes(constructorId: string, seccion: 'ajustes' | 'ajustes-gano'): Promise<string | null> {
  const secreto = process.env.WA_BRIDGE_SECRET?.trim();
  if (!secreto) { console.warn('⚠️ [Destino] Sin WA_BRIDGE_SECRET: no hay enlace directo'); return null; }
  try {
    const base = process.env.DASHBOARD_URL || 'https://queswa.app';
    const r = await fetch(`${base}/api/auth/enlace-canal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-wa-bridge-secret': secreto },
      body: JSON.stringify({ constructorId, destino: seccion }),
    });
    const j = (await r.json().catch(() => ({}))) as { url?: string; error?: string };
    if (r.ok && j.url) return j.url;
    console.warn(`⚠️ [Destino] El Dashboard no dio el enlace: ${j.error || r.status}`);
    return null;
  } catch (e) {
    console.warn('⚠️ [Destino] Falló el enlace a Ajustes:', e);
    return null;
  }
}

/**
 * Lo que pasa cuando el socio guarda el formulario: se guarda, se confirma con
 * sus cifras y se le deja el botón a sus Ajustes. Devuelve el texto que recibió,
 * para el historial.
 */
export async function atenderFormularioDestino(
  supabase: Supa,
  telefono: string,
  socio: { constructorId: string; nombre: string },
  d: DestinoSocio,
): Promise<string> {
  const guardado = await guardarDestinoSocio(supabase, socio.constructorId, d);
  if (!guardado) {
    const t = 'No me dejó guardarlo ahora mismo. Lo puede anotar en queswa.app, en Ajustes de Cuenta, o volver a intentarlo aquí en un rato.';
    await sendText(telefono, t);
    return t;
  }
  const conGano = await tieneContrasenaGano(supabase, socio.constructorId);
  const texto = confirmacionDestino(socio.nombre, d, conGano);
  const url = await enlaceAjustes(socio.constructorId, conGano ? 'ajustes' : 'ajustes-gano');
  if (url) {
    const r = await sendCtaUrl(telefono, texto, TEXTO_BOTON_AJUSTES, url);
    if (r.ok) return texto;
  }
  // Sin botón: la pregunta de siempre, que el nodo 2.22 ya sabe atender con el acceso.
  const conPregunta = `${texto} ¿Le mando el acceso?`;
  await sendText(telefono, conPregunta);
  return conPregunta;
}

export const CTA_FORMULARIO = 'Anotar mi destino';

/** El formulario dentro de la conversación (ventana abierta): el toque de [Anotarlo ahora] o el recordatorio de las 2. */
export async function enviarFormularioDestino(
  telefono: string,
  constructorId: string,
  destino: DestinoSocio | null,
  cuerpo: string,
  cta = CTA_FORMULARIO,
): Promise<WAResult> {
  return sendFlow(telefono, FLOW_DESTINO_ID, cuerpo, cta, {
    screen: PANTALLA_DESTINO,
    token: tokenFormulario(constructorId),
    data: datosFormulario(destino),
  });
}

// ─── «¿Qué es el modo Waze?» — el DISTRIBUIDOR en WhatsApp (5 oct 2026) ──────

/** El fragmento del arsenal del socio; vive solo en el tenant `dashboard` y se lee de ahí: un solo texto para los dos canales. */
export const FRAGMENTO_MODO_WAZE = 'arsenal_socio_WAZE_01';

/**
 * La explicación del modo Waze al socio que la pide por WhatsApp, con el botón de
 * lo que le falta en el mismo mensaje: sin destino → el formulario; con destino y
 * sin contraseña de Gano → sus Ajustes, en la sección de Gano; con todo → el
 * formulario con lo suyo ya escrito, para actualizarlo. Devuelve el texto
 * entregado, o `null` si no se pudo (el turno sigue al motor).
 */
export async function atenderModoWazeSocio(
  supabase: Supa,
  telefono: string,
  socio: { constructorId: string },
): Promise<string | null> {
  const { data: frag } = await supabase.from('nexus_documents').select('content')
    .eq('tenant_id', 'dashboard').eq('category', FRAGMENTO_MODO_WAZE).maybeSingle();
  const texto = String(frag?.content ?? '').replace(/^###[^\n]*\n+/, '').trim();
  if (!texto) { console.warn(`⚠️ [Destino] No está ${FRAGMENTO_MODO_WAZE} en el tenant dashboard`); return null; }
  const destino = await destinoDelSocio(supabase, socio.constructorId);
  if (destino && !(await tieneContrasenaGano(supabase, socio.constructorId))) {
    const url = await enlaceAjustes(socio.constructorId, 'ajustes-gano');
    if (url && (await sendCtaUrl(telefono, texto, TEXTO_BOTON_AJUSTES, url)).ok) return texto;
  }
  const r = await enviarFormularioDestino(telefono, socio.constructorId, destino, texto, destino ? 'Actualizar destino' : CTA_FORMULARIO);
  if (r.ok) return texto;
  return (await sendText(telefono, texto)).ok ? texto : null;
}
