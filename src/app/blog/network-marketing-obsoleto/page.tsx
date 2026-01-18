/**
 * Copyright © 2026 CreaTuActivo.com
 * Blog Article: Network Marketing Obsoleto → Arquitectura de Activos
 * SEO Shadow Funnel Content
 *
 * THE ARCHITECT'S SUITE - Bimetallic System v3.0
 * Gold (#C5A059): CTAs, highlights, key titles
 * Titanium (#94A3B8): Structural elements
 */

import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';

export const metadata = {
  title: '¿Es el Network Marketing un modelo obsoleto? Por qué evolucionamos a la Arquitectura de Activos | CreaTuActivo Blog',
  description: 'El network marketing tradicional está muriendo. Descubre por qué evolucionamos hacia un modelo de Arquitectura de Activos con tecnología y sistemas automatizados.',
  keywords: 'network marketing obsoleto, arquitectura de activos, MLM moderno, multinivel 2026, sistema de activos, ingresos residuales, network marketing con IA',
};

export default function NetworkMarketingObsoletoPage() {
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
                <span className="text-[#A3A3A3]">Industria</span>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded-full">
                  Industria
                </span>
                <span className="text-xs text-[#6B7280]">6 min de lectura</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-8 font-serif">
                ¿Es el Network Marketing un modelo obsoleto?
                <span className="text-[#C5A059]"> Por qué evolucionamos a la Arquitectura de Activos</span>
              </h1>

              <p className="text-xl text-[#A3A3A3] mb-12 leading-relaxed">
                El modelo de los 90s murió. Pero no lo reemplazamos con &quot;algo mejor&quot;—lo
                transformamos en un sistema de construcción de activos.
              </p>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    La verdad incómoda sobre el network marketing
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    Seamos honestos: cuando escuchas &quot;network marketing&quot; o &quot;multinivel&quot;,
                    probablemente piensas en reuniones de hotel, listas de 100 amigos, y
                    mensajes incómodos en Facebook.
                  </p>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    Y tienes razón. Ese modelo <strong className="text-[#E5E5E5]">está obsoleto</strong>.
                    Era un sistema diseñado para una era sin internet, sin smartphones, sin
                    inteligencia artificial.
                  </p>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    El problema es que muchos siguen intentando aplicar métodos de 1995
                    en un mundo de 2026. Es como intentar competir en e-commerce usando
                    un catálogo impreso.
                  </p>
                </section>

                <div className="p-6 rounded-2xl bg-[#1A1D23] border border-[rgba(255,255,255,0.1)] mb-12">
                  <p className="text-lg italic text-[#A3A3A3]">
                    &quot;No eliminamos el network marketing.
                    <span className="text-[#C5A059]"> Lo evolucionamos a Arquitectura de Activos.</span>&quot;
                  </p>
                </div>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    ¿Qué es la Arquitectura de Activos?
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-6">
                    Es un cambio de mentalidad fundamental:
                  </p>

                  {/* Comparison */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-5 rounded-xl bg-[#0F1115] border border-[rgba(255,255,255,0.1)] opacity-70">
                      <h3 className="text-lg font-semibold mb-3 text-red-400">Network Marketing Tradicional</h3>
                      <ul className="space-y-2 text-sm text-[#A3A3A3]">
                        <li className="flex items-start gap-2">
                          <span className="text-red-400">✕</span>
                          <span>Vender productos a conocidos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-400">✕</span>
                          <span>Hacer reuniones presenciales</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-400">✕</span>
                          <span>Memorizar guiones de ventas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-400">✕</span>
                          <span>Perseguir prospectos</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-5 rounded-xl bg-[#0F1115] border border-[#C5A059]/30">
                      <h3 className="text-lg font-semibold mb-3 text-[#C5A059]">Arquitectura de Activos</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-[#C5A059]">✓</span>
                          <span className="text-[#E5E5E5]">Construir sistemas que generan</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#C5A059]">✓</span>
                          <span className="text-[#E5E5E5]">IA que educa y filtra 24/7</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#C5A059]">✓</span>
                          <span className="text-[#E5E5E5]">Funnels que trabajan solos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#C5A059]">✓</span>
                          <span className="text-[#E5E5E5]">Atraer en lugar de perseguir</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-[#A3A3A3] leading-relaxed">
                    La diferencia fundamental: en el modelo tradicional, <em>tú eres el motor</em>.
                    En la Arquitectura de Activos, <em>tú eres el arquitecto</em> de un sistema
                    que funciona sin tu presencia constante.
                  </p>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    Los 3 pilares de la evolución
                  </h2>

                  <div className="space-y-6">
                    <div className="p-5 rounded-xl bg-[#1A1D23] border border-[rgba(255,255,255,0.1)]">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl font-bold text-[#C5A059]">1</span>
                        <div>
                          <h4 className="font-semibold text-[#E5E5E5] mb-2">Tecnología como multiplicador</h4>
                          <p className="text-[#A3A3A3] text-sm">
                            IA conversacional (Queswa) que responde preguntas, maneja objeciones
                            y califica prospectos—mientras tú duermes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-[#1A1D23] border border-[rgba(255,255,255,0.1)]">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl font-bold text-[#C5A059]">2</span>
                        <div>
                          <h4 className="font-semibold text-[#E5E5E5] mb-2">Infraestructura probada</h4>
                          <p className="text-[#A3A3A3] text-sm">
                            No empezamos de cero. Nos apalancamos en empresas con 28+ años,
                            presencia en 60+ países, y logística global. El riesgo de
                            &quot;startup&quot; no existe.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-[#1A1D23] border border-[rgba(255,255,255,0.1)]">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl font-bold text-[#C5A059]">3</span>
                        <div>
                          <h4 className="font-semibold text-[#E5E5E5] mb-2">Consumo recurrente como base</h4>
                          <p className="text-[#A3A3A3] text-sm">
                            No vendemos productos de una vez. Construimos canales de consumo
                            diario (café, suplementos, cuidado personal) que generan ingresos
                            mes tras mes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    El problema del 95% resuelto
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    ¿Por qué el 95% fracasa en network marketing tradicional?
                    Dos razones principales:
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3 text-[#A3A3A3]">
                      <span className="text-red-400 font-bold">1.</span>
                      <span><strong className="text-[#E5E5E5]">&quot;No sé vender&quot;</strong> — Odian la idea de presionar a amigos y familia.</span>
                    </li>
                    <li className="flex items-start gap-3 text-[#A3A3A3]">
                      <span className="text-red-400 font-bold">2.</span>
                      <span><strong className="text-[#E5E5E5]">&quot;No tengo tiempo&quot;</strong> — Entre el trabajo y la familia, no hay horas para presentaciones.</span>
                    </li>
                  </ul>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    La Arquitectura de Activos elimina ambos problemas. La IA hace el trabajo
                    de &quot;vender&quot; (educar, filtrar, responder objeciones). Y los sistemas
                    automatizados trabajan 24/7—no dependen de tu tiempo.
                  </p>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    ¿Es esto para ti?
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    La Arquitectura de Activos funciona para personas que:
                  </p>
                  <ul className="space-y-2 text-[#A3A3A3] mb-6">
                    <li className="flex items-start gap-2">
                      <span className="text-[#C5A059]">→</span>
                      <span>Buscan ingresos residuales, no otro empleo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C5A059]">→</span>
                      <span>Prefieren sistemas a habilidades de ventas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C5A059]">→</span>
                      <span>Entienden que los activos se construyen, no se compran</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C5A059]">→</span>
                      <span>Tienen paciencia para un proceso de 6-18 meses</span>
                    </li>
                  </ul>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    No es dinero rápido. Es construcción sistemática de algo que siga
                    generando cuando tú no estés presente.
                  </p>
                </section>
              </div>

              {/* CTA Box */}
              <div className="mt-16 p-8 rounded-2xl bg-[#1A1D23] border border-[#C5A059]/20">
                <h3 className="text-xl font-serif mb-4">
                  ¿Quieres ver cómo funciona en la práctica?
                </h3>
                <p className="text-[#A3A3A3] mb-6">
                  En el Reto de 5 Días te muestro exactamente cómo hemos evolucionado
                  del network marketing tradicional a la Arquitectura de Activos—y
                  cómo puedes empezar a construir el tuyo.
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
