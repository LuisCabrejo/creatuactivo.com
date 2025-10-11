

# **Informe Arquitectónico y Hoja de Ruta Estratégica para el Agente NEXUS**

## **Resumen Ejecutivo: El Camino hacia un Agente NEXUS Resiliente**

Este informe presenta un análisis arquitectónico exhaustivo del agente de IA conversacional NEXUS y una hoja de ruta estratégica para su reconstrucción. El análisis concluye de manera inequívoca que el fallo crítico conocido como el "Mensaje Fantasma" no es un error aislado, sino el síntoma de una deficiencia arquitectónica sistémica. Esta debilidad fundamental se origina en una combinación de gestión inadecuada del estado en el frontend, que genera condiciones de carrera, y un pipeline de ingesta de datos síncrono y frágil en el backend. La arquitectura actual es incapaz de soportar la visión estratégica de un asistente robusto y escalable, presentando riesgos significativos para la integridad de los datos y la fiabilidad del servicio.

Para abordar estas deficiencias y alinear la implementación técnica con los objetivos del Ecosistema NodeX, se propone una solución integral basada en tres pilares fundamentales:

1. **Re-arquitectura del Backend hacia un Pipeline de Datos Asíncrono:** Se recomienda reemplazar el actual flujo síncrono por un modelo de productor-consumidor desacoplado, utilizando una cola de mensajes nativa de Supabase (pgmq). Este cambio transformará el endpoint de la API en un "Productor" rápido y fiable, cuya única responsabilidad será validar y encolar las conversaciones. Un "Consumidor" asíncrono (ej. una Edge Function) procesará estas conversaciones de manera independiente, garantizando que ninguna interacción del usuario se pierda debido a latencias o fallos en servicios de terceros como la IA.  
2. **Refactorización del Frontend para una Gestión de Estado Robusta:** Se debe corregir la causa raíz del "Mensaje Fantasma" reestructurando la lógica del frontend para sincronizar correctamente las actualizaciones de estado con los efectos secundarios, como las llamadas a la API. Esto implica eliminar las condiciones de carrera mediante un manejo adecuado del ciclo de vida de los componentes de React y consolidar los componentes de interfaz de usuario redundantes para mejorar la mantenibilidad.  
3. **Optimización de la Ingeniería de Prompts para la Extracción de Datos:** La fiabilidad del motor de captura de datos se incrementará drásticamente mediante la reingeniería del prompt enviado al modelo de IA Claude. La implementación de técnicas avanzadas, como el uso de etiquetas XML para delimitar el contexto, la provisión de ejemplos claros (few-shot prompting) y el pre-llenado de la respuesta para forzar una salida JSON estructurada, convertirá el componente de IA en un procesador de datos predecible y preciso.

La hoja de ruta de implementación propuesta prioriza la estabilidad y la integridad de los datos. La **Fase 1** se centra exclusivamente en la construcción de un Producto Mínimo Viable (MVP) que implemente este nuevo pipeline asíncrono, con el objetivo de lograr una captura de datos 100% fiable. Una vez establecida esta base sólida, las fases posteriores se dedicarán a reintegrar y expandir las funcionalidades avanzadas de NEXUS, como la interfaz de usuario enriquecida y las capacidades proactivas de asistencia en ventas, con la confianza de que operan sobre una infraestructura escalable y resiliente. La adopción de esta estrategia no solo resolverá los problemas críticos actuales, sino que también establecerá el fundamento técnico necesario para que NEXUS cumpla su rol central en la visión a largo plazo del Ecosistema NodeX.

## **Auditoría Arquitectónica: Análisis de la Implementación Actual de NEXUS ("Dónde Estamos")**

Esta sección proporciona un diagnóstico completo y detallado del sistema existente, analizando cada artefacto para establecer una línea base clara del estado actual. El objetivo es comprender no solo *qué* está fallando, sino *por qué* la arquitectura actual es inherentemente propensa a errores como el "Mensaje Fantasma".

### **A. Revisión de Componentes y Gestión de Estado del Frontend**

El frontend de NEXUS, construido en React, es la primera línea de interacción y, como revela el análisis, el punto de origen del fallo más crítico del sistema. La evaluación se centra en la cohesión de su arquitectura de componentes, los patrones de gestión de estado y la identificación precisa de las condiciones de carrera que comprometen la integridad de los datos.

#### **Análisis de Redundancia de Componentes (NEXUSWidget.tsx vs. Chat.tsx)**

La presencia de dos componentes de chat distintos, NEXUSWidget.tsx (descrito como "avanzado") y Chat.tsx (descrito como "simple"), es una señal de alerta inmediata. En una arquitectura de componentes bien diseñada, la funcionalidad principal, como una ventana de chat, debe ser encapsulada en un único componente reutilizable y configurable.1 La existencia de duplicados sugiere un problema más profundo que la simple ineficiencia del código.

Este tipo de redundancia es un síntoma clásico de "deriva arquitectónica" (architectural drift), un fenómeno en el que las adiciones o modificaciones a corto plazo se realizan sin adherirse a una visión arquitectónica coherente. Esto suele ocurrir cuando un componente existente se percibe como demasiado complejo o arriesgado de modificar, llevando a los desarrolladores a crear una nueva versión desde cero para una nueva funcionalidad. Las consecuencias de esta práctica son graves:

