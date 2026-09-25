/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * LA BITÁCORA — lo que Queswa recuerda de la conversación COMPLETA.
 *
 * ── POR QUÉ EXISTE (24 sep 2026) ─────────────────────────────────────────────
 *
 * Hasta hoy el modelo veía, en cada turno, los PRIMEROS cinco turnos de la
 * conversación (resumidos a cien caracteres) y los ÚLTIMOS tres intercambios.
 * Todo lo del medio no existía para él. En la prueba del Director (24 sep,
 * 29 turnos) eso se vio entero: en el turno 22 Queswa le volvió a explicar el
 * día a día que ya le había explicado en el 9, y ofreció por tercera vez los
 * productos, y el Director escribió «no me gusta que me repitas las preguntas».
 *
 * El Director pidió que Queswa fuera perspicaz «como un humano, como cuando
 * hablo contigo o con Gemini», y no que respondiera con un texto fijo a cada
 * queja: la persona puede estar equivocada, o confundida por otra razón. La
 * investigación (docs/investigaciones/resultados/
 * QUESWA_PERSPICAZ_COMO_LO_RESUELVEN_LOS_LIDERES_SEP2026.md) dice lo mismo que
 * él: los líderes dejan la conversación al modelo y los datos al código, y en
 * conversaciones largas le dan al modelo una NOTA ESTRUCTURADA de lo ocurrido
 * (Anthropic, *context engineering*). Esta es esa nota.
 *
 * ── QUÉ LLEVA ─────────────────────────────────────────────────────────────────
 *
 *   · lo que la persona ha escrito, en orden (sus palabras, cortas);
 *   · lo que ya se le mostró, por tema, con el turno;
 *   · lo que ha dicho de sí: dónde vive, a qué se dedica, con quién lo consulta;
 *   · el siguiente paso que aún no ha visto.
 *
 * ⚠️ Son HECHOS, no prohibiciones. El Director lo ha visto muchas veces: una
 * lista de «no repita esto» se lee como instrucción de repetirlo. La bitácora
 * dice qué pasó y cuál es el paso natural; qué hacer con eso lo decide el
 * modelo, que es justo lo que se le pide.
 *
 * ⚠️ Aquí no hay llamadas a la base ni al modelo: recibe las filas y devuelve
 * texto. Así la vigila `scripts/prueba-bitacora.mts` sin tocar producción.
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface MensajeBitacora {
  role: string;
  content: string;
}

