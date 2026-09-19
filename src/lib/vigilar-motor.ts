/**
 * Vigilante del motor: ¿la clave de Anthropic sigue viva?
 *
 * ── POR QUÉ ──────────────────────────────────────────────────────────────────
 * El 16 sep 2026 (~09:00 Bogotá) se agotó el crédito de la cuenta de Anthropic y
 * durante 58 horas todo turno con modelo —WhatsApp, web, ganocafe.online y el
 * Dashboard, que comparte la clave— devolvió 500. El webhook contestaba «Hubo un
 * error procesando su mensaje» y no persistía nada; los nodos dictados seguían
 * saliendo, así que el volcado de conversaciones parecía sano. El health check
 * de `/api/nexus` decía «healthy» sin tocar la clave. El Director estaba dos
 * días fuera de la ciudad y nadie se enteró.
 *
 * ── QUÉ HACE ─────────────────────────────────────────────────────────────────
 * `sondear()` le pide UN token a Haiku con la clave de producción y clasifica la
 * respuesta: `ok`, `facturacion` (crédito agotado, clave inválida o revocada:
 * hay que actuar), o `caida` (5xx / red: suele pasar sola). `vigilar()` compara
 * con el estado guardado en `alertas_sistema` y **avisa solo cuando el estado
 * cambia**: un correo al caer, otro al recuperarse, y un recordatorio si la
 * caída de facturación lleva más de `RECORDATORIO_H` horas sin resolverse. Así
 * no llega un correo cada 15 minutos.
 *
 * Correo por Resend a `ALERTA_SISTEMA_EMAIL` (lista separada por coma; por defecto
 * sistema@creatuactivo.com y luiscabrejo7@gmail.com — el Director está más pendiente del correo).
 * Lo corre `/api/cron/vigilar-motor` cada 15 minutos (vercel.json). El Console de
 * Anthropic manda su propio correo de facturación al administrador; esto es la
 * segunda fuente, y la única que mira lo que el motor ve de verdad.
 *
 * ⚠️ Lo que NO cubre: si Vercel o Supabase se caen, el cron tampoco corre.
 */
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export type EstadoMotor = 'ok' | 'facturacion' | 'caida';
export type Sondeo = { estado: EstadoMotor; detalle: string; ms: number; http?: number };

const CLAVE = 'anthropic_api';
const MODELO_SONDA = 'claude-haiku-4-5-20251001';
const RECORDATORIO_H = 6;
/** Uno o varios correos separados por coma. Por defecto el buzón de sistema y el personal del Director (18 sep 2026). */
export const DESTINO_ALERTA = (process.env.ALERTA_SISTEMA_EMAIL || 'sistema@creatuactivo.com, luiscabrejo7@gmail.com')
  .split(',').map((e) => e.trim()).filter(Boolean);
const FROM_EMAIL = 'Vigilante Queswa <hola@creatuactivo.com>';

const RE_FACTURACION = /credit balance|billing|purchase credits|invalid x-api-key|authentication_error|api key|permission_error|revoked|disabled/i;

/** Un token a Haiku con la clave de producción. Nunca lanza. */
export async function sondear(apiKey = process.env.ANTHROPIC_API_KEY || ''): Promise<Sondeo> {
  const t0 = Date.now();
  if (!apiKey) return { estado: 'facturacion', detalle: 'ANTHROPIC_API_KEY no está definida en el entorno', ms: 0 };
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: MODELO_SONDA, max_tokens: 1, messages: [{ role: 'user', content: 'ok' }] }),
      signal: AbortSignal.timeout(20_000),
    });
    const ms = Date.now() - t0;
    if (r.ok) return { estado: 'ok', detalle: `Haiku respondió en ${ms} ms`, ms, http: r.status };
    const cuerpo = (await r.text()).slice(0, 400);
    let mensaje = cuerpo;
    try { mensaje = JSON.parse(cuerpo)?.error?.message || cuerpo; } catch { /* texto plano */ }
    const facturacion = r.status === 401 || r.status === 402 || r.status === 403 || RE_FACTURACION.test(mensaje);
    return { estado: facturacion ? 'facturacion' : 'caida', detalle: `HTTP ${r.status}: ${mensaje}`, ms, http: r.status };
  } catch (err) {
    return { estado: 'caida', detalle: `Sin respuesta de api.anthropic.com: ${err instanceof Error ? err.message : String(err)}`, ms: Date.now() - t0 };
  }
}

type Fila = { clave: string; estado: EstadoMotor; detalle: string | null; ultimo_aviso_en: string | null; actualizado_en: string };

function supabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

const bogota = (d: Date) => d.toLocaleString('es-CO', { timeZone: 'America/Bogota', hour12: false });

function asunto(tipo: 'caida' | 'recuperado' | 'recordatorio', s: Sondeo): string {
  if (tipo === 'recuperado') return '✅ Queswa volvió a responder — la clave de Anthropic está viva';
  if (tipo === 'recordatorio') return `🔴 SIGUE CAÍDO — Queswa lleva horas sin poder responder (${s.estado})`;
  return s.estado === 'facturacion'
    ? '🔴 Queswa NO puede responder — la clave de Anthropic rechaza el pago o la clave'
    : '🟠 Queswa no obtiene respuesta de Anthropic (caída, suele pasar sola)';
}

