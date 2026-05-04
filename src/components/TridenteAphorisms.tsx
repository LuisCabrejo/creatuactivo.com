'use client';

import { useState, useEffect } from 'react';

const APHORISMS = [
  { protocol: 'EXPANDIR', text: 'Usted no explica — Queswa explica.' },
  { protocol: 'ACTIVAR', text: 'Usted no convence; usted audita y autoriza.' },
  { protocol: 'MAESTRÍA', text: 'Usted no enseña; Queswa escala. Usted crece.' },
  { protocol: 'CIERRE', text: 'Usted no carga el sistema; el sistema carga la operación.' },
];

const C = {
  gold: '#C8A84B',
  cyan: '#22D3EE',
  white: '#F5F5F0',
  muted: '#6B6B5A',
};

export default function TridenteAphorisms() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % APHORISMS.length);
        setIsVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = APHORISMS[currentIndex];

  return (
    <div style={{
      position: 'relative',
      padding: '40px 24px',
      background: 'rgba(0,0,0,0.45)',
      borderTop: '1px solid rgba(200,168,75,0.15)',
      borderBottom: '1px solid rgba(200,168,75,0.15)',
      textAlign: 'center',
    }}>
      <div style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.4s ease-in-out',
        maxWidth: '760px',
        margin: '0 auto',
      }}>
        <span style={{
          fontSize: '0.75rem',
          fontFamily: "'Roboto Mono', monospace",
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: C.cyan,
          display: 'block',
          marginBottom: '16px',
        }}>
          El Tridente EAM · {current.protocol}
        </span>
        <p style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: 'italic',
          color: C.white,
          lineHeight: 1.5,
          margin: 0,
        }}>
          &ldquo;{current.text}&rdquo;
        </p>
      </div>

      {/* Indicadores de posición */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '24px',
      }}>
        {APHORISMS.map((_, i) => (
          <div key={i} style={{
            width: 24,
            height: 2,
            background: i === currentIndex ? C.gold : 'rgba(255,255,255,0.15)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>
    </div>
  );
}
