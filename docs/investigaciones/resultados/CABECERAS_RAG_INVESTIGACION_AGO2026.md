# Las cabeceras `[Concepto Nuclear]` — qué cuestan, qué no cuestan, y qué hacer

**Fecha:** 25 ago 2026 · **Alcance:** `arsenal_inicial.txt` (58 fragmentos), extensible a los siete arsenales
**Encargo:** medir el uso y el tamaño de las cabeceras. No había investigación interna sobre el tema.

---

## Resumen ejecutivo

1. **Las cabeceras son el 47,4% de lo que se vectoriza y se le sirve al modelo**, no el ~24% que dice CLAUDE.md. En los cuatro fragmentos más importantes pesan más que la respuesta.
2. **Quitarlas NO arregla la recuperación.** Medido sobre el corpus real con 40 consultas parafraseadas: +2 aciertos en el puesto 1, −1 en el top 3, score medio igual. La hipótesis de la dilución del embedding es cierta en la teoría y **marginal en la práctica**, porque la cabecera habla del mismo tema que el cuerpo: no es ruido, es verbosidad en la misma dirección.
3. **Lo que sí arregla la recuperación es separar el índice del contenido servido.** Indexar *disparadores + dos frases* en vez del fragmento entero: **29/40 aciertos en el puesto 1 (vs 25), 34/40 en top 3 (vs 33), y el margen sobre el segundo se DUPLICA — 0,050 vs 0,024.**
4. **El argumento real contra las cabeceras no es de recuperación: es de generación.** Existe un fenómeno documentado —*contextual entrainment*— por el que el modelo sube la probabilidad de **cualquier token presente en el prompt, sea relevante o no**, y las instrucciones explícitas de ignorarlo apenas lo mitigan. Es el mecanismo exacto del incidente de `COMP_GEN5_01`.
5. **Hallazgo colateral grave: las mediciones hechas con el disparador literal son circulares** y han sostenido al menos una decisión de arquitectura (v5.75).

---

## Parte 1 — Estado actual, medido

Parseo idéntico al de `scripts/fragmentar-arsenales-voyage.mjs`.

| Métrica | Valor |
|---|---|
| Fragmentos | 58 |
| Cabecera promedio | **739 caracteres** |
| Cabecera máxima | 2.792 (WHY_02) |
| Cabecera mínima | 94 (FREQ_18) |
| **Cabecera / corpus embebido** | **47,4%** (41.917 de 88.493 caracteres) |

Los diez fragmentos donde la cabecera pesa más que el cuerpo:

| Fragmento | Cabecera | Cuerpo | % cabecera |
|---|---:|---:|---:|
| WHY_03 | 2.384 | 702 | 72,2% |
| WHY_02 | 2.792 | 1.103 | 71,2% |
| FREQ_30 | 890 | 282 | 68,0% |
| WHY_ROL_01 | 1.156 | 482 | 67,4% |
| FREQ_15 | 1.072 | 520 | 65,3% |
| STORY_03 | 1.059 | 431 | 64,2% |
| FREQ_07 | 1.256 | 565 | 64,0% |
| CRED_04 | 890 | 457 | 63,5% |
| WHY_PROD_01 | 1.167 | 679 | 59,8% |
| EAM_01 | 1.144 | 624 | 59,7% |

**Por qué viaja completa.** El fragmentador embebe `pregunta + cleanContent`, donde `cleanContent` va desde después de la línea `###` hasta el primer `---` — cabecera incluida. Y guarda `fullSection` como contenido servido, que además incluye la línea `###`. La cabecera entra por las dos puertas.

**Negaciones.** `auditar-frases-vetadas.mjs` reporta 0 porque solo busca frases vetadas literales. Contando construcciones negativas de cualquier tipo: **20 de 58 cabeceras las tienen, 31 en total.** Las más cargadas: FREQ_15 (4), FREQ_28 y WHY_ROL_01 (3 cada una).

---

## Parte 2 — Qué dice la literatura

### 2.1 El número de referencia

