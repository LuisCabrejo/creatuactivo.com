# **INFORME DE INVESTIGACIÓN: ARQUITECTURA DE MÁQUINAS DE ESTADO CONVERSACIONAL Y CUMPLIMIENTO DE PROTOCOLOS ESTRICTOS EN LLMS DE VENTAS**

La integración de Modelos de Lenguaje Grande (LLMs) en flujos de trabajo de ventas empresariales y de alto valor expone una paradoja fundamental en el diseño de la inteligencia artificial contemporánea: los modelos más avanzados han sido optimizados para exhibir fluidez, proactividad y un comportamiento consultivo, características que entran en conflicto directo con la necesidad de determinismo, cumplimiento estricto de protocolos y ejecución secuencial rígida. El caso operativo de Queswa, un chatbot de ventas impulsado por la familia Claude 3.5 y 4.6 de Anthropic, ilustra perfectamente las fallas sistémicas que emergen cuando se intenta forzar a un sistema probabilístico a comportarse como una máquina de estados finitos utilizando únicamente instrucciones en lenguaje natural.

El presente documento analiza exhaustivamente el comportamiento de los LLMs en máquinas de estado conversacional, deconstruye la causa raíz de las desviaciones de protocolo documentadas (como la invención de bifurcaciones o la solicitud prematura de datos KYC), y sintetiza las arquitecturas de referencia, patrones de diseño y marcos teóricos que las empresas tecnológicas de élite y las investigaciones académicas recientes utilizan para resolver esta tensión entre la fluidez conversacional y el cumplimiento estricto ("protocol compliance").

## **La Tensión Estructural: El Sesgo Consultivo frente al Determinismo de Estado**

El comportamiento anómalo observado en los entornos de producción, donde el agente se desvía del protocolo de cierre lineal de tres pasos, no obedece a un fallo en la comprensión lectora del modelo, sino a la activación de patrones de comportamiento profundamente arraigados durante su fase de preentrenamiento y alineación. Las investigaciones internas de organizaciones como Anthropic han identificado que el comportamiento de "asistente útil" está ligado a un patrón de actividad neuronal específico denominado el "Eje del Asistente" (Assistant Axis).1 Este eje está estrechamente asociado con arquetipos humanos profesionales y consultivos. Cuando un LLM opera a lo largo de este eje, su función objetivo interna prioriza la utilidad integral, la exploración de opciones y la recolección exhaustiva de contexto antes de forzar una decisión.

En el contexto de ventas, este prior psicológico artificial se manifiesta exactamente como los errores documentados en el entorno de Queswa. El Bug A, donde el modelo inventa una bifurcación ofreciendo un camino educativo antes de proceder al cierre, es una manifestación clásica de la proactividad del "Assistant Axis", el cual asume que un prospecto siempre se beneficia de opciones educativas antes de comprometer capital. El Bug B, caracterizado por la solicitud prematura de datos de registro (KYC) tras capturar la disponibilidad de tiempo, ocurre porque los datos de entrenamiento del modelo contienen millones de transcripciones de ventas humanas donde la captura de información de contacto es el paso secuencial de facto tras la cualificación inicial.1

El intento de mitigar estos comportamientos mediante el uso de un "system prompt" masivo (aproximadamente 59KB) introduce un segundo fenómeno de degradación documentado en la literatura de 2025: la caída en el seguimiento de instrucciones a alta densidad. El benchmark IFScale, diseñado para medir cómo se degrada el rendimiento de los modelos frente a una alta densidad de instrucciones, revela que incluso los modelos frontera sufren de "decadencia de umbral" o "decadencia exponencial".3 Un modelo puede mantener una adherencia casi perfecta a las reglas hasta alcanzar una masa crítica de restricciones; cruzado este umbral, la varianza aumenta y el modelo comienza a ignorar bloqueos explícitos, revirtiendo a sus priors probabilísticos.

La inyección de bloqueos absolutos (por ejemplo, "PROHIBIDO mencionar paquetes en Estado 1") agrava el problema debido a la mecánica de atención de los transformadores. Al mencionar explícitamente los paquetes o el proceso KYC en el prompt general, incluso en un contexto negativo o mediante ejemplos "few-shot" negativos, el sistema asigna peso semántico a esos tokens. En contextos largos, el modelo sufre de un sesgo de primacía y recencia, y la mera presencia de la palabra "paquetes" en su ventana de contexto eleva la probabilidad matemática de que el modelo decida hablar de ellos de forma prematura.3 El prior consultivo anula las instrucciones de la máquina de estados, demostrando que el problema no radica en la redacción del prompt, sino en la arquitectura de control.

## **Fundamentos Teóricos del "State Machine Grounding"**

La comunidad investigadora ha formalizado el estudio de este problema bajo el concepto de "State Machine Grounding" (Anclaje a Máquinas de Estado) y el seguimiento de instrucciones en diálogos de múltiples turnos. La premisa central es que los LLMs tradicionales procesan cada turno de diálogo como una tarea aislada de predicción del siguiente token, sin una representación interna real del estado en el que se encuentran dentro de un proceso más amplio.5

