/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 */

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Proyección Fundadores | CreaTuActivo',
  description: 'Proyección exclusiva para fundadores - Modelo de duplicación 2×2',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function ProyeccionFundadoresLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
