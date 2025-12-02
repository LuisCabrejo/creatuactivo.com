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
import { ArrowRight, CheckCircle, ShieldCheck, Zap, Award, Video, Rocket, Crown, Heart, Target, Clock, TrendingUp, Users, Sparkles, ChevronDown, Play, Package, Globe, Cpu } from 'lucide-react'
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

const WhyCard = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="flex items-start gap-4 mb-6"
  >
    <div className="text-blue-400 flex-shrink-0 mt-1">
      {icon}
    </div>
    <p className="text-xl text-slate-200 leading-relaxed">{text}</p>
  </motion.div>
);

const ContrastColumn = ({ title, items, color }: { title: string, items: string[], color: 'old' | 'new' }) => (
  <div className="creatuactivo-contrast-card p-6">
    <h3 className={`text-2xl font-bold mb-6 ${color === 'old' ? 'text-slate-400' : 'text-blue-400'}`}>
      {title}
    </h3>
    <ul className="space-y-4">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <span className={`text-2xl ${color === 'old' ? 'text-slate-500' : 'text-green-400'}`}>
            {color === 'old' ? '✗' : '✓'}
          </span>
          <span className="text-slate-300">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const HOWPillar = ({ icon, title, porque, description, iconColor, iconBg }: { icon: React.ReactNode, title: string, porque: string, description: string, iconColor: string, iconBg: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="creatuactivo-component-card p-8"
  >
    <div className={`inline-block ${iconBg} p-4 rounded-xl mb-4`}>
      <div className={iconColor}>
        {icon}
      </div>
    </div>
    <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-blue-400 italic mb-4 text-sm">
      <span className="font-semibold">Porque creemos que</span> {porque}
    </p>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </motion.div>
);

const TestimonialMicro = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-blue-500/5 border-l-4 border-blue-500 p-6 rounded-r-xl"
  >
    <p className="text-slate-300 italic mb-3">"{quote}"</p>
    <p className="text-sm">
      <span className="font-semibold text-white">{author}</span>
      <span className="text-slate-500"> — {role}</span>
    </p>
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
  highlighted = false
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
  highlighted?: boolean
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

      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mb-6">
        <p className="text-sm text-blue-400 font-semibold mb-2">POR QUÉ ESTA OPCIÓN:</p>
        <p className="text-slate-300 text-sm italic">{purpose}</p>
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

        <main className="relative z-10 p-4 lg:p-8">
          {/* SECCIÓN 1: HERO (Analogía Waze/Netflix) */}
          <section className="text-center max-w-5xl mx-auto py-20 lg:py-32 pt-24">
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
                <Link href="#visualiza-resultados" className="px-8 py-4 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors w-full sm:w-auto text-slate-300">
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

          {/* SECCIÓN 3: TU EQUIPO DE 3 PARTES (Alineado con FAQ_COMPONENTES) */}
          <section id="como-funciona" className="max-w-7xl mx-auto mb-24 lg:mb-32">
             <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Tu Equipo de 3 Partes</h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Para ganar en grande, no necesitas hacerlo todo. Necesitas las alianzas correctas.
                </p>
             </div>

             <div className="grid md:grid-cols-3 gap-6">
                <HOWPillar
                    icon={<Globe size={40} />}
                    title="1. Gano Excel (Los Materiales)"
                    porque="necesitas un gigante sólido que maneje lo que no quieres manejar"
                    description="El gigante corporativo libre de deudas. 30+ años en el mercado. Ellos fabrican productos certificados, manejan permisos sanitarios, logística internacional y te pagan. Tú no tocas una caja."
                    iconColor="text-green-400"
                    iconBg="bg-green-500/10"
                />
                <HOWPillar
                    icon={<Cpu size={40} />}
                    title="2. CreaTuActivo.com (El Plano)"
                    porque="mereces un sistema que haga el trabajo pesado mientras tú vives tu vida"
                    description="Tu sistema automatizado. NEXUS (IA exclusiva) educa, filtra y cualifica por ti. Dashboard inteligente te dice exactamente qué hacer. El método probado con 9 años de resultados ya viene incluido."
                    iconColor="text-purple-400"
                    iconBg="bg-purple-500/10"
                />
                <HOWPillar
                    icon={<Users size={40} />}
                    title="3. Tú (El Constructor)"
                    porque="solo tú puedes poner la visión y conectar personas con esta oportunidad"
                    description="Tu único trabajo es conectar personas con la oportunidad. No tienes que convencer, solo invitar a conocer. Tú pones la visión y el liderazgo. El sistema hace el trabajo pesado."
                    iconColor="text-blue-400"
                    iconBg="bg-blue-500/10"
                />
             </div>

             <div className="mt-16 text-center max-w-3xl mx-auto">
                <p className="text-2xl text-slate-200 leading-relaxed mb-4">
                  ¿Ves cómo funciona?
                </p>
                <p className="text-xl text-slate-400 leading-relaxed">
                  Así como un edificio necesita materiales + plano + constructor, tu sistema de distribución necesita estos 3 elementos trabajando juntos.
                </p>
             </div>
          </section>

          {/* Testimonio Micro 2 */}
          <section className="max-w-3xl mx-auto my-20">
            <TestimonialMicro
              quote="Cuando abrí CreaTuActivo a las 7 AM y vi que NEXUS ya había atendido 8 conversaciones mientras yo dormía... ahí entendí. Esto no es un negocio. Es tener un equipo trabajando 24/7."
              author="María G."
              role="Fundadora"
            />
          </section>

          {/* SECCIÓN 4: Proof - Prueba Social */}
          <section className="py-20 lg:py-28 px-4">
            <div className="max-w-7xl mx-auto">
              <SectionHeader
                title="Construido Sobre Base Sólida"
                subtitle="Esto no nace en el vacío. Es el resultado de años de prueba y respaldo corporativo."
              />

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="creatuactivo-component-card p-8 text-center">
                  <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    9 Años
                  </div>
                  <p className="text-slate-400 mb-3">de Liderazgo Probado</p>
                  <p className="text-sm text-slate-500">2,847 personas exitosas sin tecnología</p>
                </div>
                <div className="creatuactivo-component-card p-8 text-center">
                  <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    30+ Años
                  </div>
                  <p className="text-slate-400 mb-3">de Respaldo Corporativo</p>
                  <p className="text-sm text-slate-500">Gano Excel, 100% libre de deudas</p>
                </div>
                <div className="creatuactivo-component-card p-8 text-center">
                  <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    80%
                  </div>
                  <p className="text-slate-400 mb-3">del Trabajo Automatizado</p>
                  <p className="text-sm text-slate-500">Sistema NEXUS con IA trabajando 24/7</p>
                </div>
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

          {/* SECCIÓN 5: WHAT - Visualiza Tu Libertad */}
          <section id="visualiza-resultados" className="max-w-5xl mx-auto mb-24 lg:mb-32 bg-slate-900/50 px-8 py-12 rounded-3xl border border-slate-800">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase mb-4">
                <TrendingUp size={14} /> Proyección Financiera
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">No es Magia, es Matemática</h2>
              <p className="text-slate-400">
                Esto pasa cuando combinas un producto de consumo masivo (café) con un sistema de retención.
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
                        Completa
                      </button>
                      <button
                        onClick={() => setSelectedPackage('ESP3')}
                        className={`w-1/3 p-2 text-sm rounded-md transition ${selectedPackage === 'ESP3' ? 'bg-[var(--creatuactivo-purple)] text-white' : 'text-slate-300'}`}
                      >
                        Premium
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

              <div className="mt-12 max-w-3xl mx-auto text-center p-8 bg-green-900/20 border border-green-500/30 rounded-xl">
                <Clock className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-xl text-white leading-relaxed">
                  Esto no es "ganar dinero".
                  <br />
                  Esto es construir libertad.
                  <br /><br />
                  <span className="text-lg text-slate-400">¿Ves la diferencia?</span>
                </p>
              </div>
            </div>
          </section>

          {/* SECCIÓN 6: Paquetes Reenmarcados */}
          <section className="py-20 lg:py-28 px-4">
            <div className="max-w-7xl mx-auto">
              <SectionHeader
                title="Tu Punto de Entrada"
                subtitle="Esto no es un 'paquete'. Es el inicio de algo que te dará dinero por años."
              />

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                <PackageCard
                  title="Opción Básica"
                  priceUSD="200"
                  priceCOP="900.000"
                  purpose="Para quienes quieren probar primero antes de comprometer más dinero. Porque creemos que debes sentirte seguro antes de dar el siguiente paso."
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
                  title="Opción Completa"
                  priceUSD="500"
                  priceCOP="2.250.000"
                  purpose="Para quienes ya decidieron y quieren una posición más fuerte. Porque creemos que cuando te comprometes de verdad, mereces más herramientas."
                  features={[
                    "Todo lo de la Opción Básica +",
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
                  title="Opción Premium"
                  priceUSD="1,000"
                  priceCOP="4.500.000"
                  purpose="Para quienes piensan en grande y quieren todo desde el día uno. Porque creemos que la ambición merece las mejores herramientas."
                  features={[
                    "Todo lo de la Opción Completa +",
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
                  <span className="font-semibold text-white">Nota importante:</span> Cada inversión es en producto de Gano Excel que puedes consumir o distribuir. No es un "gasto", es inventario para tu negocio.
                </p>
              </div>
            </div>
          </section>

          {/* SECCIÓN 7: FAQ Emocionales */}
          <section className="py-20 lg:py-28 px-4 bg-slate-900/50 rounded-3xl">
            <div className="max-w-4xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
                <h2 className="creatuactivo-h2-gradient text-3xl md:text-5xl font-bold mb-4">Las Preguntas Que Realmente Importan</h2>
                <p className="text-slate-400 text-lg">No las preguntas técnicas. Las preguntas que sientes en el corazón.</p>
              </div>

              <div className="space-y-4">
                <FAQItem
                  question="¿Y si fallo?"
                  answer={`**PRIMERO, REDEFÍNAMOS "FALLAR"**

¿Es fallar intentar construir algo mejor y no lograrlo?
¿O es fallar NO intentar y resignarte a 40 años de rutina?

**Yo creo que el único fracaso real es arrepentimiento.**

**AHORA, PRAGMÁTICAMENTE:**

• ¿Puedes no tener éxito inmediato? Claro.
• ¿Puedes tardar más de lo esperado? Posible.
• ¿Puedes descubrir que esto no es para ti? También.

**PERO AQUÍ ESTÁ LA VERDAD:**

Si aplicas Los 3 Pasos: IAA, usas la tecnología que te damos, y te mantienes conectado con la comunidad de Fundadores...

**El "fracaso" técnicamente no existe.**

Porque o lo logras... o aprendes habilidades valiosas que usarás toda tu vida.

**En ambos casos, ganas.**

**LA PREGUNTA REAL ES:**
¿Prefieres intentar y descubrir... o no intentar y vivir con el "¿y si...?"

Tú decides qué es más aterrador.`}
                />

                <FAQItem
                  question="¿Y si nadie me cree?"
                  answer={`Esta pregunta revela algo hermoso: te importa la opinión de otros. **Eso es humano.**

**PERO DÉJAME PREGUNTARTE ALGO:**

¿Quieres construir esto para convencer a TODOS?
¿O quieres construirlo con **QUIENES YA CREEN LO QUE TÚ CREES**?

**Tú no necesitas que todos te crean.**

Necesitas encontrar a los que YA creen que:

• **El tiempo es más valioso que dinero**
• **Crear algo propio es posible para personas comunes**
• **Hay otra forma más allá del empleo tradicional**

Esas personas existen. De hecho, **2,847 ya lo demostraron**.

**TU TRABAJO NO ES CONVENCER ESCÉPTICOS.**
**Es ENCONTRAR believers.**

Y cuando hablas desde tu WHY auténtico... los believers se autoseleccionan.`}
                />

                <FAQItem
                  question="¿Esto es legítimo o una estafa?"
                  answer={`**Honestamente, me alegra que preguntes.** El escepticismo saludable es inteligente.

Entonces déjame darte **transparencia total:**

**VERIFICA TÚ MISMO:**

• ✓ **Gano Excel:** 30+ años operando. Búscalo. Lee su historia.
• ✓ **Patente mundial:** Número de patente verificable públicamente.
• ✓ **Trayectoria de 9 años:** 2,847 personas. Testimonios reales.
• ✓ **Tecnología propia:** CreaTuActivo.com. Lo estás usando ahora mismo.

**LO QUE NO SOMOS:**

• ✗ No prometemos "hazte rico rápido"
• ✗ No escondemos información del plan de compensación
• ✗ No presionamos con "decide ya o pierdes"
• ✗ No dependemos de reclutamiento infinito (tenemos producto con valor real)

**LA PRUEBA DEFINITIVA:**

**No me creas a MÍ.**

• Habla con Liliana Patricia Moreno.
• Habla con otros fundadores.
• Revisa los documentos legales.
• Haz tus propias verificaciones.

Si después de investigar sientes confianza, **bienvenido**.
Si no, está bien. **No es para todos.**

**Lo único que pido es:** no decidas desde el miedo. Decide desde la información.`}
                />

                <FAQItem
                  question="No tengo tiempo para esto"
                  answer={`**Entiendo.** Y déjame preguntarte algo honesto:

**¿POR QUÉ sientes que no tienes tiempo?**

Probablemente porque tu tiempo actual está siendo consumido por cosas que **no te acercan a lo que realmente quieres**.

¿Correcto?

**Entonces la pregunta no es "¿tengo tiempo?"**
**La pregunta es "¿para QUÉ quiero tiempo?"**

Si la respuesta es:

• **Para estar con mi familia**
• **Para tener libertad financiera**
• **Para dejar legado**

**Entonces SÍ tienes tiempo.**

Porque este sistema existe precisamente para **DEVOLVERTE tiempo**.

**LA PARADOJA ES:**
Inviertes 3-6 meses construyendo el sistema... para recuperar 30+ años de tiempo.

¿Tiene sentido ese trade-off para ti?

Si sí, **encontrarás el tiempo**.
Si no, está bien. **No es para todos.**

Solo tú sabes tu WHY.`}
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN 8: CTA Final Inspirador */}
          <section className="text-center py-20 lg:py-32">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-6"/>

                <h2 className="creatuactivo-h2-gradient text-4xl md:text-6xl font-bold mb-8">
                  Si Crees Lo Que Yo Creo...
                </h2>

                <div className="space-y-6 text-xl text-slate-300 leading-relaxed mb-12">
                  <p>
                    Si crees que despertar sin alarma es más valioso que cualquier salario...
                  </p>
                  <p>
                    Si crees que estar en el recital de tu hija no debería costarte un día de vacaciones...
                  </p>
                  <p>
                    Si crees que tus nietos merecen heredar libertad, no solo fotos...
                  </p>
                </div>

                <div className="creatuactivo-why-card p-8 lg:p-12 mb-12">
                  <p className="text-2xl lg:text-3xl font-bold text-white mb-6">
                    Entonces CreaTuActivo es para ti.
                  </p>
                  <p className="text-xl text-slate-300 leading-relaxed">
                    Porque yo creo eso también.
                    <br /><br />
                    Y no quiero construirlo solo.
                    <br /><br />
                    Los movimientos no se construyen con individuos aislados.
                    <br />
                    Se construyen con 150 fundadores que creen lo mismo.
                  </p>
                </div>

                <Link href="/fundadores" className="creatuactivo-cta-ecosystem text-xl inline-flex items-center mb-8">
                  Activar mi Aplicación <ArrowRight size={24} className="ml-2" />
                </Link>

                <p className="text-sm text-slate-500 max-w-2xl mx-auto">
                  Solo 150 espacios como Fundador hasta el 04 de enero 2026. Después, solo podrás entrar como Constructor bajo la mentoría de alguien más.
                </p>
              </motion.div>
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
