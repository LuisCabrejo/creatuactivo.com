'use client'

/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * WhatsAppOrb — el orbe flotante que lleva la conversación a WhatsApp.
 *
 * Misma geometría y mismo lugar que `UnifiedQueswaOrb` (56px, esquina inferior
 * derecha, safe-area iOS) para que el cambio de fase no mueva nada de sitio; lo que
 * cambia es a dónde va el toque: en vez de abrir el panel de chat en la página, abre
 * el hilo de WhatsApp con Queswa, donde el prospecto ya tiene su historial y donde
 * corre el motor con guardarraíles, radicación y aviso al socio.
 *
 * Verde WhatsApp (#25D366) y no dorado, a propósito: el ícono debe reconocerse antes
 * de leerse. Es la misma paleta de `.cta-whatsapp` que el sitio ya usa en los cierres.
 *
 * Sin Framer Motion — este orbe no monta panel, así que no hay razón para arrastrar
 * 114KB: la entrada y la respiración son CSS.
 *
 * Contratos que conserva del orbe web (no romper):
 *   · `open-queswa`  → los CTAs de la Home, del reel y del manifiesto siguen sirviendo
 *   · `queswa-opened` → ReelVideo reporta `queswa_opened` y el socio recibe su push
 *   · `mobile-menu-open` / `mobile-menu-close` → se oculta con el menú abierto
 */

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { abrirConversacionQueswa, leerRefSocio, yaConversoPorWhatsApp, type ContextoOrbe } from '@/lib/orbe-config'
import { REEL_NICHOS } from '@/lib/reels'

const VERDE = '#25D366'

function IconoWhatsApp() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill={VERDE} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413" />
    </svg>
  )
}

export default function WhatsAppOrb() {
  const pathname = usePathname()
  const [visible, setVisible]       = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  // Quien ya conversó no necesita que le ofrezcan una demostración: necesita saber
  // que su chat sigue ahí. Se lee después de montar (localStorage) y se vuelve a
  // leer al regresar de WhatsApp, que es justo cuando el dato cambia.
  const [retomando, setRetomando] = useState(false)
  const abriendo = useRef(false)

  // Catálogo: Queswa entra como asesor de bienestar, no de negocio — el texto
  // pre-llenado lo dice para que el canal enrute al arsenal correcto de entrada.
  const isProductsPage = pathname.includes('/sistema/productos')
  const contexto: ContextoOrbe = isProductsPage ? 'productos' : 'general'

  // Mismo criterio de supresión del orbe web: en reels y en la Home el video
  // maneja su propia burbuja y el tooltip genérico se le atravesaría.
  const isReelRoute = (() => {
    const seg = pathname.split('/').filter(Boolean)
    return seg.length === 2 && (REEL_NICHOS as readonly string[]).includes(seg[1])
  })()
  const suppressTooltip = isReelRoute || pathname === '/' || pathname === '/video-plan-servilleta'

  const tooltipText = retomando
    ? 'Retome su conversación'
    : isProductsPage
      ? 'Pregúntele a su asesor de bienestar'
      : '¿Le muestro cómo funciona?'

  const abrirWhatsApp = () => {
    // Guard de doble disparo: el clic en el orbe también emite `open-queswa` para
    // los oyentes de la página, y ese evento vuelve aquí.
    if (abriendo.current) return
    abriendo.current = true
    setTimeout(() => { abriendo.current = false }, 1200)

    setHasInteracted(true)
    setShowTooltip(false)
    // El contrato de engagement con el Dashboard: el socio ve que su prospecto
    // abrió la conversación (mismo evento que emitía el chat web al abrirse).
    window.dispatchEvent(new CustomEvent('queswa-opened'))
    abrirConversacionQueswa(leerRefSocio(), contexto)
  }

  useEffect(() => {
    const releer = () => setRetomando(yaConversoPorWhatsApp())
    releer()
    document.addEventListener('visibilitychange', releer)
    window.addEventListener('focus', releer)
    return () => {
      document.removeEventListener('visibilitychange', releer)
      window.removeEventListener('focus', releer)
    }
  }, [])

  // Entrada suave tras montar
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  // Los CTAs que ya existen ("Hablar con Queswa", el del reel, el del manifiesto)
  // disparan `open-queswa`. En esta fase ese camino termina en WhatsApp.
  useEffect(() => {
    const onOpen = () => abrirWhatsApp()
    window.addEventListener('open-queswa', onOpen)
    return () => window.removeEventListener('open-queswa', onOpen)
  }, [contexto])

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

  useEffect(() => {
    if (hasInteracted || suppressTooltip) return
    const t = setTimeout(() => setShowTooltip(true), 9000)
    const t2 = setTimeout(() => setShowTooltip(false), 22000)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [hasInteracted, suppressTooltip, pathname])

  if (isMenuOpen) return null

  return (
    <>
      {showTooltip && (
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 16px) + 64px)',
            right: '1rem',
            zIndex: 199,
            background: 'rgba(8,9,12,0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${VERDE}8C`,
            boxShadow: '0 0 12px rgba(37,211,102,0.15), 0 4px 16px rgba(0,0,0,0.6)',
            borderRadius: 6,
            padding: '10px 16px',
            maxWidth: 220,
            pointerEvents: 'none',
            animation: 'waTooltipIn 0.3s ease-out',
          }}
        >
          <p style={{ fontSize: 13, color: '#FFFFFF', margin: 0, lineHeight: 1.5, fontFamily: 'monospace', fontWeight: 600 }}>
            {tooltipText}
          </p>
        </div>
      )}

      <button
        type="button"
        data-nexus-button
        aria-label={retomando ? 'Retomar la conversación con Queswa en WhatsApp' : 'Conversar con Queswa por WhatsApp'}
        onClick={abrirWhatsApp}
        className="wa-orb"
        style={{
          position: 'fixed',
          bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 16px))',
          right: '1rem',
          zIndex: 200,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: '1px solid rgba(37,211,102,0.45)',
          background: 'rgba(15,17,21,0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(80px)',
          transition: 'opacity 0.35s ease-out, transform 0.45s cubic-bezier(0.22,1,0.36,1)',
          animation: visible ? 'waOrbBreath 3s ease-in-out infinite' : 'none',
        }}
      >
        <IconoWhatsApp />
      </button>

      <style>{`
        @keyframes waOrbBreath {
          0%, 100% { box-shadow: 0 4px 16px rgba(0,0,0,0.55), 0 0 0 0px rgba(37,211,102,0); }
          50%      { box-shadow: 0 4px 16px rgba(0,0,0,0.55), 0 0 0 7px rgba(37,211,102,0.10), 0 0 22px rgba(37,211,102,0.16); }
        }
        @keyframes waTooltipIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wa-orb:hover  { transform: scale(1.08) !important; border-color: rgba(37,211,102,0.8) !important; }
        .wa-orb:active { transform: scale(0.94) !important; }
      `}</style>
    </>
  )
}
