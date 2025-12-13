/**
 * Copyright © 2025 CreaTuActivo.com
 * Presentación Empresarial v3.0 - "The Apple Strategy"
 * Enfoque: Fintech, Claridad, Eliminación de marca "NodeX".
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle,
  Zap,
  TrendingUp,
  Users,
  Globe,
  Cpu,
  Database,
  ShieldCheck,
  BarChart3,
  ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'
import AnimatedChatDemo from '@/components/AnimatedChatDemo'
import { useHydration } from '@/hooks/useHydration'

// --- ESTILOS GLOBALES (Mismos de la Home para consistencia) ---
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --creatuactivo-blue: #3B82F6;
      --creatuactivo-purple: #8B5CF6;
      --slate-900: #0F172A;
      --slate-950: #020617;
    }

    /* TÍTULO PREMIUM (Blanco a Plata) */
    .creatuactivo-h1-ecosystem {
      font-weight: 800;
      background: linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.04em;
    }

    /* EFECTO VIDRIO */
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .glass-input {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
    }

    /* BOTONES GLOW */
    .btn-glow {
      box-shadow: 0 0 20px -5px rgba(59, 130, 246, 0.5);
    }
    .btn-glow:hover {
      box-shadow: 0 0 30px -5px rgba(59, 130, 246, 0.7);
    }

    /* BRILLO DORADO SUTIL PARA VISIONARIO */
    .border-gold-glow {
      transition: all 0.3s ease;
    }
    .border-gold-glow:hover {
      border-color: rgba(245, 158, 11, 0.4) !important;
      box-shadow: 0 0 20px -8px rgba(245, 158, 11, 0.3);
    }
  `}</style>
);

// --- COMPONENTES AUXILIARES REFINADOS ---

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="text-center max-w-3xl mx-auto mb-16">
    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">{title}</h2>
    <p className="text-xl text-slate-400 font-light leading-relaxed">{subtitle}</p>
  </div>
);

const TriadCard = ({ icon, title, role, description, colorClass }: { icon: React.ReactNode, title: string, role: string, description: string, colorClass: string }) => (
  <div className="glass-card p-8 rounded-3xl relative overflow-hidden group h-full hover:bg-white/5 transition-all duration-500">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${colorClass}`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">{role}</p>
    <p className="text-slate-400 leading-relaxed text-sm font-light">
      {description}
    </p>
  </div>
);

const PackageCard = ({
  title,
  priceUSD,
  priceCOP,
  features,
  isPremium,
  ctaText = "Iniciar con este Plan"
}: {
  title: string
  priceUSD: string
  priceCOP: string
  features: string[]
  isPremium?: boolean
  ctaText?: string
}) => (
  <div className={`glass-card rounded-[2rem] h-full flex flex-col relative transition-all duration-300 ${isPremium ? 'border-gold-glow border-white/5 hover:-translate-y-2' : 'border-white/5 hover:border-white/20 hover:bg-white/5 hover:-translate-y-2'}`}>
    <div className="p-8 md:p-10 flex-grow flex flex-col">
      <h3 className={`text-xl font-bold mb-2 ${isPremium ? 'text-amber-400' : 'text-white'}`}>{title}</h3>
      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white tracking-tight">${priceUSD}</span>
          <span className="text-slate-500 font-medium">USD</span>
        </div>
        <p className="text-sm text-slate-500 mt-1">Aprox. ${priceCOP} COP</p>
      </div>

      <div className="w-full h-px mb-8 bg-white/10"></div>

      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-6">Incluye:</p>
      <ul className="space-y-4 text-slate-300 flex-grow mb-10">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm font-light">
            <CheckCircle className="w-5 h-5 shrink-0 text-blue-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/fundadores"
        className="w-full text-center font-bold py-4 px-6 rounded-xl transition-all duration-300 mt-auto flex items-center justify-center gap-2 bg-slate-800 text-white hover:bg-slate-700 border border-white/10"
      >
        {ctaText} <ArrowRight size={16} />
      </Link>
    </div>
  </div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="glass-card rounded-2xl overflow-hidden mb-4 transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <h3 className="text-lg font-bold text-white pr-4">{question}</h3>
        <ChevronDown className={`w-6 h-6 text-blue-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`px-6 text-slate-400 text-sm leading-relaxed font-light transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="whitespace-pre-line">{answer}</div>
      </div>
    </div>
  );
};

