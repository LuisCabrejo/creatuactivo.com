'use client'

/**
 * Copyright © 2026 CreaTuActivo.com
 * CTA primario de las páginas de Reel — abre la servilleta (presentación de 7 min)
 * en un modal liviano con embed de YouTube (youtube-nocookie, sin descarga hasta abrir).
 */

import { useState } from 'react'

export default function ServilletaCTA({ youtubeId }: { youtubeId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cta-base cta-primary"
        style={{ width: '100%' }}
      >
        Ver la presentación completa (7 min)
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Presentación CreaTuActivo"
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(8, 9, 11, 0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '420px',
              aspectRatio: '9 / 16',
              maxHeight: '90vh',
              background: '#000',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid rgba(148, 163, 184, 0.2)',
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                fontSize: '1.2rem',
                lineHeight: 1,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=1`}
              title="Presentación CreaTuActivo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 0 }}
            />
          </div>
        </div>
      )}
    </>
  )
}
