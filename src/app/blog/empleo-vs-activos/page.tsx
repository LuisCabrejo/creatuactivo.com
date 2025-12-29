/**
 * Copyright © 2025 CreaTuActivo.com
 * Blog Article: Empleo vs Activos
 * SEO Shadow Funnel Content
 */

import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';

export const metadata = {
  title: 'Empleo vs Activos: La Diferencia que No te Enseñaron | CreaTuActivo Blog',
  description: 'Por qué trabajar más horas no es la respuesta. Descubre la diferencia entre ingreso lineal e ingreso residual y cómo construir activos.',
  keywords: 'ingreso residual, activos, libertad financiera, independencia financiera, ingresos pasivos, empleo',
};

export default function EmpleoVsActivosPage() {
  return (
    <>
      <StrategicNavigation />
      <main className="min-h-screen bg-[#0a0a0f] text-[#f5f5f5]">
        {/* Gradient Background */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)'
          }}
        />

        <div className="relative z-10">
          {/* Article Header */}
          <article className="pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-[#6b6b75] mb-8">
                <Link href="/blog" className="hover:text-[#a0a0a8]">Blog</Link>
                <span>/</span>
                <span className="text-[#a0a0a8]">Educación Financiera</span>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full">
                  Educación Financiera
                </span>
                <span className="text-xs text-[#6b6b75]">6 min de lectura</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-8 font-serif">
                Empleo vs Activos:
                <span className="text-[#D4AF37]"> La Diferencia que No te Enseñaron</span>
              </h1>

              <p className="text-xl text-[#a0a0a8] mb-12 leading-relaxed">
                Por qué trabajar más horas no es la respuesta. El concepto de ingreso
                residual explicado de forma simple.
              </p>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#f5f5f5]">
                    El problema con el plan tradicional
                  </h2>
                  <p className="text-[#a0a0a8] leading-relaxed mb-4">
                    La mayoría de las personas siguen un plan que sus padres les enseñaron:
                    estudia, consigue un buen empleo, trabaja 40 años, retírate con una pensión.
                  </p>
                  <p className="text-[#a0a0a8] leading-relaxed mb-4">
                    Pero hay un problema matemático con este plan: la pensión típica reemplaza
                    solo el 40% de tu último ingreso. Un ingreso que, siendo honestos,
                    ya no alcanzaba mientras lo ganabas completo.
                  </p>
                  <p className="text-[#a0a0a8] leading-relaxed">
                    Y peor aún: si dejas de trabajar antes de tiempo—por enfermedad, por recortes,
                    por cualquier razón—el ingreso simplemente para.
                  </p>
                </section>

                <div className="p-6 rounded-2xl bg-[#12121a] border border-[#2a2a35] mb-12">
                  <p className="text-lg italic text-[#a0a0a8]">
                    &quot;El empleado gana dinero. El constructor de activos
                    <span className="text-[#D4AF37]"> construye máquinas que generan dinero.</span>&quot;
                  </p>
                </div>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#f5f5f5]">
                    Dos tipos de ingreso
                  </h2>
                  <p className="text-[#a0a0a8] leading-relaxed mb-6">
                    La diferencia fundamental que no enseñan en la escuela:
                  </p>

                  {/* Comparison Cards */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 rounded-xl bg-[#0a0a0f] border border-[#2a2a35] opacity-70">
                      <h3 className="text-lg font-semibold mb-4 text-red-400">Ingreso Lineal</h3>
                      <ul className="space-y-3 text-sm text-[#a0a0a8]">
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

                    <div className="p-6 rounded-xl bg-[#0a0a0f] border border-[#D4AF37]/30">
                      <h3 className="text-lg font-semibold mb-4 text-[#D4AF37]">Ingreso Residual</h3>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-[#D4AF37]">✓</span>
                          <span className="text-[#f5f5f5]">Trabajo una vez, ganas repetidamente</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#D4AF37]">✓</span>
                          <span className="text-[#f5f5f5]">El sistema trabaja sin tu presencia</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#D4AF37]">✓</span>
                          <span className="text-[#f5f5f5]">Sin techo teórico de ingresos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#D4AF37]">✓</span>
                          <span className="text-[#f5f5f5]">Heredable a tu familia</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#f5f5f5]">
                    Ejemplos de activos que generan ingreso residual
                  </h2>
                  <p className="text-[#a0a0a8] leading-relaxed mb-6">
                    Un activo es algo que pones a trabajar y sigue generando valor sin tu
                    intervención constante:
                  </p>
                  <ul className="space-y-4 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="text-[#D4AF37] mt-1">→</span>
                      <div>
                        <strong className="text-[#f5f5f5]">Bienes raíces</strong>
                        <p className="text-[#a0a0a8] text-sm mt-1">
                          Compras una propiedad, la rentas, recibes ingresos mensuales.
                          (Requiere capital inicial alto)
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#D4AF37] mt-1">→</span>
                      <div>
                        <strong className="text-[#f5f5f5]">Dividendos de acciones</strong>
                        <p className="text-[#a0a0a8] text-sm mt-1">
                          Inviertes en empresas, recibes porcentaje de ganancias.
                          (Requiere ahorro significativo)
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#D4AF37] mt-1">→</span>
                      <div>
                        <strong className="text-[#f5f5f5]">Propiedad intelectual</strong>
                        <p className="text-[#a0a0a8] text-sm mt-1">
                          Escribes un libro, grabas música, cada venta genera regalías.
                          (Requiere talento específico)
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#D4AF37] mt-1">→</span>
                      <div>
                        <strong className="text-[#f5f5f5]">Redes de distribución</strong>
                        <p className="text-[#a0a0a8] text-sm mt-1">
                          Construyes un canal de consumidores, el consumo recurrente genera comisiones.
                          (Requiere tiempo y sistema correcto)
                        </p>
                      </div>
                    </li>
                  </ul>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#f5f5f5]">
                    La pregunta correcta
                  </h2>
                  <p className="text-[#a0a0a8] leading-relaxed mb-4">
                    La pregunta no es &quot;¿cuánto ganas?&quot; sino &quot;¿qué pasaría con tus ingresos
                    si dejas de trabajar por 6 meses?&quot;
                  </p>
                  <p className="text-[#a0a0a8] leading-relaxed mb-4">
                    Si la respuesta es &quot;desaparecerían&quot;, entonces no tienes activos.
                    Tienes un empleo bien pagado—pero sigues en la carrera de la rata.
                  </p>
                  <p className="text-[#a0a0a8] leading-relaxed">
                    La libertad financiera no se trata de cuánto ganas. Se trata de cuántos
                    meses podrías vivir sin trabajar. Y eso solo se logra construyendo activos.
                  </p>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif mb-4 text-[#f5f5f5]">
                    ¿Por dónde empezar?
                  </h2>
                  <p className="text-[#a0a0a8] leading-relaxed mb-4">
                    Para la mayoría de las personas, las barreras de entrada a los activos
                    tradicionales son altas:
                  </p>
                  <ul className="space-y-2 text-[#a0a0a8] mb-6">
                    <li>• Bienes raíces: necesitas cientos de miles de dólares</li>
                    <li>• Dividendos significativos: necesitas un portafolio de seis cifras</li>
                    <li>• Negocio propio: necesitas capital, empleados, local</li>
                  </ul>
                  <p className="text-[#a0a0a8] leading-relaxed">
                    Pero hay un tipo de activo que puedes empezar a construir con menos de $200
                    y unas pocas horas semanales: una red de distribución. No es el único
                    camino, pero es el más accesible para quien empieza desde cero.
                  </p>
                </section>
              </div>

              {/* CTA Box */}
              <div className="mt-16 p-8 rounded-2xl bg-[#12121a] border border-[#D4AF37]/20">
                <h3 className="text-xl font-serif mb-4">
                  ¿Quieres aprender a construir activos?
                </h3>
                <p className="text-[#a0a0a8] mb-6">
                  En el Reto de 5 Días te explico paso a paso cómo funciona un sistema
                  diseñado para que personas sin capital ni experiencia puedan empezar
                  a construir ingresos residuales.
                </p>
                <Link
                  href="/reto-5-dias"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0a0a0f] font-semibold rounded-xl hover:bg-[#E8C547] transition-colors"
                >
                  Unirme al Reto Gratis
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Back to Blog */}
              <div className="mt-12 pt-8 border-t border-[#2a2a35]">
                <Link
                  href="/blog"
                  className="text-[#a0a0a8] hover:text-[#D4AF37] transition-colors inline-flex items-center gap-2"
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
          <footer className="px-6 py-12 border-t border-[#2a2a35]">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-sm text-[#6b6b75]">
                © 2025 CreaTuActivo.com ·
                <Link href="/privacidad" className="hover:text-[#a0a0a8] ml-2">
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
