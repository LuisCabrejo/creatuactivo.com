/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * AnimatedEvolution - Visualización animada de la evolución del negocio
 * Muestra la transformación: Videoclub→Netflix, Carta→WhatsApp, Venta Directa→CreaTuActivo
 */

'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface EvolutionItem {
  old: string;
  new: string;
  label: string;
  highlight?: boolean;
}

const evolutionData: EvolutionItem[] = [
  { old: 'Videoclub', new: 'Netflix', label: 'Películas' },
  { old: 'Carta Postal', new: 'WhatsApp', label: 'Mensajes' },
  { old: 'Venta Directa', new: 'CreaTuActivo', label: 'Negocios', highlight: true },
];

const EvolutionCard = ({
  item,
  index,
  isVisible,
}: {
  item: EvolutionItem;
  index: number;
  isVisible: boolean;
}) => {
  const baseDelay = index * 0.3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: baseDelay, duration: 0.5 }}
      className={`bg-slate-900/50 border rounded-2xl p-6 text-center relative overflow-hidden group transition-colors ${
        item.highlight
          ? 'border-purple-500/50 shadow-lg shadow-purple-500/10'
          : 'border-slate-800 hover:border-blue-500/30'
      }`}
    >
      {/* Glow effect for highlighted card */}
      {item.highlight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: baseDelay + 0.8 }}
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: baseDelay + 0.1 }}
          className="text-xs font-bold text-slate-500 uppercase mb-3"
        >
          {item.label}
        </motion.p>

        {/* Old value - appears first, then gets strikethrough */}
        <div className="relative mb-2">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: baseDelay + 0.2 }}
            className="text-slate-400 text-sm inline-block"
          >
            {item.old}
          </motion.span>
          {/* Animated strikethrough line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isVisible ? { scaleX: 1 } : {}}
            transition={{ delay: baseDelay + 0.5, duration: 0.4, ease: 'easeOut' }}
            className="absolute top-1/2 left-0 right-0 h-[2px] bg-red-500/70 origin-left"
            style={{ transform: 'translateY(-50%)' }}
          />
        </div>

        {/* Animated arrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: baseDelay + 0.6, type: 'spring', stiffness: 300 }}
          className={`text-xl my-2 ${item.highlight ? 'text-purple-400' : 'text-amber-500'}`}
        >
          ↓
        </motion.div>

        {/* New value - appears with impact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{
            delay: baseDelay + 0.7,
            type: 'spring',
            stiffness: 400,
            damping: 15,
          }}
          className={`font-bold text-xl ${
            item.highlight
              ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'
              : 'text-white'
          }`}
        >
          {item.new}
        </motion.div>

        {/* Sparkle effect for CreaTuActivo */}
        {item.highlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: [0, 1, 0] } : {}}
            transition={{ delay: baseDelay + 1, duration: 0.8 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-2 right-4 w-1 h-1 bg-purple-400 rounded-full" />
            <div className="absolute bottom-4 left-6 w-1.5 h-1.5 bg-blue-400 rounded-full" />
            <div className="absolute top-1/2 right-8 w-1 h-1 bg-amber-400 rounded-full" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default function AnimatedEvolution() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="max-w-4xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      {evolutionData.map((item, index) => (
        <EvolutionCard
          key={item.label}
          item={item}
          index={index}
          isVisible={isInView}
        />
      ))}

      {/* Bottom tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="col-span-1 md:col-span-3 text-center mt-4"
      >
        <p className="text-slate-500 text-sm">
          La tecnología no cambia el producto.{' '}
          <span className="text-white font-semibold">Cambia cómo lo distribuyes.</span>
        </p>
      </motion.div>
    </div>
  );
}
