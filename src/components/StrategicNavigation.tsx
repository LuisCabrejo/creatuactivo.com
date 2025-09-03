'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
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
  Heart,
  Presentation
} from 'lucide-react'

export default function StrategicNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMenuOpen])

  const handleLinkClick = () => {
    setIsMenuOpen(false)
    setOpenDropdown(null)
  }

  // MEJORADO: Toggle con mejor handling para móvil
  const handleMobileMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMenuOpen(prev => !prev)
    setOpenDropdown(null) // Cerrar dropdowns desktop si están abiertos
  }

  // HOVER MEJORADO CON DELAY (Solo desktop)
  const handleMouseEnter = (itemName: string) => {
    if (window.innerWidth >= 768) { // Solo en desktop
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
      setOpenDropdown(itemName)
    }
  }

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) { // Solo en desktop
      const timeout = setTimeout(() => {
        setOpenDropdown(null)
      }, 150)
      setHoverTimeout(timeout)
    }
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

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  // MEJORADO: Cerrar menú móvil si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isMenuOpen && !target.closest('.navigation-container')) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <header className="navigation-container sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LOGO */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              onClick={handleLinkClick}
              className="text-2xl font-bold bg-gradient-to-r from-[#1E40AF] to-[#7C3AED] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              CreaTuActivo.com
            </Link>
          </div>

          {/* MENU DESKTOP CON HOVER MEJORADO */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              item.dropdown ? (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center group">
                    {item.name}
                    <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform" />
                  </button>

                  {/* DROPDOWN CON ZONA DE HOVER EXTENDIDA */}
                  {openDropdown === item.name && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                      {/* ZONA INVISIBLE PARA CONECTAR HOVER */}
                      <div className="absolute top-0 left-0 w-full h-2 bg-transparent" />

                      <div
                        className="w-80 bg-slate-800/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl opacity-100 transition-all duration-200"
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                      >
                        <div className="p-2">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={handleLinkClick}
                              className="w-full flex items-start p-4 rounded-lg hover:bg-slate-700/50 transition-colors duration-200 text-left group/item"
                            >
                              <div className="flex-shrink-0 mt-1">{subItem.icon}</div>
                              <div className="ml-4">
                                <h4 className="text-white font-semibold group-hover/item:text-blue-400 transition-colors">
                                  {subItem.name}
                                </h4>
                                <p className="text-slate-400 text-sm mt-1">{subItem.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="text-slate-300 hover:text-white transition-colors duration-300"
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* BOTONES DERECHA */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Link href="/fundadores" className="creatuactivo-cta-ecosystem flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Sé Fundador
              </Link>
            </div>
            <div className="md:hidden">
              <button
                onClick={handleMobileMenuToggle}
                onTouchStart={(e) => e.stopPropagation()} // Prevenir problemas de touch
                className="text-slate-300 hover:text-white p-2 -m-2 touch-manipulation"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X size={24} className="transition-transform duration-200" />
                ) : (
                  <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MENÚ MÓVIL MEJORADO - Fixed positioning y altura correcta */}
      {isMenuOpen && (
        <>
          {/* OVERLAY PARA CERRAR MENÚ */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
            onTouchStart={(e) => e.stopPropagation()}
          />

          {/* MENÚ MÓVIL CONTAINER */}
          <div className="fixed top-20 left-0 right-0 bottom-0 z-50 md:hidden">
            <div className="bg-slate-900/98 backdrop-blur-xl border-t border-white/10 h-full">
              <div className="px-4 py-6 h-full flex flex-col overflow-y-auto">
                {menuItems.map((item) => (
                  <div key={item.name} className="py-2">
                    {item.dropdown ? (
                      <>
                        <h3 className="text-slate-400 px-3 py-2 text-sm font-semibold uppercase tracking-wider">
                          {item.name}
                        </h3>
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={handleLinkClick}
                            className="w-full flex items-center px-4 py-4 text-slate-300 hover:bg-slate-800/50 hover:text-white rounded-lg transition-colors active:bg-slate-700/50 touch-manipulation"
                          >
                            <span className="mr-3 flex-shrink-0">{subItem.icon}</span>
                            <div>
                              <div className="font-medium">{subItem.name}</div>
                              <div className="text-xs text-slate-500 mt-1">{subItem.description}</div>
                            </div>
                          </Link>
                        ))}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className="w-full flex items-center px-4 py-4 text-slate-300 hover:bg-slate-800/50 hover:text-white rounded-lg transition-colors font-medium active:bg-slate-700/50 touch-manipulation"
                      >
                        <Presentation className="w-5 h-5 mr-3 text-purple-400" />
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

                {/* BOTÓN SÉ FUNDADOR EN MÓVIL */}
                <div className="mt-auto pt-6 border-t border-white/10">
                  <Link
                    href="/fundadores"
                    onClick={handleLinkClick}
                    className="w-full creatuactivo-cta-ecosystem text-center flex items-center justify-center gap-2 py-4 text-lg touch-manipulation"
                  >
                    <Crown className="w-5 h-5" />
                    Sé Fundador
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
