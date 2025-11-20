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
  title: 'Del Operador al Arquitecto: Automatiza Tu Negocio | Emprendedor CreaTuActivo',
  description: 'Solución para emprendedores: automatiza operaciones, genera ingresos residuales, escala sin burnout. NodeX + IA NEXUS + Gano Excel. Transforma de operador a arquitecto de negocio.',
  keywords: 'automatizar negocio, emprendedor automatización, ingresos residuales emprendedor, escalar negocio sin burnout, arquitecto de negocio, sistemas automatizados negocio',
  authors: [{ name: 'CreaTuActivo.com' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://creatuactivo.com/soluciones/emprendedor-negocio',
    title: 'Del Operador al Arquitecto: Automatiza Tu Negocio | Emprendedor',
    description: 'Automatiza operaciones, genera ingresos residuales, escala sin burnout. NodeX + IA NEXUS + Gano Excel para emprendedores.',
    siteName: 'CreaTuActivo.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Del Operador al Arquitecto: Automatiza Tu Negocio',
    description: 'Automatización + Ingresos residuales + Escalabilidad. Solución emprendedores CreaTuActivo.',
    creator: '@creatuactivo',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EmprendedorNegocioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
