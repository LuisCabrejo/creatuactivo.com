/**
 * Copyright © 2025 CreaTuActivo.com
 * Landing Page: "Reto de los 12 Días"
 * Estrategia: Apple Aesthetic + Low Friction Form + High Authority.
 */

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Users, TrendingUp, Crown, ChevronRight, ChevronDown,
  Zap, Star, Calendar, Globe, Database, CheckCircle,
  Send, AlertCircle, Play, ShieldCheck, ArrowRight, Pause, Flame
} from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'
import AnimatedCountUp from '@/components/AnimatedCountUp'
import { useHydration } from '@/hooks/useHydration'

// --- Estilos CSS Globales (Premium & Clean) ---
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --slate-900: #0F172A;
      --slate-950: #020617;
    }

    /* TIPOGRAFÍA TITULARES (Estilo Apple: Blanco a Plata) */
    .creatuactivo-h1-ecosystem {
      font-weight: 800;
      background: linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.04em;
    }

    /* EFECTO VIDRIO (Glassmorphism) */
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
      border-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    /* TARJETAS DE DÍA (Reto) */
    .day-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      transition: all 0.3s ease;
    }
    .day-card.active {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.4);
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
    }

    /* TABLA FINANCIERA (Estilo Bloomberg) */
    .projection-row {
      transition: all 0.2s ease;
    }
    .projection-row:hover {
      background: rgba(255, 255, 255, 0.03);
    }
    .milestone-row {
      background: rgba(245, 158, 11, 0.05);
      border-left: 2px solid rgba(245, 158, 11, 0.5);
    }

    /* FORMULARIO */
    .input-premium {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      transition: all 0.3s;
    }
    .input-premium:focus {
      border-color: #3B82F6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }
  `}</style>
);

// --- DATOS DEL SISTEMA ---
const projectionData = [
  { level: 1, people: 2, income: 25200 },
  { level: 2, people: 4, income: 75600 },
  { level: 3, people: 8, income: 176400 },
  { level: 4, people: 16, income: 378000 },
  { level: 5, people: 32, income: 781200 },
  { level: 6, people: 64, income: 1587600 },
  { level: 7, people: 128, income: 3200400 },
  { level: 8, people: 256, income: 6426000 },
  { level: 9, people: 512, income: 12877200 },
  { level: 10, people: 1024, income: 25779600 },
  { level: 11, people: 2048, income: 51584400 },
  { level: 12, people: 4096, income: 103194000 },
];

const challengeDays = [
  { day: 1, action: "Fase de Inicio", people: 2 },
  { day: 2, action: "Duplicación", people: 4 },
  { day: 3, action: "Validación", people: 8 },
  { day: 4, action: "Tracción", people: 16 },
  { day: 5, action: "Velocidad", people: 32 },
  { day: 6, action: "Momentum", people: 64 },
  { day: 7, action: "Escalamiento", people: 128 },
  { day: 8, action: "Expansión", people: 256 },
  { day: 9, action: "Consolidación", people: 512 },
  { day: 10, action: "Liderazgo", people: 1024 },
  { day: 11, action: "Masificación", people: 2048 },
  { day: 12, action: "Libertad", people: 4096 },
];

// --- COMPONENTES ---

const StatCard = ({ icon, value, label, sublabel }: any) => (
  <div className="glass-card p-6 rounded-2xl text-center">
    <div className="mb-3 flex justify-center text-blue-400">{icon}</div>
    <p className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</p>
    <p className="text-sm font-semibold text-slate-300">{label}</p>
    <p className="text-xs text-slate-500 mt-1">{sublabel}</p>
  </div>
);

const ChallengeDay = ({ day, action, people, isActive, isCompleted, isPaused, onClick }: {
  day: number, action: string, people: number, isActive: boolean, isCompleted: boolean, isPaused?: boolean, onClick?: () => void
}) => {
  const getIcon = () => {
    if (isCompleted) return <CheckCircle className="w-3 h-3 text-emerald-400" />;
    if (isActive && isPaused) return <Pause className="w-3 h-3 text-blue-400" />;
    if (isActive) return <Flame className="w-3 h-3 text-amber-400" />;
    return <Calendar className="w-3 h-3 text-slate-500" />;
  };
  return (
    <div
      className={`day-card p-3 text-center ${isActive ? 'active' : ''} ${isCompleted ? 'opacity-50' : ''} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      title={isActive && isPaused ? 'Pausado - Clic para continuar' : isActive ? 'En progreso - Clic para pausar' : 'Clic para saltar a este ciclo'}
    >
      <div className="flex items-center justify-center gap-1 mb-1">
        {getIcon()}
        <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive && isPaused ? 'text-blue-400' : isActive ? 'text-amber-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>Ciclo {day}</span>
      </div>
      <p className={`text-xl font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{people}</p>
      <p className="text-[10px] text-slate-500 mt-1">{action}</p>
    </div>
  );
};

const ProjectionRow = ({ level, people, income }: any) => (
  <tr className={`projection-row border-b border-white/5 ${level >= 10 ? 'milestone-row' : ''}`}>
    <td className="py-3 px-4 text-slate-400 font-mono text-sm">Nivel {level}</td>
    <td className="py-3 px-4 text-white font-mono text-sm text-center">{people.toLocaleString()}</td>
    <td className="py-3 px-4 text-right font-mono text-sm font-bold text-emerald-400">
      ${income.toLocaleString('es-CO')}
    </td>
  </tr>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="glass-card rounded-xl overflow-hidden mb-3">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full p-5 text-left flex items-center justify-between hover:bg-white/5">
          <h3 className="text-sm font-bold text-white pr-4">{question}</h3>
          <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="px-5 pb-5 pt-0">
            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line border-t border-white/5 pt-4">{answer}</p>
          </div>
        )}
      </div>
    );
};

export default function Reto12DiasPage() {
  const isHydrated = useHydration();
  const [animatedDay, setAnimatedDay] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const challengeSectionRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', selectedPackage: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');

  // Manejar clic en un ciclo para pausar/reanudar
  const handleDayClick = (clickedDay: number) => {
    if (clickedDay === animatedDay) {
      // Toggle pausa en el ciclo activo
      setIsPaused(prev => !prev);
    } else {
      // Saltar a otro ciclo y pausar
      setAnimatedDay(clickedDay);
      setIsPaused(true);
    }
  };

  // Animación automática del reto (1.5s, loop infinito)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setAnimatedDay(prev => prev < 12 ? prev + 1 : 1);
    }, 1500);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-950 text-slate-200 min-h-screen font-sans selection:bg-blue-500/30">
        <StrategicNavigation />

        {/* --- HERO: PROTOCOLO DE CRECIMIENTO --- */}
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Fondo Sutil (Apple Style) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div initial={isHydrated ? { opacity: 0, y: 20 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Protocolo de Ejecución 2025
                    </div>

                    <h1 className="creatuactivo-h1-ecosystem text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
                        Sprint de 12 Ciclos. <br />
                        <span className="text-white">Libertad Vitalicia.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        No necesitas años para construir un activo. Necesitas <strong className="text-white">velocidad y sistema</strong>.
                        Ejecuta este protocolo financiero y comprime 5 años de trabajo en 12 ciclos de duplicación.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="#reservar" className="px-8 py-4 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2">
                            Iniciar Protocolo <ArrowRight size={18} />
                        </Link>
                        <div className="px-6 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center gap-2 text-sm text-slate-300">
                            <Crown size={16} className="text-amber-400" />
                            <span>Solo <strong>150 Cupos</strong> Fundador</span>
                        </div>
                    </div>

                </motion.div>
            </div>
        </section>

        {/* --- VISUALIZACIÓN DEL RETO (GRID) --- */}
        <section ref={challengeSectionRef} className="py-20 border-t border-white/5 bg-slate-900/50">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-white mb-2">Visualización del Algoritmo 2x2</h2>
                    <p className="text-slate-400 text-sm">El poder del interés compuesto aplicado a las relaciones humanas.</p>
                    <p className="text-xs text-slate-500 mt-2">Clic en cualquier ciclo para pausar o saltar</p>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
                    {challengeDays.map((day) => (
                        <ChallengeDay
                            key={day.day}
                            {...day}
                            isActive={day.day === animatedDay}
                            isCompleted={day.day < animatedDay}
                            isPaused={day.day === animatedDay && isPaused}
                            onClick={() => handleDayClick(day.day)}
                        />
                    ))}
                </div>
            </div>
        </section>

        {/* --- LOS 3 GIGANTES (REFINADO) --- */}
        <section className="py-24 bg-slate-950 relative">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Tu ecosistema de respaldo</h2>
                    <p className="text-slate-400 font-light">Minimizamos el riesgo a cero. Tú solo pones la conexión.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="glass-card p-10 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Users size={100} /></div>
                        <h3 className="text-2xl font-bold text-white mb-2">1. TÚ</h3>
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-6">El Conector</p>
                        <p className="text-slate-400 text-sm leading-relaxed">Tu único rol es conectar personas con el sistema. No vendes, no convences. Solo invitas a evaluar.</p>
                    </div>

                    <div className="glass-card p-10 rounded-3xl relative overflow-hidden group border-blue-500/20 bg-blue-500/5">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Database size={100} /></div>
                        <h3 className="text-2xl font-bold text-white mb-2">2. SISTEMA</h3>
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-6">La Inteligencia</p>
                        <p className="text-slate-300 text-sm leading-relaxed"><strong>CreaTuActivo AI</strong> explica el negocio, filtra a los curiosos y cierra a los interesados. Trabaja 24/7 por ti.</p>
                    </div>

                    <div className="glass-card p-10 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Globe size={100} /></div>
                        <h3 className="text-2xl font-bold text-white mb-2">3. SOCIO</h3>
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6">El Capital</p>
                        <p className="text-slate-400 text-sm leading-relaxed">Gano Excel pone la infraestructura de mil millones de dólares, el producto, la legalidad y los pagos.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* --- MATEMÁTICA FINANCIERA (TABLA BLOOMBERG) --- */}
        <section className="py-24 bg-slate-900 border-y border-white/5">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Proyección Financiera</h2>
                    <p className="text-slate-400 text-sm">Basado en el modelo de duplicación perfecta 2x2. Cifras en COP.</p>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/50 border-b border-white/10">
                                <tr>
                                    <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ciclo / Nivel</th>
                                    <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Socios Activos</th>
                                    <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Renta Acumulada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projectionData.map((row) => (
                                    <ProjectionRow key={row.level} {...row} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <p className="text-xs text-slate-600 text-center mt-6 max-w-2xl mx-auto">
                    * Proyección matemática ilustrativa basada en el plan de compensación de Gano Excel S.A. Los resultados dependen del esfuerzo individual.
                </p>
            </div>
        </section>

        {/* --- FAQ ESTRATÉGICO --- */}
        <section className="py-20 bg-slate-950">
            <div className="container mx-auto px-4 max-w-2xl">
                <h2 className="text-3xl font-bold text-white mb-10 text-center">Resolviendo Dudas</h2>
                <div className="space-y-2">
                    <FAQItem
                        question="¿Qué pasa si no consigo 2 personas en un día?"
                        answer="Nada. El 'Reto de 12 Días' es un protocolo de velocidad, pero tú marcas tu ritmo. Puedes hacerlo en 12 semanas o 12 meses. El sistema te espera."
                    />
                    <FAQItem
                        question="¿Es seguro poner mi dinero?"
                        answer="100%. No nos das el dinero a nosotros. Le compras directamente a Gano Excel S.A. (Gran Contribuyente DIAN). Recibes factura legal y producto físico equivalente a tu inversión."
                    />
                    <FAQItem
                        question="¿Por qué piden cupos limitados?"
                        answer="Porque trabajamos con mentoría personalizada. No somos vendedores de cursos, somos socios constructores. Una vez completamos el equipo de 150, cerramos la sala de estrategia."
                    />
                    <FAQItem
                        question="¿De dónde salen los $103 millones de la proyección?"
                        answer="Es matemática pura basada en el plan de compensación de Gano Excel. Cada socio activo genera aproximadamente $25,200 COP en comisiones por nivel. En el ciclo 12, con 4,096 socios activos consumiendo mensualmente, la suma acumulada de todos los niveles alcanza los $103 millones COP. No es magia, es el poder del interés compuesto aplicado a las relaciones humanas."
                    />
                    <FAQItem
                        question="¿Cuál es la diferencia entre los paquetes?"
                        answer="La diferencia está en el inventario inicial y el porcentaje de comisiones que desbloqueas:

• Paquete Inicial ($900k): Inventario básico, comisiones al 20%. Ideal para probar el modelo.
• Paquete Empresarial ($2.25M): Inventario profesional, comisiones al 50%, mentoría grupal.
• Paquete Visionario ($4.5M): Inventario máximo, comisiones al 100%, mentoría directa con Diamantes y acceso al Club de Fundadores.

Todos tienen acceso al sistema y la tecnología. La diferencia es la velocidad con la que puedes escalar."
                    />
                </div>
            </div>
        </section>

        {/* --- FORMULARIO DE ALTA CONVERSIÓN (LOW FRICTION) --- */}
        <section id="reservar" className="py-24 bg-slate-900 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[100px]"></div>

            <div className="container mx-auto px-4 relative z-10 max-w-xl">
                <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="text-center mb-8">
                        <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-white mb-2">Reserva tu Posición</h2>
                        <p className="text-slate-400 text-sm">
                            Paso 1: Pre-registro. <br/>
                            Los datos bancarios y legales se formalizarán después.
                        </p>
                    </div>

                    {submitStatus === 'success' ? (
                        <div className="text-center py-12 animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">¡Solicitud Recibida!</h3>
                            <p className="text-slate-400 mb-6">
                                Tu pre-reserva está en el sistema. Revisa tu correo electrónico y un asesor Fundador te contactará en breve vía WhatsApp.
                            </p>
                            <a href="https://wa.me/573102066593" className="inline-flex items-center gap-2 text-green-400 font-bold hover:underline">
                                Agilizar proceso por WhatsApp <ArrowRight size={16} />
                            </a>
                        </div>
                    ) : (
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setIsSubmitting(true);
                            try {
                                const res = await fetch('/api/fundadores/pre-registro', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(formData),
                                });
                                if (res.ok) {
                                    setSubmitStatus('success');
                                }
                            } catch (err) {
                                console.error('Error submitting form:', err);
                            } finally {
                                setIsSubmitting(false);
                            }
                        }} className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Tu Nombre</label>
                                <input
                                    type="text" required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl input-premium outline-none"
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Correo Electrónico</label>
                                <input
                                    type="email" required
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl input-premium outline-none"
                                    placeholder="tu@email.com"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">WhatsApp</label>
                                <input
                                    type="tel" required
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl input-premium outline-none"
                                    placeholder="+57 300 000 0000"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Nivel de Interés</label>
                                <select
                                    value={formData.selectedPackage}
                                    onChange={(e) => setFormData(prev => ({ ...prev, selectedPackage: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl input-premium outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="Visionario - $4.500.000">Quiero ser Fundador (Inversión $4.5M)</option>
                                    <option value="Empresarial - $2.250.000">Quiero ser Empresario (Inversión $2.25M)</option>
                                    <option value="Inicial - $900.000">Quiero Iniciar Básico (Inversión $900k)</option>
                                    <option value="Solo curiosidad">Solo tengo curiosidad</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-white text-slate-950 font-bold rounded-xl text-lg hover:bg-slate-200 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-950 rounded-full animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 text-amber-500 fill-current" />
                                        Asegurar mi Cupo Ahora
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] text-slate-500 text-center mt-4">
                                * Tus datos están protegidos. No te cobraremos nada en esta pantalla.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="py-12 text-center text-slate-500 text-sm border-t border-white/5">
            <p>&copy; 2025 CreaTuActivo.com</p>
        </footer>

      </div>
    </>
  );
}
