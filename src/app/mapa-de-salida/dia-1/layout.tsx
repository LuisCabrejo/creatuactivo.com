import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coordenada 1 — Mapa de Salida',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
