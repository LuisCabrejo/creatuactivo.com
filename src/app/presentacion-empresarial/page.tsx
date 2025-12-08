/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Zap, Video, Rocket, Crown, Clock, TrendingUp, Users, Sparkles, ChevronDown, Globe, Cpu, Database } from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'
import AnimatedChatDemo from '@/components/AnimatedChatDemo'
import { AnimatedStatCard } from '@/components/AnimatedCountUp'
import AnimatedValueStack from '@/components/AnimatedValueStack'
import AnimatedTimeline from '@/components/AnimatedTimeline'
import IncomeComparisonAnimation from '@/components/IncomeComparisonAnimation'

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
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 50%, var(--creatuactivo-gold) 100%);
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
    .text-gradient-gold {
      background: linear-gradient(135deg, #FBBF24 0%, #D97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }
    .creatuactivo-component-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }
    .creatuactivo-component-card:hover {
      transform: translateY(-8px);
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2);
    }
    .creatuactivo-why-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.12) 0%, rgba(124, 58, 237, 0.12) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
    }
    .creatuactivo-why-card:hover {
      transform: translateY(-8px);
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2);
    }
    .creatuactivo-contrast-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 16px;
      transition: all 0.4s ease;
    }
    .creatuactivo-contrast-card:hover {
      transform: translateY(-8px);
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2);
    }
    .creatuactivo-package-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
      position: relative;
    }
    .creatuactivo-package-card:hover {
      transform: translateY(-8px);
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2);
    }
    .creatuactivo-cta-ecosystem {
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 100%);
      border-radius: 16px;
      padding: 18px 36px;
      font-weight: 700;
      color: white;
      transition: all 0.3s ease;
      box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
    }
    .creatuactivo-cta-ecosystem:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(30, 64, 175, 0.5);
    }
    .creatuactivo-faq-item {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%);
      border: 1px solid rgba(124, 58, 237, 0.15);
      border-radius: 12px;
      transition: all 0.3s ease;
    }
    .creatuactivo-faq-item:hover {
      border-color: rgba(245, 158, 11, 0.3);
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.12) 0%, rgba(124, 58, 237, 0.12) 100%);
    }
  `}</style>
);

// --- Componentes ---
const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
    <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">{title}</h2>
    <p className="text-slate-400 text-lg">{subtitle}</p>
  </div>
);

const TriadCard = ({ icon, title, role, description, color }: { icon: React.ReactNode, title: string, role: string, description: string, color: string }) => (
  <div className="creatuactivo-component-card p-8 rounded-2xl relative overflow-hidden group h-full">
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

const PackageCard = ({
  title,
  priceUSD,
  priceCOP,
  features,
  bonusMonths,
  bonusPlan,
  bonusIcon,
  ctaText = "Activar Plan"
}: {
  title: string
  priceUSD: string
  priceCOP: string
  features: string[]
  bonusMonths: number
  bonusPlan: string
  bonusIcon: React.ReactNode
  ctaText?: string
}) => (
  <div className={`creatuactivo-package-card h-full flex flex-col`}>
    <div className="p-8 flex-grow flex flex-col">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-sm text-slate-400">Inversión inicial</span>
        <div>
          <span className="text-4xl font-extrabold text-white">${priceUSD}</span>
          <span className="text-slate-400"> USD</span>
        </div>
        <p className="text-sm text-slate-500">~ ${priceCOP} COP</p>
      </div>

      <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <div className="text-yellow-400">{bonusIcon}</div>
          <div>
            <p className="font-bold text-white text-sm">Bono Tecnológico Incluido</p>
            <p className="text-xs text-slate-300">
              <span className="font-semibold">{bonusMonths} Meses de Cortesía</span> del <span className="font-semibold">{bonusPlan}</span>
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 font-semibold mb-3">LO QUE RECIBES:</p>
      <ul className="space-y-3 text-slate-300 flex-grow mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/fundadores"
        className="w-full text-center font-semibold py-3 px-5 rounded-lg transition-colors duration-300 mt-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
      >
        {ctaText}
      </Link>
    </div>
  </div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to parse simple markdown-like formatting with keyword highlighting
  const parseAnswer = (text: string) => {
    // Keywords to highlight in amber/gold
    const keywords = ['FALLAR', 'TODOS', 'QUIENES YA CREEN', 'CONVENCER ESCÉPTICOS', 'ENCONTRAR believers', 'VERIFICA', 'PREGUNTA REAL', 'VERDAD', 'LA VENTAJA', 'TU TRABAJO', 'MERECEN', 'TIEMPO', 'LIBERTAD'];

    const highlightKeywords = (content: string) => {
      let result = content;
      const parts: Array<{text: string, isKeyword: boolean}> = [];
      let remaining = content;

      // Find all keyword matches
      const matches: Array<{word: string, index: number}> = [];
      keywords.forEach(keyword => {
        let index = remaining.toUpperCase().indexOf(keyword.toUpperCase());
        while (index !== -1) {
          matches.push({word: keyword, index});
          index = remaining.toUpperCase().indexOf(keyword.toUpperCase(), index + 1);
        }
      });

      if (matches.length === 0) return content;

      // Sort by index
      matches.sort((a, b) => a.index - b.index);

      let lastIndex = 0;
      const elements: JSX.Element[] = [];

      matches.forEach((match, i) => {
        if (match.index > lastIndex) {
          elements.push(<span key={`text-${i}`}>{remaining.substring(lastIndex, match.index)}</span>);
        }
        elements.push(
          <span key={`keyword-${i}`} className="text-amber-400 font-semibold">
            {remaining.substring(match.index, match.index + match.word.length)}
          </span>
        );
        lastIndex = match.index + match.word.length;
      });

      if (lastIndex < remaining.length) {
        elements.push(<span key="text-end">{remaining.substring(lastIndex)}</span>);
      }

      return elements.length > 0 ? <>{elements}</> : content;
    };

    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Check if line is bold (wrapped in **)
      if (line.match(/^\*\*.*\*\*$/)) {
        const content = line.replace(/^\*\*/, '').replace(/\*\*$/, '');
        return <p key={index} className="font-bold text-white mb-2">{highlightKeywords(content)}</p>;
      }
      // Check if line contains inline bold
      if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={index} className="text-slate-300 leading-relaxed mb-2">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                const boldContent = part.replace(/\*\*/g, '');
                return <span key={i} className="font-bold text-white">{highlightKeywords(boldContent)}</span>;
              }
              return <span key={i}>{highlightKeywords(part)}</span>;
            })}
          </p>
        );
      }
      // Check if line is a bullet point
      if (line.startsWith('• ')) {
        const content = line.substring(2);
        // Check if bullet contains bold
        if (content.includes('**')) {
          const parts = content.split(/(\*\*.*?\*\*)/g);
          return (
            <li key={index} className="ml-6 mb-2 text-slate-300">
              {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  const boldContent = part.replace(/\*\*/g, '');
                  return <span key={i} className="font-bold text-white">{highlightKeywords(boldContent)}</span>;
                }
                return <span key={i}>{highlightKeywords(part)}</span>;
              })}
            </li>
          );
        }
        return <li key={index} className="ml-6 mb-2 text-slate-300">{highlightKeywords(content)}</li>;
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      }
      // Regular line
      return <p key={index} className="text-slate-300 leading-relaxed mb-2">{highlightKeywords(line)}</p>;
    });
  };

  return (
    <div className="creatuactivo-faq-item">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between"
      >
        <h3 className="text-lg font-bold text-white pr-4">{question}</h3>
        <ChevronDown
          className={`w-6 h-6 text-blue-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-6"
        >
          <div className="space-y-1">
            {parseAnswer(answer)}
          </div>
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
  const [selectedPackage, setSelectedPackage] = useState('ESP3');
  const [packageCount, setPackageCount] = useState(1);
  const [fastStartBonusUSD, setFastStartBonusUSD] = useState(0);
  const [fastStartBonusCOP, setFastStartBonusCOP] = useState(0);

  const packageData: Record<string, { bonus: number }> = {
    'ESP1': { bonus: 25 },
    'ESP2': { bonus: 75 },
    'ESP3': { bonus: 150 },
  };

  useEffect(() => {
    const incomePerPersonCOP = 19125;
    const exchangeRate = 4500;
    const totalIncomeCOP = teamSize * incomePerPersonCOP;
    const totalIncomeUSD = totalIncomeCOP / exchangeRate;
    setMonthlyIncomeCOP(totalIncomeCOP);
    setMonthlyIncomeUSD(totalIncomeUSD);
  }, [teamSize]);

  useEffect(() => {
    const exchangeRate = 4500;
    const bonusUSD = packageData[selectedPackage].bonus * packageCount;
    const bonusCOP = bonusUSD * exchangeRate;
    setFastStartBonusUSD(bonusUSD);
    setFastStartBonusCOP(bonusCOP);
  }, [selectedPackage, packageCount]);

  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-900 text-white">
        <StrategicNavigation />

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-[var(--creatuactivo-blue)] opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-[var(--creatuactivo-purple)] opacity-10 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        <main className="relative z-10 pt-28 pb-20 px-4 lg:px-8">
          {/* SECCIÓN 1: HERO (Analogía Waze/Netflix) */}
          <section className="max-w-6xl mx-auto mb-24 lg:mb-32">
             <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Evolución Tecnológica
                    </div>

                    <h1 className="creatuactivo-h1-ecosystem text-5xl lg:text-6xl mb-6 leading-tight">
                        Construye tu Activo Digital y Genera Ingreso Residual
                    </h1>

                    <h2 className="text-2xl text-slate-300 mb-8 leading-relaxed font-semibold">
                        La primera oportunidad de negocio con un sistema automatizado que trabaja para ti 24/7.
                    </h2>

                    <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                        Pasamos de alquilar películas a <b>Netflix</b>. <br/>
                        Pasamos de los mapas de papel a <b>Waze</b>. <br/>
                        <span className="text-white font-semibold">Pasamos de "vender puerta a puerta" a construir Sistemas Digitales.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="#como-funciona" className="creatuactivo-cta-ecosystem px-8 py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2">
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
                    <div className="creatuactivo-component-card p-6 rounded-2xl">
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

          {/* SECCIÓN 2: ¿QUÉ ESTAMOS CONSTRUYENDO? */}
          <section id="que-construimos" className="max-w-5xl mx-auto mb-24 lg:mb-32 text-center">
             <SectionHeader
                title="¿Qué estamos construyendo?"
                subtitle="No es venta de catálogo. No es repartir café. Es Infraestructura."
             />

             <div className="creatuactivo-component-card p-8 lg:p-12 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="grid md:grid-cols-3 gap-8 text-left relative z-10">
                    <div>
                        <div className="mb-4 text-blue-400"><Globe size={32} /></div>
                        <h2 className="text-xl font-bold text-white mb-2">Distribución Masiva</h2>
                        <p className="text-slate-400 text-sm">
                            Creamos canales por donde fluyen millones de dólares en productos de consumo diario en toda América.
                        </p>
                    </div>
                    <div>
                        <div className="mb-4 text-purple-400"><Database size={32} /></div>
                        <h2 className="text-xl font-bold text-white mb-2">Activo Digital</h2>
                        <p className="text-slate-400 text-sm">
                            El mercado que construyes queda codificado a tu nombre. Es tuyo. Heredable y vitalicio.
                        </p>
                    </div>
                    <div>
                        <div className="mb-4 text-green-400"><TrendingUp size={32} /></div>
                        <h2 className="text-xl font-bold text-white mb-2">Ingreso Residual</h2>
                        <p className="text-slate-400 text-sm">
                            Haces el trabajo bien una vez (construir la red), y cobras cada vez que alguien se toma un café.
                        </p>
                    </div>
                </div>
             </div>
          </section>

          {/* SECCIÓN 3: NEXUS - Tu Socio Digital */}
          <section className="max-w-6xl mx-auto mb-24 lg:mb-32">
             <div className="grid lg:grid-cols-2 gap-12 items-center">
                 {/* Demo Chat UI - ANIMADO */}
                 <div className="order-2 lg:order-1">
                    <AnimatedChatDemo
                      typingSpeed={20}
                      loopDelay={5000}
                    />
                 </div>

                 <div className="order-1 lg:order-2">
                    <div className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                        Tu Socio Digital
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                        Tú vives tu vida. <span className="text-gradient-gold">Nexus construye tu negocio.</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-8">
                        La razón #1 por la que la gente no emprende es miedo a 'no saber hacerlo'. Nexus elimina ese miedo.
                    </p>
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
          <section id="como-funciona" className="max-w-7xl mx-auto mb-24 lg:mb-32">
             <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                  No estás solo. Tienes <span className="text-gradient-gold">3 Gigantes.</span>
                </h2>
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
                    title="2. CreaTuActivo"
                    role="La Ejecución"
                    description="Tu plataforma tecnológica completa. NEXUS (IA exclusiva) educa, filtra y cualifica. Se encarga de hacer el trabajo pesado y técnico por ti mientras tú vives tu vida."
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

          {/* SECCIÓN 5: LA OFERTA IRRESISTIBLE (Value Stack Animado) */}
          <AnimatedValueStack />

          {/* SECCIÓN 5.5: Timeline de Urgencia */}
          <AnimatedTimeline />

          {/* SECCIÓN 6: Proof - Prueba Social */}
          <section className="py-20 lg:py-28 px-4">
            <div className="max-w-7xl mx-auto">
              <SectionHeader
                title="Construido Sobre Base Sólida"
                subtitle="Esto no nace en el vacío. Es el resultado de años de prueba y respaldo corporativo."
              />

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <AnimatedStatCard
                  value={12}
                  suffix=" Años"
                  label="de Liderazgo Probado"
                  sublabel="2,847 personas exitosas sin tecnología"
                  duration={2}
                  delay={0}
                />
                <AnimatedStatCard
                  value={30}
                  suffix="+ Años"
                  label="de Respaldo Corporativo"
                  sublabel="Gano Excel, 100% libre de deudas"
                  duration={2}
                  delay={200}
                />
                <AnimatedStatCard
                  value={80}
                  suffix="%"
                  label="del Trabajo Automatizado"
                  sublabel="Sistema NEXUS con IA trabajando 24/7"
                  duration={2}
                  delay={400}
                />
              </div>

              {/* Testimonio Principal */}
              <div className="max-w-4xl mx-auto">
                <div className="creatuactivo-component-card p-8 lg:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <img
                      className="h-40 w-40 object-cover rounded-full mx-auto md:mx-0 md:flex-shrink-0 border-4 border-purple-500/50"
                      src="https://4millones.com/wp-content/uploads/2025/07/liliana-patricia-moreno-diamante-gano-excel.webp"
                      alt="Foto de Liliana Patricia Moreno"
                    />
                    <div className="text-left">
                      <p className="text-slate-300 text-lg lg:text-xl italic leading-relaxed mb-6">
                        "Descubrí que esto no es solo un negocio; es un vehículo para transformar tu realidad. Una decisión puede cambiarlo todo. Aquí encontré lo necesario para cumplir mis sueños."
                      </p>
                      <p className="font-bold text-white text-xl">Liliana Patricia Moreno</p>
                      <p className="text-purple-400 font-semibold mb-4">Líder Diamante</p>
                      <a
                        href="https://www.facebook.com/share/v/17CLotD3R2/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-purple-500/20 text-purple-300 font-bold py-3 px-6 rounded-lg hover:bg-purple-500/30 transition-colors"
                      >
                        <Video className="w-5 h-5 mr-2" />
                        Ver su Historia Completa
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 7: WHAT - Visualiza Tu Libertad */}
          <section id="visualiza-resultados" className="max-w-5xl mx-auto mb-24 lg:mb-32 bg-slate-900/50 px-8 py-12 rounded-3xl border border-slate-800">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase mb-4">
                <TrendingUp size={14} /> Proyección Financiera
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                El Poder del <span className="text-gradient-gold">Residual</span>
              </h2>
              <p className="text-slate-400">
                Si Nexus te ayuda a construir una comunidad de consumo, esto pasa:
              </p>
            </div>

            <div className="max-w-4xl mx-auto mb-12 p-6 bg-blue-500/5 border border-blue-500/20 rounded-xl">
              <p className="text-lg text-slate-200 leading-relaxed text-center">
                Existen 12 formas de ganar. Para este ejemplo, te mostramos 2 de ellas:
                <br />
                <span className="text-blue-300 font-semibold">Bonos por paquetes empresariales</span> (ingreso activo) y <span className="text-blue-300 font-semibold">Bonos semanales por consumo</span> (ingreso residual).
              </p>
            </div>

            <div className="max-w-7xl mx-auto">

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Calculadora Capitalización */}
                <div className="creatuactivo-component-card p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="text-blue-400" size={28} />
                    <h3 className="text-xl font-bold text-white">Bonos por Paquetes Empresariales</h3>
                  </div>
                  <p className="text-slate-400 mb-6 text-sm">
                    Cuando personas en tu equipo adquieren paquetes empresariales, ganas bonos inmediatos (ingreso activo).
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">1. Tipo de Paquete</label>
                    <div className="flex rounded-lg bg-slate-900/50 p-1">
                      <button
                        onClick={() => setSelectedPackage('ESP1')}
                        className={`w-1/3 p-2 text-sm rounded-md transition ${selectedPackage === 'ESP1' ? 'bg-[var(--creatuactivo-blue)] text-white' : 'text-slate-300'}`}
                      >
                        Inicial
                      </button>
                      <button
                        onClick={() => setSelectedPackage('ESP2')}
                        className={`w-1/3 p-2 text-sm rounded-md transition ${selectedPackage === 'ESP2' ? 'bg-[var(--creatuactivo-blue)] text-white' : 'text-slate-300'}`}
                      >
                        Empresarial
                      </button>
                      <button
                        onClick={() => setSelectedPackage('ESP3')}
                        className={`w-1/3 p-2 text-sm rounded-md transition ${selectedPackage === 'ESP3' ? 'bg-[var(--creatuactivo-purple)] text-white' : 'text-slate-300'}`}
                      >
                        Visionario
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="packageSlider" className="block text-center text-slate-300 mb-2 text-sm">
                      2. Número de Personas: <span className="font-bold text-white text-lg">{packageCount}</span>
                    </label>
                    <input
                      type="range"
                      id="packageSlider"
                      min="1"
                      max="10"
                      value={packageCount}
                      onChange={(e) => setPackageCount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="bg-blue-900/30 border border-blue-500/30 p-6 rounded-xl text-center">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Bono Inmediato</p>
                    <p className="text-4xl font-extrabold text-blue-400 mb-1">
                      ${fastStartBonusUSD.toLocaleString('en-US')} USD
                    </p>
                    <p className="text-xs text-slate-500">(~ ${fastStartBonusCOP.toLocaleString('es-CO')} COP)</p>
                  </div>
                </div>

                {/* Calculadora Residual */}
                <div className="creatuactivo-component-card p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="text-green-400" size={28} />
                    <h3 className="text-xl font-bold text-white">Bonos Semanales por Consumo</h3>
                  </div>
                  <p className="text-slate-400 mb-6 text-sm">
                    Ganas de manera recurrente cada vez que hay compras en tu sistema de distribución (ingreso residual semanal).
                  </p>

                  <div className="mb-6">
                    <label htmlFor="teamSlider" className="block text-center text-slate-300 mb-2 text-sm">
                      Personas consumiendo en tu equipo: <span className="font-bold text-white text-lg">{teamSize}</span>
                    </label>
                    <input
                      type="range"
                      id="teamSlider"
                      min="10"
                      max="1000"
                      value={teamSize}
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      step="10"
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="bg-green-900/30 border border-green-500/30 p-6 rounded-xl text-center">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Bonos Semanales (Estimado Mensual)</p>
                    <p className="text-4xl font-extrabold text-green-400 mb-1">
                      ${monthlyIncomeUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
                    </p>
                    <p className="text-xs text-slate-500">
                      (~ ${monthlyIncomeCOP.toLocaleString('es-CO', { maximumFractionDigits: 0 })} COP)
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparación Visual: Ganar Dinero vs Construir Libertad */}
              <div className="mt-12">
                <IncomeComparisonAnimation />
              </div>
            </div>
          </section>

          {/* SECCIÓN 8: Paquetes Reenmarcados */}
          <section className="py-20 lg:py-28 px-4">
            <div className="max-w-7xl mx-auto">
              <SectionHeader
                title="Elige tu Capital Semilla"
                subtitle="Para iniciar un negocio de distribución, necesitas inventario. Elige con qué velocidad quieres arrancar."
              />

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                <PackageCard
                  title="Constructor Inicial"
                  priceUSD="200"
                  priceCOP="900.000"
                  features={[
                    "Todo el sistema de 3 pasos IAA automatizado",
                    "Inventario para probar el modelo",
                    "Acceso total a la plataforma completa",
                    "Comunidad de Fundadores"
                  ]}
                  bonusMonths={2}
                  bonusPlan="Plan Cimiento"
                  bonusIcon={<Zap size={20}/>}
                  ctaText="Empezar Aquí"
                />

                <PackageCard
                  title="Constructor Empresarial"
                  priceUSD="500"
                  priceCOP="2.250.000"
                  features={[
                    "Todo lo del Constructor Inicial +",
                    "Inventario para trabajar profesionalmente",
                    "Apoyo prioritario",
                    "Mentoría personalizada cada mes"
                  ]}
                  bonusMonths={4}
                  bonusPlan="Plan Estructura"
                  bonusIcon={<Rocket size={20}/>}
                  ctaText="Crecer Más Rápido"
                />

                <PackageCard
                  title="Constructor Visionario"
                  priceUSD="1,000"
                  priceCOP="4.500.000"
                  features={[
                    "Todo lo del Constructor Empresarial +",
                    "Inventario premium de máximo potencial",
                    "Apoyo VIP directo",
                    "Acceso prioritario a nuevas funciones"
                  ]}
                  bonusMonths={6}
                  bonusPlan="Plan Rascacielos"
                  bonusIcon={<Crown size={20}/>}
                  ctaText="Maximizar Desde Ya"
                />
              </div>

              <div className="mt-12 text-center max-w-2xl mx-auto p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                <p className="text-slate-300 text-sm">
                  * El pago se realiza directamente a las cuentas bancarias de Gano Excel S.A. garantizando total legalidad. Tú recibes producto físico a cambio de cada centavo.
                </p>
              </div>
            </div>
          </section>

          {/* SECCIÓN 9: FAQ Emocionales */}
          <section className="py-20 lg:py-28 px-4 bg-slate-900/50 rounded-3xl">
            <div className="max-w-4xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                  Las Preguntas Que <span className="text-gradient-gold">Realmente Importan</span>
                </h2>
                <p className="text-slate-400 text-lg">No las preguntas técnicas. Las preguntas que sientes en el corazón.</p>
              </div>

              <div className="space-y-4">
                <FAQItem
                  question="¿Tengo que salir a vender puerta a puerta?"
                  answer={`Definitivamente **No**. Ese es el modelo antiguo.

Nosotros usamos **Tecnología de Atracción**.

Tu trabajo no es perseguir, es conectar a las personas con Nexus.

La Inteligencia Artificial se encarga de explicar, vender y cerrar.

**Tú eres el dueño del sistema, no el vendedor.**`}
                />

                <FAQItem
                  question="No tengo experiencia en tecnología ni negocios. ¿Puedo hacerlo?"
                  answer={`**Sí.**

La plataforma fue diseñada bajo la premisa de **"Cero Fricción"**.

Si sabes usar WhatsApp, sabes usar este ecosistema.

Además, no estarás solo: tienes mentoría de fundadores y la guía paso a paso de Nexus.

**La tecnología cubre tu falta de experiencia.**`}
                />

                <FAQItem
                  question="¿Por qué me entregan una tecnología de $368k USD a costo cero?"
                  answer={`Porque buscamos **Socios**, no Clientes.

Nuestro negocio no es venderte software; nuestro negocio es que **tú factures masivamente** con Gano Excel.

Si a ti te va bien distribuyendo, a nosotros nos va bien.

Por eso te armamos con la mejor tecnología del mercado sin cobrarte desarrollo:

**Es nuestra inversión en tu éxito.**`}
                />

                <FAQItem
                  question="¿Es legal y seguro?"
                  answer={`**100% Blindado.**

Operamos bajo la **Ley 1700 de 2013** en Colombia.

Tu socio corporativo (Gano Excel) es **Gran Contribuyente de la DIAN** y tiene sedes físicas en toda América.

Tú no inviertes en "aire", compras un **inventario de producto físico real**, con registro INVIMA, que respalda cada centavo de tu capital.`}
                />

                <FAQItem
                  question="Tengo poco tiempo disponible. ¿Es viable?"
                  answer={`Es la razón #1 para hacer esto.

Si no tienes tiempo, es porque tu ingreso actual depende 100% de tu presencia física.

**Este sistema trabaja 24/7.**

Puedes dedicarle horas estratégicas (bien enfocadas con la IA) para construir un activo que, eventualmente, **te compre tu libertad total.**`}
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN 10: CTA Final */}
          <section className="text-center py-20 lg:py-32">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-8">
                El Sistema está listo. <br/>Solo <span className="text-gradient-gold">faltas tú.</span>
              </h2>
              <p className="text-slate-400 text-xl mb-10">
                No dejes que el miedo te robe la oportunidad de tener un activo que trabaje por ti.
              </p>
              <Link
                href="/fundadores"
                className="creatuactivo-cta-ecosystem text-xl inline-flex items-center gap-3"
              >
                Activar mi Código <ArrowRight size={24} />
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
              <p>&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
              <p className="mt-2">La primera plataforma completa para crear tu negocio en América.</p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
