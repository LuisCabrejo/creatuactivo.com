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
import { ArrowRight, GraduationCap, Zap, Users, Target, Award, BarChart3, Check } from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'
import { useHydration } from '@/hooks/useHydration'

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

// --- Componente de Tarjeta de Ruta de Aprendizaje ---
const LearningPathCard = ({ level, title, description, modules, icon, color }: { level: string; title: string; description: string; modules: string[]; icon: React.ReactNode; color: string }) => (
    <div className="creatuactivo-component-card p-8 h-full">
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
        <ul className="space-y-2">
            {modules.map((module, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-300">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>{module}</span>
                </li>
            ))}
        </ul>
    </div>
);

// --- Componente Principal de la Página de la Academia ---
export default function AcademiaPage() {
    const isHydrated = useHydration()
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
                    <section className="text-center max-w-4xl mx-auto pt-20 pb-20 lg:pb-28">
                        <motion.div initial={isHydrated ? { opacity: 0, y: 20 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <div className="inline-block bg-indigo-500/10 text-indigo-300 font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6 border border-indigo-500/30">
                                El Ecosistema de Crecimiento
                            </div>
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl mb-6">
                                De Constructor a Maestro Arquitecto.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                                No solo te entregamos las herramientas. Te damos el conocimiento y la ruta para dominarlas. Bienvenido a la academia donde se forman los líderes de la nueva categoría.
                            </p>
                        </motion.div>
                    </section>

                    <section className="max-w-7xl mx-auto mb-20 lg:mb-32">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">Tu Ruta hacia la Maestría</h2>
                            <p className="text-slate-400 text-lg">Un plan de estudios estructurado, diseñado para llevarte desde los fundamentos sólidos hasta las estrategias de escalabilidad más avanzadas.</p>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <LearningPathCard
                                level="Nivel 1"
                                title="Fundamentos del Constructor"
                                description="Domina los pilares de tu nuevo activo. En esta fase, te enfocas en la ejecución precisa del sistema."
                                modules={["Maestría de Los 3 Pasos: IAA", "Psicología del Constructor Inteligente", "Operación de la Aplicación CreaTuActivo", "Conversaciones Estratégicas con NEXUS IA"]}
                                icon={<Zap className="w-8 h-8 text-blue-400" />}
                                color="blue"
                            />
                            <LearningPathCard
                                level="Nivel 2"
                                title="Arquitectura Avanzada"
                                description="Expande tu visión y tus habilidades. Aquí aprendes a duplicar tu éxito y a construir equipos de alto rendimiento."
                                modules={["Estrategias de Expansión de Canal", "Liderazgo y Mentoría Efectiva", "Análisis de Métricas para la Escalabilidad", "Oratoria y Presentaciones de Alto Impacto"]}
                                icon={<Users className="w-8 h-8 text-purple-400" />}
                                color="purple"
                            />
                             <LearningPathCard
                                level="Nivel 3"
                                title="Maestría del Ecosistema"
                                description="Conviértete en un verdadero arquitecto de la nueva categoría, capaz de innovar y liderar a gran escala."
                                modules={["Finanzas para Constructores de Activos", "Estrategias de Mercado Global", "Desarrollo de Sistemas de Duplicación", "Creación de Marca Personal como Líder"]}
                                icon={<BarChart3 className="w-8 h-8 text-yellow-400" />}
                                color="yellow"
                            />
                        </div>
                    </section>

                    <section className="max-w-5xl mx-auto mb-20 lg:mb-32 creatuactivo-component-card p-8 md:p-12">
                         <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="text-center md:text-left">
                                <h2 className="creatuactivo-h2-component text-3xl md:text-4xl font-bold">Certificación de Arquitecto</h2>
                                <p className="text-slate-300 mt-4 mb-6">Al completar cada nivel, no solo adquieres conocimiento, obtienes una certificación que valida tu maestría. Ser un "Arquitecto Certificado de CreaTuActivo.com" es una insignia de excelencia y liderazgo en la industria.</p>
                                <Link href="/presentacion-empresarial" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                    Inicia tu camino en la presentación →
                                </Link>
                            </div>
                            <div className="flex items-center justify-center">
                                <Award className="w-48 h-48 text-yellow-400/80" />
                            </div>
                         </div>
                    </section>

                    <section className="text-center py-20">
                         <div className="max-w-3xl mx-auto">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-6">Tu Mayor Activo eres Tú.</h2>
                            <p className="text-slate-400 text-lg mb-10">Invertir en tu crecimiento es la decisión más rentable que puedes tomar. Nuestro ecosistema está diseñado para asegurar que esa inversión dé los frutos más altos.</p>
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
