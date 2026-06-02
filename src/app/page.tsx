/**
 * Copyright © 2026 CreaTuActivo.com
 * Homepage v13.3 — Retrofit Pilar 3: "Su Rol como Arquitecto" → "La Metodología Automatizada (Tridente EAM)". El Arquitecto queda elevado como director de los tres pilares. Cleanup "tecnología celular" → "tecnología propietaria de bioactivación". (15 May 2026)
 * Lujo Clínico / McKinsey Tone — Brendan Kane + Eugene Schwartz + Oren Klaff
 * Aliado canónico: Servilleta v3.1 + System Prompt v26.5 + Arsenal Inicial v25.3
 */

import Link from 'next/link';
import Image from 'next/image';
import StrategicNavigation from '@/components/StrategicNavigation';
import CognitiveLoadComparator from '@/components/CognitiveLoadComparator';
import TridenteAphorisms from '@/components/TridenteAphorisms';
import { SERVILLETA_YOUTUBE_ID } from '@/lib/reels';

export const dynamic = 'force-static';

export const metadata = {
  title: 'CreaTuActivo | Construcción de Estructura Patrimonial',
  description: 'La solución no es trabajar más duro, ni reemplazar su actividad actual. Construya una Estructura Patrimonial apalancada en tres pilares: Gano Excel en 70 países, Queswa como su Centro de Mando, y la metodología automatizada del Tridente EAM. Usted dirige.',
};

