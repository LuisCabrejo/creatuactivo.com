import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Soberanía | CreaTuActivo',
  description: 'Herramienta de diagnóstico estructural y proyección de Arquitectura de Apalancamiento. Acceso restringido.',
  robots: {
    index: false,
    follow: false,
  },
  // OpenGraph para que se vea profesional al compartir en WhatsApp/iMessage
  openGraph: {
    title: 'Soberanía | CreaTuActivo',
    description: 'Diagnóstico de falla estructural y actualización de sistema financiero.',
    type: 'website',
  }
};

export default function ServilletaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
