/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Tarjeta Open Graph de /presentacion (24 sep 2026; rehecha el 30 sep).
 *
 * POR QUÉ EXISTE: la página es noindex, pero el socio PEGA el enlace en un chat
 * después de la reunión, y ahí la tarjeta sí se renderiza. Sin un `openGraph`
 * propio en su layout, Meta hereda el del layout raíz y la vista previa enlaza a
 * la portada del sitio aunque el enlace pegado sea correcto — la trampa
 * documentada en CLAUDE.md, «OG por página».
 *
 * LA IMAGEN DETIENE LA MIRADA; el título y la descripción (og.ts) hacen otros dos
 * trabajos. Hasta el 30 sep 2026 los tres repetían «una empresa de distribución
 * moderna». Ahora la imagen lleva los pares de la modernización —lo que al
 * Director le funciona en el 1-a-1— y su frase debajo. El patrón se entiende sin
 * explicarlo. ⛔ NO se copia el registro de la tarjeta de /servilleta
 * («QUESWA.SYS», cian de protagonista): es léxico retirado.
 *
 * ⚠️ EL TAMAÑO SE MIDE, NO SE SUPONE. satori no recorta: cuando un hijo en flujo
 * desborda, DESCARTA todo lo que no va en position:absolute y la tarjeta sale casi
 * vacía, con 200 y con un PNG que pesa lo normal. Le pasó a la de /nosotros. El
 * contenido ocupa ~410 de los 470 px útiles. Antes de subir un cambio, renderice y
 * MIRE.
 */

import { ImageResponse } from 'next/og'
import { fuentesInter } from '@/lib/og-fuentes'

export const runtime = 'edge'
export const alt = 'Domicilios a Rappi, taxis a Uber, la fila del banco a Nequi | CreaTuActivo'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PARES: [string, string][] = [
  ['Domicilios', 'Rappi'],
  ['Taxis', 'Uber'],
  ['La fila del banco', 'Nequi'],
]

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
            marginBottom: 30,
            display: 'flex',
          }}
        >
          CreaTuActivo · Presentación
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            width: 820,
          }}
        >
          {PARES.map(([de, a]) => (
            <div
              key={a}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <span style={{ display: 'flex', width: 400, fontSize: 40, color: '#878681' }}>{de}</span>
              <span style={{ display: 'flex', width: 80, fontSize: 40, color: '#C5A059' }}>→</span>
              <span style={{ display: 'flex', fontSize: 48, fontWeight: 700, color: '#FFFFFF' }}>{a}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: 28,
            color: '#C8C7C2',
            lineHeight: 1.35,
            marginTop: 30,
            display: 'flex',
            maxWidth: 960,
          }}
        >
          Hay una oportunidad enorme en modernizar industrias que están frente a nuestros ojos.
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
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
