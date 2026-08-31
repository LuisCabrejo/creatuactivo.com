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
  marcarLeidoYEscribiendo,
} from '@/lib/wa-channel';
import { transcribirNotaDeVoz } from '@/lib/wa-audio';
import {
  construirApertura,
  APERTURA_OPCIONES,
  getRespuestaBoton,
} from '@/lib/wa-apertura';
import {
  detectarConsultaConPareja, textoOfrecerEnlace, botOfrecioEnlace, aceptaEnlace,
  textoEntregaEnlace, textoSinEnlace, enlaceParaPareja, botOfrecioPlazo, interpretarPlazo,
  textoConfirmacionPlazo, avisarAlSocioPareja, detectarLlegadaDePareja, aperturaParaPareja,
} from '@/lib/wa-pareja';
import { gestionarCierre, RE_VOLICION } from '@/lib/wa-radicacion';
import { extraerTokenDePase, resolverCompartidor, limpiarMarcador } from '@/lib/wa-pase';
import {
  detectarAmbivalencia, esConsultaConPareja, botEvoco, esMotivoDeDinero,
  yaVioLasFormasDeGanar, peldanoDeEscalera, extraerCalificacion, botPidioHora,
  esNoExplicito, yaSeEvoco, aceptaPuerta,
} from '@/lib/wa-ambivalencia';
import { extraerMomento, guardarAcuerdo, guardarPuertaAbierta } from '@/lib/wa-acuerdos';
import {
  extraerNombres, pareceListaDeNombres, guardarLista, siguienteContacto, resumenLista,
  marcarEnviado, pideAyudaParaEmpezar, diceQueYaEnvio, preguntaPorLaLista,
  preguntaDelCafe, listaGuardada, siguienteDeLaLista, listaTerminada, resumenParaElSocio,
} from '@/lib/wa-lista-socio';
import { aFormatoWhatsApp, partirParaWhatsApp } from '@/lib/wa-formato';
import { respuestaRenta, respuestaGen5 } from '@/lib/wa-simulador';
import {
  detectarIntencionCompra, pedidoAbierto, pedidoCargado, lineasDelPedido,
  pedirProductos, noEntendiProductos, confirmarPedido, registrarPedido, avisarPedido,
  detectarPreguntaEnvio, respuestaEnvio,
  detectarPreguntaOficina, detectarCiudad, respuestaOficinaProspecto, RE_OFICINA_YA_EXPLICADA, diceDondeVive,
  esGanocafeSinVariante, preguntarCualGanocafe, leerVarianteGanocafe, RE_PREGUNTO_CUAL_GANOCAFE,
  detectarPidePersona, respuestaPersona, avisarPidePersona,
  optinYaOfrecido, esCierreDeConversacion, ofrecerOptin, leerRespuestaOptin, respuestaOptin, RE_OFRECIO_OPTIN,
  nombreCorto, RE_PEDIDO_CARGADO,
  seguimientoSalud, RE_OFERTA_FOTO_PRODUCTO, RE_OFERTA_PEDIDO_SEDE, RE_OFERTA_CATALOGO_SALUD, esAceptacion,
} from '@/lib/wa-pedido';
import {
  pideImagen, detectarProducto, productoDelHilo, pieDeFoto, urlImagen, esSoloPedidoDeImagen, seguimientoFoto,
  detectarFamilia, familiaOfrecida, preguntoCualLinea, esAceptacionCorta, urlImagenFamilia, pieDeFotoFamilia, FAMILIAS_WA,
} from '@/lib/wa-productos';
import {
  slugDesdeNombre,
  normalizarWhatsApp,
  mensajeDeBienvenida,
  enlaceDeCanal,
  avisarSocioNuevoProspecto,
  identificarSocio,
  saludoDeSocio,
  pideEnlaceCatalogo,
  mensajeEnlaceCatalogo,
} from '@/lib/wa-onboarding';
import {
  detectarEmergencia,
  clasificarPreguntaSalud,
  detectarClaimSaludEnSalida,
  esRechazoSalud,
  RESPUESTA_EMERGENCIA,
  RECHAZO_SALUD_ESTANDAR,
  rechazoSaludPorFamilia,
  esRechazoSaludComun,
} from '@/lib/wa-guardarrail-salud';
import { detectarPromesaDeIngreso, detectarModeloInventado } from '@/lib/wa-guardarrail-negocio';

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
async function yaProcesado(wamid: string, identidad?: unknown): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (getSupabase() as any)
      .from('wa_mensajes_procesados')
      .insert({ wamid, identidad: identidad ?? null });

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

  // Los campos de identidad quedan guardados junto al wamid. Meta los reparte
  // sin garantía de cuál trae qué, y sin este rastro cada sorpresa cuesta una
  // ronda de pruebas a ciegas — el log de Vercel se pierde en minutos.
  const _v = body?.entry?.[0]?.changes?.[0]?.value;
  const identidad = wamid ? {
    from:        _v?.messages?.[0]?.from ?? null,
    wa_id:       _v?.contacts?.[0]?.wa_id ?? null,
    user_id:     _v?.contacts?.[0]?.user_id ?? null,
    msg_user_id: _v?.messages?.[0]?.user_id ?? null,
  } : null;

  if (wamid && await yaProcesado(wamid, identidad)) {
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
/**
 * El BSUID prefijado va codificado dentro del wamid. Es el último recurso
 * cuando Meta no lo pone en ningún campo del payload: sin el prefijo de país
 * el envío devuelve #131026 y la persona nunca recibe nada.
 */
function bsuidDelWamid(wamid?: string): string | undefined {
  if (!wamid || !wamid.startsWith('wamid.')) return undefined;
  try {
    const crudo = Buffer.from(wamid.slice(6), 'base64').toString('latin1');
    return crudo.match(/[A-Z]{2}\.[A-Za-z0-9]{6,}/)?.[0];
  } catch {
    return undefined;
  }
}

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
    // Candidatos, en crudo. Meta reparte la identidad entre estos campos sin
    // garantía de cuál trae qué: del mismo remitente llegó `CO.1497020585516131`
    // en un turno y el mismo identificador PELADO, `1497020585516131`, en el
    // siguiente. Por eso no se elige "el primero que exista" sino por FORMA.
    const _candidatos = [
      message.from, contact?.wa_id, contact?.user_id, message.user_id,
    ].filter((c): c is string => typeof c === 'string' && c.length > 0);

    // El BSUID entregable lleva prefijo de país (`CO.`). Si ningún campo lo
    // trae, se saca del wamid, que lo lleva codificado siempre. Para un
    // remitente con teléfono normal ahí no hay ningún `CC.`, así que este
    // rescate no puede confundirse.
    const _prefijado = _candidatos.find((c) => /^[A-Z]{2}\.[A-Za-z0-9]{6,}$/.test(c))
      ?? bsuidDelWamid(message.id as string | undefined);

    // Un teléfono de verdad gana: es lo que sirve para detectar país y
    // reconocer al socio. Pero si resulta ser el BSUID sin su prefijo, no lo es.
    let _telefono = _candidatos.find((c) => /^\+?\d{7,15}$/.test(c));
    if (_prefijado && _telefono && _prefijado.endsWith(`.${_telefono.replace('+', '')}`)) {
      _telefono = undefined;
    }

    const phoneNumber = _telefono || _prefijado || _candidatos[0];
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
    let escenarioSimulador: { tipo: 'renta'; tarifa: string; clientes: string; consumo?: string } | { paquete: string; cantidad: string } | null = null;
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

      // Toque de un botón de respuesta rápida de una PLANTILLA: Meta NO lo manda
      // dentro de `interactive` sino como `type: "button"` con `button.text`.
      // Hasta el 22 ago 2026 este caso no se leía: el socio tocaba «Sí, cuénteme»
      // en `enlace_canal_listo` y caía en el acuse de "no puedo procesar esto".
      const botonPlantilla = message.button as { text?: string; payload?: string } | undefined;
      if (!messageText && botonPlantilla?.text) {
        messageText   = botonPlantilla.text;
        opcionElegida = botonPlantilla.payload;
        console.log(`👆 [WA Webhook] ${phoneNumber} tocó el botón de plantilla "${botonPlantilla.text}"`);
      }

      // Cierre de un Flow (el simulador): llega como nfm_reply con el payload del
      // `complete`. Se traduce a lenguaje natural para que el motor y el historial
      // lo entiendan como lo que es — la persona armó su propio escenario.
      if (!messageText && interactivo?.nfm_reply?.response_json) {
        try {
          const r = JSON.parse(interactivo.nfm_reply.response_json) as {
            paquete?: string; cantidad?: string; tipo?: string; tarifa?: string; clientes?: string; consumo?: string; escenario?: string;
          };
          // La pantalla del 17% manda un solo campo `escenario` ("25x6" = 25
          // clientes que piden 6 cajas al mes). Es un rodeo obligado: el runtime
          // de Meta no acepta condiciones sobre dos campos a la vez —ni `&&`,
          // ni If anidado bajo Form, ni Switch—, así que las 16 combinaciones
          // viven en un solo desplegable y aquí se decodifican.
          if (r.tipo === 'renta' && r.escenario && !r.clientes) {
            const m = r.escenario.match(/^(\d+)x(\d+)$/);
            if (m) { r.clientes = m[1]; r.consumo = m[2]; }
          }
          if (r.tipo === 'renta' && r.tarifa && r.clientes) {
            messageText = `Acabo de usar el simulador de renta: tarifa ${r.tarifa}, con ${r.clientes} clientes en cada centro de negocio${r.consumo ? ` y ${r.consumo} cajas al mes por cliente` : ''}.`;
            vieneDelSimulador = true;
            escenarioSimulador = { tipo: 'renta', tarifa: r.tarifa, clientes: r.clientes, consumo: r.consumo };
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
      .select('id, source, constructor_id, device_info')
      .eq('fingerprint_id', waFingerprint)
      .maybeSingle();

    // ─── Atribución al socio ──────────────────────────────────────────────────
    // El enlace que comparte el socio lleva su código en el texto pre-llenado
    // (ej. "Hola, vengo del enlace de luis-cabrejo"). Sin esto el prospecto queda
    // sin dueño: no aparece en el Radar de nadie, no dispara push, y la
    // pre-afiliación no sabe a quién avisar.
    const patrocinador = await resolverPatrocinador(supabase, messageText);

    // ─── 0.9 El PASE: ¿esta persona llega por el enlace de otro prospecto? ────
    // El marcador `de:xxxxxx` viaja en el texto prellenado del enlace compartido,
    // junto al slug del socio. Las dos señales conviven: el slug resuelve la
    // ATRIBUCIÓN —quien entra es del socio, sin excepción— y el marcador resuelve
    // QUIÉN LO COMPARTIÓ, que es lo único que agrega.
    //
    // ⚠️ El marcador se retira del texto ANTES de cualquier otra cosa. Si llega al
    // motor, el modelo lo lee, intenta interpretarlo y termina hablándole a la
    // persona de un código que ella nunca escribió.
    const _tokenPase   = extraerTokenDePase(messageText);
    const compartidor  = await resolverCompartidor(supabase, _tokenPase);
    if (_tokenPase && messageText) {
      messageText = limpiarMarcador(messageText);
      console.log(`🎟️ [WA Webhook] Llega por pase de ${compartidor?.nombre ?? 'un prospecto'} (${_tokenPase})`);
    }

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
            // Quién le pasó el enlace. NO cambia la atribución —esa es del socio—
            // pero permite saludarla nombrándolo y avisarle a él cuando conversen.
            ...(compartidor && {
              compartido_por:        compartidor.fingerprintId,
              compartido_por_nombre: compartidor.nombre,
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
      // Colombia: 57 + 10 dígitos. Estados Unidos / Canadá: 1 + 10 (el Director lo
      // escribe con el +1; un celular colombiano nunca empieza por 1, así que no
      // hay ambigüedad). Hasta el 22 ago 2026 todo se cortaba a 10 y se le
      // anteponía 57: un socio de EE. UU. no se podía activar por esta vía.
      const largoTel = d.startsWith('57') ? 12 : (d.startsWith('1') && d.length >= 11 ? 11 : 10);
      telefono   = normalizarWhatsApp(d.slice(0, largoTel));
      codigoGano = d.slice(largoTel);
    }

    // Si el comando llega sin teléfono, se busca a la persona por nombre entre
    // las radicaciones recientes: quien ya conversó con Queswa dejó ahí su
    // número, y volver a teclearlo es trabajo que la máquina puede hacer sola.
    if (mComando && nombre && telefono.length < 11 && admins.includes(phoneNumber)) {
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

    if (mComando && nombre && telefono.length >= 11 && admins.includes(phoneNumber)) {
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
        // ⚠️ Meta la movió de UTILITY a MARKETING (21 ago): no llega a números de
        // EE. UU. y consume cupo de marketing del buzón. `enlace_canal_listo_v2`
        // (22 ago, entrega pura, sin botón) salió MARKETING también, así que se
        // sigue con la v1, que al menos conserva el botón. Ver WABA_REFERENCIA.md.
        let enviado = await sendText(destino, bienvenida);
        if (!enviado.ok) {
          // ⚠️ A números de EE. UU. Meta NO entrega plantillas MARKETING (pausa
          // desde abr 2025, sin fecha de fin), y `enlace_canal_listo` lo es: la
          // API la acepta y nunca llega.
          //
          // ⛔ CUATRO variantes sometidas como UTILITY, cuatro veces MARKETING:
          // con botón y beneficio (v1), de entrega pura sin botón (v2, 22 ago),
          // sin URL siquiera (`acceso_canal`, 22 ago) y con URL al sitio
          // (`acceso_creatuactivo`). NO someter una quinta — y este es el porqué,
          // que faltaba y costó la ronda del 23 ago:
          //
          //   **Meta clasifica por lo que la plantilla ENTREGA, no por cómo está
          //   redactada.** La única que sobrevive como UTILITY en esta cuenta,
          //   `acceso_centro_mando_v2`, entrega una credencial personal que vence
          //   en 24 h. El enlace de canal es un activo que la persona va a
          //   COMPARTIR, y eso es mercadeo por definición. No hay redacción que lo
          //   arregle: quitarle el botón, el beneficio y hasta la URL no movió nada.
          //
          // Al socio de EE. UU. le llega por el reenvío del Director (abajo).
          const r = await sendTemplate(destino, 'enlace_canal_listo', 'es', [corto, enlaceDeCanal(resultado.slug)]);
          console.log(`📨 [WA Admin] Fuera de ventana → enlace_canal_listo ${r.ok ? 'entregada' : 'falló: ' + r.error}`);
          if (r.ok) enviado = r;
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

    // ─── 1.35 CAPTURAR ANTES DE CORTAR ────────────────────────────────────────
    // El webhook es una cadena de `if (…) return;`: el primer nodo que acierta
    // cierra el turno y todo lo demás que traía el mensaje se pierde sin dejar
    // rastro. El 29 ago 2026, «esp3, pero háblame de los productos, para qué
    // enfermedades sirven?» se fue por el guardarraíl de salud —correcto— y la
    // selección del ESP-3 no quedó en ninguna parte: `package` siguió en null.
    // Medido: 1 de cada 139 mensajes trae dos intenciones, y ese uno fue el más
    // valioso de la conversación.
    //
    // Va ANTES de todos los nodos, así que cualquiera que corte el turno hereda
    // la captura sin tener que acordarse de hacerla. No responde nada: solo
    // anota lo que el mensaje traía además.
    await capturarContextoDelMensaje(supabase, waFingerprint, messageText, patrocinador?.userId ?? existingProspect?.constructor_id ?? null);

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
      // Cada familia tiene su texto (peso · tratamiento · grave · común) — la
      // respuesta única para todo era el error (Director, 29 ago 2026).
      const { familia, texto: rechazo, declara } = rechazoSaludPorFamilia(saludEntrada, reincide, messageText);

      console.warn(`⛔ [WA Guardrail Salud] Entrada derivada (${familia}, ${declara ? 'declara' : 'pregunta'}${reincide ? ', reincidencia' : ''}: "${saludEntrada.termino}") — ${phoneNumber}`);
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
    // Quien pega el ENLACE del socio está llegando, no preguntando (prueba del
    // 22 ago: `creatuactivo.com/luis-cabrejo/queswa` pegado como primer mensaje
    // recibió la biografía del fundador en vez de la apertura, porque la sílaba
    // "que" de *queswa* disparaba el detector de pregunta). La URL propia cuenta
    // como venir del enlace, y las palabras-pregunta se buscan completas y fuera
    // de las direcciones.
    const _traeUrlPropia = /creatuactivo\.com\/|queswa\.app\//i.test(messageText);
    const _vieneDelEnlace = _traeUrlPropia || /vengo del enlace/i.test(messageText);
    const _textoSinUrls = messageText.replace(/https?:\/\/\S+|\b[a-z0-9.-]+\.(com|app|co|net|org)\/\S*/gi, ' ').trim();
    const _traePregunta = !_soloSaludo && !_vieneDelEnlace
      && (/\?|(?<![a-záéíóúñ])(c[oó]mo|qu[eé]|cu[aá]l(es)?|cu[aá]nto|d[oó]nde|por qu[eé]|qui[eé]n|deseo|quiero|me interesa|necesito|inform[a-z]*)(?![a-záéíóúñ])/i.test(_textoSinUrls)
          || _textoSinUrls.split(/\s+/).filter(Boolean).length >= 4);

    if (!existingProspect && _traePregunta) {
      console.log(`💬 [WA Webhook] Primer contacto CON pregunta ("${messageText.slice(0, 45)}") — responde el motor, sin apertura`);
    }

    // ─── 1.5b La pareja llega por el enlace ──────────────────────────────────
    // «Hola Queswa, vengo del enlace de luis-cabrejo, soy la pareja de Luis
    // Abner»: el enlace que Queswa le generó a él (wa-pareja.ts). El slug ya la
    // atribuyó al mismo socio; aquí se le da la apertura estándar con sus
    // botones y una línea que reconoce de parte de quién viene — nunca una
    // pregunta abierta a quien apenas está viendo la información (Director).
    const _llegaPareja = !existingProspect ? detectarLlegadaDePareja(messageText) : null;
    if (_llegaPareja) {
      const aperturaPareja = aperturaParaPareja(patrocinador?.nombre, _llegaPareja.nombre, contactName);
      const enviadoP = await sendReplyButtons(phoneNumber, aperturaPareja, APERTURA_OPCIONES);
      if (!enviadoP.ok) {
        const opciones = APERTURA_OPCIONES.map((o) => `• ${o.title}`).join('\n');
        await sendWhatsAppMessage(phoneNumber, `${aperturaPareja}\n\n${opciones}`);
      }
      await persistirTurnoDictado(supabase, waFingerprint, messageText, aperturaPareja);
      try {
        // Queda anotado de quién viene, para el Dashboard y para el motor.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).rpc('update_prospect_data', {
          p_fingerprint_id: waFingerprint,
          p_data: { pareja_de: _llegaPareja.nombre ?? 'su pareja' },
          p_constructor_id: patrocinador?.userId ?? null,
        });
      } catch { /* best-effort */ }
      console.log(`💑 [WA Webhook] Llegó la pareja de ${_llegaPareja.nombre ?? '(sin nombre)'} — apertura con reconocimiento`);
      return;
    }

    if (!existingProspect && !llegaDecidido && !_traePregunta) {
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

    // ─── 2.23 La consulta con la pareja — nodo dictado ───────────────────────
    // «Voy a consultarlo con mi esposa» no es una objeción, y tampoco se deja ir
    // con una despedida cortés (el 100 % vuelve con «yo le aviso»). Tres turnos
    // dictados por el backend, sin modelo: se OFRECE un enlace para la pareja;
    // si acepta, se entrega con un cierre por opciones («¿mañana, o en dos
    // días?»); con el plazo, se confirma y se avisa al socio. Todo en
    // src/lib/wa-pareja.ts. Va ANTES de los demás nodos y del motor, y solo
    // mira el último mensaje del bot — igual que todo el canal. No aplica al
    // socio: sus dudas son operativas.
    if (!socioQueEscribe) {
      const _ultimoBotPareja = [...historial].reverse().find((m) => m.role === 'assistant')?.content ?? '';
      let respuestaPareja: string | null = null;
      let plazoParaAviso: string | null = null;

      if (botOfrecioPlazo(_ultimoBotPareja)) {
        const plazo = interpretarPlazo(messageText);
        if (plazo) {
          const socioP = patrocinador ?? await resolverSocioDelProspecto(supabase, existingProspect?.constructor_id);
          respuestaPareja = textoConfirmacionPlazo(plazo, socioP?.nombre);
          plazoParaAviso = plazo;
        } else if (/le aviso|les aviso|yo (le|les) (escribo|cuento|digo)|despu[eé]s|luego|no s[eé]|ya veremos/i.test(messageText)) {
          const socioP = patrocinador ?? await resolverSocioDelProspecto(supabase, existingProspect?.constructor_id);
          const socioNombre = socioP?.nombre?.split(/\s+/).slice(0, 2).join(' ') || 'el equipo de creatuactivo.com';
          respuestaPareja = `Claro. Le aviso a ${socioNombre} que lo están conversando, y cuando quieran retomarlo me escribe por aquí.`;
          plazoParaAviso = 'sin fecha';
        }
      } else if (botOfrecioEnlace(_ultimoBotPareja)) {
        if (aceptaEnlace(messageText)) {
          const socioP = patrocinador ?? await resolverSocioDelProspecto(supabase, existingProspect?.constructor_id);
          const slugP = await slugDelSocio(supabase, socioP?.constructorId);
          respuestaPareja = textoEntregaEnlace(enlaceParaPareja(slugP, contactName));
        } else if (/(?<![a-záéíóúñ])(no|todav[ií]a|a[uú]n|despu[eé]s|luego|yo le aviso|mejor no)(?![a-záéíóúñ])/i.test(messageText)) {
          respuestaPareja = textoSinEnlace();
          plazoParaAviso = 'sin enlace, sin fecha';
        }
      } else if (detectarConsultaConPareja(messageText)) {
        respuestaPareja = textoOfrecerEnlace();
      }

      if (respuestaPareja) {
        await sendWhatsAppMessage(phoneNumber, respuestaPareja, { wamid });
        await persistirTurnoDictado(supabase, waFingerprint, messageText, respuestaPareja);
        if (plazoParaAviso) {
          const socioP = patrocinador ?? await resolverSocioDelProspecto(supabase, existingProspect?.constructor_id);
          await avisarAlSocioPareja({ nombreProspecto: contactName, whatsapp: phoneNumber, plazo: plazoParaAviso, nombreSocio: socioP?.nombre });
        }
        console.log(`💑 [WA Webhook] Nodo pareja atendido para ${phoneNumber}${plazoParaAviso ? ` (plazo: ${plazoParaAviso})` : ''} — turno cerrado sin motor`);
        return;
      }
    }

    // ─── 2.24 Enlace al catálogo ──────────────────────────────────────────────
    // La URL de la página de productos es determinística (el slug del socio +
    // /productos), así que la emite el webhook y no el modelo. En la prueba del
    // 22 ago el motor primero dijo que no tenía el enlace y después lo armó por
    // su cuenta; acertó, pero un slug distinto habría caído en la mini-landing.
    // El «sí» al cierre de las respuestas de salud («¿le muestro el catálogo
    // completo?») entra por aquí: el enlace lo emite el backend con el ref del socio.
    const _ultimoBotCatalogo = [...historial].reverse().find((m) => m.role === 'assistant')?.content || '';
    const _aceptaCatalogoSalud = RE_OFERTA_CATALOGO_SALUD.test(_ultimoBotCatalogo) && esAceptacion(messageText);
    if (pideEnlaceCatalogo(messageText) || _aceptaCatalogoSalud) {
      let slugCatalogo: string | null = socioQueEscribe?.slug ?? null;
      const refSocio = patrocinador?.constructorId ?? existingProspect?.device_info?.invited_by ?? null;
      if (!slugCatalogo && refSocio) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: fila } = await (supabase as any)
          .from('constructor_slugs').select('slug').eq('constructor_id', refSocio).maybeSingle();
        slugCatalogo = fila?.slug ?? null;
      }
      const textoEnlace = mensajeEnlaceCatalogo(slugCatalogo);
      await pisoDeEscritura();
      const enviado = await sendText(phoneNumber, textoEnlace);
      if (enviado.ok) {
        await persistirTurnoDictado(supabase, waFingerprint, messageText, textoEnlace);
        console.log(`🔗 [WA Webhook] Enlace al catálogo entregado (${slugCatalogo ?? 'sin socio'}) — turno cerrado sin motor`);
        return;
      }
      console.warn(`⚠️ [WA Webhook] Enlace al catálogo no se pudo enviar: ${enviado.error}`);
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

    // ─── 2.25a La foto de una LÍNEA o del portafolio ─────────────────────────
    // Tres formas de pedirla: nombrándola con palabra de imagen ("muéstreme las
    // bebidas", "foto de todos los productos"), aceptando la oferta con la que
    // el bot cerró el turno anterior ("¿le muestro las demás bebidas?" → "sí"),
    // o nombrando una línea cuando el pie del portafolio preguntó cuál acercar.
    // Va ANTES que la foto de producto: "las cápsulas" en plural es la línea;
    // "las cápsulas de ganoderma" es el producto, y el patrón lo distingue.
    const _ultimoBotFoto = [...historial].reverse().find((m) => m.role === 'assistant')?.content || '';
    const _familiaAceptada = familiaOfrecida(_ultimoBotFoto);
    const familia = (_familiaAceptada && esAceptacionCorta(messageText)) ? _familiaAceptada
      : (preguntoCualLinea(_ultimoBotFoto) && detectarFamilia(messageText)) ? detectarFamilia(messageText)
      : (pideImagen(messageText) && !detectarProducto(messageText)) ? detectarFamilia(messageText)
      : null;
    if (familia) {
      const vieneDeOferta = familia === _familiaAceptada || preguntoCualLinea(_ultimoBotFoto);
      const soloFoto = vieneDeOferta || esSoloPedidoDeImagen(messageText);
      const pie = pieDeFotoFamilia(familia, soloFoto ? FAMILIAS_WA[familia].seguimiento : undefined);
      await pisoDeEscritura();
      const enviada = await sendImage(phoneNumber, urlImagenFamilia(familia), pie);
      if (enviada.ok) {
        fotoEnviada = FAMILIAS_WA[familia].titulo;
        console.log(`📷 [WA Webhook] Foto de la familia ${familia} enviada a ${phoneNumber}`);
        if (soloFoto) {
          await persistirTurnoDictado(supabase, waFingerprint, messageText, pie);
          console.log('📷 [WA Webhook] Turno cerrado sin motor');
          return;
        }
      } else {
        console.warn(`⚠️ [WA Webhook] Foto de la familia ${familia} no se pudo enviar: ${enviada.error}`);
      }
    }

    // ─── 2.25b La foto de UN producto ────────────────────────────────────────
    // El «sí» a «¿le muestro la foto?» (cierre del seguimiento de salud) es la
    // foto del producto que ese mismo turno nombró.
    const _fotoOfrecida = RE_OFERTA_FOTO_PRODUCTO.test(_ultimoBotFoto) && esAceptacionCorta(messageText);
    if (!familia && (pideImagen(messageText) || _fotoOfrecida)) {
      // "dame una imagen" a secas es la forma normal de pedirla cuando ya se
      // venía hablando de un producto: si el mensaje no lo nombra, se toma del
      // hilo (prueba del 20 ago — caía al motor y respondía que no podía).
      const producto = _fotoOfrecida
        ? detectarProducto(_ultimoBotFoto)
        : (detectarProducto(messageText) ?? productoDelHilo(historial));
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

    // ─── 2.29 ¿Ya radicó? — lo consumen el simulador, el cierre y el motor ────
    // Hasta el 27 ago 2026 esto se miraba solo en el cierre (2.5): el simulador
    // le preguntó a Liliana con cuál paquete arrancaba dos minutos después de que
    // radicara el ESP-1, y el motor, ante un «Perfecto», volvió a pedirle los
    // cuatro datos. La radicación es un estado de la conversación, y todos los
    // nodos que hablan después la tienen que conocer.
    const socio = patrocinador ?? await resolverSocioDelProspecto(supabase, existingProspect?.constructor_id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: filaRadicacion } = await (supabase as any)
      .from('pending_activations')
      .select('id, plan_type')
      .eq('fingerprint_id', waFingerprint)
      .maybeSingle();
    // `plan_type` habla el vocabulario del Dashboard (inicial / estrategico /
    // visionario); aquí se traduce al código ESP, que es el que entiende todo lo demás.
    const radicacionPrevia: { paquete: string } | null = filaRadicacion
      ? {
          paquete: /vision/i.test(filaRadicacion.plan_type ?? '') ? 'ESP-3'
            : /estrat|empres/i.test(filaRadicacion.plan_type ?? '') ? 'ESP-2'
            : 'ESP-1',
        }
      : null;
    if (radicacionPrevia) console.log(`📌 [WA Webhook] ${waFingerprint} ya radicó (${radicacionPrevia.paquete})`);

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
        // Ya radicó: el cierre vuelve sobre SU paquete, no sobre la elección
        // (Liliana, 27 ago 2026: eligió ESP-1 y el simulador le preguntó con cuál).
        radicado: radicacionPrevia
          ? {
              paquete: radicacionPrevia.paquete,
              socio:   socio?.nombre?.split(/\s+/).slice(0, 2).join(' '),
              composicionVista: historial.some((m) =>
                m.role === 'assistant'
                && new RegExp(`${radicacionPrevia.paquete}[^\\n]{0,30}le activa inmediatamente este inventario`, 'i').test(m.content)),
            }
          : undefined,
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
      // La pantalla inicial hereda de la oferta que la persona aceptó: tras el
      // Kit, la renta al 10%; tras el ejemplo GEN5, los paquetes; tras el de
      // renta, la renta. Solo sin pista abre en el menú.
      const _pantalla = /tarifa del Kit/i.test(_ultimoBotW) ? 'RENTA_DIEZ'
        : /Generaci[oó]n 1|paquetes? ESP-[123]\*? comprados?|Bono GEN5/i.test(_ultimoBotW) ? 'GEN_MENU'
        : /renta estar[ií]a|clientes en cada centro|supuesto modesto/i.test(_ultimoBotW) ? 'RENTA_MENU'
        : 'INICIO';
      const reenvio = await sendFlow(
        phoneNumber,
        flowSimuladorId,
        'Aquí lo tiene de nuevo. Arme el escenario que quiera ver.',
        'Abrir el simulador',
        { screen: _pantalla },
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

    // ─── 2.44 El «sí» tras las respuestas de salud — dictado ─────────────────
    // Tras el peso («¿le cuento cómo integrarlo en su rutina?») y el azúcar
    // («¿le cuento cómo es cada uno?») el «sí» tiene un solo destino; el 29 ago
    // el modelo lo compuso con un Clásico a $82.500. Los datos salen de la tabla.
    {
      const _ultimoBotSalud = [...historial].reverse().find((m) => m.role === 'assistant')?.content ?? '';
      const seguimiento = socioQueEscribe ? null : seguimientoSalud(_ultimoBotSalud, messageText);
      if (seguimiento) {
        await sendWhatsAppMessage(phoneNumber, seguimiento, { wamid });
        await persistirTurnoDictado(supabase, waFingerprint, messageText, seguimiento);
        console.log('🥗 [WA Webhook] Seguimiento de salud dictado (datos de la tabla)');
        return;
      }
    }

    // ─── 2.45 Toma de pedido — Queswa como mano derecha del distribuidor ──────
    // Quien quiere comprar PRODUCTO (no un paquete) no va a una oficina ni a una
    // línea nacional: se le carga la compra y se le remite al socio que la
    // refirió, que coordina pago y entrega en persona. Nació de Milena (27 ago
    // 2026): quiso una caja, el modelo le improvisó un formulario, ese texto
    // activó el trámite del PAQUETE y salió sin comprar. Va ANTES del cierre
    // (2.5) a propósito: mientras hay un pedido abierto, el trámite del paquete
    // no se activa. Todo lo de aquí vive en src/lib/wa-pedido.ts.
    const _ultimoBotPedido = [...historial].reverse().find((m) => m.role === 'assistant')?.content ?? '';
    const _nombrePedido = nombreCorto(contactName);
    // Nombre y primer apellido, como en la radicación: «Luis Cabrejo», no la
    // cédula completa («Luis Cabrejo Parra» sonaba a documento, prueba del 29 ago).
    const _socioPedido = socio
      ? { nombre: socio.nombre?.split(/\s+/).slice(0, 2).join(' '), whatsapp: socio.whatsapp, constructorId: socio.constructorId,
          slug: await slugDelSocio(supabase, socio.constructorId) }
      : null;
    // El «sí» a «¿Le abro el pedido con el que queda su código activo?» (cierre
    // de la respuesta de sede) entra al pedido pidiendo los productos.
    const _aceptaPedidoSede = RE_OFERTA_PEDIDO_SEDE.test(_ultimoBotPedido) && esAceptacion(messageText);
    const _enPedido = !socioQueEscribe && (pedidoAbierto(_ultimoBotPedido) || _aceptaPedidoSede);
    const _hayPedido = !socioQueEscribe && pedidoCargado(historial);

    // «¿Dónde queda la oficina para comprar una caja?» pregunta por la SEDE: el
    // verbo de compra no abre el pedido si el mensaje pregunta por la oficina o la
    // dirección — eso lo atiende 2.48, cuya respuesta ya trae la puerta de compra
    // (prueba del 29 ago 15:00: abrió el pedido y a «la dirección en Bogotá» le
    // contestó «no logré identificar el producto»).
    const _preguntaSede = !socioQueEscribe && detectarPreguntaOficina(messageText);
    if (!socioQueEscribe && !_preguntaSede && (_enPedido || detectarIntencionCompra(messageText))) {
      // «¿Cuál prefiere?» → la variante elegida es el pedido entero.
      const variante = RE_PREGUNTO_CUAL_GANOCAFE.test(_ultimoBotPedido) ? leerVarianteGanocafe(messageText) : null;
      // «Gano Café» a secas es una familia (3 en 1 · Clásico): se pregunta cuál,
      // en vez de adivinar — el 29 ago se cargó un té por adivinar desde el hilo.
      if (!variante && esGanocafeSinVariante(messageText)) {
        const texto = preguntarCualGanocafe();
        await sendWhatsAppMessage(phoneNumber, texto, { wamid });
        await persistirTurnoDictado(supabase, waFingerprint, messageText, texto);
        console.log('🛒 [WA Webhook] Ganocafé sin variante — se pregunta cuál');
        return;
      }
      const lineas = variante ? [{ producto: variante, cantidad: 1 }] : lineasDelPedido(messageText, historial);

      if (lineas.length > 0) {
        const id = await registrarPedido(supabase, {
          fingerprint: waFingerprint, whatsapp: phoneNumber, nombre: _nombrePedido, lineas, socio: _socioPedido,
        });
        await avisarPedido(lineas, phoneNumber, _nombrePedido, _socioPedido);
        const texto = confirmarPedido(lineas, _socioPedido, _nombrePedido);
        await sendWhatsAppMessage(phoneNumber, texto, { wamid });
        await persistirTurnoDictado(supabase, waFingerprint, messageText, texto);
        console.log(`🛒 [WA Webhook] Pedido cargado (${id ?? 'sin registro'}) — ${lineas.length} línea(s) — turno cerrado sin motor`);
        return;
      }

      // Sin producto reconocible: la primera vez se pregunta; si ya se estaba
      // pidiendo y sigue sin nombrarlo, se le ayuda con ejemplos. Una pregunta
      // a mitad del pedido («¿y cuánto vale?») sigue al motor con el pedido abierto.
      const _esPreguntaPedido = /\?|cu[aá]nto|qu[eé]|c[oó]mo|cu[aá]l/i.test(messageText);
      if (!_enPedido || !_esPreguntaPedido) {
        const texto = _enPedido ? noEntendiProductos() : pedirProductos(_nombrePedido);
        await sendWhatsAppMessage(phoneNumber, texto, { wamid });
        await persistirTurnoDictado(supabase, waFingerprint, messageText, texto);
        console.log('🛒 [WA Webhook] Pedido abierto — esperando los productos');
        return;
      }
    }

    // ─── 2.46 «Quiero hablar con una persona» — el socio se entera de verdad ──
    // Hasta hoy el modelo escribía «le aviso al socio» y no pasaba nada.
    if (!socioQueEscribe && detectarPidePersona(messageText)) {
      const _ultimoUsuario = [...historial].reverse().find((m) => m.role === 'user')?.content ?? '';
      await avisarPidePersona(phoneNumber, _nombrePedido, _socioPedido, _ultimoUsuario);
      const texto = respuestaPersona(_socioPedido);
      await sendWhatsAppMessage(phoneNumber, texto, { wamid });
      await persistirTurnoDictado(supabase, waFingerprint, messageText, texto);
      console.log('🙋 [WA Webhook] Pidió una persona — socio y equipo avisados');
      return;
    }

    // ─── 2.47 El envío — lo coordina con el socio, por su nombre ──────────────
    if (!socioQueEscribe && detectarPreguntaEnvio(messageText) && !detectarPreguntaOficina(messageText)) {
      const texto = respuestaEnvio(_socioPedido);
      await sendWhatsAppMessage(phoneNumber, texto, { wamid });
      await persistirTurnoDictado(supabase, waFingerprint, messageText, texto);
      console.log('📦 [WA Webhook] Pregunta de envío — dictada');
      return;
    }

    // ─── 2.48 Las sedes, para el prospecto ───────────────────────────────────
    // Las direcciones son información de socio (Director, 27 ago 2026): las
    // sedes atienden a quien ya tiene código, y a quien llega con una dirección
    // lo afilia cualquiera. Al prospecto: la razón real y la puerta (su código lo
    // abre el socio). Si insiste, una línea. Las ciudades siguen en FREQ_13.
    if (!socioQueEscribe && detectarPreguntaOficina(messageText)) {
      const insiste = RE_OFICINA_YA_EXPLICADA.test(_ultimoBotPedido);
      const ciudad = detectarCiudad(messageText)
        ?? [...historial].reverse().map((m) => detectarCiudad(m.content)).find(Boolean)
        ?? null;
      const texto = respuestaOficinaProspecto(_socioPedido, ciudad, _hayPedido, insiste, diceDondeVive(messageText));
      await sendWhatsAppMessage(phoneNumber, texto, { wamid });
      await persistirTurnoDictado(supabase, waFingerprint, messageText, texto);
      console.log(`🏢 [WA Webhook] Preguntó por la sede (${ciudad ?? 'sin ciudad'}${insiste ? ', insiste' : ''}) — dictada`);
      return;
    }

    // ─── 2.49 Autorización de marketing — su propio turno, una sola pregunta ──
    // Solo a quien ya cargó un pedido, cuando cierra la conversación, y una vez.
    // El «sí» queda con fecha en la ficha (`marketing_optin`): es lo que
    // responde ante Meta o la SIC con qué autorización se le escribió.
    if (_hayPedido && !socioQueEscribe) {
      if (RE_OFRECIO_OPTIN.test(_ultimoBotPedido)) {
        const acepta = leerRespuestaOptin(messageText);
        if (acepta !== null) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any).rpc('update_prospect_data', {
              p_fingerprint_id: waFingerprint,
              p_data: {
                marketing_optin: acepta,
                marketing_optin_at: new Date().toISOString(),
                marketing_optin_canal: 'whatsapp',
              },
              p_constructor_id: patrocinador?.userId ?? existingProspect?.constructor_id ?? null,
            });
          } catch (err) { console.error('⚠️ [WA Webhook] No se pudo guardar el opt-in:', err); }
          const texto = respuestaOptin(acepta);
          await sendWhatsAppMessage(phoneNumber, texto, { wamid });
          await persistirTurnoDictado(supabase, waFingerprint, messageText, texto);
          console.log(`📣 [WA Webhook] Opt-in de marketing: ${acepta ? 'SÍ' : 'no'}`);
          return;
        }
      } else if (esCierreDeConversacion(messageText) && !optinYaOfrecido(historial)) {
        const texto = ofrecerOptin(_nombrePedido);
        await sendWhatsAppMessage(phoneNumber, texto, { wamid });
        await persistirTurnoDictado(supabase, waFingerprint, messageText, texto);
        console.log('📣 [WA Webhook] Opt-in de marketing ofrecido');
        return;
      }
    }

    // ─── 2.5 Cierre: radicar la vinculación ───────────────────────────────────
    // Nodo determinístico, como la apertura. El motor no puede atenderlo: su
    // máquina de estados fue escrita para la web y remata ofreciendo dos enlaces
    // wa.me al número del WABA — a alguien que está escribiendo desde adentro de
    // esa misma conversación. Aquí se piden los cuatro datos que
    // /api/pre-afiliacion exige y se deja el registro hecho.
    // `socio` y `radicacionPrevia` se resuelven antes del simulador (2.3), que
    // también los necesita. Con un pedido de producto abierto o recién cargado,
    // el trámite del PAQUETE no se evalúa: «solo quiero una caja» no es una
    // respuesta al formulario de vinculación (Milena, 27 ago 2026).
    const _pedidoEnCurso = _enPedido || RE_PEDIDO_CARGADO.test(_ultimoBotPedido);
    const cierre = _pedidoEnCurso ? null : await gestionarCierre({
      mensajeActual:  messageText,
      historial,
      whatsapp:       phoneNumber,
      fingerprintId:  waFingerprint,
      socio:          socio?.nombre?.split(/\s+/).slice(0, 2).join(' '),
      constructorId:  socio?.constructorId,
      yaRadicadoEnBD: !!radicacionPrevia,
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
    // `/productos/{constructor_id}` y atribuye por el path.
    //
    // ⚠️ Esto NO contradice la decisión de no sacar a la persona del canal: esa
    // página lleva el orbe de Queswa, así que la conversación continúa allá.
    const _pideCatalogo = /(cat[aá]logo)|d[oó]nde[^.?]{0,25}(ver|veo|encuentro|consulto|miro)[^.?]{0,25}productos|ver (todos )?los productos/i.test(messageText)
      && !/paquete|esp[\s-]?[123]/i.test(messageText);
    if (_pideCatalogo && socio?.constructorId) {
      const slug = await slugDelSocio(supabase, socio.constructorId);
      const url = slug
        ? `https://creatuactivo.com/${slug}/productos`
        : `https://creatuactivo.com/productos/${encodeURIComponent(socio.constructorId)}`;
      const texto = `Con gusto. Aquí está el catálogo completo, con fotos, presentaciones y precios:

${url}

Si algo le llama la atención mientras mira, me escribe por aquí — o toca el botón de Queswa en la misma página y seguimos allá.

¿Le cuento cuál es el que más piden?`;
      await sendWhatsAppMessage(phoneNumber, texto, { wamid });
      await persistirTurnoDictado(supabase, waFingerprint, messageText, texto);
      console.log(`🔗 [WA Webhook] Catálogo dictado: ${url}`);
      return;
    }

    // ─── 2.75 LA LISTA DEL SOCIO — guardar, avanzar, resumir ─────────────────
    // Estas tres son OPERACIONES, no conversación: tienen una sola respuesta
    // correcta y el modelo solo puede empeorarlas (ya inventó un «[Nombre]» entre
    // corchetes en una redacción). Van dictadas. Lo único que le queda al modelo
    // es REDACTAR, que es lo que sí exige juicio.
    //
    // ⚠️ SOLO para el socio. Un prospecto que escriba tres nombres no está
    // armando una lista de prospección.
    if (socioQueEscribe) {
      const _fpSocio = waFingerprint;

      // (a) No sabe por dónde empezar → la pregunta del café.
      if (pideAyudaParaEmpezar(messageText ?? '')) {
        await sendWhatsAppMessage(phoneNumber, preguntaDelCafe(), { wamid });
        console.log(`☕ [WA Lista] Pregunta del café a ${_fpSocio}`);
        return;
      }

      // (b) Dictó una lista de nombres → se guarda y se arranca por el primero.
      if (pareceListaDeNombres(messageText ?? '')) {
        const nombres = extraerNombres(messageText ?? '');
        const n = await guardarLista(supabase, _fpSocio, nombres, socioQueEscribe.constructorId);
        if (n > 0) {
          const primero = await siguienteContacto(supabase, _fpSocio);
          await sendWhatsAppMessage(
            phoneNumber,
            listaGuardada(nombres, primero?.nombre ?? nombres[0]),
            { wamid },
          );
          return;
        }
      }

      // (c) Dice que ya lo mandó → se marca y sigue el próximo.
      if (diceQueYaEnvio(messageText ?? '')) {
        const actual = await siguienteContacto(supabase, _fpSocio);
        if (actual) {
          await marcarEnviado(supabase, actual.id);
          const proximo = await siguienteContacto(supabase, _fpSocio);
          const r = await resumenLista(supabase, _fpSocio);
          await sendWhatsAppMessage(
            phoneNumber,
            proximo
              ? siguienteDeLaLista(actual.nombre, proximo.nombre, r.pendientes)
              : listaTerminada(r.total),
            { wamid },
          );
          return;
        }
      }

      // (d) Pregunta cómo va su lista.
      if (preguntaPorLaLista(messageText ?? '')) {
        const r = await resumenLista(supabase, _fpSocio);
        await sendWhatsAppMessage(phoneNumber, resumenParaElSocio(r), { wamid });
        return;
      }
    }

    // ─── 2.8 AMBIVALENCIA — la duda que no es una pregunta ───────────────────
    // Va DESPUÉS de los nodos que atienden peticiones explícitas (catálogo, foto,
    // simulador, cierre): quien pide algo concreto quiere eso, no que le hablen de
    // sus dudas. Y va ANTES del motor porque no dicta texto — dicta CÓMO responder.
    //
    // Por qué existe: el metaanálisis del modelo causal de la Entrevista
    // Motivacional mide que el discurso de resistencia predice el mal resultado
    // (r = −.24) mientras el discurso de cambio no predice el bueno (r = .06). El
    // entusiasmo no informa; la duda sí. Y rebatirla la AUMENTA. Hoy el motor
    // respondía igual «¿yo tendría que vender?» (pregunta, la responde el arsenal)
    // que «yo no sirvo para vender» (duda, y el argumento la refuerza).
    //
    // ⚠️ NO aplica al SOCIO: él ya compró, y sus dudas son operativas, no de
    // decisión. Ni a quien escribe por primera vez, que primero merece la apertura.
    //
    // Fundamento → docs/investigaciones/resultados/CIENCIA_CONDUCTUAL_SEGUIMIENTO_Y_ACUERDO_AGO2026.md
    const _ultimoBot = [...historial].reverse().find((m) => m.role === 'assistant')?.content ?? '';
    let ambivalencia: string | null = null;

    if (!socioQueEscribe && existingProspect && !fotoEnviada) {
      // ── El acuerdo: la respuesta al ÚLTIMO peldaño se guarda ────────────────
      // Aquí la persona acaba de decir cuándo quiere que le escriban. Es la única
      // respuesta de toda la escalera que hay que PERSISTIR: sin esto la pregunta
      // «¿a qué hora le queda bien?» es una promesa que nadie va a cumplir, y
      // prometer algo que no ocurre es peor que no prometer.
      //
      // ⚠️ Se guarda ANTES de responderle. Si se hiciera después y el turno
      // fallara a mitad, ella habría dado su hora y el sistema la habría perdido.
      if (botPidioHora(_ultimoBot)) {
        const momento = await extraerMomento(messageText ?? '', new Date(), _ultimoBot);
        if (momento) {
          await guardarAcuerdo(supabase, {
            fingerprintId:  waFingerprint,
            telefono:       phoneNumber,
            que:            momento.que,
            cuando:         momento.cuando,
            nombre:         contactName ?? null,
            constructorId:  existingProspect?.constructor_id ?? patrocinador?.userId ?? null,
          });
        } else {
          console.log('🤝 [WA Webhook] El peldaño de la hora no devolvió fecha — se sigue sin acuerdo');
        }
      }

      const _peldano = peldanoDeEscalera(_ultimoBot);
      if (_peldano) {
        // Vamos a mitad de la escalera del aplazamiento: el peldaño lo dice el
        // último mensaje del bot, no un estado guardado — igual que todo el canal.
        const _n = extraerCalificacion(messageText ?? '');
        ambivalencia = _n !== null ? `whatsapp_amb_${_peldano}_${_n}` : `whatsapp_amb_${_peldano}`;
      } else if (botEvoco(_ultimoBot)) {
        // Acaba de responder «si usted arrancara, ¿por qué lo haría?». Lo que dijo
        // son SUS razones, y el paso que se le ofrece depende de si ya vio el plan.
        ambivalencia = esMotivoDeDinero(messageText ?? '') && yaVioLasFormasDeGanar(historial)
          ? 'whatsapp_amb_motivo_visto'
          : 'whatsapp_amb_motivo_nuevo';
      } else if (_ultimoBot.includes('le parece bien que se lo comparta')) {
        // Respondió a la oferta de la puerta. Un sí la guarda; un no se respeta y
        // no se vuelve a ofrecer — la frase prometía justamente no insistir.
        if (aceptaPuerta(messageText ?? '')) {
          await guardarPuertaAbierta(supabase, {
            fingerprintId: waFingerprint,
            telefono:      phoneNumber,
            constructorId: existingProspect?.constructor_id ?? patrocinador?.userId ?? null,
          });
        }
      } else if (esNoExplicito(messageText ?? '')) {
        // ── El «no», en DOS TIEMPOS ──────────────────────────────────────────
        // El primero recibe la pregunta que todavía puede mover algo; solo el
        // segundo recibe la puerta. Ofrecerla de una desperdicia el primer tiempo,
        // y repetir la pregunta después del segundo es insistir — que es lo que la
        // frase de la puerta promete no hacer.
        ambivalencia = yaSeEvoco(historial) ? 'whatsapp_amb_puerta' : 'whatsapp_amb_no_primero';
      } else if (esConsultaConPareja(messageText ?? '')) {
        ambivalencia = 'whatsapp_amb_pareja';
      } else {
        const _senal = detectarAmbivalencia(messageText ?? '');
        if (_senal === 'duda_propia')  ambivalencia = 'whatsapp_amb_duda';
        if (_senal === 'aplazamiento') ambivalencia = 'whatsapp_amb_escala';
      }
      if (ambivalencia) console.log(`🫱 [WA Webhook] Ambivalencia: ${ambivalencia}`);
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
      : ambivalencia
      ? ambivalencia
      // Ya radicó: el motor no lo sabía y ante un «Perfecto» volvió a pedir los
      // cuatro datos copiando el bloque espejo del prompt (Liliana, 27 ago 2026).
      // Va después de la ambivalencia a propósito: un «lo consulto con mi esposa»
      // tras radicar sigue siendo el nodo de pareja.
      : radicacionPrevia
      ? `whatsapp_radicado_${radicacionPrevia.paquete.toLowerCase().replace('-', '')}`
      // Ya cargó un pedido de producto: el motor lo atiende como cliente del socio.
      : _hayPedido
      ? 'whatsapp_comprador'
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

      // La respuesta del Kit (INV_00) ofrece «su propio escenario en el simulador
      // con la tarifa del Kit»: el Flow va directo a la pantalla de renta al 10%.
      // Sin esto caía en el caso del GEN5 —el texto nombra el Bono GEN5 con
      // cifras— y abría en la pantalla de paquetes (prueba del Director, 29 ago).
      // También cuando la respuesta es del Kit aunque no traiga la oferta literal
      // (el modelo compuso su propia versión el 29 ago): Kit + su precio.
      const _ofreceKit = /escenario en el simulador con la tarifa del Kit/i.test(queswaReply)
        || (/Kit de Inicio/i.test(queswaReply) && /443[.,]?600/.test(queswaReply));
      if (flowSimulador && _ofreceKit) {
        const enviado = await sendFlow(
          phoneNumber,
          flowSimulador,
          'Aquí lo tiene con la tarifa del Kit: elija cuántos clientes y el resultado sale al instante.',
          'Abrir el simulador',
          { screen: 'RENTA_DIEZ' },
        );
        if (enviado.ok) console.log('🧮 [WA Webhook] Simulador ofrecido con la tarifa del Kit (RENTA_DIEZ)');
        else console.warn(`⚠️ [WA Webhook] Flow del Kit no se pudo enviar: ${enviado.error}`);
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
      if (flowSimulador && _explicaBinario && !_explicaGen5 && !dictoEjemplo && !_ofreceNumeros && !_ofreceKit) {
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
      if (flowSimulador && _explicaGen5 && !dictoEjemplo && !_ofreceNumeros && !_ofreceKit) {
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
    // de la función lo fija `maxDuration`: pasado eso Vercel la mata y la
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
// `detectarModeloInventado` vive en wa-guardarrail-negocio.ts desde el 27 ago
// 2026, para que la batería lo cubra (bloqueó «NO es un costo de membresía»).

/**
 * Persiste un turno dictado por el webhook (guardarraíl de salud, emergencia).
 * Mismo patrón que la apertura y las respuestas de botón: sin esto el motor
 * reconstruye el hilo sin el rechazo y el turno siguiente pierde el contexto de
 * que la pregunta de salud ya fue derivada.
 */
/**
 * Anota lo que el mensaje trae ADEMÁS de la intención que lo va a atender: la
 * selección de paquete y la ciudad. Best-effort — si falla, el turno sigue.
 *
 * Solo escribe lo que encuentra, y nunca pisa con vacío: `update_prospect_data`
 * mergea, así que un mensaje sin paquete no borra el paquete anterior.
 */
const RE_PAQUETE_ELEGIDO = /(?<![a-z])(esp[\s-]?([123])|visionario|empresarial|inicial|kit de inicio)(?![a-z])/i;

async function capturarContextoDelMensaje(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  fingerprint: string,
  texto: string,
  constructorId: string | null,
): Promise<void> {
  const datos: Record<string, string> = {};

  const mp = RE_PAQUETE_ELEGIDO.exec(texto);
  if (mp) {
    const t = mp[0].toLowerCase();
    datos.package = /kit/.test(t) ? 'KIT'
      : /visionario/.test(t) || mp[2] === '3' ? 'ESP-3'
      : /empresarial/.test(t) || mp[2] === '2' ? 'ESP-2'
      : 'ESP-1';
  }
  const ciudad = detectarCiudad(texto);
  if (ciudad) datos.ciudad = ciudad;

  if (Object.keys(datos).length === 0) return;
  try {
    await supabase.rpc('update_prospect_data', {
      p_fingerprint_id: fingerprint,
      p_data: datos,
      p_constructor_id: constructorId,
    });
    console.log(`📎 [WA Webhook] Capturado del mensaje: ${JSON.stringify(datos)}`);
  } catch (err) {
    console.error('⚠️ [WA Webhook] No se pudo capturar el contexto del mensaje:', err);
  }
}

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
        if (m?.role === 'assistant' && typeof m.content === 'string' && esRechazoSaludComun(m.content)) {
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
  // 12 = Colombia (57 + 10); 11 = EE. UU./Canadá (1 + 10). Hasta el 22 ago 2026 aquí
  // se exigían 12 y un socio de EE. UU. moría con «el número no parece completo».
  if (!whatsapp || whatsapp.length < 11) return { ok: false, error: 'el número no parece completo' };

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

