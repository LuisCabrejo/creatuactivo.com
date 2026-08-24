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
 * Tres piezas, todas entregables HOY:
 *
 *  1. UN ENLACE PARA LA PAREJA, en el mismo turno. Es un wa.me al número de
 *     Queswa con texto pre-llenado —la misma pieza que ya usa el enlace del
 *     socio— con una palabra más: «soy la pareja de {nombre}». Al tocarlo ella
 *     escribe primero (ventana de 24 h abierta, texto libre), queda atribuida al
 *     MISMO socio, y el webhook la reconoce y la ata al hilo de él.
 *  2. UN CIERRE POR OPCIONES, no una pregunta abierta: «¿le parece si lo
 *     retomamos mañana, o en dos días?». Abierto, la respuesta es «yo le aviso».
 *  3. EL AVISO AL SOCIO con el plazo — el compromiso lleva fecha y le llega a él
 *     (investigación de seguimiento, §7): es el 1-a-1 el que cierra.
 *
 * Cuando la pareja llega, recibe la APERTURA con sus botones —no una pregunta
 * abierta—: es alguien que apenas está viendo la información, y «¿por dónde
 * prefiere empezar?» a secas le genera fricción (Director, 24 ago). Solo cambia
 * la primera línea, que reconoce de parte de quién viene.
 *
 * ⚠️ El enlace lleva el nombre de QUIEN ESCRIBE, nunca el de la pareja: no se
 * pregunta cómo se llama ella. Y «lo revisen» sirve para esposa o esposo.
 */

import { sendTemplate } from '@/lib/wa-channel';
import { construirApertura } from '@/lib/wa-apertura';

/** Número del WABA (Queswa). Solo dígitos, como lo exige wa.me. */
const NUMERO_QUESWA = (process.env.WHATSAPP_DISPLAY_NUMBER || '573215193909').replace(/\D/g, '');

const norm = (t: string) => (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// ─── 1. ¿Va a consultarlo con su pareja? ─────────────────────────────────────

const RE_PAREJA = /(?<![a-z])(mi )?(esposa|esposo|marido|mujer|pareja|senora|senor|novia|novio|companer[oa]|conyuge|familia|casa)(?![a-z])/;
const RE_CONSULTA =
  /(lo|la|eso|esto)?\s*(tengo que|debo|voy a|quiero|prefiero|me toca|necesito)\s*(hablar|consultar|comentar|revisar|mirar|verlo|conversar|discutir|decidir)|lo (hablo|consulto|comento|reviso|converso|decido|miro)\s+(con|en)|consultarlo|comentarlo|hablarlo|revisarlo|decidirlo|decidimos (entre los dos|juntos)|(le|se) (lo )?(pregunto|comento|consulto) a mi/;

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
  const limpio = (nombre || '').trim().replace(/\s+/g, ' ');
  if (!limpio || /^(constructor|usuario|prospecto)$/i.test(limpio)) return '';
  return limpio.split(' ').slice(0, 2).join(' ');
}

/**
 * wa.me al número de Queswa con el texto que el webhook ya sabe leer: el slug
 * del socio (atribución) y «soy la pareja de {nombre}» (reconocimiento).
 * ⚠️ Sin emoji en el texto: wa.me destruye los de 4 bytes.
 */
export function enlaceParaPareja(slugSocio: string | null | undefined, nombreProspecto?: string): string {
  const nombre = nombreCorto(nombreProspecto);
  const partes = ['Hola Queswa'];
  if (slugSocio) partes.push(`vengo del enlace de ${slugSocio}`);
  partes.push(nombre ? `soy la pareja de ${nombre}` : 'vengo de parte de mi pareja, que ya habló con usted');
  const texto = partes.join(', ');
  return `https://wa.me/${NUMERO_QUESWA}?text=${encodeURIComponent(texto)}`;
}

/** El turno dictado ante «voy a consultarlo con mi esposa». */
export function textoConsultaPareja(enlace: string): string {
  return [
    'Perfecto — una decisión así se toma entre los dos. Le dejo un enlace para que se lo comparta ahora mismo: al abrirlo me escribe directo, yo ya sé que viene de su parte, y le respondo lo que quiera preguntar sin que usted tenga que repetirle nada.',
    '',
    enlace,
    '',
    'Seguramente lo revisan hoy mismo. ¿Le parece si lo retomamos mañana, o en dos días?',
  ].join('\n');
}

// ─── 3. La pareja llega ───────────────────────────────────────────────────────

/**
 * «soy la pareja de Luis Abner» / «vengo de parte de mi pareja». Devuelve el
 * nombre de quien la envió, si viene en el texto.
 */
export function detectarLlegadaDePareja(mensaje: string): { nombre: string | null } | null {
  const t = (mensaje || '').replace(/\s+/g, ' ').trim();
  const m = t.match(/soy (la|el) (pareja|esposa|esposo|se[ñn]ora|marido|mujer) de ([A-Za-zÁÉÍÓÚÑáéíóúñ]+(?: [A-Za-zÁÉÍÓÚÑáéíóúñ]+)?)/i);
  if (m) return { nombre: m[3].trim() };
  if (/vengo de parte de mi (pareja|esposa|esposo|marido|mujer)/i.test(t)) return { nombre: null };
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
  // La base abre con «Hola[, Nombre]. Un gusto saludarle. 🤝» — el reconocimiento
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
  if (/^(s[ií]|dale|listo|ok|claro|bueno|de una|perfecto|vale)[\s.!]*$/.test(t)) return 'en dos días';
  return null;
}

/** Confirmación del plazo. Quien escribe ese día es el socio: el 1-a-1 cierra. */
export function textoConfirmacionPlazo(plazo: Plazo, nombreSocio?: string): string {
  const socio = nombreCorto(nombreSocio) || 'el equipo de creatuactivo.com';
  return `Listo: lo retomamos ${plazo}. Le aviso a ${socio} para que sea quien les escriba ese día — y si su pareja me escribe antes, con gusto le respondo.`;
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
      `RETOMAR ${params.plazo.toUpperCase()}: le escribe el socio. Pareja puede escribir antes por el enlace`,
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
