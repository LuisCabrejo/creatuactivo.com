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
 *   · fondo-cafe-ganocafe-grande-v1.jpg — la misma escena a 88 mm, con el QR a la
 *     derecha de la caja y encima de la taza. ?variante=ganocafe-grande
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
import { mkdirSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
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
// Medida sobre la escena (1696 × 2528): el grupo —caja con su costado y taza con su
// asa— va del 10,8 % al 95,5 % del ancho (centro en el 53,1 %), la tapa de la caja
// empieza en el 28,5 % del alto y la base de la taza en el 88,4 %. A 63 mm de ancho
// (93,9 de alto) y con top 16,3 mm: la caja arranca a 43 mm y la base de la taza cae
// a 99 mm, con unos 4 mm de aire contra el texto y contra el QR.
// ⚠️ Se centra el GRUPO en el eje, no la taza (Director, 21 nov 2026: «la veo
// desubicada»): con la taza en el eje, el conjunto quedaba 7,4 mm a la izquierda y
// 31 mm de negro vacío a la derecha. Con dos objetos, el centro es el del conjunto.
// La foto tiene el negro puro: la pieza también, y la mesa se apaga en elipse.
const ESCENA = join(RAIZ, 'public/images/hablador/escena-ganocafe-v1.jpg');
// La caja y la taza en blanco (la guarda scripts/hablador-reetiquetar-caja.py): la
// mesa se apaga, los objetos no. ⚠️ Sin ella, la elipse apagaba la tapa y el logo GE.
const OBJETOS = join(RAIZ, 'public/images/hablador/escena-ganocafe-v1-objetos.png');
const ESCENA_ANCHO = 63, ESCENA_ARRIBA = 16.3, ESCENA_IZQ = 50 - 0.531 * ESCENA_ANCHO;
// La opción grande (Director, 21 nov 2026: «aumentar el tamaño de la caja y la taza y
// que el QR quede a la derecha de la caja, encima de la taza»). Sin el QR debajo, la
// escena crece a 88 mm (131 de alto): la caja va de 13 a 51 mm en x y arranca a 47 en
// y; la boca de la taza queda a 89 y su base a 126. El hueco para el QR va de 51 a
// 87 mm en x, entre la tapa de la caja y la boca de la taza (la página lo pone ahí).
const GRANDE = { ancho: 88, arriba: 9.6, izq: 50 - 0.531 * 88 };

// ── Estados Unidos (27 nov 2026): la misma pieza con la caja de allá ─────────
// Escena generada por el Director con Nano Banana sobre la de Colombia (original en
// docs/hablador/escena-ganocafe-usa-generada-v1.jpg) y la etiqueta real de la foto
// oficial de ganoexcel.us encima:
//   python3 scripts/hablador-reetiquetar-caja.py docs/hablador/escena-ganocafe-usa-generada-v1.jpg \
//     public/images/hablador/escena-ganocafe-usa-v1.jpg 800 1460 820 830 \
//     --etiqueta public/productos/usa/3-in-1.png --cara 121,14 380,3 389,348 151,350
// La caja de allá sale más alta en su foto (tapa en el 17,2 % del alto, contra el
// 28,5 % de la de Colombia): a 88 mm chocaba con el título. A 75 mm (112 de alto) y
// top 26,8: la caja va de 16,5 a 56,8 mm en x y arranca a 46 en y, como la de aquí; la
// boca de la taza queda a 92,5 y su base a 127,4. El QR va a la derecha de la caja,
// de 60 a 85 mm (la página y el PDF lo ponen ahí).
const USA = {
  escena: join(RAIZ, 'public/images/hablador/escena-ganocafe-usa-v1.jpg'),
  objetos: join(RAIZ, 'public/images/hablador/escena-ganocafe-usa-v1-objetos.png'),
  ancho: 75, arriba: 26.8, izq: 9,
};

// ── Por negocio (27 nov 2026): salón de belleza y gimnasio, en Colombia ──────
// Escenas generadas por el Director con Nano Banana (originales en docs/hablador/),
// con la misma cámara y la misma luz que la de Colombia, y la misma maqueta: el QR a
// la derecha de los productos en el salón, y en el eje en el gimnasio, encima de la
// mancuerna: los productos van bajos y a lo ancho, y arriba a la izquierda flotaba.
//   · Salón: el champú y el acondicionador quedan como los dibujó la IA. Probado y
//     descartado: ponerles la etiqueta real. Sobre un frasco redondo la deja plana, con
//     costuras y con las letras mezcladas («ACONDICIOOR»), y la que dibujó la IA es la
//     del frasco (logo, texto y peso neto).
//   · Gimnasio: la caja de Ganocafé Classic lleva la etiqueta real (la IA escribió
//     letras sin sentido en el texto de la caja), con el frasco de Cordygold delante:
//       python3 scripts/hablador-reetiquetar-caja.py docs/hablador/escena-gimnasio-generada-v1.jpg \
//         public/images/hablador/escena-gimnasio-v1.jpg --sin-taza --desenfoque 0.6 \
//         --zona 0 1380 880 640 --delante <máscara del frasco, GrabCut en 780 1515 285 610> \
//         --etiqueta public/productos/_set/limpios/ganocafe-clasico.png
//     El frasco de Cordygold lleva la banda impresa de su etiqueta real encima (como el
//     de las cápsulas de la tienda naturista, abajo): arregla la letra pequeña, que la IA
//     escribió sin sentido. Los frascos del salón no: «ACONDICIONADOR» da la vuelta al
//     frasco y la foto real no la trae entera; con la banda volvía «ACONDICIO OR».
// La máscara de objetos de cada una suma las siluetas de los productos y, con GrabCut,
// la toalla del salón y la taza del gimnasio.
// `elipse` es la luz que apaga la mesa: el mármol del salón es claro y tiene que
// quedar negro antes de «Escanee · Pregunte · Pida por WhatsApp».
const SALON = {
  escena: join(RAIZ, 'public/images/hablador/escena-salon-v1.jpg'),
  objetos: join(RAIZ, 'public/images/hablador/escena-salon-v1-objetos.png'),
  ancho: 96, arriba: 5.2, izq: -0.9, elipse: { cx: 0.50, cy: 0.62, rx: 0.75, ry: 0.22 },
  // La toalla sale del cuadro por la derecha: se apaga a lo largo, no con la curva de
  // la elipse (que la cortaba en redondo).
  derecha: [0.72, 1],
};
const GIMNASIO = {
  escena: join(RAIZ, 'public/images/hablador/escena-gimnasio-v1.jpg'),
  objetos: join(RAIZ, 'public/images/hablador/escena-gimnasio-v1-objetos.png'),
  ancho: 90, arriba: 15.4, izq: 5.9, elipse: { cx: 0.50, cy: 0.68, rx: 0.55, ry: 0.25 },
};

// ── Farmacia y tienda naturista (27 nov 2026): Ganocafé 3 en 1 y Cápsulas de Ganoderma
// Escena del Director (original en docs/hablador/escena-naturista-generada-v1.jpg), con
// las DOS etiquetas reales: la de la caja y, por primera vez en un frasco redondo, la
// de las cápsulas. En el frasco no va la foto completa (la tapa salía doble y el frasco
// más ancho) sino la banda impresa, sin la tapa, el pie ni los bordes que curvan: el
// frasco está casi de frente y calza (39 puntos, 1,3 px). Lo que queda detrás del vaso
// de agua no se pinta: el reflejo de la etiqueta a través del agua es el de la escena.
//   python3 scripts/hablador-reetiquetar-caja.py docs/hablador/escena-naturista-generada-v1.jpg \
//     /tmp/caja.jpg --sin-taza --desenfoque 0.6 --zona 600 950 520 1150
//   python3 scripts/hablador-reetiquetar-caja.py /tmp/caja.jpg public/images/hablador/escena-naturista-v1.jpg \
//     --sin-taza --sin-costado --desenfoque 0.6 --min-puntos 25 --zona 1150 1250 450 900 \
//     --etiqueta <capsulas-ganoderma.png recortada a [318:752, 40:420]> \
//     --delante <el vaso: rectángulo 1330,1715 → 1600,2060>
// (El Cordygold del gimnasio lleva la banda de su etiqueta del mismo modo, [310:732, 75:355].)
// La máscara de objetos: la caja (de la primera pasada), el hongo y la tela dibujados a
// mano (GrabCut se llevaba la mesa del fondo), el frasco con GrabCut y el vaso, que es
// transparente, como un trapecio. Los productos van abajo y a lo ancho: el QR va arriba
// a la izquierda, sobre el hongo, donde la escena es negra.
const NATURISTA = {
  escena: join(RAIZ, 'public/images/hablador/escena-naturista-v1.jpg'),
  objetos: join(RAIZ, 'public/images/hablador/escena-naturista-v1-objetos.png'),
  ancho: 100, arriba: 0, izq: -1, elipse: { cx: 0.50, cy: 0.71, rx: 0.62, ry: 0.24 },
};

async function escenaGanocafe({ ancho = ESCENA_ANCHO, arriba = ESCENA_ARRIBA, izq = ESCENA_IZQ, escena = ESCENA, objetos = OBJETOS,
  elipse = { cx: 0.53, cy: 0.70, rx: 0.50, ry: 0.27 }, derecha = [0.95, 1] } = {}) {
  const { data: e, info: ie } = await sharp(escena).resize({ width: mm(ancho) }).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const obj = await sharp(objetos).resize({ width: ie.width, height: ie.height, fit: 'fill' })
    .blur(mm(0.8)).extractChannel(0).raw().toBuffer();
  // La mesa se apaga en una elipse centrada en los dos objetos, como la caída de una
  // luz puntual: con un fundido rectangular se veía el borde de la foto.
  for (let y = 0; y < ie.height; y++) {
    const v = y / ie.height;
    for (let x = 0; x < ie.width; x++) {
      const u = x / ie.width;
      const d = Math.hypot((u - elipse.cx) / elipse.rx, (v - elipse.cy) / elipse.ry);
      const borde = suave(0, 0.05, u) * (1 - suave(derecha[0], derecha[1], u)) * (1 - suave(0.93, 0.99, v));
      const mesa = 1 - suave(0.80, 1.05, d);
      e[(y * ie.width + x) * 4 + 3] = Math.round(255 * borde * Math.max(mesa, obj[y * ie.width + x] / 255));
    }
  }
  return {
    input: await sharp(e, { raw: { width: ie.width, height: ie.height, channels: 4 } }).png().toBuffer(),
    left: mm(izq + 3), top: mm(arriba + 3),
  };
}

// `node scripts/componer-fondo-hablador.mjs usa` compone solo los fondos cuyo nombre
// contiene «usa» (o «salon», «gimnasio», «naturista»): así un fondo nuevo no reescribe los que ya
// están publicados.
const SOLO = process.argv[2];
const toca = (archivo) => !SOLO || archivo.includes(SOLO);

mkdirSync(DESTINO, { recursive: true });
for (const [archivo, fondo, capas] of [
  ['fondo-cafe-v1.jpg', FONDO, () => [{ input: visible, left: Math.max(0, IZQ), top: Math.max(0, ARRIBA) }]],
  ['fondo-cafe-ganocafe-v3.jpg', { r: 0, g: 0, b: 0 }, async () => [await escenaGanocafe()]],
  ['fondo-cafe-ganocafe-grande-v1.jpg', { r: 0, g: 0, b: 0 }, async () => [await escenaGanocafe(GRANDE)]],
  ['fondo-cafe-ganocafe-usa-v1.jpg', { r: 0, g: 0, b: 0 }, async () => [await escenaGanocafe(USA)]],
  ['fondo-salon-v1.jpg', { r: 0, g: 0, b: 0 }, async () => [await escenaGanocafe(SALON)]],
  ['fondo-gimnasio-v1.jpg', { r: 0, g: 0, b: 0 }, async () => [await escenaGanocafe(GIMNASIO)]],
  ['fondo-naturista-v1.jpg', { r: 0, g: 0, b: 0 }, async () => [await escenaGanocafe(NATURISTA)]],
]) {
  if (!toca(archivo)) continue;
  const salida = join(DESTINO, archivo);
  await sharp({ create: { width: W, height: H, channels: 3, background: fondo } })
    .composite(await capas())
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .withMetadata({ density: 300 })
    .toFile(salida);
  console.log(`✅ ${salida.replace(RAIZ + '/', '')} · ${W} × ${H} px (106 × 156 mm a 300 ppp)`);
}

// ── El fondo del PDF de imprenta (/hablador/{slug}/pdf), en CMYK ───────────────
// Lo convierte scripts/hablador-fondo-cmyk.py (lcms, intención perceptual) con el perfil
// ISO Coated v2 300 % (FOGRA39, papel estucado). El perfil (ECI, de libre distribución)
// no va en el repo: viene en el paquete icc-profiles de Ubuntu
// (`apt-get download icc-profiles && dpkg-deb -x icc-profiles_*.deb x`) o en eci.org.
// ⛔ Sin el perfil no se genera: un CMYK sin perfil deja el negro con amarillo.
const ICC = process.env.ICC_CMYK || '/usr/share/color/icc/ISOcoated_v2_300_eci.icc';
if (existsSync(ICC)) {
  for (const [rgb, cmyk] of [
    ['fondo-cafe-ganocafe-grande-v1.jpg', 'fondo-ganocafe-grande-cmyk-v1.jpg'],
    ['fondo-cafe-ganocafe-usa-v1.jpg', 'fondo-ganocafe-usa-cmyk-v1.jpg'],
    ['fondo-salon-v1.jpg', 'fondo-salon-cmyk-v1.jpg'],
    ['fondo-gimnasio-v1.jpg', 'fondo-gimnasio-cmyk-v1.jpg'],
    ['fondo-naturista-v1.jpg', 'fondo-naturista-cmyk-v1.jpg'],
  ]) {
    if (!toca(rgb)) continue;
    execFileSync('python3', [
      join(RAIZ, 'scripts/hablador-fondo-cmyk.py'),
      join(DESTINO, rgb),
      join(RAIZ, 'src/app/hablador/[slug]/pdf', cmyk),
      ICC,
    ], { stdio: 'inherit' });
  }
} else {
  console.warn(`⚠️ Sin el perfil CMYK en ${ICC} (ICC_CMYK=…): el fondo del PDF no se regeneró.`);
}
