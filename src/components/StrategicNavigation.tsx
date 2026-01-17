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

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  X,
  Target,
  Menu
} from 'lucide-react'

// ✅ ZERO FOUC: CSS crítico inline que renderiza perfectamente desde el primer frame
// THE ARCHITECT'S SUITE - Quiet Luxury Colors
const CRITICAL_NAVIGATION_CSS = `
  /* ANTI-FOUC CRÍTICO - NAVEGACIÓN BASE INMEDIATA - THE ARCHITECT'S SUITE */
  .strategic-nav-critical {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(15, 17, 21, 0.95);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(197, 160, 89, 0.1);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
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

  /* THE ARCHITECT'S SUITE - CA Monogram Icon */
  .strategic-logo-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  @media (max-width: 767px) {
    .strategic-logo-icon {
      width: 32px;
      height: 32px;
    }
  }

  .strategic-logo-icon svg {
    width: 100%;
    height: 100%;
  }

  /* THE ARCHITECT'S SUITE - Mixed Typography Wordmark */
  .strategic-logo-text {
    display: flex;
    align-items: baseline;
    gap: 0;
    line-height: 1.2;
    transition: opacity 0.3s ease;
  }

  .strategic-logo-text .crea-tu {
    font-family: Montserrat, -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 1.25rem;
    font-weight: 500;
    color: #E5E5E5;
    letter-spacing: 0.02em;
  }

  .strategic-logo-text .tu {
    color: #C5A059;
  }

  .strategic-logo-text .activo {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: #E5E5E5;
    letter-spacing: 0.01em;
  }

  .strategic-logo-link:hover .strategic-logo-text {
    opacity: 0.9;
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
    color: #A3A3A3;
    font-weight: 500;
    letter-spacing: 0.05em;
    cursor: pointer;
    text-decoration: none;
    padding: 0.5rem 0;
    transition: color 0.3s ease;
  }

  .strategic-menu-item:hover {
    color: #E5E5E5;
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
    background: rgba(26, 29, 35, 0.98);
    backdrop-filter: blur(16px);
    border-radius: 0.75rem;
    border: 1px solid rgba(197, 160, 89, 0.1);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
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
    background-color: rgba(197, 160, 89, 0.08);
  }

  .strategic-dropdown-icon {
    flex-shrink: 0;
    margin-top: 0.25rem;
    margin-right: 1rem;
  }

  .strategic-dropdown-text h4 {
    color: #E5E5E5;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
    transition: color 0.2s ease;
  }

  .strategic-dropdown-item:hover h4 {
    color: #C5A059;
  }

  .strategic-dropdown-text p {
    color: #6b6b75;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.4;
  }

  /* BOTÓN FUNDADORES - QUIET LUXURY GOLD */
  .strategic-cta-button {
    display: none;
    align-items: center;
    gap: 0.5rem;
    background: #C5A059;
    color: #0F1115;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  @media (min-width: 768px) {
    .strategic-cta-button {
      display: flex;
    }
  }

  .strategic-cta-button:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  /* MOBILE BUTTON - IMMEDIATE RENDER */
  .strategic-mobile-toggle {
    display: block;
    background: none;
    border: none;
    color: #A3A3A3;
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
    color: #C5A059;
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

  /* MOBILE MENU - QUIET LUXURY */
  .strategic-mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    max-width: 28rem;
    background: rgba(15, 17, 21, 0.98);
    backdrop-filter: blur(24px);
    border-right: 1px solid rgba(197, 160, 89, 0.1);
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
    border-bottom: 1px solid rgba(197, 160, 89, 0.1);
  }

  .strategic-mobile-close {
    background: none;
    border: none;
    color: #6b6b75;
    cursor: pointer;
    padding: 0.5rem;
    transition: color 0.2s ease;
  }

  .strategic-mobile-close:hover {
    color: #C5A059;
  }

  .strategic-mobile-content {
    padding: 1.5rem;
  }

  .strategic-mobile-section {
    margin-bottom: 2rem;
  }

  .strategic-mobile-section-title {
    color: #C5A059;
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
    color: #A3A3A3;
    text-decoration: none;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    margin-bottom: 0.25rem;
    transition: all 0.2s ease;
  }

  .strategic-mobile-link:hover {
    background-color: rgba(197, 160, 89, 0.08);
    color: #E5E5E5;
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
    color: #6b6b75;
    font-size: 0.75rem;
    margin: 0;
    line-height: 1.3;
  }

  .strategic-mobile-cta {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(197, 160, 89, 0.1);
  }

  .strategic-mobile-cta-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    background: #C5A059;
    color: #0F1115;
    font-weight: 600;
    padding: 1rem;
    border-radius: 0.75rem;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .strategic-mobile-cta-button:hover {
    transform: translateY(-2px);
    opacity: 0.9;
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

  // Links directos sin dropdown (Arquitectura de Activos - Quiet Luxury)
  const directLinks = [
    { name: 'Manifiesto', href: '/nosotros' },
    { name: 'El Sistema', href: '/tecnologia' },
    { name: 'Infraestructura', href: '/productos' },
    { name: 'Insights', href: '/blog' },
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

            {/* ✅ LOGO SECTION - THE ARCHITECT'S SUITE */}
            <div className="strategic-logo-container">
              <Link href="/" className="strategic-logo-link">
                {/* CA Monogram - Architectural Style */}
                <div className="strategic-logo-icon">
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="#C5A059" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 8 C17 4, 9 5, 6 11 C3 17, 5 25, 12 28 C17 30, 22 28, 24 24"/>
                      <path d="M14 26 L20 8 L26 26"/>
                      <line x1="16" y1="20" x2="24" y2="20"/>
                    </g>
                  </svg>
                </div>
                {/* Mixed Typography Wordmark */}
                <span className="strategic-logo-text">
                  <span className="crea-tu">Crea<span className="tu">Tu</span></span>
                  <span className="activo">Activo</span>
                </span>
              </Link>
            </div>

            {/* ✅ MENU DESKTOP - Links Directos */}
            <div className="strategic-menu-desktop">
              {directLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="strategic-menu-item"
                  onClick={handleLinkClick}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* ✅ BOTONES DERECHA */}
            <div className="flex items-center gap-4">
              {/* BOTÓN RETO DESKTOP - Entrada al Funnel Principal */}
              <Link href="/reto-5-dias" className="strategic-cta-button">
                <Target className="w-4 h-4" />
                Reto 5 Días
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
            {/* CA Monogram - Architectural Style */}
            <div className="strategic-logo-icon">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#C5A059" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 8 C17 4, 9 5, 6 11 C3 17, 5 25, 12 28 C17 30, 22 28, 24 24"/>
                  <path d="M14 26 L20 8 L26 26"/>
                  <line x1="16" y1="20" x2="24" y2="20"/>
                </g>
              </svg>
            </div>
            {/* Mixed Typography Wordmark */}
            <span className="strategic-logo-text">
              <span className="crea-tu">Crea<span className="tu">Tu</span></span>
              <span className="activo">Activo</span>
            </span>
          </Link>
          <button
            onClick={closeMobileMenu}
            className="strategic-mobile-close"
            aria-label="Cerrar menú de navegación"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Content */}
        <div className="strategic-mobile-content">
          {/* Links Directos */}
          <div className="strategic-mobile-section">
            <h3 className="strategic-mobile-section-title">Descubre</h3>
            {directLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="strategic-mobile-link"
                onClick={handleLinkClick}
              >
                <div className="strategic-mobile-link-content">
                  <h4>{link.name}</h4>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile CTA - Reto 5 Días */}
          <div className="strategic-mobile-cta">
            <Link href="/reto-5-dias" className="strategic-mobile-cta-button" onClick={handleLinkClick}>
              <Target className="w-4 h-4" />
              Unirme al Reto
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
