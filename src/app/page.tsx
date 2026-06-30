/**
 * Copyright © 2026 CreaTuActivo.com
 * Homepage v13.7 — "Lo difícil ya está hecho" (30 jun 2026): sección "Cómo lo hacemos
 * nosotros" → eyebrow "Lo difícil ya está hecho" (quita el "nosotros" de pitch); intro a
 * primeros principios (alguien la fabrica / algo la atiende / usted sabe qué hacer → ya
 * resueltas, sin "le entregamos"); bisagra "Usted no entra a Gano Excel: Gano Excel trabaja
 * para usted". Sincroniza con servilleta v5.7 (Gano se USA, no se entra).
 * Previo v13.6 — "empresa digital" (12 jun 2026): cuando la Home habla en primera
 * persona del activo que entregamos ("ser dueño de una empresa digital", "su empresa
 * digital"), el término es EMPRESA digital — eleva estatus de propiedad (decisión Luis).
 * "Negocio" solo aparece en el chip canónico ("¿Cómo funciona el modelo de negocio?" —
 * Camino A, "modelo de negocio" = estructura/industria, NO la tienda; sincronizar 3 keys si
 * se cambia) y en referencias al negocio ACTUAL del visitante.
 * Cuerpo del hero condensado (~70% solapaba con el reel manifiesto — el texto ahora
 * sella la tesis, no la repite). Previo v13.5 — Negocio digital (jun 2026): "Base Operativa" → "negocio digital" · "el sistema opera" → "el sistema hace el trabajo" · operar/escalar/"gente" ajustados. Previo v13.4 — Recalibración léxica accesible: "Estructura Patrimonial" → "ingresos recurrentes", "La Matriz Física" → "El Respaldo Operativo", "Tridente EAM" → "El Método Comprobado", "Arquitecto de Patrimonio" → "Propietario", "gobernanza" → "dirige". Alinea la home con WHY_01/WHY_02/EAM_01 + servilleta. Nombres de funnel (Auditoría Patrimonial, Prueba de Estrés) preservados.
 * Lujo Clínico / McKinsey Tone — Brendan Kane + Eugene Schwartz + Oren Klaff
 * Aliado canónico: Servilleta v3.1 + System Prompt v26.5 + Arsenal Inicial v25.3
 */

import Link from 'next/link';
import Image from 'next/image';
import StrategicNavigation from '@/components/StrategicNavigation';
import CognitiveLoadComparator from '@/components/CognitiveLoadComparator';
import TridenteAphorisms from '@/components/TridenteAphorisms';
import HomeManifestoVideo from '@/components/HomeManifestoVideo';
import QueswaCTAButton from '@/components/QueswaCTAButton';
import { HOME_MANIFESTO_VIDEO, HOME_MANIFESTO_POSTER } from '@/lib/reels';

export const dynamic = 'force-static';