// --- CALCULADORA DUAL (ACTIVO + PASIVO) ---
const DualIncomeCalculator = () => {
    const [mode, setMode] = useState<'active' | 'passive'>('passive');

    // Estados Activo (Bonos de Inicio Rápido)
    const [packageCount, setPackageCount] = useState(3);
    const [packageType, setPackageType] = useState('ESP3');
    const [activeIncome, setActiveIncome] = useState(0);

    // Estados Pasivo (Renta Mensual)
    const [teamSize, setTeamSize] = useState(100);
    const [monthlyIncomeUSD, setMonthlyIncomeUSD] = useState(0);
    const [monthlyIncomeCOP, setMonthlyIncomeCOP] = useState(0);

    // Cálculos
    useEffect(() => {
        // ACTIVO: Bonos por paquetes
        const bonuses: Record<string, number> = { 'ESP3': 150, 'ESP2': 75, 'ESP1': 25 };
        setActiveIncome(packageCount * bonuses[packageType]);

        // PASIVO: Ingreso residual por consumo
        const incomePerPersonCOP = 19125;
        const exchangeRate = 4500;
        const totalIncomeCOP = teamSize * incomePerPersonCOP;
        const totalIncomeUSD = totalIncomeCOP / exchangeRate;
        setMonthlyIncomeCOP(totalIncomeCOP);
        setMonthlyIncomeUSD(totalIncomeUSD);
    }, [packageCount, packageType, teamSize]);

    return (
        <div className="glass-card p-1 rounded-3xl overflow-hidden border border-white/10">
            {/* Tabs */}
            <div className="grid grid-cols-2 bg-slate-900/50 p-1 rounded-t-3xl">
                <button
                    onClick={() => setMode('active')}
                    className={`py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'active' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    <Zap size={18} /> Ganancias Rápidas
                </button>
                <button
                    onClick={() => setMode('passive')}
                    className={`py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'passive' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    <TrendingUp size={18} /> Renta Mensual
                </button>
            </div>

            <div className="p-8 md:p-12 bg-slate-950/50">
                {mode === 'active' ? (
                    <div className="animate-in fade-in duration-300">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Bonos de Inicio Rápido</h3>
                            <p className="text-slate-400 text-sm">Dinero inmediato por conectar nuevos socios.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs text-slate-500 uppercase font-bold mb-3">Si conectas socios con paquete:</label>
                                    <div className="flex gap-2">
                                        {['ESP1', 'ESP2', 'ESP3'].map((pkg) => (
                                            <button
                                                key={pkg}
                                                onClick={() => setPackageType(pkg)}
                                                className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${packageType === pkg ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-white/10 bg-white/5 text-slate-400'}`}
                                            >
                                                {pkg === 'ESP3' ? 'Visionario' : pkg === 'ESP2' ? 'Empresarial' : 'Inicial'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 uppercase font-bold mb-3">Cantidad de socios nuevos:</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range" min="1" max="20" value={packageCount}
                                            onChange={(e) => setPackageCount(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                        <span className="text-white font-bold text-xl w-8">{packageCount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-900/20 border border-blue-500/20 rounded-2xl p-8 text-center">
                                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Tu Ganancia Inmediata</p>
                                <div className="text-5xl font-bold text-white mb-2 tracking-tight">
                                    ${activeIncome} <span className="text-lg text-slate-500">USD</span>
                                </div>
                                <p className="text-xs text-slate-500">Pagado semanalmente a tu cuenta.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-300">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Simulador de Rentas</h3>
                            <p className="text-slate-400 text-sm">Ingreso Residual (Regalías) mensual estimado.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs text-slate-500 uppercase font-bold mb-3">Volumen de tu Red:</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range" min="10" max="1000" step="10" value={teamSize}
                                            onChange={(e) => setTeamSize(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                        <span className="text-white font-bold text-xl w-16">{teamSize}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-600 mt-2">
                                        <span>10</span>
                                        <span>500</span>
                                        <span>1,000+</span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 italic">
                                    * Proyección basada en consumo promedio. No garantiza resultados sin trabajo.
                                </p>
                            </div>

                            <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-8 text-center">
                                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Tu Renta Mensual</p>
                                <div className="text-5xl font-bold text-white mb-2 tracking-tight">
                                    ${monthlyIncomeUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })} <span className="text-lg text-slate-500">USD</span>
                                </div>
                                <p className="text-sm text-slate-500">
                                    ~ ${monthlyIncomeCOP.toLocaleString('es-CO', { maximumFractionDigits: 0 })} COP
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// --- PÁGINA PRINCIPAL ---
export default function PresentacionEmpresarialPage() {
  const isHydrated = useHydration()

  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
        <StrategicNavigation />

        {/* 1. HERO: EVOLUCIÓN */}
        <section className="relative pt-36 pb-24 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={isHydrated ? { opacity: 0, y: 20 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Economía Digital 2025
                </div>
                <h1 className="creatuactivo-h1-ecosystem text-5xl md:text-7xl lg:text-8xl mb-8 leading-[1.1]">
                    Construye un Activo. <br />
                    <span className="text-white">No otro empleo.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                    Pasamos de alquilar películas a <b>Netflix</b>. Pasamos de los mapas de papel a <b>Waze</b>. <br className="hidden md:block"/>
                    Es hora de pasar de "vender puerta a puerta" a construir <b>Sistemas Digitales Automatizados</b>.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <Link href="#diferencia" className="w-full sm:w-auto px-10 py-4 bg-white text-slate-950 font-bold rounded-full text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2 btn-glow">
                       Ver la Diferencia
                    </Link>
                </div>
            </motion.div>
          </div>
        </section>

        {/* 2. LA GRAN DIFERENCIA (EDUCACIÓN) */}
        <section id="diferencia" className="py-24 bg-slate-950 border-t border-white/5">
            <div className="container mx-auto px-4">
                <SectionHeader title="El Juego ha Cambiado" subtitle="No te invitamos a ganar dinero (lineal). Te invitamos a construir libertad (exponencial)." />

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Tarjeta Roja: Empleo */}
                    <div className="p-8 rounded-3xl border border-red-500/10 bg-red-500/5 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-500/10 rounded-xl text-red-500"><BarChart3 size={24}/></div>
                            <h3 className="text-xl font-bold text-white">Ingreso Lineal</h3>
                        </div>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex gap-3"><span className="text-red-500">✕</span> Cambias tiempo por dinero (1:1).</li>
                            <li className="flex gap-3"><span className="text-red-500">✕</span> Si te detienes, el ingreso cae a cero.</li>
                            <li className="flex gap-3"><span className="text-red-500">✕</span> Techo de ingresos limitado.</li>
                        </ul>
                    </div>

                    {/* Tarjeta Verde: Activo */}
                    <div className="p-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 shadow-lg shadow-emerald-500/5 transform md:-translate-y-4">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400"><TrendingUp size={24}/></div>
                            <h3 className="text-xl font-bold text-white">Ingreso Residual</h3>
                        </div>
                        <ul className="space-y-4 text-sm text-white">
                            <li className="flex gap-3"><CheckCircle size={18} className="text-emerald-400 shrink-0"/> El sistema trabaja sin tu presencia.</li>
                            <li className="flex gap-3"><CheckCircle size={18} className="text-emerald-400 shrink-0"/> Crece exponencialmente (Red).</li>
                            <li className="flex gap-3"><CheckCircle size={18} className="text-emerald-400 shrink-0"/> Sin techo financiero.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* --- CONTEXTO: ¿QUÉ CONSTRUIMOS? --- */}
        <section className="py-24 bg-slate-950 border-t border-white/5">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="Infraestructura, no Venta."
                    subtitle="La mayoría busca clientes. Nosotros construimos canales de distribución."
                />

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="text-center p-6">
                        <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                            <Globe size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Distribución Masiva</h3>
                        <p className="text-slate-400 text-sm font-light leading-relaxed">
                            Creamos canales digitales por donde fluyen productos de consumo masivo (Gano Excel) en toda América. Sin bodegas en tu casa.
                        </p>
                    </div>
                    <div className="text-center p-6 border-x border-white/5">
                        <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6">
                            <Database size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Propiedad del Activo</h3>
                        <p className="text-slate-400 text-sm font-light leading-relaxed">
                            El mercado que construyes queda codificado a tu nombre legalmente. Es un activo heredable, vendible y vitalicio.
                        </p>
                    </div>
                    <div className="text-center p-6">
                        <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
                            <TrendingUp size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Renta Recurrente</h3>
                        <p className="text-slate-400 text-sm font-light leading-relaxed">
                            Haces el trabajo de conexión una vez, y cobras regalías cada vez que alguien se toma un Gano café en tu red.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* --- LA SOLUCIÓN: CREATUACTIVO AI (Antes Nexus) --- */}
        <section className="py-32 bg-slate-900 relative overflow-hidden">
             <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                     {/* Demo Chat UI - Reutilizamos componente pero con nuevo contexto */}
                     <div className="order-2 lg:order-1">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full"></div>
                            <AnimatedChatDemo typingSpeed={20} loopDelay={5000} />
                        </div>
                     </div>

                     <div className="order-1 lg:order-2">
                        <span className="text-blue-400 font-bold tracking-widest uppercase text-xs mb-4 block">Tu Ventaja Injusta</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                            Tú vives tu vida. <br/>
                            <span className="text-slate-500">La IA construye tu negocio.</span>
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 font-light">
                            La razón #1 del fracaso es "no saber vender" o "no tener tiempo".
                            Nuestra Inteligencia Artificial (CreaTuActivo AI) elimina ese problema de raíz.
                        </p>

                        <div className="space-y-6">
                            {[
                                "Explica el negocio con datos precisos 24/7.",
                                "Filtra a los curiosos sin intención de compra.",
                                "Entrena a tu equipo nuevo (Duplicación Automática).",
                                "Opera mientras duermes o viajas."
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="mt-1">
                                        <CheckCircle size={20} className="text-emerald-500" />
                                    </div>
                                    <p className="text-slate-300 font-light">{item}</p>
                                </div>
                            ))}
                        </div>
                     </div>
                 </div>
             </div>
        </section>

        {/* --- CÓMO FUNCIONA: LA TRÍADA --- */}
        <section id="como-funciona" className="py-32 bg-slate-950">
             <div className="container mx-auto px-4">
                <SectionHeader
                    title="Tu Equipo de Poder"
                    subtitle="No estás solo. Una alianza estratégica diseñada para minimizar el riesgo."
                />

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto h-full">
                    <TriadCard
                        colorClass="bg-blue-500/10 text-blue-500"
                        icon={<Users size={28} />}
                        title="1. TÚ"
                        role="La Visión"
                        description="Tu único rol es conectar. No tienes que convencer, solo invitar a las personas a evaluar el sistema. Tú pones la dirección y las relaciones."
                    />
                    <TriadCard
                        colorClass="bg-purple-500/10 text-purple-500"
                        icon={<Cpu size={28} />}
                        title="2. CreaTuActivo"
                        role="La Tecnología"
                        description="Nosotros ponemos el software. Nuestra IA educa, filtra y cierra. Te entregamos la infraestructura digital llave en mano."
                    />
                    <TriadCard
                        colorClass="bg-emerald-500/10 text-emerald-500"
                        icon={<ShieldCheck size={28} />}
                        title="3. Socio Corporativo"
                        role="El Capital & Logística"
                        description="Gano Excel pone el músculo financiero. Un gigante asiático libre de deudas que se encarga de importar, bodegaje, envíos y pagarte."
                    />
                 </div>
             </div>
        </section>

        {/* --- LA MATEMÁTICA (CALCULADORAS FINTECH) --- */}
        <section id="proyeccion" className="py-32 bg-slate-900 border-y border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                    <div>
                        <span className="text-emerald-400 font-bold tracking-widest uppercase text-xs mb-4 block">Proyección Financiera</span>
                        <h2 className="text-4xl font-bold text-white mb-6">
                            El Poder del Efecto Compuesto.
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 font-light">
                            A diferencia de un sueldo lineal, aquí construyes una red de consumo.
                            Pequeños consumos de café multiplicados por miles de personas = Libertad Financiera.
                        </p>

                        <div className="glass-card p-6 rounded-2xl border-l-4 border-emerald-500 bg-emerald-500/5 mb-8">
                            <p className="text-slate-300 italic text-sm">
                                "Prefiero el 1% del esfuerzo de 100 personas, que el 100% de mi propio esfuerzo." <br/>
                                <span className="text-white font-bold not-italic mt-2 block">- J. Paul Getty</span>
                            </p>
                        </div>
                    </div>

                    {/* Componente Calculadora Dual */}
                    <DualIncomeCalculator />
                </div>
            </div>
        </section>

        {/* --- PRUEBA SOCIAL --- */}
        <section className="py-32 bg-slate-950">
             <div className="container mx-auto px-4">
                <SectionHeader title="Resultados Reales" subtitle="Personas comunes usando un sistema extraordinario." />

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* Testimonio 1 */}
                    <div className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-white">LM</div>
                            <div>
                                <h4 className="font-bold text-white">Liliana P. Moreno</h4>
                                <p className="text-xs text-slate-500">Ex-Ama de Casa</p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm italic">"Pasé años intentando vender manualmente sin éxito. Con este sistema, construí el patrimonio de mis hijas desde casa."</p>
                    </div>
                     {/* Testimonio 2 */}
                     <div className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-white">AG</div>
                            <div>
                                <h4 className="font-bold text-white">Andrés Guzmán</h4>
                                <p className="text-xs text-slate-500">Sector Salud</p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm italic">"Como profesional de salud no tenía tiempo. La IA hace el 80% del trabajo aburrido que yo odiaba."</p>
                    </div>
                     {/* Testimonio 3 */}
                     <div className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-white">JM</div>
                            <div>
                                <h4 className="font-bold text-white">Dr. Jonathan M.</h4>
                                <p className="text-xs text-slate-500">Médico Especialista</p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm italic">"La tecnología me permitió multiplicar mis ingresos sin tener que dejar mi consultorio. Es apalancamiento puro."</p>
                    </div>
                </div>
             </div>
        </section>

        {/* --- CAPITAL SEMILLA (PAQUETES) --- */}
        <section className="py-32 bg-slate-950">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="Elige tu Nivel de Entrada"
                    subtitle="Esto es un negocio real de distribución de productos físicos. Tu inversión te entrega inventario inmediato."
                />

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-end">
                    {/* Opción 1 */}
                    <PackageCard
                        title="Paquete Inicial"
                        priceUSD="200"
                        priceCOP="900.000"
                        features={[
                            "Inventario básico para consumo personal",
                            "Acceso a la App CreaTuActivo",
                            "Plan de Comisiones al 20%",
                            "Acceso a la Academia Básica"
                        ]}
                    />

                    {/* Opción 2 */}
                    <PackageCard
                        title="Paquete Empresarial"
                        priceUSD="500"
                        priceCOP="2.250.000"
                        features={[
                            "Inventario profesional para muestras",
                            "Acceso Prioritario a la IA",
                            "Plan de Comisiones al 50%",
                            "Mentoría Grupal Mensual",
                            "Herramientas de Marketing Pro"
                        ]}
                        ctaText="Seleccionar Empresarial"
                    />

                    {/* Opción 3 - PREMIUM */}
                    <PackageCard
                        title="Paquete Visionario"
                        priceUSD="1,000"
                        priceCOP="4.500.000"
                        isPremium={true}
                        features={[
                            "Inventario máximo volumen",
                            "Acceso VIP a todas las funciones",
                            "Plan de Comisiones al 100% (Máximo)",
                            "Mentoría Directa con Diamantes",
                            "Acceso al Club de Fundadores"
                        ]}
                        ctaText="Ir por Todo (Visionario)"
                    />
                </div>

                <div className="mt-16 text-center">
                    <p className="text-xs text-slate-500 max-w-2xl mx-auto">
                        * Garantía de Legalidad: El pago se realiza directamente a las cuentas bancarias corporativas de Gano Excel S.A. (Gran Contribuyente). Recibes factura legal y producto físico respaldando el 100% de tu capital.
                    </p>
                </div>
            </div>
        </section>

        {/* --- FAQ --- */}
        <section className="py-24 bg-slate-900">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">Preguntas Frecuentes</h2>
                <FAQItem question="¿Tengo que vender puerta a puerta?" answer="No. Usamos tecnología de atracción. La IA se encarga de explicar. Tú solo conectas." />
                <FAQItem question="¿Es seguro y legal?" answer="100%. Operamos con Gano Excel (Gran Contribuyente DIAN) y bajo la Ley 1700. Tu inversión es en producto físico real." />
                <FAQItem question="No tengo experiencia, ¿puedo hacerlo?" answer="Sí. El sistema está diseñado para 'Cero Fricción'. Si usas WhatsApp, puedes usar esto. Además tienes mentoría." />
                <FAQItem question="¿Por qué hay cupos limitados?" answer="Porque ofrecemos mentoría personalizada. No es un curso grabado, es una sociedad de trabajo." />
            </div>
        </section>

        {/* --- CTA FINAL --- */}
        <section className="py-32 bg-slate-900 border-t border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
            <div className="container mx-auto px-4 text-center relative z-10">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                        La infraestructura está lista. <br/>
                        Solo falta tu decisión.
                    </h2>
                    <p className="text-xl text-slate-400 mb-12 font-light">
                        No dejes que el escepticismo te robe la oportunidad de ser pionero en la digitalización de esta industria.
                    </p>

                    <Link
                        href="/fundadores"
                        className="inline-flex items-center justify-center px-12 py-5 bg-white text-slate-950 font-bold rounded-full text-xl transition-all hover:scale-105 hover:bg-slate-200 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                    >
                        Unirme a los Fundadores <ArrowRight className="ml-2 w-6 h-6" />
                    </Link>
                </div>
            </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="border-t border-white/5 py-16 bg-slate-950 text-slate-500 text-sm">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white font-bold text-lg mb-2">CreaTuActivo</p>
            <p className="font-light mb-8">Ingeniería de Activos Digitales.</p>
            <div className="flex justify-center gap-8 mb-8">
                <Link href="/legal" className="hover:text-white transition-colors">Términos</Link>
                <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
                <Link href="/soporte" className="hover:text-white transition-colors">Soporte</Link>
            </div>
            <p className="opacity-40">&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
