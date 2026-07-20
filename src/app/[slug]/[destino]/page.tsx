/**
 * Copyright © 2026 CreaTuActivo.com
 * Segundo segmento del Propietario — bifurca según el destino:
 *
 *  • destino ∈ REEL_NICHOS  → RENDER página de Reel (creatuactivo.com/{slug}/{nicho})
 *  • resto                  → REDIRECT con tracking (creatuactivo.com/{slug}/auditoria → ?ref=)
 */

import { createClient } from '@supabase/supabase-js'
import { notFound, redirect } from 'next/navigation'
import { REEL_NICHOS, REEL_ASSETS, REEL_COPY, REEL_POSTER_OG, REEL_POSTER_OVERRIDE, type ReelNicho } from '@/lib/reels'
import ReelPage from '@/components/ReelPage'
import ManifiestoDocument from '@/components/ManifiestoDocument'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Mapa: destino corto → ruta real en creatuactivo.com
const DESTINO_MAP: Record<string, (constructorId: string) => string> = {
  'auditoria':     (id) => `/empresa-digital?ref=${id}`,
  'diagnostico':   (id) => `/diagnostico?ref=${id}`,
  'calculadora':   (id) => `/calculadora/${id}`,
  'productos':     (id) => `/sistema/productos/${id}`,
  'servilleta':    (id) => `/servilleta/${id}`,
  'home':          (id) => `/?ref=${id}`,
  'fundadores':    (id) => `/fundadores/${id}`,
  'fundadores-pro':(id) => `/fundadores-profesionales/${id}`,
  'red':           (id) => `/fundadores-network/${id}`,
  // Auditoría — días individuales
  'dia-1': (id) => `/empresa-digital/dia-1?ref=${id}`,
  'dia-2': (id) => `/empresa-digital/dia-2?ref=${id}`,
  'dia-3': (id) => `/empresa-digital/dia-3?ref=${id}`,
  'dia-4': (id) => `/empresa-digital/dia-4?ref=${id}`,
  'dia-5': (id) => `/empresa-digital/dia-5?ref=${id}`,
  // Legado — siguen funcionando si alguien tiene el link guardado
  'video-plan-servilleta': (id) => `/video-plan-servilleta?ref=${id}`,
  'video-plan':            (id) => `/video-plan-servilleta?ref=${id}`,
  'presentacion':  (id) => `/presentacion-empresarial/${id}`,
  'reto':          (id) => `/12-niveles/${id}`,
  'activacion':    (id) => `/empresa-digital?ref=${id}`,
}

function isReelNicho(destino: string): destino is ReelNicho {
  return (REEL_NICHOS as readonly string[]).includes(destino)
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

  return {
    title: 'Redirigiendo... | CreaTuActivo',
    robots: { index: false },
  }
}
