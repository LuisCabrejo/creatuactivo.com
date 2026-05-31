/**
 * Copyright © 2026 CreaTuActivo.com
 * Segundo segmento del Arquitecto de Patrimonio — bifurca según el destino:
 *
 *  • destino ∈ REEL_NICHOS  → RENDER página de Reel (creatuactivo.com/{slug}/{nicho})
 *  • resto                  → REDIRECT con tracking (creatuactivo.com/{slug}/auditoria → ?ref=)
 */

import { createClient } from '@supabase/supabase-js'
import { notFound, redirect } from 'next/navigation'
import { REEL_NICHOS, REEL_ASSETS, REEL_COPY, REEL_POSTER_OG, type ReelNicho } from '@/lib/reels'
import ReelPage from '@/components/ReelPage'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Mapa: destino corto → ruta real en creatuactivo.com
const DESTINO_MAP: Record<string, (constructorId: string) => string> = {
  'auditoria':     (id) => `/auditoria-patrimonial?ref=${id}`,
  'calculadora':   (id) => `/calculadora/${id}`,
  'productos':     (id) => `/sistema/productos/${id}`,
  'servilleta':    (id) => `/servilleta/${id}`,
  'home':          (id) => `/?ref=${id}`,
  'fundadores':    (id) => `/fundadores/${id}`,
  'fundadores-pro':(id) => `/fundadores-profesionales/${id}`,
  'red':           (id) => `/fundadores-network/${id}`,
  // Auditoría — días individuales
  'dia-1': (id) => `/auditoria-patrimonial/dia-1?ref=${id}`,
  'dia-2': (id) => `/auditoria-patrimonial/dia-2?ref=${id}`,
  'dia-3': (id) => `/auditoria-patrimonial/dia-3?ref=${id}`,
  'dia-4': (id) => `/auditoria-patrimonial/dia-4?ref=${id}`,
  'dia-5': (id) => `/auditoria-patrimonial/dia-5?ref=${id}`,
  // Legado — siguen funcionando si alguien tiene el link guardado
  'presentacion':  (id) => `/presentacion-empresarial/${id}`,
  'reto':          (id) => `/reto-12-niveles/${id}`,
  'activacion':    (id) => `/auditoria-patrimonial?ref=${id}`,
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
    // Destino desconocido → volver a la mini-landing
    redirect(`/${slug}`)
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
        // Portada branded única (JPG) — los frames por-nicho se veían borrosos
        images: [{ url: REEL_POSTER_OG, width: 540, height: 960, alt: copy.titulo }],
      },
    }
  }

  return {
    title: 'Redirigiendo... | CreaTuActivo',
    robots: { index: false },
  }
}
