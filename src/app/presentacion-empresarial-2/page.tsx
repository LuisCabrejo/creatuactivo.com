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
import { ArrowRight, CheckCircle, ShieldCheck, Zap, Award, Video, Rocket, Crown, Heart, Target, Clock, TrendingUp, Users, Sparkles, ChevronDown, Play, Package } from 'lucide-react'
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
      border: 2px solid rgba(124, 58, 237, 0.3);
      border-radius: 20px;
      transition: all 0.4s ease;
    }
    .creatuactivo-contrast-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 16px;
      transition: all 0.3s ease;
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

const HOWPillar = ({ icon, title, porque, description }: { icon: React.ReactNode, title: string, porque: string, description: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="creatuactivo-component-card p-8"
  >
    <div className="inline-block bg-purple-500/10 p-4 rounded-xl mb-4">
      <div className="text-purple-300">
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
        <span className="text-sm text-slate-400">Inversión en tu activo</span>
        <div>
          <span className="text-4xl font-extrabold text-white">${priceUSD}</span>
          <span className="text-slate-400"> USD</span>
        </div>
        <p className="text-sm text-slate-500">~ ${priceCOP} COP</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mb-6">
        <p className="text-sm text-blue-400 font-semibold mb-2">POR QUÉ ESTE PAQUETE:</p>
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

      <p className="text-xs text-slate-400 font-semibold mb-3">LO QUE CONSTRUYES:</p>
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
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">{answer}</p>
        </motion.div>
      )}
    </div>
  );
};

