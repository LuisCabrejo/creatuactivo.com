/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * POST /api/track/apertura — cada vez que alguien abre Queswa desde el sitio
 * (13 oct 2026, Director: «debemos guardar los datos relacionados al uso de
 * computador o desde el teléfono»).
 *
 * Desde ese día Queswa conversa en la web en el computador y en WhatsApp en el
 * celular. Para saber si la decisión funciona, cada apertura queda en
 * `page_visits` con su dispositivo, a dónde llevó y la cookie del navegador:
 *
 *   origen      'orbe' | 'boton' | 'video' | 'catalogo' | 'pedido' | 'puente' (el
 *               toque del botón del puente, 30 oct 2026). La apertura del enlace del
 *               socio la registra su propia página: [slug]/[destino]/page.tsx, 'enlace'
 *   destino     'whatsapp' | 'web'
 *   dispositivo 'celular' | 'tableta' | 'computador'   — lo decide el SERVIDOR con
 *               la misma regla que el navegador (src/lib/dispositivo.ts)
 *   visitante   la cookie nexus_prospect_id (ck_…): une la apertura con la ficha
 *               web y la de WhatsApp, y por ahí con la conversación
 *
 * Body (sendBeacon): { destino, origen, ruta, ref }
 *
 * No avisa a nadie: `page_visits` no tiene disparadores. Los robots y localhost
 * no se cuentan (entorno-local.ts). Si algo falla, responde 200 igual: medir no
 * puede costar una conversación.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { esPeticionLocal } from '@/lib/entorno-local'
import { dispositivoDe, esRobot, sistemaDe } from '@/lib/dispositivo'

export const runtime = 'edge'

const DESTINOS = new Set(['whatsapp', 'web'])
// 'catalogo' = alguien abrió el catálogo; 'pedido' = tocó «Enviar pedido por WhatsApp»
// (17 oct 2026: hasta entonces no se sabía cuántos carritos se armaban ni cuántos salían).
// 'puente' = tocó «Abrir Queswa en WhatsApp» en el puente del enlace del socio (30 oct 2026).
const ORIGENES = new Set(['orbe', 'boton', 'video', 'catalogo', 'pedido', 'puente'])
const RE_VISITANTE = /^ck_[a-z0-9]{6,12}$/
const RE_REF = /^[a-z0-9-]{2,80}$/i

export async function POST(request: NextRequest) {
  if (esPeticionLocal(request)) return NextResponse.json({ ok: true, skipped: 'local' })
  const agente = request.headers.get('user-agent')
  if (esRobot(agente)) return NextResponse.json({ ok: true, skipped: 'robot' })

  try {
    const cuerpo = await request.json().catch(() => ({}))
    const destino = DESTINOS.has(cuerpo?.destino) ? cuerpo.destino : null
    const origen = ORIGENES.has(cuerpo?.origen) ? cuerpo.origen : null
    if (!destino || !origen) return NextResponse.json({ ok: false, error: 'destino u origen inválido' }, { status: 400 })

    const ruta = typeof cuerpo?.ruta === 'string' && cuerpo.ruta.startsWith('/') ? cuerpo.ruta.slice(0, 200) : '/'
    const ref = typeof cuerpo?.ref === 'string' && RE_REF.test(cuerpo.ref) ? cuerpo.ref : null
    const cookie = request.cookies.get('nexus_prospect_id')?.value
    const visitante = cookie && RE_VISITANTE.test(cookie) ? cookie : null

    // Lo que llevaba el pedido (18 oct 2026): el aviso «Armó un pedido y no lo
    // envió» del Centro de Mando lo nombra. Solo números, acotados.
    const d = cuerpo?.detalle
    const numero = (v: unknown, max: number) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= max ? Math.round(v) : null)
    const detalle = origen === 'pedido' && d && typeof d === 'object'
      ? { productos: numero(d.productos, 50), unidades: numero(d.unidades, 500), total: numero(d.total, 100_000_000) }
      : null

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const fila = {
      session_id: crypto.randomUUID(),
      mentor_ref_id: ref,
      page_entry: ruta,
      dispositivo: dispositivoDe(agente, request.headers.get('sec-ch-ua-mobile')),
      sistema: sistemaDe(agente),
      destino,
      origen,
      visitante,
    }
    let { error } = await supabase.from('page_visits').insert(detalle ? { ...fila, detalle } : fila)
    // Sin la columna `detalle` (Dashboard scripts/33), se guarda la apertura igual.
    if (error && detalle && /detalle/.test(error.message)) ({ error } = await supabase.from('page_visits').insert(fila))
    if (error) console.warn('⚠️ [Apertura Queswa] No se registró:', error.message)
    return NextResponse.json({ ok: !error })
  } catch (e) {
    console.warn('⚠️ [Apertura Queswa] No se registró:', e)
    return NextResponse.json({ ok: false })
  }
}
