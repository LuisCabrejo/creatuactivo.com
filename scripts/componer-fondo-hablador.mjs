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
 *   · fondo-cafe-ganocafe-v3.jpg   — la escena de la caja de Ganocafé 3 en 1 con una
 *     taza (public/images/hablador/escena-ganocafe-v1.jpg). /hablador/{slug}?variante=ganocafe
 *
 * ⚠️ POR QUÉ LA ESCENA Y NO UN MONTAJE (auditoría del 21 nov 2026). La v1 y la v2
 * pegaban la foto de catálogo de la caja junto a la taza de la Presentación: dos
 * cámaras distintas (la taza vista desde arriba, la caja escaneada de frente) y dos
 * luces. Ninguna escala lo arregla: se leía como una miniatura o como un recorte. La
 * escena es UNA cámara y UNA luz (generada con Nano Banana por el Director), con la
 * caja más grande que la taza, como es en la realidad, y con la ETIQUETA REAL puesta
 * encima por scripts/hablador-reetiquetar-caja.py. La tapa y el costado siguen
 * siendo los de la IA.
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

// ── La escena de Ganocafé, en coordenadas de la pieza recortada ──────────────
// Medida sobre la escena (1696 × 2528): la boca de la taza está centrada en el
// 64,9 % del ancho, la tapa de la caja empieza en el 28,5 % del alto y la base de la
// taza en el 88,4 %. A 63 mm de ancho (93,9 de alto) y con top 17,2 mm: la caja
// arranca a 44 mm (bajo la bajada), la base de la taza cae a 100 mm (antes del QR) y
// la taza queda en el eje del QR, a 50 mm. La foto tiene el negro puro: la pieza
// también, y se funden los bordes donde termina la mesa.
const ESCENA = join(RAIZ, 'public/images/hablador/escena-ganocafe-v1.jpg');
// La caja y la taza en blanco (la guarda scripts/hablador-reetiquetar-caja.py): la
// mesa se apaga, los objetos no. ⚠️ Sin ella, la elipse apagaba la tapa y el logo GE.
const OBJETOS = join(RAIZ, 'public/images/hablador/escena-ganocafe-v1-objetos.png');
const ESCENA_ANCHO = 63, ESCENA_ARRIBA = 17.2, ESCENA_IZQ = 50 - 0.649 * ESCENA_ANCHO;

async function escenaGanocafe() {
  const { data: e, info: ie } = await sharp(ESCENA).resize({ width: mm(ESCENA_ANCHO) }).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const obj = await sharp(OBJETOS).resize({ width: ie.width, height: ie.height, fit: 'fill' })
    .blur(mm(0.8)).extractChannel(0).raw().toBuffer();
  // La mesa se apaga en una elipse centrada en los dos objetos, como la caída de una
  // luz puntual: con un fundido rectangular se veía el borde de la foto.
  for (let y = 0; y < ie.height; y++) {
    const v = y / ie.height;
    for (let x = 0; x < ie.width; x++) {
      const u = x / ie.width;
      const d = Math.hypot((u - 0.53) / 0.50, (v - 0.70) / 0.27);
      const borde = suave(0, 0.05, u) * (1 - suave(0.95, 1, u)) * (1 - suave(0.93, 0.99, v));
      const mesa = 1 - suave(0.80, 1.05, d);
      e[(y * ie.width + x) * 4 + 3] = Math.round(255 * borde * Math.max(mesa, obj[y * ie.width + x] / 255));
    }
  }
  return {
    input: await sharp(e, { raw: { width: ie.width, height: ie.height, channels: 4 } }).png().toBuffer(),
    left: mm(ESCENA_IZQ + 3), top: mm(ESCENA_ARRIBA + 3),
  };
}

mkdirSync(DESTINO, { recursive: true });
for (const [archivo, fondo, capas] of [
  ['fondo-cafe-v1.jpg', FONDO, [{ input: visible, left: Math.max(0, IZQ), top: Math.max(0, ARRIBA) }]],
  ['fondo-cafe-ganocafe-v3.jpg', { r: 0, g: 0, b: 0 }, [await escenaGanocafe()]],
]) {
  const salida = join(DESTINO, archivo);
  await sharp({ create: { width: W, height: H, channels: 3, background: fondo } })
    .composite(capas)
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .withMetadata({ density: 300 })
    .toFile(salida);
  console.log(`✅ ${salida.replace(RAIZ + '/', '')} · ${W} × ${H} px (106 × 156 mm a 300 ppp)`);
}
