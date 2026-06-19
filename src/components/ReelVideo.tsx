'use client'

/**
 * Copyright © 2026 CreaTuActivo.com
 * Video del reel (9:16) + transición a Queswa (patrón Home, Jun 2026).
 *
 * - Autoplay silencioso (muted/playsInline) con chip "ACTIVAR SONIDO": se ve que
 *   el video está hablando. Tocar el video o el chip activa el audio y REINICIA
 *   desde 0 (la narrativa empieza ahí). Con sonido: controles nativos. Mismo
 *   patrón que la Home (HomeManifestoVideo).
 * - Engagement: los milestones (25/50/75/completed) SOLO se reportan con el
 *   sonido activo — el preview silencioso no cuenta como visionado real.
 * - Al TERMINAR: el video se desvanece (1000ms) y detrás aparece el panel de
 *   Queswa; si sigue en viewport (≥40%) se abre el chat con foco. NO despliega
 *   burbuja al terminar.
 * - Burbuja contextual sobre el orbe: SOLO cuando el usuario hace scroll dejando
 *   el video atrás (no se autodespliega mientras lo ve). Texto del sitio:
 *   "¿Construimos su empresa digital?". Se oculta al volver al video, al abrir el
 *   chat (queswa-opened), a los 25s, o con la ×.
 * - Tracking de engagement (contrato con el Dashboard) intacto.
 */

import { useEffect, useRef, useState } from 'react'

const FADE_MS = 1000
const PROMPT_MESSAGE = '¿Construimos su empresa digital?'
const AUTO_HIDE_MS = 25000

const C = { gold: '#C5A059', obsidian: '#1A1D23', carbon: '#0F1115', white: '#FFFFFF', muted: '#A3A3A3' }

function openQueswaAndFocus() {
  window.dispatchEvent(new CustomEvent('open-queswa', { detail: { source: 'reel' } }))
  setTimeout(() => {
    const input = document.getElementById('queswa-chat-input') as HTMLTextAreaElement | null
    input?.focus({ preventScroll: true })
  }, 80)
}

