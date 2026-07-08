/**
 * Copyright © 2026 CreaTuActivo.com
 * Página del Video Plan Servilleta (9:16, ~6 min).
 * El video (talking-head Luis + cutaways 3D + simuladores) es el protagonista.
 * Reutiliza HomeManifestoVideo: autoplay muted + "activar sonido" + controles +
 * transición a Queswa al terminar.
 */

export const dynamic = 'force-static';

import StrategicNavigation from '@/components/StrategicNavigation';
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

const C = { gold: '#C5A059', carbon: '#0F1115', white: '#FFFFFF', muted: '#A3A3A3' };

export default function VideoPlanServilletaPage() {
  return (
    <div style={{ background: C.carbon, minHeight: '100vh' }}>
      <StrategicNavigation />

      <main
        style={{
          maxWidth: '820px',
          margin: '0 auto',
          padding: '96px 20px 120px',
          textAlign: 'center',
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: C.gold,
            marginBottom: '20px',
          }}
        >
          El plan, en un video
        </p>

        {/* Video 9:16 — protagonista. Al terminar abre Queswa. */}
        <div style={{ marginBottom: '56px' }}>
          <HomeManifestoVideo src={PLAN_SERVILLETA_VIDEO} poster={PLAN_SERVILLETA_POSTER} />
        </div>

        {/* H1 — único de la página */}
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 4.2vw, 2.6rem)',
            lineHeight: 1.12,
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            color: C.gold,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '24px',
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          }}
        >
          Sea dueño de su empresa digital
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2.4vw, 1.15rem)',
            lineHeight: 1.6,
            color: C.muted,
            maxWidth: '620px',
            margin: '0 auto 40px',
          }}
        >
          Un ingreso que no depende de su presencia. Lo difícil ya está hecho: usted no
          la arma, la enciende.
        </p>

        <QueswaCTAButton className="cta-base cta-primary">
          Hablar con Queswa →
        </QueswaCTAButton>
      </main>
    </div>
  );
}
