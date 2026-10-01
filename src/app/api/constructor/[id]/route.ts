/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * API Endpoint: /api/constructor/[id]
 * Obtiene datos públicos de un constructor por su constructor_id
 * Usa SERVICE_ROLE_KEY para bypasear RLS
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const constructorId = params.id

    console.log('🔍 [API Constructor] Buscando:', constructorId)

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!SUPABASE_URL || !SERVICE_KEY) {
      console.error('❌ [API Constructor] Faltan variables de entorno')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Consultar Supabase con SERVICE_ROLE_KEY (bypasea RLS)
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/private_users?constructor_id=eq.${encodeURIComponent(constructorId)}&select=name,whatsapp`,
      {
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`
        }
      }
    )

    if (!response.ok) {
      console.error('❌ [API Constructor] Error en Supabase:', response.status)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      console.log('ℹ️ [API Constructor] No encontrado:', constructorId)
      return NextResponse.json(
        { error: 'Constructor not found' },
        { status: 404 }
      )
    }

    const constructor = data[0]
    console.log('✅ [API Constructor] Encontrado:', constructor.name)

    // Solo lo que las páginas MUESTRAN: el nombre y el WhatsApp del socio.
    // ⚠️ El correo salía aquí hasta el 1 oct 2026 y ninguna página lo usaba. El
    // constructor_id va en cada enlace que el socio comparte (?ref=, /productos/…),
    // así que quien recibía un enlace podía sacar el correo de ese socio. Esta
    // ruta lee con la llave de servidor: devuelve lo mínimo, nunca más.
    return NextResponse.json({
      nombre: constructor.name,
      whatsapp: constructor.whatsapp,
    })

  } catch (error) {
    console.error('❌ [API Constructor] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
