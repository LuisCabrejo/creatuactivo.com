'use client'
/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Un video de Queswa en la Home: el mismo corte que Queswa manda en WhatsApp,
 * con la portada y el botón de reproducir. Lo usan el hero («Cómo funciona»,
 * VideoComoFuncionaHome) y la sección «De dónde sale el dinero» («Cómo entra el
 * dinero», 27 nov 2026, Director).
 *
 * ⚠️ NO arranca solo, a propósito. Cada video pesa 8–11 MB y buena parte de
 * quien llega navega con datos del celular: hasta que la persona toca, solo se
 * carga la portada (una imagen optimizada). Al tocar, el video se monta, suena
 * con voz y trae controles.
 *
 * La portada es un cuadro del video sin subtítulo encima. Si el video se vuelve a
 * cortar, se saca la portada del corte nuevo, con nombre nuevo (el service worker
 * guarda los estáticos).
 */
import Image from 'next/image'
import { useState } from 'react'
import { Play } from 'lucide-react'
import { marcarVideoVisto, type VideoVisto } from '@/lib/orbe-config'
import { conversaPorWhatsApp, dispositivoDelNavegador } from '@/lib/dispositivo'

/**
 * En el COMPUTADOR, al terminar el video se abre el chat de Queswa con el cursor
 * listo (13 oct 2026, Director: el diseño con que empezó la Home). Solo si el video
 * sigue a la vista: a quien ya bajó a leer no se le abre nada encima.
 * En el celular no: ahí Queswa vive en WhatsApp, y saltar de app sin que la
 * persona toque nada sería un secuestro (y el navegador lo bloquearía).
 */
function abrirQueswaAlTerminar(video: HTMLVideoElement) {
  if (conversaPorWhatsApp(dispositivoDelNavegador())) return
  const r = video.getBoundingClientRect()
  const aLaVista = r.bottom > 0 && r.top < window.innerHeight
  if (!aLaVista) return
  window.dispatchEvent(new CustomEvent('open-queswa', { detail: { origen: 'video', enfocar: true } }))
}

export default function VideoHome({
  id,
  src,
  portada,
  rotulo,
  etiqueta,
  prioridad = false,
}: {
  /** Al 80 % cuenta como visto: el chat no le vuelve a ofrecer ese video. */
  id: VideoVisto
  src: string
  portada: string
  /** Lo que se lee sobre la portada, p. ej. «Cómo funciona · 60 segundos». */
  rotulo: string
  /** Para lectores de pantalla. */
  etiqueta: string
  /** Solo el del hero: ahí la portada es el elemento más grande de la primera pantalla. */
  prioridad?: boolean
}) {
  const [reproduciendo, setReproduciendo] = useState(false)

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 360,
        aspectRatio: '9 / 16',
        borderRadius: 'var(--radius-container)',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'var(--color-bg-primary)',
      }}
    >
      {reproduciendo ? (
        <video
          src={src}
          autoPlay
          controls
          playsInline
          onTimeUpdate={(e) => {
            const v = e.currentTarget
            if (v.duration && v.currentTime / v.duration >= 0.8) marcarVideoVisto(id)
          }}
          onEnded={(e) => abrirQueswaAlTerminar(e.currentTarget)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setReproduciendo(true)}
          aria-label={etiqueta}
          className="group"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            padding: 0,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          <Image
            src={portada}
            alt=""
            fill
            priority={prioridad}
            sizes="(max-width: 1023px) 90vw, 360px"
            style={{ objectFit: 'cover' }}
          />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15,17,21,0.85) 0%, rgba(15,17,21,0) 38%)',
            }}
          />
          <span
            aria-hidden="true"
            className="transition-colors duration-200 group-hover:border-[color:var(--color-brand)]"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 72,
              height: 72,
              borderRadius: '50%',
              border: '1.5px solid rgba(197,160,89,0.7)',
              background: 'rgba(15,17,21,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Play size={28} fill="var(--color-brand)" color="var(--color-brand)" style={{ marginLeft: 4 }} />
          </span>
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              // Por encima de la marca de agua «CreaTuActivo.com» del video.
              bottom: 52,
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
            }}
          >
            {rotulo}
          </span>
        </button>
      )}
    </div>
  )
}
