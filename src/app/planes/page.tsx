/**
 * Copyright © 2026 CreaTuActivo.com
 * /planes — Planes tecnológicos Queswa v4.0
 *
 * Reescrita desde cero (14 ago 2026) — decisiones del Director en sesión:
 *  1. Eje de la escalera: los planes se diferencian por DÓNDE y QUÉ TAN RÁPIDO
 *     le llega al socio el trabajo que Queswa ya hizo — nunca por cuotas de uso
 *     inventadas (la v3 prometía "200 prospectos / 100 conversaciones" que
 *     ninguna línea de código aplicaba).
 *  2. TRES planes: Enlace (gratis) · Radar ($99.000) · Canal ($199.000).
 *     El cuarto ($99 USD / número propio) queda para cuando exista su
 *     diferenciador real (App Review de Meta).
 *  3. Nombres por lo que llega, no cargos: Enlace · Radar · Canal.
 *  4. COP redondo como unidad principal; USD pequeño como referencia.
 *
 * Reglas que esta página respeta:
 *  - El aviso de pre-afiliación por WhatsApp NUNCA se cobra (está en el gratis).
 *  - Al vencer el subsidio, el socio cae al plan Enlace: conserva su enlace, sus
 *    reels, a Queswa atendiendo y sus prospectos. Nadie queda por fuera.
 *  - Los avisos hablan de la actividad del negocio (visitas, reels, conversaciones)
 *    — jamás de un pago con fecha o monto (promesa de ingreso).
 *  - Léxico arsenal ago 2026: canal de distribución · socios/clientes · usted decide.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';
import { CheckCircle, ChevronDown, Link2, Radar, MessageSquareText } from 'lucide-react';

// Caché local sincronizado con tokens del sistema (globals.css) — patrón /paquetes.
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
const waLink = (plan: string) =>
  WA_BASE + encodeURIComponent(
    `Hola, Queswa. Quiero activar el ${plan} para mi canal de distribución. Mi nombre es `
  );

// ════════════════════════════════════════════════════════════════════════════
// LOS TRES PLANES — el eje es por dónde le llega el trabajo ya hecho.
// ════════════════════════════════════════════════════════════════════════════

interface Plan {
  codigo: string;
  nombre: string;
  precioCOP: string | null;   // null = gratis
  precioUSD: string | null;
  tag: string;
  color: string;
  icon: React.ReactNode;
  destacado?: boolean;
  features: string[];
  cta: { texto: string; href: string; externo: boolean };
}

const PLANES: Plan[] = [
  {
    codigo: 'PLAN 01',
    nombre: 'Enlace',
    precioCOP: null,
    precioUSD: null,
    tag: 'Todo lo que hace funcionar el sistema',
    color: '#94A3B8',
    icon: <Link2 size={18} />,
    features: [
      'Su enlace personal y sus reels por nicho',
      'Queswa conversa con sus prospectos a toda hora',
      'Radar de conversaciones en el Centro de Mando',
      'Avisos al instante en el Centro de Mando',
      'Aviso por WhatsApp cuando alguien deja lista su pre-afiliación — este nunca se cobra',
    ],
    cta: { texto: 'Incluido con su activación →', href: '/paquetes', externo: false },
  },
  {
    codigo: 'PLAN 02',
    nombre: 'Radar',
    precioCOP: '99.000',
    precioUSD: '22',
    tag: 'El día arranca informado',
    color: '#B38B59',
    icon: <Radar size={18} />,
    features: [
      'Todo lo del plan Enlace',
      'El parte diario por WhatsApp: cada mañana, quién visitó, quién terminó el reel, quién habló con Queswa y quién volvió',
      'Analíticas completas de su canal',
      'La Academia — nivel avanzado',
    ],
    cta: { texto: 'Activar plan Radar →', href: waLink('plan Radar ($99.000 COP/mes)'), externo: true },
  },
  {
    codigo: 'PLAN 03',
    nombre: 'Canal',
    precioCOP: '199.000',
    precioUSD: '44',
    tag: 'Su negocio, en el bolsillo',
    color: '#C5A059',
    icon: <MessageSquareText size={18} />,
    destacado: true,
    features: [
      'Todo lo del plan Radar',
      'Las señales de alta intención le llegan al instante por WhatsApp: alguien abrió Queswa, preguntó por precios, volvió otra vez',
      'Queswa le responde a usted por WhatsApp: quién está listo hoy, el resumen de cualquier conversación, el mensaje listo para enviar',
      'Soporte prioritario del equipo',
    ],
    cta: { texto: 'Activar plan Canal →', href: waLink('plan Canal ($199.000 COP/mes)'), externo: true },
  },
];

// ════════════════════════════════════════════════════════════════════════════
// HERO
// ════════════════════════════════════════════════════════════════════════════

function Hero() {
  return (
    <section style={{
      textAlign: 'center', maxWidth: '60rem', margin: '0 auto',
      padding: '8rem 1.5rem 3.5rem',
    }}>
      <p style={{
        fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
        color: C.cyan, fontFamily: 'var(--font-mono)', marginBottom: 24,
      }}>
        Tecnología Queswa · Planes
      </p>

      <h1 style={{
        fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', lineHeight: 1.1, marginBottom: 24,
        fontFamily: 'var(--font-sans)', fontWeight: 700,
        color: 'var(--color-brand)', letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        La tecnología que trabaja<br />por su canal de distribución
      </h1>

      <p style={{
        fontSize: '1.05rem', color: C.body, lineHeight: 1.85,
        maxWidth: 620, margin: '0 auto',
      }}>
        Queswa conversa con cada interesado, resuelve sus dudas y madura su decisión,
        a toda hora. Los planes definen una sola cosa:{' '}
        <strong style={{ color: C.white }}>por dónde y qué tan rápido le llega a usted
        ese trabajo ya hecho</strong>.
      </p>

      <p style={{
        fontSize: '0.78rem', color: C.muted, fontFamily: 'var(--font-mono)',
        letterSpacing: '0.1em', marginTop: 32,
      }}>
        ↓ Tres planes, todos los números a la vista
      </p>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CARDS
// ════════════════════════════════════════════════════════════════════════════

function PlanCard({ p }: { p: Plan }) {
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
          ★ Recomendado
        </div>
      )}

      <div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
          color: p.color,
        }}>
          {p.icon}
          <span style={{
            fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
            letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>
            {p.codigo}
          </span>
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
          {p.tag}
        </p>
      </div>

      {/* Precio — COP manda; el gratis se dice con la palabra */}
      <div>
        {p.precioCOP ? (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-serif)', fontSize: '2.1rem',
                fontWeight: 700, color: C.gold, lineHeight: 1,
              }}>
                ${p.precioCOP}
              </span>
              <span style={{ fontSize: '0.8rem', color: C.muted, fontFamily: 'var(--font-mono)' }}>
                COP / mes
              </span>
            </div>
            <p style={{
              fontSize: '0.72rem', color: C.mutedDark, fontFamily: 'var(--font-mono)',
              margin: '6px 0 0', letterSpacing: '0.05em',
            }}>
              ≈ ${p.precioUSD} USD · se cancela cuando quiera
            </p>
          </>
        ) : (
          <>
            <span style={{
              fontFamily: 'var(--font-serif)', fontSize: '2.1rem',
              fontWeight: 700, color: C.white, lineHeight: 1,
            }}>
              Gratis
            </span>
            <p style={{
              fontSize: '0.72rem', color: C.mutedDark, fontFamily: 'var(--font-mono)',
              margin: '6px 0 0', letterSpacing: '0.05em',
            }}>
              Para siempre · sin tarjeta
            </p>
          </>
        )}
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

      {p.cta.externo ? (
        <a
          href={p.cta.href}
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
          {p.cta.texto}
        </a>
      ) : (
        <Link
          href={p.cta.href}
          className="cta-base"
          style={{
            background: 'transparent', color: p.color,
            border: `1.5px solid ${p.color}`,
            padding: '0.875rem 1.5rem', fontSize: '0.85rem', marginTop: 'auto',
          }}
        >
          {p.cta.texto}
        </Link>
      )}
    </div>
  );
}

