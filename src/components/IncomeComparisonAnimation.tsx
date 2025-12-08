/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * IncomeComparisonAnimation - Visualización animada de Ganar Dinero vs Construir Libertad
 * Muestra la diferencia entre ingreso lineal y ingreso residual
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Building2, Moon, TrendingUp, RefreshCw, Layers } from 'lucide-react';

// Gráfica de Ingreso Lineal (Empleo) - Ciclo que se repite
const LinearIncomeGraph = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-32 md:h-40">
      {/* Eje X */}
      <line x1="20" y1="80" x2="180" y2="80" stroke="#475569" strokeWidth="1" />
      {/* Eje Y */}
      <line x1="20" y1="20" x2="20" y2="80" stroke="#475569" strokeWidth="1" />

      {/* Labels */}
      <text x="100" y="95" fill="#64748b" fontSize="8" textAnchor="middle">Tiempo</text>
      <text x="10" y="50" fill="#64748b" fontSize="8" textAnchor="middle" transform="rotate(-90, 10, 50)">$</text>

      {/* Línea de ingreso - sube y baja */}
      <motion.path
        d="M 20 70 L 50 40 L 80 40 L 100 70 L 130 40 L 160 40 L 180 70"
        fill="none"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isVisible ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Indicadores de trabajo/descanso */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ delay: 2.2 }}
      >
        {/* Trabajas */}
        <circle cx="50" cy="40" r="4" fill="#22c55e" />
        <text x="50" y="32" fill="#22c55e" fontSize="6" textAnchor="middle">Trabajas</text>

        {/* Paras */}
        <circle cx="100" cy="70" r="4" fill="#ef4444" />
        <text x="100" y="78" fill="#ef4444" fontSize="6" textAnchor="middle">Paras</text>

        {/* Trabajas de nuevo */}
        <circle cx="150" cy="40" r="4" fill="#22c55e" />

        {/* Flecha de ciclo */}
        <motion.path
          d="M 170 50 Q 190 50 190 65 Q 190 80 170 80"
          fill="none"
          stroke="#64748b"
          strokeWidth="1"
          strokeDasharray="3,2"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 0.5 } : {}}
          transition={{ delay: 2.5 }}
        />
      </motion.g>
    </svg>
  );
};

// Gráfica de Ingreso Residual (Activo) - Curva exponencial
const ExponentialIncomeGraph = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-32 md:h-40">
      {/* Eje X */}
      <line x1="20" y1="80" x2="180" y2="80" stroke="#475569" strokeWidth="1" />
      {/* Eje Y */}
      <line x1="20" y1="20" x2="20" y2="80" stroke="#475569" strokeWidth="1" />

      {/* Labels */}
      <text x="100" y="95" fill="#64748b" fontSize="8" textAnchor="middle">Tiempo</text>
      <text x="10" y="50" fill="#64748b" fontSize="8" textAnchor="middle" transform="rotate(-90, 10, 50)">$</text>

      {/* Área bajo la curva */}
      <motion.path
        d="M 20 80 L 20 75 Q 60 70 80 60 Q 120 45 150 30 Q 170 22 180 18 L 180 80 Z"
        fill="url(#greenGradient)"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 0.3 } : {}}
        transition={{ delay: 1.5, duration: 1 }}
      />

      {/* Gradiente */}
      <defs>
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Curva exponencial */}
      <motion.path
        d="M 20 75 Q 60 70 80 60 Q 120 45 150 30 Q 170 22 180 18"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isVisible ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {/* Bloques apilándose */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ delay: 2.2 }}
      >
        {/* Bloque 1 */}
        <motion.rect
          x="35" y="68" width="10" height="10"
          fill="#a855f7"
          initial={{ scale: 0 }}
          animate={isVisible ? { scale: 1 } : {}}
          transition={{ delay: 2.3, type: "spring" }}
        />
        {/* Bloque 2 */}
        <motion.rect
          x="70" y="55" width="10" height="10"
          fill="#a855f7"
          initial={{ scale: 0 }}
          animate={isVisible ? { scale: 1 } : {}}
          transition={{ delay: 2.5, type: "spring" }}
        />
        {/* Bloque 3 */}
        <motion.rect
          x="110" y="40" width="10" height="10"
          fill="#a855f7"
          initial={{ scale: 0 }}
          animate={isVisible ? { scale: 1 } : {}}
          transition={{ delay: 2.7, type: "spring" }}
        />
        {/* Bloque 4 */}
        <motion.rect
          x="150" y="25" width="10" height="10"
          fill="#a855f7"
          initial={{ scale: 0 }}
          animate={isVisible ? { scale: 1 } : {}}
          transition={{ delay: 2.9, type: "spring" }}
        />
      </motion.g>

      {/* Flecha hacia arriba */}
      <motion.path
        d="M 175 15 L 180 10 L 185 15"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ delay: 3 }}
      />
    </svg>
  );
};

