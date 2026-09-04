/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Cierre de WhatsApp — radicar la vinculación.
 *
 * POR QUÉ EXISTE: el motor `/api/nexus` trae una máquina de estados escrita para
 * la web. Cuando alguien declara que quiere arrancar, esa máquina dicta la tabla
 * ESP, pide nombre y número de WhatsApp, y remata con dos enlaces `wa.me` al
 * número del WABA. En el canal eso es un círculo: la persona YA está en esa
 * conversación, con ese número, y nos da un teléfono que el propio canal nos
 * entregó. Aquí el cierre es otro — dejar la vinculación radicada.
 *
 * Los cuatro datos no son una lista de deseos: son exactamente lo que
 * `/api/pre-afiliacion` exige para escribir en `pending_activations` (nombre,
 * cédula, ciudad, paquete). Sin uno solo, la petición vuelve con 400. El WhatsApp
 * no se pide porque el canal ya lo dio.
 *
 * PATRÓN: el mismo de `wa-apertura.ts`. Donde el nodo es determinístico, dicta el
 * backend. Si el modelo redactara este bloque, una paráfrasis razonable —"su
 * documento" en lugar de "número de identificación"— haría que la persona
 * mandara una foto de la cédula y el registro se cayera.
 *
 * ⚠️ El texto de `pedirDatos()` coincide a propósito con el bloque de cierre del
 * system prompt `queswa_whatsapp`. Es la red de seguridad: si el detector de
 * intención falla y el modelo llega al cierre por su cuenta, la respuesta de la
 * persona vuelve a caer aquí porque `RE_BOT_PIDIO_DATOS` reconoce ambas formas.
 * Al editar uno, editar el otro.
 */

import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { sendTemplate } from '@/lib/wa-channel';

// ─── El mismo cierre, en la web ──────────────────────────────────────────────
//
// Desde el 4 sep 2026 este nodo también lo corre el motor para el chat de
// creatuactivo.com (tenant `creatuactivo_marketing`): la web es el respaldo del
// canal si Meta lo cierra, y su cierre viejo remataba con enlaces `wa.me` al
// WABA — al número caído. La única diferencia es que la web no conoce el
// teléfono de la persona, así que ahí se pide un QUINTO dato: el WhatsApp
// donde el socio le va a escribir. Quien llama decide con `params.whatsapp`:
// si lo trae, son cuatro; si es null, son cinco.
//
// Y los avisos al equipo salen por plantilla de WhatsApp con respaldo por
// correo: si el canal está caído, el aviso llega igual.
import { detectarProducto } from '@/lib/wa-productos';

let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }
  return anthropicClient;
}

// ─── Detección de intención ───────────────────────────────────────────────────

/**
 * Volición explícita: la persona no pregunta por el proceso, declara que lo hace.
 *
 * Más estrecha que la `señalVolicion` de la web a propósito. "Quiero empezar a
 * entender cómo funciona" es exploración, no decisión, y tratarla como cierre
 * pone a alguien que apenas asoma frente a una petición de cédula.
 */
/**
 * ⚠️ AMPLIADO — 9 ago 2026, tras una prueba que salió bien en pantalla y mal en
 * la base. El Director escribió **"Me interesa iniciar"** y no matcheaba: el
 * cierre no corrió, `pending_activations` quedó en cero, y aun así la persona
 * leyó *"Con eso queda radicado, y le aviso a [socio]"*.
 *
 * Ese texto salió del bloque de respaldo del system prompt `queswa_whatsapp` —
 * el modelo recitándolo, no este nodo ejecutándose. La red de respaldo existe a
 * propósito, pero tiene un costo que no habíamos visto: **hace que el fallo sea
 * invisible.** El prospecto se cree radicado, el socio no recibe nada, y en
 * pantalla todo se ve perfecto. Solo se detecta consultando la base.
 *
 * Por eso las formas naturales importan tanto como las canónicas. Antes fallaban
 * *me interesa iniciar · me interesa arrancar · estoy listo · necesito empezar ·
 * cuente conmigo · ya me decidí · dónde me inscribo*.
 *
 * ⚠️ El lookbehind `(?<!\bno\s)` sobre *estoy listo* no es adorno: sin él,
 * **"no estoy listo" disparaba el cierre** — el peor falso positivo posible,
 * porque le pide los datos a quien acaba de decir que no.
 *
 * Verificado contra 26 frases (20 que deben disparar, 16 que no): 26/26.
 * Al ampliarlo, volver a correr esa comprobación — un falso positivo aquí es
 * más caro que un falso negativo.
 */
export const RE_VOLICION =
  /(quiero|deseo|quisiera|me gustar[ií]a|me interesa|voy a|listo para|lista para|necesito)\s+(arrancar|ini?[cs]i?ar|empe[zs]ar|comen[zs]ar|activar|entrar|vincularme|inscribirme|registrarme|afiliarme|anotarme|participar|comprar)\b(?!\s+a\s+(entender|ver|conocer|saber|aprender|mirar))|arranquemos|empecemos|comencemos|ini?[cs]i[eé]mos|hag[aá]moslo|me decido|ya me decid[ií]|me apunto|me anoto|me lanzo|cuente conmigo|(?<!\bno\s)estoy list[oa]\b|d[oó]nde\s+(pago|consigno|transfiero|deposito|me inscribo|me registro)|c[oó]mo\s+(pago|consigno|hago el pago)|quiero (el |ese |ese paquete|comprar)/i;

/**
 * El bot ya pidió datos — lo que llegue ahora pertenece al cierre.
 *
 * Reconoce el bloque de los cuatro (dictado o parafraseado por el modelo, que es
 * el camino de respaldo) y también las preguntas de un solo dato. La última
 * alternativa es la red bajo la red: pedir identificación y ciudad en el mismo
 * mensaje solo pasa aquí.
 */
const RE_BOT_PIDIO_DATOS =
  /para radicar su vinculaci[oó]n|necesito (cuatro|cinco) datos|me falta(n)? (un dato|estos datos)|nombre completo, como aparece|n[uú]mero de identificaci[oó]n|en qu[eé] ciudad est[aá]|cu[aá]l de los tres paquetes de inicio|n[uú]mero de whatsapp/i;

/**
 * Una pregunta a mitad del cierre no es un dato — es una duda, y merece respuesta.
 *
 * Sin esto, alguien que en medio de dar sus datos pregunta "¿cuánto vale el
 * ESP-2?" recibe otra vez la misma petición, como si no lo hubieran oído. Se le
 * devuelve el turno al motor, y el cierre retoma solo: `enCierre` mira los
 * últimos turnos del bot, no únicamente el anterior.
 */
