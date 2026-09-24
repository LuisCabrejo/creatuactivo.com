# Queswa perspicaz: cómo resuelven los líderes la conversación sin guiones

**Fecha:** 24 sep 2026 · **Pedido por:** el Director, tras su prueba de 29 turnos desde el 320 680 5737.
**La pregunta:** cuando alguien dice *«ya me hablaste de eso»*, Queswa no debería responder con un texto fijo —la persona puede estar equivocada, o confundida por otra razón—, sino entender, como lo hace un humano o un asistente como Claude o Gemini. ¿Cómo lo resuelven las empresas líderes?

---

## 1. El diagnóstico, medido sobre la prueba del Director

De los 29 turnos, quién decidió la respuesta:

| Quién decidió | Turnos | Qué falló ahí |
|---|---|---|
| **El código, sin que el modelo leyera el turno** (nodos del webhook, candados dictados, radicación) | **19 (66 %)** | Perspicacia: repitió el «Cómo funciona» a quien se quejaba de repetición (10), mandó fotos que nadie pidió (14, 25, 26), ofreció lo ya mostrado (9), respondió «Servientrega» para Inglaterra (24) |
| **El modelo, obligado a copiar un candado** | 2 | Repitió EAM_01 entero (22): el candado manda copiar, y la regla verbatim le gana al criterio |
| **El modelo, redactando libre** | 8 | Datos: armó el catálogo con la lista de un paquete (8), 4 de 9 bebidas (15), el Kit sin precio (17), inventó un «equipo de Reino Unido» y «precios en libras» (23, 27, 28) |

**La conclusión es un espejo:** donde decide el código, a Queswa le falta criterio; donde decide el modelo, le faltan datos. Los líderes hacen exactamente lo contrario: **la conversación la decide el modelo, y los datos los pone el código.**

### ⚠️ Y el modelo tampoco tenía memoria — por un permiso, no por diseño

Al ensayar la conversación entera contra un servidor local (`scripts/repetir-por-webhook.mts`), el motor registró **«Sin historial previo» en cada uno de los 29 turnos**. La causa: leía `nexus_conversations` con la llave pública, y la seguridad de filas de esa tabla devuelve **cero filas sin error**. Consecuencias, las dos vigentes en producción hasta el 24 sep 2026:

- El «historial» que el motor le daba al modelo **nunca tuvo datos**. El modelo veía solo los últimos tres intercambios que le manda el webhook; todo lo anterior no existía.
- El filtro de «lo que este hilo ya sirvió» (23 sep) leía la misma tabla: **nunca excluyó nada en producción**. Pasaba sus pruebas porque eran unitarias.

Se corrigió leyendo con la llave de servidor. Es la razón de fondo de las repeticiones de la prueba del Director, y la lección para cualquier dato que el motor lea: **una consulta que devuelve vacío no es lo mismo que una que no tiene nada que devolver** — se comprueba con una fila que se sabe que existe.

---

## 2. Lo que hacen los líderes

### Anthropic — criterio, no lógica cableada
- En su guía de *context engineering* nombra el error: *«engineers hardcoding complex, brittle logic in their prompts to elicit exact agentic behavior. This approach creates fragility and increases maintenance complexity over time.»* El punto correcto es *«specific enough to guide behavior effectively, yet flexible enough to provide the model with strong heuristics»*.
- Para conversaciones largas recomienda **notas estructuradas**: el agente lleva un registro de lo hecho fuera de la ventana y lo relee.
- En *Building effective agents*: los flujos deterministas sirven para tareas predecibles; el modelo, cuando hace falta flexibilidad. Y los guardarraíles funcionan mejor **en paralelo, con otra llamada al modelo**, que dentro de la misma.

### Salesforce Agentforce — «razonamiento híbrido» (Agent Script, oct 2025)
Dos tipos de instrucción en el mismo agente: la **lógica determinista** (condiciones, acciones, variables) se ejecuta como código y el modelo no la puede pasar por encima; las **instrucciones en lenguaje natural** las interpreta el modelo en cada turno. El código gobierna lo que tiene que ser exacto; el modelo, el tono, la adaptación y la conversación.

