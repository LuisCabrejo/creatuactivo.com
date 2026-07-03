# Changelog — System Prompts Queswa

Historial de cambios doctrinales del system prompt `nexus_main` (tenant `creatuactivo_marketing`). Extraído del cuerpo de los prompts a partir de v27.1 para reducir overhead de tokens — el modelo no necesita el changelog histórico para generar respuestas.

Cada versión del prompt vive en `knowledge_base/system-prompt-nexus-main-vXX_Y.md` (archivos conservados como referencia histórica). El prompt activo en Supabase se actualiza con `node scripts/actualizar-system-prompt-vXX.Y.mjs`.

---

## v29.2 — Tríada de primeros principios sin pronombre ambiguo (3 jul 2026)

Clave de primeros principios (TRES FUERZAS): *"alguien **la** fabrica · algo **la** atiende"* → **"alguien fabrica · una plataforma atiende a las personas"** (el pronombre "la" era gramaticalmente ambiguo — nadie "fabrica" una empresa; "una plataforma" es más concreta que "algo" y mapea limpio con Queswa). Un solo cambio; todo lo demás intacto. Sincroniza con `arsenal_inicial` v5.24 (WHY_02 verbatim_lock + `MASTER_WHY_02`), servilleta v5.8, home y reel home — pasada de claridad del 3 jul 2026.

## v29.1 — Compresión a ~20KB + regla de moneda por país (2 jul 2026)

**Compresión sin cambio doctrinal:** el prompt bajó de ~34KB a ~20KB. Qué se eliminó: (1) el changelog histórico del encabezado (~4.8KB — vive aquí desde ahora); (2) redundancias — "tres fuerzas/socios" instruida 3 veces → 1, "madura la decisión/nadie filtra" 4 veces → léxico + identidad, paradigma Puig nombrado 3 veces → 1, frame "en paralelo" definido 4 veces → 1, villano-narrado explicado 3 veces → 1; (3) referencias a archivos que el modelo no puede leer (HANDOFF_*.md, Glosario v1.4) y acotaciones editoriales; (4) filas duplicadas en las tablas de léxico. Todos los bloqueos (compensación, dashboard, KYC, verbatim_lock, 12 velocidades) intactos.

**Fix doctrinal — moneda por país (única regla, corrige contradicción):** BLOQUEOS DE FORMATO decía "ESP — USD primero; COP secundario" mientras COMPENSACIÓN ordenaba "Colombia SIEMPRE COP, nunca USD". Regla unificada (decisión Director Cabrejo, 2 jul 2026): el backend detecta el país e inyecta el pin en la moneda correcta; Queswa entrega los valores en ESA moneda sin convertir ni añadir otra — **Colombia → solo COP** · **Estados Unidos → USD** · **país sin moneda especificada o desconocido → USD por defecto**.

**Consistencia:** las 4 marcas de versión (header, changelog, footer, fila Supabase) quedan unificadas en v29.1; el canal de escalación se nombra siempre "Equipo Directivo".

## v29.0 — Primeros principios + bisagra "se usa, no se entra" (30 jun 2026)

Las TRES FUERZAS se instruyen en clave de **primeros principios** (*"tres cosas tienen que ser ciertas — alguien la fabrica (Gano), algo la atiende (Queswa), usted sabe qué hacer (método) — y las tres ya están resueltas"*) + **línea bisagra "Usted no entra a Gano Excel; Gano Excel trabaja para usted"**. Cierre canónico "usted dirige, sus socios hacen el trabajo" → **"usted dirige; lo pesado ya está resuelto"** ("sus socios" como sujeto suelto lee MLM). Aforismo Cierre "Usted no carga el sistema; el sistema hace el trabajo" → **"Usted no carga el peso; la tecnología hace el trabajo"** (*sistema* = villano, no se reusa en positivo). Sincroniza con `arsenal_inicial` v5.23 + servilleta v5.7.

