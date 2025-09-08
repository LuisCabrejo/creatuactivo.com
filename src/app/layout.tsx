import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NEXUSFloatingButton } from '@/components/nexus';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
        {/* FIX CRÍTICO: Eliminar 'defer' para carga inmediata */}
        <script src="/tracking.js"></script>

        {/* Esquema estructurado */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CreaTuActivo.com",
              "url": "https://creatuactivo.com",
              "logo": "https://creatuactivo.com/logo.png",
              "description": "Plataforma integral para construir activos empresariales mediante el Framework IAA",
              "sameAs": [
                "https://facebook.com/creatuactivo",
                "https://twitter.com/creatuactivo",
                "https://instagram.com/creatuactivo"
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

        {/* Scripts de análisis y tracking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }

              // Error tracking
              window.addEventListener('error', function(e) {
                console.warn('Global error:', e.error);
              });

              // Framework IAA - Tracking Integration
              window.addEventListener('nexusMessage', function(e) {
                if (window.updateProspectData) {
                  window.updateProspectData(e.detail);
                }
              });

              // FIX CRÍTICO: Verificación de tracking antes de NEXUS
              window.addEventListener('nexusTrackingReady', function(e) {
                console.log('✅ Framework IAA Tracking listo para NEXUS:', e.detail);

                // Notificar a NEXUS que el tracking está disponible
                if (window.NEXUS && window.NEXUS.setTrackingReady) {
                  window.NEXUS.setTrackingReady(e.detail);
                }
              });
            `
          }}
        />

        {/* NEXUS Floating Button */}
        <NEXUSFloatingButton />

        {/* MOBILE MENU FIX - VANILLA JS SOLUTION */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                console.log('🔧 Mobile Menu Fix loading...');

                let isMenuOpen = false;
                const menuButton = document.querySelector('[aria-label="Toggle menu"]');
                const body = document.body;

                if (!menuButton) {
                  console.warn('❌ Menu button not found');
                  return;
                }

                console.log('✅ Menu button found, initializing mobile menu...');

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

                // Función para alternar menú
                function toggleMenu() {
                  console.log('🍔 Toggling menu, current state:', isMenuOpen);

                  isMenuOpen = !isMenuOpen;

                  if (isMenuOpen) {
                    mobileMenu.classList.remove('hidden');
                    body.style.overflow = 'hidden';
                    console.log('✅ Menu opened');

                    // Cambiar icono a X
                    const icon = menuButton.querySelector('svg');
                    if (icon) {
                      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
                    }
                  } else {
                    mobileMenu.classList.add('hidden');
                    body.style.overflow = 'auto';
                    console.log('✅ Menu closed');

                    // Cambiar icono a hamburguesa
                    const icon = menuButton.querySelector('svg');
                    if (icon) {
                      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />';
                    }
                  }
                }

                // Event listeners para el botón
                menuButton.addEventListener('click', function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleMenu();
                });

                menuButton.addEventListener('touchstart', function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleMenu();
                });

                // Cerrar al hacer click en overlay
                mobileMenu.addEventListener('click', function(e) {
                  if (e.target === mobileMenu) {
                    console.log('🎯 Overlay clicked, closing menu');
                    if (isMenuOpen) toggleMenu();
                  }
                });

                // Cerrar al hacer click en enlaces del menú
                mobileMenu.querySelectorAll('a').forEach(link => {
                  link.addEventListener('click', function() {
                    console.log('🔗 Link clicked, closing menu');
                    setTimeout(() => {
                      if (isMenuOpen) toggleMenu();
                    }, 150);
                  });
                });

                // Cerrar menú al redimensionar ventana (desktop)
                window.addEventListener('resize', function() {
                  if (window.innerWidth >= 768 && isMenuOpen) {
                    console.log('📱 Resize to desktop, closing menu');
                    toggleMenu();
                  }
                });

                console.log('🎉 Mobile menu fix initialized successfully!');
              });
            `
          }}
        />
      </body>
    </html>
  );
}
