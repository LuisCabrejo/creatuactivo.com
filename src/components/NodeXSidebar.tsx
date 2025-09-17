'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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

// ✅ ANTI-FOUC: Estilos críticos inline para carga inmediata
const CRITICAL_STYLES = `
  /* PREVENIR FOUC - ESTILOS CRÍTICOS INLINE */
  .nodex-sidebar-critical {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    height: 100vh;
    width: 16rem; /* 256px */
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(24px);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    transform: translateX(-100%);
    transition: none; /* Sin transición durante hidratación */
  }

  @media (min-width: 1024px) {
    .nodex-sidebar-critical {
      transform: translateX(0);
    }
  }

  .nodex-content-critical {
    width: 100%;
    min-height: 100vh;
  }

  @media (min-width: 1024px) {
    .nodex-content-critical {
      padding-left: 16rem; /* 256px */
    }
  }

  /* MOBILE HEADER CRÍTICO */
  .nodex-mobile-header-critical {
    position: sticky;
    top: 0;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(12px);
    z-index: 30;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: block;
  }

  @media (min-width: 1024px) {
    .nodex-mobile-header-critical {
      display: none;
    }
  }
`

// ✅ ESTILOS AVANZADOS: Se cargan después sin FOUC
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --creatuactivo-blue: #1E40AF;
      --creatuactivo-purple: #7C3AED;
      --creatuactivo-gold: #F59E0B;
    }

    .creatuactivo-sidebar-item {
      transition: all 0.2s ease-in-out;
      border-radius: 10px;
      padding: 12px;
      margin: 2px 0;
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
      color: #94A3B8;
      text-decoration: none;
      border: 1px solid transparent;
    }

    .creatuactivo-sidebar-item:hover {
      background-color: rgba(124, 58, 237, 0.1);
      color: #FFFFFF;
      border-color: rgba(124, 58, 237, 0.2);
    }

    .creatuactivo-sidebar-item.active {
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 100%);
      color: #FFFFFF;
      font-weight: 600;
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.3);
    }

    .creatuactivo-sidebar-item.active .lucide {
        stroke-width: 2.5;
    }

    .creatuactivo-sidebar-item.logout:hover {
      background-color: rgba(239, 68, 68, 0.1);
      color: #F87171;
      border-color: rgba(239, 68, 68, 0.2);
    }

    .creatuactivo-sidebar-brand {
      font-weight: 800;
      font-size: 1.5rem;
      line-height: 1.2;
      color: white;
    }

    .creatuactivo-sidebar-overlay {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
    }

    /* HABILITACIÓN DE TRANSICIONES DESPUÉS DE HIDRATACIÓN */
    .nodex-sidebar-enhanced {
      transition: transform 0.3s ease-in-out !important;
    }

    .nodex-sidebar-enhanced.mobile-open {
      transform: translateX(0) !important;
    }
  `}</style>
)

export default function NodeXSidebar({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const pathname = usePathname()

  // ✅ ANTI-FOUC: Habilitar transiciones solo después de hidratación
  useEffect(() => {
    setIsHydrated(true)
  }, [])

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
    console.log('Logout functionality to be implemented')
  }

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/10">
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--creatuactivo-blue)] to-[var(--creatuactivo-purple)] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <h1 className="creatuactivo-sidebar-brand">NodeX</h1>
            <p className="text-slate-400 text-xs">Centro de Comando</p>
          </div>
        </div>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`creatuactivo-sidebar-item ${isActive(item.href) ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
                title={item.name}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 min-w-0 font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="creatuactivo-sidebar-item mb-2"
          onClick={() => setIsMobileOpen(false)}
        >
          <ChevronLeft className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Sitio Principal</span>
        </Link>
        <button
          onClick={handleLogout}
          className="creatuactivo-sidebar-item logout w-full text-left"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ✅ ESTILOS CRÍTICOS INLINE - PREVIENEN FOUC */}
      <style dangerouslySetInnerHTML={{ __html: CRITICAL_STYLES }} />
      <GlobalStyles />

      <div className="lg:flex min-h-screen bg-slate-900">
        {/* Mobile overlay */}
        {isMobileOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 creatuactivo-sidebar-overlay"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* ✅ SIDEBAR ANTI-FOUC: Estilos críticos + transiciones habilitadas post-hidratación */}
        <aside className={`
          nodex-sidebar-critical
          ${isHydrated ? 'nodex-sidebar-enhanced' : ''}
          ${isMobileOpen && isHydrated ? 'mobile-open' : ''}
        `}>
          <SidebarContent />
        </aside>

        {/* ✅ CONTENT AREA ANTI-FOUC */}
        <div className="nodex-content-critical">
          {/* ✅ MOBILE HEADER ANTI-FOUC */}
          <header className="nodex-mobile-header-critical">
            <div className="p-4 flex items-center justify-between">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Abrir menú NodeX"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--creatuactivo-blue)] to-[var(--creatuactivo-purple)] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-white font-bold">NodeX</span>
              </div>

              <div className="w-10"></div>
            </div>
          </header>

          {/* ✅ MAIN CONTENT - ZERO FOUC */}
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
