/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Homepage v14.0 — "Lenguaje concreto" (2 ago 2026) · aprobada por el Director desde /prueba
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
 * - Orden WHY_02: dinero primero → recurrencia (el café se acaba) → dos fuerzas.
 * - El candado se AFIRMA, nunca se niega (jamás nombrar "la nube").
 * - Qué hace usted: Compartir · Recibir · Multiplicar (rename v6.5).
 * - Producto test Beto ("no se queda nada en el fondo de la taza") · dos puertas ·
 *   anticlímax honesto + cierre Vélez ("un viernes en que entra algo que no le debe
 *   nada a nadie").
 * - Voz neutra (la home la comparten todos los socios) · sin prometer que no hay
 *   venta ni cobro · "las personas", nunca "la gente".
 *
 * El reel del hero es el explainer vigente (léxico pre-v6.8): se reemplaza subiendo
 * el asset nuevo a Blob con la misma URL, sin tocar este código.
 *
 * Estructural que NO se toca: `dynamic = 'force-static'` (TTFB CDN edge) · Footer con
 * "Fundada por Luis Cabrejo" (requisito de verificación WhatsApp Business / Meta).
 */

import type { ReactNode } from 'react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'
import QueswaCTAButton from '@/components/QueswaCTAButton'
import HomeManifestoVideo from '@/components/HomeManifestoVideo'
import { HOME_MANIFESTO_VIDEO, HOME_MANIFESTO_POSTER } from '@/lib/reels'

export const dynamic = 'force-static'

export const metadata = {
  title: 'CreaTuActivo | Un segundo ingreso, en paralelo al que ya tiene',
  description:
    'Un negocio de distribución de café y productos de consumo diario, dirigido desde su celular. La IA explica y atiende por usted; se liquida cada viernes.',
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
    title: 'Un segundo ingreso, en paralelo al que ya tiene',
    description:
      'Café y productos de consumo diario, una fábrica con 30 años detrás, y una inteligencia artificial que explica y atiende por usted en WhatsApp. Se liquida en su cuenta bancaria cada viernes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Un segundo ingreso, en paralelo al que ya tiene',
    description:
      'Café y productos de consumo diario, una fábrica con 30 años detrás, y una IA que explica y atiende por usted en WhatsApp. Se liquida cada viernes.',
  },
}

const GOLD = 'var(--color-brand)'
const TITANIUM = 'var(--color-titanium)'

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
        background: elevated ? 'var(--color-bg-elevated)' : 'var(--color-bg-primary)',
        padding: '5rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>{children}</div>
    </section>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: TITANIUM,
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

