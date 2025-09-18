'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronDown,
  X,
  Zap,
  BrainCircuit,
  Box,
  Users,
  GraduationCap,
  Briefcase,
  MonitorSmartphone,
  School,
  ShieldCheck,
  Lightbulb,
  Home,
  Crown,
  Menu
} from 'lucide-react'

// ✅ ZERO FOUC: CSS crítico inline que renderiza perfectamente desde el primer frame
const CRITICAL_NAVIGATION_CSS = `
  /* ANTI-FOUC CRÍTICO - NAVEGACIÓN BASE INMEDIATA */
  .strategic-nav-critical {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .strategic-nav-container {
    max-width: 80rem;
    margin: 0 auto;
    padding: 0 1rem;
  }

  @media (min-width: 640px) {
    .strategic-nav-container {
      padding: 0 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .strategic-nav-container {
      padding: 0 2rem;
    }
  }

  .strategic-nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 5rem;
  }

  /* LOGO SECTION - RENDERIZADO INMEDIATO */
  .strategic-logo-container {
    flex-shrink: 0;
  }

  .strategic-logo-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.3s ease;
  }

  .strategic-logo-link:hover {
    transform: scale(1.02);
  }

  .strategic-logo-image-container {
    position: relative;
    width: 40px;
    height: 40px;
  }

  @media (max-width: 767px) {
    .strategic-logo-image-container {
      width: 32px;
      height: 32px;
    }
  }

  .strategic-logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
  }

  .strategic-logo-text:hover {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #fbbf24 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* MENU DESKTOP - LAYOUT INMEDIATO */
  .strategic-menu-desktop {
    display: none;
    align-items: center;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .strategic-menu-desktop {
      display: flex;
    }
  }

  .strategic-menu-item {
    position: relative;
    color: #cbd5e1;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    padding: 0.5rem 0;
    transition: color 0.3s ease;
  }

  .strategic-menu-item:hover {
    color: #ffffff;
  }

  .strategic-menu-button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: none;
    color: inherit;
    font-weight: inherit;
    cursor: inherit;
    padding: 0;
  }

  .strategic-chevron {
    width: 1rem;
    height: 1rem;
    transition: transform 0.3s ease;
  }

  .strategic-menu-item:hover .strategic-chevron {
    transform: rotate(180deg);
  }

  /* DROPDOWN - POSITIONED CORRECTLY */
  .strategic-dropdown {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding-top: 0.5rem;
    z-index: 60;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
  }

  .strategic-dropdown.active {
    opacity: 1;
    visibility: visible;
  }

  .strategic-dropdown-content {
    width: 20rem;
    background: rgba(30, 41, 59, 0.95);
    backdrop-filter: blur(16px);
    border-radius: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    padding: 0.5rem;
  }

  .strategic-dropdown-item {
    display: flex;
    align-items: flex-start;
    width: 100%;
    padding: 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    transition: background-color 0.2s ease;
  }

  .strategic-dropdown-item:hover {
    background-color: rgba(51, 65, 85, 0.5);
  }

  .strategic-dropdown-icon {
    flex-shrink: 0;
    margin-top: 0.25rem;
    margin-right: 1rem;
  }

  .strategic-dropdown-text h4 {
    color: #ffffff;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
    transition: color 0.2s ease;
  }

  .strategic-dropdown-item:hover h4 {
    color: #60a5fa;
  }

  .strategic-dropdown-text p {
    color: #94a3b8;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.4;
  }

  /* BOTÓN FUNDADORES - STYLING CRÍTICO */
  .strategic-cta-button {
    display: none;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
    color: #ffffff;
    font-weight: 700;
    padding: 1rem 2rem;
    border-radius: 1rem;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
  }

  @media (min-width: 768px) {
    .strategic-cta-button {
      display: flex;
    }
  }

  .strategic-cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(30, 64, 175, 0.5);
  }

  /* MOBILE BUTTON - IMMEDIATE RENDER */
  .strategic-mobile-toggle {
    display: block;
    background: none;
    border: none;
    color: #cbd5e1;
    padding: 0.5rem;
    margin: -0.5rem;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  @media (min-width: 768px) {
    .strategic-mobile-toggle {
      display: none;
    }
  }

  .strategic-mobile-toggle:hover {
    color: #ffffff;
  }

  /* MOBILE OVERLAY */
  .strategic-mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 70;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  .strategic-mobile-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  /* MOBILE MENU */
  .strategic-mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    max-width: 28rem;
    background: rgba(15, 23, 42, 0.98);
    backdrop-filter: blur(24px);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    overflow-y: auto;
    z-index: 80;
  }

  .strategic-mobile-menu.active {
    transform: translateX(0);
  }

  .strategic-mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .strategic-mobile-close {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 0.5rem;
    transition: color 0.2s ease;
  }

  .strategic-mobile-close:hover {
    color: #ffffff;
  }

  .strategic-mobile-content {
    padding: 1.5rem;
  }

  .strategic-mobile-section {
    margin-bottom: 2rem;
  }

  .strategic-mobile-section-title {
    color: #94a3b8;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
    padding: 0 1rem;
  }

  .strategic-mobile-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #cbd5e1;
    text-decoration: none;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    margin-bottom: 0.25rem;
    transition: all 0.2s ease;
  }

  .strategic-mobile-link:hover {
    background-color: rgba(124, 58, 237, 0.1);
    color: #ffffff;
    transform: translateX(0.25rem);
  }

  .strategic-mobile-link-content {
    flex: 1;
  }

  .strategic-mobile-link h4 {
    color: inherit;
    font-weight: 500;
    margin: 0 0 0.25rem 0;
  }

  .strategic-mobile-link p {
    color: #94a3b8;
    font-size: 0.75rem;
    margin: 0;
    line-height: 1.3;
  }

  .strategic-mobile-cta {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .strategic-mobile-cta-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
    color: #ffffff;
    font-weight: 700;
    padding: 1rem;
    border-radius: 0.75rem;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
  }

  .strategic-mobile-cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(30, 64, 175, 0.5);
  }

  /* HABILITACIÓN DE TRANSICIONES POST-HIDRATACIÓN */
  .strategic-nav-enhanced .strategic-logo-link {
    transition: transform 0.3s ease;
  }

  .strategic-nav-enhanced .strategic-menu-item {
    transition: color 0.3s ease;
  }

  .strategic-nav-enhanced .strategic-chevron {
    transition: transform 0.3s ease;
  }

  .strategic-nav-enhanced .strategic-dropdown {
    transition: opacity 0.2s ease, visibility 0.2s ease;
  }
`

