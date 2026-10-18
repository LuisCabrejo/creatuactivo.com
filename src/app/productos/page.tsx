/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * CATÁLOGO — la tienda del distribuidor para SUS clientes (B2C).
 *
 * Rehecho el 17 oct 2026 (Director: «es una herramienta de nuestros distribuidores
 * para sus clientes, B2C, pero en este momento parece B2B»). Lo que había, medido
 * en un celular de 390 px: el primer producto aparecía a 4.361 px —cinco pantallas
 * de «ciencia» y «sistemas de bienestar» antes de ver algo que comprar—, una
 * tarjeta por pantalla (26.000 px de página), el botón «ESPECIFICACIONES» en
 * mayúscula mono, el carrito con el encabezado tapado por el menú y los precios
 * con coma o con punto según el idioma del navegador. Y en 60 días, cero pedidos
 * salidos del carrito.
 *
 * Lo que es ahora, en el orden en que se compra:
 *   1. Quién le atiende (el socio, con su nombre) y qué hay aquí, en una pantalla.
 *   2. Las líneas fijas arriba y la vitrina en dos columnas: foto, nombre,
 *      presentación, precio y «Agregar», que se vuelve − 1 + al tocarlo.
 *   3. Una barra abajo con lo que lleva y el total, siempre a la vista.
 *   4. La ficha y el pedido como hojas que suben, sin salir de la página.
 *   5. Después de la vitrina, lo que no vende pero da confianza: cómo sigue el
 *      pedido, el Ganoderma, las preguntas y el puente al negocio.
 *
 * El pedido se termina por WhatsApp con Queswa (src/lib/wa-pedido.ts). El texto
 * pre-escrito NO dice «catálogo»: el nodo 2.24 del conductor contesta con el
 * enlace del catálogo a cualquier mensaje con esa palabra. Las cantidades van
 * con «x» ASCII: `cantidadJunto` no lee «×».
 *
 * Los datos de los 22 productos viven en ./catalogo-datos.ts.
 */

'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, X, ShoppingBag, MessageCircle, ChevronRight, Truck, Store, Factory, Download, Landmark } from 'lucide-react'
import StrategicNavigation from '@/components/StrategicNavigation'
import { productData, LINEAS, MAS_PEDIDO, PREGUNTAS, imagenVitrina, pesos, mensajePedido, type Product, type LineaCarrito } from './catalogo-datos'
// «Pagar a Gano Excel» (17 oct 2026): la hoja de pago directo y el carrito con cantidades en la URL.
import PagoGano, { ESTILOS_PAGO } from './PagoGano'
import { leerCarritoDeUrl } from '@/lib/gano-inventario'

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Linea = LineaCarrito

export interface Socio {
  nombre: string          // «Luis Cabrejo»: nombre y primer apellido
  primerNombre: string    // «Luis»
  foto?: string | null
  slug?: string | null
  constructorId?: string | null
  /** Sus clientes pueden pagar directo a Gano Excel (tiene su contraseña de Gano guardada en queswa.app). */
  pagoGano?: boolean
}

const WHATSAPP_QUESWA = '573215193909'

// Las dos fichas de la máquina que ya tenía el catálogo (Director, 17 oct 2026: se mantienen).
const DESCARGAS_LUVOCO = [
  { texto: 'Ficha de producto', href: 'https://drive.google.com/file/d/13C_CQyXnmeNPqzrsm34GNCIysE-T4p2k/view?usp=drive_link' },
  { texto: 'Especificaciones técnicas', href: 'https://drive.google.com/file/d/12EsTVv_HPTa6xEj505H_Z8XQssYHfSoi/view?usp=drive_link' },
]
const CLAVE_CARRITO = 'carrito_catalogo'
// El estado inicial, por referencia: no se guarda nunca (ver el efecto que persiste).
const CARRITO_INICIAL: LineaCarrito[] = []

// ─── Utilidades ──────────────────────────────────────────────────────────────

function nombreVisible(nombre: string): Pick<Socio, 'nombre' | 'primerNombre'> {
  const partes = nombre.trim().split(/\s+/)
  return { nombre: partes.slice(0, 2).join(' '), primerNombre: partes[0] }
}

function registrarApertura(origen: 'catalogo' | 'pedido', destino: 'web' | 'whatsapp', ref?: string | null) {
  try {
    const cuerpo = JSON.stringify({ origen, destino, ruta: window.location.pathname, ref: ref || undefined })
    if (navigator.sendBeacon) navigator.sendBeacon('/api/track/apertura', new Blob([cuerpo], { type: 'application/json' }))
    else fetch('/api/track/apertura', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: cuerpo, keepalive: true }).catch(() => {})
  } catch { /* medir no puede costar una venta */ }
}

// ─── Página ──────────────────────────────────────────────────────────────────

