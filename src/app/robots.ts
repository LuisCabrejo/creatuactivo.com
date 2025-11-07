import { MetadataRoute } from 'next';

/**
 * Robots.txt dinámico para CreaTuActivo Marketing Platform
 *
 * Este archivo controla qué rutas pueden ser rastreadas por los motores de búsqueda.
 *
 * BLOQUEADO (Disallow):
 * - /api/* - Endpoints de API (NEXUS, fundadores, etc.)
 * - /dashboard/* - Panel de administración (si existe en el futuro)
 * - /admin/* - Área administrativa
 * - /_next/* - Archivos internos de Next.js
 * - /private/* - Contenido privado
 *
 * PERMITIDO (implícito):
 * - Todas las demás rutas públicas
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://creatuactivo.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // Bloquear todos los endpoints de API
          '/dashboard/',     // Bloquear dashboard (si existe)
          '/admin/',         // Bloquear área administrativa
          '/_next/',         // Bloquear archivos internos de Next.js
          '/private/',       // Bloquear contenido privado
          '/*.json$',        // Bloquear archivos JSON directos
          '/tracking.js',    // Bloquear script de tracking (no necesita indexarse)
        ],
      },
      // Reglas específicas para Google
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/admin/',
          '/_next/',
          '/private/',
        ],
      },
      // Reglas específicas para Bing
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/admin/',
          '/_next/',
          '/private/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
