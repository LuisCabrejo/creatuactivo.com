/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

// src/components/nexus/useSlidingViewport.ts
// v2.0: Scroll suave nativo — elimina sistema transform/offset que causaba saltos
'use client';

import { useState, useRef, RefObject, useCallback, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export const useSlidingViewport = (
  messages: Message[],
  scrollContainerRef: RefObject<HTMLDivElement>
): {
  offset: number;
  registerNode: (messageId: string) => (node: HTMLElement | null) => void;
  isUserScrolling: boolean;
  scrollToLatest: () => void;
  messageCount: number;
  bottomAnchorRef: RefObject<HTMLDivElement>;
} => {
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef(0);
  const userScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const programmaticRef = useRef(false);

  // Detectar si el usuario se alejó del fondo
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScroll = () => {
      if (programmaticRef.current) {
        programmaticRef.current = false;
        return;
      }
      const distFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      if (distFromBottom > 80) {
        setIsUserScrolling(true);
        if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
        userScrollTimeoutRef.current = setTimeout(
          () => setIsUserScrolling(false),
          2500
        );
      } else {
        setIsUserScrolling(false);
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', onScroll);
      if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
    };
  }, [scrollContainerRef]);

  // Scroll suave al fondo — para nuevo mensaje
  const scrollToLatest = useCallback(() => {
    programmaticRef.current = true;
    bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  // Nuevo mensaje: scroll suave
  useEffect(() => {
    if (messages.length > lastMessageCountRef.current) {
      setIsUserScrolling(false);
      requestAnimationFrame(scrollToLatest);
    }
    lastMessageCountRef.current = messages.length;
  }, [messages.length, scrollToLatest]);

  // Streaming: mantener pegado al fondo (instantáneo para no rezagarse)
  useEffect(() => {
    if (isUserScrolling) return;
    programmaticRef.current = true;
    bottomAnchorRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
  }, [messages, isUserScrolling]);

  return {
    offset: 0,                    // Sin transform — mantenido por compatibilidad de API
    registerNode: () => () => {}, // No-op — mantenido por compatibilidad de API
    isUserScrolling,
    scrollToLatest,
    messageCount: messages.length,
    bottomAnchorRef,
  };
};
