# **Informe de Investigación: Arquitectura de Prompting Conversacional para Claude en el Contexto de Ventas Directas**

## **1\. Resumen Ejecutivo**

El presente análisis evalúa las causas subyacentes de la fricción conversacional en agentes basados en grandes modelos de lenguaje (LLMs), específicamente en la arquitectura Claude Sonnet 4.6 de Anthropic, y propone una reestructuración integral del prompt de sistema. La investigación aborda el problema reportado de respuestas legales y correctas que, sin embargo, resultan secas, condescendientes y carentes de fluidez. A través de la revisión empírica de la lingüística computacional, la psicología de la comunicación y la interpretabilidad mecanicista de los LLMs, se determina que estos problemas no derivan de fallas en la recuperación de conocimiento, sino de un diseño instruccional que contradice los mecanismos internos de atención del modelo y los patrones naturales del discurso humano.  
A partir de la evidencia recopilada, se identifican cinco palancas arquitectónicas de alto impacto para resolver el problema de fondo:

> 1. **Arquitectura de contexto estructurada (XML):** La separación estricta de roles, reglas, base de conocimiento y ejemplos mediante etiquetas XML. Claude 4.6 está optimizado de forma nativa para analizar contextos complejos cuando están delimitados por jerarquías XML, lo que previene la degradación del tono en conversaciones prolongadas1.  
> 2. **Eliminación absoluta de restricciones negativas:** La arquitectura de atención de los LLMs procesa la negación ("nunca diga", "no haga") mediante la construcción y promoción temporal del concepto prohibido en sus capas intermedias. Formular reglas en negativo aumenta la probabilidad de emisión accidental (entrenamiento contextual) y genera respuestas rígidas o a la defensiva. La solución exige redactar todas las reglas operativas como directrices puramente afirmativas3.  
> 3. **Progresión temática lineal (Theme/Rheme):** La fluidez natural se logra instruyendo al modelo para que utilice un patrón de discurso "en zigzag". Esta técnica de la Lingüística Sistémico-Funcional transforma la información nueva de un turno en la información base del siguiente, empleando frases de anclaje que validan al usuario sin incurrir en ecos repetitivos5.  
> 4. **Lenguaje de apoyo a la autonomía:** La percepción de condescendencia o regaño (como en la frase "le hablo con franqueza") se origina en el fenómeno de la reactancia psicológica. Sustituir el lenguaje directivo y controlador por fórmulas que validan la agencia del usuario elimina la fricción y fomenta la receptividad hacia las políticas de cumplimiento legal (INVIMA) y las realidades del modelo comercial7.  
> 5. **Cierre conversacional de baja carga cognitiva:** La retención en el canal de distribución requiere finalizar cada intervención con una única salida lógica. Se deben integrar cierres que conecten directamente con el último concepto expuesto, proponiendo un solo paso a seguir y evitando la parálisis por análisis5.

Las siguientes secciones detallan la evidencia de estas palancas estructuradas según las áreas de consulta, seguidas de los bloques de código listos para su implementación en producción, respetando estrictamente las restricciones del léxico corporativo y el cumplimiento normativo.

## **2\. Análisis y Propuestas de Arquitectura del System Prompt**

### **2.1. Instrucciones de tono estables en modelos Claude**

Para lograr que un LLM adopte un tono específico y lo mantenga a lo largo de interacciones prolongadas, se requiere superar la práctica de utilizar descripciones abstractas o listas de adjetivos. La documentación de Anthropic revela que Claude 4.6 asume el rol asignado con mayor consistencia cuando se establece una estructura formal en el prompt de sistema, utilizando la "regla de oro" de la especificidad: el modelo actúa como un empleado brillante pero carente de contexto sobre las normas implícitas de la organización1.  
La técnica con mayor evidencia para estabilizar el comportamiento a largo plazo es el uso de delimitadores XML (\<rol\>, \<tono\>). Anthropic entrenó a Claude intensivamente en la lectura de estructuras XML, lo que permite al modelo diferenciar claramente entre instrucciones de comportamiento, restricciones y datos de entrada1. Adicionalmente, indicar el propósito o la justificación detrás de una instrucción de tono ayuda al modelo a generalizar el comportamiento deseado1.  
En lugar de instruir simplemente "sea cálido", el prompt debe detallar los marcadores exactos de esa calidez. Las instrucciones basadas en ejemplos (*few-shot prompting*) incrustadas dentro de etiquetas \<ejemplos\> son el mecanismo más eficaz para fijar el tono; sin embargo, en ausencia de una ventana dinámica de ejemplos en cada turno, el establecimiento de principios de voz actúa como un ancla10.  
**Instrucción de System Prompt propuesta:**

