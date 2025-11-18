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

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Zap, PlayCircle, Briefcase, Building2, TrendingUp, Lightbulb, Home, UsersRound } from 'lucide-react'
import Link from 'next/link'

// --- Estilos CSS Globales (Desde Guía de Branding v4.2) ---
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --creatuactivo-blue: #1E40AF;
      --creatuactivo-purple: #7C3AED;
      --creatuactivo-gold: #F59E0B;
    }

    .creatuactivo-h1-ecosystem {
      font-weight: 800;
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 50%, var(--creatuactivo-gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.1;
      letter-spacing: -0.03em;
    }

    .creatuactivo-h2-component {
        font-weight: 700;
        background: linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .creatuactivo-component-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }

    .creatuactivo-component-card:hover {
      transform: translateY(-8px);
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2);
    }

    .creatuactivo-cta-ecosystem {
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 100%);
      border-radius: 16px;
      padding: 18px 36px;
      font-weight: 700;
      color: white;
      transition: all 0.3s ease;
      box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
    }

    .creatuactivo-cta-ecosystem:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(30, 64, 175, 0.5);
    }

    .before-card {
      background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(153, 27, 27, 0.1) 100%);
      border: 2px solid rgba(220, 38, 38, 0.3);
    }

    .after-card {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%);
      border: 2px solid rgba(34, 197, 94, 0.3);
    }
  `}</style>
);

// Arquetipos (mismos de fundadores)
const arquetipos = [
  {
    id: 'profesional',
    icon: <Briefcase size={24} />,
    title: 'Profesional Corporativo',
    description: 'Para diversificar ingresos más allá del empleo.',
    iconColor: 'text-blue-400'
  },
  {
    id: 'emprendedor',
    icon: <Building2 size={24} />,
    title: 'Emprendedor con Negocio',
    description: 'Para escalar sin proporcional crecimiento operativo.',
    iconColor: 'text-orange-400'
  },
  {
    id: 'independiente',
    icon: <Lightbulb size={24} />,
    title: 'Independiente y Freelancer',
    description: 'Para convertir el talento en un activo escalable.',
    iconColor: 'text-purple-400'
  },
  {
    id: 'lider-hogar',
    icon: <Home size={24} />,
    title: 'Líder del Hogar',
    description: 'Para construir con flexibilidad y propósito.',
    iconColor: 'text-pink-400'
  },
  {
    id: 'lider-comunidad',
    icon: <UsersRound size={24} />,
    title: 'Líder de la Comunidad',
    description: 'Para transformar tu influencia en un legado tangible.',
    iconColor: 'text-green-400'
  },
  {
    id: 'joven-ambicioso',
    icon: <TrendingUp size={24} />,
    title: 'Joven con Ambición',
    description: 'Para construir un activo antes de empezar una carrera.',
    iconColor: 'text-cyan-400'
  }
]

// --- Componente Principal ---
export default function FundadoresProfesionalesPage() {
  const [formStep, setFormStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    arquetipo: '',
    inversion: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formStep === 1) {
      setFormStep(2)
      return
    }

    // Enviar formulario
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/fundadores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          page: 'fundadores-profesionales'
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Redirigir a página de confirmación
        window.location.href = `/ecosistema?fundador=true&email=${encodeURIComponent(formData.email)}`
      } else {
        throw new Error(result.error || 'Error en la solicitud')
      }
    } catch (error) {
      console.error('Error:', error)
      alert(`Hubo un error al enviar tu solicitud, ${formData.nombre}. Por favor intenta de nuevo o contáctanos por WhatsApp al +57 310 206 6593.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-900 text-white min-h-screen">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-[var(--creatuactivo-blue)] opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-[var(--creatuactivo-purple)] opacity-10 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        {/* Main Content */}
        <main className="relative z-10 p-4 lg:p-8">
          {/* Hero Section - Steve Jobs Style */}
          <section className="pt-20 text-center max-w-4xl mx-auto py-20 lg:py-32">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="creatuactivo-h1-ecosystem text-5xl md:text-7xl lg:text-8xl mb-12 leading-tight">
                Hay una forma<br />mejor.
              </h1>
              <div className="space-y-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                <p>Has trabajado años construyendo la carrera de otro.</p>
                <p className="text-slate-300">Es hora de construir la tuya.</p>
              </div>
            </motion.div>
          </section>

          {/* The Problem - Hybrid: Jobs + Emotional Punch */}
          <section className="max-w-3xl mx-auto mb-20 lg:mb-32">
            <div className="space-y-6 text-lg md:text-xl text-slate-400 leading-relaxed">
              <p>Cada día te levantas, vas a la oficina, haces el trabajo.</p>

              <div className="py-6">
                <p className="text-slate-300 text-xl md:text-2xl font-semibold mb-2">He escuchado a empleados decir:</p>
                <p className="text-yellow-400 text-2xl md:text-3xl font-bold italic">
                  "Mi única esperanza para ganar más es que el gerente se muera o renuncie."
                </p>
              </div>

              <p className="text-slate-300 font-semibold">¿Te suena familiar?</p>

              <p>Esperas el ascenso que nunca llega.</p>
              <p>Temes el recorte que podría llegar mañana.</p>

              <p className="text-slate-300 font-semibold pt-4">Y piensas: "Debería hacer algo diferente."</p>
              <p className="text-slate-500 italic">"Pero ¿con qué tiempo? ¿Con qué dinero?"</p>

              <div className="pt-8 border-t border-slate-800 mt-8">
                <p className="text-white text-2xl md:text-3xl font-semibold">Había que elegir: tu trabajo o tu futuro.</p>
                <p className="text-white text-2xl md:text-3xl font-bold mt-2">Ya no.</p>
              </div>
            </div>
          </section>

          {/* Technology Pattern - Jobs Keynote Style */}
          <section className="max-w-4xl mx-auto mb-20 lg:mb-32 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-16">
              Recuerdas cuando...
            </h2>

            <div className="space-y-8 text-2xl md:text-3xl text-slate-400">
              <p>Netflix. Spotify. WhatsApp.</p>
              <p className="text-slate-300">Tomaron lo imposible y lo hicieron obvio.</p>
            </div>

            <div className="mt-16 pt-16 border-t border-slate-800">
              <p className="text-3xl md:text-4xl font-bold text-white">
                ¿Y si hacer crecer tus ingresos<br />fuera igual de simple?
              </p>
            </div>
          </section>

          {/* Jobs-Style Comparison Table */}
          <section className="max-w-5xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Había una forma vieja.
              </h2>
              <h2 className="text-4xl md:text-6xl font-bold creatuactivo-h1-ecosystem">
                Ahora hay una forma nueva.
              </h2>
            </div>

            {/* Comparison Table - Minimal Design */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 divide-x divide-slate-700/50">
                {/* LA FORMA VIEJA */}
                <div className="p-8 md:p-12">
                  <h3 className="text-xl font-bold text-slate-400 mb-8 pb-4 border-b border-slate-700/50">La forma vieja</h3>
                  <ul className="space-y-6 text-slate-400 text-lg">
                    <li>Depender de otros</li>
                    <li>Negocio físico, préstamos, riesgo</li>
                    <li>Tu tiempo o tu dinero</li>
                    <li>Solo tú</li>
                  </ul>
                </div>

                {/* LA FORMA NUEVA */}
                <div className="p-8 md:p-12 bg-gradient-to-br from-blue-950/20 to-purple-950/20">
                  <h3 className="text-xl font-bold text-white mb-8 pb-4 border-b border-slate-700/50">La forma nueva</h3>
                  <ul className="space-y-6 text-white text-lg font-medium">
                    <li>Tú decides</li>
                    <li>Desde tu celular</li>
                    <li>2 horas al día</li>
                    <li>Equipo completo</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* One More Thing - Jobs Signature Move CON EFECTOS SUTILES */}
          <section className="max-w-4xl mx-auto mb-20 lg:mb-32 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-16">
              ¿Qué tan simple?
            </h2>

            <div className="space-y-6 text-left max-w-2xl mx-auto">
              {/* Paso 1 */}
              <div className="group flex items-start gap-6 p-8 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-yellow-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="text-5xl font-bold bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent">1</div>
                <p className="text-xl text-slate-300 pt-3 group-hover:text-white transition-colors duration-300">Compartes un enlace</p>
              </div>

              {/* Paso 2 */}
              <div className="group flex items-start gap-6 p-8 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-yellow-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="text-5xl font-bold bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent">2</div>
                <p className="text-xl text-slate-300 pt-3 group-hover:text-white transition-colors duration-300">Entregas el sistema completo</p>
              </div>

              {/* Paso 3 */}
              <div className="group flex items-start gap-6 p-8 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-yellow-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="text-5xl font-bold bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent">3</div>
                <p className="text-xl text-slate-300 pt-3 group-hover:text-white transition-colors duration-300">NodeX hace el resto</p>
              </div>
            </div>

            <div className="mt-16 pt-16 border-t border-slate-800">
              <p className="text-3xl md:text-4xl font-bold text-white">
                Eso es todo.
              </p>
            </div>
          </section>

          {/* Video Section - La Pregunta de Bezos */}
          <section className="max-w-5xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                La pregunta que Jeff Bezos<br />respondió diferente.
              </h2>
              <p className="text-xl text-slate-400">
                Y que cambiará cómo ves esta oportunidad.
              </p>
            </div>

            <div className="relative group rounded-2xl overflow-hidden bg-slate-800/30 backdrop-blur-sm border border-slate-700/50">
              <video
                controls
                poster={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_POSTER}
                preload="metadata"
                className="w-full aspect-video"
              >
                {process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P && (
                  <source src={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P} type="video/mp4" />
                )}
                {process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_720P && (
                  <source src={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_720P} type="video/mp4" />
                )}
                <div className="flex flex-col items-center justify-center p-8 bg-slate-900">
                  <p className="text-slate-400 mb-4">
                    Tu navegador no soporta la reproducción de video.
                  </p>
                  {process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P && (
                    <a
                      href={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P}
                      className="creatuactivo-cta-ecosystem"
                      download
                    >
                      Descargar Video
                    </a>
                  )}
                </div>
              </video>

              {!process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none">
                  <PlayCircle size={80} className="text-white/50 group-hover:text-white/80 transition-all duration-300 mb-4" />
                  <h3 className="text-2xl lg:text-4xl font-bold mb-2 text-white">La pregunta de Bezos</h3>
                  <p className="text-slate-300 max-w-xl">Y que cambiará cómo ves esta oportunidad.</p>
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                Duración: 1:03 min
              </p>
            </div>

            {/* Bezos Question Card - CON fondo de imagen */}
            <div className="mt-12 relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 lg:p-12 text-center">
              {/* Fondo de imagen con overlay */}
              <div className="absolute inset-0 opacity-10">
                <img
                  src="/images/fondo.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/80"></div>

              {/* Contenido */}
              <div className="relative z-10">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 leading-tight">
                  ¿Jeff Bezos se hizo rico vendiendo libros<br />
                  o construyendo el SISTEMA donde se venden millones de productos diarios?
                </h3>

                <p className="text-xl font-bold text-blue-400 mb-6">
                  Exacto. Construyó el sistema.
                </p>

                <div className="text-base lg:text-lg text-slate-300 space-y-4 leading-relaxed max-w-3xl mx-auto">
                  <p>
                    Nosotros aplicamos la misma filosofía.
                  </p>

                  <p>
                    No te damos un catálogo para que vayas a vender productos.
                  </p>

                  <p>
                    Te damos <strong className="text-amber-400">NodeX</strong>: tu aplicación personal para construir tu propio sistema de distribución, donde se distribuyen productos de <strong className="text-white">Gano Excel</strong> todos los días.
                  </p>

                  <p className="text-lg lg:text-xl font-semibold text-blue-400 pt-4">
                    Igual que Bezos.<br />
                    Pero esto es tuyo.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="max-w-5xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">
                La Ventana de Oportunidad
              </h2>
              <p className="text-slate-400 text-lg">
                Solo 150 espacios para profesionales que quieren construir su independencia financiera.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Phase 1 */}
              <div className="creatuactivo-component-card p-6 text-center">
                <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Lista Privada</h3>
                <p className="text-sm text-slate-400 mb-3">10 Nov - 30 Nov 2025</p>
                <p className="text-slate-300">150 espacios para Fundadores</p>
              </div>

              {/* Phase 2 */}
              <div className="creatuactivo-component-card p-6 text-center">
                <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Pre-Lanzamiento</h3>
                <p className="text-sm text-slate-400 mb-3">01 Dic 2025 - 01 Mar 2026</p>
                <p className="text-slate-300">22,500 espacios para Constructores</p>
              </div>

              {/* Phase 3 */}
              <div className="creatuactivo-component-card p-6 text-center">
                <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Lanzamiento Público</h3>
                <p className="text-sm text-slate-400 mb-3">02 Mar 2026</p>
                <p className="text-slate-300">Expansión Latinoamérica</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30">
              <p className="text-center text-white font-semibold text-lg">
                Estás aquí: <span className="text-yellow-400">Lista Privada</span> → Eres parte de los primeros 150.
              </p>
            </div>
          </section>

          {/* Formulario Section */}
          <section id="formulario" className="max-w-4xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                150 espacios.
              </h2>
              <p className="text-xl text-slate-400 mb-4">
                Cierra 30 de noviembre.
              </p>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Revisaré personalmente cada aplicación. Si tu visión se alinea con la de un Arquitecto Fundador, recibirás una invitación en las próximas 24 horas.
              </p>
            </div>

            {/* Progress indicator */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6 max-w-md mx-auto">
                {[1, 2].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                      formStep >= step
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500'
                        : 'bg-slate-800 text-slate-400 border-slate-600'
                    }`}>
                      {step}
                    </div>
                    {step !== 2 && (
                      <div className={`flex-1 h-1 mx-4 ${
                        formStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-slate-700'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-slate-400 max-w-md mx-auto">
                <span>Información Base</span>
                <span>Tu Perfil</span>
              </div>
            </div>

            {/* Form */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 max-w-2xl mx-auto">
              <form onSubmit={handleSubmit}>
                {/* Paso 1: Información Base */}
                {formStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Nombre Completo</label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Correo Electrónico</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">WhatsApp</label>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="+57 300 123 4567"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full creatuactivo-cta-ecosystem text-lg py-4"
                    >
                      Continuar
                    </button>
                  </div>
                )}

                {/* Paso 2: Perfil */}
                {formStep === 2 && (
                  <div className="space-y-8">
                    <div>
                      <div className="text-amber-400 font-bold text-lg mb-4 pb-2 border-b border-slate-700">
                        ¿Cuál describe mejor tu situación actual?
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {arquetipos.map((arquetipo) => (
                          <button
                            key={arquetipo.id}
                            type="button"
                            onClick={() => setFormData({...formData, arquetipo: arquetipo.title})}
                            className={`text-left p-4 rounded-lg border transition-all duration-300 flex items-start gap-3 ${
                              formData.arquetipo === arquetipo.title
                                ? 'bg-blue-500/20 border-blue-500 text-white'
                                : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-blue-500/50'
                            }`}
                          >
                            <div className={`${arquetipo.iconColor} mt-1`}>
                              {arquetipo.icon}
                            </div>
                            <div>
                              <div className="font-semibold text-white mb-1">{arquetipo.title}</div>
                              <div className="text-sm text-slate-400">{arquetipo.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-amber-400 font-bold text-lg mb-4 pb-2 border-b border-slate-700">
                        Nivel de inversión que consideras
                      </div>
                      <div className="space-y-3">
                        {[
                          'Constructor Inicial - $900,000 COP (~$200 USD)',
                          'Constructor Estratégico - $2,250,000 COP (~$500 USD)',
                          'Constructor Visionario - $4,500,000 COP (~$1,000 USD)',
                          'Prefiero asesoría sobre la mejor opción'
                        ].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({...formData, inversion: option})}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${
                              formData.inversion === option
                                ? 'bg-blue-500/20 border-blue-500 text-white'
                                : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-blue-500/50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setFormStep(1)}
                        className="flex-1 px-6 py-4 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        Atrás
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.arquetipo || !formData.inversion}
                        className="flex-1 creatuactivo-cta-ecosystem text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Enviando...' : 'Solicitar Consultoría'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-slate-500">
                Sin compromiso · Respuesta en 24 horas
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
