/**
 * Copyright © 2025 CreaTuActivo.com
 * Homepage - Quiet Luxury Branding
 * Basada en Framework Russell Brunson + StoryBrand + Quiet Tech
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';

// ============================================================================
// CSS VARIABLES - QUIET LUXURY PALETTE
// ============================================================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

  :root {
    --gold: #D4AF37;
    --gold-light: #E8C547;
    --gold-dark: #B8982F;
    --gold-muted: #C9A962;

    --bg-deep: #0a0a0f;
    --bg-surface: #12121a;
    --bg-card: #1a1a24;
    --bg-elevated: #22222e;

    --text-primary: #f5f5f5;
    --text-secondary: #a0a0a8;
    --text-muted: #6b6b75;

    --border: #2a2a35;
    --border-subtle: #1f1f28;

    /* Quiet Luxury - No traffic light colors */
    --accent-positive: var(--gold);
    --accent-negative: #6b6b75;
    --muted-warm: #8a7355;

    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'Inter', -apple-system, sans-serif;
  }
`;

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function HomePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <StrategicNavigation />
      <main
        className="min-h-screen"
        style={{
          backgroundColor: 'var(--bg-deep)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)'
        }}
      >
        <HeroSection />
        <ProblemSection />
        <EpiphanySection />
        <SolutionSection />
        <HowItWorksSection />
        <ForWhoSection />
        <SocialProofSection />
        <FinalCTASection />
        <Footer />
      </main>
    </>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection() {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden">
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)'
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge - más sutil */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-10"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)'
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--gold)' }}
            />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Solo 30 cupos disponibles
            </span>
          </div>

          {/* Headline - tipografía serif */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl leading-tight mb-8"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>Trabajas 50+ horas.</span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>Ganas bien.</span>
            <br />
            <span style={{ color: 'var(--gold)' }}>
              ¿Por qué no avanzas?
            </span>
          </h1>

          {/* Subheadline - más espaciado */}
          <p
            className="text-xl sm:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Descubre en 2 minutos cuántos años te faltan para dejar de
            depender de tu trabajo.
          </p>

          {/* CTA Buttons - más elegantes */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="#calculadora"
              className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                backgroundColor: 'var(--gold)',
                color: 'var(--bg-deep)'
              }}
            >
              Calcular Mi Número de Libertad
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <button
              onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center gap-3 font-medium text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:bg-[var(--bg-elevated)]"
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)'
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
              </svg>
              Ver cómo funciona
            </button>
          </div>

          {/* Trust indicators - minimalistas */}
          <div className="flex flex-wrap items-center justify-center gap-10 text-sm" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" style={{ color: 'var(--gold-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Sin riesgo</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" style={{ color: 'var(--gold-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>2 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" style={{ color: 'var(--gold-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <span>Resultado inmediato</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PROBLEM SECTION - EL VILLANO: EL PLAN POR DEFECTO
// ============================================================================

function ProblemSection() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Section header - EL VILLANO */}
          <div className="text-center mb-16">
            <span
              className="text-sm font-medium uppercase tracking-widest"
              style={{ color: 'var(--gold-muted)' }}
            >
              El enemigo invisible
            </span>
            <h2
              className="text-3xl sm:text-4xl mt-6 mb-6"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              Estás atrapado en
              <br />
              <span style={{ color: 'var(--gold)' }}>El Plan por Defecto</span>
            </h2>
            <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Trabajar → Pagar cuentas → Repetir.
              <br />
              Mes tras mes. Año tras año. Hasta que se te va la vida.
            </p>
          </div>

          {/* Problem cards - Síntomas del villano */}
          <div className="space-y-5">
            <ProblemCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              }
              title="El ciclo que no termina"
              description="Trabajas para pagar la tarjeta. Pagas la tarjeta para poder seguir trabajando. El fin de mes llega y empiezas de nuevo."
            />
            <ProblemCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              }
              title="Subes de sueldo, suben tus gastos"
              description="Te aumentan, te compras un mejor carro. Te ascienden, te mudas a mejor zona. 10 años después, sigues igual de atado."
            />
            <ProblemCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="El tiempo pasa, tú no avanzas"
              description="Miras atrás y han pasado 5, 10, 15 años. Trabajaste duro. Pero sigues dependiendo del próximo cheque."
            />
          </div>

          {/* The truth - Golpe de realidad */}
          <div
            className="mt-16 p-10 rounded-2xl text-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)'
            }}
          >
            <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
              La verdad que nadie te dice:
            </p>
            <p
              className="text-2xl sm:text-3xl"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              El Plan por Defecto no está roto.
              <br />
              <span style={{ color: 'var(--text-secondary)' }}>Está diseñado para mantenerte ahí.</span>
            </p>
            <p className="mt-6" style={{ color: 'var(--text-muted)' }}>
              Si mañana no pudieras trabajar, ¿cuántos meses sobrevivirías?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div
      className="flex gap-5 p-6 rounded-xl transition-all duration-300"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)'
      }}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          color: 'var(--gold-muted)'
        }}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
      </div>
    </div>
  );
}

// ============================================================================
// EPIPHANY SECTION - LA REVELACIÓN
// ============================================================================

function EpiphanySection() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--bg-deep)' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Story */}
          <div>
            <span
              className="text-sm font-medium uppercase tracking-widest"
              style={{ color: 'var(--gold-muted)' }}
            >
              La revelación
            </span>
            <h2
              className="text-3xl sm:text-4xl mt-6 mb-8"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              Seguiste las reglas.
              <br />
              <span style={{ color: 'var(--gold)' }}>El problema es que las reglas están obsoletas.</span>
            </h2>

            <div className="space-y-5 text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>
                Estudiaste. Conseguiste el trabajo. Trabajas duro.
              </p>
              <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                Hiciste todo lo que te dijeron que hicieras.
              </p>
              <p>
                Pero el mapa que te dieron fue diseñado en los años 50.
                Cuando había pensiones. Cuando un empleo duraba 40 años.
              </p>
              <p>
                Ese mundo ya no existe.
              </p>
              <p style={{ color: 'var(--gold)', fontWeight: 500 }}>
                El problema no eres tú. Es que te dieron herramientas obsoletas para un mundo que cambió.
              </p>
              <p>
                La buena noticia: existe otro camino. Y no requiere que dejes tu trabajo ni arriesgues todo.
              </p>
            </div>
          </div>

          {/* Right - Comparison - Quiet Luxury Style */}
          <div className="space-y-6">
            {/* El mapa obsoleto */}
            <div
              className="p-7 rounded-xl"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)'
              }}
            >
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(107, 107, 117, 0.1)' }}
                >
                  <svg className="w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium" style={{ color: 'var(--text-muted)' }}>El mapa de los años 50</h3>
              </div>
              <ul className="space-y-3" style={{ color: 'var(--text-muted)' }}>
                {[
                  'Trabajar más horas para ganar más',
                  'Ahorrar lo que sobra (nunca sobra)',
                  'Esperar el aumento o el ascenso',
                  'Jubilarte a los 65 si tienes suerte'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span>—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm" style={{ color: 'var(--text-muted)' }}>
                Si dejas de trabajar, dejas de ganar.
              </p>
            </div>

            {/* El nuevo camino */}
            <div
              className="p-7 rounded-xl"
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.2)'
              }}
            >
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                >
                  <svg className="w-5 h-5" style={{ color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium" style={{ color: 'var(--gold)' }}>El mapa actualizado</h3>
              </div>
              <ul className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
                {[
                  'Construir algo que genere mientras duermes',
                  'Usar tu tiempo libre, no renunciar',
                  'Ver progreso real cada mes',
                  'Elegir cuándo dejar de trabajar'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm font-medium" style={{ color: 'var(--gold-muted)' }}>
                Tú decides cuándo parar. No tu jefe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SOLUTION SECTION
// ============================================================================

function SolutionSection() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span
            className="text-sm font-medium uppercase tracking-widest"
            style={{ color: 'var(--gold-muted)' }}
          >
            La solución
          </span>
          <h2
            className="text-3xl sm:text-4xl mt-6 mb-6"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
          >
            Infraestructura para
            <br />
            <span style={{ color: 'var(--gold)' }}>construir tu libertad</span>
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            CreaTuActivo no es un curso. No es motivación.
            Es infraestructura tecnológica que hace fácil lo que antes era difícil.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
              </svg>
            }
            title="Dashboard Inteligente"
            description="Visualiza tus métricas y progreso en tiempo real. Sin Excel, sin confusión."
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            }
            title="NEXUS IA"
            description="Un asistente inteligente disponible 24/7 que responde preguntas y te ahorra horas."
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            }
            title="Metodología Clara"
            description="Pasos definidos que cualquiera puede seguir. Sin ambigüedades."
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            }
            title="Comunidad"
            description="Acceso a personas construyendo lo mismo que tú. No estás solo."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div
      className="p-6 rounded-xl transition-all duration-300 hover:translate-y-[-2px]"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)'
      }}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
        style={{
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          color: 'var(--gold)'
        }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </div>
  );
}

// ============================================================================
// HOW IT WORKS
// ============================================================================

function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24" style={{ backgroundColor: 'var(--bg-deep)' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span
            className="text-sm font-medium uppercase tracking-widest"
            style={{ color: 'var(--gold-muted)' }}
          >
            Cómo funciona
          </span>
          <h2
            className="text-3xl sm:text-4xl mt-6 mb-6"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
          >
            Tres pasos hacia tu libertad
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Sin misterios. Sin complejidad. Un sistema probado.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <StepCard
            number="01"
            title="Calcula tu situación"
            description="Usa la Calculadora de Libertad para entender exactamente dónde estás y cuánto te falta."
            highlight="2 minutos"
            href="/calculadora"
            cta="Calcular ahora"
          />
          <StepCard
            number="02"
            title="Aprende el sistema"
            description="Únete al Reto de 5 Días y descubre cómo construir un activo sin sacrificar tu carrera."
            highlight="5 días"
            href="/reto-5-dias"
            cta="Unirme al reto"
          />
          <StepCard
            number="03"
            title="Ejecuta con herramientas"
            description="Usa el Dashboard, NEXUS y la comunidad para construir tu activo de forma sistemática."
            highlight="Tu ritmo"
          />
        </div>
      </div>
    </section>
  );
}

function StepCard({ number, title, description, highlight, href, cta }: {
  number: string;
  title: string;
  description: string;
  highlight: string;
  href?: string;
  cta?: string;
}) {
  const content = (
    <>
      <div
        className="text-6xl font-bold absolute top-6 right-6"
        style={{ color: 'var(--border)', fontFamily: 'var(--font-display)' }}
      >
        {number}
      </div>
      <div className="relative">
        <div
          className="inline-block px-3 py-1.5 rounded-full mb-5 text-sm font-medium"
          style={{
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            color: 'var(--gold)'
          }}
        >
          {highlight}
        </div>
        <h3 className="text-xl font-medium mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
        {cta && (
          <div
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: 'var(--gold)' }}
          >
            {cta}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="relative p-8 rounded-2xl block transition-all duration-300 hover:scale-[1.02]"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)'
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className="relative p-8 rounded-2xl"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)'
      }}
    >
      {content}
    </div>
  );
}

// ============================================================================
// FOR WHO SECTION
// ============================================================================

function ForWhoSection() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Es para ti si... */}
          <div>
            <h2
              className="text-2xl mb-8"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              Esto es para ti si...
            </h2>
            <ul className="space-y-4">
              {[
                'Tienes un buen ingreso pero no construyes patrimonio',
                'Quieres un Plan B que no dependa de tu empleador',
                'Buscas algo serio, no "dinero fácil"',
                'Estás dispuesto a trabajar 1-2 horas diarias',
                'Valoras los sistemas sobre la motivación',
                'Prefieres herramientas sobre discursos',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                  >
                    <svg className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* No es para ti si... */}
          <div>
            <h2
              className="text-2xl mb-8"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              Esto no es para ti si...
            </h2>
            <ul className="space-y-4">
              {[
                'Buscas hacerte rico de la noche a la mañana',
                'No tienes tiempo para dedicar al menos 1 hora diaria',
                'Esperas que alguien haga el trabajo por ti',
                'No estás dispuesto a aprender algo nuevo',
                'Prefieres quejarte a tomar acción',
                'Crees que el éxito llega sin esfuerzo',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: 'rgba(107, 107, 117, 0.1)' }}
                  >
                    <svg className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SOCIAL PROOF SECTION
// ============================================================================

function SocialProofSection() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--bg-deep)' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span
            className="text-sm font-medium uppercase tracking-widest"
            style={{ color: 'var(--gold-muted)' }}
          >
            Historias reales
          </span>
          <h2
            className="text-3xl sm:text-4xl mt-6"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
          >
            Lo que dicen quienes ya construyen
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <TestimonialCard
            quote="Llevaba años escuchando sobre 'ingresos pasivos' pero todo era humo. Esto es diferente: hay un sistema real, herramientas reales, métricas reales."
            name="Carlos M."
            role="Ingeniero de Software"
          />
          <TestimonialCard
            quote="Lo que más me convenció fue que nadie me pidió hacer lista de amigos. Todo es con personas que genuinamente buscan esto."
            name="María L."
            role="Contadora"
          />
          <TestimonialCard
            quote="NEXUS es increíble. Responde las mismas preguntas que yo respondía 50 veces al día. Ahora uso mi tiempo en lo que importa."
            name="Andrés R."
            role="Empresario"
          />
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div
      className="p-7 rounded-xl"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)'
      }}
    >
      {/* Stars - más sutiles */}
      <div className="flex gap-1 mb-5">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className="w-4 h-4" style={{ color: 'var(--gold-muted)' }} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="mb-6 italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        &quot;{quote}&quot;
      </p>
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
          style={{
            backgroundColor: 'var(--gold)',
            color: 'var(--bg-deep)'
          }}
        >
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{name}</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{role}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FINAL CTA SECTION
// ============================================================================

function FinalCTASection() {
  const [email, setEmail] = useState('');

  return (
    <section id="calculadora" className="py-24" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div
          className="rounded-2xl p-10 sm:p-14 text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)'
          }}
        >
          {/* Badge - sutil */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 text-sm"
            style={{
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              color: 'var(--gold)'
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--gold)' }}
            />
            Enero 2025 — Solo 30 cupos
          </div>

          <h2
            className="text-3xl sm:text-4xl mb-5"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
          >
            ¿Cuántos años te faltan para
            <br />
            <span style={{ color: 'var(--gold)' }}>dejar de depender de tu trabajo?</span>
          </h2>

          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Descúbrelo en 2 minutos con la Calculadora de Libertad.
            Sin compromiso. Sin costo.
          </p>

          {/* Email capture form */}
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Tu email profesional"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-4 rounded-xl focus:outline-none transition-all duration-300"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
              <button
                className="px-7 py-4 rounded-xl font-semibold transition-all duration-300 hover:opacity-90"
                style={{
                  backgroundColor: 'var(--gold)',
                  color: 'var(--bg-deep)'
                }}
              >
                Calcular
              </button>
            </div>
            <p className="text-sm mt-5" style={{ color: 'var(--text-muted)' }}>
              Tu información está segura. Sin spam.
            </p>
          </div>

          {/* Guarantee */}
          <div
            className="mt-10 pt-10 flex flex-wrap items-center justify-center gap-8 text-sm"
            style={{
              borderTop: '1px solid var(--border)',
              color: 'var(--text-muted)'
            }}
          >
            {['Gratis', '2 minutos', 'Resultado inmediato'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg className="w-4 h-4" style={{ color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

function Footer() {
  return (
    <footer
      className="py-16"
      style={{
        backgroundColor: 'var(--bg-deep)',
        borderTop: '1px solid var(--border-subtle)'
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--gold)' }}
            >
              <span className="font-bold" style={{ color: 'var(--bg-deep)', fontFamily: 'var(--font-display)' }}>C</span>
            </div>
            <span className="text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              Crea<span style={{ color: 'var(--gold)' }}>Tu</span>Activo
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            <Link href="/privacidad" className="hover:opacity-80 transition-opacity">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:opacity-80 transition-opacity">
              Términos
            </Link>
            <span>© 2025 CreaTuActivo.com</span>
          </div>
        </div>

        {/* Disclaimer */}
        <p
          className="text-xs text-center mt-12 max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
        >
          CreaTuActivo es una plataforma de infraestructura tecnológica. Los resultados individuales
          pueden variar y dependen del esfuerzo, dedicación y circunstancias de cada persona.
          Esto no es un esquema de dinero fácil ni garantizamos ingresos específicos.
        </p>
      </div>
    </footer>
  );
}