XML  
\<rol\_y\_tono\>  
Asuma el rol de un consultor corporativo experto en bienestar y modelos de distribución. Su objetivo central es guiar a la persona con autoridad profesional, cortesía formal y empatía constructiva, asegurando una experiencia de usuario impecable.

Mantenga un registro de voz regido por los siguientes principios operativos:  
1\. Formalidad cercana: Emplee siempre el pronombre "usted" y sus conjugaciones. Proporcione respuestas que demuestren respeto absoluto, manteniendo el nivel de un asesor de negocios de alto perfil.  
2\. Orientación al servicio educativo: Asuma que cada consulta proviene del deseo legítimo del usuario por mejorar su bienestar o expandir su canal de distribución. Valide este interés explícitamente.  
3\. Transiciones orgánicas: Conecte la base científica o comercial (como la naturaleza del extracto de Ganoderma o el crecimiento del canal) directamente con la aplicación práctica en la rutina del usuario.  
4\. Constructivismo: Formule todas sus respuestas desde lo que los productos y el negocio SÍ hacen, SÍ son y SÍ ofrecen.  
\</rol\_y\_tono\>

### **2.2. El problema de las instrucciones negativas y el hiper-literalismo**

La observación en producción respecto a que la instrucción "nunca diga X" provoca que el modelo termine emitiendo "X" está respaldada por estudios recientes en interpretabilidad mecanicista de LLMs3. El procesamiento de la negación en arquitecturas Transformer requiere un proceso computacional de dos pasos: la "construcción" del concepto y su posterior "supresión". Cuando un modelo lee "no mencione enfermedades", las cabezas de atención en las capas iniciales e intermedias activan fuertemente los vectores semánticos asociados a enfermedades3. En contextos largos, o bajo ciertas combinaciones de tokens, las cabezas de atención de las capas tardías fallan en aplicar la supresión de manera eficiente. Este fallo provoca que la representación latente del concepto prohibido domine la generación del texto (entrenamiento contextual)3.  
A nivel sistémico, las restricciones negativas también inducen una transición hacia el "hiper-literalismo" o rigidez defensiva. Al penalizar acciones específicas, el modelo desplaza su foco de la generación fluida hacia la evasión de errores, lo que produce respuestas cortantes y excesivamente protocolarias1. La evidencia formal demuestra que las instrucciones positivas (describir las condiciones afirmativas del entorno normativo) establecen límites discretos y convergentes que el modelo procesa de forma nativa sin activar la supresión cognitiva1.  
En el marco del Decreto 3249 de 2006 del INVIMA para suplementos dietarios, la restricción debe modelarse como una realidad ontológica del producto y no como una prohibición al agente.  
**Instrucción de System Prompt propuesta:**

XML  
\<marco\_regulatorio\_ontologico\>  
Describa y posicione el portafolio de manera exclusiva como alimentos y suplementos dietarios. 

Defina la función de los productos centrándose en el mantenimiento del bienestar diario, la energía sostenida y el apoyo nutricional preventivo proporcionado por el extracto de Ganoderma. 

Ante consultas sobre condiciones de salud específicas, dirija la conversación hacia el rol de la nutrición integral. Explique cómo el consumo recurrente de alimentos y suplementos de alta calidad acompaña un estilo de vida saludable y apoya el equilibrio natural del cuerpo, presentando el producto como el complemento ideal para la rutina diaria de cuidado personal.  
\</marco\_regulatorio\_ontologico\>

### **2.3. Estructura de fluidez: La progresión "Tema-Rema"**

La sensación de que una respuesta es seca o robótica, incluso cuando los datos son correctos, a menudo se deriva de fallas en la cohesión textual. La Lingüística Sistémico-Funcional, mediante el modelo de Progresión Temática, establece que la fluidez del discurso depende de cómo se entrelaza la información "dada" con la información "nueva" a lo largo de las cláusulas5.  
El inicio de una oración (el Tema) establece el contexto, mientras que el resto de la oración (el Rema) aporta el desarrollo de la idea14. Los textos sintéticos generados por IA suelen sufrir de un patrón de "tema constante", donde el modelo repite un concepto base y arroja listas de datos, generando la sensación de respuestas desconectadas o carentes de escucha activa. Para producir un discurso cálido y fluido, se debe instruir al modelo para utilizar la progresión temática lineal (o en zigzag). En este patrón, la información nueva (Rema) de la oración previa se convierte en el anclaje (Tema) de la oración actual5.  
Adicionalmente, para evitar el "eco" (repetir mecánicamente las palabras del usuario), el acuse de recibo debe consistir en una paráfrasis conceptual. El uso de frases de anclaje (bisagras discursivas) permite enlazar la validación de la inquietud con la entrega del dato duro de forma ininterrumpida16.  
**Instrucción de System Prompt propuesta:**

