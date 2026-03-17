'use client'

/**
 * VoiceCommandButton — FAB "Mantener para Hablar"
 * Queswa.app — FASE B
 *
 * Diseño Lujo Silencioso: obsidian/gold, sin adornos.
 * Mecánica: onPointerDown graba, onPointerUp envía al backend.
 * Backend pipeline: Whisper → Claude 3.5 Sonnet → ElevenLabs → audio reproduced.
 */

import { useRef, useState, useCallback, useEffect } from 'react'
import { Mic, Loader2, MicOff, Volume2 } from 'lucide-react'

const C = {
  obsidian:    '#0B0C0C',
  carbon:      '#0F1115',
  gold:        '#D4AF37',
  goldDim:     'rgba(212,175,55,0.15)',
  goldBorder:  'rgba(212,175,55,0.35)',
  titanium:    '#94A3B8',
  error:       '#ef4444',
  errorDim:    'rgba(239,68,68,0.15)',
} as const

type State = 'idle' | 'recording' | 'processing' | 'speaking' | 'error'

interface VoiceCommandButtonProps {
  /** Callback opcional: recibe el texto transcrito + respuesta de Claude */
  onResponse?: (transcript: string, reply: string) => void
  /** Posición CSS bottom (default "88px" para dejar espacio al nav bar) */
  bottom?: string
}

export default function VoiceCommandButton({ onResponse, bottom = '88px' }: VoiceCommandButtonProps) {
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef   = useRef<Blob[]>([])
  const audioRef         = useRef<HTMLAudioElement | null>(null)
  const streamRef        = useRef<MediaStream | null>(null)

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
      audioRef.current?.pause()
    }
  }, [])

  const startRecording = useCallback(async () => {
    setErrorMsg(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      audioChunksRef.current = []

      const mr = new MediaRecorder(stream, { mimeType: getSupportedMimeType() })
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
      mr.start(250)
      mediaRecorderRef.current = mr
      setState('recording')
    } catch (err) {
      console.error('❌ [Voice] Microphone error:', err)
      setErrorMsg('Sin acceso al micrófono')
      setState('error')
    }
  }, [])

  const stopAndSend = useCallback(async () => {
    const mr = mediaRecorderRef.current
    if (!mr || mr.state === 'inactive') return

    setState('processing')

    // Esperar el último chunk antes de procesar
    await new Promise<void>(resolve => {
      mr.onstop = () => resolve()
      mr.stop()
    })

    streamRef.current?.getTracks().forEach(t => t.stop())

    const mimeType = getSupportedMimeType()
    const blob = new Blob(audioChunksRef.current, { type: mimeType })

    if (blob.size < 1000) {
      // Grabación demasiado corta — ignorar
      setState('idle')
      return
    }

    try {
      const formData = new FormData()
      formData.append('audio', blob, `voice.${mimeType.split('/')[1]?.split(';')[0] ?? 'webm'}`)

      const res = await fetch('/api/voice-command', { method: 'POST', body: formData })

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Error del servidor' }))
        throw new Error(error ?? 'Error desconocido')
      }

      // El backend devuelve audio/mpeg stream
      const audioBlob = await res.blob()
      const transcript = res.headers.get('x-transcript') ?? ''
      const reply      = res.headers.get('x-reply')      ?? ''

      onResponse?.(transcript, reply)

      // Reproducir respuesta
      setState('speaking')
      const url = URL.createObjectURL(audioBlob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => {
        setState('idle')
        URL.revokeObjectURL(url)
      }
      audio.onerror = () => {
        setState('idle')
        URL.revokeObjectURL(url)
      }
      audio.play().catch(() => setState('idle'))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error de conexión'
      console.error('❌ [Voice] Processing error:', err)
      setErrorMsg(msg)
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }, [onResponse])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    if (state !== 'idle') return
    startRecording()
  }, [state, startRecording])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    if (state !== 'recording') return
    stopAndSend()
  }, [state, stopAndSend])

  // ─── Derivar apariencia por estado ─────────────────────────────────────────
  const isRecording   = state === 'recording'
  const isProcessing  = state === 'processing'
  const isSpeaking    = state === 'speaking'
  const isError       = state === 'error'

  const borderColor = isError
    ? C.error
    : (isRecording || isSpeaking)
      ? C.gold
      : C.goldBorder

  const bgColor = isError
    ? C.errorDim
    : isRecording
      ? C.goldDim
      : C.carbon

  const iconColor = isError ? C.error : isRecording ? C.gold : C.titanium

  function renderIcon() {
    if (isProcessing) return <Loader2 size={22} color={C.gold} style={{ animation: 'spin 1s linear infinite' }} />
    if (isSpeaking)   return <Volume2  size={22} color={C.gold} />
    if (isError)      return <MicOff   size={22} color={C.error} />
    return <Mic size={22} color={iconColor} />
  }

  const label = isRecording  ? 'Grabando...'
    : isProcessing ? 'Procesando...'
    : isSpeaking   ? 'Escucha...'
    : isError      ? (errorMsg ?? 'Error')
    : 'Mantén para hablar'

  return (
    <div
      style={{
        position: 'fixed',
        bottom,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        userSelect: 'none',
        pointerEvents: 'auto',
      }}
    >
      {/* Tooltip de estado */}
      <span style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: isRecording ? C.gold : isError ? C.error : C.titanium,
        opacity: 0.85,
        transition: 'color 0.2s',
      }}>
        {label}
      </span>

      {/* Botón principal */}
      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={state === 'recording' ? handlePointerUp : undefined}
        disabled={isProcessing || isSpeaking}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: `1.5px solid ${borderColor}`,
          background: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: (isProcessing || isSpeaking) ? 'default' : 'pointer',
          transition: 'all 0.2s ease',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          // Pulso cuando graba
          boxShadow: isRecording
            ? `0 0 0 8px rgba(212,175,55,0.12), 0 0 0 16px rgba(212,175,55,0.06)`
            : isSpeaking
              ? `0 0 0 8px rgba(212,175,55,0.08)`
              : '0 2px 12px rgba(0,0,0,0.4)',
          animation: isRecording ? 'voicePulse 1.2s ease-in-out infinite' : 'none',
        }}
      >
        {renderIcon()}
      </button>

      {/* CSS keyframes embebido */}
      <style>{`
        @keyframes voicePulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(212,175,55,0.12), 0 0 0 8px rgba(212,175,55,0.06); }
          50%       { box-shadow: 0 0 0 10px rgba(212,175,55,0.18), 0 0 0 20px rgba(212,175,55,0.08); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

// ─── Utilidad: detectar el primer MIME type soportado ──────────────────────────
function getSupportedMimeType(): string {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
    'audio/mp4',
  ]
  for (const t of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) return t
  }
  return 'audio/webm'
}
