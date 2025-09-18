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

// ✅ ZERO FOUC: CSS crítico inline que renderiza instantáneamente
const CRITICAL_NAVIGATION_CSS = `
  /* ANTI-FOUC CRÍTICO - FONT PRELOADING Y LAYOUT FIJO */
  .strategic-nav-critical * {
    font-family: system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
  }

  .strategic-nav-critical {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    width: 100%;
  }

  .strategic-nav-container {
    max-width: 80rem;
    margin: 0 auto;
    padding: 0 1rem;
    width: 100%;
    box-sizing: border-box;
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
    width: 100%;
    position: relative;
  }

  /* LOGO SECTION - DIMENSIONES FIJAS ANTI-SHIFT */
  .strategic-logo-container {
    flex-shrink: 0;
    min-width: 0;
  }

  .strategic-logo-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    text-decoration: none;
    width: auto;
    min-width: 0;
  }

  .strategic-logo-image-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
  }

  @media (min-width: 768px) {
    .strategic-logo-image-container {
      width: 40px;
      height: 40px;
    }
  }

  .strategic-logo-desktop {
    width: 40px;
    height: 40px;
    border-radius: 0.5rem;
    display: none;
    object-fit: cover;
  }

  .strategic-logo-mobile {
    width: 32px;
    height: 32px;
    border-radius: 0.5rem;
    display: block;
    object-fit: cover;
  }

  @media (min-width: 768px) {
    .strategic-logo-desktop {
      display: block;
    }

    .strategic-logo-mobile {
      display: none;
    }
  }

  /* TEXTO BRAND - DIMENSIONES FIJAS ANTI-FOUC */
  .strategic-brand-text {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
    background: linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #F59E0B 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    white-space: nowrap;
    min-width: 180px;
    display: block;
    flex-shrink: 0;
  }

  @media (min-width: 768px) {
    .strategic-brand-text {
      min-width: 200px;
    }
  }

  /* DESKTOP MENU - LAYOUT FIJO */
  .strategic-desktop-menu {
    display: none;
    align-items: center;
    gap: 2rem;
    flex-shrink: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
  }

  @media (min-width: 768px) {
    .strategic-desktop-menu {
      display: flex;
    }
  }

  .strategic-menu-item {
    position: relative;
    display: flex;
    align-items: center;
    color: #cbd5e1;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    padding: 0.5rem 0;
    white-space: nowrap;
  }

  .strategic-menu-item:hover {
    color: #ffffff;
  }

  .strategic-menu-button {
    background: none;
    border: none;
    color: #cbd5e1;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0;
    font-size: 1rem;
    white-space: nowrap;
    font-family: inherit;
  }

  .strategic-menu-button:hover {
    color: #ffffff;
  }

  .strategic-chevron {
    width: 1rem;
    height: 1rem;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .strategic-menu-button:hover .strategic-chevron {
    transform: rotate(180deg);
  }

  /* DROPDOWN - RENDERIZADO PERFECTO */
  .strategic-dropdown {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding-top: 0.5rem;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
    pointer-events: none;
    z-index: 100;
  }

  .strategic-dropdown.active {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
  }

  .strategic-dropdown-content {
    width: 20rem;
    background: rgba(30, 41, 59, 0.95);
    backdrop-filter: blur(16px);
    border-radius: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
    padding: 0.5rem;
  }

  .strategic-dropdown-item {
    display: flex;
    align-items: flex-start;
    padding: 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    color: #ffffff;
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
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 0.25rem;
    transition: color 0.2s ease;
    font-size: 0.875rem;
    line-height: 1.25;
  }

  .strategic-dropdown-item:hover h4 {
    color: #60a5fa;
  }

  .strategic-dropdown-text p {
    color: #94a3b8;
    font-size: 0.75rem;
    line-height: 1.4;
    margin: 0;
  }

  /* BUTTONS SECTION - POSICIÓN FIJA */
  .strategic-buttons-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
    min-width: 0;
  }

  .strategic-cta-button {
    display: none;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%);
    color: white;
    font-weight: 700;
    padding: 0.75rem 1.5rem;
    border-radius: 1rem;
    text-decoration: none;
    box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    white-space: nowrap;
    min-width: 140px;
    justify-content: center;
  }

  .strategic-cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(30, 64, 175, 0.5);
  }

  @media (min-width: 768px) {
    .strategic-cta-button {
      display: flex;
    }
  }

  .strategic-mobile-button {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #cbd5e1;
    padding: 0.5rem;
    margin: -0.5rem;
    cursor: pointer;
    background: none;
    border: none;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
  }

  .strategic-mobile-button:hover {
    color: #ffffff;
  }

  @media (min-width: 768px) {
    .strategic-mobile-button {
      display: none;
    }
  }

  /* MOBILE MENU - OVERLAY COMPLETO */
  .strategic-mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 60;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  .strategic-mobile-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  .strategic-mobile-menu {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 100%;
    max-width: 28rem;
    background: rgba(15, 23, 42, 0.98);
    backdrop-filter: blur(24px);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    overflow-y: auto;
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

  .strategic-mobile-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .strategic-mobile-brand-text {
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #F59E0B 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    white-space: nowrap;
  }

  .strategic-close-button {
    color: #94a3b8;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .strategic-close-button:hover {
    color: #ffffff;
  }

  .strategic-mobile-content {
    padding: 1.5rem;
  }

  .strategic-mobile-section {
    margin-bottom: 2rem;
  }

  .strategic-mobile-section h3 {
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
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .strategic-mobile-link:hover {
    background-color: rgba(51, 65, 85, 0.5);
    color: #ffffff;
  }

  .strategic-mobile-link-content {
    flex: 1;
    min-width: 0;
  }

  .strategic-mobile-link-title {
    font-weight: 500;
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
  }

  .strategic-mobile-link-desc {
    font-size: 0.75rem;
    color: #64748b;
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
    background: linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%);
    color: white;
    font-weight: 700;
    font-size: 1.125rem;
    padding: 1rem 1.5rem;
    border-radius: 1rem;
    text-decoration: none;
    box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .strategic-mobile-cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(30, 64, 175, 0.5);
  }

  /* HABILITACIÓN DE TRANSICIONES POST-HIDRATACIÓN */
  .strategic-nav-enhanced .strategic-logo-wrapper {
    transition: transform 0.3s ease;
  }

  .strategic-nav-enhanced .strategic-logo-wrapper:hover {
    transform: scale(1.05);
  }

  .strategic-nav-enhanced .strategic-logo-image-container::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(124, 58, 237, 0.2);
    border-radius: inherit;
    filter: blur(12px);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .strategic-nav-enhanced .strategic-logo-wrapper:hover .strategic-logo-image-container::after {
    opacity: 1;
  }

  .strategic-nav-enhanced .strategic-brand-text {
    transition: background 0.3s ease;
  }

  .strategic-nav-enhanced .strategic-logo-wrapper:hover .strategic-brand-text {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`

