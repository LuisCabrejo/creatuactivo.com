/**
 * Copyright © 2026 CreaTuActivo.com
 * SERVILLETA DIGITAL - Presentación Mobile-First
 *
 * THE ARCHITECT'S SUITE - Bimetallic System v3.1 (Post-Audit)
 * Gold (#C5A059): CTAs, large titles (>24px), icons, borders ONLY
 * Beige Champagne (#F5E8D8): Small gold-semantic text (<24px) for WCAG AAA contrast
 * Coral (#FF8A80): Replaces red for accessibility (protanopia-safe)
 * Titanium (#94A3B8): Structural elements, navigation, muted text
 * Carbon backgrounds: #0F1115 (deep), #15171C (elevated), #1A1D23 (cards)
 * Typography: font-feature-settings 'tnum' for financial numbers
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

'use client';

import React, { useState } from 'react';
import {
  Clock,
  FlaskConical,
  User,
  DollarSign,
  Users,
  Smartphone,
  BarChart3,
  ArrowRight,
  Zap,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

type TabId = 'villain' | 'solution' | 'fit' | 'money';
type IncomeMode = 'gen5' | 'binario';

export default function ServilletaPage() {
  const [activeTab, setActiveTab] = useState<TabId>('villain');
  // Simulador Bimetálico
  const [incomeMode, setIncomeMode] = useState<IncomeMode>('gen5');
  const [gen5Socios, setGen5Socios] = useState(2);
  const [gen5Package, setGen5Package] = useState<'ESP1' | 'ESP2' | 'ESP3'>('ESP3');
  const [binarioParejas, setBinarioParejas] = useState(50);

  const switchTab = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  // GEN5: Bonos por paquete (COMP_GEN5_04)
  const gen5Bonuses: Record<string, number> = { ESP1: 25, ESP2: 75, ESP3: 150 };
  const gen5Income = gen5Socios * gen5Bonuses[gen5Package];
  // Binario: Personas lado menor × $4.76 USD mensual (proporcional confirmado)
  const exchangeRate = 4500;
  const binarioIncomeUSD = Math.round(binarioParejas * 4.76);
  const binarioIncomeCOP = binarioIncomeUSD * exchangeRate;

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E5E5E5] flex flex-col relative">
      {/* Grid Background Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#94A3B8 1px, transparent 1px), linear-gradient(90deg, #94A3B8 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 pt-6 pb-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <g stroke="#C5A059" strokeWidth="2" strokeLinecap="square">
                <path d="M14 5 H5 V27 H20"/>
                <path d="M16 27 V10 H27 V27"/>
                <path d="M16 18 H27"/>
              </g>
            </svg>
          </div>
          <span className="text-sm flex items-baseline">
            <span className="font-normal text-[#E5E5E5] tracking-wide" style={{ fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif' }}>CreaTu</span>
            <span className="font-bold text-[#C5A059] tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Activo</span>
          </span>
        </Link>
        <div className="px-3 py-1.5 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 text-xs text-[#C5A059] font-medium">
          Acceso Privado
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-y-auto pb-32 px-4 sm:px-6">

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: LA TRAMPA (Villain) - Financial Risk Report Style
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'villain' && (
          <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center animate-fadeIn max-w-3xl mx-auto w-full py-4">
            {/* Header - Outside container (matches Tab 2 title position) */}
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF8A80] rounded-full animate-pulse" />
                <span className="text-[11px] text-[#94A3B8] uppercase tracking-widest font-mono font-medium">
                  Diagnóstico Estructural
                </span>
              </div>
              <span className="text-[11px] text-[#FF8A80] font-mono border border-[#FF8A80]/20 px-2 py-0.5 rounded bg-[#FF8A80]/5 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />
                ALERTA ACTIVA
              </span>
            </div>

            {/* Unified Container Panel - Same chassis as Tab 2 */}
            <div className="rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl flex flex-col bg-[#0F1115]">
            {/* Risk Diagnostic Card — Coral (#FF8A80) replaces red for protanopia safety */}
            <div className="bg-[#FF8A80]/5 backdrop-blur-sm p-6 border-b border-[#FF8A80]/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-[#FF8A80] uppercase tracking-wider font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Riesgo Operativo
                </span>
                <span className="text-xs font-bold text-[#FF8A80] bg-[#FF8A80]/20 px-2 py-0.5 rounded">
                  ALTO
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-white" style={{ fontFamily: 'Georgia, serif', fontFeatureSettings: "'tnum'" }}>
                  100%
                </span>
                <span className="text-sm text-[#E5E5E5] font-normal">dependencia ingreso activo</span>
              </div>
              <p className="text-sm text-[#FF8A80]/80 mt-3 font-normal italic">
                &quot;Si tú paras, el dinero para.&quot;
              </p>
            </div>

            {/* Divergent Lines Graph - Employment vs Asset */}
            <div className="relative w-full h-52 bg-[#1A1D23]/40 backdrop-blur-sm p-4 overflow-hidden border-b border-white/5">
              {/* Legend - Top Right */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-[#FF8A80]" />
                  <span className="text-[11px] text-[#E5E5E5] font-normal">Empleo (Lineal)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-[#C5A059]" />
                  <span className="text-[11px] text-[#F5E8D8] font-normal">Activo (Exponencial)</span>
                </div>
              </div>

              <svg viewBox="0 0 300 130" className="w-full h-full">
                {/* Grid lines */}
                <line x1="30" y1="20" x2="30" y2="110" stroke="#1F2937" strokeWidth="1" />
                <line x1="30" y1="110" x2="280" y2="110" stroke="#1F2937" strokeWidth="1" />
                {/* Horizontal grid lines */}
                <line x1="30" y1="40" x2="280" y2="40" stroke="#1F2937" strokeWidth="0.5" opacity="0.3" />
                <line x1="30" y1="70" x2="280" y2="70" stroke="#1F2937" strokeWidth="0.5" opacity="0.3" />

                {/* Y-axis labels - Improved contrast */}
                <text x="25" y="25" textAnchor="end" fill="#94A3B8" fontSize="8" fontFamily="monospace">$$$</text>
                <text x="25" y="70" textAnchor="end" fill="#94A3B8" fontSize="8" fontFamily="monospace">$$</text>
                <text x="25" y="108" textAnchor="end" fill="#94A3B8" fontSize="8" fontFamily="monospace">$0</text>

                {/* X-axis label */}
                <text x="280" y="125" textAnchor="end" fill="#64748B" fontSize="8" fontFamily="monospace">TIEMPO →</text>

                {/* Line A: Employment - rises then CRASHES */}
                <path
                  className="animate-drawLine"
                  d="M30,95 L80,75 L130,65 L155,60 L175,85 L195,100 L215,108 L280,108"
                  fill="none"
                  stroke="#FF8A80"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                {/* Crash indicator - More visible */}
                <circle cx="175" cy="85" r="12" fill="none" stroke="#FF8A80" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
                <text x="175" y="70" textAnchor="middle" fill="#FF8A80" fontSize="9" fontFamily="monospace" fontWeight="bold">CRISIS</text>

                {/* Line B: Asset - J-curve exponential growth */}
                <path
                  className="animate-drawAsset"
                  d="M30,105 L80,103 L130,98 L175,85 L215,55 L255,30 L280,20"
                  fill="none"
                  stroke="#C5A059"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Crossover point indicator */}
                <circle cx="200" cy="65" r="5" fill="#0F1115" stroke="#C5A059" strokeWidth="2" className="animate-pulse" />
              </svg>
            </div>

            {/* The Cycle - Hamster Wheel Diagram */}
            <div className="bg-[#1A1D23]/20 p-6 border-b border-white/5">
              <div className="flex items-center gap-2 mb-6 justify-center">
                <div className="w-1 h-4 bg-[#FF8A80]/50 rounded-full" />
                <span className="text-sm text-[#E5E5E5] font-medium uppercase tracking-widest">El Plan por Defecto</span>
              </div>

              {/* Cycle visualization - horizontal flow */}
              <div className="flex items-center justify-between text-center px-2 sm:px-8">
                <div className="flex-1">
                  <div className="w-12 h-12 mx-auto bg-[#15171C] rounded-xl flex items-center justify-center mb-2 border border-white/10">
                    <span className="text-xl">💼</span>
                  </div>
                  <span className="text-[11px] text-[#E5E5E5]/70 uppercase tracking-wide block font-normal">Trabajar</span>
                </div>
                <span className="text-[#475569] text-sm">→</span>
                <div className="flex-1">
                  <div className="w-12 h-12 mx-auto bg-[#15171C] rounded-xl flex items-center justify-center mb-2 border border-white/10">
                    <span className="text-xl">💸</span>
                  </div>
                  <span className="text-[11px] text-[#E5E5E5]/70 uppercase tracking-wide block font-normal">Pagar</span>
                </div>
                <span className="text-[#475569] text-sm">→</span>
                <div className="flex-1">
                  <div className="w-12 h-12 mx-auto bg-[#15171C] rounded-xl flex items-center justify-center mb-2 border border-[#FF8A80]/30 shadow-[0_0_15px_rgba(255,138,128,0.1)]">
                    <span className="text-xl">📉</span>
                  </div>
                  <span className="text-[11px] text-[#FF8A80] font-bold uppercase tracking-wide block">$0</span>
                </div>
                <span className="text-[#475569] text-sm">→</span>
                <div className="flex-1">
                  <div className="w-12 h-12 mx-auto bg-[#15171C] rounded-xl flex items-center justify-center mb-2 border border-white/10">
                    <span className="text-xl">🔄</span>
                  </div>
                  <span className="text-[11px] text-[#E5E5E5]/70 uppercase tracking-wide block font-normal">Repetir</span>
                </div>
              </div>

              {/* Loop indicator */}
              <div className="mt-6 pt-4 border-t border-white/5 text-center">
                <span className="text-sm text-[#A3A3A3] italic font-normal">
                  Este ciclo se repite hasta los 65 años... o hasta que el cuerpo diga basta.
                </span>
              </div>
            </div>

            {/* Exit Promise - Naval/Jobs style quote */}
            <div className="p-6 bg-gradient-to-b from-[#1A1D23]/20 to-transparent">
              <div className="border-l-2 border-[#C5A059]/50 pl-5 py-1">
                <p className="text-base sm:text-lg text-[#E5E5E5] font-normal italic leading-relaxed">
                  &quot;No necesitas más esfuerzo.<br />
                  <span className="text-[#F5E8D8] font-semibold not-italic">Necesitas cambiar de vehículo.&quot;</span>
                </p>
              </div>
            </div>
            </div>{/* End unified container panel */}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: EL SISTEMA (Solution)
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'solution' && (
          <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center animate-fadeIn max-w-3xl mx-auto w-full py-4">
            <div className="text-center mb-8">
              <span className="text-[11px] text-[#E5E5E5]/60 uppercase tracking-[0.25em] mb-3 block font-medium">
                Arquitectura de Activos
              </span>
              <h1 className="text-4xl leading-tight text-white" style={{ fontFamily: 'Georgia, serif' }}>
                Eficiencia,
                <br />
                <span className="bg-gradient-to-r from-[#C5A059] to-[#D4AF37] bg-clip-text text-transparent">no magia.</span>
              </h1>
            </div>

            <div className="rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl flex flex-col bg-[#0F1115]">
              {/* TOP: Tu Rol (10%) - The Key */}
              <div className="p-8 bg-gradient-to-b from-white/[0.05] to-transparent relative z-20 flex-shrink-0">
                <div className="flex items-center gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C5A059] to-[#A68A4A] flex items-center justify-center text-[#0F1115] font-bold text-2xl shadow-[0_0_30px_rgba(197,160,89,0.3)] border border-white/20 relative z-10">
                      10%
                    </div>
                    {/* "Tu Aporte" label */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#15171C] border border-[#C5A059]/30 text-[#F5E8D8] text-[11px] px-3 py-0.5 rounded-full whitespace-nowrap z-20 uppercase tracking-wider font-medium shadow-lg">
                      Tu Aporte
                    </div>
                    {/* Power cable connector */}
                    <div className="absolute left-1/2 top-20 w-[2px] h-20 bg-gradient-to-b from-[#C5A059] via-[#C5A059]/50 to-[#94A3B8]/20 -translate-x-1/2 z-0" />
                  </div>
                  <div>
                    <h3 className="text-white text-2xl tracking-wide mb-2" style={{ fontFamily: 'Georgia, serif' }}>Tu Rol: El Arquitecto</h3>
                    <p className="text-sm text-[#E5E5E5]/80 font-normal leading-relaxed">
                      Conectar personas. Cobrar el peaje.<br />
                      <span className="text-[#F5E8D8] font-medium">Sin logística. Sin inventario.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* BOTTOM: Infraestructura (90%) - The Massive Engine */}
              <div className="bg-[#050608] relative border-t border-white/10 flex-grow p-8 pt-12 overflow-hidden">
                {/* Giant 90% watermark - centered */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.04]">
                  <span className="text-[140px] sm:text-[200px] font-bold text-white leading-none select-none" style={{ fontFamily: 'Georgia, serif' }}>
                    90%
                  </span>
                </div>

                {/* Engineering grid texture */}
                <div
                  className="absolute inset-0 opacity-[0.08] pointer-events-none z-0"
                  style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                <div className="relative z-10">
                  {/* Robust section header */}
                  <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-3">
                    <h3 className="text-base text-white font-bold tracking-widest uppercase">
                      Infraestructura
                    </h3>
                    <div className="h-px flex-grow bg-white/5" />
                    <span className="text-[11px] text-[#E5E5E5]/60 font-mono uppercase bg-white/5 px-2 py-1 rounded font-medium">Respaldo Global</span>
                  </div>

                  {/* Socio Industrial - Steel block with internal label */}
                  <div className="mb-6 group">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-[#94A3B8] font-medium tracking-wide group-hover:text-white transition-colors">Socio Industrial</span>
                      <span className="text-[#F5E8D8] font-bold font-mono text-[11px] bg-[#15171C] px-2 py-0.5 rounded border border-[#C5A059]/20" style={{ fontFeatureSettings: "'tnum'" }}>$100M Capital</span>
                    </div>
                    <div className="h-8 w-full bg-[#15171C] rounded-sm overflow-hidden relative border border-white/10 shadow-lg">
                      <div
                        className="absolute inset-0 w-full h-full opacity-[0.08]"
                        style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #fff 5px, #fff 6px)' }}
                      />
                      <div className="h-full bg-gradient-to-r from-[#94A3B8]/40 to-[#94A3B8]/10 w-full" />
                      <div className="absolute inset-0 flex items-center justify-start pl-3">
                        <span className="text-[11px] sm:text-xs text-white font-mono uppercase tracking-widest font-bold drop-shadow-md">Infraestructura Física &amp; Legal</span>
                      </div>
                    </div>
                  </div>

                  {/* Tecnología Queswa - Gold energy block with internal label */}
                  <div className="group">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-[#94A3B8] font-medium tracking-wide group-hover:text-white transition-colors">Tecnología Queswa</span>
                      <span className="text-[#F5E8D8] font-bold font-mono text-[11px] bg-[#15171C] px-2 py-0.5 rounded border border-[#C5A059]/20">IA &amp; Logística</span>
                    </div>
                    <div className="h-8 w-full bg-[#15171C] rounded-sm overflow-hidden relative border border-[#C5A059]/30 shadow-[0_0_15px_rgba(197,160,89,0.1)]">
                      <div className="absolute inset-0 bg-[#C5A059]/5 w-full" />
                      <div className="h-full bg-gradient-to-r from-[#C5A059]/30 via-[#C5A059]/50 to-[#C5A059]/30 w-full animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-start pl-3">
                        <span className="text-[11px] sm:text-xs text-white font-mono uppercase tracking-widest font-bold drop-shadow-md">Sistema Automatizado</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 text-center relative z-10 px-4">
                  <p className="text-sm sm:text-base text-[#E5E5E5]/80 italic font-normal leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    &quot;Nosotros ponemos los barcos, las fábricas y la IA.<br />
                    <span className="text-white font-semibold not-italic">Tú solo pones la conexión.&quot;</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: TU ROL (Fit)
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'fit' && (
          <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center animate-fadeIn max-w-3xl mx-auto w-full py-4">

            {/* Header Centrado */}
            <div className="text-center mb-8">
              <span className="text-[11px] text-[#E5E5E5]/60 uppercase tracking-[0.2em] mb-2 block font-medium">
                Matriz de Operación
              </span>
              <h1 className="text-3xl text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Define tu Estilo
              </h1>
              <p className="text-sm text-[#E5E5E5]/70 font-normal max-w-md mx-auto leading-relaxed">
                El sistema no te pide que cambies quién eres.<br/>
                <span className="text-[#F5E8D8] font-medium">La tecnología se adapta a tu perfil.</span>
              </p>
            </div>

            <div className="space-y-5">

              {/* OPCIÓN 1: MODO RELACIONAL (High Touch) */}
              <div className="group relative bg-[#1A1D23]/40 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:border-[#C5A059]/30 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users className="w-16 h-16 text-[#94A3B8]" />
                </div>
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#15171C] border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-[#C5A059]/50 transition-colors">
                    <Users className="w-5 h-5 text-[#94A3B8] group-hover:text-[#C5A059]" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-medium mb-1 group-hover:text-[#C5A059] transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                      Modo Relacional
                    </h3>
                    <p className="text-[11px] text-[#E5E5E5]/50 uppercase tracking-wider mb-2 font-mono font-medium">Para el Conector Natural</p>
                    <p className="text-sm text-[#E5E5E5]/80 font-normal leading-relaxed">
                      Prefieres el contacto humano. Café presencial, apretón de manos y construcción de confianza cara a cara. La App es solo tu apoyo administrativo.
                    </p>
                  </div>
                </div>
              </div>

              {/* OPCIÓN 2: MODO HÍBRIDO (Smart Leverage) - DESTACADO */}
              <div className="group relative bg-gradient-to-r from-[#C5A059]/10 to-[#1A1D23]/60 backdrop-blur-sm p-6 rounded-xl border border-[#C5A059]/40 cursor-pointer shadow-[0_0_30px_rgba(197,160,89,0.05)]">
                {/* Badge de Recomendado */}
                <div className="absolute top-0 right-0 bg-[#C5A059] text-[#0F1115] text-[9px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl uppercase tracking-wider">
                  Recomendado
                </div>

                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Smartphone className="w-16 h-16 text-[#C5A059]" />
                </div>

                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <div>
                    <h3 className="text-[#C5A059] text-lg font-medium mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                      Modo Híbrido
                    </h3>
                    <p className="text-[11px] text-[#F5E8D8]/60 uppercase tracking-wider mb-2 font-mono font-medium">Marca Personal + Tecnología</p>
                    <p className="text-sm text-[#E5E5E5] font-normal leading-relaxed">
                      Usas tus redes para atraer y Queswa para filtrar. Tú solo hablas con los que ya levantaron la mano. <span className="font-semibold text-white">Máxima eficiencia.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* OPCIÓN 3: MODO INVERSIONISTA (Low Touch) */}
              <div className="group relative bg-[#1A1D23]/40 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:border-[#C5A059]/30 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BarChart3 className="w-16 h-16 text-[#94A3B8]" />
                </div>
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#15171C] border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-[#C5A059]/50 transition-colors">
                    <BarChart3 className="w-5 h-5 text-[#94A3B8] group-hover:text-[#C5A059]" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-medium mb-1 group-hover:text-[#C5A059] transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                      Modo Inversionista
                    </h3>
                    <p className="text-[11px] text-[#E5E5E5]/50 uppercase tracking-wider mb-2 font-mono font-medium">Tráfico Pago + Sistemas</p>
                    <p className="text-sm text-[#E5E5E5]/80 font-normal leading-relaxed">
                      No tienes tiempo. Inviertes capital en publicidad (Ads) y delegas el cierre en el sistema y el equipo. Tu rol es puramente estratégico.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 4: EL DINERO (Money) - SIMULADOR BIMETÁLICO (GEN5 + BINARIO)
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'money' && (
          <div className="min-h-[calc(100vh-200px)] flex flex-col pt-4 animate-fadeIn max-w-3xl mx-auto w-full">

            <div className="text-center mb-6">
              <span className="text-[11px] text-[#E5E5E5]/60 uppercase tracking-[0.2em] mb-2 block font-medium">
                Proyección de Ingresos
              </span>
              <h1 className="text-3xl text-white" style={{ fontFamily: 'Georgia, serif' }}>
                Simulador de Soberanía
              </h1>
            </div>

            {/* SIMULADOR BIMETÁLICO */}
            <div className="bg-[#1A1D23]/60 backdrop-blur-sm rounded-2xl border border-[#C5A059]/30 relative overflow-hidden shadow-2xl flex flex-col">

              {/* SELECTOR DE MODO (TABS) */}
              <div className="grid grid-cols-2 border-b border-white/5 bg-[#0F1115]/50">
                <button
                  onClick={() => setIncomeMode('gen5')}
                  className={`py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-r border-white/5 ${
                    incomeMode === 'gen5'
                      ? 'text-[#C5A059] bg-[#C5A059]/10'
                      : 'text-[#64748B] hover:text-white'
                  }`}
                >
                  <Zap size={14} /> Capital Rápido
                </button>
                <button
                  onClick={() => setIncomeMode('binario')}
                  className={`py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    incomeMode === 'binario'
                      ? 'text-[#66FCF1] bg-[#66FCF1]/10'
                      : 'text-[#64748B] hover:text-white'
                  }`}
                >
                  <TrendingUp size={14} /> Renta Vitalicia
                </button>
              </div>

              {/* CONTENEDOR DE MODOS */}
              <div className="p-8 relative min-h-[300px] flex flex-col justify-center">

                {/* MODO 1: CAPITAL RÁPIDO (GEN5) */}
                {incomeMode === 'gen5' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="text-center">
                      <p className="text-[11px] text-[#F5E8D8] mb-2 uppercase tracking-wider font-medium">Tu Ganancia Inmediata</p>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl md:text-6xl font-bold text-white tracking-tight" style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 30px rgba(197,160,89,0.2)', fontFeatureSettings: "'tnum'" }}>
                          ${gen5Income.toLocaleString()}
                        </span>
                        <span className="text-xl text-[#A3A3A3]">USD</span>
                      </div>
                      <p className="text-sm text-[#E5E5E5]/70 mt-2 font-normal">
                        Al conectar <span className="text-white font-bold">{gen5Socios}</span> socios en Paquete {gen5Package === 'ESP1' ? 'Inicial' : gen5Package === 'ESP2' ? 'Empresarial' : 'Visionario'}
                      </p>
                    </div>

                    {/* Selector de Paquete */}
                    <div className="flex justify-center gap-2">
                      {([
                        { key: 'ESP1' as const, label: 'Inicial', bonus: '$25' },
                        { key: 'ESP2' as const, label: 'Empresarial', bonus: '$75' },
                        { key: 'ESP3' as const, label: 'Visionario', bonus: '$150' },
                      ]).map((pkg) => (
                        <button
                          key={pkg.key}
                          onClick={() => setGen5Package(pkg.key)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            gen5Package === pkg.key
                              ? 'bg-[#C5A059]/20 border border-[#C5A059] text-[#C5A059]'
                              : 'bg-[#15171C] border border-white/10 text-[#94A3B8] hover:border-white/20'
                          }`}
                        >
                          <span className="block">{pkg.label}</span>
                          <span className={`block text-[11px] mt-0.5 ${gen5Package === pkg.key ? 'text-[#F5E8D8]/70' : 'text-[#A3A3A3]'}`} style={{ fontFeatureSettings: "'tnum'" }}>{pkg.bonus}/socio</span>
                        </button>
                      ))}
                    </div>

                    {/* Slider de Socios */}
                    <div className="relative pt-4 pb-2 px-2">
                      <div className="absolute top-[calc(50%-2px)] left-2 right-2 h-2 bg-[#15171C] rounded-full" />
                      <div
                        className="absolute top-[calc(50%-2px)] left-2 h-2 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] rounded-full pointer-events-none z-10 transition-all duration-100 shadow-[0_0_15px_rgba(197,160,89,0.5)]"
                        style={{ width: `calc(${((gen5Socios - 1) / 9) * 100}%)` }}
                      />
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={gen5Socios}
                        onChange={(e) => setGen5Socios(parseInt(e.target.value))}
                        className="relative w-full h-8 bg-transparent appearance-none cursor-pointer z-20"
                      />
                      <div className="flex justify-between mt-4 text-[11px] text-[#A3A3A3] uppercase tracking-widest font-mono font-medium">
                        <span>1 Socio</span>
                        <span>5 Socios</span>
                        <span>10 Socios</span>
                      </div>
                    </div>

                    <div className="bg-[#C5A059]/5 border border-[#C5A059]/10 p-3 rounded-lg flex gap-3 items-center">
                      <div className="p-2 bg-[#C5A059]/10 rounded-full text-[#C5A059]"><Zap size={14} /></div>
                      <p className="text-[11px] text-[#E5E5E5]/70 leading-tight font-normal">
                        <strong className="text-[#F5E8D8]">Insight:</strong> Este bono se paga semanalmente. Es tu capital para recuperar inversión y financiar tu estilo de vida mientras construyes.
                      </p>
                    </div>
                  </div>
                )}

                {/* MODO 2: RENTA VITALICIA (BINARIO) */}
                {incomeMode === 'binario' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="text-center">
                      <p className="text-[11px] text-[#66FCF1] mb-2 uppercase tracking-wider font-medium">Tu Renta Mensual Recurrente</p>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl md:text-6xl font-bold text-white tracking-tight" style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 30px rgba(102,252,241,0.2)', fontFeatureSettings: "'tnum'" }}>
                          ${binarioIncomeUSD.toLocaleString('en-US')}
                        </span>
                        <span className="text-xl text-[#A3A3A3]">USD</span>
                      </div>
                      <p className="text-sm text-[#A3A3A3] mt-1" style={{ fontFeatureSettings: "'tnum'" }}>
                        ({binarioIncomeCOP.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })})
                      </p>
                      <p className="text-sm text-[#E5E5E5]/70 mt-2 font-normal">
                        Con <span className="text-white font-bold">{binarioParejas}</span> personas en tu lado menor
                      </p>
                    </div>

                    {/* Slider de Volumen */}
                    <div className="relative pt-4 pb-2 px-2">
                      <div className="absolute top-[calc(50%-2px)] left-2 right-2 h-2 bg-[#15171C] rounded-full" />
                      <div
                        className="absolute top-[calc(50%-2px)] left-2 h-2 bg-gradient-to-r from-[#45A29E] to-[#66FCF1] rounded-full pointer-events-none z-10 transition-all duration-100 shadow-[0_0_15px_rgba(102,252,241,0.4)]"
                        style={{ width: `calc(${((binarioParejas - 10) / 490) * 100}%)` }}
                      />
                      <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={binarioParejas}
                        onChange={(e) => setBinarioParejas(parseInt(e.target.value))}
                        className="relative w-full h-8 bg-transparent appearance-none cursor-pointer z-20"
                      />
                      <div className="flex justify-between mt-4 text-[11px] text-[#A3A3A3] uppercase tracking-widest font-mono font-medium">
                        <span>Inicio (10)</span>
                        <span>Expansión (250)</span>
                        <span>Libertad (500)</span>
                      </div>
                    </div>

                    <div className="bg-[#66FCF1]/5 border border-[#66FCF1]/10 p-3 rounded-lg flex gap-3 items-center">
                      <div className="p-2 bg-[#66FCF1]/10 rounded-full text-[#66FCF1]"><TrendingUp size={14} /></div>
                      <p className="text-[11px] text-[#E5E5E5]/70 leading-tight font-normal">
                        <strong className="text-[#66FCF1]">Insight:</strong> No tienes que traer a los 500 tú solo. Tú traes a 2, ellos a 2... el Efecto Compuesto hace el trabajo duro.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* SECCIÓN DE CIERRE */}
            <div className="mt-auto space-y-6 text-center px-4 pb-8">

              <div className="space-y-2">
                <p className="text-sm text-[#E5E5E5]/70 font-normal">
                  No vendemos nada. Damos acceso a una infraestructura de soberanía.
                </p>
                {/* Scarcity Trigger */}
                <div className="inline-flex items-center gap-2 bg-[#C5A059]/10 px-4 py-1.5 rounded-full border border-[#C5A059]/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                  <span className="text-[11px] text-[#F5E8D8] font-bold uppercase tracking-wider">
                    Solo 30 cupos de Fundador activos
                  </span>
                </div>
              </div>

              <Link
                href="/paquetes"
                className="block w-full py-5 bg-gradient-to-r from-[#C5A059] to-[#B38B59] hover:from-[#D4AF37] hover:to-[#C5A059] text-[#0F1115] font-bold text-lg rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.25)] hover:shadow-[0_0_40px_rgba(197,160,89,0.4)] flex items-center justify-center gap-2"
              >
                Aplicar como Fundador <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="pt-2">
                <Link
                  href="/reto-5-dias"
                  className="text-xs text-[#64748B] hover:text-[#E5E5E5] transition-colors uppercase tracking-widest border-b border-transparent hover:border-[#64748B] pb-0.5"
                >
                  Tengo dudas &bull; Acceder al Simulador
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM NAVIGATION
      ═══════════════════════════════════════════════════════════════════ */}
      <nav className="fixed bottom-4 left-4 right-4 h-16 bg-[#1A1D23]/90 backdrop-blur-xl rounded-2xl flex justify-around items-center z-50 shadow-2xl border border-white/5 max-w-3xl mx-auto">
        <button
          onClick={() => switchTab('villain')}
          className={`flex flex-col items-center gap-1 w-1/4 transition-all duration-300 ${
            activeTab === 'villain' ? 'text-[#C5A059]' : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className={`text-[11px] ${activeTab === 'villain' ? 'font-medium' : ''}`}>La Trampa</span>
        </button>

        <button
          onClick={() => switchTab('solution')}
          className={`flex flex-col items-center gap-1 w-1/4 transition-all duration-300 ${
            activeTab === 'solution' ? 'text-[#C5A059]' : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          <FlaskConical className="w-5 h-5" />
          <span className={`text-[11px] ${activeTab === 'solution' ? 'font-medium' : ''}`}>El Sistema</span>
        </button>

        <button
          onClick={() => switchTab('fit')}
          className={`flex flex-col items-center gap-1 w-1/4 transition-all duration-300 ${
            activeTab === 'fit' ? 'text-[#C5A059]' : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className={`text-[11px] ${activeTab === 'fit' ? 'font-medium' : ''}`}>Tu Rol</span>
        </button>

        <button
          onClick={() => switchTab('money')}
          className={`flex flex-col items-center gap-1 w-1/4 transition-all duration-300 ${
            activeTab === 'money' ? 'text-[#C5A059]' : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          <DollarSign className="w-5 h-5" />
          <span className={`text-[11px] ${activeTab === 'money' ? 'font-medium' : ''}`}>El Dinero</span>
        </button>
      </nav>

      {/* Custom Styles */}
      <style jsx global>{`
        /* Fade In Animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        /* Line Draw Animation - Employment line */
        @keyframes drawLine {
          from { stroke-dasharray: 500; stroke-dashoffset: 500; }
          to { stroke-dasharray: 500; stroke-dashoffset: 0; }
        }
        .animate-drawLine {
          animation: drawLine 2s ease-out forwards;
        }

        /* Asset Line Animation - Delayed start */
        @keyframes drawAsset {
          from { stroke-dasharray: 500; stroke-dashoffset: 500; }
          to { stroke-dasharray: 500; stroke-dashoffset: 0; }
        }
        .animate-drawAsset {
          animation: drawAsset 2.5s ease-out 0.5s forwards;
          stroke-dasharray: 500;
          stroke-dashoffset: 500;
        }

        /* Custom Range Slider */
        input[type="range"] {
          -webkit-appearance: none;
          height: 4px;
          border-radius: 2px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #C5A059;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(197, 160, 89, 0.5);
          border: 2px solid #0F1115;
        }
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #C5A059;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(197, 160, 89, 0.5);
          border: 2px solid #0F1115;
        }
      `}</style>
    </div>
  );
}
