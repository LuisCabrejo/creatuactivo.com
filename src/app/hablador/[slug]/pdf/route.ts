/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * /hablador/{slug}/pdf — el PDF de imprenta del hablador de mostrador del socio
 * (Director, 21 nov 2026): 10 × 15 cm con 3 mm de sangrado, CMYK, texto y QR
 * vectoriales. Lo arma src/lib/hablador-pdf.ts; aquí solo se resuelve el socio y se
 * entrega. `?descargar=1` lo baja como archivo; sin él, el celular lo abre para verlo
 * y compartirlo.
 *
 * Los insumos viven junto a esta ruta, fuera de public/ (no son para la web):
 *   · fondo-ganocafe-grande-cmyk-v1.jpg, fondo-ganocafe-usa-cmyk-v1.jpg (Estados
 *     Unidos), fondo-salon-cmyk-v2.jpg, fondo-gimnasio-cmyk-v1.jpg y fondo-naturista-cmyk-v1.jpg
 *     (por negocio) —
 *     los genera scripts/componer-fondo-hablador.mjs.
 *     ⛔ Si cambia, lleva nombre nuevo, como el de la página.
 *   · Inter-{Regular,Medium,SemiBold}.ttf — Inter 4.0 (OFL), pasada de OTF a TrueType
 *     y recortada al alfabeto latino. ⚠️ En OTF (CFF), el recorte de fontkit deja la
 *     fuente dañada: el PDF abría sin texto en los visores.
 */

import { readFile } from 'fs/promises'
import { join } from 'path'
import { resolver } from '@/app/productos/socio'
import { crearPdfHablador } from '@/lib/hablador-pdf'
import { negocioDe } from '../pieza'

// Node y no edge: el fondo (~590 KB) y las fuentes cuentan en el tamaño de una función
// edge, que tiene tope de 1-4 MB según el plan. Los archivos se leen con
// join(process.cwd(), …), el patrón que Vercel rastrea e incluye en la función.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DIR = join(process.cwd(), 'src/app/hablador/[slug]/pdf')
let insumos: ReturnType<typeof cargar> | null = null
function cargar() {
  return Promise.all([
    readFile(join(DIR, 'fondo-ganocafe-grande-cmyk-v1.jpg')),
    readFile(join(DIR, 'fondo-ganocafe-usa-cmyk-v1.jpg')),
    readFile(join(DIR, 'fondo-salon-cmyk-v2.jpg')),
    readFile(join(DIR, 'fondo-gimnasio-cmyk-v1.jpg')),
    readFile(join(DIR, 'fondo-naturista-cmyk-v1.jpg')),
    readFile(join(DIR, 'Inter-Regular.ttf')),
    readFile(join(DIR, 'Inter-Medium.ttf')),
    readFile(join(DIR, 'Inter-SemiBold.ttf')),
  ]).then(([fondoCmyk, fondoUsaCmyk, fondoSalonCmyk, fondoGimnasioCmyk, fondoNaturistaCmyk, interRegular, interMedium, interSemiBold]) => ({ fondoCmyk, fondoUsaCmyk, fondoSalonCmyk, fondoGimnasioCmyk, fondoNaturistaCmyk, interRegular, interMedium, interSemiBold }))
}

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const r = await resolver(params.slug)
  if (!r?.slug) return new Response('No encontramos ese hablador.', { status: 404 })
  const url = new URL(req.url)
  // Un seudónimo anterior o el código: al slug vigente, que es el que va en el QR.
  if (r.slug !== params.slug) {
    return Response.redirect(new URL(`/hablador/${r.slug}/pdf${url.search}`, url), 308)
  }

  const esUS = url.searchParams.get('pais') === 'us'
  const negocio = esUS ? 'cafeteria' : negocioDe(url.searchParams.get('negocio'))
  insumos ??= cargar()
  let pdf: Uint8Array
  try {
    // ?pais=us: el de Estados Unidos (27 nov 2026), con la caja de allá y su QR al catálogo de allá.
    // ?negocio=salon|gimnasio|naturista (27 nov 2026): el de cada tipo de negocio, con su QR.
    pdf = await crearPdfHablador(r.slug, await insumos, esUS ? 'US' : 'CO', negocio)
  } catch (e) {
    insumos = null
    console.error('❌ [hablador/pdf]', e)
    return new Response('No pudimos armar el PDF. Intente de nuevo.', { status: 500 })
  }

  const archivo = `hablador-${r.slug}${esUS ? '-us' : negocio !== 'cafeteria' ? `-${negocio}` : ''}.pdf`
  return new Response(Buffer.from(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${url.searchParams.get('descargar') === '1' ? 'attachment' : 'inline'}; filename="${archivo}"`,
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
      'X-Robots-Tag': 'noindex',
    },
  })
}
