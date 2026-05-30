'use client'

/**
 * Copyright © 2026 CreaTuActivo.com
 * Video del reel (9:16) + burbuja contextual de Queswa.
 *
 * El reel pide "audite su viabilidad con Queswa". La burbuja sobre el orbe
 * aparece cuando el video TERMINA o cuando el usuario hace scroll dejándolo
 * atrás, y se OCULTA cuando: vuelve al video (re-entra al viewport), abre el
 * chat (queswa-opened), o pasan 25 s. Al tocarla abre Queswa (open-queswa).
 */

import { useEffect, useRef, useState } from 'react'

const PROMPT_MESSAGE = 'Puedo auditar la viabilidad de su caso ahora mismo. ¿Comenzamos?'
const AUTO_HIDE_MS = 25000

export default function ReelVideo({ poster, src }: { poster: string; src: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const chatEngagedRef = useRef(false)

  const hide = () => {
    setShowPrompt(false)
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }

  const show = () => {
    if (chatEngagedRef.current) return
    setShowPrompt(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowPrompt(false), AUTO_HIDE_MS)
  }

  // Trigger/hide por scroll: fuera del viewport muestra; volver al video oculta
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) hide()
        else show()
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Abrir el chat (orbe o burbuja) oculta la burbuja y no la vuelve a mostrar
  useEffect(() => {
    const onOpened = () => {
      chatEngagedRef.current = true
      hide()
    }
    window.addEventListener('queswa-opened', onOpened)
    return () => window.removeEventListener('queswa-opened', onOpened)
  }, [])

  const openQueswa = () => {
    hide()
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
          onEnded={show}
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
