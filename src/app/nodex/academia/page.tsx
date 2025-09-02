'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Zap, Users, BarChart3, BookOpen, Video, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import NodeXSidebar from '@/components/NodeXSidebar'

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

    .creatuactivo-ecosystem-card {
      background: linear-gradient(135deg,
        rgba(30, 64, 175, 0.15) 0%,
        rgba(124, 58, 237, 0.15) 50%,
        rgba(245, 158, 11, 0.15) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }

    .creatuactivo-ecosystem-card:hover {
      border-color: rgba(245, 158, 11, 0.5);
      transform: translateY(-4px) scale(1.02);
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

// --- Componente de Tarjeta de Ruta de Aprendizaje ---
const LearningPathCard = ({ level, title, description, icon, color, href }) => (
    <Link href={href} className="block h-full">
        <div className="creatuactivo-component-card p-8 h-full group">
            <div className="flex items-center gap-4 mb-4">
                <div className={`inline-block bg-${color}-500/10 p-3 rounded-xl`}>
                    {icon}
                </div>
                <div>
                    <p className={`text-sm font-bold text-${color}-400 uppercase tracking-wider`}>{level}</p>
                    <h3 className="text-2xl font-bold text-white">{title}</h3>
                </div>
            </div>
            <p className="text-slate-400 mb-6">{description}</p>
            <div className="mt-auto font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                Iniciar Módulo <ArrowRight className="inline w-4 h-4" />
            </div>
        </div>
    </Link>
);

// --- Componente Principal de la Página de la Academia en NodeX ---
export default function AcademiaNodeXPage() {
    return (
        <>
            <GlobalStyles />
            {/* LAYOUT NODEX CON SIDEBAR - Arquitectura dual establecida */}
            <div className="flex min-h-screen bg-slate-900">
                <NodeXSidebar />

                {/* CONTENIDO PRINCIPAL - Sin pt-20 porque sidebar no es header fijo */}
                <main className="flex-1 p-6 text-white">
                    {/* Background Effects */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                        <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-[var(--creatuactivo-blue)] opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-[var(--creatuactivo-purple)] opacity-10 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 max-w-6xl mx-auto"
                    >
                        {/* Header Academia */}
                        <div className="mb-12">
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-5xl">
                                La Academia de Arquitectos.
                            </h1>
                            <p className="text-slate-300 text-lg mt-2">Tu centro de conocimiento para pasar de constructor a maestro del ecosistema.</p>
                        </div>

                        {/* CTA Principal */}
                        <div className="creatuactivo-ecosystem-card p-8 md:p-12 mb-12 bg-gradient-to-br from-[var(--creatuactivo-blue)]/20 to-[var(--creatuactivo-purple)]/20">
                            <div className="grid md:grid-cols-3 gap-8 items-center">
                                <div className="md:col-span-2">
                                    <h2 className="creatuactivo-h2-component text-3xl font-bold mb-4">Tu Próximo Nivel te Espera</h2>
                                    <p className="text-slate-300 mb-6">Tu crecimiento es la métrica más importante. Hemos diseñado una ruta de aprendizaje clara para llevarte desde tu primera victoria hasta la maestría en la construcción de activos.</p>
                                    <Link href="/nodex/inteligencia/primer-iniciar" className="creatuactivo-cta-ecosystem text-base inline-block">
                                        Comenzar mi Primera Misión
                                    </Link>
                                </div>
                                <div className="hidden md:flex items-center justify-center">
                                    <GraduationCap className="w-32 h-32 text-purple-400/50" />
                                </div>
                            </div>
                        </div>

                        {/* Rutas de Aprendizaje */}
                        <div className="mb-12">
                             <h2 className="creatuactivo-h2-component text-3xl font-bold mb-8">Rutas de Aprendizaje</h2>
                             <div className="grid lg:grid-cols-3 gap-8">
                                <LearningPathCard
                                    level="Nivel 1"
                                    title="Fundamentos del Constructor"
                                    description="Domina los pilares de tu nuevo activo. En esta fase, te enfocas en la ejecución precisa del sistema."
                                    icon={<Zap className="w-8 h-8 text-blue-400" />}
                                    color="blue"
                                    href="/nodex/academia/fundamentos"
                                />
                                <LearningPathCard
                                    level="Nivel 2"
                                    title="Arquitectura Avanzada"
                                    description="Expande tu visión y tus habilidades. Aquí aprendes a duplicar tu éxito y a construir equipos de alto rendimiento."
                                    icon={<Users className="w-8 h-8 text-purple-400" />}
                                    color="purple"
                                    href="/nodex/academia/arquitectura-avanzada"
                                />
                                 <LearningPathCard
                                    level="Nivel 3"
                                    title="Maestría del Ecosistema"
                                    description="Conviértete en un verdadero arquitecto de la nueva categoría, capaz de innovar y liderar a gran escala."
                                    icon={<BarChart3 className="w-8 h-8 text-yellow-400" />}
                                    color="yellow"
                                    href="/nodex/academia/maestria"
                                />
                            </div>
                        </div>

                        {/* Biblioteca de Maestros */}
                        <div className="creatuactivo-ecosystem-card p-8">
                            <h2 className="creatuactivo-h2-component text-2xl font-bold mb-6">La Biblioteca de Maestros</h2>
                            <p className="text-slate-400 mb-6">Aprende de los mejores. Accede a grabaciones y análisis de conversaciones reales de los arquitectos más exitosos del ecosistema.</p>
                             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Videos de la biblioteca */}
                                <div className="bg-slate-900/50 p-4 rounded-lg flex items-center gap-4 hover:bg-slate-900/70 transition-colors cursor-pointer">
                                    <div className="bg-slate-800 p-3 rounded-lg"><Video className="w-6 h-6 text-red-400"/></div>
                                    <div>
                                        <p className="font-semibold text-white text-sm">Manejando la objeción "No tengo tiempo"</p>
                                        <p className="text-xs text-slate-500">Por: Luis Cabrejo</p>
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-lg flex items-center gap-4 hover:bg-slate-900/70 transition-colors cursor-pointer">
                                     <div className="bg-slate-800 p-3 rounded-lg"><Video className="w-6 h-6 text-red-400"/></div>
                                    <div>
                                        <p className="font-semibold text-white text-sm">Del "Costo" a la "Inversión"</p>
                                        <p className="text-xs text-slate-500">Por: Liliana Moreno</p>
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-lg flex items-center gap-4 opacity-50">
                                     <div className="bg-slate-800 p-3 rounded-lg"><BookOpen className="w-6 h-6 text-slate-500"/></div>
                                    <div>
                                        <p className="font-semibold text-white text-sm">Próximamente...</p>
                                        <p className="text-xs text-slate-500">Nuevos casos de estudio cada semana</p>
                                    </div>
                                </div>
                             </div>
                        </div>

                    </motion.div>
                </main>
            </div>
        </>
    );
}