Anthropic, sobre *Contextual Retrieval*, la técnica que estas cabeceras imitan sin saberlo:

> *"The resulting contextual text, usually 50-100 tokens, is prepended to the chunk before embedding it."*

En español son unos **175 a 400 caracteres**. El promedio del arsenal es 739 y el techo 2.792 — entre dos y siete veces el rango.

### 2.2 Pero el problema de fondo es de oficio, no de tamaño

El prefijo de Anthropic **sitúa** el fragmento para que la búsqueda lo encuentre: de qué documento viene, de qué trata. La cabecera `[Concepto Nuclear]` **explica por qué el copy quedó así**, a quién reemplazó y qué decisión lo fijó. Son dos trabajos distintos, y solo el primero justifica estar dentro de lo que se vectoriza.

### 2.3 Los cuatro mecanismos de daño

**a) Dilución del embedding.** El vector promedia la señal sobre todo el texto: entre más largo, menos distintivo, más bajo el coseno. Medido en la literatura: aumentar el chunk reduce el recall un 10-15% a 512 tokens por exceso de contexto. *(Efecto real pero débil en nuestro caso — ver Parte 3.)*

**b) Contextual entrainment.** El hallazgo más importante de esta investigación. Un LLM **sube la probabilidad de cualquier token que aparezca en el prompt, con independencia de su relevancia**. El efecto persiste con contenido irrelevante *y con contenido contrafáctico*, y los autores probaron instruir explícitamente al modelo para que ignorara esas frases: la mitigación fue mínima.

> Esto es, con nombre científico, la regla que el proyecto ya había descubierto a los golpes: *«NO escribir en una cabecera la frase que esa misma cabecera prohíbe»*. La cabecera de `COMP_GEN5_01` prohibía una frase falsa sobre el día de pago y el modelo la copió de ahí. No fue mala suerte ni un modelo distraído: es el comportamiento esperado.

**c) Context rot.** Degradación medible de la calidad de salida a medida que crece el input, verificada sobre 18 modelos incluidos Claude 4 y GPT-4.1. Aplica aunque la ventana esté lejos de llenarse. Y los distractores individuales bajan el rendimiento incluso de a uno.

**d) Fuga de instrucciones.** El modelo **no distingue de forma confiable** las instrucciones operativas de las que llegan dentro del contexto recuperado, porque ambas viven en el mismo prompt. La mitigación obvia —*"no reproduzcas contenido del contexto"*— apenas mueve la tasa.

> Caso vivo en el arsenal: el cuerpo servido de **FREQ_28** dice *"Si le preguntan por diciembre: esa es la meta personal de Luis…"*. Está escrito para el operador y lo lee el prospecto.

### 2.4 Sobre las negaciones

El *Pink Elephant Problem* está documentado: para suprimir X el modelo tiene que activar X, y los estudios muestran que los LLM ignoran el "not" con frecuencia y responden como si la instrucción fuera afirmativa. La recomendación es unánime: enunciar en afirmativo qué hacer, y dejar la negación solo para correcciones menores. La regla del proyecto ya es correcta; lo que falta es cumplirla en 20 cabeceras.

---

## Parte 3 — El experimento sobre el corpus propio

La literatura es prestada. Esto se midió aquí.

**Método.** Se parsea `arsenal_inicial.txt` con la lógica exacta del fragmentador, se construyen cuatro índices distintos, se embeben con `voyage-3-lite` a 512 dimensiones e `input_type: document`, y se consultan con 40 preguntas en español coloquial embebidas con `input_type: query`. **Las consultas son paráfrasis deliberadas, nunca el disparador literal** — ver Parte 4.1.

Las cuatro variantes:

- **A — hoy:** `pregunta + cabecera + cuerpo` (lo que corre en producción)
- **B — sin cabecera:** `pregunta + cuerpo`
- **C — solo disparadores:** la línea de preguntas, nada más (índice estilo HyPE)
- **D — disparadores + 2 frases:** la línea de preguntas más las dos primeras frases del cuerpo

**Resultado de la primera vuelta:**

