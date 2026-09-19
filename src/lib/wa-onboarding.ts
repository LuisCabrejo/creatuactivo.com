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
 * El nombre con que Queswa le habla al socio: primer nombre y primer apellido,
 * con la misma regla del slug y con mayúscula inicial. «MONICA ALEJANDRA MALAGON
 * CARDENAS» → «Monica Malagon»; «Miguel  barahona» → «Miguel Barahona».
 */
export function nombreCortoDeSocio(nombre: string): string {
  const palabras = (nombre || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const elegidas = palabras.length >= 4 ? [palabras[0], palabras[2]] : palabras.slice(0, 2);
  return elegidas
    .map((p) => p.charAt(0).toLocaleUpperCase('es') + p.slice(1).toLocaleLowerCase('es'))
    .join(' ');
}

/**
 * Qué nombre dejar en la ficha al convertirla en socio (14 sep 2026).
 *
 * El motor le habla a la persona con `device_info.name`, y la ficha NACE con el
 * nombre de su perfil de WhatsApp. Hasta hoy la conversión solo ponía el nombre
 * registrado si la ficha no traía ninguno — y siempre trae el del perfil. Así Queswa
 * le dijo «Yenireth» a Erika Cabrejo, «Adri Flrz» con flores a Adriana Flores y
 * «Nidiadent» a Nidia Cabrejo.
 *
 * • **En la PRIMERA conversión el nombre registrado manda**, y el del perfil se
 *   guarda aparte en `nombre_perfil_whatsapp`: a esa altura el nombre de la ficha
 *   siempre salió del perfil.
 * • **Si la ficha ya era de socio, no se pisa.** Esos nombres pueden venir de una
 *   corrección a mano (`scripts/vincular-huella-a-socio.mts --nombre`), como el
 *   «Armando Rojas» de Victor Armando Rojas.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function nombreParaFichaDeSocio(previo: Record<string, any>, socio: Pick<SocioIdentificado, 'nombreCompleto'>): Record<string, string> {
  const registrado = socio.nombreCompleto ? nombreCortoDeSocio(socio.nombreCompleto) : '';
  if (!registrado) return {};
  if (!previo.es_socio) {
    return {
      name: registrado,
      ...(previo.name && previo.name !== registrado ? { nombre_perfil_whatsapp: String(previo.name) } : {}),
    };
  }
  return previo.name ? {} : { name: registrado };
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
  /** Nombre completo del socio, para que la ficha no se quede con el de su perfil de WhatsApp. */
  nombreCompleto?: string;
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
  // ⚠️ La temperatura no son solo dos campos (13 sep 2026). Miguel Barahona,
  // socio, tocó su propio enlace y al final de la noche su ficha decía paquete
  // ESP-3, arquetipo «emprendedor» e hilo de 12 Niveles: la guarda del scoring
  // solo cuidaba `momento_optimo` e `interest_level`, y todo lo demás que el
  // motor le captura a un prospecto se le seguía escribiendo al socio.
  const CAMPOS_DE_PROSPECTO = ['momento_optimo', 'interest_level', 'hilo_12_niveles', 'package', 'archetype', 'objections'] as const;
  const tieneTemperatura = CAMPOS_DE_PROSPECTO.some((k) => previo[k] != null);
  if (previo.es_socio && !tieneTemperatura) return false;
  const resto: Record<string, any> = { ...previo };
  for (const k of CAMPOS_DE_PROSPECTO) delete resto[k];
  const device_info = {
    ...resto,
    ...nombreParaFichaDeSocio(previo, socio),
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
  // ── Quien escribe con nombre de usuario de WhatsApp no trae teléfono ──────
  // Meta lo esconde tras un BSUID (`CO.1955991631759265`), así que aquí no hay
  // número que comparar. Victor Armando Rojas, aprobado como socio a las 18:35
  // del 12 sep 2026, escribió a las 19:05 desde una cuenta así y recibió la
  // apertura de prospecto. La única forma de reconocerlo es que su huella ya
  // esté vinculada a su cuenta (`vincularSocioPorToken`): la ficha queda con
  // `es_socio` y `socio_constructor_id`, y de ahí se lee.
  if (esBsuid(telefono)) return socioPorHuellaVinculada(supabase, `wa_${telefono}`);

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
        nombreCompleto: fila.display_name || undefined,
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
      nombreCompleto: slugFila?.display_name || usuario.name || undefined,
    };
  } catch (err) {
    console.error('⚠️ [WA Onboarding] Error identificando al socio:', err);
    return null;
  }
}

