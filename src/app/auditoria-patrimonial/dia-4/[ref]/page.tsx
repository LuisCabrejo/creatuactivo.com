/**
 * Copyright © 2026 CreaTuActivo.com
 * Módulo 04 con ref de distribuidor
 * Ruta: /auditoria-patrimonial/dia-4/[ref]
 */

import Modulo04Page from '../page';

export default function Modulo04WithRefPage() {
  return <Modulo04Page />;
}

export async function generateMetadata({ params }: { params: { ref: string } }) {
  return {
    title: 'Módulo 04: Matriz de Amortización | CreaTuActivo',
    description: `Ingeniería de Liquidez: capital operativo inmediato y regalías perpetuas. Compartido por ${params.ref}.`,
    robots: { index: false, follow: false },
  };
}
