/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /prueba — Home 2 (ejercicio de lenguaje concreto)
 * noindex: es una prueba A/B interna, no debe competir con la home real en buscadores.
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CreaTuActivo · Prueba',
  description:
    'Distribuya productos de consumo diario. La parte difícil —explicar y atender— la hace una inteligencia artificial en WhatsApp.',
  robots: { index: false, follow: false },
}

export default function PruebaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
