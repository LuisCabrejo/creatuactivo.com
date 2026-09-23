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

export const metadata: Metadata = {
  title: 'Pitch Deck | CreaTuActivo',
  description:
    'Presentación 1-a-1: qué creemos, el momento, el problema que resolvemos, las tres piezas ensambladas, el producto y cómo se gana.',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function PitchDeckLayout({ children }: { children: React.ReactNode }) {
  return children
}
