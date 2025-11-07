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
 * Página de Productos con Referido
 * Ruta: /sistema/productos/[ref]
 * Ejemplo: /sistema/productos/luis-cabrejo-parra-4871288
 *
 * Esta página es idéntica a /sistema/productos pero captura el ref del path
 * para tracking de constructores.
 */

import ProductosPage from '../page'

export default function ProductosWithRefPage() {
  // El componente ProductosPage es un Client Component que maneja
  // todo el contenido. El tracking del ref se hace en el cliente
  // a través de tracking.js que lee el path de la URL.

  return <ProductosPage />
}

// Metadata para SEO
export async function generateMetadata({ params }: { params: { ref: string } }) {
  return {
    title: 'Catálogo de Productos | CreaTuActivo',
    description: `Descubre los productos del ecosistema CreaTuActivo. Compartido por ${params.ref}.`,
  }
}
