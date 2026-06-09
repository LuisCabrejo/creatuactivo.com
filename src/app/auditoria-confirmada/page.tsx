/**
 * Copyright © 2026 CreaTuActivo.com
 * AUDITORÍA CONFIRMADA — BRIDGE PAGE v1.0
 * Lujo Clínico — Terminología de operaciones tácticas
 * Objetivo: consumo del Video Epifanía → clic en Sala de Coordenadas (WhatsApp)
 */

import TrackingConfirmada from './TrackingConfirmada';

// Paleta local alineada a tokens del Sistema de Diseño (Lujo Silencioso v1.0)
const C = {
  gold: 'var(--color-brand)',              // #C5A059
  goldDim: 'var(--color-brand-muted)',     // #B38B59
  white: 'var(--color-text-primary)',      // #FFFFFF
  muted: 'var(--color-text-muted)',        // #A3A3A3
  mutedLight: 'var(--color-titanium-muted)', // #878681
  bg: 'var(--color-bg-primary)',           // #0F1115
  bgElevated: 'var(--color-bg-elevated)',  // #15171C
  bgCard: 'var(--color-bg-surface)',       // #1A1D23
  bgCardBorder: 'rgba(255,255,255,0.08)',
  bgSectionAlt: 'var(--color-bg-elevated)',
  cyan: '#22D3EE',
  amber: 'var(--color-warning)',           // #C6A76B
  divider: 'rgba(255,255,255,0.08)',
};

const WA_SALA =
  'https://wa.me/573206805737?text=Hola+Luis,+confirm%C3%A9+mi+registro+al+diagn%C3%B3stico+de+5+d%C3%ADas.+Quiero+acceso+al+grupo+de+soporte.';

const STEPS = [
  {
    num: '01',
    label: 'RECIBA EL MATERIAL CADA DÍA',
    desc: 'A partir de mañana, a las 8:00 AM, le llega a su correo el primer video. Agregue nuestro remitente a sus contactos para que no caiga en spam.',
  },
  {
    num: '02',
    label: 'DEDÍQUELE 20 MINUTOS',
    desc: 'Cada video pide unos 15 a 20 minutos de atención tranquila. No es para tener de fondo: véalo con calma para entender bien cómo funciona.',
  },
  {
    num: '03',
    label: 'DECIDA CON NÚMEROS',
    desc: 'Al terminar el día 5 tendrá los datos claros para decidir, por su cuenta, si esto encaja con la tranquilidad económica que busca para su familia.',
  },
];

