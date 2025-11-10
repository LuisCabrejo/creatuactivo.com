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
import { ArrowRight, CheckCircle, PlayCircle, Rocket, Shield, Users, Zap, Clock, TrendingUp, Heart, ChevronDown, ChevronRight } from 'lucide-react'
import StrategicNavigation from '@/components/StrategicNavigation'
import Image from 'next/image'

// ============================================================================
// SECCIÓN 1: HERO (WHY EMOCIONAL)
// ============================================================================

function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image con Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1920&h=1080&fit=crop&q=80"
          alt="Padre con sus hijos disfrutando tiempo juntos"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/70 to-gray-900/85"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight font-serif">
          ¿Cuánto vale tu tiempo con tus hijos?
        </h1>

        {/* Subheadline */}
        <div className="text-lg md:text-xl lg:text-2xl text-white/90 space-y-4 mb-12 leading-relaxed max-w-3xl mx-auto">
          <p>La vida es demasiado corta para intercambiarla por dinero.</p>
          <p>Tu tiempo con tus hijos no tiene precio y no debería sacrificarse por un cheque quincenal.</p>
          <p>Fuiste diseñado para crear legado.</p>
          <p className="font-semibold">No para ser engranaje en una máquina corporativa.</p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#formulario"
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
          >
            <Rocket className="w-5 h-5" />
            Quiero construir legado
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#video"
            className="text-white/80 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all flex items-center gap-2"
          >
            <PlayCircle className="w-5 h-5" />
            Ver cómo funciona (video 1 min)
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/60" />
      </div>
    </section>
  )
}

// ============================================================================
// SECCIÓN 2: HISTORIA PERSONAL (WHY NARRATIVO)
// ============================================================================

function HistoriaPersonalSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Eyebrow */}
        <p className="text-sm uppercase tracking-wider text-purple-600 font-semibold mb-4 text-center">
          Por qué existe CreaTuActivo
        </p>

        {/* Layout: Foto + Texto */}
        <div className="grid md:grid-cols-5 gap-12 items-center">
          {/* Foto (40%) */}
          <div className="md:col-span-2">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=1000&fit=crop&q=90"
                alt="Luis Cabrejo y su esposa"
                fill
                className="object-cover"
                quality={90}
              />
            </div>
          </div>

          {/* Texto (60%) */}
          <div className="md:col-span-3 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
              Una promesa que tardó 14 años
            </h2>

            <div className="prose prose-lg text-gray-700 leading-relaxed space-y-4">
              <p>
                Hace años, cuando era novio, llevé a mi esposa a Buena Vista aquí en Vicencio.
              </p>

              <p>Le prometí 3 cosas:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Una casa de campo</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Que fuera de compras cuando quisiera</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>3 hijos</span>
                </li>
              </ul>

              <p className="font-semibold text-gray-900">
                14 años después... solo le había cumplido con los hijos.
              </p>

              <p>
                Porque seguía intercambiando tiempo por dinero.<br />
                Porque seguía siendo empleado, no dueño.<br />
                Porque no entendía la diferencia entre INGRESO y ACTIVO.
              </p>

              <p className="text-xl font-semibold text-gray-900">
                Entonces construí algo diferente.
              </p>

              <p>Y funcionó.</p>

              <p className="font-semibold">
                Mi esposa y yo Diamantes en Gano Excel.<br />
                Viajes a Singapur, Malasia, Corea.<br />
                12 años construyendo.
              </p>

              <p>Cumplí las promesas.</p>

              <p className="text-xl font-bold text-gray-900">
                Pero me cansé.
              </p>

              <p className="font-semibold">
                Me cansé de construir en la EDAD DE PIEDRA.
              </p>

              <p>
                Porque lo que realmente quiero NO es solo que YO tenga libertad.
              </p>

              <p className="text-xl font-semibold text-purple-600">
                Quiero que TÚ también la tengas.
              </p>

              <p>
                Sin esperar 14 años.<br />
                Sin herramientas manuales.<br />
                Sin sentir que "persigues gente".
              </p>

              <p className="text-2xl font-bold text-gray-900">
                Por eso rediseñamos TODO.
              </p>
            </div>

            {/* Firma */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-2xl font-script text-purple-700">Luis Cabrejo</p>
              <p className="text-sm text-gray-600">Fundador, CreaTuActivo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// SECCIÓN 3: CREENCIA CENTRAL + VIDEO (WHY FILOSÓFICO)
// ============================================================================

function CreenciaCentralSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  return (
    <section className="py-32 bg-gradient-to-br from-blue-900 via-purple-900 to-purple-800 relative overflow-hidden">
      {/* Textura sutil */}
      <div className="absolute inset-0 opacity-5 bg-[url('/textures/noise.png')] mix-blend-overlay"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12 font-serif">
          Nuestra Creencia Central
        </h2>

        {/* Manifesto */}
        <div className="text-xl md:text-2xl text-white/95 leading-relaxed space-y-6 text-center max-w-4xl mx-auto mb-16">
          <p>
            Creemos que la verdadera independencia financiera y personal NO se encuentra intercambiando tiempo por dinero.
          </p>
          <p className="font-semibold text-amber-300">
            Se encuentra convirtiéndote en el ARQUITECTO de un activo patrimonial.
          </p>
          <p>Creemos en construir un legado HEREDABLE.</p>
          <p>
            Creemos en empoderar a las personas para que pasen de ser "trabajadores" a ser "dueños de un sistema".
          </p>
          <p>
            Porque el tiempo que no recuperas con tus hijos vale más que cualquier cheque.
          </p>
          <p className="font-semibold">
            Y porque todos fuimos diseñados para crear, no para ser engranajes.
          </p>
        </div>

        {/* Separator */}
        <div className="w-24 h-1 bg-white/30 mx-auto mb-8"></div>

        <p className="text-lg text-white/80 text-center mb-16 italic">
          Si crees lo mismo... sigue leyendo.
        </p>

        {/* Video Player */}
        <div id="video" className="scroll-mt-24">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              {!isVideoLoaded && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <PlayCircle className="w-20 h-20 text-white/80" />
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
            <p className="text-center text-white/70 mt-4">
              Así funciona CreaTuActivo en menos de 2 minutos
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// SECCIÓN 4: FRAMEWORK IAA (HOW)
// ============================================================================

function FrameworkIAASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Eyebrow */}
        <p className="text-sm uppercase tracking-wider text-purple-600 font-semibold mb-4 text-center">
          El Rediseño
        </p>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6 font-serif">
          De la Edad de Piedra a 2025
        </h2>

        {/* Subheadline */}
        <div className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16 space-y-2">
          <p>Durante 12 años construimos con herramientas manuales.</p>
          <p>Funcionó. Pero era lento, complejo, y dependía 100% de ti.</p>
          <p className="font-semibold text-gray-900">Entonces rediseñamos CÓMO se construye.</p>
          <p className="text-purple-600 font-semibold">No el producto. El PROCESO.</p>
        </div>

        {/* Comparativa ANTES / AHORA / IMPACTO */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* ANTES */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🧱</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">ANTES</h3>
            <p className="text-sm text-gray-600 mb-6">(Edad de Piedra)</p>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Llamadas manuales</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Seguimientos en Excel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Presentaciones cara a cara</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Tú educas cada prospecto</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Tú calificas manualmente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Tú haces seguimiento 24/7</span>
              </li>
            </ul>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <p className="font-semibold text-red-900">RESULTADO:</p>
              <p className="text-red-700">Agotamiento. Límite de escala.</p>
            </div>
          </div>

          {/* AHORA */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-300 rounded-2xl p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">AHORA</h3>
            <p className="text-sm text-purple-600 mb-6">(Framework IAA)</p>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>NEXUS IA educa automáticamente</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Califica prospectos en tiempo real (interés 0-10)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>NodeX Dashboard centraliza todo tu ecosistema</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Sistema trabaja mientras duermes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Tú intervienes SOLO cuando prospecto está listo</span>
              </li>
            </ul>
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <p className="font-semibold text-green-900">RESULTADO:</p>
              <p className="text-green-700">80% automatizado. Escalabilidad exponencial.</p>
            </div>
          </div>

          {/* IMPACTO REAL */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">IMPACTO REAL</h3>
            <div className="space-y-6">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Antes:</p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• 10 prospectos/semana (manual)</li>
                  <li>• 20 horas invertidas</li>
                  <li>• 2-3 conversiones</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Ahora:</p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• 100+ prospectos/semana (automatizados)</li>
                  <li>• 5 horas invertidas (solo calls estratégicas)</li>
                  <li>• 15-20 conversiones</li>
                </ul>
              </div>
              <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded">
                <p className="font-bold text-amber-900 text-lg">= 26 horas recuperadas/semana</p>
                <p className="text-amber-800 flex items-center gap-2 mt-2">
                  <Heart className="w-5 h-5" />
                  = Tiempo con tu familia
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Framework IAA - 3 Fases */}
        <div>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 font-serif">
            Framework IAA: 3 Fases Automatizadas
          </h3>

          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Fase 1: INICIAR */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-300 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">🎯</div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">FASE 1: INICIAR</h4>
                  <p className="text-gray-700 mb-4">
                    El prospecto llega a CreaTuActivo vía tu enlace personalizado.
                  </p>
                  <p className="font-semibold text-gray-900 mb-2">Sistema automáticamente:</p>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Identifica visitante (fingerprint)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Rastrea comportamiento</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Asigna a tu red</span>
                    </li>
                  </ul>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="font-semibold text-blue-900">TÚ haces: NADA (100% automático)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fase 2: ACOGER */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-300 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">🤝</div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">FASE 2: ACOGER</h4>
                  <p className="text-gray-700 mb-4">
                    NEXUS IA (chatbot inteligente) conversa con el prospecto.
                  </p>
                  <p className="font-semibold text-gray-900 mb-2">Sistema automáticamente:</p>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>Educa sobre modelo de negocio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>Responde objeciones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>Califica nivel de interés (0-10)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>Captura datos (nombre, email, teléfono)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>Detecta arquetipo (emprendedor, profesional, etc.)</span>
                    </li>
                  </ul>
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                    <p className="font-semibold text-purple-900">TÚ haces: NADA (NEXUS trabaja 24/7)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fase 3: ACTIVAR */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-300 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">🚀</div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">FASE 3: ACTIVAR</h4>
                  <p className="text-gray-700 mb-4">
                    Cuando prospecto está LISTO (interés 8-10/10), sistema te avisa.
                  </p>
                  <p className="font-semibold text-gray-900 mb-2">Sistema automáticamente:</p>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Notifica vía WhatsApp/Dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Entrega perfil completo del prospecto</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Sugiere mejor enfoque de cierre</span>
                    </li>
                  </ul>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <p className="font-semibold text-green-900">TÚ haces: Call estratégica (20 min)</p>
                    <p className="text-green-700 text-sm mt-1">Para cerrar Constructor/Fundador.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Callout Resultado Final */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-2xl p-8 mt-12 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="text-5xl">💡</div>
              <div>
                <p className="text-xl font-bold text-gray-900 mb-4">Resultado:</p>
                <div className="space-y-2 text-lg text-gray-700">
                  <p>Pasas de "perseguir 100 prospectos fríos" a "cerrar 15 prospectos calientes".</p>
                  <p>De 40 horas/semana a 5 horas/semana.</p>
                  <p className="font-bold text-purple-700 text-xl">
                    26 horas recuperadas = Tiempo con tu familia.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <a
              href="#formulario"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Quiero el sistema completo
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// SECCIÓN 5: QUÉ CONSTRUYES (WHAT - Tabla Comparativa)
// ============================================================================

function QueConstruyesSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Eyebrow */}
        <p className="text-sm uppercase tracking-wider text-purple-600 font-semibold mb-4 text-center">
          La Oportunidad
        </p>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6 font-serif">
          Qué Significa Ser Fundador
        </h2>

        {/* Subheadline */}
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16">
          No es solo "acceso anticipado".<br />
          Es convertirte en arquitecto del ecosistema que viene.
        </p>

        {/* 4 Beneficios Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Beneficio 1 */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-300 hover:shadow-lg transition-all">
            <div className="text-5xl mb-4">🏗️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Posicionamiento Estratégico</h3>
            <div className="space-y-3 text-gray-700">
              <p>Entras en la BASE de la arquitectura.</p>
              <p>
                Mientras el público general entra en enero 2026, tú construyes desde noviembre 2025.
              </p>
              <p className="font-semibold">Ventaja: 2 meses de red construida ANTES del lanzamiento público.</p>
              <p className="italic text-purple-600">Como comprar Bitcoin en 2010.</p>
            </div>
          </div>

          {/* Beneficio 2 */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-300 hover:shadow-lg transition-all">
            <div className="text-5xl mb-4">🛠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Acceso Tecnológico Total</h3>
            <div className="space-y-2 text-gray-700 mb-4">
              <p className="font-semibold">NodeX Dashboard completo desde día 1:</p>
              <ul className="space-y-1.5 ml-4">
                <li>• NEXUS IA (chatbot 24/7)</li>
                <li>• Panel de prospectos en tiempo real</li>
                <li>• Métricas de conversión automatizadas</li>
                <li>• CRM integrado</li>
                <li>• Enlace personalizado</li>
              </ul>
              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <p className="text-sm">Valor de mercado: <span className="line-through">$497/mes</span></p>
                <p className="font-bold text-purple-700">Fundadores: GRATIS de por vida</p>
              </div>
            </div>
          </div>

          {/* Beneficio 3 */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-300 hover:shadow-lg transition-all">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ventaja Económica Fundacional</h3>
            <div className="space-y-3 text-gray-700">
              <p>Recompensa superior VITALICIA por posición estratégica.</p>
              <p className="font-semibold">
                Ratio de mentoría: 1:150<br />
                <span className="text-sm font-normal">(Tú mentoreas máximo 150 Constructores)</span>
              </p>
              <p>Comisiones de red perpetuas.</p>
              <p className="font-semibold text-amber-700">
                Constructores que entren en enero 2026 NUNCA tendrán este ratio.
              </p>
            </div>
          </div>

          {/* Beneficio 4 */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-300 hover:shadow-lg transition-all">
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Mentoría Directa</h3>
            <div className="space-y-3 text-gray-700">
              <p>Acceso directo a Luis Cabrejo y equipo fundador durante 6 semanas.</p>
              <ul className="space-y-1.5 ml-4">
                <li>• Calls semanales de estrategia</li>
                <li>• Comunidad privada Fundadores</li>
                <li>• Material exclusivo (no público)</li>
                <li>• Primeros en recibir actualizaciones</li>
              </ul>
              <p className="text-sm bg-gray-100 p-3 rounded">
                Constructores públicos: Mentoría grupal masiva (1:22,500)
              </p>
            </div>
          </div>
        </div>

        {/* Tabla Comparativa */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8 font-serif">
            Fundador vs Constructor vs Público
          </h3>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <th className="p-4 text-left font-semibold">Característica</th>
                  <th className="p-4 text-center font-semibold bg-amber-500">FUNDADOR (150)</th>
                  <th className="p-4 text-center font-semibold">CONSTRUCTOR (22,500)</th>
                  <th className="p-4 text-center font-semibold">PÚBLICO (4M+)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold">Entrada</td>
                  <td className="p-4 text-center bg-amber-50 font-semibold">Nov 2025</td>
                  <td className="p-4 text-center">Ene 2026</td>
                  <td className="p-4 text-center">Ene 2026+</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold">NodeX Dashboard</td>
                  <td className="p-4 text-center bg-amber-50 font-semibold text-green-700">Gratis vitalicio ($497/mes valor)</td>
                  <td className="p-4 text-center">$97/mes</td>
                  <td className="p-4 text-center">$197/mes</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold">Mentoría</td>
                  <td className="p-4 text-center bg-amber-50 font-semibold text-green-700">Directa 1:150</td>
                  <td className="p-4 text-center">Grupal 1:22,500</td>
                  <td className="p-4 text-center">Autoservicio</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold">Posición red</td>
                  <td className="p-4 text-center bg-amber-50 font-semibold text-green-700">BASE (cima)</td>
                  <td className="p-4 text-center">Media</td>
                  <td className="p-4 text-center">Entrada tardía</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold">Comisiones</td>
                  <td className="p-4 text-center bg-amber-50 font-semibold text-green-700">Superiores vitalicias</td>
                  <td className="p-4 text-center">Estándar</td>
                  <td className="p-4 text-center">Estándar</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold">Comunidad</td>
                  <td className="p-4 text-center bg-amber-50 font-semibold text-green-700">Privada exclusiva</td>
                  <td className="p-4 text-center">General</td>
                  <td className="p-4 text-center">General</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {/* Fundador Card */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-400 rounded-2xl p-6">
              <h4 className="text-2xl font-bold text-amber-900 mb-4">FUNDADOR (150)</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Entrada:</span> Nov 2025</p>
                <p><span className="font-semibold">NodeX:</span> Gratis vitalicio</p>
                <p><span className="font-semibold">Mentoría:</span> Directa 1:150</p>
                <p><span className="font-semibold">Posición:</span> BASE (cima)</p>
                <p><span className="font-semibold">Comisiones:</span> Superiores vitalicias</p>
                <p><span className="font-semibold">Comunidad:</span> Privada exclusiva</p>
              </div>
            </div>

            {/* Constructor Card */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">CONSTRUCTOR (22,500)</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Entrada:</span> Ene 2026</p>
                <p><span className="font-semibold">NodeX:</span> $97/mes</p>
                <p><span className="font-semibold">Mentoría:</span> Grupal 1:22,500</p>
                <p><span className="font-semibold">Posición:</span> Media</p>
                <p><span className="font-semibold">Comisiones:</span> Estándar</p>
                <p><span className="font-semibold">Comunidad:</span> General</p>
              </div>
            </div>

            {/* Público Card */}
            <div className="bg-gray-100 border-2 border-gray-300 rounded-2xl p-6">
              <h4 className="text-2xl font-bold text-gray-700 mb-4">PÚBLICO (4M+)</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-semibold">Entrada:</span> Ene 2026+</p>
                <p><span className="font-semibold">NodeX:</span> $197/mes</p>
                <p><span className="font-semibold">Mentoría:</span> Autoservicio</p>
                <p><span className="font-semibold">Posición:</span> Entrada tardía</p>
                <p><span className="font-semibold">Comisiones:</span> Estándar</p>
                <p><span className="font-semibold">Comunidad:</span> General</p>
              </div>
            </div>
          </div>
        </div>

        {/* Callout Urgencia */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-400 rounded-2xl p-8 mt-12 max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚠️</div>
            <div>
              <p className="text-xl font-bold text-orange-900 mb-2">Ventana de oportunidad:</p>
              <p className="text-lg text-orange-800 mb-4">
                Solo 150 posiciones de Fundador.<br />
                Lista privada cierra: <span className="font-bold">16 de noviembre 2025</span>.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#formulario"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Reservar mi posición de Fundador
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

  useEffect(() => {
    // Actualizar cada 60 segundos (si quieres contador dinámico)
    const interval = setInterval(() => {
      // Aquí podrías llamar a API para obtener cupos reales
      // Por ahora, estático
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-32 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 relative overflow-hidden">
      {/* Textura */}
      <div className="absolute inset-0 opacity-5 bg-[url('/textures/noise.png')] mix-blend-overlay"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12 font-serif">
          150 Cupos. 3 Fases. Una Oportunidad.
        </h2>

        {/* Contador */}
        <div className="text-center mb-16">
          <div className="inline-block bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="text-6xl">🔥</div>
              <div className="text-7xl md:text-8xl font-black text-amber-400">
                {cuposDisponibles}
              </div>
              <div className="text-3xl text-white/70">/ 150</div>
            </div>
            <p className="text-xl text-white/80">cupos disponibles</p>
            {cuposDisponibles > 100 && (
              <p className="text-sm text-green-400 mt-2">Fase de entrada temprana</p>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Fase 1 */}
            <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl p-8 text-white">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-2xl font-bold mb-2">FASE 1</h3>
              <p className="text-lg font-semibold text-amber-300 mb-4">Lista Privada</p>
              <p className="text-sm text-white/70 mb-4">Nov 17 - Dic 27, 2025</p>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">150 Fundadores</p>
                <ul className="space-y-1 text-white/80 ml-4">
                  <li>• Mentoría 1:150</li>
                  <li>• 6 semanas intensivas</li>
                  <li>• Construyes base</li>
                </ul>
              </div>
              <div className="mt-4 bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold inline-block">
                TÚ ESTÁS AQUÍ
              </div>
            </div>

            {/* Fase 2 */}
            <div className="bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-8 text-white/70">
              <div className="text-5xl mb-4 opacity-70">🎓</div>
              <h3 className="text-2xl font-bold mb-2">FASE 2</h3>
              <p className="text-lg font-semibold mb-4">Pre-Lanzamiento</p>
              <p className="text-sm mb-4">Ene 5 - Feb 28, 2026</p>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">22,500 Constructores</p>
                <ul className="space-y-1 ml-4">
                  <li>• Mentoría grupal</li>
                  <li>• Pre-público</li>
                  <li>• Ventaja vs masivo</li>
                </ul>
              </div>
            </div>

            {/* Fase 3 */}
            <div className="bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-8 text-white/70">
              <div className="text-5xl mb-4 opacity-70">🚀</div>
              <h3 className="text-2xl font-bold mb-2">FASE 3</h3>
              <p className="text-lg font-semibold mb-4">Lanzamiento Público</p>
              <p className="text-sm mb-4">Mar 1, 2026 →</p>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">4M+ Usuarios (objetivo)</p>
                <ul className="space-y-1 ml-4">
                  <li>• Autoservicio</li>
                  <li>• Público general</li>
                  <li>• Entrada tardía</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Deadline Callout */}
        <div className="bg-amber-500 text-black rounded-2xl p-8 mt-16 max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <Clock className="w-10 h-10 flex-shrink-0" />
            <div>
              <p className="text-xl font-bold mb-2">Fecha límite:</p>
              <p className="text-2xl font-black mb-3">16 de noviembre 2025 a las 23:59 (UTC-5)</p>
              <p className="text-sm">
                Después de esa fecha, solo podrás entrar como Constructor (enero 2026).<br />
                Posición de Fundador no estará disponible NUNCA más.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#formulario"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black px-10 py-5 rounded-xl font-bold text-xl shadow-2xl hover:shadow-amber-500/50 hover:-translate-y-1 transition-all duration-300"
          >
            No quiero perder mi cupo
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// SECCIÓN 7: FORMULARIO
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
    // Aquí enviar a /api/fundadores
    console.log('Formulario enviado:', formData)
  }

  return (
    <section id="formulario" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-3xl mx-auto px-6">
        {/* Eyebrow */}
        <p className="text-sm uppercase tracking-wider text-purple-600 font-semibold mb-4 text-center">
          Último Paso
        </p>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6 font-serif">
          Reserva Tu Posición de Fundador
        </h2>

        {/* Subheadline */}
        <p className="text-lg text-gray-600 text-center mb-12">
          Completa este formulario en 2 minutos.<br />
          Revisaremos tu aplicación en 24 horas.
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Paso {paso} de 3</span>
            <span className="text-sm text-gray-500">{Math.round((paso / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(paso / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8">
          {/* PASO 1 */}
          {paso === 1 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Luis Cabrejo Moreno"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  placeholder="luis@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp (con código país) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+57 300 123 4567"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>

              <button
                type="button"
                onClick={() => setPaso(2)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Siguiente
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* PASO 2 */}
          {paso === 2 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Tu Perfil</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                    <label key={opcion} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="situacion"
                        value={opcion}
                        checked={formData.situacion === opcion}
                        onChange={(e) => setFormData({ ...formData, situacion: e.target.value })}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{opcion}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Por qué quieres ser Fundador? *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Comparte brevemente qué te motiva..."
                  value={formData.motivacion}
                  onChange={(e) => setFormData({ ...formData, motivacion: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  ¿Tienes experiencia en MLM o negocios de red? *
                </label>
                <div className="space-y-3">
                  {[
                    'Sí, actualmente activo',
                    'Sí, pero inactivo',
                    'No, sería mi primera vez'
                  ].map((opcion) => (
                    <label key={opcion} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="experienciaMLM"
                        value={opcion}
                        checked={formData.experienciaMLM === opcion}
                        onChange={(e) => setFormData({ ...formData, experienciaMLM: e.target.value })}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{opcion}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPaso(1)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-lg font-semibold transition-all"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setPaso(3)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Siguiente
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {paso === 3 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Confirmación</h3>

              {/* Resumen */}
              <div className="bg-white border-2 border-purple-200 rounded-lg p-6 space-y-3">
                <p><span className="font-semibold">📧 Nombre:</span> {formData.nombre}</p>
                <p><span className="font-semibold">✉️ Correo:</span> {formData.email}</p>
                <p><span className="font-semibold">📱 WhatsApp:</span> {formData.whatsapp}</p>
                <p><span className="font-semibold">👤 Perfil:</span> {formData.situacion}</p>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required className="mt-1 w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">
                    Entiendo que esta es una aplicación, no una garantía de cupo. El equipo CreaTuActivo revisará mi perfil en 24 horas.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required className="mt-1 w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">
                    Acepto recibir comunicaciones vía WhatsApp y correo sobre mi aplicación y el programa de Fundadores.
                  </span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPaso(2)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-lg font-semibold transition-all"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  Enviar mi aplicación
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
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

export default function FundadoresV2Page() {
  return (
    <div className="min-h-screen bg-white">
      <StrategicNavigation />

      <HeroSection />
      <HistoriaPersonalSection />
      <CreenciaCentralSection />
      <FrameworkIAASection />
      <QueConstruyesSection />
      <ContadorTimelineSection />
      <FormularioSection />

      {/* Footer simple */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-2xl font-serif mb-4">CreaTuActivo</p>
          <p className="text-gray-400 mb-6">
            Construyendo patrimonio en 2025.<br />
            No en la Edad de Piedra.
          </p>
          <p className="text-sm text-gray-500">
            © 2025 CreaTuActivo. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
