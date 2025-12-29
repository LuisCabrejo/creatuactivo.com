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
 * Sitemap dinámico para CreaTuActivo Marketing Platform
 *
 * Este sitemap se genera automáticamente en cada build y está disponible en:
 * https://creatuactivo.com/sitemap.xml
 *
 * Google Search Console leerá este sitemap para indexar todas las páginas públicas.
 *
 * PÁGINAS EXCLUIDAS (noindex - funnel interno):
 * - /reto-5-dias, /reto-5-dias/gracias → Squeeze/Bridge pages para ADS
 * - /nosotros → Epiphany Bridge, SEO en página personal Luis Cabrejo Parra
 * - /tecnologia → Diferenciador interno, sin keywords buscables
 * - /productos → Duplicado, SEO en /sistema/productos
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://creatuactivo.com';

  // Fecha de última modificación (actualizar cuando hagas cambios importantes)
  const lastModified = new Date('2025-12-29');

  return [
    // ========================================
    // PÁGINA PRINCIPAL (Funnel Hub)
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
    // BLOG - Shadow Funnel SEO Content
    // Alta prioridad para captura de tráfico orgánico
    // ========================================
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog/network-marketing-obsoleto`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/empleo-vs-activos`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/legalidad-network-marketing`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // ========================================
    // SISTEMA (Páginas SEO de producto)
    // ========================================
    {
      url: `${baseUrl}/sistema/productos`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/sistema/socio-corporativo`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // ========================================
    // MODELO DE VALOR
    // ========================================
    {
      url: `${baseUrl}/modelo-de-valor`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // ========================================
    // PAQUETES (Conversión)
    // ========================================
    {
      url: `${baseUrl}/paquetes`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },

    // ========================================
    // PRESENTACIÓN EMPRESARIAL
    // (Herramienta interna, prioridad baja en SEO)
    // ========================================
    {
      url: `${baseUrl}/presentacion-empresarial`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
