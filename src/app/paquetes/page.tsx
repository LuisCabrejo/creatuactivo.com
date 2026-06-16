/**
 * Copyright © 2026 CreaTuActivo.com
 * /paquetes — Activación de su empresa digital v4.0
 *
 * Rediseño desde cero (16 May 2026) — estilo Home con léxico canónico v26.5:
 *  - H1: "ACTIVACIÓN DE SU EMPRESA DIGITAL" (antes "Base Operativa"; previo "Protocolo de Capitalización de Unidades de Suministro")
 *  - Hero: imagen "Pacto Patrimonial" (apretón institucional) con tratamiento home
 *  - Cards: estilo Home (clip-path geométrico, paleta carbón/dorado/cyan)
 *  - Léxico: "bebidas enriquecidas y suplementos Gano Excel" (no "tecnología nutricional")
 *  - Léxico: "15 países de América" (Operación Continental) — no 70 países
 *  - Sin fondo hormigón, sin frase "Los datos técnicos están expuestos"
 *  - CTAs: "ACTIVAR ESP-X →" (más directos que "INICIAR CAPITALIZACIÓN")
 *  - "Decisión Directiva" reemplaza "Protocolo de Selección Directiva"
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import StrategicNavigation from '@/components/StrategicNavigation';
import { CheckCircle, ChevronDown, BarChart2 } from 'lucide-react';

// Caché local sincronizado con tokens del sistema (globals.css)
// Razón de no usar var(--…) directo: los hex se concatenan con alpha (ej. `${C.gold}30`)
// para opacidades calculadas, lo cual no funciona con CSS custom properties.
// Si los tokens cambian en globals.css, actualizar también aquí.
const C = {
  gold: '#C5A059',                       // var(--color-brand)
  goldHover: '#D4AF37',                  // var(--color-brand-hover)
  cyan: '#22D3EE',                       // Acento data (consistente con Home; sin token equivalente)
  white: '#E0DFDB',                      // var(--color-text-primary) — titanio claro cálido
  muted: '#878681',                      // var(--color-text-muted)
  mutedDark: '#475569',                  // var(--color-titanium-dark)
  bg: '#0F1115',                         // var(--color-bg-primary)
  bgCard: '#1A1D23',                     // var(--color-bg-surface)
  bgCardBorder: 'rgba(255,255,255,0.08)',
  success: '#408A71',                    // var(--color-success) — verde salvia (desaturado)
  bronze: '#B38B59',                     // var(--color-brand-muted) — borde ESP-1
  silver: '#94A3B8',                     // var(--color-titanium) — borde ESP-2
};

// CLIP-PATH para cards (chamfer 8px asimétrico — geometría arquitectónica)
// NO se usa en botones: la investigación prohíbe biseles agresivos en CTAs (estética cyberpunk)
const CLIP_CARD = 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)';

// WhatsApp link factory
const WA_BASE = 'https://wa.me/573206805737?text=';
const waLink = (pkg: string) =>
  WA_BASE + encodeURIComponent(
    `Hola equipo directivo. He completado mi diagnóstico y solicito la activación de mi empresa digital con el paquete ${pkg}. Mi nombre es `
  );

// ============================================================================
// HERO — Pacto Patrimonial
// ============================================================================
function Hero() {
  return (
    <section style={{ position: 'relative', padding: '120px 24px 80px', overflow: 'hidden' }}>
      {/* Hero image (lazy) con mask gradient — misma técnica que home */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        filter: 'grayscale(70%) contrast(1.1) brightness(0.55)',
        opacity: 0.75,
        WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
        pointerEvents: 'none',
      }}>
        <Image
          src="/images/paquetes/pacto-patrimonial.webp"
          alt=""
          fill
          loading="lazy"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          sizes="100vw"
        />
      </div>

      {/* Radial gradient atmosférico (caso fallback si la imagen aún no cargó) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 30%, rgba(34,211,238,0.05) 0%, transparent 60%),
                     radial-gradient(ellipse at 30% 70%, rgba(200,168,75,0.05) 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        {/* Eyebrow */}
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: C.cyan, fontFamily: 'var(--font-mono)',
          marginBottom: '24px',
          textShadow: '0 1px 8px rgba(0,0,0,0.9)',
        }}>
          REF · ACTIVACION_BASE_OPERATIVA
        </p>

        {/* H1 — alineado a la regla unificada (Inter uppercase letter-spacing 0.08em, token --color-brand) */}
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', lineHeight: 1.1,
          marginBottom: '24px',
          fontFamily: 'var(--font-sans)', fontWeight: 700,
          color: 'var(--color-brand)', letterSpacing: '0.08em', textTransform: 'uppercase',
          textShadow: '0 2px 14px rgba(0,0,0,0.95)',
        }}>
          Activación de<br />su empresa digital
        </h1>

        {/* Subtítulo */}
        <p style={{
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.6,
          color: C.white, maxWidth: '640px', margin: '0 auto 16px',
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          textShadow: '0 1px 10px rgba(0,0,0,0.9)',
        }}>
          Tres niveles de capitalización · Inventario premium Gano Excel · 15 países de América.
        </p>

        {/* Micro-copy */}
        <p style={{
          fontSize: '0.78rem', color: C.muted,
          fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
          marginTop: '32px',
          textShadow: '0 1px 8px rgba(0,0,0,1)',
        }}>
          ↓ Auditoría completa de las variables técnicas
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// FRAMING — Qué pasa con el capital
// ============================================================================
function Framing() {
  return (
    <section style={{ position: 'relative', padding: '80px 24px', background: 'rgba(13,13,13,0.6)' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <span style={{
          fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
          letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold,
        }}>
          Asignación de Capital
        </span>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px', marginBottom: '28px',
          fontFamily: 'var(--font-serif)', color: C.white, lineHeight: 1.25,
        }}>
          Su capital se convierte en{' '}
          <span style={{ color: C.gold }}>inventario tangible</span>.
          <br />
          No es una membresía. No es software de pago.
        </h2>
        <div style={{
          padding: '24px 32px',
          background: 'rgba(0,0,0,0.55)',
          borderLeft: `2px solid rgba(200,168,75,0.35)`,
        }}>
          <p style={{ fontSize: '1.02rem', lineHeight: 1.8, color: C.muted, margin: 0 }}>
            Su capital se transfiere íntegramente a inventario premium de{' '}
            <span style={{ color: C.white }}>bebidas enriquecidas y suplementos Gano Excel</span>{' '}
            — un activo tangible que activa sus derechos de cobro en{' '}
            <span style={{ color: C.white, fontWeight: 600 }}>15 países de América</span>.
            El Respaldo Operativo (Pilar 1) absorbe la operación; usted dirige.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PACKAGE CARD — Estilo Home
// ============================================================================
function PackageCard({
  esp, title, priceUSD, priceCOP, rentabilidad, subsidyMonths,
  features, borderColor, accentLabel, highlighted, waPackage,
}: {
  esp: string; title: string; priceUSD: string; priceCOP: string;
  rentabilidad: string; subsidyMonths: number; features: string[];
  borderColor: string; accentLabel: string; highlighted?: boolean; waPackage: string;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        background: highlighted ? 'rgba(200,168,75,0.04)' : 'rgba(0,0,0,0.65)',
        border: highlighted ? `1px solid ${C.gold}` : `1px solid rgba(255,255,255,0.07)`,
        borderTop: `3px solid ${borderColor}`,
        padding: '32px 28px',
        display: 'flex', flexDirection: 'column', gap: '20px',
        clipPath: CLIP_CARD,
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        boxShadow: hover ? `0 18px 40px ${borderColor}30` : 'none',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Etiqueta destacada */}
      {highlighted && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          fontSize: '0.62rem', fontFamily: 'var(--font-mono)',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: C.bg, background: C.gold, padding: '4px 8px', fontWeight: 700,
        }}>
          ★ DESTACADO
        </div>
      )}

      {/* ESP code */}
      <div style={{
        fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: borderColor,
      }}>
        {esp}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'var(--font-sans)', fontSize: '1.25rem',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: C.white, fontWeight: 600, margin: 0, lineHeight: 1.2,
      }}>
        {title}
      </h3>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2.6rem', fontWeight: 700, color: C.gold, lineHeight: 1,
        }}>
          ${priceUSD}
        </span>
        <span style={{ fontSize: '0.85rem', color: C.muted, fontFamily: 'var(--font-mono)' }}>
          USD
        </span>
      </div>
      <p style={{
        fontSize: '0.72rem', color: C.mutedDark,
        fontFamily: 'var(--font-mono)', margin: '-12px 0 0',
        letterSpacing: '0.05em',
      }}>
        ≈ ${priceCOP} COP
      </p>

      {/* Rentabilidad */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 14px',
        background: `${borderColor}10`,
        border: `1px solid ${borderColor}25`,
      }}>
        <BarChart2 size={16} color={borderColor} />
        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: C.muted }}>
          Rentabilidad{' '}
          <span style={{ color: borderColor, fontWeight: 700 }}>{rentabilidad}</span>
        </span>
      </div>

      {/* Subsidio */}
      <div style={{
        padding: '14px 16px',
        background: C.bg,
        border: `1px solid ${borderColor}30`,
      }}>
        <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                       letterSpacing: '0.12em', color: borderColor, marginBottom: '4px' }}>
          {accentLabel}
        </div>
        <div style={{ fontSize: '0.85rem', color: C.white, fontWeight: 500 }}>
          {subsidyMonths} {subsidyMonths === 1 ? 'mes' : 'meses'} de operación subvencionada
        </div>
      </div>

      {/* Features */}
      <ul style={{
        listStyle: 'none', padding: 0, margin: 0,
        display: 'flex', flexDirection: 'column', gap: '10px', flex: 1,
      }}>
        {features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <CheckCircle size={16} color={C.success} style={{ flexShrink: 0, marginTop: '3px' }} />
            <span style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.55 }}>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA — Lujo Silencioso (carbón + borde color del nivel + texto color del nivel)
          Destacado: borde de 2px + glow sutil. Sin gradient sólido. Sin clip-path biselado. */}
      <a
        href={waLink(waPackage)}
        target="_blank"
        rel="noopener noreferrer"
        className="cta-base"
        style={{
          background: highlighted
            ? `${borderColor}12`  // tinte 7% del color del nivel
            : 'transparent',
          color: borderColor,
          border: highlighted ? `2px solid ${borderColor}` : `1.5px solid ${borderColor}`,
          padding: '0.875rem 1.75rem',
          fontSize: '0.85rem',
          marginTop: 'auto',
          boxShadow: highlighted ? `0 0 24px ${borderColor}20` : 'none',
        }}
      >
        Activar {esp.split(' —')[0]} →
      </a>
    </div>
  );
}

