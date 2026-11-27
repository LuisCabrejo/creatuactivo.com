/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * EL CATÁLOGO DE CADA PAÍS (27 nov 2026). La vitrina es una sola (page.tsx); lo
 * que cambia por país es el inventario, la moneda, las preguntas y lo que se
 * dice del pago y la entrega.
 *
 * El país lo decide la cuenta del socio: el país de su inscripción en Gano
 * (`private_users.pais`, y sin él, el árbol de Gano), porque es la cuenta con la
 * que compra y despacha el pedido (../socio.ts). No el país para el que comparte
 * (`mercado`, que elige la Presentación), ni su teléfono, ni la IP. /productos
 * sin socio es el de Colombia.
 *
 * Solo Colombia y Estados Unidos tienen catálogo; los demás países ven el de
 * Colombia hasta que exista su lista de precios.
 */

import { productData, LINEAS, PREGUNTAS, MAS_PEDIDO, imagenVitrina, pesos, type Product } from './catalogo-datos'
import { productDataUS, LINEAS_US, PREGUNTAS_US, MAS_PEDIDO_US } from './catalogo-usa'

export type PaisCatalogo = 'CO' | 'US'

export interface Catalogo {
  pais: PaisCatalogo
  productos: Record<string, Product>
  lineas: { id: string; nombre: string; ids: string[] }[]
  preguntas: { p: string; r: string }[]
  masPedido: string
  imagen: (id: string) => string
  precio: (n: number) => string
  /** Cada país guarda su carrito aparte: los productos no se llaman igual. */
  claveCarrito: string
}

/** Dólares con coma de miles y la moneda escrita: «$1,020 USD», «$47.50 USD». */
export function dolares(n: number): string {
  const [entero, dec] = (Math.round(n * 100) / 100).toFixed(2).split('.')
  return `$${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${dec === '00' ? '' : `.${dec}`} USD`
}

export const CATALOGOS: Record<PaisCatalogo, Catalogo> = {
  CO: {
    pais: 'CO', productos: productData, lineas: LINEAS, preguntas: PREGUNTAS, masPedido: MAS_PEDIDO,
    imagen: imagenVitrina, precio: pesos, claveCarrito: 'carrito_catalogo',
  },
  US: {
    pais: 'US', productos: productDataUS, lineas: LINEAS_US, preguntas: PREGUNTAS_US, masPedido: MAS_PEDIDO_US,
    imagen: (id) => productDataUS[id]?.image ?? '', precio: dolares, claveCarrito: 'carrito_catalogo_us',
  },
}

/** El país del catálogo a partir del de la cuenta del socio («US», «CO», null…). */
export function paisCatalogo(pais: string | null | undefined): PaisCatalogo {
  return (pais || '').toUpperCase() === 'US' ? 'US' : 'CO'
}
