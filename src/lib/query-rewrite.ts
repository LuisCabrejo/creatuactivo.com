/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Reescritura conversacional de la consulta (CQR) — anclaje para el buscador.
 *
 * Problema que resuelve: en una conversación, el mensaje que dispara la búsqueda
 * casi nunca se basta a sí mismo. "sí", "ok", "panadero", "y eso cómo sería"
 * no tienen ancla temática, así que el buscador vectorial recupera ruido o nada,
 * el modelo se queda sin material y rellena el vacío con su memoria de
 * entrenamiento — donde "empresa digital" significa cursos e infoproductos.
 *
 * La medición de RAG multi-turno es consistente: más del 60% de los mensajes de
 * seguimiento dependen de turnos previos, y colapsar la conversación en una
 * consulta autónoma antes de buscar es lo que recupera la precisión (MTRAG,
 * arXiv:2501.03468).
 *
 * Es la contraparte positiva del guardarraíl: en vez de prohibirle al modelo que
 * invente, se le entrega el material para que no necesite hacerlo.
 */

import Anthropic from '@anthropic-ai/sdk';

let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }
  return anthropicClient;
}

const INSTRUCCIONES = `Eres un reescritor de consultas para un buscador semántico. No conversas con nadie.

La base de conocimiento trata sobre CreaTuActivo: qué es la empresa digital que ofrece,
cómo funciona el modelo, los productos (café, bebidas y suplementos con Ganoderma de Gano
Excel), el plan de compensación, los paquetes de inicio y las preguntas frecuentes.

Recibirás una conversación de WhatsApp. Tu única tarea: reescribir el ÚLTIMO mensaje del
usuario como una consulta de búsqueda autónoma, que se entienda sin leer la conversación.

Reglas:
- Use únicamente lo que ya aparece en la conversación. No agregue temas nuevos.
- Si el último mensaje es una aceptación corta ("sí", "claro", "cuénteme"), la consulta
  debe expresar aquello que el asistente acababa de ofrecer explicar.
- Si el último mensaje es un dato personal (una ocupación, una ciudad), la consulta debe
  pedir lo que el asistente necesita para responderle: cómo aplica el modelo a alguien así.
- Escriba con el vocabulario de la base de conocimiento, no con el oficio ni los datos
  personales de la persona.
- Máximo 20 palabras, en español, sin comillas y sin explicación. Devuelva solo la consulta.`;

/** Deícticos y referencias que sólo se resuelven mirando el turno anterior. */
const RE_DEPENDE_DEL_HILO = /\b(eso|esto|ese|esa|esos|esas|aquello|ahí|all[íi]|lo mismo|igual|entonces|y luego|tambi[ée]n|cu[áa]l de|el primero|el segundo|el otro)\b/i;

/**
 * ¿Este mensaje puede buscarse tal cual, o depende del hilo?
 *
 * Barato y conservador: si el mensaje ya trae suficiente sustancia propia, no se
 * paga la llamada al modelo. Sin historial no hay nada que resolver.
 */
export function necesitaReescritura(
  mensajeActual: string,
  historial: { role: string; content: string }[],
): boolean {
  if (!historial || historial.length === 0) return false;

  const msg = (mensajeActual || '').trim();
  if (!msg) return false;

  const palabras = msg.split(/\s+/).length;
  return palabras <= 8 || RE_DEPENDE_DEL_HILO.test(msg);
}

export interface ResultadoReescritura {
  consulta: string;      // lo que debe ir al buscador
  reescrita: boolean;    // false = se usó el mensaje original
  ms: number;
}

/**
 * Colapsa la conversación en una consulta autónoma.
 *
 * Nunca lanza: ante cualquier fallo (API caída, respuesta rara, timeout) devuelve el
 * mensaje original. Degradar la recuperación es aceptable; tumbar el turno no.
 */
export async function reescribirConsultaConversacional(
  mensajeActual: string,
  historial: { role: string; content: string }[],
  opciones: { maxTurnos?: number } = {},
): Promise<ResultadoReescritura> {
  const inicio = Date.now();
  const original: ResultadoReescritura = { consulta: mensajeActual, reescrita: false, ms: 0 };

  if (!necesitaReescritura(mensajeActual, historial)) {
    return { ...original, ms: Date.now() - inicio };
  }

  // Los últimos turnos bastan: lo que resuelve la referencia está cerca.
  const maxTurnos = opciones.maxTurnos ?? 6;
  const recientes = historial.slice(-maxTurnos);

  const transcripcion = recientes
    .map((m) => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`)
    .join('\n');

  try {
    const respuesta = await getAnthropicClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 80,
      system: INSTRUCCIONES,
      messages: [
        {
          role: 'user',
          content: `CONVERSACIÓN:\n${transcripcion}\n\nÚLTIMO MENSAJE DEL USUARIO:\n${mensajeActual}\n\nCONSULTA AUTÓNOMA:`,
        },
      ],
    });

    const bloque = respuesta.content.find((b) => b.type === 'text');
    const texto = bloque?.type === 'text' ? bloque.text.trim().replace(/^["'`]|["'`]$/g, '') : '';

    // Una reescritura vacía, larguísima o que se volvió una explicación no sirve
    if (!texto || texto.length < 3 || texto.split(/\s+/).length > 30) {
      console.warn(`⚠️ [CQR] Reescritura descartada ("${texto.slice(0, 60)}") — se usa el mensaje original`);
      return { ...original, ms: Date.now() - inicio };
    }

    const ms = Date.now() - inicio;
    console.log(`🔎 [CQR] "${mensajeActual}" → "${texto}" (${ms}ms)`);
    return { consulta: texto, reescrita: true, ms };
  } catch (err) {
    console.error('⚠️ [CQR] Falló la reescritura, se usa el mensaje original:', err);
    return { ...original, ms: Date.now() - inicio };
  }
}
