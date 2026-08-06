/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * WhatsApp Cloud API — capa de canal (plano de datos).
 *
 * ÚNICO lugar del ecosistema que habla con graph.facebook.com y que conoce
 * WHATSAPP_SYSTEM_TOKEN. Todo lo demás (webhook, funnel, puente del Dashboard)
 * pasa por aquí. Si Meta cambia de versión de API o de contrato, se toca este
 * archivo y nada más.
 *
 * v1.0 — Julio 2026
 */

const META_API_VERSION = 'v22.0';
const GRAPH = `https://graph.facebook.com/${META_API_VERSION}`;

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface WAResult {
  ok: boolean
  messageId?: string
  error?: string
}

export interface WATemplateParam {
  type: 'text'
  text: string
}

/** Plantilla tal como la devuelve Meta (subconjunto que nos interesa). */
export interface WATemplate {
  name: string
  status: string          // APPROVED | PENDING | REJECTED
  language: string        // es | en_US
  category?: string
  /** Nº de variables {{n}} del BODY — derivado, para pedirlas en la UI. */
  bodyVariables: number
  bodyText?: string
}

/** Identidad del número emisor (para mostrar el activo real en la consola). */
export interface WAPhoneAsset {
  phoneNumberId: string
  displayPhoneNumber?: string
  verifiedName?: string
  qualityRating?: string
  wabaId?: string
  /** APPROVED | DECLINED | PENDING_REVIEW — estado del nombre visible actual */
  nameStatus?: string
  /** Estado de una solicitud de cambio de nombre en curso (NONE si no hay) */
  newNameStatus?: string
}

// ─── Credenciales ─────────────────────────────────────────────────────────────

function credentials() {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const systemToken   = process.env.WHATSAPP_SYSTEM_TOKEN;
  const wabaId        = process.env.WHATSAPP_WABA_ID;

  if (!phoneNumberId || !systemToken) {
    return { error: '[WA] Faltan WHATSAPP_PHONE_NUMBER_ID o WHATSAPP_SYSTEM_TOKEN' as const };
  }
  return { phoneNumberId, systemToken, wabaId };
}

/**
 * Meta exige formato internacional sin "+" ni separadores (ej: 573001234567).
 * Acepta lo que escriba un humano en la consola y lo normaliza.
 */
export function normalizePhone(raw: string): string {
  return raw.replace(/[^\d]/g, '');
}

/** Extrae el mensaje de error legible de una respuesta de la Graph API. */
function metaError(status: number, data: unknown): string {
  const err = (data as { error?: { message?: string; error_user_msg?: string } })?.error;
  const detail = err?.error_user_msg || err?.message || JSON.stringify(data);
  return `Meta API ${status}: ${detail}`;
}

// ─── Envío: mensaje de texto libre (whatsapp_business_messaging) ──────────────

/**
 * Mensaje de texto libre. Solo válido dentro de la ventana de servicio de 24h
 * abierta por el usuario; fuera de ella Meta rechaza y hay que usar plantilla.
 */