export default function CatalogoTienda({ socioInicial = null }: { socioInicial?: Socio | null } = {}) {
  const [socio, setSocio] = useState<Socio | null>(socioInicial)
  const [carrito, setCarrito] = useState<Linea[]>(CARRITO_INICIAL)
  const [ficha, setFicha] = useState<string | null>(null)
  const [pedidoAbierto, setPedidoAbierto] = useState(false)
  const [enviado, setEnviado] = useState(false)
  // La hoja del pedido tiene dos pasos: la lista, y «Pagar a Gano Excel» (17 oct 2026).
  const [pasoPedido, setPasoPedido] = useState<'lista' | 'gano'>('lista')
  // El pedido que Queswa tomó por WhatsApp (?pedido=codigo-firma) y los datos que ya dio.
  const [pedidoClave, setPedidoClave] = useState<string | null>(null)
  const [prefill, setPrefill] = useState<{ nombre?: string; telefono?: string } | null>(null)
  const [lineaActiva, setLineaActiva] = useState(LINEAS[0].id)
  const cargado = useRef(false)

  // ── El socio. En /productos/{slug} llega resuelto desde el servidor ([ref]/page.tsx);
  // en /productos, del que trajo a esta persona la última vez (tracking.js lo guarda).
  useEffect(() => {
    let ref: string | null = socioInicial?.constructorId ?? null
    if (ref) {
      try { localStorage.setItem('constructor_ref', ref) } catch { /* sin almacenamiento */ }
    } else {
      try { ref = localStorage.getItem('constructor_ref') } catch { /* sin almacenamiento */ }
      if (ref) {
        fetch(`/api/constructor/${encodeURIComponent(ref)}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            if (!d?.nombre) return
            setSocio({ ...nombreVisible(d.nombre), foto: d.foto ?? null, slug: d.slug ?? null, constructorId: d.constructorId ?? ref, pagoGano: Boolean(d.pagoGano) })
          })
          .catch(() => {})
      }
    }
    registrarApertura('catalogo', 'web', ref)
    if (!ref) return
    // Aviso al socio de que alguien mira su catálogo (una vez por visitante y día, ver /api/funnel)
    const avisar = () => {
      let huella: string | null = null
      try { huella = (window as any).FrameworkIAA?.fingerprint || localStorage.getItem('nexus_fingerprint') } catch { /* nada */ }
      fetch('/api/funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'catalogo-productos', step: 'vio_catalogo', fingerprint: huella, constructor_ref: ref }),
      }).catch(() => {})
    }
    let avisado = false
    const unaVez = () => { if (!avisado) { avisado = true; avisar() } }
    window.addEventListener('nexusTrackingReady', unaVez, { once: true })
    const t = setTimeout(unaVez, 5000)
    return () => { clearTimeout(t); window.removeEventListener('nexusTrackingReady', unaVez) }
  }, [socioInicial?.constructorId])

  // ── El carrito: ?pedido=codigo-firma (el que Queswa tomó por WhatsApp), ?carrito=a,b:2
  // (enlaces armados; «id:cantidad» desde el 17 oct 2026) o lo que la persona dejó la última vez.
  // ?pagar=1 abre la hoja de pago directo a Gano Excel.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const url = params.get('carrito')
    const clave = params.get('pedido')
    const abrirPago = params.get('pagar') === '1'
    if (clave) {
      fetch(`/api/pedido-cliente?pedido=${encodeURIComponent(clave)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          const lineas = Array.isArray(d?.lineas) ? (d.lineas as Linea[]).filter((l) => productData[l.id] && l.cantidad > 0) : []
          if (!lineas.length) return
          setCarrito(lineas)
          setPedidoClave(clave)
          setPrefill({ nombre: d.nombre || undefined, telefono: d.telefono || undefined })
          setPedidoAbierto(true)
          if (abrirPago) setPasoPedido('gano')
        })
        .catch(() => {})
    } else if (url) {
      const lineas = leerCarritoDeUrl(url).filter((l) => productData[l.id])
      if (lineas.length) { setCarrito(lineas); setPedidoAbierto(true); if (abrirPago) setPasoPedido('gano') }
    } else {
      try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || localStorage.getItem('cart') || '[]')
        if (Array.isArray(guardado)) {
          setCarrito(guardado
            .map((x: any) => ({ id: x?.id, cantidad: Number(x?.cantidad ?? x?.quantity) || 0 }))
            .filter((l: Linea) => productData[l.id] && l.cantidad > 0))
        }
      } catch { /* carrito ilegible: se empieza vacío */ }
    }
    cargado.current = true
  }, [])

  useEffect(() => {
    if (!cargado.current) return
    // El estado inicial no se guarda: en desarrollo (StrictMode repite los efectos)
    // este efecto corría con el carrito vacío ANTES de que el de arriba restaurara el
    // guardado, lo pisaba con «[]», y la segunda pasada restauraba la nada. El
    // Director lo vio el 17 oct 2026 al salir y volver (mismo defecto que tuvo la
    // Cancelación de Código el 28 sep). En producción solo se notaba a veces.
    if (carrito === CARRITO_INICIAL) return
    try { localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito)); localStorage.removeItem('cart') } catch { /* nada */ }
  }, [carrito])

  const cantidadDe = useCallback((id: string) => carrito.find((l) => l.id === id)?.cantidad ?? 0, [carrito])

  const fijar = useCallback((id: string, cantidad: number) => {
    setEnviado(false)
    setCarrito((c) => {
      if (cantidad <= 0) return c.filter((l) => l.id !== id)
      if (c.some((l) => l.id === id)) return c.map((l) => (l.id === id ? { ...l, cantidad: Math.min(cantidad, 50) } : l))
      return [...c, { id, cantidad }]
    })
  }, [])

  const unidades = carrito.reduce((s, l) => s + l.cantidad, 0)
  const total = carrito.reduce((s, l) => s + productData[l.id].price * l.cantidad, 0)
  const hayHoja = Boolean(ficha) || pedidoAbierto

  // ── La barra de abajo sube el orbe de Queswa para no taparlo (UnifiedQueswaOrb lee la variable)
  useEffect(() => {
    const raiz = document.documentElement
    raiz.style.setProperty('--alto-barra-tienda', unidades > 0 && !hayHoja ? '72px' : '0px')
    // La bandera es para el orbe que todavía no se montó (ver UnifiedQueswaOrb.tsx).
    ;(window as unknown as { __queswaOrbOculto?: boolean }).__queswaOrbOculto = hayHoja
    window.dispatchEvent(new CustomEvent(hayHoja ? 'hide-queswa-orb' : 'show-queswa-orb'))
    document.body.style.overflow = hayHoja ? 'hidden' : ''
    return () => { raiz.style.setProperty('--alto-barra-tienda', '0px'); document.body.style.overflow = '' }
  }, [unidades, hayHoja])

  // ── La línea que se está viendo se marca arriba
  useEffect(() => {
    const secciones = LINEAS.map((l) => document.getElementById(`linea-${l.id}`)).filter(Boolean) as HTMLElement[]
    const obs = new IntersectionObserver((entradas) => {
      const visible = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (visible) setLineaActiva(visible.target.id.replace('linea-', ''))
    }, { rootMargin: '-140px 0px -55% 0px' })
    secciones.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  const irALinea = (id: string) => {
    document.getElementById(`linea-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const enviarPedido = () => {
    registrarApertura('pedido', 'whatsapp', socio?.constructorId)
    setEnviado(true)
    window.open(`https://wa.me/${WHATSAPP_QUESWA}?text=${encodeURIComponent(mensajePedido(carrito, socio))}`, '_blank', 'noopener')
  }

  const productoFicha = ficha ? productData[ficha] : null

  return (
    <div className="tienda">
      <style dangerouslySetInnerHTML={{ __html: ESTILOS + ESTILOS_PAGO }} />
      <StrategicNavigation />

      {/* ── 1. Quién le atiende ─────────────────────────────────────────── */}
      <header className="tienda-cabecera">
        <div className="tienda-ancho">
          <p className="tienda-ceja">Catálogo 2026 · Precios en pesos</p>
          <h1 className="tienda-titulo">Catálogo Gano Excel</h1>
          <p className="tienda-bajada">{socio?.pagoGano ? `Café, bebidas, cápsulas y cuidado personal. Elija aquí y pague directo a Gano Excel, o con ${socio.primerNombre} por WhatsApp.` : 'Café, bebidas, cápsulas y cuidado personal. Elija aquí y termine su pedido por WhatsApp.'}</p>
          <div className="tienda-socio">
            <div className="tienda-socio-foto" aria-hidden="true">
              {socio?.foto
                // eslint-disable-next-line @next/next/no-img-element -- la foto vive en Supabase Storage, fuera de images.remotePatterns
                ? <img src={socio.foto} alt="" width={44} height={44} />
                : <Store className="h-5 w-5" />}
            </div>
            <div>
              <p className="tienda-socio-nombre">{socio ? `Le atiende ${socio.nombre}` : 'Le atiende el equipo de CreaTuActivo'}</p>
              <p className="tienda-socio-rol">Distribuidor independiente · Gano Excel fabrica y despacha</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. Las líneas, fijas arriba ──────────────────────────────────── */}
      <nav className="tienda-lineas" aria-label="Líneas del catálogo">
        <div className="tienda-ancho tienda-lineas-fila">
          {LINEAS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => irALinea(l.id)}
              className={`tienda-chip${lineaActiva === l.id ? ' activa' : ''}`}
              aria-current={lineaActiva === l.id ? 'true' : undefined}
            >
              {l.nombre}
            </button>
          ))}
        </div>
      </nav>

      {/* ── La vitrina ───────────────────────────────────────────────────── */}
      <main className="tienda-ancho tienda-vitrina">
        {LINEAS.map((l) => (
          <section key={l.id} id={`linea-${l.id}`} className="tienda-seccion" aria-labelledby={`titulo-${l.id}`}>
            <div className="tienda-seccion-cabeza">
              <h2 id={`titulo-${l.id}`}>{l.nombre}</h2>
              <span>{l.ids.length} productos</span>
            </div>
            <div className="tienda-grilla">
              {l.ids.map((id) => (
                <Tarjeta key={id} id={id} p={productData[id]} cantidad={cantidadDe(id)} fijar={fijar} abrir={() => setFicha(id)} />
              ))}
            </div>
          </section>
        ))}

        {/* ── Ayuda para elegir ─────────────────────────────────────────── */}
        <aside className="tienda-ayuda tienda-oscuro">
          <div>
            <p className="tienda-ayuda-titulo">¿No sabe cuál elegir?</p>
            <p className="tienda-ayuda-texto">Cuéntele a Queswa qué le gusta tomar —café, té o chocolate— y le ayuda a escoger.</p>
          </div>
          <button type="button" className="tienda-boton-oro" onClick={() => window.dispatchEvent(new CustomEvent('open-queswa'))}>
            <MessageCircle className="h-4 w-4" /> Preguntarle a Queswa
          </button>
        </aside>

        {/* ── Cómo sigue su pedido ──────────────────────────────────────── */}
        <section className="tienda-pasos" aria-labelledby="titulo-pasos">
          <h2 id="titulo-pasos">Cómo funciona su pedido</h2>
          <ol>
            <li><span>1</span><div><strong>Arme su pedido aquí</strong><p>Elija los productos y las cantidades. Todavía no paga nada.</p></div></li>
            {socio?.pagoGano ? (
              <>
                <li><span>2</span><div><strong>Elija cómo pagar</strong><p>Directo a Gano Excel, por PSE o en efectivo, con envío a su dirección. O con {socio.nombre}, que le escribe por WhatsApp y acuerdan el pago y la entrega.</p></div></li>
                <li><span>3</span><div><strong>Recibe su pedido</strong><p>Gano Excel lo despacha por Servientrega, normalmente de un día para otro; o en persona, si así lo acordó con {socio.primerNombre}.</p></div></li>
              </>
            ) : (
              <>
                <li><span>2</span><div><strong>Envíelo por WhatsApp</strong><p>Le llega a Queswa con todo listo, y queda a su nombre.</p></div></li>
                <li><span>3</span><div><strong>{socio ? socio.nombre : 'Su distribuidor'} le escribe</strong><p>Acuerdan el pago y la entrega: en persona si están en la misma ciudad, o se lo despacha Gano Excel.</p></div></li>
              </>
            )}
          </ol>
        </section>

        {/* ── El Ganoderma de Gano Excel ────────────────────────────────── */}
        <section className="tienda-historia" aria-labelledby="titulo-historia">
          <h2 id="titulo-historia">Lo que tienen en común</h2>
          <p>
            El fundador de Gano Excel, un micólogo malasio que estudia el Ganoderma desde 1983, reunió en un solo híbrido
            las seis variedades de mayor valor del Reishi y desarrolló un proceso propio para extraerlo. Ese extracto está
            en toda la línea: las bebidas, las cápsulas y el cuidado personal. En el café y las bebidas se disuelve por
            completo: no queda nada en el fondo de la taza.
          </p>
          <p className="tienda-historia-pie"><Factory className="h-4 w-4" /> Gano Excel: 30 años y presencia en más de 60 países.</p>
        </section>

        {/* ── Preguntas ─────────────────────────────────────────────────── */}
        <section className="tienda-preguntas" aria-labelledby="titulo-preguntas">
          <h2 id="titulo-preguntas">Preguntas frecuentes</h2>
          {PREGUNTAS.map((q) => (
            <details key={q.p}>
              <summary>{q.p}</summary>
              <p>{q.r}</p>
            </details>
          ))}
        </section>

      </main>

      {/* ── El puente al negocio (8 oct 2026, Director) — en la banda carbón de la marca madre ── */}
      <section className="tienda-puente">
        <div className="tienda-ancho">
          <p className="tienda-puente-titulo">Estos mismos productos pueden ser su negocio.</p>
          <p>Usted puede tener su propio sistema de distribución: comparte un enlace, Queswa conversa con quien llega y usted recibe. Las cuatro formas de empezar, con su precio, se las muestra Queswa.</p>
          <div className="tienda-puente-botones">
            <button type="button" className="tienda-enlace" onClick={() => window.dispatchEvent(new CustomEvent('open-queswa', { detail: { contexto: 'general' } }))}>
              Pregúntele a Queswa cómo funciona <ChevronRight className="h-4 w-4" />
            </button>
            <Link href="/servilleta" className="tienda-enlace">Ver la presentación <ChevronRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* ── 3. La barra del pedido ───────────────────────────────────────── */}
      {unidades > 0 && !hayHoja && (
        <div className="tienda-barra" role="region" aria-label="Su pedido">
          <div className="tienda-ancho tienda-barra-fila">
            <div>
              <p className="tienda-barra-cuenta">{unidades} {unidades === 1 ? 'producto' : 'productos'}</p>
              <p className="tienda-barra-total">{pesos(total)}</p>
            </div>
            <button type="button" className="tienda-boton" onClick={() => setPedidoAbierto(true)}>
              <ShoppingBag className="h-4 w-4" /> Ver mi pedido
            </button>
          </div>
        </div>
      )}

      {/* ── 4a. La ficha ─────────────────────────────────────────────────── */}
      {productoFicha && ficha && (
        <Hoja titulo={productoFicha.name} cerrar={() => setFicha(null)}>
          <Ficha
            id={ficha}
            p={productoFicha}
            atiende={socio?.primerNombre ?? null}
            cantidad={cantidadDe(ficha)}
            fijar={fijar}
            abrirOtro={(id) => setFicha(id)}
            cantidadDe={cantidadDe}
          />
        </Hoja>
      )}

      {/* ── 4b. El pedido ────────────────────────────────────────────────── */}
      {pedidoAbierto && (
        <Hoja
          titulo={pasoPedido === 'gano' && socio?.pagoGano ? 'Pagar a Gano Excel' : 'Su pedido'}
          cerrar={() => { setPedidoAbierto(false); setPasoPedido('lista') }}
        >
          {pasoPedido === 'gano' && socio?.pagoGano ? (
            <PagoGano
              carrito={carrito}
              socio={socio}
              subtotal={total}
              prefill={prefill}
              pedidoClave={pedidoClave}
              alPagar={() => { registrarApertura('pedido', 'web', socio.constructorId); setCarrito([]); setPedidoClave(null) }}
              volver={() => setPasoPedido('lista')}
            />
          ) : (
            <Pedido
              carrito={carrito}
              total={total}
              socio={socio}
              fijar={fijar}
              enviado={enviado}
              enviar={enviarPedido}
              seguirComprando={() => setPedidoAbierto(false)}
              pagoGano={Boolean(socio?.pagoGano)}
              pagarGano={() => setPasoPedido('gano')}
            />
          )}
        </Hoja>
      )}
    </div>
  )
}

