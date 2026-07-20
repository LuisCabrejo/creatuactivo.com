# Investigación Exhaustiva: Arquitectura de Perspicacia Semántica para Chatbots de Cualificación Patrimonial (2026)

**Solicitante:** Luis Cabrejo (CEO, CreaTuActivo.com)
**Fecha:** 23 May 2026
**Framework de análisis:** DEL-AL (Del estado actual problemático → Al estado de las compañías élite 2026)
**Sistema afectado:** Queswa — chatbot de calificación patrimonial sobre Claude Sonnet 4.6 + Voyage AI + Supabase
**Tipo de entregable esperado:** Investigación técnica exhaustiva con análisis de cómo las compañías líderes (Salesforce Agentforce, Intercom Fin, HubSpot Breeze, OpenAI Assistant API, Anthropic Claude, Sierra AI, 11x.ai, Bland AI, Lindy, Character.ai, Cursor, Notion AI) resuelven el problema de **comprensión contextual de intención conversacional** sin depender de patrones de matching textual (regex) frágiles.

---

## 1. CONTEXTO DEL NEGOCIO

CreaTuActivo opera en una categoría de mercado nueva ("Construcción de Estructura Patrimonial"). Queswa es el chatbot que califica prospectos en la home (creatuactivo.com). El objetivo es perfilar al prospecto durante la conversación, capturar señales BANT (Budget, Authority, Need, Timeline) asíncronas, y cuando detecte intención de cierre, ejecutar un warm handoff (transferencia con contexto completo) al equipo directivo vía email + link de WhatsApp pre-llenado.

El volumen proyectado es de **cientos de prospectos diarios** en América Latina (Colombia, México, Argentina, Brasil, Perú, USA hispanohablante, España, etc.) con variabilidad lingüística altísima: errores ortográficos, dialectos regionales, formas indirectas, mezcla de lenguaje formal e informal.

**Stack actual:**
- **LLM principal:** Anthropic Claude Sonnet 4.6 (`claude-sonnet-4-6`)
- **LLM secundario:** Claude Haiku 4.5 (queries simples)
- **Embeddings:** Voyage AI `voyage-large-2` (1536-dim) + `voyage-3-lite` (512-dim para fragments)
- **Base vectorial:** Supabase + pgvector
- **Runtime:** Vercel Edge Functions (`runtime: 'edge'`, `maxDuration: 60`)
- **Streaming:** paquete `ai` de Vercel
- **Sumarización warm handoff:** Claude Haiku 4.5

**Arquitectura actual del FSM de cierre (route.ts ~4000 líneas):**

```
Estado 0 — Conversación normal (RAG: vector search + Anthropic streaming)
Estado 2 — Tabla ESP de paquetes (modo informativo o cierre)
Estado 3 — Confirmación de paquete + solicitud de nombre
Estado 4 — Warm handoff (sumario Haiku + email Resend + link WhatsApp)
```

La detección de transiciones entre estados se hace mediante **expresiones regulares (regex)** que matchean el último mensaje del usuario contra patrones predefinidos.

---

## 2. EL ESTADO ACTUAL — "DEL" (problemas enfrentados)

A continuación enumeramos los **17 problemas documentados** que hemos encontrado durante 3 semanas de iteración. El patrón común es que **cada uno se intentó resolver con parches reactivos** (regex adicional, blacklist expandido, micro-prompt verbatim, marcador estructural, etc.) en lugar de atacar la causa arquitectónica raíz.

### Problemas de comprensión del prompt (Capa 1: System Prompt)

**Problema 1 — Hinchazón del prompt (Prompt Bloat).** System prompt monolítico de 45,940 caracteres (~11K tokens). Causó degradación del mecanismo de atención del modelo. La investigación previa (Gemini, 22 May 2026) confirmó "Lost in the Middle". Mitigación parcial: limpieza de redundancias v27.1 (reducción 23% a 35,354 chars). PERO sigue siendo monolítico — solo se redujo redundancia, no se modularizó.

**Problema 2 — Reglas críticas ignoradas por posición.** Reglas E/F/G/H (recursos de legibilidad cognitiva — negritas, cursivas, separadores) ubicadas al final del prompt (línea 400+ de 700) eran ignoradas en favor de reglas más viejas reforzadas en líneas tempranas. Mitigación: elevarlas al inicio del prompt (primacy effect v27.0). Funcionó parcialmente.

