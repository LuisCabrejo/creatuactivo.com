/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * GET /pedido/{codigo}-{firma} — el botón [Escribirle] del aviso de pedido al socio
 * (plantilla `pedido_cliente_v1`, src/lib/wa-pedido.ts).
 *
 * Abre el chat de WhatsApp con el comprador y deja escrito el primer mensaje del
 * socio, que cita el número de pedido y lo que pidió: es la prueba de que quien le
 * escribe es quien tiene su pedido. Anota en `wa_pedidos.socio_abrio_at` la primera
 * vez que se abre, para medir cuánto tardan los socios en escribir.
 *
 * La firma (HMAC con WA_BRIDGE_SECRET) es obligatoria: el enlace revela el teléfono
 * del comprador, y cinco cifras solas se podrían adivinar.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { firmaPedido } from '@/lib/wa-pedido'
import { esBsuid } from '@/lib/paises'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const RE_CLAVE = /^(\d{5})-([A-Za-z0-9_-]{10})$/

function pagina(texto: string, status = 200) {
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Pedido</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F7F2EA;color:#2B211A;font-family:system-ui,sans-serif;padding:24px">
<p style="max-width:28rem;font-size:17px;line-height:1.5">${texto}</p></body></html>`
  return new NextResponse(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

function enumerar(partes: string[]): string {
  if (partes.length <= 1) return partes.join('')
  return `${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]}`
}

const pesos = (n: number) => '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

export async function GET(_request: NextRequest, { params }: { params: { clave: string } }) {
  const m = RE_CLAVE.exec(params.clave || '')
  if (!m || (await firmaPedido(m[1])) !== m[2]) {
    return pagina('Este enlace de pedido no es válido.', 404)
  }
  const codigo = m[1]

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: pedido } = await supabase
    .from('wa_pedidos')
    .select('id, whatsapp, nombre, lineas, total_cop, socio, socio_abrio_at')
    .eq('codigo', codigo)
    .maybeSingle()
  if (!pedido) return pagina('No encontramos ese pedido.', 404)

  if (!pedido.socio_abrio_at) {
    await supabase.from('wa_pedidos').update({ socio_abrio_at: new Date().toISOString() }).eq('id', pedido.id)
  }

  // Con nombre de usuario de WhatsApp (BSUID) Meta no muestra el teléfono.
  const telefono = String(pedido.whatsapp || '').replace(/\D/g, '')
  if (esBsuid(String(pedido.whatsapp || '')) || !/^\d{8,15}$/.test(telefono)) {
    return pagina(`El pedido N.º ${codigo} lo hizo alguien que escribe con nombre de usuario de WhatsApp, así que su número no es visible. El equipo de creatuactivo.com puede responderle desde el chat de Queswa.`)
  }

  const primer = String(pedido.nombre || '').trim().split(/\s+/)[0]
  const socio = String(pedido.socio || '').trim().split(/\s+/).slice(0, 2).join(' ')
  const lineas = Array.isArray(pedido.lineas) ? pedido.lineas : []
  const productos = enumerar(lineas.map((l: { cantidad?: number; nombre?: string }) => `${l.cantidad ?? 1} ${l.nombre ?? ''}`.trim()))
  const texto = [
    `Hola${primer ? ` ${primer}` : ''}, ${socio ? `soy ${socio}` : 'le escribo del equipo de creatuactivo.com'}.`,
    `Queswa me pasó su pedido N.º ${codigo}: ${productos}, por ${pesos(Number(pedido.total_cop) || 0)}.`,
    '¿En qué ciudad lo recibe?',
  ].join(' ')

  return NextResponse.redirect(`https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`, 302)
}
