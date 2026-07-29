/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Webhook WhatsApp Cloud API — Adaptador de canal para motor Queswa
 * Recibe mensajes inbound de Meta, los pasa al motor Queswa, devuelve respuesta via API de Meta.
 *
 * v1.2 — Abril 2026
 * - CTWA: detecta referral de anuncios Meta (Mapa de Salida) y guarda atribución
 * - Fix source: usa SERVICE_ROLE_KEY para garantizar el insert en prospects
 * - pageContext: pasa contexto CTWA al motor para saludo personalizado
 */

// src/app/api/whatsapp/webhook/route.ts
// WABA Webhook — Adaptador canal WhatsApp → Queswa → WhatsApp
// Tenant: whatsapp (system prompt 'queswa_whatsapp' en Supabase)

import { createClient } from '@supabase/supabase-js';
import { sendText } from '@/lib/wa-channel';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Lo que el prospecto recibe cuando el guardarraíl bloquea una respuesta. Es
// también lo que queda en el historial y en la base: el modelo debe recordar lo
// que la persona leyó, no lo que él generó.
const RESPUESTA_CORRECTIVA =
  'Permítame precisarlo bien: lo que hacemos es distribuir productos de consumo diario ' +
  '—café, bebidas y suplementos— apoyados en tecnología, y usted construye una organización ' +
  'de personas que los consume mes a mes.\n\n¿Quiere que le cuente cómo se vería eso en su caso?';

// ─── Supabase client con service role (garantiza insert sin RLS) ──────────────
let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!  // service role evita RLS en inserts
    );
  }
  return supabaseClient;
}

// ─── GET: Handshake de verificación de Meta ───────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode      = searchParams.get('hub.mode');
  const token     = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ [WA Webhook] Handshake Meta verificado');
    return new Response(challenge, { status: 200 });
  }

  console.warn('⚠️ [WA Webhook] Handshake fallido — token incorrecto');
  return new Response('Forbidden', { status: 403 });
}

