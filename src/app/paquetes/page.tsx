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
import { ArrowRight, CheckCircle, HelpCircle, ChevronDown, Crown, Zap, Rocket } from 'lucide-react' // NUEVO: Se añaden Zap y Rocket
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
    .creatuactivo-package-card {
      background: linear-gradient(135deg,
        rgba(30, 64, 175, 0.1) 0%,
        rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
      position: relative;
    }
    .creatuactivo-package-card:hover {
      transform: translateY(-8px);
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2);
    }
    // AJUSTE: Se elimina la clase .creatuactivo-package-card-recommended ya que no se usará
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


// --- Componente de Tarjeta de Paquete (Branding v4.2 - ACTUALIZADO) ---
// AJUSTE: Se elimina 'recommended' y se añaden props para el bono tecnológico
const PackageCard = ({ title, priceUSD, priceCOP, features, bonusMonths, bonusPlan, bonusIcon, ctaText = "Seleccionar Plan" }) => (
    <div className="creatuactivo-package-card h-full flex flex-col">
        <div className="p-8 flex-grow flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">${priceUSD}</span>
                <span className="text-slate-400"> USD</span>
                <p className="text-sm text-slate-500">~ ${priceCOP} COP</p>
            </div>

            {/* NUEVO: Sección del Bono Tecnológico */}
            <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="text-yellow-400">{bonusIcon}</div>
                <div>
                  <p className="font-bold text-white">Bono Tecnológico Incluido</p>
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold">{bonusMonths} Meses de Cortesía</span> del <span className="font-semibold">{bonusPlan}</span>
                  </p>
                </div>
              </div>
            </div>

            <ul className="space-y-3 text-slate-300 flex-grow mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <Link href="/fundadores" className="w-full text-center font-semibold py-3 px-5 rounded-lg transition-colors duration-300 mt-auto bg-slate-700/70 text-white hover:bg-slate-700">
                {ctaText}
            </Link>
        </div>
    </div>
);

// --- Componente para Preguntas Frecuentes (FAQ - Sin cambios) ---
const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="border-b border-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-5"
            >
                <span className="font-semibold text-white text-lg">{question}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="ml-4">
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                </motion.div>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0, marginTop: isOpen ? '0px' : '-10px' }}
                className="overflow-hidden"
            >
                <div className="pb-5 text-slate-400">
                    {answer}
                </div>
            </motion.div>
        </div>
    );
};


