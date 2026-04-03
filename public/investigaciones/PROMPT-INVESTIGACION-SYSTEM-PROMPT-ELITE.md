# PROMPT DE INVESTIGACIÓN: System Prompts de Compañías Élite del Mundo
## Para agente investigador — profundidad máxima, entregables accionables

---

## CONTEXTO: QUIÉNES SOMOS Y DÓNDE ESTAMOS

### El producto
**Queswa** es una IA conversacional embebida en `creatuactivo.com` que opera como consultor de ventas autónomo para un negocio de distribución de tecnología nutricional (Gano Excel, 70 países). Su función: filtrar prospectos inbound, explicar la oportunidad de negocio y guiarlos hacia la activación — sin intervención humana hasta que el prospecto levanta la mano.

### La arquitectura actual
- **Stack**: Next.js 14, Anthropic Claude API (claude-sonnet-4-6), RAG con Voyage AI embeddings, Supabase
- **Contexto inyectado en cada conversación**: System prompt (~47KB) + fragmentos recuperados por vector search (~8 arsenales, 135 fragmentos) + historial de conversación
- **Multi-tenant**: mismo motor para 4 dominios (creatuactivo.com, luiscabrejo.com, ganocafe.online, queswa.app) con system prompts independientes por tenant

### El problema que estamos resolviendo
Llevamos semanas haciendo clínicas de conversación (role-play prospecto real) y auditando capturas de pantalla reales. Diagnóstico honesto del estado actual:

**Experiencia actual ≈ 2–3 estrellas (de 11)**

Síntomas observados:
- El modelo asume arquetipos del prospecto antes de tener datos ("cómo funciona el negocio" → asume que es emprendedor)
- Genera menús A-F con opciones que no están en los arsenales (hallucination de UX)
- Cambia de tono abruptamente a mitad de conversación (Lujo Clínico → formulario de call center)
- Planta objeciones que el prospecto nunca tuvo ("¿vas a involucrar a alguien más?" cuando nadie lo preguntó)
- Recomienda el tier más caro sin que el prospecto lo pida
- Usa etiquetas inventadas ("Perfil: Explorador") que son lenguaje de vergüenza
- Pregunta el nombre después de ya haberlo capturado
- Usa "esto" en lugar de "CreaTuActivo" — le quita identidad a la plataforma

### El framework DEL → AL: de 2 estrellas a 11 estrellas

| Dimensión | DEL (2 estrellas — hoy) | AL (11 estrellas — destino) |
|-----------|--------------------------|------------------------------|
| **Memoria de perfil** | Pide datos que ya capturó. Hace preguntas redundantes. | Nunca repite una pregunta. Usa el nombre desde el primer mensaje después de capturarlo. Adapta cada respuesta al perfil acumulado. |
| **Detección de arquetipo** | Infiere arquetipo de palabras sueltas en preguntas genéricas. Se equivoca frecuentemente. | Detecta arquetipo SOLO cuando el prospecto describe su propia situación. Hasta entonces, mantiene tono universal. |
| **Consistencia de tono** | Salta entre Lujo Clínico y formulario burocrático según el fragmento recuperado. | Tono consistente en 14 mensajes. El fragmento de arsenal informa el contenido, no el registro. El registro siempre es consultor senior. |
| **Regla 4 (no plantar objeciones)** | Introduce objeciones no solicitadas en momentos críticos (el cierre). | Nunca menciona una fricción que el prospecto no introdujo primero. |
| **Cierre** | Hace preguntas adicionales después de que el prospecto dijo que quiere iniciar. | Activa CIERRE_01 inmediatamente. Dos variables. Acceso en 60 segundos. |
| **Uso del contexto acumulado** | Trata cada mensaje como si fuera el primero. | Usa nombre, ocupación, arquetipo, objeciones registradas y score de interés para personalizar cada respuesta. |

---

## LO QUE NECESITO INVESTIGAR

