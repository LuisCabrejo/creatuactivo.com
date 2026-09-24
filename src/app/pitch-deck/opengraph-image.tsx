/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Tarjeta Open Graph de /pitch-deck (24 sep 2026).
 *
 * POR QUÉ EXISTE: la página es noindex, pero el socio PEGA el enlace en un chat
 * antes o después de la reunión, y ahí la tarjeta sí se renderiza. Sin un
 * `openGraph` propio en su layout, Meta hereda el del layout raíz y la vista
 * previa enlaza a la portada del sitio aunque el enlace pegado sea correcto —
 * la trampa documentada en CLAUDE.md, «OG por página».
 *
 * EL COPY es el de la pantalla 2 del deck, palabra por palabra: nombra el objeto
 * y deja el veredicto sin resolver. No promete nada y no se puede rebatir.
 * ⛔ NO se copia el registro de la tarjeta de /servilleta («QUESWA.SYS»,
 * «Infraestructura de Multiplicación», cian de protagonista): es léxico retirado
 * y la estética industrial anterior.
 *
 * ⚠️ EL TAMAÑO DEL TITULAR SE MIDE, NO SE SUPONE. satori no recorta: cuando un
 * hijo en flujo desborda, DESCARTA todo lo que no va en position:absolute y la
 * tarjeta sale casi vacía, con 200 y con un PNG que pesa lo normal. Le pasó a la
 * de /nosotros. La línea larga aquí es «DISTRIBUCIÓN MODERNA» (20 caracteres) y
 * a 72px mide ~890px contra los 1.040 útiles. Antes de subirlo, renderice y MIRE.
 */

import { ImageResponse } from 'next/og'
import { fuentesInter } from '@/lib/og-fuentes'

export const runtime = 'edge'
export const alt = 'Una empresa de distribución moderna | CreaTuActivo'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const fonts = await fuentesInter()

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0F1115 0%, #15171C 100%)',
          padding: '80px',
          position: 'relative',
          fontFamily: 'Inter',
        }}
      >
        {/* Filete dorado superior — la firma de las tarjetas de la casa.
            ⚠️ El ancho va en PÍXELES y no en '100%': en satori el porcentaje de un
            absoluto se resuelve contra la caja de CONTENIDO, así que con el padding
            de 80 el filete medía 1.040 y se quedaba a 160px del borde derecho. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 6,
            background: '#C5A059',
            display: 'flex',
          }}
        />

        <div
          style={{
            fontSize: 24,
            letterSpacing: 8,
            color: '#22D3EE',
            textTransform: 'uppercase',
            marginBottom: 34,
            display: 'flex',
          }}
        >
          CreaTuActivo · Presentación
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.08,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            Una empresa de
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#C5A059',
              lineHeight: 1.08,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            distribución moderna
          </span>
        </div>

        <div
          style={{
            width: 96,
            height: 2,
            background: '#C5A059',
            marginTop: 38,
            marginBottom: 32,
            display: 'flex',
          }}
        />

        <div
          style={{
            fontSize: 30,
            color: '#C8C7C2',
            lineHeight: 1.4,
            display: 'flex',
            maxWidth: 900,
          }}
        >
          Hasta hace poco, tener una era casi imposible.
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 46,
            left: 80,
            fontSize: 20,
            letterSpacing: 4,
            color: '#878681',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          creatuactivo.com
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
