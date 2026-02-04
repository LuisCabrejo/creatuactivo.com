/**
 * Copyright © 2025 CreaTuActivo.com
 * Layout Raíz Optimizado para SEO Técnico Continental
 * Estrategia: Hreflang, Schema.org Avanzado y Performance
 */

import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Montserrat, Oswald } from 'next/font/google';
import './globals.css';
import { NEXUSFloatingButton } from '@/components/nexus';
import CookieBanner from '@/components/CookieBanner';

// THE ARCHITECT'S SUITE - Typography System
// Playfair Display: Títulos, citas, encabezados (evoca autoridad editorial)
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
});

// Montserrat: Cuerpo, botones, navegación (limpio, moderno)
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700'],
});

// Oswald: Logo y branding (condensada, bold, industrial)
const oswald = Oswald({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#C5A059' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1115' },
  ],
};

// URL Base de Producción
const baseUrl = 'https://creatuactivo.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'CreaTuActivo: Ecosistema Empresarial & Activos Digitales',
    template: '%s | CreaTuActivo'
  },
  description: 'Plataforma líder en América para construir activos patrimoniales. Tecnología NodeX + IA, infraestructura Gano Excel y mentoría de alto nivel. 150 cupos fundadores.',

  // Keywords Estratégicas (SEO Semántico)
  keywords: [
    'creatuactivo',
    'activos digitales',
    'ingresos pasivos reales',
    'franquicia digital',
    'sistema de distribución',
    'gano excel latinoamerica',
    'luis cabrejo mentor',
    'nexus ia',
    'nodex dashboard'
  ],

  authors: [{ name: 'Luis Cabrejo', url: 'https://luiscabrejo.com' }],
  creator: 'CreaTuActivo.com',
  publisher: 'CreaTuActivo Inc.',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Configuración Internacional (Hreflang) - VITAL PARA BRASIL
  alternates: {
    canonical: baseUrl,
    languages: {
      'es': baseUrl,
      'pt-BR': `${baseUrl}/paises/brasil`,
      'en-US': `${baseUrl}/en`, // Preparado para futuro
    },
  },

  icons: {
    icon: [
      { url: '/favicon-32x32.png?v=3', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png?v=3', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-16x16.png?v=3', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=3', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: [
      { url: '/favicon-32x32.png?v=3' }
    ],
  },
  manifest: '/site.webmanifest',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['pt_BR', 'en_US'],
    url: baseUrl,
    title: 'CreaTuActivo: Arquitectura de Activos Digitales',
    description: 'No es un negocio más. Es la arquitectura completa para construir tu patrimonio: Producto Patentado + Tecnología IA + Metodología Probada.',
    siteName: 'CreaTuActivo.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CreaTuActivo.com - Ecosistema de Negocios Inteligente',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'CreaTuActivo: Arquitectura de Activos Digitales',
    description: 'Transforma tu talento en activo escalable. Tecnología NodeX + IA + Infraestructura Gano Excel.',
    images: ['/og-image.jpg'],
    creator: '@creatuactivo',
  },

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'QRNGxKcHOJYRbR9hFLZfUmUlxV2ScasRQAFlb7vJC14',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD Estructurado para "Organization" y "SoftwareApplication"
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "CreaTuActivo",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`,
          "width": 512,
          "height": 512
        },
        "sameAs": [
          "https://facebook.com/creatuactivo",
          "https://instagram.com/creatuactivo",
          "https://linkedin.com/company/creatuactivo",
          "https://luiscabrejo.com"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+57-300-1234567",
          "contactType": "customer service",
          "areaServed": ["US", "CO", "MX", "BR", "PE", "EC"],
          "availableLanguage": ["Spanish", "English", "Portuguese"]
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "NodeX Dashboard",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Plataforma de gestión inteligente para constructores de redes de distribución Gano Excel.",
        "author": {
          "@id": `${baseUrl}/#organization`
        }
      },
      {
        "@type": "Person",
        "name": "Luis Cabrejo",
        "jobTitle": "Fundador & Mentor Empresarial",
        "url": "https://luiscabrejo.com",
        "sameAs": [
          "https://www.linkedin.com/in/luiscabrejo/",
          "https://instagram.com/luiscabrejo"
        ],
        "worksFor": {
          "@id": `${baseUrl}/#organization`
        }
      }
    ]
  };

  return (
    <html lang="es" className="h-full">
      <head>
        {/* ⚡ CRITICAL: Preconnects FIRST - Inyectados al inicio del head para PageSpeed */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var head = document.head;
                var first = head.firstChild;
                var origins = [
                  ['https://fonts.googleapis.com', false],
                  ['https://fonts.gstatic.com', true],
                  ['https://cvadzbmdypnbrbnkznpb.supabase.co', false]
                ];
                origins.forEach(function(o) {
                  var link = document.createElement('link');
                  link.rel = 'preconnect';
                  link.href = o[0];
                  if (o[1]) link.crossOrigin = '';
                  head.insertBefore(link, first);
                });
              })();
            `
          }}
        />

        {/* Preconnect fallback (para crawlers que no ejecutan JS) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://cvadzbmdypnbrbnkznpb.supabase.co" />
        <link rel="dns-prefetch" href="https://cvadzbmdypnbrbnkznpb.supabase.co" />

        {/* Favicons - v3 con cache-busting */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=3" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=3" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=3" />
        <link rel="manifest" href="/site.webmanifest?v=3" />

        {/* Configuración Tracking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.TRACKING_CONFIG = {
                SUPABASE_URL: '${process.env.NEXT_PUBLIC_SUPABASE_URL}',
                SUPABASE_ANON_KEY: '${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}'
              };
            `
          }}
        />
        <script src="/tracking.js" defer></script>

        {/* Schema Markup Inyectado */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${montserrat.variable} ${playfair.variable} ${oswald.variable} font-sans h-full bg-carbon text-smoke antialiased`}>
        <main className="relative">
          {children}
        </main>

        {/* ✅ PWA SERVICE WORKER v1.0.9 - Registro robusto */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) {
                      console.log('✅ [PWA] Service Worker registrado:', reg.scope);
                    })
                    .catch(function(err) {
                      console.error('❌ [PWA] Error:', err);
                    });
                });
              }
            `
          }}
        />

        {/* Scripts de Utilidad y Performance */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (window.__cta_tracking_initialized) return;
                window.__cta_tracking_initialized = true;

                if (!window.__cta_nexus_handler) {
                  window.__cta_nexus_handler = function(e) {
                    if (window.updateProspectData) window.updateProspectData(e.detail);
                  };
                  window.addEventListener('nexusMessage', window.__cta_nexus_handler);
                }
              })();
            `
          }}
        />

        <NEXUSFloatingButton />

        {/* Menú Móvil Legacy - Mantenido por compatibilidad */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function initMobileMenu() {
                if (window.__cta_mobile_menu_initialized) return;
                window.__cta_mobile_menu_initialized = true;

                function setupMobileMenu() {
                  if (window.location.pathname.startsWith('/nodex') || document.querySelector('.strategic-nav-critical')) return;

                  const menuButton = document.querySelector('[aria-label="Toggle menu"]') ||
                                    document.querySelector('[aria-label="Abrir menú"]');

                  if (!menuButton) return;

                  const mobileMenuHTML = \`
                    <div id="mobile-menu-overlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 hidden md:hidden">
                      <div class="fixed top-20 left-0 right-0 bottom-0 z-50">
                        <div class="bg-slate-900/98 backdrop-blur-xl border-t border-white/10 h-full overflow-y-auto">
                          <div class="px-4 py-6 space-y-4">
                            <div class="py-2">
                              <a href="/fundadores" class="w-full block text-center py-4 px-6 rounded-lg font-bold text-lg" style="background: linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%); color: white;">
                                Sé Fundador
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>\`;

                  document.body.insertAdjacentHTML('beforeend', mobileMenuHTML);
                  const mobileMenu = document.getElementById('mobile-menu-overlay');
                  let isMenuOpen = false;

                  menuButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    isMenuOpen = !isMenuOpen;
                    mobileMenu.classList.toggle('hidden', !isMenuOpen);
                    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
                  });

                  mobileMenu.addEventListener('click', (e) => {
                    if (e.target === mobileMenu) {
                      isMenuOpen = false;
                      mobileMenu.classList.add('hidden');
                      document.body.style.overflow = 'auto';
                    }
                  });
                }

                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', setupMobileMenu, { once: true });
                } else {
                  setupMobileMenu();
                }
              })();
            `
          }}
        />

        <CookieBanner />
      </body>
    </html>
  );
}
