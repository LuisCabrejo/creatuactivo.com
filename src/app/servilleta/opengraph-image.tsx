/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * OpenGraph Image - Soberanía
 * INDUSTRIAL REALISM DESIGN v10.0
 */

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Soberanía | Diagnóstico Estructural';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

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
          backgroundColor: '#0F1115',
          backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Marco Perimetral Industrial */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px',
            border: '1px solid #334155',
            borderRadius: '0px',
            opacity: 0.5,
            display: 'flex',
          }}
        />

        {/* Badge Superior */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 16px',
            backgroundColor: 'rgba(197, 160, 89, 0.1)',
            border: '1px solid rgba(197, 160, 89, 0.3)',
            borderRadius: '4px',
            marginBottom: '40px',
          }}
        >
          <span
            style={{
              color: '#C5A059',
              fontSize: 14,
              fontFamily: 'sans-serif',
              letterSpacing: '0.2em',
              fontWeight: 700,
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            Diagnóstico Estructural v10.0
          </span>
        </div>

        {/* Título Principal */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: 130,
              color: '#E5E5E5',
              margin: 0,
              lineHeight: 0.9,
              fontWeight: 900,
              letterSpacing: '-0.05em',
              textShadow: '0 10px 30px rgba(0,0,0,0.5)',
              display: 'flex',
            }}
          >
            SOBERANÍA
          </span>

          {/* Línea Divisoria */}
          <div
            style={{
              width: '100px',
              height: '4px',
              backgroundColor: '#C5A059',
              marginTop: '30px',
              marginBottom: '30px',
              display: 'flex',
            }}
          />

          <span
            style={{
              fontSize: 32,
              color: '#94A3B8',
              margin: 0,
              fontFamily: 'sans-serif',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              fontWeight: 400,
              display: 'flex',
            }}
          >
            Arquitectura de Apalancamiento
          </span>
        </div>

        {/* Footer Técnico */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            color: '#475569',
            fontSize: 16,
            fontFamily: 'sans-serif',
            letterSpacing: '0.1em',
          }}
        >
          SYSTEM STATUS: ONLINE • CREATUACTIVO.COM
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
