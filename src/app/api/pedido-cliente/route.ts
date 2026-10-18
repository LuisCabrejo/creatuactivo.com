/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * /api/pedido-cliente — el cliente de un distribuidor paga su pedido DIRECTO a
 * Gano Excel (17 oct 2026, decisión del Director).
 *
 * Quien arma un pedido en el catálogo de un socio elige, en igualdad, entre pagar
 * con su distribuidor (el flujo de WhatsApp de siempre) o pagar a Gano Excel. Esto
 * es lo segundo: queswa.app crea la orden en la cuenta del distribuidor, con envío
 * a nombre y dirección del cliente, y el cliente paga por PSE (enlace al banco) o
 * en efectivo (consigna con el número de orden). Funciona por defecto para todo
 * socio que tenga su contraseña de Gano guardada en queswa.app; sin ella, el
 * catálogo solo ofrece pagar con el socio.
 *
 *   GET  ?ref=slug|constructor_id       → { pagoGano, nombre }
 *   GET  ?pedido=codigo-firma           → { lineas, nombre, telefono, ref }: el pedido
 *                                         que Queswa tomó por WhatsApp, para abrir el
 *                                         catálogo con el carrito ya puesto.
 *   POST { ref, accion: 'cotizar'|'pagar', carrito | pedido, cliente, direccion, pago?, banco? }
 *        → pasa al Dashboard (POST /api/gano/pedido-cliente, llave del puente) y
 *          devuelve su respuesta tal cual. Con `pagar`, registra el pedido en
 *          wa_pedidos (si vino de la web) y le avisa al socio por WhatsApp.
 *
 * El navegador del cliente nunca habla con queswa.app: la llave del puente vive aquí.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { resolverRef, tienePagoGano, nombreVisible, type SocioRef } from '@/lib/socio-ref'
import { lineasAItemsGano } from '@/lib/gano-inventario'
import { firmaPedido, registrarPedido, resumenLineas, telefonoLegible, mismoNumero, type LineaPedido } from '@/lib/wa-pedido'
import { PRODUCTOS_WA } from '@/lib/wa-productos'
import { sendTemplate, sendText } from '@/lib/wa-channel'
import { enVentanaPorTelefono } from '@/lib/wa-ventana'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120

const DASHBOARD_URL = () => (process.env.DASHBOARD_URL || 'https://queswa.app').replace(/\/$/, '')
const RE_CLAVE = /^(\d{5})-([A-Za-z0-9_-]{10})$/

const supabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

interface Cliente { nombre?: string; telefono?: string; tipoDoc?: string; cedula?: string; email?: string }
interface Direccion { departamento?: string; municipio?: string; linea1?: string; linea2?: string }
interface Body {
  ref?: string
  accion?: 'cotizar' | 'pagar'
  carrito?: { id?: string; cantidad?: number }[]
  pedido?: string            // «codigo-firma», cuando el pedido lo tomó Queswa por WhatsApp
  cliente?: Cliente
  direccion?: Direccion
  pago?: 'pse' | 'efectivo'
  banco?: string
  /** El envío que la hoja le mostró al cliente (tarifa de gano-inventario.ts). */
  fleteMostrado?: number
  fingerprint?: string
}

type FilaPedido = { id: string; codigo: string; nombre: string | null; whatsapp: string; constructor_id: string | null; estado: string; lineas: { slug: string; nombre: string; cantidad: number; precio_cop: number }[] }

async function pedidoPorClave(clave: string | null | undefined): Promise<FilaPedido | null> {
  const m = RE_CLAVE.exec(clave || '')
  if (!m || (await firmaPedido(m[1])) !== m[2]) return null
  const { data } = await supabase().from('wa_pedidos').select('id, codigo, nombre, whatsapp, constructor_id, estado, lineas').eq('codigo', m[1]).maybeSingle()
  return (data as FilaPedido | null) ?? null
}

const telefono10 = (t: string) => { const d = String(t || '').replace(/\D/g, ''); return d.length === 12 && d.startsWith('57') ? d.slice(2) : d }

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const clave = url.searchParams.get('pedido')
  if (clave) {
    const p = await pedidoPorClave(clave)
    if (!p) return NextResponse.json({ error: 'pedido_invalido' }, { status: 404 })
    const socio = p.constructor_id ? await resolverRef(p.constructor_id) : null
    return NextResponse.json({
      codigo: p.codigo,
      lineas: (p.lineas || []).map((l) => ({ id: l.slug, cantidad: l.cantidad })),
      nombre: p.nombre ?? '',
      telefono: /^\d{8,15}$/.test(String(p.whatsapp || '').replace(/\D/g, '')) ? telefono10(p.whatsapp) : '',
      ref: socio?.slug ?? socio?.constructorId ?? null,
      estado: p.estado,
    })
  }
  const socio = await resolverRef(url.searchParams.get('ref'))
  if (!socio) return NextResponse.json({ pagoGano: false }, { status: 404 })
  return NextResponse.json({ pagoGano: await tienePagoGano(socio.constructorId), nombre: nombreVisible(socio.nombre).nombre })
}

