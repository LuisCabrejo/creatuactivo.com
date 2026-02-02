/**
 * SERVILLETA DIGITAL - STEVE JOBS EDITION v10.0
 * Copyright © 2026 CreaTuActivo.com
 *
 * CAMBIOS ESTRATÉGICOS v10.0:
 * 1. ENFOQUE: No atacar al empleo, atacar al "Plan por Defecto" (El Villano).
 * 2. PERSONA: "Él" (El Plan) actúa sobre "Ti" (El Usuario).
 * 3. DISONANCIA: Aplicación de la fórmula "Si dependes de X... / Si usas Y...".
 * 4. UX: Estilo Keynote (Comparativa limpia).
 */

'use client';

import React, { useState } from 'react';
import {
  Activity,       // Diagnóstico
  Clock,          // Tiempo
  Flame,          // Esfuerzo
  ShieldAlert,    // Seguridad
  Factory,        // El Músculo
  Map,            // La Tubería
  BrainCircuit,   // El Cerebro
  Key,            // El Código
  Users,          // Operador
  Smartphone,     // Híbrido
  BarChart3,      // Arquitecto
  ArrowRight,
  Zap,
  Check,
  Anchor,
  Cpu,
  RefreshCw,
  Briefcase,
  CreditCard,
  Repeat
} from 'lucide-react';
import Link from 'next/link';

// --- CONFIGURACIÓN DE BRANDING INDUSTRIAL ---
const THEME = {
  bg: 'bg-[#0F1115]',       // Carbon Deep
  cardBg: 'bg-[#15171C]',   // Elevated Surface
  gold: '#C5A059',          // Primary Brand
  warning: '#F59E0B',       // Amber (Update Required)
  textMain: '#E5E5E5',
  textMuted: '#94A3B8',
};

type TabId = 'diagnosis' | 'architecture' | 'operation' | 'projection';
type IncomeMode = 'gen5' | 'binario';

