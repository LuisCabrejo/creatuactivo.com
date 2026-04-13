/**
 * Copyright © 2026 CreaTuActivo.com
 * Módulo 03 con ref de distribuidor
 * Ruta: /auditoria-patrimonial/dia-3/[ref]
 */

import Modulo03Page from '../page';

export default function Modulo03WithRefPage() {
  return <Modulo03Page />;
}

export async function generateMetadata({ params }: { params: { ref: string } }) {
  return {
    title: 'Módulo 03: Acoplamiento Híbrido | CreaTuActivo',
    description: `Los planos de la Máquina Operativa: corporación transnacional e IA bajo su dirección. Compartido por ${params.ref}.`,
    robots: { index: false, follow: false },
  };
}
