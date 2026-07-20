# Investigación Exhaustiva: Garantizar Entrega Verbatim de Respuestas RAG en Asistente Conversacional con LLM

**Solicitante:** Luis Cabrejo (CEO, CreaTuActivo.com)
**Fecha:** 18 May 2026
**Sistema afectado:** Queswa — chatbot de calificación patrimonial sobre Claude Sonnet 4.6 + Voyage AI + Supabase
**Tipo de entregable esperado:** Investigación técnica exhaustiva con 3-5 soluciones arquitectónicas viables, validadas contra literatura técnica reciente (papers, blogs de ingeniería de Anthropic/OpenAI/Cohere/LangChain), con análisis de tradeoffs y plan de implementación priorizado.

---

## 1. CONTEXTO DEL NEGOCIO

CreaTuActivo es una plataforma B2C que opera en una categoría de mercado nueva ("Construcción de Estructura Patrimonial"). Queswa es el chatbot que califica prospectos en la home (creatuactivo.com). El 80% del tráfico inicial concentra en 4 preguntas presentadas como botones (chips) en el saludo inicial:

1. *"Quiero entender la lógica: ¿cómo funciona esta Estructura Patrimonial?"* → debería entregar respuesta tipo WHY_02
2. *"¿Cuál es la metodología operativa? ¿Qué hago yo en el día a día?"* → debería entregar respuesta tipo EAM_01
3. *"¿Cuál es el producto? ¿Sobre qué activo físico se sostiene este flujo de caja?"* → catálogo de productos (FUNCIONA BIEN, no es objeto de esta investigación)
4. *"Quiero ver los números: ¿cómo se monetiza y cuáles son las vías de liquidez?"* → compensación (FUNCIONA BIEN)

Estas respuestas fueron calibradas por un Director Académico de Élite (consultor externo) tras meses de optimización. Cada palabra, cada signo y cada orden de párrafo está diseñado para neutralizar objeciones específicas en perfiles de alto nivel (CEOs, médicos, ejecutivos en LATAM).

**El problema actual:** Queswa parafrasea las respuestas calibradas. Recupera la doctrina general (Tres Pilares, Tridente EAM, rol Arquitecto) pero **inventa la prosa**, sustituyendo el copy quirúrgico del Director Académico por una síntesis genérica desde el system prompt.

---

## 2. EL SÍNTOMA — TRES EJEMPLOS REALES (CRUDOS)

### Ejemplo 1: Query "qué es CreaTuActivo.com"

**Respuesta deseada** (extracto del arsenal RAG, marcada con `[VERBATIM_LOCK]`):

> CreaTuActivo.com no es un canal de ventas, un curso educativo o una red de mercadeo. Es una infraestructura de Ingeniería Patrimonial diseñada para corregir una vulnerabilidad crítica en su economía: el hecho de que si usted se detiene, su flujo de ingresos se detiene de inmediato.
>
> Le entregamos el control de una Base Operativa autónoma ya ensamblada, estructurada sobre tres pilares de alto rendimiento que absorben el desgaste operativo por usted:
>
> - **La Matriz Física (Capa Logística):** Gano Excel asume el 100% de la fricción operativa —fábricas, inventarios, aduanas y despachos— en 70 países. Usted no compra para revender de forma manual, no gestiona envíos y no asume pasivos.
> - **El Centro de Mando (Capa Tecnológica):** Queswa.app, mi entorno impulsado por Inteligencia Artificial, gestiona la prospección, el filtrado y la pre-calificación de perfiles las 24 horas, asumiendo el desgaste de explicar por usted.
> - **El Tridente EAM (La Metodología Automatizada):** Nuestro protocolo de ejecución estandarizado (Comando Expandir · Comando Activar · Comando Maestría) que le entrega las coordenadas exactas de dirección para expandir su activo sin improvisación.
>
> Su rol es estrictamente de Dirección Ejecutiva: usted asume la dirección estratégica del activo, mientras el sistema absorbe la operación. El resultado es una Estructura Patrimonial que genera ingresos recurrentes por consumo, integrándose a su dinámica profesional actual sin sumar carga a su agenda.
>
> ¿Su prioridad en este momento es auditar la mecánica operativa de su Base, o prefiere que simulemos la matemática de los ingresos recurrentes que produce este activo?

**Respuesta que entrega Queswa hoy:**