* **Aumento del Costo de Mantenimiento:** Cualquier cambio en la lógica o el estilo del chat debe ser implementado y probado en dos lugares distintos, duplicando el esfuerzo y aumentando la probabilidad de inconsistencias.  
* **Incremento de la Carga Cognitiva:** Los nuevos desarrolladores que se incorporen al proyecto se enfrentarán a una ambigüedad innecesaria, teniendo que descifrar cuál componente usar, por qué existen dos y cuáles son sus diferencias sutiles.3 Esto ralentiza el desarrollo y aumenta el riesgo de introducir nuevos errores.  
* **Experiencia de Usuario Inconsistente:** Es muy probable que los dos componentes, al tener bases de código separadas, se comporten o se vean de manera diferente, creando una experiencia de usuario fragmentada.

La práctica recomendada es adherirse al Principio de Responsabilidad Única, donde cada componente tiene un propósito claro y bien definido.4 La funcionalidad de chat debe ser consolidada en un único componente NEXUSChat.tsx, que pueda ser configurado a través de props para manejar diferentes casos de uso si es necesario, en lugar de mantener dos implementaciones separadas.

#### **Análisis de la Gestión de Estado y Hooks (useNEXUSChat.ts, useSlidingViewport.ts)**

El hook personalizado useNEXUSChat.ts es el centro neurálgico de la lógica del frontend y, con un alto grado de certeza, la fuente directa del "Mensaje Fantasma". El problema no reside en el uso de un hook personalizado, que es un patrón excelente en React, sino en una implementación que no respeta la naturaleza asíncrona de las actualizaciones de estado en React.

Las actualizaciones de estado en React, como las realizadas con la función setState de useState, no son inmediatas. React las programa para ejecutarse en un futuro cercano, optimizando el rendimiento al agrupar múltiples actualizaciones.5 Un error común, especialmente entre desarrolladores que migran de paradigmas imperativos, es asumir que el estado se actualiza sincrónicamente dentro del mismo ámbito de la función. Este malentendido es la causa raíz de la condición de carrera observada. La lógica actual probablemente desencadena la llamada a la API con la variable de estado del historial de mensajes *antes* de que la actualización que agrega el último mensaje del usuario se haya procesado y reflejado en esa variable.6

Este defecto fundamental en la orquestación de estado y efectos secundarios indica una brecha en la comprensión de los principios fundamentales de React. Si no se aborda, este patrón de error se repetirá en futuras funcionalidades que involucren operaciones asíncronas, creando una fuente constante de errores sutiles y difíciles de depurar.

Por otro lado, el hook useSlidingViewport.ts, aunque su propósito es puramente visual, introduce complejidad adicional. En sistemas con una gestión de estado deficiente, los hooks de UI pueden contribuir a problemas de rendimiento al provocar re-renderizados innecesarios de componentes que no deberían verse afectados por animaciones visuales.3 Su lógica debe ser aislada y optimizada para asegurar que no interfiera con el estado crítico de la aplicación.

#### **Tabla 1: Matriz de Utilidad y Recomendación de Artefactos**

La siguiente tabla resume el análisis de cada artefacto, su propósito actual, los problemas identificados y la acción recomendada para construir una base sólida.

| Artefacto | Propósito y Rol Actual | Problemas Identificados | Acción Recomendada |
| :---- | :---- | :---- | :---- |
| NEXUSWidget.tsx | Componente principal y "avanzado" de la UI del chat. | Probablemente sobrecargado de lógica, fuertemente acoplado con el estado. | **Consolidar y Refactorizar:** Fusionar con Chat.tsx en un único componente NEXUSChat.tsx bien estructurado. Separar la lógica de presentación de la lógica de negocio. |
| Chat.tsx | Componente secundario y "simple" de la UI del chat. | Redundante. Genera duplicación de código y sobrecarga de mantenimiento. | **Descontinuar:** Absorber cualquier funcionalidad valiosa y única en el nuevo componente consolidado y eliminar este archivo. |
| useNEXUSChat.ts | Hook personalizado para la gestión de estado y la comunicación con la API. | **Fuente de la condición de carrera.** Manejo incorrecto de actualizaciones de estado asíncronas y efectos secundarios. | **Reescribir:** Re-arquitecturar para manejar correctamente el ciclo de vida de estado-efecto. Asegurar que las llamadas a la API se disparen *después* de que el estado se haya confirmado. |
| NEXUSFloatingButton.tsx | Componente de UI para iniciar la interacción con el widget de chat. | Probablemente aceptable, pero debe ser revisado por su acoplamiento. | **Revisar:** Asegurar que interactúa con el nuevo componente de chat consolidado a través de una API limpia y simple (ej. una función de alternancia basada en contexto). |
| useSlidingViewport.ts | Hook de UI para efectos visuales. | Potencial de degradación del rendimiento a través de re-renderizados innecesarios. | **Aislar y Optimizar:** Asegurar que este hook sea puramente para presentación y no interfiera con el estado central de la aplicación. Utilizar memoización donde sea posible. |
| route.ts | Endpoint de la API en Next.js que orquesta la lógica del backend. | Diseño síncrono frágil. Fuertemente acoplado al procesamiento de la IA. Punto único de fallo. | **Reemplazar:** Desmantelar la lógica síncrona. Reimplementar como un "Productor" asíncrono que coloca trabajos en una cola de mensajes. |
| fix\_update\_prospect\_data\_FINAL.sql | Función RPC de Supabase para la escritura en la base de datos. | La lógica es probablemente sólida, pero es parte de una cadena síncrona frágil. | **Retener y Reutilizar:** Mantener la lógica central de la base de datos, pero invocarla desde un "Consumidor" asíncrono, no directamente desde la ruta de la API. |

### **B. Análisis del Backend y la Capa de Persistencia de Datos**

