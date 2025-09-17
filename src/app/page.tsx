'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronDown, X, Zap, BrainCircuit, Box, Users, GraduationCap, Briefcase, MonitorSmartphone, Home, School, Globe, ShieldCheck, GitBranch, Crown } from 'lucide-react'
import Link from 'next/link'

// --- Estilos CSS Globales (Desde Guía de Branding v4.2) ---
// En un proyecto real, estos estarían en un archivo CSS global (globals.css).
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


// --- Componente de Navegación Estratégica (Branding v4.2) ---
const StrategicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = [
    {
      name: 'El Sistema',
      dropdown: [
        { name: 'Nuestro Framework (IAA)', href: '/sistema/framework-iaa', icon: <Zap className="w-5 h-5 text-blue-400" /> },
        { name: 'Nuestra Tecnología', href: '/sistema/tecnologia', icon: <BrainCircuit className="w-5 h-5 text-purple-400" /> },
        { name: 'Nuestros Productos', href: '/sistema/productos', icon: <Box className="w-5 h-5 text-green-400" /> },
        { name: 'Nuestro Socio Corporativo', href: '/sistema/socio-corporativo', icon: <ShieldCheck className="w-5 h-5 text-yellow-400" /> },
      ]
    },
    {
      name: 'Soluciones',
      dropdown: [
        { name: 'El Profesional Corporativo', href: '/soluciones/profesionales', icon: <Briefcase className="w-5 h-5 text-cyan-400" /> },
        { name: 'El Emprendedor Actual', href: '/soluciones/emprendedores', icon: <MonitorSmartphone className="w-5 h-5 text-orange-400" /> },
        { name: 'El Visionario Independiente', href: '/soluciones/independientes', icon: <Users className="w-5 h-5 text-pink-400" /> },
        { name: 'La Líder del Hogar', href: '/soluciones/lider-hogar', icon: <Home className="w-5 h-5 text-indigo-400" /> },
        { name: 'El Talento Emergente', href: '/soluciones/talento-emergente', icon: <School className="w-5 h-5 text-yellow-400" /> },
        { name: 'El Constructor de Legado', href: '/soluciones/legado', icon: <GraduationCap className="w-5 h-5 text-teal-400" /> },
      ]
    },
    { name: 'Presentación', href: '/presentacion-empresarial' },
    {
      name: 'El Ecosistema',
      dropdown: [
        { name: 'La Comunidad', href: '/ecosistema/comunidad', icon: <Users className="w-5 h-5 text-teal-400" /> },
        { name: 'La Academia', href: '/ecosistema/academia', icon: <GraduationCap className="w-5 h-5 text-indigo-400" /> },
      ]
    },
  ];

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[var(--creatuactivo-blue)] to-[var(--creatuactivo-purple)] bg-clip-text text-transparent">
              CreaTuActivo
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              item.dropdown ? (
                <div key={item.name} className="relative" onMouseEnter={() => setOpenDropdown(item.name)} onMouseLeave={() => setOpenDropdown(null)}>
                  <button className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center">
                    {item.name}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  <AnimatePresence>
                    {openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-slate-800/90 backdrop-blur-lg rounded-lg border border-white/10 shadow-xl"
                      >
                        <div className="p-2">
                          {item.dropdown.map((subItem) => (
                            <Link key={subItem.name} href={subItem.href} className="flex items-center p-3 rounded-md hover:bg-slate-700/50 transition-colors duration-200 text-slate-300">
                              {subItem.icon}
                              <span className="ml-3">{subItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={item.name} href={item.href} className="text-slate-300 hover:text-white transition-colors duration-300">
                  {item.name}
                </Link>
              )
            ))}
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              <Link href="/fundadores" className="bg-gradient-to-r from-[var(--creatuactivo-blue)] to-[var(--creatuactivo-purple)] text-white font-semibold py-2 px-5 rounded-lg hover:scale-105 transition-transform duration-300">
                Únete a los Fundadores
              </Link>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300 hover:text-white">
                {isMenuOpen ? <X size={24} /> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100vh - 5rem)' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900"
          >
            {/* Contenido del menú móvil aquí */}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};


// --- Componente Principal de la Homepage (Branding v4.2) ---
export default function HomePage() {
  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-900 text-white">
        <StrategicHeader />

        <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--creatuactivo-blue)] rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--creatuactivo-purple)] rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-4xl"
          >
            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl lg:text-7xl mb-6">
              No busques un ingreso. Construye el sistema que lo genera.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Te entregamos el sistema y la tecnología avanzada para que construyas un activo digital que trabaje para ti, 24/7.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/sistema/framework-iaa" className="creatuactivo-cta-ecosystem text-base">
                Descubre el Sistema
              </Link>
              <Link href="/fundadores" className="bg-white/10 backdrop-blur-lg text-slate-300 font-semibold py-4 px-8 rounded-2xl hover:bg-white/20 transition-colors duration-300 border border-white/10">
                Sé Fundador
              </Link>
            </div>
          </motion.div>
        </section>

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
              <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">Diseñado para el Constructor Inteligente.</h2>
              <p className="text-slate-400 text-lg">No importa tu título, sino tu mentalidad. Si buscas construir un activo a largo plazo en lugar de perseguir dinero rápido, este es tu ecosistema.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-slate-800 rounded-lg border border-white/10">
                <Briefcase className="w-8 h-8 text-cyan-400 mb-3"/>
                <h4 className="font-bold text-lg text-white">Profesionales</h4>
                <p className="text-sm text-slate-400">Que buscan trascender el modelo de intercambiar tiempo por dinero.</p>
              </div>
              <div className="p-6 bg-slate-800 rounded-lg border border-white/10">
                <MonitorSmartphone className="w-8 h-8 text-orange-400 mb-3"/>
                <h4 className="font-bold text-lg text-white">Emprendedores</h4>
                <p className="text-sm text-slate-400">Listos para escalar con un sistema probado en lugar de hacerlo todo manualmente.</p>
              </div>
              <div className="p-6 bg-slate-800 rounded-lg border border-white/10">
                <Home className="w-8 h-8 text-pink-400 mb-3"/>
                <h4 className="font-bold text-lg text-white">Líderes del Hogar</h4>
                <p className="text-sm text-slate-400">Que buscan construir un activo con flexibilidad y propósito.</p>
              </div>
              <div className="p-6 bg-slate-800 rounded-lg border border-white/10">
                <School className="w-8 h-8 text-yellow-400 mb-3"/>
                <h4 className="font-bold text-lg text-white">Visionarios</h4>
                <p className="text-sm text-slate-400">Estudiantes o jubilados con la ambición de construir su próximo gran activo.</p>
              </div>
            </div>
          </div>
        </section>

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
                          <h4 className="font-bold text-white">Democratizando la Tecnología</h4>
                          <p className="text-slate-400 text-sm">Poniendo herramientas de nivel corporativo en manos de constructores individuales.</p>
                      </div>
                  </div>
                   <div className="flex items-start gap-3">
                      <div className="bg-blue-500/10 p-2 rounded-full mt-1"><GitBranch className="w-5 h-5 text-blue-300"/></div>
                      <div>
                          <h4 className="font-bold text-white">Con un Sistema Probado</h4>
                          <p className="text-slate-400 text-sm">Entregando el Framework IAA como el plano para una construcción predecible.</p>
                      </div>
                  </div>
                   <div className="flex items-start gap-3">
                      <div className="bg-green-500/10 p-2 rounded-full mt-1"><ShieldCheck className="w-5 h-5 text-green-300"/></div>
                      <div>
                          <h4 className="font-bold text-white">Sobre una Base Sólida</h4>
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

        <section className="py-20 lg:py-32 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Crown className="w-16 h-16 text-[var(--creatuactivo-gold)] mx-auto mb-6"/>
            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-6">La historia la escriben los que construyen.</h2>
            <p className="text-slate-400 text-lg mb-10">La oportunidad de ser pionero en una nueva categoría es rara. Esta es tu invitación para ser uno de ellos.</p>
            <Link href="/fundadores" className="creatuactivo-cta-ecosystem text-lg inline-block">
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
    </>
  );
}
