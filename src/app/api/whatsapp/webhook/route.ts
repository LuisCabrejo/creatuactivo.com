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
import { waitUntil } from '@vercel/functions';
import {
  sendText, sendReplyButtons, sendFlow, sendTemplate, sendImage,
  marcarLeidoYEscribiendo, esBSUID,
} from '@/lib/wa-channel';
import { transcribirNotaDeVoz } from '@/lib/wa-audio';
import {
  construirApertura,
  APERTURA_OPCIONES,
  getRespuestaBoton,
} from '@/lib/wa-apertura';
import { gestionarCierre, RE_VOLICION } from '@/lib/wa-radicacion';
import { aFormatoWhatsApp, partirParaWhatsApp } from '@/lib/wa-formato';
import { respuestaRenta, respuestaGen5 } from '@/lib/wa-simulador';
import { pideImagen, detectarProducto, productoDelHilo, pieDeFoto, urlImagen, esSoloPedidoDeImagen, seguimientoFoto } from '@/lib/wa-productos';
import {
  slugDesdeNombre,
  normalizarWhatsApp,
  mensajeDeBienvenida,
  enlaceDeCanal,
  avisarSocioNuevoProspecto,
  identificarSocio,
  saludoDeSocio,
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
import { detectarPromesaDeIngreso } from '@/lib/wa-guardarrail-negocio';

export const runtime = 'nodejs';
// 90 s y no 30 (19 ago 2026). Con `waitUntil`, Meta ya recibió su 200 y este
// techo no lo espera nadie: solo acota cuánto puede tardar el trabajo de fondo
// antes de que Vercel lo corte. Los turnos medidos van de 3 a 16 s, así que 90
// es holgura de verdad — un turno lento deja de significar una persona que ve
// "escribiendo…" y no recibe nada. El proyecto corre en Fluid compute, donde el
// costo se cuenta por CPU activa: esperar al modelo no se cobra como cómputo.
export const maxDuration = 90;

// Lo que el prospecto recibe cuando el guardarraíl bloquea una respuesta. Es
// también lo que queda en el historial y en la base: el modelo debe recordar lo
// que la persona leyó, no lo que él generó.
// Alineada con WHY_02/WHY_04 (7 ago 2026): el mecanismo es el producto que se
// mueve por el canal — sin contar personas y sin "mes a mes" pegado al ingreso
// (Gano liquida cada viernes; lo mensual es el consumo, no el pago).
const RESPUESTA_CORRECTIVA =
  'Permítame precisarlo bien: usted es el dueño de un canal de distribución de productos premium ' +
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

// ─── Copy: acuse de lo que no podemos procesar ────────────────────────────────
// Un solo lugar para lo que la persona lee cuando manda algo que este canal no
// atiende. Reconoce lo que llegó, dice en una línea qué sí funciona, y cierra
// con una sola pregunta de una sola salida — nunca con un "no puedo".
const ACUSE_NO_PROCESABLE: Record<string, string> = {
  image:    'Recibí su imagen. Por aquí leo texto y notas de voz, así que no alcanzo a ver qué me está mostrando. ¿Me cuenta en un mensaje de qué se trata?',
  video:    'Recibí su video. Por aquí leo texto y notas de voz, así que no alcanzo a ver qué me está mostrando. ¿Me cuenta en un mensaje de qué se trata?',
  document: 'Recibí su archivo. Por aquí leo texto y notas de voz, así que no alcanzo a abrirlo. ¿Me cuenta en un mensaje qué necesita?',
  location: 'Recibí su ubicación. Para lo que sigue me basta con el nombre: ¿desde qué ciudad me escribe?',
  contacts: 'Recibí el contacto que me compartió. Cuénteme usted qué necesita y seguimos por aquí: ¿qué le gustaría saber primero?',
  default:  'Recibí su mensaje, pero me llegó en un formato que no alcanzo a leer. ¿Me lo escribe en texto o me manda una nota de voz?',
};

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

/**
 * ¿Este mensaje ya se procesó? Guarda contra el reenvío de Meta.
 *
 * La llave primaria de `wa_mensajes_procesados` hace todo el trabajo: el segundo
 * INSERT del mismo `wamid` falla con 23505 y ahí se corta. Es atómico, así que
 * dos entregas simultáneas no pueden colarse las dos.
 *
 * ⚠️ **Falla hacia procesar, nunca hacia el silencio.** Si la tabla no existe o
 * Supabase no responde, se devuelve `false` y el turno sigue: una respuesta
 * repetida es un bochorno, pero una persona que escribe y no recibe nada es una
 * venta perdida y la razón por la que existe todo esto.
 */
async function yaProcesado(wamid: string): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (getSupabase() as any)
      .from('wa_mensajes_procesados')
      .insert({ wamid });

    if (!error) return false;                 // insertó → es la primera entrega
    if (error.code === '23505') return true;  // llave duplicada → es un reenvío

    console.warn(`⚠️ [WA Webhook] Guarda de reenvío no disponible (${error.code}) — se procesa igual`);
    return false;

  } catch (err) {
    console.warn('⚠️ [WA Webhook] Guarda de reenvío falló — se procesa igual:', err);
    return false;
  }
}

/**
 * Puerta del canal. Su único trabajo es contestarle a Meta **de inmediato** y
 * mandar el mensaje a procesar por detrás.
 *
 * POR QUÉ: hasta ahora el webhook hacía todo el trabajo —transcribir el audio,
 * llamar al motor, pasar tres guardarraíles, enviar por la Graph API— y recién
 * entonces respondía. Meta esperaba todo eso, y si el turno se pasaba del techo
 * de la función, Vercel la mataba: la persona veía "escribiendo…" y no llegaba
 * nada, el turno no quedaba guardado, y Meta reintentaba la entrega — lo que en
 * el mejor de los casos producía una respuesta duplicada.
 *
 * Ahora Meta recibe su 200 en milisegundos y el trabajo sigue en
 * `procesarEntrante` bajo `waitUntil`, que mantiene viva la invocación.
 *
 * ⚠️ `waitUntil` **no regala tiempo**: la promesa muere con el mismo
 * `maxDuration` de la función. Lo que cambia es que el reloj ya no lo mira Meta.
 * Por eso el techo se subió a 90 s en la misma corrección.
 */