El backend actual, compuesto por un endpoint de API en Next.js y una función RPC de Supabase, funciona como un conducto directo y síncrono. Esta simplicidad aparente esconde una fragilidad inherente que representa un cuello de botella para la escalabilidad y un riesgo significativo para la fiabilidad del sistema.

#### **Análisis del Endpoint de la API (route.ts)**

El archivo route.ts define un endpoint de API estándar de Next.js que actúa como el orquestador central del flujo de datos. Su diseño actual sigue un patrón síncrono: recibe una petición del frontend, espera una respuesta del servicio de IA de Claude y, posteriormente, espera la confirmación de la escritura en la base de datos de Supabase antes de devolver una respuesta al cliente.

Este enfoque presenta varios problemas críticos:

* **Alta Latencia y Mala Experiencia de Usuario:** El tiempo de respuesta de la API está directamente ligado a la latencia del modelo de IA, que puede ser variable e impredecible. El navegador del usuario permanece en un estado de espera durante todo este proceso, lo que se traduce en una interfaz de usuario que se siente lenta y poco responsiva.  
* **Punto Único de Fallo:** La arquitectura es una cadena de dependencias síncronas. Si la API de Claude experimenta una degradación del servicio o un fallo, o si la base de datos está bajo carga, toda la transacción falla. En este escenario, la conversación del usuario y los datos de intención capturados se pierden irrevocablemente.  
* **Escalabilidad Limitada:** En un entorno sin servidor como Vercel, cada petición entrante que espera una respuesta de larga duración consume recursos y mantiene una conexión activa. A medida que aumenta el número de usuarios concurrentes, este modelo puede agotar rápidamente los recursos disponibles, llevando a timeouts y a una degradación general del servicio.9

Esta arquitectura síncrona es fundamentalmente incompatible con la naturaleza impredecible de las APIs de terceros, especialmente las de IA. Representa un riesgo empresarial directo, ya que cada fallo se traduce en la pérdida de un prospecto potencial, socavando el objetivo principal del Ecosistema NodeX.

#### **Análisis de la Función RPC de Supabase (fix\_update\_prospect\_data\_FINAL.sql)**

El uso de una función de PostgreSQL (accesible vía RPC) para encapsular la lógica de escritura en la base de datos es una decisión de diseño acertada. Este patrón sigue las mejores prácticas al mantener la lógica de negocio cerca de los datos, lo que permite transacciones atómicas, mejora la seguridad al no exponer la estructura de las tablas directamente y simplifica el código del backend.9 La función fix\_update\_prospect\_data\_FINAL probablemente ejecuta una lógica de INSERT o UPDATE (upsert) para persistir o actualizar los datos del prospecto basándose en el JSON extraído por la IA.

El problema no radica en la función en sí, sino en su contexto de invocación. Actualmente, es el último eslabón de la frágil cadena síncrona. Además, el nombre del archivo, que incluye los sufijos \_fix y \_FINAL, sugiere un historial de revisiones y parches reactivos. Esto es a menudo un indicador de que el sistema ha estado evolucionando a través de soluciones puntuales en lugar de una refactorización arquitectónica planificada, reforzando la evidencia de una base técnica inestable.

La función RPC es un activo valioso dentro de un sistema mal diseñado. La estrategia correcta no es descartarla, sino cambiar *quién* la invoca y *cuándo*. Al mover su ejecución a un proceso asíncrono, se puede preservar esta buena práctica táctica mientras se elimina la fragilidad estratégica que la rodea.

### **C. Diagnóstico de la Causa Raíz: Deconstruyendo el "Mensaje Fantasma"**

La hipótesis del equipo sobre el "Mensaje Fantasma" es correcta y puede ser confirmada con un alto grado de certeza basándose en el comportamiento bien documentado de React. El fallo no es un error aleatorio, sino el resultado predecible de una condición de carrera entre la actualización del estado del frontend y la iniciación de una llamada a la API.

El mecanismo exacto del fallo se desarrolla en la siguiente secuencia de eventos, que ocurre en milisegundos:

1. **Entrada del Usuario:** El usuario finaliza de escribir su mensaje (ej. "soy ingeniero de sistemas") y presiona el botón de enviar.  
2. **Activación del Manejador de Eventos:** Se ejecuta una función onSubmit (o similar) en el componente de React.  
3. **Operaciones Concurrentes:** Dentro de esta función, se realizan dos operaciones de forma casi simultánea:  
   * Se invoca la función para actualizar el estado del historial de mensajes, por ejemplo, setMessages(prevMessages \=\> \[...prevMessages, newUserMessage\]).  
   * Se invoca una función para enviar la petición a la API, por ejemplo, sendApiRequest(messages).  
4. **El Estado Obsoleto (Stale State):** Este es el punto crítico. La llamada a setMessages no modifica la variable messages en el ámbito (scope) actual de la función onSubmit. En su lugar, programa una actualización de estado y un nuevo renderizado del componente. La variable messages a la que sendApiRequest tiene acceso en ese instante todavía contiene el valor *anterior* a la adición del nuevo mensaje.5  
5. **Envío de Datos Incorrectos:** La función sendApiRequest construye su payload utilizando este historial de mensajes obsoleto y lo envía al endpoint route.ts. Este historial obsoleto contiene una conversación anterior donde, como se hipotetiza, se mencionó la palabra "negocio".  
6. **Procesamiento en el Backend:** El endpoint route.ts recibe el historial incorrecto y lo pasa a la API de Claude.  
7. **Extracción de la IA:** Claude analiza el texto que se le ha proporcionado, identifica correctamente la palabra "negocio" y extrae el arquetipo emprendedor\_dueno\_negocio, tal como fue entrenado para hacerlo.  
8. **Persistencia de Datos Corruptos:** El resultado de la IA se envía a la función RPC de Supabase, que guarda los datos incorrectos (name: 'a', archetype: 'emprendedor\_dueno\_negocio') en la base de datos.  
9. **Desconexión Visual:** Mientras todo esto ocurre en el backend, el componente de React en el frontend completa su ciclo de re-renderizado. La interfaz de usuario ahora muestra correctamente el último mensaje del usuario ("soy ingeniero de sistemas"), creando una peligrosa discrepancia entre lo que el usuario ve y lo que el sistema ha procesado y guardado.

