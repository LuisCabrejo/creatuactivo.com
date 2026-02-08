import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servilleta Industrial v3.0 | Bento Grid',
  description: 'Prototipo Bento Grid Industrial - Dashboard SCADA con imágenes reales.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Servilleta3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
