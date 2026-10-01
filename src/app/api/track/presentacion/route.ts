/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * POST /api/track/presentacion — hasta dónde llegó la persona en /presentacion.
 *
 * Hasta el 1 oct 2026 de quien abría la presentación solo se sabía la página y
 * el tiempo: un visitante la abrió a las 00:50 y no había forma de saber si pasó
 * de la primera pantalla o si llegó a la última, donde está el botón para
 * escribirle al socio. Merge SIN RETROCEDER sobre device_info, como los reels.
 *
 * Campos en device_info — contrato con el webhook del Dashboard
 * (queswa.app, src/app/api/webhooks/prospect/route.ts). NO renombrar:
 *   presentacion_pantalla  number  la pantalla más lejana que vio (Math.max)
 *   presentacion_completa  bool    llegó a la última pantalla  → push «Vio la presentación completa»
 *   presentacion_whatsapp  bool    tocó el botón de WhatsApp   → push «Quiere escribirle»
 *   dispositivo_del_socio  bool    escribió un nombre en la demo de la última
 *                                  pantalla: es el socio presentando en vivo,
 *                                  y el Dashboard deja de avisar por esa ficha
 *
 * ⚠️ Cada escritura dispara el webhook de Supabase: la página escribe solo en
 * hitos (pantallas 4, 7 y la última), al tocar el botón y al usar la demo.
 *
 * Body: { fingerprint, pantalla?, completa?, whatsapp?, en_vivo? }
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { fingerprint, pantalla, completa, whatsapp, en_vivo } = await request.json()
    if (!fingerprint || typeof fingerprint !== 'string') {
      return NextResponse.json({ error: 'Missing fingerprint' }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data: existing } = await supabase
      .from('prospects').select('device_info').eq('fingerprint_id', fingerprint).maybeSingle()
    // Sin ficha no se crea una: la huella la registra tracking.js al cargar la
    // página, y una fila nacida aquí no tendría socio ni primera visita.
    if (!existing) return NextResponse.json({ ok: true, skipped: 'sin ficha' })
    const di = (existing.device_info as Record<string, unknown>) || {}

    const data: Record<string, unknown> = {}
    if (typeof pantalla === 'number' && Number.isInteger(pantalla) && pantalla >= 1 && pantalla <= 30) {
      const previa = typeof di.presentacion_pantalla === 'number' ? di.presentacion_pantalla : 0
      if (pantalla > previa) data.presentacion_pantalla = pantalla
    }
    if (completa === true && di.presentacion_completa !== true) data.presentacion_completa = true
    if (whatsapp === true && di.presentacion_whatsapp !== true) data.presentacion_whatsapp = true
    if (en_vivo === true && di.dispositivo_del_socio !== true) data.dispositivo_del_socio = true

    if (Object.keys(data).length === 0) return NextResponse.json({ ok: true, skipped: true })

    const { error } = await (supabase.rpc as any)('update_prospect_data', {
      p_fingerprint_id: fingerprint,
      p_data: data,
      p_constructor_id: undefined,
    })
    if (error) {
      console.error('❌ [track/presentacion] RPC error:', error)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }
    console.log(`✅ [track/presentacion] ${fingerprint.slice(0, 12)}… ${Object.keys(data).join(',')}`)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ [track/presentacion] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