// ⚠️ El cierre es (?![a-záéíóúñ]) y NO \b: el \b de JS no cierra tras vocal
// acentuada porque «é» no es carácter de palabra, así que «Qué producto…» y
// «Por qué…» —que terminan en é— nunca matchaban, y una pregunta de salud a
// mitad del cierre se leía como un dato y pedía el nombre (prueba del Director,
// 3 sep: «Qué producto ayuda para la artrosis» → «¿Cuál es su nombre completo?»).
// Mismo bug del \b que ya costó las puertas de «sí» con tilde.
const RE_PREGUNTA = /\?|^(qu[eé]|cu[aá]l|cu[aá]nto|c[oó]mo|por qu[eé]|cuando|cu[aá]ndo|d[oó]nde|qui[eé]n|hay|puedo|se puede|y si)(?![a-záéíóúñ])/i;

/**
 * Pedidos de información que NO llevan signo de interrogación.
 *
 * En la prueba del 7 ago, *"Explícame el bono binario"* cayó fuera de
 * `RE_PREGUNTA` —es imperativo, no pregunta— y el cierre lo atropelló pidiendo
 * la cédula dos veces seguidas. Alguien que quiere entender algo antes de
 * entregar sus datos merece respuesta, no un formulario que insiste.
 */
const RE_PEDIDO_INFO =
  /expl[ií]c|expl[ií]qu|cu[eé]nt[aeo]|mu[eé]stre?|mu[eé]str[ea]|d[ií]game|h[aá]bl[aeo]me|h[aá]blem|inf[oó]rme|quiero saber|no entiendo|me interesa saber|d[eé]jeme ver|antes de|dame (la )?(info|informaci[oó]n)|a[uú]n no|ahora no|todav[ií]a no|despu[eé]s|luego\b|m[aá]s tarde|primero/i;

/**
 * Temas de conversación que no son un dato del trámite.
 *
 * En la prueba del Director del 22 ago, *"Y LOS BENEFICIOS DEL CAFÉ LUVOCO"*
 * cayó fuera de las dos pruebas anteriores —sin signo de pregunta, sin verbo de
 * pedido— y con seis palabras justas no llegaba al umbral de longitud: el cierre
 * lo tomó por respuesta y pidió el nombre completo. Una frase nominal corta
 * (*"y el precio del Cordygold"*, *"la foto del latte"*) falla igual. Lo que el
 * trámite espera es un nombre, una cédula, una ciudad o un paquete, y ninguno
 * de esos lleva estas palabras ni nombra un producto — así que contarlas como
 * digresión no pierde ningún dato legítimo.
 */
/**
 * Aplazar o consultar con alguien no es un dato: «voy a consultarlo con mi esposa»
 * (23 ago) recibía «¿Cuál es su nombre completo?». Se devuelve al motor.
 */
const RE_APLAZAMIENTO =
  /consult|pensar|pensarlo|lo\s+pienso|hablar(lo)?\s+con|mi\s+(esposa|esposo|pareja|familia|mujer|marido|socio|se[ñn]ora)|despu[eé]s\s+le\s+(digo|aviso|cuento|escribo)|m[aá]s\s+adelante|ahorita\s+no|otro\s+d[ií]a|la\s+pr[oó]xima|cuando\s+pueda|con\s+calma/i;

const RE_TEMA =
  /beneficio|precio|costo|valor|cu[aá]nto vale|sabor|ingrediente|composici[oó]n|foto|imagen|bono|comisi[oó]n|simulador|ganancia|caf[eé]|c[aá]psula|m[aá]quina/i;

/** ¿El mensaje del bot estaba pidiendo justamente este dato? */
function pidioEsteDato(mensajeBot: string, clave: keyof DatosRadicacion): boolean {
  const t = mensajeBot.toLowerCase();
  switch (clave) {
    case 'nombre':  return /nombre completo/.test(t);
    case 'cedula':  return /n[uú]mero de identificaci[oó]n/.test(t);
    case 'ciudad':  return /en qu[eé] ciudad/.test(t);
    case 'paquete': return /cu[aá]l de los tres paquetes de inicio|con cu[aá]l de los tres se va/.test(t);
    case 'whatsapp': return /n[uú]mero de whatsapp/.test(t);
  }
}

/** Ya se radicó en esta conversación — el cierre no se vuelve a abrir. */
const RE_YA_RADICADO = /qued[oó] radicada|su vinculaci[oó]n qued[oó]|ya le avis[eé] a/i;

// ─── Paquetes ─────────────────────────────────────────────────────────────────

/**
 * `pending_activations.plan_type` acepta inicial / estrategico / visionario, y el
 * endpoint del Dashboard traduce desde ESP-1/2/3. Lo que NO reconoce es
 * "empresarial", que es justo como este sitio llama al ESP-2 en toda la tabla de
 * capitalización. Normalizamos a los códigos ESP antes de salir: es el único
 * vocabulario que las dos partes hablan.
 */
const PAQUETES: Record<string, 'ESP-1' | 'ESP-2' | 'ESP-3'> = {
  'esp-1': 'ESP-1', esp1: 'ESP-1', 'esp 1': 'ESP-1', '1': 'ESP-1', inicial: 'ESP-1',
  'esp-2': 'ESP-2', esp2: 'ESP-2', 'esp 2': 'ESP-2', '2': 'ESP-2', empresarial: 'ESP-2', estrategico: 'ESP-2', 'estratégico': 'ESP-2',
  'esp-3': 'ESP-3', esp3: 'ESP-3', 'esp 3': 'ESP-3', '3': 'ESP-3', visionario: 'ESP-3',
};

const NOMBRE_PAQUETE: Record<string, string> = {
  'ESP-1': 'ESP-1 Inicial',
  'ESP-2': 'ESP-2 Empresarial',
  'ESP-3': 'ESP-3 Visionario',
};

function normalizarPaquete(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const k = raw.toLowerCase().trim().replace(/[·.]/g, '').replace(/\s+/g, ' ');
  if (PAQUETES[k]) return PAQUETES[k];
  const m = k.match(/esp\s*-?\s*([123])/);
  return m ? PAQUETES[`esp-${m[1]}`] : null;
}

// ─── Extracción ───────────────────────────────────────────────────────────────

export interface DatosRadicacion {
  nombre: string | null;
  cedula: string | null;
  ciudad: string | null;
  paquete: string | null;   // ya normalizado a ESP-1 / ESP-2 / ESP-3
  /** Solo se pide cuando el canal no lo da (la web). Dígitos, con indicativo. */
  whatsapp?: string | null;
}

export type ClaveRadicacion = keyof DatosRadicacion;
/** Los cuatro de WhatsApp: el canal ya dio el teléfono. */
export const CLAVES_CANAL: readonly ClaveRadicacion[] = ['nombre', 'cedula', 'ciudad', 'paquete'];
/** Los cinco de la web. */
export const CLAVES_WEB: readonly ClaveRadicacion[] = ['nombre', 'cedula', 'ciudad', 'paquete', 'whatsapp'];

