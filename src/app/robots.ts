/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

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
 * ⚠️ /_next/ NO se bloquea (1 oct 2026): ahí viven el CSS, el JavaScript y las
 *   imágenes optimizadas (/_next/image). Google necesita cargarlos para ver la
 *   página como la ve una persona e indexar las imágenes; bloquearlos es el
 *   error que Google documenta en «no bloquee CSS ni JavaScript».
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
          '/private/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
