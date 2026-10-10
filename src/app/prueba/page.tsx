/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /prueba — HOME v18 candidata — «Un solo eje» (8 oct 2026) · aprobada por el Director el
 *   mismo día y promovida a la Home (src/app/page.tsx)
 *
 * Mismo texto que la Home v17, palabra por palabra. Cambia la ESTRUCTURA, tras la
 * auditoría del 8 oct (Director: «el botón inicial, tabulado a la izquierda, no es
 * correcto»). El botón no fallaba por estar a la izquierda —en computador es lo que pide
 * un texto alineado a la izquierda—: fallaba porque no compartía eje con nada, y en
 * celular porque quedaba fuera de la primera pantalla.
 *
 * 1. UN SOLO EJE. En computador la página tenía cuatro bordes izquierdos (logo 108 px ·
 *    hero 156 · secciones 286 · credo 336). Ahora todo vive en el contenedor del menú
 *    (`EJE`, el mismo de StrategicNavigation) y el texto arranca donde arranca el logo.
 * 2. EL HERO SEGÚN EL ANCHO. Computador: texto a la izquierda, centrado en vertical
 *    frente al video (antes, debajo del botón quedaba un vacío). Tableta: una columna
 *    centrada (antes, título a la izquierda, video centrado y botón a la izquierda).
 *    Celular: título → frase → botón → video, para que el botón entre en la primera
 *    pantalla (antes caía a 1.113 px en un iPhone de 844).
 *    ⚠️ Esto cambia el orden del 1 oct («el título primero y el video justo debajo»). El
 *    objetivo de esa decisión era el botón en la primera pantalla, y en celular no se
 *    cumplía. Queswa sabe si la persona vio el video y ajusta la apertura, así que tocar
 *    el botón antes de verlo no rompe nada.
 * 3. LAS FUENTES DEL SISTEMA. --font-serif y --font-mono llegaban vacías en todo el sitio
 *    (se declaran en :root y next/font ponía sus variables en <body>). Esta candidata las
 *    redefinía en su contenedor; al aprobarse, el arreglo pasó a layout.tsx para todo el
 *    sitio y la redefinición local salió.
 * 4. LÍNEAS DE 36em (~75 caracteres). Los párrafos iban a ~107 por línea (Baymard: 50–75).
 * 5. LOS TRES ELEMENTOS, EN TRES. Se veían 2 + 1 con un hueco: cada tarjeta pedía 280 px
 *    y en 860 cabían dos.
 * 6. QUESWA ENTRE LAS DOS. En «Qué hace usted» iba después de Compartir y Recibir; el
 *    texto dice «Entre las dos está Queswa» y la doctrina lo pone entre una y otra.
 *
 * La historia de versiones del TEXTO vive en src/app/page.tsx. El noindex, en layout.tsx.
 */

import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  Coffee,
  Factory,
  Landmark,
  Bot,
  Share2,
  Handshake,
  Check,
  Route,
} from 'lucide-react'
import StrategicNavigation from '@/components/StrategicNavigation'
import QueswaCTAButton from '@/components/QueswaCTAButton'
import VideoComoFuncionaHome from '@/components/VideoComoFuncionaHome'

export const dynamic = 'force-static'

const GOLD = 'var(--color-brand)'
const TITANIUM = 'var(--color-titanium)'
const DATA = 'var(--color-data)'
const TEXTURE = "url('/images/servilleta/hormigon-tile.webp')"

/** El eje de la página: el contenedor del menú (80rem, con 1 / 1.5 / 2rem a los lados). */
const EJE = 'mx-auto w-full max-w-[80rem] px-4 sm:px-6 lg:px-8'

/** La medida del texto corrido: ~75 caracteres por línea, escala con la letra. */
const MEDIDA = '36em'

/** Ancho de los módulos que se leen de arriba abajo (Compartir · Queswa · Recibir). */
const MEDIDA_MODULO = '46rem'

const heroBodyStyle = {
  fontSize: 'clamp(1.05rem, 2.4vw, 1.25rem)',
  lineHeight: 1.65,
  color: 'var(--color-text-body)',
  margin: '0 0 1.1rem',
  maxWidth: MEDIDA,
} as const

// ─── Primitivas ────────────────────────────────────────────────────────────────

