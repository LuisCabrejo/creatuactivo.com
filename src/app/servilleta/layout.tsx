/**
 * Copyright © 2026 CreaTuActivo.com
 * Layout SEO - Plan Servilleta Digital
 */

import { Metadata } from 'next';

const URL_PAGINA = 'https://creatuactivo.com/servilleta';
const TITULO = 'Plan servilleta Gano Excel: presentación 2026';
const DESCRIPCION =
  'La presentación del plan servilleta de Gano Excel en una página, con un simulador del plan de compensación. Por CreaTuActivo, distribuidores independientes.';

// Datos estructurados propios de la página (8 oct 2026). Gano Excel va en `about`
// —de qué trata la página—, nunca como autor ni editor: la publica CreaTuActivo.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${URL_PAGINA}#webpage`,
      url: URL_PAGINA,
      name: TITULO,
      description: DESCRIPCION,
      inLanguage: 'es',
      dateModified: '2026-10-08',
      publisher: { '@id': 'https://creatuactivo.com/#organization' },
      about: { '@type': 'Organization', name: 'Gano Excel' },
      breadcrumb: { '@id': `${URL_PAGINA}#breadcrumb` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${URL_PAGINA}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://creatuactivo.com' },
        { '@type': 'ListItem', position: 2, name: 'Plan servilleta', item: URL_PAGINA },
      ],
    },
  ],
};

// SEO Metadata optimizado para búsquedas de "Plan Servilleta Gano Excel"
export const metadata: Metadata = {
  // 8 oct 2026 (Director): «presentación» es la palabra de las búsquedas donde no
  // aparecíamos, y el año se conserva porque el autocompletado lo sugiere — a
  // cambio, el cuerpo dice cuándo se actualizó (GuiaPlanServilleta.tsx) y se revisa
  // de verdad en diciembre. 60 caracteres con el « | CreaTuActivo» de la plantilla.
  title: TITULO,
  // 8 oct 2026 (Director): sin «oficial» —un distribuidor no se presenta como la
  // página de la marca, mismo criterio que retiró /paises/brasil— y sin «proyección
  // de ingresos», que Google ya citaba en su respuesta de IA («para calcular
  // proyecciones»). Investigación: reports/Plan servilleta top 3 Google.md
  description: DESCRIPCION,

  keywords: [
    'plan servilleta',
    'plan servilleta gano excel',
    'plan servilleta gano excel 2026',
    'calculadora plan de compensacion',
    'plan compensacion gano excel',
    'binario gano excel',
    'gen5 gano excel',
    'presentacion servilleta',
    'servilleta digital',
    'simulador ingresos gano excel',
    'plan de compensacion interactivo',
    'gano excel colombia',
  ],

  // 🎯 CRÍTICO: Indexar para SEO (búsquedas de "plan servilleta")
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  // OpenGraph para WhatsApp/redes sociales
  openGraph: {
    title: TITULO,
    url: URL_PAGINA,
    description: 'La presentación del plan servilleta de Gano Excel, con un simulador del plan de compensación. Por CreaTuActivo, distribuidores independientes.',
    type: 'website',
    locale: 'es_CO',
    siteName: 'CreaTuActivo',
    images: [
      {
        url: '/favicon-cta.png?v=6',
        width: 1200,
        height: 1200,
        alt: 'Plan Servilleta CreaTuActivo - Calculadora Gano Excel',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: TITULO,
    description: 'La presentación del plan servilleta de Gano Excel, por CreaTuActivo, distribuidores independientes.',
  },

  alternates: {
    canonical: '/servilleta',
  },
};

export default function ServilletaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}

