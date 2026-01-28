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
  Check,
  ShieldCheck,
  Cpu,
  Anchor,
  Briefcase,
  CreditCard,
  CircleOff,
  Repeat
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
  // Tasa corporativa fija de Gano Excel (COMP_MONEDA_01)
  const TRM = 4500;
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

  // Traductor de Estilo de Vida (Efecto Abundancia)
  const getLifestyleTranslation = (usd: number) => {
    if (usd < 100) return "Paga tu factura de celular e internet móvil.";
    if (usd <= 300) return "Cubre todos los servicios públicos de tu hogar.";
    if (usd < 600) return "Paga la cuota de un vehículo gama media.";
    if (usd < 1000) return "Cubre un arriendo en zona exclusiva.";
    if (usd < 2000) return "Salario de profesional senior (Libertad Básica).";
    return "Estilo de vida de abundancia (Top 5% ingresos).";
  };

  const slideContainerClass = "w-full max-w-2xl md:max-w-4xl mx-auto flex flex-col justify-center min-h-[550px] md:min-h-[85vh] py-3 md:py-8 animate-fadeIn";

  return (
    <div className={`min-h-screen ${THEME.bg} text-[#E5E5E5] flex flex-col relative font-sans`}>

      {/* Grid Background */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#94A3B8 1px, transparent 1px), linear-gradient(90deg, #94A3B8 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      {/* --- HEADER --- */}
      <header className="relative z-10 px-5 pt-3 pb-2 md:px-10 md:pt-5 md:pb-4 flex justify-between items-center bg-[#0F1115]/90 backdrop-blur-md sticky top-0 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 border border-[#C5A059]/30 rounded bg-[#C5A059]/5 group-hover:bg-[#C5A059]/10 transition-colors">
            <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
              <g stroke="#C5A059" strokeWidth="2" strokeLinecap="square">
                <path d="M14 5 H5 V27 H20"/>
                <path d="M16 27 V10 H27 V27"/>
                <path d="M16 18 H27"/>
              </g>
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
      <main className="flex-1 relative z-10 overflow-y-auto pb-16 md:pb-20 px-1 sm:px-6">

        {/* =================================================================================
            TAB 1: LA TRAMPA (Iconos Vectoriales)
        ================================================================================= */}
        {activeTab === 'villain' && (
          <div className={slideContainerClass}>

            <div className="flex items-center justify-between px-1 mb-3 mt-6 md:mt-0">
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

              <div className="px-5 pt-4 pb-10 md:px-8 md:pt-8 md:pb-12">
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-1 md:mb-2" style={{ fontFamily: 'Georgia, serif', fontFeatureSettings: "'tnum'" }}>
                  100%
                </h2>
                <p className="text-[#F5E8D8] text-base md:text-xl font-medium mb-2 md:mb-4">Dependencia del Empleo/Auto-empleo</p>
                <p className="text-xs md:text-sm text-[#FF8A80] italic border-l-2 border-[#FF8A80] pl-3">
                  &quot;Si tú paras, el dinero para.&quot;
                </p>
              </div>

              {/* GRÁFICO - compacto mobile, amplio desktop */}
              <div className="relative h-48 md:h-80 w-full bg-[#0F1115] overflow-hidden border-t border-white/5">
                <svg viewBox="0 0 320 140" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
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

                  {/* Y-axis label */}
                  <text x="18" y="16" fill="#64748B" fontSize="8" fontWeight="bold">$$$</text>
                  {/* Y-axis line */}
                  <line x1="14" y1="20" x2="14" y2="112" stroke="#334155" strokeWidth="0.5" />

                  {/* X-axis */}
                  <line x1="14" y1="112" x2="306" y2="112" stroke="#334155" strokeWidth="1" />
                  <text x="300" y="128" textAnchor="end" fill="#64748B" fontSize="8">TIEMPO →</text>

                  {/* Area fills */}
                  <path d="M14,82 L190,78 L190,108 L14,112 Z" fill="url(#dependencyFill)" />
                  <path d="M190,78 L306,26 L306,112 L190,108 Z" fill="url(#freedomFill)" />

                  {/* Lines */}
                  <path d="M14,82 L306,73" fill="none" stroke="#FF8A80" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
                  <path d="M14,112 C60,112 130,110 190,78 C230,50 270,22 306,10" fill="none" stroke="#C5A059" strokeWidth="2.5" />

                  {/* ACTIVO label - ABOVE the gold curve */}
                  <circle cx="306" cy="10" r="2" fill="#C5A059" />
                  <text x="300" y="7" textAnchor="end" fill="#C5A059" fontSize="7" fontWeight="bold" letterSpacing="0.5">ACTIVO (EXPONENCIAL)</text>

                  {/* EMPLEO label - ABOVE the employment line */}
                  <circle cx="306" cy="73" r="2" fill="#FF8A80" />
                  <text x="300" y="67" textAnchor="end" fill="#FF8A80" fontSize="7" fontWeight="bold" letterSpacing="0.5">EMPLEO (LINEAL)</text>

                  <text x="60" y="100" textAnchor="middle" fill="#FF8A80" fontSize="8" letterSpacing="1" opacity="0.8" fontWeight="bold">DEPENDENCIA</text>

                  {/* Crossover point */}
                  <circle cx="190" cy="78" r="4" fill="#0F1115" stroke="#C5A059" strokeWidth="2" />
                  <g transform="translate(190, 63)">
                    <rect x="-30" y="-10" width="60" height="14" rx="2" fill="#C5A059" />
                    <text x="0" y="0" textAnchor="middle" fill="#0F1115" fontSize="8" fontWeight="bold" dominantBaseline="middle">LIBERTAD</text>
                  </g>
                </svg>
              </div>

              {/* CICLO - Estilo flujo horizontal (diferenciado del nav) */}
              <div className="bg-[#0F1115] px-4 py-4 md:py-6 border-t border-white/5">
                <p className="text-center text-[11px] md:text-xs text-[#94A3B8] uppercase tracking-widest mb-2 md:mb-3">El Plan por Defecto</p>
                <div className="flex items-center justify-center gap-1.5 md:gap-3 flex-wrap">
                  {[
                    { label: 'Trabajar', pain: false, icon: Briefcase },
                    { label: 'Pagar', pain: false, icon: CreditCard },
                    { label: 'Quedar en ceros', pain: true, icon: CircleOff },
                    { label: 'Repetir', pain: false, icon: Repeat },
                  ].map((step, i) => (
                    <React.Fragment key={step.label}>
                      {i > 0 && <span className="text-[#334155] text-[10px] md:text-sm">→</span>}
                      <span className={`text-[10px] md:text-sm px-2.5 md:px-4 py-1 md:py-1.5 rounded-full border flex items-center gap-1 ${step.pain ? 'bg-[#FF8A80]/10 border-[#FF8A80]/30 text-[#FF8A80] font-bold' : 'bg-white/[0.03] border-white/10 text-[#94A3B8]'}`}>
                        <step.icon size={12} className="flex-shrink-0" />
                        {step.label}
                      </span>
                    </React.Fragment>
                  ))}
                  <span className="text-[#334155] text-[10px] md:text-sm">↻</span>
                </div>
              </div>
            </div>

            {/* Cita motivacional */}
            <div className="px-4 border-l-2 border-[#C5A059] py-2 ml-1 mt-4 md:mt-6">
              <p className="text-sm md:text-lg text-[#E5E5E5] font-serif italic leading-relaxed">
                &quot;No necesitas más esfuerzo.<br />
                <span className="text-[#C5A059] font-bold not-italic">Necesitas cambiar de vehículo.&quot;</span>
              </p>
            </div>
          </div>
        )}

        {/* =================================================================================
            TAB 2: EL SISTEMA (Arquitectura de Apalancamiento)
        ================================================================================= */}
        {activeTab === 'solution' && (
          <div className={slideContainerClass}>

            <div className="text-center space-y-2 mb-12 mt-6 md:mt-0">
              <span className="text-[10px] md:text-xs text-[#C5A059] uppercase tracking-[0.25em] font-bold">
                Arquitectura de Apalancamiento
              </span>
              <h1 className="text-4xl md:text-5xl text-white leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                Eficiencia, <span className="text-[#C5A059] italic">no magia.</span>
              </h1>
            </div>

            {/* ICEBERG - Una sola figura visual continua */}
            <div className="relative w-full flex-1 flex flex-col items-center">

              {/* PUNTA DEL ICEBERG (10%) - parte visible */}
              <div className="relative z-20 w-72 md:w-96 text-center bg-gradient-to-b from-[#1A1D23] to-[#1A1D23]/90 pt-6 pb-5 px-5 md:pt-8 md:pb-6 md:px-8 rounded-t-2xl border border-[#C5A059]/40 border-b-0 shadow-[0_0_30px_-5px_rgba(197,160,89,0.2)]">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center text-[#0F1115] font-bold text-sm shadow-lg border border-white/20">
                  10%
                </div>
                <h3 className="text-white text-lg md:text-xl font-serif mt-2 mb-1">Tu Rol: Conector</h3>
                <p className="text-xs md:text-sm text-[#F5E8D8] leading-tight">
                  Conectas personas. Cobras el peaje.
                </p>
                <p className="text-[9px] md:text-[10px] text-[#94A3B8] uppercase tracking-widest mt-2">Sin inventario • Sin logística</p>
              </div>

              {/* LÍNEA DE SUPERFICIE - conecta la punta con la masa */}
              <div className="relative w-full h-[2px] bg-gradient-to-r from-transparent via-[#94A3B8]/50 to-transparent z-30">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#15171C] px-3 py-0.5 border border-[#94A3B8]/30 rounded-full">
                  <span className="text-[10px] text-[#94A3B8] uppercase tracking-[0.2em] font-bold">Superficie</span>
                </div>
              </div>

              {/* MASA DEL ICEBERG (90%) - sin borde inferior, se expande hacia abajo */}
              <div className="relative w-full bg-gradient-to-b from-[#15171C] to-transparent pt-6 px-4 md:pt-8 md:px-8 pb-0 overflow-visible">
                {/* Dot pattern que se extiende "infinitamente" */}
                <div className="absolute inset-0 bottom-[-200px] opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                {/* 90% watermark */}
                <div className="text-7xl font-bold text-[#1F2937]/80 select-none pointer-events-none text-right -mt-1 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                  90%
                </div>

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3 mb-3">
                    <Anchor className="text-[#94A3B8] w-5 h-5 flex-shrink-0" />
                    <div>
                      <h3 className="text-white text-sm font-bold uppercase tracking-widest">La Solución</h3>
                      <p className="text-xs text-[#94A3B8]">Lo que ocurre bajo la superficie</p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <div className="bg-[#0F1115]/80 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                      <div className="p-2 bg-[#94A3B8]/10 rounded-lg text-[#94A3B8] flex-shrink-0">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <h4 className="text-[#E5E5E5] text-sm md:text-base font-bold">Respaldo Legal & Físico</h4>
                        <p className="text-xs md:text-sm text-[#94A3B8]">Socio Industrial con capital &gt; $100M</p>
                      </div>
                    </div>
                    <div className="bg-[#0F1115]/80 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                      <div className="p-2 bg-[#94A3B8]/10 rounded-lg text-[#94A3B8] flex-shrink-0">
                        <Cpu size={20} />
                      </div>
                      <div>
                        <h4 className="text-[#E5E5E5] text-sm md:text-base font-bold">Tecnología Queswa</h4>
                        <p className="text-xs md:text-sm text-[#94A3B8]">IA, Logística & Distribución</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 border-l-2 border-[#C5A059] py-2 ml-1 mt-4 md:mt-6">
              <p className="text-sm md:text-lg text-[#E5E5E5] font-serif italic leading-relaxed">
                &ldquo;Nosotros ponemos los barcos, las fábricas y la IA. Tú solo pones la conexión.&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* =================================================================================
            TAB 3: TU ROL
        ================================================================================= */}
        {activeTab === 'fit' && (
          <div className={slideContainerClass}>
            <div className="text-center mb-6 md:mb-10 mt-6 md:mt-0">
              <h1 className="text-3xl md:text-5xl text-white font-serif mb-2">Define tu Estilo</h1>
              <p className="text-[#94A3B8] text-sm md:text-base max-w-xs md:max-w-md mx-auto">
                El sistema se adapta a ti. <span className="text-[#F5E8D8]">Elige tu vehículo.</span>
              </p>
            </div>
            <div className="space-y-4 md:space-y-6">
              {[
                { id: 'relacional', title: 'Modo Relacional', icon: Users, desc: 'Contacto humano, café y confianza. La app es tu asistente administrativo.', tag: 'Clásico' },
                { id: 'hibrido', title: 'Modo Híbrido', icon: Smartphone, desc: 'Redes para atraer, IA para filtrar. Solo hablas con los que levantan la mano.', tag: 'Recomendado', highlight: true },
                { id: 'inversionista', title: 'Modo Inversionista', icon: BarChart3, desc: 'Tráfico pago y sistemas delegados. Tu rol es 100% estratégico.', tag: 'Avanzado' }
              ].map((mode) => (
                <div key={mode.id} onClick={() => setSelectedMode(mode.id as any)} className={`relative p-5 md:p-6 rounded-xl border transition-all duration-300 cursor-pointer ${selectedMode === mode.id ? 'bg-[#15171C] border-[#C5A059] shadow-[0_0_20px_-10px_rgba(197,160,89,0.3)] scale-[1.02]' : 'bg-[#0F1115] border-white/5 opacity-70 hover:opacity-100 hover:border-white/10'}`}>
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
            <div className="text-center mt-6 md:mt-0">
              <span className="text-[10px] md:text-xs text-[#94A3B8] uppercase tracking-widest">Simulador de Soberanía</span>
              <h1 className="text-2xl md:text-4xl text-white font-serif mt-1 md:mt-2">Proyecta tu Libertad</h1>
            </div>
            <div className="bg-[#15171C] rounded-xl border border-white/10 overflow-hidden shadow-2xl mt-6 md:mt-8">
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

                  {/* DISPLAY COP */}
                  <div className="mt-1">
                    <span className="text-sm text-[#64748B] font-mono">
                      ( aprox. {formatCOP(incomeMode === 'gen5' ? gen5Income : binarioIncomeUSD)} COP )
                    </span>
                  </div>

                  <div className="mt-4 bg-[#C5A059]/5 border border-[#C5A059]/10 rounded-lg p-3">
                    <p className="text-xs text-[#F5E8D8] font-medium leading-tight">
                      <Zap className="w-3 h-3 inline-block mr-1 text-[#C5A059]" />
                      {getLifestyleTranslation(incomeMode === 'gen5' ? gen5Income : binarioIncomeUSD)}
                    </p>
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
                      <input type="range" min="1" max="10" value={gen5Socios} onChange={(e) => setGen5Socios(parseInt(e.target.value))} className="w-full h-1 bg-[#2A2E37] rounded-lg appearance-none cursor-pointer" />
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-xs text-[#94A3B8] mb-2 font-medium"><span>Personas en Red:</span><span className="text-white font-mono">{binarioParejas}</span></div>
                      <input type="range" min="10" max="500" step="10" value={binarioParejas} onChange={(e) => setBinarioParejas(parseInt(e.target.value))} className="w-full h-1 bg-[#2A2E37] rounded-lg appearance-none cursor-pointer" />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8 text-center px-4">
              <Link href="/paquetes" className="block w-full py-4 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0F1115] font-bold uppercase tracking-wider text-sm rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all">Iniciar Plan de Soberanía <ArrowRight size={18} /></Link>
              <Link href="/reto-5-dias" className="block w-full py-3 mt-3 border border-white/10 hover:border-[#C5A059]/30 text-[#94A3B8] hover:text-[#E5E5E5] font-medium text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all">Quiero saber más primero</Link>
            </div>
          </div>
        )}

      </main>

      {/* --- BOTTOM NAVIGATION --- */}
      <nav className="fixed bottom-0 left-0 right-0 h-12 md:h-14 md:bottom-2 md:left-4 md:right-4 bg-[#15171C]/95 backdrop-blur-xl md:rounded-2xl flex justify-around items-center z-50 shadow-2xl border-t md:border border-white/10 md:max-w-xl md:mx-auto">
        {[
          { id: 'villain', icon: Clock, label: 'La Trampa' },
          { id: 'solution', icon: FlaskConical, label: 'La Solución' },
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #FFFFFF; cursor: pointer; border: 2px solid #C5A059; }
        input[type="range"]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #FFFFFF; cursor: pointer; border: 2px solid #C5A059; }
      `}</style>
    </div>
  );
}
