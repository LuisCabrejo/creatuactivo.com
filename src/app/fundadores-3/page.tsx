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

import { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle, PlayCircle, Rocket, Clock, TrendingUp, ChevronDown, ChevronRight, Zap, Building2, FileText, Cpu } from 'lucide-react'
import StrategicNavigation from '@/components/StrategicNavigation'
import Image from 'next/image'

// Colores del branding CreaTuActivo
const BRAND_COLORS = {
  blue: '#1E40AF',
  purple: '#7C3AED',
  gold: '#F59E0B',
  dark: '#0f172a',
  darkAlt: '#1e293b',
}

// ============================================================================
// SECCIÓN 1: HERO (WHY HONESTO - Seguridad/Tranquilidad)
// ============================================================================

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Animated Blobs Background - MATCHING ORIGINAL BRANDING */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-64 -left-64 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-64 -right-64 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500 opacity-10 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-2 mb-8">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          <span className="text-amber-300 font-semibold text-sm uppercase tracking-wider">
            150 Posiciones de Fundador
          </span>
        </div>

        {/* Headline - MATCHING ORIGINAL GRADIENT */}
        <h1 className="bg-gradient-to-br from-blue-700 via-purple-600 to-amber-500 bg-clip-text text-transparent text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          ¿Cuánto tiempo más vas a depender de que NO te despidan?
        </h1>

        {/* Subheadline */}
        <div className="text-lg md:text-xl text-slate-300 space-y-4 mb-12 leading-relaxed max-w-3xl mx-auto">
          <p className="font-semibold text-white">La mayoría de personas no pide ser millonaria.</p>
          <p>Pide <span className="text-amber-400 font-semibold">estar al día</span>. Pagar cuentas sin estrés.</p>
          <p>Tener el iPhone que quiere. Viajar sin culpa. <span className="text-purple-400 font-semibold">No vivir con miedo al lunes</span>.</p>
          <p className="text-slate-400 text-base mt-6">El problema no es la ambición.</p>
          <p className="text-white font-semibold">Es que intercambias 40 años de tu vida por una pensión que no alcanza.</p>
          <p className="text-slate-300">Y cuando por fin eres "libre"... <span className="text-red-400">ya no tienes energía para disfrutarlo</span>.</p>
        </div>

        {/* CTAs - MATCHING ORIGINAL BUTTON STYLE */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#formulario"
            className="bg-gradient-to-r from-blue-700 to-purple-600 text-white font-bold py-[18px] px-9 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
          >
            <Building2 className="w-6 h-6" />
            <span>Construir Mi Activo</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#video"
            className="text-white/80 hover:text-white underline underline-offset-4 decoration-amber-400/30 hover:decoration-amber-400 transition-all flex items-center gap-2"
          >
            <PlayCircle className="w-5 h-5" />
            Ver la arquitectura completa (1 min)
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-8 h-8 text-amber-400/60" />
      </div>
    </section>
  )
}

// ============================================================================
// SECCIÓN 2: HISTORIA BUENA VISTA (WHY NARRATIVO - Mantenemos porque funciona)
// ============================================================================

