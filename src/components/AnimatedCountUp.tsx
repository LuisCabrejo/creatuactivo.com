/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * AnimatedCountUp - Contador animado que se activa al entrar en viewport
 * Crea efecto "WOW" en estadísticas y métricas
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedCountUpProps {
  end: number;
  duration?: number; // duración en segundos
  suffix?: string; // ej: "+", "%", " Años"
  prefix?: string; // ej: "$", "+"
  decimals?: number;
  className?: string;
  delay?: number; // delay antes de empezar (ms)
}

export default function AnimatedCountUp({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
  delay = 0,
}: AnimatedCountUpProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView || hasAnimated) return;

    const startTime = Date.now() + delay;
    const endTime = startTime + duration * 1000;

    // Función de easing (ease-out)
    const easeOutQuad = (t: number): number => t * (2 - t);

    const animate = () => {
      const now = Date.now();

      if (now < startTime) {
        requestAnimationFrame(animate);
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const easedProgress = easeOutQuad(progress);
      const currentValue = easedProgress * end;

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
        setHasAnimated(true);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration, delay, hasAnimated]);

  const displayValue = decimals > 0
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString('en-US');

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className={className}
    >
      {prefix}{displayValue}{suffix}
    </motion.span>
  );
}

// Componente wrapper para estadísticas con subtítulo
interface StatCardProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sublabel?: string;
  duration?: number;
  delay?: number;
}

export function AnimatedStatCard({
  value,
  suffix = '',
  prefix = '',
  label,
  sublabel,
  duration = 2,
  delay = 0,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="creatuactivo-component-card p-8 text-center"
    >
      <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
        <AnimatedCountUp
          end={value}
          suffix={suffix}
          prefix={prefix}
          duration={duration}
          delay={delay}
        />
      </div>
      <p className="text-slate-400 mb-3">{label}</p>
      {sublabel && <p className="text-sm text-slate-500">{sublabel}</p>}
    </motion.div>
  );
}
