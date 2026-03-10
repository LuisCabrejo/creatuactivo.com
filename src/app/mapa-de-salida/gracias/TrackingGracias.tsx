'use client'

import { useEffect } from 'react'

/**
 * Dispara evento de tracking cuando el prospecto llega a la página de gracias.
 * Usa el fingerprint ya generado por tracking.js (window.FrameworkIAA).
 */
export default function TrackingGracias() {
  useEffect(() => {
    const fire = () => {
      const fingerprint =
        (window as any).FrameworkIAA?.fingerprint ||
        localStorage.getItem('iaa_fingerprint') ||
        null

      fetch('/api/funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'mapa-de-salida-gracias',
          step: 'vio_pagina_gracias',
          fingerprint,
          constructor_ref: localStorage.getItem('constructor_ref') || null,
        }),
      }).catch(() => {/* silencioso — no bloqueante */})
    }

    // tracking.js puede tardar un momento en inicializarse
    if ((window as any).FrameworkIAA?.ready) {
      fire()
    } else {
      const timeout = setTimeout(fire, 1500)
      return () => clearTimeout(timeout)
    }
  }, [])

  return null
}
