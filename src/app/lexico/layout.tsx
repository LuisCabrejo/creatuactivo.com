import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Taller de Voz · CreaTuActivo',
  description: 'Práctica diaria de pronunciación — uso interno.',
  robots: { index: false, follow: false },
}

export default function LexicoLayout({ children }: { children: React.ReactNode }) {
  return children
}
