/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Homepage v15.0 — "El sistema desplegado" (29 ago 2026) · aprobada por el Director desde /prueba
 *
 * Mismo copy que la v14.1. Lo que cambia es el COLOR y la ESTRUCTURA VISUAL, tras
 * la auditoría de branding del 29 ago: la v14 aplicaba solo la restricción del
 * sistema (carbón + dorado) y no su despliegue — la investigación advierte contra
 * "la fatiga visual inherente a las interfaces planas". Cuatro roles, cada uno con
 * una frase: carbón el lienzo · titanio la estructura (iconos, líneas, cifras) ·
 * cian el dato y Queswa en línea (`--color-data`, regla en BRANDING.md) · dorado el
 * dinero y el logro. Verde salvia SOLO en el módulo del banco ("transferencias
 * liquidadas"). Ecuación visual del dinero, dos fuerzas en tarjetas lado a lado,
 * fila de cifras verificables (en titanio: son hechos, no premios), foto REAL del
 * portafolio (nunca generada), textura de hormigón en secciones elevadas.
 * Performance intacta: sin backdropFilter ni Framer, foto lazy, LCP = H1.
 *
 * Homepage v14.1 — "El negocio antes que el ingreso" (29 ago 2026) · aprobada por el Director
 *
 * Hero reescrito: el H1 nombra el ACTIVO —"Sea dueño de su propio canal de
 * distribución"— y el ingreso en paralelo baja al párrafo como consecuencia. Motivo
 * (Director): un amigo dice "le tengo un negocio", nunca "le tengo un ingreso"; abrir
 * con el ingreso tiene el matiz que pone en alerta, que es el tic de la industria.
 * De paso el hero queda coherente con la tarjeta OG del enlace de Queswa (59b8295) y
 * con la primera línea de WHY_02. El producto entra como "premium de bienestar" con
 * el Ganoderma nombrado —"café" solo se compara con el café del estante— y la faena
 * vieja se nombra en una frase sin inventario (regla del 26 ago 2026).
 *
 * Auditoría del resto (mismo día, aprobada): «Por qué ahora sí» nombra la faena vieja
 * en una frase y no la enumera dos veces · Compartir/Recibir con los verbos de EAM_01,
 * sin "un clic" ni "le toma minutos" (la parte del socio se dice con verbos, no con
 * adjetivos que la minimicen) ni fantasmas negados (guiones, máquina) · «El producto»
 * sin ciencia citada ni mecanismo corporal (la Home era la única página del sitio
 * citando estudios tras la limpieza del 22 ago) · «el canal es suyo» en vez de "esto"
 * · "más de veinte" en sincronía con el candado de STORY_03 · la multiplicación
 * remata con un hecho (Gano en más de 60 países) y no con "con una llamada".
 * ⚠️ El bautizo diferido de "empresa digital" que cita la nota v14.0 quedó RETIRADO
 * el 25 ago 2026 (léxico único: canal de distribución, siempre).
 *
 * Base: v14.0 — "Lenguaje concreto" (2 ago 2026) · aprobada por el Director desde /prueba
 *
 * Reemplaza por completo la v13.7 ("Sea dueño de su empresa digital"). La estructura
 * y el copy vienen del ejercicio /prueba (Home 2), construido sobre la doctrina del
 * guion servilleta v6.8 + WHY_01/WHY_02 v5.28+:
 *
 * - CERO "empresa digital" (vacío semántico: el prospecto lo rellena con pirámides o
 *   cripto). El bautizo de la categoría se difiere a Academia/Maestría (post-compra).
 * - Hero = el upgrade en lenguaje que la persona sí calcula (hallazgo del Director):
 *   "un segundo ingreso, en paralelo — con el potencial de igualarlo o superarlo".
 * - Villano narrado (trancón 1: la plata llega ya con dueño) + remate canónico
 *   "le pasa exactamente igual al que gana dos millones y al que gana veinte".
 * - Orden WHY_02: dinero primero → recurrencia (por RESULTADO: el cliente nota la
 *   diferencia y vuelve a pedir el mismo — nunca "porque se acaba") → dos fuerzas.
 * - Estante premium de bienestar (14 ago 2026): CERO "consumo diario" — ese marco
 *   planta la comparación con el supermercado (arsenal WHY_02, fijado 8 ago).
 * - El candado se AFIRMA, nunca se niega (jamás nombrar "la nube").
 * - La recompensa se nombra por su REPETICIÓN, no por su fecha (14 ago 2026):
 *   "usted cobra cada vez que su canal mueve producto". El viernes sobrevive
 *   SOLO donde es hecho verificable del mecanismo —el quote box, la sección del
 *   dinero, el cierre Vélez—; pegado a lo que la persona debe hacer se vuelve
 *   promesa de ingreso fechada. Eran ocho menciones, quedan cinco.
 * - Qué hace usted: DOS movimientos —Compartir · Recibir— y la multiplicación
 *   como consecuencia, nunca como tercer paso (doctrina 8 ago; corregido 14 ago:
 *   la web decía tres y Queswa decía dos en la misma pregunta).
 * - Producto test Beto ("no se queda nada en el fondo de la taza") · dos puertas ·
 *   anticlímax honesto + cierre Vélez ("un viernes en que entra algo que no le debe
 *   nada a nadie").
 * - Voz neutra (la home la comparten todos los socios) · sin prometer que no hay
 *   venta ni cobro · "las personas", nunca "la gente".
 *
 * El reel del hero se RETIRÓ (14 ago 2026): el asset era viejo y no hay video nuevo
 * por ahora. Para restaurarlo: volver a importar HomeManifestoVideo + HOME_MANIFESTO_*
 * de @/lib/reels y montarlo antes del Eyebrow del hero (ver git log de este archivo).
 *
 * Estructural que NO se toca: `dynamic = 'force-static'` (TTFB CDN edge) · Footer con
 * "Fundada por Luis Cabrejo" (requisito de verificación WhatsApp Business / Meta).
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
} from 'lucide-react'
import StrategicNavigation from '@/components/StrategicNavigation'
import QueswaCTAButton from '@/components/QueswaCTAButton'

export const dynamic = 'force-static'

export const metadata = {
  title: 'CreaTuActivo | Sea dueño de su propio canal de distribución',
  description:
    'Un negocio de distribución de productos premium de bienestar —café y suplementos con Ganoderma— que usted maneja desde el celular. Una inteligencia artificial explica y atiende por WhatsApp; usted cobra cada vez que su canal mueve producto.',
  // Canonical explícito: cada socio comparte /?ref=xyz — sin canonical, Google
  // trata cada variante como URL distinta con contenido duplicado.
  alternates: { canonical: 'https://creatuactivo.com' },
  // Next hace merge SUPERFICIAL: este objeto reemplaza el openGraph del layout
  // completo → siteName/type/locale se re-declaran aquí o se pierden.
  openGraph: {
    type: 'website',
    siteName: 'CreaTuActivo.com',
    locale: 'es_CO',
    url: 'https://creatuactivo.com',
    title: 'Sea dueño de su propio canal de distribución',
    description:
      'Productos premium de bienestar —café y suplementos con Ganoderma— que Gano Excel fabrica y despacha por usted, y una inteligencia artificial que explica y atiende por WhatsApp. Usted cobra cada vez que su canal mueve producto.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sea dueño de su propio canal de distribución',
    description:
      'Productos premium de bienestar con Ganoderma, una fábrica con 30 años detrás, y una IA que explica y atiende por usted en WhatsApp. Usted cobra cada vez que su canal mueve producto.',
  },
}

const GOLD = 'var(--color-brand)'
const TITANIUM = 'var(--color-titanium)'
const DATA = 'var(--color-data)'
const TEXTURE = "url('/images/servilleta/hormigon-tile.webp')"

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
        padding: '5rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>{children}</div>
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

function H2({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
        lineHeight: 1.3,
        color: 'var(--color-text-primary)',
        margin: '0 0 1.5rem',
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
function QueswaOnline({ label = 'Queswa · en línea' }: { label?: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        letterSpacing: '0.15em',
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

// ─── Página ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
      <StrategicNavigation />

      {/* ═══ HERO — spotlight titanio + dorado (BRANDING §5) ═══ */}
      <section
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 30% 0%, rgba(148,163,184,0.09) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 75% 10%, rgba(197,160,89,0.07) 0%, transparent 65%), var(--color-bg-primary)',
          padding: '72px 1.5rem 5rem',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <Eyebrow>CreaTuActivo · Colombia · Estados Unidos · Latinoamérica</Eyebrow>

          <h1
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: 'clamp(2.1rem, 6vw, 3.4rem)',
              lineHeight: 1.12,
              color: 'var(--color-text-primary)',
              margin: '0 0 1.5rem',
            }}
          >
            Sea dueño de su propio canal de distribución.
            <br />
            <span style={{ color: GOLD }}>
              Lo maneja desde el celular, y cobra cada vez que mueve producto.
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2.4vw, 1.3rem)',
              lineHeight: 1.65,
              color: 'var(--color-text-body)',
              margin: '0 0 2.5rem',
              maxWidth: 680,
            }}
          >
            Un negocio de distribución de productos premium de bienestar —café y
            suplementos con Ganoderma— que Gano Excel, con 30 años y presencia en más
            de 60 países, fabrica y despacha por usted. Lo que antes era complicado de
            desarrollar, hoy es sencillo: una inteligencia artificial explica y atiende
            a cada interesado por WhatsApp, a toda hora.{' '}
            <Strong>
              A usted le queda un ingreso en paralelo al que ya tiene, con el potencial
              de igualarlo — o superarlo.
            </Strong>
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <QueswaCTAButton className="cta-base cta-primary">
              Pregúntele a Queswa cómo funciona
            </QueswaCTAButton>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginTop: '1.25rem',
            }}
          >
            <QueswaOnline />
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Nuestra inteligencia artificial. Responde al instante, sin compromiso.
            </p>
          </div>
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
          por su canal, a usted le queda un porcentaje, y se lo liquidan en{' '}
          <Strong>su cuenta bancaria cada viernes</Strong>.
        </Body>
        <Body mt>
          Y lo que casi nadie ve a la primera: <Strong>el cliente nota la diferencia</Strong>.
          Quien lo prueba no vuelve al producto genérico: cuando se le acaba, vuelve a
          pedir el mismo, y esa venta ya no le cuesta trabajo a usted. Ahí es donde el
          ingreso deja de depender de su presencia y empieza a depender de cuántos
          clientes ya están consumiendo.
        </Body>

        {/* La ecuación: producto + fábrica = porcentaje. Proceso en titanio, resultado
            en dorado (es dinero) con el icono en salvia (transferencia liquidada). */}
        <div
          style={{
            marginTop: '2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            alignItems: 'stretch',
          }}
        >
          {[
            { icon: Coffee, k: 'El producto', v: 'Un producto que se toma' },
            { icon: Factory, k: 'La fábrica', v: 'Una fábrica que se puede visitar' },
          ].map((c) => (
            <div key={c.k} style={cardStyle}>
              <IconTile icon={c.icon} />
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  margin: '1rem 0 0.35rem',
                }}
              >
                {c.k}
              </p>
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
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: GOLD,
                margin: '1rem 0 0.35rem',
              }}
            >
              El porcentaje
            </p>
            <p style={{ fontSize: '1.02rem', color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.5 }}>
              Un porcentaje que llega al banco cada viernes
            </p>
          </div>
        </div>
      </Section>

      {/* ═══ POR QUÉ AHORA — las dos fuerzas en tarjetas + cifras verificables ═══ */}
      <Section elevated>
        <Eyebrow>Por qué ahora sí</Eyebrow>
        <H2>Distribuir siempre fue buen negocio. Lo pesado era todo lo demás.</H2>
        <Body>
          Distribuir productos que las personas vuelven a pedir siempre ha sido
          buen negocio. Lo que lo hacía complicado era atender a cada interesado, uno
          por uno — y nadie tiene la vida para eso.
        </Body>
        <Body mt>
          Eso fue lo que cambió. Hoy el trabajo pesado lo hacen dos: una fábrica con
          30 años, y una inteligencia artificial que no duerme. Su canal se maneja desde
          una aplicación, y buena parte desde WhatsApp.
        </Body>

        <div
          style={{
            marginTop: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.9rem' }}>
              <IconTile icon={Factory} />
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '1.05rem' }}>
                  Gano Excel
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  Fabrica y despacha
                </p>
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
                <QueswaOnline label="Inteligencia artificial · en línea" />
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--color-text-body)' }}>
              Conversa por WhatsApp con cada persona interesada, le resuelve las dudas y
              madura su decisión de avanzar, a toda hora. Usted no le repite lo mismo a
              cada uno.
            </p>
          </div>
        </div>

        {/* Cifras verificables — en titanio claro, no en dorado: son hechos, no premios. */}
        <div
          style={{
            marginTop: '2.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(148,163,184,0.15)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center',
          }}
        >
          {[
            { n: '30', l: 'años de Gano Excel' },
            { n: '+60', l: 'países' },
            { n: '16', l: 'países donde opera su canal' },
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
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {s.n}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                }}
              >
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ QUÉ HACE USTED — Compartir · Recibir, con icono ═══ */}
      <Section>
        <Eyebrow>Qué hace usted</Eyebrow>
        <H2>Dos movimientos. Ninguno le exige dejar lo que hace hoy.</H2>

        {[
          {
            n: '01',
            icon: Share2,
            t: 'Compartir',
            d: 'Usted pasa un enlace a quien quiera. Lo que esa persona recibe ya está preparado: la página, el video y Queswa, a nombre suyo.',
          },
          {
            n: '02',
            icon: Handshake,
            t: 'Recibir',
            d: 'Usted saluda a quien llega con interés. Cuando alguien ya decidió, lo recibe de persona a persona y le da la bienvenida — que es justo lo que mejor le sale a un ser humano.',
          },
        ].map((item) => (
          <div
            key={item.n}
            style={{
              ...cardStyle,
              display: 'flex',
              gap: '1.25rem',
              padding: '1.75rem',
              marginBottom: '1rem',
              alignItems: 'flex-start',
            }}
          >
            <IconTile icon={item.icon} size={48} />
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: GOLD }}>
                  {item.n}
                </span>
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
                  {item.t}
                </h3>
              </div>
              <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--color-text-body)', margin: 0 }}>
                {item.d}
              </p>
            </div>
          </div>
        ))}

        <div
          style={{
            display: 'flex',
            gap: '0.85rem',
            alignItems: 'flex-start',
            marginTop: '1.5rem',
          }}
        >
          <IconTile icon={Bot} tone="data" size={36} />
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-text-body)', margin: 0 }}>
            Entre las dos está <Strong>Queswa</Strong>: conversa con cada persona que
            llega, resuelve sus dudas y madura su decisión de avanzar. Cuando alguien está
            listo, le avisa.
          </p>
        </div>

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
            operando en más de 60 países, su canal no se detiene en la frontera.
          </p>
        </div>
      </Section>

      {/* ═══ EL PRODUCTO — con la foto real del portafolio ═══ */}
      <Section elevated>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          <div>
            <Eyebrow>El producto</Eyebrow>
            <H2>Un producto que el cliente vuelve a pedir genera un ingreso que se repite.</H2>
            <Body>
              El café, las bebidas y los suplementos son productos premium de bienestar.
              Llevan Ganoderma, y se disuelven por completo en el agua:{' '}
              <Strong>no se queda nada en el fondo de la taza</Strong>.
            </Body>
            <Body mt>
              El cliente que nota la diferencia no vuelve al producto genérico: cuando se le
              acaba, vuelve a pedir el mismo. Y esa recompra es la base de todo lo que leyó
              arriba.
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
            <figcaption
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginTop: '0.75rem',
                textAlign: 'center',
              }}
            >
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
        <div
          style={{
            marginTop: '1.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {[
            'Comprando el producto para su casa, a precio de distribuidor',
            'Arrancando de una vez con todo, con su canal listo desde el primer día',
          ].map((t) => (
            <div key={t} style={{ ...cardStyle, display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '1.1rem 1.25rem' }}>
              <Check style={{ width: 18, height: 18, color: TITANIUM, flexShrink: 0, marginTop: 3 }} strokeWidth={2} />
              <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: 1.6, color: 'var(--color-text-body)' }}>{t}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ ANTICLÍMAX + CIERRE ═══ */}
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
            pedir, una tecnología que atiende por usted, y un porcentaje que entra cada
            vez que se vende.
          </p>

          <H2>Al final, el canal es suyo.</H2>
          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.75,
              color: 'var(--color-text-body)',
              maxWidth: 620,
              margin: '0 auto 2.5rem',
            }}
          >
            Un negocio a su nombre, que sigue produciendo aunque usted no esté presente, y
            que puede dejarle a los suyos. Imagínese un viernes en que entra algo que no le
            debe nada a nadie. Empieza con una conversación — y esa conversación la atiende
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
    </main>
  )
}

function Footer() {
  return (
    <footer
      style={{
        padding: '40px 24px',
        borderTop: '1px solid rgba(148, 163, 184, 0.12)',
        background: 'rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
        }}
      >
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
        <div style={{ display: 'flex', gap: '32px', fontSize: '0.85rem' }}>
          <Link href="/blog" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Blog</Link>
          <Link href="/privacidad" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Privacidad</Link>
          <Link href="/terminos" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Términos</Link>
          <Link href="/tecnologia" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Tecnología</Link>
        </div>
        <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          © 2026 CreaTuActivo.com · Luis Cabrejo
        </p>
      </div>
    </footer>
  )
}
