/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Versión Optimizada: Estrategia "Nexus Protagonista" & "Método Conquista"
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, ShieldCheck, Zap, Award, Video, Rocket, Crown, Heart, Target, Clock, TrendingUp, Users, Sparkles, ChevronDown, Play, Package, Cpu, Globe, Smartphone } from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'

// --- Estilos CSS Globales ---
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --creatuactivo-blue: #1E40AF;
      --creatuactivo-purple: #7C3AED;
      --creatuactivo-gold: #F59E0B;
    }
    .creatuactivo-h1-ecosystem {
      font-weight: 800;
      background: linear-gradient(135deg, #FFFFFF 0%, #93C5FD 50%, #A78BFA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.1;
      letter-spacing: -0.03em;
    }
    .creatuactivo-h2-component {
        font-weight: 700;
        background: linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .creatuactivo-h2-gradient {
        font-weight: 700;
        background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F472B6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .creatuactivo-component-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.15);
      border-radius: 20px;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }
    .creatuactivo-component-card:hover {
      transform: translateY(-5px);
      border-color: rgba(96, 165, 250, 0.4);
      box-shadow: 0 20px 60px rgba(30, 64, 175, 0.15);
    }
    .creatuactivo-highlight-card {
        background: linear-gradient(135deg, rgba(30, 64, 175, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%);
        border: 1px solid rgba(147, 197, 253, 0.3);
    }
    .creatuactivo-cta-ecosystem {
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 100%);
      border-radius: 12px;
      padding: 18px 36px;
      font-weight: 700;
      color: white;
      transition: all 0.3s ease;
      box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
    }
    .creatuactivo-cta-ecosystem:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(30, 64, 175, 0.6);
      filter: brightness(1.1);
    }
    .creatuactivo-faq-item {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%);
      border: 1px solid rgba(124, 58, 237, 0.15);
      border-radius: 12px;
      transition: all 0.3s ease;
    }
    .creatuactivo-faq-item:hover {
      border-color: rgba(147, 197, 253, 0.3);
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.12) 0%, rgba(124, 58, 237, 0.12) 100%);
    }
    /* Animación sutil para el fondo */
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.1; }
      50% { opacity: 0.2; }
    }
    .animate-pulse-slow {
      animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `}</style>
);

// --- Componentes ---
const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
    <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">{title}</h2>
    <p className="text-slate-400 text-lg leading-relaxed">{subtitle}</p>
  </div>
);

const ContrastColumn = ({ title, items, color }: { title: string, items: string[], color: 'old' | 'new' }) => (
  <div className={`p-6 rounded-2xl ${color === 'old' ? 'bg-slate-800/30 border border-slate-700/50' : 'creatuactivo-component-card creatuactivo-highlight-card'}`}>
    <div className="flex items-center justify-between mb-6">
      <h3 className={`text-2xl font-bold ${color === 'old' ? 'text-slate-400' : 'text-blue-400'}`}>
        {title}
      </h3>
      {color === 'new' && <Cpu className="text-purple-400 w-6 h-6" />}
    </div>
    <ul className="space-y-4">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <span className={`text-xl font-bold mt-1 ${color === 'old' ? 'text-slate-600' : 'text-green-400'}`}>
            {color === 'old' ? '✗' : '✓'}
          </span>
          <span className={`text-base ${color === 'old' ? 'text-slate-500' : 'text-slate-200'}`}>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const HOWPillar = ({ icon, title, description, highlight }: { icon: React.ReactNode, title: string, description: string, highlight?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className={`p-8 rounded-2xl h-full flex flex-col ${highlight ? 'creatuactivo-component-card border-blue-400/30' : 'bg-slate-800/30 border border-slate-700/50'}`}
  >
    <div className={`inline-block p-3 rounded-xl mb-5 w-fit ${highlight ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/30 text-slate-400'}`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm flex-grow">{description}</p>
  </motion.div>
);

const TestimonialMicro = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/50 p-6 rounded-2xl max-w-2xl mx-auto shadow-xl"
  >
    <p className="text-slate-300 italic mb-4 text-center text-lg">"{quote}"</p>
    <div className="flex justify-center items-center gap-2">
      <div className="h-1 w-8 bg-blue-500 rounded-full"></div>
      <p className="text-sm">
        <span className="font-semibold text-white">{author}</span>
        <span className="text-slate-500"> — {role}</span>
      </p>
      <div className="h-1 w-8 bg-blue-500 rounded-full"></div>
    </div>
  </motion.div>
);

