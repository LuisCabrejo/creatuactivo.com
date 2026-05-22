/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Warm Handoff — Sumario Ejecutivo (Opción B, 22 May 2026)
 *
 * Cuando un prospecto entra a Estado 4 del FSM (handoff al equipo directivo),
 * este módulo:
 *   1. Genera un expediente táctico con Claude Haiku (~1s, <$0.005)
 *      a partir del historial de la conversación + datos capturados.
 *   2. Envía un email HTML al equipo directivo via Resend.
 *
 * Fundamento: investigación corporativa (Salesforce Agentforce, Intercom Fin,
 * HubSpot Breeze) — *"un traspaso deficiente fuerza al prospecto cualificado
 * a repetir sus intenciones, nombre, presupuesto y necesidades, destruyendo
 * el sentimiento de valor generado durante la conversación inicial."*
 *
 * El equipo (Lili) abre el email Y recibe una matriz táctica con:
 *   - Datos de contacto (nombre, paquete, score)
 *   - Arquetipo detectado
 *   - Dolores expresados textualmente
 *   - Objeciones manejadas durante la auditoría
 *   - Mensajes clave (citas directas del prospecto)
 *   - Recomendación de "next best action"
 *
 * Esto se envía MILISEGUNDOS antes de que el prospecto haga clic en el link
 * WhatsApp — el equipo tiene contexto completo ANTES del primer mensaje.
 */

import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';

const EQUIPO_DIRECTIVO_EMAIL = process.env.EQUIPO_DIRECTIVO_EMAIL || 'sistema@creatuactivo.com';
const FROM_EMAIL = 'Queswa Handoff <hola@creatuactivo.com>';

// Lazy initialization
let anthropicClient: Anthropic | null = null;
let resendClient: Resend | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
}

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

/**
 * Mapping de paquete code → nombre descriptivo + datos clave.
 */
const PACKAGE_INFO: Record<string, { nombre: string; precioUSD: string; precioCOP: string; rentabilidad: string }> = {
  'ESP-1': { nombre: 'ESP-1 Inicial', precioUSD: '$200 USD', precioCOP: '$900,000 COP', rentabilidad: '15%' },
  'ESP-2': { nombre: 'ESP-2 Empresarial', precioUSD: '$500 USD', precioCOP: '$2,250,000 COP', rentabilidad: '16%' },
  'ESP-3': { nombre: 'ESP-3 Visionario', precioUSD: '$1,000 USD', precioCOP: '$4,500,000 COP', rentabilidad: '17%' },
};

