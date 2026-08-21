'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { usaChatWeb } from '@/lib/orbe-config';

const UnifiedQueswaOrb = dynamic(
  () => import('@/components/UnifiedQueswaOrb'),
  { ssr: false, loading: () => null },
);

const WhatsAppOrb = dynamic(
  () => import('@/components/WhatsAppOrb'),
  { ssr: false, loading: () => null },
);

/**
 * Difiere la carga del orbe hasta el primer evento de interacción del usuario:
 * ni Framer Motion (114KB, chat web) ni el orbe de WhatsApp bloquean la
 * hidratación inicial de la página.
 *
 * CUÁL de los dos se monta lo decide `usaChatWeb()` — el interruptor vive en
 * [src/lib/orbe-config.ts](src/lib/orbe-config.ts), no aquí. En esta fase el orbe
 * por defecto es el de WhatsApp; los decks (/servilleta, /12-niveles) conservan el
 * chat web porque su botón "PREGÚNTALE ALGO EN VIVO" es una demo en vivo.
 */
export default function DeferredOrb() {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

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
  return usaChatWeb(pathname) ? <UnifiedQueswaOrb /> : <WhatsAppOrb />;
}
