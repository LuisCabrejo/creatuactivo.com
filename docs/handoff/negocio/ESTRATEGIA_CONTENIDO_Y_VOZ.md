# Estrategia de contenido, voz de Queswa e historia del fundador

> Extraído de `CLAUDE.md` el 4 ago 2026. CLAUDE.md conserva solo la **regla de oro del léxico**, las **prohibiciones de alta frecuencia** y las **constantes canónicas**; todo lo demás (estrategia de tráfico, voz de 3 niveles, estado de la migración léxica, historia del fundador) vive aquí.
>
> Fuentes hermanas: [BRANDING.md §7](../../../BRANDING.md#7-léxico-queswa--vocabulario-canónico-aprobado--prohibido) (tablas completas aprobado/prohibido, ~60 términos) · [EPIPHANY_BRIDGE_OFICIAL.md](../../../EPIPHANY_BRIDGE_OFICIAL.md) (historia maestra) · [HANDOFF_CONTEXTO_COMPLETO.md](../../../HANDOFF_CONTEXTO_COMPLETO.md) (contexto de negocio).

## 1. Two-Pronged Content Strategy (Enero 2026)

La estrategia separa **TRÁFICO** (contenido) de **CONVERSIÓN** (embudos):

```
[NAVAL RAVIKANT - TRÁFICO]        [RUSSELL BRUNSON - CONVERSIÓN]
30 videos de valor puro      →    Reel por nicho + Queswa
         ↓                               ↓
"¿Cómo lo hago?"             →    Soap Opera Emails (5)
         ↓                               ↓
CTA sutil a CreaTuActivo     →    1-a-1 con el socio
                                         ↓
                                   Webinar (Perfect Webinar)
                                         ↓
                                   Oferta Fundador/Constructor
```

**Estilo de contenido**: Naval Ravikant — filosófico, valor primero, sin venta directa. Referencia: *The Almanack of Naval Ravikant*.

### Research Prompts (para agentes de IA)

| Prompt | Propósito | Entregables |
|--------|-----------|-------------|
| [PROMPT_INVESTIGACION_NAVAL_CONTENIDO.md](../../investigaciones/prompts/PROMPT_INVESTIGACION_NAVAL_CONTENIDO.md) | Estrategia de contenido (TRÁFICO) | 30 guiones de video, hooks, guía de tono |

Sirven con cualquier agente de investigación (Gemini, Manus, Claude…).

### Términos adicionales para posicionamiento de tráfico orgánico

Solo para TRAFFIC, **no** para el funnel de venta:
- ✅ Arquitectura de Activos · Soberanía financiera · Cartera de activos · Distribución global
- ✅ El plan por defecto (el villano universal cross-arsenal)

## 2. Queswa Voice — Híbrido Contextual de 3 Niveles (v5.4, 24 May 2026)

Doctrina conversacional para resolver la disonancia "¿acaso él no es Queswa?" cuando el agente habla con el usuario. **Regla unificada**:

- **Nivel 1 — Aforismos canónicos** → **tercera persona** ("Queswa explica", "Queswa escala"). Son frases-marca; cambiarlas rompe su fuerza retórica. Ejemplos: *"Usted no explica — Queswa explica"*, *"Usted no enseña; Queswa escala. Usted crece"*.
- **Nivel 2 — Sustantivos/componentes con nombre propio** → **tercera persona** ("Centro de Mando Queswa", "queswa.app", "Academia Queswa", "plataforma Queswa", "Pilar 2 (Queswa)" en referencias arquitectónicas). Son nombres propios del ecosistema.
- **Nivel 3 — Acciones del agente AHORA en la conversación** → **primera persona** ("yo proceso", "yo asumo", "yo opero", "Me encargo"). El agente conversacional ES el avatar del ecosistema completo; al describir lo que hace ahora, habla como ente coherente.

**Por qué importa**: cuando Queswa dice "Queswa filtra los perfiles" en chat directo, el usuario procesa dos identidades en paralelo (el "yo" implícito que escribe + el "Queswa" del que se habla) → fricción cognitiva. La regla híbrida elimina esa fricción donde más se siente sin perder los aforismos como marca verbal.

**Casos límite**: construcciones tipo "el Pilar 2 (Queswa) asume X" se PRESERVAN en tercera persona porque "Queswa" funciona como apostillo nombrando al Pilar dentro de la doctrina de los Tres Pilares. Cambiarlas a primera persona rompe la arquitectura canónica.

## 3. Migración léxico accesible — mapa y estado

> ⚠️ **MIGRACIÓN EN CURSO (Jun 2026) — leer antes de "corregir" textos.** El léxico premium/canónico se está reemplazando por léxico accesible (servilleta / Mario Alonso Puig).

**Mapa de reemplazo:**

| Término viejo | Término accesible |
|---|---|
| Estructura Patrimonial | estructura de ingresos recurrentes |
| La Matriz Física | El Respaldo Operativo |
| El Tridente EAM | El Método Comprobado (subtítulo: "Comando Expandir · Activar · **Multiplicación**") |
| Base Operativa | **negocio digital** (a secas) |
| Arquitecto de Patrimonio | Propietario (de su negocio digital) |
| Dirección Ejecutiva / gobernanza | dirige / dirección |
| Apalancamiento Asimétrico | Apalancamiento Estratégico |
| escalar | multiplicar |
| Maestría (3er Comando) | Multiplicación |

⚠️ **El swap "negocio digital"** (jun 2026, `docs/handoff/queswa/HANDOFF_AGENTE_LEXICO_ARSENALES.md`) supersede el mapping previo: "Base Operativa" también se retira de cara al prospecto. **Atribución**: "su negocio digital" SIN "de Gano Excel" — la corona es de CreaTuActivo; Gano Excel se nombra solo como Respaldo Operativo (Pilar 1, el estudio detrás de cámaras).

**Concepto nuclear** de "¿qué es CreaTuActivo?" (modelo Waze, empatía primero): *"empresa de tecnología que ayuda a corregir una vulnerabilidad crítica en la vida financiera… ingresos recurrentes que no dependen de su trabajo físico"*.

**Estado (jun 2026):** ✅ migrado y **desplegado** en todas las superficies de cara al prospecto: **home completa** (`src/app/page.tsx` — Hero, Diagnóstico, Perfiles, Tres Caminos, Producto, Prueba de Estrés, Queswa, CTA + `CognitiveLoadComparator` + `VisionSection` "futuro absurdo / la norma"), **manifiesto** (`src/components/ManifiestoDocument.tsx` — `/manifiesto` + `/{slug}/manifiesto`; §2 reescrita con la visión, "soberanía financiera" conservada como excepción temática del documento), **deck `/servilleta`** (v6.2) + guion maestro v5.0 + teleprompter, **chips** (`queswa-greeting.ts`), **Camino A** (`respuestas-maestras.ts`), **WHY_01/WHY_02/EAM_01** (`arsenal_inicial.txt`, local) y los **reels de la serie de documentación** (Día 1–6) + reel explainer de la Home. **NO revertir hacia los términos viejos.**

⏳ **Pendiente**: FREQ_04/FREQ_04_PUENTE/PERFIL_01 + migración profunda (~200 hits en arsenales restantes + system prompt) + deploy de `arsenal_inicial` a Supabase.

## 4. Doctrina vigente del copy (el CÓMO, no solo el qué)

1. **Villano NARRADO, nunca etiquetado** — método NuBank: detalles vividos que el lector reconoce (*"los créditos siempre le llevan la delantera"*, *"la bicicleta estática: le da y le da y no avanza"*, *"trabajar, pagar cuentas y repetir"*, *"un sistema diseñado para construir el patrimonio de otros"*), nunca una etiqueta abstracta (prohibido "PPO", "Plan por Defecto", "tiempo por dinero" en seco). "Trampa" sí, como recategorización, sin victimizar.
2. **Autopersuasión** — marcos moderados (*"meses"*, no "días"; sin cifras extremas tipo "en ceros"); escenarios que el lector completa, no afirmaciones.
3. **Test Beto** — si un profesional inteligente sin MBA no entiende la frase, está prohibida; densidad técnica ≠ autoridad, el lujo es la claridad.
4. **Concepto nuclear (modelo Waze)** — ver §3.

Detalle: `docs/handoff/queswa/HANDOFF_RECALIBRACION_LEXICO_QUESWA.md` (Queswa/sitio) · `docs/handoff/reels/HANDOFF_AGENTE_MARKETING_REELS.md` (reels/redes, con la serie de documentación diaria).

## 5. Historia real de Luis Cabrejo (Epiphany Bridge)

**Documento maestro**: [EPIPHANY_BRIDGE_OFICIAL.md](../../../EPIPHANY_BRIDGE_OFICIAL.md) — úselo para todo storytelling.

**Frase clave**: *"La soberanía financiera no se trata de lujos. Se trata de poder cumplir tu palabra."*

| Duración | Uso |
|----------|-----|
| 60 segundos | Reels, TikTok, Squeeze Page |
| 3 minutos | 1-a-1 / presentación media |
| 7 minutos | Webinar, presentaciones |

### Dos audiencias distintas

| Audiencia | Villano | Página |
|-----------|---------|--------|
| **8.000 contactos personales** (amigos, familia, ex-Gano) | Plan por defecto | reel → Queswa → `/fundadores` |
| **Networkers tradicionales** (ya conocen MLM) | "Haz una lista de 100" | `/socios` fue eliminada (commit `6110e9a`) — audiencia sin landing dedicada actualmente |