export async function sendText(to: string, text: string): Promise<WAResult> {
  const creds = credentials();
  if ('error' in creds) {
    console.error(creds.error);
    return { ok: false, error: creds.error };
  }

  try {
    const response = await fetch(`${GRAPH}/${creds.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${creds.systemToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: normalizePhone(to),
        type: 'text',
        text: { body: text },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = metaError(response.status, data);
      console.error(`❌ [WA] sendText — ${msg}`);
      return { ok: false, error: msg };
    }

    const messageId = data?.messages?.[0]?.id;
    console.log(`✅ [WA] Texto enviado a ${normalizePhone(to)} (msg: ${messageId})`);
    return { ok: true, messageId };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('❌ [WA] sendText error:', msg);
    return { ok: false, error: msg };
  }
}

// ─── Envío: mensaje interactivo de lista ──────────────────────────────────────

export interface WAListRow {
  /** Se devuelve en `interactive.list_reply.id` cuando la persona elige. */
  id: string
  /** Máx. 24 caracteres — Meta rechaza el mensaje entero si se pasa. */
  title: string
  /** Máx. 72 caracteres. */
  description?: string
}

/**
 * Lista de opciones dentro del chat.
 *
 * Por qué lista y no botones: los botones de respuesta admiten 20 caracteres y
 * las preguntas reales del prospecto no caben sin mutilarlas. La lista da 24 más
 * una línea de descripción.
 *
 * Por qué opciones y no una pregunta abierta: una pregunta abierta en el primer
 * mensaje carga cognitivamente y se lee como interrogatorio; el micro-compromiso
 * de un toque sostiene la conversación.
 *
 * ⚠️ Cuando la persona elige, Meta NO envía `text.body` sino
 * `interactive.list_reply`. Quien consuma el webhook tiene que leerlo o el toque
 * no produce nada.
 */
/**
 * Envía un WhatsApp Flow como mensaje interactivo.
 *
 * El Flow debe estar PUBLICADO en el WABA (los borradores solo abren desde la
 * vista previa del administrador). El id vive en una env — no en el código —
 * porque un Flow publicado es inmutable: cada corrección crea un Flow nuevo con
 * id nuevo, y eso debe poder apuntarse sin redeploy.
 *
 * ⚠️ Cuando la persona lo completa, Meta NO envía `text.body` sino
 * `interactive.nfm_reply` con `response_json` (el payload del `complete`). Quien
 * consuma el webhook tiene que leerlo o el toque final no produce nada.
 */
export async function sendFlow(
  to: string,
  flowId: string,
  bodyText: string,
  ctaLabel: string,
  opciones: { headerText?: string; screen?: string } = {},
): Promise<WAResult> {
  const creds = credentials();
  if ('error' in creds) {
    console.error(creds.error);
    return { ok: false, error: creds.error };
  }

  try {
    const response = await fetch(`${GRAPH}/${creds.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${creds.systemToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: normalizePhone(to),
        type: 'interactive',
        interactive: {
          type: 'flow',
          ...(opciones.headerText && { header: { type: 'text', text: opciones.headerText.slice(0, 60) } }),
          body: { text: bodyText.slice(0, 1024) },
          action: {
            name: 'flow',
            parameters: {
              flow_message_version: '3',
              // Token de correlación, no de seguridad: vuelve en el nfm_reply y
              // permite saber qué envío originó la respuesta.
              flow_token: `${normalizePhone(to)}_${Date.now()}`,
              flow_id: flowId,
              flow_cta: ctaLabel.slice(0, 30),
              flow_action: 'navigate',
              ...(opciones.screen && { flow_action_payload: { screen: opciones.screen } }),
            },
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = metaError(response.status, data);
      console.error(`❌ [WA] sendFlow — ${msg}`);
      return { ok: false, error: msg };
    }

    const messageId = data?.messages?.[0]?.id;
    console.log(`✅ [WA] Flow ${flowId} enviado a ${normalizePhone(to)} (msg: ${messageId})`);
    return { ok: true, messageId };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('❌ [WA] sendFlow error:', msg);
    return { ok: false, error: msg };
  }
}

export async function sendInteractiveList(
  to: string,
  bodyText: string,
  buttonLabel: string,
  rows: WAListRow[],
  sectionTitle = 'Temas',
): Promise<WAResult> {
  const creds = credentials();
  if ('error' in creds) {
    console.error(creds.error);
    return { ok: false, error: creds.error };
  }

  // Recortar a los límites de Meta en vez de que rechace el mensaje completo.
  const filas = rows.slice(0, 10).map((r) => ({
    id: r.id.slice(0, 200),
    title: r.title.slice(0, 24),
    ...(r.description && { description: r.description.slice(0, 72) }),
  }));

  try {
    const response = await fetch(`${GRAPH}/${creds.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${creds.systemToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: normalizePhone(to),
        type: 'interactive',
        interactive: {
          type: 'list',
          body: { text: bodyText.slice(0, 1024) },
          action: {
            button: buttonLabel.slice(0, 20),
            sections: [{ title: sectionTitle.slice(0, 24), rows: filas }],
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = metaError(response.status, data);
      console.error(`❌ [WA] sendInteractiveList — ${msg}`);
      return { ok: false, error: msg };
    }

    const messageId = data?.messages?.[0]?.id;
    console.log(`✅ [WA] Lista enviada a ${normalizePhone(to)} (${filas.length} opciones, msg: ${messageId})`);
    return { ok: true, messageId };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('❌ [WA] sendInteractiveList error:', msg);
    return { ok: false, error: msg };
  }
}

// ─── Envío: plantilla (whatsapp_business_messaging) ───────────────────────────

/**
 * Plantilla aprobada. Es la única vía para iniciar conversación fuera de la
 * ventana de 24h. `parameters` rellena las variables {{1}}, {{2}}… del BODY.
 */
export async function sendTemplate(
  to: string,
  templateName: string,
  languageCode = 'es',
  parameters: string[] = [],
): Promise<WAResult> {
  const creds = credentials();
  if ('error' in creds) {
    console.error(creds.error);
    return { ok: false, error: creds.error };
  }

  // Sin variables, Meta rechaza un `components` vacío — se omite del payload.
  const components = parameters.length > 0
    ? [{
        type: 'body',
        parameters: parameters.map<WATemplateParam>((text) => ({ type: 'text', text })),
      }]
    : undefined;

  try {
    const response = await fetch(`${GRAPH}/${creds.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${creds.systemToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: normalizePhone(to),
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          ...(components && { components }),
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = metaError(response.status, data);
      console.error(`❌ [WA] sendTemplate ${templateName} — ${msg}`);
      return { ok: false, error: msg };
    }

    const messageId = data?.messages?.[0]?.id;
    console.log(`✅ [WA] Plantilla ${templateName} enviada a ${normalizePhone(to)} (msg: ${messageId})`);
    return { ok: true, messageId };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('❌ [WA] sendTemplate error:', msg);
    return { ok: false, error: msg };
  }
}

// ─── Lectura: plantillas de la WABA (whatsapp_business_management) ────────────

/**
 * Lista las plantillas de la WABA. Este endpoint es el que ejerce
 * `whatsapp_business_management` — enviar una plantilla NO lo ejerce.
 */
export async function listTemplates(): Promise<{ templates: WATemplate[]; error?: string }> {
  const creds = credentials();
  if ('error' in creds) return { templates: [], error: creds.error };
  if (!creds.wabaId) return { templates: [], error: '[WA] Falta WHATSAPP_WABA_ID' };

  const url = `${GRAPH}/${creds.wabaId}/message_templates`
    + '?fields=name,status,language,category,components&limit=100';

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${creds.systemToken}` },
    });
    const data = await response.json();

    if (!response.ok) {
      const msg = metaError(response.status, data);
      console.error(`❌ [WA] listTemplates — ${msg}`);
      return { templates: [], error: msg };
    }

    const templates: WATemplate[] = (data?.data ?? []).map((t: {
      name: string
      status: string
      language: string
      category?: string
      components?: { type: string; text?: string }[]
    }) => {
      const body = t.components?.find((c) => c.type === 'BODY');
      const bodyText = body?.text;
      // Contar variables distintas {{1}}, {{2}}… (Meta las numera desde 1)
      const found = new Set(
        [...(bodyText?.matchAll(/\{\{(\d+)\}\}/g) ?? [])].map((m) => m[1]),
      );
      return {
        name: t.name,
        status: t.status,
        language: t.language,
        category: t.category,
        bodyVariables: found.size,
        bodyText,
      };
    });

    console.log(`✅ [WA] ${templates.length} plantillas leídas de la WABA`);
    return { templates };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('❌ [WA] listTemplates error:', msg);
    return { templates: [], error: msg };
  }
}

// ─── Lectura: media entrante (notas de voz, imágenes) ─────────────────────────

export interface WAMedia {
  buffer: ArrayBuffer
  mimeType: string
}

/**
 * Descarga un archivo que el usuario envió por WhatsApp (nota de voz, imagen).
 *
 * Meta lo entrega en dos saltos: primero se pide el metadato del `media_id`, que
 * responde una URL efímera; esa URL **también exige el token** — pedirla sin
 * Authorization devuelve 401 aunque parezca un enlace público.
 *
 * En LATAM la nota de voz es la norma, no la excepción: sin esto, quien manda un
 * audio no recibe absolutamente nada de vuelta.
 */
export async function downloadMedia(mediaId: string): Promise<{ media?: WAMedia; error?: string }> {
  const creds = credentials();
  if ('error' in creds) return { error: creds.error };

  try {
    const metaRes = await fetch(`${GRAPH}/${mediaId}`, {
      headers: { Authorization: `Bearer ${creds.systemToken}` },
    });
    const metaData = await metaRes.json();

    if (!metaRes.ok) {
      const msg = metaError(metaRes.status, metaData);
      console.error(`❌ [WA] downloadMedia (metadato) — ${msg}`);
      return { error: msg };
    }

    const url = metaData?.url as string | undefined;
    if (!url) return { error: '[WA] El metadato del media no trae URL' };

    const fileRes = await fetch(url, {
      headers: { Authorization: `Bearer ${creds.systemToken}` },
    });

    if (!fileRes.ok) {
      const msg = `Meta API ${fileRes.status} al descargar el archivo`;
      console.error(`❌ [WA] downloadMedia (archivo) — ${msg}`);
      return { error: msg };
    }

    const buffer = await fileRes.arrayBuffer();
    const mimeType = (metaData?.mime_type as string | undefined) || 'audio/ogg';
    console.log(`✅ [WA] Media ${mediaId} descargado (${mimeType}, ${buffer.byteLength} bytes)`);
    return { media: { buffer, mimeType } };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('❌ [WA] downloadMedia error:', msg);
    return { error: msg };
  }
}

// ─── Lectura: identidad del número emisor ─────────────────────────────────────

/**
 * Datos reales del número desde el que se envía. La consola los muestra en vez
 * de un rótulo estático: el revisor de Meta ve el activo real de la cuenta.
 */
export async function getPhoneAsset(): Promise<{ asset?: WAPhoneAsset; error?: string }> {
  const creds = credentials();
  if ('error' in creds) return { error: creds.error };

  const url = `${GRAPH}/${creds.phoneNumberId}`
    + '?fields=display_phone_number,verified_name,quality_rating,name_status,new_name_status';

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${creds.systemToken}` },
    });
    const data = await response.json();

    if (!response.ok) {
      const msg = metaError(response.status, data);
      console.error(`❌ [WA] getPhoneAsset — ${msg}`);
      return { error: msg };
    }

    return {
      asset: {
        phoneNumberId:      creds.phoneNumberId,
        displayPhoneNumber: data?.display_phone_number,
        verifiedName:       data?.verified_name,
        qualityRating:      data?.quality_rating,
        wabaId:             creds.wabaId,
        nameStatus:         data?.name_status,
        newNameStatus:      data?.new_name_status,
      },
    };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('❌ [WA] getPhoneAsset error:', msg);
    return { error: msg };
  }
}