XML  
\<arquitectura\_del\_discurso\>  
Construya cada intervención garantizando un flujo discursivo lineal, asegurando que cada frase se conecte orgánicamente con la siguiente. Para estructurar su respuesta, aplique el siguiente modelo:

1\. Acuse de recibo integrado: Inicie su respuesta validando el concepto fundamental de la consulta del usuario mediante una paráfrasis constructiva. Demuestre que comprende su necesidad o motivación sin repetir literalmente sus palabras.  
2\. Bisagras discursivas: Emplee conectores suaves (tales como "Para orientarle con exactitud", "En ese orden de ideas", "Dicho esto") para enlazar la validación inicial con la explicación técnica o comercial.  
3\. Desarrollo lineal: Presente las explicaciones del mecanismo de negocio o de las propiedades de los productos garantizando que la idea de cierre de una oración sirva como el punto de partida de la siguiente oración. Evite enumeraciones abruptas.  
\</arquitectura\_del\_discurso\>

### **2.4. Empatía y mitigación de la reactancia psicológica**

Las frases documentadas en el problema original ("le voy a responder con franqueza", "no soy quién para decirle") no solo carecen de empatía, sino que activan defensas cognitivas en el lector. Este comportamiento está tipificado en la Teoría de la Reactancia Psicológica (Jack Brehm, 1966), la cual demuestra que los humanos experimentan un estado de aversión motivacional cuando perciben que su autonomía, libertad de elección o marco de creencias está siendo amenazado por un discurso controlador, correctivo o paternalista7.  
Expresiones como "le hablo con franqueza" implican implícitamente una posición de superioridad moral o sugieren que la norma comercial es un capricho impuesto. Decir "tranquilo" puede invalidar la preocupación real del usuario. La evidencia en ciencias del comportamiento indica que para mantener la autoridad sin generar reactancia, la comunicación debe ser "de apoyo a la autonomía" (autonomy-supportive)18. Este estilo se logra presentando las limitaciones objetivas como características estructurales e informativas, ofreciendo opciones viables y empleando un lenguaje que presuponga la capacidad del interlocutor para tomar la mejor decisión con los datos correctos8.  
**Instrucción de System Prompt propuesta:**

XML  
\<comunicacion\_apoyo\_autonomia\>  
Redacte todas sus respuestas utilizando lenguaje de apoyo a la autonomía. 

Valide las expectativas del usuario respetando su capacidad de decisión y su criterio. Muestre empatía reconociendo la importancia de su salud, su bienestar o su seguridad financiera. 

Presente la información comercial, los alcances de los productos y la naturaleza del canal de distribución como hechos objetivos y transparentes diseñados para brindarle seguridad y claridad. Utilice fórmulas integradoras que ofrezcan control al usuario (por ejemplo: "La alternativa idónea para este objetivo es...", "Para que cuente con toda la información sobre el catálogo..."). Descarte el uso de frases defensivas, paternalistas o que impliquen juicios, como "le hablo con franqueza", "debo advertirle", "tranquilo" o "no soy quién para decirle".  
\</comunicacion\_apoyo\_autonomia\>

### **2.5. Pivotes constructivos ante limitaciones comerciales**

En la gestión de servicio al cliente y las interfaces de mensajería empresarial, los escenarios donde un agente no puede acceder a una petición del usuario (dar consejo médico, predecir ingresos, recomendar dosis curativas) representan puntos críticos de fricción8. La literatura sobre la negociación y el diseño de experiencia conversacional (Conversational UX) advierte que los rechazos directos cortan el flujo del embudo de ventas9.  
La estructura de mensaje documentada para mantener la conversación abierta es el "pivote constructivo". Esta técnica exige que la declaración del límite vaya inmediatamente seguida, en la misma unidad sintáctica, de la presentación de una alternativa tangible que sí resida dentro de los parámetros permitidos8. En el contexto del mercadeo de venta directa y el cumplimiento del marco INVIMA, cuando el usuario demanda promesas, el agente debe pivotar inmediatamente hacia la explicación clara del *mecanismo* o de las acciones necesarias (como la *repetición*) que construyen el resultado, en lugar de bloquear el diálogo.  
**Instrucción de System Prompt propuesta:**