export default function StrategicNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isTransitionsEnabled, setIsTransitionsEnabled] = useState(false)
  const pathname = usePathname()

  // ✅ ANTI-FOUC: Habilitar transiciones después de hidratación
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitionsEnabled(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // ✅ CONTROL BODY SCROLL
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMobileMenuOpen])

  const menuStructure = [
    {
      name: 'El Sistema',
      items: [
        {
          name: 'Nuestro Framework (IAA)',
          href: '/sistema/framework-iaa',
          icon: <Zap className="w-5 h-5 text-blue-400" />,
          description: 'La metodología propietaria para la construcción de activos.'
        },
        {
          name: 'Nuestra Tecnología',
          href: '/sistema/tecnologia',
          icon: <BrainCircuit className="w-5 h-5 text-purple-400" />,
          description: 'NEXUS IA y NodeX: tu ventaja competitiva.'
        },
        {
          name: 'Nuestros Productos',
          href: '/sistema/productos',
          icon: <Box className="w-5 h-5 text-green-400" />,
          description: 'El motor de valor con patente mundial.'
        },
        {
          name: 'Nuestro Socio Corporativo',
          href: '/sistema/socio-corporativo',
          icon: <ShieldCheck className="w-5 h-5 text-yellow-400" />,
          description: 'Gano Excel: la base de credibilidad y trayectoria.'
        }
      ]
    },
    {
      name: 'Soluciones',
      items: [
        {
          name: 'Profesional con Visión',
          href: '/soluciones/profesional-con-vision',
          icon: <Briefcase className="w-5 h-5 text-cyan-400" />,
          description: 'Para construir un activo, no solo una carrera.'
        },
        {
          name: 'Emprendedor y Dueño de Negocio',
          href: '/soluciones/emprendedor-negocio',
          icon: <MonitorSmartphone className="w-5 h-5 text-orange-400" />,
          description: 'Para escalar con un sistema, no con más tareas.'
        },
        {
          name: 'Independiente y Freelancer',
          href: '/soluciones/independiente-freelancer',
          icon: <Lightbulb className="w-5 h-5 text-purple-400" />,
          description: 'Para convertir el talento en un activo escalable.'
        },
        {
          name: 'Líder del Hogar',
          href: '/soluciones/lider-del-hogar',
          icon: <Home className="w-5 h-5 text-pink-400" />,
          description: 'Para construir con flexibilidad y propósito.'
        },
        {
          name: 'Líder de la Comunidad',
          href: '/soluciones/lider-comunidad',
          icon: <Users className="w-5 h-5 text-teal-400" />,
          description: 'Para transformar tu influencia en un legado tangible.'
        },
        {
          name: 'Joven con Ambición',
          href: '/soluciones/joven-con-ambicion',
          icon: <School className="w-5 h-5 text-green-400" />,
          description: 'Para construir un activo antes de empezar una carrera.'
        }
      ]
    },
    {
      name: 'El Ecosistema',
      items: [
        {
          name: 'La Comunidad',
          href: '/ecosistema/comunidad',
          icon: <Users className="w-5 h-5 text-teal-400" />,
          description: 'Historias de éxito, eventos y el pulso humano.'
        },
        {
          name: 'La Academia',
          href: '/ecosistema/academia',
          icon: <GraduationCap className="w-5 h-5 text-indigo-400" />,
          description: 'Rutas de aprendizaje para maestros constructores.'
        }
      ]
    }
  ]

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)
  }

  const handleLinkClick = () => {
    closeMobileMenu()
  }

  const handleDropdownEnter = (sectionName: string) => {
    setActiveDropdown(sectionName)
  }

  const handleDropdownLeave = () => {
    setActiveDropdown(null)
  }

  return (
    <>
      {/* ✅ CSS CRÍTICO INLINE - ZERO FOUC GARANTIZADO */}
      <style dangerouslySetInnerHTML={{ __html: CRITICAL_NAVIGATION_CSS }} />

      {/* ✅ HEADER PRINCIPAL */}
      <header className={`strategic-nav-critical ${isTransitionsEnabled ? 'strategic-nav-enhanced' : ''}`}>
        <nav className="strategic-nav-container">
          <div className="strategic-nav-content">

            {/* ✅ LOGO SECTION */}
            <div className="strategic-logo-container">
              <Link href="/" className="strategic-logo-link">
                <div className="strategic-logo-image-container">
                  {/* Desktop Logo */}
                  <Image
                    src="/logo-icon-80x80-sm.svg"
                    alt="CreaTuActivo"
                    width={40}
                    height={40}
                    className="hidden md:block"
                    priority
                  />
                  {/* Mobile Logo */}
                  <Image
                    src="/favicon-40x40.svg"
                    alt="CreaTuActivo"
                    width={32}
                    height={32}
                    className="md:hidden"
                    priority
                  />
                </div>
                <span className="strategic-logo-text">CreaTuActivo</span>
              </Link>
            </div>

            {/* ✅ MENU DESKTOP */}
            <div className="strategic-menu-desktop">
              {menuStructure.map((section) => (
                <div
                  key={section.name}
                  className="strategic-menu-item"
                  onMouseEnter={() => handleDropdownEnter(section.name)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="strategic-menu-button">
                    {section.name}
                    <ChevronDown className="strategic-chevron" />
                  </button>

                  {/* DROPDOWN */}
                  <div className={`strategic-dropdown ${activeDropdown === section.name ? 'active' : ''}`}>
                    <div className="strategic-dropdown-content">
                      {section.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="strategic-dropdown-item"
                          onClick={handleLinkClick}
                        >
                          <div className="strategic-dropdown-icon">{item.icon}</div>
                          <div className="strategic-dropdown-text">
                            <h4>{item.name}</h4>
                            <p>{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* PRESENTACIÓN DIRECT LINK */}
              <Link
                href="/presentacion-empresarial"
                className="strategic-menu-item"
                onClick={handleLinkClick}
              >
                Presentación
              </Link>
            </div>

            {/* ✅ BOTONES DERECHA */}
            <div className="flex items-center gap-4">
              {/* BOTÓN FUNDADORES DESKTOP */}
              <Link href="/fundadores" className="strategic-cta-button">
                <Crown className="w-4 h-4" />
                Sé Fundador
              </Link>

              {/* MOBILE TOGGLE */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="strategic-mobile-toggle"
                aria-label="Abrir menú"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ✅ MOBILE MENU OVERLAY */}
      <div
        className={`strategic-mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* ✅ MOBILE MENU */}
      <div className={`strategic-mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        {/* Mobile Header */}
        <div className="strategic-mobile-header">
          <Link href="/" className="strategic-logo-link" onClick={handleLinkClick}>
            <div className="strategic-logo-image-container">
              <Image
                src="/favicon-40x40.svg"
                alt="CreaTuActivo"
                width={32}
                height={32}
              />
            </div>
            <span className="strategic-logo-text">CreaTuActivo</span>
          </Link>
          <button onClick={closeMobileMenu} className="strategic-mobile-close">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Content */}
        <div className="strategic-mobile-content">
          {menuStructure.map((section) => (
            <div key={section.name} className="strategic-mobile-section">
              <h3 className="strategic-mobile-section-title">{section.name}</h3>
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="strategic-mobile-link"
                  onClick={handleLinkClick}
                >
                  <div className="strategic-dropdown-icon">{item.icon}</div>
                  <div className="strategic-mobile-link-content">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          ))}

          {/* Presentación Direct Link */}
          <div className="strategic-mobile-section">
            <Link
              href="/presentacion-empresarial"
              className="strategic-mobile-link"
              onClick={handleLinkClick}
            >
              <div className="strategic-dropdown-icon">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div className="strategic-mobile-link-content">
                <h4>Presentación Empresarial</h4>
                <p>Conoce el sistema completo de distribución</p>
              </div>
            </Link>
          </div>

          {/* Mobile CTA */}
          <div className="strategic-mobile-cta">
            <Link href="/fundadores" className="strategic-mobile-cta-button" onClick={handleLinkClick}>
              <Crown className="w-4 h-4" />
              Sé Fundador
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
