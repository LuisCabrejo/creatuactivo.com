/**
 * Copyright © 2025 CreaTuActivo.com
 * Layout para Reto 5 Días - noindex (Squeeze Page para ADS)
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reto 5 Días - Construye Tu Primer Activo | CreaTuActivo',
  description: 'En 5 días te muestro cómo construir un activo que genere sin tu presencia constante. Gratis por WhatsApp.',
  robots: { index: false, follow: true }, // Squeeze page para ADS, no SEO
};

export default function Reto5DiasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
