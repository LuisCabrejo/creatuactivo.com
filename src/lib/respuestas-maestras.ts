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
 * Sincronizado CARÁCTER POR CARÁCTER con arsenal_inicial.txt v5.35 BLOQUE 1.
 *
 * Reescritura 8 ago 2026 — EL ESTANTE Y EL ORDEN. Dos cambios del Director:
 *   • **Fuera el marco de consumo diario.** Abría con "se apoya en hábitos de
 *     consumo" y remataba con "como son productos de consumo diario": el mismo
 *     ancla dos veces, plantando la góndola del mercado antes de que la persona
 *     vea un precio. Después compara la caja de $110.900 contra una libra de
 *     café de $25.000 — y esa comparación la habíamos puesto nosotros. Ahora el
 *     estante es **premium de bienestar**, que es donde el mercado YA tiene a
 *     Gano Excel, y la recompra se explica por **resultado**, no por costumbre.
 *     "Premium" no es un adjetivo que reclame: reconoce algo que el lector ya
 *     cree, y por eso no abre discusión.
 *   • **La viabilidad va agrupada y al final.** Gano Excel abría el párrafo 2 y
 *     reaparecía en el 5, con el dinero metido en medio. Orden nuevo: tesis →
 *     dinero → recurrencia → viabilidad → su rol → viernes. Gano y Queswa en
 *     líneas propias: son los dos que cargan el peso, y verlos apilados
 *     convierte la explicación en alivio. Salió "Esto corre en paralelo a su
 *     agenda" — el saludo de WhatsApp ya lo dice.
 * "No vuelve al producto genérico" se conserva a propósito: la negación no
 * introduce el fantasma, lo CIERRA — "premium" ya había abierto el contraste.
 *
 * Ajuste 7 ago 2026 — RESPONDER RÁPIDO Y REPARTIR CLARO. Cinco correcciones del
 * Director sobre el transcript del mediodía:
 *   • La introducción no respondía la pregunta: explicaba que no arranca de cero
 *     antes de decir QUÉ es el modelo. Ahora la primera línea nombra la máquina
 *     —un canal de distribución apoyado en un hábito que ya existe— y el resto
 *     desarrolla. La pregunta se contesta en la primera oración.
 *   • "El trabajo pesado lo cargamos entre los dos" se leía como Queswa + el
 *     prospecto, o sea lo contrario de lo que dice. "Lo asumimos nosotros" deja
 *     claro que el bloque somos Gano y Queswa, y que él queda afuera del trabajo.
 *   • "Compartir con quien quiera" → "compartir ESTE MISMO acceso con quien
 *     desee". "Este mismo" señala lo que la persona está usando en ese instante,
 *     así que entiende sin que se lo digan que va a repartir exactamente lo que
 *     le dieron a ella.
 *   • El ciclo se refuerza como consecuencia natural ("se arma un ciclo natural…
 *     ese consumo recurrente es el que estabiliza su flujo de caja") y sale
 *     "esa segunda venta ya no le cuesta trabajo", que sobraba.
 *   • "La persona consume" → "el cliente consume": quien consume es cliente.
 *
 * ⚠️ PENDIENTE conocido: el saludo de WhatsApp también dice "canal de
 * distribución" y "en paralelo", así que quien toca el botón lee dos veces lo
 * mismo en veinte segundos. La corrección propuesta —abrir con "Ese consumo ya
 * existe", recogiendo la última palabra del saludo— está sin decidir.
 *
 * Reescritura previa 6 ago 2026 — NARRATIVA DE ECUACIÓN (sesión Director + Gemini sobre el
 * transcript real del canal). De 1.353 a 921 caracteres: sale en dos mensajes, no en
 * tres, y la pregunta queda a la vista sin "leer más". Seis decisiones:
 *   1. Sin meta-frase de apertura. "Le respondo con el dinero primero" le avisaba al
 *      prospecto que le íbamos a manejar la conversación; el dinero sigue llegando en
 *      el segundo párrafo, pero sin anunciarlo. Abre con saludo — un texto que entra
 *      en frío se lee como manual.
 *   2. El mecanismo es un SUSTANTIVO, no una categoría: "el producto que se mueve por
 *      su canal", no "las ventas". "Ventas" obliga a imaginarse a uno mismo vendiendo.
 *      El desglose (detal / paquetes empresariales) vive en la respuesta hermana del
 *      botón "De dónde sale el dinero"; repetirlo aquí interrumpe la ecuación.
 *   3. Dos puntos como signo igual: "sale de una sola cosa:" avisa que viene un
 *      resultado, no una reflexión. (La palabra "matemática" sigue vetada en este
 *      párrafo — el dato apaga la emoción donde se enciende la confianza.)
 *   4. La recompra es un CICLO con la cadencia del villano invertida: "se consume, se
 *      acaba, se vuelve a pedir" contra "trabajar, pagar cuentas y repetir". Tres
 *      tiempos, impersonal — el producto hace el ciclo, no la gente (regla: contar
 *      compras, nunca personas).
 *   5. Fuera "deja de depender de sus horas": regresión: al latino trabajar no le duele;
 *      el villano es la dependencia. Fuera también "cuántas personas ya están
 *      consumiendo" — contaba cabezas.
 *   6. El viernes se movió del párrafo del dinero al CIERRE: arriba solo informaba;
 *      al final, después de "compartir", es la recompensa de haber compartido.
 *
 * Reescritura previa 31 jul 2026 — LENGUAJE CONCRETO. Origen: dos meses de conversaciones
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
const MASTER_WHY_02 = `Con gusto. El modelo funciona creando un canal de distribución apoyado en productos premium de bienestar que el cliente incorpora a su rutina.

La ganancia sale de una sola cosa: el producto que se mueve por su canal. Por cada movimiento, a usted le queda un porcentaje.

Y al ser productos funcionales con resultados reales para el bienestar y la vitalidad diaria —gracias al Ganoderma—, el cliente nota la diferencia y no vuelve al producto genérico. Cuando se le acaba, vuelve a pedir. Ese consumo recurrente por calidad es el que estabiliza su flujo de ingresos.

Del trabajo pesado nos encargamos nosotros:

**Gano Excel** pone las fábricas, la investigación y la logística — 30 años, más de 60 países. Usted maneja su canal desde el celular, sin comprar inventario ni entregar pedidos.

**Yo** explico y atiendo a toda hora, sin que usted tenga que repetirle lo mismo a cada interesado.

A usted le quedan dos cosas: compartir este mismo acceso con quien desee, y cobrar cada vez que su canal mueve producto.

¿Quiere ver cómo se gana?`;

/**
 * Texto Master EAM_01 — Chip 2 ("¿Cuál es la metodología operativa…").
 * Sincronizado con arsenal_inicial.txt BLOQUE 8 (incluye rótulo "Pregunta de seguimiento:" en el cierre).
 * Recalibración jun 2026 (sesión Luis + Gemini): versión SIMPLE — 3 pasos (Expandir / Activar /
 * Multiplicación), Activar en clave conversión (sin "filtrar"), 3er paso renombrado Maestría→Multiplicación,
 * acompañamiento Queswa + humano. Sin lista de "no requiere", sin "Protocolo de Validación", sin
 * "audita y autoriza", sin línea de prueba social (la claridad genera la convicción).
 */
const MASTER_EAM_01 = `Me gusta esa pregunta — es la que de verdad importa. 🪢

Su día a día se resume en dos acciones:

📲 **Compartir:** usted pasa un enlace a quien quiera.
🤝 **Recibir:** usted saluda a quien llega con interés.

Entre las dos estoy yo: converso con cada persona que llega, resuelvo sus dudas y maduro su decisión de avanzar. Cuando alguien está listo, le aviso.

Y quien entra con usted hace exactamente lo mismo, con las mismas dos acciones. De ahí salen la multiplicación de su negocio y el aumento de su facturación.

¿Le muestro los productos que mueven todo esto?`;

/**
 * Texto Master WHY_04 — "¿De dónde sale el dinero? / ¿Quién paga?".
 * Sincronizado CARÁCTER POR CARÁCTER con arsenal_inicial.txt (WHY_04).
 *
 * Creado 7 ago 2026. Era el único texto dictado del canal SIN candado: vivía
 * hardcodeado en `wa-apertura.ts` y solo se alcanzaba tocando el botón de la
 * apertura — un botón que se muestra una vez, en el primer mensaje. Quien
 * escribiera "¿de dónde sale la plata?" con sus palabras nunca lo veía; la
 * búsqueda lo mandaba a WHY_02 o a un FREQ. Ahora tiene los dos caminos.
 *
 * DIVISIÓN DE TRABAJO CON WHY_02 (crítica — las dos son botones de apertura y
 * antes se pisaban casi frase por frase): WHY_02 explica el MODELO —
 * apalancamiento, la ecuación, el ciclo, el reparto del trabajo. Esta responde
 * la TRANSACCIÓN: qué se vende, a quién, quién paga y cuándo llega. Por eso
 * WHY_02 dice "el producto que se mueve por su canal" sin desglosar: el
 * desglose (al detal / paquetes empresariales) vive aquí.
 *
 * ⚠️ Gano Excel aparece al final y como QUIEN CONSIGNA, no como la fuente. El
 * dinero sale del producto que se vende por el canal del prospecto; invertir ese
 * orden dispara el fantasma del multinivel ([[feedback_gano_respaldo_no_titular]]).
 * ⚠️ NO reintroducir "No es humo en la nube": el candado de confianza se AFIRMA,
 * nunca se niega — nombrar el elefante lo invoca. Lo reemplaza el ancla física
 * del último párrafo (fábrica → dirección; empresa de 30 años → su banco).
 */
const MASTER_DINERO_01 = `Buena pregunta, y la más importante.

El dinero sale de una sola fuente: el producto que se vende por su canal — café, bebidas y suplementos premium con ganoderma.

Se vende de dos formas: **al detal**, a quien solo quiere consumirlo, y en **paquetes empresariales**, a quien arranca su propio canal. De cada venta a usted le queda un porcentaje.

Y no es una sola vez: el producto se consume y se vuelve a pedir, así que esa venta se repite sin que haya que volver a venderla.

Quien le consigna es **Gano Excel**, y lo hace en **su cuenta bancaria cada viernes**. Producto que sale de una fábrica y llega a una dirección; plata que sale de una empresa de 30 años y llega a su banco.

¿Le muestro cómo se ve en números?`;

/**
 * Detecta la pregunta por el ORIGEN del dinero escrita con palabras propias.
 *
 * Deliberadamente NO captura "cómo se gana" a secas: esa es la pregunta por las
 * cifras del plan y le corresponde a arsenal_compensacion. Aquí solo entran las
 * formulaciones de procedencia ("de dónde sale/viene") y de pagador ("quién paga").
 */
const RE_DE_DONDE_SALE_EL_DINERO =
  /de\s+d[oó]nde\s+(sale|salen|viene|vienen)\s+(el|la|los|las)?\s*(dinero|plata|platica|ingresos?|ganancias?)|qui[eé]n\s+(me\s+)?(paga|consigna)/i;

/**
 * Detecta la pregunta por el día a día escrita con palabras propias.
 *
 * Sin esto, *"qué debo hacer en el día a día"* no coincidía con el chip exacto,
 * la búsqueda no traía EAM_01 con fuerza y el modelo improvisaba. El 7 ago
 * improvisó que la persona debía *"acompañar a las personas nuevas, motivarlas y
 * orientarlas"* — lo contrario exacto de la doctrina, que dice que de formar a
 * los nuevos me encargo yo. Plantar trabajo que no existe es el error más caro
 * que puede cometer esta respuesta.
 *
 * Deliberadamente estrecho: NO captura "qué debo hacer para empezar", que es una
 * pregunta de proceso y le toca al cierre.
 */
const RE_DIA_A_DIA =
  /d[ií]a\s+a\s+d[ií]a|cu[aá]l\s+(es|ser[ií]a)\s+mi\s+(rol|papel|trabajo|funci[oó]n)|qu[eé]\s+(tendr[ií]a|tengo)\s+que\s+hacer\s+yo|qu[eé]\s+har[ií]a\s+yo|en qu[eé]\s+consiste\s+mi/i;

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
const MASTER_EMPRESA_DIGITAL = `Con gusto. Aquí lo llamamos **canal de distribución**, y es lo mismo: un negocio propio con sus beneficios, sin tener que montar la operación física.

En un negocio tradicional usted paga arriendo, nómina, inventario y transporte. Aquí usted es dueño de un canal de distribución, y todo eso lo asume **Gano Excel**: fabrica el café y los suplementos, y los despacha hasta la casa de su cliente.

Y es digital porque el canal entero cabe en su celular. Yo atiendo a sus clientes a toda hora, y de cada compra a usted le queda un porcentaje que se liquida en **su cuenta bancaria cada viernes**.

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

Cómo aplicaría en su caso lo ve directo con el equipo de creatuactivo.com. Cuando quiera, dígamelo y lo conecto.`;

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
  // 4) "¿De dónde sale el dinero? / ¿quién paga?" → la transacción, verbatim.
  //    (Es el botón más tocado de la apertura de WhatsApp; sin esto solo se
  //    alcanzaba tocándolo, nunca escribiendo la pregunta.)
  if (RE_DE_DONDE_SALE_EL_DINERO.test(key)) return MASTER_DINERO_01;
  // 5) "¿qué hago en el día a día?" → los tres movimientos, verbatim.
  //    (Sin esto el modelo improvisaba y plantaba trabajo que no existe.)
  if (RE_DIA_A_DIA.test(key)) return MASTER_EAM_01;
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