// --- Componente Principal ---
export default function PresentacionEmpresarial2Page() {
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
          {/* SECCIÓN 1: WHY - Hero Emocional */}
          <section className="text-center max-w-4xl mx-auto py-20 lg:py-32 pt-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6 border border-blue-500/30">
                Por Qué Existimos
              </div>

              <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl lg:text-7xl mb-8">
                ¿Cuánto Vale Tu Tiempo?
              </h1>

              <p className="text-xl md:text-2xl text-slate-300 mb-6 leading-relaxed">
                No en dinero. <span className="text-blue-400 font-semibold">En vida.</span>
              </p>

              <div className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 space-y-3">
                <p>En horas con tus hijos.</p>
                <p>En mañanas sin despertador.</p>
                <p>En libertad para elegir.</p>
              </div>

              <div className="creatuactivo-why-card p-8 lg:p-12 text-left max-w-3xl mx-auto mb-10">
                <WhyCard
                  icon={<Heart size={28} />}
                  text="Creemos que la vida es demasiado corta para intercambiarla por un cheque quincenal."
                />
                <WhyCard
                  icon={<Users size={28} />}
                  text="Creemos que tu familia merece tu presencia, no solo tu provisión."
                />
                <WhyCard
                  icon={<Target size={28} />}
                  text="Creemos que deberías construir legado, no solo sobrevivir."
                />

                <div className="mt-8 pt-6 border-t border-purple-500/20">
                  <p className="text-2xl font-bold text-purple-400 text-center">
                    Por eso creamos esto.
                  </p>
                </div>
              </div>

              <Link href="#contraste" className="creatuactivo-cta-ecosystem text-lg inline-flex items-center">
                Descubre Cómo <ArrowRight size={20} className="ml-2" />
              </Link>
            </motion.div>
          </section>

          {/* Testimonio Micro 1 */}
          <section className="max-w-3xl mx-auto mb-20">
            <TestimonialMicro
              quote="Cuando Luis me dijo 'tu tiempo es más valioso que dinero', algo hizo clic. Llevaba 15 años intercambiando mi vida por un salario. Ya no más."
              author="Carlos M."
              role="Constructor Empresarial"
            />
          </section>

          {/* SECCIÓN 2: Contraste de Paradigmas */}
          <section id="contraste" className="py-20 lg:py-28 px-4">
            <div className="max-w-7xl mx-auto">
              <SectionHeader
                title="Dos Caminos. Una Decisión."
                subtitle="La mayoría sigue el camino tradicional sin cuestionarlo. Pero hay otra forma."
              />

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <ContrastColumn
                  title="Camino Tradicional"
                  color="old"
                  items={[
                    "40 años trabajando para otros",
                    "Intercambias tiempo por dinero",
                    "Tu ingreso depende de tu esfuerzo",
                    "Pensión de $400/mes a los 65",
                    '"Espero llegar a jubilación"'
                  ]}
                />
                <ContrastColumn
                  title="Camino Arquitecto"
                  color="new"
                  items={[
                    "Construir 3-5 años, cosechar 30+",
                    "Construyes activo que trabaja solo",
                    "Tu ingreso es independiente de ti",
                    "Activo heredable multi-generacional",
                    '"Diseño mi libertad financiera"'
                  ]}
                />
              </div>

              <div className="text-center max-w-2xl mx-auto p-8 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-xl text-slate-200 leading-relaxed">
                  La pregunta no es <span className="text-blue-400 font-semibold">"¿cuál prefieres?"</span>
                  <br /><br />
                  La pregunta es <span className="text-blue-400 font-semibold">"¿cuál estás construyendo HOY?"</span>
                </p>
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: HOW - Cómo Lo Hacemos Diferente */}
          <section className="py-20 lg:py-28 px-4 bg-slate-900/50 rounded-3xl">
            <div className="max-w-7xl mx-auto">
              <SectionHeader
                title="Cómo Lo Hacemos Diferente"
                subtitle="No te convertimos en vendedor. Te convertimos en ARQUITECTO."
              />

              <div className="grid md:grid-cols-3 gap-8">
                <HOWPillar
                  icon={<ShieldCheck size={40} />}
                  title="Motor: Ventaja Competitiva"
                  porque="mereces construir sobre algo defendible, algo que nadie pueda copiar"
                  description="Producto con patente mundial de Gano Excel (30+ años). No compites en un mercado saturado. Creas tu propia categoría."
                />
                <HOWPillar
                  icon={<Target size={40} />}
                  title="Plano: Framework Simple"
                  porque="la complejidad mata sueños y el éxito debe ser replicable"
                  description="Framework IAA (Iniciar, Acoger, Activar). Tan simple que un niño lo entiende. Tan poderoso que escala a millones."
                />
                <HOWPillar
                  icon={<Zap size={40} />}
                  title="Maquinaria: IA que Trabaja"
                  porque="tu tiempo es más valioso respondiendo las mismas preguntas repetitivamente"
                  description="Sistema NEXUS automatiza el 80% del trabajo. Educa, gestiona, escala. Mientras tú recuperas tu tiempo con tu familia."
                />
              </div>

              <div className="mt-16 text-center max-w-3xl mx-auto">
                <p className="text-2xl text-slate-200 leading-relaxed mb-4">
                  ¿Ves la diferencia?
                </p>
                <p className="text-xl text-slate-400 leading-relaxed">
                  No te damos un "negocio". Te damos la <span className="text-purple-400 font-semibold">arquitectura completa</span> para construir tu patrimonio.
                </p>
              </div>
            </div>
          </section>

          {/* Testimonio Micro 2 */}
          <section className="max-w-3xl mx-auto my-20">
            <TestimonialMicro
              quote="La diferencia real no es el producto. Es el SISTEMA. Por primera vez en mi vida, el sistema trabaja para mí, no yo para el sistema."
              author="María G."
              role="Constructora Visionaria"
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
                  <p className="text-sm text-slate-500">2,847 constructores exitosos sin tecnología</p>
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
                        "Descubrí que esto no es solo un negocio; es un vehículo para transformar tu realidad. Una decisión puede cambiarlo todo. Aquí encontré la arquitectura para cumplir mis sueños."
                      </p>
                      <p className="font-bold text-white text-xl">Liliana Patricia Moreno</p>
                      <p className="text-purple-400 font-semibold mb-4">Constructora Diamante</p>
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
          <section className="py-20 lg:py-28 px-4 bg-slate-900/70 rounded-3xl">
            <div className="max-w-7xl mx-auto">
              <SectionHeader
                title="Visualiza Tu Libertad"
                subtitle="Estos números no son solo cifras. Son horas con tus hijos. Son meses de libertad financiera. Son generaciones de legado."
              />

              <div className="max-w-4xl mx-auto mb-12 p-8 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <p className="text-xl text-slate-200 leading-relaxed text-center">
                  Tu activo tiene <span className="text-purple-400 font-bold">12 formas de generar valor</span>.
                  <br /><br />
                  Aquí visualizamos las dos que construyen el cimiento de tu libertad:
                  <br />
                  <span className="text-blue-400 font-semibold">Capitalización Inicial</span> y <span className="text-green-400 font-semibold">Flujo Residual</span>.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Calculadora Capitalización */}
                <div className="creatuactivo-component-card p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="text-blue-400" size={28} />
                    <h3 className="text-xl font-bold text-white">Etapa 1: Flujo de Capitalización</h3>
                  </div>
                  <p className="text-slate-400 mb-6 text-sm">
                    Cuando personas en tu arquitectura deciden construir sus propios activos empresariales, generas un flujo de capitalización inicial.
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
                      2. Número de Arquitectos: <span className="font-bold text-white text-lg">{packageCount}</span>
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
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Flujo de Capitalización</p>
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
                    <h3 className="text-xl font-bold text-white">Etapa 2: Flujo Residual</h3>
                  </div>
                  <p className="text-slate-400 mb-6 text-sm">
                    A medida que tu arquitectura crece y personas consumen producto regularmente, tu flujo residual mensual se construye.
                  </p>

                  <div className="mb-6">
                    <label htmlFor="teamSlider" className="block text-center text-slate-300 mb-2 text-sm">
                      Personas consumiendo en tu activo: <span className="font-bold text-white text-lg">{teamSize}</span>
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
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Ingreso Residual Mensual</p>
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
                <p className="text-xl text-slate-200 leading-relaxed">
                  Esto no es "ganar dinero".
                  <br />
                  Esto es <span className="text-green-400 font-bold">construir libertad</span>.
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
                subtitle="Esto no es un 'paquete'. Es la fundación de tu activo patrimonial."
              />

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                <PackageCard
                  title="Arquitecto Inicial"
                  priceUSD="200"
                  priceCOP="900.000"
                  purpose="Para quienes quieren validar que este camino es el correcto antes de comprometer recursos mayores. Porque creemos que debes sentirte seguro antes de escalar."
                  features={[
                    "Base arquitectónica completa (Framework IAA)",
                    "Inventario para validar el modelo",
                    "Acceso total al ecosistema tecnológico",
                    "Comunidad de Arquitectos fundadores"
                  ]}
                  bonusMonths={2}
                  bonusPlan="Plan Cimiento"
                  bonusIcon={<Zap size={20}/>}
                  ctaText="Iniciar Mi Construcción"
                />

                <PackageCard
                  title="Arquitecto Empresarial"
                  priceUSD="500"
                  priceCOP="2.250.000"
                  purpose="Para quienes ya decidieron y quieren posición estratégica sólida. Porque creemos que el compromiso real merece recursos reales."
                  features={[
                    "Todo lo del Arquitecto Inicial +",
                    "Inventario para operación profesional",
                    "Consultoría estratégica prioritaria",
                    "Mentoría personalizada mensual"
                  ]}
                  bonusMonths={4}
                  bonusPlan="Plan Estructura"
                  bonusIcon={<Rocket size={20}/>}
                  ctaText="Escalar Mi Activo"
                />

                <PackageCard
                  title="Arquitecto Visionario"
                  priceUSD="1,000"
                  priceCOP="4.500.000"
                  purpose="Para quienes piensan en grande y quieren máximo potencial desde día uno. Porque creemos que la visión audaz merece herramientas excepcionales."
                  features={[
                    "Todo lo del Arquitecto Empresarial +",
                    "Inventario premium de máximo potencial",
                    "Consultoría estratégica VIP directa",
                    "Acceso prioritario a nuevas features"
                  ]}
                  bonusMonths={6}
                  bonusPlan="Plan Rascacielos"
                  bonusIcon={<Crown size={20}/>}
                  ctaText="Maximizar Mi Arquitectura"
                />
              </div>

              <div className="mt-12 text-center max-w-2xl mx-auto p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                <p className="text-slate-300 text-sm">
                  <span className="font-semibold text-white">Nota importante:</span> Cada inversión es en producto de Gano Excel que puedes consumir o distribuir. No es un "gasto", es inventario de tu activo.
                </p>
              </div>
            </div>
          </section>

          {/* SECCIÓN 7: FAQ Emocionales */}
          <section className="py-20 lg:py-28 px-4 bg-slate-900/50 rounded-3xl">
            <div className="max-w-4xl mx-auto">
              <SectionHeader
                title="Las Preguntas Que Realmente Importan"
                subtitle="No las preguntas técnicas. Las preguntas que sientes en el corazón."
              />

              <div className="space-y-4">
                <FAQItem
                  question="¿Y si fallo?"
                  answer={`Primero, redefínamos "fallar".

¿Es fallar intentar construir algo mejor y no lograrlo?
¿O es fallar NO intentar y resignarte a 40 años de rutina?

Yo creo que el único fracaso real es arrepentimiento.

Ahora, pragmáticamente:

¿Puedes no tener éxito inmediato? Claro.
¿Puedes tardar más de lo esperado? Posible.
¿Puedes descubrir que esto no es para ti? También.

Pero aquí está la verdad:

Si aplicas el Framework IAA, usas la tecnología que te damos, y te mantienes conectado con la comunidad de Arquitectos...

El "fracaso" técnicamente no existe.

Porque o construyes el activo... o aprendes habilidades valiosas que usarás toda tu vida.

En ambos casos, ganas.

La pregunta real es: ¿Prefieres intentar y descubrir... o no intentar y vivir con el "¿y si...?"

Tú decides qué es más aterrador.`}
                />

                <FAQItem
                  question="¿Y si nadie me cree?"
                  answer={`Esta pregunta revela algo hermoso: te importa la opinión de otros. Eso es humano.

Pero déjame preguntarte algo:

¿Quieres construir esto para convencer a TODOS?
¿O quieres construirlo con QUIENES YA CREEN LO QUE TÚ CREES?

Tú no necesitas que todos te crean.

Necesitas encontrar a los que YA creen que:
• El tiempo es más valioso que dinero
• Construir patrimonio es posible para personas comunes
• Hay otra forma más allá del empleo tradicional

Esas personas existen. De hecho, 2,847 ya lo demostraron.

Tu trabajo no es convencer escépticos.
Es ENCONTRAR believers.

Y cuando hablas desde tu WHY auténtico... los believers se autoseleccionan.`}
                />

                <FAQItem
                  question="¿Esto es legítimo o una estafa?"
                  answer={`Honestamente, me alegra que preguntes. El escepticismo saludable es inteligente.

Entonces déjame darte transparencia total:

VERIFICA TÚ MISMO:
✓ Gano Excel: 30+ años operando. Búscalo. Lee su historia.
✓ Patente mundial: Número de patente verificable públicamente.
✓ Trayectoria de 9 años: 2,847 constructores. Testimonios reales.
✓ Tecnología propia: CreaTuActivo.com. Lo estás usando ahora mismo.

LO QUE NO SOMOS:
✗ No prometemos "hazte rico rápido"
✗ No escondemos información del plan de compensación
✗ No presionamos con "decide ya o pierdes"
✗ No dependemos de reclutamiento infinito (tenemos producto con valor real)

LA PRUEBA DEFINITIVA:
No me creas a MÍ.

Habla con Liliana Patricia Moreno.
Habla con otros constructores.
Revisa los documentos legales.
Haz tus propias verificaciones.

Si después de investigar sientes confianza, bienvenido.
Si no, está bien. No es para todos.

Lo único que pido es: no decidas desde el miedo. Decide desde la información.`}
                />

                <FAQItem
                  question="No tengo tiempo para esto"
                  answer={`Entiendo. Y déjame preguntarte algo honesto:

¿POR QUÉ sientes que no tienes tiempo?

Probablemente porque tu tiempo actual está siendo consumido por cosas que no te acercan a lo que realmente quieres.

¿Correcto?

Entonces la pregunta no es "¿tengo tiempo?"
La pregunta es "¿para QUÉ quiero tiempo?"

Si la respuesta es:
• Para estar con mi familia
• Para construir libertad financiera
• Para dejar legado

Entonces SÍ tienes tiempo.

Porque este sistema existe precisamente para DEVOLVERTE tiempo.

La paradoja es: inviertes 3-6 meses construyendo el sistema... para recuperar 30+ años de tiempo.

¿Tiene sentido ese trade-off para ti?

Si sí, encontrarás el tiempo.
Si no, está bien. No es para todos.

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

                <h2 className="creatuactivo-h2-component text-4xl md:text-6xl font-bold mb-8">
                  Si Crees Lo Que Yo Creo...
                </h2>

                <div className="space-y-6 text-xl text-slate-300 leading-relaxed mb-12">
                  <p>
                    Si crees que <span className="text-blue-400 font-semibold">la vida es demasiado corta</span> para intercambiarla por dinero...
                  </p>
                  <p>
                    Si crees que <span className="text-purple-400 font-semibold">tu familia merece tu tiempo</span>, no solo tu provisión...
                  </p>
                  <p>
                    Si crees que <span className="text-blue-400 font-semibold">deberías construir legado</span>, no solo sobrevivir...
                  </p>
                </div>

                <div className="creatuactivo-why-card p-8 lg:p-12 mb-12">
                  <p className="text-2xl lg:text-3xl font-bold text-white mb-6">
                    Entonces esto es para ti.
                  </p>
                  <p className="text-xl text-slate-300 leading-relaxed">
                    Porque yo creo eso también.
                    <br /><br />
                    Y no puedo construirlo solo.
                    <br /><br />
                    Los movimientos no se construyen con individuos aislados.
                    <br />
                    Se construyen con <span className="text-purple-400 font-semibold">comunidades de personas que creen lo mismo</span>.
                  </p>
                </div>

                <Link href="/fundadores" className="creatuactivo-cta-ecosystem text-xl inline-flex items-center mb-8">
                  Unirme al Movimiento de Arquitectos <ArrowRight size={24} className="ml-2" />
                </Link>

                <p className="text-sm text-slate-500 max-w-2xl mx-auto">
                  Al hacer clic, serás redirigido a la página de fundadores donde podrás aplicar para una consultoría estratégica personalizada.
                  No es un "compra ya". Es una invitación a explorar si esto se alinea con tu WHY.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
              <p>&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
              <p className="mt-2">El primer ecosistema tecnológico completo para construcción de activos en América.</p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
