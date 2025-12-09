/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 */

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reto de los 12 Días | CreaTuActivo',
  description: 'Construye el mejor diciembre de tu vida - 12 días, 12 niveles, una red de 8,190 personas',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function Reto12DiasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
