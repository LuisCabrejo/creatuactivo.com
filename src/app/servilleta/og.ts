/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Título, descripción e imagen de la tarjeta que comparte el SOCIO, en un solo
 * sitio. La usa la ruta corta /{slug}/presentacion (y sus alias, entre ellos
 * /{slug}/servilleta), que necesita su PROPIA tarjeta con la url del slug — si
 * heredara la de /servilleta, Facebook publicaría el enlace sin el
 * identificador del distribuidor y esa visita no quedaría atribuida a nadie.
 * ⚠️ La tarjeta de /servilleta a secas (la que encuentra Google) lleva el título
 * SEO de su layout; esta es la del prospecto, y NO nombra a Gano Excel arriba.
 * (En WhatsApp no pasa: el mensaje conserva el enlace pegado.)
 *
 * CADA ESPACIO HACE UN TRABAJO DISTINTO (Director, 30 sep 2026). Hasta ese día la
 * imagen, el título y la descripción repetían «una empresa de distribución
 * moderna», y el texto venía de «Por qué ahora», la pantalla que salió del deck.
 * Ahora la imagen detiene la mirada (los pares de la modernización, lo que tiene
 * calado en el 1-a-1), el título dice qué es (la promesa de la pantalla 5) y la
 * descripción da la razón para abrirlo. ⚠️ «Network marketing» NO va en la
 * tarjeta: viaja sin la voz del socio y se reenvía a cualquiera; se nombra en el
 * deck, donde el socio pone el contexto.
 */
export const OG_PRESENTACION = {
  title: 'Una empresa de distribución moderna, a su nombre',
  description:
    'Los dos sectores donde vemos la oportunidad, y los tres elementos que se requieren para montar la suya.',
  // La genera opengraph-image.tsx; la ruta sirve el PNG con o sin el hash que
  // Next le añade como query.
  image: 'https://creatuactivo.com/servilleta/opengraph-image',
  // El texto alternativo describe la IMAGEN, no repite el título.
  alt: 'Domicilios a Rappi, taxis a Uber, la fila del banco a Nequi | CreaTuActivo',
} as const
