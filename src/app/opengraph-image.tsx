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
export const alt = 'CreaTuActivo.com - Tu Ecosistema, Tu Activo, Tu Futuro'
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
        {/* Logo marca */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#94a3b8',
            marginBottom: 40,
            letterSpacing: '0.1em',
            display: 'flex',
          }}
        >
          CREATUACTIVO
        </div>

        {/* Título principal gigante */}
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 50%, #F59E0B 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            lineHeight: 1,
            marginBottom: 50,
            display: 'flex',
            flexDirection: 'column',
            letterSpacing: '-0.03em',
          }}
        >
          <span style={{ display: 'flex', marginBottom: 15 }}>CONSTRUYE</span>
          <span style={{ display: 'flex' }}>ACTIVOS</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: '#fff',
            textAlign: 'center',
            display: 'flex',
          }}
        >
          No Solo Ingresos
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            fontSize: 28,
            color: '#64748b',
            fontWeight: 600,
            display: 'flex',
          }}
        >
          Framework IAA · Ecosistema Completo
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
