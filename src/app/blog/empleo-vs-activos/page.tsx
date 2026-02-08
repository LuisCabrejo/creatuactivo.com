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

export const metadata = {
  title: 'Análisis Financiero: Empleo vs. Cartera de Activos | CreaTuActivo Blog',
  description: 'Por qué trabajar más horas no es la respuesta. Descubre la diferencia entre ingreso lineal e ingreso residual y cómo construir una cartera de activos.',
  keywords: 'análisis financiero, cartera de activos, ingreso residual, libertad financiera, independencia financiera, ingresos pasivos, empleo vs activos',
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
      <main
        className="min-h-screen text-[#E5E5E5]"
        style={{
          backgroundImage: `linear-gradient(rgba(12,12,12,0.62), rgba(12,12,12,0.62)), url('/images/servilleta/fondo-global-hormigon.jpg?v=20260208')`,
          backgroundSize: 'cover, 600px 600px',
          backgroundRepeat: 'no-repeat, repeat',
          backgroundAttachment: 'scroll, scroll',
        }}
      >
        <div className="relative z-10">
          <IndustrialHeader
            title="Análisis Financiero: Empleo vs. Cartera de Activos"
            refCode="ARTICLE_SYSTEM_V1"
            imageSrc="/images/blog/thumb-blog-system.jpg"
            imageAlt=""
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
                <span className="text-xs text-[#E5C279] bg-[#F59E0B]/10 px-3 py-1 rounded-full">
                  Educación Financiera
                </span>
                <span className="text-xs text-[#6B7280]">6 min de lectura</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-8 font-serif">
                Análisis Financiero:
                <span className="text-[#E5C279]"> Empleo vs. Cartera de Activos</span>
              </h1>

              <p className="text-xl text-[#A3A3A3] mb-12 leading-relaxed">
                Por qué trabajar más horas no es la respuesta. El concepto de ingreso
                residual explicado de forma simple.
              </p>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    El problema con el plan tradicional
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    La mayoría de las personas siguen un plan que sus padres les enseñaron:
                    estudia, consigue un buen empleo, trabaja 40 años, retírate con una pensión.
                  </p>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    Pero hay un problema matemático con este plan: la pensión típica reemplaza
                    solo el 40% de tu último ingreso. Un ingreso que, siendo honestos,
                    ya no alcanzaba mientras lo ganabas completo.
                  </p>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    Y peor aún: si dejas de trabajar antes de tiempo—por enfermedad, por recortes,
                    por cualquier razón—el ingreso simplemente para.
                  </p>
                </section>

                <div className="p-6  bg-[#16181D] border border-[rgba(255,255,255,0.1)] mb-12">
                  <p className="text-lg italic text-[#A3A3A3]">
                    &quot;El empleado gana dinero. El constructor de activos
                    <span className="text-[#E5C279]"> construye máquinas que generan dinero.</span>&quot;
                  </p>
                </div>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    Dos tipos de ingreso
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-6">
                    La diferencia fundamental que no enseñan en la escuela:
                  </p>

                  {/* Comparison Cards */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 rounded-xl bg-[#0B0C0C] border border-[rgba(255,255,255,0.1)] opacity-70">
                      <h3 className="text-lg font-semibold mb-4 text-red-400">Ingreso Lineal</h3>
                      <ul className="space-y-3 text-sm text-[#A3A3A3]">
                        <li className="flex items-start gap-2">
                          <span className="text-red-400">✕</span>
                          <span>Cambias 1 hora de trabajo por $X</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-400">✕</span>
                          <span>Si no trabajas, no ganas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-400">✕</span>
                          <span>Techo limitado por tus horas disponibles</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-400">✕</span>
                          <span>No heredable (muere contigo)</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 rounded-xl bg-[#0B0C0C] border border-[#C5A059]/30">
                      <h3 className="text-lg font-semibold mb-4 text-[#E5C279]">Ingreso Residual</h3>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-[#E5C279]">✓</span>
                          <span className="text-[#E5E5E5]">Trabajo una vez, ganas repetidamente</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#E5C279]">✓</span>
                          <span className="text-[#E5E5E5]">El sistema trabaja sin tu presencia</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#E5C279]">✓</span>
                          <span className="text-[#E5E5E5]">Sin techo teórico de ingresos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#E5C279]">✓</span>
                          <span className="text-[#E5E5E5]">Heredable a tu familia</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    Ejemplos de activos que generan ingreso residual
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-6">
                    Un activo es algo que pones a trabajar y sigue generando valor sin tu
                    intervención constante:
                  </p>
                  <ul className="space-y-4 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="text-[#E5C279] mt-1">→</span>
                      <div>
                        <strong className="text-[#E5E5E5]">Bienes raíces</strong>
                        <p className="text-[#A3A3A3] text-sm mt-1">
                          Compras una propiedad, la rentas, recibes ingresos mensuales.
                          (Requiere capital inicial alto)
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#E5C279] mt-1">→</span>
                      <div>
                        <strong className="text-[#E5E5E5]">Dividendos de acciones</strong>
                        <p className="text-[#A3A3A3] text-sm mt-1">
                          Inviertes en empresas, recibes porcentaje de ganancias.
                          (Requiere ahorro significativo)
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#E5C279] mt-1">→</span>
                      <div>
                        <strong className="text-[#E5E5E5]">Propiedad intelectual</strong>
                        <p className="text-[#A3A3A3] text-sm mt-1">
                          Escribes un libro, grabas música, cada venta genera regalías.
                          (Requiere talento específico)
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#E5C279] mt-1">→</span>
                      <div>
                        <strong className="text-[#E5E5E5]">Redes de distribución</strong>
                        <p className="text-[#A3A3A3] text-sm mt-1">
                          Construyes un canal de consumidores, el consumo recurrente genera comisiones.
                          (Requiere tiempo y sistema correcto)
                        </p>
                      </div>
                    </li>
                  </ul>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    La pregunta correcta
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    La pregunta no es &quot;¿cuánto ganas?&quot; sino &quot;¿qué pasaría con tus ingresos
                    si dejas de trabajar por 6 meses?&quot;
                  </p>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    Si la respuesta es &quot;desaparecerían&quot;, entonces no tienes activos.
                    Tienes un empleo bien pagado—pero sigues en la carrera de la rata.
                  </p>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    La libertad financiera no se trata de cuánto ganas. Se trata de cuántos
                    meses podrías vivir sin trabajar. Y eso solo se logra construyendo activos.
                  </p>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#E5E5E5]">
                    ¿Por dónde empezar?
                  </h2>
                  <p className="text-[#A3A3A3] leading-relaxed mb-4">
                    Para la mayoría de las personas, las barreras de entrada a los activos
                    tradicionales son altas:
                  </p>
                  <ul className="space-y-2 text-[#A3A3A3] mb-6">
                    <li>• Bienes raíces: necesitas cientos de miles de dólares</li>
                    <li>• Dividendos significativos: necesitas un portafolio de seis cifras</li>
                    <li>• Negocio propio: necesitas capital, empleados, local</li>
                  </ul>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    Pero hay un tipo de activo que puedes empezar a construir con menos de $200
                    y unas pocas horas semanales: una red de distribución. No es el único
                    camino, pero es el más accesible para quien empieza desde cero.
                  </p>
                </section>
              </div>

              {/* CTA Box - Industrial Geometry */}
              <div className="mt-16 p-8 bg-[#16181D] border border-[#C5A059]/20 text-center">
                <h3 className="text-xl font-serif mb-4">
                  ¿Quieres aprender a construir activos?
                </h3>
                <p className="text-[#A3A3A3] mb-6">
                  En el Reto de 5 Días te explico paso a paso cómo funciona un sistema
                  diseñado para que personas sin capital ni experiencia puedan empezar
                  a construir ingresos residuales.
                </p>
                <Link
                  href="/reto-5-dias"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#F59E0B] text-[#0B0C0C] font-semibold hover:bg-[#E8C547] transition-colors"
                  style={{
                    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                  }}
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
                  className="text-[#A3A3A3] hover:text-[#E5C279] transition-colors inline-flex items-center gap-2"
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
