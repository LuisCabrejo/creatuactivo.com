'use client'

/**
 * Copyright © 2026 CreaTuActivo.com
 * Deck keynote — "El activo que sobrevive a su ausencia"
 *
 * Estilo Jobs: una idea por slide, aire, tipografía grande. Branding Bimetálico v3.0.
 * Slides con sub-pasos:
 *   - stepMode 'reveal'  → acumula items (build-in, estilo keynote).
 *   - stepMode 'rotate'  → reemplaza item por item, el título se mantiene (como servilleta slide 2).
 * Restricción del evento: NO se nombra Queswa ni CreaTuActivo.com. Gano Excel sí; la
 * tecnología/formación van en genérico.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

type Step = { kicker?: string; headline: string; sub?: string; list?: string[]; snowball?: boolean; note?: string }

// Simulador "bola de nieve" del Equipo Binario — réplica de la servilleta slide 4.
// El círculo (thumb) crece a medida que sube la organización; el ingreso recurrente
// escala a $4.76/hogar/mes. Interactivo: se puede arrastrar en vivo.
function BinarySnowball({ note }: { note?: string }) {
  const [hogares, setHogares] = useState(200)
  const usd = Math.round(hogares * 4.76)
  const cop = usd * 4500 // tasa fija Gano Excel: $1 USD = $4.500 COP
  const thumb = Math.round(24 + (hogares / 1000) * 40) // 24px → 64px
  const stop = (e: { stopPropagation: () => void }) => e.stopPropagation()
  return (
    <div onClick={stop} onPointerDown={stop} onTouchStart={stop} onTouchEnd={stop}
      style={{ width: 'min(620px, 86vw)', marginTop: 'clamp(8px,2vh,20px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Valor central destacado — USD principal + COP */}
      <div style={{ fontFamily: 'var(--font-serif,Georgia,serif)', fontWeight: 600, fontSize: 'clamp(2.4rem,7vw,4.4rem)', color: 'var(--color-brand,#C5A059)', lineHeight: 1 }}>
        ${usd.toLocaleString('es-CO')} <span style={{ fontSize: '0.3em', color: 'var(--color-titanium,#94A3B8)', fontFamily: 'var(--font-sans,system-ui)', fontWeight: 300 }}>USD / mes</span>
      </div>
      <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 'clamp(0.9rem,2vw,1.35rem)', color: 'var(--color-titanium,#94A3B8)', marginTop: 'clamp(4px,1vh,10px)' }}>
        ${cop.toLocaleString('es-CO')} COP
      </div>
      {/* Hogares — pegado a la barra */}
      <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 'clamp(0.68rem,1.5vw,0.95rem)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-titanium,#94A3B8)', marginTop: 'clamp(22px,4.5vh,44px)', marginBottom: 'clamp(8px,1.6vh,16px)' }}>
        Hogares en su organización: <span style={{ color: 'var(--color-brand,#C5A059)' }}>{hogares}</span>
      </div>
      <input type="range" min={10} max={1000} step={10} value={hogares}
        onChange={(e) => setHogares(parseInt(e.target.value))}
        className="snow-slider" style={{ width: '100%', ['--thumb-size' as string]: `${thumb}px` } as React.CSSProperties} />
      {note && <div style={{ fontFamily: 'var(--font-sans,system-ui)', fontSize: 'clamp(0.85rem,1.8vw,1.15rem)', color: 'var(--color-titanium,#94A3B8)', marginTop: 'clamp(18px,3.5vh,30px)', maxWidth: '42ch', fontWeight: 300, fontStyle: 'italic' }}>{note}</div>}
    </div>
  )
}
type Slide = {
  kicker?: string
  headline: string // admite **palabra** para resaltar en dorado
  sub?: string
  steps?: Step[]
  stepMode?: 'reveal' | 'rotate'
  youtube?: string // id de YouTube — video de fondo que persiste mientras rotan los títulos
  youtubeStart?: number
}

