/**
 * Copyright © 2026 CreaTuActivo.com
 * Homepage v13.5 — Negocio digital (jun 2026): "Base Operativa" → "negocio digital" · "el sistema opera" → "el sistema hace el trabajo" · operar/escalar/"gente" ajustados. Previo v13.4 — Recalibración léxica accesible: "Estructura Patrimonial" → "ingresos recurrentes", "La Matriz Física" → "El Respaldo Operativo", "Tridente EAM" → "El Método Comprobado", "Arquitecto de Patrimonio" → "Propietario", "gobernanza" → "dirige". Alinea la home con WHY_01/WHY_02/EAM_01 + servilleta. Nombres de funnel (Auditoría Patrimonial, Prueba de Estrés) preservados.
 * Lujo Clínico / McKinsey Tone — Brendan Kane + Eugene Schwartz + Oren Klaff
 * Aliado canónico: Servilleta v3.1 + System Prompt v26.5 + Arsenal Inicial v25.3
 */

import Link from 'next/link';
import Image from 'next/image';
import StrategicNavigation from '@/components/StrategicNavigation';
import CognitiveLoadComparator from '@/components/CognitiveLoadComparator';
import TridenteAphorisms from '@/components/TridenteAphorisms';
import HomeManifestoVideo from '@/components/HomeManifestoVideo';
import { HOME_MANIFESTO_VIDEO, HOME_MANIFESTO_POSTER } from '@/lib/reels';

export const dynamic = 'force-static';

export const metadata = {
  title: 'CreaTuActivo | Construcción de Ingresos Recurrentes',
  description: 'La solución no es trabajar más duro, ni reemplazar su actividad actual. Construya una estructura de ingresos recurrentes apalancada en tres pilares: el Respaldo Operativo de Gano Excel en 70 países, Queswa como su Centro de Mando, y El Método Comprobado. Usted dirige.',
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
        <VisionSection />
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
          Construcción de Ingresos Recurrentes
        </h1>

        {/* Hook de diagnóstico */}
        <p style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', lineHeight: 1.4,
          marginBottom: '28px', color: C.white, fontWeight: 500,
          fontFamily: "var(--font-serif)",
          textShadow: '0 2px 10px rgba(0,0,0,0.9)',
        }}>
          Usted no tiene un problema de ingresos.{' '}
          <span style={{ color: C.gold }}>Tiene un punto ciego — y casi nadie lo ve hasta que es tarde.</span>
        </p>

        {/* Video manifiesto 9:16 — al terminar se desvanece y abre Queswa con foco en el input */}
        <div style={{ marginBottom: '32px' }}>
          <HomeManifestoVideo src={HOME_MANIFESTO_VIDEO} poster={HOME_MANIFESTO_POSTER} />
        </div>

        {/* Cuerpo */}
        <div style={{
          background: 'rgba(0,0,0,0.70)', padding: '20px 28px', marginBottom: '32px',
          borderLeft: `2px solid rgba(197, 160, 89,0.3)`,
        }}>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: C.muted, maxWidth: '600px', margin: '0 auto' }}>
            La solución no es trabajar más, ni dejar lo que hace hoy.{' '}
            <span style={{ color: C.white }}>Es construir una <strong style={{ color: C.gold }}>estructura de ingresos recurrentes</strong> — un ingreso que sigue llegando aunque usted descanse, viaje o simplemente viva. Usted toma el control de su propio <strong style={{ color: C.gold }}>negocio digital</strong>, listo para funcionar, sostenida por tres pilares que cargan el trabajo pesado: Gano Excel (la empresa, en 70 países), Queswa (la tecnología que atiende y filtra por usted) y un método paso a paso. Usted dirige; el sistema hace el trabajo.</span>
          </p>
        </div>

        {/* CTA primario — Lujo Silencioso (Carbón + Borde Dorado + Texto Dorado) */}
        <Link href="/mapa-de-salida" className="cta-base cta-primary">
          Iniciar el Diagnóstico de 5 Días →
        </Link>

        {/* Micro-copy */}
        <p style={{
          marginTop: '16px', fontSize: '0.78rem', color: C.muted,
          fontFamily: "var(--font-mono)", letterSpacing: '0.1em',
          textShadow: '0 1px 8px rgba(0,0,0,1)',
        }}>
          5 Días · Sin Costo · Radiografía de su Modelo de Ingresos
        </p>

        {/* Link secundario */}
        <p style={{ marginTop: '20px', fontSize: '0.85rem', color: C.muted, textShadow: '0 1px 8px rgba(0,0,0,1)' }}>
          ¿Negocio digital activo?{' '}
          <Link href="https://queswa.app" style={{ color: C.gold, textDecoration: 'none' }}>
            Ingresar a su Centro de Mando →
          </Link>
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// EL DIAGNÓSTICO — El villano narrado (estilo NuBank) + muro de datos
// ============================================================================

