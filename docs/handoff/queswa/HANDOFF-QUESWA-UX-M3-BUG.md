# HANDOFF: Bug M3 — Queswa interroga al prospecto después del nombre

**Fecha:** 03 Abril 2026
**Propósito:** Entregar contexto completo al siguiente agente para que resuelva el bug de UX en el flujo conversacional de Queswa (creatuactivo.com).

---

## CONTEXTO DEL SISTEMA

Queswa es la IA conversacional de CreaTuActivo. Opera como consultor de Patrimonio Paralelo — filtra prospectos, explica la oportunidad y los guía hacia la activación sin intervención humana.

**Stack relevante:**
- `src/app/api/nexus/route.ts` — API principal, Edge runtime, streaming
- `knowledge_base/system-prompt-nexus-v19.6_lifestyle_bienestar_v3.2.md` — System prompt activo en Supabase (nombre: `nexus_main`)
- `scripts/actualizar-system-prompt-v20.mjs` — Script para actualizar el prompt en Supabase
- `knowledge_base/arsenal_inicial.txt` — Base de conocimiento con respuestas canónicas

**Para ver el prompt activo en Supabase:**
```bash
node scripts/leer-system-prompt.mjs
```

**Para actualizar el prompt en Supabase después de editar el archivo local:**
```bash
node scripts/actualizar-system-prompt-v20.mjs
```

---

## EL FLUJO DISEÑADO (lo que debería pasar)

```
M1: Queswa saluda → pregunta situación actual
M2: Prospecto dice "empleo / negocio propio / independiente / otro"
    → Queswa valida su situación + pide el nombre
M3: Prospecto da su nombre
    → Queswa confirma el nombre + valida en 1 frase + propone avanzar a la mecánica
M4: Prospecto acepta o hace una pregunta diferente
    → Queswa entrega WHY_02 del arsenal o responde la duda + retoma el liderazgo
```

---

## EL BUG: LO QUE PASA EN REALIDAD

**Mensaje 3 — DEL (estado actual):**

El prospecto da su nombre. Queswa ignora las instrucciones y cae en preguntas de calificación operativa. Ejemplos reales capturados:

> "Ahora bien, antes de avanzar necesito entender tu punto de partida. ¿Cuánto tiempo libre tienes a la semana para construir esto, y tienes algún capital inicial para invertir o partimos desde cero?"

> "¿Tienes hoy algún activo generando ingresos (negocio, propiedad, inversión), o partimos desde cero en esa área?"

> "¿En qué sector está tu negocio actual y cuánto tiempo llevas operándolo? Eso me dice si ya tienes flujo de caja para invertir en el activo paralelo, o si necesitamos construirlo desde cero con recursos mínimos."

> "¿Cuál es tu principal limitación hoy: tiempo, capital inicial, o no sabes por dónde empezar?"

**El patrón siempre es el mismo:** después de recibir el nombre, el modelo interpreta que su tarea es calificar al prospecto antes de dar valor.

---

## FRAMEWORK DEL → AL

### DIMENSIÓN 1: Tono post-nombre

| DEL — Experiencia actual (2 estrellas) | AL — Experiencia objetivo (11 estrellas) |
|----------------------------------------|------------------------------------------|
| "Antes de avanzar necesito entender tu punto de partida" — interrogatorio de call center | El consultor confirma el nombre, valida en una frase y propone el siguiente paso. El prospecto nunca siente que lo están calificando. |
| Dos o tres preguntas en el mismo mensaje | Una sola propuesta: "¿empezamos por entender cómo funciona?" |
| El prospecto siente que debe demostrar que merece atención | El prospecto siente que ya está adentro de la conversación correcta |

### DIMENSIÓN 2: Control de la conversación

| DEL | AL |
|-----|----|
| El modelo cede el control al prospecto preguntando qué quiere hacer | Queswa toma el liderazgo y propone el siguiente paso lógico |
| La conversación depende de que el prospecto sepa qué preguntar | La conversación avanza aunque el prospecto no sepa qué preguntar |

### DIMENSIÓN 3: Señal de valor

| DEL | AL |
|-----|----|
| El primer mensaje después del nombre es una pregunta — el prospecto no recibe nada | El primer mensaje después del nombre entrega valor inmediato (la mecánica del sistema) |
| El prospecto debe responder antes de recibir información | El prospecto recibe información primero, puede preguntar después |

---

## LO QUE SE INTENTÓ SIN ÉXITO

1. **Instrucción de formato** ("Formato obligatorio M3: 1. Confirma el nombre, 2. Valida, 3. Propone") — ignorada
2. **Bloqueo absoluto** con lista de prohibiciones explícitas — ignorado
3. **Ejemplos literales por perfil** ("copia este texto exacto") — ignorados
4. **Regla global** sobre patrón de cierre de mensaje — ignorada

**Estado actual del system prompt:** Contiene un `BLOQUEO ABSOLUTO — PREGUNTAS EN MENSAJE 3` con texto literal para copiar. El modelo lo ignora consistentemente.

---

## FILOSOFÍA DEL PRODUCTO (contexto crítico para no romper nada)

- **El villano es el Plan por Defecto** ("trabajar, pagar cuentas, repetir") — nunca la actividad del prospecto
- **El prospecto es el héroe** — Queswa es el guía, no el interrogador
- **Lujo Clínico**: el tono es consultor senior de alto valor, no vendedor de call center
- **Sub-perfiles internos** (no visibles al prospecto): Perfil-A (ejecutivo), Perfil-B (negocio propio), Perfil-C (independiente) — las etiquetas antiguas ("Esposas de Oro", "Trampa Operativa", "Creador de Ingreso Lineal") están **eliminadas y prohibidas**
- **Activación**: el único canal de cierre es `wa.me/573215193909` + `mailto:sistema@creatuactivo.com` — nunca `/reto-5-dias`, `/mapa-de-salida` ni URLs inventadas

---

## ARCHIVOS QUE NO DEBES TOCAR

- `src/app/api/nexus/route.ts` — No modificar el fallback hardcodeado. Actualizar siempre en Supabase.
- Cualquier archivo `*.tsx.bak` — son respaldos inactivos
- `.env.local` — no commitear

---

## PREGUNTA CENTRAL PARA EL SIGUIENTE AGENTE

¿Cómo hacer que el modelo ejecute una salida específica y controlada en M3, independientemente de su comportamiento por defecto como "consultor de ventas calificador"?

El answer está en el code o en el prompt — o en ambos. Eso es lo que hay que resolver.
