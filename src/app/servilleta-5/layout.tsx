import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servilleta Industrial v5.0 | The Industrial Deck',
  description: 'Presentación interactiva de 4 fases: Infraestructura, Mecánica, Bio-Metría y Simulación.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Servilleta5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
