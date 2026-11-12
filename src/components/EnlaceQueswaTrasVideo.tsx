'use client'
/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * El botón «Hablar con Queswa» de la página del video «Cómo funciona»
 * (/{slug}/ver-como-funciona, 12 nov 2026).
 *
 * Lleva al enlace de Queswa del socio, que ya decide por dispositivo (WhatsApp en
 * el celular, el chat en el computador) y registra la apertura. Si la persona vio
 * el video, va a /{slug}/como-funciona, que le dice a Queswa «Ya vi el video de
 * cómo funciona» para que no se lo repita; si lo tocó sin verlo, a /{slug}/queswa:
 * a Queswa no se le dice que alguien vio lo que no ha visto.
 */
import { vioVideoComoFunciona } from '@/lib/orbe-config'

export default function EnlaceQueswaTrasVideo({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <a
      href={`/${slug}/queswa`}
      className="cta-base cta-primary"
      style={{ width: '100%' }}
      onClick={(e) => {
        if (!vioVideoComoFunciona()) return
        e.preventDefault()
        window.location.href = `/${slug}/como-funciona`
      }}
    >
      {children}
    </a>
  )
}