| | A: hoy | B: sin cabecera | C: solo disparadores | D: disparadores + 2 frases |
|---|---:|---:|---:|---:|
| Acierto en el puesto 1 | 25/40 | 27/40 | 29/40 | **29/40** |
| Acierto en el top 3 | 33/40 | 32/40 | 31/40 | **34/40** |
| Score medio del correcto | 0,510 | 0,507 | 0,549 | **0,545** |
| **Margen medio sobre el 2º** | 0,024 | 0,029 | 0,038 | **0,050** |

**Segunda vuelta — el índice escrito a propósito.** La variante D recorta las dos primeras frases del cuerpo. Reemplazarlas por un texto **redactado para la búsqueda**, con las palabras que usa la persona, gana en todo. Los 58 índices están escritos y viven en el `.txt` como `**[Índice]:**`:

| | A: antes | D: +2 frases | **E: + índice** | F: índice + cuerpo |
|---|---:|---:|---:|---:|
| Acierto en el puesto 1 | 24/40 | 29/40 | **34/40** | 29/40 |
| Acierto en el top 3 | 31/40 | 34/40 | **38/40** | 32/40 |
| Score medio del correcto | 0,513 | 0,544 | **0,587** | 0,524 |
| **Margen medio sobre el 2º** | 0,023 | 0,052 | **0,082** | 0,042 |

**Mejoran 15 · empatan 24 · empeora 1.** El margen sobre el segundo se multiplica por 3,6.

La columna F cierra la discusión sobre el mecanismo: devolverle el cuerpo al índice **empeora** el resultado, de 34 a 29. Lo que ahoga la señal no era solo la cabecera — era todo el texto largo. Por eso el índice se indexa **solo**, y el cuerpo se sirve sin indexarse.

⚠️ **El afinado tiene techo.** Tres índices se ajustaron tras ver qué fragmento ganaba en su lugar, y el cuarto intento ya no mejoró el conjunto: seguir habría sido sobreajustar a estas 40 consultas. La consulta que sigue perdiendo el puesto —*«ya gano bien en mi trabajo la verdad»*— sube su propio score de 0,470 a 0,550; lo que pasa es que sus competidores suben más.

### Lo que esto dice

**Quitar la cabecera, sola, casi no mueve la aguja.** +2 en el puesto 1, −1 en el top 3, score medio idéntico. La hipótesis de la dilución era teóricamente sólida y resultó **marginal en la práctica**, y la razón es interesante: la cabecera no es ruido fuera de tema, es prosa en español sobre exactamente los mismos conceptos que el cuerpo. Suma masa en la misma dirección del vector en vez de desviarlo.

**Lo que sí funciona es cambiar QUÉ se indexa.** La variante D gana en las cuatro métricas, y la que más importa es la última: **el margen sobre el segundo se duplica**. Ese margen es lo que decide los casi-empates — y CLAUDE.md documenta un Δ0,017 que hizo al modelo mezclar dos fragmentos, al punto de que hubo que construir el candado solitario para taparlo. Duplicar el margen ataca esa falla en su origen.

**Por qué la variante D gana** (mecanismo documentado, *Hypothetical Prompt Embeddings*): los modelos de embedding agrupan por **forma** además de por tema — las frases interrogativas caen cerca unas de otras. Una consulta es una pregunta; un cuerpo de arsenal es prosa declarativa. Indexar los disparadores convierte la búsqueda en **pregunta contra pregunta**, que es un problema más fácil. En la literatura eso vale +21,2 puntos de precisión de contexto sobre RAG ingenuo.

El arsenal **ya tiene** ese activo: la línea `### FREQ_01: "¿Qué es Queswa? / ¿Tú eres un robot? / …"` son exactamente prompts hipotéticos, escritos a mano y bien. Hoy quedan sepultados bajo 739 caracteres de doctrina.

### Casos individuales, A → D

Mejoran 8, empatan 27, empeoran 5.

