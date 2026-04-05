# PROMPT DE INVESTIGACIÓN — CIERRE CONVERSACIONAL EN CHATBOTS DE VENTAS

**Para:** Agente Investigador de IA
**Tipo de investigación:** Comportamiento de LLMs en máquinas de estado conversacional + mejores prácticas de cierre en chatbots de alto valor
**Lo que NO quiero:** Soluciones de código. Quiero investigación, casos, papers, benchmarks, patrones documentados.

---

## CONTEXTO — QUIÉNES SOMOS Y QUÉ CONSTRUIMOS

Operamos **Queswa**, un chatbot de ventas conversacional powered by Claude (Anthropic) que actúa como filtro de prospectos para un negocio de construcción de patrimonio. El chatbot vive como widget embebido en una web y está desplegado en producción con tráfico real.

**Stack técnico:**
- LLM: Claude claude-sonnet-4-6 (principal) + Claude Haiku (queries simples)
- API: Next.js Edge Runtime, streaming
- Memoria: Supabase (PostgreSQL) con vector search (Voyage AI, embeddings 512d)
- Knowledge base: 7 arsenales RAG fragmentados (~139 fragmentos), recuperados por similitud semántica
- System prompt: ~59KB, cargado desde Supabase, cacheado 5 min
- Arquitectura de prompts: 3 bloques — Bloque 1 (system prompt base, cacheado), Bloque 2 (contexto RAG, cacheado), Bloque 3 (instrucciones de sesión, NO cacheado — punto de inyección dinámica)
- Router: clasificador IIFE que decide Sonnet vs Haiku según complejidad de query

---

## QUÉ HEMOS PROBADO PARA RESOLVER EL PROBLEMA (sin éxito completo)

### El problema central:
El chatbot debe ejecutar una **máquina de estados de cierre estricta** de 3 pasos en secuencia lineal:

1. **ESTADO 1 — Tiempo**: Preguntar cuántas horas a la semana puede dedicar. STOP. Esperar respuesta.
2. **ESTADO 2 — Capitalización**: Presentar tabla de 3 paquetes ($200/$500/$1,000 USD). STOP. Esperar elección.
3. **ESTADO 3 — Handoff**: Entregar link de WhatsApp verbatim. Sin preguntas. Fin.

Esta máquina se activa cuando el prospecto muestra intención de iniciar (detectado por frases como "cómo inicio", "quiero empezar", "vamos", "guíame", etc.).

### Lo que hemos intentado:

**1. Instrucciones en system prompt (varias iteraciones):**
- Versión 1: Descripción narrativa de los 3 estados con reglas de STOP
- Versión 2: Formato de tabla con triggers y respuestas esperadas
- Versión 3: Bloqueos absolutos explícitos ("PROHIBIDO mencionar paquetes en Estado 1")
- Versión 4: Texto verbatim que el modelo debe imprimir exactamente (copiar-pegar)
- Versión 5: Few-shot negativo — mostramos el error exacto que comete + la respuesta correcta

**2. Inyección dinámica en Bloque 3 (instrucciones de sesión):**
- Cuando el sistema detecta que el prospecto eligió un paquete específico, inyectamos el texto verbatim del Estado 3 directamente en el contexto más reciente (Bloque 3, posición de mayor atención del modelo)
- Esto funcionó para Estado 3 pero no resuelve Estados 1 y 2

**3. Router de mensajes:**
- Añadimos guardas para que mensajes cortos (nombre, número de horas) no pasen al modelo Haiku sino siempre a Sonnet
- No resolvió el problema de seguimiento del protocolo

### Comportamientos problemáticos observados (con ejemplos reales):

**Bug A — Desvío antes de Estado 1:**
Trigger: usuario dice "cómo inicio" (frase literalmente en la lista de triggers)
Esperado: Queswa ejecuta inmediatamente el texto de Estado 1 (pregunta de horas)
Observado: Queswa inventa una bifurcación — "Hay dos caminos: el primero es entender mejor el sistema (20-30 min, gratis), el segundo es entrar directo..." — y pregunta al prospecto cuál prefiere. Esta bifurcación NO existe en el protocolo.

