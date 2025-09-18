'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BrainCircuit,
  GitBranch,
  GraduationCap,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react'

// ✅ ZERO FOUC: CSS crítico que renderiza inmediatamente sin flashes
const CRITICAL_INLINE_CSS = `
  /* ANTI-FOUC CRÍTICO - LAYOUT BASE INMEDIATO */
  .nodex-layout-critical {
    display: flex;
    min-height: 100vh;
    background-color: #0f172a; /* slate-900 */
    font-family: system-ui, -apple-system, sans-serif;
  }

  /* SIDEBAR DESKTOP - RENDERIZADO INMEDIATO */
  .nodex-sidebar-critical {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    height: 100vh;
    width: 16rem;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
    backdrop-filter: blur(24px);
    border-right: 1px solid rgba(124, 58, 237, 0.2);
    display: flex;
    flex-direction: column;
    transform: translateX(-100%);
    opacity: 1;
  }

  /* DESKTOP: SIDEBAR VISIBLE */
  @media (min-width: 1024px) {
    .nodex-sidebar-critical {
      transform: translateX(0);
      position: relative;
    }
  }

  /* CONTENT AREA - SIN FLASH */
  .nodex-content-critical {
    flex: 1;
    width: 100%;
    min-height: 100vh;
  }

  @media (min-width: 1024px) {
    .nodex-content-critical {
      margin-left: 0;
    }
  }

  /* MOBILE HEADER - RENDERIZADO INMEDIATO */
  .nodex-mobile-header-critical {
    position: sticky;
    top: 0;
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(124, 58, 237, 0.1);
    z-index: 30;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  @media (min-width: 1024px) {
    .nodex-mobile-header-critical {
      display: none;
    }
  }

  /* SIDEBAR CONTENT - BASE STYLES */
  .nodex-sidebar-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0;
  }

  .nodex-header-section {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
  }

  .nodex-nav-section {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
  }

  .nodex-footer-section {
    padding: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* NAVIGATION ITEMS - IMMEDIATE STYLING */
  .nodex-nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    margin: 0.125rem 0;
    border-radius: 0.625rem;
    color: #94a3b8; /* slate-400 */
    text-decoration: none;
    font-weight: 500;
    border: 1px solid transparent;
    transition: none; /* Sin transición inicial */
  }

  .nodex-nav-item:hover {
    background-color: rgba(124, 58, 237, 0.1);
    color: #ffffff;
    border-color: rgba(124, 58, 237, 0.2);
  }

  .nodex-nav-item.active {
    background: linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%);
    color: #ffffff;
    font-weight: 600;
    box-shadow: 0 8px 25px rgba(30, 64, 175, 0.3);
  }

  .nodex-nav-item.logout:hover {
    background-color: rgba(239, 68, 68, 0.1);
    color: #f87171;
    border-color: rgba(239, 68, 68, 0.2);
  }

  /* MOBILE OVERLAY */
  .nodex-mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  .nodex-mobile-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  /* MOBILE SIDEBAR STATES */
  .nodex-sidebar-critical.mobile-open {
    transform: translateX(0);
  }

  /* HABILITACIÓN DE TRANSICIONES POST-HIDRATACIÓN */
  .nodex-transitions-enabled .nodex-sidebar-critical {
    transition: transform 0.3s ease-in-out;
  }

  .nodex-transitions-enabled .nodex-nav-item {
    transition: all 0.2s ease-in-out;
  }

  /* BRAND LOGO CONTAINER */
  .nodex-brand-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .nodex-brand-text {
    font-weight: 800;
    font-size: 1.5rem;
    line-height: 1.2;
    color: white;
  }

  .nodex-brand-subtitle {
    color: #94a3b8;
    font-size: 0.75rem;
  }

  /* LOGO ANTI-FLASH */
  .nodex-logo-container {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .nodex-logo-container:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
  }

  .nodex-logo-container.mobile {
    width: 32px;
    height: 32px;
    border-radius: 0.5rem;
  }

  .nodex-logo-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }

  /* FALLBACK SOLO SI IMAGEN FALLA - REMOVIDA LÓGICA TEMPORAL */
  .nodex-logo-fallback {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 1.25rem;
    opacity: 0;
    pointer-events: none;
  }

  .nodex-logo-fallback.mobile {
    font-size: 1rem;
  }

  /* MOSTRAR FALLBACK SOLO SI IMAGEN NO CARGA */
  .nodex-logo-container img[src="/logo-icon-80x80-sm.svg"] ~ .nodex-logo-fallback {
    opacity: 0;
  }

  /* MOBILE BRAND */
  .nodex-mobile-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nodex-mobile-brand-text {
    color: white;
    font-weight: 700;
  }
`

