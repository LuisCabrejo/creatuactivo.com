# **Informe de Investigación: Arquitectura y Control de Alucinaciones para Agentes de IA sobre WhatsApp (Estado del Arte a Julio 2026\)**

## **Resumen Ejecutivo del Entorno Operativo**

La transición de pruebas de concepto a operaciones escalables de agentes de Inteligencia Artificial (IA) en América Latina ha revelado que la fricción técnica y regulatoria define el éxito comercial en el año 20261. El ecosistema regional se caracteriza por una adopción masiva pero pragmática, donde el 65% de los consumidores interactúa con herramientas de IA, pero la confianza institucional sigue siendo frágil frente a la automatización invasiva o defectuosa1. En este contexto, el caso analizado —el agente Queswa, que opera sobre WhatsApp y alucina modelos de negocio inexistentes— es un síntoma clásico de una arquitectura de "agente libre" iterativo operando en un dominio cerrado sin los mecanismos de contención que exige el estado del arte actual.  
El presente análisis exhaustivo desglosa las causas estructurales de la invención de información en modelos fundacionales, evalúa las arquitecturas de mitigación dominantes y establece una ruta de ingeniería aplicable al ecosistema tecnológico específico de Next.js, Vercel, Supabase y Claude 3.5 Sonnet. La evidencia demuestra que la solución no reside en la iteración léxica de instrucciones (prompting), sino en la orquestación mediante máquinas de estados finitos, recuperación híbrida contextual, validación estructurada y el uso estratégico del almacenamiento en caché de contexto para mitigar simultáneamente las alucinaciones, la alta latencia y la contaminación del historial.

## **1\. Diagnóstico Estructural: La Causa Raíz de las Alucinaciones en Queswa**

El problema crítico reportado consiste en que el agente sugiere proactivamente modelos de negocio de la *creator economy* (cursos, membresías, consultoría) a prospectos con oficios tradicionales (jardineros, plomeros), ignorando instrucciones explícitas en el *system prompt* que prohíben esta conducta. Este comportamiento no es un error de configuración, sino el resultado predecible de cinco fallas concurrentes en la arquitectura de "cadena lineal" (webhook stateless a LLM).

### **1.1 El Conflicto entre la Memoria Paramétrica y la Recuperación Vacía**

Los Modelos de Lenguaje Grande (LLMs) como Claude 3.5 Sonnet han sido entrenados con billones de tokens donde la asociación probabilística entre "monetizar el conocimiento de un oficio" y "crear un producto digital" es estadísticamente abrumadora. Cuando un usuario envía una consulta vaga o una afirmación simple (ej. "sí", "soy jardinero"), el sistema de Generación Aumentada por Recuperación (RAG) ejecuta una búsqueda vectorial utilizando los *embeddings* de Voyage AI. Al no existir fragmentos en los 157 documentos del arsenal que vinculen la jardinería con el modelo físico de la empresa, la búsqueda falla en silencio, devolviendo un contexto vacío o irrelevante.  
Al carecer de memoria episódica (contexto inyectado), el LLM experimenta un vacío informativo. Sin embargo, impulsado por la instrucción implícita de mantener la conversación, el modelo recurre a su memoria paramétrica preentrenada, rellenando el vacío con el patrón genérico más probable. Las instrucciones negativas ("NUNCA propongas cursos") poseen un peso semántico débil frente a la presión paramétrica cuando no existe un anclaje afirmativo que guíe la respuesta.

### **1.2 El Fenómeno "Lost in the Middle" y la Jerarquía de Contexto**

La arquitectura actual de Queswa inyecta un *system prompt* estático al inicio, seguido por el contexto RAG, el historial reconstruido, y finalmente, instrucciones dinámicas por turno inyectadas por el *backend*. Investigaciones exhaustivas sobre el uso de contextos largos en LLMs demuestran el efecto de "Lost in the Middle" (Pérdida en el Medio)2. El rendimiento y la capacidad de atención de los modelos describen una curva en forma de "U": son altamente precisos al recuperar información ubicada al principio (sesgo de primacía) y al final (sesgo de recencia) del contexto, pero su rendimiento se degrada catastróficamente para la información situada en el medio3.  
Al inyectar reglas dinámicas de comportamiento al final del *payload* (ej. "responde al usuario con empatía"), el *backend* sobrescribe inadvertidamente las prohibiciones críticas del *system prompt* ubicadas al inicio5. El modelo prioriza la instrucción más reciente y desestima las restricciones de dominio lejanas. La falta de delimitadores estructurados (como etiquetas XML) agrava esta confusión6.

### **1.3 Contaminación del Estado por Historial Literal**

La reconstrucción del historial inyectando transcripciones literales de turnos previos provoca un aprendizaje en contexto (*few-shot learning*) no intencionado. Si el agente alucina en el segundo turno ofreciendo un curso de jardinería, y ese error se pasa como parte del contexto en el tercer turno, el modelo asume que dicha afirmación es un hecho validado por su "yo" anterior. El LLM carece de conciencia de error retrospectiva; asume el historial como la verdad base, creando un bucle de retroalimentación degenerativo que perpetúa y amplifica la desviación del modelo de negocio real.

### **1.4 Envenenamiento de Variables por Extracción Libre**

El reporte indica que datos erróneos (como un "arquetipo" psicológico) se guardan en el campo del nombre del usuario y luego se reinyectan, destruyendo la ilusión conversacional. Esto ocurre porque la extracción de datos se está realizando mediante lenguaje natural no restringido. Sin un esquema de salida estructurada (*structured output*) o el uso de llamadas a funciones (*function calling*), el modelo mezcla el razonamiento interno con la extracción de variables8.

