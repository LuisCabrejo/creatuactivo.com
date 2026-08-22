/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Compone las imágenes de FAMILIA que Queswa envía por WhatsApp: una por
 * categoría del portafolio (Bebidas · Suplementos · Cuidado Personal · Luvoco)
 * y una con los 22 productos juntos. Hermana de `componer-imagenes-producto.mjs`
 * —misma placa, mismo título, misma marca de agua, mismo 1080×1080— para que en
 * el chat se lean como una sola serie.
 *
 * POR QUÉ EXISTEN: cuando la persona acepta «¿le muestro las demás bebidas de
 * la línea?», hasta ahora recibía una tabla de texto. Una sola foto con la
 * familia completa le dice en un vistazo cuántos son y cómo se ven, y la tabla
 * pasa a ser el pie (nombres y precios, que sí cambian y por eso no van dentro
 * de la imagen).
 *
 * CÓMO SE ACOMODAN: los productos se apoyan en la mesa de la placa en una o
 * varias filas con profundidad — la fila de atrás más alta en el cuadro y más
 * pequeña, como en una mesa real—, y solo la fila delantera lleva reflejo (el
 * de las otras quedaría tapado). Dentro de una fila se reparten sobre el ancho
 * útil y pueden solaparse un poco, como en una foto de familia de producto; el
 * orden de pintado va de los bordes al centro para que el del medio quede
 * siempre entero.
 *
 * TAMAÑOS PROPORCIONALES: dentro de una misma imagen los productos guardan su
 * proporción real entre sí — la máquina Luvoco es grande, el frasco de cápsulas
 * es pequeño—, con una sola escala por familia. La referencia de proporciones
 * es `public/productos/productos.webp` (la lámina oficial con los 22 sobre
 * estantes); `ALTO_REAL` guarda la altura de cada uno medida ahí. Y van
 * juntos, con una separación fija pequeña, no repartidos para llenar el ancho.
 *
 * PNG LIMPIOS: los PNG oficiales traen hongos y frutas decorando la caja; en
 * una foto de familia eso es ruido. Si existe `public/productos/_set/limpios/
 * {slug}.png`, se usa ese en lugar del oficial — ahí van las versiones sin
 * decoración, cuando las haya. Las individuales no cambian.
 *
 * ⚠️ LA IMAGEN NO LLEVA PRECIO NI PROMESA — solo el nombre de la categoría y
 * cuántos productos son. Misma regla que las individuales.
 *
 * node scripts/componer-imagenes-categoria.mjs
 */
import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const PLACA = join(RAIZ, 'public/productos/_set/placa-1080.png');
const DESTINO = join(RAIZ, 'public/productos/compuestas');
const LIMPIOS = join(RAIZ, 'public/productos/_set/limpios');

const W = 1080;
const MESA = 735;  // línea de la mesa en la placa (misma que en las individuales)

