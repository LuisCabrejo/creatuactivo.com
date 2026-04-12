/**
 * Copyright © 2026 CreaTuActivo.com
 * PAQUETES - PROTOCOLO DE CAPITALIZACIÓN DE UNIDADES DE SUMINISTRO
 * v3.0 - Lujo Clínico / Hoja de Especificaciones Técnicas
 */

'use client';

import React, { useState } from 'react';
import { CheckCircle, HelpCircle, ChevronDown, BarChart2, Layers, Cpu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
  bronze: '#CD7F32',
  silver: '#94A3B8',
  success: '#10B981',
};

// ============================================================================
// WA LINKS
// ============================================================================

const WA_BASE = 'https://wa.me/573215193909?text=';
const waLink = (pkg: string) =>
  WA_BASE +
  encodeURIComponent(
    `Hola equipo directivo. He completado mi auditoría y solicito la capitalización del paquete ${pkg}. Mi nombre es `
  );

// ============================================================================
// PACKAGE CARD — Hoja de Especificaciones Técnicas
// ============================================================================

function PackageCard({
  title,
  esp,
  priceUSD,
  priceCOP,
  rentabilidad,
  features,
  subsidyMonths,
  icon,
  borderColor,
  waPackage,
  highlighted = false,
}: {
  title: string;
  esp: string;
  priceUSD: string;
  priceCOP: string;
  rentabilidad: string;
  features: string[];
  subsidyMonths: number;
  icon: React.ReactNode;
  borderColor: string;
  waPackage: string;
  highlighted?: boolean;
}) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: highlighted ? 'rgba(26,29,35,0.98)' : 'rgba(22,24,29,0.85)',
        border: `1px solid ${highlighted ? borderColor + '60' : C.gold + '20'}`,
        borderTop: `4px solid ${borderColor}`,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 16px 40px ${borderColor}25`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ padding: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Metal indicator + title */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '3px', background: borderColor, marginBottom: '0.6rem' }} />
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            color: C.textMain,
            fontFamily: "'Rajdhani', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            lineHeight: 1.2,
          }}>
            {title}
          </h3>
          <span style={{
            fontSize: '0.65rem',
            color: borderColor,
            fontFamily: "'Roboto Mono', monospace",
            letterSpacing: '0.12em',
          }}>
            {esp}
          </span>
        </div>

        {/* Price */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: C.gold, fontFamily: "'Rajdhani', sans-serif" }}>
            ${priceUSD}
          </span>
          <span style={{ color: C.textMuted, fontSize: '1rem' }}> USD</span>
          <p style={{ fontSize: '0.8rem', color: C.textDim, fontFamily: "'Roboto Mono', monospace", marginTop: '0.2rem' }}>
            ~ ${priceCOP} COP
          </p>
        </div>

        {/* Rentabilidad row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.6rem 0.75rem',
          background: `${borderColor}12`,
          border: `1px solid ${borderColor}30`,
          marginBottom: '1.25rem',
        }}>
          <BarChart2 style={{ width: 16, height: 16, color: borderColor, flexShrink: 0 }} />
          <span style={{ fontSize: '0.8rem', fontFamily: "'Roboto Mono', monospace", color: C.textMuted }}>
            Rentabilidad: <span style={{ color: borderColor, fontWeight: 700 }}>{rentabilidad}</span>
          </span>
        </div>

        {/* Subsidio de Activación */}
        <div style={{
          padding: '0.875rem 1rem',
          background: C.obsidian,
          border: `1px solid ${borderColor}35`,
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: borderColor, flexShrink: 0 }}>{icon}</div>
            <div>
              <p style={{
                fontWeight: 700,
                color: C.textMain,
                fontSize: '0.8rem',
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: '0.04em',
              }}>
                SUBSIDIO DE ACTIVACIÓN TECNOLÓGICA
              </p>
              <p style={{ fontSize: '0.8rem', color: C.textMuted, marginTop: '0.15rem' }}>
                <span style={{ fontWeight: 600, color: borderColor }}>{subsidyMonths} {subsidyMonths === 1 ? 'Mes' : 'Meses'} de Operación Subvencionada</span>
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <ul style={{ marginBottom: '2rem', flexGrow: 1 }}>
          {features.map((f, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.7rem' }}>
              <CheckCircle style={{ width: 18, height: 18, color: C.success, marginRight: '0.65rem', marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '0.9rem', color: C.textMuted, lineHeight: 1.4 }}>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA → WhatsApp */}
        <a
          href={waLink(waPackage)}
          target="_blank"
          rel="noopener noreferrer"
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
            fontSize: '0.9rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            transition: 'background 0.2s ease, color 0.2s ease',
            display: 'block',
            boxSizing: 'border-box',
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
          INICIAR CAPITALIZACIÓN
        </a>
      </div>
    </div>
  );
}

// ============================================================================
// FAQ ITEM
// ============================================================================

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.gold}20` }}>
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
        <span style={{
          fontWeight: 600,
          fontSize: '1.05rem',
          color: C.textMain,
          fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: '0.02em',
        }}>
          {question}
        </span>
        <div style={{ marginLeft: '1rem', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <ChevronDown style={{ width: 20, height: 20, color: C.cyan }} />
        </div>
      </button>
      <div style={{
        overflow: 'hidden',
        transition: 'max-height 0.3s ease, opacity 0.3s ease',
        maxHeight: isOpen ? '500px' : '0',
        opacity: isOpen ? 1 : 0,
      }}>
        <div style={{ paddingBottom: '1.25rem', color: C.textMuted, lineHeight: 1.75, fontSize: '0.95rem' }}>
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
      <style dangerouslySetInnerHTML={{ __html: `
        .wa-cta-final {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 44px;
          background: linear-gradient(135deg, ${C.goldDark}, #B8860B);
          color: #000;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          font-family: 'Rajdhani', sans-serif;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: none;
        }
        .wa-cta-final:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px ${C.goldDark}50;
        }
        .spec-label {
          font-family: 'Roboto Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          color: ${C.cyan};
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          display: block;
        }
      `}} />

      <div style={{
        backgroundColor: C.obsidian,
        color: C.textMain,
        backgroundImage: `linear-gradient(rgba(15,17,21,0.65), rgba(15,17,21,0.65)), url('/images/servilleta/hormigon-tile.webp')`,
        backgroundSize: 'cover, 600px 600px',
        backgroundRepeat: 'no-repeat, repeat',
      }}>
        <StrategicNavigation />

        {/* ═══════════════════════════════════════════════════════
            HERO
            ═══════════════════════════════════════════════════════ */}
        <section style={{ height: '45vh', position: 'relative', overflow: 'hidden' }}>
          <Image
            src="/images/header-paquetes.jpg"
            alt=""
            fill
            style={{
              objectFit: 'cover',
              filter: 'grayscale(55%) contrast(1.15) brightness(0.8)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
            }}
            priority
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,17,21,0.25) 0%, rgba(15,17,21,0.45) 60%, transparent 100%)' }} />
          <div style={{
            position: 'relative', zIndex: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '100%', padding: '0 1.5rem', textAlign: 'center',
          }}>
            <span className="spec-label">REF: CAPITALIZACIÓN_UNIDADES_SUMINISTRO_V3</span>
            <h1 style={{
              fontSize: 'clamp(1.6rem, 4.5vw, 3rem)',
              color: C.gold,
              lineHeight: 1.1,
              fontFamily: "'Playfair Display', Georgia, serif",
              maxWidth: '800px',
            }}>
              PROTOCOLO DE CAPITALIZACIÓN<br />DE UNIDADES DE SUMINISTRO
            </h1>
          </div>
        </section>

        <main style={{ position: 'relative', zIndex: 10, padding: '0 1rem 2rem' }}>

          {/* ═══════════════════════════════════════════════════════
              INTRO
              ═══════════════════════════════════════════════════════ */}
          <section style={{ textAlign: 'center', maxWidth: '56rem', margin: '0 auto', padding: '5rem 1rem 3rem' }}>
            <span className="spec-label">DIAGNÓSTICO ESTRUCTURAL</span>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              fontWeight: 600,
              marginBottom: '1.5rem',
              fontFamily: "'Playfair Display', Georgia, serif",
              color: C.textMain,
            }}>
              El capital inyectado no es un gasto operativo.
              <br />
              <span style={{ color: C.gold }}>Es la adquisición de un activo biológico tangible.</span>
            </h2>
            <p style={{ fontSize: '1.05rem', color: C.textMuted, lineHeight: 1.8, maxWidth: '640px', margin: '0 auto' }}>
              Su Asignación de Capital se transfiere íntegramente a inventario físico de tecnología nutricional
              que activa sus derechos de cobro en 70 países. No existe cuota de inscripción ni membresía intangible.
            </p>
          </section>

          {/* ═══════════════════════════════════════════════════════
              PRICING TABLES
              ═══════════════════════════════════════════════════════ */}
          <section style={{ padding: '2rem 0 4rem' }}>
            <div style={{ maxWidth: '84rem', margin: '0 auto' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                alignItems: 'stretch',
              }}>
                <PackageCard
                  title="Arquitectura Inicial"
                  esp="ESP-1 — CAPITALIZACIÓN BÁSICA"
                  priceUSD="200"
                  priceCOP="900.000"
                  rentabilidad="15%"
                  subsidyMonths={1}
                  icon={<Layers size={22} />}
                  borderColor={C.bronze}
                  waPackage="ESP-1 Arquitectura Inicial ($200 USD)"
                  features={[
                    'Derechos Operativos Globales — 70 países',
                    'Protocolo EAM de Gestión',
                    'Capa Logística Gano Excel activa',
                    'Dashboard de Patrimonio en Tiempo Real',
                  ]}
                />
                <PackageCard
                  title="Despliegue Empresarial"
                  esp="ESP-2 — CRECIMIENTO SOSTENIDO"
                  priceUSD="500"
                  priceCOP="2.250.000"
                  rentabilidad="16%"
                  subsidyMonths={2}
                  icon={<Cpu size={22} />}
                  borderColor={C.silver}
                  waPackage="ESP-2 Despliegue Empresarial ($500 USD)"
                  highlighted={true}
                  features={[
                    'Todo lo del ESP-1 +',
                    'Capacidad de Despliegue Intermedia',
                    'Consultoría de Arquitectura Prioritaria',
                    'Plusvalía de Red — Nivel Empresarial',
                  ]}
                />
                <PackageCard
                  title="Consolidación Visionaria"
                  esp="ESP-3 — APALANCAMIENTO ASIMÉTRICO MÁXIMO"
                  priceUSD="1,000"
                  priceCOP="4.500.000"
                  rentabilidad="17% — máximo"
                  subsidyMonths={3}
                  icon={<BarChart2 size={22} />}
                  borderColor={C.goldDark}
                  waPackage="ESP-3 Consolidación Visionaria ($1,000 USD)"
                  features={[
                    'Todo lo del ESP-2 +',
                    'Apalancamiento Asimétrico Máximo (17%)',
                    'Consultoría de Arquitectura VIP',
                    'Plusvalía de Red — Nivel Visionario',
                  ]}
                />
              </div>

              {/* Micro-copia inferior */}
              <div style={{
                textAlign: 'center',
                marginTop: '3rem',
                color: C.textDim,
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '0.75rem',
                lineHeight: 1.8,
              }}>
                <p>
                  La inyección de capital se transfiere íntegramente a inventario biológico tangible.
                </p>
                <p>
                  El software Queswa gestiona la automatización logística para eliminar la operación manual.
                </p>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              FAQ
              ═══════════════════════════════════════════════════════ */}
          <section style={{ padding: '4rem 1rem 5rem' }}>
            <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <HelpCircle style={{ width: 44, height: 44, margin: '0 auto 1rem', color: C.cyan }} />
                <h2 style={{
                  fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                  fontWeight: 700,
                  color: C.textMain,
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}>
                  Variables Técnicas de la Capitalización
                </h2>
                <p style={{ marginTop: '0.5rem', color: C.textMuted, fontSize: '0.9rem', fontFamily: "'Roboto Mono', monospace" }}>
                  Auditoría de transparencia sobre la estructura financiera.
                </p>
              </div>
              <div>
                <FaqItem
                  question="¿Qué cubre exactamente la Asignación de Capital inicial?"
                  answer="Su Asignación de Capital es una adquisición de inventario físico de tecnología nutricional de alta rotación. No existe cuota de membresía ni pago por derechos de software. Adicionalmente, esta capitalización activa el acceso vitalicio al ecosistema tecnológico CreaTuActivo, incluyendo la plataforma Queswa y el motor de IA, sin costos adicionales."
                />
                <FaqItem
                  question="¿Cuál es la carga operativa recurrente mensual?"
                  answer="Para mantener su unidad operativa, se requiere un consumo personal mensual de 50 CV (puntos de volumen), equivalente a aproximadamente $450,000 COP. Esta no es una cuota de software; es una adquisición de producto de igual valor que usted y su estructura pueden consumir, manteniendo el flujo de volumen activo en su canal de distribución."
                />
                <FaqItem
                  question="¿Es posible escalar el nivel de capitalización?"
                  answer="Sí. La arquitectura está diseñada para la escalabilidad progresiva. Usted puede iniciar con ESP-1 para validar el flujo operativo y, a medida que su activo genera retornos, ejecutar una capitalización adicional hacia ESP-2 o ESP-3 para acceder a los niveles de rentabilidad superiores y maximizar la Plusvalía de Red."
                />
                <FaqItem
                  question="¿Existen costos ocultos o estructuras de comisión no declaradas?"
                  answer="No. La estructura opera bajo total transparencia financiera. No existen costos de renovación, mantenimiento de infraestructura tecnológica, hosting ni herramientas adicionales. Su Asignación de Capital inicial y su consumo mensual recurrente (a cambio de producto) constituyen la totalidad del requisito operativo para acceder al 100% de las herramientas y derechos."
                />
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              FINAL CTA
              ═══════════════════════════════════════════════════════ */}
          <section style={{ textAlign: 'center', padding: '4rem 1rem 6rem' }}>
            <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
              <span className="spec-label">PROTOCOLO DE SELECCIÓN DIRECTIVA</span>
              <h2 style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
                fontWeight: 700,
                marginBottom: '1.25rem',
                color: C.textMain,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}>
                Los datos técnicos están expuestos.
              </h2>
              <p style={{
                fontSize: '1.05rem',
                marginBottom: '2.5rem',
                color: C.textMuted,
                lineHeight: 1.8,
                maxWidth: '520px',
                margin: '0 auto 2.5rem',
              }}>
                Determine usted el nivel de integración que su arquitectura patrimonial requiere hoy.
                La Dirección asume la fricción administrativa — su único paso es la autorización.
              </p>
              <a
                href={waLink('el nivel que corresponde a su perfil')}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-cta-final"
              >
                SOLICITAR ASIGNACIÓN DE INVENTARIO →
              </a>
            </div>
          </section>
        </main>

        {/* ═══════════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════════ */}
        <footer style={{ padding: '2.5rem 1.5rem', borderTop: `1px solid ${C.gold}20`, position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 600, color: C.gold, fontFamily: "'Rajdhani', sans-serif", fontSize: '1.125rem' }}>
                CreaTuActivo
              </p>
              <p style={{ fontSize: '0.75rem', color: C.textMuted, fontFamily: "'Roboto Mono', monospace", marginTop: '0.25rem' }}>
                SISTEMA DE ARQUITECTURA DE ACTIVOS
              </p>
            </div>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: C.textMuted, fontFamily: "'Roboto Mono', monospace" }}>
              <Link href="/blog" style={{ color: C.textMuted, textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
                BLOG
              </Link>
              <Link href="/privacidad" style={{ color: C.textMuted, textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
                PRIVACIDAD
              </Link>
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
