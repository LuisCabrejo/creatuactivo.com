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
 * Fuente de los datos: `src/app/productos/catalogo-productos.tsx`
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
    // «El capuchino» es como mucha gente pide el 3 en 1 (Director, 31 ago 2026):
    // lleva crema y azúcar, y ese es el nombre de cafetería que le queda.
    alias: ['3 en 1', '3en1', 'tres en uno', 'ganocafe 3', 'cafe 3 en 1', 'capuchino', 'capucino', 'cappuccino', 'capuccino'],
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
    nombre: 'Espirulina Gano C\'Real',
    precioCOP: 119900,
    presentacion: 'caja de 15 sobres',
    invima: 'NSA-0012963-2022',
    imagen: '/productos/bebidas/ganocereal-spirulina-min.png',
    alias: ['espirulina', 'spirulina', 'cereal', 'c real', 'gano creal'],
  },
  {
    slug: 'bebida-oleaf-gano-rooibos',
    nombre: 'Oleaf Gano Rooibos',
    precioCOP: 119900,
    presentacion: 'caja de 20 sobres',
    invima: 'NSA-0012962-2022',
    imagen: '/productos/bebidas/te-rooibos-gano-excel-min.png',
    alias: ['rooibos', 'oleaf', 'el te', 'te rojo', 'te de la linea'],
  },
  {
    slug: 'gano-schokoladde',
    nombre: 'Gano Schokolade',
    precioCOP: 124900,
    presentacion: 'caja de 20 sobres',
    invima: 'NSA-0012961-2022',
    imagen: '/productos/bebidas/gano-schokolade-gano-excel-min.png',
    // 'schokolad' (sin la e) también casa con «Schokoladde», la doble d con la
    // que el catálogo web escribe el nombre — es lo que llega del carrito.
    alias: ['schokolade', 'schokolad', 'chocolate', 'gano chocolate'],
  },
  {
    slug: 'bebida-colageno-reskine',
    nombre: 'Reskine Colágeno',
    precioCOP: 216900,
    presentacion: 'caja de 10 sachets',
    invima: 'NSA-0012959-2022',
    imagen: '/productos/bebidas/gano-plus-reskine-collagen-drink-gano-excel-min.png',
    alias: ['reskine', 'colageno', 'colageno reskine'],
  },
  {
    slug: 'capsulas-ganoderma',
    nombre: 'Cápsulas de Ganoderma',
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
    nombre: 'Gano Fresh · Pasta de Dientes',
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
    nombre: 'Champú Piel&Brillo',
    precioCOP: 73900,
    presentacion: '',
    invima: 'NSOC96485-19CO',
    imagen: '/productos/cuidado-personal/shampoo-p&b-gano-excel-min.png',
    alias: ['shampoo', 'champu', 'piel y brillo shampoo'],
  },
  {
    slug: 'acondicionador-piel-brillo',
    nombre: 'Acondicionador Piel&Brillo',
    precioCOP: 73900,
    presentacion: '',
    invima: 'NSOC96486-19CO',
    imagen: '/productos/cuidado-personal/acondicionador-p&b-gano-excel-min.png',
    alias: ['acondicionador'],
  },
  {
    slug: 'exfoliante-piel-brillo',
    nombre: 'Exfoliante Corporal Piel&Brillo',
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
    imagen: '/productos/luvoco/luvoco55-1-1024x1024.png',
    alias: ['maquina luvoco', 'cafetera', 'maquina de cafe', 'luvoco maquina'],
  },
  {
    slug: 'luvoco-suave',
    nombre: 'Luvoco Suave · 15 cápsulas',
    precioCOP: 110900,
    presentacion: 'caja de cápsulas',
    invima: 'NSA-0012955-2022',
    imagen: '/productos/luvoco/luvoco-suave-gano-excel-min.png',
    // 'capsulas suave' con s: el carrito web manda «LUVOCO CÁPSULAS SUAVE x15».
    alias: ['luvoco suave', 'capsula suave', 'capsulas suave'],
  },
  {
    slug: 'luvoco-medio',
    nombre: 'Luvoco Medio · 15 cápsulas',
    precioCOP: 110900,
    presentacion: 'caja de cápsulas',
    invima: 'NSA-0012954-2022',
    imagen: '/productos/luvoco/luvoco-medio-gano-excel-min.png',
    alias: ['luvoco medio', 'capsula media', 'capsulas medio'],
  },
  {
    slug: 'luvoco-fuerte',
    nombre: 'Luvoco Fuerte · 15 cápsulas',
    precioCOP: 110900,
    presentacion: 'caja de cápsulas',
    invima: 'NSA-0012953-2022',
    imagen: '/productos/luvoco/luvoco-fuerte-gano-excel-min.png',
    alias: ['luvoco fuerte', 'capsula fuerte', 'capsulas fuerte'],
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
  // Un sustantivo de imagen pide la foto por sí solo.
  if (/\b(foto|fotos|imagen|imagenes|imágenes|pantallazo|c[oó]mo se ve)\b/i.test(texto)) return true;
  // Un verbo de mostrar o un «cómo es» solo cuentan si el MISMO mensaje nombra
  // un producto o una línea. Sin eso, «cómo es eso, dame contexto» y «cómo es la
  // ganancia por paquetes» recibían la foto del café que la persona acababa de
  // pedir, sacado del hilo, y el turno se cerraba ahí (prueba del 29 ago 2026).
  const verboDebil = /\b(c[oó]mo es|mu[eé]streme|ens[eé][ñn]eme|man?d[eé]me|env[ií]eme|p[aá]seme|quiero ver|d[eé]jeme ver)\b/i.test(texto);
  return verboDebil && (detectarProducto(texto) !== null || detectarFamilia(texto) !== null);
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

/**
 * El producto del que trata la conversación, cuando el mensaje no lo nombra.
 *
 * "dame una imagen" a secas es la forma normal de pedirla después de haber
 * preguntado por un producto — y hasta ahora caía al motor, que respondía que no
 * podía enviar imágenes (prueba del 20 ago). El producto está en el hilo.
 *
 * Manda lo que dijo la PERSONA, no lo que dijo el bot: si ella preguntó por el
 * Clásico y el bot contestó hablando de otro, lo que se le debe mostrar es lo
 * que ella pidió.
 */
export function productoDelHilo(
  historial: { role: string; content: string }[],
  ventana = 8,
): ProductoWA | null {
  const ultimos = historial.slice(-ventana);
  for (const m of [...ultimos].reverse()) {
    if (m.role !== 'user') continue;
    const p = detectarProducto(m.content);
    if (p) return p;
  }
  for (const m of [...ultimos].reverse()) {
    if (m.role === 'user') continue;
    const p = detectarProducto(m.content);
    if (p) return p;
  }
  return null;
}

const cop = (n: number) => `$${n.toLocaleString('es-CO')} COP`;

/**
 * Pie de foto: identificación y precio. Nada más — ver la nota de arriba.
 *
 * El precio va en COP porque el canal atiende sobre todo a Colombia; para otros
 * países la conversación ya viene con la moneda aclarada y el precio local lo
 * confirma la oficina, así que aquí no se inventa una cifra.
 */
export function pieDeFoto(p: ProductoWA, seguimiento?: string): string {
  // La presentación se omite cuando el nombre ya la dice ("Luvoco Suave · 15
  // cápsulas" no necesita "caja de cápsulas" al lado).
  const repite = p.presentacion && p.nombre.toLowerCase().includes(p.presentacion.split(' ').pop()!.toLowerCase());
  const cabeza = p.presentacion && !repite ? `*${p.nombre}* · ${p.presentacion}` : `*${p.nombre}*`;

  // Precio y registro en UNA línea: el pie se recorta tras unos renglones y
  // detrás de "Leer más" se pierde justo lo que va al final. Con esto la
  // pregunta cabe sin empujar nada.
  const datos = [cop(p.precioCOP)];
  if (p.invima) datos.push(/certificado/i.test(p.invima) ? p.invima : `INVIMA ${p.invima}`);

  // ⚠️ La pregunta viaja DENTRO del pie, no en un mensaje aparte. Enviada
  // suelta llegaba ANTES que la imagen —Meta tarda en descargar la foto de la
  // URL— y la persona la leía antes de ver el producto (prueba del 20 ago).
  // Aquí queda donde siempre va: al final del texto.
  const pregunta = seguimiento ? `\n\n${seguimiento}` : '';

  return `${cabeza}\n${datos.join(' · ')}${pregunta}`;
}

/**
 * ¿El mensaje pide SOLO la foto, o pide foto y además pregunta algo?
 *
 * "dame una imagen del excellium" → solo la foto, y el webhook la responde
 * entero. "mándeme la foto y cuánto cuesta" → hay una pregunta detrás, y eso lo
 * contesta el motor.
 */
export function esSoloPedidoDeImagen(texto: string): boolean {
  if (!pideImagen(texto)) return false;
  // Lo que delata que hay una pregunta además de la foto.
  return !/cu[aá]nto|precio|vale|cuesta|para\s+qu[eé]|c[oó]mo\s+se|sirve|beneficio|qu[eé]\s+(trae|tiene|contiene|es)|ingredient|compos|dosis|se\s+toma|diferencia/i.test(texto);
}

/**
 * La pregunta con la que se cierra el turno de la foto.
 *
 * Va dictada por el backend y no por el modelo, porque el modelo no sabe que la
 * foto salió: en la prueba del 20 ago respondió *"por este canal no puedo enviar
 * imágenes"* justo debajo de la imagen que acababa de recibir la persona, y
 * remató ofreciendo OTRO producto.
 *
 * Y cambia según lo que ya pasó en la conversación: a quien apenas pidió la
 * foto se le ofrece conocer el producto; a quien ya se lo explicaron antes,
 * repetirle la oferta sería no estar leyendo el hilo — se le ofrece el resto de
 * la línea.
 */
export function seguimientoFoto(p: ProductoWA, yaExplicado: boolean): string {
  // La oferta nombra la FAMILIA, no "la línea" a secas: "los demás productos de
  // la línea" no le dice al buscador qué tabla traer, y cuando la persona
  // aceptó, el modelo compuso una lista donde inventó el "Ganocafé Negro" (21
  // ago). Nombrada la familia, la ruta de categoría la reconoce y entrega la
  // tabla con candado.
  if (yaExplicado) {
    if (/\/bebidas\//.test(p.imagen)) return '¿Le muestro las demás bebidas de la línea?';
    if (/\/suplementos\//.test(p.imagen)) return '¿Le muestro los otros suplementos de la línea?';
    if (/\/cuidado-personal\//.test(p.imagen)) return '¿Le muestro el resto de la línea de cuidado personal?';
    return '¿Le cuento cómo funciona la máquina Luvoco?';
  }

  // El verbo sale de la categoría, que va en la ruta de la imagen: un jabón no
  // se toma y una máquina de café no se prepara. Y el nombre no entra en la
  // frase — "el Cápsulas Excellium" chirría, y los nombres con · no caben en
  // una oración. La foto acaba de salir: el producto ya está nombrado.
  const verbo = /\/cuidado-personal\//.test(p.imagen) ? 'cómo se usa'
    : /maquina-luvoco/.test(p.slug) ? 'cómo funciona'
    : /\/luvoco\//.test(p.imagen) ? 'cómo se prepara'
    : 'cómo se toma';
  return `¿Le cuento qué trae y ${verbo}?`;
}

/**
 * URL absoluta de la imagen que se envía — Meta la descarga, así que debe ser
 * pública y sin autenticación.
 *
 * Se sirve la COMPUESTA (`/productos/compuestas/{slug}.jpg`): el producto sobre
 * el set de la marca, a 1080×1080. El PNG suelto sobre blanco de `p.imagen` es
 * el activo del catálogo web, y en un chat se ve como un recorte de tienda —
 * medido en 2026: en superficies propias de marca la imagen de ambiente
 * convierte cerca de un 30% más que el fondo blanco, que solo gana como foto
 * ancla de marketplace.
 *
 * Las compuestas las genera `scripts/componer-imagenes-producto.mjs`. Si falta
 * alguna, esto igual devuelve su URL y Meta responderá error: el webhook lo
 * registra y la conversación sigue sin la foto.
 */
export function urlImagen(p: ProductoWA, base = 'https://creatuactivo.com'): string {
  return `${base}/productos/compuestas/${p.slug}.jpg`;
}

// ═══════════════════════════════════════════════════════════════════════════
// FAMILIAS — la foto de una línea entera, o del portafolio completo
// ═══════════════════════════════════════════════════════════════════════════
//
// Las cinco imágenes de familia viven junto a las individuales en
// `public/productos/compuestas/` (las genera `scripts/componer-imagenes-
// categoria.mjs`): una por categoría y `portafolio.jpg` con los 22 sobre tres
// estantes. Se envían cuando la persona pide VER la línea —"muéstreme las
// bebidas", "foto de todos los productos"— o cuando acepta la oferta con la que
// cerró el turno anterior ("¿le muestro las demás bebidas de la línea?" → "sí").
//
// ⚠️ No confundir con el CATÁLOGO: quien pide "el catálogo" o "la página de
// productos" recibe el ENLACE con el ref del socio (`pideEnlaceCatalogo` en
// wa-onboarding.ts, que el webhook evalúa antes que esto). La imagen es para
// mirar en el chat; el catálogo es para comprar.

export type FamiliaWA = 'bebidas' | 'suplementos' | 'cuidado-personal' | 'luvoco' | 'portafolio';

interface FamiliaDef {
  titulo: string;
  /** Nombre del archivo en /productos/compuestas/ (sin extensión). */
  archivo: string;
  /** Categoría de la ruta de imagen de los productos que la componen; null = todos. */
  categoria: string | null;
  /** Cómo la nombra la persona (en colectivo: plural, "línea", "todos"). */
  patron: RegExp;
  /** Cómo la ofrece el bot al cerrar un turno; una aceptación corta la dispara. */
  ofrecida: RegExp | null;
  /** La pregunta que cierra el pie cuando el mensaje pidió SOLO la foto. */
  seguimiento: string;
}

export const FAMILIAS_WA: Record<FamiliaWA, FamiliaDef> = {
  // El orden importa: las específicas antes que el portafolio.
  luvoco: {
    titulo: 'Luvoco', archivo: 'categoria-luvoco', categoria: 'luvoco',
    // "la máquina luvoco" es el producto (la máquina sola); "el luvoco" a secas,
    // "la línea luvoco" o "la máquina y las cápsulas" es el sistema completo.
    patron: /(?<!m[aá]quina )(?<!m[aá]quina de )luvoco(?! (suave|medio|fuerte|m[aá]quina))|sistema luvoco|l[ií]nea luvoco|m[aá]quina y (las |sus )?c[aá]psulas|luvoco completo|todo (lo de )?luvoco/i,
    ofrecida: null,
    seguimiento: '¿Le cuento cómo funciona la máquina?',
  },
  suplementos: {
    titulo: 'Suplementos', archivo: 'categoria-suplementos', categoria: 'suplementos',
    patron: /suplementos?(?![a-záéíóúñ])|las c[aá]psulas(?! (de|suave|media|fuerte))|los (tres )?frascos|l[ií]nea de c[aá]psulas/i,
    ofrecida: /le muestro los otros suplementos/i,
    seguimiento: '¿Le cuento en qué se diferencian los tres?',
  },
  'cuidado-personal': {
    titulo: 'Cuidado Personal', archivo: 'categoria-cuidado-personal', categoria: 'cuidado-personal',
    patron: /cuidado personal|cosm[eé]tic|aseo personal|jabones|l[ií]nea (de )?(piel|belleza|cuidado|aseo)|piel ?(&|y) ?brillo|p&b|champ[uú]s|shampoos/i,
    ofrecida: /el resto de la l[ií]nea de cuidado personal/i,
    seguimiento: '¿Le cuento cómo se usa cada uno?',
  },
  bebidas: {
    titulo: 'Bebidas', archivo: 'categoria-bebidas', categoria: 'bebidas',
    patron: /bebidas?(?![a-záéíóúñ])|los caf[eé]s|l[ií]nea de (caf[eé]|bebida)|caf[eé]s y t[eé]s|t[eé]s y caf[eé]s/i,
    ofrecida: /le muestro (las dem[aá]s |las otras |las )?bebidas/i,  // «las otras» es como cierran BEB_07 y BEB_08
    seguimiento: '¿Le cuento en qué se diferencian entre ellas?',
  },
  portafolio: {
    titulo: 'Portafolio Gano Excel', archivo: 'portafolio', categoria: null,
    patron: /todos los productos|todo el portafolio|portafolio|l[ií]nea completa|gama completa|los 22|todas las l[ií]neas|los productos(?! de\s+ganoderma)|qu[eé] productos|cu[aá]les productos|productos que (tienen|manejan|venden)/i,
    ofrecida: null,
    seguimiento: '¿Cuál línea le muestro de cerca?',
  },
};

/** La familia que nombra el texto, o null. Va ANTES que `detectarProducto`. */
export function detectarFamilia(texto: string): FamiliaWA | null {
  const t = normalizar(texto);
  for (const [f, def] of Object.entries(FAMILIAS_WA) as [FamiliaWA, FamiliaDef][]) {
    if (def.patron.test(t)) return f;
  }
  return null;
}

/** La familia que el bot ofreció mostrar en su último turno, o null. */
export function familiaOfrecida(ultimoMensajeBot: string): FamiliaWA | null {
  for (const [f, def] of Object.entries(FAMILIAS_WA) as [FamiliaWA, FamiliaDef][]) {
    if (def.ofrecida && def.ofrecida.test(ultimoMensajeBot)) return f;
  }
  return null;
}

/** ¿El bot cerró preguntando cuál línea mostrar? (pie del portafolio). */
export function preguntoCualLinea(ultimoMensajeBot: string): boolean {
  return /cu[aá]l l[ií]nea le muestro/i.test(ultimoMensajeBot);
}

/** "sí", "dale", "muéstremelas": una aceptación corta y nada más. */
export function esAceptacionCorta(texto: string): boolean {
  return /^(s[ií]|claro|dale|listo|ok|bueno|por supuesto|de una|h[aá]gale|mu[eé]str[ea]me(l[ao]s)?|quiero|s[ií],? por favor|a ver|ver)(?![a-záéíóúñ])/i.test(texto.trim());
}

export function urlImagenFamilia(f: FamiliaWA, base = 'https://creatuactivo.com'): string {
  return `${base}/productos/compuestas/${FAMILIAS_WA[f].archivo}.jpg`;
}

/** Los productos que componen la familia, en el orden del catálogo. */
export function productosDeFamilia(f: FamiliaWA): ProductoWA[] {
  const cat = FAMILIAS_WA[f].categoria;
  return cat ? PRODUCTOS_WA.filter((p) => p.imagen.includes(`/${cat}/`)) : PRODUCTOS_WA;
}

/**
 * Pie de la foto de familia: la lista con precio, que es lo que la imagen no
 * lleva a propósito. Para el portafolio no caben 22 renglones detrás de "Leer
 * más": va el conteo por línea, y la pregunta invita a acercar una.
 */
export function pieDeFotoFamilia(f: FamiliaWA, seguimiento?: string): string {
  const def = FAMILIAS_WA[f];
  const pregunta = seguimiento ? `\n\n${seguimiento}` : '';
  if (f === 'portafolio') {
    const n = (c: string) => PRODUCTOS_WA.filter((p) => p.imagen.includes(`/${c}/`)).length;
    return `*${def.titulo}* · ${PRODUCTOS_WA.length} productos\n`
      + `Bebidas (${n('bebidas')}) · Luvoco (${n('luvoco')}) · Suplementos (${n('suplementos')}) · Cuidado personal (${n('cuidado-personal')})`
      + pregunta;
  }
  const lista = productosDeFamilia(f).map((p) => `${p.nombre} · ${cop(p.precioCOP)}`).join('\n');
  return `*${def.titulo}* · ${productosDeFamilia(f).length} productos\n${lista}${pregunta}`;
}