// --- Componente Principal de la Página de Paquetes (ACTUALIZADO) ---
export default function PaquetesPage() { // AJUSTE: Nombre del componente para mayor claridad
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
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl mb-6">
                                Tu Punto de Entrada a la Arquitectura.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                                Esto no es un costo, es la inversión inicial para adquirir tu propia franquicia digital. Elige el paquete que mejor se alinee con tu visión de construcción.
                            </p>
                        </motion.div>
                    </section>

                    <section className="py-12 px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"> {/* NUEVO: items-stretch */}
                                <PackageCard
                                    title="Constructor Inicial"
                                    priceUSD="200"
                                    priceCOP="900.000"
                                    // NUEVO: Se añade el bono
                                    bonusMonths={2}
                                    bonusPlan="Plan Cimiento"
                                    bonusIcon={<Zap size={24}/>}
                                    features={[
                                        "Acceso completo al ecosistema",
                                        "método completo",
                                        "Inventario inicial de validación",
                                        "Tecnología NodeX incluida"
                                    ]}
                                    ctaText="Activar como Inicial"
                                />
                                 <PackageCard
                                    title="Constructor Empresarial"
                                    priceUSD="500"
                                    priceCOP="2.250.000"
                                    // NUEVO: Se añade el bono
                                    bonusMonths={4}
                                    bonusPlan="Plan Estructura"
                                    bonusIcon={<Rocket size={24}/>}
                                    features={[
                                        "Todo lo del plan Inicial +",
                                        "Inventario para operación profesional",
                                        "Consultoría estratégica prioritaria",
                                        "Optimización de primeros flujos"
                                    ]}
                                    // AJUSTE: Se elimina 'recommended'
                                    ctaText="Activar como Empresarial"
                                />
                                 <PackageCard
                                    title="Constructor Visionario"
                                    priceUSD="1,000"
                                    priceCOP="4.500.000"
                                    // NUEVO: Se añade el bono
                                    bonusMonths={6}
                                    bonusPlan="Plan Rascacielos"
                                    bonusIcon={<Crown size={24}/>}
                                    features={[
                                        "Todo lo del plan Empresarial +",
                                        "Inventario premium de máximo potencial",
                                        "Consultoría estratégica VIP",
                                        "Construcción acelerada desde día 1"
                                    ]}
                                    ctaText="Activar como Visionario"
                                />
                            </div>
                            <div className="text-center mt-12 text-slate-400">
                                <p>Todos los paquetes incluyen el acceso total a la plataforma CreaTuActivo.com y al método probado.</p>
                                {/* NUEVO: Enlace a la nueva página de planes */}
                                <p className="mt-2">Como Fundador, tu paquete desbloquea meses de cortesía de nuestra maquinaria tecnológica.
                                  <Link href="/planes" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors ml-2">
                                      Conoce los detalles de los planes aquí
                                  </Link>
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="py-20 lg:py-28 px-4">
                        <div className="max-w-3xl mx-auto">
                            <div className="text-center mb-12">
                                <HelpCircle className="w-12 h-12 text-[var(--creatuactivo-blue)] mx-auto mb-4" />
                                <h2 className="text-3xl md:text-4xl font-bold">Preguntas Clave sobre tu Inversión</h2>
                                <p className="text-slate-400 mt-2">Respuestas transparentes para constructores inteligentes.</p>
                            </div>
                            <div className="space-y-2">
                                <FaqItem
                                    question="¿Qué cubre exactamente la inversión inicial?"
                                    answer="Tu inversión inicial es una compra de producto que te da un inventario para consumir ('ser producto del producto') y compartir. No es una cuota de membresía. Adicionalmente, esta compra desbloquea el acceso vitalicio y sin costo a todo el ecosistema tecnológico de CreaTuActivo.com, incluyendo NodeX y NEXUS IA."
                                />
                                <FaqItem
                                    question="¿Cuál es la inversión recurrente mensual?"
                                    answer="Para mantener tu activo operativo, se requiere un consumo personal mensual de 50 CV (puntos de volumen), que equivale a aproximadamente $450,000 COP. Es importante destacar que esto no es un pago por el software; es una compra de productos de igual valor que tú y tu familia pueden consumir, manteniendo así el flujo de valor en tu canal de distribución."
                                />
                                <FaqItem
                                    question="¿Puedo cambiar de paquete más adelante?"
                                    answer="Sí, el sistema está diseñado para la escalabilidad. Puedes iniciar con el paquete Emprendedor para validar el modelo y, a medida que tu activo crece y genera ingresos, puedes hacer un 'upgrade' a los paquetes superiores para maximizar tu potencial de ganancias y acceder a mayores beneficios."
                                />
                                 <FaqItem
                                    question="¿Existen costos ocultos o adicionales?"
                                    answer="No. Nuestra filosofía es de total transparencia. No hay costos de renovación, mantenimiento de software, hosting o herramientas adicionales. Tu inversión inicial y tu consumo mensual recurrente (que es a cambio de producto) es todo lo que se requiere para operar tu activo con el 100% de las herramientas."
                                />
                            </div>
                        </div>
                    </section>

                    <section className="text-center py-20">
                         <div className="max-w-3xl mx-auto">
                            <Crown className="w-16 h-16 text-[var(--creatuactivo-gold)] mx-auto mb-6"/>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Listo para Iniciar la Construcción.</h2>
                            <p className="text-slate-400 text-lg mb-10">Has visto el valor, la transparencia y el potencial. El siguiente paso es unirte al grupo de pioneros que están definiendo esta nueva categoría.</p>
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
