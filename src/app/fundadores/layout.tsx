/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lista Privada Fundadores - CreaTuActivo.com',
  description: '🚀 150 cupos exclusivos para fundadores pioneros. Únete a la primera fase de CreaTuActivo y conviértete en mentor de 150 constructores. Acceso limitado del 10 Nov al 30 Nov 2025.',
  keywords: 'fundadores, lista privada, mentores, CreaTuActivo, constructores de riqueza, oportunidad exclusiva, Framework IAA',
  authors: [{ name: 'CreaTuActivo.com' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://creatuactivo.com/fundadores',
    title: '🚀 Lista Privada Fundadores - Solo 150 Cupos',
    description: 'Únete como FUNDADOR pionero. Mentorea a 150 constructores y construye tu ecosistema empresarial desde el inicio. Cupos limitados hasta el 30 Nov 2025.',
    siteName: 'CreaTuActivo.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🚀 Lista Privada Fundadores - Solo 150 Cupos',
    description: 'Conviértete en FUNDADOR pionero y mentor de 150 constructores. Acceso exclusivo hasta el 30 Nov 2025.',
    creator: '@creatuactivo',
  },
}

export default function FundadoresLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
