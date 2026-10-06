/**
 * Copyright © 2026 CreaTuActivo.com
 * Segundo segmento del Propietario — bifurca según el destino:
 *
 *  • destino ∈ REEL_NICHOS  → RENDER página de Reel (creatuactivo.com/{slug}/{nicho})
 *  • resto                  → REDIRECT con tracking (creatuactivo.com/{slug}/auditoria → ?ref=)
 */

import { createClient } from '@supabase/supabase-js'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { REEL_NICHOS, REEL_ASSETS, REEL_COPY, REEL_POSTER_OG, REEL_POSTER_OVERRIDE, type ReelNicho } from '@/lib/reels'
import ReelPage from '@/components/ReelPage'
import { OG_PRESENTACION } from '@/app/presentacion/og'

// La presentación 1-a-1. «presentacion» es el nombre vigente (30 sep 2026);
// «pitch-deck» y «deck» son los enlaces que ya circulan y siguen funcionando.
const DESTINOS_PRESENTACION = ['presentacion', 'pitch-deck', 'deck']
const esPresentacion = (destino: string) => DESTINOS_PRESENTACION.includes(destino)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Mapa: destino corto → ruta real en creatuactivo.com
const DESTINO_MAP: Record<string, (constructorId: string) => string> = {
  // Calculadora y Fundadores se eliminaron el 1 oct 2026: sus enlaces cortos
  // guardados siguen funcionando y llevan a la Home con el ref del socio.
  'calculadora':   (id) => `/?ref=${id}`,
  'productos':     (id) => `/productos/${id}`,
  'servilleta':    (id) => `/servilleta/${id}`,
  'home':          (id) => `/?ref=${id}`,
  'fundadores':    (id) => `/?ref=${id}`,
  'fundadores-pro':(id) => `/?ref=${id}`,
  'red':           (id) => `/?ref=${id}`,
  // Legado — siguen funcionando si alguien tiene el link guardado
  'video-plan-servilleta': (id) => `/video-plan-servilleta?ref=${id}`,
  'video-plan':            (id) => `/video-plan-servilleta?ref=${id}`,
  'reto':          (id) => `/12-niveles/${id}`,
  '12-niveles':    (id) => `/12-niveles/${id}`,
  // Activación inmediata → página de paquetes (mismo destino que el botón de la servilleta)
  'activacion':    (id) => `/paquetes?ref=${id}`,
  // La presentación 1-a-1. ⚠️ Sin estas filas, el enlace caía al fallback y el
  // distribuidor no tenía forma de compartirla con su identificador: el chat no
  // recibía `ref`, y el enlace al catálogo salía pelado, sin atribuirle la venta
  // a nadie (auditoría del 23 sep 2026). Es la trampa que el CLAUDE.md advierte.
  // «presentacion» llevó hasta el 30 sep 2026 a /presentacion-empresarial, la
  // herramienta anterior, que ya no se ofrecía en el Dashboard: desde ese día abre
  // la presentación vigente. /presentacion-empresarial se eliminó el 1 oct 2026
  // y redirige a /presentacion (next.config.js).
  'presentacion':  (id) => `/presentacion?ref=${id}`,
  'pitch-deck':    (id) => `/presentacion?ref=${id}`,
  'deck':          (id) => `/presentacion?ref=${id}`,
}

function isReelNicho(destino: string): destino is ReelNicho {
  return (REEL_NICHOS as readonly string[]).includes(destino)
}

// Los robots que arman la tarjeta de vista previa al pegar un enlace. Se
// reconocen por el user-agent — WhatsApp, Facebook/Instagram/Messenger,
// iMessage (usa el de Facebook), Telegram, X, LinkedIn, Slack, Discord, Skype.
const SCRAPERS_DE_PREVIEW = /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|skypeuripreview|pinterestbot|applebot/i

function esScraperDePreview(): boolean {
  return SCRAPERS_DE_PREVIEW.test(headers().get('user-agent') ?? '')
}

// La tarjeta del enlace de Queswa (30 sep 2026, Director): la MISMA imagen y el
// mismo título de la presentación (la imagen de los pares vive en
// src/lib/og-modernizacion.tsx). Lo único propio es la descripción, porque este
// enlace abre un chat de WhatsApp y la tarjeta tiene que avisarlo: si no, quien
// la toca se sorprende. Junta el título y la descripción que ya estaban
// aprobados. El `?v=` de la imagen es para que las cachés de los scrapers no
// sirvan la versión anterior (la URL de la ruta no cambió).
// 6 oct 2026 (Director, caso Felipe): el título en negrita dice ahora dónde
// ocurre la conversación. Felipe tocó el enlace, se le abrió WhatsApp con el
// mensaje escrito y creyó que había un error: esperaba la pantalla de un agente.
// La promesa de la empresa pasa a la descripción.
const OG_QUESWA = {
  title: 'Hable con Queswa por WhatsApp',
  description: 'Le explica y le responde a cualquier hora cómo usted puede tener a su nombre una empresa de distribución moderna.',
  image: 'https://creatuactivo.com/og/queswa?v=20260930',
  alt: OG_PRESENTACION.alt,
  // El <title> de la página (solo lo ven los robots: a la persona se le redirige).
  // Sin «| CreaTuActivo»: el layout raíz lo agrega con su template.
  pestana: 'Hable con Queswa',
}