/** Un WhatsApp escrito como lo escribe la gente: con +, espacios, guiones o sin indicativo. */
function normalizarWhatsapp(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let d = raw.replace(/\D/g, '');
  if (d.length === 10 && d.startsWith('3')) d = `57${d}`;   // celular colombiano sin indicativo
  return d.length >= 11 && d.length <= 13 ? d : null;
}

const INSTRUCCIONES_EXTRACCION = `Eres un extractor de datos. No conversas con nadie.

Recibirás los últimos turnos de una conversación de WhatsApp donde un asistente pidió
cuatro datos para radicar una vinculación. Extrae lo que la PERSONA haya dado, en
cualquier turno.

Devuelve SOLO un objeto JSON, sin texto alrededor y sin bloque de código:
{"nombre": ..., "cedula": ..., "ciudad": ..., "paquete": ..., "whatsapp": ...}

Reglas:
- Use null para cualquier dato que la persona no haya dado. Nunca lo deduzca ni lo invente.
- "nombre": nombre completo de la persona (nombres y apellidos). Si solo dio el nombre de
  pila, devuélvalo igual. El primer mensaje suele traer el nombre del socio que la
  refirió ("vengo del enlace de luis-cabrejo"): ese NO es su nombre.
- "cedula": el número de identificación, solo dígitos. Un número de teléfono NO es la
  cédula: descarte los de 10 dígitos que empiezan por 3 y los que llevan prefijo +57.
- "ciudad": la ciudad donde vive. Un país no es una ciudad.
- "paquete": literalmente ESP-1, ESP-2 o ESP-3. Si dijo "el inicial" es ESP-1, "el
  empresarial" o "el estratégico" es ESP-2, "el visionario" es ESP-3. Quien acaba de
  ver la tabla suele nombrarlo por su contenido: 7 productos es ESP-1, 18 productos es
  ESP-2, 35 productos es ESP-3. También lo nombran por el precio, si la tabla lo
  mostró. Si nombró un paquete solo para preguntar por él, sin elegirlo, use null.
- "whatsapp": el número de WhatsApp que la persona dio para que le escriban, solo
  dígitos, con indicativo si lo dio. Un número de 10 dígitos que empieza por 3 es un
  celular colombiano, no una cédula. Si no dio ninguno, null.
- Lo que diga el asistente no es un dato de la persona. Solo cuentan los turnos del usuario.`;

/**
 * Lee los cuatro datos de los últimos turnos.
 *
 * Se hace con un modelo y no con expresiones regulares porque la gente responde
 * como habla: "Juan Pérez, 79345678, vivo en Bogotá y me voy con el de 18
 * productos" no se parte por comas de forma fiable. Nunca lanza — ante cualquier
 * fallo devuelve todo en null, y el flujo vuelve a pedir lo que falta.
 */
/**
 * Lee los cuatro datos cuando la persona los manda JUNTOS, sin llamar al modelo.
 *
 * Es la forma más común de responder al bloque de `pedirDatos()` —una línea por
 * dato— y no necesita inteligencia: la cédula es el número largo, el paquete es
 * el ESP, y de las líneas que quedan la del nombre tiene dos o más palabras.
 *
 * POR QUÉ EXISTE: la extracción con Haiku funciona, pero cuando falla —y falló
 * en la prueba del 21 ago— el trámite le vuelve a pedir el nombre a alguien que
 * acababa de escribirlo, con la cédula y la ciudad al lado. Eso enfría a quien
 * ya había decidido, que es el peor momento posible. Con esto, el camino más
 * frecuente no depende de una llamada de red.
 *
 * Devuelve null si no reconoce los cuatro: entonces decide Haiku, como siempre.
 */
export function extraerDeterministico(mensaje: string, conWhatsapp = false): DatosRadicacion | null {
  const lineas = mensaje.split(/[\n,;]+/).map((l) => l.trim()).filter(Boolean);
  if (lineas.length < (conWhatsapp ? 4 : 3)) return null;

  let cedula: string | null = null;
  let paquete: string | null = null;
  let whatsapp: string | null = null;
  const resto: string[] = [];

  for (const l of lineas) {
    const soloDigitos = l.replace(/[.\s+()-]/g, '');
    // En la web el teléfono llega como una línea más, y un celular colombiano
    // tiene diez dígitos: cabe en el rango de la cédula. Se reconoce primero
    // por su forma (empieza por 3, o trae el 57), y la cédula es lo que queda.
    if (conWhatsapp && !whatsapp && /^(57)?3\d{9}$/.test(soloDigitos)) { whatsapp = normalizarWhatsapp(soloDigitos); continue; }
    if (!cedula && /^\d{6,12}$/.test(soloDigitos)) { cedula = soloDigitos; continue; }
    const m = l.match(/esp\s*-?\s*([123])\b/i);
    if (!paquete && m) { paquete = `ESP-${m[1]}`; continue; }
    if (!paquete && /^(inicial|empresarial|visionario)$/i.test(l)) {
      paquete = /inicial/i.test(l) ? 'ESP-1' : /empresarial/i.test(l) ? 'ESP-2' : 'ESP-3';
      continue;
    }
    resto.push(l);
  }

  if (!cedula || !paquete || resto.length < 2) return null;
  if (conWhatsapp && !whatsapp) return null;

  // De lo que queda, el nombre es el de dos o más palabras; la ciudad, la otra.
  // Bogotá y Cali son de una palabra; "Luis Cabrejo" nunca de una.
  const soloLetras = (t: string) => /^[a-záéíóúñü.\s]+$/i.test(t);
  const candidatos = resto.filter(soloLetras);
  if (candidatos.length < 2) return null;
  const nombre = candidatos.find((t) => t.split(/\s+/).length >= 2) ?? null;
  const ciudad = candidatos.find((t) => t !== nombre) ?? null;
  if (!nombre || !ciudad) return null;

  return conWhatsapp ? { nombre, cedula, ciudad, paquete, whatsapp } : { nombre, cedula, ciudad, paquete };
}

