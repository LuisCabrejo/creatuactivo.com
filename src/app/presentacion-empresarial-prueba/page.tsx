/**
 * Copyright © 2026 CreaTuActivo.com
 * Builder Dashboard v1.0 - THE ARCHITECT'S COCKPIT
 * Enfoque: Visualización de Activos + Gestión de Flujo (No gestión de gente)
 *
 * Design System: BIMETALLIC v3.0
 */

'use client'

import React, { useState } from 'react';
import Link from 'next/link'

// ============================================================================
// DESIGN SYSTEM CONSTANTS (Bimetallic v3.0)
// ============================================================================

const COLORS = {
  bg: { main: '#0F1115', elevated: '#15171C', card: '#1A1D23', darker: '#0a0b0d' },
  gold: { primary: '#C5A059', hover: '#D4AF37', bronze: '#B38B59', glow: 'rgba(197, 160, 89, 0.15)' },
  titanium: { primary: '#94A3B8', muted: '#64748B', dark: '#475569', light: '#CBD5E1' },
  text: { primary: '#FFFFFF', main: '#E5E5E5', muted: '#A3A3A3', subtle: '#6B7280' },
  status: { success: '#10B981', warning: '#F59E0B', error: '#EF4444' },
  border: { subtle: 'rgba(197, 160, 89, 0.15)', glass: 'rgba(255, 255, 255, 0.05)' },
};

// ============================================================================
// ICONS (Simulados para no depender de librerías externas)
// ============================================================================

const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Chart: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Academy: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Zap: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
  Bot: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
};

// ============================================================================
// COMPONENTS
// ============================================================================