> CreaTuActivo opera en una categoría nueva: Construcción de Estructura Patrimonial.
>
> El ecosistema se sostiene sobre tres pilares: una Matriz Física global (Gano Excel, presencia en 70 países, inventarios y despachos a cargo del sistema), Queswa como Centro de Mando con inteligencia artificial para prospección y calificación, y el Tridente EAM —Comando Expandir, Comando Activar, Comando Maestría— como metodología automatizada que elimina el ensayo y error.
>
> El rol del usuario no es operar esos pilares. Es dirigirlos.
>
> ¿Identifica usted la diferencia operativa entre dirigir una infraestructura y ejecutar una tarea?

**Análisis técnico de la disparidad:**

1. El **opening** del copy maestro ("no es un canal de ventas, un curso educativo o una red de mercadeo") — una **neutralización preventiva de objeciones** psicológicamente calibrada — desaparece por completo.
2. Los **labels de los pilares** ("Capa Logística", "Capa Tecnológica", "La Metodología Automatizada") están omitidos.
3. El **cierre** entregado (*"¿Identifica usted la diferencia operativa entre dirigir una infraestructura y ejecutar una tarea?"*) NO está en el arsenal — es un **vector técnico de cierre genérico del system prompt** (línea 84 del prompt v26.7). Esto indica fuertemente que el modelo está sintetizando desde su contexto identitario, NO desde un fragmento RAG recuperado.

### Ejemplo 2: Query "cómo funciona el negocio"

**Respuesta deseada** (extracto, marcada con `[VERBATIM_LOCK]`):

> Para entender la mecánica de funcionamiento, primero debemos diagnosticar una inconsistencia en su economía actual: usted trabaja duro y gana bien, pero si decide detenerse por salud, por un imprevisto, o si simplemente quiere tomar 60 días de vacaciones reales, su flujo de dinero se detiene de inmediato. Eso no es éxito financiero; es una arquitectura financiera con un punto ciego de alto costo.
>
> CreaTuActivo.com corrige este Déficit Estructural de Ingresos entregándole el control de una Base Operativa autónoma. Su funcionamiento no depende de su trabajo físico; se ejecuta mediante la sincronización de tres pilares de alto rendimiento que asumen el 90% de la fricción operativa por usted:
> [...tres pilares con labels canónicos...]
>
> Su rol es estrictamente de Dirección Ejecutiva: usted no opera la maquinaria, la dirige. [...continúa con monetización de hábito biológico, ciclo semanal de Gano Excel, etc.]
>
> ¿Su prioridad en este momento es auditar la secuencia operativa de cómo se expande su Base, o prefiere que simulemos en su Dashboard la matemática de los ingresos recurrentes que produce esta estructura?

**Respuesta que entrega Queswa hoy:**

> El diagnóstico es directo: su arquitectura financiera actual probablemente tiene un Déficit Estructural de Ingresos — el ingreso depende 100% de su presencia física. Si usted se detiene, su dinero se detiene.
>
> El ecosistema instala una Estructura Patrimonial en paralelo a su ocupación actual. Usted conecta personas al sistema; el sistema —sus tres pilares— ejecuta la operación: la Matriz Física gestiona productos e inventarios, Queswa filtra y califica prospectos, y el Tridente EAM entrega las coordenadas exactas de ejecución. Usted dirige. El sistema carga la operación.
>
> ¿Qué tan de mente abierta estaría para auditar la viabilidad de esta estructura para su perfil?

**Análisis:** Capta la doctrina (Déficit Estructural, Tres Pilares, "Usted dirige") pero comprime el copy maestro de ~350 palabras a ~110 palabras, perdiendo el frame del diagnóstico inicial ("usted trabaja duro y gana bien, pero..."), los labels canónicos de los pilares, y el cierre Master ("simulemos en su Dashboard la matemática..."). El cierre entregado es de nuevo un vector genérico del system prompt (línea 83).

### Ejemplo 3: Query "cuál sería mi día a día en este proyecto"

Similar patrón: aforismos canónicos correctos ("Usted no explica — Queswa explica") pero opening Master ausente ("Nuestra metodología elimina el mayor temor de cualquier profesional o empresario al iniciar un proyecto..."), y cierre tomado de vectores del system prompt ("Determine usted si su arquitectura patrimonial requiere este nivel hoy") en lugar del cierre Master ("auditar los tres Comandos canónicos del Tridente / simular la matemática").

---

## 3. ARQUITECTURA TÉCNICA DEL SISTEMA

