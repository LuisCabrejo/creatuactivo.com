/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Página de Presentación Empresarial - Versión "Nexus Protagonista" & "Método Conquista"
 * Diseñada para presentaciones 1 a 1 y conversión directa.
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
// Esta es la ÚNICA línea de lucide-react que debes tener (incluye Clock):
import { ArrowRight, CheckCircle, Zap, Rocket, Crown, TrendingUp, Users, Sparkles, ChevronDown, Play, Package, Cpu, Globe, Lock, ShieldCheck, Database, Smartphone, Layout, Clock } from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'

// --- Estilos CSS Globales ---
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --creatuactivo-blue: #3B82F6;
      --creatuactivo-purple: #8B5CF6;
      --creatuactivo-dark: #0F172A;
    }
    .text-gradient {
      background: linear-gradient(135deg, #FFFFFF 0%, #93C5FD 50%, #A78BFA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .text-gradient-gold {
      background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .glass-card {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
    .glass-card:hover {
      border-color: rgba(139, 92, 246, 0.3);
      box-shadow: 0 10px 40px rgba(139, 92, 246, 0.1);
    }
    .nexus-chat-bubble {
        background: rgba(30, 41, 59, 0.8);
        border-left: 3px solid #8B5CF6;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 100%);
      transition: all 0.3s ease;
    }
    .btn-primary:hover {
      filter: brightness(1.1);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
  `}</style>
);

// --- Componentes ---

const SectionHeader = ({ badge, title, subtitle }: { badge?: string, title: string, subtitle: string }) => (
  <div className="text-center max-w-4xl mx-auto mb-16">
    {badge && (
      <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
        {badge}
      </span>
    )}
    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">{title}</h2>
    <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

const TriadCard = ({ icon, title, role, description, color }: { icon: React.ReactNode, title: string, role: string, description: string, color: string }) => (
  <div className="glass-card p-8 rounded-2xl relative overflow-hidden group h-full">
    <div className={`absolute top-0 left-0 w-full h-1 bg-${color}-500 opacity-50`}></div>
    <div className="mb-6 inline-block p-4 rounded-xl bg-slate-800/50 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
    <p className={`text-sm font-bold text-${color}-400 uppercase tracking-wider mb-4`}>{role}</p>
    <p className="text-slate-400 leading-relaxed text-sm">
      {description}
    </p>
  </div>
);

const ValueItem = ({ feature, price }: { feature: string, price: string }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-700/50 last:border-0">
    <div className="flex items-center gap-3">
      <CheckCircle className="text-green-400 w-5 h-5" />
      <span className="text-slate-300">{feature}</span>
    </div>
    <span className="text-slate-500 font-mono decoration-slate-600">{price}</span>
  </div>
);

const PackageCard = ({
  title,
  priceUSD,
  priceCOP,
  level,
  features,
  isPopular,
  bonus
}: {
  title: string
  priceUSD: string
  priceCOP: string
  level: string
  features: string[]
  isPopular?: boolean
  bonus?: string
}) => (
  <div className={`relative rounded-2xl h-full flex flex-col ${isPopular ? 'glass-card border-purple-500/40 shadow-2xl z-10 transform md:-translate-y-4' : 'bg-slate-900/40 border border-slate-800'}`}>
    {isPopular && (
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
        RECOMENDADO PARA FUNDADORES
      </div>
    )}

    <div className="p-8 flex-grow">
      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">{level}</p>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>

      <div className="flex items-end gap-2 mb-2">
        <span className="text-4xl font-extrabold text-white">${priceUSD}</span>
        <span className="text-xl font-medium text-slate-400 mb-1">USD</span>
      </div>
      <p className="text-sm text-slate-500 mb-8">Aprox. ${priceCOP} COP</p>

      {bonus && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6">
            <p className="text-xs text-blue-300 font-semibold flex items-center gap-2">
                <Zap size={14} className="fill-current"/> {bonus}
            </p>
        </div>
      )}

      <ul className="space-y-4">
        {features.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckCircle className={`w-5 h-5 flex-shrink-0 ${isPopular ? 'text-green-400' : 'text-slate-600'}`} />
            <span className="text-sm text-slate-300">{item}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="p-8 pt-0 mt-auto">
      <Link href="/fundadores" className={`w-full block text-center py-4 rounded-xl font-bold transition-all ${isPopular ? 'btn-primary text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
        Elegir Este Nivel
      </Link>
    </div>
  </div>
);

// --- Componente Principal ---
export default function PresentacionEmpresarialPage() {
  const [teamSize, setTeamSize] = useState(100);
  const [monthlyIncomeUSD, setMonthlyIncomeUSD] = useState(0);
  const [monthlyIncomeCOP, setMonthlyIncomeCOP] = useState(0);

  useEffect(() => {
    // Cálculo estimado (Consumo promedio x Porcentaje Residual)
    const incomePerPersonCOP = 19125;
    const exchangeRate = 4500;
    const totalIncomeCOP = teamSize * incomePerPersonCOP;
    const totalIncomeUSD = totalIncomeCOP / exchangeRate;
    setMonthlyIncomeCOP(totalIncomeCOP);
    setMonthlyIncomeUSD(totalIncomeUSD);
  }, [teamSize]);

  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-950 text-white min-h-screen font-sans selection:bg-purple-500/30 overflow-x-hidden">
        <StrategicNavigation />

        {/* Fondo Ambiental Dinámico */}
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <main className="relative z-10 pt-28 pb-20 px-4 lg:px-8">

          {/* SECCIÓN 1: HERO - EL CONTEXTO (Waze/Netflix) */}
          <section className="max-w-6xl mx-auto mb-24 lg:mb-32">
             <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Evolución Tecnológica
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
                        Hacerlo difícil <br />
                        <span className="text-gradient">ya pasó de moda.</span>
                    </h1>

                    <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                        Pasamos de alquilar películas a <b>Netflix</b>. <br/>
                        Pasamos de los mapas de papel a <b>Waze</b>. <br/>
                        <span className="text-white font-semibold">Pasamos de "vender puerta a puerta" a construir Sistemas Digitales.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="#sistema" className="btn-primary px-8 py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2">
                           Ver la Tecnología <ArrowRight size={20} />
                        </Link>
                        <div className="flex items-center gap-3 px-6 py-4">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-900"></div>
                                <div className="w-10 h-10 rounded-full bg-slate-600 border-2 border-slate-900"></div>
                                <div className="w-10 h-10 rounded-full bg-slate-500 border-2 border-slate-900"></div>
                            </div>
                            <span className="text-sm text-slate-400"><strong>+2.8k</strong> Fundadores activos</span>
                        </div>
                    </div>
                </motion.div>

                {/* Visual Hero: Comparativa */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="glass-card p-6 rounded-2xl animate-float">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 border-dashed opacity-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-500"><Clock size={20}/></div>
                                    <div>
                                        <p className="font-bold text-slate-400">Modelo Antiguo</p>
                                        <p className="text-xs text-slate-500">Esfuerzo manual, 1 a 1, lento.</p>
                                    </div>
                                </div>
                                <span className="text-slate-600 font-mono">10% Efectivo</span>
                            </div>

                            <div className="flex items-center justify-center">
                                <ArrowRight className="text-slate-600 rotate-90 lg:rotate-0" />
                            </div>

                            <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 shadow-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                                        <Cpu size={24}/>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-lg">Modelo NEXUS</p>
                                        <p className="text-xs text-blue-200">IA Automatizada, Masivo, 24/7.</p>
                                    </div>
                                </div>
                                <span className="text-green-400 font-mono font-bold text-xl">100% Escala</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
             </div>
          </section>

          {/* SECCIÓN 2: DEFINICIÓN DEL NEGOCIO (Qué es) */}
          <section id="sistema" className="max-w-5xl mx-auto mb-24 lg:mb-32 text-center">
             <SectionHeader
                title="¿Qué estamos construyendo?"
                subtitle="No es venta de catálogo. No es repartir café. Es Infraestructura."
             />

             <div className="glass-card p-8 lg:p-12 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="grid md:grid-cols-3 gap-8 text-left relative z-10">
                    <div>
                        <div className="mb-4 text-blue-400"><Globe size={32} /></div>
                        <h3 className="text-xl font-bold text-white mb-2">Distribución Masiva</h3>
                        <p className="text-slate-400 text-sm">
                            Creamos canales por donde fluyen millones de dólares en productos de consumo diario en toda América.
                        </p>
                    </div>
                    <div>
                        <div className="mb-4 text-purple-400"><Database size={32} /></div>
                        <h3 className="text-xl font-bold text-white mb-2">Activo Digital</h3>
                        <p className="text-slate-400 text-sm">
                            El mercado que construyes queda codificado a tu nombre. Es tuyo. Heredable y vitalicio.
                        </p>
                    </div>
                    <div>
                        <div className="mb-4 text-green-400"><TrendingUp size={32} /></div>
                        <h3 className="text-xl font-bold text-white mb-2">Ingreso Residual</h3>
                        <p className="text-slate-400 text-sm">
                            Haces el trabajo bien una vez (construir la red), y cobras cada vez que alguien se toma un café.
                        </p>
                    </div>
                </div>
             </div>
          </section>

          {/* SECCIÓN 3: LA MÁQUINA (Nexus Protagonista) */}
          <section className="max-w-6xl mx-auto mb-24 lg:mb-32">
             <div className="grid lg:grid-cols-2 gap-12 items-center">
                 {/* Demo Chat UI */}
                 <div className="order-2 lg:order-1">
                    <div className="glass-card p-4 rounded-3xl border border-slate-700 shadow-2xl max-w-sm mx-auto">
                        <div className="bg-slate-900 rounded-2xl overflow-hidden h-[500px] flex flex-col relative">
                            {/* Header Celular */}
                            <div className="bg-slate-800 p-4 flex items-center gap-3 border-b border-slate-700">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
                                    <Sparkles size={14} className="text-white"/>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">NEXUS AI</p>
                                    <p className="text-[10px] text-green-400 flex items-center gap-1">● En línea</p>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 p-4 space-y-4 overflow-y-auto font-mono text-xs">
                                <div className="bg-slate-800 p-3 rounded-xl rounded-tl-none text-slate-300">
                                    Hola Juan, veo que te interesa generar ingresos pasivos. ¿Cuentas con 5 horas semanales?
                                </div>
                                <div className="bg-blue-600/20 p-3 rounded-xl rounded-tr-none text-blue-100 ml-auto max-w-[80%]">
                                    Sí, tengo el tiempo. Pero no sé vender.
                                </div>
                                <div className="bg-slate-800 p-3 rounded-xl rounded-tl-none text-slate-300">
                                    <span className="text-purple-400 font-bold">NEXUS:</span> Perfecto. No buscamos vendedores, buscamos conectores. Yo me encargo de explicar el negocio por ti. ¿Te muestro cómo?
                                </div>
                                <div className="bg-blue-600/20 p-3 rounded-xl rounded-tr-none text-blue-100 ml-auto max-w-[80%]">
                                    Ok, muéstrame.
                                </div>
                                <div className="mt-4 text-center">
                                    <span className="text-[10px] text-slate-500 uppercase">NEXUS ha agendado una cita</span>
                                </div>
                            </div>

                            {/* Input Mockup */}
                            <div className="p-3 bg-slate-800 border-t border-slate-700">
                                <div className="h-8 bg-slate-700 rounded-full w-full opacity-50"></div>
                            </div>
                        </div>
                    </div>
                 </div>

                 <div className="order-1 lg:order-2">
                    <SectionHeader
                        badge="Tu Socio Digital"
                        title="Tú vives tu vida. Nexus construye tu negocio."
                        subtitle="La razón #1 por la que la gente no emprende es miedo a 'no saber hacerlo'. Nexus elimina ese miedo."
                    />
                    <ul className="space-y-6">
                        {[
                            "Explica el negocio con datos precisos las 24 horas.",
                            "Filtra a los curiosos para que no pierdas tiempo.",
                            "Entrena a tu equipo nuevo (Duplicación Automática).",
                            "Trabaja mientras duermes, viajas o estás en tu empleo."
                        ].map((item, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-4"
                            >
                                <div className="mt-1 p-1 bg-green-500/20 rounded-full">
                                    <CheckCircle size={16} className="text-green-400" />
                                </div>
                                <p className="text-lg text-slate-300">{item}</p>
                            </motion.li>
                        ))}
                    </ul>
                 </div>
             </div>
          </section>

          {/* SECCIÓN 4: LA TRÍADA PERFECTA (La Lógica del Negocio) */}
          <section className="max-w-7xl mx-auto mb-24 lg:mb-32">
             <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">No estás solo. Tienes 3 Gigantes.</h2>
                <p className="text-slate-400">Una alianza estratégica diseñada para que no falles.</p>
             </div>

             <div className="grid md:grid-cols-3 gap-6">
                <TriadCard
                    color="blue"
                    icon={<Users size={32} className="text-blue-400" />}
                    title="1. TÚ"
                    role="La Visión"
                    description="Tu único rol es conectar personas. No tienes que convencer, solo invitar a conocer. Tú pones la dirección, el liderazgo y las relaciones."
                />
                <TriadCard
                    color="purple"
                    icon={<Cpu size={32} className="text-purple-400" />}
                    title="2. NEXUS"
                    role="La Ejecución"
                    description="Nuestra IA exclusiva. Se encarga de educar, responder objeciones y cerrar. Es la herramienta que hace el trabajo pesado y técnico por ti."
                />
                <TriadCard
                    color="green"
                    icon={<Globe size={32} className="text-green-400" />}
                    title="3. GANO EXCEL"
                    role="La Logística"
                    description="El respaldo financiero. Un gigante asiático libre de deudas. Ellos ponen las oficinas, el producto, la importación y te pagan puntualmente."
                />
             </div>
          </section>

          {/* SECCIÓN 5: LA OFERTA IRRESISTIBLE (Value Stack) */}
          <section className="max-w-4xl mx-auto mb-24 lg:mb-32">
             <div className="glass-card rounded-3xl p-1 border-t border-purple-500/50">
                <div className="bg-slate-900/90 rounded-[22px] p-8 lg:p-12">
                    <div className="text-center mb-10">
                        <span className="text-purple-400 font-bold tracking-widest text-sm uppercase">Bono Exclusivo de Equipo</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">¿Cuánto cuesta esta tecnología?</h2>
                    </div>

                    <div className="space-y-2 mb-10">
                        <ValueItem feature="Desarrollo de Plataforma Web & App" price="$12,000 USD" />
                        <ValueItem feature="Integración de IA (Nexus) + Vectores" price="$5,000 USD" />
                        <ValueItem feature="Sistema de Embudos Automatizados" price="$3,000 USD/año" />
                        <ValueItem feature="Mantenimiento de Servidores" price="$500 USD/mes" />

                        <div className="flex items-center justify-between py-6 mt-4 border-t-2 border-slate-700">
                            <span className="text-xl font-bold text-white">Valor Total Real</span>
                            <span className="text-xl font-bold text-slate-500 line-through">$20,500 USD</span>
                        </div>

                        <div className="flex items-center justify-between py-4 bg-purple-600/20 p-4 rounded-xl border border-purple-500/50">
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-yellow-400 fill-current" />
                                <span className="text-white font-bold text-lg">Precio para Socios</span>
                            </div>
                            <span className="text-4xl font-extrabold text-green-400">$0 USD</span>
                        </div>
                    </div>

                    <p className="text-center text-slate-400 text-sm">
                        * No vendemos el software. Lo entregamos <b>GRATIS</b> como herramienta de trabajo a quienes se asocian con nosotros para distribuir la marca.
                    </p>
                </div>
             </div>
          </section>

          {/* SECCIÓN 6: PROYECCIÓN (Calculadora) */}
          <section className="max-w-5xl mx-auto mb-24 lg:mb-32">
             <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white">El Poder del Residual</h2>
                <p className="text-slate-400">Si Nexus te ayuda a construir una comunidad de consumo, esto pasa:</p>
             </div>

             <div className="glass-card p-8 rounded-2xl">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                     <div className="w-full">
                         <label className="block text-slate-400 mb-4 font-medium">Personas en tu organización consumiendo café:</label>
                         <input
                            type="range"
                            min="10"
                            max="1000"
                            step="10"
                            value={teamSize}
                            onChange={(e) => setTeamSize(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                         />
                         <div className="mt-4 text-center p-2 bg-slate-800 rounded-lg border border-slate-700">
                             <span className="text-2xl font-bold text-white">{teamSize}</span>
                             <span className="text-sm text-slate-500 ml-2">Socios/Clientes</span>
                         </div>
                     </div>

                     <div className="md:border-l border-slate-700 md:pl-8 w-full text-center md:text-right">
                         <p className="text-sm text-slate-500 uppercase tracking-wide font-bold mb-2">Tu Renta Mensual (Aprox)</p>
                         <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                            ${monthlyIncomeUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })} <span className="text-lg text-slate-500">USD</span>
                         </p>
                         <p className="text-sm text-slate-500 mt-2">~ ${monthlyIncomeCOP.toLocaleString('es-CO')} COP</p>
                     </div>
                 </div>
             </div>
          </section>

          {/* SECCIÓN 7: PAQUETES (El Inventario) */}
          <section className="max-w-7xl mx-auto mb-32">
            <SectionHeader
                title="Elige tu Capital Semilla"
                subtitle="Para iniciar un negocio de distribución, necesitas inventario. Elige con qué velocidad quieres arrancar."
            />

            <div className="grid md:grid-cols-3 gap-6 items-end">
                <PackageCard
                    level="Nivel 1"
                    title="Explorador"
                    priceUSD="200"
                    priceCOP="900.000"
                    features={[
                        "Inventario personal básico",
                        "Acceso NEXUS Lite",
                        "Oficina Virtual",
                        "Ganancia al 20%"
                    ]}
                />
                <PackageCard
                    level="Nivel 2"
                    title="Constructor"
                    priceUSD="500"
                    priceCOP="2.250.000"
                    isPopular={true}
                    bonus="4 Meses de Rango Oro"
                    features={[
                        "Inventario comercial",
                        "Acceso NEXUS PRO",
                        "Mentoría Grupal",
                        "Ganancia al 50%"
                    ]}
                />
                <PackageCard
                    level="Nivel 3"
                    title="Empresario"
                    priceUSD="1,000"
                    priceCOP="4.500.000"
                    bonus="6 Meses de Rango Platino"
                    features={[
                        "Inventario máximo potencial",
                        "Acceso NEXUS VIP",
                        "Mentoría Diamante 1 a 1",
                        "Ganancia al 100% (Ilimitada)"
                    ]}
                />
            </div>
            <p className="text-center text-slate-500 text-sm mt-8 max-w-2xl mx-auto">
                * El pago se realiza directamente a las cuentas bancarias de Gano Excel S.A. garantizando total legalidad. Tú recibes producto físico a cambio de cada centavo.
            </p>
          </section>

          {/* CTA FINAL */}
          <section className="text-center pb-20">
             <div className="max-w-3xl mx-auto">
                 <h2 className="text-4xl font-bold text-white mb-8">El Sistema está listo. <br/>Solo faltas tú.</h2>
                 <p className="text-slate-400 text-xl mb-10">
                     No dejes que el miedo te robe la oportunidad de tener un activo que trabaje por ti.
                 </p>
                 <Link href="/fundadores" className="btn-primary px-10 py-5 rounded-full text-xl font-bold inline-flex items-center gap-3 shadow-lg hover:shadow-purple-500/50 transition-all">
                    Activar mi Código <ArrowRight />
                 </Link>
             </div>
          </section>

        </main>
      </div>
    </>
  );
}
