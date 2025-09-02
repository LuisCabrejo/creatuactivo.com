'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BrainCircuit, Lightbulb, MessageSquare, ArrowRight, BarChart3 } from 'lucide-react'
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

// --- Componente de Tarjeta de Herramienta ---
const ToolCard = ({ icon, title, description, href, ctaText }) => (
    <div className="creatuactivo-component-card p-8 h-full flex flex-col">
        <div className="flex items-center gap-4 mb-4">
            <div className="bg-slate-800/50 p-3 rounded-lg">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-slate-400 flex-grow mb-6">{description}</p>
        <Link href={href} className="mt-auto font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center">
            {ctaText} <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
    </div>
);


// --- Componente Principal de la Página "Centro de Inteligencia" ---
export default function InteligenciaPage() {
    // Datos de ejemplo para informes de inteligencia
    const prospects = [
        { name: 'Ana María Rojas', status: 'ACOGER', engagement: 'Alto' },
        { name: 'Nelson López', status: 'INICIAR', engagement: 'Medio' },
        { name: 'Henry Agricultor', status: 'INICIAR', engagement: 'Bajo' },
    ];

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
                        {/* Header Centro de Inteligencia */}
                        <div className="mb-12">
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-5xl">
                                Centro de Inteligencia.
                            </h1>
                            <p className="text-slate-300 text-lg mt-2">Tu arsenal para ejecutar las fases de INICIAR y ACOGER con una ventaja decisiva.</p>
                        </div>

                        {/* Herramientas de Inteligencia */}
                        <div className="grid lg:grid-cols-2 gap-8 mb-12">
                            <ToolCard
                                icon={<Lightbulb className="w-6 h-6 text-yellow-400"/>}
                                title="Generador de Mensajes Inteligentes"
                                description="Usa la IA para crear un mensaje de INICIAR hiper-personalizado para tu próximo constructor potencial. Define el perfil y deja que NEXUS cree la invitación perfecta."
                                href="/nodex/inteligencia/primer-iniciar"
                                ctaText="Crear un Nuevo INICIAR"
                            />
                            <ToolCard
                                icon={<MessageSquare className="w-6 h-6 text-purple-400"/>}
                                title="Asistente de Conversación (ACE)"
                                description="Prepara tu llamada de ACOGER. Carga el informe de inteligencia de tu prospecto y entrena en el simulador para manejar cualquier objeción con maestría."
                                href="/nodex/inteligencia/asistente-conversacion-estrategica"
                                ctaText="Entrenar para un ACOGER"
                            />
                        </div>

                        {/* Informes de Inteligencia */}
                        <div className="creatuactivo-ecosystem-card p-8">
                            <h2 className="creatuactivo-h2-component text-2xl font-bold mb-6">Tus Informes de Inteligencia</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/10 text-sm text-slate-400">
                                            <th className="p-4">Constructor Potencial</th>
                                            <th className="p-4">Estado Actual</th>
                                            <th className="p-4">Nivel de Engagement</th>
                                            <th className="p-4">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prospects.map((p, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-semibold text-white">{p.name}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.status === 'ACOGER' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-slate-300">{p.engagement}</td>
                                                <td className="p-4">
                                                    <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
                                                        Ver Informe
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Empty State para cuando no hay datos */}
                            {prospects.length === 0 && (
                                <div className="text-center py-12">
                                    <BrainCircuit className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                    <p className="text-slate-400 mb-2">Aún no tienes informes de inteligencia</p>
                                    <p className="text-slate-500 text-sm">Los informes aparecerán cuando constructores potenciales interactúen con tus enlaces</p>
                                </div>
                            )}
                        </div>

                    </motion.div>
                </main>
            </div>
        </>
    );
}