export default function HomePage() {
  return (
    <main style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
      <StrategicNavigation />

      {/* ═══ HERO — el upgrade que la persona sí calcula ═══
          El nav es sticky (en flujo): el padding-top ES el gap visible nav→video.
          30px arriba —medida heredada de la v13.7 y confirmada por el Director
          (2 ago 2026)— para que en móvil el video se vea completo y bien ubicado
          al abrir la página. El eyebrow va DEBAJO del video por lo mismo: encima
          lo empujaba fuera de la primera pantalla. */}
      <section
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(197,160,89,0.07) 0%, transparent 65%), var(--color-bg-primary)',
          padding: '30px 1.5rem 5rem',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          {/* Reel explainer 9:16 — ABRE la página. Autoplay muted + chip ACTIVAR
              SONIDO; al terminar se desvanece y abre Queswa. ⏳ Asset = explainer
              vigente (léxico pre-v6.8) — se reemplaza en Blob con la misma URL,
              sin tocar código. */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 3.5rem' }}>
            <HomeManifestoVideo src={HOME_MANIFESTO_VIDEO} poster={HOME_MANIFESTO_POSTER} />
          </div>

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
            Un segundo ingreso, en paralelo al que ya tiene.
            <br />
            <span style={{ color: GOLD }}>Con el potencial de igualarlo — o superarlo.</span>
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
            Un negocio de distribución de café y productos de consumo diario, que usted
            dirige desde el celular. La parte difícil —explicar, atender, responder a
            toda hora— la hace una inteligencia artificial por WhatsApp. Y lo que
            produce{' '}
            <strong style={{ color: 'var(--color-text-primary)' }}>
              se liquida en su cuenta bancaria cada viernes
            </strong>
            .
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <QueswaCTAButton className="cta-base cta-primary">
              Pregúntele a Queswa cómo funciona
            </QueswaCTAButton>
          </div>

          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)',
              marginTop: '1.25rem',
            }}
          >
            Queswa es nuestra inteligencia artificial. Responde al instante, sin compromiso.
          </p>
        </div>
      </section>

      {/* ═══ EL VILLANO NARRADO — trancón 1 + remate de los dos extremos ═══ */}
      <Section elevated>
        <Eyebrow>El problema que resolvemos</Eyebrow>
        <H2>Trabajar, pagar cuentas y repetir.</H2>
        <Body>
          Usted trabaja el mes entero. Pero al día siguiente de que le entra la plata, ese
          dinero ya tiene dueño: el banco, las cuotas, los recibos. Y esto no pasa por falta
          de capacidad ni de esfuerzo.{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>
            Le pasa exactamente igual al que gana dos millones y al que gana veinte.
          </strong>
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

      {/* ═══ DE DÓNDE SALE EL DINERO — orden WHY_02: dinero → recurrencia → dos fuerzas ═══ */}
      <Section>
        <Eyebrow>De dónde sale el dinero</Eyebrow>
        <H2>De café que las personas se toman todos los días.</H2>
        <Body>
          Los productos son de consumo diario —café, bebidas y suplementos con Ganoderma—
          y los fabrica y los despacha{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>Gano Excel</strong>, una
          empresa con más de 30 años y presencia en 70 países. Usted no compra inventario
          ni entrega pedidos.
        </Body>
        <Body mt>
          La ganancia sale de las ventas, y de nada más. Cada vez que alguien compra dentro
          de su negocio, a usted le queda un porcentaje, y se lo liquidan en{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>
            su cuenta bancaria cada viernes
          </strong>
          .
        </Body>
        <Body mt>
          Y lo que casi nadie ve a la primera:{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>el café se acaba</strong>.
          La persona que quedó contenta vuelve a pedir el mes siguiente, y esa venta ya no
          le cuesta trabajo a usted. Ahí es donde el ingreso deja de depender de sus horas
          y empieza a depender de cuántas personas ya están consumiendo.
        </Body>
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            borderLeft: `2px solid ${GOLD}`,
            background: 'rgba(197,160,89,0.04)',
          }}
        >
          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'var(--color-text-primary)',
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            Un producto que se toma, una fábrica que se puede visitar, y un porcentaje que
            llega al banco cada viernes.
          </p>
        </div>
      </Section>

      {/* ═══ POR QUÉ AHORA — el beat de WHY_01 + las dos fuerzas ═══ */}
      <Section elevated>
        <Eyebrow>Por qué ahora sí</Eyebrow>
        <H2>Distribuir siempre fue buen negocio. Lo pesado era todo lo demás.</H2>
        <Body>
          Distribuir productos de consumo diario siempre ha sido rentable. Pero exigía algo
          que a casi nadie le gusta: explicar mil veces lo mismo, insistir, atender, estar
          pendiente a toda hora. Nadie tiene la vida para dedicarse a eso todo el día.
        </Body>
        <Body mt>
          Eso fue lo que cambió. Hoy el peso se reparte en dos: la fábrica y la entrega ya
          las puso Gano Excel. Y la parte que a la mayoría se le hace cuesta arriba
          —explicar, atender, estar pendiente— la hace{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>Queswa</strong>, nuestra
          inteligencia artificial: conversa por WhatsApp con cada persona interesada y
          madura su decisión de avanzar, a toda hora, sin que usted tenga que estar ahí.
        </Body>
      </Section>

      {/* ═══ QUÉ HACE USTED — Compartir · Recibir · Multiplicar ═══ */}
      <Section>
        <Eyebrow>Qué hace usted</Eyebrow>
        <H2>Tres movimientos. Ninguno le exige dejar lo que hace hoy.</H2>

        {[
          {
            n: '01',
            t: 'Compartir',
            d: 'Desde su celular, con un clic, comparte lo que ya está preparado. No memoriza guiones, no improvisa. Le toma minutos.',
          },
          {
            n: '02',
            t: 'Recibir',
            d: 'Cuando alguien ya decidió, entra usted: lo recibe de persona a persona y le da la bienvenida. Es lo único que una máquina no hace — y es justo lo que mejor le sale a un ser humano.',
          },
          {
            n: '03',
            t: 'Multiplicar',
            d: 'A cada persona que entra con usted, Queswa la forma desde el día uno. Con una llamada puede abrir un punto de distribución en otro país. Su negocio crece sin que usted cargue la enseñanza.',
          },
        ].map((item) => (
          <div
            key={item.n}
            style={{
              display: 'flex',
              gap: '1.5rem',
              padding: '1.75rem',
              marginBottom: '1rem',
              background: 'var(--color-bg-surface)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 4,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                color: GOLD,
                flexShrink: 0,
              }}
            >
              {item.n}
            </span>
            <div>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  margin: '0 0 0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {item.t}
              </h3>
              <p
                style={{
                  fontSize: '0.98rem',
                  lineHeight: 1.7,
                  color: 'var(--color-text-body)',
                  margin: 0,
                }}
              >
                {item.d}
              </p>
            </div>
          </div>
        ))}
      </Section>

      {/* ═══ EL PRODUCTO — test Beto: imagen concreta, autoridad intacta ═══ */}
      <Section elevated>
        <Eyebrow>El producto</Eyebrow>
        <H2>Un hábito que no cambia genera un ingreso que jamás se detiene.</H2>
        <Body>
          No le pedimos a nadie adoptar un hábito nuevo: el café ya se toma todos los días.
          Este lleva Ganoderma, un extracto respaldado por más de 2.000 estudios
          científicos, que{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>
            se disuelve por completo en el agua
          </strong>{' '}
          — el cuerpo lo aprovecha todo, no se queda nada en el fondo de la taza.
        </Body>
        <Body mt>
          Quien lo prueba y le sienta bien, lo vuelve a pedir. Y esa recompra, mes tras
          mes, es la base de todo lo que leyó arriba.
        </Body>
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
      </Section>

      {/* ═══ ANTICLÍMAX + CIERRE — la vida que devuelve ═══ */}
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
            pedir, una tecnología que atiende por usted, y un porcentaje que cae los
            viernes.
          </p>

          <H2>Al final, esto es algo suyo.</H2>
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
          <QueswaCTAButton className="cta-base cta-primary">
            Hablar con Queswa
          </QueswaCTAButton>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)',
              marginTop: '1.25rem',
            }}
          >
            Sin compromiso. Pregunte lo que quiera.
          </p>
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
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.1em',
              color: GOLD,
              fontWeight: 600,
            }}
          >
            CreaTuActivo
          </p>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            Construcción de Ingresos Recurrentes
          </p>
          {/* Atribución de titularidad — establece la relación marca ↔ titular verificado.
              Requisito de las normas de nombre visible de WhatsApp Business: el revisor
              debe poder confirmar en fuentes externas que CreaTuActivo pertenece a
              Luis Cabrejo, que es el nombre del portafolio comercial verificado en Meta. */}
          <p
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-text-muted)',
              marginTop: '6px',
            }}
          >
            Fundada por Luis Cabrejo
          </p>
        </div>
        <div style={{ display: 'flex', gap: '32px', fontSize: '0.85rem' }}>
          <Link href="/blog" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
            Blog
          </Link>
          <Link href="/privacidad" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
            Privacidad
          </Link>
          <Link href="/terminos" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
            Términos
          </Link>
          <Link href="/tecnologia" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
            Tecnología
          </Link>
        </div>
        <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          © 2026 CreaTuActivo.com · Luis Cabrejo
        </p>
      </div>
    </footer>
  )
}
