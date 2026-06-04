/**
 * Copyright © 2026 CreaTuActivo.com
 * Deck de conferencia — "El activo que sobrevive a su ausencia"
 * SER PRO Internacional · Jueves de Negocios · Luis Cabrejo
 *
 * Presentación keynote (estilo Jobs) con branding Bimetálico v3.0.
 * Uso en vivo: F = pantalla completa · → / clic / swipe = avanzar · ← = atrás.
 * noindex — herramienta interna de presentación.
 */

import type { Metadata } from 'next'
import Deck from './Deck'

export const metadata: Metadata = {
  title: 'El activo que sobrevive a su ausencia',
  description: 'Soberanía financiera — Luis Cabrejo · SER PRO Internacional',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <Deck />
}
