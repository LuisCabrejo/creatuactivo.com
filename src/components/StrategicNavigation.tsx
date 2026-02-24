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
import Image from 'next/image'
import {
  X,
  Target,
  Menu
} from 'lucide-react'

// ✅ ZERO FOUC: CSS crítico inline que renderiza perfectamente desde el primer frame
// ELEGANCIA CINÉTICA - Obsidian + Amber Industrial
const CRITICAL_NAVIGATION_CSS = `
  /* ANTI-FOUC CRÍTICO - NAVEGACIÓN BASE INMEDIATA - ELEGANCIA CINÉTICA */
  .strategic-nav-critical {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(11, 12, 12, 0.98);
    border-bottom: 1px solid rgba(229, 194, 121, 0.12);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }

  @media (min-width: 768px) {
    .strategic-nav-critical {
      background: rgba(11, 12, 12, 0.95);
      backdrop-filter: blur(24px);
    }
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
    height: 4rem;
  }

  @media (min-width: 768px) {
    .strategic-nav-content {
      height: 5rem;
    }
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

  /* THE ARCHITECT'S SUITE - Logo Icon (PNG) */
  .strategic-logo-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
  }

  @media (min-width: 768px) {
    .strategic-logo-icon {
      width: 56px;
      height: 56px;
    }
  }

  /* THE ARCHITECT'S SUITE - Brand Text (Oswald Bold) */
  .strategic-logo-text {
    font-family: var(--font-oswald), -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 1.375rem;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: 0.02em;
    line-height: 1;
    transition: opacity 0.3s ease;
  }

  @media (max-width: 767px) {
    .strategic-logo-text {
      font-size: 1.125rem;
    }
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
    background: rgba(22, 24, 29, 0.98);
    backdrop-filter: blur(16px);
    border-radius: 0.75rem;
    border: 1px solid rgba(229, 194, 121, 0.12);
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
    background-color: rgba(245, 158, 11, 0.07);
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
    color: #E5C279;
  }

  .strategic-dropdown-text p {
    color: #6b6b75;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.4;
  }

  /* BOTÓN CTA - GEOMETRÍA INDUSTRIAL */
  .strategic-cta-button {
    display: none;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
    color: #0B0C0C;
    font-family: var(--font-rajdhani), sans-serif;
    font-weight: 700;
    font-size: 0.875rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.625rem 1.25rem;
    clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
    border: 1px solid rgba(251, 191, 36, 0.4);
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
  }

  @media (min-width: 768px) {
    .strategic-cta-button {
      display: flex;
    }
  }

  .strategic-cta-button:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.35);
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
    color: #F59E0B;
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

  /* MOBILE MENU - ELEGANCIA CINÉTICA */
  .strategic-mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    max-width: 28rem;
    background: rgba(11, 12, 12, 0.98);
    backdrop-filter: blur(24px);
    border-right: 1px solid rgba(229, 194, 121, 0.12);
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
    border-bottom: 1px solid rgba(229, 194, 121, 0.12);
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
    color: #F59E0B;
  }

  .strategic-mobile-content {
    padding: 1.5rem;
  }

  .strategic-mobile-section {
    margin-bottom: 2rem;
  }

  .strategic-mobile-section-title {
    color: #F59E0B;
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
    background-color: rgba(245, 158, 11, 0.07);
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
    border-top: 1px solid rgba(229, 194, 121, 0.12);
  }

  .strategic-mobile-cta-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
    color: #0B0C0C;
    font-family: var(--font-rajdhani), sans-serif;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 1rem;
    clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
    border: 1px solid rgba(251, 191, 36, 0.4);
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 2px 12px rgba(245, 158, 11, 0.25);
  }

  .strategic-mobile-cta-button:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
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
    { name: 'Herramientas', href: '/servilleta' },
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
                {/* Logo Icon PNG - Optimized for dark backgrounds */}
                <div className="strategic-logo-icon">
                  <Image
                    src="/header.png"
                    alt="CreaTuActivo Logo"
                    width={40}
                    height={40}
                    priority
                    className="object-contain md:w-14 md:h-14"
                  />
                </div>
                {/* Brand Text - Oswald Bold */}
                <span className="strategic-logo-text">
                  CreaTuActivo
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
              {/* BOTÓN CTA DESKTOP - Entrada al Funnel Principal */}
              <Link href="/mapa-de-salida" className="strategic-cta-button">
                <Target className="w-4 h-4" />
                Obtener el Mapa
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
            {/* Logo Icon PNG - Optimized for dark backgrounds */}
            <div className="strategic-logo-icon">
              <Image
                src="/header.png"
                alt="CreaTuActivo Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            {/* Brand Text - Oswald Bold */}
            <span className="strategic-logo-text">
              CreaTuActivo
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

          {/* Mobile CTA - El Mapa de Salida */}
          <div className="strategic-mobile-cta">
            <Link href="/mapa-de-salida" className="strategic-mobile-cta-button" onClick={handleLinkClick}>
              <Target className="w-4 h-4" />
              Obtener el Mapa
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
