/**
 * Copyright © 2026 CreaTuActivo.com
 * Layout SEO - Plan Servilleta Digital
 */

import { Metadata } from 'next';

// SEO Metadata optimizado para búsquedas de "Plan Servilleta Gano Excel"
export const metadata: Metadata = {
  title: 'Plan Servilleta Digital 2026 | Calculadora de Compensación Gano Excel',
  // 8 oct 2026 (Director): sin «oficial» —un distribuidor no se presenta como la
  // página de la marca, mismo criterio que retiró /paises/brasil— y sin «proyección
  // de ingresos», que Google ya citaba en su respuesta de IA («para calcular
  // proyecciones»). Investigación: reports/Plan servilleta top 3 Google.md
  description: 'La presentación del plan servilleta de Gano Excel en una página, con un simulador del plan de compensación. Por CreaTuActivo, distribuidores independientes.',

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
    title: 'Plan Servilleta Digital 2026 | CreaTuActivo',
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
    title: 'Plan Servilleta Digital 2026',
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
  return children;
}