export async function POST(request: NextRequest) {
  let body: Body
  try { body = await request.json() } catch { return NextResponse.json({ success: false, motivo: 'body_invalido', error: 'Cuerpo inválido.' }, { status: 400 }) }
  const accion = body.accion === 'pagar' ? 'pagar' : body.accion === 'cotizar' ? 'cotizar' : null
  if (!accion) return NextResponse.json({ success: false, motivo: 'accion_invalida', error: 'Acción inválida.' }, { status: 400 })

  // ── El pedido: el de WhatsApp (por clave firmada) o el carrito de la web ──
  const pedidoWa = body.pedido ? await pedidoPorClave(body.pedido) : null
  if (body.pedido && !pedidoWa) return NextResponse.json({ success: false, motivo: 'pedido_invalido', error: 'Este enlace de pedido no es válido.' }, { status: 404 })
  const lineasCrudas = pedidoWa
    ? (pedidoWa.lineas || []).map((l) => ({ slug: l.slug, cantidad: l.cantidad }))
    : (body.carrito || []).map((l) => ({ id: String(l.id || ''), cantidad: Number(l.cantidad) }))
  const { items, desconocidos } = lineasAItemsGano(lineasCrudas)
  if (desconocidos.length) return NextResponse.json({ success: false, motivo: 'producto_desconocido', error: `No reconocemos ${desconocidos.join(', ')}.` }, { status: 400 })
  if (!items.length) return NextResponse.json({ success: false, motivo: 'carrito_vacio', error: 'El pedido está vacío.' }, { status: 400 })

  // ── El socio ──
  const socio: SocioRef | null = await resolverRef(body.ref || pedidoWa?.constructor_id || '')
  if (!socio) return NextResponse.json({ success: false, motivo: 'socio_invalido', error: 'No encontramos al distribuidor de este catálogo.' }, { status: 404 })
  if (!(await tienePagoGano(socio.constructorId))) {
    return NextResponse.json({ success: false, motivo: 'sin_pago_gano', error: `${nombreVisible(socio.nombre).primerNombre} todavía no tiene activo el pago directo a Gano Excel. Puede pagar con ${nombreVisible(socio.nombre).primerNombre} por WhatsApp.` }, { status: 409 })
  }

  const cliente: Cliente = {
    nombre: String(body.cliente?.nombre || pedidoWa?.nombre || '').trim(),
    telefono: telefono10(String(body.cliente?.telefono || pedidoWa?.whatsapp || '')),
    tipoDoc: body.cliente?.tipoDoc, cedula: body.cliente?.cedula, email: body.cliente?.email,
  }

  // Con `pagar` desde la web, el pedido se registra ANTES de ir a Gano (como los de
  // WhatsApp): así el Dashboard anota su número y el socio lo encuentra en su historial.
  let codigo = pedidoWa?.codigo ?? null
  let pedidoWebId: string | null = null
  const lineasPedido: LineaPedido[] = lineasCrudas
    .map((l) => ({ producto: PRODUCTOS_WA.find((p) => p.slug === (('slug' in l ? l.slug : l.id) || '')), cantidad: l.cantidad }))
    .filter((l): l is LineaPedido => Boolean(l.producto) && l.cantidad > 0)
  if (accion === 'pagar' && !pedidoWa && lineasPedido.length) {
    const sb = supabase()
    const registro = await registrarPedido(sb, {
      fingerprint: String(body.fingerprint || `web_${Date.now()}`).slice(0, 80),
      whatsapp: cliente.telefono && cliente.telefono.length === 10 ? `57${cliente.telefono}` : (cliente.telefono || 'sin_telefono'),
      nombre: cliente.nombre || undefined,
      lineas: lineasPedido,
      socio: { nombre: nombreVisible(socio.nombre).nombre, whatsapp: socio.whatsapp ?? undefined, constructorId: socio.constructorId, slug: socio.slug },
    })
    codigo = registro?.codigo ?? null
    pedidoWebId = registro?.id ?? null
  }

  // ── Al Dashboard ──
  const secreto = process.env.WA_BRIDGE_SECRET?.trim()
  if (!secreto) return NextResponse.json({ success: false, motivo: 'sin_llave', error: 'El puente no está configurado.' }, { status: 503 })
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), 115_000)
  let status = 502
  let json: Record<string, unknown> = { success: false, motivo: 'puente', error: 'No se pudo hablar con queswa.app. Vuelva a intentar en un momento.' }
  try {
    const r = await fetch(`${DASHBOARD_URL()}/api/gano/pedido-cliente`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-wa-bridge-secret': secreto },
      body: JSON.stringify({
        constructorId: socio.constructorId, accion, items, cliente,
        direccion: body.direccion, pago: body.pago, banco: body.banco, fleteMostrado: body.fleteMostrado,
        pedidoCodigo: codigo, origen: pedidoWa ? 'whatsapp' : 'web',
      }),
      signal: ctl.signal,
      cache: 'no-store',
    })
    status = r.status
    json = (await r.json().catch(() => json)) as Record<string, unknown>
  } catch (e) {
    console.error('❌ [Pedido cliente] el puente a queswa.app falló:', e instanceof Error ? e.message : e)
  } finally {
    clearTimeout(t)
  }

  if (accion === 'pagar') {
    const ok = status === 200 && json.success === true
    const sb = supabase()
    if (!ok && pedidoWebId) {
      // El pedido de la web que no llegó a Gano no se queda como «pendiente» de nadie.
      await sb.from('wa_pedidos').update({ estado: 'fallido_gano' }).eq('id', pedidoWebId)
    }
    if (ok) await avisarAlSocio(socio, cliente, lineasPedido, String(json.orderNumber ?? ''), body.pago === 'pse' ? 'pse' : 'efectivo', codigo, `$${Math.round(Number(json.total) || 0).toLocaleString('es-CO')} COP`, sb)
  }
  return NextResponse.json(json, { status })
}

