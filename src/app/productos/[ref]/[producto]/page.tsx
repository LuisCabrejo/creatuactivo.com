/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El enlace directo a UN producto: /productos/{slug}/{producto} (29 oct 2026).
 *
 * Director: «un cliente me pregunta por el Gano Café 3 en 1, ¿le puedo enviar el
 * enlace directo?». Hasta ese día solo existía el catálogo entero: la ficha se
 * abría como una hoja encima y la dirección no cambiaba, así que no había nada
 * que copiar, y la tarjeta para compartir era la del catálogo.
 *
 * Es el mismo catálogo del socio con la ficha del producto abierta: al cerrarla,
 * la persona sigue en la tienda de ese socio. Lleva su propia tarjeta (la foto
 * del producto, og.ts) y el código del socio para tracking.js, igual que
 * [ref]/page.tsx.
 *   · Un ref viejo (código o seudónimo) redirige al slug vigente, con el producto.
 *   · Un producto que no existe, o una promoción de Gano (son temporales: el
 *     enlace sobreviviría a la promoción), va al catálogo del socio.
 */

import { permanentRedirect, redirect } from 'next/navigation'
import CatalogoTienda from '../../page'
import { CATALOGOS, type PaisCatalogo } from '../../catalogo'
import { tarjetaProducto, TARJETA_CATALOGO } from '../../og'
import { resolver, aSocio, paisDeLaVisita } from '../../socio'

export const dynamic = 'force-dynamic'

type Busqueda = Record<string, string | string[] | undefined>

/** El producto del enlace, si se puede enlazar directo, en el catálogo del país del socio. */
function productoEnlazable(id: string, pais: PaisCatalogo) {
  const p = CATALOGOS[pais].productos[decodeURIComponent(id || '').toLowerCase()]
  return p && !p.promocion ? p : null
}

/**
 * El país de la ficha: el de la visita (?pais o la inscripción del socio), salvo que
 * el producto exista solo en el otro catálogo y el enlace no diga país (27 nov 2026).
 * La pieza de bienestar de Estados Unidos imprime el enlace sin ?pais=us para que se
 * lea; quien lo escribe a mano llega igual al catálogo de allá. Los ids de los dos
 * catálogos no se repiten.
 */
function paisDeLaFicha(id: string, r: Awaited<ReturnType<typeof resolver>>, searchParams?: Busqueda): PaisCatalogo {
  const visita = paisDeLaVisita(r, searchParams)
  if (typeof searchParams?.pais === 'string' || productoEnlazable(id, visita)) return visita
  const otro: PaisCatalogo = visita === 'US' ? 'CO' : 'US'
  return productoEnlazable(id, otro) ? otro : visita
}

export default async function ProductoDelSocio({ params, searchParams }: { params: { ref: string; producto: string }; searchParams?: Busqueda }) {
  const id = decodeURIComponent(params.producto || '').toLowerCase()
  const r = await resolver(params.ref)
  const pais = paisDeLaFicha(id, r, searchParams)
  // Las redirecciones conservan la consulta: sin ella, un enlace con ?pais=us
  // (el que comparte un socio de Colombia para Estados Unidos) caía al de Colombia.
  const consulta = new URLSearchParams()
  for (const [k, v] of Object.entries(searchParams ?? {})) if (typeof v === 'string') consulta.set(k, v)
  const q = consulta.toString() ? `?${consulta}` : ''
  if (!productoEnlazable(id, pais)) redirect(`/productos/${params.ref}${q}`)
  if (r?.slug && (r.slug !== params.ref || id !== params.producto)) permanentRedirect(`/productos/${r.slug}/${id}${q}`)
  return <CatalogoTienda socioInicial={r ? aSocio(r) : null} fichaInicial={id} pais={pais} />
}

export async function generateMetadata({ params, searchParams }: { params: { ref: string; producto: string }; searchParams?: Busqueda }) {
  const id = decodeURIComponent(params.producto || '').toLowerCase()
  const r = await resolver(params.ref)
  const pais = paisDeLaFicha(id, r, searchParams)
  const p = productoEnlazable(id, pais)
  if (!p) return {}
  const url = `https://creatuactivo.com/productos/${r?.slug ?? params.ref}/${id}`
  const titulo = `${p.name} · Catálogo Gano Excel`
  // Sin precio en la vista previa (Director, 2 nov 2026): el enlace se comparte para que la
  // persona conozca el producto; el precio lo ve al abrir la ficha.
  const descripcion = `${p.shortDescription} ${p.presentacion}.${r ? ` Le atiende ${aSocio(r).nombre}.` : ''}`
  return {
    title: titulo,
    description: descripcion,
    // Como el catálogo de cada socio: la versión oficial es /productos.
    alternates: { canonical: 'https://creatuactivo.com/productos' },
    openGraph: {
      title: p.name, description: descripcion, url, siteName: 'CreaTuActivo', locale: pais === 'US' ? 'es_US' : 'es_CO', type: 'website',
      // Estados Unidos todavía no tiene tarjetas por producto: va la del catálogo.
      images: [pais === 'US' ? TARJETA_CATALOGO : tarjetaProducto(id, p.name)],
    },
    twitter: { card: 'summary_large_image', title: p.name, description: descripcion },
    other: r ? { 'constructor-ref': r.constructorId } : undefined,
  }
}
