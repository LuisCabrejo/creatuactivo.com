/**
 * Copyright © 2026 CreaTuActivo.com
 * SERVILLETA DIGITAL - Presentación Mobile-First
 *
 * THE ARCHITECT'S SUITE - Bimetallic System v3.0
 * Gold (#C5A059): CTAs, money, achievements, key highlights
 * Titanium (#94A3B8): Structural elements, navigation, muted text
 * Carbon backgrounds: #0F1115 (deep), #15171C (elevated), #1A1D23 (cards)
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
} from 'lucide-react';
import Link from 'next/link';

type TabId = 'villain' | 'solution' | 'fit' | 'money';

interface Scenario {
  income: string;
  desc: string;
}

const scenarios: Record<string, Scenario> = {
  '1': { income: '$300 USD', desc: 'Tú + 2 Socios (Inicio Rápido)' },
  '2': { income: '$1,000 USD', desc: 'Equipo: 12 Personas (Crecimiento)' },
  '3': { income: 'Ilimitado', desc: 'Red de Consumo (Avalancha)' },
};

export default function ServilletaPage() {
  const [activeTab, setActiveTab] = useState<TabId>('villain');
  const [sliderValue, setSliderValue] = useState('2');
  const [animateIncome, setAnimateIncome] = useState(false);

  const switchTab = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  const updateSimulation = (value: string) => {
    setSliderValue(value);
    setAnimateIncome(true);
    setTimeout(() => setAnimateIncome(false), 500);
  };

  const currentScenario = scenarios[sliderValue];

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
      <header className="relative z-10 px-6 pt-8 pb-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-2 h-8 bg-[#C5A059] rounded-full" />
          <span className="text-sm tracking-widest text-[#94A3B8] uppercase" style={{ fontFamily: 'Georgia, serif' }}>
            CreaTuActivo
          </span>
        </Link>
        <div className="px-3 py-1.5 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 text-xs text-[#C5A059] font-medium">
          Acceso Privado
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-y-auto pb-28 px-6">

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: LA TRAMPA (Villain) - Financial Risk Report Style
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'villain' && (
          <div className="min-h-[calc(100vh-220px)] flex flex-col pt-2 animate-fadeIn">
            {/* Header - Sistema de diagnóstico */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-[#64748B] uppercase tracking-widest font-mono">
                  Diagnóstico Estructural
                </span>
              </div>
              <span className="text-[10px] text-red-400/80 font-mono">
                ALERTA ACTIVA
              </span>
            </div>

            {/* Risk Diagnostic Card - Glassmorphism */}
            <div className="bg-red-500/5 backdrop-blur-sm rounded-xl p-4 mb-4 border border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-red-400 uppercase tracking-wider font-medium">
                  Riesgo Operativo
                </span>
                <span className="text-xs font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded">
                  ALTO
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
                  100%
                </span>
                <span className="text-xs text-[#64748B]">dependencia ingreso activo</span>
              </div>
              <p className="text-[11px] text-red-400/70 mt-2 font-light">
                Si tú paras, el dinero para.
              </p>
            </div>

            {/* Divergent Lines Graph - Employment vs Asset */}
            <div className="relative w-full h-40 bg-[#1A1D23]/60 backdrop-blur-sm rounded-xl mb-4 p-3 overflow-hidden border border-white/5">
              <svg viewBox="0 0 300 120" className="w-full h-full">
                {/* Grid lines */}
                <line x1="30" y1="20" x2="30" y2="100" stroke="#1F2937" strokeWidth="1" />
                <line x1="30" y1="100" x2="280" y2="100" stroke="#1F2937" strokeWidth="1" />

                {/* Y-axis labels */}
                <text x="25" y="25" textAnchor="end" fill="#475569" fontSize="7" fontFamily="monospace">$$$</text>
                <text x="25" y="60" textAnchor="end" fill="#475569" fontSize="7" fontFamily="monospace">$$</text>
                <text x="25" y="98" textAnchor="end" fill="#475569" fontSize="7" fontFamily="monospace">$0</text>

                {/* X-axis label */}
                <text x="280" y="112" textAnchor="end" fill="#475569" fontSize="7" fontFamily="monospace">TIEMPO →</text>

                {/* Line A: Employment - rises then CRASHES */}
                <path
                  className="animate-drawLine"
                  d="M30,90 L80,70 L130,60 L150,55 L170,80 L190,95 L210,98 L280,98"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                {/* Crash indicator */}
                <circle cx="170" cy="80" r="8" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                <text x="170" y="72" textAnchor="middle" fill="#EF4444" fontSize="6" fontFamily="monospace">CRISIS</text>

                {/* Line B: Asset - J-curve exponential growth */}
                <path
                  className="animate-drawAsset"
                  d="M30,95 L80,93 L130,88 L170,75 L210,50 L250,25 L280,15"
                  fill="none"
                  stroke="#C5A059"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Crossover point indicator */}
                <circle cx="195" cy="58" r="4" fill="#C5A059" className="animate-pulse" />

                {/* Legend */}
                <rect x="200" y="85" width="8" height="3" fill="#EF4444" opacity="0.7" rx="1" />
                <text x="212" y="88" fill="#64748B" fontSize="6" fontFamily="Inter, sans-serif">Empleo</text>
                <rect x="200" y="93" width="8" height="3" fill="#C5A059" rx="1" />
                <text x="212" y="96" fill="#C5A059" fontSize="6" fontFamily="Inter, sans-serif">Activo</text>
              </svg>
            </div>

            {/* The Cycle - Hamster Wheel Diagram */}
            <div className="bg-[#1A1D23]/40 rounded-xl p-4 mb-4 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-red-500/50 rounded-full" />
                <span className="text-xs text-[#94A3B8] font-medium uppercase tracking-wide">El Plan por Defecto</span>
              </div>

              {/* Cycle visualization - horizontal flow */}
              <div className="flex items-center justify-between text-center">
                <div className="flex-1">
                  <div className="w-10 h-10 mx-auto bg-[#15171C] rounded-lg flex items-center justify-center mb-1 border border-white/10">
                    <span className="text-lg">💼</span>
                  </div>
                  <span className="text-[9px] text-[#64748B] block">Trabajar</span>
                </div>
                <span className="text-[#475569] text-xs">→</span>
                <div className="flex-1">
                  <div className="w-10 h-10 mx-auto bg-[#15171C] rounded-lg flex items-center justify-center mb-1 border border-white/10">
                    <span className="text-lg">💸</span>
                  </div>
                  <span className="text-[9px] text-[#64748B] block">Pagar</span>
                </div>
                <span className="text-[#475569] text-xs">→</span>
                <div className="flex-1">
                  <div className="w-10 h-10 mx-auto bg-[#15171C] rounded-lg flex items-center justify-center mb-1 border border-red-500/20">
                    <span className="text-lg">📉</span>
                  </div>
                  <span className="text-[9px] text-red-400/70 block">$0</span>
                </div>
                <span className="text-[#475569] text-xs">→</span>
                <div className="flex-1">
                  <div className="w-10 h-10 mx-auto bg-[#15171C] rounded-lg flex items-center justify-center mb-1 border border-white/10 relative">
                    <span className="text-lg">🔄</span>
                  </div>
                  <span className="text-[9px] text-[#64748B] block">Repetir</span>
                </div>
              </div>

              {/* Loop indicator */}
              <div className="mt-3 pt-3 border-t border-white/5 text-center">
                <span className="text-[10px] text-[#475569] italic">
                  Este ciclo se repite hasta los 65 años... o hasta que el cuerpo diga basta.
                </span>
              </div>
            </div>

            {/* Exit Promise - Naval/Jobs style quote */}
            <div className="mt-auto pt-2">
              <div className="border-l-2 border-[#C5A059]/50 pl-4">
                <p className="text-sm text-[#E5E5E5] font-light italic leading-relaxed">
                  &quot;No necesitas más esfuerzo.<br />
                  <span className="text-[#C5A059] font-medium not-italic">Necesitas cambiar de vehículo.&quot;</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: EL SISTEMA (Solution)
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'solution' && (
          <div className="min-h-[calc(100vh-220px)] flex flex-col justify-center animate-fadeIn">
            <div className="text-center mb-6">
              <span className="text-xs text-[#C5A059] tracking-widest uppercase mb-2 block font-medium">
                Arquitectura de Activos
              </span>
              <h1 className="text-3xl leading-tight text-white" style={{ fontFamily: 'Georgia, serif' }}>
                Eficiencia,
                <br />
                <span className="bg-gradient-to-r from-[#C5A059] to-[#D4AF37] bg-clip-text text-transparent">no magia.</span>
              </h1>
            </div>

            <div className="bg-[#1A1D23]/60 backdrop-blur-sm rounded-2xl p-6 mb-8 relative border border-white/5">
              <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-6">
                <div className="w-12 h-12 rounded-full bg-[#C5A059] flex items-center justify-center text-[#0F1115] font-bold">
                  10%
                </div>
                <div>
                  <h3 className="text-white font-semibold" style={{ fontFamily: 'Georgia, serif' }}>Tu Rol: El Arquitecto</h3>
                  <p className="text-xs text-[#A3A3A3]">Conectar personas. Cobrar el peaje.</p>
                </div>
              </div>

              <div className="relative pl-4 border-l-2 border-[#C5A059]/30">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[#C5A059]" />
                <h3 className="text-[#94A3B8] font-medium mb-4" style={{ fontFamily: 'Georgia, serif' }}>Infraestructura (90%)</h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[#E5E5E5]">Socio Industrial</span>
                      <span className="text-[#C5A059]/80 text-xs">$100M Capital</span>
                    </div>
                    <div className="h-1 w-full bg-[#15171C] rounded-full overflow-hidden">
                      <div className="h-full bg-[#64748B] w-full rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[#E5E5E5]">Tecnología Queswa</span>
                      <span className="text-[#C5A059]/80 text-xs">IA & Logística</span>
                    </div>
                    <div className="h-1 w-full bg-[#15171C] rounded-full overflow-hidden">
                      <div className="h-full bg-[#64748B] w-full rounded-full" />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#64748B] mt-4 italic">
                  &quot;Nosotros ponemos los barcos, las fábricas y la IA. Tú pones la conexión.&quot;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: TU ROL (Fit)
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'fit' && (
          <div className="min-h-[calc(100vh-220px)] flex flex-col pt-4 animate-fadeIn">
            <div className="mb-6">
              <h1 className="text-2xl text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>Elige tu vehículo</h1>
              <p className="text-sm text-[#A3A3A3] font-light">
                El sistema se adapta a tu perfil, no al revés.
              </p>
            </div>

            <div className="space-y-4">
              {/* Modo Clásico */}
              <div className="bg-[#1A1D23]/60 backdrop-blur-sm p-5 rounded-xl border-l-2 border-transparent hover:border-[#C5A059] transition-all cursor-pointer group border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-medium group-hover:text-[#C5A059] transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                    Modo Clásico
                  </h3>
                  <Users className="w-5 h-5 text-[#64748B] group-hover:text-[#94A3B8] transition-colors" />
                </div>
                <p className="text-xs text-[#64748B]">
                  Relacional. Café presencial. Negocios de confianza.
                </p>
              </div>

              {/* Modo Híbrido (destacado) */}
              <div className="bg-[#C5A059]/5 backdrop-blur-sm p-5 rounded-xl border-l-2 border-[#C5A059] cursor-pointer border border-[#C5A059]/20">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[#C5A059] font-medium" style={{ fontFamily: 'Georgia, serif' }}>Modo Híbrido</h3>
                  <Smartphone className="w-5 h-5 text-[#C5A059]" />
                </div>
                <p className="text-xs text-[#A3A3A3]">
                  Marca personal + App. Usas redes, cierras con tecnología.
                </p>
              </div>

              {/* Modo Digital */}
              <div className="bg-[#1A1D23]/60 backdrop-blur-sm p-5 rounded-xl border-l-2 border-transparent hover:border-[#C5A059] transition-all cursor-pointer group border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-medium group-hover:text-[#C5A059] transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                    Modo Digital
                  </h3>
                  <BarChart3 className="w-5 h-5 text-[#64748B] group-hover:text-[#94A3B8] transition-colors" />
                </div>
                <p className="text-xs text-[#64748B]">
                  Sin tiempo. Tráfico pago + Automatización 100%.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 4: EL DINERO (Money)
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'money' && (
          <div className="min-h-[calc(100vh-220px)] flex flex-col pt-4 animate-fadeIn">
            <div className="text-center mb-6">
              <span className="text-xs text-[#C5A059] tracking-widest uppercase mb-1 block font-medium">
                Modelo Bimetálico
              </span>
              <h1 className="text-2xl text-white" style={{ fontFamily: 'Georgia, serif' }}>El Efecto Bola de Nieve</h1>
            </div>

            <div className="bg-[#1A1D23]/60 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-[#C5A059]/20 relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/10 rounded-full blur-2xl -mr-10 -mt-10" />

              <div className="flex justify-between items-end mb-2 relative z-10">
                <span className="text-xs text-[#94A3B8] uppercase tracking-wider">
                  Ingreso Mensual Proyectado
                </span>
                <span
                  className={`text-3xl text-[#C5A059] font-bold transition-transform duration-300 ${
                    animateIncome ? 'scale-110' : 'scale-100'
                  }`}
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {currentScenario.income}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mb-6 text-right">{currentScenario.desc}</p>

              {/* Slider */}
              <div className="relative py-4">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  value={sliderValue}
                  onChange={(e) => updateSimulation(e.target.value)}
                  className="w-full h-1 bg-[#1A1D23] rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                  style={{
                    background: `linear-gradient(to right, #C5A059 0%, #C5A059 ${((parseInt(sliderValue) - 1) / 2) * 100}%, #1A1D23 ${((parseInt(sliderValue) - 1) / 2) * 100}%, #1A1D23 100%)`
                  }}
                />
                <div className="flex justify-between mt-3 text-[10px] text-[#64748B] uppercase tracking-widest">
                  <span>Inicio</span>
                  <span>Crecimiento</span>
                  <span>Avalancha</span>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-6 text-center">
              <p className="text-sm text-[#A3A3A3] font-light leading-relaxed">
                No vendemos nada. Damos acceso a una infraestructura de soberanía.
                <br />
                <span className="text-[#E5E5E5] font-medium">Hay 30 cupos de Fundador activos.</span>
              </p>

              <Link
                href="/paquetes"
                className="block w-full py-4 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0F1115] font-bold text-lg rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:shadow-[0_0_30px_rgba(197,160,89,0.4)] flex items-center justify-center gap-2"
              >
                Aplicar como Fundador <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/reto-5-dias"
                className="inline-block text-xs text-[#64748B] hover:text-[#E5E5E5] transition-colors uppercase tracking-widest pb-1 border-b border-transparent hover:border-[#64748B]"
              >
                Tengo dudas &bull; Acceder al Simulador
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM NAVIGATION
      ═══════════════════════════════════════════════════════════════════ */}
      <nav className="fixed bottom-4 left-4 right-4 h-16 bg-[#1A1D23]/90 backdrop-blur-xl rounded-2xl flex justify-around items-center z-50 shadow-2xl border border-white/5">
        <button
          onClick={() => switchTab('villain')}
          className={`flex flex-col items-center gap-1 w-1/4 transition-all duration-300 ${
            activeTab === 'villain' ? 'text-[#C5A059]' : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className={`text-[10px] ${activeTab === 'villain' ? 'font-medium' : ''}`}>La Trampa</span>
        </button>

        <button
          onClick={() => switchTab('solution')}
          className={`flex flex-col items-center gap-1 w-1/4 transition-all duration-300 ${
            activeTab === 'solution' ? 'text-[#C5A059]' : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          <FlaskConical className="w-5 h-5" />
          <span className={`text-[10px] ${activeTab === 'solution' ? 'font-medium' : ''}`}>El Sistema</span>
        </button>

        <button
          onClick={() => switchTab('fit')}
          className={`flex flex-col items-center gap-1 w-1/4 transition-all duration-300 ${
            activeTab === 'fit' ? 'text-[#C5A059]' : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className={`text-[10px] ${activeTab === 'fit' ? 'font-medium' : ''}`}>Tu Rol</span>
        </button>

        <button
          onClick={() => switchTab('money')}
          className={`flex flex-col items-center gap-1 w-1/4 transition-all duration-300 ${
            activeTab === 'money' ? 'text-[#C5A059]' : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          <DollarSign className="w-5 h-5" />
          <span className={`text-[10px] ${activeTab === 'money' ? 'font-medium' : ''}`}>El Dinero</span>
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
