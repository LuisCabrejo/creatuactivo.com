/**
 * Copyright © 2026 CreaTuActivo.com
 * PAQUETES - INFRAESTRUCTURA DE APALANCAMIENTO
 * v2.0 - INDUSTRIAL LUXURY (Hard Surface + Turbina Header)
 * Pricing Tables estilo Panel de Control de Maquinaria
 */

'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle, HelpCircle, ChevronDown, Crown, Zap, Rocket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import StrategicNavigation from '@/components/StrategicNavigation';

const C = {
  gold: '#E5C279',
  goldDark: '#D4AF37',
  amber: '#F59E0B',
  cyan: '#38BDF8',
  obsidian: '#0B0C0C',
  gunmetal: '#16181D',
  textMain: '#E5E5E5',
  textMuted: '#A3A3A3',
  textDim: '#64748B',
  // Metales para bordes de paquetes
  bronze: '#CD7F32',
  silver: '#94A3B8',
};

// ============================================================================
// PACKAGE CARD - Estilo Panel de Control Industrial
// ============================================================================

function PackageCard({
  title,
  priceUSD,
  priceCOP,
  features,
  bonusMonths,
  bonusPlan,
  bonusIcon,
  borderColor,
  ctaText = "Seleccionar Plan"
}: {
  title: string;
  priceUSD: string;
  priceCOP: string;
  features: string[];
  bonusMonths: number;
  bonusPlan: string;
  bonusIcon: React.ReactNode;
  borderColor: string;
  ctaText?: string;
}) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(22, 24, 29, 0.80)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${C.gold}26`,
        borderTop: `4px solid ${borderColor}`,
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 12px 32px ${borderColor}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ padding: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header con metal indicator */}
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              display: 'inline-block',
              width: '32px',
              height: '3px',
              background: borderColor,
              marginBottom: '0.5rem',
            }}
          />
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: C.textMain,
              fontFamily: "'Rajdhani', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {title}
          </h3>
        </div>

        {/* Precio */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: C.gold,
              fontFamily: "'Rajdhani', sans-serif",
            }}
          >
            ${priceUSD}
          </span>
          <span style={{ color: C.textMuted, fontSize: '1rem' }}> USD</span>
          <p
            style={{
              fontSize: '0.875rem',
              color: C.textDim,
              fontFamily: "'Roboto Mono', monospace",
              marginTop: '0.25rem',
            }}
          >
            ~ ${priceCOP} COP
          </p>
        </div>

        {/* Bonus Box - RECTANGULAR */}
        <div
          style={{
            padding: '1rem',
            background: C.obsidian,
            border: `1px solid ${borderColor}40`,
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: borderColor }}>{bonusIcon}</div>
            <div>
              <p
                style={{
                  fontWeight: 700,
                  color: C.textMain,
                  fontSize: '0.875rem',
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                BONO TECNOLÓGICO INCLUIDO
              </p>
              <p style={{ fontSize: '0.875rem', color: C.textMuted }}>
                <span style={{ fontWeight: 600, color: borderColor }}>{bonusMonths} Meses Cortesía</span>{' '}
                del {bonusPlan}
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <ul style={{ marginBottom: '2rem', flexGrow: 1, color: C.textMuted }}>
          {features.map((feature, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '0.75rem',
              }}
            >
              <CheckCircle
                style={{
                  width: '20px',
                  height: '20px',
                  color: '#10B981',
                  marginRight: '0.75rem',
                  marginTop: '2px',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '0.95rem' }}>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button - Industrial */}
        <Link
          href="/fundadores"
          style={{
            width: '100%',
            textAlign: 'center',
            fontWeight: 700,
            padding: '14px 24px',
            background: C.obsidian,
            color: borderColor,
            border: `2px solid ${borderColor}`,
            textDecoration: 'none',
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.95rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            transition: 'all 0.2s ease',
            display: 'block',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = borderColor;
            e.currentTarget.style.color = '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = C.obsidian;
            e.currentTarget.style.color = borderColor;
          }}
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
}

// ============================================================================
// FAQ ITEM - Rectangular
// ============================================================================

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.gold}26` }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'left',
          padding: '1.25rem 0',
          background: 'transparent',
          border: 0,
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: '1.125rem',
            color: C.textMain,
            fontFamily: "'Rajdhani', sans-serif",
          }}
        >
          {question}
        </span>
        <div
          style={{
            marginLeft: '1rem',
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <ChevronDown style={{ width: '20px', height: '20px', color: C.cyan }} />
        </div>
      </button>
      <div
        style={{
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          maxHeight: isOpen ? '400px' : '0',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div style={{ paddingBottom: '1.25rem', color: C.textMuted, lineHeight: 1.7 }}>
          {answer}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function PaquetesPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .final-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 40px;
          background: linear-gradient(135deg, ${C.amber}, #E9A23B);
          color: #000;
          font-weight: 700;
          font-size: 1.125rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          font-family: 'Rajdhani', sans-serif;
          clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
          transition: all 0.2s ease;
        }
        .final-cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px ${C.amber}40;
        }
      `}} />

      <div
        style={{
          backgroundColor: C.obsidian,
          color: C.textMain,
          position: 'relative',
          backgroundImage: `linear-gradient(rgba(12,12,12,0.62), rgba(12,12,12,0.62)), url('/images/servilleta/fondo-global-hormigon.jpg?v=20260208')`,
          backgroundSize: 'cover, 600px 600px',
          backgroundRepeat: 'no-repeat, repeat',
          backgroundAttachment: 'scroll, scroll',
        }}
      >
        <StrategicNavigation />

        {/* ═══════════════════════════════════════════════════════════════
            HEADER: Turbina Dorada (Dramático)
            ═══════════════════════════════════════════════════════════════ */}
        <section style={{ height: '45vh', position: 'relative', overflow: 'hidden' }}>
          <Image
            src="/images/header-paquetes.jpg"
            alt=""
            fill
            style={{
              objectFit: 'cover',
              filter: 'grayscale(50%) contrast(1.15) brightness(0.85)',
              opacity: 0.95,
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            }}
            priority
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(11,12,12,0.2) 0%, rgba(11,12,12,0.35) 60%, transparent 100%)',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '0 1.5rem',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                color: C.gold,
                lineHeight: 1.1,
                marginBottom: '1rem',
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              INFRAESTRUCTURA DE APALANCAMIENTO
            </h1>
            <div style={{ width: '3rem', height: '1px', background: C.cyan, margin: '0 auto 0.75rem' }} />
            <span
              style={{
                fontSize: '0.7rem',
                color: C.cyan,
                letterSpacing: '0.15em',
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              REF: PRICING_TURBINA_V2
            </span>
          </div>
        </section>

        <main style={{ position: 'relative', zIndex: 10, padding: '1rem 1rem 2rem' }}>
          {/* ═══════════════════════════════════════════════════════════════
              INTRO SECTION
              ═══════════════════════════════════════════════════════════════ */}
          <section style={{ textAlign: 'center', maxWidth: '56rem', margin: '0 auto', padding: '5rem 1rem' }}>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 600,
                marginBottom: '1.5rem',
                fontFamily: "'Playfair Display', Georgia, serif",
                color: C.textMain,
              }}
            >
              Tu Punto de Entrada a la{' '}
              <span style={{ color: C.gold }}>Arquitectura.</span>
            </h2>
            <p style={{ fontSize: '1.125rem', color: C.textMuted, lineHeight: 1.7 }}>
              Esto no es un costo, es la inversión inicial para adquirir tu propia franquicia digital.
              Elige el paquete que mejor se alinee con tu visión de construcción.
            </p>
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              PRICING TABLES - Paneles de Control Industrial
              ═══════════════════════════════════════════════════════════════ */}
          <section style={{ padding: '3rem 1rem' }}>
            <div style={{ maxWidth: '84rem', margin: '0 auto' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem',
                  alignItems: 'stretch',
                }}
              >
                <PackageCard
                  title="Constructor Inicial"
                  priceUSD="200"
                  priceCOP="900.000"
                  bonusMonths={2}
                  bonusPlan="Plan Cimiento"
                  bonusIcon={<Zap size={24} />}
                  borderColor={C.bronze}
                  features={[
                    'Acceso completo al ecosistema',
                    'Método completo',
                    'Inventario inicial de validación',
                    'Tecnología NodeX incluida',
                  ]}
                  ctaText="Activar como Inicial"
                />
                <PackageCard
                  title="Constructor Empresarial"
                  priceUSD="500"
                  priceCOP="2.250.000"
                  bonusMonths={4}
                  bonusPlan="Plan Estructura"
                  bonusIcon={<Rocket size={24} />}
                  borderColor={C.silver}
                  features={[
                    'Todo lo del plan Inicial +',
                    'Inventario para operación profesional',
                    'Consultoría estratégica prioritaria',
                    'Optimización de primeros flujos',
                  ]}
                  ctaText="Activar como Empresarial"
                />
                <PackageCard
                  title="Constructor Visionario"
                  priceUSD="1,000"
                  priceCOP="4.500.000"
                  bonusMonths={6}
                  bonusPlan="Plan Rascacielos"
                  bonusIcon={<Crown size={24} />}
                  borderColor={C.goldDark}
                  features={[
                    'Todo lo del plan Empresarial +',
                    'Inventario premium de máximo potencial',
                    'Consultoría estratégica VIP',
                    'Construcción acelerada desde día 1',
                  ]}
                  ctaText="Activar como Visionario"
                />
              </div>
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '3rem',
                  color: C.textMuted,
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '0.875rem',
                }}
              >
                <p>TODOS LOS PAQUETES INCLUYEN ACCESO TOTAL A LA PLATAFORMA CREATUACTIVO.COM</p>
                <p style={{ marginTop: '0.5rem' }}>
                  Como Fundador, tu paquete desbloquea meses de cortesía de nuestra maquinaria tecnológica.
                  <Link
                    href="/planes"
                    style={{
                      fontWeight: 600,
                      marginLeft: '0.5rem',
                      color: C.gold,
                      textDecoration: 'none',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    VER DETALLES DE PLANES →
                  </Link>
                </p>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              FAQ SECTION
              ═══════════════════════════════════════════════════════════════ */}
          <section style={{ padding: '5rem 1rem' }}>
            <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <HelpCircle
                  style={{ width: '48px', height: '48px', margin: '0 auto 1rem', color: C.cyan }}
                />
                <h2
                  style={{
                    fontSize: 'clamp(1.875rem, 4vw, 2.5rem)',
                    fontWeight: 700,
                    color: C.textMain,
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Preguntas Clave sobre tu Inversión
                </h2>
                <p style={{ marginTop: '0.5rem', color: C.textMuted }}>
                  Respuestas transparentes para constructores inteligentes.
                </p>
              </div>
              <div>
                <FaqItem
                  question="¿Qué cubre exactamente la inversión inicial?"
                  answer="Tu inversión inicial es una compra de producto que te da un inventario para consumir ('ser producto del producto') y compartir. No es una cuota de membresía. Adicionalmente, esta compra desbloquea el acceso vitalicio y sin costo a todo el ecosistema tecnológico de CreaTuActivo.com, incluyendo NodeX y NEXUS IA."
                />
                <FaqItem
                  question="¿Cuál es la inversión recurrente mensual?"
                  answer="Para mantener tu activo operativo, se requiere un consumo personal mensual de 50 CV (puntos de volumen), que equivale a aproximadamente $450,000 COP. Es importante destacar que esto no es un pago por el software; es una compra de productos de igual valor que tú y tu familia pueden consumir, manteniendo así el flujo de valor en tu canal de distribución."
                />
                <FaqItem
                  question="¿Puedo cambiar de paquete más adelante?"
                  answer="Sí, el sistema está diseñado para la escalabilidad. Puedes iniciar con el paquete Emprendedor para validar el modelo y, a medida que tu activo crece y genera ingresos, puedes hacer un 'upgrade' a los paquetes superiores para maximizar tu potencial de ganancias y acceder a mayores beneficios."
                />
                <FaqItem
                  question="¿Existen costos ocultos o adicionales?"
                  answer="No. Nuestra filosofía es de total transparencia. No hay costos de renovación, mantenimiento de software, hosting o herramientas adicionales. Tu inversión inicial y tu consumo mensual recurrente (que es a cambio de producto) es todo lo que se requiere para operar tu activo con el 100% de las herramientas."
                />
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              FINAL CTA
              ═══════════════════════════════════════════════════════════════ */}
          <section style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
              <Crown
                style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', color: C.gold }}
              />
              <h2
                style={{
                  fontSize: 'clamp(1.875rem, 5vw, 3rem)',
                  fontWeight: 700,
                  marginBottom: '1.5rem',
                  color: C.textMain,
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                Listo para Iniciar la Construcción.
              </h2>
              <p
                style={{
                  fontSize: '1.125rem',
                  marginBottom: '2.5rem',
                  color: C.textMuted,
                  lineHeight: 1.7,
                }}
              >
                Has visto el valor, la transparencia y el potencial. El siguiente paso es unirte al grupo
                de pioneros que están definiendo esta nueva categoría.
              </p>
              <a href="/fundadores" className="final-cta-btn">
                Convertirme en Fundador <ArrowRight size={20} />
              </a>
            </div>
          </section>
        </main>

        {/* ═══════════════════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════════════════ */}
        <footer
          style={{
            padding: '2.5rem 1.5rem',
            borderTop: `1px solid ${C.gold}26`,
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div
            style={{
              maxWidth: '80rem',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontWeight: 600,
                  color: C.gold,
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '1.125rem',
                }}
              >
                CreaTuActivo
              </p>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: C.textMuted,
                  fontFamily: "'Roboto Mono', monospace",
                  marginTop: '0.25rem',
                }}
              >
                SISTEMA DE ARQUITECTURA DE ACTIVOS
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '2rem',
                fontSize: '0.875rem',
                color: C.textMuted,
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              <Link
                href="/blog"
                style={{ color: C.textMuted, textDecoration: 'none', transition: 'opacity 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                BLOG
              </Link>
              <Link
                href="/privacidad"
                style={{ color: C.textMuted, textDecoration: 'none', transition: 'opacity 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                PRIVACIDAD
              </Link>
            </div>
            <p
              style={{
                fontSize: '0.75rem',
                color: C.textDim,
                fontFamily: "'Roboto Mono', monospace",
                letterSpacing: '0.1em',
              }}
            >
              © 2026 CREATUACTIVO.COM · TODOS LOS DERECHOS RESERVADOS
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
