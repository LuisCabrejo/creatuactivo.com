/**
 * Copyright © 2025 CreaTuActivo.com
 * Home Page v7.0 - "The Apple Strategy"
 * Rediseño enfocado en Aspiracionalidad, Retención y Autoridad Premium.
 * Principios: Loss Aversion, Storytelling (Cliente=Héroe), Tough Love, Deseo Mimético.
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Smartphone,
  Globe,
  TrendingUp,
  Users,
  Heart,
  Play,
  Check,
  X,
  ArrowRight,
  ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'
import AnimatedCountUp from '@/components/AnimatedCountUp'
import AnimatedTimeline from '@/components/AnimatedTimeline'
import IncomeComparisonAnimation from '@/components/IncomeComparisonAnimation'
import { useHydration } from '@/hooks/useHydration'

// --- ESTILOS GLOBALES ---
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      /* Variables de color Branding - Palette Premium */
      --creatuactivo-blue: #3B82F6;
      --creatuactivo-purple: #8B5CF6;
      --slate-900: #0F172A;
      --slate-950: #020617;
    }

    /* ESTILO H1 UNIFICADO (Premium Gradient) */
    .creatuactivo-h1-ecosystem {
      font-weight: 800;
      background: linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.04em; /* Tight Apple style */
    }

    /* Acentos dorados sutiles */
    .text-gradient-gold {
      background: linear-gradient(135deg, #FDE68A 0%, #D97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Efectos de Vidrio Premium (Frosted Glass) */
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .glass-card-hover:hover {
      border-color: rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.05);
      transform: translateY(-2px);
      transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    /* Botón estilo "Glow" */
    .btn-glow {
      box-shadow: 0 0 20px -5px rgba(59, 130, 246, 0.5);
    }
    .btn-glow:hover {
      box-shadow: 0 0 30px -5px rgba(59, 130, 246, 0.7);
    }
  `}</style>
);

// --- COMPONENTE FILA DE COMPARACIÓN ---
const ComparisonRow = ({ label, oldWay, newWay }: { label: string, oldWay: string, newWay: string }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-b border-white/5 last:border-0 items-center group">
    <div className="text-slate-500 font-medium uppercase tracking-widest text-xs md:text-right md:pr-8 group-hover:text-slate-400 transition-colors">{label}</div>
    <div className="flex items-center text-red-400/70 bg-red-500/5 p-3 rounded-lg text-sm border border-transparent">
      <X size={16} className="mr-3 shrink-0" /> {oldWay}
    </div>
    <div className="flex items-center text-emerald-400 bg-emerald-500/5 p-3 rounded-lg font-medium border border-emerald-500/10 text-sm shadow-[0_0_15px_-5px_rgba(16,185,129,0.1)]">
      <Check size={16} className="mr-3 shrink-0" /> {newWay}
    </div>
  </div>
);

export default function HomePage() {
  const isHydrated = useHydration()

  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
        <StrategicNavigation />

        {/* --- HERO SECTION: IDENTIDAD & ASPIRACIÓN --- */}
        <section className="relative pt-36 pb-24 md:pt-48 md:pb-36 overflow-hidden">
          {/* Fondo Ambiental Sutil */}
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={isHydrated ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-5xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 text-slate-300 text-xs font-medium uppercase tracking-widest mb-8 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Ecosistema 2025
              </div>

              {/* TÍTULO HERO REFINADO */}
              <h1 className="creatuactivo-h1-ecosystem text-5xl md:text-7xl lg:text-8xl mb-8 leading-[1.1] md:leading-[1.05]">
                Tu Libertad no debería<br />
                depender de tu Presencia.
              </h1>

              {/* COPY: ESTADO MENTAL */}
              <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                La mayoría trabaja duro por dinero. Los inteligentes construyen sistemas.
                Accede a la <strong className="text-white font-medium">primera infraestructura de Inteligencia Artificial</strong> diseñada para generar activos mientras vives tu vida.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/fundadores" className="w-full sm:w-auto px-10 py-4 bg-white text-slate-950 font-bold rounded-full text-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2 btn-glow transform hover:-translate-y-1">
                  Comenzar mi Ecosistema
                </Link>
                <Link href="/presentacion-empresarial" className="w-full sm:w-auto px-10 py-4 bg-slate-900/50 text-white font-medium rounded-full text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 border border-slate-700 backdrop-blur-sm group">
                  <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                  Ver la Demo (3 min)
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- VISIÓN: TU SALUD Y TU TIEMPO --- */}
        <section className="py-32 bg-slate-950 border-t border-white/5 relative">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">

              {/* Lado Visual Minimalista */}
              <div className="relative order-2 lg:order-1">
                <div className="aspect-square rounded-full bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 blur-3xl absolute inset-0"></div>
                <div className="relative glass-card p-12 rounded-[2.5rem] border-t border-white/10 text-center transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
                  <Users className="w-16 h-16 text-slate-200 mx-auto mb-6 opacity-80" />
                  <div className="text-6xl md:text-8xl font-bold text-white mb-2 tracking-tighter">
                    <AnimatedCountUp end={4} duration={2} suffix="M" />
                  </div>
                  <div className="text-sm text-slate-400 font-medium uppercase tracking-[0.3em]">Familias Impactadas</div>

                  {/* Barra de progreso visual */}
                  <div className="mt-12 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "35%" }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-400"
                    ></motion.div>
                  </div>
                  <p className="mt-4 text-xs text-slate-500">Objetivo 2030</p>
                </div>
              </div>

              {/* Lado Texto: El Héroe es el Usuario */}
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight tracking-tight">
                  Tu Salud y Libertad<br />
                  <span className="text-slate-500">No son negociables.</span>
                </h2>

                <p className="text-lg text-slate-400 mb-8 leading-relaxed font-light">
                  El modelo antiguo te obligaba a elegir: o tenías dinero sin tiempo, o tiempo sin dinero. Nosotros diseñamos un ecosistema para que tengas ambos.
                </p>

                <blockquote className="border-l-2 border-blue-500/50 pl-6 mb-10 text-slate-300 text-lg italic font-light">
                  "No vendemos café. Construimos la infraestructura digital que distribuye bienestar mientras tú duermes."
                </blockquote>

                <div className="space-y-6 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Heart size={20} />
                    </div>
                    <div>
                      <p className="text-white font-medium">Bienestar Físico</p>
                      <p className="text-slate-500 text-sm">Respaldo científico y patentes globales.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <p className="text-white font-medium">Bienestar Financiero</p>
                      <p className="text-slate-500 text-sm">Automatización y activos digitales.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- LA ANALOGÍA MAESTRA (HARDWARE VS SOFTWARE) --- */}
        <section className="py-32 bg-slate-950 relative overflow-hidden">
          {/* Fondo sutil */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                El Código vs. El Ladrillo
              </h2>
              <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
                Jeff Bezos no se hizo rico empacando cajas. Se hizo rico siendo dueño del sistema que las empaca.
              </p>
            </div>

            {/* Tarjeta Unificada Elegante */}
            <div className="relative glass-card p-1 rounded-3xl overflow-hidden max-w-5xl mx-auto border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-emerald-500/5 opacity-50"></div>

              <div className="relative bg-slate-950/80 p-8 md:p-16 rounded-[20px] grid md:grid-cols-2 gap-12 items-stretch backdrop-blur-xl">
                {/* Columna Izquierda (Lo viejo) */}
                <div className="md:pr-8 md:border-r border-white/5">
                  <h3 className="text-xl font-bold text-slate-300 mb-8 flex items-center gap-3 opacity-60">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Lo que la gente "cree" que es:
                  </h3>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4 text-slate-400">
                      <X className="w-5 h-5 text-red-500/50 mt-1 shrink-0" />
                      <span>Vender productos puerta a puerta</span>
                    </li>
                    <li className="flex items-start gap-4 text-slate-400">
                      <X className="w-5 h-5 text-red-500/50 mt-1 shrink-0" />
                      <span>Llamar a amigos y familiares (Spam)</span>
                    </li>
                    <li className="flex items-start gap-4 text-slate-400">
                      <X className="w-5 h-5 text-red-500/50 mt-1 shrink-0" />
                      <span>Manejar inventario y cobros</span>
                    </li>
                  </ul>
                </div>

                {/* Columna Derecha (La Realidad Tech) */}
                <div className="md:pl-4">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Lo que realmente hacemos:
                  </h3>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4 text-white">
                      <Check className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                      <span>Conectar personas usando el Ecosistema CreaTuActivo</span>
                    </li>
                    <li className="flex items-start gap-4 text-white">
                      <Check className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                      <span>Automatizar la educación y filtrado con IA</span>
                    </li>
                    <li className="flex items-start gap-4 text-white">
                      <Check className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                      <span>Cobrar regalías globales de por vida</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- LOS 3 PILARES (RENOMBRADOS) --- */}
        <section className="py-32 relative bg-slate-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-blue-400 font-bold tracking-widest uppercase text-xs mb-4 block">Tu Infraestructura Digital</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                El "Amazon" llave en mano
              </h2>
              <p className="text-slate-400 text-lg font-light">
                No tienes que inventar nada. Te entregamos las 3 piezas listas para operar.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Pieza 1 */}
              <div className="glass-card glass-card-hover p-10 rounded-3xl relative group">
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-blue-600 transition-colors duration-300">
                  <Globe size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">1. El Socio Corporativo</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Acceso inmediato a una infraestructura de mil millones de dólares. Gano Excel pone la logística, las patentes y el capital.
                </p>
                <div className="h-px w-full bg-gradient-to-r from-blue-500/50 to-transparent"></div>
              </div>

              {/* Pieza 2 - Highlight */}
              <div className="glass-card glass-card-hover p-10 rounded-3xl relative group border-blue-500/20 bg-blue-500/5">
                <div className="absolute top-6 right-6">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
                </div>
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-500/20">
                  <Smartphone size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">2. Tu Motor de IA</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  <strong>La App CreaTuActivo</strong> es tu ventaja injusta. Nuestra tecnología propietaria trabaja, filtra, educa y cierra prospectos mientras tú vives.
                </p>
                <div className="h-px w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </div>

              {/* Pieza 3 */}
              <div className="glass-card glass-card-hover p-10 rounded-3xl relative group">
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-purple-600 transition-colors duration-300">
                  <TrendingUp size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">3. El Plan de Ejecución</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  No improvises. Ejecuta una estrategia de precisión militar (IAA) probada por más de 2,000 personas con resultados.
                </p>
                <div className="h-px w-full bg-gradient-to-r from-purple-500/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* --- COMPARATIVA LÓGICA --- */}
        <section className="py-24 bg-slate-950">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-slate-900/50 rounded-3xl border border-white/5 p-8 md:p-12 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-10 text-center">La Matemática de tu Libertad</h3>

              <ComparisonRow
                label="Tu Rol"
                oldWay="Vendedor operativo"
                newWay="Arquitecto de Sistemas"
              />
              <ComparisonRow
                label="Escalabilidad"
                oldWay="Limitada a tus horas"
                newWay="Infinita (Software + Red)"
              />
              <ComparisonRow
                label="Ingreso"
                oldWay="Lineal (Sueldo)"
                newWay="Exponencial (Activo)"
              />
            </div>
          </div>
        </section>

        {/* --- VISUALIZACIÓN: INCOME GRAPH --- */}
        <section className="py-24 bg-slate-950 border-t border-white/5">
          <div className="container mx-auto px-4">
            <IncomeComparisonAnimation />
          </div>
        </section>

        {/* --- PRUEBA SOCIAL (RESULTADOS) --- */}
        <section className="py-32 bg-slate-900 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Resultados, No Promesas.
              </h2>
              <p className="text-slate-400 font-light">Diamantes que cambiaron el "Trabajo Duro" por "Trabajo Inteligente".</p>
            </div>

            {/* Testimonios Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* Testimonio 1 */}
              <div className="glass-card p-8 rounded-3xl flex flex-col h-full hover:bg-white/5 transition-colors">
                <div className="flex items-center mb-6">
                  <img src="https://4millones.com/wp-content/uploads/2025/07/liliana-patricia-moreno-diamante-gano-excel.webp" alt="Liliana" className="w-12 h-12 rounded-full object-cover mr-4 grayscale opacity-80 hover:grayscale-0 transition-all" />
                  <div>
                    <p className="font-bold text-white text-sm">Liliana P. Moreno</p>
                    <p className="text-xs text-slate-500">Ex-Ama de Casa</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"Pasé años intentando vender manualmente. Con este sistema, construí un patrimonio para mis hijas sin salir de casa."</p>
                <div className="mt-auto pt-4 border-t border-white/5">
                  <p className="text-xs font-bold text-emerald-400">Resultado: Libertad Total</p>
                </div>
              </div>

              {/* Testimonio 2 */}
              <div className="glass-card p-8 rounded-3xl flex flex-col h-full hover:bg-white/5 transition-colors">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center text-white font-bold text-sm mr-4">AG</div>
                  <div>
                    <p className="font-bold text-white text-sm">Andrés Guzmán</p>
                    <p className="text-xs text-slate-500">Sector Salud</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"Es como tener una imprenta 3D de activos. La tecnología hace el 80% del trabajo aburrido que yo odiaba."</p>
                <div className="mt-auto pt-4 border-t border-white/5">
                  <p className="text-xs font-bold text-emerald-400">Resultado: Automatización</p>
                </div>
              </div>

              {/* Testimonio 3 */}
              <div className="glass-card p-8 rounded-3xl flex flex-col h-full hover:bg-white/5 transition-colors">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center text-white font-bold text-sm mr-4">JM</div>
                  <div>
                    <p className="font-bold text-white text-sm">Dr. Jonathan M.</p>
                    <p className="text-xs text-slate-500">Médico</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"Como médico no tenía tiempo. Ahora mi consultorio digital atiende a miles de personas mientras yo viajo."</p>
                <div className="mt-auto pt-4 border-t border-white/5">
                  <p className="text-xs font-bold text-emerald-400">Resultado: Tiempo Recuperado</p>
                </div>
              </div>

              {/* Testimonio 4 */}
              <div className="glass-card p-8 rounded-3xl flex flex-col h-full hover:bg-white/5 transition-colors">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-amber-900/50 flex items-center justify-center text-white font-bold text-sm mr-4">JP</div>
                  <div>
                    <p className="font-bold text-white text-sm">Juan Pablo R.</p>
                    <p className="text-xs text-slate-500">Ex-Bancario</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"Entendí que la riqueza no está en el producto, está en la red de distribución. Este software crea la red por ti."</p>
                <div className="mt-auto pt-4 border-t border-white/5">
                  <p className="text-xs font-bold text-emerald-400">Resultado: Activo Heredable</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- TIMELINE DE LANZAMIENTO --- */}
        <AnimatedTimeline />

        {/* --- FAQ: EL ASESINO DE OBJECIONES --- */}
        <section className="py-24 bg-slate-950 border-t border-white/5">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
              <p className="text-slate-400 font-light">Claridad total antes de iniciar tu aplicación.</p>
            </div>

            <div className="space-y-4">
              {/* Pregunta 1 */}
              <details className="group glass-card rounded-2xl p-1 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-xl bg-slate-900/50 p-6 text-white hover:bg-slate-800 transition-colors">
                  <h3 className="font-bold">¿Necesito conocimientos técnicos o de programación?</h3>
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <div className="px-6 pb-6 pt-2 text-slate-400 text-sm leading-relaxed font-light">
                  <p>
                    <strong className="text-white">Absolutamente no.</strong> Esa es la razón de ser de CreaTuActivo. Nosotros ponemos la infraestructura. Tú gestionas tu Nodo Digital desde el celular con funciones de usuario básico (copiar, pegar, monitorear). Es como usar Uber: no necesitas ser mecánico para que el auto te lleve.
                  </p>
                </div>
              </details>

              {/* Pregunta 2 */}
              <details className="group glass-card rounded-2xl p-1 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-xl bg-slate-900/50 p-6 text-white hover:bg-slate-800 transition-colors">
                  <h3 className="font-bold">¿Esto es otro Multinivel tradicional?</h3>
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <div className="px-6 pb-6 pt-2 text-slate-400 text-sm leading-relaxed font-light">
                  <p>
                    No en la forma operativa. Usamos el modelo legal de Network Marketing de Gano Excel para la facturación y pagos (porque es el más eficiente fiscalmente), pero <strong className="text-white">eliminamos la parte manual</strong> (perseguir gente, reuniones en casa, venta de catálogo). Convertimos un modelo de venta directa en un modelo de E-commerce y Marketing Digital automatizado.
                  </p>
                </div>
              </details>

              {/* Pregunta 3 */}
              <details className="group glass-card rounded-2xl p-1 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-xl bg-slate-900/50 p-6 text-white hover:bg-slate-800 transition-colors">
                  <h3 className="font-bold">¿Cuánto tiempo real debo dedicarle?</h3>
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <div className="px-6 pb-6 pt-2 text-slate-400 text-sm leading-relaxed font-light">
                  <p>
                    El sistema está diseñado para profesionales ocupados (médicos, ingenieros, empresarios). En la fase de construcción, requieres de <strong className="text-white">45 a 60 minutos diarios</strong> (no continuos) para gestionar las notificaciones de tu IA. Una vez el activo está maduro, el tiempo se reduce drásticamente.
                  </p>
                </div>
              </details>

              {/* Pregunta 4 */}
              <details className="group glass-card rounded-2xl p-1 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-xl bg-slate-900/50 p-6 text-white hover:bg-slate-800 transition-colors">
                  <h3 className="font-bold">¿Por qué hay un límite de 150 cupos?</h3>
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <div className="px-6 pb-6 pt-2 text-slate-400 text-sm leading-relaxed font-light">
                  <p>
                    Porque recibirás <strong className="text-white">Mentoría Directa</strong> y acceso gratuito a la infraestructura tecnológica (que tiene un costo de servidor alto). No es un curso grabado masivo; es un programa de formación de socios. Para garantizar resultados, no podemos atender a más personas con este nivel de personalización.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* --- CTA FINAL: ESCALABILIDAD --- */}
        <section className="py-32 bg-slate-950 border-t border-white/5">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
              150 Fundadores.
            </h2>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed font-light max-w-2xl mx-auto">
              Vamos a construir la red más grande de América. Los primeros 150 tendrán acceso directo a mi mentoría privada y a la tecnología <span className="text-white font-bold">CreaTuActivo GRATIS de por vida.</span>
            </p>

            <div className="flex flex-col items-center gap-6">
              <Link href="/fundadores" className="group relative inline-flex items-center justify-center px-12 py-5 bg-white text-slate-950 font-bold rounded-full text-xl overflow-hidden transition-all hover:scale-105">
                <span className="relative z-10 flex items-center gap-3">
                  Aplicar ahora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              <div className="flex items-center gap-2 text-sm text-yellow-500/80 bg-yellow-500/5 px-4 py-2 rounded-full border border-yellow-500/10">
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                La lista cierra estrictamente el 04 de Enero.
              </div>
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="border-t border-white/5 py-16 bg-slate-950 text-slate-500 text-sm">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <p className="text-white font-bold text-lg mb-2">CreaTuActivo</p>
              <p className="font-light">Ingeniería de Activos Digitales.</p>
              <p className="mt-4 text-xs opacity-50">&copy; {new Date().getFullYear()} Todos los derechos reservados.</p>
            </div>
            <div className="flex gap-8">
              <Link href="/legal/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="/contacto" className="hover:text-white transition-colors">Soporte</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
