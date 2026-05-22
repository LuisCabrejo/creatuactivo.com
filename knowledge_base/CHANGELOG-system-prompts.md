# Changelog — System Prompts Queswa

Historial de cambios doctrinales del system prompt `nexus_main` (tenant `creatuactivo_marketing`). Extraído del cuerpo de los prompts a partir de v27.1 para reducir overhead de tokens — el modelo no necesita el changelog histórico para generar respuestas.

Cada versión del prompt vive en `knowledge_base/system-prompt-nexus-main-vXX_Y.md` (archivos conservados como referencia histórica). El prompt activo en Supabase se actualiza con `node scripts/actualizar-system-prompt-vXX.Y.mjs`.

---

## v27.1 — Limpieza de redundancias (22 May 2026)

Ola 1 de la auditoría de redundancia (auditoría Gemini sobre prompt monolítico).

**Cambios sin riesgo, sin tocar reglas activas:**

1. **Vectores técnicos de cierre — 1 lugar:** las 3 frases canónicas ("Determine usted...", "¿Qué tan de mente abierta...?", "¿Identifica usted la diferencia...?") aparecían 3 veces (TONO Y VOZ + ESTRUCTURA DE RESPUESTA + ACTIVACIÓN QUESWA). Mantenidas solo en TONO Y VOZ; ESTRUCTURA DE RESPUESTA y ACTIVACIÓN QUESWA ahora hacen referencia cruzada.
2. **Sección ACTIVACIÓN QUESWA colapsada:** era un resumen de todo el prompt anterior — ~1,800 chars de redundancia. Reducida a directrices operativas únicas (estado dinámico, principio fundamental).
3. **Vocabulario prohibido unificado:** 3 tablas separadas con solapamiento (TONO Y VOZ, PROTOCOLO ANTI-MLM, VOCABULARIO PROHIBIDO ADICIONAL). Consolidadas en UNA tabla maestra dentro de PROTOCOLO ANTI-MLM.
4. **Reglas A/B/C/D + E/F/G/H consolidadas:** las reglas A (LISTAS CON AIRE), B (Estructura Patrimonial en negrita), C (Arquitectura numerada), D (Tridente con Comando) estaban parcialmente cubiertas por E/F/G/H elevadas al inicio. Reglas A-D mantenidas como casos particulares con referencia cruzada a E-H.
5. **Changelogs históricos movidos** a este archivo. Antes ocupaban ~3,000 chars al inicio del prompt en Supabase.
6. **Referencias de versión sincronizadas:** líneas que decían "Eres Queswa v26.5" o "READY AS QUESWA v26.4" actualizadas a v27.1.

**Reducción total:** 45,940 → ~38,000 chars (~17%). Sin cambios de comportamiento esperados — solo limpieza.

---

## v27.0 — Recursos imperativos + bloqueo KYC (19 May 2026)

Bump de versión mayor (v26 → v27) porque incluye tres cambios doctrinales coordinados:

1. **Reposicionamiento estructural de RECURSOS DE LEGIBILIDAD COGNITIVA** — elevada del final del prompt (línea 400) a justo después de IDENTIDAD CORE (líneas tempranas). Aplica primacy effect: las instrucciones críticas pegadas al inicio tienen mayor peso en el mecanismo de atención del transformador, especialmente en prompts >40KB. Razón: empíricamente v26.9 no logró que el modelo aplicara consistentemente las Reglas E/F/G/H — competían contra reglas más viejas y reforzadas (Pirámide McKinsey, frialdad matemática, máximo 3 párrafos) que viven en líneas tempranas.

2. **Regla imperativa de formato obligatorio (no opcional)** — agregada en TONO Y VOZ. Toda respuesta de 100+ palabras debe aplicar al menos 2 de 4 recursos visuales (negritas, cursiva, separador, lista). Reemplaza la regla subjetiva v26.9 ("si aporta legibilidad") con un mínimo cuantificable.

