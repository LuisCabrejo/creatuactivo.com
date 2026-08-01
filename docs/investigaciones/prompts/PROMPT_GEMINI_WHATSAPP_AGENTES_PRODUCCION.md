# PROMPT DE INVESTIGACIÓN — Agentes de IA sobre WhatsApp en producción (estado del arte, julio 2026)

> **Para:** agente investigador (Gemini Deep Research)
> **Solicitado por:** Luis Cabrejo — CreaTuActivo / Queswa
> **Objetivo:** que nuestra implementación de WhatsApp + IA opere **sin errores de contenido**, con arquitectura y prácticas equivalentes a las de las mejores startups del mundo.

---

## CONTEXTO REAL (léelo antes de investigar — la respuesta debe aplicar a ESTE caso)

**Qué somos.** CreaTuActivo es una empresa de tecnología latinoamericana. Nuestro producto de cara al usuario es **Queswa**, un agente de IA que conversa con prospectos por WhatsApp y les explica un modelo de negocio concreto, hasta que la persona decide hablar con un asesor humano.

**Arquitectura actual (simplificada):**
```
WhatsApp Cloud API (Meta) → webhook (Next.js, Node, Vercel)
   → motor de IA (Claude Sonnet, streaming) con:
        · system prompt por tenant (almacenado en Postgres/Supabase, caché 5 min)
        · RAG: búsqueda vectorial (Voyage AI embeddings, pgvector) sobre ~157
          fragmentos de "arsenales" (doctrina, objeciones, catálogo, plan)
        · instrucciones dinámicas por turno inyectadas por el backend
        · historial reconstruido desde la base de datos
   → respuesta completa (sin streaming al usuario) → Meta API → teléfono
```

**Stack:** Next.js 14, TypeScript, Vercel (Edge/Node), Supabase (Postgres + pgvector), Anthropic Claude (Sonnet + Haiku), Voyage AI (embeddings), WhatsApp Cloud API oficial.

**El problema que dispara esta investigación (crítico y no resuelto):**
El agente **alucina un modelo de negocio que no existe en nuestra empresa**. Ejemplo real y reproducible: el usuario dice su oficio ("jardinero", "plomero", "arquitecto") y el agente le propone con total seguridad *"productos digitales (cursos, guías), servicios escalados (consultoría online), comunidad (membresía)"* — es decir, el patrón genérico de *creator economy* que el modelo aprendió en su entrenamiento. **Nuestro negocio no es eso** (es distribución de productos físicos de consumo apoyada en tecnología).

Lo intentamos resolver **solo con prompting** y **falló**:
- Instrucciones negativas explícitas ("NUNCA propongas cursos, infoproductos, membresías…").
- Definición positiva del modelo real en el system prompt.
- Reglas de comportamiento por turno inyectadas desde el backend.
- Verificamos que el prompt correcto **sí se está cargando** (no es caché ni error de configuración).
El modelo **ignora la prohibición** cuando la consulta del usuario es vaga ("sí", "ok", "cuénteme") y el RAG no recupera contexto relevante: llena el vacío con su conocimiento previo.

**Otros síntomas observados:**
1. **Contaminación por historial:** al reinyectar la conversación previa, el modelo repite errores que cometió antes (aprendizaje few-shot accidental de sus propias respuestas equivocadas).
2. **Instrucciones del backend que contradicen al system prompt** (dos capas empujando en direcciones opuestas; ganó la más cercana al final del contexto).
3. **Datos mal capturados** que se reinyectan como hechos (p. ej., un arquetipo guardado en el campo del nombre → el agente saluda a la persona con una etiqueta interna).
4. **Latencia:** primera respuesta ~10 s, siguientes ~5 s. WhatsApp no permite streaming, así que el usuario espera la respuesta completa.

---

## LO QUE NECESITAMOS QUE INVESTIGUES

### 1. Estado del arte: quién lo está haciendo bien (2025–2026)
- Empresas y startups que operan **agentes de IA sobre WhatsApp a escala** en mercados hispanohablantes y emergentes (fintech, comercio, salud, educación, servicios). Incluye casos de Latinoamérica, India, Indonesia, África, Medio Oriente.
- Para cada caso relevante: **qué arquitectura usan, qué resolvieron, qué falló públicamente y qué aprendieron**. Prioriza fuentes con detalle técnico (blogs de ingeniería, charlas, papers, postmortems), no notas de prensa.
- Proveedores/plataformas dominantes hoy (BSPs y frameworks de agentes): fortalezas y límites reales de cada uno.

