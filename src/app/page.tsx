/**
 * Copyright © 2026 CreaTuActivo.com
 * Homepage v13.0 — Unificación cross-canal Tridente EAM + Tres Pilares + Diáspora (May 2026)
 * Lujo Clínico / McKinsey Tone — Brendan Kane + Eugene Schwartz + Oren Klaff
 * Aliado canónico: Guion Maestro Servilleta v2 + System Prompt v26.1 + Arsenal Inicial v24.0
 */

import Link from 'next/link';
import Image from 'next/image';
import StrategicNavigation from '@/components/StrategicNavigation';
import CognitiveLoadComparator from '@/components/CognitiveLoadComparator';
import TridenteAphorisms from '@/components/TridenteAphorisms';

export const dynamic = 'force-static';

export const metadata = {
  title: 'CreaTuActivo | Construcción de Patrimonio Paralelo',
  description: 'Salga del ciclo de trabajar, pagar cuentas y repetir. Acople su Base Operativa al ecosistema de tres pilares — la matriz física de Gano Excel, Queswa como su Centro de Mando, y su rol como Arquitecto de Patrimonio — sin abandonar su ocupación actual.',
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
        <TridenteAphorisms />
        <ProductoFisicoSection />
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
            Infraestructura de Patrimonio Paralelo
          </span>
        </div>

        {/* H1 */}
        <h1 style={{
          fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)', lineHeight: 1.1,
          marginBottom: '20px',
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700, color: C.gold,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          textShadow: '0 2px 12px rgba(0,0,0,0.9)',
        }}>
          Arquitectura de Patrimonio Paralelo
        </h1>

        {/* Hook de diagnóstico */}
        <p style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', lineHeight: 1.4,
          marginBottom: '28px', color: C.white, fontWeight: 500,
          fontFamily: "'Playfair Display', Georgia, serif",
          textShadow: '0 2px 10px rgba(0,0,0,0.9)',
        }}>
          Usted no tiene un problema de ingresos;{' '}
          <span style={{ color: C.gold }}>usted opera bajo el Protocolo de la Presencia Obligada.</span>
        </p>

        {/* Cuerpo */}
        <div style={{
          background: 'rgba(0,0,0,0.70)', padding: '20px 28px', marginBottom: '32px',
          borderLeft: `2px solid rgba(200,168,75,0.3)`,
        }}>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: C.muted, maxWidth: '600px', margin: '0 auto' }}>
            Diagnostique la falla sistémica de su arquitectura financiera actual y desvincule su liquidez de su agotamiento biológico.{' '}
            <span style={{ color: C.white }}>Acople su Base Operativa al ecosistema de tres pilares — la matriz física de Gano Excel en 70 países, Queswa como su Centro de Mando propietario, y su rol como Arquitecto de Patrimonio — sin abandonar su ocupación actual.</span>
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
          Iniciar Auditoría Técnica →
        </Link>

        {/* Micro-copy */}
        <p style={{
          marginTop: '16px', fontSize: '0.78rem', color: C.muted,
          fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.1em',
          textShadow: '0 1px 8px rgba(0,0,0,1)',
        }}>
          5 Días · Subvencionado · Escrutinio de Ingeniería Patrimonial
        </p>

        {/* Link secundario */}
        <p style={{ marginTop: '20px', fontSize: '0.85rem', color: C.muted, textShadow: '0 1px 8px rgba(0,0,0,1)' }}>
          ¿Base Operativa activa?{' '}
          <Link href="https://queswa.app" style={{ color: C.gold, textDecoration: 'none' }}>
            Ingresar a su Centro de Mando →
          </Link>
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// PROBLEMA — "Déficit Estructural"
// ============================================================================

