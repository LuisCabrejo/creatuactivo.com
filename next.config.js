/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // ✅ Optimización CSS crítico - Reduce render-blocking (PageSpeed)
  experimental: {
    optimizeCss: true,
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
    ]
  },
}

module.exports = nextConfig
