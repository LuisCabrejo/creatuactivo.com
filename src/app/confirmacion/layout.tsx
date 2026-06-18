/**
 * Copyright © 2026 CreaTuActivo.com
 * Layout para Auditoría Confirmada — Bridge Page v1.0 (noindex)
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Auditoría Confirmada | CreaTuActivo',
  description: 'Su solicitud de auditoría técnica ha sido procesada. El despliegue iniciará en menos de 24 horas.',
  robots: { index: false, follow: false },
};

export default function AuditoriaConfirmadaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
