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

const C = {
  gold: '#E5C279',
  goldDark: '#D4AF37',
  cyan: '#38BDF8',
  obsidian: '#0F1115',
  gunmetal: '#16181D',
  surface: '#1A1D23',
  textMain: '#E5E5E5',
  textMuted: '#A3A3A3',
  textDim: '#64748B',
  success: '#10B981',
  bronze: '#CD7F32',
  silver: '#94A3B8',
};

const WA_PLANES = 'https://wa.me/573215193909?text=';
const waLink = (plan: string) =>
  WA_PLANES + encodeURIComponent(`Hola equipo directivo. He completado mi auditoría en Queswa y solicito la activación del ${plan}. Mi nombre es `);

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
    border: `1px solid ${highlighted ? borderColor + '55' : C.gold + '18'}`,
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
            fontFamily: "'Roboto Mono', monospace",
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
            fontFamily: "'Rajdhani', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            lineHeight: 1.2,
          }}>
            {title}
          </h3>
        </div>

        {/* Price */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 800, color: C.gold, fontFamily: "'Rajdhani', sans-serif" }}>
            {price}
          </span>
          <span style={{ fontSize: '0.85rem', color: C.textMuted, marginLeft: '0.25rem' }}>{priceLabel}</span>
          {priceCOP && (
            <p style={{ fontSize: '0.75rem', color: C.textDim, fontFamily: "'Roboto Mono', monospace", marginTop: '0.2rem' }}>
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
              <p style={{ fontSize: '0.6rem', color: C.textDim, fontFamily: "'Roboto Mono', monospace", marginBottom: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {m.label}
              </p>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: accentColor, fontFamily: "'Rajdhani', sans-serif" }}>
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
              background: C.obsidian, color: borderColor,
              border: `2px solid ${borderColor}`,
              textDecoration: 'none',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              transition: 'background 0.2s, color 0.2s',
              boxSizing: 'border-box',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = borderColor; e.currentTarget.style.color = '#000'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.obsidian; e.currentTarget.style.color = borderColor; }}
          >
            {ctaText}
          </a>
        ) : (
          <Link
            href={ctaHref}
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              fontWeight: 700, padding: '12px 20px',
              background: C.obsidian, color: borderColor,
              border: `2px solid ${borderColor}`,
              textDecoration: 'none',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              transition: 'background 0.2s, color 0.2s',
              boxSizing: 'border-box',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = borderColor; e.currentTarget.style.color = '#000'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.obsidian; e.currentTarget.style.color = borderColor; }}
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
          font-family: 'Roboto Mono', monospace;
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
          <span className="spec-label-planes">INFRAESTRUCTURA TECNOLÓGICA — PROTOCOLO DE SUSCRIPCIÓN</span>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: C.gold,
            lineHeight: 1.1,
            fontFamily: "'Playfair Display', Georgia, serif",
            marginBottom: '1rem',
          }}>
            La Tasa por la Automatización<br />
            <span style={{ color: C.textMain }}>de su Patrimonio.</span>
          </h1>
          <div className="planes-hero-line" />
          <p style={{ fontSize: '1.05rem', color: C.textMuted, lineHeight: 1.85, maxWidth: '600px', margin: '0 auto' }}>
            La tecnología Queswa asume el 90% de su fricción operativa.
            El costo del software es el peaje por la automatización asíncrona de su activo —
            opera las 24 horas, filtra prospectos y gestiona su red sin su intervención directa.
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

                {/* PLAN 0 — Protocolo de Auditoría */}
                <PlanCard
                  tag="FASE 0 — SUBVENCIONADO"
                  title="Protocolo de Auditoría"
                  price="Subvencionado"
                  priceLabel="— 5 días"
                  profile="Acceso provisional para validación de viabilidad de perfil. La corporación asume el costo operativo de esta fase."
                  metrics={[
                    { label: 'Duración', value: '5 Días' },
                    { label: 'Conversaciones', value: '30' },
                    { label: 'Prospectos', value: '30' },
                    { label: 'Soporte', value: 'Comunidad' },
                  ]}
                  features={[
                    'Acceso provisional al ecosistema Queswa',
                    'Auditoría de la infraestructura tecnológica',
                    'Evaluación de compatibilidad de perfil',
                    'La Academia — Módulo introductorio',
                    '2 minutos máximo por conversación',
                  ]}
                  borderColor={C.success}
                  accentColor={C.success}
                  icon={<Layers size={18} />}
                  ctaText="INICIAR AUDITORÍA"
                  ctaHref="/mapa-de-salida"
                />

                {/* PLAN BASE — Activación de Unidad Logística */}
                <PlanCard
                  tag="PLAN BASE — $25 USD/MES"
                  title="Activación de Unidad Logística"
                  price="$25"
                  priceCOP="112.500"
                  priceLabel="USD / mes"
                  profile="Mantenimiento base de la capa Queswa para operaciones locales. Para constructores que inician su unidad de suministro."
                  metrics={[
                    { label: 'Prospectos', value: '200' },
                    { label: 'Conversaciones', value: '100/mes' },
                    { label: 'Red', value: '1 Unidad' },
                    { label: 'Queswa', value: '5 min/chat' },
                  ]}
                  features={[
                    'Derechos Operativos base — plataforma CreaTuActivo',
                    'Protocolo EAM de Gestión — Nivel Fundamentos',
                    'La Academia — Nivel Fundamentos',
                    'Analíticas de flujo básicas',
                    'Eliminación de marca corporativa',
                    'Soporte vía comunidad',
                  ]}
                  borderColor={C.bronze}
                  accentColor={C.bronze}
                  icon={<Cpu size={18} />}
                  ctaText="ACTIVAR UNIDAD LOGÍSTICA"
                  ctaHref={waLink('Plan Base — Activación de Unidad Logística ($25 USD / $112.500 COP/mes)')}
                  ctaExternal
                />

                {/* PLAN PRO — Gestión de Infraestructura Empresarial */}
                <PlanCard
                  tag="PLAN PRO — $49 USD/MES"
                  title="Gestión de Infraestructura Empresarial"
                  price="$49"
                  priceCOP="220.500"
                  priceLabel="USD / mes"
                  profile="El estándar para Arquitectos con unidades de suministro activas. Capacidad de despliegue intermedia."
                  metrics={[
                    { label: 'Prospectos', value: '500' },
                    { label: 'Conversaciones', value: '500/mes' },
                    { label: 'Red', value: 'Hasta 3 Unidades' },
                    { label: 'Queswa', value: '10 min/chat' },
                  ]}
                  features={[
                    'Todo lo del Plan Base +',
                    'Dashboard de Patrimonio en Tiempo Real',
                    'Panel de Gestión de Red (hasta 3 unidades)',
                    'La Academia — Nivel Arquitectura Avanzada',
                    'Exportación de datos — analíticas avanzadas',
                    'Soporte prioritario por canal directo',
                  ]}
                  borderColor={C.silver}
                  accentColor={C.silver}
                  icon={<BarChart2 size={18} />}
                  ctaText="ACTIVAR INFRAESTRUCTURA EMPRESARIAL"
                  ctaHref={waLink('Plan Pro — Gestión de Infraestructura Empresarial ($49 USD / $220.500 COP/mes)')}
                  ctaExternal
                  highlighted
                />

                {/* PLAN ELITE — Protocolo de Dirección Global */}
                <PlanCard
                  tag="PLAN ELITE — $99 USD/MES"
                  title="Protocolo de Dirección Global"
                  price="$99"
                  priceCOP="445.500"
                  priceLabel="USD / mes"
                  profile="Para perfiles directivos que orquestan tráfico en múltiples mercados internacionales con expansión global."
                  metrics={[
                    { label: 'Prospectos', value: 'Ilimitados' },
                    { label: 'Conversaciones', value: 'Ilimitadas' },
                    { label: 'Red', value: '10+ Unidades' },
                    { label: 'Queswa', value: 'Sin límites' },
                  ]}
                  features={[
                    'Todo lo del Plan Pro +',
                    'Panel de Dirección Global — 10+ unidades',
                    'Acceso completo 24/7 sin restricciones',
                    'La Academia — Nivel Maestría',
                    'Plusvalía de Red — Nivel Visionario',
                    'Soporte dedicado + sesión estratégica 1-a-1',
                  ]}
                  borderColor={C.goldDark}
                  accentColor={C.gold}
                  icon={<Globe size={18} />}
                  ctaText="ACTIVAR PROTOCOLO GLOBAL"
                  ctaHref={waLink('Plan Elite — Protocolo de Dirección Global ($99 USD / $445.500 COP/mes)')}
                  ctaExternal
                />

              </div>

              {/* Nota subsidio */}
              <div style={{
                textAlign: 'center',
                marginTop: '3rem',
                color: C.textDim,
                fontFamily: "'Roboto Mono', monospace",
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
                    VER PROTOCOLO DE CAPITALIZACIÓN DE UNIDADES →
                  </Link>
                </p>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              BLOQUE DE VALOR — El peaje
              ═══════════════════════════════════════════════════ */}
          <section style={{ padding: '4rem 1rem 5rem', maxWidth: '72rem', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span className="spec-label-planes">ARQUITECTURA DE VALOR</span>
              <h2 style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                fontWeight: 700,
                color: C.textMain,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}>
                Lo que el software ejecuta mientras usted duerme.
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {[
                { icon: <Cpu size={28} />, color: C.cyan, title: 'Filtrado Asíncrono', body: 'Queswa califica y descarta perfiles no viables antes de que usted invierta un minuto de atención directiva.' },
                { icon: <BarChart2 size={28} />, color: C.gold, title: 'Tracción Inbound', body: 'El sistema captura, educa y prepara prospectos 24/7, eliminando la prospección manual y la fricción operativa.' },
                { icon: <Globe size={28} />, color: C.silver, title: 'Alcance Multinacional', body: 'Su infraestructura opera en 70 países de forma simultánea sin requerir su presencia física en ningún mercado.' },
                { icon: <Layers size={28} />, color: C.bronze, title: 'Escalabilidad sin Cuello de Botella', body: 'La transferencia de protocolos tácticos ocurre de forma autónoma. Su tiempo no es el límite de su organización.' },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '1.75rem',
                  background: 'rgba(22,24,29,0.7)',
                  border: `1px solid ${C.gold}18`,
                  borderTop: `3px solid ${item.color}`,
                }}>
                  <div style={{ color: item.color, marginBottom: '1rem' }}>{item.icon}</div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: C.textMain,
                    fontFamily: "'Rajdhani', sans-serif",
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
              <span className="spec-label-planes">SIGUIENTE PASO LÓGICO</span>
              <h2 style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
                fontWeight: 700,
                marginBottom: '1.25rem',
                color: C.textMain,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}>
                La infraestructura está operativa.
              </h2>
              <p style={{
                fontSize: '1.05rem',
                color: C.textMuted,
                lineHeight: 1.8,
                maxWidth: '520px',
                margin: '0 auto 2.5rem',
              }}>
                El primer paso es la capitalización de su Unidad de Suministro.
                El plan tecnológico se activa junto con su inventario.
              </p>
              <Link
                href="/paquetes"
                style={{
                  display: 'inline-block',
                  padding: '16px 44px',
                  background: `linear-gradient(135deg, ${C.goldDark}, #B8860B)`,
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  fontFamily: "'Rajdhani', sans-serif",
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
                VER PROTOCOLO DE CAPITALIZACIÓN →
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
              <p style={{ fontWeight: 600, color: C.gold, fontFamily: "'Rajdhani', sans-serif", fontSize: '1.125rem' }}>CreaTuActivo</p>
              <p style={{ fontSize: '0.75rem', color: C.textMuted, fontFamily: "'Roboto Mono', monospace", marginTop: '0.25rem' }}>
                SISTEMA DE ARQUITECTURA DE ACTIVOS
              </p>
            </div>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: C.textMuted, fontFamily: "'Roboto Mono', monospace" }}>
              <Link href="/blog" style={{ color: C.textMuted, textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>BLOG</Link>
              <Link href="/privacidad" style={{ color: C.textMuted, textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>PRIVACIDAD</Link>
            </div>
            <p style={{ fontSize: '0.75rem', color: C.textDim, fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.1em' }}>
              © 2026 CREATUACTIVO.COM · TODOS LOS DERECHOS RESERVADOS
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