### PREGUNTA CENTRAL:
¿Cómo estructuran sus system prompts las compañías de IA más sofisticadas del mundo para lograr experiencias de conversación de 11 estrellas? ¿Qué principios, reglas, formatos y técnicas usan?

---

## LÍNEAS DE INVESTIGACIÓN ESPECÍFICAS

### 1. ARQUITECTURA DEL SYSTEM PROMPT EN PRODUCTOS ÉLITE

Investigar cómo compañías como Anthropic (Claude.ai), OpenAI (ChatGPT), Intercom (Fin AI), Salesforce (Einstein), Drift, y startups de IA de clase mundial estructuran sus system prompts para:

- **Consistencia de tono a lo largo de conversaciones largas**: ¿cómo evitan que el modelo "se salga del personaje" después de varios turnos?
- **Uso del contexto acumulado**: ¿qué técnicas usan para que el modelo recuerde y aplique lo que el usuario dijo en el mensaje 1 cuando está respondiendo el mensaje 8?
- **Prevención de hallucination de UX**: ¿cómo evitan que el modelo genere estructuras (menús, opciones, flujos) que no están autorizados?
- **Separación de "qué responder" (contenido) vs "cómo responder" (tono/formato)**: ¿cómo mantienen el registro consistente independientemente del contenido?

Entregable esperado: Principios estructurales con ejemplos concretos de la industria.

---

### 2. REGLAS DE ORO EN SYSTEM PROMPTS DE VENTAS CONVERSACIONALES

Investigar los mejores chatbots de ventas del mundo (B2C y B2B) — especialmente en sectores de alta fricción (seguros, servicios financieros, bienes raíces, educación premium, salud):

- ¿Cómo manejan la **detección de intención vs. asunción**? ¿Cómo evitan asumir el perfil del usuario antes de tenerlo?
- ¿Qué reglas tienen sobre **cuándo NO preguntar** (porque la información ya fue capturada)?
- ¿Cómo manejan los **momentos de cierre** — cuándo dejar de calificar y ejecutar?
- ¿Qué hacen con los **prospectos que preguntan genéricamente** ("cómo funciona") vs. los que revelan contexto personal?
- **Regla de Chekhov en conversación**: si capturas un dato (nombre, ocupación, dolor), ¿cuándo y cómo lo usas?

Entregable esperado: Reglas accionables con justificación psicológica/conductual.

---

### 3. TÉCNICAS DE PREVENCIÓN DE HALLUCINATION INSTRUCCIONAL

El problema más común en producción: el modelo genera respuestas "razonables" que no están en el prompt. Por ejemplo, genera menús de opciones que nadie autorizó porque "parece lo lógico".

Investigar:
- Técnicas de **bloqueo instruccional** (cómo Anthropic, OpenAI y equipos de prompt engineering avanzado redactan prohibiciones que el modelo realmente respeta)
- Diferencia entre **regla textual** vs. **ejemplo con razón** — cuál tiene más peso conductual y por qué
- **Formato de la prohibición**: ¿"No hagas X" vs. "Si ocurre X, haz Y en cambio"? ¿Qué es más efectivo?
- Uso de **few-shot negativo**: ejemplos de lo que NO debe hacer y por qué

Entregable esperado: Framework para redactar prohibiciones efectivas en system prompts.

---

### 4. EL FRAMEWORK DE 11 ESTRELLAS APLICADO A IA CONVERSACIONAL

Brian Chesky (Airbnb) popularizó el framework: define la experiencia de 1 estrella (terrible), 5 estrellas (lo que esperas), 7 estrellas (sorprendente), 11 estrellas (imposiblemente buena). Luego trabaja hacia atrás hasta lo que es posible.

