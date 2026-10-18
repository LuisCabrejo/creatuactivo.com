/**
 * © CreaTuActivo.com — Propietario y confidencial.
 *
 * TOMA DE PEDIDO POR WHATSAPP — Queswa como mano derecha del distribuidor.
 *
 * Quien llega al canal viene referido por un distribuidor del equipo. Cuando esa
 * persona quiere COMPRAR PRODUCTO —no un paquete—, Queswa no la manda a una
 * oficina ni a una línea nacional: recibe el pedido, lo carga y se lo remite al
 * distribuidor, que coordina el pago y la entrega en persona. Es el mismo patrón
 * de la radicación (wa-radicacion.ts), con una sola diferencia: aquí lo único que
 * hace falta saber es QUÉ productos va a llevar. La ciudad, el flete y la forma de
 * entrega los define con quien le compartió el enlace — la mitad del mercado
 * orgánico vive en la misma ciudad del socio y eso se resuelve en persona
 * (Director, 27 ago 2026).
 *
 * Nació de la conversación de Milena (27 ago 2026): quiso una caja, el modelo le
 * improvisó un formulario de cuatro datos para «abrir código», ese texto activó el
 * trámite del PAQUETE («¿cuál es su nombre completo?»), y al pedir un asesor
 * recibió una promesa que nadie iba a cumplir. Salió sin comprar.
 *
 * Tres reglas de diseño:
 * - Los textos de este nodo NO deben parecerse a los de la radicación: el cierre
 *   de paquete reconoce «nombre completo, como aparece» y «número de
 *   identificación», y si un pedido los usa, el trámite equivocado se abre solo.
 * - Al socio se le nombra SIEMPRE por su nombre. «El distribuidor» o «el socio»
 *   son etiquetas; «Luis Cabrejo» es una persona que la va a llamar.
 * - Las oficinas son información de socio. Al prospecto se le da la razón real
 *   —atienden a quien ya tiene código— y la puerta: su código lo abre el socio.
 */

import { PRODUCTOS_WA, detectarProducto, productoDelHilo, type ProductoWA } from '@/lib/wa-productos';
import { sendTemplate, sendCtaUrl, sendText, sendReplyButtons } from '@/lib/wa-channel';
import { enVentanaPorTelefono } from '@/lib/wa-ventana';
import { avisarPorCorreo } from '@/lib/wa-radicacion';
import { enlaceCatalogo } from '@/lib/wa-onboarding';
import { normalizarDuro } from '@/lib/texto-normalizar';
import { pushAlDashboard, quien as quienConPais } from '@/lib/wa-avisos-contexto';
import { esBsuid } from '@/lib/paises';

export interface LineaPedido { producto: ProductoWA; cantidad: number }

export interface SocioPedido {
  nombre?: string
  whatsapp?: string
  constructorId?: string
  slug?: string | null
}

function norm(t: string): string {
  return normalizarDuro(t);
}

const cop = (n: number) => `$${n.toLocaleString('es-CO')} COP`;

