/**
 * Copyright © 2026 CreaTuActivo.com
 * Layout para El Mapa de Salida - noindex (Squeeze Page para ADS)
 * v3.0 — Pivote semántico: "Reto de 5 Días" → "El Mapa de Salida"
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'El Mapa de Salida — 5 Fases para Escapar del Plan por Defecto | CreaTuActivo',
  description: 'Una auditoría de 5 días para planear tu escape del ciclo trabajar-pagar-repetir. Planos arquitectónicos de soberanía financiera. Completamente gratis.',
  robots: { index: false, follow: true }, // Squeeze page para ADS, no SEO
};

export default function MapaDeSalidaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