export async function extraerDatosRadicacion(
  historial: { role: string; content: string }[],
  mensajeActual: string,
  conWhatsapp = false,
): Promise<DatosRadicacion> {
  const vacio: DatosRadicacion = { nombre: null, cedula: null, ciudad: null, paquete: null, whatsapp: null };

  // Camino corto: los datos juntos se leen sin modelo — cero latencia y,
  // sobre todo, cero forma de fallar por una llamada de red.
  const directo = extraerDeterministico(mensajeActual, conWhatsapp);
  if (directo) {
    console.log(`📝 [Radicación] los cuatro datos leídos sin modelo — ${directo.nombre} · ${directo.ciudad} · ${directo.paquete}`);
    return directo;
  }

  const recientes = historial.slice(-8);
  const transcripcion = [
    ...recientes.map((m) => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`),
    `Usuario: ${mensajeActual}`,
  ].join('\n');

  try {
    const respuesta = await getAnthropicClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: INSTRUCCIONES_EXTRACCION,
      messages: [{ role: 'user', content: `CONVERSACIÓN:\n${transcripcion}\n\nJSON:` }],
    });

    const bloque = respuesta.content.find((b) => b.type === 'text');
    const texto = bloque?.type === 'text' ? bloque.text.trim() : '';
    const json = texto.match(/\{[\s\S]*\}/);
    if (!json) return vacio;

    const crudo = JSON.parse(json[0]) as Record<string, unknown>;
    const limpiar = (v: unknown): string | null => {
      const s = typeof v === 'string' ? v.trim() : '';
      return s && s.toLowerCase() !== 'null' ? s : null;
    };

    const cedula = limpiar(crudo.cedula)?.replace(/\D/g, '') || null;

    const nombre = limpiar(crudo.nombre);

    const datos: DatosRadicacion = {
      // El campo pide el nombre como aparece en el documento, y con él se afilia
      // ante Gano Excel. Un nombre de pila suelto radicaría un registro que el
      // socio tendría que corregir a mano: es mejor un turno más de conversación.
      nombre: nombre && nombre.trim().split(/\s+/).length >= 2 ? nombre : null,
      // Una cédula colombiana tiene entre 6 y 10 dígitos. Fuera de ese rango es
      // otra cosa (un teléfono, un año, un precio) y radicar con ella deja un
      // registro que hay que corregir a mano.
      cedula: cedula && cedula.length >= 6 && cedula.length <= 12 ? cedula : null,
      ciudad: limpiar(crudo.ciudad),
      paquete: normalizarPaquete(limpiar(crudo.paquete)),
      whatsapp: conWhatsapp ? normalizarWhatsapp(limpiar(crudo.whatsapp)) : null,
    };

    console.log(
      `📝 [Radicación] extraído — nombre=${datos.nombre ?? '—'} cedula=${datos.cedula ? 'sí' : '—'} ` +
      `ciudad=${datos.ciudad ?? '—'} paquete=${datos.paquete ?? '—'}`,
    );
    return datos;
  } catch (err) {
    console.error('⚠️ [Radicación] Falló la extracción, se vuelve a pedir:', err);
    return vacio;
  }
}

// ─── Textos dictados ──────────────────────────────────────────────────────────

const ETIQUETAS: Record<ClaveRadicacion, string> = {
  nombre:   'Nombre completo, como aparece en su documento',
  cedula:   'Número de identificación',
  ciudad:   'La ciudad donde está',
  paquete:  'Cuál de los tres paquetes de inicio quiere',
  whatsapp: 'Un número de WhatsApp donde el socio pueda escribirle',
};

/** La misma petición en prosa, para cuando falta un solo dato. */
const EN_PROSA: Record<ClaveRadicacion, string> = {
  nombre:   'su nombre completo, como aparece en el documento',
  cedula:   'su número de identificación',
  ciudad:   'la ciudad donde está',
  paquete:  'cuál de los tres paquetes de inicio quiere',
  whatsapp: 'un número de WhatsApp donde el socio pueda escribirle',
};

const EN_LETRAS = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco'];

const JUSTIFICACION_CIUDAD =
  'La ciudad se la pido por algo práctico: si hay oficina de Gano Excel donde usted vive, la entrega se hace allá, así que de una vez conoce el lugar y al equipo. Si no hay, le llega a su dirección.';

/** Cómo se le devuelve a la persona cada dato que ya entregó. */
function ecoDe(clave: ClaveRadicacion, datos: DatosRadicacion): string | null {
  switch (clave) {
    case 'nombre':   return datos.nombre;
    case 'cedula':   return datos.cedula ? `Cédula ${datos.cedula}` : null;
    case 'ciudad':   return datos.ciudad;
    case 'paquete':  return datos.paquete ? NOMBRE_PAQUETE[datos.paquete] || datos.paquete : null;
    case 'whatsapp': return datos.whatsapp ? `WhatsApp ${datos.whatsapp}` : null;
  }
}

/**
 * Pide lo que falte, en un solo mensaje, después de confirmar lo que ya llegó.
 *
 * Los cuatro van juntos por decisión explícita: quien ya decidió quiere que le
 * empaquen lo que va a llevar, no que lo pongan en fila. Partirlos en cuatro
 * turnos convierte un formulario en un interrogatorio.
 *
 * Y casi nadie declara la intención a secas. Dice "quiero arrancar con el ESP-2",
 * o manda los cuatro datos de una porque ya supone cuáles se los van a pedir.
 * Volver a preguntar lo que acaba de entregar se lee como que no lo leímos — de
 * ahí que primero se le devuelva lo capturado, que además le deja ver un dígito
 * mal tecleado antes de que llegue al registro.
 *
 * La ciudad se justifica en el mismo renglón. Es lo que convierte un dato que se
 * le saca a alguien en una pregunta de servicio — y de paso adelanta el respaldo:
 * hay una oficina física, con gente.
 */
/**
 * Los paquetes de inicio canónicos son los tres empresariales — así los maneja
 * Gano Excel, así los nombra el liderazgo y así los va a oír la persona en
 * cualquier evento corporativo (Director, 3 sep 2026). El Kit no es un cuarto
 * paquete: es la MECÁNICA de entrada de Los 12 Niveles, y por eso solo se nombra
 * en ese hilo, como puente y después de los tres. La versión anterior lo ponía
 * primero y a los tres «si lo prefiere», que es la jerarquía al revés. Fuera del
 * hilo la etiqueta es la de los tres paquetes, sin más.
 */
const ETIQUETA_PAQUETE_KIT = 'Cuál de los tres paquetes de inicio quiere, o el Kit de Inicio si va con la estrategia de los 12 Niveles';

export function pedirDatos(
  datos: DatosRadicacion,
  socio?: string,
  enKit = false,
  claves: readonly ClaveRadicacion[] = CLAVES_CANAL,
): string {
  const faltantes = claves.filter((k) => !datos[k]);
  const partes: string[] = [];
  const etiqueta = (f: ClaveRadicacion) => (f === 'paquete' && enKit ? ETIQUETA_PAQUETE_KIT : ETIQUETAS[f]);

  // El nombre no se devuelve en una viñeta: se usa para saludar. Es el acuse de
  // recibo más cálido que existe y sale gratis — ya lo tenemos.
  const primerNombre = (datos.nombre || '').trim().split(/\s+/)[0] || '';
  const saludo = primerNombre
    ? `Perfecto, ${primerNombre[0].toUpperCase()}${primerNombre.slice(1)}.`
    : 'Perfecto.';

  if (faltantes.length === claves.length) {
    partes.push(
      'Con gusto. Le ayudo a dejarlo andando ahora mismo.',
      '',
      `Para radicar su vinculación necesito ${EN_LETRAS[claves.length]} datos:`,
      '',
      faltantes.map((f) => `• ${etiqueta(f)}`).join('\n'),
    );
  } else {
    // Lo ya capturado se confirma EN PROSA, no en lista. El inventario
    // —"Ya tengo: • X • Y / Me faltan dos datos: • Z"— se lee como un
    // formulario tachando casillas, y aparecía justo cuando la persona acababa
    // de entregar sus datos: cuanto más daba, más frío se ponía Queswa.
    // Se conserva el eco porque deja ver un dígito mal tecleado antes de que
    // llegue al registro; lo que cambia es que suene a que se escuchó.
    const eco = claves.filter((k) => k !== 'nombre')
      .map((k) => ecoDe(k, datos))
      .filter(Boolean) as string[];

    partes.push(eco.length > 0 ? `${saludo} Anoté ${enumerar(eco)}.` : saludo, '');

    if (faltantes.length === 1) {
      partes.push(`Me falta ${EN_PROSA[faltantes[0]]} y quedamos.`);
    } else if (faltantes.length === 2) {
      // Dos caben en una frase; tres ya piden lista para poder leerse.
      partes.push(`Me faltan dos cosas: ${EN_PROSA[faltantes[0]]}, y ${EN_PROSA[faltantes[1]]}.`);
    } else {
      partes.push(`Me faltan ${EN_LETRAS[faltantes.length]} datos:`, '', faltantes.map((f) => `• ${etiqueta(f)}`).join('\n'));
    }
  }

  if (faltantes.includes('ciudad')) partes.push('', JUSTIFICACION_CIUDAD);

  partes.push(
    '',
    `Con eso queda radicado, y le aviso a ${socio || 'su socio'} para que le confirme y coordinen el pago.`,
  );

  return partes.join('\n');
}

/** "A", "A y B", "A, B y C" — para enumerar sin que suene a lista de mercado. */
function enumerar(xs: string[]): string {
  if (xs.length <= 1) return xs[0] ?? '';
  return `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`;
}

/**
 * Pide un solo dato, como lo pediría una persona.
 *
 * El bloque de los cuatro sale UNA vez: sirve para que la persona sepa de qué
 * tamaño es el trámite y por qué se le pregunta la ciudad. De ahí en adelante se
 * toma dato por dato, porque casi nadie responde un formulario de corrido —
 * primero dice "ok, hagámoslo", y a esa señal un humano contesta pidiendo el
 * nombre, no repitiendo la lista entera. Repetirla se lee como que la máquina no
 * escuchó, que es justo lo que hace que alguien no quiera reenviarle esta
 * conversación a un amigo.
 */
export function pedirUnDato(
  clave: ClaveRadicacion,
  opciones: { reintento?: boolean; socio?: string } = {},
): string {
  const { reintento } = opciones;

  switch (clave) {
    case 'nombre':
      // "Empecemos" y no "Con gusto": el mensaje anterior de este mismo flujo
      // (`pedirDatos`) ya abrió con "Con gusto", y dos turnos seguidos con la
      // misma fórmula de cortesía es lo que hace que suene a máquina. Los cinco
      // acuses de este flujo son distintos a propósito — Con gusto · Perfecto ·
      // Empecemos · Gracias · Listo.
      return reintento
        ? 'Perdón, no lo capté bien. ¿Me confirma su nombre completo, con apellidos, como aparece en el documento?'
        : 'Empecemos, entonces. ¿Cuál es su *nombre completo*, como aparece en su documento?';

    case 'cedula':
      return reintento
        ? '¿Me repite el número de identificación? Solo los dígitos.'
        : 'Gracias. ¿Cuál es su *número de identificación*?';

    case 'ciudad':
      return [
        reintento ? '¿En qué ciudad está?' : 'Listo. ¿En qué ciudad está?',
        '',
        JUSTIFICACION_CIUDAD,
      ].join('\n');

    case 'paquete':
      return [
        reintento
          ? '¿Con cuál de los tres se va?'
          : 'Última cosa: ¿cuál de los tres paquetes de inicio quiere?',
        '',
        '• *ESP-1 Inicial* — 7 productos, para arrancar rápido',
        '• *ESP-2 Empresarial* — 18 productos, crecimiento sostenido',
        '• *ESP-3 Visionario* — 35 productos, máxima velocidad',
      ].join('\n');

    case 'whatsapp':
      return reintento
        ? '¿Me confirma el número de WhatsApp, con el indicativo del país?'
        : `Por último: ¿a qué número de WhatsApp le puede escribir ${opciones.socio || 'el socio'}?`;
  }
}

/**
 * Confirmación de que quedó radicado.
 *
 * Sin plazos ("en 24 horas") ni cifras: nada de eso lo sabe este código, y en
 * Colombia la Ley 1480 hace vinculante lo que se le ofrece al consumidor.
 * Tampoco se pide un solo dato de pago — eso lo cierra la persona, por seguridad
 * y porque es el momento de la conversación real.
 */
export function confirmarRadicado(datos: DatosRadicacion, socio?: string): string {
  const primerNombre = (datos.nombre || '').split(/\s+/)[0] || '';
  const paquete = NOMBRE_PAQUETE[datos.paquete || ''] || datos.paquete || '';

  return [
    `Listo${primerNombre ? ', ' + primerNombre : ''}. Su vinculación quedó radicada.`,
    '',
    `*${paquete}* · ${datos.ciudad}`,
    '',
    `Ya le avisé a ${socio || 'el equipo'}. Le confirma la aceptación y coordinan el pago directamente — ese paso lo cierra una persona, no yo.`,
    '',
    'Mientras tanto, si le queda alguna duda, aquí sigo.',
  ].join('\n');
}

/**
 * Cuando el registro no se pudo guardar.
 *
 * La persona no tiene por qué enterarse de un fallo de infraestructura, pero
 * tampoco puede quedarse esperando algo que no ocurrió: se le pasa al humano, que
 * es lo que iba a pasar de todos modos en el paso siguiente.
 */
export function radicacionFallida(socio?: string): string {
  return [
    'Tengo sus datos completos.',
    '',
    `Se los estoy pasando a ${socio || 'el equipo'} para que le confirme la aceptación y coordinen el pago. Le escriben directamente.`,
  ].join('\n');
}

// ─── Radicar contra el Dashboard ──────────────────────────────────────────────

/**
 * Deja la pre-afiliación en `pending_activations` y dispara los avisos.
 *
 * El endpoint vive en el Dashboard (queswa.app) porque ahí está el Centro de
 * Mando que la muestra, y se autentica con el mismo secreto del puente de canal.
 * Devuelve `false` ante cualquier fallo — el flujo sigue hacia el humano.
 */
export async function radicarPreAfiliacion(
  datos: DatosRadicacion,
  contexto: { whatsapp: string; fingerprintId: string; constructorId?: string },
): Promise<boolean> {
  const secreto = process.env.WA_BRIDGE_SECRET?.trim();
  if (!secreto) {
    console.error('🔐 [Radicación] WA_BRIDGE_SECRET no está definida — no se puede radicar');
    return false;
  }

  const base = process.env.DASHBOARD_URL || 'https://queswa.app';

  try {
    const res = await fetch(`${base}/api/pre-afiliacion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-wa-bridge-secret': secreto },
      body: JSON.stringify({
        nombre:        datos.nombre,
        cedula:        datos.cedula,
        ciudad:        datos.ciudad,
        paquete:       datos.paquete,
        whatsapp:      contexto.whatsapp,
        fingerprintId: contexto.fingerprintId,
        ...(contexto.constructorId && { constructorId: contexto.constructorId }),
      }),
    });

    if (!res.ok) {
      const detalle = await res.text().catch(() => '');
      console.error(`❌ [Radicación] ${base} respondió ${res.status}: ${detalle.slice(0, 200)}`);
      await avisarAlEquipo(datos, contexto.whatsapp);
      return false;
    }

    console.log(`✅ [Radicación] ${datos.nombre} · ${datos.paquete} · ${datos.ciudad} radicado`);
    return true;
  } catch (err) {
    console.error('❌ [Radicación] No se pudo alcanzar el Dashboard:', err);
    await avisarAlEquipo(datos, contexto.whatsapp);
    return false;
  }
}

