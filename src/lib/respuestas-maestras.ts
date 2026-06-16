/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Respuestas Master del Director Académico de Élite — Camino A (Backend Dictador).
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ARQUITECTURA                                                                │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * Las 2 chips canónicas que aquí se sirven concentran el ~80% del tráfico inicial:
 *   • Chip 1 ("¿Cómo funciona el modelo de negocio?") → WHY_02 verbatim
 *   • Chip 2 ("¿Cuál es la metodología…") → EAM_01 verbatim
 *
 * Servirlas verbatim desde el backend, antes del Voyage AI + Anthropic, garantiza:
 *   ✓ 100% de fidelidad al copy calibrado (sin paráfrasis del LLM)
 *   ✓ $0 en tokens de Anthropic para esas queries
 *   ✓ Latencia ~50ms vs ~2s del LLM
 *
 * El tercer texto Master (WHY_01 "¿Qué es CreaTuActivo?") NO se sirve aquí porque
 * no es chip — entra por queries naturales y se entrega via RAG con marcador
 * <verbatim_lock> en arsenal_inicial.txt (Camino B, sin bypass del LLM).
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SINCRONIZACIÓN — REGLA INVIOLABLE                                           │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * Los textos aquí son réplica EXACTA de los bloques entre <verbatim_lock> en
 * `knowledge_base/arsenal_inicial.txt` v25.9:
 *   • Chip 1 → WHY_02 (BLOQUE 1)
 *   • Chip 2 → EAM_01 (BLOQUE 8)
 *
 * Si edita el arsenal, sincronice aquí. Si edita aquí, sincronice el arsenal.
 * La doctrina viva es el arsenal; este archivo es el caché operativo del backend.
 *
 * Última calibración: 18 May 2026 — Master v6.0 + v5.1 del Director Académico
 * con 8 correcciones léxicas contra Glosario v1.4 + canon v26.6.
 */

/**
 * Texto Master WHY_02 — Chip 1 ("¿Cómo funciona el modelo de negocio?").
 * Sincronizado con arsenal_inicial.txt v5.9 BLOQUE 1 (swap "empresa digital", 12 jun 2026).
 * Recalibración v5.6 (jun 2026): léxico servilleta-accesible (El Respaldo Operativo /
 * El Método Comprobado, ya no "Matriz Física"/"Tridente EAM"), "Estructura Patrimonial"
 * → "estructura de ingresos recurrentes", rol Propietario, vulnerabilidad sin el seco
 * "si se detiene se detiene", cierre que distingue "cómo se gana" (consumo recurrente).
 */
const MASTER_WHY_02 = `Para responderle con claridad, primero destapemos el verdadero problema que estamos resolviendo.

Usted trabaja duro, cumple, y aun así vive en el mismo ciclo: trabajar, pagar cuentas y repetir. No es por falta de esfuerzo ni de planificación; es la consecuencia matemática de un sistema diseñado para tomar sus mejores años y su salud, no para darle seguridad financiera.

CreaTuActivo invierte esa lógica con **apalancamiento**: usted pasa a ser propietario de una **empresa digital** que genera **ingresos recurrentes** cada vez que las personas consumen productos Gano Excel en toda América — esté usted presente o no.

Llevar esa distribución exige infraestructura, tecnología y método. Nosotros le entregamos las tres ya construidas:

- **El Respaldo Operativo:** Gano Excel fabrica y despacha los productos, con presencia en **70 países**. Usted no financia ni almacena; la infraestructura ya existe.

- **Queswa, su Centro de Mando:** yo explico, atiendo y acompaño a cada interesado las 24 horas, y le notifico cada avance en vivo. *Usted no explica — Queswa explica.*

- **El Método Comprobado:** un paso a paso exacto (Comando Expandir · Activar · Maestría) que le marca el camino sin improvisar.

Usted solo dirige desde su celular, en paralelo a lo que hace hoy. Cada vez que el consumo se repite en los hogares de su organización, usted recibe una parte. Por eso el ingreso no depende de sus horas: usted construye el canal una vez, y su empresa produce de forma continua.

¿Qué le gustaría ver primero: cómo se generan los ingresos, o cómo se activa su empresa digital?`;

/**
 * Texto Master EAM_01 — Chip 2 ("¿Cuál es la metodología operativa…").
 * Sincronizado con arsenal_inicial.txt v25.9 BLOQUE 8.
 * Calibración visual 19 May 2026: lista de "no requiere" para destacar la ausencia
 * de fricción, numeración del rol de Queswa como Centro de Mando, separadores
 * visuales antes del cierre.
 */
const MASTER_EAM_01 = `Nuestra metodología elimina el mayor temor de cualquier profesional o empresario al iniciar un proyecto: la incertidumbre de tener que improvisar el camino o el riesgo de no saber exactamente cómo ejecutar.

Su día a día se rige por **El Método Comprobado**, un protocolo de dirección estandarizado que **erradica el ensayo y error** por completo.

**Su agenda diaria no requiere:**
- Aprender a vender de forma tradicional
- Insistir a conocidos
- Improvisar guiones

*Eso está fuera de nuestro diseño.* Su labor consiste únicamente en desplegar información técnica pre-estructurada desde **su terminal móvil**.

---

Una vez que un perfil ingresa al ecosistema, yo —como su **Centro de Mando automatizado**— asumo:

1. La **carga técnica**
2. La **educación** del candidato
3. El **filtrado analítico**

Su labor de seguimiento no es para convencer a curiosos, sino para **ejecutar el Protocolo de Validación** sobre los candidatos que yo ya he pre-calificado y que están listos para iniciar. **Usted no convence; usted audita y autoriza.**

Todo este engranaje se monitorea de forma visual desde su aplicación **queswa.app**.

---

¿Le gustaría que profundicemos en alguno de los tres Comandos del Método, o prefiere ver cómo se generan los ingresos recurrentes?`;