/**
 * El socio se entera por WhatsApp de que un cliente suyo compró directo a Gano.
 * Dentro de la ventana de 24 h va el texto. Fuera de ella, por ahora NADA por
 * WhatsApp: el push al Centro de Mando (lo manda queswa.app) es el aviso. 🔴 El
 * 17 oct 2026 este aviso salió con `pre_afiliacion_nueva`, la plantilla genérica
 * de respaldo de los demás avisos, y el Director leyó en su WhatsApp un mensaje
 * que hablaba de una pre-afiliación por una compra: un aviso de compra tiene que
 * hablar de una compra. La plantilla propia `pedido_pagado_gano_v1` (UTILITY,
 * aprobada el 18 oct 2026; scripts/someter-plantilla-pedido-gano.mjs) va fuera de
 * la ventana; sin `WA_PLANTILLA_PEDIDO_GANO` en Vercel ese envío se omite y queda
 * solo el push. Nunca tumba la respuesta al cliente.
 */
// Nombre de la plantilla UTILITY del pedido pagado a Gano (ver arriba).
const PLANTILLA_PEDIDO_GANO = process.env.WA_PLANTILLA_PEDIDO_GANO?.trim() || ''
async function avisarAlSocio(socio: SocioRef, cliente: Cliente, lineas: LineaPedido[], orden: string, pago: 'pse' | 'efectivo', codigo: string | null, total: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sb: any): Promise<void> {
  if (!socio.whatsapp) return
  const telCliente = cliente.telefono ? `57${cliente.telefono}` : ''
  if (telCliente && mismoNumero(socio.whatsapp, telCliente)) return
  const nombre = cliente.nombre || 'Sin nombre'
  const que = resumenLineas(lineas).slice(0, 200)
  const como = pago === 'pse'
    ? `paga por PSE directo a Gano Excel (orden #${orden}). Gano lo despacha a su dirección; usted no tiene que hacer nada.`
    : `consigna a Gano Excel en efectivo con la orden #${orden}. Gano lo despacha cuando registre el pago; usted no tiene que hacer nada.`
  try {
    const digitos = String(socio.whatsapp).replace(/\D/g, '')
    if (await enVentanaPorTelefono(sb, digitos).catch(() => false)) {
      const texto = [
        `*Pedido${codigo ? ` N.º ${codigo}` : ''} de su catálogo, pagado directo a Gano Excel*`,
        '',
        `Cliente: ${nombre}${telCliente ? `, ${telefonoLegible(telCliente)}` : ''}`,
        que,
        '',
        `${nombre.split(/\s+/)[0]} ${como}`,
      ].join('\n')
      const r = await sendText(socio.whatsapp, texto)
      if (r.ok) return
    }
    if (!PLANTILLA_PEDIDO_GANO) {
      console.log(`📨 [Pedido cliente] ${socio.nombre} está fuera de la ventana de 24 h y no hay plantilla propia: el aviso va solo por push.`)
      return
    }
    // {{1}} N.º de pedido · {{2}} cliente y celular · {{3}} productos y forma de pago · {{4}} total
    const r = await sendTemplate(socio.whatsapp, PLANTILLA_PEDIDO_GANO, 'es', [
      codigo || orden,
      `${nombre}${telCliente ? `, ${telefonoLegible(telCliente)}` : ''}`,
      `${que} · ${pago === 'pse' ? 'paga por PSE' : 'consigna en efectivo'}`,
      total,
    ])
    console.log(`📨 [Pedido cliente] Aviso al socio ${socio.nombre} (${PLANTILLA_PEDIDO_GANO}): ${r.ok ? 'enviado' : r.error}`)
  } catch (err) {
    console.error('❌ [Pedido cliente] No se pudo avisar al socio:', err)
  }
}
