/**
 * ¿La persona está pidiendo uno de los videos de la apertura, con SUS palabras?
 * (28 sep 2026, Director: «sería una casualidad que la persona escribiera
 * justamente "Qué debo hacer yo"»).
 *
 * Los tres botones de la apertura del canal —Cómo funciona · Cómo entra el
 * dinero · Qué debo hacer yo— se responden con video. Pero el botón solo sale
 * una vez, y la gente escribe: «¿y yo qué tendría que hacer?», «¿quién me
 * paga?», «explíqueme el negocio». Hasta hoy eso iba al motor y recibía el texto.
 *
 * ── POR QUÉ POR SIGNIFICADO Y NO POR PATRONES ───────────────────────────────
 * Un regex cubre las frases que alguien pensó; la gente escribe las demás. Y el
 * buscador del arsenal tampoco basta: medido el 28 sep, de doce formas de
 * preguntar «qué haría yo», siete caían en PERFIL_02 (el trabajador
 * independiente, que se lleva todo lo que diga «trabajo») y solo tres en EAM_01.
 * Aquí se compara el mensaje con frases de ejemplo de cada video Y con frases
 * de CONTRASTE —preguntas que se parecen pero tienen otra respuesta: cuánto se
 * gana, cómo empezar, cuánto tiempo, si sirve para alguien como yo—. El video
 * sale solo si gana con claridad a todas. Consulta contra consulta
 * (`input_type: 'query'` en los dos lados), que es simétrica.
 *
 * ── LO QUE NO HACE ──────────────────────────────────────────────────────────
 * No decide si ya lo vio ni si quien escribe es un socio: eso lo mira el
 * webhook, que tiene el hilo. Nunca lanza: ante cualquier fallo devuelve null
 * y el turno sigue al motor como siempre.
 *
 * Arnés: `npx tsx scripts/prueba-videos-intencion.mts` (calibra y falla si una
 * frase de prueba cae mal). ⚠️ Una frase nueva de ejemplo o de contraste se
 * mide con el arnés antes de dejarla: una sola frase genérica puede volverse
 * atractor.
 */

export type VideoIntencion = 'apertura_sistema' | 'apertura_dinero' | 'apertura_rol';

/** Frases de ejemplo, en la voz del prospecto. */
export const EJEMPLOS: Record<VideoIntencion, string[]> = {
  apertura_sistema: [
    '¿Cómo funciona esto?',
    '¿Cómo funciona el negocio?',
    'Explíqueme el negocio',
    '¿En qué consiste el negocio?',
    'No entiendo cómo funciona',
    '¿Cómo es la cosa?',
    '¿Me explica cómo es el modelo de negocio?',
    'Quiero entender cómo funciona',
    'Cuénteme cómo es el negocio',
    '¿De qué se trata el negocio?',
    '¿Cómo opera esto?',
    'Explíqueme bien cómo es esto',
  ],
  apertura_dinero: [
    '¿De dónde sale el dinero?',
    '¿Cómo entra el dinero?',
    '¿Quién me paga?',
    '¿Y la plata de dónde sale?',
    '¿De dónde salen las ganancias?',
    '¿Cómo es que se gana dinero con esto?',
    '¿Cómo recibo el dinero?',
    '¿Por qué me pagarían a mí?',
    '¿De qué sale lo que uno gana?',
    '¿Quién pone la plata?',
    '¿Cómo me llega la plata?',
    '¿De dónde viene el ingreso?',
    '¿De qué vive uno en esto?',
  ],
  apertura_rol: [
    '¿Qué debo hacer yo?',
    '¿Y yo qué tendría que hacer?',
    '¿Qué me toca hacer a mí?',
    '¿Cuál sería mi trabajo?',
    '¿Cómo sería mi día a día?',
    '¿Qué hace uno en este negocio?',
    '¿Cómo lo haría yo?',
    '¿Cuál es mi parte?',
    '¿En qué consiste lo que yo haría?',
    '¿Cómo trabajaría yo esto?',
    '¿Cuál sería mi función?',
    '¿Y yo qué hago?',
  ],
};

