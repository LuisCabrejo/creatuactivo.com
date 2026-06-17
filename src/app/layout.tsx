/**
 * Copyright © 2025 CreaTuActivo.com
 * Layout Raíz Optimizado para SEO Técnico Continental
 * Estrategia: Hreflang, Schema.org Avanzado y Performance
 */

import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import CookieBanner from '@/components/CookieBanner';
import DeferredOrb from '@/components/DeferredOrb';

// LUJO SILENCIOSO - Sistema Tipográfico
// Playfair Display: Display serif para titulares de impacto y narrativa estratégica
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
});

// Inter: Sans primario para estructura, datos y cuerpo de texto
// (Alternativa abierta más cercana a Söhne — grotesca geométrica moderna)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

// Roboto Mono: Datos financieros, métricas, fórmulas (con tabular-nums)
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
  weight: ['300', '400', '500'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  interactiveWidget: 'resizes-content',
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
    default: 'CreaTuActivo | Su empresa digital con ingresos recurrentes',
    template: '%s | CreaTuActivo'
  },
  description: 'Sea propietario de una empresa digital que genera ingresos recurrentes, aunque usted no esté presente. Tres pilares cargan el trabajo pesado: Gano Excel, la inteligencia artificial Queswa y un método comprobado. Usted dirige.',

  // Keywords Estratégicas (SEO Semántico)
  keywords: [
    'creatuactivo',
    'empresa digital',
    'ingresos recurrentes',
    'propietario empresa digital',
    'diagnóstico de 5 días',
    'apalancamiento estratégico',
    'queswa ia',
    'queswa app',
    'gano excel latinoamerica',
    'sistema de distribución',
    'luis cabrejo'
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
  // NO canonical global aquí: ponía canonical=homepage en TODA página que no lo
  // sobrescriba → el "Compartir" del navegador (que usa el canonical) arrastraba
  // solo creatuactivo.com, y SEO trataba cada página como duplicado de la home.
  // Cada página declara su propio canonical; sin él, el share usa la URL real.
  alternates: {
    languages: {
      'es': baseUrl,
      'pt-BR': `${baseUrl}/paises/brasil`,
      'en-US': `${baseUrl}/en`, // Preparado para futuro
    },
  },

  icons: {
    icon: [
      // SVG vector master — preferido por browsers modernos (Chrome 80+, Firefox 41+, Edge, Safari 9+)
      { url: '/favicon.svg?v=9', type: 'image/svg+xml' },
      // PNG fallback para browsers legacy
      { url: '/favicon-32x32.png?v=9', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png?v=9', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-16x16.png?v=9', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=9', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: [
      { url: '/favicon.svg?v=9' }
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
    title: 'CreaTuActivo | Su empresa digital con ingresos recurrentes',
    description: 'Sea propietario de una empresa digital que genera ingresos recurrentes, aunque usted no esté presente. Tres pilares cargan el trabajo pesado: Gano Excel, la inteligencia artificial Queswa y un método comprobado. Usted dirige.',
    siteName: 'CreaTuActivo.com',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'CreaTuActivo | Su empresa digital con ingresos recurrentes',
    description: 'Sea propietario de una empresa digital que genera ingresos recurrentes, aunque usted no esté presente. Tres pilares cargan el trabajo pesado: Gano Excel, la inteligencia artificial Queswa y un método comprobado. Usted dirige.',
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
          "url": `${baseUrl}/web-app-manifest-512x512.png`,
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
        "name": "Queswa",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Plataforma propietaria con motor de Inteligencia Artificial. Centro de Mando de los Arquitectos de Patrimonio del ecosistema CreaTuActivo. Conversa, acompaña y prepara contactos las 24 horas (queswa.app).",
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
        {/* Material Symbols Sharp — carga diferida, sin preconnect (async no se beneficia) */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@24,400,0,0"
          // @ts-ignore
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@24,400,0,0" />
        </noscript>

        {/* Favicons — SVG vector master + PNG fallbacks */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=9" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=9" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=9" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=9" />
        <link rel="manifest" href="/site.webmanifest?v=9" />

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
      <body className={`${playfair.variable} ${inter.variable} ${robotoMono.variable} font-sans h-full bg-carbon text-smoke antialiased`}>
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

        <DeferredOrb />

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
                              <a href="/fundadores" class="w-full block text-center py-4 px-6 rounded-lg font-bold text-lg" style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: #0B0C0C;">
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
