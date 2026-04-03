# **Arquitectura de System Prompts para IA Conversacional de Ventas: De la Fricción a la Experiencia de 11 Estrellas**

La transición de interfaces de lenguaje natural basadas en reglas rígidas hacia agentes conversacionales impulsados por Modelos de Lenguaje Grande (LLMs) ha introducido un paradigma de interacción fluido, pero inherentemente probabilístico. En entornos de ventas de alto valor, como la distribución de tecnología nutricional a nivel global, donde la fricción cuesta conversiones y las respuestas impredecibles dañan irreparablemente la confianza de la marca, depender exclusivamente de la naturaleza estocástica de un LLM resulta operativamente insuficiente.1 Las fallas observadas en ecosistemas de producción —como la alucinación de elementos de interfaz (menús inventados), la amnesia de contexto en conversaciones largas, la variación abrupta del registro tonal y la introducción de objeciones no solicitadas— son síntomas directos de una arquitectura de orquestación inmadura y de directrices de sistema (system prompts) mal estructuradas.2

El desafío principal radica en transformar un motor de inferencia estadística en un ejecutor determinista de procesos de negocio. Un sistema conversacional de élite no delega la lógica de ventas al modelo; por el contrario, utiliza el modelo exclusivamente como un procesador de lenguaje natural que opera dentro de barreras cognitivas rígidamente definidas.1 Este informe exhaustivo disecciona los principios estructurales, las reglas de comportamiento, las técnicas de anclaje de memoria y las arquitecturas de orquestación que las compañías de inteligencia artificial más sofisticadas del mundo emplean para mitigar la variabilidad y garantizar experiencias de ventas conversacionales deterministas, coherentes y altamente personalizadas, escalando desde un nivel base hasta una experiencia inmersiva de 11 estrellas.

## **1\. Arquitectura del System Prompt en Productos Élite**

La ingeniería de prompts en sistemas de producción a escala empresarial ha evolucionado desde simples instrucciones en texto plano hacia arquitecturas estructuradas que actúan como "sistemas operativos" cognitivos para el modelo. Compañías como Anthropic, OpenAI, Salesforce e Intercom utilizan metodologías estrictas para delimitar el espacio latente del modelo, asegurando que mantenga su rol, tono y restricciones lógicas a lo largo de interacciones prolongadas y complejas.

Para lograr la consistencia de tono y la prevención de alucinaciones instruccionales, la industria ha estandarizado prácticas de estructuración semántica. El **hallazgo principal** en este dominio revela que las compañías de IA de élite estructuran sus prompts utilizando delimitadores semánticos estrictos (como XML) para crear una jerarquía cognitiva que el modelo pueda procesar sin ambigüedad direccional.4 La **evidencia y fuente** de esta práctica proviene directamente de la documentación de Anthropic para modelos Claude, la cual recomienda explícitamente el uso de etiquetas XML para separar instrucciones, contexto, documentos y ejemplos.4 Específicamente, en contextos largos que superan los miles de tokens, Anthropic demuestra que colocar los datos de fondo estáticos en la parte superior del prompt dentro de etiquetas \<document\>, y las instrucciones operativas al final, mejora la adherencia del modelo hasta en un treinta por ciento.4 OpenAI concuerda con esta aproximación, sugiriendo el uso de delimitadores robustos para separar claramente las instrucciones del contexto inyectado.5

El **principio accionable** derivado de esta arquitectura exige fragmentar un prompt de sistema monolítico (como uno de 47KB) en módulos rígidamente etiquetados. El conocimiento estático, incluyendo arsenales de ventas y detalles operativos del negocio, debe posicionarse al inicio del prompt, mientras que las reglas de comportamiento, las restricciones de formato y el tono deben situarse al final para explotar el sesgo de recencia del modelo.2 Un **ejemplo de implementación** práctico de esta arquitectura modular se visualiza de la siguiente manera:

XML

\<system\_context\>  
  \<role\_definition\>  
    Eres el consultor senior de patrimonio más exclusivo de CreaTuActivo. Tu objetivo es calificar prospectos, explicar la oportunidad de negocio y guiarlos hacia la activación sin generar fricción.  
  \</role\_definition\>  
  \<business\_knowledge\>  
    \</business\_knowledge\>  
\</system\_context\>

\<operational\_rules\>  
  \<tone\_guidelines\>  
    Mantén un registro clínico, directo, elegante y empático en todo momento. Nunca utilices jerga corporativa de baja calidad ni lenguaje de ventas tradicional que genere presión.  
  \</tone\_guidelines\>  
  \<behavioral\_constraints\>  
    Tu respuesta debe estar compuesta exclusivamente por prosa narrativa fluida y párrafos cortos.  
  \</behavioral\_constraints\>  
\</operational\_rules\>

Complementando la estructuración jerárquica, la separación entre el contenido ("qué responder") y el formato ("cómo responder") requiere un encuadre psicológico específico en las instrucciones. El **hallazgo principal** aquí determina que el control del formato y comportamiento se logra de manera mucho más consistente utilizando un marco positivo (Positive Framing) combinado con una especificidad exhaustiva del formato de salida deseado.4 La **evidencia** técnica de plataformas como Salesforce Einstein y la documentación de Anthropic establece como regla fundamental dictar el comportamiento esperado en lugar de listar extensas prohibiciones.4 Computacionalmente, instruir a un modelo probabilístico sobre lo que no debe hacer lo obliga a activar y calcular los pesos semánticos de la acción prohibida, lo que paradójicamente aumenta el riesgo de que elementos de ese concepto indeseado se filtren en la generación de texto.4 Intercom advierte que las instrucciones negativas o los ejemplos de lo que no se debe hacer solo deben implementarse de manera quirúrgica si se observa un fallo específico en producción, pero nunca como la base de la directriz.7

El **principio accionable** consiste en auditar y reescribir el corpus de reglas del system prompt para eliminar comandos negativos ("no uses viñetas", "no asumas el perfil"), sustituyéndolos por directrices imperativas positivas que describan con precisión topográfica el comportamiento exacto que se espera del modelo. El **ejemplo de implementación** transforma una instrucción defectuosa como "No hables como un vendedor barato y no uses listas de opciones que no existen en el arsenal" en una directriz robusta: "Comunícate exclusivamente mediante prosa fluida, conversacional y consultiva. Presenta las oportunidades de forma narrativa, integrando orgánicamente las variables del usuario en oraciones completas y cohesivas."

