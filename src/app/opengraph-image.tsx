/**
 * Copyright © 2025 CreaTuActivo.com
 * OpenGraph Image - Quiet Luxury Branding
 * Estilo: Private Equity / Banca Privada
 */

import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'CreaTuActivo - Estrategia de Soberanía Financiera'
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
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Subtle gold gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse at 50% 30%, rgba(197, 160, 89, 0.08) 0%, transparent 60%)',
            display: 'flex',
          }}
        />

        {/* Logo marca */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: '#A3A3A3',
            marginBottom: 50,
            letterSpacing: '0.3em',
            display: 'flex',
            textTransform: 'uppercase',
          }}
        >
          CreaTuActivo
        </div>

        {/* Título principal */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 300,
            color: '#E5E5E5',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'Georgia, serif',
          }}
        >
          <span style={{ display: 'flex' }}>Estrategia de</span>
          <span style={{ display: 'flex', color: '#C5A059', fontWeight: 400 }}>Soberanía Financiera</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: '#A3A3A3',
            textAlign: 'center',
            display: 'flex',
            marginTop: 30,
            maxWidth: 800,
          }}
        >
          Construye el chasis que te permita detenerte sin que todo colapse.
        </div>

        {/* Footer - Byline */}
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            display: 'flex',
            alignItems: 'center',
            gap: 40,
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: '#6B7280',
              fontWeight: 400,
              display: 'flex',
            }}
          >
            Luis Cabrejo · Arquitecto de Activos
          </div>
          <div
            style={{
              width: 1,
              height: 20,
              backgroundColor: '#374151',
              display: 'flex',
            }}
          />
          <div
            style={{
              fontSize: 18,
              color: '#6B7280',
              fontWeight: 400,
              display: 'flex',
            }}
          >
            Presencia en 70+ Países
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
