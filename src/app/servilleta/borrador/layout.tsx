/**
 * Copyright © 2026 CreaTuActivo.com
 * Layout del BORRADOR de la presentación (/servilleta/borrador, 28 oct 2026).
 * Fuera de Google a propósito: es una copia de trabajo, no la presentación. Se
 * borra junto con page.tsx cuando el Director decida (ver su cabecera).
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Presentación (borrador)',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://creatuactivo.com/servilleta' },
};

export default function BorradorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
