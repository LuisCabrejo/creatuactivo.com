/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 */

import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Los 12 Niveles - CreaTuActivo.com'
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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1a2e 50%, #1e293b 100%)',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Efecto de fuego/gradiente de fondo */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #DC2626, #F59E0B, #FBBF24, #F59E0B, #DC2626)',
            display: 'flex',
          }}
        />

        {/* Badge superior */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'linear-gradient(135deg, #DC2626, #F59E0B)',
            padding: '12px 32px',
            borderRadius: '50px',
            marginBottom: '30px',
          }}
        >
          <span style={{ fontSize: 28, display: 'flex' }}>🔥</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '0.1em', display: 'flex' }}>
            ARRANCAMOS HOY
          </span>
          <span style={{ fontSize: 28, display: 'flex' }}>🔥</span>
        </div>

        {/* Número grande - FOCAL POINT */}
        <div
          style={{
            fontSize: 180,
            fontWeight: 900,
            color: '#FBBF24',
            lineHeight: 1,
            marginBottom: 0,
            display: 'flex',
            textShadow: '0 4px 20px rgba(251, 191, 36, 0.5)',
          }}
        >
          12
        </div>

        {/* Texto NIVELES */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1,
            marginBottom: 16,
            marginTop: -5,
            display: 'flex',
            letterSpacing: '0.15em',
          }}
        >
          NIVELES
        </div>

        {/* Subtítulo */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: '#94a3b8',
            textAlign: 'center',
            display: 'flex',
            marginBottom: 16,
          }}
        >
          El protocolo de duplicación 2×2
        </div>

        {/* Stats en línea */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            marginTop: '20px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#60A5FA', display: 'flex' }}>12</span>
            <span style={{ fontSize: 16, color: '#64748b', display: 'flex' }}>NIVELES</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#A78BFA', display: 'flex' }}>8,190</span>
            <span style={{ fontSize: 16, color: '#64748b', display: 'flex' }}>PERSONAS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#34D399', display: 'flex' }}>2×2</span>
            <span style={{ fontSize: 16, color: '#64748b', display: 'flex' }}>DUPLICACIÓN</span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 28,
            color: '#64748b',
            fontWeight: 600,
            display: 'flex',
          }}
        >
          CreaTuActivo.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