**Stack:**
- **LLM:** Anthropic Claude Sonnet 4.6 (`claude-sonnet-4-6`) vía SDK oficial `@anthropic-ai/sdk`, streaming
- **Routing inteligente:** Claude Haiku 4.5 para queries clasificadas como "simples"
- **Embeddings:** Voyage AI `voyage-large-2` (1536 dim), similitud coseno, threshold 0.4
- **Base de datos vectorial:** Supabase (PostgreSQL + pgvector)
- **Runtime:** Vercel Edge Functions (`runtime: 'edge'`, `maxDuration: 60`)
- **Streaming:** paquete `ai` de Vercel (`StreamingTextResponse`)

**Pipeline de una query típica:**

```
Usuario escribe query
  ↓
Router temprano: isSimpleQueryEarly()
  ├─ Saludos / mensajes <= 3 palabras sin keywords → SIMPLE → skip vector search → Haiku
  └─ Todo lo demás → COMPLEJA → vector search → Sonnet
  ↓
Vector search (Voyage AI):
  ├─ Embed query (1536 dim)
  ├─ Similitud coseno contra ~135 fragmentos del arsenal (split por categoría)
  ├─ threshold >= 0.4 → categoría detectada → consultarArsenalFragments(top 5)
  └─ threshold < 0.4 → fallback a patrón regex (clasificarDocumentoHibrido)
  ↓
Build prompt:
  ├─ System prompt (27KB, cargado desde Supabase, caché 5 min)
  ├─ Session instructions (estado FSM dinámico)
  └─ Conversation messages
  ↓
anthropic.messages.stream() → StreamingTextResponse
```

**Tamaño del system prompt actual (v26.7):** 29,937 caracteres. Contiene:
- Identidad core ("Eres Queswa — unidad de procesamiento lógico...")
- Arquitectura canónica (Tres Pilares + Tridente EAM)
- Tono y voz "Lujo Clínico" (Pirámide McKinsey, frialdad matemática, etc.)
- Vocabulario prohibido (anti-MLM, anti-hype)
- Aforismos canónicos ("Usted no explica — Queswa explica" + variantes)
- Vectores técnicos de cierre genéricos
- Límite de respuesta (150 palabras máx, 3 párrafos)
- Reglas anti-alucinación
- **NUEVO (v26.7): Regla "REGLA [VERBATIM_LOCK] — INVIOLABLE"** que pide al modelo entregar carácter por carácter cualquier fragmento RAG envuelto entre `[VERBATIM_LOCK]...[/VERBATIM_LOCK]`
- Activación FSM dinámica (estados de cierre 1-4)

**Formato del fragmento RAG entregado al modelo:** texto plano markdown precedido por `### **WHY_02: "¿Cómo funciona el negocio?"**` + `**[Concepto Nuclear]:** ...` + cuerpo envuelto en `[VERBATIM_LOCK]...[/VERBATIM_LOCK]` + pregunta de seguimiento.

---

## 4. LO QUE YA SE INTENTÓ (NO REPETIR EN LA INVESTIGACIÓN)

### Intento 1: Excepción enumerativa en LÍMITE DE RESPUESTA (v26.1 → v26.5)
- **Acción:** Línea natural-language en el system prompt: *"Excepción: cuando el RAG recupera WHY_02, se entrega verbatim por su rol estructural en la calificación inicial."*
- **Resultado:** Funcionó parcialmente al inicio, pero la fidelidad cayó conforme el system prompt creció a 27KB. La instrucción "verbatim" compite contra el default conversacional del modelo y pierde.

### Intento 2: Marcador estructural [VERBATIM_LOCK] + regla blindada (v26.7, HOY)
- **Acción:**
  - Envolver el cuerpo de WHY_01/WHY_02/EAM_01 en `[VERBATIM_LOCK]...[/VERBATIM_LOCK]` en el arsenal
  - Agregar sección "REGLA [VERBATIM_LOCK] — INVIOLABLE" en el system prompt con 4 sub-reglas explícitas ("No parafrasees", "No reordenes", "Esta regla sobrescribe el límite de 150 palabras", etc.)
  - Modificar la directriz RAG ("Prioriza la idea del [Concepto Nuclear]") con excepción inviolable apuntando al marcador
- **Resultado (medido hoy, 38 min post-deploy, caché ya rotado):** Síntoma inalterado. Las respuestas siguen siendo paráfrasis sintetizadas desde el system prompt. **Hipótesis emergente:** el LLM o bien (a) no recibe el fragmento RAG en absoluto, o (b) lo recibe pero ignora el marcador estructural a favor de su bias conversacional + influencia masiva del system prompt.

