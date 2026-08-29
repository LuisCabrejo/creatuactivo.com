/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /nosotros — quiénes somos, en cuatro bloques (29 ago 2026).
 *
 * Reemplaza a /manifiesto (el Documento Fundacional). Decisión del Director: el
 * Manifiesto sale del proceso de Fundadores y del Arsenal de Enlaces del Dashboard;
 * el ítem «Nosotros» del menú necesita lo que un visitante espera de ese nombre —
 * qué es CreaTuActivo, quién fabrica, quién atiende, quién fundó — y nada más.
 *
 * Copy: el primer bloque es la tesis de WHY_01 (candado del arsenal) ajustada al
 * léxico único (canal de distribución · productos premium de bienestar); las dos
 * fuerzas y las cifras son las constantes canónicas; el bloque del fundador sale
 * de EPIPHANY_BRIDGE_OFICIAL.md y de la historia real (automotriz → Gano Excel →
 * e-commerce → CreaTuActivo), con el lema como única excepción léxica permitida.
 * Voz: siempre usted. noindex (como /manifiesto).
 */

import type { ReactNode } from 'react'
import { Factory, Bot, Landmark, ShieldCheck } from 'lucide-react'
import StrategicNavigation from '@/components/StrategicNavigation'
import QueswaCTAButton from '@/components/QueswaCTAButton'

export const metadata = {
  title: 'Nosotros | CreaTuActivo',
  description:
    'CreaTuActivo es una empresa de tecnología: usted monta su propio canal de distribución de productos premium de bienestar, y nosotros le ponemos la inteligencia artificial que explica y atiende a cada interesado.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://creatuactivo.com/nosotros' },
  openGraph: {
    type: 'website',
    siteName: 'CreaTuActivo.com',
    locale: 'es_CO',
    url: 'https://creatuactivo.com/nosotros',
    title: 'Nosotros | CreaTuActivo',
    description:
      'Una empresa de tecnología para su canal de distribución: Gano Excel fabrica y despacha, Queswa explica y atiende, usted es el dueño.',
  },
}

const GOLD = 'var(--color-brand)'
const TITANIUM = 'var(--color-titanium)'
const DATA = 'var(--color-data)'

function Section({ children, elevated = false }: { children: ReactNode; elevated?: boolean }) {
  return (
    <section
      style={{
        background: elevated
          ? "linear-gradient(rgba(21,23,28,0.94), rgba(21,23,28,0.94)), url('/images/servilleta/hormigon-tile.webp')"
          : 'var(--color-bg-primary)',
        backgroundSize: elevated ? 'auto, 200px 200px' : undefined,
        borderTop: '1px solid rgba(148,163,184,0.12)',
        padding: '4.5rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>{children}</div>
    </section>
  )
}
const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: DATA, marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
    {children}
  </p>
)
const H2 = ({ children }: { children: ReactNode }) => (
  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', lineHeight: 1.3, color: 'var(--color-text-primary)', margin: '0 0 1.5rem' }}>
    {children}
  </h2>
)
const Body = ({ children, mt = false }: { children: ReactNode; mt?: boolean }) => (
  <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-text-body)', marginTop: mt ? '1.25rem' : 0 }}>{children}</p>
)
const Strong = ({ children }: { children: ReactNode }) => <strong style={{ color: 'var(--color-text-primary)' }}>{children}</strong>

