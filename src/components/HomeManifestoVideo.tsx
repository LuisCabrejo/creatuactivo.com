'use client'

/**
 * Copyright © 2026 CreaTuActivo.com
 * Video manifiesto de la Home (9:16) + transición a Queswa al terminar.
 *
 * Comportamiento (spec Jun 2026):
 * - Autoplay silencioso (muted/playsInline, sin controles) con chip "Activar sonido".
 *   Tocar el video o el chip = activa el audio y REINICIA desde 0 (la narrativa
 *   empieza de verdad ahí).
 * - Con sonido activo: controles nativos (pausa, reiniciar, adelantar/atrasar) —
 *   mismo patrón que los reels de nicho (ReelVideo).
 * - Al terminar (onEnded): el video se desvanece a transparencia en 1000ms
 *   (pointer-events: none) y detrás aparece un panel oscuro de invitación.
 * - Al completarse el fade, si el video sigue en viewport, se abre Queswa
 *   (open-queswa) y se fuerza el foco en #queswa-chat-input — cursor parpadeando,
 *   sistema listo. Si el usuario ya scrolleó lejos, no se secuestra el foco.
 * - Burbuja contextual (patrón ReelVideo): el tooltip genérico del orbe está
 *   suprimido en la Home; este componente muestra su propia burbuja SOLO cuando
 *   el usuario scrollea y deja el video atrás. Se oculta al volver al video,
 *   al abrir el chat (queswa-opened), a los 25s, o con la ×.
 */

import { useEffect, useRef, useState } from 'react'

const FADE_MS = 1000
const PROMPT_MESSAGE = '¿Construimos su empresa digital?'
const AUTO_HIDE_MS = 25000

const C = {
  gold: '#C5A059',
  obsidian: '#1A1D23',
  carbon: '#0F1115',
  white: '#FFFFFF',
  muted: '#A3A3A3',
}

function openQueswaAndFocus() {
  window.dispatchEvent(new CustomEvent('open-queswa', { detail: { source: 'reel' } }))
  // El widget pasa de display:none a visible — esperar un frame antes del foco
  setTimeout(() => {
    const input = document.getElementById('queswa-chat-input') as HTMLTextAreaElement | null
    input?.focus({ preventScroll: true })
  }, 80)
}