Finalmente, para garantizar la consistencia tonal, el **hallazgo principal** indica que la provisión de ejemplos curados (Few-Shot Prompting) es la técnica más confiable para anclar el tono y prevenir desviaciones estilísticas a lo largo de interacciones prolongadas.4 La **evidencia** técnica demuestra que los modelos de lenguaje son motores de reconocimiento de patrones; las instrucciones descriptivas sobre el tono tienen un peso conductual mucho menor que los ejemplos demostrativos envueltos en etiquetas \<example\>.4 El **principio accionable** dicta la incorporación de una sección específica de ejemplos en el prompt que demuestre interacciones ideales (experiencias de 11 estrellas), mostrando explícitamente cómo el agente debe integrar variables capturadas sin recurrir a estructuras prohibidas. El **ejemplo de implementación** requeriría insertar transcripciones curadas de interacciones exitosas entre un prospecto y el consultor ideal, marcando claramente la transición de entrada del usuario y la salida esperada del modelo.

## **2\. Reglas de Oro en System Prompts de Ventas Conversacionales**

La dinámica de las ventas conversacionales, particularmente en sectores de alta fricción o decisiones de alto valor (como oportunidades de negocio o tecnología nutricional global), requiere que la IA navegue un equilibrio extremadamente delicado. El agente debe guiar al prospecto a través de un embudo de calificación hacia la conversión, sin que la interacción se perciba como un interrogatorio coercitivo, robótico o presumido. Las mejores prácticas en la industria se centran en la recopilación asíncrona de datos, la gestión de la asunción de perfiles y la aplicación táctica de la información retenida para personalizar la experiencia en tiempo real.

### **2.1 La Regla de Chekhov en la Memoria Conversacional**

La máxima literaria de Anton Chekhov dictamina que si se introduce un rifle cargado en el primer acto de una obra, este debe ser disparado inexorablemente en el tercer acto.9 En el diseño de arquitectura conversacional impulsada por IA, este principio se traduce en la obligación absoluta de utilizar estratégicamente cualquier punto de datos que el usuario haya revelado o que el sistema haya extraído. Solicitar información (como el nombre o la ocupación) y no utilizarla activamente en las respuestas subsiguientes degrada drásticamente la percepción de inteligencia y empatía del agente, destruyendo la ilusión de un consultor dedicado.10

El **hallazgo principal** en esta dimensión revela que la técnica de Anclaje de Memoria Contextual (Contextual Memory Anchoring) asegura que las variables de perfil acumuladas se inyecten activamente en la lógica de generación inmediata del LLM, obligándolo a personalizar cada turno conversacional.11 La **evidencia** proveniente de investigaciones en diseño de agentes para diálogos extensos muestra que incluir una declaración ancla (Anchor Statement) al inicio de las instrucciones de generación fuerza al modelo a condicionar su vector de respuesta.11 Por ejemplo, recordarle activamente al modelo: "El usuario es un emprendedor con poco tiempo libre; enfoca el valor en la automatización", previene que el modelo haga preguntas redundantes o asuma arquetipos genéricos que no se alinean con los datos ya obtenidos.10

El **principio accionable** es implementar una cabecera dinámica en cada mensaje enviado a la API (fuera del historial estático de la conversación) que inyecte un bloque actualizado del estado del prospecto. Esta cabecera actúa como el "rifle de Chekhov", garantizando que el modelo tenga los datos a la vista y directrices explícitas sobre cómo utilizarlos. El **ejemplo de implementación** se diseña mediante la inyección de metadatos estructurados en el payload:

XML

\<prospect\_state\>  
  \<known\_variables\>  
    \- Nombre\_Confirmado: \[Juan\]  
    \- Ocupacion\_Confirmada: \[Ingeniero Civil\]  
    \- Dolor\_Principal\_Revelado: \[Falta de tiempo y estancamiento de ingresos\]  
  \</known\_variables\>  
  \<interaction\_rules\>  
    Obligatorio: Utiliza el nombre del prospecto de forma natural en tu respuesta. Relaciona la oportunidad de negocio específicamente con su experiencia analítica como ingeniero. Tienes estrictamente prohibido volver a preguntar su ocupación o su dolor principal, ya que esta información ya ha sido capturada.  
  \</interaction\_rules\>  
\</prospect\_state\>

### **2.2 Detección de Intención frente a Asunción de Arquetipos**

Un problema crítico diagnosticado en el estado actual de Queswa es la asunción de perfiles antes de contar con datos empíricos sólidos. Cuando un usuario formula una pregunta genérica como "cómo funciona el negocio", el modelo estocástico tiende a inferir prematuramente que el interlocutor posee un perfil emprendedor avanzado, adaptando su tono y complejidad de manera inadecuada.

El **hallazgo principal** para resolver este síntoma establece que la identificación de intención debe ser un proceso analítico estricto, completamente separado de la generación conversacional empática, para prevenir suposiciones fundamentadas en inputs genéricos.12 La **evidencia** aportada por arquitecturas de enrutamiento de agentes, como las documentadas por Landbot y MindStudio, establece restricciones severas para la detección de intenciones: "Cero Alucinación: No hagas suposiciones más allá de lo expresado explícitamente en el mensaje del usuario".12 En entornos de ventas B2B, las reglas del prompt imponen el mantenimiento de un tono universal (neutral, acogedor, pero no presuntivo) hasta que el prospecto verbalice sin ambigüedad una necesidad o característica demográfica específica.13

El **principio accionable** requiere dividir la evaluación cognitiva de la respuesta. El prompt de sistema debe instruir al modelo a evaluar la declaración del usuario utilizando una regla estricta de validación antes de adaptar su arquetipo de respuesta. El **ejemplo de implementación** se formula de la siguiente manera: "Regla de Perfilado: Evalúa la última entrada del usuario. ¿El prospecto declaró explícitamente su ocupación, nivel de experiencia o problema personal? Si la respuesta es negativa (ej. preguntas genéricas sobre el producto), mantén un tono consultivo universal y no asumas ningún rasgo. Solo puedes adaptar tu lenguaje a un arquetipo específico si el usuario ha revelado voluntariamente información que justifique dicha adaptación."

### **2.3 Prevención de Objeciones Inyectadas y Ejecución del Cierre**

Por su diseño arquitectónico, los modelos LLM pre-entrenados tienden a simular conversaciones completas basadas en sus datos de entrenamiento masivos. En el contexto de ventas, esto frecuentemente se manifiesta como la inserción de objeciones comunes por una especie de "cortesía algorítmica" (ej. "¿Necesitas consultarlo con un socio?", "¿Te preocupa el costo inicial?"). Plantar estas semillas de duda justo en el momento de mayor temperatura de compra destruye conversiones.

El **hallazgo principal** indica que las inteligencias artificiales de ventas de clase mundial utilizan reglas deterministas y mecánicas de "bloqueo de fricción" para forzar transiciones inmediatas al cierre una vez que se detecta la intención de compra.1 La **evidencia** de plataformas de optimización de ventas subraya la eficacia del "Cierre Asuntivo" (Assumptive Close).14 Cuando se detecta la intención, el sistema debe cesar inmediatamente toda calificación y exploración. LogRocket detalla que en sistemas automatizados de ventas de alto valor, el modelo no debe tener la libertad de decidir qué hacer tras detectar la intención; debe activar un flujo de estado determinista que emita la propuesta final sin añadir variables conversacionales.1

