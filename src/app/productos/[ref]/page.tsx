/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El catálogo de UN distribuidor: /productos/{slug}
 *
 * Desde el 17 oct 2026 cada catálogo lleva el slug de su distribuidor (Director):
 * /productos/luis-cabrejo y no /productos/luis-cabrejo-1288. El servidor resuelve
 * el slug, y:
 *   · un enlace viejo con el código o con un seudónimo anterior redirige (308) al
 *     slug vigente, conservando ?carrito=;
 *   · la página publica el código del socio en <meta name="constructor-ref">, que
 *     es de donde lo toma tracking.js (antes solo lo reconocía en la dirección, y
 *     solo con forma de código: con el slug la visita quedaba sin dueño);
 *   · la tarjeta para compartir lleva /productos/{slug}. Antes heredaba la de
 *     /productos, así que al compartir el catálogo en Facebook se publicaba el
 *     enlace pelado y la visita no quedaba a nombre de nadie (misma trampa que la
 *     presentación, 24 sep 2026).
 * Un ref que no corresponde a ningún socio muestra el catálogo sin socio, nunca
 * una página de error: es un enlace que alguien compartió.
 */

import { permanentRedirect } from 'next/navigation'
import CatalogoTienda from '../page'
import { TARJETA_CATALOGO } from '../og'
import { resolver, aSocio } from '../socio'

export const dynamic = 'force-dynamic'

export default async function CatalogoDelSocio({
  params,
  searchParams,
}: {
  params: { ref: string }
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const r = await resolver(params.ref)
  if (r?.slug && r.slug !== params.ref) {
    const carrito = typeof searchParams?.carrito === 'string' ? `?carrito=${encodeURIComponent(searchParams.carrito)}` : ''
    permanentRedirect(`/productos/${r.slug}${carrito}`)
  }
  return <CatalogoTienda socioInicial={r ? aSocio(r) : null} />
}

export async function generateMetadata({ params }: { params: { ref: string } }) {
  const r = await resolver(params.ref)
  const url = `https://creatuactivo.com/productos/${r?.slug ?? params.ref}`
  const titulo = 'Catálogo Gano Excel 2026: café, bebidas y suplementos con Ganoderma'
  const descripcion = r
    ? `Los 22 productos de Gano Excel con su precio en pesos. Le atiende ${aSocio(r).nombre}: paga directo a Gano Excel o con ${aSocio(r).primerNombre} por WhatsApp.`
    : 'Los 22 productos de Gano Excel con su precio en pesos: café, bebidas, suplementos y cuidado personal. Paga directo a Gano Excel o con su distribuidor por WhatsApp.'
  return {
    title: titulo,
    description: descripcion,
    // La versión oficial es /productos: cada socio tiene su copia del catálogo, y
    // sin canonical competían entre sí como contenido duplicado (1 oct 2026).
    alternates: { canonical: 'https://creatuactivo.com/productos' },
    // La imagen se declara: al definir su propio openGraph, la página deja de heredar
    // la de /productos y la tarjeta salía sin imagen. Es la misma (og.ts).
    openGraph: {
      title: titulo, description: descripcion, url, siteName: 'CreaTuActivo', locale: 'es_CO', type: 'website',
      images: [TARJETA_CATALOGO],
    },
    twitter: { card: 'summary_large_image', title: titulo, description: descripcion },
    // tracking.js lee el dueño de la visita de aquí (ver la cabecera).
    other: r ? { 'constructor-ref': r.constructorId } : undefined,
  }
}