## v28.9 — Reframe socios / tres fuerzas (28 jun 2026)

La ARQUITECTURA conserva los Tres Pilares como modelo interno, pero instruye presentarlos al prospecto como **tres fuerzas estratégicas / socios que trabajan PARA su empresa** (socio logístico y financiero: Gano · socio digital: Queswa · método comprobado), con **dirección del poder** ("de su lado / a su favor", NUNCA "se asocia con / se mete a Gano" → resuelve el colapso MLM) y **frame-before-name**. Actualizada la regla de formato (Tres Fuerzas → 1/2/3, rótulo "Pilar" no se muestra) + tabla de léxico prohibido (se asocia con / "pilares" de cara al prospecto). Alinea con `arsenal_inicial` v5.20 + HANDOFF_REFRAME_SOCIOS_FUERZAS.md.

## v28.8 — Calidez en Activar + diagnóstico retirado (jun 2026)

(1) Aforística Activar: "usted revisa y da el sí" → *"cuando alguien ya decidió, usted lo recibe — la calidez que solo un humano puede dar"* (cierra la contradicción con la recalibración cálida v28.5; nadie audita). (2) Se retira "Iniciar Diagnóstico" como CTA — Queswa ya no ofrece el Diagnóstico de 5 Días (la Home lo desconectó); el CTA de la interfaz es "Suscríbete" y el siguiente paso es la conversación 1-a-1 con el equipo. Nota: la promesa canónica evolucionó "guía" → **"madura en cada interesado la decisión de avanzar"** (25 jun 2026, Opción B) y se re-desplegó conservando el label v28.8.

## v28.7 — Contexto de reels (19 jun 2026)

Nueva sección "CONTEXTO DE ENTRADA — CÓMO LLEGA EL USUARIO (REELS)": Queswa sabe que la mayoría llega tras ver un reel (home explainer + 6 nichos: corporativo, empleados, empresarios, diáspora, informales, networkers), cada uno con su villano narrado, y que el reel le entrega el testigo con la promesa canónica (NO "evalúa su caso / si es viable"). Permite responder en consecuencia al perfil sin reiniciar de cero.

## v28.6 — Limpieza de residuos fríos en tablas operativas (18 jun 2026)

Residuos que sobrevivieron a v28.5 y alimentaban respuestas de "calificación de perfiles": (1) reemplazo de "Pipeline/Embudo" → "Sistema de filtrado" cambiado a **"proceso de conversión"**; (2) verbo de paridad "Audita" → **"Compara"**; (3) Principio fundamental "máxima calificación de perfiles de alto nivel" → **"las personas de alto nivel reconocen el valor y avanzan con confianza (nunca las evalúas ni las calificas tú)"**. Cierra la brecha entre la IDENTIDAD CORE cálida y la operación.

## v28.5 — Identidad cálida (17 jun 2026)

**IDENTIDAD CORE recalibrada de fría a cálida**: Queswa = asistente que se hace entender, autoridad CON calidez, del lado del usuario (ya NO "motor de auditoría/calificación", ya NO "frío/sin sentimientos/el sistema evalúa al usuario"; resuelve la contradicción interna con la sección Modulación Mario Alonso Puig). TONO: "frialdad matemática" → "precisión, no frialdad", "simple/claro" permitidos. EAM_01: rol del héroe = humano (recibir de persona a persona; nadie audita). Alineado con `arsenal_inicial` v5.13. Sin cambios estructurales (bloqueos compensación/dashboard/KYC/verbatim_lock intactos).

## v28.4 — Multiplicación sin filtrar (17 jun 2026)

3er Comando Maestría → Multiplicación; "filtrar" desterrado (conversar/acompañar/reconocer quién está listo); Activar = "revisa y da el sí". Alineado con `arsenal_inicial` v5.12. Ver [[project_rename_maestria_multiplicacion]] · [[feedback_filtrar_prohibido]].

