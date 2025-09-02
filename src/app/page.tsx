'use client'

import React from 'react'
import { Zap, BrainCircuit, Box, Briefcase, MonitorSmartphone, Home, School } from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'

// HERO SECTION con branding CreaTuActivo.com - POSICIONAMIENTO ORIGINAL
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full filter blur-3xl animate-pulse"
             style={{background: '#1E40AF'}}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full filter blur-3xl animate-pulse"
             style={{background: '#7C3AED', animationDelay: '2s'}}></div>
      </div>

      {/* Contenido con animaciones CSS puras */}
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
            className="bg-white/10 backdrop-blur-lg text-slate-300 font-semibold py-4 px-8 rounded-2xl hover:bg-white/20 transition-colors duration-300 border border-white/10"
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
      {/* Estilos CSS del branding CreaTuActivo.com */}
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

        /* ANIMACIONES CSS PURAS */
        .fade-in-hero {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 1;
          transform: none;
        }

        .fade-in-card {
          animation: fadeInUp 0.6s ease-out forwards;
          animation-delay: 0.2s;
          opacity: 1;
          transform: none;
        }

        .fade-in-card:nth-child(2) {
          animation-delay: 0.3s;
        }

        .fade-in-card:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <StrategicNavigation />

      <HeroSection />

      <section className="py-20 lg:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">
              No es Magia. Es Método.
            </h2>
            <p className="text-slate-400 text-lg">
              Nuestro Framework IAA (Iniciar, Acoger, Activar) es el motor de todo lo que hacemos.
              Es el sistema que convierte intentos en activos reales.
            </p>
          </div>

          {/* CARDS con branding CreaTuActivo.com */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="creatuactivo-component-card p-8 text-center fade-in-card">
              <Zap className="w-12 h-12 mx-auto mb-4" style={{color: 'var(--creatuactivo-blue)'}} />
              <h3 className="text-xl font-bold mb-3 text-white">Iniciar</h3>
              <p className="text-slate-300">Identificamos tu oportunidad única y te equipamos con las herramientas para comenzar.</p>
            </div>

            <div className="creatuactivo-component-card p-8 text-center fade-in-card">
              <BrainCircuit className="w-12 h-12 mx-auto mb-4" style={{color: 'var(--creatuactivo-purple)'}} />
              <h3 className="text-xl font-bold mb-3 text-white">Acoger</h3>
              <p className="text-slate-300">Te integramos en un ecosistema de constructores que ya están donde quieres llegar.</p>
            </div>

            <div className="creatuactivo-component-card p-8 text-center fade-in-card">
              <Box className="w-12 h-12 mx-auto mb-4" style={{color: 'var(--creatuactivo-gold)'}} />
              <h3 className="text-xl font-bold mb-3 text-white">Activar</h3>
              <p className="text-slate-300">Distribuyes productos únicos que nadie más en el mundo puede replicar.</p>
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
              <h4 className="font-bold text-lg text-white">Profesionales</h4>
              <p className="text-sm text-slate-400">
                Que buscan trascender el modelo de intercambiar tiempo por dinero.
              </p>
            </div>

            <div className="p-6 bg-slate-800 rounded-lg border border-white/10">
              <MonitorSmartphone className="w-8 h-8 text-orange-400 mb-3" />
              <h4 className="font-bold text-lg text-white">Emprendedores</h4>
              <p className="text-sm text-slate-400">
                Listos para escalar con un sistema probado en lugar de hacerlo todo manualmente.
              </p>
            </div>

            <div className="p-6 bg-slate-800 rounded-lg border border-white/10">
              <Home className="w-8 h-8 text-pink-400 mb-3" />
              <h4 className="font-bold text-lg text-white">Líderes del Hogar</h4>
              <p className="text-sm text-slate-400">
                Que buscan construir un activo con flexibilidad y propósito.
              </p>
            </div>

            <div className="p-6 bg-slate-800 rounded-lg border border-white/10">
              <School className="w-8 h-8 text-green-400 mb-3" />
              <h4 className="font-bold text-lg text-white">Jóvenes con Ambición</h4>
              <p className="text-sm text-slate-400">
                Que quieren construir un activo antes de empezar una carrera.
              </p>
            </div>
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
