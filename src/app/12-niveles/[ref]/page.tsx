/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

/**
 * Página Los 12 Niveles con Referido
 * Ruta: /12-niveles/[ref]
 * Ejemplo: /12-niveles/luiscabrejo-1288
 *
 * Esta página es idéntica a /12-niveles pero captura el ref del path
 * para tracking de constructores.
 */

import Reto12NivelesPage from '../page'

export default function Reto12NivelesWithRefPage() {
  // El componente Reto12NivelesPage es un Client Component que maneja
  // todo el contenido. El tracking del ref se hace en el cliente
  // a través de tracking.js que lee el path de la URL.

  return <Reto12NivelesPage />
}

// Metadata para SEO
export async function generateMetadata({ params }: { params: { ref: string } }) {
  const siteUrl = 'https://creatuactivo.com'

  return {
    title: 'Los 12 Niveles | CreaTuActivo',
    description: `Invitado por ${params.ref}. El método de duplicación 2×2: 12 niveles para construir su organización de distribución con CreaTuActivo.`,
    keywords: '12 niveles, duplicación 2x2, creatuactivo, organización de distribución, ingreso recurrente',
    authors: [{ name: 'CreaTuActivo.com' }],
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: `${siteUrl}/12-niveles/${params.ref}`,
      title: 'Los 12 Niveles | CreaTuActivo',
      description: `Invitado por ${params.ref}. El método de duplicación 2×2: 12 niveles, una organización de 8,190 personas.`,
      siteName: 'CreaTuActivo.com',
      images: [
        {
          url: `${siteUrl}/12-niveles/opengraph-image`,
          width: 1200,
          height: 630,
          alt: 'Los 12 Niveles - CreaTuActivo.com',
          type: 'image/png',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Los 12 Niveles | CreaTuActivo',
      description: `Invitado por ${params.ref}. 12 niveles, una organización de 8,190 personas.`,
      images: [`${siteUrl}/12-niveles/opengraph-image`],
      creator: '@creatuactivo',
    },
  }
}
