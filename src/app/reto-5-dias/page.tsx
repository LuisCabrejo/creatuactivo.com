/**
 * Copyright © 2026 CreaTuActivo.com
 * RETO 5 DÍAS - SQUEEZE PAGE
 * v2.0 - INDUSTRIAL LUXURY (Hard Surface + Hangar Header)
 * Página minimalista de captura para tráfico frío (ads/redes)
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const C = {
  gold: '#E5C279',
  amber: '#F59E0B',
  cyan: '#38BDF8',
  obsidian: '#0B0C0C',
  gunmetal: '#16181D',
  textMain: '#E5E5E5',
  textMuted: '#A3A3A3',
  textDim: '#64748B',
};

export default function Reto5DiasPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    whatsapp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.nombre,
          whatsapp: formData.whatsapp,
          source: 'reto-5-dias',
          step: 'reto_registered',
        }),
      });

      if (!response.ok) throw new Error('Error');

      // Redirigir a página de gracias (Bridge Page)
      router.push('/reto-5-dias/gracias');
    } catch {
      // Aún así redirigir para no frustrar
      router.push('/reto-5-dias/gracias');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .terminal-input {
          width: 100%;
          padding: 16px;
          background: ${C.gunmetal};
          border: 0;
          border-bottom: 2px solid ${C.amber};
          color: ${C.textMain};
          font-size: 1rem;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 0.05em;
          transition: all 0.2s ease;
        }
        .terminal-input::placeholder {
          color: ${C.textDim};
          text-transform: uppercase;
          font-size: 0.875rem;
          letter-spacing: 0.1em;
        }
        .terminal-input:focus {
          outline: none;
          border-bottom-color: ${C.gold};
          box-shadow: 0 4px 12px ${C.amber}20;
        }
        .btn-industrial {
          width: 100%;
          padding: 18px 32px;
          background: linear-gradient(135deg, ${C.amber}, #E9A23B);
          color: #000;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border: 0;
          cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
          transition: all 0.2s ease;
        }
        .btn-industrial:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px ${C.amber}40;
        }
        .btn-industrial:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}} />

      <main
        style={{
          minHeight: '100vh',
          color: C.textMain,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundImage: `linear-gradient(rgba(12,12,12,0.62), rgba(12,12,12,0.62)), url('/images/servilleta/fondo-global-hormigon.jpg?v=20260208')`,
          backgroundSize: 'cover, 600px 600px',
          backgroundRepeat: 'no-repeat, repeat',
          backgroundAttachment: 'scroll, scroll',
        }}
      >
        {/* ═══════════════════════════════════════════════════════════════
            HEADER: El Hangar (Dramático)
            ═══════════════════════════════════════════════════════════════ */}
        <section style={{ height: '40vh', position: 'relative', overflow: 'hidden' }}>
          {/* Imagen del Hangar con fade inferior */}
          <Image
            src="/images/header-reto.jpg"
            alt=""
            fill
            style={{
              objectFit: 'cover',
              filter: 'grayscale(70%) contrast(1.1) brightness(0.75)',
              opacity: 0.9,
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            }}
            priority
          />

          {/* Overlay sutil */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(11,12,12,0.2) 0%, rgba(11,12,12,0.35) 60%, transparent 100%)',
            }}
          />

          {/* Logo flotante */}
          <div style={{ position: 'relative', zIndex: 10, padding: '1.5rem' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <Image src="/header.png" alt="CreaTuActivo Logo" width={40} height={40} priority style={{ objectFit: 'contain' }} />
              <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', fontFamily: "'Oswald', sans-serif" }}>
                CreaTuActivo
              </span>
            </Link>
          </div>

          {/* Título del Header */}
          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: 0,
              right: 0,
              zIndex: 10,
              textAlign: 'center',
              padding: '0 1.5rem',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
                color: C.gold,
                lineHeight: 1.1,
                marginBottom: '0.75rem',
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              RETO 5 DÍAS
            </h1>
            <div style={{ width: '3rem', height: '1px', background: C.cyan, margin: '0 auto 0.5rem' }} />
            <span
              style={{
                fontSize: '0.7rem',
                color: C.cyan,
                letterSpacing: '0.15em',
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              REF: SQUEEZE_HANGAR_V2
            </span>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FORM CONTAINER: Card Industrial con Glassmorphism
            ═══════════════════════════════════════════════════════════════ */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 1rem',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div style={{ width: '100%', maxWidth: '540px' }}>
            {/* Card Principal - RECTANGULAR (no rounded) */}
            <div
              style={{
                background: 'rgba(22, 24, 29, 0.80)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${C.gold}26`,
                padding: 'clamp(2rem, 5vw, 2.5rem)',
              }}
            >
              {/* Pre-titular - Cuadrado (no rounded-full) */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    color: C.textMuted,
                    background: C.gunmetal,
                    padding: '0.5rem 1rem',
                    border: `1px solid ${C.gold}26`,
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      background: C.amber,
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                  />
                  Para profesionales que buscan diversificación inteligente
                </span>
              </div>

              {/* Titular - Identity Shift */}
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                Pasa de <span style={{ color: C.textMuted }}>DEPENDIENTE</span> a{' '}
                <span style={{ color: C.gold }}>SOBERANO</span>
              </h2>

              {/* Subtitular */}
              <p style={{ textAlign: 'center', color: C.textMuted, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                El Plan de 5 Días para construir tu{' '}
                <span style={{ color: C.textMain, fontWeight: 500 }}>Cartera de Activos Híbrida</span>.
                <br />
                <span style={{ color: C.gold }}>Modelo Tri-Modal</span> + Tecnología de IA Propietaria.
              </p>

              {/* Micro Historia - RECTANGULAR */}
              <div
                style={{
                  padding: '1rem',
                  background: C.obsidian,
                  border: `1px solid ${C.gold}26`,
                  marginBottom: '1.5rem',
                }}
              >
                <p style={{ fontSize: '0.875rem', color: C.textMuted, fontStyle: 'italic', textAlign: 'center', lineHeight: 1.6 }}>
                  &quot;A los 40 años descubrí que había comprado un empleo, no construido un activo.
                  Esta es la hoja de ruta matemática para salir de la trampa.&quot;
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: C.textDim,
                    textAlign: 'center',
                    marginTop: '0.5rem',
                    fontFamily: "'Roboto Mono', monospace",
                    letterSpacing: '0.05em',
                  }}
                >
                  — LUIS CABREJO · ARQUITECTO DE ACTIVOS
                </p>
              </div>

              {/* FORMULARIO - Estilo Terminal */}
              <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input
                    type="text"
                    placeholder="TU NOMBRE"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    required
                    className="terminal-input"
                  />
                  <input
                    type="email"
                    placeholder="TU MEJOR EMAIL"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="terminal-input"
                  />
                  <input
                    type="tel"
                    placeholder="TU WHATSAPP (+57 300...)"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    required
                    className="terminal-input"
                  />
                </div>

                {error && (
                  <p style={{ color: '#F43F5E', fontSize: '0.875rem', textAlign: 'center', marginTop: '1rem' }}>{error}</p>
                )}

                {/* CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-industrial"
                  style={{ marginTop: '1.5rem' }}
                >
                  {isSubmitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <svg style={{ animation: 'spin 1s linear infinite', width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Reservando...
                    </span>
                  ) : (
                    'Reservar mi Cupo GRATIS'
                  )}
                </button>
              </form>

              {/* Anti-Ganchos */}
              <div style={{ paddingTop: '1.5rem', borderTop: `1px solid ${C.gold}26` }}>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem 1.5rem',
                    fontSize: '0.75rem',
                    color: C.textDim,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <svg style={{ width: '14px', height: '14px', color: C.gold }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Sin perseguir amigos
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <svg style={{ width: '14px', height: '14px', color: C.gold }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Sin inventario en casa
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <svg style={{ width: '14px', height: '14px', color: C.gold }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Sin ventas de los 90
                  </span>
                </div>
              </div>

              {/* Trust Elements */}
              <div
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  fontSize: '0.75rem',
                  color: C.textDim,
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  SIN SPAM
                </span>
                <span>•</span>
                <span>100% GRATIS</span>
                <span>•</span>
                <span>5 DÍAS WHATSAPP</span>
              </div>
            </div>

            {/* Social Proof */}
            <p
              style={{
                textAlign: 'center',
                color: C.textDim,
                fontSize: '0.875rem',
                marginTop: '1.5rem',
                fontFamily: "'Roboto Mono', monospace",
                letterSpacing: '0.05em',
              }}
            >
              +2,400 PERSONAS YA TOMARON EL RETO
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════════════════ */}
        <footer
          style={{
            padding: '1rem',
            textAlign: 'center',
            color: C.textDim,
            fontSize: '0.75rem',
            position: 'relative',
            zIndex: 10,
            fontFamily: "'Roboto Mono', monospace",
          }}
        >
          <Link
            href="/privacidad"
            style={{
              color: C.textDim,
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = C.textMuted}
            onMouseLeave={(e) => e.currentTarget.style.color = C.textDim}
          >
            POLÍTICA DE PRIVACIDAD
          </Link>
          <span style={{ margin: '0 0.5rem' }}>•</span>
          <span>© 2026 CREATUACTIVO.COM</span>
        </footer>
      </main>
    </>
  );
}
