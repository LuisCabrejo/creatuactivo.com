/**
 * Copyright © 2026 CreaTuActivo.com
 * Página de Reel por nicho — creatuactivo.com/{slug}/{nicho}
 *
 * Server Component. Estética Bimetálica v3.0 (tokens canónicos de globals.css).
 * Jerarquía de conversión (no compite, secuencia):
 *   1. Reel 9:16 (gancho) — alto en pantalla, ojos en el tercio superior
 *   2. Copy del nicho
 *   3. Queswa = vía rápida: al terminar/scrollear el reel, el orbe ofrece auditar (ReelVideo)
 *   4. Tarjeta YouTube (presentación de 7 min) — vía reflexiva
 *   5. Los 2 escenarios de cierre del video: Auditoría 5 Días + Activación (WhatsApp)
 */

import { REEL_ASSETS, REEL_COPY, REEL_POSTER, SERVILLETA_YOUTUBE_ID, type ReelNicho } from '@/lib/reels'
import ReelVideo from '@/components/ReelVideo'
import YouTubeFacade from '@/components/YouTubeFacade'

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

  // Auditoría de 5 días (escenario 2 del cierre) — squeeze con atribución
  const auditoriaUrl = refId ? `/auditoria-patrimonial?ref=${refId}` : '/auditoria-patrimonial'

  // Activación inmediata (escenario 3) — WhatsApp del arquitecto, mensaje de decisión tomada
  const waUrl = constructor.whatsapp
    ? `https://wa.me/${constructor.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hola ${primerNombre}, vi la presentación y quiero activar mi Base Operativa. ¿Cuál es el siguiente paso?`
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

      {/* Wordmark — compacto para subir el reel al tercio superior */}
      <a
        href="https://creatuactivo.com"
        style={{
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          textDecoration: 'none',
          marginBottom: '6px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        CreaTuActivo.com
      </a>

      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '36px' }}>
        {/* 1 — Reel 9:16 + burbuja Queswa contextual (client) */}
        <ReelVideo poster={REEL_POSTER} src={assets.video} />

        {/* 2 — Título */}
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
              style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--color-text-muted)', margin: 0 }}
            >
              {parrafo}
            </p>
          ))}
        </div>

        {/* 4 — Presentación de 7 min (tarjeta YouTube full-bleed: todo el ancho en móvil) */}
        <div style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <p
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-titanium-muted)',
                fontFamily: 'var(--font-mono)',
                margin: '0 16px 18px',
              }}
            >
              La presentación completa · 7 min
            </p>
            <YouTubeFacade youtubeId={SERVILLETA_YOUTUBE_ID} />
          </div>
        </div>

        {/* 5 — Los dos escenarios con que cierra la presentación */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <a href={auditoriaUrl} className="cta-base cta-secondary" style={{ width: '100%' }}>
            Auditoría de 5 Días
          </a>

          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-base cta-whatsapp"
              style={{ width: '100%', whiteSpace: 'nowrap' }}
            >
              Activar por WhatsApp
            </a>
          )}
        </div>

        {/* Pie — arquitecto */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '8px',
            paddingTop: '28px',
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
