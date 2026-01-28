/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * PAQUETES - THE ARCHITECT'S SUITE
 * BIMETALLIC DESIGN SYSTEM v3.0
 * Gold (#C5A059): CTAs, prices, achievements
 * Titanium (#94A3B8): Icons, navigation, structural borders
 */

'use client'

import React, { useState } from 'react'
import { ArrowRight, CheckCircle, HelpCircle, ChevronDown, Crown, Zap, Rocket } from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'

// ============================================================================
// THE ARCHITECT'S SUITE - BIMETALLIC COLOR PALETTE v3.0
// ============================================================================

const COLORS = {
  bg: { main: '#0F1115', elevated: '#15171C', card: '#1A1D23' },
  gold: { primary: '#C5A059', hover: '#D4AF37' },
  titanium: { primary: '#94A3B8', muted: '#64748B' },
  text: { primary: '#FFFFFF', main: '#E5E5E5', muted: '#A3A3A3' },
  border: { titanium: 'rgba(148, 163, 184, 0.2)', glass: 'rgba(255, 255, 255, 0.1)' },
};

// ============================================================================
// PACKAGE CARD
// ============================================================================

function PackageCard({ title, priceUSD, priceCOP, features, bonusMonths, bonusPlan, bonusIcon, ctaText = "Seleccionar Plan" }: {
  title: string; priceUSD: string; priceCOP: string; features: string[];
  bonusMonths: number; bonusPlan: string; bonusIcon: React.ReactNode; ctaText?: string;
}) {
  return (
    <div className="h-full flex flex-col rounded-2xl transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(197,160,89,0.15)]"
      style={{ background: COLORS.bg.card, border: `1px solid ${COLORS.border.glass}` }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(197, 160, 89, 0.4)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = COLORS.border.glass)}
    >
      <div className="p-8 flex-grow flex flex-col">
        <h3 className="text-2xl font-bold mb-2" style={{ color: COLORS.text.main }}>{title}</h3>
        <div className="mb-6">
          <span className="text-4xl font-extrabold" style={{ color: COLORS.gold.primary }}>${priceUSD}</span>
          <span style={{ color: COLORS.titanium.primary }}> USD</span>
          <p className="text-sm" style={{ color: COLORS.titanium.muted }}>~ ${priceCOP} COP</p>
        </div>

        <div className="p-4 rounded-lg mb-6" style={{ background: COLORS.bg.main, border: `1px solid rgba(197, 160, 89, 0.2)` }}>
          <div className="flex items-center gap-3">
            <div style={{ color: COLORS.gold.primary }}>{bonusIcon}</div>
            <div>
              <p className="font-bold" style={{ color: COLORS.text.main }}>Bono Tecnológico Incluido</p>
              <p className="text-sm" style={{ color: COLORS.text.muted }}>
                <span className="font-semibold" style={{ color: COLORS.gold.primary }}>{bonusMonths} Meses de Cortesía</span> del <span className="font-semibold">{bonusPlan}</span>
              </p>
            </div>
          </div>
        </div>

        <ul className="space-y-3 flex-grow mb-8" style={{ color: COLORS.text.muted }}>
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#10B981] mr-3 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link href="/fundadores"
          className="w-full text-center font-semibold py-3 px-5 rounded-xl transition-all duration-300 mt-auto block hover:-translate-y-0.5"
          style={{ background: COLORS.gold.primary, color: COLORS.bg.main }}
          onMouseEnter={e => (e.currentTarget.style.background = COLORS.gold.hover)}
          onMouseLeave={e => (e.currentTarget.style.background = COLORS.gold.primary)}
        >
          {ctaText}
        </Link>
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
    <div style={{ borderBottom: `1px solid ${COLORS.border.titanium}` }}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-5">
        <span className="font-semibold text-lg" style={{ color: COLORS.text.main }}>{question}</span>
        <div className="ml-4 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <ChevronDown className="w-5 h-5" style={{ color: COLORS.titanium.primary }} />
        </div>
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? '300px' : '0', opacity: isOpen ? 1 : 0 }}>
        <div className="pb-5" style={{ color: COLORS.text.muted }}>
          {answer}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

function Footer() {
  return (
    <footer className="px-6 py-10" style={{ borderTop: `1px solid ${COLORS.border.titanium}` }}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="font-medium" style={{ color: COLORS.gold.primary }}>CreaTuActivo</p>
          <p className="text-xs" style={{ color: COLORS.text.muted }}>Sistema de Arquitectura de Activos</p>
        </div>
        <div className="flex gap-8 text-sm" style={{ color: COLORS.text.muted }}>
          <Link href="/blog" className="hover:opacity-80 transition-opacity">Blog</Link>
          <Link href="/privacidad" className="hover:opacity-80 transition-opacity">Privacidad</Link>
        </div>
        <p className="text-xs" style={{ color: COLORS.text.muted }}>© 2026 CreaTuActivo.com</p>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function PaquetesPage() {
  return (
    <div style={{ backgroundColor: COLORS.bg.main, color: COLORS.text.main }}>
      <StrategicNavigation />

      {/* Background gradient - subtle gold glow (same as homepage) */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(197, 160, 89, 0.04) 0%, transparent 60%)' }}
      />

      <main className="relative z-10 p-4 lg:p-8">

        {/* HERO */}
        <section className="text-center max-w-4xl mx-auto py-20 lg:py-28 pt-20 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif', color: COLORS.text.primary }}>
            Tu Punto de Entrada a la{' '}
            <span style={{ color: COLORS.gold.primary }}>Arquitectura.</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: COLORS.text.muted }}>
            Esto no es un costo, es la inversión inicial para adquirir tu propia franquicia digital. Elige el paquete que mejor se alinee con tu visión de construcción.
          </p>
        </section>

        {/* PACKAGES */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              <PackageCard
                title="Constructor Inicial"
                priceUSD="200"
                priceCOP="900.000"
                bonusMonths={2}
                bonusPlan="Plan Cimiento"
                bonusIcon={<Zap size={24} />}
                features={[
                  "Acceso completo al ecosistema",
                  "Método completo",
                  "Inventario inicial de validación",
                  "Tecnología NodeX incluida"
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
                features={[
                  "Todo lo del plan Inicial +",
                  "Inventario para operación profesional",
                  "Consultoría estratégica prioritaria",
                  "Optimización de primeros flujos"
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
                features={[
                  "Todo lo del plan Empresarial +",
                  "Inventario premium de máximo potencial",
                  "Consultoría estratégica VIP",
                  "Construcción acelerada desde día 1"
                ]}
                ctaText="Activar como Visionario"
              />
            </div>
            <div className="text-center mt-12" style={{ color: COLORS.text.muted }}>
              <p>Todos los paquetes incluyen el acceso total a la plataforma CreaTuActivo.com y al método probado.</p>
              <p className="mt-2">Como Fundador, tu paquete desbloquea meses de cortesía de nuestra maquinaria tecnológica.
                <Link href="/planes" className="font-semibold ml-2 transition-colors hover:opacity-80" style={{ color: COLORS.gold.primary }}>
                  Conoce los detalles de los planes aquí
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 lg:py-28 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.titanium.primary }} />
              <h2 className="text-3xl md:text-4xl font-bold" style={{ color: COLORS.text.main }}>Preguntas Clave sobre tu Inversión</h2>
              <p className="mt-2" style={{ color: COLORS.text.muted }}>Respuestas transparentes para constructores inteligentes.</p>
            </div>
            <div className="space-y-2">
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

        {/* FINAL CTA */}
        <section className="text-center py-20">
          <div className="max-w-3xl mx-auto">
            <Crown className="w-16 h-16 mx-auto mb-6" style={{ color: COLORS.gold.primary }} />
            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: COLORS.text.main }}>
              Listo para Iniciar la Construcción.
            </h2>
            <p className="text-lg mb-10" style={{ color: COLORS.text.muted }}>
              Has visto el valor, la transparencia y el potencial. El siguiente paso es unirte al grupo de pioneros que están definiendo esta nueva categoría.
            </p>
            <Link href="/fundadores"
              className="inline-flex items-center gap-2 text-lg font-bold px-10 py-5 rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-[0_6px_20px_rgba(197,160,89,0.3)] hover:shadow-[0_12px_35px_rgba(197,160,89,0.4)]"
              style={{ background: COLORS.gold.primary, color: COLORS.bg.main }}
            >
              Convertirme en Fundador <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards; }
      `}</style>
    </div>
  );
}
