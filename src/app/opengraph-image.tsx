/**
 * Copyright © 2026 CreaTuActivo.com
 * OpenGraph Image - Quiet Luxury Branding
 * Estilo: Private Equity / Banca Privada
 */

import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'CreaTuActivo | Sea dueño de su propia empresa digital'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  // Logo 3D bimetálico — bundled vía import.meta.url para que esté disponible en build/edge
  const logoData = await fetch(
    new URL('../../public/images/logotipo.png', import.meta.url)
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
            background: 'radial-gradient(ellipse at 50% 30%, rgba(197, 160, 89, 0.08) 0%, transparent 60%)',
            display: 'flex',
          }}
        />

        {/* Logo 3D bimetálico */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={108}
          height={108}
          src={logoData as unknown as string}
          alt="CreaTuActivo"
          style={{ marginBottom: 20 }}
        />

        {/* Wordmark */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: '#A3A3A3',
            marginBottom: 32,
            letterSpacing: '0.3em',
            display: 'flex',
            textTransform: 'uppercase',
          }}
        >
          CreaTuActivo
        </div>

        {/* Título principal */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 300,
            color: '#E5E5E5',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'Georgia, serif',
          }}
        >
          <span style={{ display: 'flex' }}>Sea dueño de su propia</span>
          <span style={{ display: 'flex', color: '#C5A059', fontWeight: 400 }}>empresa digital</span>
        </div>

        {/* Descripción */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: '#A3A3A3',
            textAlign: 'center',
            display: 'flex',
            marginTop: 18,
            maxWidth: 820,
            lineHeight: 1.5,
          }}
        >
          Un negocio que vive en internet y trabaja por usted. Hoy, gracias a la inteligencia artificial, cualquiera puede tenerla.
        </div>

        {/* Footer - Byline */}
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
            Luis Cabrejo Parra — Dirección Corporativa
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
            Operación en 70 países
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
