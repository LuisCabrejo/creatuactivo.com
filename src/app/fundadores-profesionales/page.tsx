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
import { ArrowRight, CheckCircle, PlayCircle, Rocket, Shield, Users, Zap, Briefcase, Target, Lightbulb, Home, UsersRound, TrendingUp, BarChart3, Phone, Mail, Clock, TrendingDown, Bot, Smartphone, BarChart } from 'lucide-react'
import StrategicNavigation from '@/components/StrategicNavigation'

// --- Estilos CSS Globales (Alineados con socio-corporativo y presentacion-empresarial) ---
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

    .creatuactivo-timeline-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
      position: relative;
    }

    .creatuactivo-timeline-card:hover {
      transform: translateY(-4px);
      border-color: rgba(245, 158, 11, 0.3);
      box-shadow: 0 12px 35px rgba(30, 64, 175, 0.15);
    }

    .creatuactivo-why-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(245, 158, 11, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
    }

    .creatuactivo-why-card:hover {
      transform: translateY(-8px);
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2);
    }

    .creatuactivo-bezos-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
    }

    .creatuactivo-bezos-card:hover {
      transform: translateY(-8px);
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2);
    }

    .creatuactivo-urgency-card {
      background: linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(34, 197, 94, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
    }

    .creatuactivo-urgency-card:hover {
      transform: translateY(-8px);
      border-color: rgba(34, 197, 94, 0.4);
      box-shadow: 0 20px 60px rgba(5, 150, 105, 0.3);
    }

    .creatuactivo-form-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 2px solid rgba(245, 158, 11, 0.3);
      border-radius: 24px;
      transition: all 0.4s ease;
    }

    .creatuactivo-form-card:hover {
      transform: translateY(-8px);
      border-color: rgba(245, 158, 11, 0.5);
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
    <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-amber-500/30 rounded-3xl shadow-2xl hover:shadow-amber-500/25 hover:-translate-y-1 transition-all duration-300 p-6 lg:p-8 h-full">
      <div className={`${colorMap[color]} flex-shrink-0 mb-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg lg:text-xl font-bold text-white mb-3 leading-tight">{title}</h3>
        <p className="text-sm lg:text-base text-slate-400 leading-relaxed">{description}</p>
      </div>
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
    <>
      <GlobalStyles />
      <div className="bg-slate-900 text-white min-h-screen">
        <StrategicNavigation />

        {/* Fondo decorativo oficial */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--creatuactivo-gold)]/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[var(--creatuactivo-blue)]/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[var(--creatuactivo-purple)]/10 rounded-full filter blur-3xl opacity-30 animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <main className="relative z-10 px-4 lg:px-8">
          {/* Hero Section */}
          <section className="text-center max-w-4xl mx-auto py-20 lg:py-32 pt-24">
            <div className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6 border border-purple-500/30">
              Para Profesionales que Quieren Construir su Independencia
            </div>

            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              ¿Y Si Pudieras Construir un Activo<br />Sin Dejar Tu Carrera?
            </h1>

            <p className="text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
              <span className="text-xl lg:text-2xl font-bold text-white block mb-4">Se llama CreaTuActivo.</span>
              <span className="text-amber-400 font-semibold">Tu aplicación personal para construir un activo.</span><br /><br />

              Has construido una carrera exitosa.<br />
              Pero sigues intercambiando <span className="text-amber-400 font-semibold">tiempo por dinero</span>.<br /><br />

              Mientras tú duermes, CreaTuActivo trabaja:<br />
              ✅ NEXUS (tu asistente IA) conversa con personas 24/7<br />
              ✅ Te muestra quién está interesado<br />
              ✅ Te dice exactamente qué hacer cada día<br /><br />

              Solo necesitas <span className="text-amber-400 font-semibold">2 horas al día</span>.<br />
              Tu carrera continúa. Tu activo crece.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <button
                onClick={scrollToForm}
                className="creatuactivo-cta-ecosystem w-full md:w-auto text-lg flex items-center justify-center"
              >
                Verificar Si Califico <ArrowRight size={20} className="ml-2" />
              </button>
              <a href="/presentacion-empresarial" className="w-full md:w-auto bg-white/10 backdrop-blur-lg text-slate-300 font-semibold py-4 px-8 rounded-lg hover:bg-white/20 transition-colors duration-300 text-center">
                Ver Presentación
              </a>
            </div>
          </section>

          {/* WHY Section - LENGUAJE SIMPLE */}
          <section className="max-w-4xl mx-auto mb-20">
            <div className="creatuactivo-why-card p-8 lg:p-12">
              <div className="text-center mb-6">
                <div className="inline-block bg-purple-500/10 text-amber-400 font-semibold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border border-purple-500/20">
                  Por Qué Hacemos Esto
                </div>
              </div>

              <p className="text-xl lg:text-2xl text-white leading-relaxed mb-6">
                Creemos que <strong className="text-amber-400">los profesionales merecen</strong> construir algo propio sin sacrificar la estabilidad que han logrado.
              </p>

              <p className="text-xl lg:text-2xl text-white leading-relaxed">
                Tu experiencia, tu red de contactos, tu credibilidad... <strong className="text-amber-400">son activos valiosos</strong>.
              </p>

              <p className="text-xl lg:text-2xl text-white leading-relaxed mt-4">
                Por eso creamos <strong className="text-amber-400">CreaTuActivo</strong>: para que los construyas sin dejar tu carrera.
              </p>
            </div>
          </section>

          {/* Timeline Evolution - CONCRECIÓN BRUTAL */}
          <section className="max-w-5xl mx-auto mb-20">
            <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl text-center mb-3">De Difícil a Fácil</h2>
            <p className="text-center text-slate-400 mb-8 max-w-2xl mx-auto">
              Antes era trabajo manual. Ahora <strong className="text-amber-400">CreaTuActivo</strong> hace el 80% por ti.
            </p>

            {/* Analogías del día a día */}
            <div className="max-w-3xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">ANTES</p>
                <p className="text-white font-semibold mb-2">Alquilar películas</p>
                <p className="text-slate-500 text-xs">Ir al videoclub</p>
                <div className="my-2 text-amber-400">→</div>
                <p className="text-slate-400 text-sm mb-1">AHORA</p>
                <p className="text-amber-400 font-bold">Netflix</p>
                <p className="text-slate-500 text-xs">Desde tu sofá</p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">ANTES</p>
                <p className="text-white font-semibold mb-2">Cartas por correo</p>
                <p className="text-slate-500 text-xs">Esperar días</p>
                <div className="my-2 text-amber-400">→</div>
                <p className="text-slate-400 text-sm mb-1">AHORA</p>
                <p className="text-amber-400 font-bold">WhatsApp</p>
                <p className="text-slate-500 text-xs">Instantáneo</p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">ANTES</p>
                <p className="text-white font-semibold mb-2">Comprar CDs</p>
                <p className="text-slate-500 text-xs">$20 por álbum</p>
                <div className="my-2 text-amber-400">→</div>
                <p className="text-slate-400 text-sm mb-1">AHORA</p>
                <p className="text-amber-400 font-bold">Spotify</p>
                <p className="text-slate-500 text-xs">Millones de canciones</p>
              </div>
            </div>

            <p className="text-center text-lg text-white mb-12 max-w-2xl mx-auto">
              Así como Netflix simplificó ver películas...<br />
              <strong className="text-amber-400">CreaTuActivo simplifica construir tu negocio.</strong>
            </p>

            <p className="text-center text-base text-slate-400 mb-12">
              Tú solo guías el sistema.
            </p>

            <h3 className="text-2xl lg:text-3xl font-bold text-white text-center mb-12">
              Cómo un sistema probado se transforma con tecnología
            </h3>

            <div className="space-y-6 pl-6 lg:pl-0">
              {/* Fase 1 */}
              <div className="creatuactivo-timeline-card p-6 lg:p-8 relative">
                <div className="flex lg:hidden absolute -left-4 top-8 w-8 h-8 bg-blue-500 rounded-full border-4 border-slate-900 items-center justify-center">
                  <BarChart3 size={16} className="text-white" />
                </div>

                <div className="mb-4 lg:flex lg:items-start lg:gap-4">
                  <div className="hidden lg:flex w-12 h-12 bg-blue-500/10 rounded-lg items-center justify-center flex-shrink-0">
                    <BarChart3 size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">ANTES (2015-2024)</div>
                    <h3 className="text-xl font-bold text-white">Todo era Manual</h3>
                  </div>
                </div>

                <div className="text-slate-300 space-y-2 mb-4 lg:ml-16">
                  <p className="flex items-start gap-2"><Phone size={18} className="text-blue-400 mt-1 flex-shrink-0" /> <span><strong className="text-white">Llamadas nocturnas</strong> después de tu jornada laboral</span></p>
                  <p className="flex items-start gap-2"><Mail size={18} className="text-blue-400 mt-1 flex-shrink-0" /> <span><strong className="text-white">Mensajes personalizados</strong> en tus únicos momentos libres</span></p>
                  <p className="flex items-start gap-2"><Clock size={18} className="text-blue-400 mt-1 flex-shrink-0" /> <span><strong className="text-white">Explicar lo mismo</strong> 50 veces mientras sacrificas tiempo con tu familia</span></p>
                  <p className="flex items-start gap-2"><BarChart size={18} className="text-blue-400 mt-1 flex-shrink-0" /> <span><strong className="text-white">Resultado:</strong> 2,847 profesionales lo lograron... pero con agotamiento constante</span></p>
                </div>

                <p className="text-amber-400 font-medium italic lg:ml-16">
                  Funcionaba... pero era incompatible con una carrera exigente.<br />
                  Tenías que elegir: tu empleo o tu activo.
                </p>
              </div>

              {/* Fase 2 */}
              <div className="creatuactivo-timeline-card p-6 lg:p-8 relative">
                <div className="flex lg:hidden absolute -left-4 top-8 w-8 h-8 bg-purple-500 rounded-full border-4 border-slate-900 items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>

                <div className="mb-4 lg:flex lg:items-start lg:gap-4">
                  <div className="hidden lg:flex w-12 h-12 bg-purple-500/10 rounded-lg items-center justify-center flex-shrink-0">
                    <Zap size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">AHORA (2024-2025)</div>
                    <h3 className="text-xl font-bold text-white">CreaTuActivo, la Aplicación que Trabaja Por Ti</h3>
                  </div>
                </div>

                <div className="text-slate-300 space-y-2 mb-4 lg:ml-16">
                  <p className="flex items-start gap-2"><Bot size={18} className="text-purple-400 mt-1 flex-shrink-0" /> <span><strong className="text-white">NEXUS</strong> atiende conversaciones mientras estás en reuniones de trabajo</span></p>
                  <p className="flex items-start gap-2"><Smartphone size={18} className="text-purple-400 mt-1 flex-shrink-0" /> <span><strong className="text-white">El sistema trabaja</strong> mientras tú avanzas en tu carrera profesional</span></p>
                  <p className="flex items-start gap-2"><BarChart size={18} className="text-purple-400 mt-1 flex-shrink-0" /> <span><strong className="text-white">CreaTuActivo te dice</strong> exactamente a quién contactar en tus 2 horas libres</span></p>
                  <p className="flex items-start gap-2"><Zap size={18} className="text-purple-400 mt-1 flex-shrink-0" /> <span><strong className="text-white">Resultado:</strong> Construyes tu activo sin renunciar a tu estabilidad</span></p>
                </div>

                <p className="text-amber-400 font-medium italic lg:ml-16">
                  Ahora sí: puedes tener ambos.<br />
                  Tu carrera profesional Y tu activo creciendo en paralelo.
                </p>
              </div>

              {/* Fase 3 */}
              <div className="creatuactivo-timeline-card p-6 lg:p-8 relative">
                <div className="flex lg:hidden absolute -left-4 top-8 w-8 h-8 bg-purple-500 rounded-full border-4 border-slate-900 items-center justify-center">
                  <Rocket size={16} className="text-white" />
                </div>

                <div className="mb-4 lg:flex lg:items-start lg:gap-4">
                  <div className="hidden lg:flex w-12 h-12 bg-purple-500/10 rounded-lg items-center justify-center flex-shrink-0">
                    <Rocket size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">AHORA (Noviembre 2025)</div>
                    <h3 className="text-xl font-bold text-white">Solo 150 Espacios Disponibles</h3>
                  </div>
                </div>

                <div className="text-slate-300 space-y-2 mb-4 lg:ml-16">
                  <p className="flex items-start gap-2"><Target size={18} className="text-purple-400 mt-1 flex-shrink-0" /> <span><strong className="text-white">Solo 150 profesionales</strong> tendrán acceso como Fundadores</span></p>
                  <p className="flex items-start gap-2"><Zap size={18} className="text-purple-400 mt-1 flex-shrink-0" /> <span><strong className="text-white">CreaTuActivo completo</strong> desde el día 1 (sin esperas, sin limitaciones)</span></p>
                  <p className="flex items-start gap-2"><Shield size={18} className="text-purple-400 mt-1 flex-shrink-0" /> <span><strong className="text-white">Mentoría exclusiva</strong> para construir tu red de 150 personas</span></p>
                </div>

                <p className="text-amber-400 font-medium italic lg:ml-16">
                  Los profesionales que entran ahora se convierten en mentores.<br />
                  Después solo podrán ser constructores.
                </p>
              </div>
            </div>

            {/* Conclusión Timeline */}
            <div className="mt-8 text-center p-6 lg:p-8 bg-blue-500/5 border border-purple-500/20 rounded-xl backdrop-filter backdrop-blur-xl">
              <p className="text-xl lg:text-2xl font-semibold text-white">
                Los primeros <strong className="text-amber-400">2,847 probaron que funciona</strong> sin tecnología.
                <br /><br />
                Imagina lo que <strong className="text-amber-400">TÚ lograrás con CreaTuActivo.</strong>
              </p>
            </div>
          </section>

          {/* Video Hero */}
          <section className="max-w-5xl mx-auto mb-20">
            <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl text-center mb-4">Cómo Profesionales Usan CreaTuActivo</h2>
            <p className="text-center text-slate-400 mb-8 max-w-2xl mx-auto">
              60 segundos que te mostrarán cómo construir un activo sin dejar tu carrera
            </p>

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
                  <h2 className="text-2xl lg:text-4xl font-bold mb-2 text-white">La Forma Fácil vs La Forma Difícil</h2>
                  <p className="text-slate-300 max-w-xl">La pregunta que Jeff Bezos respondió diferente... y que cambiará cómo ves esta oportunidad.</p>
                </div>
              )}
            </div>

            {/* Metadata del video para SEO */}
            <div className="mt-4 text-center">
              <p className="text-slate-400 text-sm">
                Video: La Forma Fácil vs La Forma Difícil | Duración: 1:03 min
              </p>
            </div>
          </section>

          {/* HOW Section - La Pregunta de Bezos */}
          <section className="max-w-4xl mx-auto mb-20">
            <div className="creatuactivo-bezos-card p-8 lg:p-12 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-amber-400 mb-6 leading-tight">
                ¿Jeff Bezos se hizo rico vendiendo libros<br />
                o creando el SISTEMA que distribuye millones de libros cada día?
              </h2>

              <p className="text-xl font-bold text-white mb-6">
                Exacto. No fue vendiendo. Fue construyendo el sistema.
              </p>

              <div className="text-base lg:text-lg text-slate-300 space-y-4 leading-relaxed">
                <p>
                  La mayoría trabaja toda la vida y solo gana lo que le pagan ese mes.
                </p>

                <p>
                  Pero hay otra forma: <strong className="text-amber-400">construir tu propio sistema de distribución</strong> que trabaja por ti, incluso cuando duermes.
                </p>

                <p>
                  Usas productos únicos de salud (<strong className="text-white">Gano Excel</strong> con patente mundial) y construyes tu red de distribución.
                </p>

                <p className="text-lg font-semibold text-white mb-2">
                  ¿Quién hace el trabajo pesado?
                </p>

                <p className="text-lg lg:text-xl font-bold text-amber-400">
                  CreaTuActivo<br />
                  + NEXUS (tu asistente IA 24/7)
                </p>

                <p className="text-base text-slate-300 mt-4">
                  Tú solo guías el sistema.
                </p>
              </div>
            </div>
          </section>

          {/* Beneficios */}
          <section className="max-w-7xl mx-auto mb-20">
            <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl text-center mb-4">El Valor de Ser Fundador</h2>
            <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">
              Beneficios exclusivos que solo los primeros 150 tendrán
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <BenefitCard
                icon={<Rocket size={24}/>}
                title="Empiezas Primero"
                description="Llegas antes que todos. Cuando otros empiecen, tú ya estarás adelante."
                color="blue"
              />
              <BenefitCard
                icon={<Zap size={24}/>}
                title="Todas las Herramientas"
                description="Tienes acceso completo a todo desde el primer día. Ventajas que nadie más tendrá."
                color="purple"
              />
              <BenefitCard
                icon={<Shield size={24}/>}
                title="Ganas Más"
                description="Por llegar primero, siempre ganarás más que los que lleguen después."
                color="green"
              />
              <BenefitCard
                icon={<Users size={24}/>}
                title="Tu Opinión Cuenta"
                description="No solo escuchamos tus ideas, las usamos para mejorar todo."
                color="orange"
              />
            </div>
          </section>

          {/* Quién Califica */}
          <section className="max-w-5xl mx-auto mb-20">
            <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl text-center mb-4">¿Eres el Profesional que Buscamos?</h2>
            <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">
              Buscamos profesionales que quieren diversificar sus ingresos sin abandonar su carrera.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {arquetipos.map((arquetipo) => (
                <div
                  key={arquetipo.id}
                  className="creatuactivo-component-card p-6 lg:p-8"
                >
                  <div className={`${arquetipo.iconColor} flex-shrink-0 mb-4`}>
                    {arquetipo.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 leading-tight">{arquetipo.title}</h3>
                    <p className="text-sm lg:text-base text-slate-400 leading-relaxed">{arquetipo.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center p-6 lg:p-8 bg-blue-500/5 border border-purple-500/20 rounded-xl backdrop-filter backdrop-blur-xl">
              <p className="text-lg lg:text-xl text-slate-300 leading-relaxed">
                Si has construido una <strong className="text-amber-400">carrera exitosa</strong>,<br />
                tienes <strong className="text-amber-400">credibilidad en tu campo</strong>,<br />
                y quieres <strong className="text-amber-400">diversificar tus ingresos</strong> sin renunciar a tu estabilidad...
                <br /><br />
                <span className="text-xl lg:text-2xl font-bold text-white">
                  CreaTuActivo fue diseñado para profesionales como tú.
                </span>
              </p>
            </div>
          </section>

          {/* Urgencia y Timeline */}
          <section className="max-w-5xl mx-auto mb-20">
            <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-500/10 border-2 border-amber-500/30 rounded-3xl shadow-2xl hover:shadow-amber-500/25 hover:-translate-y-1 transition-all duration-300 p-8 lg:p-12 text-center">
              <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl mb-4">La Ventana de Oportunidad Es Real</h2>

              <div className="my-8">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Cupos de Fundador Disponibles</p>
                <p className="text-6xl lg:text-7xl font-bold text-green-400 mb-2">{spotsLeft}</p>
                <p className="text-slate-400 text-sm">de 150 cupos totales</p>
              </div>

              <div className="bg-white/5 rounded-lg h-2 overflow-hidden my-8 max-w-md mx-auto">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                  style={{width: `${(spotsLeft/150)*100}%`}}
                ></div>
              </div>

              <p className="text-base lg:text-lg text-slate-300 leading-relaxed">
                Los profesionales que entran ahora se convierten en <strong className="text-amber-400">mentores</strong>.
                <br /><br />
                Después de <strong className="text-green-400">Marzo 2026</strong>, solo podrás entrar como constructor bajo la mentoría de alguien más.<br />
                La ventaja competitiva de ser Fundador no volverá a existir.
              </p>
            </div>
          </section>

          {/* Prueba de Confianza */}
          <section className="max-w-5xl mx-auto text-center mb-20">
            <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl mb-4">Construido Sobre Base Sólida</h2>
            <p className="text-slate-300 max-w-3xl mx-auto mb-12">Esta innovación no nace en el vacío. Es el resultado de 9 años de éxito probado, ahora potenciado por un socio corporativo con 30+ años de trayectoria global y una patente mundial que garantiza su unicidad.</p>

            <div className="flex flex-col sm:flex-row justify-center gap-8">
              <div className="creatuactivo-component-card p-6 text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">9 Años</p>
                <p className="text-slate-400">de Liderazgo Probado</p>
              </div>
              <div className="creatuactivo-component-card p-6 text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">30+ Años</p>
                <p className="text-slate-400">de Respaldo Corporativo</p>
              </div>
            </div>
          </section>

          {/* Formulario - TODA LA FUNCIONALIDAD PRESERVADA */}
          <section id="formulario" className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
                Solicita tu Consultoría
                <span className="bg-gradient-to-br from-blue-700 via-purple-600 to-amber-500 bg-clip-text text-transparent"> Exclusiva para Profesionales</span>
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Revisaré personalmente cada solicitud. Si buscas diversificar tus ingresos sin abandonar tu carrera, recibirás una invitación en las próximas 24 horas.
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
                      <div className="text-amber-500 font-bold text-lg mb-4 pb-2 border-b-2 border-amber-500/30">¿Cuánto podrías invertir para empezar?</div>
                      <div className="space-y-3">
                        {[
                          'Opción Básica - $900,000 COP (~$200 USD)',
                          'Opción Media - $2,250,000 COP (~$500 USD)',
                          'Opción Completa - $4,500,000 COP (~$1,000 USD)',
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
                      <h4 className="text-blue-400 font-bold mb-3">📋 Qué Sigue</h4>
                      <div className="text-sm text-slate-300 space-y-2">
                        <div>✓ <strong>Revisamos</strong> tu información</div>
                        <div>✓ <strong>Verificamos</strong> si calificas para los 150 espacios</div>
                        <div>✓ <strong>Si calificas:</strong> Te llamamos para una consulta gratis</div>
                        <div>✓ <strong>Empiezas de inmediato</strong> como fundador</div>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-yellow-400 font-medium">Revisaremos tu información. Si calificas para los 150 espacios, recibirás una invitación por WhatsApp o Email en las próximas 24 horas.</p>
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
                      className="creatuactivo-cta-ecosystem w-full text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl mb-6">Tu Carrera + Tu Activo</h2>
            <p className="text-slate-300 mb-10 max-w-2xl mx-auto">
              Ya no tienes que elegir entre estabilidad e independencia.<br />
              <strong className="text-amber-400">CreaTuActivo te permite tener ambos</strong>.
            </p>
            <button
              onClick={scrollToForm}
              className="creatuactivo-cta-ecosystem text-lg"
            >
              Solicitar Consultoría Exclusiva
            </button>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
              <p>&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
              <p className="mt-2">CreaTuActivo: La primera aplicación completa para construir tu activo en América Latina.</p>
            </div>
          </footer>
        </main>
      </div>
    </>
  )
}