Para evaluar y solucionar esto, se han desarrollado benchmarks avanzados. StructFlowBench (2025) es un marco de evaluación diseñado específicamente para medir el cumplimiento de instrucciones multiturno bajo restricciones estructurales complejas.6 Las evaluaciones en este benchmark sobre modelos como Claude 3.5 Sonnet y GPT-4o demuestran que, si bien estos modelos alcanzan tasas de cumplimiento superiores al 94% en restricciones dentro de un mismo turno (intra-turn), presentan deficiencias significativas al intentar mantener dependencias estructurales y secuencias lógicas a lo largo de toda la conversación (inter-turn).6 La conclusión académica es unánime: la memoria de estado no puede depender exclusivamente de la ventana de contexto del LLM.

### **Integración de Prompts Basados en Grafos (GraphIF)**

Una de las estrategias académicas más prometedoras para resolver la deriva de instrucciones ("instruction drift") es el marco GraphIF, propuesto a finales de 2025\.5 GraphIF reconoce que en los diálogos de múltiples turnos, las restricciones relacionales entre los pasos pueden modelarse de forma natural como bordes dirigidos en un grafo.

En lugar de depender de un prompt estático masivo, GraphIF utiliza un módulo de extracción de relaciones basado en agentes que captura las relaciones semánticas entre turnos. Esta información estructurada se convierte luego en "graph prompts" dinámicos.10 En la práctica, esto significa que el LLM no recibe un manual completo del flujo de ventas. En su lugar, el contexto se actualiza dinámicamente para reflejar exclusivamente el nodo actual del grafo de la conversación y las transiciones de salida permitidas desde ese nodo específico. Este aislamiento del horizonte de eventos previene que el LLM se anticipe a estados futuros (como el KYC) simplemente porque no están presentes en su topología inmediata.

### **Seguimiento de Estado en Lenguaje Natural (NL-DST)**

Paralelamente, la investigación en Natural Language Dialogue State Tracking (NL-DST) sugiere trasladar la gestión del estado desde representaciones implícitas de ranura-valor hacia descripciones directas generadas por el LLM en lenguaje natural, pero procesadas de forma aislada de la generación de la respuesta.11 El modelo se utiliza primero para generar una descripción del estado actual de la conversación (por ejemplo, "El usuario ha mostrado intención de compra pero no ha especificado su disponibilidad horaria"). Esta síntesis determinista es evaluada por un sistema externo antes de permitir que el modelo genere el diálogo final, estableciendo una barrera arquitectónica entre la percepción del estado y la acción conversacional.

## **Patrones Arquitectónicos de la Élite: Desacoplando Lógica y Lenguaje**

Las compañías tecnológicas de referencia que han logrado desplegar agentes conversacionales de alto valor en producción a escala —resolviendo el dilema del cumplimiento estricto de protocolos— han abandonado los enfoques basados en prompts masivos y arquitecturas monolíticas. La estrategia universal es el desacoplamiento: el modelo de lenguaje actúa como un procesador semántico, mientras que la lógica de estado, el cumplimiento normativo y las transiciones residen en un orquestador determinista externo.

A continuación, se analizan las arquitecturas específicas empleadas por los líderes del mercado para garantizar que el LLM no improvise ni se desvíe del guion en flujos críticos.

### **Salesforce: Agentforce y el Atlas Reasoning Engine**

Salesforce abordó el desafío de la automatización de ventas y servicios empresariales mediante el desarrollo del "Atlas Reasoning Engine", el núcleo cognitivo de su plataforma Agentforce. Conscientes de que el prompt engineering tradicional es insuficiente para la ejecución confiable de tareas de múltiples pasos, introdujeron la "Ingeniería de Contexto" (Context Engineering) y un modelo estratificado de "Niveles de Determinismo".12

El Atlas Reasoning Engine no utiliza un diseño monolítico, sino un flujo de trabajo asíncrono, basado en eventos y orientado a grafos. Un agente en Atlas se define por cinco atributos inmutables: Rol, Datos, Acciones, Canal y, críticamente, Guardarraíles (Guardrails).12 Para secuencias de ventas o procesos de cumplimiento donde las desviaciones no son tolerables, Salesforce implementa el Nivel 6 de Determinismo a través de "Agent Scripts".

