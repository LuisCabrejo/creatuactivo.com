/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 */

import type { Metadata } from 'next';

const TITLE = 'Auditoría de Soberanía Financiera | CreaTuActivo';
const DESCRIPTION = 'Descubra si su estructura financiera está construida sobre bases sólidas o si depende del Plan por Defecto.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: {
    index: false,
    follow: false,
  },
  // og:url debe apuntar a /diagnostico (no a la raíz) — si no, Meta usa el
  // og:url heredado del root (= dominio raíz) y la publicación lleva a la
  // mini-landing en vez de a esta página. metadataBase (root) resuelve el path.
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/diagnostico',
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'CreaTuActivo.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function DiagnosticoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