// Tarjeta de comparación
const ComparisonCard = ({
  title,
  icon,
  color,
  graph,
  points,
  tagline,
  isVisible,
  delay,
}: {
  title: string;
  icon: React.ReactNode;
  color: 'red' | 'green';
  graph: React.ReactNode;
  points: { icon: React.ReactNode; text: string }[];
  tagline: string;
  isVisible: boolean;
  delay: number;
}) => {
  const colorClasses = {
    red: {
      border: 'border-red-500/30',
      bg: 'bg-red-900/20',
      title: 'text-red-400',
      icon: 'text-red-400',
    },
    green: {
      border: 'border-green-500/30',
      bg: 'bg-green-900/20',
      title: 'text-green-400',
      icon: 'text-green-400',
    },
  };

  const classes = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className={`${classes.bg} ${classes.border} border rounded-2xl p-5 md:p-6`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={classes.icon}>{icon}</div>
        <h4 className={`font-bold text-lg ${classes.title}`}>{title}</h4>
      </div>

      {/* Graph */}
      <div className="mb-4">{graph}</div>

      {/* Points */}
      <div className="space-y-2 mb-4">
        {points.map((point, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: delay + 0.3 + index * 0.15 }}
            className="flex items-center gap-2 text-sm text-slate-300"
          >
            <span className={classes.icon}>{point.icon}</span>
            <span>{point.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ delay: delay + 0.8 }}
        className="text-xs text-slate-500 italic text-center border-t border-slate-700/50 pt-3"
      >
        "{tagline}"
      </motion.p>
    </motion.div>
  );
};

export default function IncomeComparisonAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [showConclusion, setShowConclusion] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowConclusion(true), 4000);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <div ref={ref} className="max-w-4xl mx-auto">
      {/* Título */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="text-center mb-8"
      >
        <span className="text-slate-500 text-sm uppercase tracking-wider">La Gran Diferencia</span>
      </motion.div>

      {/* Comparación lado a lado */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Ganar Dinero (Empleo) */}
        <ComparisonCard
          title="Ganar Dinero"
          icon={<Briefcase size={24} />}
          color="red"
          graph={<LinearIncomeGraph isVisible={isInView} />}
          points={[
            { icon: <RefreshCw size={14} />, text: "Trabajas → Ganas" },
            { icon: <Moon size={14} />, text: "Paras → Pierdes" },
            { icon: <RefreshCw size={14} />, text: "Cada mes empiezas de cero" },
          ]}
          tagline="Intercambias tiempo por dinero"
          isVisible={isInView}
          delay={0.2}
        />

        {/* Construir Libertad (Activo) */}
        <ComparisonCard
          title="Construir Libertad"
          icon={<Building2 size={24} />}
          color="green"
          graph={<ExponentialIncomeGraph isVisible={isInView} />}
          points={[
            { icon: <Layers size={14} />, text: "Construyes una vez" },
            { icon: <TrendingUp size={14} />, text: "Crece mientras duermes" },
            { icon: <Building2 size={14} />, text: "Tu sistema trabaja cuando tú no trabajas" },
          ]}
          tagline="Construyes un activo que genera ingresos"
          isVisible={isInView}
          delay={0.4}
        />
      </div>

      {/* Conclusión */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={showConclusion ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center p-6 bg-gradient-to-r from-green-900/30 to-purple-900/30 border border-green-500/30 rounded-2xl"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={showConclusion ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-white mb-2"
        >
          ¿Ves la diferencia ahora?
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={showConclusion ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-slate-400"
        >
          No estamos ofreciendo un empleo. Estamos ofreciendo la oportunidad de{' '}
          <span className="text-green-400 font-semibold">construir un activo</span>.
        </motion.p>
      </motion.div>
    </div>
  );
}
