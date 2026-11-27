/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El PDF de imprenta del hablador de mostrador (Director, 21 nov 2026: «el objetivo
 * debe ser compartir en PDF en alta resolución para imprimir»). Lo sirve
 * /hablador/{slug}/pdf, y es lo que el socio descarga del Dashboard y le manda a la
 * imprenta por WhatsApp.
 *
 * Lo que pide una imprenta, y cómo lo cumple:
 *   · TAMAÑO FINAL 10 × 15 cm CON 3 mm DE SANGRADO: la página mide 106 × 156 mm, con
 *     la TrimBox (el corte) y la BleedBox declaradas, así el programa de la imprenta
 *     sabe dónde cortar sin marcas que confundan a quien lo abre en el celular.
 *   · CMYK: el fondo va convertido con el perfil ISO Coated v2 300 % (FOGRA39), el
 *     estándar de papel estucado; el negro es su negro enriquecido (73/68/63/95,
 *     299 % de tinta). Los textos van en CMYK y los módulos del QR en negro puro (K 100).
 *   · 300 ppp: la foto es la del fondo de la página (1252 × 1843 px a 106 × 156 mm).
 *   · VECTORIAL donde importa: el texto (Inter incrustada) y el QR son trazos, nítidos
 *     a cualquier tamaño. ⚠️ El QR en negro puro y sobre papel sin tinta: en cuatro
 *     colores, un registro corrido lo vuelve ilegible.
 *
 * ⚠️ La maqueta es la de la página (/hablador/{slug}?variante=ganocafe-grande): las
 * posiciones de abajo se midieron sobre ella el 21 nov 2026 (Chromium, en mm desde el
 * borde de corte). Si la página cambia, se miden de nuevo; si no, el PDF y la pantalla
 * dejan de coincidir.
 */

import { PDFDocument, cmyk, pushGraphicsState, popGraphicsState, setCharacterSpacing, type PDFFont, type PDFPage, type Color } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import QRCode from 'qrcode'
import { CEJA, TITULO_LINEAS, BAJADA, PASOS } from '@/app/hablador/[slug]/pieza'

const PT = 72 / 25.4                  // puntos por mm
const SANGRE = 3
const ANCHO = 100 + SANGRE * 2, ALTO = 150 + SANGRE * 2

// Los colores de la página, llevados a FOGRA39 con el mismo perfil e intención que el
// fondo (scripts/hablador-fondo-cmyk.py).
const TITULO = cmyk(0.05, 0.04, 0.03, 0)       // #F5F5F7
const ORO = cmyk(0.15, 0.30, 0.69, 0.15)       // #C5A059
const TEXTO_2 = cmyk(0.35, 0.27, 0.24, 0.12)   // #A1A1A6
const TEXTO_3 = cmyk(0.49, 0.40, 0.35, 0.30)   // #6E6E73
const PAPEL = cmyk(0, 0, 0, 0)
const NEGRO_QR = cmyk(0, 0, 0, 1)

export interface InsumosHablador {
  fondoCmyk: ArrayBuffer | Uint8Array   // fondo-ganocafe-grande-cmyk-v1.jpg
  /** La taza sola, para Estados Unidos (27 nov 2026): fondo-taza-cmyk-v1.jpg. */
  fondoTazaCmyk: ArrayBuffer | Uint8Array
  interRegular: ArrayBuffer | Uint8Array
  interMedium: ArrayBuffer | Uint8Array
  interSemiBold: ArrayBuffer | Uint8Array
}

/**
 * Las dos piezas (27 nov 2026). Colombia: la escena con la caja de Ganocafé 3 en 1 y el
 * QR a la derecha de la caja. Estados Unidos: la taza sola (la pieza del 20 nov 2026),
 * porque la caja de la escena es la de Colombia; el QR va abajo, en el eje. Las líneas
 * de base salen de la página (/hablador/{slug}?pais=us), medidas como las de Colombia.
 */
const PIEZAS = {
  CO: { ceja: 13.31, titulo: [24.20, 33.00], bajada: 39.89, pasos: 138.81, enlace: 143.51, qr: { x: 54.5, y: 50.4, lado: 25, margen: 2.5, radio: 2.6 } },
  US: { ceja: 16.31, titulo: [27.20, 36.00], bajada: 42.89, pasos: 136.81, enlace: 141.51, qr: { x: 36.5, y: 103.2, lado: 27, margen: 2.6, radio: 2.6 } },
} as const

/**
 * El PDF del hablador del socio, con el QR a `https://creatuactivo.com/{slug}/hablador`,
 * o a `/{slug}/hablador-us` el de Estados Unidos, que abre el catálogo de allá.
 */
