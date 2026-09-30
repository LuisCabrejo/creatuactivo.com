/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Tarjeta Open Graph de /presentacion (24 sep 2026; rehecha el 30 sep).
 *
 * POR QUÉ EXISTE: la página es noindex, pero el socio PEGA el enlace en un chat
 * después de la reunión, y ahí la tarjeta sí se renderiza. Sin un `openGraph`
 * propio en su layout, Meta hereda el del layout raíz y la vista previa enlaza a
 * la portada del sitio aunque el enlace pegado sea correcto — la trampa
 * documentada en CLAUDE.md, «OG por página».
 *
 * LA IMAGEN DETIENE LA MIRADA; el título y la descripción (og.ts) hacen otros dos
 * trabajos. La imagen es la de los pares de la modernización, compartida con la
 * tarjeta de Queswa: vive en src/lib/og-modernizacion.tsx y aquí solo cambia el
 * rótulo.
 */

import { tarjetaModernizacion } from '@/lib/og-modernizacion'

export const runtime = 'edge'
export const alt = 'Domicilios a Rappi, taxis a Uber, la fila del banco a Nequi | CreaTuActivo'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return tarjetaModernizacion('CreaTuActivo · Presentación')
}