export const metadata = {
  title: 'CreaTuActivo | Sea dueño de su empresa digital',
  description: 'La solución no es trabajar más duro: sea dueño de una empresa digital que trabaja por usted, en paralelo a lo que ya hace, y le genera ingresos una y otra vez. Hoy, gracias a la inteligencia artificial, cualquiera puede tenerla.',
  openGraph: {
    title: 'Sea dueño de su propia empresa digital',
    description: 'Un negocio que vive en internet y trabaja por usted, en paralelo a lo que ya hace. Hoy, gracias a la inteligencia artificial, cualquiera puede tenerla.',
    url: 'https://creatuactivo.com',
  },
  twitter: {
    title: 'Sea dueño de su propia empresa digital',
    description: 'Un negocio que vive en internet y trabaja por usted, en paralelo a lo que ya hace. Hoy, gracias a la inteligencia artificial, cualquiera puede tenerla.',
  },
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
        <EmpresaDigitalSection />
        <PerfilesSection />
        <ComoLoHacemosIntro />
        <ProductoFisicoSection />
        <QueswaDiferenciadorSection />
        <MetodoSection />
        <TridenteAphorisms />
        <SolutionPreview />
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
  // El nav es sticky (en flujo): el padding-top ES el gap visible nav→video.
  // 30px arriba (el video abre la página, pegado al menú); el aire generoso
  // va entre el video y el H1 (60px en el wrapper del video).
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '30px 24px 64px' }}>
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
        {/* Video manifiesto 9:16 — ES el encabezado de la página (decisión Jun 2026:
            el video reemplaza al texto como apertura; el brand del nav ya posiciona).
            Al terminar se desvanece y abre Queswa con foco en el input. */}
        <div style={{ marginBottom: '90px' }}>
          <HomeManifestoVideo src={HOME_MANIFESTO_VIDEO} poster={HOME_MANIFESTO_POSTER} />
        </div>

        {/* H1 — debajo del video (SEO/a11y: sigue siendo el único h1 de la página) */}
        <h1 style={{
          fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)', lineHeight: 1.1,
          marginBottom: '32px',
          fontFamily: "var(--font-sans)",
          fontWeight: 700, color: C.gold,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          textShadow: '0 2px 12px rgba(0,0,0,0.9)',
        }}>
          Sea dueño de su empresa digital
        </h1>

        {/* Hook de diagnóstico */}
        <p style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', lineHeight: 1.4,
          marginBottom: '48px', color: C.white, fontWeight: 500,
          fontFamily: "var(--font-serif)",
          textShadow: '0 2px 10px rgba(0,0,0,0.9)',
        }}>
          Usted no tiene un problema de ingresos.{' '}
          <span style={{ color: C.gold }}>Tiene un punto ciego — y casi nadie lo ve hasta que es tarde.</span>
        </p>

        {/* Cuerpo */}
        <div style={{
          background: 'rgba(0,0,0,0.70)', padding: '20px 28px', marginBottom: '48px',
          borderLeft: `2px solid rgba(197, 160, 89,0.3)`,
        }}>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: C.muted, maxWidth: '600px', margin: '0 auto' }}>
            La solución no es trabajar más, ni dejar lo que hace hoy:{' '}
            <span style={{ color: C.white }}>es ser dueño de una <strong style={{ color: C.gold }}>empresa digital</strong> que le genera <strong style={{ color: C.gold }}>ingresos recurrentes</strong>, que se multiplica con un clic y que no depende de su presencia. Usted dirige; la tecnología hace el trabajo.</span>
          </p>
        </div>

        {/* CTA primario — conversación frictionless (NO funnel): despierta interés → 1-a-1 */}
        <QueswaCTAButton className="cta-base cta-primary">
          Hablar con Queswa, sin compromiso →
        </QueswaCTAButton>

        {/* Micro-copy */}
        <p style={{
          marginTop: '16px', fontSize: '0.78rem', color: C.muted,
          fontFamily: "var(--font-mono)", letterSpacing: '0.1em',
          textShadow: '0 1px 8px rgba(0,0,0,1)',
        }}>
          Le explica de qué se trata · Usted pregunta lo que quiera
        </p>

        {/* Link secundario */}
        <p style={{ marginTop: '20px', fontSize: '0.85rem', color: C.muted, textShadow: '0 1px 8px rgba(0,0,0,1)' }}>
          ¿Empresa digital activa?{' '}
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
            Destapemos el verdadero problema que estamos resolviendo.
          </h2>
        </div>

        {/* Narración del villano (estilo NuBank: detalles vividos, sin etiqueta) */}
        <div style={{
          padding: '28px 32px', marginBottom: '24px',
          background: 'rgba(0,0,0,0.65)', borderLeft: `3px solid ${C.gold}`,
          borderRadius: 'var(--radius-container)',
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: C.muted, margin: 0 }}>
            Usted trabaja duro. Entrega <strong style={{ color: C.white, fontWeight: 600 }}>sus mejores años y su salud.</strong> Y aun así, vive en el mismo ciclo, mes a mes: <strong style={{ color: C.white, fontWeight: 600 }}>trabajar, pagar cuentas y volver a empezar.</strong>
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: C.muted, margin: '20px 0 0' }}>
            Esto no sucede por falta de capacidad o esfuerzo de su parte. Es la <strong style={{ color: C.white, fontWeight: 600 }}>consecuencia matemática</strong> de un sistema diseñado para tomar sus mejores años y su salud, no para darle seguridad financiera. <strong style={{ color: C.gold, fontWeight: 600 }}>Un modelo donde el éxito de hoy no le garantiza ninguna estabilidad mañana.</strong>
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
      exito: 'Ingresos que llegan aunque el local esté cerrado. Una empresa digital que crece mientras usted atiende su negocio actual.',
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
// CÓMO LO HACEMOS NOSOTROS — la decisión (desde cero vs. apalancamiento) +
// intro a los 3 pilares (modelado en el Slide 1 de la servilleta)
// ============================================================================

