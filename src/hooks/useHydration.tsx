/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

// src/hooks/useHydration.ts
'use client'

import { useEffect, useState } from 'react'

/**
 * Hook personalizado para manejar la hidratación en Next.js
 * Previene errores de hidratación al asegurar que el componente
 * se renderize igual en servidor y cliente inicialmente
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * Componente wrapper para elementos que necesitan hidratación
 * Renderiza un fallback hasta que la hidratación esté completa
 */
interface HydrationBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export function HydrationBoundary({
  children,
  fallback = null,
  className = "hydration-safe"
}: HydrationBoundaryProps) {
  const isHydrated = useHydration()

  if (!isHydrated) {
    return fallback ? (
      <div className={className}>
        {fallback}
      </div>
    ) : null
  }

  return <>{children}</>
}

/**
 * Hook para detectar si estamos en el cliente
 * Útil para componentes que dependen de APIs del navegador
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Hook para manejar estados que solo deben existir en el cliente
 * Evita diferencias entre servidor y cliente
 */
export function useClientState<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue)
  const isClient = useIsClient()

  return isClient ? [state, setState] as const : [initialValue, setState] as const
}
