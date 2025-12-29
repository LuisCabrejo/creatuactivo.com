/**
 * Copyright © 2025 CreaTuActivo.com
 * Blog - Centro de Recursos (Shadow Funnel Content)
 * SEO-optimized articles for organic traffic
 */

import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';

export const metadata = {
  title: 'Blog - Recursos para Construir tu Libertad Financiera | CreaTuActivo',
  description: 'Artículos y guías sobre activos digitales, network marketing moderno, y estrategias para construir ingresos residuales desde casa.',
};

const articles = [
  {
    slug: 'network-marketing-obsoleto',
    title: '¿Es el Network Marketing un modelo obsoleto? Por qué evolucionamos a la Arquitectura de Activos',
    excerpt: 'El modelo de los 90s murió. Descubre por qué evolucionamos hacia un sistema de construcción de activos.',
    category: 'Industria',
    readTime: '6 min',
    featured: true,
  },
  {
    slug: 'empleo-vs-activos',
    title: 'Análisis Financiero: Empleo vs. Cartera de Activos',
    excerpt: 'Por qué trabajar más horas no es la respuesta. El concepto de ingreso residual y cómo construir activos.',
    category: 'Educación Financiera',
    readTime: '6 min',
    featured: true,
  },
  {
    slug: 'legalidad-network-marketing',
    title: 'La verdad sobre la legalidad de los negocios digitales en América (Ley 1700)',
    excerpt: 'Cómo distinguir un negocio legítimo de un esquema piramidal. Ley 1700 y criterios de la FTC explicados.',
    category: 'Legal',
    readTime: '7 min',
    featured: true,
  },
];

export default function BlogPage() {
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
          {/* Hero */}
          <section className="pt-32 pb-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 text-sm text-[#a0a0a8] bg-[#1a1a24] px-4 py-2 rounded-full border border-[#2a2a35] mb-8">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full" />
                Centro de Recursos
              </span>

              <h1 className="text-4xl sm:text-5xl leading-tight mb-6 font-serif">
                Ideas para construir
                <br />
                <span className="text-[#D4AF37]">tu libertad financiera</span>
              </h1>

              <p className="text-xl text-[#a0a0a8] max-w-2xl mx-auto leading-relaxed">
                Artículos, guías y estrategias para quien busca alternativas al sistema tradicional.
              </p>
            </div>
          </section>

          {/* Featured Articles */}
          <section className="py-12 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {articles.filter(a => a.featured).map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group p-8 rounded-2xl bg-[#12121a] border border-[#2a2a35] hover:border-[#D4AF37]/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-[#6b6b75]">{article.readTime}</span>
                    </div>

                    <h2 className="text-xl font-semibold mb-3 group-hover:text-[#D4AF37] transition-colors">
                      {article.title}
                    </h2>

                    <p className="text-[#a0a0a8] text-sm leading-relaxed mb-4">
                      {article.excerpt}
                    </p>

                    <span className="text-sm text-[#D4AF37] inline-flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Leer artículo
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* All Articles */}
          <section className="py-12 px-6 bg-[#12121a]">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-serif mb-8">Todos los artículos</h2>

              <div className="space-y-4">
                {articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group flex items-center justify-between p-6 rounded-xl bg-[#0a0a0f] border border-[#2a2a35] hover:border-[#D4AF37]/30 transition-all duration-300"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-[#6b6b75]">{article.category}</span>
                        <span className="text-xs text-[#6b6b75]">·</span>
                        <span className="text-xs text-[#6b6b75]">{article.readTime}</span>
                      </div>
                      <h3 className="font-medium group-hover:text-[#D4AF37] transition-colors">
                        {article.title}
                      </h3>
                    </div>

                    <svg className="w-5 h-5 text-[#6b6b75] group-hover:text-[#D4AF37] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-serif mb-6">
                ¿Listo para pasar de la teoría a la práctica?
              </h2>
              <p className="text-[#a0a0a8] mb-8">
                El Reto de 5 Días te muestra cómo aplicar estos conceptos en tu vida real.
              </p>
              <Link
                href="/reto-5-dias"
                className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-10 py-5 rounded-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg bg-[#D4AF37] text-[#0a0a0f]"
              >
                Unirme al Reto de 5 Días
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </section>

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
