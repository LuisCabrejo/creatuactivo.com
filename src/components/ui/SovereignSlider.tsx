/**
 * Copyright © 2026 CreaTuActivo.com
 * SovereignSlider — Interruptor Deslizante de Doble Etapa
 * UX "Lujo Silencioso + Realismo Industrial"
 *
 * Stage 1 (Drag): Arrastrar thumb de izquierda a derecha con resistencia spring.
 * Stage 2 (Hold): Mantener presionado 1 segundo. Anillo de progreso + edge lighting.
 * Complete: "ACCESO CONCEDIDO" efímero → dispara onComplete().
 */

'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'armed' | 'holding' | 'complete';

const THUMB_W  = 108;   // px — ancho del bloque deslizable
const TRACK_H  = 60;    // px — alto total del riel
const HOLD_MS  = 1000;  // ms — duración del hold requerido

export interface SovereignSliderProps {
  label: string;
  onComplete: () => void;
  /** Cuando es true, el thumb regresa al inicio si se suelta antes del final */
  disabled?: boolean;
  accentColor?: 'cyan' | 'gold';
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function tryVibrate(pattern: number | number[]) {
  try { navigator.vibrate?.(pattern); } catch (_) { /* no-op en browsers sin soporte */ }
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
  const trackRef      = useRef<HTMLDivElement>(null);
  const [phase, setPhase]           = useState<Phase>('idle');
  const [holdProgress, setHoldProgress] = useState(0);
  const [trackWidth, setTrackWidth] = useState(440);

  const x             = useMotionValue(0);
  const animFrameRef  = useRef<number | null>(null);
  const holdStartRef  = useRef<number | null>(null);
  const lastHapticX   = useRef(0);
  const phaseRef      = useRef<Phase>('idle');

  const ACCENT = accentColor === 'cyan' ? '#00e5ff' : '#E5C279';
  const maxX   = Math.max(0, trackWidth - THUMB_W - 4); // 4 = 2px border cada lado

  // Sync ref so event handlers always see current phase without stale closure
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Track width via ResizeObserver
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    setTrackWidth(el.offsetWidth);
    const ro = new ResizeObserver(([entry]) => setTrackWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Reset if disabled changes while thumb is out of idle
  useEffect(() => {
    if (disabled && phase !== 'idle' && phase !== 'complete') {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
      setPhase('idle');
      setHoldProgress(0);
    }
  }, [disabled, phase, x]);

  // Cleanup rAF on unmount
  useEffect(() => () => {
    if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
  }, []);

  // ── Drag handlers ──────────────────────────────────────────────────────────

  const handleDrag = useCallback(() => {
    const curr = x.get();
    // Micro-vibración cada 22px — simula engranajes mecánicos
    if (Math.abs(curr - lastHapticX.current) >= 22) {
      tryVibrate([10]);
      lastHapticX.current = curr;
    }
  }, [x]);

  const handleDragEnd = useCallback(() => {
    const curr = x.get();
    if (!disabled && curr >= maxX * 0.88) {
      // Snap al extremo derecho → fase "armada"
      animate(x, maxX, { type: 'spring', stiffness: 900, damping: 45 });
      setPhase('armed');
      tryVibrate([10, 20, 10]);
    } else {
      // Spring de vuelta → idle
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
      setPhase('idle');
    }
  }, [x, maxX, disabled]);

  // ── Hold handlers ──────────────────────────────────────────────────────────

  const startHold = useCallback((e: React.PointerEvent) => {
    if (phaseRef.current !== 'armed') return;
    e.preventDefault();
    setPhase('holding');
    holdStartRef.current = performance.now();

    const tick = () => {
      const elapsed  = performance.now() - (holdStartRef.current ?? 0);
      const progress = Math.min(elapsed / HOLD_MS, 1);
      setHoldProgress(progress);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        // ¡Hold completo!
        tryVibrate([50, 50, 100]);
        setPhase('complete');
        setTimeout(() => onComplete(), 750);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, [onComplete]);

  const cancelHold = useCallback(() => {
    if (phaseRef.current !== 'holding') return;
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setHoldProgress(0);
    setPhase('armed');
  }, []);

  // Cancelar hold si se suelta el puntero en cualquier parte de la ventana
  useEffect(() => {
    const up = () => cancelHold();
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [cancelHold]);

  // ── Derived visuals ────────────────────────────────────────────────────────

  const glowAlpha = phase === 'complete' ? 1 : holdProgress;
  const glowHex   = Math.round(glowAlpha * 90).toString(16).padStart(2, '0');
  const glowSize  = Math.round(glowAlpha * 20);

  const isArmed   = phase === 'armed' || phase === 'holding';
  const trackText = phase === 'complete'
    ? '✓  ACCESO CONCEDIDO'
    : isArmed ? 'MANTENER PARA EJECUTAR' : label;

  const thumbText = phase === 'complete' ? '✓' : isArmed ? '◼◼' : '▶▶';

  // SVG border progress on thumb
  const thumbH = TRACK_H - 4;
  const svgW   = THUMB_W + 4;
  const svgH   = thumbH + 4;
  const perim  = 2 * ((THUMB_W + 2) + (thumbH + 2));

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      ref={trackRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 500,
        height: TRACK_H,
        background: '#0A0B0C',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 2,
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        opacity: disabled ? 0.45 : 1,
        transition: 'opacity 0.25s ease',
        boxShadow: glowAlpha > 0
          ? `0 0 0 1px ${ACCENT}${glowHex}, 0 0 ${glowSize}px ${ACCENT}${Math.round(glowAlpha * 40).toString(16).padStart(2, '0')}`
          : 'none',
      }}
    >
      {/* ── Fondo de llenado durante el hold ─────────────────────────────── */}
      {holdProgress > 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to right, ${ACCENT}12 ${holdProgress * 100}%, transparent ${holdProgress * 100}%)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* ── Barra de progreso inferior (durante hold) ─────────────────────── */}
      {phase === 'holding' && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 2,
          width: `${holdProgress * 100}%`,
          background: ACCENT,
          boxShadow: `0 0 8px ${ACCENT}`,
          pointerEvents: 'none',
          zIndex: 20,
        }} />
      )}

