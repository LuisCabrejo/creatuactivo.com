/**
 * Copyright © 2026 CreaTuActivo.com
 * HomeSliders — Wrappers cliente para SovereignSlider en la Home (server component).
 * Cada export es un island de React independiente que encapsula su propia navegación.
 */

'use client';

import { useRouter } from 'next/navigation';
import SovereignSlider from './SovereignSlider';

/** Hero → /calculadora ("DESLIZAR PARA INICIAR DIAGNÓSTICO") */
export function HeroDiagnosticSlider() {
  const router = useRouter();
  return (
    <SovereignSlider
      label="DESLIZAR PARA INICIAR DIAGNÓSTICO"
      onComplete={() => router.push('/calculadora')}
      accentColor="gold"
    />
  );
}

/** FinalCTA → /mapa-de-salida ("DESLIZAR PARA OBTENER MAPA") */
export function MapaSlider() {
  const router = useRouter();
  return (
    <SovereignSlider
      label="DESLIZAR PARA OBTENER MAPA"
      onComplete={() => router.push('/mapa-de-salida')}
      accentColor="cyan"
    />
  );
}
