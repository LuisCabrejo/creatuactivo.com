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
// SOLUCIÓN SIMPLIFICADA: Prioriza auto-scroll para nuevos mensajes
'use client';

import { useState, useLayoutEffect, useRef, RefObject, useCallback, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

/**
 * Hook simplificado que prioriza el auto-scroll a nuevos mensajes.
 * Mantiene el transform para el efecto slide pero asegura que nuevos mensajes sean siempre visibles.
 */
export const useSlidingViewport = (
  messages: Message[],
  scrollContainerRef: RefObject<HTMLDivElement>
): {
  offset: number;
  registerNode: (messageId: string) => (node: HTMLElement | null) => void;
  isUserScrolling: boolean;
  scrollToLatest: () => void;
  messageCount: number;
} => {
  const [offset, setOffset] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Map para mantener referencias a los nodos DOM
  const messageNodesRef = useRef<Map<string, HTMLElement>>(new Map());

  // Referencias para control de scroll
  const lastMessageCountRef = useRef(0);
  const programmaticScrollRef = useRef(false);
  const manualScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Función para calcular offset (simplificada)
  const calculateOffset = useCallback(() => {
    if (messages.length <= 2) {
      return 0;
    }

    // Solo calcular altura de mensajes que no sean los últimos 2
    const messagesToHide = messages.slice(0, -2);
    let totalHeight = 0;

    messagesToHide.forEach(msg => {
      const node = messageNodesRef.current.get(msg.id);
      if (node) {
        totalHeight += node.offsetHeight + 16; // 16px de margen
      }
    });

    return totalHeight;
  }, [messages]);

  // Función para scroll a la conversación actual
  const scrollToLatest = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    programmaticScrollRef.current = true;

    // Scroll a la posición que compensa el transform
    const targetPosition = offset;

    container.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    console.log(`🎯 SCROLL A CONVERSACIÓN ACTUAL: ${targetPosition}px`);

    // Resetear estado de scroll manual después de auto-scroll
    setIsUserScrolling(false);
  }, [offset]);

  // Detectar scroll manual (SIMPLIFICADO)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (programmaticScrollRef.current) {
        programmaticScrollRef.current = false;
        return;
      }

      // Solo considerar como "scroll manual" si se aleja significativamente de la posición esperada
      const currentPosition = container.scrollTop;
      const expectedPosition = offset;
      const difference = Math.abs(currentPosition - expectedPosition);

      // UMBRAL MÁS ALTO para ser menos sensible
      if (difference > 100) {
        console.log(`📜 SCROLL MANUAL DETECTADO: diff=${difference}px`);
        setIsUserScrolling(true);

        // Clear timeout anterior
        if (manualScrollTimeoutRef.current) {
          clearTimeout(manualScrollTimeoutRef.current);
        }

        // Timeout corto - queremos volver rápido al auto-scroll
        manualScrollTimeoutRef.current = setTimeout(() => {
          console.log('⏰ TIMEOUT - Reactivando auto-scroll');
          setIsUserScrolling(false);
        }, 1500); // Solo 1.5 segundos
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (manualScrollTimeoutRef.current) {
        clearTimeout(manualScrollTimeoutRef.current);
      }
    };
  }, [offset]);

  // PRIORIDAD: Auto-scroll para nuevos mensajes
  // useLayoutEffect ejecuta DESPUÉS de que registerNode haya capturado los nodos
  // pero ANTES del primer paint
  useLayoutEffect(() => {
    // Si hay nuevos mensajes, SIEMPRE hacer auto-scroll
    if (messages.length > lastMessageCountRef.current) {
      console.log(`📬 NUEVO MENSAJE: ${messages.length} (anterior: ${lastMessageCountRef.current})`);

      // ⚡ FIX CRÍTICO: requestAnimationFrame NECESARIO para que los nodos se registren
      // El problema era que calculateOffset() se ejecutaba ANTES de que registerNode capturara los nodos
      // RAF retrasa la ejecución hasta el siguiente frame, cuando los nodos ya están en el Map
      requestAnimationFrame(() => {
        const newOffset = calculateOffset();

        // Paso 1: actualizar estado → React re-renderiza con nuevo transform
        setOffset(newOffset);
        setIsUserScrolling(false);

        // Paso 2: segundo RAF — espera a que React pinte el nuevo transform
        // antes de mover scrollTop. Elimina el brinco por race condition.
        requestAnimationFrame(() => {
          const scrollContainer = scrollContainerRef.current;
          if (scrollContainer) {
            programmaticScrollRef.current = true;
            scrollContainer.scrollTop = newOffset;
          }
        });
      });
    }

    lastMessageCountRef.current = messages.length;
  }, [messages.length, calculateOffset]);

  // Actualizar offset cuando cambia el contenido (streaming)
  useLayoutEffect(() => {
    if (messages.length > 0 && !isUserScrolling) {
      const newOffset = calculateOffset();
      if (Math.abs(newOffset - offset) > 10) {
        // Actualizar estado - ascenso instantáneo
        setOffset(newOffset);

        // ✅ SCROLL SÍNCRONO: Aplicado directamente, sin requestAnimationFrame
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
          programmaticScrollRef.current = true;
          scrollContainer.scrollTop = newOffset;
        }
      }
    }
  }, [messages, calculateOffset, offset, isUserScrolling]);

  // Función para registrar nodos DOM
  const registerNode = useCallback((messageId: string) => (node: HTMLElement | null) => {
    const map = messageNodesRef.current;

    if (node) {
      node.dataset.messageId = messageId;
      map.set(messageId, node);
    } else {
      map.delete(messageId);
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (manualScrollTimeoutRef.current) {
        clearTimeout(manualScrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    offset,
    registerNode,
    isUserScrolling,
    scrollToLatest,
    messageCount: messages.length // Exportar para detectar nuevos mensajes en el componente
  };
};