/**
 * Mapa chip-text-lowercase → respuesta Master verbatim.
 * Las keys son las versiones lowercase de `QUESWA_QUICK_REPLIES` en queswa-greeting.ts.
 */
const RESPUESTAS_MAESTRAS_CHIP: Record<string, string> = {
  '¿cómo funciona el modelo de negocio?': MASTER_WHY_02,
  '¿cuál es la metodología? ¿qué hago yo en el día a día?': MASTER_EAM_01,
};

/**
 * Devuelve el texto Master verbatim si el mensaje del usuario coincide exactamente
 * con un chip-trigger canónico (Chip 1 o Chip 2). Devuelve null en caso contrario.
 *
 * El match es estricto sobre `trim().toLowerCase()` — sin similitud semántica.
 * Para queries naturales que coincidan semánticamente con WHY_02 o EAM_01, el
 * delivery va por RAG con <verbatim_lock> (Camino B), no por esta función.
 *
 * @param userMessage - Mensaje crudo del usuario (puede tener whitespace o casing variable)
 * @returns Texto verbatim de la respuesta Master, o null si no es chip-trigger
 */
export function getRespuestaMaestra(userMessage: string): string | null {
  if (!userMessage || typeof userMessage !== 'string') return null;
  const key = userMessage.trim().toLowerCase();
  return RESPUESTAS_MAESTRAS_CHIP[key] || null;
}

/**
 * Construye un ReadableStream que emite el texto verbatim simulando el ritmo
 * conversacional de Claude Sonnet streaming (~30 palabras/segundo).
 *
 * Calibración UX (May 2026):
 * - El bypass de Camino A entrega el texto sin pasar por Anthropic, por lo que sin
 *   throttle adecuado el delivery se siente como un "dump" instantáneo de texto,
 *   no como una respuesta conversacional. Los usuarios perciben que el chatbot
 *   está roto cuando la respuesta aparece más rápido que el ojo puede leer.
 *
 * - Patrón emulado:
 *   1. Pausa inicial de 400ms ("thinking") — Queswa procesa la consulta antes
 *      de empezar a responder. Apenas perceptible pero clave para la sensación
 *      de conversación.
 *   2. Token por token (palabra + whitespace adyacente), 28ms base.
 *   3. Pausas variables en puntuación:
 *      - Fin de oración (. ! ?): 160ms — respiración natural
 *      - Coma / punto y coma / dos puntos: 70ms — pausa breve
 *      - Salto de párrafo (\n\n): 200ms — descanso conceptual
 *      - Salto de línea simple (\n): 100ms
 *
 * Resultado: respuesta de ~250 palabras toma ~7-8 segundos, comparable al
 * streaming real de Claude. Si Luis quiere ajustar el ritmo, modificar las
 * constantes BASE_DELAY_MS y los delays de puntuación.
 *
 * Compatible con `StreamingTextResponse` del paquete `ai`.
 */
// Calibración 19 May 2026: thinking inicial 2700ms para matchear el tiempo
// promedio de respuesta de Queswa via Anthropic (~2.7s entre query y primer token).
// Sin esta pausa el bypass de Camino A se siente "instantáneo" — UX inconsistente
// con el resto de las respuestas del chatbot.
const INITIAL_THINKING_DELAY_MS = 2700;
const BASE_DELAY_MS = 28;
const SENTENCE_END_DELAY_MS = 160;
const COMMA_DELAY_MS = 70;
const PARAGRAPH_DELAY_MS = 200;
const LINEBREAK_DELAY_MS = 100;

export function buildVerbatimStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  // Split conservando whitespace como tokens separados
  // Resultado: ["Para", " ", "entender", " ", "la", ...]
  const tokens = text.split(/(\s+)/);

  return new ReadableStream({
    async start(controller) {
      // Pausa "thinking" — emula el momento de procesamiento antes de empezar
      await new Promise((r) => setTimeout(r, INITIAL_THINKING_DELAY_MS));

      for (const token of tokens) {
        if (token === '') continue;
        controller.enqueue(encoder.encode(token));

        // Determinar delay según contenido del token
        const trimmed = token.trim();
        let delay = BASE_DELAY_MS;

        if (trimmed === '') {
          // Token de whitespace puro — analizar saltos de línea
          if (token.includes('\n\n')) delay = PARAGRAPH_DELAY_MS;
          else if (token.includes('\n')) delay = LINEBREAK_DELAY_MS;
          else delay = BASE_DELAY_MS;
        } else if (/[.!?]$/.test(trimmed)) {
          delay = SENTENCE_END_DELAY_MS;
        } else if (/[,;:]$/.test(trimmed)) {
          delay = COMMA_DELAY_MS;
        }

        await new Promise((r) => setTimeout(r, delay));
      }
      controller.close();
    },
  });
}
