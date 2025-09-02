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

// --- Estilos CSS Globales (Desde Guía de Branding v4.2) ---
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
      color: #94A3B8; /* slate-400 */
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
      color: #F87171; /* red-400 */
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
  `}</style>
)

export default function NodeXLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { name: 'Dashboard', href: '/nodex', icon: LayoutDashboard },
    { name: 'Centro de Inteligencia', href: '/nodex/inteligencia', icon: BrainCircuit },
    { name: 'Mi Activo', href: '/nodex/mi-activo', icon: GitBranch },
    { name: 'Academia', href: '/nodex/academia', icon: GraduationCap },
    { name: 'Mi Perfil', href: '/nodex/perfil', icon: User }
  ]

  const isActive = (href) => {
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
      <GlobalStyles />
      <div className="lg:flex">
        {isMobileOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 creatuactivo-sidebar-overlay"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        <aside className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-slate-900/90 backdrop-blur-xl border-r border-white/10
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <SidebarContent />
        </aside>

        <div className="lg:pl-64 w-full">
            <header className="lg:hidden sticky top-0 bg-slate-900/80 backdrop-blur-md z-30">
                <div className="p-4 flex items-center justify-between">
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="text-white p-2"
                        aria-label="Abrir menú"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    {/* Puedes agregar un logo o título aquí si lo deseas */}
                </div>
            </header>
            <main>
                {children}
            </main>
        </div>
      </div>
    </>
  )
}
