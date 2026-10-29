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
import { productData, pesos } from '../../catalogo-datos'
import { tarjetaProducto } from '../../og'
import { resolver, aSocio } from '../../socio'

export const dynamic = 'force-dynamic'

/** El producto del enlace, si se puede enlazar directo. */
function productoEnlazable(id: string) {
  const p = productData[decodeURIComponent(id || '').toLowerCase()]
  return p && !p.promocion ? p : null
}

export default async function ProductoDelSocio({ params }: { params: { ref: string; producto: string } }) {
  const id = decodeURIComponent(params.producto || '').toLowerCase()
  if (!productoEnlazable(id)) redirect(`/productos/${params.ref}`)
  const r = await resolver(params.ref)
  if (r?.slug && (r.slug !== params.ref || id !== params.producto)) permanentRedirect(`/productos/${r.slug}/${id}`)
  return <CatalogoTienda socioInicial={r ? aSocio(r) : null} fichaInicial={id} />
}

export async function generateMetadata({ params }: { params: { ref: string; producto: string } }) {
  const id = decodeURIComponent(params.producto || '').toLowerCase()
  const p = productoEnlazable(id)
  if (!p) return {}
  const r = await resolver(params.ref)
  const url = `https://creatuactivo.com/productos/${r?.slug ?? params.ref}/${id}`
  const titulo = `${p.name} · Catálogo Gano Excel`
  const descripcion = `${p.shortDescription} ${pesos(p.price)} · ${p.presentacion}.${r ? ` Le atiende ${aSocio(r).nombre}.` : ''}`
  return {
    title: titulo,
    description: descripcion,
    // Como el catálogo de cada socio: la versión oficial es /productos.
    alternates: { canonical: 'https://creatuactivo.com/productos' },
    openGraph: {
      title: p.name, description: descripcion, url, siteName: 'CreaTuActivo', locale: 'es_CO', type: 'website',
      images: [tarjetaProducto(id, p.name)],
    },
    twitter: { card: 'summary_large_image', title: p.name, description: descripcion },
    other: r ? { 'constructor-ref': r.constructorId } : undefined,
  }
}
