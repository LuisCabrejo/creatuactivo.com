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
import { sendTemplate } from '@/lib/wa-channel';

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
const RE_VOLICION =
  /(quiero|deseo|quisiera|me gustar[ií]a|voy a|listo para)\s+(arrancar|iniciar|empezar|comenzar|activar|entrar|vincularme|inscribirme|registrarme|afiliarme|anotarme|participar)\b(?!\s+a\s+(entender|ver|conocer|saber|aprender|mirar))|arranquemos|empecemos|comencemos|inici[eé]mos|hag[aá]moslo|me decido|me apunto|me anoto|me lanzo|d[oó]nde\s+(pago|consigno|transfiero|deposito)|c[oó]mo\s+(pago|consigno|hago el pago)|quiero (el |ese |ese paquete|comprar)/i;

/**
 * El bot ya pidió datos — lo que llegue ahora pertenece al cierre.
 *
 * Reconoce el bloque de los cuatro (dictado o parafraseado por el modelo, que es
 * el camino de respaldo) y también las preguntas de un solo dato. La última
 * alternativa es la red bajo la red: pedir identificación y ciudad en el mismo
 * mensaje solo pasa aquí.
 */
const RE_BOT_PIDIO_DATOS =
  /para radicar su vinculaci[oó]n|necesito cuatro datos|me falta(n)? (un dato|estos datos)|nombre completo, como aparece|n[uú]mero de identificaci[oó]n|en qu[eé] ciudad est[aá]|cu[aá]l de los tres paquetes de inicio|(?=[\s\S]*n[uú]mero de identificaci[oó]n)(?=[\s\S]*ciudad)/i;

/**
 * Una pregunta a mitad del cierre no es un dato — es una duda, y merece respuesta.
 *
 * Sin esto, alguien que en medio de dar sus datos pregunta "¿cuánto vale el
 * ESP-2?" recibe otra vez la misma petición, como si no lo hubieran oído. Se le
 * devuelve el turno al motor, y el cierre retoma solo: `enCierre` mira los
 * últimos turnos del bot, no únicamente el anterior.
 */
const RE_PREGUNTA = /\?|^(qu[eé]|cu[aá]l|cu[aá]nto|c[oó]mo|por qu[eé]|cuando|cu[aá]ndo|d[oó]nde|qui[eé]n|hay |puedo|se puede|y si)\b/i;

/**
 * Pedidos de información que NO llevan signo de interrogación.
 *
 * En la prueba del 7 ago, *"Explícame el bono binario"* cayó fuera de
 * `RE_PREGUNTA` —es imperativo, no pregunta— y el cierre lo atropelló pidiendo
 * la cédula dos veces seguidas. Alguien que quiere entender algo antes de
 * entregar sus datos merece respuesta, no un formulario que insiste.
 */
const RE_PEDIDO_INFO =
  /expl[ií]c|expl[ií]qu|cu[eé]nt[aeo]|mu[eé]stre?|mu[eé]str[ea]|d[ií]game|h[aá]bl[aeo]me|h[aá]blem|inf[oó]rme|quiero saber|no entiendo|me interesa saber|d[eé]jeme ver|antes de/i;