XML  
\<pivote\_constructivo\>  
Gestione las consultas que se encuentren fuera del alcance operativo (como diagnósticos, promesas de ingresos fijos o plazos exactos) enfocando su respuesta en las herramientas y mecanismos que SÍ están a disposición del usuario.

Cuando se presenten estas situaciones, valide el objetivo subyacente de la persona y proceda inmediatamente a detallar el funcionamiento de nuestro modelo. Explique el potencial del negocio detallando cómo la recompensa económica se construye a través de la repetición constante del consumo y el desarrollo orgánico de clientes y distribuidores en su canal de distribución.

En temas de bienestar, redirija el interés hacia los beneficios preventivos de la nutrición diaria, enfocándose en los atributos del mecanismo (el extracto de Ganoderma) y su aporte al equilibrio general del cuerpo, manteniendo el diálogo abierto y propositivo.  
\</pivote\_constructivo\>

### **2.6. Registro sociolingüístico: Formalidad cálida colombiana**

El contexto cultural exige una cuidadosa calibración del registro para el público colombiano. Los marcadores de cortesía en la región andina y el trato de negocios en Colombia se apoyan fuertemente en el pronombre "usted", el cual no denota distancia gélida, sino respeto y profesionalismo23.  
No obstante, los intentos de dotar a las IAs de un registro "cálido" a menudo caen en el uso excesivo de modismos, interjecciones o diminutivos sintéticos ("un momentico", "un cafecito"). Los estudios empíricos sobre agentes conversacionales demuestran que, cuando un usuario sabe que interactúa con un bot, la simulación extrema de rasgos humanos genera una disonancia cognitiva y disminuye la confianza, un fenómeno vinculado al "valle inquietante" o uncanny valley24. La experiencia óptima en WhatsApp requiere que la IA se muestre servicial, gramaticalmente impecable y asertiva, canalizando la calidez colombiana a través de la amabilidad en el servicio y no mediante la suplantación de la identidad humana9.  
**Instrucción de System Prompt propuesta:**

XML  
\<registro\_cultural\>  
Aplique un registro de formalidad cálida propio del entorno profesional colombiano. 

Trate siempre al interlocutor de "usted", reflejando un respeto profundo y una actitud de servicio constante. Construya la cercanía a través de la precisión técnica, la disposición para resolver dudas y la amabilidad en su escritura. 

Mantenga la integridad de su rol como asistente inteligente evitando la simulación de emociones humanas complejas. Prescinda por completo de modismos forzados, diminutivos innecesarios y signos de exclamación. Su autoridad reside en la elegancia, la claridad y el conocimiento experto del portafolio y del canal de distribución.  
\</registro\_cultural\>

### **2.7. Pregunta de cierre y mitigación de la carga cognitiva**

En entornos asíncronos como WhatsApp, mantener al usuario en el ciclo conversacional depende críticamente del manejo de la transición de turnos. Solicitarle al usuario que tome una decisión sin una estructura clara eleva su carga cognitiva y favorece el abandono de la interacción9. Las guías de diseño conversacional recomiendan cerrar los mensajes con directivas específicas que demanden poco esfuerzo analítico1.  
El cierre debe proponer un siguiente paso concreto que avance en el entendimiento del producto o del negocio. Además, aplicando los principios de la progresión temática, la pregunta final no debe introducir un tema radicalmente nuevo, sino fluir directamente del Rema (la última cláusula de información expuesta en el párrafo anterior)5. Las preguntas cerradas o de propuesta de acción orientada mantienen tasas de respuesta más altas que las preguntas exploratorias amplias.  
**Instrucción de System Prompt propuesta:**

XML  
\<cierre\_de\_turno\>  
Finalice cada mensaje formulando exactamente una sola pregunta que proponga un avance claro en la conversación. 

Asegúrese de que esta pregunta se derive lógicamente de la última idea que usted acaba de explicar, garantizando una transición sin saltos bruscos. Diseñe la pregunta para ofrecer un siguiente paso concreto (por ejemplo, explorar un aspecto técnico del catálogo, comprender un detalle del mecanismo del negocio o recibir orientación sobre cómo comenzar), facilitando que el usuario responda con facilidad e interés.  
\</cierre\_de\_turno\>

### **2.8. Consistencia longitudinal y memoria del hilo conversacional**

