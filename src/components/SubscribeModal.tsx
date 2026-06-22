'use client';

import { useState, useEffect } from 'react';

/**
 * Modal de suscripción a la newsletter ("Manténgase al día con la IA en los
 * negocios"). Puerta de entrada suave (reemplaza el funnel de Diagnóstico jun 2026):
 * captura el correo → /api/subscribe. Controlado desde StrategicNavigation.
 */
export default function SubscribeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!isOpen) { setStatus('idle'); setEmail(''); setName(''); }
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fingerprint = (typeof window !== 'undefined' && (window as any).FrameworkIAA?.fingerprint) || null;
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, fingerprint }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', marginBottom: '12px',
    background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-action)',
    fontFamily: 'var(--font-sans)', fontSize: '0.95rem', outline: 'none',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '420px',
          background: 'var(--color-bg-elevated)', color: 'var(--color-text-primary)',
          border: '1px solid rgba(197,160,89,0.25)', borderRadius: 'var(--radius-container)',
          padding: '32px 28px', position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: 'absolute', top: '14px', right: '16px', background: 'none', border: 'none',
            color: 'var(--color-text-muted)', fontSize: '1.4rem', lineHeight: 1, cursor: 'pointer',
          }}
        >
          ×
        </button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-brand)', marginBottom: '12px' }}>
              Quedó listo.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Le escribiremos solo cuando haya algo que valga su tiempo. Sin ruido.
            </p>
            <button onClick={onClose} className="cta-base cta-secondary" style={{ marginTop: '20px' }}>
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22D3EE', marginBottom: '12px' }}>
              Manténgase al día
            </p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-text-primary)', marginBottom: '10px', lineHeight: 1.25 }}>
              La IA aplicada a construir ingresos.
            </h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, fontSize: '0.92rem', marginBottom: '20px' }}>
              Le comparto, sin ruido y a su ritmo, cómo se usa la inteligencia artificial para ser dueño de una empresa digital.
            </p>

            <input
              type="text" placeholder="Su nombre (opcional)" value={name}
              onChange={(e) => setName(e.target.value)} style={inputStyle}
            />
            <input
              type="email" placeholder="Su correo" value={email} required
              onChange={(e) => setEmail(e.target.value)} style={inputStyle}
            />

            <button type="submit" className="cta-base cta-primary" style={{ width: '100%', marginTop: '4px' }} disabled={status === 'loading'}>
              {status === 'loading' ? 'Un momento…' : 'Suscribirme'}
            </button>

            {status === 'error' && (
              <p style={{ color: 'var(--color-error)', fontSize: '0.85rem', marginTop: '12px', textAlign: 'center' }}>
                No se pudo guardar. Inténtelo de nuevo.
              </p>
            )}

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', marginTop: '16px', textAlign: 'center', lineHeight: 1.5 }}>
              Puede darse de baja cuando quiera.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
