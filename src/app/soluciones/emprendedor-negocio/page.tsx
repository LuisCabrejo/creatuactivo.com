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

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, BrainCircuit, ShieldCheck } from 'lucide-react'
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


// --- Componente Principal de la Página de Soluciones para el Emprendedor y Dueño de Negocio ---
export default function EmprendedorActualPage() {
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
                            <div className="inline-block bg-orange-500/10 text-orange-300 font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6 border border-orange-500/30">
                                Solución para Emprendedores y Dueños de Negocio
                            </div>
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl mb-6">
                                Del Operador al Arquitecto.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                                Tu negocio es exitoso, pero te consume. Te entregamos el ecosistema para convertir tu operación en un activo que se escala sin ti.
                            </p>
                        </motion.div>
                    </section>

                    <section className="max-w-7xl mx-auto mb-20 lg:mb-32">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">La Paradoja del Crecimiento</h2>
                            <p className="text-slate-400 text-lg">Eres el motor de tu negocio, pero también su principal cuello de botella. El crecimiento se detiene cuando tú te detienes.</p>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-8">
                            <ContrastCard
                                title="El Camino del Operador"
                                items={[
                                    "Crecimiento lineal: más ventas = más complejidad y más trabajo.",
                                    "Atrapado en la operación: apagas incendios en lugar de diseñar el futuro.",
                                    "El negocio depende 100% de ti. Si te detienes, todo se detiene.",
                                    "Has construido un gran trabajo, no un verdadero activo."
                                ]}
                            />
                            <ContrastCard
                                title="La Vía del Arquitecto del Ecosistema"
                                items={[
                                    "Crecimiento exponencial: el sistema trabaja y escala por ti.",
                                    "Liberado de la operación para enfocarte en la visión y la estrategia.",
                                    "Escalabilidad infinita a través de la duplicación del sistema.",
                                    "Construyes un activo que funciona sin ti."
                                ]}
                                isNewWorld={true}
                            />
                        </div>
                    </section>

                    <section className="max-w-5xl mx-auto mb-20 lg:mb-32 creatuactivo-component-card p-8 md:p-12">
                         <div className="text-center mb-12">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-4xl font-bold">La Solución: Un Upgrade a tu Sistema Operativo</h2>
                            <p className="text-slate-400 mt-2">Así es como nuestro ecosistema resuelve tus desafíos de escalabilidad:</p>
                        </div>
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="bg-blue-500/10 p-4 rounded-xl"><Zap className="w-8 h-8 text-blue-300"/></div>
                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="text-xl font-bold text-white">Automatización que Libera</h4>
                                    <p className="text-slate-400">El Framework IAA y NEXUS IA se encargan del 80% de las tareas de bajo nivel (presentar, seguir, educar), liberándote para que te dediques a lo que solo tú puedes hacer: la estrategia.</p>
                                </div>
                            </div>
                             <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="bg-purple-500/10 p-4 rounded-xl"><BrainCircuit className="w-8 h-8 text-purple-300"/></div>
                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="text-xl font-bold text-white">Un Sistema Probado, no un Experimento</h4>
                                    <p className="text-slate-400">Deja de reinventar la rueda. Te entregamos una arquitectura de negocio probada y optimizada durante años, lista para que la implementes y escales desde el primer día.</p>
                                </div>
                            </div>
                             <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="bg-yellow-500/10 p-4 rounded-xl"><ShieldCheck className="w-8 h-8 text-yellow-300"/></div>
                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="text-xl font-bold text-white">Diversificación Inteligente de Activos</h4>
                                    <p className="text-slate-400">Añade una nueva unidad de negocio a tu portafolio que no compite por tu tiempo, sino que lo multiplica. Un canal de distribución que crece en paralelo a tus otros emprendimientos.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="text-center py-20">
                         <div className="max-w-3xl mx-auto">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-6">Deja de Operar. Empieza a Arquitectar.</h2>
                            <p className="text-slate-400 text-lg mb-10">Tu visión merece un sistema que pueda seguirle el ritmo. Es hora de dar el salto al siguiente nivel de construcción.</p>
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
