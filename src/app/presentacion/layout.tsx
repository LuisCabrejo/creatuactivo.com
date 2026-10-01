/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /presentacion — herramienta de presentación 1-a-1 (23 sep 2026).
 *
 * Se llamó /pitch-deck hasta el 30 sep 2026: el Director cambió el nombre porque
 * «pitch deck» no pasa la prueba de la abuela. /pitch-deck y /{slug}/pitch-deck
 * siguen funcionando (redirect en next.config.js y DESTINO_MAP), así que los
 * enlaces que ya circulan no se rompen.
 *
 * noindex por decisión del Director: es una pieza que el socio conduce delante de
 * una persona, no una página que deba encontrarse en Google. /servilleta sí se
 * indexa (SEO de «plan servilleta») y sigue en pie.
 *
 * Desde el 1 oct 2026 el botón «Presentación» del menú lleva aquí y no a
 * /servilleta (Director). Quien llega desde el menú sin ?ref ve a su socio si
 * entró antes por su enlace, o al equipo si no.
 */

import type { Metadata } from 'next'
import { OG_PRESENTACION } from './og'

export const metadata: Metadata = {
  title: 'Presentación', // el layout raíz agrega « | CreaTuActivo» (template)
  description: OG_PRESENTACION.description,
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  // ⚠️ El openGraph va COMPLETO y con `url` PROPIA. noindex no tiene nada que ver
  // con esto: la página no se busca en Google, pero el socio SÍ pega el enlace en
  // un chat y ahí la tarjeta se renderiza. Y si solo se declaran title y
  // description, Meta hereda la url del layout raíz: la vista previa enlaza a la
  // portada del sitio aunque el enlace pegado sea correcto. Es la trampa de
  // «OG por página» de CLAUDE.md. La imagen la genera opengraph-image.tsx.
  // El título de la tarjeta va SIN «| CreaTuActivo»: la vista previa ya muestra
  // el dominio debajo.
  alternates: { canonical: 'https://creatuactivo.com/presentacion' },
  openGraph: {
    type: 'website',
    siteName: 'CreaTuActivo.com',
    locale: 'es_CO',
    url: 'https://creatuactivo.com/presentacion',
    title: OG_PRESENTACION.title,
    description: OG_PRESENTACION.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: OG_PRESENTACION.title,
    description: OG_PRESENTACION.description,
  },
}

export default function PresentacionLayout({ children }: { children: React.ReactNode }) {
  return children
}