## v28.3 — Villano = el sistema que toma sus años y su salud (13 jun 2026)

Sección EL VILLANO recalibrada para alinear con `arsenal_inicial` v5.11. El villano preferido pasa de «asfixia mensual» a **un sistema diseñado para tomar sus mejores años y su salud a cambio de casi nada** (más universal — funciona aunque la persona no se sienta «asfixiada»).

- **Permitido:** nuevo ejemplo principal (años/salud) + «usted entrega lo mejor de sí, el sistema no le devuelve seguridad financiera». Se retiran de la lista «asfixia mensual» y el escenario «un mes sin poder trabajar… sus bienes son más del banco que suyos».
- **Prohibido (nuevo):** apelar a la falta de patrimonio / «sus bienes son del banco» (el latino ya cree tenerlo) · el villano de la ausencia futura («el día que no pueda trabajar», «cuando usted no esté») como gancho central (cabeza del americano).

Sin cambios estructurales (bloqueos compensación/dashboard/KYC/verbatim_lock intactos). Ver [[feedback_villano_anos_salud]].

## v28.2 — Villano narrado sin atacar el esfuerzo (12 jun 2026)

Alinea el prompt con `arsenal_inicial` v5.10 (WHY_01/WHY_02 reescritos: el villano deja de ser "la presencia obligada" y pasa a ser el sistema de asfixia mensual, narrado sin etiqueta; se reconoce el esfuerzo del héroe). Fundamento: investigaciones `El Statu Quo` + `Léxico CreaTuActivo`.

1. **IDENTIDAD CORE:** el diagnóstico del villano se NARRA (remite a la sección EL VILLANO), ya no se instruye etiquetarlo como "el ingreso atado 100% a la presencia". "La presencia" queda solo del lado de la solución técnica (un ingreso que sigue produciendo aunque el usuario no esté presente).
2. **Aforismo Maestría:** "Usted no enseña; Queswa escala" → "…Queswa multiplica" — sincroniza el swap "escalar→multiplicar" que el propio léxico (L145) ya prohibía. Inconsistencia interna resuelta.
3. **Recategorización:** ejemplo "Eso no es éxito financiero. Es una trampa." → "No es un problema de ingresos; es un punto ciego." (recategoriza sin negar el logro del héroe; eco del hero de la home).

Sin cambios de comportamiento estructural. Los bloqueos (compensación, dashboard, KYC, verbatim_lock) intactos.

## v28.1 — Empresa Digital (12 jun 2026)

Swap quirúrgico "negocio digital" → "empresa digital" para el activo que entregamos (decisión Luis, alineado con Home v13.6 y arsenal_inicial v5.9 — eleva el estatus de propiedad). Concordancias de género corregidas. Se conserva "negocio" en la pregunta del avatar ("¿Cómo funciona el negocio?"), el negocio actual del prospecto y "Centro de Negocios" (Binario). Sin cambios de comportamiento.

## v28.0 — Negocio Digital + Ola 2 de redundancia (jun 2026)

(1) Léxico migrado: "Base Operativa" → negocio digital; "Propietario de Base Operativa" → Propietario; "soberanía financiera" → tranquilidad/estabilidad; "arquitectura patrimonial" → modelo de ingresos; reglas nuevas operar/operador y auto-referencia esto/eso; "escalar" → "multiplicar". (2) Consolidación de redundancia: ~30 secciones → ~15, sin cambios de comportamiento (bloqueos compensación/dashboard/KYC/verbatim_lock intactos).

## v27.2 — Modulación de Registro (24 May 2026)

Ola 2 del refactor doctrinal post-QA. Formaliza la doctrina v5.5 nacida del insight del Director Cabrejo: *"si tú hablas con un médico no esperas que te hable en tu mismo lenguaje, de lo contrario pensarás que no es médico, pero si soy médico debo esforzarme en utilizar un lenguaje comprensible"* (analogía Mario Alonso Puig). Sin cambios de identidad — solo modulación contextual del registro.

