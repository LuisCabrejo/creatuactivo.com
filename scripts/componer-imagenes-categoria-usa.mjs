/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Las imágenes de las líneas del producto para ESTADOS UNIDOS (Director, 26 nov
 * 2026: «toma las imágenes de Estados Unidos»), para las fichas de la Presentación
 * en /servilleta/estados-unidos. Hermana de `componer-imagenes-categoria.mjs`:
 * misma placa, mismo título, misma firma, 1080×1080, para que se lean como la
 * misma serie que las de Colombia.
 *
 * LAS FOTOS son las oficiales de cada producto en ganoexcel.us (la imagen de su
 * página, og:image), bajadas el 26 nov 2026, recortadas y reducidas a 640 px en
 * `public/productos/usa/{slug}.png`. Foto real del producto, nunca generada.
 *
 * LAS LÍNEAS: las mismas tres de Colombia sin Luvoco, que allá no existe.
 * Bebidas (10, con el colágeno Reskine, como en Colombia) · Suplementos (4, con
 * Gano Plus, que es en cápsulas) · Cuidado Personal (3). Los 17 productos de la
 * lista 2026 de Gano Excel USA (knowledge_base/paises/USA_2026.md §2).
 *
 * TAMAÑOS: las fotos de allá traen granos, flores o el hongo al pie de la caja,
 * así que la proporción entre productos se ajusta a ojo por familia (`alto`), no
 * con la lámina oficial como en Colombia.
 *
 * ⚠️ LA IMAGEN NO LLEVA PRECIO NI PROMESA: solo el nombre de la línea y cuántos
 * productos son. Una imagen que cambia lleva nombre nuevo (el service worker la
 * sirve cache-first): de ahí el `-v1`.
 *
 * node scripts/componer-imagenes-categoria-usa.mjs
 */
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const PLACA = join(RAIZ, 'public/productos/_set/placa-1080.png');
const ORIGEN = join(RAIZ, 'public/productos/usa');
const DESTINO = join(RAIZ, 'public/productos/compuestas/usa');
const VERSION = 'v1';

const W = 1080;
const MESA = 735; // línea de la mesa en la placa (la misma de Colombia)

/** Cada familia: filas de atrás hacia adelante; cada producto con su alto en px. */
const FAMILIAS = [
  {
    slug: 'categoria-bebidas',
    titulo: 'Bebidas',
    filas: [
      { sube: 165, gap: -6, productos: [['classic', 245], ['tongkat-ali', 210], ['3-in-1', 245], ['mocha', 245], ['schokolade', 230]] },
      { sube: 0, gap: 4, productos: [['latte-light', 170], ['rooibos-tea', 150], ['reskine', 195], ['creal', 140], ['mocha-light', 160]] },
    ],
  },
  {
    slug: 'categoria-suplementos',
    titulo: 'Suplementos',
    filas: [
      { sube: 0, gap: 10, productos: [['ganoderma', 330], ['excellium', 330], ['cordyceps', 330], ['gano-plus', 270]] },
    ],
  },
  {
    slug: 'categoria-cuidado-personal',
    titulo: 'Cuidado Personal',
    filas: [
      { sube: 0, gap: 40, productos: [['ganosoap', 380], ['toothpaste', 400], ['reishi-touch', 400]] },
    ],
  },
];

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function cargar(slug, alto, ancho = 620) {
  const buf = await sharp(join(ORIGEN, `${slug}.png`)).trim().resize({ width: ancho, height: alto, fit: 'inside' }).png().toBuffer();
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
  return sharp(completo).extract({ left: 0, top: 0, width: img.width, height: Math.min(img.height, tope) }).png().toBuffer();
}

/** Orden de pintado de una fila: de los bordes hacia el centro, para que el del medio quede entero. */
function ordenCentro(n) {
  const centro = (n - 1) / 2;
  return [...Array(n).keys()].sort((a, b) => Math.abs(b - centro) - Math.abs(a - centro));
}