/**
 * Red de seguridad: si el registro no se pudo escribir, el equipo se entera igual.
 *
 * Sin esto, `radicacionFallida()` le dice a la persona "se los estoy pasando al
 * equipo" y no se le pasa a nadie — una promesa que el sistema no cumple, que es
 * el peor desenlace posible en el momento más caliente del embudo.
 *
 * Ocurre de verdad: `pending_activations.invited_by` es NOT NULL, así que un
 * prospecto sin socio —el que llega por un anuncio, o el que escribe sin el
 * enlace de nadie— hace que el endpoint devuelva 500. Aquí el aviso sale igual.
 */
/**
 * Interés declarado sin cédula todavía: la persona eligió paquete y dio su
 * nombre, pero quiso seguir preguntando. El equipo recibe lo que ya hay para
 * que el socio la contacte en persona — el cierre humano es parte del diseño,
 * no un fallo del bot.
 */
const ETIQUETA_CORTA: Record<string, string> = {
  nombre: 'nombre', cedula: 'cédula', ciudad: 'ciudad', paquete: 'paquete', whatsapp: 'WhatsApp',
};
const ETIQUETA_LARGA: Record<string, string> = {
  nombre: 'su nombre completo', cedula: 'su número de identificación', ciudad: 'su ciudad', paquete: 'el paquete que quiere', whatsapp: 'su número de WhatsApp',
};