3. **BLOQUEO ABSOLUTO — KYC / DOCUMENTACIÓN INVENTADA** — nueva sección anti-alucinación crítica. Caso real detectado en QA 19 May 2026: cuando el FSM no capturaba el paquete del usuario ("nivel 3") y permanecía en Estado 2 sin micro-prompt verbatim, el modelo improvisaba un flujo bancario tóxico pidiendo cédula, comprobantes de ingresos (nóminas), referencias formales (LinkedIn corporativo), e inventaba un concepto "Reporte de Auditoría Técnica" inexistente. v27.0 cierra esta puerta con bloqueo explícito.

Cambios técnicos paralelos en `src/app/api/nexus/route.ts`:
- Fix D: triggerInicio ampliado con verbos coloquiales (hagámoslo, dale, adelante, procedamos).
- Fix E: packageMap ampliado con niveles numéricos (nivel 1/2/3, el primero/segundo/tercero, opción 1/2/3).

---

## v26.9 — Recursos de legibilidad cognitiva (19 May 2026)

Resuelve contradicción doctrinal interna sobre formato visual: el PROTOCOLO DE AUDITORÍA paso 3 ordenaba *"reescribir como prosa fluida"* mientras que las REGLAS DE FORMATO VISUAL permitían Markdown. Empíricamente la auditoría destructiva ganaba — las respuestas a queries naturales (que no entran por Camino A ni recuperan un `<verbatim_lock>`) quedaban como prosa densa de 3 párrafos sin recursos visuales, mientras el frontend (`react-markdown + remark-gfm`) renderiza completo.

**Cambios aplicados (Nivel 1 — solo system prompt, sin tocar arsenales):**

1. **PROTOCOLO DE AUDITORÍA paso 3 reescrito** — antes ordenaba destruir listas/numeración; ahora ordena auditar si el borrador *aprovecha* los recursos disponibles cuando aportan legibilidad cognitiva.
2. **REGLAS DE FORMATO VISUAL expandidas** con 4 nuevas:
   - Regla E — Negritas en frases-ancla (datos numéricos + sustantivos doctrinales + conclusión central de cada párrafo).
   - Regla F — Cursiva en reencuadres psicológicos que rompen el frame del prospecto.
   - Regla G — Separador `---` antes del cierre + pregunta de bifurcación.
   - Regla H — Sub-listas para enumeraciones de 2-5 elementos paralelos.
3. **Regla TONO 6 matizada** — "máximo 3 párrafos" aplica a queries de orientación; respuestas estructurales (Tres Pilares, Tridente EAM, compensación, día a día) pueden extenderse con separadores visuales.
4. **Nueva sección "## RECURSOS DE LEGIBILIDAD COGNITIVA"** que explica el *propósito* de cada recurso (escaneabilidad, modelado mental, retención), no solo su sintaxis.

---

## v26.8 — XML verbatim_lock (18 May 2026)

1. **Migración crítica: `[VERBATIM_LOCK]` → `<verbatim_lock>`** — los corchetes planos fueron reemplazados por etiquetas XML genuinas en TODA la doctrina (regla inviolable + directriz RAG). Razón doctrinal (investigación Gemini 18 May 2026, Hipótesis C confirmada): Claude Sonnet 4.6 fue post-entrenado para activar atención sobre etiquetas XML estructuradas (`<context>`, `<instructions>`, `<constraints>`); los corchetes planos se procesan como texto de baja prioridad. Esto explica por qué v26.7 falló empíricamente al forzar delivery verbatim — el marcador era invisible al mecanismo de atención del modelo.
2. **Razón de la migración:** después del deploy de v26.7, el síntoma persistió — Queswa seguía parafraseando WHY_01/WHY_02/EAM_01 a pesar de la regla "INVIOLABLE" en natural-language.
3. **Sincronización requerida:** `arsenal_inicial.txt` v25.8 reemplaza los marcadores en los 3 fragmentos.

---

## v26.7 — Verbatim_lock (corchetes planos) — heredado/superseded

1. Introducción del marcador verbatim (corchetes planos, superseded por v26.8).
2. Excepción de LÍMITE DE RESPUESTA gobernada por marcador estructural.
3. Directriz RAG con excepción inviolable.

---

## v26.6 y anteriores

Para versiones anteriores (v26.0 - v26.6), consultar los archivos `knowledge_base/system-prompt-nexus-main-vXX_Y.md` directamente. Cada uno contiene su propio changelog interno.
