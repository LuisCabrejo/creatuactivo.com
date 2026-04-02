# **Análisis de Arquitectura de Routing IA Multi-tenant y Gestión de Knowledge Bases Heterogéneas en Startups de Élite**

La industria de la inteligencia artificial generativa ha madurado desde la simple implementación de interfaces de chat hacia la creación de sistemas operativos agénticos complejos que deben dar servicio a múltiples organizaciones o departamentos de forma simultánea. En este contexto, el desafío técnico principal para startups de alto rendimiento no es solo la generación de lenguaje, sino la orquestación de un pipeline de datos que garantice un aislamiento absoluto entre inquilinos (tenants), una precisión factual innegociable en datos estructurados y una latencia que permita interacciones en tiempo real. Empresas como Intercom, Sierra AI, Voiceflow y Dust han desarrollado arquitecturas sofisticadas que separan la capa de inteligencia de la capa de contexto y ejecución, resolviendo de forma nativa los problemas de "fuga de datos" y "alucinaciones de dominio" que afectan a las implementaciones monolíticas tradicionales.1

## **SECCIÓN 1: Patrones de Arquitectura Multi-tenant en Sistemas de IA**

El diseño de un sistema multi-tenant para agentes de IA requiere una decisión fundamental sobre cómo se segmentan los datos y el cómputo. La literatura técnica y la práctica de ingeniería en empresas líderes sugieren tres modelos principales de aislamiento, cada uno con implicaciones críticas en costos, rendimiento y seguridad.5

## **El Modelo de Silo: Aislamiento Físico y Recursos Dedicados**

El patrón de silo representa el nivel más alto de aislamiento, donde cada tenant dispone de su propia pila de infraestructura completa. Esto incluye bases de datos vectoriales dedicadas, almacenes de documentos independientes y, en casos extremos, instancias de modelos de lenguaje ajustados (fine-tuned) para ese cliente específico. Startups que sirven a industrias altamente reguladas como la fintech o la salud suelen adoptar este patrón para cumplir con requisitos estrictos de soberanía de datos y cumplimiento.5

Desde una perspectiva de rendimiento, el silo elimina por completo el fenómeno del "vecino ruidoso" (noisy neighbor). En una arquitectura compartida, una carga masiva de ingestión de documentos de un tenant puede degradar la latencia de búsqueda para todos los demás; en el modelo de silo, los recursos de entrada/salida (I/O) están físicamente garantizados para cada inquilino.9 No obstante, el costo operativo es masivo. Gestionar cientos o miles de índices vectoriales independientes en proveedores como Pinecone o Weaviate puede agotar rápidamente los presupuestos y superar los límites de cuotas de las cuentas de infraestructura.5

## **El Modelo de Pool: Aislamiento Lógico mediante Filtrado de Metadatos**

El patrón de pool es la arquitectura más eficiente desde el punto de vista económico y es la que Queswa utiliza actualmente, aunque de forma subóptima. En este modelo, todos los datos de los inquilinos coexisten en una única tabla o índice vectorial, y el aislamiento se impone mediante un discriminador lógico, generalmente una columna tenant\_id.6

La ventaja reside en la consolidación de recursos, lo que permite una escalabilidad casi infinita en términos de número de inquilinos sin aumentar proporcionalmente los costos de infraestructura fija. Sin embargo, el riesgo de "fuga de datos" (tenant bleed) es una amenaza constante. Un error en una cláusula WHERE o una política de seguridad mal configurada puede exponer secretos comerciales de una empresa a los usuarios de otra.14 Las startups de élite que utilizan este modelo han evolucionado hacia el uso de Seguridad a Nivel de Fila (Row Level Security \- RLS) integrada en la base de datos para que la restricción de acceso sea una propiedad del motor de datos y no dependa exclusivamente de la lógica del código de aplicación.16

## **El Modelo de Bridge: Aislamiento por Namespaces y Colecciones**

El modelo bridge u "híbrido" busca el equilibrio entre la eficiencia del pool y la seguridad del silo. Utiliza abstracciones del motor de búsqueda vectorial para segmentar los datos dentro de un clúster compartido. En Pinecone, esto se implementa mediante "namespaces"; en Weaviate, a través de "tenancy" nativo en las colecciones; y en Qdrant, mediante "collections" o segmentación por particiones de payload.19

Namespacing permite que el motor vectorial optimice el almacenamiento y la computación. Cuando se realiza una consulta contra un namespace específico, el sistema limita físicamente el escaneo de vectores a ese segmento de datos, lo que reduce la latencia de búsqueda en comparación con el escaneo de un índice global con filtros de metadatos pesados.11 Este es el patrón recomendado para startups que proyectan crecer hasta miles de tenants conservando una latencia sub-segundo.22

| Atributo | Silo | Pool | Bridge (Namespaces) |
| :---- | :---- | :---- | :---- |
| **Nivel de Aislamiento** | Físico (Máximo) | Lógico (Bajo) | Lógico-Físico (Alto) |
| **Complejidad de Gestión** | Muy Alta | Baja | Media |
| **Costo por Tenant** | Elevado | Mínimo | Moderado |
| **Riesgo de Fuga de Datos** | Nulo | Alto (sin RLS) | Bajo |
| **Rendimiento de Búsqueda** | Máximo | Degradado en índices grandes | Optimizado por segmento |

## **SECCIÓN 2: Clasificadores de Intención Agnósticos al Tenant**

