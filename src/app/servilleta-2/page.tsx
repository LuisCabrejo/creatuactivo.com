/**
 * SERVILLETA DIGITAL v2.0 - INDUSTRIAL REALISM EDITION
 * Copyright © 2026 CreaTuActivo.com
 *
 * Implementación completa basada en las investigaciones:
 * - Reducir Fricción Cognitiva en Presentación Servilleta.md
 * - Desarrollo Web Diseño Industrial Técnico.md
 *
 * ENFOQUE: Realismo Industrial / Dashboard SCADA
 * - Imágenes reales de Unsplash (turbinas, engranajes, cables, hormigón)
 * - Paleta Industrial exacta (#2C3E50, #009FDF, #E57200)
 * - Scroll Storytelling (La Promesa → La Evidencia → El Mecanismo)
 * - Tipografía técnica (Rajdhani + Roboto Mono)
 */

'use client';

import React from 'react';
import Link from 'next/link';

// --- PALETA INDUSTRIAL (De la Investigación) ---
const COLORS = {
  // Fondos
  darkRubber: '#121212',      // Fondo global
  bgPanel: '#1e1e1e',         // Paneles
  concrete: '#2a2a2a',        // Hormigón
  gunmetal: '#2C3E50',        // Acero pavonado (paneles secundarios)
  steel: '#37474f',           // Acero azulado

  // Acentos de Seguridad Industrial
  steelCyan: '#009FDF',       // Confianza/Estructura (azul acero)
  safetyOrange: '#E57200',    // Acción/Apalancamiento (naranja seguridad)
  safetyYellow: '#FFD600',    // Alertas medias
  alertRed: '#FF1744',        // Errores críticos

  // Texto
  textMain: '#e0e0e0',
  textMuted: '#95A5A6',       // Concrete Grey
  steelGrey: '#78909C',       // Azul acero grisáceo
};

// --- IMÁGENES DE UNSPLASH (IDs de la Investigación) ---
const IMAGES = {
  // Turbina de motor jet - Hero principal
  turbine: 'https://images.unsplash.com/photo-1568209865332-a15790aed756?q=80&w=2000&auto=format&fit=crop',
  // Engranajes industriales - Arquitectura de apalancamiento
  gears: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1600&auto=format&fit=crop',
  // Cables de puente de acero - Conexión
  bridgeCables: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1600&auto=format&fit=crop',
  // Textura de hormigón - Fondo
  concrete: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop',
  // Sala de turbinas / Represa - Sistema
  powerPlant: 'https://images.unsplash.com/photo-1509390144018-eeaf65052242?q=80&w=1600&auto=format&fit=crop',
  // Estructura de acero / Puente - Soporte
  steelStructure: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=1600&auto=format&fit=crop',
};

