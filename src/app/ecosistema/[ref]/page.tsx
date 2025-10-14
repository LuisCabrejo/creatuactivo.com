/**
 * Ecosistema con Referido
 * Ruta: /ecosistema/[ref]
 * Ejemplo: /ecosistema/luiscabrejo-1288
 */

import EcosistemaPage from '../page'

export default function EcosistemaWithRefPage() {
  return <EcosistemaPage />
}

export async function generateMetadata({ params }: { params: { ref: string } }) {
  return {
    title: 'El Ecosistema | CreaTuActivo',
    description: `Invitado por ${params.ref}. Conoce el ecosistema completo de CreaTuActivo.`,
  }
}