// ============================================================================
// 3 NIVELES
// ============================================================================
function Niveles() {
  return (
    <section style={{ padding: '80px 24px', position: 'relative' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{
            fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan,
          }}>
            Los tres niveles
          </span>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px',
            fontFamily: 'var(--font-serif)', color: C.white,
          }}>
            Elija el nivel que su arquitectura patrimonial requiere hoy.
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px', alignItems: 'stretch',
        }}>
          <PackageCard
            esp="ESP-1"
            title="Inicial"
            priceUSD="200"
            priceCOP="900.000"
            rentabilidad="15%"
            subsidyMonths={1}
            accentLabel="SUBSIDIO DE ACTIVACIÓN"
            borderColor={C.bronze}
            waPackage="ESP-1 Inicial ($200 USD / $900.000 COP)"
            features={[
              'Derechos Operativos Continentales — 15 países de América',
              'Respaldo Operativo Gano Excel activo',
              'Método Comprobado activo',
              'Dashboard de Patrimonio en Tiempo Real',
            ]}
          />
          <PackageCard
            esp="ESP-2"
            title="Empresarial"
            priceUSD="500"
            priceCOP="2.250.000"
            rentabilidad="16%"
            subsidyMonths={2}
            accentLabel="SUBSIDIO DE ACTIVACIÓN"
            borderColor={C.silver}
            waPackage="ESP-2 Empresarial ($500 USD / $2.250.000 COP)"
            features={[
              'Todo lo del ESP-1',
              'Capacidad de despliegue intermedia',
              'Consultoría de arquitectura prioritaria',
              'Capitalización de Organización — Nivel Empresarial',
            ]}
          />
          <PackageCard
            esp="ESP-3"
            title="Visionario"
            priceUSD="1,000"
            priceCOP="4.500.000"
            rentabilidad="17% máx"
            subsidyMonths={3}
            accentLabel="SUBSIDIO DE ACTIVACIÓN"
            borderColor={C.gold}
            waPackage="ESP-3 Visionario ($1.000 USD / $4.500.000 COP)"
            features={[
              'Todo lo del ESP-2',
              'Apalancamiento estratégico máximo (17%)',
              'Consultoría de arquitectura VIP',
              'Capitalización de Organización — Nivel Visionario',
            ]}
          />
        </div>

        {/* Micro-copy transparencia */}
        <div style={{
          textAlign: 'center', marginTop: '40px',
          color: C.mutedDark, fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem', lineHeight: 1.8, letterSpacing: '0.05em',
        }}>
          <p style={{ margin: '0 0 4px' }}>
            La asignación de capital se transfiere íntegramente a inventario biológico tangible.
          </p>
          <p style={{ margin: 0 }}>
            Queswa gestiona la automatización operativa para eliminar la fricción manual.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FAQ
