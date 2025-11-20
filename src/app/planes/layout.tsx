/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planes Tecnológicos CreaTuActivo | NodeX + NEXUS IA',
  description: 'Planes de suscripción mensual para acceso a NodeX y NEXUS IA. Desde plan gratuito hasta ilimitado.',
  robots: {
    index: false,  // Contenido duplicado con /paquetes, usar redirect 301 después
    follow: true,
  },
};

export default function PlanesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
