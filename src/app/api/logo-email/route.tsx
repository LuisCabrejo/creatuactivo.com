/**
 * Copyright © 2025 CreaTuActivo.com
 * Logo dinámico para emails - Quiet Luxury Style
 * URL: /api/logo-email
 */

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          padding: '10px',
        }}
      >
        {/* Logo Container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {/* Icono C dorada - igual al favicon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              backgroundColor: '#D4AF37',
            }}
          >
            <span
              style={{
                fontSize: '30px',
                fontWeight: 500,
                color: '#0a0a0f',
                fontFamily: "Georgia, 'Playfair Display', serif",
              }}
            >
              C
            </span>
          </div>

          {/* Texto CreaTuActivo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              fontSize: '24px',
              fontWeight: 500,
              color: '#f5f5f5',
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '-0.02em',
            }}
          >
            <span>Crea</span>
            <span style={{ color: '#D4AF37', fontWeight: 600 }}>Tu</span>
            <span>Activo</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 280,
      height: 80,
    }
  );
}
