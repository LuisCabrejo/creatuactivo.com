/**
 * Copyright © 2026 CreaTuActivo.com
 * Blog - Centro de Recursos (Shadow Funnel Content)
 * SEO-optimized articles for organic traffic
 *
 * THE ARCHITECT'S SUITE - Bimetallic System v3.0
 */

import Link from 'next/link';
import Image from 'next/image';
import StrategicNavigation from '@/components/StrategicNavigation';
import { IndustrialHeader } from '@/components/IndustrialHeader';

export const metadata = {
  title: 'Blog - Recursos para Construir tu Soberanía Financiera | CreaTuActivo',
  description: 'Artículos y guías sobre activos digitales, network marketing moderno, y estrategias para construir ingresos residuales desde casa.',
};

const articles = [
  {
    slug: 'network-marketing-obsoleto',
    image: '/images/blog/thumb-blog-problem.jpg',
    label: 'ANÁLISIS DE RIESGO',
    cardTitle: '¿Es tu plan financiero una trampa?',
    excerpt: 'El modelo de los 90s murió. Descubre por qué evolucionamos hacia un sistema de construcción de activos.',
    category: 'Industria',
    readTime: '6 min',
  },
  {
    slug: 'empleo-vs-activos',
    image: '/images/blog/thumb-blog-system.jpg',
    label: 'SISTEMAS DISTRIBUIDOS',
    cardTitle: 'La ingeniería detrás del ingreso pasivo',
    excerpt: 'Por qué trabajar más horas no es la respuesta. El concepto de ingreso residual y cómo construir activos.',
    category: 'Educación Financiera',
    readTime: '6 min',
  },
  {
    slug: 'legalidad-network-marketing',
    image: '/images/blog/thumb-blog-sovereignty.jpg',
    label: 'MENTALIDAD DE FUNDADOR',
    cardTitle: 'El código de la soberanía patrimonial',
    excerpt: 'Cómo distinguir un negocio legítimo de un esquema piramidal. Ley 1700 y criterios de la FTC explicados.',
    category: 'Legal',
    readTime: '7 min',
  },
];

export default function BlogPage() {
  return (
    <>
      <StrategicNavigation />
      <main
        className="min-h-screen text-[#E5E5E5]"
        style={{
          backgroundImage: `linear-gradient(rgba(12,12,12,0.62), rgba(12,12,12,0.62)), url('/images/servilleta/fondo-global-hormigon.jpg')`,
          backgroundSize: 'cover, 600px 600px',
          backgroundRepeat: 'no-repeat, repeat',
          backgroundAttachment: 'fixed, fixed',
        }}
      >
        <div className="relative z-10">
          {/* Header */}
          <IndustrialHeader
            title="INSIGHTS ESTRATÉGICOS"
            subtitle="Inteligencia para construir soberanía financiera"
            refCode="KNOWLEDGE_BASE_V1"
            imageSrc="/images/blog/header-blog.jpg"
            imageAlt=""
          />

          {/* Article Grid */}
          <section className="py-0 px-6">
            <div
              className="max-w-5xl mx-auto"
              style={{
                background: 'rgba(22, 24, 29, 0.80)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                border: '1px solid rgba(212, 175, 55, 0.1)',
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                marginTop: '-1rem',
                position: 'relative',
                zIndex: 10,
              }}
            >
              <div className="grid md:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group block"
                    style={{
                      background: 'rgba(15, 17, 21, 0.9)',
                      border: '1px solid rgba(197, 160, 89, 0.15)',
                      overflow: 'hidden',
                      transition: 'border-color 0.3s ease',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                      <Image
                        src={article.image}
                        alt=""
                        fill
                        style={{
                          objectFit: 'cover',
                          filter: 'grayscale(60%) brightness(0.7)',
                        }}
                        className="md:group-hover:scale-105 md:transition-transform md:duration-500"
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, transparent 40%, rgba(15,17,21,0.9) 100%)',
                        pointerEvents: 'none',
                      }} />
                      <div style={{
                        position: 'absolute', top: 12, left: 12,
                        fontFamily: "'Roboto Mono', monospace",
                        fontSize: '0.65rem', letterSpacing: '0.15em',
                        color: '#00e5ff',
                        background: 'rgba(0,0,0,0.7)',
                        padding: '4px 10px',
                        pointerEvents: 'none',
                      }}>
                        {article.label}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px' }}>
                      <div style={{
                        display: 'flex', gap: '12px', marginBottom: '10px',
                        fontSize: '0.7rem', fontFamily: "'Roboto Mono', monospace", color: '#64748B',
                      }}>
                        <span>{article.category}</span>
                        <span>·</span>
                        <span>{article.readTime} lectura</span>
                      </div>
                      <h2
                        className="group-hover:text-[#E5C279]"
                        style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: '#E5E5E5',
                          marginBottom: '8px',
                          transition: 'color 0.3s',
                          lineHeight: 1.3,
                        }}
                      >
                        {article.cardTitle}
                      </h2>
                      <p style={{ fontSize: '0.85rem', color: '#A3A3A3', lineHeight: 1.6, margin: 0 }}>
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] mb-6">
                ¿Listo para pasar de la teoría a la práctica?
              </p>
              <p className="text-[#A3A3A3] mb-10">
                El Reto de 5 Días te muestra cómo aplicar estos conceptos en tu vida real.
              </p>
              <Link
                href="/reto-5-dias"
                className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-10 py-5 transition-all duration-300 hover:translate-y-[-2px] bg-[#F59E0B] text-[#0B0C0C]"
                style={{
                  clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                }}
              >
                Unirme al Reto de 5 Días →
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="px-6 py-10 border-t border-[rgba(229,194,121,0.1)]">
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
