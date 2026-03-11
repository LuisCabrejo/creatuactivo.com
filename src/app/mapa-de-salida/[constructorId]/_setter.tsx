'use client'

import { useEffect } from 'react'

/**
 * Guarda el constructorId del path en localStorage como 'constructor_ref'
 * para que el formulario de registro lo pueda leer al hacer submit.
 */
export function ConstructorRefSetter({ constructorId }: { constructorId: string }) {
  useEffect(() => {
    if (constructorId) {
      localStorage.setItem('constructor_ref', constructorId)
      console.log('✅ [MapaDeSalida] constructor_ref guardado:', constructorId)
    }
  }, [constructorId])
  return null
}
