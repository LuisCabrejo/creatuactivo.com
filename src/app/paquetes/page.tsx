/**
 * Copyright © 2026 CreaTuActivo.com
 * /paquetes — Activación de su canal de distribución v6.0
 *
 * Página creada desde cero (14 ago 2026). El copy completo se calibró con el
 * Director EN EL CHAT antes de escribir este archivo («va todo») — flujo
 * canónico: primero el texto, después la página. NO parchear: si el copy
 * cambia, se vuelve a conversar y se reescribe.
 *
 * Fuentes del copy:
 *  - arsenal_12_niveles v5.2 (INV_02/INV_03/NIVELES_03): cifras oficiales de los
 *    CUATRO paquetes. Kit de Inicio $443.600 · ESP-1 $900.000 · ESP-2 $2.250.000 ·
 *    ESP-3 $4.500.000 COP. Frases de perfil literales del arsenal («tomar ritmo»,
 *    «ir en serio», «máximo impacto»).
 *  - Doctrina de fluidez: tesis en la primera línea, sin negaciones de apertura,
 *    una pregunta una salida.
 *
 * Reglas de la página:
 *  - COP unidad principal, USD referencia (decisión Director 14 ago).
 *  - Precio y comisión NO conviven en un bloque: la nomenclatura del plan
 *    (CV · Regalía de Equipo · GEN5) vive en su propia tabla, literal.
 *  - CERO montos de GEN5 junto a precios (promesa de ingreso).
 *  - La limitación del Kit se dice EN POSITIVO en su card («activa una de las
 *    dos vías») — decisión del Director en la calibración.
 *  - Sin clip-path en botones; chamfer solo en cards. Un solo <h1>.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import StrategicNavigation from '@/components/StrategicNavigation';
import { CheckCircle, ChevronDown, ArrowRight } from 'lucide-react';

// Caché local sincronizado con tokens del sistema (globals.css).
// Razón de no usar var(--…) directo: los hex se concatenan con alpha (`${C.gold}18`).
const C = {
  gold: '#C5A059',       // var(--color-brand)
  goldHover: '#D4AF37',  // var(--color-brand-hover)
  cyan: '#22D3EE',       // acento data (consistente con Home)
  white: '#E0DFDB',      // var(--color-text-primary)
  body: '#C8C7C2',       // var(--color-text-body)
  muted: '#878681',      // var(--color-text-muted)
  mutedDark: '#475569',  // var(--color-titanium-dark)
  bg: '#0F1115',         // var(--color-bg-primary)
  surface: '#1A1D23',    // var(--color-bg-surface)
  success: '#408A71',    // var(--color-success)
  bronze: '#B38B59',     // var(--color-brand-muted)
  silver: '#94A3B8',     // var(--color-titanium)
};

const CLIP_CARD = 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)';

const WA_BASE = 'https://wa.me/573215193909?text=';
const waActivar = (pkg: string) =>
  WA_BASE + encodeURIComponent(
    `Hola, Queswa. Quiero activar mi canal de distribución con el ${pkg}. Mi nombre es `
  );
const WA_PREGUNTAS =
  WA_BASE + encodeURIComponent(
    'Hola, Queswa. Estoy viendo los paquetes de activación y tengo unas preguntas. '
  );

// ════════════════════════════════════════════════════════════════════════════
// DATOS — copy calibrado con el Director (14 ago 2026). Cifras del arsenal.
// ════════════════════════════════════════════════════════════════════════════

interface Paquete {
  codigo: string;
  nombre: string;
  precioCOP: string;
  precioUSD: string;
  perfil: string;
  color: string;
  destacado?: boolean;
  features: string[];
  nota?: boolean;   // card del Kit: puerta de Los 12 Niveles + una de las dos vías
  wa: string;
  cta: string;
}

const COMUNES = [
  'Acceso a CreaTuActivo.com y a Queswa',
  'Su código de socio, permanente y heredable',
];

const PAQUETES: Paquete[] = [
  {
    codigo: 'KIT',
    nombre: 'Kit de Inicio',
    precioCOP: '443.600',
    precioUSD: '98',
    perfil: 'La entrada más accesible',
    color: '#94A3B8',
    features: ['4 cajas de Gano Café 3en1', 'My Gano Plan Negocios', ...COMUNES],
    nota: true,
    wa: 'Kit de Inicio ($443.600 COP)',
    cta: 'Activar Kit de Inicio →',
  },
  {
    codigo: 'ESP-1',
    nombre: 'Inicial',
    precioCOP: '900.000',
    precioUSD: '200',
    perfil: 'Para tomar ritmo',
    color: '#B38B59',
    features: ['7 productos premium de bienestar', '1 mes de plan tecnológico incluido', ...COMUNES],
    wa: 'paquete ESP-1 Inicial ($900.000 COP)',
    cta: 'Activar ESP-1 →',
  },
  {
    codigo: 'ESP-2',
    nombre: 'Empresarial',
    precioCOP: '2.250.000',
    precioUSD: '500',
    perfil: 'Para ir en serio',
    color: '#94A3B8',
    features: ['18 productos premium de bienestar', '2 meses de plan tecnológico incluidos', ...COMUNES],
    wa: 'paquete ESP-2 Empresarial ($2.250.000 COP)',
    cta: 'Activar ESP-2 →',
  },
  {
    codigo: 'ESP-3',
    nombre: 'Visionario',
    precioCOP: '4.500.000',
    precioUSD: '1.000',
    perfil: 'Máximo impacto',
    color: '#C5A059',
    destacado: true,
    features: [
      '35 productos — la línea completa, con suplementos',
      '3 meses de plan tecnológico incluidos',
      'Acompañamiento VIP del equipo',
      ...COMUNES,
    ],
    wa: 'paquete ESP-3 Visionario ($4.500.000 COP)',
    cta: 'Activar ESP-3 →',
  },
];

const NOMENCLATURA = [
  { paquete: 'Kit de Inicio', productos: '4 cajas', cv: '56 CV', regalia: '10%', gen5: 'No' },
  { paquete: 'ESP-1 Inicial', productos: '7 productos', cv: '100 CV', regalia: '15%', gen5: 'Sí' },
  { paquete: 'ESP-2 Empresarial', productos: '18 productos', cv: '250 CV', regalia: '16%', gen5: 'Sí' },
  { paquete: 'ESP-3 Visionario', productos: '35 productos', cv: '500 CV', regalia: '17%', gen5: 'Sí' },
];

// ════════════════════════════════════════════════════════════════════════════
// HERO
// ════════════════════════════════════════════════════════════════════════════

function Hero() {
  return (
    <section style={{ position: 'relative', padding: '120px 24px 72px', overflow: 'hidden' }}>
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

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: C.cyan, fontFamily: 'var(--font-mono)', marginBottom: 24,
          textShadow: '0 1px 8px rgba(0,0,0,0.9)',
        }}>
          Paquetes de Activación · Gano Excel
        </p>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', lineHeight: 1.1, marginBottom: 24,
          fontFamily: 'var(--font-sans)', fontWeight: 700,
          color: 'var(--color-brand)', letterSpacing: '0.08em', textTransform: 'uppercase',
          textShadow: '0 2px 14px rgba(0,0,0,0.95)',
        }}>
          Activación de su<br />canal de distribución
        </h1>

        <p style={{
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.6,
          color: C.white, maxWidth: 640, margin: '0 auto',
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          textShadow: '0 1px 10px rgba(0,0,0,0.9)',
        }}>
          Cuatro formas de empezar · Inventario premium Gano Excel · 16 países de América.
        </p>

        <p style={{
          fontSize: '0.78rem', color: C.muted, fontFamily: 'var(--font-mono)',
          letterSpacing: '0.1em', marginTop: 32, textShadow: '0 1px 8px rgba(0,0,0,1)',
        }}>
          ↓ Las cuatro opciones, con todos los números a la vista
        </p>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// EL DESTINO DEL CAPITAL — tesis en la primera línea, sin negaciones
// ════════════════════════════════════════════════════════════════════════════

function DestinoDelCapital() {
  return (
    <section style={{ padding: '64px 24px', background: 'rgba(13,13,13,0.6)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <span style={{
          fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
          letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold,
        }}>
          El Destino del Capital
        </span>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: 16, marginBottom: 28,
          fontFamily: 'var(--font-serif)', color: C.white, lineHeight: 1.25,
        }}>
          Su capital se convierte en{' '}
          <span style={{ color: C.gold }}>inventario tangible</span>.
        </h2>
        <div style={{
          padding: '24px 32px', background: 'rgba(0,0,0,0.55)',
          borderLeft: '2px solid rgba(197,160,89,0.35)', textAlign: 'left',
        }}>
          <p style={{ fontSize: '1.02rem', lineHeight: 1.8, color: C.body, margin: 0 }}>
            Café, bebidas y suplementos premium con Ganoderma — producto que{' '}
            <span style={{ color: C.white }}>Gano Excel</span> fabrica y despacha hasta la casa
            de su cliente. Ese inventario es el que activa sus derechos de distribución en{' '}
            <span style={{ color: C.white, fontWeight: 600 }}>16 países de América</span>.
            Y el tamaño del arranque lo define usted.
          </p>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// LAS CUATRO OPCIONES
// ════════════════════════════════════════════════════════════════════════════

function PaqueteCard({ p }: { p: Paquete }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        background: p.destacado ? 'rgba(197,160,89,0.05)' : 'rgba(0,0,0,0.65)',
        border: p.destacado ? `1px solid ${C.gold}` : '1px solid rgba(255,255,255,0.07)',
        borderTop: `3px solid ${p.color}`,
        padding: '28px 24px',
        display: 'flex', flexDirection: 'column', gap: 16,
        clipPath: CLIP_CARD,
        transform: hover ? 'translateY(-4px)' : 'none',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        boxShadow: hover ? `0 18px 40px ${p.color}30` : 'none',
        height: '100%', boxSizing: 'border-box',
      }}
    >
      {p.destacado && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          fontSize: '0.62rem', fontFamily: 'var(--font-mono)',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: C.bg, background: C.gold, padding: '4px 8px', fontWeight: 700,
        }}>
          ★
        </div>
      )}

      <div>
        <div style={{
          fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
          letterSpacing: '0.18em', textTransform: 'uppercase', color: p.color,
          marginBottom: 6,
        }}>
          {p.codigo}
        </div>
        <h3 style={{
          fontFamily: 'var(--font-sans)', fontSize: '1.2rem',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: C.white, fontWeight: 600, margin: 0, lineHeight: 1.2,
        }}>
          {p.nombre}
        </h3>
        <p style={{
          fontSize: '0.8rem', color: C.muted, margin: '6px 0 0',
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
        }}>
          {p.perfil}
        </p>
      </div>

      {/* Precio — COP manda, USD referencia */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--font-serif)', fontSize: '2.1rem',
            fontWeight: 700, color: C.gold, lineHeight: 1,
          }}>
            ${p.precioCOP}
          </span>
          <span style={{ fontSize: '0.8rem', color: C.muted, fontFamily: 'var(--font-mono)' }}>
            COP
          </span>
        </div>
        <p style={{
          fontSize: '0.72rem', color: C.mutedDark, fontFamily: 'var(--font-mono)',
          margin: '6px 0 0', letterSpacing: '0.05em',
        }}>
          ≈ ${p.precioUSD} USD · pago único
        </p>
      </div>

      <ul style={{
        listStyle: 'none', padding: 0, margin: 0,
        display: 'flex', flexDirection: 'column', gap: 10, flex: 1,
      }}>
        {p.features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <CheckCircle size={15} color={C.success} style={{ flexShrink: 0, marginTop: 3 }} />
            <span style={{ fontSize: '0.86rem', color: C.body, lineHeight: 1.5 }}>{f}</span>
          </li>
        ))}
      </ul>

      {/* Nota del Kit — la limitación, en positivo (calibrado con el Director) */}
      {p.nota && (
        <p style={{
          fontSize: '0.78rem', color: C.muted, margin: 0, lineHeight: 1.6,
          borderLeft: `2px solid ${p.color}40`, paddingLeft: 10,
        }}>
          La puerta de la estrategia{' '}
          <Link href="/12-niveles" style={{ color: C.gold, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Los 12 Niveles <ArrowRight size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </Link>
          {' '}Activa una de las dos vías del plan — la tabla de abajo lo muestra completo.
        </p>
      )}

      <a
        href={waActivar(p.wa)}
        target="_blank"
        rel="noopener noreferrer"
        className="cta-base"
        style={{
          background: p.destacado ? `${p.color}12` : 'transparent',
          color: p.color,
          border: p.destacado ? `2px solid ${p.color}` : `1.5px solid ${p.color}`,
          padding: '0.875rem 1.5rem', fontSize: '0.85rem', marginTop: 'auto',
          boxShadow: p.destacado ? `0 0 24px ${p.color}20` : 'none',
        }}
      >
        {p.cta}
      </a>
    </div>
  );
}

