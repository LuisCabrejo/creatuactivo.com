/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, TrendingUp, Crown, Rocket, Target, ChevronRight, ChevronDown,
  DollarSign, Coffee, Calendar, Zap, Star, Clock, Gift, Flame,
  Globe, Cpu, Database, CheckCircle, Upload, Send, FileImage, MapPin,
  CreditCard, CheckCircle2, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'
import AnimatedCountUp from '@/components/AnimatedCountUp'
import { useHydration } from '@/hooks/useHydration'

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
    .creatuactivo-h2-component {
        font-weight: 700;
        background: linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .text-gradient-gold {
      background: linear-gradient(135deg, #FBBF24 0%, #D97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }
    .text-gradient-fire {
      background: linear-gradient(135deg, #EF4444 0%, #F59E0B 50%, #FBBF24 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
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
      transform: translateY(-4px);
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
    .projection-row {
      transition: all 0.3s ease;
    }
    .projection-row:hover {
      background: rgba(124, 58, 237, 0.15);
    }
    .level-badge {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%);
      border: 1px solid rgba(124, 58, 237, 0.3);
    }
    .milestone-row {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%);
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    .day-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 12px;
      transition: all 0.3s ease;
    }
    .day-card:hover {
      transform: scale(1.05);
      border-color: rgba(245, 158, 11, 0.5);
      box-shadow: 0 8px 25px rgba(245, 158, 11, 0.2);
    }
    .day-card.active {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 88, 12, 0.2) 100%);
      border: 2px solid rgba(245, 158, 11, 0.6);
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
    }
    .pulse-glow {
      animation: pulseGlow 2s ease-in-out infinite;
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.3); }
      50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.6); }
    }
    .historic-badge {
      background: linear-gradient(135deg, #DC2626 0%, #F59E0B 100%);
      animation: shimmer 2s ease-in-out infinite;
    }
    @keyframes shimmer {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    .creatuactivo-faq-item {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%);
      border: 1px solid rgba(124, 58, 237, 0.15);
      border-radius: 12px;
      transition: all 0.3s ease;
    }
    .creatuactivo-faq-item:hover {
      border-color: rgba(245, 158, 11, 0.3);
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.12) 0%, rgba(124, 58, 237, 0.12) 100%);
    }
  `}</style>
);

// Datos de proyección 2×2 a 12 niveles con cálculos financieros en COP
const projectionData = [
  { level: 1, people: 2, cvPerSide: 52, bonus10: 23400, acum10: 23400, acum15: 35100, acum16: 37440, acum17: 39780 },
  { level: 2, people: 4, cvPerSide: 104, bonus10: 46800, acum10: 70200, acum15: 105300, acum16: 112320, acum17: 119340 },
  { level: 3, people: 8, cvPerSide: 208, bonus10: 93600, acum10: 163800, acum15: 245700, acum16: 262080, acum17: 278460 },
  { level: 4, people: 16, cvPerSide: 416, bonus10: 187200, acum10: 351000, acum15: 526500, acum16: 561600, acum17: 596700 },
  { level: 5, people: 32, cvPerSide: 832, bonus10: 374400, acum10: 725400, acum15: 1088100, acum16: 1160640, acum17: 1233180 },
  { level: 6, people: 64, cvPerSide: 1664, bonus10: 748800, acum10: 1474200, acum15: 2211300, acum16: 2358720, acum17: 2506140 },
  { level: 7, people: 128, cvPerSide: 3328, bonus10: 1497600, acum10: 2971800, acum15: 4457700, acum16: 4754880, acum17: 5052060 },
  { level: 8, people: 256, cvPerSide: 6656, bonus10: 2995200, acum10: 5967000, acum15: 8950500, acum16: 9547200, acum17: 10143900 },
  { level: 9, people: 512, cvPerSide: 13312, bonus10: 5990400, acum10: 11957400, acum15: 17936100, acum16: 19131840, acum17: 20327580 },
  { level: 10, people: 1024, cvPerSide: 26624, bonus10: 11980800, acum10: 23938200, acum15: 35907300, acum16: 38301120, acum17: 40694940 },
  { level: 11, people: 2048, cvPerSide: 53248, bonus10: 23961600, acum10: 47899800, acum15: 71849700, acum16: 76639680, acum17: 81429660 },
  { level: 12, people: 4096, cvPerSide: 106496, bonus10: 47923200, acum10: 95823000, acum15: 143734500, acum16: 153316800, acum17: 162899100 },
];

const totals = {
  people: 8190,
  cv: 212940,
  bonus10: 95823000,
  bonus15: 143734500,
  bonus16: 153316800,
  bonus17: 162899100,
};

// Reto de los 12 Días
const challengeDays = [
  { day: 1, action: "Tú arrancas", people: 1 },
  { day: 2, action: "Invitas a 2", people: 2 },
  { day: 3, action: "Ellos invitan", people: 4 },
  { day: 4, action: "4 → 8", people: 8 },
  { day: 5, action: "8 → 16", people: 16 },
  { day: 6, action: "16 → 32", people: 32 },
  { day: 7, action: "32 → 64", people: 64 },
  { day: 8, action: "64 → 128", people: 128 },
  { day: 9, action: "128 → 256", people: 256 },
  { day: 10, action: "256 → 512", people: 512 },
  { day: 11, action: "512 → 1024", people: 1024 },
  { day: 12, action: "1024 → 2048", people: 2048 },
];

const CHALLENGE_START_DATE = new Date('2024-12-09T00:00:00');
const CHALLENGE_END_DATE = new Date('2024-12-20T23:59:59');

const getCurrentChallengeDay = () => {
  const now = new Date();
  const diffTime = now.getTime() - CHALLENGE_START_DATE.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(12, diffDays));
};

const getDaysRemaining = () => {
  const now = new Date();
  const diffTime = CHALLENGE_END_DATE.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Componentes
const TriadCard = ({ icon, title, role, description, color }: { icon: React.ReactNode, title: string, role: string, description: string, color: string }) => (
  <div className="creatuactivo-component-card p-8 rounded-2xl relative overflow-hidden group h-full">
    <div className={`absolute top-0 left-0 w-full h-1 bg-${color}-500 opacity-50`}></div>
    <div className="mb-6 inline-block p-4 rounded-xl bg-slate-800/50 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
    <p className={`text-sm font-bold text-${color}-400 uppercase tracking-wider mb-4`}>{role}</p>
    <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
  </div>
);

const StatCard = ({ icon, value, label, sublabel, color = "blue", prefix = "", suffix = "", animatedValue, decimals = 0 }: { icon: React.ReactNode, value: string, label: string, sublabel?: string, color?: "blue" | "purple" | "amber" | "green", prefix?: string, suffix?: string, animatedValue?: number, decimals?: number }) => {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
    amber: "from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400",
    green: "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400"
  };
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6 text-center`}>
      <div className="mb-3 flex justify-center">{icon}</div>
      <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">
        {animatedValue !== undefined ? (
          <><span>{prefix}</span><AnimatedCountUp end={animatedValue} duration={2} decimals={decimals} /><span>{suffix}</span></>
        ) : value}
      </p>
      <p className="text-sm font-semibold text-slate-300">{label}</p>
      {sublabel && <p className="text-xs text-slate-500 mt-1">{sublabel}</p>}
    </div>
  );
};