function Section({
  children,
  elevated = false,
  id,
}: {
  children: ReactNode
  elevated?: boolean
  id?: string
}) {
  return (
    <section
      id={id}
      style={{
        background: elevated
          ? `linear-gradient(rgba(21,23,28,0.94), rgba(21,23,28,0.94)), ${TEXTURE}`
          : 'var(--color-bg-primary)',
        backgroundSize: elevated ? 'auto, 200px 200px' : undefined,
        borderTop: '1px solid rgba(148,163,184,0.12)',
        padding: '5rem 0',
      }}
    >
      <div className={EJE}>{children}</div>
    </section>
  )
}

/** Eyebrow = label técnico en mono → cian (el dato). */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontSize: '0.72rem',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        color: DATA,
        marginBottom: '1rem',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {children}
    </p>
  )
}

function H2({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <h2
      className="text-balance"
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
        lineHeight: 1.3,
        color: 'var(--color-text-primary)',
        margin: center ? '0 auto 1.5rem' : '0 0 1.5rem',
        maxWidth: '22em',
        textAlign: center ? 'center' : undefined,
      }}
    >
      {children}
    </h2>
  )
}

function Body({ children, mt = false }: { children: ReactNode; mt?: boolean }) {
  return (
    <p
      style={{
        fontSize: '1.05rem',
        lineHeight: 1.75,
        color: 'var(--color-text-body)',
        marginTop: mt ? '1.25rem' : 0,
        maxWidth: MEDIDA,
      }}
    >
      {children}
    </p>
  )
}

const Strong = ({ children }: { children: ReactNode }) => (
  <strong style={{ color: 'var(--color-text-primary)' }}>{children}</strong>
)

/** Icono en círculo tintado — titanio por defecto (estructura); `tone` cambia el rol. */
function IconTile({
  icon: Icon,
  tone = 'titanium',
  size = 44,
}: {
  icon: typeof Coffee
  tone?: 'titanium' | 'data' | 'gold' | 'success'
  size?: number
}) {
  const color =
    tone === 'data' ? DATA : tone === 'gold' ? GOLD : tone === 'success' ? 'var(--color-success)' : TITANIUM
  const tint =
    tone === 'data'
      ? 'rgba(34,211,238,0.08)'
      : tone === 'gold'
        ? 'rgba(197,160,89,0.12)'
        : tone === 'success'
          ? 'rgba(64,138,113,0.14)'
          : 'rgba(148,163,184,0.1)'
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        background: tint,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon style={{ width: size * 0.5, height: size * 0.5, color }} strokeWidth={1.6} />
    </div>
  )
}

/** El punto que pulsa del widget de Queswa: "la máquina está despierta". */
function QueswaOnline({
  label = 'Queswa · en línea',
  compacto = false,
}: {
  label?: string
  /** Menos espaciado: en Roboto Mono la etiqueta larga parte en dos dentro de una tarjeta. */
  compacto?: boolean
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        letterSpacing: compacto ? '0.06em' : '0.15em',
        whiteSpace: compacto ? 'nowrap' : undefined,
        textTransform: 'uppercase',
        color: DATA,
      }}
    >
      <span
        className="animate-pulse"
        style={{ width: 6, height: 6, borderRadius: '50%', background: DATA, flexShrink: 0 }}
      />
      {label}
    </span>
  )
}

const cardStyle = {
  background: 'var(--color-bg-surface)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  padding: '1.5rem',
} as const

const etiquetaMono = {
  margin: 0,
  fontFamily: 'var(--font-mono)',
  fontSize: '0.68rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--color-text-muted)',
} as const

/** Una de las dos acciones de «Qué hace usted». */
function Movimiento({
  n,
  icon,
  t,
  d,
}: {
  n: string
  icon: typeof Coffee
  t: string
  d: string
}) {
  return (
    <div
      style={{
        ...cardStyle,
        display: 'flex',
        gap: '1.25rem',
        padding: '1.75rem',
        alignItems: 'flex-start',
      }}
    >
      <IconTile icon={icon} size={48} />
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: GOLD }}>{n}</span>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {t}
          </h3>
        </div>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--color-text-body)', margin: 0 }}>{d}</p>
      </div>
    </div>
  )
}

/** El trazo cian que une las dos acciones a través de Queswa. */
const Trazo = () => (
  <span aria-hidden="true" style={{ width: 1, flex: 1, minHeight: 14, background: 'rgba(34,211,238,0.35)' }} />
)

// ─── Página ────────────────────────────────────────────────────────────────────

