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
  divider: 'rgba(255,255,255,0.08)',
};

const PHASES = [
  {
    day: 'Día 1',
    label: 'EL DIAGNÓSTICO',
    desc: 'Dónde está la fuga: por qué hoy su ingreso depende de que usted no pare.',
  },
  {
    day: 'Día 2',
    label: 'EL TECHO',
    desc: 'Por qué hacerlo todo a mano siempre topa con un límite — y cómo se rompe.',
  },
  {
    day: 'Día 3',
    label: 'LA MÁQUINA',
    desc: 'Cómo se unen el respaldo de una empresa en 70 países y la inteligencia artificial que filtra por usted.',
  },
  {
    day: 'Día 4',
    label: 'LOS NÚMEROS',
    desc: 'La matemática clara del ingreso recurrente: de dónde sale y cómo crece.',
  },
  {
    day: 'Día 5',
    label: 'LA DECISIÓN',
    desc: 'Con todo sobre la mesa, usted decide si arranca o no. Sin presión.',
  },
];

const REQUIREMENTS = [
  {
    label: '20 minutos al día',
    desc: 'El tiempo de un café para ver el material con calma.',
  },
  {
    label: 'Ganas de mirar los números',
    desc: 'Revisar las cuentas con cabeza fría y sacar sus propias conclusiones.',
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
          font-family: var(--font-sans);
          letter-spacing: 0.04em;
          transition: border-color 0.2s ease, background 0.2s ease;
          box-sizing: border-box;
        }
        .ap-input::placeholder {
          color: rgba(107,107,90,0.6);
          font-size: 0.85rem;
          letter-spacing: 0.04em;
          font-family: var(--font-sans);
        }
        .ap-input:focus {
          outline: none;
          border-color: rgba(197, 160, 89,0.5);
          background: rgba(197, 160, 89,0.04);
        }
        .ap-btn-primary {
          width: 100%;
          padding: 18px 32px;
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
          transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease;
        }
        .ap-btn-primary:hover:not(:disabled) {
          background: var(--color-bg-surface);
          border-color: var(--color-brand-hover);
          color: var(--color-brand-hover);
        }
        .ap-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }
        .ap-btn-secondary {
          width: 100%;
          padding: 16px 32px;
          background: transparent;
          color: var(--color-titanium);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid var(--color-titanium-muted);
          border-radius: var(--radius-action);
          cursor: pointer;
          font-family: var(--font-sans);
          transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease;
        }
        .ap-btn-secondary:hover {
          background: rgba(148, 163, 184, 0.06);
          border-color: var(--color-titanium);
          color: var(--color-text-body);
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
            <Image src="/images/logotipo-CreaTuActivo.com.webp" alt="CreaTuActivo" width={32} height={32} priority style={{ objectFit: 'contain' }} />
            <span style={{
              fontSize: '1rem', fontWeight: 700, color: C.white,
              fontFamily: "var(--font-sans)", letterSpacing: '0.08em',
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
                fontSize: '0.65rem', fontFamily: "var(--font-mono)",
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: C.cyan,
              }}>
                Diagnóstico gratuito de 5 días · Acceso por invitación
              </span>
            </div>

            {/* H1 */}
            <h1 style={{
              fontSize: 'clamp(2rem, 5.5vw, 3rem)',
              fontFamily: "var(--font-serif)",
              fontWeight: 700, color: C.white,
              lineHeight: 1.15, marginBottom: '20px',
            }}>
              ¿Su ingreso se detiene el día que usted se detiene?
            </h1>

            {/* H2 */}
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
              color: C.mutedLight, lineHeight: 1.65,
              marginBottom: '28px',
              fontFamily: "var(--font-sans)",
              letterSpacing: '0.02em',
            }}>
              En 5 días le mostramos, con números claros, cómo construir un negocio digital que sigue produciendo aunque usted no trabaje — apoyado en una empresa que ya opera en 70 países.
            </p>

            {/* Párrafo diagnóstico */}
            <p style={{
              fontSize: '0.9rem', color: C.muted, lineHeight: 1.75,
              marginBottom: '40px',
              padding: '20px 24px',
              borderLeft: `2px solid ${C.gold}`,
              background: 'rgba(197, 160, 89,0.04)',
            }}>
              Hoy su ingreso depende de una sola cosa: que usted siga trabajando. Si para —por salud, por cansancio, por un imprevisto—, el dinero también para. Esto no es motivación: son los pasos claros para construir, en paralelo y sin dejar lo que hace hoy, un ingreso que no dependa de sus horas. La parte pesada la hace una empresa con presencia en 70 países; la tecnología filtra a los interesados por usted.
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
                      fontFamily: "var(--font-mono)",
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
                      fontFamily: "var(--font-mono)",
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
                  </div>
                  <div>
                    <label style={{
                      display: 'block', fontSize: '0.62rem',
                      color: '#94A3B8', marginBottom: '8px',
                      fontFamily: "var(--font-mono)",
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
                      Listo, ya quedó
                    </span>
                  ) : isSubmitting ? 'Procesando...' : 'Quiero mi diagnóstico gratis →'}
                </button>
              </div>

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
              fontSize: '0.62rem', fontFamily: "var(--font-mono)",
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: C.cyan, marginBottom: '14px',
            }}>
Qué verá en los 5 días
            </p>

            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontFamily: "var(--font-serif)",
              fontWeight: 700, color: C.white,
              marginBottom: '16px', lineHeight: 1.2,
            }}>
Los 5 días, paso a paso
            </h2>

            <p style={{
              fontSize: '0.9rem', color: C.muted, lineHeight: 1.7,
              marginBottom: '36px',
            }}>
              Aquí no viene a "aprender teoría". Viene a revisar, con números, si esto le sirve. Un día a la vez:
            </p>

            <div>
              {PHASES.map((phase) => (
                <div key={phase.day} className="phase-card">
                  {/* Day indicator */}
                  <div style={{ flexShrink: 0, minWidth: '64px' }}>
                    <span style={{
                      fontSize: '0.62rem', fontFamily: "var(--font-mono)",
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
                      fontSize: '0.7rem', fontFamily: "var(--font-mono)",
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
              fontSize: '0.62rem', fontFamily: "var(--font-mono)",
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: C.cyan, marginBottom: '14px',
            }}>
¿Es para usted?
            </p>

            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontFamily: "var(--font-serif)",
              fontWeight: 700, color: C.white,
              marginBottom: '16px', lineHeight: 1.2,
            }}>
Lo único que le pedimos
            </h2>

            <p style={{
              fontSize: '0.9rem', color: C.muted, lineHeight: 1.75,
              marginBottom: '32px',
            }}>
              El acceso es gratis: lo cubre CreaTuActivo. No tiene que poner un peso. Solo le pedimos dos cosas para que le saque provecho:
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
                      fontSize: '0.7rem', fontFamily: "var(--font-mono)",
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
              Si al final las cuentas le cierran, miramos juntos cómo arrancar. Si no, no pasa nada: usted no arriesgó ni un peso.
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
                Empezar mi diagnóstico gratis →
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
          fontFamily: "var(--font-mono)",
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