**Problema 3 — Marcador `[VERBATIM_LOCK]` con corchetes planos no efectivo.** Para forzar entrega verbatim de respuestas calibradas del Director Académico de Élite (WHY_01, WHY_02, EAM_01), se introdujo marcador `[VERBATIM_LOCK]...[/VERBATIM_LOCK]`. **Empíricamente falló** — el modelo seguía parafraseando. Causa raíz: Claude Sonnet 4.6 procesa corchetes planos como texto de baja prioridad. Solo etiquetas XML genuinas (`<verbatim_lock>...</verbatim_lock>`) activan el mecanismo de atención post-entrenado. Migración aplicada v26.8.

### Problemas de recuperación RAG (Capa 2: Vector Search)

**Problema 4 — Flag `is_fragment` faltante (bug masivo).** El cache de fragmentos en backend filtra por `metadata.is_fragment === true`. Auditoría reveló que 111 de 163 fragmentos NO tenían el flag — quedaron **invisibles al RAG por 7+ días**. Solo arsenales de tenants secundarios (ganocafe, marca_personal) y catálogo tenían el flag. TODOS los fragments de `creatuactivo_marketing` (arsenal_inicial, arsenal_avanzado, arsenal_compensacion, arsenal_reto) estaban excluidos. Mitigación: script de reparación + blindaje en script de fragmentación.

**Problema 5 — Confusión `embedding` vs `embedding_512`.** Hay dos columnas de embeddings en `nexus_documents`: `embedding` (1536-dim, voyage-large-2) y `embedding_512` (512-dim, voyage-3-lite). El código de búsqueda usa `embedding_512`, pero los scripts de actualización solo escribían en `embedding`. Resultado: dos rondas previas de re-fragmentación no tuvieron efecto. Bug detectado tras múltiples iteraciones.

**Problema 6 — XML tags en embeddings introducían ruido.** Al regenerar embeddings de fragmentos con `<verbatim_lock>` tags en el texto, Voyage AI las incluía como tokens, desviando el vector en el espacio semántico. Mitigación: limpiar XML tags antes de embed (`text.replace(/<\/?verbatim_lock>/g, '')`).

### Problemas de captura de datos del prospecto

**Problema 7 — `extractFromClaudeResponse()` contaminaba `data.package`.** Esta función leía la respuesta de Claude buscando menciones del paquete y guardaba `data.package = "visionario"`. Cuando Claude mencionaba "ESP-3 incluye 35 productos" en respuesta informativa, el sistema asumía que el usuario lo había elegido. El FSM luego saltaba a Estado 3 (pedir nombre) tratando al prospecto como si hubiera comprado. Bug clásico de "mención = elección". Mitigación: eliminar el bloque completo. La captura de paquete ahora vive EXCLUSIVAMENTE en captureProspectData con guard de pregunta informativa.

**Problema 8 — Verbos de acción capturados como nombres.** `captureProspectData` capturó "Deseo" como nombre cuando el usuario dijo "Deseo iniciar qué hago" (regex `Nombre + conector` donde "iniciar" estaba en conectores). Mitigación: expandir blacklist con verbos coloquiales (deseo, hagámoslo, dale, procedamos, etc.).

**Problema 9 — Estado 4 disparado sin nombre real.** El FSM verificaba si el bot había PEDIDO nombre, pero NO verificaba si el usuario había RESPONDIDO con un nombre. Cualquier respuesta tras pedir nombre (incluyendo "espera más despacio, cómo se gana") disparaba Estado 4 → handoff con nombre vacío + email basura. Mitigación: validar con `extractNameFromHandoffReply` antes de avanzar.

### Problemas de doctrina mezclada por el modelo

**Problema 10 — Confusión "6 meses Binario" vs "GEN5 sin término".** El modelo decía "6 meses de GEN5 activo desde el primer día" mezclando duración del Binario al 17% (6 meses ESP-3) con el GEN5 (activo desde día 1 sin término). Mitigación: agregar advertencia explícita en arsenal_compensacion.

**Problema 11 — Confusión "70 países" (Gano Excel) vs "15 países" (capacidad operativa).** El modelo decía "su organización en 70 países" mezclando matriz física Gano Excel con capacidad operativa del Arquitecto (15 países América + diáspora con registro por país natal). Mitigación: nueva sección "REGLA CANÓNICA: COBERTURA GEOGRÁFICA" en arsenal_compensacion v6.4.