export default function StrategicNavigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isTransitionsEnabled, setIsTransitionsEnabled] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  // ✅ ANTI-FOUC: Habilitar transiciones solo después de hidratación
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitionsEnabled(true)
    }, 150)

    return () => clearTimeout(timer)
  }, [])

  // ✅ CONTROL BODY SCROLL
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMobileOpen])

  // ✅ CLEANUP TIMEOUTS
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  const menuItems = [
    {
      name: 'El Sistema',
      dropdown: [
        { name: 'Nuestro Framework (IAA)', href: '/sistema/framework-iaa', icon: <Zap className="w-5 h-5 text-blue-400" />, description: 'La metodología propietaria para la construcción de activos.' },
        { name: 'Nuestra Tecnología', href: '/sistema/tecnologia', icon: <BrainCircuit className="w-5 h-5 text-purple-400" />, description: 'NEXUS IA y NodeX: tu ventaja competitiva.' },
        { name: 'Nuestros Productos', href: '/sistema/productos', icon: <Box className="w-5 h-5 text-green-400" />, description: 'El motor de valor con patente mundial.' },
        { name: 'Nuestro Socio Corporativo', href: '/sistema/socio-corporativo', icon: <ShieldCheck className="w-5 h-5 text-yellow-400" />, description: 'Gano Excel: la base de credibilidad y trayectoria.' }
      ]
    },
    {
      name: 'Soluciones',
      dropdown: [
        { name: 'Profesional con Visión', href: '/soluciones/profesional-con-vision', icon: <Briefcase className="w-5 h-5 text-cyan-400" />, description: 'Para construir un activo, no solo una carrera.' },
        { name: 'Emprendedor y Dueño de Negocio', href: '/soluciones/emprendedor-negocio', icon: <MonitorSmartphone className="w-5 h-5 text-orange-400" />, description: 'Para escalar con un sistema, no con más tareas.' },
        { name: 'Independiente y Freelancer', href: '/soluciones/independiente-freelancer', icon: <Lightbulb className="w-5 h-5 text-purple-400" />, description: 'Para convertir el talento en un activo escalable.' },
        { name: 'Líder del Hogar', href: '/soluciones/lider-del-hogar', icon: <Home className="w-5 h-5 text-pink-400" />, description: 'Para construir con flexibilidad y propósito.' },
        { name: 'Líder de la Comunidad', href: '/soluciones/lider-comunidad', icon: <Users className="w-5 h-5 text-teal-400" />, description: 'Para transformar tu influencia en un legado tangible.' },
        { name: 'Joven con Ambición', href: '/soluciones/joven-con-ambicion', icon: <School className="w-5 h-5 text-green-400" />, description: 'Para construir un activo antes de empezar una carrera.' }
      ]
    },
    { name: 'Presentación', href: '/presentacion-empresarial' },
    {
      name: 'El Ecosistema',
      dropdown: [
        { name: 'La Comunidad', href: '/ecosistema/comunidad', icon: <Users className="w-5 h-5 text-teal-400" />, description: 'Historias de éxito, eventos y el pulso humano.' },
        { name: 'La Academia', href: '/ecosistema/academia', icon: <GraduationCap className="w-5 h-5 text-indigo-400" />, description: 'Rutas de aprendizaje para maestros constructores.' }
      ]
    }
  ]

  const handleLinkClick = () => {
    setIsMobileOpen(false)
    setOpenDropdown(null)
  }

  const handleMouseEnter = (itemName: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
    }
    setOpenDropdown(itemName)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenDropdown(null)
    }, 150)
    setHoverTimeout(timeout)
  }

  const handleDropdownMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
  }

  const handleDropdownMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenDropdown(null)
    }, 100)
    setHoverTimeout(timeout)
  }

  return (
    <>
      {/* ✅ CSS CRÍTICO INLINE - PREVIENE TODO FOUC */}
      <style dangerouslySetInnerHTML={{ __html: CRITICAL_NAVIGATION_CSS }} />

      <header className={`strategic-nav-critical ${isTransitionsEnabled ? 'strategic-nav-enhanced' : ''}`}>
        <nav className="strategic-nav-container">
          <div className="strategic-nav-content">

            {/* ✅ LOGO SECTION - RENDERIZADO PERFECTO */}
            <div className="strategic-logo-container">
              <Link href="/" className="strategic-logo-wrapper">
                <div className="strategic-logo-image-container">
                  <Image
                    src="/logo-icon-80x80-sm.svg"
                    alt="CreaTuActivo"
                    width={40}
                    height={40}
                    className="strategic-logo-desktop"
                    priority
                  />
                  <Image
                    src="/favicon-40x40.svg"
                    alt="CreaTuActivo"
                    width={32}
                    height={32}
                    className="strategic-logo-mobile"
                    priority
                  />
                </div>
                <span className="strategic-brand-text">CreaTuActivo</span>
              </Link>
            </div>

            {/* ✅ DESKTOP MENU - LAYOUT INMEDIATO */}
            <div className="strategic-desktop-menu">
              {menuItems.map((item) => (
                item.dropdown ? (
                  <div
                    key={item.name}
                    className="strategic-menu-item"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button className="strategic-menu-button">
                      {item.name}
                      <ChevronDown className="strategic-chevron" />
                    </button>

                    {/* DROPDOWN */}
                    <div className={`strategic-dropdown ${openDropdown === item.name ? 'active' : ''}`}>
                      <div className="absolute top-0 left-0 w-full h-2 bg-transparent" />
                      <div
                        className="strategic-dropdown-content"
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                      >
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={handleLinkClick}
                            className="strategic-dropdown-item"
                          >
                            <div className="strategic-dropdown-icon">{subItem.icon}</div>
                            <div className="strategic-dropdown-text">
                              <h4>{subItem.name}</h4>
                              <p>{subItem.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href!}
                    onClick={handleLinkClick}
                    className="strategic-menu-item"
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>

            {/* ✅ BUTTONS SECTION */}
            <div className="strategic-buttons-section">
              <Link href="/fundadores" className="strategic-cta-button">
                <Crown className="w-4 h-4" />
                Sé Fundador
              </Link>

              <button
                onClick={() => setIsMobileOpen(true)}
                className="strategic-mobile-button"
                aria-label="Abrir menú"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>

        {/* ✅ MOBILE MENU AUTOCONTENIDO */}
        <div
          className={`strategic-mobile-overlay ${isMobileOpen ? 'active' : ''}`}
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className={`strategic-mobile-menu ${isMobileOpen ? 'active' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header */}
            <div className="strategic-mobile-header">
              <div className="strategic-mobile-brand">
                <Image
                  src="/favicon-40x40.svg"
                  alt="CreaTuActivo"
                  width={28}
                  height={28}
                />
                <span className="strategic-mobile-brand-text">CreaTuActivo</span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="strategic-close-button"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Content */}
            <div className="strategic-mobile-content">
              {/* El Sistema */}
              <div className="strategic-mobile-section">
                <h3>El Sistema</h3>
                {menuItems[0].dropdown?.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleLinkClick}
                    className="strategic-mobile-link"
                  >
                    <div>{item.icon}</div>
                    <div className="strategic-mobile-link-content">
                      <div className="strategic-mobile-link-title">{item.name}</div>
                      <div className="strategic-mobile-link-desc">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Soluciones */}
              <div className="strategic-mobile-section">
                <h3>Soluciones</h3>
                {menuItems[1].dropdown?.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleLinkClick}
                    className="strategic-mobile-link"
                  >
                    <div>{item.icon}</div>
                    <div className="strategic-mobile-link-content">
                      <div className="strategic-mobile-link-title">{item.name}</div>
                      <div className="strategic-mobile-link-desc">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Presentación */}
              <div className="strategic-mobile-section">
                <Link
                  href="/presentacion-empresarial"
                  onClick={handleLinkClick}
                  className="strategic-mobile-link"
                >
                  <div className="strategic-mobile-link-content">
                    <div className="strategic-mobile-link-title">Presentación Empresarial</div>
                  </div>
                </Link>
              </div>

              {/* El Ecosistema */}
              <div className="strategic-mobile-section">
                <h3>El Ecosistema</h3>
                {menuItems[3].dropdown?.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleLinkClick}
                    className="strategic-mobile-link"
                  >
                    <div>{item.icon}</div>
                    <div className="strategic-mobile-link-content">
                      <div className="strategic-mobile-link-title">{item.name}</div>
                      <div className="strategic-mobile-link-desc">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* CTA Button */}
              <div className="strategic-mobile-cta">
                <Link
                  href="/fundadores"
                  onClick={handleLinkClick}
                  className="strategic-mobile-cta-button"
                >
                  <Crown className="w-5 h-5" />
                  Sé Fundador
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
