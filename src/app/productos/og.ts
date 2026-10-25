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
