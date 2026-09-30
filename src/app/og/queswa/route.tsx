/**
 * Copyright © 2026 CreaTuActivo.com
 * Tarjeta (Open Graph) del enlace de Queswa — creatuactivo.com/{slug}/queswa
 *
 * Es lo primero que ve un contacto cuando un socio le pega ese enlace en
 * WhatsApp, y la usan también /acceso y los enlaces de los videos (/como-funciona,
 * /estrategia, /como-entra-el-dinero, /que-debo-hacer-yo).
 *
 * 30 sep 2026 — LA MISMA IMAGEN DE LA PRESENTACIÓN (Director): los pares de la
 * modernización (domicilios → Rappi, taxis → Uber, la fila del banco → Nequi),
 * con el rótulo «CreaTuActivo · Queswa». Para quien todavía no sabe nada, marcas
 * que ya usa se entienden mejor que una promesa en abstracto, y es lo que al
 * Director le funciona en campo. Vive en src/lib/og-modernizacion.tsx.
 * ⚠️ Desde ese día esta tarjeta YA NO va en sincronía con el titular de la Home
 * («Sea dueño de un sistema de distribución que no depende de que usted esté
 * encima», que fue su imagen del 11 al 30 sep). Fue a propósito: no la
 * «resincronice». El título y la descripción viven en OG_QUESWA de
 * [slug]/[destino]/page.tsx.
 *
 * Vive como route handler y no como opengraph-image.tsx dentro de [slug]/[destino]
 * porque ese archivo aplicaría a TODOS los destinos (reels, manifiesto…).
 */

import { tarjetaModernizacion } from '@/lib/og-modernizacion'

export const runtime = 'edge'

export async function GET() {
  return tarjetaModernizacion('CreaTuActivo · Queswa', {
    headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' },
  })
}