export default function PruebaPage() {
  return (
    // <div> y no <main>: el layout ya envuelve cada página en un <main>, y dos anidados
    // no son HTML válido (los lectores de pantalla anuncian dos regiones principales).
    <div style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
      <StrategicNavigation />

      {/* ═══ HERO — un eje y un orden por ancho (8 oct 2026) ═══ */}
      {/* Celular: título → frase → botón → video, todo al borde del logo y el botón a
          lo ancho. Tableta: la misma columna, centrada, porque el video va centrado.
          Computador: texto a la izquierda centrado en vertical frente al video, y el
          video contra el borde derecho del eje (donde termina «Suscríbete»). */}
      <section
        className="pt-10 pb-16 md:pt-14 lg:pt-24 lg:pb-24"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 30% 0%, rgba(148,163,184,0.09) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 75% 10%, rgba(197,160,89,0.07) 0%, transparent 65%), var(--color-bg-primary)',
        }}
      >
        <div className={`${EJE} grid grid-cols-1 gap-y-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:gap-x-16`}>
          <div className="md:text-center lg:text-left">
            <h1
              className="m-0 text-balance md:mx-auto lg:mx-0"
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                fontSize: 'clamp(2.1rem, 4.2vw, 3rem)',
                lineHeight: 1.12,
                color: 'var(--color-text-primary)',
                maxWidth: '15em',
              }}
            >
              Sea dueño de un sistema de distribución que no depende de que usted esté
              encima.
            </h1>

            <p
              className="mt-6 mb-8 md:mx-auto lg:mx-0"
              style={{
                fontSize: 'clamp(1.1rem, 1.8vw, 1.3rem)',
                lineHeight: 1.6,
                color: 'var(--color-text-body)',
                maxWidth: 560,
              }}
            >
              Usted comparte un enlace. Queswa conversa con quien llega. Usted recibe. Todo desde
              el celular.
            </p>

            {/* El video ya explica cómo funciona: el botón pregunta lo que sigue
                (Director, 1 oct 2026), y Queswa sabe si la persona vio el video. */}
            <QueswaCTAButton className="cta-base cta-primary w-full md:w-auto" pregunta="dinero">
              Pregúntele a Queswa cómo entra el dinero
            </QueswaCTAButton>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-center lg:justify-start">
              <QueswaOnline />
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Nuestra inteligencia artificial. Responde al instante, sin compromiso.{' '}
                Colombia · Estados Unidos · Latinoamérica.
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <VideoComoFuncionaHome />
          </div>
        </div>
      </section>

      {/* ═══ EN QUÉ CREEMOS — el credo, al borde del eje ═══ */}
      <section className="py-20 lg:py-32" style={{ background: 'var(--color-bg-primary)' }}>
        <div className={EJE}>
          <Eyebrow>En qué creemos</Eyebrow>

          <p
            className="text-balance"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.5rem, 3.4vw, 2.2rem)',
              lineHeight: 1.35,
              fontWeight: 400,
              color: GOLD,
              margin: '0 0 2rem',
              maxWidth: '22em',
            }}
          >
            Creemos que nadie debería entregar su vida entera al ciclo de trabajar, pagar
            cuentas y repetir. Creemos en empoderar a las personas para que recuperen el
            control de su tiempo y de su dinero.
          </p>

          <p style={heroBodyStyle}>
            Por eso hicimos sencillo lo que antes era complicado: tener su propio sistema de
            distribución de productos premium de bienestar.
          </p>

          <p style={{ ...heroBodyStyle, margin: 0 }}>
            Detrás está Gano Excel, que fabrica y despacha cada pedido: 30 años, más de 60
            países.
          </p>
        </div>
      </section>

      {/* ═══ EL VILLANO NARRADO — texto puro a propósito: esta sección debe pesar ═══ */}
      <Section elevated>
        <Eyebrow>El problema que resolvemos</Eyebrow>
        <H2>Trabajar, pagar cuentas y repetir.</H2>
        <Body>
          Usted trabaja el mes entero. Pero al día siguiente de que le entra la plata, ese
          dinero ya tiene dueño: el banco, las cuotas, los recibos. Y esto no pasa por falta
          de capacidad ni de esfuerzo.{' '}
          <Strong>
            Le pasa exactamente igual al que gana dos millones y al que gana más de veinte.
          </Strong>
        </Body>
        <Body mt>
          A ese ciclo súmele lo que usted no controla: un despido, un semestre malo de
          ventas, una enfermedad. Todo el ingreso colgando de un solo hilo.
        </Body>
        <Body mt>
          No se trata de renunciar a lo que hace hoy, ni de cambiar de vida. Se trata de
          ponerle un ingreso en paralelo a su actividad actual — como cuando actualiza su
          celular: todo lo suyo sigue en su lugar, y su generación de ingresos pasa a otro
          nivel.
        </Body>
      </Section>

      {/* ═══ DE DÓNDE SALE EL DINERO — orden WHY_02 + ecuación visual ═══ */}
      <Section>
        <Eyebrow>De dónde sale el dinero</Eyebrow>
        <H2>Del producto que se vende. De nada más.</H2>
        <Body>
          El producto es concreto —café, bebidas y suplementos premium con Ganoderma—
          y lo fabrica y lo despacha <Strong>Gano Excel</Strong>, una empresa con más de
          30 años y presencia en más de 60 países. Usted no compra inventario ni entrega
          pedidos.
        </Body>
        <Body mt>
          La ganancia sale de las ventas, y de nada más. Cada vez que se vende producto
          por su sistema, a usted le queda un porcentaje, y se lo liquidan en{' '}
          <Strong>su cuenta bancaria cada viernes</Strong>.
        </Body>
        <Body mt>
          Y lo que casi nadie ve a la primera: <Strong>cada cliente que llega por su
          enlace queda a su nombre</Strong>. El que nota la diferencia no vuelve al
          producto genérico: vuelve a pedir el mismo, y esa compra también le paga a
          usted. Ahí es donde el ingreso deja de depender de su presencia y empieza a
          depender de cuántos clientes ya están consumiendo.
        </Body>

        {/* La ecuación: producto + fábrica = porcentaje. Proceso en titanio, resultado
            en dorado (es dinero) con el icono en salvia (transferencia liquidada). */}
        <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            { icon: Coffee, k: 'El producto', v: 'Un producto que se toma' },
            { icon: Factory, k: 'La fábrica', v: 'Una fábrica que se puede visitar' },
          ].map((c) => (
            <div key={c.k} style={cardStyle}>
              <IconTile icon={c.icon} />
              <p style={{ ...etiquetaMono, margin: '1rem 0 0.35rem', letterSpacing: '0.15em' }}>{c.k}</p>
              <p style={{ fontSize: '1.02rem', color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.5 }}>
                {c.v}
              </p>
            </div>
          ))}
          <div
            style={{
              ...cardStyle,
              border: '1px solid rgba(197,160,89,0.45)',
              background: 'linear-gradient(135deg, rgba(197,160,89,0.06), var(--color-bg-surface))',
            }}
          >
            <IconTile icon={Landmark} tone="success" />
            <p style={{ ...etiquetaMono, margin: '1rem 0 0.35rem', letterSpacing: '0.15em', color: GOLD }}>
              El porcentaje
            </p>
            <p style={{ fontSize: '1.02rem', color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.5 }}>
              Un porcentaje que llega al banco cada viernes
            </p>
          </div>
        </div>
      </Section>

      {/* ═══ POR QUÉ AHORA — los tres elementos, en tres columnas + cifras verificables ═══ */}
      <Section elevated>
        <Eyebrow>Por qué ahora sí</Eyebrow>
        <H2>Distribuir siempre fue buen negocio. Lo pesado era todo lo demás.</H2>
        <Body>
          Vender hamburguesas lo puede hacer cualquiera; ser dueño de un McDonald's, casi
          nadie. Distribuir productos que las personas vuelven a pedir siempre ha sido buen
          negocio, y lo difícil nunca fue abrirlo: fue multiplicarlo. Lo que lo hacía
          complicado era atender a cada interesado, uno por uno — y nadie tiene la vida
          para eso.
        </Body>
        {/* «Moderna» va UNA vez en toda la página: ver la nota en src/app/page.tsx. */}
        <Body mt>
          Eso fue lo que cambió: hoy es una empresa de distribución moderna. Usted recibe
          en una sola aplicación los tres elementos que eliminan la fricción de montarla.
        </Body>

        {/* Tres elementos, tres columnas (8 oct 2026): con `auto-fit, minmax(280px)` en
            860 px cabían dos y el tercero quedaba solo, con un hueco al lado. Abajo de
            1024 van apilados, nunca 2 + 1. */}
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.9rem' }}>
              <IconTile icon={Factory} />
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '1.05rem' }}>
                  Gano Excel
                </p>
                <p style={etiquetaMono}>Fabrica y despacha</p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--color-text-body)' }}>
              Las fábricas, el inventario y los despachos. Más de 30 años, más de 60
              países, nueve sedes en Colombia. Usted no compra inventario ni entrega
              pedidos.
            </p>
          </div>

          <div style={{ ...cardStyle, border: '1px solid rgba(34,211,238,0.22)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.9rem' }}>
              <IconTile icon={Bot} tone="data" />
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '1.05rem' }}>
                  Queswa
                </p>
                <QueswaOnline label="Inteligencia artificial · en línea" compacto />
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--color-text-body)' }}>
              Conversa por WhatsApp con cada persona interesada, le resuelve las dudas y
              madura su decisión de avanzar, a toda hora. Usted no le repite lo mismo a
              cada uno.
            </p>
          </div>

          {/* ⚠️ Waze va en MECANISMO, nunca en resultado: «le marca la ruta» ✅ ·
              «lo lleva a donde quiere estar» ⛔. Espejo de WHY_APP_01. */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.9rem' }}>
              <IconTile icon={Route} />
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '1.05rem' }}>
                  Saber qué hacer
                </p>
                <p style={etiquetaMono}>Le marca la ruta</p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--color-text-body)' }}>
              Como en Waze: usted le dice a dónde quiere llegar, y Queswa le va marcando
              la ruta. Usted no arranca solo ni adivinando el siguiente paso.
            </p>
          </div>
        </div>

        {/* Cifras verificables — en titanio claro, no en dorado: son hechos, no premios. */}
        <div
          className="mt-10 grid grid-cols-2 gap-6 pt-8 text-center md:grid-cols-4"
          style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}
        >
          {[
            { n: '30', l: 'años de Gano Excel' },
            { n: '+60', l: 'países' },
            { n: '16', l: 'países donde funciona su sistema' },
            { n: '22', l: 'productos' },
          ].map((s) => (
            <div key={s.l}>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                  color: 'var(--color-text-primary)',
                  margin: '0 0 0.25rem',
                  lineHeight: 1,
                  // Números alineados: Playfair trae por defecto los de estilo antiguo.
                  fontVariantNumeric: 'lining-nums tabular-nums',
                }}
              >
                {s.n}
              </p>
              <p style={etiquetaMono}>{s.l}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ QUÉ HACE USTED — Compartir · Queswa · Recibir ═══ */}
      {/* Queswa va ENTRE las dos (8 oct 2026), unido por un trazo cian, sin número y sin
          tarjeta: no es un tercer movimiento, es quien hace el trabajo de en medio. */}
      <Section>
        <Eyebrow>Qué hace usted</Eyebrow>
        <H2>Dos movimientos. Ninguno le exige dejar lo que hace hoy.</H2>

        <div style={{ maxWidth: MEDIDA_MODULO }}>
          <Movimiento
            n="01"
            icon={Share2}
            t="Compartir"
            d="Usted pasa un enlace a quien quiera. Lo que esa persona recibe ya está preparado: la página, el video y Queswa, a nombre suyo."
          />

          <div style={{ display: 'flex', gap: '1.25rem', padding: '0 1.75rem' }}>
            <div style={{ width: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <Trazo />
              <IconTile icon={Bot} tone="data" size={36} />
              <Trazo />
            </div>
            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.75,
                color: 'var(--color-text-body)',
                margin: 0,
                padding: '1.25rem 0',
                alignSelf: 'center',
              }}
            >
              Entre las dos está <Strong>Queswa</Strong>: conversa con cada persona que
              llega, resuelve sus dudas y madura su decisión de avanzar. Cuando alguien está
              listo, le avisa.
            </p>
          </div>

          <Movimiento
            n="02"
            icon={Handshake}
            t="Recibir"
            d="Usted saluda a quien llega con interés. Cuando alguien ya decidió, lo recibe de persona a persona y le da la bienvenida — que es justo lo que mejor le sale a un ser humano."
          />

          <div
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              borderLeft: `2px solid ${GOLD}`,
              background: 'rgba(197,160,89,0.04)',
            }}
          >
            <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-text-body)', margin: 0 }}>
              Y como es así de sencillo, quien inicia con usted hace exactamente lo mismo.{' '}
              <Strong>De ahí salen la multiplicación de su negocio y el aumento de su facturación</Strong>{' '}
              — con Queswa formando a cada socio nuevo desde el día uno, y con Gano Excel
              presente en más de 60 países, su sistema no se detiene en la frontera.
            </p>
          </div>
        </div>
      </Section>

      {/* ═══ EL PRODUCTO — con la foto real del portafolio ═══ */}
      <Section elevated>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <Eyebrow>El producto</Eyebrow>
            <H2>Un producto que el cliente vuelve a pedir genera un ingreso que se repite.</H2>
            <Body>
              El café, las bebidas y los suplementos son productos premium de bienestar.
              Llevan Ganoderma, y se disuelven por completo en el agua:{' '}
              <Strong>no se queda nada en el fondo de la taza</Strong>.
            </Body>
            <Body mt>
              El cliente que nota la diferencia no vuelve al producto genérico: vuelve a
              pedir el mismo. Y esa recompra es la base de todo lo que leyó arriba.
            </Body>
          </div>
          <figure style={{ margin: 0 }}>
            <img
              src="/productos/compuestas/portafolio.jpg"
              alt="Portafolio Gano Excel: café, bebidas y suplementos con Ganoderma"
              width={1080}
              height={1080}
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
            <figcaption style={{ ...etiquetaMono, marginTop: '0.75rem', textAlign: 'center' }}>
              Los 22 productos · registro INVIMA
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* ═══ EMPEZAR CON POCO — las dos puertas ═══ */}
      <Section>
        <Eyebrow>Para empezar</Eyebrow>
        <H2>Se puede empezar con poco.</H2>
        <Body>
          No hace falta arrancar en grande: la estructura es la misma y crece a la medida de
          lo que usted decida. Hay quienes empiezan solo comprando el producto para su casa,
          a precio de distribuidor. Y hay quienes arrancan de una vez con todo. Las dos
          puertas están abiertas.
        </Body>
        <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            'Comprando el producto para su casa, a precio de distribuidor',
            'Arrancando de una vez con todo, con su sistema listo desde el primer día',
          ].map((t) => (
            <div key={t} style={{ ...cardStyle, display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '1.1rem 1.25rem' }}>
              <Check style={{ width: 18, height: 18, color: TITANIUM, flexShrink: 0, marginTop: 3 }} strokeWidth={2} />
              <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: 1.6, color: 'var(--color-text-body)' }}>{t}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ ANTICLÍMAX + CIERRE — centrado a propósito: es el remate, y es corto ═══ */}
      <Section elevated>
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              lineHeight: 1.6,
              color: 'var(--color-text-body)',
              maxWidth: 640,
              margin: '0 auto 3rem',
            }}
          >
            Y ya está. Eso es todo el negocio: un producto que las personas vuelven a
            pedir, una tecnología que atiende por usted, y cada cliente a su nombre.
          </p>

          <H2 center>Al final, el activo es suyo.</H2>
          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.75,
              color: 'var(--color-text-body)',
              maxWidth: 620,
              margin: '0 auto 2.5rem',
            }}
          >
            Su sistema de distribución le deja un activo a su nombre: sigue produciendo
            aunque usted no esté presente, porque sus clientes siguen pidiendo — y puede
            dejárselo a los suyos. Imagínese un viernes en que entra algo que no le debe
            nada a nadie. Empieza con una conversación — y esa conversación la atiende
            Queswa ahora mismo.
          </p>
          <QueswaCTAButton className="cta-base cta-primary">Hablar con Queswa</QueswaCTAButton>
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <QueswaOnline />
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Sin compromiso. Pregunte lo que quiera.
            </p>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer
      style={{
        padding: '40px 0',
        borderTop: '1px solid rgba(148, 163, 184, 0.12)',
        background: 'rgba(0,0,0,0.5)',
      }}
    >
      <div className={`${EJE} flex flex-wrap items-center justify-between gap-6`}>
        <div>
          <p style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.1em', color: GOLD, fontWeight: 600 }}>
            CreaTuActivo
          </p>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            Construcción de Ingresos Recurrentes
          </p>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            Fundada por Luis Cabrejo
          </p>
        </div>
        {/* Con salto de línea (8 oct 2026): sin él, en un celular de 390 px los cinco
            enlaces medían 46 px más que la pantalla y la página se arrastraba de lado. */}
        <div className="flex flex-wrap gap-x-8 gap-y-3" style={{ fontSize: '0.85rem' }}>
          <Link href="/blog" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Blog</Link>
          <Link href="/privacidad" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Privacidad</Link>
          <Link href="/terminos" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Términos</Link>
          <Link href="/tecnologia" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Tecnología</Link>
          <Link href="/servilleta" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Plan servilleta</Link>
        </div>
        <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          © 2026 CreaTuActivo.com · Luis Cabrejo
        </p>
      </div>
    </footer>
  )
}