      {/* ── Texto del riel ────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Texto visible a la derecha del thumb (idle) o a la izquierda (armed)
        paddingLeft:  phase === 'idle' ? THUMB_W + 12 : 12,
        paddingRight: isArmed          ? THUMB_W + 12 : 12,
        fontFamily: "'Roboto Mono', 'Courier New', monospace",
        fontSize: '0.68rem',
        letterSpacing: '0.18em',
        color: phase === 'complete' ? ACCENT : 'rgba(255,255,255,0.28)',
        fontWeight: phase === 'complete' ? 700 : 400,
        pointerEvents: 'none',
        userSelect: 'none',
        textAlign: 'center',
        transition: 'color 0.2s ease',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}>
        {trackText}
      </div>

      {/* ── Thumb deslizable ─────────────────────────────────────────────── */}
      <motion.div
        drag={phase === 'idle' ? 'x' : false}
        dragConstraints={{ left: 0, right: maxX }}
        dragElastic={0}
        dragMomentum={false}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onPointerDown={startHold}

        // Pulso de "tap para ejecutar" cuando está armado
        animate={phase === 'armed' ? {
          boxShadow: [
            'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0px rgba(0,229,255,0)',
            `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 4px ${ACCENT}20`,
            'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0px rgba(0,229,255,0)',
          ],
        } : {
          boxShadow: phase === 'holding'
            ? `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 14px ${ACCENT}55`
            : 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.8)',
        }}
        transition={phase === 'armed' ? {
          duration: 1.3,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        } : { duration: 0.15 }}

        style={{
          x,
          position: 'absolute',
          top: 2,
          bottom: 2,
          left: 2,
          width: THUMB_W,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: phase === 'idle' ? 'grab' : (phase === 'armed' ? 'pointer' : 'default'),
          touchAction: 'none',
          zIndex: 10,
          background: phase === 'complete'
            ? ACCENT
            : 'linear-gradient(160deg, #22252C 0%, #181A1F 55%, #101215 100%)',
          borderRadius: 1,
          overflow: 'visible',
          // box-shadow controlado por `animate` arriba (framer-motion lo maneja)
        }}
      >
        {/* SVG: anillo de progreso alrededor del thumb (armed + holding) */}
        {isArmed && (
          <svg
            style={{
              position: 'absolute',
              top: -2,
              left: -2,
              width: svgW,
              height: svgH,
              pointerEvents: 'none',
              overflow: 'visible',
            }}
            viewBox={`0 0 ${svgW} ${svgH}`}
          >
            <rect
              x={1} y={1}
              width={svgW - 2}
              height={svgH - 2}
              rx={1}
              fill="none"
              stroke={ACCENT}
              strokeWidth={1.5}
              strokeDasharray={perim}
              strokeDashoffset={perim * (1 - holdProgress)}
              strokeLinecap="butt"
            />
          </svg>
        )}

        {/* Etiqueta del thumb */}
        <span style={{
          fontFamily: "'Roboto Mono', 'Courier New', monospace",
          fontSize: '0.9rem',
          color: phase === 'complete' ? '#000' : (phase === 'holding' ? ACCENT : 'rgba(255,255,255,0.60)'),
          fontWeight: 700,
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '0.05em',
          transition: 'color 0.2s ease',
        }}>
          {thumbText}
        </span>
      </motion.div>
    </div>
  );
}
