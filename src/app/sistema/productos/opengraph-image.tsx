/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Productos Gano Excel - CreaTuActivo.com'
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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '80px',
        }}
      >
        {/* Ícono reducido */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 30,
            display: 'flex',
          }}
        >
          📦
        </div>

        {/* Título principal */}
        <div
          style={{
            fontSize: 95,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            lineHeight: 1,
            marginBottom: 30,
            display: 'flex',
            letterSpacing: '-0.02em',
          }}
        >
          GANO EXCEL
        </div>

        {/* Subtítulo */}
        <div
          style={{
            fontSize: 46,
            fontWeight: 700,
            color: '#fff',
            textAlign: 'center',
            marginBottom: 20,
            display: 'flex',
          }}
        >
          Fórmula Exclusiva Mundial
        </div>

        {/* Detalle */}
        <div
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: '#94a3b8',
            display: 'flex',
            marginBottom: 80,
          }}
        >
          Ganoderma Lucidum
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            fontSize: 32,
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
