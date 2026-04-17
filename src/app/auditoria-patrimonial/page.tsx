/**
 * Copyright © 2026 CreaTuActivo.com
 * AUDITORÍA DE ARQUITECTURA PATRIMONIAL — SQUEEZE PAGE v1.0
 * Lujo Clínico — Due Diligence framing, persuasión invertida
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const C = {
  gold: '#C8A84B',
  goldDim: '#A8881F',
  white: '#F5F5F0',
  muted: '#6B6B5A',
  mutedLight: '#8A8A7A',
  bg: '#080808',
  bgCard: '#0d0d0d',
  bgCardBorder: '#1c1c1c',
  bgSectionAlt: '#0a0a0a',
  cyan: '#22D3EE',
  divider: '#222',
};

const PHASES = [
  {
    day: 'Día 1',
    label: 'DIAGNÓSTICO ESTRUCTURAL',
    desc: 'Identificación de fallas matemáticas en su vehículo de ingresos actual.',
  },
  {
    day: 'Día 2',
    label: 'ANÁLISIS DE ESCALABILIDAD',
    desc: 'Demostración de por qué el modelo operativo manual posee un techo técnico inquebrantable.',
  },
  {
    day: 'Día 3',
    label: 'ACOPLAMIENTO HÍBRIDO',
    desc: 'Integración de nuestra Capa Logística Global con la automatización del motor de Inteligencia Artificial (Queswa).',
  },
  {
    day: 'Día 4',
    label: 'MATRIZ DE AMORTIZACIÓN',
    desc: 'Matemática exacta de liquidez recurrente y plusvalía de red.',
  },
  {
    day: 'Día 5',
    label: 'PROTOCOLO DE ACTIVACIÓN',
    desc: 'Decisión directiva y asignación de activos.',
  },
];

const REQUIREMENTS = [
  {
    label: 'Ancho de Banda Mental',
    desc: 'Asignación estricta de 15 a 20 minutos diarios.',
  },
  {
    label: 'Madurez Analítica',
    desc: 'Capacidad directiva para auditar datos fríos, sin sesgos emocionales.',
  },
];

export default function AuditoriaPatrimonialPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nombre: '', email: '', whatsapp: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [constructorRef, setConstructorRef] = useState<string | null>(null);

  useEffect(() => {
    const match = window.location.pathname.match(/\/auditoria-patrimonial\/([^/?#]+)/);
    const ref = match?.[1] ?? localStorage.getItem('constructor_ref') ?? null;
    if (ref) {
      setConstructorRef(ref);
      localStorage.setItem('constructor_ref', ref);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.nombre,
          whatsapp: formData.whatsapp,
          source: 'auditoria-patrimonial',
          step: 'auditoria_registered',
          constructor_ref: constructorRef ?? localStorage.getItem('constructor_ref') ?? undefined,
        }),
      });
      if (!response.ok) throw new Error('Error');
      setIsSuccess(true);
      setTimeout(() => router.push('/auditoria-confirmada'), 1000);
    } catch {
      router.push('/auditoria-confirmada');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .ap-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          color: ${C.white};
          font-size: 0.95rem;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 0.04em;
          transition: border-color 0.2s ease, background 0.2s ease;
          box-sizing: border-box;
        }
        .ap-input::placeholder {
          color: rgba(107,107,90,0.6);
          font-size: 0.85rem;
          letter-spacing: 0.04em;
          font-family: 'Rajdhani', sans-serif;
        }
        .ap-input:focus {
          outline: none;
          border-color: rgba(200,168,75,0.5);
          background: rgba(200,168,75,0.04);
        }
        .ap-btn-primary {
          width: 100%;
          padding: 18px 32px;
          background: linear-gradient(135deg, ${C.gold}, ${C.goldDim});
          color: #000;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border: 0;
          cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
          transition: all 0.2s ease;
        }
        .ap-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(200,168,75,0.4);
        }
        .ap-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }
        .ap-btn-secondary {
          width: 100%;
          padding: 18px 32px;
          background: transparent;
          color: ${C.gold};
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border: 1px solid ${C.gold};
          cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
          transition: all 0.2s ease;
        }
        .ap-btn-secondary:hover {
          background: rgba(200,168,75,0.08);
          transform: translateY(-2px);
        }
        .phase-card {
          display: flex;
          gap: 20px;
          padding: 24px 0;
          border-bottom: 1px solid ${C.divider};
          align-items: flex-start;
        }
        .phase-card:last-child { border-bottom: 0; }
        .req-item {
          display: flex;
          gap: 16px;
          padding: 20px 0;
          border-bottom: 1px solid ${C.divider};
          align-items: flex-start;
        }
        .req-item:last-child { border-bottom: 0; }
      `}} />

      <main style={{
        minHeight: '100vh',
        backgroundColor: C.bg,
        color: C.white,
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* HEADER — minimal, no nav */}
        <header style={{
          padding: '1.5rem 2rem',
          textAlign: 'center',
          borderBottom: `1px solid ${C.bgCardBorder}`,
        }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Image src="/header.png" alt="CreaTuActivo" width={32} height={32} priority style={{ objectFit: 'contain' }} />
            <span style={{
              fontSize: '1rem', fontWeight: 700, color: C.white,
              fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              CreaTuActivo
            </span>
          </Link>
        </header>

        {/* ─── SECCIÓN 1: HERO ─── */}
        <section style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '5rem 1.25rem 4rem',
        }}>
          <div style={{ width: '100%', maxWidth: '560px' }}>

            {/* Eyebrow restringido */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              marginBottom: '28px',
            }}>
              <span style={{
                display: 'inline-block', width: '6px', height: '6px',
                background: C.cyan, borderRadius: '50%',
              }} />
              <span style={{
                fontSize: '0.65rem', fontFamily: "'Roboto Mono', monospace",
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: C.cyan,
              }}>
                Protocolo de Due Diligence — Acceso Restringido
              </span>
            </div>

            {/* H1 */}
            <h1 style={{
              fontSize: 'clamp(2rem, 5.5vw, 3rem)',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700, color: C.white,
              lineHeight: 1.15, marginBottom: '20px',
            }}>
              Corrección Técnica del Déficit Estructural de Ingresos.
            </h1>

            {/* H2 */}
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
              color: C.mutedLight, lineHeight: 1.65,
              marginBottom: '28px',
              fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: '0.02em',
            }}>
              Un escrutinio logístico de 5 días para desvincular definitivamente su flujo de caja de su desgaste biológico.
            </p>

            {/* Párrafo diagnóstico */}
            <p style={{
              fontSize: '0.9rem', color: C.muted, lineHeight: 1.75,
              marginBottom: '40px',
              padding: '20px 24px',
              borderLeft: `2px solid ${C.gold}`,
              background: 'rgba(200,168,75,0.04)',
            }}>
              Si el 100% de su rentabilidad actual depende de su presencia física, usted no posee un negocio; opera bajo una vulnerabilidad de arquitectura patrimonial. Esta auditoría no provee motivación. Transfiere los planos técnicos para acoplar una infraestructura digital propia a una cadena de suministro operativa en más de 70 países.
            </p>

            {/* FORMULARIO */}
            <form onSubmit={handleSubmit}>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '28px 24px 24px',
                marginBottom: '0',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{
                      display: 'block', fontSize: '0.62rem',
                      color: '#94A3B8', marginBottom: '8px',
                      fontFamily: "'Roboto Mono', monospace",
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                    }}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Carlos Mendoza"
                      value={formData.nombre}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      required
                      className="ap-input"
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block', fontSize: '0.62rem',
                      color: '#94A3B8', marginBottom: '8px',
                      fontFamily: "'Roboto Mono', monospace",
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                    }}>
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      placeholder="correo@dominio.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="ap-input"
                    />
                    <p style={{
                      fontSize: '0.65rem', color: C.muted, marginTop: '6px',
                      fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.06em',
                    }}>
                      Recibirá las coordenadas de acceso aquí.
                    </p>
                  </div>
                  <div>
                    <label style={{
                      display: 'block', fontSize: '0.62rem',
                      color: '#94A3B8', marginBottom: '8px',
                      fontFamily: "'Roboto Mono', monospace",
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                    }}>
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+57 300 000 0000"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                      required
                      className="ap-input"
                    />
                    <p style={{
                      fontSize: '0.65rem', color: C.muted, marginTop: '6px',
                      fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.06em',
                    }}>
                      Solo para coordinar su acceso. Sin spam.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className="ap-btn-primary"
                  style={isSuccess ? { background: 'linear-gradient(135deg,#16a34a,#15803d)' } : undefined}
                >
                  {isSuccess ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Acceso Procesado
                    </span>
                  ) : isSubmitting ? 'Procesando...' : 'Solicitar Acceso a la Auditoría →'}
                </button>
              </div>

              <p style={{
                fontSize: '0.62rem', color: C.muted, textAlign: 'center',
                marginTop: '14px', fontFamily: "'Roboto Mono', monospace",
                letterSpacing: '0.08em',
              }}>
                Sin compromisos. Acceso inmediato. Sin tarjeta de crédito.
              </p>
            </form>

          </div>
        </section>

        {/* ─── SECCIÓN 2: DESGLOSE ESTRUCTURAL ─── */}
        <section style={{
          backgroundColor: C.bgSectionAlt,
          borderTop: `1px solid ${C.divider}`,
          borderBottom: `1px solid ${C.divider}`,
          padding: '5rem 1.25rem',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>

            <p style={{
              fontSize: '0.62rem', fontFamily: "'Roboto Mono', monospace",
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: C.cyan, marginBottom: '14px',
            }}>
              Temario de Validación
            </p>

            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700, color: C.white,
              marginBottom: '16px', lineHeight: 1.2,
            }}>
              Fases de Validación Logística
            </h2>

            <p style={{
              fontSize: '0.9rem', color: C.muted, lineHeight: 1.7,
              marginBottom: '36px',
            }}>
              Usted no ingresa para aprender teorías; ingresa para auditar un modelo operativo. La máquina se desglosa en 5 fases de escrutinio técnico:
            </p>

            <div>
              {PHASES.map((phase) => (
                <div key={phase.day} className="phase-card">
                  {/* Day indicator */}
                  <div style={{ flexShrink: 0, minWidth: '64px' }}>
                    <span style={{
                      fontSize: '0.62rem', fontFamily: "'Roboto Mono', monospace",
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: C.gold, fontWeight: 700,
                      display: 'block',
                    }}>
                      {phase.day}
                    </span>
                  </div>
                  {/* Content */}
                  <div>
                    <p style={{
                      fontSize: '0.7rem', fontFamily: "'Roboto Mono', monospace",
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: C.mutedLight, marginBottom: '6px',
                    }}>
                      {phase.label}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: C.muted, lineHeight: 1.65 }}>
                      {phase.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SECCIÓN 3: FILTRO DE CALIFICACIÓN ─── */}
        <section style={{ padding: '5rem 1.25rem 6rem' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>

            <p style={{
              fontSize: '0.62rem', fontFamily: "'Roboto Mono', monospace",
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: C.cyan, marginBottom: '14px',
            }}>
              Evaluación de Perfil
            </p>

            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700, color: C.white,
              marginBottom: '16px', lineHeight: 1.2,
            }}>
              Calificación Operativa Requerida
            </h2>

            <p style={{
              fontSize: '0.9rem', color: C.muted, lineHeight: 1.75,
              marginBottom: '32px',
            }}>
              El acceso a este protocolo está subvencionado por la infraestructura corporativa de CreaTuActivo. No requiere inyección de capital inicial, pero exige estricto cumplimiento operativo. Para procesar la información, usted debe garantizar:
            </p>

            {/* Requirements */}
            <div style={{
              borderTop: `1px solid ${C.divider}`,
              marginBottom: '40px',
            }}>
              {REQUIREMENTS.map((req) => (
                <div key={req.label} className="req-item">
                  <div style={{
                    flexShrink: 0, width: '6px', height: '6px',
                    background: C.gold, marginTop: '7px',
                    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  }} />
                  <div>
                    <p style={{
                      fontSize: '0.7rem', fontFamily: "'Roboto Mono', monospace",
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: C.white, marginBottom: '4px',
                    }}>
                      {req.label}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: C.muted, lineHeight: 1.65 }}>
                      {req.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Closing logic statement */}
            <p style={{
              fontSize: '0.88rem', color: C.mutedLight, lineHeight: 1.75,
              marginBottom: '32px',
              padding: '20px 24px',
              borderLeft: `2px solid ${C.bgCardBorder}`,
            }}>
              Si los números de la arquitectura se sostienen ante su análisis, evaluaremos su activación. De lo contrario, descarta la integración sin exposición de capital.
            </p>

            {/* Secondary CTA — scrolls back to form or submits */}
            <a href="#form-top" style={{ textDecoration: 'none' }}>
              <button
                className="ap-btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              >
                Iniciar Diagnóstico Estructural →
              </button>
            </a>
          </div>
        </section>

        {/* FOOTER MÍNIMO */}
        <footer style={{
          padding: '1.25rem 2rem',
          textAlign: 'center',
          color: C.muted,
          fontSize: '0.65rem',
          fontFamily: "'Roboto Mono', monospace",
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          borderTop: `1px solid ${C.bgCardBorder}`,
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
        }}>
          <Link href="/privacidad" style={{ color: C.muted, textDecoration: 'none' }}>
            Política de Privacidad
          </Link>
          <span>© 2026 CreaTuActivo.com</span>
        </footer>
      </main>
    </>
  );
}
