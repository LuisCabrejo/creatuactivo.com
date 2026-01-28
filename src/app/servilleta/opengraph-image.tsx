/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * OpenGraph Image - Servilleta Digital
 * BIMETALLIC DESIGN SYSTEM v3.0
 */

import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Servilleta Digital - Arquitectura de Apalancamiento | CreaTuActivo'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F1115',
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* Subtle gold radial glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse at 50% 30%, rgba(197, 160, 89, 0.08) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top label */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#C5A059',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: 24,
            display: 'flex',
          }}
        >
          Servilleta Digital
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'Georgia, serif',
          }}
        >
          <span style={{ display: 'flex' }}>Arquitectura de</span>
          <span style={{ display: 'flex', color: '#C5A059' }}>Apalancamiento</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: '#94A3B8',
            textAlign: 'center',
            marginBottom: 48,
            display: 'flex',
          }}
        >
          La trampa · La solución · Tu rol · El dinero
        </div>

        {/* 4 tab indicators */}
        <div
          style={{
            display: 'flex',
            gap: 16,
          }}
        >
          {[
            { label: 'La Trampa', color: '#FF8A80' },
            { label: 'La Solución', color: '#C5A059' },
            { label: 'Tu Rol', color: '#94A3B8' },
            { label: 'El Dinero', color: '#C5A059' },
          ].map((tab) => (
            <div
              key={tab.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 24px',
                borderRadius: 999,
                border: `1px solid ${tab.color}40`,
                background: `${tab.color}10`,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: tab.color,
                  display: 'flex',
                }}
              />
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: tab.color,
                  display: 'flex',
                }}
              >
                {tab.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 600, color: '#C5A059', display: 'flex' }}>
            CreaTuActivo
          </span>
          <span style={{ fontSize: 24, color: '#475569', display: 'flex' }}>·</span>
          <span style={{ fontSize: 20, color: '#64748B', fontWeight: 500, display: 'flex' }}>
            Acceso Privado
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
