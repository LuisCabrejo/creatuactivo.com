/**
 * Copyright © 2026 CreaTuActivo.com
 * EL MAPA DE SALIDA — BRIDGE PAGE / CONFIRMACIÓN v4.0
 * Brief Maestro Abril 2026: warm-up post-registro, tono personal Luis, timeline
 */

import TrackingGracias from './TrackingGracias';
import CopyLinkButton from './CopyLinkButton';

export const metadata = {
  title: 'Tu mapa está en camino | CreaTuActivo',
  description: 'Confirmación de registro al Mapa de Salida.',
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

export default function MapaGraciasPage() {
  const waShareUrl = 'https://wa.me/?text=Acabo+de+recibir+el+Mapa+de+Salida+de+CreaTuActivo.+Si+estás+buscando+una+salida+al+Plan+por+Defecto%2C+míralo:+creatuactivo.com%2Fmapa-de-salida';
  const shareUrl = 'https://creatuactivo.com/mapa-de-salida';

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

        {/* HEADER — logo centrado */}
        <header style={{ padding: '1.5rem', textAlign: 'center', borderBottom: `1px solid ${C.bgCardBorder}` }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <img src="/header.png" alt="CreaTuActivo" width={36} height={36} style={{ objectFit: 'contain' }} />
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: C.white, fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>
              CreaTuActivo
            </span>
          </a>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <div style={{ flex: 1, padding: '3rem 1.25rem', maxWidth: '640px', margin: '0 auto', width: '100%' }}>

          {/* Eyebrow */}
          <p style={{
            fontSize: '0.7rem', fontFamily: "'Roboto Mono', monospace",
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: C.cyan, textAlign: 'center', marginBottom: '16px',
          }}>
            Todo listo
          </p>

          {/* H1 */}
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 600, color: C.white,
            textAlign: 'center', lineHeight: 1.2,
            marginBottom: '16px',
          }}>
            Tu mapa está en camino.
          </h1>

          {/* Instrucción inmediata */}
          <p style={{
            textAlign: 'center', color: C.muted,
            fontSize: '1.05rem', lineHeight: 1.6,
            marginBottom: '48px',
          }}>
            Revisa tu WhatsApp — te llegará en los próximos minutos.
          </p>

          {/* TIMELINE */}
          <div style={{
            background: C.bgCard, border: `1px solid ${C.bgCardBorder}`,
            padding: '24px 28px', marginBottom: '40px',
            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          }}>
            <p style={{ fontSize: '0.7rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.15em', textTransform: 'uppercase', color: C.cyan, marginBottom: '20px' }}>
              Qué esperar
            </p>
            {[
              { cuando: 'Hoy', texto: 'El Mapa de Salida llega a tu WhatsApp.' },
              { cuando: 'Mañana', texto: 'Día 1 de tu recorrido — el contexto que lo cambia todo.' },
              { cuando: 'En 5 días', texto: 'Tendrás la información completa para decidir si esto es para ti.' },
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
              Por qué diseñamos este mapa
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

          {/* CTA WHATSAPP — acción principal post-video */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <a
              href="https://wa.me/573206805737?text=Hola%20Luis%2C%20quiero%20unirme%20al%20Grupo%20Privado%20del%20Mapa%20de%20Salida."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                backgroundColor: '#25D366', color: '#ffffff',
                padding: '16px 32px', width: '100%', maxWidth: '400px',
                fontSize: '1rem', fontWeight: 700,
                fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase',
                textDecoration: 'none',
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Unirme al Grupo Privado de WhatsApp
            </a>
            <p style={{ color: C.muted, fontSize: '0.75rem', marginTop: '10px', fontFamily: "'Roboto Mono', monospace" }}>
              Acceso a herramientas y materiales exclusivos
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
              &ldquo;Tomar este primer paso ya dice algo de ti. La mayoría sigue en el Plan por Defecto, no porque no quieran salir — sino porque nunca se detuvieron a hacerse la pregunta correcta. Tú la hiciste. Nos vemos adentro.&rdquo;
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
              ¿Conoces a alguien más?
            </p>
            <p style={{ color: C.muted, fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Si hay alguien en tu vida que también está atrapado en el Plan por Defecto, este puede ser su momento.
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
              Mientras tanto, descubre Queswa →
            </a>
          </p>
        </div>

        {/* FOOTER MÍNIMO */}
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
