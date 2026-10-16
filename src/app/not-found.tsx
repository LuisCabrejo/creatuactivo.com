/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * La página 404 (16 oct 2026). Hasta hoy no existía y Next.js servía la suya,
 * en inglés («404: This page could not be found.»), sin menú ni marca y con el
 * orbe del layout raíz flotando encima — en el celular, el de WhatsApp.
 *
 * Tres salidas, en el orden de las preguntas de quien llega (el del menú), y sin
 * orbe (<SinOrbe />): la Home ya lo tiene, con el video. Copy aprobado por el
 * Director el 16 oct 2026.
 *
 * ⚠️ El enlace del socio sin la parte final (creatuactivo.com/{slug}) ya no
 * llega aquí: lo atiende src/app/[slug]/page.tsx.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'
import SinOrbe from '@/components/SinOrbe'
import TituloEnCliente from '@/components/TituloEnCliente'

const TITULO = 'Página no encontrada'

export const metadata: Metadata = {
  title: TITULO,
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
      {/* El HTML trae el título de `metadata`, pero Next.js 14.2 pone el de la Home
          al dibujar la página en el navegador: TituloEnCliente lo devuelve. */}
      <TituloEnCliente titulo={`${TITULO} | CreaTuActivo`} />
      <SinOrbe />
      <StrategicNavigation />

      {/* <div> y no <main>: el layout ya envuelve cada página en el único <main> del sitio. */}
      <div
        className="flex items-center justify-center px-4"
        style={{
          minHeight: 'calc(100vh - 72px)',
          background:
            'radial-gradient(ellipse 70% 55% at 30% 0%, rgba(148,163,184,0.09) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 75% 10%, rgba(197,160,89,0.07) 0%, transparent 65%), var(--color-bg-primary)',
        }}
      >
        <div className="w-full max-w-xl py-16 text-center">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--color-data)' }}>
            Error 404
          </p>
          <h1 className="mb-6 font-serif text-4xl text-white md:text-5xl">
            Esta página no existe
          </h1>
          <p className="mb-10 text-base leading-relaxed md:text-lg" style={{ color: 'var(--color-text-body)' }}>
            Puede que el enlace esté incompleto o que la página haya cambiado de lugar.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="cta-base cta-primary whitespace-nowrap">Ir al inicio</Link>
            <Link href="/servilleta" className="cta-base cta-secondary whitespace-nowrap">Ver la presentación</Link>
            <Link href="/productos" className="cta-base cta-secondary whitespace-nowrap">Ver los productos</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