Este análisis confirma que el "Mensaje Fantasma" es una manifestación directa de una falta de sincronización entre el estado de la aplicación y los efectos secundarios asíncronos. Es la prueba definitiva de que la arquitectura actual carece de un mecanismo transaccional y predecible para manejar las interacciones del usuario, lo que la hace fundamentalmente no fiable.

## **El Plan Maestro para NEXUS 2.0: Una Arquitectura Asíncrona y Escalable ("Para Dónde Vamos")**

Habiendo diagnosticado las debilidades fundamentales del sistema actual, esta sección prescribe una nueva arquitectura diseñada desde cero para la resiliencia, la escalabilidad y la fiabilidad. Este plan maestro aborda cada capa del sistema —backend, frontend e IA— para construir una base sólida que no solo resuelva los problemas actuales, sino que también habilite el crecimiento futuro y las funcionalidades avanzadas previstas para NEXUS.

### **A. El Pipeline de Ingesta de Datos Asíncrono**

La piedra angular de la nueva arquitectura es la transición de un modelo síncrono a uno asíncrono, desacoplando la captura de datos de su procesamiento. Esto se logra mediante la introducción de una cola de mensajes, que actúa como un búfer duradero entre la interacción del usuario y las operaciones de backend complejas y de latencia variable.

#### **Concepto Central: Desacoplamiento con una Cola de Mensajes**

La solución arquitectónica consiste en romper la frágil cadena síncrona. En el nuevo modelo, la única responsabilidad del endpoint de la API será recibir la conversación, validarla mínimamente y depositarla como un "trabajo" en una cola de mensajes. Esta operación es extremadamente rápida y fiable, lo que permite que la API responda al frontend casi instantáneamente.

Para esta implementación, la solución ideal es **Supabase Queues**, una funcionalidad construida sobre la extensión de PostgreSQL pgmq.11 Utilizar Supabase Queues ofrece ventajas significativas:

* **Integración Nativa:** Evita la necesidad de introducir y gestionar servicios de terceros como RabbitMQ o Amazon SQS, manteniendo la pila tecnológica simple y cohesionada.  
* **Durabilidad y Fiabilidad:** Al estar basado en PostgreSQL, pgmq ofrece garantías transaccionales. Una vez que un mensaje es aceptado en la cola, se garantiza que no se perderá, incluso si los procesos consumidores fallan temporalmente.13  
* **Facilidad de Uso:** Las operaciones de la cola (enviar, recibir, eliminar mensajes) se exponen a través de funciones RPC, lo que permite interactuar con ellas de forma segura y sencilla desde el backend de Next.js o desde Edge Functions de Supabase.15

#### **Flujo de Datos Recomendado**

El viaje de la información, desde la entrada del usuario hasta su persistencia en la base de datos, seguirá estos pasos:

1. **UI (Frontend):** El usuario envía un mensaje en la interfaz de chat de NEXUS.  
2. **API Route (Productor):** El endpoint route.ts es rediseñado. Ahora recibe el historial de chat completo y actualizado del frontend. Su lógica se simplifica drásticamente:  
   * Realiza una validación básica de la carga útil (payload).  
   * Invoca la función RPC de Supabase para encolar el trabajo: supabase.schema('pgmq\_public').rpc('send', { queue\_name: 'nexus-ingestion', message: { chatHistory, prospectId } }).12  
   * Inmediatamente después de encolar el mensaje, devuelve un código de estado 202 Accepted al frontend. Esto confirma que la solicitud ha sido aceptada para su procesamiento, pero no que ya ha sido procesada.  
3. **Supabase Queue (pgmq):** El trabajo, que contiene el historial de la conversación y el identificador del prospecto, se almacena de forma segura y duradera en la cola nexus-ingestion.  
4. **Worker Asíncrono (Consumidor):** Un proceso de backend separado y desacoplado se encarga de procesar los trabajos de la cola. Este worker puede ser implementado como una **Supabase Edge Function** que se ejecuta periódicamente (invocada por un Cron Job de Supabase) o como otro tipo de servicio sin servidor. Su ciclo de vida es el siguiente:  
   * Sondea la cola en busca de nuevos trabajos utilizando supabase.schema('pgmq\_public').rpc('pop', { queue\_name: 'nexus-ingestion' }).12  
   * Si encuentra un trabajo, lo extrae de la cola. pop recupera el mensaje y lo elimina para evitar que otro worker lo procese.  
5. **Procesamiento de la IA y la Base de Datos:** El worker ejecuta la lógica que antes residía en la API síncrona:  
   * Invoca la API de Claude con el historial de chat del trabajo para realizar la extracción de entidades.  
   * Una vez obtenida la respuesta JSON estructurada de Claude, invoca la función RPC existente fix\_update\_prospect\_data\_FINAL.sql para escribir los datos extraídos en la base de datos.  
