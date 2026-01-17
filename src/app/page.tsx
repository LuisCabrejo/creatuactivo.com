/**
 * Copyright © 2025 CreaTuActivo.com
 * Homepage v7.0 - THE ARCHITECT'S SUITE
 * Squeeze Page Híbrida (Protocolo Funnel v4)
 * Enfoque: Diagnóstico → Calculadora → Reto
 */

import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';

// ============================================================================
// THE ARCHITECT'S SUITE - COLOR PALETTE
// ============================================================================

const COLORS = {
  bg: { main: '#0F1115', card: '#1A1D23' },
  gold: { primary: '#C5A059', hover: '#D4AF37', bronze: '#B38B59' },
  text: { primary: '#FFFFFF', main: '#E5E5E5', muted: '#A3A3A3' },
  border: { subtle: 'rgba(197, 160, 89, 0.2)', card: 'rgba(197, 160, 89, 0.1)' },
};

// ============================================================================
// METADATA
// ============================================================================

export const metadata = {
  title: 'CreaTuActivo - ¿Sigues Operando Bajo el Plan por Defecto?',
  description: 'Descubre cuántos días de libertad real tienes antes de que se acabe el dinero. Calculadora gratuita de Días de Libertad.',
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function HomePage() {
  return (
    <>
      <StrategicNavigation />
      <main
        className="min-h-screen relative"
        style={{ backgroundColor: COLORS.bg.main, color: COLORS.text.main }}
      >
        {/* Background gradient - subtle gold glow */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(197, 160, 89, 0.04) 0%, transparent 60%)',
          }}
        />

        {/* Content wrapper */}
        <div className="relative z-10">
          <HeroSection />
          <ProblemSection />
          <SolutionPreview />
          <FinalCTASection />
          <Footer />
        </div>
      </main>
    </>
  );
}