### Intento 3: Backend dictador para chip-triggers (Camino A, HOY)
- **Acción:** Detectar match exacto contra el texto de los chips canónicos antes del vector search; si coincide, construir un `ReadableStream` con la respuesta Master y retornar `StreamingTextResponse` directamente, sin pasar por Anthropic.
- **Resultado:** **Funciona al 100% — 0 paráfrasis, $0 tokens, latencia ~50ms**. Pero solo aplica a los 2 chips canónicos. Las queries naturales con semántica equivalente ("qué es CreaTuActivo", "cómo funciona", "qué hago día a día") siguen el flujo RAG normal y siguen siendo parafraseadas.

### Intento NO realizado pero descartado por Luis:
- **Mover TODAS las respuestas verbatim a route.ts** como hardcoded strings. Razón del descarte: si Queswa no responde bien estas 3 preguntas, probablemente responde mal otras también. El problema es **sistémico (fidelidad RAG)**, no específico a 3 queries. Hardcodear soluciona los síntomas, no la causa.

---

## 5. HIPÓTESIS QUE LA INVESTIGACIÓN DEBE VALIDAR O DESCARTAR

**Hipótesis A — Routing temprano filtra queries cortas:** La función `isSimpleQueryEarly()` clasifica como "simple" cualquier query de ≤3 palabras que no contenga keywords específicos (precio, costo, cómo, funciona, etc.). La query *"qué es CreaTuActivo.com"* tiene 3 palabras y no contiene ninguno de esos keywords → se clasifica como SIMPLE → **NO PASA por vector search → modelo responde solo desde el system prompt sin fragmento RAG**. Esto explicaría completamente el ejemplo 1. Validar: ¿es esta la única causa del ejemplo 1? ¿Cómo afecta a queries cortas semánticamente importantes?

**Hipótesis B — Vector search no recupera los fragmentos con [VERBATIM_LOCK]:** Aunque los fragmentos existen en Supabase con embeddings frescos de Voyage AI (verificado), el threshold de similitud 0.4 puede estar filtrándolos para queries informales. Las queries del usuario son lenguaje cotidiano; el copy Master usa vocabulario premium ("infraestructura de Ingeniería Patrimonial", "Base Operativa autónoma ya ensamblada"). Validar: ¿necesitamos enriquecimiento de query (HyDE, RAG-fusion, multi-query)? ¿Necesitamos chunks más cortos? ¿Necesitamos re-rankers (Cohere, Voyage rerank-2)?

**Hipótesis C — El LLM ignora el marcador estructural a favor del system prompt:** Aún cuando el fragmento se entrega correctamente al modelo, la presencia de 27KB de system prompt con personalidad fuerte ("Lujo Clínico, frialdad matemática, McKinsey, máximo 3 párrafos") domina y el modelo opta por sintetizar en lugar de respetar el marcador. Validar: ¿hay evidencia empírica en literatura técnica (Anthropic, OpenAI) de que markers como `[VERBATIM_LOCK]` o XML tags funcionen confiablemente en prompts grandes? ¿Cuál es el techo real de reliability de instrucciones natural-language vs estructura del prompt?

**Hipótesis D — La separación system prompt / RAG está mal balanceada:** El system prompt actual tiene tanta densidad doctrinal (Tres Pilares, aforismos, vectores de cierre) que el modelo puede responder sin RAG. La arquitectura óptima sería un system prompt mínimo (persona + reglas de tono, ~5KB) y delegar TODA la doctrina al RAG. Validar: ¿qué hacen los sistemas de producción tipo Inflection AI, Character.ai, Anthropic Claude Projects? ¿Cómo está estructurado el system prompt de v0.dev, Cursor, GitHub Copilot Chat?

**Hipótesis E — Necesitamos prefill / assistant pre-filling:** Anthropic permite "pre-llenar" el inicio de la respuesta del assistant. Si el backend detecta que la query debe entregar WHY_02 y pre-llena los primeros 200 caracteres con el opening Master, el modelo continúa desde allí en lugar de inventar. Validar: ¿es robusto este patrón? ¿Funciona con streaming? ¿Se ha usado en producción para forzar fidelidad?

**Hipótesis F — Tool use / Structured Outputs:** En lugar de pedir al modelo que entregue texto verbatim, se le pide invocar una `tool` llamada `deliver_calibrated_response(fragment_id)` y el backend devuelve el texto exacto. Validar: ¿es viable este patrón en chat conversacional? ¿Funciona con streaming?

