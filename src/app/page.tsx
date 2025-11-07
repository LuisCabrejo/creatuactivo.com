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
// Se mantienen los íconos ya que los necesarios para la nueva sección ya estaban importados.
import { Zap, BrainCircuit, Box, Briefcase, MonitorSmartphone, Home, School, Globe, GitBranch, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'

// HERO SECTION (Sin cambios)
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4">
      <div className="absolute inset-0 z-0 opacity-15">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full filter blur-3xl animate-pulse"
             style={{background: '#1E40AF'}}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full filter blur-3xl animate-pulse"
             style={{background: '#7C3AED', animationDelay: '2s'}}></div>
      </div>
      <div className="relative z-10 max-w-4xl fade-in-hero">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 50%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em'
            }}>
          No busques un ingreso. Construye el sistema que lo genera.
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Te entregamos el sistema y la tecnología avanzada para que construyas un activo digital que trabaje para ti, 24/7.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/sistema/framework-iaa"
            className="creatuactivo-cta-ecosystem text-base"
            style={{
              background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)',
              borderRadius: '16px',
              padding: '18px 36px',
              fontWeight: '700',
              color: 'white',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 20px rgba(30, 64, 175, 0.4)',
              display: 'inline-block',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-3px)';
              (e.target as HTMLElement).style.boxShadow = '0 12px 35px rgba(30, 64, 175, 0.5)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0px)';
              (e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(30, 64, 175, 0.4)';
            }}
          >
            Descubre el Sistema
          </Link>
          <Link
            href="/fundadores"
            className="bg-white/20 backdrop-blur-lg text-slate-100 font-semibold py-4 px-8 rounded-2xl hover:bg-white/30 transition-colors duration-300 border border-white/20"
          >
            Sé Fundador
          </Link>
        </div>
      </div>
    </section>
  );
};

