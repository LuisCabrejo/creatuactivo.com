/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El cumpleaños del distribuidor, por WhatsApp (9 oct 2026).
 *
 * Pedido del Director: un mensaje que le pide a cada socio su cumpleaños —«me lo
 * escribe aquí y yo lo guardo, o lo anota en Ajustes de Cuenta»— para que ese día
 * el Centro de Mando le avise a su patrocinador y a la administración y lo
 * saluden. El aviso del día vive en el Dashboard (`/api/socio/cumpleanos/avisar`).
 *
 * Aquí: el texto del pedido (plantilla y texto libre, el mismo), el envío con la
 * ventana de 24 h, y lo que pasa cuando el socio responde. La FECHA NO SE LEE
 * AQUÍ: se le manda el texto tal cual al Dashboard (`/api/socio/cumpleanos/canal`),
 * que la lee con el mismo código de Ajustes y de Queswa del Centro de Mando.
 */

import { sendTemplate, sendText, type WAResult } from '@/lib/wa-channel';
import { dentroDeVentana } from '@/lib/wa-ventana';
import { destinatarios, ultimoMensajeDelSocio, type Destinatario } from '@/lib/wa-lunes-socio';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supa = any;

/** La plantilla vigente. Si se cambia el texto, nombre nuevo (Meta no deja corregir la categoría). */
export const PLANTILLA_CUMPLE = 'cumpleanos_socio_v1';

/** El pedido. ⚠️ Mismo texto que la plantilla (scripts/someter-plantilla-cumpleanos-socio.mjs). */
export function cuerpoCumple(nombre: string): string {
  return (
    `🎂 Hola, ${nombre}. En el equipo queremos celebrar su cumpleaños con usted.\n\n` +
    '¿Qué día es? Escríbamelo aquí, por ejemplo «15 de marzo», y yo lo guardo. ' +
    'También lo puede anotar en Ajustes de Cuenta de queswa.app.'
  );
}

export const RESPUESTA_NO_ENTENDI = '¿Me lo escribe con el día y el mes? Por ejemplo: 15 de marzo.';
export const respuestaGuardado = (legible: string) =>
  `Listo, quedó guardado: ${legible}. 🎂 Si algún día lo quiere cambiar, está en Ajustes de Cuenta de queswa.app.`;

/** ¿El último mensaje de Queswa fue el pedido del cumpleaños? */
export function botPidioCumple(ultimoBot: string): boolean {
  return /cumplea[ñn]os/i.test(ultimoBot) && /qu[eé] d[ií]a es|escr[ií]bamelo/i.test(ultimoBot);
}

const MES = /\b(ene(ro)?|feb(rero)?|mar(zo)?|abr(il)?|may(o)?|jun(io)?|jul(io)?|ago(sto)?|sep(t(iembre)?)?|set(iembre)?|oct(ubre)?|nov(iembre)?|dic(iembre)?)\b/i;

/** ¿El socio está diciendo su cumpleaños por su cuenta? («mi cumpleaños es el 15 de marzo») */
export function socioDiceSuCumple(texto: string): boolean {
  return /\b(mi|su)\s+cumplea[ñn]os\b|\bnac[ií]\b|\bcumplo\b/i.test(texto) && (MES.test(texto) || /\d{1,2}\s*[/.-]\s*\d{1,2}/.test(texto));
}

/**
 * Una respuesta que, si no se entiende, merece «¿me lo escribe con el día y el
 * mes?». Una pregunta o un mensaje largo no: es otro tema y sigue su camino.
 */
export function pareceIntentoDeFecha(texto: string): boolean {
  const t = texto.trim();
  return t.length <= 40 && !t.includes('?') && (/\d/.test(t) || MES.test(t));
}

export type CumpleGuardado = { ok: true; legible: string } | { ok: false };

/** Le pasa el texto al Dashboard, que lee la fecha y la guarda. `null` si el puente falló. */
export async function guardarCumpleEnDashboard(constructorId: string, texto: string): Promise<CumpleGuardado | null> {
  const secreto = process.env.WA_BRIDGE_SECRET?.trim();
  if (!secreto) { console.warn('⚠️ [Cumpleaños] Sin WA_BRIDGE_SECRET: no se puede guardar'); return null; }
  try {
    const base = process.env.DASHBOARD_URL || 'https://queswa.app';
    const r = await fetch(`${base}/api/socio/cumpleanos/canal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-wa-bridge-secret': secreto },
      body: JSON.stringify({ constructorId, texto }),
    });
    const j = (await r.json().catch(() => ({}))) as { ok?: boolean; legible?: string; error?: string };
    if (r.ok && j.ok && j.legible) return { ok: true, legible: j.legible };
    if (r.ok && j.ok === false) return { ok: false };
    console.warn(`⚠️ [Cumpleaños] El Dashboard no lo guardó: ${j.error || r.status}`);
    return null;
  } catch (e) {
    console.warn('⚠️ [Cumpleaños] Falló el puente al Dashboard:', e);
    return null;
  }
}

/** Los socios a los que les falta el cumpleaños. */
export async function sociosSinCumple(supabase: Supa): Promise<Destinatario[]> {
  const lista = await destinatarios(supabase);
  const { data, error } = await supabase.from('private_users').select('constructor_id').not('cumple_dia', 'is', null);
  if (error) throw error;
  const tienen = new Set((data ?? []).map((x: { constructor_id: string }) => x.constructor_id));
  return lista.filter((d) => !tienen.has(d.constructorId));
}

/**
 * Le pide el cumpleaños a un socio: dentro de la ventana de 24 h va como texto
 * (sin costo); fuera, por plantilla. Queda en su historial para que el nodo del
 * webhook reconozca la respuesta.
 */
export async function pedirCumpleA(supabase: Supa, d: Destinatario, ahora = new Date()): Promise<{ via: 'texto' | 'plantilla' | null; ok: boolean; error?: string }> {
  const texto = cuerpoCumple(d.primerNombre);
  const enVentana = dentroDeVentana(await ultimoMensajeDelSocio(supabase, d), ahora);
  let via: 'texto' | 'plantilla' = enVentana ? 'texto' : 'plantilla';
  let res: WAResult = enVentana
    ? await sendText(d.telefono, texto)
    : await sendTemplate(d.telefono, PLANTILLA_CUMPLE, 'es', [d.primerNombre]);
  if (!res.ok && enVentana) {
    res = await sendTemplate(d.telefono, PLANTILLA_CUMPLE, 'es', [d.primerNombre]);
    via = 'plantilla';
  }
  if (res.ok) {
    try {
      const huella = `wa_${d.telefono}`;
      await supabase.from('nexus_conversations').insert({
        fingerprint_id: huella, session_id: huella,
        messages: [{ role: 'assistant', content: texto, timestamp: ahora.toISOString() }],
      });
    } catch (err) { console.error('⚠️ [Cumpleaños] No se pudo anotar en el historial:', err); }
  }
  return { via: res.ok ? via : null, ok: res.ok, error: res.ok ? undefined : res.error };
}
