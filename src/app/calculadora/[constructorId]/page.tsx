/**
 * Copyright © 2026 CreaTuActivo.com
 * Calculadora con constructorId en path
 * Ruta: /calculadora/[constructorId]
 *
 * Re-exporta la página principal. El tracking del constructorId
 * se realiza en el cliente leyendo el path de la URL.
 */

import CalculadoraPage from '../page'

export default function CalculadoraWithConstructorPage() {
  return <CalculadoraPage />
}

export async function generateMetadata({ params }: { params: { constructorId: string } }) {
  return {
    title: 'Calculadora de Días de Libertad | CreaTuActivo',
    description: `¿Cuántos días de libertad financiera tiene? Descubre su número real con esta calculadora. Compartido por ${params.constructorId}.`,
  }
}
