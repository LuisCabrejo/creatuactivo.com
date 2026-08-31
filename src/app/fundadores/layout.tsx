/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

import type { Metadata } from 'next'

const siteUrl = 'https://creatuactivo.com'

export const metadata: Metadata = {
  title: 'Fundadores | CreaTuActivo',
  description: 'Un núcleo de 15 socios estratégicos para la fase de cimentación de CreaTuActivo. No es orden de llegada: es una conversación.',
    authors: [{ name: 'CreaTuActivo.com' }],
  // Página de registro por invitación 1-a-1 — no se posiciona en buscadores (decisión 14 ago 2026)
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: `${siteUrl}/fundadores`,
    title: 'Fundadores | CreaTuActivo',
    description: 'Un núcleo de 15 socios estratégicos para la fase de cimentación. No es orden de llegada: es una conversación.',
    siteName: 'CreaTuActivo.com',
    images: [
      {
        url: `${siteUrl}/fundadores/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Fundadores - CreaTuActivo.com',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fundadores | CreaTuActivo',
    description: 'Un núcleo de 15 socios estratégicos. No es orden de llegada: es una conversación.',
    images: [`${siteUrl}/fundadores/opengraph-image`],
    creator: '@creatuactivo',
  },
}

export default function FundadoresLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