**Hipótesis G — Modelo equivocado para esta tarea:** ¿Es Claude Sonnet 4.6 el modelo correcto? ¿GPT-4o, Gemini 2.5 Pro o un modelo open-source con prompt simpler darían mejor fidelidad verbatim? ¿Vale la pena evaluar multi-modelo?

---

## 6. RESTRICCIONES INVIOLABLES DEL PROYECTO (NO PROPONER SOLUCIONES QUE LAS VIOLEN)

1. **Stack actual no negociable a corto plazo:** Anthropic Claude (Sonnet 4.6 / Haiku 4.5) + Voyage AI + Supabase + Vercel Edge. Cambiar de proveedor es un proyecto a 6 meses. Soluciones deben ser viables dentro de este stack.
2. **Streaming es obligatorio:** la UX requiere respuestas progresivas (no respuesta completa de golpe). Soluciones que rompan streaming están descalificadas.
3. **Latencia objetivo:** < 3s para primera palabra renderizada, < 8s para respuesta completa.
4. **Costo target:** ≤ $0.05 USD por conversación promedio. Cualquier solución que requiera >2 llamadas a LLM por turno necesita justificación de ROI.
5. **El sistema sirve también a 3 dominios adicionales** (luiscabrejo.com, ganocafe.online, queswa.app) con system prompts distintos pero la misma arquitectura. La solución debe escalar a multi-tenant.
6. **No tocar el copy del Director Académico:** los 3 textos Master están aprobados doctrinalmente. La investigación debe encontrar cómo entregarlos verbatim, no cómo "mejorarlos para que el modelo los respete mejor".
7. **El system prompt no puede crecer significativamente:** ya es 27KB. Soluciones que requieran +20KB de instrucciones están descalificadas.

---

## 7. ENTREGABLE ESPERADO

Documento técnico con la siguiente estructura:

### Sección A — Diagnóstico de causa raíz
Análisis fundamentado de cuál(es) de las hipótesis A-G explican mejor el síntoma. Citar literatura (papers, blogs de ingeniería, docs oficiales de Anthropic / Voyage / Cohere) cuando sea posible. No teoría — evidencia.

### Sección B — Soluciones candidatas (3-5 opciones)
Para cada solución:
- **Nombre y descripción técnica** (qué se construye)
- **Mecanismo de acción** (por qué resolvería el síntoma)
- **Evidencia / referencias** (quién lo ha usado en producción, papers que lo validan)
- **Tradeoffs** (costo, latencia, complejidad, deuda técnica)
- **Compatibilidad con restricciones de Sección 6**
- **Reliability estimada** (¿95%? ¿99%? ¿100%?)

### Sección C — Recomendación priorizada
- **Recomendación primaria** (qué implementar primero) con justificación
- **Plan de fallback** si la primaria no alcanza el objetivo
- **Métricas de éxito** (cómo medir que funcionó)

### Sección D — Plan de implementación
Si la recomendación primaria es viable, lista de pasos concretos para implementarla en el stack actual (Anthropic SDK, Vercel Edge, Voyage AI, Supabase). Si involucra cambios de arquitectura, diagrama antes/después.

---

## 8. PATRONES DE BÚSQUEDA SUGERIDOS PARA LA INVESTIGACIÓN

Términos en inglés (la literatura técnica de mayor calidad está en inglés):

- "LLM verbatim retrieval RAG fidelity"
- "Claude system prompt size impact on instruction following"
- "Anthropic prefill assistant response"
- "Anthropic tool use structured output deterministic response"
- "HyDE retrieval augmented generation 2024 2025"
- "RAG-Fusion multi-query"
- "Cohere rerank-2 / Voyage rerank-2 production"
- "Character.ai / Inflection / v0.dev system prompt architecture"
- "instruction following LLM long context degradation"
- "prompt engineering 27kb system prompt"
- "LLM grounding faithfulness retrieved context"
- "structured prompting XML tags Claude reliability"

Fuentes de alta credibilidad para citar:
- Blog de ingeniería de Anthropic (anthropic.com/engineering)
- Cookbook oficial de Anthropic (github.com/anthropics/anthropic-cookbook)
- Documentación de Vercel AI SDK
- Papers de NeurIPS / ICML / ACL 2024-2025 sobre RAG y verbatim retrieval
- Engineering blogs de empresas con LLM en producción (Notion AI, Linear AI, Cursor, GitHub Copilot, v0.dev)

---