export default function HomeManifestoVideo({
  src,
  poster,
  manageOrbVisibility = false,
  enableFullscreen = false,
  maxWidth = 340,
}: {
  src: string
  poster: string
  // Cuando true (página /video-plan-servilleta): oculta el orbe flotante mientras
  // rueda el video para que no interfiera con la experiencia inmersiva, y lo
  // revela al terminar. Queswa sigue accesible por el CTA bajo el video.
  manageOrbVisibility?: boolean
  // Cuando true: muestra un botón "ampliar" (pantalla completa) sobre el video —
  // útil para presentar en Meet. En fullscreen el video vertical se ve completo
  // (object-fit:contain vía globals.css), sin deformarse.
  enableFullscreen?: boolean
  // Ancho máximo del contenedor 9:16 — el modal de /servilleta lo lleva a casi
  // toda la pantalla (calc sobre 92vh); en la Home queda el default embebido.
  maxWidth?: number | string
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [ended, setEnded] = useState(false)
  const [muted, setMuted] = useState(true)
  const hijackedRef = useRef(false)

  // Ocultar el orbe mientras rueda el video (solo si el padre lo pide). Se
  // restaura al terminar (handleEnded) y al desmontar la página.
  useEffect(() => {
    if (!manageOrbVisibility) return
    window.dispatchEvent(new CustomEvent('hide-queswa-orb'))
    return () => { window.dispatchEvent(new CustomEvent('show-queswa-orb')) }
  }, [manageOrbVisibility])

  // ─── Burbuja contextual sobre el orbe (solo al scrollear lejos del video) ───
  const [showPrompt, setShowPrompt] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suppressedRef = useRef(false)

  const clearTimer = () => { if (hideTimer.current) clearTimeout(hideTimer.current) }
  const hidePrompt = () => { setShowPrompt(false); clearTimer() }
  const dismissPrompt = () => { suppressedRef.current = true; hidePrompt() }
  const showPromptNow = () => {
    if (suppressedRef.current) return
    setShowPrompt(true)
    clearTimer()
    hideTimer.current = setTimeout(() => setShowPrompt(false), AUTO_HIDE_MS)
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) hidePrompt()
        else showPromptNow()
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => { obs.disconnect(); clearTimer() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Abrir el chat (orbe o burbuja) oculta la burbuja y no la vuelve a mostrar
  useEffect(() => {
    const onOpened = () => { suppressedRef.current = true; hidePrompt() }
    window.addEventListener('queswa-opened', onOpened)
    return () => window.removeEventListener('queswa-opened', onOpened)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Fases del video ─────────────────────────────────────────────────────────
  // Fase preview (muted): tocar = sonido + reinicio desde 0 — la narrativa
  // empieza de verdad aquí. Fase visionado: controles nativos del navegador.
  const startWithSound = () => {
    const el = videoRef.current
    if (!el) return
    setMuted(false)
    el.muted = false
    el.currentTime = 0
    el.play().catch(() => {})
  }

  // Pantalla completa del VIDEO (no del contenedor, que está limitado a 340px):
  // el video llena la pantalla y globals.css fuerza object-fit:contain para que
  // el vertical 9:16 no se deforme. iOS usa el reproductor nativo (webkit).
  const goFullscreen = () => {
    const el = videoRef.current as any
    if (!el) return
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {})
    else if (el.webkitEnterFullscreen) el.webkitEnterFullscreen()
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
  }

  const handleEnded = () => {
    setEnded(true)
    if (manageOrbVisibility) window.dispatchEvent(new CustomEvent('show-queswa-orb'))
    if (hijackedRef.current) return
    hijackedRef.current = true
    // Transición invisible (nivel Apple): Queswa se abre EN el mismo instante en
    // que arranca el fade — sin pantalla intermedia ni gap perceptible. El foco
    // hijack solo si el video sigue a la vista; si el usuario scrolleó a leer
    // más abajo, abrirle el chat encima sería hostil, no premium.
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const vh = window.innerHeight || document.documentElement.clientHeight
    const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
    if (visible / rect.height >= 0.4) openQueswaAndFocus()
  }

  // Quien pide repetir quiere oírlo: el replay entra ya con sonido
  const replay = () => {
    setEnded(false)
    if (manageOrbVisibility) window.dispatchEvent(new CustomEvent('hide-queswa-orb'))
    startWithSound()
  }

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth,
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
            Preview (muted): tocar reinicia con sonido. Con sonido: controles nativos. */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted={muted}
          playsInline
          preload="metadata"
          controls={!muted && !ended}
          controlsList="nodownload"
          disablePictureInPicture
          onEnded={handleEnded}
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

        {/* Botón "ampliar" (pantalla completa) — para presentar en Meet. El video
            vertical se ve completo, sin deformarse (object-fit:contain en fullscreen). */}
        {enableFullscreen && !ended && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goFullscreen() }}
            aria-label="Ampliar a pantalla completa"
            title="Pantalla completa"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              background: 'rgba(8, 9, 12, 0.72)',
              border: '1px solid rgba(197, 160, 89, 0.5)',
              borderRadius: 8,
              color: C.gold,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M16 3h3a2 2 0 0 1 2 2v3" />
              <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
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
            animation: 'homePromptIn 0.3s ease both',
          }}
        >
          <button
            type="button"
            onClick={() => { hidePrompt(); openQueswaAndFocus() }}
            aria-label="Abrir Queswa"
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
            onClick={dismissPrompt}
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

      <style>{`@keyframes homePromptIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </>
  )
}
