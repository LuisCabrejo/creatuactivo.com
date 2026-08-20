/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Imágenes de producto para WhatsApp — reconocimiento y pie de foto.
 *
 * POR QUÉ EXISTE: pedir la foto de un producto es de lo más común en el canal
 * —"¿me manda la del café?"— y hasta ahora Queswa solo podía describirlo. Una
 * descripción no se reenvía; una foto sí, y la persona la comparte con quien
 * decide la compra.
 *
 * ⚠️ **EL PIE DE FOTO NO LLEVA DECLARACIONES DE SALUD, Y ESO ES DELIBERADO.**
 * Una imagen con texto sobrepuesto o un pie que prometa un efecto es
 * *publicidad de producto*, no conversación: la SIC la juzga con la vara de la
 * etiqueta, y Meta rechaza el par imagen+claim mucho más duro que una frase
 * suelta en un chat. El pie lleva solo lo que nadie puede discutir: **nombre,
 * presentación, precio y registro sanitario**. Ese registro es además el mejor
 * argumento que tenemos — un número verificable vence a cualquier adjetivo
 * (doctrina del 8 ago 2026), y aquí llega gratis.
 *
 * Si alguien pregunta para qué sirve, eso lo responde el catálogo por texto,
 * con el vocabulario que el guardarraíl de salud ya vigila. La foto identifica;
 * el texto explica. No se mezclan.
 *
 * Fuente de los datos: `src/app/sistema/productos/catalogo-productos.tsx`
 * (precio, registro INVIMA e imagen). Si allá cambia un precio, cambia aquí.
 */

export interface ProductoWA {
  slug: string
  nombre: string
  precioCOP: number
  /** Vacío cuando el producto es unitario (un jabón, la máquina). */
  presentacion: string
  /** Registro sanitario o certificado — el dato verificable del pie de foto. */
  invima: string
  /** Ruta pública; se sirve desde creatuactivo.com. */
  imagen: string
  /** Cómo lo nombra la gente en el chat, sin tildes y en minúscula. */
  alias: string[]
}

