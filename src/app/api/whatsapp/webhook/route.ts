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
import { sendText, sendReplyButtons, sendFlow } from '@/lib/wa-channel';
import { transcribirNotaDeVoz } from '@/lib/wa-audio';
import {
  construirApertura,
  APERTURA_OPCIONES,
  getRespuestaBoton,
} from '@/lib/wa-apertura';
import { gestionarCierre } from '@/lib/wa-radicacion';
import { aFormatoWhatsApp, partirParaWhatsApp } from '@/lib/wa-formato';
import {
  slugDesdeNombre,
  normalizarWhatsApp,
  mensajeDeBienvenida,
} from '@/lib/wa-onboarding';
import {
  detectarEmergencia,
  clasificarPreguntaSalud,
  detectarClaimSaludEnSalida,
  esRechazoSalud,
  RESPUESTA_EMERGENCIA,
  RECHAZO_SALUD_ESTANDAR,
  RECHAZO_SALUD_GRAVE,
  RECHAZO_SALUD_CORTO,
} from '@/lib/wa-guardarrail-salud';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Lo que el prospecto recibe cuando el guardarraíl bloquea una respuesta. Es
// también lo que queda en el historial y en la base: el modelo debe recordar lo
// que la persona leyó, no lo que él generó.
// Alineada con WHY_02/WHY_04 (7 ago 2026): el mecanismo es el producto que se
// mueve por el canal — sin contar personas y sin "mes a mes" pegado al ingreso
// (Gano liquida cada viernes; lo mensual es el consumo, no el pago).
const RESPUESTA_CORRECTIVA =
  'Permítame precisarlo bien: usted dirige un canal de distribución de productos premium ' +
  'de bienestar —café, bebidas y suplementos—, y de cada venta que se mueve por ese canal le queda ' +
  'un porcentaje, liquidado en su cuenta cada viernes.\n\n¿Quiere que le cuente cómo se vería en su caso?';

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
    const contactName = (contact?.profile?.name as string | undefined) || 'Constructor';

    // ─── Entrada: texto o nota de voz ─────────────────────────────────────────
    // En LATAM el audio es la forma natural de explicar algo con matices; antes
    // se leía solo `text.body` y una nota de voz caía en silencio absoluto.
    let messageText = message.text?.body as string | undefined;
    let opcionElegida: string | undefined;
    let vieneDelSimulador = false;
    const audioId = (message.audio?.id ?? message.voice?.id) as string | undefined;

    // Elección en un mensaje interactivo: Meta NO manda `text.body`. Sin esto, el
    // toque de la persona no produce absolutamente nada.
    if (!messageText) {
      const interactivo = message.interactive as {
        list_reply?: { id?: string; title?: string };
        button_reply?: { id?: string; title?: string };
        nfm_reply?: { response_json?: string };
      } | undefined;
      const elegido = interactivo?.list_reply ?? interactivo?.button_reply;
      if (elegido?.title) {
        messageText = elegido.title;
        opcionElegida = elegido.id;
        console.log(`👆 [WA Webhook] ${phoneNumber} eligió "${elegido.title}" (${elegido.id})`);
      }

      // Cierre de un Flow (el simulador): llega como nfm_reply con el payload del
      // `complete`. Se traduce a lenguaje natural para que el motor y el historial
      // lo entiendan como lo que es — la persona armó su propio escenario.
      if (!messageText && interactivo?.nfm_reply?.response_json) {
        try {
          const r = JSON.parse(interactivo.nfm_reply.response_json) as {
            paquete?: string; cantidad?: string; tipo?: string; tarifa?: string; clientes?: string;
          };
          if (r.tipo === 'renta' && r.tarifa && r.clientes) {
            messageText = `Acabo de usar el simulador de renta: tarifa ${r.tarifa}, con ${r.clientes} clientes en cada centro de negocio.`;
            vieneDelSimulador = true;
            console.log(`🧮 [WA Webhook] ${phoneNumber} completó el simulador de renta (${r.tarifa} × ${r.clientes})`);
          } else if (r.paquete && r.cantidad) {
            messageText = `Acabo de usar el simulador: paquete ${r.paquete}, con ${r.cantidad} paquetes comprados en cada generación.`;
            vieneDelSimulador = true;
            console.log(`🧮 [WA Webhook] ${phoneNumber} completó el simulador (${r.paquete} × ${r.cantidad})`);
          }
        } catch {
          console.warn('⚠️ [WA Webhook] nfm_reply ilegible — se ignora');
        }
      }
    }

    if (!messageText && audioId) {
      const transcrito = await transcribirNotaDeVoz(audioId);
      if (transcrito) {
        messageText = transcrito;
        console.log(`🎙 [WA Webhook] Nota de voz de ${phoneNumber} transcrita`);
      } else {
        // No dejar a la persona hablando sola: se le dice qué pasó y se sigue.
        await sendWhatsAppMessage(
          phoneNumber,
          'Perdón, no logré escuchar bien su nota de voz. ¿Me la escribe en un mensaje?',
        );
        return new Response('OK', { status: 200 });
      }
    }

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

    // Sin texto y sin audio (imagen, sticker, ubicación) — no hay nada que procesar
    if (!messageText) {
      return new Response('OK', { status: 200 });
    }

    console.log(`📥 [WA Webhook] ${contactName} (${phoneNumber}): "${messageText}" ${isCTWA ? '[CTWA]' : ''}`);

    // ─── Sobre la palabra "ACCESO" ────────────────────────────────────────────
    // El socio le dice al contacto "escríbame ACCESO". El trabajo real de esa
    // palabra es que la persona ABRA la conversación: eso abre la ventana de
    // servicio de 24 h y habilita responder en texto libre, sin plantilla.
    //
    // Ya NO dispara ninguna entrega especial. El acceso ES la conversación: el
    // saludo de Queswa entrega el valor y la charla sigue aquí. Antes se anexaba
    // un enlace al sitio, lo que sacaba a la persona del único canal donde
    // tenemos su teléfono y contradecía al propio system prompt, que posiciona a
    // Queswa como el destino. Ver docs/handoff/negocio/ESTRATEGIA_CANAL_WHATSAPP.md.

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
          // ⚠️ 'awareness' NO existe: `prospects_stage_check` solo acepta
          // 'expansion' y 'activar'. Con 'awareness' el INSERT fallaba con 23514
          // y, como abajo solo se registra el error sin abortar, el prospecto
          // recibía respuesta perfecta de Queswa y NUNCA quedaba en la base:
          // sin atribución, fuera del Radar del socio y sin aviso a nadie.
          // Silencioso desde que existe el webhook. Ver el commit que trae esta
          // línea antes de "simplificar" el valor.
          stage: 'expansion',
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
        // Deliberadamente NO se aborta: la persona ya escribió y merece respuesta.
        // Pero que el prospecto no quede registrado es una pérdida de negocio, no
        // una advertencia menor — de ahí el nivel de ruido. Un fallo aquí significa
        // que Queswa atiende impecable y el socio nunca se entera de que existió.
        console.error(
          `🚨 [WA Webhook] PROSPECTO PERDIDO — no se registró ${waFingerprint}: ` +
          `${insertError.message} (code ${insertError.code}). ` +
          `Queswa va a responder, pero este contacto NO queda atribuido a ningún socio.`,
        );
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

    // ─── 1.35 Comando de activación del Director ──────────────────────────────
    // Cuando alguien paga, el Director escribe al WABA desde su propio número:
    //   ACTIVAR Diego Giraldo 3001234567
    // y en segundos esa persona recibe su enlace en su chat, sin instalar nada.
    // Va ANTES del guardarraíl y del registro de prospecto a propósito: quien
    // manda el comando no es un prospecto y no debe pasar por esas capas.
    const admins = (process.env.WA_ADMIN_NUMBERS || '573203415438,573206805737')
      .split(',').map((n) => n.trim()).filter(Boolean);
    const mComando = /^\s*activar\s+(.+?)\s+(\d[\d\s-]{6,})\s*$/i.exec(messageText);

    if (mComando && admins.includes(phoneNumber)) {
      const nombre  = mComando[1].trim();
      const destino = normalizarWhatsApp(mComando[2]);
      const corto   = nombre.split(/\s+/)[0];
      const resultado = await activarCanal(supabase, nombre, destino);

      if (resultado.ok) {
        const enviado = await sendText(destino, mensajeDeBienvenida(corto, resultado.slug));
        await sendWhatsAppMessage(phoneNumber, enviado.ok
          ? `Listo. ${nombre} ya tiene su canal: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://creatuactivo.com'}/${resultado.slug}\n\nLe llegó el enlace a su WhatsApp.`
          // Fuera de ventana: Meta rechaza el texto libre. Se dice qué hacer, no que falló.
          : `El canal de ${nombre} quedó creado (/${resultado.slug}), pero WhatsApp no me deja escribirle todavía.\n\nPídale que le mande cualquier mensaje al ${process.env.WHATSAPP_DISPLAY_NUMBER || 'número de Queswa'} y repita el comando.`);
      } else {
        await sendWhatsAppMessage(phoneNumber, `No pude crear el canal de ${nombre}: ${resultado.error}`);
      }
      console.log(`🎫 [WA Admin] ACTIVAR "${nombre}" → ${destino} · ${resultado.ok ? resultado.slug : resultado.error}`);
      return new Response('OK', { status: 200 });
    }

    // ─── 1.4 Guardarraíl de salud — ENTRADA (Capa 0 + derivación) ─────────────
    // Va ANTES de la apertura a propósito: un primer contacto que escribe sobre
    // una condición de salud no puede recibir el saludo comercial con botones —
    // recibe la derivación. Ver HANDOFF_GUARDARRAIL_SALUD_AGO2026.md y los
    // detectores en src/lib/wa-guardarrail-salud.ts. Los botones de la apertura y
    // el cierre de radicación nunca matchean estos patrones, así que el resto del
    // flujo determinístico no se altera.
    const emergencia = detectarEmergencia(messageText);
    if (emergencia) {
      console.error(`🆘 [WA Guardrail Salud] EMERGENCIA detectada ("${emergencia}") — ${phoneNumber}. Derivado a línea 123, cero producto.`);
      await sendWhatsAppMessage(phoneNumber, RESPUESTA_EMERGENCIA);
      await persistirTurnoDictado(supabase, waFingerprint, messageText, RESPUESTA_EMERGENCIA);
      return new Response('OK', { status: 200 });
    }

    const saludEntrada = clasificarPreguntaSalud(messageText);
    if (saludEntrada) {
      // Reincidencia: si esta conversación ya recibió un rechazo de salud, se
      // endurece a la versión corta (la marca de "conversación contaminada" del
      // handoff, en su forma v1).
      const reincide = saludEntrada.nivel === 'comun'
        && await hayRechazoSaludPrevio(supabase, waFingerprint);
      const rechazo = saludEntrada.nivel === 'grave'
        ? RECHAZO_SALUD_GRAVE
        : (reincide ? RECHAZO_SALUD_CORTO : RECHAZO_SALUD_ESTANDAR);

      console.warn(`⛔ [WA Guardrail Salud] Entrada derivada (${saludEntrada.nivel}${reincide ? ', reincidencia' : ''}: "${saludEntrada.termino}") — ${phoneNumber}`);
      await sendWhatsAppMessage(phoneNumber, rechazo);
      await persistirTurnoDictado(supabase, waFingerprint, messageText, rechazo);
      return new Response('OK', { status: 200 });
    }

    // ─── 1.5 Apertura dictada (solo primer contacto) ──────────────────────────
    // El primer mensaje NO lo genera el modelo: es copy calibrado, nombra al socio
    // que refirió (dato que solo vive aquí) y va como lista interactiva, que el
    // motor no sabe emitir porque devuelve texto. Mismo patrón que
    // getMicroPromptApertura(): donde el nodo es determinístico, dicta el backend.
    //
    // Se persiste el turno para que el motor reconstruya bien el hilo; si no, el
    // segundo mensaje volvería a contar como el primero y Queswa re-saludaría.
    if (!existingProspect) {
      const apertura = construirApertura(patrocinador?.nombre, contactName);

      const enviado = await sendReplyButtons(phoneNumber, apertura, APERTURA_OPCIONES);

      // Si Meta rechaza el interactivo (formato, límites), no dejar a la persona
      // sin respuesta: cae a texto plano con las mismas opciones enumeradas.
      if (!enviado.ok) {
        console.warn('⚠️ [WA Webhook] Botones rechazados — fallback a texto plano');
        const opciones = APERTURA_OPCIONES.map((o) => `• ${o.title}`).join('\n');
        await sendWhatsAppMessage(phoneNumber, `${apertura}\n\n${opciones}`);
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('nexus_conversations').insert({
          fingerprint_id: waFingerprint,
          session_id: waFingerprint,
          messages: [
            { role: 'user',      content: messageText, timestamp: new Date().toISOString() },
            { role: 'assistant', content: apertura,    timestamp: new Date().toISOString() },
          ],
        });
      } catch (err) {
        console.error('⚠️ [WA Webhook] No se pudo persistir la apertura:', err);
      }

      console.log(`👋 [WA Webhook] Apertura entregada a ${phoneNumber}${patrocinador ? ` (socio: ${patrocinador.nombre})` : ' (sin socio)'}`);
      return new Response('OK', { status: 200 });
    }

    // ─── 1.6 Respuesta dictada a una opción de la apertura ────────────────────
    // Las opciones son nodos determinísticos: se sabe de antemano qué pregunta
    // hace la persona, así que el texto lo dicta el backend en vez de dejar que
    // el modelo lo redacte cada vez. Al improvisar sobre "de dónde sale el
    // dinero" escribió "cuando alguien en su organización compra su producto del
    // mes" — autoconsumo mensual, la marca más delatora del multinivel, y encima
    // falso porque Gano Excel liquida los viernes.
    const dictada = opcionElegida ? getRespuestaBoton(opcionElegida) : null;
    if (dictada) {
      await sendWhatsAppMessage(phoneNumber, dictada);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('nexus_conversations').insert({
          fingerprint_id: waFingerprint,
          session_id: waFingerprint,
          messages: [
            { role: 'user',      content: messageText, timestamp: new Date().toISOString() },
            { role: 'assistant', content: dictada,     timestamp: new Date().toISOString() },
          ],
        });
      } catch (err) {
        console.error('⚠️ [WA Webhook] No se pudo persistir la respuesta dictada:', err);
      }
      console.log(`📌 [WA Webhook] Respuesta dictada para "${opcionElegida}" → ${phoneNumber}`);
      return new Response('OK', { status: 200 });
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

        // Mismo saneamiento para claims de salud: si un turno viejo quedó en BD
        // con un claim bloqueado (o anterior al guardarraíl), el modelo debe
        // recordar el rechazo que la persona vio, no su propio claim — si no, el
        // turno siguiente elabora sobre la infracción. Los rechazos propios
        // (esRechazoSalud) nunca disparan detectarClaimSaludEnSalida, así que no
        // hay riesgo de re-sanear lo ya saneado.
        if (rol === 'assistant' && detectarClaimSaludEnSalida(m.content)) {
          historial.push({ role: 'assistant', content: RECHAZO_SALUD_ESTANDAR });
          turnosSaneados++;
          continue;
        }

        historial.push({ role: rol, content: m.content });
      }
    }

    if (turnosSaneados > 0) {
      console.warn(`🧹 [WA Webhook] ${turnosSaneados} turno(s) bloqueado(s) saneado(s) en el historial de ${waFingerprint}`);
    }

    // ─── 2.4 Reenviar el simulador cuando lo pidan ────────────────────────────
    // Un Flow completado queda sellado en WhatsApp: la tarjeta muestra el resumen
    // y no vuelve a abrir. Quien está sopesando el proyecto quiere volver a los
    // números — se le manda una tarjeta nueva, sin pasar por el motor.
    const flowSimuladorId = process.env.WHATSAPP_FLOW_SIMULADOR_ID;
    // `!vieneDelSimulador` es indispensable: el texto que sintetizamos al cerrar
    // el Flow contiene la palabra "simulador", así que sin este guard completar el
    // simulador lo reenviaba en vez de responder al escenario que la persona armó.
    if (flowSimuladorId && !vieneDelSimulador
        && /simula(dor|r|ci[oó]n)|volver a ver los n[uú]meros|abrir.*n[uú]meros/i.test(messageText)) {
      const reenvio = await sendFlow(
        phoneNumber,
        flowSimuladorId,
        'Aquí lo tiene de nuevo. Arme el escenario que quiera ver.',
        'Abrir el simulador',
        { screen: 'INICIO' },
      );
      if (reenvio.ok) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from('nexus_conversations').insert({
            fingerprint_id: waFingerprint,
            session_id: waFingerprint,
            messages: [
              { role: 'user',      content: messageText, timestamp: new Date().toISOString() },
              { role: 'assistant', content: 'Aquí lo tiene de nuevo. Arme el escenario que quiera ver. [Simulador reenviado]', timestamp: new Date().toISOString() },
            ],
          });
        } catch (err) {
          console.error('⚠️ [WA Webhook] No se pudo persistir el reenvío del simulador:', err);
        }
        console.log(`🧮 [WA Webhook] Simulador reenviado a ${phoneNumber}`);
        return new Response('OK', { status: 200 });
      }
      // Si el reenvío falla, el turno sigue al motor: mejor una respuesta en
      // texto que un silencio.
      console.warn(`⚠️ [WA Webhook] Reenvío del simulador falló: ${reenvio.error}`);
    }

    // ─── 2.5 Cierre: radicar la vinculación ───────────────────────────────────
    // Nodo determinístico, como la apertura. El motor no puede atenderlo: su
    // máquina de estados fue escrita para la web y remata ofreciendo dos enlaces
    // wa.me al número del WABA — a alguien que está escribiendo desde adentro de
    // esa misma conversación. Aquí se piden los cuatro datos que
    // /api/pre-afiliacion exige y se deja el registro hecho.
    const socio = patrocinador ?? await resolverSocioDelProspecto(supabase, existingProspect?.constructor_id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: yaRadicado } = await (supabase as any)
      .from('pending_activations')
      .select('id')
      .eq('fingerprint_id', waFingerprint)
      .maybeSingle();

    const cierre = await gestionarCierre({
      mensajeActual:  messageText,
      historial,
      whatsapp:       phoneNumber,
      fingerprintId:  waFingerprint,
      socio:          socio?.nombre?.split(/\s+/).slice(0, 2).join(' '),
      constructorId:  socio?.constructorId,
      yaRadicadoEnBD: !!yaRadicado,
    });

    if (cierre) {
      await sendWhatsAppMessage(phoneNumber, cierre.texto);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('nexus_conversations').insert({
          fingerprint_id: waFingerprint,
          session_id: waFingerprint,
          messages: [
            { role: 'user',      content: messageText,  timestamp: new Date().toISOString() },
            { role: 'assistant', content: cierre.texto, timestamp: new Date().toISOString() },
          ],
        });
      } catch (err) {
        console.error('⚠️ [WA Webhook] No se pudo persistir el turno de cierre:', err);
      }
      console.log(`🎯 [WA Webhook] Cierre atendido para ${phoneNumber} (radicado: ${cierre.radicado})`);
      return new Response('OK', { status: 200 });
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

    // Guardarraíl de salud — SALIDA. Atrapa lo que la capa de entrada no vio
    // (formulación creativa, fragmento del corpus con ciencia, composición del
    // modelo). El borrador se DESCARTA y se reemplaza por el rechazo — nunca se
    // corrige ni se reintenta la generación (reintentar entrena al sistema a
    // bordear el límite). Res. 3096/2007 art. 5.3: "sugieran o impliquen".
    const claimSalud = detectarClaimSaludEnSalida(queswaReply);
    if (claimSalud) {
      console.error(`🚨 [WA Guardrail Salud] BLOQUEADO — claim "${claimSalud}" en la respuesta a ${phoneNumber}. Texto: "${queswaReply.slice(0, 300)}"`);
      await sendWhatsAppMessage(phoneNumber, RECHAZO_SALUD_ESTANDAR);
      await corregirTurnoEnvenenado(supabase, waFingerprint, queswaReply, RECHAZO_SALUD_ESTANDAR);
      return new Response('OK', { status: 200 });
    }

    // ─── 4. Enviar respuesta al héroe via Meta API ────────────────────────────
    if (queswaReply) {
      await sendWhatsAppMessage(phoneNumber, queswaReply);

      // Tras el ejemplo de cifras dictado, se ofrece el simulador (WhatsApp
      // Flow): la persona arma su propio escenario moviendo paquete y cantidad.
      // Una cifra que uno mismo produjo convence distinto a una que le entregan —
      // y el "wow" de la herramienta es parte del argumento: está viendo lo que
      // va a tener. El texto va primero porque el texto sí se reenvía; el Flow
      // vive solo en esta conversación.
      // Si la env no está (Flow aún no publicado) no pasa nada: el ejemplo de
      // texto se basta solo.
      // El Flow es un extra, nunca un bloqueo: la conversación ya tiene el
      // ejemplo completo en texto. Cada ejemplo dictado abre el simulador en SU
      // pantalla — el de paquetes en el menú GEN5, el de renta en las tarifas.
      const flowSimulador = process.env.WHATSAPP_FLOW_SIMULADOR_ID;

      // ⚠️ El silencio deja de ser silencioso (9 ago 2026). Si la env falta, el
      // `if (flowSimulador && …)` no hacía NADA y no decía nada: el ejemplo de
      // cifras salía sin su botón y por los logs no había forma de saberlo. Pasó
      // en la prueba del Director — el Flow estaba PUBLISHED en Meta y con las
      // pantallas correctas, así que la única explicación era la env sin definir
      // en Vercel. Un extra opcional puede fallar callado; no puede fallar
      // invisible.
      const dictoEjemplo = queswaReply.includes('Le pongo un ejemplo con números redondos')
        || queswaReply.includes('Le pongo el ejemplo con un supuesto modesto');
      if (!flowSimulador && dictoEjemplo) {
        console.warn('⚠️ [WA Webhook] Se dictó un ejemplo de cifras pero WHATSAPP_FLOW_SIMULADOR_ID no está definida — el simulador NO se ofreció. Definirla en Vercel.');
      }

      if (flowSimulador && queswaReply.includes('Le pongo un ejemplo con números redondos')) {
        const enviado = await sendFlow(
          phoneNumber,
          flowSimulador,
          'Y si quiere, arme usted mismo su escenario: elija el paquete y cuántos se compran por generación, y vea el resultado al instante. Se cuenta por paquetes comprados, no por personas.',
          'Abrir el simulador',
          { screen: 'GEN_MENU' },
        );
        if (enviado.ok) console.log('🧮 [WA Webhook] Simulador GEN5 ofrecido');
        else console.warn(`⚠️ [WA Webhook] Flow simulador GEN5 no se pudo enviar: ${enviado.error}`);
      }
      // ── El simulador viaja pegado a la OFERTA de números, no solo al ejemplo ──
      // (Director, 14 ago 2026). Nadie escribe la frase exacta que dispara un
      // pin: si la puerta al simulador exige tipeo, no existe. Cuando Queswa
      // cierra ofreciendo números, el Flow sale de una vez — abriendo en las
      // tarifas de renta, porque la prioridad la tiene el ingreso recurrente.
      // Los ejemplos dictados conservan su propio envío (con su pantalla); este
      // solo cubre el caso en que la oferta quedó en texto.
      const _ofreceNumeros = /(le muestro|quiere ver|le enseño)[^?]{0,40}n[uú]meros|c[oó]mo se ve en n[uú]meros|cu[aá]nto se mueve con|quiere ver c[oó]mo se gana/i.test(queswaReply);
      if (flowSimulador && _ofreceNumeros && !dictoEjemplo) {
        const enviado = await sendFlow(
          phoneNumber,
          flowSimulador,
          'Y si prefiere verlo con sus propios números: elija la tarifa y la cantidad de clientes, y el resultado sale al instante.',
          'Abrir el simulador',
          { screen: 'RENTA_MENU' },
        );
        if (enviado.ok) console.log('🧮 [WA Webhook] Simulador ofrecido junto a la oferta de números');
        else console.warn(`⚠️ [WA Webhook] Flow junto a la oferta no se pudo enviar: ${enviado.error}`);
      }

      // GEN5 explicado con cifras y sin ejemplo dictado → el simulador va en su
      // pantalla (decisión del Director, 14 ago 2026: al explicar el GEN5 también
      // se ofrece la herramienta, no solo en el camino de renta).
      const _explicaGen5 = /ge?n[\s.-]?5/i.test(queswaReply) && /\$\s?\d/.test(queswaReply);
      const _explicaBinario = /b[ia]+n[a-z]?r[a-z]?i?o|ingreso recurrente/i.test(queswaReply) && /\$\s?\d/.test(queswaReply);
      if (flowSimulador && _explicaBinario && !_explicaGen5 && !dictoEjemplo && !_ofreceNumeros) {
        const enviado = await sendFlow(
          phoneNumber,
          flowSimulador,
          'Y si quiere moverlo usted: elija la tarifa y la cantidad de clientes, y el resultado sale al instante.',
          'Abrir el simulador',
          { screen: 'RENTA_MENU' },
        );
        if (enviado.ok) console.log('🧮 [WA Webhook] Simulador ofrecido junto a la explicación del binario');
        else console.warn(`⚠️ [WA Webhook] Flow binario junto a la explicación no se pudo enviar: ${enviado.error}`);
      }
      if (flowSimulador && _explicaGen5 && !dictoEjemplo && !_ofreceNumeros) {
        const enviado = await sendFlow(
          phoneNumber,
          flowSimulador,
          'Y si quiere verlo con sus propios números: elija el paquete y cuántos se compran, y el resultado sale al instante. Se cuenta por paquetes comprados, no por personas.',
          'Abrir el simulador',
          { screen: 'GEN_MENU' },
        );
        if (enviado.ok) console.log('🧮 [WA Webhook] Simulador GEN5 ofrecido junto a la explicación');
        else console.warn(`⚠️ [WA Webhook] Flow GEN5 junto a la explicación no se pudo enviar: ${enviado.error}`);
      }

      if (flowSimulador && queswaReply.includes('Le pongo el ejemplo con un supuesto modesto')) {
        const enviado = await sendFlow(
          phoneNumber,
          flowSimulador,
          'Y si quiere, muévalo usted: elija la tarifa y vea cómo cambia la renta según los clientes de su red.',
          'Abrir el simulador',
          { screen: 'RENTA_MENU' },
        );
        if (enviado.ok) console.log('🧮 [WA Webhook] Simulador BINARIO/renta ofrecido');
        else console.warn(`⚠️ [WA Webhook] Flow simulador BINARIO no se pudo enviar: ${enviado.error}`);
      }
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
//
// Todo lo que sale pasa antes por `aFormatoWhatsApp()`: el motor y los arsenales
// están escritos en Markdown, y en el canal eso llega como tubos, guiones y
// asteriscos a la vista. Y lo que pase de una pantalla se parte en varios
// mensajes — WhatsApp esconde el resto detrás de "Leer más", justo donde va la
// pregunta que sostiene la conversación.
async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  const partes = partirParaWhatsApp(aFormatoWhatsApp(text));

  for (let i = 0; i < partes.length; i++) {
    await sendText(to, partes[i]);
    // Meta no garantiza el orden de entrega de envíos simultáneos; una pausa
    // corta evita que la segunda mitad aparezca antes que la primera.
    if (i < partes.length - 1) await new Promise((r) => setTimeout(r, 600));
  }

  if (partes.length > 1) {
    console.log(`✂️ [WA Webhook] Respuesta entregada en ${partes.length} mensajes`);
  }
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
 * Persiste un turno dictado por el webhook (guardarraíl de salud, emergencia).
 * Mismo patrón que la apertura y las respuestas de botón: sin esto el motor
 * reconstruye el hilo sin el rechazo y el turno siguiente pierde el contexto de
 * que la pregunta de salud ya fue derivada.
 */
async function persistirTurnoDictado(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  fingerprint: string,
  textoUsuario: string,
  textoAsistente: string,
): Promise<void> {
  try {
    await supabase.from('nexus_conversations').insert({
      fingerprint_id: fingerprint,
      session_id: fingerprint,
      messages: [
        { role: 'user',      content: textoUsuario,   timestamp: new Date().toISOString() },
        { role: 'assistant', content: textoAsistente, timestamp: new Date().toISOString() },
      ],
    });
  } catch (err) {
    console.error('⚠️ [WA Guardrail Salud] No se pudo persistir el turno dictado:', err);
  }
}

/**
 * ¿Esta conversación ya recibió un rechazo de salud? Define la reincidencia:
 * al segundo intento se responde con la versión corta en vez de repetir el
 * discurso completo. Best-effort — si la consulta falla, se asume que no.
 */
async function hayRechazoSaludPrevio(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  fingerprint: string,
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('nexus_conversations')
      .select('messages')
      .eq('fingerprint_id', fingerprint)
      .order('created_at', { ascending: false })
      .limit(12);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const fila of ((data || []) as any[])) {
      if (!Array.isArray(fila.messages)) continue;
      for (const m of fila.messages) {
        if (m?.role === 'assistant' && typeof m.content === 'string' && esRechazoSalud(m.content)) {
          return true;
        }
      }
    }
  } catch (err) {
    console.error('⚠️ [WA Guardrail Salud] Error consultando reincidencia:', err);
  }
  return false;
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
  reemplazo: string = RESPUESTA_CORRECTIVA,
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
        messages[idx] = { ...messages[idx], content: reemplazo, guardrail_bloqueo: objetivo };

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

