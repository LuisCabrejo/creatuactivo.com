/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El copy del hablador de mostrador, en un solo sitio: lo leen la página
 * (/hablador/{slug}) y el PDF de imprenta (src/lib/hablador-pdf.ts), que tienen que
 * decir lo mismo. Copy aprobado por el Director (20-21 nov 2026): no se cambia sin
 * proponerlo antes en el chat.
 */

export const CEJA = 'Catálogo Gano Excel'
// En dos líneas, como las corta la página a 24 pt: el PDF no reparte el texto solo.
export const TITULO_LINEAS = ['Un café para', 'tomarse con calma.'] as const
export const TITULO = TITULO_LINEAS.join(' ')
export const BAJADA = 'Bebidas enriquecidas, suplementos y cuidado personal.'
export const PASOS = 'Escanee · Pregunte · Pida por WhatsApp'

/**
 * El hablador por tipo de negocio (27 nov 2026, Director: «requerimos poder generar
 * este arte para diferentes escenarios»). Todos con la misma maqueta —ceja, título en
 * dos líneas, bajada, la escena con el QR al lado y los pasos abajo—, así que un
 * negocio nuevo es una escena, su texto aprobado y una línea aquí: el PDF no se vuelve
 * a medir. Cada uno tiene su QR (`destino`), que cuenta sus escaneos aparte y abre el
 * catálogo en la línea que le toca (`linea`).
 * ⛔ Sin declaraciones: en el salón, nada sobre el cabello; en el gimnasio, nada de
 * rendimiento, y el Cordygold no lleva Ganoderma; en la farmacia, nada de salud.
 */
export type Negocio = 'cafeteria' | 'salon' | 'gimnasio' | 'naturista'
export const NEGOCIOS: Record<Negocio, { nombre: string; titulo: readonly [string, string]; bajada: string; destino: string; linea?: string }> = {
  cafeteria: { nombre: 'Cafetería', titulo: TITULO_LINEAS, bajada: BAJADA, destino: 'hablador' },
  salon: {
    nombre: 'Salón de belleza', titulo: ['Llévese el cuidado', 'a casa.'],
    bajada: 'Champú y acondicionador con extracto de Ganoderma.', destino: 'hablador-salon', linea: 'cuidado',
  },
  gimnasio: {
    nombre: 'Gimnasio', titulo: ['Un café antes', 'de entrenar.'],
    bajada: 'Café, suplementos y bebidas enriquecidas.', destino: 'hablador-gimnasio',
  },
  // Farmacia y tienda naturista (27 nov 2026): el Ganocafé 3 en 1 y las Cápsulas de
  // Ganoderma. ⛔ Ni siquiera la declaración aprobada de las defensas: impresa junto a
  // los medicamentos se lee como remedio. Está en la ficha, que es a donde lleva el QR.
  naturista: {
    nombre: 'Farmacia o tienda naturista', titulo: ['El Ganoderma,', 'a su manera.'],
    bajada: 'Café 3 en 1 y cápsulas con extracto de Ganoderma.', destino: 'hablador-naturista',
  },
}
export function negocioDe(v: unknown): Negocio {
  return typeof v === 'string' && v in NEGOCIOS ? (v as Negocio) : 'cafeteria'
}
/** El negocio de un QR: `hablador-salon` → salon. */
export function negocioDelDestino(destino: string): Negocio | null {
  const n = (Object.keys(NEGOCIOS) as Negocio[]).find((k) => NEGOCIOS[k].destino === destino)
  return n ?? null
}
