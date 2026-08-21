/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * ORBE FLOTANTE — QUÉ SE ABRE AL TOCARLO. Un solo interruptor para todo el sitio.
 *
 * FASE INICIAL (21 ago 2026, decisión del Director): el orbe por defecto lleva la
 * conversación a WhatsApp. Allá ya vive el motor completo —guardarraíles de salud
 * y de negocio, radicación contra `pending_activations`, atribución al socio y
 * avisos al Radar—, mientras que el chat web responde sin ninguno de esos filtros.
 *
 * ⚠️ El chat web NO se elimina: `UnifiedQueswaOrb` sigue montándose en las rutas de
 * `RUTAS_ORBE_QUESWA_WEB` y todo su código queda intacto. Para volver atrás en el
 * sitio entero basta con `ORBE_MODO = 'queswa'` — una línea, sin tocar componentes.
 *
 * ⏳ Decisión definitiva en 8-15 días. El borrador del Director: el socio de plan
 * gratuito enviaría a sus prospectos al orbe web y el de plan con tecnología al de
 * WhatsApp. Ese día esta constante deja de ser fija y pasa a resolverse por el plan
 * del socio dueño del `ref` — por eso la decisión ya vive aquí y no repartida por
 * los componentes.
 */

export type ModoOrbe = 'whatsapp' | 'queswa'

/** El interruptor. Cambiar a 'queswa' devuelve el chat web a todo el sitio. */
export const ORBE_MODO: ModoOrbe = 'whatsapp'

/**
 * Rutas que conservan el chat web SIEMPRE, sea cual sea el modo.
 *
 * Los decks (`/servilleta`, `/12-niveles`) se presentan en vivo delante del
 * prospecto: el botón "PREGÚNTALE ALGO EN VIVO" del slide 2 existe para DEMOSTRAR
 * la tecnología en la misma pantalla. Mandar esa demo a WhatsApp la rompe — saca
 * al prospecto de la presentación que el socio está dando.
 */
export const RUTAS_ORBE_QUESWA_WEB = ['/servilleta', '/12-niveles'] as const

export function usaChatWeb(pathname: string): boolean {
  if (ORBE_MODO === 'queswa') return true
  return RUTAS_ORBE_QUESWA_WEB.some((r) => pathname === r || pathname.startsWith(`${r}/`))
}

/** El WABA de Queswa (+57 321 519 3909). No es el personal de Luis ni el orgánico. */
export const QUESWA_WABA = '573215193909'

export type ContextoOrbe = 'general' | 'productos'

/**
 * Texto pre-llenado del wa.me.
 *
 * ⚠️ SIN EMOJI, y medido (19 ago 2026): la pre-carga de texto de wa.me destruye
 * cualquier emoji de cuatro bytes y al webhook le llega U+FFFD. El primer mensaje
 * de la conversación es el peor lugar para un cuadrito roto.
 *
 * ⚠️ El `ref` va literal en el texto porque `resolverPatrocinador()` (webhook) lo
 * lee de ahí — acepta tanto el constructor_id (`luis-cabrejo-1288`) como el slug.
 * Sin él el prospecto entra sin dueño: fuera del Radar del socio, sin push, y la
 * apertura cae al saludo genérico de marca en vez de nombrarlo.
 */
export function enlaceQueswaWhatsApp(
  ref?: string | null,
  contexto: ContextoOrbe = 'general',
): string {
  const texto = ref
    ? contexto === 'productos'
      ? `Hola Queswa, vengo del enlace de ${ref}. Quiero preguntar por los productos.`
      : `Hola Queswa, vengo del enlace de ${ref}`
    : contexto === 'productos'
      ? 'Hola Queswa, quiero preguntar por los productos'
      : 'Hola Queswa, quiero saber cómo funciona'

  return `https://wa.me/${QUESWA_WABA}?text=${encodeURIComponent(texto)}`
}

/** Lee la atribución del socio en el cliente: ?ref= de la URL, luego localStorage. */
export function leerRefSocio(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const enUrl = new URL(window.location.href).searchParams.get('ref')
    if (enUrl) return enUrl
    return localStorage.getItem('constructor_ref')
  } catch {
    return null
  }
}