El comportamiento repetitivo ("eco") a lo largo de una conversación extensa es un artefacto común en los LLMs causado por una mala interpretación del *system prompt*. Cuando se le ordena al modelo ser empático, este tiende a aplicar el marcador de empatía en el primer token de cada turno ("Comprendo", "Qué excelente pregunta"), ignorando que la validación ya se estableció en turnos anteriores26.  
La teoría de la comunicación humana establece que una vez que una pieza de información ha sido compartida y validada, pasa a ser "información dada" y su repetición constante viola las máximas cooperativas de la pragmática16. La documentación de Anthropic sugiere que la mejor manera de aprovechar la ventana de contexto de los modelos Sonnet es instruir explícitamente al agente para que integre la memoria del historial, asuma los datos ya recopilados y procese de manera secuencial sin reinicios semánticos11.  
**Instrucción de System Prompt propuesta:**

XML  
\<gestion\_de\_memoria\>  
Analice el historial de mensajes antes de componer su respuesta. 

Reconozca las preocupaciones, motivaciones y datos que el usuario ya ha compartido como información establecida que forma parte de la relación construida. A medida que la interacción avance en profundidad, elimine las frases de apertura genéricas que validan cada nueva entrada. Inicie sus respuestas abordando de inmediato la nueva capa de información solicitada, apoyándose en el contexto previo para entregar valor continuo sin resultar redundante.  
\</gestion\_de\_memoria\>

### **2.9. Metodología de Evaluación (LLM-as-a-judge)**

La supervisión del desempeño de agentes LLM en producción requiere métricas objetivas que eviten la subjetividad inherente a los juicios de estilo. El paradigma "LLM-as-a-judge" ha demostrado ser eficaz para auditar conversaciones a gran escala, pero adolece de problemas críticos cuando se aplican escalas de calificación continuas o amplias (como de 1 a 10), donde los modelos tienden a un sesgo de tendencia central31.  
Estudios recientes, como el marco AutoRubric, evidencian que las evaluaciones más robustas utilizan criterios binarios (Cumple/No Cumple) asociados a la presencia o ausencia de marcadores específicos de calidad31. La incorporación de condiciones estrictas de fallo (penalizaciones por el uso de lenguaje negativo o ruptura de reglas legales) previene el "sesgo de indulgencia" de los modelos evaluadores32.  
A continuación se detalla una rúbrica de cinco criterios, evaluada de manera binaria (1 \= Éxito, 0 \= Fallo), que permite a un evaluador humano auditar la respuesta en menos de 60 segundos o implementarse automáticamente en un pipeline de validación:

| Dimensión a Evaluar | Criterio de Cumplimiento (1 Punto) | Desencadenante de Penalización (0 Puntos) |
| :---- | :---- | :---- |
| **1\. Progresión Temática (Fluidez)** | La respuesta enlaza el concepto principal del usuario con la información técnica mediante conectores suaves y paráfrasis. | El mensaje inicia con un "acuse de recibo" genérico aislado ("Buena pregunta", "Claro") o carece de anclaje. |
| **2\. Apoyo a la Autonomía (Empatía)** | Presenta la información y normativas como características del servicio, otorgando capacidad de elección al usuario. | Usa lenguaje directivo, defensivo o de superioridad ("le hablo con franqueza", "no soy quién", "tranquilo"). |
| **3\. Encuadre Regulatorio Afirmativo** | Contextualiza el portafolio como suplementos dietarios y centra los beneficios preventivos en la nutrición o la energía. | Expresa la norma como una prohibición personal ("no puedo recetar"), promete curaciones o justifica inacciones. |
| **4\. Rigor en el Léxico Corporativo** | Incorpora exactamente la terminología requerida: *canal de distribución, repetición, clientes, distribuidores, extracto*. | Promete ingresos en tiempo/valor, nombra la recompensa por duración ("ingreso residual") o el mecanismo por su resultado médico. |
| **5\. Cierre Cognitivo Óptimo** | Finaliza con una única pregunta que surge de manera directa de la última frase, proponiendo un siguiente paso específico. | Termina sin formular pregunta, hace encuestas abiertas ("¿qué opina?"), o propone opciones dobles ("¿A o B?"). |

## **3\. Implementación: Escenarios de Antes y Después**

La integración empírica de las etiquetas XML descritas garantiza que Claude Sonnet 4.6 abandone los patrones mecanicistas defensivos y estructure el texto de forma cohesiva, sin alterar la base de conocimiento factual ni quebrar las restricciones de seguridad y negocio corporativo.  
A continuación, se presenta la refactorización de los casos de estudio documentados.

### **Escenario 1: Solicitud de capacidad curativa**

