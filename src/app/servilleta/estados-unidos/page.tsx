/**
 * Copyright © 2026 CreaTuActivo.com
 * Ruta: /servilleta/estados-unidos
 *
 * La Presentación para Estados Unidos (Director, 24-26 nov 2026): el mismo deck
 * de /servilleta, que se reconoce en esta dirección (`paisDeRuta`) y cambia lo
 * que es de allá —las cifras del dolor del latino, las credenciales, los
 * dólares, el 10 % base en lugar del Kit— y la guía en texto. Dirección propia
 * para que Google la posicione en Estados Unidos; las dos se declaran con
 * hreflang. Por qué y cómo → src/lib/servilleta-pais.ts y docs/SERVILLETA.md.
 *
 * Es una ruta fija, así que gana sobre /servilleta/[constructorId] (el enlace
 * viejo con el socio en la ruta).
 */

import type { Metadata } from 'next';
import Presentacion from '../page';
import { IDIOMAS_SERVILLETA, RUTA_SERVILLETA } from '@/lib/servilleta-pais';

const TITULO = 'Plan servilleta Gano Excel en Estados Unidos: presentación 2026';
const DESCRIPCION =
  'La presentación del plan servilleta de Gano Excel para Estados Unidos, en español y en dólares, con un simulador del plan de compensación. Por CreaTuActivo, distribuidores independientes.';
const URL_PAGINA = `https://creatuactivo.com${RUTA_SERVILLETA.US}`;

export const metadata: Metadata = {
  // Sin «oficial», igual que la de Colombia: un distribuidor no se presenta como
  // la página de la marca.
  title: TITULO,
  description: DESCRIPCION,
  keywords: [
    'plan servilleta gano excel estados unidos',
    'plan servilleta gano excel usa',
    'gano excel usa',
    'gano excel estados unidos',
    'plan de compensacion gano excel usa',
    'presentacion gano excel en español',
  ],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    title: TITULO,
    url: URL_PAGINA,
    description: 'La presentación del plan servilleta de Gano Excel para Estados Unidos, con un simulador del plan de compensación. Por CreaTuActivo, distribuidores independientes.',
    type: 'website',
    locale: 'es_US',
    siteName: 'CreaTuActivo',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITULO,
    description: 'La presentación del plan servilleta de Gano Excel para Estados Unidos, por CreaTuActivo, distribuidores independientes.',
  },
  alternates: {
    canonical: RUTA_SERVILLETA.US,
    languages: IDIOMAS_SERVILLETA,
  },
};

export default function ServilletaEstadosUnidos() {
  return <Presentacion />;
}
