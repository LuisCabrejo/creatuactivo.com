/**
 * Copyright © 2025 CreaTuActivo.com
 * Home Page v6.3.1 - Hotfix
 * Corrección: Eliminado conflicto de nombre 'Star' y aplicado estilo H1 Ecosystem.
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Smartphone,
  Globe,
  Package,
  TrendingUp,
  ChevronRight,
  Users,
  Heart,
  Play,
  Instagram
} from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'
import AnimatedCountUp from '@/components/AnimatedCountUp'
import AnimatedTimeline from '@/components/AnimatedTimeline'
import IncomeComparisonAnimation from '@/components/IncomeComparisonAnimation'

// --- ESTILOS GLOBALES ---
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      /* Variables de color Branding */
      --creatuactivo-blue: #1E40AF;
      --creatuactivo-purple: #7C3AED;
      --creatuactivo-gold: #F59E0B;
      --slate-900: #0F172A;
    }

    /* ESTILO H1 UNIFICADO (Traído de Socio Corporativo) */
    .creatuactivo-h1-ecosystem {
      font-weight: 800;
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 50%, var(--creatuactivo-gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.1;
      letter-spacing: -0.03em;
    }

    /* Mantenemos este estilo por si lo usas en otros H2 (como en la sección 4M) */
    .text-gradient-gold {
      background: linear-gradient(135deg, #FBBF24 0%, #D97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.2));
    }

    /* Efectos de Vidrio */
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }

    .amazon-card {
      background: linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }
    .amazon-card:hover {
      border-color: rgba(59, 130, 246, 0.4);
      transform: translateY(-5px);
    }
  `}</style>
);

// --- COMPONENTES UI ---
const ComparisonRow = ({ label, oldWay, newWay }: { label: string, oldWay: string, newWay: string }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-b border-white/5 last:border-0 items-center">
    <div className="text-slate-500 font-semibold uppercase tracking-wider text-sm md:text-right md:pr-8">{label}</div>
    <div className="flex items-center text-red-400/80 bg-red-900/10 p-3 rounded-lg text-sm">
      <span className="mr-2 text-lg">❌</span> {oldWay}
    </div>
    <div className="flex items-center text-green-400 bg-green-900/10 p-3 rounded-lg font-medium border border-green-500/20 text-sm">
      <span className="mr-2 text-lg">✅</span> {newWay}
    </div>
  </div>
);

export default function HomePage() {
  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30">
        <StrategicNavigation />

        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Fondo abstracto */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-8">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                Nueva Tecnología 2025
              </div>

              {/* TÍTULO HERO: ESTILO ECOSYSTEM APLICADO */}
              <h1 className="creatuactivo-h1-ecosystem text-5xl md:text-7xl mb-8 leading-tight">
                La Tecnología hace el Trabajo Pesado.<br />
                Tú Cobras.
              </h1>

              {/* COPY EVOLUCIÓN */}
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Tu próximo paso no es otro negocio tradicional. <strong>Es crear un Activo.</strong> Te entregamos la tecnología para que construyas un <strong>Sistema de Distribución Masivo</strong> que opere 24/7, sin depender de tu presencia física.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/fundadores" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-bold rounded-full text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10">
                  <Smartphone className="w-5 h-5" />
                  Activar mi Aplicación
                </Link>
                <Link href="/presentacion-empresarial" className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white font-semibold rounded-full text-lg hover:bg-slate-700 transition-all flex items-center justify-center gap-2 border border-slate-700">
                  <Play className="w-5 h-5 fill-current" />
                  Ver Cómo Funciona
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- VISIÓN 4 MILLONES --- */}
        <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">

              {/* Lado Visual */}
              <div className="relative">
                <div className="aspect-square rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl absolute inset-0"></div>
                <div className="relative glass-card p-10 rounded-3xl border-t border-white/10 text-center">
                  <Users className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                  <div className="text-7xl font-bold text-white mb-2 tracking-tighter">
                    <AnimatedCountUp end={4} duration={2} suffix="M" />
                  </div>
                  <div className="text-xl text-blue-300 font-medium uppercase tracking-widest">Familias</div>
                  <div className="mt-8 flex justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white/20"></span>
                    <span className="w-2 h-2 rounded-full bg-white/50"></span>
                    <span className="w-12 h-2 rounded-full bg-blue-500"></span>
                  </div>
                </div>
              </div>

              {/* Lado Texto: La Visión */}
              <div>
                <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-purple-400 uppercase bg-purple-500/10 rounded-full">
                  Nuestra Visión
                </div>

                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                  4 Millones de Familias.<br />
                  <span className="text-gradient-gold">Salud y Libertad.</span>
                </h2>

                <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                  No se puede hablar de riqueza si no hay salud.
                  Nuestra meta es llevar el <strong>primer café saludable del mundo</strong> a 4 millones de hogares en América.
                </p>

                <blockquote className="border-l-4 border-blue-500 pl-6 mb-8 italic text-slate-300 text-xl">
                  "Un producto que cuida tu cuerpo. Un sistema que cuida tu tiempo. Esa es la verdadera definición de Activo."
                </blockquote>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Heart className="w-6 h-6 text-green-400 mt-1" />
                    <p className="text-slate-400"><strong className="text-white">Gano Excel:</strong> Pone el producto patentado (Salud).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-6 h-6 text-blue-400 mt-1" />
                    <p className="text-slate-400"><strong className="text-white">CreaTuActivo:</strong> Pone la automatización (Libertad).</p>
                  </div>
                </div>

                <Link href="/fundadores" className="text-white font-bold underline decoration-blue-500 decoration-2 underline-offset-4 hover:text-blue-400 transition-colors">
                  ¿Quieres ser parte de los que construyen?
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- LA ANALOGÍA MAESTRA (AMAZON) --- */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  El Secreto de los Activos Digitales
                </h2>
                <p className="text-slate-400">Entiende esto y nunca más buscarás un empleo tradicional.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Lado A */}
                <div className="space-y-6">
                  <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Globe size={100} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Jeff Bezos...</h3>
                    <p className="text-lg text-slate-300 mb-6">
                      ¿Se hizo rico vendiendo libros puerta a puerta?
                    </p>
                    <p className="text-red-400 font-bold text-xl flex items-center">
                      <span className="text-2xl mr-2">🚫</span> ¡NO!
                    </p>
                  </div>
                </div>

                {/* Lado B */}
                <div className="space-y-6">
                  <div className="glass-card p-8 rounded-2xl border-green-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-green-500">
                      <TrendingUp size={100} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Él construyó el SISTEMA</h3>
                    <p className="text-lg text-slate-300 mb-6">
                      Creó la plataforma (Amazon) donde millones de transacciones ocurren automáticamente.
                    </p>
                    <p className="text-green-400 font-bold text-xl flex items-center">
                      <span className="text-2xl mr-2">✅</span> ¡EXACTO!
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center max-w-2xl mx-auto">
                <p className="text-slate-400 leading-relaxed">
                  Nosotros te enseñamos a hacer lo mismo. No a vender café puerta a puerta, sino a <strong>construir tu sistema de distribución</strong> usando nuestra tecnología de automatización.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- LOS 3 COMPONENTES (SIMPLE) --- */}
        <section className="py-24 relative bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-blue-400 font-bold tracking-wider uppercase text-sm">Tu Franquicia Digital Incluye</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-6">
                El "Amazon" llave en mano
              </h2>
              <p className="text-slate-400 text-lg">
                No tienes que inventar nada. Te entregamos las 3 piezas listas para operar.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Pieza 1 */}
              <div className="amazon-card p-8 rounded-2xl relative group">
                <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 mb-6">
                  <Package size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">1. La Fábrica (Producto)</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Gano Excel pone los productos, las bodegas, los envíos y los empleados. Tecnología propietaria para millones.
                </p>
                <div className="text-xs font-bold text-green-500 uppercase tracking-wide">
                  Tecnología Propietaria Única
                </div>
              </div>

              {/* Pieza 2 */}
              <div className="amazon-card p-8 rounded-2xl relative group border-blue-500/30">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  IA INTEGRADA
                </div>
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                  <Smartphone size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">2. La App (Tecnología)</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  CreaTuActivo.com es tu aplicación inteligente. Tiene una IA (NEXUS) que educa y filtra el negocio por ti las 24 horas.
                </p>
                <div className="text-xs font-bold text-blue-500 uppercase tracking-wide">
                  Trabaja mientras duermes
                </div>
              </div>

              {/* Pieza 3 */}
              <div className="amazon-card p-8 rounded-2xl relative group">
                <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                  <TrendingUp size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">3. El Método (Mapa)</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  No improvisas. Sigues 3 pasos simples (Iniciar, Acoger, Activar) que ya funcionaron para 2,847 personas.
                </p>
                <div className="text-xs font-bold text-purple-500 uppercase tracking-wide">
                  Sistema Probado
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- COMPARATIVA --- */}
        <section className="py-20 bg-slate-950/50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">¿Por qué esto es diferente?</h2>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-white/10 p-6 md:p-8">
              <ComparisonRow
                label="Tu rol"
                oldWay="Vendedor que persigue gente"
                newWay="Dueño de sistema digital"
              />
              <ComparisonRow
                label="Tu tiempo"
                oldWay="Reuniones físicas interminables"
                newWay="15 min/día desde el celular"
              />
              <ComparisonRow
                label="Quién explica"
                oldWay="Tú explicas lo mismo 100 veces"
                newWay="La IA explica por ti 24/7"
              />
              <ComparisonRow
                label="Resultado"
                oldWay="Ingreso lineal (Empleo)"
                newWay="Activo exponencial (Libertad)"
              />
            </div>
          </div>
        </section>

        {/* --- VISUALIZACIÓN: GANAR DINERO VS CONSTRUIR LIBERTAD --- */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-4">
            <IncomeComparisonAnimation />
          </div>
        </section>

        {/* --- PRUEBA SOCIAL CON TESTIMONIOS REALES --- */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Lo Que Dicen los Líderes
              </h2>
              <p className="text-slate-400">Diamantes de Gano Excel que construyeron con esta metodología.</p>
            </div>

            {/* Stats Animados */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white">
                  +<AnimatedCountUp end={2847} duration={2.5} />
                </div>
                <p className="text-slate-400 text-sm uppercase tracking-wider mt-1">Personas</p>
              </div>
              <div className="hidden md:block text-slate-600 text-4xl">•</div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white">
                  <AnimatedCountUp end={12} duration={2} suffix=" Años" />
                </div>
                <p className="text-slate-400 text-sm uppercase tracking-wider mt-1">de Éxito</p>
              </div>
              <div className="hidden md:block text-slate-600 text-4xl">•</div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white">
                  <AnimatedCountUp end={17} duration={2} suffix="+" />
                </div>
                <p className="text-slate-400 text-sm uppercase tracking-wider mt-1">Países</p>
              </div>
            </div>

            {/* Testimonios Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* Testimonio 1 - Liliana */}
              <div className="glass-card p-6 rounded-2xl flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <img
                    src="https://4millones.com/wp-content/uploads/2025/07/liliana-patricia-moreno-diamante-gano-excel.webp"
                    alt="Liliana Patricia Moreno"
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/50 mr-3"
                  />
                  <div>
                    <p className="font-bold text-white text-sm">Liliana P. Moreno</p>
                    <p className="text-xs text-purple-400">Ama de Casa y Empresaria</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm italic flex-grow mb-3">"Descubrí que esto no es solo un negocio; es un vehículo para transformar tu realidad."</p>
                <a href="https://www.facebook.com/share/v/17CLotD3R2/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-400 text-xs font-semibold hover:text-blue-300">
                  Ver Historia →
                </a>
              </div>

              {/* Testimonio 2 - Andrés */}
              <div className="glass-card p-6 rounded-2xl flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm mr-3 border-2 border-blue-500/50">AG</div>
                  <div>
                    <p className="font-bold text-white text-sm">Andrés Guzmán</p>
                    <p className="text-xs text-blue-400">Empresario Sector Salud</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm italic flex-grow mb-3">"Con esta tecnología, es como pasar de construir a mano a tener una imprenta 3D."</p>
                <a href="https://www.instagram.com/andresguzmanofficial/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-pink-400 text-xs font-semibold hover:text-pink-300">
                  <Instagram size={14} className="mr-1" /> @andresguzmanofficial
                </a>
              </div>

              {/* Testimonio 3 - Jonathan */}
              <div className="glass-card p-6 rounded-2xl flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm mr-3 border-2 border-purple-500/50">JM</div>
                  <div>
                    <p className="font-bold text-white text-sm">Dr. Jonathan M.</p>
                    <p className="text-xs text-purple-400">Médico Estético y Antiage</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm italic flex-grow mb-3">"Como médico, mi tiempo es limitado. Lo que antes requería 100% de mi esfuerzo, ahora se logra con un 20%."</p>
                <a href="https://www.instagram.com/jonathanmoncaleano/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-pink-400 text-xs font-semibold hover:text-pink-300">
                  <Instagram size={14} className="mr-1" /> @jonathanmoncaleano
                </a>
              </div>

              {/* Testimonio 4 - Juan Pablo */}
              <div className="glass-card p-6 rounded-2xl flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-slate-900 font-bold text-sm mr-3 border-2 border-amber-500/50">JP</div>
                  <div>
                    <p className="font-bold text-white text-sm">Juan Pablo R.</p>
                    <p className="text-xs text-amber-400">Ex Gerente Bancario, Escritor</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm italic flex-grow mb-3">"La gente no sigue un producto, sigue una visión. Esta tecnología es la pieza que faltaba."</p>
                <a href="https://www.instagram.com/juanpaelrojo/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-pink-400 text-xs font-semibold hover:text-pink-300">
                  <Instagram size={14} className="mr-1" /> @juanpaelrojo
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* --- TIMELINE DE LANZAMIENTO --- */}
        <AnimatedTimeline />

        {/* --- CTA FINAL --- */}
        <section className="py-20 bg-gradient-to-b from-blue-900/20 to-slate-950 border-t border-white/5">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Solo 150 Fundadores
            </h2>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              Vamos a construir la red más grande de América. Los primeros 150 tendrán acceso directo a mi mentoría y a la tecnología GRATIS de por vida.
              <br /><br />
              <span className="text-yellow-400 font-bold">La lista cierra el 04 de Enero.</span>
            </p>

            <div className="flex flex-col gap-4 max-w-md mx-auto">
              <Link href="/fundadores" className="w-full py-5 bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-900 font-extrabold rounded-xl text-xl hover:scale-105 transition-transform shadow-2xl shadow-yellow-500/20 flex items-center justify-center gap-2">
                Quiero ser Fundador <ChevronRight />
              </Link>
              <p className="text-xs text-slate-500 mt-2">
                * No necesitas tarjeta de crédito para ver la información.
              </p>
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="border-t border-white/5 py-12 bg-slate-950 text-slate-500 text-sm">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} CreaTuActivo.com</p>
              <p>Tecnología para construir activos.</p>
            </div>
            <div className="flex gap-6">
              <Link href="/legal/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

function Star({ className, size }: { className?: string, size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  )
}