function ProblemSection() {
  const cards = [
    {
      num: '01',
      title: 'Prueba de Estrés',
      desc: 'Someter su arquitectura a un escrutinio es simple: si su ausencia de 30 días detiene el flujo de caja, usted no posee un activo en propiedad; usted opera bajo un arrendamiento biológico de su propia libertad.',
    },
    {
      num: '02',
      title: 'El Techo Técnico',
      desc: 'La hiper-optimización de su tiempo tiene un límite innegociable. Usted puede elevar sus honorarios o trabajar más horas, pero es matemáticamente imposible escalar su propia biología.',
    },
    {
      num: '03',
      title: 'El Gravamen Táctico',
      desc: 'Intentar escapar mediante negocios tradicionales o ventas manuales solo transfiere el problema. Usted termina pagando el impuesto de la operatividad técnica, convirtiéndose en el carcelero de su propia arquitectura financiera.',
    },
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            El Diagnóstico Clínico
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "'Playfair Display', Georgia, serif", color: '#fff' }}>
            El Protocolo de la Presencia Obligada.
          </h2>
        </div>

        {/* Párrafo introductorio */}
        <div style={{
          padding: '28px 32px', marginBottom: '40px',
          background: 'rgba(0,0,0,0.65)', borderLeft: `3px solid ${C.gold}`,
          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: C.muted, margin: 0 }}>
            Su modelo de ingresos actual posee un error de arquitectura crítico: la dependencia absoluta de su desgaste físico o su gestión constante.{' '}
            <span style={{ color: C.white }}>Al financiar su estilo de vida intercambiando tiempo por liquidez, usted ha firmado un contrato de vigilancia permanente sobre su propia vida.</span>{' '}
            <span style={{ color: C.gold, fontWeight: 600 }}>Si usted se detiene, el sistema colapsa, generando inestabilidad estructural en su liquidez.</span>
          </p>
        </div>

        {/* 3 Tarjetas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {cards.map((item) => (
            <div key={item.num} style={{
              padding: '28px 24px',
              background: 'rgba(0,0,0,0.65)', border: `1px solid rgba(34,211,238,0.15)`,
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}>
              <div style={{
                width: 40, height: 40, marginBottom: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${C.cyan}`,
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", color: C.cyan, fontWeight: 700, fontSize: '0.8rem' }}>{item.num}</span>
              </div>
              <h3 style={{ color: C.gold, marginBottom: '12px', fontFamily: "'Rajdhani', sans-serif", fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.title}</h3>
              <p style={{ color: C.muted, fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PERFILES — "Análisis de Riesgo por Perfil de Ingresos"
// ============================================================================

function PerfilesSection() {
  const perfiles = [
    {
      label: 'Microempresario · 1–5 empleados',
      dolor: 'Inestabilidad Estructural por Presencia Obligada: El dueño es el empleado más barato de su propia logística.',
      exito: 'Ingresos que llegan aunque el local esté cerrado. Una Base Operativa que escala mientras usted opera su negocio actual.',
    },
    {
      label: 'Empleado Público · Ejecutivo',
      dolor: 'Brecha Pensional de Estatus: Proyección de pérdida del 60% del poder adquisitivo al retiro.',
      exito: 'Patrimonio Paralelo en construcción, sin comprometer su posición profesional actual.',
    },
    {
      label: 'Pensionado · Después de 30 años',
      dolor: 'Fragilidad de Activo Único: Dependencia total de un sistema de seguridad social en déficit estructural.',
      exito: 'Un activo legal 100% transferible a su familia. Algo que sus hijos puedan heredar.',
    },
    {
      label: 'Latino en el Extranjero · Diáspora Global',
      dolor: 'Soberanía Geográfica Atrofiada: Construcción patrimonial limitada a su país de residencia, sin canal para capitalizar mercado natal.',
      exito: 'Base Operativa anclada al país natal, organización en 15 países de América, dirigida desde su lugar de residencia a través de Queswa.',
    },
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 24px', background: 'rgba(13,13,13,0.8)' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            Diagnóstico por Perfil
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "'Playfair Display', Georgia, serif", color: '#fff' }}>
            Análisis de Riesgo por Perfil de Ingresos
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

              {/* Diagnóstico */}
              <div style={{ borderLeft: `2px solid rgba(239,68,68,0.4)`, paddingLeft: '16px', marginBottom: '20px' }}>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: C.muted }}>
                  {p.dolor}
                </p>
              </div>

              {/* Separador */}
              <div style={{ height: '1px', background: C.bgCardBorder, marginBottom: '20px' }} />

              {/* Corrección */}
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
// SOLUCIONES FALLIDAS — "Modelos sin arquitectura"
// ============================================================================

