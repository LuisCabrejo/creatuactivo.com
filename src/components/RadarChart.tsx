/**
 * Copyright © 2025 CreaTuActivo.com
 * Radar Chart Component - Diagnóstico de Arquitectura Soberana
 * Visualiza los 5 ejes del diagnóstico financiero
 */

'use client';

import { useEffect, useState } from 'react';

interface RadarChartProps {
  data: {
    potenciaIngreso: number;
    autonomiaOperativa: number;
    resilienciaGeografica: number;
    escalabilidadSistemica: number;
    eficienciaPatrimonial: number;
  };
  size?: number;
  animated?: boolean;
}

export default function RadarChart({ data, size = 300, animated = true }: RadarChartProps) {
  const [animatedData, setAnimatedData] = useState(
    animated ? {
      potenciaIngreso: 0,
      autonomiaOperativa: 0,
      resilienciaGeografica: 0,
      escalabilidadSistemica: 0,
      eficienciaPatrimonial: 0,
    } : data
  );

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedData(data);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [data, animated]);

  const center = size / 2;
  const maxRadius = size * 0.4;

  // 5 ejes del pentágono
  const axes = [
    { key: 'potenciaIngreso', label: 'Potencia de Ingreso', angle: -90 },
    { key: 'autonomiaOperativa', label: 'Autonomía Operativa', angle: -18 },
    { key: 'resilienciaGeografica', label: 'Resiliencia Geográfica', angle: 54 },
    { key: 'escalabilidadSistemica', label: 'Escalabilidad', angle: 126 },
    { key: 'eficienciaPatrimonial', label: 'Eficiencia Patrimonial', angle: 198 },
  ];

  // Calcular puntos del pentágono
  const getPoint = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  // Generar líneas de la grilla (3 niveles)
  const gridLevels = [0.33, 0.66, 1];

  // Puntos del área de datos
  const dataPoints = axes.map((axis) => {
    const value = animatedData[axis.key as keyof typeof animatedData] / 100;
    return getPoint(axis.angle, maxRadius * value);
  });

  const dataPath = dataPoints.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Fondo oscuro */}
        <circle
          cx={center}
          cy={center}
          r={maxRadius + 10}
          fill="rgba(10, 10, 15, 0.8)"
        />

        {/* Grillas del pentágono */}
        {gridLevels.map((level, i) => {
          const points = axes.map(axis => getPoint(axis.angle, maxRadius * level));
          const path = points.map((p, j) =>
            `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
          ).join(' ') + ' Z';

          return (
            <path
              key={i}
              d={path}
              fill="none"
              stroke="rgba(212, 175, 55, 0.1)"
              strokeWidth={1}
            />
          );
        })}

        {/* Líneas desde el centro a cada vértice */}
        {axes.map((axis, i) => {
          const point = getPoint(axis.angle, maxRadius);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="rgba(212, 175, 55, 0.15)"
              strokeWidth={1}
            />
          );
        })}

        {/* Área de datos con gradiente */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(212, 175, 55, 0.4)" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0.1)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <path
          d={dataPath}
          fill="url(#radarGradient)"
          stroke="rgba(212, 175, 55, 0.8)"
          strokeWidth={2}
          filter="url(#glow)"
          style={{
            transition: animated ? 'all 1s ease-out' : 'none',
          }}
        />

        {/* Puntos en cada vértice de datos */}
        {dataPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={5}
            fill="#D4AF37"
            stroke="#0a0a0f"
            strokeWidth={2}
            style={{
              transition: animated ? 'all 1s ease-out' : 'none',
            }}
          />
        ))}

        {/* Labels de los ejes */}
        {axes.map((axis, i) => {
          const labelPoint = getPoint(axis.angle, maxRadius + 35);
          const value = Math.round(animatedData[axis.key as keyof typeof animatedData]);

          return (
            <g key={i}>
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] sm:text-xs font-medium"
                fill="#a0a0a8"
              >
                {axis.label}
              </text>
              <text
                x={labelPoint.x}
                y={labelPoint.y + 14}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs sm:text-sm font-bold"
                fill="#D4AF37"
              >
                {value}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
