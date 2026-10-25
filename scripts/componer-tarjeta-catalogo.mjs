/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Compone la tarjeta que sale al compartir el catálogo (25 oct 2026): una escena
 * de estilo de vida con la caja REAL del Ganocafé 3 en 1 de pie sobre la mesa.
 * 1200×630, JPG.
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
 * recortada a un cuadrado del centro (x 285–915). La taza y la caja caben ahí.
 *
 * SIN TEXTO (Director, 25 oct 2026): la v1 llevaba el titular de la tienda,
 * «Catálogo Gano Excel», y ensuciaba la imagen. El título y la descripción ya
 * viajan debajo de ella en la vista previa.
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
import { readFileSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SET = join(RAIZ, 'public/productos/_set');
const W = 1200, H = 630;

// La caja: centro, línea de la mesa donde apoya y alto del frente. A 375 de alto
// el frente medía lo mismo que la taza; el Director la pidió un 15 % más grande
// (431). Para que la tapa no se salga por arriba, apoya un poco más adelante
// en la mesa, sin tocar el plato.
const CAJA_CX = 800, CAJA_BASE = 476, CAJA_ALTO = 431;

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
const estudio = await sharp(join(SET, 'limpios/ganocafe-3-en-1.png'))
  .trim().resize({ height: CAJA_ALTO })
  .modulate({ saturation: 0.86, brightness: 0.97 }).linear(0.86, 18).blur(0.6)
  .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: pw, height: ph } = estudio.info;
// El borde se come 1 px: el recorte trae restos claros del fondo de estudio, y
// en la base se veían como una línea blanca entre la caja y la mesa.
const rgba = Buffer.from(estudio.data);
for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) {
  const a = (yy, xx) => (yy < 0 || yy >= ph || xx < 0 || xx >= pw) ? 0 : estudio.data[(yy * pw + xx) * 4 + 3];
  rgba[(y * pw + x) * 4 + 3] = Math.min(a(y, x), a(y - 1, x), a(y + 1, x), a(y, x - 1), a(y, x + 1));
}
const frente0 = await sharp(rgba, { raw: { width: pw, height: ph, channels: 4 } }).png().toBuffer();
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

// ── 4. Las sombras, medidas sobre las reales de la escena ──
// La mesa al sol es (236,178,100); la sombra de la taza la deja en (148,100,59),
// ~60 %, y el contacto del plato es casi negro (34,7,2). La sombra de la taza
// cae hacia adelante a la derecha con pendiente 0,73, es larga (se sale por el
// borde de abajo) y es nítida junto al plato y más suave lejos. La de la caja se
// arma igual, en tres capas que se MULTIPLICAN sobre la mesa —así la veta de la
// madera sigue viéndose a través— y se juntan con `darken`:
//   · contacto: la huella de la caja, casi negra, apenas desenfocada;
//   · oclusión: un halo corto alrededor de la base, donde no llega el rebote;
//   · proyectada: la huella arrastrada en la dirección de la luz, que se aclara
//     con la distancia; nítida en su primer tramo y difusa en el resto.
// Sin la línea de contacto la caja flota, aunque tenga sombra proyectada.
const B = CAJA_BASE;
const huella = [[x0, B], [x1, B], [x1 - L, B - T], [x0 - L, B - T]];
const LARGO = ph * 1.4, DIR = [1 / Math.hypot(1, 0.73), 0.73 / Math.hypot(1, 0.73)];
const D = [DIR[0] * LARGO, DIR[1] * LARGO];

/** Envolvente convexa (cadena monótona): la silueta de la huella y su proyección. */
function envolvente(puntos) {
  const p = [...puntos].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cruz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const media = (lista) => lista.reduce((h, q) => { while (h.length >= 2 && cruz(h[h.length - 2], h[h.length - 1], q) <= 0) h.pop(); h.push(q); return h; }, []);
  const abajo = media(p), arriba = media([...p].reverse());
  return [...abajo.slice(0, -1), ...arriba.slice(0, -1)];
}
const pts = (lista) => lista.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
const arrastre = (k) => envolvente([...huella, ...huella.map(([x, y]) => [x + D[0] * k, y + D[1] * k])]);
const capa = (cuerpo, desenfoque) => sharp(Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs>`
  + `<linearGradient id="g" gradientUnits="userSpaceOnUse" x1="${CAJA_CX}" y1="${B}" x2="${CAJA_CX + D[0]}" y2="${B + D[1]}">`
  + '<stop offset="0%" stop-color="rgb(158,140,147)"/><stop offset="100%" stop-color="rgb(222,212,214)"/></linearGradient></defs>'
  + `<rect width="${W}" height="${H}" fill="#fff"/>${cuerpo}</svg>`)).blur(desenfoque).png().toBuffer();

const capas = await Promise.all([
  capa(`<polygon points="${pts(arrastre(0.35))}" fill="url(#g)"/>`, 3),
  capa(`<polygon points="${pts(arrastre(1))}" fill="url(#g)"/>`, 14),
  capa(`<polygon points="${pts(huella)}" fill="rgb(168,146,138)" stroke="rgb(168,146,138)" stroke-width="18" stroke-linejoin="round"/>`, 6),
  capa(`<polygon points="${pts(huella)}" fill="rgb(58,32,20)" stroke="rgb(58,32,20)" stroke-width="4" stroke-linejoin="round"/>`, 1.2),
]);
const sombras = await sharp({ create: { width: W, height: H, channels: 3, background: '#fff' } })
  .composite(capas.map((input) => ({ input, blend: 'darken' })))
  .png().toBuffer();

const salida = join(RAIZ, 'public/productos', nombreTarjeta());
await sharp(escena)
  .composite([
    { input: sombras, blend: 'multiply' },
    { input: costado, left: x0 - L, top: yTop - T },
    { input: tapa, left: x0 - L, top: yTop - T },
    { input: frente, left: x0, top: yTop },
    { input: filo, left: x0, top: yTop },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(salida);

console.log(`✓ ${salida.replace(RAIZ + '/', '')}  ${W}×${H}  ${Math.round(statSync(salida).size / 1024)} KB`);