### Rasa CALM — la reparación de la conversación viene resuelta por el modelo
*«LLMs keep the conversation fluent but don't guess your business logic.»* Las desviaciones del camino feliz —**corregir** algo dicho antes, **cambiar de tema** a mitad de un trámite, **pedir aclaración**— las detecta el modelo leyendo la conversación, y el negocio queda en flujos deterministas. El equipo diseña el negocio *«instead of accounting for every possible detour»*: nadie escribe una regla por cada desvío.

### Google (Conversational Agents) — flujos + playbooks
Los **flujos** deterministas para lo que exige control exacto de la respuesta; los **playbooks**, instrucciones en lenguaje natural que el modelo aplica a escenarios que nadie definió uno por uno. El agente híbrido combina los dos, con respaldo generativo para lo inesperado.

### Decagon — procedimientos en lenguaje natural con acciones en código
Los *Agent Operating Procedures*: el equipo escribe el procedimiento en lenguaje llano, y solo las **acciones críticas** (reembolsos, identidad, suscripciones) quedan en código que se ejecuta igual siempre.

### Sierra — supervisores que revisan cada respuesta
Agentes supervisores corren **en paralelo**, revisan cada respuesta mientras se genera, verifican hechos, hacen cumplir la política y reencauzan la conversación si se desvía; los límites duros del negocio van en código determinista.

### Intercom Fin — refinar, generar, validar
Cada mensaje pasa por tres fases: **refinar la consulta** con su contexto, **generar** una respuesta anclada en el conocimiento, y **validar** antes de enviar.

---

## 3. Lo que dice la investigación sobre conversaciones de varios turnos

- **Los modelos se pierden en conversaciones largas.** Laban et al. (Microsoft/Salesforce, 2025): en seis tareas, el rendimiento cae en promedio un **39 %** de un solo turno a varios, y la **inestabilidad sube un 112 %**. *Una vez toman un camino equivocado, no se recuperan.* Por eso ayuda que el modelo tenga un **registro compacto** de lo ocurrido, en vez de reconstruirlo leyendo todo el hilo.
- **Los modelos piden aclaración mucho menos que una persona.** Shaikh et al. (Microsoft, 2025): **3 veces menos** propensos a pedir aclaración y **16 veces menos** a hacer preguntas de seguimiento, y **los tropiezos tempranos predicen el colapso posterior**. La perspicacia hay que pedirla explícitamente.
- **El otro extremo: darle la razón a la persona aunque no la tenga.** Un estudio de 2026 sobre la *reparación* en conversación (5.111 problemas, GPT-4o, Claude Sonnet 4.5 y otros): GPT-4o sostiene su respuesta equivocada el 71-76 % de las veces («el sabelotodo»); Claude corrige cerca del 25 % de sus errores pero es **el más propenso a aceptar una corrección falsa** del usuario («el que duda de sí»). OpenAI retiró una versión de GPT-4o en abril de 2025 por complaciente: se había entrenado con el pulgar arriba de conversaciones cortas, y la gente premia que le den la razón.

**Para Queswa, esto último es el punto del Director:** si la persona dice *«ya me hablaste de eso»* y está equivocada, un modelo que solo tiene la queja le va a dar la razón. Uno que tiene **el registro de lo que de verdad se mostró** puede verificarlo, como haría una persona.

---

## 4. Qué significa para Queswa

**Lo que se queda en código — son hechos y acciones:** precios y tablas, enlaces con el identificador del socio, fotos, la radicación, los guardarraíles legales (salud, promesa de ingreso), y las puertas que llevan a la respuesta correcta (diáspora, productos, líneas).

**Lo que vuelve al modelo — es conversación:**

