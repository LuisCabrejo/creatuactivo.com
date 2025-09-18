'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Zap, BrainCircuit, Users, Target, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import NodeXSidebar from '@/components/NodeXSidebar'

// --- Estilos CSS Globales (Sin cambios) ---
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
  `}</style>
);

// --- Componente de Tarjeta de Módulo (Sin cambios) ---
const ModuleCard = ({ icon, title, description, status, href }) => (
    <Link href={href} className="block h-full">
        <div className="creatuactivo-component-card p-8 h-full group">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-slate-800/50 p-3 rounded-lg">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">{description}</p>
            <div className="mt-auto flex justify-between items-center">
                <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                    status === 'Completado' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                    {status}
                </span>
                <div className="font-semibold text-blue-400 group-hover:text-blue-300 transition-colors flex items-center">
                    Iniciar <ArrowRight className="inline w-4 h-4 ml-1" />
                </div>
            </div>
        </div>
    </Link>
);

// --- Componente Principal de la Página de Fundamentos (ACTUALIZADO) ---
export default function FundamentosPage() {
    return (
        <>
            <GlobalStyles />
            {/* AJUSTE: Se utiliza NodeXSidebar como el layout principal que envuelve todo el contenido. */}
            <NodeXSidebar>
                <div className="p-6 relative">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="mb-12">
                            <Link href="/nodex/academia" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">&larr; Volver a la Academia</Link>
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-5xl mt-4">
                                Nivel 1: Fundamentos del Constructor.
                            </h1>
                            <p className="text-slate-300 text-lg mt-2">Domina los pilares de tu nuevo activo. En esta fase, te enfocas en la ejecución precisa del sistema para lograr tu primera victoria.</p>
                        </div>

                        <div className="creatuactivo-component-card p-8 md:p-12 mb-12">
                            <div className="grid md:grid-cols-3 gap-8 items-center">
                                <div className="md:col-span-2">
                                    <h2 className="creatuactivo-h2-component text-3xl font-bold mb-4">Tu Misión Principal</h2>
                                    <p className="text-slate-300 mb-6">Tu único objetivo en esta fase es simple y poderoso: **ejecutar tu primer INICIAR con éxito**. Nuestra herramienta de inteligencia está diseñada para guiarte paso a paso. Al completar este módulo, no solo entenderás el sistema, lo habrás puesto a trabajar para ti.</p>
                                    <Link href="/nodex/inteligencia/primer-iniciar" className="creatuactivo-cta-ecosystem text-base inline-block">
                                        Ir al Centro de Inteligencia
                                    </Link>
                                </div>
                                <div className="hidden md:flex items-center justify-center">
                                    <div className="relative w-48 h-48">
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-full"></motion.div>
                                        <div className="absolute inset-8 flex items-center justify-center bg-slate-800/50 rounded-full">
                                            <Target size={48} className="text-yellow-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-12">
                             <h2 className="creatuactivo-h2-component text-3xl font-bold mb-8">Módulos de Aprendizaje</h2>
                             <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                                <ModuleCard
                                    icon={<Zap className="w-6 h-6 text-blue-400" />}
                                    title="Maestría del Framework IAA"
                                    description="Profundiza en la filosofía detrás de Iniciar, Acoger y Activar. Entiende por qué este sistema redefine por completo el juego."
                                    status="Recomendado"
                                    href="/sistema/framework-iaa" // Enlace a la página pública para repaso
                                />
                                <ModuleCard
                                    icon={<BrainCircuit className="w-6 h-6 text-purple-400" />}
                                    title="Psicología del Constructor Inteligente"
                                    description="Aprende a identificar y comunicarte con cada uno de los arquetipos. Domina el lenguaje de la nueva categoría."
                                    status="Siguiente Lección"
                                    href="/nodex/academia/psicologia-constructor"
                                />
                                <ModuleCard
                                    icon={<Users className="w-6 h-6 text-green-400" />}
                                    title="Operación del Centro de Comando NodeX"
                                    description="Un tour completo por tu dashboard. Aprende a interpretar tus métricas y a usar tu arsenal de enlaces como un profesional."
                                    status="Por Empezar"
                                    href="/nodex" // Enlace al dashboard
                                />
                                <ModuleCard
                                    icon={<CheckCircle className="w-6 h-6 text-yellow-400" />}
                                    title="Conversaciones Estratégicas con ACE"
                                    description="Domina el Asistente de Conversación Estratégica. Entrena en el simulador y prepárate para tus llamadas de ACOGER."
                                    status="Por Empezar"
                                    href="/nodex/inteligencia/asistente-conversacion-estrategica"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </NodeXSidebar>
        </>
    );
}