async function componer(fam) {
  const capas = [];
  const ultima = fam.filas.length - 1;
  for (let r = 0; r < fam.filas.length; r++) {
    const fila = fam.filas[r];
    const base = MESA - fila.sube;
    const imgs = await Promise.all(fila.productos.map(([slug, alto]) => cargar(slug, alto)));
    const desde = 60, hasta = W - 60, n = imgs.length;
    const total = imgs.reduce((a, i) => a + i.width, 0);
    const gap = n > 1 ? Math.min(fila.gap, (hasta - desde - total) / (n - 1)) : 0;
    let cursor = desde + (hasta - desde - (total + gap * (n - 1))) / 2;
    const pos = imgs.map((img) => { const x = Math.round(cursor); cursor += img.width + gap; return { img, x, y: base - img.height }; });
    console.log(`    ${fam.slug} fila ${r + 1}: ancho ${Math.round(total + gap * (n - 1))} sobre ${hasta - desde}`);
    const orden = ordenCentro(n);
    if (r === ultima) {
      for (const i of orden) capas.push({ input: await reflejoDe(pos[i].img, 1080 - base - 2), left: pos[i].x, top: base + 2 });
    }
    for (const i of orden) capas.push({ input: pos[i].img.buf, left: pos[i].x, top: pos[i].y });
  }

  const n = fam.filas.reduce((a, f) => a + f.productos.length, 0);
  const subtitulo = `${n} productos`;
  const titulo = Buffer.from(
    `<svg width="${W}" height="1080" xmlns="http://www.w3.org/2000/svg">`
    + `<text x="${W / 2}" y="140" text-anchor="middle" font-family="Playfair Display, Georgia, serif" `
    + `font-size="66" fill="#C5A059" letter-spacing="1">${xml(fam.titulo)}</text>`
    + `<line x1="${W / 2 - 60}" y1="172" x2="${W / 2 + 60}" y2="172" stroke="#C5A059" stroke-width="2" opacity="0.55"/>`
    + `<text x="${W / 2}" y="212" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="22" `
    + `letter-spacing="3" fill="#94A3B8" fill-opacity="0.85">${xml(subtitulo.toUpperCase())}</text>`
    + '</svg>');
  const isotipo = await sharp(join(RAIZ, 'public/images/logotipo.png'))
    .resize({ height: 46, fit: 'inside' })
    .composite([{ input: Buffer.from('<svg width="46" height="46"><rect width="46" height="46" fill="#fff" fill-opacity="0.62"/></svg>'), blend: 'dest-in' }])
    .png().toBuffer();
  const { width: iw } = await sharp(isotipo).metadata();
  const firma = Buffer.from(
    `<svg width="${W}" height="1080" xmlns="http://www.w3.org/2000/svg">`
    + `<text x="${72 + iw + 14}" y="1017" font-family="Helvetica, Arial, sans-serif" font-size="21" `
    + 'font-weight="600" letter-spacing="2.6" fill="#C5A059" fill-opacity="0.72">CREATUACTIVO.COM</text>'
    + `<text x="${W - 72}" y="1017" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="19" `
    + 'letter-spacing="2.2" fill="#94A3B8" fill-opacity="0.62">QUESWA.APP AI</text>'
    + '</svg>');

  const archivo = `${fam.slug}-${VERSION}.jpg`;
  await sharp(PLACA)
    .composite([...capas, { input: titulo, left: 0, top: 0 }, { input: isotipo, left: 72, top: 976 }, { input: firma, left: 0, top: 0 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(join(DESTINO, archivo));
  return { archivo, subtitulo };
}

mkdirSync(DESTINO, { recursive: true });
const total = FAMILIAS.reduce((a, f) => a + f.filas.reduce((b, r) => b + r.productos.length, 0), 0);
if (total !== 17) { console.error(`✗ Son ${total} productos; la lista de EE. UU. tiene 17.`); process.exit(1); }
console.log('🎨 Componiendo las líneas de Estados Unidos…\n');
for (const f of FAMILIAS) {
  const { archivo, subtitulo } = await componer(f);
  console.log(`  ✓ compuestas/usa/${archivo}  ${f.titulo} — ${subtitulo}`);
}
