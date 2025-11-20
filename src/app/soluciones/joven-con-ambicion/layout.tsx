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
  title: 'Del Potencial al Activo: Genera Ingresos Siendo Estudiante | Joven CreaTuActivo',
  description: 'Solución para jóvenes estudiantes: genera ingresos mientras estudias, crea activo digital escalable, mentoría 1:1. Gano Excel + tecnología para la Generación Z. Emprende desde la universidad.',
  keywords: 'generar ingresos estudiante, emprendimiento universitario, ingresos estudiante colombia, negocio para jóvenes, activo digital estudiante, emprender siendo estudiante',
  authors: [{ name: 'CreaTuActivo.com' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://creatuactivo.com/soluciones/joven-con-ambicion',
    title: 'Del Potencial al Activo: Genera Ingresos Siendo Estudiante',
    description: 'Genera ingresos mientras estudias. Crea activo digital escalable. Gano Excel + tecnología para jóvenes estudiantes.',
    siteName: 'CreaTuActivo.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Del Potencial al Activo: Genera Ingresos Siendo Estudiante',
    description: 'Ingresos + Estudios + Activo digital. Solución para jóvenes CreaTuActivo.',
    creator: '@creatuactivo',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function JovenConAmbicionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