function Planes() {
  return (
    <section style={{ padding: '0 24px 40px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20, alignItems: 'stretch',
        }}>
          {PLANES.map((p) => <PlanCard key={p.nombre} p={p} />)}
        </div>

        {/* Subsidio — el puente con /paquetes */}
        <div style={{
          textAlign: 'center', marginTop: 40, maxWidth: 640,
          margin: '40px auto 0', color: C.mutedDark,
          fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
          lineHeight: 1.8, letterSpacing: '0.05em',
        }}>
          <p style={{ margin: 0 }}>
            Los paquetes ESP-1, ESP-2 y ESP-3 incluyen el plan tecnológico por 1, 2 y 3 meses.
          </p>
          <p style={{ margin: '4px 0 0' }}>
            Al terminar, usted elige su plan — y si no elige, pasa al plan Enlace sin perder
            su enlace ni sus prospectos.
          </p>
          <p style={{ marginTop: 12 }}>
            <Link
              href="/paquetes"
              style={{ color: C.gold, textDecoration: 'none' }}
            >
              VER LOS PAQUETES DE ACTIVACIÓN →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// QUÉ HACE LA TECNOLOGÍA — el trabajo que usted no hace
// ════════════════════════════════════════════════════════════════════════════

function QueHace() {
  const items = [
    {
      title: 'Conversa por usted',
      body: 'Queswa atiende a cada interesado a toda hora: explica el negocio, resuelve dudas y madura su decisión de avanzar.',
    },
    {
      title: 'Le avisa a tiempo',
      body: 'Cada visita, cada reel terminado y cada conversación quedan en su Centro de Mando — y según su plan, en su WhatsApp.',
    },
    {
      title: 'Forma a sus socios',
      body: 'Cada socio que inicia con usted recibe la misma tecnología y la misma formación desde el día uno, sin que usted cargue la enseñanza.',
    },
    {
      title: 'Funciona en 16 países',
      body: 'Su canal de distribución opera en 16 países de América sin requerir su presencia en ninguno.',
    },
  ];

  return (
    <section style={{ padding: '64px 24px', background: 'rgba(13,13,13,0.6)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <span style={{
            fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan,
          }}>
            Qué paga la cuota
          </span>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: 16,
            fontFamily: 'var(--font-serif)', color: C.white,
          }}>
            El trabajo que usted no tiene que hacer.
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
        }}>
          {items.map((item) => (
            <div key={item.title} style={{
              padding: '1.6rem', background: 'rgba(22,24,29,0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderTop: `3px solid ${C.gold}`,
            }}>
              <h3 style={{
                fontSize: '0.95rem', fontWeight: 700, color: C.white,
                fontFamily: 'var(--font-sans)', textTransform: 'uppercase',
                letterSpacing: '0.05em', margin: '0 0 0.6rem',
              }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: C.muted, lineHeight: 1.65, margin: 0 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// FAQ
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
    <section style={{ padding: '72px 24px' }}>
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
            q="¿Por qué hay un plan gratis?"
            a="Porque el sistema no se apaga. Su enlace, sus reels, Queswa atendiendo a sus prospectos y su Centro de Mando funcionan siempre — son parte de su activación, no un alquiler. Los planes pagos suman una cosa concreta: el trabajo ya hecho le llega a su WhatsApp, sin que usted tenga que entrar a buscarlo."
          />
          <FaqItem
            q="¿Qué pasa cuando termina el periodo incluido en mi paquete?"
            a="Usted elige el plan que quiere — y si no elige ninguno, pasa al plan Enlace. No pierde su enlace, ni sus reels, ni sus prospectos, ni el historial de conversaciones. Se queda con menos comodidad, nunca por fuera."
          />
          <FaqItem
            q="¿El aviso de una pre-afiliación se cobra?"
            a="No, nunca. Cuando alguien deja listos sus datos para activarse, ese aviso le llega por WhatsApp esté en el plan que esté. Si usted no se entera de una activación, perdemos todos — por eso ese aviso no tiene precio."
          />
          <FaqItem
            q="¿Puedo cambiar de plan o cancelarlo?"
            a="Sí, en cualquier momento y sin permanencia. El plan se paga mes a mes; al cancelarlo pasa al plan Enlace y todo lo suyo queda en su lugar."
          />
          <FaqItem
            q="¿En qué moneda se paga?"
            a="En pesos colombianos. El valor en dólares que aparece junto a cada plan es una referencia para socios fuera de Colombia."
          />
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CTA FINAL + FOOTER
// ════════════════════════════════════════════════════════════════════════════

function CtaFinal() {
  return (
    <section style={{ padding: '90px 24px', textAlign: 'center', background: 'rgba(13,13,13,0.6)' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <span style={{
          fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
          letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan,
        }}>
          El primer paso
        </span>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', marginTop: 16, marginBottom: 20,
          fontFamily: 'var(--font-serif)', color: C.white, lineHeight: 1.3,
        }}>
          El plan viene después.
          <br />
          <span style={{ color: C.gold }}>Primero, active su canal.</span>
        </h2>
        <p style={{ fontSize: '1rem', color: C.muted, lineHeight: 1.75, marginBottom: 36 }}>
          Su paquete de activación incluye el plan tecnológico por 1, 2 o 3 meses —
          tiempo de sobra para ver el sistema trabajando con sus propios prospectos.
        </p>
        <Link
          href="/paquetes"
          className="cta-base cta-primary"
          style={{ padding: '1.125rem 2.5rem', fontSize: '0.95rem' }}
        >
          Ver los paquetes de activación →
        </Link>
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
        Tecnología para su canal de distribución
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

export default function PlanesPage() {
  return (
    <div style={{
      backgroundColor: C.bg, color: C.white,
      fontFamily: 'var(--font-sans)', minHeight: '100vh',
      backgroundImage: `linear-gradient(rgba(15,17,21,0.70), rgba(15,17,21,0.70)), url('/images/servilleta/hormigon-tile.webp')`,
      backgroundSize: 'cover, 600px 600px',
      backgroundRepeat: 'no-repeat, repeat',
    }}>
      <StrategicNavigation />
      <main>
        <Hero />
        <Planes />
        <QueHace />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  );
}