### **1.5 Latencia y Arranque en Frío (Cold Start)**

La latencia observada de 10 segundos en la primera respuesta y 5 segundos en las subsecuentes es un síntoma de procesamiento redundante. En una arquitectura *serverless* (Vercel) sin gestión de estado residente, cada interacción procesa el *system prompt* completo y el historial desde cero, facturando y computando los mismos miles de tokens repetidamente. En un canal asíncrono pero de alta expectativa de inmediatez como WhatsApp, esta latencia rompe el ritmo conversacional.

## **2\. El Estado del Arte en Contención de Alucinaciones**

A mediados de 2026, la industria ha abandonado la premisa de que los modelos fundacionales pueden ser controlados exclusivamente mediante lenguaje natural. El estándar actual para agentes comerciales en dominios cerrados es la "Defensa en Profundidad", una arquitectura multicapa que combina orquestación estricta, recuperación correctiva y validación de salida.

### **2.1 Generación Aumentada por Recuperación Correctiva (CRAG)**

Para resolver el problema del RAG que falla en silencio (recuperación de baja relevancia que dispara la invención paramétrica), los equipos de ingeniería de alto rendimiento implementan el algoritmo CRAG (Corrective Retrieval-Augmented Generation)9. Este patrón introduce un "Evaluador de Recuperación" ligero antes de la etapa de generación.  
El evaluador analiza los fragmentos devueltos por pgvector y los clasifica mediante un grado de confianza en tres acciones deterministas9:

> 1. **Correcto:** La búsqueda vectorial trajo doctrina aplicable. Los fragmentos se refinan y pasan al LLM para su redacción.  
> 2. **Incorrecto / Vacío:** La similitud semántica es baja o nula (ej. consulta "sí, quiero saber más"). El flujo se intercepta. En lugar de permitir que el modelo improvise, el sistema dispara una acción correctiva, como una respuesta de contingencia dictada por el *backend* o una solicitud de clarificación estructurada.  
> 3. **Ambiguo:** La información es insuficiente. El sistema invoca una reescritura de la consulta (*query rewriting*) apoyada en el historial para intentar una nueva búsqueda interna.

Este mecanismo asegura que el LLM generador nunca reciba un contexto pobre que lo obligue a alucinar para cumplir con la directiva de responder.

### **2.2 Patrones de Respuestas Dictadas (Templated Responses)**

En flujos comerciales y embudos de ventas (*sales funnels*), el estado del arte determina que **si la respuesta debe ser exacta en términos legales o financieros, el LLM no debe redactarla**. Las plataformas líderes operan bajo un modelo híbrido: el LLM se utiliza como un motor de enrutamiento y comprensión de intención, pero el "payload" informativo se extrae de plantillas pre-aprobadas (*golden answers*)12.  
En implementaciones maduras en Latinoamérica, hasta un 60% de los turnos comerciales críticos (como la explicación del modelo de negocio, garantías y precios) son respuestas pre-escritas en la base de datos13. El LLM, mediante *function calling*, selecciona la plantilla adecuada y tiene permiso exclusivo para adaptar el saludo o el tono, pero se le prohíbe mediante guardrails alterar el núcleo informativo. Esto garantiza que un fontanero o un jardinero reciban exactamente la misma explicación estandarizada del modelo de distribución física, eliminando matemáticamente el riesgo de que el modelo ofrezca "membresías".

### **2.3 Recuperación Contextual (Contextual Retrieval)**

Una innovación crítica consolidada por Anthropic para mitigar fallos en RAG es la Recuperación Contextual15. La fragmentación tradicional (*chunking*) destruye el contexto; un párrafo sobre el modelo de negocio puede perder su sujeto cuando se separa del documento principal16.  
La técnica consiste en utilizar un modelo económico para generar un contexto sintético de 50 a 100 tokens para cada uno de los 157 fragmentos del arsenal antes de pasarlos por el modelo de *embeddings* de Voyage AI15. Adicionalmente, el estado del arte exige combinar esta búsqueda semántica densa (pgvector) con una búsqueda léxica dispersa (BM25) en un enfoque de búsqueda híbrida17. Esta combinación reduce la tasa de fallos de recuperación de información crítica hasta en un 49%, asegurando que conceptos precisos del modelo de distribución física no se pierdan16.

### **2.4 Guardrails de Salida y la Tríada RAG**

Las organizaciones que operan a escala implementan validadores que revisan la respuesta antes de despacharla a la API de WhatsApp. Estos *guardrails* operan bajo los principios de la Tríada RAG: Relevancia del Contexto, Fidelidad (Faithfulness/Groundedness) y Relevancia de la Respuesta19.  
La Fidelidad es la métrica crítica contra las alucinaciones: mide si las afirmaciones generadas están estrictamente respaldadas por el contexto recuperado20. En tiempo de ejecución, se utilizan herramientas como expresiones regulares de bloqueo (rechazando instantáneamente mensajes que contengan variaciones léxicas de "cursos", "e-learning", "membresías") o clasificadores rápidos (*LLM-as-a-judge* usando modelos ligeros) que vetan la salida si detectan una promesa no documentada22. Aunque esto introduce latencia, es un seguro obligatorio contra riesgos legales.

### **2.5 Memoria Estructurada vs. Transcripción**

