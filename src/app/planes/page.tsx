'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Zap, BrainCircuit, BarChart3, Rocket, Crown, FileSpreadsheet, Users, School, MessageSquare, Gift } from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'

// --- Estilos CSS Globales (Actualizados para 4 planes) ---
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --creatuactivo-blue: #1E40AF;
      --creatuactivo-purple: #7C3AED;
      --creatuactivo-gold: #F59E0B;
      --creatuactivo-green: #10B981;
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
    .creatuactivo-plan-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
      position: relative;
    }
    .creatuactivo-plan-card:hover {
      transform: translateY(-8px);
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2);
    }
    .creatuactivo-plan-card-recommended {
        border-color: var(--creatuactivo-gold);
        box-shadow: 0 0 40px rgba(245, 158, 11, 0.2);
    }
    .creatuactivo-plan-card-free {
        border-color: var(--creatuactivo-green);
        box-shadow: 0 0 30px rgba(16, 185, 129, 0.15);
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

// --- Componente de Tarjeta de Plan Tecnológico (ACTUALIZADO para 4 planes) ---
const PlanCard = ({
  icon,
  title,
  price,
  priceCOP,
  profile,
  features,
  recommended = false,
  free = false,
  timeLimit,
  networkSize,
  ctaText = "Activar como Fundador",
  ctaLink = "/fundadores"
}) => (
    <div className={`creatuactivo-plan-card h-full flex flex-col ${
      recommended ? 'creatuactivo-plan-card-recommended' :
      free ? 'creatuactivo-plan-card-free' : ''
    }`}>
        {recommended && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--creatuactivo-gold)] text-slate-900 text-xs font-bold uppercase px-4 py-1 rounded-full z-10">
                Más Popular
            </div>
        )}
        {free && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--creatuactivo-green)] text-white text-xs font-bold uppercase px-4 py-1 rounded-full z-10">
                Comienza Gratis
            </div>
        )}
        <div className="p-8 flex-grow flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              {icon}
              <h3 className="text-2xl font-bold text-white">{title}</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6 h-10">{profile}</p>
            <div className="mb-6">
                {free ? (
                    <div>
                        <span className="text-5xl font-extrabold text-green-400">Gratis</span>
                        <p className="text-sm text-slate-500">Para siempre</p>
                    </div>
                ) : (
                    <div>
                        <span className="text-5xl font-extrabold text-white">${price}</span>
                        <span className="text-slate-400"> USD/mes</span>
                        <p className="text-sm text-slate-500">~ ${priceCOP} COP / mes</p>
                    </div>
                )}
            </div>

            {/* Métricas clave visibles */}
            <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-slate-400">Constructores en Red</p>
                        <p className="font-bold text-blue-400">{networkSize}</p>
                    </div>
                    <div>
                        <p className="text-slate-400">Límite NEXUS</p>
                        <p className="font-bold text-purple-400">{timeLimit}</p>
                    </div>
                </div>
            </div>

            <ul className="space-y-3 text-slate-300 flex-grow mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: feature }} />
                    </li>
                ))}
            </ul>
            <Link href={ctaLink} className={`w-full text-center font-semibold py-3 px-5 rounded-lg transition-colors duration-300 mt-auto ${
              free ? 'bg-green-600 text-white hover:bg-green-500' :
              recommended ? 'bg-[var(--creatuactivo-purple)] text-white hover:bg-purple-500' :
              'bg-slate-700/70 text-white hover:bg-slate-700'
            }`}>
                {ctaText}
            </Link>
        </div>
    </div>
);

