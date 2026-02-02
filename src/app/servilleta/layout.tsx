import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servilleta Digital | CreaTuActivo',
  description: 'Presentación interactiva del modelo de Infraestructura de Apalancamiento',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ServilletaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
