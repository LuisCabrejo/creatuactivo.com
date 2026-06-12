/**
 * POST /api/track/engagement
 *
 * Registra el engagement del prospecto en la página de reel (/{slug}/{nicho}).
 * Hace merge SIN RETROCEDER sobre device_info y actualiza vía RPC update_prospect_data.
 * El cambio dispara el webhook de Supabase → push notification al arquitecto en queswa.app.
 *
 * Contrato de datos (campos en device_info — NO renombrar, son contrato cerrado con el Dashboard):
 *   reel_nicho      string        qué reel
 *   reel_pct        number 0-100  máx % visto (Math.max)
 *   reel_completed  bool          llegó al final            → push "Vio el reel completo"
 *   reel_time_s     number        segundos activos (Math.max)
 *   queswa_opened   bool          abrió el chat Queswa      → push "Abrió Queswa"
 *   queswa_messages number        nº mensajes enviados (Math.max)
 *   visit_count     number        nº de sesiones (Math.max) → push "Volvió a visitar"
 *
 * Body: { fingerprint, nicho, pct?, completed?, time_s?, queswa_opened?, queswa_messages?, visit_count? }
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
    const {
      fingerprint,
      nicho,
      pct,
      completed,
      time_s,
      queswa_opened,
      queswa_messages,
      visit_count,
    } = await request.json()

    if (!fingerprint) {
      return NextResponse.json({ error: 'Missing fingerprint' }, { status: 400 })
    }

    const supabase = getSupabase()

    // device_info actual para hacer merge sin retroceder.
    // device_info vive en `prospects` (keyed por fingerprint_id) — NO en nexus_prospects.
    // update_prospect_data hace `device_info || p_data` (merge shallow por clave), así que
    // sin este Math.max una sesión posterior con menor reel_pct/time_s pisaría el valor mayor.
    const { data: existing } = await supabase
      .from('prospects')
      .select('device_info')
      .eq('fingerprint_id', fingerprint)
      .maybeSingle()

    const di = (existing?.device_info as any) || {}

    // Merge sin retroceder: Math.max para numéricos, OR lógico para bool
    const data: Record<string, any> = {}
    if (typeof nicho === 'string') data.reel_nicho = nicho
    if (typeof pct === 'number') data.reel_pct = Math.max(di.reel_pct ?? 0, pct)
    if (typeof time_s === 'number') data.reel_time_s = Math.max(di.reel_time_s ?? 0, time_s)
    if (typeof queswa_messages === 'number') data.queswa_messages = Math.max(di.queswa_messages ?? 0, queswa_messages)
    if (typeof visit_count === 'number') data.visit_count = Math.max(di.visit_count ?? 0, visit_count)
    if (completed === true) data.reel_completed = true
    if (queswa_opened === true) data.queswa_opened = true

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const { error } = await (supabase.rpc as any)('update_prospect_data', {
      p_fingerprint_id: fingerprint,
      p_data: data,
      p_constructor_id: undefined,
    })

    if (error) {
      console.error('❌ [track/engagement] RPC error:', error)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    console.log(`✅ [track/engagement] fingerprint=${fingerprint.slice(0, 12)}… nicho=${nicho} keys=${Object.keys(data).join(',')}`)
    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('❌ [track/engagement] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
