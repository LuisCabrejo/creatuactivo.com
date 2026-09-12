/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Onboarding del dueño de canal por WhatsApp — v1 (17 ago 2026)
 *
 * Objetivo: quien acaba de pagar recibe su enlace **en la misma conversación**,
 * sin instalar nada ni abrir la aplicación, y ve llegar en vivo la actividad de
 * sus primeros prospectos. Ese momento —ver a un conocido interesado— es el que
 * convierte: doce años de campo del Director muestran que quien lo vive arranca.
 *
 * ⚠️ POR QUÉ ESTO NO NECESITA PLANTILLAS DE META (y por qué eso tiene fecha de
 * vencimiento): Meta solo exige plantilla aprobada para escribirle a alguien
 * FUERA de la ventana de servicio de 24 h. El dueño nuevo acaba de conversar con
 * Queswa para radicarse, así que la ventana está abierta y el texto sale libre.
 * Cada mensaje que ÉL escribe la reabre otras 24 h; los nuestros no. Por eso
 * `dentroDeVentana()` se consulta SIEMPRE antes de enviar y, si está cerrada, no
 * se envía nada: no se encola, no se fuerza plantilla, no se insiste. Un envío
 * fuera de ventana es un error de política que se paga con la calidad del número.
 *
 * ⚠️ CUÁNTO SE AVISA, Y POR QUÉ NO SE APRIETA MÁS: un aviso por hito distinto de
 * cada prospecto —llegó, vio el video, está escribiendo, volvió— y ninguno
 * repetido. No hay cupo numérico, porque contar mensajes tenía un defecto que
 * solo aparece al ordenarlos en el tiempo: los primeros en ocurrir son los de
 * menos valor y se comían la cuota, dejando al dueño sin el aviso de que alguien
 * está escribiendo, que es la señal de compra.
 *
 * Tampoco hay razón de costo para apretar: dentro de la ventana estos mensajes
 * son gratis (Meta liberó las conversaciones de servicio en nov 2024) y **no
 * consumen el límite de mensajería del número**, que solo cuenta lo enviado FUERA
 * de ventana. Lo único que se cuida es que el dueño no silencie el número — y
 * cuatro avisos con información distinta cada uno no cansan: son la historia de
 * un conocido acercándose, contada en vivo.
 */

import { sendText } from '@/lib/wa-channel';
import { normalizarParaSlug } from '@/lib/texto-normalizar';

/**
 * Cada hito se avisa UNA vez por prospecto — no hay cupo numérico.
 *
 * El tope por cantidad tenía un defecto que solo se ve al ordenar los eventos en
 * el tiempo: como los primeros en ocurrir son los de menos valor (abrió, vio el
 * video), se comían el cupo y el dueño se quedaba **sin el aviso de que alguien
 * está escribiendo**, que es la señal de compra. Contar hitos distintos en vez de
 * mensajes resuelve las dos cosas a la vez: nada se repite y nada importante se
 * pierde.
 *
 * Y no hay razón para apretar más: dentro de la ventana de 24 h estos mensajes no
 * cuestan (Meta liberó las conversaciones de servicio en nov 2024) y **no consumen
 * el límite de mensajería**, que solo cuenta lo que se envía FUERA de ventana. Lo
 * único que se cuida es que el dueño no silencie el número, y cuatro avisos con
 * información distinta cada uno no cansan a nadie: son la historia de un conocido
 * acercándose, contada en vivo.
 *
 * `MAX_NOTIF_WA` queda solo como freno de mano contra un caso desbocado.
 */
export const MAX_NOTIF_WA = 50;

const SITIO = process.env.NEXT_PUBLIC_SITE_URL || 'https://creatuactivo.com';

/**
 * Solo dígitos, con indicativo de país. `3001234567` → `573001234567`.
 *
 * ⚠️ Los ceros a la izquierda se descartan primero: varios números de socios los
 * arrastran desde la base (`03175857607`), y sin quitarlos la comparación falla
 * justo con las filas más viejas — el bug del "cero inicial" que ya está
 * documentado para estos teléfonos.
 */