// Número orgánico de CreaTuActivo — fallback si el arquitecto no tiene WhatsApp
// configurado en private_users (mismo default que /productos)
const WHATSAPP_ORGANICO_DEFAULT = '+573206805737'

/**
 * Resuelve el slug de la URL a su fila de `constructor_slugs`, o NO VUELVE:
 *
 *  · existe → devuelve la fila (constructor_id, display_name, foto_url);
 *  · no existe pero es el enlace VIEJO de un socio que cambió de seudónimo
 *    (13 sep 2026; el Dashboard guarda el anterior en `constructor_slug_aliases`)
 *    → redirect permanente (308) a la misma ruta con el slug actual, así un
 *    enlace ya compartido o impreso sigue llevando a su dueño y de paso la
 *    URL se actualiza en quien lo abre;
 *  · ninguna de las dos → 404.
 *
 * Un solo resolvedor para los tres destinos (reel, queswa y redirect
 * genérico): antes cada uno consultaba la tabla por su cuenta. Devolver la
 * fila —en vez de validar aparte con un `if (!c)`— es lo que deja a `c` sin
 * `null` para TypeScript: un `await` de una función que "nunca vuelve" no
 * estrecha el tipo, pero un `return` sí.
 */
async function resolverSlug(slug: string, destino: string) {
  const { data } = await supabase
    .from('constructor_slugs')
    .select('display_name, foto_url, constructor_id')
    .eq('slug', slug)
    .maybeSingle()

  if (data) return data

  const { data: alias } = await supabase
    .from('constructor_slug_aliases')
    .select('constructor_id')
    .eq('slug', slug)
    .maybeSingle()

  if (alias) {
    const { data: actual } = await supabase
      .from('constructor_slugs')
      .select('slug')
      .eq('constructor_id', alias.constructor_id)
      .maybeSingle()

    if (actual?.slug && actual.slug !== slug) {
      permanentRedirect(`/${actual.slug}/${destino}`)
    }
  }

  notFound()
}

