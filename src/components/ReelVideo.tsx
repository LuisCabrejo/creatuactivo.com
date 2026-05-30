'use client'

/**
 * Copyright © 2026 CreaTuActivo.com
 * Video del reel (9:16) + burbuja contextual de Queswa.
 *
 * El reel pide "audite su viabilidad con Queswa". Cuando el video TERMINA
 * (o el usuario hace scroll dejándolo atrás sin terminarlo), aparece una
 * burbuja sobre el orbe con un CTA de interés que abre el chat (open-queswa).
 * El tooltip genérico del orbe se suprime en rutas de reel (UnifiedQueswaOrb).
 */

import { useEffect, useRef, useState } from 'react'

const PROMPT_MESSAGE = '¿Vemos si los números de su caso cuadran? Aquí mismo.'

export default function ReelVideo({ poster, src }: { poster: string; src: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const firedRef = useRef(false)

  const trigger = () => {
    if (firedRef.current) return
    firedRef.current = true
    setShowPrompt(true)
  }

  // Trigger por scroll: si el reel sale del viewport sin haber terminado
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) trigger()
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const openQueswa = () => {
    setShowPrompt(false)
    window.dispatchEvent(new CustomEvent('open-queswa'))
  }

  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '9 / 16',
          background: '#000',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid rgba(148, 163, 184, 0.18)',
        }}
      >
        <video
          ref={videoRef}
          controls
          playsInline
          preload="none"
          poster={poster}
          src={src}
          onEnded={trigger}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Burbuja contextual sobre el orbe (bottom-right) */}
      {showPrompt && (
        <button
          type="button"
          onClick={openQueswa}
          aria-label="Abrir Queswa para auditar su caso"
          style={{
            position: 'fixed',
            bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 16px) + 68px)',
            right: '1rem',
            zIndex: 199,
            maxWidth: 230,
            textAlign: 'left',
            cursor: 'pointer',
            background: 'rgba(8,9,12,0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(212,175,55,0.55)',
            boxShadow: '0 0 12px rgba(212,175,55,0.15), 0 4px 16px rgba(0,0,0,0.6)',
            borderRadius: 6,
            padding: '10px 14px',
            animation: 'reelPromptIn 0.3s ease both',
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: '#FFFFFF',
              lineHeight: 1.45,
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              display: 'block',
            }}
          >
            {PROMPT_MESSAGE}
          </span>
        </button>
      )}

      <style>{`@keyframes reelPromptIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </>
  )
}
