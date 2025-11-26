/**
 * Copyright © 2025 CreaTuActivo.com
 * Generador de Open Graph Image para Brasil
 */

import { ImageResponse } from 'next/og'

// Configuración de la imagen
export const runtime = 'edge'
export const alt = 'Gano Excel Brasil - El Gigante ha Despertado | CreaTuActivo'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      // Contenedor Principal (Fondo Oscuro Premium)
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a', // Slate 900
          backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          position: 'relative',
        }}
      >
        {/* Efecto de Luz Verde/Amarilla (Brasil) en el fondo */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '30%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(0,156,59,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '30%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(255,223,0,0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
            opacity: 0.6,
          }}
        />

        {/* Badge Superior */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0,156,59,0.2)',
            border: '1px solid rgba(0,156,59,0.4)',
            borderRadius: '50px',
            padding: '10px 30px',
            marginBottom: '40px',
          }}
        >
          <span
            style={{
              color: '#4ade80', // Green 400
              fontSize: 24,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            LANZAMIENTO 2025
          </span>
        </div>

        {/* Título Principal - BRASIL */}
        <div
          style={{
            fontSize: 130, // Tamaño masivo como en fundadores
            fontWeight: 900,
            color: 'white',
            lineHeight: 1,
            marginBottom: '10px',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
            display: 'flex',
          }}
        >
          BRASIL
        </div>

        {/* Subtítulo con Gradiente */}
        <div
          style={{
            fontSize: 50,
            fontWeight: 800,
            background: 'linear-gradient(to right, #4ade80, #facc15)', // Green to Yellow
            backgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-1px',
            marginBottom: '30px',
            textAlign: 'center',
            display: 'flex',
          }}
        >
          El Gigante ha Despertado
        </div>

        {/* Línea divisoria */}
        <div
          style={{
            width: '150px',
            height: '6px',
            background: 'linear-gradient(to right, #009c3b, #ffdf00)',
            borderRadius: '3px',
            marginBottom: '40px',
            display: 'flex',
          }}
        />

        {/* Propuesta de Valor */}
        <div
          style={{
            fontSize: 28,
            color: '#94a3b8', // Slate 400
            textAlign: 'center',
            maxWidth: '900px',
            fontWeight: 600,
            display: 'flex',
          }}
        >
          Infraestructura Física Lista. Infraestructura Digital en tus manos.
        </div>

        {/* Footer Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: 24, color: '#64748b' }}>Potenciado por</span>
          <span style={{ fontSize: 26, color: 'white', fontWeight: 700 }}>CreaTuActivo.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
