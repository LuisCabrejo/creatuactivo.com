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
  title: 'Gano Café 3 en 1: Beneficios, Precio y Catálogo Completo 2025 | Gano Excel',
  description: 'Descubre para qué sirve el Gano Café: beneficios del Ganoderma Lucidum, precios oficiales, cómo tomarlo. Catálogo completo Gano Excel con envío a toda Latinoamérica. Café, suplementos, cosméticos con IA conversacional.',

  // Metadatos básicos optimizados para búsquedas de producto
  keywords: ['gano cafe', 'gano cafe 3 en 1', 'para qué sirve el gano café', 'beneficios del gano café', 'gano cafe precio', 'ganoderma cafe', 'gano cafe beneficios y contraindicaciones', 'gano cafe como tomarlo', 'ganoderma lucidum cafe', 'cafe con ganoderma', 'productos gano excel', 'catálogo gano excel colombia'],
  authors: [{ name: 'CreaTuActivo' }],

  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: 'Gano Café 3 en 1: Beneficios, Precio y Catálogo Completo 2025',
    description: '¿Para qué sirve el Gano Café? Descubre beneficios del Ganoderma Lucidum, precios oficiales, cómo tomarlo. Catálogo completo con envío a Latinoamérica. IA conversacional para asesorarte.',
    url: `${siteUrl}/sistema/productos`,
    siteName: 'CreaTuActivo',
    images: [
      {
        url: `${siteUrl}/creatuactivo-redes-productos-card-2400x1260.png`,
        width: 2400,
        height: 1260,
        alt: 'CreaTuActivo - Un Producto Único respaldado por una fórmula exclusiva',
        type: 'image/png',
      }
    ],
    locale: 'es_CO',
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Gano Café 3 en 1: Beneficios, Precio y Catálogo Completo',
    description: '¿Para qué sirve el Gano Café? Beneficios del Ganoderma, precios, cómo tomarlo. Catálogo + IA conversacional.',
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
  // Schema.org JSON-LD para Product y FAQPage
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Gano Café 3 en 1",
    "description": "Café premium enriquecido con extracto 100% hidrosoluble de Ganoderma Lucidum (Reishi). Mezcla perfecta de café, crema y azúcar con beneficios para el sistema inmunológico, energía y concentración.",
    "brand": {
      "@type": "Brand",
      "name": "Gano Excel"
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/sistema/productos`,
      "priceCurrency": "COP",
      "price": "110900",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "CreaTuActivo.com"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "image": `${siteUrl}/productos/bebidas/ganocafe-3-en-1-gano-excel-min.png`,
    "sku": "GANOCAFE-3EN1-20",
    "mpn": "SD2012-0002589"
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Para qué sirve el Gano Café?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "El Gano Café es un café enriquecido con Ganoderma Lucidum (Reishi), un hongo medicinal con más de 2,000 años de uso en la medicina tradicional china. Sirve para: aumentar energía natural sin efectos nerviosos, fortalecer el sistema inmunológico gracias a los betaglucanos, reducir estrés y fatiga con propiedades adaptógenas, mejorar concentración combinando cafeína natural y nutrientes del hongo, y apoyar la digestión con más de 200 fitonutrientes bioactivos."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuáles son los beneficios del Gano Café 3 en 1?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "El Gano Café 3 en 1 de Gano Excel ofrece beneficios respaldados por el extracto 100% hidrosoluble de Ganoderma Lucidum con una fórmula exclusiva: fortalece el sistema inmunológico con betaglucanos, aporta energía sostenida sin nerviosismo, reduce el estrés como adaptógeno natural que equilibra cortisol, y mejora la concentración y claridad mental. Tiene Registro INVIMA SD2012-0002589 y está respaldado por 30+ años de investigación científica."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuál es el precio del Gano Café en Colombia 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Los precios oficiales de Gano Excel en Colombia para 2025 son: Gano Café 3 en 1 (caja con 20 sobres x 21g): $110.900 COP. Gano Café Clásico Negro (caja con 30 sobres x 4.5g): $110.900 COP. Como Fundador CreaTuActivo, accedes a precios mayoristas con descuento de hasta 35% sobre precio público. Envío gratis a toda Colombia en compras superiores a $150.000 COP."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cómo se toma el Gano Café 3 en 1?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Para preparar el Gano Café 3 en 1 correctamente: 1) Vierte 1 sobre (21g) en tu taza favorita, 2) Agrega 150ml de agua caliente (no hirviendo, aprox. 80-85°C), 3) Revuelve bien hasta disolver completamente, 4) Disfruta inmediatamente para aprovechar todos los nutrientes. Mejor momento: por la mañana o media tarde. Frecuencia ideal: 1-2 tazas al día. Puede tomarse frío con agua fría y hielo en verano."
        }
      },
      {
        "@type": "Question",
        "name": "¿El Gano Café está disponible en toda Latinoamérica?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, Gano Excel distribuye sus productos, incluyendo el Gano Café, en más de 15 países de Latinoamérica: Colombia, México, Perú, Ecuador, Chile, Argentina, Guatemala, Honduras, El Salvador, Costa Rica, Panamá, Venezuela y Bolivia. Nuestro asistente NEXUS IA conversacional puede ayudarte a encontrar distribuidores en tu país, calcular envíos internacionales y recomendar productos ideales para tu perfil."
        }
      }
    ]
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CreaTuActivo.com",
    "alternateName": "CreaTuActivo",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Plataforma de emprendimiento digital que combina productos premium Gano Excel con la aplicación CreaTuActivo y asesoría IA conversacional (NEXUS) para construir activos empresariales escalables.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Sales",
      "availableLanguage": ["Spanish"]
    }
  }

  return (
    <>
      {/* Schema.org JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {children}
    </>
  )
}