/**
 * Respaldo por correo de los avisos al equipo. La plantilla de WhatsApp es la
 * vía principal; si Meta la rechaza o el canal está caído —que es justo el
 * escenario en que la web hace de respaldo—, el equipo se entera igual.
 */
async function avisarPorCorreo(asunto: string, lineas: string[]): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Queswa <hola@creatuactivo.com>',
      to: [process.env.EQUIPO_DIRECTIVO_EMAIL || 'sistema@creatuactivo.com'],
      subject: asunto,
      text: lineas.join('\n'),
    });
    console.log(`📧 [Radicación] Aviso por correo enviado: ${asunto}`);
  } catch (err) {
    console.error('❌ [Radicación] Falló el aviso por correo:', err);
  }
}

async function avisarInteresParcial(
  datos: DatosRadicacion,
  faltantes: readonly ClaveRadicacion[],
  whatsapp: string,
  socio?: string,
): Promise<void> {
  const equipo = process.env.WHATSAPP_EQUIPO || '573206805737';
  const pendiente = faltantes.map((f) => ETIQUETA_CORTA[f]).join(', ') || '—';
  const lineas = [
    socio || 'equipo',
    `${datos.nombre || 'Sin nombre'} (${whatsapp}) · falta: ${pendiente}`,
    datos.paquete || '—',
    `${datos.ciudad || '—'} — INTERÉS DECLARADO, sigue preguntando; contactar en persona`,
  ];
  let ok = false;
  try {
    const r = await sendTemplate(equipo, 'pre_afiliacion_nueva', 'es', lineas);
    ok = r.ok;
    console.log(`📨 [Cierre WA] Interés parcial avisado al equipo: ${r.ok ? 'enviado' : r.error}`);
  } catch (err) {
    console.error('❌ [Cierre WA] No se pudo avisar el interés parcial:', err);
  }
  if (!ok) await avisarPorCorreo(`[Queswa] Interés declarado — ${datos.nombre || 'sin nombre'}`, lineas);
}

async function avisarAlEquipo(datos: DatosRadicacion, whatsapp: string): Promise<void> {
  const equipo = process.env.WHATSAPP_EQUIPO || '573206805737';
  const lineas = [
    'equipo',
    `${datos.nombre} (${whatsapp}) · CC ${datos.cedula}`,
    datos.paquete || '—',
    `${datos.ciudad} — NO SE PUDO RADICAR, registrar a mano`,
  ];
  let ok = false;
  try {
    const r = await sendTemplate(equipo, 'pre_afiliacion_nueva', 'es', lineas);
    ok = r.ok;
    console.log(`📨 [Radicación] Aviso de respaldo al equipo: ${r.ok ? 'enviado' : r.error}`);
  } catch (err) {
    console.error('❌ [Radicación] Falló hasta el aviso de respaldo:', err);
  }
  if (!ok) await avisarPorCorreo(`[Queswa] NO SE PUDO RADICAR — ${datos.nombre}`, lineas);
}

// ─── Orquestación ─────────────────────────────────────────────────────────────

export interface ResultadoCierre {
  /** Texto dictado que se le envía a la persona. */
  texto: string;
  /** Quedó escrito en `pending_activations`. */
  radicado: boolean;
  /** Los datos con que se radicó (la web guarda el WhatsApp en la ficha). */
  datos?: DatosRadicacion;
}

/**
 * ¿Este turno pertenece al cierre? Y si sí, ¿qué se responde?
 *
 * Devuelve `null` cuando el turno es conversación normal — ahí manda el motor.
 */