**Bug B — KYC después de Estado 1:**
Trigger: usuario responde al Estado 1 con un número ("10", "5 horas", "puedo 8")
Esperado: Queswa ejecuta Estado 2 — presenta tabla de 3 paquetes y pregunta cuál nivel quiere activar
Observado: Queswa dice "perfecto, ahora necesito tres datos puntuales: nombre, correo y país" — inventa un proceso de registro/KYC que no existe en el protocolo

**Bug C (resuelto pero documentado):** Estado 3 hallucination — el modelo inventaba nombres de paquetes inexistentes ("ESP-6", "Starter"), porcentajes incorrectos, pasos adicionales. Resuelto con inyección en Bloque 3.

**Hipótesis sobre la causa raíz:**
Sospechamos que el modelo tiene un "prior" muy fuerte de comportamiento de "asistente de ventas/consultor" que incluye: (a) ofrecer opciones antes de comprometer al prospecto a una acción, (b) capturar datos de contacto antes de avanzar, (c) ser servicial y flexible en lugar de ejecutar protocolos. Este prior override las instrucciones de la máquina de estados incluso con bloqueos explícitos en lenguaje natural.

---

## LA EXPERIENCIA IDEAL — 11 ESTRELLAS

Queremos que cuando un prospecto de alto perfil (CEO, ejecutivo, médico, emprendedor exitoso) llegue al punto de cierre, la experiencia sea:

**Como entrar a una sala de juntas de primer nivel, no como llenar un formulario de e-commerce.**

Específicamente:
- El prospecto no siente que está siendo "procesado" por un bot. Siente que hay inteligencia real y protocolo detrás.
- Cada estado se ejecuta con total precisión quirúrgica. El modelo no improvisa, no agrega pasos, no pide datos que no corresponden.
- La transición entre estados es natural y fluida — no robótica, pero tampoco impredecible.
- El prospecto que dice "cómo inicio" recibe EXACTAMENTE la pregunta de horas — ni más, ni menos. La intención fue captada, honrada, y el proceso comenzó.
- El prospecto que responde "10 horas" recibe EXACTAMENTE la tabla de niveles de capitalización — presentada con el estándar de un banco privado, no de un formulario de MLM.
- El prospecto que elige un nivel recibe EXACTAMENTE el link de WhatsApp — sin burocracia, sin más preguntas, sin fricción.
- La experiencia completa, desde "cómo inicio" hasta el handoff a WhatsApp, toma 3-4 turnos de conversación.

**Lo que NO queremos:**
- Que el bot pida correo, país, cédula en el flujo de cierre
- Que el bot cree bifurcaciones que no existen en el protocolo ("tienes dos opciones")
- Que el bot haga onboarding técnico después del handoff ("te activo en 24 horas", "accedo a tu panel")
- Que el bot invente nombres de paquetes o porcentajes no documentados
- Que el bot sea amablemente ineficiente: muchas palabras, poco avance

---

## PREGUNTAS ESPECÍFICAS PARA INVESTIGAR

1. **¿Cómo logran otros sistemas de chatbot de alto valor que un LLM ejecute protocolos de N pasos con STOP explícito en cada paso?** ¿Existen patrones documentados (papers, casos de uso, posts técnicos) de máquinas de estado sobre LLMs en producción?

2. **¿Cuál es la mejor estrategia para que un LLM resista su "prior" de comportamiento consultivo** (ofrecer opciones, capturar datos, ser flexible) cuando el protocolo requiere exactamente lo contrario (ejecutar, no improvisar)?

3. **¿El problema es de system prompt (instrucción de lenguaje natural) o de arquitectura?** ¿Hay evidencia de que ciertos tipos de instrucciones (few-shot, verbatim templates, JSON schemas de estado, function calling) son más efectivos para state machine compliance?

4. **¿Qué hacen los mejores chatbots de ventas enterprise** (Drift, Intercom AI, Salesforce Einstein, custom GPT de empresas tier-1) para manejar el flujo de cierre? ¿Delegan la lógica al LLM o la controlan externamente con código?

5. **¿Existe el concepto de "state machine grounding"** para LLMs? ¿Cuáles son las mejores prácticas documentadas para anclar a un LLM a un protocolo de pasos fijos sin que se desvíe?

6. **¿Hay trade-offs documentados entre "conversational fluidity" y "protocol compliance"** en LLMs de producción? ¿Cómo calibran los equipos de AI este balance en chatbots de ventas de alto valor?