const PackageCard = ({
  title,
  priceUSD,
  priceCOP,
  purpose,
  features,
  bonusMonths,
  bonusPlan,
  bonusIcon,
  ctaText = "Activar Plan",
  isPopular
}: {
  title: string
  priceUSD: string
  priceCOP: string
  purpose: string
  features: string[]
  bonusMonths: number
  bonusPlan: string
  bonusIcon: React.ReactNode
  ctaText?: string
  isPopular?: boolean
}) => (
  <div className={`h-full flex flex-col rounded-2xl relative overflow-hidden transition-all duration-300 ${isPopular ? 'creatuactivo-component-card border-purple-500/40 transform lg:-translate-y-4 shadow-2xl z-10' : 'bg-slate-900/50 border border-slate-700/50'}`}>

    {isPopular && (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold text-center py-1 absolute top-0 left-0 w-full uppercase tracking-wider">
        Más Elegido por Fundadores
      </div>
    )}

    <div className={`p-8 flex-grow flex flex-col ${isPopular ? 'pt-10' : ''}`}>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-white">${priceUSD}</span>
          <span className="text-slate-400 font-medium">USD</span>
        </div>
        <p className="text-sm text-slate-500">~ ${priceCOP} COP (Pago Único)</p>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-white/5">
        <div className="flex items-start gap-3">
           <div className="text-purple-400 mt-0.5">{bonusIcon}</div>
           <div>
             <p className="text-sm font-bold text-white">Tecnología Incluida (Valor $0)</p>
             <p className="text-xs text-slate-400 mt-1">
               Tu acceso a <b>NEXUS & Ecosistema</b> está bonificado al 100% por pertenecer al equipo.
             </p>
           </div>
        </div>
      </div>

      <ul className="space-y-3 text-slate-300 flex-grow mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${isPopular ? 'text-green-400' : 'text-slate-500'}`} />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/fundadores"
        className={`w-full text-center font-semibold py-4 px-6 rounded-xl transition-all duration-300 mt-auto ${isPopular
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-purple-500/25'
            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'
        }`}
      >
        {ctaText}
      </Link>
    </div>
  </div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Función simple para resaltar negritas en el texto markdown
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
        if (!line) return <div key={i} className="h-2" />;
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
            <p key={i} className="mb-2 text-slate-300 leading-relaxed text-sm lg:text-base">
                {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <span key={j} className="text-white font-bold">{part.replace(/\*\*/g, '')}</span>;
                    }
                    return part;
                })}
            </p>
        );
    });
  };

  return (
    <div className="creatuactivo-faq-item">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 text-left flex items-center justify-between"
      >
        <h3 className="text-base lg:text-lg font-bold text-white pr-4">{question}</h3>
        <ChevronDown className={`w-5 h-5 text-blue-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-5 pb-5"
        >
            {formatText(answer)}
        </motion.div>
      )}
    </div>
  );
};

// --- Componente Principal ---
export default function PresentacionEmpresarialPage() {
  const [teamSize, setTeamSize] = useState(100);
  const [monthlyIncomeUSD, setMonthlyIncomeUSD] = useState(0);
  const [monthlyIncomeCOP, setMonthlyIncomeCOP] = useState(0);

  // Calculadora lógica
  useEffect(() => {
    // Estimación conservadora basada en consumo promedio
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
      <div className="bg-slate-950 text-white min-h-screen font-sans selection:bg-purple-500/30">
        <StrategicNavigation />

        {/* Background Effects */}
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-[var(--creatuactivo-blue)] opacity-[0.08] rounded-full filter blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[var(--creatuactivo-purple)] opacity-[0.08] rounded-full filter blur-[100px] animate-pulse-slow animation-delay-2000"></div>
        </div>

        <main className="relative z-10 pt-24 lg:pt-32 pb-20 px-4">

          {/* SECCIÓN 1: HERO (Analogía Waze/Netflix) */}
          <section className="text-center max-w-5xl mx-auto mb-20 lg:mb-32">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 text-sm">
                  📀 Antes: Alquilar Películas
                </span>
                <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-semibold flex items-center gap-2">
                  <Play size={14} className="fill-current"/> Hoy: Streaming
                </span>
              </div>

              <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight">
                Hacerlo difícil ya pasó de moda.<br />
                <span className="text-white">Deja que la tecnología trabaje.</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Pasamos de los mapas de papel a Waze. Pasamos de vender puerta a puerta a <b>CreaTuActivo.</b>
                <br/>
                La primera plataforma que construye tu activo mientras tú vives tu vida.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link href="#como-funciona" className="creatuactivo-cta-ecosystem w-full sm:w-auto text-lg inline-flex items-center justify-center">
                  Ver la Tecnología <ArrowRight size={20} className="ml-2" />
                </Link>
                <Link href="#calculadora" className="px-8 py-4 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors w-full sm:w-auto text-slate-300">
                  ¿Cuánto puedo ganar?
                </Link>
              </div>

              {/* NEXUS DEMO MOCKUP (Concepto Visual) */}
              <div className="creatuactivo-component-card max-w-3xl mx-auto p-1 rounded-2xl border-t border-white/10 shadow-2xl">
                 <div className="bg-slate-900/90 rounded-xl p-6 md:p-8 text-left">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-white">NEXUS IA</p>
                            <p className="text-xs text-green-400 flex items-center gap-1">● Trabajando ahora mismo</p>
                        </div>
                    </div>
                    <div className="space-y-4 font-mono text-sm">
                        <div className="bg-slate-800/50 p-3 rounded-lg rounded-tl-none inline-block max-w-[85%] text-slate-300">
                           <span className="text-purple-400 font-bold">NEXUS:</span> He detectado 3 nuevos interesados en Bogotá mientras dormías. Ya les expliqué el modelo de negocio.
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-lg rounded-tl-none inline-block max-w-[85%] text-slate-300">
                           <span className="text-purple-400 font-bold">NEXUS:</span> ¿Deseas que agende una videollamada solo con los 2 que están listos para iniciar?
                        </div>
                        <div className="flex justify-end">
                            <div className="bg-blue-600/20 border border-blue-500/50 p-3 rounded-lg rounded-tr-none inline-block text-blue-200">
                                Sí, por favor. Encárgate del resto.
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
              <p className="mt-4 text-xs text-slate-500 uppercase tracking-widest">
                Tu sistema operativo de distribución
              </p>

            </motion.div>
          </section>

          {/* Testimonio 1 */}
          <section className="mb-24">
             <TestimonialMicro
                quote="Yo no sé vender y me daba terror cobrarle a mis amigos. Cuando vi que Nexus hacía esa parte 'incómoda' por mí, supe que este negocio sí lo podía hacer."
                author="Andrés R."
                role="Ingeniero & Fundador"
             />
          </section>

          {/* SECCIÓN 2: EL PROBLEMA VS LA SOLUCIÓN */}
          <section className="max-w-6xl mx-auto mb-24 lg:mb-32">
            <SectionHeader
                title="El Juego Cambió"
                subtitle="El mundo se divide en dos: los que siguen operando manual y los que construyen sistemas."
            />

            <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
                <ContrastColumn
                    title="La Forma Antigua"
                    color="old"
                    items={[
                        "Perseguir amigos y familiares",
                        "Explicar el negocio 100 veces",
                        "Manejar inventario y cobros",
                        "Si tú no estás, el negocio para",
                        "Estrés y rechazo constante"
                    ]}
                />
                <ContrastColumn
                    title="El Ecosistema (Tu Activo)"
                    color="new"
                    items={[
                        "Los interesados llegan a ti (Atracción)",
                        "NEXUS explica el negocio perfecto siempre",
                        "El corporativo maneja la logística",
                        "El sistema trabaja 24/7",
                        "Certeza y crecimiento inteligente"
                    ]}
                />
            </div>
          </section>

          {/* SECCIÓN 3: LA TRIADA DE PODER (HOW) */}
          <section id="como-funciona" className="max-w-7xl mx-auto mb-24 lg:mb-32">
             <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Tu Equipo de 3 Partes</h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Para ganar en grande, no necesitas hacerlo todo. Necesitas las alianzas correctas.
                </p>
             </div>

             <div className="grid md:grid-cols-3 gap-6">
                <HOWPillar
                    icon={<Users size={32} />}
                    title="1. TÚ (La Visión)"
                    description="Tu único trabajo es conectar personas con una oportunidad. No tienes que convencer, solo invitar a conocer. Tú pones la dirección y el liderazgo."
                />
                <HOWPillar
                    highlight={true}
                    icon={<Cpu size={32} />}
                    title="2. NEXUS (El Trabajo)"
                    description="Nuestra IA exclusiva. Se encarga de educar, filtrar, responder dudas y detectar quién está listo. Hace el trabajo pesado y repetitivo por ti."
                />
                <HOWPillar
                    icon={<Globe size={32} />}
                    title="3. EL GIGANTE (La Logística)"
                    description="Gano Excel. Un monstruo corporativo libre de deudas. Ellos ponen el producto, las bodegas, la importación y te pagan. Tú no tocas una caja."
                />
             </div>
          </section>

          {/* SECCIÓN 4: PROYECCIÓN (CALCULADORA) */}
          <section id="calculadora" className="max-w-5xl mx-auto mb-24 lg:mb-32 bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
             <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase mb-4">
                    <TrendingUp size={14} /> Proyección Financiera
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">No es Magia, es Matemática</h2>
                <p className="text-slate-400">
                    Esto pasa cuando combinas un producto de consumo masivo (café) con un sistema de retención.
                </p>
             </div>

             <div className="creatuactivo-component-card p-8 lg:p-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                    <div className="flex-1">
                        <label className="block text-slate-300 font-medium mb-4">
                            Si tu red de consumo crece a...
                        </label>
                        <div className="flex items-center gap-4">
                            <Users className="text-slate-500" size={24} />
                            <input
                              type="range"
                              min="10"
                              max="1000"
                              step="10"
                              value={teamSize}
                              onChange={(e) => setTeamSize(Number(e.target.value))}
                              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <span className="text-2xl font-bold text-white w-20 text-right">{teamSize}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Personas consumiendo café saludable</p>
                    </div>

                    <div className="h-px md:h-24 w-full md:w-px bg-slate-700/50"></div>

                    <div className="flex-1 text-center md:text-right">
                        <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-2">Tu Ingreso Residual Mensual</p>
                        <div className="text-5xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            ${monthlyIncomeUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            <span className="text-lg text-slate-500 font-medium ml-1">USD</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                            ~ ${monthlyIncomeCOP.toLocaleString('es-CO', { maximumFractionDigits: 0 })} COP
                        </p>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-white/5">
                    <p className="text-sm text-slate-300">
                        <span className="text-amber-400 font-bold">Dato Clave:</span> A diferencia de vender ropa o seguros, el café se acaba. La gente vuelve a comprar.
                        Tu "trabajo" se hace una vez, la recompra es automática.
                    </p>
                </div>
             </div>
          </section>

          {/* SECCIÓN 5: PAQUETES (REFRAMING: SOCIOS, NO COMPRADORES) */}
          <section className="max-w-7xl mx-auto mb-24 lg:mb-32">
            <SectionHeader
                title="Elige tu Nivel de Compromiso"
                subtitle="No estás comprando un curso. Estás adquiriendo inventario para tu negocio y recibiendo la tecnología GRATIS como socio."
            />

            <div className="grid md:grid-cols-3 gap-6 items-start pt-8">
                <PackageCard
                    title="Paquete 1: Explorador"
                    priceUSD="200"
                    priceCOP="900.000"
                    purpose="Ideal para conocer el producto y probar el sistema."
                    features={[
                        "Inventario personal básico",
                        "Acceso a NEXUS (Versión Lite)",
                        "Oficina Virtual Gano Excel",
                        "Plan de Pagos: 20%"
                    ]}
                    bonusMonths={0}
                    bonusPlan=""
                    bonusIcon={<Zap size={20} />}
                />

                <PackageCard
                    title="Paquete 2: Constructor"
                    priceUSD="500"
                    priceCOP="2.250.000"
                    purpose="Para quienes van a construir equipo desde el primer mes."
                    features={[
                        "Inventario comercial",
                        "Acceso NEXUS PRO (Completo)",
                        "Mentoría Grupal",
                        "Plan de Pagos: 50%"
                    ]}
                    bonusMonths={0}
                    bonusPlan=""
                    bonusIcon={<Rocket size={20} />}
                    isPopular={true}
                    ctaText="Elegir Opción Recomendada"
                />

                <PackageCard
                    title="Paquete 3: Empresario"
                    priceUSD="1,000"
                    priceCOP="4.500.000"
                    purpose="Máxima rentabilidad desde el día 1. Para visión a largo plazo."
                    features={[
                        "Inventario de alto volumen",
                        "Acceso NEXUS VIP (Prioritario)",
                        "Mentoría Directa con Diamantes",
                        "Plan de Pagos: 100% (Ilimitado)"
                    ]}
                    bonusMonths={0}
                    bonusPlan=""
                    bonusIcon={<Crown size={20} />}
                />
            </div>

            <p className="text-center text-sm text-slate-500 mt-8 max-w-2xl mx-auto">
                * El valor en USD es aproximado. El pago se realiza directamente a Gano Excel Colombia S.A. garantizando total transparencia y legalidad.
            </p>
          </section>

          {/* SECCIÓN 6: FAQ (OBJECIONES REALES) */}
          <section className="max-w-3xl mx-auto mb-24 lg:mb-32">
             <h2 className="text-3xl font-bold text-center text-white mb-10">Preguntas sin Filtro</h2>
             <div className="space-y-4">
                <FAQItem
                    question="¿Necesito ser experto en tecnología?"
                    answer="**Absolutamente no.** Esa es la belleza de NEXUS. Tú no programas, tú usas. Es tan fácil como usar WhatsApp. Si sabes enviar un mensaje, sabes usar este sistema."
                />
                <FAQItem
                    question="¿Tengo que perseguir gente?"
                    answer="**Esa es la vieja escuela.** Nuestro sistema se basa en atracción, no persecución. Usamos contenido (como el que viste) para que los interesados levanten la mano. NEXUS filtra a los curiosos para que tú solo hables con quien está listo."
                />
                <FAQItem
                    question="¿Qué pasa si no tengo tiempo?"
                    answer="Precisamente por eso necesitas un **Activo**. Si no tienes tiempo hoy, es porque tu ingreso depende 100% de tu presencia física. Este sistema está diseñado para construirse en tus 'horas muertas' (noches, fines de semana) hasta que el ingreso del sistema supere tu sueldo y recuperes tu libertad."
                />
                <FAQItem
                    question="¿Es legal?"
                    answer="**100%.** Gano Excel es Gran Contribuyente de la DIAN en Colombia, cumple la Ley 1700 y tiene sedes físicas. No captamos dinero; tú compras un producto físico real. Nosotros te damos la estrategia y la tecnología para mover ese producto masivamente."
                />
             </div>
          </section>

          {/* SECCIÓN 7: CTA FINAL */}
          <section className="text-center py-20 border-t border-slate-800">
            <div className="max-w-4xl mx-auto">
                <h2 className="creatuactivo-h2-gradient text-4xl md:text-6xl font-bold mb-8">
                  Lo difícil ya está hecho.
                </h2>
                <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                   Tienes el vehículo (Gano Excel), tienes el piloto automático (NEXUS) y tienes el equipo.
                   <br/>Solo falta que te subas.
                </p>

                <Link href="/fundadores" className="creatuactivo-cta-ecosystem text-xl inline-flex items-center hover:scale-105 transform transition-transform">
                  Activar mi Código y Recibir NEXUS <ArrowRight size={24} className="ml-2" />
                </Link>
                <p className="mt-6 text-slate-500 text-sm">
                   Garantía de Satisfacción: Si el equipo no te convence en 30 días, te quedas con el producto y amigos como siempre.
                </p>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}
