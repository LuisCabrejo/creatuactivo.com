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
          {/* Icono C dorada */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #F5D670 50%, #D4AF37 100%)',
              boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
            }}
          >
            <span
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#0a0a0f',
                fontFamily: 'Georgia, serif',
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
