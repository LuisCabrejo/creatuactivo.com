/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El distribuidor del socio que quiere activarse, y el socio que pide su acceso.
 * Dos nodos del canal, solo para quien escribe desde su número de socio.
 *
 * ── POR QUÉ EXISTE (Miguel Barahona, 3 oct 2026) ─────────────────────────────
 *
 * «Tengo una persona que tiene código en Gano Excel conmigo y quiere generar».
 * Carolina ya era distribuidora de su sistema; Queswa la trató como desconocida:
 * le redactó la invitación de frío y le dijo a Miguel que, cuando ella dijera
 * «sí», le mandara su enlace de prospecto. Si él lo hace, su propia distribuidora
 * queda registrada como prospecta suya. Lo que Carolina necesita no es una
 * invitación: es su propia cuenta y su propio enlace, igual que él.
 *
 * ⛔ NADIE ACTIVA A NADIE POR FUERA DE LA ADMINISTRACIÓN (Director, 5 oct 2026).
 * Un distribuidor no puede dar de alta a otro. Aquí Queswa solo recoge los tres
 * datos y le pasa la solicitud a sistema@creatuactivo.com, con la línea del
 * comando ACTIVAR lista para copiar. Administración decide y activa.
 *
 * El socio que pide su propio acceso lo recibe sin vuelta (2.226): escribe desde
 * el número con que está registrado, y eso es la identidad.
 */

import { Resend } from 'resend';
import { normalizarWhatsApp, type SocioIdentificado } from '@/lib/wa-onboarding';
import { esAceptacion } from '@/lib/wa-pedido';

const EQUIPO_EMAIL = process.env.EQUIPO_DIRECTIVO_EMAIL || 'sistema@creatuactivo.com';
const FROM_EMAIL = 'Queswa <hola@creatuactivo.com>';

// ─── 2.225 El distribuidor del socio que quiere activarse ────────────────────

/**
 * La pregunta que hace el MODELO (esqueleto, PASO 1) cuando el socio nombra a
 * alguien con código sin decir de quién es. Va literal en el esqueleto y aquí:
 * el «sí» que la responde cae en este nodo por la forma del último turno.
 */
export const PREGUNTA_CODIGO_CON_USTED = '¿Ese código lo tiene con usted, en su sistema?';

/** La persona ya tiene código, cuenta o registro CON EL SOCIO. */
const RE_TIENE_CODIGO_CONMIGO =
  /\b(?:c[oó]?d+[oó]?i?g?[oó]|cuenta|usuario|registro|inscrit[oa]|afiliad[oa]|registrad[oa]|vinculad[oa]|activ[oa])\b[^.?!\n]{0,40}?\b(?:c[oó]?n*[oó]?m?i?g[oó]|con ?migo|en mi (?:sistema|red|equipo|canal|organizaci[oó]n|l[ií]nea)|bajo mi c[oó]?d+i?g?[oó]|con mi c[oó]?d+i?g?[oó]|debajo (?:de )?m[ií]|en mi (?:izquierd[oa]|derech[oa]))\b/i;
/** «Mi distribuidora», «lo inscribí yo». */
const RE_MI_DISTRIBUIDOR =
  /\b(?:mi|una?)\s+(?:distribuidor[a]?|socia?|afiliad[oa]|inscrit[oa])\b(?!\s+de\s+gano)|\b(?:l[oa]s?)\s+(?:inscrib[ií]|afili[eé]|registr[eé]|met[ií]|vincul[eé])\s+yo\b|\byo\s+(?:l[oa]s?\s+)?(?:inscrib[ií]|afili[eé]|registr[eé]|vincul[eé])\b/i;
/** Y quiere trabajar el negocio. */
const RE_QUIERE_TRABAJAR =
  /\b(?:q[uúü]?(?:[iu]+e*|e+)r[ea]n?|quisiera|desea|le interesa|est[aá] interesad[oa] en|tiene ganas de|decidi[oó]|va a|quiero que)\b[^.?!\n]{0,30}?\b(?:generar|trabajar|activ[a-záéíóú]*|arrancar|empezar|empesar|comenzar|iniciar|volver|retomar|mover|desarrollar|crecer|ganar|hacer (?:el|este) (?:proyecto|negocio)|montar|producir)\b/i;

