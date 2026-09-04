/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /fundadores v8.0 — "Un núcleo de 15" (29 ago 2026)
 *
 * Reescrita sobre la doctrina vigente, con el sistema visual de la Home v15. La v7.1
 * ("The Apple Strategy", Bezos/Amazon, "Franquicia Digital", 150 cupos, fecha de
 * cierre vencida, Método de tres pasos, "cierra el negocio por usted", tuteo
 * mezclado) llevaba meses por detrás del léxico y de las decisiones:
 * - Fundadores NO es orden de llegada: entran más de 15 para escoger 15, con una
 *   conversación de por medio (8 ago 2026). La mecánica de la selección no se
 *   escribe. Se cierra por cupo, no por calendario (31 may 2026).
 * - La cifra es 15 (el núcleo que dice Queswa en el canal), no 150.
 * - Compartir · Recibir y la multiplicación como consecuencia (EAM_01).
 * - Gano Excel y Queswa por su nombre; el mecanismo, nunca el resultado.
 * - Siempre usted. Sin video (léxico viejo). Se conservan los cuatro testimonios
 *   comerciales (Director, 29 ago: hablan del negocio, no del producto) y el
 *   formulario de dos pasos con su API (/api/fundadores → pending_activations).
 * - Fuera "+2,847 personas": sin fuente. Se conserva "12 años" (los del Director).
 * Página noindex desde el 14 ago 2026 (registro por invitación 1-a-1).
 */
'use client'

import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  Factory, Bot, Landmark, Share2, Handshake, Check, CheckCircle,
  Briefcase, Target, Lightbulb, Users, ArrowRight, GraduationCap, KeyRound, Compass,
} from 'lucide-react'
import StrategicNavigation from '@/components/StrategicNavigation'
import QueswaCTAButton from '@/components/QueswaCTAButton'

// Pulido de tipeo (forgiving, no bloquea): "juan pérez" / "JUAN" → "Juan Pérez"
const toTitleCase = (s: string) =>
  s.trim().toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase())
// Deja solo caracteres válidos de teléfono (dígitos, espacio, + - ( ))
const cleanPhone = (s: string) => s.replace(/[^\d\s+()-]/g, '')

const GOLD = 'var(--color-brand)'
const TITANIUM = 'var(--color-titanium)'
const DATA = 'var(--color-data)'