function IconTile({ icon: Icon, tone = 'titanium' }: { icon: typeof Factory; tone?: 'titanium' | 'data' }) {
  const color = tone === 'data' ? DATA : TITANIUM
  const tint = tone === 'data' ? 'rgba(34,211,238,0.08)' : 'rgba(148,163,184,0.1)'
  return (
    <div style={{ width: 44, height: 44, borderRadius: 10, background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon style={{ width: 22, height: 22, color }} strokeWidth={1.6} />
    </div>
  )
}
const card = { background: 'var(--color-bg-surface)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '1.5rem' } as const

export default function NosotrosPage() {
  return (
    <main style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
      <StrategicNavigation />

      <section
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 30% 0%, rgba(148,163,184,0.09) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 75% 10%, rgba(197,160,89,0.07) 0%, transparent 65%), var(--color-bg-primary)',
          padding: '72px 1.5rem 4.5rem',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <Eyebrow>Nosotros</Eyebrow>
          <h1
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'clamp(2rem, 5.5vw, 3.2rem)', lineHeight: 1.12, color: 'var(--color-text-primary)', margin: '0 0 1.5rem' }}
          >
            Una empresa de tecnología,
            <br />
            <span style={{ color: GOLD }}>al servicio de su canal de distribución.</span>
          </h1>
          <p style={{ fontSize: 'clamp(1.05rem, 2.4vw, 1.3rem)', lineHeight: 1.65, color: 'var(--color-text-body)', margin: 0, maxWidth: 680 }}>
            Lo que hacemos se resume en algo concreto: usted monta su propio canal de
            distribución de productos premium de bienestar, lo maneja desde el celular, y
            nosotros le ponemos la inteligencia artificial que explica y atiende a cada
            interesado, a toda hora.
          </p>
        </div>
      </section>

      <Section elevated>
        <Eyebrow>Por qué existimos</Eyebrow>
        <H2>Distribuir siempre fue buen negocio. Lo pesado era todo lo demás.</H2>
        <Body>
          Distribuir productos que las personas vuelven a pedir siempre ha sido buen
          negocio. Lo que lo hacía complicado era atender a cada interesado, uno por uno
          — y nadie tiene la vida para eso. Eso fue lo que cambió: hoy el trabajo pesado
          lo hacen dos, y a usted le queda ser el dueño.
        </Body>

        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.9rem' }}>
              <IconTile icon={Factory} />
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '1.05rem' }}>Gano Excel</p>
                <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Fabrica y despacha</p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--color-text-body)' }}>
              Las fábricas, la investigación, el inventario y los despachos. Más de 30 años,
              presencia en más de 60 países y nueve sedes abiertas al público en Colombia.
              Usted no compra inventario ni entrega pedidos.
            </p>
          </div>
          <div style={{ ...card, border: '1px solid rgba(34,211,238,0.22)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.9rem' }}>
              <IconTile icon={Bot} tone="data" />
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '1.05rem' }}>Queswa</p>
                <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: DATA, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: DATA }} />
                  Inteligencia artificial · en línea
                </p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--color-text-body)' }}>
              Conversa por WhatsApp con cada persona interesada, le resuelve las dudas y
              madura su decisión de avanzar, a toda hora. La construimos nosotros, para esa
              parte que a la mayoría no le gusta ni tiene cómo hacer.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <Eyebrow>Respaldo</Eyebrow>
        <H2>Hechos que se pueden verificar.</H2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {[
            { icon: ShieldCheck, k: 'Ley 1700 de 2013', v: 'La norma colombiana del mercadeo multinivel exige oficina abierta al público. Gano Excel tiene nueve sedes en el país y está afiliada a ACOVEDI.' },
            { icon: Landmark, k: 'Registros', v: 'Productos con registro INVIMA vigente y certificación TGA de Australia. Los 22 con su ficha, presentación y precio a la vista.' },
            { icon: Factory, k: '16 países', v: 'Su canal opera en 16 países de América — de Canadá a Chile — y se maneja desde una aplicación, buena parte desde WhatsApp.' },
          ].map((c) => (
            <div key={c.k} style={card}>
              <IconTile icon={c.icon} />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: '1rem 0 0.35rem' }}>{c.k}</p>
              <p style={{ fontSize: '0.98rem', color: 'var(--color-text-body)', margin: 0, lineHeight: 1.65 }}>{c.v}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section elevated>
        <Eyebrow>El fundador</Eyebrow>
        <H2>Luis Cabrejo</H2>
        <Body>
          Luis llegó a este negocio como distribuidor. Venía del sector automotriz y de
          montar empresas propias, y en Gano Excel construyó, durante doce años, un canal
          que lo llevó al rango Diamante. Ahí vio lo que casi nadie quiere ver: su
          resultado no se duplicaba. Lo que para él era natural —explicar, atender, estar
          pendiente de cada persona— para los suyos era una lucha diaria.
        </Body>
        <Body mt>
          Después montó un comercio electrónico que vendió por todo el continente, y la
          historia se repitió: el modelo exigía saber de marketing, de logística, de
          importaciones. <Strong>El problema nunca fue la gente. El problema siempre fue el modelo.</Strong>{' '}
          CreaTuActivo y Queswa son la respuesta a una sola pregunta: cómo construir un
          negocio de distribución donde la tecnología haga el trabajo pesado, para que
          cualquiera con un deseo real de cambiar su situación pueda ser dueño de su canal
          sin tener que volverse experto.
        </Body>
        <div style={{ marginTop: '2rem', padding: '1.5rem', borderLeft: `2px solid ${GOLD}`, background: 'rgba(197,160,89,0.04)' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', lineHeight: 1.6, color: 'var(--color-text-primary)', margin: 0, fontStyle: 'italic' }}>
            «La soberanía financiera no se trata de lujos. Se trata de poder cumplir tu palabra.»
          </p>
        </div>
      </Section>

      <Section>
        <div style={{ textAlign: 'center' }}>
          <H2>Si quiere saber cómo funciona, pregúntele a Queswa.</H2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-text-body)', maxWidth: 560, margin: '0 auto 2rem' }}>
            Responde al instante, sin compromiso, y le explica el negocio con sus propias
            palabras.
          </p>
          <QueswaCTAButton className="cta-base cta-primary">Hablar con Queswa</QueswaCTAButton>
        </div>
      </Section>

      <footer style={{ padding: '32px 24px', borderTop: '1px solid rgba(148,163,184,0.12)', textAlign: 'center', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
        © 2026 CreaTuActivo.com · Fundada por Luis Cabrejo
      </footer>
    </main>
  )
}
