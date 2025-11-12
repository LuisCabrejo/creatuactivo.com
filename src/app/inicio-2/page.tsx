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
import { Zap, BrainCircuit, Box, Briefcase, MonitorSmartphone, Home, School, Target, ShieldCheck, Lightbulb, UsersRound, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'

// Estilos globales
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
    .creatuactivo-cta-ecosystem {
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 100%);
      border-radius: 16px;
      padding: 18px 36px;
      font-weight: 700;
      color: white;
      transition: all 0.3s ease;
      box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
      text-decoration: none;
      display: inline-block;
    }
    .creatuactivo-cta-ecosystem:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(30, 64, 175, 0.5);
    }
    .fade-in-hero {
      animation: fadeInUp 0.8s ease-out forwards;
      opacity: 1;
      transform: none;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);

// Componente de pilar HOW
function HOWPillar({ icon, title, description, iconColor, iconBg }: {
  icon: React.ReactNode
  title: string
  description: string
  iconColor: string
  iconBg: string
}) {
  return (
    <div className="creatuactivo-component-card p-6 lg:p-8">
      <div className={`${iconBg} p-4 rounded-xl mb-4 inline-block`}>
        <div className={iconColor}>
          {icon}
        </div>
      </div>
      <h3 className="text-xl lg:text-2xl font-bold mb-3 text-white leading-tight">{title}</h3>
      <p className="text-sm lg:text-base text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}

// Componente de arquetipo
function ArquetipoCard({ icon, title, description, iconColor }: {
  icon: React.ReactNode
  title: string
  description: string
  iconColor: string
}) {
  return (
    <div className="p-6 bg-slate-800 rounded-lg border border-white/10">
      <div className={`${iconColor} mb-3`}>
        {icon}
      </div>
      <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  )
}

export default function Inicio2Page() {
  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-900 text-white min-h-screen">
        <StrategicNavigation />

        {/* Fondo decorativo */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--creatuactivo-gold)]/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[var(--creatuactivo-blue)]/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[var(--creatuactivo-purple)]/10 rounded-full filter blur-3xl opacity-30 animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <main className="relative z-10 px-4 lg:px-8">
          {/* HERO SECTION - WHY */}
          <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-24">
            <div className="relative z-10 max-w-4xl fade-in-hero">
              <div className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6 border border-purple-500/30">
                Por Qué Existimos
              </div>

              <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
                Creemos que las personas MERECEN ser dueñas de su tiempo
              </h1>

              <p className="text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                No vendedores atrapados en una bicicleta estática.<br />
                <span className="text-amber-400 font-semibold">ARQUITECTOS</span> construyendo sistemas que trabajan para ellos.
                <br /><br />
                Porque cumplir sueños, viajar, tener estabilidad financiera y libertad <span className="text-amber-400 font-semibold">NO debe ser una lotería de esfuerzo ciego</span>, sino <span className="text-amber-400 font-semibold">ARQUITECTURA INTELIGENTE.</span>
              </p>

              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <Link
                  href="/sistema/framework-iaa"
                  className="creatuactivo-cta-ecosystem w-full md:w-auto text-lg flex items-center justify-center"
                >
                  Descubre el Sistema
                </Link>
                <Link
                  href="/fundadores"
                  className="w-full md:w-auto bg-white/10 backdrop-blur-lg text-slate-300 font-semibold py-4 px-8 rounded-lg hover:bg-white/20 transition-colors duration-300 text-center border border-white/20"
                >
                  Sé Fundador
                </Link>
              </div>
            </div>
          </section>

          {/* WHY PROFUNDO - Sección tipo "fundadores" */}
          <section className="max-w-4xl mx-auto mb-20">
            <div className="creatuactivo-why-card p-8 lg:p-12">
              <div className="text-center mb-6">
                <div className="inline-block bg-purple-500/10 text-amber-400 font-semibold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border border-purple-500/20">
                  Nuestra Creencia Fundamental
                </div>
              </div>

              <p className="text-xl lg:text-2xl text-white leading-relaxed mb-6 text-left">
                En CreaTuActivo.com creemos firmemente que las personas <strong className="text-amber-400">MERECEN cumplir sueños</strong>, viajar, tener estabilidad financiera, ser dueños de su tiempo y su vida.
              </p>

              <p className="text-xl lg:text-2xl text-white leading-relaxed mb-6 text-left">
                Y creemos que construir un activo patrimonial <strong className="text-amber-400">NO debe ser una lotería de esfuerzo ciego</strong>, sino <strong className="text-amber-400">ARQUITECTURA INTELIGENTE.</strong>
              </p>

              <p className="text-lg lg:text-xl text-slate-300 leading-relaxed text-left">
                Por eso creamos un ecosistema completo que democratiza el acceso a <strong className="text-white">tecnología de nivel corporativo</strong>, entregando el sistema probado, la IA que automatiza el trabajo pesado, y productos únicos con patente mundial.
              </p>
            </div>
          </section>

          {/* HOW - Cómo lo Hacemos (3 Pilares) */}
          <section className="max-w-7xl mx-auto mb-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block bg-blue-500/10 text-blue-300 font-semibold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 border border-blue-500/20">
                Cómo lo Hacemos
              </div>
              <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">
                No es Magia. Es una Arquitectura Superior.
              </h2>
              <p className="text-slate-400 text-lg">
                Transformamos esa visión en un sistema de 3 pilares, potenciado por tecnología que trabaja para ti 24/7.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <HOWPillar
                icon={<Zap size={32} />}
                title="Framework IAA"
                description="Nuestro sistema propietario que simplifica tu enfoque en 3 acciones de alto valor: Iniciar, Acoger y Activar."
                iconColor="text-blue-400"
                iconBg="bg-blue-500/10"
              />
              <HOWPillar
                icon={<BrainCircuit size={32} />}
                title="NEXUS IA"
                description="Tu copiloto de inteligencia artificial que educa, cualifica y da seguimiento, liberando tu tiempo para la estrategia."
                iconColor="text-purple-400"
                iconBg="bg-purple-500/10"
              />
              <HOWPillar
                icon={<Box size={32} />}
                title="Productos con Patente"
                description="Un foso competitivo infranqueable. Distribuyes productos únicos que nadie más en el mundo puede replicar."
                iconColor="text-green-400"
                iconBg="bg-green-500/10"
              />
            </div>
          </section>

          {/* PARA QUIÉN - Arquetipos */}
          <section className="max-w-5xl mx-auto mb-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block bg-amber-500/10 text-amber-300 font-semibold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 border border-amber-500/20">
                Para Quién
              </div>
              <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">
                Diseñado para el Constructor Inteligente
              </h2>
              <p className="text-slate-400 text-lg">
                No importa tu título, sino tu mentalidad. Si buscas construir un activo a largo plazo en lugar de perseguir dinero rápido, este es tu ecosistema.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                icon={<TrendingUp size={24} />}
                title="Joven con Ambición"
                description="Para construir un activo antes de empezar una carrera."
                iconColor="text-cyan-400"
              />
            </div>

            <div className="mt-8 text-center p-6 lg:p-8 bg-blue-500/5 border border-purple-500/20 rounded-xl backdrop-filter backdrop-blur-xl">
              <p className="text-lg lg:text-xl text-slate-300 leading-relaxed">
                Si crees que tienes el <strong className="text-amber-400">talento</strong> y la <strong className="text-amber-400">capacidad</strong>,<br />
                y solo te falta la <strong className="text-amber-400">oportunidad real</strong>...
                <br /><br />
                <span className="text-xl lg:text-2xl font-bold text-white">
                  Esto fue diseñado para ti.
                </span>
              </p>
            </div>
          </section>

          {/* SOCIAL PROOF - Prueba de Confianza */}
          <section className="max-w-5xl mx-auto mb-20">
            <div className="text-center mb-12">
              <div className="inline-block bg-green-500/10 text-green-300 font-semibold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 border border-green-500/20">
                Construido Sobre Base Sólida
              </div>
              <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl mb-4">El Sistema que Ya Probó que Funciona</h2>
              <p className="text-slate-300 max-w-3xl mx-auto mb-12">
                Esta innovación no nace en el vacío. Es el resultado de 9 años de éxito probado, ahora potenciado por un socio corporativo con 30+ años de trayectoria global y una patente mundial que garantiza su unicidad.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-8 mb-12">
              <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-amber-500/30 rounded-3xl shadow-2xl p-8 text-center">
                <p className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">9 Años</p>
                <p className="text-slate-400 text-lg">de Liderazgo Probado</p>
                <p className="text-sm text-slate-500 mt-2">2,847 constructores exitosos</p>
              </div>
              <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-amber-500/30 rounded-3xl shadow-2xl p-8 text-center">
                <p className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">30+ Años</p>
                <p className="text-slate-400 text-lg">de Respaldo Corporativo</p>
                <p className="text-sm text-slate-500 mt-2">Gano Excel - Patente Mundial</p>
              </div>
            </div>

            <div className="text-center p-8 lg:p-12 bg-blue-500/5 border border-purple-500/20 rounded-xl backdrop-filter backdrop-blur-xl">
              <p className="text-xl lg:text-2xl font-semibold text-white">
                Los primeros <strong className="text-amber-400">2,847 probaron que funciona</strong> sin tecnología.
                <br /><br />
                Imagina lo que <strong className="text-amber-400">TÚ lograrás con ella.</strong>
              </p>
            </div>
          </section>

          {/* MISIÓN - Social Proof del WHY */}
          <section className="max-w-7xl mx-auto mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-block bg-purple-500/10 text-purple-300 font-semibold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full mb-6 border border-purple-500/20">
                  Nuestra Misión
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  <span className="block text-slate-400 mb-2">Hacia dónde vamos:</span>
                  <span className="creatuactivo-h1-ecosystem block">4 Millones de Arquitectos</span>
                </h2>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  No estamos construyendo solo una plataforma. Estamos construyendo un movimiento. Nuestra visión es transformar 4 millones de vidas, entregando la arquitectura para que cada persona pueda construir su propio activo. Creemos que la verdadera libertad no viene de un ingreso, sino de la propiedad del sistema que lo genera.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500/10 p-2 rounded-full mt-1">
                      <BrainCircuit className="w-5 h-5 text-purple-300" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white text-lg mb-1">Democratizando la Tecnología</h3>
                      <p className="text-slate-400">Poniendo herramientas de nivel corporativo en manos de constructores individuales.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/10 p-2 rounded-full mt-1">
                      <Zap className="w-5 h-5 text-blue-300" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white text-lg mb-1">Con un Sistema Probado</h3>
                      <p className="text-slate-400">Entregando el Framework IAA como el plano para una construcción predecible.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500/10 p-2 rounded-full mt-1">
                      <ShieldCheck className="w-5 h-5 text-green-300" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white text-lg mb-1">Sobre una Base Sólida</h3>
                      <p className="text-slate-400">Apalancados en un socio con más de 30 años de trayectoria y productos con patente mundial.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-square flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-amber-500/20 rounded-full blur-3xl"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-8xl lg:text-9xl font-black bg-gradient-to-br from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">4M</p>
                    <p className="text-xl lg:text-2xl text-slate-400 font-semibold mt-4">Arquitectos de su Futuro</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA FINAL - Fundadores */}
          <section className="max-w-4xl mx-auto text-center py-20 mb-20">
            <h2 className="creatuactivo-h1-ecosystem text-3xl md:text-5xl lg:text-6xl font-bold mb-8">
              Los Fundadores escriben una historia diferente
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Mientras otros buscan empleos, ellos construyen activos.<br />
              Mientras otros venden tiempo, ellos escalan sistemas.<br />
              Mientras otros siguen tendencias, ellos crean el futuro.
              <br /><br />
              <span className="text-amber-400 font-semibold text-2xl">Esta es tu invitación para ser uno de ellos.</span>
            </p>
            <Link href="/fundadores" className="creatuactivo-cta-ecosystem text-lg">
              Convertirme en Fundador
            </Link>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
              <p>&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
              <p className="mt-2">El primer ecosistema tecnológico completo para construcción de activos en América.</p>
            </div>
          </footer>
        </main>
      </div>
    </>
  )
}
