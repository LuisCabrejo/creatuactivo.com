/**
 * Copyright © 2026 CreaTuActivo.com
 * Mapa de Salida con constructorId en path
 * Ruta: /mapa-de-salida/[constructorId]
 *
 * Re-exporta la página principal. El tracking del constructorId
 * se realiza en el cliente leyendo el path de la URL.
 */

import MapaDeSalidaPage from '../page'
import { ConstructorRefSetter } from './_setter'

export default function MapaDeSalidaWithConstructorPage({ params }: { params: { constructorId: string } }) {
  return (
    <>
      <ConstructorRefSetter constructorId={params.constructorId} />
      <MapaDeSalidaPage />
    </>
  )
}

export async function generateMetadata({ params }: { params: { constructorId: string } }) {
  return {
    title: 'El Mapa de Salida — Auditoría de 5 Fases | CreaTuActivo',
    description: `¿Sigues cambiando tiempo por dinero sin llegar a ningún lado? Descubre en cuál de las 5 fases estás atrapado. Compartido por ${params.constructorId}.`,
  }
}
