/**
 * POST /api/track/video
 *
 * Registra el avance del prospecto por los videos de la Auditoría Patrimonial.
 * Actualiza device_info.video_dia_actual en nexus_prospects vía RPC update_prospect_data.
 * El cambio dispara el webhook de Supabase → push notification al constructor en queswa.app
 *
 * Body: { fingerprint: string, dia: number, evento: 'play' | 'completado_80' }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const { fingerprint, dia, evento } = await request.json()

    if (!fingerprint || !dia || !evento) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Solo actualizar video_dia_actual cuando el prospecto completa el 80% del video
    // (no en cada "play" para evitar updates innecesarios que disparen el webhook)
    if (evento !== 'completado_80') {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const supabase = getSupabase()

    // Verificar si ya tiene un dia mayor registrado (no retroceder)
    const { data: existing } = await supabase
      .from('nexus_prospects')
      .select('device_info')
      .eq('fingerprint', fingerprint)
      .single()

    const currentDia = (existing?.device_info as any)?.video_dia_actual ?? 0
    if (currentDia >= dia) {
      // Ya está en un día igual o más avanzado — no retroceder
      return NextResponse.json({ ok: true, skipped: true })
    }

    // Actualizar usando el RPC que ya existe
    const { error } = await (supabase.rpc as any)('update_prospect_data', {
      p_fingerprint_id: fingerprint,
      p_data: { video_dia_actual: dia },
      p_constructor_id: undefined,
    })

    if (error) {
      console.error('❌ [track/video] RPC error:', error)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    console.log(`✅ [track/video] fingerprint=${fingerprint.slice(0, 12)}… día=${dia}`)
    return NextResponse.json({ ok: true, dia })

  } catch (error) {
    console.error('❌ [track/video] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
