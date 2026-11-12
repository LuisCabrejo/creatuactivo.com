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
 *   presentacion_video     {v, seg, dur, enlace?}  la versión del video de la pantalla 1 y el
 *                                  segundo más lejano que vio (2 nov 2026). Sin aviso:
 *                                  lo lee scripts/medir-video-presentacion.mjs
 *   presentacion_paso      {pantalla, beat}  el paso más lejano, beat incluido (6 nov
 *                                  2026). Sin aviso: los hitos no ven dentro de la
 *                                  pantalla 5 (10 beats) ni de la 8 (3). Lo lee
 *                                  scripts/medir-avance-presentacion.mjs
 *
 * ⚠️ Cada escritura dispara el webhook de Supabase: la página escribe solo en
 * hitos (pantallas 4, 6 y la última), al tocar el botón, al usar la demo y, con
 * el paso más lejano, cuando la persona sale de la página o cambia de app.
 *
 * Body: { fingerprint, pantalla?, completa?, whatsapp?, en_vivo?, video?, paso? }
 */
import { NextRequest, NextResponse } from 'next/server'
import { esPeticionLocal } from '@/lib/entorno-local'
import { createClient } from '@supabase/supabase-js'
import { nombrePais } from '@/lib/paises'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  // Localhost no escribe en la base de producción ni avisa a nadie (11 oct 2026, ver entorno-local.ts).
  if (esPeticionLocal(request)) return NextResponse.json({ ok: true, skipped: 'local' })
  try {
    const { fingerprint, pantalla, completa, whatsapp, en_vivo, video, paso } = await request.json()
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
    // Hasta dónde vio la presentación en video (2 nov 2026), sin retroceder dentro de la
    // misma versión; una versión nueva empieza de cero. No avisa: es para medir retención.
    if (video && typeof video.v === 'string' && /^v\d{1,3}$/.test(video.v)
        && Number.isInteger(video.seg) && video.seg >= 0 && video.seg <= 3600
        && Number.isInteger(video.dur) && video.dur > 0 && video.dur <= 3600) {
      const previo = di.presentacion_video as { v?: string; seg?: number; enlace?: boolean } | undefined
      // `enlace` (12 nov 2026): la persona llegó al video por el enlace directo
      // (/{slug}/video → ?video=1), no por el botón de la pantalla 1. Una vez
      // marcado se conserva dentro de la misma versión.
      const enlace = video.enlace === true || (previo?.v === video.v && previo?.enlace === true)
      if (!previo || previo.v !== video.v || video.seg > (previo.seg ?? -1) || (enlace && previo?.enlace !== true)) {
        const seg = previo?.v === video.v ? Math.max(video.seg, previo?.seg ?? 0) : video.seg
        data.presentacion_video = { v: video.v, seg: Math.min(seg, video.dur), dur: video.dur, ...(enlace ? { enlace: true } : {}) }
      }
    }
    // El paso más lejano (6 nov 2026), sin retroceder: una pantalla posterior gana
    // siempre, y en la misma pantalla gana el beat mayor. No avisa: es para medir.
    if (paso && Number.isInteger(paso.pantalla) && paso.pantalla >= 1 && paso.pantalla <= 30
        && Number.isInteger(paso.beat) && paso.beat >= 0 && paso.beat <= 30) {
      const previo = di.presentacion_paso as { pantalla?: number; beat?: number } | undefined
      const pp = previo?.pantalla ?? 0, pb = previo?.beat ?? -1
      if (paso.pantalla > pp || (paso.pantalla === pp && paso.beat > pb)) {
        data.presentacion_paso = { pantalla: paso.pantalla, beat: paso.beat }
      }
    }
    // El país de la conexión, una vez (8 oct 2026): el Dashboard lo pone en el
    // aviso. Solo acompaña a un hito: por sí solo no justifica una escritura.
    const codigoPais = request.headers.get('x-vercel-ip-country')?.toUpperCase()
    if (Object.keys(data).length && codigoPais && !di.pais) {
      data.pais = nombrePais(codigoPais) ?? codigoPais
      data.pais_codigo = codigoPais
    }

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