function ProblemSection() {
  const cifras = [
    <><strong style={{ color: C.white, fontWeight: 700 }}>1 de cada 4</strong> personas llega a pensionarse <span style={{ color: C.muted }}>(apenas el 12% de las mujeres)</span>.</>,
    <><strong style={{ color: C.white, fontWeight: 700 }}>4 de cada 10</strong> despidos caen sobre los mayores de 45.</>,
    <>Más de <strong style={{ color: C.white, fontWeight: 700 }}>la cuarta parte</strong> del ingreso de un hogar se va solo en pagar deudas.</>,
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            El Diagnóstico
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "var(--font-serif)", color: '#fff', lineHeight: 1.25 }}>
            Corregimos las ineficiencias de los modelos de ingresos tradicionales.
          </h2>
        </div>

        {/* Narración del villano (estilo NuBank: detalles vividos, sin etiqueta) */}
        <div style={{
          padding: '28px 32px', marginBottom: '24px',
          background: 'rgba(0,0,0,0.65)', borderLeft: `3px solid ${C.gold}`,
          borderRadius: 'var(--radius-container)',
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: C.muted, margin: 0 }}>
            Usted se levanta temprano, cumple, da resultados. Y aun así, algo no cuadra: por más que avanza, <strong style={{ color: C.white, fontWeight: 600 }}>los créditos siempre le llevan la delantera</strong>. Llega fin de mes y <strong style={{ color: C.white, fontWeight: 600 }}>la plata no alcanza</strong>. El año que le fue bien no le asegura el que viene. Y de fondo, un ruido que no se apaga: <em style={{ color: C.body }}>¿qué pasa si me enfermo, si me despiden, si la pensión no llega?</em>
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: C.muted, margin: '20px 0 0' }}>
            Eso no es mala suerte ni falta de esfuerzo suyo. <strong style={{ color: C.white, fontWeight: 600 }}>El modelo se diseñó así</strong>: para mantenerlo remando, construyendo el patrimonio de otros <strong style={{ color: C.white, fontWeight: 600 }}>y no el suyo</strong>. Y funciona con una sola condición — <strong style={{ color: C.gold, fontWeight: 600 }}>que usted nunca deje de remar.</strong>
          </p>
        </div>

        {/* Muro de datos — prueba */}
        <div style={{
          padding: '24px 28px', marginBottom: '32px',
          background: 'rgba(0,0,0,0.5)', border: `1px solid rgba(34,211,238,0.2)`,
          borderRadius: 'var(--radius-container)',
        }}>
          <p style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.12em', textTransform: 'uppercase', color: C.cyan, margin: '0 0 16px' }}>
            No es una sensación suya — es lo que muestran las cifras
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cifras.map((c, i) => (
              <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'baseline', fontSize: '0.95rem', lineHeight: 1.5, color: C.muted }}>
                <span style={{ color: C.cyan, fontFamily: "var(--font-mono)", flexShrink: 0 }}>›</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cierre — el golpe */}
        <p style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)', lineHeight: 1.6, color: C.white, textAlign: 'center', fontFamily: "var(--font-serif)", margin: 0 }}>
          <strong style={{ color: C.gold, fontWeight: 600 }}>Piénselo por un instante:</strong> un mes que no pueda trabajar, un despido inesperado o un mal trimestre de ventas… y en cuestión de <strong style={{ color: C.gold, fontWeight: 600 }}>meses</strong> descubrirá que <strong style={{ color: C.gold, fontWeight: 600 }}>sus bienes son más del banco que suyos.</strong>
        </p>
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
      dolor: 'El dueño termina siendo el empleado peor pagado de su propio negocio.',
      exito: 'Ingresos que llegan aunque el local esté cerrado. Un negocio digital que crece mientras usted atiende su negocio actual.',
    },
    {
      label: 'Empleado Público · Ejecutivo',
      dolor: 'Al jubilarse, puede perder hasta el 60% de su poder de compra.',
      exito: 'Un ingreso propio que llega aunque la pensión no alcance — construido sin tocar su carrera.',
    },
    {
      label: 'Pensionado · Después de 30 años',
      dolor: 'Todo depende de una sola fuente: una pensión que cada vez alcanza para menos.',
      exito: 'Un activo legal 100% transferible a su familia. Algo que sus hijos puedan heredar.',
    },
    {
      label: 'Latino en el Extranjero · Diáspora Global',
      dolor: 'Construye solo donde vive, sin una forma de generar ingresos en su país de origen.',
      exito: 'Un ingreso anclado a su país de origen, que usted dirige desde donde vive.',
    },
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 24px', background: 'rgba(13,13,13,0.8)' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            Según quién sea usted
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "var(--font-serif)", color: '#fff' }}>
            ¿En cuál de estos se reconoce?
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
// TRES CAMINOS — dos salidas que fallan + el tercer camino (narrado, estilo servilleta)
// ============================================================================

