/**
 * Copyright © 2026 CreaTuActivo.com
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

      {/* ═══ HERO — el negocio antes que el ingreso (29 ago 2026) ═══
          Sin video (retirado 14 ago 2026 — asset viejo, sin reemplazo por ahora):
          la página abre con el eyebrow + H1. El padding-top sube de 30px (medida
          del layout con video) a 72px para que el titular respire bajo el nav. */}
      <section
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(197,160,89,0.07) 0%, transparent 65%), var(--color-bg-primary)',
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
            <strong style={{ color: 'var(--color-text-primary)' }}>
              A usted le queda un ingreso en paralelo al que ya tiene, con el potencial
              de igualarlo — o superarlo.
            </strong>
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
            Le pasa exactamente igual al que gana dos millones y al que gana más de veinte.
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
        <H2>Del producto que se vende. De nada más.</H2>
        <Body>
          El producto es concreto —café, bebidas y suplementos premium con Ganoderma—
          y lo fabrica y lo despacha{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>Gano Excel</strong>, una
          empresa con más de 30 años y presencia en más de 60 países. Usted no compra inventario
          ni entrega pedidos.
        </Body>
        <Body mt>
          La ganancia sale de las ventas, y de nada más. Cada vez que se vende producto
          por su canal, a usted le queda un porcentaje, y se lo liquidan en{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>
            su cuenta bancaria cada viernes
          </strong>
          .
        </Body>
        <Body mt>
          Y lo que casi nadie ve a la primera:{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>el cliente nota la diferencia</strong>.
          Quien lo prueba no vuelve al producto genérico: cuando se le acaba, vuelve a
          pedir el mismo, y esa venta ya no le cuesta trabajo a usted. Ahí es donde el
          ingreso deja de depender de su presencia y empieza a depender de cuántos
          clientes ya están consumiendo.
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
          Distribuir productos que las personas vuelven a pedir siempre ha sido
          buen negocio. Lo que lo hacía complicado era atender a cada interesado, uno
          por uno — y nadie tiene la vida para eso.
        </Body>
        <Body mt>
          Eso fue lo que cambió. Las fábricas, el inventario y los despachos los pone{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>Gano Excel</strong>. Y
          atender a cada interesado lo hace{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>Queswa</strong>, nuestra
          inteligencia artificial: conversa por WhatsApp con cada persona, le resuelve las
          dudas y madura su decisión de avanzar, a toda hora. Su canal se maneja desde una
          aplicación, y buena parte desde WhatsApp.
        </Body>
      </Section>

      {/* ═══ QUÉ HACE USTED — Compartir · Recibir (la multiplicación es consecuencia) ═══ */}
      <Section>
        <Eyebrow>Qué hace usted</Eyebrow>
        <H2>Dos movimientos. Ninguno le exige dejar lo que hace hoy.</H2>

        {[
          {
            n: '01',
            t: 'Compartir',
            d: 'Usted pasa un enlace a quien quiera. Lo que esa persona recibe ya está preparado: la página, el video y Queswa, a nombre suyo.',
          },
          {
            n: '02',
            t: 'Recibir',
            d: 'Usted saluda a quien llega con interés. Cuando alguien ya decidió, lo recibe de persona a persona y le da la bienvenida — que es justo lo que mejor le sale a un ser humano.',
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

        {/* ⚠️ "Las dos acciones nunca van solas": entre una y otra va QUIÉN hace el
            trabajo. Sin este beat, dos acciones tan simples se leen como una
            promesa sin causa — la forma exacta de una estafa, y el primero de los
            tres desafíos del modelo. Es el mismo beat de EAM_01, en la voz de la
            home: Queswa en TERCERA persona, porque la página la comparten todos
            los socios y aquí el agente no está hablando. */}
        <p
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.75,
            color: 'var(--color-text-body)',
            marginTop: '1.5rem',
          }}
        >
          Entre las dos está{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>Queswa</strong>: conversa
          con cada persona que llega, resuelve sus dudas y madura su decisión de avanzar.
          Cuando alguien está listo, le avisa.
        </p>

        {/* La multiplicación NO es un tercer movimiento (doctrina 8 ago 2026): se
            nombra como CONSECUENCIA de que los dos anteriores sean sencillos —
            como tarea suma peso, como consecuencia lo quita. El texto ecoa casi
            verbatim el cierre de EAM_01, que es lo que Queswa responde en
            WhatsApp a "¿qué debo hacer yo?": la web y el canal no pueden
            contradecirse en la pregunta más identitaria de todas. Va sin número
            y con otro tratamiento visual a propósito — el ojo debe leer "esto no
            es algo que usted hace". */}
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
              lineHeight: 1.75,
              color: 'var(--color-text-body)',
              margin: 0,
            }}
          >
            Y como es así de sencillo, quien entra con usted hace exactamente lo mismo.{' '}
            <strong style={{ color: 'var(--color-text-primary)' }}>
              De ahí salen la multiplicación de su negocio y el aumento de su facturación
            </strong>{' '}
            — con Queswa formando a cada socio nuevo desde el día uno, y con Gano Excel
            operando en más de 60 países, su canal no se detiene en la frontera.
          </p>
        </div>
      </Section>

      {/* ═══ EL PRODUCTO — test Beto: imagen concreta, autoridad intacta ═══ */}
      <Section elevated>
        <Eyebrow>El producto</Eyebrow>
        <H2>Un producto que el cliente vuelve a pedir genera un ingreso que se repite.</H2>
        <Body>
          El café, las bebidas y los suplementos son productos premium de bienestar.
          Llevan Ganoderma, y se disuelven por completo en el agua:{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>
            no se queda nada en el fondo de la taza
          </strong>
          .
        </Body>
        <Body mt>
          El cliente que nota la diferencia no vuelve al producto genérico: cuando se le
          acaba, vuelve a pedir el mismo. Y esa recompra es la base de todo lo que leyó
          arriba.
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
