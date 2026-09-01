/**
 * Copyright © 2026 CreaTuActivo.com — Todos los derechos reservados.
 *
 * LA CONSULTA CON LA PAREJA — nodo determinístico del canal de WhatsApp
 *
 * «Voy a consultarlo con mi esposa» no es una objeción: es lo correcto, y se
 * trata como tal. Lo que NO se hace es dejar a la persona sola con una
 * despedida cortés — en campo, el 100 % vuelve con el clásico «no te preocupes,
 * yo te llamo» (Director, 24 ago 2026).
 *
 * Tres turnos, todos entregables HOY:
 *
 *  T1 — SE OFRECE el enlace, no se entrega (Director, 24 ago): «si quiere, le
 *       genero ahora mismo un enlace para que se lo comparta… ¿se lo genero?».
 *       El enlace se genera solo si la persona acepta.
 *  T1b — Si acepta: se PREGUNTA el nombre de la pareja (Director, 31 ago 2026)
 *       — así a quien llega se la recibe por su nombre.
 *  T2 — Con el nombre (o sin él, si no se deja leer): EL ENLACE + el cierre
 *       por opciones. Es un
 *       wa.me al número de Queswa con texto pre-llenado —la misma pieza que ya
 *       usa el enlace del socio— con una palabra más: «soy la pareja de
 *       {nombre}». Al tocarlo ella escribe primero (ventana de 24 h abierta,
 *       texto libre), queda atribuida al MISMO socio, y el webhook la reconoce.
 *       El cierre es POR OPCIONES, no abierto: «¿le parece si lo retomamos
 *       mañana, o en dos días?» — abierto, el 100 % responde «yo le aviso».
 *       Si no acepta, no se insiste: se deja la puerta abierta y se avisa al socio.
 *  T3 — Con el plazo: confirmación + AVISO AL SOCIO con fecha. El compromiso
 *       lleva fecha y le llega a él (investigación de seguimiento, §7): es el
 *       1-a-1 el que cierra.
 *
 * ⚠️ `microPromptPareja()` (wa-ambivalencia.ts, del nodo de ambivalencia) sigue
 * cableado en el motor y promete «le personalizo un enlace… ¿Se lo preparo?».
 * Este nodo debe ir DELANTE y sustituirlo: si se despliega sin el cableado,
 * promete algo que no existe (Director, 24 ago 2026).
 *
 * Cuando la pareja llega, recibe la APERTURA con sus botones —no una pregunta
 * abierta—: es alguien que apenas está viendo la información, y «¿por dónde
 * prefiere empezar?» a secas le genera fricción (Director, 24 ago). Solo cambia
 * la primera línea, que reconoce de parte de quién viene.
 *
 * ⚠️ El enlace lleva LOS DOS nombres cuando se tienen: el de quien escribe y el
 * de su pareja. Queswa PREGUNTA el de la pareja antes de generar el enlace
 * (Director, 31 ago 2026 — revierte la regla anterior de no preguntarlo). Si el
 * nombre no se deja leer, el enlace sale igual: el dato nunca es peaje. Y «lo
 * revisen» sirve para esposa o esposo.
 */

import { sendTemplate } from '@/lib/wa-channel';
import { construirApertura } from '@/lib/wa-apertura';

/** Número del WABA (Queswa). Solo dígitos, como lo exige wa.me. */
const NUMERO_QUESWA = (process.env.WHATSAPP_DISPLAY_NUMBER || '573215193909').replace(/\D/g, '');

