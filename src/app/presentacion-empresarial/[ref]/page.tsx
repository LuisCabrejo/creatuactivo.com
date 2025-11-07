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
 * Presentación Empresarial con Referido
 * Ruta: /presentacion-empresarial/[ref]
 * Ejemplo: /presentacion-empresarial/luiscabrejo-1288
 */

import PresentacionPage from '../page'

export default function PresentacionWithRefPage() {
  return <PresentacionPage />
}

export async function generateMetadata({ params }: { params: { ref: string } }) {
  return {
    title: 'Presentación Empresarial | CreaTuActivo',
    description: `Invitado por ${params.ref}. Descubre el modelo de construcción de activos empresariales de CreaTuActivo.`,
  }
}
