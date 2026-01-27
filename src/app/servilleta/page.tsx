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
            TAB 1: LA TRAMPA (Villain)
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'villain' && (
          <div className="min-h-[calc(100vh-220px)] flex flex-col justify-center animate-fadeIn">
            <div className="text-center mb-8">
              <span className="text-xs text-[#C5A059] tracking-widest uppercase mb-2 block font-medium">
                Diagnóstico Estructural
              </span>
              <h1 className="text-3xl leading-tight text-white" style={{ fontFamily: 'Georgia, serif' }}>
                El puente que alquilas <br />
                <span className="italic text-[#64748B]">tiene fecha de caducidad.</span>
              </h1>
            </div>

            {/* SVG Bridge Animation */}
            <div className="relative w-full h-48 bg-[#1A1D23]/60 backdrop-blur-sm rounded-2xl mb-8 p-4 flex items-center justify-center overflow-hidden border border-white/5">
              <svg viewBox="0 0 300 150" className="w-full h-full">
                {/* Línea punteada - Empleo lineal */}
                <path
                  d="M20,120 Q80,110 140,120 T280,120"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
                <text
                  x="150"
                  y="140"
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="8"
                  fontFamily="Inter, sans-serif"
                >
                  TU EMPLEO (LINEAL)
                </text>

                {/* Puente dorado - Activo exponencial */}
                <path
                  className="animate-drawBridge"
                  d="M20,120 C80,40 220,40 280,120"
                  fill="none"
                  stroke="#C5A059"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="150" cy="80" r="3" fill="#C5A059" className="animate-pulse" />
                <text
                  x="150"
                  y="60"
                  textAnchor="middle"
                  fill="#C5A059"
                  fontSize="10"
                  fontFamily="Inter, sans-serif"
                  fontWeight="bold"
                >
                  TU ACTIVO (EXPONENCIAL)
                </text>
              </svg>
            </div>

            <div className="space-y-6">
              <p className="text-[#A3A3A3] font-light leading-relaxed text-sm">
                Estás cruzando un abismo financiero sobre una estructura que no te pertenece. Si
                dejas de caminar (trabajar), la estructura colapsa.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-1 h-12 bg-red-500/50 rounded-full" />
                <div>
                  <h3 className="text-white font-semibold" style={{ fontFamily: 'Georgia, serif' }}>El Plan por Defecto</h3>
                  <p className="text-xs text-[#64748B]">Trabajar → Pagar Cuentas → Repetir.</p>
                </div>
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

        /* Bridge Draw Animation */
        @keyframes drawBridge {
          from { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
          to { stroke-dasharray: 1000; stroke-dashoffset: 0; }
        }
        .animate-drawBridge {
          animation: drawBridge 2.5s ease-out forwards;
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
