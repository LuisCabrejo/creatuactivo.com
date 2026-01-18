/**
 * Copyright © 2026 CreaTuActivo.com
 * Blog Article: Legalidad Network Marketing
 * SEO Shadow Funnel Content
 *
 * THE ARCHITECT'S SUITE - Bimetallic System v3.0
 * Gold (#C5A059): CTAs, highlights, key titles
 * Titanium (#94A3B8): Structural elements
 */

import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';

export const metadata = {
  title: 'La verdad sobre la legalidad de los negocios digitales en América (Ley 1700) | CreaTuActivo Blog',
  description: 'Cómo distinguir un negocio legítimo de un esquema piramidal. Ley 1700 en Colombia, criterios de la FTC y señales de alerta explicados.',
  keywords: 'ley 1700 colombia, network marketing legal, negocios digitales legales, MLM legal, pirámide vs multinivel, FTC, multinivel legítimo',
};

export default function LegalidadNetworkMarketingPage() {
  return (
    <>
      <StrategicNavigation />
      <main className="min-h-screen bg-[#0F1115] text-[#E5E5E5]">
        {/* Gradient Background */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(197, 160, 89, 0.08) 0%, transparent 50%)'
          }}
        />

        <div className="relative z-10">
          {/* Article Header */}
          <article className="pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
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

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-8 font-serif">
                La verdad sobre la legalidad de los
                <span className="text-[#C5A059]"> negocios digitales en América</span>
              </h1>

              <p className="text-xl text-[#A3A3A3] mb-12 leading-relaxed">
                Cómo distinguir un negocio legítimo de un esquema piramidal.
                Criterios de la FTC explicados de forma clara.
              </p>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    La pregunta que todos hacen
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    &quot;¿Esto es una pirámide?&quot; es probablemente la pregunta más común cuando
                    alguien escucha &quot;network marketing&quot; o &quot;multinivel&quot;.
                  </p>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    Es una pregunta válida. Existen esquemas fraudulentos que usan la estructura
                    de redes para estafar personas. Pero también existen empresas legítimas
                    que operan legalmente en más de 100 países.
                  </p>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    La diferencia es clara si sabes qué buscar.
                  </p>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    La definición legal
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    Según la FTC (Federal Trade Commission de Estados Unidos), la diferencia
                    entre un negocio legítimo y un esquema piramidal se reduce a una pregunta:
                  </p>
                  <div className="p-6 rounded-2xl bg-[#1A1D23] border border-[rgba(255,255,255,0.1)] mb-6">
                    <p className="text-lg text-[#E5E5E5] font-medium">
                      ¿De dónde viene el dinero que se paga a los participantes?
                    </p>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] mt-1">→</span>
                      <div>
                        <strong className="text-[#E5E5E5]">Esquema piramidal:</strong>
                        <p className="text-[#A3A3A3] text-sm mt-1">
                          El dinero viene principalmente de nuevos participantes que pagan
                          por unirse. No hay producto real o el producto es solo una excusa.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] mt-1">→</span>
                      <div>
                        <strong className="text-[#E5E5E5]">Network marketing legítimo:</strong>
                        <p className="text-[#A3A3A3] text-sm mt-1">
                          El dinero viene de la venta de productos reales a consumidores
                          finales. Las comisiones se pagan sobre ventas, no sobre reclutamiento.
                        </p>
                      </div>
                    </li>
                  </ul>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    Las 5 señales de alerta (Red Flags)
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-6">
                    La FTC identifica estas señales de un posible esquema fraudulento:
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#1A1D23] border border-red-500/20">
                      <div className="flex items-start gap-3">
                        <span className="text-red-400 text-xl">1</span>
                        <div>
                          <h4 className="font-medium text-[#E5E5E5]">Énfasis en reclutamiento sobre ventas</h4>
                          <p className="text-[#A3A3A3] text-sm mt-1">
                            Si te dicen que la única forma de ganar es &quot;meter gente&quot;, cuidado.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#1A1D23] border border-red-500/20">
                      <div className="flex items-start gap-3">
                        <span className="text-red-400 text-xl">2</span>
                        <div>
                          <h4 className="font-medium text-[#E5E5E5]">Costos de entrada excesivos</h4>
                          <p className="text-[#A3A3A3] text-sm mt-1">
                            Si te piden miles de dólares para &quot;unirte&quot; sin un producto equivalente, alerta.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#1A1D23] border border-red-500/20">
                      <div className="flex items-start gap-3">
                        <span className="text-red-400 text-xl">3</span>
                        <div>
                          <h4 className="font-medium text-[#E5E5E5]">Producto sin valor real</h4>
                          <p className="text-[#A3A3A3] text-sm mt-1">
                            Si nadie compraría el producto sin la &quot;oportunidad de negocio&quot;, problema.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#1A1D23] border border-red-500/20">
                      <div className="flex items-start gap-3">
                        <span className="text-red-400 text-xl">4</span>
                        <div>
                          <h4 className="font-medium text-[#E5E5E5]">Compras obligatorias mensuales altas</h4>
                          <p className="text-[#A3A3A3] text-sm mt-1">
                            Si te obligan a comprar grandes cantidades de inventario cada mes, señal de alerta.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#1A1D23] border border-red-500/20">
                      <div className="flex items-start gap-3">
                        <span className="text-red-400 text-xl">5</span>
                        <div>
                          <h4 className="font-medium text-[#E5E5E5]">Promesas de ingresos garantizados</h4>
                          <p className="text-[#A3A3A3] text-sm mt-1">
                            Si te garantizan que ganarás X cantidad en Y tiempo, desconfía. Ningún negocio real puede garantizar ingresos.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    Las señales de legitimidad (Green Flags)
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-6">
                    Qué buscar en una empresa de network marketing legítima:
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#1A1D23] border border-[#C5A059]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-[#C5A059]">✓</span>
                        <div>
                          <h4 className="font-medium text-[#E5E5E5]">Productos con demanda real</h4>
                          <p className="text-[#A3A3A3] text-sm mt-1">
                            Productos que consumidores comprarían aunque no hubiera oportunidad de negocio.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#1A1D23] border border-[#C5A059]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-[#C5A059]">✓</span>
                        <div>
                          <h4 className="font-medium text-[#E5E5E5]">Costo de entrada razonable</h4>
                          <p className="text-[#A3A3A3] text-sm mt-1">
                            El costo inicial corresponde a producto real que tú mismo consumes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#1A1D23] border border-[#C5A059]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-[#C5A059]">✓</span>
                        <div>
                          <h4 className="font-medium text-[#E5E5E5]">Sin inventario obligatorio</h4>
                          <p className="text-[#A3A3A3] text-sm mt-1">
                            La empresa envía directamente a clientes. No necesitas garage lleno de productos.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#1A1D23] border border-[#C5A059]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-[#C5A059]">✓</span>
                        <div>
                          <h4 className="font-medium text-[#E5E5E5]">Historial comprobable</h4>
                          <p className="text-[#A3A3A3] text-sm mt-1">
                            Empresa con años de operación, presente en múltiples países, $0 deuda.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#1A1D23] border border-[#C5A059]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-[#C5A059]">✓</span>
                        <div>
                          <h4 className="font-medium text-[#E5E5E5]">Income disclosure transparente</h4>
                          <p className="text-[#A3A3A3] text-sm mt-1">
                            La empresa publica cuánto ganan sus distribuidores promedio, no solo los top.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="p-6 rounded-2xl bg-[#1A1D23] border border-[rgba(255,255,255,0.1)] mb-12">
                  <p className="text-lg italic text-[#A3A3A3]">
                    &quot;La estructura de red no es ilegal. Lo ilegal es cuando
                    <span className="text-[#C5A059]"> el dinero viene del reclutamiento, no de las ventas.</span>&quot;
                  </p>
                </div>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    Preguntas que debes hacer
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-6">
                    Antes de unirte a cualquier oportunidad de network marketing:
                  </p>
                  <ol className="space-y-3 text-[#A3A3A3]">
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] font-semibold">1.</span>
                      <span>¿Compraría este producto si no hubiera oportunidad de negocio?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] font-semibold">2.</span>
                      <span>¿Cuántos años lleva operando la empresa? ¿En cuántos países?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] font-semibold">3.</span>
                      <span>¿Cuál es el costo real de entrada y qué incluye?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] font-semibold">4.</span>
                      <span>¿Hay obligación de comprar inventario mensual?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#C5A059] font-semibold">5.</span>
                      <span>¿Las comisiones vienen de ventas de producto o de inscripciones?</span>
                    </li>
                  </ol>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    La conclusión
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    El network marketing como modelo de distribución es 100% legal y está
                    reconocido por reguladores en todo el mundo.
                  </p>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    Lo que no es legal son los esquemas que usan la estructura de red como
                    fachada para transferir dinero de nuevos participantes a los de arriba.
                  </p>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    La diferencia es fácil de detectar si haces las preguntas correctas.
                  </p>
                </section>
              </div>

              {/* CTA Box */}
              <div className="mt-16 p-8 rounded-2xl bg-[#1A1D23] border border-[#C5A059]/20">
                <h3 className="text-xl font-serif mb-4">
                  ¿Quieres evaluar una oportunidad real?
                </h3>
                <p className="text-[#A3A3A3] mb-6">
                  En el Reto de 5 Días te presento un modelo con 28+ años de operación,
                  presente en 60+ países, y te explico exactamente cómo funciona el plan
                  de compensación. Sin presión, solo información.
                </p>
                <Link
                  href="/reto-5-dias"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A059] text-[#0F1115] font-semibold rounded-xl hover:bg-[#E8C547] transition-colors"
                >
                  Unirme al Reto Gratis
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
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