6. **Manejo de Errores y Reintentos:** Esta arquitectura es inherentemente resiliente. Si la llamada a la API de Claude falla o devuelve un error, el worker puede implementar una lógica de reintentos. Por ejemplo, puede volver a encolar el trabajo para que se procese más tarde. Si el fallo persiste después de varios intentos, el trabajo puede ser movido a una "cola de letras muertas" (dead-letter queue) para su inspección manual, asegurando que ningún dato se pierda definitivamente.15

Este diseño arquitectónico transforma fundamentalmente el modelo de fiabilidad del sistema. Pasa de un modelo "fail-stop", donde cualquier fallo detiene todo el proceso, a un modelo de "consistencia eventual y durabilidad". El sistema ahora abraza la realidad de que los servicios externos pueden ser lentos o fallar, utilizando la cola como un amortiguador que absorbe esta impredictibilidad. Se garantiza que cada interacción del usuario será procesada eventualmente, estableciendo el pilar para un sistema verdaderamente robusto.

### **B. Fortalecimiento del Frontend: Un Modelo de Estado e Interacción Robusto**

Con un backend asíncrono y fiable, el frontend debe ser refactorizado para garantizar que envía datos consistentes y gestiona su propio estado de manera predecible.

#### **Consolidación de Componentes de UI**

La primera acción debe ser resolver la redundancia. Se recomienda descontinuar Chat.tsx y consolidar toda la lógica de la interfaz de usuario en un único componente NEXUSChat.tsx. Para mantener la legibilidad y la mantenibilidad, este componente principal debe seguir el patrón de "Container and Presentational Components".1 NEXUSChat.tsx actuaría como el contenedor, gestionando la lógica y el estado, mientras que la UI se compondría de subcomponentes más pequeños y puros, como MessageList, MessageBubble y ChatInput, que simplemente reciben datos a través de props y renderizan la interfaz.2 Esta estructura mejora drásticamente la capacidad de prueba y reutilización del código.

#### **Solución Definitiva a la Condición de Carrera**

Para erradicar el "Mensaje Fantasma", es imperativo alinear el efecto secundario (la llamada a la API) con el estado del que depende. El patrón correcto en React para lograr esto es utilizar el hook useEffect. La llamada a la API no debe realizarse en el mismo manejador de eventos que actualiza el estado.

La lógica refactorizada en el hook useNEXUSChat.ts debería seguir esta estructura:

TypeScript

import { useState, useEffect } from 'react';

//...

const \[messages, setMessages\] \= useState\<Message\>();

// Este efecto se ejecutará CADA VEZ que el array 'messages' cambie.  
useEffect(() \=\> {  
  // Obtenemos el último mensaje para analizarlo.  
  const lastMessage \= messages\[messages.length \- 1\];

  // La condición clave: solo disparamos la API si el último mensaje  
  // fue enviado por el usuario. Esto evita bucles infinitos donde la  
  // respuesta de la IA desencadenaría otra llamada a la API.  
  if (lastMessage && lastMessage.author \=== 'user') {  
    // En este punto, la variable 'messages' tiene garantizado  
    // contener el estado más reciente, incluyendo el último mensaje del usuario.  
    sendApiRequest(messages);  
  }  
}, \[messages\]); // El array de dependencias es crucial.

const handleUserSubmit \= (text: string) \=\> {  
  const newUserMessage: Message \= { text, author: 'user', id: Date.now() };

  // Esta función AHORA solo se encarga de actualizar el estado.  
  // El hook useEffect se encargará de la lógica de la API como reacción a este cambio.  
  setMessages(prevMessages \=\> \[...prevMessages, newUserMessage\]);  
};

//...

Este patrón alinea la causa (cambio de estado) con el efecto (llamada a la API), eliminando por completo la condición de carrera.6 El array de dependencias \[messages\] en useEffect es la clave que le dice a React que vuelva a ejecutar la función del efecto solo cuando el estado de los mensajes haya cambiado efectivamente. Para aplicaciones con una lógica de obtención de datos más compleja, se podría considerar el uso de librerías como TanStack Query (anteriormente React Query) o SWR, que abstraen y gestionan de forma experta estos ciclos de vida de datos, incluyendo el manejo de caché, revalidación y estado de carga.18

### **C. Optimización de la Extracción de Datos Impulsada por IA con Claude**

La fiabilidad de NEXUS como motor de captura de datos depende tanto de la integridad de los datos que recibe como de su capacidad para interpretarlos correctamente. Un prompt mal diseñado puede generar resultados inconsistentes incluso si recibe los datos correctos. Por lo tanto, es esencial re-diseñar el prompt del sistema utilizando las mejores prácticas específicas para modelos como Claude, con el objetivo de obtener una salida JSON estructurada y predecible.

#### **Arquitectura de Prompt Recomendada**

El prompt debe ser tratado no como una simple pregunta, sino como un programa que guía y restringe el comportamiento del modelo. Se recomienda una reingeniería completa del prompt actual (contenido en CLAUDE.md) para incorporar las siguientes técnicas 19:

1. **Asignación de un Rol (Role Prompting):** El prompt debe comenzar definiendo explícitamente la identidad y el objetivo del modelo. Esto lo enfoca en la tarea específica.  
   * **Ejemplo:** System: Eres un asistente experto en extracción de datos llamado NEXUS. Tu único propósito es analizar transcripciones de conversaciones e identificar datos específicos de un prospecto, devolviéndolos en un formato JSON estricto..20  
