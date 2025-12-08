/**
 * Copyright © 2025 CreaTuActivo.com
 * Founders Page v4.2 - Final Polish
 * Ajustes: Sincronización de estilos ecosystem, UX de formulario mejorada y animaciones de urgencia.
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import {
  ArrowRight,
  CheckCircle,
  PlayCircle,
  Rocket,
  Shield,
  Users,
  Zap,
  Briefcase,
  Target,
  Lightbulb,
  Home,
  UsersRound,
  TrendingUp,
  BarChart3,
  Bot,
  Smartphone,
  ChevronRight
} from 'lucide-react'
import StrategicNavigation from '@/components/StrategicNavigation'
import AnimatedCountUp from '@/components/AnimatedCountUp'
import AnimatedTimeline from '@/components/AnimatedTimeline'
import AnimatedEvolution from '@/components/AnimatedEvolution'

// --- Estilos CSS Globales (Sincronizados con Home y Ecosystem) ---
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --creatuactivo-blue: #1E40AF;
      --creatuactivo-purple: #7C3AED;
      --creatuactivo-gold: #F59E0B;
    }

    /* TÍTULO PRINCIPAL ECOSYSTEM (Idéntico a Home) */
    .creatuactivo-h1-ecosystem {
      font-weight: 800;
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 50%, var(--creatuactivo-gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.1;
      letter-spacing: -0.03em;
      filter: drop-shadow(0 2px 10px rgba(124, 58, 237, 0.2));
    }

    /* TEXTO DORADO DE ÉNFASIS */
    .text-gradient-gold {
      background: linear-gradient(135deg, #FBBF24 0%, #D97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }

    .creatuactivo-h2-component {
        font-weight: 700;
        background: linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* TARJETAS CON EFECTO GLASS (Unificado) */
    .creatuactivo-glass-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }

    .creatuactivo-glass-card:hover {
      transform: translateY(-8px);
      border-color: rgba(245, 158, 11, 0.3);
      box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2);
    }

    /* TARJETA ESPECIAL DE URGENCIA */
    .creatuactivo-urgency-card {
      background: linear-gradient(135deg, rgba(6, 78, 59, 0.3) 0%, rgba(15, 23, 42, 0.6) 100%);
      border: 1px solid rgba(34, 197, 94, 0.3);
    }

    /* BOTÓN CTA PRINCIPAL */
    .creatuactivo-cta-ecosystem {
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 100%);
      border-radius: 12px;
      padding: 16px 32px;
      font-weight: 700;
      color: white;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(30, 64, 175, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }

    .creatuactivo-cta-ecosystem:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(124, 58, 237, 0.5);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .creatuactivo-cta-ecosystem::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: 0.5s;
    }

    .creatuactivo-cta-ecosystem:hover::after {
      left: 100%;
    }

    /* ANIMACIONES */
    @keyframes pulse-gold {
      0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
      100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
    }

    .animate-pulse-gold {
      animation: pulse-gold 2s infinite;
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
    <div className="creatuactivo-glass-card p-6 lg:p-8 h-full flex flex-col">
      <div className={`${colorMap[color]} bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-3 leading-tight">{title}</h3>
        <p className="text-sm lg:text-base text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function calcularCuposDisponibles(): number {
  // TEMPORAL: Retornar 150 cupos estáticos (Configuración inicial)
  return 150
}

const arquetipos = [
  { id: 'profesional', icon: <Briefcase size={24} />, title: 'Profesional con Visión', description: 'Para construir un activo, no solo una carrera.', iconColor: 'text-blue-400' },
  { id: 'emprendedor', icon: <Target size={24} />, title: 'Dueño de Negocio', description: 'Para escalar con un sistema, no con más tareas.', iconColor: 'text-orange-400' },
  { id: 'independiente', icon: <Lightbulb size={24} />, title: 'Freelancer', description: 'Para convertir el talento en un activo escalable.', iconColor: 'text-purple-400' },
  { id: 'lider-hogar', icon: <Home size={24} />, title: 'Líder del Hogar', description: 'Para construir con flexibilidad y propósito.', iconColor: 'text-pink-400' },
  { id: 'lider-comunidad', icon: <UsersRound size={24} />, title: 'Líder Social', description: 'Para transformar tu influencia en un legado tangible.', iconColor: 'text-green-400' },
  { id: 'joven-ambicioso', icon: <TrendingUp size={24} />, title: 'Joven Ambicioso', description: 'Para construir un activo antes de empezar una carrera.', iconColor: 'text-cyan-400' }
]

export default function FundadoresPage() {
  const [spotsLeft, setSpotsLeft] = useState(150)
  const [progressWidth, setProgressWidth] = useState(0)
  const [formStep, setFormStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const formTopRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    arquetipo: '',
    inversion: ''
  })

  useEffect(() => {
    setSpotsLeft(calcularCuposDisponibles())
    setTimeout(() => {
      setProgressWidth((calcularCuposDisponibles() / 150) * 100)
    }, 500)

    const interval = setInterval(() => {
      setSpotsLeft(calcularCuposDisponibles())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const scrollToForm = () => {
    document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })
  }

  const nextStep = () => {
    if (isStepValid()) {
      setFormStep(prev => prev + 1)
      setTimeout(() => {
        formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formStep === 1) {
      nextStep()
      return
    }

    if (formStep === 2) {
      setIsSubmitting(true)
      try {
        const response = await fetch('/api/fundadores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
          setFormStep(3)
          formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        } else {
          throw new Error(result.error || 'Error en la solicitud')
        }
      } catch (error) {
        console.error('Error:', error)
        alert(`Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.`)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && isStepValid()) {
      e.preventDefault()
      if (formStep === 1) nextStep()
    }
  }

  const isStepValid = () => {
    if (formStep === 1) return formData.nombre && formData.email && formData.telefono
    if (formStep === 2) return formData.arquetipo && formData.inversion
    return true
  }

  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-950 text-white min-h-screen selection:bg-purple-500/30">
        <StrategicNavigation />

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full filter blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full filter blur-[100px]"></div>
        </div>

        <main className="relative z-10 px-4 lg:px-8">
          <section className="text-center max-w-5xl mx-auto py-20 lg:py-32 pt-28">
            <div className="inline-flex items-center gap-2 bg-blue-900/20 border border-blue-500/30 text-blue-300 text-xs md:text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Convocatoria Privada 2025
            </div>

            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl lg:text-7xl mb-8 leading-tight">
              ¿Y Si Una App Hiciera<br className="hidden md:block"/> El Trabajo Duro Por Ti?
            </h1>

            <div className="text-xl md:text-3xl font-medium text-slate-200 mb-6">
              Se llama <span className="text-white font-bold">CreaTuActivo</span>.
            </div>

            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Tu aplicación personal para construir un activo digital. 99% de las personas fallan porque lo hacen manual. <strong className="text-white">Nosotros automatizamos el éxito.</strong>
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={scrollToForm}
                className="creatuactivo-cta-ecosystem w-full sm:w-auto text-lg flex items-center justify-center gap-2 animate-pulse-gold"
              >
                Verificar Si Califico <ArrowRight size={20} />
              </button>
              <a href="/presentacion-empresarial" className="w-full sm:w-auto bg-slate-800/50 backdrop-blur-md border border-slate-700 text-slate-300 font-semibold py-4 px-8 rounded-xl hover:bg-slate-700 hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                <PlayCircle size={20} /> Ver Presentación
              </a>
            </div>
          </section>

          <section className="max-w-4xl mx-auto mb-24">
            <div className="creatuactivo-glass-card p-8 lg:p-12 text-center border-amber-500/20">
              <div className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-4">Nuestra Filosofía</div>
              <p className="text-xl lg:text-3xl text-white leading-relaxed font-light">
                Creemos que todas las personas merecen viajar y tener tiempo libre. <strong className="text-gradient-gold">Pero no debería ser tan difícil.</strong>
                <br /><br />
                Por eso creamos CreaTuActivo: el sistema que reemplaza el esfuerzo manual con inteligencia artificial.
              </p>
            </div>
          </section>

          <section className="max-w-6xl mx-auto mb-24">
            <div className="text-center mb-16">
              <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl mb-4">La Evolución del Negocio</h2>
              <p className="text-slate-400">Antes era trabajo duro. Ahora es trabajo inteligente.</p>
            </div>

            <AnimatedEvolution />

            <div className="relative max-w-4xl mx-auto space-y-8 pl-8 md:pl-0">
              <div className="absolute left-0 md:left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent opacity-30 md:hidden"></div>

              <div className="creatuactivo-glass-card p-6 lg:p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="hidden md:flex w-14 h-14 bg-blue-900/30 rounded-full border border-blue-500/30 items-center justify-center flex-shrink-0 text-blue-400">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">El Pasado (Manual)</div>
                  <h3 className="text-xl font-bold text-white mb-4">Vender puerta a puerta</h3>
                  <div className="text-slate-400 space-y-2 text-sm">
                    <p>❌ Llamar a listas de desconocidos.</p>
                    <p>❌ Explicar lo mismo 100 veces.</p>
                    <p>❌ Perseguir amigos y familiares.</p>
                  </div>
                </div>
              </div>

              <div className="creatuactivo-glass-card p-6 lg:p-8 flex flex-col md:flex-row gap-6 items-start border-purple-500/30 shadow-[0_0_30px_rgba(124,58,237,0.1)]">
                <div className="hidden md:flex w-14 h-14 bg-purple-900/30 rounded-full border border-purple-500/50 items-center justify-center flex-shrink-0 text-purple-400 shadow-lg shadow-purple-500/20">
                  <Bot size={28} />
                </div>
                <div>
                  <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-2">El Presente (Automatizado)</div>
                  <h3 className="text-2xl font-bold text-white mb-4">CreaTuActivo + IA NEXUS</h3>
                  <div className="text-slate-300 space-y-3">
                    <p className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> <span><strong className="text-white">IA NEXUS</strong> responde preguntas 24/7.</span></p>
                    <p className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> <span><strong className="text-white">La App</strong> te dice qué hacer cada día.</span></p>
                    <p className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> <span><strong className="text-white">El Sistema</strong> filtra a los interesados por ti.</span></p>
                  </div>
                  <div className="mt-4 p-3 bg-purple-500/10 rounded-lg text-sm text-purple-200 border border-purple-500/20 inline-block">
                    ✨ Tú solo tomas las decisiones finales. La tecnología hace el resto.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-5xl mx-auto mb-24">
            <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl text-center mb-8">La Forma Fácil vs La Forma Difícil</h2>
            <div className="relative aspect-video bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden group">
              {process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P ? (
                <video className="w-full h-full object-cover" controls preload="metadata" poster={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_POSTER}>
                  <source src={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P} type="video/mp4" />
                   Tu navegador no soporta video.
                </video>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
                  <div className="relative z-10 text-center p-8">
                    <PlayCircle size={64} className="text-white/80 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-2xl font-bold text-white mb-2">Video Exclusivo para Fundadores</h3>
                    <p className="text-slate-300">Descubre cómo la tecnología cambia las reglas del juego.</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="max-w-4xl mx-auto mb-24">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
               <div className="absolute top-4 left-6 text-8xl text-slate-800 font-serif opacity-50">"</div>

              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8 relative z-10">
                ¿Jeff Bezos se hizo rico vendiendo libros puerta a puerta? <br/>
                <span className="text-slate-400 text-xl font-normal">No. Él creó el sistema que los distribuye.</span>
              </h2>

              <div className="space-y-4 text-lg text-slate-300 relative z-10">
                <p>Nosotros te entregamos ese sistema.</p>
                <p>El producto lo pone <strong className="text-white">Gano Excel</strong> (Tecnología Propietaria).</p>
                <p>La tecnología la pone <strong className="text-gradient-gold">CreaTuActivo</strong>.</p>
                <p className="font-bold text-white mt-6 text-xl">Tú cobras por conectar.</p>
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto mb-24">
            <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl text-center mb-12">Ventajas de ser Fundador</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <BenefitCard icon={<Rocket size={24}/>} title="Llegas Primero" description="Posicionamiento privilegiado antes del lanzamiento masivo en 2026." color="blue" />
              <BenefitCard icon={<Zap size={24}/>} title="Suite Tecnológica" description="Acceso vitalicio a NEXUS IA y herramientas de automatización." color="purple" />
              <BenefitCard icon={<Shield size={24}/>} title="Mentoria Directa" description="Acceso directo a Luis Cabrejo y al equipo corporativo." color="green" />
              <BenefitCard icon={<Users size={24}/>} title="Comunidad Alpha" description="Grupo cerrado de estrategia con los líderes de mayor rendimiento." color="orange" />
            </div>
          </section>

          <section className="max-w-4xl mx-auto mb-24">
            <div className="creatuactivo-urgency-card rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden shadow-2xl shadow-green-900/20">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-2">Ventana de Oportunidad</h2>
                <p className="text-green-400 font-bold uppercase tracking-widest text-sm mb-8">Estado Actual: Abierto</p>

                <div className="flex items-end justify-center gap-3 mb-4">
                  <AnimatedCountUp
                    end={spotsLeft}
                    duration={2.5}
                    className="text-7xl font-bold text-white leading-none"
                  />
                  <span className="text-slate-400 text-lg mb-2">/ 150 Cupos</span>
                </div>

                <div className="h-4 bg-slate-900/50 rounded-full overflow-hidden max-w-md mx-auto mb-8 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                    style={{ width: `${progressWidth}%` }}
                  ></div>
                </div>

                <p className="text-slate-300">
                  Una vez se llenen los 150 cupos, la entrada a Fundadores se cierra permanentemente.
                  <br/> El público general entrará en Marzo 2026 sin estos beneficios.
                </p>
              </div>
            </div>
          </section>

          {/* Timeline de las 3 Fases */}
          <AnimatedTimeline />

          <section id="formulario" className="max-w-3xl mx-auto mb-32 pt-10" ref={formTopRef}>
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                Postulación a <span className="text-gradient-gold">Fundador</span>
              </h2>
              <p className="text-slate-400 text-lg">
                Completa tu perfil. Si calificas, recibirás acceso en 24 horas.
              </p>
            </div>

            <div className="creatuactivo-glass-card p-6 md:p-10 border-t border-white/10">
              <div className="flex items-center justify-between mb-10 relative px-4">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-800 -z-10"></div>
                {[1, 2, 3].map((step) => (
                  <div key={step} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 z-10 ${
                    formStep >= step ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110' : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    {formStep > step ? <CheckCircle size={18} /> : step}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {formStep === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-300 ml-1">Nombre Completo</label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        onKeyDown={handleKeyDown}
                        className="w-full px-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                        placeholder="Ej: Juan Pérez"
                        autoFocus
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-300 ml-1">Correo Electrónico</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        onKeyDown={handleKeyDown}
                        className="w-full px-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                        placeholder="Ej: juan@gmail.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-300 ml-1">WhatsApp (con código país)</label>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                        onKeyDown={handleKeyDown}
                        className="w-full px-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                        placeholder="Ej: +57 300 123 4567"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                    >
                      Continuar <ChevronRight size={20} />
                    </button>
                  </div>
                )}

                {formStep === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-amber-500">1.</span> ¿Qué te describe mejor?
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {arquetipos.map((arq) => (
                          <div
                            key={arq.id}
                            onClick={() => setFormData({...formData, arquetipo: arq.title})}
                            className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                              formData.arquetipo === arq.title
                                ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500'
                                : 'bg-slate-900/40 border-slate-700 hover:border-slate-500'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <span className={arq.iconColor}>{arq.icon}</span>
                              <span className="font-bold text-white text-sm">{arq.title}</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-snug">{arq.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-amber-500">2.</span> Capacidad de Inversión Inicial
                      </h3>
                      <div className="space-y-2">
                        {[
                          'Básica - $900,000 COP (~$200 USD)',
                          'Empresarial 1 - $2,250,000 COP (~$500 USD)',
                          'Empresarial 2 - $4,500,000 COP (~$1,000 USD)',
                          'Necesito asesoría financiera'
                        ].map((opt) => (
                          <div
                            key={opt}
                            onClick={() => setFormData({...formData, inversion: opt})}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                              formData.inversion === opt
                                ? 'bg-purple-600/20 border-purple-500 text-white'
                                : 'bg-slate-900/40 border-slate-700 text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            <span>{opt}</span>
                            {formData.inversion === opt && <CheckCircle size={18} className="text-purple-400"/>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !isStepValid()}
                      className="creatuactivo-cta-ecosystem w-full text-lg flex items-center justify-center disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          Procesando...
                        </span>
                      ) : (
                        <>Enviar Solicitud <Rocket size={20} className="ml-2" /></>
                      )}
                    </button>
                  </div>
                )}

                {formStep === 3 && isSuccess && (
                  <div className="text-center py-8 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-500/20">
                      <CheckCircle size={40} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">¡Solicitud Recibida!</h3>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                      Hemos recibido tu perfil correctamente. El equipo de admisiones revisará tu información.
                    </p>
                    <div className="bg-slate-800/50 rounded-xl p-6 text-left border border-slate-700 mb-8">
                      <p className="text-sm text-slate-500 uppercase font-bold mb-4 border-b border-slate-700 pb-2">Próximos Pasos</p>
                      <ul className="space-y-3 text-slate-300 text-sm">
                        <li className="flex gap-3">
                          <span className="bg-slate-700 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                          Revisión de perfil (Duración: 2 a 4 horas).
                        </li>
                        <li className="flex gap-3">
                          <span className="bg-slate-700 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                          Si eres aprobado, recibirás un WhatsApp de nuestro equipo.
                        </li>
                        <li className="flex gap-3">
                          <span className="bg-slate-700 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                          Agendaremos tu llamada de bienvenida.
                        </li>
                      </ul>
                    </div>
                    <a href="/" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                      Volver al Inicio
                    </a>
                  </div>
                )}
              </form>
            </div>
          </section>

          <footer className="border-t border-slate-800 py-12 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} CreaTuActivo.com</p>
            <p className="mt-2">Tecnología propietaria para la construcción de activos.</p>
          </footer>
        </main>
      </div>
    </>
  )
}