// --- Componente Principal de la Página de Planes Tecnológicos (ACTUALIZADO) ---
export default function PlanesTecnologicosPage() {
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
                    <section className="text-center max-w-4xl mx-auto py-20 lg:py-28 pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-block bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-300 font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6 border border-green-500/30">
                                Ahora con Plan Gratuito Disponible
                            </div>
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl mb-6">
                                La Maquinaria de tu Activo.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                                Comienza gratis, explora el ecosistema y escala cuando estés listo. Más que un software, es tu socio estratégico para el crecimiento con apalancamiento.
                            </p>
                        </motion.div>
                    </section>

                    <section className="py-12 px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
                                {/* Plan Gratuito */}
                                <PlanCard
                                    icon={<Gift className="w-8 h-8 text-green-400"/>}
                                    title="Plan Explorador"
                                    price="0"
                                    priceCOP="0"
                                    profile="Para el constructor que explora la metodología y valida el ecosistema."
                                    networkSize="1 (solo tú)"
                                    timeLimit="2 min/chat"
                                    features={[
                                        "<b>30</b> Prospectos en NodeX",
                                        "<b>30</b> Conversaciones con NEXUS/mes",
                                        "Límite: <b>2 minutos por conversación</b>",
                                        "Acceso: <b>30 minutos/día</b> NodeX",
                                        "Analíticas Básicas",
                                        "La Academia (Nivel Fundamentos)",
                                        "Marca 'Powered by CreaTuActivo.com'",
                                        "Soporte vía Comunidad"
                                    ]}
                                    free={true}
                                    ctaText="Comenzar Gratis"
                                    ctaLink="/registro-gratuito"
                                />

                                {/* Plan Cimiento */}
                                <PlanCard
                                    icon={<Zap className="w-8 h-8 text-blue-400"/>}
                                    title="Plan Cimiento"
                                    price="25"
                                    priceCOP="112.500"
                                    profile="Para el nuevo constructor que está poniendo las bases de su activo."
                                    networkSize="1 (solo tú)"
                                    timeLimit="5 min/chat"
                                    features={[
                                        "<b>200</b> Prospectos en NodeX",
                                        "<b>100</b> Conversaciones con NEXUS/mes",
                                        "Límite: <b>5 minutos por conversación</b>",
                                        "Acceso: <b>2 horas/día</b> NodeX",
                                        "Analíticas Básicas",
                                        "Asistente ACE Incluido",
                                        "La Academia (Nivel Fundamentos)",
                                        "Eliminación de Marca",
                                        "Soporte vía Comunidad"
                                    ]}
                                />

                                {/* Plan Estructura */}
                                <PlanCard
                                    icon={<Rocket className="w-8 h-8 text-purple-400"/>}
                                    title="Plan Estructura"
                                    price="49"
                                    priceCOP="220.500"
                                    profile="Para el constructor enfocado en la expansión y optimización de su crecimiento."
                                    networkSize="Hasta 3"
                                    timeLimit="10 min/chat"
                                    features={[
                                        "<b>500</b> Prospectos en NodeX",
                                        "<b>500</b> Conversaciones con NEXUS/mes",
                                        "Límite: <b>10 minutos por conversación</b>",
                                        "Acceso: <b>4 horas/día</b> NodeX",
                                        "Analíticas Avanzadas",
                                        "<b>Panel Básico de Gestión de Red</b>",
                                        "<b>Exportar Datos a Hojas de Cálculo</b>",
                                        "Asistente ACE Incluido",
                                        "La Academia (Nivel Arq. Avanzada)",
                                        "Soporte Prioritario por Chat"
                                    ]}
                                    recommended={true}
                                />

                                {/* Plan Rascacielos */}
                                <PlanCard
                                    icon={<Crown className="w-8 h-8 text-yellow-400"/>}
                                    title="Plan Rascacielos"
                                    price="99"
                                    priceCOP="445.500"
                                    profile="Para el líder y mentor que construye a gran escala y busca el máximo dominio."
                                    networkSize="Hasta 10+"
                                    timeLimit="Sin límites"
                                    features={[
                                        "Prospectos <b>Ilimitados</b> en NodeX",
                                        "Conversaciones con NEXUS <b>Ilimitadas</b>",
                                        "<b>Sin límites de tiempo</b> de uso",
                                        "<b>Acceso completo 24/7</b> NodeX",
                                        "Analíticas Avanzadas + <b>Panel de Red</b>",
                                        "<b>Panel Avanzado de Gestión de Red</b>",
                                        "Exportar Datos a Hojas de Cálculo",
                                        "Asistente ACE Incluido",
                                        "La Academia (Nivel Maestría)",
                                        "<b>Soporte Dedicado + 1 Sesión 1-a-1</b>"
                                    ]}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Sección de beneficios del plan gratuito */}
                    <section className="py-16 px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-4xl font-bold mb-6">¿Por Qué Comenzar Gratis?</h2>
                            <p className="text-slate-400 text-lg mb-10">El Plan Explorador te permite validar completamente la metodología antes de cualquier inversión.</p>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-green-500/20">
                                    <BrainCircuit className="w-12 h-12 text-green-400 mx-auto mb-4"/>
                                    <h3 className="text-xl font-bold text-white mb-3">Valida la Metodología</h3>
                                    <p className="text-slate-300">30 prospectos son suficientes para probar el Framework IAA y ver resultados reales.</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
                                    <MessageSquare className="w-12 h-12 text-purple-400 mx-auto mb-4"/>
                                    <h3 className="text-xl font-bold text-white mb-3">Experimenta NEXUS</h3>
                                    <p className="text-slate-300">30 conversaciones mensuales para entender el poder de tu copiloto de IA.</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-blue-500/20">
                                    <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-4"/>
                                    <h3 className="text-xl font-bold text-white mb-3">Acceso a NodeX</h3>
                                    <p className="text-slate-300">30 minutos diarios en tu centro de comando para gestionar tu operación.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                     <section className="text-center py-20">
                         <div className="max-w-3xl mx-auto">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-6">¿Listo para Activar tu Maquinaria?</h2>
                            <p className="text-slate-400 text-lg mb-10">Recuerda, como Fundador, tienes meses de cortesía incluidos con tu paquete de inicio. Comienza gratis o elige tu paquete y tu plan tecnológico se activará automáticamente.</p>
                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                <Link href="/registro-gratuito" className="bg-green-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-green-500 transition-colors text-lg">
                                    Comenzar Gratis Ahora
                                </Link>
                                <Link href="/paquetes" className="creatuactivo-cta-ecosystem text-lg inline-block">
                                    Ver Paquetes de Inicio
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                 <footer className="border-t border-white/10 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
                        <p>&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
