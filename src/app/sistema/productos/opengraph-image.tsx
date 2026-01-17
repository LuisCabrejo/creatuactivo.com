/**
 * Copyright © 2025 CreaTuActivo.com
 * OpenGraph Image - Catálogo de Productos
 * Estilo: Quiet Luxury / Premium Boutique
 */

import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Catálogo de Productos - Infraestructura Bioactiva Global'
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
            background: 'radial-gradient(ellipse at 50% 30%, rgba(197, 160, 89, 0.06) 0%, transparent 60%)',
            display: 'flex',
          }}
        />

        {/* Badge */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: '#C5A059',
            marginBottom: 40,
            letterSpacing: '0.2em',
            display: 'flex',
            textTransform: 'uppercase',
            padding: '10px 24px',
            border: '1px solid rgba(197, 160, 89, 0.3)',
            borderRadius: 100,
          }}
        >
          Infraestructura Global
        </div>

        {/* Título principal */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 300,
            color: '#E5E5E5',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'Georgia, serif',
          }}
        >
          <span style={{ display: 'flex' }}>Catálogo de</span>
          <span style={{ display: 'flex', color: '#C5A059', fontWeight: 400 }}>Productos</span>
        </div>

        {/* Subtítulo */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: '#A3A3A3',
            textAlign: 'center',
            display: 'flex',
            marginTop: 20,
          }}
        >
          Extracto exclusivo de Ganoderma Lucidum · 200+ Fitonutrientes
        </div>

        {/* Footer */}
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
            CreaTuActivo.com
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
            Distribución en 70+ Países desde 1995
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