/** Preguntas que se parecen y tienen OTRA respuesta. Si una de estas gana, no hay video. */
export const CONTRASTES: string[] = [
  // la compensación y las cifras
  '¿Cuánto se gana?', '¿Cuánto puedo ganar?', '¿Cómo es el plan de compensación?',
  '¿Cómo funciona el binario?', '¿Cómo se gana con el GEN5?', '¿Cuánto me queda por cada venta?',
  '¿Cuánto gana un distribuidor al mes?',
  // el pago como trámite
  '¿Qué día pagan?', '¿Cada cuánto me consignan?', '¿Me pagan en productos o en dinero?',
  '¿Cuándo me pagan?', '¿Me toca cobrarle a los clientes?', '¿Y si alguien no me paga?',
  // empezar, precios, vincularse
  '¿Qué tengo que hacer para empezar?', '¿Cómo me inscribo?', '¿Cómo inicio?',
  '¿Cuánto cuesta empezar?', '¿Cuánto vale el paquete?', 'Quiero iniciar ya',
  // tiempo, perfil, ventas
  '¿Cuánto tiempo le tengo que dedicar?', 'No tengo tiempo', '¿Tengo que vender?',
  'No sé vender', '¿Esto es para alguien como yo?', 'Soy independiente, ¿esto me sirve?',
  'Soy ama de casa, ¿esto es para mí?',
  // confianza y categoría
  '¿Esto es una pirámide?', '¿Es multinivel?', '¿Es legal?', '¿Qué garantía tengo?',
  '¿Qué es CreaTuActivo?', '¿Quiénes son ustedes?', '¿Quién es Luis Cabrejo?', '¿Qué es Gano Excel?',
  // productos y pedidos
  '¿Qué productos venden?', '¿Para qué sirve el café?', '¿Cuánto cuesta el café?',
  '¿Quién paga el envío?', '¿Cómo hago un pedido?', '¿Tienen catálogo?',
  // la herramienta
  '¿Cómo funciona Queswa?', '¿Cómo funciona la aplicación?', '¿Cómo funciona el simulador?',
  // la estrategia (tiene su propio nodo)
  '¿Qué son los 12 niveles?', '¿Cuál es la estrategia?',
  // conversación
  'Hola', 'Gracias', 'Ok, lo pienso', 'Lo consulto con mi esposa',
];

/** El umbral y los márgenes, calibrados con el arnés (28 sep 2026). */
export const UMBRAL = 0.66;
export const MARGEN_CONTRASTE = 0.03;
export const MARGEN_ENTRE_VIDEOS = 0.02;

type Tabla = { etiqueta: VideoIntencion | 'contraste'; texto: string; v: number[] }[];
let tablaPromesa: Promise<Tabla> | null = null;

async function embeberLote(textos: string[], apiKey: string): Promise<number[][]> {
  const r = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'voyage-3-lite', input: textos, input_type: 'query' }),
  });
  if (!r.ok) throw new Error(`Voyage ${r.status}`);
  const j = await r.json();
  return (j.data as { embedding: number[]; index: number }[]).sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

function coseno(a: number[], b: number[]): number {
  let p = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { p += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return p / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

/** Los ejemplos se embeben una vez por instancia (un solo lote). */
function tabla(apiKey: string): Promise<Tabla> {
  if (!tablaPromesa) {
    const filas: { etiqueta: VideoIntencion | 'contraste'; texto: string }[] = [
      ...(Object.keys(EJEMPLOS) as VideoIntencion[]).flatMap((k) => EJEMPLOS[k].map((texto) => ({ etiqueta: k, texto }))),
      ...CONTRASTES.map((texto) => ({ etiqueta: 'contraste' as const, texto })),
    ];
    tablaPromesa = embeberLote(filas.map((f) => f.texto), apiKey)
      .then((vs) => filas.map((f, i) => ({ ...f, v: vs[i] })))
      .catch((e) => { tablaPromesa = null; throw e; });
  }
  return tablaPromesa;
}

export interface LecturaIntencion {
  video: VideoIntencion | null;
  /** El mejor puntaje de cada clase, para el log y el arnés. */
  puntajes: Record<VideoIntencion | 'contraste', { puntaje: number; ejemplo: string }>;
}

/** Lee el mensaje contra los ejemplos. Devuelve la lectura completa (para el arnés). */
export async function leerIntencionDeVideo(mensaje: string, apiKey = process.env.VOYAGE_API_KEY || ''): Promise<LecturaIntencion | null> {
  const texto = (mensaje || '').trim();
  const palabras = texto.split(/\s+/).filter(Boolean).length;
  if (!apiKey || palabras < 2 || palabras > 25) return null;
  try {
    const [t, [v]] = await Promise.all([tabla(apiKey), embeberLote([texto], apiKey)]);
    const puntajes = {} as LecturaIntencion['puntajes'];
    for (const f of t) {
      const s = coseno(v, f.v);
      if (!puntajes[f.etiqueta] || s > puntajes[f.etiqueta].puntaje) puntajes[f.etiqueta] = { puntaje: s, ejemplo: f.texto };
    }
    const videos = (Object.keys(EJEMPLOS) as VideoIntencion[]).sort((a, b) => puntajes[b].puntaje - puntajes[a].puntaje);
    const [primero, segundo] = videos;
    const s1 = puntajes[primero].puntaje;
    const gana = s1 >= UMBRAL
      && s1 - puntajes.contraste.puntaje >= MARGEN_CONTRASTE
      && s1 - puntajes[segundo].puntaje >= MARGEN_ENTRE_VIDEOS;
    return { video: gana ? primero : null, puntajes };
  } catch (err) {
    console.warn('⚠️ [Videos por intención] No se pudo leer el mensaje — sigue al motor:', err);
    return null;
  }
}

/** El video que pide, o null. */
export async function videoQuePide(mensaje: string): Promise<VideoIntencion | null> {
  return (await leerIntencionDeVideo(mensaje))?.video ?? null;
}
