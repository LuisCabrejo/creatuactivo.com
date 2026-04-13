/**
 * Copyright © 2026 CreaTuActivo.com
 * Auditoría Patrimonial con constructorId en path
 * Ruta: /auditoria-patrimonial/[constructorId]
 *
 * Re-exporta la squeeze page principal. El tracking del constructorId
 * se realiza en el cliente leyendo el path de la URL (useEffect en page.tsx).
 */

import AuditoriaPatrimonialPage from '../page';

export default function AuditoriaPatrimonialWithConstructorPage() {
  return <AuditoriaPatrimonialPage />;
}

export async function generateMetadata({ params }: { params: { constructorId: string } }) {
  return {
    title: 'Auditoría de Arquitectura Patrimonial | CreaTuActivo',
    description: `Corrección técnica del déficit estructural de ingresos. Compartido por ${params.constructorId}.`,
    robots: { index: false, follow: true },
  };
}