export function normalizarWhatsApp(numero: string): string {
  const d = (numero || '').replace(/\D/g, '').replace(/^0+/, '');
  if (!d) return '';
  if (d.startsWith('57')) return d;
  if (d.length === 10) return `57${d}`;
  return d;
}

/**
 * Slug a partir del nombre: minúsculas, sin tildes, con guion. Dos palabras
 * bastan y se leen bien en la URL que la persona va a compartir por chat.
 *
 * "Diego Giraldo Restrepo" → "diego-giraldo". Con cuatro palabras o más —dos
 * nombres y dos apellidos, que es como vienen del back office— se toman el
 * primer nombre y el primer apellido: "Liliana Patricia Moreno Moreno" →
 * "liliana-moreno", no "liliana-patricia" (10 sep 2026).
 */
export function slugDesdeNombre(nombre: string): string {
  const palabras = normalizarParaSlug(nombre, true).split(/\s+/).filter(Boolean);
  const elegidas = palabras.length >= 4 ? [palabras[0], palabras[2]] : palabras.slice(0, 2);
  return elegidas.join('-').replace(/-+/g, '-') || 'socio';
}

/**
 * El primer slug libre a partir del nombre: `patricia-reyes`, y si ya existe,
 * `patricia-reyes2`… Dos personas con el mismo nombre no pueden pelearse la URL.
 * Lo usan el comando ACTIVAR y la asignación por defecto de `identificarSocio`.
 */
export async function slugLibre(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  nombre: string,
): Promise<string> {
  const base = slugDesdeNombre(nombre);
  let slug = base;
  for (let i = 2; i <= 20; i++) {
    const { data: ocupado } = await supabase
      .from('constructor_slugs').select('slug').eq('slug', slug).maybeSingle();
    if (!ocupado) break;
    slug = `${base}${i}`;
  }
  return slug;
}

/**
 * Le asigna slug a un socio que no lo tiene. Decisión del Director (10 sep 2026):
 * el slug se aplica por defecto, nadie tiene que reclamarlo.
 *
 * Hasta hoy el slug lo reclamaba cada socio en queswa.app, y el canal exigía
 * slug para reconocer a un socio («sin slug no es socio para este flujo»). El
 * resultado, medido el 10 sep: 8 de 18 socios activos sin slug, y dos de ellas
 * —Patricia Reyes, socia desde julio, y Liliana Moreno, desde noviembre—
 * atendidas como PROSPECTAS: a Patricia le explicaron el plan, le pidieron la
 * cédula para vincularla y quedó como prospecta caliente en un Dashboard ajeno.
 * Un saludo sin enlace habría sido un defecto; venderle el negocio a una socia
 * es un bochorno con su nombre encima.
 *
 * El perfil (foto, frase) se completa después desde el Centro de Mando, que
 * hace `upsert` por `constructor_id` sobre esta misma fila y puede cambiar el
 * slug si la persona quiere otro.
 */
export async function asignarSlugPorDefecto(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  socio: { constructor_id: string; name?: string | null; whatsapp?: string | null },
): Promise<string | null> {
  const nombre = (socio.name || '').trim() || socio.constructor_id;
  const slug = await slugLibre(supabase, nombre);
  const { error } = await supabase.from('constructor_slugs').insert({
    slug,
    display_name: nombre,
    whatsapp: socio.whatsapp || null,
    constructor_id: socio.constructor_id,
  });
  if (error) {
    console.error(`⚠️ [WA Onboarding] No pude asignar slug a ${socio.constructor_id}: ${error.message}`);
    return null;
  }
  console.log(`🔗 [WA Onboarding] Slug asignado por defecto: /${slug} → ${socio.constructor_id}`);
  return slug;
}