function SolucionesFallidasSection() {
  const opciones = [
    {
      num: '01',
      titulo: 'Tolerancia al Déficit',
      subtitulo: 'Status Quo',
      desc: 'Continuar operando bajo el Protocolo de la Presencia Obligada. Usted acepta que su liquidez posee una fecha de caducidad biológica y asume el riesgo de un colapso si su capacidad operativa se detiene.',
      destacada: false,
    },
    {
      num: '02',
      titulo: 'El Gravamen Táctico',
      subtitulo: 'Negocio Tradicional',
      desc: 'Intentar escapar asumiendo riesgos logísticos y operativos. Usted compra una ilusión de soberanía, pero termina convirtiéndose en el vigilante permanente de su propia matriz comercial.',
      destacada: false,
    },
    {
      num: '03',
      titulo: 'Apalancamiento Asimétrico',
      subtitulo: 'Ecosistema de Tres Pilares',
      desc: 'Acoplar su Base Operativa al ecosistema canónico. Gano Excel asume la matriz física en 70 países, Queswa asume el 90% del desgaste operativo, y usted ejerce la gobernanza como Arquitecto de Patrimonio.',
      destacada: true,
    },
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold }}>
            La Arquitectura de Decisiones
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "'Playfair Display', Georgia, serif", color: '#fff' }}>
            Usted tiene tres opciones operativas frente a esta inestabilidad estructural.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {opciones.map((item) => (
            <div key={item.num} style={{
              padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '12px',
              background: item.destacada ? 'rgba(200,168,75,0.06)' : 'rgba(0,0,0,0.65)',
              border: item.destacada ? `1px solid ${C.gold}` : `1px solid rgba(255,255,255,0.07)`,
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontFamily: "'Roboto Mono', monospace", fontSize: '0.75rem', fontWeight: 700,
                  color: item.destacada ? C.gold : C.muted,
                }}>
                  {item.num}
                </span>
                <span style={{
                  fontSize: '0.7rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: item.destacada ? C.gold : C.muted,
                  opacity: 0.7,
                }}>
                  {item.subtitulo}
                </span>
              </div>
              <h3 style={{
                fontFamily: "'Rajdhani', sans-serif", fontSize: '1.1rem',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: item.destacada ? C.gold : C.white,
                margin: 0,
              }}>
                {item.titulo}
              </h3>
              <p style={{ color: C.muted, fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PRODUCTO FÍSICO — Aterrizaje del consumo recurrente tangible
// ============================================================================

function ProductoFisicoSection() {
  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            La Capa Logística de Consumo Recurrente
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "'Playfair Display', Georgia, serif", color: '#fff' }}>
            Todo activo financiero sólido requiere un motor de alta rotación.
          </h2>
        </div>

        <div style={{
          padding: '32px 36px', marginBottom: '32px',
          background: 'rgba(0,0,0,0.65)', borderLeft: `3px solid ${C.gold}`,
          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: C.muted, margin: 0 }}>
            Su Base Operativa monetiza un hábito biológico innegociable:{' '}
            <span style={{ color: C.white }}>el consumo masivo de bebidas enriquecidas y suplementos de alta gama.</span>{' '}
            No estamos creando una necesidad nueva ni buscando convencer a nadie de cambiar su estilo de vida. Simplemente optimizamos un hábito que ya existe, mediante{' '}
            <span style={{ color: C.gold, fontWeight: 600 }}>tecnología propietaria de extracción dual respaldada por décadas de investigación en biotecnología asiática</span>.
          </p>
        </div>

        <div style={{
          padding: '24px 32px',
          background: 'rgba(200,168,75,0.04)',
          border: `1px solid rgba(200,168,75,0.2)`,
          textAlign: 'center',
          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        }}>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: C.white, margin: 0, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}>
            Un hábito biológico que no cambia genera un flujo de caja que no se detiene.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PRUEBA DE ESTRÉS PATRIMONIAL
// ============================================================================

function SolutionPreview() {
  return (
    <section style={{ position: 'relative', padding: '80px 24px', background: 'rgba(13,13,13,0.8)' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
          La Prueba de Estrés Patrimonial
        </span>

        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontFamily: "'Playfair Display', Georgia, serif", color: '#fff', marginTop: '16px', marginBottom: '24px' }}>
          ¿Cuál es el Índice de Caducidad de su liquidez actual?
        </h2>

        <p style={{ fontSize: '1.05rem', color: C.muted, marginBottom: '32px', lineHeight: 1.7 }}>
          La ecuación para diagnosticar el impacto del Protocolo de la Presencia Obligada es clínica y binaria:
        </p>

        <div style={{
          display: 'inline-block', padding: '24px 40px',
          background: 'rgba(0,0,0,0.65)', border: `1px solid rgba(200,168,75,0.3)`,
          marginBottom: '32px',
          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        }}>
          <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '1rem', color: C.cyan, margin: 0, lineHeight: 1.8 }}>
            Reservas Líquidas ÷ Carga Operativa Mensual{' '}
            <span style={{ color: C.muted }}>=</span>{' '}
            <span style={{ color: C.gold, fontWeight: 700 }}>Autonomía Estructural (Días)</span>
          </p>
        </div>

        <p style={{ color: C.muted, marginBottom: '40px', maxWidth: '580px', margin: '0 auto 40px', lineHeight: 1.75 }}>
          Usted controla sus finanzas con disciplina; sin embargo, el escrutinio técnico revela que la mayoría de ejecutivos operan con una{' '}
          <span style={{ color: C.white, fontWeight: 500 }}>Autonomía Estructural inferior a 30 días</span>.{' '}
          Si su resultado es crítico, no necesita motivación; necesita acoplar su Base Operativa al ecosistema canónico.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <Link href="/calculadora" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: `linear-gradient(135deg, ${C.gold}, #B8941F)`,
            color: '#000', fontWeight: 700, fontSize: '0.95rem',
            padding: '14px 32px',
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.1em',
            textDecoration: 'none', textTransform: 'uppercase',
            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          }}>
            Ejecutar Simulador Técnico →
          </Link>
          <Link href="/auditoria-patrimonial" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'transparent', border: `1px solid rgba(200,168,75,0.3)`,
            color: C.muted, fontWeight: 500, fontSize: '0.85rem',
            padding: '14px 24px',
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.07em',
            textDecoration: 'none', textTransform: 'uppercase',
            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
          }}>
            Omitir Simulación e Iniciar Auditoría Técnica →
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
    {
      titulo: 'EXPANDIR — Despliegue de Tráfico Calificado',
      desc: 'Usted no explica — Queswa explica. Su dispositivo se convierte en centro de mando; toda la información ya está estructurada y se despliega con precisión quirúrgica.',
    },
    {
      titulo: 'ACTIVAR — Filtrado y Calificación 24/7',
      desc: 'Usted no convence; usted audita y autoriza. Queswa procesa el tráfico, neutraliza objeciones y madura la decisión por usted.',
    },
    {
      titulo: 'MAESTRÍA — Escalamiento Automatizado',
      desc: 'Usted no enseña; Queswa escala. La maestría operativa se instala en cada nuevo Arquitecto de Patrimonio desde el día uno.',
    },
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            El Centro de Mando
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', marginBottom: '20px', fontFamily: "'Playfair Display', Georgia, serif", color: '#fff' }}>
            Queswa: Su Centro de Mando para la Soberanía Patrimonial.
          </h2>
          <p style={{ fontSize: '1rem', color: C.muted, maxWidth: '620px', margin: '0 auto', lineHeight: 1.8 }}>
            Queswa es la plataforma propietaria de IA diseñada para neutralizar el Protocolo de la Presencia Obligada bajo la metodología <span style={{ color: C.gold, fontWeight: 600 }}>El Tridente EAM</span>.{' '}
            <span style={{ color: C.white }}>Mientras usted ejerce gobernanza, Queswa califica la demanda y la acopla a la matriz física de Gano Excel —presencia en 70 países, red de sedes operativas locales y soporte presencial— que asume el</span>{' '}
            <span style={{ color: C.gold, fontWeight: 600 }}>90% del desgaste operativo</span>{' '}
            <span style={{ color: C.white }}>por usted.</span>
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
              <h3 style={{
                color: C.white, fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.95rem', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '10px',
              }}>
                {cap.titulo}
              </h3>
              <p style={{ color: C.muted, fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{cap.desc}</p>
            </div>
          ))}
        </div>

        {/* Comparador de Carga Cognitiva interactivo */}
        <div style={{ marginBottom: '40px' }}>
          <CognitiveLoadComparator />
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
            Solicitar Demostración Técnica →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA FINAL