/** Primer nombre, sin emojis ni adornos («Milena❤️» → «Milena»). */
export function nombreCorto(nombre?: string | null): string | undefined {
  if (!nombre) return undefined;
  // Solo letras: fuera emojis, selectores de variación (U+FE0F) y uniones (U+200D),
  // que se cuelan pegados al nombre del perfil («Milena❤️»).
  const limpio = nombre.normalize('NFC').replace(/[^\p{L}\s'-]/gu, '').trim().split(/\s+/)[0];
  if (!limpio || /^constructor$/i.test(limpio)) return undefined;
  // Un perfil de negocio no es un nombre de pila: «Crea Tu Activo» daba «Crea».
  if (/^(crea|creatuactivo|gano|ganocaf[eé]|queswa|tienda|distribuidor|distribuidora|ventas|oficina)$/i.test(limpio)) return undefined;
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

// ─── Detección ───────────────────────────────────────────────────────────────

// Lo que es del paquete, no del producto: eso lo atiende la radicación.
const RE_PAQUETE = /paquete|\besp[- ]?[123]\b|kit de inicio|afiliar|inscribir|vincular|ini?[cs]iar|arrancar|empe[zs]ar|comen[zs]ar con/i;

const RE_VERBO_COMPRA =
  /(quiero|quisiera|deseo|me gustar[ií]a|necesito|voy a|puedo|c[oó]mo|como|d[oó]nde|donde)\s+(comprar|pedir|encargar|ordenar|adquirir|conseguir|llevar|pido|compro|encargo|hacer\s+(el\s+|un\s+|mi\s+)?pedido|hago\s+(el\s+|un\s+|mi\s+)?pedido)/i;

// «Montar» y «armar» un pedido son como lo dice la gente en Colombia (Ru, 28 sep
// 2026: «Hola quiero montar un pedido me ayudas» no abrió el pedido, respondió el
// modelo, y al turno siguiente le llegó el video del negocio).
const RE_COMPRA_DIRECTA =
  /\b(solo|s[oó]lo|nada m[aá]s)\s+quiero\b|quiero\s+(una|un|dos|tres|cuatro|cinco|\d+)\s+(caja|frasco|tarro|unidad|sobre)|me\s+(manda|env[ií]a|vende|lleva|trae)\s+(una|un|dos|tres|cuatro|\d+)|\b(v[eé]ndame|mand[ae]me|env[ií]eme)\b|(hacer|hago|montar|monto|armar|armo|poner|pongo)(me)?\s+(el\s+|un\s+|mi\s+|otro\s+)?pedido|c[oó]mo\s+(pido|pedido|compro)|d[oó]nde\s+(pido|compro)|quiero\s+(comprar|pedir|encargar)|me interesa comprar|comprar\s+(una|un)\s+(caja|frasco|tarro)/i;

/**
 * ¿Quiere comprar PRODUCTO? Un verbo de compra sin vocabulario de paquete, o un
 * producto nombrado junto a un «quiero». Preguntar solo el precio no es comprar:
 * eso lo responde el catálogo.
 */
export function detectarIntencionCompra(texto: string): boolean {
  const t = texto.trim();
  if (!t || RE_PAQUETE.test(t)) return false;
  if (/cu[aá]nto\s+(vale|cuesta|sale)/i.test(t) && !/quiero|comprar|pedir|llevar/i.test(t)) return false;
  if (RE_VERBO_COMPRA.test(t) || RE_COMPRA_DIRECTA.test(t)) return true;
  return detectarProducto(t) !== null && /\b(quiero|quisiera|me llevo|me interesa|deme|d[eé]me|mande)\b/i.test(t);
}

/** El bot está a la espera de los productos del pedido. */
export const RE_PIDIO_PRODUCTOS = /qu[eé] productos va a llevar|enseguida le cargo su compra|no logr[eé] identificar|cu[aá]l prefiere\?$/i;
/** El pedido ya quedó cargado en esta conversación. Reconoce la confirmación
 *  vigente («Su pedido N.º 48213 quedó registrado», 17 oct 2026) y la anterior. */
export const RE_PEDIDO_CARGADO = /qued[oó] cargado su pedido|su pedido (N\.º \d+ )?qued[oó] (cargado|registrado)/i;

export function pedidoAbierto(ultimoBot: string): boolean {
  return RE_PIDIO_PRODUCTOS.test(ultimoBot);
}

export function pedidoCargado(historial: { role: string; content: string }[]): boolean {
  return historial.some((m) => m.role === 'assistant' && RE_PEDIDO_CARGADO.test(m.content));
}

// ─── Extracción de líneas ────────────────────────────────────────────────────

const NUMEROS: Record<string, number> = {
  un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6,
  siete: 7, ocho: 8, nueve: 9, diez: 10, docena: 12,
};

function cantidadJunto(t: string, pos: number, largo: number): number {
  const antes = t.slice(Math.max(0, pos - 30), pos);
  const m = antes.match(/(\d+|un|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|docena)\s*(cajas?|frascos?|tarros?|unidades?|sobres?|de|del|x)?\s*(de\s+|del\s+)?$/);
  if (m) return NUMEROS[m[1]] ?? Math.max(1, Math.min(50, parseInt(m[1], 10)));
  const despues = t.slice(pos + largo, pos + largo + 12);
  const d = despues.match(/^\s*(x|por)\s*(\d+)/);
  if (d) return Math.max(1, Math.min(50, parseInt(d[2], 10)));
  return 1;
}

/**
 * Los productos que nombra el mensaje, con su cantidad. Varios a la vez
 * («dos de 3 en 1 y una de cápsulas»). Si un nombre contiene a otro
 * («luvoco fuerte» contiene «luvoco»), gana el específico.
 */
export function extraerLineasPedido(texto: string): LineaPedido[] {
  const t = norm(texto);
  if (!t) return [];
  const hallados: { p: ProductoWA; pos: number; largo: number }[] = [];

  for (const p of PRODUCTOS_WA) {
    const claves = [norm(p.nombre), ...p.alias.map(norm)].filter((k) => k.length >= 4);
    let mejor: { pos: number; largo: number } | null = null;
    for (const k of claves) {
      const i = t.indexOf(k);
      if (i >= 0 && (!mejor || i < mejor.pos || (i === mejor.pos && k.length > mejor.largo))) {
        mejor = { pos: i, largo: k.length };
      }
    }
    if (mejor) hallados.push({ p, ...mejor });
  }

  const especificos = hallados.filter((a) => !hallados.some((b) =>
    b !== a
    && b.pos <= a.pos && b.pos + b.largo >= a.pos + a.largo
    && b.largo > a.largo));

  return especificos
    .sort((a, b) => a.pos - b.pos)
    .map(({ p, pos, largo }) => ({ producto: p, cantidad: cantidadJunto(t, pos, largo) }));
}

/**
 * Las líneas del pedido: lo que dice el mensaje, o —si el mensaje solo trae el
 * verbo («quiero comprarlo»)— el producto del que venía hablando.
 */
export function lineasDelPedido(
  texto: string,
  historial: { role: string; content: string }[],
): LineaPedido[] {
  const propias = extraerLineasPedido(texto);
  if (propias.length > 0) return propias;
  // Solo lo que dijo la PERSONA. El 29 ago el bot había preguntado «¿el café,
  // el té, los suplementos…?», y «el té» —alias del Rooibos— se tomó como el
  // producto del hilo: a quien pidió «una caja de Gano Café» se le cargó un té.
  const delHilo = productoDelHilo(historial.filter((m) => m.role === 'user'));
  if (!delHilo) return [];
  const t = norm(texto);
  const m = t.match(/\b(\d+|un|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b/);
  const cantidad = m ? (NUMEROS[m[1]] ?? Math.max(1, Math.min(50, parseInt(m[1], 10)))) : 1;
  return [{ producto: delHilo, cantidad }];
}

export function totalPedido(lineas: LineaPedido[]): number {
  return lineas.reduce((s, l) => s + l.producto.precioCOP * l.cantidad, 0);
}

/**
 * El pedido que quedó en el hilo: el último mensaje del usuario que nombra
 * productos. Lo usa el turno del nombre, que llega un mensaje después de que
 * la persona dijo qué quiere.
 */
export function lineasPendientesDelHilo(historial: { role: string; content: string }[]): LineaPedido[] {
  const delUsuario = historial.filter((m) => m.role === 'user');
  for (let i = delUsuario.length - 1; i >= 0; i--) {
    const lineas = extraerLineasPedido(delUsuario[i].content);
    if (lineas.length > 0) return lineas;
  }
  return [];
}

// ─── Copy ────────────────────────────────────────────────────────────────────

/** «Gano Café» / «Ganocafé» / «el café» a secas: es una familia, no un producto. */
// (?![a-záéíóúñ]) en vez de \b: el \b de JS no cierra tras una vocal con tilde («café»).
export const RE_GANOCAFE_GENERICO = /\bgano\s*caf[eé](?![a-záéíóúñ])|\bel caf[eé](?![a-záéíóúñ])|\buna? caja de caf[eé](?![a-záéíóúñ])|\bcaf[eé] de gano(?![a-záéíóúñ])/i;

export function esGanocafeSinVariante(texto: string): boolean {
  return RE_GANOCAFE_GENERICO.test(texto) && extraerLineasPedido(texto).length === 0;
}

export const RE_PREGUNTO_CUAL_GANOCAFE = /cu[aá]l prefiere\?$/i;

export function preguntarCualGanocafe(): string {
  return 'Con gusto le cargo su Ganocafé. Tenemos dos: el *3 en 1*, que ya trae crema y azúcar, y el *Clásico*, que es café negro con Ganoderma. Los dos a $110.900 la caja. ¿Cuál prefiere?';
}

/** La respuesta a «¿cuál prefiere?»: 3 en 1 o Clásico, con tolerancia al tipeo. */
export function leerVarianteGanocafe(texto: string): ProductoWA | null {
  const t = norm(texto);
  const slug = /3 en 1|tres en uno|3en1|con crema|con azucar|el primero/.test(t) ? 'ganocafe-3-en-1'
    : /clasico|negro|puro|sin azucar|el segundo/.test(t) ? 'ganocafe-clasico' : null;
  return slug ? PRODUCTOS_WA.find((p) => p.slug === slug) ?? null : null;
}

export function pedirProductos(nombre?: string, nota?: string): string {
  const saludo = nombre ? `Con mucho gusto, ${nombre}.` : 'Con mucho gusto.';
  // `nota`: la respuesta a una pregunta que venía en el mismo mensaje («¿a precio
  // de distribuidor?»), antes de pedir los productos (Director, 3 sep 2026).
  return `${saludo}${nota ? ' ' + nota : ''} Enseguida le cargo su compra.\n\n¿Qué productos va a llevar?`;
}

/**
 * Un pedido lleva nombre: es lo que le dice al socio QUIÉN va a comprar
 * (Director, 31 ago 2026). Se pide solo cuando el perfil de WhatsApp no lo
 * trae utilizable.
 */
export function pedirNombrePedido(nombreSocio?: string): string {
  // Queswa se presenta (17 oct 2026, aprobado por el Director): quien llega del
  // catálogo no sabe quién le contesta, y el 79 % pide una señal de legitimidad
  // antes de seguir (Meta/Kantar 2025).
  const quien = nombreSocio ? `Soy Queswa, la asistente de ${nombreSocio}.` : 'Soy Queswa, del equipo de creatuactivo.com.';
  return `Con gusto le tomo el pedido. ${quien} ¿A nombre de quién lo dejo?`;
}

/** Reconoce la pregunta vigente y la anterior («¿A nombre de quién dejo el pedido?»). */
export const RE_PIDIO_NOMBRE_PEDIDO = /¿A nombre de qui[eé]n (lo )?dejo( el pedido)?\?/i;

/**
 * El mensaje leído como nombre: «Milena», «a nombre de Juan Pérez», «soy
 * Carlos». Devuelve null si no parece un nombre — y en ese caso el pedido sale
 * sin él, porque el dato nunca es peaje.
 */
export function leerNombrePedido(texto: string): string | null {
  const t = texto.trim()
    .replace(/^(a nombre de|me llamo|mi nombre es|soy|para|es)\s+/i, '')
    .replace(/[.!,;]+$/g, '');
  if (!t || /[?¿0-9@\n]/.test(t)) return null;
  const palabras = t.split(/\s+/).map((p) => p.replace(/[^\p{L}'-]/gu, '')).filter(Boolean);
  if (palabras.length < 1 || palabras.length > 5) return null;
  if (palabras.some((p) => p.length < 2)) return null;
  // Ninguna palabra puede ser una muletilla de respuesta: «mejor no» son dos
  // palabras con letras y sin esto pasaba como el nombre «Mejor No».
  if (palabras.some((p) => /^(si|s[ií]|no|ok|dale|listo|bueno|claro|gracias|vale|mejor|despu[eé]s|luego|ahora|todav[ií]a|a[uú]n|nada|ninguno|ninguna)$/i.test(p))) return null;
  return palabras.map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
}

export function noEntendiProductos(segundaVez = false): string {
  // Repetir el mismo texto ante el segundo intento se lee como una pared: la
  // persona ya dijo algo y el sistema le contesta igual (prueba del 31 ago,
  // «El capuchino» recibió la misma frase que el turno anterior).
  return segundaVez
    ? 'Ese no lo tenemos con ese nombre. Los de café son el *Ganocafé 3 en 1*, el *Ganocafé Clásico*, el *Latte Rico*, el *Mocha Rico* y el *Shoko Rico*. ¿Alguno de esos?'
    : 'No logré identificar el producto. ¿Me dice cuál quiere, tal como aparece en el catálogo? Por ejemplo: Ganocafé 3 en 1, Ganocafé Clásico, Cápsulas Ganoderma…';
}

/** ¿Ya se le dijo una vez que no se reconoció el producto? */
export const RE_NO_ENTENDI = /No logré identificar el producto/i;

function lineaTexto(l: LineaPedido): string {
  // «Luvoco Medio · 15 cápsulas» ya trae la presentación en el nombre: con la de la
  // tabla quedaba «Luvoco Medio · 15 cápsulas (caja de cápsulas)».
  const pres = l.producto.presentacion && !l.producto.nombre.includes('·') ? ` (${l.producto.presentacion})` : '';
  return `*${l.cantidad} × ${l.producto.nombre}*${pres} · ${cop(l.producto.precioCOP * l.cantidad)}`;
}

/** Resumen corto para la plantilla al socio (sin saltos de línea: Meta los rechaza).
 *  Separado por comas: con « · » chocaba con «Luvoco Medio · 15 cápsulas». */
export function resumenLineas(lineas: LineaPedido[]): string {
  return lineas.map((l) => `${l.cantidad} × ${l.producto.nombre}`).join(', ');
}

/**
 * «Hoy» o «mañana»: lo que se le promete al comprador sobre cuándo le escribe el
 * socio (Director, 17 oct 2026: «le escribe hoy»). Un pedido de las 10 de la
 * noche no se contesta hoy, así que desde las 7 p. m. de Bogotá se dice mañana.
 */
export function cuandoEscribe(ahora = new Date()): 'hoy' | 'mañana' {
  const hora = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', hour: 'numeric', hourCycle: 'h23' }).format(ahora));
  return hora >= 19 ? 'mañana' : 'hoy';
}

/**
 * La confirmación del pedido (17 oct 2026, aprobada por el Director). Lo que
 * cambió frente a la anterior y por qué:
 * - Decía «se comunica con usted por este mismo medio», y no era cierto: el socio
 *   escribe desde SU WhatsApp. Ahora dice cuándo («hoy») y por dónde.
 * - Lleva número de pedido: es lo que el socio cita en su primer mensaje, y así el
 *   comprador sabe que quien le escribe es quien tiene su pedido.
 * - Sale el enlace al catálogo (la persona acaba de salir de ahí) y la pregunta del
 *   final: la confirmación es el mensaje más leído y no compite consigo mismo.
 * No se da el número del socio (Director): quien compra por el catálogo lo recibió
 * del propio socio, desde su WhatsApp, y ya lo tiene.
 */
export function confirmarPedido(
  lineas: LineaPedido[],
  socio: SocioPedido | null,
  nombre?: string,
  codigo?: string | null,
  ahora = new Date(),
): string {
  const primer = nombreCorto(nombre);
  const encabezado = `${primer ? `Listo, ${primer}.` : 'Listo.'} Su pedido${codigo ? ` N.º ${codigo}` : ''} quedó registrado:`;
  const cuerpo = lineas.map(lineaTexto).join('\n');
  const total = lineas.length > 1 ? `\nTotal de productos: *${cop(totalPedido(lineas))}*` : '';
  const cuando = cuandoEscribe(ahora);
  const quien = socio?.nombre || 'Alguien del equipo de creatuactivo.com';
  const quienCorto = socio?.nombre?.split(/\s+/)[0] || 'el equipo';

  return [
    encabezado,
    '',
    cuerpo + total,
    '',
    `${quien} le escribe ${cuando} por WhatsApp para acordar el pago y la entrega.`,
    '',
    `Si están en la misma ciudad suele entregarse en persona; si no, Gano Excel lo despacha por Servientrega y normalmente llega de un día para otro. Si el envío tiene costo, ${quienCorto} se lo confirma antes de que usted pague.`,
  ].join('\n');
}

// ─── El envío ────────────────────────────────────────────────────────────────

export const RE_PREGUNTA_ENVIO =
  /env[ií]o|envian|env[ií]an|domicilio|me lo (mandan|env[ií]an|traen|llevan)|llega a mi|flete|servientrega|cu[aá]nto (vale|cuesta|demora|tarda) (el )?env|c[oó]mo (me )?(llega|lo recibo)|contra ?entrega/i;

export function detectarPreguntaEnvio(texto: string): boolean {
  return RE_PREGUNTA_ENVIO.test(texto);
}

export function respuestaEnvio(socio: SocioPedido | null, hayPedido = true): string {
  const quien = socio?.nombre || 'el equipo de creatuactivo.com';
  const cuerpo = `Eso lo acuerda directamente con ${quien} cuando se comunique con usted, para que le quede como mejor le convenga: si están en la misma ciudad suele resolverse en persona, y si no, Gano Excel lo despacha por Servientrega y normalmente llega de un día para otro.`;
  // La pregunta de sumar al pedido, solo si HAY pedido (24 sep 2026): el
  // Director preguntó por el envío sin haber pedido nada y le llegó «¿Le sumo
  // algo más al pedido mientras tanto?».
  return hayPedido ? `${cuerpo}\n\n¿Le sumo algo más al pedido mientras tanto?` : cuerpo;
}

// ─── Las oficinas, para el prospecto ─────────────────────────────────────────

export const RE_PREGUNTA_OFICINA =
  /\boficinas?\b|\bsedes?\b|punto de venta|d[oó]nde (queda|quedan|es|est[aá]|est[aá]n|los? (compro|consigo|venden))|la direcci[oó]n\b|voy (directo|directamente)|ir personalmente|pasar por/i;

export function detectarPreguntaOficina(texto: string): boolean {
  // «dirección de envío» es del pedido, no de la oficina.
  if (/direcci[oó]n de (env[ií]o|entrega)/i.test(texto)) return false;
  return RE_PREGUNTA_OFICINA.test(texto);
}

const CIUDADES_SEDE = ['Bogotá', 'Medellín', 'Cali', 'Pereira', 'Barranquilla', 'Bucaramanga', 'Cúcuta', 'Villavicencio'];
const CIUDADES = [
  ...CIUDADES_SEDE, 'Cartagena', 'Santa Marta', 'Manizales', 'Armenia', 'Ibagué', 'Neiva', 'Pasto',
  'Montería', 'Valledupar', 'Sincelejo', 'Popayán', 'Tunja', 'Riohacha', 'Florencia', 'Yopal', 'Quibdó',
];

export function detectarCiudad(texto: string): string | null {
  const t = norm(texto);
  return CIUDADES.find((c) => t.includes(norm(c))) ?? null;
}

/** El bot ya explicó lo de las sedes en esta conversación. */
export const RE_OFICINA_YA_EXPLICADA = /llegar con su c[oó]digo de cliente|atienden a quienes llegan con su c[oó]digo|con gusto se la dar[ií]a/i;

/** «Vivo en Medellín / estoy en Cali»: la persona dijo dónde está. Distinto de «¿hay oficina en X?». */
export function diceDondeVive(texto: string): boolean {
  return /\b(vivo|estoy|resido|me encuentro|soy de|ac[aá]|aqu[ií])(?![a-záéíóúñ])/i.test(texto);
}

export function respuestaOficinaProspecto(
  socio: SocioPedido | null,
  ciudad: string | null,
  hayPedido: boolean,
  insiste: boolean,
  viveAlli = false,
): string {
  const quien = socio?.nombre || 'el equipo de creatuactivo.com';
  const primerPedido = hayPedido ? 'este primer pedido' : 'su primer pedido';
  // El código deja de ser un requisito y pasa a ser lo que le da el precio: el
  // dato en pesos sale de CLIENTE_VIP_01 ($147.900 público · $110.900 con
  // código). Se prueba con un hecho, nunca con una advertencia sobre ir solo
  // (Director + Gemini, 29 ago 2026).
  const llave = `Para comprar allá hace falta una sola cosa: llegar con su código de cliente. Es lo que le da el precio de distribuidor: el Ganocafé 3 en 1 vale $147.900 al público y $110.900 con código, unos $37.000 menos por caja.`;
  const puerta = `Su código lo abre ${quien} con ${primerPedido}, y ahí mismo le indica la dirección exacta y acuerdan si lo recoge allá o se lo envían.`;
  // A quien ya tiene pedido no se le ofrece abrir otro.
  const cierre = hayPedido ? '' : `\n\n${OFERTA_PEDIDO_SEDE}`;

  if (insiste) {
    return `Con gusto se la daría, pero esa parte la lleva ${quien}: al abrirle el código le indica la dirección y acuerdan la entrega. Se comunica con usted por aquí mismo.`;
  }
  if (ciudad && CIUDADES_SEDE.includes(ciudad)) {
    const cuantas = ciudad === 'Bogotá' ? 'hay dos sedes' : 'hay una sede';
    const apertura = viveAlli
      ? `Qué bien que esté en ${ciudad}: allá ${cuantas} de Gano Excel, y conocer la operación en persona siempre es buena idea.`
      : `Sí, en ${ciudad} ${cuantas} de Gano Excel, y conocer la operación en persona siempre es buena idea.`;
    return `${apertura}\n\n${llave}\n\n${puerta}${cierre}`;
  }
  const destino = ciudad ? ` hasta ${ciudad}` : '';
  return `Las sedes de Gano Excel atienden a quienes llegan con su código de cliente, que es lo que da el precio de distribuidor. El suyo lo abre ${quien} con ${primerPedido}, y ahí mismo acuerdan la entrega${destino} o le indica cuál sede le queda más cerca.${cierre}`;
}

// ─── «Quiero hablar con una persona» ─────────────────────────────────────────

export const RE_PIDE_PERSONA =
  /\basesor(a)?\b|hablar con (alguien|una persona|un humano|una humana|un[ao] asesor|luis|el socio|la socia|el distribuidor)|una persona real|que me llame|me pueden? llamar|ll[aá]meme|prefiero hablar con|cont[aá]ct(en)?me|comun[ií]queme con|pasarme con|eres? (un )?(robot|bot|m[aá]quina)/i;

// Pedir una REUNIÓN es pedir una persona (Director, 21 sep 2026): hoy el negocio se
// cierra en reuniones 1-a-1, y el video del día 15 lo dice. Queswa respondía que no
// había reuniones y volcaba precios. Exige un verbo de PETICIÓN cerca del sustantivo,
// para que «¿hacen reuniones?» —la pregunta por eventos, que atiende FREQ_35— no entre.
/** Para las puertas nuevas: sin tildes y sin letras repetidas («qúiero», «reuunión», «dónnde»).
 *  ⚠️ Colapsar dobles convierte «llamada» en «lamada»: los patrones de abajo ya vienen así. */
function normalizarPuerta(texto: string): string {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/(\p{L})\1+/gu, '$1');
}

export const RE_PIDE_REUNION =
  /(q[ui]{1,3}e?r[oa]|quisiera|me gustaria|necesit[oa]|podemos|podriamos|agend\w*|program\w*|cuadr\w*|separ\w*|pedir|solicit\w*|tener)\b[^.?!\n]{0,25}?(reu?n?i?on|cita|video ?lamada|una lamada)|reunirme con|reunirnos|nos (podemos |podriamos )?reunir|cuando (nos )?(podemos |puede ser (la )?)?(reunion|reunimos|vernos)/;

export function detectarPidePersona(texto: string): boolean {
  return RE_PIDE_PERSONA.test(texto) || RE_PIDE_REUNION.test(normalizarPuerta(texto));
}

// Las CHARLAS de Luis (Director, 21 sep 2026, opción a): el video del día 15 dice
// «cuando doy charla», y Queswa respondía que no hay charlas presenciales. No se
// describe ningún evento —restricción de Meta sobre esta industria, ver FREQ_35—:
// se dice dónde vive lo que explica (los videos del reto) y se avisa al socio.
export const RE_PREGUNTA_CHARLA = /\bc(ha|ah)r?las?\b|conferencias?|conferencista|ponente|expositor|\borador\b|invitarl[oe] a (hablar|dar)|(venir|ir) a hablar|hablar (en|para|con) (mi|nuestra|la) (empresa|equipo|gente|compa[nñ]ia)/;
const RE_INTERES_CHARLA =
  /\bd(onde|one|node|ode)\b|cuando|puedo (ir|asistir)|asistir|proxima|inscrib|invit\w*|hay (alguna|charla)|alguna c|la siguiente|cobr\w*|cuesta|vale|contrat\w*|honorari\w*|\b(da|das|dan|dicta|dictan|hace|hacen)\b/;

export function detectarPreguntaCharla(texto: string): boolean {
  const t = normalizarPuerta(texto);
  return RE_PREGUNTA_CHARLA.test(t) && RE_INTERES_CHARLA.test(t);
}

// «a» + «el equipo» se contrae: sin socio, el texto decía «le avisé a el equipo».
const avisadoA = (socio: SocioPedido | null) => socio?.nombre ? `a ${socio.nombre}` : 'al equipo de creatuactivo.com';

export function respuestaCharla(socio: SocioPedido | null): string {
  return `Luis comparte lo que explica en sus charlas en los videos del reto. Si quiere saber de la próxima, ya le avisé ${avisadoA(socio)}, y se comunica con usted por este mismo medio.\n\nMientras tanto cuente conmigo: ¿hay algo que le pueda ir resolviendo?`;
}

export function respuestaPersona(socio: SocioPedido | null): string {
  return `Claro que sí. Ya le avisé ${avisadoA(socio)}, y se comunica con usted por este mismo medio.\n\nMientras tanto cuente conmigo: ¿hay algo que le pueda ir resolviendo?`;
}

// ─── Autorización de marketing ───────────────────────────────────────────────
//
// Meta solo permite mensajes de promoción a quien dio su consentimiento, y la
// Ley 1581 (habeas data) exige que sea explícito y quede registrado. Por eso
// es SU propio turno, con una sola pregunta, y el «sí» se guarda con fecha en
// la ficha del prospecto (`marketing_optin`). Sin ese registro no hay campaña.

export const RE_OFRECIO_OPTIN = /le gustar[ií]a que le avise por aqu[ií]|quiere que le avise por aqu[ií]/i;

export function optinYaOfrecido(historial: { role: string; content: string }[]): boolean {
  return historial.some((m) => m.role === 'assistant' && RE_OFRECIO_OPTIN.test(m.content));
}

/** La persona cierra la conversación: «no», «gracias», «listo», «eso es todo». */
export function esCierreDeConversacion(texto: string): boolean {
  return /^(no|no,? gracias|no,? por ahora|por ahora no|gracias|muchas gracias|mil gracias|listo|listo,? gracias|eso es todo|nada m[aá]s|ninguna|ok|vale|perfecto|bueno|est[aá] bien)[\s.!,]*$/i.test(texto.trim());
}

export function ofrecerOptin(nombre?: string): string {
  const saludo = nombre ? `Perfecto, ${nombre}, ha sido un gusto atenderle.` : 'Perfecto, ha sido un gusto atenderle.';
  return `${saludo} Una última cosa: cuando haya promociones o productos nuevos, ¿le gustaría que le avise por aquí? Responda *sí* y queda en la lista.`;
}

export function leerRespuestaOptin(texto: string): boolean | null {
  const t = texto.trim();
  if (/^(s[ií]|claro|dale|por supuesto|ok(ay)?|listo|bueno|de una|me parece|s[ií],? (claro|por favor|gracias)|s[ií] quiero|quiero)[\s.!,]*$/i.test(t)) return true;
  if (/^(no|no,? gracias|no quiero|mejor no|por ahora no|no por ahora|prefiero que no)[\s.!,]*$/i.test(t)) return false;
  return null;
}

export function respuestaOptin(acepta: boolean): string {
  return acepta
    ? 'Listo, queda en la lista. Le aviso solo cuando haya algo que valga la pena. Que tenga un buen día.'
    : 'Entendido, sin problema. Aquí me tiene cuando me necesite. Que tenga un buen día.';
}

// ─── Persistencia y aviso ────────────────────────────────────────────────────

const WHATSAPP_EQUIPO = () => process.env.WHATSAPP_EQUIPO || '573206805737';

/**
 * ¿Es el mismo teléfono? Compara los últimos diez dígitos (con o sin +57).
 * Un aviso al socio o al equipo nunca va al número que hizo el pedido: el 17 oct
 * 2026 el Director probó la compra desde el +57 320 680 5737, que también es el
 * del equipo, y en el mismo chat le llegó «Hola equipo. Efraín Reyes… le hizo un
 * pedido». Un comprador real no lo vería, pero un socio que se compra a sí mismo, sí.
 */
export function mismoNumero(a?: string | null, b?: string | null): boolean {
  const d = (x?: string | null) => String(x ?? '').replace(/\D/g, '').slice(-10);
  return d(a).length === 10 && d(a) === d(b);
}

/** Número corto del pedido: cinco cifras que el comprador y el socio se dicen. */
function nuevoCodigo(): string {
  const n = new Uint32Array(1);
  crypto.getRandomValues(n);
  return String(10000 + (n[0] % 90000));
}

/**
 * La firma del enlace /pedido/{codigo}-{firma}: el enlace abre el chat con el
 * comprador, así que cinco cifras solas permitirían adivinar teléfonos ajenos.
 * Web Crypto y no `node:crypto`: este módulo también lo carga el motor (Edge).
 */
export async function firmaPedido(codigo: string): Promise<string> {
  const llave = new TextEncoder().encode(process.env.WA_BRIDGE_SECRET?.trim() || 'sin-llave');
  const clave = await crypto.subtle.importKey('raw', llave, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const firma = new Uint8Array(await crypto.subtle.sign('HMAC', clave, new TextEncoder().encode(`pedido:${codigo}`)));
  let b64 = '';
  for (const b of firma) b64 += String.fromCharCode(b);
  return btoa(b64).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '').slice(0, 10);
}

export async function registrarPedido(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  datos: {
    fingerprint: string
    whatsapp: string
    nombre?: string
    lineas: LineaPedido[]
    socio: SocioPedido | null
  },
): Promise<{ id: string; codigo: string } | null> {
  // Dos intentos por si el código sale repetido (índice único `wa_pedidos_codigo_key`).
  for (let intento = 0; intento < 3; intento++) {
    const codigo = nuevoCodigo();
    try {
      const { data, error } = await supabase
        .from('wa_pedidos')
        .insert({
          fingerprint_id: datos.fingerprint,
          whatsapp:       datos.whatsapp,
          nombre:         datos.nombre ?? null,
          lineas:         datos.lineas.map((l) => ({
            slug: l.producto.slug, nombre: l.producto.nombre, cantidad: l.cantidad, precio_cop: l.producto.precioCOP,
          })),
          total_cop:      totalPedido(datos.lineas),
          constructor_id: datos.socio?.constructorId ?? null,
          socio:          datos.socio?.nombre ?? null,
          estado:         'pendiente',
          codigo,
        })
        .select('id, codigo')
        .single();
      if (error) {
        if (error.code === '23505') continue; // código repetido: se sortea otro
        throw error;
      }
      return { id: data.id as string, codigo: data.codigo as string };
    } catch (err) {
      console.error('❌ [Pedido WA] No se pudo registrar el pedido:', err);
      return null;
    }
  }
  return null;
}

/**
 * Aviso al socio y al equipo de que hay un pedido (17 oct 2026, Director).
 *
 * Meta no deja saltos de línea dentro de las variables de una plantilla, así que
 * la lista de productos llegaba pegada en un renglón («totalmente desordenado»).
 * Por eso son dos piezas:
 *   1. `pedido_cliente_v2` (UTILITY): el aviso corto, con los saltos de línea en
 *      el texto fijo —número de pedido, cliente, cuántos productos y total— y dos
 *      botones: [Ver el pedido] (respuesta rápida, `pedido_ver:{codigo}`) y
 *      [Escribirle] (/pedido/{codigo}-{firma}).
 *   2. Al tocar [Ver el pedido] se abre la ventana de 24 h y Queswa responde el
 *      detalle con viñetas (`detallePedidoSocio`, nodo 1.37 del webhook).
 * Si quien recibe el aviso ya le escribió a Queswa en las últimas 24 h, no hace
 * falta plantilla: le llega de una vez el aviso con las viñetas y [Escribirle].
 * Si la v2 no sale, cae a la v1 (renglón único) y luego a `pre_afiliacion_nueva`:
 * un aviso torpe es mejor que ninguno.
 */
export const PLANTILLA_PEDIDO_SOCIO = 'pedido_cliente_v2';
const PLANTILLA_PEDIDO_SOCIO_V1 = 'pedido_cliente_v1';
export const PAYLOAD_VER_PEDIDO = 'pedido_ver:';

const pesosCortos = (n: number) => '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** «+57 320 680 5737» para un celular colombiano; «+1 …» con los dígitos para otro país. */
export function telefonoLegible(whatsapp: string): string {
  if (esBsuid(whatsapp)) return 'sin número visible';
  const d = String(whatsapp).replace(/\D/g, '');
  const m = /^57(\d{3})(\d{3})(\d{4})$/.exec(d);
  return m ? `+57 ${m[1]} ${m[2]} ${m[3]}` : `+${d}`;
}

/** El pedido como lo guarda `wa_pedidos`, para armar el detalle sin volver a leer el texto. */
export interface PedidoGuardado {
  codigo: string
  nombre?: string | null
  whatsapp: string
  lineas: { nombre: string; cantidad: number; precio_cop: number }[]
  total_cop: number
}

function vinetas(p: PedidoGuardado): string {
  return p.lineas.map((l) => `• ${l.cantidad} × ${l.nombre} · ${pesosCortos(l.precio_cop * l.cantidad)}`).join('\n');
}

/** Lo que responde [Ver el pedido] (texto aprobado por el Director, 17 oct 2026). */
export function detallePedidoSocio(p: PedidoGuardado): string {
  return [
    `*Pedido N.º ${p.codigo}${p.nombre ? ` · ${p.nombre}` : ''}*`,
    '',
    vinetas(p),
    '',
    `Total de productos: *${cop(Number(p.total_cop))}*`,
  ].join('\n');
}

/** El aviso entero en texto libre, para quien está dentro de la ventana: la plantilla con las viñetas adentro. */
export function avisoPedidoEnTexto(p: PedidoGuardado, notaEquipo = ''): string {
  return [
    `*Nuevo pedido N.º ${p.codigo} de su catálogo*`,
    '',
    `Cliente: ${p.nombre || 'Sin nombre'}, ${telefonoLegible(p.whatsapp)}${notaEquipo}`,
    '',
    vinetas(p),
    '',
    `Total de productos: *${cop(Number(p.total_cop))}*`,
    '',
    'Escríbale hoy para acordar el pago y la entrega.',
  ].join('\n');
}

function pedidoDesdeLineas(lineas: LineaPedido[], whatsapp: string, nombre: string | undefined, codigo: string): PedidoGuardado {
  return {
    codigo,
    nombre: nombre ?? null,
    whatsapp,
    lineas: lineas.map((l) => ({ nombre: l.producto.nombre, cantidad: l.cantidad, precio_cop: l.producto.precioCOP })),
    total_cop: totalPedido(lineas),
  };
}

/** Texto con botón [Escribirle]; si el texto no cabe en un mensaje con botón (1.024), van por separado. */
async function enviarConBotonEscribirle(to: string, texto: string, codigo: string) {
  const url = `https://creatuactivo.com/pedido/${codigo}-${await firmaPedido(codigo)}`;
  if (texto.length <= 1000) return sendCtaUrl(to, texto, 'Escribirle', url);
  const r = await sendText(to, texto);
  if (!r.ok) return r;
  return sendCtaUrl(to, 'Para escribirle al cliente con el pedido ya citado:', 'Escribirle', url);
}

export async function avisarPedido(
  lineas: LineaPedido[],
  whatsapp: string,
  nombre: string | undefined,
  socio: SocioPedido | null,
  codigo?: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase?: any,
): Promise<void> {
  const quien = `${nombre || 'Sin nombre'} (${whatsapp})`;
  const que   = resumenLineas(lineas).slice(0, 200);
  const total = cop(totalPedido(lineas));
  const unidades = lineas.reduce((n, l) => n + l.cantidad, 0);
  const pedido = codigo ? pedidoDesdeLineas(lineas, whatsapp, nombre, codigo) : null;
  const boton = codigo ? `${codigo}-${await firmaPedido(codigo)}` : undefined;

  const avisar = async (to: string, saludo: string, notaEquipo = '') => {
    if (pedido && codigo && boton) {
      // Dentro de la ventana de 24 h: el aviso entero, con viñetas, sin plantilla.
      const digitos = String(to).replace(/\D/g, '');
      if (supabase && await enVentanaPorTelefono(supabase, digitos).catch(() => false)) {
        const r = await enviarConBotonEscribirle(to, avisoPedidoEnTexto(pedido, notaEquipo), codigo);
        if (r.ok) return r;
      }
      const r2 = await sendTemplate(to, PLANTILLA_PEDIDO_SOCIO, 'es', [
        codigo,
        `${nombre || 'Sin nombre'}, ${telefonoLegible(whatsapp)}${notaEquipo}`,
        `${unidades} ${unidades === 1 ? 'producto' : 'productos'}`,
        total,
      ], undefined, [
        { tipo: 'quick_reply', payload: `${PAYLOAD_VER_PEDIDO}${codigo}` },
        { tipo: 'url', param: boton },
      ]);
      if (r2.ok) return r2;
      console.warn(`⚠️ [Pedido WA] ${PLANTILLA_PEDIDO_SOCIO} no salió (${r2.error}) — se usa ${PLANTILLA_PEDIDO_SOCIO_V1}`);
      const r1 = await sendTemplate(to, PLANTILLA_PEDIDO_SOCIO_V1, 'es', [saludo, quien, que, `${total}${notaEquipo}`], boton);
      if (r1.ok) return r1;
      console.warn(`⚠️ [Pedido WA] ${PLANTILLA_PEDIDO_SOCIO_V1} no salió (${r1.error}) — se usa pre_afiliacion_nueva`);
    }
    return sendTemplate(to, 'pre_afiliacion_nueva', 'es', [
      saludo, `${quien} · PEDIDO${codigo ? ` N.º ${codigo}` : ''}`, que, `Total ${total} — coordinar pago y entrega${notaEquipo}`,
    ]);
  };

  if (socio?.whatsapp && !mismoNumero(socio.whatsapp, whatsapp)) {
    try {
      const r = await avisar(socio.whatsapp, socio.nombre?.split(/\s+/)[0] || 'Socio');
      console.log(`📨 [Pedido WA] Aviso al socio ${socio.nombre}: ${r.ok ? 'enviado' : r.error}`);
    } catch (err) {
      console.error('❌ [Pedido WA] No se pudo avisar al socio:', err);
    }
  }
  if (mismoNumero(WHATSAPP_EQUIPO(), whatsapp) || mismoNumero(WHATSAPP_EQUIPO(), socio?.whatsapp)) return;
  try {
    const r = await avisar(WHATSAPP_EQUIPO(), 'equipo', socio ? ` (atiende ${socio.nombre})` : ' (sin socio)');
    console.log(`📨 [Pedido WA] Aviso al equipo: ${r.ok ? 'enviado' : r.error}`);
  } catch (err) {
    console.error('❌ [Pedido WA] No se pudo avisar al equipo:', err);
  }
}

/** ¿Tocó [Ver el pedido]? Por el identificador oculto del botón, o por su texto si Meta no lo trajo. */
export function esBotonVerPedido(opcion?: string, texto?: string): boolean {
  return Boolean(opcion?.startsWith(PAYLOAD_VER_PEDIDO)) || /^ver el pedido$/i.test((texto ?? '').trim());
}

/**
 * [Ver el pedido] (nodo 1.37 del webhook): el detalle con viñetas y [Escribirle].
 * Solo para quien recibió el aviso —el socio del pedido o el equipo—: el
 * detalle trae el teléfono del cliente. Devuelve el texto enviado, o null si
 * quien toca no tiene que ver con ese pedido (el turno sigue su camino).
 */
export async function atenderVerPedido(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  telefono: string,
  opcion?: string,
): Promise<string | null> {
  const codigo = opcion?.startsWith(PAYLOAD_VER_PEDIDO) ? opcion.slice(PAYLOAD_VER_PEDIDO.length) : null;
  const esEquipo = mismoNumero(telefono, WHATSAPP_EQUIPO());
  let consulta = supabase.from('wa_pedidos').select('codigo, nombre, whatsapp, lineas, total_cop, constructor_id');
  consulta = codigo ? consulta.eq('codigo', codigo) : consulta.order('creado_at', { ascending: false }).limit(20);
  const { data } = await consulta;
  const filas = (Array.isArray(data) ? data : data ? [data] : []).filter((f: { codigo?: string }) => f?.codigo);
  for (const fila of filas) {
    let suyo = esEquipo;
    if (!suyo && fila.constructor_id) {
      const { data: u } = await supabase.from('private_users').select('whatsapp').eq('constructor_id', fila.constructor_id).maybeSingle();
      suyo = mismoNumero(u?.whatsapp, telefono);
    }
    if (!suyo) continue;
    const texto = detallePedidoSocio(fila as PedidoGuardado);
    const r = await enviarConBotonEscribirle(telefono, texto, fila.codigo);
    if (!r.ok) console.warn(`⚠️ [Pedido WA] El detalle del pedido ${fila.codigo} no salió: ${r.error}`);
    return texto;
  }
  return null;
}

/** Alguien pidió hablar con una persona: el socio se entera de verdad. */
export async function avisarPidePersona(
  whatsapp: string,
  nombre: string | undefined,
  socio: SocioPedido | null,
  contexto: string,
): Promise<void> {
  // Con nombre de usuario de WhatsApp no hay teléfono: el aviso decía
  // «Aldo Moller (CA.951546381359010)», un código que no sirve para marcarle.
  // Se dice de dónde es y que no vemos su número (8 oct 2026).
  const quien = esBsuid(whatsapp)
    ? `${quienConPais(nombre || 'Sin nombre', whatsapp, false)}, sin teléfono visible · PIDE HABLAR CON UNA PERSONA`
    : `${nombre || 'Sin nombre'} (${whatsapp}) · PIDE HABLAR CON UNA PERSONA`;
  const que   = contexto.slice(0, 160) || '—';
  // El push llega siempre: la plantilla puede fallar y el correo se lee tarde.
  await pushAlDashboard(
    socio?.constructorId || process.env.EQUIPO_CONSTRUCTOR_ID || 'luis-cabrejo-1288',
    `🙋 ${quienConPais(nombre, whatsapp, false)} pide hablar con una persona`,
    `Lo último que escribió: «${que}»`,
  );
  const destinos: [string, string][] = [];
  if (socio?.whatsapp) destinos.push([socio.whatsapp, socio.nombre?.split(/\s+/)[0] || 'Socio']);
  destinos.push([WHATSAPP_EQUIPO(), 'equipo']);
  let algunoOk = false;
  for (const [to, saludo] of destinos.filter(([to]) => !mismoNumero(to, whatsapp))) {
    try {
      const r = await sendTemplate(to, 'pre_afiliacion_nueva', 'es', [saludo, quien, que, 'contactar por WhatsApp']);
      algunoOk = algunoOk || r.ok;
      console.log(`📨 [Pedido WA] Aviso «pide persona» a ${saludo}: ${r.ok ? 'enviado' : r.error}`);
    } catch (err) {
      console.error('❌ [Pedido WA] No se pudo avisar «pide persona»:', err);
    }
  }
  // Si ninguna plantilla salió —el canal caído, que es justo cuando la web hace
  // de respaldo—, el equipo se entera por correo.
  if (!algunoOk) await avisarPorCorreo(`[Queswa] Pide hablar con una persona — ${nombre || 'sin nombre'}`, [quien, que, socio?.nombre ? `Socio: ${socio.nombre}` : 'Sin socio']);
}

/**
 * Alguien quiere comprar y todavía no dijo qué: el socio se entera YA, no cuando
 * la persona termine de escribir los productos.
 *
 * Ru (28 sep 2026) volvió a escribir «quiero pedir productos», recibió «¿Qué
 * productos va a llevar?» y no respondió más. El aviso al socio solo salía con
 * el pedido completo, así que nadie supo que había alguien queriendo comprar, y
 * la ventana de 24 h se cerró. Una intención de compra no espera a los datos:
 * el pedido sin productos es justo el que más necesita una persona detrás.
 * Misma plantilla aprobada que los demás avisos; solo cambian las variables.
 */
export async function avisarPedidoAbierto(
  whatsapp: string,
  nombre: string | undefined,
  socio: SocioPedido | null,
  mensaje: string,
): Promise<void> {
  const quien = `${nombre || 'Sin nombre'} (${whatsapp}) · QUIERE HACER UN PEDIDO`;
  const que   = `Aún no dice qué productos. Escribió: «${mensaje.replace(/\s+/g, ' ').trim().slice(0, 120)}»`;
  const destinos: [string, string][] = [];
  if (socio?.whatsapp) destinos.push([socio.whatsapp, socio.nombre?.split(/\s+/)[0] || 'Socio']);
  destinos.push([WHATSAPP_EQUIPO(), 'equipo']);
  let algunoOk = false;
  for (const [to, saludo] of destinos.filter(([to]) => !mismoNumero(to, whatsapp))) {
    try {
      const como = saludo === 'equipo' && socio?.nombre ? `escribirle para tomar el pedido (atiende ${socio.nombre})`
        : saludo === 'equipo' ? 'escribirle para tomar el pedido — SIN SOCIO'
        : 'escribirle para tomar el pedido';
      const r = await sendTemplate(to, 'pre_afiliacion_nueva', 'es', [saludo, quien, que, como]);
      algunoOk = algunoOk || r.ok;
      console.log(`📨 [Pedido WA] Aviso «pedido abierto» a ${saludo}: ${r.ok ? 'enviado' : r.error}`);
    } catch (err) {
      console.error('❌ [Pedido WA] No se pudo avisar «pedido abierto»:', err);
    }
  }
  if (!algunoOk) await avisarPorCorreo(`[Queswa] Quiere hacer un pedido — ${nombre || 'sin nombre'}`, [quien, que, socio?.nombre ? `Socio: ${socio.nombre}` : 'Sin socio']);
}

// ─── El «sí» después de las respuestas de salud ──────────────────────────────
//
// Tras el texto del peso («¿le cuento cómo integrarlo en su rutina?») y el del
// azúcar («¿le cuento cómo es cada uno?»), el «sí» tiene un solo destino, y el
// 29 ago 2026 el modelo lo compuso con un precio inventado ($82.500 por un
// Clásico de $110.900): la pregunta del bot no nombra producto y el pin de
// precio no disparó. Nodo determinístico: lo emite el backend con los datos de
// la tabla —nombre, presentación, precio— y el modelo no toca la cifra.

export const RE_OFERTA_RUTINA = /¿Le cuento cómo integrarlo en su rutina\?\s*$/;
// El cierre de las respuestas de salud ofrece el catálogo: «cada uno» no dejaba
// claro de qué se hablaba (Director, 29 ago 2026). El «sí» va al nodo del enlace.
//
// ⚠️ La oferta se reconoce por su FORMA, no por una frase exacta (5 sep 2026).
// El arsenal cierra con «¿Le muestro el catálogo completo con precios?», las
// respuestas de salud con «…para que vea las presentaciones?», y el modelo
// compone variantes («¿Le muestro qué trae el catálogo completo?»). Con la
// frase exacta, el «Si mi diamante» de Betsabe a la variante «con precios» cayó
// al motor, que prometió «déme un momento para cargarlo» y no mandó nada. Todo
// «¿Le muestro / paso / envío … catálogo …?» como última línea del bot abre el
// nodo 2.24; el enlace lo emite el backend, nunca el modelo.
export const RE_OFERTA_CATALOGO = /¿(le|te)\s+(muestro|paso|env[ií]o|comparto|mando|traigo)[^?¿]*\bcat[aá]logo[^?¿]*\?\s*$/i;
/** @deprecated Alias del anterior; se conserva por los arneses que lo importan. */
export const RE_OFERTA_CATALOGO_SALUD = RE_OFERTA_CATALOGO;
export const RE_OFERTA_FOTO_PRODUCTO = /¿Le muestro la foto\?\s*$/;

/** El cierre de la respuesta de sede: invita a abrir el pedido con el que queda el código. */
export const OFERTA_PEDIDO_SEDE = '¿Le abro el pedido con el que queda su código activo?';
export const RE_OFERTA_PEDIDO_SEDE = /¿Le abro el pedido con el que queda su código activo\?\s*$/;

const porSlug = (slug: string) => PRODUCTOS_WA.find((p) => p.slug === slug) ?? null;

/**
 * La aceptación pelada («sí», «dale», «claro») de una oferta del bot.
 *
 * Tolera lo que la gente le cuelga al «sí» —«Si por favor», «Si mi diamante»,
 * «sí señora», «dale gracias»— y rechaza lo que ya no es una aceptación sino
 * otra pregunta («sí, ¿y cuánto vale?», «sí pero cómo se pide»): eso va al
 * motor con la pregunta entera, no al nodo de la oferta.
 */
export function esAceptacion(texto: string): boolean {
  const t = (texto || '').trim();
  // «Sii», «claro que sí» y «sí claro» son la misma cabeza; la pregunta se busca
  // en lo que viene DESPUÉS de ella, para que el «que» de «claro que sí» no la
  // descalifique.
  const cabeza = /^(claro que s[ií]+|s[ií]+,? por favor|s[ií]+ claro|s[ií]+|claro|dale|listo|ok|bueno|por supuesto|de una|me interesa|cu[eé]nteme|cuentame|a ver)(?![a-záéíóúñ])/i.exec(t);
  if (!cabeza) return false;
  const resto = t.slice(cabeza[0].length);
  if (/[?¿]/.test(t)) return false;
  if (/(?<![a-záéíóúñ])(pero|c[oó]mo|cu[aá]nto|cu[aá]l(es)?|qu[eé]|d[oó]nde|cu[aá]ndo|por qu[eé])(?![a-záéíóúñ])/i.test(resto)) return false;
  return t.split(/\s+/).length <= 6;
}

/**
 * El texto dictado que sigue a una oferta de salud aceptada, o null si el último
 * turno del bot no era una de esas ofertas.
 */
export function seguimientoSalud(ultimoBot: string, texto: string): string | null {
  if (!esAceptacion(texto)) return null;
  const clasico = porSlug('ganocafe-clasico');
  const capsulas = porSlug('capsulas-ganoderma') ?? PRODUCTOS_WA.find((p) => /c[aá]psulas de ganoderma/i.test(p.nombre)) ?? null;
  if (!clasico) return null;

  if (RE_OFERTA_RUTINA.test(ultimoBot)) {
    return [
      `Con gusto. El *${clasico.nombre}* se prepara en menos de un minuto: un sobre en 150 ml de agua caliente, y listo. La mayoría lo toma a primera hora, como su café de la mañana, así que la energía entra pareja hasta el mediodía.`,
      '',
      `La caja trae 30 sobres, lo que le alcanza para el mes completo, y cuesta ${cop(clasico.precioCOP)}.`,
      '',
      '¿Le muestro la foto?',
    ].join('\n');
  }

  return null;
}


// ─── ¿Cómo prefiere pagarlo? — pagar a Gano Excel o con el socio (17 oct 2026) ──
//
// Decisión del Director: quien arma un pedido elige, en igualdad, entre pagar
// DIRECTO a Gano Excel (la orden se crea en la cuenta del distribuidor, a nombre y
// dirección del cliente; paga por PSE o consigna en efectivo; Gano despacha) o
// pagar con su distribuidor (el flujo de siempre: el socio le escribe). La primera
// solo existe si el socio tiene su contraseña de Gano guardada en queswa.app.
//
// La confirmación del pedido termina en la pregunta y trae dos botones. Lo que
// pasa después vive en `atenderFormaDePago`: con Gano, un botón al catálogo con
// el pedido ya puesto (/productos/{slug}?pedido={codigo}-{firma}&pagar=1), donde
// escribe la dirección y paga; con el socio, el aviso al socio y el texto de
// siempre. El aviso al socio NO sale hasta que el cliente elige: si eligió Gano,
// el aviso lo manda queswa.app cuando la orden existe, y decirle antes «escríbale
// hoy para acordar el pago» lo pondría a coordinar un pago que no es suyo.

export const PAYLOAD_PAGO_GANO = 'pedido_pago_gano:';
export const PAYLOAD_PAGO_SOCIO = 'pedido_pago_socio:';
export const PREGUNTA_FORMA_PAGO = '¿Cómo prefiere pagarlo?';
export const RE_PREGUNTO_FORMA_PAGO = /¿Cómo prefiere pagarlo\?\s*$/;

/** ¿El socio tiene su contraseña de Gano guardada en queswa.app? Sin eso no hay pedido directo. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function socioTienePagoGano(supabase: any, constructorId?: string | null): Promise<boolean> {
  if (!constructorId) return false;
  try {
    const { data } = await supabase.from('gano_credentials').select('constructor_id').eq('constructor_id', constructorId).maybeSingle();
    return Boolean(data);
  } catch {
    return false;
  }
}

/** La confirmación que cierra en la pregunta (el cuerpo del mensaje con botones). */
export function confirmarPedidoConFormaDePago(lineas: LineaPedido[], nombre?: string, codigo?: string | null): string {
  const primer = nombreCorto(nombre);
  const total = lineas.length > 1 ? `\nTotal de productos: *${cop(totalPedido(lineas))}*` : '';
  return [
    `${primer ? `Listo, ${primer}.` : 'Listo.'} Su pedido${codigo ? ` N.º ${codigo}` : ''} quedó registrado:`,
    '',
    lineas.map(lineaTexto).join('\n') + total,
    '',
    PREGUNTA_FORMA_PAGO,
  ].join('\n');
}

/** «Pagar con Luis» (hasta 20 caracteres, el tope de Meta) o «Con mi distribuidor». */
export function tituloBotonSocio(nombreSocio?: string): string {
  const primer = nombreSocio?.trim().split(/\s+/)[0];
  const t = primer ? `Pagar con ${primer}` : 'Con mi distribuidor';
  return t.length <= 20 ? t : 'Con mi distribuidor';
}

export function botonesFormaDePago(codigo: string, nombreSocio?: string): { id: string; title: string }[] {
  return [
    { id: `${PAYLOAD_PAGO_GANO}${codigo}`, title: 'Pagar a Gano Excel' },
    { id: `${PAYLOAD_PAGO_SOCIO}${codigo}`, title: tituloBotonSocio(nombreSocio) },
  ];
}

/** La confirmación con los dos botones; si Meta no deja botones, el texto con las dos opciones numeradas. */
export async function ofrecerFormaDePago(to: string, texto: string, codigo: string, nombreSocio?: string) {
  const r = await sendReplyButtons(to, texto, botonesFormaDePago(codigo, nombreSocio));
  if (r.ok) return r;
  console.warn(`⚠️ [Pedido WA] Los botones de pago no salieron (${r.error}); va en texto.`);
  return sendText(to, `${texto}\n\n1. Pagar a Gano Excel\n2. ${tituloBotonSocio(nombreSocio)}`);
}

export interface EleccionPago { via: 'gano' | 'socio'; codigo: string; silencioso?: boolean }

/** ¿Tocó uno de los dos botones? Trae la vía y el número de pedido del identificador oculto. */
export function botonPagoElegido(opcion?: string): EleccionPago | null {
  if (!opcion) return null;
  if (opcion.startsWith(PAYLOAD_PAGO_GANO)) return { via: 'gano', codigo: opcion.slice(PAYLOAD_PAGO_GANO.length) };
  if (opcion.startsWith(PAYLOAD_PAGO_SOCIO)) return { via: 'socio', codigo: opcion.slice(PAYLOAD_PAGO_SOCIO.length) };
  return null;
}

/** El número del pedido que el bot escribió («Su pedido N.º 47004 quedó registrado»). */
export function codigoDelPedidoEnTexto(texto: string): string | null {
  const m = /pedido N\.?º?\s*(\d{5})/i.exec(texto || '');
  return m ? m[1] : null;
}

/** Respondió con texto, no con el botón: «a Gano», «por PSE», «con Luis», «1», «2»… */
export function leerFormaDePagoEscrita(texto: string): 'gano' | 'socio' | null {
  const t = norm(texto);
  if (!t) return null;
  if (/(^|\s)(gano|pse|banco|en linea|online|directo|directa|consign\w*|efecty|transferencia|1|uno|primera|primero)(\s|$)/.test(t)) return 'gano';
  if (/(^|\s)(distribuidor|distribuidora|asesor|asesora|socio|socia|whatsapp|2|dos|segunda|segundo)(\s|$)/.test(t) || /(^|\s)con (el|la|mi|usted|ella|[a-z]+)(\s|$)/.test(t)) return 'socio';
  return null;
}

/** El socio de un pedido guardado (wa_pedidos.constructor_id es el constructor_id, no el UUID). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function socioDelPedido(supabase: any, constructorId?: string | null): Promise<SocioPedido | null> {
  if (!constructorId) return null;
  try {
    const { data } = await supabase.from('private_users').select('name, whatsapp').eq('constructor_id', constructorId).maybeSingle();
    if (!data) return null;
    const { data: s } = await supabase.from('constructor_slugs').select('slug').eq('constructor_id', constructorId).maybeSingle();
    return { nombre: String(data.name || '').trim().split(/\s+/).slice(0, 2).join(' '), whatsapp: data.whatsapp ?? undefined, constructorId, slug: s?.slug ?? null };
  } catch {
    return null;
  }
}

/** El catálogo del socio con el pedido ya puesto y la hoja de pago abierta. */
export async function enlacePagoGano(socio: SocioPedido | null, codigo: string): Promise<string> {
  const ref = socio?.slug || socio?.constructorId || '';
  return `https://creatuactivo.com/productos/${encodeURIComponent(ref)}?pedido=${codigo}-${await firmaPedido(codigo)}&pagar=1`;
}

export function textoPagoGano(nombre?: string): string {
  const primer = nombreCorto(nombre);
  return [
    `${primer ? `${primer}, p` : 'P'}erfecto. Paga directo a Gano Excel y Gano Excel se lo despacha a su dirección.`,
    '',
    'En el enlace escribe la dirección de entrega, ve el costo del envío y paga por PSE desde su banco o consigna en efectivo. El pago por PSE vale 20 minutos: tenga su banco a la mano.',
  ].join('\n');
}

export function textoPagoSocio(socio: SocioPedido | null, ahora = new Date()): string {
  const quien = socio?.nombre || 'Alguien del equipo de creatuactivo.com';
  const quienCorto = socio?.nombre?.split(/\s+/)[0] || 'el equipo';
  return [
    `Listo. ${quien} le escribe ${cuandoEscribe(ahora)} por WhatsApp para acordar el pago y la entrega.`,
    '',
    `Si están en la misma ciudad suele entregarse en persona; si no, Gano Excel lo despacha por Servientrega y normalmente llega de un día para otro. Si el envío tiene costo, ${quienCorto} se lo confirma antes de que usted pague.`,
  ].join('\n');
}

/**
 * Lo que sigue a la elección. Solo atiende a quien hizo el pedido (el número del
 * pedido coincide con el de quien escribe). Devuelve el texto que recibió la
 * persona (para el historial) y el nodo, o null si el pedido no es suyo.
 *   · gano  → botón «Pagar a Gano Excel» al catálogo; estado `eligio_gano`.
 *   · socio → aviso al socio (una sola vez) + «Luis le escribe hoy…»; estado `pago_socio`.
 *             Con `silencioso`, solo el aviso: el turno sigue al motor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function atenderFormaDePago(supabase: any, telefono: string, eleccion: EleccionPago): Promise<{ texto: string; nodo: string } | null> {
  const { data: p } = await supabase.from('wa_pedidos').select('codigo, nombre, whatsapp, lineas, total_cop, constructor_id, estado').eq('codigo', eleccion.codigo).maybeSingle();
  if (!p || !mismoNumero(p.whatsapp, telefono)) return null;
  const socio = await socioDelPedido(supabase, p.constructor_id);
  const lineas: LineaPedido[] = (Array.isArray(p.lineas) ? p.lineas : [])
    .map((l: { slug?: string; cantidad?: number }) => ({ producto: PRODUCTOS_WA.find((x) => x.slug === l.slug), cantidad: Number(l.cantidad) || 1 }))
    .filter((l: { producto?: ProductoWA }): l is LineaPedido => Boolean(l.producto));

  if (eleccion.via === 'gano') {
    const texto = textoPagoGano(p.nombre ?? undefined);
    const url = await enlacePagoGano(socio, p.codigo);
    if (!eleccion.silencioso) {
      const r = await sendCtaUrl(telefono, texto, 'Pagar a Gano Excel', url);
      if (!r.ok) await sendText(telefono, `${texto}\n\n${url}`);
    }
    await supabase.from('wa_pedidos').update({ estado: 'eligio_gano' }).eq('codigo', p.codigo);
    return { texto: `${texto}\n\n[Pagar a Gano Excel] ${url}`, nodo: '2.45 pedido: paga a Gano Excel' };
  }

  if (p.estado !== 'pago_socio') {
    await avisarPedido(lineas, p.whatsapp, p.nombre ?? undefined, socio, p.codigo, supabase);
    await supabase.from('wa_pedidos').update({ estado: 'pago_socio' }).eq('codigo', p.codigo);
  }
  const texto = textoPagoSocio(socio);
  if (!eleccion.silencioso) await sendText(telefono, texto);
  return { texto, nodo: '2.45 pedido: paga con el socio' };
}