function HistoriaPersonalSection() {
  return (
    <section className="py-24 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Eyebrow */}
        <div className="text-center mb-4">
          <span className="inline-block text-sm uppercase tracking-wider font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
            Por qué existe CreaTuActivo
          </span>
        </div>

        {/* Layout: Foto + Texto */}
        <div className="grid md:grid-cols-5 gap-12 items-center">
          {/* Foto (40%) */}
          <div className="md:col-span-2">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-500/30">
              <Image
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=1000&fit=crop&q=90"
                alt="Luis Cabrejo y su esposa"
                fill
                className="object-cover"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            </div>
          </div>

          {/* Texto (60%) */}
          <div className="md:col-span-3 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Una promesa que tardó 14 años
            </h2>

            <div className="prose prose-lg prose-invert leading-relaxed space-y-4 text-slate-300">
              <p>
                Hace años, cuando era novio, llevé a mi esposa a Buena Vista aquí en Vicencio.
              </p>

              <p className="font-semibold text-white">Le prometí 3 cosas:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <span>Una casa de campo</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <span>Que fuera de compras cuando quisiera</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <span>3 hijos</span>
                </li>
              </ul>

              <p className="text-xl font-bold text-amber-400 bg-amber-500/10 border-l-4 border-amber-500 pl-4 py-2">
                14 años después... solo le había cumplido con los hijos.
              </p>

              <p>
                Porque seguía intercambiando tiempo por dinero.<br />
                Porque seguía siendo empleado, no dueño.<br />
                Porque no entendía la diferencia entre INGRESO y ACTIVO.
              </p>

              <p className="text-2xl font-black text-white">
                Entonces construí algo diferente.
              </p>

              <p className="text-lg">Y funcionó.</p>

              <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-amber-500/10 border border-purple-500/30 rounded-xl p-6">
                <p className="font-bold text-white text-lg">
                  Mi esposa y yo Diamantes en Gano Excel.<br />
                  Viajes a Singapur, Malasia, Corea.<br />
                  12 años construyendo este activo patrimonial.
                </p>
              </div>

              <p className="text-lg">Cumplí las promesas.</p>

              <p className="text-2xl font-black text-red-400">
                Pero me cansé.
              </p>

              <p className="text-xl font-bold text-purple-400">
                Me cansé de construir en la EDAD DE PIEDRA.
              </p>

              <p className="text-lg text-white">
                Porque lo que realmente quiero NO es solo que YO tenga libertad.
              </p>

              <p className="text-2xl font-black bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                Quiero que TÚ también la tengas.
              </p>

              <p>
                Sin esperar 14 años.<br />
                Sin herramientas manuales.<br />
                Sin sentir que "persigues gente".
              </p>

              <p className="text-3xl font-black text-white">
                Por eso rediseñamos TODO.
              </p>
            </div>

            {/* Firma */}
            <div className="pt-6 border-t border-slate-700">
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Luis Cabrejo</p>
              <p className="text-sm text-slate-400">Fundador, CreaTuActivo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// SECCIÓN 3: MOTOR-PLANO-MAQUINARIA (La Arquitectura Completa)
// ============================================================================

function ArquitecturaCompletaSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  return (
    <section id="video" className="py-32 bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 relative overflow-hidden scroll-mt-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(245,158,11,0.3) 1px, transparent 0)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Eyebrow */}
        <div className="text-center mb-4">
          <span className="inline-block text-sm uppercase tracking-wider font-bold bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
            La Arquitectura Completa
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-6xl font-black text-center mb-6">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
            Motor + Plano + Maquinaria
          </span>
          <br />
          <span className="text-white">= Apalancamiento Total</span>
        </h2>

        {/* Subheadline */}
        <p className="text-xl text-slate-300 text-center max-w-4xl mx-auto mb-16">
          No te vendemos un negocio. Te entregamos la <span className="text-amber-400 font-bold">arquitectura completa</span> para que construyas tu activo patrimonial.
        </p>

        {/* 3 Componentes */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* El Motor - MATCHING ORIGINAL CARD STYLE */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-amber-500/30 rounded-3xl shadow-2xl hover:shadow-amber-500/25 hover:-translate-y-1 transition-all duration-300 p-8 h-full">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-2">Componente 1</div>
            <h3 className="text-2xl font-black text-white mb-4">🏭 EL MOTOR</h3>
            <p className="text-amber-100 font-semibold mb-3">Productos Gano Excel con patente mundial</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ventaja competitiva única que nadie puede replicar. 30+ años en el mercado, patente mundial vigente.
            </p>
          </div>

          {/* El Plano - MATCHING ORIGINAL CARD STYLE */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-green-500/30 rounded-3xl shadow-2xl hover:shadow-green-500/25 hover:-translate-y-1 transition-all duration-300 p-8 h-full">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="text-xs uppercase tracking-wider text-green-400 font-bold mb-2">Componente 2</div>
            <h3 className="text-2xl font-black text-white mb-4">📋 EL PLANO</h3>
            <p className="text-green-100 font-semibold mb-3">Framework IAA propietario</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Metodología probada INICIAR → ACOGER → ACTIVAR. Tu plano arquitectónico de construcción de activos.
            </p>
          </div>

          {/* La Maquinaria - MATCHING ORIGINAL CARD STYLE */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-purple-500/30 rounded-3xl shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 p-8 h-full">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <div className="text-xs uppercase tracking-wider text-purple-400 font-bold mb-2">Componente 3</div>
            <h3 className="text-2xl font-black text-white mb-4">⚡ LA MAQUINARIA</h3>
            <p className="text-purple-100 font-semibold mb-3">NodeX + NEXUS integrados</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automatización IA que elimina 80% del trabajo manual. Dashboard + Chatbot trabajando 24/7.
            </p>
          </div>
        </div>

        {/* Resultado Transformacional */}
        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-8 mb-16">
          <div className="flex items-start gap-4">
            <div className="text-6xl">⚡</div>
            <div>
              <p className="text-sm uppercase tracking-wider text-amber-400 font-bold mb-3">Resultado Transformacional</p>
              <p className="text-2xl font-black text-white mb-4">
                Pasas de operador que intercambia tiempo por dinero a arquitecto que construye un activo con apalancamiento exponencial
              </p>
              <p className="text-xl text-purple-300 font-bold">
                que te compra tu tiempo de vuelta.
              </p>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-500/30">
            {!isVideoLoaded && (
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <PlayCircle className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                  <p className="text-white font-semibold">Así funciona la Arquitectura Completa</p>
                </div>
              </div>
            )}
            <video
              controls
              preload="metadata"
              poster={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_POSTER || '/videos/fundadores-poster.jpg'}
              className="w-full h-full"
              onLoadedData={() => setIsVideoLoaded(true)}
            >
              <source
                src={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P || '/videos/fundadores-1080p.mp4'}
                type="video/mp4"
              />
              Tu navegador no soporta video HTML5.
            </video>
          </div>
          <p className="text-center text-slate-400 mt-4 italic">
            Motor + Plano + Maquinaria integrados automáticamente
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// SECCIÓN 4: ANTES/AHORA (Del Trabajo Duro al Apalancamiento)
// ============================================================================

function AntesAhoraSection() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Eyebrow */}
        <div className="text-center mb-4">
          <span className="inline-block text-sm uppercase tracking-wider font-bold bg-gradient-to-r from-red-400 to-green-400 bg-clip-text text-transparent">
            Del Trabajo Duro al Apalancamiento Inteligente
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-black text-center mb-6 text-white">
          De la Edad de Piedra a 2025
        </h2>

        {/* Subheadline */}
        <p className="text-lg text-slate-400 text-center max-w-3xl mx-auto mb-16">
          Durante 12 años construimos con herramientas manuales. Funcionó. Pero era lento, complejo, y dependía 100% de ti.<br />
          <span className="text-purple-400 font-semibold">Entonces rediseñamos CÓMO se construye.</span>
        </p>

        {/* Comparativa */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* ANTES */}
          <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-2 border-red-500/30 rounded-2xl p-8">
            <div className="text-5xl mb-4">🧱</div>
            <h3 className="text-3xl font-black text-red-400 mb-2">ANTES</h3>
            <p className="text-sm text-red-300 mb-6 uppercase tracking-wider">(Edad de Piedra - Trabajo Duro)</p>

            <ul className="space-y-3 text-slate-300 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl mt-0.5">✗</span>
                <span>Llamadas manuales infinitas</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl mt-0.5">✗</span>
                <span>Seguimientos en Excel perdidos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl mt-0.5">✗</span>
                <span>Presentaciones cara a cara agotadoras</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl mt-0.5">✗</span>
                <span>Tú educas CADA prospecto manualmente</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl mt-0.5">✗</span>
                <span>Tú calificas sin datos objetivos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl mt-0.5">✗</span>
                <span>Tú persigues gente 24/7 sin descanso</span>
              </li>
            </ul>

            <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded">
              <p className="font-bold text-red-400 mb-1">RESULTADO:</p>
              <p className="text-red-300">Agotamiento. Límite de escala. Intercambio perpetuo tiempo por dinero.</p>
            </div>
          </div>

          {/* AHORA */}
          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-2 border-green-500/30 rounded-2xl p-8">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-3xl font-black text-green-400 mb-2">AHORA</h3>
            <p className="text-sm text-green-300 mb-6 uppercase tracking-wider">(2025 - Apalancamiento IA)</p>

            <ul className="space-y-3 text-slate-300 mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">NEXUS IA</strong> educa automáticamente</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Califica prospectos en tiempo real <strong className="text-amber-400">(interés 0-10)</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">NodeX Dashboard</strong> centraliza todo tu ecosistema</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Sistema trabaja <strong className="text-purple-400">mientras duermes</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Tú intervienes SOLO cuando prospecto está <strong className="text-green-400">listo (8-10/10)</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">80% automatizado</strong> = 26 horas recuperadas/semana</span>
              </li>
            </ul>

            <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded">
              <p className="font-bold text-green-400 mb-1">RESULTADO:</p>
              <p className="text-green-300">Apalancamiento exponencial. Escalabilidad ilimitada. Activo que trabaja para ti.</p>
            </div>
          </div>
        </div>

        {/* Impacto Numérico */}
        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-12 max-w-4xl mx-auto">
          <h3 className="text-3xl font-black text-white text-center mb-8">Impacto Real en Números</h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <p className="text-sm uppercase tracking-wider text-slate-400 mb-3">Antes (Trabajo Duro)</p>
              <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-3xl font-black text-red-400">10</p>
                  <p className="text-sm text-slate-300">prospectos/semana</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-3xl font-black text-red-400">40</p>
                  <p className="text-sm text-slate-300">horas invertidas</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-3xl font-black text-red-400">2-3</p>
                  <p className="text-sm text-slate-300">conversiones</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm uppercase tracking-wider text-green-400 mb-3">Ahora (Apalancamiento IA)</p>
              <div className="space-y-3">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-3xl font-black text-green-400">100+</p>
                  <p className="text-sm text-slate-300">prospectos/semana</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-3xl font-black text-green-400">5</p>
                  <p className="text-sm text-slate-300">horas invertidas</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-3xl font-black text-green-400">15-20</p>
                  <p className="text-sm text-slate-300">conversiones</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl">
              <p className="text-2xl font-black">= 26 horas recuperadas/semana</p>
              <p className="text-sm font-semibold opacity-90">= Tiempo para lo que realmente importa</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#formulario"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 hover:from-blue-700 hover:via-purple-700 hover:to-amber-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-amber-500/50 hover:-translate-y-1 transition-all duration-300"
          >
            Quiero el Apalancamiento Completo
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// SECCIÓN 5: QUÉ CONSTRUYES (Tabla Fundador)
// ============================================================================

function QueConstruyesSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Eyebrow */}
        <div className="text-center mb-4">
          <span className="inline-block text-sm uppercase tracking-wider font-bold bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
            La Oportunidad
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-black text-center mb-6 text-white">
          Qué Significa Ser Fundador
        </h2>

        {/* Subheadline */}
        <p className="text-lg text-slate-400 text-center max-w-3xl mx-auto mb-16">
          No es solo "acceso anticipado".<br />
          <span className="text-purple-400 font-semibold">Es convertirte en arquitecto del ecosistema que viene.</span>
        </p>

        {/* 4 Beneficios Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Beneficio 1 - MATCHING ORIGINAL CARD STYLE */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-blue-500/30 rounded-3xl shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1 transition-all duration-300 p-8 h-full">
            <div className="text-5xl mb-4">🏗️</div>
            <h3 className="text-2xl font-black text-white mb-4">Posicionamiento Estratégico</h3>
            <div className="space-y-3 text-slate-300">
              <p>Entras en la <strong className="text-amber-400">BASE de la arquitectura</strong>.</p>
              <p>Mientras el público general entra en <strong className="text-slate-400">enero 2026</strong>, tú construyes desde <strong className="text-green-400">noviembre 2025</strong>.</p>
              <p className="font-semibold text-white">Ventaja: 2 meses de red construida ANTES del lanzamiento público.</p>
              <p className="italic text-amber-300">Como comprar Bitcoin en 2010.</p>
            </div>
          </div>

          {/* Beneficio 2 - MATCHING ORIGINAL CARD STYLE */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-purple-500/30 rounded-3xl shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 p-8 h-full">
            <div className="text-5xl mb-4">🛠️</div>
            <h3 className="text-2xl font-black text-white mb-4">Acceso Tecnológico Total</h3>
            <div className="space-y-2 text-slate-300 mb-4">
              <p className="font-semibold text-white">NodeX Dashboard completo desde día 1:</p>
              <ul className="space-y-1.5 ml-4 text-sm">
                <li>• NEXUS IA (chatbot 24/7)</li>
                <li>• Panel de prospectos en tiempo real</li>
                <li>• Métricas de conversión automatizadas</li>
                <li>• CRM integrado</li>
                <li>• Enlace personalizado</li>
              </ul>
              <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg mt-4">
                <p className="text-sm text-slate-400">Valor de mercado: <span className="line-through">$497/mes</span></p>
                <p className="font-bold text-green-400 text-lg">Fundadores: GRATIS de por vida</p>
              </div>
            </div>
          </div>

          {/* Beneficio 3 - MATCHING ORIGINAL CARD STYLE */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-amber-500/30 rounded-3xl shadow-2xl hover:shadow-amber-500/25 hover:-translate-y-1 transition-all duration-300 p-8 h-full">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-2xl font-black text-white mb-4">Ventaja Económica Fundacional</h3>
            <div className="space-y-3 text-slate-300">
              <p>Recompensa superior <strong className="text-amber-400">VITALICIA</strong> por posición estratégica.</p>
              <p className="font-semibold text-white">
                Ratio de mentoría: <span className="text-green-400">1:150</span><br />
                <span className="text-sm font-normal text-slate-400">(Tú mentoreas máximo 150 Constructores)</span>
              </p>
              <p>Comisiones de red perpetuas.</p>
              <p className="font-semibold text-red-400">
                Constructores que entren en enero 2026 NUNCA tendrán este ratio.
              </p>
            </div>
          </div>

          {/* Beneficio 4 - MATCHING ORIGINAL CARD STYLE */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-green-500/30 rounded-3xl shadow-2xl hover:shadow-green-500/25 hover:-translate-y-1 transition-all duration-300 p-8 h-full">
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-2xl font-black text-white mb-4">Mentoría Directa</h3>
            <div className="space-y-3 text-slate-300">
              <p>Acceso directo a <strong className="text-white">Luis Cabrejo</strong> y equipo fundador durante <strong className="text-amber-400">6 semanas</strong>.</p>
              <ul className="space-y-1.5 ml-4 text-sm">
                <li>• Calls semanales de estrategia</li>
                <li>• Comunidad privada Fundadores</li>
                <li>• Material exclusivo (no público)</li>
                <li>• Primeros en recibir actualizaciones</li>
              </ul>
              <p className="text-sm bg-slate-800/50 p-3 rounded border border-slate-700">
                Constructores públicos: Mentoría grupal masiva (1:22,500)
              </p>
            </div>
          </div>
        </div>

        {/* Tabla Comparativa */}
        <div className="mb-12">
          <h3 className="text-3xl font-black text-center mb-8 text-white">
            Fundador vs Constructor vs Público
          </h3>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border-2 border-purple-500/30">
            <table className="w-full bg-slate-900/50 backdrop-blur-xl">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 text-white">
                  <th className="p-4 text-left font-bold">Característica</th>
                  <th className="p-4 text-center font-bold bg-amber-500/20">FUNDADOR (150)</th>
                  <th className="p-4 text-center font-bold">CONSTRUCTOR (22,500)</th>
                  <th className="p-4 text-center font-bold">PÚBLICO (4M+)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-semibold text-white">Entrada</td>
                  <td className="p-4 text-center bg-amber-500/10 font-bold text-green-400">Nov 2025</td>
                  <td className="p-4 text-center text-slate-300">Ene 2026</td>
                  <td className="p-4 text-center text-slate-400">Ene 2026+</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-semibold text-white">NodeX Dashboard</td>
                  <td className="p-4 text-center bg-amber-500/10 font-bold text-green-400">GRATIS vitalicio<br/><span className="text-xs text-slate-400">($497/mes valor)</span></td>
                  <td className="p-4 text-center text-slate-300">$97/mes</td>
                  <td className="p-4 text-center text-slate-400">$197/mes</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-semibold text-white">Mentoría</td>
                  <td className="p-4 text-center bg-amber-500/10 font-bold text-green-400">Directa 1:150</td>
                  <td className="p-4 text-center text-slate-300">Grupal 1:22,500</td>
                  <td className="p-4 text-center text-slate-400">Autoservicio</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-semibold text-white">Posición red</td>
                  <td className="p-4 text-center bg-amber-500/10 font-bold text-green-400">BASE (cima)</td>
                  <td className="p-4 text-center text-slate-300">Media</td>
                  <td className="p-4 text-center text-slate-400">Entrada tardía</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-semibold text-white">Comisiones</td>
                  <td className="p-4 text-center bg-amber-500/10 font-bold text-green-400">Superiores vitalicias</td>
                  <td className="p-4 text-center text-slate-300">Estándar</td>
                  <td className="p-4 text-center text-slate-400">Estándar</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-400 rounded-2xl p-6">
              <h4 className="text-2xl font-black text-amber-400 mb-4">FUNDADOR (150)</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p><span className="font-semibold text-white">Entrada:</span> Nov 2025 ✓</p>
                <p><span className="font-semibold text-white">NodeX:</span> GRATIS vitalicio</p>
                <p><span className="font-semibold text-white">Mentoría:</span> Directa 1:150</p>
                <p><span className="font-semibold text-white">Posición:</span> BASE (cima)</p>
                <p><span className="font-semibold text-white">Comisiones:</span> Superiores vitalicias</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border-2 border-slate-600 rounded-2xl p-6">
              <h4 className="text-2xl font-black text-slate-300 mb-4">CONSTRUCTOR (22,500)</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <p><span className="font-semibold">Entrada:</span> Ene 2026</p>
                <p><span className="font-semibold">NodeX:</span> $97/mes</p>
                <p><span className="font-semibold">Mentoría:</span> Grupal 1:22,500</p>
                <p><span className="font-semibold">Posición:</span> Media</p>
                <p><span className="font-semibold">Comisiones:</span> Estándar</p>
              </div>
            </div>

            <div className="bg-slate-800/30 border-2 border-slate-700 rounded-2xl p-6">
              <h4 className="text-2xl font-black text-slate-500 mb-4">PÚBLICO (4M+)</h4>
              <div className="space-y-2 text-sm text-slate-500">
                <p><span className="font-semibold">Entrada:</span> Ene 2026+</p>
                <p><span className="font-semibold">NodeX:</span> $197/mes</p>
                <p><span className="font-semibold">Mentoría:</span> Autoservicio</p>
                <p><span className="font-semibold">Posición:</span> Entrada tardía</p>
                <p><span className="font-semibold">Comisiones:</span> Estándar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Callout Urgencia */}
        <div className="bg-gradient-to-r from-amber-500/20 to-red-500/20 border-2 border-amber-500 rounded-2xl p-8 max-w-4xl mx-auto mb-12">
          <div className="flex items-start gap-4">
            <Clock className="w-12 h-12 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-xl font-bold text-amber-400 mb-2">Ventana de oportunidad:</p>
              <p className="text-lg text-white mb-4">
                Solo <strong className="text-amber-400">150 posiciones</strong> de Fundador.<br />
                Lista privada cierra: <strong className="text-red-400">16 de noviembre 2025</strong>.
              </p>
              <p className="text-sm text-slate-400">
                Después de esa fecha, solo podrás entrar como Constructor. Posición de Fundador no estará disponible nunca más.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="#formulario"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 hover:from-blue-700 hover:via-purple-700 hover:to-amber-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-amber-500/50 hover:-translate-y-1 transition-all duration-300"
          >
            Reservar Mi Posición de Fundador
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// SECCIÓN 6: CONTADOR Y TIMELINE
// ============================================================================

function ContadorTimelineSection() {
  const [cuposDisponibles, setCuposDisponibles] = useState(150)

  return (
    <section className="py-32 bg-gradient-to-br from-slate-900 via-purple-950 to-blue-950 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-black text-center mb-12">
          <span className="text-white">150 Cupos. 3 Fases.</span>
          <br />
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Una Oportunidad.
          </span>
        </h2>

        {/* Contador */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500 rounded-3xl p-12 backdrop-blur-xl">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-6xl animate-pulse">🔥</div>
              <div className="text-7xl md:text-8xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                {cuposDisponibles}
              </div>
              <div className="text-3xl text-slate-400">/ 150</div>
            </div>
            <p className="text-xl text-white font-semibold">cupos disponibles</p>
            <p className="text-sm text-green-400 mt-2">Fase de entrada temprana</p>
          </div>
        </div>

        {/* Timeline 3 Fases */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Fase 1 - ACTIVA */}
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500 rounded-2xl p-8 text-white relative">
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              ABIERTA
            </div>
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-2xl font-black mb-2">FASE 1</h3>
            <p className="text-lg font-semibold text-amber-300 mb-4">Lista Privada</p>
            <p className="text-sm text-amber-200 mb-4">Nov 17 - Dic 27, 2025</p>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">150 Fundadores</p>
              <ul className="space-y-1 text-slate-300 ml-4 text-xs">
                <li>• Mentoría 1:150</li>
                <li>• 6 semanas intensivas</li>
                <li>• Construyes base</li>
              </ul>
            </div>
          </div>

          {/* Fase 2 - PRÓXIMA */}
          <div className="bg-slate-800/30 border-2 border-slate-600 rounded-2xl p-8 text-slate-400">
            <div className="text-5xl mb-4 opacity-50">🎓</div>
            <h3 className="text-2xl font-black mb-2">FASE 2</h3>
            <p className="text-lg font-semibold mb-4">Pre-Lanzamiento</p>
            <p className="text-sm mb-4">Ene 5 - Feb 28, 2026</p>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">22,500 Constructores</p>
              <ul className="space-y-1 ml-4 text-xs">
                <li>• Mentoría grupal</li>
                <li>• Pre-público</li>
                <li>• Ventaja vs masivo</li>
              </ul>
            </div>
          </div>

          {/* Fase 3 - FUTURA */}
          <div className="bg-slate-800/20 border-2 border-slate-700 rounded-2xl p-8 text-slate-500">
            <div className="text-5xl mb-4 opacity-30">🚀</div>
            <h3 className="text-2xl font-black mb-2">FASE 3</h3>
            <p className="text-lg font-semibold mb-4">Lanzamiento Público</p>
            <p className="text-sm mb-4">Mar 1, 2026 →</p>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">4M+ Usuarios</p>
              <ul className="space-y-1 ml-4 text-xs">
                <li>• Autoservicio</li>
                <li>• Público general</li>
                <li>• Entrada tardía</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Deadline */}
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500 rounded-2xl p-8 mt-16 max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <Clock className="w-10 h-10 text-red-400 flex-shrink-0 animate-pulse" />
            <div>
              <p className="text-xl font-bold text-red-400 mb-2">Fecha límite:</p>
              <p className="text-2xl font-black text-white mb-3">16 de noviembre 2025 a las 23:59 (UTC-5)</p>
              <p className="text-sm text-slate-300">
                Después de esa fecha, solo podrás entrar como Constructor (enero 2026).<br />
                <span className="text-red-400 font-semibold">Posición de Fundador no estará disponible NUNCA más.</span>
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center mt-12">
          <a
            href="#formulario"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-12 py-6 rounded-2xl font-black text-xl shadow-2xl hover:shadow-orange-500/50 hover:-translate-y-1 transition-all duration-300 animate-pulse"
          >
            No Quiero Perder Mi Cupo
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// SECCIÓN 7: FORMULARIO (Simplificado para conversión)
// ============================================================================

function FormularioSection() {
  const [paso, setPaso] = useState(1)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    whatsapp: '',
    situacion: '',
    motivacion: '',
    experienciaMLM: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Formulario enviado:', formData)
    // Aquí conectar con /api/fundadores
  }

  return (
    <section id="formulario" className="py-24 bg-slate-900 scroll-mt-24">
      <div className="max-w-3xl mx-auto px-6">
        {/* Eyebrow */}
        <div className="text-center mb-4">
          <span className="inline-block text-sm uppercase tracking-wider font-bold bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
            Último Paso
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-black text-center mb-6 text-white">
          Reserva Tu Posición de Fundador
        </h2>

        {/* Subheadline */}
        <p className="text-lg text-slate-400 text-center mb-12">
          Completa este formulario en 2 minutos.<br />
          Revisaremos tu aplicación en 24 horas.
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-slate-300">Paso {paso} de 3</span>
            <span className="text-sm text-slate-500">{Math.round((paso / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(paso / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Formulario - MATCHING ORIGINAL CARD STYLE */}
        <form onSubmit={handleSubmit} className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-amber-500/30 rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto">
          {paso === 1 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Información de Contacto</h3>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Luis Cabrejo Moreno"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  placeholder="luis@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  WhatsApp (con código país) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+57 300 123 4567"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={() => setPaso(2)}
                className="w-full bg-gradient-to-r from-blue-700 to-purple-600 text-white font-bold py-[18px] px-9 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Siguiente
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Tu Perfil</h3>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  ¿Cuál es tu situación actual? *
                </label>
                <div className="space-y-3">
                  {[
                    'Empleado buscando independencia financiera',
                    'Emprendedor/freelancer',
                    'Profesional con negocio propio',
                    'Líder de hogar',
                    'Otro'
                  ].map((opcion) => (
                    <label key={opcion} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="situacion"
                        value={opcion}
                        checked={formData.situacion === opcion}
                        onChange={(e) => setFormData({ ...formData, situacion: e.target.value })}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 bg-slate-700 border-slate-600"
                      />
                      <span className="text-slate-300 group-hover:text-white transition-colors">{opcion}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  ¿Por qué quieres ser Fundador? *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Comparte brevemente qué te motiva..."
                  value={formData.motivacion}
                  onChange={(e) => setFormData({ ...formData, motivacion: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  ¿Tienes experiencia construyendo activos empresariales? *
                </label>
                <div className="space-y-3">
                  {[
                    'Sí, actualmente activo',
                    'Sí, pero inactivo',
                    'No, sería mi primera vez'
                  ].map((opcion) => (
                    <label key={opcion} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="experienciaMLM"
                        value={opcion}
                        checked={formData.experienciaMLM === opcion}
                        onChange={(e) => setFormData({ ...formData, experienciaMLM: e.target.value })}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 bg-slate-700 border-slate-600"
                      />
                      <span className="text-slate-300 group-hover:text-white transition-colors">{opcion}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPaso(1)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-4 rounded-xl font-semibold transition-all"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setPaso(3)}
                  className="flex-1 bg-gradient-to-r from-blue-700 to-purple-600 text-white font-bold py-[18px] px-9 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Siguiente
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {paso === 3 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Confirmación</h3>

              {/* Resumen */}
              <div className="bg-slate-800/50 border-2 border-purple-500/30 rounded-xl p-6 space-y-3 text-slate-300">
                <p><span className="font-semibold text-white">📧 Nombre:</span> {formData.nombre}</p>
                <p><span className="font-semibold text-white">✉️ Correo:</span> {formData.email}</p>
                <p><span className="font-semibold text-white">📱 WhatsApp:</span> {formData.whatsapp}</p>
                <p><span className="font-semibold text-white">👤 Perfil:</span> {formData.situacion}</p>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" required className="mt-1 w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500" />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    Entiendo que esta es una aplicación, no una garantía de cupo. El equipo CreaTuActivo revisará mi perfil en 24 horas.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" required className="mt-1 w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500" />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    Acepto recibir comunicaciones vía WhatsApp y correo sobre mi aplicación y el programa de Fundadores.
                  </span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPaso(2)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-4 rounded-xl font-semibold transition-all"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  Enviar Mi Aplicación
                </button>
              </div>

              <p className="text-xs text-slate-500 text-center">
                Al enviar, aceptas nuestra Política de Privacidad y Términos de Servicio.<br />
                Tus datos están protegidos y no serán compartidos con terceros.
              </p>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================

export default function Fundadores3Page() {
  return (
    <div className="min-h-screen bg-slate-900">
      <StrategicNavigation />

      <HeroSection />
      <HistoriaPersonalSection />
      <ArquitecturaCompletaSection />
      <AntesAhoraSection />
      <QueConstruyesSection />
      <ContadorTimelineSection />
      <FormularioSection />

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white py-16 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-black mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              CreaTuActivo.com
            </h3>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              La Arquitectura Completa para Construir tu Activo Patrimonial
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Motor + Plano + Maquinaria = Apalancamiento Total
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              © 2025 CreaTuActivo. Todos los derechos reservados.<br />
              Desarrollado con tecnología de vanguardia
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
