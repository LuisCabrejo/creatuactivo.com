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

  // ✅ Headers para Service Worker PWA
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ]
  },

  // ✅ Redirects permanentes (301)
  async redirects() {
    return [
      // Reto 12 días → 12 niveles
      {
        source: '/reto-12-dias',
        destination: '/reto-12-niveles',
        permanent: true,
      },
      {
        source: '/reto-12-dias/:ref',
        destination: '/reto-12-niveles/:ref',
        permanent: true,
      },

      // ✅ PIVOTE V3.0: Reto 5 Días → El Mapa de Salida
      {
        source: '/reto-5-dias',
        destination: '/mapa-de-salida',
        permanent: true,
      },
      {
        source: '/reto-5-dias/gracias',
        destination: '/mapa-de-salida/gracias',
        permanent: true,
      },
      {
        source: '/reto-5-dias/:path*',
        destination: '/mapa-de-salida',
        permanent: true,
      },

      // Soluciones → El Mapa de Salida (funnel principal)
      {
        source: '/soluciones/:path*',
        destination: '/mapa-de-salida',
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
        destination: '/mapa-de-salida',
        permanent: true,
      },
      {
        source: '/ecosistema/:path*',
        destination: '/mapa-de-salida',
        permanent: true,
      },

      // Sistema páginas eliminadas → El Mapa de Salida
      {
        source: '/sistema/framework-iaa',
        destination: '/mapa-de-salida',
        permanent: true,
      },
      {
        source: '/sistema/tecnologia',
        destination: '/mapa-de-salida',
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