// 1. Sidebar Navigation
function Sidebar({ activeMode, setMode }) {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r z-50"
      style={{ backgroundColor: COLORS.bg.main, borderColor: COLORS.border.glass }}>

      {/* Brand */}
      <div className="p-8">
        <h1 className="text-xl font-serif tracking-tight" style={{ color: COLORS.text.primary }}>
          CreaTu<span style={{ color: COLORS.gold.primary }}>Activo</span>
        </h1>
        <p className="text-xs uppercase tracking-[0.2em] mt-1" style={{ color: COLORS.titanium.muted }}>
          Architect OS
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <NavItem icon={<Icons.Home />} label="Cockpit" active />
        <NavItem icon={<Icons.Chart />} label="Mis Activos" />
        <NavItem icon={<Icons.Users />} label="Red de Distribución" />
        <NavItem icon={<Icons.Academy />} label="Academia" />
        <div className="pt-4 mt-4 border-t" style={{ borderColor: COLORS.border.glass }}>
           <NavItem icon={<Icons.Bot />} label="Configurar Queswa" />
           <NavItem icon={<Icons.Settings />} label="Ajustes" />
        </div>
      </nav>

      {/* Mode Selector (DMO) */}
      <div className="p-6 border-t" style={{ borderColor: COLORS.border.glass }}>
        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: COLORS.titanium.muted }}>Modo Operativo</p>
        <div className="flex bg-black/40 p-1 rounded-lg">
          {['Híbrido', 'Análogo', 'Digital'].map((mode) => (
            <button
              key={mode}
              onClick={() => setMode(mode)}
              className={`flex-1 text-[10px] py-2 rounded-md transition-all duration-300 font-medium ${activeMode === mode? 'shadow-lg' : 'opacity-50 hover:opacity-100'}`}
              style={{
                backgroundColor: activeMode === mode? COLORS.gold.primary : 'transparent',
                color: activeMode === mode? COLORS.bg.main : COLORS.text.main
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

function NavItem({ icon, label, active = false }) {
  return (
    <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active? 'bg-white/5' : 'hover:bg-white/5'}`}>
      <span style={{ color: active? COLORS.gold.primary : COLORS.titanium.muted }} className="group-hover:text-white transition-colors">
        {icon}
      </span>
      <span className="text-sm font-medium" style={{ color: active? COLORS.text.primary : COLORS.text.muted }}>
        {label}
      </span>
    </a>
  );
}

// 2. Main Progress Ring (Freedom Days)
function FreedomRing({ days, maxDays = 365 }) {
  const percentage = Math.min((days / maxDays) * 100, 100);
  const radius = 80;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center p-8 rounded-2xl border"
      style={{ backgroundColor: COLORS.bg.card, borderColor: COLORS.border.subtle }}>
      <div className="relative">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          <circle
            stroke={COLORS.bg.elevated}
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={COLORS.gold.primary}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-serif font-bold" style={{ color: COLORS.text.primary }}>{days}</span>
          <span className="text-[10px] uppercase tracking-wider" style={{ color: COLORS.titanium.primary }}>Días de Libertad</span>
        </div>
      </div>

      <div className="ml-8 hidden sm:block">
        <h3 className="text-lg font-medium mb-1" style={{ color: COLORS.text.primary }}>Estado: En Construcción</h3>
        <p className="text-sm max-w-[200px] mb-4" style={{ color: COLORS.text.muted }}>
          Estás cubierto por {days} días si dejas de trabajar hoy. Meta: {maxDays} días (Soberanía).
        </p>
        <button className="text-xs flex items-center gap-1 hover:underline" style={{ color: COLORS.gold.primary }}>
          Ver Proyección <Icons.ArrowRight />
        </button>
      </div>
    </div>
  );
}

// 3. Pipeline Metrics (Financials)
function FinancialCard({ label, value, subtext, type = 'neutral' }) {
    // Determine dynamic color for "value" based on business logic logic could go here
    const valueColor = type === 'highlight'? COLORS.gold.primary : COLORS.text.primary;

    return (
        <div className="p-6 rounded-2xl border transition-all hover:translate-y-[-2px]"
             style={{ backgroundColor: COLORS.bg.card, borderColor: COLORS.border.glass }}>
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: COLORS.titanium.muted }}>{label}</p>
            <h3 className="text-2xl font-serif font-bold mb-1" style={{ color: valueColor }}>{value}</h3>
            <p className="text-xs" style={{ color: COLORS.text.subtle }}>{subtext}</p>
        </div>
    )
}

// 4. Queswa Feed (AI Agent Activity)
function QueswaFeed() {
    const activities = [
      { time: 'hace 2m', action: 'Nuevo Prospecto Calificado', detail: 'Maria R. ha completado el 90% del VSL.', type: 'success' },
      { time: 'hace 15m', action: 'Interacción con Contenido', detail: 'Juan P. vio el video "El Problema Matemático".' },
      { time: 'hace 1h', action: 'Recordatorio Enviado', detail: 'Se envió recordatorio del Reto a 5 prospectos.' },
      { time: 'hace 3h', action: 'Cita Agendada', detail: 'Ana G. agendó una llamada para mañana.', type: 'success' },
    ];

    return (
        <div className="p-6 rounded-2xl border h-full"
             style={{ backgroundColor: COLORS.bg.card, borderColor: COLORS.border.glass }}>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.status.success }}></div>
                    <h3 className="font-serif text-lg" style={{ color: COLORS.text.primary }}>Queswa AI</h3>
                </div>
                <span className="text-xs px-2 py-1 rounded border" style={{ color: COLORS.titanium.muted, borderColor: COLORS.border.glass }}>En línea</span>
            </div>

            <div className="space-y-4">
                {activities.map((item, idx) => (
                    <div key={idx} className="flex gap-4 pb-4 border-b last:border-0" style={{ borderColor: COLORS.border.glass }}>
                        <span className="text-xs whitespace-nowrap pt-1" style={{ color: COLORS.text.subtle }}>{item.time}</span>
                        <div>
                            <p className="text-sm font-medium" style={{ color: item.type === 'success'? COLORS.gold.primary : COLORS.text.main }}>
                                {item.action}
                            </p>
                            <p className="text-xs" style={{ color: COLORS.text.muted }}>{item.detail}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-2 text-xs border border-dashed rounded opacity-50 hover:opacity-100 transition-opacity"
                style={{ borderColor: COLORS.titanium.muted, color: COLORS.titanium.muted }}>
                Ver registro completo
            </button>
        </div>
    )
}

// 5. Action Academy Block
function AcademyBlock() {
    return (
        <div className="relative p-6 rounded-2xl overflow-hidden group cursor-pointer border"
             style={{ backgroundColor: COLORS.bg.card, borderColor: COLORS.border.glass }}>

            {/* Background Image Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
            <div className="absolute inset-0 opacity-20 grayscale group-hover:opacity-30 transition-opacity duration-500 z-0"
                 style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }} />

            <div className="relative z-20 flex justify-between items-end">
                <div>
                    <span className="inline-block px-2 py-1 mb-3 text-[10px] uppercase tracking-widest rounded bg-white/10 backdrop-blur-md" style={{ color: COLORS.gold.primary }}>
                        Siguiente Módulo
                    </span>
                    <h3 className="text-xl font-serif mb-2" style={{ color: COLORS.text.primary }}>
                        Arquitectura de la Invitación
                    </h3>
                    <p className="text-xs max-w-xs" style={{ color: COLORS.text.muted }}>
                        Aprende a usar los guiones psicológicos para llenar tu agenda sin sentirte un vendedor.
                    </p>
                </div>
                <div className="h-10 w-10 rounded-full flex items-center justify-center border transition-all group-hover:scale-110"
                     style={{ backgroundColor: COLORS.gold.primary, borderColor: COLORS.gold.primary, color: COLORS.bg.main }}>
                    <Icons.Zap />
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full z-20">
                <div className="h-full w-1/3" style={{ backgroundColor: COLORS.gold.primary }} />
            </div>
        </div>
    )
}


// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function PresentacionEmpresarialPruebaPage() {
  const [mode, setMode] = useState('Híbrido');

  return (
    <div className="min-h-screen flex font-sans selection:bg-gold-primary selection:text-black" style={{ backgroundColor: COLORS.bg.main }}>
      <Sidebar activeMode={mode} setMode={setMode} />

      <main className="flex-1 md:ml-64 p-6 lg:p-10">
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
                <h2 className="text-3xl font-serif text-white mb-1">
                    Hola, Arquitecto
                </h2>
                <p className="text-sm" style={{ color: COLORS.titanium.muted }}>
                    Ciclo Semanal #892 • Cierra en <span className="font-mono text-white">3d 14h</span>
                </p>
            </div>

            <div className="flex gap-4">
                <button className="px-6 py-2 rounded-lg border text-sm font-medium transition-colors hover:bg-white/5"
                    style={{ borderColor: COLORS.border.glass, color: COLORS.text.main }}>
                    + Añadir Contacto
                </button>
                <button className="px-6 py-2 rounded-lg text-sm font-medium font-semibold shadow-lg hover:brightness-110 transition-all"
                    style={{ backgroundColor: COLORS.gold.primary, color: COLORS.bg.main }}>
                    Link de Invitación
                </button>
            </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column: Metrics & Ring */}
            <div className="lg:col-span-2 space-y-6">

                {/* One Number Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FreedomRing days={124} />

                    <div className="grid grid-rows-2 gap-4">
                        <FinancialCard
                            label="Ingreso Semanal Estimado"
                            value="$340 USD"
                            subtext="Basado en volumen actual del lado menor"
                            type="highlight"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FinancialCard label="Red Activa" value="42" subtext="Socios" />
                            <FinancialCard label="Volumen" value="1,200" subtext="CV Izquierdo" />
                        </div>
                    </div>
                </div>

                {/* Academy Banner */}
                <AcademyBlock />

                {/* Simulated Pipeline/Network Visualization (Placeholder for D3/Chart) */}
                <div className="p-6 rounded-2xl border min-h-[250px] relative overflow-hidden"
                     style={{ backgroundColor: COLORS.bg.elevated, borderColor: COLORS.border.glass }}>
                    <div className="flex justify-between mb-4">
                        <h3 className="font-serif text-lg text-white">Topología de Red</h3>
                        <div className="flex gap-2">
                             <span className="w-3 h-3 rounded-full bg-gold-primary opacity-20"></span>
                             <span className="w-3 h-3 rounded-full bg-gold-primary opacity-60"></span>
                             <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS.gold.primary}}></span>
                        </div>
                    </div>
                    {/* Abstract visualization bars using simple HTML/CSS for demo */}
                    <div className="flex items-end justify-between gap-2 h-[150px] px-4">
                        {[20, 45, 60, 80, 95, 100, 85, 70, 50, 30].map((h, i) => (
                            <div key={i} className="w-full rounded-t-sm opacity-60 hover:opacity-100 transition-opacity cursor-pointer relative group"
                                 style={{ height: `${h}%`, backgroundColor: i === 5? COLORS.gold.primary : COLORS.titanium.dark }}>
                                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] bg-black px-2 py-1 rounded border border-white/10 whitespace-nowrap transition-opacity pointer-events-none text-white">
                                    Volumen: {h * 10}
                                 </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                         <p className="text-xs" style={{ color: COLORS.titanium.muted }}>
                            Tu pierna de cobro (Izquierda) está al 85% del objetivo semanal.
                         </p>
                    </div>
                </div>

            </div>

            {/* Right Column: AI Feed & Tools */}
            <div className="lg:col-span-1 space-y-6">
                <QueswaFeed />

                {/* Tools/Quick Actions */}
                <div className="p-6 rounded-2xl border"
                     style={{ backgroundColor: COLORS.bg.card, borderColor: COLORS.border.glass }}>
                    <h3 className="font-serif text-lg mb-4 text-white">Herramientas</h3>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center text-sm p-3 rounded bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                            <span style={{ color: COLORS.text.main }}>Script de Invitación</span>
                            <span style={{ color: COLORS.gold.bronze }}>PDF</span>
                        </li>
                        <li className="flex justify-between items-center text-sm p-3 rounded bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                            <span style={{ color: COLORS.text.main }}>Calculadora de ROI</span>
                            <span style={{ color: COLORS.gold.bronze }}>XLS</span>
                        </li>
                        <li className="flex justify-between items-center text-sm p-3 rounded bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                            <span style={{ color: COLORS.text.main }}>Flyers para Instagram</span>
                            <span style={{ color: COLORS.gold.bronze }}>Pack</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