/**
 * Por la FORMA, no por la frase exacta (10 oct 2026): el modelo la escribió
 * «…necesito confirmar un dato: ¿ese código lo tiene con usted, en su sistema?»,
 * con minúscula, y el `includes` no la reconoció — la respuesta de Victor se fue
 * al modelo, que compuso el pedido de datos por su cuenta.
 */
export function botPreguntoCodigoConUsted(ultimoBot: string): boolean {
  const t = (ultimoBot || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  return /codigo lo tiene con usted/.test(t);
}

/**
 * ¿El socio habla de alguien que YA está en su sistema y quiere trabajarlo?
 * También el «sí» o «conmigo» a la pregunta del modelo. Lo que no dice de quién
 * es el código («tiene código en Gano y quiere volver») NO cae aquí: lo atiende el
 * esqueleto, que pregunta primero.
 */
export function detectarDistribuidorQuiereActivarse(texto: string, ultimoBot: string): boolean {
  const t = (texto || '').trim();
  if (!t) return false;
  if (botPreguntoCodigoConUsted(ultimoBot)) {
    if (/^\s*no\b/i.test(t)) return false;
    return esAceptacion(t) || /\b(?:c[oó]?n*[oó]?m?i?g[oó]|con ?migo|en mi (?:sistema|red|equipo|canal))\b/i.test(t);
  }
  return (RE_TIENE_CODIGO_CONMIGO.test(t) || RE_MI_DISTRIBUIDOR.test(t)) && RE_QUIERE_TRABAJAR.test(t);
}

export const FRASE_DATOS_DISTRIBUIDOR = 'su nombre completo, su WhatsApp y su código de Gano';
const MARCADOR_PASO_AL_EQUIPO = 'lo paso al equipo de creatuactivo.com';

/** Copy propuesto al Director el 5 oct 2026 y aplicado con su «soluciona». */
export const PIDE_DATOS_DISTRIBUIDOR =
  'Esa persona ya hace parte de su sistema, así que no es una invitación: lo que necesita es su propia cuenta y su propio enlace, igual que usted.\n\n'
  + `Mándeme en un solo mensaje ${FRASE_DATOS_DISTRIBUIDOR}, y el equipo de creatuactivo.com activa la cuenta; el enlace le llega a esa persona a su WhatsApp.`;

/** ¿El último turno del bot pidió los datos? La respuesta que sigue se lee como datos. */
export function botPidioDatosDistribuidor(ultimoBot: string): boolean {
  const t = ultimoBot || '';
  return t.includes(FRASE_DATOS_DISTRIBUIDOR) || t.includes(MARCADOR_PASO_AL_EQUIPO);
}

export interface DatosDistribuidor { nombre: string; whatsapp: string; codigo: string; faltan: string[] }

const cap = (p: string) => p.charAt(0).toLocaleUpperCase('es') + p.slice(1).toLocaleLowerCase('es');

/**
 * Saca nombre, WhatsApp y código de un mensaje escrito como la gente escribe:
 * «Se llama Carolina Pérez, su número es 300 123 4567 y el código 7020588».
 * El teléfono es el grupo de 10 dígitos que empieza por 3 (o con 57 / 1 delante);
 * el código, otro grupo de 5 a 9 dígitos o un GE…; el nombre, lo que queda sin
 * las palabras de relleno. Administración recibe además el mensaje tal cual.
 */
export function extraerDatosDistribuidor(texto: string): DatosDistribuidor {
  const t = (texto || '').replace(/\s+/g, ' ').trim();
  const vacio: DatosDistribuidor = { nombre: '', whatsapp: '', codigo: '', faltan: ['el nombre completo', 'el WhatsApp', 'el código de Gano'] };
  // Una pregunta no son datos; y una frase larga sin un solo dígito tampoco (un
  // nombre solo son dos a cinco palabras).
  if (/[?¿]/.test(t) || (!/\d/.test(t) && t.split(' ').length > 5)) return vacio;
  const grupos = [...t.matchAll(/\+?\d[\d\s.-]{3,}\d/g)].map((m) => m[0]);
  let whatsapp = '', codigo = '';
  for (const g of grupos) {
    const d = g.replace(/\D/g, '');
    const esTelefono = (d.length === 10 && d.startsWith('3')) || (d.length === 12 && d.startsWith('57')) || (d.length === 11 && d.startsWith('1'));
    if (!whatsapp && esTelefono) { whatsapp = normalizarWhatsApp(d); continue; }
    if (!codigo && d.length >= 5 && d.length <= 9) codigo = d;
  }
  const ge = /\bGE\s?\d{4,}\b/i.exec(t);
  if (ge && !codigo) codigo = ge[0].replace(/\s/g, '').toUpperCase();
  let resto = t;
  for (const g of grupos) resto = resto.replace(g, ' ');
  if (ge) resto = resto.replace(ge[0], ' ');
  resto = resto
    .replace(/\b(?:c[oó]digo|codigo)\s+(?:de\s+)?gano(?:\s+excel)?\b|\bn[uú]mero\s+de\s+(?:whatsapp|celular|tel[eé]fono)\b|\bnombre\s+completo\b/gi, ' ')
    .replace(/\b(?:se llama|su nombre es|nombre|es|son|su|el|la|los|las|del|n[uú]mero|numero|celular|cel|whatsapp|wa|tel[eé]fono|tel|c[oó]digo|codigo|gano|excel|id|y|con|aqu[ií]|van|est[aá]n|datos|le mando|mando|ah[ií]|ok|listo|ella|[eé]l|persona|distribuidor[a]?)\b/gi, ' ')
    .replace(/[:,;.()\-–—"«»]/g, ' ').replace(/\s+/g, ' ').trim();
  const palabras = resto.split(' ').filter((p) => /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü'’]{2,}$/.test(p)).slice(0, 5);
  const nombre = palabras.length >= 2 ? palabras.map(cap).join(' ') : '';
  const faltan = [!nombre && 'el nombre completo', !whatsapp && 'el WhatsApp', !codigo && 'el código de Gano'].filter(Boolean) as string[];
  return { nombre, whatsapp, codigo, faltan };
}

/** Faltan el nombre o el WhatsApp: se piden solo esos, en una línea. El código no frena. */
export function textoFaltanDatos(d: DatosDistribuidor): string {
  const faltan = d.faltan.filter((f) => f !== 'el código de Gano');
  const lista = faltan.length === 2 ? `${faltan[0]} y ${faltan[1]}` : faltan[0];
  return `Me falta ${lista} de esa persona. Mándemelo en un mensaje y ${MARCADOR_PASO_AL_EQUIPO}.`;
}

export function textoSolicitudEnviada(nombre: string): string {
  return `Listo. Le pasé los datos de ${nombre} al equipo de creatuactivo.com; cuando la cuenta quede activa, el enlace le llega a ${nombre} a su WhatsApp.`;
}

export const TEXTO_SOLICITUD_NO_ENVIADA =
  'No logré pasarle los datos al equipo ahora mismo. Escríbale a sistema@creatuactivo.com con el nombre completo, el WhatsApp y el código de Gano de esa persona, y administración la activa.';

/** El correo a administración, con el comando listo para copiar. Exportado para probarlo sin enviar. */
export function cuerpoSolicitudActivacion(socio: Pick<SocioIdentificado, 'nombre' | 'slug' | 'constructorId'>, telefonoSocio: string, d: DatosDistribuidor, mensajeOriginal: string): { asunto: string; texto: string } {
  const comando = `ACTIVAR ${d.nombre} ${d.whatsapp}${d.codigo ? ` ${d.codigo}` : ''}`;
  const asunto = `[Activación] ${d.nombre} — distribuidor de ${socio.nombre}`;
  const texto = [
    `${socio.nombre} (/${socio.slug}, ${socio.constructorId}, WhatsApp ${telefonoSocio}) pide por Queswa que se active a un distribuidor que ya tiene código en su sistema.`,
    '',
    `Nombre: ${d.nombre}`,
    `WhatsApp: ${d.whatsapp}`,
    `Código de Gano: ${d.codigo || '(no lo dio — pedírselo o buscarlo en el back office)'}`,
    '',
    'Si administración aprueba, el comando desde el número del Director al WABA:',
    comando,
    '',
    `Mensaje tal cual: «${mensajeOriginal}»`,
    `Fecha: ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}`,
  ].join('\n');
  return { asunto, texto };
}

/** Manda la solicitud a administración. Nunca lanza. */
export async function solicitarActivacionDistribuidor(
  socio: Pick<SocioIdentificado, 'nombre' | 'slug' | 'constructorId'>,
  telefonoSocio: string,
  d: DatosDistribuidor,
  mensajeOriginal: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) return { ok: false, error: 'sin RESEND_API_KEY' };
    const { asunto, texto } = cuerpoSolicitudActivacion(socio, telefonoSocio, d, mensajeOriginal);
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: FROM_EMAIL, to: [EQUIPO_EMAIL], subject: asunto, text: texto,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// ─── 2.226 El socio pide su acceso al Centro de Mando ────────────────────────

const RE_PIDE_ACCESO =
  /\b(?:m[aá]n+d?[ea]?m[ea]|env[ií]+[ae]?m[ea]|p[aá]s[ae]?m[ea]|dame|deme|reg[aá]l[ae]me|comp[aá]rt[ae]me|quiero|necesito|quisiera|me (?:puede|podr[ií]a|manda|env[ií]a|pasa))\b[^.?!\n]{0,40}?\b(?:ac+[eé]?s[oó]s?|entrar|ingresar|acceder|enlace|link|clave|contrase[ñn]a)\b/i;
/** «¿Cómo entro al centro de mando?»: la pregunta ya lo dice todo. */
const RE_COMO_ENTRO = /\bc[oó]mo (?:entro|ingreso|accedo|hago para entrar|puedo entrar|puedo ingresar)\b/i;
const RE_NO_PUEDO_ENTRAR =
  /\bno (?:puedo|logro|he podido|pude)\s+(?:entrar|ingresar|acceder)\b|\bse me (?:cerr[oó]|venci[oó]|expir[oó]|acab[oó])\b[^.?!\n]{0,20}\b(?:sesi[oó]n|acceso|enlace)\b/i;
/** El destino es el Centro de Mando, no el enlace del socio (que también se llama «queswa»). */
const RE_DESTINO_CENTRO_MANDO = /\b(?:queswa\.app|dashboard|centro de mando|plataforma|la app|aplicaci[oó]n|mi cuenta|panel)\b/i;
/** «el acceso para mi amigo» es otra cosa: el enlace del socio para un prospecto. */
const RE_PARA_OTRA_PERSONA = /\bpara\s+(?:mi|una?|el|la|ese|esa|alguien|[A-ZÁÉÍÓÚ][a-záéíóúñ]+)\b/;
const RE_ACCESO_A_OTRA_COSA = /\bac+[eé]?s[oó]\s+(?:a|al|a la)\s+(?:cat[aá]logo|los productos|la presentaci[oó]n|el video|los videos|la tabla)\b/i;

/** ¿El socio pide entrar a su Centro de Mando? Se le manda el acceso, sin invitación de por medio. */
export function detectarPideAcceso(texto: string): boolean {
  const t = (texto || '').trim();
  if (!t) return false;
  if (RE_PARA_OTRA_PERSONA.test(t) && !/\bpara\s+(?:m[ií]|entrar|ingresar|ver|revisar)\b/i.test(t)) return false;
  if (RE_ACCESO_A_OTRA_COSA.test(t)) return false;
  if (RE_NO_PUEDO_ENTRAR.test(t)) return true;
  if (RE_COMO_ENTRO.test(t)) return RE_DESTINO_CENTRO_MANDO.test(t) || /\bac+[eé]?s[oó]\b/i.test(t);
  const m = RE_PIDE_ACCESO.exec(t);
  if (!m) return false;
  if (/\bac+[eé]?s[oó]s?\b/i.test(m[0])) return true;
  return RE_DESTINO_CENTRO_MANDO.test(t);
}
