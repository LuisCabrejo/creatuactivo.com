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
  title: 'Los 3 Pasos IAA: Iniciar, Acoger, Activar | Sistema Emprendimiento CreaTuActivo',
  description: 'Sistema IAA: 3 pasos para transformar talento en activo escalable. Iniciar (automatización), Acoger (IA NEXUS), Activar (mentoría). Metodología CreaTuActivo + Gano Excel Colombia.',
  keywords: 'framework iaa, iniciar acoger activar, sistema emprendimiento digital, metodología creatuactivo, 3 pasos emprendimiento, automatización negocio, ia para emprendedores',
  authors: [{ name: 'CreaTuActivo.com' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://creatuactivo.com/sistema/framework-iaa',
    title: 'Los 3 Pasos IAA: Iniciar, Acoger, Activar | Sistema Emprendimiento',
    description: 'Sistema IAA: Iniciar (automatización), Acoger (IA NEXUS), Activar (mentoría). 3 pasos para transformar talento en activo escalable.',
    siteName: 'CreaTuActivo.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Los 3 Pasos IAA: Iniciar, Acoger, Activar | CreaTuActivo',
    description: 'Sistema IAA: Automatización + IA + Mentoría. 3 pasos para transformar talento en activo escalable.',
    creator: '@creatuactivo',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FrameworkIAALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
