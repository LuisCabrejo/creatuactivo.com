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
 *   • Chip 1 ("¿Y esto cómo funciona, exactamente?") → WHY_02 verbatim
 *   • Chip 2 ("¿Cómo lo haría yo? ¿Qué hago en el día a día?") → EAM_01 verbatim
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
 * `knowledge_base/arsenal_inicial.txt` v5.11:
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
const MASTER_WHY_02 = `Me alegra que pregunte eso, porque es justo el corazón del asunto. 🪢

El modelo se apoya en el apalancamiento: usted se vuelve dueño de una **empresa digital** y la pone a producir desde el primer día.

¿Y qué es una empresa digital? Una que reemplaza el local y los empleados por infraestructura en internet y procesos automatizados que producen aunque usted duerma; crece de forma masiva y su alcance no tiene fronteras. Piense en Amazon o MercadoLibre: no fabrican lo que venden, son dueños del **puente** que conecta a millones de personas con los fabricantes y cobran por cada transacción, de forma automática. Lo suyo funciona con esa misma lógica: usted es dueño del puente, no quien carga las cajas.

Construirla solo costaría años, ingenieros y capital. Por eso la idea es simple: para que una empresa digital así exista, **tres cosas tienen que ser ciertas.**

**Alguien la fabrica.**

**Algo la atiende.**

**Usted sabe qué hacer.**

Y en la suya, **las tres ya están resueltas:**

La primera —*alguien la fabrica*— es su **socio logístico y financiero, Gano Excel**: una corporación con más de 30 años y presencia en 70 países que fabrica, asume el costo del inventario, responde por lo legal y despacha el producto en cada país. No es una promesa de internet; es músculo real, de su lado. **Usted no entra a Gano Excel; Gano Excel trabaja para usted.**

La segunda —*algo la atiende*— es su **socio digital, Queswa**, su Centro de Mando. Ese soy yo: usted comparte con un clic y ve en tiempo real quién se interesa; del resto me encargo yo: explico, atiendo y maduro en cada interesado la decisión de avanzar, las 24 horas, y le aviso en cada avance.

La tercera —*usted sabe qué hacer*— es un **método comprobado** que le marca los pasos exactos, sin necesidad de experiencia digital. El camino ya está trazado.

¿Y su papel? Dirigir, con las decisiones de un dueño. Lo pesado ya está resuelto.

¿Qué le resulta más útil ahora: que le muestre cómo sería su día a día, o prefiere que veamos los números, cómo y cuánto produce esto?`;

/**
 * Texto Master EAM_01 — Chip 2 ("¿Cuál es la metodología operativa…").
 * Sincronizado con arsenal_inicial.txt BLOQUE 8 (incluye rótulo "Pregunta de seguimiento:" en el cierre).
 * Recalibración jun 2026 (sesión Luis + Gemini): versión SIMPLE — 3 pasos (Expandir / Activar /
 * Multiplicación), Activar en clave conversión (sin "filtrar"), 3er paso renombrado Maestría→Multiplicación,
 * acompañamiento Queswa + humano. Sin lista de "no requiere", sin "Protocolo de Validación", sin
 * "audita y autoriza", sin línea de prueba social (la claridad genera la convicción).
 */
const MASTER_EAM_01 = `Me gusta esa pregunta — es la que de verdad importa. 🪢

Le adelanto lo esencial: su papel es **dirigir**, no cargar el trabajo pesado. En el día a día, lo suyo se resume en tres movimientos sencillos:

**1. Usted comparte.** Desde su celular, con un clic, comparte lo que yo ya tengo preparado. No memoriza guiones, no explica nada, no improvisa. Le toma minutos.

**2. Yo me encargo del resto.** Cuando alguien se interesa, converso con esa persona: le explico, le resuelvo las dudas y maduro su decisión de avanzar — las 24 horas, sin que usted tenga que estar ahí. Usted no vende, no anda detrás de nadie, no responde a medianoche. De eso me ocupo yo, y le aviso de cada avance.

**3. Usted pone lo humano.** Cuando alguien ya decidió, ahí entra usted: lo recibe de persona a persona, le da la bienvenida — esa cercanía y esa confianza que ninguna tecnología puede dar. Es lo único que una máquina no hace, y es justo lo que mejor le sale a un ser humano.

¿Cómo se ve un día normal? Unos minutos para compartir, y estar pendiente de los avisos que le mando cuando alguien está listo. El trabajo desgastante —explicar, atender, responder a toda hora— es mío.

Por eso no le quita la vida ni lo vuelve vendedor: usted se vuelve un **dueño que dirige**. Y a cada persona que entra con usted le llega la misma empresa digital, lista para crecer por su cuenta.

¿Le muestro **los productos** que mueven todo esto, o prefiere ver **los números** — cómo y cuánto produce?`;