export default function ReelVideo({ poster, src, nicho }: { poster: string; src: string; nicho: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [ended, setEnded] = useState(false)
  const [muted, setMuted] = useState(true)
  const hijackedRef = useRef(false)

  const [showPrompt, setShowPrompt] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suppressedRef = useRef(false)

  // ─── Engagement Fase 1 — ≤6 escrituras/sesión (ver HANDOFF_REELS_ENGAGEMENT_FASE1.md) ───
  const reported = useRef({ m25: false, m50: false, m75: false, ended: false, queswa: false })
  const maxPctRef = useRef(0)
  const msgCountRef = useRef(0)
  const activeMsRef = useRef(0)
  const lastTickRef = useRef(Date.now())
  const visitCountRef = useRef(0)
  const sentExitRef = useRef(false)

  const getFingerprint = (): string | null => {
    if (typeof window === 'undefined') return null
    const w = window as any
    return w.FrameworkIAA?.fingerprint || localStorage.getItem('nexus_fingerprint') || null
  }

  const report = (payload: Record<string, any>) => {
    const fingerprint = getFingerprint()
    if (!fingerprint) return
    fetch('/api/track/engagement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint, nicho, ...payload }),
      keepalive: true,
    }).catch(() => {})
  }

  const handleTimeUpdate = () => {
    const el = videoRef.current
    if (!el || !el.duration) return
    // El preview silencioso no cuenta como visionado real: los milestones solo
    // se reportan con el sonido activo (tras "Activar sonido" → reinicio desde 0).
    if (el.muted) return
    const pct = Math.floor((el.currentTime / el.duration) * 100)
    if (pct > maxPctRef.current) maxPctRef.current = pct
    if (pct >= 25 && !reported.current.m25) { reported.current.m25 = true; report({ pct: 25 }) }
    if (pct >= 50 && !reported.current.m50) { reported.current.m50 = true; report({ pct: 50 }) }
    if (pct >= 75 && !reported.current.m75) { reported.current.m75 = true; report({ pct: 75 }) }
  }

  const clearTimer = () => { if (hideTimer.current) clearTimeout(hideTimer.current) }
  const hide = () => { setShowPrompt(false); clearTimer() }
  const dismiss = () => { suppressedRef.current = true; hide() }
  const show = () => {
    if (suppressedRef.current) return
    setShowPrompt(true)
    clearTimer()
    hideTimer.current = setTimeout(() => setShowPrompt(false), AUTO_HIDE_MS)
  }

  // Fase preview (muted): tocar el video o el chip activa el sonido y REINICIA
  // desde 0 — la narrativa empieza de verdad ahí (mismo patrón que la Home).
  const startWithSound = () => {
    const el = videoRef.current
    if (!el) return
    setMuted(false)
    el.muted = false
    el.currentTime = 0
    el.play().catch(() => {})
  }

  // Al terminar: fade del video + abrir Queswa (si sigue a la vista). Sin burbuja.
  // "completed" solo se reporta si el reel terminó CON sonido (visionado real).
  const handleEnded = () => {
    const el = videoRef.current
    if (el && !el.muted && !reported.current.ended) { reported.current.ended = true; report({ completed: true, pct: 100 }) }
    setEnded(true)
    if (hijackedRef.current) return
    hijackedRef.current = true
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const vh = window.innerHeight || document.documentElement.clientHeight
    const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
    if (visible / rect.height >= 0.4) openQueswaAndFocus()
  }

  // Quien pide repetir quiere oírlo de nuevo → entra con sonido desde 0
  const replay = () => {
    setEnded(false)
    startWithSound()
  }

  // Burbuja SOLO por scroll: fuera del viewport muestra; volver al video oculta
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) hide(); else show() },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => { obs.disconnect(); clearTimer() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onOpened = () => { suppressedRef.current = true; hide() }
    window.addEventListener('queswa-opened', onOpened)
    return () => window.removeEventListener('queswa-opened', onOpened)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openQueswa = () => { hide(); openQueswaAndFocus() }

  // Engagement: queswa_opened (push), conteo de mensajes, tiempo activo + visit_count en beacon de salida
  useEffect(() => {
    const THIRTY_MIN = 30 * 60 * 1000
    const now = Date.now()
    const last = Number(localStorage.getItem('reel_last_seen') || 0)
    let count = Number(localStorage.getItem('reel_visit_count') || 0)
    if (!last || now - last > THIRTY_MIN) count += 1
    visitCountRef.current = count
    localStorage.setItem('reel_visit_count', String(count))
    localStorage.setItem('reel_last_seen', String(now))

    lastTickRef.current = Date.now()
    const flushActive = () => {
      activeMsRef.current += Date.now() - lastTickRef.current
      lastTickRef.current = Date.now()
    }

    const onQueswaOpened = () => {
      if (!reported.current.queswa) { reported.current.queswa = true; report({ queswa_opened: true }) }
    }
    const onMsgSent = () => { msgCountRef.current += 1 }

    const sendExit = () => {
      if (sentExitRef.current) return
      sentExitRef.current = true
      flushActive()
      const fingerprint = getFingerprint()
      if (!fingerprint) return
      const body = JSON.stringify({
        fingerprint,
        nicho,
        time_s: Math.round(activeMsRef.current / 1000),
        visit_count: visitCountRef.current,
        queswa_messages: msgCountRef.current,
      })
      try {
        fetch('/api/track/engagement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {})
      } catch {
        if (navigator.sendBeacon) navigator.sendBeacon('/api/track/engagement', new Blob([body], { type: 'application/json' }))
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') sendExit()
      else lastTickRef.current = Date.now()
    }

    window.addEventListener('queswa-opened', onQueswaOpened)
    window.addEventListener('queswa-message-sent', onMsgSent)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', sendExit)

    return () => {
      window.removeEventListener('queswa-opened', onQueswaOpened)
      window.removeEventListener('queswa-message-sent', onMsgSent)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', sendExit)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
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
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', lineHeight: 1.5, color: C.white, margin: 0 }}>
            Queswa está en línea y conoce su caso. Pregúntele lo que quiera.
          </p>
          <button
            type="button"
            onClick={openQueswaAndFocus}
            style={{
              background: 'rgba(197, 160, 89, 0.08)', border: `1px solid ${C.gold}`, color: C.gold,
              fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em',
              padding: '12px 22px', borderRadius: 6, cursor: 'pointer',
            }}
          >
            Hablar con Queswa →
          </button>
          <button
            type="button"
            onClick={replay}
            style={{
              background: 'transparent', border: 'none', color: C.muted, fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem', letterSpacing: '0.1em', cursor: 'pointer', padding: 6,
            }}
          >
            ↺ Ver de nuevo
          </button>
        </div>

        {/* Video — encima del panel; al terminar se desvanece y deja pasar los toques.
            Preview (muted): autoplay silencioso + tocar reinicia con sonido. Con sonido: controles nativos. */}
        <video
          ref={videoRef}
          autoPlay
          muted={muted}
          playsInline
          preload="metadata"
          controls={!muted && !ended}
          controlsList="nodownload"
          disablePictureInPicture
          poster={poster}
          src={src}
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          onClick={muted && !ended ? startWithSound : undefined}
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
            cursor: muted && !ended ? 'pointer' : 'default',
          }}
        />

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

      {/* Burbuja contextual sobre el orbe (bottom-right) — solo al dejar el video atrás */}
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
            aria-label="Abrir Queswa"
            style={{ display: 'block', textAlign: 'left', cursor: 'pointer', background: 'transparent', border: 'none', padding: '11px 32px 11px 14px' }}
          >
            <span style={{ fontSize: 13, color: '#FFFFFF', lineHeight: 1.45, fontFamily: 'var(--font-mono)', fontWeight: 600, display: 'block' }}>
              {PROMPT_MESSAGE}
            </span>
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Cerrar"
            style={{
              position: 'absolute', top: 4, right: 6, width: 24, height: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.55)',
              fontSize: 17, lineHeight: 1, cursor: 'pointer', padding: 0,
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