/**
 * El socio de un prospecto que ya está en la base.
 *
 * `resolverPatrocinador()` solo lee el código del texto entrante, y ese código
 * viaja únicamente en el primer mensaje. Cuando la persona vuelve tres días
 * después a decir que quiere arrancar, el mensaje no trae nada — pero el
 * prospecto ya quedó atribuido. Sin esto, el cierre nombraría "su socio" y la
 * pre-afiliación se radicaría huérfana.
 */
async function resolverSocioDelProspecto(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  constructorUserId: string | null | undefined,
): Promise<Patrocinador | null> {
  if (!constructorUserId) return null;

  try {
    const { data } = await supabase
      .from('private_users')
      .select('id, name, constructor_id, whatsapp')
      .eq('id', constructorUserId)
      .maybeSingle();

    if (!data) return null;
    return {
      userId: data.id,
      constructorId: data.constructor_id,
      nombre: data.name,
      whatsapp: data.whatsapp ?? undefined,
    };
  } catch (err) {
    console.error('⚠️ [WA Webhook] Error resolviendo el socio del prospecto:', err);
    return null;
  }
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

/**
 * Crea el canal de un socio nuevo: slug único + registro en `constructor_slugs`.
 *
 * El slug sale del nombre y, si ya existe, se le suma un sufijo numérico — dos
 * "Juan Pérez" no pueden pelearse la misma URL. `constructor_id` se genera aquí
 * porque el enlace tiene que existir el mismo día del pago, y el perfil completo
 * (foto, frase) se llena después desde el Centro de Mando sin tocar esta fila.
 */
async function activarCanal(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  nombre: string,
  whatsapp: string,
): Promise<{ ok: true; slug: string } | { ok: false; error: string }> {
  if (!whatsapp || whatsapp.length < 10) return { ok: false, error: 'el número no parece completo' };

  try {
    // Si ese número ya tiene canal, se devuelve el suyo en vez de crear otro:
    // el comando repetido es lo normal cuando el primer envío cayó fuera de ventana.
    const { data: previo } = await supabase
      .from('constructor_slugs').select('slug').eq('whatsapp', whatsapp).maybeSingle();
    if (previo?.slug) return { ok: true, slug: previo.slug };

    const base = slugDesdeNombre(nombre);
    let slug = base;
    for (let i = 2; i <= 20; i++) {
      const { data: ocupado } = await supabase
        .from('constructor_slugs').select('slug').eq('slug', slug).maybeSingle();
      if (!ocupado) break;
      slug = `${base}${i}`;
    }

    const { error } = await supabase.from('constructor_slugs').insert({
      slug,
      display_name: nombre,
      whatsapp,
      constructor_id: crypto.randomUUID(),
      activado_en: new Date().toISOString(),
    });
    if (error) return { ok: false, error: error.message };

    return { ok: true, slug };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'error inesperado' };
  }
}