/** Catálogo desde wa-productos.ts — la ruta de la imagen trae la categoría. */
function leerCatalogo() {
  const src = readFileSync(join(RAIZ, 'src/lib/wa-productos.ts'), 'utf8');
  const re = /slug: '([^']+)',\s*\n\s*nombre: '((?:[^'\\]|\\.)+)',[\s\S]*?imagen: '([^']+)',/g;
  const out = [];
  let m;
  while ((m = re.exec(src))) {
    const imagen = m[3];
    const categoria = imagen.split('/')[2]; // /productos/{categoria}/archivo.png
    out.push({ slug: m[1], nombre: m[2].replace(/\\'/g, "'"), imagen, categoria });
  }
  return out;
}

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * La imagen individual de la máquina (`maquina-luvoco` en wa-productos.ts) es la
 * máquina sola: con las cajas al lado la persona entendía que venían incluidas.
 * El PNG oficial del SISTEMA —máquina, taza, cápsulas y las tres cajas— es el
 * que mejor cuenta la categoría entera, y vive aquí como pseudo-producto.
 */
const LUVOCO_SISTEMA = { slug: 'luvoco-sistema', imagen: '/productos/luvoco/maquina-luvoco-gano-excel-min.png' };

/**
 * Altura de cada producto en la lámina oficial `productos.webp` (px sobre 2000).
 * Es la proporción entre productos, no un tamaño absoluto: cada familia la
 * multiplica por su `escala`.
 */
const ALTO_REAL = {
  'ganocafe-3-en-1': 350, 'ganocafe-clasico': 161, 'ganorico-latte-rico': 180, 'ganorico-mocha-rico': 180,
  'ganorico-shoko-rico': 180, 'espirulina-gano-creal': 200, 'bebida-oleaf-gano-rooibos': 170,
  'gano-schokoladde': 181, 'bebida-colageno-reskine': 357,
  'capsulas-ganoderma': 165, 'capsulas-excellium': 165, 'capsulas-cordygold': 165,
  'pasta-dientes-gano-fresh': 90, 'jabon-gano': 150, 'jabon-transparente-gano': 185,
  'champu-piel-brillo': 330, 'acondicionador-piel-brillo': 330, 'exfoliante-piel-brillo': 330,
  'maquina-luvoco': 440, 'luvoco-suave': 346, 'luvoco-medio': 346, 'luvoco-fuerte': 346,
  'luvoco-sistema': 440,
};

/**
 * Cada familia: título, subtítulo y las filas. Una fila es una lista de slugs
 * (de izquierda a derecha), su altura máxima de producto y cuánto sube su base
 * respecto a la mesa (profundidad). La última fila de la lista es la delantera.
 */
function familias(cat) {
  const de = (c) => cat.filter((p) => p.categoria === c).map((p) => p.slug);
  return [
    {
      slug: 'categoria-bebidas',
      titulo: 'Bebidas',
      escala: 0.68,
      // Dos filas: atrás las altas y las anchas que caben; adelante las cajas
      // bajas, que dejan ver la marca de las de atrás.
      filas: [
        { slugs: ['ganocafe-clasico', 'bebida-colageno-reskine', 'ganocafe-3-en-1', 'gano-schokoladde'], sube: 120 },
        { slugs: ['bebida-oleaf-gano-rooibos', 'ganorico-shoko-rico', 'ganorico-mocha-rico', 'ganorico-latte-rico', 'espirulina-gano-creal'], sube: 0 },
      ],
    },
    {
      slug: 'categoria-suplementos',
      titulo: 'Suplementos',
      escala: 2.6,
      filas: [{ slugs: de('suplementos'), sube: 0, gap: 44 }],
    },
    {
      slug: 'categoria-cuidado-personal',
      titulo: 'Cuidado Personal',
      escala: 0.9,
      filas: [{ slugs: ['champu-piel-brillo', 'acondicionador-piel-brillo', 'exfoliante-piel-brillo', 'jabon-transparente-gano', 'pasta-dientes-gano-fresh', 'jabon-gano'], sube: 0 }],
    },
    {
      slug: 'categoria-luvoco',
      titulo: 'Luvoco',
      subtitulo: '4 productos',
      escala: 1.3,
      filas: [{ slugs: ['luvoco-sistema'], sube: 0 }],
    },
    {
      slug: 'portafolio',
      titulo: 'Portafolio Gano Excel',
      subtitulo: '22 productos · cuatro categorías',
      escala: 0.40,
      // Reproduce la lámina oficial `productos.webp`: tres estantes con el
      // mismo orden de productos, sobre nuestra placa. Los dos estantes altos
      // se dibujan como repisas; el tercero es la mesa de la placa.
      filas: [
        { slugs: ['capsulas-excellium', 'capsulas-cordygold', 'capsulas-ganoderma', 'bebida-oleaf-gano-rooibos', 'bebida-colageno-reskine', 'espirulina-gano-creal', 'gano-schokoladde'], base: 392, estante: true, gap: 18,
          apilados: [{ slug: 'ganocafe-clasico', sobre: 'espirulina-gano-creal' }] },
        { slugs: ['maquina-luvoco', 'luvoco-medio', 'luvoco-fuerte', 'luvoco-suave', 'ganocafe-3-en-1', 'ganorico-shoko-rico', 'ganorico-mocha-rico', 'ganorico-latte-rico'], base: 585, estante: true, gap: 16 },
        { slugs: ['champu-piel-brillo', 'exfoliante-piel-brillo', 'acondicionador-piel-brillo', 'jabon-transparente-gano', 'pasta-dientes-gano-fresh', 'jabon-gano'], sube: 0, gap: 22 },
      ],
    },
  ].map((f) => ({
    ...f,
    filas: f.filas.map((r) => ({
      ...r,
      slugs: r.slugs.map((slug) => ({ slug, alto: Math.round(ALTO_REAL[slug] * f.escala) })),
      apilados: (r.apilados ?? []).map((a) => ({ ...a, alto: Math.round(ALTO_REAL[a.slug] * f.escala) })),
    })),
    subtitulo: f.subtitulo ?? `${f.filas.reduce((n, r) => n + r.slugs.length, 0)} productos`,
  }));
}

async function cargar(p, alto, ancho = 600) {
  const limpio = join(LIMPIOS, `${p.slug}.png`);
  const origen = existsSync(limpio) ? limpio : join(RAIZ, 'public', p.imagen);
  const buf = await sharp(origen).trim().resize({ width: ancho, height: alto, fit: 'inside' }).png().toBuffer();
  const { width, height } = await sharp(buf).metadata();
  return { buf, width, height };
}

async function reflejoDe(img, tope) {
  const grad = Buffer.from(
    `<svg width="${img.width}" height="${img.height}" xmlns="http://www.w3.org/2000/svg"><defs>`
    + '<linearGradient id="f" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0%" stop-color="#fff" stop-opacity="0.28"/>'
    + '<stop offset="35%" stop-color="#fff" stop-opacity="0.03"/>'
    + '<stop offset="100%" stop-color="#fff" stop-opacity="0"/>'
    + `</linearGradient></defs><rect width="${img.width}" height="${img.height}" fill="url(#f)"/></svg>`);
  const completo = await sharp(img.buf).flip().composite([{ input: grad, blend: 'dest-in' }]).png().toBuffer();
  const alto = Math.min(img.height, tope);
  return sharp(completo).extract({ left: 0, top: 0, width: img.width, height: alto }).png().toBuffer();
}

/** Orden de pintado de una fila: de los bordes hacia el centro. */
function ordenCentro(n) {
  const idx = [...Array(n).keys()];
  const centro = (n - 1) / 2;
  return idx.sort((a, b) => Math.abs(b - centro) - Math.abs(a - centro));
}

async function componer(fam, porSlug) {
  const capas = [];
  const ultima = fam.filas.length - 1;

  for (let r = 0; r < fam.filas.length; r++) {
    const fila = fam.filas[r];
    const base = fila.base ?? MESA - fila.sube;
    const imgs = await Promise.all(fila.slugs.map((x) => cargar(porSlug[x.slug], x.alto, fila.ancho)));
    console.log(`    ${fam.slug} fila ${r + 1}: ancho total ${imgs.reduce((a, i) => a + i.width, 0)} sobre ${(fila.hasta ?? W - 60) - (fila.desde ?? 60)}`);
    const desde = fila.desde ?? 60;
    const hasta = fila.hasta ?? W - 60;
    const n = imgs.length;
    // Juntos: separación fija pequeña y el grupo centrado. Si aun así no caben,
    // la separación se vuelve negativa y se solapan un poco, como en una foto
    // de familia.
    const total = imgs.reduce((a, i) => a + i.width, 0);
    const gap = n > 1 ? Math.min(fila.gap ?? 16, (hasta - desde - total) / (n - 1)) : 0;
    let cursor = desde + (hasta - desde - (total + gap * (n - 1))) / 2;
    const centros = imgs.map((img) => { const c = cursor + img.width / 2; cursor += img.width + gap; return c; });

    const pos = imgs.map((img, i) => ({ img, x: Math.round(centros[i] - img.width / 2), y: base - img.height }));
    const orden = ordenCentro(n);
    // Repisa: una tabla oscura con canto apenas iluminado, del ancho del grupo
    // más un margen, apoyada justo bajo la fila.
    if (fila.estante) {
      const x0 = 96, x1 = W - 96; // mismo ancho para todas las repisas
      const repisa = Buffer.from(
        `<svg width="${W}" height="1080" xmlns="http://www.w3.org/2000/svg"><defs>`
        + '<linearGradient id="r" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a2a2e"/><stop offset="100%" stop-color="#0c0c0e"/></linearGradient>'
        + '<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#000" stop-opacity="0.55"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></linearGradient></defs>'
        + `<rect x="${x0}" y="${base}" width="${x1 - x0}" height="16" fill="url(#r)"/>`
        + `<rect x="${x0}" y="${base}" width="${x1 - x0}" height="1.5" fill="#C5A059" fill-opacity="0.45"/>`
        + `<rect x="${x0 + 6}" y="${base + 16}" width="${x1 - x0 - 12}" height="26" fill="url(#s)"/>`
        + '</svg>');
      capas.push({ input: repisa, left: 0, top: 0 });
    }
    // Apilados: un producto encima de otro de la misma fila (la lámina oficial
    // pone el Ganocafé Clásico sobre el Gano C'Real).
    for (const a of fila.apilados ?? []) {
      const i = fila.slugs.findIndex((x) => x.slug === a.sobre);
      const img = await cargar(porSlug[a.slug], a.alto);
      const cx = pos[i].x + pos[i].img.width / 2;
      pos.push({ img, x: Math.round(cx - img.width / 2), y: pos[i].y - img.height });
      orden.push(pos.length - 1);
    }
    if (r === ultima) {
      for (const i of orden) {
        const tope = 1080 - base - 2;
        if (i >= n) continue;
        capas.push({ input: await reflejoDe(pos[i].img, tope), left: pos[i].x, top: base + 2 });
      }
    }
    for (const i of orden) capas.push({ input: pos[i].img.buf, left: pos[i].x, top: pos[i].y });
  }

  const tam = fam.titulo.length > 18 ? 54 : 66;
  const titulo = Buffer.from(
    `<svg width="${W}" height="1080" xmlns="http://www.w3.org/2000/svg">`
    + `<text x="${W / 2}" y="140" text-anchor="middle" font-family="Playfair Display, Georgia, serif" `
    + `font-size="${tam}" fill="#C5A059" letter-spacing="1">${xml(fam.titulo)}</text>`
    + `<line x1="${W / 2 - 60}" y1="172" x2="${W / 2 + 60}" y2="172" stroke="#C5A059" stroke-width="2" opacity="0.55"/>`
    + `<text x="${W / 2}" y="212" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="22" `
    + `letter-spacing="3" fill="#94A3B8" fill-opacity="0.85">${xml(fam.subtitulo.toUpperCase())}</text>`
    + '</svg>');

  const isotipo = await sharp(join(RAIZ, 'public/images/logotipo.png'))
    .resize({ height: 46, fit: 'inside' })
    .composite([{
      input: Buffer.from('<svg width="46" height="46"><rect width="46" height="46" fill="#fff" fill-opacity="0.62"/></svg>'),
      blend: 'dest-in',
    }]).png().toBuffer();
  const { width: iw } = await sharp(isotipo).metadata();
  const firma = Buffer.from(
    `<svg width="${W}" height="1080" xmlns="http://www.w3.org/2000/svg">`
    + `<text x="${72 + iw + 14}" y="1017" font-family="Helvetica, Arial, sans-serif" font-size="21" `
    + 'font-weight="600" letter-spacing="2.6" fill="#C5A059" fill-opacity="0.72">CREATUACTIVO.COM</text>'
    + `<text x="${W - 72}" y="1017" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="19" `
    + 'letter-spacing="2.2" fill="#94A3B8" fill-opacity="0.62">QUESWA.APP AI</text>'
    + '</svg>');

  await sharp(PLACA)
    .composite([...capas, { input: titulo, left: 0, top: 0 }, { input: isotipo, left: 72, top: 976 }, { input: firma, left: 0, top: 0 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(join(DESTINO, `${fam.slug}.jpg`));
}

mkdirSync(DESTINO, { recursive: true });
const catalogo = leerCatalogo();
const de = (c) => catalogo.filter((p) => p.categoria === c).map((p) => p.slug);
const porSlug = { ...Object.fromEntries(catalogo.map((p) => [p.slug, p])), [LUVOCO_SISTEMA.slug]: LUVOCO_SISTEMA };
const fams = familias(catalogo);
// Cada producto del catálogo debe estar en su familia y en el portafolio.
for (const f of fams) {
  const esperados = f.slug === 'portafolio' ? catalogo : catalogo.filter((p) => `categoria-${p.categoria}` === f.slug);
  // El sistema Luvoco representa a los cuatro productos de su categoría.
  const enFila = new Set(f.filas.flatMap((r) => [...r.slugs, ...(r.apilados ?? [])].flatMap((x) => (x.slug === 'luvoco-sistema' ? de('luvoco') : [x.slug]))));
  const faltan = esperados.filter((p) => !enFila.has(p.slug)).map((p) => p.slug);
  const sobran = [...enFila].filter((s) => !porSlug[s]);
  if (faltan.length || sobran.length) {
    console.error(`✗ ${f.slug}: faltan ${JSON.stringify(faltan)} · desconocidos ${JSON.stringify(sobran)}`);
    process.exit(1);
  }
}
console.log(`🎨 Componiendo ${fams.length} imágenes de familia…\n`);
let ok = 0;
for (const f of fams) {
  try {
    await componer(f, porSlug);
    ok++;
    console.log(`  ✓ ${f.slug}.jpg  ${f.titulo} — ${f.subtitulo}`);
  } catch (err) {
    console.error(`  ✗ ${f.slug}: ${err.message}`);
  }
}
console.log(`\n${ok}/${fams.length} en public/productos/compuestas/`);
process.exit(ok === fams.length ? 0 : 1);