export async function POST(request: Request) {
  const ok = () => new Response('OK', { status: 200 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  try {
    body = await request.json();
  } catch {
    console.warn('⚠️ [WA Webhook] Cuerpo ilegible — se acusa 200 y se ignora');
    return ok();
  }

  const wamid = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.id as string | undefined;

  if (wamid && await yaProcesado(wamid)) {
    console.log(`♻️ [WA Webhook] ${wamid} ya se había procesado — se ignora el reenvío`);
    return ok();
  }

  // El `.catch` no es decorativo: una promesa rechazada dentro de `waitUntil` se
  // pierde sin dejar rastro, y este es el único lugar donde se puede ver.
  waitUntil(
    procesarEntrante(body).catch((err) => {
      console.error('❌ [WA Webhook] El procesamiento de fondo falló:', err);
    }),
  );

  return ok();
}

/**
 * Procesa un mensaje entrante. Corre EN SEGUNDO PLANO, después de que Meta ya
 * recibió su 200 — ver la nota de `POST`. No devuelve nada: lo que le importa a
 * Meta ya se respondió, y lo que le importa a la persona sale por la Graph API.
 *
 * Cada `return` de aquí abajo significa "este turno terminó", no "responda esto".
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function procesarEntrante(body: any): Promise<void> {
  try {

    const value    = body?.entry?.[0]?.changes?.[0]?.value;
    const messages = value?.messages;

    // ─── Avisos de estado: solo nos interesa el fracaso ───────────────────────
    // "sent", "delivered" y "read" se ignoran como siempre. Pero "failed" se
    // registra, porque es la ÚNICA señal de un fallo que la Graph API esconde:
    // fuera de la ventana de 24 h Meta acepta el envío con 200 y un ID, y lo
    // descarta después. Sin este log, un mensaje que la persona nunca recibió
    // se ve idéntico a uno entregado (así se perdió la sonda de formato del 18
    // ago: dos "✅ enviado" que jamás llegaron al teléfono).
    if (!messages || messages.length === 0) {
      for (const st of (value?.statuses ?? []) as { status?: string; recipient_id?: string; errors?: { code?: number; title?: string; message?: string }[] }[]) {
        if (st.status !== 'failed') continue;
        const e = st.errors?.[0];
        console.error(`📵 [WA Webhook] Envío FALLIDO a ${st.recipient_id} — #${e?.code} ${e?.title ?? e?.message ?? ''}`.trim());
        // Y queda en tabla: el log de Vercel se pierde y este es el único rastro
        // de un mensaje que la persona nunca recibió.
        try {
          await (getSupabase() as any).from('wa_envios_fallidos').insert({
            destino: st.recipient_id ?? null,
            codigo: e?.code ?? null,
            titulo: e?.title ?? null,
            detalle: e?.message ?? null,
          });
        } catch { /* nunca tumbar el webhook por el registro de un fallo */ }
      }
      return;
    }

    const message     = messages[0];
    const contact     = value?.contacts?.[0];

    // ─── Quién escribe: teléfono o BSUID ──────────────────────────────────────
    // Desde 2026 Meta permite ocultar el teléfono detrás de un nombre de
    // usuario, y entonces manda un **BSUID** (`CO.1497020585516131`) en vez del
    // número. `contacts[0].user_id` trae SIEMPRE el BSUID **con su prefijo de
    // país**, con nombre de usuario o sin él.
    //
    // ⚠️ La trampa (21 ago 2026): del mismo remitente, Meta manda unas veces
    // `CO.1497020585516131` y otras el mismo identificador PELADO,
    // `1497020585516131`. Solo la forma prefijada es entregable — la pelada
    // devuelve **#131026 Message undeliverable**, y como la Graph API la acepta
    // con 200 y un identificador de mensaje, el fallo llega después y en
    // silencio. Además cada forma abría su propio prospecto, así que la misma
    // persona perdía su historia según qué campo hubiera llenado Meta.
    //
    // Por eso el orden no es "el primero que exista": si el valor crudo es el
    // BSUID sin prefijo, mandan `user_id`. Un teléfono de verdad sí gana, que
    // es lo que sirve para detectar país y reconocer al socio.
    const _userId = contact?.user_id as string | undefined;
    const _crudo  = (message.from || contact?.wa_id || message.user_id) as string | undefined;
    const _esPeladoDelBSUID = !!(_userId && _crudo && _userId.endsWith(`.${_crudo}`));
    const _esTelefono = !!_crudo && /^\+?\d{7,15}$/.test(_crudo);

    const phoneNumber = (_esTelefono && !_esPeladoDelBSUID)
      ? _crudo
      : (_userId || _crudo);
    const contactName = (contact?.profile?.name as string | undefined) || 'Constructor';

    if (!phoneNumber) {
      // Sin identidad no hay a quién responderle, y crear un prospecto
      // `wa_undefined` solo ensucia la base y esconde el problema.
      console.error(
        `🚨 [WA Webhook] MENSAJE SIN IDENTIDAD — ni from, ni wa_id, ni user_id. `
        + `De "${contactName}", wamid ${message.id}. Payload: ${JSON.stringify(value?.contacts ?? {}).slice(0, 200)}`,
      );
      return;
    }
    if (/^[A-Z]{2}\./.test(phoneNumber)) {
      console.log(`🪪 [WA Webhook] Escribe con nombre de usuario (BSUID ${phoneNumber}) — sin teléfono visible`);
    }

    // ─── Acuse inmediato: visto azul + "escribiendo…" ─────────────────────────
    // Va aquí arriba, antes de transcribir el audio y antes de llamar al motor,
    // porque es justo ese rato el que hoy transcurre sin ninguna señal en la
    // pantalla de la persona. Desde este punto TODOS los caminos responden algo
    // —incluidos los tipos que no procesamos—, así que mostrar el indicador no
    // promete una respuesta que no vaya a llegar (Meta pide explícitamente no
    // hacerlo). Las dos únicas salidas mudas quedan más abajo, y son gestos
    // (reacción, sticker) que llegan después de este punto.
    const wamid = message.id as string | undefined;
    const t0 = Date.now();
    _turnoEmpezoEn = t0;
    if (wamid) await marcarLeidoYEscribiendo(wamid);

    // ─── Entrada: texto o nota de voz ─────────────────────────────────────────
    // En LATAM el audio es la forma natural de explicar algo con matices; antes
    // se leía solo `text.body` y una nota de voz caía en silencio absoluto.
    let messageText = message.text?.body as string | undefined;
    let opcionElegida: string | undefined;
    let vieneDelSimulador = false;
    // El escenario que la persona armó en el Flow. El TEXTO se construye más
    // abajo (bloque 2.3), porque el cierre depende del historial y a esta altura
    // el historial no existe todavía.
    let escenarioSimulador: { tipo: 'renta'; tarifa: string; clientes: string } | { paquete: string; cantidad: string } | null = null;
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
            escenarioSimulador = { tipo: 'renta', tarifa: r.tarifa, clientes: r.clientes };
            console.log(`🧮 [WA Webhook] ${phoneNumber} completó el simulador de renta (${r.tarifa} × ${r.clientes})`);
          } else if (r.paquete && r.cantidad) {
            messageText = `Acabo de usar el simulador: paquete ${r.paquete}, con ${r.cantidad} paquetes comprados en cada generación.`;
            vieneDelSimulador = true;
            escenarioSimulador = { paquete: r.paquete, cantidad: r.cantidad };
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
        return;
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

    // ─── Sin texto y sin audio: se acusa, no se ignora ────────────────────────
    // Hasta ahora esto devolvía 200 en silencio absoluto. Alguien mandaba la foto
    // del comprobante de su pago, o la foto del producto que le recomendaron, y
    // no recibía absolutamente nada — el peor mensaje posible en el canal donde
    // todo el mundo responde al instante.
    //
    // Las reacciones y los stickers SÍ siguen mudos, y a propósito: son gestos de
    // asentimiento, no consultas. Contestarle "no puedo ver imágenes" a un pulgar
    // arriba convierte un cierre cordial en un malentendido.
    if (!messageText) {
      const tipo = message.type as string | undefined;

      if (tipo === 'reaction' || tipo === 'sticker') {
        console.log(`👍 [WA Webhook] ${phoneNumber} envió un gesto (${tipo}) — sin respuesta, a propósito`);
        return;
      }

      const acuse = ACUSE_NO_PROCESABLE[tipo ?? ''] ?? ACUSE_NO_PROCESABLE.default;
      await sendWhatsAppMessage(phoneNumber, acuse, { wamid, citar: true });
      console.log(`📎 [WA Webhook] ${phoneNumber} envió "${tipo}" — acusado sin procesar`);
      return;
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
    // Formas aceptadas (el código de Gano es opcional y puede llegar después):
    //   ACTIVAR Julieth Cabrejo 3001234567
    //   ACTIVAR Julieth Cabrejo 300 123 4567 7118234
    const mComando = /^\s*activar\s+(.+)$/i.exec(messageText);
    const partes   = mComando ? mComando[1].trim().split(/\s+/) : [];
    // Un token cuenta como "de la cola" si es puramente numérico o si es un
    // código alfanumérico de Gano (GE7516362). Exigir 4 caracteres y al menos un
    // dígito evita que se trague una palabra del nombre.
    const esNum    = (t: string) =>
      /^[\d+\s-]+$/.test(t) || (/^[A-Za-z0-9]{4,}$/.test(t) && /\d/.test(t));

    // Se leen los tokens numéricos del final: el último puede ser el código de
    // Gano y el anterior el teléfono. Separarlos por posición —y no por longitud—
    // evita fallar con números escritos con espacios o guiones.
    let telefono = '', codigoGano = '', nombre = '';
    if (partes.length >= 2) {
      const cola: string[] = [];
      while (partes.length && esNum(partes[partes.length - 1]) && cola.length < 5) {
        cola.unshift(partes.pop() as string);
      }
      nombre = partes.join(' ').trim();

      // Todo lo numérico del final se junta en una sola cadena de dígitos y se
      // parte por LONGITUD, no por token: así da igual que el teléfono venga
      // como "3001234567", "300 123 4567" o "300-123-4567", y el código de Gano
      // —cuando lo hay— queda con lo que sobra.
      const d = cola.join('').replace(/\D/g, '');
      const largoTel = d.startsWith('57') ? 12 : 10;
      telefono   = normalizarWhatsApp(d.slice(0, largoTel));
      codigoGano = d.slice(largoTel);
    }

    // Si el comando llega sin teléfono, se busca a la persona por nombre entre
    // las radicaciones recientes: quien ya conversó con Queswa dejó ahí su
    // número, y volver a teclearlo es trabajo que la máquina puede hacer sola.
    if (mComando && nombre && telefono.length < 12 && admins.includes(phoneNumber)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: radicados } = await (supabase as any)
        .from('pending_activations')
        .select('nombre_completo, whatsapp, gano_excel_id')
        .ilike('nombre_completo', `%${nombre.split(/\s+/)[0]}%`)
        .order('created_at', { ascending: false })
        .limit(1);
      const hit = (radicados || [])[0];
      if (hit?.whatsapp) {
        telefono   = normalizarWhatsApp(hit.whatsapp);
        codigoGano = codigoGano || hit.gano_excel_id || '';
        nombre     = hit.nombre_completo || nombre;
        console.log(`🔎 [WA Admin] "${nombre}" resuelto desde pending_activations`);
      }
    }

    if (mComando && nombre && telefono.length >= 12 && admins.includes(phoneNumber)) {
      const destino = telefono;
      const corto   = nombre.split(/\s+/)[0];
      const resultado = await activarCanal(supabase, nombre, destino, codigoGano);

      if (resultado.ok) {
        const bienvenida = mensajeDeBienvenida(corto, resultado.slug);

        // Dos caminos, en este orden. Dentro de la ventana el texto libre es
        // mejor: llega completo, con la instrucción de los cinco contactos y el
        // aviso de lo que va a pasar después. Fuera de ventana Meta solo acepta
        // plantilla, así que entra `enlace_canal_listo` (aprobada el 17 ago), que
        // entrega el enlace y trae un botón: al tocarlo la persona ABRE su
        // ventana y a partir de ahí Queswa ya puede escribirle libremente.
        let enviado = await sendText(destino, bienvenida);
        if (!enviado.ok) {
          const conPlantilla = await sendTemplate(destino, 'enlace_canal_listo', 'es', [
            corto,
            enlaceDeCanal(resultado.slug),
          ]);
          if (conPlantilla.ok) enviado = conPlantilla;
          console.log(`📨 [WA Admin] Fuera de ventana → plantilla ${conPlantilla.ok ? 'entregada' : 'falló: ' + conPlantilla.error}`);
        }

        // ⚠️ El mensaje listo para reenviar va SIEMPRE, haya llegado o no.
        // Es lo que vuelve irrelevante la ventana de 24 h: el Director ya está
        // conversando con esa persona en su propio chat, así que pegar el texto
        // le cuesta un toque y no depende de ninguna política de Meta. Va en un
        // mensaje aparte, sin nada alrededor, para que se pueda copiar de un
        // solo toque sostenido.
        await sendWhatsAppMessage(phoneNumber, enviado.ok
          ? `✅ ${nombre} ya tiene su canal y le llegó el enlace a su WhatsApp.\n\nSi quiere reenviárselo usted también, aquí está el texto 👇`
          : `✅ ${nombre} ya tiene su canal, pero WhatsApp no me dejó entregárselo.\n\nReenvíele usted este texto 👇`);
        await sendWhatsAppMessage(phoneNumber, bienvenida);
      } else {
        await sendWhatsAppMessage(phoneNumber, `No pude crear el canal de ${nombre}: ${resultado.error}`);
      }
      console.log(`🎫 [WA Admin] ACTIVAR "${nombre}" → ${destino} · ${resultado.ok ? resultado.slug : resultado.error}`);
      return;
    }

    // El comando salió mal escrito o la persona no está radicada: se dice qué
    // falta, en vez de dejar el mensaje sin respuesta.
    if (mComando && admins.includes(phoneNumber) && nombre) {
      await sendWhatsAppMessage(phoneNumber,
        `No encontré el número de ${nombre}.\n\nEscríbame así:\nACTIVAR ${nombre} 3001234567`);
      return;
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
      return;
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
      return;
    }

    // ─── 1.45 ¿Es el dueño de un canal, y no un prospecto? ────────────────────
    // El canal atiende a los dos por el mismo número. Sin esta consulta, el socio
    // recibía la apertura de prospecto y Queswa se presentaba ante él como la
    // asistente de sí mismo, para después explicarle el negocio que ya compró.
    // La detección es determinística —su teléfono está en `constructor_slugs`—,
    // así que no hay margen de error ni costo de modelo.
    const socioQueEscribe = await identificarSocio(supabase, phoneNumber);
    if (socioQueEscribe) {
      console.log(`👤 [WA Webhook] Escribe el dueño de /${socioQueEscribe.slug} — modo socio`);
    }

    // Al socio nuevo se le saluda una vez, con lo suyo: su enlace y lo que Queswa
    // puede hacer por él. No la explicación del negocio.
    if (socioQueEscribe && !existingProspect) {
      const saludo = saludoDeSocio(socioQueEscribe.nombre, socioQueEscribe.slug);
      await sendWhatsAppMessage(phoneNumber, saludo);
      await persistirTurnoDictado(supabase, waFingerprint, messageText, saludo);
      console.log(`👋 [WA Webhook] Saludo de socio entregado a /${socioQueEscribe.slug}`);
      return;
    }

    // ─── 1.5 Apertura dictada (solo primer contacto) ──────────────────────────
    // El primer mensaje NO lo genera el modelo: es copy calibrado, nombra al socio
    // que refirió (dato que solo vive aquí) y va como lista interactiva, que el
    // motor no sabe emitir porque devuelve texto. Mismo patrón que
    // getMicroPromptApertura(): donde el nodo es determinístico, dicta el backend.
    //
    // Se persiste el turno para que el motor reconstruya bien el hilo; si no, el
    // segundo mensaje volvería a contar como el primero y Queswa re-saludaría.
    // ─── Aviso al socio: alguien suyo acaba de escribir ───────────────────────
    // Solo en el primer mensaje, y con nombre y número — que es lo que distingue
    // este aviso de los de la web, donde el visitante es un hash sin identidad.
    // Es el momento de mayor valor para el socio: la persona está conversando
    // AHORA, y él puede saludarla desde su propio chat mientras eso ocurre.
    if (!existingProspect && patrocinador?.constructorId) {
      const r = await avisarSocioNuevoProspecto(
        supabase, patrocinador.constructorId, contactName, phoneNumber,
      );
      if (r !== 'enviado') console.log(`🔕 [WA Webhook] aviso de prospecto nuevo no enviado: ${r}`);
    }

    // ⚠️ Quien LLEGA DECIDIDO no recibe la bienvenida: recibe la radicación.
    // El caso es real y frecuente cuando el socio cierra por teléfono o en
    // persona y le pasa a su contacto un enlace wa.me con el texto listo. Si a
    // ese mensaje se le responde con el saludo y los tres botones, la persona
    // que ya dijo que sí tiene que volver a decirlo — y ese es justo el momento
    // en que se enfría. Al saltar la apertura, el turno sigue de largo hasta
    // `gestionarCierre`, que pide los cuatro datos en un solo mensaje.
    const llegaDecidido = RE_VOLICION.test(messageText);
    if (llegaDecidido) {
      console.log(`🎯 [WA Webhook] ${phoneNumber} llega con volición declarada — se salta la apertura`);
    }

    // ⚠️ QUIEN LLEGA PREGUNTANDO NO RECIBE UN SALUDO GENÉRICO.
    //
    // No todo el mundo entra por el enlace del socio: mucha gente escribe por su
    // cuenta y lo primero que manda ya es una pregunta concreta. Hasta ahora la
    // apertura se disparaba igual, así que a "hola, deseo ver el catálogo de los
    // productos" se le respondía con el saludo y los tres botones — ignorando lo
    // único que la persona había dicho (prueba del Director, 21 ago).
    //
    // Una pregunta es la señal de intención más fuerte que existe: responderla
    // vale más que presentarse. El saludo no se pierde — lo da el motor en una
    // línea, avisado por `pageContext`, y con el nombre del socio si lo hay.
    //
    // "Hola" a secas, o el saludo del enlace, SÍ reciben la apertura: ahí no hay
    // nada que responder y los botones son lo que baja la barrera.
    const _soloSaludo = /^(hola|buenas|buenos d[ií]as|buenas tardes|buenas noches|hey|qu[eé] tal|saludos|buen d[ií]a)[\s.,!¡]*$/i
      .test(messageText.trim());
    const _vieneDelEnlace = /vengo del enlace/i.test(messageText);
    const _traePregunta = !_soloSaludo && !_vieneDelEnlace
      && (/\?|c[oó]mo|qu[eé]|cu[aá]l|cu[aá]nto|d[oó]nde|por qu[eé]|qui[eé]n|deseo|quiero|me interesa|necesito|inform/i.test(messageText)
          || messageText.trim().split(/\s+/).length >= 4);

    if (!existingProspect && _traePregunta) {
      console.log(`💬 [WA Webhook] Primer contacto CON pregunta ("${messageText.slice(0, 45)}") — responde el motor, sin apertura`);
    }

    if (!existingProspect && !llegaDecidido && !_traePregunta) {
      const apertura = construirApertura(patrocinador?.nombre, contactName);

      // A quien escribe con nombre de usuario (BSUID) la apertura le va en texto
      // plano. El interactivo no le llega, y el fallo no se puede detectar a
      // tiempo: la Graph API acepta con 200 y descarta después, así que el
      // respaldo de abajo —que solo mira el rechazo inmediato— nunca se activa
      // y la persona se queda sin nada. Un mensaje entregado vale más que uno
      // más vistoso que no llega. Revisable cuando Meta documente el caso.
      const _sinBotones = esBSUID(phoneNumber);
      const _opciones = APERTURA_OPCIONES.map((o) => `• ${o.title}`).join('\n');

      const enviado = _sinBotones
        ? { ok: false as const, error: 'BSUID: apertura en texto plano' }
        : await sendReplyButtons(phoneNumber, apertura, APERTURA_OPCIONES);

      // Si Meta rechaza el interactivo (formato, límites), no dejar a la persona
      // sin respuesta: cae a texto plano con las mismas opciones enumeradas.
      if (!enviado.ok) {
        if (!_sinBotones) console.warn('⚠️ [WA Webhook] Botones rechazados — fallback a texto plano');
        await sendWhatsAppMessage(phoneNumber, `${apertura}\n\n${_opciones}`);
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
      return;
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
      return;
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
        if (rol === 'assistant' && detectarPromesaDeIngreso(m.content)) {
          historial.push({ role: 'assistant', content: RESPUESTA_CORRECTIVA });
          turnosSaneados++;
          continue;
        }

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

    // ─── 2.25 Foto de un producto ─────────────────────────────────────────────
    // Pedir la foto de un producto es de lo más común en el canal, y hasta ahora
    // Queswa solo podía describirlo. Se envía SOLO si la persona la pide y nombra
    // un producto: mandarla porque el producto se mencionó convierte la
    // conversación en un catálogo que dispara solo.
    //
    // ⚠️ La imagen va SIN declaración de salud en el pie — nombre, presentación,
    // precio y registro sanitario. Ver la nota de cabecera de wa-productos.ts:
    // una imagen con promesa es publicidad de producto, y esa se juzga con la
    // vara de la etiqueta, no con la de una conversación.
    // ⚠️ EL MOTOR NO SABE QUE LA FOTO SALIÓ, y por eso este bloque cierra el
    // turno cuando puede. En la prueba del 20 ago la persona recibió la imagen y
    // debajo un texto que decía "por este canal no puedo enviar imágenes",
    // rematado con una oferta sobre OTRO producto. El modelo no tenía cómo
    // saberlo: la imagen la manda el webhook, no él.
    //
    // Si el mensaje pide SOLO la foto, el turno se cierra aquí — imagen más una
    // pregunta dictada sobre ESE producto. Si además trae una pregunta ("la foto
    // y cuánto cuesta"), sigue al motor y se le avisa por el pageContext que la
    // imagen ya está entregada.
    let fotoEnviada: string | null = null;
    if (pideImagen(messageText)) {
      // "dame una imagen" a secas es la forma normal de pedirla cuando ya se
      // venía hablando de un producto: si el mensaje no lo nombra, se toma del
      // hilo (prueba del 20 ago — caía al motor y respondía que no podía).
      const producto = detectarProducto(messageText) ?? productoDelHilo(historial);
      if (producto) {
        // Cuando el mensaje pide SOLO la foto, la pregunta de cierre viaja
        // dentro del pie: enviada como mensaje aparte llegaba ANTES que la
        // imagen —Meta tarda en descargarla de la URL— y la persona leía la
        // pregunta antes de ver el producto (prueba del 20 ago).
        const soloFoto = esSoloPedidoDeImagen(messageText);
        let seguimiento: string | undefined;
        if (soloFoto) {
          // ¿Ya se le había explicado este producto? Volver a ofrecérselo sería
          // no estar leyendo el hilo.
          const clave = producto.nombre.toLowerCase().split(' ')[0];
          const yaExplicado = historial.some((m) =>
            m.role === 'assistant' && !m.content.startsWith('[Foto')
            && m.content.length > 200 && m.content.toLowerCase().includes(clave));
          seguimiento = seguimientoFoto(producto, yaExplicado);
        }

        await pisoDeEscritura();
        const enviada = await sendImage(phoneNumber, urlImagen(producto), pieDeFoto(producto, seguimiento));
        if (enviada.ok) {
          fotoEnviada = producto.nombre;
          console.log(`📷 [WA Webhook] Foto de ${producto.slug} enviada a ${phoneNumber}`);
          if (soloFoto) {
            // Se persiste el PIE tal cual, no un marcador entre corchetes: el
            // modelo lee este turno en el hilo, y con "[Foto ... enviada]" lo
            // interpretaba como que el tema eran las imágenes — al turno
            // siguiente respondió "no tengo imágenes disponibles" (21 ago).
            await persistirTurnoDictado(supabase, waFingerprint, messageText,
              pieDeFoto(producto, seguimiento));
            console.log('📷 [WA Webhook] Turno cerrado sin motor');
            return;
          }
        } else {
          console.warn(`⚠️ [WA Webhook] Foto de ${producto.slug} no se pudo enviar: ${enviada.error}`);
        }
      } else {
        console.log('📷 [WA Webhook] Pidió imagen pero no nombró un producto reconocible — responde el motor');
      }
    }

    // ─── 2.3 El escenario del simulador se responde dictado ───────────────────
    // La persona acaba de elegir tarifa y clientes (o paquete y cantidad) y vio
    // el resultado en el Flow. Lo que espera es que la conversación reconozca
    // SU cifra — no el ejemplo fijo del motor, que respondía al 17% del
    // Visionario a quien había elegido el Empresarial al 16% (19 ago 2026). Se
    // calcula con las tablas del Flow en wa-simulador.ts y no pasa por el modelo.
    // Si el payload viene raro y no se puede calcular, sigue al motor como antes.
    if (vieneDelSimulador && escenarioSimulador) {
      // Si la composición ya se mostró u ofreció, el cierre del escenario no la
      // vuelve a ofrecer: pide la elección (prueba conversacional del 20 ago —
      // repetía "¿le muestro qué trae el Empresarial?" ya atendida).
      const opciones = {
        composicionYaOfrecida: historial.some((m) =>
          m.role === 'assistant' && /qu[eé] trae el paquete|le activa inmediatamente este inventario/i.test(m.content)),
      };
      const respuestaSimulador = 'tipo' in escenarioSimulador
        ? respuestaRenta(escenarioSimulador, opciones)
        : respuestaGen5(escenarioSimulador, opciones);
      if (!respuestaSimulador) {
        console.warn('⚠️ [WA Webhook] Escenario del simulador ilegible — el turno sigue al motor');
      } else {
      await sendWhatsAppMessage(phoneNumber, respuestaSimulador, { wamid });
      await persistirTurnoDictado(supabase, waFingerprint, messageText, respuestaSimulador);
      console.log(`🧮 [WA Webhook] Escenario del simulador respondido dictado para ${phoneNumber}`);
      return;
      }
    }

    // ─── 2.4 Reenviar el simulador cuando lo pidan ────────────────────────────
    // Un Flow completado queda sellado en WhatsApp: la tarjeta muestra el resumen
    // y no vuelve a abrir. Quien está sopesando el proyecto quiere volver a los
    // números — se le manda una tarjeta nueva, sin pasar por el motor.
    const flowSimuladorId = process.env.WHATSAPP_FLOW_SIMULADOR_ID;
    // `!vieneDelSimulador` es indispensable: el texto que sintetizamos al cerrar
    // el Flow contiene la palabra "simulador", así que sin este guard completar el
    // simulador lo reenviaba en vez de responder al escenario que la persona armó.
    //
    // Y el "sí" también abre el simulador cuando eso fue lo que se ofreció (20
    // ago 2026): el ejemplo dictado cierra con "¿Quiere armar su propio
    // escenario en el simulador?" y la tarjeta viaja justo debajo — pero quien
    // responde "sí" en vez de tocarla no puede caer al motor, que no tiene
    // ninguna tarjeta que ofrecer. La oferta se lee del último turno del bot.
    const _ultimoBotW = [...historial].reverse().find((m) => m.role === 'assistant')?.content || '';
    const _aceptaSimulador = /escenario en el simulador/i.test(_ultimoBotW)
      && /^(s[ií]|claro|dale|listo|ok|bueno|por supuesto|de una|h[aá]gale|mu[eé]str[ea]me(lo)?|quiero|s[ií] por favor)(?![a-záéíóúñ])/i.test(messageText.trim());
    if (flowSimuladorId && !vieneDelSimulador
        && (/simula(dor|r|ci[oó]n)|volver a ver los n[uú]meros|abrir.*n[uú]meros/i.test(messageText) || _aceptaSimulador)) {
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
        return;
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
      await sendWhatsAppMessage(phoneNumber, cierre.texto, { wamid });
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
      return;
    }

    // ─── 2.7 El catálogo es un nodo dictado ───────────────────────────────────
    // Quien pide el catálogo quiere verlo, y la respuesta es un enlace: no hay
    // nada que interpretar. Dejárselo al modelo salió caro — compuso "le muestro
    // la que acaba de llegar al contexto" (le enseñó las tripas a la persona),
    // inventó una cuarta categoría llamada "Nutrición" y cerró con dos preguntas
    // (prueba del Director, 21 ago).
    //
    // El enlace es el amigable del socio: `/{slug}/productos` redirige a
    // `/sistema/productos/{constructor_id}` y atribuye por el path.
    //
    // ⚠️ Esto NO contradice la decisión de no sacar a la persona del canal: esa
    // página lleva el orbe de Queswa, así que la conversación continúa allá.
    const _pideCatalogo = /(cat[aá]logo)|d[oó]nde[^.?]{0,25}(ver|veo|encuentro|consulto|miro)[^.?]{0,25}productos|ver (todos )?los productos/i.test(messageText)
      && !/paquete|esp[\s-]?[123]/i.test(messageText);
    if (_pideCatalogo && socio?.constructorId) {
      const slug = await slugDelSocio(supabase, socio.constructorId);
      const url = slug
        ? `https://creatuactivo.com/${slug}/productos`
        : `https://creatuactivo.com/sistema/productos/${encodeURIComponent(socio.constructorId)}`;
      const texto = `Con gusto. Aquí está el catálogo completo, con fotos, presentaciones y precios:

${url}

Si algo le llama la atención mientras mira, me escribe por aquí — o toca el botón de Queswa en la misma página y seguimos allá.

¿Le cuento cuál es el que más piden?`;
      await sendWhatsAppMessage(phoneNumber, texto, { wamid });
      await persistirTurnoDictado(supabase, waFingerprint, messageText, texto);
      console.log(`🔗 [WA Webhook] Catálogo dictado: ${url}`);
      return;
    }

    // pageContext le dice al motor el origen del mensaje (CTWA vs orgánico)
    // `whatsapp_socio` le dice al motor que del otro lado hay un dueño de canal:
    // no hay que convencerlo de nada ni explicarle el modelo, hay que ayudarle a
    // trabajar el suyo. Sin esta señal el motor responde con argumentos de venta a
    // quien ya compró.
    const pageContext = fotoEnviada
      ? 'whatsapp_foto_enviada'
      : (!existingProspect && _traePregunta)
      ? 'whatsapp_primer_contacto'
      : socioQueEscribe
      ? 'whatsapp_socio'
      : isCTWA
        ? `whatsapp_ctwa${isMapaCTA ? '_mapa_de_salida' : ''}`
        : 'whatsapp_inbound';

    // "Escribiendo…" se apaga solo a los 25 s. Cuando el motor pasa de ahí, el
    // indicador desaparece justo antes de que llegue el texto — y ese hueco es
    // el que se siente como abandono. Mientras se espera al motor, se renueva
    // cada 20 s. Se apaga en `finally`, pase lo que pase.
    const tMotor = Date.now();
    const keepalive = wamid
      ? setInterval(() => { void marcarLeidoYEscribiendo(wamid); }, 20_000)
      : undefined;

    let nexusResponse: Response;
    let queswaReply = '';
    try {
      nexusResponse = await fetch(`${baseUrl}/api/nexus`, {
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
        await sendWhatsAppMessage(phoneNumber, 'Hubo un error procesando su mensaje. Inténtelo de nuevo en un momento.');
        return;
      }

      // ─── 3. Consumir stream text/plain ─────────────────────────────────────
      const reader  = nexusResponse.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          queswaReply += decoder.decode(value, { stream: true });
        }
      }
    } finally {
      if (keepalive) clearInterval(keepalive);
    }

    const msMotor = Date.now() - tMotor;
    queswaReply = queswaReply.trim();
    console.log(`💬 [WA Webhook] Queswa responde (${pageContext}, motor ${msMotor} ms): "${queswaReply.slice(0, 80)}..."`);

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
      return;
    }

    // Guardarraíl de negocio — SALIDA. La contraparte del de salud, para el otro
    // riesgo que puede costar la cuenta: la promesa de ingreso. El copy de los
    // arsenales ya está corregido, pero eso solo cubre lo que el modelo ENTREGA;
    // cuando ningún fragmento dispara, COMPONE — y en la prueba del 14 ago
    // compuso una pirámide de 3.125 personas y un "ingreso inmediato". Esta es la
    // red que faltaba debajo. Meta sanciona las promesas de ingreso en el canal y
    // el Estatuto del Consumidor las vuelve exigibles a la empresa.
    const promesa = detectarPromesaDeIngreso(queswaReply);
    if (promesa) {
      console.error(`🚨 [WA Guardrail Negocio] BLOQUEADO — "${promesa}" en la respuesta a ${phoneNumber}. Texto: "${queswaReply.slice(0, 300)}"`);
      await sendWhatsAppMessage(phoneNumber, RESPUESTA_CORRECTIVA);
      await corregirTurnoEnvenenado(supabase, waFingerprint, queswaReply);
      return;
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
      return;
    }

    // ─── 4. Enviar respuesta al héroe via Meta API ────────────────────────────
    if (queswaReply) {
      // La cita se pone sola cuando hace falta, y no antes. Si el turno se
      // resolvió rápido, la respuesta sale justo debajo de la pregunta y citarla
      // solo agrega dos renglones de ruido a cada burbuja. Cuando el motor tarda
      // —y con reescritura, búsqueda, modelo y tres guardarraíles a veces tarda—
      // la persona ya escribió otra cosa encima, y ahí la cita es lo que dice a
      // cuál de sus mensajes se le está contestando.
      const tardo = Date.now() - t0 > 8000;
      await sendWhatsAppMessage(phoneNumber, queswaReply, { wamid, citar: tardo });

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
      // ⚠️ Una COMPOSICIÓN no es una explicación de cifras. La tabla del ESP-3
      // nombra el GEN5 de pasada ("GEN5 activo sin límite") y trae precios, así
      // que disparaba el simulador de generaciones a alguien que preguntó qué
      // productos vienen en la caja (prueba del Director, 21 ago). Ofrecer una
      // herramienta que no viene al caso rompe el hilo justo cuando la persona
      // estaba mirando lo que se lleva.
      const _esComposicion = /\|\s*Producto\s*\||lo que trae|le activa inmediatamente este inventario|productos para arrancar/i.test(queswaReply);
      const _explicaGen5 = !_esComposicion && /ge?n[\s.-]?5/i.test(queswaReply) && /\$\s?\d/.test(queswaReply);
      const _explicaBinario = !_esComposicion && /b[ia]+n[a-z]?r[a-z]?i?o|ingreso recurrente/i.test(queswaReply) && /\$\s?\d/.test(queswaReply);
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

    // ─── Cronómetro del turno ─────────────────────────────────────────────────
    // Una línea por turno con el total y cuánto de eso fue el motor. El techo
    // de la función son 30 s (`maxDuration`): pasado eso Vercel la mata y la
    // persona, que ya vio "escribiendo…", no recibe nada y el turno no se
    // guarda. Un turno que pasa de 20 s se marca para que se vea venir.
    const msTotal = Date.now() - t0;
    const linea = `⏱ [WA Webhook] turno ${msTotal} ms (motor ${msMotor} ms, resto ${msTotal - msMotor} ms) · ${queswaReply.length} chars`;
    if (msTotal > 20_000) console.warn(`${linea} — CERCA DEL TECHO de ${maxDuration} s`);
    else console.log(linea);

    return;

  } catch (error) {
    console.error('❌ [WA Webhook] Error inesperado:', error);
    return;
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
/**
 * Cuándo empezó el turno en curso. Lo fija `procesarEntrante` al recibir el
 * mensaje y lo lee el piso de escritura de abajo — es de módulo y no un
 * parámetro porque hay dieciocho puntos de envío y pasarlo por todos solo
 * multiplica las formas de olvidarlo.
 *
 * ⚠️ Una invocación atiende UN mensaje, así que no hay dos turnos compartiendo
 * este valor. Si algún día el webhook procesara varios, esto pasa a parámetro.
 */
let _turnoEmpezoEn = 0;

/**
 * "Escribiendo…" tiene que alcanzar a verse.
 *
 * Los turnos que dicta el backend —la apertura, el ejemplo de cifras, la foto,
 * el cierre— salen en trescientos milisegundos, y WhatsApp no llega a pintar el
 * indicador: la persona ve aparecer un párrafo de la nada. Los que pasan por el
 * modelo tardan segundos y sí lo muestran, y esa diferencia se siente como que
 * el sistema funciona a ratos (observación del Director, 21 ago).
 *
 * Un segundo de piso empareja el ritmo. No es cosmético: nadie escribe cuatro
 * líneas en un instante, y una respuesta instantánea a una pregunta de fondo se
 * lee como una máquina contestando, no como alguien que le está respondiendo.
 */
async function pisoDeEscritura(): Promise<void> {
  const PISO_MS = 1000;
  if (!_turnoEmpezoEn) return;
  const falta = PISO_MS - (Date.now() - _turnoEmpezoEn);
  if (falta > 0) await new Promise((r) => setTimeout(r, falta));
}

async function sendWhatsAppMessage(
  to: string,
  text: string,
  opciones: { wamid?: string; citar?: boolean } = {},
): Promise<void> {
  await pisoDeEscritura();
  const partes = partirParaWhatsApp(aFormatoWhatsApp(text));

  for (let i = 0; i < partes.length; i++) {
    // La cita cuelga SOLO del primer envío. Repetirla en cada parte llena la
    // pantalla de bloques citados y termina escondiendo la respuesta.
    const cita = i === 0 && opciones.citar && opciones.wamid
      ? { responderA: opciones.wamid }
      : {};
    await sendText(to, partes[i], cita);

    if (i < partes.length - 1) {
      // Meta no garantiza el orden de entrega de envíos simultáneos, así que la
      // pausa es obligatoria. Se aprovecha para dos cosas más: se escala con lo
      // que viene (una pausa fija de 600 ms delata a la máquina) y lleva
      // "escribiendo…" encima, sin lo cual el hueco se lee como que el bot se
      // colgó a mitad de respuesta.
      if (opciones.wamid) await marcarLeidoYEscribiendo(opciones.wamid);
      await new Promise((r) => setTimeout(r, Math.min(1500, 500 + partes[i + 1].length / 2)));
    }
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
 * El slug personalizado del socio (`luis-cabrejo`), para armar el enlace
 * amigable `creatuactivo.com/{slug}/productos`.
 *
 * Se resuelve aparte y solo cuando se necesita: el `constructor_id`
 * (`luis-cabrejo-1288`) lo traen todos los caminos, pero el slug vive en
 * `constructor_slugs` y pedirlo en cada turno sería una consulta de más.
 * Ante cualquier fallo devuelve null y el enlace cae al de siempre.
 */
async function slugDelSocio(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  constructorId: string | undefined,
): Promise<string | null> {
  if (!constructorId) return null;
  try {
    const { data } = await supabase
      .from('constructor_slugs')
      .select('slug')
      .eq('constructor_id', constructorId)
      .maybeSingle();
    return (data?.slug as string) || null;
  } catch {
    return null;
  }
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
  codigoGano?: string,
): Promise<{ ok: true; slug: string } | { ok: false; error: string }> {
  if (!whatsapp || whatsapp.length < 12) return { ok: false, error: 'el número no parece completo' };

  const sinTildes = (t: string) =>
    t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

  try {
    // Repetir el comando es lo normal cuando el primer envío cayó fuera de
    // ventana, así que un número que ya tiene canal recibe el suyo, no otro.
    const { data: previo } = await supabase
      .from('constructor_slugs').select('slug').eq('whatsapp', whatsapp).maybeSingle();
    if (previo?.slug) return { ok: true, slug: previo.slug };

    // ⚠️ `constructor_id` NO es un UUID: es la llave de texto con la que el
    // Dashboard y la página del reel se entienden, y su formato es
    // `nombre-completo-en-slug` + código de Gano. Con un UUID aleatorio la
    // página del reel no encuentra al dueño en `private_users` y cae al número
    // orgánico — el prospecto terminaría escribiéndole a otra persona.
    const sufijo = (codigoGano || '').replace(/\D/g, '') || String(Date.now()).slice(-6);
    const constructorId = `${sinTildes(nombre).split(/\s+/).join('-')}-${sufijo}`.slice(0, 60);

    // El slug corto es el que la persona comparte; el largo vive en constructor_id.
    const base = slugDesdeNombre(nombre);
    let slug = base;
    for (let i = 2; i <= 20; i++) {
      const { data: ocupado } = await supabase
        .from('constructor_slugs').select('slug').eq('slug', slug).maybeSingle();
      if (!ocupado) break;
      slug = `${base}${i}`;
    }

    // La cuenta primero: sin esta fila, la página del reel muestra el WhatsApp
    // orgánico en vez del suyo. `plan_type` entra como 'inicial' y lo corrige el
    // Centro de Mando; lo que no puede faltar hoy es el teléfono.
    const { error: eUser } = await supabase.from('private_users').insert({
      name: nombre,
      constructor_id: constructorId,
      whatsapp,
      status: 'active',
      role: 'constructor',
      plan_type: 'inicial',
      ...(codigoGano ? { gano_excel_id: codigoGano.replace(/\D/g, '') } : {}),
    });
    if (eUser && !`${eUser.message}`.includes('duplicate')) {
      return { ok: false, error: `no pude crear la cuenta (${eUser.message})` };
    }

    const { error } = await supabase.from('constructor_slugs').insert({
      slug,
      display_name: nombre,
      whatsapp,
      constructor_id: constructorId,
      activado_en: new Date().toISOString(),
    });
    if (error) return { ok: false, error: error.message };

    return { ok: true, slug };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'error inesperado' };
  }
}