El **principio accionable** exige incorporar una instrucción absoluta y prioritaria sobre la prohibición de introducir fricción, acompañada de un protocolo de transición directa. El **ejemplo de implementación** establece: "REGLA CRÍTICA DE CIERRE: Tienes estrictamente prohibido introducir, sugerir o anticipar cualquier objeción, preocupación, o punto de fricción que el usuario no haya verbalizado primero. Si el prospecto indica interés en comenzar, registrarse o iniciar, cesa inmediatamente cualquier proceso de calificación. No hagas preguntas aclaratorias adicionales. Ejecuta la instrucción de CIERRE\_01 de manera inmediata, confirmando el acceso en 60 segundos y entregando el camino de activación."

## **3\. Técnicas de Prevención de Hallucination Instruccional**

El problema más persistente en el despliegue de IA generativa en producción es la "Alucinación Instruccional" o "Alucinación de UX". Este fenómeno ocurre cuando el modelo genera respuestas que suenan lógicas y razonables, como la creación de menús estructurados (Opciones A, B, C) que no existen en los arsenales de conocimiento inyectados.2 Los LLMs buscan estructurar la información para maximizar la legibilidad, basándose en los patrones de atención de su fase de pre-entrenamiento, donde los menús y las listas son omnipresentes en las transcripciones de interfaces de servicio al cliente.2

### **3.1 Imposición de Esquemas y Verificación Reflexiva**

Las instrucciones redactadas en lenguaje natural, por más enfáticas que sean, pueden resultar ambiguas para un modelo bajo una alta carga de contexto y fatiga de atención.

El **hallazgo principal** para erradicar las alucinaciones de formato es la imposición de esquemas de respuesta estrictos (Structured Outputs) mediante la arquitectura del sistema, obligando al modelo a auditar y justificar su formato en un espacio latente antes de emitir la respuesta visible.15 La **evidencia** técnica de ingenieros de IA demuestra que el forzado de esquemas y la "Verificación Reflexiva" (Reflexive Verification) alteran fundamentalmente el comportamiento de salida.15 Esta técnica exige que el LLM genere su proceso de razonamiento internamente, evalúe su propio borrador frente a las restricciones del sistema (Chain of Thought), y solo entonces proceda a la estructuración final.4

El **principio accionable** consiste en programar el prompt para que el modelo aplique un proceso de razonamiento analítico oculto. Debe auditar obligatoriamente si su respuesta planeada contiene listas, viñetas o menús antes de consolidar la prosa final que se mostrará al usuario. El **ejemplo de implementación** requiere una estructura XML que el backend procesará para extraer solo el nodo final:

XML

\<response\_generation\_protocol\>  
  Antes de generar la respuesta visible para el usuario, debes pensar paso a paso y realizar una auditoría estricta de tu contenido dentro de las etiquetas \<thought\_process\>.  
    
  \<thought\_process\>  
    1\. Analiza el último mensaje del prospecto.  
    2\. Identifica los datos disponibles en la memoria del perfil.  
    3\. Redacta un borrador mental de la respuesta basándote exclusivamente en el arsenal.  
    4\. AUDITORÍA DE FORMATO Y UX: Inspecciona el borrador. ¿Contiene listas numeradas, viñetas, guiones, o menús de opciones múltiples (ej. Opción A, Opción B)?   
    5\. CORRECCIÓN: Si detectaste alguna estructura de lista o menú en el paso anterior, destrúyela inmediatamente. Reescribe el contenido transformándolo en prosa narrativa fluida y párrafos descriptivos.  
  \</thought\_process\>  
    
  Una vez completada la auditoría y corrección, escribe la respuesta final y pulida, lista para el usuario, exclusivamente dentro de las etiquetas \<final\_response\>.  
\</response\_generation\_protocol\>

### **3.2 Bloqueo Instruccional mediante Alternativas Conductuales**

Como se exploró en la arquitectura base, la prohibición textual simple ("No hagas X") carece del peso conductual necesario cuando compite con la inercia probabilística del modelo.

El **hallazgo principal** sobre el bloqueo instruccional efectivo revela que las prohibiciones que los modelos realmente respetan combinan un mandato fuerte con la provisión inmediata de una alternativa concreta de comportamiento (una regla de sustitución directa).4 La **evidencia** proporcionada por la documentación de refinamiento de Intercom Fin AI enfatiza que un comando restrictivo aislado es débil y propenso a fallar. La directriz debe ser formulada como un comando de sustitución lógica completa.18 Por ejemplo, en lugar de decir "No crees menús", se debe instruir "Si la información requiere presentar múltiples opciones, intégralas narrativamente en lugar de listarlas".18

El **principio accionable** es mapear cada alucinación de UX observada durante las clínicas de conversación y redactar una regla de sustitución directa en el system prompt. El **ejemplo de implementación** aborda el problema de los menús: "REGLA DE SUSTITUCIÓN DE FORMATO: Si la recuperación de contexto del arsenal te proporciona múltiples características, niveles o beneficios que responder al usuario, tienes prohibido estructurarlos como un menú. En su defecto, DEBES sintetizar esas opciones dentro de un párrafo descriptivo, conectando las ideas con conjunciones fluidas para que se lea como el consejo experto de un consultor, no como el catálogo de un bot."

## **4\. El Framework de 11 Estrellas Aplicado a IA Conversacional**

Brian Chesky, cofundador de Airbnb, popularizó el marco de diseño de la "Experiencia de 11 Estrellas". Este framework metodológico funciona definiendo la experiencia más deficiente posible (1 estrella) y extrapolando el servicio hasta alcanzar un nivel conceptualmente absurdo o imposiblemente perfecto (11 estrellas). Una vez mapeados los extremos, el equipo de producto trabaja hacia atrás para identificar el punto óptimo de viabilidad técnica e impacto emocional —el "sweet spot"— que generalmente reside en el nivel de 6 o 7 estrellas.19

Al adaptar rigurosamente esta matriz a la ingeniería de una IA de ventas autónoma como Queswa, el enfoque de evaluación trasciende la mera funcionalidad de procesamiento de lenguaje natural y se adentra en las esferas de la hospitalidad digital, la memoria a largo plazo y la hiperpersonalización predictiva.21 El **hallazgo principal** es que una IA de ventas de 11 estrellas no se define por su capacidad para responder preguntas, sino por su capacidad para anticipar necesidades, eliminar la carga cognitiva del usuario y mantener una simetría emocional perfecta sin exhibir las costuras de su naturaleza sintética.19

La **evidencia** de cómo aplicar este marco a experiencias de producto, extraída de análisis de diseño UX basados en los principios de Chesky, permite operacionalizar los criterios para un chatbot de ventas.21 El **principio accionable** es utilizar la siguiente definición operacional para auditar cada iteración de Queswa y medir empíricamente su progreso frente a estos criterios escalonados.

### **Matriz Operacional de Estrellas para IA de Ventas (Queswa)**