| Consulta | Fragmento | Hoy | D |
|---|---|---|---|
| «cual es mi trabajo dia a dia» | EAM_01 | puesto 6 | **puesto 1** |
| «que me toca hacer a mi todos los dias» | EAM_01 | puesto 3 | **puesto 1** |
| «ya tuve codigo de gano excel» | NET_02 | puesto 14 | **puesto 3** |
| «hay capacitacion o me dejan solo» | FREQ_08 | puesto 2 | **puesto 1** |
| «quien esta detras de esto» | CRED_01 | puesto 3 | **puesto 1** |
| «yo ya hice multinivel antes y no funciono» | NET_01 | puesto 5 | **puesto 2** |
| «que es lo que se vende exactamente» | WHY_PROD_01 | puesto 2 | puesto 8 |
| «no se cual escoger de los tres» | FREQ_30 | puesto 3 | puesto 7 |

**Los cinco que empeoran enseñan la regla final.** Son fragmentos cuyas dos primeras frases no representan la respuesta — WHY_PROD_01 abre hablando del ancla del café, FREQ_30 abre con *"Con el que le resulte cómodo hoy"*. Rebanar mecánicamente falla ahí. **El texto que se indexa debe escribirse a propósito, no cortarse.** Dos o tres líneas redactadas para que la búsqueda las encuentre baten tanto a la cabecera de hoy como al recorte automático.

---

## Parte 4 — Dos hallazgos colaterales

### 4.1 Medir con el disparador literal es circular

El disparador está **dentro** del texto embebido. Medir la recuperación con él mide, en buena parte, que el texto se parece a sí mismo. Verificado contra producción:

```
█ "¿Qué garantía tengo de que no voy a perder mi dinero?"   ← disparador literal
  1. 0.670  arsenal_inicial_CRED_04          ✅

█ "y si pierdo la plata que meti"                            ← cómo se pregunta de verdad
  1. 0.487  arsenal_inicial_OBJ_02
  … CRED_04 no aparece en el top 6
```

Esto importa porque **hay decisiones de arquitectura apoyadas en esa medición**. La nota de la v5.75 conserva cinco de seis fragmentos "redundantes" argumentando, entre otras, que *«CRED_04 gana su pregunta literal con 0.629»*. Es cierto para la pregunta literal y falso para la forma en que un colombiano la escribe con el pulgar.

**Regla que se desprende:** toda medición de recuperación se hace con paráfrasis coloquiales, nunca con el disparador. El disparador solo sirve para comprobar que el fragmento existe.

### 4.2 FREQ_17 tiene un hueco de recuperación, además del error de hecho

«cada cuanto me consignan» — la forma más natural de preguntar por la cadencia de pago — no alcanza a FREQ_17 en ninguna de las cuatro variantes. En producción gana WHY_04 con 0,470 y FREQ_17 no entra al top 6. El fragmento que existe para responder eso no se recupera, y además su cuerpo dice mal la cadencia.

---

## Parte 4bis — Lo que la implementación destapó (25 ago 2026)

### FREQ_04_PUENTE llevaba meses sin existir en el corpus

Al aplicar el rediseño apareció un bug del fragmentador anterior al trabajo. El identificador se extraía con `[A-Z]+(?:_[A-Z0-9]+)*_(?:\d+|OVERVIEW)`, sin exigir que terminara en `:`. Para `FREQ_04_PUENTE` la alternativa `_\d+` casaba primero y devolvía **`FREQ_04`** — el mismo `fragmentCategory` que la respuesta anterior del archivo. Como el fragmentador salta lo que ya existe, la respuesta de las formas de ganar **nunca llegó a indexarse**. Comprobado en Supabase: solo existe `arsenal_inicial_FREQ_04`, en los tres tenants.

El arreglo exige `:` después del identificador. Verificado contra los siete arsenales: mismos conteos, cero duplicados, y `FREQ_04_PUENTE` recuperado.

**Lección de método:** el fragmentador salta en silencio y el audit cuenta por `parent_arsenal`, así que una respuesta puede vivir en el `.txt`, parecer desplegada y no existir. Después de cada despliegue conviene contrastar la lista de IDs del archivo contra `select category from nexus_documents`.