2. **Uso de Etiquetas XML:** Los modelos de Anthropic están específicamente entrenados para prestar atención a la estructura definida por etiquetas XML. Estas etiquetas deben usarse para separar claramente las instrucciones, los ejemplos, el esquema y el texto de entrada. Esto reduce drásticamente la ambigüedad.20  
3. **Instrucciones Explícitas y Esquema Definido:** Se debe ser extremadamente claro sobre qué entidades extraer y cuál es el formato de salida exacto. Proporcionar un esquema JSON dentro de etiquetas \<schema\> es una práctica muy efectiva.  
   * **Ejemplo:** La salida JSON debe seguir estrictamente este esquema: \<schema\>{ "name": "string | null", "archetype": "string | null",... }\</schema\>.  
4. **Provisión de Ejemplos (Few-Shot Prompting):** Incluir uno o dos ejemplos completos de una conversación de entrada y la salida JSON perfecta correspondiente es una de las técnicas más poderosas para mejorar la precisión y el cumplimiento del formato.19  
5. **Pre-llenado de la Respuesta del Asistente (Prefilling):** Para forzar al modelo a generar únicamente el JSON, sin ningún texto introductorio o conversacional (como "Claro, aquí está el JSON:"), la llamada a la API debe estructurarse de modo que el último turno sea del rol assistant y contenga solo el carácter de apertura del JSON ({). Esto le indica al modelo que su única tarea es completar el objeto JSON.20

#### **Ejemplo de Estructura de Prompt Mejorada**

La siguiente plantilla integra todas las técnicas mencionadas y representa una mejora sustancial sobre un prompt simple:

XML

System: Eres un asistente experto en extracción de datos llamado NEXUS. Tu único propósito es analizar la transcripción de una conversación proporcionada dentro de las etiquetas \<conversation\> y extraer los datos clave de un prospecto. Debes devolver un único objeto JSON que se adhiera estrictamente al esquema proporcionado en las etiquetas \<schema\>. No incluyas ningún texto, explicación o markdown antes o después del objeto JSON.

\<schema\>  
{  
  "name": "string | null",  
  "archetype": "string | null",  
  "phone": "string | null",  
  "interest": "string | null",  
  "objections": "string | null"  
}  
\</schema\>

A continuación se muestra un ejemplo de cómo realizar la tarea:  
\<example\>  
  \<conversation\>  
    Human: Hola, me llamo Carlos Bello. Soy ingeniero de sistemas y me gustaría saber más sobre el Ecosistema NodeX. Me preocupa un poco el coste inicial.  
  \</conversation\>  
  \<json\_output\>  
    {  
      "name": "Carlos Bello",  
      "archetype": "ingeniero de sistemas",  
      "phone": null,  
      "interest": "saber más sobre el Ecosistema NodeX",  
      "objections": \["preocupación por el coste inicial"\]  
    }  
  \</json\_output\>  
\</example\>

Ahora, procesa la siguiente conversación real.

User: \<conversation\>  
{chat\_history\_variable}  
\</conversation\>

Assistant: {

Al realizar la llamada a la API, la variable {chat\_history\_variable} se reemplaza con la conversación real. La estructura de la llamada asegura que el último mensaje es del assistant con el contenido {. Este enfoque transforma el LLM de un generador de texto probabilístico a un componente de procesamiento de datos mucho más fiable y determinista.

## **Hoja de Ruta de Implementación: De Frágil a Funcional**

Esta sección final traduce la arquitectura propuesta en un plan de acción concreto y por fases. Siguiendo el marco DEL-AL, se define una ruta clara desde el estado actual ("Dónde Estamos") hacia un sistema robusto y escalable ("Para Dónde Vamos"), comenzando con un MVP enfocado en la fiabilidad absoluta.

### **A. Fase 1: Construcción del MVP de Captura de Datos Fiable**

El objetivo primordial y único de esta fase es lograr una captura y persistencia de datos 100% fiable. Todas las demás funcionalidades, incluyendo las mejoras de la interfaz de usuario y las capacidades avanzadas de IA, se subordinan a este objetivo. La meta es construir la nueva fundación del sistema.

* **Objetivo Clave:** Erradicar permanentemente el "Mensaje Fantasma" y garantizar que ninguna interacción del usuario se pierda.  
* **Pasos de Implementación:**  
  1. **Configuración del Backend (Infraestructura de Cola):**  
     * **Acción:** En el dashboard de Supabase, navegar a la sección de integraciones y habilitar la extensión pgmq.  
     * **Acción:** Crear una nueva cola de mensajes con el nombre nexus-prospect-ingestion.12 Esta será la espina dorsal del nuevo pipeline asíncrono.  
  2. **Reescritura del Endpoint de la API (Productor):**  
     * **Acción:** Modificar el código de route.ts. Eliminar toda la lógica de llamada a la API de Claude y a la RPC de la base de datos.  
     * **Acción:** Reimplementar su lógica para que: a) reciba el historial de chat del frontend, b) realice una validación básica, y c) utilice el cliente de Supabase para encolar un mensaje en la cola nexus-prospect-ingestion. Debe devolver una respuesta 202 Accepted inmediatamente.  
  3. **Creación del Worker Asíncrono (Consumidor):**  
     * **Acción:** Crear una nueva Supabase Edge Function. Esta función contendrá la lógica de procesamiento principal.  
     * **Acción:** Implementar la lógica para que la función sondee la cola nexus-prospect-ingestion. Al recibir un mensaje, debe ejecutar la llamada a la API de Claude (utilizando el nuevo prompt mejorado) y, posteriormente, invocar la función RPC fix\_update\_prospect\_data\_FINAL para persistir los datos.  
     * **Acción:** Configurar un Cron Job de Supabase para invocar esta Edge Function a intervalos regulares (por ejemplo, cada minuto).16  
  4. **Refactorización del Estado del Frontend:**  
     * **Acción:** Reescribir el hook useNEXUSChat.ts para implementar el patrón useEffect descrito en la sección III.B. Esto elimina la condición de carrera y asegura que el historial de chat enviado a la API del productor sea siempre el más reciente.  
  5. **Pruebas Integrales End-to-End:**  
     * **Acción:** Realizar pruebas rigurosas del nuevo flujo completo. El criterio de éxito es la integridad de los datos: verificar que cada mensaje enviado desde la UI resulta en un trabajo encolado correctamente y, finalmente, en una entrada correcta en la base de datos, sin pérdidas ni corrupciones.  
