/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * GET /api/constructor/{id} — quién atiende un enlace del catálogo.
 *
 * Acepta el constructor_id («luis-cabrejo-1288») o el slug («luis-cabrejo»). Desde
 * el 17 oct 2026 devuelve también el slug y la foto: el catálogo B2C muestra al
 * socio con su cara («Le atiende Luis Cabrejo») y pone el slug —legible— al final
 * del pedido que viaja a WhatsApp, en vez del código interno.
 *
 * Usa la llave de servidor: nunca se expone en el navegador.
 */

import { NextRequest, NextResponse } from 'next/server'

const RE_REF = /^[a-z0-9-]{2,80}$/i

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ref = (params.id || '').toLowerCase()
  if (!RE_REF.test(ref)) return NextResponse.json({ error: 'Referencia inválida' }, { status: 400 })

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('❌ [API Constructor] Faltan variables de entorno')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }
  const headers = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` }
  const leer = async (ruta: string) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${ruta}`, { headers, cache: 'no-store' })
    return r.ok ? ((await r.json()) as any[]) : null
  }

  try {
    // El enlace puede traer el slug: se traduce al constructor_id.
    let slugFila = (await leer(`constructor_slugs?slug=eq.${encodeURIComponent(ref)}&select=slug,constructor_id,display_name,foto_url`))?.[0]
    const constructorId: string = slugFila?.constructor_id ?? ref

    const usuario = (await leer(`private_users?constructor_id=eq.${encodeURIComponent(constructorId)}&select=name,whatsapp`))?.[0]
    if (!usuario) {
      return NextResponse.json({ error: 'Constructor not found' }, { status: 404 })
    }
    if (!slugFila) {
      slugFila = (await leer(`constructor_slugs?constructor_id=eq.${encodeURIComponent(constructorId)}&select=slug,display_name,foto_url`))?.[0]
    }

    // Desde el 17 oct 2026 el catálogo ofrece «Pagar a Gano Excel» solo si el socio
    // tiene su contraseña de Gano guardada en queswa.app (ver src/lib/socio-ref.ts).
    const pagoGano = ((await leer(`gano_credentials?constructor_id=eq.${encodeURIComponent(constructorId)}&select=constructor_id`)) ?? []).length > 0

    return NextResponse.json({
      nombre: usuario.name,
      whatsapp: usuario.whatsapp,
      constructorId,
      slug: slugFila?.slug ?? null,
      foto: slugFila?.foto_url ?? null,
      pagoGano,
    })
  } catch (error) {
    console.error('❌ [API Constructor] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
