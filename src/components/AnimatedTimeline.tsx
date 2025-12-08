/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * AnimatedTimeline - Timeline visual de las 3 fases del lanzamiento
 * Con countdown dinámico y animaciones de urgencia
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Users, Rocket, Crown } from 'lucide-react';

interface Phase {
  id: number;
  name: string;
  shortName: string;
  dateRange: string;
  endDate: Date;
  description: string;
  icon: React.ReactNode;
  spots?: string;
}

const phases: Phase[] = [
  {
    id: 1,
    name: 'Lista Privada',
    shortName: 'Privada',
    dateRange: '10 Nov - 04 Ene',
    endDate: new Date('2026-01-04T23:59:59'),
    description: '150 Fundadores élite',
    icon: <Crown className="w-5 h-5" />,
    spots: '150 cupos',
  },
  {
    id: 2,
    name: 'Pre-Lanzamiento',
    shortName: 'Pre-Launch',
    dateRange: '05 Ene - 01 Mar',
    endDate: new Date('2026-03-01T23:59:59'),
    description: 'Fundadores construyen',
    icon: <Users className="w-5 h-5" />,
    spots: '22,500',
  },
  {
    id: 3,
    name: 'Lanzamiento',
    shortName: 'Público',
    dateRange: '02 Mar 2026',
    endDate: new Date('2026-03-02T00:00:00'),
    description: 'Abierto al público',
    icon: <Rocket className="w-5 h-5" />,
    spots: '4M+',
  },
];

// Determinar fase actual basado en fecha
const getCurrentPhase = (): number => {
  const now = new Date();
  const phase1End = new Date('2026-01-04T23:59:59');
  const phase2End = new Date('2026-03-01T23:59:59');

  if (now <= phase1End) return 1;
  if (now <= phase2End) return 2;
  return 3;
};

// Componente de Countdown
const Countdown = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      {[
        { value: timeLeft.days, label: 'Días' },
        { value: timeLeft.hours, label: 'Hrs' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Seg' },
      ].map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1, type: 'spring' }}
          className="text-center"
        >
          <div className="bg-slate-800/80 border border-purple-500/30 rounded-lg px-2 md:px-4 py-2 min-w-[50px] md:min-w-[70px]">
            <motion.span
              key={item.value}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xl md:text-3xl font-bold text-white block"
            >
              {String(item.value).padStart(2, '0')}
            </motion.span>
          </div>
          <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-1 block">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

// Nodo del timeline
const TimelineNode = ({
  phase,
  isActive,
  isPast,
  index,
  isVisible,
}: {
  phase: Phase;
  isActive: boolean;
  isPast: boolean;
  index: number;
  isVisible: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.2, duration: 0.5 }}
      className="flex flex-col items-center relative z-10"
    >
      {/* Nodo circular */}
      <div className="relative">
        {/* Pulso para fase activa */}
        {isActive && (
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full bg-purple-500"
          />
        )}

        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`
            w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center
            border-2 transition-all duration-300 relative z-10
            ${
              isActive
                ? 'bg-gradient-to-br from-purple-600 to-blue-600 border-purple-400 shadow-lg shadow-purple-500/50'
                : isPast
                ? 'bg-green-600/30 border-green-500/50'
                : 'bg-slate-800 border-slate-600'
            }
          `}
        >
          <span className={isActive ? 'text-white' : isPast ? 'text-green-400' : 'text-slate-500'}>
            {phase.icon}
          </span>
        </motion.div>

        {/* Badge "ESTÁS AQUÍ" */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span className="bg-purple-600 text-white text-[9px] md:text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">
              Estás aquí
            </span>
          </motion.div>
        )}
      </div>

      {/* Información de la fase */}
      <div className="mt-4 text-center max-w-[100px] md:max-w-[140px]">
        <h4
          className={`font-bold text-xs md:text-sm ${
            isActive ? 'text-white' : isPast ? 'text-green-400' : 'text-slate-500'
          }`}
        >
          {phase.name}
        </h4>
        <p className="text-[10px] md:text-xs text-slate-500 mt-1">{phase.dateRange}</p>
        {phase.spots && (
          <p
            className={`text-[10px] md:text-xs mt-1 font-semibold ${
              isActive ? 'text-purple-400' : 'text-slate-600'
            }`}
          >
            {phase.spots}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default function AnimatedTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const currentPhase = getCurrentPhase();

  return (
    <section ref={ref} className="max-w-4xl mx-auto mb-16 lg:mb-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="creatuactivo-component-card rounded-3xl p-1 border-t border-amber-500/50"
      >
        <div className="bg-slate-900/90 rounded-[22px] p-6 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
            >
              <Clock className="w-3 h-3" />
              Ventana de Oportunidad
            </motion.div>
            <h3 className="text-xl md:text-2xl font-bold text-white">
              3 Fases de Lanzamiento
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              Como Apple lanzó el iPhone: los primeros en la fila tienen ventaja
            </p>
          </div>

          {/* Timeline Visual */}
          <div className="relative mb-10">
            {/* Línea de conexión */}
            <div className="absolute top-6 md:top-8 left-[15%] right-[15%] h-0.5 bg-slate-700">
              {/* Progreso de la línea */}
              <motion.div
                initial={{ width: '0%' }}
                animate={isInView ? { width: currentPhase === 1 ? '0%' : currentPhase === 2 ? '50%' : '100%' } : {}}
                transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-green-500 to-purple-500"
              />
            </div>

            {/* Nodos */}
            <div className="flex justify-between items-start relative">
              {phases.map((phase, index) => (
                <TimelineNode
                  key={phase.id}
                  phase={phase}
                  isActive={phase.id === currentPhase}
                  isPast={phase.id < currentPhase}
                  index={index}
                  isVisible={isInView}
                />
              ))}
            </div>
          </div>

          {/* Countdown Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="text-center mb-4">
              <p className="text-slate-400 text-sm">
                Tiempo restante para cerrar <span className="text-purple-400 font-bold">Lista Privada</span>
              </p>
            </div>

            <Countdown targetDate={phases[0].endDate} />

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="text-center mt-6 text-xs text-slate-500"
            >
              Después de esta fecha, solo podrás entrar como Constructor regular
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