export default function AuditoriaConfirmadaPage() {
  return (
    <>
      <TrackingConfirmada />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        .status-dot {
          display: inline-block;
          width: 7px; height: 7px;
          background: ${C.gold};
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        .ap-btn-wa {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 20px 32px;
          background: var(--color-bg-elevated);
          color: var(--color-brand);
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid var(--color-brand);
          border-radius: var(--radius-action);
          cursor: pointer;
          font-family: var(--font-sans);
          text-decoration: none;
          transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease;
        }
        .ap-btn-wa:hover {
          background: var(--color-bg-surface);
          border-color: var(--color-brand-hover);
          color: var(--color-brand-hover);
        }
        .step-row {
          display: flex;
          gap: 24px;
          padding: 28px 0;
          border-bottom: 1px solid ${C.divider};
          align-items: flex-start;
        }
        .step-row:last-child { border-bottom: 0; }
      `}} />

      <main style={{
        minHeight: '100vh',
        backgroundColor: C.bg,
        color: C.white,
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* HEADER */}
        <header style={{
          padding: '1.5rem 2rem',
          textAlign: 'center',
          borderBottom: `1px solid ${C.bgCardBorder}`,
        }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <img src="/images/logotipo-CreaTuActivo.com.webp" alt="CreaTuActivo" width={32} height={32} style={{ objectFit: 'contain' }} />
            <span style={{
              fontSize: '1rem', fontWeight: 700, color: C.white,
              fontFamily: "var(--font-sans)", letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              CreaTuActivo
            </span>
          </a>
        </header>

        <div style={{ flex: 1, padding: '0 1.25rem', maxWidth: '640px', margin: '0 auto', width: '100%' }}>

          {/* ─── SECCIÓN 1: HERO ─── */}
          <section style={{ padding: '5rem 0 4rem', textAlign: 'center' }}>

            {/* Estado badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '8px 16px',
              border: `1px solid rgba(197, 160, 89,0.3)`,
              background: 'rgba(197, 160, 89,0.05)',
              marginBottom: '32px',
            }}>
              <span className="status-dot" />
              <span style={{
                fontSize: '0.65rem', fontFamily: "var(--font-mono)",
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: C.gold,
              }}>
                Estado: Registro confirmado
              </span>
            </div>

            {/* H1 */}
            <h1 style={{
              fontSize: 'clamp(2.2rem, 7vw, 3.5rem)',
              fontFamily: "var(--font-sans)",
              fontWeight: 800, color: C.white,
              letterSpacing: '0.08em',
              lineHeight: 1, marginBottom: '24px',
              textTransform: 'uppercase',
            }}>
              Registro<br />confirmado.
            </h1>

            {/* H2 */}
            <p style={{
              fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
              color: C.mutedLight, lineHeight: 1.7,
              maxWidth: '480px', margin: '0 auto',
              fontFamily: "var(--font-sans)",
            }}>
              Su registro quedó confirmado. Mañana, en menos de 24 horas, le llega el primer video del diagnóstico de 5 días.
            </p>
          </section>

          {/* ─── SECCIÓN 2: VIDEO (MEMORÁNDUM) ─── */}
          <section style={{ marginBottom: '5rem' }}>

            {/* Warning banner */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 16px',
              background: 'rgba(198, 167, 107,0.08)',
              border: `1px solid rgba(198, 167, 107,0.25)`,
              marginBottom: '20px',
            }}>
              <span style={{ fontSize: '0.9rem' }}>⚠</span>
              <span style={{
                fontSize: '0.62rem', fontFamily: "var(--font-mono)",
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: C.amber,
              }}>
                Véalo antes de empezar
              </span>
            </div>

            {/* Block title */}
            <h2 style={{
              fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
              fontFamily: "var(--font-serif)",
              fontWeight: 700, color: C.white,
              marginBottom: '14px', lineHeight: 1.25,
            }}>
              Antes de empezar: por qué el modelo de siempre se queda corto
            </h2>

            <p style={{
              fontSize: '0.9rem', color: C.muted, lineHeight: 1.75,
              marginBottom: '20px',
            }}>
              Antes de que le llegue el primer correo, vea este video. Entender por qué el modelo de toda la vida tiene un punto débil le va a servir más que cualquier técnica de esta semana.
            </p>

            {/* Video player */}
            <div style={{
              aspectRatio: '16/9',
              background: C.bgCard,
              border: `1px solid ${C.bgCardBorder}`,
              overflow: 'hidden',
              position: 'relative',
            }}>
              <video
                controls
                preload="none"
                poster={process.env.NEXT_PUBLIC_VIDEO_EPIFANIA_POSTER}
                playsInline
                style={{ width: '100%', height: '100%', display: 'block' }}
              >
                <source src={process.env.NEXT_PUBLIC_VIDEO_EPIFANIA_1080P} type="video/mp4" />
                <source src={process.env.NEXT_PUBLIC_VIDEO_EPIFANIA_720P} type="video/mp4" />
              </video>
            </div>
          </section>

          {/* ─── SECCIÓN 3: HOJA DE RUTA OPERATIVA ─── */}
          <section style={{ marginBottom: '5rem' }}>

            <p style={{
              fontSize: '0.62rem', fontFamily: "var(--font-mono)",
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: C.cyan, marginBottom: '14px',
            }}>
              Cómo va a funcionar
            </p>

            <h2 style={{
              fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
              fontFamily: "var(--font-serif)",
              fontWeight: 700, color: C.white,
              marginBottom: '32px', lineHeight: 1.2,
            }}>
              Sus siguientes pasos
            </h2>

            <div style={{ borderTop: `1px solid ${C.divider}` }}>
              {STEPS.map((step) => (
                <div key={step.num} className="step-row">
                  {/* Step number */}
                  <div style={{ flexShrink: 0 }}>
                    <span style={{
                      fontSize: '1.8rem', fontFamily: "var(--font-mono)",
                      fontWeight: 700, color: 'rgba(197, 160, 89,0.25)',
                      lineHeight: 1, display: 'block',
                    }}>
                      {step.num}
                    </span>
                  </div>
                  {/* Content */}
                  <div style={{ paddingTop: '4px' }}>
                    <p style={{
                      fontSize: '0.65rem', fontFamily: "var(--font-mono)",
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: C.mutedLight, marginBottom: '8px',
                    }}>
                      {step.label}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: C.muted, lineHeight: 1.7 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── SECCIÓN 4: CTA WHATSAPP ─── */}
          <section style={{ marginBottom: '6rem' }}>

            <div style={{
              padding: '36px 32px',
              border: `1px solid rgba(197, 160, 89,0.2)`,
              background: 'rgba(197, 160, 89,0.03)',
            }}>
              <p style={{
                fontSize: '0.62rem', fontFamily: "var(--font-mono)",
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: C.cyan, marginBottom: '14px',
              }}>
                Su canal directo
              </p>

              <h2 style={{
                fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
                fontFamily: "var(--font-serif)",
                fontWeight: 700, color: C.white,
                marginBottom: '16px', lineHeight: 1.25,
              }}>
                Quede conectado con el equipo
              </h2>

              <p style={{
                fontSize: '0.9rem', color: C.muted, lineHeight: 1.75,
                marginBottom: '28px',
              }}>
                El material extra y la resolución de sus dudas las vamos a coordinar directamente por WhatsApp.
                <br /><br />
                Quede conectado ahora mismo:
              </p>

              <a href={WA_SALA} target="_blank" rel="noopener noreferrer" className="ap-btn-wa">
                {/* WhatsApp icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Entrar al grupo por WhatsApp →
              </a>

              <p style={{
                textAlign: 'center', fontSize: '0.65rem',
                fontFamily: "var(--font-mono)",
                color: C.muted, marginTop: '14px',
                letterSpacing: '0.08em',
              }}>
                Canal directo · Soporte personal
              </p>
            </div>
          </section>

        </div>

        {/* FOOTER */}
        <footer style={{
          padding: '1.5rem 2rem',
          borderTop: `1px solid ${C.bgCardBorder}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
        }}>
          <p style={{
            fontSize: '0.65rem', fontFamily: "var(--font-mono)",
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: C.muted,
          }}>
            ¿Necesita ayuda?{' '}
            <a
              href="https://wa.me/573206805737"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.gold, textDecoration: 'none' }}
            >
              Escríbanos
            </a>
          </p>
          <p style={{
            fontSize: '0.65rem', fontFamily: "var(--font-mono)",
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: C.muted,
          }}>
            © 2026 CreaTuActivo.com · Todos los Derechos Reservados
          </p>
        </footer>

      </main>
    </>
  );
}
