/**
 * Copyright © 2026 CreaTuActivo.com
 * Las fuentes de marca para las tarjetas Open Graph.
 *
 * Por qué existe (11 sep 2026): las tarjetas declaraban `fontFamily: 'Georgia, serif'`
 * —Georgia NO es fuente de marca y NO está cargada en layout.tsx—, o no declaraban
 * nada, así que el runtime de `next/og` caía en la sans que trae empaquetada satori.
 * Es la regla de hierro de BRANDING.md §2: «NUNCA fontFamily con fuente no cargada».
 *
 * Cuál corresponde: el titular de una tarjeta es el H1 de su página, y estas páginas
 * son **H1 institucional** en la tabla de BRANDING.md §2 → `var(--font-sans)` =
 * **Inter**. Playfair es para H1 editorial (/blog/*) y H2 narrativos; no aplica aquí.
 *
 * ⚠️ La sans por defecto de satori trae UN solo peso, así que hasta hoy un
 * `fontWeight: 900` se veía igual que un 400 — las cifras grandes de /fundadores y
 * /12-niveles estaban declaradas en negra y salían delgadas. Con Inter cargado
 * empiezan a pesar de verdad. Por eso `negra` es opcional: solo la pide la tarjeta
 * que tiene una cifra en 800/900, y las demás no cargan 320 KB de más.
 *
 * ⚠️ `next/og` (satori) NO lee woff2 — solo ttf/otf/woff. Por eso los .ttf viven en
 * public/fonts/ y se resuelven con import.meta.url, el mismo patrón del logotipo.
 * Se descargan de Google Fonts, la misma familia que next/font sirve en el sitio.
 */

type FuenteOG = {
  name: string
  data: ArrayBuffer
  weight: 400 | 700 | 900
  style: 'normal'
}

export async function fuentesInter(opciones?: { negra?: boolean }): Promise<FuenteOG[]> {
  const [regular, bold] = await Promise.all([
    fetch(new URL('../../public/fonts/Inter-Regular.ttf', import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL('../../public/fonts/Inter-Bold.ttf', import.meta.url)).then((r) => r.arrayBuffer()),
  ])

  const fuentes: FuenteOG[] = [
    { name: 'Inter', data: regular, weight: 400, style: 'normal' },
    { name: 'Inter', data: bold, weight: 700, style: 'normal' },
  ]

  if (opciones?.negra) {
    const black = await fetch(
      new URL('../../public/fonts/Inter-Black.ttf', import.meta.url)
    ).then((r) => r.arrayBuffer())
    fuentes.push({ name: 'Inter', data: black, weight: 900, style: 'normal' })
  }

  return fuentes
}