function cuerpo(tipo: 'caida' | 'recuperado' | 'recordatorio', s: Sondeo, desde?: string | null): string {
  const ahora = bogota(new Date());
  const lineaDesde = desde ? `<p><b>Desde:</b> ${bogota(new Date(desde))} (hora Bogotá)</p>` : '';
  const queHacer = s.estado === 'facturacion'
    ? `<p><b>Qué hacer:</b> entrar a <a href="https://console.anthropic.com/settings/billing">console.anthropic.com → Plans &amp; Billing</a> y revisar el saldo, la recarga automática y la tarjeta. Si la clave fue revocada, generar una nueva y actualizar <code>ANTHROPIC_API_KEY</code> en Vercel (creatuactivo-com y el Dashboard).</p>`
    : `<p><b>Qué hacer:</b> nada todavía. Si el siguiente sondeo sigue igual, revisar <a href="https://status.anthropic.com">status.anthropic.com</a>.</p>`;
  const efecto = `<p><b>Mientras dure:</b> WhatsApp, la web, ganocafe.online y queswa.app solo entregan las respuestas dictadas (apertura, «Cómo funciona», 12 Niveles, simulador). Todo lo que pase por el modelo recibe «Hubo un error procesando su mensaje» y <u>no queda guardado</u>.</p>`;
  if (tipo === 'recuperado') {
    return `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;color:#222">
      <h2 style="margin:0 0 12px">Queswa volvió a responder</h2>
      <p>${s.detalle}. Verificado a las ${ahora} (hora Bogotá).</p>${lineaDesde}
      <p style="color:#666;font-size:13px">Vigilante del motor · cada 15 minutos · creatuactivo.com/api/cron/vigilar-motor</p></div>`;
  }
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;color:#222">
    <h2 style="margin:0 0 12px">${tipo === 'recordatorio' ? 'Sigue caído' : 'Queswa no puede responder'}</h2>
    <p><b>Lo que dijo Anthropic:</b> ${s.detalle.replace(/</g, '&lt;')}</p>
    <p><b>Sondeo:</b> ${ahora} (hora Bogotá)</p>${lineaDesde}
    ${queHacer}${efecto}
    <p style="color:#666;font-size:13px">Vigilante del motor · cada 15 minutos · avisa al cambiar de estado y cada ${RECORDATORIO_H} h mientras siga caído.</p></div>`;
}

async function enviar(subject: string, html: string): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) return { ok: false, error: 'RESEND_API_KEY no definida' };
  try {
    const r = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: FROM_EMAIL, to: DESTINO_ALERTA, subject, html });
    return r.error ? { ok: false, error: r.error.message } : { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export type ResultadoVigilancia = {
  sondeo: Sondeo;
  estadoPrevio: EstadoMotor | null;
  aviso: 'ninguno' | 'caida' | 'recuperado' | 'recordatorio';
  correo?: { ok: boolean; error?: string };
};

/**
 * Sondea, compara con el estado guardado y avisa solo si cambió (o si la caída
 * de facturación lleva más de RECORDATORIO_H horas). `simular` fuerza un estado
 * para probar el correo sin tocar la clave real.
 */
export async function vigilar(opts: { simular?: EstadoMotor; enviar?: boolean } = {}): Promise<ResultadoVigilancia> {
  const enviarCorreo = opts.enviar ?? true;
  const sondeo: Sondeo = opts.simular
    ? { estado: opts.simular, detalle: `SIMULACIÓN (${opts.simular}) — la clave real no se tocó`, ms: 0 }
    : await sondear();

  const s = supabase();
  const { data } = await s.from('alertas_sistema').select('*').eq('clave', CLAVE).maybeSingle();
  const previa = (data as Fila | null) ?? null;
  const estadoPrevio = previa?.estado ?? null;
  const ahora = new Date();

  let aviso: ResultadoVigilancia['aviso'] = 'ninguno';
  let desde: string | null = previa?.actualizado_en ?? null;

  if (sondeo.estado === 'ok') {
    if (estadoPrevio && estadoPrevio !== 'ok') aviso = 'recuperado';
  } else if (estadoPrevio !== sondeo.estado) {
    // Una caída transitoria (5xx/red) no avisa a la primera: se espera al
    // segundo sondeo seguido. La de facturación avisa de inmediato.
    aviso = sondeo.estado === 'facturacion' || estadoPrevio === 'caida' ? 'caida' : 'ninguno';
    if (aviso === 'ninguno') desde = ahora.toISOString();
  } else {
    const ultimo = previa?.ultimo_aviso_en ? new Date(previa.ultimo_aviso_en).getTime() : 0;
    if (ahora.getTime() - ultimo > RECORDATORIO_H * 3600_000) aviso = 'recordatorio';
  }

  let correo: ResultadoVigilancia['correo'];
  if (aviso !== 'ninguno' && enviarCorreo) {
    correo = await enviar(asunto(aviso, sondeo), cuerpo(aviso, sondeo, aviso === 'recuperado' ? previa?.actualizado_en : desde));
  }

  // El estado se guarda siempre; `actualizado_en` marca desde cuándo está así.
  const cambio = estadoPrevio !== sondeo.estado;
  await s.from('alertas_sistema').upsert({
    clave: CLAVE,
    estado: sondeo.estado,
    detalle: sondeo.detalle.slice(0, 500),
    ultimo_aviso_en: correo?.ok ? ahora.toISOString() : previa?.ultimo_aviso_en ?? null,
    actualizado_en: cambio || !previa ? ahora.toISOString() : previa.actualizado_en,
  });

  return { sondeo, estadoPrevio, aviso, correo };
}
