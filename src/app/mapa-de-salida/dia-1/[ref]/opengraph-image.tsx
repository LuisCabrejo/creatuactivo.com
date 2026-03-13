/**
 * Copyright © 2026 CreaTuActivo.com
 * OpenGraph image — Mapa de Salida · Coordenada 1
 */

import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Coordenada 1: Por qué sudas mucho, pero no avanzas · CreaTuActivo.com'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0B0C0C',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* ── Barra amber superior ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 5,
          background: 'linear-gradient(90deg, #F59E0B, #E5C279, #F59E0B)',
          display: 'flex',
        }} />

        {/* ── Líneas diagonales decorativas ── */}
        <div style={{
          position: 'absolute', top: -60, right: 180,
          width: 3, height: 900,
          background: 'rgba(56,189,248,0.08)',
          transform: 'rotate(18deg)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', top: -60, right: 240,
          width: 1, height: 900,
          background: 'rgba(56,189,248,0.05)',
          transform: 'rotate(18deg)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', top: -60, right: 130,
          width: 1, height: 900,
          background: 'rgba(229,194,121,0.06)',
          transform: 'rotate(18deg)',
          display: 'flex',
        }} />

        {/* ── Panel lateral derecho ── */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 340,
          background: '#16181D',
          borderLeft: '1px solid rgba(229,194,121,0.12)',
          display: 'flex',
        }} />

        {/* ── Contenido principal ── */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          padding: '52px 60px 48px 60px',
          position: 'relative',
          zIndex: 10,
        }}>

          {/* ── Columna izquierda ── */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingRight: 60,
          }}>

            {/* Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{
                width: 10, height: 10,
                background: '#38BDF8',
                transform: 'rotate(45deg)',
                display: 'flex', flexShrink: 0,
              }} />
              <span style={{
                fontSize: 13, color: '#38BDF8',
                letterSpacing: '0.22em', fontFamily: 'monospace', display: 'flex',
              }}>
                EL MAPA DE SALIDA · COORDENADA 1 DE 5
              </span>
            </div>

            {/* Título */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{
                fontSize: 72, fontWeight: 700,
                color: '#E5C279', lineHeight: 0.95,
                letterSpacing: '-0.01em', display: 'flex',
                fontFamily: 'Georgia, serif',
              }}>
                POR QUÉ SUDAS
              </div>
              <div style={{
                fontSize: 72, fontWeight: 700,
                color: '#FFFFFF', lineHeight: 0.95,
                letterSpacing: '-0.01em', display: 'flex',
                fontFamily: 'Georgia, serif',
              }}>
                MUCHO, PERO NO
              </div>
              <div style={{
                fontSize: 72, fontWeight: 700,
                color: '#FFFFFF', lineHeight: 0.95,
                letterSpacing: '-0.01em', display: 'flex',
                fontFamily: 'Georgia, serif',
              }}>
                AVANZAS
              </div>
            </div>

            {/* Separador */}
            <div style={{
              width: 64, height: 2,
              background: '#F59E0B',
              marginTop: 28, marginBottom: 24,
              display: 'flex',
            }} />

            {/* Subtítulo */}
            <div style={{
              fontSize: 22, color: '#A3A3A3',
              lineHeight: 1.45, display: 'flex', maxWidth: 620,
            }}>
              La falla estructural del "Plan por Defecto" que te mantiene
              corriendo sin llegar a ningún lado.
            </div>
          </div>

          {/* ── Columna derecha — Panel ── */}
          <div style={{
            width: 340,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
          }}>

            {/* Número grande */}
            <div style={{
              fontSize: 148, fontWeight: 900,
              color: '#F59E0B', lineHeight: 1,
              display: 'flex', letterSpacing: '-0.04em',
            }}>
              1
            </div>

            <div style={{
              fontSize: 15, fontWeight: 700,
              color: '#64748B', letterSpacing: '0.22em',
              display: 'flex', marginTop: -8,
            }}>
              COORDENADA
            </div>

            {/* Separador */}
            <div style={{
              width: 48, height: 1,
              background: 'rgba(229,194,121,0.25)',
              margin: '20px 0', display: 'flex',
            }} />

            {/* Items del video */}
            {[
              'La bicicleta estática',
              'El Plan por Defecto',
              'Vehículo equivocado',
              'Número de Fragilidad',
              'Tu ruta de escape',
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '6px 0',
                borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{
                  fontSize: 11, color: '#38BDF8',
                  fontFamily: 'monospace', display: 'flex', minWidth: 20,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 13, color: '#6B7280', display: 'flex' }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0, height: 52,
          background: '#16181D',
          borderTop: '1px solid rgba(229,194,121,0.10)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 60px', zIndex: 10,
        }}>
          <span style={{
            fontSize: 16, color: '#E5C279',
            fontWeight: 600, letterSpacing: '0.04em', display: 'flex',
          }}>
            CreaTuActivo.com
          </span>
          <span style={{
            fontSize: 13, color: '#374151',
            letterSpacing: '0.12em', fontFamily: 'monospace', display: 'flex',
          }}>
            MAPA DE SALIDA · VIDEO GRATUITO
          </span>
        </div>

      </div>
    ),
    { ...size }
  )
}
