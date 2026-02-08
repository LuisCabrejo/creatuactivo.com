/**
 * SERVILLETA v2.0 - Industrial Realism Layout
 * Copyright © 2026 CreaTuActivo.com
 *
 * Página de prueba con enfoque de Realismo Industrial
 * noindex para evitar duplicados con /servilleta
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servilleta Industrial v2.0 | CreaTuActivo',
  description: 'Prototipo de diseño industrial para el Plan Servilleta - Dashboard SCADA con materialidad digital.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Servilleta2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
