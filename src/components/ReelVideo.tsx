'use client'

/**
 * Copyright © 2026 CreaTuActivo.com
 * Video del reel (9:16) + burbuja contextual de Queswa.
 *
 * El reel pide "audite su viabilidad con Queswa". La burbuja sobre el orbe
 * aparece cuando el video TERMINA o cuando el usuario hace scroll dejándolo
 * atrás, y se OCULTA cuando: vuelve al video (re-entra al viewport), abre el
 * chat (queswa-opened), pasan 25 s, o el usuario la cierra con la ×.
 * Tocar el texto abre Queswa (open-queswa). Cerrarla con × no reaparece.
 */

import { useEffect, useRef, useState } from 'react'

const PROMPT_MESSAGE = 'Puedo auditar la viabilidad de su caso ahora mismo. ¿Comenzamos?'
const AUTO_HIDE_MS = 25000

export default function ReelVideo({ poster, src }: { poster: string; src: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Una vez el usuario cierra la burbuja o abre el chat, no se vuelve a mostrar
  const suppressedRef = useRef(false)

  const clearTimer = () => { if (hideTimer.current) clearTimeout(hideTimer.current) }

  const hide = () => { setShowPrompt(false); clearTimer() }

  const dismiss = () => { suppressedRef.current = true; hide() }

  const show = () => {
    if (suppressedRef.current) return
    setShowPrompt(true)
    clearTimer()
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
    return () => { obs.disconnect(); clearTimer() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Abrir el chat (orbe o burbuja) oculta la burbuja y no la vuelve a mostrar
  useEffect(() => {
    const onOpened = () => { suppressedRef.current = true; hide() }
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
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 16px) + 68px)',
            right: '1rem',
            zIndex: 199,
            maxWidth: 240,
            background: 'rgba(8,9,12,0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(212,175,55,0.55)',
            boxShadow: '0 0 12px rgba(212,175,55,0.15), 0 4px 16px rgba(0,0,0,0.6)',
            borderRadius: 6,
            animation: 'reelPromptIn 0.3s ease both',
          }}
        >
          <button
            type="button"
            onClick={openQueswa}
            aria-label="Abrir Queswa para auditar su caso"
            style={{
              display: 'block',
              textAlign: 'left',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              padding: '11px 32px 11px 14px',
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

          {/* Cerrar — no abre el chat, oculta y no reaparece */}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Cerrar"
            style={{
              position: 'absolute',
              top: 4,
              right: 6,
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.55)',
              fontSize: 17,
              lineHeight: 1,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            ×
          </button>
        </div>
      )}

      <style>{`@keyframes reelPromptIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </>
  )
}
