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
 * Página de Fundadores Network con Referido
 * Ruta: /fundadores-network/[ref]
 * Ejemplo: /fundadores-network/luis-cabrejo-parra-4871288
 *
 * Esta página es idéntica a /fundadores-network pero captura el ref del path
 * para tracking de constructores.
 */

import FundadoresNetworkPage from '../page'

export default function FundadoresNetworkWithRefPage() {
  // El componente FundadoresNetworkPage es un Client Component que maneja
  // todo el contenido. El tracking del ref se hace en el cliente
  // a través de tracking.js que lee el path de la URL.

  return <FundadoresNetworkPage />
}

// Metadata para SEO
export async function generateMetadata({ params }: { params: { ref: string } }) {
  return {
    title: 'Fundadores Network | CreaTuActivo',
    description: `Invitado por ${params.ref}. Únete a la Red de Fundadores y construye tu activo empresarial con CreaTuActivo.`,
  }
}