export async function crearPdfHablador(slug: string, insumos: InsumosHablador, pais: 'CO' | 'US' = 'CO'): Promise<Uint8Array> {
  const L = PIEZAS[pais]
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)
  const [regular, medium, semibold, fondo] = await Promise.all([
    doc.embedFont(insumos.interRegular, { subset: true }),
    doc.embedFont(insumos.interMedium, { subset: true }),
    doc.embedFont(insumos.interSemiBold, { subset: true }),
    doc.embedJpg(pais === 'US' ? insumos.fondoTazaCmyk : insumos.fondoCmyk),
  ])

  const enlace = `creatuactivo.com/${slug}/${pais === 'US' ? 'hablador-us' : 'hablador'}`
  doc.setTitle(`Hablador de mostrador · ${slug}`)
  doc.setSubject('10 × 15 cm con 3 mm de sangrado · CMYK (ISO Coated v2 300 %, FOGRA39)')
  doc.setAuthor('CreaTuActivo.com')
  doc.setCreator('CreaTuActivo.com')
  doc.setProducer('CreaTuActivo.com')

  const page = doc.addPage([ANCHO * PT, ALTO * PT])
  page.setBleedBox(0, 0, ANCHO * PT, ALTO * PT)
  page.setTrimBox(SANGRE * PT, SANGRE * PT, 100 * PT, 150 * PT)
  page.drawImage(fondo, { x: 0, y: 0, width: ANCHO * PT, height: ALTO * PT })

  // Las líneas de base, en mm desde el borde de arriba del corte (medidas en la página).
  texto(page, CEJA, { font: semibold, size: 8, base: L.ceja, color: ORO, tracking: 0.01 })
  texto(page, TITULO_LINEAS[0], { font: semibold, size: 24, base: L.titulo[0], color: TITULO, tracking: -0.03 })
  texto(page, TITULO_LINEAS[1], { font: semibold, size: 24, base: L.titulo[1], color: TITULO, tracking: -0.03 })
  texto(page, BAJADA, { font: regular, size: 8.6, base: L.bajada, color: TEXTO_2 })
  texto(page, PASOS, { font: medium, size: 7.6, base: L.pasos, color: TITULO, tracking: 0.005 })
  // El enlace cambia con el slug: si uno largo no cabe en los 82 mm, se achica.
  const tamEnlace = Math.min(6, (82 * PT) / regular.widthOfTextAtSize(enlace, 1))
  texto(page, enlace, { font: regular, size: tamEnlace, base: L.enlace, color: TEXTO_3 })

  qr(page, `https://${enlace}`, L.qr)

  return doc.save()
}

/** Una línea centrada en el eje de la pieza (50 mm), con el tracking de la página en em. */
function texto(page: PDFPage, s: string, o: { font: PDFFont; size: number; base: number; color: Color; tracking?: number }) {
  const tc = (o.tracking ?? 0) * o.size
  // Como en el navegador, el espaciado va también después de la última letra.
  const ancho = o.font.widthOfTextAtSize(s, o.size) + tc * [...s].length
  page.pushOperators(pushGraphicsState(), setCharacterSpacing(tc))
  page.drawText(s, { x: (SANGRE + 50) * PT - ancho / 2, y: (ALTO - SANGRE - o.base) * PT, size: o.size, font: o.font, color: o.color })
  page.pushOperators(popGraphicsState())
}

/** El QR: un recuadro de papel con las esquinas redondas y los módulos en un solo trazo. */
function qr(page: PDFPage, url: string, o: { x: number; y: number; lado: number; margen: number; radio: number }) {
  const x0 = (SANGRE + o.x) * PT, yArriba = (ALTO - SANGRE - o.y) * PT
  const l = o.lado * PT, r = o.radio * PT
  page.drawSvgPath(
    `M ${r} 0 H ${l - r} A ${r} ${r} 0 0 1 ${l} ${r} V ${l - r} A ${r} ${r} 0 0 1 ${l - r} ${l} H ${r} A ${r} ${r} 0 0 1 0 ${l - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`,
    { x: x0, y: yArriba, color: PAPEL },
  )
  const m = QRCode.create(url, { errorCorrectionLevel: 'M' }).modules
  const n = m.size
  // Un rectángulo por cada tramo de módulos oscuros de una fila, todos en un trazado:
  // rectángulos sueltos dejan una línea clara entre módulos en los visores.
  let d = ''
  for (let f = 0; f < n; f++) {
    for (let c = 0; c < n; c++) {
      if (!m.get(f, c)) continue
      let fin = c
      while (fin + 1 < n && m.get(f, fin + 1)) fin++
      d += `M ${c} ${f} H ${fin + 1} V ${f + 1} H ${c} Z `
      c = fin
    }
  }
  const modulo = ((o.lado - o.margen * 2) * PT) / n
  page.drawSvgPath(d, { x: x0 + o.margen * PT, y: yArriba - o.margen * PT, scale: modulo, color: NEGRO_QR })
}