1. **El modelo lee todos los turnos**, incluidos los que hoy salen dictados. El código le pasa el texto aprobado que debe ir literal —el *núcleo*— y el modelo escribe lo que es conversación: reconocer lo que la persona dijo y elegir qué ofrecer después. El código **verifica** que el núcleo salió intacto; si no, envía la versión dictada. Es el patrón que ya usa la salud desde el 8 sep (*«toda familia de salud se compone alrededor del núcleo literal»*), generalizado.
2. **Una bitácora en cada turno**, en las instrucciones de sesión y no en el prompt: qué se ha mostrado, qué se ha ofrecido y si lo aceptó, y lo que la persona dijo de sí (vive en Londres, es independiente, lo consulta con Liliana). Es la *nota estructurada* de Anthropic, y es lo que le permite **verificar** en vez de complacer.
3. **Un principio corto en el prompt, no un guion**: releer la bitácora antes de responder; seguir adelante con algo nuevo cuando la persona tiene razón; cuando no la tiene, decirle qué se mostró y preguntarle qué busca.
4. **Un supervisor antes de enviar** (el patrón de Sierra e Intercom): una llamada corta de Haiku revisa el borrador contra la bitácora —repetición, dato inventado, pregunta de dos salidas— y, si falla, el modelo reescribe una vez. Cuesta alrededor de un segundo.

**El costo:** los turnos que hoy salen en 2 segundos tardarían entre 5 y 8. En WhatsApp eso es también lo que hace visible el «escribiendo…», que es la otra observación de la misma prueba.

**Lo que dijo el ensayo** (24 sep 2026, cinco corridas de los 29 turnos contra un servidor local en modo ensayo): la bitácora, la envoltura y las correcciones de enrutamiento se quedan —«Usted está mirando el ESP-3, Liliana lo está revisando…» a un «sí» suelto; «tiene razón, ya los vimos» a la queja; el caso de Inglaterra con la doctrina correcta—. **El supervisor antes de enviar, no**: detecta bien, pero sus reescrituras empeoraron seis de doce respuestas, y en una inventó justo lo que había marcado. Queda apagado detrás de un interruptor, y la detección la hace el juez de la revisión diaria, que no toca lo que sale. Es coherente con lo que hace Intercom en su fase de validación: ante una falla no reescribe, escala.

**Cómo probarlo sin arriesgar nada:** un piloto con cuatro respuestas (WHY_02, EAM_01, PERFIL_02 y WHY_PROD_01) más la bitácora y el supervisor. Se repite la prueba de 29 turnos del Director y se mide: núcleo intacto (%), latencia, repeticiones y datos inventados. Si pasa, se extiende.

---

## Fuentes

- Anthropic — [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- Salesforce — [Introducing Hybrid Reasoning with Agent Script](https://developer.salesforce.com/blogs/2025/10/introducing-hybrid-reasoning-with-agent-script)
- Rasa — [Conversational AI with Language Models (CALM)](https://rasa.com/docs/learn/concepts/calm/) · [Conversation Patterns](https://rasa.com/docs/learn/concepts/conversation-patterns/)
- Google Cloud — [Generative versus deterministic](https://docs.cloud.google.com/dialogflow/cx/docs/generative-deterministic) · [Playbooks](https://docs.cloud.google.com/dialogflow/cx/docs/concept/playbook)
- Decagon — [Agent Operating Procedures](https://decagon.ai/product/aop)
- Sierra — [Confidence in every conversation](https://sierra.ai/blog/confidence-in-every-conversation)
- Intercom — [The Fin AI Engine](https://fin.ai/ai-engine)
- Laban et al. — [LLMs Get Lost In Multi-Turn Conversation](https://arxiv.org/abs/2505.06120)
- Shaikh et al. — [Navigating Rifts in Human-LLM Grounding](https://arxiv.org/abs/2503.13975)
- [Talking to a Know-It-All GPT or a Second-Guesser Claude? How Repair reveals unreliable Multi-Turn Behavior in LLMs](https://arxiv.org/html/2604.19245v2)
- OpenAI — [Sycophancy in GPT-4o: what happened and what we're doing about it](https://openai.com/index/sycophancy-in-gpt-4o/)
