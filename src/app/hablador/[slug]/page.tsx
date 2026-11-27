/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El hablador de mostrador de UN socio: /hablador/{slug} (20 nov 2026, Director).
 *
 * Una pieza de 10 × 15 cm para el mostrador del negocio del socio: el dueño del
 * negocio ES el socio, y el QR lleva su slug para que cada pedido quede a su nombre.
 * El QR abre /{slug}/hablador, que cuenta el escaneo y lleva al catálogo
 * (src/app/[slug]/[destino]/page.tsx). Se imprime desde el navegador o se guarda
 * en PDF; `?sangrado=1` agrega los 3 mm de sangrado que pide la imprenta, y
 * `?variante=ganocafe` pone una caja de Ganocafé 3 en 1 junto a la taza (21 nov 2026), y
 * `?variante=ganocafe-grande`, la misma escena más grande, con el QR a la derecha de la
 * caja y encima de la taza y la bajada «Bebidas enriquecidas, suplementos y cuidado
 * personal.» (Director, 21 nov 2026). Esa es la aprobada: sale por defecto y es la única con
 * PDF de imprenta, /hablador/{slug}/pdf (src/lib/hablador-pdf.ts). El copy vive en ./pieza.ts.
 *
 * ⚠️ Lo que decidió el Director, y por qué:
 *   · VENDE PRODUCTOS, no el modelo de negocio: quien lo lee es el cliente del
 *     negocio, en frío y con la billetera en la mano. El modelo entra por dentro,
 *     con Queswa en el catálogo. Una sola acción: escanear.
 *   · SIN PRECIO: un precio impreso caduca y no se puede retirar del mostrador.
 *   · SIN DECLARACIÓN DE SALUD: el café se vende por lo sensorial y el ritual.
 *   · LA ETIQUETA ES LA REAL (public/productos/_set/limpios), nunca la que dibuja una
 *     IA. La escena de `?variante=ganocafe` se generó con Nano Banana y lleva encima
 *     la etiqueta real (scripts/hablador-reetiquetar-caja.py); el QR, nunca con IA.
 *   · ESTILO APPLE (Director, 20 nov 2026: el bodegón de siete productos «se ve muy
 *     mal como flyer»): UN solo protagonista —la taza humeante de la Presentación,
 *     foto real y sin marca—, mucho aire, el título grande en Inter apretado y la
 *     acción pequeña abajo. Los productos NO van en la pieza: se ven en el catálogo,
 *     a un escaneo. Sumarle objetos lo devuelve a volante.
 *   · CARBÓN, con el oro solo en la ceja. El QR va sobre blanco: sobre oscuro, un
 *     QR claro sigue leyéndose, y 27 mm se escanean a un brazo de distancia.
 * El copy es aprobado: no se cambia sin proponerlo antes en el chat.
 */

import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import QRCode from 'qrcode'
import { resolver } from '@/app/productos/socio'
import SinOrbe from '@/components/SinOrbe'
import BotonImprimir from './BotonImprimir'
import { CEJA, TITULO, BAJADA, PASOS } from './pieza'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Hablador de mostrador',
  robots: { index: false, follow: false },
}

// Las piezas. Los fondos los compone scripts/componer-fondo-hablador.mjs; la escena de
// Ganocafé tiene el negro puro y la taza sola, el carbón de su foto.
const VARIANTES: Record<string, { fondo: string; color: string; clase: string; bajada: string }> = {
  taza: {
    fondo: '/images/hablador/fondo-cafe-v1.jpg', color: '#06090A', clase: '',
    bajada: '22 productos: café, bebidas y cuidado personal.',
  },
  ganocafe: {
    fondo: '/images/hablador/fondo-cafe-ganocafe-v3.jpg', color: '#000000', clase: 'hab-pieza--escena',
    bajada: '22 productos: café, bebidas y cuidado personal.',
  },
  // El QR sale del eje y la escena crece a 88 mm (Director, 21 nov 2026).
  'ganocafe-grande': {
    fondo: '/images/hablador/fondo-cafe-ganocafe-grande-v1.jpg', color: '#000000', clase: 'hab-pieza--escena hab-pieza--qr-lateral',
    bajada: BAJADA,
  },
}
// La pieza aprobada (Director, 21 nov 2026): la que sale sin `?variante=` y la única
// que tiene PDF de imprenta (/hablador/{slug}/pdf). Las otras dos quedan para comparar.
const POR_DEFECTO = 'ganocafe-grande'