function ComoLoHacemosIntro() {
  return (
    <section style={{ position: 'relative', padding: '80px 24px 40px' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold }}>
            Lo difícil ya está hecho
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "var(--font-serif)", color: '#fff', lineHeight: 1.25 }}>
            Constrúyala desde cero… o apaláncese en lo que ya está hecho.
          </h2>
        </div>

        <div style={{
          padding: '28px 32px',
          background: 'rgba(0,0,0,0.65)', borderLeft: `3px solid ${C.gold}`,
          borderRadius: 'var(--radius-container)',
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: C.muted, margin: 0 }}>
            Levantar una empresa digital exige que <strong style={{ color: C.white, fontWeight: 600 }}>tres cosas sean ciertas: que alguien la fabrique, que algo la atienda, y que usted sepa qué hacer</strong>. Hacerlo solo significa años, ingenieros y capital — el muro que frena a todo empresario. Aquí <span style={{ color: C.white }}>las tres ya están resueltas: usted no la construye, la dirige.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ¿QUÉ ES UNA EMPRESA DIGITAL? — el concepto nuclear (Amazon/MercadoLibre) +
// negocio vs. empresa (McDonald's) + multiplicar con un clic. Cierra el hueco
// "qué es eso" y abre el "cómo lo hacemos nosotros".
// ============================================================================

function EmpresaDigitalSection() {
  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            ¿Qué es una empresa digital?
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "var(--font-serif)", color: '#fff', lineHeight: 1.25 }}>
            Usted es dueño del sistema. No empaca las cajas.
          </h2>
        </div>

        {/* Beat 1 — Amazon / MercadoLibre */}
        <div style={{
          padding: '28px 32px', marginBottom: '20px',
          background: 'rgba(0,0,0,0.65)', borderLeft: `3px solid ${C.gold}`,
          borderRadius: 'var(--radius-container)',
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: C.muted, margin: 0 }}>
            Jeff Bezos no se hizo rico empacando libros: construyó <strong style={{ color: C.white, fontWeight: 600 }}>la empresa digital donde se venden millones cada día</strong>. MercadoLibre no fabrica lo que vende — es dueño del sistema que conecta y distribuye. Eso es una empresa digital: <span style={{ color: C.white }}>usted es dueño del sistema, no el que carga las cajas.</span>
          </p>
        </div>

        {/* Beat 2 — el ejemplo (sonrisaslindas.app, como el reel) */}
        <div style={{
          padding: '28px 32px', marginBottom: '20px',
          background: 'rgba(197, 160, 89,0.06)', border: `1px solid ${C.gold}`,
          borderRadius: 'var(--radius-container)',
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: C.muted, margin: 0 }}>
            Imagínelo en su propia ciudad. Hoy muchas personas quieren una sonrisa más bonita; usted podría crear <strong style={{ color: C.gold, fontWeight: 600 }}>sonrisaslindas.app</strong> y conectar a las clínicas con quienes las buscan. Por cada cita que pasa por ahí, usted gana una pequeña comisión — sin ser el odontólogo, sin tener la silla. <span style={{ color: C.white }}>Usted es el puente.</span>
          </p>
        </div>

        {/* Cierre — bridge a Perfiles */}
        <p style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)', lineHeight: 1.6, color: C.white, textAlign: 'center', fontFamily: "var(--font-serif)", margin: '8px 0 0' }}>
          Eso es una empresa digital. La pregunta ya no es qué es — <strong style={{ color: C.gold, fontWeight: 600 }}>es si es para usted.</strong>
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// PRODUCTO FÍSICO — Aterrizaje del consumo recurrente tangible
// ============================================================================

