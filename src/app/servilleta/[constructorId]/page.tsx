/**
 * Copyright © 2026 CreaTuActivo.com
 * Servilleta Digital con constructorId en path
 * Ruta: /servilleta/[constructorId]
 *
 * Re-exporta la página principal. El tracking del constructorId
 * se realiza en el cliente leyendo el path de la URL.
 */

import ServilletaPage from '../page'

export default function ServilletaWithConstructorPage() {
  return <ServilletaPage />
}

export async function generateMetadata({ params }: { params: { constructorId: string } }) {
  return {
    title: 'La Servilleta Digital | CreaTuActivo',
    description: `La presentación de 4 diapositivas que explica el modelo en minutos. Compartido por ${params.constructorId}.`,
  }
}
