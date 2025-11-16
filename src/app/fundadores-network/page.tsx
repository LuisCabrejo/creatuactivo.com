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
import { CheckCircle, Zap, Target, Users, TrendingUp, Award, Calendar, Sparkles, MessageCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// --- Estilos CSS Globales ---
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

    .creatuactivo-h2-gradient {
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
  `}</style>
);

// --- Componente Principal ---
export default function FundadoresNetworkPage() {
  const [formStep, setFormStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    experiencia: '',
    rangoAnterior: '',
    motivacion: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formStep === 1) {
      setFormStep(2)
      return
    }

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
          page: 'fundadores-network',
          arquetipo: `Networker: ${formData.experiencia}`
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
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
          {/* Hero Section */}
          <section className="pt-20 text-center max-w-4xl mx-auto py-20 lg:py-32">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-block px-6 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-8">
                <p className="text-purple-300 font-semibold text-sm">Para Networkers Profesionales</p>
              </div>

              <h1 className="creatuactivo-h1-ecosystem text-5xl md:text-7xl lg:text-8xl mb-12 leading-tight">
                Ya sabes cómo<br />funciona esto.
              </h1>

              <div className="space-y-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                <p>Has construido equipos. Has movido producto. Conoces el plan de compensación.</p>
                <p className="text-white font-semibold text-2xl">Ahora imagina tener tecnología que trabaje como tú.</p>
              </div>
            </motion.div>
          </section>

          {/* La Diferencia - Direct Speak */}
          <section className="max-w-5xl mx-auto mb-20 lg:mb-32">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 lg:p-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 text-center">
                Tú ya sabes la verdad del network
              </h2>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Lo que funciona */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                    <CheckCircle size={24} />
                    Lo que SÍ funciona:
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 font-bold">✓</span>
                      <span>Producto con patente mundial (Gano Excel, 30+ años)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 font-bold">✓</span>
                      <span>Plan de compensación binario comprobado</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 font-bold">✓</span>
                      <span>Ingreso residual real por consumo recurrente</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 font-bold">✓</span>
                      <span>Duplicación simple (cualquiera puede aprender)</span>
                    </li>
                  </ul>
                </div>

                {/* Lo que falta */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                    <Zap size={24} />
                    Lo que FALTABA (hasta ahora):
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 font-bold">✗</span>
                      <span>Tecnología profesional (no grupos de WhatsApp)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 font-bold">✗</span>
                      <span>IA que responde objeciones 24/7</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 font-bold">✗</span>
                      <span>Sistema que califica prospectos automáticamente</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 font-bold">✗</span>
                      <span>Plataforma completa para escalar sin frenar</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center pt-8 border-t border-slate-700">
                <p className="text-2xl font-bold text-white mb-4">
                  Eso cambia hoy.
                </p>
                <p className="text-lg text-slate-300">
                  Gano Excel + CreaTuActivo = El network marketing como debió ser desde el inicio.
                </p>
              </div>
            </div>
          </section>

          {/* NEXUS para Networkers */}
          <section className="max-w-5xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                NEXUS: Tu Mejor Auspiciador
              </h2>
              <p className="text-xl text-slate-400">
                Trabajando 24/7. Nunca cansado. Siempre profesional.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="creatuactivo-component-card p-6">
                <MessageCircle className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Responde Objeciones</h3>
                <p className="text-slate-300 text-sm">
                  "¿Es pirámide?" "¿Gano Excel funciona?" "¿Cuánto se gana?" NEXUS responde profesionalmente, con datos reales.
                </p>
              </div>

              <div className="creatuactivo-component-card p-6">
                <Target className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Califica Prospectos</h3>
                <p className="text-slate-300 text-sm">
                  Identifica quién tiene interés real vs quién solo pregunta. Te dice a quién llamar primero.
                </p>
              </div>

              <div className="creatuactivo-component-card p-6">
                <Users className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Duplica Tu Método</h3>
                <p className="text-slate-300 text-sm">
                  Tu equipo usa el mismo NEXUS. Mismos mensajes. Misma calidad. Cero capacitación.
                </p>
              </div>
            </div>

            <div className="mt-12 p-8 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
              <p className="text-xl text-white font-semibold mb-3">
                Imagina tener 100 prospectos hablando con NEXUS al mismo tiempo.
              </p>
              <p className="text-lg text-slate-300">
                Mientras tú duermes, entrenas, o llamas solo a los que NEXUS ya calificó.
              </p>
            </div>
          </section>

          {/* Si Conoces la Industria */}
          <section className="max-w-4xl mx-auto mb-20 lg:mb-32">
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-8 lg:p-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 text-center">
                Si conoces la industria...
              </h2>

              <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                <p>
                  <span className="text-white font-semibold">Ya conoces el producto.</span> Sabes que funciona. Sabes que Gano Excel tiene 30+ años sin deudas.
                </p>

                <p>
                  <span className="text-white font-semibold">Ya conoces el plan.</span> Binario. Simple. Justo. Los mismos bonos que siempre.
                </p>

                <p className="text-white font-bold text-2xl pt-4">
                  Entonces ¿por qué es ahora diferente?
                </p>

                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <Zap className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-white mb-1">1. Ahora tienes NEXUS</p>
                      <p className="text-sm text-slate-400">IA que responde, califica, y convierte. 24/7. En español.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Target className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-white mb-1">2. Ahora tienes plataforma completa</p>
                      <p className="text-sm text-slate-400">Academia, comunidad, calculadoras, páginas de captura. Todo profesional.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Users className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-white mb-1">3. Eres Fundador (no solo distribuidor)</p>
                      <p className="text-sm text-slate-400">Los primeros 150. Construyes con tecnología desde el día 1.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <TrendingUp className="w-8 h-8 text-orange-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-white mb-1">4. Duplicación real</p>
                      <p className="text-sm text-slate-400">Tu equipo no necesita ser experto. NEXUS hace el trabajo técnico.</p>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xl font-bold text-purple-400 pt-6">
                  Mismo Gano Excel. Mismo plan. Nueva era.
                </p>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="max-w-5xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                La Ventana de Oportunidad
              </h2>
              <p className="text-slate-400 text-lg">
                Solo 150 espacios para Fundadores. Cierra 30 de noviembre 2025.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="creatuactivo-component-card p-6 text-center">
                <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Lista Privada</h3>
                <p className="text-sm text-slate-400 mb-3">10 Nov - 30 Nov 2025</p>
                <p className="text-slate-300">150 Fundadores (tú estás aquí)</p>
              </div>

              <div className="creatuactivo-component-card p-6 text-center">
                <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Pre-Lanzamiento</h3>
                <p className="text-sm text-slate-400 mb-3">01 Dic 2025 - 01 Mar 2026</p>
                <p className="text-slate-300">22,500 Constructores (tu equipo)</p>
              </div>

              <div className="creatuactivo-component-card p-6 text-center">
                <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Lanzamiento Público</h3>
                <p className="text-sm text-slate-400 mb-3">02 Mar 2026</p>
                <p className="text-slate-300">Expansión Latinoamérica</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30 text-center">
              <p className="text-white font-semibold text-lg">
                <span className="text-yellow-400">Ventaja de Fundador:</span> Construyes tu equipo ANTES del lanzamiento público, con NEXUS trabajando desde el inicio.
              </p>
            </div>
          </section>

          {/* Formulario */}
          <section id="formulario" className="max-w-4xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Solicita tu espacio
              </h2>
              <p className="text-xl text-slate-400 mb-4">
                150 espacios. Solo para networkers que ya conocen el juego.
              </p>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Revisaré personalmente cada aplicación. Si tu experiencia califica, recibirás invitación en 24 horas.
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
                <span>Tus Datos</span>
                <span>Tu Experiencia</span>
              </div>
            </div>

            {/* Form */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 max-w-2xl mx-auto">
              <form onSubmit={handleSubmit}>
                {/* Paso 1 */}
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

                {/* Paso 2 */}
                {formStep === 2 && (
                  <div className="space-y-8">
                    <div>
                      <div className="text-amber-400 font-bold text-lg mb-4 pb-2 border-b border-slate-700">
                        Tu experiencia en network marketing
                      </div>
                      <div className="space-y-3">
                        {[
                          'Ex Gano Excel (quiero regresar con tecnología)',
                          'Actualmente en otra empresa de network',
                          'He estado en 2-3 empresas de MLM',
                          'He estado en 4+ empresas de network',
                          'Soy nuevo pero he investigado el modelo'
                        ].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({...formData, experiencia: option})}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${
                              formData.experiencia === option
                                ? 'bg-blue-500/20 border-blue-500 text-white'
                                : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-blue-500/50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-amber-400 font-bold text-lg mb-4 pb-2 border-b border-slate-700">
                        ¿Alcanzaste algún rango de liderazgo?
                      </div>
                      <div className="space-y-3">
                        {[
                          'Sí, llegué a rango medio-alto (Diamante, Esmeralda, etc.)',
                          'Sí, rangos iniciales (Plata, Oro, etc.)',
                          'Construí equipo pero sin rango formal',
                          'No alcancé rangos (consumidor/distribuidor)',
                          'Prefiero explicarlo en la llamada'
                        ].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({...formData, rangoAnterior: option})}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${
                              formData.rangoAnterior === option
                                ? 'bg-blue-500/20 border-blue-500 text-white'
                                : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-blue-500/50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-amber-400 font-bold text-lg mb-4 pb-2 border-b border-slate-700">
                        ¿Por qué te interesa CreaTuActivo?
                      </div>
                      <textarea
                        value={formData.motivacion}
                        onChange={(e) => setFormData({...formData, motivacion: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="Cuéntame brevemente qué te atrae de esta oportunidad..."
                        rows={4}
                        required
                      />
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
                        disabled={isSubmitting || !formData.experiencia || !formData.rangoAnterior || !formData.motivacion}
                        className="flex-1 creatuactivo-cta-ecosystem text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Enviando...' : 'Solicitar Espacio'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-slate-500">
                Sin compromiso · Respuesta en 24 horas · Solo 150 espacios disponibles
              </p>
            </div>
          </section>

          {/* Final CTA */}
          <section className="max-w-3xl mx-auto mb-20 text-center">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-purple-500/30 rounded-2xl p-12">
              <Award className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Tú ya sabes cómo funciona.
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Duplicación. Residual. Binario. Patente mundial.<br />
                Ahora con la tecnología que siempre debió existir.
              </p>
              <a href="#formulario" className="creatuactivo-cta-ecosystem text-xl inline-flex items-center">
                Solicitar Espacio Ahora <ArrowRight size={24} className="ml-2" />
              </a>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
            <p className="mt-2">Gano Excel + Tecnología Profesional = Nueva Era del Network Marketing</p>
          </div>
        </footer>
      </div>
    </>
  )
}