/**
 * El enlace que el dueño comparte.
 *
 * Es `/{slug}/queswa`, no un wa.me crudo, y no es por estética: esa ruta
 * **valida el slug contra la base antes de redirigir**. Un enlace mal escrito o
 * de alguien no registrado se detiene ahí; con el wa.me directo, el prospecto
 * escribiría igual, `resolverPatrocinador()` no encontraría a nadie y entraría
 * sin dueño — fuera del radar del socio, sin aviso y con el saludo genérico. Con
 * un socio pasa desapercibido; con diez es una fuga silenciosa.
 *
 * La ruta redirige a wa.me con el texto de referido ya escrito, así que el
 * prospecto ve igual el botón de WhatsApp para empezar a chatear: se conserva la
 * comodidad del enlace directo y se gana la validación.
 *
 * ⚠️ NO usar `${SITIO}/${slug}` a secas: esa página no existe y devuelve 404
 * (verificado en producción el 17 ago 2026).
 */
export function enlaceDeCanal(slug: string): string {
  return `${SITIO}/${slug}/queswa`;
}

/**
 * ¿Pide el enlace a la página de productos?
 *
 * "¿Tienes el enlace a la página de productos?" es un nodo determinístico: la
 * URL existe y se arma con el slug del socio. En la prueba del 22 ago el motor
 * primero dijo que no tenía ese enlace y al segundo intento lo improvisó desde
 * el slug — acertó, pero por suerte: ni el prompt ni el motor se lo dan, y con
 * otro slug habría caído en la mini-landing. Lo determinístico lo emite el backend.
 */
export function pideEnlaceCatalogo(texto: string): boolean {
  const t = texto.toLowerCase();
  // "Catálogo" a secas ya es la página: quien dice catálogo quiere mirarlo
  // completo y, si algo le gusta, comprarlo ahí — eso es el enlace con el ref
  // del socio, no una foto (decisión del Director, 22 ago 2026). La foto de
  // una línea o del portafolio se pide con "muéstreme / foto de las bebidas /
  // de todos los productos", y esa va por wa-productos.ts.
  if (/cat[aá]logo/.test(t)) return true;
  const medio  = /enlace|link|url|p[aá]gina|sitio|web\b|creatuactivo/.test(t);
  const objeto = /producto/.test(t);
  return medio && objeto;
}

/** URL del catálogo con el ref del socio; sin socio, el catálogo general. */
export function enlaceCatalogo(slug?: string | null): string {
  return slug ? `${SITIO}/${slug}/productos` : `${SITIO}/productos`;
}

export function mensajeEnlaceCatalogo(slug?: string | null): string {
  return [
    'Con gusto. Aquí está el catálogo completo, con fotos, presentaciones y precios:',
    '',
    enlaceCatalogo(slug),
    '',
    'Si algo le llama la atención mientras lo mira, me escribe por aquí y lo vemos.',
    '',
    '¿Le muestro las bebidas de la línea?',
  ].join('\n');
}

export function mensajeDeBienvenida(nombreCorto: string, slug: string): string {
  return (
    `Listo, ${nombreCorto}. Su sistema ya está abierto.\n\n` +
    `Este es su enlace:\n${enlaceDeCanal(slug)}\n\n` +
    `Compártalo con cinco personas hoy — por chat, como comparte cualquier cosa. ` +
    `Quien lo toque cae directo en una conversación conmigo, y yo le explico y le resuelvo las dudas.\n\n` +
    `Y le voy contando por aquí lo que vaya pasando: cuando alguien lo abra, cuando vea el video, cuando me escriba.\n\n` +
    `¿Le comparto un texto corto para acompañar el enlace?`
  );
}

export interface SocioIdentificado {
  slug: string;
  nombre: string;
  constructorId: string;
  /** `private_users.id` — el que va en `prospects.user_id` al convertirlo. */
  userId: string | null;
}

