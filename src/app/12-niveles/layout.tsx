/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 */

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Los 12 Niveles | CreaTuActivo',
  description: 'El método de duplicación 2×2: 12 niveles para construir su organización de distribución con CreaTuActivo',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function Reto12NivelesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
