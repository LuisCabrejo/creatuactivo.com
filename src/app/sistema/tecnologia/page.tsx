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
import { ArrowRight, BrainCircuit, Zap, Server, Check } from 'lucide-react'
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

// --- Componente de Tarjeta de Tecnología ---
const TechCard = ({ icon, title, description, children }) => (
    <div className="creatuactivo-component-card p-8 md:p-12 h-full">
        <div className="flex items-center gap-4 mb-4">
            <div className="bg-slate-800/50 p-4 rounded-xl">
                {icon}
            </div>
            <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</p>
            </div>
        </div>
        <div className="text-slate-300 space-y-4">
            {children}
        </div>
    </div>
);


// --- Componente Principal de la Página de Tecnología ---
export default function TecnologiaPage() {
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
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl mb-6">
                                La Ventaja Tecnológica.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                                No solo te damos un sistema, te entregamos el arsenal tecnológico que lo hace invencible. Esta es la maquinaria que automatiza el 80% de tu trabajo.
                            </p>
                        </motion.div>
                    </section>

                    <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 mb-20 lg:mb-32">
                        <TechCard
                            icon={<BrainCircuit className="w-10 h-10 text-purple-400" />}
                            title="NEXUS: Tu Copiloto de IA"
                        >
                            <h3 className="creatuactivo-h2-component text-3xl font-bold">La Inteligencia que Guía</h3>
                            <p>NEXUS es más que un chatbot. Es un asesor estratégico entrenado para tener conversaciones de alto valor. Su misión es educar, cualificar y preparar a tus constructores potenciales, para que tú solo intervengas cuando tu toque humano es verdaderamente decisivo.</p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-400" /><span>Inteligencia Emocional y Contextual</span></li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-400" /><span>Automatización del Seguimiento</span></li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-400" /><span>Disponibilidad 24/7 para tu Canal</span></li>
                            </ul>
                        </TechCard>

                        <TechCard
                            icon={<Server className="w-10 h-10 text-blue-400" />}
                            title="Tu Centro de Comando"
                        >
                             <h3 className="creatuactivo-h2-component text-3xl font-bold">El Poder que Ejecuta</h3>
                            <p>La aplicación CreaTuActivo es el motor de automatización y el dashboard donde operas tu activo. Es tu centro de comando unificado que te da una visión de 360° de tu negocio y las herramientas para ejecutar Los 3 Pasos: IAA con una eficiencia sin precedentes.</p>
                             <ul className="space-y-2">
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-400" /><span>Dashboard con Métricas en Tiempo Real</span></li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-400" /><span>Generador de Mensajes Estratégicos</span></li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-400" /><span>Simuladores de Activos y Proyecciones</span></li>
                            </ul>
                        </TechCard>
                    </section>

                    <section className="max-w-4xl mx-auto text-center mb-20 lg:mb-32">
                        <div className="text-center mb-12">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">La Sinergia del Ecosistema</h2>
                            <p className="text-slate-400 text-lg">NEXUS y la aplicación CreaTuActivo no son herramientas separadas. Son un sistema integrado que crea un ciclo de crecimiento virtuoso.</p>
                        </div>
                        <div className="relative flex flex-col md:flex-row items-center justify-center gap-8">
                            <div className="text-center">
                                <div className="bg-purple-500/10 p-4 rounded-full inline-block mb-2"><BrainCircuit className="w-8 h-8 text-purple-400"/></div>
                                <p className="font-bold">NEXUS</p>
                                <p className="text-sm text-slate-400">Genera Conversaciones</p>
                            </div>
                            <div className="text-4xl font-thin text-slate-500 animate-pulse">
                                <ArrowRight />
                            </div>
                             <div className="text-center">
                                <div className="bg-blue-500/10 p-4 rounded-full inline-block mb-2"><Server className="w-8 h-8 text-blue-400"/></div>
                                <p className="font-bold">La Aplicación</p>
                                <p className="text-sm text-slate-400">Analiza Datos y Provee Herramientas</p>
                            </div>
                             <div className="text-4xl font-thin text-slate-500 animate-pulse">
                                <ArrowRight />
                            </div>
                             <div className="text-center">
                                <div className="bg-yellow-500/10 p-4 rounded-full inline-block mb-2"><Zap className="w-8 h-8 text-yellow-400"/></div>
                                <p className="font-bold">Constructor</p>
                                <p className="text-sm text-slate-400">Toma Decisiones Estratégicas</p>
                            </div>
                        </div>
                    </section>

                    <section className="text-center py-20">
                         <div className="max-w-3xl mx-auto">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-6">Esta es tu Ventaja Injusta.</h2>
                            <p className="text-slate-400 text-lg mb-10">Ahora que conoces la maquinaria, es momento de ver cómo se integra en la arquitectura completa del negocio.</p>
                            <Link href="/presentacion-empresarial" className="creatuactivo-cta-ecosystem text-lg inline-block">
                                Ver la Arquitectura Completa
                            </Link>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