export default function ServilletaPage() {
  const [activeTab, setActiveTab] = useState<TabId>('diagnosis');

  // Estados del Simulador
  const [incomeMode, setIncomeMode] = useState<IncomeMode>('gen5');
  const [gen5Socios, setGen5Socios] = useState(2);
  const [gen5Package, setGen5Package] = useState<'ESP1' | 'ESP2' | 'ESP3'>('ESP3');
  const [binarioParejas, setBinarioParejas] = useState(50);
  const [selectedRole, setSelectedRole] = useState<'campo' | 'hibrido' | 'arquitecto'>('hibrido');

  const switchTab = (tabId: TabId) => setActiveTab(tabId);

  // Lógica de Negocio & Moneda (TRM Fija Corporativa)
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

  // Traductor de Estilo de Vida
  const getLifestyleTranslation = (usd: number) => {
    if (usd < 100) return "Cubre factura de celular e internet móvil.";
    if (usd <= 300) return "Cubre todos los servicios públicos del hogar.";
    if (usd < 600) return "Paga la cuota de un vehículo gama media.";
    if (usd < 1000) return "Cubre un arriendo en zona exclusiva.";
    if (usd < 2000) return "Libertad de la presión financiera mensual.";
    return "Estilo de vida de abundancia (Top 5% ingresos).";
  };

  const slideContainerClass = "w-full max-w-2xl md:max-w-4xl mx-auto flex flex-col justify-start md:justify-center min-h-[600px] md:min-h-[85vh] py-4 md:py-8 animate-fadeIn";

  return (
    <div className={`min-h-screen ${THEME.bg} text-[#E5E5E5] flex flex-col relative font-sans selection:bg-[#C5A059] selection:text-black`}>

      {/* Grid Background */}
      <div className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#94A3B8 1px, transparent 1px), linear-gradient(90deg, #94A3B8 1px, transparent 1px)', backgroundSize: '30px 30px' }}
      />

      {/* --- HEADER --- */}
      <header className="relative z-10 px-5 pt-3 pb-2 md:px-10 md:pt-5 md:pb-4 flex justify-between items-center bg-[#0F1115]/90 backdrop-blur-md sticky top-0 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 border border-[#C5A059]/30 rounded bg-[#C5A059]/5 group-hover:bg-[#C5A059]/10 transition-colors">
            <Activity className="w-5 h-5 text-[#C5A059]" />
          </div>
          <span className="text-sm flex flex-col leading-none">
            <span className="font-serif text-[#C5A059] tracking-tight font-bold text-lg">CreaTuActivo</span>
            <span className="font-mono text-[9px] text-[#94A3B8] tracking-[0.2em] uppercase">SISTEMA</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] text-[#94A3B8] font-mono tracking-widest uppercase hidden md:inline-block">V10.0 JOBS</span>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 relative z-10 overflow-y-auto pb-20 md:pb-24 px-2 sm:px-6 scrollbar-hide">

        {/* =================================================================================
            TAB 1: EL DIAGNÓSTICO (El Plan por Defecto + Oscilaciones)
        ================================================================================= */}
        {activeTab === 'diagnosis' && (
          <div className={slideContainerClass}>

            {/* Header Alerta */}
            <div className="flex items-center justify-between px-1 mb-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest font-bold">Auditoría de Sistema</span>
              </div>
              <span className="text-[9px] text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20 font-bold tracking-wider animate-pulse">
                REQUIERE ACTUALIZACIÓN
              </span>
            </div>

            {/* MAIN CARD */}
            <div className="bg-[#15171C] border border-[#F59E0B]/20 rounded-xl overflow-hidden shadow-2xl relative mb-6">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#F59E0B] via-[#15171C] to-[#C5A059]" />

                <div className="p-4 md:p-8">

                    {/* ENCABEZADO: EL VILLANO (El Plan por Defecto) */}
                    <div className="text-center mb-8 pb-6 border-b border-white/5">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                            El Plan por Defecto
                        </h2>

                        {/* El Ciclo Maldito Visualizado */}
                        <div className="flex items-center justify-center gap-3 md:gap-4 text-[#94A3B8] text-[10px] md:text-xs font-mono uppercase tracking-widest mb-4">
                            <div className="flex items-center gap-1.5 bg-[#0F1115] px-3 py-1.5 rounded-full border border-white/5">
                                <Briefcase size={12} /> TRABAJAR
                            </div>
                            <ArrowRight size={12} className="text-[#F59E0B]" />
                            <div className="flex items-center gap-1.5 bg-[#0F1115] px-3 py-1.5 rounded-full border border-white/5">
                                <CreditCard size={12} /> PAGAR CUENTAS
                            </div>
                            <ArrowRight size={12} className="text-[#F59E0B]" />
                            <div className="flex items-center gap-1.5 bg-[#0F1115] px-3 py-1.5 rounded-full border border-white/5 text-[#F59E0B]">
                                <Repeat size={12} /> REPETIR
                            </div>
                        </div>

                        {/* El Subtítulo de Transición */}
                        <p className="text-[#E5E5E5] text-xs md:text-sm font-bold italic mt-2">
                            &quot;Lo que es vs. Lo que podrías ser&quot;
                        </p>
                    </div>

                    {/* MATRIZ DE 3 FILAS (OSCILACIONES) */}
                    <div className="space-y-4 md:space-y-6">

                        {/* --- FILA 1: EL TIEMPO --- */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 md:gap-6 items-center">
                            {/* Villano (El Plan) */}
                            <div className="bg-[#0F1115] border border-[#F59E0B]/20 p-4 rounded-xl text-left md:text-right relative overflow-hidden group">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F59E0B] md:hidden"></div>
                                <h3 className="text-[#F59E0B] text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1">CONSUME TU VIDA</h3>
                                <p className="text-xs md:text-sm text-[#94A3B8] leading-snug">
                                    &quot;Roba tu tiempo vital. Mientras tu ingreso requiera tu presencia, la libertad es imposible.&quot;
                                </p>
                            </div>

                            {/* Eje (Icono) */}
                            <div className="hidden md:flex justify-center text-[#475569]">
                                <Clock size={20} strokeWidth={1.5} />
                            </div>

                            {/* Héroe (El Sistema) */}
                            <div className="bg-[#0F1115] border border-[#C5A059]/30 p-4 rounded-xl text-left relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C5A059] md:hidden"></div>
                                <h3 className="text-[#C5A059] text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1">GANA TIEMPO</h3>
                                <p className="text-xs md:text-sm text-[#E5E5E5] leading-snug">
                                    &quot;Flujo Perpetuo. El sistema sigue generando valor mientras duermes o viajas.&quot;
                                </p>
                            </div>
                        </div>

                        {/* --- FILA 2: EL ESFUERZO --- */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 md:gap-6 items-center">
                            {/* Villano */}
                            <div className="bg-[#0F1115] border border-[#F59E0B]/20 p-4 rounded-xl text-left md:text-right relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F59E0B] md:hidden"></div>
                                <h3 className="text-[#F59E0B] text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1">SE ALIMENTA DE ESFUERZO</h3>
                                <p className="text-xs md:text-sm text-[#94A3B8] leading-snug">
                                    &quot;Si tu ingreso depende solo de tus manos, tienes un límite físico innegable.&quot;
                                </p>
                            </div>

                            {/* Eje */}
                            <div className="hidden md:flex justify-center text-[#475569]">
                                <Flame size={20} strokeWidth={1.5} />
                            </div>

                            {/* Héroe */}
                            <div className="bg-[#0F1115] border border-[#C5A059]/30 p-4 rounded-xl text-left relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C5A059] md:hidden"></div>
                                <h3 className="text-[#C5A059] text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1">TE APALANCA</h3>
                                <p className="text-xs md:text-sm text-[#E5E5E5] leading-snug">
                                    &quot;Si tu ingreso depende de una <strong>infraestructura de apalancamiento</strong>, tienes Soberanía.&quot;
                                </p>
                            </div>
                        </div>

                        {/* --- FILA 3: LA SEGURIDAD --- */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 md:gap-6 items-center">
                            {/* Villano */}
                            <div className="bg-[#0F1115] border border-[#F59E0B]/20 p-4 rounded-xl text-left md:text-right relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F59E0B] md:hidden"></div>
                                <h3 className="text-[#F59E0B] text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1">TE DEJA VULNERABLE</h3>
                                <p className="text-xs md:text-sm text-[#94A3B8] leading-snug">
                                    &quot;El empleo y el autoempleo son frágiles. Una sola crisis puede romper tu única fuente.&quot;
                                </p>
                            </div>

                            {/* Eje */}
                            <div className="hidden md:flex justify-center text-[#475569]">
                                <ShieldAlert size={20} strokeWidth={1.5} />
                            </div>

                            {/* Héroe */}
                            <div className="bg-[#0F1115] border border-[#C5A059]/30 p-4 rounded-xl text-left relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C5A059] md:hidden"></div>
                                <h3 className="text-[#C5A059] text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1">ES INQUEBRANTABLE</h3>
                                <p className="text-xs md:text-sm text-[#E5E5E5] leading-snug">
                                    &quot;Antifragilidad. Si tienes una red de distribución diversificada, tu economía es blindada.&quot;
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer del Diagnóstico */}
                <div className="bg-[#0F1115] px-4 py-3 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[9px] text-[#64748B] font-mono uppercase">ESTADO: OBSOLETO</span>
                    <span className="text-[9px] text-[#F59E0B] font-bold flex items-center gap-1">
                        <RefreshCw size={10} className="animate-spin" />
                        ACTUALIZACIÓN LISTA
                    </span>
                </div>
            </div>

            {/* Cita Ingenieril */}
            <div className="px-4 border-l-2 border-[#C5A059] py-2 ml-1">
              <p className="text-sm md:text-lg text-[#E5E5E5] font-serif italic leading-relaxed">
                &quot;No necesitas trabajar más duro.<br />
                <span className="text-[#C5A059] font-bold not-italic">Necesitas Infraestructura de Apalancamiento.&quot;</span>
              </p>
            </div>
          </div>
        )}

        {/* =================================================================================
            TAB 2: LA ARQUITECTURA (3 Elementos = 1 Solución)
        ================================================================================= */}
        {activeTab === 'architecture' && (
          <div className={slideContainerClass}>

            <div className="text-center space-y-2 mb-8 mt-4 md:mt-0">
              <span className="text-[9px] md:text-xs text-[#C5A059] uppercase tracking-[0.25em] font-bold">
                Solución de Ingeniería
              </span>
              <h1 className="text-3xl md:text-5xl text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Arquitectura de<br/><span className="text-[#C5A059] italic">Apalancamiento.</span>
              </h1>
            </div>

            {/* LOS 3 ELEMENTOS INDUSTRIALES */}
            <div className="space-y-3 md:space-y-4 relative">

                {/* Línea conectora */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#C5A059]/0 via-[#C5A059]/30 to-[#C5A059]/0 hidden md:block"></div>

                {/* 1. EL MÚSCULO */}
                <div className="bg-[#15171C] p-4 rounded-xl border border-white/5 flex gap-4 items-center relative overflow-hidden group hover:border-[#C5A059]/30 transition-all">
                    <div className="w-12 h-12 rounded-lg bg-[#0F1115] flex items-center justify-center border border-white/10 text-[#94A3B8] group-hover:text-[#C5A059] group-hover:border-[#C5A059]/50 transition-all z-10 shrink-0">
                        <Factory size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm md:text-base tracking-wide">1. EL MÚSCULO (Capital y Productos)</h3>
                        <p className="text-xs text-[#94A3B8] mt-1">Gano Excel Industries. Plantas, patentes, productos y músculo financiero.</p>
                        <span className="text-[9px] text-[#C5A059] uppercase tracking-wider mt-1.5 block font-bold">Ellos ponen el riesgo</span>
                    </div>
                </div>

                {/* 2. LA TUBERÍA */}
                <div className="bg-[#15171C] p-4 rounded-xl border border-white/5 flex gap-4 items-center relative overflow-hidden group hover:border-[#C5A059]/30 transition-all">
                    <div className="w-12 h-12 rounded-lg bg-[#0F1115] flex items-center justify-center border border-white/10 text-[#94A3B8] group-hover:text-[#C5A059] group-hover:border-[#C5A059]/50 transition-all z-10 shrink-0">
                        <Map size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm md:text-base tracking-wide">2. LA TUBERÍA (Logística)</h3>
                        <p className="text-xs text-[#94A3B8] mt-1">Red de Distribución Continental. Despachos, recaudos y legalidad en 15 países.</p>
                        <span className="text-[9px] text-[#C5A059] uppercase tracking-wider mt-1.5 block font-bold">El flujo no se detiene</span>
                    </div>
                </div>

                {/* 3. EL CEREBRO */}
                <div className="bg-[#15171C] p-4 rounded-xl border border-white/5 flex gap-4 items-center relative overflow-hidden group hover:border-[#C5A059]/30 transition-all">
                    <div className="w-12 h-12 rounded-lg bg-[#0F1115] flex items-center justify-center border border-white/10 text-[#94A3B8] group-hover:text-[#C5A059] group-hover:border-[#C5A059]/50 transition-all z-10 shrink-0">
                        <BrainCircuit size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm md:text-base tracking-wide">3. EL CEREBRO (Sistematización)</h3>
                        <p className="text-xs text-[#94A3B8] mt-1">Sistema Queswa. Inteligencia Artificial, estrategia digital y educación.</p>
                        <span className="text-[9px] text-[#C5A059] uppercase tracking-wider mt-1.5 block font-bold">La mente maestra digital</span>
                    </div>
                </div>

                {/* EL RESULTADO: CONVERGENCIA */}
                <div className="mt-6 md:mt-8 bg-gradient-to-r from-[#C5A059]/10 to-[#C5A059]/5 border border-[#C5A059]/30 p-5 rounded-xl flex items-center justify-between shadow-[0_0_30px_-10px_rgba(197,160,89,0.2)]">
                    <div>
                        <p className="text-[10px] text-[#C5A059] uppercase tracking-widest font-bold mb-1">CONVERGENCIA</p>
                        <h3 className="text-white font-serif text-lg md:text-xl">Tu Código de Soberanía</h3>
                        <p className="text-xs text-[#F5E8D8]/80 mt-1">El control de los 3 sistemas en tu mano.</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#C5A059] flex items-center justify-center text-[#0F1115] shadow-lg animate-pulse-slow">
                        <Key size={24} />
                    </div>
                </div>

            </div>
          </div>
        )}

        {/* =================================================================================
            TAB 3: LA OPERACIÓN (Roles Industriales)
        ================================================================================= */}
        {activeTab === 'operation' && (
          <div className={slideContainerClass}>
            <div className="text-center mb-6 md:mb-10 mt-6 md:mt-0">
              <h1 className="text-3xl md:text-5xl text-white font-serif mb-2">Selección de Operación</h1>
              <p className="text-[#94A3B8] text-sm md:text-base max-w-xs md:max-w-md mx-auto">
                La plataforma se adapta a tu perfil. <span className="text-[#F5E8D8]">Elige tu rol.</span>
              </p>
            </div>
            <div className="space-y-4 md:space-y-5">
              {[
                {
                    id: 'campo',
                    title: 'Operador de Campo',
                    icon: Users,
                    desc: 'Operación manual. Contacto humano directo y gestión de confianza. Alta efectividad en cierre.',
                    tag: 'CLÁSICO'
                },
                {
                    id: 'hibrido',
                    title: 'Sistema Híbrido',
                    icon: Smartphone,
                    desc: 'Apalancamiento digital. Redes para atraer, IA para filtrar. Solo gestionas prospectos calificados.',
                    tag: 'RECOMENDADO',
                    highlight: true
                },
                {
                    id: 'arquitecto',
                    title: 'Arquitecto de Tráfico',
                    icon: BarChart3,
                    desc: 'Sistemas delegados. Tráfico pago y embudos automatizados. Tu rol es 100% estratégico.',
                    tag: 'AVANZADO'
                }
              ].map((role) => (
                <div key={role.id} onClick={() => setSelectedRole(role.id as any)} className={`relative p-5 md:p-6 rounded-xl border transition-all duration-300 cursor-pointer group ${selectedRole === role.id ? 'bg-[#15171C] border-[#C5A059] shadow-[0_0_20px_-10px_rgba(197,160,89,0.3)]' : 'bg-[#0F1115] border-white/5 hover:border-white/10'}`}>
                  {role.highlight && <div className="absolute top-0 right-0 bg-[#C5A059] text-[#0F1115] text-[9px] font-bold px-2 py-0.5 rounded-bl rounded-tr-lg uppercase">{role.tag}</div>}
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg flex-shrink-0 transition-colors ${selectedRole === role.id ? 'bg-[#C5A059] text-[#0F1115]' : 'bg-[#1A1D23] text-[#94A3B8] group-hover:text-[#E5E5E5]'}`}><role.icon size={20} /></div>
                    <div>
                      <h3 className={`font-bold mb-1 uppercase tracking-wide text-sm ${selectedRole === role.id ? 'text-white' : 'text-[#94A3B8]'}`}>{role.title}</h3>
                      <p className={`text-xs md:text-sm leading-snug ${selectedRole === role.id ? 'text-[#F5E8D8]' : 'text-[#64748B]'}`}>{role.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================================
            TAB 4: LA PROYECCIÓN (Simulador de Flujo)
        ================================================================================= */}
        {activeTab === 'projection' && (
          <div className={slideContainerClass}>
            <div className="text-center mt-4 md:mt-0">
              <span className="text-[9px] md:text-xs text-[#94A3B8] uppercase tracking-widest">Tablero de Control</span>
              <h1 className="text-xl md:text-4xl text-white font-serif mt-1 md:mt-2">Proyección de Flujo</h1>
            </div>

            <div className="bg-[#15171C] rounded-xl border border-white/10 overflow-hidden shadow-2xl mt-5 md:mt-8 relative">

              {/* Selector de Modo (Tabs internos) */}
              <div className="grid grid-cols-2 border-b border-white/5 bg-[#0F1115]">
                <button onClick={() => setIncomeMode('gen5')} className={`py-3 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${incomeMode === 'gen5' ? 'text-[#C5A059] bg-[#C5A059]/5 border-b-2 border-[#C5A059]' : 'text-[#64748B]'}`}>
                    <Zap size={14} /> Capital Rápido
                </button>
                <button onClick={() => setIncomeMode('binario')} className={`py-3 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${incomeMode === 'binario' ? 'text-[#C5A059] bg-[#C5A059]/5 border-b-2 border-[#C5A059]' : 'text-[#64748B]'}`}>
                    <Anchor size={14} /> Renta Vitalicia
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-6 md:space-y-8">
                <div className="text-center">
                  <p className="text-[10px] text-[#94A3B8] uppercase mb-1 font-mono">Flujo de Caja Proyectado</p>

                  {/* DISPLAY USD */}
                  <div className="flex justify-center items-baseline gap-2 text-white">
                    <span className="text-5xl md:text-7xl font-bold tracking-tighter" style={{ fontFamily: 'Georgia, serif', fontFeatureSettings: '"tnum"' }}>
                      ${incomeMode === 'gen5' ? gen5Income.toLocaleString() : binarioIncomeUSD.toLocaleString()}
                    </span>
                    <span className="text-lg md:text-xl text-[#C5A059] font-medium">USD</span>
                  </div>

                  {/* DISPLAY COP */}
                  <div className="mt-1">
                    <span className="text-xs md:text-sm text-[#64748B] font-mono">
                      ( ≈ {formatCOP(incomeMode === 'gen5' ? gen5Income : binarioIncomeUSD)} COP )
                    </span>
                  </div>

                  {/* Insight de Estilo de Vida */}
                  <div className="mt-4 bg-[#0F1115] border border-white/5 rounded-lg p-3">
                    <p className="text-xs text-[#F5E8D8] font-medium leading-tight flex items-center justify-center gap-2">
                      <Check className="w-3 h-3 text-[#10B981]" />
                      {getLifestyleTranslation(incomeMode === 'gen5' ? gen5Income : binarioIncomeUSD)}
                    </p>
                  </div>
                </div>

                {/* Controles Deslizantes (Estilo Industrial) */}
                <div className="space-y-6 pt-2 border-t border-white/5">
                  {incomeMode === 'gen5' ? (
                    <>
                      <div className="flex justify-center gap-2">
                        {['ESP1', 'ESP2', 'ESP3'].map((pkg) => (
                          <button key={pkg} onClick={() => setGen5Package(pkg as any)} className={`px-4 py-2 rounded text-[10px] uppercase font-bold transition-all border ${gen5Package === pkg ? 'bg-[#C5A059] text-[#0F1115] border-[#C5A059]' : 'bg-transparent text-[#64748B] border-white/10 hover:border-white/20'}`}>{pkg === 'ESP1' ? 'Inicial' : pkg === 'ESP2' ? 'Pro' : 'Visionario'}</button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase text-[#94A3B8] font-bold">
                            <span>Socios Directos</span>
                            <span className="text-[#C5A059]">{gen5Socios}</span>
                        </div>
                        <input type="range" min="1" max="10" value={gen5Socios} onChange={(e) => setGen5Socios(parseInt(e.target.value))} className="w-full h-1.5 bg-[#2A2E37] rounded-lg appearance-none cursor-pointer accent-[#C5A059]" />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] uppercase text-[#94A3B8] font-bold">
                        <span>Red de Consumo (Personas)</span>
                        <span className="text-[#C5A059] font-mono">{binarioParejas}</span>
                      </div>
                      <input type="range" min="10" max="1000" step="10" value={binarioParejas} onChange={(e) => setBinarioParejas(parseInt(e.target.value))} className="w-full h-1.5 bg-[#2A2E37] rounded-lg appearance-none cursor-pointer accent-[#C5A059]" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA Final */}
            <div className="mt-6 md:mt-8 px-4">
              <div className="border-l-2 border-[#C5A059] pl-3 md:pl-4 py-1 mb-5">
                <p className="text-xs md:text-sm text-[#94A3B8] font-serif italic">
                  &ldquo;La infraestructura está lista. La complejidad resuelta. <span className="text-[#E5E5E5] not-italic font-bold">Es hora de encender el sistema.</span>&rdquo;
                </p>
              </div>
              <Link href="/paquetes" className="block w-full py-4 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0F1115] font-bold uppercase tracking-widest text-xs md:text-sm rounded-lg shadow-[0_4px_20px_rgba(197,160,89,0.3)] flex items-center justify-center gap-2 transition-all text-center">
                Iniciar Ejecución <ArrowRight size={16} />
              </Link>
              <Link href="/reto-5-dias" className="block w-full py-3 mt-3 border border-white/10 hover:border-[#C5A059]/30 text-[#64748B] hover:text-[#E5E5E5] font-medium text-[10px] md:text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all">
                Auditar el Modelo (Reto 5 Días)
              </Link>
            </div>
          </div>
        )}

      </main>

      {/* --- INDUSTRIAL NAVIGATION BAR --- */}
      <nav className="fixed bottom-0 left-0 right-0 h-14 md:h-16 md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:w-[500px] bg-[#15171C]/95 backdrop-blur-xl md:rounded-2xl flex justify-around items-center z-50 shadow-2xl border-t md:border border-white/10 px-2">
        {[
          { id: 'diagnosis', icon: Activity, label: 'Diagnóstico' },
          { id: 'architecture', icon: Cpu, label: 'Solución' },
          { id: 'operation', icon: Users, label: 'Operación' },
          { id: 'projection', icon: BarChart3, label: 'Proyección' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id as TabId)}
            className={`relative flex flex-col items-center justify-center w-1/4 h-full transition-all duration-300 gap-1 group ${
              activeTab === tab.id ? 'text-[#C5A059]' : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
          >
            {/* Indicador Superior */}
            {activeTab === tab.id && (
                <span className="absolute top-0 w-8 h-0.5 bg-[#C5A059] shadow-[0_0_10px_#C5A059]"></span>
            )}

            <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} className="group-hover:-translate-y-0.5 transition-transform" />
            <span className={`text-[8px] md:text-[9px] uppercase tracking-wider ${activeTab === tab.id ? 'font-bold' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
