/**
 * Copyright © 2026 CreaTuActivo.com
 * Blog Article: Empleo vs Activos
 * SEO Shadow Funnel Content
 *
 * THE ARCHITECT'S SUITE - Bimetallic System v3.0
 * Gold (#C5A059): CTAs, highlights, key titles
 * Titanium (#94A3B8): Structural elements
 */

import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';
import { IndustrialHeader } from '@/components/IndustrialHeader';
import QueswaCTAButton from '@/components/QueswaCTAButton';

// La marca la agrega la plantilla del layout raíz: «| CreaTuActivo Blog | CreaTuActivo»
// salía duplicada. canonical y openGraph propios (1 oct 2026): sin ellos, compartir
// el artículo mostraba la tarjeta de la Home.
export const metadata = {
  title: 'Empleo vs. activos: ingreso lineal e ingreso recurrente',
  description: 'Qué es un activo, ejemplos de los que producen ingreso recurrente —una propiedad en renta, un libro, un sistema de distribución— y lo que exige construir cada uno.',
  alternates: { canonical: 'https://creatuactivo.com/blog/empleo-vs-activos' },
  openGraph: {
    type: 'article',
    url: 'https://creatuactivo.com/blog/empleo-vs-activos',
    title: 'Empleo vs. activos: ingreso lineal e ingreso recurrente',
    description: 'Qué es un activo, ejemplos de los que producen ingreso recurrente —una propiedad en renta, un libro, un sistema de distribución— y lo que exige construir cada uno.',
    siteName: 'CreaTuActivo',
    locale: 'es_CO',
    // Declarar openGraph aquí corta la imagen heredada de la Home: va explícita.
    images: [{ url: 'https://creatuactivo.com/opengraph-image', width: 1200, height: 630 }],
  },
  keywords: 'empleo vs activos, ingreso lineal, ingreso recurrente, qué es un activo, ejemplos de activos',
};

