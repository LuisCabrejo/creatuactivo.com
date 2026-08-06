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
 * Texto Master WHY_02 — Chip 1 ("¿Y esto cómo funciona, exactamente?").
 * Sincronizado CARÁCTER POR CARÁCTER con arsenal_inicial.txt v5.28 BLOQUE 1.
 *
 * Reescritura 31 jul 2026 — LENGUAJE CONCRETO. Origen: dos meses de conversaciones
 * 1-a-1 del Director sin un solo "wow". La versión anterior explicaba arquitectura
 * (el puente, Amazon/MercadoLibre, la tríada) y nunca decía de dónde sale el dinero,
 * que es la pregunta real debajo de "cómo funciona" — el prospecto quiere saber
 * "¿cómo voy yo?", y trae una regla de tres: doy y gano, no trabajo no gano.
 * Ahora: el dinero en el segundo párrafo (ventas de producto y de paquetes
 * empresariales → porcentaje → cuenta bancaria cada viernes), después la recurrencia
 * (el café se acaba), y la arquitectura al final reducida a dos fuerzas — quien
 * fabrica y quien atiende. El método se queda en EAM_01.
 * Se retira "empresa digital": vacío semántico que el oyente rellena con pirámides o
 * cripto (la misma causa por la que el modelo alucinaba infoproductos).
 * Ver docs/handoff/negocio/HANDOFF_HOOK_Y_LENGUAJE_CONCRETO_JUL2026.md §8.
 */
const MASTER_WHY_02 = `Me alegra que pregunte esto. Le respondo con el dinero primero, que es lo que uno de verdad se está preguntando. 🪢

Usted arma un canal de distribución que dirige completo desde el celular. Los productos son de consumo diario —café, bebidas y suplementos con ganoderma— y los fabrica y los despacha **Gano Excel**, una empresa con más de 30 años y presencia en 70 países. Usted no compra inventario ni entrega pedidos.

La ganancia sale de las ventas, y de nada más. Cada vez que alguien compra dentro de su negocio —un cliente suyo, o alguien que arrancó con su propio paquete empresarial— a usted le queda un porcentaje, y se lo liquidan en **su cuenta bancaria cada viernes**.

Ahora, lo que casi nadie ve a la primera: **el café se acaba**. La persona que quedó contenta vuelve a pedir el mes siguiente, y esa venta ya no le cuesta trabajo a usted. Ahí es donde el ingreso deja de depender de sus horas y empieza a depender de cuántas personas ya están consumiendo.

El peso se reparte en dos. La fábrica y la entrega ya las puso Gano. Y la parte que a la mayoría se le hace cuesta arriba —explicar, atender, estar pendiente— la hago yo: converso por WhatsApp con cada persona interesada y maduro la decisión de avanzar, a toda hora.

¿Qué prefiere ahora: que veamos los números de cómo se vería en su caso, o que le muestre cómo sería su día a día?`;

/**
 * Texto Master EAM_01 — Chip 2 ("¿Cuál es la metodología operativa…").
 * Sincronizado con arsenal_inicial.txt BLOQUE 8 (incluye rótulo "Pregunta de seguimiento:" en el cierre).
 * Recalibración jun 2026 (sesión Luis + Gemini): versión SIMPLE — 3 pasos (Expandir / Activar /
 * Multiplicación), Activar en clave conversión (sin "filtrar"), 3er paso renombrado Maestría→Multiplicación,
 * acompañamiento Queswa + humano. Sin lista de "no requiere", sin "Protocolo de Validación", sin
 * "audita y autoriza", sin línea de prueba social (la claridad genera la convicción).
 */
const MASTER_EAM_01 = `Me gusta esa pregunta — es la que de verdad importa. 🪢

Su papel es **dirigir**, no cargar con el trabajo pesado. En el día a día son tres movimientos:

**Comparte.** Pasa un enlace desde su celular. No memoriza guiones ni explica nada: de eso me encargo yo.

**Recibe.** Yo converso con cada interesado y maduro su decisión de avanzar, las 24 horas. Cuando alguien ya decidió le aviso, y usted lo recibe de persona a persona — esa cercanía es lo único que una máquina no da.

**Multiplica.** Quien entra con usted recibe lo mismo que usted tiene, ya montado. Y yo también le enseño: usted no vuelve a explicar de cero.

Un día normal son unos minutos para compartir y estar pendiente de mis avisos. Lo desgastante —explicar, atender, responder a medianoche— es mío.

¿Le muestro **los productos**, o **los números**?`;

