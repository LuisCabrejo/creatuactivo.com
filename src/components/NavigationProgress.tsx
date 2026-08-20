'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Barra de progreso de navegación.
 *
 * EL PROBLEMA QUE RESUELVE: las rutas principales son Server Components, así que
 * al tocar un enlace Next debe ir al servidor por el payload RSC antes de pintar
 * nada. Medido en producción: ~370ms de TTFB desde una conexión buena; en 4G
 * colombiano son 600–1200ms. Durante ese tiempo la pantalla se queda EXACTAMENTE
 * igual — el usuario cree que su toque no registró y vuelve a tocar.
 *
 * POR QUÉ NO loading.tsx: en App Router el fallback de loading.tsx REEMPLAZA la
 * página actual. Se pasa de "no pasa nada" a "la pantalla se vacía", que se lee
 * peor. Una app nativa mantiene la pantalla anterior y avisa que algo va en
 * camino; eso es lo que hace esta barra.
 *
 * Next 14 no expone eventos de router en App Router (ni useLinkStatus, que llegó
 * en 15.3), así que el disparo se detecta en el clic y el cierre en el cambio de
 * pathname.
 */
export default function NavigationProgress() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const creepRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const armRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Next prefetcha los Link visibles, así que muchas navegaciones son
  // instantáneas. Mostrar la barra en esas produce un destello de 40ms que
  // ensucia más de lo que informa: solo se arma si la ruta tarda de verdad.
  const ARM_DELAY_MS = 150

  // Corta el avance simulado
  const stopCreep = () => {
    if (creepRef.current) {
      clearInterval(creepRef.current)
      creepRef.current = null
    }
    if (armRef.current) {
      clearTimeout(armRef.current)
      armRef.current = null
    }
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Clic con modificador o con botón secundario = el navegador abre aparte
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const anchor = (e.target as HTMLElement | null)?.closest?.('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || anchor.hasAttribute('download')) return
      if (anchor.target && anchor.target !== '_self') return

      let url: URL
      try {
        url = new URL(anchor.href, window.location.href)
      } catch {
        return
      }

      // Externo, ancla dentro de la misma página, o el sitio donde ya se está
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) return

      stopCreep()

      armRef.current = setTimeout(() => {
        setVisible(true)
        setProgress(0.08)

        // Avance asintótico: nunca llega al final solo. Llegar al 100% antes de
        // que la página exista sería mentir, y se nota.
        creepRef.current = setInterval(() => {
          setProgress((p) => (p >= 0.9 ? p : p + (0.9 - p) * 0.12))
        }, 120)
      }, ARM_DELAY_MS)
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  // La ruta cambió: cerrar
  useEffect(() => {
    stopCreep()
    if (!visible) return

    setProgress(1)
    hideRef.current = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 260)

    return () => {
      if (hideRef.current) clearTimeout(hideRef.current)
    }
    // Se dispara con el pathname a propósito: 'visible' solo se lee, no debe reactivar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => () => {
    stopCreep()
    if (hideRef.current) clearTimeout(hideRef.current)
  }, [])

  if (!visible) return null

  return (
    <div
      className="nav-progress"
      style={{ transform: `scaleX(${progress})`, opacity: progress >= 1 ? 0 : 1 }}
      role="presentation"
      aria-hidden="true"
    />
  )
}