**Cambios sustantivos:**

1. **Nueva sección MODULACIÓN DE REGISTRO v5.5** dentro de TONO Y VOZ. Tabla técnico-clínico (arquitectura/mecánica/compensación) vs humano-cálido (exploración/dudas/pausas). Ejemplos concretos de sobre-tecnificación inapropiada. Vocabulario aprobado conservado en ambos registros + vocabulario modulable según contexto.

2. **VECTORES DE CIERRE balanceados en 2 BANCOS**: Banco A (técnico-clínico, los 3 vectores Reel A v2.2 conservados) + Banco B (conversacional, 3 vectores nuevos para incentivar diálogo). Nueva regla anti-pregunta-retórica-vacía. NO prohíbe contraste retórico legítimo (matiz capturado: la regla v26.3 "describir qué ES, no qué NO ES" se conserva porque ataca anticipación de objeciones, no contraste retórico).

3. **Refuerzo PIRÁMIDE McKINSEY AL DERECHO**. Nueva REGLA ANTI-PREÁMBULO: cuando la pregunta es directa (paquetes, precios, productos), responde directo. El preámbulo doctrinal SOLO va cuando el usuario pide explicación arquitectónica. Ejemplo aprobado: usuario *"háblame de los paquetes"* → respuesta directa *"Usted tiene tres niveles..."* (sin *"La activación de su Base Operativa es directa..."*).

4. **BLOQUEO ABSOLUTO — DASHBOARD INEXISTENTE PARA PROSPECTO**. El modelo alucinaba referencias al Dashboard en respuestas a prospectos en exploración (*"¿prefiere que simulemos en su Dashboard la matemática..."*). El Dashboard de queswa.app existe SOLO para Arquitectos ya activados. Sustituir por opciones canónicas conversacionales.

5. **BLOQUEO ABSOLUTO — FÓRMULAS MATEMÁTICAS EXPUESTAS**. Prohibido mostrar fórmula del Binario al prospecto (`CV × 17% × $1 USD` o variantes). La matemática se demuestra con tablas terminadas, no con fórmulas. Si pregunta cómo se calcula, respuesta canónica sin fórmula: *"El sistema toma el volumen acumulado de su pierna más débil y aplica la rentabilidad de su paquete"*.

6. **BLOQUEO ABSOLUTO — DOCTRINA 12 VELOCIDADES**. Cuando usuario pregunta cómo se gana, apertura canónica es *"Su Base Operativa genera dividendos en 12 velocidades. Hoy analicemos las dos principales..."*. NUNCA *"Monetización de Doble Velocidad"* como universo cerrado. Alineado con guion servilleta v6.0 e insight de campo Director Cabrejo (12 años, solo 1 prospecto pidió detalle de otras formas).

**Tamaño:** 36,143 → 42,577 chars (+18% por nuevas reglas). Aceptable porque añade capacidad doctrinal sin redundancia.

**Sincronizado con:**
- arsenal_inicial v5.5 (FREQ_04 con 12 velocidades, WHY_02 v5.5 corto, preguntas seguimiento conversacionales)
- arsenal_compensacion v6.4 (instrucciones internas con "PROHIBIDO exponer fórmula")
- src/lib/respuestas-maestras.ts (MASTER_WHY_02 + MASTER_EAM_01 carácter por carácter con verbatim_lock)

**Pendiente Ola 3 (código):**
- FSM perspicaz (detectar verbos de intención explícita vs exploración)
- Doble oferta cierre (tomar datos / link directo)
- Fix link WhatsApp pre-llenado

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

## v26.6 — Jerarquía causal corregida (17 May 2026)

