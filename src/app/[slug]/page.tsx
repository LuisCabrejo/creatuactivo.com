/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * creatuactivo.com/{slug} — el enlace del socio sin la parte final (16 oct 2026).
 *
 * La mini-landing personal que vivía aquí se eliminó el 8 jul 2026 (e83be54) y
 * nadie redirigió su dirección: quien recortaba el enlace del socio —o el socio
 * que compartía solo creatuactivo.com/su-nombre— caía en el 404 por defecto de
 * Next.js, en inglés, y la visita no quedaba a nombre de nadie. Desde hoy recibe
 * el mismo trato que un destino desconocido en [slug]/[destino]: la Home con el
 * `ref` del socio.
 *
 * Reconoce el slug, el constructor_id (luis-cabrejo-1288) y el seudónimo anterior
 * de un socio que lo cambió (constructor_slug_aliases). Lo demás —/ia,
 * /wp-login.php— sigue al 404 (src/app/not-found.tsx).
 *
 * ⚠️ Esta ruta atrapa TODO primer segmento que no sea una página: las rutas
 * estáticas, las redirecciones de next.config.js y los archivos de public/ ganan
 * antes. Por eso la forma se revisa antes de consultar: a un robot que tantea
 * /wp-admin.php no le pagamos una consulta a Supabase.
 */

import { createClient } from '@supabase/supabase-js'
import { notFound, redirect } from 'next/navigation'

// Sin esto Next.js guardaría la primera respuesta de cada slug —también el 404
// de un socio que se registra después— en su caché de datos.
export const dynamic = 'force-dynamic'

// La forma de los slugs y de los constructor_id: minúsculas, dígitos y guiones.
// Solo esos caracteres llegan al filtro `.or()` de abajo.
const RE_SLUG = /^[a-z0-9][a-z0-9-]{1,59}$/

async function constructorDelSlug(slug: string): Promise<string | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('constructor_slugs')
    .select('constructor_id')
    .or(`slug.eq.${slug},constructor_id.eq.${slug}`)
    .limit(1)
    .maybeSingle()
  if (data?.constructor_id) return data.constructor_id

  const { data: alias } = await supabase
    .from('constructor_slug_aliases')
    .select('constructor_id')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle()
  return alias?.constructor_id ?? null
}

export default async function SlugSinDestino({ params }: { params: { slug: string } }) {
  let slug = params.slug
  try { slug = decodeURIComponent(slug) } catch { /* se queda como llegó */ }
  slug = slug.toLowerCase()

  if (!RE_SLUG.test(slug)) notFound()

  const constructorId = await constructorDelSlug(slug)
  if (!constructorId) notFound()

  redirect(`/?ref=${constructorId}`)
}