export default function Servilleta2Page() {

  return (
    <div
      className="industrial-theme min-h-screen text-[#e0e0e0] relative"
      style={{
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: COLORS.darkRubber
      }}
    >

      {/* ============================================================
          NOISE OVERLAY - Textura de hormigón digital (feTurbulence)
      ============================================================ */}
      <div
        className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* ============================================================
          TEXTURA DE HORMIGÓN DE FONDO (Imagen real Unsplash)
      ============================================================ */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("${IMAGES.concrete}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.03,
          mixBlendMode: 'multiply',
        }}
      />

      {/* ============================================================
          HEADER BAR - Estilo Panel de Control Industrial
      ============================================================ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{
          backgroundColor: 'rgba(18, 18, 18, 0.95)',
          backdropFilter: 'blur(8px)',
          borderColor: '#333'
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: '#10b981' }}
          />
          <span
            className="text-xs uppercase tracking-[0.3em] font-semibold"
            style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelCyan }}
          >
            SISTEMA OPERATIVO v2.0
          </span>
        </div>

        <div
          className="text-xs uppercase tracking-wider"
          style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelGrey }}
        >
          PANEL DE CONTROL / <span style={{ color: COLORS.steelCyan }}>APALANCAMIENTO</span>
        </div>
      </header>

      {/* ============================================================
          MAIN CONTENT - Scroll Storytelling
      ============================================================ */}
      <main className="relative z-10 pt-20">

        {/* ============================================================
            SECCIÓN 1: LA PROMESA (Hero - Turbina)
            "Multiplicación de Fuerza"
        ============================================================ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

          {/* Imagen de Turbina de Motor Jet */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url("${IMAGES.turbine}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'grayscale(100%) contrast(120%) brightness(35%)',
            }}
          />

          {/* Overlay gradiente */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(180deg, rgba(18,18,18,0.7) 0%, rgba(18,18,18,0.9) 100%)'
            }}
          />

          {/* Contenido del Hero */}
          <div className="relative z-20 text-center px-6 max-w-4xl">

            <p
              className="text-xs uppercase tracking-[0.4em] mb-6"
              style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelCyan }}
            >
              INFRAESTRUCTURA DE APALANCAMIENTO
            </p>

            <h1
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              MULTIPLICADOR<br/>
              <span style={{ color: COLORS.steelCyan }}>DE FUERZA</span>
            </h1>

            {/* Métrica Principal */}
            <div
              className="inline-block px-12 py-8 rounded-lg mb-8"
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${COLORS.steelCyan}`,
              }}
            >
              <span
                className="block text-xs uppercase tracking-wider mb-2"
                style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelGrey }}
              >
                FACTOR DE APALANCAMIENTO
              </span>
              <span
                className="text-7xl md:text-8xl font-bold"
                style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelCyan }}
              >
                100:1
              </span>
            </div>

            <p className="text-lg max-w-2xl mx-auto" style={{ color: COLORS.textMuted }}>
              Infraestructura sistémica activada. El esfuerzo individual se amplifica
              mediante arquitectura de activos de alta densidad.
            </p>

          </div>

          {/* Indicador de scroll */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
            <div
              className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
              style={{ borderColor: COLORS.steelGrey }}
            >
              <div
                className="w-1 h-2 rounded-full"
                style={{ backgroundColor: COLORS.steelCyan }}
              />
            </div>
          </div>

        </section>

        {/* ============================================================
            SECCIÓN 2: EL DIAGNÓSTICO (Villano vs Héroe)
            "El Plan por Defecto vs El Sistema"
        ============================================================ */}
        <section
          className="relative py-24 px-6"
          style={{ backgroundColor: COLORS.bgPanel }}
        >
          <div className="max-w-6xl mx-auto">

            {/* Header de sección */}
            <div className="text-center mb-16">
              <span
                className="inline-block px-4 py-2 rounded text-xs uppercase tracking-wider font-bold mb-6"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  backgroundColor: `${COLORS.safetyOrange}20`,
                  color: COLORS.safetyOrange,
                  border: `1px solid ${COLORS.safetyOrange}40`
                }}
              >
                DIAGNÓSTICO DE SISTEMA
              </span>

              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                EL PLAN POR DEFECTO
              </h2>

              <p className="text-xl" style={{ color: COLORS.textMuted }}>
                "Lo que es vs. <span style={{ color: COLORS.steelCyan }}>Lo que podrías ser</span>"
              </p>
            </div>

            {/* Grid de Comparación con Imágenes */}
            <div className="space-y-8">

              {/* Fila 1: TIEMPO */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_1fr] gap-6 items-stretch">

                {/* Villano */}
                <div
                  className="relative p-6 rounded-lg overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${COLORS.gunmetal}, ${COLORS.bgPanel})`,
                    borderLeft: `4px solid ${COLORS.safetyOrange}`,
                  }}
                >
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-3"
                    style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.safetyOrange }}
                  >
                    CONSUME TU VIDA
                  </h3>
                  <p style={{ color: COLORS.textMuted }}>
                    "Roba tu tiempo vital. Mientras tu ingreso requiera tu presencia,
                    la libertad es imposible."
                  </p>
                </div>

                {/* Eje Central - Imagen de Reloj/Engranaje */}
                <div
                  className="hidden md:flex items-center justify-center rounded-lg overflow-hidden"
                  style={{
                    background: `url("${IMAGES.gears}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%) contrast(120%)',
                  }}
                >
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelGrey }}
                    >
                      ⏱
                    </span>
                  </div>
                </div>

                {/* Héroe */}
                <div
                  className="relative p-6 rounded-lg overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${COLORS.gunmetal}, ${COLORS.bgPanel})`,
                    borderLeft: `4px solid ${COLORS.steelCyan}`,
                  }}
                >
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-3"
                    style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelCyan }}
                  >
                    GANA TIEMPO
                  </h3>
                  <p style={{ color: COLORS.textMain }}>
                    "Flujo Perpetuo. El sistema sigue generando valor mientras
                    duermes o viajas."
                  </p>
                </div>
              </div>

              {/* Fila 2: ESFUERZO */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_1fr] gap-6 items-stretch">

                {/* Villano */}
                <div
                  className="relative p-6 rounded-lg overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${COLORS.gunmetal}, ${COLORS.bgPanel})`,
                    borderLeft: `4px solid ${COLORS.safetyOrange}`,
                  }}
                >
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-3"
                    style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.safetyOrange }}
                  >
                    SE ALIMENTA DE ESFUERZO
                  </h3>
                  <p style={{ color: COLORS.textMuted }}>
                    "Si tu ingreso depende solo de tus manos, tienes un límite
                    físico innegable."
                  </p>
                </div>

                {/* Eje Central */}
                <div
                  className="hidden md:flex items-center justify-center rounded-lg overflow-hidden"
                  style={{
                    background: `url("${IMAGES.powerPlant}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%) contrast(120%)',
                  }}
                >
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelGrey }}
                    >
                      ⚡
                    </span>
                  </div>
                </div>

                {/* Héroe */}
                <div
                  className="relative p-6 rounded-lg overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${COLORS.gunmetal}, ${COLORS.bgPanel})`,
                    borderLeft: `4px solid ${COLORS.steelCyan}`,
                  }}
                >
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-3"
                    style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelCyan }}
                  >
                    TE APALANCA
                  </h3>
                  <p style={{ color: COLORS.textMain }}>
                    "Si tu ingreso depende de una <strong>infraestructura de apalancamiento</strong>,
                    tienes Soberanía."
                  </p>
                </div>
              </div>

              {/* Fila 3: SEGURIDAD */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_1fr] gap-6 items-stretch">

                {/* Villano */}
                <div
                  className="relative p-6 rounded-lg overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${COLORS.gunmetal}, ${COLORS.bgPanel})`,
                    borderLeft: `4px solid ${COLORS.safetyOrange}`,
                  }}
                >
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-3"
                    style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.safetyOrange }}
                  >
                    LA TRAMPA DEL INGRESO LINEAL
                  </h3>
                  <p style={{ color: COLORS.textMuted }}>
                    "No importa si tienes uno o cinco negocios; si todos dependen
                    de tu presencia, una crisis los derriba a todos."
                  </p>
                </div>

                {/* Eje Central - Cables de Puente */}
                <div
                  className="hidden md:flex items-center justify-center rounded-lg overflow-hidden"
                  style={{
                    background: `url("${IMAGES.bridgeCables}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%) contrast(120%)',
                  }}
                >
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelGrey }}
                    >
                      🛡
                    </span>
                  </div>
                </div>

                {/* Héroe */}
                <div
                  className="relative p-6 rounded-lg overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${COLORS.gunmetal}, ${COLORS.bgPanel})`,
                    borderLeft: `4px solid ${COLORS.steelCyan}`,
                  }}
                >
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-3"
                    style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelCyan }}
                  >
                    SEGURIDAD DE RED
                  </h3>
                  <p style={{ color: COLORS.textMain }}>
                    "Como 1.000 cables de acero sosteniendo un puente. Si un punto
                    falla, el sistema sigue pagando."
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================
            SECCIÓN 3: LA ARQUITECTURA (3 Componentes)
            Sistema de Engranajes - El Mecanismo
        ============================================================ */}
        <section className="relative py-24 px-6 overflow-hidden">

          {/* Imagen de fondo: Engranajes */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url("${IMAGES.gears}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'grayscale(100%) contrast(110%) brightness(20%)',
            }}
          />

          {/* Overlay */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(180deg, rgba(18,18,18,0.95) 0%, rgba(18,18,18,0.85) 50%, rgba(18,18,18,0.95) 100%)'
            }}
          />

          <div className="relative z-20 max-w-6xl mx-auto">

            {/* Header */}
            <div className="text-center mb-16">
              <span
                className="inline-block px-4 py-2 rounded text-xs uppercase tracking-wider font-bold mb-6"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  backgroundColor: `${COLORS.steelCyan}20`,
                  color: COLORS.steelCyan,
                  border: `1px solid ${COLORS.steelCyan}40`
                }}
              >
                SOLUCIÓN DE INGENIERÍA
              </span>

              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                ARQUITECTURA DE<br/>
                <span style={{ color: COLORS.steelCyan }}>APALANCAMIENTO</span>
              </h2>

              <p className="text-lg max-w-2xl mx-auto" style={{ color: COLORS.textMuted }}>
                Tres engranajes sincronizados que multiplican tu fuerza de forma sistémica.
              </p>
            </div>

            {/* Los 3 Componentes - Con imágenes de fondo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Componente 1: EL MÚSCULO */}
              <div
                className="relative rounded-lg overflow-hidden group"
                style={{ minHeight: '400px' }}
              >
                {/* Imagen de fondo */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("${IMAGES.powerPlant}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%) contrast(120%) brightness(40%)',
                    transition: 'transform 0.5s ease',
                  }}
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)'
                  }}
                />

                {/* Barra superior de color */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: COLORS.safetyOrange }}
                />

                {/* Contenido */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                  <span
                    className="text-xs uppercase tracking-wider mb-2"
                    style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.safetyOrange }}
                  >
                    COMPONENTE 01
                  </span>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    EL MÚSCULO
                  </h3>
                  <p className="text-sm uppercase tracking-wider mb-4" style={{ color: COLORS.steelGrey }}>
                    CAPITAL Y PRODUCTOS
                  </p>
                  <p style={{ color: COLORS.textMuted }}>
                    Gano Excel Industries. Plantas de producción, patentes propietarias,
                    y músculo financiero de clase mundial.
                  </p>
                </div>
              </div>

              {/* Componente 2: LA TUBERÍA */}
              <div
                className="relative rounded-lg overflow-hidden group"
                style={{ minHeight: '400px' }}
              >
                {/* Imagen de fondo */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("${IMAGES.bridgeCables}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%) contrast(120%) brightness(40%)',
                    transition: 'transform 0.5s ease',
                  }}
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)'
                  }}
                />

                {/* Barra superior de color */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: COLORS.steelCyan }}
                />

                {/* Contenido */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                  <span
                    className="text-xs uppercase tracking-wider mb-2"
                    style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelCyan }}
                  >
                    COMPONENTE 02
                  </span>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    LA TUBERÍA
                  </h3>
                  <p className="text-sm uppercase tracking-wider mb-4" style={{ color: COLORS.steelGrey }}>
                    RED DE DISTRIBUCIÓN
                  </p>
                  <p style={{ color: COLORS.textMuted }}>
                    Presencia en 66 países. Una red de distribución global que
                    fluye sin importar fronteras ni husos horarios.
                  </p>
                </div>
              </div>

              {/* Componente 3: EL CEREBRO */}
              <div
                className="relative rounded-lg overflow-hidden group"
                style={{ minHeight: '400px' }}
              >
                {/* Imagen de fondo */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("${IMAGES.gears}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%) contrast(120%) brightness(40%)',
                    transition: 'transform 0.5s ease',
                  }}
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)'
                  }}
                />

                {/* Barra superior de color */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: '#10b981' }}
                />

                {/* Contenido */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                  <span
                    className="text-xs uppercase tracking-wider mb-2"
                    style={{ fontFamily: "'Rajdhani', sans-serif", color: '#10b981' }}
                  >
                    COMPONENTE 03
                  </span>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    EL CEREBRO
                  </h3>
                  <p className="text-sm uppercase tracking-wider mb-4" style={{ color: COLORS.steelGrey }}>
                    SISTEMA DE COMPENSACIÓN
                  </p>
                  <p style={{ color: COLORS.textMuted }}>
                    Plan binario híbrido. Un algoritmo de compensación que
                    distribuye valor de forma automática y escalable.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ============================================================
            SECCIÓN 4: MÉTRICAS (Dashboard Widgets)
            Panel de Control con datos
        ============================================================ */}
        <section
          className="relative py-24 px-6"
          style={{ backgroundColor: COLORS.bgPanel }}
        >
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="text-center mb-16">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                PANEL DE <span style={{ color: COLORS.steelCyan }}>CONTROL</span>
              </h2>
              <p style={{ color: COLORS.textMuted }}>
                Métricas del sistema en tiempo real
              </p>
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Widget 1: Flujo de Activos */}
              <div
                className="p-6 rounded-lg relative"
                style={{
                  background: `linear-gradient(145deg, #2b2b2b, ${COLORS.bgPanel})`,
                  border: '1px solid #383838',
                  boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.1), inset -1px -1px 0px rgba(0, 0, 0, 0.5), 5px 5px 10px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* Tornillo decorativo */}
                <div
                  className="absolute top-3 right-3 w-2 h-2 rounded-full"
                  style={{ background: '#111', boxShadow: 'inset 1px 1px 1px rgba(255,255,255,0.1)' }}
                />

                <span
                  className="text-xs uppercase tracking-wider block mb-4"
                  style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelGrey }}
                >
                  FLUJO DE ACTIVOS
                </span>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg" style={{ color: COLORS.steelGrey }}>$</span>
                  <span
                    className="text-5xl font-bold"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    4.2M
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span style={{ color: '#10b981' }}>▲</span>
                  <span className="font-mono text-sm" style={{ color: '#10b981' }}>+12.4%</span>
                </div>
              </div>

              {/* Widget 2: Red Global */}
              <div
                className="p-6 rounded-lg relative"
                style={{
                  background: `linear-gradient(145deg, #2b2b2b, ${COLORS.bgPanel})`,
                  border: '1px solid #383838',
                  boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.1), inset -1px -1px 0px rgba(0, 0, 0, 0.5), 5px 5px 10px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* Tornillo decorativo */}
                <div
                  className="absolute top-3 right-3 w-2 h-2 rounded-full"
                  style={{ background: '#111', boxShadow: 'inset 1px 1px 1px rgba(255,255,255,0.1)' }}
                />

                <span
                  className="text-xs uppercase tracking-wider block mb-4"
                  style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelGrey }}
                >
                  RED GLOBAL
                </span>

                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className="text-5xl font-bold"
                    style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelCyan }}
                  >
                    66
                  </span>
                  <span className="text-xl" style={{ color: COLORS.steelGrey }}>países</span>
                </div>

                <span className="font-mono text-sm" style={{ color: COLORS.steelGrey }}>
                  COBERTURA OPERATIVA
                </span>
              </div>

              {/* Widget 3: Sistema */}
              <div
                className="p-6 rounded-lg relative"
                style={{
                  background: `linear-gradient(145deg, #2b2b2b, ${COLORS.bgPanel})`,
                  border: '1px solid #383838',
                  boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.1), inset -1px -1px 0px rgba(0, 0, 0, 0.5), 5px 5px 10px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* Tornillo decorativo */}
                <div
                  className="absolute top-3 right-3 w-2 h-2 rounded-full"
                  style={{ background: '#111', boxShadow: 'inset 1px 1px 1px rgba(255,255,255,0.1)' }}
                />

                <span
                  className="text-xs uppercase tracking-wider block mb-4"
                  style={{ fontFamily: "'Rajdhani', sans-serif", color: COLORS.steelGrey }}
                >
                  ESTADO DEL SISTEMA
                </span>

                <div className="space-y-3">
                  {[
                    { label: 'INFRAESTRUCTURA', value: 'ONLINE', color: '#10b981' },
                    { label: 'COMPENSACIÓN', value: 'ACTIVA', color: '#10b981' },
                    { label: 'FLUJO', value: '24/7', color: COLORS.steelCyan },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: COLORS.steelGrey }}>{item.label}</span>
                      <span className="font-mono text-xs font-bold" style={{ color: item.color }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ============================================================
            SECCIÓN 5: CTA FINAL
        ============================================================ */}
        <section
          className="relative py-24 px-6 overflow-hidden"
        >
          {/* Imagen de fondo: Estructura de acero */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url("${IMAGES.steelStructure}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'grayscale(100%) contrast(110%) brightness(25%)',
            }}
          />

          <div
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(180deg, rgba(18,18,18,0.9) 0%, rgba(18,18,18,0.95) 100%)'
            }}
          />

          <div className="relative z-20 max-w-2xl mx-auto text-center">

            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              ACTUALIZA TU<br/>
              <span style={{ color: COLORS.steelCyan }}>SISTEMA OPERATIVO</span>
            </h2>

            <p className="text-lg mb-10" style={{ color: COLORS.textMuted }}>
              El Plan por Defecto está obsoleto. Es hora de instalar una
              Infraestructura de Apalancamiento real.
            </p>

            <Link
              href="/reto-5-dias"
              className="inline-block px-10 py-4 rounded-lg font-bold uppercase tracking-wider text-lg transition-all hover:scale-105"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                background: `linear-gradient(135deg, ${COLORS.safetyOrange}, #ff8a00)`,
                color: '#000',
                boxShadow: `0 4px 30px ${COLORS.safetyOrange}50`
              }}
            >
              INICIAR ACTUALIZACIÓN
            </Link>

            <p className="mt-6 text-sm" style={{ color: COLORS.steelGrey }}>
              Versión 2.0 • Panel de Control Industrial
            </p>

          </div>
        </section>

      </main>

      {/* ============================================================
          ESTILOS GLOBALES
      ============================================================ */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Roboto+Mono:wght@400;500&family=Roboto:wght@300;400;500&display=swap');

        .industrial-theme {
          scrollbar-width: thin;
          scrollbar-color: #333 #1a1a1a;
        }

        .industrial-theme::-webkit-scrollbar {
          width: 8px;
        }

        .industrial-theme::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        .industrial-theme::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }

        .industrial-theme::-webkit-scrollbar-thumb:hover {
          background: #444;
        }

        /* Animación suave de scroll */
        html {
          scroll-behavior: smooth;
        }
      `}</style>

    </div>
  );
}
