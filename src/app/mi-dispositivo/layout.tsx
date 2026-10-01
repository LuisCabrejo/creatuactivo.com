/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /mi-dispositivo — el socio marca su teléfono o su computador como suyo, y la
 * campanita de queswa.app deja de avisarle de sus propias visitas. Por qué y cómo
 * se firma el enlace → src/lib/dispositivo-socio.ts.
 *
 * noindex: es una herramienta del socio, no una página para encontrar.
 */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Este dispositivo es suyo',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
