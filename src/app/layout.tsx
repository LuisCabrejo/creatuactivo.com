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
      </body>
    </html>
  );
}
