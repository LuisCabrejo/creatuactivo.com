/**
 * Copyright © 2026 CreaTuActivo.com
 * Página de Reel por nicho — creatuactivo.com/{slug}/{nicho}
 *
 * Server Component. Estética Bimetálica v3.0 (tokens canónicos de globals.css).
 * Video 9:16 inline con preload="none" (no descarga hasta play — crítico en datos móviles).
 * 2 CTA: servilleta (modal YouTube) + WhatsApp del arquitecto.
 */

import { REEL_ASSETS, REEL_COPY, SERVILLETA_YOUTUBE_ID, type ReelNicho } from '@/lib/reels'
import ServilletaCTA from '@/components/ServilletaCTA'

interface ReelPageProps {
  slug: string
  nicho: ReelNicho
  constructor: {
    display_name: string | null
    foto_url: string | null
    whatsapp: string | null
    constructor_id: string | null
  }
}

export default function ReelPage({ slug, nicho, constructor }: ReelPageProps) {
  const copy = REEL_COPY[nicho]
  const assets = REEL_ASSETS[nicho]
  const nombre = constructor.display_name || slug
  const primerNombre = nombre.split(' ')[0]
  const refId = constructor.constructor_id

  // Tracking de referido — inyecta ?ref={constructor_id} + localStorage ANTES de que
  // corra el tracking.js diferido del layout. Replica la atribución de /auditoria?ref=id
  // para que la visita y cualquier conversión se asignen al arquitecto dueño del slug.
  const trackingScript = refId
    ? `(function(){try{var id=${JSON.stringify(refId)};localStorage.setItem('constructor_ref',id);var u=new URL(location.href);if(u.searchParams.get('ref')!==id){u.searchParams.set('ref',id);history.replaceState(null,'',u.toString());}}catch(e){}})();`
    : null

  const waUrl = constructor.whatsapp
    ? `https://wa.me/${constructor.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hola ${primerNombre}, vi el reel de CreaTuActivo y me gustaría conocer más. ¿Podemos conversar?`
      )}`
    : null

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px 64px',
      }}
    >
      {trackingScript && <script dangerouslySetInnerHTML={{ __html: trackingScript }} />}

      {/* Wordmark */}
      <a
        href="https://creatuactivo.com"
        style={{
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          textDecoration: 'none',
          marginBottom: '32px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        CreaTuActivo.com
      </a>

      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Video 9:16 inline */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '9 / 16',
            background: '#000',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid rgba(148, 163, 184, 0.18)',
          }}
        >
          <video
            controls
            playsInline
            preload="none"
            poster={assets.poster}
            src={assets.video}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Título */}
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            color: 'var(--color-text-primary)',
            margin: 0,
          }}
        >
          {copy.titulo}
        </h1>

        {/* Cuerpo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {copy.cuerpo.split('\n\n').map((parrafo, i) => (
            <p
              key={i}
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.7,
                color: 'var(--color-text-muted)',
                margin: 0,
              }}
            >
              {parrafo}
            </p>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
          <ServilletaCTA youtubeId={SERVILLETA_YOUTUBE_ID} />

          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-base cta-secondary"
              style={{ width: '100%' }}
            >
              Hablar con {primerNombre}
            </a>
          )}
        </div>

        {/* Pie — arquitecto */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '12px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(148, 163, 184, 0.12)',
          }}
        >
          {constructor.foto_url && (
            <img
              src={constructor.foto_url}
              alt={nombre}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid rgba(197, 160, 89, 0.4)',
              }}
            />
          )}
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{nombre}</div>
            <div
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-titanium-muted)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Arquitecto de Patrimonio
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
