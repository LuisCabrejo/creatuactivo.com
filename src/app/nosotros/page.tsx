/**
 * Copyright © 2026 CreaTuActivo.com
 * /nosotros — versión orgánica (menú) del Documento Fundacional.
 * El cuerpo vive en <ManifiestoDocument/> (compartido con /{slug}/manifiesto,
 * la versión del Arquitecto con atribución).
 */

import StrategicNavigation from '@/components/StrategicNavigation';
import ManifiestoDocument from '@/components/ManifiestoDocument';

export const metadata = {
  title: 'Manifiesto - La Búsqueda de la Soberanía | CreaTuActivo',
  description: 'De una promesa personal a la ingeniería de activos. La historia, el principio y la doctrina detrás de CreaTuActivo — y de quién se requiere para construirlo.',
  robots: { index: false, follow: true },
};

export default function NosotrosPage() {
  return (
    <>
      <StrategicNavigation />
      <ManifiestoDocument />
    </>
  );
}