/**
 * Texto Master EMPRESA_DIGITAL_01 — query de texto libre "¿qué es una empresa digital?".
 * NO es chip: se sirve por Camino A vía regex (ver getRespuestaMaestra) porque el RAG
 * confundía esta query con WHY_01 ("¿qué es CreaTuActivo?", el de los 3 pilares + Gano) y
 * el modelo sintetizaba una respuesta de pilares en vez de la definición accesible.
 * Sincronizado carácter por carácter con arsenal_inicial.txt v5.28 BLOQUE 1 (EMPRESA_DIGITAL_01).
 *
 * Reescritura 31 jul 2026 — la versión anterior definía la categoría hacia arriba
 * (Amazon/MercadoLibre/Rappi = el puente) y abría con "funciona sobre internet, NO sobre
 * activos físicos", que contradice de frente el candado de confianza de WHY_02 (café físico
 * de una fábrica real → cuenta bancaria el viernes) y nos ubica del lado de "la nube", el
 * patrón que el prospecto reconoce como fraude. Ahora aterriza: lo digital es la forma de
 * dirigirlo (celular, sin local ni bodega); lo que se mueve es físico. El candado se AFIRMA,
 * nunca se niega — decir "no es dinero en la nube" invoca el elefante rosado.
 */
const MASTER_EMPRESA_DIGITAL = `Buena pregunta, y vale la pena precisarla porque ese término se usa para todo. 🪢

En nuestro caso quiere decir algo sencillo: el negocio se dirige entero desde el celular. Sin local, sin empleados, sin bodega.

Lo que se mueve, en cambio, es bien físico. **Café y suplementos** que salen de una fábrica, llegan a la casa de una persona, y le dejan a usted un porcentaje que se liquida en **su cuenta bancaria cada viernes**.

Lo digital es lo que le quita el peso de encima: yo converso por WhatsApp con cada persona interesada, le explico y le resuelvo las dudas a toda hora, sin que usted tenga que estar ahí. Eso es lo que antes exigía un local abierto y gente contratada.

¿Quiere que le muestre con números cómo se vería en su caso?`;

/**
 * Regex que detecta la pregunta de texto libre "¿qué es una empresa digital?" y variantes
 * ("qué es en sí una empresa digital", "explícame una empresa digital", "a qué se refieren
 * con empresa digital", "qué significa empresa digital"). Corre DESPUÉS del match exacto de
 * chips, así que NO pisa los chips 1-4 ni "¿qué es CreaTuActivo?" (que no dice "empresa digital").
 */
const RE_QUE_ES_EMPRESA_DIGITAL =
  /(qu[eé]\s+(es|significa)|expl[ií]ca\w*|expl[ií]qu\w*|a\s+qu[eé]\s+se\s+refiere\w*)[\s\S]{0,40}empresa\s+digital/i;

/**
 * Texto Master INVERSION_MARKETING_01 — oferta 1-a-1 no pública de apoyo con marketing.
 * Sincronizado carácter por carácter con arsenal_inicial.txt v5.26 (INVERSION_MARKETING_01,
 * <verbatim_lock>, insertado tras FREQ_02).
 *
 * POR QUÉ CAMINO A y no RAG: el prospecto que oyó esta oferta 1-a-1 la pregunta con
 * redacciones muy variadas ("cómo es el tema de la inversión digital -publicidad",
 * "invertir en el marketing que uds hacen") que a nivel de fragmento no ganan el top-5
 * del vector (0.40-0.45, por debajo de PERFIL_01/FREQ_21/OBJ_02) → el modelo sintetizaba
 * desde fragmentos de capitalización y llegó a NEGAR que la oferta existiera (QA 9 jul 2026).
 * La respuesta es corta, fija y sensible (confirmar + remitir, sin mecánica ni cifras) —
 * nodo determinístico → backend dictador. Ver memoria project_inversion_marketing_selectiva.
 */
const MASTER_INVERSION_MARKETING = `Así es. Además del acompañamiento en logística e inteligencia artificial, hay casos puntuales donde el equipo también apoya con marketing para acelerar la construcción de la estructura.

Lo que le corresponde es hablar directo con el equipo de creatuactivo.com para ver cómo aplicaría esto en su caso.

**Acción directa:** Cuando quiera, dígamelo y lo conecto con el equipo de creatuactivo.com.`;

/**
 * Regex del tema "invertir en marketing/publicidad/pauta". Requiere SIEMPRE un verbo/sustantivo
 * de inversión o ayuda CERCA de marketing/publicidad/pauta — "¿tengo que hacer publicidad?"
 * (FREQ_02, los tres caminos) NO dispara porque no menciona invertir/ayudar.
 * Cubre: "invertir en marketing", "la inversión digital -publicidad", "invierten en publicidad",
 * "me pueden ayudar con marketing", "apoyan con la pauta". El stem laxo `inv(?!it)\w+` absorbe
 * typos reales de QA ("inveritr") sin capturar "invitar/invitación" (negative lookahead).
 */
const RE_INVERSION_MARKETING =
  /(inv(?!it)\w+)[\s\S]{0,60}(marketing|publicidad|pauta)|(marketing|publicidad|pauta)[\s\S]{0,60}(inv(?!it)\w+)|(ayud\w+|apoy\w+)[\s\S]{0,30}con\s+(el\s+|la\s+)?(marketing|publicidad|pauta)/i;

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
  // 3) Tema "invertir en marketing/publicidad" → confirmar + remitir verbatim.
  //    (El RAG no lo recupera con fiabilidad y el modelo llegó a negar que existiera.)
  if (RE_INVERSION_MARKETING.test(key)) return MASTER_INVERSION_MARKETING;
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
