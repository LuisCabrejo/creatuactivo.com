/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /prueba — Home v15 candidata: el sistema de diseño desplegado (29 ago 2026)
 * noindex: es una prueba A/B interna, no debe competir con la home real en buscadores.
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CreaTuActivo · Prueba',
  description:
    'Sea dueño de su propio canal de distribución. Productos premium de bienestar con Ganoderma, y una inteligencia artificial que explica y atiende por WhatsApp.',
  robots: { index: false, follow: false },
}

export default function PruebaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
