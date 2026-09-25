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
import { OG_PITCH_DECK } from '@/app/pitch-deck/og'

const esPitchDeck = (destino: string) => destino === 'pitch-deck' || destino === 'deck'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Mapa: destino corto → ruta real en creatuactivo.com
const DESTINO_MAP: Record<string, (constructorId: string) => string> = {
  'calculadora':   (id) => `/calculadora/${id}`,
  'productos':     (id) => `/productos/${id}`,
  'servilleta':    (id) => `/servilleta/${id}`,
  'home':          (id) => `/?ref=${id}`,
  'fundadores':    (id) => `/fundadores/${id}`,
  'fundadores-pro':(id) => `/fundadores-profesionales/${id}`,
  'red':           (id) => `/fundadores-network/${id}`,
  // Legado — siguen funcionando si alguien tiene el link guardado
  'video-plan-servilleta': (id) => `/video-plan-servilleta?ref=${id}`,
  'video-plan':            (id) => `/video-plan-servilleta?ref=${id}`,
  'presentacion':  (id) => `/presentacion-empresarial/${id}`,
  'reto':          (id) => `/12-niveles/${id}`,
  '12-niveles':    (id) => `/12-niveles/${id}`,
  // Activación inmediata → página de paquetes (mismo destino que el botón de la servilleta)
  'activacion':    (id) => `/paquetes?ref=${id}`,
  // El pitch deck. ⚠️ Sin esta fila, `/{slug}/pitch-deck` caía al fallback y el
  // distribuidor no tenía forma de compartirlo con su identificador: el chat no
  // recibía `ref`, y el enlace al catálogo salía pelado, sin atribuirle la venta
  // a nadie (auditoría del 23 sep 2026). Es la trampa que el CLAUDE.md advierte.
  'pitch-deck':    (id) => `/pitch-deck?ref=${id}`,
  'deck':          (id) => `/pitch-deck?ref=${id}`,
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

const OG_QUESWA = {
  title: 'Hable con Queswa por WhatsApp',
  description: 'La inteligencia artificial de CreaTuActivo le explica cómo funciona y le responde a cualquier hora.',
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
}: {
  params: { slug: string; destino: string }
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
  if (destino === 'queswa' || destino === 'acceso') {
    await resolverSlug(slug, destino)

    // ⚠️ Sin emoji, y medido (19 ago 2026). La redirección entrega el carácter
    // bien —`%F0%9F%AA%A2` para 🪢, verificado en la cabecera Location—, pero lo
    // que llega al webhook es U+FFFD: la pre-carga de texto de wa.me destruye
    // cualquier emoji de cuatro bytes. Pasó igual con 👋 durante meses. El
    // primer mensaje de la conversación es el peor lugar para un cuadrito roto,
    // así que aquí va texto limpio; el nudo de la marca vive en las respuestas
    // de Queswa, que salen por la API y sí lo conservan.
    const texto = `Hola Queswa, vengo del enlace de ${slug}`
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

  const destinoReal = resolver(record.constructor_id)

  // 🔴 El pitch deck tampoco redirige a los robots de vista previa (24 sep 2026),
  // por la misma razón que Queswa: un scraper que sigue el 307 arma la tarjeta
  // con el `og:url` de /pitch-deck — SIN el identificador del distribuidor — y
  // Facebook publica ese enlace pelado: la visita no queda atribuida a nadie.
  // Al robot se le sirve esta página mínima con el OG de abajo (url del slug);
  // la persona sigue recibiendo el redirect directo.
  if (esPitchDeck(destino) && esScraperDePreview()) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F1115', color: '#E5E5E5', fontFamily: 'sans-serif' }}>
        <a href={destinoReal} style={{ color: '#C5A059' }}>{OG_PITCH_DECK.title}</a>
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
  // (route handler propio, no la del home: ver el porqué en ese archivo).
  if (destino === 'queswa' || destino === 'acceso') {
    const url = `https://creatuactivo.com/${slug}/${destino}`
    return {
      title: `${OG_QUESWA.title} | CreaTuActivo`,
      description: OG_QUESWA.description,
      robots: { index: false },
      alternates: { canonical: url },
      openGraph: {
        title: OG_QUESWA.title,
        description: OG_QUESWA.description,
        url,
        siteName: 'CreaTuActivo.com',
        images: [{ url: 'https://creatuactivo.com/og/queswa', width: 1200, height: 630, alt: 'Sea dueño de un sistema de distribución que no depende de que usted esté encima' }],
      },
      twitter: { card: 'summary_large_image', title: OG_QUESWA.title, description: OG_QUESWA.description },
    }
  }

  // Tarjeta propia para el pitch deck, con la url DEL SLUG (24 sep 2026). La
  // imagen y el copy son los de /pitch-deck; lo que cambia es el `og:url`, que
  // es lo que Facebook publica. Ver el porqué en el componente, arriba.
  if (esPitchDeck(destino)) {
    const url = `https://creatuactivo.com/${slug}/${destino}`
    return {
      title: `${OG_PITCH_DECK.title} | CreaTuActivo`,
      description: OG_PITCH_DECK.description,
      robots: { index: false },
      alternates: { canonical: url },
      openGraph: {
        type: 'website',
        siteName: 'CreaTuActivo.com',
        locale: 'es_CO',
        url,
        title: OG_PITCH_DECK.title,
        description: OG_PITCH_DECK.description,
        images: [{ url: OG_PITCH_DECK.image, width: 1200, height: 630, alt: OG_PITCH_DECK.alt }],
      },
      twitter: { card: 'summary_large_image', title: OG_PITCH_DECK.title, description: OG_PITCH_DECK.description },
    }
  }

  return {
    title: 'Redirigiendo... | CreaTuActivo',
    robots: { index: false },
  }
}
