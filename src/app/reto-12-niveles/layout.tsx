/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 */

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Los 12 Niveles | CreaTuActivo',
  description: 'El protocolo de duplicación 2×2 - 12 niveles, una red de 8,190 personas',
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
