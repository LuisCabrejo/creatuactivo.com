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
 * Página de Fundadores con Referido
 * Ruta: /fundadores/[ref]
 * Ejemplo: /fundadores/luiscabrejo-1288
 *
 * Esta página es idéntica a /fundadores pero captura el ref del path
 * para tracking de constructores.
 */

import FundadoresPage from '../page'

export default function FundadoresWithRefPage() {
  // El componente FundadoresPage es un Client Component que maneja
  // todo el contenido. El tracking del ref se hace en el cliente
  // a través de tracking.js que lee el path de la URL.

  return <FundadoresPage />
}

// Metadata para SEO
export async function generateMetadata({ params }: { params: { ref: string } }) {
  const siteUrl = 'https://creatuactivo.com'

  return {
    title: '150 Espacios Fundadores Gano Excel 2025 | Afiliación Mentor CreaTuActivo',
    description: `Invitado por ${params.ref}. Afiliación especial Gano Excel Colombia como FUNDADOR. Mentorías 1:150, aplicación CreaTuActivo + IA NEXUS, ingresos residuales. Solo 150 cupos hasta 30 Nov 2025.`,
    keywords: 'afiliación gano excel, fundadores gano excel 2025, mentor gano excel, afiliarse gano excel colombia, lista privada fundadores, mentorías 1 a 150, creatuactivo fundadores',
    authors: [{ name: 'CreaTuActivo.com' }],
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: `${siteUrl}/fundadores/${params.ref}`,
      title: '150 Espacios Fundadores Gano Excel 2025 | Afiliación Mentor CreaTuActivo',
      description: `Invitado por ${params.ref}. Afiliación especial Gano Excel Colombia como FUNDADOR. Mentorías 1:150, aplicación CreaTuActivo + IA NEXUS, ingresos residuales. Solo 150 cupos hasta 30 Nov 2025.`,
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
      description: `Invitado por ${params.ref}. Mentoría 1:150, NodeX + IA, ingresos residuales. 150 cupos hasta 30 Nov.`,
      images: [`${siteUrl}/fundadores/opengraph-image`],
      creator: '@creatuactivo',
    },
  }
}
