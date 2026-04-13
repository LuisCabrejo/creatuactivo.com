/**
 * Copyright © 2026 CreaTuActivo.com
 * Módulo 05 con ref de distribuidor
 * Ruta: /auditoria-patrimonial/dia-5/[ref]
 */

import Modulo05Page from '../page';

export default function Modulo05WithRefPage() {
  return <Modulo05Page />;
}

export async function generateMetadata({ params }: { params: { ref: string } }) {
  return {
    title: 'Módulo 05: Protocolo de Activación | CreaTuActivo',
    description: `Decisión Directiva: los tres niveles exactos de asignación de activos para encender su Unidad Operativa. Compartido por ${params.ref}.`,
    robots: { index: false, follow: false },
  };
}