export async function gestionarCierre(params: {
  mensajeActual: string;
  historial: { role: string; content: string }[];
  /** El teléfono que dio el canal. `null` en la web: ahí se pide como quinto dato. */
  whatsapp: string | null;
  fingerprintId: string;
  socio?: string;
  constructorId?: string;
  /** El hilo es el de Los 12 Niveles (marca en la ficha o en el historial): el
   *  cuarto dato nombra el Kit. Lo computa el webhook. */
  hiloDoceNiveles?: boolean;
  /** Ya existe una pre-afiliación para este prospecto. */
  yaRadicadoEnBD?: boolean;
}): Promise<ResultadoCierre | null> {
  const { mensajeActual, historial, socio } = params;

  // Ya radicado: el cierre no se reabre. Si la persona quiere cambiar algo, lo
  // resuelve con el socio, que es quien tiene la conversación viva.
  if (params.yaRadicadoEnBD) return null;

  const turnosBot = historial.filter((m) => m.role === 'assistant').map((m) => m.content);
  const ultimoBot = turnosBot[turnosBot.length - 1] || '';
  if (RE_YA_RADICADO.test(ultimoBot)) return null;

  // Se miran los últimos turnos del bot, no solo el anterior: si la persona
  // interrumpió con una pregunta y el motor se la respondió, el cierre sigue
  // abierto y debe retomar donde iba.
  const botPidio = turnosBot.slice(-3).some((t) => RE_BOT_PIDIO_DATOS.test(t));
  const declara  = RE_VOLICION.test(mensajeActual);
  if (!botPidio && !declara) return null;

  // ── La volición que llega con una pregunta se responde antes de abrir el trámite ──
  //
  // "Me interesa iniciar, ¿hay una opción menor al ESP-1?" (prueba del Director,
  // 22 ago): el trámite se abría aquí mismo y pedía los cuatro datos, y la
  // pregunta quedaba sin respuesta. Quien pregunta a la vez que declara está
  // decidiendo con esa respuesta; atropellarla con un formulario es perder la
  // venta en el turno en que se ganaba. El turno va al motor; el trámite arranca
  // cuando la persona vuelva sobre él (el prompt del canal lleva el bloque de
  // cierre espejo como red, y ese texto dispara RE_BOT_PIDIO_DATOS).
  //
  // Excepción: cuando la pregunta ES el trámite — "quiero iniciar, ¿qué necesita
  // de mí?" — la respuesta correcta es pedir los datos.
  if (declara && !botPidio) {
    const t = mensajeActual.trim();
    const traePregunta = RE_PREGUNTA.test(t) || RE_PEDIDO_INFO.test(t) || RE_TEMA.test(t);
    const preguntaEsElTramite = /qu[eé]\s+(necesita|datos|sigue|hago|debo|tengo que|me pide)|c[oó]mo\s+(sigo|hago|procedo|es el proceso|pago|me inscribo|me registro)|cu[aá]l es el (paso|proceso|siguiente)|d[oó]nde\s+(pago|me inscribo)/i.test(t);
    if (traePregunta && !preguntaEsElTramite) {
      console.log(`❓ [Cierre WA] volición con pregunta ("${t.slice(0, 40)}") — primero responde el motor`);
      return null;
    }
  }

  // ── Un "sí" contesta la ÚLTIMA pregunta, y esa pregunta puede no ser nuestra ──
  //
  // El trámite se mira sobre los últimos tres turnos del bot, para que una duda a
  // mitad de camino no lo cancele. El efecto secundario es que, cuando el motor
  // atiende esa duda y cierra ofreciendo algo, el "sí" de la persona cae dentro
  // de la ventana del trámite y se lee como si volviera a él.
  //
  // Pasó en la prueba del Director (19 ago, 11:11): el motor cerró con "¿Le
  // muestro de dónde sale el ingreso de ese canal?", la persona dijo "sí", y
  // recibió "¿cuál es su número de identificación?". La respuesta a un sí es lo
  // ofrecido — cambiarla por una petición de datos rompe la conversación en el
  // punto donde más confianza hacía falta.
  //
  // Si el último turno del bot NO pidió datos y terminó preguntando, una
  // aceptación pelada es de esa oferta y el turno va al motor. El trámite no se
  // pierde: sigue abierto y retoma en cuanto la persona diga algo que no sea un sí.
  const _ultimoBotPidioDatos = RE_BOT_PIDIO_DATOS.test(ultimoBot);
  const _ultimoBotOfrecio    = /\?[\s"'*_)]*$/.test(ultimoBot.trim());
  const _aceptacionPelada    = /^(s[ií]|claro|dale|listo|ok(ay)?|bueno|por supuesto|obvio|de una|h[aá]gale|h[aá]galo|mu[eé]streme|mu[eé]stremelo|perfecto|vale|adelante|de acuerdo|me parece)[\s.,!]*$/i.test(mensajeActual.trim());
  if (!declara && !_ultimoBotPidioDatos && _ultimoBotOfrecio && _aceptacionPelada) {
    console.log(`👉 [Cierre WA] "${mensajeActual.trim()}" acepta la oferta del bot, no reanuda el trámite — turno al motor`);
    return null;
  }

  console.log(`🎯 [Cierre WA] activo — ${botPidio ? 'respondiendo lo pedido' : 'volición declarada'}`);

  // Se extrae SIEMPRE, también en el turno donde la persona declara la intención.
  // Casi nadie dice "quiero arrancar" a secas: dice "quiero arrancar con el
  // ESP-2", o "estoy listo, vivo en Bogotá", y en el comercio de GanoCafé mucha
  // gente manda los cuatro datos de una porque ya supone cuáles se los van a
  // pedir. Volver a pedir lo que acaban de entregar se lee como que no leímos.
  const claves = params.whatsapp ? CLAVES_CANAL : CLAVES_WEB;
  const datos = await extraerDatosRadicacion(historial, mensajeActual, !params.whatsapp);

  const faltantes = claves.filter((k) => !datos[k]);

  if (faltantes.length > 0) {
    // El bloque de los cuatro solo se entrega la primera vez, en el turno donde
    // la persona declara que arranca. De ahí en adelante, uno por uno.
    // En el hilo de Los 12 Niveles el cuarto dato nombra el Kit (ver ETIQUETA_PAQUETE_KIT).
    // ⚠️ Se lee en CUALQUIER rol y con dos marcas (prueba del Director, 3 sep
    // 2026): el historial son los últimos 12 turnos, y para cuando la persona
    // dijo «me interesa iniciar para el programa de 12 niveles» las dos
    // respuestas del bot que decían «12 Niveles» ya habían salido de la ventana
    // — pero su propio mensaje lo decía, y el del simulador («Acabo de usar el
    // simulador de Los 12 Niveles») también; y el texto tras el Flow dice
    // «duplicación 2×2». Con el detector viejo pidió «cuál de los tres paquetes».
    const enKit = !!params.hiloDoceNiveles || historial.some((m) => /12 Niveles|duplicaci[oó]n 2×2/i.test(m.content)) || /12 niveles/i.test(mensajeActual);
    if (!botPidio) return { texto: pedirDatos(datos, socio, enKit, claves), radicado: false };

    // Una duda a mitad del trámite se responde; el cierre no la atropella. Se
    // considera digresión todo lo que no traiga datos nuevos y además parezca
    // conversación: una pregunta, un pedido de información, o simplemente una
    // frase larga — nadie entrega una cédula en ocho palabras.
    const texto = mensajeActual.trim();
    // Un saludo a mitad del trámite no es un dato ni una digresión: la persona
    // volvió al chat. Sin esto recibía, palabra por palabra, la misma petición
    // del turno anterior («Empecemos, entonces. ¿Cuál es su nombre completo?»),
    // que se lee como que la máquina no notó que se fue y volvió (prueba del
    // Director, 23 ago). Se saluda y se recuerda en una línea qué falta.
    const esSaludo = /^(hola|holi|hey|buenas|buen[oa]s\s+(d[ií]as|tardes|noches)|qu[eé]\s+tal|hola de nuevo)[\s!.,]*$/i.test(texto);
    if (esSaludo) {
      return {
        texto: `Hola de nuevo. Sigo pendiente de ${enumerar(faltantes.map((f) => ETIQUETA_LARGA[f]))} para dejarlo radicado.`,
        radicado: false,
      };
    }
    const esDigresion =
      RE_PREGUNTA.test(texto) || RE_PEDIDO_INFO.test(texto) || RE_TEMA.test(texto) || RE_APLAZAMIENTO.test(texto)
      || detectarProducto(texto) !== null || texto.split(/\s+/).length > 6;
    if (esDigresion) {
      console.log(`❓ [Cierre WA] digresión ("${texto.slice(0, 40)}") — le devuelvo el turno al motor`);
      // La persona ya declaró interés y dio parte de sus datos, pero decidió
      // preguntar antes de entregar la cédula. Eso NO se pierde (decisión del
      // Director, 14 ago 2026): en la PRIMERA digresión se le avisa al equipo
      // con lo que ya hay —nombre, paquete, ciudad, WhatsApp— para que el socio
      // pueda contactarla en persona. La radicación no depende de insistir.
      // "Primera" = hasta ahora el bot ha pedido datos UNA sola vez.
      const vecesPedido = turnosBot.filter((t) => RE_BOT_PIDIO_DATOS.test(t)).length;
      const algoCapturado = Boolean(datos.nombre || datos.paquete || datos.ciudad);
      if (vecesPedido === 1 && algoCapturado) {
        await avisarInteresParcial(datos, faltantes, params.whatsapp ?? datos.whatsapp ?? 'sin WhatsApp', socio);
      }
      return null;
    }

    // ── Una cortesía no es un dato mal dado ──
    //
    // Prueba del Director, 22 ago: el bot pidió nombre y cédula, la persona
    // escribió "Gracias" y recibió "Perdón, no lo capté bien. ¿Me confirma su
    // nombre completo…?". Un gracias, un "ok" o un "ya se los mando" no son
    // intentos fallidos de dar el nombre: son la persona siendo amable, o
    // avisando que los manda después. Se acusa con la misma amabilidad, se le
    // recuerda en una línea qué falta, y el trámite queda abierto sin insistir.
    const _cortesia = /^(muchas |mil )?gracias[\s.!]*$|^(ok(ay)?|vale|listo|perfecto|entendido|de acuerdo|claro|bueno|genial|super|s[uú]per)(,?\s*(muchas )?gracias)?[\s.!]*$/i.test(texto);
    const _promesaEnvio = /ya (se|te) los? (mando|env[ií]o|paso|comparto|escribo)|(ahora|ahorita|en un (momento|rato|minuto)|m[aá]s tarde|luego|despu[eé]s) (se|te) los? (mando|env[ií]o|paso)|d[eé]me un (momento|minuto|segundo)|un momento/i.test(texto);
    if (_cortesia || _promesaEnvio) {
      const etiqueta: Record<ClaveRadicacion, string> = {
        nombre: 'su nombre completo', cedula: 'su número de identificación',
        ciudad: 'su ciudad', paquete: 'el paquete con el que arranca',
        whatsapp: 'su número de WhatsApp',
      };
      const queFalta = enumerar(faltantes.map((k) => etiqueta[k]));
      const plural = faltantes.length > 1;
      console.log(`🙏 [Cierre WA] cortesía ("${texto.slice(0, 30)}") — se acusa y el trámite sigue abierto`);
      return {
        texto: _promesaEnvio
          ? `Perfecto, quedo pendiente. Cuando me ${plural ? 'mande' : 'mande'} ${queFalta}, lo dejo radicado.`
          : `A usted. Cuando tenga a mano ${queFalta}, me ${plural ? 'los' : 'lo'} escribe por aquí y lo dejo radicado.`,
        radicado: false,
      };
    }

    const siguiente = faltantes[0];
    // Si el turno anterior ya pedía justo este dato, la persona no lo dio o no se
    // entendió: se pregunta de otra forma, no con la misma frase. El bloque de los
    // cuatro no cuenta — los nombra todos, y tomarlo por un reintento hacía que el
    // primer dato pedido de a uno saliera con un "¿me repite...?" fuera de lugar.
    // Cuenta como reintento SOLO si el turno anterior pidió ese dato **a solas**.
    // El bloque de `pedirDatos` los nombra todos, así que tomarlo por reintento
    // hacía que el primer dato pedido de a uno saliera con "¿me repite…?" a alguien
    // que nunca lo había dado — pasó en la prueba del 7 ago con la cédula.
    // El acuse de cortesía ("A usted. Cuando tenga a mano…" / "quedo pendiente") también nombra
    // los datos que faltan, y tampoco es un pedido fallido: el dato siguiente se pide limpio.
    const esBloqueDePedirDatos = /necesito (cuatro|cinco) datos|me falta(n)? (un dato|estos datos|\w+ datos)|ya tengo:|^a usted\.|quedo pendiente/i.test(ultimoBot);
    const reintento = !esBloqueDePedirDatos && pidioEsteDato(ultimoBot, siguiente);

    return { texto: pedirUnDato(siguiente, { reintento, socio }), radicado: false };
  }

  const ok = await radicarPreAfiliacion(datos, {
    whatsapp:      params.whatsapp ?? datos.whatsapp ?? '',
    fingerprintId: params.fingerprintId,
    constructorId: params.constructorId,
  });

  return {
    texto: ok ? confirmarRadicado(datos, socio) : radicacionFallida(socio),
    radicado: ok,
    datos,
  };
}
