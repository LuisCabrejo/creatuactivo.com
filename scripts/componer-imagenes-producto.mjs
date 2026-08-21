/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Compone las imágenes de producto que Queswa envía por WhatsApp.
 *
 * Cada una es el PNG oficial del producto apoyado sobre el set de la marca —la
 * pared de baldosa y la mesa negra de los flyers del Dashboard— con su reflejo
 * y el nombre en Playfair dorado. 1080×1080.
 *
 * POR QUÉ ESTÁTICAS Y NO UNA RUTA QUE LAS ARME AL VUELO: son 22 imágenes que
 * cambian cuando cambia el catálogo, o sea casi nunca. Generarlas en cada envío
 * costaría CPU y una dependencia de `sharp` en producción para nada; como
 * archivos, Meta las descarga del CDN y el envío no toca nuestro servidor.
 *
 * POR QUÉ 1:1 Y NO 9:16: el flyer del Dashboard es 9:16 porque su destino es el
 * Estado. Una imagen de chat a 9:16 la recorta WhatsApp a cuadrado por su
 * cuenta, y suele cortar justo el producto. El punto dulce medido para chat y
 * catálogo es 1080×1080.
 *
 * ⚠️ LA IMAGEN NO LLEVA PRECIO NI PROMESA — solo el nombre. El precio cambia y
 * una imagen con precio viejo circulando no se puede retirar; va en el pie de
 * foto (`pieDeFoto()` en wa-productos.ts), que sí se actualiza. Y una imagen con
 * declaración de salud deja de ser conversación y pasa a ser publicidad de
 * producto, que se juzga con la vara de la etiqueta.
 *
 * La placa sale de `public/productos/_set/placa-1080.png`, extraída de la escena
 * `exfoliante__reskine.png` del Dashboard (columna limpia del borde, estirada —
 * las líneas de baldosa y el canto de la mesa son horizontales, así que estirar
 * no deforma— más el halo cálido repuesto al centro).
 *
 * node scripts/componer-imagenes-producto.mjs
 */
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const PLACA = join(RAIZ, 'public/productos/_set/placa-1080.png');
const DESTINO = join(RAIZ, 'public/productos/compuestas');

const W = 1080;
const MESA = 735;        // línea de la mesa en la placa
const ALTO_PROD = 520;
const ANCHO_PROD = 800;  // el Gano Fresh es horizontal: sin esto medía 1936 de ancho

/** Catálogo: se lee de wa-productos.ts para no tener dos listas que se separen. */
function leerCatalogo() {
  const src = readFileSync(join(RAIZ, 'src/lib/wa-productos.ts'), 'utf8');
  const re = /slug: '([^']+)',\s*\n\s*nombre: '((?:[^'\\]|\\.)+)',[\s\S]*?imagen: '([^']+)',/g;
  const out = [];
  let m;
  while ((m = re.exec(src))) out.push({ slug: m[1], nombre: m[2].replace(/\\'/g, "'"), imagen: m[3] });
  return out;
}

/** Escapa lo que va dentro del <text> del SVG. */
const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function componer(p) {
  const prod = await sharp(join(RAIZ, 'public', p.imagen))
    .trim()
    .resize({ width: ANCHO_PROD, height: ALTO_PROD, fit: 'inside' })
    .png().toBuffer();
  const { width: pw, height: ph } = await sharp(prod).metadata();
  const x = Math.round((W - pw) / 2);

  // El reflejo es lo que apoya el producto en la mesa: sin él se ve pegado encima.
  const desvanecido = Buffer.from(
    `<svg width="${pw}" height="${ph}" xmlns="http://www.w3.org/2000/svg"><defs>`
    + '<linearGradient id="f" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0%" stop-color="#fff" stop-opacity="0.30"/>'
    + '<stop offset="32%" stop-color="#fff" stop-opacity="0.03"/>'
    + '<stop offset="100%" stop-color="#fff" stop-opacity="0"/>'
    + `</linearGradient></defs><rect width="${pw}" height="${ph}" fill="url(#f)"/></svg>`);
  const reflejoCompleto = await sharp(prod).flip()
    .composite([{ input: desvanecido, blend: 'dest-in' }]).png().toBuffer();
  // Recortado a lo que queda de mesa: un producto alto lo empujaba fuera del
  // lienzo y sharp abortaba el compuesto entero.
  const altoReflejo = Math.min(ph, 1080 - MESA - 2);
  const reflejo = await sharp(reflejoCompleto)
    .extract({ left: 0, top: 0, width: pw, height: altoReflejo }).png().toBuffer();

  // El nombre se achica si es largo, para no tocar los bordes.
  const tam = p.nombre.length > 22 ? 50 : p.nombre.length > 16 ? 58 : 66;
  const titulo = Buffer.from(
    `<svg width="${W}" height="1080" xmlns="http://www.w3.org/2000/svg">`
    + `<text x="${W / 2}" y="152" text-anchor="middle" font-family="Playfair Display, Georgia, serif" `
    + `font-size="${tam}" fill="#C5A059" letter-spacing="1">${xml(p.nombre)}</text>`
    + `<line x1="${W / 2 - 60}" y1="192" x2="${W / 2 + 60}" y2="192" stroke="#C5A059" stroke-width="2" opacity="0.55"/>`
    + '</svg>');

  await sharp(PLACA)
    .composite([
      { input: reflejo, left: x, top: MESA + 2 },
      { input: prod, left: x, top: MESA - ph },
      { input: titulo, left: 0, top: 0 },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(join(DESTINO, `${p.slug}.jpg`));
}

mkdirSync(DESTINO, { recursive: true });
const catalogo = leerCatalogo();
console.log(`🎨 Componiendo ${catalogo.length} imágenes de producto…\n`);
let ok = 0;
for (const p of catalogo) {
  try {
    await componer(p);
    ok++;
    console.log(`  ✓ ${p.slug}.jpg  ${p.nombre}`);
  } catch (err) {
    console.error(`  ✗ ${p.slug}: ${err.message}`);
  }
}
console.log(`\n${ok}/${catalogo.length} en public/productos/compuestas/`);
process.exit(ok === catalogo.length ? 0 : 1);
