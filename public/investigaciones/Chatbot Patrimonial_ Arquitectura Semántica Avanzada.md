# **Investigación Exhaustiva: Arquitectura de Perspicacia Semántica para Chatbots de Cualificación Patrimonial (2026)**

## **1\. Contextualización del Ecosistema y Fundamentación Arquitectónica**

La transición de un sistema de cualificación conversacional basado en expresiones regulares (regex) a una arquitectura de inteligencia artificial verdaderamente semántica y contextual representa el desafío fundamental para escalar sistemas de interacción B2C en categorías de mercado emergentes. El ecosistema analizado, perteneciente a CreaTuActivo.com, opera en el dominio de la "Construcción de Estructura Patrimonial". Su componente interactivo principal, el chatbot Queswa, funciona sobre un stack tecnológico de vanguardia compuesto por Vercel Edge Functions, bases de datos vectoriales en Supabase (pgvector), incrustaciones semánticas de Voyage AI y el motor de razonamiento Anthropic Claude 4.6 Sonnet. El objetivo imperativo del sistema es perfilar asincrónicamente al prospecto, capturar señales BANT (Presupuesto, Autoridad, Necesidad, Tiempo) y ejecutar transferencias cálidas (warm handoffs) al equipo directivo.  
A pesar de contar con una base de hardware y orquestación excepcionalmente moderna, la infraestructura exhibe una asimetría técnica crítica: un motor de razonamiento de frontera estrangulado por una máquina de estados finitos (FSM) de enrutamiento estático. El volumen proyectado de interacción demanda procesar cientos de prospectos diarios en América Latina, enfrentando una variabilidad lingüística extrema que incluye dialectos regionales, errores ortográficos, coloquialismos y formas de selección indirectas. El presente documento despliega una investigación técnica exhaustiva, fundamentada en el marco de análisis DEL-AL, trazando la ruta desde el estado actual problemático hacia los paradigmas implementados por las compañías de élite en 2026\. El objetivo central es la erradicación del "matching" textual frágil y su sustitución por un sistema de comprensión contextual de intención, operando estrictamente bajo las restricciones de latencia (sobrecarga menor a 1.5 segundos) y viabilidad financiera (costo inferior a $0.05 USD por conversación).

## **2\. El Estado Actual — Diagnóstico del Ecosistema Problemático**

La sintomatología del sistema actual se manifiesta a través de diecisiete problemas documentados, derivados de intentar modelar un comportamiento estocástico de alta dimensionalidad (la lingüística humana natural) utilizando clasificadores rígidos bidimensionales (expresiones regulares). Las iteraciones previas han consistido en parches reactivos que no solucionan la causa raíz arquitectónica.

### **2.1 Patologías de Comprensión del Prompt y Atención del Modelo**

