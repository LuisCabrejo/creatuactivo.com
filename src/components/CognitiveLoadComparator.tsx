'use client';

import { useState } from 'react';

const GOLD  = '#C8A84B';
const CYAN  = '#22D3EE';
const WHITE = '#F5F5F0';
const MUTED = '#6B6B5A';
const ALERT = 'rgba(244,63,94,0.75)';
const BG    = '#080808';

const variables = [
  {
    id: 'logistica',
    label: 'Logística y Manufactura',
    tradicional: 100,
    queswa: 0,
    absorbida: true,
  },
  {
    id: 'prospeccion',
    label: 'Prospección y Filtrado',
    tradicional: 100,
    queswa: 8,
    absorbida: true,
  },
  {
    id: 'cierre',
    label: 'Cierre y Activación',
    tradicional: 100,
    queswa: 20,
    absorbida: true,
  },
  {
    id: 'educacion',
    label: 'Educación Técnica',
    tradicional: 100,
    queswa: 15,
    absorbida: true,
  },
  {
    id: 'direccion',
    label: 'Dirección Estratégica',
    tradicional: 15,
    queswa: 100,
    absorbida: false,
  },
];

export default function CognitiveLoadComparator() {
  const [activo, setActivo] = useState(false);

  return (
    <div style={{
      background: BG,
      border: `1px solid rgba(200,168,75,0.2)`,
      borderRadius: 'var(--radius-container)',
      padding: '36px 32px',
      maxWidth: '760px',
      margin: '0 auto',
    }}>

      {/* Encabezado */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: '0.65rem', letterSpacing: '0.22em',
          textTransform: 'uppercase', color: MUTED, marginBottom: '8px',
        }}>
          Hacerlo a mano… o con Queswa
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: "'Roboto Mono', monospace", fontSize: '0.72rem',
            letterSpacing: '0.14em', color: MUTED,
          }}>
            ASÍ SE VE:
          </span>
          <span style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: '0.85rem',
            fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: activo ? GOLD : 'rgba(244,63,94,0.9)',
            transition: 'color 0.6s ease-in-out',
          }}>
            {activo ? '▸ Con Queswa · El Método Comprobado' : '▸ A mano, como siempre'}
          </span>

          {/* Métrica resumen */}
          <span style={{
            marginLeft: 'auto',
            fontFamily: "'Roboto Mono', monospace", fontSize: '0.7rem',
            color: MUTED, letterSpacing: '0.1em',
          }}>
            Trabajo sobre sus hombros:{' '}
            <span style={{
              color: activo ? CYAN : 'rgba(244,63,94,0.9)',
              fontWeight: 700, transition: 'color 0.6s ease-in-out',
            }}>
              {activo ? 'CASI NADA' : 'TODO'}
            </span>
          </span>
        </div>
      </div>

      {/* Barras */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '36px' }}>
        {variables.map((v) => {
          const valor    = activo ? v.queswa : v.tradicional;
          const esDireccion = v.id === 'direccion';
          const barColor = esDireccion
            ? (activo ? `linear-gradient(90deg, rgba(200,168,75,0.4), ${GOLD})` : 'rgba(107,107,90,0.35)')
            : (activo ? `linear-gradient(90deg, rgba(34,211,238,0.15), rgba(34,211,238,0.35))` : `linear-gradient(90deg, rgba(244,63,94,0.3), ${ALERT})`);

          return (
            <div key={v.id}>
              {/* Label + valor */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{
                  fontFamily: "'Rajdhani', sans-serif", fontSize: '0.9rem',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: esDireccion && activo ? GOLD : WHITE,
                  transition: 'color 0.6s ease-in-out',
                }}>
                  {v.label}
                </span>
                <span style={{
                  fontFamily: "'Roboto Mono', monospace", fontSize: '0.8rem',
                  color: esDireccion && activo ? GOLD : (activo && v.absorbida ? CYAN : WHITE),
                  transition: 'color 0.6s ease-in-out',
                }}>
                  {valor}%
                </span>
              </div>

              {/* Barra */}
              <div style={{
                width: '100%', height: esDireccion ? '10px' : '7px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '2px', overflow: 'hidden',
                position: 'relative',
              }}>
                <div style={{
                  height: '100%',
                  width: `${valor}%`,
                  background: barColor,
                  transition: 'width 0.75s ease-in-out, background 0.6s ease-in-out',
                  borderRadius: '2px',
                }} />
              </div>

              {/* Label "absorbida" */}
              {v.absorbida && (
                <p style={{
                  fontFamily: "'Roboto Mono', monospace", fontSize: '0.62rem',
                  letterSpacing: '0.1em', marginTop: '5px',
                  color: CYAN,
                  opacity: activo ? 0.75 : 0,
                  transform: activo ? 'translateY(0)' : 'translateY(-4px)',
                  transition: 'opacity 0.5s ease-in-out 0.4s, transform 0.5s ease-in-out 0.4s',
                  pointerEvents: 'none',
                }}>
                  ↳ Lo asume el sistema por usted
                </p>
              )}

              {/* Label "usted aquí" para Dirección */}
              {esDireccion && (
                <p style={{
                  fontFamily: "'Roboto Mono', monospace", fontSize: '0.62rem',
                  letterSpacing: '0.1em', marginTop: '5px',
                  color: GOLD,
                  opacity: activo ? 1 : 0,
                  transform: activo ? 'translateY(0)' : 'translateY(-4px)',
                  transition: 'opacity 0.5s ease-in-out 0.5s, transform 0.5s ease-in-out 0.5s',
                  pointerEvents: 'none',
                }}>
                  ↳ Lo único que queda en sus manos: dirigir
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Divisor */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: '24px' }} />

      {/* Botón toggle */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => setActivo(!activo)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '14px 36px',
            background: 'var(--color-bg-elevated)',
            border: `1px solid var(--color-brand)`,
            color: 'var(--color-brand)',
            fontFamily: 'var(--font-sans)', fontWeight: 600,
            fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            borderRadius: 'var(--radius-action)',
            cursor: 'pointer',
            transition: 'background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease',
          }}
        >
          {activo ? (
            <>
              <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>←</span>
              Volver a hacerlo a mano
            </>
          ) : (
            <>
              <span style={{ fontSize: '0.9rem' }}>▸</span>
              Ver con Queswa
            </>
          )}
        </button>
      </div>

    </div>
  );
}
