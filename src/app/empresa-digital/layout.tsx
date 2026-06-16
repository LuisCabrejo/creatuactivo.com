/**
 * Copyright © 2026 CreaTuActivo.com
 * Layout para El Diagnóstico de 5 Días — noindex (Squeeze Page)
 * v1.0 — registro accesible
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'El Diagnóstico de 5 Días | CreaTuActivo',
  description: 'Cinco días para ver, con números claros, cómo construir una empresa digital que produce ingresos aunque usted no esté. Acceso restringido.',
  robots: { index: false, follow: true }, // Squeeze page — no SEO
};

export default function AuditoriaPatrimonialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
