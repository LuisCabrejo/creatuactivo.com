/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Compone el fondo del hablador de mostrador (/hablador/{slug}, 20 nov 2026): la
 * taza humeante de la Presentación (public/images/servilleta/producto-cafe.webp,
 * foto real y sin marca) sobre el carbón de la pieza, con los bordes fundidos.
 *
 * ⚠️ Por qué es una imagen y no CSS: con `mask-image` la pantalla se veía bien,
 * pero el PDF de impresión dejaba una franja donde terminaba la foto. Compuesto
 * aquí, lo que se ve es lo que se imprime.
 *
 * Mide 106 × 156 mm a 300 ppp: la pieza (100 × 150) más 3 mm de sangrado por lado.
 * La página lo centra, así que sin sangrado se recorta solo.
 * ⛔ Si cambia, lleva nombre nuevo (-v2…) y se actualiza en la página: el service
 * worker sirve los estáticos cache-first.
 *
 * node scripts/componer-fondo-hablador.mjs
 */
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const FOTO = join(RAIZ, 'public/images/servilleta/producto-cafe.webp');
const DESTINO = join(RAIZ, 'public/images/hablador');
const SALIDA = join(DESTINO, 'fondo-cafe-v1.jpg');

const PX = 300 / 25.4;                       // px por mm a 300 ppp
const mm = (v) => Math.round(v * PX);
const W = mm(106), H = mm(156);
const FONDO = { r: 0x06, g: 0x09, b: 0x0A };

// La foto en coordenadas de la pieza recortada: 100 mm de ancho (179 de alto),
// borde izquierdo en +0,2 mm y superior en -52,5 mm. Con eso el vapor sube detrás
// del título y la taza queda a la misma distancia de la bajada que del QR (Director,
// 20 nov 2026: con -57 mm quedaba pegada a la bajada). En x, el CUERPO de la taza
// (sin el asa) queda centrado en 50 mm, el eje del QR (Director, mismo día): con -6
// mm su centro caía en 43,8. Con el sangrado, todo corre 3 mm.
const ANCHO_FOTO = mm(100);
const IZQ = mm(0.2 + 3);
const ARRIBA = mm(-52.5 + 3);

const foto = sharp(FOTO).resize({ width: ANCHO_FOTO });
const { data, info } = await foto.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

// Funde los bordes: abajo, del 80 % al 94 % del alto (después de la base de la taza); a los lados, del 4 % al 20 %
// y del 80 % al 96 % del ancho. Curva suave (smoothstep) para que no se vea el corte.
const suave = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
for (let y = 0; y < info.height; y++) {
  const fy = 1 - suave(0.80, 0.94, y / info.height);
  for (let x = 0; x < info.width; x++) {
    const u = x / info.width;
    const fx = suave(0.04, 0.20, u) * (1 - suave(0.80, 0.96, u));
    data[(y * info.width + x) * 4 + 3] = Math.round(255 * fx * fy);
  }
}

// Solo la parte de la foto que cae dentro del lienzo.
const x0 = Math.max(0, -IZQ), y0 = Math.max(0, -ARRIBA);
const ancho = Math.min(info.width - x0, W - Math.max(0, IZQ));
const alto = Math.min(info.height - y0, H - Math.max(0, ARRIBA));
const visible = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .extract({ left: x0, top: y0, width: ancho, height: alto })
  .png()
  .toBuffer();

mkdirSync(DESTINO, { recursive: true });
await sharp({ create: { width: W, height: H, channels: 3, background: FONDO } })
  .composite([{ input: visible, left: Math.max(0, IZQ), top: Math.max(0, ARRIBA) }])
  .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
  .withMetadata({ density: 300 })
  .toFile(SALIDA);

console.log(`✅ ${SALIDA.replace(RAIZ + '/', '')} · ${W} × ${H} px (106 × 156 mm a 300 ppp)`);
