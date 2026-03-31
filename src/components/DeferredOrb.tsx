'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const UnifiedQueswaOrb = dynamic(
  () => import('@/components/UnifiedQueswaOrb'),
  { ssr: false, loading: () => null },
);

/**
 * Difiere la carga de UnifiedQueswaOrb (y Framer Motion, 114KB)
 * hasta el primer evento de interacción del usuario.
 * Resultado: ese chunk no bloquea la hidratación inicial de la página.
 */
export default function DeferredOrb() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => setReady(true);
    const opts = { once: true, passive: true } as const;

    window.addEventListener('scroll', load, opts);
    window.addEventListener('mousemove', load, opts);
    window.addEventListener('touchstart', load, opts);
    window.addEventListener('keydown', load, opts);

    // Fallback: cargar de todas formas a los 3s si no hubo interacción
    const timer = setTimeout(load, 3000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', load);
      window.removeEventListener('mousemove', load);
      window.removeEventListener('touchstart', load);
      window.removeEventListener('keydown', load);
    };
  }, []);

  if (!ready) return null;
  return <UnifiedQueswaOrb />;
}
