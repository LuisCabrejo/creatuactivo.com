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
 * Página de Fundadores Profesionales con Referido
 * Ruta: /fundadores-profesionales/[ref]
 * Ejemplo: /fundadores-profesionales/luis-cabrejo-parra-4871288
 *
 * Esta página es idéntica a /fundadores-profesionales pero captura el ref del path
 * para tracking de constructores.
 */

import FundadoresProfesionalesPage from '../page'

export default function FundadoresProfesionalesWithRefPage() {
  // El componente FundadoresProfesionalesPage es un Client Component que maneja
  // todo el contenido. El tracking del ref se hace en el cliente
  // a través de tracking.js que lee el path de la URL.

  return <FundadoresProfesionalesPage />
}

// Metadata para SEO
export async function generateMetadata({ params }: { params: { ref: string } }) {
  return {
    title: 'Fundadores Profesionales | CreaTuActivo',
    description: `Invitado por ${params.ref}. Únete como Fundador Profesional y construye tu activo corporativo con CreaTuActivo.`,
  }
}