export default function NodeXSidebar({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isTransitionsEnabled, setIsTransitionsEnabled] = useState(false)
  const pathname = usePathname()

  // ✅ ANTI-FOUC: Habilitar transiciones solo después de hidratación completa
  useEffect(() => {
    // Pequeño delay para asegurar que el renderizado inicial sea completamente estático
    const timer = setTimeout(() => {
      setIsTransitionsEnabled(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // ✅ PREVENIR SCROLL BODY CUANDO MOBILE MENU ABIERTO
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

  const menuItems = [
    { name: 'Dashboard', href: '/nodex', icon: LayoutDashboard },
    { name: 'Centro de Inteligencia', href: '/nodex/inteligencia', icon: BrainCircuit },
    { name: 'Mi Activo', href: '/nodex/mi-activo', icon: GitBranch },
    { name: 'Academia', href: '/nodex/academia', icon: GraduationCap },
    { name: 'Mi Perfil', href: '/nodex/perfil', icon: User }
  ]

  const isActive = (href: string) => {
    if (href === '/nodex') return pathname === '/nodex'
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    // ✅ LOGOUT REAL - Implementar lógica de cierre de sesión
    console.log('Implementar logout real aquí')
    // Aquí iría: limpiar tokens, redirect a login, etc.
  }

  const closeMobileMenu = () => {
    setIsMobileOpen(false)
  }

  const SidebarContent = () => (
    <div className="nodex-sidebar-content">
      {/* HEADER CON LOGO Y CLOSE BUTTON */}
      <div className="nodex-header-section">
        <button
          onClick={closeMobileMenu}
          className="lg:hidden absolute top-4 right-4 text-slate-400 hover:text-white"
          style={{ transition: isTransitionsEnabled ? 'color 0.2s ease' : 'none' }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="nodex-brand-container">
          <Link href="/nodex" className="nodex-logo-container">
            <Image
              src="/logo-icon-80x80-sm.svg"
              alt="CreaTuActivo Logo"
              width={40}
              height={40}
              priority
            />
          </Link>
          <div>
            <Link href="/nodex">
              <h1 className="nodex-brand-text cursor-pointer hover:opacity-80 transition-opacity">NodeX</h1>
            </Link>
            <p className="nodex-brand-subtitle">Centro de Comando</p>
          </div>
        </div>
      </div>

      {/* NAVIGATION ITEMS */}
      <nav className="nodex-nav-section">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nodex-nav-item ${isActive(item.href) ? 'active' : ''}`}
                onClick={closeMobileMenu}
                title={item.name}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 min-w-0 font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="nodex-footer-section">
        <Link
          href="/"
          className="nodex-nav-item mb-2"
          onClick={closeMobileMenu}
        >
          <ChevronLeft className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Sitio Principal</span>
        </Link>
        <button
          onClick={handleLogout}
          className="nodex-nav-item logout w-full text-left"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ✅ CSS CRÍTICO INLINE - PREVIENE TODO FOUC */}
      <style dangerouslySetInnerHTML={{ __html: CRITICAL_INLINE_CSS }} />

      {/* ✅ LAYOUT CONTAINER */}
      <div className={`nodex-layout-critical ${isTransitionsEnabled ? 'nodex-transitions-enabled' : ''}`}>

        {/* MOBILE OVERLAY */}
        <div
          className={`nodex-mobile-overlay ${isMobileOpen ? 'active' : ''}`}
          onClick={closeMobileMenu}
        />

        {/* SIDEBAR */}
        <aside className={`nodex-sidebar-critical ${isMobileOpen ? 'mobile-open' : ''}`}>
          <SidebarContent />
        </aside>

        {/* CONTENT AREA */}
        <div className="nodex-content-critical">
          {/* MOBILE HEADER */}
          <header className="nodex-mobile-header-critical">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="text-white p-2 hover:bg-white/10 rounded-lg"
              style={{ transition: isTransitionsEnabled ? 'background-color 0.2s ease' : 'none' }}
              aria-label="Abrir menú NodeX"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/nodex" className="nodex-mobile-brand">
              <div className="nodex-logo-container mobile">
                <Image
                  src="/logo-icon-80x80-sm.svg"
                  alt="CreaTuActivo"
                  width={32}
                  height={32}
                />
              </div>
              <span className="nodex-mobile-brand-text">NodeX</span>
            </Link>

            <div className="w-10"></div> {/* Spacer for centering */}
          </header>

          {/* MAIN CONTENT */}
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