export interface ProspectDataForHandoff {
  name?: string;
  package?: string; // ESP-1, ESP-2, ESP-3
  archetype?: string;
  interest_level?: number;
  email?: string;
  whatsapp?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ExpedienteTactico {
  nombre: string;
  paquete: string; // ESP-X
  paqueteNombre: string; // ESP-X Visionario
  arquetipo: string;
  score: number;
  dolores_expresados: string[]; // 2-3 dolores citados textualmente
  objeciones_manejadas: string[]; // qué objeciones planteó y cómo se resolvieron
  mensajes_clave: string[]; // 2-3 frases textuales del prospecto
  next_best_action: string; // recomendación al equipo
  duracion_conversacion_min: number;
  fecha_handoff_iso: string;
}

/**
 * Genera el expediente táctico llamando a Claude Haiku con el historial completo
 * + datos ya capturados. Retorna estructura tipada.
 */
export async function generarSumarioEjecutivo(
  conversacion: ConversationMessage[],
  prospectData: ProspectDataForHandoff
): Promise<ExpedienteTactico> {
  const paqueteCodigo = prospectData.package || 'ESP-?';
  const paqueteInfo = PACKAGE_INFO[paqueteCodigo];
  const paqueteNombre = paqueteInfo?.nombre || paqueteCodigo;

  // Tomamos los últimos 15 turnos para no sobrecargar Haiku
  const turnosRelevantes = conversacion.slice(-15);
  const historialTexto = turnosRelevantes
    .map((m) => `[${m.role === 'user' ? 'PROSPECTO' : 'QUESWA'}]: ${m.content}`)
    .join('\n\n');

  const promptSumario = `Eres un analista de ventas senior. Tu tarea es leer el siguiente historial de chat entre un prospecto y Queswa (chatbot de calificación patrimonial) y generar un expediente táctico para el equipo directivo que recibirá al prospecto vía WhatsApp.

DATOS YA CAPTURADOS:
- Nombre: ${prospectData.name || 'no_capturado'}
- Paquete elegido: ${paqueteNombre}
- Arquetipo detectado: ${prospectData.archetype || 'no_detectado'}
- Score de interés: ${prospectData.interest_level ?? 0}/100

HISTORIAL DE CONVERSACIÓN:
${historialTexto}

INSTRUCCIONES:
Genera un JSON con las siguientes claves (sin markdown, sin texto adicional, solo JSON puro):

{
  "dolores_expresados": ["..."], // 1-3 dolores que el prospecto expresó EXPLÍCITAMENTE en sus mensajes. Cita textual o paráfrasis cercana. Si no expresó dolor, array vacío.
  "objeciones_manejadas": ["..."], // 0-3 objeciones que el prospecto planteó y cómo se resolvieron. Formato: "Objeción → Resolución".
  "mensajes_clave": ["..."], // 1-3 frases textuales del prospecto que muestren su nivel de interés, contexto personal, o señales de compra.
  "next_best_action": "..." // 1 oración con la recomendación más útil para el equipo. Ej: "Saludar reconociendo su rol como [arquetipo] y mencionar que evaluó los 3 niveles antes de elegir ESP-3."
}

Sé conciso. Cada elemento de los arrays máximo 120 caracteres. El JSON debe ser válido y parseable.`;

  try {
    const startTime = Date.now();
    const response = await getAnthropicClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{ role: 'user', content: promptSumario }],
    });

    const tiempoHaiku = Date.now() - startTime;
    console.log(`📊 [Handoff] Sumario generado por Haiku en ${tiempoHaiku}ms`);

    // Extraer JSON de la respuesta
    const textBlock = response.content.find((b) => b.type === 'text');
    const responseText = textBlock?.type === 'text' ? textBlock.text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Haiku no devolvió JSON válido');
    }
    const sumarioParsed = JSON.parse(jsonMatch[0]);

    // Calcular duración aprox de la conversación
    const duracionMin = Math.max(1, Math.round(conversacion.length * 0.5));

    return {
      nombre: prospectData.name || 'No capturado',
      paquete: paqueteCodigo,
      paqueteNombre,
      arquetipo: prospectData.archetype || 'no_detectado',
      score: prospectData.interest_level ?? 0,
      dolores_expresados: sumarioParsed.dolores_expresados || [],
      objeciones_manejadas: sumarioParsed.objeciones_manejadas || [],
      mensajes_clave: sumarioParsed.mensajes_clave || [],
      next_best_action: sumarioParsed.next_best_action || 'Saludar al prospecto y proceder con la activación del paquete.',
      duracion_conversacion_min: duracionMin,
      fecha_handoff_iso: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ [Handoff] Error generando sumario con Haiku:', error);
    // Fallback: expediente mínimo sin sumario semántico
    return {
      nombre: prospectData.name || 'No capturado',
      paquete: paqueteCodigo,
      paqueteNombre,
      arquetipo: prospectData.archetype || 'no_detectado',
      score: prospectData.interest_level ?? 0,
      dolores_expresados: [],
      objeciones_manejadas: [],
      mensajes_clave: [],
      next_best_action: 'Sumario automático no disponible — proceder con activación estándar.',
      duracion_conversacion_min: Math.max(1, Math.round(conversacion.length * 0.5)),
      fecha_handoff_iso: new Date().toISOString(),
    };
  }
}

/**
 * Renderiza el HTML del email con la matriz táctica.
 * Estilo Lujo Clínico — sin emojis decorativos, tipografía técnica.
 */
