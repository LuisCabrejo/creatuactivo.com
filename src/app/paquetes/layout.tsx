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

export const metadata: Metadata = {
  title: 'Cuánto Cuesta Afiliarse a Gano Excel 2025 | Paquetes ESP-1, ESP-2, ESP-3',
  description: 'Precios oficiales afiliación Gano Excel Colombia 2025. Paquetes ESP-1 ($300 USD), ESP-2 ($600 USD), ESP-3 ($1200 USD). Incluye NodeX + NEXUS IA + mentoría. Ingresos residuales + tecnología.',
  keywords: 'cuánto cuesta afiliarse gano excel, precios gano excel 2025, paquetes gano excel colombia, afiliación gano excel precios, esp-1 esp-2 esp-3 gano excel, precio afiliación distribuidor gano excel',
  authors: [{ name: 'CreaTuActivo.com' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://creatuactivo.com/paquetes',
    title: 'Cuánto Cuesta Afiliarse a Gano Excel 2025 | Paquetes ESP-1, ESP-2, ESP-3',
    description: 'Precios oficiales afiliación Gano Excel Colombia 2025. ESP-1 ($300 USD), ESP-2 ($600 USD), ESP-3 ($1200 USD). Incluye NodeX + NEXUS IA + mentoría.',
    siteName: 'CreaTuActivo.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cuánto Cuesta Afiliarse a Gano Excel 2025 | Paquetes Oficiales',
    description: 'Precios Gano Excel Colombia 2025: ESP-1 ($300), ESP-2 ($600), ESP-3 ($1200). NodeX + IA + mentoría.',
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
