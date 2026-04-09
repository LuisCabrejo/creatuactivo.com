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
import { motion, AnimatePresence } from 'framer-motion'
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
  const [isMenuOpen,    setIsMenuOpen]    = useState(false)

  // Voice state
  const [voiceState,  setVoiceState]  = useState<VoiceState>('idle')
  const [errorMsg,    setErrorMsg]    = useState<string | null>(null)

  // Long press detection
  const longPressTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPress     = useRef(false)
  const pointerIsDown   = useRef(false)

  // Audio/media refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef   = useRef<Blob[]>([])
  const audioRef         = useRef<HTMLAudioElement | null>(null)
  const streamRef        = useRef<MediaStream | null>(null)

  // VAD + reactive bars refs
  const audioContextRef  = useRef<AudioContext | null>(null)
  const analyserRef      = useRef<AnalyserNode | null>(null)
  const animFrameRef     = useRef<number | null>(null)
  const vadTimerRef      = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hadSoundRef      = useRef(false)           // VAD activa solo tras primera voz
  const stopAndSendRef   = useRef<() => void>(() => {})  // ref estable para RAF closure

  // Barras reactivas al audio (6 valores 0.25–1.0)
  const [barHeights,    setBarHeights]    = useState<number[]>([0.45, 0.45, 0.45, 0.45, 0.45, 0.45])
  // Transcripción del usuario (post-procesamiento Whisper)
  const [liveTranscript, setLiveTranscript] = useState('')

  // ─── Cookie banner visible — eleva el orbe para evitar solapamiento ──────────
  const [cookieBannerVisible, setCookieBannerVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    return !localStorage.getItem('cookie_consent')
  })
  useEffect(() => {
    const handler = () => {
      setCookieBannerVisible(!localStorage.getItem('cookie_consent'))
    }
    window.addEventListener('storage', handler)
    // Polling corto por si el banner se cierra desde el mismo tab
    const interval = setInterval(handler, 500)
    setTimeout(() => clearInterval(interval), 30_000) // para tras 30s
    return () => { window.removeEventListener('storage', handler); clearInterval(interval) }
  }, [])

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

  // Auto-cerrar el chat al navegar entre páginas + resetear estado de voz
  useEffect(() => {
    setIsOpen(false)
    setVoiceState('idle')
    setLiveTranscript('')
    if (animFrameRef.current)  { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null }
    if (vadTimerRef.current)   { clearTimeout(vadTimerRef.current);          vadTimerRef.current  = null }
    audioContextRef.current?.close().catch(() => {})
    audioContextRef.current = null
    analyserRef.current     = null
    mediaRecorderRef.current?.state !== 'inactive' && mediaRecorderRef.current?.stop()
    streamRef.current?.getTracks().forEach(t => t.stop())
    audioRef.current?.pause()
  }, [pathname])

  // Ocultar orbe cuando el menú mobile está abierto
  useEffect(() => {
    const onOpen  = () => setIsMenuOpen(true)
    const onClose = () => setIsMenuOpen(false)
    window.addEventListener('mobile-menu-open',  onOpen)
    window.addEventListener('mobile-menu-close', onClose)
    return () => {
      window.removeEventListener('mobile-menu-open',  onOpen)
      window.removeEventListener('mobile-menu-close', onClose)
    }
  }, [])

  // Botón atrás del navegador cierra el chat en lugar de salir del sitio
  useEffect(() => {
    if (!isOpen) return
    history.pushState({ queswaOpen: true }, '')
    const onPopState = () => {
      setIsOpen(false)
      setVoiceState('idle')
      mediaRecorderRef.current?.state !== 'inactive' && mediaRecorderRef.current?.stop()
      streamRef.current?.getTracks().forEach(t => t.stop())
      audioRef.current?.pause()
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [isOpen])

  // Cleanup audio/stream al desmontar
  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    audioRef.current?.pause()
  }, [])

  // ─── Motor de voz ────────────────────────────────────────────────────────────

  // Análisis de audio: VAD + barras reactivas
  const startAudioAnalysis = useCallback((stream: MediaStream) => {
    try {
      const ctx      = new AudioContext()
      const analyser = ctx.createAnalyser()
      analyser.fftSize        = 256
      analyser.smoothingTimeConstant = 0.7
      const source   = ctx.createMediaStreamSource(stream)
      source.connect(analyser)
      audioContextRef.current = ctx
      analyserRef.current     = analyser

      const bins      = analyser.frequencyBinCount // 128
      const dataArray = new Uint8Array(bins)

      // VAD: umbrales
      const SILENCE_THRESHOLD = 12   // 0-255; debajo = silencio
      const SILENCE_HOLD_MS   = 900  // ms de silencio sostenido → auto-stop
      const MIN_RECORD_MS     = 800  // no activar VAD antes de este tiempo
      hadSoundRef.current     = false
      const recordStart       = Date.now()

      const loop = () => {
        if (!analyserRef.current) return
        analyser.getByteFrequencyData(dataArray)

        // ── Barras reactivas (6 bandas de frecuencia) ─────────────────────────
        const step = Math.floor(bins / 6)
        const heights = Array.from({ length: 6 }, (_, i) => {
          const slice = dataArray.slice(i * step, (i + 1) * step)
          const avg   = Array.from(slice).reduce((a, b) => a + b, 0) / slice.length
          return Math.max(0.25, Math.min(1.0, 0.25 + (avg / 200) * 0.75))
        })
        setBarHeights(heights)

        // ── VAD silencio ──────────────────────────────────────────────────────
        const overall = Array.from(dataArray).reduce((a, b) => a + b, 0) / dataArray.length
        if (overall > 25) hadSoundRef.current = true  // primera voz detectada

        const elapsed = Date.now() - recordStart
        if (hadSoundRef.current && elapsed > MIN_RECORD_MS) {
          if (overall < SILENCE_THRESHOLD) {
            if (!vadTimerRef.current) {
              vadTimerRef.current = setTimeout(() => {
                // Auto-stop por silencio sostenido
                if (mediaRecorderRef.current?.state === 'recording') {
                  navigator.vibrate?.([30, 50, 30])
                  stopAndSendRef.current()
                }
              }, SILENCE_HOLD_MS)
            }
          } else {
            // Voz detectada: cancelar timer de silencio
            if (vadTimerRef.current) {
              clearTimeout(vadTimerRef.current)
              vadTimerRef.current = null
            }
          }
        }

        animFrameRef.current = requestAnimationFrame(loop)
      }
      animFrameRef.current = requestAnimationFrame(loop)
    } catch {
      // AudioContext no soportado — sin VAD ni barras reactivas, flujo normal
    }
  }, [])

  const stopAudioAnalysis = useCallback(() => {
    if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null }
    if (vadTimerRef.current)  { clearTimeout(vadTimerRef.current);          vadTimerRef.current  = null }
    audioContextRef.current?.close().catch(() => {})
    audioContextRef.current = null
    analyserRef.current     = null
    hadSoundRef.current     = false
    setBarHeights([0.45, 0.45, 0.45, 0.45, 0.45, 0.45])
  }, [])

  const startRecording = useCallback(async () => {
    setShowTooltip(false)
    setHasInteracted(true)
    setErrorMsg(null)
    setLiveTranscript('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current      = stream
      audioChunksRef.current = []
      const mr = new MediaRecorder(stream, { mimeType: getSupportedMimeType() })
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
      mr.start(250)
      mediaRecorderRef.current = mr
      setVoiceState('recording')
      startAudioAnalysis(stream)                          // VAD + barras reactivas
    } catch {
      setErrorMsg('Sin acceso al micrófono')
      setVoiceState('error')
      setTimeout(() => setVoiceState('idle'), 3000)
    }
  }, [startAudioAnalysis])

  const stopAndSend = useCallback(async () => {
    const mr = mediaRecorderRef.current
    if (!mr || mr.state === 'inactive') return
    stopAudioAnalysis()                                   // detener VAD + barras
    setVoiceState('processing')
    await new Promise<void>(resolve => { mr.onstop = () => resolve(); mr.stop() })
    streamRef.current?.getTracks().forEach(t => t.stop())

    const mimeType = getSupportedMimeType()
    const blob     = new Blob(audioChunksRef.current, { type: mimeType })
    if (blob.size < 1000) { setVoiceState('idle'); return }

    try {
      const fd = new FormData()
      fd.append('audio', blob, `voice.${mimeType.split('/')[1]?.split(';')[0] ?? 'webm'}`)
      const res = await fetch('/api/voice-command', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Error del servidor')

      // Leer transcripción y respuesta de texto de los headers
      const rawTranscript = res.headers.get('x-transcript')
      const rawReply      = res.headers.get('x-reply')
      const transcript    = rawTranscript ? decodeURIComponent(rawTranscript) : ''
      const reply         = rawReply      ? decodeURIComponent(rawReply)      : ''
      if (transcript) setLiveTranscript(transcript)

      // Inyectar intercambio de voz en el historial del chat
      if (transcript || reply) {
        window.dispatchEvent(new CustomEvent('queswa-voice-exchange', {
          detail: { transcript, reply }
        }))
      }

      const audioBlob = await res.blob()
      setVoiceState('speaking')
      navigator.vibrate?.([20, 30, 20, 30, 40])          // háptico ascendente: respuesta lista
      const url   = URL.createObjectURL(audioBlob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => {
        setVoiceState('idle')
        setLiveTranscript('')
        URL.revokeObjectURL(url)
      }
      audio.onerror = () => {
        setVoiceState('idle')
        setLiveTranscript('')
        URL.revokeObjectURL(url)
      }
      audio.play().catch(() => setVoiceState('idle'))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error de conexión'
      setErrorMsg(msg)
      setLiveTranscript('')
      setVoiceState('error')
      setTimeout(() => setVoiceState('idle'), 3000)
    }
  }, [stopAudioAnalysis])

  // Ref estable para que el RAF loop pueda llamar stopAndSend sin closure stale
  useEffect(() => { stopAndSendRef.current = stopAndSend }, [stopAndSend])

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
    } else if (voiceState === 'idle') {
      // Toque corto → abrir/cerrar chat (solo si voz está inactiva)
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
    ? `2px solid ${C.error}`
    : isRecording
      ? `2px solid ${C.goldBorder}`
      : `2px solid rgba(212,175,55,0.5)`  // idle: ring dorado sutil, siempre visible

  // Idle = oscuro (pasivo). Grabando = dorado (activo inequívoco).
  const orbBg = isError
    ? C.errorDim
    : isRecording
      ? C.gold                   // GRABANDO: dorado brillante = señal de acción
      : '#0F1115'                // IDLE / procesando / hablando: oscuro = calma

  const orbShadow = isRecording
    ? `0 0 0 8px ${C.goldGlow}, 0 0 0 16px rgba(212,175,55,0.08), 0 8px 32px rgba(0,0,0,0.5)`
    : isSpeaking
      ? `0 0 0 6px rgba(212,175,55,0.12), 0 8px 32px rgba(0,0,0,0.5)`
      : `0 4px 16px rgba(0,0,0,0.55)`  // idle: sombra mínima, sin glow dorado permanente

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
    if (isRecording) {
      // Barras reactivas al audio real (oscuras sobre fondo dorado)
      const maxH = 18
      const bars = barHeights.map((h, i) => {
        const px  = Math.round(h * maxH)
        const y   = Math.round((maxH - px) / 2) + 3
        const x   = 1 + i * 4
        return <rect key={i} x={x} y={y} width="2" height={px} rx="1" />
      })
      return <svg width="22" height="22" viewBox="0 0 24 24" fill="#0F1115">{bars}</svg>
    }
    if (isError) return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.error} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    )
    // Estado idle — barras de voz animadas (CSS, decorativas) — doradas sobre fondo oscuro
    return (
      <svg className="qw-orb-bars" width="22" height="22" viewBox="0 0 24 24" fill={C.gold}>
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
  // Ocultar mientras el menú mobile está abierto
  if (isMenuOpen) return null

  return (
    <>
      {/* ── Tooltip "Concierge" ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showTooltip && !isOpen && pathname !== '/servilleta' && (
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
              maxWidth: 220,
              pointerEvents: 'none',
            }}
          >
            <p style={{ fontSize: 13, color: '#FFFFFF', margin: 0, lineHeight: 1.5, fontFamily: 'monospace', fontWeight: 600 }}>
              ¿Construimos tu Patrimonio Paralelo?
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Microcopy contextual + transcripción (cuando chat cerrado) ────────── */}
      <AnimatePresence>
        {!isOpen && (isVoiceActive || isError || liveTranscript) && (
          <motion.div
            key="voice-microcopy"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 16px) + 68px)',
              right: '1rem',
              zIndex: 201,
              pointerEvents: 'none',
              textAlign: 'right',
              maxWidth: 200,
            }}
          >
            {/* Label de estado */}
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
              color: isError ? C.error : C.gold,
              marginBottom: liveTranscript ? 4 : 0,
            }}>
              {isRecording   && <span>Escuchando<span className="qw-dots">...</span></span>}
              {isProcessing  && 'Procesando...'}
              {isSpeaking    && 'Respondiendo'}
              {isError       && (errorMsg || 'No te escuché — intenta de nuevo')}
            </div>

            {/* Transcripción Whisper (aparece durante speaking) */}
            {liveTranscript && (
              <div style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'monospace',
                lineHeight: 1.4,
                maxWidth: 190,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                "{liveTranscript}"
              </div>
            )}
          </motion.div>
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
        initial={{ y: 80, opacity: 0 }}
        animate={!isOpen ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
        whileHover={voiceState === 'idle' ? { scale: 1.08 } : {}}
        whileTap={voiceState === 'idle' ? { scale: 0.94 } : {}}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        style={{
          position: 'fixed',
          bottom: isOpen
            ? 'calc(5rem + env(safe-area-inset-bottom, 24px))'
            : cookieBannerVisible
              ? 'calc(1.5rem + env(safe-area-inset-bottom, 16px) + 72px)'
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
          pointerEvents: !isOpen ? 'auto' : 'none',
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

      {/* ── Panel de chat — siempre montado, show/hide con CSS para preservar historial ── */}
      <NEXUSWidget
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setVoiceState('idle')
          setLiveTranscript('')
          stopAudioAnalysis()
          if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop()
          streamRef.current?.getTracks().forEach(t => t.stop())
          audioRef.current?.pause()
          window.dispatchEvent(new CustomEvent('close-queswa'))
        }}
        voiceState={voiceState}
        onStartVoice={startRecording}
        onStopVoice={stopAndSend}
      />

      {/* ── CSS keyframes ────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes orbPulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(212,175,55,0.18), 0 0 0 8px rgba(212,175,55,0.08); }
          50%       { box-shadow: 0 0 0 10px rgba(212,175,55,0.22), 0 0 0 20px rgba(212,175,55,0.08); }
        }
        @keyframes orbBreath {
          0%, 100% { box-shadow: 0 4px 16px rgba(0,0,0,0.55), 0 0 0 0px rgba(212,175,55,0); }
          50%       { box-shadow: 0 4px 16px rgba(0,0,0,0.55), 0 0 0 7px rgba(212,175,55,0.09), 0 0 22px rgba(212,175,55,0.13); }
        }
        /* Idle: solo pulso de opacidad — sin scale, sin movimiento → no parece "activo" */
        @keyframes qwBar {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.65; }
        }
        .qw-orb-bars .qb1 { animation: qwBar 3.2s ease-in-out infinite 0.00s; }
        .qw-orb-bars .qb2 { animation: qwBar 3.6s ease-in-out infinite 0.50s; }
        .qw-orb-bars .qb3 { animation: qwBar 3.0s ease-in-out infinite 1.00s; }
        .qw-orb-bars .qb4 { animation: qwBar 3.8s ease-in-out infinite 0.25s; }
        .qw-orb-bars .qb5 { animation: qwBar 3.4s ease-in-out infinite 0.75s; }
        .qw-orb-bars .qb6 { animation: qwBar 3.2s ease-in-out infinite 0.40s; }
        /* Puntos animados para "Escuchando..." */
        @keyframes qwDots { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }
        .qw-dots { animation: qwDots 1.1s ease-in-out infinite; }
      `}</style>
    </>
  )
}