7. **Casos específicos para investigar:** ¿Cómo maneja esto Character.AI (protocolos de rol), Salesforce Einstein (sales sequences), HubSpot AI Assistant (deal pipelines), o cualquier chatbot que tenga flujos de decisión de múltiples pasos documentados públicamente?

8. **¿Cómo resuelven este problema las compañías élite del mundo y las startups tecnológicas de referencia?**

   Esta es una pregunta central de la investigación. Queremos saber cómo lo hacen los mejores — no las soluciones genéricas de tutoriales, sino las decisiones de arquitectura reales de equipos que han construido chatbots de ventas o asistencia en producción a escala.

   Investiga específicamente:

   - **OpenAI / ChatGPT Enterprise**: ¿Cómo implementan GPTs con flujos guiados? ¿Usan function calling, structured outputs, o system prompt puro para forzar protocolos?
   - **Anthropic (internamente)**: ¿Hay documentación publicada sobre cómo su propio equipo aborda la compliance de protocolos en Claude cuando construyen productos? ¿Qué dicen sus papers de alignment sobre instruction following en flujos de múltiples pasos?
   - **Intercom (Fin AI)**: Uno de los chatbots de soporte/ventas más maduros del mercado. ¿Cómo diseñan sus "resolution flows"? ¿Delegan la lógica de estado al LLM o la controlan con orquestación externa?
   - **Salesforce (Einstein Copilot)**: Tienen el problema de ventas de alto valor resuelto en enterprise. ¿Qué arquitectura usan para sus sales sequences con AI? ¿Hay ingeniería de prompts documentada o whitepapers técnicos?
   - **Retell AI / Bland AI / Vapi**: Startups de AI voice agents para ventas. Han resuelto exactamente este problema para llamadas de ventas estructuradas. ¿Qué publican sobre su arquitectura de flujo conversacional?
   - **11x.ai / Artisan AI**: Startups de AI SDR (Sales Development Representatives) que ejecutan secuencias de ventas automatizadas. ¿Cómo manejan la compliance de protocolo en conversaciones de calificación?
   - **Vercel AI SDK / LangChain / LlamaIndex**: ¿Tienen abstracciones documentadas para state machines sobre LLMs? ¿Qué patrones emergieron de la comunidad como estándares?
   - **Linear / Notion / Stripe**: Empresas tech de referencia que han construido asistentes AI internos. ¿Han publicado algo sobre cómo orquestan flujos de múltiples pasos?
   - **Y Combinator / a16z portfolio**: ¿Hay startups de AI en sus portfolios especializadas en conversational AI para ventas que hayan publicado su arquitectura? Busca en sus blogs de ingeniería.
   - **Investigación académica y de laboratorio**: Papers recientes (2024-2025) sobre "LLM agents with tool use", "multi-step conversational AI", "instruction following in dialogue systems", "state tracking in neural conversation models". Busca en arXiv, ACL Anthology, NeurIPS proceedings.

   Para cada compañía o startup relevante que encuentres, responde:
   - ¿Qué arquitectura usan: prompt puro, function calling, orquestación externa, fine-tuning, o combinación?
   - ¿Han publicado postmortems, engineering blogs, o talks sobre los problemas que encontraron?
   - ¿Qué antipatrones documentaron — qué intentaron que NO funcionó?
   - ¿Cuál fue el insight que cambió el juego para ellos?

---

## ENTREGABLES ESPERADOS

- Resumen de mejores prácticas documentadas (con fuentes)
- Patrones de implementación con mayor tasa de éxito para state compliance en LLMs
- Cómo lo resuelven las compañías élite: OpenAI, Anthropic, Intercom, Salesforce, y startups de AI sales (con fuentes y nivel de detalle técnico disponible públicamente)
- Trade-offs relevantes (pros/contras de cada enfoque)
- Casos de uso reales similares al nuestro (ventas de alto valor, chatbot como filtro de prospectos)
- Investigación académica relevante sobre instruction following y state tracking en LLMs (papers 2023-2025)
- Recomendaciones de qué NO hacer (antipatrones documentados por equipos reales)

**Formato preferido:** Estructurado, con secciones claras, citable. No necesito código. Necesito entendimiento profundo del problema para tomar decisiones de arquitectura informadas.
