/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La página del video «Cómo funciona», directo desde un enlace —
 * creatuactivo.com/{slug}/ver-como-funciona (Director, 12 nov 2026).
 *
 * Para el pie de una publicación que promete el video: quien toca el enlace llega
 * al video y a nada más, con el identificador del socio. Es el mismo reproductor
 * del hero de la Home (VideoComoFuncionaHome): no arranca solo —el celular no deja
 * sonar un video que la persona no ha tocado, y pesa 10,7 MB—, así que hay un
 * toque, sobre la portada. Debajo, un solo paso: hablar con Queswa.
 *
 * ⚠️ No es /{slug}/como-funciona: ese enlace no muestra el video; abre a Queswa
 * diciendo que la persona YA lo vio (va en el texto del reel que comparte el socio).
 *
 * Mismo esqueleto que las páginas de reel por nicho (ReelPage): sin navegación,
 * el video alto en la pantalla.
 */
import VideoComoFuncionaHome from '@/components/VideoComoFuncionaHome'
import EnlaceQueswaTrasVideo from '@/components/EnlaceQueswaTrasVideo'

interface Props {
  slug: string
  socio: { display_name: string | null; foto_url: string | null; constructor_id: string | null }
}

export default function VideoComoFuncionaPage({ slug, socio }: Props) {
  const nombre = socio.display_name || slug
  const refId = socio.constructor_id

  // La atribución, igual que en ReelPage: deja el ref del socio antes de que
  // corra el tracking.js diferido del layout.
  const trackingScript = refId
    ? `(function(){try{var id=${JSON.stringify(refId)};localStorage.setItem('constructor_ref',id);var u=new URL(location.href);if(u.searchParams.get('ref')!==id){u.searchParams.set('ref',id);history.replaceState(null,'',u.toString());}}catch(e){}})();`
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
        padding: '32px 20px 56px',
      }}
    >
      {trackingScript && <script dangerouslySetInnerHTML={{ __html: trackingScript }} />}

      <a
        href="https://creatuactivo.com"
        style={{
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          textDecoration: 'none',
          marginBottom: '14px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        CreaTuActivo.com
      </a>

      <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.3,
            color: 'var(--color-text-primary)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Cómo funciona
        </h1>

        <VideoComoFuncionaHome />

        <EnlaceQueswaTrasVideo slug={slug}>Hablar con Queswa</EnlaceQueswaTrasVideo>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {socio.foto_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={socio.foto_url}
              alt=""
              style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{nombre}</div>
        </div>
      </div>
    </div>
  )
}
