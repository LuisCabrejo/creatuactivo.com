import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Módulo 01 — Diagnóstico Estructural | CreaTuActivo',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
