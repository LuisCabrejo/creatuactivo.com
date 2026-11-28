/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La imagen de la tarjeta que sale al compartir el catálogo, en un solo sitio.
 * La declaran /productos (layout.tsx) y el catálogo de cada socio
 * (/productos/{slug}, [ref]/page.tsx).
 *
 * ESTILO DE VIDA, NO TEXTO (Director, 25 oct 2026). Hasta ese día la tarjeta era
 * texto sobre carbón («Catálogo de Productos»), y la tienda que abre es crema y
 * cálida. Ahora es una mesa con luz de mañana, una taza de café con leche y la
 * caja del Ganocafé 3 en 1 a su lado, sin texto: el titular de la v1 ensuciaba
 * la imagen, y el título ya viaja debajo de ella.
 *
 * Es un JPG fijo y no un opengraph-image.tsx: con una foto de fondo el PNG que
 * genera next/og pesa cerca de 1 MB, y WhatsApp —por donde el socio comparte el
 * catálogo— suele dejar sin imagen las vistas previas pesadas. El JPG pesa ~90 KB.
 * Lo compone scripts/componer-tarjeta-catalogo.mjs, que lee de aquí el nombre.
 *
 * ⚠️ UNA IMAGEN QUE CAMBIA LLEVA NOMBRE NUEVO (-v2, -v3…): el CDN guarda los
 * archivos de public/ un día y Facebook guarda la tarjeta por su URL.
 */
export const TARJETA_CATALOGO = {
  url: 'https://creatuactivo.com/productos/tarjeta-catalogo-v2.jpg',
  width: 1200,
  height: 630,
  // El texto alternativo describe la IMAGEN, no repite el título.
  alt: 'Una taza de café con leche junto a la caja de Ganocafé 3 en 1, en una mesa con luz de mañana',
} as const

/**
 * La del catálogo de Estados Unidos (27 nov 2026): la misma escena con la foto del
 * Gano Café 3-in-1 de allá. La compone scripts/componer-tarjeta-catalogo-usa.mjs.
 */
export const TARJETA_CATALOGO_US = {
  url: 'https://creatuactivo.com/productos/tarjeta-catalogo-us-v1.jpg',
  width: 1200,
  height: 630,
  alt: 'Una taza de café con leche junto a la caja de Gano Café 3-in-1, en una mesa con luz de mañana',
} as const

/** La tarjeta del catálogo de ese país. */
export function tarjetaCatalogo(pais: 'CO' | 'US') {
  return pais === 'US' ? TARJETA_CATALOGO_US : TARJETA_CATALOGO
}

/**
 * La tarjeta de UNA línea del catálogo (28 nov 2026), para /productos/{slug}?linea=…:
 * la imagen de categoría (public/productos/compuestas, la componen
 * scripts/componer-imagenes-categoria*.mjs), la misma que el socio comparte como
 * flyer desde queswa.app (Compartir → Flyers). Los ids son los de LINEAS y
 * LINEAS_US. Una línea que no está aquí deja la tarjeta del catálogo.
 * ⚠️ Si una imagen cambia, lleva nombre nuevo (-v2…) aquí y en queswa.app.
 */
const TARJETAS_LINEA: Record<'CO' | 'US', Record<string, { archivo: string; alt: string }>> = {
  CO: {
    cafe: { archivo: 'categoria-bebidas.jpg', alt: 'Las cajas de los cafés y bebidas de Gano Excel' },
    luvoco: { archivo: 'categoria-luvoco.jpg', alt: 'Las cápsulas Luvoco Suave, Medio y Fuerte junto a su máquina' },
    capsulas: { archivo: 'categoria-suplementos.jpg', alt: 'Los frascos de cápsulas de Ganoderma, Excellium y Cordygold' },
    cuidado: { archivo: 'categoria-cuidado-personal.jpg', alt: 'Los productos de cuidado personal de Gano Excel' },
  },
  US: {
    cafe: { archivo: 'usa/categoria-bebidas-v1.jpg', alt: 'Las cajas de los cafés y bebidas de Gano Excel USA' },
    capsulas: { archivo: 'usa/categoria-suplementos-v1.jpg', alt: 'Los frascos de cápsulas de Gano Excel USA' },
    cuidado: { archivo: 'usa/categoria-cuidado-personal-v1.jpg', alt: 'Los productos de cuidado personal de Gano Excel USA' },
  },
}

export function tarjetaLinea(linea: string, pais: 'CO' | 'US') {
  const t = Object.prototype.hasOwnProperty.call(TARJETAS_LINEA[pais], linea) ? TARJETAS_LINEA[pais][linea] : null
  return t ? { url: `https://creatuactivo.com/productos/compuestas/${t.archivo}`, width: 1080, height: 1080, alt: t.alt } : null
}

/**
 * La tarjeta de UN producto (29 oct 2026), para el enlace directo
 * /productos/{slug}/{producto}: la foto real del producto sobre el crema de la
 * tienda, centrada (resiste el recorte cuadrado de WhatsApp) y sin texto ni
 * precio, igual que la del catálogo. Las compone
 * scripts/componer-tarjetas-producto.mjs, que lee de aquí la versión.
 *
 * ⚠️ Si cambian, se sube la versión (-v2…) antes de componerlas: mismo motivo
 * que la del catálogo.
 */
export const VERSION_TARJETAS_PRODUCTO = 'v1'

export function tarjetaProducto(id: string, nombre: string, pais: 'CO' | 'US' = 'CO') {
  return {
    // Las de Estados Unidos (27 nov 2026), con la foto de allá, en tarjetas/usa/.
    url: `https://creatuactivo.com/productos/tarjetas/${pais === 'US' ? 'usa/' : ''}${id}-${VERSION_TARJETAS_PRODUCTO}.jpg`,
    width: 1200,
    height: 630,
    alt: `${nombre}, la foto del producto`,
  }
}
