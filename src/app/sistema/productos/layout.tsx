import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catálogo de Productos | CreaTuActivo',
  description: 'Descubre el único catálogo con patente mundial de extracto 100% hidrosoluble de Ganoderma Lucidum. Productos únicos respaldados por 30+ años de ciencia.',
  openGraph: {
    title: 'Catálogo de Productos | CreaTuActivo',
    description: 'Descubre el único catálogo con patente mundial de extracto 100% hidrosoluble de Ganoderma Lucidum.',
    images: [
      {
        url: '/creatuactivo-redes-productos-card-2400x1260.png',
        width: 2400,
        height: 1260,
        alt: 'CreaTuActivo - Un Producto Único respaldado por patente mundial',
      }
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catálogo de Productos | CreaTuActivo',
    description: 'Descubre el único catálogo con patente mundial de extracto 100% hidrosoluble de Ganoderma Lucidum.',
    images: ['/creatuactivo-redes-productos-card-2400x1260.png'],
  },
}

export default function ProductosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
