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
  title: 'Catálogo de Productos | CreaTuActivo',
  description: 'Descubre el único catálogo con patente mundial de extracto 100% hidrosoluble de Ganoderma Lucidum. Productos únicos respaldados por 30+ años de ciencia.',

  // Metadatos básicos
  keywords: ['Ganoderma', 'productos naturales', 'patente mundial', 'suplementos', 'bienestar', 'extracto hidrosoluble'],
  authors: [{ name: 'CreaTuActivo' }],

  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: 'Catálogo de Productos | CreaTuActivo',
    description: 'Descubre el único catálogo con patente mundial de extracto 100% hidrosoluble de Ganoderma Lucidum.',
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
    title: 'Catálogo de Productos | CreaTuActivo',
    description: 'Descubre el único catálogo con patente mundial de extracto 100% hidrosoluble de Ganoderma Lucidum.',
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