| Atributo del Motor Atlas | Mecanismo de Control y Cumplimiento | Impacto en la Secuencia de Estado |
| :---- | :---- | :---- |
| **Separación de Estado y Flujo** | El estado (memoria) se mantiene de manera independiente del flujo (lógica direccional). El LLM no decide el flujo; el marco lógico externo dirige al LLM. | Previene la invención de bifurcaciones, ya que el motor de inferencia restringe las opciones del modelo a las definidas en el paso actual del grafo. |
| **Nivel 6 de Determinismo** | Uso de bloques before\_reasoning y after\_reasoning. Las instrucciones no son sugerencias para el LLM, son comandos forzados por la infraestructura del sistema. | Garantiza que se ejecuten transiciones precisas, como presentar una tabla de capitalización exacta tras recibir una variable numérica. |
| **Ingeniería de Contexto Dinámico** | El contexto inyectado es una carga útil efímera ensamblada en tiempo real, reemplazando el uso de "megaprompts" estáticos y cachés pesados. | Evita la degradación de densidad de instrucciones al presentar solo las reglas pertinentes al milisegundo actual de la conversación. |
| **Sanitización de "Tool Calls"** | Cuando el LLM decide invocar una acción, la plataforma trata el comando como una sugerencia y lo pasa por comprobaciones de seguridad independientes antes de la ejecución. | Bloquea la recolección proactiva de datos (como el KYC no deseado) al requerir una validación estricta de la transición de estado solicitada. |

Salesforce demuestra que para que la experiencia no se sienta como llenar un formulario robótico pero mantenga la precisión de una sala de juntas, el LLM debe usarse durante la fase de "evaluación" para comprender la intención, pero la fase de "acción" debe estar fuertemente gobernada por el orquestador gráfico. El motor evalúa el plan, recupera los datos y refina el contexto antes de generar cualquier texto visible para el prospecto.14

### **Intercom: Fin AI y la Transición a "Resolution Flows"**

Intercom, con su producto Fin AI, es uno de los sistemas más maduros en el manejo de interacciones con clientes. Inicialmente, Intercom valoraba las resoluciones binarias, pero a medida que el sistema intentaba manejar flujos más complejos (como reembolsos, escalamientos o cierres), el enfoque de dar instrucciones amplias al LLM comenzó a fallar en consistencia.15

Para mantener tasas de resolución superiores al 75% en consultas complejas, la arquitectura de Intercom evolucionó de flujos de instrucciones difusas a lo que ellos denominan **"Fin Procedures"** y **"Resolution Flows"**.16 Su documentación de ingeniería revela un cambio de paradigma crucial para la orquestación de estados:

1. **Procedimientos Operativos Estándar (SOPs) Estructurados:** En lugar de depender de la capacidad del modelo para recordar un manual de políticas, los "Procedures" dividen la lógica en pasos embebidos con controles deterministas. El procedimiento dicta la ramificación; el modelo simplemente sigue el raíl preestablecido, adaptándose lingüísticamente si el cliente interrumpe, pero sin autoridad para alterar la secuencia de la política.17  
2. **Roles Especializados de Equipo:** Reconociendo que el "Prompt Engineering" no era suficiente, estructuraron equipos con roles divididos. Un "Conversation Designer" se asegura de que el bot hable con naturalidad, mientras que un "Support Automation Specialist" codifica los flujos de acción del backend que llaman a las APIs internas y manejan las transiciones lógicas.19  
3. **El Bucle de Ejecución Restringido:** El agente lee la conversación para determinar qué procedimiento activar. Una vez bloqueado en un procedimiento (equivalente a la secuencia de cierre de Queswa), la interfaz conversacional del LLM se somete a los pasos secuenciales de ese flujo de resolución, utilizando la generación aumentada por recuperación (RAG) exclusivamente para el contenido de esa etapa, limitando la posibilidad de alucinaciones sobre pasos futuros.20

La lección arquitectónica de Intercom es que la "fluidez conversacional" es la capa de pintura sobre un chasis de acero determinista. La inteligencia del modelo se aprovecha para comprender variaciones en la respuesta del usuario (por ejemplo, entender que "puedo los fines de semana unas 5 horas" equivale al entero "5"), pero no se le permite decidir qué hacer con ese dato.

### **Startups de Representantes de Ventas con IA: 11x.ai y Artisan**

El sector de automatización SDR (Sales Development Representatives) ofrece un paralelo exacto al caso de uso de Queswa. La startup 11x.ai, responsable de "Alice", rediseñó completamente la arquitectura de su agente desde cero para superar los comportamientos impredecibles que las arquitecturas ingenuas de LLMs generaban.21

La evolución arquitectónica de 11x.ai documenta un viaje que confirma el diagnóstico de Queswa:

* **Fase 1: Arquitectura ReAct (Reason and Act).** Inicialmente intentaron un bucle cognitivo tradicional donde un único agente tenía acceso a todas las herramientas y el objetivo general de "cerrar la venta". El resultado fue una severa "confusión de herramientas", el equivalente computacional de sobrepensar. El agente generaba bucles infinitos, inventaba pasos y sufría errores de límite de recursión porque no podía sobresalir simultáneamente en la empatía conversacional y la ejecución táctica.21  
* **Fase 2: Flujo de Trabajo Rígido (Workflow).** Para solucionar la imprevisibilidad, migraron a un sistema determinista de 15 nodos a través de 5 etapas. Esto solucionó los desvíos, pero destruyó la experiencia de "11 estrellas". El sistema se volvió burocrático y robótico; los usuarios no podían saltar entre temas o hacer preguntas aclaratorias sin romper la máquina de estados.21  
* **Fase 3: Arquitectura Multi-Agente Jerárquica (El Insight Ganador).** El diseño definitivo empleó LangGraph para crear un patrón de **Nodo Supervisor**. Un agente supervisor principal maneja exclusivamente el frente conversacional. Cuando detecta que se requiere una acción del protocolo (como investigar o perfilar), enruta el control a **sub-agentes especializados**. Cada sub-agente es experto en un único micropaso, cumple su función específica y devuelve el control al supervisor.21