// ─── POST: Mensajes inbound de Meta ───────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Meta envía actualizaciones de estado (entregado, leído) — ignorarlas
    const messages = body?.entry?.[0]?.changes?.[0]?.value?.messages;
    if (!messages || messages.length === 0) {
      return new Response('OK', { status: 200 });
    }

    const message     = messages[0];
    const contact     = body.entry[0].changes[0].value.contacts?.[0];
    const phoneNumber = message.from as string;
    const messageText = message.text?.body as string | undefined;
    const contactName = (contact?.profile?.name as string | undefined) || 'Constructor';

    // ─── Detectar CTWA (Click-To-WhatsApp Ads) ────────────────────────────────
    // Meta incluye `referral` cuando el mensaje viene de un anuncio
    const referral = message.referral as {
      source_url?: string;
      source_type?: string;   // "ad" | "post" | "unknown"
      source_id?: string;     // Ad ID
      headline?: string;      // Texto del anuncio
      body?: string;
      ctwa_clid?: string;     // Click ID para atribución
    } | undefined;

    const isCTWA    = !!referral?.source_type;
    const isMapaCTA = isCTWA && (
      referral?.headline?.toLowerCase().includes('mapa') ||
      referral?.body?.toLowerCase().includes('mapa') ||
      messageText?.toLowerCase().includes('mapa')
    );

    if (isCTWA) {
      console.log(`📢 [WA Webhook] CTWA detectado — ad: ${referral?.source_id}, headline: "${referral?.headline}"`);
    }

    // Solo procesar mensajes de texto
    if (!messageText) {
      return new Response('OK', { status: 200 });
    }

    console.log(`📥 [WA Webhook] ${contactName} (${phoneNumber}): "${messageText}" ${isCTWA ? '[CTWA]' : ''}`);

    // ─── 1. Registrar prospect en Supabase ────────────────────────────────────
    const waFingerprint = `wa_${phoneNumber}`;
    const supabase = getSupabase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingProspect } = await (supabase as any)
      .from('prospects')
      .select('id, source, constructor_id')
      .eq('fingerprint_id', waFingerprint)
      .maybeSingle();

    // ─── Atribución al socio ──────────────────────────────────────────────────
    // El enlace que comparte el socio lleva su código en el texto pre-llenado
    // (ej. "Hola, vengo del enlace de luis-cabrejo"). Sin esto el prospecto queda
    // sin dueño: no aparece en el Radar de nadie, no dispara push, y la
    // pre-afiliación no sabe a quién avisar.
    const patrocinador = await resolverPatrocinador(supabase, messageText);

    if (!existingProspect) {
      // Primer mensaje — crear prospect con atribución completa
      const source = isCTWA ? 'whatsapp_ctwa' : 'whatsapp_inbound';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase as any)
        .from('prospects')
        .insert({
          fingerprint_id: waFingerprint,
          stage: 'awareness',
          source,
          ...(patrocinador && { constructor_id: patrocinador.userId }),
          device_info: {
            channel: 'whatsapp',
            phone: phoneNumber,
            name: contactName,
            ...(patrocinador && {
              invited_by:          patrocinador.constructorId,
              patrocinador_nombre: patrocinador.nombre,
            }),
            ...(isCTWA && {
              ctwa_clid:      referral?.ctwa_clid,
              ad_id:          referral?.source_id,
              ad_headline:    referral?.headline,
              ad_source_type: referral?.source_type,
            }),
          },
        });

      if (insertError) {
        console.error('⚠️ [WA Webhook] Error insertando prospect:', insertError.message);
      } else {
        console.log(`✅ [WA Webhook] Prospect registrado: ${waFingerprint} (${source})`);
      }
    } else {
      // Prospect ya existe. Dos actualizaciones posibles, ninguna destructiva:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const patch: Record<string, any> = {};

      if (isCTWA && existingProspect.source !== 'whatsapp_ctwa') {
        patch.source = 'whatsapp_ctwa';
      }
      // Si llegó sin dueño y ahora escribe con el código de un socio, se atribuye.
      // NUNCA se reasigna un prospecto que ya tiene patrocinador.
      if (patrocinador && !existingProspect.constructor_id) {
        patch.constructor_id = patrocinador.userId;
        console.log(`🔗 [WA Webhook] Prospect existente atribuido a ${patrocinador.constructorId}`);
      }

      if (Object.keys(patch).length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('prospects')
          .update(patch)
          .eq('fingerprint_id', waFingerprint);
      }
    }

    // ─── 2. Reconstruir historial + llamar al motor Queswa ────────────────────
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://creatuactivo.com';

    // Reconstruir el hilo desde nexus_conversations. Sin esto el motor recibe solo
    // el mensaje actual → cree que SIEMPRE es el primer turno (re-saluda en cada
    // respuesta) y Queswa pierde la memoria de la conversación. Cargamos los
    // últimos turnos y los aplanamos en orden cronológico.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: prevTurns } = await (supabase as any)
      .from('nexus_conversations')
      .select('messages, created_at')
      .eq('fingerprint_id', waFingerprint)
      .order('created_at', { ascending: false })
      .limit(12);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const historial: { role: string; content: string }[] = [];
    let turnosSaneados = 0;
    for (const t of ((prevTurns || []) as any[]).reverse()) {
      if (!Array.isArray(t.messages)) continue;
      for (const m of t.messages) {
        if (!m?.role || !m?.content) continue;
        const rol = m.role === 'user' ? 'user' : 'assistant';

        // El motor guarda la respuesta que GENERÓ, no la que se envió. Si el
        // guardarraíl de salida la bloqueó, el prospecto leyó la corrección
        // mientras el modelo recordaba su propia invención — y el "sí" del turno
        // siguiente quedaba aceptando una promesa que nunca existió. Saneamos al
        // leer: la memoria del modelo tiene que ser lo que la persona vio.
        // A prueba de carreras (no depende de cuándo el motor escribió la fila) y
        // retroactivo (limpia también los turnos envenenados que ya están en BD).
        if (rol === 'assistant' && detectarModeloInventado(m.content)) {
          historial.push({ role: 'assistant', content: RESPUESTA_CORRECTIVA });
          turnosSaneados++;
          continue;
        }

        historial.push({ role: rol, content: m.content });
      }
    }

    if (turnosSaneados > 0) {
      console.warn(`🧹 [WA Webhook] ${turnosSaneados} turno(s) bloqueado(s) saneado(s) en el historial de ${waFingerprint}`);
    }

    // pageContext le dice al motor el origen del mensaje (CTWA vs orgánico)
    const pageContext = isCTWA
      ? `whatsapp_ctwa${isMapaCTA ? '_mapa_de_salida' : ''}`
      : 'whatsapp_inbound';

    const nexusResponse = await fetch(`${baseUrl}/api/nexus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': 'whatsapp',
      },
      body: JSON.stringify({
        messages:    [...historial, { role: 'user', content: messageText }],
        sessionId:   waFingerprint,
        fingerprint: waFingerprint,
        pageContext,
      }),
    });

    if (!nexusResponse.ok) {
      console.error(`❌ [WA Webhook] Motor Queswa retornó ${nexusResponse.status}`);
      await sendWhatsAppMessage(phoneNumber, 'Hubo un error procesando tu mensaje. Intenta de nuevo en un momento.');
      return new Response('OK', { status: 200 });
    }

    // ─── 3. Consumir stream text/plain ───────────────────────────────────────
    const reader  = nexusResponse.body?.getReader();
    const decoder = new TextDecoder();
    let queswaReply = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        queswaReply += decoder.decode(value, { stream: true });
      }
    }

    queswaReply = queswaReply.trim();
    console.log(`💬 [WA Webhook] Queswa responde (${pageContext}): "${queswaReply.slice(0, 80)}..."`);

    // ─── 3.5 Guardrail de salida ──────────────────────────────────────────────
    // Última barrera antes de Meta. Si el modelo propuso un modelo de negocio que
    // no es el nuestro (economía de creadores), NO se envía: en Colombia la Ley
    // 1480 hace vinculante toda condición ofrecida al consumidor, y el precedente
    // Air Canada (2024) confirma que la empresa responde por lo que invente su IA.
    const violacion = detectarModeloInventado(queswaReply);
    if (violacion) {
      console.error(`🚨 [WA Guardrail] BLOQUEADO — término "${violacion}" en la respuesta a ${phoneNumber}. Texto: "${queswaReply.slice(0, 300)}"`);
      await sendWhatsAppMessage(phoneNumber, RESPUESTA_CORRECTIVA);
      await corregirTurnoEnvenenado(supabase, waFingerprint, queswaReply);
      return new Response('OK', { status: 200 });
    }

    // ─── 4. Enviar respuesta al héroe via Meta API ────────────────────────────
    if (queswaReply) {
      await sendWhatsAppMessage(phoneNumber, queswaReply);
    }

    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('❌ [WA Webhook] Error inesperado:', error);
    return new Response('OK', { status: 200 });
  }
}

// ─── Utilidad: enviar mensaje de texto via WhatsApp Cloud API ─────────────────
// La llamada a Meta vive en `wa-channel.ts` (capa de canal única); aquí solo se
// respeta el contrato "no romper el webhook si el envío falla".
async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  await sendText(to, text);
}

// ─── Atribución: ¿de qué socio viene este prospecto? ──────────────────────────

interface Patrocinador {
  userId: string          // private_users.id (UUID) → va a prospects.constructor_id
  constructorId: string   // "luis-cabrejo-1288"
  nombre: string
  whatsapp?: string       // para avisarle de la pre-afiliación
}

/**
 * Busca el código del socio dentro del primer mensaje del prospecto.
 *
 * El enlace que comparte el socio lleva el código en el texto pre-llenado, así
 * que llega escrito por el propio WhatsApp del prospecto:
 *   wa.me/573215193909?text=Hola,%20vengo%20del%20enlace%20de%20luis-cabrejo
 *
 * Acepta las dos formas que existen en el ecosistema: el slug corto
 * (`luis-cabrejo`, tabla `constructor_slugs`) y el constructor_id completo
 * (`luis-cabrejo-1288`, en `private_users`).
 *
 * Devuelve null si el mensaje no trae código — ese prospecto queda sin dueño y
 * lo trabaja el equipo.
 */
/**
 * Guardrail de salida: detecta si la respuesta propone un modelo de negocio que
 * NO es el nuestro (economía de creadores). Devuelve el término detectado o null.
 *
 * Calibrado para evitar falsos positivos: "en el curso de", "transcurso" y la
 * formación propia (Academia) NO deben disparar el bloqueo.
 */
function detectarModeloInventado(texto: string): string | null {
  if (!texto) return null;
  const t = texto.toLowerCase();

  // Términos inequívocos — si aparecen, es un modelo que no existe aquí
  const inequivocos = [
    'infoproducto', 'info-producto', 'e-book', 'ebook', 'membresía', 'membresia',
    'dropshipping', 'producto digital', 'productos digitales', 'curso online',
    'cursos online', 'consultoría online', 'consultoria online', 'monetizar su conocimiento',
    'monetizar tu conocimiento', 'vender su experiencia', 'crear contenido',
    'servicios escalados', 'asesorías online', 'asesorias online',
    'servicio digital', 'servicios digitales', 'audiencia',
  ];
  for (const term of inequivocos) {
    if (t.includes(term)) return term;
  }

  // "curso(s)" solo cuenta si se PROPONE (vender/crear/ofrecer), no en usos legítimos
  // como "en el curso de la conversación" o la formación interna.
  if (/\b(vender|venda|crear|cree|ofrecer|ofrezca|dictar|dicte|grabar)\b[^.]{0,40}\bcursos?\b/.test(t)) {
    return 'proponer cursos';
  }
  if (/\bcursos?\b[^.]{0,40}\b(que otros compren|de pago|para vender)\b/.test(t)) {
    return 'cursos para vender';
  }

  return null;
}

/**
 * Deja el registro de la conversación igual a lo que el prospecto realmente vio.
 *
 * El motor persiste su respuesta en `nexus_conversations` desde `onFinal`, o sea
 * DESPUÉS de que el webhook terminó de leer el stream. Cuando el guardarraíl
 * bloquea, esa fila conserva un texto que nunca se envió: el socio lo leería en el
 * Radar como parte de la conversación, y el expediente de handoff se armaría sobre
 * un diálogo que no ocurrió.
 *
 * Es best-effort por la carrera con `onFinal` — de ahí el sondeo corto. La garantía
 * de que el modelo no se envenene NO depende de esta función, sino del saneamiento
 * al reconstruir el historial. Aquí sólo se limpia lo que ven los humanos.
 *
 * El texto bloqueado se conserva en `guardrail_bloqueo` para revisar transcripciones
 * (no se lee al reconstruir el historial, así que no puede re-envenenar).
 */
async function corregirTurnoEnvenenado(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  fingerprint: string,
  textoBloqueado: string,
): Promise<void> {
  const objetivo = textoBloqueado.trim();

  for (let intento = 1; intento <= 6; intento++) {
    await new Promise((r) => setTimeout(r, 400));

    try {
      const { data: filas } = await supabase
        .from('nexus_conversations')
        .select('id, messages')
        .eq('fingerprint_id', fingerprint)
        .order('created_at', { ascending: false })
        .limit(3);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const fila of ((filas || []) as any[])) {
        if (!Array.isArray(fila.messages)) continue;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const idx = fila.messages.findIndex((m: any) =>
          m?.role === 'assistant' && typeof m.content === 'string' && m.content.trim() === objetivo,
        );
        if (idx === -1) continue;

        const messages = [...fila.messages];
        messages[idx] = { ...messages[idx], content: RESPUESTA_CORRECTIVA, guardrail_bloqueo: objetivo };

        await supabase.from('nexus_conversations').update({ messages }).eq('id', fila.id);
        console.log(`🧽 [WA Guardrail] Turno corregido en BD (intento ${intento}) — fila ${fila.id}`);
        return;
      }
    } catch (err) {
      // Una consulta fallida no puede tumbar el webhook: el historial ya se sanea al leer
      console.error('⚠️ [WA Guardrail] Error corrigiendo el turno en BD:', err);
      return;
    }
  }

  console.warn(
    `⚠️ [WA Guardrail] No se pudo corregir el turno en BD de ${fingerprint} — el motor aún no lo había escrito. ` +
    'El modelo queda protegido igual (saneamiento al leer); sólo el registro humano queda con el texto bloqueado.',
  );
}

async function resolverPatrocinador(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  texto: string | undefined,
): Promise<Patrocinador | null> {
  if (!texto) return null;

  // Candidatos: dos o más palabras unidas por guion, con sufijo de 4 dígitos opcional
  const candidatos = texto.toLowerCase().match(/[a-záéíóúñ]+(?:-[a-záéíóúñ]+)+(?:-\d{4})?/g);
  if (!candidatos || candidatos.length === 0) return null;

  for (const candidato of candidatos.slice(0, 3)) {   // tope: no barrer un mensaje largo entero
    try {
      // 1) ¿Es un constructor_id completo? (luis-cabrejo-1288)
      const { data: porId } = await supabase
        .from('private_users')
        .select('id, name, constructor_id, whatsapp')
        .eq('constructor_id', candidato)
        .maybeSingle();

      if (porId) {
        console.log(`🔗 [WA Webhook] Patrocinador por constructor_id: ${candidato}`);
        return {
          userId: porId.id,
          constructorId: porId.constructor_id,
          nombre: porId.name,
          whatsapp: porId.whatsapp ?? undefined,
        };
      }

      // 2) ¿Es un slug personalizado? (luis-cabrejo → luis-cabrejo-1288)
      const { data: porSlug } = await supabase
        .from('constructor_slugs')
        .select('constructor_id')
        .eq('slug', candidato)
        .maybeSingle();

      if (porSlug?.constructor_id) {
        const { data: user } = await supabase
          .from('private_users')
          .select('id, name, constructor_id, whatsapp')
          .eq('constructor_id', porSlug.constructor_id)
          .maybeSingle();

        if (user) {
          console.log(`🔗 [WA Webhook] Patrocinador por slug: ${candidato} → ${user.constructor_id}`);
          return {
            userId: user.id,
            constructorId: user.constructor_id,
            nombre: user.name,
            whatsapp: user.whatsapp ?? undefined,
          };
        }
      }
    } catch (err) {
      // Una consulta fallida no puede tumbar el webhook: el prospecto entra sin dueño
      console.error(`⚠️ [WA Webhook] Error resolviendo "${candidato}":`, err);
    }
  }

  return null;
}
