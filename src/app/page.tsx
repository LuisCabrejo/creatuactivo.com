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
import { Zap, BrainCircuit, Box, Briefcase, Target, ShieldCheck, Lightbulb, Home, UsersRound, TrendingUp } from 'lucide-react'
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

export default function HomePage() {
  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-900 text-white min-h-screen">
        <StrategicNavigation />

        {/* Fondo decorativo sutil */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-[var(--creatuactivo-blue)] opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-[var(--creatuactivo-purple)] opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
        </div>

        <main className="relative z-10 px-4 lg:px-8">
          {/* HERO SECTION - LIMPIO */}
          <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-24">
            <div className="relative z-10 max-w-4xl fade-in-hero">
              <div className="inline-block bg-indigo-500/10 text-indigo-300 font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6 border border-indigo-500/30">
                Una Aplicación para Construir tu Activo
              </div>

              <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
                Imagina Despertar y Ver<br />Que Tu Negocio Ya Trabajó Por Ti
              </h1>

              <div className="text-xl md:text-2xl text-white mb-6">
                Se llama CreaTuActivo.
              </div>

              <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                Tu aplicación personal para construir un activo.
              </p>

              <div className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-10 space-y-3">
                <p>Mientras dormías, NEXUS respondió 12 conversaciones.</p>
                <p>Mientras desayunabas con tu familia, 3 personas mostraron interés real.</p>
                <p>Antes de las 9 AM, ya sabes exactamente qué hacer hoy.</p>
              </div>

              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <Link
                  href="/fundadores"
                  className="creatuactivo-cta-ecosystem w-full md:w-auto text-lg flex items-center justify-center"
                >
                  Activar mi Aplicación
                </Link>
                <Link
                  href="/presentacion-empresarial"
                  className="w-full md:w-auto bg-white/10 backdrop-blur-lg text-slate-300 font-semibold py-4 px-8 rounded-lg hover:bg-white/20 transition-colors duration-300 text-center border border-white/20"
                >
                  Ver Cómo Funciona
                </Link>
              </div>
            </div>
          </section>

          {/* WHY PROFUNDO - Limpio */}
          <section className="max-w-4xl mx-auto mb-20">
            <div className="creatuactivo-why-card p-8 lg:p-12">
              <div className="text-center mb-6">
                <div className="inline-block bg-indigo-500/10 text-amber-400 font-semibold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border border-indigo-500/20">
                  Nuestra Creencia Fundamental
                </div>
              </div>

              <p className="text-xl lg:text-2xl text-white leading-relaxed mb-6 text-left">
                Creemos firmemente que las personas merecen cumplir sueños, viajar, tener estabilidad financiera, ser dueños de su tiempo y su vida.
              </p>

              <p className="text-xl lg:text-2xl text-white leading-relaxed mb-6 text-left">
                Y creemos que construir un activo patrimonial no debe ser tan difícil.
              </p>

              <p className="text-lg lg:text-xl text-slate-300 leading-relaxed text-left">
                Por eso creamos CreaTuActivo: una aplicación completa que te da el sistema probado, la tecnología que automatiza el trabajo pesado, y productos únicos con patente mundial.
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
                CreaTuActivo: Tu Aplicación Completa
              </h2>
              <p className="text-slate-400 text-lg">
                No te damos un "negocio para trabajar". Te damos una aplicación que trabaja por ti 24/7.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <HOWPillar
                icon={<Box size={32} />}
                title="Producto con Patente Mundial"
                description="Gano Excel (30+ años, 100% libre de deudas). No compites con Amazon. No compites con Rappi. Tienes algo único que solo tú puedes ofrecer en tu red."
                iconColor="text-green-400"
                iconBg="bg-green-500/10"
              />
              <HOWPillar
                icon={<Zap size={32} />}
                title="Sistema Probado con 2,847 Personas"
                description="Los 3 Pasos: IAA (Iniciar, Acoger, Activar). Ya funcionó 9 años sin tecnología. Ahora con CreaTuActivo, es 10 veces más fácil."
                iconColor="text-blue-400"
                iconBg="bg-blue-500/10"
              />
              <HOWPillar
                icon={<BrainCircuit size={32} />}
                title="CreaTuActivo: Tu Aplicación 24/7"
                description="NEXUS (tu asistente IA) conversa profesionalmente, califica interés real, y te dice exactamente a quién contactar. Tú solo guías el sistema."
                iconColor="text-purple-400"
                iconBg="bg-purple-500/10"
              />
            </div>

            <div className="mt-16 text-center max-w-3xl mx-auto">
              <p className="text-2xl text-slate-200 leading-relaxed mb-4">
                ¿Ves la diferencia?
              </p>
              <p className="text-xl text-slate-400 leading-relaxed">
                No te damos un "negocio para trabajar". Te damos CreaTuActivo: una aplicación completa que trabaja por ti.
              </p>
            </div>
          </section>

          {/* PARA QUIÉN - Arquetipos */}
          <section className="max-w-5xl mx-auto mb-20">
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
                Si crees que tienes el talento y la capacidad, y solo te falta la oportunidad real...
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
                CreaTuActivo no nace en el vacío. Es el resultado de 9 años de éxito probado, ahora potenciado por Gano Excel (30+ años, patente mundial).
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
                Los primeros 2,847 probaron que funciona sin tecnología.
                <br /><br />
                Imagina lo que TÚ lograrás con CreaTuActivo.
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
                  <span className="creatuactivo-h1-ecosystem block">4 Millones de Personas</span>
                </h2>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  No estamos construyendo solo una aplicación. Estamos construyendo un movimiento. Nuestra visión es transformar 4 millones de vidas, dándoles las herramientas para que cada persona pueda construir su propio activo. Creemos que la verdadera libertad no viene de un ingreso, sino de ser dueño del sistema que lo genera.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500/10 p-2 rounded-full mt-1">
                      <BrainCircuit className="w-5 h-5 text-purple-300" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white text-lg mb-1">Tecnología para Todos</h3>
                      <p className="text-slate-400">Poniendo una aplicación profesional en manos de cualquier persona con ambición.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/10 p-2 rounded-full mt-1">
                      <Zap className="w-5 h-5 text-blue-300" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white text-lg mb-1">Con un Sistema Probado</h3>
                      <p className="text-slate-400">Los 3 Pasos: IAA - 3 pasos simples que ya funcionaron con 2,847 personas.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500/10 p-2 rounded-full mt-1">
                      <ShieldCheck className="w-5 h-5 text-green-300" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white text-lg mb-1">Sobre una Base Sólida</h3>
                      <p className="text-slate-400">Gano Excel: 30+ años, productos con patente mundial, 100% libre de deudas.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-square flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-amber-500/20 rounded-full blur-3xl"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-8xl lg:text-9xl font-black bg-gradient-to-br from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">4M</p>
                    <p className="text-xl lg:text-2xl text-slate-400 font-semibold mt-4">Dueños de su Futuro</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA FINAL - Fundadores */}
          <section className="max-w-4xl mx-auto text-center py-20 mb-20">
            <h2 className="creatuactivo-h1-ecosystem text-3xl md:text-5xl lg:text-6xl font-bold mb-8">
              Solo 150 Espacios como Fundador
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Si crees que despertar sin alarma es más valioso que cualquier salario...<br />
              Si crees que estar en el recital de tu hija no debería costarte un día de vacaciones...<br />
              Si crees que tus nietos merecen heredar libertad, no solo fotos...
              <br /><br />
              <span className="text-white font-semibold text-2xl">Entonces CreaTuActivo es para ti.</span>
            </p>
            <Link href="/fundadores" className="creatuactivo-cta-ecosystem text-lg">
              Activar mi Aplicación
            </Link>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto mt-6">
              Solo 150 espacios como Fundador hasta el 04 de enero 2026. Después, solo podrás entrar como Constructor bajo la mentoría de alguien más.
            </p>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
              <p>&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
              <p className="mt-2">CreaTuActivo: La primera aplicación completa para construir tu activo en América Latina.</p>
            </div>
          </footer>
        </main>
      </div>
    </>
  )
}