En esta arquitectura jerárquica, las habilidades abstractas se reemplazan por "herramientas". En lugar de pedirle al modelo que calcule o procese la secuencia mediante habilidades de "matemática mental", se le proporcionan herramientas acotadas.21 Para Queswa, el equivalente directo es tener un sub-agente "Recolector de Tiempo", cuyo único contexto en el universo es obtener el número de horas, y que, una vez que lo obtiene, muere y transfiere el estado.

### **Agentes de Voz Enterprise: Bland AI, Retell AI y Vapi**

Los sistemas de voz con IA enfrentan el desafío más extremo: no solo deben cumplir protocolos estrictos para evitar pasivos legales o fricciones en las ventas, sino que deben hacerlo en menos de 600 milisegundos para mantener la ilusión conversacional.22 Las metodologías empleadas por Bland AI y Retell AI demuestran cómo lograr el determinismo sin sacrificar la latencia.

El núcleo de su tecnología se basa en las **Vías Conversacionales (Conversational Pathways)** o enrutadores de flujo estructurado.23 A diferencia de los enfoques basados en "prompts monolíticos", estas arquitecturas desglosan el diálogo en grafos visuales.

| Componente Arquitectónico de Voz | Implementación Técnica | Beneficio Directo para el Cumplimiento de Estado |
| :---- | :---- | :---- |
| **Nodos Discretos de Diálogo** | La conversación se fragmenta en nodos aislados. Cada nodo contiene un prompt atómico que rige exclusivamente ese turno (ej. "Presenta el paquete de capitalización"). | Erradica la alucinación sobre fases futuras. El modelo no puede inventar pasos adicionales porque carece del contexto de las políticas globales en ese instante. |
| **Extracción Desacoplada de Variables** | Un LLM secundario paralelo evalúa la respuesta del usuario de forma independiente para extraer entidades (ej. booleanos, enteros) en segundo plano.23 | Neutraliza el sesgo de "ofrecer opciones". Si el usuario responde vagamente, el modelo primario puede manejar la réplica conversacional, pero el estado solo transiciona cuando el extractor de variables valida el dato. |
| **Lógica Condicional Dura** | Las transiciones entre nodos operan sobre operadores lógicos booleanos y webhooks. Si se extrae la variable "horas", el sistema avanza obligatoriamente al siguiente nodo.23 | Garantiza una precisión quirúrgica en el cambio de estado, impidiendo retrocesos o bucles a menos que estén explícitamente diseñados. |

Esta separación radical significa que la "máquina de estados" vive en el código (la plataforma de enrutamiento), mientras que el "modelo lingüístico" solo actúa como una función de lectura/escritura estática ejecutada iterativamente.

## **Patrones de Implementación para "State Compliance" en LLMs**

Basados en la convergencia de las investigaciones académicas y las arquitecturas de producción de empresas de Nivel 1, han surgido tres patrones de implementación documentados que ofrecen la mayor tasa de éxito para forzar a un LLM a honrar protocolos secuenciales de N pasos.

### **1\. El Procesador Semántico (Generative Parsing & Semantic Routing)**

Este patrón requiere un cambio de perspectiva: dejar de tratar al LLM como un empleado digital o un agente autónomo y comenzar a tratarlo como un "procesador semántico" determinista.26 Bajo este paradigma, el modelo no toma decisiones lógicas. Se divide en dos operaciones segregadas en el código (como en una ruta de Apache Camel):

* **El Analizador (Parser):** Un LLM que evalúa la entrada del usuario contra el estado actual y genera una salida estructurada y validable (e.g., JSON). Si el estado es 1 (Tiempo), el parser solo busca extraer un número.  
* **El Generador (Synthesizer):** Una vez que el código de la aplicación transiciona el estado tras una extracción exitosa, se invoca a un segundo LLM cuyo único trabajo es tomar el nuevo contexto y generar la respuesta humana ("Aquí tienes los tres paquetes..."). Este patrón garantiza que la aplicación mantenga su integridad contextual al marginar la inteligencia artificial a las periferias del flujo de datos.26

### **2\. Function Calling / Tool Use Estricto**