/**
 * Texto Master EMPRESA_DIGITAL_01 — query de texto libre "¿qué es una empresa digital?".
 * NO es chip: se sirve por Camino A vía regex (ver getRespuestaMaestra) porque el RAG
 * confundía esta query con WHY_01 ("¿qué es CreaTuActivo?", el de los 3 pilares + Gano) y
 * el modelo sintetizaba una respuesta de pilares en vez de la definición accesible.
 * Sincronizado carácter por carácter con arsenal_inicial.txt v5.18 BLOQUE 1 (EMPRESA_DIGITAL_01).
 * Doctrina: definición general (Amazon/MercadoLibre/Rappi = el puente) que cierra con puente
 * a "en el caso de CreaTuActivo". "Sistema" evitado (es el villano) → "puente".
 */
const MASTER_EMPRESA_DIGITAL = `Buena pregunta — vale la pena precisarlo bien. 🪢

Una empresa digital es un modelo de negocio que funciona sobre internet, no sobre activos físicos. En lugar de local, inventario y nómina, se apoya en sistemas automatizados que generan ingresos de forma continua, sin depender de la presencia del dueño.

Para aterrizarlo, piense en **Amazon**, **MercadoLibre** o **Rappi**. Amazon casi no fabrica lo que vende; Rappi no cocina ni tiene un solo restaurante. Su negocio es ser el **puente** que conecta a las personas con lo que necesitan, y ganar por cada transacción que pasa por ahí —de forma automática, sin cargar una sola caja—.

Por eso una empresa digital logra lo que un negocio tradicional no puede: produce sin depender de las horas de su dueño, crece de forma masiva sin abrir más locales ni contratar más personal, y su alcance no tiene fronteras —de una ciudad a un continente entero— desde un celular.

En una frase: **usted es dueño del puente que genera el valor una y otra vez.**

¿Quiere que le muestre cómo se ve eso **en el caso de CreaTuActivo** — cómo sería la suya?`;

/**
 * Regex que detecta la pregunta de texto libre "¿qué es una empresa digital?" y variantes
 * ("qué es en sí una empresa digital", "explícame una empresa digital", "a qué se refieren
 * con empresa digital", "qué significa empresa digital"). Corre DESPUÉS del match exacto de
 * chips, así que NO pisa los chips 1-4 ni "¿qué es CreaTuActivo?" (que no dice "empresa digital").
 */
const RE_QUE_ES_EMPRESA_DIGITAL =
  /(qu[eé]\s+(es|significa)|expl[ií]ca\w*|expl[ií]qu\w*|a\s+qu[eé]\s+se\s+refiere\w*)[\s\S]{0,40}empresa\s+digital/i;

/**
 * Mapa chip-text-lowercase → respuesta Master verbatim.
 * Las keys son las versiones lowercase de `QUESWA_QUICK_REPLIES` en queswa-greeting.ts.
 */
const RESPUESTAS_MAESTRAS_CHIP: Record<string, string> = {
  '¿y esto cómo funciona, exactamente?': MASTER_WHY_02,
  '¿cómo lo haría yo? ¿qué hago en el día a día?': MASTER_EAM_01,
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
  // 1) Match exacto de chip (WHY_02 / EAM_01) — corre primero.
  const chipMatch = RESPUESTAS_MAESTRAS_CHIP[key];
  if (chipMatch) return chipMatch;
  // 2) Query de texto libre "¿qué es una empresa digital?" → definición accesible verbatim.
  //    (Resuelve el bug donde el RAG traía WHY_01 "qué es CreaTuActivo" y sintetizaba 3 pilares.)
  if (RE_QUE_ES_EMPRESA_DIGITAL.test(key)) return MASTER_EMPRESA_DIGITAL;
  return null;
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