// COMPONENTE PRINCIPAL con branding completo
export default function HomePage() {
  return (
    <div className="bg-slate-900 text-white">
      {/* Estilos CSS (Sin cambios) */}
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
          text-decoration: none;
          display: inline-block;
        }
        .creatuactivo-cta-ecosystem:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(30, 64, 175, 0.5);
        }
        .fade-in-hero { animation: fadeInUp 0.8s ease-out forwards; opacity: 1; transform: none; }
        .fade-in-card { animation: fadeInUp 0.6s ease-out forwards; animation-delay: 0.2s; opacity: 1; transform: none; }
        .fade-in-card:nth-child(2) { animation-delay: 0.3s; }
        .fade-in-card:nth-child(3) { animation-delay: 0.4s; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <StrategicNavigation />

      <HeroSection />

      {/* AJUSTE 1: Esta sección completa ha sido actualizada con el contenido del borrador. */}
      <section className="py-20 lg:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">No es Magia. Es una Arquitectura Superior.</h2>
            <p className="text-slate-400 text-lg">Hemos decodificado la construcción de activos en un sistema de 3 pilares, potenciado por tecnología que trabaja para ti 24/7.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="creatuactivo-component-card p-8">
              <div className="inline-block bg-blue-500/10 p-4 rounded-xl mb-4"><Zap className="w-8 h-8 text-blue-300"/></div>
              <h3 className="text-2xl font-bold mb-2 text-white">Framework IAA</h3>
              <p className="text-slate-400">Nuestro sistema propietario que simplifica tu enfoque en 3 acciones de alto valor: Iniciar, Acoger y Activar.</p>
            </div>
            <div className="creatuactivo-component-card p-8">
              <div className="inline-block bg-purple-500/10 p-4 rounded-xl mb-4"><BrainCircuit className="w-8 h-8 text-purple-300"/></div>
              <h3 className="text-2xl font-bold mb-2 text-white">NEXUS IA</h3>
              <p className="text-slate-400">Tu copiloto de inteligencia artificial que educa, cualifica y da seguimiento, liberando tu tiempo para la estrategia.</p>
            </div>
            <div className="creatuactivo-component-card p-8">
              <div className="inline-block bg-green-500/10 p-4 rounded-xl mb-4"><Box className="w-8 h-8 text-green-300"/></div>
              <h3 className="text-2xl font-bold mb-2 text-white">Productos con Patente</h3>
              <p className="text-slate-400">Un foso competitivo infranqueable. Distribuyes productos únicos que nadie más en el mundo puede replicar.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 px-4 bg-slate-900/70">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">
              Diseñado para el Constructor Inteligente.
            </h2>
            <p className="text-slate-400 text-lg">
              No importa tu título, sino tu mentalidad. Si buscas construir un activo a largo plazo
              en lugar de perseguir dinero rápido, este es tu ecosistema.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-800 rounded-lg border border-white/10">
              <Briefcase className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="font-bold text-lg text-white">Profesionales</h3>
              <p className="text-sm text-slate-400">
                Que buscan trascender el modelo de intercambiar tiempo por dinero.
              </p>
            </div>
            <div className="p-6 bg-slate-800 rounded-lg border border-white/10">
              <MonitorSmartphone className="w-8 h-8 text-orange-400 mb-3" />
              <h3 className="font-bold text-lg text-white">Emprendedores</h3>
              <p className="text-sm text-slate-400">
                Listos para escalar con un sistema probado en lugar de hacerlo todo manualmente.
              </p>
            </div>
            <div className="p-6 bg-slate-800 rounded-lg border border-white/10">
              <Home className="w-8 h-8 text-pink-400 mb-3" />
              <h3 className="font-bold text-lg text-white">Líderes del Hogar</h3>
              <p className="text-sm text-slate-400">
                Que buscan construir un activo con flexibilidad y propósito.
              </p>
            </div>

            {/* AJUSTE 2: Se actualiza el título, el texto y el color del ícono para esta tarjeta. */}
            <div className="p-6 bg-slate-800 rounded-lg border border-white/10">
              <School className="w-8 h-8 text-yellow-400 mb-3" />
              <h3 className="font-bold text-lg text-white">Visionarios</h3>
              <p className="text-sm text-slate-400">
                Estudiantes o jubilados con la ambición de construir su próximo gran activo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NUEVO: La sección de Misión que integramos en el paso anterior. */}
      <section className="py-20 lg:py-32 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="block text-slate-400">Nuestra Misión:</span>
              <span className="creatuactivo-h1-ecosystem block">4 Millones de Arquitectos.</span>
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              No estamos construyendo solo una plataforma. Estamos construyendo un movimiento. Nuestra visión es transformar 4 millones de vidas, entregando la arquitectura para que cada persona pueda construir su propio activo. Creemos que la verdadera libertad no viene de un ingreso, sino de la propiedad del sistema que lo genera.
            </p>
            <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                    <div className="bg-purple-500/10 p-2 rounded-full mt-1"><BrainCircuit className="w-5 h-5 text-purple-300"/></div>
                    <div>
                        <h3 className="font-bold text-white">Democratizando la Tecnología</h3>
                        <p className="text-slate-400 text-sm">Poniendo herramientas de nivel corporativo en manos de constructores individuales.</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <div className="bg-blue-500/10 p-2 rounded-full mt-1"><GitBranch className="w-5 h-5 text-blue-300"/></div>
                    <div>
                        <h3 className="font-bold text-white">Con un Sistema Probado</h3>
                        <p className="text-slate-400 text-sm">Entregando el Framework IAA como el plano para una construcción predecible.</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <div className="bg-green-500/10 p-2 rounded-full mt-1"><ShieldCheck className="w-5 h-5 text-green-300"/></div>
                    <div>
                        <h3 className="font-bold text-white">Sobre una Base Sólida</h3>
                        <p className="text-slate-400 text-sm">Apalancados en un socio con más de 30 años de trayectoria y productos con patente mundial.</p>
                    </div>
                </div>
            </div>
          </div>
          <div className="relative aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-800/50 rounded-full blur-3xl"></div>
            <Globe className="w-full h-full text-blue-500/30 relative" />
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="creatuactivo-h1-ecosystem text-3xl md:text-5xl lg:text-6xl font-bold mb-8">
            Los Fundadores escriben una historia diferente.
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Mientras otros buscan empleos, ellos construyen activos.
            Mientras otros venden tiempo, ellos escalan sistemas.
            Mientras otros siguen tendencias, ellos crean el futuro.
            <br /><br />
            Esta es tu invitación para ser uno de ellos.
          </p>
          <Link href="/fundadores" className="creatuactivo-cta-ecosystem text-lg">
            Convertirme en Fundador
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
          <p className="mt-2">Construyendo el futuro de la distribución inteligente en América.</p>
        </div>
      </footer>
    </div>
  );
}
