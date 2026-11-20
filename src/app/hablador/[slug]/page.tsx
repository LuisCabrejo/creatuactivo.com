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
 * en PDF; `?sangrado=1` agrega los 3 mm de sangrado que pide la imprenta.
 *
 * ⚠️ Lo que decidió el Director, y por qué:
 *   · VENDE PRODUCTOS, no el modelo de negocio: quien lo lee es el cliente del
 *     negocio, en frío y con la billetera en la mano. El modelo entra por dentro,
 *     con Queswa en el catálogo. Una sola acción: escanear.
 *   · SIN PRECIO: un precio impreso caduca y no se puede retirar del mostrador.
 *   · SIN DECLARACIÓN DE SALUD: el café se vende por lo sensorial y el ritual.
 *   · LAS FOTOS SON LAS REALES (public/productos/_set/limpios), nunca generadas por
 *     IA. Nano Banana sirve para fondos y montajes, nunca para el producto ni el QR.
 *   · CREMA Y ORO, la paleta de la tienda: el QR aterriza en el catálogo, que es
 *     crema, y la persona debe sentir que llegó al mismo lugar.
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

// El café al frente: es lo que se toma en un mostrador. Alto y angosto a los
// lados, el ancho en el centro.
const FOTOS = [
  { src: '/productos/_set/limpios/ganocafe-3-en-1.png', alt: 'Ganocafé 3 en 1' },
  { src: '/productos/_set/limpios/ganorico-latte-rico.png', alt: 'Ganorico Latte Rico' },
  { src: '/productos/_set/limpios/luvoco-medio.png', alt: 'Luvoco Medio' },
]

const PASOS = ['Escanee', 'Pregunte', 'Pida por WhatsApp']

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
  if (r.slug !== params.slug) permanentRedirect(`/hablador/${r.slug}${sangrado ? '?sangrado=1' : ''}`)

  const enlace = `creatuactivo.com/${r.slug}/hablador`
  // El margen blanco del QR lo pone la tarjeta (más de 4 módulos), no la librería.
  const qr = await QRCode.toString(`https://${enlace}`, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 0,
    color: { dark: '#2B211AFF', light: '#FFFFFFFF' },
  })

  const sangre = sangrado ? 3 : 0
  const ancho = 100 + sangre * 2
  const alto = 150 + sangre * 2

  return (
    <main className="hab-escritorio">
      <SinOrbe />
      <style>{estilos(ancho, alto, sangre)}</style>

      <div className="hab-controles">
        <BotonImprimir />
        <p>
          10 × 15 cm{sangrado ? ' con 3 mm de sangrado' : ''}. En la ventana de impresión elija «Guardar como PDF»,
          márgenes «Ninguno» y active «Gráficos de fondo».
        </p>
      </div>

      <section className="hab-pieza" aria-label="Hablador">
        <div className="hab-contenido">
          <p className="hab-ceja">Catálogo Gano Excel</p>
          <p className="hab-titulo">Un café para tomarse con calma.</p>
          <p className="hab-bajada">22 productos: café, bebidas y cuidado personal.</p>

          <div className="hab-fotos">
            {FOTOS.map((f) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={f.src} src={f.src} alt={f.alt} />
            ))}
          </div>

          <div className="hab-qr-tarjeta">
            <div className="hab-qr" dangerouslySetInnerHTML={{ __html: qr }} />
            <p className="hab-enlace">{enlace}</p>
          </div>

          <ol className="hab-pasos">
            {PASOS.map((p, i) => (
              <li key={p}>
                <span className="hab-num">{i + 1}</span>
                <span className="hab-paso">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  )
}

function estilos(ancho: number, alto: number, sangre: number) {
  return `
.hab-escritorio {
  min-height: 100vh; background: #2A2D33; padding: 24px 16px 48px;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  font-family: var(--font-sans);
}
.hab-controles { max-width: 34rem; text-align: center; color: #E5E5E5; }
.hab-controles p { font-size: 13px; line-height: 1.5; color: #94A3B8; margin: 10px 0 0; }

.hab-pieza {
  --h-fondo: #F7F2EA; --h-superficie: #FFFFFF; --h-tinta: #2B211A; --h-tinta-2: #6B5A4C;
  --h-linea: #E6DCCD; --h-oro: #C5A059; --h-oro-texto: #7A5C24;
  width: ${ancho}mm; height: ${alto}mm; padding: ${sangre}mm; box-sizing: border-box;
  background: var(--h-fondo); color: var(--h-tinta);
  box-shadow: 0 12px 40px rgba(0,0,0,.45);
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.hab-contenido {
  width: 100mm; height: 150mm; box-sizing: border-box; padding: 8mm 8mm 7.5mm;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  border-top: 1.6mm solid var(--h-oro);
}
.hab-ceja {
  margin: 0; font-size: 7.5pt; letter-spacing: .16em; text-transform: uppercase;
  font-weight: 600; color: var(--h-oro-texto);
}
.hab-titulo {
  margin: 3mm 0 0; font-family: var(--font-serif); font-weight: 700;
  font-size: 21pt; line-height: 1.08; letter-spacing: -.005em; color: var(--h-tinta);
  font-variant-numeric: lining-nums;
}
.hab-bajada { margin: 2.2mm 0 0; font-size: 8.8pt; line-height: 1.35; color: var(--h-tinta-2); }

.hab-fotos {
  margin-top: 4mm; height: 24mm; width: 100%;
  display: flex; align-items: flex-end; justify-content: center; gap: 2.5mm;
}
.hab-fotos img { height: 100%; width: auto; max-width: 40mm; object-fit: contain; filter: drop-shadow(0 1.2mm 1.2mm rgba(43,33,26,.22)); }
.hab-fotos img:nth-child(2) { height: 18.5mm; }

.hab-qr-tarjeta {
  margin-top: 4.5mm; background: var(--h-superficie); border: .3mm solid var(--h-linea);
  border-radius: 3.5mm; padding: 4mm 4mm 2.6mm;
}
.hab-qr { width: 38mm; height: 38mm; }
.hab-qr svg { width: 100%; height: 100%; display: block; }
.hab-enlace { margin: 2.4mm 0 0; font-family: var(--font-mono); font-size: 6.6pt; color: var(--h-tinta-2); letter-spacing: .01em; }

.hab-pasos {
  list-style: none; padding: 0; margin: auto 0 0; width: 100%;
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2mm; padding-top: 4mm;
}
.hab-pasos li { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 1.2mm; }
.hab-num {
  width: 6mm; height: 6mm; border-radius: 999px; border: .35mm solid var(--h-oro);
  color: var(--h-oro-texto); font-size: 8pt; font-weight: 700;
  display: flex; align-items: center; justify-content: center; font-variant-numeric: lining-nums;
}
.hab-paso { font-size: 8.4pt; line-height: 1.2; font-weight: 600; color: var(--h-tinta); }

@page { size: ${ancho}mm ${alto}mm; margin: 0; }
@media print {
  html, body { background: #F7F2EA !important; margin: 0 !important; padding: 0 !important; }
  body * { visibility: hidden !important; }
  .hab-pieza, .hab-pieza * { visibility: visible !important; }
  .hab-escritorio { padding: 0; background: none; min-height: 0; }
  .hab-controles { display: none; }
  .hab-pieza { position: fixed; left: 0; top: 0; box-shadow: none; }
}
`
}