## 9. APÉNDICE — TEXTO ACTUAL DEL FRAGMENTO RAG MARCADO (PARA REFERENCIA)

```markdown
### **WHY_02: "¿Cómo funciona el negocio?"**
**[Concepto Nuclear]:** Apalancamiento Estratégico Estructural. Tres pilares de infraestructura, un solo Arquitecto que los dirige. Usted no asume desgaste físico; usted ejerce dirección estratégica.

[VERBATIM_LOCK]
Para entender la mecánica de funcionamiento, primero debemos diagnosticar una inconsistencia en su economía actual: usted trabaja duro y gana bien, pero si decide detenerse por salud, por un imprevisto, o si simplemente quiere tomar 60 días de vacaciones reales, su flujo de dinero se detiene de inmediato. Eso no es éxito financiero; es una arquitectura financiera con un punto ciego de alto costo.

CreaTuActivo.com corrige este Déficit Estructural de Ingresos entregándole el control de una Base Operativa autónoma. Su funcionamiento no depende de su trabajo físico; se ejecuta mediante la sincronización de tres pilares de alto rendimiento que asumen el 90% de la fricción operativa por usted:

- **La Matriz Física (Capa Logística):** Gano Excel asume el 100% de la fricción operativa y los pasivos —fábricas, inventarios, aduanas, soporte presencial y despachos— en 70 países. Usted no financia, no gestiona variables logísticas y no asume riesgos de infraestructura.

- **El Centro de Mando (Capa Tecnológica):** Queswa.app (conmigo), mi entorno impulsado por Inteligencia Artificial. Me encargo de automatizar la prospección, el filtrado y la pre-calificación de perfiles las 24 horas, asumiendo el desgaste de buscar y explicar por usted.

- **La Metodología Automatizada (El Tridente EAM):** El protocolo de ejecución estandarizado (Comando Expandir · Comando Activar · Comando Maestría) que le entrega las coordenadas exactas de dirección para expandir su activo sin improvisaciones ni persecución manual.

Su rol es estrictamente de Dirección Ejecutiva: usted no opera la maquinaria, la dirige. Al asumir este control, el sistema monetiza un hábito biológico que el mercado no abandona: el consumo diario de café y suplementos premium. Esto consolida una Estructura Patrimonial que genera ingresos recurrentes liquidados en ciclo semanal por Gano Excel, integrándose a su dinámica profesional actual sin sumar carga a su agenda.

**Pregunta de seguimiento:** ¿Su prioridad en este momento es auditar la secuencia operativa de cómo se expande su Base, o prefiere que simulemos en su Dashboard la matemática de los ingresos recurrentes que produce esta estructura?
[/VERBATIM_LOCK]
```

---

## 10. APÉNDICE — REGLA ACTUAL EN EL SYSTEM PROMPT (v26.7)

```
## REGLA [VERBATIM_LOCK] — INVIOLABLE

Si el contenido recuperado del RAG aparece entre los marcadores `[VERBATIM_LOCK]` y `[/VERBATIM_LOCK]`, su delivery se rige por estas reglas absolutas:

1. **Entrega el contenido EXACTO entre los marcadores, carácter por carácter.** No parafrasees. No reordenes párrafos. No comprimas. No expandas. No reemplaces sinónimos.
2. **No imprimas los marcadores** `[VERBATIM_LOCK]` ni `[/VERBATIM_LOCK]` — son metadatos estructurales, no contenido de respuesta.
3. **Esta regla sobrescribe:** el límite de 150 palabras, la directriz "Prioriza la idea del [Concepto Nuclear]", el estilo Lujo Clínico de síntesis, y cualquier otra directriz que pueda inducir reformulación.
4. **Razón:** estos textos son copy calibrado por el Director Académico de Élite. Cada palabra, cada signo de puntuación y cada orden de párrafo han sido auditados contra el Glosario v1.4 y la doctrina v26.6. Reformularlos rompe la calibración psicológica precisa del posicionamiento.
```

Esta regla está deployada en producción desde hace 38 minutos. El caché de 5 minutos ya rotó. Los embeddings de WHY_01/WHY_02/EAM_01 se regeneraron simultáneamente con Voyage AI 1536-dim. La regla aparentemente **no logra forzar el delivery verbatim** — el modelo sigue sintetizando.

---

**Fin del brief. Profundidad esperada del entregable: 3000-5000 palabras, con citaciones a fuentes técnicas. Tono: senior engineering consultant. No hipotético — solucionable.**
