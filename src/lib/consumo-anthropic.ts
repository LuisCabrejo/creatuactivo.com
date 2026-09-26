/**
 * © CreaTuActivo.com — Propietario y confidencial.
 *
 * Cuántos tokens gasta cada turno de Queswa, y de quién es el gasto.
 *
 * ── POR QUÉ EXISTE (26 sep 2026) ──────────────────────────────────────────────
 *
 * Hasta ese día el motor no sabía lo que gastaba. El registro de caché leía
 * `usage` de la respuesta en streaming, que no lo trae, y por eso imprimía
 * siempre «CACHE MISS … input=0». Contando turnos a mano apareció lo que
 * importaba: entre el 12 y el 26 de septiembre, cuatro de cada cinco llamadas
 * al modelo fueron pruebas nuestras (baterías, repeticiones de conversaciones,
 * la auditoría de guiones), no personas, y todas salían de la misma clave que
 * atiende a la gente. En medio de esas dos semanas, el 16 sep, esa clave se
 * quedó sin crédito.
 *
 * Dos piezas:
 *
 * • `contarTokens` envuelve el stream del SDK y lee los tokens de sus eventos
 *   —`message_start` trae la entrada y la caché; `message_delta`, la salida—
 *   sin tocar el texto. `consumoDe` hace lo mismo con una respuesta completa.
 *   Cada turno guarda la lista en `metadata.consumo` de su fila.
 *
 * • `clienteParaPruebas` da el cliente de la clave de pruebas. Una petición
 *   marcada con `x-queswa-origen: prueba` queda con `metadata.origen = 'prueba'`
 *   y, si existe ANTHROPIC_API_KEY_PRUEBAS, gasta de esa clave: la consola separa
 *   la factura y un límite de gasto sobre las pruebas no le quita crédito a la
 *   gente. Sin esa variable, todo sigue con la clave de siempre.
 *
 * ⚠️ Los PRECIOS no viven aquí: los aplica `scripts/consumo-anthropic.mjs` al
 * leer. Aquí solo se guardan tokens, que no envejecen.
 */

import Anthropic from '@anthropic-ai/sdk';

export interface Consumo {
  /** Qué llamada fue: 'respuesta' · 'reescritura' · 'envoltura' · 'nueva_redaccion'. */
  etapa: string;
  modelo: string;
  /** Entrada cobrada a precio pleno (sin caché). */
  entrada: number;
  cache_lectura: number;
  cache_escritura: number;
  salida: number;
}

type UsoApi = {
  input_tokens?: number | null;
  output_tokens?: number | null;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
} | null | undefined;

export function consumoDe(etapa: string, modelo: string, u: UsoApi): Consumo {
  return {
    etapa,
    modelo,
    entrada: u?.input_tokens ?? 0,
    cache_lectura: u?.cache_read_input_tokens ?? 0,
    cache_escritura: u?.cache_creation_input_tokens ?? 0,
    salida: u?.output_tokens ?? 0,
  };
}

/**
 * Deja pasar los eventos del stream tal cual y, al terminar, entrega lo que
 * costó. Si el stream se corta antes de `message_start`, no entrega nada.
 */
export async function* contarTokens<T extends { type: string }>(
  stream: AsyncIterable<T>,
  etapa: string,
  alTerminar: (c: Consumo) => void,
): AsyncGenerator<T> {
  let c: Consumo | null = null;
  try {
    for await (const ev of stream) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = ev as any;
      if (e.type === 'message_start') {
        c = consumoDe(etapa, e.message?.model ?? '', e.message?.usage);
      } else if (e.type === 'message_delta' && c && e.usage?.output_tokens != null) {
        c.salida = e.usage.output_tokens;
      }
      yield ev;
    }
  } finally {
    if (c) alTerminar(c);
  }
}

/** La petición viene de un script de prueba, no de una persona. */
export function esPeticionDePrueba(req: Request): boolean {
  return req.headers.get('x-queswa-origen') === 'prueba';
}

let _clientePruebas: Anthropic | null = null;
/** El cliente de la clave de pruebas, o null si la variable no está definida. */
export function clienteParaPruebas(): Anthropic | null {
  const clave = process.env.ANTHROPIC_API_KEY_PRUEBAS;
  if (!clave) return null;
  return (_clientePruebas ??= new Anthropic({ apiKey: clave }));
}
