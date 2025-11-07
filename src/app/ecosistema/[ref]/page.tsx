/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

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