/**
 * El prospecto que ya es socio queda configurado como socio, y de ahí en
 * adelante el trato se abre únicamente como distribuidor (Director, 10 sep 2026).
 *
 * Patricia y Liliana escribieron primero como prospectas (o sin slug, que para el
 * canal era lo mismo) y sus fichas quedaron como prospectas calientes con el hilo
 * de negocio a medias. Cuando el canal reconoce que el número es de un socio:
 *
 *   · `prospects.user_id` ← su `private_users.id` y `stage` ← `maestria`, que es
 *     exactamente lo que el Dashboard usa para decir «ya compró, ya tiene su
 *     sistema» (`toCanonicalStage`: user_id no nulo → maestria). Deja de ser una
 *     venta pendiente en el pipeline de quien lo invitó.
 *   · `device_info.es_socio` + `socio_desde`: el webhook corta el hilo ahí — el
 *     modelo no vuelve a ver los turnos en que le vendió el negocio a quien ya lo
 *     tenía — y saluda como a un socio una sola vez (`saludo_socio_en`).
 *   · Se retiran la temperatura y el interés de prospecto: un socio no tiene
 *     «momento óptimo».
 *
 * Devuelve `true` si convirtió en esta llamada.
 */
export async function convertirProspectoEnSocio(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  fingerprint: string,
  socio: SocioIdentificado,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prospecto: { id?: string; device_info?: Record<string, any> | null } | null,
): Promise<boolean> {
  // ⚠️ `prospecto` llega NULO cuando el socio escribe por primera vez: el webhook
  // lee la ficha antes de crearla, así que en ese turno todavía no existía. Hasta
  // el 12 sep 2026 aquí se devolvía `false` y el socio quedaba registrado como
  // prospecto en `expansion`, sin `user_id` — o sea, como una venta pendiente en
  // el Radar de alguien. Le pasó a Miguel Barahona, que recibió su saludo de socio
  // y quedó archivado como prospecto en el mismo turno. Se relee la ficha en vez
  // de dar por perdida la conversión; el `select` extra solo corre en ese caso.
  let previo: Record<string, any> = prospecto?.device_info || {};
  if (!prospecto) {
    const { data } = await supabase
      .from('prospects')
      .select('device_info')
      .eq('fingerprint_id', fingerprint)
      .maybeSingle();
    if (!data) return false;
    previo = data.device_info || {};
  }
  // Ya convertido: solo se vuelve a tocar si le repusieron la temperatura de
  // prospecto (pasaba en cada mensaje hasta el 11 sep 2026, ver el scoring).
  const tieneTemperatura = previo.momento_optimo != null || previo.interest_level != null || previo.hilo_12_niveles != null;
  if (previo.es_socio && !tieneTemperatura) return false;
  const { momento_optimo: _m, interest_level: _i, hilo_12_niveles: _h, ...resto } = previo;
  const device_info = {
    ...resto,
    es_socio: true,
    socio_desde: previo.socio_desde ?? new Date().toISOString(),
    socio_constructor_id: socio.constructorId,
    socio_slug: socio.slug,
  };
  const { error } = await supabase
    .from('prospects')
    .update({ device_info, stage: 'maestria', ...(socio.userId ? { user_id: socio.userId } : {}) })
    .eq('fingerprint_id', fingerprint);
  if (error) {
    console.error(`⚠️ [WA Onboarding] No pude convertir ${fingerprint} en socio: ${error.message}`);
    return false;
  }
  console.log(`🤝 [WA Onboarding] ${fingerprint} ${previo.es_socio ? 'limpiado: le habían repuesto la temperatura' : 'pasa de prospecto a socio'} (/${socio.slug})`);
  return true;
}

/** Deja constancia de que el socio ya recibió su saludo con el enlace. */
export async function marcarSaludoDeSocio(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  fingerprint: string,
): Promise<void> {
  try {
    const { data } = await supabase.from('prospects').select('device_info').eq('fingerprint_id', fingerprint).maybeSingle();
    await supabase.from('prospects')
      .update({ device_info: { ...(data?.device_info || {}), saludo_socio_en: new Date().toISOString() } })
      .eq('fingerprint_id', fingerprint);
  } catch (err) {
    console.error('⚠️ [WA Onboarding] No pude marcar el saludo de socio:', err);
  }
}

