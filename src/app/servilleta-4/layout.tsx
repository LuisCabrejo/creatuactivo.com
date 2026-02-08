import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servilleta Industrial v4.0 | Bento Grid + Copywriting',
  description: 'Prototipo Bento Grid Industrial con narrativa técnica y animaciones de secuencia de encendido.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Servilleta4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