El fallo crítico reportado en la infraestructura actual de Queswa se origina en un clasificador de rutas que no tiene conciencia del tenant. Las startups líderes han resuelto este problema abandonando los clasificadores de intención basados en modelos estáticos o reglas fijas, moviéndose hacia sistemas dinámicos guiados por descripciones y descubrimiento semántico.24

## **Routing Semántico por Similitud de Utterances**

En lugar de entrenar un modelo para clasificar mensajes, startups como Voiceflow utilizan un patrón de "NLU (Natural Language Understanding) Dinámico". Cada agente o tenant define sus propias rutas o herramientas mediante una lista de frases de ejemplo (utterances) y descripciones detalladas.24

El proceso de routing sigue este flujo:

1. El mensaje del usuario se convierte en un embedding vectorial.24  
2. Se realiza una búsqueda vectorial contra el registro de intenciones del tenant específico.29  
3. Se selecciona la ruta que supera un umbral de similitud configurado.27  
4. Si ninguna ruta coincide, se activa una lógica de fallback o se envía a un clasificador LLM de respaldo.27

Este método permite añadir o modificar comportamientos instantáneamente para un inquilino sin afectar a los demás y sin necesidad de despliegues de código o reentrenamientos.24

## **Clasificación Basada en Descripciones con Modelos Ligeros**

Un patrón avanzado, utilizado por Sierra AI en su "Constellation of Models", consiste en utilizar modelos de lenguaje extremadamente rápidos (como Claude Haiku o GPT-4o-mini) dedicados exclusivamente a la clasificación de intenciones basándose en el contexto del tenant inyectado en el prompt de sistema.2

El sistema recupera la configuración del tenant desde la base de datos (nombres de rutas, descripciones y reglas de negocio) y construye un prompt dinámico: "Basado en las siguientes capacidades del agente de, clasifica el mensaje del usuario: \[Mensaje\]". Este enfoque garantiza que el mismo motor de IA pueda servir tanto a un e-commerce como a un dashboard operativo con solo cambiar el manifiesto de configuración del tenant.2

## **El Registro de Tenants como Orquestador Central**

La arquitectura madura centraliza toda la inteligencia de negocio en un "Tenant Registry". Este registro define no solo el prompt de sistema, sino también qué herramientas tiene habilitadas el agente, qué bases de conocimiento debe consultar y qué guardrails de seguridad se aplican. El código de la API Nexus no debería contener lógica condicional del tipo if (tenantId \=== 'ecommerce'), sino que debe invocar dinámicamente los módulos definidos en el perfil del tenant recuperado al inicio de la petición.31

## **SECCIÓN 3: Cache de Embeddings en Entornos Multi-tenant**

El almacenamiento en caché en Next.js Edge Runtime presenta desafíos de consistencia y seguridad. Un caché in-memory global que mezcla tenants sin discriminación técnica es vulnerable a contaminaciones semánticas y fallos de privacidad.9

## **Convenciones de Naming y Namespacing en Redis/Upstash**

Para implementaciones que utilizan Redis o Upstash en el Edge, el patrón de oro es el namespacing estricto de claves. La estructura de claves debe incluir siempre el identificador del tenant como primer segmento: tenant:{id}:cache\_type:{resource\_hash}. Esto permite invalidar el caché de un solo tenant sin afectar el rendimiento de los demás y facilita la auditoría de uso de recursos por cliente.33

| Tipo de Caché | Estructura de Clave Sugerida | Lógica de Expiración |
| :---- | :---- | :---- |
| **Documentos RAG** | t:{id}:rag:{query\_hash} | Basada en actualización de DB (Webhooks) |
| **Intenciones** | t:{id}:intent:{message\_hash} | Corta (TTL 15-30 min) |
| **Metadatos Tenant** | t:{id}:config | Larga (TTL 24h) con invalidación manual |
| **Sesión Usuario** | t:{id}:session:{user\_id} | TTL de inactividad (60 min) |

## **Estrategias de Cache-Aside con pgvector y RLS**

Dada la escala actual de Queswa (\~150-500 fragmentos), una estrategia altamente efectiva es el uso de cache-aside integrado con Supabase. En lugar de mantener arrays en memoria en el Edge (que se reinician con cada instancia), se pueden utilizar tablas de caché en Postgres con índices HNSW optimizados. Al activar RLS en estas tablas, la base de datos garantiza que una instancia de la API solo pueda leer el caché perteneciente al x-tenant-id autenticado, eliminando riesgos de fuga de información a nivel de infraestructura.18

## **SECCIÓN 4: Prevención de Alucinaciones Factuales y Datos Estructurados**

El problema de inventar precios en ganocafe.online es un síntoma de un sistema que confía excesivamente en la recuperación semántica para datos que deberían ser determinísticos. Las startups de élite han abandonado el uso de RAG tradicional para datos como precios, stock o estados de pedidos, moviéndose hacia arquitecturas basadas en herramientas y esquemas estructurados.36

## **Tool Calling Determinístico como Fuente de Verdad**

Empresas como Intercom (Fin) y Sierra AI utilizan el patrón de "Agente con Herramientas" (Agentic Tool Use). Cuando el clasificador identifica una intención de "Consulta de Precios", el agente no busca en un PDF; en su lugar, el LLM emite una llamada a una función: obtener\_precio\_producto(sku: "gano-cafe-3-1").39

La API Nexus intercepta esta llamada y ejecuta una consulta SQL directa a la tabla de productos de Supabase, filtrando por el tenant\_id actual. El resultado numérico exacto se devuelve al modelo. Esta técnica garantiza una precisión del 100% en datos factuales, ya que el modelo no tiene la oportunidad de "imaginar" el dato si la recuperación semántica falla.36