/** Una fila de `nexus_conversations`: un turno (mensaje de la persona + respuesta). */
export interface FilaBitacora {
  messages?: MensajeBitacora[] | null;
  created_at?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface TemaBitacora {
  id: string;
  /** Cómo se le nombra al modelo en la bitácora. */
  nombre: string;
  /** Cómo se reconoce en el texto que ya recibió la persona. */
  firma: RegExp;
  /** Categorías del arsenal que, servidas, cuentan como este tema. */
  fragmentos?: string[];
}

// ─── Los temas ────────────────────────────────────────────────────────────────
//
// Las firmas son frases de los textos APROBADOS —los candados y los nodos
// dictados—, así que reconocen lo que la persona leyó aunque lo haya mandado el
// webhook sin dejar rastro del fragmento (el «Cómo funciona» del botón de la
// apertura, por ejemplo). Si se reescribe el arranque de uno de esos textos, se
// actualiza su firma aquí: `prueba-bitacora.mts` avisa cuando una deja de
// reconocer.

export const TEMAS: TemaBitacora[] = [
  {
    id: 'como_funciona',
    nombre: 'cómo funciona el negocio (los tres elementos ensamblados y el cliente a su nombre)',
    // La firma vieja (la franquicia) se conserva: el historial de quien la
    // recibió antes del 25 sep 2026 sigue en sus últimas 40 filas.
    firma: /tres elementos de un negocio moderno|l[oó]gica de una franquicia|Vender hamburguesas lo puede hacer cualquiera/i,
    fragmentos: ['arsenal_inicial_WHY_02'],
  },
  {
    id: 'que_es',
    nombre: 'qué es un sistema de distribución',
    firma: /Aqu[ií] lo llamamos \*{0,2}sistema de distribuci[oó]n/i,
    fragmentos: ['arsenal_inicial_EMPRESA_DIGITAL_01'],
  },
  {
    id: 'dinero',
    nombre: 'de dónde sale el dinero (del producto que se vende por su sistema)',
    firma: /El dinero sale de una sola fuente/i,
    fragmentos: ['arsenal_inicial_WHY_04'],
  },
  {
    id: 'estrategia',
    nombre: 'la estrategia de Los 12 Niveles, con el Kit de Inicio',
    firma: /Los 12 Niveles es nuestra estrategia/i,
    fragmentos: ['arsenal_12_niveles_NIVELES_01'],
  },
  {
    id: 'simulador',
    nombre: 'el simulador de ingresos',
    firma: /\[Simulador (enviado|reenviado)\]|Ese es el \*?nivel \d+|comprados en cada una de las cinco generaciones/i,
  },
  {
    id: 'ganancia_paquetes',
    nombre: 'las ganancias por la compra de paquetes empresariales (el Bono GEN5)',
    firma: /bono por la compra de paquetes empresariales|Hay tres paquetes empresariales, cada uno con su inventario/i,
  },
  {
    id: 'dia_a_dia',
    nombre: 'qué haría en el día a día (Compartir y Recibir)',
    firma: /Su d[ií]a a d[ií]a se resume en dos acciones/i,
    fragmentos: ['arsenal_inicial_EAM_01'],
  },
  {
    id: 'productos',
    nombre: 'los productos: las cuatro líneas y el Ganoderma',
    firma: /22 productos en cuatro l[ií]neas|Portafolio Gano Excel\*? · 22 productos/i,
    fragmentos: ['arsenal_inicial_WHY_PROD_01'],
  },
  {
    id: 'catalogo',
    nombre: 'el enlace al catálogo con precios',
    // Con socio (`/luis-cabrejo/productos`) o sin él (`/productos`).
    firma: /(creatuactivo\.com|localhost:\d+)\/([a-z0-9-]+\/)?productos\b/i,
  },
  {
    id: 'paquetes',
    nombre: 'los tres paquetes empresariales con su precio',
    firma: /ESP-1 Inicial[\s\S]{0,300}ESP-2[\s\S]{0,300}ESP-3/i,
    fragmentos: ['arsenal_inicial_FREQ_03'],
  },
  {
    id: 'recomendacion_paquete',
    nombre: 'con cuál paquete empezar (el que le resulte cómodo)',
    firma: /Con el que le resulte c[oó]modo hoy/i,
    fragmentos: ['arsenal_inicial_FREQ_30'],
  },
  {
    id: 'perfil_independiente',
    nombre: 'por qué le sirve a quien trabaja por su cuenta',
    firma: /lo m[aá]s dif[ií]cil de trabajar por su cuenta|Sumar clientes no le suma horas/i,
    fragmentos: ['arsenal_inicial_PERFIL_02'],
  },
  {
    id: 'perfil_empresario',
    nombre: 'por qué le sirve a un empresario: escalar sin crecer la operación',
    firma: /El problema llega al crecer|Atender a mil personas no le cuesta a usted una hora m[aá]s/i,
    fragmentos: ['arsenal_avanzado_ADV_OBJ_02'],
  },
  {
    id: 'diaspora',
    nombre: 'cómo se hace desde fuera del país (el sistema se ancla a un país de América)',
    firma: /se ancla a su pa[ií]s natal|queda anclado a (su|ese) pa[ií]s/i,
    fragmentos: ['arsenal_inicial_DIASPORA_01', 'arsenal_inicial_DIASPORA_02', 'arsenal_inicial_DIASPORA_03'],
  },
  {
    id: 'pareja',
    nombre: 'el enlace para que su pareja le escriba a Queswa',
    firma: /creatuactivo\.com\/s\/\d+/i,
  },
  {
    id: 'radicacion',
    nombre: 'la toma de datos de la vinculación',
    firma: /(Me faltan|necesito) (un|dos|tres|cuatro|cinco) datos|Anot[eé] (el )?(ESP-[123]|Kit)|queda radicad/i,
  },
];

const TEMA_POR_ID = new Map(TEMAS.map((t) => [t.id, t]));

// ─── El recorrido y las ofertas ───────────────────────────────────────────────
//
// El orden natural de lo que una persona necesita ver. Cada oferta es una
// pregunta YA APROBADA del arsenal, cuyo «sí» tiene destino escrito: la
// aceptación busca con la pregunta del bot, y el índice del destino la lleva
// literal. Por eso aquí no se redacta ninguna pregunta nueva.

export const RECORRIDO: { tema: string; oferta: string }[] = [
  { tema: 'como_funciona', oferta: '¿Le cuento cómo funciona el negocio?' },
  { tema: 'estrategia', oferta: '¿Le muestro la estrategia con la que se construye ese sistema, paso a paso?' },
  { tema: 'dia_a_dia', oferta: '¿Le muestro qué haría usted en el día a día?' },
  { tema: 'productos', oferta: '¿Le muestro los productos que mueven todo esto?' },
  { tema: 'catalogo', oferta: '¿Le muestro el catálogo completo con precios?' },
  { tema: 'paquetes', oferta: '¿Le muestro las tres formas de empezar?' },
];

/** De qué tema es una pregunta de cierre. Null si no se reconoce. */
const OFERTA_A_TEMA: [RegExp, string][] = [
  [/d[ií]a a d[ií]a|qu[eé] (hace|har[ií]a) usted/i, 'dia_a_dia'],
  [/los productos que mueven|le (muestro|cuento) (cu[aá]les son )?los productos\b|para qu[eé] sirven los productos/i, 'productos'],
  [/cat[aá]logo/i, 'catalogo'],
  [/la estrategia|c[oó]mo se construye ese sistema/i, 'estrategia'],
  [/c[oó]mo funciona (el negocio|esto|exactamente)/i, 'como_funciona'],
  [/tres formas de empezar|con cu[aá]nto se empieza|cu[aá]nto vale cada uno|diferencias entre los tres/i, 'paquetes'],
  [/ganancias por la compra de paquetes/i, 'ganancia_paquetes'],
  [/de d[oó]nde sale (el|ese|esa) (ingreso|dinero|plata)|c[oó]mo entra el dinero/i, 'dinero'],
  [/en el simulador/i, 'simulador'],
];

export function temaDeOferta(pregunta: string): string | null {
  for (const [re, tema] of OFERTA_A_TEMA) if (re.test(pregunta || '')) return tema;
  return null;
}

/** La pregunta con la que CIERRA un texto, o null. */
export function preguntaDeCierre(texto: string): string | null {
  const t = (texto || '').trim();
  const preguntas = t.match(/¿[^?¿]{5,220}\?/g);
  if (!preguntas?.length) return null;
  const ultima = preguntas[preguntas.length - 1];
  const cola = t.slice(t.lastIndexOf(ultima) + ultima.length);
  return cola.replace(/\s/g, '').length <= 40 ? ultima : null;
}

// ─── Lo que la persona dice de sí ─────────────────────────────────────────────

/**
 * Lugares fuera de Colombia. El canal es colombiano en su mayoría y el país de
 * la persona se sabe por el indicativo; si dice que está en otro, eso es lo que
 * manda para registrarse y recibir (DIASPORA_01). Se guarda el país, y la
 * persona lo dijo con sus palabras — eso va citado.
 */
const LUGARES: [RegExp, string][] = [
  [/inglaterra|reino unido|londres|manchester|liverpool|birmingham|escocia|gales/i, 'Inglaterra'],
  [/espa[ñn]a|madrid|barcelona|valencia|sevilla|m[aá]laga|bilbao|zaragoza|murcia|palma de mallorca|alicante/i, 'España'],
  [/italia|roma|mil[aá]n|n[aá]poles|tur[ií]n|florencia(?! .{0,5}caquet)/i, 'Italia'],
  [/francia|par[ií]s|lyon|marsella/i, 'Francia'],
  [/alemania|berl[ií]n|m[uú]nich|fr[aá]ncfort|hamburgo/i, 'Alemania'],
  [/suiza|z[uú]rich|ginebra|berna/i, 'Suiza'],
  [/holanda|pa[ií]ses bajos|[aá]msterdam|r[oó]terdam/i, 'Países Bajos'],
  [/portugal|lisboa|oporto/i, 'Portugal'],
  [/b[eé]lgica|bruselas/i, 'Bélgica'],
  [/irlanda|dubl[ií]n/i, 'Irlanda'],
  [/suecia|noruega|dinamarca|finlandia|estocolmo|oslo|copenhague/i, 'Escandinavia'],
  [/australia|s[ií]dney|melbourne/i, 'Australia'],
  [/jap[oó]n|tokio/i, 'Japón'],
  [/dub[aá]i|emiratos/i, 'Emiratos Árabes'],
  [/israel|tel aviv/i, 'Israel'],
  [/estados unidos|ee\.?\s?uu|\busa\b|miami|nueva york|new york|houston|orlando|los [aá]ngeles|chicago|atlanta|dallas|boston|new jersey|nueva jersey|florida|texas|california|carolina del norte|georgia(?! .{0,3}tbilisi)/i, 'Estados Unidos'],
  [/canad[aá]|toronto|montreal|vancouver|calgary|ottawa/i, 'Canadá'],
  [/m[eé]xico|cdmx|guadalajara|monterrey|canc[uú]n|tijuana|puebla/i, 'México'],
  [/per[uú]\b|lima\b/i, 'Perú'],
  [/ecuador|quito|guayaquil|cuenca(?! del)/i, 'Ecuador'],
  [/chile\b|santiago de chile/i, 'Chile'],
  [/argentina|buenos aires|c[oó]rdoba(?! ,? ?colombia)|rosario/i, 'Argentina'],
  [/venezuela|caracas|maracaibo|valencia de venezuela/i, 'Venezuela'],
  [/panam[aá]/i, 'Panamá'],
  [/costa rica|san jos[eé] de costa rica/i, 'Costa Rica'],
  [/rep[uú]blica dominicana|santo domingo/i, 'República Dominicana'],
  [/puerto rico|san juan de puerto rico/i, 'Puerto Rico'],
  [/guatemala|honduras|el salvador|nicaragua|bolivia|paraguay|uruguay|montevideo|asunci[oó]n/i, 'otro país de América'],
];

/** «estoy en», «vivo en», «aquí en», «desde acá»: la persona habla de dónde está. */
const RE_UBICACION = /\b(estoy|vivo|resido|me encuentro|radicad[oa]|me mud[eé]|me fui|trabajo|llegu[eé])\s+(en|a|desde|para|por)\b|\b(aqu[ií]|ac[aá])\s+en\b|\b(desde|en)\s+(ac[aá]|aqu[ií])\b|\blleguen?\s+(aqu[ií]\s+)?a\b|\bactualmente\s+(estoy|vivo)/i;

/**
 * Dónde dice la persona que vive, si dice que está fuera de su país.
 * Devuelve el país y la frase con que lo dijo; null si nunca lo dijo.
 */
export function residenciaDeclarada(mensajesPersona: string[], paisDeOrigen = 'Colombia'): { pais: string; cita: string } | null {
  let hallada: { pais: string; cita: string } | null = null;
  for (const m of mensajesPersona) {
    if (!m || !RE_UBICACION.test(m)) continue;
    for (const [re, pais] of LUGARES) {
      if (re.test(m) && pais !== paisDeOrigen) {
        hallada = { pais, cita: m.trim().slice(0, 140) };
        break;
      }
    }
  }
  return hallada;
}

/**
 * El país fuera del de origen que el texto nombra, diga o no que vive allá
 * («¿me llegaría el producto a Inglaterra?»). Null si no nombra ninguno.
 */
export function lugarExterior(texto: string, paisDeOrigen = 'Colombia'): string | null {
  if (!texto) return null;
  for (const [re, pais] of LUGARES) if (re.test(texto) && pais !== paisDeOrigen) return pais;
  return null;
}

const RE_INDEPENDIENTE =/\b(soy|como)\s+(independiente|freelance|freelancer)\b|trabajo\s+(por\s+mi\s+cuenta|independiente|por\s+proyectos)/i;
const RE_EMPRESARIO = /\b(tengo|manejo|mont[eé])\s+(mi|un|una)\s+(propio\s+)?(negocio|empresa|local|emprendimiento)|\bsoy\s+(empresari[oa]|comerciante)\b|\bnegocio\s+propio\b/i;
const RE_EMPLEADO = /\bsoy\s+emplead[oa]\b|trabajo\s+en\s+una\s+empresa|\btengo\s+(un\s+)?empleo\b|\bvivo\s+de\s+(un|mi)\s+sueldo\b/i;
const RE_LE_VA_BIEN = /me\s+va\s+(muy\s+)?bien|gano\s+bien/i;
const RE_PAREJA = /consult\w*\s+con\s+mi\s+(espos[oa]|pareja|marido|mujer|novi[oa])|hablarlo\s+con\s+mi\s+(espos[oa]|pareja|marido|mujer)/i;

// ─── La bitácora ──────────────────────────────────────────────────────────────

export interface Bitacora {
  /** El bloque que va en las instrucciones de sesión. Vacío si no hay historia. */
  texto: string;
  /** Temas que la persona ya recibió. */
  temasMostrados: Set<string>;
  /** La oferta del siguiente paso que aún no ha visto, o null. */
  siguientePaso: string | null;
  /** Dónde dice que vive, si está fuera de su país. */
  residencia: { pais: string; cita: string } | null;
  /** Lo que ya recibió, en texto: sirve para no volver a dictarlo. */
  textosDelBot: string[];
}

const recortar = (t: string, n: number) => {
  const plano = (t || '').replace(/\s+/g, ' ').trim();
  return plano.length > n ? `${plano.slice(0, n - 1)}…` : plano;
};

/**
 * Arma la bitácora a partir de las filas de la conversación, en orden
 * cronológico (la más vieja primero).
 *
 * @param ficha  `device_info` del prospecto: pareja, paquete de interés.
 */
export function construirBitacora(
  filas: FilaBitacora[],
  ficha: Record<string, unknown> | null = null,
  opciones: { paisDeOrigen?: string; maxMensajes?: number } = {},
): Bitacora {
  const mensajesPersona: { turno: number; texto: string }[] = [];
  const textosDelBot: string[] = [];
  const primerTurnoDeTema = new Map<string, number>();

  filas.forEach((fila, i) => {
    const turno = i + 1;
    const msgs = Array.isArray(fila.messages) ? fila.messages : [];
    for (const m of msgs) {
      if (!m || typeof m.content !== 'string') continue;
      if (m.role === 'user') mensajesPersona.push({ turno, texto: m.content });
      if (m.role === 'assistant') {
        textosDelBot.push(m.content);
        for (const tema of TEMAS) {
          if (!primerTurnoDeTema.has(tema.id) && tema.firma.test(m.content)) primerTurnoDeTema.set(tema.id, turno);
        }
      }
    }
    // Lo servido que no deja firma en el texto (un fragmento compuesto por el
    // modelo, por ejemplo): cuenta por la categoría que quedó en la fila.
    const usados = (fila.metadata as { documents_used?: unknown } | null)?.documents_used;
    if (Array.isArray(usados)) {
      for (const tema of TEMAS) {
        if (primerTurnoDeTema.has(tema.id) || !tema.fragmentos) continue;
        if (usados.some((u) => typeof u === 'string' && tema.fragmentos!.includes(u))) primerTurnoDeTema.set(tema.id, turno);
      }
    }
  });

  const temasMostrados = new Set(primerTurnoDeTema.keys());
  const residencia = residenciaDeclarada(mensajesPersona.map((m) => m.texto), opciones.paisDeOrigen);
  const siguiente = RECORRIDO.find((p) => !temasMostrados.has(p.tema)) ?? null;
  const radicando = temasMostrados.has('radicacion');

  if (!mensajesPersona.length) {
    return { texto: '', temasMostrados, siguientePaso: null, residencia, textosDelBot };
  }

  // Lo que ha dicho de sí — hechos, con sus palabras cuando importan.
  const deSi: string[] = [];
  if (residencia) deSi.push(`vive fuera de su país, en ${residencia.pais}: «${residencia.cita}»`);
  const todo = mensajesPersona.map((m) => m.texto).join('\n');
  if (RE_EMPRESARIO.test(todo)) deSi.push('tiene su propio negocio');
  else if (RE_INDEPENDIENTE.test(todo)) deSi.push('trabaja por su cuenta, como independiente');
  else if (RE_EMPLEADO.test(todo)) deSi.push('es empleado');
  if (RE_LE_VA_BIEN.test(todo)) deSi.push('dice que le va bien');
  const pareja = typeof ficha?.pareja_nombre === 'string' ? ficha.pareja_nombre : null;
  if (pareja) deSi.push(`lo está consultando con su pareja, ${pareja}`);
  else if (RE_PAREJA.test(todo)) deSi.push('lo va a consultar con su pareja');
  if (typeof ficha?.package === 'string' && ficha.package) deSi.push(`mostró interés en el paquete ${ficha.package}`);
  if (radicando) deSi.push('ya empezó a dar los datos de la vinculación');

  const max = opciones.maxMensajes ?? 30;
  const escritos = mensajesPersona.slice(-max)
    .map((m) => `${m.turno}. «${recortar(m.texto, 140)}»`)
    .join('\n');

  const mostrados = [...primerTurnoDeTema.entries()]
    .sort((a, b) => a[1] - b[1])
    .map(([id, turno]) => `${TEMA_POR_ID.get(id)?.nombre} (turno ${turno})`)
    .join(' · ');

  const texto = `<bitacora>
Esta es la memoria de TODA la conversación con esta persona; los últimos mensajes los tiene además completos. Úsela para responder como alguien que la recuerda entera.

Lo que la persona ha escrito, en orden:
${escritos}
${mostrados ? `\nLo que ya se le mostró: ${mostrados}.` : ''}${deSi.length ? `\nLo que ha dicho de sí: ${deSi.join(' · ')}.` : ''}${siguiente && !radicando ? `\nEl siguiente paso que aún no ha visto: «${siguiente.oferta}»` : ''}

Cómo usarla:
• Responda lo que la persona dice ahora, desde lo que ya sabe de ella.
• Si dice que algo ya se habló, compruébelo aquí. Si ya se le mostró, reconózcalo en una línea y siga con algo nuevo; si lo que se le mostró era otra cosa, dígale qué se le mostró y pregúntele qué busca.
• Para cerrar, proponga un paso que la persona aún no haya visto${siguiente && !radicando ? ' —el de arriba es el natural—' : ''}, o cierre sin pregunta si nada encaja.
</bitacora>`;

  return {
    texto,
    temasMostrados,
    siguientePaso: radicando ? null : siguiente?.oferta ?? null,
    residencia,
    textosDelBot,
  };
}

/**
 * ¿La pregunta de cierre ofrece algo que la persona ya vio? Devuelve la
 * pregunta que la reemplaza —el siguiente paso— o '' para cerrar sin pregunta.
 * Null si la pregunta está bien.
 *
 * Es la red debajo del criterio del modelo: el modelo decide con la bitácora
 * delante, y si aun así ofrece lo visto, el código lo cambia en vez de dejar
 * que la persona lo reciba otra vez.
 */
export function reemplazoDeOfertaVista(texto: string, bitacora: Pick<Bitacora, 'temasMostrados' | 'siguientePaso'>): string | null {
  const pregunta = preguntaDeCierre(texto);
  if (!pregunta) return null;
  // Lo ya mostrado incluye lo que ESTE texto entrega: la bitácora se arma antes
  // del turno, y en el ensayo del 24 sep el día a día cerró ofreciendo «¿Le
  // muestro qué haría usted en el día a día?» — el tema que estaba entregando.
  const vistos = new Set([...bitacora.temasMostrados, ...temasDelTexto(texto)]);
  const tema = temaDeOferta(pregunta);
  if (!tema || !vistos.has(tema)) return null;
  const siguiente = RECORRIDO.find((p) => !vistos.has(p.tema))?.oferta ?? '';
  return bitacora.siguientePaso === null ? '' : siguiente;
}

/** Los temas que un texto entrega, por sus firmas. */
export function temasDelTexto(texto: string): Set<string> {
  return new Set(TEMAS.filter((t) => t.firma.test(texto || '')).map((t) => t.id));
}

/** Aplica `reemplazoDeOfertaVista`: cambia la pregunta, o la quita. */
export function renovarOfertaVista(texto: string, bitacora: Pick<Bitacora, 'temasMostrados' | 'siguientePaso'>): { texto: string; cambio: string | null } {
  const reemplazo = reemplazoDeOfertaVista(texto, bitacora);
  if (reemplazo === null) return { texto, cambio: null };
  const pregunta = preguntaDeCierre(texto)!;
  const i = texto.lastIndexOf(pregunta);
  const cuerpo = texto.slice(0, i).replace(/\s+$/, '');
  if (cuerpo.length < 60) return { texto, cambio: null };
  return {
    texto: reemplazo ? `${cuerpo}\n\n${reemplazo}` : cuerpo,
    cambio: `«${pregunta}» → ${reemplazo ? `«${reemplazo}»` : 'sin pregunta'}`,
  };
}

/**
 * ¿Este texto aprobado ya lo recibió la persona, en cualquier turno? Se compara
 * normalizado y por el ARRANQUE del cuerpo, igual que `candadoYaDicho`, pero
 * contra toda la conversación y no solo contra el turno anterior: el «Cómo
 * funciona» del turno 2 volvió entero en el 10 porque solo se miraba el 9.
 */
export function yaLoRecibio(textosDelBot: readonly string[], cuerpo: string): boolean {
  const norm = (t: string) => (t || '').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  const c = norm(cuerpo);
  if (c.length < 40) return false;
  const arranque = c.slice(0, 120);
  return textosDelBot.some((t) => norm(t).includes(arranque));
}