function ProductoFisicoSection() {
  return (
    <section style={{ position: 'relative', padding: '80px 24px', background: 'rgba(13,13,13,0.8)' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            El Respaldo Operativo
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', fontFamily: "var(--font-serif)", color: '#fff' }}>
            Gano Excel, su socio de infraestructura.
          </h2>
        </div>

        <div style={{
          padding: '32px 36px', marginBottom: '32px',
          background: 'rgba(0,0,0,0.65)', borderLeft: `3px solid ${C.gold}`,
          borderRadius: 'var(--radius-container)',
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: C.muted, margin: 0 }}>
            Construir esto solo —fábricas, inventario millonario, permisos y logística en cada país— tomaría años. Su <span style={{ color: C.white }}>socio logístico y financiero</span> ya lo hizo: <strong style={{ color: C.gold, fontWeight: 600 }}>Gano Excel</strong>, una corporación con más de <strong style={{ color: C.gold, fontWeight: 600 }}>30 años</strong> y presencia en <strong style={{ color: C.gold, fontWeight: 600 }}>70 países</strong> que fabrica, asume el costo del inventario, responde por lo legal y despacha el producto en cada país. No es una promesa de internet — es <span style={{ color: C.white }}>músculo real, de su lado.</span> <span style={{ color: C.white }}>Usted no entra a Gano Excel: Gano Excel trabaja para usted.</span> Gracias a él usted no construye nada: <span style={{ color: C.white }}>empieza hoy</span> y se dedica a dirigir.
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
            Usted no necesita una fábrica. Necesita un socio que ya la tenga.
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
          <QueswaCTAButton className="cta-base cta-secondary">
            Hablar con Queswa →
          </QueswaCTAButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// QUESWA DIFERENCIADOR
// ============================================================================

function QueswaDiferenciadorSection() {
  return (
    <section style={{ position: 'relative', padding: '80px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            El Centro de Mando
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', marginBottom: '20px', fontFamily: "var(--font-serif)", color: '#fff' }}>
            Queswa, su socio de tecnología.
          </h2>
          <p style={{ fontSize: '1rem', color: C.muted, maxWidth: '620px', margin: '0 auto', lineHeight: 1.8 }}>
            Queswa es la plataforma de inteligencia artificial que hace por usted el trabajo más desgastante.{' '}
            <span style={{ color: C.white }}>Mientras usted dirige, Queswa explica, atiende y madura en cada interesado la decisión de avanzar, las 24 horas, y los conecta con Gano Excel —fábricas, inventarios y despachos en 70 países—. Entre las dos cargan el</span>{' '}
            <span style={{ color: C.gold, fontWeight: 600 }}>90% del trabajo</span>{' '}
            <span style={{ color: C.white }}>por usted.</span>
          </p>
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
// PILAR 3 · EL MÉTODO COMPROBADO — los 3 comandos (Expandir·Activar·Multiplicar)
// promovidos a su propio pilar (antes escondidos como "capacidades de Queswa")
// ============================================================================

function MetodoSection() {
  const pasos = [
    {
      n: '01', paso: 'EXPANDIR', titulo: 'Llegar a las personas correctas',
      desc: 'Usted abre los canales; explicar y presentar se lo deja a Queswa.',
      aforismo: 'Usted comparte; su alcance se vuelve masivo.',
    },
    {
      n: '02', paso: 'ACTIVAR', titulo: 'Conversar y madurar la decisión',
      desc: 'Queswa conversa con cada interesado, aporta claridad, resuelve dudas y madura su decisión de avanzar, las 24 horas.',
      aforismo: 'Usted recibe al interesado y estrecha su mano — la calidez que solo un humano puede dar.',
    },
    {
      n: '03', paso: 'MULTIPLICAR', titulo: 'Crecer sin que usted enseñe',
      desc: 'A cada persona nueva la forma Queswa desde el día uno, sin consumir su agenda.',
      aforismo: 'Usted no enseña; Queswa multiplica. Usted crece.',
    },
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 24px', background: 'rgba(13,13,13,0.8)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "var(--font-mono)", letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>
            El Método Comprobado
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', marginBottom: '20px', fontFamily: "var(--font-serif)", color: '#fff' }}>
            Un método ya probado. Usted no improvisa.
          </h2>
          <p style={{ fontSize: '1rem', color: C.muted, maxWidth: '620px', margin: '0 auto', lineHeight: 1.8 }}>
            Tres pasos automatizados que le ahorran el ensayo y el error. El método le da el camino exacto para hacer crecer su empresa digital.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {pasos.map((p) => (
            <div key={p.paso} style={{
              padding: '24px',
              background: C.bgCard,
              border: `1px solid rgba(197, 160, 89,0.15)`,
              borderRadius: 'var(--radius-container)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: '0.8rem', color: C.cyan }}>{p.n}</span>
                <span style={{ color: C.gold, fontFamily: "var(--font-sans)", fontSize: '0.95rem', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600 }}>{p.paso}</span>
              </div>
              <h3 style={{ color: C.white, fontFamily: "var(--font-serif)", fontSize: '1.05rem', marginBottom: '10px', lineHeight: 1.3 }}>
                {p.titulo}
              </h3>
              <p style={{ color: C.muted, fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 14px' }}>{p.desc}</p>
              <p style={{ color: C.body, fontSize: '0.85rem', lineHeight: 1.5, margin: 0, fontFamily: "var(--font-serif)", fontStyle: 'italic', borderTop: `1px solid ${C.bgCardBorder}`, paddingTop: '12px' }}>
                &ldquo;{p.aforismo}&rdquo;
              </p>
            </div>
          ))}
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
          Que su economía no tenga el ingreso que una empresa digital puede darle se verá tan absurdo
          como hoy se ve una casa sin internet.{' '}
          <span style={{ color: C.white }}>Ser dueño de una empresa digital que le genera ingresos recurrentes ya existe.
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
          El siguiente paso es una conversación.
        </h2>

        <p style={{ fontSize: '1rem', color: C.muted, marginBottom: '32px', fontStyle: 'italic', fontFamily: "var(--font-serif)" }}>
          Sin formularios, sin compromiso. Pregunte lo que quiera y véalo usted mismo.
        </p>

        <div style={{
          padding: '24px 32px', marginBottom: '40px',
          background: 'rgba(0,0,0,0.5)', borderLeft: `2px solid rgba(197, 160, 89,0.3)`,
          textAlign: 'left',
        }}>
          <p style={{ color: C.muted, lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>
            Si se reconoció en todo esto, el siguiente paso no es llenar nada.{' '}
            <span style={{ color: C.white }}>Queswa le explica de qué se trata, responde lo que quiera, las 24 horas — y si decide avanzar, lo conecta con una persona del equipo.</span>{' '}
            <span style={{ color: C.gold, fontWeight: 600 }}>Sin presión: usted decide a qué ritmo.</span>
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          <QueswaCTAButton className="cta-base cta-primary">
            Hablar con Queswa →
          </QueswaCTAButton>
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
