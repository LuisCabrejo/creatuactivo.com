/**
 * Copyright © 2026 CreaTuActivo.com
 * Layout para Auditoría de Arquitectura Patrimonial — noindex (Squeeze Page)
 * v1.0 — Lujo Clínico: Due Diligence framing
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Auditoría de Arquitectura Patrimonial | CreaTuActivo',
  description: 'Un escrutinio logístico de 5 días para desvincular definitivamente su flujo de caja de su desgaste biológico. Acceso restringido.',
  robots: { index: false, follow: true }, // Squeeze page — no SEO
};

export default function AuditoriaPatrimonialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
