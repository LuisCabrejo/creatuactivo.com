'use client'
/**
 * Transición de entrada de ruta.
 *
 * template.tsx (a diferencia de layout.tsx) se REMONTA en cada navegación,
 * que es justo lo que se necesita para que la animación vuelva a dispararse.
 * 220ms: suficiente para que el cambio se lea como transición, no como salto;
 * corto para que nadie lo perciba como espera.
 *
 * ⚠️ La PRIMERA pintura de cada visita llega sin fundido (1 oct 2026). El fundido
 * arranca en opacidad 0, y Chrome no cuenta como «elemento principal» (LCP) nada
 * que se pinte invisible: el título y la portada del video quedaban fuera, y el
 * elemento principal de la Home, Tecnología y Productos terminaba siendo el aviso
 * de cookies, que aparece a los tres segundos. Además, a quien llega de Google o
 * de WhatsApp la página ya le aparece sola; el fundido es para el paso de una
 * pantalla a otra dentro del sitio. El servidor nunca ejecuta el efecto, así que
 * siempre entrega la página sin la clase y la hidratación coincide.
 */
import { useEffect } from 'react'

let yaPintoLaPrimera = false

export default function Template({ children }: { children: React.ReactNode }) {
  const animar = yaPintoLaPrimera
  useEffect(() => {
    yaPintoLaPrimera = true
  }, [])
  return <div className={animar ? 'route-enter' : undefined}>{children}</div>
}
