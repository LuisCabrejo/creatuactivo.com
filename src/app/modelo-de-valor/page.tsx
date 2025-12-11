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
import { ArrowRight, DollarSign, TrendingUp, Award, CheckCircle, BarChart3 } from 'lucide-react'
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

// --- Componente de Tarjeta de Fase ---
const PhaseCard = ({ icon, phase, title, description, incomeTypes }: { icon: React.ReactNode; phase: string; title: string; description: string; incomeTypes: string[] }) => (
    <div className="creatuactivo-component-card p-8 h-full">
        <div className="flex items-center gap-4 mb-4">
            <div className="bg-slate-800/50 p-3 rounded-xl">
                {icon}
            </div>
            <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{phase}</p>
                <h3 className="text-2xl font-bold text-white">{title}</h3>
            </div>
        </div>
        <p className="text-slate-400 mb-6">{description}</p>
        <div className="border-t border-white/10 pt-4">
            <p className="text-sm font-semibold text-white mb-2">Fuentes de Valor Principales:</p>
            <ul className="space-y-2">
                {incomeTypes.map((type, index) => (
                    <li key={index} className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{type}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

// --- Componente Principal de la Página de Modelo de Distribución de Valor ---
export default function ModeloDeValorPage() {
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
                    <section className="pt-20 text-center max-w-4xl mx-auto py-20 lg:py-28">
                        <motion.div initial={isHydrated ? { opacity: 0, y: 20 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl mb-6">
                                El Modelo de Distribución de Valor.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                                No es un "plan de pagos". Es la arquitectura financiera que recompensa la construcción de un activo real en tres fases estratégicas: a corto, mediano y largo plazo.
                            </p>
                        </motion.div>
                    </section>

                    <section className="max-w-7xl mx-auto mb-20 lg:mb-32">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">Las 3 Fases de un Activo Sólido</h2>
                            <p className="text-slate-400 text-lg">Nuestro modelo de valor está diseñado para acompañarte en cada etapa de tu viaje como arquitecto.</p>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <PhaseCard
                                phase="Fase 1: Corto Plazo"
                                title="Capitalización"
                                icon={<DollarSign className="w-8 h-8 text-blue-400" />}
                                description="El objetivo es validar el modelo y generar un retorno sobre tu inversión inicial de forma ágil, demostrando la efectividad del sistema desde el principio."
                                incomeTypes={[
                                    "Bonos por Activación de Nuevos Constructores (GEN 1-5)",
                                    "Valor por Volumen de Paquetes Empresariales (Binario)",
                                ]}
                            />
                            <PhaseCard
                                phase="Fase 2: Mediano Plazo"
                                title="Expansión"
                                icon={<TrendingUp className="w-8 h-8 text-purple-400" />}
                                description="Aquí comienza la verdadera construcción de tu activo. El sistema te recompensa por el volumen de valor que fluye a través de todo tu canal de distribución."
                                incomeTypes={[
                                    "Valor Residual por Consumo del Canal (Binario Recurrente)",
                                    "Bonos de Liderazgo por Desarrollo de Equipos",
                                ]}
                            />
                            <PhaseCard
                                phase="Fase 3: Largo Plazo"
                                title="Legado"
                                icon={<Award className="w-8 h-8 text-yellow-400" />}
                                description="La meta estratégica: un activo empresarial que genera un flujo de valor pasivo, mensual y heredable, basado en el consumo global de tu ecosistema."
                                incomeTypes={[
                                    "Ingreso Residual Consolidado",
                                    "Participación en Pools de Liderazgo Global",
                                    "Incentivos y Viajes de Élite",
                                ]}
                            />
                        </div>
                         <div className="text-center mt-12">
                            <p className="text-slate-400">Estas son las fuentes principales. En total, el ecosistema distribuye el valor de **12 formas diferentes**.</p>
                        </div>
                    </section>

                    <section className="max-w-5xl mx-auto mb-20 lg:mb-32 creatuactivo-component-card p-8 md:p-12">
                         <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="text-center md:text-left">
                                <h2 className="creatuactivo-h2-component text-3xl md:text-4xl font-bold">Visualiza tu Potencial</h2>
                                <p className="text-slate-300 mt-4 mb-6">La mejor forma de entender el modelo es verlo en acción. Nuestra página de Presentación incluye un simulador interactivo donde puedes proyectar los dos flujos de valor principales: la capitalización y el ingreso residual.</p>
                                <Link href="/presentacion-empresarial" className="font-bold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center">
                                    Ir al Simulador Interactivo <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                            <div className="flex items-center justify-center">
                                {/* Placeholder para una imagen o animación del simulador */}
                                <div className="w-full aspect-video bg-slate-900/50 rounded-lg border border-white/10 flex items-center justify-center">
                                    <BarChart3 className="w-24 h-24 text-purple-400/50" />
                                </div>
                            </div>
                         </div>
                    </section>

                    <section className="text-center py-20">
                         <div className="max-w-3xl mx-auto">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-6">La Transparencia es Poder.</h2>
                            <p className="text-slate-400 text-lg mb-10">Has visto la arquitectura financiera. Ahora, el siguiente paso es activar tu posición y empezar a construir tu propio flujo de valor.</p>
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
