'use client'

/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El botón «Abrir Queswa en WhatsApp» del puente (AbrirQueswaEnWhatsApp.tsx), y
 * el registro de cada toque (Director, 30 oct 2026). La apertura del enlace ya
 * quedaba en `page_visits` (origen 'enlace'); el toque no. Sin él, quien no tocó
 * el botón y quien lo tocó y no envió en WhatsApp eran la misma cifra, y la
 * medición del 30 oct (49 % con redirección directa contra 21 % con el puente)
 * no podía decir si el toque de más era la causa.
 *
 * El toque va como origen 'puente', con la ruta y el slug de la apertura: en
 * `medir-aperturas-enlace.mjs` es su propia fila y no suma aperturas, y el aviso
 * «abrió y no envió» del Dashboard (origen 'enlace' | 'pedido') no lo ve. Con
 * `sendBeacon`, la petición sale aunque la app de WhatsApp tape la página. Si
 * falla, el botón abre igual: medir no puede costar una conversación.
 */

type Props = { href: string; slug: string; ruta: string }

export default function BotonAbrirWhatsApp({ href, slug, ruta }: Props) {
  const registrarToque = () => {
    try {
      const cuerpo = JSON.stringify({ destino: 'whatsapp', origen: 'puente', ruta, ref: slug })
      const blob = new Blob([cuerpo], { type: 'application/json' })
      if (navigator.sendBeacon?.('/api/track/apertura', blob)) return
      fetch('/api/track/apertura', { method: 'POST', body: cuerpo, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
    } catch { /* medir no puede costar una conversación */ }
  }

  return (
    <a href={href} onClick={registrarToque} className="cta-base cta-primary w-full" style={{ padding: '1.1rem 2rem', fontSize: '0.95rem' }}>
      Abrir Queswa en WhatsApp
    </a>
  )
}