function renderExpedienteHTML(expediente: ExpedienteTactico): string {
  const paqueteInfo = PACKAGE_INFO[expediente.paquete];

  const renderList = (items: string[], emptyMsg: string) =>
    items.length === 0
      ? `<p style="color:#A3A3A3;font-style:italic;margin:0">${emptyMsg}</p>`
      : `<ul style="margin:0;padding-left:20px;color:#E5E5E5">${items.map((i) => `<li style="margin-bottom:6px">${i}</li>`).join('')}</ul>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Handoff Queswa: ${expediente.nombre} → ${expediente.paqueteNombre}</title>
</head>
<body style="margin:0;padding:0;background:#0F1115;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#E5E5E5;line-height:1.6">
  <div style="max-width:640px;margin:0 auto;padding:32px 24px;background:#15171C">

    <!-- Header -->
    <div style="border-bottom:1px solid #94A3B8;padding-bottom:16px;margin-bottom:24px">
      <p style="color:#94A3B8;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px">Expediente Táctico — Handoff Queswa</p>
      <h1 style="color:#C5A059;font-size:24px;font-weight:600;margin:0">${expediente.nombre}</h1>
      <p style="color:#FFFFFF;font-size:14px;margin:4px 0 0">${expediente.paqueteNombre} · Score ${expediente.score}/100 · Arquetipo: ${expediente.arquetipo}</p>
    </div>

    <!-- Datos operativos -->
    <div style="background:#1A1D23;padding:16px 20px;border-left:3px solid #C5A059;margin-bottom:24px">
      <table style="width:100%;font-size:13px">
        <tr><td style="color:#A3A3A3;padding:4px 0;width:40%">Nombre</td><td style="color:#FFFFFF;font-weight:600">${expediente.nombre}</td></tr>
        <tr><td style="color:#A3A3A3;padding:4px 0">Paquete</td><td style="color:#C5A059;font-weight:600">${expediente.paqueteNombre}</td></tr>
        ${paqueteInfo ? `<tr><td style="color:#A3A3A3;padding:4px 0">Inversión</td><td style="color:#FFFFFF">${paqueteInfo.precioUSD} · ${paqueteInfo.precioCOP} · Rentabilidad ${paqueteInfo.rentabilidad}</td></tr>` : ''}
        <tr><td style="color:#A3A3A3;padding:4px 0">Score de interés</td><td style="color:#FFFFFF">${expediente.score}/100</td></tr>
        <tr><td style="color:#A3A3A3;padding:4px 0">Arquetipo</td><td style="color:#FFFFFF">${expediente.arquetipo}</td></tr>
        <tr><td style="color:#A3A3A3;padding:4px 0">Duración conversación</td><td style="color:#FFFFFF">~${expediente.duracion_conversacion_min} min</td></tr>
      </table>
    </div>

    <!-- Dolores expresados -->
    <div style="margin-bottom:24px">
      <h2 style="color:#C5A059;font-size:15px;font-weight:600;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.05em">Dolores expresados</h2>
      ${renderList(expediente.dolores_expresados, 'El prospecto no expresó dolores explícitos durante la conversación.')}
    </div>

    <!-- Objeciones manejadas -->
    <div style="margin-bottom:24px">
      <h2 style="color:#C5A059;font-size:15px;font-weight:600;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.05em">Objeciones manejadas</h2>
      ${renderList(expediente.objeciones_manejadas, 'El prospecto no planteó objeciones — flujo limpio hacia el cierre.')}
    </div>

    <!-- Mensajes clave -->
    <div style="margin-bottom:24px">
      <h2 style="color:#C5A059;font-size:15px;font-weight:600;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.05em">Mensajes clave (citas)</h2>
      ${renderList(expediente.mensajes_clave.map((m) => `<em style="color:#FFFFFF">"${m}"</em>`), 'Sin citas extraídas.')}
    </div>

    <!-- Next best action -->
    <div style="background:#0F1115;padding:16px 20px;border:1px solid #94A3B8;margin-bottom:24px">
      <h2 style="color:#94A3B8;font-size:11px;font-weight:600;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em">Next best action</h2>
      <p style="color:#FFFFFF;font-size:14px;margin:0;line-height:1.6">${expediente.next_best_action}</p>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #475569;padding-top:16px;margin-top:24px">
      <p style="color:#64748B;font-size:11px;margin:0;line-height:1.5">
        Expediente generado automáticamente por Queswa al detectar Estado 4 del FSM (handoff).<br>
        Fecha: ${new Date(expediente.fecha_handoff_iso).toLocaleString('es-CO', { timeZone: 'America/Bogota', dateStyle: 'long', timeStyle: 'short' })}<br>
        El prospecto recibirá el link de WhatsApp en este momento. Tiempo estimado de respuesta: &lt;45s.
      </p>
    </div>

  </div>
</body>
</html>`;
}

/**
 * Envía el email del expediente táctico al equipo directivo.
 * Fire-and-forget: no bloquea el handoff al prospecto si falla.
 */
export async function enviarExpedienteEquipo(expediente: ExpedienteTactico): Promise<void> {
  try {
    const html = renderExpedienteHTML(expediente);
    const subject = `[Handoff Queswa] ${expediente.nombre} → ${expediente.paqueteNombre} (Score ${expediente.score}/100)`;

    const { data, error } = await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: [EQUIPO_DIRECTIVO_EMAIL],
      replyTo: 'hola@creatuactivo.com',
      subject,
      html,
    });

    if (error) {
      console.error('❌ [Handoff] Error Resend:', error.message);
      return;
    }

    console.log(`✅ [Handoff] Expediente enviado a ${EQUIPO_DIRECTIVO_EMAIL} — ID: ${data?.id}`);
  } catch (err) {
    console.error('❌ [Handoff] Excepción enviando expediente:', err);
  }
}

/**
 * Pipeline completo: generar sumario + enviar email. Fire-and-forget.
 * Se llama en paralelo al delivery del texto al prospecto — no bloquea.
 */
export async function ejecutarWarmHandoff(
  conversacion: ConversationMessage[],
  prospectData: ProspectDataForHandoff
): Promise<void> {
  try {
    const expediente = await generarSumarioEjecutivo(conversacion, prospectData);
    await enviarExpedienteEquipo(expediente);
  } catch (err) {
    console.error('❌ [Handoff] Pipeline falló:', err);
  }
}