export default async function DestinoRoute({
  params,
  searchParams,
}: {
  params: { slug: string; destino: string }
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const { slug, destino } = params

  // ── Caso Reel: renderiza la página (NO redirige) ───────────────
  if (isReelNicho(destino)) {
    const c = await resolverSlug(slug, destino)

    // El WhatsApp del arquitecto es la fuente de verdad en private_users
    // (igual que /api/constructor/[id]). Fallback al número orgánico.
    const { data: pu } = await supabase
      .from('private_users')
      .select('whatsapp')
      .eq('constructor_id', c.constructor_id)
      .single()

    return (
      <ReelPage
        slug={slug}
        nicho={destino}
        constructor={{
          display_name: c.display_name,
          foto_url: c.foto_url,
          constructor_id: c.constructor_id,
          whatsapp: pu?.whatsapp || WHATSAPP_ORGANICO_DEFAULT,
        }}
      />
    )
  }

  // ── Caso Queswa: enlace amigable → WhatsApp con Queswa (redirect externo) ──
  // creatuactivo.com/{slug}/queswa (o /acceso) → wa.me de Queswa con el slug
  // embebido en el texto pre-llenado, para que resolverPatrocinador() (webhook
  // WhatsApp) atribuya el prospecto al socio. Enlace limpio y confiable en vez
  // del wa.me con parámetros crudos que nadie se atreve a tocar.
  //
  // ⚠️ Se VALIDA el slug antes de redirigir. Sin la validación, un slug mal
  // escrito o de alguien no registrado redirigía igual: el prospecto escribía,
  // resolverPatrocinador() no encontraba a nadie, y entraba sin dueño — fuera del
  // Radar del socio, sin aviso, y con la apertura cayendo al saludo genérico de
  // marca en vez de nombrarlo. Todo eso sin un solo error visible. Con un socio
  // era invisible; con diez es una fuga silenciosa de prospectos.
  // /{slug}/como-funciona (28 sep 2026) es el mismo enlace, con el contexto del
  // reel: va en el texto del video «Cómo funciona» que el socio comparte desde el
  // Centro de Expansión, y le avisa a Queswa que la persona ya lo vio (el webhook
  // lo reconoce con vieneDelVideoComoFunciona(), en wa-apertura.ts).
  // /{slug}/estrategia (28 sep 2026) es el del reel «Los 12 Niveles»: avisa que ya
  // vio ese video (vieneDelVideoDoceNiveles) y Queswa le ofrece el simulador.
  if (destino === 'queswa' || destino === 'acceso' || destino === 'como-funciona' || destino === 'estrategia' || destino === 'como-entra-el-dinero' || destino === 'que-debo-hacer-yo') {
    await resolverSlug(slug, destino)

    // ⚠️ Sin emoji, y medido (19 ago 2026). La redirección entrega el carácter
    // bien —`%F0%9F%AA%A2` para 🪢, verificado en la cabecera Location—, pero lo
    // que llega al webhook es U+FFFD: la pre-carga de texto de wa.me destruye
    // cualquier emoji de cuatro bytes. Pasó igual con 👋 durante meses. El
    // primer mensaje de la conversación es el peor lugar para un cuadrito roto,
    // así que aquí va texto limpio; el nudo de la marca vive en las respuestas
    // de Queswa, que salen por la API y sí lo conservan.
    const texto = destino === 'como-funciona'
      ? `Hola Queswa, vengo del enlace de ${slug}. Ya vi el video de cómo funciona.`
      : destino === 'estrategia'
        ? `Hola Queswa, vengo del enlace de ${slug}. Ya vi el video de los 12 niveles.`
        // Los reels «Cómo entra el dinero» y «Qué debo hacer yo» (28 sep 2026): el
        // webhook los reconoce con videoDeReelVisto() en wa-apertura.ts.
        : destino === 'como-entra-el-dinero'
          ? `Hola Queswa, vengo del enlace de ${slug}. Ya vi el video de cómo entra el dinero.`
          : destino === 'que-debo-hacer-yo'
            ? `Hola Queswa, vengo del enlace de ${slug}. Ya vi el video de qué debo hacer yo.`
            : `Hola Queswa, vengo del enlace de ${slug}`
    const waUrl = `https://wa.me/573215193909?text=${encodeURIComponent(texto)}`

    // 🔴 A los robots de vista previa NO se les redirige (28 ago 2026). Un
    // scraper que recibe el 307 lo sigue hasta wa.me y arma la tarjeta con lo
    // que wa.me le dé: la foto de perfil de Queswa en una URL firmada con
    // vencimiento (`oe=`), y a merced de que WhatsApp quiera pintar previews de
    // su propio dominio. Así fue durante semanas —la "tarjeta del logotipo" era
    // esa foto— hasta que dejó de salir nada. La tarjeta tiene que ser NUESTRA:
    // al robot se le sirve esta página mínima con el OG de abajo, y la persona
    // sigue recibiendo el redirect directo, sin pasar por aquí.
    if (esScraperDePreview()) {
      return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F1115', color: '#E5E5E5', fontFamily: 'sans-serif' }}>
          <a href={waUrl} style={{ color: '#C5A059' }}>{OG_QUESWA.title}</a>
        </main>
      )
    }

    // 📈 Cada apertura queda registrada antes de saltar a WhatsApp (6 oct 2026,
    // caso Felipe): quien abre el enlace y no toca «Enviar» no le llega a Queswa
    // y era invisible. Va en `page_visits` (tabla existente sin otro uso):
    // mentor_ref_id = slug, page_entry = /{slug}/{destino}. Los robots de vista
    // previa ya salieron arriba. Si falla, se redirige igual: medir no puede
    // costar una persona. Comparar con `node scripts/medir-aperturas-enlace.mjs`.
    try {
      await supabase.from('page_visits').insert({
        session_id: crypto.randomUUID(),
        mentor_ref_id: slug,
        page_entry: `/${slug}/${destino}`,
      })
    } catch (e) {
      console.warn('⚠️ [Enlace Queswa] No se registró la apertura:', e)
    }

    redirect(waUrl)
  }

  // ── Caso redirect (comportamiento original) ────────────────────
  // 1. Resolver constructor_id desde el slug
  const record = await resolverSlug(slug, destino)

  // 2. Resolver destino → ruta real
  const resolver = DESTINO_MAP[destino]
  if (!resolver) {
    // Destino desconocido → home con tracking (la mini-landing /{slug} se eliminó)
    redirect(`/?ref=${record.constructor_id}`)
  }

  // La pantalla de la presentación viaja con el enlace (2 oct 2026): Queswa le da
  // al socio `/{slug}/presentacion?pantalla=9`, la de los números, para estudiarla.
  const pantalla = esPresentacion(destino) && typeof searchParams?.pantalla === 'string'
    && /^\d{1,2}$/.test(searchParams.pantalla) ? searchParams.pantalla : null
  const destinoReal = resolver(record.constructor_id) + (pantalla ? `&pantalla=${pantalla}` : '')

  // 🔴 La presentación tampoco redirige a los robots de vista previa (24 sep 2026),
  // por la misma razón que Queswa: un scraper que sigue el 307 arma la tarjeta
  // con el `og:url` de /presentacion — SIN el identificador del distribuidor — y
  // Facebook publica ese enlace pelado: la visita no queda atribuida a nadie.
  // Al robot se le sirve esta página mínima con el OG de abajo (url del slug);
  // la persona sigue recibiendo el redirect directo.
  if (esPresentacion(destino) && esScraperDePreview()) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F1115', color: '#E5E5E5', fontFamily: 'sans-serif' }}>
        <a href={destinoReal} style={{ color: '#C5A059' }}>{OG_PRESENTACION.title}</a>
      </main>
    )
  }

  redirect(destinoReal)
}

