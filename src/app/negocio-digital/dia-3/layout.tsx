import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Módulo 03 — Acoplamiento Híbrido | CreaTuActivo',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
