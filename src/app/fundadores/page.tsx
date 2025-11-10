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
import { ArrowRight, CheckCircle, PlayCircle, Rocket, Shield, Users, Zap, Briefcase, Target, Lightbulb, Home, UsersRound, TrendingUp, Timer } from 'lucide-react'
import StrategicNavigation from '@/components/StrategicNavigation'

// Componente para tarjetas de beneficios
function BenefitCard({ icon, title, description, color }: {
  icon: React.ReactNode
  title: string
  description: string
  color: 'blue' | 'purple' | 'green' | 'orange'
}) {
  const colorMap = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    orange: 'text-orange-400'
  }

  return (
    <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-amber-500/30 rounded-3xl shadow-2xl hover:shadow-amber-500/25 hover:-translate-y-1 transition-all duration-300 p-8 h-full">
      <div className={`mb-6 ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}

/**
 * Calcula los cupos disponibles
 * AJUSTE MANUAL: Retorna 150 cupos estáticos hasta recibir actualización
 * - Luis actualizará esta noche con el dato real
 */
function calcularCuposDisponibles(): number {
  // TEMPORAL: Retornar 150 cupos estáticos
  // TODO: Luis actualizará con el número real esta noche
  return 150
}

// Arquetipos actualizados del sitio web
const arquetipos = [
  {
    id: 'profesional',
    icon: <Briefcase size={24} />,
    title: 'Profesional con Visión',
    description: 'Para construir un activo, no solo una carrera.',
    iconColor: 'text-blue-400'
  },
  {
    id: 'emprendedor',
    icon: <Target size={24} />,
    title: 'Emprendedor y Dueño de Negocio',
    description: 'Para escalar con un sistema, no con más tareas.',
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

// Componente principal
export default function FundadoresPage() {
  // Estado de cupos disponibles (dinámico)
  const [spotsLeft, setSpotsLeft] = useState(150)
  const [formStep, setFormStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    arquetipo: '',
    inversion: ''
  })

  // Actualizar cupos cada minuto y al montar el componente
  useEffect(() => {
    // Calcular cupos iniciales
    setSpotsLeft(calcularCuposDisponibles())

    // Actualizar cada minuto para detectar cambios de hora
    const interval = setInterval(() => {
      setSpotsLeft(calcularCuposDisponibles())
    }, 60000) // 60 segundos

    return () => clearInterval(interval)
  }, [])

  // Función de envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formStep === 1) {
      setFormStep(2)
      return
    }

    if (formStep === 2) {
      // Enviar formulario directamente desde paso 2
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
            page: 'fundadores'
          })
        })

        const result = await response.json()

        if (response.ok && result.success) {
          setIsSuccess(true)
          setFormStep(3) // Ir a pantalla de éxito
          console.log('Solicitud enviada:', result.emailId)
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
  }

  // Manejo de Enter en formularios
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && isStepValid()) {
      e.preventDefault()
      const form = e.currentTarget.closest('form')
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
        form.dispatchEvent(submitEvent)
      }
    }
  }

  const scrollToForm = () => {
    document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })
  }

  const isStepValid = () => {
    if (formStep === 1) {
      return formData.nombre && formData.email && formData.telefono
    }
    if (formStep === 2) {
      return formData.arquetipo && formData.inversion
    }
    return true
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <StrategicNavigation />

      {/* Fondo decorativo */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-64 -left-64 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-64 -right-64 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500 opacity-10 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <main className="relative z-10 px-4 lg:px-8">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto py-20 lg:py-32 pt-24">
          <div className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6 border border-purple-500/30">
            Una invitación para Pioneros
          </div>

          <h1 className="bg-gradient-to-br from-blue-700 via-purple-600 to-amber-500 bg-clip-text text-transparent text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Bienvenido a la Arquitectura del Futuro.
          </h1>

          <p className="text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Estás a un paso de ser Fundador del primer ecosistema tecnológico que automatiza el 80% del trabajo para que puedas construir un activo digital real, no solo un ingreso.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <button
              onClick={scrollToForm}
              className="bg-gradient-to-r from-blue-700 to-purple-600 text-white font-bold py-[18px] px-9 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 w-full md:w-auto text-lg flex items-center justify-center"
            >
              Reservar mi Cupo de Fundador <ArrowRight size={20} className="ml-2" />
            </button>
            <a href="/presentacion-empresarial" className="w-full md:w-auto bg-white/10 backdrop-blur-lg text-slate-300 font-semibold py-4 px-8 rounded-lg hover:bg-white/20 transition-colors duration-300 text-center">
              Ver Presentación Empresarial
            </a>
          </div>
        </section>

        {/* Video Hero - Optimizado con Vercel Blob */}
        <section className="max-w-5xl mx-auto mb-20">
          <div className="relative aspect-video bg-slate-800/50 rounded-2xl border border-white/10 shadow-2xl overflow-hidden group">
            <video
              className="w-full h-full object-cover"
              poster={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_POSTER || "https://placehold.co/1920x1080/0f172a/94a3b8?text=La+Nueva+Categoria"}
              controls
              preload="metadata"
              playsInline
              controlsList="nodownload"
            >
              {/* Fuente 4K para pantallas grandes (2K+) */}
              {process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_4K && (
                <source
                  src={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_4K}
                  type="video/mp4"
                  media="(min-width: 2560px)"
                />
              )}

              {/* Fuente 1080p para desktop (principal) */}
              {process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P && (
                <source
                  src={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P}
                  type="video/mp4"
                  media="(min-width: 1024px)"
                />
              )}

              {/* Fuente 720p para móviles y tablets */}
              {process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_720P && (
                <source
                  src={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_720P}
                  type="video/mp4"
                />
              )}

              {/* Fallback para navegadores que no soportan video */}
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <PlayCircle size={80} className="text-white/50 mb-4" />
                <p className="text-white mb-4">
                  Tu navegador no soporta la reproducción de video.
                </p>
                {process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P && (
                  <a
                    href={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P}
                    className="bg-gradient-to-r from-blue-700 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all"
                    download
                  >
                    Descargar Video
                  </a>
                )}
              </div>
            </video>

            {/* Overlay informativo (solo si no hay videos configurados) */}
            {!process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none">
                <PlayCircle size={80} className="text-white/50 group-hover:text-white/80 transition-all duration-300 mb-4" />
                <h2 className="text-2xl lg:text-4xl font-bold mb-2 text-white">Esto es diferente.</h2>
                <p className="text-slate-300 max-w-xl">Presiona play y descubre en 60 segundos por qué este ecosistema está redefiniendo las reglas del juego en América.</p>
              </div>
            )}
          </div>

          {/* Metadata del video para SEO */}
          <div className="mt-4 text-center">
            <p className="text-slate-400 text-sm">
              Video: Presentación del Ecosistema CreaTuActivo | Duración: 1:03 min
            </p>
          </div>
        </section>

        {/* Urgencia y Timeline */}
        <section className="max-w-5xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-2xl text-center p-6">
              <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">Cupos de Fundador Disponibles</p>
              <p className="text-6xl font-bold text-green-400 animate-pulse">{spotsLeft}</p>
              <p className="text-slate-400">de 150</p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">La Ventana de Oportunidad es Real</h3>
              <p className="text-slate-300 mb-6">Estamos en la fase exclusiva para Fundadores. Una vez que se abran las puertas al público, la oportunidad de tener una ventaja posicional como esta no volverá a existir.</p>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span>10 Nov - 30 Nov: Lista Privada</span>
                  <span className="text-slate-500">150 Fundadores</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>01 Dic - 01 Mar: Pre-Lanzamiento</span>
                  <span className="text-slate-500">150 Mentores → 22,500 Constructores</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>02 Mar 2026: Lanzamiento Público</span>
                  <span className="text-slate-500">4M+ en América</span>
                </div>
              </div>

              <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-6">
                <div className="bg-white/20 rounded-lg h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                    style={{width: `${(spotsLeft/150)*100}%`}}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-2 text-slate-400">
                  <span>Fundadores</span>
                  <span>Pre-Lanzamiento</span>
                  <span>Público</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section className="max-w-7xl mx-auto mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-white">El Valor de ser Pionero</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BenefitCard
              icon={<Rocket size={32}/>}
              title="Posicionamiento Estratégico"
              description="Tu activo se construye en la cima de la arquitectura. Todo el crecimiento futuro se apalanca desde tu base."
              color="blue"
            />
            <BenefitCard
              icon={<Zap size={32}/>}
              title="Acceso Tecnológico Total"
              description="Desbloquea el 100% del arsenal de NodeX desde el día cero. Una ventaja competitiva que nadie más tendrá."
              color="purple"
            />
            <BenefitCard
              icon={<Shield size={32}/>}
              title="Ventaja Económica Fundacional"
              description="Accede a un modelo de valor diseñado para recompensar de forma superior y vitalicia a quienes construyeron primero."
              color="green"
            />
            <BenefitCard
              icon={<Users size={32}/>}
              title="Co-Creación del Futuro"
              description="Tu feedback no solo será escuchado, moldeará la evolución del ecosistema. Serás un arquitecto, no un usuario."
              color="orange"
            />
          </div>
        </section>

        {/* Prueba de Confianza */}
        <section className="max-w-5xl mx-auto text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">Construido por Arquitectos, sobre una Base Sólida.</h2>
          <p className="text-slate-300 max-w-3xl mx-auto mb-12">Esta innovación no nace en el vacío. Es el resultado de 9 años de éxito probado, ahora potenciado por un socio corporativo con 30+ años de trayectoria global y una patente mundial que garantiza su unicidad.</p>

          <div className="flex justify-center gap-8">
            <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-2xl p-6 text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">9 Años</p>
              <p className="text-slate-400">de Liderazgo Probado</p>
            </div>
            <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-2xl p-6 text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">30+ Años</p>
              <p className="text-slate-400">de Respaldo Corporativo</p>
            </div>
          </div>
        </section>

        {/* Formulario */}
        <section id="formulario" className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
              Solicita tu Consultoría de
              <span className="bg-gradient-to-br from-blue-700 via-purple-600 to-amber-500 bg-clip-text text-transparent"> Fundador</span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Proceso de aplicación de 3 pasos. Nuestro equipo revisará tu perfil y, si se alinea con la visión, te contactaremos para agendar tu sesión estratégica exclusiva.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6 max-w-2xl mx-auto">
              {[1, 2, 3].map((step) => (
                <div key={step} className={`flex items-center ${step !== 3 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                    formStep >= step
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500'
                      : 'bg-slate-800 text-slate-400 border-slate-600'
                  }`}>
                    {formStep > step ? <CheckCircle size={16} /> : step}
                  </div>
                  {step !== 3 && (
                    <div className={`flex-1 h-1 mx-4 ${
                      formStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-slate-700'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-slate-400 max-w-2xl mx-auto">
              <span>Información Base</span>
              <span>Tu Perfil</span>
              <span>Confirmación</span>
            </div>
          </div>

          {/* Formulario container */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-amber-500/30 rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>

              {/* Paso 1: Información Base */}
              {formStep === 1 && (
                <div className="space-y-6" onKeyDown={handleKeyDown}>
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
                </div>
              )}

              {/* Paso 2: Perfil del Constructor */}
              {formStep === 2 && (
                <div className="space-y-8" onKeyDown={handleKeyDown}>
                  <div>
                    <div className="text-amber-500 font-bold text-lg mb-4 pb-2 border-b-2 border-amber-500/30">¿Cuál describe mejor tu situación actual?</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {arquetipos.map((arquetipo) => (
                        <button
                          key={arquetipo.id}
                          type="button"
                          onClick={() => setFormData({...formData, arquetipo: arquetipo.title})}
                          className={`text-left p-4 rounded-lg border transition-all duration-300 flex items-start gap-3 ${
                            formData.arquetipo === arquetipo.title
                              ? 'bg-blue-500/20 border-blue-500 text-white'
                              : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-blue-500/50 hover:bg-slate-700/50'
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
                    <div className="text-amber-500 font-bold text-lg mb-4 pb-2 border-b-2 border-amber-500/30">Nivel de inversión que consideras para tu posición de fundador</div>
                    <div className="space-y-3">
                      {[
                        'Constructor Inicial - $900,000 COP (~$200 USD) (validación del ecosistema)',
                        'Constructor Estratégico - $2,250,000 COP (~$500 USD) (posición equilibrada)',
                        'Constructor Visionario - $4,500,000 COP (~$1,000 USD) (máximo potencial)',
                        'Prefiero que Luis o Liliana me asesore sobre la mejor opción'
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFormData({...formData, inversion: option})}
                          className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                            formData.inversion === option
                              ? 'bg-purple-500/20 border-purple-500 text-white'
                              : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-purple-500/50 hover:bg-slate-700/50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 3: Confirmación de Éxito */}
              {formStep === 3 && isSuccess && (
                <div className="text-center space-y-6">
                  <div className="flex justify-center mb-4">
                    <CheckCircle size={64} className="text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-400 mb-4">¡Solicitud Enviada Exitosamente!</h3>

                  <div className="bg-slate-700/50 rounded-lg p-6 space-y-3 text-left">
                    <h4 className="text-blue-400 font-semibold mb-3 text-center">📋 Resumen de Tu Solicitud</h4>
                    <div><strong className="text-blue-400">Constructor:</strong> <span className="text-white">{formData.nombre}</span></div>
                    <div><strong className="text-blue-400">Email:</strong> <span className="text-white">{formData.email}</span></div>
                    <div><strong className="text-blue-400">Perfil:</strong> <span className="text-white">{formData.arquetipo.split(' ')[0]} {formData.arquetipo.split(' ')[1]}</span></div>
                    <div><strong className="text-blue-400">Inversión:</strong> <span className="text-white">{formData.inversion.split(' -')[0]}</span></div>
                  </div>

                  <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-2xl p-6">
                    <h4 className="text-blue-400 font-bold mb-3">📋 Proceso de Evaluación</h4>
                    <div className="text-sm text-slate-300 space-y-2">
                      <div>✓ <strong>Revisión de perfil</strong> por nuestro equipo de Arquitectos</div>
                      <div>✓ <strong>Evaluación de alineación</strong> con la visión del ecosistema</div>
                      <div>✓ <strong>Si calificas:</strong> Invitación a consultoría estratégica exclusiva</div>
                      <div>✓ <strong>Activación inmediata</strong> de tu posición de fundador</div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-yellow-400 font-medium">Nuestro equipo revisará tu perfil. Si tu visión se alinea con la de un Arquitecto Fundador, recibirás una invitación por WhatsApp o Email en las próximas 24 horas.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de acción - Solo pasos 1 y 2 */}
              {!isSuccess && formStep < 3 && (
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isStepValid()}
                    className="bg-gradient-to-r from-blue-700 to-purple-600 text-white font-bold py-[18px] px-9 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full text-lg flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Enviando solicitud...
                      </>
                    ) : (
                      <>
                        {formStep === 1 && (
                          <>Continuar al Perfil <ArrowRight size={20} className="ml-2" /></>
                        )}
                        {formStep === 2 && (
                          <>Enviar Mi Solicitud <Rocket size={20} className="ml-2" /></>
                        )}
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* CTA Final */}
        <section className="max-w-4xl mx-auto text-center py-20">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">Tu Momento es Ahora.</h2>
          <p className="text-slate-300 mb-10 max-w-2xl mx-auto">La historia la escriben quienes actúan en los momentos decisivos. Esta es tu invitación para ser uno de ellos.</p>
          <button
            onClick={scrollToForm}
            className="bg-gradient-to-r from-blue-700 to-purple-600 text-white font-bold py-[18px] px-9 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 text-lg"
          >
            Activar mi Posición de Fundador
          </button>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
            <p className="mt-2">El primer ecosistema tecnológico completo para construcción de activos en América.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
