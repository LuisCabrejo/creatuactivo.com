/**
 * Copyright © 2026 CreaTuActivo.com
 * Blog Article: ¿Es legal el network marketing? Lo que dice la Ley 1700 (texto del 1 oct 2026)
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
  title: '¿Es legal el network marketing? Lo que dice la Ley 1700',
  description: 'La diferencia entre una empresa de redes de mercadeo y una pirámide: lo que exige la Ley 1700 en Colombia, lo que vigila la FTC y las preguntas que conviene hacer.',
  alternates: { canonical: 'https://creatuactivo.com/blog/legalidad-network-marketing' },
  openGraph: {
    type: 'article',
    url: 'https://creatuactivo.com/blog/legalidad-network-marketing',
    title: '¿Es legal el network marketing? Lo que dice la Ley 1700',
    description: 'La diferencia entre una empresa de redes de mercadeo y una pirámide: lo que exige la Ley 1700 en Colombia, lo que vigila la FTC y las preguntas que conviene hacer.',
    siteName: 'CreaTuActivo',
    locale: 'es_CO',
    // Declarar openGraph aquí corta la imagen heredada de la Home: va explícita.
    images: [{ url: 'https://creatuactivo.com/opengraph-image', width: 1200, height: 630 }],
  },
  keywords: 'es legal el network marketing, ley 1700 colombia, redes de mercadeo legales, pirámide vs multinivel, FTC',
};

export default function LegalidadNetworkMarketingPage() {
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
      <main className="min-h-screen text-[#E5E5E5]">
        <div className="relative z-10">
          <IndustrialHeader
            title={<>¿Es legal el network marketing?<span style={{ color: '#C5A059' }}> Lo que dice la Ley 1700</span></>}
            refCode="ARTICLE_SOVEREIGNTY_V1"
            imageSrc="/images/blog/thumb-blog-sovereignty.jpg"
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
                <span className="text-[#A3A3A3]">Legal</span>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded-full">
                  Legal
                </span>
                <span className="text-xs text-[#6B7280]">7 min de lectura</span>
              </div>

              {/* Deck (subtítulo introductorio — el H1 vive en el IndustrialHeader).
                  Texto aprobado por el Director el 1 oct 2026. Lo que se dice de la
                  Ley 1700 de 2013 se verificó ese día contra el texto de la ley; antes, el
                  artículo la nombraba en el título y no la mencionaba ni una vez. */}
              <p className="text-xl text-[#A3A3A3] mb-12 leading-relaxed">
                Sí, cuando el dinero sale de la venta de productos. En Colombia lo regula la Ley
                1700 de 2013, y la diferencia con una pirámide se ve en una sola pregunta.
              </p>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    La pregunta que lo separa todo
                  </h2>
                  <div className="p-6  bg-[#16181D] border border-[rgba(255,255,255,0.1)] mb-6">
                    <p className="text-lg text-[#E5E5E5] font-medium">
                      ¿De dónde sale el dinero que se le paga a cada participante?
                    </p>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] mt-1">→</span>
                      <div>
                        <strong className="text-[#E5E5E5]">Pirámide:</strong>
                        <p className="text-[#A3A3A3] text-sm mt-1">
                          Sale de lo que pagan los que van llegando. El producto no existe o es
                          una excusa.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] mt-1">→</span>
                      <div>
                        <strong className="text-[#E5E5E5]">Empresa de redes de mercadeo legal:</strong>
                        <p className="text-[#A3A3A3] text-sm mt-1">
                          Sale de la venta de productos a consumidores. Las comisiones se pagan
                          sobre lo que se compra, no sobre cuántas personas se inscriben.
                        </p>
                      </div>
                    </li>
                  </ul>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    Lo que exige la Ley 1700 de 2013
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] mt-1">→</span>
                      <span className="text-[#A3A3A3]">Que la compensación provenga de la venta de bienes y servicios.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] mt-1">→</span>
                      <span className="text-[#A3A3A3]">Que la empresa tenga al menos una oficina abierta al público de manera permanente: una dirección física, no solo una página web.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] mt-1">→</span>
                      <span className="text-[#A3A3A3]">Que cada vendedor independiente firme un contrato escrito con el plan de compensación, la forma de pago y las causas de terminación, y que pueda terminarlo por escrito cuando quiera.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] mt-1">→</span>
                      <span className="text-[#A3A3A3]">Que ningún contrato le obligue a comprar inventario por fuera de lo pactado, ni a permanecer o a ser exclusivo.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] mt-1">→</span>
                      <span className="text-[#A3A3A3]">La Superintendencia de Sociedades vigila a las empresas que se dedican a esta actividad.</span>
                    </li>
                  </ul>
                </section>

                <div className="p-6  bg-[#16181D] border border-[rgba(255,255,255,0.1)] mb-12">
                  <p className="text-lg italic text-[#A3A3A3]">
                    &quot;La ley no pregunta si hay una red.
                    <span className="text-[#C5A059]"> Pregunta de dónde sale el dinero.</span>&quot;
                  </p>
                </div>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    Señales de alerta
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#16181D] border border-[#9E2A3A]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-[#9E2A3A] text-xl">1</span>
                        <p className="text-[#E5E5E5] mt-1">Le dicen que la única forma de ganar es inscribir personas.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#16181D] border border-[#9E2A3A]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-[#9E2A3A] text-xl">2</span>
                        <p className="text-[#E5E5E5] mt-1">Le piden mucho dinero para inscribirse, sin un producto equivalente.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#16181D] border border-[#9E2A3A]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-[#9E2A3A] text-xl">3</span>
                        <p className="text-[#E5E5E5] mt-1">Nadie compraría el producto si no hubiera negocio de por medio.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#16181D] border border-[#9E2A3A]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-[#9E2A3A] text-xl">4</span>
                        <p className="text-[#E5E5E5] mt-1">Le obligan a comprar grandes cantidades cada mes.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#16181D] border border-[#9E2A3A]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-[#9E2A3A] text-xl">5</span>
                        <p className="text-[#E5E5E5] mt-1">Le garantizan una cifra en un plazo. Ninguna empresa seria garantiza ingresos.</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    Señales de una empresa seria
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#16181D] border border-[#C5A059]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-[#C5A059]">✓</span>
                        <p className="text-[#E5E5E5]">Productos que la gente compra por lo que son.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#16181D] border border-[#C5A059]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-[#C5A059]">✓</span>
                        <p className="text-[#E5E5E5]">Lo que se paga al iniciar es producto, no una cuota.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#16181D] border border-[#C5A059]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-[#C5A059]">✓</span>
                        <p className="text-[#E5E5E5]">La empresa envía el pedido al cliente: usted no guarda inventario en su casa.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#16181D] border border-[#C5A059]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-[#C5A059]">✓</span>
                        <p className="text-[#E5E5E5]">Oficinas abiertas al público, años de operación y presencia en varios países.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#16181D] border border-[#C5A059]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-[#C5A059]">✓</span>
                        <p className="text-[#E5E5E5]">Registro sanitario de sus productos (en Colombia, el INVIMA) y afiliación a la asociación de venta directa (en Colombia, ACOVEDI).</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    Preguntas que conviene hacer antes de iniciar
                  </h2>
                  {/* La 4 va así a propósito: nuestro modelo tiene una compra mensual de
                      50 PV, y la pregunta invita a la respuesta real en vez de esconderla. */}
                  <ol className="space-y-3 text-[#A3A3A3]">
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] font-semibold">1.</span>
                      <span>¿Compraría este producto aunque no hubiera negocio de por medio?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] font-semibold">2.</span>
                      <span>¿Cuántos años lleva la empresa, en cuántos países, y dónde queda su oficina?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] font-semibold">3.</span>
                      <span>¿Cuánto cuesta iniciar y qué producto recibe a cambio?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] font-semibold">4.</span>
                      <span>¿Hay una compra mínima cada mes, y para qué es?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] font-semibold">5.</span>
                      <span>¿Las comisiones salen de la venta de productos o de las inscripciones?</span>
                    </li>
                  </ol>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    En resumen
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    En Colombia la venta multinivel es legal y está regulada: la Ley 1700 pide
                    oficina abierta, contrato por escrito y que el dinero salga de la venta de
                    productos. Lo ilegal es usar la estructura de red para pasar dinero de los que
                    llegan a los que ya estaban. Con estas cinco preguntas, la diferencia se ve.
                  </p>
                </section>
              </div>

              {/* CTA Box - Industrial Geometry */}
              <div className="mt-16 p-8 bg-[#16181D] border border-[#C5A059]/20 text-center">
                <h3 className="text-xl font-serif mb-4">
                  ¿Quiere hacerle estas preguntas a una empresa real?
                </h3>
                <p className="text-[#A3A3A3] mb-6">
                  Pregúntele a Queswa por Gano Excel, la empresa que fabrica y despacha nuestros
                  productos: nueve sedes abiertas al público en Colombia, 30 años y presencia en
                  más de 60 países. Le responde con el plan de compensación en detalle, a
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
      </main>
    </>
  );
}
