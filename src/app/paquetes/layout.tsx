/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

import type { Metadata } from 'next';

// Copy aprobado por el Director (1 oct 2026). Hasta ese día Google mostraba «2025» y
// tres precios equivocados ($300 / $600 / $1200 USD) a quien buscaba cuánto cuesta:
// 218 apariciones en 90 días, en la posición 5. «Afiliarse» se queda a propósito: es
// la palabra que la gente escribe en el buscador. Los precios van solo en pesos (el
// tráfico es colombiano) y salen de la misma tabla que muestra la página; si cambian
// allá, se cambian aquí. Nada de comisiones al lado de un precio.
const TITULO = 'Cuánto cuesta afiliarse a Gano Excel 2026 | Paquetes';
const DESCRIPCION = 'Precios 2026 en Colombia: Kit de Inicio $443.600, ESP-1 $900.000, ESP-2 $2.250.000 y ESP-3 $4.500.000 COP. Qué incluye cada paquete y cómo se inicia.';

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  keywords: 'cuánto cuesta afiliarse gano excel, precios gano excel 2026, paquetes gano excel colombia, afiliación gano excel precios, kit de inicio gano excel, esp-1 esp-2 esp-3 gano excel',
  authors: [{ name: 'CreaTuActivo.com' }],
  alternates: { canonical: 'https://creatuactivo.com/paquetes' },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://creatuactivo.com/paquetes',
    title: TITULO,
    description: DESCRIPCION,
    siteName: 'CreaTuActivo.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITULO,
    description: DESCRIPCION,
    creator: '@creatuactivo',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PaquetesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