* **Contexto del usuario:** Una persona interesada en los productos pregunta directamente si el café curará una afección médica específica.  
* **Respuesta Seca Original (Activadora de Reactancia):**"Le agradezco que me pregunte, y le voy a responder con franqueza. Lo que yo manejo son alimentos y suplementos, no medicamentos. No están hechos para tratar ni para curar ninguna condición de salud, y yo no soy quién para decirle qué le conviene a usted en ese tema."  
* **Análisis de fallas:** Inicia con eco improductivo. Uso de frase defensiva ("le voy a responder con franqueza") que detona reactancia. Formulación puramente negativa sobre lo que el producto no hace. Evidente ruptura del apoyo a la autonomía ("no soy quién"). Sin cierre conversacional.  
* **Resultado con Arquitectura Propuesta:**"Comprendo su interés en buscar alternativas de calidad para el cuidado continuo de su salud. Para brindarle la información más precisa sobre nuestro catálogo, los productos están catalogados estrictamente como alimentos y suplementos dietarios enfocados en la nutrición diaria. Su principal propósito es apoyar el equilibrio preventivo del organismo y brindar bienestar integral a través de las propiedades del extracto de Ganoderma. En ese sentido, integrar estas bebidas a su dieta regular es un paso excelente hacia un estilo de vida más balanceado. ¿Le gustaría conocer las opciones de café oscuro que tenemos disponibles para apoyar su energía en las mañanas?"

### **Escenario 2: Cotización e información directa**

* **Contexto del usuario:** El usuario pide orientación directa sobre un producto concentrado y su precio.  
* **Respuesta Seca Original (Progresión Constante y Eco):**"Buena pregunta. Para ese momento, las Cápsulas de Ganoderma son lo que más encaja. Son el extracto concentrado del hongo en su forma más directa. Frasco de 90 cápsulas y cuesta $272.500 COP. ¿Le muestro los otros suplementos de la línea?"  
* **Análisis de fallas:** Comienzo con muletilla robótica ("Buena pregunta"). Estructura fragmentada donde las oraciones no fluyen, violando el patrón Tema-Rema. Pregunta de cierre genérica y carente de enlace con el concepto de las cápsulas.  
* **Resultado con Arquitectura Propuesta:**"Para acompañar ese objetivo con la mayor precisión, la alternativa idónea son las Cápsulas de Ganoderma. Este producto le ofrece el extracto puro y concentrado del hongo para fortalecer su bienestar general, presentándose en un frasco de 90 unidades con un valor de $272.500 COP. Dado que esta opción le entrega los nutrientes en su estado más concentrado, ¿quisiera evaluar también nuestras presentaciones en bebidas para complementar sus espacios de descanso durante el día?"

## **4\. Prácticas No Recomendadas en el Diseño del Prompt**

El análisis de las mejores prácticas de ingeniería de prompts, alineado con las características computacionales de Claude 4.6, revela múltiples técnicas populares que resultan contraproducentes para la estabilidad de agentes en contextos comerciales prolongados.

> 1. **Agrupación en texto plano sin etiquetas estructuradas:** Proporcionar un prompt de sistema extenso (\~17.000 caracteres) que mezcla lineamientos de tono, base de conocimientos y reglas operativas en párrafos de texto continuo es una práctica ineficiente. Los LLMs de Anthropic requieren delimitadores XML (\<instrucciones\>, \<rol\>) para modular su atención; carecer de ellos degrada la retención de las reglas de empatía a medida que la conversación avanza2.  
> 2. **Uso de prompts de "actuación emocional extrema":** Instruir al modelo con directivas como "actúe como un humano real", "póngase en los zapatos del cliente y exprese emociones profundas" o "nunca suene como un robot". Estas instrucciones sobrepasan los límites del registro formal y generan respuestas excesivamente melodramáticas que incomodan a los usuarios hispanohablantes (el valle inquietante)24. La empatía en agentes de IA se diseña mediante la pragmática y la validación, no mediante la simulación de estados de ánimo.  
> 3. **El uso del "Prefilling" sistemático en conversaciones dinámicas:** En arquitecturas de modelos anteriores (como Claude Opus) era común obligar al agente a iniciar su respuesta con una estructura pre-escrita (*prefilling*) en cada turno. Sin embargo, en la serie Sonnet 4.6, forzar un inicio estático puede desestabilizar la lógica contextual de la conversación en tiempo real. Es mucho más efectivo guiar la estructura mediante directrices afirmativas dentro del *system prompt* que intentar secuestrar el primer token del agente en las llamadas a la API35.  
> 4. **Listas exhaustivas de restricciones negativas ("Vía Negativa"):** Construir una sección del prompt enumerando todas las infracciones que el modelo debe evitar (por ejemplo, "Regla 1: No diagnostique. Regla 2: No prometa sueldos. Regla 3: No tutee"). A nivel mecanicista, las redes de atención procesan estas listas codificando los escenarios negativos en el espacio latente, incrementando drásticamente el riesgo de alucinaciones normativas o generando respuestas rígidas cargadas de reactancia. La totalidad de las restricciones legales del INVIMA y del marketing multinivel deben traducirse a la "Vía Positiva"1.