/** ¿El mensaje del bot estaba pidiendo justamente este dato? */
function pidioEsteDato(mensajeBot: string, clave: keyof DatosRadicacion): boolean {
  const t = mensajeBot.toLowerCase();
  switch (clave) {
    case 'nombre':  return /nombre completo/.test(t);
    case 'cedula':  return /n[uú]mero de identificaci[oó]n/.test(t);
    case 'ciudad':  return /en qu[eé] ciudad/.test(t);
    case 'paquete': return /cu[aá]l de los tres paquetes de inicio|con cu[aá]l de los tres se va/.test(t);
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
}

const INSTRUCCIONES_EXTRACCION = `Eres un extractor de datos. No conversas con nadie.

Recibirás los últimos turnos de una conversación de WhatsApp donde un asistente pidió
cuatro datos para radicar una vinculación. Extrae lo que la PERSONA haya dado, en
cualquier turno.

Devuelve SOLO un objeto JSON, sin texto alrededor y sin bloque de código:
{"nombre": ..., "cedula": ..., "ciudad": ..., "paquete": ...}

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
- Lo que diga el asistente no es un dato de la persona. Solo cuentan los turnos del usuario.`;

/**
 * Lee los cuatro datos de los últimos turnos.
 *
 * Se hace con un modelo y no con expresiones regulares porque la gente responde
 * como habla: "Juan Pérez, 79345678, vivo en Bogotá y me voy con el de 18
 * productos" no se parte por comas de forma fiable. Nunca lanza — ante cualquier
 * fallo devuelve todo en null, y el flujo vuelve a pedir lo que falta.
 */
export async function extraerDatosRadicacion(
  historial: { role: string; content: string }[],
  mensajeActual: string,
): Promise<DatosRadicacion> {
  const vacio: DatosRadicacion = { nombre: null, cedula: null, ciudad: null, paquete: null };

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

const ETIQUETAS: Record<keyof DatosRadicacion, string> = {
  nombre:  'Nombre completo, como aparece en su documento',
  cedula:  'Número de identificación',
  ciudad:  'La ciudad donde está',
  paquete: 'Cuál de los tres paquetes de inicio quiere',
};

/** La misma petición en prosa, para cuando falta un solo dato. */
const EN_PROSA: Record<keyof DatosRadicacion, string> = {
  nombre:  'su nombre completo, como aparece en el documento',
  cedula:  'su número de identificación',
  ciudad:  'la ciudad donde está',
  paquete: 'cuál de los tres paquetes de inicio quiere',
};

const JUSTIFICACION_CIUDAD =
  'La ciudad se la pido por algo práctico: si hay oficina de Gano Excel donde usted vive, la entrega se hace allá — así conoce el lugar y a la gente. Si no hay, le llega a su dirección.';

/** Cómo se le devuelve a la persona cada dato que ya entregó. */
function ecoDe(clave: keyof DatosRadicacion, datos: DatosRadicacion): string | null {
  switch (clave) {
    case 'nombre':  return datos.nombre;
    case 'cedula':  return datos.cedula ? `Cédula ${datos.cedula}` : null;
    case 'ciudad':  return datos.ciudad;
    case 'paquete': return datos.paquete ? NOMBRE_PAQUETE[datos.paquete] || datos.paquete : null;
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
export function pedirDatos(datos: DatosRadicacion, socio?: string): string {
  const claves = ['nombre', 'cedula', 'ciudad', 'paquete'] as const;
  const faltantes = claves.filter((k) => !datos[k]);
  const capturados = claves.map((k) => ecoDe(k, datos)).filter(Boolean) as string[];

  const partes: string[] = [];

  if (capturados.length === 0) {
    partes.push(
      'Con gusto. Le ayudo a dejarlo andando ahora mismo.',
      '',
      'Para radicar su vinculación necesito cuatro datos:',
      '',
      faltantes.map((f) => `• ${ETIQUETAS[f]}`).join('\n'),
    );
  } else {
    partes.push('Perfecto. Ya tengo:', '', capturados.map((c) => `• ${c}`).join('\n'), '');

    if (faltantes.length === 1) {
      partes.push(`Me falta ${EN_PROSA[faltantes[0]]}.`);
    } else {
      partes.push(
        `Me faltan ${faltantes.length === 2 ? 'dos' : 'tres'} datos:`,
        '',
        faltantes.map((f) => `• ${ETIQUETAS[f]}`).join('\n'),
      );
    }
  }

  if (faltantes.includes('ciudad')) partes.push('', JUSTIFICACION_CIUDAD);

  partes.push(
    '',
    `Con eso queda radicado, y le aviso a ${socio || 'su socio'} para que le confirme y coordinen el pago.`,
  );

  return partes.join('\n');
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
  clave: keyof DatosRadicacion,
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
async function avisarAlEquipo(datos: DatosRadicacion, whatsapp: string): Promise<void> {
  const equipo = process.env.WHATSAPP_EQUIPO || '573206805737';
  try {
    const r = await sendTemplate(equipo, 'pre_afiliacion_nueva', 'es', [
      'equipo',
      `${datos.nombre} (${whatsapp}) · CC ${datos.cedula}`,
      datos.paquete || '—',
      `${datos.ciudad} — NO SE PUDO RADICAR, registrar a mano`,
    ]);
    console.log(`📨 [Radicación] Aviso de respaldo al equipo: ${r.ok ? 'enviado' : r.error}`);
  } catch (err) {
    console.error('❌ [Radicación] Falló hasta el aviso de respaldo:', err);
  }
}

// ─── Orquestación ─────────────────────────────────────────────────────────────

export interface ResultadoCierre {
  /** Texto dictado que se le envía a la persona. */
  texto: string;
  /** Quedó escrito en `pending_activations`. */
  radicado: boolean;
}

/**
 * ¿Este turno pertenece al cierre? Y si sí, ¿qué se responde?
 *
 * Devuelve `null` cuando el turno es conversación normal — ahí manda el motor.
 */
export async function gestionarCierre(params: {
  mensajeActual: string;
  historial: { role: string; content: string }[];
  whatsapp: string;
  fingerprintId: string;
  socio?: string;
  constructorId?: string;
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

  console.log(`🎯 [Cierre WA] activo — ${botPidio ? 'respondiendo lo pedido' : 'volición declarada'}`);

  // Se extrae SIEMPRE, también en el turno donde la persona declara la intención.
  // Casi nadie dice "quiero arrancar" a secas: dice "quiero arrancar con el
  // ESP-2", o "estoy listo, vivo en Bogotá", y en el comercio de GanoCafé mucha
  // gente manda los cuatro datos de una porque ya supone cuáles se los van a
  // pedir. Volver a pedir lo que acaban de entregar se lee como que no leímos.
  const datos = await extraerDatosRadicacion(historial, mensajeActual);

  const faltantes = (['nombre', 'cedula', 'ciudad', 'paquete'] as const).filter((k) => !datos[k]);

  if (faltantes.length > 0) {
    // El bloque de los cuatro solo se entrega la primera vez, en el turno donde
    // la persona declara que arranca. De ahí en adelante, uno por uno.
    if (!botPidio) return { texto: pedirDatos(datos, socio), radicado: false };

    // Una duda a mitad del trámite se responde; el cierre no la atropella. Se
    // considera digresión todo lo que no traiga datos nuevos y además parezca
    // conversación: una pregunta, un pedido de información, o simplemente una
    // frase larga — nadie entrega una cédula en ocho palabras.
    const texto = mensajeActual.trim();
    const esDigresion =
      RE_PREGUNTA.test(texto) || RE_PEDIDO_INFO.test(texto) || texto.split(/\s+/).length > 6;
    if (esDigresion) {
      console.log(`❓ [Cierre WA] digresión ("${texto.slice(0, 40)}") — le devuelvo el turno al motor`);
      return null;
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
    const esBloqueDePedirDatos = /necesito cuatro datos|me falta(n)? (un dato|estos datos|\w+ datos)|ya tengo:/i.test(ultimoBot);
    const reintento = !esBloqueDePedirDatos && pidioEsteDato(ultimoBot, siguiente);

    return { texto: pedirUnDato(siguiente, { reintento, socio }), radicado: false };
  }

  const ok = await radicarPreAfiliacion(datos, {
    whatsapp:      params.whatsapp,
    fingerprintId: params.fingerprintId,
    constructorId: params.constructorId,
  });

  return {
    texto: ok ? confirmarRadicado(datos, socio) : radicacionFallida(socio),
    radicado: ok,
  };
}
