'use client'

/**
 * Copyright © 2026 CreaTuActivo.com
 * Tarjeta facade de YouTube — miniatura HD + botón play.
 * El iframe (youtube-nocookie) carga SOLO al primer click: nativo, empático,
 * y sin penalizar el LCP de la página con el SDK de YouTube.
 */

import { useState } from 'react'

export default function YouTubeFacade({ youtubeId, label }: { youtubeId: string; label?: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <p
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-titanium-muted)',
            fontFamily: 'var(--font-mono)',
            margin: '0 0 8px 0',
          }}
        >
          {label}
        </p>
      )}

      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          background: '#000',
          cursor: loaded ? 'default' : 'pointer',
        }}
        onClick={() => !loaded && setLoaded(true)}
      >
        {loaded ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=1`}
            title="Presentación CreaTuActivo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        ) : (
          <>
            <img
              src={`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`}
              alt="Presentación completa"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.25)',
              }}
            >
              {/* Botón play estilo YouTube */}
              <span
                style={{
                  width: 68,
                  height: 48,
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: '11px solid transparent',
                    borderBottom: '11px solid transparent',
                    borderLeft: '18px solid #fff',
                    marginLeft: 4,
                  }}
                />
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
