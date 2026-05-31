'use client'

/**
 * Copyright © 2026 CreaTuActivo.com
 * Botón Compartir — abre la hoja nativa (Web Share API) con la URL LIMPIA del
 * reel (`/{slug}/{nicho}`, sin ?ref) para que quien la reciba se re-atribuya al
 * arquitecto del slug. En desktop (sin Web Share) copia el enlace al portapapeles.
 */

import { useState } from 'react'

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const onShare = async () => {
    // URL limpia: origin + pathname (descarta ?ref; el slug re-atribuye al abrir)
    const url = `${window.location.origin}${window.location.pathname}`
    if (navigator.share) {
      try { await navigator.share({ title, url }) } catch { /* usuario canceló */ }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* sin permiso de portapapeles */ }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      className="cta-base cta-ghost"
      style={{ alignSelf: 'center' }}
    >
      {copied ? '✓ Enlace copiado' : 'Compartir esta auditoría'}
    </button>
  )
}
