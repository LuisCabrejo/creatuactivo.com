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
/**
 * ¿El borrador del modelo AFIRMA que no puede mandar imágenes?
 *
 * ⚠️ El motor no sabe lo que manda el webhook, y cuando una petición de foto se
 * le escapa al detector, el modelo compone la limitación por su cuenta: es lo
 * que «sabe» un modelo de texto. Las dos formas medidas en producción:
 *   · 20 ago 2026 — «por este canal no puedo enviar imágenes»
 *   · 12 sep 2026 — «las imágenes del catálogo las maneja el equipo
 *     directamente», que además se lo atribuye a otros
 *
 * Las dos son falsas: las 22 fotos de producto y las cinco de familia están en
 * el CDN. Y las dos llegaron a una persona real. Por eso hay red debajo: si el
 * borrador dice esto y el mensaje nombraba un producto o una línea, el webhook
 * lo descarta y **manda la imagen** — reemplazar por la acción correcta, no por
 * una disculpa. Es el patrón de los guardarraíles de salida, con mejor final.
 *
 * ⚠️ NO confundir con la negativa de PIEZAS publicitarias (`TEXTO_NO_PIEZAS`),
 * que es correcta y aprobada: esa habla de material para publicar, no de las
 * fotos del catálogo, y la dicta el webhook sin pasar por aquí.
 */
const RE_NIEGA_IMAGEN = [
  /no\s+(puedo|podemos|tengo forma de|es posible)\s+(enviar|mandar|compartir|adjuntar|generar|crear)\s*(le)?\s*(im[aá]genes|fotos?|archivos?)/i,
  /(solo|[uú]nicamente)\s+puedo\s+(enviar|mandar|manejar|trabajar con)\s+texto/i,
  /(im[aá]genes|fotos?)\s+(del cat[aá]logo\s+)?las\s+maneja\s+(el|directamente el)\s+equipo/i,
  /no\s+(genero|env[ií]o|manejo)\s+(im[aá]genes|fotos)/i,
  /soy\s+(una\s+)?(inteligencia artificial|ia)\s+de\s+texto/i,
  /no\s+est[aá]\s+en\s+mis?\s+manos[^.]{0,40}(im[aá]gen|foto)/i,
];

export function detectarNegativaDeImagen(texto: string): string | null {
  for (const re of RE_NIEGA_IMAGEN) {
    const m = re.exec(texto || '');
    if (m) return m[0].slice(0, 70);
  }
  return null;
}

/**
 * ¿Esta palabra QUISO decir «imagen» o «foto»?
 *
 * ⚠️ Existe porque un typo tumbó el nodo entero (12 sep 2026). El Director
 * escribió *«dame un aimgane de todos los productos»* y `pideImagen` devolvió
 * false: la familia sí se detectó (portafolio), pero sin el sustantivo el nodo
 * de la foto no disparó, el turno cayó al motor y el modelo compuso **«eso no
 * está en mis manos, las imágenes las maneja el equipo»** — que es falso, las
 * 22 fotos y las cinco de familia están en el CDN.
 *
 * La gente escribe con el pulgar y transpone letras; no se puede listar cada
 * typo, así que se mide la distancia de edición contra las formas correctas.
 * Dos operaciones cubren la transposición doble («aimgane») sin abrir la puerta
 * a otra palabra: ninguna de 5+ letras del vocabulario del canal queda a esa
 * distancia de «imagen» o «foto».
 */
