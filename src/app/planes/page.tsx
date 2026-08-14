/**
 * Copyright © 2026 CreaTuActivo.com
 * PLANES TECNOLÓGICOS — PROTOCOLO DE SUSCRIPCIÓN QUESWA
 * v3.0 - Lujo Clínico / Hoja de Especificaciones SaaS
 */

'use client';

import React from 'react';
import { CheckCircle, Layers, Cpu, BarChart2, Globe } from 'lucide-react';
import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';

// Caché local sincronizado con tokens del sistema (globals.css) — mismo patrón que /paquetes.
// Razón de no usar var(--…) directo: los hex se concatenan con alpha (ej. `${C.gold}18`).
// Si los tokens cambian en globals.css, actualizar también aquí.
const C = {
  gold: '#C5A059',       // var(--color-brand)
  goldDark: '#D4AF37',   // var(--color-brand-hover)
  cyan: '#22D3EE',       // Acento data (consistente con Home y /paquetes)
  obsidian: '#0F1115',   // var(--color-bg-primary)
  gunmetal: '#16181D',
  surface: '#1A1D23',    // var(--color-bg-surface)
  textMain: '#E0DFDB',   // var(--color-text-primary)
  textMuted: '#878681',  // var(--color-text-muted)
  textDim: '#475569',    // var(--color-titanium-dark)
  success: '#408A71',    // var(--color-success) — verde salvia
  bronze: '#B38B59',     // var(--color-brand-muted) — nivel base
  silver: '#94A3B8',     // var(--color-titanium) — nivel intermedio
};

const WA_PLANES = 'https://wa.me/573215193909?text=';
const waLink = (plan: string) =>
  WA_PLANES + encodeURIComponent(`Hola, Queswa. Quiero activar el ${plan} para mi empresa digital. Mi nombre es `);

// ============================================================================
// PLAN CARD
// ============================================================================