Para solucionar la contaminación del historial, los arquitectos de software han migrado hacia la persistencia del estado en bases de datos (como el Checkpointer de LangGraph sobre Postgres) manejando el historial como un objeto estructurado, no como un documento de texto14.  
En lugar de reinyectar 20 turnos de chat, la máquina de estado mantiene un JSON verificado de los hechos consolidados del usuario:

JSON  
{  
  "usuario\_oficio": "jardinero",  
  "fase\_embudo": "explicacion\_modelo",  
  "objeciones\_tratadas": \["tiempo", "inversion"\]  
}

Esto purga las alucinaciones previas y proporciona al modelo un contexto inmutable y limpio para tomar decisiones en el turno actual14.

## **3\. Arquitectura Objetivo: Máquina de Estados con LangGraph.js**

Dado el *stack* actual de Queswa (Next.js, Vercel, Supabase, Claude 3.5 Sonnet), la recomendación técnica ineludible es abandonar el webhook monolítico y adoptar **LangGraph.js** para construir una máquina de estados finitos dirigida por eventos12.  
Esta arquitectura proporciona control granular, tolerancias a fallos y la capacidad de ejecutar flujos no lineales que los "agentes libres" basados en cadenas simples no pueden soportar24.

### **3.1 Diseño de Nodos y Enrutamiento (Workflow)**

El grafo conversacional debe estructurarse en los siguientes nodos atómicos:

> 1. **Nodo de Ingreso y Clasificación (LLM Rápido):** Al recibir el *payload* de Meta, un modelo de alta velocidad (ej. Claude 3.5 Haiku) clasifica la intención del usuario (Saludo, Consulta Técnica, Aceptación, Negativa). Simultáneamente, mediante *structured output* (Zod schemas nativos en AI SDK), extrae variables duras como el oficio del usuario y actualiza el estado en PostgreSQL8.  
> 2. **Nodo de Recuperación y Evaluación (CRAG):** Si la intención requiere explicación del modelo, se ejecuta la búsqueda híbrida (pgvector \+ BM25) sobre el arsenal con contexto enriquecido18. Un clasificador heurístico evalúa la similitud semántica.  
   * *Ruta A (Vacío/Baja Confianza):* El flujo se enruta a un nodo de *Fallback* que devuelve una respuesta inyectada por código, invitando al usuario a especificar su necesidad sin invocar al LLM generador.  
   * *Ruta B (Alta Confianza):* Los fragmentos validados avanzan al nodo generador.  
> 3. **Nodo de Generación Condicionada (Claude 3.5 Sonnet):** El modelo principal redacta la respuesta final. El *prompt* se estructura utilizando estricta jerarquía XML6. Las restricciones absolutas se colocan en el último bloque del *prompt*, inmediatamente antes del inicio de la respuesta esperada, mitigando el efecto *Lost in the Middle*.  
> 4. **Nodo Guardrail:** Una función síncrona escanea la salida en busca de palabras prohibidas o violaciones de la política comercial. Si falla, genera un *log* de observabilidad y dispara un mensaje de disculpa pre-configurado, gestionando el traspaso al operador humano.  
> 5. **Nodo Checkpointer:** LangGraph.js actualiza automáticamente el hilo de la conversación (thread\_id) en Supabase (PostgresStore), asegurando que el estado sobreviva a los reinicios de la aplicación *serverless*23.

### **3.2 Optimización de Latencia: Prompt Caching**

Para resolver la latencia crítica de 10 segundos observada en el arranque en frío, se debe implementar de forma obligatoria el *Prompt Caching* dinámico introducido por Anthropic31.  
Al definir el *payload* del mensaje, se debe inyectar la directiva cache\_control: {"type": "ephemeral"} en el último bloque del *system prompt* estático y en las definiciones de herramientas31. El Gateway de Inteligencia Artificial (AI SDK de Vercel) soporta esta funcionalidad nativamente34. Esto indica a los servidores de Anthropic que retengan los tensores computados (KV cache) en memoria durante 5 minutos (renovables)35. Dado que las conversaciones en WhatsApp suelen ocurrir en ráfagas de alta frecuencia, todos los turnos posteriores al inicial leerán el contexto estático desde el caché. Esto reduce el costo de los tokens de entrada en un 90% y reduce drásticamente el tiempo de procesamiento, estabilizando la latencia del agente en parámetros virtualmente humanos35.

## **4\. Análisis Comparativo de Tecnologías de Observabilidad**

Identificar una alucinación antes de que el usuario final la reporte exige telemetría en tiempo real. La observabilidad de LLMs es fundamental para capturar trazas, latencias de nodos individuales y ejecutar evaluaciones automáticas sobre el historial de conversaciones. A julio de 2026, tres plataformas lideran el ecosistema compatible con TypeScript y LangGraph37.

