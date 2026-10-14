'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { usaChatWeb, guardarAperturaPendiente, hayChatWebMontado, marcarVideoVisto, type DetalleApertura, type VideoVisto } from '@/lib/orbe-config';

const UnifiedQueswaOrb = dynamic(
  () => import('@/components/UnifiedQueswaOrb'),
  { ssr: false, loading: () => null },
);

const WhatsAppOrb = dynamic(
  () => import('@/components/WhatsAppOrb'),
  { ssr: false, loading: () => null },
);

const VIDEOS_DEL_ENLACE: readonly VideoVisto[] = ['como-funciona', 'como-entra-el-dinero', 'que-debo-hacer-yo', 'estrategia'];

/**
 * Difiere la carga del orbe hasta el primer evento de interacción del usuario:
 * ni Framer Motion (114KB, chat web) ni el orbe de WhatsApp bloquean la
 * hidratación inicial de la página.
 *
 * CUÁL de los dos se monta lo decide `usaChatWeb()` — el interruptor vive en
 * [src/lib/orbe-config.ts](src/lib/orbe-config.ts), no aquí. Desde el 13 oct 2026
 * decide por dispositivo: en el computador, el chat web; en el celular y la
 * tableta, WhatsApp. Los decks (/servilleta) conservan el chat web en todos.
 *
 * Dos casos en que el orbe se monta sin esperar (13 oct 2026), los dos solo
 * cuando el que va a montarse es el chat web:
 *  · `?abrir=queswa` — el enlace del socio abierto en un computador aterriza en
 *    la Home pidiendo el chat abierto (y `&vio=` dice qué video ya vio).
 *  · un `open-queswa` que llega antes de que el chat web esté montado —un botón
 *    tocado en el primer segundo, o mientras el módulo aún carga— se guarda y el
 *    chat lo atiende al montar, en vez de perderse.
 * En el celular no se toca nada: el salto a WhatsApp necesita el toque de la
 * persona, y abrirlo después, sin él, lo bloquearía el navegador.
 */
export default function DeferredOrb() {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // La llegada desde el enlace del socio, en el computador.
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('abrir') === 'queswa' && usaChatWeb(pathname)) {
        const vio = url.searchParams.get('vio') as VideoVisto | null;
        if (vio && VIDEOS_DEL_ENLACE.includes(vio)) marcarVideoVisto(vio);
        guardarAperturaPendiente({ origen: 'enlace', enfocar: true });
        // Se retira de la dirección: que una recarga o un enlace copiado no
        // vuelva a abrir el chat. El `ref` se queda (tracking.js lo lee).
        // ⚠️ Diferido: este efecto corre antes de que el enrutador de Next
        // termine de montar, y su sincronización de la dirección pisaba el cambio.
        url.searchParams.delete('abrir');
        url.searchParams.delete('vio');
        setTimeout(() => window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash), 400);
        setReady(true);
      }
    } catch { /* URL ilegible: sigue el camino normal */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Un `open-queswa` antes de que el chat web esté montado (13 oct 2026).
  useEffect(() => {
    const temprano = (e: Event) => {
      if (hayChatWebMontado() || !usaChatWeb(pathname)) return;
      e.preventDefault();
      guardarAperturaPendiente({ origen: 'boton', ...((e as CustomEvent<DetalleApertura>).detail ?? {}) });
      setReady(true);
    };
    window.addEventListener('open-queswa', temprano);
    return () => window.removeEventListener('open-queswa', temprano);
  }, [pathname]);

  useEffect(() => {
    if (ready) return;
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
  }, [ready]);

  if (!ready) return null;
  return usaChatWeb(pathname) ? <UnifiedQueswaOrb /> : <WhatsAppOrb />;
}
