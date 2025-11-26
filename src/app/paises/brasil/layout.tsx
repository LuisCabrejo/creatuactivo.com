/**
 * Copyright © 2025 CreaTuActivo.com
 * Layout específico para Brasil con Metadatos OpenGraph
 */

import type { Metadata } from 'next'

// Asegúrate que esta URL sea la correcta de producción
const siteUrl = 'https://creatuactivo.com'

export const metadata: Metadata = {
  title: 'Gano Excel Brasil: El Gigante ha Despertado | CreaTuActivo',
  description: 'Lanzamiento Oficial Gano Excel Brasil 2025. La economía más grande de LATAM abre sus puertas. Infraestructura física lista, tecnología digital en tus manos.',
  keywords: 'gano excel brasil, apertura brasil, gano itouch brasil, red de mercadeo brasil, ganoderma trufado, creatuactivo brasil',
  authors: [{ name: 'CreaTuActivo.com' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES', // Opcional: Podrías detectar o poner pt_BR si prefieres
    url: `${siteUrl}/paises/brasil`,
    title: 'Gano Excel Brasil: El Gigante ha Despertado | CreaTuActivo',
    description: 'Lanzamiento Oficial 2025. La oportunidad de la década. Conecta con el mercado más grande de América Latina usando tecnología.',
    siteName: 'CreaTuActivo.com',
    images: [
      {
        url: `${siteUrl}/paises/brasil/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Lanzamiento Gano Excel Brasil - CreaTuActivo',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gano Excel Brasil: El Gigante ha Despertado',
    description: 'Infraestructura física lista en São Paulo. Infraestructura digital en tus manos.',
    images: [`${siteUrl}/paises/brasil/opengraph-image`],
    creator: '@creatuactivo',
  },
}

export default function BrasilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
