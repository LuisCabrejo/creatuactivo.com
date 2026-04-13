/**
 * Copyright © 2026 CreaTuActivo.com
 * Módulo 02 con ref de distribuidor
 * Ruta: /auditoria-patrimonial/dia-2/[ref]
 */

import Modulo02Page from '../page';

export default function Modulo02WithRefPage() {
  return <Modulo02Page />;
}

export async function generateMetadata({ params }: { params: { ref: string } }) {
  return {
    title: 'Módulo 02: El Techo Técnico | CreaTuActivo',
    description: `Análisis del límite matemático del modelo operativo manual. Compartido por ${params.ref}.`,
    robots: { index: false, follow: false },
  };
}