/** `CO.1955991631759265` — el identificador con que Meta esconde un teléfono. */
export function esBsuid(identidad: string): boolean {
  return /^[A-Z]{2}\.[A-Za-z0-9]{6,}$/.test(identidad || '');
}

/**
 * El socio por su `constructor_id` — la llave de texto que comparte con el
 * Dashboard. Si no tiene slug se le asigna, igual que por teléfono.
 */
export async function socioPorConstructorId(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  constructorId: string,
): Promise<SocioIdentificado | null> {
  try {
    const { data: usuario } = await supabase
      .from('private_users').select('id, name, constructor_id, whatsapp')
      .eq('constructor_id', constructorId).maybeSingle();
    if (!usuario?.constructor_id) return null;
    const { data: slugFila } = await supabase
      .from('constructor_slugs').select('slug, display_name')
      .eq('constructor_id', constructorId).maybeSingle();
    const slug: string | null = slugFila?.slug || (await asignarSlugPorDefecto(supabase, usuario));
    if (!slug) return null;
    return {
      slug,
      nombre: (slugFila?.display_name || usuario.name || '').split(/\s+/)[0] || '',
      constructorId,
      userId: usuario.id ?? null,
      nombreCompleto: slugFila?.display_name || usuario.name || undefined,
    };
  } catch (err) {
    console.error('⚠️ [WA Onboarding] Error buscando al socio por constructor_id:', err);
    return null;
  }
}

/** La huella (BSUID) que ya quedó vinculada a un socio se reconoce por su ficha. */
async function socioPorHuellaVinculada(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  fingerprint: string,
): Promise<SocioIdentificado | null> {
  try {
    const { data } = await supabase
      .from('prospects').select('device_info')
      .eq('fingerprint_id', fingerprint).maybeSingle();
    const d = data?.device_info || {};
    if (!d.es_socio || !d.socio_constructor_id) return null;
    return socioPorConstructorId(supabase, d.socio_constructor_id);
  } catch {
    return null;
  }
}

// ─── El vínculo por token: para el socio al que no se le ve el teléfono ───────
//
// El Dashboard le muestra al socio un enlace `wa.me` a Queswa con este texto
// prellenado. Cuando llega, el webhook verifica la firma y ata la huella —sea
// teléfono o BSUID— a su cuenta. La firma es un HMAC del `constructor_id` con
// `WA_BRIDGE_SECRET`, que los dos repositorios ya comparten: no hay tabla, no
// caduca (es identidad, no sesión) y no se puede fabricar sin el secreto.
// Web Crypto a propósito: este archivo también lo importa una ruta Edge.

const RE_VINCULO_SOCIO = /soy socio\W+([a-z0-9-]+)\.([A-Za-z0-9_-]{8,})/i;

export function extraerVinculoSocio(texto: string): { constructorId: string; token: string } | null {
  const m = RE_VINCULO_SOCIO.exec(texto || '');
  return m ? { constructorId: m[1].toLowerCase(), token: m[2] } : null;
}

export async function tokenDeVinculoSocio(constructorId: string, secreto = process.env.WA_BRIDGE_SECRET): Promise<string | null> {
  const clave = (secreto || '').trim();
  if (!clave) return null;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(clave), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const firma = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(constructorId.toLowerCase())));
  let bin = '';
  for (const byte of firma) bin += String.fromCharCode(byte);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '').slice(0, 16);
}