// ============================================================================

function FinalCTASection() {
  return (
    <section style={{ position: 'relative', padding: '80px 24px', background: 'rgba(13,13,13,0.8)' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, marginBottom: '16px' }}>
          Protocolo de Integración
        </p>

        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', fontFamily: "'Playfair Display', Georgia, serif", color: '#fff', marginBottom: '12px' }}>
          Auditoría de Arquitectura Patrimonial
        </h2>

        <p style={{ fontSize: '1rem', color: C.muted, marginBottom: '32px', fontStyle: 'italic', fontFamily: "'Playfair Display', Georgia, serif" }}>
          Escrutinio de 5 Días para Neutralizar el Protocolo de la Presencia Obligada.
        </p>

        <div style={{
          padding: '24px 32px', marginBottom: '40px',
          background: 'rgba(0,0,0,0.5)', borderLeft: `2px solid rgba(200,168,75,0.3)`,
          textAlign: 'left',
        }}>
          <p style={{ color: C.muted, lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>
            Identificada la falla sistémica en su arquitectura financiera, el siguiente paso es ejecutar una validación de viabilidad técnica.{' '}
            <span style={{ color: C.white }}>Esta infraestructura no es de acceso masivo; está restringida a perfiles con capacidad de gobernanza directiva.</span>{' '}
            Su expediente requiere una validación de datos en un periodo máximo de{' '}
            <span style={{ color: C.gold, fontWeight: 600 }}>48 horas</span>{' '}
            para asegurar la integridad del ecosistema.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          <Link href="/auditoria-patrimonial" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: `linear-gradient(135deg, ${C.gold}, #B8941F)`,
            color: '#000', fontWeight: 700, fontSize: '1rem',
            padding: '16px 40px',
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.12em',
            textDecoration: 'none', textTransform: 'uppercase',
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
          }}>
            Iniciar Auditoría Técnica →
          </Link>
          <Link href="/calculadora" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'transparent', border: `1px solid rgba(200,168,75,0.3)`,
            color: C.muted, fontWeight: 500, fontSize: '0.82rem',
            padding: '14px 24px',
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.08em',
            textDecoration: 'none', textTransform: 'uppercase',
            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
          }}>
            Ejecutar Prueba de Estrés Patrimonial →
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
          <p style={{ fontSize: '0.75rem', fontFamily: "'Roboto Mono', monospace", color: C.muted }}>Infraestructura de Patrimonio Paralelo</p>
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