const ChallengeDay = ({ day, action, people, isActive, isCompleted, delay }: { day: number, action: string, people: number, isActive: boolean, isCompleted: boolean, delay: number }) => {
  const isHydrated = useHydration();
  const getIcon = () => {
    if (isCompleted) return <Star className="w-4 h-4 text-green-400" />;
    if (isActive) return <Flame className="w-4 h-4 text-amber-400" />;
    return <Calendar className="w-4 h-4 text-slate-400" />;
  };
  return (
    <motion.div
      initial={isHydrated ? { opacity: 0, scale: 0.8 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: delay * 0.05 }}
      className={`day-card p-3 md:p-4 text-center ${isActive ? 'active pulse-glow' : ''} ${isCompleted ? 'opacity-70' : ''}`}
    >
      <div className="flex items-center justify-center gap-1 mb-1">
        {getIcon()}
        <span className={`text-xs font-bold ${isActive ? 'text-amber-400' : isCompleted ? 'text-green-400' : 'text-slate-400'}`}>
          DÍA {day}
        </span>
      </div>
      <p className={`text-lg md:text-xl font-extrabold ${isActive ? 'text-white' : 'text-slate-300'}`}>
        {people.toLocaleString('es-CO')}
      </p>
      <p className="text-[10px] md:text-xs text-slate-400 mt-1 line-clamp-1">{action}</p>
    </motion.div>
  );
};