export async function verificarTokenDeVinculo(constructorId: string, token: string): Promise<boolean> {
  const esperado = await tokenDeVinculoSocio(constructorId);
  return !!esperado && esperado === token;
}

/** El texto prellenado del enlace que el Dashboard le da al socio. */
export async function textoVinculoSocio(constructorId: string): Promise<string | null> {
  const token = await tokenDeVinculoSocio(constructorId);
  // Sin emojis ni tildes: la precarga de wa.me convierte algunos caracteres en U+FFFD.
  return token ? `Hola Queswa, soy socio: ${constructorId.toLowerCase()}.${token}` : null;
}

/**
 * Ata la huella que escribe a la cuenta del socio y la deja configurada como
 * tal. Devuelve al socio si el token es válido; `null` si no lo es.
 */
export async function vincularSocioPorToken(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  fingerprint: string,
  vinculo: { constructorId: string; token: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prospecto: { id?: string; device_info?: Record<string, any> | null } | null,
): Promise<SocioIdentificado | null> {
  if (!(await verificarTokenDeVinculo(vinculo.constructorId, vinculo.token))) return null;
  const socio = await socioPorConstructorId(supabase, vinculo.constructorId);
  if (!socio) return null;
  await convertirProspectoEnSocio(supabase, fingerprint, socio, prospecto);
  return socio;
}

/**
 * El socio que toca un enlace de canal —el suyo o el de otro socio— no es un
 * prospecto que llega: está mirando. Hasta el 12 sep 2026 ese mensaje no tenía
 * dueño: la apertura lo excluye por ser socio y el modo socio no sabe qué hacer
 * con «vengo del enlace de miguel-barahona», así que el modelo compuso
 * «Bienvenido, Antonio. Ya lo tengo en el sistema de Miguel» y de ahí en
 * adelante le vendió el negocio a Miguel con un método inventado. Se le dice
 * qué hace ese enlace y se le propone lo suyo, una sola salida.
 */
export function mensajeSocioEnlace(socio: SocioIdentificado, slugDelEnlace: string | null): string {
  const nombre = socio.nombre ? `, ${socio.nombre}` : '';
  const propio = !slugDelEnlace || slugDelEnlace === socio.slug;
  const primera = propio
    ? `Ese enlace es el suyo${nombre}, y funciona: quien lo toque llega aquí conmigo y recibe la apertura con usted como patrocinador.`
    : `Ese enlace es de ${slugDelEnlace}${nombre}, y funciona igual que el suyo: quien lo toque llega aquí conmigo y queda con ${slugDelEnlace} como patrocinador.`;
  return (
    `${primera}\n\n` +
    `A usted no le abro esa conversación porque ya lo conozco como socio. Si quiere verla tal como la vive un prospecto, ábrala desde otro número.\n\n` +
    (propio ? '' : `El suyo es ${enlaceDeCanal(socio.slug)}.\n\n`) +
    OFERTA_REDACTAR
  );
}

/** La oferta con que el canal cierra con el socio: redactarle el mensaje para alguien. */
export const OFERTA_REDACTAR = '¿Le redacto el mensaje para enviárselo a alguien?';

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

// ─── Lo que es del Centro de Mando se pide en el Centro de Mando ──────────────
//
// Decisión del Director (16 sep 2026, hablada con Patricia y con los demás
// empresarios que tienen Dashboard): Queswa en WhatsApp está hecha para atender a
// los PROSPECTOS del socio. Queswa en el Centro de Mando (queswa.app) está hecha
// para el DISTRIBUIDOR: conoce sus metas, aprende cómo escribe, entra a su back
// office y carga compras. A los distribuidores se les enseñó que la redacción
// la obtienen en mejor calidad allá.
//
// ⚠️ PERO EL MENSAJE PARA UNA PERSONA SÍ SE REDACTA AQUÍ (Director, el mismo
// día, tras probarlo él: «para mí eso es genial»). Si el socio está en WhatsApp y
// pide un mensaje para su amigo, su hermana, un conocido con oficio, se le hace
// el mejor trabajo posible con el esqueleto (`wa-redaccion-socio.ts`, en el MODO
// SOCIO del motor). Lo que va al Centro de Mando es el mensaje para un NEGOCIO o
// una EMPRESA —restaurantes, tiendas, el gerente, los dueños de—, además de
// cargar compras y ver su lista, que aquí no existen.
//
// El caso que lo decidió: el 15 sep Patricia Reyes gastó 20 turnos y 28 minutos
// aquí pidiendo un correo para restaurantes de autor. El motor del canal no tiene
// su lista, ni sus metas, ni su voz, y lo que produjo fueron ocho borradores con
// claims que el guardarraíl no vio. La capacidad vive donde está el contexto.
//
// Por eso, cuando el socio pide aquí algo que es del Dashboard, recibe una
// invitación amable —dicha como algo que él tiene por ser socio, nunca como un
// rechazo— y el «sí» le manda el acceso en el mismo chat (plantilla
// `acceso_centro_mando_v2`, UTILITY, verificada contra Meta el 16 sep 2026).

/** Verbo de escribir + la cosa que se escribe. Tolerante al pulgar (`prueba-typos.mts`). */
const RE_PIDE_REDACCION =
  /\b(red[aá]ct|escr[ií]b|arm|prep[aá]r|h[aá]g|haz|cre|gener|dise[ñn]|ay[uú]d)[a-záéíóúñ]*\b[^.?!]{0,50}?\b(mensajes?|textos?|correos?|e-?mails?|cartas?|invitaci[oó]n(es)?|notas?|escritos?|contenidos?|comunicaci[oó]n|propuestas?)\b|\b(necesito|quiero|quisiera|me gustar[ií]a|dame|deme|env[ií][ae]me|m[aá]nd[ae]me)\b[^.?!]{0,30}?\b(un|el|una|la)\s+(mensaje|texto|correo|carta|invitaci[oó]n)\b|\bescr[ií]b[ae]le a\b/i;

/** Cargar una compra, ver su lista o su avance: todo eso vive en su Centro de Mando. */
const RE_PIDE_FUNCION_DASHBOARD =
  /\b(c[aá]rg|sub|mont|registr|ingres|hac|pon|cre)[a-záéíóúñ]*\s+(una?\s+|la\s+|el\s+|mi\s+)?(compra|pedido|orden)\b|\b(mi|mis)\s+(lista|prospectos|contactos|metas?|objetivos?|avance|pipeline|estad[ií]sticas)\b|\b(c[oó]mo (va|van)|qui[eé]n(es)? (ha|han) llegado|cu[aá]nt[oa]s (han )?llegado)\b/i;

/** El destinatario es un NEGOCIO: el establecimiento, su cargo, o varios de ellos. */
const RE_DESTINO_NEGOCIO =
  /\b(restaurantes?|tiendas?|negocios?|empresas?|empresari[oa]s?|comercios?|locales?|almac[eé]n(es)?|supermercados?|cafeter[ií]as?|hoteles?|hotel|cl[ií]nicas?|spas?|gimnasios?|drogue?r[ií]as?|farmacias?|naturistas?|panader[ií]as?|oficinas?|compa[ñn][ií]as?|corporativ[oa]s?|proveedor(es)?|gerentes?|due[ñn][oa]s? de|encargad[oa]s? de|administrador(es|a|as)? de|propietari[oa]s? de|b2b)\b/i;

/** Una relación personal delante del destinatario lo vuelve PERSONA aunque tenga negocio. */
const RE_DESTINO_PERSONA =
  /\b(mi|una?|el|la|ese|esa)\s+(amig[oa]s?|herman[oa]s?|prim[oa]s?|compadre|comadre|vecin[oa]s?|cu[ñn]ad[oa]s?|t[ií][oa]s?|sobrin[oa]s?|colegas?|jefe|conocid[oa]s?|pareja|espos[oa]|novi[oa]|pap[aá]|mam[aá]|hij[oa]s?|compa[ñn]er[oa]s?|excompa[ñn]er[oa]s?|contacto|persona|se[ñn]or|se[ñn]ora)\b|\balguien\b|\bescr[ií]b[ae]le a\s+[A-ZÁÉÍÓÚ][a-záéíóúñ]+/i;

export type MotivoDashboard = 'redaccion' | 'funcion';

/**
 * ¿El socio pide aquí algo que es del Centro de Mando? `redaccion` SOLO cuando el
 * mensaje es para un negocio o una empresa; el mensaje para una persona se queda
 * en el canal y lo redacta el motor con el esqueleto.
 */
export function detectarPideFuncionDashboard(texto: string): MotivoDashboard | null {
  const t = texto || '';
  if (RE_PIDE_REDACCION.test(t) && RE_DESTINO_NEGOCIO.test(t) && !RE_DESTINO_PERSONA.test(t)) return 'redaccion';
  if (RE_PIDE_FUNCION_DASHBOARD.test(t)) return 'funcion';
  return null;
}

const CIERRE_INVITACION = 'Es una de las cosas que usted tiene por ser socio. ¿Le mando el acceso?';

/** Copy aprobado por el Director el 16 sep 2026. `insiste` = ya se le invitó en el turno anterior. */
export function invitacionAlDashboard(nombre: string, motivo: MotivoDashboard, insiste = false): string {
  const n = nombre ? `, ${nombre}` : '';
  if (insiste) {
    return `Aquí no tengo su lista ni la forma en que usted escribe; en su Centro de Mando sí. ¿Le mando el acceso?`;
  }
  const primera = motivo === 'redaccion'
    ? `Un mensaje para un negocio se lo hago mejor desde su Centro de Mando${n}. Allá tengo su lista, sus metas y la forma en que usted escribe, y por eso le sale con su voz y listo para copiar.`
    : `Eso lo tiene en su Centro de Mando${n}. Allá están su lista, sus metas y su back office, y desde ahí se carga la compra y se ve cómo va cada persona.`;
  return `${primera}\n\n${CIERRE_INVITACION}`;
}

/** ¿El último turno del bot fue la invitación? El «sí» que sigue pide el acceso. */
export function botInvitoAlDashboard(ultimoBot: string): boolean {
  return (ultimoBot || '').trimEnd().endsWith('¿Le mando el acceso?');
}

export const ACCESO_NO_ENVIADO =
  'No me dejó enviarle el acceso ahora mismo. Entre por queswa.app con su correo registrado y le llega en un momento.';

/**
 * Manda el acceso al Centro de Mando por el mismo camino que usa el Dashboard
 * (`POST /api/auth/magic-link`, canal whatsapp): el token se genera allá, es de un
 * solo uso y vence en 24 h, y la plantilla la dispara ese endpoint. Si el canal
 * falla, el endpoint cae al correo — aquí eso cuenta como no enviado, para que
 * el socio sepa dónde buscarlo.
 */
export async function enviarAccesoDashboard(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  socio: SocioIdentificado,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { data } = await supabase.from('private_users').select('email').eq('constructor_id', socio.constructorId).maybeSingle();
    const email = (data?.email || '').trim().toLowerCase();
    if (!email) return { ok: false, error: 'el socio no tiene correo en private_users' };
    const base = process.env.DASHBOARD_URL || 'https://queswa.app';
    const r = await fetch(`${base}/api/auth/magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, canal: 'whatsapp' }),
    });
    const j = (await r.json().catch(() => ({}))) as { canal?: string; error?: string };
    if (r.ok && j.canal === 'whatsapp') return { ok: true };
    return { ok: false, error: j.error || (j.canal === 'email' ? 'el canal falló y cayó a correo' : `HTTP ${r.status}`) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
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