| Nivel de Experiencia | Criterio Operacional Medible (IA de Ventas Conversacional) | Impacto Psicológico y Conductual en el Prospecto |
| :---- | :---- | :---- |
| **1 a 3 Estrellas (Estado actual de fricción y deficiencia)** | El agente exhibe amnesia de contexto severa; solicita datos ya proporcionados (como el nombre o la ocupación). Alucina datos de precios o genera menús de opciones inexistentes (hallucination de UX). Interrumpe el flujo con cambios abruptos de tono (de empático a burocrático) y siembra objeciones no solicitadas en momentos de cierre. | **Frustración y Desconfianza.** El prospecto se da cuenta inmediatamente de que está interactuando con un sistema deficiente o un IVR glorificado. La fricción operativa provoca el abandono prematuro del embudo. |
| **4 a 5 Estrellas (La experiencia base esperada)** | El agente responde a las preguntas fácticas correctamente basándose estrictamente en los fragmentos recuperados (RAG). Mantiene una ortografía y gramática perfectas. Es capaz de entregar un enlace de pago genérico cuando el usuario lo solicita explícitamente. | **Transaccionalidad Plana.** El prospecto obtiene la información solicitada, pero no percibe un valor añadido consultivo. La conversión depende enteramente de la motivación intrínseca preexistente del usuario; la IA no logra persuadir ni elevar la temperatura de compra. |
| **6 Estrellas (La experiencia excepcional de la industria)** | Retención absoluta de variables: El agente utiliza el nombre y la ocupación desde el momento en que se capturan, sin repetirlos jamás como preguntas. Modula activamente su lenguaje para coincidir con el nivel técnico o demográfico del prospecto. Presenta información de alta complejidad sin fricción visual (prosa fluida, cero menús robóticos). | **Sorpresa Positiva.** El usuario reconoce conscientemente que interactúa con una IA, pero la prefiere frente a un agente humano promedio debido a la rapidez sin precedentes, la claridad expositiva y el profundo respeto por su tiempo cognitivo. |
| **7 Estrellas (El Sweet Spot Viable \- Objetivo de Queswa)** | **Omnisciencia Contextual y Cierre Invisible:** La IA logra relacionar orgánicamente un dolor profundo expresado en el turno 2 con la propuesta de valor presentada en el turno 9, creando un arco narrativo personalizado. Transita hacia el protocolo de cierre de manera determinista e imperceptible tan pronto el usuario emite micro-señales de interés, sin plantear ni una sola objeción preventiva. El tono se mantiene inquebrantablemente anclado en "Lujo Clínico" a través de decenas de turnos. | **Asombro y Confianza Acelerada.** El prospecto experimenta la sensación de estar conversando con el consultor patrimonial más agudo y dedicado de la firma. La confianza en la marca se eleva exponencialmente, acelerando el ciclo de decisión de compra y reduciendo las objeciones orgánicas. |
| **10 y 11 Estrellas (Nirvana \- Imposible tecnológicamente hoy)** | Activación hiper-predictiva. La IA ya ha integrado el perfil de LinkedIn y el historial digital del usuario antes de que este envíe su primer mensaje. Anticipa la capacidad de inversión con base en micro-señales léxicas invisibles. Gestiona la activación, validación biométrica y cierre de contratos de manera instantánea, casi telepática, sin requerir formularios. | **Magia Absoluta.** La fricción operativa y cognitiva es literalmente igual a cero. El prospecto siente que sus necesidades han sido resueltas antes de siquiera articularlas por completo. |

El **ejemplo de implementación** para alcanzar las 7 estrellas requiere que el equipo de ingeniería cese los intentos de afinar prompts estáticos para corregir errores de 3 estrellas, y en su lugar invierta en la reestructuración de la arquitectura de memoria (State Machines y Context Pinning) detallada en las siguientes secciones.

## **5\. Gestión del Contexto en Conversaciones Largas (\>8 Mensajes)**

La arquitectura actual de Queswa inyecta un system prompt extenso (\~47KB), fragmentos recuperados mediante búsqueda vectorial y el historial completo de la conversación. Esta metodología lineal presenta un fallo catastrófico inherente a la arquitectura de los modelos Transformer: a medida que la conversación se extiende (típicamente más allá de los 6 u 8 turnos), el modelo experimenta un fenómeno de degradación de la atención conocido técnicamente como Deriva de Instrucciones (Instruction Drift) o Sobrecarga de la Ventana de Contexto (Context Window Overload).2

### **5.1 Mitigación de la Deriva de Instrucciones mediante Context Pinning**

Los modelos de lenguaje priorizan computacionalmente el contexto de la conversación inmediata sobre las reglas estáticas definidas docenas de turnos atrás.2 Esto explica clínicamente por qué el agente Queswa, alrededor del octavo mensaje, olvida que debe mantener un registro de "Lujo Clínico" y comienza a comportarse como un formulario genérico; el modelo simplemente está siendo arrastrado por la gravedad de las preguntas y respuestas más recientes, diluyendo el peso del system prompt inicial.

El **hallazgo principal** para contrarrestar esta amnesia arquitectónica es que las plataformas resilientes emplean técnicas de fijación de contexto (Context Pinning) para forzar que los datos críticos y las reglas inquebrantables permanezcan perpetuamente adyacentes al vector de inferencia más reciente del modelo.2 La **evidencia** proveniente de análisis de fallos en agentes de producción (como los estudios de post-mortem de Arize AI y prácticas de optimización de contexto) demuestra que la solución de ingeniería más robusta es explotar activamente el sesgo de recencia (recency bias) del LLM.2 En lugar de permitir que el contexto se llene linealmente y las reglas queden sepultadas en el inicio de la sesión, el backend debe interceptar el array de mensajes y reestructurar el payload dinámicamente antes de cada llamada a la API.2

El **principio accionable** es refactorizar el middleware que construye el payload enviado a la API de Claude. En lugar de enviar \-\> \-\> \[Nuevo Input del Usuario\], la estructura orquestada debe ser \-\> \-\> \-\> \[Nuevo Input del Usuario\].2 El **ejemplo de implementación** requiere que el backend añada de forma imperceptible un mensaje con rol de sistema justo antes de la última entrada del prospecto:

JSON

{  
  "role": "system",  
  "content": "\<pinned\_context\_and\_constraints\>\\nESTADO ACTUAL DEL PROSPECTO:\\n- Nombre: Juan\\n- Arquetipo: Ingeniero buscando diversificación.\\nREGLAS INQUEBRANTABLES PARA ESTE TURNO:\\n1. Mantén estrictamente el tono de Consultor Senior de Lujo Clínico.\\n2. Tienes prohibido usar menús, listas numeradas o viñetas.\\n3. Bajo ninguna circunstancia repitas preguntas sobre información ya capturada.\\n\</pinned\_context\_and\_constraints\>"  
}

### **5.2 Resumen Progresivo (Progressive Summarization)**

