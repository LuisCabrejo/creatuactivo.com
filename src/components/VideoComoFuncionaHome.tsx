'use client'
/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * El video «Cómo funciona» en el hero de la Home (Director, 1 oct 2026).
 *
 * Es el mismo corte que Queswa manda en WhatsApp al tocar «Cómo funciona»
 * (VIDEO_COMO_FUNCIONA_WA, 60 s, 720×1280): la web y el canal cuentan lo mismo,
 * con la misma voz. Responde la pregunta del 70 % —¿cómo funciona?— y trae los
 * subtítulos quemados, así que se entiende aun sin sonido.
 *
 * ⚠️ NO arranca solo, a propósito. Pesa 10,7 MB y buena parte de quien llega
 * navega con datos del celular: hasta que la persona toca, solo se carga la
 * portada (una imagen optimizada). Al tocar, el video se monta, suena con voz y
 * trae controles. El componente anterior (HomeManifestoVideo) arrancaba en
 * silencio y descargaba el video a todo el que entraba.
 *
 * La portada es el cuadro del segundo 13,8: el cubo con la esfera dorada, sin
 * subtítulo encima (public/images/home/como-funciona-portada.jpg). Si el video
 * se vuelve a cortar, se vuelve a sacar la portada del corte nuevo.
 */
import Image from 'next/image'
import { useState } from 'react'
import { Play } from 'lucide-react'
import { VIDEO_COMO_FUNCIONA_WA } from '@/lib/reels'
import { marcarVioComoFunciona } from '@/lib/orbe-config'

export default function VideoComoFuncionaHome() {
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
          src={VIDEO_COMO_FUNCIONA_WA}
          autoPlay
          controls
          playsInline
          // Al 80 % cuenta como visto (1 oct 2026): el botón del hero y el orbe le
          // avisan a Queswa con «Ya vi el video de cómo funciona.» y no se lo repite.
          onTimeUpdate={(e) => {
            const v = e.currentTarget
            if (v.duration && v.currentTime / v.duration >= 0.8) marcarVioComoFunciona()
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setReproduciendo(true)}
          aria-label="Reproducir el video «Cómo funciona», 60 segundos"
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
          {/* priority: la portada NO es decorativa — es el contenido principal del
              hero y, por su tamaño, el elemento más grande de la primera pantalla. */}
          <Image
            src="/images/home/como-funciona-portada.jpg"
            alt=""
            fill
            priority
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
            Cómo funciona · 60 segundos
          </span>
        </button>
      )}
    </div>
  )
}