Los modelos modernos, especialmente la familia Claude 3.5 Sonnet y GPT-4o, han sido profundamente entrenados para adherirse a esquemas de llamadas a funciones. La documentación técnica establece que cuando el sistema está conectado a un proceso que cambia de estado, el "Function Calling" supera sustancialmente a las instrucciones en lenguaje natural.27 En lugar de instruir al chatbot mediante narrativas de STOP, se le proporciona una herramienta obligatoria, por ejemplo: avanzar\_a\_estado\_capitalizacion(horas\_confirmadas: int). El prompt de sistema instruye al modelo a interactuar libremente para asistir al cliente, pero estipula que en el momento en que adquiera la información de horas, *debe* invocar la herramienta. Al invocar la herramienta, el servidor interrumpe la ejecución del LLM, procesa el estado internamente y devuelve la confirmación del sistema, forzando la transición al siguiente estado de la máquina.27 Esto aprovecha la afinación de los LLMs para cumplir contratos de software en lugar de reglas conversacionales ambiguas.

### **3\. Orquestación Jerárquica Basada en Grafos (Graph Prompting)**

Inspirado por implementaciones como GraphIF, este patrón abandona la práctica de cargar todo el manual de ventas en el bloque de memoria de sesión. En su lugar, el orquestador (el backend en Next.js) rastrea la sesión en Supabase y actualiza dinámicamente el *system prompt* del Bloque 3 para que contenga únicamente las instrucciones del vértice actual del grafo.5 Si el estado es 2 (Capitalización), el prompt destruye cualquier conocimiento previo sobre el Estado 1 y oculta cualquier instrucción sobre el Estado 3 (WhatsApp). El modelo se vuelve localmente omnisciente pero globalmente ignorante. Al no conocer la existencia del handoff final ni los detalles del onboarding, es incapaz de alucinar bifurcaciones o pedir datos KYC adicionales.10

## **Trade-offs Documentados: Fluidez Conversacional vs. Cumplimiento**

La calibración entre la fluidez conversacional (empatía, adaptabilidad) y el cumplimiento estricto del protocolo representa uno de los desafíos de diseño más críticos. Las arquitecturas monolíticas no pueden optimizar ambos simultáneamente debido a las limitaciones de carga cognitiva del modelo.

* **Degradación del Tono vs. Precisión de Reglas:** Cuando un modelo es fuertemente constreñido mediante Structured Outputs o forzado a enrutar a través de herramientas rígidas, puede sonar excesivamente cortante o mecánico, lo que contradice el estándar de servicio de la "banca privada" de alto nivel.29 En contraste, permitir libertad conversacional incrementa la empatía pero invita a la deriva de instrucciones ("instruction drift").  
* **Latencia vs. Control Dual:** La mitigación principal de la industria es el uso de sistemas multicapa (como el patrón Supervisor de 11x.ai o la extracción de voz en segundo plano de Bland AI).21 Separar el entendimiento de la intención en una llamada rápida a un modelo eficiente (como Claude Haiku) y la generación de la respuesta en un modelo profundo (Sonnet) incrementa la seguridad matemática pero añade tiempos de red. Para mitigar esto, los equipos utilizan *streaming* concurrente y la evaluación predictiva en la capa del "edge runtime".  
* **Costos de Token:** Las arquitecturas multi-agente que evalúan estados intermedios consumen significativamente más tokens (hasta 15x más en flujos de investigación extensos) que los prompts de una sola pasada.30 Sin embargo, para entornos de ventas de alto valor, este costo marginal se justifica ampliamente por el incremento drástico en la tasa de conversión libre de alucinaciones.

## **Antipatrones: Prácticas a Evitar Sistemáticamente**

Basado en postmortems y registros de la industria (incluyendo las experiencias de 11x.ai, Anthropic y metodologías de ciberseguridad en LLMs), los siguientes enfoques deben evitarse categóricamente:

1. **El "Megaprompt" Secuencial:** Cargar todo el árbol de decisiones en un único *system prompt* (como las versiones 1 y 2 probadas por Queswa) es un fracaso arquitectónico documentado. Los LLMs diluyen la atención, sufren caídas exponenciales en el cumplimiento a medida que crece la densidad de instrucciones, y fusionan conceptos de diferentes fases.3  
2. **Instrucciones de Bloqueo Negativo:** El uso de reglas como "PROHIBIDO solicitar correo" es contraproducente. Los LLMs operan por atención probabilística; inyectar el concepto de "pedir correo" en el prompt, incluso precedido por una negación, activa los pesos neuronales asociados a esos tokens, aumentando la probabilidad de que el modelo los utilice inadvertidamente. El comportamiento seguro se garantiza omitiendo completamente la información irrelevante del contexto.3  
3. **Depender de RAG para Lógica de Procesos:** La Generación Aumentada por Recuperación (RAG) está diseñada para enriquecer la base ontológica y de conocimiento, pero es letal cuando se usa para guiar el flujo de ejecución. Si se fragmentan reglas de N pasos y se recuperan mediante similitud semántica, el modelo puede recuperar y aplicar el Paso 3 mientras el usuario sigue en el Paso 1\. Las reglas de transición deben estar codificadas de forma dura en la aplicación, no almacenadas como embeddings.13  
4. **Bucle Autónomo Sin Límites (ReAct sin restricciones):** Darle al LLM el objetivo final ("cierra la venta") y esperar que descubra cómo navegar la secuencia causará que el modelo priorice su prior consultivo, ofrezca opciones redundantes y diverja del protocolo estricto.21

