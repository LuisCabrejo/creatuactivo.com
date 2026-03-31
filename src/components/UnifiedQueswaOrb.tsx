'use client'

/**
 * UnifiedQueswaOrb — Orbe Unificado Queswa (UI/UX FASE 2)
 *
 * Fusiona NEXUSFloatingButton (chat) + VoiceCommandButton (voz) en un único
 * componente de cristal líquido, esquina inferior derecha.
 *
 * Mecánica dual:
 *   Toque corto  → abre panel de chat de texto (NEXUSWidget)
 *   Long press   → activa grabación de voz (Whisper → Claude → ElevenLabs)
 *
 * Motor cinético:
 *   Scroll down  → orbe se oculta (traslación Y + opacidad 0)
 *   Scroll up    → orbe reaparece con física de resorte (spring)
 *
 * Háptica:
 *   Long press detectado → navigator.vibrate(50)
 *   Grabación terminada  → navigator.vibrate(30)
 */

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import NEXUSWidget from './nexus/NEXUSWidget'

// ─── Paleta Quiet Luxury ──────────────────────────────────────────────────────
const C = {
  gold:        '#D4AF37',
  goldDim:     'rgba(212,175,55,0.18)',
  goldBorder:  'rgba(212,175,55,0.45)',
  goldGlow:    'rgba(212,175,55,0.25)',
  carbon:      '#0F1115',
  titanium:    '#94A3B8',
  error:       '#ef4444',
  errorDim:    'rgba(239,68,68,0.15)',
  cyan:        '#38BDF8',
} as const

// ─── MIME type helper ─────────────────────────────────────────────────────────
function getSupportedMimeType(): string {
  const candidates = [
    'audio/webm;codecs=opus', 'audio/webm',
    'audio/ogg;codecs=opus',  'audio/ogg', 'audio/mp4',
  ]
  for (const t of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) return t
  }
  return 'audio/webm'
}

// ─── Tipos ───────────────────────────────────────────────────────────────────
type VoiceState = 'idle' | 'recording' | 'processing' | 'speaking' | 'error'

const LONG_PRESS_MS = 300

