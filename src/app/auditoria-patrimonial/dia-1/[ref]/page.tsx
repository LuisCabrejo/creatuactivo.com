/**
 * Copyright © 2026 CreaTuActivo.com
 * Módulo 01 con ref de distribuidor
 * Ruta: /auditoria-patrimonial/dia-1/[ref]
 * Re-exporta la página principal; el tracking del ref
 * se realiza vía tracking.js leyendo el path de la URL.
 */

import Modulo01Page from '../page';

export default function Modulo01WithRefPage() {
  return <Modulo01Page />;
}

export async function generateMetadata({ params }: { params: { ref: string } }) {
  return {
    title: 'Módulo 01: Diagnóstico Estructural | CreaTuActivo',
    description: `Auditoría de la falla matemática en su vehículo de ingresos actual. Compartido por ${params.ref}.`,
    robots: { index: false, follow: false },
  };
}