// ─── Tarjeta de la vitrina ───────────────────────────────────────────────────

function Tarjeta({ id, p, cantidad, fijar, abrir }: {
  id: string; p: Product; cantidad: number; fijar: (id: string, n: number) => void; abrir: () => void
}) {
  return (
    <article className="tienda-tarjeta">
      <button type="button" className="tienda-foto" onClick={abrir} aria-label={`Ver ${p.name}`}>
        {id === MAS_PEDIDO && <span className="tienda-sello">El más pedido</span>}
        <Image src={imagenVitrina(id)} alt={p.name} fill sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 240px" />
      </button>
      <div className="tienda-tarjeta-texto">
        <button type="button" className="tienda-nombre" onClick={abrir}>{p.name}</button>
        <p className="tienda-presentacion">{p.presentacion}</p>
        <p className="tienda-precio">{pesos(p.price)}</p>
      </div>
      <Cantidad id={id} nombre={p.name} cantidad={cantidad} fijar={fijar} />
    </article>
  )
}

function Cantidad({ id, nombre, cantidad, fijar, grande = false }: {
  id: string; nombre: string; cantidad: number; fijar: (id: string, n: number) => void; grande?: boolean
}) {
  if (cantidad === 0) {
    return (
      <button type="button" className={`tienda-boton tienda-agregar${grande ? ' grande' : ''}`} onClick={() => fijar(id, 1)}>
        <Plus className="h-4 w-4" /> Agregar
      </button>
    )
  }
  return (
    <div className={`tienda-cantidad${grande ? ' grande' : ''}`} role="group" aria-label={`Cantidad de ${nombre}`}>
      <button type="button" onClick={() => fijar(id, cantidad - 1)} aria-label={cantidad === 1 ? `Quitar ${nombre}` : 'Uno menos'}>
        {cantidad === 1 ? <X className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
      </button>
      <span aria-live="polite">{cantidad}</span>
      <button type="button" onClick={() => fijar(id, cantidad + 1)} aria-label="Uno más"><Plus className="h-4 w-4" /></button>
    </div>
  )
}

// ─── Hoja (sube desde abajo en el celular; ventana centrada en el computador) ─

function Hoja({ titulo, cerrar, children }: { titulo: string; cerrar: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrar() }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [cerrar])
  return (
    <div className="tienda-velo" onClick={(e) => { if (e.target === e.currentTarget) cerrar() }}>
      <div className="tienda-hoja" role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="tienda-hoja-cabeza">
          <span className="tienda-hoja-asa" aria-hidden="true" />
          <p>{titulo}</p>
          <button type="button" onClick={cerrar} aria-label="Cerrar"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Ficha del producto ──────────────────────────────────────────────────────

function Ficha({ id, p, atiende, cantidad, fijar, abrirOtro, cantidadDe }: {
  id: string; p: Product; atiende: string | null; cantidad: number; fijar: (id: string, n: number) => void
  abrirOtro: (id: string) => void; cantidadDe: (id: string) => number
}) {
  const cuerpo = useRef<HTMLDivElement>(null)
  useEffect(() => { cuerpo.current?.scrollTo({ top: 0 }) }, [id])
  return (
    <>
      <div className="tienda-hoja-cuerpo" ref={cuerpo}>
        <div className="tienda-ficha">
          <div className="tienda-ficha-foto">
            <Image src={imagenVitrina(id)} alt={p.name} fill sizes="(max-width: 768px) 90vw, 360px" priority />
          </div>
          <div className="tienda-ficha-datos">
            <p className="tienda-ficha-lema">{p.taglineEstrategico}</p>
            <p className="tienda-ficha-precio">{pesos(p.price)}</p>
            <p className="tienda-presentacion">{p.presentacion}{p.invima ? ` · Registro ${p.invima}` : ''}</p>
            <p className="tienda-ficha-entrega"><Truck className="h-4 w-4" /> Entrega en persona o por Servientrega, normalmente de un día para otro. El envío lo acuerda con {atiende ?? 'su distribuidor'}.</p>
            <p className="tienda-ficha-desc">{p.shortDescription}</p>

            <h3>Cómo se prepara</h3>
            <p>{p.usage}</p>

            {p.ritual?.length > 0 && (
              <>
                <h3>Para sacarle el gusto</h3>
                <ul>{p.ritual.map((r) => <li key={r}>{r}</li>)}</ul>
              </>
            )}

            <h3>Qué lleva</h3>
            <p>{p.ingredients.join(' · ')}</p>

            {/* El bloque del extracto va solo en los productos que lo llevan (9 sep 2026),
                plegado: es para quien quiere saber más, no lo que decide la compra. */}
            {p.llevaGanoderma && (
              <details className="tienda-ficha-mas">
                <summary>Sobre el extracto de Ganoderma</summary>
                <p>
                  Lleva el extracto de Ganoderma lucidum de Gano Excel: un híbrido de las seis variedades del hongo,
                  los seis colores del Reishi, extraído con un proceso propio de la empresa. Es 100% hidrosoluble:
                  se disuelve por completo, sin dejar residuo. En el hongo hay dos familias de compuestos, los
                  polisacáridos, entre ellos los betaglucanos, y los triterpenos, con más de doscientas variantes
                  identificadas. Es el hongo más estudiado, con tradición milenaria en Asia, y como parte de la
                  rutina apoya el funcionamiento normal de las defensas.
                </p>
              </details>
            )}

            {id === 'maquina-luvoco' && (
              <>
                <h3>Documentos de la máquina</h3>
                <div className="tienda-descargas">
                  {DESCARGAS_LUVOCO.map((d) => (
                    <a key={d.href} href={d.href} target="_blank" rel="noopener noreferrer" className="tienda-boton-sec">
                      <Download className="h-4 w-4" /> {d.texto}
                    </a>
                  ))}
                </div>
              </>
            )}

            {p.combinacionSugerida && p.combinacionSugerida.length > 0 && (
              <>
                <h3>Combina bien con</h3>
                <div className="tienda-combina">
                  {p.combinacionSugerida.filter((c) => productData[c]).map((c) => (
                    <div key={c} className="tienda-combina-item">
                      <button type="button" className="tienda-combina-foto" onClick={() => abrirOtro(c)} aria-label={`Ver ${productData[c].name}`}>
                        <Image src={imagenVitrina(c)} alt="" fill sizes="64px" />
                      </button>
                      <div>
                        <button type="button" className="tienda-nombre" onClick={() => abrirOtro(c)}>{productData[c].name}</button>
                        <p className="tienda-precio-chico">{pesos(productData[c].price)}</p>
                      </div>
                      {cantidadDe(c) === 0
                        ? <button type="button" className="tienda-mas" onClick={() => fijar(c, 1)} aria-label={`Agregar ${productData[c].name}`}><Plus className="h-4 w-4" /></button>
                        : <span className="tienda-ya">✓ {cantidadDe(c)}</span>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="tienda-hoja-pie">
        <Cantidad id={id} nombre={p.name} cantidad={cantidad} fijar={fijar} grande />
        {cantidad > 0 && <p className="tienda-hoja-pie-nota">{cantidad} en su pedido · {pesos(p.price * cantidad)}</p>}
      </div>
    </>
  )
}

// ─── El pedido ───────────────────────────────────────────────────────────────

function Pedido({ carrito, total, socio, fijar, enviado, enviar, seguirComprando, pagoGano, pagarGano }: {
  carrito: Linea[]; total: number; socio: Socio | null; fijar: (id: string, n: number) => void
  enviado: boolean; enviar: () => void; seguirComprando: () => void
  pagoGano: boolean; pagarGano: () => void
}) {
  const quien = socio?.nombre ?? 'Su distribuidor'
  if (carrito.length === 0) {
    return (
      <div className="tienda-hoja-cuerpo tienda-vacio">
        <ShoppingBag className="h-10 w-10" />
        <p>Su pedido está vacío.</p>
        <button type="button" className="tienda-boton" onClick={seguirComprando}>Ver los productos</button>
      </div>
    )
  }
  return (
    <>
      <div className="tienda-hoja-cuerpo">
        <ul className="tienda-pedido-lista">
          {carrito.map((l) => {
            const p = productData[l.id]
            return (
              <li key={l.id}>
                <div className="tienda-pedido-foto"><Image src={imagenVitrina(l.id)} alt="" fill sizes="64px" /></div>
                <div className="tienda-pedido-texto">
                  <p className="tienda-pedido-nombre">{p.name}</p>
                  <p className="tienda-presentacion">{p.presentacion}</p>
                  <p className="tienda-precio-chico">{pesos(p.price * l.cantidad)}</p>
                </div>
                <Cantidad id={l.id} nombre={p.name} cantidad={l.cantidad} fijar={fijar} />
              </li>
            )
          })}
        </ul>

        <div className="tienda-pedido-suma">
          <div><span>Envío</span><span>{pagoGano ? 'Lo calcula Gano Excel según su ciudad' : `Lo acuerda con ${socio?.primerNombre ?? 'su distribuidor'}`}</span></div>
          <div className="total"><span>Total de productos</span><span>{pesos(total)}</span></div>
        </div>

        {pagoGano ? (
          // Las dos opciones, en igualdad (Director, 17 oct 2026): pagar directo a Gano
          // Excel o pagar con su distribuidor. Ninguna es «la otra».
          <>
            <p className="tienda-pago-eleccion-titulo">¿Cómo prefiere pagar?</p>
            <div className="tienda-pago-eleccion">
              <button type="button" className="tienda-opcion" onClick={pagarGano}>
                <Landmark className="h-6 w-6" />
                <span><strong>Pagar a Gano Excel</strong><small>Por PSE desde su banco o en efectivo. Gano Excel lo despacha a su dirección.</small></span>
                <ChevronRight className="h-5 w-5 tienda-opcion-flecha" />
              </button>
              <button type="button" className="tienda-opcion whatsapp" onClick={enviar}>
                <IconoWhatsApp />
                <span><strong>Pagar con {socio?.primerNombre ?? 'su distribuidor'}</strong><small>Le escribe por WhatsApp y acuerdan el pago y la entrega. Todavía no paga nada.</small></span>
                <ChevronRight className="h-5 w-5 tienda-opcion-flecha" />
              </button>
            </div>
          </>
        ) : (
          <div className="tienda-pedido-sigue">
            <Truck className="h-5 w-5" />
            <p>Se abre WhatsApp con su pedido escrito; al enviarlo le llega a Queswa, la asistente de {socio ? socio.primerNombre : 'su distribuidor'}. <strong>{quien} le escribe</strong> para acordar el pago y la entrega. Todavía no paga nada.</p>
          </div>
        )}
      </div>

      <div className="tienda-hoja-pie">
        {enviado ? (
          <div className="tienda-enviado">
            <p><strong>Falta un paso:</strong> en WhatsApp, toque <strong>Enviar</strong> para que le llegue el pedido.</p>
            <button type="button" className="tienda-boton-sec" onClick={enviar}>Abrir WhatsApp de nuevo</button>
          </div>
        ) : !pagoGano ? (
          <button type="button" className="tienda-boton tienda-enviar" onClick={enviar}>
            <IconoWhatsApp /> Enviar pedido por WhatsApp
          </button>
        ) : null}
        <button type="button" className="tienda-enlace" onClick={seguirComprando}>Seguir comprando</button>
      </div>
    </>
  )
}

function IconoWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.23-9.42 9.43-9.42 2.52 0 4.88.98 6.66 2.76a9.36 9.36 0 0 1 2.76 6.67c0 5.2-4.23 9.42-9.42 9.42m8.02-17.44A11.27 11.27 0 0 0 12.05.75C5.8.75.7 5.84.7 12.1c0 2 .52 3.95 1.52 5.67L.6 23.25l5.6-1.47a11.3 11.3 0 0 0 5.84 1.57h.01c6.25 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.33-8.02" />
    </svg>
  )
}

// ─── Estilos ─────────────────────────────────────────────────────────────────
// Paleta de la tienda en variables (--t-*): la marca madre es carbón y oro; la
// vitrina es cálida y clara para que las cajas —casi todas oscuras— se vean.

const ESTILOS = `
.tienda {
  --t-fondo: #F7F2EA;
  --t-superficie: #FFFDF9;
  --t-vitrina: #EFE6D8;
  --t-tinta: #2B211A;
  --t-tinta-2: #6B5A4C;
  --t-tinta-3: #8A7A6C;
  --t-linea: #E6DCCD;
  --t-oro: #C5A059;
  --t-oro-texto: #7A5C24;
  --t-accion: #2B211A;
  --t-accion-texto: #F7F2EA;
  --t-marco: #0F1115;
  --t-radio: 14px;
  background: var(--t-fondo);
  color: var(--t-tinta);
  min-height: 100vh;
  font-family: var(--font-sans);
}
.tienda h1, .tienda h2, .tienda h3 { color: var(--t-tinta); }
.tienda-ancho { max-width: 72rem; margin: 0 auto; padding: 0 16px; }
@media (min-width: 768px) { .tienda-ancho { padding: 0 24px; } }

.tienda-cabecera { padding: 28px 0 20px; }
.tienda-ceja { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--t-oro-texto); font-weight: 600; margin: 0 0 6px; }
.tienda-titulo { font-variant-numeric: lining-nums; font-family: var(--font-serif); font-size: 30px; line-height: 1.15; font-weight: 700; margin: 0 0 8px; color: var(--t-tinta); }
@media (min-width: 768px) { .tienda-titulo { font-size: 42px; } .tienda-cabecera { padding: 44px 0 28px; } }
.tienda-bajada { font-size: 15px; line-height: 1.5; color: var(--t-tinta-2); margin: 0 0 18px; max-width: 34em; }
.tienda-socio { display: flex; align-items: center; gap: 12px; background: var(--t-superficie); border: 1px solid var(--t-linea); border-radius: var(--t-radio); padding: 10px 14px; max-width: 26rem; }
.tienda-socio-foto { width: 44px; height: 44px; border-radius: 999px; overflow: hidden; background: var(--t-vitrina); color: var(--t-oro-texto); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tienda-socio-foto img { width: 44px; height: 44px; object-fit: cover; }
.tienda-socio-nombre { margin: 0; font-weight: 600; font-size: 15px; }
.tienda-socio-rol { margin: 2px 0 0; font-size: 12.5px; color: var(--t-tinta-3); }

.tienda-lineas { position: sticky; top: 4rem; z-index: 40; background: rgba(247,242,234,.96); border-bottom: 1px solid var(--t-linea); backdrop-filter: saturate(1.2) blur(8px); }
@media (min-width: 768px) { .tienda-lineas { top: 5rem; } }
.tienda-lineas-fila { display: flex; gap: 8px; overflow-x: auto; padding-top: 10px; padding-bottom: 10px; scrollbar-width: none; }
.tienda-lineas-fila::-webkit-scrollbar { display: none; }
.tienda-chip { flex-shrink: 0; border: 1px solid var(--t-linea); background: var(--t-superficie); color: var(--t-tinta-2); border-radius: 999px; padding: 8px 14px; font-size: 14px; font-weight: 500; min-height: 40px; }
.tienda-chip.activa { background: var(--t-accion); border-color: var(--t-accion); color: var(--t-accion-texto); }

.tienda-vitrina { padding-top: 8px; padding-bottom: 48px; }
.tienda-seccion { padding-top: 20px; scroll-margin-top: 8.5rem; }
@media (min-width: 768px) { .tienda-seccion { scroll-margin-top: 9.5rem; } }
.tienda-seccion-cabeza { display: flex; align-items: baseline; justify-content: space-between; margin: 0 0 12px; }
.tienda-seccion-cabeza h2 { font-family: var(--font-serif); font-size: 22px; margin: 0; color: var(--t-tinta); }
.tienda-seccion-cabeza span { font-size: 13px; color: var(--t-tinta-3); }

.tienda-grilla { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
@media (min-width: 768px) { .tienda-grilla { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; } }
@media (min-width: 1100px) { .tienda-grilla { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 22px; } }

.tienda-tarjeta { background: var(--t-superficie); border: 1px solid var(--t-linea); border-radius: var(--t-radio); padding: 8px; display: flex; flex-direction: column; gap: 8px; }
.tienda-foto { position: relative; display: block; width: 100%; aspect-ratio: 1 / 1; background: var(--t-vitrina); border-radius: 8px; overflow: hidden; }
.tienda-foto img { object-fit: contain; padding: 14%; filter: drop-shadow(0 8px 10px rgba(30,26,23,.18)); transition: transform .3s ease; }
@media (hover: hover) { .tienda-tarjeta:hover .tienda-foto img { transform: scale(1.04); } }
.tienda-sello { position: absolute; top: 8px; left: 8px; z-index: 1; background: var(--t-oro); color: var(--t-tinta); font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 999px; }
.tienda-tarjeta-texto { padding: 0 4px; display: flex; flex-direction: column; gap: 2px; flex: 1; }
.tienda-nombre { font-variant-numeric: lining-nums; text-align: left; font-family: var(--font-serif); font-weight: 700; font-size: 15.5px; line-height: 1.25; color: var(--t-tinta); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; background: none; padding: 0; }
.tienda-presentacion { font-size: 12.5px; color: var(--t-tinta-2); margin: 0; }
.tienda-precio { font-size: 16px; font-weight: 700; margin: 4px 0 0; font-variant-numeric: tabular-nums; color: var(--t-tinta); }
.tienda-precio-chico { font-size: 14px; font-weight: 600; margin: 2px 0 0; font-variant-numeric: tabular-nums; }

.tienda-boton { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--t-accion); color: var(--t-accion-texto); border-radius: 999px; min-height: 44px; padding: 0 18px; font-weight: 600; font-size: 15px; border: 0; transition: opacity .2s ease, transform .1s ease; }
.tienda-boton:active { transform: scale(.98); }
.tienda-boton:hover { opacity: .92; }
.tienda-agregar { width: 100%; font-size: 14px; }
.tienda-agregar.grande { font-size: 16px; min-height: 52px; }
.tienda-boton-sec { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 1.5px solid var(--t-tinta); color: var(--t-tinta); background: transparent; border-radius: 999px; min-height: 44px; padding: 0 16px; font-weight: 600; font-size: 14px; }
.tienda-enlace { display: inline-flex; align-items: center; gap: 4px; color: var(--t-oro-texto); font-weight: 600; font-size: 14px; background: none; border: 0; padding: 8px 0; text-decoration: underline; text-underline-offset: 3px; }

.tienda-cantidad { display: flex; align-items: center; justify-content: space-between; border: 1.5px solid var(--t-accion); border-radius: 999px; min-height: 44px; overflow: hidden; }
.tienda-cantidad button { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; color: var(--t-tinta); background: none; }
.tienda-cantidad span { font-weight: 700; font-variant-numeric: tabular-nums; }
.tienda-cantidad.grande { min-height: 52px; min-width: 160px; }
.tienda-cantidad.grande button { height: 52px; width: 52px; }

.tienda-ayuda { margin-top: 32px; background: var(--t-superficie); border: 1px solid var(--t-linea); border-radius: var(--t-radio); padding: 18px; display: flex; flex-direction: column; gap: 12px; }
@media (min-width: 768px) { .tienda-ayuda { flex-direction: row; align-items: center; justify-content: space-between; } }
.tienda-ayuda-titulo { margin: 0; font-weight: 700; font-size: 16px; }
.tienda-ayuda-texto { margin: 4px 0 0; font-size: 14px; color: var(--t-tinta-2); }

.tienda-pasos, .tienda-historia, .tienda-preguntas { margin-top: 40px; }
.tienda-pasos h2, .tienda-historia h2, .tienda-preguntas h2 { font-family: var(--font-serif); font-size: 22px; margin: 0 0 14px; }
.tienda-pasos ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
@media (min-width: 768px) { .tienda-pasos ol { grid-template-columns: repeat(3, 1fr); } }
.tienda-pasos li { display: flex; gap: 12px; background: var(--t-superficie); border: 1px solid var(--t-linea); border-radius: var(--t-radio); padding: 14px; }
.tienda-pasos li > span { width: 28px; height: 28px; border-radius: 999px; background: var(--t-vitrina); color: var(--t-oro-texto); font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; }
.tienda-pasos strong { font-size: 15px; }
.tienda-pasos p { margin: 4px 0 0; font-size: 14px; color: var(--t-tinta-2); line-height: 1.45; }
.tienda-historia p { font-size: 15px; line-height: 1.6; color: var(--t-tinta-2); max-width: 44em; margin: 0; }
.tienda-historia-pie svg { flex-shrink: 0; width: 18px; height: 18px; color: var(--t-oro-texto); }
.tienda-historia-pie { display: flex; align-items: center; gap: 8px; margin-top: 12px !important; font-size: 14px !important; color: var(--t-tinta-3) !important; }
.tienda-preguntas details { background: var(--t-superficie); border: 1px solid var(--t-linea); border-radius: var(--t-radio); margin-bottom: 8px; }
.tienda-preguntas summary { cursor: pointer; padding: 14px 16px; font-weight: 600; font-size: 15px; list-style: none; display: flex; justify-content: space-between; gap: 12px; }
.tienda-preguntas summary::after { content: '+'; color: var(--t-oro-texto); font-weight: 700; }
.tienda-preguntas details[open] summary::after { content: '–'; }
.tienda-preguntas details p { margin: 0; padding: 0 16px 16px; font-size: 14.5px; line-height: 1.55; color: var(--t-tinta-2); }
.tienda-puente { background: var(--t-marco); color: #E5E5E5; padding: 40px 0 140px; border-top: 1px solid rgba(197,160,89,.2); }
.tienda-puente-titulo { font-family: var(--font-serif); font-size: 22px; font-weight: 700; margin: 0 0 8px; color: #FFFFFF; }
.tienda-puente p { font-size: 14.5px; line-height: 1.55; color: #A9A49C; max-width: 40em; }
.tienda-puente .tienda-enlace { color: var(--t-oro); }
.tienda-oscuro { background: var(--t-marco) !important; border-color: rgba(197,160,89,.25) !important; color: #E5E5E5; }
.tienda-oscuro .tienda-ayuda-texto { color: #A9A49C; }
.tienda-boton-oro { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 1.5px solid var(--t-oro); color: var(--t-oro); background: rgba(197,160,89,.08); border-radius: 999px; min-height: 44px; padding: 0 18px; font-weight: 600; font-size: 14px; }
.tienda-ficha-entrega { display: flex; gap: 8px; align-items: flex-start; font-size: 13.5px !important; line-height: 1.45; color: var(--t-tinta-2); background: var(--t-superficie); border: 1px solid var(--t-linea); border-radius: 10px; padding: 10px 12px; margin: 12px 0 0; }
.tienda-ficha-entrega svg { flex-shrink: 0; margin-top: 2px; color: var(--t-oro-texto); }

.tienda-puente-botones { display: flex; flex-wrap: wrap; gap: 4px 20px; }

.tienda-barra { position: fixed; left: 0; right: 0; bottom: var(--alto-aviso-cookies, 0px); z-index: 45; background: var(--t-superficie); border-top: 1px solid var(--t-linea); box-shadow: 0 -8px 24px rgba(30,26,23,.08); padding-bottom: env(safe-area-inset-bottom, 0px); animation: tienda-sube .25s ease; }
.tienda-barra-fila { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 72px; }
.tienda-barra-cuenta { margin: 0; font-size: 13px; color: var(--t-tinta-3); }
.tienda-barra-total { margin: 0; font-size: 18px; font-weight: 700; font-variant-numeric: tabular-nums; }
@keyframes tienda-sube { from { transform: translateY(100%); } to { transform: none; } }

.tienda-velo { position: fixed; inset: 0; z-index: 90; background: rgba(20,17,15,.45); display: flex; align-items: flex-end; justify-content: center; animation: tienda-aparece .2s ease; }
@media (min-width: 768px) { .tienda-velo { align-items: center; padding: 24px; } }
@keyframes tienda-aparece { from { opacity: 0; } to { opacity: 1; } }
.tienda-hoja { background: var(--t-fondo); color: var(--t-tinta); width: 100%; max-height: 92dvh; border-radius: 18px 18px 0 0; display: flex; flex-direction: column; overflow: hidden; animation: tienda-sube .28s cubic-bezier(.2,.8,.2,1); }
@media (min-width: 768px) { .tienda-hoja { max-width: 760px; border-radius: 18px; max-height: 88vh; } }
.tienda-hoja-cabeza { position: relative; display: flex; align-items: center; justify-content: space-between; padding: 14px 12px 10px 18px; border-bottom: 1px solid var(--t-linea); background: var(--t-superficie); }
.tienda-hoja-cabeza p { margin: 0; font-weight: 700; font-size: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 8px; }
.tienda-hoja-cabeza button { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 999px; color: var(--t-tinta); background: var(--t-fondo); flex-shrink: 0; }
.tienda-hoja-asa { position: absolute; top: 5px; left: 50%; transform: translateX(-50%); width: 40px; height: 4px; border-radius: 4px; background: var(--t-linea); }
@media (min-width: 768px) { .tienda-hoja-asa { display: none; } }
.tienda-hoja-cuerpo { overflow-y: auto; padding: 16px 18px; flex: 1; overscroll-behavior: contain; }
.tienda-hoja-pie { border-top: 1px solid var(--t-linea); background: var(--t-superficie); padding: 12px 18px calc(12px + env(safe-area-inset-bottom, 0px)); display: flex; flex-direction: column; align-items: stretch; gap: 6px; }
.tienda-hoja-pie .tienda-cantidad.grande { align-self: stretch; }
.tienda-hoja-pie-nota { margin: 0; text-align: center; font-size: 13px; color: var(--t-tinta-3); }
.tienda-hoja-pie .tienda-enlace { align-self: center; }

.tienda-ficha { display: grid; gap: 16px; }
@media (min-width: 768px) { .tienda-ficha { grid-template-columns: 300px 1fr; gap: 24px; } }
.tienda-ficha-foto { position: relative; aspect-ratio: 1 / 1; background: var(--t-vitrina); border-radius: var(--t-radio); overflow: hidden; }
.tienda-ficha-foto img { object-fit: contain; padding: 10%; filter: drop-shadow(0 10px 14px rgba(30,26,23,.2)); }
@media (max-width: 767px) { .tienda-ficha-foto { aspect-ratio: 4 / 3; } }
.tienda-ficha-lema { font-family: var(--font-serif); font-style: italic; font-size: 17px; line-height: 1.35; margin: 0 0 8px; color: var(--t-tinta-2); }
.tienda-ficha-datos .tienda-ficha-precio { color: var(--t-tinta); font-size: 26px; font-weight: 700; margin: 0; font-variant-numeric: tabular-nums; }
.tienda-ficha-desc { font-size: 15px; line-height: 1.55; margin: 12px 0 0; }
.tienda-ficha-datos h3 { font-size: 13px; letter-spacing: .06em; text-transform: uppercase; color: var(--t-oro-texto); margin: 20px 0 6px; font-weight: 700; }
.tienda-ficha-datos p, .tienda-ficha-datos li { font-size: 14.5px; line-height: 1.55; color: var(--t-tinta-2); }
.tienda-ficha-datos ul { margin: 0; padding-left: 18px; list-style: disc; }
.tienda-ficha-datos li::marker { color: var(--t-oro); }
.tienda-ficha-mas { margin-top: 18px; border-top: 1px solid var(--t-linea); padding-top: 10px; }
.tienda-ficha-mas summary { cursor: pointer; font-weight: 600; font-size: 14.5px; color: var(--t-tinta); padding: 6px 0; }
.tienda-ficha-mas p { margin: 6px 0 0; }
.tienda-descargas { display: flex; flex-wrap: wrap; gap: 8px; }
.tienda-combina { display: grid; gap: 8px; }
.tienda-combina-item { display: grid; grid-template-columns: 56px 1fr auto; align-items: center; gap: 12px; background: var(--t-superficie); border: 1px solid var(--t-linea); border-radius: 10px; padding: 8px; }
.tienda-combina-foto { position: relative; width: 56px; height: 56px; background: var(--t-vitrina); border-radius: 8px; overflow: hidden; }
.tienda-combina-foto img { object-fit: contain; padding: 8px; }
.tienda-mas { width: 40px; height: 40px; border-radius: 999px; background: var(--t-accion); color: var(--t-accion-texto); display: flex; align-items: center; justify-content: center; }
.tienda-ya { font-size: 13px; font-weight: 600; color: var(--t-oro-texto); padding: 0 6px; }

.tienda-vacio { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px 18px; color: var(--t-tinta-3); }
.tienda-pedido-lista { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.tienda-pedido-lista li { display: grid; grid-template-columns: 64px 1fr; gap: 10px 12px; background: var(--t-superficie); border: 1px solid var(--t-linea); border-radius: var(--t-radio); padding: 10px; }
.tienda-pedido-lista li .tienda-cantidad { grid-column: 2; max-width: 150px; }
.tienda-pedido-foto { position: relative; width: 64px; height: 64px; background: var(--t-vitrina); border-radius: 8px; overflow: hidden; grid-row: span 2; }
.tienda-pedido-foto img { object-fit: contain; padding: 8px; }
.tienda-pedido-nombre { margin: 0; font-weight: 600; font-size: 14.5px; }
.tienda-pedido-suma { margin-top: 16px; display: grid; gap: 8px; font-size: 14.5px; }
.tienda-pedido-suma > div { display: flex; justify-content: space-between; gap: 12px; color: var(--t-tinta-2); }
.tienda-pedido-suma > div span:last-child { text-align: right; font-variant-numeric: tabular-nums; }
.tienda-pedido-suma .total { border-top: 1px solid var(--t-linea); padding-top: 10px; color: var(--t-tinta); font-weight: 700; font-size: 17px; }
.tienda-pedido-sigue svg { flex-shrink: 0; width: 20px; height: 20px; margin-top: 1px; }
.tienda-pedido-sigue { margin-top: 16px; display: flex; gap: 12px; align-items: flex-start; background: var(--t-vitrina); border-radius: var(--t-radio); padding: 14px; color: var(--t-oro-texto); }
.tienda-pedido-sigue p { margin: 0; font-size: 14px; line-height: 1.5; color: var(--t-tinta-2); }
.tienda-pedido-sigue strong { color: var(--t-tinta); }
.tienda-enviar { width: 100%; min-height: 52px; font-size: 16px; }
.tienda-enviado { display: grid; gap: 8px; }
.tienda-enviado p { margin: 0; font-size: 14.5px; line-height: 1.45; background: #FFF6E0; border: 1px solid #EAD7A8; border-radius: 10px; padding: 12px; }
`
