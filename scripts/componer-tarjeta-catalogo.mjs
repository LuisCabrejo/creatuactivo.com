/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Compone la tarjeta que sale al compartir el catálogo (25 oct 2026): una escena
 * de estilo de vida con la caja REAL del Ganocafé 3 en 1 de pie sobre la mesa y
 * el titular de la tienda. 1200×630, JPG.
 *
 * POR QUÉ LA ESCENA Y LA CAJA VAN POR SEPARADO: la escena la generó Gemini SIN
 * ninguna caja (`public/productos/_set/escena-cafe-ventana.jpg`), y la caja es la
 * foto de estudio (`_set/limpios/ganocafe-3-en-1.png`). Un empaque dibujado por
 * la IA es un producto que no existe: deforma la etiqueta. La taza lleva café
 * con leche color caramelo, que es como se ve el 3 en 1 preparado.
 *
 * LA CAJA, COMO EN LA FOTO DE GANO EXCEL (ganocafe3en1-4.jpg de su página): más
 * ancha que la taza, y con el costado naranja impreso. El costado es ese panel
 * real, recortado de esa foto (`_set/costado-ganocafe-3-en-1.jpg`); la tapa
 * continúa la impresión del borde del frente. Los dos van inclinados hacia el
 * punto de fuga, porque la cámara de la escena mira la mesa desde arriba y sin
 * ellos la caja se ve plana, como una tarjeta pegada.
 *
 * LA LUZ ES LA DE LA ESCENA: la ventana está a la izquierda y atrás, así que la
 * caja se aclara hacia ese lado y su sombra cae hacia adelante a la derecha,
 * como la de la taza. Sin la sombra de contacto la caja flota.
 *
 * EL CENTRO RESISTE EL RECORTE CUADRADO: WhatsApp a veces muestra la vista previa
 * recortada a un cuadrado del centro (x 285–915). La taza y la caja caben ahí; el
 * titular queda entero a la derecha, fuera del recorte, en vez de partido.
 *
 * EL TITULAR ES EL H1 DE LA TIENDA: «Catálogo Gano Excel» en Playfair 700 y la
 * tinta de /productos (#2B211A), renderizado con satori, el mismo motor de las
 * tarjetas next/og. (Pango, el de sharp, no toma la fuente aunque se le pase.)
 *
 * ⚠️ La tarjeta no lleva precio ni promesa de salud, por la misma razón que las
 * fotos de producto (ver componer-imagenes-producto.mjs).
 *
 * El nombre del archivo sale de src/app/productos/og.ts. Si la imagen cambia,
 * súbale la versión allí (-v2…) antes de correr esto: el CDN guarda el archivo
 * viejo un día y Facebook guarda la tarjeta por su URL.
 *
 * node scripts/componer-tarjeta-catalogo.mjs
 */
import sharp from 'sharp';
import { ImageResponse } from 'next/dist/compiled/@vercel/og/index.node.js';
import { readFileSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SET = join(RAIZ, 'public/productos/_set');
const W = 1200, H = 630;

// La caja: centro, línea de la mesa donde apoya y alto del frente. A 375 de alto
// el frente mide lo mismo que la taza y, con el costado, la supera (Director).
const CAJA_CX = 780, CAJA_BASE = 442, CAJA_ALTO = 375;
const TITULAR = { left: 928, top: 72, ancho: 250, alto: 120, tam: 44 };

const transparente = { r: 0, g: 0, b: 0, alpha: 0 };

/** El nombre del archivo, de og.ts, para no tener dos copias que se separen. */
function nombreTarjeta() {
  const m = readFileSync(join(RAIZ, 'src/app/productos/og.ts'), 'utf8').match(/\/productos\/(tarjeta-catalogo-v\d+\.jpg)/);
  if (!m) throw new Error('No encontré el nombre de la tarjeta en src/app/productos/og.ts');
  return m[1];
}

// ── 1. La escena, a 1200 de ancho y recortada al centro ──
const escenaAncha = await sharp(join(SET, 'escena-cafe-ventana.jpg')).resize({ width: W }).toBuffer();
const { height: altoEscena } = await sharp(escenaAncha).metadata();
const escena = await sharp(escenaAncha)
  .extract({ left: 0, top: Math.round((altoEscena - H) / 2), width: W, height: H }).toBuffer();

// ── 2. El frente de la caja ──
// Menos contraste y saturación que la foto de estudio, y medio punto de
// desenfoque por la profundidad de campo de la escena. Después, la luz: un
// degradado cálido, más claro del lado de la ventana.
const frente0 = await sharp(join(SET, 'limpios/ganocafe-3-en-1.png'))
  .trim().resize({ height: CAJA_ALTO })
  .modulate({ saturation: 0.86, brightness: 0.97 }).linear(0.86, 18).blur(0.6).png().toBuffer();
const { width: pw, height: ph } = await sharp(frente0).metadata();
const luz = Buffer.from(
  `<svg width="${pw}" height="${ph}" xmlns="http://www.w3.org/2000/svg"><defs>`
  + '<linearGradient id="l" x1="0" y1="0" x2="1" y2="0.25">'
  + '<stop offset="0%" stop-color="#FFF4E2"/><stop offset="100%" stop-color="#D2B994"/>'
  + `</linearGradient></defs><rect width="${pw}" height="${ph}" fill="url(#l)"/></svg>`);
const frente = await sharp(frente0)
  .composite([{ input: luz, blend: 'multiply' }, { input: frente0, blend: 'dest-in' }])
  .png().toBuffer();
const x0 = Math.round(CAJA_CX - pw / 2), x1 = x0 + pw, yTop = CAJA_BASE - ph;

// ── 3. El volumen: tapa y costado ──
// T es lo que sube la tapa; L, el ancho del costado (~15 % del frente, la
// proporción de la foto de Gano). Los dos dan a la ventana.
const T = Math.round(ph * 0.075), L = Math.round(pw * 0.15);
const tapa = await sharp(frente).extract({ left: 0, top: 0, width: pw, height: 5 })
  .resize({ width: pw, height: T, fit: 'fill' }).modulate({ brightness: 1.3 })
  .affine([1, L / T, 0, 1], { background: transparente })
  .png().toBuffer();
const costado = await sharp(join(SET, 'costado-ganocafe-3-en-1.jpg'))
  .resize({ width: L, height: ph, fit: 'fill' }).modulate({ brightness: 1.04, saturation: 0.9 }).blur(0.6)
  .ensureAlpha()
  .affine([1, 0, T / L, 1], { background: transparente })
  .png().toBuffer();
// El filo de la tapa, donde le pega la luz
const filo = Buffer.from(`<svg width="${pw}" height="2" xmlns="http://www.w3.org/2000/svg"><rect width="${pw}" height="1" y="0.5" fill="#FFF1D6" fill-opacity="0.5"/></svg>`);

// ── 4. Las sombras: la proyectada (hacia adelante a la derecha) y la de contacto ──
const dx = Math.round(ph * 0.55), dy = Math.round(ph * 0.34);
const sombraProyectada = await sharp(Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`
  + `<polygon points="${x0 - L},${CAJA_BASE - T} ${x1},${CAJA_BASE} ${x1 + dx},${CAJA_BASE + dy} ${x0 + dx},${CAJA_BASE + dy}" fill="#3A2412" fill-opacity="0.5"/>`
  + '</svg>')).blur(14).png().toBuffer();
const sombraContacto = await sharp(Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`
  + `<ellipse cx="${CAJA_CX - L / 2 + 4}" cy="${CAJA_BASE - 2}" rx="${(pw + L) * 0.56}" ry="11" fill="#1E120A" fill-opacity="0.75"/>`
  + '</svg>')).blur(4).png().toBuffer();

// ── 5. El titular ──
const linea = (texto) => ({ type: 'div', props: { style: { display: 'flex' }, children: texto } });
const titular = Buffer.from(await new ImageResponse(
  { type: 'div', props: {
    style: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Playfair Display', fontWeight: 700, fontSize: TITULAR.tam, lineHeight: 1.08, color: '#2B211A' },
    children: [linea('Catálogo'), linea('Gano Excel')],
  } },
  {
    width: TITULAR.ancho, height: TITULAR.alto,
    fonts: [{ name: 'Playfair Display', data: readFileSync(join(RAIZ, 'public/fonts/PlayfairDisplay-Bold.ttf')), weight: 700, style: 'normal' }],
  },
).arrayBuffer());

const salida = join(RAIZ, 'public/productos', nombreTarjeta());
await sharp(escena)
  .composite([
    { input: sombraProyectada, left: 0, top: 0 },
    { input: sombraContacto, left: 0, top: 0 },
    { input: costado, left: x0 - L, top: yTop - T },
    { input: tapa, left: x0 - L, top: yTop - T },
    { input: frente, left: x0, top: yTop },
    { input: filo, left: x0, top: yTop },
    { input: titular, left: TITULAR.left, top: TITULAR.top },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(salida);

console.log(`✓ ${salida.replace(RAIZ + '/', '')}  ${W}×${H}  ${Math.round(statSync(salida).size / 1024)} KB`);
