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
  title: 'Oportunidad de Negocio: Construye tu Activo Digital y Genera Ingreso Residual',
  description: 'Descubre la primera oportunidad de negocio con un sistema automatizado que trabaja para ti. Construye un activo digital heredable y genera ingreso residual con nuestro modelo probado. Presentación empresarial completa.',
  keywords: 'oportunidad de negocio, crear activo digital, generar ingreso residual, negocio automatizado, franquicia digital, emprendimiento, Gano Excel, CreaTuActivo',
  authors: [{ name: 'CreaTuActivo.com' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://creatuactivo.com/presentacion-empresarial',
    title: 'Oportunidad de Negocio: Construye tu Activo Digital con un Sistema Automatizado',
    description: 'Descubre cómo construir un activo digital que genera ingreso residual. Presentación de la oportunidad de negocio con la tecnología de CreaTuActivo.com.',
    siteName: 'CreaTuActivo.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oportunidad de Negocio: Construye tu Activo Digital y Genera Ingreso Residual',
    description: 'Descubre cómo construir un activo digital que genera ingreso residual con un sistema automatizado. Presentación de negocio completa.',
    creator: '@creatuactivo',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PresentacionEmpresarialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
