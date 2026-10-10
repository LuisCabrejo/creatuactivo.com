/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La imagen de los pares de la modernización para las tarjetas al compartir
 * (30 sep 2026). La usan dos tarjetas y SOLO cambia el rótulo de arriba:
 *  · /servilleta             → «CreaTuActivo · Plan servilleta» (la presentación única desde el 10 oct 2026)
 *  · /{slug}/queswa (/og/queswa) y los enlaces de los videos → «CreaTuActivo · Queswa»
 *
 * Por qué los pares: son marcas que la persona ya usa, el patrón se entiende sin
 * explicarlo, y es lo que al Director le funciona en el 1-a-1 (resolvió el «ah,
 * es como Herbalife»). ⚠️ «Network marketing» NO va en una tarjeta: viaja sin la
 * voz del socio y se reenvía a cualquiera.
 *
 * ⚠️ EL TAMAÑO SE MIDE, NO SE SUPONE. satori no recorta: cuando un hijo en flujo
 * desborda, DESCARTA todo lo que no va en position:absolute y la tarjeta sale casi
 * vacía, con 200 y con un PNG que pesa lo normal. Le pasó a la de /nosotros. El
 * contenido ocupa ~410 de los 470 px útiles. Antes de subir un cambio, renderice y
 * MIRE.
 */

import { ImageResponse } from 'next/og'
import { fuentesInter } from '@/lib/og-fuentes'

export const TAMANO_OG = { width: 1200, height: 630 }

const PARES: [string, string][] = [
  ['Domicilios', 'Rappi'],
  ['Taxis', 'Uber'],
  ['La fila del banco', 'Nequi'],
]

export async function tarjetaModernizacion(
  rotulo: string,
  opciones?: { headers?: Record<string, string> }
) {
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
          {rotulo}
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
    { ...TAMANO_OG, fonts, headers: opciones?.headers }
  )
}
