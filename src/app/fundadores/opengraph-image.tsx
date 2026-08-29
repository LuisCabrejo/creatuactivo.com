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

// Configuración de la imagen
export const runtime = 'edge'
export const alt = 'Fundadores - CreaTuActivo.com'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  const logoData = await fetch(
    new URL('../../../public/images/logotipo.png', import.meta.url)
  ).then((res) => res.arrayBuffer())

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
          background: 'linear-gradient(135deg, #0F1115 0%, #15171C 100%)',
          padding: '80px',
        }}
      >
        {/* Número grande - FOCAL POINT */}
        <div
          style={{
            fontSize: 200,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #C5A059 0%, #D4AF37 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            lineHeight: 1,
            marginBottom: 20,
            display: 'flex',
          }}
        >
          15
        </div>

        {/* Texto principal - MUY GRANDE */}
        <div
          style={{
            fontSize: 90,
            fontWeight: 900,
            color: '#fff',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 30,
            display: 'flex',
            flexDirection: 'column',
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ display: 'flex' }}>FUNDADORES</span>
        </div>

        {/* Subtítulo - GRANDE */}
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: '#94a3b8',
            textAlign: 'center',
            display: 'flex',
          }}
        >
          Un núcleo de socios estratégicos
        </div>

        {/* Footer minimalista con marca */}
        <div
          style={{
            position: 'absolute',
            bottom: 44,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img width={48} height={48} src={logoData as unknown as string} alt="" />
          <span style={{ fontSize: 32, color: '#64748b', fontWeight: 600, display: 'flex' }}>
            CreaTuActivo.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
