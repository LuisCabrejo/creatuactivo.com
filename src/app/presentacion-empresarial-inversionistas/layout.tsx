/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Propuesta de Inversión | CreaTuActivo.com',
  description: 'Documento confidencial para inversionistas potenciales de CreaTuActivo.com',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function InversionistasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
