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
export const alt = 'Presentación Empresarial - CreaTuActivo.com'
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
          📊
        </div>

        {/* Título principal - MUY GRANDE */}
        <div
          style={{
            fontSize: 85,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 50%, #F59E0B 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ display: 'flex' }}>TU ECOSISTEMA</span>
          <span style={{ display: 'flex' }}>TU ACTIVO</span>
        </div>

        {/* Subtítulo */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#94a3b8',
            textAlign: 'center',
            display: 'flex',
            marginBottom: 80,
          }}
        >
          Método Probado IAA
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
