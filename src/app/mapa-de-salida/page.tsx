/**
 * Copyright © 2026 CreaTuActivo.com
 * EL MAPA DE SALIDA — SQUEEZE PAGE v4.0
 * Brief Maestro Abril 2026: distraction-free, form 3 campos, copy StoryBrand
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const C = {
  gold: '#C8A84B',
  white: '#F5F5F0',
  muted: '#6B6B5A',
  bg: '#080808',
  bgCard: '#0d0d0d',
  bgCardBorder: '#1a1a1a',
  cyan: '#22D3EE',
};

export default function MapaDeSalidaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nombre: '', email: '', whatsapp: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [constructorRef, setConstructorRef] = useState<string | null>(null);

  useEffect(() => {
    const match = window.location.pathname.match(/\/mapa-de-salida\/([^/?#]+)/);
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
          source: 'mapa-de-salida',
          step: 'mapa_registered',
          constructor_ref: constructorRef ?? localStorage.getItem('constructor_ref') ?? undefined,
        }),
      });

      if (!response.ok) throw new Error('Error');
      setIsSuccess(true);
      setTimeout(() => router.push('/mapa-de-salida/gracias'), 1000);
    } catch {
      router.push('/mapa-de-salida/gracias');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .mapa-input {
          width: 100%;
          padding: 16px;
          background: #111;
          border: 0;
          border-bottom: 2px solid #333;
          color: ${C.white};
          font-size: 1rem;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 0.03em;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }
        .mapa-input::placeholder {
          color: ${C.muted};
          font-size: 0.9rem;
        }
        .mapa-input:focus {
          outline: none;
          border-bottom-color: ${C.gold};
        }
        .mapa-btn {
          width: 100%;
          padding: 18px 32px;
          background: linear-gradient(135deg, ${C.gold}, #A8881F);
          color: #000;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: 0;
          cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
          transition: all 0.2s ease;
        }
        .mapa-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(200,168,75,0.35);
        }
        .mapa-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}} />

      <main style={{
        minHeight: '100vh',
        backgroundColor: C.bg,
        color: C.white,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* HEADER — logo centrado, sin nav */}
        <header style={{ padding: '1.5rem', textAlign: 'center', borderBottom: `1px solid ${C.bgCardBorder}` }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Image src="/header.png" alt="CreaTuActivo" width={36} height={36} priority style={{ objectFit: 'contain' }} />
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: C.white, fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>
              CreaTuActivo
            </span>
          </Link>
        </header>

        {/* FORM AREA */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1.25rem',
        }}>
          <div style={{ width: '100%', maxWidth: '520px' }}>

            {/* Eyebrow */}
            <p style={{
              fontSize: '0.7rem', fontFamily: "'Roboto Mono', monospace",
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: C.cyan, textAlign: 'center', marginBottom: '20px',
            }}>
              Tu primer paso
            </p>

            {/* H1 */}
            <h1 style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 600, color: C.white,
              textAlign: 'center', lineHeight: 1.2,
              marginBottom: '16px',
            }}>
              Tu Mapa de Salida está listo.
            </h1>

            {/* Subtítulo */}
            <p style={{
              textAlign: 'center', color: C.muted,
              fontSize: '1rem', lineHeight: 1.7,
              marginBottom: '32px', maxWidth: '420px', margin: '0 auto 32px',
            }}>
              5 días para entender si existe una salida del Plan por Defecto para alguien con tu perfil.
              Sin compromisos. Sin presión. Solo información.
            </p>

            {/* Lo que recibirás */}
            <div style={{
              background: C.bgCard, border: `1px solid ${C.bgCardBorder}`,
              padding: '20px 24px', marginBottom: '28px',
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}>
              <p style={{ fontSize: '0.7rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.15em', textTransform: 'uppercase', color: C.cyan, marginBottom: '14px' }}>
                Lo que recibirás
              </p>
              {[
                { tiempo: 'Hoy', texto: 'El Mapa de Salida — la arquitectura completa del modelo, directo a tu WhatsApp.' },
                { tiempo: 'Días 1–5', texto: 'Una secuencia que explica cómo funciona el modelo, qué resultados están logrando personas con tu perfil, y qué necesitarías para empezar.' },
                { tiempo: 'Tú decides', texto: 'Al final tienes la información completa para decidir si esto es para ti.' },
              ].map((item) => (
                <div key={item.tiempo} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: "'Roboto Mono', monospace", color: C.gold, fontWeight: 700, flexShrink: 0, paddingTop: '2px', minWidth: '56px' }}>
                    {item.tiempo}
                  </span>
                  <span style={{ color: C.muted, fontSize: '0.875rem', lineHeight: 1.5 }}>{item.texto}</span>
                </div>
              ))}
            </div>

            {/* FORMULARIO */}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: C.muted, marginBottom: '6px', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.05em' }}>
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Como quieres que te llamemos"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    required
                    className="mapa-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: C.muted, marginBottom: '6px', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.05em' }}>
                    Tu correo electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="mapa-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: C.muted, marginBottom: '6px', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.05em' }}>
                    Tu WhatsApp (con código de país)
                  </label>
                  <input
                    type="tel"
                    placeholder="+57 300 000 0000"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    required
                    className="mapa-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="mapa-btn"
                style={isSuccess ? { background: 'linear-gradient(135deg,#16a34a,#15803d)' } : undefined}
              >
                {isSuccess ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    ¡Mapa enviado!
                  </span>
                ) : isSubmitting ? 'Enviando...' : 'Enviarme el Mapa →'}
              </button>
            </form>

            {/* Trust copy */}
            <p style={{
              textAlign: 'center', fontSize: '0.78rem', color: C.muted,
              marginTop: '16px', lineHeight: 1.6,
            }}>
              Sin spam. Sin listas masivas. Solo el mapa y los 5 días.
              <br />Puedes salirte en cualquier momento.
            </p>
          </div>
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
