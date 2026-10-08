/**
 * Copyright © 2026 CreaTuActivo.com
 * Blog Article: ¿Es el network marketing un modelo obsoleto? (texto del 1 oct 2026)
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
  title: '¿Es el network marketing un modelo obsoleto?',
  description: 'Antes dependía de reuniones en persona y de un tiempo que casi nadie tiene. Así funciona hoy una empresa de distribución moderna, con atención a toda hora.',
  alternates: { canonical: 'https://creatuactivo.com/blog/network-marketing-obsoleto' },
  openGraph: {
    type: 'article',
    url: 'https://creatuactivo.com/blog/network-marketing-obsoleto',
    title: '¿Es el network marketing un modelo obsoleto?',
    description: 'Antes dependía de reuniones en persona y de un tiempo que casi nadie tiene. Así funciona hoy una empresa de distribución moderna, con atención a toda hora.',
    siteName: 'CreaTuActivo',
    locale: 'es_CO',
    // Declarar openGraph aquí corta la imagen heredada de la Home: va explícita.
    images: [{ url: 'https://creatuactivo.com/opengraph-image', width: 1200, height: 630 }],
  },
  keywords: 'network marketing obsoleto, network marketing hoy, empresa de distribución moderna, sistema de distribución, multinivel 2026',
};

export default function NetworkMarketingObsoletoPage() {
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
            title="¿Es el network marketing un modelo obsoleto?"
            refCode="ARTICLE_PROBLEM_V1"
            imageSrc="/images/blog/thumb-blog-problem.jpg"
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
                <span className="text-[#A3A3A3]">Industria</span>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded-full">
                  Industria
                </span>
                <span className="text-xs text-[#6B7280]">6 min de lectura</span>
              </div>

              {/* Deck (subtítulo introductorio — el H1 vive en el IndustrialHeader).
                  Texto aprobado por el Director el 1 oct 2026. */}
              <p className="text-xl text-[#A3A3A3] mb-12 leading-relaxed">
                El modelo de los años 90, sí. La forma de distribuir que había detrás sigue
                viva, y hoy se maneja desde el celular.
              </p>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    Lo que la gente recuerda
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    Cuando alguien oye &quot;network marketing&quot;, casi siempre piensa en
                    reuniones de hotel y en mensajes incómodos a los amigos. Esa imagen tiene una
                    razón: el modelo nació en una época sin internet, sin celular y sin
                    inteligencia artificial, y todo dependía de estar ahí en persona.
                  </p>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    En ese entonces esto era complicado de desarrollar. Hoy no lo es.
                  </p>
                </section>

                <div className="p-6 rounded-lg bg-[#16181D] border border-[rgba(255,255,255,0.1)] mb-12">
                  <p className="text-lg italic text-[#A3A3A3]">
                    &quot;La necesidad de distribuir productos no cambió.
                    <span className="text-[#C5A059]"> Cambió la forma de hacerlo, como pasó del taxi a Uber.</span>&quot;
                  </p>
                </div>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    Cómo funciona hoy
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-6">
                    Hoy una empresa de distribución moderna se maneja desde el celular: usted
                    comparte un enlace, Queswa conversa con quien llega a cualquier hora, y Gano
                    Excel fabrica y despacha cada pedido.
                  </p>

                  <div className="space-y-6">
                    <div className="p-5 rounded-xl bg-[#16181D] border border-[rgba(255,255,255,0.1)]">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl font-bold text-[#C5A059]">1</span>
                        <div>
                          <h4 className="font-semibold text-[#E5E5E5] mb-2">Usted comparte</h4>
                          <p className="text-[#A3A3A3] text-sm">
                            Pasa un enlace por WhatsApp a quien quiera, y saluda a quien llega con interés.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-[#16181D] border border-[rgba(255,255,255,0.1)]">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl font-bold text-[#C5A059]">2</span>
                        <div>
                          <h4 className="font-semibold text-[#E5E5E5] mb-2">Queswa conversa</h4>
                          <p className="text-[#A3A3A3] text-sm">
                            La inteligencia artificial de CreaTuActivo explica, resuelve las dudas y madura en cada interesado la decisión de avanzar, las 24 horas.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-[#16181D] border border-[rgba(255,255,255,0.1)]">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl font-bold text-[#C5A059]">3</span>
                        <div>
                          <h4 className="font-semibold text-[#E5E5E5] mb-2">Gano Excel fabrica y despacha</h4>
                          <p className="text-[#A3A3A3] text-sm">
                            Una empresa con 30 años y presencia en más de 60 países produce, almacena y envía cada pedido.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    Por qué la recompra es la base
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    El ingreso sale del producto que se mueve. Cada cliente que se registra con
                    su enlace queda a su nombre en Gano Excel, y cuando nota la diferencia y
                    vuelve a pedir, de esa compra a usted le queda un porcentaje.
                  </p>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    ¿Para quién es?
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    Para quien quiere un negocio propio que no dependa de que esté encima, y
                    entiende que se construye. No es dinero rápido.
                  </p>
                  <ul className="space-y-2 text-[#A3A3A3]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#C5A059]">→</span>
                      <span>Quiere un negocio propio, con un fabricante detrás.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C5A059]">→</span>
                      <span>Prefiere que la tecnología explique y atienda, y dedicar su tiempo a quien ya decidió.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C5A059]">→</span>
                      <span>Entiende que una red de clientes se construye con constancia.</span>
                    </li>
                  </ul>
                </section>
              </div>

              {/* CTA Box - Industrial Geometry */}
              <div className="mt-16 p-8 bg-[#16181D] border border-[#C5A059]/20 text-center">
                <h3 className="text-xl font-serif mb-4">
                  ¿Quiere ver cómo funciona en la práctica?
                </h3>
                <p className="text-[#A3A3A3] mb-6">
                  Pregúntele a Queswa cómo funciona y cómo se construye el suyo. Le responde a
                  cualquier hora.
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
