// /src/components/CreaTuActivoLogo.tsx
'use client'

import React from 'react'
import Link from 'next/link'

interface CreaTuActivoLogoProps {
  className?: string
  showSubtitle?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function CreaTuActivoLogo({
  className = '',
  showSubtitle = false,
  size = 'md'
}: CreaTuActivoLogoProps) {

  const sizeClasses = {
    sm: {
      container: 'h-8',
      icon: 'w-8 h-8',
      title: 'text-lg',
      subtitle: 'text-xs'
    },
    md: {
      container: 'h-10',
      icon: 'w-10 h-10',
      title: 'text-xl',
      subtitle: 'text-sm'
    },
    lg: {
      container: 'h-12',
      icon: 'w-12 h-12',
      title: 'text-2xl',
      subtitle: 'text-base'
    }
  }

  const currentSize = sizeClasses[size]

  return (
    <Link
      href="/"
      className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${className}`}
    >
      {/* Icono Hexagonal */}
      <div className={`${currentSize.icon} flex-shrink-0`}>
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <defs>
            {/* Gradientes para hexágonos */}
            <linearGradient id="hexGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6"/>
              <stop offset="100%" stopColor="#1E40AF"/>
            </linearGradient>

            <linearGradient id="hexGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6"/>
              <stop offset="100%" stopColor="#7C3AED"/>
            </linearGradient>

            <linearGradient id="hexGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B"/>
              <stop offset="100%" stopColor="#D97706"/>
            </linearGradient>

            <linearGradient id="hexGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981"/>
              <stop offset="100%" stopColor="#059669"/>
            </linearGradient>

            {/* Glow effect para conexiones */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Hexágono central (más prominente) */}
          <polygon
            points="20,12 24,10 28,12 28,16 24,18 20,16"
            fill="url(#hexGradient2)"
            stroke="#8B5CF6"
            strokeWidth="0.3"
            opacity="0.95"
          />

          {/* Hexágonos conectados alrededor */}
          <polygon
            points="12,8 16,6 20,8 20,12 16,14 12,12"
            fill="url(#hexGradient1)"
            stroke="#3B82F6"
            strokeWidth="0.3"
            opacity="0.85"
          />

          <polygon
            points="28,8 32,6 36,8 36,12 32,14 28,12"
            fill="url(#hexGradient3)"
            stroke="#F59E0B"
            strokeWidth="0.3"
            opacity="0.85"
          />

          <polygon
            points="12,20 16,18 20,20 20,24 16,26 12,24"
            fill="url(#hexGradient4)"
            stroke="#10B981"
            strokeWidth="0.3"
            opacity="0.75"
          />

          {/* Líneas de conexión */}
          <line x1="20" y1="12" x2="16" y2="10" stroke="#7C3AED" strokeWidth="1.2" opacity="0.6" filter="url(#glow)"/>
          <line x1="24" y1="12" x2="28" y2="10" stroke="#7C3AED" strokeWidth="1.2" opacity="0.6" filter="url(#glow)"/>
          <line x1="20" y1="16" x2="16" y2="18" stroke="#7C3AED" strokeWidth="1.2" opacity="0.6" filter="url(#glow)"/>

          {/* Puntos de datos/energía fluyendo */}
          <circle cx="18" cy="11" r="0.8" fill="#F59E0B" opacity="0.9">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="26" cy="11" r="0.8" fill="#10B981" opacity="0.9">
            <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>

      {/* Texto */}
      <div className="flex flex-col">
        <span className={`font-bold bg-gradient-to-r from-[#1E40AF] via-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent ${currentSize.title}`}>
          CreaTuActivo
        </span>
        {showSubtitle && (
          <span className={`font-medium text-[#F59E0B] opacity-90 leading-tight ${currentSize.subtitle}`}>
            CONSTRUYE ACTIVOS, NO INGRESOS
          </span>
        )}
      </div>
    </Link>
  )
}
