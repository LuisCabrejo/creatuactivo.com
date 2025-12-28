/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diagnóstico de Arquitectura Financiera | CreaTuActivo',
  description: 'Descubre si tu estrategia financiera está construida sobre bases sólidas o si estás atrapado en el Plan por Defecto.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DiagnosticoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