* **"Dónde Estamos" al Final de la Fase 1:** Se habrá logrado un sistema con un pipeline de backend asíncrono y robusto, y una gestión de estado en el frontend que es estable y predecible. El "Mensaje Fantasma" y otros errores relacionados con condiciones de carrera estarán permanentemente solucionados.  
* **"Para Dónde Vamos" desde la Fase 1:** Se dispondrá de una base sólida y fiable. El sistema estará preparado para que las funcionalidades adicionales se construyan o reintegren sobre una plataforma que garantiza la integridad de los datos, que es el activo más valioso del sistema.

### **B. Estrategia para Fases Futuras: Construyendo sobre una Base Sólida**

Una vez que el MVP de captura de datos fiable esté en producción y validado, el equipo puede proceder con la reintegración y el desarrollo de funcionalidades más avanzadas con la confianza de que la base es estable.

* **Fase 2: Consolidación y Mejora de la Interfaz de Usuario:**  
  * **Estrategia:** Con el pipeline de datos estabilizado, el riesgo de refactorizar la UI se reduce drásticamente. El equipo puede enfocarse en mejorar la experiencia del usuario y la calidad del código del frontend.  
  * **Pasos:**  
    1. Ejecutar la consolidación de NEXUSWidget.tsx y Chat.tsx en el nuevo componente NEXUSChat.tsx.  
    2. Descomponer NEXUSChat.tsx en subcomponentes de presentación más pequeños y manejables.  
    3. Reintegrar funcionalidades de UI avanzadas, como las gestionadas por useSlidingViewport.ts, asegurando que estén optimizadas para el rendimiento y desacopladas de la lógica de estado principal.  
* **Fase 3: Reintegración de Funcionalidades de IA Avanzadas:**  
  * **Estrategia:** La arquitectura asíncrona es ideal para orquestar flujos de trabajo de IA más complejos. Funcionalidades como el "Generador de Mensajes" y el "Asistente de Conversación (ACE)" pueden ser implementadas como pasos adicionales en el worker consumidor o, preferiblemente, como workers separados que responden a diferentes eventos en el sistema.  
  * **Ejemplo de Flujo Modular:**  
    1. El Worker de Ingesta (Fase 1\) extrae los datos del prospecto y los guarda.  
    2. Si la extracción es exitosa, este worker puede encolar un nuevo mensaje en una segunda cola, por ejemplo, nexus-ace-tasks.  
    3. Un segundo Worker (el Worker ACE), completamente independiente, consume de la cola nexus-ace-tasks y ejecuta la lógica de asistencia proactiva de ventas.  
    * Este enfoque mantiene los microservicios (o funciones) pequeños, enfocados en una sola responsabilidad y fáciles de mantener y escalar de forma independiente.  
* **Fase 4: Sistema de Aprendizaje Continuo:**  
  * **Estrategia:** La nueva arquitectura genera de forma natural los datos necesarios para la mejora continua.  
  * **Pasos:**  
    1. **Pruebas A/B de Prompts:** Se pueden implementar fácilmente pruebas A/B en el Worker de Ingesta. Por ejemplo, para el 50% de los trabajos, se puede usar el prompt A, y para el otro 50%, el prompt B. Los resultados (la calidad de los datos extraídos) se pueden medir y comparar para iterar hacia el prompt más efectivo.  
    2. **Entrenamiento de Modelos:** La base de datos de prospectos, con sus datos estructurados, y los archivos de conversaciones (que pueden ser archivados por pgmq) forman un conjunto de datos de alta calidad. Este dataset puede ser utilizado en el futuro para afinar (fine-tune) modelos de lenguaje personalizados, lo que podría reducir costos y mejorar aún más la precisión de la extracción de datos.

Esta hoja de ruta secuencial asegura que la estabilidad del sistema se priorice, creando una plataforma resiliente que puede evolucionar de manera segura para cumplir y superar la visión estratégica del Ecosistema NodeX.

#### **Fuentes citadas**

