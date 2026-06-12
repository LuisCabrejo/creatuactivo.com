'use client'

/**
 * Copyright © 2026 CreaTuActivo.com
 * Video manifiesto de la Home (9:16) + transición a Queswa al terminar.
 *
 * Comportamiento (spec Jun 2026):
 * - Autoplay silencioso (muted/playsInline, sin controles) con chip "Activar sonido".
 * - Al terminar (onEnded): el video se desvanece a transparencia en 1000ms
 *   (pointer-events: none) y detrás aparece un panel oscuro de invitación.
 * - Al completarse el fade, si el video sigue en viewport, se abre Queswa
 *   (open-queswa) y se fuerza el foco en #queswa-chat-input — cursor parpadeando,
 *   sistema listo. Si el usuario ya scrolleó lejos, no se secuestra el foco:
 *   el panel ofrece el botón "Hablar con Queswa".
 */

import { useRef, useState } from 'react'

const FADE_MS = 1000

const C = {
  gold: '#C5A059',
  obsidian: '#1A1D23',
  carbon: '#0F1115',
  white: '#FFFFFF',
  muted: '#A3A3A3',
}

function openQueswaAndFocus() {
  window.dispatchEvent(new CustomEvent('open-queswa'))
  // El widget pasa de display:none a visible — esperar un frame antes del foco
  setTimeout(() => {
    const input = document.getElementById('queswa-chat-input') as HTMLTextAreaElement | null
    input?.focus({ preventScroll: true })
  }, 80)
}

export default function HomeManifestoVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [ended, setEnded] = useState(false)
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false)
  const hijackedRef = useRef(false)

  // Fase preview (muted): tocar = sonido + reinicio desde 0 — la narrativa
  // empieza de verdad aquí. Fase visionado (con sonido): tocar = pausa/play.
  const startWithSound = () => {
    const el = videoRef.current
    if (!el) return
    setMuted(false)
    setPaused(false)
    el.muted = false
    el.currentTime = 0
    el.play().catch(() => {})
  }

  const togglePause = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) { el.play().catch(() => {}); setPaused(false) }
    else { el.pause(); setPaused(true) }
  }

  const handleVideoTap = () => {
    if (ended) return
    if (muted) startWithSound()
    else togglePause()
  }

  const handleEnded = () => {
    setEnded(true)
    if (hijackedRef.current) return
    hijackedRef.current = true
    setTimeout(() => {
      // Focus hijack solo si el video sigue a la vista — si el usuario scrolleó
      // a leer más abajo, abrirle el chat encima sería hostil, no premium.
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const vh = window.innerHeight || document.documentElement.clientHeight
      const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
      if (visible / rect.height >= 0.4) openQueswaAndFocus()
    }, FADE_MS)
  }

  // Quien pide repetir quiere oírlo: el replay entra ya con sonido
  const replay = () => {
    setEnded(false)
    startWithSound()
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 340,
        margin: '0 auto',
        aspectRatio: '9 / 16',
        background: C.carbon,
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid rgba(148, 163, 184, 0.18)',
      }}
    >
      {/* Panel de invitación — vive DETRÁS del video; se revela con el fade-out */}
      <div
        aria-hidden={!ended}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          padding: '0 28px',
          textAlign: 'center',
          background: `radial-gradient(ellipse at center, ${C.obsidian} 0%, ${C.carbon} 75%)`,
          opacity: ended ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease`,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
          color: C.gold,
          textTransform: 'uppercase',
        }}>
          Sistema operativo
        </span>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.05rem',
          lineHeight: 1.5,
          color: C.white,
          margin: 0,
        }}>
          Queswa está en línea y conoce su caso. Pregúntele lo que quiera.
        </p>
        <button
          type="button"
          onClick={openQueswaAndFocus}
          style={{
            background: 'rgba(197, 160, 89, 0.08)',
            border: `1px solid ${C.gold}`,
            color: C.gold,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            padding: '12px 22px',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Hablar con Queswa →
        </button>
        <button
          type="button"
          onClick={replay}
          style={{
            background: 'transparent',
            border: 'none',
            color: C.muted,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            padding: 6,
          }}
        >
          ↺ Ver de nuevo
        </button>
      </div>

      {/* Video — encima del panel; al terminar se desvanece y deja pasar los toques.
          Tocar: en preview (muted) activa sonido desde 0; con sonido, pausa/reanuda. */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted={muted}
        playsInline
        preload="metadata"
        onEnded={handleEnded}
        onClick={handleVideoTap}
        onPlay={() => setPaused(false)}
        onPause={() => { if (!videoRef.current?.ended) setPaused(true) }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: ended ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease`,
          pointerEvents: ended ? 'none' : 'auto',
          cursor: 'pointer',
        }}
      />

      {/* Indicador de pausa — toque para reanudar */}
      {!ended && !muted && paused && (
        <button
          type="button"
          onClick={togglePause}
          aria-label="Reanudar"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            width: 64,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(8, 9, 12, 0.72)',
            border: '1px solid rgba(197, 160, 89, 0.5)',
            borderRadius: '50%',
            color: C.gold,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="7 4 21 12 7 20" />
          </svg>
        </button>
      )}

      {/* Chip de sonido — el autoplay solo es posible silenciado; un toque
          activa el audio y REINICIA desde 0 (la narrativa empieza aquí) */}
      {!ended && muted && (
        <button
          type="button"
          onClick={startWithSound}
          aria-label="Activar sonido y ver desde el inicio"
          style={{
            position: 'absolute',
            bottom: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(8, 9, 12, 0.82)',
            border: '1px solid rgba(197, 160, 89, 0.5)',
            color: C.gold,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            padding: '9px 16px',
            borderRadius: 999,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M19 5a9 9 0 0 1 0 14" />
          </svg>
          ACTIVAR SONIDO
        </button>
      )}
    </div>
  )
}