function SolucionesFallidasSection() {
  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold }}>
            Tres Caminos
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "var(--font-serif)", color: '#fff', lineHeight: 1.25 }}>
            Frente a esto, casi todos toman el camino que no lleva a ningún lado.
          </h2>
        </div>

        {/* Las dos salidas que fallan (narrado) */}
        <div style={{
          padding: '28px 32px', marginBottom: '20px',
          background: 'rgba(0,0,0,0.65)', borderLeft: `3px solid rgba(255,255,255,0.12)`,
          borderRadius: 'var(--radius-container)',
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: C.muted, margin: 0 }}>
            Cuando uno ve el problema, el instinto da dos respuestas — y las dos fallan.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: C.muted, margin: '20px 0 0' }}>
            La primera: <strong style={{ color: C.white, fontWeight: 600 }}>trabajar más duro</strong>. Más horas, más clientes, más esfuerzo. Pero eso solo lo hace pedalear más rápido en la misma bicicleta: su ingreso sigue dependiendo de que usted esté ahí.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: C.muted, margin: '20px 0 0' }}>
            La segunda: <strong style={{ color: C.white, fontWeight: 600 }}>montar otro negocio</strong>. Y casi siempre sale peor — cambia un jefe por mil clientes, y ahora ni el negocio camina sin usted.
          </p>
        </div>

        {/* El tercer camino (destacado) */}
        <div style={{
          padding: '28px 32px',
          background: 'rgba(197, 160, 89,0.06)', border: `1px solid ${C.gold}`,
          borderRadius: 'var(--radius-container)',
        }}>
          <span style={{ fontSize: '0.7rem', fontFamily: "var(--font-mono)", letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, display: 'block', marginBottom: '12px' }}>
            El tercer camino
          </span>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: C.white, margin: 0 }}>
            Es el único que de verdad lo libera. No es trabajar más, ni dejar lo que hace hoy. Es <strong style={{ color: C.gold, fontWeight: 600 }}>construir algo que trabaje por usted</strong>: un <strong style={{ color: C.gold, fontWeight: 600 }}>negocio digital</strong> que sigue produciendo aunque usted descanse, viaje o simplemente viva.
          </p>
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
            Pilar 1 · El Respaldo Operativo
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "var(--font-serif)", color: '#fff' }}>
            Un activo sólido descansa siempre sobre un consumo que no se detiene.
          </h2>
        </div>

        <div style={{
          padding: '32px 36px', marginBottom: '32px',
          background: 'rgba(0,0,0,0.65)', borderLeft: `3px solid ${C.gold}`,
          borderRadius: 'var(--radius-container)',
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: C.muted, margin: 0 }}>
            Su negocio digital monetiza un hábito que las personas ya tienen:{' '}
            <span style={{ color: C.white }}>el café de cada mañana.</span>{' '}
            Solo que el nuestro lleva dentro <strong style={{ color: C.gold, fontWeight: 600 }}>Ganoderma</strong> —el hongo más estudiado del planeta—, en un extracto que el cuerpo asimila por completo. No le pedimos a nadie cambiar su rutina; solo que el café de siempre <span style={{ color: C.white }}>trabaje a su favor.</span> Y detrás está <strong style={{ color: C.gold, fontWeight: 600 }}>Gano Excel</strong>: la empresa real que lo fabrica y lo entrega en <strong style={{ color: C.gold, fontWeight: 600 }}>70 países.</strong>
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
            Un hábito que no cambia genera un ingreso que no se detiene.
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
          La cifra que pocos miran
        </span>

        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontFamily: "var(--font-serif)", color: '#fff', marginTop: '16px', marginBottom: '24px' }}>
          ¿Cuántos meses podría sostener su estilo de vida si dejara de trabajar hoy?
        </h2>

        <div style={{
          display: 'inline-block', padding: '24px 40px',
          background: 'rgba(0,0,0,0.65)', border: `1px solid rgba(197, 160, 89,0.3)`,
          marginBottom: '32px',
          borderRadius: 'var(--radius-container)',
        }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: '1rem', color: C.cyan, margin: 0, lineHeight: 1.8 }}>
            Ahorros ÷ Gastos del mes{' '}
            <span style={{ color: C.muted }}>=</span>{' '}
            <span style={{ color: C.gold, fontWeight: 700 }}>Meses de autonomía</span>
          </p>
        </div>

        <p style={{ color: C.muted, marginBottom: '40px', maxWidth: '580px', margin: '0 auto 40px', lineHeight: 1.75 }}>
          No lo deje a la intuición. Es una cifra exacta — y conocerla con precisión cambia las decisiones que tome desde hoy.{' '}
          <span style={{ color: C.white, fontWeight: 500 }}>Le toma un minuto.</span>
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <Link href="/calculadora" className="cta-base cta-primary">
            Calcular mi número →
          </Link>
          <Link href="/negocio-digital" className="cta-base cta-secondary">
            Omitir y empezar el Diagnóstico →
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
      titulo: 'COMANDO EXPANDIR — Llega a las personas correctas',
      desc: 'Usted no explica — Queswa explica. Usted solo abre los canales para que lleguen las personas correctas; explicar y presentar se lo deja a Queswa.',
    },
    {
      titulo: 'COMANDO ACTIVAR — Filtra y califica por usted, 24/7',
      desc: 'Queswa procesa el tráfico, neutraliza objeciones y madura la decisión por usted. Usted recibe a un interesado ya listo.',
    },
    {
      titulo: 'COMANDO MAESTRÍA — Multiplica sin que usted enseñe',
      desc: 'Usted no enseña; Queswa escala. A cada persona nueva que entra a su organización la forma el sistema desde el día uno, sin consumir su agenda.',
    },
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            Pilar 2 · El Centro de Mando
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', marginBottom: '20px', fontFamily: "var(--font-serif)", color: '#fff' }}>
            Queswa: su Centro de Mando.
          </h2>
          <p style={{ fontSize: '1rem', color: C.muted, maxWidth: '620px', margin: '0 auto', lineHeight: 1.8 }}>
            Queswa es la plataforma de inteligencia artificial que ejecuta <span style={{ color: C.gold, fontWeight: 600 }}>El Método Comprobado</span>: tres comandos que le quitan de encima el trabajo pesado.{' '}
            <span style={{ color: C.white }}>Mientras usted dirige, Queswa atiende y filtra a los interesados las 24 horas, y los conecta con Gano Excel —fábricas, inventarios y despachos en 70 países—. Entre las dos cargan el</span>{' '}
            <span style={{ color: C.gold, fontWeight: 600 }}>90% del trabajo</span>{' '}
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
            Solicitar una Demostración →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VISIÓN — la semilla "futuro absurdo / la norma" (eco del cierre de la servilleta)
