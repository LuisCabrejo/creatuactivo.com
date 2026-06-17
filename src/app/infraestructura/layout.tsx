/**
 * Copyright © 2025 CreaTuActivo.com
 * Layout para /infraestructura
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Infraestructura Global | CreaTuActivo',
  description: 'El respaldo operativo de su negocio digital: producción y distribución de productos en más de 70 países desde 1995.',
  robots: { index: true, follow: true },
};

export default function InfraestructuraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
