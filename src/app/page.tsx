/**
 * Copyright © 2026 CreaTuActivo.com
 * Homepage v10.0 - INDUSTRIAL LUXURY (Layer Management)
 * Capa 0: Hormigón global en <main> (fijo, siempre visible)
 * Capa 1: Turbina SOLO en hero con mask-image fade hacia abajo
 * Secciones intermedias: transparentes → hormigón visible a través de glass cards
 */

import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';

export const metadata = {
  title: 'CreaTuActivo - ¿Sigues Operando Bajo el Plan por Defecto?',
  description: 'Descubre cuántos días de libertad real tienes antes de que se acabe el dinero. Calculadora gratuita de Días de Libertad.',
};

const C = {
  cyan: '#00e5ff',
  gold: '#E5C279',
  textMain: '#e0e0e0',
  textMuted: '#9e9e9e',
};

// ============================================================================
// MAIN — Capa 0: Hormigón como fondo permanente
// ============================================================================

export default function HomePage() {
  return (
    <>
      <StrategicNavigation />
      <main style={{
        position: 'relative',
        color: C.textMain,
        // Capa 0: dark tint (60%) + hormigón debajo (40% visible)
        backgroundImage: `
          linear-gradient(rgba(12,12,12,0.60), rgba(12,12,12,0.60)),
          url('/images/servilleta/fondo-global-hormigon.jpg?v=20260208')
        `,
        backgroundSize: 'cover, 600px 600px',
        backgroundRepeat: 'no-repeat, repeat',
        backgroundAttachment: 'scroll, scroll',
      }}>
        <HeroSection />
        <ProblemSection />
        <SolutionPreview />
        <FinalCTASection />
        <Footer />
      </main>
    </>
  );
}

// ============================================================================
// HERO — Capa 1: Turbina con mask-image fade hacia el hormigón
// ============================================================================

function HeroSection() {
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
      {/* Turbina con fade suave hacia abajo → revela hormigón */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: "url('/images/servilleta/turbina.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'grayscale(80%) contrast(120%) brightness(50%)',
        opacity: 0.55,
        WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        {/* Label industrial */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.1)',
          padding: '6px 16px', marginBottom: '32px',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.cyan, display: 'inline-block' }} />
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Roboto Mono', monospace" }}>
            Estrategia de Soberanía Financiera
          </span>
        </div>

        {/* h1 — legible sin panel, texto grande */}
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
          lineHeight: 1.15,
          marginBottom: '24px',
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 600,
          color: '#ffffff',
          textShadow: '0 2px 12px rgba(0,0,0,0.9)',
        }}>
          ¿Es Tu Plan Financiero un Puente hacia la{' '}
          <span style={{ color: C.gold }}>Soberanía</span>{' '}
          o una Trampa de Dependencia?
        </h1>

        {/* contrast-plate — igual que /servilleta, solo para textos pequeños */}
        <div style={{
          background: 'rgba(0,0,0,0.70)',
          padding: '20px 28px',
          marginBottom: '32px',
          borderLeft: `2px solid rgba(229,194,121,0.3)`,
        }}>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: C.textMuted, maxWidth: '600px', margin: '0 auto 12px' }}>
            Deja de ser el motor de tu economía.{' '}
            <span style={{ color: C.textMain, fontWeight: 500 }}>Construye el chasis que te permita detenerte sin que todo colapse.</span>
          </p>
          <p style={{ fontSize: '0.85rem', margin: 0, fontFamily: "'Roboto Mono', monospace", color: C.textMuted }}>
            Diseñado por Luis Cabrejo · <span style={{ color: C.gold }}>Arquitecto de Activos</span>
          </p>
        </div>

        {/* Botón primario — Geometría Industrial (clip-path) */}
        <Link
          href="/calculadora"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: `linear-gradient(135deg, ${C.gold}, #D4A017)`,
            color: '#000', fontWeight: 700, fontSize: '1rem',
            padding: '16px 40px',
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.1em',
            textDecoration: 'none', textTransform: 'uppercase',
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
            transition: 'all 0.2s ease',
          }}
        >
          Iniciar Auditoría de Soberanía →
        </Link>

        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px', marginTop: '40px',
          fontSize: '0.8rem', color: C.textMuted,
          textShadow: '0 1px 8px rgba(0,0,0,1)',
        }}>
          <span>⬡ Presencia en 70+ Países</span>
          <span>⬡ Infraestructura Corporativa Propia</span>
          <span>⬡ Operación 100% Digital</span>
        </div>

        <p style={{ marginTop: '20px', fontSize: '0.85rem', color: C.textMuted, textShadow: '0 1px 8px rgba(0,0,0,1)' }}>
          ¿Ya hiciste la auditoría?{' '}
          <Link href="/reto-5-dias" style={{ color: C.gold, textDecoration: 'none' }}>
            Ir al Reto de 5 Días →
          </Link>
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// PROBLEM — Sección transparente, hormigón visible, glass cards
// ============================================================================