Corrección semántica doctrinal — **Déficit Estructural de Ingresos** ahora es CAUSA RAÍZ DE DISEÑO (no consecuencia). Modelo de presencia obligada = MANIFESTACIÓN OPERATIVA. Colapso del flujo de caja al detenerse = CONSECUENCIA matemática cuantificable. Razón semántica: el adjetivo "estructural" denota cualidad de los cimientos → causa. Sincronizado con `arsenal_inicial.txt` v25.5 (WHY_01 + STORY_01 + PERFIL_01).

---

## v26.5 — Pilar 3 = Metodología Automatizada (15 May 2026)

Resolución de disonancia arquitectónica. **Pilar 3** recategorizado de "Su Rol como Arquitecto de Patrimonio" → "La Metodología Automatizada (El Tridente EAM)". Si Pilar 3 = el usuario, solo se entregan 2 pilares de infraestructura (Matriz Física + Queswa), no 3. El tercer pilar debe ser un componente entregado por el sistema, no el rol del receptor. El **Arquitecto de Patrimonio** queda elevado como **director de los tres pilares**, no como pieza dentro de ellos.

Cross-canal: servilleta v3.1, `arsenal_inicial.txt` v25.3, home v13.3, fallback `route.ts` sincronizado.

---

## v26.4 — Retrofit fricción nivel 5 (10 May 2026)

Retrofit léxico contra 4 investigaciones canónicas (`public/contexto/investigaciones/`). 11 ediciones quirúrgicas:

1. Eliminación frame `actualización de software financiero` × 6 instancias → `instalación de Estructura Patrimonial en paralelo` (sesgo WEIRD/tech-noir documentado).
2. `apalancamiento asimétrico` → `apalancamiento estratégico` (fricción nivel 5/5 Wall Street/Anglo).
3. `gobernanza estratégica/de activos` → `dirección estratégica/dirigir activo` (fricción nivel 5/5 corporativo).
4. Eliminación negaciones discursivas (`NO es reemplazo. NO es escape.` × 2 + 3 antiejemplos en Directrices de Voz) — aplica regla v26.3 línea 25 "Describe qué ES — no qué NO ES".

---

## v26.3 — Alineación Glosario v1.4 (09 May 2026)

Alineación con Glosario Léxico Canónico v1.4 — `Patrimonio Paralelo` (sustantivo) → `Estructura Patrimonial` (fricción nivel 3 documentada en Léxico Reels), recategorización canónica `Trampa Estructural`, jerarquía causal Modelo→Inestabilidad→Déficit, vocabulario MLM tradicional colombiano prohibido (`La salida es / Escape de / Sal del`).

---

## v26.2 — Comandos del Tridente (May 2026)

Resuelve conflicto semántico — "Protocolo" quedaba reservado al villano (PPO) y a procesos técnicos genéricos, pero también se usaba para el Tridente. Ahora los tres elementos del Tridente EAM se llaman **Comandos** (Comando Expandir · Comando Activar · Comando Maestría). Trinidad resultante: Centro de Mando (Queswa) → emite Comandos (Tridente EAM) → sobre la Base Operativa.

---

## v26.1 — Blindaje WHY_02 (May 2026)

Añade instrucción explícita en sección LÍMITE DE RESPUESTA para entregar WHY_02 verbatim desde RAG (sin reescritura creativa). WHY_02 reformulado: pilares numerados 1/2/3, "Gano Excel" explícito, gerundios EAM (Expandir/Activar/Maestría), "Usted no vende, usted dirige", nueva pregunta de cierre como analista de capital.

---

## v26.0 — Unificación Servilleta (May 2026)

Unifica semántica con Servilleta Digital — Tres Pilares canónicos (Matriz Física + Queswa Centro de Mando + Arquitecto de Patrimonio), Base Operativa como activo del Arquitecto, diccionario industrial completo, bloqueo de datos de entrenamiento Gano Excel obsoletos.

---

## Versiones anteriores (v19.x - v25.x)

Para versiones anteriores a v26.0, consultar los archivos `knowledge_base/system-prompt-nexus-main-vXX_Y.md` directamente. Cada uno contiene su propio changelog interno.