### 2. El problema central: **cómo se impide que un agente invente**
Esta es la pregunta más importante de la investigación. Queremos el **estado del arte en control de alucinaciones** para agentes conversacionales de dominio cerrado:
- **Arquitecturas de contención:** ¿el estándar hoy es prompting, *grounding* estricto por RAG, *guardrails* programáticos, máquinas de estado, *function calling*, respuestas pre-escritas dictadas por backend, o combinaciones?
- **¿Cuándo conviene NO dejar que el modelo redacte?** Patrones de "respuesta dictada" / *templated responses* / *golden answers*: cuándo se usan, cómo se combinan con lenguaje natural sin que suene robótico, y qué porcentaje de turnos cubren en implementaciones reales.
- **Guardrails de salida:** validadores que revisan la respuesta ANTES de enviarla (clasificadores, reglas, LLM-as-judge, verificación contra la base de conocimiento). Latencia y costo que añaden. Herramientas concretas (open source y comerciales) y su madurez a julio 2026.
- **RAG que falla en silencio:** qué hacen los equipos serios cuando la búsqueda vectorial **no recupera nada relevante** (consultas vagas tipo "sí", "ok"). ¿Umbrales de confianza, respuestas de fallback, reformulación de consulta, *query rewriting* con el historial, negativa explícita a responder?
- **Contaminación del historial:** prácticas para que el modelo no aprenda de sus propios errores previos al reinyectar la conversación (resumen en vez de transcripción, sanitización, ventanas cortas, memoria estructurada en vez de literal).
- **Jerarquía de instrucciones:** cómo se ordenan system prompt, instrucciones dinámicas y contexto recuperado para que no se contradigan; qué dice la evidencia sobre posición, repetición y formato de las reglas críticas.

### 3. Arquitectura de agente: qué patrón conviene
- **Máquinas de estado conversacionales vs. agentes libres:** dónde está el consenso hoy para flujos comerciales (captación → explicación → decisión → traspaso a humano). Ventajas y costos reales de cada uno.
- **Orquestación multi-modelo:** usar modelos pequeños/rápidos para clasificar intención y modelos grandes solo cuando aportan. Impacto medido en latencia, costo y errores.
- **Function calling / tool use** para que el agente consulte datos verificados en vez de recordarlos.
- **Traspaso a humano (*human handoff*):** cuándo y cómo lo disparan los mejores; qué información se le entrega al humano.

### 4. Rendimiento y experiencia en WhatsApp específicamente
- Cómo mitigan que **WhatsApp no soporte streaming**: indicadores de escritura, respuestas parciales, división en varios mensajes, expectativas de latencia aceptable en el canal.
- Manejo de **arranque en frío** en arquitecturas serverless.
- Buenas prácticas de formato en WhatsApp: longitud, uso de listas, emojis, cuántos mensajes seguidos, ritmo conversacional.
- Ventanas de 24 horas, plantillas (*templates*), categorías y costos: cómo estructuran la operación alrededor de esas reglas de Meta.

### 5. Confiabilidad, evaluación y operación
- **Cómo se prueba un agente conversacional antes de exponerlo a usuarios:** *evals* automatizadas, conjuntos de conversaciones de regresión, simulación de usuarios adversarios, detección de deriva.
- **Métricas que realmente usan** en producción (no vanidad): tasa de alucinación, contención, satisfacción, conversión, escalamiento a humano.
- **Observabilidad:** qué registran de cada conversación y cómo detectan un fallo de contenido **antes** de que lo reporte un usuario.
- Prácticas de despliegue: *canary*, *feature flags*, capacidad de revertir un prompt en minutos, versionado de prompts.

### 6. Cumplimiento y confianza (mercado hispanohablante)
- Buenas prácticas de transparencia (declarar que es IA), consentimiento y datos personales bajo normativas latinoamericanas (Colombia Ley 1581, México, y GDPR como referencia).
- Cómo evitan que el agente haga **promesas comerciales indebidas** (cifras de ingreso, garantías) — controles técnicos, no solo instrucciones.

---

## ENTREGABLES ESPERADOS

1. **Diagnóstico:** dado nuestro caso concreto (arriba), cuál es la causa arquitectónica de fondo de que el agente invente, y por qué el prompting falla.
2. **Recomendación de arquitectura objetivo**, con justificación y referencias a quién la usa. Que sea implementable en nuestro stack (Next.js/Vercel/Supabase/Claude), no teórica.
3. **Plan por fases**: qué haríamos primero para detener el sangrado esta semana, y qué después para quedar sólidos. Con esfuerzo estimado y riesgo de cada fase.
4. **Tabla comparativa de tecnologías/herramientas** de guardrails y orquestación relevantes a julio 2026: madurez, licencia, latencia añadida, costo, encaje con nuestro stack.
5. **Checklist de buenas prácticas** para agentes de IA sobre WhatsApp (contenido, latencia, formato, cumplimiento, operación).
6. **Lo que NO deberíamos hacer**: antipatrones documentados y fracasos reales de otros equipos.

---

## CRITERIOS

- **Prioriza evidencia sobre opinión.** Cita fuentes con fecha; distingue lo comprobado de lo que está de moda.
- **Sé concreto y accionable.** Preferimos "haz X porque Y lo usa para Z" antes que principios generales.
- **Actualidad:** el campo cambia rápido; marca claramente lo que es válido a **julio de 2026** y lo que quedó obsoleto.
- **Si algo de nuestro planteamiento está equivocado, dilo.** Buscamos la verdad técnica, no confirmación.
- **Ten en cuenta el contexto latinoamericano**: WhatsApp es el canal principal de confianza, el público no es técnico, y la claridad importa más que la sofisticación.