### Problemas críticos del FSM (los más graves)

**Problema 12 — "Cómo se inicia" no captura intención de cierre.** El regex `triggerCierre` capta "cómo inicio" (1ra persona) pero NO "cómo se inicia" (impersonal). El prospecto Federico dijo "suena interesante, cómo se inicia" → FSM se quedó en Estado 0 → el modelo improvisó un cierre completo con "Paso 1, Paso 2, Paso 3" inventados, pidió nombre, pidió WhatsApp, pero **NUNCA disparó el warm handoff**. **Resultado: el equipo directivo nunca recibió el email. El prospecto se perdió.**

**Problema 13 — Modelo improvisa flujos burocráticos no canónicos.** Cuando el FSM no se dispara, el modelo improvisa pasos de activación ("Paso 1 — Selección de nivel ESP / Paso 2 — Handoff / Paso 3 — Activación"). Esta estructura NO existe en doctrina. El sistema acaba ejecutando un cierre paralelo sin warm handoff real, sin sumario ejecutivo al equipo, sin trazabilidad.

**Problema 14 — Klaff Prize Frame agresivo destruye conversión.** Texto canónico previo: *"No estoy seguro de si su arquitectura patrimonial está lista para el nivel máximo hoy, pero determine usted..."* Esta fricción coercitiva en el cierre es contraria a la investigación corporativa (Salesforce/Intercom). Mitigación: eliminado en Opción B.

**Problema 15 — Entrevista de cualificación en el cierre.** El FSM viejo preguntaba horas disponibles antes de mostrar la tabla. Convertía el cierre en una entrevista BANT explícita, contraria a investigación que recomienda "BANT asíncrono durante la conversación natural". Mitigación: eliminado Estado 1 en Opción B.

**Problema 16 — Handoff frío.** El equipo directivo recibía solo nombre + paquete en el link WhatsApp pre-llenado. Sin contexto del diálogo, sin dolores expresados, sin objeciones manejadas, sin score. Mitigación: warm handoff con sumario ejecutivo Haiku + Resend (Opción B).

### Problema raíz (el que motivó esta investigación)

**Problema 17 — Sistema basado en regex no escala a variabilidad lingüística natural.** Cada problema anterior se intentó resolver agregando patrones regex específicos. Pero el avatar real (cientos de prospectos LATAM diarios) escribirá con:
- Errores ortográficos ("como se inisia", "cmo se inicia")
- Dialectos regionales ("cómo le entro al negocio", "cómo me meto en esto", "qué onda con esto")
- Formas indirectas ("estoy listo, qué sigue", "ya quiero darle pa'lante")
- Selecciones implícitas ("el mediano", "no, mejor el primero", "el de la mitad")
- Correcciones ("espera, cambio a ESP-2", "mejor el chico")
- Bromas, irrupciones, preguntas anidadas durante el cierre
- Mezcla de lenguaje formal/informal

**El regex es un clasificador binario (matchea / no matchea)** sin noción de contexto histórico, confianza, estado emocional del prospecto, o coherencia conversacional.

---

## 3. EL ESTADO DESEADO — "AL" (lo que necesitamos investigar)

Queswa debe ser **perspicaz por contexto, no por matching textual**. Las preguntas centrales que esta investigación debe responder:

### Pregunta A — Clasificación semántica de intención conversacional

¿Cómo las compañías élite del mundo (Salesforce Agentforce, Intercom Fin, HubSpot Breeze, OpenAI Assistant API, Anthropic Claude Code, Sierra AI, 11x.ai, Bland AI, Lindy, Character.ai, Cursor, Notion AI) **clasifican la intención del usuario en cada turno** sin depender de regex?

Específicamente:
- ¿Usan un clasificador LLM ligero (Haiku/GPT-4o-mini) en paralelo al LLM principal?
- ¿Usan vector search semántico de intenciones contra centroides predefinidos?
- ¿Usan tool calling donde el LLM principal decide qué función invocar?
- ¿Usan un modelo encoder dedicado (BERT-style fine-tuned)?
- ¿Combinan múltiples enfoques en pipeline (regex rápido → LLM clasificador → fallback)?
- ¿Cuál es la latencia objetivo de cada enfoque? ¿Cuál el costo por inferencia?
- ¿Qué métricas usan para evaluar precisión (F1, intent accuracy, confusion matrix)?

