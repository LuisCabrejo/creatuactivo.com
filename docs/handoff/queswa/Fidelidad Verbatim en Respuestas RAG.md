# **Propuesta de Arquitectura de Alta Fidelidad para Queswa: Entrega Verbatim Determinista de Respuestas Académicas**

## ---

**Sección A — Diagnóstico de Causa Raíz**

El análisis de la infraestructura de procesamiento del asistente Queswa revela que la degradación en la fidelidad de las respuestas no se debe a un fallo aislado de un componente. Por el contrario, es el resultado de una interferencia sistémica entre la heurística de enrutamiento temprano, la mecánica probabilística de los modelos de lenguaje autorregresivos, la saturación del contexto del prompt de sistema y las restricciones de la interfaz de programación de aplicaciones (API) de Anthropic.1

A continuación, se detalla la validación y el descarte de las hipótesis formuladas mediante evidencia experimental y literatura de ingeniería de sistemas de inteligencia artificial.

### **Análisis de la Heurística de Enrutamiento Temprano (Hipótesis A)**

La función de enrutamiento temprano isSimpleQueryEarly() sabotea la recuperación de información del sistema de generación aumentada por recuperación (RAG).4 Al catalogar de forma automática como "simple" cualquier consulta del usuario que contenga tres o menos palabras y carezca de términos clave explícitos (como "precio" o "costo"), la consulta *"qué es CreaTuActivo.com"* se clasifica erróneamente en esta categoría.

Este enrutamiento temprano desvía la consulta directamente hacia Claude Haiku 4.5, omitiendo por completo la búsqueda vectorial en Supabase. Al no ejecutarse la consulta contra el índice vectorial, el modelo no recibe ningún fragmento del arsenal RAG en su prompt.4 En consecuencia, el asistente se ve obligado a responder utilizando exclusivamente la información paramétrica de su prompt de sistema, lo que genera una síntesis imprecisa de la doctrina corporativa.4 El enrutamiento temprano actúa así como un filtro destructivo que bloquea el acceso al RAG para consultas cortas pero semánticamente densas.

### **Disparidad de Registro Lingüístico y Limitaciones de la Similitud Coseno (Hipótesis B)**

La base de datos vectorial Supabase calcula la distancia semántica entre vectores mediante la métrica de similitud coseno, expresada matemáticamente como:

![][image1]  
El umbral de similitud de ![][image2] con el modelo de embeddings voyage-large-2 genera falsos negativos cuando procesa consultas coloquiales de usuarios de Latinoamérica.5 Existe una brecha semántica entre la prosa técnica diseñada por el Director Académico (que incluye términos complejos como "Déficit Estructural de Ingresos", "Base Operativa autónoma" e "Ingeniería Patrimonial") y el lenguaje informal empleado por un usuario en la fase de prospección (por ejemplo, "cómo es la vuelta con el negocio", "qué me toca hacer a mí todos los días").5

Los embeddings densos de dos vías (*bi-encoders*) proyectan estas dos variantes lingüísticas en regiones distantes del espacio vectorial latente.5 Como consecuencia, la similitud coseno de la consulta coloquial frente a los fragmentos del arsenal no logra superar el umbral de ![][image2], devolviendo un conjunto vacío y forzando al sistema a recurrir a fallbacks de expresiones regulares o a la autogeneración probabilística.5

### **Saturación del Prompt de Sistema y Dilución de la Atención (Hipótesis C y D)**

El prompt de sistema actual tiene una longitud de 29,937 caracteres (aproximadamente 7,500 tokens). La literatura técnica demuestra que los modelos de lenguaje sufren el fenómeno de degradación de atención en contextos largos (*Lost in the Middle*).7 Cuando el prompt de sistema concentra instrucciones de identidad corporativa, restricciones de vocabulario, directrices de tono ("Lujo Clínico"), control de la máquina de estados finitos (FSM) y reglas de formato, el motor de atención multidireccional del transformador distribuye sus pesos probabilísticos entre múltiples frentes.

La probabilidad de generación de un token ![][image3] en un modelo autorregresivo está condicionada por la secuencia anterior de tokens del contexto ![][image4]:

![][image5]  
Donde ![][image6] es el vector de estado oculto que contiene la agregación de la atención sobre todo el prompt. Al inyectar un prompt de sistema denso de 27KB junto con un fragmento RAG, la influencia de la regla instructiva \`\` compite directamente con el sesgo conversacional inherente del modelo, el cual ha sido alineado mediante aprendizaje por refuerzo con retroalimentación humana (RLHF) para generar respuestas fluidas e integradas en el diálogo, en lugar de actuar como un mero procesador de copia y pega.3 El modelo prioriza la fluidez estilística y la coherencia del diálogo sobre la instrucción estricta de reproducir el texto sin modificaciones.3

Además, el uso de delimitadores pseudo-estructurales como ... resulta ineficaz frente a prompts extensos. Claude Sonnet 4.6 fue entrenado mediante procesos de post-entrenamiento específicos para reconocer y responder a la semántica de etiquetas XML estructuradas (como \<context\>, \<instructions\> o \<constraints\>).7 Los corchetes angulares actúan como señales de activación de atención en su arquitectura, mientras que los corchetes planos de los marcadores personalizados son procesados como texto plano de baja prioridad dentro de la secuencia.7

### **Incompatibilidad Absoluta del Pre-filling del Asistente (Hipótesis E)**

La hipótesis de forzar la fidelidad de la respuesta mediante el pre-llenado (*pre-filling*) del mensaje de respuesta del asistente es inviable en la infraestructura actual de Queswa.1 A partir de la actualización de la familia de modelos Claude 4.6 (incluyendo Sonnet 4.6 y Opus 4.6+), Anthropic introdujo un cambio destructivo en el comportamiento de su API de Mensajes.1

El pre-llenado de respuestas enviando un mensaje final con el rol assistant en el arreglo de mensajes de la solicitud genera un error de validación del lado del servidor.1 La API de Anthropic rechaza de forma inmediata la solicitud con un código de estado HTTP 400 Bad Request y la descripción oficial: *"Prefilling assistant messages is no longer supported"* o *"This model does not support assistant message prefill"*.1 Esta restricción técnica invalida por completo el uso de esta técnica en el pipeline conversacional.2

## ---

**Sección B — Soluciones Candidatas**

Para resolver la deriva de las respuestas de Queswa, se proponen cuatro soluciones de arquitectura de software, evaluando sus mecanismos de acción, viabilidad técnica y limitaciones.

### ---

**Opción 1: Enrutador Semántico de Intenciones (Semantic Intent Router) y Derivación Determinista**

                           Usuario escribe Consulta  
                                       │  
                                       ▼  
                     ┌───────────────────────────────────┐  
                     │ Clasificador Semántico (Supabase) │  
                     └─────────────────┬─────────────────┘  
                                       │  
                         ┌─────────────┴─────────────┐  
                         ▼                           ▼  
            ¿Similitud \>= Umbral Crítico?       ¿No Coincide?  
                         │                           │  
                         ▼                           ▼  
            ┌─────────────────────────┐     ┌──────────────────┐  
            │ Bypass de LLM Directo   │     │ Enviar a Pipeline│  
            │  Streaming de Supabase  │     │   RAG Estándar   │  
            └─────────────────────────┘     └──────────────────┘

#### **Descripción Técnica**

Esta solución implementa una capa de clasificación semántica intermedia previa a la invocación de los modelos de lenguaje de Anthropic.4 Cuando el usuario envía una consulta, el sistema genera su embedding utilizando voyage-large-2 y realiza una comparación vectorial rápida contra una tabla estructurada de intenciones canónicas de negocio en Supabase (WHY\_02, EAM\_01, etc.).11

Si la similitud del coseno supera un umbral estricto parametrizado, el backend de Vercel Edge Functions aborta la llamada a la API de Anthropic.4 En su lugar, recupera el texto maestro exacto del Director Académico guardado en la base de datos y lo transmite directamente al cliente utilizando el formateador de flujo createUIMessageStreamResponse del Vercel AI SDK.4

#### **Mecanismo de Acción**

Al separar la lógica de negocio crítica de la inferencia probabilística del LLM, se elimina por completo la posibilidad de alucinación, paráfrasis o alteración estilística.3 La entrega de los textos maestros es determinista.3 El sistema opera como un sistema de archivos de alta velocidad que sirve recursos estáticos cuando se detecta una intención semántica correspondiente a las preguntas clave del inicio del chatbot.4

#### **Evidencia y Referencias en Producción**

Este patrón de enrutamiento y derivación es el estándar de optimización de costes y latencia en sistemas RAG empresariales y chatbots de soporte de alto volumen.4 Frameworks de optimización de consultas demuestran que las arquitecturas orientadas a la intención disminuyen drásticamente el uso redundante de recursos vectoriales y de procesamiento, proporcionando respuestas deterministas inmediatas en el rango de los milisegundos para preguntas frecuentes de negocio.4

#### **Análisis de Tradeoffs y Métricas**

* **Costo:** Reducción a $0 tokens de LLM para todas las consultas críticas que coincidan con el índice de intenciones, lo que permite financiar el coste de las búsquedas del resto de la conversación.4  
* **Latencia:** Reducción drástica del Time to First Token (TTFT) a menos de 80 milisegundos, limitado únicamente por el viaje de ida y vuelta a la base de datos Supabase.4  
* **Complejidad de Código:** Baja. Requiere una función SQL en Postgres y un condicional en el middleware de enrutamiento en Vercel Edge.4  
* **Deuda Técnica:** Mínima. Los flujos deterministas están desacoplados de la lógica de procesamiento de lenguaje natural.

#### **Compatibilidad con Restricciones**

Satisface todas las restricciones de la plataforma conversacional. Soporta streaming de manera nativa mediante la inyección directa de texto en la respuesta HTTP y es compatible con una arquitectura multi-tenant en Supabase mediante filtros de clave de dominio.13

#### **Fiabilidad Estimada**

![][image7] de entrega verbatim una vez clasificada la intención del usuario.3

### ---

**Opción 2: RAG Híbrido con Re-Ranking Instruccional de Voyage y Delimitadores XML**

#### **Descripción Técnica**

Esta solución actualiza el pipeline de recuperación y generación mediante un proceso de re-ranking de dos etapas coordinado por voyage-rerank-2.5.5 Se reduce el umbral inicial de búsqueda en Supabase a ![][image8] para capturar un número amplio de chunks candidatos (por ejemplo, 15 fragmentos), evitando falsos negativos derivados del uso de lenguaje informal por parte de los usuarios de CreaTuActivo.5

Posteriormente, estos 15 candidatos se procesan junto con la consulta del usuario en el endpoint de re-ranking de Voyage, el cual soporta de forma nativa instrucciones en lenguaje natural para ajustar la puntuación de relevancia del modelo.6 El fragmento con la puntuación de relevancia más alta se inyecta en el contexto de Claude Sonnet 4.6 estructurado mediante etiquetas XML nativas (\<verbatim\_lock id="WHY\_02"\>...\</verbatim\_lock\>).7

                ┌───────────────────────────────────────────────┐  
                │ Supabase Vector Search (Umbral Amplio: 0.20)  │  
                └───────────────────────┬───────────────────────┘  
                                        │  
                                        ▼ (Recupera \~15 Chunks)  
                ┌───────────────────────────────────────────────┐  
                │             Voyage Rerank-2.5                 │  
                │     Instruction-Following: "Priorizar"        │  
                └───────────────────────┬───────────────────────┘  
                                        │  
                                        ▼ (Selecciona Top 1-3)  
                ┌───────────────────────────────────────────────┐  
                │         Claude Sonnet 4.6 (Contexto XML)       │  
                └───────────────────────────────────────────────┘

#### **Mecanismo de Acción**

Los re-rankers basados en transformadores de atención cruzada (*cross-encoders*) procesan de forma simultánea la consulta y el fragmento, capturando la relevancia profunda de la información de negocio con mayor precisión que los embeddings tradicionales.5 Al utilizar las instrucciones de Voyage Rerank (como *"Prioriza fragmentos con respuestas verbatim bloqueadas"*), se garantiza que las respuestas del Director Académico se posicionen siempre en la cabecera del contexto del modelo.16

Adicionalmente, sustituir los marcadores planos por etiquetas XML legítimas activa la lógica de atención entrenada de Claude Sonnet 4.6, que prioriza la transcripción literal del texto delimitado por encima de cualquier síntesis conversacional.7

#### **Evidencia y Referencias en Producción**

Los benchmarks de recuperación demuestran que el uso de Voyage rerank-2.5 incrementa la métrica de ganancia acumulada descontada normalizada (NDCG@10) en un 7.94% frente a soluciones de la competencia y hasta un 12.70% en el benchmark de seguimiento de instrucciones de re-ranking (MAIR).12 Empresas con sistemas conversacionales en producción implementan este patrón para mitigar la alucinación de datos y forzar comportamientos estructurados sin necesidad de reentrenamiento.7

#### **Análisis de Tradeoffs y Métricas**

* **Costo:** Introduce un cargo de facturación adicional marginal por cada llamada de re-ranking a la API de Voyage, compensado por la menor latencia y consumo de tokens al alimentar a Claude únicamente con los fragmentos más relevantes de la base de datos.5  
* **Latencia:** Añade una latencia de red de entre 120 y 180 milisegundos debido a la llamada intermedia al re-ranker, manteniéndose por debajo del límite de tolerancia de 3 segundos para el inicio de la respuesta.5  
* **Complejidad de Código:** Baja. Requiere integrar el SDK de Voyage Rerank en la Edge Function antes de llamar a Anthropic.18  
* **Deuda Técnica:** Muy baja. Es una mejora estándar y limpia sobre la pipeline de recuperación vectorial convencional.18

#### **Compatibilidad con Restricciones**

Totalmente compatible. Respeta el stack existente (Voyage, Supabase, Claude) y es compatible con el streaming del Vercel AI SDK.20

#### **Fiabilidad Estimada**

![][image9]. Aunque la precisión en la recuperación y la estructuración XML aumentan notablemente la fidelidad de la respuesta, el modelo conserva un margen probabilístico de generación que podría alterar el contenido en casos extremos de saturación de contexto.3

### ---

**Opción 3: Intercepción de Llamadas a Herramientas en Vercel AI SDK 6 (Tool Call Interception)**

#### **Descripción Técnica**

Esta solución implementa el protocolo de llamadas a herramientas (*tool calling*) del Vercel AI SDK 6 y la API de Anthropic.20 Se declara una herramienta del lado del servidor llamada servir\_respuesta\_calibrada que acepta un único argumento tipo cadena de texto (intent\_id), validado mediante un esquema de Zod.20

En el prompt de sistema simplificado de Queswa, se instruye de forma estricta al modelo: *"Si detectas que el usuario solicita información sobre cómo funciona la estructura patrimonial o la metodología operativa diaria, debes invocar obligatoriamente la herramienta servir\_respuesta\_calibrada con el identificador correspondiente"*.22 Al procesar la llamada de Claude Sonnet 4.6, la Edge Function intercepta la petición del servidor, consulta Supabase y escribe directamente el texto de la respuesta académica en el flujo de salida hacia el cliente, abortando la etapa de redacción natural del modelo.23

#### **Mecanismo de Acción**

Al mapear las respuestas de alta fidelidad como la salida directa de una herramienta del sistema, se anula la decodificación libre del LLM sobre el contenido final.3 Claude Sonnet 4.6 actúa como un clasificador de intenciones conversacionales de alta precisión que decide cuándo y qué herramienta ejecutar.20 El servidor se encarga de servir el contenido de la base de datos de forma determinista una vez validada la llamada.3

#### **Evidencia y Referencias en Producción**

El uso de llamadas a herramientas estructuradas para forzar comportamientos deterministas y evitar la autogeneración probabilística es una de las técnicas de control de flujo conversacional más recomendadas en la documentación técnica del SDK de Vercel y en las guías de diseño de agentes conversacionales de Anthropic.20

#### **Análisis de Tradeoffs y Métricas**

* **Costo:** Requiere la llamada estándar de inferencia a Claude Sonnet 4.6 para evaluar las intenciones del usuario y decidir el uso de la herramienta, consumiendo tokens de entrada y de salida.20  
* **Latencia:** Añade entre 350 y 550 milisegundos de latencia antes de comenzar el streaming, debido al tiempo requerido por el modelo para estructurar el objeto JSON de llamada a la herramienta.20  
* **Complejidad de Código:** Alta. Requiere configurar esquemas de Zod, gestionar de forma asíncrona los estados del stream de Vercel e implementar transformaciones para ocultar las llamadas internas del stream del usuario final.20  
* **Deuda Técnica:** Moderada. Incrementa la complejidad de la lógica de red de la Edge Function.23

#### **Compatibilidad con Restricciones**

Satisface las restricciones del sistema. Permite mantener el flujo de streaming en el cliente final utilizando las funciones de captura de flujos completos (fullStream o createDataStreamResponse) para interceptar y proyectar los datos en el canal de salida de texto.23

#### **Fiabilidad Estimada**

![][image10]. Claude Sonnet 4.6 destaca por su fiabilidad en la selección de herramientas adecuadas, reduciendo los falsos negativos en el reconocimiento de intenciones a niveles insignificantes.20

### ---

**Opción 4: Capa de Extracción de Spans de Texto Verbatim (Verbatim RAG Layer)**

#### **Descripción Técnica**

Inspirada en el marco de trabajo *Verbatim RAG*, esta solución elimina por completo la generación probabilística de tokens en el extremo de salida del pipeline conversacional.3 En lugar de pedir al LLM que redacte una respuesta sintáctica a partir del contexto del RAG, se configura el pipeline para restringir el comportamiento del transformador a una tarea exclusiva de extracción y clasificación de tramos (*spans*).3

El modelo de lenguaje (o un clasificador local de tokens altamente especializado) evalúa los fragmentos de contexto inyectados y retorna de forma exclusiva un índice de inicio de token y un índice de fin de token que delimitan la respuesta exacta que responde a la consulta del usuario.3 El servidor Edge de Vercel intercepta esta salida estructurada, realiza un rebanado de cadena directo (*slice*) sobre el documento original almacenado en la caché y transmite el texto verbatim al cliente.3

#### **Mecanismo de Acción**

Al transformar el problema de generación de lenguaje de Queswa en una tarea pura de tokenización y clasificación de tramos, el sistema de atención no genera nuevos tokens probabilísticos.3 El motor de inferencia actúa como un filtro binario que determina qué subconjunto de tokens pre-existentes de los documentos de Supabase responde exactamente a la pregunta del usuario.3 La cadena de salida transmitida al front-end proviene directamente de la base de datos Supabase, asegurando que se conserve el copy original sin parafrasear.3

#### **Evidencia y Referencias en Producción**

La viabilidad matemática y comercial de esta arquitectura para entornos que requieren cumplimiento regulatorio estricto y total fidelidad de la información fue documentada y presentada formalmente en la literatura científica de procesamiento de lenguaje natural en 2025 y 2026\.3 Modelos especializados de baja latencia (como ModernBERT o clasificadores token-level ligeros de KR Labs) demuestran tasas de éxito de concordancia literal del 100% en la recuperación de información regulada o técnica.3

#### **Análisis de Tradeoffs y Métricas**

* **Costo:** Consumo reducido si se despliega un modelo de extracción especializado de bajo parámetro, o consumo estándar si se utiliza Claude Sonnet 4.6 para extraer los índices de los tramos estructurados.3  
* **Latencia:** Mínima si se utiliza inferencia local, pero añade costes de red adicionales si se implementan llamadas secuenciales para estructurar los índices a través de la API.3  
* **Complejidad de Código:** Muy alta. Requiere integrar frameworks de procesamiento de texto a nivel de token dentro del entorno Edge de Vercel y coordinar sistemas de caché de texto sincronizados de Supabase.3  
* **Deuda Técnica:** Muy alta. Implementa una infraestructura propietaria de tokens fuera del estándar del SDK conversacional tradicional.3

#### **Compatibilidad con Restricciones**

Teóricamente viable en Vercel Edge, pero expuesta a restricciones por consumo de memoria de CPU en servidores sin estado al procesar operaciones de alineación de texto complejas.

#### **Fiabilidad Estimada**

![][image7] de concordancia literal en el texto servido una vez localizado el fragmento origen por el clasificador de tokens.3

## ---

**Sección C — Recomendación Priorizada**

Basándose en la viabilidad técnica, el cumplimiento de las restricciones operativas y el objetivo de erradicar la paráfrasis de los textos del Director Académico, se establece la siguiente estrategia de implementación.

### ---

**Recomendación Primaria: Arquitectura de Doble Ruta (Enrutador Semántico \+ RAG con Reranker de Voyage)**

Se recomienda implementar de forma prioritaria la integración de la **Opción 1 (Enrutador Semántico de Intenciones)** como capa de intercepción inmediata de alta velocidad, respaldada por la **Opción 2 (Reranker instruccional de Voyage con Delimitadores XML)** como la ruta general de procesamiento de lenguaje natural.4

                            Consulta del Usuario  
                                     │  
                                     ▼  
                      ┌─────────────────────────────┐  
                      │    Embedding de Consulta    │  
                      │     (Voyage-Large-2)        │  
                      └──────────────┬──────────────┘  
                                     │  
                     ┌───────────────┴───────────────┐  
                     ▼                               ▼  
       ¿Match en Enrutador de               ¿No hay Match?  
        Intenciones (\>= 0.82)?                       │  
                     │                               ▼  
                     ▼                   ┌───────────────────────┐  
         ┌───────────────────────┐       │   Búsqueda Vectorial  │  
         │ Bypass Determinista   │       │   Amplia (Supabase)   │  
         │   Servido de Texto    │       └───────────┬───────────┘  
         │  Directo de Supabase  │                   │  
         └───────────────────────┘                   ▼  
                                         ┌───────────────────────┐  
                                         │   Voyage Rerank-2.5   │  
                                         │  Filtro de Relevancia │  
                                         └───────────┬───────────┘  
                                                     │  
                                                     ▼  
                                         ┌───────────────────────┐  
                                         │   Claude Sonnet 4.6   │  
                                         │  Contexto XML Limpio  │  
                                         └───────────────────────┘

#### **Justificación del Diseño**

1. **Bypass del 80% del Tráfico con Coste Cero (Opción 1):** Dado que la mayor parte del tráfico inicial de CreaTuActivo se concentra en los cuatro chips interactivos del saludo inicial, la interceptación semántica directa en Supabase resuelve el problema con la máxima fiabilidad posible (![][image7] de entrega literal).4 Al servir las respuestas directamente desde la base de datos sin pasar por Claude Sonnet 4.6, se elimina por completo la alucinación, reduciendo el coste transaccional de estas interacciones clave a ![][image11] dólares y la latencia a menos de 100 ms.4  
2. **Robustez ante el Long-Tail con Voyage Rerank (Opción 2):** Para las consultas de texto libre en las que los usuarios utilicen variaciones coloquiales de LATAM, la pipeline híbrida aplica una búsqueda semántica de baja barrera (umbral de ![][image8]) para asegurar la recuperación del fragmento calibrado.5 Posteriormente, voyage-rerank-2.5 filtra y prioriza con precisión quirúrgica el chunk que contiene la etiqueta XML de bloqueo verbatim, superando los límites de los modelos de embeddings puros.5  
3. **Desintoxicación del Prompt de Sistema:** La arquitectura dual permite reducir el prompt de sistema conversacional de Queswa de 30KB a un máximo de 5KB.8 Al eliminar de su prompt persistente toda la doctrina y aforismos del negocio (información que ahora reside exclusivamente en el RAG), se libera el mecanismo de atención de Claude Sonnet 4.6.7 Esto incrementa de manera drástica su capacidad para seguir instrucciones y seguir la regla de transcripción XML literal \<verbatim\_lock\>.7

### ---

**Plan de Contingencia (Fallback): Enrutamiento por Herramientas**

Si las pruebas de control de calidad demuestran que, a pesar de la inyección en XML y la reducción del prompt de sistema, Claude Sonnet 4.6 continúa intentando parafrasear el texto bajo circunstancias imprevistas, se activará el plan de contingencia basado en la **Opción 3 (Intercepción de Llamadas a Herramientas)**.20

Bajo este esquema, se retira el flujo libre de texto para intenciones estratégicas y se obliga al modelo a invocar la herramienta servir\_respuesta\_calibrada(intent\_id) en su primera respuesta.21 El backend de la Edge Function en Vercel interceptará esta llamada estructurada de la API de Anthropic, buscará la respuesta maestro de la base de datos Supabase utilizando el parámetro provisto por el LLM y escribirá el texto directamente en el stream conversacional hacia el usuario final, cancelando la decodificación libre del modelo de lenguaje de forma determinista.23

### ---

**Métricas de Éxito para Validación de Calidad Conversacional**

Para auditar e inspeccionar de forma continua la efectividad del sistema conversacional, se definen tres métricas operativas cuantitativas en el pipeline de CI/CD:

#### **1\. Distancia de Edición Normalizada de Levenshtein (Fidelidad Textual)**

Se evalúa la coincidencia literal carácter por carácter entre la respuesta transmitida al usuario (![][image12]) y el texto académico maestro almacenado en Supabase (![][image13]). La distancia de Levenshtein entre dos cadenas de texto se define como ![][image14]. La fidelidad normalizada se calcula mediante la fórmula:

![][image15]

* **Objetivo de Aceptación:** ![][image16] (![][image7] de coincidencia carácter por carácter) para todas las consultas directas basadas en los chips canónicos de CreaTuActivo, y ![][image17] para variaciones coloquiales indirectas asociadas a las intenciones clave.

#### **2\. Latencia al Primer Token (TTFT)**

Tiempo transcurrido desde que se recibe la petición HTTP POST en el backend de Vercel Edge hasta que se transmite el primer delta de texto formateado hacia el cliente.20

* **Objetivo de Aceptación:** ![][image18] para consultas críticas resueltas mediante bypass del enrutador de intenciones 4, y ![][image19] para consultas de texto libre procesadas por la pipeline del Reranker.5

#### **3\. Eficiencia de Tokenización y Coste Transaccional**

Se monitorea el volumen acumulado de tokens de entrada y salida consumidos en los turnos conversacionales.27

* **Objetivo de Aceptación:** Coste medio por conversación ![][image20] en las interacciones de la home de CreaTuActivo, respaldado por la resolución por bypass directo de al menos el ![][image21] del volumen de tráfico inicial.4

## ---

**Sección D — Plan de Implementación**

A continuación, se detalla la hoja de ruta de ingeniería para reestructurar la pipeline de Queswa bajo el nuevo estándar híbrido de alta fidelidad.

### ---

**Paso 1: Migración y Estructuración de la Base de Datos Supabase**

Es necesario dotar al motor PostgreSQL de Supabase de una estructura robusta que soporte de forma simultánea la multi-tenencia del ecosistema (queswa.app, ganocafe.online, luiscabrejo.com) y optimice las consultas vectoriales.15 Se ejecutarán los siguientes scripts de base de datos en Supabase:

SQL

\-- Habilitar la extensión de vectores pgvector si no existe en la base de datos  
CREATE EXTENSION IF NOT EXISTS pgvector;

\-- Crear tabla estructurada de Intenciones Críticas (Multi-tenant)  
CREATE TABLE public.critical\_intents (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    tenant\_domain TEXT NOT NULL, \-- luiscabrejo.com, ganocafe.online, queswa.app  
    intent\_code TEXT NOT NULL,   \-- WHY\_02, EAM\_01, etc.  
    canonical\_response TEXT NOT NULL, \-- Texto verbatim calibrado por el Director Académico  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,  
    UNIQUE (tenant\_domain, intent\_code)  
);

\-- Crear tabla de enunciados de entrenamiento conversacional  
CREATE TABLE public.intent\_utterances (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    intent\_id UUID REFERENCES public.critical\_intents(id) ON DELETE CASCADE NOT NULL,  
    utterance TEXT NOT NULL, \-- Variaciones sintácticas coloquiales del usuario  
    embedding VECTOR(1536) NOT NULL, \-- embeddings de 1536 dim de Voyage AI  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL  
);

\-- Crear índice de proximidad espacial HNSW de alto rendimiento \[15\]  
\-- Optimizado para consultas de proximidad utilizando similitud de coseno  
CREATE INDEX idx\_intent\_utterances\_hnsw\_cosine ON public.intent\_utterances   
USING hnsw (embedding vector\_cosine\_ops);

\-- Registrar función almacenada optimizada para clasificación de intenciones en Supabase \[11, 15\]  
CREATE OR REPLACE FUNCTION public.match\_intent\_utterances(  
    query\_embedding VECTOR(1536),  
    match\_threshold FLOAT,  
    match\_count INT,  
    filter\_domain TEXT  
)  
RETURNS TABLE (  
    intent\_code TEXT,  
    similarity FLOAT  
)  
LANGUAGE plpgsql  
AS $$  
BEGIN  
    RETURN QUERY  
    SELECT   
        ci.intent\_code,  
        1 \- (iu.embedding \<=\> query\_embedding) AS similarity  
    FROM public.intent\_utterances iu  
    JOIN public.critical\_intents ci ON iu.intent\_id \= ci.id  
    WHERE ci.tenant\_domain \= filter\_domain  
      AND 1 \- (iu.embedding \<=\> query\_embedding) \> match\_threshold  
    ORDER BY iu.embedding \<=\> query\_embedding ASC  
    LIMIT match\_count;  
END;  
$$;

### ---

**Paso 2: Reestructuración de la Edge Function en Vercel (route.ts)**

Se modificará el backend Edge del chatbot (app/api/chat/route.ts) para implementar la lógica de control del pipeline conversacional de doble ruta de Queswa. El código del servidor Edge está escrito en TypeScript utilizando el SDK de Vercel AI 6 y el cliente de Voyage AI 13:

TypeScript

import { createUIMessageStreamResponse, convertToModelMessages, streamText } from 'ai';  
import { anthropic } from '@ai-sdk/anthropic';  
import { createClient } from '@supabase/supabase-js';  
import VoyageAI from 'voyageai';

// Inicialización de clientes y adaptadores de API  
const supabase \= createClient(  
  process.env.SUPABASE\_URL\!,  
  process.env.SUPABASE\_SERVICE\_ROLE\_KEY\!  
);

const voyage \= new VoyageAI({ apiKey: process.env.VOYAGE\_API\_KEY\! });

export const runtime \= 'edge';  
export const maxDuration \= 60;

export async function POST(req: Request) {  
  const { messages, prompt } \= await req.json();  
  const lastUserMessage \= messages\[messages.length \- 1\]?.content || prompt;

  // Extraer dominio de la petición para soportar la arquitectura multi-tenant  
  const reqUrl \= new URL(req.url);  
  const tenantDomain \= reqUrl.headers.get('x-tenant-domain') || 'queswa.app';

  try {  
    // Paso 1: Obtener la representación vectorial de la consulta mediante Voyage AI   
    const embeddingResponse \= await voyage.embeddings.create({  
      input: lastUserMessage,  
      model: 'voyage-large-2',  
    });  
    const queryEmbedding \= embeddingResponse.data.embedding;

    // Paso 2: Consultar la base de datos Supabase para detectar coincidencias semánticas \[11\]  
    // Se utiliza un umbral de coincidencia estricto para evitar clasificaciones incorrectas  
    const { data: matchedIntents, error: dbError } \= await supabase.rpc(  
      'match\_intent\_utterances', {  
        query\_embedding: queryEmbedding,  
        match\_threshold: 0.82,   
        match\_count: 1,  
        filter\_domain: tenantDomain  
      }  
    );

    // Si coincide con una intención del enrutador semántico, ejecutar BYPASS DETERMINISTA   
    if (\!dbError && matchedIntents && matchedIntents.length \> 0) {  
      const matchedIntentCode \= matchedIntents.intent\_code;  
        
      const { data: intentRecord } \= await supabase  
       .from('critical\_intents')  
       .select('canonical\_response')  
       .eq('tenant\_domain', tenantDomain)  
       .eq('intent\_code', matchedIntentCode)  
       .single();

      if (intentRecord?.canonical\_response) {  
        // Enviar respuesta verbatim directamente, sin llamar a la API de Claude   
        return createUIMessageStreamResponse({  
          execute: async ({ writer }) \=\> {  
            writer.write({  
              type: 'text',  
              text: intentRecord.canonical\_response  
            });  
          }  
        });  
      }  
    }

    // Paso 3: RAG Generalizado con Voyage Rerank (Fallback Semántico para Long-Tail)   
    // Recuperar candidatos iniciales de la base de datos con un umbral amplio para evitar falsos negativos  
    const { data: candidateChunks } \= await supabase.rpc('retrieve\_general\_chunks', {  
      query\_embedding: queryEmbedding,  
      match\_threshold: 0.20,  
      match\_count: 15,  
      filter\_domain: tenantDomain  
    });

    let contextDataStream \= '';

    if (candidateChunks && candidateChunks.length \> 0) {  
      const documentsToRerank \= candidateChunks.map((chunk: any) \=\> chunk.content);  
        
      // Llamada al endpoint de Rerank de Voyage con parámetros de ordenación \[6\]  
      const rerankResponse \= await voyage.rerank({  
        query: lastUserMessage,  
        documents: documentsToRerank,  
        model: 'rerank-2.5',  
        topK: 3  
      });

      // Construcción del contexto inyectando delimitadores XML nativos   
      contextDataStream \= rerankResponse.results.map((result: any) \=\> {  
        const chunkMetadata \= candidateChunks\[result.index\];  
        const lockAttribute \= chunkMetadata.is\_verbatim\_locked? 'locked="true"' : 'locked="false"';  
        return \`\<document id="${chunkMetadata.code}" ${lockAttribute}\>\\n${result.document}\\n\</document\>\`;  
      }).join('\\n');  
    }

    // Paso 4: Prompt de Sistema Reducido y Desdoctrinado (Desacoplado)   
    const minimizedSystemPrompt \= \`  
\<role\>  
Eres Queswa, la unidad de procesamiento conversacional y análisis patrimonial de CreaTuActivo.com. Tu comunicación se rige por un estilo analítico, técnico e impecable de "Lujo Clínico".  
\</role\>

\<instructions\>  
1\. Responde a la consulta del usuario basándote de forma exclusiva en la información provista en la sección de contexto dentro de las etiquetas \<document\>.  
2\. REGLA INVIOLABLE DE COPIA LITERAL: Si la etiqueta contenedora del documento seleccionado incluye el atributo locked="true", debes transcribir de manera exacta y completa todo su contenido, carácter por carácter. No omitas oraciones, no parafrasees, no dejes ideas a la mitad y no resumas el texto. Esta regla sobrescribe cualquier límite de palabras establecido en la conversación.  
3\. Si el documento seleccionado no incluye la propiedad locked="true", genera una síntesis objetiva estructurada en un máximo de 150 palabras.  
\</instructions\>

\<constraints\>  
\- No realices comentarios, introducciones o explicaciones adicionales fuera del texto verbatim si el documento está marcado como bloqueado.  
\- Evita pleasantries conversacionales.  
\</constraints\>

\<context\>  
${contextDataStream}  
\</context\>  
    \`;

    // Paso 5: Invocar Claude Sonnet 4.6 en Edge con el prompt optimizado \[20, 29\]  
    const coreModelMessages \= await convertToModelMessages(messages);  
    const textGenerationResult \= streamText({  
      model: anthropic('claude-sonnet-4-6'),  
      system: minimizedSystemPrompt,  
      messages: coreModelMessages,  
    });

    return textGenerationResult.toUIMessageStreamResponse();

  } catch (criticalError) {  
    console.error('Fallo crítico detectado en el Edge Pipeline de Queswa:', criticalError);  
    return new Response(  
      JSON.stringify({ error: 'Excepción interna temporal en el servidor de enrutamiento.' }),   
      { status: 500, headers: { 'Content-Type': 'application/json' } }  
    );  
  }  
}

#### **Fuentes citadas**

1. bug(anthropic): ChatAnthropic sends assistant prefill for models that don't support it \#36597, acceso: mayo 18, 2026, [https://github.com/langchain-ai/langchain/issues/36597](https://github.com/langchain-ai/langchain/issues/36597)  
2. Anthropic 400 Error on Claude 4.6 \- "Prefilling assistant messages is ..., acceso: mayo 18, 2026, [https://github.com/livekit/agents/issues/4907](https://github.com/livekit/agents/issues/4907)  
3. Build Hallucination-Free RAG with Verbatim \- Hugging Face, acceso: mayo 18, 2026, [https://huggingface.co/blog/adaamko/verbatimrag](https://huggingface.co/blog/adaamko/verbatimrag)  
4. Beyond Basic RAG: Improving Your Knowledge Agents with Intent ..., acceso: mayo 18, 2026, [https://promptql.io/blog/beyond-basic-rag-promptqls-intent-driven-solution-to-query-inefficiencies](https://promptql.io/blog/beyond-basic-rag-promptqls-intent-driven-solution-to-query-inefficiencies)  
5. Why Re-Rankers Decide RAG Quality: Choosing Between Open-Source, Cohere, and Voyage | by Mudassar Hakim | Medium, acceso: mayo 18, 2026, [https://medium.com/@mudassar.hakim/why-re-rankers-decide-rag-quality-choosing-between-open-source-cohere-and-voyage-1536fe4ca808](https://medium.com/@mudassar.hakim/why-re-rankers-decide-rag-quality-choosing-between-open-source-cohere-and-voyage-1536fe4ca808)  
6. Rerankers \- Introduction \- Voyage AI, acceso: mayo 18, 2026, [https://docs.voyageai.com/docs/reranker](https://docs.voyageai.com/docs/reranker)  
7. Claude's system prompt \+ XML tags is the most underused power combo right now : r/artificial \- Reddit, acceso: mayo 18, 2026, [https://www.reddit.com/r/artificial/comments/1s4odb8/claudes\_system\_prompt\_xml\_tags\_is\_the\_most/](https://www.reddit.com/r/artificial/comments/1s4odb8/claudes_system_prompt_xml_tags_is_the_most/)  
8. Claude 4.5 System Prompts: The Ultimate XML Metaprompt Guide ..., acceso: mayo 18, 2026, [https://promptsera.com/claude-4-5-xml-system-prompts/](https://promptsera.com/claude-4-5-xml-system-prompts/)  
9. Prompting best practices \- Claude API Docs, acceso: mayo 18, 2026, [https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)  
10. Why XML tags are so fundamental to Claude \- Hacker News, acceso: mayo 18, 2026, [https://news.ycombinator.com/item?id=47207236](https://news.ycombinator.com/item?id=47207236)  
11. Custom Hybrid GenAI-RAG for Intent Classification \- Sogeti Labs, acceso: mayo 18, 2026, [https://labs.sogeti.com/custom-hybrid-genai-rag-for-intent-classification/](https://labs.sogeti.com/custom-hybrid-genai-rag-for-intent-classification/)  
12. What is the best embedding and retrieval model both OSS/proprietary for technical texts (e.g manuals, datasheets, and so on)? : r/LocalLLaMA \- Reddit, acceso: mayo 18, 2026, [https://www.reddit.com/r/LocalLLaMA/comments/1q162mm/what\_is\_the\_best\_embedding\_and\_retrieval\_model/](https://www.reddit.com/r/LocalLLaMA/comments/1q162mm/what_is_the_best_embedding_and_retrieval_model/)  
13. Streaming Custom Data \- AI SDK UI, acceso: mayo 18, 2026, [https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data](https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data)  
14. REIC: RAG-Enhanced Intent Classification at Scale \- ACL Anthology, acceso: mayo 18, 2026, [https://aclanthology.org/2025.emnlp-industry.74.pdf](https://aclanthology.org/2025.emnlp-industry.74.pdf)  
15. pgvector Explained: Complete Guide for Engineers Building RAG & AI Search | by Rohit Kushwaha | Medium, acceso: mayo 18, 2026, [https://medium.com/@imrohitkushwaha2001/pgvector-explained-complete-guide-for-engineers-building-rag-ai-search-f6a68a150583](https://medium.com/@imrohitkushwaha2001/pgvector-explained-complete-guide-for-engineers-building-rag-ai-search-f6a68a150583)  
16. Voyage Rerank 2.5 by Voyage AI on Vercel AI Gateway, Specs, Pricing & API — FAQ, acceso: mayo 18, 2026, [https://vercel.com/ai-gateway/models/rerank-2.5/faq](https://vercel.com/ai-gateway/models/rerank-2.5/faq)  
17. Ultimate Guide to Choosing the Best Reranking Model in 2026 \- ZeroEntropy, acceso: mayo 18, 2026, [https://zeroentropy.dev/articles/ultimate-guide-to-choosing-the-best-reranking-model-in-2025/](https://zeroentropy.dev/articles/ultimate-guide-to-choosing-the-best-reranking-model-in-2025/)  
18. Why Cohere Rerank Is Better Than Voyage AI for Retrieval Quality | Alongside, acceso: mayo 18, 2026, [https://www.alongside.team/blog/cohere-rerank-vs-voyage-ai-retrieval-quality](https://www.alongside.team/blog/cohere-rerank-vs-voyage-ai-retrieval-quality)  
19. Best Rerankers for RAG in 2026: 7 Models Compared \- Future AGI, acceso: mayo 18, 2026, [https://futureagi.com/blog/best-rerankers-for-rag-2026](https://futureagi.com/blog/best-rerankers-for-rag-2026)  
20. Vercel AI SDK 6 Deep Dive: Features \+ Tool Calls 2026 \- Digital Applied, acceso: mayo 18, 2026, [https://www.digitalapplied.com/blog/vercel-ai-sdk-6-deep-dive-features-tool-calls-2026](https://www.digitalapplied.com/blog/vercel-ai-sdk-6-deep-dive-features-tool-calls-2026)  
21. Vercel AI SDK 6: Streaming AI Chat with Next.js \- Digital Applied, acceso: mayo 18, 2026, [https://www.digitalapplied.com/blog/vercel-ai-sdk-6-streaming-chat-nextjs-guide](https://www.digitalapplied.com/blog/vercel-ai-sdk-6-streaming-chat-nextjs-guide)  
22. Tool Calling \- AI SDK Core, acceso: mayo 18, 2026, [https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling)  
23. Capturing tool calls and results while streaming with the Vercel AI SDK, acceso: mayo 18, 2026, [https://community.vercel.com/t/capturing-tool-calls-and-results-while-streaming-with-the-vercel-ai-sdk/32475](https://community.vercel.com/t/capturing-tool-calls-and-results-while-streaming-with-the-vercel-ai-sdk/32475)  
24. How to prevent some tool calls to be streamed while neatly saving everything in my db? · vercel ai · Discussion \#8551 \- GitHub, acceso: mayo 18, 2026, [https://github.com/vercel/ai/discussions/8551](https://github.com/vercel/ai/discussions/8551)  
25. AI SDK 6 \- Vercel, acceso: mayo 18, 2026, [https://vercel.com/blog/ai-sdk-6](https://vercel.com/blog/ai-sdk-6)  
26. createDataStreamResponse \- AI SDK UI, acceso: mayo 18, 2026, [https://ai-sdk.dev/v4/docs/reference/ai-sdk-ui/create-data-stream-response](https://ai-sdk.dev/v4/docs/reference/ai-sdk-ui/create-data-stream-response)  
27. Anthropic Messages API \- Vercel, acceso: mayo 18, 2026, [https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api](https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api)  
28. Anthropic Provider \- AI SDK, acceso: mayo 18, 2026, [https://ai-sdk.dev/providers/ai-sdk-providers/anthropic](https://ai-sdk.dev/providers/ai-sdk-providers/anthropic)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAA9CAYAAAAQ2DVeAAAMX0lEQVR4Xu3de7B95RzH8SdyS5QQGpKaIeQymBLqd1wSGXIb8QelJkJFSRjiMDKDcWcI6TfIZWJcB7mUkXtyH2pEqaSLGYYu7nk+1vO1v/t71m3vs9fZ+5zzfs08s5/LWmuvZ53z+63vWetZz0oJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG8XOOf0yp/1yWh5vAgAAwCzdMEH6eVnHnFw+Xz9WCwAAMCULOjDu0tTvuOyVquVuWspHurY+6w/lT2m+3w8AAGaME3u9b6V+x+YmOf2j5P3yF+Z0piuvtT77DgAA1glO7M10bA6IlTWeVz7v7ep2cvl54OcKAMAau3lO56Xqqs3+pW7aE/JROV2b07dzunGafjubwX3TYhyf9+X00JxuFBuCV+d0cE7Pz+lroQ0AAAzo36kKGvYu5R1KeZpAIq6n4G2a7WwmfcezDeGQnL5e8rdL4/uxjcs/MY3abLmbjZoBAMDQYpDVVGf+k9PpsTI7N1XrnBDqm7aDkbbjPRRdKYvfaWUFa08J9fcIZe8VoQwAAGasLlioqzOqPzVWptE6R9TUo91T09ofp/gz1hOodrXN2y6tXG6t9xUAgE0vnrib6rqckqp1bJ4wM+l2NqN/xooWOp47xsoan0ntx15tfwhl3eZ8T07vTdVtUHlxWrnc33K6VSnralzb9wAAMDP3ixUD2TNWLICPpuqE++FUnbDtRD/NSfiqNFrPHjhQ+lBO97GFMEZjCIfS9jP8Shq1X+byEtezsn5/lT8mjaYaeUOqAjwA2BD0FN6bcnpMKfvxIbOk2xf3j5UzdpfU7y98Lbc1p2ND/SL6YqyYEQ3QtsH88kOXXyR75PSvnK5Jo9tz8aTdl54O1brXpfGg7bV+IfzPHXLaNVbW0NOk8ptUfzu6SdfP0MYdHl0+zQUuL7bcO3N6csnb73XXdwDAuqHH32/vyvoPTrcdfHla8cRaV/6kK4sm4pyW3f54dGwItIwfpPz+UreIhtovBarx5yGxvIjq9huzd1KsqPGiVL0/1HzJ5bv0/Rlqub+X/Lbl87Pls8uVOT0rVgLAelT3n6YP2PT6mWlp3qRbuLL+Y/ffV7dt/VW/Gm0Bm7atdj8lgKk7DvOmV+w8KVbOUF3go0H514e6RWL7rKSrZZi9u+Z0UaysoWDI//7o9qN5VE4nNiQTf/fqKCDUcgoEtw9tALCp6D9DTUrpaQzIEH6a2v+T1uDmIQO2ugDFLOJf4U37GtUFoH00HY+6Omwe9nvRJ/mXv6v8AVdu88BULf+I2AAAqKexQfqPU1e/4tg1+085lu+UqkG9yu+XqsHgelJLZXsR9J3d8sYHbNZ2Vij7dfQXtS+/u+TfWMqiK3iq+2ZO55f8NAFbpOW2puqJM4118vXPTtVf/H5bukVjdXYM7PsUhNrx0hgs77ScvpqqKxr+1T5SN+DbrhJa0jp9+2THR1fQ/DaiujoAADBnGsfmT+AxQPFU1kMKvnx4KJtDQzleYVPeAjYrxytsdy/1Rk8L+oCtbv9WG7DFZays4Oi5NfX6PKem3vK/C2Wfj+MF9dJt0c/Ab9NombNdWduO+1tHV0Lick3HQ4FdE02XoJ+BT3rKcmtOH0zVFZbH2cIAAGAY30krgwpvkrKu2PnyNAGbnub06yg4sIDt5aFNVB4iYDvI5eN2fJ2lu7m2Z5S8lX3ersaJnga1dk0z8S7XJoelqt0H1A8rdV3iPjfVySdyumOsBAAA83N8rEgrgwpvkrIGzPtyn4BtF1cW3X716/grbJ9LK28batkDQ51pClBkp/IZv09UfmXJ6xbsr0qdLadPm8gzUpu/DRr7b98ruq1q7bodrDnHvDi9gQwRsClon3Zc3GalYQH6vexKAABMpe6EHYMKb5JyvMJmgY5RPgZsu7uyaE41v85fcnpzyds8Wp7KdjWsjtqfFitT9Q5KU7dN2TJWO6rXp5/a4Ak53da1tQVsmqnd6KEL336pyxu1v82V9WSeX0eBVhwLJ5rDrK5fsU40bg8AACwQO2nbSd6fwPXuPpV/ndNj02jSUV0pe0BOvyjly8vyV5fyj0u7BSDfyOntJa+k7dq2lbRt2Sena9NoHJfRMnqSVWOj3lrKugokmuz1LTndMqe/ljale5X2OgpINHv6rXO6TRoP1kS3Ya/I6fGpCiifWeqXUrVt3S7UBMA/KvVyVU6fStU+PqfU2fHScag7XqKyrpwtp/HgVdQWafuq1/g2fephC7+cnyE+smNj6/jkxfKQFEga+5n29aA0mojZP60obW19aH0zzfpr4bhUjWdcr2lacTvrLQEANpgbcjogVgaa10rLeT8I5Uk8PY2/m3Foft/1h8EktuS0b8lrln2vrc1Tf7UP8RhqfdO2/jx9N1ZM4YxUzZeoB0Z09Xooh6bqGH88Nkwo/pymcWaq/lDTpN32Cquh6I9D7bMfdwoA2GB0hShe/YvqArZYnoTWXcsHDvy+ThoYLaVqDJ9c5OplKTW3Rd9LK4/Zkst3rT8PGutpr5LTsAG9kkm3+g9JVRCqB12akj3oYuMUv1A+f1s+h6BpfkRB+WreZrJcPn2f1d++fTb25LYC1aHoLoKJv18AgA1GE4xqKo06emDBrg4p6UT4kLElJqMndP1rytaCP5FNGjA8PKf9S95PnSJtbZHdnve0vulafx4+H8raf80P2EbjQ7WcbtGb010+HoNZ0pPHsiWn1/iGCSyHcp8+vyqt7PORLj/rPr8jjf49+odMZv09AIAFpNf8rIXVBHvTagvYNN/feTn9OY2CL7+8ZslXACCXuHppa5OjUjVe8iNpNA+hp/VN3frzpvGVnq6Kqg96AXoXf+vT+q0HWTQ+VJM/Dyke50ksh7L1uY+6PuvJbo231fjTWdL2/XHUE8SnuDIAAOuOP+Fe5PJ7p6pNn7JDKceAbank4xO1bW1xO5oaJp74fcAW15+3T8eKQg/BqB8ak9Zl5/JpTzOL5v4b0qRjFL3lWFFM02ebIzHmZ0X7Y7d9H5lGUwIBALBuNQVsMaiqq2sLypraXpKqbfipUa4rdd6iBmx75fSTWOmoH3rd3KI52eUPd/m+4s/HW7Q++33VmELR0AYAANattQ7YbBtHuLr1FLBdGStqqC/+FWprSe/FtX3UrUY7rnbc43Huo2sduxo7rz5rwmvrs/bDHjbwfe7qAwAAC82fyPwYtrqTXKxrCsqkqU1jibQNf8Vn0QK2pVhR7JnGJ2FuMsnYrlnSuDrNhWi0Dxon2MdSrHCWY0WNefVZwWLss8asAQCwofiTrJ/WQ9M1qM2mY9i2lGPAtqXkL3H10tambfi3OcTtig/Y4vpDsrF6dT4WK1poG5rgei3pO/1VLpVPcuU2TX1ejhUtFqXPAABsOP4Ed6HLyx6pGpukZXRlKQZWfuqOGFS1tel9sPYWCt3Csytscdsmrj8Um1xV+/F731DEd8u2mUfgEL/Tl21OvCbx+Ju6uiaTLDsr8TtjWf3WLVMAANY1f4I73+XrxJO6gqr9Sv5iVy9tbX34gO1il18LdnXR63rjhRcD3y7xu5qck9qX9W2vy+l6V+6ylNq33WWoPre96k1in/XmhH3T6HV7AABsCP6E9zOXjyxY80HbljSaOy6+JaGtrQ+tb6ZZf7X09oVTXVmBQx8vixUNto8VPbUFL6J2vZ1DVwiXSp3eyNDnKc6zSzJd32X6Ljdkn20ZfW4t+b79BgBg4fmxZOe6fHRQqq5cPDiNJhJW3uZpu6B8mra2PrS+mWb91dLt4GtKflff0EJTR7QdQ7Obyyuwuqcrd+kKXoxf7rRQbmPLLfvKFurzdrGyxm4u/8ecDnPlLn33PZqk3wAAYJ2yk32fV2Ntk9PBsbKG3k9r29WrzTRubp9Rc6e+AUhc7suh3GSSgG2aPpuXhnKbuO4k+vYbAACsU4enKljQZxctd3Wq5gPTVbPLcrq8lNXm0xllHfFXOE/I6cSa5HUFL5rY98BUzfCvl7PL8v9buy2l7u8w1ucr0mR9/r7L69jG/ir5F9T33Z9ouXye5SsBAMDGsnuqgpAuu+T0gpxemNNxOR3vksqqPzanY8pyekrWKBjRC9L7miZ42TGNT4rcpc939O3z0WW52Gd7griPPvtTZ9J+AwAA1PJXkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAq/dfY2PvMkc5PwsAAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAXCAYAAABu8J3cAAABmUlEQVR4Xu2UPShGURzGD5Iw+UoSNqOkJB9JzAbCItmMkkRkYjUZLMoqWUwGq5GJklVksCuRj//z3udc532cN5f5/urpved3zj3973nPOc7l5GSn1nJm+bRcWMqKuzOza7lWSY5dMv+NpUb6CrS6ZEA12w1sl6cjsoHJ8Z4WUknfznYF2y3pCPJsORJ3aXkR9xsfLl7IueVB3I5LxhYBMSNugz4rmLjXxQuB2xM3QJ8yTDEUSmOevl58jCrLLZ+1EP83bAYOdNBPerFE0eMFmabvEx/jLXjWQrrplgMHmujXvNii6PKCTNDPilfwpSNBWwsZpVsMHKij3/digQKVh0zRj4kPwam6E6eFdNJh5UMa6be98Huk3wsyR4+jXQqcNkULwX0Etx440Eafrjg2GsR/Tg2OpQbvoEA8D3IcXKlTU3SXQOBGDDmlD8EGbhan6IoA3C9X4lbdz/mjX492erTc9xLrOAX9ennhatD3Yh9f4NDyzl8M0s0FTiwrKgn+jkfLvUsKebKMB/1+BXCDv1oOgr6cnJw/8wVrv3csCR6fQgAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAZCAYAAADuWXTMAAAA2UlEQVR4XmNgGAWjgEgwD4jvA/F/IGZEEheEiuEEhkBcDmWDFGYgya2GiuEE36G0MQNEITuSHIj/GomPAWqhdDcDpi0g/no0MawApPAFEp8ZKgbyFgz8AWIhJD4cgBQGIfHLoGLIAJ0PBuIMmBIfkcReQdkwjAFAgnpQtg6UvwEhzdAHxP1IfBSQwoAweRKU1kKS/8uAw79SaPydDJjOQ+eDASwVTYPyQSkMxPeAq2BgYIGKgcAVJHEGaQZEQuFngCiKREjDwRcgvowuCAKWQLwGiNvQJYYhAAB4yzSC+TgZVAAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAYCAYAAAAs7gcTAAAAiklEQVR4XmNgGAUDASYCcSoSvwOIa5D4YCAOxJeg7Fwg/gXE/6H8s0DcA2WDAUwCBHigfH0gtoCyI5DkGYyQ2GUMqJo5kNgY4BMDqmK8AKRwMbogDAgwQBQoMyDcq4UkfxWJzTCTAaKAE4jPQdmKUDmQJ1dA2WDAyABRAMKuDBAbYPw6JHWjgHwAAGFEHDJYgssXAAAAAElFTkSuQmCC>

[image5]: <data:image/png;base64,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>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAYCAYAAAD3Va0xAAAAtElEQVR4XmNgGAXEAhYglgJiQ3QJUsBMIP6PhCkCvAxUMoiZgUoGMTJQySAQQDZIF4hvA/E3IN4KxEwwRcQAmEEngHgJELMC8SokcaIBTMMCJDGyvIxLAy5xnACXBnziWAE+DbjEsQJ8GpDFYXx0cQYTIA5HkgCxtYFYH4u4AVTPOSD2h7LhYAYQvwTix1AMYtcCcRcW8R6oHmwuJwtQxSAnIL4OZd9HliAH/ALi8+iCwxQAAIjVRY/rA0G4AAAAAElFTkSuQmCC>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAXCAYAAACf+8ZRAAACL0lEQVR4Xu2Wz0sVURTHT9DCCjUqIrCFgpsKohIRcaFQ0FYU/AfcWFEYJLjJla6MQLBViiCUiwTdSSoIQuEPhCItWhdkFAmpkZLV98u98zpz5s57A0Eueh/48u73e87cOcyb+1SkyP/BWei0DQ2nbLCffIZ6ofvQmqlFVEG/bBjiDnTNhoq70FfoG9RuahHV0KK4G86aGmmF9pT/BO1C89BVqBnaEHf9cdUXY0zcRWyirsfLOV5DM8qvQs+UJ40SfzoXjCfr0LLyXVCpXx+GDkLnoMe5jgKkDV0myZsTZkeNt98UH8iC8uyZU74Juqw8Cd0rlbShX0h4I2ZDfn3Se35qpn0eMSXx97gPKlF+RfK8FiHShmaeNnSU96i1ZkTieZ3xes3X6ZHymfiboSfVWvNAkvmAuMPGQ31e5bYvE7zohg0l29A8/aEeDsi8whYMr6Bjyo+IOw8XVRaEm9+0oWQbmqc91DMoLuevQhq10KjyH6Buv34HHVC1BNz8lg0l29Bp7/SwhHONrnNA2z9hfAw2d9oQbEpyI8LsjV83eF/o18PC68uVr5dk/7bxMdh824agTZIbEWY1xrcoT7agLyaL4IAPTXZGkvdKHfqEuOZ7tuBhrUP5fp9pnkI/lI++6kqVaX7awGP3TbweT8T9/X8v7qXn50dxJ1dzSNxmS9BL6LuEDwhrfDLj4vqvxMs53kJHbOh5Ln9+egsexH8J/8vLB5/uDnTJFooUKbLP/AZv158LAgomsQAAAABJRU5ErkJggg==>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAXCAYAAABu8J3cAAABs0lEQVR4Xu2UvStFYRzHH28JUd5CwmaUlLwkA38BYZFsbJJEZGIxmAwWpUySlMlgNRhIkcwGi41Byfvve873Ofd3f/fFvebzqW/3/D7Py33Oc55znIuJyZ0KyZnkR3IpKUhuzsqm5EPyKdk3bZojF85/Lyk3bQHNLuxQxrqWdWHUIzMvki5e+3GIpoSulXUR66aoB3mVHBp3JXkzztIjeZJUKtftwj+5Vu5c8qhqsOVSFxyICeNW6bOBR4I+d8bbXcH1jqpBP33EIMWAlsI0fY3xFjz3KuP0QvxjWEs0B7TRj3oxT+Gfs2ecHtufD30uHIcFgk7WC1GPkHr6ZS/WKTq8ICP0k8b/BcZ8q3qIbk45UE2/68UMBVauGaMfNj4bx5Iv49pdOA92XlNHv+GFPyPYUs0UPV7tXJiVPFvpwu8R5lkxvoU+2vFSiv+8NZ5eyYNxeiyuM701Sd8SiG0thFN6DQ5wg3GNkhvjgB6LM3OrarDkUudPe/eoo1fLJbZY9ytWzuZC9cOnId389uYDDlx40PCLTvZwgRPJoqpx4u0CfOyZ8DuAL/i7ZC+5OSYmJj9+AXDeevdk9wyZAAAAAElFTkSuQmCC>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAXCAYAAABtR5P0AAADwUlEQVR4Xu2YWegPURTHj33f9y1FWZLsnnghInuECEmePUiieJBCCA+UtWxPHkTyQIQQRfZEKGtESPb9fP/n3t/vzPndmfk//P+/6V/zqW8z59w7c+/cuefcO0OUk5NTtUyyjgADraOGMoVVyzoNo6yjOujH+u6Ov1lDo8UFHrKmWWcNoxnrH2sQ6y1rTrS4wHHWNuvU1GddILnZKVPm+ciax2rFasGawfoQqSHX93TnqPeN9Ye1lDWGtdvVee3qZMUxkn7cZ9U1ZQBlm1mLWHNZs1mznIa4Oj9YC905wDXQOpJnXevsv6pOCYNJKmFAwTBnW/zNtbpGapRep+1O7ojIyIqWJH3q42z0CTYmn8Y+pxbSjK/TxJ1729PZHRHhjZW/BFx0K+C7E/Dhre5gjTZloC0lDz5YSdmmGz+Amrsk0elByjxNMsN7k0RyD9ZYio6TvY++BxhBKemmHclNdhn/defXWDuEraNthHfW6Qb9wWzUIL3ofq6gYhbQhJ4N46dtjX0ZJSwguWir8Z91fo21Q/yk4sKD6FhsyrKkO8kz3DT+1c7vU1GIF6zmxveMipMWUX9YlT2hlHQDfIfszH/q/G2Uz8+ae6zLJLuZuMXqEOud8q2hYq7MEv8Mmv3OP934PTNZ563TgcX0CEVnOSbdFmUngoZvB3wQFl/ta6Dsk86XBhazV8ruy/pKEl3lBv216QADCP8y4/egrLZ1JqDv35ok1do1tQDeFBrwK/5yksU2rVGEKeqssgUGRIgHoetfGHYK2OolgcjDt0JlhMUxjS4k7Xd0NhbFc8430vk0E6lyE8yDVNRI2fraX+o8QgeS/T1SSn+SnGUbrWNsvBjUSRrA9awJykbn8NHheaTOQ3RnTa6kQoMXoh5JqnhJ0rd9JM8Rl0IT9+mK8ayNyj7I+qTsPZT+JVyBbRSDBF9D5WvqfBeVT4O6WKg0qL9d2Xahz4KrVDrRPPBfsc4YdIQDfM9gMnumsoYruwI0YBuHrffjmLFflA3GkdSL+6y2uRXYwU/cB1cDoYiGHeqH/yA7agsCIIr0egjeUHTwMZ56Da0ADWAB9FxjvVc26MZ6bHx4s/h9EGIThT/EMMtOKDst7VQ16K8e/J3G1uCXAsoO2AIDfiJiN2fZwPqs7L0USDsDSBp57o74xxNiPkk53jKOl6LFBZBu4gYVs8M/LBZcfF2WE7/gYxuMyEQkxNGepO4SW2DAP544cL0f8LJ85zywDkMvko6csQU1EERO0o4QLxuL7g1bkJOTk5OTk1MG/gM3TQExj6i9/AAAAABJRU5ErkJggg==>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAXCAYAAABtR5P0AAAD50lEQVR4Xu2YSYhVRxSGj+IY5yGOixYEB0QcMFklG4eFBI3iBC4UQV25EEQEJ0SEREyILrIwUSGoKxchkkUQDCJuxFlbJRIM0RgURRzinGjq66rz+tzT977uhf0eDfeDw3v/qbr16tY7p07dK1JSUvJ+meMdOUz2jg7K58E6eadjune0BxOCvUyf/wablm2ucCPYfO/sYPQJ9i7YlGD3gy3NNlc4GmyPd1q6BTspcbBjrs2yTWKf/4JtzjY1Qdvo9H1AsBcS+64LNivY96nP3dSnXvwkcR7Xg3VxbcqSYE8k9lvm2uBVsBVG0w/7QuK97kj6renTgqkSO/VL+qOkPcclmz6bgj02Gvx1Vg9Pn2RGvegvcU7jkmZOaILPci3YU6PPBDtlNHBdL6eVEemTDP/A+FvARZdyfFeM7hzsntEK/Uam74OTtni9Ueq73Wh0WholZqeySGIfMteCb4jTFjsGfCKtbDcfShzkO+c/l/zKPKcVfKOctlhNetd7u2E+RKPl6+RXrjqt4PvFadbPaov/M1qwXOJFu53/1+RXSC80pnv6+KQtr6W58MwItsq11ZMGifO96Pxbk1+3Ir1Pj/ffkuagJesPm7ab0sp2AzohH/l/Jv8g4/sx+bDzwf4xbRbaDwV7YHzbJR7J6g1z85H/Q/IvSPqPpD1+8YFiekSyUU7QfWN0VRjwco4Po/ha2B+1DZuYbc6FYva30WTMc4nZVWuYs98OWED865PmUIEmmpVhyecXPw87/kCJW62vqRX4pxhUK/4GicUWH4VWeSaxGAHRo5PpXemRD+d9pa803wBbGUe9apB5PCu0xcama6rB4YDfZzGBongi+T5NPvg92COjOTK3ZfHZinoabfu/Md8zDJV4vqfYEM3sWfZCthF/1GLi9OGaIr4M9pnRTI6HDoWbrEZDsLltNLt41egqcau4I3FuByTehz/vr5GYsdw70MdnjWV2sF1GH5T4nKDsk9afhJvgh+zDAVoLrWWLFEdDj2B/OR99vzXaF/p6cFqK78FCn9XeabAZDjzP2MDkxPix0U3kpRPansfRC41WVkpx9OZFiV/8qufgdsBnNKD9PPCx/Sprk68Isqi78/FcZBef9fQ1tGlQCqByNthDo2Gx5P84Pv90CF9JrCUeouxno4v+uPZC925lr9PA9oOPwFJ8MFp4ichpzrNTsifC/ZKz7UySOPjt9Mk7njx4j0E7A5JifLcnAoXtpmhRiQ69WQpuo2mrBVrwOQaTmWRCHrxOoJ9mysxscwbe8RTBtbrgNXnO+c07HGMkToR3RR0dMseeCD382RTdC76hpKSkpKSkpAb8D20LFBTO+t7BAAAAAElFTkSuQmCC>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAXCAYAAABu8J3cAAABuUlEQVR4Xu2UvyuGURTHD5Iw+RUSyqAskkUkhX8AYZFsMkkS+TGxGEwGi3o3SRalDAaLkYWQRRaJMlgUyo9znud7n3ue+973zWt+PnV67/mc8zzd5773XqKEhL9TynHM8cNxxpEXL2ell+OWwmd3nJpmn8KeG44SpxZQR2FDMfIK5PlRR2ZmOb5VPkXhs5pCuAbkBchrow7wxrHnuHOOd8f5kBe2eNy6yk85HlQubFD6hAMx6rgl+GwMkL/ng+JexlsqF7rgI3ogurVkJuDLHa85If9E7sl68zes2HJAI/yQETMQ7UaAEfgOx2teyT+Ra7K+DWPZS5oq+AUjViFajQCD8GOO10jdN5ELsr4P42lbDiiD3zZiEkJmrhmG73e85pH8E7ki65sxlpXXVMKvGWH2SKcRYBxejnYmMu2RO7Je7iMZL9pyQD18tOJFEP85Ncvk78nl1MTuEhGbWjBH8BrZwNWOkx73ZIk7VLlceJcqF+Yp/f3er5c8Olpkl9jte6LwuBpqKOyR29QgV4P7nO/jA3Y5vvArTe7mEg445lzJvHA8k13Fpng5wKyA3OCfHKl4OSEhITd+AYOAfHwiYqtDAAAAAElFTkSuQmCC>

[image12]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAYCAYAAAAh8HdUAAAAqklEQVR4XmNgGLJADYhnArEvklgJEhsFsALxPyCeDcR8QGwHxP+BuAaIPyOpQwEgBTboggwQ8Sp0QRBYwACRxAZA4iBXYACQBD5NWAFMUy+6BD7QzYDQCMMzUFTgAHkMmBpvoaggAFwY8PuTIRhdAAoWM+DQ5AfEBeiCUFDKgEPTWSBehy4IBX8ZcAQGzN08aOJrGfAknSdAzATEHxggmt9D6QVIakbBwAEAIrItoSGpzDcAAAAASUVORK5CYII=>

[image13]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAAAmElEQVR4XmNgGDlgMxD/JwHDAYgThiwAFUNRBAQayGJCDBAbkQETA0TBBTRxEHgEY2wFYkYkCRAoYIBo9EcTZwPiPhgnH0kCBt4zYDoTBASAWBxdEBlg8x9BwMwA0XQGXYIQKGeAaPRGlyAEPjOQ4UwQIMt/oOAmy3+zGSAaE9DEsYIgIP7GAIm7t1AM8ucvBjKcPAoGBAAAiastbKanIo0AAAAASUVORK5CYII=>

[image14]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAAAYCAYAAACyVACzAAADCElEQVR4Xu2XN+gUQRTGnxEEM0ZEQRFDY0BEEQOmxgRiK4hi6ERMYMJGVBCx0EKx+Ytgp2CjtdqJAS0EbSyMjQEFA8b3OTPeu+9mbvfudr0/cj/4YOeb2bezb2cniHTo8D8xn41uQG/VUDZTTGCjJD6perBJTFKdU6023m5zXRbvVQPYtLxR/fIqm5uqRWwa+qh+qs6rBqoWiuvXQdVH0y6LXVJ5pzyycLmGcZKjUYuMl+xnoD72i8Lfz2Yd0H5fxOPn9414R1V3yKtihNTeVDTvVGvZNHRJug/wMery8poNcTEwapnYM+ElpwpMbLGbiiQrfuzLB1J+jD3iRrFlhrgYp8gH99hQfqiOsBkYIukOHVc9VZ0wXk/VbNU01UzVEu8jzlyvxd4DmyQdPxCSdZIrGmQLG8pVcbEHc4Uyiw3lrOo7m4FYssI8Nt2Xd/oy6CVu0g0veMj7Y8R9FXhnvAduq16Ycgx8jBAvCJ0ughAvL/OkTvtYslC+FfGumPJp71kuqQaRh7mCY8XYLrUJe1LVojkQJzlSIoyS2vf6CydruC9vU400wvKNkWNBu8NUZuBdYDODZVJJWCvMERfDTiN5SD6Xk7XZl/eK67TVUtMOfJbKvVPE3cOgvotNwzo2PBelTqdzcl1cDOzbGiH5XE7WZF9G0rJA8tAWMV5RXeCL6gabnjWqHWx6sLIlO52TZkYn/qLkPaHS7i1QfmTKgdgcgrb3JT2JP1A9Y9NzV6rnQQt++dgkjzllA5sJ0DeeOrLAap5M1lRxlcOMF44aq4yH3S185pq4thO5wrNV0g8PX74/+ZclfcQJ92BVrsd6ce26yM8itnD94avqpbgvj50vzooBjLi3UuncSlNnwe46GtyQqn8ubt+GQyzaYKef9YIHxI36jVwh7oPjt0c8vAv0Qdx7pvrAfFMdY/Nfgo4uZ7MFVohb6cogb1JLA0eO2NmsWR6zURAYtQ/ZbAf43ZG0VlkglVND0bR9VFkaXZlijGajILD14dNH27GH7O5CP9VYNjt0KJ/fBkvR/vrdM7AAAAAASUVORK5CYII=>

[image15]: <data:image/png;base64,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>

[image16]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAAAXCAYAAADZYae+AAAEbklEQVR4Xu2ZSagVVxCGyzmKEpWQKE4PFIIYwcRkpUYcUHmgC0EQFAQXimJCFqK4CY8oJBGzSJwWDg/nWVR0oUQXhuC0SkAXZucQxAlHJCpq/e+cere6+vR93fc17xI8HxS36z+n6557qrr7nL5EkUgkEom8N3RnG2XFHHzI9qUVCzCEra8V20HZ8f63vC1gwkfe/1ppIZ5T+ty26ML2htw5+NTcZ7tmNMsRqnznNNNWC2XHK4NGtgNWbIMRbJfI/Y7fTZvmF7aXbA/Yxpu2BNUS+w0l2371/lmlZbGesuNWI1Qw1cZoKTvBZccrygq2p1SZg4PJ5qpMpOS8jTG+8JhtjfJfsP2k/ARtJcO2fWb8LNZS+tw8hArmA7bORsui7ASXHa89FC0Y9F9iNNxFLip/CqXz1D+gtRIqGJwgnFLHRfiZ0nHzECqYIpSd4LLjtYciBfMxuf741JzxuoACCuUJ2nwrglDBNFPlisbCtStbN7ZFbOvYfvBtGgwM+o/k1jpZBYPF8Da2q2xNyaYWbMHMZfuebbfSNPPY9rLN8n4owZPZ9rPdYtth2ix54tWLIgWDOQvNP3KrdRy/Ur4A/W8rAlswPb1vHwF92Lb4tnOm7Ti5JPf2Pm6DGIQd8CSv9fP+Ie9rbME0ec32G+m1pd7Hbkb66QQv8Jo8SlEQ8Ae39nDkjVdPMJa8BXOM0nMGNlJSx/ET5QvQsZZJIZNizRaMgDZdMBO8Zree+7yuga8XV6J9a3z7SGr2usaOQ4CuE/y513opDf5r5YuWJ14WuzJsJ7m7Gn7Ddrat5C68WsBYcJHl4Tyl5wzIxmWQ93H8sNLcCvTQ+cGGm5S/YELnA9zWtT7H+6PZPlEG7Q/VD74tGHtVzPT+QKUJ0KslGI9Xe/drT7yOBGPBdj8Pdv6FDeR0zAPA8aNKcyuhPLSABhsYW6qyCwZrEPjT2aYa+0L1C8X7zWh7jK+R79As9/p1tsVUed8jFI1XLzCWo1bMIGsNg/Wj1nH8n/IF6P9YEYQSVA30raVgkCj4eJFUjVA8uY0KUkBDlSZAn6H8y17DYlvA46jWeFngNUIRqwWMBWuTPIwj17+tXVJovgG0zVYEWSdkgb66YFDxofNtwQD4m4wGTqrj0HjsS0C8FYa/UGkC9Ebj31C+aBIPa4wi8eoJxoINRoivKHmnBug/22jPKLlmQT7sfHfyGnbGKWTy9BVYDfS9EtD0K+sBXrNxV3qtQWkoPr1g1skUQgvoEwENkwGtWWnw9bP4U6qsYXqQ2/6DvPHqBeYRY/nTNnhC83aakot7KYQGpQFo+n8/3JVTOydM2h1y7yawyL1N7j+brBU81hr3yPX/l9z/RRo872TQq6lyh4GtUv3GkntmSpsMFIswiY+xyFWApOH7oN9lG+51gN2VxEEfmRA9edDw+0T7zut4HX7BHwt54nU0y8jlBXOC34F5QN7slhcbA5jlL3K5OkzuNyCPlmHk2vCXD+7G+K5IJBKJRCKRSCQSiWTyDrFxqiXswTGiAAAAAElFTkSuQmCC>

[image17]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAAAXCAYAAADZYae+AAAE50lEQVR4Xu2Za8ilUxTHF+MeGcK4Do1bMuSaEsol5DJJqRmXSDIzGpLkUtLkkkuUS3xxeXMnUTPxYT7MlDQJ34QPI5FbQkTkftn/d631vuv8z36eZz/nnEKzf7V6z/rvvdd5zr6u/bwilUqlUqlsNGyR7GAWC9g+2VEs9mCvZHNZHINJx/vf8ncPc3Yy/4Sg5fhJhtt2MSfZX6Jt8DfyTbL3SWNektnvPJXKRmHS8cblRdFnQT9sQ2Vt7JbsXdG2j1JZ5DHROr8mu5DKBmgb2CtlsOx+89cGrYkHpTluG7kJ0/aMzKQHuDSe99XZXDAmm4vGnW8+FhZ8TIQulorW3dT8y2S4b8HnyRYE/2XRSZalazC4bCH5Tdwtw21LyE2YrWT2R3dROsCl9I23RLTNCi4YkdeTfUbaPdLdt+gv1MEij0DDYnaOSPZC8J3G+LkJs2P4/Gr43Ie7ZDhuCbkJ04e+A9zFqPFOFG17Jxf0BDEeJu1Y09s4T7TO+aTzeN+X7JfgO43xOQCYktkVjcR1M9Gt8XLR2X2LlUV2EdXvEM11miYMkmGcl+8lWzlYNA1PmMXJbk72dNAiFyR7Ntki83MDfFKy50VX6hNUxpTE68NByX5P9hQXFODHz02k7236uaRHMIaocw7pnic6Pvn+TLadaeiDb2dqEDxhtjafjwAEe8TK1lHZKtEH2db85aKdxBPGV90O5nsiF4EfJ8xK07geBgLaFebjNuP14gBfbJofpegM+HvO1FBK443KvGQ/JFvDBS0cJvr915C+s+nXkx7x3921w4APgv6a+Y14RTaeMA7K4oQ53jS+ej5negT+bRntKvL5SJoyPcLP4UCPA3y4afFmAf+P4LtWEm8cMGnxvaXHFHZG7h+ABQcdC7gN1Hkgo3FfgnizhcW0ZIBcgE+lfMLk2gNs61H3M/UQ0dXmBg2JnQOfJ8xDpju4icDP3RSgtw0wjlfe/caJV8LJonFu5YIODhBtdzXp/nqjK94NMvg7kY8iX+Hxgo/UY5Nk35vPdWbIFWIFTHrCIAeBf1qyU8iQqTu5eFglUXuG/Ih/R+Ra0zeIXjX5HO8br5SLRNsv44JCMIBofyPpflzieO0CO+ybydaL7hrcvx8nuz34wK/jWKhDcIAuUHeUCeMPsV/QcuTi+fsfxyfQ/KA50E8P/lumIdl2cCyMGq8E5BZodxYXjADiNN2ScjtiF2iHEyT6OfCu7WcWQW6A2kDdOGHwkifXnicMyP148Er4nHsefgnot4dLg+ZAP4P8T4Lvmsd7UvrFa+Ne0dsGktVJgd3wHdKuk+E+OloGd2qAOt8F318CIhVw4OOIY3AiZN8Me+fFFdgG6r6d0eLLn11N47i+8vYJGiZfTJjjYDq5BHp1RvvRtKmgwY850YEym8NsKXr9B6XxmsBNcXcWJ8BxMvxc8EuSWfgfBR9XZRxPESxgvgDgtsuxpjvtS9F3E9ii8HoY/7NpyryRa3wtWv8L0aw6Eq9mSMZ8h4HFM/hI0f9XeJn/gxLJqMfHs/h7AAwavg/6V8n2NR3g9uBxUMfP/Nh50PD7XPMEEsndG/bZKYn3b+A7Chblb8keHyyeBvkG5xyXiLb70P5mdwzRnRHl6H/8RWKM3ahSqfxXODTZmYW2v7WpbMTgv73HFNoe1qZSqVQqlUo//gGyTcEKSK0MvQAAAABJRU5ErkJggg==>

[image18]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoAAAAXCAYAAADUf9f5AAAD/UlEQVR4Xu2ZW+hPWRTHl2uKpJGUe5gY5JIoRf4xhJhiDHn7P3jwIrcX4kEkDy6Fkhga4cGLELmMQqbmaR68KHlyHZcwNUXu1re1t98667f3cc7/53/+ZH9q9Tv7u2/rv886+/YnSiQSiUQikfg6acf2oYRNl2p0KZCXZ2BnQI+ZpyX9tCU9KO7HKba9bENIxn0M23m2sbqQ43eSdu6wDTB5bcKPJA7Bcc9ipx1WGnjOtsI932c7rvJA6GUNDWioB22W0UEfypZvpJ+q6EXyQj8XsH9RtgzsWKaE8J5tpkrHxqpSfmFbZbSFJM4dMvpwtn3uOTQYsUH616R9oMwwuucsW1/3HGqvaD+NgA+npxULEPMNXCYZ6yNsa0yeZzPV158b0CpnLdtAo/1K4thBo4Or7jfkeGyQ9rN1UGkfKD8rDfzgfiewLXHPofaK9tMS4MNjkpfaEmK+ASyjeuYOgbo3rEii97dilcyzArOAxDGsk5bl7nd9RhVigzSaZO32hAJlINsmlR7vfhvppwzD2F5TeCkoQ8w38CcVCxQElAX6bis60OZStm1se5w2ie0o22RfiJlC8vdtUJoGe0gs9ehnNtVPIHXkBUoeeYOkCQXKbcoGSh5F+ylCE0lbGOQvQZ5vF0j2eAjIP0jKLdMFnHbaaAD6OSs6OlPtoHCT7Slbe7YuTjvD9pBqL/6Z0zWh9E9Gq2M+ScHWDhRrVQYKlja0YfdnjZLnGwJgo0r7F+k/GLxcpE98KlED+i0rGkJ946QFDZt9D2YbXW6kSQOMy1cTKHpGWU3VBMpKkro42bUGZX2z5fF8UqU90K9Z0WDbAn6sNeMCmq+Lky6W8EK0RaDg66oiULaQ1MV63Rrk+dbJClRfHs9YoizQD1jRYNsC2KdYbZTTMIN5sCf09WHvVF6UqgJF3xWUoWg/efiZZZHNaJCYb7g0g46jv8aWx3Ps1PO5WdC2BXAUt9oIp/lAwWZYb7KbSfKvKC1IVYEyx2YUpGg/RfiNpC1/kdgoMd8Gk+j2SgDaW5VGkNj6EwNaiFDfoRnF70n8VcJUkhtizS62l0arA5dBaCi2y47hHcVNZR4XSco1G70oRfspAzZ4uBHdajNKEnpZHuh6ul/nNCy7HtzjWO1/tn9UOkaobz/WmmlO6+3STS7d1Rcgefe4/AsCh3CMusd21/3itvM/qjVq2U5yHHtAUsfXe8T2SpUDO9ieULZ9XG7pLypGmX4aYRDbC5LjaxkwRto3PEPTIEhwNH5DtZfaLVNCwKyDPJxY8G+Tv7PZdXQnGVffN547kvTvxxrvFfcnmCVwV+J9RPtNJB/Idar51egH892AL7qfFROJRCKRSCQSicQ3xkdtFIfMygeNDwAAAABJRU5ErkJggg==>

[image19]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoAAAAXCAYAAADUf9f5AAAEJUlEQVR4Xu2ZWciNQRjHH2uKZEnK9sm+ZUmUIl+2EMqeu+9CciPbDXEhkrIVSrJFSG6EyFqIciEXbkiu7PuWIrvn38x4n/OcmeM9S+93ZH71dGb+M+/MvDPPO9shikQikUgkEqlOGrD9KsLGmsfokietkIGtHj1kjlLqqQbQlrZKO8m2k607mX4fxHaObbDMZNlLpoyHbF1UWr3Qk0yD0HDHXKsdFBp4x7bYhp+wHRNpwDdYPTwanoM2UemgA+XmL6ee+uIo+R3lutWlHcnJYfjJNkHEQ32VKdPYliptFpnG7Vd6H7ZdNuwbFN8Agmcq7hxlvNIdZ9g62rCvvLT1lAM+HD3QaWjD9oD8jnKZTF8fYluu0hzrKP/dpni0zFnBVqO0mWQatk/p4Kr99TU8NIC72RqJuHOUcUID6GQwjG2eDfvKS1tPKaANL8kMaimgXQPsr3YULKNy5vaB5+5okYzeWYtZMlULzAwyDcM6qVlkf1flqIbQAA5kayXiPkepYVsr4kPtbzn1FENvtq/kXwrSghkYs27IUS5SOkeBQ2mgb9eiBWXOZ9vEtsNqI9gOs410mZhRZN5vtdAk2ENiqUc9kyh/AsmjkKMUIjSAGp+jYLqWjlKItPWkoZZMWejkcmjBdtOGQ45ynsweDw55gEyehTKD1U4pDUA/q0VLU0oOCvfY3rA1ZGtmtdNszykZ+LdWl/jifZWWx3TKxlG0ZekoWNpQht6flQo2oI6Qo8AB1oi4G0j3wWBwET/+J0cC9PtaVPj6BSctaNjsOzDbyHz9VRygX6rGUeSMsoyycZQlZJ7Fya5SbKRkqQQhR/Gh3wXhEyLugH5NiwpdFnB9LRni0dyzOOliCU9FfTgKvq4sHGU9mWexXlcCTPt3lRZylCYqDvS7IIwlSgN9jxYVuiyAfYrWXPswgzng6O552A+RFiQrR5F3BcWQtp5CuJlljk4oEtxD4UuXhiUCZd+wcYBLM2g4+kv0uyAcOvX8bRbUZQEcxbXWz2rOUbAZlpvsOjLpV4TmJStHmawTUpK2njTMJlOWu0isBAvIlClnlG5W01cC0L6LOJxEv9twj+bD1y++GcXtSdxVwmgyN8SSbWyflZYHLoNQUGiXHcI1tJ1OUFwgk69O6WlJW08xYIOHDekGnVACONKjfb2UDk1O9yuthmXXgXscrX1kuyXiIXyO4vpaMsZq7W281sabuwxkxh6Xf17QIByjHrM9sr+47XxPSaGazWSOY0/JPOOee8H2ReQDW9heUW75uNySX1SIYuoph65sn8gcX4ulNdtrSt4PdxIfRDqcBEfjb5QMKo7VGsw6SMOJBX+bYAkrREsy/er6BeHGZMbNtQXjivsTzBJoFzT0JcqvJfOB3KakXZX4YP4L8EV30mIkEolEIpFIJBL5x/gNFweJKtzirokAAAAASUVORK5CYII=>

[image20]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG0AAAAXCAYAAAABQcHxAAAEDklEQVR4Xu2YWahOURTHlwiFooTi4RrLi/BClBuROSEviuTNmOkFJUmSZCg84SLzECkylekF5QEvEg8i8zxlZv3tvXzrLHvv79zvCun86t93zlp7n2+Paw9EBQUF/wedWe2sseDfpRHrJOsoq4nx/c80Zi1mTWc18LZRP71/gXrWEGEv6ytrA2sB6ybrYiaFoxM5+zfWKeMrx2TWfdZn1nLjs8xjTbHGAEtYr8mVR/Sc1UWlwf9p/2Xlu8p6yKpi9WZdYh0ml054TNlvvGM9Zb1Sto0/U9eB/uQ+ttQ6ArQn12FgBmu0f97G6uefQTVlK9PdvKfYx7qn3reznql3sIv1kUoNMTXrTrKHXJ6R1uHBDLJlHRuwgRoK26VcIT5RqQ1rzQRyH8ZUz8tp1mb/PI1cpyFU4jtHJJF/t6MfjXzB2EIgr4QebRtibEKlnTbMOhS2wVH2B8Ym2LQg1WkAPsz63Mwnl2mMdeTgLOutf5ZOA/jeUP/cyr/jV3PC21OsoXAa2BCGQ1TaabFBAL6Y91QnhOyp9GA1Ob+OTkHWkZuWiMeVgo7Bn70kN0Ol0zSLKFzgGgrbNRLyLKlGqLTTBlmHAiFMg3CMPBiwrY0vRKq8oC05/y3rEA6y3rM6WEeFYL2RQkF2YT3k7Zb1FLZrYpWN2UFtO006INVpH6yBsnWGsOEYmElRIlVeIZoGmwU4+lhHHRlP2QpcU75z3mZZS86OURYjVpGYHcCOUJ2XHeTyDLYORajTAHbBut4QBqklVV6hbBpsi5EAu6DfBRpqHOsAuW938/ad/t2C8Ay73WRoYhWJ2QHsGJx52Uouz3DrULyxhgCTqFQunN80qfIKedL8QGZIbUamppr1xD/jG7KZwVqJrTqIrWmbKGzXyBnHkqog7DOtMQHCOfKkBjDOY5rYWVHWJmzuNKnyAoRm+HFBkRvsWpBpmXWU4Ta5fPUpu3s8Q+48Bfr6NJXsHlGJUBrYYmcb+GZZY4KJ5PLEZmdz+rUxQ2US4FsRsKXyXCfnb2YdecCtBeK33UzEwIjr6Z91p2GL3MM/AxTIHikQcuwhGQ3XUL23oXBlYZtrjR74ZltjGZAHtxchcKxpamxIH7uugs/uyFOdJrMTy0idaEHu4JwH/GFHKnXaFtYjnYA5Ti7UCbgiQ74qZZNbEls5zKjd6h1rj00jtCTnW2kdZRhBLp/d/c1hHTM2IOUcYOyynltC9UIbSPpVxvdHkFAH4Q4yxBVy55r9FG4ggPs7NKAF57UbrPPk8tqRj/UTM+Uu647/xTqEfHnBeQtRBt9/4X8XZlKUkA6QuiCy4NfOVmkTEQYgyoR2wB1kbG38Y+jwWPAbQfxEeMkjG5cL/hKI+b1yqqvPU1BQUFBQ8C/xHbCWVB4TCVHOAAAAAElFTkSuQmCC>

[image21]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAXCAYAAACBMvbiAAABwklEQVR4Xu2UPSiuYRjHrxw5p4iURVFCIgaD6ZRJSklSykcxMRltymJhMDCcs5iUzaaTjcnnYFAkYhEyKBYfifj/e+7ndT2X+35RjlLvr3499/XxPPf9fN0iGb6eNpvwUG8Tn00tvHPHB9iQLKc4gB02SbbhBhyCfbAHdsMuZ8yVqxfCAtgJL1WdPMEKN2bfLXyEw7AZzriec9fzChZD6slsjZaoOmEuFBe7I59cEJ7QKNGjrYTlTt+Fx+Ff2GRqpEj852hGJPB6YrZsAqzDOpOzF/Zhe3ScLWleT4jfcN4m5fVEPu5hrxvz6Q2a2ocJTco8/4JduCbR38K7tbBvDl6o3BhsV/G7mHX64CQ/Vbzocm+RA89UXANv4LLKeeHFy2wyQLVE/aO2YOATjMmXlxvIhXuqlmBA0t/pDxNnSdQfvCCYgK0qPoYLKj5U4wT8HkKL4Ums/VK5PJdbUTkNe09Mjv1/VDylxgnYGFoM7+ja5Fok6o//Hgt3XotdzLQaJ0i3mFJ4ZHLcSbnd+5gU/8a4Cf+pOPiauBD9sVn6Jeo5dcfVZDkFX09oEv6N+gPeUbX/wr5NGKok2gCXbCFDhm/LM/iMdB2mEwfaAAAAAElFTkSuQmCC>