export default function EmpleoVsActivosPage() {
  return (
    <>
      {/* Mobile Performance Fix: No blur on mobile, blur only on desktop */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          .article-container-glass {
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
        }
      `}} />
      <StrategicNavigation />
      <div className="min-h-screen text-[#E5E5E5]">
        <div className="relative z-10">
          <IndustrialHeader
            title={<>Empleo vs. activos:<span style={{ color: '#C5A059' }}> ingreso lineal e ingreso recurrente</span></>}
            refCode="ARTICLE_SYSTEM_V1"
            imageSrc="/images/blog/thumb-blog-system.jpg"
            imageAlt=""
            variant="editorial"
          />

          {/* Article Content */}
          <article className="py-0 px-6">
            <div
              className="max-w-3xl mx-auto article-container-glass"
              style={{
                background: 'rgba(22, 24, 29, 0.95)',
                border: '1px solid rgba(212, 175, 55, 0.1)',
                padding: 'clamp(2rem, 5vw, 3.5rem)',
                marginTop: '-1rem',
                position: 'relative',
                zIndex: 10,
              }}
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-8">
                <Link href="/blog" className="hover:text-[#A3A3A3]">Blog</Link>
                <span>/</span>
                <span className="text-[#A3A3A3]">Educación Financiera</span>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded-full">
                  Educación Financiera
                </span>
                <span className="text-xs text-[#6B7280]">6 min de lectura</span>
              </div>

              {/* Deck (subtítulo introductorio — el H1 vive en el IndustrialHeader).
                  Texto aprobado por el Director el 1 oct 2026. Las dos columnas de
                  ingreso llevan el mismo marcador: el artículo no desprecia el empleo. */}
              <p className="text-xl text-[#A3A3A3] mb-12 leading-relaxed">
                Un empleo y un activo pagan de forma distinta. Entender la diferencia no es dejar
                el empleo: es saber qué más se puede construir al lado.
              </p>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    El ciclo
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    Usted trabaja el mes entero, pero al día siguiente de que le entra la plata,
                    ese dinero ya tiene dueño: el banco, las cuotas, los recibos. Es un ciclo de
                    trabajar, pagar cuentas y repetir, y le pasa exactamente igual al que gana dos
                    millones y al que gana más de veinte.
                  </p>
                </section>

                <div className="p-6  bg-[#16181D] border border-[rgba(255,255,255,0.1)] mb-12">
                  <p className="text-lg italic text-[#A3A3A3]">
                    &quot;Un empleo paga por el tiempo trabajado;
                    <span className="text-[#C5A059]"> un activo, por lo que usted construyó.</span>&quot;
                  </p>
                </div>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    Dos tipos de ingreso
                  </h2>

                  {/* Comparison Cards */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 rounded-xl bg-[#0B0C0C] border border-[rgba(255,255,255,0.1)]">
                      <h3 className="text-lg font-semibold mb-4 text-[#E5E5E5]">Ingreso lineal</h3>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-[#94A3B8]">→</span>
                          <span className="text-[#A3A3A3]">Se cobra por el tiempo trabajado</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#94A3B8]">→</span>
                          <span className="text-[#A3A3A3]">Es el que paga las cuentas de casi todos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#94A3B8]">→</span>
                          <span className="text-[#A3A3A3]">Cuando el trabajo se detiene, el ingreso también</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 rounded-xl bg-[#0B0C0C] border border-[rgba(255,255,255,0.1)]">
                      <h3 className="text-lg font-semibold mb-4 text-[#C5A059]">Ingreso recurrente</h3>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-[#94A3B8]">→</span>
                          <span className="text-[#A3A3A3]">Se cobra cada vez que algo que usted construyó vuelve a producir</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#94A3B8]">→</span>
                          <span className="text-[#A3A3A3]">Una renta, una regalía, una recompra</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#94A3B8]">→</span>
                          <span className="text-[#A3A3A3]">No depende de que usted esté presente ese día</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    Ejemplos de activos
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-6">
                    Un activo es algo que usted construye o compra una vez y que sigue produciendo
                    después. Cada uno exige algo distinto:
                  </p>
                  <ul className="space-y-4 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] mt-1">→</span>
                      <div>
                        <strong className="text-[#E5E5E5]">Una propiedad en renta</strong>
                        <p className="text-[#A3A3A3] text-sm mt-1">
                          Paga un arriendo cada mes. Exige capital alto.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] mt-1">→</span>
                      <div>
                        <strong className="text-[#E5E5E5]">Acciones con dividendos</strong>
                        <p className="text-[#A3A3A3] text-sm mt-1">
                          Pagan una parte de las ganancias. Exigen un ahorro grande.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] mt-1">→</span>
                      <div>
                        <strong className="text-[#E5E5E5]">Un libro o una canción</strong>
                        <p className="text-[#A3A3A3] text-sm mt-1">
                          Pagan regalías por cada venta. Exigen talento y difusión.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] mt-1">→</span>
                      <div>
                        <strong className="text-[#E5E5E5]">Un sistema de distribución</strong>
                        <p className="text-[#A3A3A3] text-sm mt-1">
                          Paga un porcentaje cada vez que sus clientes vuelven a comprar. Exige constancia: una red de clientes se construye.
                        </p>
                      </div>
                    </li>
                  </ul>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    La pregunta útil
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    ¿Qué pasaría con sus ingresos si dejara de trabajar seis meses?
                  </p>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    ¿Por dónde empezar?
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    La barrera de los activos tradicionales es el capital, el ahorro o el talento.
                    Un sistema de distribución se inicia con producto: el Kit de Inicio o uno de
                    los paquetes empresariales, que son inventario, no una cuota de afiliación
                    (los precios están en{' '}
                    <Link href="/paquetes" className="text-[#C5A059] underline">la página de paquetes</Link>).
                    Desde ahí, usted comparte un enlace, Queswa atiende a quien llega y Gano Excel
                    fabrica y despacha cada pedido.
                  </p>
                </section>
              </div>

              {/* CTA Box - Industrial Geometry */}
              <div className="mt-16 p-8 bg-[#16181D] border border-[#C5A059]/20 text-center">
                <h3 className="text-xl font-serif mb-4">
                  ¿Quiere ver cómo se construye uno?
                </h3>
                <p className="text-[#A3A3A3] mb-6">
                  Pregúntele a Queswa qué se necesita para iniciar. Le responde a cualquier hora.
                </p>
                <QueswaCTAButton
                  className="cta-base cta-primary"
                  style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                >
                  Hablar con Queswa
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </QueswaCTAButton>
              </div>

              {/* Back to Blog */}
              <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.1)]">
                <Link
                  href="/blog"
                  className="text-[#A3A3A3] hover:text-[#C5A059] transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Volver al Blog
                </Link>
              </div>
            </div>
          </article>

          {/* Footer */}
          <footer className="px-6 py-12 border-t border-[rgba(255,255,255,0.1)]">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-sm text-[#6B7280]">
                © 2026 CreaTuActivo.com ·
                <Link href="/privacidad" className="hover:text-[#A3A3A3] ml-2">
                  Privacidad
                </Link>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
