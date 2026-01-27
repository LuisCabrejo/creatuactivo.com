/**
 * SERVILLETA DIGITAL - THE LOCALIZED LEVERAGE EDITION v6.0
 * Copyright © 2026 CreaTuActivo.com
 *
 * AJUSTES ESTRATÉGICOS:
 * 1. VISUAL: Reemplazo de Emojis por Lucide Icons (Estética Vectorial).
 * 2. COPYWRITING: "Arquitectura de Apalancamiento" (Más potente que Activos).
 * 3. PSICOLOGÍA: Insight de $300 ajustado a "Servicios Públicos" (Efecto Abundancia).
 * 4. LOCALIZACIÓN: Conversión a COP (Pesos Colombianos) en tiempo real.
 * 5. NAVEGACIÓN: Etiquetas de menú explícitas.
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
  Check,
  ShieldCheck,
  Cpu,
  Anchor,
  Briefcase,     // Nuevo: Para Slide 1
  Banknote,      // Nuevo: Para Slide 1
  TrendingDown,  // Nuevo: Para Slide 1
  RefreshCw      // Nuevo: Para Slide 1
} from 'lucide-react';
import Link from 'next/link';

// --- CONFIGURACIÓN DE BRANDING ---
const THEME = {
  bg: 'bg-[#0F1115]',       // Carbon Deep
  cardBg: 'bg-[#15171C]',   // Elevated Surface
  gold: '#C5A059',          // Primary Brand
  goldLight: '#F5E8D8',     // Text Highlight
  coral: '#FF8A80',         // Pain/Dependency
  textMain: '#E5E5E5',
  textMuted: '#94A3B8',
};

type TabId = 'villain' | 'solution' | 'fit' | 'money';
type IncomeMode = 'gen5' | 'binario';

export default function ServilletaPage() {
  const [activeTab, setActiveTab] = useState<TabId>('villain');

  // Estados del Simulador
  const [incomeMode, setIncomeMode] = useState<IncomeMode>('gen5');
  const [gen5Socios, setGen5Socios] = useState(2);
  const [gen5Package, setGen5Package] = useState<'ESP1' | 'ESP2' | 'ESP3'>('ESP3');
  const [binarioParejas, setBinarioParejas] = useState(50);
  const [selectedMode, setSelectedMode] = useState<'relacional' | 'hibrido' | 'inversionista' | null>('hibrido');

  const switchTab = (tabId: TabId) => setActiveTab(tabId);

  // Lógica de Negocio & Moneda
  const TRM = 4400; // Tasa Representativa del Mercado estimada
  const gen5Bonuses: Record<string, number> = { ESP1: 25, ESP2: 75, ESP3: 150 };
  const gen5Income = gen5Socios * gen5Bonuses[gen5Package];
  const binarioIncomeUSD = Math.round(binarioParejas * 4.76);

  // Formateador de Pesos Colombianos
  const formatCOP = (usd: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(usd * TRM);
  };

  // Traductor de Estilo de Vida (AJUSTADO: Efecto Abundancia)
  const getLifestyleTranslation = (usd: number) => {
    if (usd < 100) return "Paga tu factura de celular e internet móvil.";
    // AJUSTE ESTRATÉGICO: $300 ahora cubre servicios (sobra dinero) en lugar de cuota vehículo (apretado)
    if (usd <= 300) return "Cubre todos los servicios públicos de tu hogar.";
    if (usd < 600) return "Paga la cuota de un vehículo gama media.";
    if (usd < 1000) return "Cubre un arriendo en zona exclusiva.";
    if (usd < 2000) return "Salario de profesional senior (Libertad Básica).";
    return "Estilo de vida de abundancia (Top 5% ingresos).";
  };

  const slideContainerClass = "w-full max-w-2xl mx-auto flex flex-col justify-center min-h-[550px] py-6 animate-fadeIn";

  return (
    <div className={`min-h-screen ${THEME.bg} text-[#E5E5E5] flex flex-col relative font-sans`}>

      {/* Grid Background */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#94A3B8 1px, transparent 1px), linear-gradient(90deg, #94A3B8 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      {/* --- HEADER --- */}
      <header className="relative z-10 px-6 pt-6 pb-4 flex justify-between items-center bg-[#0F1115]/90 backdrop-blur-md sticky top-0 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 border border-[#C5A059]/30 rounded bg-[#C5A059]/5 group-hover:bg-[#C5A059]/10 transition-colors">
            <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
              <path d="M20 8 H10 V24 H20" stroke="#C5A059" strokeWidth="2" strokeLinecap="square" />
              <path d="M16 16 H24" stroke="#C5A059" strokeWidth="2" />
            </svg>
          </div>
          <span className="text-sm flex flex-col leading-none">
            <span className="font-serif text-[#C5A059] tracking-tight font-bold text-lg">CreaTuActivo</span>
            <span className="font-sans text-[9px] text-[#94A3B8] tracking-[0.2em] uppercase">Soberanía</span>
          </span>
        </Link>
        <div className="px-3 py-1.5 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 text-[10px] text-[#C5A059] font-medium tracking-wide uppercase">
          Acceso Privado
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 relative z-10 overflow-y-auto pb-32 px-4 sm:px-6">

        {/* =================================================================================
            TAB 1: LA TRAMPA (Iconos Vectoriales)
        ================================================================================= */}
        {activeTab === 'villain' && (
          <div className={slideContainerClass}>

            <div className="flex items-center justify-between px-1 mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#FF8A80]" />
                <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest font-bold">Diagnóstico Estructural</span>
              </div>
              <span className="text-[10px] text-[#FF8A80] bg-[#FF8A80]/10 px-2 py-0.5 rounded border border-[#FF8A80]/20 font-bold">
                ALERTA ACTIVA
              </span>
            </div>

            <div className={`rounded-xl overflow-hidden border border-[#FF8A80]/20 bg-[#15171C] shadow-2xl relative`}>
              <div className="absolute top-0 inset-x-0 h-1 bg-[#FF8A80]" />

              <div className="p-6 pb-2">
                <h2 className="text-5xl font-bold text-white tracking-tighter mb-1" style={{ fontFamily: 'Georgia, serif', fontFeatureSettings: "'tnum'" }}>
                  100%
                </h2>
                <p className="text-[#F5E8D8] text-lg font-medium">Dependencia del Ingreso Activo</p>
                <p className="text-sm text-[#FF8A80] mt-3 italic border-l-2 border-[#FF8A80] pl-3">
                  &quot;Si tú paras, el dinero para.&quot;
                </p>
              </div>

              {/* GRÁFICO */}
              <div className="relative h-64 w-full bg-[#0F1115] p-4 overflow-hidden border-t border-white/5">
                <svg viewBox="0 0 300 130" className="w-full h-full">
                  <defs>
                    <linearGradient id="dependencyFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF8A80" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#FF8A80" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="freedomFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C5A059" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="120" x2="300" y2="120" stroke="#334155" strokeWidth="1" />
                  <text x="295" y="128" textAnchor="end" fill="#64748B" fontSize="8">TIEMPO →</text>
                  <text x="5" y="20" fill="#64748B" fontSize="8">$$$</text>

                  <path d="M0,85 L180,80 L180,110 L0,120 Z" fill="url(#dependencyFill)" />
                  <path d="M180,80 L300,30 L300,120 L180,110 Z" fill="url(#freedomFill)" />

                  <path d="M0,85 L300,75" fill="none" stroke="#FF8A80" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
                  <path d="M0,120 C50,120 120,118 180,80 C220,50 260,20 300,10" fill="none" stroke="#C5A059" strokeWidth="2.5" />

                  {/* Etiquetas Estratégicas */}
                  <circle cx="280" cy="20" r="2" fill="#C5A059" />
                  <text x="275" y="22" textAnchor="end" fill="#C5A059" fontSize="7" fontWeight="bold" letterSpacing="0.5">ACTIVO (EXPONENCIAL)</text>

                  <circle cx="280" cy="85" r="2" fill="#FF8A80" />
                  <text x="275" y="87" textAnchor="end" fill="#FF8A80" fontSize="7" fontWeight="bold" letterSpacing="0.5">EMPLEO (LINEAL)</text>

                  <text x="50" y="105" textAnchor="middle" fill="#FF8A80" fontSize="8" letterSpacing="1" opacity="0.8" fontWeight="bold">DEPENDENCIA</text>

                  <circle cx="180" cy="80" r="4" fill="#0F1115" stroke="#C5A059" strokeWidth="2" />
                  <g transform="translate(180, 65)">
                    <rect x="-30" y="-10" width="60" height="14" rx="2" fill="#C5A059" />
                    <text x="0" y="0" textAnchor="middle" fill="#0F1115" fontSize="8" fontWeight="bold" dominantBaseline="middle">LIBERTAD</text>
                  </g>
                </svg>
              </div>

              {/* CICLO DE LA RATA CON VECTOR ICONS (Lucide) */}
              <div className="bg-[#15171C] p-5 border-t border-white/5">
                <p className="text-center text-[9px] text-[#94A3B8] uppercase tracking-widest mb-3">El Plan por Defecto</p>
                <div className="flex justify-between items-center text-center px-4">
                  {/* Trabajar */}
                  <div className="flex flex-col items-center gap-1.5 group">
                    <div className="p-2 rounded-lg bg-[#1A1D23] border border-white/5 group-hover:border-[#94A3B8] transition-colors">
                      <Briefcase className="w-5 h-5 text-[#94A3B8]" strokeWidth={1.5} />
                    </div>
                    <span className="text-[8px] uppercase text-[#94A3B8] tracking-wider">Trabajar</span>
                  </div>

                  <ArrowRight className="w-3 h-3 text-[#334155]" />

                  {/* Pagar */}
                  <div className="flex flex-col items-center gap-1.5 group">
                    <div className="p-2 rounded-lg bg-[#1A1D23] border border-white/5 group-hover:border-[#94A3B8] transition-colors">
                      <Banknote className="w-5 h-5 text-[#94A3B8]" strokeWidth={1.5} />
                    </div>
                    <span className="text-[8px] uppercase text-[#94A3B8] tracking-wider">Pagar</span>
                  </div>

                  <ArrowRight className="w-3 h-3 text-[#334155]" />

                  {/* $0 (Pain Point) */}
                  <div className="flex flex-col items-center gap-1.5 relative">
                    <div className="absolute inset-0 bg-[#FF8A80]/20 blur-lg rounded-full" />
                    <div className="p-2 rounded-lg bg-[#1A1D23] border border-[#FF8A80]/30 relative z-10">
                      <TrendingDown className="w-5 h-5 text-[#FF8A80]" strokeWidth={2} />
                    </div>
                    <span className="text-[8px] font-bold text-[#FF8A80] uppercase tracking-wider relative z-10">$0</span>
                  </div>

                  <ArrowRight className="w-3 h-3 text-[#334155]" />

                  {/* Repetir */}
                  <div className="flex flex-col items-center gap-1.5 group">
                    <div className="p-2 rounded-lg bg-[#1A1D23] border border-white/5 group-hover:border-[#94A3B8] transition-colors">
                      <RefreshCw className="w-5 h-5 text-[#94A3B8]" strokeWidth={1.5} />
                    </div>
                    <span className="text-[8px] uppercase text-[#94A3B8] tracking-wider">Repetir</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 border-l-2 border-[#C5A059] py-2 ml-1 mt-6">
              <p className="text-lg text-[#E5E5E5] font-serif italic leading-relaxed">
                "No necesitas más esfuerzo.<br />
                <span className="text-[#C5A059] font-bold not-italic">Necesitas cambiar de vehículo."</span>
              </p>
            </div>
          </div>
        )}

        {/* =================================================================================
            TAB 2: EL SISTEMA (Título Ajustado: Apalancamiento)
        ================================================================================= */}
        {activeTab === 'solution' && (
          <div className={slideContainerClass}>

            <div className="text-center space-y-2 mb-8">
              {/* TÍTULO CAMBIADO: DE ACTIVOS A APALANCAMIENTO */}
              <span className="text-[10px] text-[#C5A059] uppercase tracking-[0.25em] font-bold">
                Arquitectura de Apalancamiento
              </span>
              <h1 className="text-4xl text-white leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                Eficiencia, <span className="text-[#C5A059] italic">no magia.</span>
              </h1>
            </div>

            <div className="relative w-full flex-1 min-h-[400px]">
              {/* LÍNEA DE SUPERFICIE */}
              <div className="absolute top-[120px] left-[-20px] right-[-20px] h-[1px] bg-gradient-to-r from-transparent via-[#94A3B8]/50 to-transparent z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0F1115] px-2 text-[9px] text-[#94A3B8] uppercase tracking-widest">
                  Superficie
                </div>
              </div>

              {/* LA PUNTA (TU ROL 10%) */}
              <div className="absolute top-0 left-0 right-0 flex justify-center z-20">
                <div className="relative">
                  <div className="bg-gradient-to-b from-[#1A1D23] to-[#0F1115] p-5 rounded-2xl border border-[#C5A059] shadow-[0_0_30px_-5px_rgba(197,160,89,0.25)] w-64 text-center relative z-20">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center text-[#0F1115] font-bold shadow-lg border border-white/20">
                      10%
                    </div>
                    <h3 className="text-white text-lg font-serif mt-3 mb-1">Tu Rol: Conector</h3>
                    <p className="text-xs text-[#F5E8D8] leading-tight">
                      Conectar personas.<br/>Cobrar el peaje.
                    </p>
                  </div>
                  <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-t-[60px] border-t-[#1A1D23]/80 blur-sm z-10"></div>
                </div>
              </div>

              {/* LA MASA (SISTEMA 90%) */}
              <div className="absolute top-[120px] inset-x-0 bottom-0 bg-gradient-to-b from-[#15171C]/90 to-[#0F1115] backdrop-blur-sm rounded-t-[3rem] border-t border-white/10 overflow-hidden pt-12 px-6 pb-6 shadow-2xl">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="absolute top-4 right-6 text-6xl font-bold text-[#1F2937] select-none pointer-events-none" style={{ fontFamily: 'Georgia, serif' }}>
                  90%
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Anchor className="text-[#94A3B8] w-5 h-5" />
                    <div>
                      <h3 className="text-white text-sm font-bold uppercase tracking-widest">El Sistema</h3>
                      <p className="text-[10px] text-[#64748B]">Lo que ocurre bajo la superficie</p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <div className="bg-[#0F1115] p-4 rounded-xl border border-white/5 flex items-center gap-4 group">
                      <div className="p-2 bg-[#94A3B8]/10 rounded text-[#94A3B8] group-hover:text-[#C5A059] transition-colors">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <h4 className="text-[#E5E5E5] text-sm font-bold">Respaldo Corporativo</h4>
                        <p className="text-[10px] text-[#94A3B8]">Capital ($100M) & Legalidad</p>
                      </div>
                    </div>
                    <div className="bg-[#0F1115] p-4 rounded-xl border border-white/5 flex items-center gap-4 group">
                      <div className="p-2 bg-[#94A3B8]/10 rounded text-[#94A3B8] group-hover:text-[#C5A059] transition-colors">
                        <Cpu size={20} />
                      </div>
                      <div>
                        <h4 className="text-[#E5E5E5] text-sm font-bold">Tecnología Queswa</h4>
                        <p className="text-[10px] text-[#94A3B8]">IA, Logística & Distribución</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-sm text-[#F5E8D8] font-serif italic leading-relaxed">
                      "Nosotros ponemos los barcos, las fábricas y la IA.<br />
                      <span className="text-white font-bold not-italic">Tú solo pones la conexión."</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================================
            TAB 3: TU ROL
        ================================================================================= */}
        {activeTab === 'fit' && (
          <div className={slideContainerClass}>
            <div className="text-center mb-6">
              <h1 className="text-3xl text-white font-serif mb-2">Define tu Estilo</h1>
              <p className="text-[#94A3B8] text-sm max-w-xs mx-auto">
                El sistema se adapta a ti. <span className="text-[#F5E8D8]">Elige tu vehículo.</span>
              </p>
            </div>
            <div className="space-y-4">
              {[
                { id: 'relacional', title: 'Modo Relacional', icon: Users, desc: 'Contacto humano, café y confianza. La app es tu asistente administrativo.', tag: 'Clásico' },
                { id: 'hibrido', title: 'Modo Híbrido', icon: Smartphone, desc: 'Redes para atraer, IA para filtrar. Solo hablas con los que levantan la mano.', tag: 'Recomendado', highlight: true },
                { id: 'inversionista', title: 'Modo Inversionista', icon: BarChart3, desc: 'Tráfico pago y sistemas delegados. Tu rol es 100% estratégico.', tag: 'Avanzado' }
              ].map((mode) => (
                <div key={mode.id} onClick={() => setSelectedMode(mode.id as any)} className={`relative p-5 rounded-xl border transition-all duration-300 cursor-pointer ${selectedMode === mode.id ? 'bg-[#15171C] border-[#C5A059] shadow-[0_0_20px_-10px_rgba(197,160,89,0.3)] scale-[1.02]' : 'bg-[#0F1115] border-white/5 opacity-70 hover:opacity-100 hover:border-white/10'}`}>
                  {mode.highlight && <div className="absolute top-0 right-0 bg-[#C5A059] text-[#0F1115] text-[9px] font-bold px-2 py-0.5 rounded-bl rounded-tr-lg uppercase">{mode.tag}</div>}
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full flex-shrink-0 ${selectedMode === mode.id ? 'bg-[#C5A059] text-[#0F1115]' : 'bg-[#1A1D23] text-[#94A3B8]'}`}><mode.icon size={20} /></div>
                    <div>
                      <h3 className={`font-bold mb-1 ${selectedMode === mode.id ? 'text-white' : 'text-[#94A3B8]'}`} style={{ fontFamily: 'Georgia, serif' }}>{mode.title}</h3>
                      <p className={`text-sm leading-snug ${selectedMode === mode.id ? 'text-[#F5E8D8]' : 'text-[#64748B]'}`}>{mode.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================================
            TAB 4: EL DINERO (Con Conversión a COP)
        ================================================================================= */}
        {activeTab === 'money' && (
          <div className={slideContainerClass}>
            <div className="text-center">
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest">Simulador de Soberanía</span>
              <h1 className="text-2xl text-white font-serif mt-1">Proyecta tu Libertad</h1>
            </div>
            <div className="bg-[#15171C] rounded-xl border border-white/10 overflow-hidden shadow-2xl mt-6">
              <div className="grid grid-cols-2 border-b border-white/5 bg-[#0F1115]">
                <button onClick={() => setIncomeMode('gen5')} className={`py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${incomeMode === 'gen5' ? 'text-[#C5A059] bg-[#C5A059]/5' : 'text-[#64748B]'}`}>Capital Rápido</button>
                <button onClick={() => setIncomeMode('binario')} className={`py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${incomeMode === 'binario' ? 'text-[#C5A059] bg-[#C5A059]/5' : 'text-[#64748B]'}`}>Renta Vitalicia</button>
              </div>
              <div className="p-6 space-y-8">
                <div className="text-center">
                  <p className="text-[10px] text-[#94A3B8] uppercase mb-1">Ingreso Estimado</p>

                  {/* DISPLAY USD */}
                  <div className="flex justify-center items-baseline gap-2 text-white">
                    <span className="text-6xl font-bold tracking-tighter" style={{ fontFamily: 'Georgia, serif', fontFeatureSettings: '"tnum"' }}>
                      ${incomeMode === 'gen5' ? gen5Income.toLocaleString() : binarioIncomeUSD.toLocaleString()}
                    </span>
                    <span className="text-lg text-[#C5A059] font-medium">USD</span>
                  </div>

                  {/* DISPLAY COP (Comunidad Secundaria) */}
                  <div className="mt-1">
                    <span className="text-sm text-[#64748B] font-mono">
                      ( aprox. {formatCOP(incomeMode === 'gen5' ? gen5Income : binarioIncomeUSD)} COP )
                    </span>
                  </div>

                  <div className="mt-4 bg-[#C5A059]/5 border border-[#C5A059]/10 rounded-lg p-3 animate-pulse">
                    <p className="text-xs text-[#F5E8D8] font-medium leading-tight">💡 {getLifestyleTranslation(incomeMode === 'gen5' ? gen5Income : binarioIncomeUSD)}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  {incomeMode === 'gen5' ? (
                    <>
                      <div className="flex justify-center gap-2">
                        {['ESP1', 'ESP2', 'ESP3'].map((pkg) => (
                          <button key={pkg} onClick={() => setGen5Package(pkg as any)} className={`px-3 py-2 rounded text-[10px] uppercase font-bold transition-all border ${gen5Package === pkg ? 'bg-[#C5A059] text-[#0F1115] border-[#C5A059]' : 'bg-transparent text-[#64748B] border-white/10'}`}>{pkg === 'ESP1' ? 'Inicial' : pkg === 'ESP2' ? 'Pro' : 'Visionario'}</button>
                        ))}
                      </div>
                      <input type="range" min="1" max="10" value={gen5Socios} onChange={(e) => setGen5Socios(parseInt(e.target.value))} className="w-full h-1 bg-[#2A2E37] rounded-lg appearance-none cursor-pointer accent-[#C5A059]" />
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-xs text-[#94A3B8] mb-2 font-medium"><span>Personas en Red:</span><span className="text-white font-mono">{binarioParejas}</span></div>
                      <input type="range" min="10" max="500" step="10" value={binarioParejas} onChange={(e) => setBinarioParejas(parseInt(e.target.value))} className="w-full h-1 bg-[#2A2E37] rounded-lg appearance-none cursor-pointer accent-[#C5A059]" />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8 text-center px-4">
              <Link href="/aplicar" className="block w-full py-4 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0F1115] font-bold uppercase tracking-wider text-sm rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all">Iniciar Plan de Libertad <ArrowRight size={18} /></Link>
              <p className="text-[10px] text-[#64748B] mt-3 flex justify-center items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"/> Solo 30 cupos de Fundador activos</p>
            </div>
          </div>
        )}

      </main>

      {/* --- BOTTOM NAVIGATION (Con Etiquetas) --- */}
      <nav className="fixed bottom-6 left-6 right-6 h-16 bg-[#15171C]/90 backdrop-blur-xl rounded-2xl flex justify-around items-center z-50 shadow-2xl border border-white/10 max-w-xl mx-auto">
        {[
          { id: 'villain', icon: Clock, label: 'La Trampa' },
          { id: 'solution', icon: FlaskConical, label: 'El Sistema' },
          { id: 'fit', icon: User, label: 'Tu Rol' },
          { id: 'money', icon: DollarSign, label: 'El Dinero' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id as TabId)}
            className={`flex flex-col items-center justify-center w-1/4 h-full transition-all duration-300 gap-1 ${
              activeTab === tab.id ? 'text-[#C5A059]' : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
          >
            <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className={`text-[9px] uppercase tracking-wide ${activeTab === tab.id ? 'font-bold' : 'font-medium'}`}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <span className="absolute bottom-2 w-1 h-1 bg-[#C5A059] rounded-full"></span>
            )}
          </button>
        ))}
      </nav>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}