Investigar cómo este framework ha sido aplicado específicamente a:
- **Chatbots de servicio al cliente**: ¿qué define una experiencia de 11 estrellas en un chatbot? ¿Cuáles son los ejemplos reales más cercanos a ese estándar?
- **IA de ventas conversacional**: ¿qué haría una IA de ventas de 11 estrellas diferente a una de 5 estrellas?
- **Personalización en tiempo real**: ¿cuál es el estándar actual en personalización de respuestas basada en perfil acumulado?

Para el contexto de Queswa, una experiencia de 11 estrellas sería: el prospecto siente que está hablando con el mejor consultor de patrimonio que ha conocido — uno que lo escuchó desde el primer mensaje, nunca le repitió una pregunta, le habló exactamente en su idioma, y le dio un camino claro sin presionarlo.

Entregable esperado: Definición operacional de cada nivel del 1 al 11 para un chatbot de ventas conversacional, con criterios medibles.

---

### 5. GESTIÓN DEL CONTEXTO EN CONVERSACIONES LARGAS (>8 MENSAJES)

El problema técnico-conductual: los modelos tienen tendencia a "olvidar" o ignorar información del inicio de la conversación cuando la conversación se extiende.

Investigar:
- Técnicas de **context pinning**: cómo asegurar que datos capturados temprano (nombre, ocupación, arquetiipo, objeción principal) sean activos en los mensajes tardíos
- **Resumen progresivo**: algunos sistemas hacen que el modelo actualice un resumen del prospecto a medida que avanza la conversación — ¿cuáles son las mejores implementaciones?
- **Structured output para CRM**: técnicas para que el modelo extraiga y actualice datos del prospecto en paralelo a la conversación (sin que el usuario lo vea)
- **Señales de interés y cierre**: ¿cómo detectan los mejores sistemas cuándo el prospecto ha levantado la mano y es momento de ejecutar cierre?

Entregable esperado: Implementaciones concretas con código o pseudocódigo cuando esté disponible.

---

### 6. ESTUDIO DE CASO: LOS MEJORES CHATBOTS DE VENTAS DEL MUNDO

Hacer un estudio comparativo de los 5–8 mejores sistemas de IA conversacional de ventas actualmente:

Para cada uno documentar:
- ¿Qué hace excepcionalmente bien?
- ¿Cuál es su arquitectura de system prompt (si está disponible o inferible)?
- ¿Qué técnicas específicas usan para mantener el tono y el contexto?
- ¿Qué podemos replicar o adaptar para Queswa?

Candidatos sugeridos para investigar: Intercom Fin, Drift Conversational AI, Salesforce Einstein, Klarna AI, Air (AI phone agent), Bland AI, ElevenLabs Conversational AI, cualquier chatbot de ventas de compañía Fortune 500 que sea reconocido por su calidad.

---

## FORMATO DE ENTREGA ESPERADO

Para cada sección, entregar:

1. **Hallazgo principal** (1–2 oraciones)
2. **Evidencia / fuente** (empresa, paper, artículo, documentación)
3. **Principio accionable** (regla que podemos agregar a nuestro system prompt HOY)
4. **Ejemplo de implementación** (cómo quedaría la regla redactada en un system prompt real)

Al final, un **Playbook de 10 Reglas de Oro** para system prompts de IA conversacional de ventas, ordenadas por impacto en la experiencia del usuario.

---

## CRITERIOS DE CALIDAD PARA LA INVESTIGACIÓN

- Priorizar fuentes primarias: documentación técnica, papers de investigación de IA, casos de estudio verificables, ingeniería de prompts documentada
- Preferir ejemplos reales sobre teoría genérica
- Cuando sea posible, incluir el texto exacto de reglas o instrucciones que compañías élite usan (hay mucho disponible públicamente en leaks de system prompts, documentación de APIs y publicaciones técnicas de Anthropic/OpenAI)
- Nivel de profundidad: suficiente para que un ingeniero de prompts senior pueda implementar las recomendaciones directamente

---

*Contexto adicional disponible si se necesita: arquitectura técnica completa de Queswa, ejemplos de conversaciones reales (buenas y malas), system prompt actual completo.*