| Característica | Langfuse | Braintrust | DeepEval |
| :---- | :---- | :---- | :---- |
| **Licencia / Modelo** | Código Abierto (MIT)38. Opción de SaaS o Self-Host en infra propia. | Propietario (SaaS cerrado). Core administrado38. | Código Abierto (Apache 2.0). Principalmente un *framework* de testing37. |
| **Punto Fuerte 2026** | Trazabilidad profunda de flujos multi-paso (Agentes). Integración nativa con OpenTelemetry40. | Integración CI/CD impecable. Bloquea despliegues si fallan los *evals*. Evaluación de *prompts* iterativa42. | La plataforma más robusta para métricas de la Tríada RAG y ejecución local (Pytest/Jest)37. |
| **Latencia Añadida** | Asíncrona (ingesta en background). No bloquea la respuesta al usuario final38. | Proxy propietario en el flujo de solicitud, puede añadir latencia marginal (20-50ms)38. | Evaluaciones típicamente ejecutadas offline, pero las versiones online requieren cómputo. |
| **Métricas de Costo** | Unidades (Trazas \+ Eventos). Escala por número de interacciones (spans)38. | Multidimensional: Volumen de datos (GB) \+ Cantidad de Puntuaciones de evaluación38. | Core gratuito; plataforma Confident AI desde $9.99/usuario/mes44. |
| **Encaje con Stack Queswa (Next.js/Supabase)** | **Excelente.** Integración sin fricción con ecosistema JS. Permite retener datos en VPC si se autoaloja, cumpliendo normativas LatAm41. | **Alto.** Ideal si el equipo de ingeniería requiere optimizar constantemente y hacer pruebas A/B de *prompts*43. | **Medio.** Altamente recomendado para crear la suite de pruebas unitarias locales, menos útil para telemetría visual37. |

**Recomendación Arquitectónica:** Adoptar **Langfuse** para la observabilidad en producción y trazabilidad de los nodos de LangGraph.js, debido a su compatibilidad nativa con la asincronía de Node.js y la flexibilidad de despliegue que facilita el cumplimiento de normativas de datos sudamericanas22. De manera complementaria, integrar la librería **DeepEval** exclusivamente en los flujos de integración continua (CI/CD) para ejecutar regresiones automatizadas contra los casos de prueba (ej. oficios vs. membresías) antes de cada paso a producción37.

## **5\. Rendimiento en WhatsApp y Cumplimiento Normativo (LatAm)**

Operar a escala en América Latina no solo es un desafío algorítmico, sino que involucra una navegación precisa de las políticas restrictivas de Meta y las regulaciones locales de protección al consumidor.

### **5.1 Políticas de la API de WhatsApp Business (2026)**

En enero de 2026, Meta implementó restricciones agresivas, prohibiendo la operación de *chatbots* de propósito general o de dominio abierto sobre la API de WhatsApp, argumentando el abuso de recursos de infraestructura45. Las empresas que implementan agentes que operan como "clones de ChatGPT" sin restricciones enfrentan bloqueos irreversibles45.  
Sin embargo, el caso de Queswa se encuentra firmemente dentro de las excepciones permitidas, ya que es un agente orientado a tareas empresariales (explicación de servicios y captación)46. Para evitar sanciones, la arquitectura debe:

> 1. **Gestionar Opt-ins Estrictos:** Meta y las normativas locales requieren consentimiento expreso y demostrable antes de iniciar la interacción. No se pueden utilizar listas de difusión sin *opt-in* previo comprobable47.  
> 2. **Ventana de 24 Horas:** Respetar el ciclo de atención. Si el agente necesita contactar al prospecto fuera de las 24 horas del último mensaje del usuario, debe utilizar imperativamente una *plantilla (template)* aprobada por Meta bajo la categoría de Utilidad o Marketing45.

### **5.2 Experiencia de Usuario sin Streaming**

WhatsApp no soporta la transmisión de tokens en tiempo real (*streaming*). El usuario experimenta el silencio absoluto hasta que la cadena completa se resuelve y se entrega el *payload*12. Las prácticas óptimas exigen:

* **Señalización de Actividad:** Ante flujos largos (RAG profundo o llamadas a herramientas que superen los 4-5 segundos), el sistema debe disparar un estado de "escribiendo..." (typing indicator) o enviar un mensaje puente ("Permíteme verificar el plan físico adecuado para ti...").  
* **Fragmentación (Chunking) de Salida:** Los párrafos largos reducen drásticamente la tasa de conversión en dispositivos móviles. Si la respuesta final supera los 600 caracteres, el backend debe dividirla semánticamente y enviar múltiples mensajes secuenciales con un retraso programado de 1.5 a 2.5 segundos entre cada uno, simulando la cadencia de mecanografía humana.

### **5.3 Cumplimiento Normativo: Ley 1480 y Habeas Data**

En jurisdicciones como Colombia, la Superintendencia de Industria y Comercio (SIC) ha emitido directrices estrictas sobre el uso de la IA en el comercio electrónico51. Dos áreas representan un riesgo legal crítico para Queswa:

> 1. **Transparencia de Identidad:** La normativa y los fallos éticos recientes establecen que ocultar la naturaleza artificial del agente es una infracción de los principios de transparencia. El agente debe identificarse inequívocamente como un asistente virtual en el mensaje inicial52.  
> 2. **Publicidad Engañosa Contractual:** La Ley 1480 de 2011 (Estatuto del Consumidor) en Colombia tipifica que cualquier condición objetiva ofrecida a un consumidor es contractualmente vinculante55. Si el agente de Queswa alucina y promete que la empresa brindará "consultoría online" o "cursos", la empresa asume la responsabilidad legal de entregar dicho servicio o enfrentar sanciones por publicidad engañosa. Jurisprudencia global, como el caso del *chatbot* de Air Canada en 2024 (donde el tribunal obligó a la aerolínea a honrar una tarifa inventada por su IA), subraya que las empresas son legalmente responsables de las alucinaciones de sus sistemas58. Esta realidad convierte a los *guardrails* de salida deterministas en una necesidad de cumplimiento, no en un simple lujo técnico.

