/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * AnimatedValueStack - Value Stack con animación secuencial dramática
 * Crea efecto "WOW" mostrando el valor acumulado y el precio final $0
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';

interface ValueItemData {
  feature: string;
  price: string;
}

const valueItems: ValueItemData[] = [
  { feature: "Desarrollo de Plataforma Completa (12-18 meses)", price: "$150,000 USD" },
  { feature: "Integración de IA + Base de Datos Vectorial", price: "$35,000 USD" },
  { feature: "Sistema de Automatización y Analytics", price: "$25,000 USD" },
  { feature: "Infraestructura Cloud (APIs, Hosting, CDN)", price: "$1,200 USD/mes" },
  { feature: "Equipo de Desarrollo y Soporte (2-3 devs)", price: "$12,000 USD/mes" },
];

// Componente para cada item del value stack
const AnimatedValueItem = ({
  feature,
  price,
  index,
  isVisible,
}: {
  feature: string;
  price: string;
  index: number;
  isVisible: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={isVisible ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={isVisible ? { scale: 1 } : {}}
          transition={{ delay: index * 0.4 + 0.3, type: "spring", stiffness: 500 }}
        >
          <Check className="w-5 h-5 text-green-400" />
        </motion.div>
        <span className="text-slate-300 text-sm md:text-base">{feature}</span>
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ delay: index * 0.4 + 0.2 }}
        className="text-purple-400 font-bold text-sm md:text-base whitespace-nowrap ml-4"
      >
        {price}
      </motion.span>
    </motion.div>
  );
};

// Componente para filas de resumen
const SummaryRow = ({
  label,
  value,
  delay,
  isVisible,
  isBorder = false,
}: {
  label: string;
  value: string;
  delay: number;
  isVisible: boolean;
  isBorder?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={isVisible ? { opacity: 1, y: 0 } : {}}
    transition={{ delay, duration: 0.5 }}
    className={`flex items-center justify-between py-4 ${
      isBorder ? 'border-b-2 border-slate-700' : ''
    }`}
  >
    <span className="text-lg md:text-xl font-bold text-white">{label}</span>
    <span className="text-base md:text-lg font-bold text-slate-400">{value}</span>
  </motion.div>
);

// Componente para el total tachado con animación
const StrikethroughTotal = ({
  isVisible,
  delay,
}: {
  isVisible: boolean;
  delay: number;
}) => {
  const [showStrike, setShowStrike] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowStrike(true), (delay + 0.5) * 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="flex items-center justify-between py-6 mt-2"
    >
      <span className="text-lg md:text-xl font-bold text-white">Valor Total Real (Primer Año)</span>
      <div className="relative">
        <span className="text-xl md:text-2xl font-extrabold text-slate-400">
          $368,400 USD
        </span>
        {/* Línea de tachado animada */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={showStrike ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 origin-left"
          style={{ transform: 'translateY(-50%)' }}
        />
      </div>
    </motion.div>
  );
};

// Componente para el precio final $0
const FinalPrice = ({
  isVisible,
  delay,
}: {
  isVisible: boolean;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{
        delay,
        duration: 0.6,
        type: "spring",
        stiffness: 200,
      }}
      className="relative"
    >
      {/* Glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: [0, 0.5, 0.3] } : {}}
        transition={{ delay: delay + 0.3, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 bg-green-500/20 blur-xl rounded-xl"
      />

      <div className="relative flex items-center justify-between py-4 bg-gradient-to-r from-purple-600/30 to-green-600/30 p-4 rounded-xl border border-purple-500/50 overflow-hidden">
        {/* Shimmer effect */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={isVisible ? { x: '200%' } : {}}
          transition={{ delay: delay + 0.5, duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
        />

        <div className="flex items-center gap-3 relative z-10">
          <motion.div
            animate={isVisible ? { rotate: [0, 15, -15, 0] } : {}}
            transition={{ delay: delay + 0.4, duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Sparkles className="text-yellow-400 fill-current w-6 h-6" />
          </motion.div>
          <span className="text-white font-bold text-base md:text-lg">Precio para Socios</span>
        </div>

        <motion.span
          initial={{ scale: 1 }}
          animate={isVisible ? { scale: [1, 1.1, 1] } : {}}
          transition={{ delay: delay + 0.6, duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold text-green-400 relative z-10"
        >
          $0 USD
        </motion.span>
      </div>
    </motion.div>
  );
};

export default function AnimatedValueStack() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
    }
  }, [isInView, hasStarted]);

  // Cálculo de delays
  const itemsDelay = valueItems.length * 0.4; // Tiempo para todos los items
  const summaryDelay1 = itemsDelay + 0.3;
  const summaryDelay2 = summaryDelay1 + 0.4;
  const totalDelay = summaryDelay2 + 0.4;
  const finalDelay = totalDelay + 1.2; // Más pausa dramática antes del $0

  return (
    <section ref={ref} className="max-w-4xl mx-auto mb-24 lg:mb-32">
      <div className="creatuactivo-component-card rounded-3xl p-1 border-t border-purple-500/50">
        <div className="bg-slate-900/90 rounded-[22px] p-6 md:p-8 lg:p-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={hasStarted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <span className="text-purple-400 font-bold tracking-widest text-sm uppercase">
              Bono Exclusivo de Equipo
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-2">
              ¿Cuánto cuesta esta tecnología?
            </h2>
          </motion.div>

          {/* Value Items */}
          <div className="space-y-2 mb-10">
            {valueItems.map((item, index) => (
              <AnimatedValueItem
                key={index}
                feature={item.feature}
                price={item.price}
                index={index}
                isVisible={hasStarted}
              />
            ))}

            {/* Separador */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={hasStarted ? { scaleX: 1 } : {}}
              transition={{ delay: itemsDelay, duration: 0.4 }}
              className="h-0.5 bg-slate-700 my-4 origin-left"
            />

            {/* Summary Rows */}
            <SummaryRow
              label="Inversión Inicial de Desarrollo"
              value="$210,000 USD"
              delay={summaryDelay1}
              isVisible={hasStarted}
            />
            <SummaryRow
              label="Costos Operativos Mensuales"
              value="$13,200 USD/mes"
              delay={summaryDelay2}
              isVisible={hasStarted}
              isBorder
            />

            {/* Total con tachado animado */}
            <StrikethroughTotal isVisible={hasStarted} delay={totalDelay} />

            {/* Precio Final $0 */}
            <FinalPrice isVisible={hasStarted} delay={finalDelay} />
          </div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={hasStarted ? { opacity: 1 } : {}}
            transition={{ delay: finalDelay + 0.8, duration: 0.5 }}
            className="text-center text-slate-400 text-sm"
          >
            * No vendemos el software. Lo entregamos <b>GRATIS</b> como herramienta de trabajo a quienes se asocian con nosotros para distribuir la marca.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
