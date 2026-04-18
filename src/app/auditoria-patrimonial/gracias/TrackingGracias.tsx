'use client'

import { useEffect } from 'react'

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
          source: 'auditoria-patrimonial-gracias',
          step: 'vio_pagina_gracias',
          fingerprint,
          constructor_ref: localStorage.getItem('constructor_ref') || null,
        }),
      }).catch(() => {})
    }

    if ((window as any).FrameworkIAA?.ready) {
      fire()
    } else {
      const timeout = setTimeout(fire, 1500)
      return () => clearTimeout(timeout)
    }
  }, [])

  return null
}