## **6\. Plan de Implementación por Fases y Antipatrones a Evitar**

Resolver el sangrado operativo requiere una ejecución táctica para detener el daño inmediato, seguida de una refactorización arquitectónica para garantizar escalabilidad a largo plazo.

### **Fase 1: Contención Inmediata (Esfuerzo: 3-5 días | Riesgo: Bajo)**

*Objetivo: Erradicar la sugerencia de productos digitales sin reescribir el backend completo.*

* **Reestructuración XML del Prompt:** Mover las directivas de prohibición al final del contexto inyectado utilizando formato XML rígido de Anthropic.  
  XML  
  \<instrucciones\_absolutas\_finales\>  
  El modelo de negocio de la empresa es EXCLUSIVAMENTE la distribución de productos físicos.  
  BAJO NINGUNA CIRCUNSTANCIA debes sugerir al usuario la creación de cursos, infoproductos, e-books, consultoría online, ni ningún mecanismo relacionado con la "creator economy".  
  Si el oficio del usuario no parece encajar, pide una clarificación sobre cómo usan productos físicos en su labor diaria.  
  \</instrucciones\_absolutas\_finales\>

* **Guardrail por Regex:** Implementar un validador léxico básico en Node.js previo a la respuesta de Meta. Si la cadena de salida contiene "curso", "infoproducto", "membresía", interceptar el envío y enviar una plantilla pre-aprobada, derivando el caso a un humano.  
* **Prompt Caching:** Configurar cache\_control: {"type": "ephemeral"} en el Vercel AI SDK para reducir inmediatamente la latencia del *cold start* y disminuir costos de procesamiento repetitivo31.

### **Fase 2: Transición a LangGraph y CRAG (Esfuerzo: 3-4 semanas | Riesgo: Medio)**

*Objetivo: Estabilidad estructural e inmutabilidad del estado.*

* **Migración a Nodos:** Implementar @langchain/langgraph y reconstruir el webhook como un grafo de estado dirigido23.  
* **Persistencia Estructurada:** Cambiar la inyección de historial en crudo por el uso de PostgresStore y el *checkpointer*, extrayendo el estado del usuario en un esquema validado por Zod8.  
* **CRAG Heurístico:** Implementar un nodo intermedio que verifique la distancia de similitud de los *embeddings* devueltos por pgvector. Si la similitud está por debajo de un umbral aceptable (ej. \< 0.75 de distancia de coseno), descartar el RAG y forzar una ruta de *fallback*18.

### **Fase 3: Evaluación Continua (Esfuerzo: 2 semanas | Riesgo: Bajo)**

*Objetivo: Integración de telemetría y calidad automatizada.*

* **Despliegue de Langfuse:** Instrumentar el código con el SDK de Langfuse para capturar las trazas de todos los subnodos de LangGraph40.  
* **Dataset Áureo (*Golden Dataset*):** Construir una batería de pruebas unitarias con DeepEval44. Cada vez que un desarrollador actualice el *prompt* o el RAG, el sistema de CI/CD debe simular consultas críticas ("soy plomero, ¿cómo gano dinero?") y validar que la métrica de Fidelidad (*Faithfulness*) sea 1.0 antes de autorizar el despliegue a producción.

### **Antipatrones Documentados: Lo que NO se debe hacer**

> 1. **Depender Exclusivamente de Prompts Negativos:** Los LLMs operan por atención probabilística. Pedirles que "no ofrezcan X" concentra la atención en "X", activando asociaciones paramétricas latentes. Las instrucciones siempre deben ser formativas y afirmativas sobre el espacio permitido.  
> 2. **Ignorar la Calidad del Origen de Datos (Garbage In, Garbage Out):** Ningún *framework* de agentes compensará un sistema de *embeddings* que carezca de enriquecimiento semántico20. Si el arsenal documental asume un conocimiento implícito que el modelo desconoce, el RAG fracasará ante perfiles no tradicionales.  
> 3. **Tirar el Problema a Modelos más Grandes:** Sustituir Sonnet por Opus (o modelos equivalentes de mayor costo) no resolverá la contaminación del historial ni el fallo silente del RAG; solo producirá alucinaciones más articuladas a un costo prohibitivo de inferencia y mayor latencia.  
> 4. **Reinyectar Historial Crudo:** Mantener un arreglo lineal expansivo de la transcripción destruye la ventana de contexto y expone al modelo al fenómeno de autointoxicación por *few-shot accidental*14. El estado debe ser inmutable y estructurado.

#### **Fuentes citadas**

