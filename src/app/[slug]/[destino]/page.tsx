/**
 * Copyright © 2026 CreaTuActivo.com
 * Redirección de destinos del Arquitecto de Patrimonio
 *
 * Ruta: creatuactivo.com/luis-cabrejo/presentacion
 * → Resuelve el constructor_id del slug
 * → Redirige a la página real con el constructor_id para tracking
 */

import { createClient } from '@supabase/supabase-js'
import { notFound, redirect } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Mapa: destino corto → ruta real en creatuactivo.com
const DESTINO_MAP: Record<string, (constructorId: string) => string> = {
  'auditoria':     (id) => `/auditoria-patrimonial?ref=${id}`,
  'productos':     (id) => `/sistema/productos/${id}`,
  'servilleta':    (id) => `/servilleta/${id}`,
  'fundadores':    (id) => `/fundadores/${id}`,
  'fundadores-pro':(id) => `/fundadores-profesionales/${id}`,
  'red':           (id) => `/fundadores-network/${id}`,
  // Legado — siguen funcionando si alguien tiene el link guardado
  'presentacion':  (id) => `/presentacion-empresarial/${id}`,
  'reto':          (id) => `/reto-12-niveles/${id}`,
  'activacion':    (id) => `/auditoria-patrimonial?ref=${id}`,
}

export default async function DestinoRedirect({
  params,
}: {
  params: { slug: string; destino: string }
}) {
  const { slug, destino } = params

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

  const destination = resolver(record.constructor_id)
  redirect(destination)
}

// Metadata mínima para el período entre request y redirect
export async function generateMetadata() {
  return {
    title: 'Redirigiendo... | CreaTuActivo',
    robots: { index: false },
  }
}