export const PRODUCTOS_WA: ProductoWA[] = [
  {
    slug: 'ganocafe-3-en-1',
    nombre: 'Ganocafé 3 en 1',
    precioCOP: 110900,
    presentacion: 'caja de 20 sobres',
    invima: 'SD2012-0002589',
    imagen: '/productos/bebidas/ganocafe-3-en-1-gano-excel-min.png',
    alias: ['3 en 1', '3en1', 'tres en uno', 'ganocafe 3', 'cafe 3 en 1'],
  },
  {
    slug: 'ganocafe-clasico',
    nombre: 'Ganocafé Clásico',
    precioCOP: 110900,
    presentacion: 'caja de 30 sobres',
    invima: 'SD2013-0002947',
    imagen: '/productos/bebidas/gano-cafe-clasico-gano-excel-min.png',
    alias: ['clasico', 'classic', 'cafe negro', 'negrito', 'cafe puro'],
  },
  {
    slug: 'ganorico-latte-rico',
    nombre: 'Ganorico Latte Rico',
    precioCOP: 119900,
    presentacion: 'caja de 20 sobres',
    invima: 'NSA-0012966-2022',
    imagen: '/productos/bebidas/latte-rico-gano-excel-min.png',
    alias: ['latte', 'late rico', 'latte rico'],
  },
  {
    slug: 'ganorico-mocha-rico',
    nombre: 'Ganorico Mocha Rico',
    precioCOP: 119900,
    presentacion: 'caja de 20 sobres',
    invima: 'NSA-0012965-2022',
    imagen: '/productos/bebidas/mocha-rico-gano-excel-min.png',
    alias: ['mocha', 'moka', 'mocha rico'],
  },
  {
    slug: 'ganorico-shoko-rico',
    nombre: 'Ganorico Shoko Rico',
    precioCOP: 124900,
    presentacion: 'caja de 20 sobres',
    invima: 'NSA-0012964-2022',
    imagen: '/productos/bebidas/shoko-rico-gano-excel-min.png',
    alias: ['shoko', 'choko', 'shoko rico', 'chocolate de los ninos'],
  },
  {
    slug: 'espirulina-gano-creal',
    nombre: 'Espirulina Gano C\'real',
    precioCOP: 119900,
    presentacion: 'caja de 15 sobres',
    invima: 'NSA-0012963-2022',
    imagen: '/productos/bebidas/ganocereal-spirulina-min.png',
    alias: ['espirulina', 'spirulina', 'cereal', 'c real', 'gano creal'],
  },
  {
    slug: 'bebida-oleaf-gano-rooibos',
    nombre: 'Bebida de Oleaf Gano Rooibos',
    precioCOP: 119900,
    presentacion: 'caja de 20 sobres',
    invima: 'NSA-0012962-2022',
    imagen: '/productos/bebidas/le-rooibos-gano-excel-min.png',
    alias: ['rooibos', 'oleaf', 'el te', 'te rojo', 'te de la linea'],
  },
  {
    slug: 'gano-schokoladde',
    nombre: 'Gano Schokoladde',
    precioCOP: 124900,
    presentacion: 'caja de 20 sobres',
    invima: 'NSA-0012961-2022',
    imagen: '/productos/bebidas/gano-schokolade-gano-excel-min.png',
    alias: ['schokolade', 'chocolate', 'gano chocolate'],
  },
  {
    slug: 'bebida-colageno-reskine',
    nombre: 'Bebida de Colágeno Reskine',
    precioCOP: 216900,
    presentacion: 'caja de 10 sachets',
    invima: 'NSA-0012959-2022',
    imagen: '/productos/bebidas/gano-plus-reskine-collagen-drink-gano-excel-min.png',
    alias: ['reskine', 'colageno', 'colageno reskine'],
  },
  {
    slug: 'capsulas-ganoderma',
    nombre: 'Cápsulas De Ganoderma',
    precioCOP: 272500,
    presentacion: 'frasco de 90 cápsulas',
    invima: 'SD2013-0002860',
    imagen: '/productos/suplementos/capsulas-de-ganoderma-gano-excel-min.png',
    alias: ['capsulas de ganoderma', 'ganoderma en capsulas', 'capsulas ganoderma'],
  },
  {
    slug: 'capsulas-excellium',
    nombre: 'Cápsulas Excellium',
    precioCOP: 272500,
    presentacion: 'frasco de 90 cápsulas',
    invima: 'NSA-0012958-2022',
    imagen: '/productos/suplementos/capsulas-de-excellium-gano-excel-min.png',
    alias: ['excellium', 'excelium', 'exelium'],
  },
  {
    slug: 'capsulas-cordygold',
    nombre: 'Cápsulas Cordygold',
    precioCOP: 336900,
    presentacion: 'frasco de 90 cápsulas',
    invima: 'NSA-0012957-2022',
    imagen: '/productos/suplementos/capsulas-de-cordy-gold-gano-excel-min.png',
    alias: ['cordygold', 'cordy gold', 'cordigold', 'cordyceps', 'cortigol'],
  },
  {
    slug: 'pasta-dientes-gano-fresh',
    nombre: 'Pasta de Dientes Gano Fresh',
    precioCOP: 73900,
    presentacion: '',
    invima: 'NSOC58855-14CO',
    imagen: '/productos/cuidado-personal/gano-fresh-gano-excel-min.png',
    alias: ['gano fresh', 'pasta de dientes', 'crema dental', 'pasta dental'],
  },
  {
    slug: 'jabon-gano',
    nombre: 'Jabón Gano',
    precioCOP: 73900,
    presentacion: '',
    invima: 'NSOC99970-20CO',
    imagen: '/productos/cuidado-personal/gano-jabon-gano-excel-min.png',
    alias: ['jabon gano', 'jabon de ganoderma'],
  },
  {
    slug: 'jabon-transparente-gano',
    nombre: 'Jabón Transparente Gano',
    precioCOP: 78500,
    presentacion: '',
    invima: 'NSO09915-21CO',
    imagen: '/productos/cuidado-personal/jabon-transparent-soap-gano-excel-min.png',
    alias: ['jabon transparente', 'transparent soap'],
  },
  {
    slug: 'champu-piel-brillo',
    nombre: 'Champú Piel&brillo',
    precioCOP: 73900,
    presentacion: '',
    invima: 'NSOC96485-19CO',
    imagen: '/productos/cuidado-personal/shampoo-p&b-gano-excel-min.png',
    alias: ['shampoo', 'champu', 'piel y brillo shampoo'],
  },
  {
    slug: 'acondicionador-piel-brillo',
    nombre: 'Piel&brillo Acondicionador',
    precioCOP: 73900,
    presentacion: '',
    invima: 'NSOC96486-19CO',
    imagen: '/productos/cuidado-personal/acondicionador-p&b-gano-excel-min.png',
    alias: ['acondicionador'],
  },
  {
    slug: 'exfoliante-piel-brillo',
    nombre: 'Piel&brillo Exfoliante Corporal',
    precioCOP: 73900,
    presentacion: '',
    invima: 'NSOC96487-19CO',
    imagen: '/productos/cuidado-personal/exfoliante-p&b-gano-excel-min.png',
    alias: ['exfoliante', 'scrub'],
  },
  {
    slug: 'maquina-luvoco',
    nombre: 'Máquina de Café Luvoco',
    precioCOP: 1026000,
    presentacion: '',
    invima: 'Certificado CE - Dispositivo',
    imagen: '/productos/luvoco/maquina-luvoco-gano-excel-min.png',
    alias: ['maquina luvoco', 'cafetera', 'maquina de cafe', 'luvoco maquina'],
  },
  {
    slug: 'luvoco-suave',
    nombre: 'Luvoco Cápsulas Suave X15',
    precioCOP: 110900,
    presentacion: 'caja de cápsulas',
    invima: 'NSA-0012955-2022',
    imagen: '/productos/luvoco/luvoco-suave-gano-excel-min.png',
    alias: ['luvoco suave', 'capsula suave'],
  },
  {
    slug: 'luvoco-medio',
    nombre: 'Luvoco Cápsulas Medio X15',
    precioCOP: 110900,
    presentacion: 'caja de cápsulas',
    invima: 'NSA-0012954-2022',
    imagen: '/productos/luvoco/luvoco-medio-gano-excel-min.png',
    alias: ['luvoco medio', 'capsula media'],
  },
  {
    slug: 'luvoco-fuerte',
    nombre: 'Luvoco Cápsulas Fuerte X15',
    precioCOP: 110900,
    presentacion: 'caja de cápsulas',
    invima: 'NSA-0012953-2022',
    imagen: '/productos/luvoco/luvoco-fuerte-gano-excel-min.png',
    alias: ['luvoco fuerte', 'capsula fuerte'],
  },];

