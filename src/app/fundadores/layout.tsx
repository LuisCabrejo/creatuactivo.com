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
  title: '150 Espacios Fundadores Gano Excel 2025 | Afiliación Mentor CreaTuActivo',
  description: 'Afiliación especial Gano Excel Colombia como FUNDADOR. Mentorías 1:150, tecnología NodeX + IA, ingresos residuales. Solo 150 cupos del 10 Nov al 30 Nov 2025. Lista privada exclusiva.',
  keywords: 'afiliación gano excel, fundadores gano excel 2025, mentor gano excel, afiliarse gano excel colombia, lista privada fundadores, mentorías 1 a 150, creatuactivo fundadores',
  authors: [{ name: 'CreaTuActivo.com' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: `${siteUrl}/fundadores`,
    title: '150 Espacios Fundadores Gano Excel 2025 | Afiliación Mentor CreaTuActivo',
    description: 'Afiliación especial Gano Excel Colombia como FUNDADOR. Mentorías 1:150, tecnología NodeX + IA, ingresos residuales. Solo 150 cupos hasta 30 Nov 2025.',
    siteName: 'CreaTuActivo.com',
    images: [
      {
        url: `${siteUrl}/fundadores/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Lista Privada Fundadores - CreaTuActivo.com',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '150 Espacios Fundadores Gano Excel 2025 | Afiliación Mentor',
    description: 'Afiliación Gano Excel como FUNDADOR. Mentoría 1:150, NodeX + IA, ingresos residuales. 150 cupos hasta 30 Nov.',
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