La inyección bruta de 135 fragmentos recuperados sumados a docenas de turnos de conversación no solo incrementa drásticamente los costos de latencia y tokenización, sino que ahoga la señal relevante en un mar de ruido contextual.2

El **hallazgo principal** establece que la técnica de Resumen Progresivo (Progressive Summarization) condensa de manera jerárquica el historial de la interacción antes de que sature el presupuesto de tokens o la capacidad de atención del modelo.25 La **evidencia** en estrategias de manejo de contexto largo sugiere que se debe activar la sumarización cuando el contexto alcanza el 80% de su límite óptimo, o de manera más estratégica, después de que se superan hitos lógicos en la conversación (por ejemplo, finalizar la etapa de descubrimiento de dolores).27

El **principio accionable** es mantener un historial exacto y verbatim de los últimos 3 o 4 intercambios de mensajes para mantener el micro-contexto y la fluidez inmediata, mientras que todo el historial anterior se destila en un bloque de metadatos narrativos altamente comprimidos que resumen las decisiones clave, objeciones previas resueltas y preferencias del prospecto.26

### **5.3 Máquinas de Estados Finitos (State Machines) frente a Autonomía Pura**

El descubrimiento arquitectónico más profundo respecto a la prevención de alucinaciones y consistencia de flujo reside en la delegación de responsabilidades. Confiarle al LLM la tarea simultánea de conversar, calificar, enrutar y cerrar dentro de un solo prompt masivo es una receta comprobada para la inestabilidad.

El **hallazgo principal** determina que, para procesos de negocio estrictamente deterministas (como ventas de alto valor), el LLM no debe actuar como el orquestador principal o "Tomador de Decisiones" del flujo general, sino que debe ser degradado al rol de "Procesador de Datos y Lenguaje" operando dentro de una Máquina de Estados Finitos (Finite State Machine, FSM) controlada por el backend.1 La **evidencia** de ingenieros de sistemas en plataformas como LogRocket y arquitecturas basadas en LangGraph documenta que otorgar autonomía abierta a un agente genera espirales lógicas y comportamientos impredecibles.1 La solución industrial es utilizar enrutadores (routers) codificados rígidamente en el código del servidor que controlan en qué "estado" se encuentra el prospecto, invocando al LLM con sub-prompts altamente especializados para ese estado específico.1

El **principio accionable** exige una transición radical en la arquitectura (De DEL \-\> AL): En lugar de un system prompt de 47KB, se debe dividir la conversación en nodos secuenciales:

1. **Estado de Calificación:** El prompt inyectado instruye al LLM exclusivamente a extraer datos (Nombre, Profesión) manteniendo el tono consultivo. El LLM devuelve al backend un JSON estructurado de forma asíncrona.  
2. **Transición Determinista:** El código del backend (no el LLM) detecta que las variables obligatorias están completas y avanza el cursor de estado del usuario en la base de datos a "Presentación".  
3. **Estado de Presentación:** El backend cambia por completo el system prompt inyectado. En este nuevo estado, el modelo pierde las instrucciones para hacer preguntas de calificación y solo recibe directrices para articular la solución basándose en el RAG y los datos previamente extraídos.29  
4. **Estado de Cierre:** Gatillado por una clasificación estricta de intención. El prompt se reduce drásticamente, ordenando únicamente la entrega asertiva de las instrucciones de acceso, eliminando matemáticamente el riesgo de que el modelo plantee objeciones retrospectivas.1

## **6\. Estudio de Caso: Los Mejores Chatbots de Ventas del Mundo**

La evaluación comparativa de las implementaciones de referencia en la industria de la inteligencia artificial conversacional proporciona patrones arquitectónicos directamente replicables para elevar el rendimiento operativo de Queswa hacia el estándar de 7 a 11 estrellas.

### **6.1 Klarna AI Assistant (El Estándar de Soporte y Retención)**

Klarna desplegó un asistente de IA impulsado por tecnologías de OpenAI que redefinió la viabilidad empresarial de los LLMs. En su primer mes de operación, gestionó 2.3 millones de conversaciones (abarcando dos tercios de su volumen global de consultas), realizando el equivalente al trabajo de 700 agentes humanos a tiempo completo y reduciendo el tiempo de resolución promedio de 11 minutos a menos de 2 minutos.30

* **Competencia Excepcional:** Su mayor logro es el mantenimiento impecable de la consistencia del tono corporativo a través de múltiples fronteras lingüísticas y la gestión de intenciones transaccionales de alta sensibilidad (disputas, pagos, reembolsos) sin pérdida de precisión ni alucinación de procesos.30  
* **Arquitectura Inferida:** El éxito de Klarna no se basa en un prompt monolítico, sino en el uso intensivo de **LangGraph** y **LangSmith** para construir un sistema multi-agente altamente controlable.33 Implementaron una inteligencia sensible al contexto ("Context-aware intelligence") donde el enrutador principal clasifica la intención y selecciona dinámicamente qué sub-agente (con un prompt específico y limitado a esa tarea) debe manejar la respuesta, reduciendo así la latencia, los costos de tokens y la probabilidad de desvío.33  
* **Adaptación para Queswa:** Queswa debe abandonar el enfoque de un solo hilo conversacional. Debe adoptar la metodología de enrutamiento de agentes especialistas de Klarna y, de forma crítica, integrar el modelo de "Test-Driven Development" (Desarrollo Guiado por Pruebas). Utilizando herramientas de evaluación automatizada, se deben simular sistemáticamente cientos de escenarios de resistencia y objeciones genéricas para perfeccionar iterativamente la contención del prompt antes de actualizar producción.33

### **6.2 Agentes de Voz a Escala (Bland AI y Air AI)**

Aunque estas plataformas (Bland AI, Air AI, Synthflow) operan principalmente en el dominio de las ventas salientes por voz (outbound voice), lideran la vanguardia técnica en el mantenimiento del realismo conversacional y el cierre determinista bajo condiciones de latencia extrema.34

* **Competencia Excepcional:** Bland AI se destaca notablemente por su capacidad de integración con APIs de sistemas de gestión (CRM) a mitad de la interacción (mid-call actions).35 Esta arquitectura permite extraer y validar datos en tiempo real de forma asíncrona, evitando que la IA quede paralizada solicitando un dato tras otro o alucinando disponibilidades.  
* **Arquitectura Inferida:** Para lograr este nivel de realismo y control, Bland AI revolucionó su enfoque de prompting implementando lo que denominan **Conversational Pathways** (Rutas Conversacionales).34 En términos de ingeniería, esto representa una aplicación rigurosa de Máquinas de Estados Finitos donde el flujo lógico se subdivide en nodos de sub-prompts de bajísima latencia, en lugar de forzar al modelo a procesar una directriz masiva y compleja en cada turno.35  
* **Adaptación para Queswa:** Se debe subdividir el embudo de Queswa (Calificación Inicial \-\> Mapeo de Dolores \-\> Explicación de Valor \-\> Cierre de Activación) en Rutas Conversacionales estrictas y predefinidas. Si el prospecto intenta desviarse abruptamente del tema, el sistema debe emplear una ruta transitoria de "Reencauzamiento" rápido sin alterar las variables del estado global de la conversación, retomando el hilo sin confusión.

