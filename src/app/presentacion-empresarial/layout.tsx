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
  title: 'Calculadora Ingreso Residual Gano Excel | Simula Tus Ganancias MLM 2025',
  description: 'Calculadora oficial ingreso residual Gano Excel Colombia 2025. Simula ganancias multinivel con paquetes ESP-1, ESP-2, ESP-3. Proyecciones realistas, compensación binaria + unilevel. Presentación empresarial completa.',
  keywords: 'calculadora ingreso residual gano excel, simulador ganancias gano excel, plan compensación gano excel, presentación empresarial gano excel, calculadora mlm, ganancias multinivel gano excel colombia',
  authors: [{ name: 'CreaTuActivo.com' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://creatuactivo.com/presentacion-empresarial',
    title: 'Calculadora Ingreso Residual Gano Excel | Simula Tus Ganancias MLM 2025',
    description: 'Calculadora oficial ingreso residual Gano Excel Colombia. Simula ganancias con ESP-1, ESP-2, ESP-3. Proyecciones realistas compensación binaria + unilevel.',
    siteName: 'CreaTuActivo.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora Ingreso Residual Gano Excel | Simula Ganancias MLM',
    description: 'Simula tus ganancias Gano Excel Colombia. Calculadora oficial con ESP-1, ESP-2, ESP-3. Binario + unilevel.',
    creator: '@creatuactivo',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PresentacionEmpresarialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
