'use client';
/** Vuelve a pedir la página al servidor cada `cada` ms y al volver a la pestaña. */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Refrescar({ cada }: { cada: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => router.refresh(), cada);
    const alVolver = () => document.visibilityState === 'visible' && router.refresh();
    document.addEventListener('visibilitychange', alVolver);
    return () => {
      clearInterval(t);
      document.removeEventListener('visibilitychange', alVolver);
    };
  }, [router, cada]);
  return null;
}