### **6.3 Salesforce Einstein Agentforce (El Estándar B2B)**

La reciente evolución de Salesforce, transitando desde modelos puramente predictivos (Einstein original) hacia agentes de razonamiento profundo (Agentforce), revela el estándar de oro para interacciones B2B seguras y predecibles.3

* **Competencia Excepcional:** Sobresalen en la prevención absoluta de alucinaciones perjudiciales y la ejecución inquebrantable de barreras operativas (Guardrails), vinculando las respuestas de la IA directamente a la verdad fundamental (ground truth) de los datos estructurados en su CRM.3  
* **Arquitectura Inferida:** La piedra angular de su arquitectura es la implementación de **Agent Script** y plantillas de prompts inflexibles.3 Estas herramientas permiten especificar barreras deterministas (lógica condicional rígida, reglas explícitas de negocio y pasos obligatorios de validación) que limitan drásticamente la autonomía conductual del agente en escenarios donde el riesgo económico es alto.3 Asimismo, imponen una separación quirúrgica mediante delimitadores fuertes entre las instrucciones operativas del sistema y los datos de contexto inyectados.6  
* **Adaptación para Queswa:** Queswa debe asimilar la filosofía de "Orquestación Determinista" de Salesforce. En los momentos críticos de la venta (el cierre), la responsabilidad de enviar el enlace de registro o detallar los métodos de pago nunca debe recaer en el albedrío generativo del LLM. El modelo debe limitarse a emitir una señal silenciosa estructurada (ej. un JSON oculto con {"intent\_status": "ready\_to\_buy"}). Al interceptar esta señal, el código duro del servidor asume el control absoluto e inyecta la presentación de la oferta estandarizada (CIERRE\_01), garantizando una tasa de error del 0% en la entrega del Call to Action.

## **7\. El Playbook: 10 Reglas de Oro para System Prompts de 11 Estrellas**

Fundamentado en la evidencia técnica de ingeniería inversa de modelos como Anthropic Claude, arquitecturas de orquestación como LangGraph, y los marcos operativos rigurosos de empresas de élite, este playbook condensa las directrices definitivas. Su aplicación metódica transmutará a Queswa de un generador probabilístico de respuestas variables a un agente determinista, implacablemente perspicaz y enfocado en la conversión fluida. Las reglas están jerarquizadas según su impacto sistémico en la experiencia del usuario y la mitigación de fallos.

### **Nivel 1: Arquitectura Base y Orquestación Determinista**

**Regla 1: Desacoplar la Decisión de la Generación (Arquitectura de Máquina de Estados).**

La dependencia de un único system prompt masivo para gestionar todo el ciclo de vida de la venta es el origen de la inestabilidad.

* *Implementación:* Implementa un grafo direccional (FSM) donde el backend rastree de forma persistente el estado exacto del prospecto (ej. fase\_1\_calificacion, fase\_3\_cierre). Asigna dinámicamente un sub-prompt pequeño, hiper-especializado y sumamente restrictivo para cada estado, limitando el horizonte de acciones del modelo a la tarea inmediata.1

**Regla 2: Context Pinning (Anclaje Obligatorio contra la Amnesia).**

La memoria funcional de los LLMs se degrada exponencialmente en conversaciones largas debido al sesgo de recencia de los mecanismos de atención.

* *Implementación:* Intercepta el payload JSON enviado a la API de Claude y adhiere un bloque de contexto inyectado artificialmente como el *último* mensaje de sistema justo antes del input del usuario. Este bloque debe contener las reglas innegociables (Tono: Lujo Clínico, Formato: Cero Menús) y los datos vitales ya extraídos (Nombre, Dolor), forzando al modelo a procesarlos con la máxima prioridad de atención.2

**Regla 3: Separación Jerárquica Obligatoria mediante Marcado XML.**

La mezcla de instrucciones operativas, datos de arsenal y directrices de tono en texto plano genera confusión semántica en el modelo.

* *Implementación:* Organiza exhaustivamente todo el contexto estático utilizando etiquetas XML estrictas (\<definicion\_rol\>, \<arsenal\_negocio\>, \<restricciones\_comportamiento\>, \<ejemplos\_tonales\>). Los modelos modernos están finamente sintonizados para indexar este marcado, aislando perfectamente las directrices de tono del conocimiento fáctico.4

### **Nivel 2: Comportamiento, Perfilado y Prevención de Alucinaciones**

**Regla 4: La Regla de Chekhov para Memoria Demostrativa Activa.**

Capturar datos sin reflejarlos activamente rompe la ilusión de inteligencia y empatía.

* *Implementación:* Si el sistema ha extraído y almacenado un dato personal (ej. la ocupación es abogado), el modelo está obligado contractualmente por el prompt a integrar esa información orgánica y sutilmente en su vector semántico subsiguiente (ej. utilizando analogías pertinentes al derecho). Esto prueba empíricamente al prospecto que el sistema "escucha" con atención plena.10

**Regla 5: Clasificación de Intención Estricta (Tolerancia Cero a la Alucinación de Perfiles).**

Asumir arquetipos basándose en palabras clave aisladas o preguntas genéricas degrada la calidad consultiva de la interacción.

* *Implementación:* Instala un flujo invisible de validación con un umbral de confianza alto. Si el usuario formula una consulta genérica, el prompt debe forzar al modelo a mantener un tono neutral y universal. La IA tiene estrictamente prohibido asignar un arquetipo operativo hasta que el prospecto realice una declaración explícita e inequívoca sobre su situación o necesidades.12

**Regla 6: Pensamiento Reflexivo Estructurado (Chain of Thought Oculto).**

La generación directa e impulsiva de respuestas es la causa principal de la alucinación de formatos de UX no autorizados.

* *Implementación:* Obliga al modelo, mediante las instrucciones del prompt, a generar un espacio estructurado de \<thought\_process\> antes de emitir cualquier texto visible. En esta zona oculta, el modelo debe listar los datos capturados aplicables, auditar su borrador, y verificar explícitamente que no está incluyendo barreras, listas o menús, emitiendo posteriormente la \<final\_response\> limpia que el backend extraerá.15

**Regla 7: Encuadre Positivo de Restricciones (Positive Framing).**

Las redes neuronales procesan de manera ineficiente las negaciones, frecuentemente activando los conceptos que se supone deben suprimir.

* *Implementación:* Purga el system prompt de frases restrictivas negativas ("No hagas X", "No inventes opciones"). Sustitúyelas por imperativos formativos precisos y constructivos. En lugar de prohibir los menús, ordena con rigor: "Comunícate exclusivamente utilizando párrafos de prosa fluida, narrativa y altamente conversacional".4

