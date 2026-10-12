/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El navegador del enlace que lleva a Queswa (11 oct 2026).
 *
 * /{slug}/queswa y los enlaces de los videos saltan a WhatsApp sin mostrar
 * página, así que tracking.js nunca corre ahí. En ese salto se deja la cookie de
 * un año que tracking.js ya usa (`nexus_prospect_id`, mismo formato `ck_…`) y la
 * página pega su código al mensaje (`c:…`), como el orbe pega la huella (`w:…`).
 * Cuando la persona escribe, el webhook ata esa cookie a su WhatsApp; cuando el
 * navegador vuelve —aunque sea al año—, identify_prospect lo reconoce y la
 * visita llega con su nombre. Caso Edilberto Afanador: entró el 28 sep por
 * /luis-cabrejo/estrategia, volvió el 10 oct a la presentación, y el aviso dijo
 * «Un visitante». Detalle en `atarCookieWeb` (src/lib/wa-avisos-contexto.ts).
 *
 * ⚠️ Next.js solo lee ESTE archivo: con el código en src/, el `middleware.ts` de
 * la raíz (el de tenants) nunca ha corrido. No se fusionan: ese otro sobrescribe
 * `x-tenant-id`, y el webhook de WhatsApp manda `whatsapp` en esa cabecera.
 */
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/:slug/:destino(queswa|acceso|como-funciona|estrategia|como-entra-el-dinero|que-debo-hacer-yo)'],
}

const COOKIE_VISITANTE = 'nexus_prospect_id'
const RE_COOKIE_VISITANTE = /^ck_[a-z0-9]{6,12}$/
const UN_ANO_S = 31_536_000

function cookieDeVisitante(req: NextRequest): { valor: string; nueva: boolean } {
  const actual = req.cookies.get(COOKIE_VISITANTE)?.value
  if (actual && RE_COOKIE_VISITANTE.test(actual)) return { valor: actual, nueva: false }
  const azar = new Uint8Array(10)
  crypto.getRandomValues(azar)
  return { valor: `ck_${Array.from(azar, (b) => (b % 36).toString(36)).join('')}`, nueva: true }
}

export function middleware(req: NextRequest) {
  const { valor, nueva } = cookieDeVisitante(req)
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-cta-visitante', valor)
  const res = NextResponse.next({ request: { headers: requestHeaders } })
  // Sin HttpOnly: tracking.js la lee con document.cookie.
  if (nueva) res.cookies.set(COOKIE_VISITANTE, valor, { maxAge: UN_ANO_S, path: '/', sameSite: 'lax', secure: req.nextUrl.protocol === 'https:' })
  return res
}