## **Implementación y Recomendaciones Arquitectónicas para Queswa**

Para que Queswa logre la experiencia ideal de "11 estrellas" —comportándose como un socio de sala de juntas que honra el proceso con precisión quirúrgica, sin inventar pasos ni recolectar datos KYC innecesarios—, es imperativo trasladar el control de la secuencia del dominio del *Prompt Engineering* al dominio de la *Orquestación de Software*.

Las siguientes recomendaciones detallan cómo reestructurar la plataforma utilizando las capacidades actuales del stack (Next.js Edge, Supabase, y la familia Claude):

### **1\. Migración a una Arquitectura de Máquina de Estados Gobernada por Código**

La responsabilidad de saber en qué paso del cierre se encuentra el usuario debe residir en Supabase, gestionado por Next.js, no en la memoria contextual de Claude.

Se debe implementar una variable de sesión explícita (e.g., closing\_state \= 0, 1, 2, o 3). El router IIFE de Next.js debe interceptar cada mensaje entrante y verificar esta variable antes de ensamblar los bloques del prompt.

### **2\. Aislamiento Radical del Contexto (Graph Prompting)**

La arquitectura de 3 bloques debe alterarse drásticamente en el momento en que se detecta el disparador "cómo inicio" (transición al Estado 1).

* **Supresión de Ruido RAG:** Durante el flujo de cierre (Estados 1 al 3), se debe desactivar o limitar severamente la inyección del Bloque 2 (Contexto RAG). La base de conocimiento general, que podría contener manuales sobre procesos de onboarding o KYC, contamina el espacio de razonamiento del modelo y exacerba el Bug B.  
* **Poda del System Prompt:** El Bloque 1 (system prompt base) de 59KB debe podarse dinámicamente. El modelo no necesita conocer la historia de la empresa ni los procedimientos de posventa cuando su única misión inmediata es extraer un número de horas.

### **3\. Implementación Práctica del Flujo de 3 Pasos**

**Ejecución del Estado 1 (Tiempo):**

* **Bloque 3 (Inyección Dinámica):** *"El usuario desea iniciar el proceso. Asume tu rol de consultor patrimonial de élite. Debes hacer una única pregunta: ¿cuántas horas a la semana puede dedicar a la gestión de su patrimonio? Sé sumamente conciso, profesional y directo. NO ofrezcas alternativas ni des información adicional. Detente inmediatamente después de la pregunta."*  
* **Mitigación del Bug A:** Al no tener visibilidad de manuales extensos ni opciones preconfiguradas, el modelo es incapaz de generar una bifurcación no autorizada ("Hay dos caminos...").

**Transición al Estado 2 (Capitalización) mediante Generative Parsing:**

* Cuando el usuario responde ("Puedo 10 horas"), el sistema enruta la solicitud en paralelo o utiliza *Structured Outputs*.28 Un modelo ligero como Claude Haiku evalúa en segundo plano: *"¿Contiene este mensaje un compromiso de tiempo válido? Extrae el valor numérico."*  
* Si la validación por código es exitosa, la base de datos avanza a closing\_state \= 2\.  
* El contexto se reinicializa. El modelo principal, Claude Sonnet, recibe la instrucción para el Bloque 3: *"El prospecto ha confirmado que dispone de 10 horas. Presenta la siguiente tabla de niveles de capitalización bancaria corporativa: $200, $500 y $1,000 USD. Presenta las opciones con la elegancia de una sala de juntas de alto nivel y pregúntale cuál nivel desea activar. BAJO NINGUNA CIRCUNSTANCIA solicites información personal como nombre, correo o país."* (Aunque los bloqueos negativos deben evitarse en "megaprompts", en contextos micro-optimizados y acotados pueden servir como última línea de defensa).  
* **Mitigación del Bug B:** El modelo ya no asume el paso de "Registro KYC" porque su atención está matemáticamente restringida a la transición de estado inmediata.

**Ejecución del Estado 3 (Handoff):**

* Mediante la misma técnica de evaluación en segundo plano, se extrae la elección del paquete de capitalización.  
* El estado avanza a closing\_state \= 3\.  
* El Bloque 3 se inyecta con el texto *verbatim* del enlace de WhatsApp. El prompt se configura para comportarse estrictamente como un canal de paso de información (pass-through), eliminando la propensión a la alucinación (Bug C) al restringir completamente la creatividad generativa en el último paso.

### **Conclusión**

La transición desde un bot conversacional que "intenta seguir un guion" hacia un agente de inteligencia artificial de nivel empresarial requiere tratar al modelo LLM no como un ente monolítico de toma de decisiones, sino como un co-procesador lingüístico y cognitivo subordinado a un sistema operativo determinista.

