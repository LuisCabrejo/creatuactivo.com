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

      // Soluciones → Reto 5 días (funnel principal)
      {
        source: '/soluciones/:path*',
        destination: '/reto-5-dias',
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
    ]
  },
}

module.exports = nextConfig