### Pregunta B — Slot filling y captura de datos por inferencia

¿Cómo extraen datos estructurados del prospecto (nombre, paquete elegido, WhatsApp, ciudad, dolor) cuando vienen expresados de forma ambigua o indirecta?

Específicamente:
- ¿Cómo distinguen "Federico" (nombre propio) de "Federico no es mi nombre, soy Carlos" (corrección)?
- ¿Cómo infieren paquete cuando el usuario dice "el mediano" / "el primero" / "el más grande"?
- ¿Cómo manejan correcciones explícitas ("espera, cambio a ESP-2")?
- ¿Qué patrones de "slot extraction" usan? (NER, LLM-as-extractor, structured outputs con Zod/Pydantic)
- ¿Cómo evitan "mención = elección" sin perder precisión?

### Pregunta C — State machines conversacionales no determinísticos

¿Cómo manejan transiciones de estado cuando el usuario rompe el flujo lineal del cierre?

Específicamente:
- ¿Permiten que el LLM principal decida transiciones (con guard rails)?
- ¿O mantienen FSM determinístico pero alimentado por clasificación semántica?
- ¿Cómo manejan preguntas anidadas durante el cierre? (ej: usuario pide info de GEN5 después de elegir paquete pero antes de dar nombre)
- ¿Cómo manejan abandono temporal del cierre con regreso? (ej: usuario pide pausa, vuelve 30 min después)
- ¿Cómo combinan determinismo (necesario para handoff cálido y captura de datos críticos) con flexibilidad (necesaria para experiencia natural)?

### Pregunta D — Comprensión de contexto histórico vs último mensaje

¿Cómo balancean atención al **último mensaje** vs **historial completo de la conversación**?

Específicamente:
- ¿Usan sliding window de N turnos? ¿De qué tamaño?
- ¿Resumen automáticamente turnos viejos para no perder contexto?
- ¿Cómo manejan referencias anafóricas ("ese", "ya lo dije", "el último")?
- ¿Cómo detectan que el usuario YA respondió algo que el bot vuelve a preguntar?

### Pregunta E — Anti-alucinación de flujos no canónicos

¿Cómo evitan que el LLM principal improvise pasos de proceso que no existen en doctrina (ej: "Paso 1, Paso 2, Paso 3" inventados)?

Específicamente:
- ¿Usan guard rails explícitos en system prompt?
- ¿Usan tool calling para forzar que ciertas acciones solo ocurran vía función dedicada?
- ¿Usan output structured con esquemas Zod/Pydantic que limitan formas de respuesta?
- ¿Tienen detectores post-generación que rechazan respuestas con "Paso N" inventados?

---

## 4. LO QUE YA SE INTENTÓ (no repetir en la investigación)

Para no recibir recomendaciones que ya aplicamos:

| Intento previo | Resultado |
|----------------|-----------|
| Limpieza de redundancias del prompt (-23%) | Funcionó parcialmente — el bloat se redujo pero la arquitectura sigue monolítica |
| Primacy effect (reglas críticas al inicio) | Funcionó parcialmente — el modelo aplica reglas E/F/G/H mejor pero no perfecto |
| Migración `[VERBATIM_LOCK]` → `<verbatim_lock>` (XML tags) | Funcionó — XML tags activan atención post-entrenada del modelo |
| Bloqueo absoluto KYC en system prompt | Funcionó parcialmente — modelo no inventa KYC pero sigue improvisando "Paso 1/2/3" |
| FSM con micro-prompts verbatim por estado | Funcionó para los casos que MATCHEAN — falla para variantes naturales no matcheadas |
| Camino A backend dictador (chip-triggers) | Funcionó 100% — pero solo cubre 2 chips canónicos |
| Warm handoff con sumario Haiku + Resend | Funcionó cuando se dispara — pero depende del FSM disparándose |
| Validación de nombre antes de Estado 4 | Funcionó — evita handoffs vacíos |
| Eliminación de Klaff Prize Frame | Funcionó — el cierre fluye mejor |
| Eliminación de Estado 1 (pregunta de horas) | Funcionó — BANT ahora se infiere de la conversación previa |
| Blacklist expandida en captura de nombre | Funcionó para casos específicos — no escala a variantes nuevas |

---

