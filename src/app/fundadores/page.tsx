/**
 * Copyright © 2026 CreaTuActivo.com
 * Founders Page v7.1 - "The Apple Strategy"
 * Estrategia: Long-Form Persuasion + Apple Aesthetic.
 * Recuperamos: Video, Analogía Bezos, Estructura de 3 Piezas.
 *
 * BIMETALLIC DESIGN SYSTEM v3.0:
 * - Oro (#C5A059): CTAs, logros, números destacados
 * - Titanio (#94A3B8): Íconos estructurales, líneas, bordes
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import {
  ArrowRight, CheckCircle, Play, PlayCircle, Rocket, Shield, Users,
  Zap, Briefcase, Target, Lightbulb, TrendingUp,
  BarChart3, Bot, ChevronRight, Lock, Crown, Clock,
  Globe, Database, Box
} from 'lucide-react'
import StrategicNavigation from '@/components/StrategicNavigation'
import AnimatedCountUp from '@/components/AnimatedCountUp'
import { useHydration } from '@/hooks/useHydration'

// --- Estilos CSS Globales (BIMETALLIC v3.0) ---
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --carbon-deep: #0F1115;
      --carbon-elevated: #15171C;
      --gold-primary: #C5A059;
      --gold-hover: #D4AF37;
      --titanium-primary: #94A3B8;
      --titanium-muted: #64748B;
    }

    /* TÍTULO H1: TITANIUM WHITE (Elegancia Institucional) */
    .creatuactivo-h1-ecosystem {
      font-weight: 800;
      background: linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.04em;
    }

    /* TEXTO DORADO (BIMETALLIC: Solo para énfasis de lujo) */
    .text-gold {
      background: linear-gradient(135deg, #C5A059 0%, #D4AF37 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* GLASS CARDS (BIMETALLIC: bordes neutros, hover dorado) */
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }
    .glass-card:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(197, 160, 89, 0.3);
      transform: translateY(-2px);
    }

    /* VIDEO CONTAINER (BIMETALLIC: glow titanio) */
    .video-glow {
      box-shadow: 0 0 100px -20px rgba(148, 163, 184, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      isolation: isolate;
      touch-action: manipulation;
    }

    /* Fix para evitar scroll en mobile al reproducir video */
    .video-glow video {
      touch-action: manipulation;
      -webkit-touch-callout: none;
    }

    @media (max-width: 768px) {
      .video-glow {
        position: relative;
        z-index: 10;
      }
    }

    /* TIMELINE (BIMETALLIC: progreso dorado) */
    .phase-line {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 2px;
      background: rgba(148, 163, 184, 0.2);
      z-index: 0;
      transform: translateY(-50%);
    }
    .phase-progress {
      position: absolute;
      top: 50%;
      left: 0;
      height: 2px;
      background: linear-gradient(90deg, #C5A059, #D4AF37);
      z-index: 0;
      transform: translateY(-50%);
    }

    /* INPUTS PREMIUM (BIMETALLIC: focus dorado) */
    .input-premium {
      background: rgba(15, 17, 21, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      transition: all 0.3s;
    }
    .input-premium:focus {
      border-color: #C5A059;
      box-shadow: 0 0 0 2px rgba(197, 160, 89, 0.2);
    }
  `}</style>
);

// --- COMPONENTES AUXILIARES ---

function PhaseNode({ title, date, spots, isActive, isPast }: any) {
  return (
    <div className={`relative z-10 flex flex-col items-center ${isActive ? 'scale-110' : 'opacity-60'}`}>
      {/* BIMETALLIC: Nodo activo usa dorado, inactivo usa titanio */}
      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 mb-4 transition-all duration-500 bg-[#0F1115] ${
        isActive
          ? 'border-[#C5A059] shadow-[0_0_30px_rgba(197,160,89,0.5)] text-white'
          : isPast
            ? 'border-[#64748B] bg-[#1A1D23] text-[#94A3B8]'
            : 'border-[#475569] bg-[#15171C] text-[#64748B]'
      }`}>
        {isActive ? <Crown size={24} className="text-[#C5A059]" /> : isPast ? <CheckCircle size={24} /> : <Lock size={24} />}
      </div>

      {isActive && (
        <div className="absolute -top-8 bg-[#C5A059] text-[#0F1115] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest animate-bounce">
          Estás Aquí
        </div>
      )}

      <h3 className={`font-bold text-xs md:text-sm mb-1 text-center ${isActive ? 'text-white' : 'text-[#64748B]'}`}>{title}</h3>
      <p className="text-[10px] text-[#64748B] mb-1">{date}</p>
      <p className={`text-[10px] font-mono ${isActive ? 'text-[#C5A059] font-bold' : 'text-[#475569]'}`}>{spots}</p>
    </div>
  )
}

