/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Los productos del catálogo, con su identificador en Gano Excel (17 oct 2026).
 *
 * El catálogo web (productos/catalogo-datos.ts) y el de WhatsApp (wa-productos.ts)
 * nombran cada producto por su slug. Para crear el pedido en la cuenta del
 * distribuidor, Gano necesita su `InventoryID`. La tabla salió de `gano_catalogo`
 * del Dashboard (leída de Gano el 17 oct 2026, 28 productos) cruzada a mano con
 * los 22 slugs: los nombres del back office van en mayúscula sostenida.
 *
 * Fuera de la tabla, a propósito: los paquetes ESP (897/898/899) y el Business
 * Kit (267). Eso es afiliación, no una compra, y el Dashboard también los rechaza.
 */

export const INVENTARIO_GANO: Record<string, number> = {
  'ganocafe-3-en-1': 501,
  'ganocafe-clasico': 505,
  'ganorico-latte-rico': 509,
  'ganorico-mocha-rico': 503,
  'ganorico-shoko-rico': 512,
  'espirulina-gano-creal': 507,
  'bebida-oleaf-gano-rooibos': 504,
  'gano-schokoladde': 502,
  'bebida-colageno-reskine': 530,
  'capsulas-ganoderma': 801,
  'capsulas-excellium': 803,
  'capsulas-cordygold': 805,
  'pasta-dientes-gano-fresh': 302,
  'jabon-gano': 301,
  'jabon-transparente-gano': 303,
  'champu-piel-brillo': 305,
  'acondicionador-piel-brillo': 306,
  'exfoliante-piel-brillo': 307,
  'maquina-luvoco': 997,
  'luvoco-suave': 816,
  'luvoco-medio': 817,
  'luvoco-fuerte': 818,
}

export interface ItemGano { inventoryId: number; quantity: number }

/** Líneas del carrito (slug + cantidad) → ítems de Gano. Devuelve los slugs que no se reconocen. */
export function lineasAItemsGano(lineas: { id?: string; slug?: string; cantidad: number }[]): { items: ItemGano[]; desconocidos: string[] } {
  const items: ItemGano[] = []
  const desconocidos: string[] = []
  for (const l of lineas) {
    const slug = String(l.slug ?? l.id ?? '')
    const inventoryId = INVENTARIO_GANO[slug]
    const cantidad = Math.floor(Number(l.cantidad))
    if (!inventoryId) { desconocidos.push(slug || '?'); continue }
    if (!(cantidad > 0)) continue
    const previo = items.find((i) => i.inventoryId === inventoryId)
    if (previo) previo.quantity += cantidad
    else items.push({ inventoryId, quantity: cantidad })
  }
  return { items, desconocidos }
}

/** Los departamentos como los nombra Gano (código = AddressState del checkout). Copia de gano-checkout-catalogos.ts del Dashboard. */
export const DEPARTAMENTOS: { code: string; name: string }[] = [
  { code: 'AMA', name: 'Amazonas' }, { code: 'ANT', name: 'Antioquia' }, { code: 'ARA', name: 'Arauca' },
  { code: 'ATL', name: 'Atlántico' }, { code: 'DC', name: 'Bogotá D.C.' }, { code: 'BOL', name: 'Bolívar' },
  { code: 'BOY', name: 'Boyacá' }, { code: 'CAL', name: 'Caldas' }, { code: 'CAQ', name: 'Caquetá' },
  { code: 'CAS', name: 'Casanare' }, { code: 'CAU', name: 'Cauca' }, { code: 'CES', name: 'Cesar' },
  { code: 'CHO', name: 'Chocó' }, { code: 'COR', name: 'Córdoba' }, { code: 'CUN', name: 'Cundinamarca' },
  { code: 'GUA', name: 'Guainía' }, { code: 'GUV', name: 'Guaviare' }, { code: 'HUI', name: 'Huila' },
  { code: 'LAG', name: 'La Guajira' }, { code: 'MAG', name: 'Magdalena' }, { code: 'MET', name: 'Meta' },
  { code: 'NAR', name: 'Nariño' }, { code: 'NSA', name: 'Norte de Santander' }, { code: 'PUT', name: 'Putumayo' },
  { code: 'QUI', name: 'Quindío' }, { code: 'RIS', name: 'Risaralda' }, { code: 'SAP', name: 'San Andrés y Providencia' },
  { code: 'SAN', name: 'Santander' }, { code: 'SUC', name: 'Sucre' }, { code: 'TOL', name: 'Tolima' },
  { code: 'VAC', name: 'Valle del Cauca' }, { code: 'VAU', name: 'Vaupés' }, { code: 'VID', name: 'Vichada' },
]

/** El `?carrito=` del catálogo: «a,b» (una unidad cada uno, forma vieja) o «a:2,b:1». */
export function leerCarritoDeUrl(valor: string | null | undefined): { id: string; cantidad: number }[] {
  if (!valor) return []
  const out: { id: string; cantidad: number }[] = []
  for (const parte of valor.split(',')) {
    const [id, n] = parte.trim().split(':')
    if (!id || !/^[a-z0-9-]+$/.test(id)) continue
    const cantidad = Math.min(50, Math.max(1, Math.floor(Number(n)) || 1))
    const previo = out.find((l) => l.id === id)
    if (previo) previo.cantidad = Math.min(50, previo.cantidad + cantidad)
    else out.push({ id, cantidad })
  }
  return out
}

export function carritoAUrl(lineas: { id: string; cantidad: number }[]): string {
  return lineas.filter((l) => l.cantidad > 0).map((l) => (l.cantidad === 1 ? l.id : `${l.id}:${l.cantidad}`)).join(',')
}

// ─── El envío ─────────────────────────────────────────────────────────────────
//
// NO hay tarifa fija (17 oct 2026, 36 cotizaciones en el back office del Director):
// el flete es por ZONA de destino de Servientrega y por cantidad o monto — 13.500
// a Villavicencio, Bogotá, Medellín, Cali, Barranquilla…; 20.500 a Tame, Yopal,
// Tunja, Neiva, Pasto, Apartadó, Montería…; 24.000 y 53.000 por 22 cajas. Apartadó
// cuesta más que Medellín y Puerto Gaitán lo mismo que Bogotá: no se deduce. El
// dato lo da Gano al fijar la dirección; queswa.app lo consulta con la cuenta del
// Director (no la del distribuidor) y lo guarda por destino y pedido (gano_fletes).
// Lo que sí es fijo: a estos departamentos Gano no despacha (no están en su lista).
export const SIN_ENVIO_GANO = new Set(['AMA', 'GUA', 'GUV', 'SAP', 'VAU', 'VID'])
export const DEPARTAMENTOS_CON_ENVIO = DEPARTAMENTOS.filter((d) => !SIN_ENVIO_GANO.has(d.code))
