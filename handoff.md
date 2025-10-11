# **Documento de Handoff para Claude Code: Reconstrucción del Agente NEXUS**

**Para:** Agente de Desarrollo de IA, Claude Code
**De:** Ingeniero de Contexto
**Fecha:** 10 de Octubre de 2025
**Asunto:** Hoja de Ruta para la Reconstrucción Arquitectónica del Agente NEXUS (Fase 1)

## **1. Resumen Ejecutivo (Framework DEL-AL)**

**Objetivo:** Este documento detalla la estrategia y el plan de acción para la reconstrucción completa del agente de IA "NEXUS". El trabajo actual no consiste en aplicar parches, sino en una re-arquitectura fundamental para eliminar fallos sistémicos y construir una base resiliente.

* **Dónde Estamos (DEL):** La implementación actual de NEXUS es inestable y no fiable. Su arquitectura síncrona y una gestión de estado deficiente en el frontend han generado un fallo crítico conocido como el **"Mensaje Fantasma"**, que corrompe los datos de los prospectos al momento de su captura. El sistema actual es una cadena de dependencias frágil que no puede cumplir con los objetivos estratégicos del Ecosistema NodeX.

* **Para Dónde Vamos (AL):** Hacia una arquitectura robusta, asíncrona y escalable que garantiza una **captura de datos 100% fiable**. Esta nueva base nos permitirá, en fases futuras, desarrollar las funcionalidades avanzadas de NEXUS (asistencia proactiva de ventas, aprendizaje continuo) con total confianza en la integridad de los datos subyacentes.

* **La Estrategia:** Ejecutar la **Fase 1** de la hoja de ruta, enfocada exclusivamente en construir un **Producto Mínimo Viable (MVP) de Captura de Datos Fiable**.

## **2. Diagnóstico Técnico Detallado ("Dónde Estamos")**

El análisis de la implementación actual ha revelado las siguientes causas raíz:

1.  **Condición de Carrera en el Frontend:** El hook `useNEXUSChat.ts` inicia la llamada a la API **antes** de que el estado de React se actualice con el último mensaje del usuario. Esto provoca que se envíe un historial de chat obsoleto (`stale state`) al backend, causando el "Mensaje Fantasma".

2.  **Pipeline de Ingesta Síncrono y Frágil:** El endpoint de la API (`route.ts`) espera de forma síncrona la respuesta del LLM y de la base de datos. Cualquier latencia o fallo en esta cadena resulta en la pérdida de la interacción del usuario.

3.  **Redundancia de Componentes:** La existencia de `NEXUSWidget.tsx` y `Chat.tsx` crea una deuda técnica innecesaria, aumentando la complejidad y el mantenimiento.

4.  **Ingeniería de Prompts Ineficiente:** El prompt actual enviado a Claude no está optimizado para una extracción de datos estructurada, lo que contribuye a resultados inconsistentes.

## **3. Hoja de Ruta de Implementación: Fase 1 - MVP de Captura Fiable**

Tu misión es ejecutar los siguientes pasos de implementación para construir la nueva fundación de NEXUS.

### **Paso 1: Re-arquitectura del Backend (Pipeline Asíncrono)**

El objetivo es desacoplar la ingesta de la conversación de su procesamiento.

* **Acción 1.1 (Infraestructura de Cola):** Habilita la extensión `pgmq` en la base de datos de Supabase y crea una nueva cola de mensajes llamada `nexus-prospect-ingestion`.
* **Acción 1.2 (Reescritura del "Productor"):** Modifica el endpoint `route.ts`. Su nueva y única responsabilidad será recibir el historial de chat, validarlo y encolarlo en `nexus-prospect-ingestion` usando el RPC `pgmq_public.send`. Debe devolver una respuesta `202 Accepted` de forma inmediata.
* **Acción 1.3 (Creación del "Consumidor"):** Crea una nueva **Supabase Edge Function**. Esta función se ejecutará de forma asíncrona (invocada por un Cron Job de Supabase). Su lógica será:
    1.  Leer un mensaje de la cola `nexus-prospect-ingestion` usando `pgmq_public.pop`.
    2.  Invocar la API de Claude con el historial de chat del mensaje (utilizando el prompt optimizado del Paso 3).
    3.  Invocar la función SQL existente `fix_update_prospect_data_FINAL.sql` para persistir los datos extraídos.

### **Paso 2: Refactorización del Frontend (Gestión de Estado Robusta)**

El objetivo es erradicar la condición de carrera y asegurar que se envíen datos consistentes al backend.

* **Acción 2.1 (Eliminar Condición de Carrera):** Refactoriza el hook `useNEXUSChat.ts`. La llamada a la API del "Productor" (`route.ts`) debe ser movida dentro de un hook `useEffect` que dependa del estado de los mensajes (`[messages]`). Esto garantiza que la API se invoque solo *después* de que el último mensaje del usuario haya sido añadido al estado.
* **Acción 2.2 (Consolidar UI):** Descontinúa `Chat.tsx`. Fusiona toda la funcionalidad de la interfaz de usuario en un único componente `NEXUSWidget.tsx` (que podrá ser renombrado a `NEXUSChat.tsx` para mayor claridad).

### **Paso 3: Optimización de la Extracción de Datos (Ingeniería de Prompt)**

El objetivo es transformar el LLM en un procesador de datos fiable.

* **Acción 3.1 (Reingeniería del Prompt):** Re-diseña el prompt que el "Consumidor" envía a Claude. Debe incorporar las siguientes técnicas para forzar una salida JSON estructurada y predecible:
    * **Asignación de Rol:** "Eres un asistente experto en extracción de datos...".
    * **Etiquetas XML:** Usa `<conversation>`, `<schema>`, y `<example>` para delimitar claramente el contexto.
    * **Ejemplos (Few-Shot Prompting):** Proporciona un ejemplo claro de una conversación y su salida JSON perfecta.
    * **Pre-llenado de Respuesta:** Estructura la llamada a la API de manera que el último turno sea del `assistant` y contenga solo el carácter `{`, forzando al modelo a completar el objeto JSON.

## **4. Criterios de Éxito para la Fase 1**

El trabajo de esta fase se considerará exitoso cuando se cumplan los siguientes criterios:

1.  **Integridad de Datos:** Cualquier conversación iniciada en la UI resulta en una entrada de datos correcta y completa en la tabla `nexus_prospects` de Supabase, sin pérdida ni corrupción de información.
2.  **Resiliencia:** El sistema es capaz de manejar fallos temporales en la API de Claude sin perder las interacciones de los usuarios. Los trabajos fallidos permanecen en la cola para ser reintentados.
3.  **Trazabilidad:** Se puede seguir el viaje de una conversación desde su encolamiento hasta su procesamiento final en los logs del sistema.

Una vez que esta fundación esté construida y validada, procederemos a las siguientes fases para reintegrar la experiencia de usuario avanzada y las funcionalidades de IA proactivas.
