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
 * Página de Fundadores con Referido
 * Ruta: /fundadores/[ref]
 * Ejemplo: /fundadores/luiscabrejo-1288
 *
 * Esta página es idéntica a /fundadores pero captura el ref del path
 * para tracking de constructores.
 */

import FundadoresPage from '../page'

export default function FundadoresWithRefPage() {
  // El componente FundadoresPage es un Client Component que maneja
  // todo el contenido. El tracking del ref se hace en el cliente
  // a través de tracking.js que lee el path de la URL.

  return <FundadoresPage />
}

// Metadata para SEO
export async function generateMetadata({ params }: { params: { ref: string } }) {
  return {
    title: 'Únete como Constructor Fundador | CreaTuActivo',
    description: `Invitado por ${params.ref}. Conviértete en Constructor Fundador del ecosistema CreaTuActivo y construye tu activo de distribución.`,
  }
}