## **Guardrails de Validación Post-Generación**

Para capas de seguridad adicionales, se implementan validadores que revisan la respuesta generada por el LLM antes de enviarla al cliente. Estos validadores buscan patrones numéricos (precios) y los contrastan con la salida de las herramientas invocadas. Si el LLM afirma que el precio es "$135.000" pero la base de datos reportó "$135.900", el guardrail intercepta la respuesta, la marca como errónea y solicita una corrección interna al modelo.1

## **Inyección de Contexto Estructurado (JSON)**

En lugar de pasar texto plano al prompt de sistema, las startups líderes inyectan el contexto recuperado en formatos estructurados como JSON o Markdown Tables. Esto ayuda al modelo a distinguir claramente entre el ruido del lenguaje natural y los atributos específicos del negocio (precios, fechas, SKUs). Al indicarle al modelo que "La tabla JSON adjunta es la única fuente válida para precios", se reduce drásticamente el sesgo de sus pesos pre-entrenados.1

## **SECCIÓN 5: Widgets Cross-origin y Seguridad de Identidad**

Operar un ecosistema donde un widget JS llama a una API central desde dominios externos requiere una arquitectura de seguridad robusta para prevenir ataques de suplantación y garantizar el correcto seguimiento de los usuarios.45

## **Verificación de Identidad mediante HMAC (Hash-based Message Authentication Code)**

Plataformas como Intercom y Drift (Salesloft) implementan "Identity Verification" para asegurar que un usuario que dice pertenecer al Tenant A realmente lo es. El servidor del cliente (ej. el WordPress de ganocafe.online) genera un código HMAC utilizando una clave secreta compartida con Nexus. Este código firma el user\_id o el tenant\_id y se pasa al widget JS.35

Cuando el widget realiza el POST /api/nexus, envía el HMAC en los headers. La API Nexus recalcula el hash con su copia del secreto; si los hashes coinciden, se confirma que la petición proviene de un dominio autorizado y no de un atacante que simplemente conoce el tenant\_id. Este patrón es esencial para proteger el presupuesto de tokens y la privacidad de los datos.48

## **Gestión Dinámica de CORS y Proxies de Dominio**

El mejor patrón detectado en empresas como Yellow.ai y Crisp es la gestión dinámica de políticas de CORS basada en el registro de tenants. En lugar de usar comodines (\*), la API Nexus debe validar el header Origin de cada petición contra la lista de dominios autorizados para ese inquilino en Supabase. Solo si el dominio coincide, se emiten los headers Access-Control-Allow-Origin correspondientes.46

Para el tracking y fingerprinting, dada la desaparición de las cookies de terceros, se recomienda el uso de identificadores anónimos almacenados en localStorage del dominio del cliente, que se pasan explícitamente a la API en cada petición, permitiendo mantener el hilo de la conversación sin depender de cookies cross-site.35

## **SECCIÓN 6: Casos de Estudio Específicos**

## **Intercom Fin: El Engine de Siete Fases**

Fin de Intercom no es un simple chatbot, sino un orquestador de siete fases diseñado para maximizar la resolución y minimizar alucinaciones 1:

1. **Refinamiento de consulta:** Reescribe la pregunta del usuario para mejorar la búsqueda.1  
2. **Verificación de seguridad:** Filtra peticiones maliciosas o fuera de contexto.1  
3. **Clasificación de intenciones:** Determina si la respuesta debe ser un flujo de trabajo (Workflow), una respuesta personalizada o una búsqueda en el knowledge base.1  
4. **Recuperación semántica:** Utiliza su modelo propietario fin-cx-retrieval para buscar en múltiples fuentes.56  
5. **Reranking:** Un modelo fin-cx-reranker puntúa los fragmentos recuperados para eliminar ruido.56  
6. **Generación guiada:** Construye la respuesta utilizando instrucciones de marca específicas del tenant.1  
7. **Validación de precisión:** Un paso de auto-corrección donde el sistema verifica si la respuesta generada está debidamente anclada en los documentos recuperados.1

## **Sierra AI: La Arquitectura de Constelación y Agentes Supervisores**

Sierra AI, fundada por Bret Taylor, utiliza una arquitectura modular donde cada "habilidad" del agente es un micro-componente.2 En lugar de un prompt masivo, Sierra despliega una red de agentes especializados:

* **Planner Agents:** Descomponen la intención del usuario en pasos lógicos.57  
* **Executor Agents:** Llaman a herramientas externas (APIs de CRM o facturación).57  
* **Validator Agents:** Actúan como supervisores de calidad, revisando la salida antes de que el usuario la vea.2

Este enfoque de "Constelación de Modelos" permite usar 15+ modelos diferentes para una sola conversación, optimizando costo (modelos pequeños para tareas simples) y calidad (modelos grandes para razonamiento complejo).2

## **Voiceflow: Context Engine y Hot-swapping de Instrucciones**

Voiceflow ha desarrollado el "Context Engine", un runtime que gestiona el estado de la conversación y la memoria a largo plazo en tiempo real.41 Su gran innovación para el multi-tenancy es la capacidad de realizar un "hot-swap" de instrucciones: cuando el usuario cambia de una consulta de soporte a una de ventas, el motor descarga las reglas de soporte y carga instantáneamente las de ventas, manteniendo la ventana de contexto del LLM extremadamente limpia y relevante.41

## **Dust.tt: Paralelismo y Contexto Infinito**