// Slide de pasos: título de sección FIJO + sub-bloque rotativo (key por paso).
// El sub-bloque rota (subtítulo + lista); el video opcional (slide.youtube) va FUERA
// del bloque rotativo → persiste y NO se reinicia al cambiar de paso.
function RotateSlide({ slide, step, k, total }: { slide: Slide; step: Step; k: number; total: number }) {
  const yt = slide.youtube
  const ytSrc = yt
    ? `https://www.youtube.com/embed/${yt}?autoplay=1&mute=1&loop=1&playlist=${yt}&start=${slide.youtubeStart ?? 0}&controls=0&modestbranding=1&rel=0&playsinline=1`
    : ''
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: 'clamp(24px, 7vw, 80px)',
    }}>
      {/* Título de sección FIJO */}
      {slide.kicker && (
        <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 'clamp(0.62rem,1.4vw,0.95rem)', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--color-brand,#C5A059)', marginBottom: 'clamp(12px,2vh,20px)' }}>{slide.kicker}</div>
      )}
      <h2 style={{ fontFamily: 'var(--font-serif,Georgia,serif)', fontWeight: 600, fontSize: 'clamp(1.5rem,4.2vw,3rem)', lineHeight: 1.08, letterSpacing: '-0.015em', margin: 0 }}>{accent(slide.headline)}</h2>

      {/* Sub-bloque rotativo (anima al cambiar de paso) */}
      <div key={k} style={{ marginTop: 'clamp(18px,3.5vh,40px)', animation: 'deckIn 0.42s cubic-bezier(0.22,1,0.36,1) both', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {step.kicker && <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 'clamp(0.6rem,1.3vw,0.85rem)', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--color-brand,#C5A059)', marginBottom: 'clamp(6px,1.2vh,12px)' }}>{step.kicker}</div>}
        <div style={{ fontFamily: 'var(--font-serif,Georgia,serif)', fontWeight: 600, fontSize: 'clamp(1.4rem,4vw,2.4rem)', lineHeight: 1.1, color: (step.list || step.snowball) ? 'var(--color-brand,#C5A059)' : 'var(--color-text-primary,#FFFFFF)' }}>{accent(step.headline)}</div>
        {step.sub && <div style={{ fontFamily: 'var(--font-sans,system-ui)', fontSize: 'clamp(0.92rem,2vw,1.3rem)', color: 'var(--color-titanium,#94A3B8)', marginTop: 'clamp(6px,1.2vh,12px)', fontWeight: 300 }}>{step.sub}</div>}
        {step.list && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px,1.6vh,16px)', marginTop: 'clamp(16px,3vh,28px)' }}>
            {step.list.map((it, d) => (
              <div key={d} style={{ fontFamily: 'var(--font-sans,system-ui)', fontSize: 'clamp(1.05rem,2.6vw,1.7rem)', color: 'var(--color-text-primary,#FFFFFF)', fontWeight: 300 }}>{it}</div>
            ))}
          </div>
        )}
        {step.snowball && <BinarySnowball note={step.note} />}
        {step.note && !step.snowball && (
          <div style={{ fontFamily: 'var(--font-sans,system-ui)', fontSize: 'clamp(0.85rem,1.8vw,1.15rem)', color: 'var(--color-titanium,#94A3B8)', marginTop: 'clamp(14px,2.5vh,24px)', maxWidth: '42ch', fontWeight: 300, fontStyle: 'italic' }}>{step.note}</div>
        )}
      </div>

      {/* Video opcional en recuadro — persiste entre pasos */}
      {yt && (
        <div style={{ marginTop: 'clamp(18px,3.5vh,36px)', width: 'min(620px, 82vw)', aspectRatio: '16 / 9', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(148,163,184,0.25)', background: '#000' }}>
          <iframe src={ytSrc} title="Pilares" allow="autoplay; encrypted-media" style={{ width: '100%', height: '100%', border: 0, pointerEvents: 'none' }} />
        </div>
      )}

      {/* Dots de paso */}
      <div style={{ display: 'flex', gap: 8, marginTop: 'clamp(16px,3vh,32px)', justifyContent: 'center' }}>
        {Array.from({ length: total }).map((_, d) => (
          <span key={d} style={{ width: 8, height: 8, borderRadius: '50%', background: d === k ? 'var(--color-brand,#C5A059)' : 'rgba(148,163,184,0.3)' }} />
        ))}
      </div>
    </div>
  )
}

// Resalta los segmentos envueltos en **…** con el dorado de marca
function accent(text: string) {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: 'var(--color-brand, #C5A059)' }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

const SLIDES: Slide[] = [
  // 1 — Portada
  {
    kicker: 'SER PRO INTERNACIONAL · JUEVES DE NEGOCIOS',
    headline: 'El activo que **sobrevive** a su ausencia',
    sub: 'Luis Cabrejo',
  },
  // 2 — Hook
  {
    kicker: 'UNA PREGUNTA',
    headline: 'Si usted se detuviera, ¿su ingreso se detendría **con usted**?',
  },
  // 3 — La gran confusión
  { kicker: 'LA GRAN CONFUSIÓN', headline: 'Ingreso **≠** Riqueza' },
  // 4 — El apalancamiento (acumula los 3)
  {
    kicker: 'EL SECRETO',
    headline: 'El **apalancamiento**',
    stepMode: 'reveal',
    steps: [
      { headline: 'Gente' },
      { headline: 'Capital' },
      { headline: 'La nueva palanca: **tecnología** y productos que se replican sin costo' },
    ],
  },
  // 5 — La ventana · 3 pilares (rueda, con placeholders de video)
  {
    kicker: 'LA VENTANA',
    headline: 'Montada sobre **3 pilares**',
    stepMode: 'rotate',
    youtube: 'FMwlsRSMq6g',
    youtubeStart: 10,
    steps: [
      { kicker: 'PILAR 01', headline: 'La matriz física', sub: 'Gano Excel · Gano iTouch' },
      { kicker: 'PILAR 02', headline: 'El sistema Gano Excel' },
      { kicker: 'PILAR 03', headline: 'Tecnología' },
    ],
  },
  // 6 — Metodología
  { kicker: 'EL CAMINO', headline: 'Metodología **comprobada**' },
  // 7 — El producto
  {
    kicker: 'EL MOTOR',
    headline: 'Un hábito que **no cambia**',
    sub: 'Ganoderma Lucidum — el hongo más investigado del planeta. Más de 2,000 estudios.',
  },
  // 8 — Capitalización y Renta Vitalicia (rota: corto / mediano / largo plazo)
  {
    kicker: 'EL PLAN',
    headline: 'Capitalización **y** Renta Vitalicia',
    stepMode: 'rotate',
    steps: [
      { headline: 'Corto plazo', list: ['Venta al por menor', 'Gen 5', 'Bono Súper Estrella', 'Rebaja de volumen personal', 'Equipo Binario'] },
      {
        headline: 'Ejemplo · Equipo Binario',
        snowball: true,
        note: 'Ingreso recurrente que escala con su organización — independiente de su presencia física.',
      },
      { headline: 'Mediano plazo', list: ['Diamante Diferencial', 'Gen 5 Compresión', 'Bono de Liderazgo'] },
      { headline: 'Largo plazo', list: ['Bono Fondo Global', 'Múltiples Centros de Negocios', 'Incentivo de Automóvil', 'Incentivo Educativo'] },
    ],
  },
  // 9 — Cierre · Soberanía financiera
  {
    headline: '¿Qué es la **soberanía financiera**?',
    sub: 'Las cosas no pasan; se hacen pasar.',
  },
]

const total = SLIDES.length

export default function Deck() {
  const [pos, setPos] = useState({ s: 0, k: 0 })
  const [showHint, setShowHint] = useState(true)
  const touchX = useRef<number | null>(null)

  const go = useCallback((dir: number) => {
    setShowHint(false)
    setPos(({ s, k }) => {
      const nsteps = SLIDES[s].steps?.length ?? 0
      if (dir > 0) {
        if (nsteps && k < nsteps - 1) return { s, k: k + 1 }
        if (s < total - 1) return { s: s + 1, k: 0 }
        return { s, k }
      } else {
        if (nsteps && k > 0) return { s, k: k - 1 }
        if (s > 0) {
          const pk = SLIDES[s - 1].steps?.length ?? 0
          return { s: s - 1, k: pk ? pk - 1 : 0 }
        }
        return { s, k }
      }
    })
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen?.().catch(() => {})
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault(); go(1); break
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault(); go(-1); break
        case 'Home': setPos({ s: 0, k: 0 }); break
        case 'End': setPos({ s: total - 1, k: 0 }); break
        case 'f':
        case 'F': toggleFullscreen(); break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, toggleFullscreen])

  const slide = SLIDES[pos.s]
  const steps = slide.steps
  const progress = ((pos.s + 1) / total) * 100

  const KICKER = (text: string, mb = 'clamp(20px, 4vh, 44px)') => (
    <div style={{
      fontFamily: 'var(--font-mono, monospace)',
      fontSize: 'clamp(0.62rem, 1.4vw, 0.95rem)',
      letterSpacing: '0.28em',
      textTransform: 'uppercase',
      color: 'var(--color-brand, #C5A059)',
      marginBottom: mb,
    }}>{text}</div>
  )

  const HEADLINE = (text: string, size = 'clamp(2.1rem, 7.2vw, 5.6rem)') => (
    <h2 style={{
      fontFamily: 'var(--font-serif, Georgia, serif)',
      fontWeight: 600,
      fontSize: size,
      lineHeight: 1.08,
      letterSpacing: '-0.015em',
      maxWidth: '17ch',
      margin: 0,
    }}>{accent(text)}</h2>
  )

  const SUB = (text: string, mt = 'clamp(20px, 4vh, 40px)') => (
    <p style={{
      fontFamily: 'var(--font-sans, system-ui)',
      fontSize: 'clamp(1.05rem, 2.6vw, 1.9rem)',
      lineHeight: 1.4,
      color: 'var(--color-titanium, #94A3B8)',
      maxWidth: '34ch',
      marginTop: mt,
      marginBottom: 0,
      fontWeight: 300,
    }}>{text}</p>
  )

  // Puntos de anclaje fijos (top-anchor) — el ojo no se mueve entre slides simples
  const ANCHOR = { kicker: '30vh', title: '38vh', sub: '63vh' }
  const band = (top: string): React.CSSProperties => ({
    position: 'absolute', top, left: 0, right: 0,
    padding: '0 clamp(24px, 7vw, 120px)', boxSizing: 'border-box',
    display: 'flex', justifyContent: 'center',
  })

  return (
    <div
      onClick={(e) => {
        const w = (e.currentTarget as HTMLDivElement).clientWidth
        go(e.clientX < w * 0.25 ? -1 : 1)
      }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1)
        touchX.current = null
      }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'radial-gradient(ellipse at 50% 38%, rgba(197,160,89,0.06) 0%, transparent 62%), var(--color-bg-primary, #0F1115)',
        color: 'var(--color-text-primary, #FFFFFF)',
        fontFamily: 'var(--font-sans, system-ui)',
        cursor: 'pointer', userSelect: 'none', overflow: 'hidden',
      }}
    >
      {slide.stepMode === 'rotate' && steps ? (
        <RotateSlide key={pos.s} slide={slide} step={steps[pos.k]} k={pos.k} total={steps.length} />
      ) : (
      <div
        key={`${pos.s}-${pos.k}`}
        style={{
          height: '100%', width: '100%', position: 'relative',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          padding: 'clamp(24px, 7vw, 120px)',
          animation: 'deckIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        {/* ── Slide con pasos (reveal) ── */}
        {steps && slide.stepMode === 'reveal' ? (
          <>
            {slide.kicker && KICKER(slide.kicker)}
            {HEADLINE(slide.headline)}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2.5vh,22px)', marginTop: 'clamp(28px,6vh,56px)' }}>
              {steps.slice(0, pos.k + 1).map((st, d) => (
                <div key={d} style={{
                  fontFamily: 'var(--font-serif, Georgia, serif)',
                  fontSize: 'clamp(1.3rem, 3.4vw, 2.5rem)',
                  lineHeight: 1.2,
                  color: d === pos.k ? 'var(--color-text-primary,#FFFFFF)' : 'var(--color-titanium,#94A3B8)',
                  opacity: d === pos.k ? 1 : 0.6,
                  maxWidth: '24ch',
                }}>{accent(st.headline)}</div>
              ))}
            </div>
          </>
        ) : (
          /* ── Slide simple · anclajes fijos ── */
          <>
            {slide.kicker && <div style={band(ANCHOR.kicker)}>{KICKER(slide.kicker, '0')}</div>}
            <div style={band(ANCHOR.title)}>{HEADLINE(slide.headline)}</div>
            {slide.sub && <div style={band(ANCHOR.sub)}>{SUB(slide.sub, '0')}</div>}
          </>
        )}
      </div>
      )}

      {/* Contador */}
      <div style={{
        position: 'absolute', bottom: 'clamp(14px,3vh,28px)', right: 'clamp(18px,3vw,40px)',
        fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', letterSpacing: '0.15em',
        color: 'var(--color-text-muted, #A3A3A3)',
      }}>{String(pos.s + 1).padStart(2, '0')} / {total}</div>

      {/* Pista (se desvanece al primer avance) */}
      {showHint && (
        <div style={{
          position: 'absolute', bottom: 'clamp(14px,3vh,28px)', left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--color-text-muted, #A3A3A3)', opacity: 0.7, whiteSpace: 'nowrap',
        }}>→ avanzar · ← atrás · F pantalla completa</div>
      )}

      {/* Barra de progreso */}
      <div style={{
        position: 'absolute', left: 0, bottom: 0, height: 3, width: `${progress}%`,
        background: 'var(--color-brand, #C5A059)', transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
      }} />

      <style>{`
        @keyframes deckIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .snow-slider{-webkit-appearance:none;appearance:none;background:transparent;cursor:pointer;height:64px}
        .snow-slider::-webkit-slider-runnable-track{height:6px;background:#2A2D33;border-radius:3px;border:1px solid rgba(255,255,255,0.25)}
        .snow-slider::-moz-range-track{height:6px;background:#2A2D33;border-radius:3px;border:1px solid rgba(255,255,255,0.25)}
        .snow-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:var(--thumb-size,24px);height:var(--thumb-size,24px);border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFFFFF,#DCE2E8);border:none;margin-top:calc((8px - var(--thumb-size,24px)) / 2);box-shadow:0 4px 18px rgba(0,0,0,0.55),0 0 0 1px rgba(255,255,255,0.5);cursor:grab;transition:width .25s cubic-bezier(.22,1,.36,1),height .25s cubic-bezier(.22,1,.36,1),margin-top .25s cubic-bezier(.22,1,.36,1)}
        .snow-slider::-webkit-slider-thumb:active{cursor:grabbing}
        .snow-slider::-moz-range-thumb{width:var(--thumb-size,24px);height:var(--thumb-size,24px);border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFFFFF,#DCE2E8);border:none;box-shadow:0 4px 18px rgba(0,0,0,0.55);cursor:grab;transition:width .25s,height .25s}
      `}</style>
    </div>
  )
}