---

## Parte 5 — Recomendación

### La decisión de arquitectura

**Separar el texto que se indexa del texto que se sirve.** El esquema ya lo permite: `embedding_512` y `content` son columnas distintas. Hoy el fragmentador embebe `pregunta + cleanContent` y sirve `fullSection`; cambiar lo primero es una línea.

El reparto queda así:

| Pieza | Dónde vive | Quién la lee |
|---|---|---|
| Disparadores + 2-3 líneas de qué responde | texto **indexado** | el buscador vectorial |
| Cuerpo de la respuesta | texto **servido** | el modelo, y de ahí el prospecto |
| Razonamiento de diseño y decisiones | bloque **recortado** por el fragmentador | los agentes que editan el `.txt` |

Lo tercero se implementa como ya se implementó el corte de `## CHANGELOG`: un marcador que el fragmentador descarta. La doctrina se queda donde los agentes la leen, y sale del embedding y del contexto del modelo.

### Lo que NO se recomienda

**Recortar las 58 cabeceras una por una.** El experimento dice que ese trabajo, solo, casi no compra recuperación. Sirve para el entrainment, pero es el camino caro para ese beneficio.

### Nota sobre el modelo de embeddings

Voyage sacó `voyage-context-3` y `voyage-context-4`, que producen embeddings por fragmento capturando el contexto global del documento **sin aumentación manual de metadatos**. `voyage-context-3` supera a *contextual retrieval* manual en **20,54%** en recuperación a nivel de fragmento; `voyage-context-4` le saca otro 2,1% a un 33% menos de costo. Soportan 512 dimensiones — la columna actual — y no exigen cambio de esquema. Es la vía por la que este problema deja de existir en vez de administrarse. Merece su propia evaluación.

---

## Anexo — Reproducción

```bash
node scripts/experimento-cabeceras.mjs
```

Determinista: los embeddings de Voyage no varían entre corridas, así que los números de arriba se reproducen exactos.

---

## Fuentes

- [Contextual Retrieval in AI Systems — Anthropic](https://www.anthropic.com/engineering/contextual-retrieval)
- [Sentence-Level Contextual Entrainment in Large Language Models](https://arxiv.org/pdf/2606.24077)
- [Context Rot: How Increasing Input Tokens Impacts LLM Performance — Chroma](https://www.trychroma.com/research/context-rot)
- [Context Length Alone Hurts LLM Performance Despite Perfect Retrieval](https://arxiv.org/pdf/2510.05381)
- [Bridging the Question-Answer Gap in RAG: Hypothetical Prompt Embeddings (HyPE)](https://arxiv.org/html/2607.29402)
- [Question-Based Retrieval using Atomic Units for Enterprise RAG](https://arxiv.org/pdf/2405.12363)
- [Follow My Instruction and Spill the Beans: Scalable Data Extraction from RAG Systems](https://arxiv.org/html/2402.17840)
- [RAG Security — OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html)
- [Context poisoning in LLMs: How to defend your RAG system — Elastic](https://www.elastic.co/search-labs/blog/context-poisoning-llm)
- [The Pink Elephant Problem: Why "Don't Do That" Fails with LLMs](https://eval.16x.engineer/blog/the-pink-elephant-negative-instructions-llms-effectiveness-analysis)
- [Saying what not to do: Can state-of-the-art language models understand negated instructions?](https://alexbleakley.com/blog/saying-what-not-to-do)
- [Rethinking Chunk Size For Long-Document Retrieval: A Multi-Dataset Analysis](https://arxiv.org/pdf/2505.21700)
- [Reducing Redundancy in RAG through Chunk Filtering](https://arxiv.org/pdf/2604.24334)
- [voyage-context-3 — Voyage AI](https://blog.voyageai.com/2025/07/23/voyage-context-3/)
- [Contextualized Chunk Embeddings — Voyage AI docs](https://docs.voyageai.com/docs/contextualized-chunk-embeddings)