1. React architecture best practices for 2023 \- CodeWalnut, acceso: octubre 10, 2025, [https://www.codewalnut.com/learn/react-architecture-best-practices](https://www.codewalnut.com/learn/react-architecture-best-practices)  
2. Which would be better? One big stateless component vs Multiple little staless components, acceso: octubre 10, 2025, [https://stackoverflow.com/questions/49591923/which-would-be-better-one-big-stateless-component-vs-multiple-little-staless-co](https://stackoverflow.com/questions/49591923/which-would-be-better-one-big-stateless-component-vs-multiple-little-staless-co)  
3. State Management Gone Wrong: Avoiding Common Pitfalls in Modern UI Development, acceso: octubre 10, 2025, [https://logicloom.in/state-management-gone-wrong-avoiding-common-pitfalls-in-modern-ui-development/](https://logicloom.in/state-management-gone-wrong-avoiding-common-pitfalls-in-modern-ui-development/)  
4. React Architecture Patterns in ReactJS Apps \- Angular Minds, acceso: octubre 10, 2025, [https://www.angularminds.com/blog/react-architecture-patterns-in-reactjs-apps](https://www.angularminds.com/blog/react-architecture-patterns-in-reactjs-apps)  
5. 5 Most Common useState Mistakes React Developers Often Make \- Refine dev, acceso: octubre 10, 2025, [https://refine.dev/blog/common-usestate-mistakes-and-how-to-avoid/](https://refine.dev/blog/common-usestate-mistakes-and-how-to-avoid/)  
6. Race Conditions in React: What They Are and How to Avoid Them \- Fullstack.io, acceso: octubre 10, 2025, [https://www.newline.co/@RichardBray/race-conditions-in-react-what-they-are-and-how-to-avoid-them--675702e6](https://www.newline.co/@RichardBray/race-conditions-in-react-what-they-are-and-how-to-avoid-them--675702e6)  
7. Fixing Race Conditions in React with useEffect \- Max Rozen, acceso: octubre 10, 2025, [https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)  
8. Application State Management with React \- Kent C. Dodds, acceso: octubre 10, 2025, [https://kentcdodds.com/blog/application-state-management-with-react](https://kentcdodds.com/blog/application-state-management-with-react)  
9. The Best Way to use Supabase with Vercel / Next.js with lots of data? : r/nextjs \- Reddit, acceso: octubre 10, 2025, [https://www.reddit.com/r/nextjs/comments/1hwd49d/the\_best\_way\_to\_use\_supabase\_with\_vercel\_nextjs/](https://www.reddit.com/r/nextjs/comments/1hwd49d/the_best_way_to_use_supabase_with_vercel_nextjs/)  
10. Setting Up Supabase in Next.js: A Comprehensive Guide | by Yagyaraj \- Medium, acceso: octubre 10, 2025, [https://medium.com/@yagyaraj234/setting-up-supabase-in-next-js-a-comprehensive-guide-78fc6d0d738c](https://medium.com/@yagyaraj234/setting-up-supabase-in-next-js-a-comprehensive-guide-78fc6d0d738c)  
11. API | Supabase Docs, acceso: octubre 10, 2025, [https://supabase.com/docs/guides/queues/api](https://supabase.com/docs/guides/queues/api)  
12. Quickstart | Supabase Docs, acceso: octubre 10, 2025, [https://supabase.com/docs/guides/queues/quickstart](https://supabase.com/docs/guides/queues/quickstart)  
13. PSA: Message Queues with Supabase \- Reddit, acceso: octubre 10, 2025, [https://www.reddit.com/r/Supabase/comments/1fjo22p/psa\_message\_queues\_with\_supabase/](https://www.reddit.com/r/Supabase/comments/1fjo22p/psa_message_queues_with_supabase/)  
14. Supabase Queues | Durable Message Queues with Guaranteed Delivery, acceso: octubre 10, 2025, [https://supabase.com/modules/queues](https://supabase.com/modules/queues)  
15. Building Message Queues with Supabase and Python | by PI | Neural Engineer | Medium, acceso: octubre 10, 2025, [https://medium.com/neural-engineer/building-message-queues-with-supabase-and-python-319436f5b603](https://medium.com/neural-engineer/building-message-queues-with-supabase-and-python-319436f5b603)  
16. We added the missing piece\! \- YouTube, acceso: octubre 10, 2025, [https://www.youtube.com/watch?v=UEwfaElBnZk](https://www.youtube.com/watch?v=UEwfaElBnZk)  
17. Improper State Management in ReactJS | by Codenova \- Medium, acceso: octubre 10, 2025, [https://medium.com/@codenova/improper-state-management-in-reactjs-c965ab3236e3](https://medium.com/@codenova/improper-state-management-in-reactjs-c965ab3236e3)  
18. Prevent Race Condition in React.js with Top 5 Effective Ways \- Cyber Rely, acceso: octubre 10, 2025, [https://www.cybersrely.com/prevent-race-condition-in-react-js/](https://www.cybersrely.com/prevent-race-condition-in-react-js/)  
19. Prompt engineering overview \- Claude Docs, acceso: octubre 10, 2025, [https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview)  
20. 12 prompt engineering tips to boost Claude's output quality \- Vellum AI, acceso: octubre 10, 2025, [https://www.vellum.ai/blog/prompt-engineering-tips-for-claude](https://www.vellum.ai/blog/prompt-engineering-tips-for-claude)  
21. Prompt Patterns for Structured Data Extraction from Unstructured Text \- Computer Science, acceso: octubre 10, 2025, [https://www.cs.wm.edu/\~dcschmidt/PDF/Prompt\_Patterns\_for\_Structured\_Data\_Extraction\_from\_Unstructured\_Text\_\_\_Final.pdf](https://www.cs.wm.edu/~dcschmidt/PDF/Prompt_Patterns_for_Structured_Data_Extraction_from_Unstructured_Text___Final.pdf)  
22. Anthropic Claude3: Messages API with JSON Mode \- Explained Intuitively, acceso: octubre 10, 2025, [https://arunprakash.ai/posts/anthropic-claude3-messages-api-json-mode/messages\_api\_json.html](https://arunprakash.ai/posts/anthropic-claude3-messages-api-json-mode/messages_api_json.html)