> 1. Latin America's AI-Curious Majority: What 2025 Revealed and What 2026 Will Test, [https://latamintersectpr.com/latin-americas-ai-curious-majority-what-2025-revealed-and-what-2026-will-test/](https://latamintersectpr.com/latin-americas-ai-curious-majority-what-2025-revealed-and-what-2026-will-test/)  
> 2. Lost in the Middle: How Language Models Use Long Contexts \- ACL Anthology, [https://aclanthology.org/2024.tacl-1.9/](https://aclanthology.org/2024.tacl-1.9/)  
> 3. Lost in the Middle: How Language Models Use Long Contexts \- Stanford Computer Science, [https://cs.stanford.edu/\~nfliu/papers/lost-in-the-middle.arxiv2023.pdf](https://cs.stanford.edu/~nfliu/papers/lost-in-the-middle.arxiv2023.pdf)  
> 4. Lost in the Middle: How Language Models Use Long Contexts \- arXiv, [https://arxiv.org/html/2307.03172v1](https://arxiv.org/html/2307.03172v1)  
> 5. Never Lost in the Middle: Mastering Long-Context Question Answering with Position-Agnostic Decompositional Training \- arXiv, [https://arxiv.org/html/2311.09198v2](https://arxiv.org/html/2311.09198v2)  
> 6. How To Write Advanced Prompts For Claude 3.5 Sonnet (Quick and Easy) \- YouTube, [https://www.youtube.com/watch?v=W40uP92zlIM](https://www.youtube.com/watch?v=W40uP92zlIM)  
> 7. Sonnet 3.5 Coding System Prompt (v2 with explainer) : r/ClaudeAI \- Reddit, [https://www.reddit.com/r/ClaudeAI/comments/1e39tvj/sonnet\_35\_coding\_system\_prompt\_v2\_with\_explainer/](https://www.reddit.com/r/ClaudeAI/comments/1e39tvj/sonnet_35_coding_system_prompt_v2_with_explainer/)  
> 8. AI SDK Core: zodSchema, [https://ai-sdk.dev/docs/reference/ai-sdk-core/zod-schema](https://ai-sdk.dev/docs/reference/ai-sdk-core/zod-schema)  
> 9. AI-Powered Paper Summarization about the arXiv paper 2401.15884v1, [https://summarizepaper.com/en/arxiv-id/2401.15884v1/](https://summarizepaper.com/en/arxiv-id/2401.15884v1/)  
> 10. Corrective RAG (CRAG) \- Kore.ai, [https://www.kore.ai/blog/corrective-rag-crag](https://www.kore.ai/blog/corrective-rag-crag)  
> 11. Corrective RAG \- Learn Prompting, [https://learnprompting.org/docs/retrieval\_augmented\_generation/corrective-rag](https://learnprompting.org/docs/retrieval_augmented_generation/corrective-rag)  
> 12. LangGraph State Machine Tutorial for Conversational Agents | ActiveWizards, [https://activewizards.com/blog/architecting-event-driven-conversational-agents-with-langgraph/](https://activewizards.com/blog/architecting-event-driven-conversational-agents-with-langgraph/)  
> 13. Tendencias de IA conversacional en Latinoamérica para 2026: el auge del agente autónomo en WhatsApp \- Blog chattigo, [https://blog.chattigo.com/whatsapp-business/tendencias-de-ia-conversacional-en-latinoam%C3%A9rica-para-2026-el-auge-del-agente-aut%C3%B3nomo-en-whatsapp](https://blog.chattigo.com/whatsapp-business/tendencias-de-ia-conversacional-en-latinoam%C3%A9rica-para-2026-el-auge-del-agente-aut%C3%B3nomo-en-whatsapp)  
> 14. Building Production AI Agent Workflows with LangGraph.js: Lessons from the Field, [https://www.ndigirigijohn.dev/writing/ai-agents-production](https://www.ndigirigijohn.dev/writing/ai-agents-production)  
> 15. Contextual Retrieval: Anthropic's Method for Cutting RAG Failures | by Sweety Tripathi | Coinmonks | Jul, 2026 | Medium, [https://medium.com/coinmonks/contextual-retrieval-anthropics-method-for-cutting-rag-failures-b28d98d57c48](https://medium.com/coinmonks/contextual-retrieval-anthropics-method-for-cutting-rag-failures-b28d98d57c48)  
> 16. Contextual Retrieval in AI Systems \- Anthropic, [https://www.anthropic.com/engineering/contextual-retrieval](https://www.anthropic.com/engineering/contextual-retrieval)  
> 17. Enhancing RAG with contextual retrieval | Claude Cookbook, [https://platform.claude.com/cookbook/capabilities-contextual-embeddings-guide](https://platform.claude.com/cookbook/capabilities-contextual-embeddings-guide)  
> 18. search | @langchain/langgraph-checkpoint-postgres, [https://reference.langchain.com/javascript/langchain-langgraph-checkpoint-postgres/store/PostgresStore/search](https://reference.langchain.com/javascript/langchain-langgraph-checkpoint-postgres/store/PostgresStore/search)  
> 19. Using the RAG Triad for RAG evaluation | DeepEval \- The LLM Evaluation Framework, [https://deepeval.com/guides/guides-rag-triad](https://deepeval.com/guides/guides-rag-triad)  
> 20. How to Test a RAG System for Hallucinations (Faithfulness & Grounding) | aiml.qa, [https://aiml.qa/blog/rag-hallucination-testing/](https://aiml.qa/blog/rag-hallucination-testing/)  
> 21. Groundedness, Faithfulness, and Hallucination Evaluation \- Agent Engineering Digest, [https://agentengineeringdigest.com/knowledge-base/evaluation-and-quality/groundedness-faithfulness-and-hallucination-evaluation/](https://agentengineeringdigest.com/knowledge-base/evaluation-and-quality/groundedness-faithfulness-and-hallucination-evaluation/)  
> 22. Security & Guardrails \- Langfuse, [https://langfuse.com/docs/security-and-guardrails](https://langfuse.com/docs/security-and-guardrails)  
> 23. langchain/langgraph-checkpoint, [https://reference.langchain.com/javascript/langchain-langgraph-checkpoint](https://reference.langchain.com/javascript/langchain-langgraph-checkpoint)  
> 24. Thinking in LangGraph \- Docs by LangChain, [https://docs.langchain.com/oss/javascript/langgraph/thinking-in-langgraph](https://docs.langchain.com/oss/javascript/langgraph/thinking-in-langgraph)  
> 25. GitHub \- agentailor/fullstack-langgraph-nextjs-agent: Production-ready Next.js template for building AI agents with LangGraph.js. Features MCP integration for dynamic tool loading, human-in-the-loop tool approval, persistent conversation memory with PostgreSQL, and real-time streaming responses. Built with TypeScript, React, Prisma, and Tailwind CSS., [https://github.com/agentailor/fullstack-langgraph-nextjs-agent](https://github.com/agentailor/fullstack-langgraph-nextjs-agent)  
> 26. LangGraph: Multi-Agent Workflows \- LangChain, [https://www.langchain.com/blog/langgraph-multi-agent-workflows](https://www.langchain.com/blog/langgraph-multi-agent-workflows)  
> 27. LangGraph v0.2: Increased customization with new checkpointer libraries \- LangChain, [https://www.langchain.com/blog/langgraph-v0-2](https://www.langchain.com/blog/langgraph-v0-2)  
> 28. Under the Hood: Building a Hybrid Search Engine for AI Memory (Node.js \+ pgvector), [https://dev.to/the\_nortern\_dev/under-the-hood-building-a-hybrid-search-engine-for-ai-memory-nodejs-pgvector-3c5k](https://dev.to/the_nortern_dev/under-the-hood-building-a-hybrid-search-engine-for-ai-memory-nodejs-pgvector-3c5k)  
> 29. Postgres \+ pgvector: The Battle-Proven Vector Store for Full-Stack AI Applications \- Medium, [https://medium.com/israeli-tech-radar/postgres-pgvector-the-battle-proven-vector-store-for-full-stack-ai-applications-b86e18f4056b](https://medium.com/israeli-tech-radar/postgres-pgvector-the-battle-proven-vector-store-for-full-stack-ai-applications-b86e18f4056b)  
> 30. Open-sourced a fullstack LangGraph.js and Next.js agent template with MCP integration : r/LangChain \- Reddit, [https://www.reddit.com/r/LangChain/comments/1nuegoj/opensourced\_a\_fullstack\_langgraphjs\_and\_nextjs/](https://www.reddit.com/r/LangChain/comments/1nuegoj/opensourced_a_fullstack_langgraphjs_and_nextjs/)  
> 31. Prompt caching \- Claude Platform Docs, [https://platform.claude.com/docs/en/build-with-claude/prompt-caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)  
> 32. Node: Dynamic Prompt Caching \- AI SDK, [https://ai-sdk.dev/cookbook/node/dynamic-prompt-caching](https://ai-sdk.dev/cookbook/node/dynamic-prompt-caching)  
> 33. Tool use with prompt caching \- Claude Platform Docs, [https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-use-with-prompt-caching](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-use-with-prompt-caching)  
> 34. Automatic Caching \- AI Gateway \- Vercel, [https://vercel.com/docs/ai-gateway/models-and-providers/automatic-caching](https://vercel.com/docs/ai-gateway/models-and-providers/automatic-caching)  
> 35. How Prompt Caching Actually Works in Claude Code, [https://www.claudecodecamp.com/p/how-prompt-caching-actually-works-in-claude-code](https://www.claudecodecamp.com/p/how-prompt-caching-actually-works-in-claude-code)  
> 36. Unlocking Efficiency: A Practical Guide to Claude Prompt Caching | by Mark Craddock, [https://medium.com/@mcraddock/unlocking-efficiency-a-practical-guide-to-claude-prompt-caching-3185805c0eef](https://medium.com/@mcraddock/unlocking-efficiency-a-practical-guide-to-claude-prompt-caching-3185805c0eef)  
> 37. Top 5 LLM Evaluation Frameworks in 2026, Compared \- DeepEval, [https://deepeval.com/blog/top-5-llm-evaluation-frameworks](https://deepeval.com/blog/top-5-llm-evaluation-frameworks)  
> 38. Braintrust Data Alternatives? The best LLMOps platform? \- Langfuse, [https://langfuse.com/resources/engineering/best-braintrustdata-alternatives](https://langfuse.com/resources/engineering/best-braintrustdata-alternatives)  
> 39. Best LLM Observability Tools in 2026 \- Firecrawl, [https://www.firecrawl.dev/blog/best-llm-observability-tools](https://www.firecrawl.dev/blog/best-llm-observability-tools)  
> 40. Top 4 braintrust.dev Alternatives for Agent Deployment 2026 \- MLflow, [https://mlflow.org/articles/braintrust-dev-alternatives-4/](https://mlflow.org/articles/braintrust-dev-alternatives-4/)  
> 41. Langfuse vs Braintrust: Which Wins for Agent Observability (2026) \- MPIsaac Ventures, [https://mpiv.ai/blog/langfuse-vs-braintrust-which-wins-for-agent-observability-2026](https://mpiv.ai/blog/langfuse-vs-braintrust-which-wins-for-agent-observability-2026)  
> 42. Langfuse alternatives: Top 5 competitors compared (2026) \- Articles \- Braintrust, [https://www.braintrust.dev/articles/langfuse-alternatives-2026](https://www.braintrust.dev/articles/langfuse-alternatives-2026)  
> 43. Top AI Agent Evaluation Tools in 2026 | Goodeye Labs, [https://www.goodeyelabs.com/articles/top-ai-agent-evaluation-tools-2026](https://www.goodeyelabs.com/articles/top-ai-agent-evaluation-tools-2026)  
> 44. AI Agent Evaluation Frameworks (2026): 7 Compared \- MorphLLM, [https://www.morphllm.com/ai-agent-evaluation-frameworks](https://www.morphllm.com/ai-agent-evaluation-frameworks)  
> 45. WhatsApp Business Policy and AI Agents: What's Allowed, What Changed \- Upperfloor, [https://upperfloor.ai/en/blog/meta-policy-ai-agents](https://upperfloor.ai/en/blog/meta-policy-ai-agents)  
> 46. Chat App Message Service:WhatsApp AI chatbot policy 2026: What businesses need to know \- Alibaba Cloud, [https://www.alibabacloud.com/help/en/chatapp/use-cases/whatsapp-ai-policy-2026-guide](https://www.alibabacloud.com/help/en/chatapp/use-cases/whatsapp-ai-policy-2026-guide)  
> 47. Whatsapp Business Banned Account: Reverse and Avoid It \- Respond.io, [https://respond.io/blog/whatsapp-business-banned](https://respond.io/blog/whatsapp-business-banned)  
> 48. WhatsApp Opt-In Compliance Requirements: Meta's Rules for Collecting Consent Without Getting Flagged \- Blueticks, [https://blueticks.co/blog/whatsapp-opt-in-compliance-requirements](https://blueticks.co/blog/whatsapp-opt-in-compliance-requirements)  
> 49. Política de mensajes de WhatsApp Business, [https://whatsappbusiness.com/es-la/policy/](https://whatsappbusiness.com/es-la/policy/)  
> 50. LatAm 2025 \+ 2026: the market is back to normal, now only those who execute survive, [https://www.techfinitive.com/features/latam-2025-2026-the-market-is-back-to-normal-now-only-those-who-execute-survive/](https://www.techfinitive.com/features/latam-2025-2026-the-market-is-back-to-normal-now-only-those-who-execute-survive/)  
> 51. Lineamientos sobre uso de inteligencia artificial en servicios al consumidor., [https://sedeelectronica.sic.gov.co/publicaciones/boletin-juridico/concepto/lineamientos-sobre-uso-de-inteligencia-artificial-en-servicios-al-consumidor](https://sedeelectronica.sic.gov.co/publicaciones/boletin-juridico/concepto/lineamientos-sobre-uso-de-inteligencia-artificial-en-servicios-al-consumidor)  
> 52. Regulaciones sobre publicidad con modelos de inteligencia artificial \- Sede electrónica SIC, [https://sedeelectronica.sic.gov.co/publicaciones/boletin-juridico/concepto/regulaciones-sobre-publicidad-con-modelos-de-inteligencia-artificial](https://sedeelectronica.sic.gov.co/publicaciones/boletin-juridico/concepto/regulaciones-sobre-publicidad-con-modelos-de-inteligencia-artificial)  
> 53. El uso de la inteligencia artificial en actividades comerciales debe respetar el habeas data, [https://sedeelectronica.sic.gov.co/publicaciones/boletin-juridico/concepto/el-uso-de-la-inteligencia-artificial-en-actividades-comerciales-debe-respetar-el-habeas-data](https://sedeelectronica.sic.gov.co/publicaciones/boletin-juridico/concepto/el-uso-de-la-inteligencia-artificial-en-actividades-comerciales-debe-respetar-el-habeas-data)  
> 54. Tratamiento jurídico y regulatorio de sistemas de inteligencia artificial en materia de protección al consumidor \- Sede electrónica SIC, [https://sedeelectronica.sic.gov.co/publicaciones/boletin-juridico/boletin/tratamiento-juridico-y-regulatorio-de-sistemas-de-inteligencia-artificial-en-materia-de-proteccion-al](https://sedeelectronica.sic.gov.co/publicaciones/boletin-juridico/boletin/tratamiento-juridico-y-regulatorio-de-sistemas-de-inteligencia-artificial-en-materia-de-proteccion-al)  
> 55. ¿Cómo reconocer la publicidad engañosa? \- Sede electrónica SIC, [https://sedeelectronica.sic.gov.co/noticias/como-reconocer-la-publicidad-enganosa-0](https://sedeelectronica.sic.gov.co/noticias/como-reconocer-la-publicidad-enganosa-0)  
> 56. Ley 1480 de 2011 \- Gestor Normativo \- Función Pública, [https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=44306](https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=44306)  
> 57. Leyes desde 1992 \- Vigencia expresa y control de constitucionalidad \[LEY\_1480\_2011\], [http://www.secretariasenado.gov.co/senado/basedoc/ley\_1480\_2011.html](http://www.secretariasenado.gov.co/senado/basedoc/ley_1480_2011.html)  
> 58. BC Tribunal Confirms Companies Remain Liable for Information Provided by AI Chatbot, [https://www.americanbar.org/groups/business\_law/resources/business-law-today/2024-february/bc-tribunal-confirms-companies-remain-liable-information-provided-ai-chatbot/](https://www.americanbar.org/groups/business_law/resources/business-law-today/2024-february/bc-tribunal-confirms-companies-remain-liable-information-provided-ai-chatbot/)  
> 59. Air Canada found liable for chatbot's bad advice on plane tickets | CBC News, [https://www.cbc.ca/news/canada/british-columbia/air-canada-chatbot-lawsuit-1.7116416](https://www.cbc.ca/news/canada/british-columbia/air-canada-chatbot-lawsuit-1.7116416)