Aplicando los principios del *Atlas Reasoning Engine* de Salesforce, los *Procedures* de Intercom y el patrón *Supervisor* demostrado por 11x.ai, Queswa puede dominar su prior psicológico inherente. La externalización de la máquina de estados, combinada con un aislamiento implacable del contexto turno a turno, garantizará que el chatbot ejecute los cierres de N pasos con la certeza inquebrantable de código duro, preservando la sofisticación retórica indispensable para interactuar eficazmente con perfiles ejecutivos de alto patrimonio.

#### **Fuentes citadas**

1. The assistant axis: situating and stabilizing the character of large language models, acceso: abril 4, 2026, [https://www.anthropic.com/research/assistant-axis](https://www.anthropic.com/research/assistant-axis)  
2. Choosing Your AI Engine: ChatGPT vs Claude vs Gemini \- Social Intents, acceso: abril 4, 2026, [https://www.socialintents.com/docs/ai-chatbots/choosing-ai-engine](https://www.socialintents.com/docs/ai-chatbots/choosing-ai-engine)  
3. How Many Instructions Can LLMs Follow at Once? \- arXiv, acceso: abril 4, 2026, [https://arxiv.org/html/2507.11538v1](https://arxiv.org/html/2507.11538v1)  
4. Structured Output as a Full Replacement for Function Calling | by Vitaly Sem | Medium, acceso: abril 4, 2026, [https://medium.com/@virtualik/structured-output-as-a-full-replacement-for-function-calling-430bf98be686](https://medium.com/@virtualik/structured-output-as-a-full-replacement-for-function-calling-430bf98be686)  
5. GraphIF: Enhancing Multi-Turn Instruction Following for Large Language Models with Relation Graph Prompt \- AAAI Publications, acceso: abril 4, 2026, [https://ojs.aaai.org/index.php/AAAI/article/view/40457/44418](https://ojs.aaai.org/index.php/AAAI/article/view/40457/44418)  
6. StructFlowBench: A Structured Flow Benchmark for Multi-turn Instruction Following \- ACL Anthology, acceso: abril 4, 2026, [https://aclanthology.org/2025.findings-acl.486.pdf](https://aclanthology.org/2025.findings-acl.486.pdf)  
7. StructFlowBench: A Structured Flow Benchmark for Multi-turn Instruction Following \- arXiv, acceso: abril 4, 2026, [https://arxiv.org/html/2502.14494v1](https://arxiv.org/html/2502.14494v1)  
8. StructFlowBench: A Structured Flow Benchmark for Multi-turn Instruction Following | Request PDF \- ResearchGate, acceso: abril 4, 2026, [https://www.researchgate.net/publication/389176580\_StructFlowBench\_A\_Structured\_Flow\_Benchmark\_for\_Multi-turn\_Instruction\_Following](https://www.researchgate.net/publication/389176580_StructFlowBench_A_Structured_Flow_Benchmark_for_Multi-turn_Instruction_Following)  
9. StructFlowBench: A Structured Flow Benchmark for Multi-turn Instruction Following \- OpenReview, acceso: abril 4, 2026, [https://openreview.net/pdf?id=ujpf72RrbJ](https://openreview.net/pdf?id=ujpf72RrbJ)  
10. GraphIF: Enhancing Multi-Turn Instruction Following for Large Language Models with Relation Graph Prompt \- arXiv, acceso: abril 4, 2026, [https://arxiv.org/html/2511.10051v2](https://arxiv.org/html/2511.10051v2)  
11. Interpretable and Robust Dialogue State Tracking via Natural Language Summarization with LLMs \- arXiv, acceso: abril 4, 2026, [https://arxiv.org/html/2503.08857v1](https://arxiv.org/html/2503.08857v1)  
12. Inside the Brain of Agentforce: Revealing the Atlas Reasoning Engine, acceso: abril 4, 2026, [https://engineering.salesforce.com/inside-the-brain-of-agentforce-revealing-the-atlas-reasoning-engine/](https://engineering.salesforce.com/inside-the-brain-of-agentforce-revealing-the-atlas-reasoning-engine/)  
13. Is Context Engineering the Key to Autonomous AI Agents, Or a New Attack Surface?, acceso: abril 4, 2026, [https://www.salesforce.com/blog/context-engineering/](https://www.salesforce.com/blog/context-engineering/)  
14. Innovative Atlas Reasoning Engine in Salesforce Agentforce, acceso: abril 4, 2026, [https://thinkbeyond.cloud/blog/atlas-reasoning-engine-in-agentforce/](https://thinkbeyond.cloud/blog/atlas-reasoning-engine-in-agentforce/)  
15. From resolutions to outcomes: Evolving how Fin delivers value \- The Intercom Blog, acceso: abril 4, 2026, [https://www.intercom.com/blog/from-resolutions-to-outcomes-evolving-how-fin-delivers-value/](https://www.intercom.com/blog/from-resolutions-to-outcomes-evolving-how-fin-delivers-value/)  
16. Fin conversations ep1: The Secret to Sustaining 75%+ AI Resolution Rates \- Intercom, acceso: abril 4, 2026, [https://www.intercom.com/blog/videos/the-secret-to-sustaining-75-ai-resolution-rates/](https://www.intercom.com/blog/videos/the-secret-to-sustaining-75-ai-resolution-rates/)  
17. Fin Procedures explained | Intercom Help, acceso: abril 4, 2026, [https://www.intercom.com/help/en/articles/12495167-fin-procedures-explained](https://www.intercom.com/help/en/articles/12495167-fin-procedures-explained)  
18. Transitioning from Fin Tasks to Procedures | Intercom Help, acceso: abril 4, 2026, [https://www.intercom.com/help/en/articles/13459670-transitioning-from-fin-tasks-to-procedures](https://www.intercom.com/help/en/articles/13459670-transitioning-from-fin-tasks-to-procedures)  
19. 2026 customer service planning series: Vol. 03 \- The Intercom Blog, acceso: abril 4, 2026, [https://www.intercom.com/blog/inside-the-ai-first-support-team/](https://www.intercom.com/blog/inside-the-ai-first-support-team/)  
20. Fin over email: How we built a multichannel AI agent \- The Intercom Blog, acceso: abril 4, 2026, [https://www.intercom.com/blog/fin-over-email-how-we-built/](https://www.intercom.com/blog/fin-over-email-how-we-built/)  
21. 11x: Rebuilding an AI SDR Agent with Multi-Agent Architecture for Enterprise Sales Automation \- ZenML LLMOps Database, acceso: abril 4, 2026, [https://www.zenml.io/llmops-database/rebuilding-an-ai-sdr-agent-with-multi-agent-architecture-for-enterprise-sales-automation](https://www.zenml.io/llmops-database/rebuilding-an-ai-sdr-agent-with-multi-agent-architecture-for-enterprise-sales-automation)  
22. Inside Retell AI Receptionist's Large Language Model Intent Engine: 92% Accuracy and 50% Fewer Unnecessary Escalations, acceso: abril 4, 2026, [https://www.retellai.com/resources/retell-ai-receptionist-understands-calls-better](https://www.retellai.com/resources/retell-ai-receptionist-understands-calls-better)  
23. Module 3 | Lesson 1: Building Your First Pathway \- Bland University, acceso: abril 4, 2026, [https://university.bland.ai/modules/3/lesson-1](https://university.bland.ai/modules/3/lesson-1)  
24. Conversational Pathways \- AI Agent Platform by Bland, acceso: abril 4, 2026, [https://www.bland.ai/product/conversational-pathways](https://www.bland.ai/product/conversational-pathways)  
25. Prompt-Based vs. Conversational Pathways: Choosing the Right Approach \- Retell AI, acceso: abril 4, 2026, [https://www.retellai.com/blog/prompt-based-vs-conversational-pathways-choosing-the-right-approach](https://www.retellai.com/blog/prompt-based-vs-conversational-pathways-choosing-the-right-approach)  
26. Making LLMs boring: From chatbots to semantic processors | Red Hat Developer, acceso: abril 4, 2026, [https://developers.redhat.com/articles/2026/02/04/making-llms-boring-chatbots-semantic-processors](https://developers.redhat.com/articles/2026/02/04/making-llms-boring-chatbots-semantic-processors)  
27. Structured model outputs | OpenAI API, acceso: abril 4, 2026, [https://developers.openai.com/api/docs/guides/structured-outputs](https://developers.openai.com/api/docs/guides/structured-outputs)  
28. The guide to structured outputs and function calling with LLMs \- Agenta, acceso: abril 4, 2026, [https://agenta.ai/blog/the-guide-to-structured-outputs-and-function-calling-with-llms](https://agenta.ai/blog/the-guide-to-structured-outputs-and-function-calling-with-llms)  
29. Agent Control Patterns — Part 2: Reflection — A Simple Way to Improve Answer Quality, acceso: abril 4, 2026, [https://pub.towardsai.net/agent-control-patterns-part-2-reflection-a-simple-way-to-improve-answer-quality-9d039cfd5da8](https://pub.towardsai.net/agent-control-patterns-part-2-reflection-a-simple-way-to-improve-answer-quality-9d039cfd5da8)  
30. How we built our multi-agent research system \\ Anthropic, acceso: abril 4, 2026, [https://www.anthropic.com/engineering/multi-agent-research-system](https://www.anthropic.com/engineering/multi-agent-research-system)  
31. Two Types of Ontologies Your AI Agents Need to Be Trustworthy \- Salesforce, acceso: abril 4, 2026, [https://www.salesforce.com/blog/structural-and-descriptive-ontology/](https://www.salesforce.com/blog/structural-and-descriptive-ontology/)