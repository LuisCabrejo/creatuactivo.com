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
 * PÁGINAS EXCLUIDAS (noindex o herramientas internas):
 * - /fundadores → registro por invitación 1-a-1, no se posiciona (decisión 14 ago 2026)
 * - /presentacion-empresarial → herramienta interna 1-a-1, noindex
 * - /nosotros, /12-niveles, /lexico, /planes → noindex
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://creatuactivo.com';

  // Fecha de última modificación (actualizar cuando hagas cambios importantes)
  const lastModified = new Date('2026-08-14');

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
    // TECNOLOGÍA QUESWA (Brand Search SEO)
    // Captura búsquedas: "queswa", "creatuactivo queswa"
    // ========================================
    {
      url: `${baseUrl}/tecnologia`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // ========================================
    // SISTEMA (Páginas SEO de producto)
    // ========================================
    {
      url: `${baseUrl}/productos`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
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
  ];
}
