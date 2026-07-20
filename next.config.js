/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // ✅ Headers de cache y Service Worker
  async headers() {
    return [
      // Service Worker — nunca cachear
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      // API routes — sin cache
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
      // Páginas HTML estáticas — cache CDN 24h, stale 7 días
      {
        source: '/((?!api|_next/static|_next/image|favicon|sw\\.js).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
    ]
  },

  // ✅ Redirects permanentes (301)
  async redirects() {
    return [
      // ⛔ DEPRECADO (22 jun 2026): el funnel reto/diagnóstico se retiró — meses de pruebas con
      // CERO clics. Todo /empresa-digital (squeeze + dia-1..5, videos de léxico viejo) → Home, para
      // que nadie tropiece con páginas muertas. El cron reto-5-dias quedó apagado (vercel.json) y
      // arsenal_reto marcado deprecado. Funnel vigente: reel → Queswa → 1-a-1. Los redirects legacy
      // que apuntaban a /empresa-digital hacen doble salto hasta Home (aceptable: URLs muertas).
      {
        source: '/empresa-digital',
        destination: '/',
        permanent: true,
      },
      {
        source: '/empresa-digital/:path*',
        destination: '/',
        permanent: true,
      },

      // /nosotros → /manifiesto (renombrado por coherencia con /{slug}/manifiesto)
      {
        source: '/nosotros',
        destination: '/manifiesto',
        permanent: true,
      },

      // ✅ RENAME 12 jun 2026: /negocio-digital → /empresa-digital (funnel entry — léxico "empresa digital")
      // Cubre correos/reels/blogs ya publicados con la URL anterior (incl. /dia-1..5, [constructorId]).
      {
        source: '/negocio-digital',
        destination: '/empresa-digital',
        permanent: true,
      },
      {
        source: '/negocio-digital/:path*',
        destination: '/empresa-digital/:path*',
        permanent: true,
      },

      // RENAME jun 2026 (previo): /auditoria-patrimonial → ahora directo a /empresa-digital (1 salto)
      {
        source: '/auditoria-patrimonial',
        destination: '/empresa-digital',
        permanent: true,
      },
      {
        source: '/auditoria-patrimonial/:path*',
        destination: '/empresa-digital/:path*',
        permanent: true,
      },

      // Reto 12 días / Reto 12 niveles (slugs legacy) → /12-niveles
      {
        source: '/reto-12-dias',
        destination: '/12-niveles',
        permanent: true,
      },
      {
        source: '/reto-12-dias/:ref',
        destination: '/12-niveles/:ref',
        permanent: true,
      },
      {
        source: '/reto-12-niveles',
        destination: '/12-niveles',
        permanent: true,
      },
      {
        source: '/reto-12-niveles/:ref',
        destination: '/12-niveles/:ref',
        permanent: true,
      },

      // ✅ PIVOTE V3.0: Reto 5 Días → El Mapa de Salida
      {
        source: '/reto-5-dias',
        destination: '/empresa-digital',
        permanent: true,
      },
      {
        source: '/reto-5-dias/gracias',
        destination: '/confirmacion',
        permanent: true,
      },
      {
        source: '/reto-5-dias/:path*',
        destination: '/empresa-digital',
        permanent: true,
      },

      // Soluciones → El Mapa de Salida (funnel principal)
      {
        source: '/soluciones/:path*',
        destination: '/empresa-digital',
        permanent: true,
      },

      // Fundadores redundantes → Fundadores principal
      {
        source: '/fundadores-network',
        destination: '/fundadores',
        permanent: true,
      },
      {
        source: '/fundadores-network/:ref',
        destination: '/fundadores/:ref',
        permanent: true,
      },
      {
        source: '/fundadores-profesionales',
        destination: '/fundadores',
        permanent: true,
      },
      {
        source: '/fundadores-profesionales/:ref',
        destination: '/fundadores/:ref',
        permanent: true,
      },

      // Ecosistema → El Mapa de Salida
      {
        source: '/ecosistema',
        destination: '/empresa-digital',
        permanent: true,
      },
      {
        source: '/ecosistema/:path*',
        destination: '/empresa-digital',
        permanent: true,
      },

      // Sistema páginas eliminadas → El Mapa de Salida
      {
        source: '/sistema/framework-iaa',
        destination: '/empresa-digital',
        permanent: true,
      },
      {
        source: '/sistema/tecnologia',
        destination: '/empresa-digital',
        permanent: true,
      },

      // ✅ PIVOTE v4.0: Mapa de Salida → Auditoría de Arquitectura Patrimonial
      // IMPORTANTE: reglas específicas ANTES del wildcard :constructorId
      {
        source: '/mapa-de-salida',
        destination: '/empresa-digital',
        permanent: true,
      },
      {
        source: '/mapa-de-salida/gracias',
        destination: '/confirmacion',
        permanent: true,
      },
      // ✅ RENAME jun 2026: /auditoria-confirmada → /confirmacion (Bridge — léxico retirado)
      {
        source: '/auditoria-confirmada',
        destination: '/confirmacion',
        permanent: true,
      },
      {
        source: '/mapa-de-salida/dia-1/:ref',
        destination: '/empresa-digital/dia-1/:ref',
        permanent: true,
      },
      {
        source: '/mapa-de-salida/dia-1',
        destination: '/empresa-digital/dia-1',
        permanent: true,
      },
      {
        source: '/mapa-de-salida/dia-2',
        destination: '/empresa-digital/dia-2',
        permanent: true,
      },
      {
        source: '/mapa-de-salida/dia-3',
        destination: '/empresa-digital/dia-3',
        permanent: true,
      },
      {
        source: '/mapa-de-salida/dia-4',
        destination: '/empresa-digital/dia-4',
        permanent: true,
      },
      {
        source: '/mapa-de-salida/dia-5',
        destination: '/empresa-digital/dia-5',
        permanent: true,
      },
      // Wildcard al final — captura refs de constructorId no cubiertos arriba
      {
        source: '/mapa-de-salida/:constructorId',
        destination: '/empresa-digital/:constructorId',
        permanent: true,
      },

      // Productos → Infraestructura (página renombrada)
      {
        source: '/productos',
        destination: '/infraestructura',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