### **Nivel 3: Excelencia en la Experiencia de Usuario y Ejecución del Cierre**

**Regla 8: Eliminación Proactiva de Fricción Estocástica (La Regla de No Objeción).**

Por cortesía algorítmica derivada de su entrenamiento general, el modelo tiende a inyectar fricciones hipotéticas para prolongar la simulación conversacional.

* *Implementación:* Establece un mandato inquebrantable en la base del prompt: El modelo tiene estrictamente prohibido proyectar, anticipar o introducir objeciones (relacionadas con tiempo, costo, riesgo o validación externa). Solo está autorizado a empatizar y resolver fricciones que hayan sido explícitamente articuladas por el prospecto.1

**Regla 9: Few-Shot Curado para Calibración de "Lujo Clínico".**

El tono y la cadencia no pueden ser meramente descritos a un modelo; deben ser modelados mediante ejemplos de alta densidad cualitativa.

* *Implementación:* Proporciona dentro de la estructura XML del prompt una sección de \<examples\> que contenga de 3 a 5 transcripciones completas de interacciones maestro-prospecto. Estas interacciones deben encapsular a la perfección la voz de "Consultor Senior", demostrando exactamente cómo evadir listas y menús. El LLM emulará mecánicamente la estructura, longitud y empatía analítica demostrada en estos vectores de ejemplo.4

**Regla 10: Ejecución Determinista del Cierre (Cierre Asuntivo Cero Fricción).**

El momento de la conversión es demasiado crítico para depender de la variabilidad probabilística de un LLM.

* *Implementación:* Configura analizadores de sentimiento e intención para detectar señales inequívocas de compra. Cuando el umbral se supere, el backend debe interrumpir violentamente el bucle de cualificación y entendimiento del modelo. El sistema debe transitar inmediatamente al protocolo CIERRE\_01: directrices preaprobadas, lenguaje asertivo, promesas de cero fricción ("tendrás acceso en 60 segundos") y control absoluto de la entrega de la URL de conversión, sin permitir que el modelo formule preguntas aclaratorias o de confirmación residuales.1

#### **Fuentes citadas**