const ProjectionRow = ({ level, people, cvPerSide, bonus10, acum10, acum15, acum16, acum17, isAnimated, delay }: { level: number, people: number, cvPerSide: number, bonus10: number, acum10: number, acum15: number, acum16: number, acum17: number, isAnimated: boolean, delay: number }) => {
  const isHydrated = useHydration();
  const isHighlight = level >= 10;
  const formatCOP = (value: number) => `$${value.toLocaleString('es-CO')}`;
  return (
    <motion.tr
      initial={isHydrated && isAnimated ? { opacity: 0, x: -20 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08 }}
      className={`projection-row ${isHighlight ? 'milestone-row' : ''}`}
    >
      <td className="py-3 px-2 md:px-3">
        <span className={`level-badge w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm ${level <= 4 ? 'text-blue-400' : level <= 8 ? 'text-purple-400' : 'text-amber-400'}`}>
          {level}
        </span>
      </td>
      <td className="py-3 px-2 md:px-3 text-center"><span className="font-mono font-bold text-white text-xs md:text-sm">{people.toLocaleString('es-CO')}</span></td>
      <td className="py-3 px-2 md:px-3 text-center"><span className="font-mono text-slate-300 text-xs md:text-sm">{cvPerSide.toLocaleString('es-CO')}</span></td>
      <td className="py-3 px-2 md:px-3 text-center"><span className="font-mono text-slate-300 text-xs md:text-sm">{formatCOP(bonus10)}</span></td>
      <td className="py-3 px-2 md:px-3 text-center"><span className="font-mono font-bold text-green-400 text-xs md:text-sm">{formatCOP(acum10)}</span></td>
      <td className="py-3 px-2 md:px-3 text-center"><span className="font-mono font-bold text-blue-400 text-xs md:text-sm">{formatCOP(acum15)}</span></td>
      <td className="py-3 px-2 md:px-3 text-center"><span className="font-mono font-bold text-purple-400 text-xs md:text-sm">{formatCOP(acum16)}</span></td>
      <td className="py-3 px-2 md:px-3 text-center"><span className="font-mono font-bold text-amber-400 text-xs md:text-sm">{formatCOP(acum17)}</span></td>
    </motion.tr>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="creatuactivo-faq-item">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-6 text-left flex items-center justify-between">
        <h3 className="text-lg font-bold text-white pr-4">{question}</h3>
        <ChevronDown className={`w-6 h-6 text-blue-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.3 }} className="px-6 pb-6">
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">{answer}</p>
        </motion.div>
      )}
    </div>
  );
};

// Componente principal
export default function PresentacionEmpresarial2Page() {
  const isHydrated = useHydration();
  const [showAllLevels, setShowAllLevels] = useState(false);
  const [animateTable, setAnimateTable] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [daysRemaining, setDaysRemaining] = useState(12);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Estado del formulario
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    shippingAddress: '',
    correspondenceAddress: '',
    sameAddress: true,
    bankEntity: '',
    accountNumber: '',
    accountType: 'ahorros',
    sponsorName: '',
    sponsorCode: '',
    notes: '',
    selectedPackage: '',
  });
  const [idFiles, setIdFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const timer = setTimeout(() => setAnimateTable(true), 500);
    setCurrentDay(getCurrentChallengeDay());
    setDaysRemaining(getDaysRemaining());

    // Countdown en tiempo real
    const updateCountdown = () => {
      const now = new Date();
      const diff = CHALLENGE_END_DATE.getTime() - now.getTime();
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    };
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-900 text-white min-h-screen">
        <StrategicNavigation />

        {/* Background effects */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-[var(--creatuactivo-blue)] opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -right-1/4 w-96 h-96 bg-[var(--creatuactivo-purple)] opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/4 left-1/3 w-96 h-96 bg-[var(--creatuactivo-gold)] opacity-5 rounded-full filter blur-3xl animate-pulse"></div>
        </div>

        <main className="relative z-10 pt-28 pb-20 px-4 lg:px-8">

          {/* HERO - DÍA HISTÓRICO */}
          <section className="max-w-5xl mx-auto mb-24 lg:mb-32 text-center">
            <motion.div initial={isHydrated ? { opacity: 0, y: 30 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full historic-badge text-white text-sm font-bold uppercase tracking-wider mb-6 shadow-lg">
                <Flame className="w-4 h-4" />
                DÍA {currentDay} — ¡ARRANCAMOS HOY!
                <Flame className="w-4 h-4" />
              </div>

              <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl lg:text-7xl mb-6">
                Construye el Mejor
                <br />
                Diciembre de tu Vida
              </h1>

              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-6">
                <strong className="text-white">12 días. 12 niveles. Una red de 8,190 personas.</strong>
                <br />
                Con solo <span className="text-gradient-gold">$443,600 COP</span> de inversión mínima.
              </p>

              {/* Countdown en tiempo real */}
              <div className="max-w-lg mx-auto mb-8">
                <p className="text-sm text-slate-400 mb-3 uppercase tracking-wider">El reto termina en:</p>
                <div className="grid grid-cols-4 gap-2 md:gap-3">
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-center">
                    <span className="text-2xl md:text-3xl font-bold text-white">{countdown.days}</span>
                    <p className="text-[10px] md:text-xs text-red-400 uppercase tracking-wider">Días</p>
                  </div>
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-center">
                    <span className="text-2xl md:text-3xl font-bold text-white">{countdown.hours.toString().padStart(2, '0')}</span>
                    <p className="text-[10px] md:text-xs text-red-400 uppercase tracking-wider">Horas</p>
                  </div>
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-center">
                    <span className="text-2xl md:text-3xl font-bold text-white">{countdown.minutes.toString().padStart(2, '0')}</span>
                    <p className="text-[10px] md:text-xs text-red-400 uppercase tracking-wider">Min</p>
                  </div>
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-center animate-pulse">
                    <span className="text-2xl md:text-3xl font-bold text-white">{countdown.seconds.toString().padStart(2, '0')}</span>
                    <p className="text-[10px] md:text-xs text-red-400 uppercase tracking-wider">Seg</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mb-8">
                <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 font-bold">Solo 150 cupos Fundador</span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Hoy es <strong className="text-white">el día histórico</strong>. El día de arrancar.
                <br />
                <span className="text-blue-400">2 personas</span> — eso es todo lo que necesitas invitar.
              </p>
            </motion.div>
          </section>

          {/* QUÉ ESTAMOS CONSTRUYENDO */}
          <section className="max-w-5xl mx-auto mb-24 lg:mb-32 text-center">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">¿Qué estamos construyendo?</h2>
              <p className="text-slate-400 text-lg">No es venta de catálogo. No es repartir café. Es Infraestructura.</p>
            </div>

            <div className="creatuactivo-component-card p-8 lg:p-12 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="grid md:grid-cols-3 gap-8 text-left relative z-10">
                <div>
                  <div className="mb-4 text-blue-400"><Globe size={32} /></div>
                  <h3 className="text-xl font-bold text-white mb-2">Distribución Masiva</h3>
                  <p className="text-slate-400 text-sm">
                    Creamos canales por donde fluyen millones de dólares en productos de consumo diario en toda América.
                  </p>
                </div>
                <div>
                  <div className="mb-4 text-purple-400"><Database size={32} /></div>
                  <h3 className="text-xl font-bold text-white mb-2">Activo Digital</h3>
                  <p className="text-slate-400 text-sm">
                    El mercado que construyes queda codificado a tu nombre. Es tuyo. Heredable y vitalicio.
                  </p>
                </div>
                <div>
                  <div className="mb-4 text-green-400"><TrendingUp size={32} /></div>
                  <h3 className="text-xl font-bold text-white mb-2">Ingreso Residual</h3>
                  <p className="text-slate-400 text-sm">
                    Haces el trabajo bien una vez (construir la red), y cobras cada vez que alguien se toma un café.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3 GIGANTES */}
          <section className="max-w-7xl mx-auto mb-24 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                No estás solo. Tienes <span className="text-gradient-gold">3 Gigantes.</span>
              </h2>
              <p className="text-slate-400">Una alianza estratégica diseñada para que no falles.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <TriadCard
                color="blue"
                icon={<Users size={32} className="text-blue-400" />}
                title="1. TÚ"
                role="La Visión"
                description="Tu único rol es conectar personas. No tienes que convencer, solo invitar a conocer. Tú pones la dirección, el liderazgo y las relaciones."
              />
              <TriadCard
                color="purple"
                icon={<Cpu size={32} className="text-purple-400" />}
                title="2. CreaTuActivo"
                role="La Ejecución"
                description="Tu plataforma tecnológica completa. NEXUS (IA exclusiva) educa, filtra y cualifica. Se encarga de hacer el trabajo pesado y técnico por ti mientras tú vives tu vida."
              />
              <TriadCard
                color="green"
                icon={<Globe size={32} className="text-green-400" />}
                title="3. GANO EXCEL"
                role="La Logística"
                description="El respaldo financiero. Un gigante asiático libre de deudas. Ellos ponen las oficinas, el producto, la importación y te pagan puntualmente."
              />
            </div>
          </section>

          {/* RETO DE LOS 12 DÍAS */}
          <section className="max-w-6xl mx-auto mb-24 lg:mb-32">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                <Zap className="w-6 h-6 inline text-amber-400 mr-2" />
                El Reto de los 12 Días
              </h2>
              <p className="text-slate-400">Un día = Un nivel. Así de simple.</p>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 md:gap-3">
              {challengeDays.map((day, index) => (
                <ChallengeDay
                  key={day.day}
                  day={day.day}
                  action={day.action}
                  people={day.people}
                  isActive={day.day === currentDay}
                  isCompleted={day.day < currentDay}
                  delay={index}
                />
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                <Gift className="w-4 h-4 inline mr-1" />
                Al completar los 12 días: <span className="text-green-400 font-bold">8,190 personas</span> en tu red
              </p>
            </div>
          </section>

          {/* ESTADÍSTICAS CLAVE */}
          <section className="max-w-6xl mx-auto mb-24 lg:mb-32">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatCard icon={<Coffee className="w-8 h-8 text-blue-400" />} value="" animatedValue={443600} prefix="$" label="Inversión Mínima" sublabel="4 cajas Gano Café 3en1" color="blue" />
              <StatCard icon={<TrendingUp className="w-8 h-8 text-purple-400" />} value="" animatedValue={52} suffix=" CV" label="Por Persona" sublabel="Volumen de comisión" color="purple" />
              <StatCard icon={<Users className="w-8 h-8 text-amber-400" />} value="" animatedValue={8190} label="Red al Nivel 12" sublabel="Duplicación 2×2" color="amber" />
              <StatCard icon={<DollarSign className="w-8 h-8 text-green-400" />} value="" animatedValue={95.8} prefix="$" suffix="M" decimals={1} label="Bono Binario COP" sublabel="Acumulado 10% nivel 12" color="green" />
            </div>
          </section>

          {/* TABLA DE PROYECCIÓN */}
          <section className="max-w-7xl mx-auto mb-24 lg:mb-32">
            <div className="text-center mb-8">
              <h2 className="creatuactivo-h2-component text-3xl md:text-4xl font-bold mb-4">
                Proyección Binaria 2×2 en COP
              </h2>
              <p className="text-slate-400">Inversión mínima: <span className="text-white font-semibold">$443,600 COP</span> = <span className="text-blue-400 font-semibold">52 CV</span></p>
              <p className="text-slate-500 text-sm mt-1">Tasa Gano Excel Colombia: $4,500 COP = 1 USD</p>
            </div>

            <div className="creatuactivo-component-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-800/50">
                      <th className="py-3 px-2 md:px-3 text-left text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Nivel</th>
                      <th className="py-3 px-2 md:px-3 text-center text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Personas</th>
                      <th className="py-3 px-2 md:px-3 text-center text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">CV/Lado</th>
                      <th className="py-3 px-2 md:px-3 text-center text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Bono 10%</th>
                      <th className="py-3 px-2 md:px-3 text-center text-[10px] md:text-xs font-bold text-green-400 uppercase tracking-wider bg-green-500/5">Acum 10%</th>
                      <th className="py-3 px-2 md:px-3 text-center text-[10px] md:text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-500/5">Acum 15%</th>
                      <th className="py-3 px-2 md:px-3 text-center text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-wider bg-purple-500/5">Acum 16%</th>
                      <th className="py-3 px-2 md:px-3 text-center text-[10px] md:text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-500/5">Acum 17%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {projectionData.slice(0, showAllLevels ? 12 : 6).map((row, index) => (
                      <ProjectionRow key={row.level} {...row} isAnimated={animateTable} delay={index} />
                    ))}
                  </tbody>
                  {showAllLevels && (
                    <tfoot>
                      <tr className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-t-2 border-green-500/30">
                        <td className="py-4 px-2 md:px-3"><span className="font-bold text-green-400 text-xs uppercase">Total</span></td>
                        <td className="py-4 px-2 md:px-3 text-center"><span className="font-mono font-bold text-white text-sm">{totals.people.toLocaleString('es-CO')}</span></td>
                        <td className="py-4 px-2 md:px-3 text-center"><span className="font-mono font-bold text-slate-300 text-sm">{totals.cv.toLocaleString('es-CO')}</span></td>
                        <td className="py-4 px-2 md:px-3 text-center"><span className="text-slate-500 text-xs">—</span></td>
                        <td className="py-4 px-2 md:px-3 text-center bg-green-500/5"><span className="font-mono font-bold text-green-400 text-sm">${totals.bonus10.toLocaleString('es-CO')}</span></td>
                        <td className="py-4 px-2 md:px-3 text-center bg-blue-500/5"><span className="font-mono font-bold text-blue-400 text-sm">${totals.bonus15.toLocaleString('es-CO')}</span></td>
                        <td className="py-4 px-2 md:px-3 text-center bg-purple-500/5"><span className="font-mono font-bold text-purple-400 text-sm">${totals.bonus16.toLocaleString('es-CO')}</span></td>
                        <td className="py-4 px-2 md:px-3 text-center bg-amber-500/5"><span className="font-mono font-bold text-amber-400 text-sm">${totals.bonus17.toLocaleString('es-CO')}</span></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              {!showAllLevels && (
                <div className="p-4 text-center border-t border-white/10">
                  <button onClick={() => setShowAllLevels(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500/20 text-purple-400 font-bold hover:bg-purple-500/30 transition-colors">
                    Ver los 12 niveles completos <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {showAllLevels && (
                <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-t border-green-500/20">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-green-500/10 rounded-xl">
                      <p className="text-xs text-slate-400 mb-1">ACUMULADO 10%</p>
                      <p className="text-xl md:text-2xl font-extrabold text-green-400">
                        $<AnimatedCountUp end={95.8} duration={2} decimals={1} />M
                      </p>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 rounded-xl">
                      <p className="text-xs text-slate-400 mb-1">ACUMULADO 15%</p>
                      <p className="text-xl md:text-2xl font-extrabold text-blue-400">
                        $<AnimatedCountUp end={143.7} duration={2} decimals={1} delay={200} />M
                      </p>
                    </div>
                    <div className="text-center p-3 bg-purple-500/10 rounded-xl">
                      <p className="text-xs text-slate-400 mb-1">ACUMULADO 16%</p>
                      <p className="text-xl md:text-2xl font-extrabold text-purple-400">
                        $<AnimatedCountUp end={153.3} duration={2} decimals={1} delay={400} />M
                      </p>
                    </div>
                    <div className="text-center p-3 bg-amber-500/10 rounded-xl">
                      <p className="text-xs text-slate-400 mb-1">ACUMULADO 17%</p>
                      <p className="text-xl md:text-2xl font-extrabold text-amber-400">
                        $<AnimatedCountUp end={162.9} duration={2} decimals={1} delay={600} />M
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500">* Bono binario = % del CV del lado menor × $4,500 COP. En escenario balanceado 2×2, ambos lados son iguales.</p>
              <p className="text-xs text-slate-500 mt-1">Porcentajes: 10% base, hasta 17% según rango alcanzado.</p>
            </div>

            {/* Disclaimer importante */}
            <div className="mt-6 max-w-3xl mx-auto">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-sm text-amber-200/90 text-center">
                  <strong className="text-amber-400">Importante:</strong> Las ganancias en este modelo se generan exclusivamente por el <strong>movimiento de producto</strong>. Los números mostrados son ilustrativos y representan el potencial matemático del sistema de duplicación 2×2.
                </p>
              </div>
            </div>
          </section>

          {/* VISIÓN 4 MILLONES */}
          <section className="max-w-5xl mx-auto mb-24 lg:mb-32">
            <div className="creatuactivo-component-card p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  El Camino a <span className="text-gradient-gold">4 Millones</span>
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Esta es la proyección más conservadora. En la realidad, muchas personas invitan a más de 2.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="text-center p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <Crown className="w-10 h-10 text-amber-400 mx-auto mb-4" />
                  <p className="text-sm text-slate-400 mb-2">FASE 1: Lista Privada</p>
                  <p className="text-3xl font-bold text-white mb-1">
                    <AnimatedCountUp end={150} duration={1.5} />
                  </p>
                  <p className="text-sm text-slate-400">Fundadores</p>
                </div>
                <div className="text-center p-6 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                  <Rocket className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                  <p className="text-sm text-slate-400 mb-2">FASE 2: Pre-Lanzamiento</p>
                  <p className="text-3xl font-bold text-white mb-1">
                    <AnimatedCountUp end={22500} duration={2} />
                  </p>
                  <p className="text-sm text-slate-400">Constructores</p>
                </div>
                <div className="text-center p-6 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <Target className="w-10 h-10 text-green-400 mx-auto mb-4" />
                  <p className="text-sm text-slate-400 mb-2">META: 3-7 Años</p>
                  <p className="text-3xl font-bold text-white mb-1">
                    <AnimatedCountUp end={4} duration={1.5} suffix="M+" />
                  </p>
                  <p className="text-sm text-slate-400">Personas impactadas</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ CONTEXTUAL */}
          <section className="max-w-4xl mx-auto mb-24 lg:mb-32 bg-slate-900/50 px-6 py-12 rounded-3xl border border-slate-800">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Preguntas <span className="text-gradient-gold">Frecuentes</span>
              </h2>
              <p className="text-slate-400">Las dudas más comunes sobre el Reto de los 12 Días</p>
            </div>

            <div className="space-y-4">
              <FAQItem
                question="¿Qué pasa si no logro invitar a 2 personas el primer día?"
                answer="El reto es una guía, no una obligación. Si tardas 2 días en invitar a tus primeras 2 personas, no pasa nada. Lo importante es empezar. El sistema 2×2 funciona cuando cada quien encuentra su ritmo. Lo que sí es crítico es que arranques HOY, porque tu posición de Fundador se bloquea al comenzar."
              />
              <FAQItem
                question="¿De dónde salen los $95 millones de la proyección?"
                answer="El bono binario se calcula así: Por cada persona que activa con 52 CV, tú ganas el 10% del CV del lado menor multiplicado por $4,500 COP. Con 2×2 balanceado en 12 niveles, eso suma 8,190 personas × 52 CV × 10% × $4,500 = $95,823,000 COP acumulados. Este es el escenario más conservador (todos con el paquete mínimo)."
              />
              <FAQItem
                question="¿Las ganancias son garantizadas?"
                answer="No. Las ganancias dependen 100% del movimiento de producto en tu red. Esta proyección muestra el potencial matemático SI logras construir una red 2×2 balanceada hasta el nivel 12. Tus resultados reales dependerán de tu esfuerzo, el compromiso de tu equipo, y las condiciones del mercado."
              />
              <FAQItem
                question="¿Qué diferencia hay entre los paquetes ESP1, ESP2 y ESP3?"
                answer={`Todos te dan acceso al sistema completo. La diferencia está en el inventario de producto que recibes y el porcentaje del bono binario:

• Kit de Inicio ($443,600)
  4 cajas Gano Café - 52 CV - Binario 10%

• ESP1 Inicial ($900,000)
  Inventario básico - 100 CV - Binario 12%

• ESP2 Empresarial ($2,250,000)
  Inventario profesional - 250 CV - Binario 15%

• ESP3 Visionario ($4,500,000)
  Inventario premium - 500 CV - Binario 17%

Mayor paquete = Mayor inventario + Mayor % de binario desde el inicio.`}
              />
              <FAQItem
                question="¿Por qué solo 150 cupos de Fundador?"
                answer="Los 150 Fundadores son la semilla del movimiento. Queremos personas comprometidas, no cantidad. Ser Fundador significa estar en el Nivel 0 (la posición más alta), tener acceso directo a los mentores, y participar en las decisiones estratégicas de la comunidad. Una vez se llenen los 150 cupos, solo podrás entrar como Constructor en el Pre-Lanzamiento."
              />
              <FAQItem
                question="¿Qué necesito para participar en el Reto?"
                answer="1. Activar tu posición con cualquier paquete (mínimo Kit de Inicio $443,600)\n2. Completar el formulario de registro con tus datos\n3. Comprometerte a invitar al menos a 2 personas durante los 12 días\n4. Estar en contacto con tu patrocinador para recibir apoyo\n\nNo necesitas experiencia previa. El sistema NEXUS te ayuda a explicar el negocio 24/7."
              />
            </div>
          </section>

          {/* FORMULARIO DE CONFIRMACIÓN */}
          <section id="formulario" className="max-w-3xl mx-auto mb-24 lg:mb-32">
            <div className="creatuactivo-component-card p-8 md:p-12">
              <div className="text-center mb-10">
                <Flame className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h2 className="creatuactivo-h1-ecosystem text-3xl md:text-4xl font-bold mb-4">
                  ¡Voy por el Mejor Diciembre!
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                  Confirma tu participación completando este formulario.
                  Tu información es confidencial y será usada únicamente para tu registro.
                </p>
              </div>

              {submitStatus === 'success' ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">¡Registro Enviado!</h3>
                  <p className="text-slate-400">
                    Hemos recibido tu información. Te contactaremos pronto para confirmar tu posición de Fundador.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    try {
                      const formDataToSend = new FormData();
                      formDataToSend.append('fullName', formData.fullName);
                      formDataToSend.append('email', formData.email);
                      formDataToSend.append('phone', formData.phone);
                      formDataToSend.append('shippingAddress', formData.shippingAddress);
                      formDataToSend.append('correspondenceAddress', formData.sameAddress ? formData.shippingAddress : formData.correspondenceAddress);
                      formDataToSend.append('bankEntity', formData.bankEntity);
                      formDataToSend.append('accountNumber', formData.accountNumber);
                      formDataToSend.append('accountType', formData.accountType);
                      formDataToSend.append('sponsorName', formData.sponsorName);
                      formDataToSend.append('sponsorCode', formData.sponsorCode);
                      formDataToSend.append('selectedPackage', formData.selectedPackage);
                      formDataToSend.append('notes', formData.notes);
                      idFiles.forEach((file, index) => {
                        formDataToSend.append(`idDocument${index + 1}`, file);
                      });
                      const response = await fetch('/api/fundadores/registro-diciembre', {
                        method: 'POST',
                        body: formDataToSend,
                      });
                      if (response.ok) {
                        setSubmitStatus('success');
                      } else {
                        setSubmitStatus('error');
                      }
                    } catch {
                      setSubmitStatus('error');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="space-y-8"
                >
                  {/* Datos personales */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      Datos Personales
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Nombre Completo *</label>
                        <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="Tu nombre completo" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Teléfono / WhatsApp *</label>
                        <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="+57 300 123 4567" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Correo Electrónico *</label>
                        <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="tu@email.com" />
                      </div>
                    </div>
                  </div>

                  {/* Selección de Paquete */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Gift className="w-5 h-5 text-amber-400" />
                      Paquete Empresarial
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { id: 'ESP3', name: 'Visionario', price: '$4.500.000', highlight: true },
                        { id: 'ESP2', name: 'Empresarial', price: '$2.250.000', highlight: false },
                        { id: 'ESP1', name: 'Inicial', price: '$900.000', highlight: false },
                        { id: 'KIT', name: 'Kit de Inicio', price: '$443.600', highlight: false },
                      ].map((pkg) => (
                        <label key={pkg.id} className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.selectedPackage === pkg.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'} ${pkg.highlight ? 'ring-1 ring-amber-500/30' : ''}`}>
                          <input type="radio" name="selectedPackage" value={pkg.id} checked={formData.selectedPackage === pkg.id} onChange={(e) => setFormData({...formData, selectedPackage: e.target.value})} className="sr-only" required />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.selectedPackage === pkg.id ? 'border-amber-500 bg-amber-500' : 'border-slate-500'}`}>
                            {formData.selectedPackage === pkg.id && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{pkg.name}</span>
                              <span className="text-xs text-slate-500">({pkg.id})</span>
                              {pkg.highlight && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">RECOMENDADO</span>}
                            </div>
                            <span className="text-lg font-bold text-amber-400">{pkg.price}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Documento de identidad */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <FileImage className="w-5 h-5 text-purple-400" />
                      Documento de Identidad
                    </h3>
                    <div className="bg-slate-800/30 border border-dashed border-slate-600 rounded-xl p-6">
                      <div className="text-center mb-4">
                        <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-300 font-medium">Sube imagen clara de tu documento</p>
                        <p className="text-sm text-slate-500 mt-1">Puedes subir 1 archivo con ambas caras, o 2 archivos separados</p>
                        <p className="text-xs text-slate-600 mt-2">Formatos: JPG, PNG o PDF • Máximo 5MB por archivo</p>
                      </div>
                      <input type="file" accept=".jpg,.jpeg,.png,.pdf" multiple onChange={(e) => { const files = Array.from(e.target.files || []).slice(0, 2); setIdFiles(files); }} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30 cursor-pointer" />
                      {idFiles.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {idFiles.map((file, index) => (
                            <p key={index} className="text-sm text-green-400 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />{file.name}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Direcciones */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-400" />
                      Direcciones
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Dirección de Envío (para tus productos) *</label>
                        <textarea required rows={2} value={formData.shippingAddress} onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none" placeholder="Calle, número, barrio, ciudad, departamento" />
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={formData.sameAddress} onChange={(e) => setFormData({...formData, sameAddress: e.target.checked})} className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500" />
                        <span className="text-slate-300 text-sm">La dirección de correspondencia es la misma</span>
                      </label>
                      {!formData.sameAddress && (
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Dirección de Correspondencia *</label>
                          <textarea required={!formData.sameAddress} rows={2} value={formData.correspondenceAddress} onChange={(e) => setFormData({...formData, correspondenceAddress: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none" placeholder="Calle, número, barrio, ciudad, departamento" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Datos bancarios */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-amber-400" />
                      Datos Bancarios (para tus comisiones)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Entidad Bancaria *</label>
                        <input type="text" required value={formData.bankEntity} onChange={(e) => setFormData({...formData, bankEntity: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="Ej: Bancolombia, Davivienda..." />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Cuenta *</label>
                        <select value={formData.accountType} onChange={(e) => setFormData({...formData, accountType: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
                          <option value="ahorros">Cuenta de Ahorros</option>
                          <option value="corriente">Cuenta Corriente</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Número de Cuenta *</label>
                        <input type="text" required value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="Número de cuenta" />
                      </div>
                    </div>
                  </div>

                  {/* Patrocinador */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      Patrocinador de Registro
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Nombre del Patrocinador *</label>
                        <input type="text" required value={formData.sponsorName} onChange={(e) => setFormData({...formData, sponsorName: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="Nombre de quien te invitó" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Código del Patrocinador *</label>
                        <input type="text" required value={formData.sponsorCode} onChange={(e) => setFormData({...formData, sponsorCode: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="Código de afiliado" />
                      </div>
                    </div>
                  </div>

                  {/* Notas */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <FileImage className="w-5 h-5 text-slate-400" />
                      Notas Adicionales
                    </h3>
                    <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none" placeholder="Ej: Patrocinador de colocación, lado derecha o izquierda, observaciones..." />
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                    <p className="text-sm text-amber-200/90">
                      <strong className="text-amber-400">Importante:</strong> Las ganancias en este modelo se generan exclusivamente por el movimiento de producto. Los números mostrados son ilustrativos y representan el potencial matemático del sistema de duplicación 2×2.
                    </p>
                  </div>

                  {/* Error */}
                  {submitStatus === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <p className="text-red-400 text-sm">Hubo un error al enviar tu registro. Por favor intenta de nuevo o contáctanos por WhatsApp.</p>
                    </div>
                  )}

                  {/* Submit */}
                  <div className="pt-4">
                    <button type="submit" disabled={isSubmitting || idFiles.length === 0} className="w-full creatuactivo-cta-ecosystem text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isSubmitting ? (
                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enviando...</>
                      ) : (
                        <><Send className="w-5 h-5" />Confirmar Mi Participación</>
                      )}
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-4">
                      Al enviar este formulario, confirmas que vas por el mejor diciembre de tu vida y aceptas formar parte del Reto de los 12 Días.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10 pt-8 mt-12">
            <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
              <p>&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
              <p className="mt-2">
                <em>Nota: Esta proyección es ilustrativa y muestra el potencial matemático de la duplicación 2×2.
                Los resultados reales dependen del esfuerzo individual y las condiciones del mercado.</em>
              </p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
