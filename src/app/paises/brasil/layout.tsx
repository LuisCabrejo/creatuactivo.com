/**
 * Copyright © 2025 CreaTuActivo.com
 * Layout SEO Optimizado: Gano Excel Brasil
 * Misión: Posicionamiento en Google Brasil + Indexación Correcta
 */

import type { Metadata } from 'next'

const siteUrl = 'https://creatuactivo.com'

export const metadata: Metadata = {
  // TÍTULO: Optimizada para CTR (Clics) en búsquedas
  title: 'Gano Excel Brasil: O Gigante Acordou | Lançamento Oficial 2025',

  // DESCRIPCIÓN: El "Pitch" en Google. Atrae empresarios, filtra curiosos.
  description: 'A maior economia da América Latina abre as portas. Infraestrutura física em São Paulo pronta. Infraestrutura digital em suas mãos. Descubra o Café Trufado Premium.',

  // KEYWORDS: Estrategia híbrida ES/PT para capturar ambos mercados
  keywords: [
    // Mercado Local (Prioridad)
    'gano excel brasil',
    'gano itouch brasil',
    'café trufado',
    'oportunidade de negocio brasil',
    'renda extra premium',
    'lançamento gano excel',
    // Mercado Expansión
    'apertura brasil',
    'red de mercadeo brasil',
    'ganoderma trufado',
    'creatuactivo brasil'
  ].join(', '),

  authors: [{ name: 'CreaTuActivo.com' }],

  // ROBOTS: Instrucción explícita para que Google indexe esta página
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // OPEN GRAPH: Para que se vea perfecto en WhatsApp/Facebook
  openGraph: {
    type: 'website',
    locale: 'pt_BR', // Forzamos la localización de Brasil para redes sociales
    alternateLocale: 'es_ES',
    url: `${siteUrl}/paises/brasil`,
    title: '🇧🇷 Brasil: El Gigante ha Despertado | Gano Excel Oficial',
    description: 'Infraestrutura física pronta em São Paulo. Tecnologia digital pronta para você. O momento de fazer história é agora.',
    siteName: 'CreaTuActivo.com',
    images: [
      {
        url: `${siteUrl}/paises/brasil/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Lançamento Oficial Gano Excel Brasil - Oportunidade Fundadores',
        type: 'image/png',
      }
    ],
  },

  // ALTERNATES: Vital para evitar contenido duplicado
  alternates: {
    canonical: `${siteUrl}/paises/brasil`,
  },
}

export default function BrasilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