Dust utiliza una arquitectura de agentes paralelos donde un agente principal puede delegar sub-tareas a agentes trabajadores (@dust-task). Cada sub-agente tiene su propia ventana de contexto independiente, lo que le permite procesar cientos de páginas de documentación o bases de datos enteras sin ocupar espacio en la memoria de la conversación principal. Esto permite que los agentes de Dust realicen investigaciones profundas de más de 30 minutos antes de entregar una síntesis final al usuario.58

## **SECCIÓN 7: Solución Recomendada para Queswa / Nexus API**

Dada la infraestructura actual (Next.js Edge, Supabase pgvector, Voyage AI) y la necesidad de escalar a 500+ tenants manteniendo la fiabilidad, se recomienda una transición desde el código condicional hacia una **Arquitectura de Pipeline Modular con Registro de Tenants**.

## **Arquitectura de Recuperación: Aislamiento Lógico Estricto con Reranking**

Para la base de datos Supabase, se debe abandonar el filtrado manual en el código y adoptar un enfoque de base de datos.

1. **RLS en nexus\_documents:** Implementar una política PostgreSQL que vincule el tenant\_id de la fila con el jwt.claims.tenant\_id o el current\_setting de la transacción. Esto garantiza que ningún bug en el código de TypeScript pueda exponer accidentalmente documentos de otro inquilino.16  
2. **Pipeline de Dos Fases (Retrieve & Rerank):** La recuperación inicial de Voyage AI puede devolver ruido si hay muchos fragmentos similares entre tenants (ej. "políticas de reembolso"). Se debe añadir un paso de **Reranking** utilizando modelos de Voyage que tomen los 20 mejores resultados y seleccionen solo los 5 más relevantes para la pregunta específica del usuario. Esto reduce el ruido semántico y previene que el LLM se confunda con información adyacente pero incorrecta.7

## **Arquitectura de Routing: El Registro Dinámico**

Se debe crear una tabla tenants\_config en Supabase que actúe como el cerebro del sistema.

| Columna | Descripción | Ejemplo |
| :---- | :---- | :---- |
| id | Identificador único (UUID) | ecommerce\_marketing |
| domain\_auth | Lista de dominios permitidos | \["ganocafe.online", "ganocafe.online/shop"\] |
| intent\_manifest | JSON con intenciones y utterances | {"check\_price": \["precio", "cuánto vale"\],...} |
| enabled\_tools | Lista de funciones que el agente puede llamar | \["search\_inventory", "check\_order\_status"\] |
| knowledge\_policy | Configuración de RAG (top\_k, threshold) | {"top\_k": 5, "min\_score": 0.82} |

Al recibir un request, Nexus API carga este perfil y configura dinámicamente el agente. El flujo de ejecución se vuelve agnóstico al tenant: runAgent(message, tenantProfile).31

## **Arquitectura de Datos Factuales: Tool Calling Obligatorio**

Para ganocafe.online, el sistema debe dejar de tratar los precios como fragmentos de conocimiento desestructurado.

1. **Definición de Herramienta:** Exponer una función get\_product\_data(product\_id) que consulte la tabla de e-commerce real.40  
2. **Instrucción de Sistema:** El prompt del tenant e-commerce debe decir explícitamente: "Para cualquier pregunta sobre precios o stock, DEBES usar la herramienta get\_product\_data. NUNCA inventes un precio si no obtienes respuesta de la herramienta".1  
3. **Fallback Seguro:** Si la herramienta devuelve nulo, el agente debe responder con un mensaje pre-configurado de redirección: "Lo siento, no tengo el precio exacto en este momento. Por favor visita ganocafe.online para ver la cifra actualizada".36

## **SECCIÓN 8: Quick Wins (Implementación en \< 4 Horas)**

Esta semana, el equipo puede realizar cambios tácticos que resuelvan el 80% de la fragilidad del parche actual:

1. **Aislamiento de Caché por Tenant:** Modificar la lógica del caché in-memory para inyectar el tenant\_id en la clave. Esto evita que el reinicio de una instancia Edge sirva accidentalmente fragmentos cargados previamente por otro tenant.33  
   TypeScript  
   const cacheKey \= \`${tenantId}:arsenal\_fragments\`;  
   const cachedData \= await cache.get(cacheKey);

2. **Prompting Defensivo de Fallback Numérico:** Añadir un guardrail de texto en los system prompts de todos los tenants: "Si la información solicitada contiene valores numéricos o datos de e-commerce y no está explícitamente en el CONTEXTO, responde indicando desconocimiento. TIENES PROHIBIDO ESTIMAR O INVENTAR PRECIOS".38  
3. **Índice B-tree en tenant\_id:** Asegurarse de que la columna de filtrado de inquilinos en Supabase tenga un índice B-tree tradicional además del índice vectorial. Esto acelera drásticamente el pre-filtrado que pgvector realiza antes de la búsqueda de similitud, reduciendo latencia y mejorando la precisión.18  
4. **Header-based Identity Mapping:** En lugar de if-else en el cuerpo de la función principal, crear un middleware que mapee el x-tenant-id a un objeto Context enriquecido, permitiendo que el resto del archivo de 3,500 líneas simplemente lea de context.config.31

## **SECCIÓN 9: Hoja de Ruta a 90 Días**

La consolidación de una arquitectura escalable para 500+ tenants requiere un plan de tres fases:

## **Mes 1: Estructuración y Seguridad de Identidad**

* **Migración de Configuración a DB:** Mover todos los system prompts y reglas de negocio de archivos de texto o código hardcodeado a la tabla tenants\_config en Supabase.31  
* **HMAC Mandatory:** Implementar el secreto compartido entre los dominios clientes y la API Nexus para validar que cada petición es legítima.35  
* **Refactor de la API Nexus:** Dividir el archivo de 3,500 líneas en módulos responsables: TenantManager, IntentRouter, ContextRetriever, y ResponseGenerator.7

## **Mes 2: Capacidades Agénticas y Herramientas**

* **Habilitación de Tool Use:** Configurar el pipeline de Anthropic para soportar la definición y llamada de herramientas.41  
* **Herramientas Determinísticas para Ventas:** Implementar las primeras 3 herramientas para e-commerce: lookup\_price, check\_inventory, track\_shipping.40  
* **Aislamiento de Caché en Redis:** Sustituir el caché in-memory del Edge por Upstash Redis con segmentación física por tenant para mejorar la persistencia y la seguridad.33

## **Mes 3: Optimización y Evaluación Continua**

* **Pipeline de Evals:** Implementar un sistema de pruebas automáticas que ejecute preguntas de control ("¿cuánto cuesta el producto X?") y verifique que la respuesta sea idéntica al dato en DB.67  
* **Reranking con Voyage AI:** Integrar el modelo de reranking para filtrar el ruido semántico antes de la generación, mejorando la calidad de las respuestas en dominios heterogéneos.56  
* **Dashboard de Observabilidad por Tenant:** Crear visualizaciones en el dashboard de Queswa que muestren latencia, consumo de tokens y tasa de alucinaciones reportadas por inquilino.7

## **Conclusiones para la Evolución de Queswa**

El análisis de las startups de élite demuestra que el éxito en el routing IA multi-tenant no depende de tener el modelo de lenguaje más potente, sino de construir un sistema operativo que gestione con rigor científico el contexto y la autoridad factual. Queswa ha superado la fase de MVP y se encuentra en una crisis de crecimiento típica de las arquitecturas monolíticas. La transición hacia una arquitectura orientada a herramientas (Tool-based) y segmentada por configuración (Registry-based) es el único camino viable para alcanzar los 500+ tenants sin que la complejidad del código y el riesgo de fallos críticos aumenten exponencialmente. La prioridad inmediata debe ser la implementación de llamadas determinísticas para precios en ganocafe.online, ya que la confianza del usuario final es el activo más frágil en el comercio electrónico asistido por IA.1

#### **Fuentes citadas**

1. The Fin AI Engine™ | Intercom Help, acceso: marzo 24, 2026, [https://www.intercom.com/help/en/articles/9929230-the-fin-ai-engine](https://www.intercom.com/help/en/articles/9929230-the-fin-ai-engine)  
2. Constellation of models: the architecture powering Sierra's agents, acceso: marzo 24, 2026, [https://sierra.ai/blog/constellation-of-models](https://sierra.ai/blog/constellation-of-models)  
3. Sierra Agent OS 2.0: from answers to memory and action, acceso: marzo 24, 2026, [https://sierra.ai/blog/agent-os-2-0](https://sierra.ai/blog/agent-os-2-0)  
4. Fin AI by Intercom vs Inkeep, acceso: marzo 24, 2026, [https://inkeep.com/compare/fin-ai](https://inkeep.com/compare/fin-ai)  
5. Multi-tenant RAG with Amazon Bedrock Knowledge Bases | Artificial Intelligence \- AWS, acceso: marzo 24, 2026, [https://aws.amazon.com/blogs/machine-learning/multi-tenant-rag-with-amazon-bedrock-knowledge-bases/](https://aws.amazon.com/blogs/machine-learning/multi-tenant-rag-with-amazon-bedrock-knowledge-bases/)  
6. Mutitenant patterns in AWS Bedrock | by Sriramanvellingiri \- Medium, acceso: marzo 24, 2026, [https://medium.com/@sriramanvellingiri/mutitenant-patterns-in-aws-bedrock-e952e15c5a25](https://medium.com/@sriramanvellingiri/mutitenant-patterns-in-aws-bedrock-e952e15c5a25)  
7. Enterprise RAG: A Production Guide from Architecture to Multi-Tenant Security | by Pallavi Chandrashekar | Feb, 2026 | Medium, acceso: marzo 24, 2026, [https://medium.com/@pallavi9964/enterprise-rag-a-production-guide-from-architecture-to-multi-tenant-security-f415c47ad36c](https://medium.com/@pallavi9964/enterprise-rag-a-production-guide-from-architecture-to-multi-tenant-security-f415c47ad36c)  
8. Data Isolation and Sharding Architectures for Multi-Tenant Systems \- Medium, acceso: marzo 24, 2026, [https://medium.com/@justhamade/data-isolation-and-sharding-architectures-for-multi-tenant-systems-20584ae2bc31](https://medium.com/@justhamade/data-isolation-and-sharding-architectures-for-multi-tenant-systems-20584ae2bc31)  
9. Isolation in multi-tenancy and the lessons we learned the hard way | by System Design with Sage | Medium, acceso: marzo 24, 2026, [https://medium.com/@systemdesignwithsage/isolation-in-multi-tenancy-and-the-lessons-we-learned-the-hard-way-3335801aa754](https://medium.com/@systemdesignwithsage/isolation-in-multi-tenancy-and-the-lessons-we-learned-the-hard-way-3335801aa754)  
10. Multi-Tenant Design for Bedrock Knowledge Base: Solving the Account Limit with Metadata Filtering \- DEV Community, acceso: marzo 24, 2026, [https://dev.to/ryo\_ariyama\_b521d7133c493/multi-tenant-design-for-bedrock-knowledge-base-solving-the-account-limit-with-metadata-filtering-e6b](https://dev.to/ryo_ariyama_b521d7133c493/multi-tenant-design-for-bedrock-knowledge-base-solving-the-account-limit-with-metadata-filtering-e6b)  
11. Filtering queries using Metadata vs Namespace \- General \- Pinecone Community, acceso: marzo 24, 2026, [https://community.pinecone.io/t/filtering-queries-using-metadata-vs-namespace/918](https://community.pinecone.io/t/filtering-queries-using-metadata-vs-namespace/918)  
12. How does AI Agent isolate data in a multi-tenant environment? \- Tencent Cloud, acceso: marzo 24, 2026, [https://www.tencentcloud.com/techpedia/126617](https://www.tencentcloud.com/techpedia/126617)  
13. Multi-Tenant Architecture Patterns in Next.js \- Achromatic Dev, acceso: marzo 24, 2026, [https://www.achromatic.dev/blog/multi-tenant-architecture-nextjs](https://www.achromatic.dev/blog/multi-tenant-architecture-nextjs)  
14. Supabase Multi-Tenancy CRM Integration Guide | Per-Tenant Sync \- Stacksync, acceso: marzo 24, 2026, [https://www.stacksync.com/blog/supabase-multi-tenancy-crm-integration](https://www.stacksync.com/blog/supabase-multi-tenancy-crm-integration)  
15. Scaling RAG Application to Production \- Multi-tenant Architecture Questions \- Reddit, acceso: marzo 24, 2026, [https://www.reddit.com/r/Rag/comments/1n21nq1/scaling\_rag\_application\_to\_production\_multitenant/](https://www.reddit.com/r/Rag/comments/1n21nq1/scaling_rag_application_to_production_multitenant/)  
16. Row Level Security | Supabase Docs, acceso: marzo 24, 2026, [https://supabase.com/docs/guides/database/postgres/row-level-security](https://supabase.com/docs/guides/database/postgres/row-level-security)  
17. Supabase RLS Guide: Policies That Actually Work \- DesignRevision, acceso: marzo 24, 2026, [https://designrevision.com/blog/supabase-row-level-security](https://designrevision.com/blog/supabase-row-level-security)  
18. How to create a Multi‑Tenant RAG \- Medium, acceso: marzo 24, 2026, [https://medium.com/@rockingmanas78/how-to-create-a-multi-tenant-rag-44aa0fefa383](https://medium.com/@rockingmanas78/how-to-create-a-multi-tenant-rag-44aa0fefa383)  
19. Multi-Tenancy in Vector Databases | Pinecone, acceso: marzo 24, 2026, [https://www.pinecone.io/learn/series/vector-databases-in-production-for-busy-engineers/vector-database-multi-tenancy/](https://www.pinecone.io/learn/series/vector-databases-in-production-for-busy-engineers/vector-database-multi-tenancy/)  
20. Rethinking Vector Search at Scale: Weaviate's Native, Efficient and Optimized Multi-Tenancy, acceso: marzo 24, 2026, [https://weaviate.io/blog/weaviate-multi-tenancy-architecture-explained](https://weaviate.io/blog/weaviate-multi-tenancy-architecture-explained)  
21. How Dust Scaled to 5,000+ Data Sources with Qdrant, acceso: marzo 24, 2026, [https://qdrant.tech/blog/case-study-dust-v2/](https://qdrant.tech/blog/case-study-dust-v2/)  
22. Implement multitenancy \- Pinecone Docs, acceso: marzo 24, 2026, [https://docs.pinecone.io/guides/index-data/implement-multitenancy](https://docs.pinecone.io/guides/index-data/implement-multitenancy)  
23. Pinecone vs Weaviate: Which Vector Database Should You Choose? \- PE Collective, acceso: marzo 24, 2026, [https://pecollective.com/tools/pinecone-vs-weaviate/](https://pecollective.com/tools/pinecone-vs-weaviate/)  
24. How to Set Up an AI Model Router for Your LLM Stack | MindStudio, acceso: marzo 24, 2026, [https://www.mindstudio.ai/blog/set-up-ai-model-router-llm-stack](https://www.mindstudio.ai/blog/set-up-ai-model-router-llm-stack)  
25. 5 tips to optimize your LLM intent classification prompts | Pathways \- Voiceflow, acceso: marzo 24, 2026, [https://www.voiceflow.com/pathways/5-tips-to-optimize-your-llm-intent-classification-prompts](https://www.voiceflow.com/pathways/5-tips-to-optimize-your-llm-intent-classification-prompts)  
26. Intent Routing in Production Voice AI | by Ashish Kumar | Jan, 2026 | Medium, acceso: marzo 24, 2026, [https://medium.com/@ashishkumar\_81395/intent-routing-in-production-voice-ai-2dc9702dae48](https://medium.com/@ashishkumar_81395/intent-routing-in-production-voice-ai-2dc9702dae48)  
27. What is Semantic Router? Key Uses & How It Works | Deepchecks, acceso: marzo 24, 2026, [https://deepchecks.com/glossary/semantic-router/](https://deepchecks.com/glossary/semantic-router/)  
28. How to Create a Property Management Answering Service Using AI \- Voiceflow, acceso: marzo 24, 2026, [https://www.voiceflow.com/blog/property-management-answering-service](https://www.voiceflow.com/blog/property-management-answering-service)  
29. Multi-LLM routing strategies for generative AI applications on AWS | Artificial Intelligence, acceso: marzo 24, 2026, [https://aws.amazon.com/blogs/machine-learning/multi-llm-routing-strategies-for-generative-ai-applications-on-aws/](https://aws.amazon.com/blogs/machine-learning/multi-llm-routing-strategies-for-generative-ai-applications-on-aws/)  
30. Fin AI Agent explained | Intercom Help, acceso: marzo 24, 2026, [https://www.intercom.com/help/en/articles/7120684-fin-ai-agent-explained](https://www.intercom.com/help/en/articles/7120684-fin-ai-agent-explained)  
31. How to set up subdomain-based multi-tenancy with Next.js, Supabase (DB/Auth), and next-intl? \#84461 \- GitHub, acceso: marzo 24, 2026, [https://github.com/vercel/next.js/discussions/84461](https://github.com/vercel/next.js/discussions/84461)  
32. Design Patterns for Multi-Tenant Applications in DDD Architecture | by Szymon Pacholski, acceso: marzo 24, 2026, [https://medium.com/@spacholski99/design-patterns-for-multi-tenant-applications-in-ddd-architecture-abff42d27473](https://medium.com/@spacholski99/design-patterns-for-multi-tenant-applications-in-ddd-architecture-abff42d27473)  
33. Data Isolation in Multi-Tenant Software as a Service (SaaS) \- Redis, acceso: marzo 24, 2026, [https://redis.io/blog/data-isolation-multi-tenant-saas/](https://redis.io/blog/data-isolation-multi-tenant-saas/)  
34. Introducing Vector Buckets \- Supabase, acceso: marzo 24, 2026, [https://supabase.com/blog/vector-buckets](https://supabase.com/blog/vector-buckets)  
35. Redis Caching Strategies: Next.js Production Guide 2025 \- Digital Applied, acceso: marzo 24, 2026, [https://www.digitalapplied.com/blog/redis-caching-strategies-nextjs-production](https://www.digitalapplied.com/blog/redis-caching-strategies-nextjs-production)  
36. Understanding Retrieval Augmented Generation \- Dust Docs, acceso: marzo 24, 2026, [https://docs.dust.tt/docs/understanding-retrieval-augmented-generation-rag-and-the-search-method-in-dust](https://docs.dust.tt/docs/understanding-retrieval-augmented-generation-rag-and-the-search-method-in-dust)  
37. AI Agent Hallucinations: Causes, Types, and How to Prevent Tool Errors \- Substack, acceso: marzo 24, 2026, [https://substack.com/home/post/p-186009419](https://substack.com/home/post/p-186009419)  
38. How to Avoid Hallucinations in AI Sales Agents, acceso: marzo 24, 2026, [https://magicblocks.ai/blog/how-to-avoid-hallucinations-in-ai-sales-agents](https://magicblocks.ai/blog/how-to-avoid-hallucinations-in-ai-sales-agents)  
39. Tools \- Dust Docs, acceso: marzo 24, 2026, [https://docs.dust.tt/docs/tools](https://docs.dust.tt/docs/tools)  
40. Overview \- Voiceflow Documentation, acceso: marzo 24, 2026, [https://docs.voiceflow.com/documentation/build/overview](https://docs.voiceflow.com/documentation/build/overview)  
41. Everything we launched at 'The next generation of AI customer experience' | Pathways, acceso: marzo 24, 2026, [https://www.voiceflow.com/pathways/everything-we-launched-v4](https://www.voiceflow.com/pathways/everything-we-launched-v4)  
42. Stop AI Agent Hallucinations: 4 Essential Techniques \- DEV Community, acceso: marzo 24, 2026, [https://dev.to/aws/stop-ai-agent-hallucinations-4-essential-techniques-2i94](https://dev.to/aws/stop-ai-agent-hallucinations-4-essential-techniques-2i94)  
43. Reducing AI hallucinations with guardrails \- Portkey, acceso: marzo 24, 2026, [https://portkey.ai/blog/reducing-ai-hallucinations-with-guardrails/](https://portkey.ai/blog/reducing-ai-hallucinations-with-guardrails/)  
44. Building Guardrails Against Hallucinations in AI SRE Agents \- Neubird, acceso: marzo 24, 2026, [https://neubird.ai/blog/ai-sre-hallucination-guardrails/](https://neubird.ai/blog/ai-sre-hallucination-guardrails/)  
45. Four Common CORS Errors and How to Fix Them \- Descope, acceso: marzo 24, 2026, [https://www.descope.com/blog/post/cors-errors](https://www.descope.com/blog/post/cors-errors)  
46. Exploring the Role of CORS in API Security and Design \- Zuplo, acceso: marzo 24, 2026, [https://zuplo.com/learning-center/exploring-the-role-of-cors-api-security-design](https://zuplo.com/learning-center/exploring-the-role-of-cors-api-security-design)  
47. AI security: When your agent crosses multiple independent systems, who vouches for it?, acceso: marzo 24, 2026, [https://www.okta.com/blog/ai/ai-security-agent-cross-system-trust/](https://www.okta.com/blog/ai/ai-security-agent-cross-system-trust/)  
48. Sample code snippets for setting up Identity Verification in the Intercom Messenger \- GitHub, acceso: marzo 24, 2026, [https://github.com/intercom/identity-verification-code-samples](https://github.com/intercom/identity-verification-code-samples)  
49. What is Identity Verification? \[deprecated\] | Fin by Intercom: Help Center, acceso: marzo 24, 2026, [https://fin.ai/help/en/articles/13975780-what-is-identity-verification-deprecated](https://fin.ai/help/en/articles/13975780-what-is-identity-verification-deprecated)  
50. Migrating from Identity Verification to Messenger Security with JWTs | Intercom Help, acceso: marzo 24, 2026, [https://www.intercom.com/help/en/articles/10807823-migrating-from-identity-verification-to-messenger-security-with-jwts](https://www.intercom.com/help/en/articles/10807823-migrating-from-identity-verification-to-messenger-security-with-jwts)  
51. HMAC Identity Verification \- Introduction, acceso: marzo 24, 2026, [https://foldspace.readme.io/docs/hmac-identity-verification](https://foldspace.readme.io/docs/hmac-identity-verification)  
52. CORS Security: Beyond Basic Configuration, acceso: marzo 24, 2026, [https://www.aikido.dev/blog/cors-security-beyond-basic-configuration](https://www.aikido.dev/blog/cors-security-beyond-basic-configuration)  
53. Handling CORS errors for Chat Widget | yellow.ai, acceso: marzo 24, 2026, [https://docs.yellow.ai/docs/cookbooks/channels/CORSerrors](https://docs.yellow.ai/docs/cookbooks/channels/CORSerrors)  
54. JWTs for AI Agents: Authenticating Non-Human Identities \- Security Boulevard, acceso: marzo 24, 2026, [https://securityboulevard.com/2025/11/jwts-for-ai-agents-authenticating-non-human-identities/](https://securityboulevard.com/2025/11/jwts-for-ai-agents-authenticating-non-human-identities/)  
55. JWT Security Guide: Best Practices & Implementation (2025) \- Deepak Gupta, acceso: marzo 24, 2026, [https://guptadeepak.com/understanding-jwt-from-basics-to-advanced-security/](https://guptadeepak.com/understanding-jwt-from-basics-to-advanced-security/)  
56. The Fin AI Engine™: Powering Next-Gen AI Support | Intercom, acceso: marzo 24, 2026, [https://fin.ai/ai-engine](https://fin.ai/ai-engine)  
57. Sierra AI Review 2026 | CallBotics, acceso: marzo 24, 2026, [https://callbotics.ai/blog/sierra-review](https://callbotics.ai/blog/sierra-review)  
58. Building Deep Dive: Infrastructure for AI Agents That Actually Go Deep | Dust Blog, acceso: marzo 24, 2026, [https://dust.tt/blog/building-deep-dive-infrastructure-for-ai-agents-that-actually-go-deep](https://dust.tt/blog/building-deep-dive-infrastructure-for-ai-agents-that-actually-go-deep)  
59. Mastering Voyage AI Embeddings: A Deep Dive \- Sparkco AI, acceso: marzo 24, 2026, [https://sparkco.ai/blog/mastering-voyage-ai-embeddings-a-deep-dive](https://sparkco.ai/blog/mastering-voyage-ai-embeddings-a-deep-dive)  
60. Connecting Knowledge Bases to an Autonomous Node | Botpress Academy, acceso: marzo 24, 2026, [https://botpress.com/academy-lesson/knowledge-base](https://botpress.com/academy-lesson/knowledge-base)  
61. Chatbot Hallucinations and How to Prevent Them \- GoZen.io, acceso: marzo 24, 2026, [https://gozen.io/blog/chatbot-hallucinations/](https://gozen.io/blog/chatbot-hallucinations/)  
62. AI Hallucinations in Agents: Lessons from Enterprise Deployments \- Yellow.ai, acceso: marzo 24, 2026, [https://yellow.ai/blog/lets-talk-hallucinations-in-ai-agents-what-weve-learned-from-solving-for-enterprises/](https://yellow.ai/blog/lets-talk-hallucinations-in-ai-agents-what-weve-learned-from-solving-for-enterprises/)  
63. AI Hallucinations: Why They Occur and How to Prevent Damage \- NineTwoThree Studio, acceso: marzo 24, 2026, [https://www.ninetwothree.co/blog/ai-hallucinations](https://www.ninetwothree.co/blog/ai-hallucinations)  
64. Multi-tenant vector search with Amazon Aurora PostgreSQL and Amazon Bedrock Knowledge Bases | AWS Database Blog, acceso: marzo 24, 2026, [https://aws.amazon.com/blogs/database/multi-tenant-vector-search-with-amazon-aurora-postgresql-and-amazon-bedrock-knowledge-bases/](https://aws.amazon.com/blogs/database/multi-tenant-vector-search-with-amazon-aurora-postgresql-and-amazon-bedrock-knowledge-bases/)  
65. Multi-Tenant Architecture: A Complete Guide (Basic to Advanced) \- DEV Community, acceso: marzo 24, 2026, [https://dev.to/tak089/multi-tenant-architecture-a-complete-guide-basic-to-advanced-119o](https://dev.to/tak089/multi-tenant-architecture-a-complete-guide-basic-to-advanced-119o)  
66. Agent step \- Voiceflow's docs, acceso: marzo 24, 2026, [https://docs.voiceflow.com/docs/agents](https://docs.voiceflow.com/docs/agents)  
67. Previewing Intent Classification and Improvements \- Voiceflow's docs, acceso: marzo 24, 2026, [https://docs.voiceflow.com/docs/previewing-intent-classification-and-improvements](https://docs.voiceflow.com/docs/previewing-intent-classification-and-improvements)  
68. How Sierra AI Does Context Engineering \- Video | MLOps Community, acceso: marzo 24, 2026, [https://home.mlops.community/public/videos/how-sierra-ai-does-context-engineering](https://home.mlops.community/public/videos/how-sierra-ai-does-context-engineering)