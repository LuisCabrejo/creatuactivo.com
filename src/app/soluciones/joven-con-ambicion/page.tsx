'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, School, Zap, BrainCircuit, ShieldCheck } from 'lucide-react'
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

// --- Componente de Tarjeta de Contraste ---
const ContrastCard = ({ title, items, isNewWorld = false }) => (
    <div className={`creatuactivo-component-card p-8 h-full ${isNewWorld ? 'border-[var(--creatuactivo-gold)]' : ''}`}>
        <h3 className={`text-2xl font-bold mb-4 ${isNewWorld ? 'text-[var(--creatuactivo-gold)]' : 'text-slate-400'}`}>{title}</h3>
        <ul className="space-y-3">
            {items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center ${isNewWorld ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {isNewWorld ? <Check className="w-4 h-4 text-green-400" /> : <span className="text-red-400 font-bold text-xs">×</span>}
                    </div>
                    <span className="text-slate-300">{item}</span>
                </li>
            ))}
        </ul>
    </div>
);


// --- Componente Principal de la Página de Soluciones para el Joven con Ambición ---
export default function JovenConAmbicionPage() {
    return (
        <>
            <GlobalStyles />
            <div className="bg-slate-900 text-white">
                <StrategicNavigation />

                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-[var(--creatuactivo-blue)] opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-[var(--creatuactivo-purple)] opacity-10 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
                </div>

                <main className="relative z-10 p-4 lg:p-8">
                    <section className="pt-20 text-center max-w-4xl mx-auto py-20 lg:py-28">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <div className="inline-block bg-yellow-500/10 text-yellow-300 font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6 border border-yellow-500/30">
                                Solución para el Joven con Ambición
                            </div>
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl mb-6">
                                Del Potencial al Activo.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                                No esperes a graduarte para empezar a construir tu futuro. Te entregamos la arquitectura para convertir tu ambición en un activo que crezca contigo.
                            </p>
                        </motion.div>
                    </section>

                    <section className="max-w-7xl mx-auto mb-20 lg:mb-32">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">La Carrera de Obstáculos</h2>
                            <p className="text-slate-400 text-lg">El camino tradicional te pide que acumules deudas y esperes años por un "buen" trabajo, solo para empezar desde cero a construir el sueño de alguien más.</p>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-8">
                            <ContrastCard
                                title="El Camino Tradicional"
                                items={[
                                    "Acumular deuda estudiantil sin garantía de retorno.",
                                    "Competir por trabajos de nivel de entrada.",
                                    "Empezar a construir tu patrimonio a los 25 o 30.",
                                    "Aprender teoría, sin experiencia práctica en activos."
                                ]}
                            />
                            <ContrastCard
                                title="La Arquitectura del Activo Anticipado"
                                items={[
                                    "Generar flujos de valor mientras estudias.",
                                    "Crear tu propio activo en lugar de buscar un empleo.",
                                    "Graduarte con un activo que ya genera ingresos.",
                                    "Aprender construyendo un negocio real."
                                ]}
                                isNewWorld={true}
                            />
                        </div>
                    </section>

                    <section className="max-w-5xl mx-auto mb-20 lg:mb-32 creatuactivo-component-card p-8 md:p-12">
                         <div className="text-center mb-12">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-4xl font-bold">La Solución: Tu Ecosistema de Arranque</h2>
                            <p className="text-slate-400 mt-2">Así es como nuestra arquitectura te da una ventaja injusta:</p>
                        </div>
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="bg-blue-500/10 p-4 rounded-xl"><Zap className="w-8 h-8 text-blue-300"/></div>
                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="text-xl font-bold text-white">Aprende y Gana, simultáneamente</h4>
                                    <p className="text-slate-400">Nuestro ecosistema es la mejor escuela de negocios. Aplicas conceptos de marketing, ventas y liderazgo en un sistema real mientras construyes un activo que genera ingresos.</p>
                                </div>
                            </div>
                             <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="bg-purple-500/10 p-4 rounded-xl"><BrainCircuit className="w-8 h-8 text-purple-300"/></div>
                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="text-xl font-bold text-white">Construye tu Red Profesional</h4>
                                    <p className="text-slate-400">Conectarás con una comunidad de constructores, mentores y líderes. Te graduarás no solo con un título, sino con una red de contactos de alto valor que te apoyará de por vida.</p>
                                </div>
                            </div>
                             <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="bg-yellow-500/10 p-4 rounded-xl"><ShieldCheck className="w-8 h-8 text-yellow-300"/></div>
                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="text-xl font-bold text-white">Baja Inversión, Alto Potencial</h4>
                                    <p className="text-slate-400">El paquete Emprendedor está diseñado para ti. Con una inversión mínima, obtienes acceso a un ecosistema tecnológico de un millón de dólares y a un modelo de negocio con potencial ilimitado.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="text-center py-20">
                         <div className="max-w-3xl mx-auto">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-6">El Futuro no se Espera, se Construye.</h2>
                            <p className="text-slate-400 text-lg mb-10">Mientras otros esperan por una oportunidad, los arquitectos la construyen. Es hora de empezar a construir la tuya.</p>
                            <Link href="/presentacion-empresarial" className="creatuactivo-cta-ecosystem text-lg inline-block">
                                Ver la Arquitectura del Ecosistema
                            </Link>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
