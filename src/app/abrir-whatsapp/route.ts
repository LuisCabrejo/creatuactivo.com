/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El salto a la app de WhatsApp en Android (23 oct 2026). /{slug}/queswa trae
 * aquí al celular Android y esta ruta responde con un 307 a `intent://`, que
 * Chrome abre en la app de WhatsApp (o en wa.me si no está instalada).
 *
 * ⚠️ No se puede hacer con `redirect()` desde la página: Next 14 guarda la URL
 * del redirect en un texto separado por `;` (`NEXT_REDIRECT;replace;url;307`) y
 * la sintaxis de `intent://` usa `;`, así que Next no reconoce su propio
 * redirect y la persona ve «Application error» (pasó en producción el 23 oct).
 * Aquí la cabecera `Location` se escribe a mano. El 307 encadenado conserva el
 * toque de la persona, que es lo que deja a Chrome abrir otra app.
 *
 * Solo abre el chat con el número de Queswa: el texto es lo único que viaja.
 */

const WHATSAPP_QUESWA = '573215193909'

export function GET(req: Request) {
  const texto = (new URL(req.url).searchParams.get('text') || 'Hola Queswa').slice(0, 300)
  const t = encodeURIComponent(texto)
  const respaldo = `https://wa.me/${WHATSAPP_QUESWA}?text=${t}`
  const intent = `intent://send/?phone=${WHATSAPP_QUESWA}&text=${t}#Intent;scheme=whatsapp;package=com.whatsapp;S.browser_fallback_url=${encodeURIComponent(respaldo)};end`
  return new Response(null, { status: 307, headers: { Location: intent, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } })
}
