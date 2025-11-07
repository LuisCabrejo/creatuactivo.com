import { MetadataRoute } from 'next';

/**
 * Sitemap dinámico para CreaTuActivo Marketing Platform
 *
 * Este sitemap se genera automáticamente en cada build y está disponible en:
 * https://creatuactivo.com/sitemap.xml
 *
 * Google Search Console leerá este sitemap para indexar todas las páginas públicas.
 *
 * IMPORTANTE: Las rutas con [ref] (parámetros dinámicos) NO se incluyen en el sitemap
 * porque son variaciones de la misma página con tracking de referidos.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://creatuactivo.com';

  // Fecha de última modificación (actualizar cuando hagas cambios importantes)
  const lastModified = new Date('2025-11-07');

  return [
    // ========================================
    // PÁGINA PRINCIPAL
    // ========================================
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // ========================================
    // FUNDADORES (Alta prioridad - conversión)
    // ========================================
    {
      url: `${baseUrl}/fundadores`,
      lastModified,
      changeFrequency: 'daily', // Cambia diariamente (contador de cupos)
      priority: 0.95,
    },

    // ========================================
    // PRESENTACIÓN EMPRESARIAL
    // ========================================
    {
      url: `${baseUrl}/presentacion-empresarial`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // ========================================
    // ECOSISTEMA (Framework IAA - Activar)
    // ========================================
    {
      url: `${baseUrl}/ecosistema`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/ecosistema/academia`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ecosistema/comunidad`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // ========================================
    // MODELO DE VALOR
    // ========================================
    {
      url: `${baseUrl}/modelo-de-valor`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // ========================================
    // PAQUETES Y PLANES (Conversión)
    // ========================================
    {
      url: `${baseUrl}/paquetes`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/planes`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // ========================================
    // SISTEMA (Framework IAA - Información técnica)
    // ========================================
    {
      url: `${baseUrl}/sistema/framework-iaa`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/sistema/tecnologia`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sistema/productos`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sistema/socio-corporativo`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
    },

    // ========================================
    // SOLUCIONES (6 arquetipos de usuarios)
    // ========================================
    {
      url: `${baseUrl}/soluciones/profesional-con-vision`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/soluciones/emprendedor-negocio`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/soluciones/independiente-freelancer`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/soluciones/lider-del-hogar`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/soluciones/lider-comunidad`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/soluciones/joven-con-ambicion`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
    },

    // ========================================
    // LEGAL
    // ========================================
    {
      url: `${baseUrl}/privacidad`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
