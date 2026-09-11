/**
 * Copyright © 2026 CreaTuActivo.com
 * Tarjeta (Open Graph) de la Home — Quiet Luxury, carbón + champán.
 *
 * 11 sep 2026 — quedó igual a la del enlace de Queswa (src/app/og/queswa/route.tsx)
 * por tres razones:
 *
 *  (1) El titular decía "Un segundo ingreso, en paralelo al que ya tiene" mientras
 *      el título que WhatsApp imprime DEBAJO ya decía el H1 nuevo: dos titulares
 *      distintos en la misma tarjeta. Y ese titular es el que el Director descartó
 *      el 29 ago para la tarjeta de Queswa — un amigo dice "le tengo un negocio",
 *      no "le tengo un segundo ingreso". El ingreso baja al cuerpo de la página.
 *  (2) La descripción a 26px y el pie a 18px no se leen en la miniatura. Aquí va
 *      solo lo que se lee: logotipo, marca y titular.
 *  (3) Un mismo socio comparte la Home y el enlace de Queswa: dos tarjetas con la
 *      misma estructura son una sola identidad.
 *
 * El ORO carga la cláusula, no el nombre del activo: en miniatura el ojo cae
 * primero en la línea dorada, y la novedad es la cualidad. Las dos líneas tienen
 * 39 caracteres cada una — bloque parejo a 50px.
 */

import { ImageResponse } from 'next/og'
import { fuentesInter } from '@/lib/og-fuentes'

export const runtime = 'edge'
export const alt = 'Sea dueño de un sistema de distribución que no depende de que usted esté encima'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  // Logo 3D bimetálico — bundled vía import.meta.url para que esté disponible en build/edge
  const [logoData, fonts] = await Promise.all([
    fetch(new URL('../../public/images/logotipo.png', import.meta.url)).then((res) => res.arrayBuffer()),
    fuentesInter(),
  ])

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
          fontFamily: 'Inter',
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
          width={132}
          height={132}
          src={logoData as unknown as string}
          alt="CreaTuActivo"
          style={{ marginBottom: 28 }}
        />

        {/* Wordmark */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: '#A3A3A3',
            marginBottom: 40,
            letterSpacing: '0.3em',
            display: 'flex',
            textTransform: 'uppercase',
          }}
        >
          CreaTuActivo
        </div>

        {/* Titular — el H1 de la Home, entero */}
        <div
          style={{
            fontSize: 46,
            fontWeight: 700,
            color: '#E5E5E5',
            textAlign: 'center',
            lineHeight: 1.2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'Inter',
          }}
        >
          <span style={{ display: 'flex' }}>Sea dueño de un sistema de distribución</span>
          <span style={{ display: 'flex', color: '#C5A059' }}>que no depende de que usted esté encima</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  )
}
