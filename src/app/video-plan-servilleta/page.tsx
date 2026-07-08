/**
 * Copyright © 2026 CreaTuActivo.com
 * Página del Video Plan Servilleta (9:16, ~6 min).
 * Layout espejo de las páginas de reel por nicho (ReelPage): sin nav, padding
 * compacto y video alto en pantalla (ojos en el tercio superior). El video
 * (talking-head Luis + cutaways 3D + simuladores) es el protagonista.
 * Reutiliza HomeManifestoVideo: autoplay muted + "activar sonido" + controles +
 * transición a Queswa al terminar.
 */

export const dynamic = 'force-static';

import HomeManifestoVideo from '@/components/HomeManifestoVideo';
import QueswaCTAButton from '@/components/QueswaCTAButton';
import { PLAN_SERVILLETA_VIDEO, PLAN_SERVILLETA_POSTER } from '@/lib/reels';

export const metadata = {
  title: 'El Plan en un Video · Sea dueño de su empresa digital · CreaTuActivo',
  description:
    'En seis minutos: qué es una empresa digital, cómo el apalancamiento le quita el peso de encima (Gano Excel + Queswa + un método comprobado) y la matemática de un ingreso que no depende de su presencia.',
  keywords:
    'plan servilleta creatuactivo, video plan creatuactivo, empresa digital, apalancamiento, gano excel, queswa, luis cabrejo, ingreso recurrente',
  authors: [{ name: 'Luis Cabrejo', url: 'https://luiscabrejo.com' }],
  openGraph: {
    title: 'El Plan en un Video · CreaTuActivo',
    description:
      'Qué es una empresa digital, el apalancamiento que le quita el peso de encima, y la matemática de un ingreso que no depende de su presencia.',
    url: 'https://creatuactivo.com/video-plan-servilleta',
    type: 'video.other',
    images: [{ url: PLAN_SERVILLETA_POSTER, width: 1080, height: 1920 }],
  },
};

export default function VideoPlanServilletaPage() {
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
      {/* Wordmark — compacto para subir el video al tercio superior (patrón reel) */}
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
        {/* Video 9:16 — protagonista. Al terminar abre Queswa. */}
        <HomeManifestoVideo src={PLAN_SERVILLETA_VIDEO} poster={PLAN_SERVILLETA_POSTER} />

        {/* Cuerpo breve */}
        <p
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.7,
            color: 'var(--color-text-muted)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Un ingreso que no depende de su presencia. Lo difícil ya está hecho: usted
          no la arma, la enciende.
        </p>

        <QueswaCTAButton className="cta-base cta-primary" style={{ width: '100%' }}>
          Hablar con Queswa →
        </QueswaCTAButton>
      </div>
    </div>
  );
}