const norm = (t: string) => (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// ─── 1. ¿Va a consultarlo con su pareja? ─────────────────────────────────────

const RE_PAREJA = /(?<![a-z])(mi )?(esposa|esposo|marido|mujer|pareja|senora|senor|novia|novio|companer[oa]|conyuge|familia|casa)(?![a-z])/;
const RE_CONSULTA =
  /(lo|la|eso|esto)?\s*(tengo que|debo|voy a|quiero|prefiero|me toca|necesito)\s*(hablar|consultar|comentar|revisar|mirar|verlo|conversar|discutir|decidir)|lo (hablo|consulto|comento|reviso|converso|decido|miro)\s+(con|en)|consultarlo|comentarlo|hablarlo|revisarlo|decidirlo|decidimos (entre los dos|juntos)|(le|se) (lo )?(pregunto|comento|consulto) a mi|(?<![a-z])(consultar|hablar|comentar|conversar|revisar|mirar|verlo|pensarlo)(lo|la)?\s+(con|en)(?![a-z])|pensarlo y/;

/**
 * «Voy a consultarlo con mi esposa», «lo hablo con mi pareja», «tengo que
 * mirarlo con mi marido», «lo decidimos juntos en casa». Exige la pareja Y el
 * verbo de consulta: «mi esposa toma Ganocafé» no es esto.
 */
export function detectarConsultaConPareja(mensaje: string): boolean {
  const t = norm(mensaje);
  return RE_PAREJA.test(t) && RE_CONSULTA.test(t);
}

// ─── 2. El enlace para la pareja ─────────────────────────────────────────────

/** Nombre corto y presentable: «Luis Abner Cabrejo» → «Luis Abner». */
function nombreCorto(nombre?: string): string {
  // Solo letras: fuera emojis y adornos del perfil. Y un nombre de negocio no es
  // un nombre de pila: «Crea Tu Activo» daba «Crea Tu» en el enlace de la pareja
  // (prueba del 29 ago 2026).
  const limpio = (nombre || '').normalize('NFC').replace(/[^\p{L}\s'-]/gu, '').trim().replace(/\s+/g, ' ');
  if (!limpio) return '';
  const primera = limpio.split(' ')[0];
  if (/^(constructor|usuario|prospecto|crea|creatuactivo|gano|ganocaf[eé]|queswa|tienda|distribuidor|distribuidora|ventas|oficina)$/i.test(primera)) return '';
  return limpio.split(' ').slice(0, 2).join(' ');
}

/**
 * wa.me al número de Queswa con el texto que el webhook ya sabe leer: el slug
 * del socio (atribución) y «soy la pareja de {nombre}» (reconocimiento).
 * ⚠️ Sin emoji en el texto: wa.me destruye los de 4 bytes.
 */
export function enlaceParaPareja(
  slugSocio: string | null | undefined,
  nombreProspecto?: string,
  nombrePareja?: string,
): string {
  const nombre = nombreCorto(nombreProspecto);
  const pareja = nombreCorto(nombrePareja);
  const partes = ['Hola Queswa'];
  if (slugSocio) partes.push(`vengo del enlace de ${slugSocio}`);
  if (pareja && nombre) partes.push(`soy ${pareja}, la pareja de ${nombre}`);
  else if (pareja) partes.push(`soy ${pareja}, mi pareja ya habló con usted`);
  else if (nombre) partes.push(`soy la pareja de ${nombre}`);
  else partes.push('vengo de parte de mi pareja, que ya habló con usted');
  const texto = partes.join(', ');
  return `https://wa.me/${NUMERO_QUESWA}?text=${encodeURIComponent(texto)}`;
}

/**
 * El enlace CORTO que se le entrega a la persona: creatuactivo.com/s/{teléfono}.
 * La ruta /s/[codigo] lo resuelve al wa.me real en el momento del clic, leyendo
 * nombre y socio de la base — así el enlace mejora solo si el nombre llega
 * después. Nació el 31 ago 2026: el modelo lo inventó en una respuesta (la ruta
 * no existía) y el Director lo adoptó por presentable y por decir de dónde viene.
 */
export function enlaceCortoPareja(telefono: string): string {
  return `https://creatuactivo.com/s/${(telefono || '').replace(/\D/g, '')}`;
}

/** T1 — ante «voy a consultarlo con mi esposa»: se OFRECE el enlace. Una pregunta, una salida. */
export function textoOfrecerEnlace(): string {
  return [
    'Perfecto — una decisión así se toma entre los dos.',
    '',
    'Si quiere, le genero ahora mismo un enlace para que se lo comparta: al abrirlo me escribe directo, yo ya sé que viene de su parte, y le respondo lo que quiera preguntar sin que usted tenga que repetirle nada.',
    '',
    '¿Se lo genero?',
  ].join('\n');
}

/** ¿Ese mensaje del bot ofreció el enlace? Cubre el dictado («¿Se lo genero?»)
 *  y la paráfrasis que el motor compone si hubo una digresión en medio. */
export function botOfrecioEnlace(ultimoBot: string): boolean {
  return /¿se lo genero\?|le genero el enlace|un enlace para que se lo comparta/i.test(ultimoBot || '');
}

/**
 * ¿La oferta del enlace sigue viva en los últimos turnos, sin haberse entregado?
 * «¿Se lo genero?» → «¿En serio?» → respuesta del motor → «Sí»: con solo el
 * último mensaje, ese «sí» caía al motor, que el 31 ago 2026 inventó un enlace
 * inexistente (creatuactivo.com/s/…). La entrega previa la corta.
 */
export function enlaceOfrecidoReciente(
  historial: { role: string; content: string }[],
  ventana = 3,
): boolean {
  const bots = historial.filter((m) => m.role === 'assistant').slice(-ventana);
  if (bots.some((m) => /se lo puede reenviar tal cual/i.test(m.content))) return false;
  return bots.some((m) => botOfrecioEnlace(m.content));
}

/** «sí», «dale», «claro que sí», «por favor», «genérelo»… — y nada de «no». */
export function aceptaEnlace(mensaje: string): boolean {
  const t = norm(mensaje).trim();
  if (/(?<![a-z])(no|todavia|aun|despues|luego|mejor no|yo le aviso)(?![a-z])/.test(t)) return false;
  return /^(s[ií]|dale|listo|ok(ay)?|claro|bueno|de una|perfecto|vale|por favor|porfa|genial|h[aá]galo|h[aá]gale|gen[eé]r[ae]lo|s[ií],? por favor|s[ií] claro|claro que s[ií]|me parece|de acuerdo)(?![a-z])/.test(t);
}

/** T1b — aceptó: antes de generar el enlace se pregunta el nombre de la pareja. */
export function textoPedirNombrePareja(): string {
  return 'Con gusto. ¿Cómo se llama su pareja? Así, cuando me escriba, la recibo por su nombre.';
}

export const RE_PIDIO_NOMBRE_PAREJA = /¿C[oó]mo se llama su pareja\?/i;

/** T2 — con el nombre (o sin él): el enlace y el cierre por opciones. */
export function textoEntregaEnlace(enlace: string): string {
  return [
    'Aquí está — se lo puede reenviar tal cual:',
    '',
    enlace,
    '',
    'Seguramente lo revisan hoy mismo. ¿Le parece si lo retomamos mañana, o en dos días?',
  ].join('\n');
}

/** T2' — no aceptó: se deja la puerta abierta, sin insistir. */
export function textoSinEnlace(): string {
  return 'Claro. Cuando lo hayan conversado, me escribe por aquí y seguimos — y si a su pareja le queda alguna pregunta, con gusto se la respondo.';
}

// ─── 3. La pareja llega ───────────────────────────────────────────────────────

/**
 * «soy Marcela, la pareja de Luis Abner» / «soy la pareja de Luis Abner» /
 * «vengo de parte de mi pareja». Devuelve el nombre de quien la envió y —si el
 * enlace lo traía— el de quien llega, para recibirla por su nombre.
 */
export function detectarLlegadaDePareja(
  mensaje: string,
): { nombre: string | null; nombrePareja: string | null } | null {
  const t = (mensaje || '').replace(/\s+/g, ' ').trim();
  const VINCULO = '(?:pareja|esposa|esposo|se[ñn]ora|marido|mujer)';
  const NOMBRE = '[A-Za-zÁÉÍÓÚÑáéíóúñ]+(?: [A-Za-zÁÉÍÓÚÑáéíóúñ]+)?';
  // El formato viejo primero — sin nombre propio — para que «soy la pareja de X»
  // nunca capture «la» como nombre.
  let m = t.match(new RegExp(`soy (?:la|el) ${VINCULO} de (${NOMBRE})`, 'i'));
  if (m) return { nombre: m[1].trim(), nombrePareja: null };
  m = t.match(new RegExp(`soy (${NOMBRE}),? (?:la|el) ${VINCULO} de (${NOMBRE})`, 'i'));
  if (m) return { nombre: m[2].trim(), nombrePareja: m[1].trim() };
  m = t.match(new RegExp(`soy (${NOMBRE}), mi pareja ya habl[oó] con usted`, 'i'));
  if (m) return { nombre: null, nombrePareja: m[1].trim() };
  if (/vengo de parte de mi (pareja|esposa|esposo|marido|mujer)/i.test(t)) return { nombre: null, nombrePareja: null };
  return null;
}

/**
 * La apertura estándar —con la misma cascada y los mismos botones— con una
 * primera línea que reconoce de parte de quién viene. Se manda con
 * `sendReplyButtons(…, APERTURA_OPCIONES)`, igual que la apertura normal.
 */
export function aperturaParaPareja(
  nombreSocio?: string,
  nombreProspectoOriginal?: string | null,
  nombreQuienEscribe?: string,
): string {
  const base = construirApertura(nombreSocio, nombreQuienEscribe);
  const quien = nombreCorto(nombreProspectoOriginal || '');
  const reconocimiento = quien
    ? `${quien} ya conversó conmigo sobre este negocio, y me alegra que lo revisen juntos.`
    : 'Su pareja ya conversó conmigo sobre este negocio, y me alegra que lo revisen juntos.';
  // La base abre con «Hola[, Nombre]. Un gusto saludarle.» — el reconocimiento
  // va justo después de esa línea, antes de la identidad.
  const lineas = base.split('\n');
  return [lineas[0], '', reconocimiento, ...lineas.slice(1)].join('\n');
}

// ─── 4. El plazo y el aviso al socio ─────────────────────────────────────────

/** Etiqueta del plazo tal como se dirá: «mañana», «en dos días», «el jueves». */
export type Plazo = string;

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const DIA_CON_TILDE: Record<string, string> = { miercoles: 'miércoles', sabado: 'sábado' };

/**
 * Lee la respuesta al cierre por opciones. Tolera tipeos y variantes.
 * Un «sí» o «dale» pelado va a la ÚLTIMA opción —«en dos días»—: es la que la
 * persona retiene (observación del Director sobre las preguntas dobles).
 */
export function interpretarPlazo(mensaje: string): Plazo | null {
  const t = norm(mensaje);
  const dia = DIAS.find((d) => new RegExp(`(?<![a-z])(el )?${d}(?![a-z])`).test(t));
  if (dia) return `el ${DIA_CON_TILDE[dia] ?? dia}`;
  if (/pasado ?manana|en dos dias|dos dias|en 2 dias|2 dias|en un par de dias/.test(t)) return 'en dos días';
  if (/(?<![a-z])(manana|tomorrow|manan)(?![a-z])/.test(t)) return 'mañana';
  // «De acuerdo» (prueba del Director, 1 sep 2026) no estaba en la lista: el
  // turno cayó al motor y el socio se quedó sin su aviso con fecha.
  if (/^(s[ií]|dale|listo|ok|claro|bueno|de una|perfecto|vale|de acuerdo|est[aá] bien|me parece( bien)?|bien)[\s.!]*$/.test(t)) return 'en dos días';
  return null;
}

/**
 * Confirmación del plazo. **Quien retoma es Queswa, no el socio** (Director,
 * 30 ago 2026): delegarle el seguimiento traiciona la promesa del servicio, y
 * sobre todo, si el socio no escribe la promesa se cae sin que nadie se entere.
 * ⚠️ Es verdad solo porque el webhook guarda un acuerdo en `wa_acuerdos` con
 * este plazo, y el cron lo ejecuta. Si se cambia este texto sin guardar el
 * acuerdo, vuelve a ser una promesa que nadie cumple.
 */
export function textoConfirmacionPlazo(plazo: Plazo, _nombreSocio?: string): string {
  const cuando = plazo === 'mañana' ? 'mañana' : plazo === 'en dos días' ? 'en dos días' : plazo;
  return [
    `Listo: le escribo ${cuando} para saber cómo les fue.`,
    '',
    'Y si su pareja quiere preguntarme algo antes, yo le explico y le resuelvo lo que necesite. Que tengan buena charla.',
  ].join('\n');
}

/** El plazo, convertido en fecha para el acuerdo. Mediodía: ni de madrugada ni tarde. */
export function fechaDelPlazo(plazo: Plazo, desde = new Date()): Date {
  const d = new Date(desde);
  const dias = plazo === 'mañana' ? 1 : plazo === 'en dos días' ? 2 : 1;
  d.setDate(d.getDate() + dias);
  d.setHours(12, 0, 0, 0);
  return d;
}

/**
 * Aviso al socio con el plazo comprometido. Reutiliza la plantilla UTILITY de
 * la radicación (cuatro variables), que es la que hoy llega al equipo.
 */
export async function avisarAlSocioPareja(params: {
  nombreProspecto?: string;
  whatsapp: string;
  plazo: Plazo;
  nombreSocio?: string;
}): Promise<boolean> {
  const equipo = process.env.WHATSAPP_EQUIPO || '573206805737';
  try {
    const r = await sendTemplate(equipo, 'pre_afiliacion_nueva', 'es', [
      nombreCorto(params.nombreSocio) || 'equipo',
      `${nombreCorto(params.nombreProspecto) || 'Sin nombre'} (${params.whatsapp}) — lo consulta con su pareja; ya tiene el enlace para ella`,
      '—',
      `Queswa retoma ${params.plazo}. La pareja puede escribir antes por el enlace`,
    ]);
    console.log(`📨 [Pareja WA] Aviso al socio: ${r.ok ? 'enviado' : r.error}`);
    return r.ok;
  } catch (err) {
    console.error('❌ [Pareja WA] No se pudo avisar al socio:', err);
    return false;
  }
}

/** ¿El último mensaje del bot fue el cierre por opciones de este nodo? */
export function botOfrecioPlazo(ultimoBot: string): boolean {
  return /lo retomamos ma[ñn]ana, o en dos d[ií]as/i.test(ultimoBot || '');
}
