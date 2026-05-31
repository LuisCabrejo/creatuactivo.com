'use client'

/**
 * Copyright © 2026 CreaTuActivo.com
 * Botón Compartir del manifiesto — comparte la URL LIMPIA /{slug}/manifiesto
 * (sin ?ref; el slug re-atribuye al arquitecto al abrir, igual que los reels).
 */

import { useState } from 'react'

export default function ManifiestoShare({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)

  const onShare = async () => {
    const url = `${window.location.origin}/${slug}/manifiesto`
    if (navigator.share) {
      try { await navigator.share({ title: 'Manifiesto de los Fundadores · CreaTuActivo', url }) } catch { /* cancelado */ }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* sin portapapeles */ }
  }

  return (
    <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(148,163,184,0.12)' }}>
      <p className="text-sm text-[#A3A3A3] mb-4">
        ¿Es Arquitecto y quiere construir su mesa de 15? Comparta este documento con su red.
      </p>
      <button
        type="button"
        onClick={onShare}
        className="cta-base cta-secondary"
      >
        {copied ? '✓ Enlace copiado' : 'Compartir este manifiesto'}
      </button>
    </div>
  )
}
