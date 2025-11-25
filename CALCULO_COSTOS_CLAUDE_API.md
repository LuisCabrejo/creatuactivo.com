# CÁLCULO DETALLADO: Costos API Claude Anthropic
## Uso Real de NEXUS en CreaTuActivo.com

**Fecha:** 24 de Noviembre, 2025
**Modelo:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

---

## PRICING OFICIAL ANTHROPIC (2025)

Según [Anthropic Pricing](https://docs.claude.com/en/docs/about-claude/pricing):

| Tipo de Token | Costo por 1M tokens | Costo por 1K tokens |
|---------------|---------------------|---------------------|
| **Input** | $3.00 USD | $0.003 USD |
| **Output** | $15.00 USD | $0.015 USD |

**Tipo de cambio:** 1 USD = 4,500 COP (conservador)

| Tipo de Token | Costo por 1M tokens (COP) | Costo por 1K tokens (COP) |
|---------------|---------------------------|---------------------------|
| **Input** | $13,500 COP | $13.50 COP |
| **Output** | $67,500 COP | $67.50 COP |

---

## ANÁLISIS DE USO DE NEXUS

### Anatomía de una Conversación Típica

**System Prompt (Input):**
- System prompt actual (v18.0): ~8,000 tokens
- Arsenales incluidos (híbrido): ~15,000 tokens adicionales
- **Total system prompt:** ~23,000 tokens

**Conversación Usuario (Input):**
- Mensaje usuario promedio: 50-100 tokens
- Historial conversación (últimos 5 mensajes): ~1,000 tokens
- **Total input usuario por mensaje:** ~1,100 tokens

**Respuesta NEXUS (Output):**
- Respuesta promedio: 300-500 tokens
- **Total output por mensaje:** ~400 tokens

### Costo por Mensaje

**Input total por mensaje:**
- System prompt: 23,000 tokens
- Usuario: 1,100 tokens
- **TOTAL INPUT:** 24,100 tokens

**Output total por mensaje:**
- Respuesta: 400 tokens
- **TOTAL OUTPUT:** 400 tokens

**Costo por mensaje (COP):**
- Input: 24,100 tokens × $0.0000135 COP = $325 COP
- Output: 400 tokens × $0.0000675 COP = $27 COP
- **TOTAL POR MENSAJE:** $352 COP

**Costo por mensaje (USD):** ~$0.078 USD

---

## PROYECCIÓN DE USO POR TRIMESTRE

### Supuestos

**Usuarios activos (prospectos visitando CreaTuActivo.com):**

| Trimestre | Visitantes/mes | Visitantes totales | Conversación rate | Usuarios NEXUS | Mensajes promedio | Mensajes totales |
|-----------|----------------|-------------------|-------------------|----------------|-------------------|------------------|
| **Q1** | 500 | 1,500 | 40% | 600 | 8 | 4,800 |
| **Q2** | 2,000 | 6,000 | 35% | 2,100 | 10 | 21,000 |
| **Q3** | 5,000 | 15,000 | 30% | 4,500 | 12 | 54,000 |
| **Q4** | 8,000 | 24,000 | 30% | 7,200 | 12 | 86,400 |

**Total mensajes año 1:** 166,200 mensajes

### Costo por Trimestre (Sin Optimizaciones)

| Trimestre | Mensajes | Costo/mensaje | Total COP | Total USD |
|-----------|----------|---------------|-----------|-----------|
| Q1 | 4,800 | $352 | $1,689,600 | $375 |
| Q2 | 21,000 | $352 | $7,392,000 | $1,642 |
| Q3 | 54,000 | $352 | $19,008,000 | $4,224 |
| Q4 | 86,400 | $352 | $30,412,800 | $6,758 |
| **TOTAL AÑO 1** | **166,200** | **$352** | **$58,502,400** | **$13,000** |

---

## 🚨 PROBLEMA: $58.5M COP vs $5.4M Estimado

**Déficit:** $53.1M COP adicionales solo en API de Claude

---

## OPTIMIZACIONES CRÍTICAS (NECESARIAS)

### Optimización 1: Prompt Caching (Ahorro ~90%)

Anthropic ofrece **Prompt Caching**: cachea el system prompt por 5 minutos.

**Cómo funciona:**
- Primera vez usuario usa NEXUS: paga 23,000 tokens input (system prompt)
- Si envía otro mensaje <5min: system prompt cacheado = GRATIS
- Solo paga input usuario (1,100 tokens)

**Supuesto realista:**
- 60% de usuarios envían múltiples mensajes <5min
- Promedio: 8 mensajes/conversación → 7 mensajes con cache

**Nuevo cálculo:**

**Mensaje 1 (sin cache):**
- Input: 24,100 tokens × $0.0000135 = $325 COP
- Output: 400 tokens × $0.0000675 = $27 COP
- **Total:** $352 COP

**Mensajes 2-8 (con cache):**
- Input: 1,100 tokens × $0.0000135 = $15 COP
- Output: 400 tokens × $0.0000675 = $27 COP
- **Total:** $42 COP

**Costo promedio conversación (8 mensajes):**
- Mensaje 1: $352
- Mensajes 2-8 (7 × $42): $294
- **Total conversación:** $646 COP
- **Por mensaje:** $646 / 8 = $80.75 COP

**Ahorro:** 77% (de $352 → $80.75 por mensaje)

### Optimización 2: Clasificación Híbrida Mejorada

**Problema actual:**
- Cada mensaje envía 4 arsenales completos (inicial + manejo + cierre + catálogo)
- Total: ~15,000 tokens

**Solución:**
- Clasificar query primero (decisión local, sin API)
- Enviar SOLO el arsenal relevante
- System prompt base: 8,000 tokens
- Arsenal específico: ~4,000 tokens
- **Nuevo total:** 12,000 tokens (vs 23,000)

**Ahorro:** 48% en input tokens

### Optimización 3: Respuestas Más Concisas

**Instrucción en system prompt:**
> "Responde en máximo 200 tokens. Sé conciso y directo."

**Output esperado:**
- Actual: 400 tokens
- Optimizado: 200 tokens

**Ahorro:** 50% en output tokens

### Optimización 4: Batch API (Ahorro 50%)

Para operaciones NO en tiempo real (ej: análisis de prospectos, reportes):
- Batch API: 50% descuento
- **Usar para:** Resúmenes diarios, clasificación de arquetipos, data mining

---

## COSTOS OPTIMIZADOS (Con Todas las Optimizaciones)

### Nuevo Cálculo por Mensaje

**System prompt optimizado:**
- Base: 8,000 tokens
- Arsenal específico: 4,000 tokens
- **Total:** 12,000 tokens (vs 23,000)

**Mensaje 1 (sin cache):**
- Input: 12,000 + 1,100 = 13,100 tokens × $0.0000135 = $177 COP
- Output: 200 tokens × $0.0000675 = $13.5 COP
- **Total:** $190.5 COP

**Mensajes 2-8 (con cache):**
- Input: 1,100 tokens × $0.0000135 = $15 COP
- Output: 200 tokens × $0.0000675 = $13.5 COP
- **Total:** $28.5 COP

**Costo promedio conversación (8 mensajes):**
- Mensaje 1: $190.5
- Mensajes 2-8 (7 × $28.5): $199.5
- **Total conversación:** $390 COP
- **Por mensaje:** $390 / 8 = $48.75 COP

### Proyección Anual Optimizada

| Trimestre | Mensajes | Costo/mensaje optimizado | Total COP | Total USD |
|-----------|----------|--------------------------|-----------|-----------|
| Q1 | 4,800 | $48.75 | $234,000 | $52 |
| Q2 | 21,000 | $48.75 | $1,023,750 | $228 |
| Q3 | 54,000 | $48.75 | $2,632,500 | $585 |
| Q4 | 86,400 | $48.75 | $4,212,000 | $936 |
| **TOTAL AÑO 1 OPTIMIZADO** | **166,200** | **$48.75** | **$8,102,250** | **$1,800** |

**Ahorro vs sin optimizar:** $50,400,150 COP (86% menos)

---

## COMPARACIÓN: Estimado Original vs Real Optimizado

| Concepto | Estimado Original | Real Sin Optimizar | Real Optimizado |
|----------|-------------------|-------------------|-----------------|
| **Mensual promedio** | $450,000 | $4,875,200 | $675,187 |
| **Anual** | $5,400,000 | $58,502,400 | $8,102,250 |
| **Diferencia vs estimado** | - | +$53.1M (980% más) | +$2.7M (50% más) |

---

## RECOMENDACIÓN TÉCNICA URGENTE

### Implementar YA (Pre-Lanzamiento):

**1. Prompt Caching (Prioridad 1)**
```typescript
// src/app/api/nexus/route.ts
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5-20250929",
  system: [{
    type: "text",
    text: systemPrompt,
    cache_control: { type: "ephemeral" } // ← AGREGAR ESTO
  }],
  // ...
});
```

**Impacto:** Ahorro ~77% en costos (de $58M → $13M anual)

**2. Clasificación Híbrida Mejorada (Prioridad 2)**
```typescript
// Clasificar localmente antes de llamar API
const arsenal = clasificarQueryLocal(userMessage);
// Enviar solo arsenal relevante, no todos
```

**Impacto:** Ahorro adicional ~48% input tokens

**3. Instrucción Respuestas Concisas (Prioridad 3)**
```markdown
System Prompt update:
"CRITICAL: Responde en máximo 200 tokens. Sé directo y conciso."
```

**Impacto:** Ahorro ~50% output tokens

**4. Batch API para Reportes (Prioridad 4)**
- Análisis diarios de prospectos: usar Batch (50% descuento)
- Resúmenes semanales: usar Batch

---

## COSTOS FINALES CORREGIDOS

### Escenario Realista (Con Optimizaciones Implementadas)

| Concepto | Mensual | Anual |
|----------|---------|-------|
| Claude API (optimizado) | $675,187 | $8,102,250 |
| Supabase Pro | $112,500 | $1,350,000 |
| Vercel Pro | $90,000 | $1,080,000 |
| Resend | $90,000 | $1,080,000 |
| SEO tools | $400,000 | $4,800,000 |
| **TOTAL TECH** | **$1,367,687** | **$16,412,250** |

**Diferencia vs estimado original ($13.7M):** +$2.7M anual

---

## IMPACTO EN PRESUPUESTO TOTAL

### Ajuste Necesario

**Tech original estimado:** $13,710,000/año
**Tech real optimizado:** $16,412,250/año
**Diferencia:** +$2,702,250/año

**Nuevo presupuesto anual:**
- Original: $432M
- Ajuste tech: +$2.7M
- **Nuevo total:** ~$435M (sin optimizaciones de equipo)

**Con optimizaciones de equipo (del análisis anterior):**
- **Opción $285M:** Sigue válida (pero tech sube de $1.1M → $1.37M/mes)
- **Nuevo cálculo:** $287.7M para 12 meses

---

## BUFFER DE SEGURIDAD API

**Recomendación:** Agregar 20% buffer para Claude API

**Escenarios de uso:**

| Escenario | Mensajes/año | Costo optimizado | Costo +20% buffer |
|-----------|--------------|------------------|-------------------|
| Conservador | 166,200 | $8.1M | $9.7M |
| Moderado (2x tráfico) | 332,400 | $16.2M | $19.4M |
| Agresivo (3x tráfico) | 498,600 | $24.3M | $29.2M |

**Buffer recomendado año 1:** $10M (vs $8.1M base)

---

## CONCLUSIÓN

### Respuesta a tu observación:

**Tienes razón.** El costo de Claude API no estaba bien calculado.

**Costos reales:**
- Sin optimizar: $58.5M/año (INACEPTABLE)
- Con optimizaciones: $8.1M/año (MANEJABLE)
- Con buffer 20%: $10M/año (RECOMENDADO)

**Diferencia vs estimado:** +$4.6M anual (de $5.4M → $10M)

### Impacto en presupuesto total:

**Opción $285M (recomendada):**
- Ajuste tech: +$2.7M
- **Nuevo monto:** $287.7M (~$64K USD)

**Opción $205M:**
- Ya era insuficiente, ahora más crítico
- Alcanza ~8 meses (vs 9 estimado)

### Acción inmediata requerida:

**ANTES de lanzar con tráfico alto:**
1. Implementar prompt caching (1 día desarrollo)
2. Optimizar clasificación híbrida (2 días desarrollo)
3. Ajustar system prompt (respuestas concisas) (1 día)

**Sin estas optimizaciones, el costo de API puede MATAR el proyecto.**

---

**Archivo:** `CALCULO_COSTOS_CLAUDE_API.md`
**Fuentes:** [Anthropic Pricing](https://docs.claude.com/en/docs/about-claude/pricing), [Helicone Calculator](https://www.helicone.ai/llm-cost/provider/anthropic/model/claude-sonnet-4-5-20250929)
