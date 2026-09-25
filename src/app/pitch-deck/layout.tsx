/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /pitch-deck — herramienta de presentación 1-a-1 (23 sep 2026).
 *
 * noindex por decisión del Director: es una pieza que el socio conduce delante de
 * una persona, no una página que deba encontrarse en Google. /servilleta sí se
 * indexa (SEO de «plan servilleta»); esta no compite con ella ni la reemplaza.
 */

import type { Metadata } from 'next'
import { OG_PITCH_DECK } from './og'

// El texto vive en og.ts porque lo comparte la ruta corta /{slug}/pitch-deck.
const DESCRIPCION = OG_PITCH_DECK.description
const TITULO_OG = `${OG_PITCH_DECK.title} | CreaTuActivo`

export const metadata: Metadata = {
  title: 'Pitch Deck | CreaTuActivo',
  description: DESCRIPCION,
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  // ⚠️ El openGraph va COMPLETO y con `url` PROPIA. noindex no tiene nada que ver
  // con esto: la página no se busca en Google, pero el socio SÍ pega el enlace en
  // un chat y ahí la tarjeta se renderiza. Y si solo se declaran title y
  // description, Meta hereda la url del layout raíz: la vista previa enlaza a la
  // portada del sitio aunque el enlace pegado sea correcto. Es la trampa de
  // «OG por página» de CLAUDE.md. La imagen la genera opengraph-image.tsx.
  alternates: { canonical: 'https://creatuactivo.com/pitch-deck' },
  openGraph: {
    type: 'website',
    siteName: 'CreaTuActivo.com',
    locale: 'es_CO',
    url: 'https://creatuactivo.com/pitch-deck',
    title: TITULO_OG,
    description: DESCRIPCION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITULO_OG,
    description: DESCRIPCION,
  },
}

export default function PitchDeckLayout({ children }: { children: React.ReactNode }) {
  return children
}
