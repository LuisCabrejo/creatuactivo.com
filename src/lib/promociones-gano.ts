/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * LAS PROMOCIONES DE GANO EXCEL — combos armados que Gano publica con su propio
 * código de producto. La primera: 80094 «PROMOCIÓN DE PRODUCTOS» (22 oct 2026).
 *
 * ESPEJO de queswa.app (src/lib/promociones-gano.ts del Dashboard): allá se cargan
 * en Cargar Compras y Queswa del Centro de Mando; aquí entran al catálogo de los
 * clientes (productos/catalogo-datos.ts), al pedido por WhatsApp (wa-productos.ts)
 * y a lo que sabe Queswa en el canal (api/nexus). Una promoción nueva se registra
 * en los dos repos.
 *
 * Gano no dice qué trae una promoción: el catálogo (act11) solo da nombre, precio
 * y PV, y el detalle (act12) trae la descripción vacía. Lo que trae sale de la
 * imagen que publica Gano y se escribe aquí a mano. El tope por pedido es el
 * `LimitQuota` del act12: 1 en la 80094 (100 en un producto normal). No está
 * comprobado si es por pedido o por cuenta: Gano dice «Sólo puede agregar 1
 * unidades más».
 *
 * VIGENCIA: una promoción está vigente mientras esté en el catálogo de Gano que
 * guarda queswa.app (`gano_catalogo`, fila 'colombia', releída cada 4 h). Cuando
 * Gano la quita, desaparece del catálogo web y del bloque de Queswa sola. Gano no
 * publica hasta cuándo va.
 *
 * Datos puros arriba (los importa el catálogo, que corre en el navegador); el
 * lector de la base, abajo, solo en el servidor.
 */

export interface PromocionGano {
  inventoryId: number
  /** El slug con que la nombran el catálogo web, WhatsApp y `wa_pedidos`. */
  slug: string
  nombre: string
  precioCOP: number
  pv: number
  /** Lo que trae, con los slugs de este sitio y el nombre como lo pone Gano. */
  contenido: { slug: string; cantidad: number; nombre: string }[]
  limitePorPedido: number
  /** Foto de la vitrina (fondo transparente) y la de WhatsApp (fondo blanco). */
  imagen: string
  imagenWA: string
  registrada: string
}

export const PROMOCIONES_GANO: PromocionGano[] = [
  {
    inventoryId: 80094,
    slug: 'promocion-gano-80094',
    nombre: 'Promoción de productos',
    precioCOP: 587000,
    pv: 83,
    contenido: [
      { slug: 'ganocafe-3-en-1', cantidad: 2, nombre: 'Ganocafé 3 en 1' },
      { slug: 'gano-schokoladde', cantidad: 1, nombre: 'Gano Schokolade' },
      { slug: 'ganocafe-clasico', cantidad: 1, nombre: 'Ganocafé Clásico' },
      { slug: 'espirulina-gano-creal', cantidad: 1, nombre: "Gano C'real Spirulina" },
      { slug: 'ganorico-shoko-rico', cantidad: 1, nombre: 'Ganorico Shoko Rico' },
      { slug: 'jabon-transparente-gano', cantidad: 1, nombre: 'Gano Transparent Soap' },
    ],
    limitePorPedido: 1,
    imagen: '/productos/promociones/promocion-80094.png',
    imagenWA: '/productos/promociones/promocion-80094.jpg',
    registrada: '2026-10-22',
  },
]

export function promocionPorSlug(slug: string): PromocionGano | null {
  return PROMOCIONES_GANO.find((p) => p.slug === slug) ?? null
}

export function unidadesDe(p: PromocionGano): number {
  return p.contenido.reduce((s, c) => s + c.cantidad, 0)
}

/** «2 Ganocafé 3 en 1, 1 Gano Schokolade, … y 1 Gano Transparent Soap». */
export function contenidoLegible(p: PromocionGano): string {
  const partes = p.contenido.map((c) => `${c.cantidad} ${c.nombre}`)
  return partes.length > 1 ? `${partes.slice(0, -1).join(', ')} y ${partes.at(-1)}` : partes.join('')
}

const pesos = (n: number) => '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

/**
 * Lo que sabe Queswa en el canal y en el chat de la web cuando se habla de
 * promociones. `porSeparado` = lo mismo producto por producto, con los precios
 * del catálogo (lo calcula quien llama, que tiene la tabla de precios).
 */
export function bloquePromocionesParaPrompt(vigentes: PromocionGano[], porSeparado: (p: PromocionGano) => number | null): string | null {
  if (!vigentes.length) return null
  const lineas = vigentes.map((p) => {
    const sep = porSeparado(p)
    return `• Código ${p.inventoryId} · ${p.nombre}. Trae ${contenidoLegible(p)}: ${unidadesDe(p)} productos.
  Precio: ${pesos(p.precioCOP)} con IVA${sep ? `; los mismos ${unidadesDe(p)} por separado suman ${pesos(sep)}` : ''}. Gano Excel deja ${p.limitePorPedido === 1 ? 'una' : p.limitePorPedido} por pedido.
  Para un distribuidor: la promoción da ${p.pv} PV en total. Ese número lo fija Gano para la promoción: NO se calcula sumando los PV de cada producto (por separado darían más), y con él se juzga cualquier umbral (50 PV, 100 PV). A un cliente no le nombre los PV.`
  })
  return `<promociones_gano_vigentes>
Estas son las promociones que Gano Excel Colombia tiene hoy en su catálogo (se compran y se despachan en Colombia):
${lineas.join('\n')}
Si preguntan por promociones u ofertas, son estas y no otras. Se piden como cualquier producto: en el catálogo de su distribuidor o escribiendo aquí «quiero pedir la promoción». Para comprarla no hace falta vincularse ni abrir un código.
Si piden más de una: Gano Excel deja una por pedido, y eso es todo lo que se sabe. Ofrezca una. NO diga que se pueden hacer varios pedidos ni «uno tras otro»: no está comprobado que Gano deje comprar otra en el pedido siguiente.
Gano no publica hasta cuándo va: no lo invente. Nombre los productos y el precio; no les atribuya efectos.
</promociones_gano_vigentes>`
}

// ── Vigencia (solo servidor) ──────────────────────────────────────────────────
let cache: { at: number; ids: number[] } | null = null
const TTL_MS = 5 * 60 * 1000

/** Los códigos de las promociones registradas que están hoy en el catálogo de Gano. Nunca lanza. */
export async function promocionesVigentesIds(): Promise<number[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.ids
  try {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!key || !url) return []
    const r = await fetch(`${url}/rest/v1/gano_catalogo?id=eq.colombia&select=productos`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store',
    })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const filas = (await r.json()) as { productos?: { inventoryId?: number }[] }[]
    const enCatalogo = new Set((filas[0]?.productos ?? []).map((p) => Number(p.inventoryId)))
    const ids = PROMOCIONES_GANO.filter((p) => enCatalogo.has(p.inventoryId)).map((p) => p.inventoryId)
    cache = { at: Date.now(), ids }
    return ids
  } catch (e) {
    console.warn('⚠️ [Promociones] No se pudo leer el catálogo de Gano:', e instanceof Error ? e.message : e)
    return cache?.ids ?? []
  }
}

export async function promocionesVigentes(): Promise<PromocionGano[]> {
  const ids = await promocionesVigentesIds()
  return PROMOCIONES_GANO.filter((p) => ids.includes(p.inventoryId))
}
