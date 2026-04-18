/**
 * Copyright © 2026 CreaTuActivo.com
 * AUDITORÍA PATRIMONIAL — BRIDGE PAGE / CONFIRMACIÓN v1.0
 * Post-registro: video epifanía + timeline + WhatsApp CTA
 */

import TrackingGracias from './TrackingGracias';
import CopyLinkButton from './CopyLinkButton';

export const metadata = {
  title: 'Expediente en proceso | CreaTuActivo',
  description: 'Confirmación de registro a la Auditoría de Arquitectura Patrimonial.',
  robots: 'noindex, nofollow',
};

const C = {
  gold: '#C8A84B',
  white: '#F5F5F0',
  muted: '#6B6B5A',
  bg: '#080808',
  bgCard: '#0d0d0d',
  bgCardBorder: '#1a1a1a',
  cyan: '#22D3EE',
};

export default function AuditoriaGraciasPage() {
  const waShareUrl = 'https://wa.me/?text=Acabo+de+iniciar+la+Auditoría+de+Arquitectura+Patrimonial+de+CreaTuActivo.+Si+opera+bajo+el+Protocolo+de+la+Presencia+Obligada%2C+es+el+momento:+creatuactivo.com%2Fauditoria-patrimonial';
  const shareUrl = 'https://creatuactivo.com/auditoria-patrimonial';

  return (
    <>
      <TrackingGracias />
      <main style={{
        minHeight: '100vh',
        backgroundColor: C.bg,
        color: C.white,
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* HEADER */}
        <header style={{ padding: '1.5rem', textAlign: 'center', borderBottom: `1px solid ${C.bgCardBorder}` }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <img src="/header.png" alt="CreaTuActivo" width={36} height={36} style={{ objectFit: 'contain' }} />
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: C.white, fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>
              CreaTuActivo
            </span>
          </a>
        </header>

        <div style={{ flex: 1, padding: '3rem 1.25rem', maxWidth: '640px', margin: '0 auto', width: '100%' }}>

          {/* Eyebrow */}
          <p style={{
            fontSize: '0.7rem', fontFamily: "'Roboto Mono', monospace",
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: C.cyan, textAlign: 'center', marginBottom: '16px',
          }}>
            Expediente Recibido
          </p>

          {/* H1 */}
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 600, color: C.white,
            textAlign: 'center', lineHeight: 1.2,
            marginBottom: '16px',
          }}>
            Su auditoría está en proceso.
          </h1>

          {/* Instrucción inmediata */}
          <p style={{
            textAlign: 'center', color: C.muted,
            fontSize: '1.05rem', lineHeight: 1.6,
            marginBottom: '48px',
          }}>
            Revise su WhatsApp — recibirá las coordenadas de acceso en los próximos minutos.
          </p>

          {/* TIMELINE */}
          <div style={{
            background: C.bgCard, border: `1px solid ${C.bgCardBorder}`,
            padding: '24px 28px', marginBottom: '40px',
            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          }}>
            <p style={{ fontSize: '0.7rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.15em', textTransform: 'uppercase', color: C.cyan, marginBottom: '20px' }}>
              Protocolo de Entrega
            </p>
            {[
              { cuando: 'Hoy', texto: 'Coordenada 01 llega a su WhatsApp — Diagnóstico Estructural.' },
              { cuando: 'Días 2–4', texto: 'Escalabilidad, Acoplamiento Híbrido y Matriz de Amortización.' },
              { cuando: 'Día 5', texto: 'Protocolo de Activación — decisión directiva y asignación de activos.' },
            ].map((item, i) => (
              <div key={item.cuando} style={{
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                paddingBottom: i < 2 ? '16px' : '0',
                borderBottom: i < 2 ? `1px solid ${C.bgCardBorder}` : 'none',
                marginBottom: i < 2 ? '16px' : '0',
              }}>
                <span style={{
                  fontSize: '0.7rem', fontFamily: "'Roboto Mono', monospace",
                  color: C.gold, fontWeight: 700, flexShrink: 0, paddingTop: '2px', minWidth: '64px',
                }}>
                  {item.cuando}
                </span>
                <span style={{ color: C.muted, fontSize: '0.9rem', lineHeight: 1.5 }}>{item.texto}</span>
              </div>
            ))}
          </div>

          {/* VIDEO EPIFANÍA */}
          <div style={{ marginBottom: '40px' }}>
            <p style={{ fontSize: '0.7rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.15em', textTransform: 'uppercase', color: C.cyan, marginBottom: '12px' }}>
              Por qué construimos esta infraestructura
            </p>
            <div style={{
              aspectRatio: '16/9',
              background: C.bgCard,
              border: `1px solid ${C.bgCardBorder}`,
              overflow: 'hidden',
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
          </div>

          {/* CTA WHATSAPP */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <a
              href="https://wa.me/573206805737?text=Hola%20Luis%2C%20acabo%20de%20registrarme%20a%20la%20Auditoría%20de%20Arquitectura%20Patrimonial."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                backgroundColor: C.gold, color: C.bg,
                padding: '16px 32px', width: '100%', maxWidth: '420px',
                fontSize: '1rem', fontWeight: 700,
                fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase',
                textDecoration: 'none',
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
              }}
            >
              Confirmar Acceso por WhatsApp →
            </a>
            <p style={{ color: C.muted, fontSize: '0.75rem', marginTop: '10px', fontFamily: "'Roboto Mono', monospace" }}>
              Canal directo para las coordenadas de acceso diario
            </p>
          </div>

          {/* MENSAJE DE LUIS */}
          <div style={{
            borderLeft: `3px solid rgba(200,168,75,0.4)`,
            padding: '24px 28px', marginBottom: '40px',
            background: 'rgba(200,168,75,0.04)',
          }}>
            <p style={{
              fontSize: '1rem', lineHeight: 1.8, color: C.muted,
              fontStyle: 'italic', marginBottom: '16px',
            }}>
              &ldquo;Dar este primer paso ya revela algo sobre su perfil directivo. La mayoría permanece en el Protocolo de la Presencia Obligada, no por falta de voluntad — sino porque nunca ejecutaron el diagnóstico correcto. Usted lo hizo. Nos vemos en la primera coordenada.&rdquo;
            </p>
            <p style={{ fontSize: '0.78rem', fontFamily: "'Roboto Mono', monospace", color: C.gold, letterSpacing: '0.05em' }}>
              — Luis Cabrejo · Arquitecto de Activos
            </p>
          </div>

          {/* SECCIÓN COMPARTIR */}
          <div style={{
            background: C.bgCard, border: `1px solid ${C.bgCardBorder}`,
            padding: '24px 28px', marginBottom: '40px',
            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
          }}>
            <p style={{ fontSize: '0.7rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.15em', textTransform: 'uppercase', color: C.cyan, marginBottom: '12px' }}>
              ¿Hay un perfil en su entorno que requiere este diagnóstico?
            </p>
            <p style={{ color: C.muted, fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Si hay alguien en su entorno que también opera bajo el Protocolo de la Presencia Obligada, este puede ser el momento de su corrección.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a
                href={waShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '12px 20px',
                  border: `1px solid rgba(200,168,75,0.4)`,
                  color: C.gold, fontSize: '0.85rem', fontWeight: 600,
                  fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.08em',
                  textDecoration: 'none', textTransform: 'uppercase',
                  clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                }}
              >
                Compartir por WhatsApp
              </a>
              <CopyLinkButton
                url={shareUrl}
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: 'none', border: 'none',
                  color: C.muted, fontSize: '0.85rem', cursor: 'pointer',
                  fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em',
                  padding: '12px 4px',
                }}
              />
            </div>
          </div>

          {/* CTA QUESWA */}
          <p style={{ textAlign: 'center', marginBottom: '48px' }}>
            <a
              href="https://queswa.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.gold, fontSize: '0.9rem', textDecoration: 'none', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}
            >
              Mientras tanto, explore el Protocolo Queswa →
            </a>
          </p>
        </div>

        {/* FOOTER */}
        <footer style={{
          padding: '1.25rem',
          textAlign: 'center',
          color: C.muted,
          fontSize: '0.72rem',
          fontFamily: "'Roboto Mono', monospace",
          borderTop: `1px solid ${C.bgCardBorder}`,
        }}>
          © 2026 CreaTuActivo
        </footer>
      </main>
    </>
  );
}
