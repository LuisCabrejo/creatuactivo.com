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
import { productData, LINEAS, PREGUNTAS, imagenVitrina } from './catalogo-datos'

// URL base del sitio - AJUSTA ESTO A TU DOMINIO REAL
const siteUrl = 'https://creatuactivo.com'

export const metadata: Metadata = {
  title: 'Catálogo Gano Excel 2026: café, bebidas y suplementos con Ganoderma',
  description: 'Los 22 productos de Gano Excel con su precio en pesos: café, bebidas, suplementos y cuidado personal. Queswa le ayuda a elegir y el pedido se hace por WhatsApp.',

  // Metadatos básicos optimizados para búsquedas de producto
  keywords: ['gano cafe', 'gano cafe 3 en 1', 'para qué sirve el gano café', 'gano cafe precio', 'ganoderma cafe', 'gano cafe como tomarlo', 'ganoderma lucidum cafe', 'cafe con ganoderma', 'productos gano excel', 'catálogo gano excel colombia'],
  authors: [{ name: 'CreaTuActivo' }],

  // Open Graph (Facebook, WhatsApp, LinkedIn)
  alternates: { canonical: `${siteUrl}/productos` },
  openGraph: {
    title: 'Catálogo Gano Excel 2026: café, bebidas y suplementos con Ganoderma',
    description: 'Los 22 productos de Gano Excel con su precio en pesos: café, bebidas, suplementos y cuidado personal. Queswa le ayuda a elegir y el pedido se hace por WhatsApp.',
    url: `${siteUrl}/productos`,
    siteName: 'CreaTuActivo',
    // Imagen OG: la genera el archivo colocado src/app/productos/opengraph-image.tsx
    // (convención file-based de Next.js, 1200×630). No declarar images aquí para no sobrescribirlo.
    locale: 'es_CO',
    type: 'website',
  },

  // Twitter Card — usa la misma opengraph-image.tsx colocada
  twitter: {
    card: 'summary_large_image',
    title: 'Catálogo Gano Excel 2026: café, bebidas y suplementos con Ganoderma',
    description: 'Los 22 productos de Gano Excel con su precio en pesos: café, bebidas, suplementos y cuidado personal. Queswa le ayuda a elegir y el pedido se hace por WhatsApp.',
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
    // google: 'su-codigo-de-verificacion-aqui', // Opcional
  },
}

/**
 * Datos estructurados del catálogo (17 oct 2026).
 *
 * Antes: un solo Product (el 3 en 1) con «beneficios para el sistema inmunológico,
 * energía y concentración», un FAQPage con «hongo medicinal», «fortalecer el sistema
 * inmunológico», «reducir estrés», «35% de descuento» y un «envío gratis desde
 * $150.000» que no existe, y una Organization descrita con léxico retirado. Era lo
 * que Google leía de esta página aunque el texto visible ya se hubiera limpiado.
 *
 * Ahora: la lista de los 22 productos con su precio (ItemList de Product/Offer) y
 * las mismas preguntas que se ven en la página (PREGUNTAS de catalogo-datos.ts).
 */
export default function ProductosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const listaSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catálogo Gano Excel',
    // Sin las promociones de Gano: son temporales y no van en los datos para buscadores.
    itemListElement: LINEAS.flatMap((l) => l.ids).filter((id) => !productData[id].promocion).map((id, i) => {
      const p = productData[id]
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: p.name,
          description: p.shortDescription,
          image: `${siteUrl}${imagenVitrina(id)}`,
          brand: { '@type': 'Brand', name: 'Gano Excel' },
          offers: {
            '@type': 'Offer',
            url: `${siteUrl}/productos`,
            priceCurrency: 'COP',
            price: String(p.price),
            availability: 'https://schema.org/InStock',
          },
        },
      }
    }),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PREGUNTAS.map((q) => ({
      '@type': 'Question',
      name: q.p,
      acceptedAnswer: { '@type': 'Answer', text: q.r },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listaSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  )
}