1. How to build deterministic agentic AI with state machines in n8n ..., acceso: abril 3, 2026, [https://blog.logrocket.com/deterministic-agentic-ai-with-state-machines/](https://blog.logrocket.com/deterministic-agentic-ai-with-state-machines/)  
2. Why AI Agents Break: A Field Analysis of Production Failures \- Arize AI, acceso: abril 3, 2026, [https://arize.com/blog/common-ai-agent-failures/](https://arize.com/blog/common-ai-agent-failures/)  
3. Salesforce AI FAQ | DataGroomr, acceso: abril 3, 2026, [https://datagroomr.com/salesforce-ai-faq/](https://datagroomr.com/salesforce-ai-faq/)  
4. Prompting best practices \- Claude API Docs \- Claude Console, acceso: abril 3, 2026, [https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)  
5. Best practices for prompt engineering with the OpenAI API, acceso: abril 3, 2026, [https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api)  
6. Prompt Engineering for Salesforce Developers \- GetGenerative.ai, acceso: abril 3, 2026, [https://www.getgenerative.ai/prompt-engineering-salesforce-developers/](https://www.getgenerative.ai/prompt-engineering-salesforce-developers/)  
7. Best practices for Fin Tasks | Intercom Help, acceso: abril 3, 2026, [https://www.intercom.com/help/en/articles/10539969-best-practices-for-fin-tasks](https://www.intercom.com/help/en/articles/10539969-best-practices-for-fin-tasks)  
8. prompt-optimizer-pro skill by openclaw/skills \- playbooks, acceso: abril 3, 2026, [https://playbooks.com/skills/openclaw/skills/prompt-optimizer-pro](https://playbooks.com/skills/openclaw/skills/prompt-optimizer-pro)  
9. Interactive Storytelling Techniques | PDF \- Scribd, acceso: abril 3, 2026, [https://www.scribd.com/document/744020424/Andrew-Glassner-Author-Interactive-Storytelling-Techniques-for-21st-Century-Fiction-A-K-Peters-CRC-Press-2004](https://www.scribd.com/document/744020424/Andrew-Glassner-Author-Interactive-Storytelling-Techniques-for-21st-Century-Fiction-A-K-Peters-CRC-Press-2004)  
10. Coneja-Chibi/The-HawThorne-Directives: The HawThorne Directives — A creative writing preset system for SillyTavern \- GitHub, acceso: abril 3, 2026, [https://github.com/Coneja-Chibi/The-HawThorne-Directives](https://github.com/Coneja-Chibi/The-HawThorne-Directives)  
11. Anchor Your AI's Brain: Master Contextual Memory Anchoring in 12 Examples\! – Prompt-On, acceso: abril 3, 2026, [https://prompton.wordpress.com/2025/07/14/%F0%9F%9A%80-anchor-your-ais-brain-master-contextual-memory-anchoring-in-12-examples-%F0%9F%98%B1/](https://prompton.wordpress.com/2025/07/14/%F0%9F%9A%80-anchor-your-ais-brain-master-contextual-memory-anchoring-in-12-examples-%F0%9F%98%B1/)  
12. AI Agent Use Cases in Real Life and Prompts to Build Them \- Landbot, acceso: abril 3, 2026, [https://landbot.io/blog/ai-agents-use-cases-prompts](https://landbot.io/blog/ai-agents-use-cases-prompts)  
13. Autonomous SDR Playbook: AI-Powered Lead Generation at Scale \- Jeeva AI, acceso: abril 3, 2026, [https://www.jeeva.ai/blog/ai-driven-lead-generation-machine-autonomous-sdr-agent-playbook](https://www.jeeva.ai/blog/ai-driven-lead-generation-machine-autonomous-sdr-agent-playbook)  
14. Sales Scripts to Close a Sales Conversation Guide | Seamless.AI, acceso: abril 3, 2026, [https://seamless.ai/customers/blog/sales/10-powerful-prompts-to-close-a-sales-conversation](https://seamless.ai/customers/blog/sales/10-powerful-prompts-to-close-a-sales-conversation)  
15. Best Practices for Controlling LLM Hallucinations at the Application Level \- Parasoft, acceso: abril 3, 2026, [https://www.parasoft.com/blog/controlling-llm-hallucinations-application-level-best-practices/](https://www.parasoft.com/blog/controlling-llm-hallucinations-application-level-best-practices/)  
16. Prompt Engineering Guide 2026: Master AI Agent Orchestration \- Zignuts Technolab, acceso: abril 3, 2026, [https://www.zignuts.com/blog/prompt-engineering-guide](https://www.zignuts.com/blog/prompt-engineering-guide)  
17. Prompt engineering techniques and best practices: Learn by doing with Anthropic's Claude 3 on Amazon Bedrock | Artificial Intelligence, acceso: abril 3, 2026, [https://aws.amazon.com/blogs/machine-learning/prompt-engineering-techniques-and-best-practices-learn-by-doing-with-anthropics-claude-3-on-amazon-bedrock/](https://aws.amazon.com/blogs/machine-learning/prompt-engineering-techniques-and-best-practices-learn-by-doing-with-anthropics-claude-3-on-amazon-bedrock/)  
18. Fin Guidance best practices | Intercom Help, acceso: abril 3, 2026, [https://www.intercom.com/help/en/articles/10560969-fin-guidance-best-practices](https://www.intercom.com/help/en/articles/10560969-fin-guidance-best-practices)  
19. How Airbnb Designs an 11-Star Experience \- Product Frameworks, acceso: abril 3, 2026, [https://www.product-frameworks.com/11-Star-Experience.html](https://www.product-frameworks.com/11-Star-Experience.html)  
20. Brian Chesky's 11-Star Experience, acceso: abril 3, 2026, [https://blueprints.guide/posts/11-star-experience](https://blueprints.guide/posts/11-star-experience)  
21. 11-Star Framework by Airbnb \- Slab Library, acceso: abril 3, 2026, [https://slab.com/library/templates/airbnb-11-star-framework/](https://slab.com/library/templates/airbnb-11-star-framework/)  
22. Transforming Business Models with Experience Design Principles \- FasterCapital, acceso: abril 3, 2026, [https://fastercapital.com/content/Transforming-Business-Models-with-Experience-Design-Principles.html](https://fastercapital.com/content/Transforming-Business-Models-with-Experience-Design-Principles.html)  
23. Applying Airbnb's 11-star framework to the candidate experience \- UX Collective, acceso: abril 3, 2026, [https://uxdesign.cc/applying-airbnbs-11-star-framework-to-the-candidate-experience-3f0b9c4e68a3](https://uxdesign.cc/applying-airbnbs-11-star-framework-to-the-candidate-experience-3f0b9c4e68a3)  
24. Antigravity vs Windsurf: Google Agent-First or Cognition Cascade? | Augment Code, acceso: abril 3, 2026, [https://www.augmentcode.com/tools/antigravity-vs-windsurf-comparison](https://www.augmentcode.com/tools/antigravity-vs-windsurf-comparison)  
25. ColorBrowserAgent: An Intelligent GUI Agent for Complex Long-Horizon Web Automation, acceso: abril 3, 2026, [https://arxiv.org/html/2601.07262v1](https://arxiv.org/html/2601.07262v1)  
26. How to Build AI Agents That Actually Remember: Memory ..., acceso: abril 3, 2026, [https://dev.to/pockit\_tools/how-to-build-ai-agents-that-actually-remember-memory-architecture-for-production-llm-apps-11fk](https://dev.to/pockit_tools/how-to-build-ai-agents-that-actually-remember-memory-architecture-for-production-llm-apps-11fk)  
27. context-management | Skills Marketplace \- LobeHub, acceso: abril 3, 2026, [https://lobehub.com/skills/jnpiyush-agentx-context-management](https://lobehub.com/skills/jnpiyush-agentx-context-management)  
28. Stop LLM Summarization From Failing Users \- Galileo AI, acceso: abril 3, 2026, [https://galileo.ai/blog/llm-summarization-production-guide](https://galileo.ai/blog/llm-summarization-production-guide)  
29. Prompt engineering: Big vs. small prompts for AI agents | Red Hat ..., acceso: abril 3, 2026, [https://developers.redhat.com/articles/2026/02/23/prompt-engineering-big-vs-small-prompts-ai-agents](https://developers.redhat.com/articles/2026/02/23/prompt-engineering-big-vs-small-prompts-ai-agents)  
30. Klarna AI Customer Service Case Study \- Pertama Partners, acceso: abril 3, 2026, [https://www.pertamapartners.com/case-studies/klarna-ai-customer-service](https://www.pertamapartners.com/case-studies/klarna-ai-customer-service)  
31. Klarna's AI chatbot: how revolutionary is it, really? \- The Pragmatic Engineer, acceso: abril 3, 2026, [https://blog.pragmaticengineer.com/klarnas-ai-chatbot/](https://blog.pragmaticengineer.com/klarnas-ai-chatbot/)  
32. Klarna Automates Two-Thirds of Customer Service with AI Assistant | Fini Labs, acceso: abril 3, 2026, [https://www.usefini.com/blog/klarna-automates-two-thirds-of-customer-service-with-ai-assistant](https://www.usefini.com/blog/klarna-automates-two-thirds-of-customer-service-with-ai-assistant)  
33. How Klarna's AI assistant redefined customer support at scale for 85 million active users, acceso: abril 3, 2026, [https://blog.langchain.com/customers-klarna/](https://blog.langchain.com/customers-klarna/)  
34. I Used Bland AI for Sales Calls — Honest 2026 Review \- Fahim AI, acceso: abril 3, 2026, [https://www.fahimai.com/bland-ai](https://www.fahimai.com/bland-ai)  
35. Bland AI vs Air AI vs Dialora AI: Best Platform 2026., acceso: abril 3, 2026, [https://www.dialora.ai/blog/bland-ai-vs-air-ai-vs-dialora-ai-comparison](https://www.dialora.ai/blog/bland-ai-vs-air-ai-vs-dialora-ai-comparison)  
36. Bland AI vs. Air AI vs. Synthflow: Which One Wins in 2025, acceso: abril 3, 2026, [https://synthflow.ai/blog/bland-ai-vs-air-ai](https://synthflow.ai/blog/bland-ai-vs-air-ai)  
37. Bland AI Review 2025 : Pros, Cons, Pricing and Features \- Dograh AI, acceso: abril 3, 2026, [https://blog.dograh.com/bland-ai-review-2025-pros-cons-pricing-and-features/](https://blog.dograh.com/bland-ai-review-2025-pros-cons-pricing-and-features/)  
38. 5 Essential Questions Salesforce Admins Must Ask for Effective AI Solutions, acceso: abril 3, 2026, [https://admin.salesforce.com/blog/2024/5-essential-questions-salesforce-admins-must-ask-for-effective-ai-solutions](https://admin.salesforce.com/blog/2024/5-essential-questions-salesforce-admins-must-ask-for-effective-ai-solutions)  
39. Agentforce Partner Pocket Guide \- Salesforce, acceso: abril 3, 2026, [https://cloud.mail.salesforce.com/agentforcepartnerpocketguide](https://cloud.mail.salesforce.com/agentforcepartnerpocketguide)  
40. Best Practices for Building Prompt Templates \- Salesforce Help, acceso: abril 3, 2026, [https://help.salesforce.com/s/articleView?id=ai.prompt\_builder\_best\_practices.htm\&language=en\_US\&type=5](https://help.salesforce.com/s/articleView?id=ai.prompt_builder_best_practices.htm&language=en_US&type=5)