// Paleta local alineada a tokens del Sistema de Diseño (Lujo Silencioso v1.0)
const C = {
  gold: 'var(--color-brand)',              // #C5A059
  goldHover: 'var(--color-brand-hover)',   // #D4AF37
  cyan: '#22D3EE',                         // Acento data/labels técnicos (no en handoff, conservado)
  white: 'var(--color-text-primary)',      // #FFFFFF
  body: 'var(--color-text-body)',          // #E5E5E5
  muted: 'var(--color-text-muted)',        // #A3A3A3
  bg: 'var(--color-bg-primary)',           // #0F1115
  bgElevated: 'var(--color-bg-elevated)',  // #15171C
  bgCard: 'var(--color-bg-surface)',       // #1A1D23
  bgCardBorder: 'rgba(255,255,255,0.08)',
  danger: 'var(--color-error)',            // #9E2A3A
  success: 'var(--color-success)',         // #408A71
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
        background: `radial-gradient(ellipse at 60% 40%, rgba(34,211,238,0.04) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(197, 160, 89,0.04) 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      {/* Hero image lazy */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        filter: 'grayscale(70%) contrast(1.1) brightness(0.55)',
        opacity: 0.75,
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        pointerEvents: 'none',
      }}>
        <Image src="/images/3-pilares.webp" alt="" fill loading="lazy"
          style={{ objectFit: 'cover', objectPosition: 'center' }} sizes="100vw" />
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        {/* H1 */}
        <h1 style={{
          fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)', lineHeight: 1.1,
          marginBottom: '20px',
          fontFamily: "var(--font-sans)",
          fontWeight: 700, color: C.gold,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          textShadow: '0 2px 12px rgba(0,0,0,0.9)',
        }}>
          Construcción de Estructura Patrimonial
        </h1>

        {/* Hook de diagnóstico */}
        <p style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', lineHeight: 1.4,
          marginBottom: '28px', color: C.white, fontWeight: 500,
          fontFamily: "var(--font-serif)",
          textShadow: '0 2px 10px rgba(0,0,0,0.9)',
        }}>
          Usted no tiene un problema de ingresos.{' '}
          <span style={{ color: C.gold }}>Tiene una trampa estructural: si para de trabajar, para de ganar.</span>
        </p>

        {/* Presentación servilleta — video de YouTube embebido */}
        <div style={{
          position: 'relative', width: '100%', aspectRatio: '16 / 9',
          marginBottom: '32px', borderRadius: '10px', overflow: 'hidden',
          border: '1px solid rgba(148, 163, 184, 0.18)', background: '#000',
        }}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${SERVILLETA_YOUTUBE_ID}?rel=0&modestbranding=1`}
            title="Presentación CreaTuActivo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        </div>

        {/* Cuerpo */}
        <div style={{
          background: 'rgba(0,0,0,0.70)', padding: '20px 28px', marginBottom: '32px',
          borderLeft: `2px solid rgba(197, 160, 89,0.3)`,
        }}>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: C.muted, maxWidth: '600px', margin: '0 auto' }}>
            Diagnostique la falla sistémica de su arquitectura financiera actual y desvincule su liquidez de sus horas de vida.{' '}
            <span style={{ color: C.white }}>Construya una <strong style={{ color: C.gold }}>Estructura Patrimonial</strong> apalancada en tres pilares — la matriz física de Gano Excel en 70 países, Queswa como su Centro de Mando, y la metodología automatizada del Tridente EAM — sin abandonar su ocupación actual. Usted dirige.</span>
          </p>
        </div>

        {/* CTA primario — Lujo Silencioso (Carbón + Borde Dorado + Texto Dorado) */}
        <Link href="/mapa-de-salida" className="cta-base cta-primary">
          Iniciar Auditoría de Viabilidad →
        </Link>

        {/* Micro-copy */}
        <p style={{
          marginTop: '16px', fontSize: '0.78rem', color: C.muted,
          fontFamily: "var(--font-mono)", letterSpacing: '0.1em',
          textShadow: '0 1px 8px rgba(0,0,0,1)',
        }}>
          5 Días · Sin Costo · Escrutinio de Ingeniería Patrimonial
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
      desc: 'Someter su arquitectura a un escrutinio es simple: si su ausencia de 30 días detiene el flujo de caja, usted no posee un activo en propiedad; usted opera bajo un arrendamiento de sus horas de vida.',
    },
    {
      num: '02',
      title: 'El Techo Técnico',
      desc: 'La hiper-optimización de su tiempo tiene un límite innegociable. Usted puede elevar sus honorarios o trabajar más horas, pero es matemáticamente imposible escalar su propia biología.',
    },
    {
      num: '03',
      title: 'El Gravamen Táctico',
      desc: 'Intentar escapar mediante negocios tradicionales o ventas manuales solo transfiere el problema. Usted termina pagando el impuesto de la operatividad técnica, convirtiéndose en el operador subordinado de su propia arquitectura financiera.',
    },
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            El Diagnóstico Clínico
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "var(--font-serif)", color: '#fff' }}>
            La Trampa Estructural.
          </h2>
        </div>

        {/* Párrafo introductorio */}
        <div style={{
          padding: '28px 32px', marginBottom: '40px',
          background: 'rgba(0,0,0,0.65)', borderLeft: `3px solid ${C.gold}`,
          borderRadius: 'var(--radius-container)',
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: C.muted, margin: 0 }}>
            Su modelo de ingresos actual posee un error de arquitectura crítico: la dependencia absoluta de sus horas de vida o su gestión constante.{' '}
            <span style={{ color: C.white }}>Al financiar su estilo de vida intercambiando tiempo por dinero, usted ha firmado un contrato de vigilancia permanente sobre su propia vida.</span>{' '}
            <span style={{ color: C.gold, fontWeight: 600 }}>Si usted se detiene, el sistema colapsa, generando inestabilidad estructural en su liquidez.</span>
          </p>
        </div>

        {/* 3 Tarjetas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {cards.map((item) => (
            <div key={item.num} style={{
              padding: '28px 24px',
              background: 'rgba(0,0,0,0.65)', border: `1px solid rgba(34,211,238,0.15)`,
              borderRadius: 'var(--radius-container)',
            }}>
              <div style={{
                width: 40, height: 40, marginBottom: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${C.cyan}`,
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              }}>
                <span style={{ fontFamily: "var(--font-mono)", color: C.cyan, fontWeight: 700, fontSize: '0.8rem' }}>{item.num}</span>
              </div>
              <h3 style={{ color: C.gold, marginBottom: '12px', fontFamily: "var(--font-sans)", fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.title}</h3>
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
      dolor: 'Arquitectura con Déficit Estructural: El dueño es el empleado más barato de su propia logística.',
      exito: 'Ingresos que llegan aunque el local esté cerrado. Una Base Operativa que escala mientras usted opera su negocio actual.',
    },
    {
      label: 'Empleado Público · Ejecutivo',
      dolor: 'Brecha Pensional de Estatus: Proyección de pérdida del 60% del poder adquisitivo al retiro.',
      exito: 'Estructura Patrimonial en construcción, sin comprometer su posición profesional actual.',
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
          <span style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            Diagnóstico por Perfil
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "var(--font-serif)", color: '#fff' }}>
            Análisis de Riesgo por Perfil de Ingresos
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {perfiles.map((p) => (
            <div key={p.label} style={{
              padding: '28px',
              background: C.bgCard,
              border: `1px solid ${C.bgCardBorder}`,
              borderRadius: 'var(--radius-container)',
            }}>
              {/* Label */}
              <p style={{ fontSize: '0.7rem', fontFamily: "var(--font-mono)", letterSpacing: '0.15em', textTransform: 'uppercase', color: C.cyan, marginBottom: '16px' }}>
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
      desc: 'Continuar operando bajo el modelo del intercambio lineal de tiempo por dinero. Usted acepta que su liquidez posee una fecha de caducidad atada a sus horas de vida y asume el riesgo de un colapso si su capacidad operativa se detiene.',
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
      desc: 'Acoplar su Base Operativa al ecosistema canónico. Gano Excel asume la matriz física en 70 países, Queswa asume el 90% del desgaste operativo, y el Tridente EAM le entrega las coordenadas exactas de dirección. Usted ejerce la gobernanza como Arquitecto de Patrimonio.',
      destacada: true,
    },
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold }}>
            La Arquitectura de Decisiones
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "var(--font-serif)", color: '#fff' }}>
            Usted tiene tres opciones operativas frente a esta inestabilidad estructural.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {opciones.map((item) => (
            <div key={item.num} style={{
              padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '12px',
              background: item.destacada ? 'rgba(197, 160, 89,0.06)' : 'rgba(0,0,0,0.65)',
              border: item.destacada ? `1px solid ${C.gold}` : `1px solid rgba(255,255,255,0.07)`,
              borderRadius: 'var(--radius-container)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: '0.75rem', fontWeight: 700,
                  color: item.destacada ? C.gold : C.muted,
                }}>
                  {item.num}
                </span>
                <span style={{
                  fontSize: '0.7rem', fontFamily: "var(--font-mono)", letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: item.destacada ? C.gold : C.muted,
                  opacity: 0.7,
                }}>
                  {item.subtitulo}
                </span>
              </div>
              <h3 style={{
                fontFamily: "var(--font-sans)", fontSize: '1.1rem',
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
          <span style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            Pilar 1 — La Matriz Física de Consumo Recurrente
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "var(--font-serif)", color: '#fff' }}>
            Todo activo financiero sólido requiere un motor de alta rotación.
          </h2>
        </div>

        <div style={{
          padding: '32px 36px', marginBottom: '32px',
          background: 'rgba(0,0,0,0.65)', borderLeft: `3px solid ${C.gold}`,
          borderRadius: 'var(--radius-container)',
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: C.muted, margin: 0 }}>
            Su Base Operativa monetiza un hábito biológico innegociable:{' '}
            <span style={{ color: C.white }}>el consumo masivo de bebidas enriquecidas y suplementos de alta gama.</span>{' '}
            No estamos creando una necesidad nueva ni buscando convencer a nadie de cambiar su estilo de vida. Simplemente optimizamos un hábito que ya existe, mediante{' '}
            <span style={{ color: C.gold, fontWeight: 600 }}>tecnología propietaria de bioactivación respaldada por décadas de investigación en biotecnología asiática</span>.
          </p>
        </div>

        <div style={{
          padding: '24px 32px',
          background: 'rgba(197, 160, 89,0.04)',
          border: `1px solid rgba(197, 160, 89,0.2)`,
          textAlign: 'center',
          borderRadius: 'var(--radius-container)',
        }}>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: C.white, margin: 0, fontFamily: "var(--font-serif)", fontStyle: 'italic' }}>
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
        <span style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
          La Prueba de Estrés Patrimonial
        </span>

        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontFamily: "var(--font-serif)", color: '#fff', marginTop: '16px', marginBottom: '24px' }}>
          ¿Cuál es la Autonomía Estructural de su liquidez actual?
        </h2>

        <p style={{ fontSize: '1.05rem', color: C.muted, marginBottom: '32px', lineHeight: 1.7 }}>
          La ecuación para diagnosticar la vulnerabilidad de su modelo actual es clínica y binaria:
        </p>

        <div style={{
          display: 'inline-block', padding: '24px 40px',
          background: 'rgba(0,0,0,0.65)', border: `1px solid rgba(197, 160, 89,0.3)`,
          marginBottom: '32px',
          borderRadius: 'var(--radius-container)',
        }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: '1rem', color: C.cyan, margin: 0, lineHeight: 1.8 }}>
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
          <Link href="/calculadora" className="cta-base cta-primary">
            Ejecutar Simulador Técnico →
          </Link>
          <Link href="/auditoria-patrimonial" className="cta-base cta-secondary">
            Omitir Simulación e Iniciar Auditoría de Viabilidad →
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
      titulo: 'COMANDO EXPANDIR — Despliegue de Tráfico Calificado',
      desc: 'Usted no explica — Queswa explica. Su dispositivo se convierte en centro de mando; toda la información ya está estructurada y se despliega con precisión quirúrgica.',
    },
    {
      titulo: 'COMANDO ACTIVAR — Filtrado y Calificación 24/7',
      desc: 'Usted no convence; usted audita y autoriza. Queswa procesa el tráfico, neutraliza objeciones y madura la decisión por usted.',
    },
    {
      titulo: 'COMANDO MAESTRÍA — Escalamiento Automatizado',
      desc: 'Usted no enseña; Queswa escala. La maestría operativa se instala en cada nuevo Arquitecto de Patrimonio desde el día uno.',
    },
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            El Centro de Mando
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', marginBottom: '20px', fontFamily: "var(--font-serif)", color: '#fff' }}>
            Queswa: Su Centro de Mando para la Soberanía Patrimonial.
          </h2>
          <p style={{ fontSize: '1rem', color: C.muted, maxWidth: '620px', margin: '0 auto', lineHeight: 1.8 }}>
            Queswa es la plataforma propietaria de IA que opera bajo la metodología <span style={{ color: C.gold, fontWeight: 600 }}>El Tridente EAM — tres comandos automatizados</span> que neutralizan la fricción del modelo actual.{' '}
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
              border: `1px solid rgba(197, 160, 89,0.15)`,
              borderRadius: 'var(--radius-container)',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.gold, marginBottom: '16px' }} />
              <h3 style={{
                color: C.white, fontFamily: "var(--font-sans)",
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
          <Link href="https://queswa.app" className="cta-base cta-secondary">
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
        <p style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, marginBottom: '16px' }}>
          Protocolo de Integración
        </p>

        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', fontFamily: "var(--font-serif)", color: '#fff', marginBottom: '12px' }}>
          Auditoría de Arquitectura Patrimonial
        </h2>

        <p style={{ fontSize: '1rem', color: C.muted, marginBottom: '32px', fontStyle: 'italic', fontFamily: "var(--font-serif)" }}>
          Escrutinio de 5 Días para Diagnosticar la Vulnerabilidad de su Modelo Actual.
        </p>

        <div style={{
          padding: '24px 32px', marginBottom: '40px',
          background: 'rgba(0,0,0,0.5)', borderLeft: `2px solid rgba(197, 160, 89,0.3)`,
          textAlign: 'left',
        }}>
          <p style={{ color: C.muted, lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>
            Identificada la falla sistémica en su arquitectura financiera, el siguiente paso es ejecutar una validación de viabilidad técnica.{' '}
            <span style={{ color: C.white }}>La activación de su Base Operativa no es de acceso masivo; está restringida a perfiles con capacidad de gobernanza directiva.</span>{' '}
            <span style={{ color: C.gold, fontWeight: 600 }}>Determine usted si su arquitectura patrimonial requiere este nivel hoy.</span>
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          <Link href="/auditoria-patrimonial" className="cta-base cta-primary">
            Iniciar Auditoría de Viabilidad →
          </Link>
          <Link href="/calculadora" className="cta-base cta-secondary">
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
          <p style={{ fontFamily: "var(--font-sans)", letterSpacing: '0.1em', color: C.gold, fontWeight: 600 }}>CreaTuActivo</p>
          <p style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", color: C.muted }}>Construcción de Estructura Patrimonial</p>
        </div>
        <div style={{ display: 'flex', gap: '32px', fontSize: '0.85rem' }}>
          <Link href="/blog" style={{ color: C.muted, textDecoration: 'none' }}>Blog</Link>
          <Link href="/privacidad" style={{ color: C.muted, textDecoration: 'none' }}>Privacidad</Link>
          <Link href="/terminos" style={{ color: C.muted, textDecoration: 'none' }}>Términos</Link>
          <Link href="/tecnologia" style={{ color: C.muted, textDecoration: 'none' }}>Tecnología</Link>
        </div>
        <p style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", color: C.muted }}>
          © 2026 CreaTuActivo.com
        </p>
      </div>
    </footer>
  );
}