export default async function Hablador({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const r = await resolver(params.slug)
  if (!r?.slug) notFound()
  const sangrado = searchParams?.sangrado === '1'
  // `?vista=1`: solo la pieza, sin controles ni escritorio, para la vista previa que
  // queswa.app muestra en Compartir → Habladores (Director, 24 nov 2026).
  const vista = searchParams?.vista === '1'
  // ?pais=us: el hablador de Estados Unidos (27 nov 2026). Va con la taza sola —la
  // pieza del 20 nov 2026—, porque la caja de la escena aprobada es la de Colombia, y
  // su QR abre /{slug}/hablador-us, que cuenta el escaneo y lleva al catálogo de allá.
  const esUS = searchParams?.pais === 'us'
  const variante = esUS ? 'taza' : VARIANTES[String(searchParams?.variante)] ? String(searchParams?.variante) : POR_DEFECTO
  const v = esUS ? { ...VARIANTES.taza, bajada: BAJADA } : VARIANTES[variante]
  if (r.slug !== params.slug) {
    const consulta = new URLSearchParams()
    if (sangrado) consulta.set('sangrado', '1')
    if (esUS) consulta.set('pais', 'us')
    else if (variante !== POR_DEFECTO) consulta.set('variante', variante)
    const resto = consulta.toString()
    permanentRedirect(`/hablador/${r.slug}${resto ? `?${resto}` : ''}`)
  }

  const enlace = `creatuactivo.com/${r.slug}/${esUS ? 'hablador-us' : 'hablador'}`
  // El margen blanco del QR lo pone su recuadro (2,6 mm, más de 3 módulos), no la librería.
  const qr = await QRCode.toString(`https://${enlace}`, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 0,
    color: { dark: '#111111FF', light: '#FFFFFFFF' },
  })

  const sangre = sangrado ? 3 : 0
  const ancho = 100 + sangre * 2
  const alto = 150 + sangre * 2

  return (
    <main className={vista ? 'hab-escritorio hab-escritorio--vista' : 'hab-escritorio'}>
      <SinOrbe />
      {/* Sin escapar: como hijo de texto, React convierte el «>» del CSS en &gt; y el
          servidor y el navegador dejan de coincidir (error de hidratación). */}
      <style dangerouslySetInnerHTML={{ __html: estilos(ancho, alto, sangre, v.fondo, v.color) }} />

      {!vista && <div className="hab-controles">
        {variante === POR_DEFECTO || esUS ? (
          <>
            <a className="cta-primary" href={`/hablador/${r.slug}/pdf?descargar=1${esUS ? '&pais=us' : ''}`}>Descargar el PDF para la imprenta</a>
            <p>
              10 × 15 cm con 3 mm de sangrado, en CMYK y en alta resolución: se le envía a la
              imprenta tal cual.
            </p>
          </>
        ) : (
          <>
            <BotonImprimir />
            <p>
              10 × 15 cm{sangrado ? ' con 3 mm de sangrado' : ''}. En la ventana de impresión elija «Guardar como PDF»,
              márgenes «Ninguno» y active «Gráficos de fondo».
            </p>
          </>
        )}
      </div>}

      <section className={`hab-pieza ${v.clase}`} aria-label="Hablador">
        <div className="hab-contenido">
          <div className="hab-arriba">
            <p className="hab-ceja">{CEJA}</p>
            <p className="hab-titulo">{TITULO}</p>
            <p className="hab-bajada">{v.bajada}</p>
          </div>

          <div className="hab-abajo">
            <div className="hab-qr" dangerouslySetInnerHTML={{ __html: qr }} />
            <p className="hab-pasos">{PASOS}</p>
            <p className="hab-enlace">{enlace}</p>
          </div>
        </div>
      </section>
    </main>
  )
}

