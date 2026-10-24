/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El puente del enlace del socio hacia WhatsApp, en el celular y la tableta
 * (Director, 24 oct 2026): creatuactivo.com/{slug}/queswa (y los enlaces de los
 * videos) ya no redirige a wa.me. Sirve esta página mínima, con la misma tarjeta
 * que la persona acaba de ver en WhatsApp y UN solo botón, «Abrir Queswa en
 * WhatsApp».
 *
 * Por qué un botón y no una redirección: WhatsApp abre nuestro enlace en su
 * navegador interno, y de un navegador solo se sale a otra app con un toque de
 * la persona. Con la redirección a wa.me (hasta el 23 oct) la persona caía en la
 * página de api.whatsapp.com («Abrir aplicación» · «¿No tienes la aplicación?
 * Descárgala ahora») y Chrome le ponía encima su cuadro «¿Quieres continuar a
 * WhatsApp?», porque el salto a la app lo pedía un script y no un toque. Los
 * esquemas nativos desde la redirección (intent:// y whatsapp://, 23 oct, 18:20
 * y 18:31) chocaban con lo mismo. El toque es inevitable; aquí cae sobre nuestra
 * marca, sin la oferta de descarga y sin el cuadro de Chrome.
 *
 * El destino del botón depende del sistema:
 *  · Android → `intent://…#Intent;scheme=whatsapp;package=com.whatsapp;…` con
 *    `S.browser_fallback_url` a wa.me: Chrome abre la app directo y, si no está
 *    instalada, va a wa.me. Un toque sobre un intent:// no dispara el cuadro de
 *    confirmación.
 *  · iOS (y cualquier otro) → `https://wa.me/…`: en iOS es un enlace universal de
 *    WhatsApp, y tocado por la persona abre la app sin preguntar. Sin la app,
 *    wa.me ofrece instalarla.
 *
 * Nada se dispara solo al cargar: un salto automático es justo lo que Chrome
 * bloquea o convierte en pregunta. El orbe se retira (<SinOrbe />): la página
 * tiene una sola salida y el orbe del celular abriría WhatsApp con otro texto.
 *
 * El computador no pasa por aquí: conversa en el chat web de la Home
 * (Director, 13 oct 2026; la regla vive en src/lib/dispositivo.ts).
 */

import Image from 'next/image'
import SinOrbe from '@/components/SinOrbe'

type Props = {
  /** El número de Queswa, solo dígitos (573215193909). */
  telefono: string
  /** El mensaje pre-llenado, sin codificar. */
  texto: string
  /** `sistemaDe(agente)`: decide el esquema del botón. */
  sistema: string
  /** Título y descripción de la tarjeta (OG_QUESWA). */
  titulo: string
  descripcion: string
  /** La imagen de la tarjeta (la misma que ve en WhatsApp al pegar el enlace). */
  imagen: string
  imagenAlt: string
}

export function enlaceParaAbrirWhatsApp(telefono: string, texto: string, sistema: string): string {
  const t = encodeURIComponent(texto)
  const waMe = `https://wa.me/${telefono}?text=${t}`
  if (sistema === 'Android') {
    return `intent://send/?phone=${telefono}&text=${t}#Intent;scheme=whatsapp;package=com.whatsapp;S.browser_fallback_url=${encodeURIComponent(waMe)};end`
  }
  return waMe
}

export default function AbrirQueswaEnWhatsApp({ telefono, texto, sistema, titulo, descripcion, imagen, imagenAlt }: Props) {
  const href = enlaceParaAbrirWhatsApp(telefono, texto, sistema)

  return (
    <div
      className="flex items-center justify-center px-4"
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse 70% 55% at 30% 0%, rgba(148,163,184,0.09) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 75% 10%, rgba(197,160,89,0.07) 0%, transparent 65%), var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
      }}
    >
      <SinOrbe />
      <div className="w-full max-w-md py-10 text-center">
        <div
          className="mb-8 overflow-hidden"
          style={{ borderRadius: 'var(--radius-action)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <Image
            src={imagen}
            alt={imagenAlt}
            width={1200}
            height={630}
            priority
            unoptimized
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
        </div>

        <h1 className="mb-4 font-serif text-3xl text-white md:text-4xl">{titulo}</h1>
        <p className="mb-8 text-base leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
          {descripcion}
        </p>

        {/* El mensaje que va a salir, para que nadie crea que hubo un error al ver
            un texto ya escrito en WhatsApp (caso Felipe, 6 oct 2026). */}
        <p
          className="mx-auto mb-8 inline-block px-5 py-3 text-left text-sm leading-relaxed"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-action)',
            color: 'var(--color-text-body)',
          }}
        >
          {texto}
        </p>

        <a href={href} className="cta-base cta-primary w-full" style={{ padding: '1.1rem 2rem', fontSize: '0.95rem' }}>
          Abrir Queswa en WhatsApp
        </a>
      </div>
    </div>
  )
}