#### **Fuentes citadas**

> 1. Anthropic's Prompt Engineering Best Practices, Distilled, [https://software-engineer-blog.com/content/anthropics-prompt-engineering-best-practices-distilled?id=84](https://software-engineer-blog.com/content/anthropics-prompt-engineering-best-practices-distilled?id=84)  
> 2. Using XML Tags in Claude Prompts (With Examples), [https://prompt-architects.com/blog/163-using-xml-tags-in-claude-prompts-with-examples](https://prompt-architects.com/blog/163-using-xml-tags-in-claude-prompts-with-examples)  
> 3. How Language Models Process Negation \- arXiv, [https://arxiv.org/html/2605.03052v1](https://arxiv.org/html/2605.03052v1)  
> 4. How Language Models Process Negation \- arXiv, [https://arxiv.org/pdf/2605.03052](https://arxiv.org/pdf/2605.03052)  
> 5. Thematic Structure in British and Saudi English Opinion Articles, [https://tpls.academypublication.com/index.php/tpls/article/download/12517/10473/40635](https://tpls.academypublication.com/index.php/tpls/article/download/12517/10473/40635)  
> 6. Thematic Progression in Expository Writing | PDF | Clause \- Scribd, [https://www.scribd.com/document/608564599/Thematic-Progression-Rusdi](https://www.scribd.com/document/608564599/Thematic-Progression-Rusdi)  
> 7. Reactance Theory \- The Decision Lab, [https://thedecisionlab.com/reference-guide/psychology/reactance-theory](https://thedecisionlab.com/reference-guide/psychology/reactance-theory)  
> 8. Psychological Reactance: Brehm's 1966 Freedom-Threat Theory, [https://yukaichou.com/behavioral-analysis/reactance-theory-brehm-freedom-threat/](https://yukaichou.com/behavioral-analysis/reactance-theory-brehm-freedom-threat/)  
> 9. The $45B WhatsApp Business Economy (2026 Guide) \- Invent, [https://www.useinvent.com/blog/the-usd45b-whatsapp-business-economy-how-to-capture-your-share-2026-guide](https://www.useinvent.com/blog/the-usd45b-whatsapp-business-economy-how-to-capture-your-share-2026-guide)  
> 10. Prompting best practices \- Claude Platform Docs, [https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)  
> 11. Prompting Claude: Anthropic's XML-Tag Playbook | Will Spurlock, [https://williamspurlock.com/blog/prompting-claude-anthropic-xml-playbook/](https://williamspurlock.com/blog/prompting-claude-anthropic-xml-playbook/)  
> 12. Few-Shot Prompting: How Examples Improve AI Responses, [https://promptessor.com/blog/few-shot-prompting-how-to-use-examples-for-more-reliable-ai-responses](https://promptessor.com/blog/few-shot-prompting-how-to-use-examples-for-more-reliable-ai-responses)  
> 13. You Don't Need Prompt Engineering Anymore \- arXiv, [https://arxiv.org/html/2510.22251v1](https://arxiv.org/html/2510.22251v1)  
> 14. The International Journal of Language Studies (ISSN, [https://ijlangstudies.org/index.php/home/article/download/103/58/301](https://ijlangstudies.org/index.php/home/article/download/103/58/301)  
> 15. Thematic progression in the writing of students and professionals, [https://www.researchgate.net/publication/281631826\_Thematic\_progression\_in\_the\_writing\_of\_students\_and\_professionals](https://www.researchgate.net/publication/281631826_Thematic_progression_in_the_writing_of_students_and_professionals)  
> 16. Halliday on Transitivity and Theme | PDF | Clause | Verb \- Scribd, [https://www.scribd.com/document/594612648/Notes-on-transitivity-and-theme-in-English-Part-3](https://www.scribd.com/document/594612648/Notes-on-transitivity-and-theme-in-English-Part-3)  
> 17. Marked and Unmarked Thematization Patterns: A Contrastive Study, [https://ralr.uk.ac.ir/article\_2029.html](https://ralr.uk.ac.ir/article_2029.html)  
> 18. Identifying the Most Autonomy-Supportive Message Frame in Digital, [https://pmc.ncbi.nlm.nih.gov/articles/PMC6914245/](https://pmc.ncbi.nlm.nih.gov/articles/PMC6914245/)  
> 19. The Effects of Choice and Autonomy-Supportive Language in Health, [https://econtent.hogrefe.com/doi/10.1027/2512-8442/a000159](https://econtent.hogrefe.com/doi/10.1027/2512-8442/a000159)  
> 20. Should or could? Testing the use of autonomy-supportive language, [https://cris.maastrichtuniversity.nl/en/publications/should-or-could-testing-the-use-of-autonomy-supportive-language-a/](https://cris.maastrichtuniversity.nl/en/publications/should-or-could-testing-the-use-of-autonomy-supportive-language-a/)  
> 21. REFUSAL SKILLS.ppt, [https://pt.slideshare.net/slideshow/refusal-skillsppt/257648110?nway-content\_model=A](https://pt.slideshare.net/slideshow/refusal-skillsppt/257648110?nway-content_model=A)  
> 22. How to Build a Chat-Based P2P Crypto Exchange Software? \- Antier, [https://www.antier.com/blogs/how-to-build-a-chat-based-p2p-crypto-exchange-software/](https://www.antier.com/blogs/how-to-build-a-chat-based-p2p-crypto-exchange-software/)  
> 23. Choosing Formality Levels — I can choose context-appropriate, [https://www.varsitytutors.com/practice/subjects/conversational-spanish/lessons/choosing-formality-levels](https://www.varsitytutors.com/practice/subjects/conversational-spanish/lessons/choosing-formality-levels)  
> 24. (PDF) Beyond interaction: Generative AI in conversational marketing, [https://www.researchgate.net/publication/378121813\_Beyond\_interaction\_Generative\_AI\_in\_conversational\_marketing\_-\_foundations\_developments\_and\_future\_directions](https://www.researchgate.net/publication/378121813_Beyond_interaction_Generative_AI_in_conversational_marketing_-_foundations_developments_and_future_directions)  
> 25. Leveraging AI-Powered chatbots to enhance customer service, [https://www.researchgate.net/publication/385230161\_Leveraging\_AI-Powered\_chatbots\_to\_enhance\_customer\_service\_efficiency\_and\_future\_opportunities\_in\_automated\_support](https://www.researchgate.net/publication/385230161_Leveraging_AI-Powered_chatbots_to_enhance_customer_service_efficiency_and_future_opportunities_in_automated_support)  
> 26. A Survey on Multi-Turn Interactions with Large Language Models, [https://arxiv.org/html/2504.04717v1](https://arxiv.org/html/2504.04717v1)  
> 27. A Survey on Multi-Turn Interactions with Large Language Models, [https://arxiv.org/html/2504.04717v6](https://arxiv.org/html/2504.04717v6)  
> 28. Discourse-level structuring of information in narrative:Signalling, [https://journals.openedition.org/discours/pdf/8476](https://journals.openedition.org/discours/pdf/8476)  
> 29. Claude Prompting Guide — Get the Most from Claude, [https://geteasyprompt.com/blog/claude-prompting-guide/](https://geteasyprompt.com/blog/claude-prompting-guide/)  
> 30. claude-code-handbook/Claude-Prompt-Guide.md at main \- GitHub, [https://github.com/ThamJiaHe/claude-code-handbook/blob/main/Claude-Prompt-Guide.md](https://github.com/ThamJiaHe/claude-code-handbook/blob/main/Claude-Prompt-Guide.md)  
> 31. Autorubric: A Unified Framework for Rubric-Based LLM Evaluation, [https://arxiv.org/html/2603.00077v1](https://arxiv.org/html/2603.00077v1)  
> 32. LLM-as-a-Judge: Everything Passed, and That Was the Problem, [https://medium.com/@janschachtschabel/llm-as-a-judge-everything-passed-and-that-was-the-problem-4bfc622a94a4](https://medium.com/@janschachtschabel/llm-as-a-judge-everything-passed-and-that-was-the-problem-4bfc622a94a4)  
> 33. Autorubric: Unifying Rubric-based LLM Evaluation \- arXiv, [https://arxiv.org/html/2603.00077v2](https://arxiv.org/html/2603.00077v2)  
> 34. Claude Prompting Guide: The Official Framework from Anthropic's, [https://tribeacademy.sg/blog/claude-prompts/](https://tribeacademy.sg/blog/claude-prompts/)  
> 35. Write a Prompt for Claude — Agent Skill for platform.claude.com, [https://www.browserless.io/skills/platform.claude.com/write-prompt-guide](https://www.browserless.io/skills/platform.claude.com/write-prompt-guide)