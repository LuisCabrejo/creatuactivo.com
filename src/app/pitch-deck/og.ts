/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Título, descripción e imagen de la tarjeta de /pitch-deck, en un solo sitio
 * (24 sep 2026). Los usan dos rutas: el layout de /pitch-deck y la ruta corta
 * /{slug}/pitch-deck, que necesita su PROPIA tarjeta con la url del slug — si
 * heredara la de /pitch-deck, Facebook publicaría el enlace sin el
 * identificador del distribuidor y esa visita no quedaría atribuida a nadie.
 * (En WhatsApp no pasa: el mensaje conserva el enlace pegado.)
 *
 * El copy es el de la pantalla 2 del deck, palabra por palabra.
 */
export const OG_PITCH_DECK = {
  title: 'Una empresa de distribución moderna',
  description:
    'Una empresa de distribución moderna vende en todo el continente y factura sin que usted esté encima. Hasta hace poco, tener una era casi imposible.',
  // La genera opengraph-image.tsx; la ruta sirve el PNG con o sin el hash que
  // Next le añade como query.
  image: 'https://creatuactivo.com/pitch-deck/opengraph-image',
  alt: 'Una empresa de distribución moderna | CreaTuActivo',
} as const
