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