// ============================================================================
function VisionSection() {
  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, marginBottom: '16px' }}>
          Hacia dónde vamos
        </p>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontFamily: "var(--font-serif)", color: '#fff', marginBottom: '20px' }}>
          Pronto será la norma.
        </h2>
        <p style={{ fontSize: '1.05rem', color: C.muted, lineHeight: 1.8, maxWidth: '620px', margin: '0 auto' }}>
          Que su economía dependa únicamente de sus horas se verá, pronto, tan absurdo como hoy se ve
          una casa sin internet.{' '}
          <span style={{ color: C.white }}>Tener un ingreso que no dependa de su presencia ya existe.
          CreaTuActivo.com ya existe.</span>{' '}
          <span style={{ color: C.gold, fontWeight: 600 }}>La única variable que falta en la ecuación es usted.</span>
        </p>
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
          El siguiente paso
        </p>

        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', fontFamily: "var(--font-serif)", color: '#fff', marginBottom: '12px' }}>
          El Diagnóstico de 5 Días
        </h2>

        <p style={{ fontSize: '1rem', color: C.muted, marginBottom: '32px', fontStyle: 'italic', fontFamily: "var(--font-serif)" }}>
          5 días para ver, con números, qué tan frágil es su modelo actual.
        </p>

        <div style={{
          padding: '24px 32px', marginBottom: '40px',
          background: 'rgba(0,0,0,0.5)', borderLeft: `2px solid rgba(197, 160, 89,0.3)`,
          textAlign: 'left',
        }}>
          <p style={{ color: C.muted, lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>
            Si reconoció su punto ciego, el siguiente paso es auditar sus propios números.{' '}
            <span style={{ color: C.white }}>La activación de su negocio digital no es masiva: es para quien está listo para resolver el problema financiero de raíz.</span>{' '}
            <span style={{ color: C.gold, fontWeight: 600 }}>Determine usted si su estructura de ingresos requiere este nivel hoy.</span>
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          <Link href="/negocio-digital" className="cta-base cta-primary">
            Iniciar el Diagnóstico de 5 Días →
          </Link>
          <Link href="/calculadora" className="cta-base cta-secondary">
            Calcular mi número →
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
          <p style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", color: C.muted }}>Construcción de Ingresos Recurrentes</p>
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