// ============================================================================
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid rgba(200,168,75,0.15)` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          textAlign: 'left', padding: '20px 0', background: 'transparent', border: 0, cursor: 'pointer',
          color: C.white, fontFamily: 'var(--font-serif)',
          fontSize: '1.02rem',
        }}
      >
        <span>{q}</span>
        <ChevronDown
          size={18} color={C.cyan}
          style={{ marginLeft: '1rem', transition: 'transform 0.3s ease',
                   transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
        />
      </button>
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? '500px' : '0',
        opacity: open ? 1 : 0,
        transition: 'max-height 0.3s ease, opacity 0.3s ease',
      }}>
        <p style={{
          paddingBottom: '20px', color: C.muted, lineHeight: 1.75,
          fontSize: '0.92rem', margin: 0,
        }}>
          {a}
        </p>
      </div>
    </div>
  );
}

function Faq() {
  return (
    <section style={{ padding: '80px 24px', background: 'rgba(13,13,13,0.6)' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{
            fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan,
          }}>
            Variables Técnicas
          </span>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '16px',
            fontFamily: 'var(--font-serif)', color: C.white,
          }}>
            Auditoría de transparencia.
          </h2>
        </div>
        <div>
          <FaqItem
            q="¿Qué cubre exactamente la asignación de capital inicial?"
            a="Su asignación de capital es una adquisición de inventario físico de bebidas enriquecidas y suplementos Gano Excel — productos de alta rotación. No existe cuota de membresía ni pago por derechos de software. La activación incluye el acceso vitalicio al ecosistema CreaTuActivo y a la plataforma Queswa, sin costos adicionales."
          />
          <FaqItem
            q="¿Cuál es la carga operativa recurrente mensual?"
            a="Para mantener su empresa digital activa, se requiere un consumo mensual de 50 CV (puntos de volumen), equivalente a aproximadamente $450.000 COP. No es una cuota de software — es la adquisición de producto de igual valor que usted y su organización consumen, manteniendo el flujo activo en su canal."
          />
          <FaqItem
            q="¿Es posible escalar el nivel de activación posteriormente?"
            a="Sí. La arquitectura permite escalabilidad progresiva. Usted puede iniciar con ESP-1 para validar el flujo operativo y, a medida que su activo genera retornos, ejecutar una capitalización adicional hacia ESP-2 o ESP-3 para acceder a niveles superiores de rentabilidad y maximizar la Capitalización de Organización."
          />
          <FaqItem
            q="¿Existen costos ocultos o estructuras de comisión no declaradas?"
            a="No. La estructura opera con transparencia total. No existen costos de renovación, mantenimiento de infraestructura tecnológica, hosting ni herramientas adicionales. Su asignación de capital inicial y su consumo mensual recurrente constituyen la totalidad del requisito operativo para acceder al 100% del ecosistema."
          />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA FINAL
// ============================================================================
function CtaFinal() {
  return (
    <section style={{ padding: '100px 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <span style={{
          fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
          letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan,
        }}>
          Decisión Directiva
        </span>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', marginTop: '16px', marginBottom: '20px',
          fontFamily: 'var(--font-serif)', color: C.white, lineHeight: 1.3,
        }}>
          Los tres niveles están definidos.
          <br />
          <span style={{ color: C.gold }}>Su elección es directiva.</span>
        </h2>
        <p style={{
          fontSize: '1rem', color: C.muted, lineHeight: 1.75, marginBottom: '36px',
        }}>
          Determine el nivel que su arquitectura patrimonial requiere hoy.
          La Dirección asume la fricción administrativa — su único paso es la autorización.
        </p>
        <a
          href={waLink('el nivel que corresponde a mi perfil')}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-base cta-primary"
          style={{ padding: '1.125rem 2.5rem', fontSize: '0.95rem' }}
        >
          Solicitar activación →
        </a>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER SIMPLE
// ============================================================================
function Footer() {
  return (
    <footer style={{
      padding: '40px 24px', borderTop: `1px solid rgba(200,168,75,0.15)`,
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: 'var(--font-sans)', color: C.gold,
        fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700,
        margin: '0 0 6px',
      }}>
        CreaTuActivo
      </p>
      <p style={{
        fontFamily: 'var(--font-mono)', color: C.muted,
        fontSize: '0.7rem', letterSpacing: '0.08em', marginBottom: '20px',
      }}>
        Construcción de Estructura Patrimonial
      </p>
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '32px',
        fontSize: '0.78rem', fontFamily: 'var(--font-mono)',
        marginBottom: '16px',
      }}>
        <Link href="/blog" style={{ color: C.muted, textDecoration: 'none' }}>BLOG</Link>
        <Link href="/empresa-digital" style={{ color: C.muted, textDecoration: 'none' }}>AUDITORÍA</Link>
        <Link href="/privacidad" style={{ color: C.muted, textDecoration: 'none' }}>PRIVACIDAD</Link>
      </div>
      <p style={{
        fontFamily: 'var(--font-mono)', color: C.mutedDark,
        fontSize: '0.65rem', letterSpacing: '0.1em', margin: 0,
      }}>
        © 2026 CREATUACTIVO.COM
      </p>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function PaquetesPage() {
  return (
    <div style={{
      backgroundColor: C.bg,
      color: C.white,
      fontFamily: 'var(--font-sans)',
      minHeight: '100vh',
    }}>
      <StrategicNavigation />
      <main>
        <Hero />
        <Framing />
        <Niveles />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  );
}