// BIMETALLIC: Íconos estructurales en titanio
const arquetipos = [
  { id: 'profesional', icon: <Briefcase size={20} />, title: 'Profesional', description: 'Diversificar ingresos sin dejar mi empleo.', iconColor: 'text-[#94A3B8]' },
  { id: 'emprendedor', icon: <Target size={20} />, title: 'Dueño de Negocio', description: 'Sistemas que no dependan de mi tiempo.', iconColor: 'text-[#94A3B8]' },
  { id: 'independiente', icon: <Lightbulb size={20} />, title: 'Freelancer', description: 'Escalar ingresos y tener estabilidad.', iconColor: 'text-[#94A3B8]' },
  { id: 'lider', icon: <Users size={20} />, title: 'Líder / Networker', description: 'Modernizar mi equipo con tecnología.', iconColor: 'text-[#94A3B8]' }
]

export default function FundadoresPage() {
  const isHydrated = useHydration()
  const [formStep, setFormStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const formTopRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', arquetipo: '', inversion: '' })

  // Prevenir scroll restoration del navegador
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  const scrollToForm = () => document.getElementById('aplicacion')?.scrollIntoView({ behavior: 'smooth' })

  const nextStep = () => {
    if (isStepValid()) {
      setFormStep(prev => prev + 1)
      setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formStep === 1) { nextStep(); return }
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
            page: 'fundadores-v7'
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
        alert('Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.')
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
      {/* BIMETALLIC: Fondo carbono profundo */}
      <div className="bg-[#0F1115] text-white min-h-screen font-sans selection:bg-[#C5A059]/30">
        <StrategicNavigation />

        {/* --- 1. HERO: PROMESA + URGENCIA --- */}
        <section className="relative pt-36 pb-20 overflow-hidden text-center">
            {/* BIMETALLIC: Spotlight titanio sutil */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[rgba(148,163,184,0.08)] rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* BIMETALLIC: Badge con borde titanio y pulso dorado */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#15171C]/50 border border-[rgba(148,163,184,0.2)] text-[#A3A3A3] text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
                    Solo 150 Cupos Fundadores
                </div>

                <h1 className="creatuactivo-h1-ecosystem text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight">
                    El "Amazon" llave en mano <br />
                    <span className="text-white">está buscando socios.</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                    No venimos a venderte un curso. Venimos a entregarte la <strong>infraestructura tecnológica</strong> para que construyas el activo de distribución más grande de América.
                </p>

                {/* BIMETALLIC: CTA dorado (es premio) */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button onClick={scrollToForm} className="px-8 py-4 bg-[#C5A059] text-[#0F1115] font-bold rounded-full hover:bg-[#D4AF37] transition-all shadow-[0_0_20px_-5px_rgba(197,160,89,0.4)] flex items-center justify-center gap-2 transform hover:-translate-y-1">
                        Aplicar a Fundador <ArrowRight size={18} />
                    </button>
                    <div className="flex items-center gap-2 px-6 py-4 text-[#A3A3A3] text-sm border border-[rgba(255,255,255,0.1)] rounded-full bg-[rgba(255,255,255,0.05)]">
                        <Clock size={16} className="text-[#94A3B8]" /> La lista cierra el 04 de Enero
                    </div>
                </div>
            </div>
        </section>

        {/* --- 2. VIDEO DE MANIFIESTO --- */}
        <section id="video" className="pb-24 pt-10">
            <div className="container mx-auto px-4 max-w-5xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">Manifiesto del Fundador</h2>
                <p className="text-center text-slate-400 mb-8">Descubre la visión detrás del ecosistema.</p>

                <div className="relative aspect-video bg-slate-800/50 rounded-2xl border border-white/10 shadow-2xl overflow-hidden video-glow group">
                  <video
                    className="w-full h-full object-cover"
                    poster={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_POSTER || "https://placehold.co/1920x1080/0f172a/94a3b8?text=Manifiesto+del+Fundador"}
                    controls
                    preload="metadata"
                    playsInline
                    webkit-playsinline="true"
                    controlsList="nodownload"
                    onPlay={(e) => {
                      // Prevenir scroll al formulario en mobile
                      const videoSection = document.getElementById('video')
                      if (videoSection) {
                        videoSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }
                    }}
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

                {/* Metadata del video */}
                <div className="mt-4 text-center">
                  <p className="text-slate-400 text-sm">
                    Video: Manifiesto del Fundador | Duración: 1:03 min
                  </p>
                </div>
            </div>
        </section>

        {/* --- 3. ANALOGÍA BEZOS (RECUPERADA) --- */}
        <section className="py-24 bg-[#15171C]/50 border-t border-white/5">
            <div className="container mx-auto px-4 max-w-4xl">
                 <div className="glass-card p-10 md:p-14 rounded-3xl text-center">
                    <h2 className="text-3xl font-bold text-white mb-10">El Secreto de los Activos Digitales</h2>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="bg-red-500/5 p-8 rounded-2xl border border-red-500/10 opacity-70 hover:opacity-100 transition-opacity">
                            <h3 className="text-xl font-bold text-white mb-4">Jeff Bezos...</h3>
                            <p className="text-sm text-slate-400 mb-6">¿Se hizo rico vendiendo libros puerta a puerta?</p>
                            <div className="flex items-center justify-center gap-2 text-red-500 font-bold bg-red-500/10 py-2 rounded-lg">
                                <span>❌</span> ¡NO!
                            </div>
                        </div>

                        <div className="bg-emerald-500/5 p-8 rounded-2xl border border-emerald-500/10 shadow-lg shadow-emerald-500/5">
                            <h3 className="text-xl font-bold text-white mb-4">Él construyó el SISTEMA</h3>
                            <p className="text-sm text-slate-300 mb-6">Creó la plataforma (Amazon) donde millones de transacciones ocurren sin él.</p>
                            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 py-2 rounded-lg">
                                <CheckCircle size={16} /> ¡EXACTO!
                            </div>
                        </div>
                    </div>

                    <p className="mt-10 text-slate-400 italic">
                        "Nosotros te entregamos el sistema. Tú no vendes puerta a puerta, tú operas la infraestructura."
                    </p>
                 </div>
            </div>
        </section>

        {/* --- 4. LAS 3 PIEZAS DEL AMAZON (RECUPERADA) --- */}
        <section className="py-24 bg-[#0F1115]">
             <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-2 block">Tu Franquicia Digital Incluye</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white">El "Amazon" llave en mano</h2>
                    <p className="text-slate-400 mt-4">Las 3 piezas listas para operar desde el Día 1.</p>
                </div>

                {/* BIMETALLIC: Íconos titanio, hover → dorado, tarjeta central destacada con dorado */}
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* Pieza 1 */}
                    <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                        <div className="w-12 h-12 bg-[rgba(148,163,184,0.1)] rounded-xl flex items-center justify-center text-[#94A3B8] group-hover:text-[#C5A059] transition-colors mb-6">
                            <Box size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">1. La Fábrica (Producto)</h3>
                        <p className="text-sm text-[#A3A3A3] mb-4 leading-relaxed">
                            Gano Excel pone los productos, las bodegas, los envíos y los empleados. Tecnología propietaria para millones.
                        </p>
                        <p className="text-xs font-bold text-[#64748B] group-hover:text-[#C5A059] transition-colors uppercase">Tecnología Propietaria Única</p>
                    </div>

                    {/* Pieza 2 - DESTACADA con dorado */}
                    <div className="glass-card p-8 rounded-2xl relative overflow-hidden group border-[rgba(197,160,89,0.3)] bg-[rgba(197,160,89,0.05)]">
                        <div className="absolute top-4 right-4 bg-[#C5A059] text-[#0F1115] text-[10px] font-bold px-2 py-1 rounded">IA INTEGRADA</div>
                        <div className="w-12 h-12 bg-[#C5A059] rounded-xl flex items-center justify-center text-[#0F1115] mb-6 shadow-lg shadow-[rgba(197,160,89,0.3)]">
                            <Bot size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">2. La App (Tecnología)</h3>
                        <p className="text-sm text-[#E5E5E5] mb-4 leading-relaxed">
                            CreaTuActivo.com es tu aplicación inteligente. Tiene una IA que educa, filtra y cierra el negocio por ti las 24 horas.
                        </p>
                        <p className="text-xs font-bold text-[#C5A059] uppercase">Trabaja mientras duermes</p>
                    </div>

                    {/* Pieza 3 */}
                    <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                        <div className="w-12 h-12 bg-[rgba(148,163,184,0.1)] rounded-xl flex items-center justify-center text-[#94A3B8] group-hover:text-[#C5A059] transition-colors mb-6">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">3. El Método (Mapa)</h3>
                        <p className="text-sm text-[#A3A3A3] mb-4 leading-relaxed">
                            No improvisas. Sigues 3 pasos simples (Iniciar, Acoger, Activar) que ya funcionaron para miles de personas.
                        </p>
                        <p className="text-xs font-bold text-[#64748B] group-hover:text-[#C5A059] transition-colors uppercase">Sistema Probado</p>
                    </div>
                </div>
             </div>
        </section>

        {/* --- 5. TIMELINE (SCARCITY) --- */}
        <section className="py-24 bg-[#15171C]/50 border-y border-white/5">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16">
                    <div className="inline-block border border-amber-500/30 bg-amber-500/10 px-4 py-1 rounded-full text-amber-500 text-xs font-bold uppercase mb-4">Ventana de Oportunidad</div>
                    <h2 className="text-3xl font-bold text-white mb-2">3 Fases de Lanzamiento</h2>
                    <p className="text-slate-400 text-sm">Como Apple lanzó el iPhone: los primeros en la fila tienen ventaja.</p>
                </div>

                <div className="relative py-12 px-4">
                    <div className="phase-line"></div>
                    <div className="phase-progress w-[33%]"></div>

                    <div className="grid grid-cols-3 gap-4 relative z-10">
                        <PhaseNode isActive={true} title="Lista Privada" date="Hoy - 04 Ene" spots="150 Cupos" />
                        <PhaseNode isPast={false} title="Pre-Lanzamiento" date="05 Ene - 01 Mar" spots="22,500" />
                        <PhaseNode isPast={false} title="Lanzamiento Global" date="02 Mar 2026" spots="4M+" />
                    </div>
                </div>

                {/* BIMETALLIC: Countdown card con borde dorado */}
                <div className="mt-16 glass-card p-8 rounded-3xl max-w-2xl mx-auto text-center border-[rgba(197,160,89,0.3)] bg-[rgba(197,160,89,0.05)]">
                    <p className="text-[#C5A059] font-bold uppercase tracking-widest text-xs mb-6">Tiempo Restante para cerrar Lista Privada</p>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-[#0F1115]/50 rounded-xl p-3"><span className="text-3xl md:text-4xl font-bold text-white">23</span><p className="text-[10px] text-slate-500 mt-1">DÍAS</p></div>
                        <div className="bg-[#0F1115]/50 rounded-xl p-3"><span className="text-3xl md:text-4xl font-bold text-white">03</span><p className="text-[10px] text-slate-500 mt-1">HRS</p></div>
                        <div className="bg-[#0F1115]/50 rounded-xl p-3"><span className="text-3xl md:text-4xl font-bold text-white">06</span><p className="text-[10px] text-slate-500 mt-1">MIN</p></div>
                        <div className="bg-[#0F1115]/50 rounded-xl p-3"><span className="text-3xl md:text-4xl font-bold text-white">43</span><p className="text-[10px] text-slate-500 mt-1">SEG</p></div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- 6. COMPARATIVA (RED VS GREEN) --- */}
        <section className="py-24 bg-[#0F1115]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">¿Ves la diferencia ahora?</h2>
                    <p className="text-slate-400 font-light">No estamos ofreciendo un empleo. Estamos ofreciendo construir un <strong className="text-white">activo</strong>.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Rojo */}
                    <div className="p-10 rounded-3xl border border-red-500/10 bg-red-500/5 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-4 mb-8 text-red-500"><Briefcase size={24}/><h3 className="text-xl font-bold text-white">Modelo Tradicional</h3></div>
                        <div className="space-y-6">
                            <div className="flex justify-between border-b border-red-500/10 pb-4"><span className="text-xs font-bold text-slate-500 uppercase">Tu Rol</span><span className="text-red-400 text-sm text-right">❌ Vendedor manual</span></div>
                            <div className="flex justify-between border-b border-red-500/10 pb-4"><span className="text-xs font-bold text-slate-500 uppercase">Tu Tiempo</span><span className="text-red-400 text-sm text-right">❌ Reuniones físicas</span></div>
                            <div className="flex justify-between border-b border-red-500/10 pb-4"><span className="text-xs font-bold text-slate-500 uppercase">Resultado</span><span className="text-red-400 text-sm text-right">❌ Ingreso Lineal</span></div>
                        </div>
                    </div>
                    {/* Verde */}
                    <div className="p-10 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 shadow-2xl shadow-emerald-500/5 transform md:-translate-y-4">
                        <div className="flex items-center gap-4 mb-8 text-emerald-400"><TrendingUp size={24}/><h3 className="text-xl font-bold text-white">Ecosistema Digital</h3></div>
                        <div className="space-y-6">
                            <div className="flex justify-between border-b border-emerald-500/20 pb-4"><span className="text-xs font-bold text-slate-400 uppercase">Tu Rol</span><span className="text-emerald-400 text-sm text-right font-bold">✅ Dueño de Sistema</span></div>
                            <div className="flex justify-between border-b border-emerald-500/20 pb-4"><span className="text-xs font-bold text-slate-400 uppercase">Tu Tiempo</span><span className="text-emerald-400 text-sm text-right font-bold">✅ 15 min/día (App)</span></div>
                            <div className="flex justify-between border-b border-emerald-500/20 pb-4"><span className="text-xs font-bold text-slate-400 uppercase">Resultado</span><span className="text-emerald-400 text-sm text-right font-bold">✅ Renta Vitalicia</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- 7. PRUEBA SOCIAL (LÍDERES) --- */}
        <section className="py-24 bg-[#15171C]border-t border-white/5">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Lo que dicen los Líderes</h2>
                    <div className="flex justify-center gap-8 text-slate-400 text-sm font-bold uppercase tracking-widest mt-6">
                        <span>+2,847 Personas</span>
                        <span>•</span>
                        <span>12 Años de Éxito</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {[
                        {name: "Liliana P.", role: "Empresaria", quote: "Descubrí que esto no es solo un negocio; es un vehículo para transformar tu realidad.", ini: "LM"},
                        {name: "Andrés G.", role: "Sector Salud", quote: "Con esta tecnología, es como pasar de construir a mano a tener una imprenta 3D.", ini: "AG"},
                        {name: "Dr. Jonathan", role: "Médico", quote: "Como médico, mi tiempo es limitado. Ahora logro resultados con un 20% del esfuerzo.", ini: "JM"},
                        {name: "Juan Pablo", role: "Ex-Bancario", quote: "La gente no sigue un producto, sigue una visión. Esta tecnología es la pieza que faltaba.", ini: "JP"}
                    ].map((lider, i) => (
                        <div key={i} className="glass-card p-6 rounded-2xl hover:bg-white/5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-white">{lider.ini}</div>
                                <div><p className="font-bold text-white text-sm">{lider.name}</p><p className="text-[10px] text-slate-500 uppercase">{lider.role}</p></div>
                            </div>
                            <p className="text-xs text-slate-400 italic">"{lider.quote}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* --- 8. FORMULARIO DE ADMISIÓN --- */}
        {/* BIMETALLIC: Spotlight dorado sutil */}
        <section id="aplicacion" className="py-24 bg-[#15171C] relative overflow-hidden" ref={formTopRef}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[rgba(197,160,89,0.05)] rounded-full blur-[100px]"></div>

            <div className="container mx-auto px-4 relative z-10 max-w-2xl">
                {/* BIMETALLIC: Crown dorado (es premio) */}
                <div className="glass-card p-8 md:p-12 rounded-3xl border border-[rgba(255,255,255,0.1)] shadow-2xl">
                    <div className="text-center mb-10">
                        <Crown className="w-12 h-12 text-[#C5A059] mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-white mb-2">Solicitud de Admisión</h2>
                        <p className="text-slate-400 text-sm">
                            Este no es un registro abierto. Es una aplicación para trabajar directamente con Luis Cabrejo.
                        </p>
                    </div>

                    {isSuccess ? (
                        <div className="text-center py-12 animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">¡Aplicación Enviada!</h3>
                            <p className="text-slate-400 mb-6">
                                Tu perfil ha entrado en revisión prioritaria. Te contactaremos por WhatsApp en breve.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {formStep === 1 && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tu Nombre</label>
                                        <input type="text" required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} onKeyDown={handleKeyDown} className="w-full px-4 py-3 rounded-xl input-premium outline-none" placeholder="Ej: Juan Pérez" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">WhatsApp</label>
                                        <input type="tel" required value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} onKeyDown={handleKeyDown} className="w-full px-4 py-3 rounded-xl input-premium outline-none" placeholder="+57 300 000 0000" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                                        <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} onKeyDown={handleKeyDown} className="w-full px-4 py-3 rounded-xl input-premium outline-none" placeholder="juan@gmail.com" />
                                    </div>
                                    {/* BIMETALLIC: Botón titanio para pasos secundarios */}
                                    <button type="button" onClick={nextStep} disabled={!isStepValid()} className="w-full py-4 mt-4 bg-[#94A3B8] hover:bg-[#C5A059] text-[#0F1115] font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">Siguiente Paso <ChevronRight size={20} /></button>
                                </div>
                            )}

                            {formStep === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4">¿Qué perfil te describe mejor?</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {arquetipos.map((arq) => (
                                                <div key={arq.id} onClick={() => setFormData({...formData, arquetipo: arq.title})} className={`p-3 rounded-xl border cursor-pointer transition-all hover:bg-white/5 ${formData.arquetipo === arq.title ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-[#15171C]/50'}`}>
                                                    <div className="flex items-center gap-2 mb-1"><span className={arq.iconColor}>{arq.icon}</span><span className="font-bold text-sm text-white">{arq.title}</span></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4">Capacidad de Inversión Inicial</h3>
                                        <div className="space-y-2">
                                            {[
                                              'Básica - $900,000 COP (~$200 USD)',
                                              'Empresarial 1 - $2,250,000 COP (~$500 USD)',
                                              'Empresarial 2 - $4,500,000 COP (~$1,000 USD)',
                                              'Necesito asesoría financiera'
                                            ].map((opt) => (
                                                <div key={opt} onClick={() => setFormData({...formData, inversion: opt})} className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between ${formData.inversion === opt ? 'border-[#C5A059] bg-[rgba(197,160,89,0.1)] text-white' : 'border-[rgba(255,255,255,0.1)] bg-[#15171C]/50 text-[#A3A3A3]'}`}><span>{opt}</span>{formData.inversion === opt && <CheckCircle size={18} className="text-[#C5A059]"/>}</div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* BIMETALLIC: CTA final dorado */}
                                    <button type="submit" disabled={isSubmitting || !isStepValid()} className="w-full py-4 bg-[#C5A059] text-[#0F1115] font-bold rounded-xl text-lg hover:bg-[#D4AF37] transition-all shadow-lg shadow-[rgba(197,160,89,0.2)] flex items-center justify-center gap-2">{isSubmitting ? 'Enviando...' : 'Aplicar a Fundador'} <Rocket size={20} /></button>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="py-12 text-center text-[#64748B] text-sm border-t border-[rgba(148,163,184,0.15)]">
            <p className="font-bold text-white mb-2">CreaTuActivo.com</p>
            <p className="mt-4 text-xs opacity-50">&copy; 2026 Todos los derechos reservados.</p>
        </footer>
      </div>
    </>
  )
}