function estilos(ancho: number, alto: number, sangre: number, fondo: string, colorFondo: string) {
  return `
.hab-escritorio {
  min-height: 100vh; background: #2A2D33; padding: 24px 16px 48px;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  font-family: var(--font-sans);
}
/* La vista previa de queswa.app: la pieza sola, arriba a la izquierda. Lo demás del
   layout (aviso de cookies, orbe) se esconde como al imprimir; es fijo y no ocupa lugar. */
.hab-escritorio--vista { min-height: 0; padding: 0; background: transparent; display: block; }
.hab-escritorio--vista .hab-pieza { box-shadow: none; }
body:has(.hab-escritorio--vista) { background: transparent !important; }
body:has(.hab-escritorio--vista) * { visibility: hidden !important; }
body:has(.hab-escritorio--vista) .hab-pieza, body:has(.hab-escritorio--vista) .hab-pieza * { visibility: visible !important; }
.hab-controles { max-width: 34rem; text-align: center; color: #E5E5E5; }
.hab-controles p { font-size: 13px; line-height: 1.5; color: #94A3B8; margin: 10px 0 0; }

.hab-pieza {
  --h-fondo: ${colorFondo}; --h-titulo: #F5F5F7; --h-texto-2: #A1A1A6; --h-texto-3: #6E6E73; --h-oro: #C5A059;
  width: ${ancho}mm; height: ${alto}mm; padding: ${sangre}mm; box-sizing: border-box;
  /* La taza humeante de la Presentación, compuesta con su sangrado por
     scripts/componer-fondo-hablador.mjs (106 × 156 mm): centrada, la pieza sin
     sangrado la recorta sola. Es imagen y no máscara CSS porque el PDF de
     impresión dejaba una franja donde terminaba la foto. */
  background: var(--h-fondo) url(${fondo}) center / 106mm 156mm no-repeat;
  box-shadow: 0 12px 40px rgba(0,0,0,.45);
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.hab-contenido {
  width: 100mm; height: 150mm; box-sizing: border-box; padding: 13mm 9mm 8mm;
  display: flex; flex-direction: column; align-items: center; justify-content: space-between;
  text-align: center;
}
.hab-pieza--escena .hab-contenido { padding-top: 10mm; }  /* la escena necesita 3 mm más: ver componer-fondo-hablador.mjs */
/* QR lateral: en el hueco entre la tapa de la caja (51 mm) y el asa (87 mm), con el
   borde de arriba a la altura del frente de la caja; debajo asoma el vapor. */
.hab-pieza--qr-lateral .hab-contenido { position: relative; padding-bottom: 6mm; }
.hab-pieza--qr-lateral .hab-qr { position: absolute; left: 54.5mm; top: 50.4mm; width: 25mm; height: 25mm; padding: 2.5mm; }
.hab-arriba, .hab-abajo { display: flex; flex-direction: column; align-items: center; }
.hab-ceja { margin: 0; font-size: 8pt; font-weight: 600; letter-spacing: .01em; color: var(--h-oro); }
.hab-titulo {
  margin: 2.2mm 0 0; font-family: var(--font-sans); font-weight: 600;
  font-size: 24pt; line-height: 1.04; letter-spacing: -.03em; color: var(--h-titulo);
}
.hab-bajada { margin: 2.6mm 0 0; font-size: 8.6pt; line-height: 1.35; font-weight: 400; color: var(--h-texto-2); }

.hab-qr { width: 27mm; height: 27mm; padding: 2.6mm; background: #FFFFFF; border-radius: 2.6mm; }
.hab-qr svg { width: 100%; height: 100%; display: block; }
.hab-pasos { margin: 3.4mm 0 0; font-size: 7.6pt; font-weight: 500; color: var(--h-titulo); letter-spacing: .005em; }
.hab-enlace { margin: 1.2mm 0 0; font-size: 6pt; color: var(--h-texto-3); }

@page { size: ${ancho}mm ${alto}mm; margin: 0; }
@media print {
  html, body { background: ${colorFondo} !important; margin: 0 !important; padding: 0 !important; }
  body * { visibility: hidden !important; }
  .hab-pieza, .hab-pieza * { visibility: visible !important; }
  .hab-escritorio { padding: 0; background: none; min-height: 0; }
  .hab-controles { display: none; }
  .hab-pieza { position: fixed; left: 0; top: 0; box-shadow: none; }
}
`
}
