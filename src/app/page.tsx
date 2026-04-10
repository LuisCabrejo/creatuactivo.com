/**
 * Copyright © 2026 CreaTuActivo.com
 * Homepage v11.0 — StoryBrand 4-Step (Dunford + Miller)
 * Brief Maestro Abril 2026: Hero + Problema + Perfiles + Soluciones Fallidas
 *                           + Días de Libertad + Queswa + CTA Final
 */

import Link from 'next/link';
import Image from 'next/image';
import StrategicNavigation from '@/components/StrategicNavigation';

export const dynamic = 'force-static';

export const metadata = {
  title: 'CreaTuActivo — El Plan por Defecto no te va a fallar de golpe',
  description: 'Construye tu primer activo paralelo sin dejar lo que tienes. Para microempresarios, empleados públicos y pensionados que quieren más que el plan por defecto.',
};

const C = {
  gold: '#C8A84B',
  cyan: '#22D3EE',
  white: '#F5F5F0',
  muted: '#6B6B5A',
  bg: '#080808',
  bgCard: '#0d0d0d',
  bgCardBorder: '#1a1a1a',
  danger: '#ef4444',
  success: '#22c55e',
};

export default function HomePage() {
  return (
    <>
      <StrategicNavigation />
      <main style={{ position: 'relative', color: C.white, backgroundColor: C.bg }}>
        <HeroSection />
        <ProblemSection />
        <PerfilesSection />
        <SolucionesFallidasSection />
        <SolutionPreview />
        <QueswaDiferenciadorSection />
        <FinalCTASection />
        <Footer />
      </main>
    </>
  );
}

// ============================================================================
// HERO
// ============================================================================

