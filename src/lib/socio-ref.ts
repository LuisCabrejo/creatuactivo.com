/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Quién es el socio detrás de una referencia (slug vigente, seudónimo anterior o
 * constructor_id), y si sus clientes pueden pagarle directo a Gano Excel.
 *
 * «Pagar a Gano Excel» funciona por defecto para todo distribuidor que tenga su
 * código y su contraseña de Gano guardados en queswa.app (`gano_credentials`):
 * sin eso el Dashboard no puede crear el pedido en su cuenta (Director, 17 oct 2026).
 * No hay interruptor: la contraseña guardada es el interruptor.
 */

export interface SocioRef {
  constructorId: string
  slug: string | null
  nombre: string
  whatsapp: string | null
  foto: string | null
}

const RE_REF = /^[a-z0-9-]{2,80}$/

function cabeceras() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return { apikey: key, Authorization: `Bearer ${key}` }
}

async function leer<T = Record<string, unknown>>(ruta: string): Promise<T[] | null> {
  const r = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${ruta}`, { headers: cabeceras(), cache: 'no-store' })
  return r.ok ? ((await r.json()) as T[]) : null
}

export async function resolverRef(refCrudo: string | null | undefined): Promise<SocioRef | null> {
  const ref = decodeURIComponent(refCrudo || '').toLowerCase().trim()
  if (!RE_REF.test(ref)) return null
  type Fila = { slug: string | null; constructor_id: string; foto_url: string | null }
  let fila = (await leer<Fila>(`constructor_slugs?slug=eq.${encodeURIComponent(ref)}&select=slug,constructor_id,foto_url`))?.[0]
  if (!fila) {
    const alias = (await leer<{ constructor_id: string }>(`constructor_slug_aliases?slug=eq.${encodeURIComponent(ref)}&select=constructor_id`))?.[0]
    const id = alias?.constructor_id ?? ref
    fila = (await leer<Fila>(`constructor_slugs?constructor_id=eq.${encodeURIComponent(id)}&select=slug,constructor_id,foto_url`))?.[0]
      ?? { slug: null, constructor_id: id, foto_url: null }
  }
  const usuario = (await leer<{ name: string | null; whatsapp: string | null }>(`private_users?constructor_id=eq.${encodeURIComponent(fila.constructor_id)}&select=name,whatsapp`))?.[0]
  if (!usuario?.name) return null
  return { constructorId: fila.constructor_id, slug: fila.slug, nombre: usuario.name, whatsapp: usuario.whatsapp ?? null, foto: fila.foto_url }
}

/** ¿Tiene guardadas sus credenciales de Gano? Si falla la consulta, no: es mejor ofrecer de menos. */
export async function tienePagoGano(constructorId: string | null | undefined): Promise<boolean> {
  if (!constructorId) return false
  try {
    const filas = await leer<{ constructor_id: string }>(`gano_credentials?constructor_id=eq.${encodeURIComponent(constructorId)}&select=constructor_id`)
    return Array.isArray(filas) && filas.length > 0
  } catch {
    return false
  }
}

/** «Luis Cabrejo» (nombre y primer apellido) y «Luis». */
export function nombreVisible(nombre: string): { nombre: string; primerNombre: string } {
  const partes = nombre.trim().split(/\s+/)
  return { nombre: partes.slice(0, 2).join(' '), primerNombre: partes[0] }
}
