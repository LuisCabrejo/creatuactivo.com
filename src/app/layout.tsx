/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NEXUSFloatingButton } from '@/components/nexus';

// Optimización PageSpeed: display swap + preload
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Evita FOIT (Flash of Invisible Text)
  preload: true,
  variable: '--font-inter'
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e293b' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://creatuactivo.com'),
  title: 'CreaTuActivo.com - Tu Ecosistema, Tu Activo, Tu Futuro',
  description: 'Plataforma integral para construir activos empresariales mediante el Framework IAA: Iniciar, Acoger, Activar. Únete a los pioneros que están revolucionando la forma de crear valor.',
  keywords: 'activos empresariales, Framework IAA, constructores de riqueza, ecosistema empresarial, CreaTuActivo',
  authors: [{ name: 'CreaTuActivo.com' }],
  creator: 'CreaTuActivo.com',
  publisher: 'CreaTuActivo.com',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // SECCIÓN DE ICONS AGREGADA
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
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
    url: 'https://creatuactivo.com',
    title: 'CreaTuActivo.com - Tu Ecosistema, Tu Activo, Tu Futuro',
    description: 'Únete a la revolución de los constructores de activos empresariales. Framework IAA exclusivo para pioneros visionarios.',
    siteName: 'CreaTuActivo.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CreaTuActivo.com - Framework IAA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CreaTuActivo.com - Tu Ecosistema, Tu Activo, Tu Futuro',
    description: 'Framework IAA exclusivo para constructores de activos empresariales.',
    images: ['/og-image.jpg'],
    creator: '@creatuactivo',
  },
  // Google Search Console verification
  // INSTRUCCIONES: Reemplaza 'CODIGO_VERIFICACION_GSC' con el código que Google te proporcione
  // cuando configures Google Search Console en https://search.google.com/search-console
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'CODIGO_VERIFICACION_GSC',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <head>
        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Preconnect para Supabase - OPTIMIZACIÓN PAGESPEED */}
        <link rel="preconnect" href="https://cvadzbmdypnbrbnkznpb.supabase.co" />
        <link rel="dns-prefetch" href="https://cvadzbmdypnbrbnkznpb.supabase.co" />

        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* FRAMEWORK IAA - TRACKING SCRIPT - FIX APLICADO */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Configuración del tracking antes de cargar el script
              window.TRACKING_CONFIG = {
                SUPABASE_URL: '${process.env.NEXT_PUBLIC_SUPABASE_URL}',
                SUPABASE_ANON_KEY: '${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}'
              };
            `
          }}
        />
        {/* OPTIMIZACIÓN PAGESPEED: defer para no bloquear render inicial
            tracking.js ahora crea un stub inmediato y difiere identify_prospect */}
        <script src="/tracking.js" defer></script>

        {/* Esquema estructurado - JSON-LD mejorado para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CreaTuActivo.com",
              "alternateName": "CreaTuActivo",
              "url": "https://creatuactivo.com",
              "logo": "https://creatuactivo.com/logo.png",
              "description": "Plataforma integral para construir activos empresariales mediante el Framework IAA: Iniciar, Acoger, Activar. Ecosistema completo para emprendedores y constructores de riqueza.",
              "foundingDate": "2024",
              "slogan": "Tu Ecosistema, Tu Activo, Tu Futuro",
              "sameAs": [
                "https://facebook.com/creatuactivo",
                "https://twitter.com/creatuactivo",
                "https://instagram.com/creatuactivo",
                "https://linkedin.com/company/creatuactivo"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+57-300-1234567",
                "contactType": "Customer Service",
                "areaServed": "LATAM",
                "availableLanguage": ["Spanish", "English"]
              },
              "offers": {
                "@type": "Offer",
                "name": "Programa Fundadores CreaTuActivo",
                "description": "Acceso exclusivo al ecosistema empresarial con mentoría 1:150",
                "url": "https://creatuactivo.com/fundadores",
                "availability": "https://schema.org/LimitedAvailability",
                "validFrom": "2025-10-27T10:00:00-05:00",
                "validThrough": "2025-11-16T23:59:59-05:00"
              },
              "knowsAbout": [
                "Activos Empresariales",
                "Framework IAA",
                "Marketing Multinivel",
                "Ecosistema Empresarial",
                "Construcción de Riqueza",
                "Emprendimiento"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} h-full bg-slate-900 text-white antialiased`}>
        {/* Contenido Principal */}
        <main className="relative">
          {children}
        </main>

        {/* Scripts de análisis y tracking - OPTIMIZADO PARA PERFORMANCE */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 🔧 FIX CRÍTICO: Prevenir acumulación de event listeners
              (function() {
                // Guard: Solo ejecutar una vez
                if (window.__cta_tracking_initialized) return;
                window.__cta_tracking_initialized = true;

                // Performance monitoring (solo si serviceWorker disponible)
                if ('serviceWorker' in navigator && !navigator.serviceWorker.controller) {
                  window.addEventListener('load', function swInit() {
                    navigator.serviceWorker.register('/sw.js').catch(function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                  }, { once: true }); // ✅ CRÍTICO: once: true limpia automáticamente
                }

                // Error tracking (sin acumular listeners)
                if (!window.__cta_error_handler) {
                  window.__cta_error_handler = function(e) {
                    console.warn('Global error:', e.error);
                  };
                  window.addEventListener('error', window.__cta_error_handler);
                }

                // Framework IAA - Tracking Integration
                if (!window.__cta_nexus_handler) {
                  window.__cta_nexus_handler = function(e) {
                    if (window.updateProspectData) {
                      window.updateProspectData(e.detail);
                    }
                  };
                  window.addEventListener('nexusMessage', window.__cta_nexus_handler);
                }

                // Tracking ready handler
                if (!window.__cta_tracking_ready_handler) {
                  window.__cta_tracking_ready_handler = function(e) {
                    console.log('✅ Framework IAA Tracking listo para NEXUS:', e.detail);
                    if (window.NEXUS && window.NEXUS.setTrackingReady) {
                      window.NEXUS.setTrackingReady(e.detail);
                    }
                  };
                  window.addEventListener('nexusTrackingReady', window.__cta_tracking_ready_handler);
                }
              })();
            `
          }}
        />

        {/* NEXUS Floating Button */}
        <NEXUSFloatingButton />

        {/* ✅ MOBILE MENU FIX - OPTIMIZADO PARA PERFORMANCE (NO MEMORY LEAKS) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 🔧 FIX CRÍTICO: Guard para prevenir ejecución múltiple
              (function initMobileMenu() {
                // Guard: Solo ejecutar una vez
                if (window.__cta_mobile_menu_initialized) {
                  console.log('📱 Mobile menu already initialized - skipping');
                  return;
                }
                window.__cta_mobile_menu_initialized = true;

                // Usar función con nombre para poder cleanup después
                function setupMobileMenu() {
                // ✅ DETECCIÓN INTELIGENTE: Skip si hay navegación custom
                if (window.location.pathname.startsWith('/nodex')) {
                  console.log('📱 NodeX page detected - Skipping mobile menu script (NodeXSidebar handles its own menu)');
                  return;
                }

                // ✅ DETECCIÓN: Skip si StrategicNavigation está presente
                const strategicNav = document.querySelector('.strategic-nav-critical');
                if (strategicNav) {
                  console.log('📱 StrategicNavigation detected - Skipping mobile menu script (StrategicNavigation handles its own menu)');
                  return;
                }

                console.log('🔧 Mobile Menu Fix loading for legacy pages...');

                let isMenuOpen = false;

                // ✅ BÚSQUEDA FLEXIBLE: Múltiples aria-labels
                const menuButton = document.querySelector('[aria-label="Toggle menu"]') ||
                                  document.querySelector('[aria-label="Abrir menú"]') ||
                                  document.querySelector('[aria-label="Open menu"]');

                const body = document.body;

                if (!menuButton) {
                  console.log('ℹ️  No legacy menu button found - this is expected for pages with modern navigation');
                  return;
                }

                console.log('✅ Legacy menu button found, initializing mobile menu...');

                // Crear menú móvil HTML completo
                const mobileMenuHTML = \`
                  <div id="mobile-menu-overlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 hidden md:hidden">
                    <div class="fixed top-20 left-0 right-0 bottom-0 z-50">
                      <div class="bg-slate-900/98 backdrop-blur-xl border-t border-white/10 h-full overflow-y-auto">
                        <div class="px-4 py-6 space-y-4">

                          <!-- El Sistema -->
                          <div class="py-2">
                            <h3 class="text-slate-400 px-3 py-2 text-sm font-semibold uppercase tracking-wider">El Sistema</h3>
                            <div class="space-y-1">
                              <a href="/sistema/framework-iaa" class="mobile-menu-link">
                                <span class="mr-3">⚡</span>
                                <div>
                                  <div class="font-medium">Framework (IAA)</div>
                                  <div class="text-xs text-slate-500 mt-1">Metodología propietaria construcción activos</div>
                                </div>
                              </a>
                              <a href="/sistema/tecnologia" class="mobile-menu-link">
                                <span class="mr-3">🧠</span>
                                <div>
                                  <div class="font-medium">Tecnología</div>
                                  <div class="text-xs text-slate-500 mt-1">NEXUS IA y NodeX: ventaja competitiva</div>
                                </div>
                              </a>
                              <a href="/sistema/productos" class="mobile-menu-link">
                                <span class="mr-3">📦</span>
                                <div>
                                  <div class="font-medium">Productos</div>
                                  <div class="text-xs text-slate-500 mt-1">Motor único con patente mundial</div>
                                </div>
                              </a>
                              <a href="/sistema/socio-corporativo" class="mobile-menu-link">
                                <span class="mr-3">🛡️</span>
                                <div>
                                  <div class="font-medium">Socio Corporativo</div>
                                  <div class="text-xs text-slate-500 mt-1">Gano Excel: credibilidad y trayectoria</div>
                                </div>
                              </a>
                            </div>
                          </div>

                          <!-- Soluciones -->
                          <div class="py-2">
                            <h3 class="text-slate-400 px-3 py-2 text-sm font-semibold uppercase tracking-wider">Soluciones</h3>
                            <div class="space-y-1">
                              <a href="/soluciones/profesional-con-vision" class="mobile-menu-link">
                                <span class="mr-3">💼</span>
                                <div>
                                  <div class="font-medium">Profesional con Visión</div>
                                  <div class="text-xs text-slate-500 mt-1">Construir activo, no solo carrera</div>
                                </div>
                              </a>
                              <a href="/soluciones/emprendedor-negocio" class="mobile-menu-link">
                                <span class="mr-3">📱</span>
                                <div>
                                  <div class="font-medium">Emprendedor y Dueño</div>
                                  <div class="text-xs text-slate-500 mt-1">Escalar con sistema, no tareas</div>
                                </div>
                              </a>
                              <a href="/soluciones/independiente-freelancer" class="mobile-menu-link">
                                <span class="mr-3">💡</span>
                                <div>
                                  <div class="font-medium">Independiente</div>
                                  <div class="text-xs text-slate-500 mt-1">Talento a activo escalable</div>
                                </div>
                              </a>
                              <a href="/soluciones/lider-del-hogar" class="mobile-menu-link">
                                <span class="mr-3">🏠</span>
                                <div>
                                  <div class="font-medium">Líder del Hogar</div>
                                  <div class="text-xs text-slate-500 mt-1">Flexibilidad y propósito</div>
                                </div>
                              </a>
                              <a href="/soluciones/lider-comunidad" class="mobile-menu-link">
                                <span class="mr-3">👥</span>
                                <div>
                                  <div class="font-medium">Líder Comunidad</div>
                                  <div class="text-xs text-slate-500 mt-1">Influencia a legado tangible</div>
                                </div>
                              </a>
                              <a href="/soluciones/joven-con-ambicion" class="mobile-menu-link">
                                <span class="mr-3">🎓</span>
                                <div>
                                  <div class="font-medium">Joven con Ambición</div>
                                  <div class="text-xs text-slate-500 mt-1">Activo antes que carrera</div>
                                </div>
                              </a>
                            </div>
                          </div>

                          <!-- Presentación -->
                          <div class="py-2">
                            <a href="/presentacion-empresarial" class="mobile-menu-link">
                              <span class="mr-3">📊</span>
                              <div class="font-medium">Presentación Empresarial</div>
                            </a>
                          </div>

                          <!-- El Ecosistema -->
                          <div class="py-2">
                            <h3 class="text-slate-400 px-3 py-2 text-sm font-semibold uppercase tracking-wider">El Ecosistema</h3>
                            <div class="space-y-1">
                              <a href="/ecosistema/comunidad" class="mobile-menu-link">
                                <span class="mr-3">👥</span>
                                <div>
                                  <div class="font-medium">La Comunidad</div>
                                  <div class="text-xs text-slate-500 mt-1">Historias éxito y pulso humano</div>
                                </div>
                              </a>
                              <a href="/ecosistema/academia" class="mobile-menu-link">
                                <span class="mr-3">🎓</span>
                                <div>
                                  <div class="font-medium">La Academia</div>
                                  <div class="text-xs text-slate-500 mt-1">Rutas maestros constructores</div>
                                </div>
                              </a>
                            </div>
                          </div>

                          <!-- Botón Sé Fundador -->
                          <div class="mt-8 pt-6 border-t border-white/10">
                            <a href="/fundadores" class="w-full block text-center py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105" style="background: linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%); color: white; box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);">
                              <span class="mr-2">👑</span>
                              Sé Fundador
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                \`;

                // CSS para los enlaces del menú móvil
                const mobileMenuStyles = document.createElement('style');
                mobileMenuStyles.textContent = \`
                  .mobile-menu-link {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding: 12px 16px;
                    color: rgb(203 213 225);
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    margin: 2px 0;
                  }
                  .mobile-menu-link:hover {
                    background-color: rgba(51, 65, 85, 0.5);
                    color: white;
                    transform: translateX(4px);
                  }
                  .mobile-menu-link:active {
                    background-color: rgba(51, 65, 85, 0.7);
                  }
                \`;
                document.head.appendChild(mobileMenuStyles);

                // Insertar menú en el DOM
                body.insertAdjacentHTML('beforeend', mobileMenuHTML);
                const mobileMenu = document.getElementById('mobile-menu-overlay');

                if (!mobileMenu) {
                  console.error('❌ Failed to create mobile menu');
                  return;
                }

                // 🔧 Función para alternar menú
                function toggleMenu() {
                  console.log('🍔 Toggling legacy menu, current state:', isMenuOpen);

                  isMenuOpen = !isMenuOpen;

                  if (isMenuOpen) {
                    mobileMenu.classList.remove('hidden');
                    body.style.overflow = 'hidden';
                    console.log('✅ Legacy menu opened');

                    // Cambiar icono a X
                    const icon = menuButton.querySelector('svg');
                    if (icon) {
                      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
                    }
                  } else {
                    mobileMenu.classList.add('hidden');
                    body.style.overflow = 'auto';
                    console.log('✅ Legacy menu closed');

                    // Cambiar icono a hamburguesa
                    const icon = menuButton.querySelector('svg');
                    if (icon) {
                      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />';
                    }
                  }
                }

                // 🔧 Event handlers con referencias para posible cleanup
                const handleMenuClick = function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleMenu();
                };

                const handleMenuTouch = function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleMenu();
                };

                const handleOverlayClick = function(e) {
                  if (e.target === mobileMenu) {
                    console.log('🎯 Overlay clicked, closing legacy menu');
                    if (isMenuOpen) toggleMenu();
                  }
                };

                const handleLinkClick = function() {
                  console.log('🔗 Link clicked, closing legacy menu');
                  setTimeout(() => {
                    if (isMenuOpen) toggleMenu();
                  }, 150);
                };

                const handleResize = function() {
                  if (window.innerWidth >= 768 && isMenuOpen) {
                    console.log('📱 Resize to desktop, closing legacy menu');
                    toggleMenu();
                  }
                };

                // Agregar event listeners
                menuButton.addEventListener('click', handleMenuClick);
                menuButton.addEventListener('touchstart', handleMenuTouch, { passive: false });
                mobileMenu.addEventListener('click', handleOverlayClick);

                // Agregar listeners a todos los links
                mobileMenu.querySelectorAll('a').forEach(link => {
                  link.addEventListener('click', handleLinkClick);
                });

                window.addEventListener('resize', handleResize);

                // 🔧 CRÍTICO: Guardar referencias para cleanup futuro (si se necesita)
                window.__cta_mobile_menu_cleanup = function() {
                  menuButton.removeEventListener('click', handleMenuClick);
                  menuButton.removeEventListener('touchstart', handleMenuTouch);
                  mobileMenu.removeEventListener('click', handleOverlayClick);
                  mobileMenu.querySelectorAll('a').forEach(link => {
                    link.removeEventListener('click', handleLinkClick);
                  });
                  window.removeEventListener('resize', handleResize);
                  console.log('🧹 Mobile menu listeners cleaned up');
                };

                console.log('🎉 Legacy mobile menu fix initialized successfully!');
              } // End setupMobileMenu

              // Ejecutar setup cuando DOM esté listo
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', setupMobileMenu, { once: true });
              } else {
                setupMobileMenu();
              }
            })(); // End IIFE
            `
          }}
        />
      </body>
    </html>
  );
}