/** Sin tildes, minúsculas y sin puntuación: como llega un mensaje de WhatsApp. */
function normalizar(t: string): string {
  return t.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * ¿La persona está pidiendo una imagen?
 *
 * Se exige que lo PIDA. Mandar la foto porque el producto se mencionó convierte
 * la conversación en un catálogo que dispara solo, y en un canal donde cada
 * envío cuesta reputación con Meta eso es exactamente lo que no se hace.
 */
export function pideImagen(texto: string): boolean {
  return /\b(foto|fotos|imagen|imagenes|imágenes|pantallazo|c[oó]mo se ve|c[oó]mo es|mu[eé]streme|ens[eé][ñn]eme|man?d[eé]me|env[ií]eme|p[aá]seme|quiero ver|d[eé]jeme ver)\b/i.test(texto);
}

/**
 * El producto que nombra el texto. Devuelve null si no nombra ninguno o si
 * nombra varios: dos productos en una frase ("café y las cápsulas") es una
 * pregunta de categoría, y ahí la respuesta correcta es la tabla, no una foto
 * arbitraria de las dos.
 */
export function detectarProducto(texto: string): ProductoWA | null {
  const t = normalizar(texto);
  const encontrados = new Set<ProductoWA>();

  for (const p of PRODUCTOS_WA) {
    const claves = [normalizar(p.nombre), ...p.alias.map(normalizar)];
    // Se ordena por longitud: "luvoco fuerte" debe ganarle a "luvoco".
    if (claves.some((k) => k.length >= 4 && t.includes(k))) encontrados.add(p);
  }

  if (encontrados.size === 0) return null;
  if (encontrados.size === 1) return [...encontrados][0];

  // Varios candidatos: si uno es más específico que otro y lo contiene, gana el
  // específico ("luvoco fuerte" contiene "luvoco"). Si no, es ambiguo.
  const lista = [...encontrados];
  const masEspecifico = lista.reduce((a, b) =>
    (normalizar(b.nombre).length > normalizar(a.nombre).length ? b : a));
  const resto = lista.filter((p) => p !== masEspecifico);
  const contenido = resto.every((p) =>
    normalizar(masEspecifico.nombre).includes(normalizar(p.nombre))
    || masEspecifico.alias.some((a) => p.alias.some((b) => normalizar(a).includes(normalizar(b)))));
  return contenido ? masEspecifico : null;
}

const cop = (n: number) => `$${n.toLocaleString('es-CO')} COP`;

/**
 * Pie de foto: identificación y precio. Nada más — ver la nota de arriba.
 *
 * El precio va en COP porque el canal atiende sobre todo a Colombia; para otros
 * países la conversación ya viene con la moneda aclarada y el precio local lo
 * confirma la oficina, así que aquí no se inventa una cifra.
 */
export function pieDeFoto(p: ProductoWA, incluirPrecio = true): string {
  const partes = [`*${p.nombre}*`];
  if (p.presentacion) partes.push(p.presentacion);
  const cabeza = partes.join(' · ');
  const precio = incluirPrecio ? `\n${cop(p.precioCOP)}` : '';
  const registro = p.invima
    ? `\n\n${/certificado/i.test(p.invima) ? p.invima : `Registro sanitario INVIMA ${p.invima}`}`
    : '';
  return `${cabeza}${precio}${registro}`;
}

/** URL absoluta de la imagen — Meta la descarga, así que debe ser pública. */
export function urlImagen(p: ProductoWA, base = 'https://creatuactivo.com'): string {
  return `${base}${p.imagen}`;
}