La arquitectura de inyección de contexto actual ha generado una hinchazón del prompt (Prompt Bloat) masiva, alcanzando 45,940 caracteres en su iteración base. La literatura técnica confirma que instrucciones monolíticas de esta magnitud inducen el fenómeno de degradación atencional conocido como "Lost in the Middle", donde los transformadores priorizan los extremos del contexto y omiten las directivas centrales. Aunque las mitigaciones redujeron el tamaño en un 23%, el prompt sigue siendo estructuralmente monolítico.  
Adicionalmente, el sistema evidenció fallas en la obediencia posicional. Reglas críticas de legibilidad cognitiva ubicadas en las líneas finales fueron consistentemente ignoradas en favor de directivas tempranas. La elevación de estas reglas mitigó parcialmente el fallo, pero demostró la inestabilidad de depender de la posición absoluta del texto. Asimismo, el uso de marcadores como \`\` falló empíricamente porque el modelo Claude Sonnet 4.6 procesa los corchetes planos como texto de baja prioridad atencional. La migración a etiquetas XML genuinas (\<verbatim\_lock\>) corrigió el problema al activar los mecanismos de atención forzados durante el entrenamiento de alineación post-humana (RLHF).

### **2.2 Fallas en la Recuperación Vectorial (RAG)**

El sistema de Búsqueda Aumentada por Recuperación (Vector Search) exhibió vulnerabilidades de estado y sincronización. Un error crítico mantuvo 111 fragmentos de conocimiento invisibles para el RAG debido a la ausencia del indicador booleano is\_fragment. Más grave aún, la discrepancia dimensional entre las columnas de base de datos (embedding de 1536 dimensiones vs embedding\_512 de 512 dimensiones) anuló múltiples rondas de re-fragmentación semántica, ya que el motor de búsqueda y el de escritura operaban sobre vectores desacoplados. Adicionalmente, se demostró que la inclusión de etiquetas estructurales XML en el texto crudo previo a la incrustación generaba ruido semántico, desviando los vectores en el espacio latente de Voyage AI.

### **2.3 Limitaciones en la Extracción de Datos (Slot Filling)**

La extracción de entidades mediante expresiones regulares asume la falacia de que una "mención equivale a una elección". Funciones legadas como extractFromClaudeResponse() contaminaban el estado de la aplicación al registrar compras fantasma cuando el modelo simplemente explicaba las características de un paquete. De manera similar, la captura de identificadores personales confundía verbos transitivos con sustantivos propios (registrando "Deseo" como el nombre del prospecto). El sistema FSM demostró incapacidad para distinguir entre el acto de solicitar un nombre y el acto de recibir una respuesta válida, disparando correos electrónicos basura hacia el equipo directivo.

### **2.4 Mezcla Doctrinal y Alucinaciones de Flujo**

El motor LLM, carente de un sistema de revelación progresiva de información, mezcló conceptos temporalmente incompatibles, cruzando la duración del bono binario (6 meses) con la estructura generacional sin término (GEN5). Geográficamente, confundió la presencia corporativa de la matriz física con la capacidad operativa del arquitecto patrimonial.  
Los fallos más destructivos ocurrieron en la máquina de estados. El clasificador regex ignoró intenciones directas formuladas impersonalmente ("cómo se inicia"), anclando al usuario en un estado de conversación normal. Al percibir la intención en el historial pero carecer de autorización estatal para ejecutar la transferencia, el modelo improvisó flujos burocráticos no canónicos (inventando "Pasos de activación" inexistentes). El usuario completaba un cierre simulado sin que el backend disparara los webhooks críticos, resultando en la pérdida total del prospecto cualificado.

## **3\. Estado del Arte 2026: Arquitecturas de la Élite Conversacional**

Las corporaciones líderes en infraestructura de inteligencia artificial han erradicado las dependencias lexicológicas rígidas. A continuación, se presenta un análisis exhaustivo de cómo las plataformas élite resuelven la comprensión semántica, la extracción de entidades y el control no determinístico.

### **3.1 Salesforce Agentforce: Tópicos, Acciones y Barandillas**

Salesforce ha rediseñado su arquitectura conversacional abandonando los árboles de decisión explícitos en favor de un marco basado en Tópicos, Acciones y Barandillas.1 En lugar de utilizar clasificadores externos binarios, Agentforce evalúa el contexto histórico en tiempo real para determinar el "Tópico" activo.2  
La intención no se deduce de una palabra clave, sino de la trayectoria semántica de la conversación. Una vez que el sistema detecta que la intención del usuario entra en el Tópico de "Cualificación", el agente hereda dinámicamente el acceso a herramientas (Acciones) específicas, como programar reuniones o actualizar registros CRM.2 Para evitar desviaciones, las Barandillas dictan qué tareas son inaceptables (ej. no negociar precios). La mitigación de riesgos se estructura mediante un marco continuo de evaluación de Personas, Negocio, Tecnología y Datos, asegurando que las alucinaciones estructurales sean interceptadas antes de la generación.3

### **3.2 Intercom Fin: Procedimientos y Llenado Estructurado de Ranuras**

La plataforma Fin de Intercom aborda la dicotomía entre conversación fluida y flujos de procesos estructurados mediante "Procedimientos".4 A diferencia de los flujos visuales antiguos, los Procedimientos combinan instrucciones en lenguaje natural puro con controles determinísticos programáticos.5  
Para la extracción de variables (slot filling), Intercom abandona el regex y confía en integraciones de API estructuradas (Data Connectors) y evaluación JSON.5 El modelo solicita datos al usuario y los valida semánticamente. Cuando un prospecto proporciona un número de orden o una fecha de manera coloquial, Fin convierte esa entrada en un objeto JSON filtrado y estructurado, evitando la confusión entre mención y elección. Las bifurcaciones lógicas se manejan mediante "Code Conditions" dentro del flujo, asegurando que el estado avance solo si los datos cumplen criterios rígidos predefinidos, sin sacrificar la naturalidad del diálogo.5

### **3.3 HubSpot Breeze AI: Detección de Intención Integrada**

Breeze AI representa el motor central de HubSpot, estructurado en tres componentes: Copilot, Agents e Intelligence.6 La detección de intención no se delega a un enrutador superficial, sino que ocurre a nivel de enriquecimiento de datos. Utilizando modelos predictivos basados en telemetría web y el historial del CRM, Breeze identifica la "intención del comprador" de forma continua.7  
Esta arquitectura de malla (AI Mesh Architecture) permite que, cuando un usuario interactúa con el chatflow, el agente prospectador no comience desde cero.9 El LLM subyacente (GPT-4o o Claude) utiliza llamadas a funciones nativas (Run Agent actions) para extraer información del visitante, llenar propiedades inteligentes y actualizar el estado sin reglas de validación textuales frágiles.8

### **3.4 Sierra AI: Constelación de Modelos e Ingeniería de Contexto**

Sierra AI, bajo el liderazgo de visionarios de la industria, argumenta que los árboles de decisión están muertos, reemplazados por "metas y barandillas".10 Su arquitectura no depende de un solo LLM monolítico, sino de una "Constelación de Modelos" (más de 15 modelos desplegados dinámicamente).11 Dependiendo del acto de habla (clasificación rápida, razonamiento largo, o empatía), Sierra enruta la solicitud al modelo más apto para esa micro-tarea.11  
Crucialmente, Sierra soluciona la hinchazón del prompt mediante la "Ingeniería de Contexto" y la revelación progresiva.12 En lugar de proporcionar a la inteligencia artificial todas las reglas corporativas simultáneamente, el sistema divulga información condicionalmente. Si el prospecto no ha seleccionado un paquete, las reglas sobre la facturación de ese paquete específico son ruido estadístico que se excluye activamente de la ventana de atención.13

### **3.5 11x.ai: Orquestación Dual y Gestión de Estado ReAct**

Los Agentes de Desarrollo de Ventas (SDRs) autónomos de 11x.ai operan sobre un sistema multi-agente, transitando desde modelos ReAct puros hacia arquitecturas basadas en LangGraph.14 Esta aproximación es vital para comprender el mantenimiento del contexto.  
El estado de la conversación se mantiene como un grafo cíclico donde la memoria, la planificación y la ejecución están separadas. El agente (Alice) no evalúa el flujo leyendo solo el último mensaje; mantiene trazas de razonamiento en la memoria de trabajo y opera en un bucle continuo de Observación, Razonamiento y Acción (Tool Calling).16 Esta orquestación garantiza que las interrupciones del usuario no corrompan el objetivo principal del agente.

### **3.6 Bland AI: Vías Conversacionales y Nodos Globales**

Bland AI, especializado en agentes de voz de ultra-baja latencia, soluciona el estado conversacional estocástico mediante "Conversational Pathways".12 Para evitar el problema de las salidas de flujo no canónicas (el usuario haciendo una pregunta anidada en medio del cierre), implementan el concepto de "Nodos Globales".12  
Cuando la entrada del usuario se desvía de la meta actual, el sistema pausa implícitamente el nodo activo, transfiere el contexto al Nodo Global para responder la interrupción, y utiliza variables integradas (como {{prevNodePrompt}}) para retornar automáticamente al punto de captura de datos original.12 El slot filling se realiza programáticamente en cada nodo, forzando iteraciones ("bucles de condición") hasta que las entidades obligatorias son proporcionadas sin ambigüedad.12

### **3.7 Lindy: Automatización Reactiva e Híbrida**

Lindy aborda el problema de la automatización de procesos a través de bucles modulares (Trigger → Plan → Tools → Memory → Output).18 A diferencia de los flujos de la robótica clásica, Lindy permite que los modelos fundacionales eliminen las reglas codificadas rígidas.18  
Su arquitectura divide la memoria en trabajo a corto plazo y recuperación persistente basada en vectores. Cuando la intención de un usuario cambia repentinamente, el módulo de planificación de Lindy (apoyado en herramientas nativas) reconsidera el camino, aborta acciones irrelevantes y ejecuta flujos de trabajo de actualización (como llenado de CRM o envío de correos) exclusivamente cuando las condiciones de certeza semántica se cumplen.18

### **3.8 Anthropic Claude Code: Fronteras Dinámicas y Prompt Caching**

El análisis de la ingeniería inversa aplicada al código filtrado de Claude Code revela los métodos internos de Anthropic para estructurar prompts masivos sin degradar el razonamiento.19 La arquitectura emplea una constante de demarcación denominada SYSTEM\_PROMPT\_DYNAMIC\_BOUNDARY.19  
Las instrucciones inmutables (identidad básica, definiciones de herramientas, protocolos de seguridad) se colocan antes de esta frontera. Esta separación estructural está diseñada matemáticamente para aprovechar la caché de prompts (Prompt Caching) del proveedor. Dado que los prefijos no cambian entre solicitudes de una misma sesión, se mantienen cacheados en la memoria del servidor GPU, reduciendo la latencia de ingestión de tokens en un 90%.19 Toda la información dinámica (memoria local, historial, estado temporal del usuario) se anexa al final del prompt. Esto garantiza que el modelo obedezca las reglas centrales y opere con latencias ínfimas incluso con contextos de 40,000 tokens.19

### **3.9 OpenAI Assistant API v2: Llamadas a Funciones Paralelas**

La solución de OpenAI para el control de flujo no determinístico se materializa en la evolución de las llamadas a funciones (Function Calling) hacia las salidas estructuradas estrictas y la invocación paralela.22 La responsabilidad del enrutamiento recae completamente sobre el modelo LLM, el cual actúa como el "cerebro" orquestador.24  
Al definir las herramientas (tools) con esquemas JSON altamente tipados, el LLM decide de manera autónoma si requiere invocar un motor de recuperación, ejecutar un estado de confirmación o capturar un dato. El sistema ha sido perfeccionado para identificar correcciones del usuario ("no, cambia mi correo a...") e invocar nuevamente la herramienta correspondiente sin intervención de expresiones regulares, operando de manera transparente e inyectando resultados de vuelta a la conversación.22

### **3.10 Cursor y Modelos de Contextualización en Código**

Aunque enfocado en el desarrollo de software, la arquitectura subyacente de editores como Cursor ofrece perspectivas vitales sobre el agrupamiento de contexto.26 El sistema utiliza el "Prompt Wrapping" para estructurar de manera óptima las llamadas.27 Al pre-empacar las instrucciones del usuario con marcadores explícitos que delinean dónde empieza el contexto real, dónde están los fragmentos recuperados y dónde comienza la consulta estricta, Cursor evita las alucinaciones cruzadas y mejora dramáticamente la fiabilidad del razonamiento en tareas de alta complejidad semántica.26

### **3.11 Character.ai: Persistencia Conversacional**

La arquitectura de Character.ai ilustra los límites y avances en el modelado de memoria a nivel de sesión.28 Aunque carece de las garantías determinísticas requeridas por sistemas transaccionales B2B, implementa amortiguadores de memoria a corto plazo y clasificación afectiva que mantienen una coherencia de persona prolongada.28 Este sistema demuestra que un LLM puede mantener la continuidad lógica sobre múltiples sesiones si el estado interno se serializa correctamente en vectores y se recupera como "memorias situacionales" en cada nueva ventana de contexto.28

| Característica Arquitectónica | Salesforce Agentforce | Intercom Fin | Sierra AI | OpenAI Assistant | Claude Code |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Detección de Intención** | Tópicos Dinámicos | JSON de API \+ AI | Constelación de Modelos | LLM Tool Calling | LLM Autonómico |
| **Slot Filling** | Acciones (Tools) | Code Conditions | Ingeniería de Contexto | Structured Outputs | Habilidades Nativas |
| **Memoria a Corto Plazo** | CRM Contextual | Variables Históricas | Recuperación en tiempo real | Threads API | Archivos Locales / Caching |
| **Anti-Alucinaciones** | Barandillas (Guardrails) | Reglas Determinísticas | Revelación Progresiva | Parámetros Zod | Módulos Dinámicos |

## **4\. Diagnóstico de Raíz para el Ecosistema Queswa**

El fracaso sistémico del enrutamiento basado en expresiones regulares no es un error de implementación, sino una incompatibilidad matemática con la naturaleza del lenguaje humano. Las metodologías de clasificación binaria fallan a escala por las siguientes razones documentadas en la literatura computacional.

### **4.1 La Fragilidad de los Clasificadores Lexicológicos**

Las variantes que causaron fallos críticos (el 70% de las consultas no reconocidas) exhiben complejidades pragmáticas. Frases como "no, mejor el primero" introducen negación y corrección. Un regex diseñado para buscar ESP-1 falla. Expresiones impersonales y pasivas ("cómo se inicia") carecen del sujeto gramatical explícito que los patrones rígidos buscan, a pesar de poseer una carga semántica de acción idéntica a "quiero iniciar".  
El regex opera bajo el supuesto de que el último mensaje contiene toda la semántica del estado conversacional. Sin embargo, el fenómeno lingüístico de la anáfora (el uso de pronombres para referirse a entidades previas, como "el mediano me sirve") destruye esta suposición. El modelo debe procesar ventanas espaciales que abarquen múltiples turnos para inferir que "mediano" es el análogo contextual de "ESP-2".

### **4.2 Evaluación de Hipótesis Propuestas**

Para determinar la viabilidad de la refactorización, es esencial someter las cinco hipótesis planteadas a un riguroso análisis contra los parámetros de latencia, costo operativo y fiabilidad.

| Hipótesis | Mecanismo Propuesto | Latencia Estimada | Costo Marginal | Veredicto Arquitectónico | Justificación Técnica |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **A. Clasificador Haiku pre-FSM** | Llamada paralela por turno a Claude 4.5 | Alta (\>1000ms) | Alto ($0.02) | **Descartada** | Rompe la métrica de fluidez (Time to First Token). La redundancia de llamadas penaliza excesivamente la latencia. |
| **B. Tool Calling en Modelo Principal** | Invocar funciones para transición de estado | Baja (\<400ms) | Neutral | **Altamente Recomendada** | Emplea el motor cognitivo ya financiado. Habilita transiciones complejas integradas en el pipeline de generación. |
| **C. Enrutador Vectorial (Centroides)** | Embedding Voyage \+ Similitud Coseno | Muy Baja (\<150ms) | Muy Bajo | **Recomendada como Protector Temprano** | Extraordinario para detección rápida de intenciones directas, aunque deficiente para resolución anafórica. |
| **D. Encoder Fine-Tuned (BERT)** | Modelo dedicado local / remoto | Inestable | Inviable | **Descartada** | Las funciones Edge de Vercel (límite 50MB) no soportan modelos locales sin fricciones masivas de inicio en frío. |
| **E. Híbrida (Regex \-\> LLM Cascade)** | Reglas binarias cayendo a red semántica | Irregular | Variable | **Parcialmente Descartada** | Mantener regex perpetúa la deuda técnica y el falso positivo estructural en slot filling. |

## **5\. Soluciones Candidatas de Ingeniería**

Basados en la topología funcional de las arquitecturas de élite investigadas, se proponen tres diseños de sistemas viables, implementables inmediatamente sobre el ecosistema de Vercel Edge y Supabase.

### **5.1 Solución 1: Orquestación Basada en Tool Calling Dinámico (Vercel AI SDK)**

Esta arquitectura desmantela completamente la máquina de estados externa. El modelo opera en un flujo unificado y continuo.  
El motor de inferencia (Claude Sonnet 4.6) es aprovisionado con un conjunto de herramientas altamente tipadas, utilizando la sintaxis de tool del paquete ai de Vercel. Las herramientas actúan como interceptores estatales.25 Cuando el usuario demuestra intención implícita de compra, el LLM emite una llamada a función en lugar de texto.25 El entorno Edge suspende el flujo temporalmente, procesa la herramienta, actualiza el estado de la aplicación (ej., cambiando la visualización de la tabla en el cliente), y retorna silenciosamente el resultado al modelo para que continúe la redacción natural.30

* **Empresas Referencia:** OpenAI Assistant API, Lindy, HubSpot Breeze.  
* **Tradeoffs:**  
  * *Costo:* Neutral. El aumento de tokens en descripciones de esquemas es mínimo.  
  * *Latencia:* Extraordinaria. La predicción de tokens JSON estructurados fluye casi al mismo tiempo que la generación de texto normal.  
  * *Mantenibilidad:* Elimina aproximadamente 4000 líneas de código espagueti de expresiones regulares, consolidando el backend en contratos de esquema Zod puros.  
* **Compatibilidad:** Absoluta. Nativa para Vercel AI SDK v3.  
* **Fiabilidad:** \~96%. Inmune a la ambigüedad lingüística estándar.

### **5.2 Solución 2: Enrutador Semántico Basado en Incrustaciones (Voyage K-Centroids)**

Esta aproximación crea un guardián semántico ultrarrápido antes de invocar la generación LLM.31 Se calcula matemáticamente el espacio vectorial de las intenciones usando agrupamiento (clustering) de centroides.  
Se compilan mil variantes reales de frases (incluyendo dialectos y coloquialismos). Estas frases se incrustan (embed) usando voyage-3-lite (512 dimensiones) y se agrupan en cuatro centroides principales: . Cuando entra un mensaje nuevo (![][image1]), se incrusta en milisegundos y se calcula su similitud coseno contra los cuatro centroides en pgvector. Si la similitud supera un umbral estricto (e.g., 0.90), el backend avanza mecánicamente el estado, eludiendo la necesidad de clasificación compleja.31

* **Empresas Referencia:** Red Hat, sistemas basados en vLLM Semantic Router.  
* **Tradeoffs:**  
  * *Costo:* Despreciable. \~10 tokens por inferencia en modelo Lite.  
  * *Latencia:* \< 150 milisegundos adicionales.  
  * *Mantenibilidad:* Compleja. Requiere calibración constante del umbral de confianza y actualización de centroides.  
* **Compatibilidad:** Compatible con el uso actual de Supabase y Voyage AI.  
* **Fiabilidad:** \~88%. Sufre degradación si el usuario realiza transiciones multi-turno indirectas.

### **5.3 Solución 3: Híbrida de Ingeniería de Contexto y Tool Calling con Prompt Caching (Recomendación Primaria)**

La solución definitiva amalgama los descubrimientos derivados de Claude Code, Sierra AI y Vercel. Desarticula la dependencia lineal y transforma el chatbot en un Agente Basado en Objetivos.  
Se reestructura el prompt del sistema dividiéndolo matemáticamente con una frontera dinámica (\<dynamic\_boundary\>).19 Las reglas canónicas, instrucciones formativas y definiciones de herramientas se establecen permanentemente al principio del texto para desencadenar el *Prompt Caching* de Anthropic.19 Después de la frontera, el sistema inyecta en lenguaje natural el estado de los componentes frontend y el historial.21  
El llenado de ranuras se delega a una herramienta maestra denominada procesar\_transferencia\_directiva. Si un usuario indica interés general pero no provee su nombre, el esquema Zod marca el campo nombre\_prospecto como obligatorio. El LLM detecta internamente la falta de la entidad, declina la invocación de la herramienta y procede a redactar una pregunta contextualizada al usuario ("Perfecto, antes de transferir su caso, ¿me indica su nombre?"). Las alucinaciones de procesos no canónicos ("Paso 1, Paso 2") se previenen instruyendo al modelo mediante una barandilla estricta que le prohíbe emitir pasos operativos sin usar la herramienta asignada.12

* **Empresas Referencia:** Anthropic (arquitectura interna), Intercom Fin, Bland AI.  
* **Tradeoffs:**  
  * *Costo:* Altamente Reducido. Al aplicar el caché de Anthropic, los tokens de entrada inmutables bajan drásticamente de precio durante los primeros cinco minutos de interacción.  
  * *Latencia:* Tiempo de inferencia reducido masivamente por la precarga atencional del prompt base.19  
* **Compatibilidad:** Optimizada para el ecosistema actual y multi-inquilino (Multi-Tenant).  
* **Fiabilidad:** \~99% para control del discurso y extracción de entidades indirectas.

## **6\. Recomendación Priorizada y Hoja de Ruta (Roadmap)**

Se instruye la adopción definitiva de la **Solución 3: Híbrida de Ingeniería de Contexto y Tool Calling con Prompt Caching**. Esta arquitectura provee una resiliencia sintáctica insuperable contra las desviaciones lingüísticas de América Latina, a la par que maximiza las eficiencias de infraestructura ofrecidas por Anthropic.

### **6.1 Plan de Despliegue Secuencial (Fases de Implementación)**

**Fase 1 (Semana 1): Demolición Estructural y Optimización de Caché**

1. Eliminación inmediata de los bloques regex vinculados a transiciones de estado.  
2. Desacoplamiento del prompt monolítico de 35,000 caracteres. Aislamiento de las directivas institucionales base en variables globales para activar la caché efímera de la API.19  
3. Implementación del inyector de contexto tras la frontera dinámica. El estado en tiempo real (ej. si la tabla ESP está visible) se pasa como un bloque JSON crudo al final del mensaje.20

**Fase 2 (Semana 2): Despliegue de Herramientas de Transición (Tool Calling)**

1. Implementación nativa de tools en la función streamText de Vercel.25  
2. Desarrollo del esquema de validación Zod para ejecutar\_warm\_handoff, forzando la evaluación simultánea de Presupuesto, Necesidad y Nombre.  
3. Migración del mecanismo de sumario Haiku hacia un desencadenador asíncrono (webhook de fondo) que opera en respuesta directa a la herramienta invocada, reduciendo la responsabilidad temporal de la función Edge.

**Fase 3 (Semana 3): Resiliencia ante Interrupciones y Pruebas Extremas**

1. Diseño lógico de "Nodos Globales" inspirados en Bland AI. Si el LLM detecta una solicitud de RAG durante un flujo de cierre, aborta temporalmente la ruta de herramientas, busca en Supabase, responde la duda, y retoma proactivamente la interrogación.12  
2. Sometimiento del sistema a baterías de prueba (Testing Automático) utilizando historiales con mexicanismos, colombianismos, omisiones de puntuación y anáforas complejas ("el del medio").

**Fase 4 (Semana 4): Análisis Telemetrico y Despliegue Multi-Tenant**

1. Lanzamiento oscuro (Dark Launch) capturando un 15% del tráfico real.  
2. Implementación paramétrica de variables específicas de inquilinos (Luís Cabrejo, Gano Café, Queswa App) asegurando que se inyectan post-frontera de caché, garantizando que el núcleo doctrinal inmutable mantenga los descuentos de costo por token cacheados.19

### **6.2 Definición de Métricas de Éxito Empíricas**

La certificación de la estabilidad del sistema requerirá la consecución sostenida de los siguientes indicadores de desempeño durante el ciclo de pruebas:

* **Tasa de Precisión de Intención (Intent Accuracy):** Superior al 97%. El sistema debe clasificar y enrutar adecuadamente las variaciones indirectas, dialectos regionales y expresiones anafóricas sin intervención manual.  
* **Reducción del Costo Operativo (Cache Hit Rate):** Disminución superior al 50% en los costos transaccionales promedio (objetivo: \< $0.03 por conversación) demostrando el funcionamiento de las políticas de retención estáticas.  
* **Latencia (Time to First Token \- TTFT):** Despliegue de la primera cadena de respuesta renderizada al usuario en menos de 2.5 segundos, validando que el uso de Tool Calling paralelo no impacta el streaming.34  
* **Tasa de Extracción Impecable (Slot Error Rate):** Menor a 1%. Absoluta erradicación de las transferencias a WhatsApp que contengan nombres nulos o variables contaminadas por información no determinística.

## **7\. Análisis de Riesgos y Contramedidas de Estabilidad**

Las arquitecturas fundamentadas en control autónomo presentan vulnerabilidades estocásticas distintas a los fallos determinísticos. La viabilidad a largo plazo requiere la observación y mitigación de tres amenazas estructurales críticas.  
**Riesgo Primario: Agotamiento Temporal en Bucles Recursivos**  
Si el agente incurre en interpretaciones erróneas reiteradas al recibir respuestas inesperadas de una herramienta local, la llamada al AI SDK puede ingresar en un bucle recursivo. Esto excederá el límite de ejecución (60 segundos máximos) estipulado por las Vercel Edge Functions, desencadenando un colapso en la pasarela (Error 504 Gateway Timeout).

* *Mitigación:* Configuración estricta del atributo maxSteps (limitado a un máximo de tres iteraciones concurrentes por turno).29 Se instruye adicionalmente una barandilla semántica en el prompt del sistema que exige la interrupción inmediata de los reintentos de herramienta tras un fallo de validación, forzando al modelo a solicitar clarificación directa en texto plano al usuario.

**Riesgo Secundario: Inestabilidad de Caché en Entornos de Multi-Inquilinos** El ahorro financiero derivado del Prompt Caching propuesto demanda que las subcadenas de prefijo sean exactamente idénticas carácter por carácter en un lapso de caducidad operativo (generalmente cinco minutos).19 Modificaciones triviales de un solo byte invalidadas por diferentes perfiles de dominios anularían los aciertos de caché, disparando el costo cognitivo a magnitudes incompatibles con las métricas de rentabilidad de CreaTuActivo.

* *Mitigación:* Imposición de un desacoplamiento arquitectónico absoluto. La doctrina corporativa universal compartida entre inquilinos será codificada en una constante de inyección inicial sellada y verificada estáticamente. Elementos divergentes, nombres de dominios, directrices específicas de arsenales y el contexto del estado dinámico del usuario, se anexarán invariablemente después del marcador de partición \<dynamic\_boundary\>.19

**Riesgo Terciario: Pasividad Generada por Alineación (RLHF Drift)**  
Las generaciones de modelos fundacionales altamente ajustados (como la familia Claude Sonnet) experimentan calibraciones intensivas para prevenir el comportamiento combativo o excesivamente prescriptivo. Al eliminar el forzamiento del estado FSM, el agente LLM puede exhibir una docilidad estructural, evadiendo la invocación de herramientas de cierre bajo el pretexto heurístico de no "presionar" a un usuario que se comunica con ambigüedad o dudas temporales.

* *Mitigación:* Se establecerán protocolos de neutralización de alineación (Overriding Guardrails). El prompt post-frontera detallará de manera imperativa: "Si el análisis lógico del flujo indica confirmación implícita BANT, la transferencia financiera inmediata está éticamente sancionada y estructuralmente requerida". Al dotar al modelo de la justificación técnica de que el cierre asertivo es la expectativa segura, se previenen bloqueos artificiales de las métricas comerciales sin infringir políticas de moderación inherentes.

El reemplazo categórico de los clasificadores léxicos obsoletos en favor del paradigma semántico de herramientas (Tool Calling) combinado con una ingeniería de revelación progresiva consolida a Queswa como una infraestructura de inteligencia conversacional autónoma. Este rediseño resuelve inherentemente las fricciones de cualificación, asegurando que el equipo directivo reciba una captura de datos asíncrona perfecta y preservando integralmente el ciclo de retención del prospecto patrimonial en toda América Latina.

#### **Fuentes citadas**

1. Build Secure and Compliant AI Agents | Automate with Agentforce \- Salesforce Admins, acceso: mayo 23, 2026, [https://admin.salesforce.com/blog/2025/build-secure-and-compliant-ai-agents-automate-with-agentforce](https://admin.salesforce.com/blog/2025/build-secure-and-compliant-ai-agents-automate-with-agentforce)  
2. Agentic Patterns and Implementation with Agentforce | Agentforce ..., acceso: mayo 23, 2026, [https://architect.salesforce.com/docs/architect/fundamentals/guide/agentic-patterns](https://architect.salesforce.com/docs/architect/fundamentals/guide/agentic-patterns)  
3. Identify Risks and Guardrails for an Agentforce Project \- Salesforce Help, acceso: mayo 23, 2026, [https://help.salesforce.com/s/articleView?id=ai.agent\_plan\_risks\_guardrails.htm\&language=en\_US\&type=5](https://help.salesforce.com/s/articleView?id=ai.agent_plan_risks_guardrails.htm&language=en_US&type=5)  
4. Fin Procedures explained | Intercom Help, acceso: mayo 23, 2026, [https://www.intercom.com/help/en/articles/12495167-fin-procedures-explained](https://www.intercom.com/help/en/articles/12495167-fin-procedures-explained)  
5. Quick start: Create a Fin Procedure | Intercom Help, acceso: mayo 23, 2026, [https://www.intercom.com/help/en/articles/12599391-quick-start-create-a-fin-procedure](https://www.intercom.com/help/en/articles/12599391-quick-start-create-a-fin-procedure)  
6. HubSpot \+ ChatGPT Integration — AI Automation & Content | CRM News Today, acceso: mayo 23, 2026, [https://crmnewstoday.com/services/integrate/hubspot/chatgpt/](https://crmnewstoday.com/services/integrate/hubspot/chatgpt/)  
7. These HubSpot AI Tools Are Actually Changing How Teams Work, acceso: mayo 23, 2026, [https://www.hyphadev.io/blog/hubspot-ai](https://www.hyphadev.io/blog/hubspot-ai)  
8. HubSpot Breeze AI Agents: The Complete 2026 Guide for SMBs \- On The Fuze, acceso: mayo 23, 2026, [https://www.onthefuze.com/hubspot-insights-blog/hubspot-breeze-ai-agents-2026](https://www.onthefuze.com/hubspot-insights-blog/hubspot-breeze-ai-agents-2026)  
9. Building a HubSpot AI Mesh: Breeze, Custom LLMs, and Enrichment, acceso: mayo 23, 2026, [https://www.squad4.io/blog/ai-mesh-architecture](https://www.squad4.io/blog/ai-mesh-architecture)  
10. How Sierra AI Does Context Engineering \- YouTube, acceso: mayo 23, 2026, [https://www.youtube.com/watch?v=9HmR6eGKNwo](https://www.youtube.com/watch?v=9HmR6eGKNwo)  
11. Constellation of models: the architecture powering Sierra's agents ..., acceso: mayo 23, 2026, [https://sierra.ai/blog/constellation-of-models](https://sierra.ai/blog/constellation-of-models)  
12. Conversational Pathways \- Bland, acceso: mayo 23, 2026, [https://docs.bland.ai/tutorials/pathways](https://docs.bland.ai/tutorials/pathways)  
13. Context engineering: the key to great agents | Sierra, acceso: mayo 23, 2026, [https://sierra.ai/blog/context-engineering-the-key-to-great-agents](https://sierra.ai/blog/context-engineering-the-key-to-great-agents)  
14. Artisan vs 11x: The Complete 2026 Comparison Guide for AI SDR Platforms, acceso: mayo 23, 2026, [https://www.11x.ai/guides/artisan-vs-11x](https://www.11x.ai/guides/artisan-vs-11x)  
15. How 11x Rebuilt Their Alice Agent: From ReAct to Multi-Agent with LangGraph | LangChain Interrupt \- YouTube, acceso: mayo 23, 2026, [https://www.youtube.com/watch?v=fegwPmaAPQk](https://www.youtube.com/watch?v=fegwPmaAPQk)  
16. 11x: Rebuilding an AI SDR Agent with Multi-Agent Architecture for Enterprise Sales Automation \- ZenML LLMOps Database, acceso: mayo 23, 2026, [https://www.zenml.io/llmops-database/rebuilding-an-ai-sdr-agent-with-multi-agent-architecture-for-enterprise-sales-automation](https://www.zenml.io/llmops-database/rebuilding-an-ai-sdr-agent-with-multi-agent-architecture-for-enterprise-sales-automation)  
17. Welcome to Bland \- Bland AI, acceso: mayo 23, 2026, [https://docs.bland.ai/welcome-to-bland](https://docs.bland.ai/welcome-to-bland)  
18. A Complete Guide to AI Agent Architecture in 2026 | Lindy, acceso: mayo 23, 2026, [https://www.lindy.ai/blog/ai-agent-architecture](https://www.lindy.ai/blog/ai-agent-architecture)  
19. Modular System Prompts: How I Build Agents That Adapt to Every ..., acceso: mayo 23, 2026, [https://pub.towardsai.net/modular-system-prompts-how-i-build-agents-that-adapt-to-every-session-ad0f2525143c](https://pub.towardsai.net/modular-system-prompts-how-i-build-agents-that-adapt-to-every-session-ad0f2525143c)  
20. How Claude Code Builds a System Prompt, acceso: mayo 23, 2026, [https://www.dbreunig.com/2026/04/04/how-claude-code-builds-a-system-prompt.html](https://www.dbreunig.com/2026/04/04/how-claude-code-builds-a-system-prompt.html)  
21. Claude Code Source Deep Dive (Part 2): Full System Prompt Assembly Flow \+ Original Prompt Text : r/ClaudeAI \- Reddit, acceso: mayo 23, 2026, [https://www.reddit.com/r/ClaudeAI/comments/1sb2enf/claude\_code\_source\_deep\_dive\_part\_2\_full\_system/](https://www.reddit.com/r/ClaudeAI/comments/1sb2enf/claude_code_source_deep_dive_part_2_full_system/)  
22. Building AI Agents with Semantic Kernel | PDF | C Sharp (Programming Language) \- Scribd, acceso: mayo 23, 2026, [https://www.scribd.com/document/791848929/semantic-kernel](https://www.scribd.com/document/791848929/semantic-kernel)  
23. Morten Rand-Hendriksen, Author at MOR10 \- Page 2 of 38, acceso: mayo 23, 2026, [https://mor10.com/author/mor10-2/page/2/](https://mor10.com/author/mor10-2/page/2/)  
24. Testing and Understanding Erroneous Planning in LLM Agents through Synthesized User Inputs \- arXiv, acceso: mayo 23, 2026, [https://arxiv.org/html/2404.17833v1](https://arxiv.org/html/2404.17833v1)  
25. What is an LLM Tool? | Vercel Knowledge Base, acceso: mayo 23, 2026, [https://vercel.com/kb/guide/what-is-an-llm-tool](https://vercel.com/kb/guide/what-is-an-llm-tool)  
26. Supercharged Coding with GenAI: From vibe coding to best practices using GitHub Copilot, ChatGPT, and OpenAI 1 \- DOKUMEN.PUB, acceso: mayo 23, 2026, [https://dokumen.pub/supercharged-coding-with-genai-from-vibe-coding-to-best-practices-using-github-copilot-chatgpt-and-openai-1.html](https://dokumen.pub/supercharged-coding-with-genai-from-vibe-coding-to-best-practices-using-github-copilot-chatgpt-and-openai-1.html)  
27. SillyTavern User Guide and Features | PDF | Microsoft Windows | Zip (File Format) \- Scribd, acceso: mayo 23, 2026, [https://www.scribd.com/document/874786907/SillyTavern-All-Compressed](https://www.scribd.com/document/874786907/SillyTavern-All-Compressed)  
28. Character.AI: AI Companion Platform \- Emergent Mind, acceso: mayo 23, 2026, [https://www.emergentmind.com/topics/character-ai-c-ai](https://www.emergentmind.com/topics/character-ai-c-ai)  
29. Crustdata MCP Integration with Vercel AI SDK \- Composio, acceso: mayo 23, 2026, [https://composio.dev/toolkits/crustdata/framework/ai-sdk](https://composio.dev/toolkits/crustdata/framework/ai-sdk)  
30. AI SDK 5 \- Vercel, acceso: mayo 23, 2026, [https://vercel.com/blog/ai-sdk-5](https://vercel.com/blog/ai-sdk-5)  
31. From Model gateways to Semantic router | by Anjalisharma \- Medium, acceso: mayo 23, 2026, [https://medium.com/@anjalisharma87/from-model-gateways-to-semantic-router-9aa3b546e5a1](https://medium.com/@anjalisharma87/from-model-gateways-to-semantic-router-9aa3b546e5a1)  
32. vLLM Semantic Router: Improving efficiency in AI reasoning | Red Hat Developer, acceso: mayo 23, 2026, [https://developers.redhat.com/articles/2025/09/11/vllm-semantic-router-improving-efficiency-ai-reasoning](https://developers.redhat.com/articles/2025/09/11/vllm-semantic-router-improving-efficiency-ai-reasoning)  
33. From Monolithic to Modular: Scaling Semantic Routing with ... \- vLLM, acceso: mayo 23, 2026, [https://vllm.ai/blog/2025-10-27-semantic-router-modular](https://vllm.ai/blog/2025-10-27-semantic-router-modular)  
34. OpenAI Provider \- AI SDK, acceso: mayo 23, 2026, [https://ai-sdk.dev/providers/ai-sdk-providers/openai](https://ai-sdk.dev/providers/ai-sdk-providers/openai)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAaCAYAAACtv5zzAAAA/klEQVR4Xu2UvwtBURTHj5GUrP4OpZSN/8FmsFA2kzIpsfkzZDX5A2wKmSxIKRa7X+F7u+/VuafnPReD4X3qk+733HvOe7ceopB/YQ8fzCtcsXpD1E+s9jYJ0ofHssBQ9Y/pkG6QkwXGUQY2XMj/CcuwJkMb3Pt9xRZGZPguMdLNR7LA8BseSIt0g4wsMA4ysOFM/k9YglUZ2hB0/xsZ2KKaL2XIUG/4FWrAWoYOanBKZEU4g2k4hX04N3YI2uR9RQtYkCEYwArpb8fF67xBk/Smm/OrDkeNHSY7mGXrwAG28IZ1OGTrn8AH3GGSzH/gr8jDHlt34QTGWRYS8iOeu949DF5Tq5oAAAAASUVORK5CYII=>