// Metadata dinámica — OG de video para reels, mínima para redirects
export async function generateMetadata({
  params,
}: {
  params: { slug: string; destino: string }
}) {
  const { slug, destino } = params

  if (isReelNicho(destino)) {
    const copy = REEL_COPY[destino]
    const assets = REEL_ASSETS[destino]
    const descripcion = copy.cuerpo.split('\n\n')[0]

    return {
      title: `${copy.titulo} | CreaTuActivo`,
      description: descripcion,
      robots: { index: false },
      // Canonical propio (sobrescribe el global = homepage). Sin esto, el
      // "Compartir" nativo del navegador arrastra solo creatuactivo.com.
      alternates: { canonical: `https://creatuactivo.com/${slug}/${destino}` },
      openGraph: {
        title: copy.titulo,
        description: descripcion,
        url: `https://creatuactivo.com/${slug}/${destino}`,
        siteName: 'CreaTuActivo.com',
        videos: [{ url: assets.video, type: 'video/mp4', width: 1080, height: 1920 }],
        // Portada: frame del propio reel por-nicho (1080×1920 nítido desde el master);
        // fallback al poster branded para nichos sin override.
        images: [{ url: REEL_POSTER_OVERRIDE[destino]?.posterOg ?? REEL_POSTER_OG, width: 1080, height: 1920, alt: copy.titulo }],
      },
    }
  }

  // Tarjeta propia para el enlace de Queswa. La imagen vive en /og/queswa
  // (route handler propio: ver el porqué en ese archivo).
  if (destino === 'queswa' || destino === 'acceso' || destino === 'como-funciona' || destino === 'estrategia' || destino === 'como-entra-el-dinero' || destino === 'que-debo-hacer-yo') {
    const url = `https://creatuactivo.com/${slug}/${destino}`
    return {
      title: OG_QUESWA.pestana,
      description: OG_QUESWA.description,
      robots: { index: false },
      alternates: { canonical: url },
      openGraph: {
        type: 'website',
        locale: 'es_CO',
        title: OG_QUESWA.title,
        description: OG_QUESWA.description,
        url,
        siteName: 'CreaTuActivo.com',
        images: [{ url: OG_QUESWA.image, width: 1200, height: 630, alt: OG_QUESWA.alt }],
      },
      twitter: { card: 'summary_large_image', title: OG_QUESWA.title, description: OG_QUESWA.description },
    }
  }

  // Tarjeta propia para la presentación, con la url DEL SLUG (24 sep 2026). La
  // imagen y el copy son los de /presentacion; lo que cambia es el `og:url`, que
  // es lo que Facebook publica. Ver el porqué en el componente, arriba. Un enlace
  // viejo (/{slug}/pitch-deck) publica ya la url con el nombre vigente.
  if (esPresentacion(destino)) {
    const url = `https://creatuactivo.com/${slug}/presentacion`
    return {
      title: 'Presentación', // el layout raíz agrega « | CreaTuActivo» (template)
      description: OG_PRESENTACION.description,
      robots: { index: false },
      alternates: { canonical: url },
      openGraph: {
        type: 'website',
        siteName: 'CreaTuActivo.com',
        locale: 'es_CO',
        url,
        title: OG_PRESENTACION.title,
        description: OG_PRESENTACION.description,
        images: [{ url: OG_PRESENTACION.image, width: 1200, height: 630, alt: OG_PRESENTACION.alt }],
      },
      twitter: { card: 'summary_large_image', title: OG_PRESENTACION.title, description: OG_PRESENTACION.description },
    }
  }

  return {
    title: 'Redirigiendo... | CreaTuActivo',
    robots: { index: false },
  }
}
