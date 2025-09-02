'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, ShieldCheck, Zap, BrainCircuit, Box, Users, Award, DollarSign, Package, Crown, Video } from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'

// --- Estilos CSS Globales (Desde Guía de Branding v4.2) ---
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

    .creatuactivo-package-card-recommended {
        border-color: var(--creatuactivo-gold);
        box-shadow: 0 0 40px rgba(245, 158, 11, 0.2);
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
  `}</style>
);

// --- Componente de Cabecera de Sección ---
const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
    <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">{title}</h2>
    <p className="text-slate-400 text-lg">{subtitle}</p>
  </div>
);

// --- Componente de Tarjeta de Paquete de Inversión ---
const PackageCard = ({ title, priceUSD, priceCOP, features, recommended = false }) => (
    <div className={`creatuactivo-package-card h-full flex flex-col ${recommended ? 'creatuactivo-package-card-recommended' : ''}`}>
        {recommended && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--creatuactivo-gold)] text-slate-900 text-xs font-bold uppercase px-4 py-1 rounded-full z-10">
                Más Popular
            </div>
        )}
        <div className="p-8 flex-grow flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2 pt-4">{title}</h3>
            <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">${priceUSD}</span>
                <span className="text-slate-400"> USD</span>
                <p className="text-sm text-slate-500">~ ${priceCOP} COP</p>
            </div>
            <ul className="space-y-3 text-slate-300 flex-grow mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <Link href="/fundadores" className={`w-full text-center font-semibold py-3 px-5 rounded-lg transition-colors duration-300 mt-auto ${recommended ? 'bg-[var(--creatuactivo-purple)] text-white hover:bg-purple-500' : 'bg-slate-700/70 text-white hover:bg-slate-700'}`}>
                Activar Plan
            </Link>
        </div>
    </div>
);

// --- Componente Principal de la Página de Presentación Empresarial ---
export default function PresentacionEmpresarialPage() {
    const [teamSize, setTeamSize] = useState(100);
    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [selectedPackage, setSelectedPackage] = useState('ESP3');
    const [newPartners, setNewPartners] = useState(2);
    const [fastStartBonus, setFastStartBonus] = useState(0);
    const [netResult, setNetResult] = useState(0);

    const packageData = {
        'ESP1': { bonus: 25, investment: 200, investmentCOP: 900000 },
        'ESP2': { bonus: 75, investment: 500, investmentCOP: 2250000 },
        'ESP3': { bonus: 150, investment: 1000, investmentCOP: 4500000 },
    };

    useEffect(() => {
        const binaryPercentage = 0.17;
        const averageCVperPerson = 50;
        const exchangeRate = 4500;
        const weeklyIncome = (teamSize / 2) * averageCVperPerson * binaryPercentage;
        const monthlyIncomeUSD = weeklyIncome * 4;
        const incomeCOP = monthlyIncomeUSD * exchangeRate;
        setMonthlyIncome(incomeCOP);
    }, [teamSize]);

    useEffect(() => {
        const bonus = packageData[selectedPackage].bonus * newPartners;
        const totalBonusCOP = bonus * 4500;
        const investmentCOP = packageData[selectedPackage].investmentCOP;
        setFastStartBonus(totalBonusCOP);
        setNetResult(totalBonusCOP - investmentCOP);
    }, [selectedPackage, newPartners]);

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
                    <section className="text-center max-w-4xl mx-auto py-20 lg:py-32 pt-20">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl mb-6">
                                La Arquitectura de tu Futuro.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                                Este es un recorrido por un ecosistema diseñado para que construyas un activo real, apalancado en un sistema inteligente.
                            </p>
                        </motion.div>
                    </section>

                    <section className="py-20 lg:py-28 px-4">
                        <div className="max-w-7xl mx-auto">
                            <SectionHeader
                                title="Los 3 Pilares de un Activo Insuperable"
                                subtitle="Nuestra nueva categoría se construye sobre una base de credibilidad, exclusividad y una ventaja tecnológica decisiva."
                            />
                            <div className="grid md:grid-cols-3 gap-8 text-left">
                                <div className="creatuactivo-component-card p-8">
                                    <div className="inline-block bg-yellow-500/10 p-4 rounded-xl mb-4"><ShieldCheck className="w-8 h-8 text-yellow-300" /></div>
                                    <h3 className="text-2xl font-bold mb-2 text-white">Socio Corporativo Sólido</h3>
                                    <p className="text-slate-400">Nos apalancamos en Gano Excel, un gigante global con 30+ años de trayectoria, 100% libre de deudas, que se encarga de todo lo operativo.</p>
                                </div>
                                <div className="creatuactivo-component-card p-8">
                                    <div className="inline-block bg-green-500/10 p-4 rounded-xl mb-4"><Award className="w-8 h-8 text-green-300" /></div>
                                    <h3 className="text-2xl font-bold mb-2 text-white">Producto con Patente Mundial</h3>
                                    <p className="text-slate-400">Tu activo se construye sobre un producto único. No compites, operas en una categoría propia. Es la máxima ventaja competitiva.</p>
                                </div>
                                <div className="creatuactivo-component-card p-8">
                                    <div className="inline-block bg-purple-500/10 p-4 rounded-xl mb-4"><Zap className="w-8 h-8 text-purple-300" /></div>
                                    <h3 className="text-2xl font-bold mb-2 text-white">Sistema Tecnológico Superior</h3>
                                    <p className="text-slate-400">Te entregamos el ecosistema CreaTuActivo.com, con el Framework IAA y NEXUS IA, diseñado para automatizar el 80% del trabajo.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="py-20 lg:py-28 px-4 bg-slate-900/70 rounded-3xl">
                        <div className="max-w-7xl mx-auto">
                            <SectionHeader
                                title="El Potencial de tu Activo: Dos Flujos de Valor"
                                subtitle="Tu activo genera valor de dos maneras: a través de la expansión inicial (Capitalización) y del consumo recurrente (Residual). Visualiza ambos."
                            />
                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="creatuactivo-component-card p-8">
                                    <h3 className="text-xl font-bold text-white mb-2">Etapa 1: Flujo de Capitalización</h3>
                                    <p className="text-slate-400 mb-6">Proyecta tu retorno inicial basado en la integración de nuevos constructores.</p>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">1. Selecciona tu Paquete</label>
                                        <div className="flex rounded-lg bg-slate-900/50 p-1">
                                            <button onClick={() => setSelectedPackage('ESP1')} className={`w-1/3 p-2 text-sm rounded-md transition ${selectedPackage === 'ESP1' ? 'bg-[var(--creatuactivo-blue)] text-white' : 'text-slate-300'}`}>ESP 1</button>
                                            <button onClick={() => setSelectedPackage('ESP2')} className={`w-1/3 p-2 text-sm rounded-md transition ${selectedPackage === 'ESP2' ? 'bg-[var(--creatuactivo-blue)] text-white' : 'text-slate-300'}`}>ESP 2</button>
                                            <button onClick={() => setSelectedPackage('ESP3')} className={`w-1/3 p-2 text-sm rounded-md transition ${selectedPackage === 'ESP3' ? 'bg-[var(--creatuactivo-purple)] text-white' : 'text-slate-300'}`}>ESP 3</button>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <label htmlFor="partnersSlider" className="block text-center text-slate-300 mb-2">2. Nuevos socios en tu primer mes: <span className="font-bold text-white text-xl">{newPartners}</span></label>
                                        <input type="range" id="partnersSlider" min="2" max="10" value={newPartners} onChange={(e) => setNewPartners(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="bg-slate-900/50 p-4 rounded-xl text-center border border-white/10"><p className="text-sm font-semibold text-slate-400">Bono de Inicio Rápido</p><p className="text-2xl font-extrabold text-blue-400 mt-1">${fastStartBonus.toLocaleString('es-CO')}</p></div>
                                        <div className="bg-slate-900/50 p-4 rounded-xl text-center border border-white/10"><p className="text-sm font-semibold text-slate-400">Resultado Neto</p><p className={`text-2xl font-extrabold mt-1 ${netResult >= 0 ? 'text-green-400' : 'text-red-400'}`}>${netResult.toLocaleString('es-CO')}</p></div>
                                    </div>
                                </div>
                                <div className="creatuactivo-component-card p-8">
                                    <h3 className="text-xl font-bold text-white mb-2">Etapa 2: Flujo Residual</h3>
                                    <p className="text-slate-400 mb-6">Proyecta tu ingreso mensual basado en el volumen de producto (CV) consumido por tu canal.</p>
                                    <div className="mb-6">
                                        <label htmlFor="teamSlider" className="block text-center text-slate-300 mb-2">Personas consumiendo en tu canal: <span className="font-bold text-white text-xl">{teamSize}</span></label>
                                        <input type="range" id="teamSlider" min="10" max="1000" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} step="10" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
                                    </div>
                                    <div className="bg-slate-900/50 p-6 rounded-xl text-center border border-white/10">
                                        <p className="text-base font-semibold text-slate-400">Ingreso Residual Mensual Potencial</p>
                                        <p className="text-4xl font-extrabold text-green-400 mt-2">${monthlyIncome.toLocaleString('es-CO', { maximumFractionDigits: 0 })} COP</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="py-20 lg:py-28 px-4">
                        <div className="max-w-7xl mx-auto">
                            <SectionHeader
                                title="Tu Punto de Entrada a la Arquitectura"
                                subtitle="Elige el paquete que mejor se alinee con tu visión. Cada uno te da acceso completo al ecosistema tecnológico."
                            />
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <PackageCard title="Emprendedor" priceUSD="200" priceCOP="900.000" features={["Acceso completo al ecosistema", "Framework IAA completo", "Inventario inicial de validación", "Tecnología NodeX incluida"]}/>
                                <PackageCard title="Empresarial" priceUSD="500" priceCOP="2.250.000" features={["Todo lo del plan Emprendedor +", "Inventario para operación profesional", "Consultoría estratégica prioritaria", "Optimización de primeros flujos"]} recommended={true}/>
                                <PackageCard title="Visionario" priceUSD="1,000" priceCOP="4.500.000" features={["Todo lo del plan Empresarial +", "Inventario premium de máximo potencial", "Consultoría estratégica VIP", "Construcción acelerada desde día 1"]}/>
                            </div>
                        </div>
                    </section>

                    <section className="py-20 lg:py-28 px-4">
                        <div className="max-w-4xl mx-auto text-center">
                             <SectionHeader
                                title="Historias Reales, Vidas Transformadas"
                                subtitle="El poder de este ecosistema no está en la teoría, sino en los resultados de los constructores."
                            />
                            <div className="creatuactivo-component-card p-8">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <img className="h-32 w-32 object-cover rounded-full mx-auto md:mx-0 md:flex-shrink-0 border-4 border-purple-500/50" src="https://4millones.com/wp-content/uploads/2025/07/liliana-patricia-moreno-diamante-gano-excel.webp" alt="Foto de Liliana Patricia Moreno"/>
                                    <div className="text-left">
                                        <p className="text-slate-300 text-lg italic">"Descubrí que esto no es solo un negocio; es un vehículo para transformar tu realidad. Una decisión puede cambiarlo todo. Aquí encontré la arquitectura para cumplir mis sueños."</p>
                                        <p className="font-bold text-white mt-4">Liliana Patricia Moreno</p>
                                        <p className="text-sm text-purple-400">Constructora Diamante</p>
                                        <a href="https://www.facebook.com/share/v/17CLotD3R2/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-4 bg-purple-500/20 text-purple-300 font-bold py-2 px-4 rounded-lg hover:bg-purple-500/30 transition-colors">
                                            <Video className="w-5 h-5 mr-2" />
                                            Ver su Historia
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="text-center py-20">
                         <div className="max-w-3xl mx-auto">
                            <Crown className="w-16 h-16 text-[var(--creatuactivo-gold)] mx-auto mb-6"/>
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-6">Es Momento de Construir.</h2>
                            <p className="text-slate-400 text-lg mb-10">Has visto la arquitectura, el potencial y la prueba. El siguiente paso es unirte al grupo de pioneros que están definiendo esta nueva categoría.</p>
                            <Link href="/fundadores" className="creatuactivo-cta-ecosystem text-lg inline-block">
                                Convertirme en Fundador
                            </Link>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
