import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Módulo 02 — Análisis de Escalabilidad | CreaTuActivo',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
