import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Módulo 05 — Protocolo de Activación | CreaTuActivo',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