function distancia(a: string, b: string): number {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      m[i][j] = Math.min(
        m[i - 1][j] + 1, m[i][j - 1] + 1,
        m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
  return m[a.length][b.length];
}

const FORMAS_IMAGEN = ['imagen', 'imagenes', 'foto', 'fotos', 'pantallazo'];

export function pareceSustantivoDeImagen(texto: string): boolean {
  for (const palabra of normalizar(texto).split(/[^a-z]+/)) {
    if (palabra.length < 4) continue;
    for (const forma of FORMAS_IMAGEN) {
      // Una palabra corta admite un error; de seis letras en adelante, dos.
      const tope = forma.length <= 5 ? 1 : 2;
      if (Math.abs(palabra.length - forma.length) <= tope && distancia(palabra, forma) <= tope) return true;
    }
  }
  return false;
}

export function pideImagen(texto: string): boolean {
  // Un sustantivo de imagen pide la foto por sí solo — aunque venga con typos.
  if (/\b(foto|fotos|imagen|imagenes|imágenes|pantallazo|c[oó]mo se ve)\b/i.test(texto)) return true;
  if (pareceSustantivoDeImagen(texto)) return true;
  // Un verbo de mostrar o un «cómo es» solo cuentan si el MISMO mensaje nombra
  // un producto o una línea. Sin eso, «cómo es eso, dame contexto» y «cómo es la
  // ganancia por paquetes» recibían la foto del café que la persona acababa de
  // pedir, sacado del hilo, y el turno se cerraba ahí (prueba del 29 ago 2026).
  const verboDebil = /\b(c[oó]mo es|mu[eé]streme|mu[eé]strame|ens[eé][ñn][ea]me|man?d[eé]me|m[aá]ndame|env[ií]e?me|p[aá]same|p[aá]seme|reg[aá]la?[em]e|quiero ver|d[eé]jeme ver|d[ae]me)\b/i.test(texto);
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

  // ⚠️ Segunda pasada por DISTANCIA, y solo si la exacta no encontró nada
  // (12 sep 2026). `includes` es una coincidencia literal: «corygold» no
  // encuentra el Cordygold, y quien pregunta por un producto con una letra de
  // menos recibe el precio del vecino o ninguno — el fallo que ya tuvo el
  // Ganocafé Clásico. Se mide sobre palabras SUELTAS de seis letras o más: las
  // cortas («latte», «3en1») quedarían a distancia de sus vecinas y volverían
  // ambiguo lo que hoy es exacto. El arnés que lo vigila:
  // `npx tsx scripts/prueba-typos.mts`.
  // Qué clave hizo coincidir a cada producto: la desambiguación de abajo la
  // necesita, porque lo específico es la CLAVE, no el nombre del producto.
  const claveQueCoincidio = new Map<ProductoWA, string>();
  for (const p of PRODUCTOS_WA) {
    const claves = [normalizar(p.nombre), ...p.alias.map(normalizar)];
    // La más larga de las que coinciden: "luvoco fuerte" le gana a "luvoco".
    const coincide = claves.filter((k) => k.length >= 4 && t.includes(k)).sort((a, b) => b.length - a.length)[0];
    if (coincide) { encontrados.add(p); claveQueCoincidio.set(p, coincide); }
  }

  // ⚠️ La segunda pasada por DISTANCIA corre SOLO si la exacta no encontró nada
  // (12 sep 2026). `includes` es literal: «corygold» no encuentra el Cordygold, y
  // quien pregunta con una letra de menos recibe el precio del vecino o ninguno
  // — el fallo que ya tuvo el Ganocafé Clásico.
  //
  // ⚠️ Y corre DESPUÉS, nunca en paralelo: al mezclarlas, «Gano Schokolade»
  // —que es su propio alias y matcheaba exacto— sumó también el Ganorico Shoko
  // Rico por parecido, y la desambiguación se quedó con el equivocado. La
  // coincidencia exacta manda; el parecido es solo la red de abajo.
  //
  // Se mide sobre palabras SUELTAS de seis letras o más: las cortas («latte»,
  // «3en1») quedarían a distancia de sus vecinas. Vigilado por
  // `npx tsx scripts/prueba-typos.mts`.
  if (encontrados.size === 0) {
    const palabras = t.split(' ').filter((w) => w.length >= 6);
    for (const p of PRODUCTOS_WA) {
      const largas = [normalizar(p.nombre), ...p.alias.map(normalizar)]
        .filter((k) => k.length >= 6 && !k.includes(' '));
      if (largas.some((k) => palabras.some((w) => Math.abs(w.length - k.length) <= 2 && distancia(w, k) <= 2))) encontrados.add(p);
    }
  }

  if (encontrados.size === 0) return null;
  if (encontrados.size === 1) return [...encontrados][0];

  // Varios candidatos: gana el que coincidió por la clave MÁS ESPECÍFICA.
  //
  // ⚠️ Antes ganaba el de nombre más largo, y por eso «Gano Schokolade» devolvía
  // el **Ganorico Shoko Rico** con su precio (bug anterior al 12 sep 2026, que
  // destapó el arnés de typos): «schokolade» contiene «choko», que es alias del
  // Shoko Rico, y «Ganorico Shoko Rico» es un nombre más largo que «Gano
  // Schokolade». Pero la clave que coincidió medía 10 letras contra 5 — lo
  // específico era el Schokolade. Recibir el precio del producto vecino es el
  // fallo que cuesta plata, y es el mismo que tuvo el Ganocafé Clásico.
  const lista = [...encontrados];
  const masEspecifico = lista.reduce((a, b) =>
    ((claveQueCoincidio.get(b) ?? '').length > (claveQueCoincidio.get(a) ?? '').length ? b : a));
  const resto = lista.filter((p) => p !== masEspecifico);
  const contenido = resto.every((p) =>
    normalizar(masEspecifico.nombre).includes(normalizar(p.nombre))
    || masEspecifico.alias.some((a) => p.alias.some((b) => normalizar(a).includes(normalizar(b)))));
  return contenido ? masEspecifico : null;
}

/**
 * «Ganocafé» a secas → el 3 en 1, el producto estrella (Director, 3 sep 2026).
 *
 * `detectarProducto` devuelve null para «una foto del Ganocafé» porque el
 * término sin calificador no es alias de ninguno de los dos cafés —el 3 en 1 y
 * el Clásico se piden con su apellido—, y el turno caía al motor con «no puedo
 * enviar imágenes». Aquí se resuelve al 3 en 1, salvo que el mensaje nombre
 * otro café. Se usa SOLO como fallback en el nodo de foto: no se toca
 * `detectarProducto`, que alimenta precio y pedido.
 */
export function cafeGenericoAFoto(texto: string): ProductoWA | null {
  const t = normalizar(texto);
  if (!/\bgano\s?cafe\b|\bel cafe\b|\bun cafe\b|\bcafecito\b/.test(t)) return null;
  if (/clasico|classic|negro|negrito|puro|latte|mocha|shoko|schokolad|rooibos|oleaf/.test(t)) return null;
  return PRODUCTOS_WA.find((p) => p.nombre === 'Ganocafé 3 en 1') ?? null;
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
    // La apertura de productos y el nodo de piezas (9 sep 2026) cierran
    // ofreciendo el portafolio: «¿Le muestro el portafolio completo?» y «¿Le
    // mando la del portafolio?». El «sí» a cualquiera de las dos es esta imagen.
    ofrecida: /le (muestro|mando|env[ií]o|paso|comparto) (el portafolio completo|la (imagen )?del portafolio|el portafolio)\b/i,
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
