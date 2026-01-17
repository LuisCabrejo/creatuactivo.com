/**
 * Copyright © 2025 CreaTuActivo.com
 * Página Infraestructura - Certeza Logística
 *
 * Objetivo: Proyectar "Solidez Institucional" y "Lujo Silencioso"
 * Debe verse como el sitio de una firma de Private Equity, no de un MLM.
 */

'use client';

import Link from 'next/link';
import { Leaf, Factory, Globe, Coffee, Shield, TrendingUp, ArrowDown, ChevronRight } from 'lucide-react';
import StrategicNavigation from '@/components/StrategicNavigation';

export default function InfraestructuraPage() {
  return (
    <>
      {/* Navegación estándar del sitio */}
      <StrategicNavigation />

      <main className="min-h-screen bg-[#0F1115] text-[#E5E5E5]">
        {/* Subtle gradient overlay */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(197, 160, 89, 0.04) 0%, transparent 60%)'
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN 1: HERO - La Declaración de Soberanía
            Full height, cinematográfico
            ═══════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
          {/* Background pattern - subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(197, 160, 89, 0.5) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(197, 160, 89, 0.5) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto text-center pt-24">
            {/* Institutional badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(197,160,89,0.2)] bg-[rgba(197,160,89,0.05)] mb-8">
              <Shield className="w-4 h-4 text-[#C5A059]" />
              <span className="text-sm text-[#A3A3A3] tracking-wide uppercase">Desde 1995</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 tracking-tight">
              Infraestructura Global
              <br />
              <span className="text-[#C5A059]">para la Soberanía de Activos</span>
            </h1>

            <p className="text-xl sm:text-2xl text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed mb-12 font-light">
              Orquestando cadenas de suministro bioactivas en más de 70 países.
            </p>

            {/* Scroll indicator */}
            <button
              onClick={() => document.getElementById('origen')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex flex-col items-center gap-3 text-[#6B7280] hover:text-[#C5A059] transition-colors group"
            >
              <span className="text-sm tracking-widest uppercase">Ver la Matriz Logística</span>
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F1115] to-transparent" />
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN 2: EL ORIGEN - La Década Silenciosa (1983-1995)
            ═══════════════════════════════════════════════════════════════ */}
        <section id="origen" className="py-24 px-6 border-t border-[rgba(197,160,89,0.1)]">
          <div className="max-w-5xl mx-auto">
            {/* Section header */}
            <div className="flex items-center gap-4 mb-16">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(197,160,89,0.3)]" />
              <span className="text-[#C5A059] text-sm tracking-[0.3em] uppercase font-medium">El Origen</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgba(197,160,89,0.3)]" />
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Timeline visual */}
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#C5A059] via-[rgba(197,160,89,0.3)] to-transparent" />

                {/* 1983 */}
                <div className="relative pl-20 pb-12">
                  <div className="absolute left-6 w-5 h-5 rounded-full bg-[#0F1115] border-2 border-[#C5A059]" />
                  <span className="text-[#C5A059] font-serif text-3xl font-bold">1983</span>
                  <p className="text-[#6B7280] mt-1">Inicio de I+D</p>
                </div>

                {/* 1995 */}
                <div className="relative pl-20 pb-12">
                  <div className="absolute left-6 w-5 h-5 rounded-full bg-[#C5A059]" />
                  <span className="text-[#C5A059] font-serif text-3xl font-bold">1995</span>
                  <p className="text-[#6B7280] mt-1">Fundación Global</p>
                </div>

                {/* 2009 */}
                <div className="relative pl-20">
                  <div className="absolute left-6 w-5 h-5 rounded-full bg-[#0F1115] border-2 border-[#C5A059]" />
                  <span className="text-[#C5A059] font-serif text-3xl font-bold">2009</span>
                  <p className="text-[#6B7280] mt-1">Apertura Américas</p>
                </div>
              </div>

              {/* Right: Copy */}
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl mb-6">
                  <span className="text-[#C5A059]">1983 - 1995:</span>
                  <br />
                  La Década Silenciosa
                </h2>

                <p className="text-lg text-[#A3A3A3] leading-relaxed mb-6">
                  La verdadera riqueza no se improvisa; <strong className="text-[#E5E5E5]">se cultiva</strong>.
                </p>

                <p className="text-[#A3A3A3] leading-relaxed mb-6">
                  Antes de vender una sola caja, dedicamos <span className="text-[#C5A059] font-semibold">12 años exclusivamente a I+D</span>.
                  Mientras otros buscaban tendencias de mercado, Mr. Leow Soon Seng perfeccionaba el
                  cultivo de tejidos (<em>Tissue Culture</em>) de las 6 variedades más potentes de Ganoderma Lucidum.
                </p>

                <p className="text-[#A3A3A3] leading-relaxed">
                  No buscábamos velocidad. Buscábamos la <strong className="text-[#E5E5E5]">estandarización de la potencia biológica</strong>.
                  Hoy, esa paciencia es tu patente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN 3: INTEGRACIÓN VERTICAL - El Foso Defensivo
            Modelo "Seed-to-Seal"
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 bg-[#0A0A0E]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl sm:text-4xl mb-4">
                Soberanía de Suministro
              </h2>
              <p className="text-xl text-[#C5A059] font-light">
                El Modelo "Seed-to-Seal"
              </p>
              <p className="text-[#A3A3A3] mt-4 max-w-2xl mx-auto">
                En una economía de cadenas de suministro rotas, nosotros <strong className="text-[#E5E5E5]">poseemos la cadena entera</strong>.
              </p>
            </div>

            {/* Connection line */}
            <div className="hidden lg:block relative h-1 max-w-3xl mx-auto mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-30" />
              <div className="absolute left-1/6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#C5A059]" />
              <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#C5A059]" />
              <div className="absolute right-1/6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#C5A059]" />
            </div>

            {/* 3 Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1: La Fuente */}
              <div className="group p-8 rounded-2xl bg-[#1A1D23] border border-[rgba(197,160,89,0.1)] hover:border-[rgba(197,160,89,0.3)] transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-[rgba(197,160,89,0.1)] flex items-center justify-center mb-6 group-hover:bg-[rgba(197,160,89,0.15)] transition-colors">
                  <Leaf className="w-7 h-7 text-[#C5A059]" />
                </div>
                <h3 className="font-serif text-xl mb-2 text-[#E5E5E5]">La Fuente</h3>
                <p className="text-sm text-[#C5A059] mb-4">Cultivo Propio · Kedah, Malasia</p>
                <p className="text-[#A3A3A3] text-sm leading-relaxed">
                  Propietarios de la plantación orgánica de Ganoderma más grande del mundo.
                  Control total desde la semilla.
                </p>
              </div>

              {/* Card 2: La Ciencia */}
              <div className="group p-8 rounded-2xl bg-[#1A1D23] border border-[rgba(197,160,89,0.1)] hover:border-[rgba(197,160,89,0.3)] transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-[rgba(197,160,89,0.1)] flex items-center justify-center mb-6 group-hover:bg-[rgba(197,160,89,0.15)] transition-colors">
                  <Factory className="w-7 h-7 text-[#C5A059]" />
                </div>
                <h3 className="font-serif text-xl mb-2 text-[#E5E5E5]">La Ciencia</h3>
                <p className="text-sm text-[#C5A059] mb-4">Manufactura GMP · ISO Certified</p>
                <p className="text-[#A3A3A3] text-sm leading-relaxed">
                  Manufactura propia con certificaciones internacionales.
                  Sin maquilas. Sin intermediarios.
                </p>
              </div>

              {/* Card 3: El Resultado */}
              <div className="group p-8 rounded-2xl bg-[#1A1D23] border border-[rgba(197,160,89,0.1)] hover:border-[rgba(197,160,89,0.3)] transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-[rgba(197,160,89,0.1)] flex items-center justify-center mb-6 group-hover:bg-[rgba(197,160,89,0.15)] transition-colors">
                  <Globe className="w-7 h-7 text-[#C5A059]" />
                </div>
                <h3 className="font-serif text-xl mb-2 text-[#E5E5E5]">El Resultado</h3>
                <p className="text-sm text-[#C5A059] mb-4">Logística Global Propia</p>
                <p className="text-[#A3A3A3] text-sm leading-relaxed">
                  Inmunidad ante la fluctuación de precios de materias primas.
                  Tu margen está protegido desde la raíz.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN 4: PRESENCIA GEOPOLÍTICA - La Escala
            Mapa mundial estilizado
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 border-t border-[rgba(197,160,89,0.1)]">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Copy */}
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl mb-6">
                  Operaciones en
                  <br />
                  <span className="text-[#C5A059]">70+ Países</span>
                </h2>

                <p className="text-lg text-[#A3A3A3] leading-relaxed mb-6">
                  Operar en una sola economía es un <strong className="text-[#E5E5E5]">riesgo</strong>.
                  Operar en setenta es una <span className="text-[#C5A059]">cobertura (Hedge)</span>.
                </p>

                <p className="text-[#A3A3A3] leading-relaxed">
                  Nuestra infraestructura atraviesa fronteras, monedas y ciclos políticos.
                  Desde los rascacielos de los Emiratos Árabes hasta el mercado masivo de las Américas,
                  tu activo se asienta sobre una <strong className="text-[#E5E5E5]">plataforma transcontinental diversificada</strong>.
                </p>
              </div>

              {/* Right: Stylized map representation */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl bg-[#1A1D23] border border-[rgba(197,160,89,0.15)] p-8 overflow-hidden">
                  {/* Simplified world representation with dots */}
                  <div className="relative w-full h-full">
                    {/* Grid pattern */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `radial-gradient(circle, #C5A059 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                      }}
                    />

                    {/* Highlighted regions - dots representing presence */}
                    <div className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                    <div className="absolute top-[25%] left-[45%] w-3 h-3 rounded-full bg-[#C5A059]" />
                    <div className="absolute top-[30%] left-[48%] w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute top-[35%] left-[70%] w-3 h-3 rounded-full bg-[#C5A059]" />
                    <div className="absolute top-[40%] left-[75%] w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-[50%] left-[20%] w-2 h-2 rounded-full bg-[#C5A059]" />
                    <div className="absolute top-[55%] left-[25%] w-3 h-3 rounded-full bg-[#C5A059] animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <div className="absolute top-[60%] left-[55%] w-2 h-2 rounded-full bg-[#C5A059]" />
                    <div className="absolute top-[45%] left-[80%] w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" style={{ animationDelay: '0.7s' }} />
                    <div className="absolute top-[70%] left-[65%] w-2 h-2 rounded-full bg-[#C5A059]" />

                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.2 }}>
                      <line x1="45%" y1="25%" x2="70%" y2="35%" stroke="#C5A059" strokeWidth="1" />
                      <line x1="45%" y1="25%" x2="20%" y2="50%" stroke="#C5A059" strokeWidth="1" />
                      <line x1="70%" y1="35%" x2="80%" y2="45%" stroke="#C5A059" strokeWidth="1" />
                      <line x1="25%" y1="55%" x2="55%" y2="60%" stroke="#C5A059" strokeWidth="1" />
                    </svg>
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-[#6B7280]">
                    <div className="w-2 h-2 rounded-full bg-[#C5A059]" />
                    <span>Presencia activa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN 5: LOS VEHÍCULOS - El Producto como Activo
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 bg-[#0A0A0E]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl sm:text-4xl mb-4">
                Commodities de Alta Velocidad
              </h2>
              <p className="text-[#A3A3A3] max-w-2xl mx-auto">
                No vendemos productos de nicho. Inyectamos propiedad intelectual
                <span className="text-[#C5A059]"> (Extracto Hidrosoluble de Ganoderma) </span>
                en los hábitos de consumo más arraigados del planeta.
              </p>
            </div>

            {/* Product formula visualization */}
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-3 gap-4 items-center">
                {/* El Vehículo */}
                <div className="text-center p-6 rounded-xl bg-[#1A1D23] border border-[rgba(197,160,89,0.1)]">
                  <Coffee className="w-10 h-10 text-[#C5A059] mx-auto mb-4" />
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-2">El Vehículo</p>
                  <p className="text-lg text-[#E5E5E5] font-medium">Café Arábica Premium</p>
                </div>

                {/* Plus sign */}
                <div className="hidden md:flex justify-center">
                  <div className="w-10 h-10 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059] text-2xl font-light">
                    +
                  </div>
                </div>

                {/* La Carga */}
                <div className="text-center p-6 rounded-xl bg-[#1A1D23] border border-[rgba(197,160,89,0.1)]">
                  <Leaf className="w-10 h-10 text-[#C5A059] mx-auto mb-4" />
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-2">La Carga</p>
                  <p className="text-lg text-[#E5E5E5] font-medium">200+ Fitonutrientes</p>
                </div>
              </div>

              {/* Equals */}
              <div className="flex justify-center my-6">
                <div className="w-12 h-12 rounded-full bg-[#C5A059] flex items-center justify-center text-[#0F1115] text-2xl font-bold">
                  =
                </div>
              </div>

              {/* Result */}
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#1A1D23] to-[#0F1115] border border-[#C5A059]">
                <TrendingUp className="w-12 h-12 text-[#C5A059] mx-auto mb-4" />
                <p className="text-xs text-[#C5A059] uppercase tracking-wider mb-2">La Frecuencia</p>
                <p className="text-2xl text-[#E5E5E5] font-serif">Consumo diario, reposición automática</p>
                <p className="text-[#A3A3A3] mt-3 text-sm">
                  Activos que generan ingresos recurrentes predecibles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            STATS BAR - Números que hablan
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 px-6 border-y border-[rgba(197,160,89,0.15)]">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="font-serif text-4xl sm:text-5xl text-[#C5A059] mb-2">35+</p>
                <p className="text-sm text-[#6B7280] uppercase tracking-wider">Años de Operación</p>
              </div>
              <div>
                <p className="font-serif text-4xl sm:text-5xl text-[#C5A059] mb-2">70+</p>
                <p className="text-sm text-[#6B7280] uppercase tracking-wider">Países</p>
              </div>
              <div>
                <p className="font-serif text-4xl sm:text-5xl text-[#C5A059] mb-2">100%</p>
                <p className="text-sm text-[#6B7280] uppercase tracking-wider">Capital Privado</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            CTA FINAL - El Cierre Sobrio
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl mb-6">
              Esta es la infraestructura sobre la que
              <br />
              <span className="text-[#C5A059]">construirás tu patrimonio</span>
            </h2>

            <p className="text-[#A3A3A3] mb-10 text-lg">
              ¿Listo para operar?
            </p>

            <Link
              href="/reto-5-dias"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0F1115] font-semibold text-lg rounded-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_20px_40px_rgba(197,160,89,0.3)]"
            >
              Comenzar el Reto de 5 Días
              <ChevronRight className="w-5 h-5" />
            </Link>

            <p className="text-[#6B7280] text-sm mt-6">
              Sin costo · 5 días por WhatsApp · Sin compromiso
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FOOTER MÍNIMO
            ═══════════════════════════════════════════════════════════════ */}
        <footer className="py-12 px-6 border-t border-[rgba(197,160,89,0.1)]">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm text-[#6B7280]">
              © 2025 CreaTuActivo.com ·
              <Link href="/privacidad" className="hover:text-[#A3A3A3] ml-2 transition-colors">
                Privacidad
              </Link>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
