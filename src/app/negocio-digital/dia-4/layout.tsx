import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Módulo 04 — Matriz de Amortización | CreaTuActivo',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