## 5. HIPÓTESIS PARA LA INVESTIGACIÓN

La investigación debe **validar o descartar** estas hipótesis arquitectónicas:

**Hipótesis A — Clasificador Haiku pre-FSM:** una llamada extra a Claude Haiku al inicio de cada turno que clasifica intención + extrae slots + retorna JSON estructurado. El FSM principal consume el JSON. ¿Es lo que hacen las compañías élite? ¿Latencia aceptable? ¿Precisión real?

**Hipótesis B — Tool calling con LLM principal:** el LLM principal tiene herramientas (`disparar_estado_2()`, `confirmar_paquete(esp)`, `capturar_whatsapp(numero)`) que invoca cuando detecta intención. ¿Anthropic Claude 4.6/4.7 soporta tool use estable? ¿Permite cierre determinístico?

**Hipótesis C — Vector search de intenciones:** centroides vectoriales precalculados para cada intención canónica. Voyage AI embed del último turno → similitud coseno → ruta a estado. ¿Suficiente sin contexto histórico? ¿Necesita re-ranking?

**Hipótesis D — Modelo encoder dedicado:** un modelo BERT-style fine-tuned para clasificación de intenciones del dominio Queswa. ¿Costo de fine-tuning? ¿Datos de entrenamiento necesarios?

**Hipótesis E — Híbrida (cascade):** regex rápido para casos obvios (80%) → fallback a clasificador LLM para casos ambiguos (20%). ¿Es lo que recomienda la industria? ¿Cómo se calibra la frontera entre los dos?

---

## 6. RESTRICCIONES INVIOLABLES DEL PROYECTO

1. **Stack actual no negociable a corto plazo:** Anthropic Claude (Sonnet 4.6 / Haiku 4.5) + Voyage AI + Supabase + Vercel Edge. Cambiar de proveedor es un proyecto a 6 meses.
2. **Streaming obligatorio:** la UX requiere respuestas progresivas (no respuesta completa de golpe).
3. **Latencia objetivo:** < 3s para primera palabra renderizada, < 8s para respuesta completa, < 1.5s adicional para clasificador.
4. **Costo target:** ≤ $0.05 USD por conversación promedio (5-10 turnos). Toda solución debe respetarlo.
5. **Multi-tenant:** el sistema sirve 4 dominios (`creatuactivo.com`, `luiscabrejo.com`, `ganocafe.online`, `queswa.app` desde repo externo) con system prompts distintos. La solución debe escalar.
6. **Castellano LATAM como idioma principal** con variabilidad regional alta (Colombia, México, Argentina, Perú, USA hispanohablante, España, diáspora latina).
7. **El system prompt actual mide 35,354 chars** — no puede crecer significativamente (>40KB introduce Lost in the Middle).

---

## 7. ENTREGABLE ESPERADO

Documento técnico con la siguiente estructura:

### Sección A — Estado del arte 2026 (cómo lo hacen los élite)

Análisis detallado de cómo cada una de estas empresas resuelve la comprensión contextual de intención en sus chatbots de cualificación / ventas:

- **Salesforce Agentforce** (Tópicos + Acciones + Barandillas)
- **Intercom Fin** (Procedures + Slot filling)
- **HubSpot Breeze AI** (Chatflows + Intent detection)
- **Sierra AI** (B2C conversational AI)
- **11x.ai** (AI SDRs)
- **Bland AI** (voice agents con intent classification)
- **Lindy** (AI assistants)
- **Anthropic Claude Code** (filtración SYSTEM_PROMPT_DYNAMIC_BOUNDARY)
- **Cursor / GitHub Copilot Chat** (no-conversational pero relevantes)
- **OpenAI Assistant API v2** (function calling estable)
- **Character.ai** (conversational persistence)

Para cada una: ¿qué arquitectura usan? ¿qué patrón de clasificación de intención? ¿cómo manejan slot filling? ¿cómo evitan alucinaciones de flujo?

### Sección B — Diagnóstico de raíz para Queswa

Análisis fundamentado de por qué el enfoque regex falla en escala. Citar literatura técnica (papers, blogs de ingeniería de Anthropic / OpenAI / Cohere / LangChain). Validar/descartar las hipótesis A-E de Sección 5.

### Sección C — Soluciones candidatas (3-5 opciones)

