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
      clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
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
          Comparador de Carga Operativa
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: "'Roboto Mono', monospace", fontSize: '0.72rem',
            letterSpacing: '0.14em', color: MUTED,
          }}>
            MODO ACTIVO:
          </span>
          <span style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: '0.85rem',
            fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: activo ? GOLD : 'rgba(244,63,94,0.9)',
            transition: 'color 0.6s ease-in-out',
          }}>
            {activo ? '▸ Protocolo Queswa' : '▸ Operación Tradicional'}
          </span>

          {/* Métrica resumen */}
          <span style={{
            marginLeft: 'auto',
            fontFamily: "'Roboto Mono', monospace", fontSize: '0.7rem',
            color: MUTED, letterSpacing: '0.1em',
          }}>
            Fricción Operativa:{' '}
            <span style={{
              color: activo ? CYAN : 'rgba(244,63,94,0.9)',
              fontWeight: 700, transition: 'color 0.6s ease-in-out',
            }}>
              {activo ? 'MÍNIMA' : 'CRÍTICA'}
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
                  ↳ Asumido por Infraestructura Híbrida
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
                  ↳ Capacidad operativa total bajo su control directo
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
            background: activo ? 'rgba(200,168,75,0.08)' : `linear-gradient(135deg, ${GOLD}, #B8941F)`,
            border: activo ? `1px solid ${GOLD}` : 'none',
            color: activo ? GOLD : '#000',
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
            fontSize: '0.9rem', letterSpacing: '0.14em', textTransform: 'uppercase',
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
            cursor: 'pointer',
            transition: 'background 0.4s ease-in-out, color 0.4s ease-in-out, border 0.4s ease-in-out',
          }}
        >
          {activo ? (
            <>
              <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>✕</span>
              Desactivar Protocolo Queswa
            </>
          ) : (
            <>
              <span style={{ fontSize: '0.9rem' }}>▸</span>
              Activar Protocolo Queswa
            </>
          )}
        </button>
      </div>

    </div>
  );
}