/**
 * ¿Quien escribe es dueño de canal, y no un prospecto?
 *
 * Se resuelve con un `select` por teléfono: es determinístico, no le cuesta un
 * token al modelo y no se puede equivocar. Mira **dos tablas**, en este orden:
 * `constructor_slugs` primero y `private_users` como respaldo — el número del
 * socio tiene dos casas y no siempre coinciden (ver la nota del respaldo abajo).
 *
 * ⚠️ Por qué hace falta. El canal atiende a los dos por el MISMO número, y hasta
 * el 17 ago 2026 no los distinguía: el socio recibía la apertura de prospecto y
 * Queswa se presentaba ante él como *"la inteligencia artificial que asiste a
 * [él mismo]"*, para después explicarle el negocio que acababa de comprar. Ocurrió
 * con el número del Director y le habría ocurrido a cada socio nuevo — empezando
 * por el primer turno, porque el mensaje de bienvenida cierra ofreciéndole ayuda
 * para redactar y él responde "sí" a eso.
 */
export async function identificarSocio(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  telefono: string,
): Promise<SocioIdentificado | null> {
  const wa = normalizarWhatsApp(telefono);
  if (!wa) return null;
  try {
    // ⚠️ NO se compara con `.eq()` contra la columna cruda: los números están
    // guardados en formatos distintos —"+573175857607", con espacios, y con el
    // cero inicial que arrastran algunos—, así que una igualdad exacta no
    // encuentra a nadie. Se traen las filas y se comparan NORMALIZADAS. La tabla
    // tiene decenas de filas, no miles: el costo es irrelevante y la robustez no.
    const { data } = await supabase
      .from('constructor_slugs')
      .select('slug, display_name, constructor_id, whatsapp')
      .not('whatsapp', 'is', null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fila = ((data || []) as any[]).find((c) => normalizarWhatsApp(c.whatsapp) === wa);
    if (fila?.slug) {
      // El `id` de private_users es el que el Dashboard escribe en
      // `prospects.user_id` para saber que esa persona ya tiene su sistema.
      const { data: pu } = await supabase
        .from('private_users').select('id').eq('constructor_id', fila.constructor_id).maybeSingle();
      return {
        slug: fila.slug,
        nombre: (fila.display_name || '').split(/\s+/)[0] || '',
        constructorId: fila.constructor_id,
        userId: pu?.id ?? null,
      };
    }

    // ── Respaldo: el teléfono vive en `private_users` ──────────────────────────
    // El número del socio tiene DOS casas y no siempre coinciden: los reels lo
    // leen de `private_users.whatsapp` —así está documentado— y esto lo leía solo
    // de `constructor_slugs.whatsapp`. Medido el 22 ago 2026: 9 de 10 socios en la
    // primera, 10 de 10 en la segunda. El que faltaba era el del Director, así que
    // su propio número recibía la apertura de PROSPECTO y Queswa se presentaba
    // ante él como la asistente de él mismo — el fallo que este archivo dice haber
    // cerrado el 17 ago, vivo por un dato faltante en vez de por un error de código.
    //
    // Se hizo el backfill, pero un dato se vuelve a desalinear; el respaldo no.
    // El slug se busca porque el saludo lo necesita, y si el socio no lo tiene
    // SE LE ASIGNA aquí mismo (ver `asignarSlugPorDefecto`): hasta el 10 sep 2026
    // un socio sin slug no era socio para este flujo, y así dos socias recibieron
    // el discurso de prospecto con el trámite de vinculación incluido.
    const { data: porPrivate } = await supabase
      .from('private_users')
      .select('id, name, constructor_id, whatsapp')
      .not('whatsapp', 'is', null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usuario = ((porPrivate || []) as any[]).find((u) => normalizarWhatsApp(u.whatsapp) === wa);
    if (!usuario?.constructor_id) return null;

    const { data: slugFila } = await supabase
      .from('constructor_slugs')
      .select('slug, display_name')
      .eq('constructor_id', usuario.constructor_id)
      .maybeSingle();

    const slug: string | null = slugFila?.slug || (await asignarSlugPorDefecto(supabase, usuario));
    if (!slug) return null;

    console.log(`🔁 [WA Onboarding] Socio identificado por respaldo en private_users: ${usuario.constructor_id}`);
    return {
      slug,
      nombre: (slugFila?.display_name || usuario.name || '').split(/\s+/)[0] || '',
      constructorId: usuario.constructor_id,
      userId: usuario.id ?? null,
    };
  } catch (err) {
    console.error('⚠️ [WA Onboarding] Error identificando al socio:', err);
    return null;
  }
}

/**
 * Saludo para el dueño de canal. Es lo contrario del de prospecto: no explica el
 * negocio —él ya lo compró— sino que le propone el siguiente movimiento.
 *
 * Una sola salida, y es la que su propia experiencia señala como la que arranca:
 * escribirle a alguien. El resto de lo que Queswa puede hacer por él se ofrece
 * cuando lo pida, no en el saludo.
 */
export function saludoDeSocio(nombreCorto: string, slug: string): string {
  return (
    `Hola${nombreCorto ? ', ' + nombreCorto : ''}. Un gusto saludarle.\n\n` +
    `Aquí tiene su enlace a la mano:\n${enlaceDeCanal(slug)}\n\n` +
    `¿En qué nos enfocamos hoy? Podemos redactar un mensaje a la medida para alguien ` +
    `en concreto, revisar cómo va cada persona que ha llegado, o resolver cualquier ` +
    `detalle del plan.`
  );
}

/** Cómo se nombra cada evento. Concreto: qué hizo la persona, no una métrica. */
const TEXTO_EVENTO: Record<string, string> = {
  abrio:      'abrió su enlace',
  completo:   'vio el video completo',
  escribio:   'me está escribiendo',
  volvio:     'volvió a entrar',
};

export type EventoDueño = keyof typeof TEXTO_EVENTO;

export function mensajeDeActividad(evento: EventoDueño, restantes: number): string {
  const que = TEXTO_EVENTO[evento] || 'tuvo actividad';
  const base = `👀 Alguien de su sistema ${que}.`;

  // El aviso que agota el cupo explica adónde se mudan los siguientes. Sin esto
  // la persona cree que el sistema dejó de funcionar.
  if (restantes <= 0) {
    return (
      `${base}\n\n` +
      `De aquí en adelante le llegan al Centro de Mando, que avisa al instante y sin llenarle el chat. ` +
      `Ahí ve quién es cada persona y en qué va.`
    );
  }
  return base;
}

/**
 * ¿La ventana de servicio de 24 h sigue abierta para este número?
 *
 * Se mide por el último mensaje que **la persona** escribió: los nuestros no la
 * reabren. Ante cualquier error de consulta devuelve `false` — no enviar de más
 * cuesta un aviso; enviar fuera de ventana cuesta calidad de la línea.
 */
export async function dentroDeVentana(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  whatsapp: string,
): Promise<boolean> {
  const fingerprint = `wa_${normalizarWhatsApp(whatsapp)}`;
  try {
    const { data } = await supabase
      .from('nexus_conversations')
      .select('messages, created_at')
      .eq('fingerprint_id', fingerprint)
      .order('created_at', { ascending: false })
      .limit(1);

    const fila = (data || [])[0];
    if (!fila) return false;

    // Un turno se persiste con el mensaje del usuario adentro, así que la fecha
    // de la fila es una buena aproximación del último inbound.
    const horas = (Date.now() - new Date(fila.created_at).getTime()) / 36e5;
    return horas < 23.5; // margen de media hora contra relojes desfasados
  } catch (err) {
    console.error('⚠️ [WA Onboarding] No se pudo verificar la ventana:', err);
    return false;
  }
}

/**
 * Avisa al dueño que alguien acaba de escribirle a Queswa — **con nombre y
 * número**, porque aquí sí los tenemos.
 *
 * Es la diferencia con los avisos de la web: quien abre un enlace en el navegador
 * es un hash y nada más (nombre y teléfono son `null` en `prospects`, verificado),
 * mientras que quien escribe por WhatsApp llega con su nombre de perfil y su
 * número. Por eso este es el aviso que de verdad sirve: el dueño puede escribirle
 * de una, desde su propio chat, mientras la conversación con Queswa está caliente.
 *
 * Va una sola vez por prospecto, en su primer mensaje. Después el hilo lo maneja
 * Queswa y el dueño lo sigue en el Centro de Mando.
 */
export async function avisarSocioNuevoProspecto(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  constructorId: string | null | undefined,
  nombreProspecto: string,
  telefonoProspecto: string,
): Promise<'enviado' | 'fuera_de_ventana' | 'sin_dueño' | 'error'> {
  if (!constructorId) return 'sin_dueño';
  try {
    const { data: canal } = await supabase
      .from('constructor_slugs')
      .select('slug, whatsapp, display_name')
      .eq('constructor_id', constructorId)
      .maybeSingle();
    if (!canal?.whatsapp) return 'sin_dueño';
    if (!(await dentroDeVentana(supabase, canal.whatsapp))) return 'fuera_de_ventana';

    const corto = (canal.display_name || '').split(/\s+/)[0] || '';
    const tel   = telefonoProspecto.replace(/^57/, '');
    const texto =
      `👋 ${corto ? corto + ', ' : ''}*${nombreProspecto}* acaba de escribirme.\n\n` +
      `Su número es ${tel}, por si quiere saludarlo usted mismo.\n\n` +
      `Yo sigo con él: le explico, le resuelvo las dudas y le aviso si decide avanzar.`;

    const r = await sendText(normalizarWhatsApp(canal.whatsapp), texto);
    if (!r.ok) return 'error';
    console.log(`🔔 [WA Onboarding] "${nombreProspecto}" avisado a ${canal.slug}`);
    return 'enviado';
  } catch (err) {
    console.error('⚠️ [WA Onboarding] Error avisando del prospecto nuevo:', err);
    return 'error';
  }
}

/**
 * Avisa al dueño de una actividad de sus prospectos.
 *
 * Nunca lanza y nunca bloquea: se llama desde el tracker de engagement, y ese
 * endpoint tiene que responder rápido al navegador del prospecto aunque el aviso
 * falle. Devuelve qué pasó, solo para el log.
 */
export async function notificarDueño(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  constructorId: string | null | undefined,
  evento: EventoDueño,
): Promise<'enviado' | 'tope' | 'fuera_de_ventana' | 'sin_dueño' | 'error'> {
  if (!constructorId) return 'sin_dueño';

  try {
    const { data: canal } = await supabase
      .from('constructor_slugs')
      .select('slug, whatsapp, wa_notif_count')
      .eq('constructor_id', constructorId)
      .maybeSingle();

    if (!canal?.whatsapp) return 'sin_dueño';

    const enviados = canal.wa_notif_count ?? 0;
    if (enviados >= MAX_NOTIF_WA) return 'tope';

    if (!(await dentroDeVentana(supabase, canal.whatsapp))) return 'fuera_de_ventana';

    const restantes = MAX_NOTIF_WA - enviados - 1;
    const r = await sendText(normalizarWhatsApp(canal.whatsapp), mensajeDeActividad(evento, restantes));
    if (!r.ok) {
      console.error(`⚠️ [WA Onboarding] Aviso rechazado por Meta: ${r.error}`);
      return 'error';
    }

    await supabase
      .from('constructor_slugs')
      .update({ wa_notif_count: enviados + 1 })
      .eq('constructor_id', constructorId);

    console.log(`🔔 [WA Onboarding] Aviso "${evento}" → ${canal.slug} (${enviados + 1}/${MAX_NOTIF_WA})`);
    return 'enviado';
  } catch (err) {
    console.error('⚠️ [WA Onboarding] Error notificando al dueño:', err);
    return 'error';
  }
}
