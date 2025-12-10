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
 * Página Reto 12 Días con Referido
 * Ruta: /reto-12-dias/[ref]
 * Ejemplo: /reto-12-dias/luiscabrejo-1288
 *
 * Esta página es idéntica a /reto-12-dias pero captura el ref del path
 * para tracking de constructores.
 */

import Reto12DiasPage from '../page'

export default function Reto12DiasWithRefPage() {
  // El componente Reto12DiasPage es un Client Component que maneja
  // todo el contenido. El tracking del ref se hace en el cliente
  // a través de tracking.js que lee el path de la URL.

  return <Reto12DiasPage />
}

// Metadata para SEO
export async function generateMetadata({ params }: { params: { ref: string } }) {
  const siteUrl = 'https://creatuactivo.com'

  return {
    title: 'Reto de los 12 Días | CreaTuActivo',
    description: `Invitado por ${params.ref}. Construye el mejor diciembre de tu vida - 12 días, 12 niveles, una red de 8,190 personas. Challenge de activación rápida.`,
    keywords: 'reto 12 días, challenge gano excel, activación rápida, creatuactivo reto, red de distribución',
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
      url: `${siteUrl}/reto-12-dias/${params.ref}`,
      title: 'Reto de los 12 Días | CreaTuActivo',
      description: `Invitado por ${params.ref}. Construye el mejor diciembre de tu vida - 12 días, 12 niveles, una red de 8,190 personas.`,
      siteName: 'CreaTuActivo.com',
      images: [
        {
          url: `${siteUrl}/reto-12-dias/opengraph-image`,
          width: 1200,
          height: 630,
          alt: 'Reto de los 12 Días - CreaTuActivo.com',
          type: 'image/png',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Reto de los 12 Días | CreaTuActivo',
      description: `Invitado por ${params.ref}. 12 días, 12 niveles, una red de 8,190 personas.`,
      images: [`${siteUrl}/reto-12-dias/opengraph-image`],
      creator: '@creatuactivo',
    },
  }
}