// ─── Primitivas (mismas de la Home v15) ───────────────────────────────────────
function Section({ children, elevated = false, id }: { children: ReactNode; elevated?: boolean; id?: string }) {
  return (
    <section
      id={id}
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
  <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: DATA, marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>{children}</p>
)
const H2 = ({ children }: { children: ReactNode }) => (
  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', lineHeight: 1.3, color: 'var(--color-text-primary)', margin: '0 0 1.5rem' }}>{children}</h2>
)
const Body = ({ children, mt = false }: { children: ReactNode; mt?: boolean }) => (
  <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-text-body)', marginTop: mt ? '1.25rem' : 0 }}>{children}</p>
)
const Strong = ({ children }: { children: ReactNode }) => <strong style={{ color: 'var(--color-text-primary)' }}>{children}</strong>
const Mono = ({ children, color = 'var(--color-text-muted)' }: { children: ReactNode; color?: string }) => (
  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color, margin: '1rem 0 0.35rem' }}>{children}</p>
)
function IconTile({ icon: Icon, tone = 'titanium', size = 44 }: { icon: typeof Factory; tone?: 'titanium' | 'data' | 'gold'; size?: number }) {
  const color = tone === 'data' ? DATA : tone === 'gold' ? GOLD : TITANIUM
  const tint = tone === 'data' ? 'rgba(34,211,238,0.08)' : tone === 'gold' ? 'rgba(197,160,89,0.12)' : 'rgba(148,163,184,0.1)'
  return (
    <div style={{ width: size, height: size, borderRadius: 10, background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon style={{ width: size * 0.5, height: size * 0.5, color }} strokeWidth={1.6} />
    </div>
  )
}
const card = { background: 'var(--color-bg-surface)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '1.5rem' } as const
const inputStyle = {
  width: '100%', padding: '0.85rem 1rem', borderRadius: 4, fontSize: '1rem',
  background: 'rgba(15,17,21,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text-primary)', outline: 'none',
} as const
const label = { fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' } as const

// Perfiles — en usted, sin nombrar lo que la persona dejaría
const arquetipos = [
  { id: 'profesional', icon: Briefcase, title: 'Profesional', description: 'Un ingreso en paralelo a su empleo.' },
  { id: 'emprendedor', icon: Target, title: 'Dueño de negocio', description: 'Un ingreso que no dependa de su presencia.' },
  { id: 'independiente', icon: Lightbulb, title: 'Independiente', description: 'Estabilidad para un ingreso que hoy varía.' },
  { id: 'lider', icon: Users, title: 'Líder de equipo', description: 'Tecnología para un equipo que ya existe.' },
]
const puntosDeArranque = [
  'Kit de Inicio — $443.600 COP',
  'ESP-1 Inicial — $900.000 COP',
  'ESP-2 Empresarial — $2.250.000 COP',
  'ESP-3 Visionario — $4.500.000 COP',
  'Prefiero conversarlo primero',
]
const testimonios = [
  { name: 'Liliana P.', role: 'Empresaria', quote: 'Descubrí que esto no es solo un negocio; es una forma de transformar mi realidad.', ini: 'LP' },
  { name: 'Andrés G.', role: 'Sector salud', quote: 'Con esta tecnología, es como pasar de construir a mano a tener una imprenta 3D.', ini: 'AG' },
  { name: 'Dr. Jonathan', role: 'Médico', quote: 'Como médico, mi tiempo es limitado. Ahora logro resultados con un 20% del esfuerzo.', ini: 'JM' },
  { name: 'Juan Pablo', role: 'Ex-bancario', quote: 'Las personas no siguen un producto, siguen una visión. Esta tecnología es la pieza que faltaba.', ini: 'JP' },
]

export default function FundadoresPage() {
  const [formStep, setFormStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const formTopRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', arquetipo: '', inversion: '' })

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  const scrollToForm = () => document.getElementById('aplicacion')?.scrollIntoView({ behavior: 'smooth' })

  const isStepValid = () => {
    if (formStep === 1) return Boolean(formData.nombre && formData.email && formData.telefono)
    if (formStep === 2) return Boolean(formData.arquetipo && formData.inversion)
    return true
  }
  const nextStep = () => {
    if (isStepValid()) {
      setFormStep((prev) => prev + 1)
      setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formStep === 1) { nextStep(); return }
    if (formStep !== 2) return
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/fundadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          nombre: toTitleCase(formData.nombre),
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          page: 'fundadores-v8',
        }),
      })
      const result = await response.json()
      if (response.ok && result.success) {
        setIsSuccess(true)
        setFormStep(3)
        formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        throw new Error(result.error || 'Error en la solicitud')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un error al enviar su solicitud. Por favor inténtelo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && isStepValid()) {
      e.preventDefault()
      if (formStep === 1) nextStep()
    }
  }
  const selectable = (active: boolean) => ({
    ...card,
    padding: '0.9rem 1rem',
    cursor: 'pointer',
    border: active ? `1px solid ${GOLD}` : '1px solid rgba(255,255,255,0.08)',
    background: active ? 'rgba(197,160,89,0.07)' : 'var(--color-bg-surface)',
  })

  return (
    <main style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
      <StrategicNavigation />

      {/* ═══ HERO ═══ */}
      <section
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 30% 0%, rgba(148,163,184,0.09) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 75% 10%, rgba(197,160,89,0.07) 0%, transparent 65%), var(--color-bg-primary)',
          padding: '72px 1.5rem 4.5rem',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <Eyebrow>Fundadores · fase de cimentación</Eyebrow>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'clamp(2.1rem, 6vw, 3.4rem)', lineHeight: 1.12, color: 'var(--color-text-primary)', margin: '0 0 1.5rem' }}>
            Un núcleo de 15 socios estratégicos.
            <br />
            <span style={{ color: GOLD }}>No es orden de llegada. Es una conversación.</span>
          </h1>
          <p style={{ fontSize: 'clamp(1.05rem, 2.4vw, 1.3rem)', lineHeight: 1.65, color: 'var(--color-text-body)', margin: '0 0 2.5rem', maxWidth: 680 }}>
            CreaTuActivo está en su fase de cimentación: el momento en que se forma el
            equipo que va a recorrer el camino primero. Entran a la conversación más de 15
            para escoger 15. <Strong>Lo que se cierra no es una fecha, es el cupo</Strong> — el
            acompañamiento directo del núcleo fundador es finito, y cada posición ocupada
            reduce la ventana.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button type="button" onClick={scrollToForm} className="cta-base cta-primary">
              Solicitar la conversación <ArrowRight size={16} style={{ marginLeft: 8 }} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ QUÉ SE CONSTRUYE ═══ */}
      <Section elevated>
        <Eyebrow>Qué se construye</Eyebrow>
        <H2>Un canal de distribución a su nombre, con dos fuerzas detrás.</H2>
        <Body>
          Un negocio de distribución de productos premium de bienestar —café y suplementos
          con Ganoderma— que usted maneja desde el celular. Lo que antes era complicado de
          desarrollar, hoy es sencillo, porque el trabajo pesado lo hacen dos.
        </Body>
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          <div style={card}>
            <IconTile icon={Factory} />
            <Mono>Gano Excel</Mono>
            <p style={{ fontSize: '0.98rem', lineHeight: 1.65, color: 'var(--color-text-body)', margin: 0 }}>
              Fabrica y despacha. Más de 30 años, más de 60 países, nueve sedes en
              Colombia. Usted no compra inventario ni entrega pedidos.
            </p>
          </div>
          <div style={{ ...card, border: '1px solid rgba(34,211,238,0.22)' }}>
            <IconTile icon={Bot} tone="data" />
            <Mono color={DATA}>Queswa · en línea</Mono>
            <p style={{ fontSize: '0.98rem', lineHeight: 1.65, color: 'var(--color-text-body)', margin: 0 }}>
              Conversa por WhatsApp con cada interesado, le resuelve las dudas y madura su
              decisión de avanzar, a toda hora.
            </p>
          </div>
          <div style={{ ...card, border: '1px solid rgba(197,160,89,0.45)', background: 'linear-gradient(135deg, rgba(197,160,89,0.06), var(--color-bg-surface))' }}>
            <IconTile icon={Landmark} tone="gold" />
            <Mono color={GOLD}>Su canal</Mono>
            <p style={{ fontSize: '0.98rem', lineHeight: 1.65, color: 'var(--color-text-body)', margin: 0 }}>
              A su nombre, manejado desde el celular. Usted cobra cada vez que su canal
              mueve producto.
            </p>
          </div>
        </div>
      </Section>

      {/* ═══ QUÉ RECIBE UN FUNDADOR ═══ */}
      <Section>
        <Eyebrow>Qué recibe un Fundador</Eyebrow>
        <H2>Lo que recibe quien entra primero.</H2>
        {[
          { icon: Compass, t: 'Acompañamiento directo del núcleo fundador', d: 'Mientras la base se consolida, las conversaciones, las decisiones y los primeros pasos se recorren con quien ya los recorrió. Ese tiempo es finito, y es lo que hace que esta fase sea distinta.' },
          { icon: KeyRound, t: 'creatuactivo.com y queswa.app con su nombre', d: 'Su enlace, su página, el catálogo y Queswa atendiendo a los suyos. Todo lo que hoy está leyendo, a nombre suyo, desde el primer día.' },
          { icon: GraduationCap, t: 'Maestría', d: 'Liderazgo, comunicación, administración de los recursos y el detalle de producto — más la experiencia de socios que ya recorrieron el camino.' },
        ].map((item) => (
          <div key={item.t} style={{ ...card, display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <IconTile icon={item.icon} size={48} />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 0.4rem' }}>{item.t}</h3>
              <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--color-text-body)', margin: 0 }}>{item.d}</p>
            </div>
          </div>
        ))}
      </Section>

      {/* ═══ QUÉ HACE USTED — Compartir · Recibir (EAM_01) ═══ */}
      <Section elevated>
        <Eyebrow>Qué hace usted</Eyebrow>
        <H2>Dos movimientos. Ninguno le exige dejar lo que hace hoy.</H2>
        {[
          { n: '01', icon: Share2, t: 'Compartir', d: 'Usted pasa un enlace a quien quiera. Lo que esa persona recibe ya está preparado: la página, el video y Queswa, a nombre suyo.' },
          { n: '02', icon: Handshake, t: 'Recibir', d: 'Usted saluda a quien llega con interés. Cuando alguien ya decidió, lo recibe de persona a persona y le da la bienvenida — que es justo lo que mejor le sale a un ser humano.' },
        ].map((item) => (
          <div key={item.n} style={{ ...card, display: 'flex', gap: '1.25rem', padding: '1.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
            <IconTile icon={item.icon} size={48} />
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: GOLD }}>{item.n}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.t}</h3>
              </div>
              <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--color-text-body)', margin: 0 }}>{item.d}</p>
            </div>
          </div>
        ))}
        <div style={{ marginTop: '1.5rem', padding: '1.5rem', borderLeft: `2px solid ${GOLD}`, background: 'rgba(197,160,89,0.04)' }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-text-body)', margin: 0 }}>
            Y como es así de sencillo, quien inicia con usted hace exactamente lo mismo.{' '}
            <Strong>De ahí salen la multiplicación de su negocio y el aumento de su facturación.</Strong>
          </p>
        </div>
      </Section>

      {/* ═══ TESTIMONIOS ═══ */}
      <Section>
        <Eyebrow>Quienes ya recorrieron el camino · 12 años de campo</Eyebrow>
        <H2>Lo que dicen los que van adelante.</H2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {testimonios.map((t) => (
            <div key={t.ini} style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(148,163,184,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: TITANIUM }}>{t.ini}</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>{t.name}</p>
                  <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{t.role}</p>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.65, color: 'var(--color-text-body)', fontStyle: 'italic' }}>«{t.quote}»</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ SOLICITUD ═══ */}
      <Section elevated id="aplicacion">
        <div ref={formTopRef} style={{ ...card, padding: 'clamp(1.5rem, 4vw, 3rem)', maxWidth: 640, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Eyebrow>Solicitud</Eyebrow>
            <H2>Solicitar la conversación</H2>
            <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--color-text-body)', margin: 0 }}>
              Este no es un registro abierto. Es una solicitud para conversar directamente
              con Luis Cabrejo.
            </p>
          </div>

          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <CheckCircle size={40} style={{ color: 'var(--color-success)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 0.5rem' }}>Su solicitud entró en revisión.</h3>
              <p style={{ color: 'var(--color-text-body)', margin: 0 }}>Le escribimos por WhatsApp.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {formStep === 1 && (
                <div style={{ display: 'grid', gap: '1.1rem' }}>
                  <div>
                    <label style={label}>Su nombre</label>
                    <input type="text" required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} onBlur={(e) => setFormData({ ...formData, nombre: toTitleCase(e.target.value) })} autoCapitalize="words" autoComplete="name" onKeyDown={handleKeyDown} style={inputStyle} />
                  </div>
                  <div>
                    <label style={label}>WhatsApp</label>
                    <input type="tel" required value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: cleanPhone(e.target.value) })} inputMode="tel" autoComplete="tel" onKeyDown={handleKeyDown} style={inputStyle} />
                  </div>
                  <div>
                    <label style={label}>Correo</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })} inputMode="email" autoComplete="email" onKeyDown={handleKeyDown} style={inputStyle} />
                  </div>
                  <button type="button" onClick={nextStep} disabled={!isStepValid()} className="cta-base cta-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', opacity: isStepValid() ? 1 : 0.5 }}>
                    Continuar <ArrowRight size={16} style={{ marginLeft: 8 }} />
                  </button>
                </div>
              )}

              {formStep === 2 && (
                <div style={{ display: 'grid', gap: '1.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 0.9rem' }}>¿Qué perfil le describe mejor?</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem' }}>
                      {arquetipos.map((arq) => {
                        const active = formData.arquetipo === arq.title
                        const Icon = arq.icon
                        return (
                          <div key={arq.id} onClick={() => setFormData({ ...formData, arquetipo: arq.title })} style={selectable(active)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                              <Icon size={18} style={{ color: active ? GOLD : TITANIUM }} />
                              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>{arq.title}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{arq.description}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 0.9rem' }}>¿Con qué punto de arranque se ve?</h3>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {puntosDeArranque.map((opt) => {
                        const active = formData.inversion === opt
                        return (
                          <div key={opt} onClick={() => setFormData({ ...formData, inversion: opt })} style={{ ...selectable(active), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>{opt}</span>
                            {active && <Check size={16} style={{ color: GOLD }} />}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting || !isStepValid()} className="cta-base cta-primary" style={{ width: '100%', justifyContent: 'center', opacity: isStepValid() && !isSubmitting ? 1 : 0.5 }}>
                    {isSubmitting ? 'Enviando…' : 'Enviar la solicitud'}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </Section>

      {/* ═══ CIERRE ═══ */}
      <Section>
        <div style={{ textAlign: 'center' }}>
          <H2>Al final, el canal es suyo.</H2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-text-body)', maxWidth: 560, margin: '0 auto 2rem' }}>
            Si antes de solicitar la conversación quiere entender cómo funciona, Queswa se
            lo explica ahora mismo, sin compromiso.
          </p>
          <QueswaCTAButton className="cta-base cta-secondary">Hablar con Queswa</QueswaCTAButton>
        </div>
      </Section>

      <footer style={{ padding: '32px 24px', borderTop: '1px solid rgba(148,163,184,0.12)', textAlign: 'center', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
        <p style={{ margin: '0 0 0.5rem' }}>
          <Link href="/privacidad" style={{ color: 'inherit' }}>Privacidad</Link> · <Link href="/terminos" style={{ color: 'inherit' }}>Términos</Link>
        </p>
        © 2026 CreaTuActivo.com · Fundada por Luis Cabrejo
      </footer>
    </main>
  )
}
