/**
 * Paquetes de Inversión con Referido
 * Ruta: /paquetes/[ref]
 * Ejemplo: /paquetes/luiscabrejo-1288
 */

import PaquetesPage from '../page'

export default function PaquetesWithRefPage() {
  return <PaquetesPage />
}

export async function generateMetadata({ params }: { params: { ref: string } }) {
  return {
    title: 'Paquetes de Inversión | CreaTuActivo',
    description: `Invitado por ${params.ref}. Descubre los paquetes de inversión del ecosistema CreaTuActivo.`,
  }
}
