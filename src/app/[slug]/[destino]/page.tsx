/**
 * Copyright © 2026 CreaTuActivo.com
 * Segundo segmento del Propietario — bifurca según el destino:
 *
 *  • destino ∈ REEL_NICHOS  → RENDER página de Reel (creatuactivo.com/{slug}/{nicho})
 *  • resto                  → REDIRECT con tracking (creatuactivo.com/{slug}/auditoria → ?ref=)
 */

import { createClient } from '@supabase/supabase-js'
import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { REEL_NICHOS, REEL_ASSETS, REEL_COPY, REEL_POSTER_OG, REEL_POSTER_OVERRIDE, type ReelNicho } from '@/lib/reels'
import ReelPage from '@/components/ReelPage'
import ManifiestoDocument from '@/components/ManifiestoDocument'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Mapa: destino corto → ruta real en creatuactivo.com
const DESTINO_MAP: Record<string, (constructorId: string) => string> = {
  'calculadora':   (id) => `/calculadora/${id}`,
  'productos':     (id) => `/sistema/productos/${id}`,
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
// configurado en private_users (mismo default que /sistema/productos)
const WHATSAPP_ORGANICO_DEFAULT = '+573206805737'

export default async function DestinoRoute({
  params,
}: {
  params: { slug: string; destino: string }
}) {
  const { slug, destino } = params

  // ── Caso Reel: renderiza la página (NO redirige) ───────────────
  if (isReelNicho(destino)) {
    const { data: c } = await supabase
      .from('constructor_slugs')
      .select('display_name, foto_url, constructor_id')
      .eq('slug', slug)
      .single()

    if (!c) notFound()

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

  // ── Caso Manifiesto: renderiza el Documento Fundacional (NO redirige) ──
  // URL limpia /{slug}/manifiesto; el ref se inyecta a localStorage (sin ?ref).
  if (destino === 'manifiesto') {
    const { data: c } = await supabase
      .from('constructor_slugs')
      .select('constructor_id, display_name')
      .eq('slug', slug)
      .single()

    if (!c) notFound()

    // WhatsApp del arquitecto (fuente de verdad: private_users), fallback orgánico
    const { data: pu } = await supabase
      .from('private_users')
      .select('whatsapp')
      .eq('constructor_id', c.constructor_id)
      .single()

    return (
      <ManifiestoDocument
        refId={c.constructor_id}
        slug={slug}
        whatsapp={pu?.whatsapp || WHATSAPP_ORGANICO_DEFAULT}
        architectName={c.display_name}
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
    const { data: c } = await supabase
      .from('constructor_slugs')
      .select('constructor_id')
      .eq('slug', slug)
      .single()

    if (!c) notFound()

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
  const { data: record } = await supabase
    .from('constructor_slugs')
    .select('constructor_id')
    .eq('slug', slug)
    .single()

  if (!record) notFound()

  // 2. Resolver destino → ruta real
  const resolver = DESTINO_MAP[destino]
  if (!resolver) {
    // Destino desconocido → home con tracking (la mini-landing /{slug} se eliminó)
    redirect(`/?ref=${record.constructor_id}`)
  }

  redirect(resolver(record.constructor_id))
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

  if (destino === 'manifiesto') {
    return {
      title: 'Manifiesto de los Fundadores | CreaTuActivo',
      description: 'Las cosas no pasan. Se hacen pasar. La historia, el principio y la doctrina detrás de CreaTuActivo — y de quién se requiere para construirlo.',
      robots: { index: false },
      alternates: { canonical: `https://creatuactivo.com/${slug}/manifiesto` },
      openGraph: {
        title: 'Las cosas no pasan. Se hacen pasar.',
        description: 'El Manifiesto de los Fundadores de CreaTuActivo.',
        url: `https://creatuactivo.com/${slug}/manifiesto`,
        siteName: 'CreaTuActivo.com',
        images: [{ url: 'https://creatuactivo.com/manifiesto/opengraph-image', width: 1200, height: 630, alt: 'Manifiesto de los Fundadores' }],
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
        images: [{ url: 'https://creatuactivo.com/og/queswa', width: 1200, height: 630, alt: 'Sea dueño de su propio canal de distribución' }],
      },
      twitter: { card: 'summary_large_image', title: OG_QUESWA.title, description: OG_QUESWA.description },
    }
  }

  return {
    title: 'Redirigiendo... | CreaTuActivo',
    robots: { index: false },
  }
}
