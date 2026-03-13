/**
 * Copyright © 2026 CreaTuActivo.com
 * Mapa de Salida — Coordenada 1 con ref de distribuidor
 * Ruta: /mapa-de-salida/dia-1/[ref]
 *
 * Re-exporta la página principal. El tracking del ref
 * se realiza vía tracking.js leyendo el path de la URL.
 */

import Coordenada1Page from '../page'

export default function Coordenada1WithRefPage() {
  return <Coordenada1Page />
}

export async function generateMetadata({ params }: { params: { ref: string } }) {
  return {
    title: 'Coordenada 1: Por qué sudas mucho, pero no avanzas | CreaTuActivo',
    description: `La falla estructural del "Plan por Defecto" que te mantiene corriendo sin llegar a ningún lado. Compartido por ${params.ref}.`,
    robots: { index: false, follow: false },
  }
}