function PlanCard({
  tag,
  title,
  price,
  priceCOP,
  priceLabel,
  profile,
  metrics,
  features,
  borderColor,
  accentColor,
  icon,
  ctaText,
  ctaHref,
  ctaExternal = false,
  highlighted = false,
}: {
  tag: string;
  title: string;
  price: string;
  priceCOP?: string;
  priceLabel: string;
  profile: string;
  metrics: { label: string; value: string }[];
  features: string[];
  borderColor: string;
  accentColor: string;
  icon: React.ReactNode;
  ctaText: string;
  ctaHref: string;
  ctaExternal?: boolean;
  highlighted?: boolean;
}) {
  const cardStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: highlighted ? 'rgba(26,29,35,0.98)' : 'rgba(22,24,29,0.85)',
    // Borde glass neutro; el dorado/metal queda para el borde superior y el hover (BRANDING.md)
    border: `1px solid ${highlighted ? borderColor + '55' : 'rgba(255,255,255,0.07)'}`,
    borderTop: `4px solid ${borderColor}`,
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 16px 40px ${borderColor}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ padding: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Tag + icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <div style={{ color: accentColor }}>{icon}</div>
          <span style={{
            fontSize: '0.6rem',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.15em',
            color: accentColor,
            textTransform: 'uppercase',
          }}>
            {tag}
          </span>
        </div>

        {/* Metal bar + title */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '3px', background: borderColor, marginBottom: '0.5rem' }} />
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: C.textMain,
            fontFamily: 'var(--font-sans)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            lineHeight: 1.2,
          }}>
            {title}
          </h3>
        </div>

        {/* Price */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 800, color: C.gold, fontFamily: 'var(--font-sans)' }}>
            {price}
          </span>
          <span style={{ fontSize: '0.85rem', color: C.textMuted, marginLeft: '0.25rem' }}>{priceLabel}</span>
          {priceCOP && (
            <p style={{ fontSize: '0.75rem', color: C.textDim, fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
              ~ ${priceCOP} COP/mes
            </p>
          )}
        </div>

        {/* Profile */}
        <p style={{ fontSize: '0.85rem', color: C.textMuted, lineHeight: 1.6, marginBottom: '1.25rem' }}>
          {profile}
        </p>

        {/* Metrics grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          padding: '0.75rem',
          background: C.obsidian,
          border: `1px solid ${borderColor}25`,
          marginBottom: '1.5rem',
        }}>
          {metrics.map((m, i) => (
            <div key={i}>
              <p style={{ fontSize: '0.6rem', color: C.textDim, fontFamily: 'var(--font-mono)', marginBottom: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {m.label}
              </p>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: accentColor, fontFamily: 'var(--font-sans)' }}>
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {/* Features */}
        <ul style={{ flexGrow: 1, marginBottom: '2rem' }}>
          {features.map((f, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
              <CheckCircle style={{ width: 16, height: 16, color: C.success, marginRight: '0.6rem', marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: C.textMuted, lineHeight: 1.4 }}>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {ctaExternal ? (
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              fontWeight: 700, padding: '12px 20px',
              background: 'transparent', color: borderColor,
              border: `1.5px solid ${borderColor}`,
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              transition: 'background 0.2s, color 0.2s',
              boxSizing: 'border-box',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${borderColor}12`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            {ctaText}
          </a>
        ) : (
          <Link
            href={ctaHref}
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              fontWeight: 700, padding: '12px 20px',
              background: 'transparent', color: borderColor,
              border: `1.5px solid ${borderColor}`,
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              transition: 'background 0.2s, color 0.2s',
              boxSizing: 'border-box',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${borderColor}12`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function PlanesTecnologicosPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .spec-label-planes {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          color: ${C.cyan};
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          display: block;
        }
        .planes-hero-line {
          width: 60px; height: 1px;
          background: ${C.cyan};
          margin: 1.5rem auto;
        }
      `}} />

      <div style={{
        backgroundColor: C.obsidian,
        color: C.textMain,
        minHeight: '100vh',
        backgroundImage: `linear-gradient(rgba(15,17,21,0.70), rgba(15,17,21,0.70)), url('/images/servilleta/hormigon-tile.webp')`,
        backgroundSize: 'cover, 600px 600px',
        backgroundRepeat: 'no-repeat, repeat',
      }}>
        <StrategicNavigation />

        {/* ═══════════════════════════════════════════════════
            HERO — texto
            ═══════════════════════════════════════════════════ */}
        <section style={{
          textAlign: 'center',
          maxWidth: '60rem',
          margin: '0 auto',
          padding: '8rem 1.5rem 4rem',
        }}>
          <span className="spec-label-planes">TECNOLOGÍA QUESWA — PLANES DE SUSCRIPCIÓN</span>
          {/* H1 — regla unificada institucional (Inter uppercase, token --color-brand), igual que /paquetes */}
          <h1 style={{
            fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
            color: 'var(--color-brand)',
            lineHeight: 1.1,
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            La tecnología que trabaja<br />
            <span style={{ color: C.textMain }}>por su empresa digital.</span>
          </h1>
          <div className="planes-hero-line" />
          <p style={{ fontSize: '1.05rem', color: C.textMuted, lineHeight: 1.85, maxWidth: '600px', margin: '0 auto' }}>
            La tecnología Queswa hace el 90% del trabajo pesado.
            La cuota mensual es lo que cuesta tener un sistema que explica, atiende
            y madura en cada interesado la decisión de avanzar, las 24 horas.
          </p>
        </section>

        <main style={{ position: 'relative', zIndex: 10, padding: '0 1rem 4rem' }}>

          {/* ═══════════════════════════════════════════════════
              GRID DE PLANES
              ═══════════════════════════════════════════════════ */}
          <section style={{ padding: '2rem 0 5rem' }}>
            <div style={{ maxWidth: '88rem', margin: '0 auto' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.75rem',
                alignItems: 'stretch',
              }}>

                {/* PLAN BASE — Plan Inicial */}
                <PlanCard
                  tag="PLAN BASE — $25 USD/MES"
                  title="Plan Inicial"
                  price="$25"
                  priceCOP="112.500"
                  priceLabel="USD / mes"
                  profile="La tecnología Queswa para empezar. Para quien inicia su empresa digital."
                  metrics={[
                    { label: 'Prospectos', value: '200' },
                    { label: 'Conversaciones', value: '100/mes' },
                    { label: 'Negocios', value: '1' },
                    { label: 'Queswa', value: '5 min/chat' },
                  ]}
                  features={[
                    'Acceso base a la plataforma CreaTuActivo',
                    'El Método Comprobado — Nivel Fundamentos',
                    'La Academia — Nivel Fundamentos',
                    'Analíticas básicas',
                    'Eliminación de marca corporativa',
                    'Soporte vía comunidad',
                  ]}
                  borderColor={C.bronze}
                  accentColor={C.bronze}
                  icon={<Cpu size={18} />}
                  ctaText="ACTIVAR PLAN INICIAL"
                  ctaHref={waLink('Plan Inicial ($25 USD / $112.500 COP/mes)')}
                  ctaExternal
                />

                {/* PLAN PRO — Plan Crecimiento */}
                <PlanCard
                  tag="PLAN PRO — $49 USD/MES"
                  title="Plan Crecimiento"
                  price="$49"
                  priceCOP="220.500"
                  priceLabel="USD / mes"
                  profile="El estándar para quien ya tiene su empresa digital activa y un canal en crecimiento."
                  metrics={[
                    { label: 'Prospectos', value: '500' },
                    { label: 'Conversaciones', value: '500/mes' },
                    { label: 'Negocios', value: 'Hasta 3' },
                    { label: 'Queswa', value: '10 min/chat' },
                  ]}
                  features={[
                    'Todo lo del Plan Inicial +',
                    'Centro de Mando Queswa en Tiempo Real',
                    'Panel para ver crecer su canal (hasta 3 negocios)',
                    'La Academia — Nivel Avanzado',
                    'Exportación de datos — analíticas avanzadas',
                    'Soporte prioritario por canal directo',
                  ]}
                  borderColor={C.silver}
                  accentColor={C.silver}
                  icon={<BarChart2 size={18} />}
                  ctaText="ACTIVAR PLAN CRECIMIENTO"
                  ctaHref={waLink('Plan Crecimiento ($49 USD / $220.500 COP/mes)')}
                  ctaExternal
                  highlighted
                />

                {/* PLAN ELITE — Plan Multiplicación */}
                <PlanCard
                  tag="PLAN ELITE — $99 USD/MES"
                  title="Plan Multiplicación"
                  price="$99"
                  priceCOP="445.500"
                  priceLabel="USD / mes"
                  profile="Para quien multiplica su empresa digital en varios países a la vez."
                  metrics={[
                    { label: 'Prospectos', value: 'Ilimitados' },
                    { label: 'Conversaciones', value: 'Ilimitadas' },
                    { label: 'Negocios', value: '10+' },
                    { label: 'Queswa', value: 'Sin límites' },
                  ]}
                  features={[
                    'Todo lo del Plan Crecimiento +',
                    'Panel completo para 10+ negocios',
                    'Acceso completo 24/7 sin restricciones',
                    'La Academia — Nivel Multiplicación',
                    'Valor patrimonial de su red de clientes y socios — Nivel Visionario',
                    'Soporte dedicado + sesión estratégica 1-a-1',
                  ]}
                  borderColor={C.goldDark}
                  accentColor={C.gold}
                  icon={<Globe size={18} />}
                  ctaText="ACTIVAR PLAN MULTIPLICACIÓN"
                  ctaHref={waLink('Plan Multiplicación ($99 USD / $445.500 COP/mes)')}
                  ctaExternal
                />

              </div>

              {/* Nota subsidio */}
              <div style={{
                textAlign: 'center',
                marginTop: '3rem',
                color: C.textDim,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                lineHeight: 1.8,
                maxWidth: '600px',
                margin: '3rem auto 0',
              }}>
                <p>Los paquetes ESP-1, ESP-2 y ESP-3 incluyen Subsidio de Activación Tecnológica (1, 2 y 3 meses respectivamente).</p>
                <p style={{ marginTop: '0.5rem' }}>
                  <Link href="/paquetes" style={{ color: C.gold, textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
                    VER LOS PAQUETES DE ACTIVACIÓN →
                  </Link>
                </p>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              BLOQUE DE VALOR — Qué hace la tecnología
              ═══════════════════════════════════════════════════ */}
          <section style={{ padding: '4rem 1rem 5rem', maxWidth: '72rem', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span className="spec-label-planes">QUÉ HACE LA TECNOLOGÍA</span>
              <h2 style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                fontWeight: 700,
                color: C.textMain,
                fontFamily: 'var(--font-serif)',
              }}>
                Lo que el sistema hace sin que usted esté presente.
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {[
                { icon: <Cpu size={28} />, color: C.cyan, title: 'Conversa con cada interesado', body: 'Queswa reconoce a quién está listo y madura la decisión de avanzar, antes de que usted invierta un minuto de atención.' },
                { icon: <BarChart2 size={28} />, color: C.gold, title: 'Atrae y prepara', body: 'El sistema capta, educa y prepara prospectos 24/7, eliminando la búsqueda y el seguimiento manual.' },
                { icon: <Globe size={28} />, color: C.silver, title: 'Alcance Internacional', body: 'Gano Excel fabrica y despacha en más de 60 países: su canal puede crecer donde usted no está, sin requerir su presencia física.' },
                { icon: <Layers size={28} />, color: C.bronze, title: 'Multiplica sin cuello de botella', body: 'Queswa forma a cada socio nuevo. Su tiempo deja de ser el límite de su canal.' },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '1.75rem',
                  background: 'rgba(22,24,29,0.7)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderTop: `3px solid ${item.color}`,
                }}>
                  <div style={{ color: item.color, marginBottom: '1rem' }}>{item.icon}</div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: C.textMain,
                    fontFamily: 'var(--font-sans)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.6rem',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: C.textMuted, lineHeight: 1.65 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              FINAL CTA
              ═══════════════════════════════════════════════════ */}
          <section style={{ textAlign: 'center', padding: '4rem 1rem 6rem' }}>
            <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
              <span className="spec-label-planes">EL SIGUIENTE PASO</span>
              <h2 style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
                fontWeight: 700,
                marginBottom: '1.25rem',
                color: C.textMain,
                fontFamily: 'var(--font-serif)',
              }}>
                El sistema ya está listo para usted.
              </h2>
              <p style={{
                fontSize: '1.05rem',
                color: C.textMuted,
                lineHeight: 1.8,
                maxWidth: '520px',
                margin: '0 auto 2.5rem',
              }}>
                El primer paso es activar su empresa digital.
                El plan tecnológico se incluye con su paquete de productos.
              </p>
              <Link
                href="/paquetes"
                style={{
                  display: 'inline-block',
                  padding: '16px 44px',
                  background: 'rgba(197, 160, 89, 0.1)',
                  border: '1.5px solid rgba(197, 160, 89, 0.4)',
                  color: C.gold,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-sans)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 12px 35px ${C.goldDark}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
VER LOS PAQUETES DE ACTIVACIÓN →
              </Link>
            </div>
          </section>
        </main>

        {/* ═══════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════ */}
        <footer style={{ padding: '2.5rem 1.5rem', borderTop: `1px solid ${C.gold}18`, zIndex: 10, position: 'relative' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 600, color: C.gold, fontFamily: 'var(--font-sans)', fontSize: '1.125rem' }}>CreaTuActivo</p>
              <p style={{ fontSize: '0.75rem', color: C.textMuted, fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
                TECNOLOGÍA PARA SU EMPRESA DIGITAL
              </p>
            </div>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: C.textMuted, fontFamily: 'var(--font-mono)' }}>
              <Link href="/blog" style={{ color: C.textMuted, textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>BLOG</Link>
              <Link href="/privacidad" style={{ color: C.textMuted, textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>PRIVACIDAD</Link>
            </div>
            <p style={{ fontSize: '0.75rem', color: C.textDim, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
              © 2026 CREATUACTIVO.COM · TODOS LOS DERECHOS RESERVADOS
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
