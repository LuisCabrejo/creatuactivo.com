/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * OpenGraph Image - Industrial Deck v5.1
 * QUESWA.SYS Industrial Design
 */

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Infraestructura de Multiplicación | QUESWA.SYS';
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
          backgroundColor: '#121212',
          backgroundImage: 'radial-gradient(#37474f 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          fontFamily: 'sans-serif',
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
            border: '1px solid #37474f',
            borderRadius: '0px',
            opacity: 0.5,
            display: 'flex',
          }}
        />

        {/* Badge Superior - QUESWA.SYS */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 16px',
            backgroundColor: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '4px',
            marginBottom: '40px',
          }}
        >
          <span
            style={{
              color: '#00e5ff',
              fontSize: 14,
              letterSpacing: '0.2em',
              fontWeight: 700,
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            QUESWA.SYS // The Industrial Deck v5.1
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
              fontSize: 90,
              color: '#e0e0e0',
              margin: 0,
              lineHeight: 0.9,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              textShadow: '0 10px 30px rgba(0,0,0,0.5)',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            INFRAESTRUCTURA
          </span>
          <span
            style={{
              fontSize: 90,
              color: '#e0e0e0',
              margin: 0,
              lineHeight: 0.9,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              textShadow: '0 10px 30px rgba(0,0,0,0.5)',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            DE MULTIPLICACIÓN
          </span>

          {/* Línea Divisoria - Cyan industrial */}
          <div
            style={{
              width: '100px',
              height: '4px',
              backgroundColor: '#00e5ff',
              marginTop: '30px',
              marginBottom: '30px',
              boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)',
              display: 'flex',
            }}
          />

          <span
            style={{
              fontSize: 28,
              color: '#9e9e9e',
              margin: 0,
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
            color: '#37474f',
            fontSize: 16,
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
