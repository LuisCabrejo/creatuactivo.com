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
      // ⛔ Funnel reto / diagnóstico / mapa-de-salida ELIMINADO (jul 2026): meses de pruebas con
      // cero conversión. Páginas /empresa-digital, /confirmacion, /diagnostico borradas del repo.
      // Funnel vigente: reel → Queswa → 1-a-1. Cualquier URL vieja del funnel → Home.
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
      {
        source: '/negocio-digital',
        destination: '/',
        permanent: true,
      },
      {
        source: '/negocio-digital/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/auditoria-patrimonial',
        destination: '/',
        permanent: true,
      },
      {
        source: '/auditoria-patrimonial/:path*',
        destination: '/',
        permanent: true,
      },

      // /nosotros → /manifiesto (renombrado por coherencia con /{slug}/manifiesto)
      {
        source: '/nosotros',
        destination: '/manifiesto',
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

      // Páginas antiguas eliminadas → Home
      {
        source: '/soluciones/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ecosistema',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ecosistema/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/sistema/framework-iaa',
        destination: '/',
        permanent: true,
      },
      {
        source: '/sistema/tecnologia',
        destination: '/',
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