Para cada solución:
- **Nombre y descripción técnica** (qué se construye)
- **Mecanismo de acción** (cómo resuelve el problema raíz)
- **Empresas que lo usan en producción** (con referencias)
- **Tradeoffs detallados:** costo por turno, latencia adicional, complejidad de mantenimiento, riesgo de regresión, escalabilidad
- **Compatibilidad con restricciones de Sección 6**
- **Reliability estimada** (¿85%? ¿95%? ¿99%?)
- **Diagrama arquitectónico antes/después**

### Sección D — Recomendación priorizada

- **Recomendación primaria** (qué implementar primero) con justificación
- **Plan de fallback** si la primaria no alcanza el objetivo
- **Métricas de éxito** (cómo medir empíricamente que funcionó)
- **Roadmap por fases** (qué semana 1, semana 2, semana 4, etc.)

### Sección E — Riesgos y mitigaciones

¿Qué puede fallar al implementar la recomendación? ¿Qué señales de alarma observar? ¿Plan de rollback si la calidad cae?

---

## 8. PATRONES DE BÚSQUEDA SUGERIDOS

Términos en inglés (literatura técnica de mayor calidad está en inglés):

- "intent classification LLM 2026"
- "conversational AI semantic router production"
- "slot filling LLM structured output"
- "BANT qualification chatbot architecture"
- "warm handoff AI agent context preservation"
- "Salesforce Agentforce topics actions guardrails"
- "Intercom Fin Procedures slot extraction"
- "HubSpot Breeze AI chatflow intent detection"
- "LangGraph multi-agent state management"
- "Anthropic tool use vs structured output"
- "OpenAI Assistant API function calling sales"
- "intent classification fine-tuned BERT vs LLM"
- "conversational state machine LLM hybrid"
- "11x.ai SDR architecture"
- "Sierra AI conversational design"
- "Bland AI voice agent intent"

Fuentes de alta credibilidad:
- Blog de ingeniería de Anthropic (anthropic.com/engineering)
- Blog de OpenAI (openai.com/research)
- Blog de Salesforce architects (architect.salesforce.com)
- Blog de Intercom Fin (fin.ai/blog)
- Engineering blogs de empresas conversational (Sierra, 11x, Lindy)
- Papers de NeurIPS / ICML / ACL 2024-2026 sobre intent classification
- Documentación oficial de LangGraph, Vercel AI SDK, LlamaIndex

---

## 9. CONTEXTO TÉCNICO ADICIONAL — QUERIES REALES DEL AVATAR

Para que la investigación tenga ejemplos concretos del tipo de variabilidad lingüística que enfrentamos, estos son **queries reales** que han llegado en QA:

**Variantes que SÍ matcheó el regex actual (~30%):**
- "deseo iniciar"
- "hagámoslo"
- "dale"
- "ESP-3"
- "el de mil dólares"

**Variantes que NO matcheó el regex y causaron bugs (~70%):**
- "suena interesante, cómo se inicia"
- "qué pasos hay"
- "y entonces qué sigue"
- "perfecto, qué hago ahora"
- "ya, listo, qué necesito"
- "ok ok, me anoto"
- "el mediano me sirve" (no captura ESP-2)
- "no, mejor el primero" (no captura corrección a ESP-1)
- "el más completo" (no captura ESP-3 implícito)
- "Federico Castro 3203415438" (todo junto, captura name y phone parcialmente)
- "cómo le entro a esto" (dialecto coloquial)
- "qué onda con la inscripción" (mexicanismo)
- "ya quiero darle pa'lante" (colombianismo)

**Casos críticos donde el modelo improvisó cierres no canónicos:**
- Turno N: usuario "suena interesante, cómo se inicia"
- Modelo improvisa: "El proceso de activación tiene tres pasos: Paso 1 — Selección de nivel ESP, Paso 2 — Handoff al Equipo Directivo, Paso 3 — Activación del Tridente EAM"
- Resultado: usuario completó el flujo, dio nombre y WhatsApp, pero **el warm handoff nunca se disparó** porque el FSM se mantuvo en Estado 0. **El equipo directivo nunca recibió el email. El prospecto se perdió.**

---

**Fin del brief. Profundidad esperada del entregable: 4000-6000 palabras, con citaciones a fuentes técnicas y diagramas arquitectónicos. Tono: senior engineering consultant especializado en LLM-powered conversational AI. No hipotético — solucionable con tecnología disponible hoy.**
