/**
 * Copyright © 2026 CreaTuActivo.com
 * Homepage v8.0 - ELEGANCIA CINÉTICA
 * "Ingeniería de Lujo" - Industrial + Quiet Luxury
 *
 * Typography: Serif (Promesa) + Industrial (Máquina) + Mono (Evidencia)
 * Palette: 60% Obsidian, 30% Steel, 5% Cyan, 5% Gold
 */

import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';
import { ELEGANCIA_CINETICA as EC } from '@/lib/branding';

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
        style={{ backgroundColor: EC.bg.obsidian, color: EC.text.main }}
      >
        {/* Noise overlay - Film grain texture */}
        <div className="noise-overlay" />

        {/* Background mesh gradient - dual tone (gold bottom-left + cyan top-right) */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 80%, rgba(229, 194, 121, 0.04) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(56, 189, 248, 0.03) 0%, transparent 50%)
            `,
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
// HERO SECTION
// ============================================================================

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 pt-32 pb-16">
      <div className="relative max-w-3xl mx-auto text-center">
        {/* Badge - Industrial label */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
          style={{
            backgroundColor: EC.bg.gunmetal,
            border: `1px solid ${EC.border.glass}`
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: EC.accent.amber }}
          />
          <span className="text-sm font-industrial uppercase tracking-widest" style={{ color: EC.text.muted }}>
            Estrategia de Soberanía Financiera
          </span>
        </div>

        {/* Main Headline - Serif "La Promesa" */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6 font-serif">
          <span style={{ color: EC.text.main }}>¿Es Tu Plan Financiero un Puente hacia la</span>
          <br />
          <span style={{ color: EC.gold.champagne }}>Soberanía</span>
          <span style={{ color: EC.text.main }}> o una Trampa de Dependencia?</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg sm:text-xl mb-6 max-w-2xl mx-auto leading-relaxed"
          style={{ color: EC.text.muted }}
        >
          Deja de ser el motor de tu economía.{' '}
          <span className="font-medium" style={{ color: EC.text.main }}>
            Construye el chasis que te permita detenerte sin que todo colapse.
          </span>
        </p>

        {/* Byline - Mono "La Evidencia" */}
        <p className="text-sm mb-10 font-mono" style={{ color: EC.text.muted }}>
          Diseñado por Luis Cabrejo · <span style={{ color: EC.gold.champagne }}>Arquitecto de Activos</span>
        </p>

        {/* CTA Principal - Haptic Amber */}
        <Link
          href="/calculadora"
          className="btn-haptic text-lg px-10 py-5 rounded-xl font-industrial"
        >
          Iniciar Auditoría de Soberanía
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>

        {/* Trust indicators - Steel structure */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm" style={{ color: EC.text.muted }}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: EC.steel }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span>Presencia en 70+ Países</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: EC.steel }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>Infraestructura Corporativa Propia</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: EC.steel }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <span>Operación 100% Digital</span>
          </div>
        </div>

        {/* Secondary CTA */}
        <p className="mt-8 text-sm" style={{ color: EC.text.muted }}>
          ¿Ya hiciste la auditoría?{' '}
          <Link
            href="/reto-5-dias"
            className="hover:underline transition-colors"
            style={{ color: EC.gold.champagne }}
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
    <section className="px-6 py-20" style={{ backgroundColor: EC.bg.gunmetal }}>
      <div className="max-w-4xl mx-auto">
        {/* Section header - Industrial label */}
        <div className="text-center mb-12">
          <span
            className="text-sm font-industrial font-bold uppercase tracking-widest"
            style={{ color: EC.accent.amber }}
          >
            El Problema
          </span>
          <h2
            className="text-2xl sm:text-3xl mt-4 font-serif"
            style={{ color: EC.text.primary }}
          >
            La Trampa del Plan por Defecto
          </h2>
        </div>

        {/* The trap visualization - Bento Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            { num: '01', title: 'Trabajar', desc: '40+ horas semanales' },
            { num: '02', title: 'Pagar Cuentas', desc: 'El dinero entra y sale' },
            { num: '03', title: 'Repetir', desc: 'Hasta... ¿cuándo?' },
          ].map((item) => (
            <div
              key={item.num}
              className="p-6 rounded-xl text-center transition-all duration-300 hover:translate-y-[-4px] group"
              style={{
                backgroundColor: EC.bg.obsidian,
                border: `1px solid ${EC.border.gold}`
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)' }}
              >
                <span
                  className="text-lg font-mono font-bold"
                  style={{ color: EC.accent.cyan }}
                >
                  {item.num}
                </span>
              </div>
              <h3 className="font-semibold font-industrial text-lg mb-2" style={{ color: EC.text.primary }}>
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: EC.text.muted }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* The insight - Editorial quote */}
        <div
          className="p-8 rounded-xl text-center"
          style={{
            backgroundColor: EC.bg.obsidian,
            borderLeft: `3px solid ${EC.gold.champagne}`,
            background: `linear-gradient(90deg, rgba(229,194,121,0.05) 0%, ${EC.bg.obsidian} 100%)`,
          }}
        >
          <p className="text-lg leading-relaxed">
            <span style={{ color: EC.text.muted }}>El problema no es que trabajes duro.</span>
            <br />
            <span style={{ color: EC.text.main }}>El problema es que </span>
            <span className="font-semibold" style={{ color: EC.gold.champagne }}>
              el activo eres TÚ
            </span>
            <span style={{ color: EC.text.main }}>.</span>
          </p>
          <p className="text-sm mt-4 font-mono" style={{ color: EC.text.muted }}>
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
    <section className="px-6 py-20" style={{ backgroundColor: EC.bg.obsidian }}>
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="text-2xl sm:text-3xl font-serif mb-6"
          style={{ color: EC.text.primary }}
        >
          ¿Cuántos días sobrevivirías sin trabajar?
        </h2>

        <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: EC.text.muted }}>
          La fórmula es simple:
        </p>

        <div
          className="p-6 rounded-xl mb-10 inline-block"
          style={{
            backgroundColor: EC.bg.gunmetal,
            border: `1px solid ${EC.border.gold}`
          }}
        >
          <p
            className="font-mono text-lg"
            style={{ color: EC.accent.cyan }}
          >
            Ahorros ÷ Gastos Mensuales = Días de Libertad
          </p>
        </div>

        <p className="mb-10" style={{ color: EC.text.muted }}>
          La mayoría descubre que tiene{' '}
          <span className="font-mono font-medium" style={{ color: EC.accent.cyan }}>
            menos de 30 días
          </span>
          . Algunos, cero.
        </p>

        <Link
          href="/calculadora"
          className="btn-haptic-outline text-lg px-8 py-4 rounded-xl font-industrial"
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
    <section className="px-6 py-20" style={{ backgroundColor: EC.bg.gunmetal }}>
      <div className="max-w-3xl mx-auto text-center">
        <p
          className="text-sm font-industrial font-bold uppercase tracking-widest mb-4"
          style={{ color: EC.accent.amber }}
        >
          El Siguiente Paso
        </p>

        <h2
          className="text-2xl sm:text-3xl font-serif mb-6"
          style={{ color: EC.text.primary }}
        >
          5 Días para Diseñar tu Salida del Sistema Tradicional
        </h2>

        <p className="mb-10 max-w-xl mx-auto" style={{ color: EC.text.muted }}>
          Después del diagnóstico, únete al Reto de 5 Días. Descubre si este modelo es para ti. Sin compromiso.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/calculadora"
            className="btn-haptic text-lg px-8 py-4 rounded-xl font-industrial"
          >
            Hacer el Diagnóstico Primero
          </Link>

          <Link
            href="/reto-5-dias"
            className="btn-haptic-outline text-lg px-8 py-4 rounded-xl font-industrial"
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
      style={{ borderTop: `1px solid rgba(148, 163, 184, 0.15)` }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="font-medium font-industrial tracking-wide" style={{ color: EC.gold.champagne }}>
            CreaTuActivo
          </p>
          <p className="text-xs font-mono" style={{ color: EC.text.muted }}>
            Sistema de Arquitectura de Activos
          </p>
        </div>

        <div className="flex gap-8 text-sm" style={{ color: EC.text.muted }}>
          <Link href="/blog" className="hover:opacity-80 transition-opacity">
            Blog
          </Link>
          <Link href="/privacidad" className="hover:opacity-80 transition-opacity">
            Privacidad
          </Link>
        </div>

        <p className="text-xs font-mono" style={{ color: EC.text.subtle }}>
          © 2026 CreaTuActivo.com
        </p>
      </div>
    </footer>
  );
}
