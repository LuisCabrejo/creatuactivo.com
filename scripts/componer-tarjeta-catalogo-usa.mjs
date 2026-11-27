/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La tarjeta del catálogo de ESTADOS UNIDOS (27 nov 2026): la que sale al
 * compartir /productos/{slug}?pais=us en WhatsApp, Facebook o una historia.
 * Hasta ese día el catálogo de allá salía con la de Colombia, con la caja del
 * Ganocafé 3 en 1 de aquí (caso del Director, 27 nov 2026).
 *
 * Es la misma escena de estilo de vida de la de Colombia
 * (componer-tarjeta-catalogo.mjs: `_set/escena-cafe-ventana.jpg`, generada SIN
 * caja), con la foto oficial del Gano Café 3-in-1 de ganoexcel.us
 * (`public/productos/usa/3-in-1.png`). Esa foto ya trae la caja en tres cuartos,
 * los granos y la cuchara: no hace falta armarle tapa ni costado, solo la luz de
 * la ventana y la sombra sobre la mesa.
 *
 * Sin texto ni precio, como la de Colombia. El centro resiste el recorte
 * cuadrado de WhatsApp (x 285–915).
 *
 * El nombre del archivo sale de src/app/productos/og.ts (TARJETA_CATALOGO_US).
 * Si la imagen cambia, se sube la versión allí antes de correr esto.
 *
 * node scripts/componer-tarjeta-catalogo-usa.mjs
 */
import sharp from 'sharp';
import { readFileSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200, H = 630;

// Donde apoya el producto y su alto. A la derecha de la taza, como la caja de Colombia.
const CX = 790, BASE = 545, ALTO = 470;

function nombreTarjeta() {
  const m = readFileSync(join(RAIZ, 'src/app/productos/og.ts'), 'utf8').match(/\/productos\/(tarjeta-catalogo-us-v\d+\.jpg)/);
  if (!m) throw new Error('No encontré el nombre de la tarjeta de Estados Unidos en src/app/productos/og.ts');
  return m[1];
}

// ── 1. La escena, a 1200 de ancho y recortada al centro ──
const escenaAncha = await sharp(join(RAIZ, 'public/productos/_set/escena-cafe-ventana.jpg')).resize({ width: W }).toBuffer();
const { height: altoEscena } = await sharp(escenaAncha).metadata();
const escena = await sharp(escenaAncha)
  .extract({ left: 0, top: Math.round((altoEscena - H) / 2), width: W, height: H }).toBuffer();

// ── 2. El producto, con la luz de la escena ──
// Menos contraste que la foto de estudio y medio punto de desenfoque por la
// profundidad de campo; la luz cálida entra por la izquierda (la ventana).
const p0 = await sharp(join(RAIZ, 'public/productos/usa/3-in-1.png'))
  .trim().resize({ height: ALTO })
  .modulate({ saturation: 0.9, brightness: 0.98 }).linear(0.9, 12).blur(0.5)
  .png().toBuffer();
const { width: pw, height: ph } = await sharp(p0).metadata();
const luz = Buffer.from(
  `<svg width="${pw}" height="${ph}" xmlns="http://www.w3.org/2000/svg"><defs>`
  + '<linearGradient id="l" x1="0" y1="0" x2="1" y2="0.2">'
  + '<stop offset="0%" stop-color="#FFF6E6"/><stop offset="100%" stop-color="#D9C3A2"/>'
  + `</linearGradient></defs><rect width="${pw}" height="${ph}" fill="url(#l)"/></svg>`);
const producto = await sharp(p0)
  .composite([{ input: luz, blend: 'multiply' }, { input: p0, blend: 'dest-in' }])
  .png().toBuffer();
const x0 = Math.round(CX - pw / 2), yTop = BASE - ph;

// ── 3. La sombra: contacto bajo los granos y la caja, y la proyectada hacia
// adelante a la derecha, como la de la taza. Se MULTIPLICA sobre la mesa para
// que la veta de la madera siga viéndose.
const sombra = await sharp(Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`
  + `<rect width="${W}" height="${H}" fill="#fff"/>`
  + `<ellipse cx="${CX + 70}" cy="${BASE + 4}" rx="${pw * 0.5}" ry="30" fill="rgb(118,86,64)"/>`
  + `<polygon points="${x0 + pw * 0.2},${BASE - 40} ${x0 + pw * 0.85},${BASE - 60} ${x0 + pw * 1.25},${BASE + 70} ${x0 + pw * 0.45},${BASE + 90}" fill="rgb(196,172,160)"/>`
  + '</svg>')).blur(16).png().toBuffer();

const salida = join(RAIZ, 'public/productos', nombreTarjeta());
await sharp(escena)
  .composite([
    { input: sombra, blend: 'multiply' },
    { input: producto, left: x0, top: yTop },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(salida);

console.log(`✓ ${salida.replace(RAIZ + '/', '')}  ${W}×${H}  ${Math.round(statSync(salida).size / 1024)} KB`);
