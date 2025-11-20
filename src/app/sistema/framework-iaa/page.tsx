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

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Users, Target, ArrowRight, Check, X } from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'

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

    .creatuactivo-cta-ecosystem:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(30, 64, 175, 0.5);
    }
  `}</style>
);

// --- Componente de Pestaña para el Framework (Sin cambios) ---
const FrameworkTab = ({ phase, title, icon, color, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 p-4 md:p-6 text-center rounded-t-lg border-b-4 transition-all duration-300 ${
            isActive ? `${color} text-white` : 'border-transparent text-slate-400 hover:bg-slate-800/50'
        }`}
    >
        <div className="flex items-center justify-center gap-3">
            {icon}
            <span className="font-bold text-lg">{title}</span>
        </div>
    </button>
);

// --- Componente Principal de la Página del Framework IAA (ACTUALIZADO) ---
export default function FrameworkIAAPage() {
    const [activeTab, setActiveTab] = useState('iniciar');

    const frameworkContent = {
        iniciar: {
            title: "INICIAR: La Chispa",
            description: "Tu rol no es convencer, es conectar. INICIAR es usar CreaTuActivo para despertar la curiosidad y atraer a las personas correctas, mientras la aplicación hace el trabajo pesado de responder preguntas iniciales.",
            yourRole: "Compartir la oportunidad con personas que podrían estar interesadas.",
            systemRole: "NEXUS responde preguntas y califica interés 24/7 automáticamente.",
            oldWay: "Perseguir amigos y familiares con presentaciones interminables.",
            newWay: "Atraer personas que ya están interesadas."
        },
        acoger: {
            title: "ACOGER: Tu Conversación Personal",
            description: "Aquí es donde tu toque humano se vuelve importante. Cuando CreaTuActivo te notifica que alguien está listo, tu rol es ACOGER con una conversación personal, resolver sus dudas finales y construir confianza.",
            yourRole: "Tener una conversación de confianza que aporta claridad.",
            systemRole: "Notificarte en el momento preciso y darte la información para la conversación.",
            oldWay: "Hacer seguimiento manual y desgastante.",
            newWay: "Intervenir solo cuando es el momento correcto."
        },
        activar: {
            title: "ACTIVAR: Ayudar a Otros a Empezar",
            description: "ACTIVAR no es un cierre, es dar poder a otra persona. Le entregas a un nuevo constructor su propia aplicación CreaTuActivo y lo acompañas en su primer INICIAR. Aquí es donde tu red comienza a crecer.",
            yourRole: "Enseñar a otros a usar la aplicación.",
            systemRole: "Dar acceso completo a CreaTuActivo para el nuevo constructor.",
            oldWay: "Entrenar desde cero con métodos diferentes cada vez.",
            newWay: "Entregar una aplicación lista para usar."
        }
    };

    const currentContent = frameworkContent[activeTab];

    return (
        <>
            <GlobalStyles />
            <div className="bg-slate-900 text-white">
                <StrategicNavigation />

                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-[var(--creatuactivo-blue)] opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-[var(--creatuactivo-purple)] opacity-10 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
                    <div className="absolute -bottom-1/4 left-1/3 w-96 h-96 bg-[var(--creatuactivo-gold)] opacity-10 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
                </div>

                <main className="relative z-10 p-4 lg:p-8">
                    <section className="pt-20 text-center max-w-4xl mx-auto py-20 lg:py-28">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <div className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6 border border-blue-500/30">
                                3 Pasos Simples
                            </div>
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl mb-6">
                                Los 3 Pasos: IAA
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                                No te vendemos un "qué", te entregamos un "cómo". <span className="text-white font-semibold">Estos son los 3 pasos probados</span> que te permiten construir tu red de distribución con productos únicos en el mundo.
                            </p>
                        </motion.div>
                    </section>

                    <section className="max-w-5xl mx-auto mb-20 lg:mb-32">
                        <div className="creatuactivo-component-card p-8 grid md:grid-cols-2 gap-8 items-center">
                            <div className="text-left">
                                <h2 className="creatuactivo-h2-component text-3xl font-bold mb-4">Del Esfuerzo al Sistema</h2>
                                <p className="text-slate-300 mb-6">Los modelos tradicionales te exigen ser un experto en todo: vendedor, presentador, motivador y técnico. Los 3 Pasos IAA redefinen tu rol: <span className="text-white font-semibold">solo haces 3 cosas simples</span> y CreaTuActivo hace el resto.</p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-500/20 p-2 rounded-full"><X className="w-5 h-5 text-red-400"/></div>
                                        <span className="text-slate-400">Trabajo Manual y Repetitivo</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-500/20 p-2 rounded-full"><Check className="w-5 h-5 text-green-400"/></div>
                                        <span className="text-white font-semibold">Tecnología Trabajando para Ti</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="relative w-64 h-64">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-full"></motion.div>
                                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute inset-4 border-2 border-dashed border-purple-500/30 rounded-full"></motion.div>
                                    <div className="absolute inset-8 flex items-center justify-center bg-slate-800/50 rounded-full">
                                        <Zap size={48} className="text-yellow-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="max-w-5xl mx-auto mb-20 lg:mb-32">
                        <div className="flex flex-col md:flex-row bg-slate-800/50 rounded-t-lg border-b-0">
                            <FrameworkTab
                                title="Iniciar"
                                icon={<Zap size={24} />}
                                color="border-blue-500"
                                isActive={activeTab === 'iniciar'}
                                onClick={() => setActiveTab('iniciar')}
                            />
                            <FrameworkTab
                                title="Acoger"
                                icon={<Users size={24} />}
                                color="border-purple-500"
                                isActive={activeTab === 'acoger'}
                                onClick={() => setActiveTab('acoger')}
                            />
                            <FrameworkTab
                                title="Activar"
                                icon={<Target size={24} />}
                                color="border-green-500"
                                isActive={activeTab === 'activar'}
                                onClick={() => setActiveTab('activar')}
                            />
                        </div>
                        <div className="creatuactivo-component-card rounded-t-none p-8 md:p-12">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-3xl font-bold text-white mb-4">{currentContent.title}</h3>
                                    <p className="text-slate-300 text-lg mb-8">{currentContent.description}</p>
                                    <div className="grid md:grid-cols-2 gap-6 text-left">
                                        <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10">
                                            <p className="font-semibold text-white mb-1">Tu Rol Estratégico:</p>
                                            <p className="text-slate-400">{currentContent.yourRole}</p>
                                        </div>
                                        <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10">
                                            <p className="font-semibold text-white mb-1">El Rol de CreaTuActivo:</p>
                                            <p className="text-slate-400">{currentContent.systemRole}</p>
                                        </div>
                                        <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/20">
                                            <p className="font-semibold text-red-400 mb-1">El Viejo Mundo:</p>
                                            <p className="text-slate-400 line-through">{currentContent.oldWay}</p>
                                        </div>
                                        <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/20">
                                            <p className="font-semibold text-green-400 mb-1">El Nuevo Mundo:</p>
                                            <p className="text-slate-300">{currentContent.newWay}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </section>

                    <section className="text-center py-20">
                         <div className="max-w-3xl mx-auto">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-6">El Sistema es tu Ventaja</h2>
                            <p className="text-slate-400 text-lg mb-10">Ahora que conoces los 3 pasos, el siguiente paso es ver cómo funciona CreaTuActivo completo.</p>
                            <Link href="/presentacion-empresarial" className="creatuactivo-cta-ecosystem text-lg inline-block">
                                Ver la Presentación Completa
                            </Link>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