function CuatroOpciones() {
  return (
    <section style={{ padding: '72px 24px 40px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan,
          }}>
            Las cuatro opciones
          </span>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: 16,
            fontFamily: 'var(--font-serif)', color: C.white,
          }}>
            Cuatro formas de empezar. La estructura es la misma.
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20, alignItems: 'stretch',
        }}>
          {PAQUETES.map((p) => <PaqueteCard key={p.codigo} p={p} />)}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// LOS NOMBRES OFICIALES DEL PLAN — separados del precio, a propósito
// ════════════════════════════════════════════════════════════════════════════

function NombresDelPlan() {
  return (
    <section style={{ padding: '48px 24px 72px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span style={{
            fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan,
          }}>
            Los nombres oficiales del plan
          </span>
          <h2 style={{
            fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginTop: 16,
            fontFamily: 'var(--font-serif)', color: C.white,
          }}>
            Lo que cada paquete activa, con sus nombres oficiales.
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
          }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.gold}40` }}>
                {['Paquete', 'Inventario', 'Volumen (CV)', 'Regalía de Equipo', 'Bono GEN5'].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 14px', color: C.gold,
                    fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                    fontWeight: 600, whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NOMENCLATURA.map((r, i) => (
                <tr key={r.paquete} style={{
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  background: i === 3 ? 'rgba(197,160,89,0.04)' : 'transparent',
                }}>
                  <td style={{ padding: '12px 14px', color: C.white, whiteSpace: 'nowrap' }}>{r.paquete}</td>
                  <td style={{ padding: '12px 14px', color: C.body }}>{r.productos}</td>
                  <td style={{ padding: '12px 14px', color: C.body }}>{r.cv}</td>
                  <td style={{ padding: '12px 14px', color: C.body }}>{r.regalia}</td>
                  <td style={{ padding: '12px 14px', color: r.gen5 === 'Sí' ? C.success : C.mutedDark }}>{r.gen5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 20, color: C.muted, fontSize: '0.82rem', lineHeight: 1.7 }}>
          La <strong style={{ color: C.body }}>Regalía de Equipo</strong> y el{' '}
          <strong style={{ color: C.body }}>Bono GEN5</strong> son los nombres oficiales del plan
          de Gano Excel, y así se los explica Queswa cuando le pregunte cómo funcionan — con
          calma y con ejemplos. El Kit de Inicio activa únicamente la Regalía de Equipo; los
          paquetes empresariales activan las dos vías.
        </p>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// FAQ — Todo a la vista.
// ════════════════════════════════════════════════════════════════════════════

function FaqItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(197,160,89,0.15)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          textAlign: 'left', padding: '20px 0', background: 'transparent', border: 0,
          cursor: 'pointer', color: C.white, fontFamily: 'var(--font-serif)', fontSize: '1.02rem',
        }}
      >
        <span>{q}</span>
        <ChevronDown
          size={18} color={C.cyan}
          style={{
            marginLeft: '1rem', transition: 'transform 0.3s ease',
            transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0,
          }}
        />
      </button>
      <div style={{
        overflow: 'hidden', maxHeight: open ? 500 : 0, opacity: open ? 1 : 0,
        transition: 'max-height 0.3s ease, opacity 0.3s ease',
      }}>
        <p style={{ paddingBottom: 20, color: C.muted, lineHeight: 1.75, fontSize: '0.92rem', margin: 0 }}>
          {a}
        </p>
      </div>
    </div>
  );
}

function Faq() {
  return (
    <section style={{ padding: '72px 24px', background: 'rgba(13,13,13,0.6)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan,
          }}>
            Preguntas Frecuentes
          </span>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: 16,
            fontFamily: 'var(--font-serif)', color: C.white,
          }}>
            Todo a la vista.
          </h2>
        </div>
        <div>
          <FaqItem
            q="¿Qué cubre exactamente mi capital inicial?"
            a="Su capital se convierte en inventario físico: café, bebidas y suplementos premium con Ganoderma, que Gano Excel fabrica y despacha. Los paquetes empresariales incluyen además el plan tecnológico por 1, 2 o 3 meses según el nivel."
          />
          <FaqItem
            q="¿Cuál es la diferencia entre el Kit de Inicio y un paquete empresarial?"
            a={<>El Kit activa su código, le entrega 4 cajas de producto y abre la Regalía de Equipo al 10% — es la puerta de <Link href="/12-niveles" style={{ color: C.gold }}>Los 12 Niveles</Link>. Los empresariales entregan más inventario y activan las dos vías del plan, con la Regalía en 15, 16 o 17% según el nivel.</>}
          />
          <FaqItem
            q="¿Cuál es el consumo mensual para mantenerlo activo?"
            a="Una compra mensual de 50 PV — en producto, unas tres o cuatro cajas. Es producto que usted consume o comparte con sus clientes, y que mantiene el flujo en movimiento."
          />
          <FaqItem
            q="¿Puedo subir de nivel más adelante?"
            a="Sí, en cualquier momento. Puede empezar con el Kit o el ESP-1 para tomar ritmo y, a medida que su canal produce, subir de nivel."
          />
          <FaqItem
            q="¿Hay costos que no estén declarados aquí?"
            a="No. Su capital inicial, su compra mensual de producto y, terminado el periodo incluido, la cuota del plan tecnológico que elija. Eso es todo."
          />
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CIERRE — una pregunta, una salida
// ════════════════════════════════════════════════════════════════════════════

function Cierre() {
  return (
    <section style={{ padding: '90px 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', marginBottom: 20,
          fontFamily: 'var(--font-serif)', color: C.white, lineHeight: 1.3,
        }}>
          Las cuatro opciones están definidas.
          <br />
          <span style={{ color: C.gold }}>El nivel lo elige usted.</span>
        </h2>
        <p style={{ fontSize: '1rem', color: C.muted, lineHeight: 1.75, marginBottom: 36 }}>
          Si todavía tiene preguntas, ese es justamente el trabajo de Queswa:
          responderlas con calma, a la hora que sea. Y cuando dé el sí, el equipo de
          creatuactivo.com asume el trámite — a usted solo le corresponde autorizar.
        </p>
        <a
          href={WA_PREGUNTAS}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-base cta-primary"
          style={{ padding: '1.125rem 2.5rem', fontSize: '0.95rem' }}
        >
          Hablar con Queswa →
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      padding: '40px 24px', borderTop: '1px solid rgba(197,160,89,0.15)', textAlign: 'center',
    }}>
      <p style={{
        fontFamily: 'var(--font-sans)', color: C.gold, fontSize: '1rem',
        letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 6px',
      }}>
        CreaTuActivo
      </p>
      <p style={{
        fontFamily: 'var(--font-mono)', color: C.muted, fontSize: '0.7rem',
        letterSpacing: '0.08em', marginBottom: 20,
      }}>
        Su canal de distribución · Ingresos recurrentes
      </p>
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 32,
        fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: 16,
      }}>
        <Link href="/blog" style={{ color: C.muted, textDecoration: 'none' }}>BLOG</Link>
        <Link href="/privacidad" style={{ color: C.muted, textDecoration: 'none' }}>PRIVACIDAD</Link>
      </div>
      <p style={{
        fontFamily: 'var(--font-mono)', color: C.mutedDark, fontSize: '0.65rem',
        letterSpacing: '0.1em', margin: 0,
      }}>
        © 2026 CREATUACTIVO.COM
      </p>
    </footer>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════════

export default function PaquetesPage() {
  return (
    <div style={{
      backgroundColor: C.bg, color: C.white,
      fontFamily: 'var(--font-sans)', minHeight: '100vh',
    }}>
      <StrategicNavigation />
      <main>
        <Hero />
        <DestinoDelCapital />
        <CuatroOpciones />
        <NombresDelPlan />
        <Faq />
        <Cierre />
      </main>
      <Footer />
    </div>
  );
}
