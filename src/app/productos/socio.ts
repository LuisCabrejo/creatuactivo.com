/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El socio dueño de un catálogo, resuelto en el servidor desde el ref de la URL.
 * Lo usan el catálogo del socio (/productos/{slug}, [ref]/page.tsx) y el enlace
 * directo a un producto (/productos/{slug}/{producto}, 29 oct 2026). Salió de
 * [ref]/page.tsx para que los dos resuelvan igual.
 */

import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Socio } from './page'
import { tienePagoGano } from '@/lib/socio-ref'

const RE_REF = /^[a-z0-9-]{2,80}$/

export interface Resuelto { slug: string | null; constructorId: string; nombre: string; foto: string | null; pagoGano: boolean }

/**
 * Resuelve el ref de la URL al socio, UNA vez por petición y en dos idas a la base.
 *
 * 🛑 Hasta el 24 oct 2026 (Director: el catálogo «se siente largo y pesado») esta
 * función corría dos veces por petición —la página y generateMetadata la llamaban
 * por separado— y hacía hasta cuatro consultas EN SERIE cada vez, más una quinta
 * para el pago directo: unas diez idas a Supabase antes del primer byte, con la
 * ruta en `force-dynamic`. Y un enlace viejo con el código pagaba todo eso dos
 * veces: una para el 308 y otra en el slug. Ahora `cache()` de React comparte el
 * resultado entre la página y la metadata dentro de la misma petición, las tres
 * búsquedas del ref (slug vigente · seudónimo anterior · código) salen juntas, y
 * el nombre y el pago directo también.
 */
export const resolver = cache(async (refCrudo: string): Promise<Resuelto | null> => {
  const ref = decodeURIComponent(refCrudo || '').toLowerCase()
  if (!RE_REF.test(ref)) return null
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const columnas = 'slug, constructor_id, foto_url'

  // 1. El slug vigente · 2. un seudónimo anterior · 3. el código — a la vez
  const [porSlug, alias, porCodigo] = await Promise.all([
    supabase.from('constructor_slugs').select(columnas).eq('slug', ref).maybeSingle(),
    supabase.from('constructor_slug_aliases').select('constructor_id').eq('slug', ref).maybeSingle(),
    supabase.from('constructor_slugs').select(columnas).eq('constructor_id', ref).maybeSingle(),
  ])
  let fila = porSlug.data
  if (!fila) {
    if (alias.data?.constructor_id) {
      const id = alias.data.constructor_id
      fila = (await supabase.from('constructor_slugs').select(columnas).eq('constructor_id', id).maybeSingle()).data
        ?? { slug: null, constructor_id: id, foto_url: null }
    } else {
      fila = porCodigo.data ?? { slug: null, constructor_id: ref, foto_url: null }
    }
  }

  const [usuario, pagoGano] = await Promise.all([
    supabase.from('private_users').select('name').eq('constructor_id', fila.constructor_id).maybeSingle(),
    // «Pagar a Gano Excel» (17 oct 2026): solo si el socio tiene su contraseña de Gano guardada.
    tienePagoGano(fila.constructor_id),
  ])
  if (!usuario.data?.name) return null
  return { slug: fila.slug, constructorId: fila.constructor_id, nombre: usuario.data.name, foto: fila.foto_url, pagoGano }
})

export function aSocio(r: Resuelto): Socio {
  const partes = r.nombre.trim().split(/\s+/)
  return { nombre: partes.slice(0, 2).join(' '), primerNombre: partes[0], foto: r.foto, slug: r.slug, constructorId: r.constructorId, pagoGano: r.pagoGano }
}