function HeroSection() {
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
      {/* Fondo CSS puro */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 60% 40%, rgba(34,211,238,0.04) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(200,168,75,0.04) 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      {/* Turbina lazy */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        filter: 'grayscale(70%) contrast(1.1) brightness(0.55)',
        opacity: 0.75,
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        pointerEvents: 'none',
      }}>
        <Image src="/images/turbina.webp" alt="" fill loading="lazy"
          style={{ objectFit: 'cover', objectPosition: 'center' }} sizes="100vw" />
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.1)',
          padding: '6px 16px', marginBottom: '32px',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.cyan, display: 'inline-block' }} />
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, fontFamily: "'Roboto Mono', monospace" }}>
            Estrategia de Patrimonio Paralelo
          </span>
        </div>

        {/* H1 */}
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', lineHeight: 1.15,
          marginBottom: '24px',
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 600, color: '#ffffff',
          textShadow: '0 2px 12px rgba(0,0,0,0.9)',
        }}>
          El Plan por Defecto no te va a fallar de golpe.{' '}
          <span style={{ color: C.gold }}>Te va a fallar poco a poco.</span>
        </h1>

        {/* Subtítulo */}
        <div style={{
          background: 'rgba(0,0,0,0.70)', padding: '20px 28px', marginBottom: '32px',
          borderLeft: `2px solid rgba(200,168,75,0.3)`,
        }}>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: C.muted, maxWidth: '600px', margin: '0 auto 12px' }}>
            Años de trabajo, esfuerzo, cuentas pagadas. Y si tú paras, el ingreso para.{' '}
            <span style={{ color: C.white, fontWeight: 500 }}>Eso no es un plan — es una trampa. Existe una salida. Sin dejar lo que tienes.</span>
          </p>
          <p style={{ fontSize: '0.85rem', margin: 0, fontFamily: "'Roboto Mono', monospace", color: C.muted }}>
            Diseñado por Luis Cabrejo · <span style={{ color: C.gold }}>Arquitecto de Activos</span>
          </p>
        </div>

        {/* CTA primario */}
        <Link href="/mapa-de-salida" style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          background: `linear-gradient(135deg, ${C.gold}, #B8941F)`,
          color: '#000', fontWeight: 700, fontSize: '1rem',
          padding: '16px 40px',
          fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.1em',
          textDecoration: 'none', textTransform: 'uppercase',
          clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
          transition: 'all 0.2s ease',
        }}>
          Quiero mi Mapa de Salida →
        </Link>

        {/* Anchors */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px', marginTop: '40px',
          fontSize: '0.8rem', color: C.muted, textShadow: '0 1px 8px rgba(0,0,0,1)',
        }}>
          <span>○ Sin renunciar a tu trabajo</span>
          <span>○ Sin cerrar tu negocio</span>
          <span>○ Sin tocar tu pensión</span>
        </div>

        {/* Link secundario */}
        <p style={{ marginTop: '20px', fontSize: '0.85rem', color: C.muted, textShadow: '0 1px 8px rgba(0,0,0,1)' }}>
          ¿Ya tienes el mapa?{' '}
          <Link href="https://queswa.app" style={{ color: C.gold, textDecoration: 'none' }}>
            Acceder a Queswa →
          </Link>
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// PROBLEMA — "La Trampa del Plan por Defecto"
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
              padding: '24px', textAlign: 'center',
              background: 'rgba(0,0,0,0.65)', border: `1px solid rgba(34,211,238,0.15)`,
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}>
              <div style={{
                width: 48, height: 48, margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${C.cyan}`,
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", color: C.cyan, fontWeight: 700 }}>{item.num}</span>
              </div>
              <h3 style={{ color: '#fff', marginBottom: '8px', fontFamily: "'Rajdhani', sans-serif", fontSize: '1.1rem', letterSpacing: '0.05em' }}>{item.title}</h3>
              <p style={{ color: C.muted, fontSize: '0.85rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          padding: '32px', textAlign: 'center',
          background: 'rgba(0,0,0,0.65)', borderLeft: `3px solid ${C.gold}`,
          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          marginBottom: '32px',
        }}>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
            <span style={{ color: C.muted }}>El problema no es que trabajes duro.</span>
            <br />
            <span style={{ color: '#fff' }}>El problema es que </span>
            <span style={{ color: C.gold, fontWeight: 600 }}>el activo eres TÚ</span>
            <span style={{ color: '#fff' }}>.</span>
          </p>
          <p style={{ fontSize: '0.85rem', marginTop: '16px', fontFamily: "'Roboto Mono', monospace", color: C.muted }}>
            Si tú te detienes, el sistema colapsa.
          </p>
        </div>

        {/* Línea puente */}
        <p style={{ textAlign: 'center', fontSize: '1rem', color: C.muted, fontStyle: 'italic' }}>
          Y lo que intentaste antes tampoco lo resolvió.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// PERFILES — "¿Te reconoces aquí?"
// ============================================================================

function PerfilesSection() {
  const perfiles = [
    {
      label: 'Microempresario · 1–5 empleados',
      dolor: '"Si cierro el negocio una semana, pierdo la semana. Trabajo para el negocio — no al revés."',
      exito: 'Ingresos que llegan aunque el local esté cerrado. Un activo que crece mientras operas.',
    },
    {
      label: 'Empleado Público · Alcaldía · Gobernación',
      dolor: '"Tengo estabilidad. Pero el sueldo no crece. En 10 años ganaré lo mismo — y todo costará el doble."',
      exito: 'Una segunda fuente en paralelo, sin arriesgar el puesto fijo.',
    },
    {
      label: 'Pensionado · Después de 30 años',
      dolor: '"La pensión llegó. Alcanza para lo básico. No era lo que esperaba después de tanto tiempo trabajando."',
      exito: 'Un activo que genera en paralelo. Algo que los hijos puedan heredar.',
    },
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 24px', background: 'rgba(13,13,13,0.8)' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            ¿Te reconoces aquí?
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "'Playfair Display', Georgia, serif", color: '#fff' }}>
            El Plan por Defecto tiene muchas caras.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {perfiles.map((p) => (
            <div key={p.label} style={{
              padding: '28px',
              background: C.bgCard,
              border: `1px solid ${C.bgCardBorder}`,
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}>
              {/* Label */}
              <p style={{ fontSize: '0.7rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.15em', textTransform: 'uppercase', color: C.cyan, marginBottom: '16px' }}>
                {p.label}
              </p>

              {/* Dolor */}
              <div style={{ borderLeft: `2px solid rgba(239,68,68,0.4)`, paddingLeft: '16px', marginBottom: '20px' }}>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: C.muted, fontStyle: 'italic' }}>
                  {p.dolor}
                </p>
              </div>

              {/* Separador */}
              <div style={{ height: '1px', background: C.bgCardBorder, marginBottom: '20px' }} />

              {/* Éxito */}
              <div style={{ borderLeft: `2px solid rgba(34,197,94,0.4)`, paddingLeft: '16px' }}>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: C.white }}>
                  {p.exito}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SOLUCIONES FALLIDAS — "No fallaste tú"
// ============================================================================

function SolucionesFallidasSection() {
  const items = [
    { num: '01', titulo: '"Trabajar más horas"', desc: 'Más ingreso activo. El techo no cambia.' },
    { num: '02', titulo: '"Ahorrar más"', desc: 'La inflación lo erosiona. Sin activos reales, el ahorro es un balde con agujero.' },
    { num: '03', titulo: '"Buscar mejor empleo"', desc: 'El ingreso sube. Los gastos también. El modelo sigue igual.' },
    { num: '04', titulo: '"Poner otro negocio"', desc: 'Sin sistema ni tecnología, requiere más tiempo del que tienes.' },
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            El problema no eres tú
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "'Playfair Display', Georgia, serif", color: '#fff' }}>
            No fallaste tú. Fallaron los modelos.
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
          {items.map((item) => (
            <div key={item.num} style={{
              display: 'flex', gap: '20px', alignItems: 'flex-start',
              padding: '20px 24px',
              background: C.bgCard, border: `1px solid ${C.bgCardBorder}`,
              clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
            }}>
              <span style={{ fontFamily: "'Roboto Mono', monospace", color: C.gold, fontWeight: 700, fontSize: '0.9rem', flexShrink: 0, marginTop: '2px' }}>
                {item.num}
              </span>
              <div>
                <p style={{ color: C.white, fontWeight: 600, marginBottom: '4px' }}>{item.titulo}</p>
                <p style={{ color: C.muted, fontSize: '0.9rem', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{
          textAlign: 'center', fontSize: '1rem', lineHeight: 1.7, color: C.muted,
          padding: '24px', borderLeft: `3px solid rgba(200,168,75,0.2)`,
          background: 'rgba(0,0,0,0.4)',
        }}>
          El problema no es el esfuerzo. Es que ninguno de esos caminos fue diseñado para{' '}
          <span style={{ color: C.white }}>construirte activos reales en paralelo a lo que ya tienes.</span>
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// DÍAS DE LIBERTAD
// ============================================================================

function SolutionPreview() {
  return (
    <section style={{ position: 'relative', padding: '80px 24px', background: 'rgba(13,13,13,0.8)' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontFamily: "'Playfair Display', Georgia, serif", color: '#fff', marginBottom: '24px' }}>
          ¿Cuántos días sobrevivirías sin trabajar?
        </h2>

        <p style={{ fontSize: '1.05rem', color: C.muted, marginBottom: '32px' }}>
          La fórmula es simple:
        </p>

        <div style={{
          display: 'inline-block', padding: '24px 40px',
          background: 'rgba(0,0,0,0.65)', border: `1px solid rgba(200,168,75,0.3)`,
          marginBottom: '32px',
          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        }}>
          <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '1.1rem', color: C.cyan }}>
            Ahorros ÷ Gastos Mensuales = Días de Libertad
          </p>
        </div>

        <p style={{ color: C.muted, marginBottom: '40px' }}>
          La mayoría descubre que tiene{' '}
          <span style={{ fontFamily: "'Roboto Mono', monospace", color: C.cyan, fontWeight: 500 }}>menos de 30 días</span>
          . Algunos, cero.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <Link href="/calculadora" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'transparent', border: `1px solid ${C.gold}`,
            color: C.gold, fontWeight: 600, fontSize: '1rem',
            padding: '14px 32px',
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.1em',
            textDecoration: 'none', textTransform: 'uppercase',
            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          }}>
            Calcular mis días →
          </Link>
          <Link href="/mapa-de-salida" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'transparent', border: `1px solid rgba(200,168,75,0.3)`,
            color: C.muted, fontWeight: 500, fontSize: '0.9rem',
            padding: '14px 24px',
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.08em',
            textDecoration: 'none', textTransform: 'uppercase',
            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
          }}>
            Ya lo sé — quiero la salida →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// QUESWA DIFERENCIADOR
// ============================================================================

function QueswaDiferenciadorSection() {
  const capacidades = [
    { titulo: 'IA que responde por ti 24/7', desc: 'Tu asistente en WhatsApp nunca duerme.' },
    { titulo: 'Dashboard de activos en tiempo real', desc: 'Ve crecer tu patrimonio mes a mes.' },
    { titulo: 'Arsenal de contenido', desc: 'Material listo para que tu red comparta y crezca.' },
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            Tecnología que cambia el juego
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', marginBottom: '16px', fontFamily: "'Playfair Display', Georgia, serif", color: '#fff' }}>
            La primera plataforma en América Latina para construir patrimonio paralelo.
          </h2>
          <p style={{ fontSize: '1rem', color: C.muted, maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            Queswa es el motor de IA que automatiza tu logística. Mientras tú conservas tu empleo actual, nuestra tecnología califica prospectos y los acopla a una cadena de suministro física y corporativa que despacha por ti.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {capacidades.map((cap) => (
            <div key={cap.titulo} style={{
              padding: '24px',
              background: C.bgCard,
              border: `1px solid rgba(200,168,75,0.15)`,
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.gold, marginBottom: '16px' }} />
              <h3 style={{ color: C.white, fontFamily: "'Rajdhani', sans-serif", fontSize: '1rem', letterSpacing: '0.05em', marginBottom: '8px' }}>
                {cap.titulo}
              </h3>
              <p style={{ color: C.muted, fontSize: '0.85rem', lineHeight: 1.5 }}>{cap.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="https://queswa.app" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'transparent', border: `1px solid rgba(200,168,75,0.4)`,
            color: C.gold, fontWeight: 600, fontSize: '0.9rem',
            padding: '12px 28px',
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.1em',
            textDecoration: 'none', textTransform: 'uppercase',
            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
          }}>
            Ver Queswa en acción →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA FINAL — Mapa de Salida como PRIMARIO
// ============================================================================

function FinalCTASection() {
  return (
    <section style={{ position: 'relative', padding: '80px 24px', background: 'rgba(13,13,13,0.8)' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan, marginBottom: '16px' }}>
          El Siguiente Paso
        </p>

        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontFamily: "'Playfair Display', Georgia, serif", color: '#fff', marginBottom: '24px' }}>
          El Mapa de Salida: 5 Días para Escapar del &ldquo;Plan por Defecto&rdquo;
        </h2>

        <p style={{ color: C.muted, maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          Después de entender el problema, el siguiente paso es ver la arquitectura del modelo. Solicita tu mapa. Descubre si existe una salida para alguien con tu perfil. Sin compromisos.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          {/* PRIMARIO — Mapa de Salida */}
          <Link href="/mapa-de-salida" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: `linear-gradient(135deg, ${C.gold}, #B8941F)`,
            color: '#000', fontWeight: 700, fontSize: '1rem',
            padding: '16px 40px',
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.1em',
            textDecoration: 'none', textTransform: 'uppercase',
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
          }}>
            Quiero mi Mapa de Salida →
          </Link>
          {/* SECUNDARIO — Calculadora */}
          <Link href="/calculadora" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'transparent', border: `1px solid rgba(200,168,75,0.3)`,
            color: C.muted, fontWeight: 500, fontSize: '0.85rem',
            padding: '14px 24px',
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.08em',
            textDecoration: 'none', textTransform: 'uppercase',
            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
          }}>
            Primero quiero calcular mis días →
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
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
        <div>
          <p style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.1em', color: C.gold, fontWeight: 600 }}>CreaTuActivo</p>
          <p style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", color: C.muted }}>Sistema de Arquitectura de Activos</p>
        </div>
        <div style={{ display: 'flex', gap: '32px', fontSize: '0.85rem' }}>
          <Link href="/blog" style={{ color: C.muted, textDecoration: 'none' }}>Blog</Link>
          <Link href="/privacidad" style={{ color: C.muted, textDecoration: 'none' }}>Privacidad</Link>
          <Link href="/tecnologia" style={{ color: C.muted, textDecoration: 'none' }}>Tecnología</Link>
        </div>
        <p style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", color: C.muted }}>
          © 2026 CreaTuActivo.com
        </p>
      </div>
    </footer>
  );
}