// ============================================================================
// HERO SECTION - Squeeze Page Style
// ============================================================================

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 pt-32 pb-16">
      <div className="relative max-w-3xl mx-auto text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
          style={{
            backgroundColor: COLORS.bg.card,
            border: `1px solid ${COLORS.border.card}`
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: COLORS.gold.primary }}
          />
          <span className="text-sm" style={{ color: COLORS.text.muted }}>
            Estrategia de Soberanía Financiera
          </span>
        </div>

        {/* Main Headline - Soberanía */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6 font-serif">
          <span style={{ color: COLORS.text.main }}>¿Es Tu Plan Financiero un Puente hacia la</span>
          <br />
          <span style={{ color: COLORS.gold.primary }}>Soberanía</span>
          <span style={{ color: COLORS.text.main }}> o una Trampa de Dependencia?</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg sm:text-xl mb-6 max-w-2xl mx-auto leading-relaxed"
          style={{ color: COLORS.text.muted }}
        >
          Deja de ser el motor de tu economía.{' '}
          <span className="font-medium" style={{ color: COLORS.text.main }}>
            Construye el chasis que te permita detenerte sin que todo colapse.
          </span>
        </p>

        {/* Byline */}
        <p className="text-sm mb-10" style={{ color: COLORS.text.muted }}>
          Diseñado por Luis Cabrejo · <span style={{ color: COLORS.gold.bronze }}>Arquitecto de Activos</span>
        </p>

        {/* CTA Principal - Auditoría */}
        <Link
          href="/calculadora"
          className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-10 py-5 rounded-xl transition-all duration-300 hover:translate-y-[-2px] uppercase tracking-wide"
          style={{
            backgroundColor: COLORS.gold.primary,
            color: COLORS.bg.main,
            boxShadow: '0 0 20px rgba(197, 160, 89, 0.2)',
          }}
        >
          Iniciar Auditoría de Soberanía
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>

        {/* Trust indicators - Solidez Institucional */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm" style={{ color: COLORS.text.muted }}>
          <div className="flex items-center gap-2">
            {/* Globe icon */}
            <svg className="w-4 h-4" style={{ color: COLORS.gold.bronze }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span>Presencia en 70+ Países</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Shield icon */}
            <svg className="w-4 h-4" style={{ color: COLORS.gold.bronze }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>Infraestructura Corporativa Propia</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Bolt/Zap icon */}
            <svg className="w-4 h-4" style={{ color: COLORS.gold.bronze }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <span>Operación 100% Digital</span>
          </div>
        </div>

        {/* Secondary CTA */}
        <p className="mt-8 text-sm" style={{ color: COLORS.text.muted }}>
          ¿Ya hiciste la auditoría?{' '}
          <Link
            href="/reto-5-dias"
            className="hover:underline transition-colors"
            style={{ color: COLORS.gold.primary }}
          >
            Ir al Reto de 5 Días →
          </Link>
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// PROBLEM SECTION (EL VILLANO)
// ============================================================================

function ProblemSection() {
  return (
    <section className="px-6 py-20" style={{ backgroundColor: COLORS.bg.card }}>
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <span
            className="text-sm font-medium uppercase tracking-widest"
            style={{ color: COLORS.gold.primary }}
          >
            El Problema
          </span>
          <h2
            className="text-2xl sm:text-3xl mt-4 font-serif"
            style={{ color: COLORS.text.primary }}
          >
            La Trampa del Plan por Defecto
          </h2>
        </div>

        {/* The trap visualization */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            { num: '1', title: 'Trabajar', desc: '40+ horas semanales' },
            { num: '2', title: 'Pagar Cuentas', desc: 'El dinero entra y sale' },
            { num: '3', title: 'Repetir', desc: 'Hasta... ¿cuándo?' },
          ].map((item) => (
            <div
              key={item.num}
              className="p-6 rounded-xl text-center transition-all duration-300 hover:translate-y-[-4px]"
              style={{
                backgroundColor: COLORS.bg.main,
                border: `1px solid ${COLORS.border.card}`
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(197, 160, 89, 0.1)' }}
              >
                <span
                  className="text-xl font-bold"
                  style={{ color: COLORS.gold.primary }}
                >
                  {item.num}
                </span>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: COLORS.text.primary }}>
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: COLORS.text.muted }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* The insight - Editorial quote style */}
        <div
          className="p-8 rounded-xl text-center"
          style={{
            backgroundColor: COLORS.bg.main,
            borderLeft: `3px solid ${COLORS.gold.primary}`,
            background: `linear-gradient(90deg, rgba(197,160,89,0.05) 0%, ${COLORS.bg.main} 100%)`,
          }}
        >
          <p className="text-lg leading-relaxed">
            <span style={{ color: COLORS.text.muted }}>El problema no es que trabajes duro.</span>
            <br />
            <span style={{ color: COLORS.text.main }}>El problema es que </span>
            <span className="font-semibold" style={{ color: COLORS.gold.primary }}>
              el activo eres TÚ
            </span>
            <span style={{ color: COLORS.text.main }}>.</span>
          </p>
          <p className="text-sm mt-4" style={{ color: COLORS.text.muted }}>
            Si tú te detienes, el sistema colapsa.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SOLUTION PREVIEW
// ============================================================================

function SolutionPreview() {
  return (
    <section className="px-6 py-20" style={{ backgroundColor: COLORS.bg.main }}>
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="text-2xl sm:text-3xl font-serif mb-6"
          style={{ color: COLORS.text.primary }}
        >
          ¿Cuántos días sobrevivirías sin trabajar?
        </h2>

        <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: COLORS.text.muted }}>
          La fórmula es simple:
        </p>

        <div
          className="p-6 rounded-xl mb-10 inline-block"
          style={{
            backgroundColor: COLORS.bg.card,
            border: `1px solid ${COLORS.border.subtle}`
          }}
        >
          <p
            className="font-mono text-lg"
            style={{ color: COLORS.gold.primary }}
          >
            Ahorros ÷ Gastos Mensuales = Días de Libertad
          </p>
        </div>

        <p className="mb-10" style={{ color: COLORS.text.muted }}>
          La mayoría descubre que tiene{' '}
          <span className="font-medium" style={{ color: COLORS.text.main }}>
            menos de 30 días
          </span>
          . Algunos, cero.
        </p>

        <Link
          href="/calculadora"
          className="btn-gold-outline inline-flex items-center justify-center gap-3 font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:translate-y-[-2px]"
        >
          Calcular Mis Días de Libertad
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

// ============================================================================
// FINAL CTA SECTION
// ============================================================================

function FinalCTASection() {
  return (
    <section className="px-6 py-20" style={{ backgroundColor: COLORS.bg.card }}>
      <div className="max-w-3xl mx-auto text-center">
        <p
          className="text-sm uppercase tracking-widest mb-4"
          style={{ color: COLORS.gold.primary }}
        >
          El Siguiente Paso
        </p>

        <h2
          className="text-2xl sm:text-3xl font-serif mb-6"
          style={{ color: COLORS.text.primary }}
        >
          5 Días para Diseñar tu Salida del Sistema Tradicional
        </h2>

        <p className="mb-10 max-w-xl mx-auto" style={{ color: COLORS.text.muted }}>
          Después del diagnóstico, únete al Reto de 5 Días. Descubre si este modelo es para ti. Sin compromiso.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/calculadora"
            className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:translate-y-[-2px] uppercase tracking-wide"
            style={{
              backgroundColor: COLORS.gold.primary,
              color: COLORS.bg.main,
              boxShadow: '0 0 15px rgba(197, 160, 89, 0.2)',
            }}
          >
            Hacer el Diagnóstico Primero
          </Link>

          <Link
            href="/reto-5-dias"
            className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300"
            style={{
              border: `1px solid ${COLORS.border.subtle}`,
              color: COLORS.text.muted,
            }}
          >
            Ya lo hice, ir al Reto
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER MINIMALISTA
// ============================================================================

function Footer() {
  return (
    <footer
      className="px-6 py-10"
      style={{ borderTop: `1px solid ${COLORS.border.card}` }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="font-medium" style={{ color: COLORS.gold.primary }}>
            CreaTuActivo
          </p>
          <p className="text-xs" style={{ color: COLORS.text.muted }}>
            Sistema de Arquitectura de Activos
          </p>
        </div>

        <div className="flex gap-8 text-sm" style={{ color: COLORS.text.muted }}>
          <Link href="/blog" className="hover:opacity-80 transition-opacity">
            Blog
          </Link>
          <Link href="/privacidad" className="hover:opacity-80 transition-opacity">
            Privacidad
          </Link>
        </div>

        <p className="text-xs" style={{ color: COLORS.text.muted }}>
          © 2025 CreaTuActivo.com
        </p>
      </div>
    </footer>
  );
}
