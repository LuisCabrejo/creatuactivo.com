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
 * Dos fondos (21 nov 2026, Director):
 *   · fondo-cafe-v1.jpg            — la taza sola (la pieza por defecto).
 *   · fondo-cafe-ganocafe-v1.jpg   — la taza y una caja de Ganocafé 3 en 1 (foto real,
 *     public/productos/_set/limpios), a la izquierda y un poco más adelante: su base
 *     cae más abajo que la de la taza y la monta apenas, que es lo que da la
 *     profundidad. Se oscurece para igualar la luz baja de la foto, y lleva sombra
 *     de contacto y un reflejo tenue en la mesa, como la taza. /hablador/{slug}?variante=ganocafe
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
const CAJA = join(RAIZ, 'public/productos/_set/limpios/ganocafe-3-en-1.png');

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

// ── La caja de Ganocafé 3 en 1, en coordenadas de la pieza recortada ─────────
// La taza: borde a 53 mm, base a 94 mm, cuerpo de 34,4 a 66,1 mm en x.
const CAJA_ALTO = 37;      // mm: un poco menos que la taza, para que ella siga mandando
const CAJA_BASE = 96.5;    // mm: más abajo que la taza = más cerca de quien mira
const CAJA_DERECHA = 37;   // mm: monta 2,6 mm sobre el cuerpo de la taza
const LUZ = 0.62;          // la foto de la caja está iluminada de estudio; la escena, no

async function capasDeLaCaja() {
  const alto = mm(CAJA_ALTO);
  const base = sharp(CAJA).resize({ height: alto });
  const { data: c, info: ic } = await base.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  // La luz viene de arriba a la derecha, como en la taza: el lado izquierdo y la
  // parte de abajo se apagan un poco más.
  for (let y = 0; y < ic.height; y++) {
    for (let x = 0; x < ic.width; x++) {
      const k = LUZ * (0.78 + 0.22 * (x / ic.width)) * (1 - 0.18 * (y / ic.height));
      const i = (y * ic.width + x) * 4;
      c[i] = Math.round(c[i] * k); c[i + 1] = Math.round(c[i + 1] * k); c[i + 2] = Math.round(c[i + 2] * k);
    }
  }
  const caja = await sharp(c, { raw: { width: ic.width, height: ic.height, channels: 4 } }).png().toBuffer();

  // El reflejo en la mesa: la caja al revés, tenue y desvanecido en 6 mm.
  const altoReflejo = Math.min(ic.height, mm(6));
  const r = Buffer.from(c);
  const reflejo = Buffer.alloc(ic.width * altoReflejo * 4);
  for (let y = 0; y < altoReflejo; y++) {
    const src = ic.height - 1 - y;
    const a = 0.16 * (1 - suave(0, 1, y / altoReflejo));
    for (let x = 0; x < ic.width; x++) {
      const i = (src * ic.width + x) * 4, o = (y * ic.width + x) * 4;
      reflejo[o] = r[i]; reflejo[o + 1] = r[i + 1]; reflejo[o + 2] = r[i + 2];
      reflejo[o + 3] = Math.round(r[i + 3] * a);
    }
  }
  const reflejoPng = await sharp(reflejo, { raw: { width: ic.width, height: altoReflejo, channels: 4 } }).png().toBuffer();

  // La sombra de contacto: una elipse negra difusa bajo la base.
  const sw = ic.width + mm(6), sh = mm(5);
  const sombra = await sharp(Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${sh}"><ellipse cx="${sw / 2}" cy="${sh / 2}" rx="${sw / 2 - mm(1.5)}" ry="${sh / 4}" fill="black" fill-opacity="0.75"/></svg>`
  )).blur(mm(0.8)).png().toBuffer();

  const izq = mm(CAJA_DERECHA + 3) - ic.width;        // +3 mm de sangrado
  const arriba = mm(CAJA_BASE + 3) - ic.height;
  return [
    { input: sombra, left: izq - mm(3), top: arriba + ic.height - Math.round(sh / 2) },
    { input: reflejoPng, left: izq, top: arriba + ic.height },
    { input: caja, left: izq, top: arriba },
  ];
}

mkdirSync(DESTINO, { recursive: true });
const taza = { input: visible, left: Math.max(0, IZQ), top: Math.max(0, ARRIBA) };
for (const [archivo, capas] of [
  ['fondo-cafe-v1.jpg', [taza]],
  ['fondo-cafe-ganocafe-v1.jpg', [taza, ...(await capasDeLaCaja())]],
]) {
  const salida = join(DESTINO, archivo);
  await sharp({ create: { width: W, height: H, channels: 3, background: FONDO } })
    .composite(capas)
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .withMetadata({ density: 300 })
    .toFile(salida);
  console.log(`✅ ${salida.replace(RAIZ + '/', '')} · ${W} × ${H} px (106 × 156 mm a 300 ppp)`);
}
