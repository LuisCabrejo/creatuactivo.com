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
 *   · CARBÓN Y ORO, con la taza humeante de la Presentación de fondo (Director,
 *     20 nov 2026: «la imagen se ve muy plana»). La primera versión iba en el crema
 *     del catálogo; la foto es oscura, y la pieza pasó a la paleta madre. El QR va
 *     en una tarjeta blanca: sobre oscuro, un QR claro sigue leyéndose.
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

// El bodegón (Director, 20 nov 2026): la taza humeante detrás y los productos
// juntos, montados unos sobre otros, en lugar de una fila de piezas sueltas. Los
// tres frascos de Piel&Brillo van DETRÁS de la caja de Gano Fresh. Medidas en mm
// dentro de la escena (84 × 50): `x` es el borde izquierdo, `abajo` la base y `z`
// quién tapa a quién. Cada foto lleva su alto porque las formas no se parecen: la
// caja de Gano Fresh es casi cuatro veces más ancha que alta.
const FOTOS = [
  { src: '/productos/_set/limpios/champu-piel-brillo.png', alt: 'Champú Piel&Brillo', alto: 30, x: 50, abajo: 6, z: 1 },
  { src: '/productos/_set/limpios/acondicionador-piel-brillo.png', alt: 'Acondicionador Piel&Brillo', alto: 31, x: 57.5, abajo: 5, z: 1 },
  { src: '/productos/_set/limpios/exfoliante-piel-brillo.png', alt: 'Exfoliante Piel&Brillo', alto: 30, x: 65, abajo: 6, z: 1 },
  { src: '/productos/_set/limpios/ganocafe-3-en-1.png', alt: 'Ganocafé 3 en 1', alto: 33, x: 4, abajo: 0, z: 2 },
  { src: '/productos/_set/limpios/capsulas-ganoderma.png', alt: 'Cápsulas de Ganoderma', alto: 20, x: 17, abajo: 0, z: 3 },
  { src: '/productos/_set/limpios/pasta-dientes-gano-fresh.png', alt: 'Gano Fresh', alto: 10.5, x: 41, abajo: 0, z: 3 },
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
      {/* Sin escapar: como hijo de texto, React convierte el «>» del CSS en &gt; y el
          servidor y el navegador dejan de coincidir (error de hidratación). */}
      <style dangerouslySetInnerHTML={{ __html: estilos(ancho, alto, sangre) }} />

      <div className="hab-controles">
        <BotonImprimir />
        <p>
          10 × 15 cm{sangrado ? ' con 3 mm de sangrado' : ''}. En la ventana de impresión elija «Guardar como PDF»,
          márgenes «Ninguno» y active «Gráficos de fondo».
        </p>
      </div>

      <section className="hab-pieza" aria-label="Hablador">
        <div className="hab-contenido">
          {/* La taza humeante de la Presentación: una foto real, sin marca. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hab-fondo" src="/images/servilleta/producto-cafe.webp" alt="" aria-hidden="true" />
          <p className="hab-ceja">Catálogo Gano Excel</p>
          <p className="hab-titulo">Un café para tomarse con calma.</p>
          <p className="hab-bajada">22 productos: café, bebidas y cuidado personal.</p>

          <div className="hab-escena">
            {FOTOS.map((f) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={f.src}
                src={f.src}
                alt={f.alt}
                style={{ height: `${f.alto}mm`, left: `${f.x}mm`, bottom: `${f.abajo}mm`, zIndex: f.z }}
              />
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
  --h-fondo: #0C0D0B; --h-superficie: #FFFFFF; --h-titulo: #FFFFFF; --h-texto: #E5E5E5;
  --h-texto-2: #B8B2A7; --h-tinta-qr: #2B211A; --h-linea: #E6DCCD; --h-oro: #C5A059;
  width: ${ancho}mm; height: ${alto}mm; padding: ${sangre}mm; box-sizing: border-box;
  background: var(--h-fondo); color: var(--h-texto);
  box-shadow: 0 12px 40px rgba(0,0,0,.45);
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.hab-contenido {
  position: relative; overflow: hidden;
  width: 100mm; height: 150mm; box-sizing: border-box; padding: 7mm 8mm 6mm;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  border-top: 1.6mm solid var(--h-oro);
}
.hab-contenido > :not(.hab-fondo) { position: relative; z-index: 1; }
/* La taza queda detrás del grupo de productos y el vapor sube detrás del título.
   La foto mide 1080 × 1935; a 82 mm de ancho, la taza ocupa de 27 a 61 mm en x
   y su base cae en 120 mm de la foto: con top -37 mm, apoya en la base de la escena. */
.hab-fondo {
  position: absolute; z-index: 0; left: 9mm; top: -33mm; width: 82mm; height: auto;
  -webkit-mask-image: radial-gradient(ellipse 50% 46% at 50% 56%, #000 62%, transparent 100%);
  mask-image: radial-gradient(ellipse 50% 46% at 50% 56%, #000 62%, transparent 100%);
}
.hab-ceja {
  margin: 0; font-size: 7.5pt; letter-spacing: .16em; text-transform: uppercase;
  font-weight: 600; color: var(--h-oro);
}
.hab-titulo {
  margin: 2.6mm 0 0; font-family: var(--font-serif); font-weight: 700;
  font-size: 21pt; line-height: 1.08; letter-spacing: -.005em; color: var(--h-titulo);
  font-variant-numeric: lining-nums; text-shadow: 0 .6mm 2.4mm rgba(0,0,0,.6);
}
.hab-bajada { margin: 2mm 0 0; font-size: 8.8pt; line-height: 1.35; color: var(--h-texto-2); }

.hab-escena { flex: none; margin-top: 0; width: 84mm; height: 50mm; }
.hab-escena img {
  position: absolute; width: auto; object-fit: contain;
  filter: drop-shadow(0 1.4mm 1.6mm rgba(0,0,0,.65));
}

.hab-qr-tarjeta {
  margin-top: 3mm; background: var(--h-superficie); border-radius: 3.5mm; padding: 3.5mm 3.5mm 2.4mm;
  display: flex; flex-direction: column; align-items: center;
  box-shadow: 0 1mm 4mm rgba(0,0,0,.5);
}
.hab-qr { width: 35mm; height: 35mm; }
.hab-qr svg { width: 100%; height: 100%; display: block; }
.hab-enlace { margin: 2mm 0 0; font-family: var(--font-mono); font-size: 6.4pt; color: #6B5A4C; letter-spacing: .01em; }

.hab-pasos {
  list-style: none; padding: 0; margin: auto 0 0; width: 100%;
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2mm;
}
.hab-pasos li { display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 1.6mm; text-align: left; }
.hab-num {
  flex: none; width: 5.2mm; height: 5.2mm; border-radius: 999px; border: .35mm solid var(--h-oro);
  color: var(--h-oro); font-size: 7.5pt; font-weight: 700;
  display: flex; align-items: center; justify-content: center; font-variant-numeric: lining-nums;
}
.hab-paso { font-size: 8pt; line-height: 1.15; font-weight: 600; color: var(--h-texto); }

@page { size: ${ancho}mm ${alto}mm; margin: 0; }
@media print {
  html, body { background: #0C0D0B !important; margin: 0 !important; padding: 0 !important; }
  body * { visibility: hidden !important; }
  .hab-pieza, .hab-pieza * { visibility: visible !important; }
  .hab-escritorio { padding: 0; background: none; min-height: 0; }
  .hab-controles { display: none; }
  .hab-pieza { position: fixed; left: 0; top: 0; box-shadow: none; }
}
`
}
