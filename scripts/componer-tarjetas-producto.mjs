/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Compone la tarjeta de cada producto para el enlace directo
 * /productos/{slug}/{producto} (29 oct 2026): la que sale debajo del enlace en
 * WhatsApp, Facebook o una historia de Instagram. 1200×630, JPG.
 *
 * Es la foto real del producto (el recorte limpio de la vitrina,
 * public/productos/_set/limpios) sobre el crema de la tienda, con una sombra de
 * contacto para que no flote. Centrada: WhatsApp a veces recorta la vista previa
 * a un cuadrado del centro (x 285–915), y el producto cabe ahí.
 *
 * ⚠️ SIN TEXTO NI PRECIO, como la tarjeta del catálogo (componer-tarjeta-catalogo.mjs):
 * el nombre y la descripción viajan debajo de la imagen, y un precio viejo en
 * una imagen que circula no se puede retirar.
 *
 * Las promociones de Gano no llevan tarjeta: son temporales y no tienen enlace directo.
 * La versión del nombre sale de src/app/productos/og.ts.
 *
 * node scripts/componer-tarjetas-producto.mjs
 */
import sharp from 'sharp';
import { readFileSync, readdirSync, mkdirSync, statSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIMPIOS = join(RAIZ, 'public/productos/_set/limpios');
const DESTINO = join(RAIZ, 'public/productos/tarjetas');
const W = 1200, H = 630;
const FONDO = { r: 0xF7, g: 0xF2, b: 0xEA };  // --t-fondo de la tienda
const ALTO = 470, ANCHO = 600;                // el producto, sin pasar de aquí
const BASE = 560;                             // donde apoya

function version() {
  const m = readFileSync(join(RAIZ, 'src/app/productos/og.ts'), 'utf8').match(/VERSION_TARJETAS_PRODUCTO = '(v\d+)'/);
  if (!m) throw new Error('No encontré VERSION_TARJETAS_PRODUCTO en src/app/productos/og.ts');
  return m[1];
}

// Los mismos archivos que usa imagenVitrina() en catalogo-datos.ts.
const fuentes = readdirSync(LIMPIOS).filter((f) => f.endsWith('.png')).map((f) => [f.replace(/\.png$/, ''), join(LIMPIOS, f)]);
fuentes.push(['maquina-luvoco', join(RAIZ, 'public/productos/luvoco/luvoco55-1-1024x1024.png')]);

mkdirSync(DESTINO, { recursive: true });
const v = version();

for (const [id, archivo] of fuentes) {
  if (!existsSync(archivo)) throw new Error(`Falta la foto de ${id}: ${archivo}`);
  const producto = await sharp(archivo).trim().resize({ width: ANCHO, height: ALTO, fit: 'inside' }).png().toBuffer();
  const { width: pw, height: ph } = await sharp(producto).metadata();

  // La sombra: una elipse difusa bajo la base, un poco más ancha que el producto.
  const sw = Math.round(pw * 1.15), sh = 46;
  const sombra = await sharp(Buffer.from(
    `<svg width="${sw + 80}" height="${sh + 80}" xmlns="http://www.w3.org/2000/svg">
       <ellipse cx="${(sw + 80) / 2}" cy="${(sh + 80) / 2}" rx="${sw / 2}" ry="${sh / 2}" fill="rgb(70,50,30)" fill-opacity="0.22"/>
     </svg>`,
  )).blur(14).png().toBuffer();

  const salida = join(DESTINO, `${id}-${v}.jpg`);
  await sharp({ create: { width: W, height: H, channels: 3, background: FONDO } })
    .composite([
      { input: sombra, left: Math.round(W / 2 - (sw + 80) / 2), top: Math.round(BASE - (sh + 80) / 2) },
      { input: producto, left: Math.round(W / 2 - pw / 2), top: BASE - ph },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(salida);
  console.log(`✅ ${id}-${v}.jpg  ${(statSync(salida).size / 1024).toFixed(0)} KB`);
}
console.log(`\n${fuentes.length} tarjetas en public/productos/tarjetas/`);
