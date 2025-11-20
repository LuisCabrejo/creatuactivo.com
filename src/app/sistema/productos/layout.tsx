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

// URL base del sitio - AJUSTA ESTO A TU DOMINIO REAL
const siteUrl = 'https://creatuactivo.com'

export const metadata: Metadata = {
  title: 'Catálogo Productos Gano Excel Colombia 2025 | Ganoderma 100% Hidrosoluble',
  description: 'Catálogo oficial Gano Excel Colombia con patente mundial extracto 100% hidrosoluble Ganoderma Lucidum. Café, té, suplementos, cosméticos. 30+ años ciencia, distribución nacional.',

  // Metadatos básicos
  keywords: ['catálogo gano excel', 'productos gano excel colombia', 'ganoderma lucidum', 'café gano excel', 'extracto hidrosoluble ganoderma', 'patente mundial ganoderma', 'suplementos gano excel'],
  authors: [{ name: 'CreaTuActivo' }],

  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: 'Catálogo Productos Gano Excel Colombia 2025 | Ganoderma Hidrosoluble',
    description: 'Catálogo oficial Gano Excel Colombia con patente mundial extracto 100% hidrosoluble Ganoderma. Café, té, suplementos, cosméticos.',
    url: `${siteUrl}/sistema/productos`,
    siteName: 'CreaTuActivo',
    images: [
      {
        url: `${siteUrl}/creatuactivo-redes-productos-card-2400x1260.png`,
        width: 2400,
        height: 1260,
        alt: 'CreaTuActivo - Un Producto Único respaldado por patente mundial',
        type: 'image/png',
      }
    ],
    locale: 'es_CO',
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Catálogo Productos Gano Excel Colombia | Ganoderma Hidrosoluble',
    description: 'Catálogo oficial Gano Excel Colombia. Patente mundial extracto 100% hidrosoluble Ganoderma. Café, té, suplementos.',
    images: [`${siteUrl}/creatuactivo-redes-productos-card-2400x1260.png`],
    creator: '@creatuactivo',
  },

  // Metadatos adicionales
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

  // Verificación
  verification: {
    // google: 'tu-codigo-de-verificacion-aqui', // Opcional
  },
}

export default function ProductosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