// ─── Componente principal ─────────────────────────────────────────────────────
export default function UnifiedQueswaOrb() {
  const pathname  = usePathname()

  // Chat state
  const [isOpen,        setIsOpen]        = useState(false)
  const [showTooltip,   setShowTooltip]   = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Voice state
  const [voiceState,  setVoiceState]  = useState<VoiceState>('idle')
  const [errorMsg,    setErrorMsg]    = useState<string | null>(null)

  // Scroll-based visibility
  const [orbVisible, setOrbVisible] = useState(true)
  const prevScrollY = useRef(0)
  const { scrollY }  = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const delta = latest - prevScrollY.current
    if (delta > 12)       setOrbVisible(false)
    else if (delta < -12) setOrbVisible(true)
    prevScrollY.current = latest
  })

  // Long press detection
  const longPressTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPress     = useRef(false)
  const pointerIsDown   = useRef(false)

  // Audio/media refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef   = useRef<Blob[]>([])
  const audioRef         = useRef<HTMLAudioElement | null>(null)
  const streamRef        = useRef<MediaStream | null>(null)

  // ─── Tracking (preservado de NEXUSFloatingButton) ───────────────────────────
  const [trackingReady, setTrackingReady] = useState(true)

  useEffect(() => {
    const checkReady = () =>
      !!(window.FrameworkIAA?.fingerprint && window.updateProspectData)

    if (checkReady()) return

    const handler = (e: CustomEvent) => {
      if (e.detail?.fingerprint || e.detail?.prospect) setTrackingReady(true)
    }
    window.addEventListener('nexusTrackingReady', handler as EventListener)

    let retries = 0
    const poll = () => {
      if (!checkReady() && retries < 10) { retries++; setTimeout(poll, 500) }
    }
    poll()
    return () => window.removeEventListener('nexusTrackingReady', handler as EventListener)
  }, [])

  // ─── Tooltip "Concierge" (una sola vez) ─────────────────────────────────────
  useEffect(() => {
    if (hasInteracted || isOpen) return
    const show = setTimeout(() => {
      if (hasInteracted || isOpen) return
      setShowTooltip(true)
      setTimeout(() => { setShowTooltip(false); setHasInteracted(true) }, 12000)
    }, 2000)
    return () => clearTimeout(show)
  }, [hasInteracted, isOpen])

  // ─── Visibilidad en /servilleta (solo card-1 slide-2) ───────────────────────
  const [visibleInServilleta, setVisibleInServilleta] = useState(false)
  useEffect(() => {
    if (pathname !== '/servilleta') return
    const show = () => setVisibleInServilleta(true)
    const hide = () => { setVisibleInServilleta(false); setIsOpen(false) }
    window.addEventListener('show-queswa-orb', show)
    window.addEventListener('hide-queswa-orb', hide)
    return () => {
      window.removeEventListener('show-queswa-orb', show)
      window.removeEventListener('hide-queswa-orb', hide)
    }
  }, [pathname])

  // ─── Eventos globales (open-queswa, close-queswa, toggle-queswa) ─────────────
  useEffect(() => {
    const handleOpen   = () => { setIsOpen(true) }
    const handleToggle = () => setIsOpen(p => !p)
    window.addEventListener('open-queswa',   handleOpen)
    window.addEventListener('toggle-queswa', handleToggle)
    return () => {
      window.removeEventListener('open-queswa',   handleOpen)
      window.removeEventListener('toggle-queswa', handleToggle)
    }
  }, [])

  // Fullscreen en /servilleta cierra el orbe
  useEffect(() => {
    if (pathname !== '/servilleta') return
    const onFs = () => {
      if (document.fullscreenElement) {
        setIsOpen(false)
        window.dispatchEvent(new CustomEvent('close-queswa'))
      }
    }
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [pathname])

  // Cleanup audio/stream al desmontar
  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    audioRef.current?.pause()
  }, [])

  // ─── Motor de voz ────────────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    setShowTooltip(false)
    setHasInteracted(true)
    setErrorMsg(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current  = stream
      audioChunksRef.current = []
      const mr = new MediaRecorder(stream, { mimeType: getSupportedMimeType() })
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
      mr.start(250)
      mediaRecorderRef.current = mr
      setVoiceState('recording')
    } catch {
      setErrorMsg('Sin acceso al micrófono')
      setVoiceState('error')
      setTimeout(() => setVoiceState('idle'), 3000)
    }
  }, [])

  const stopAndSend = useCallback(async () => {
    const mr = mediaRecorderRef.current
    if (!mr || mr.state === 'inactive') return
    setVoiceState('processing')
    await new Promise<void>(resolve => { mr.onstop = () => resolve(); mr.stop() })
    streamRef.current?.getTracks().forEach(t => t.stop())

    const mimeType = getSupportedMimeType()
    const blob = new Blob(audioChunksRef.current, { type: mimeType })
    if (blob.size < 1000) { setVoiceState('idle'); return }

    try {
      const fd = new FormData()
      fd.append('audio', blob, `voice.${mimeType.split('/')[1]?.split(';')[0] ?? 'webm'}`)
      const res = await fetch('/api/voice-command', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Error del servidor')

      const audioBlob = await res.blob()
      setVoiceState('speaking')
      const url   = URL.createObjectURL(audioBlob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => { setVoiceState('idle'); URL.revokeObjectURL(url) }
      audio.onerror = () => { setVoiceState('idle'); URL.revokeObjectURL(url) }
      audio.play().catch(() => setVoiceState('idle'))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error de conexión'
      setErrorMsg(msg)
      setVoiceState('error')
      setTimeout(() => setVoiceState('idle'), 3000)
    }
  }, [])

  // ─── Mecánica dual: pointer events ───────────────────────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    if (voiceState !== 'idle') return
    pointerIsDown.current  = true
    isLongPress.current    = false

    longPressTimer.current = setTimeout(() => {
      if (!pointerIsDown.current) return
      isLongPress.current = true
      navigator.vibrate?.(50)
      startRecording()
    }, LONG_PRESS_MS)
  }, [voiceState, startRecording])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    pointerIsDown.current = false
    clearTimeout(longPressTimer.current!)

    if (isLongPress.current) {
      // Long press → detener grabación
      if (voiceState === 'recording') {
        navigator.vibrate?.(30)
        stopAndSend()
      }
    } else {
      // Toque corto → abrir/cerrar chat
      setHasInteracted(true)
      setShowTooltip(false)
      setIsOpen(prev => !prev)
    }
  }, [voiceState, stopAndSend])

  // ─── Derivar apariencia visual del orbe ──────────────────────────────────────
  const isRecording  = voiceState === 'recording'
  const isProcessing = voiceState === 'processing'
  const isSpeaking   = voiceState === 'speaking'
  const isError      = voiceState === 'error'
  const isVoiceActive = isRecording || isProcessing || isSpeaking

  const orbBorder = isError
    ? `1px solid ${C.error}`
    : isVoiceActive
      ? `1.5px solid ${C.goldBorder}`
      : isOpen
        ? `1px solid rgba(212,175,55,0.35)`
        : `1px solid rgba(255,255,255,0.20)`

  const orbBg = isError
    ? C.errorDim
    : isRecording
      ? C.goldDim
      : 'rgba(15, 17, 21, 0.72)'

  const orbShadow = isRecording
    ? `0 0 0 8px ${C.goldGlow}, 0 0 0 16px rgba(212,175,55,0.08), 0 8px 32px rgba(0,0,0,0.5)`
    : isSpeaking
      ? `0 0 0 6px rgba(212,175,55,0.12), 0 8px 32px rgba(0,0,0,0.5)`
      : `0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)`

  // ─── Icono central del orbe ───────────────────────────────────────────────────
  function OrbIcon() {
    if (isProcessing) return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
          <animateTransform attributeName="transform" type="rotate" dur="1s" from="0 12 12" to="360 12 12" repeatCount="indefinite"/>
        </path>
      </svg>
    )
    if (isSpeaking) return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round">
        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      </svg>
    )
    if (isRecording) return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8"  y1="23" x2="16" y2="23"/>
      </svg>
    )
    if (isError) return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.error} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    )
    if (isOpen) return (
      // Chat abierto → micrófono. Long press activa voz mientras el usuario lee.
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8"  y1="23" x2="16" y2="23"/>
      </svg>
    )
    // Estado idle — barras de voz animadas (equalizer)
    return (
      <svg className="qw-orb-bars" width="22" height="22" viewBox="0 0 24 24" fill="#D4AF37">
        <rect className="qb1" x="1"  y="10" width="2" height="4"  rx="1"/>
        <rect className="qb2" x="5"  y="6"  width="2" height="12" rx="1"/>
        <rect className="qb3" x="9"  y="3"  width="2" height="18" rx="1"/>
        <rect className="qb4" x="13" y="7"  width="2" height="10" rx="1"/>
        <rect className="qb5" x="17" y="4"  width="2" height="16" rx="1"/>
        <rect className="qb6" x="21" y="10" width="2" height="4"  rx="1"/>
      </svg>
    )
  }

  // En /servilleta solo visible cuando card-1 de slide-2 está activa
  if (pathname === '/servilleta' && !visibleInServilleta) return null

  return (
    <>
      {/* ── Tooltip "Concierge" ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showTooltip && !isOpen && orbVisible && pathname !== '/servilleta' && (
          <motion.div
            initial={{ opacity: 0, y: 8, x: 8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 16px) + 64px)',
              right: '1rem',
              zIndex: 199,
              background: 'rgba(8,9,12,0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(212,175,55,0.55)',
              boxShadow: '0 0 12px rgba(212,175,55,0.15), 0 4px 16px rgba(0,0,0,0.6)',
              borderRadius: 6,
              padding: '10px 16px',
              maxWidth: 210,
              pointerEvents: 'none',
            }}
          >
            <p style={{ fontSize: 12, color: '#FFFFFF', margin: 0, lineHeight: 1.5, fontFamily: 'monospace', fontWeight: 600 }}>
              ¿Iniciamos tu Auditoría?
            </p>
            <p style={{ fontSize: 10, color: C.gold, margin: '4px 0 0', fontFamily: 'monospace', opacity: 0.85 }}>
              Toca · Mantén para hablar
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Estado de voz (label flotante sobre el orbe) ─────────────────────── */}
      <AnimatePresence>
        {isVoiceActive && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: isOpen
                ? 'calc(5rem + env(safe-area-inset-bottom, 24px) + 64px)'
                : 'calc(1.5rem + env(safe-area-inset-bottom, 16px) + 64px)',
              right: '1rem',
              zIndex: 201,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: isError ? C.error : C.gold,
              fontFamily: 'monospace',
              textAlign: 'right',
              pointerEvents: 'none',
            }}
          >
            {isRecording ? 'GRABANDO' : isProcessing ? 'PROCESANDO' : isSpeaking ? 'ESCUCHA' : ''}
          </motion.span>
        )}
      </AnimatePresence>

      {/* ── Orbe principal ───────────────────────────────────────────────────── */}
      <motion.button
        data-nexus-button
        aria-label="Abrir asistente Queswa"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={isRecording ? handlePointerUp : undefined}
        disabled={isProcessing || isSpeaking}
        animate={(orbVisible || isOpen) ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
        transition={
          orbVisible
            ? { type: 'spring', damping: 20, stiffness: 260 }
            : { duration: 0.22, ease: 'easeIn' }
        }
        style={{
          position: 'fixed',
          bottom: isOpen
            ? 'calc(5rem + env(safe-area-inset-bottom, 24px))'
            : 'calc(1.5rem + env(safe-area-inset-bottom, 16px))',
          right: '1rem',
          zIndex: 200,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: orbBorder,
          background: orbBg,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: orbShadow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: (isProcessing || isSpeaking) ? 'default' : 'pointer',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
          touchAction: 'none',
          animation: isRecording
          ? 'orbPulse 1.2s ease-in-out infinite'
          : (!isVoiceActive && !isOpen)
            ? 'orbBreath 3s ease-in-out infinite'
            : 'none',
        }}
      >
        <OrbIcon />
      </motion.button>

      {/* ── Panel de chat de texto ───────────────────────────────────────────── */}
      {isOpen && (
        <NEXUSWidget
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false)
            window.dispatchEvent(new CustomEvent('close-queswa'))
          }}
        />
      )}

      {/* ── CSS keyframes ────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes orbPulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(212,175,55,0.18), 0 0 0 8px rgba(212,175,55,0.08); }
          50%       { box-shadow: 0 0 0 10px rgba(212,175,55,0.22), 0 0 0 20px rgba(212,175,55,0.08); }
        }
        @keyframes orbBreath {
          0%, 100% { transform: scale(1);    box-shadow: 0 0 0 0px rgba(212,175,55,0), 0 8px 32px rgba(0,0,0,0.5); }
          50%       { transform: scale(1.06); box-shadow: 0 0 0 6px rgba(212,175,55,0.12), 0 0 20px rgba(212,175,55,0.18), 0 8px 32px rgba(0,0,0,0.5); }
        }
        @keyframes qwBar {
          0%, 100% { transform: scaleY(0.3); opacity: 0.45; }
          50%       { transform: scaleY(1);   opacity: 1;    }
        }
        .qw-orb-bars .qb1 { animation: qwBar 1.25s ease-in-out infinite 0.00s; transform-origin: center; transform-box: fill-box; }
        .qw-orb-bars .qb2 { animation: qwBar 1.25s ease-in-out infinite 0.20s; transform-origin: center; transform-box: fill-box; }
        .qw-orb-bars .qb3 { animation: qwBar 1.25s ease-in-out infinite 0.40s; transform-origin: center; transform-box: fill-box; }
        .qw-orb-bars .qb4 { animation: qwBar 1.25s ease-in-out infinite 0.28s; transform-origin: center; transform-box: fill-box; }
        .qw-orb-bars .qb5 { animation: qwBar 1.25s ease-in-out infinite 0.14s; transform-origin: center; transform-box: fill-box; }
        .qw-orb-bars .qb6 { animation: qwBar 1.25s ease-in-out infinite 0.42s; transform-origin: center; transform-box: fill-box; }
      `}</style>
    </>
  )
}
