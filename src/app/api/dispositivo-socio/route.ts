/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * POST /api/dispositivo-socio — marca la ficha de ESTE navegador como dispositivo
 * del socio (`device_info.dispositivo_del_socio`), y el webhook de prospectos del
 * Dashboard deja de avisar por ella. La llama /mi-dispositivo. Por qué y cómo se
 * firma → src/lib/dispositivo-socio.ts.
 *
 * Body: { fingerprint, c: constructor_id, f: firma }
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verificarFirmaDispositivo } from '@/lib/dispositivo-socio'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { fingerprint, c, f } = await request.json()
    if (typeof fingerprint !== 'string' || !fingerprint || typeof c !== 'string' || typeof f !== 'string') {
      return NextResponse.json({ ok: false, error: 'datos incompletos' }, { status: 400 })
    }
    const constructorId = c.trim().toLowerCase()
    if (!(await verificarFirmaDispositivo(constructorId, f.trim()))) {
      return NextResponse.json({ ok: false, error: 'firma inválida' }, { status: 403 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data: ficha } = await supabase
      .from('prospects').select('device_info').eq('fingerprint_id', fingerprint).maybeSingle()
    // La ficha la crea tracking.js al cargar la página; sin ella no hay qué marcar.
    if (!ficha) return NextResponse.json({ ok: false, error: 'sin ficha' }, { status: 409 })

    const { error } = await (supabase.rpc as any)('update_prospect_data', {
      p_fingerprint_id: fingerprint,
      p_data: { dispositivo_del_socio: true, dispositivo_de: constructorId },
      p_constructor_id: undefined,
    })
    if (error) {
      console.error('❌ [dispositivo-socio] RPC error:', error)
      return NextResponse.json({ ok: false, error: 'DB error' }, { status: 500 })
    }
    console.log(`✅ [dispositivo-socio] ${fingerprint.slice(0, 12)}… marcado como dispositivo de ${constructorId}`)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ [dispositivo-socio] Error:', error)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}
