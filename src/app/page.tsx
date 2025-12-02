/**
 * Copyright © 2025 CreaTuActivo.com
 * Home Page v6.4.0 - Versión Híbrida Mejorada
 * Combinación de: Diseño moderno + Copy emocional + Elementos de conversión
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
  Briefcase,
  Target,
  Lightbulb,
  Home,
  UsersRound,
  TrendingUp as TrendingUpIcon
} from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'

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

    /* H2 componentes */
    .creatuactivo-h2-component {
      font-weight: 700;
      background: linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Gradiente dorado para 4M */
    .text-gradient-gold {
      background: linear-gradient(135deg, #FBBF24 0%, #D97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.2));
    }

    /* Cards estilo WHY */
    .creatuactivo-why-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(245, 158, 11, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
    }
    .creatuactivo-why-card:hover {
      transform: translateY(-8px);
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2);
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

// Componente de arquetipo
function ArquetipoCard({ icon, title, description, iconColor }: {
  icon: React.ReactNode
  title: string
  description: string
  iconColor: string
}) {
  return (
    <div className="p-6 bg-slate-800/50 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
      <div className={`${iconColor} mb-3`}>
        {icon}
      </div>
      <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  )
}

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
                Una Aplicación para Construir tu Activo
              </div>

              {/* TÍTULO HERO: H1 EMOCIONAL + ESTILO ECOSYSTEM */}
              <h1 className="creatuactivo-h1-ecosystem text-5xl md:text-7xl mb-8 leading-tight">
                Imagina Despertar y Ver<br />
                Que Tu Negocio Ya Trabajó Por Ti
              </h1>

              <div className="text-xl md:text-2xl text-white mb-6">
                Se llama CreaTuActivo.
              </div>

              <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                Tu aplicación personal para construir un activo.
              </p>

              {/* STORYTELLING EMOCIONAL */}
              <div className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-10 space-y-3">
                <p>Mientras dormías, NEXUS respondió 12 conversaciones.</p>
                <p>Mientras desayunabas con tu familia, 3 personas mostraron interés real.</p>
                <p>Antes de las 9 AM, ya sabes exactamente qué hacer hoy.</p>
              </div>

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

        {/* --- WHY PROFUNDO (RECUPERADO) --- */}
        <section className="max-w-4xl mx-auto mb-20 px-4">
          <div className="creatuactivo-why-card p-8 lg:p-12">
            <div className="text-center mb-6">
              <div className="inline-block bg-indigo-500/10 text-amber-400 font-semibold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border border-indigo-500/20">
                Nuestra Creencia Fundamental
              </div>
            </div>

            <p className="text-xl lg:text-2xl text-white leading-relaxed mb-6">
              Creemos firmemente que las personas merecen cumplir sueños, viajar, tener estabilidad financiera, ser dueños de su tiempo y su vida.
            </p>

            <p className="text-xl lg:text-2xl text-white leading-relaxed mb-6">
              Y creemos que construir un activo patrimonial no debe ser tan difícil.
            </p>

            <p className="text-lg lg:text-xl text-slate-300 leading-relaxed">
              Por eso creamos CreaTuActivo: una aplicación completa que te da el sistema probado, la tecnología que automatiza el trabajo pesado, y productos únicos con patente mundial.
            </p>
          </div>
        </section>

        {/* --- LA ANALOGÍA MAESTRA (AMAZON) --- */}
        <section className="py-20 bg-slate-950 px-4">
          <div className="container mx-auto">
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

        {/* --- LOS 3 COMPONENTES --- */}
        <section className="py-24 relative bg-slate-900 px-4">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-blue-400 font-bold tracking-wider uppercase text-sm">Cómo lo Hacemos</span>
              <h2 className="creatuactivo-h2-component text-4xl md:text-5xl font-bold mt-2 mb-6">
                CreaTuActivo: Tu Aplicación Completa
              </h2>
              <p className="text-slate-400 text-lg">
                No te damos un "negocio para trabajar". Te damos una aplicación que trabaja por ti 24/7.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Pieza 1 */}
              <div className="amazon-card p-8 rounded-2xl relative group">
                <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 mb-6">
                  <Package size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Producto con Patente Mundial</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Gano Excel (30+ años, 100% libre de deudas). No compites con Amazon. No compites con Rappi. Tienes algo único que solo tú puedes ofrecer en tu red.
                </p>
                <div className="text-xs font-bold text-green-500 uppercase tracking-wide">
                  Patente Mundial Incluida
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
                <h3 className="text-xl font-bold text-white mb-3">CreaTuActivo: Tu Aplicación 24/7</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  NEXUS (tu asistente IA) conversa profesionalmente, califica interés real, y te dice exactamente a quién contactar. Tú solo guías el sistema.
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
                <h3 className="text-xl font-bold text-white mb-3">Sistema Probado (2,847 Personas)</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Los 3 Pasos: IAA (Iniciar, Acoger, Activar). Ya funcionó 9 años sin tecnología. Ahora con CreaTuActivo, es 10 veces más fácil.
                </p>
                <div className="text-xs font-bold text-purple-500 uppercase tracking-wide">
                  Sistema Probado
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- COMPARATIVA --- */}
        <section className="py-20 bg-slate-950/50 px-4">
          <div className="container mx-auto max-w-4xl">
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

        {/* --- PARA QUIÉN (ARQUETIPOS RECUPERADOS) --- */}
        <section className="py-20 bg-slate-900 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block bg-purple-500/10 text-purple-300 font-semibold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 border border-purple-500/20">
                Para Quién
              </div>
              <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">
                Diseñado para el Constructor Inteligente
              </h2>
              <p className="text-slate-400 text-lg">
                No importa tu título, sino tu mentalidad. Si buscas construir un activo a largo plazo en lugar de perseguir dinero rápido, este es tu ecosistema.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <ArquetipoCard
                icon={<Briefcase size={24} />}
                title="Profesional con Visión"
                description="Para construir un activo, no solo una carrera."
                iconColor="text-blue-400"
              />
              <ArquetipoCard
                icon={<Target size={24} />}
                title="Emprendedor y Dueño de Negocio"
                description="Para escalar con un sistema, no con más tareas."
                iconColor="text-orange-400"
              />
              <ArquetipoCard
                icon={<Lightbulb size={24} />}
                title="Independiente y Freelancer"
                description="Para convertir el talento en un activo escalable."
                iconColor="text-purple-400"
              />
              <ArquetipoCard
                icon={<Home size={24} />}
                title="Líder del Hogar"
                description="Para construir con flexibilidad y propósito."
                iconColor="text-pink-400"
              />
              <ArquetipoCard
                icon={<UsersRound size={24} />}
                title="Líder de la Comunidad"
                description="Para transformar tu influencia en un legado tangible."
                iconColor="text-green-400"
              />
              <ArquetipoCard
                icon={<TrendingUpIcon size={24} />}
                title="Joven con Ambición"
                description="Para construir un activo antes de empezar una carrera."
                iconColor="text-cyan-400"
              />
            </div>

            <div className="text-center p-6 lg:p-8 bg-blue-500/5 border border-purple-500/20 rounded-xl backdrop-filter backdrop-blur-xl">
              <p className="text-lg lg:text-xl text-slate-300 leading-relaxed">
                Si crees que tienes el talento y la capacidad, y solo te falta la oportunidad real...
                <br /><br />
                <span className="text-xl lg:text-2xl font-bold text-white">
                  Esto fue diseñado para ti.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* --- PRUEBA SOCIAL (NÚMEROS RECUPERADOS) --- */}
        <section className="py-20 bg-slate-950 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-block bg-green-500/10 text-green-300 font-semibold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 border border-green-500/20">
                Construido Sobre Base Sólida
              </div>
              <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl mb-4">El Sistema que Ya Probó que Funciona</h2>
              <p className="text-slate-300 max-w-3xl mx-auto mb-12">
                CreaTuActivo no nace en el vacío. Es el resultado de 9 años de éxito probado, ahora potenciado por Gano Excel (30+ años, patente mundial).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-8 mb-12">
              <div className="glass-card p-10 rounded-3xl text-center border-t border-white/10">
                <p className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">9 Años</p>
                <p className="text-slate-400 text-lg mb-2">de Liderazgo Probado</p>
                <p className="text-sm text-slate-500">2,847 constructores exitosos</p>
              </div>
              <div className="glass-card p-10 rounded-3xl text-center border-t border-white/10">
                <p className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">30+ Años</p>
                <p className="text-slate-400 text-lg mb-2">de Respaldo Corporativo</p>
                <p className="text-sm text-slate-500">Gano Excel - Patente Mundial</p>
              </div>
            </div>

            <div className="text-center p-8 lg:p-12 bg-blue-500/5 border border-purple-500/20 rounded-xl backdrop-filter backdrop-blur-xl">
              <p className="text-xl lg:text-2xl font-semibold text-white">
                Los primeros 2,847 probaron que funciona sin tecnología.
                <br /><br />
                Imagina lo que TÚ lograrás con CreaTuActivo.
              </p>
            </div>
          </div>
        </section>

        {/* --- VISIÓN 4 MILLONES --- */}
        <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-y border-white/5 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">

              {/* Lado Visual */}
              <div className="relative order-2 lg:order-1">
                <div className="aspect-square rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl absolute inset-0"></div>
                <div className="relative glass-card p-10 rounded-3xl border-t border-white/10 text-center">
                  <Users className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                  <div className="text-7xl font-bold text-white mb-2 tracking-tighter">4M</div>
                  <div className="text-xl text-blue-300 font-medium uppercase tracking-widest">Familias</div>
                  <div className="mt-8 flex justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white/20"></span>
                    <span className="w-2 h-2 rounded-full bg-white/50"></span>
                    <span className="w-12 h-2 rounded-full bg-blue-500"></span>
                  </div>
                </div>
              </div>

              {/* Lado Texto */}
              <div className="order-1 lg:order-2">
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
                    <Heart className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-400"><strong className="text-white">Gano Excel:</strong> Pone el producto patentado (Salud).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-400"><strong className="text-white">CreaTuActivo:</strong> Pone la automatización (Libertad).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA FINAL (COPY EMOCIONAL RECUPERADO) --- */}
        <section className="py-20 bg-gradient-to-b from-blue-900/20 to-slate-950 border-t border-white/5 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl font-bold mb-8">
              Solo 150 Espacios como Fundador
            </h2>

            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Si crees que despertar sin alarma es más valioso que cualquier salario...<br />
              Si crees que estar en el recital de tu hija no debería costarte un día de vacaciones...<br />
              Si crees que tus nietos merecen heredar libertad, no solo fotos...
              <br /><br />
              <span className="text-white font-semibold text-2xl">Entonces CreaTuActivo es para ti.</span>
            </p>

            <div className="flex flex-col gap-4 max-w-md mx-auto">
              <Link href="/fundadores" className="w-full py-5 bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-900 font-extrabold rounded-xl text-xl hover:scale-105 transition-transform shadow-2xl shadow-yellow-500/20 flex items-center justify-center gap-2">
                Activar mi Aplicación <ChevronRight />
              </Link>
              <p className="text-sm text-slate-500 mt-2">
                Solo 150 espacios como Fundador hasta el 04 de enero 2026. Después, solo podrás entrar como Constructor bajo la mentoría de alguien más.
              </p>
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="border-t border-white/5 py-12 bg-slate-950 text-slate-500 text-sm px-4">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
              <p className="mt-2">CreaTuActivo: La primera aplicación completa para construir tu activo en América Latina.</p>
            </div>
            <div className="flex gap-6">
              <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="/fundadores" className="hover:text-white transition-colors">Fundadores</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

