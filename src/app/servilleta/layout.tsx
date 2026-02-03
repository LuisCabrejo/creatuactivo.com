/**
 * Copyright © 2026 CreaTuActivo.com
 * Layout SEO - Plan Servilleta Digital
 */

import { Metadata } from 'next';

// SEO Metadata optimizado para búsquedas de "Plan Servilleta Gano Excel"
export const metadata: Metadata = {
  title: 'Plan Servilleta Digital 2026 | Calculadora de Compensación Gano Excel',
  description: 'Plan Servilleta interactivo oficial para Gano Excel 2026. Calcula tu proyección de ingresos con el sistema binario y Gen5. Simulador del plan de compensación con proyección en tiempo real.',

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
    description: 'Simula tu proyección de ingresos con el Plan Servilleta oficial de Gano Excel. Sistema interactivo con cálculo en tiempo real.',
    type: 'website',
    locale: 'es_CO',
    siteName: 'CreaTuActivo',
    images: [
      {
        url: '/favicon.png',
        width: 1200,
        height: 1200,
        alt: 'Plan Servilleta CreaTuActivo - Calculadora Gano Excel',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Plan Servilleta Digital 2026',
    description: 'Calculadora interactiva del plan de compensación Gano Excel',
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

