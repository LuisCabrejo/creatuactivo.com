/**
 * Copyright © 2026 CreaTuActivo.com
 * Tarjeta (Open Graph) del enlace de Queswa — creatuactivo.com/{slug}/queswa
 *
 * Es lo primero que ve un contacto cuando un socio le pega ese enlace en
 * WhatsApp. Hasta el 29 ago 2026 reusaba la imagen del home ("Un segundo
 * ingreso, en paralelo al que ya tiene") y el Director la cambió por dos
 * razones: (1) hablar de un ingreso de entrada pone en alerta — un amigo diría
 * "le tengo un negocio", no "le tengo un segundo ingreso"; (2) la línea de
 * descripción a 26px era ilegible en la tarjeta. Aquí va solo lo que se lee:
 * el logotipo y el titular, en el léxico vigente (canal de distribución).
 *
 * Misma estética que src/app/opengraph-image.tsx (carbón + champán). Vive como
 * route handler y no como opengraph-image.tsx dentro de [slug]/[destino]
 * porque ese archivo aplicaría a TODOS los destinos (reels, manifiesto…).
 */

import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  const logoData = await fetch(
    new URL('../../../../public/images/logotipo.png', import.meta.url)
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
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(ellipse at 50% 30%, rgba(197, 160, 89, 0.08) 0%, transparent 60%)',
            display: 'flex',
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={132}
          height={132}
          src={logoData as unknown as string}
          alt="CreaTuActivo"
          style={{ marginBottom: 28 }}
        />

        <div
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: '#A3A3A3',
            marginBottom: 40,
            letterSpacing: '0.3em',
            display: 'flex',
            textTransform: 'uppercase',
          }}
        >
          CreaTuActivo
        </div>

        <div
          style={{
            fontSize: 66,
            fontWeight: 300,
            color: '#E5E5E5',
            textAlign: 'center',
            lineHeight: 1.2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'Georgia, serif',
          }}
        >
          <span style={{ display: 'flex' }}>Sea dueño de su propio</span>
          <span style={{ display: 'flex', color: '#C5A059', fontWeight: 400 }}>canal de distribución</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' },
    }
  )
}
