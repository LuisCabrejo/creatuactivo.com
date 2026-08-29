/**
 * Copyright © 2026 CreaTuActivo.com
 * OG image de /nosotros (29 ago 2026 — antes, la del Manifiesto).
 * Estética Bimetálica: carbón + dorado champán + titanio.
 */

import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Nosotros - CreaTuActivo.com'
export const size = { width: 1200, height: 630 }
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
          position: 'relative',
        }}
      >
        {/* Acento dorado superior */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 6,
            background: '#C5A059',
            display: 'flex',
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            fontSize: 26,
            letterSpacing: 8,
            color: '#C5A059',
            textTransform: 'uppercase',
            marginBottom: 36,
            display: 'flex',
          }}
        >
          Nosotros
        </div>

        {/* Principio — focal point */}
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            display: 'flex',
            flexDirection: 'column',
            marginBottom: 32,
          }}
        >
          <span style={{ color: '#E5E5E5', display: 'flex' }}>Una empresa de tecnología</span>
          <span style={{ color: '#C5A059', display: 'flex' }}>para su canal de distribución.</span>
        </div>

        {/* Subtítulo */}
        <div
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: '#94A3B8',
            textAlign: 'center',
            display: 'flex',
          }}
        >
          Gano Excel fabrica · Queswa atiende · usted es el dueño
        </div>

        {/* Footer con marca */}
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
          <img width={44} height={44} src={logoData as unknown as string} alt="" />
          <span style={{ fontSize: 30, color: '#64748B', fontWeight: 600, display: 'flex' }}>
            CreaTuActivo.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
