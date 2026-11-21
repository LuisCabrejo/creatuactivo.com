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
 * `?variante=ganocafe` pone una caja de Ganocafé 3 en 1 junto a la taza (21 nov 2026).
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

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Hablador de mostrador',
  robots: { index: false, follow: false },
}

// Los tres pasos aprobados, en una sola línea discreta bajo el QR.
const PASOS = 'Escanee · Pregunte · Pida por WhatsApp'

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
  const conGanocafe = searchParams?.variante === 'ganocafe'
  if (r.slug !== params.slug) {
    const consulta = new URLSearchParams()
    if (sangrado) consulta.set('sangrado', '1')
    if (conGanocafe) consulta.set('variante', 'ganocafe')
    const resto = consulta.toString()
    permanentRedirect(`/hablador/${r.slug}${resto ? `?${resto}` : ''}`)
  }
  // Los fondos los compone scripts/componer-fondo-hablador.mjs.
  const fondo = conGanocafe ? '/images/hablador/fondo-cafe-ganocafe-v3.jpg' : '/images/hablador/fondo-cafe-v1.jpg'
  // La escena de Ganocafé tiene el negro puro; la taza sola, el carbón de su foto.
  const colorFondo = conGanocafe ? '#000000' : '#06090A'

  const enlace = `creatuactivo.com/${r.slug}/hablador`
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
    <main className="hab-escritorio">
      <SinOrbe />
      {/* Sin escapar: como hijo de texto, React convierte el «>» del CSS en &gt; y el
          servidor y el navegador dejan de coincidir (error de hidratación). */}
      <style dangerouslySetInnerHTML={{ __html: estilos(ancho, alto, sangre, fondo, colorFondo) }} />

      <div className="hab-controles">
        <BotonImprimir />
        <p>
          10 × 15 cm{sangrado ? ' con 3 mm de sangrado' : ''}. En la ventana de impresión elija «Guardar como PDF»,
          márgenes «Ninguno» y active «Gráficos de fondo».
        </p>
      </div>

      <section className={`hab-pieza${conGanocafe ? ' hab-pieza--escena' : ''}`} aria-label="Hablador">
        <div className="hab-contenido">
          <div className="hab-arriba">
            <p className="hab-ceja">Catálogo Gano Excel</p>
            <p className="hab-titulo">Un café para tomarse con calma.</p>
            <p className="hab-bajada">22 productos: café, bebidas y cuidado personal.</p>
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