function ProblemSection() {
  const steps = [
    { num: '01', title: 'Trabajar', desc: '40+ horas semanales' },
    { num: '02', title: 'Pagar Cuentas', desc: 'El dinero entra y sale' },
    { num: '03', title: 'Repetir', desc: 'Hasta... ¿cuándo?' },
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            El Problema
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "'Playfair Display', Georgia, serif", color: '#fff' }}>
            La Trampa del Plan por Defecto
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {steps.map((item) => (
            <div key={item.num} style={{
              padding: '24px', borderRadius: '12px', textAlign: 'center',
              background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(0,229,255,0.15)',
              backdropFilter: 'blur(4px)',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,229,255,0.1)',
              }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", color: C.cyan, fontWeight: 700 }}>{item.num}</span>
              </div>
              <h3 style={{ color: '#fff', marginBottom: '8px', fontFamily: "'Rajdhani', sans-serif", fontSize: '1.1rem', letterSpacing: '0.05em' }}>{item.title}</h3>
              <p style={{ color: C.textMuted, fontSize: '0.85rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          padding: '32px', borderRadius: '12px', textAlign: 'center',
          background: 'rgba(0,0,0,0.65)', borderLeft: `3px solid ${C.gold}`,
          backdropFilter: 'blur(4px)',
        }}>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
            <span style={{ color: C.textMuted }}>El problema no es que trabajes duro.</span>
            <br />
            <span style={{ color: '#fff' }}>El problema es que </span>
            <span style={{ color: C.gold, fontWeight: 600 }}>el activo eres TÚ</span>
            <span style={{ color: '#fff' }}>.</span>
          </p>
          <p style={{ fontSize: '0.85rem', marginTop: '16px', fontFamily: "'Roboto Mono', monospace", color: C.textMuted }}>
            Si tú te detienes, el sistema colapsa.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SOLUTION — Sección transparente, glass card central
// ============================================================================

function SolutionPreview() {
  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontFamily: "'Playfair Display', Georgia, serif", color: '#fff', marginBottom: '24px' }}>
          ¿Cuántos días sobrevivirías sin trabajar?
        </h2>

        <p style={{ fontSize: '1.05rem', color: C.textMuted, marginBottom: '32px' }}>
          La fórmula es simple:
        </p>

        <div style={{
          display: 'inline-block', padding: '24px 40px', borderRadius: '12px',
          background: 'rgba(0,0,0,0.65)', border: `1px solid ${C.gold}30`,
          backdropFilter: 'blur(4px)', marginBottom: '32px',
        }}>
          <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '1.1rem', color: C.cyan }}>
            Ahorros ÷ Gastos Mensuales = Días de Libertad
          </p>
        </div>

        <p style={{ color: C.textMuted, marginBottom: '40px' }}>
          La mayoría descubre que tiene{' '}
          <span style={{ fontFamily: "'Roboto Mono', monospace", color: C.cyan, fontWeight: 500 }}>menos de 30 días</span>
          . Algunos, cero.
        </p>

        <Link
          href="/calculadora"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'transparent', border: `1px solid ${C.gold}`,
            color: C.gold, fontWeight: 600, fontSize: '1rem',
            padding: '14px 32px',
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.1em',
            textDecoration: 'none', textTransform: 'uppercase',
            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          }}
        >
          Calcular Mis Días de Libertad →
        </Link>
      </div>
    </section>
  );
}

// ============================================================================
// CTA — Sección transparente, glass cards dobles
// ============================================================================

function FinalCTASection() {
  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan, marginBottom: '16px' }}>
          El Siguiente Paso
        </p>

        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontFamily: "'Playfair Display', Georgia, serif", color: '#fff', marginBottom: '24px' }}>
          5 Días para Diseñar tu Salida del Sistema Tradicional
        </h2>

        <p style={{ color: C.textMuted, maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          Después del diagnóstico, únete al Reto de 5 Días. Descubre si este modelo es para ti. Sin compromiso.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          <Link
            href="/calculadora"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: `linear-gradient(135deg, ${C.gold}, #D4A017)`,
              color: '#000', fontWeight: 700, fontSize: '1rem',
              padding: '14px 32px',
              fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.1em',
              textDecoration: 'none', textTransform: 'uppercase',
              clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
            }}
          >
            Hacer el Diagnóstico Primero
          </Link>
          <Link
            href="/reto-5-dias"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'transparent', border: `1px solid ${C.gold}`,
              color: C.gold, fontWeight: 600, fontSize: '1rem',
              padding: '14px 32px',
              fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.1em',
              textDecoration: 'none', textTransform: 'uppercase',
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
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
// FOOTER
// ============================================================================

function Footer() {
  return (
    <footer style={{
      padding: '40px 24px',
      borderTop: '1px solid rgba(148, 163, 184, 0.12)',
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
        <div>
          <p style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.1em', color: C.gold, fontWeight: 600 }}>CreaTuActivo</p>
          <p style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", color: C.textMuted }}>Sistema de Arquitectura de Activos</p>
        </div>
        <div style={{ display: 'flex', gap: '32px', fontSize: '0.85rem' }}>
          <Link href="/blog" style={{ color: C.textMuted, textDecoration: 'none' }}>Blog</Link>
          <Link href="/privacidad" style={{ color: C.textMuted, textDecoration: 'none' }}>Privacidad</Link>
          <Link href="/tecnologia" style={{ color: C.textMuted, textDecoration: 'none' }}>Tecnología</Link>
        </div>
        <p style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", color: C.textMuted }}>
          © 2026 CreaTuActivo.com
        </p>
      </div>
    </footer>
  );
}
