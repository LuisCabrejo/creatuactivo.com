/**
 * Copyright © 2026 CreaTuActivo.com
 * SovereignSlider v2 — Hold-to-Execute ("Ignición de Motor")
 *
 * Un solo gesto deliberado: mantener presionado 1.5 segundos.
 * Llenado de izquierda a derecha + edge glow + háptica progresiva.
 * Si se suelta antes → retreat fluido a cero.
 */

'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types & constants
// ─────────────────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'holding' | 'complete';

const HOLD_MS = 1500;

export interface SovereignSliderProps {
  label: string;
  onComplete: () => void;
  disabled?: boolean;
  accentColor?: 'cyan' | 'gold';
}

function tryVibrate(pattern: number | number[]) {
  try { navigator.vibrate?.(pattern); } catch (_) { /* no-op */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function SovereignSlider({
  label,
  onComplete,
  disabled = false,
  accentColor = 'cyan',
}: SovereignSliderProps) {
  const [phase, setPhase]   = useState<Phase>('idle');
  const fillProgress        = useMotionValue(0);       // 0 → 1
  const animFrameRef        = useRef<number | null>(null);
  const holdStartRef        = useRef<number | null>(null);
  const hapticIntervalRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef            = useRef<Phase>('idle');

  const ACCENT = accentColor === 'cyan' ? '#00e5ff' : '#E5C279';

  // fillWidth: '0%' → '100%', drives the fill container
  const fillWidth = useTransform(fillProgress, [0, 1], ['0%', '100%']);

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Cleanup on unmount
  useEffect(() => () => {
    if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    if (hapticIntervalRef.current !== null) clearInterval(hapticIntervalRef.current);
  }, []);

  // ── Start hold ─────────────────────────────────────────────────────────────

  const startHold = useCallback((e: React.PointerEvent) => {
    if (disabled || phaseRef.current !== 'idle') return;
    e.preventDefault();

    setPhase('holding');
    holdStartRef.current = performance.now();

    // Háptica rítmica mientras se carga — simula ignición del motor
    hapticIntervalRef.current = setInterval(() => tryVibrate([8]), 150);

    const tick = () => {
      const elapsed  = performance.now() - (holdStartRef.current ?? 0);
      const progress = Math.min(elapsed / HOLD_MS, 1);
      fillProgress.set(progress);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        // ¡Ignición completa!
        if (hapticIntervalRef.current !== null) {
          clearInterval(hapticIntervalRef.current);
          hapticIntervalRef.current = null;
        }
        tryVibrate([50, 50, 100]);
        setPhase('complete');
        setTimeout(() => onComplete(), 600);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, [disabled, fillProgress, onComplete]);

  // ── Cancel hold (suelta antes de completar) ────────────────────────────────

  const cancelHold = useCallback(() => {
    if (phaseRef.current !== 'holding') return;

    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (hapticIntervalRef.current !== null) {
      clearInterval(hapticIntervalRef.current);
      hapticIntervalRef.current = null;
    }

    // Retreat fluido hacia cero
    animate(fillProgress, 0, { duration: 0.5, ease: 'easeOut' });
    setPhase('idle');
  }, [fillProgress]);

  // Escuchar pointerup globalmente para no perder el cancel
  useEffect(() => {
    const up = () => cancelHold();
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [cancelHold]);

  // ── Render ─────────────────────────────────────────────────────────────────

  const isComplete = phase === 'complete';
  const isHolding  = phase === 'holding';

  return (
    <motion.div
      onPointerDown={startHold}

      // Pulso idle — invita a la acción como un motor en espera
      animate={
        phase === 'idle' ? {
          boxShadow: [
            `0 0 0 0px ${ACCENT}00`,
            `0 0 0 4px ${ACCENT}1A`,
            `0 0 0 0px ${ACCENT}00`,
          ],
        } : isComplete ? {
          boxShadow: `0 0 24px ${ACCENT}55`,
        } : {
          boxShadow: `0 0 0 1px ${ACCENT}35`,
        }
      }
      transition={
        phase === 'idle'
          ? { duration: 2.2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }
          : { duration: 0.2 }
      }

      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 400,
        height: 56,
        background: '#0A0B0C',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        opacity: disabled ? 0.45 : 1,
        touchAction: 'none',
        transition: 'opacity 0.25s ease',
      }}
    >
      {/* ── Llenado de color (izquierda → derecha) ───────────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: fillWidth,
        }}
      >
        {/* Área de relleno con gradiente */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, ${ACCENT}12 0%, ${ACCENT}28 70%, ${ACCENT}45 100%)`,
        }} />

        {/* Borde derecho luminoso — "filo del avance" */}
        {isHolding && (
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: 2,
            background: ACCENT,
            boxShadow: `0 0 10px ${ACCENT}, 0 0 20px ${ACCENT}80`,
          }} />
        )}
      </motion.div>

      {/* ── Línea de progreso inferior ───────────────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: ACCENT,
          boxShadow: `0 0 6px ${ACCENT}`,
          scaleX: fillProgress,
          transformOrigin: 'left',
          opacity: isHolding || isComplete ? 1 : 0,
          transition: 'opacity 0.1s ease',
        }}
      />

      {/* ── Texto centrado ───────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Roboto Mono', 'Courier New', monospace",
        fontSize: '0.82rem',
        letterSpacing: '0.18em',
        fontWeight: 700,
        color: isComplete ? ACCENT : 'rgba(255,255,255,0.85)',
        userSelect: 'none',
        pointerEvents: 'none',
        textShadow: '0 1px 6px rgba(0,0,0,0.9)',
        transition: 'color 0.2s ease',
        whiteSpace: 'nowrap',
      }}>
        {isComplete ? `✓  ${label}` : label}
      </div>
    </motion.div>
  );
}
