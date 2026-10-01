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
 * Ruta: /productos/[ref]
 * Ejemplo: /productos/luis-cabrejo-parra-4871288
 *
 * Esta página es idéntica a /productos pero captura el ref del path
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
    // La versión oficial es /productos: cada socio tiene su copia del catálogo, y
    // sin canonical competían entre sí como contenido duplicado (1 oct 2026).
    title: 'Catálogo Gano Excel 2026: café, bebidas y suplementos con Ganoderma',
    alternates: { canonical: 'https://creatuactivo.com/productos' },
    description: 'Los 22 productos de Gano Excel con su precio en pesos: café, bebidas, suplementos y cuidado personal. Queswa le ayuda a elegir y el pedido se hace por WhatsApp.',
  }
}
