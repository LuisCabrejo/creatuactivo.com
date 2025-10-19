# NEXUS - Estrategia de Optimización de Caché y Tokens

**Fecha:** 2025-10-19
**Proyecto:** CreaTuActivo-Marketing
**Objetivo:** Reducir costos de tokens en 90% usando Anthropic Prompt Caching

---

## 📊 ANÁLISIS ACTUAL

### Uso de Tokens por Request:
```
System Prompt: ~15,038 caracteres = ~3,760 tokens input
Arsenal Inicial (promedio): ~8,000 caracteres = ~2,000 tokens input
Conversación Usuario: ~200 tokens input
Respuesta NEXUS: ~400 tokens output

TOTAL POR REQUEST: ~6,360 tokens (~$0.038 USD por request)
```

### Problema Crítico:
**El system prompt y el arsenal se envían COMPLETOS en cada request**, sin usar el caché de Anthropic.

---

## 🎯 SOLUCIÓN: Anthropic Prompt Caching

### Qué es Prompt Caching:
Anthropic permite cachear hasta **4 bloques** de contenido que se reutilizan entre requests:
- **Caché duration**: 5 minutos
- **Ahorro**: 90% en tokens de entrada cacheados
- **Costo caché**: 10% del costo normal

### Bloques Ideales para Cachear en NEXUS:

1. **System Prompt** (~15K chars) → ✅ SIEMPRE igual
2. **Arsenal Inicial** (~8K chars) → ✅ Preguntas más frecuentes
3. **Context del Prospecto** (~1K chars) → ⚠️ Variable por sesión
4. **Conversación Reciente** → ❌ Cambia en cada request

---

## 🚀 IMPLEMENTACIÓN RECOMENDADA

### Estrategia de Caché (2 bloques):

```typescript
const messages = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: systemPrompt,
        cache_control: { type: 'ephemeral' } // ✅ BLOQUE 1: System Prompt
      },
      {
        type: 'text',
        text: arsenalInicial,
        cache_control: { type: 'ephemeral' } // ✅ BLOQUE 2: Arsenal Inicial
      },
      {
        type: 'text',
        text: `CONTEXTO PROSPECTO:\n${prospectContext}\n\nPREGUNTA: ${userMessage}`
        // ❌ NO cachear: cambia por sesión
      }
    ]
  }
];
```

### Ahorro Estimado:

**ANTES (sin caché):**
```
Request 1: 6,360 tokens × $0.006/1K = $0.038
Request 2: 6,360 tokens × $0.006/1K = $0.038
Request 3: 6,360 tokens × $0.006/1K = $0.038
Total 3 requests: $0.114
```

**DESPUÉS (con caché):**
```
Request 1 (cache write): 6,360 tokens × $0.006/1K = $0.038
Request 2 (cache hit): 600 tokens × $0.006/1K + 5,760 cache tokens × $0.0006/1K = $0.007
Request 3 (cache hit): 600 tokens × $0.006/1K + 5,760 cache tokens × $0.0006/1K = $0.007
Total 3 requests: $0.052 (54% ahorro)
```

**En una sesión típica de 5 requests: 72% ahorro**
**En una sesión larga de 10+ requests: 85%+ ahorro**

---

## 📁 ARCHIVOS A MODIFICAR

### 1. `/src/app/api/nexus/route.ts`

**Línea ~600-700**: Modificar la construcción del array de mensajes para incluir `cache_control`

```typescript
// ANTES (actual)
const messages = [
  {
    role: 'user',
    content: `${systemPrompt}\n\n${arsenalContext}\n\nPREGUNTA: ${message}`
  }
];

// DESPUÉS (con caché)
const messages = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: systemPrompt,
        cache_control: { type: 'ephemeral' }
      },
      {
        type: 'text',
        text: arsenalContext,
        cache_control: { type: 'ephemeral' }
      },
      {
        type: 'text',
        text: `CONTEXTO PROSPECTO:\n${prospectContextStr}\n\nPREGUNTA: ${message}`
      }
    ]
  }
];
```

### 2. Validar SDK de Anthropic

**Versión mínima requerida:** `@anthropic-ai/sdk@0.20.0`

```bash
npm list @anthropic-ai/sdk
# Si < 0.20.0:
npm install @anthropic-ai/sdk@latest
```

---

## 🧪 PLAN DE TESTING

### Fase 1: Implementación Base
1. Modificar `route.ts` con estructura de caché
2. Deploy a staging/dev
3. Probar con 5-10 requests en una sesión
4. Verificar logs de Claude Dashboard (cache hits/writes)

### Fase 2: Métricas
Monitorear en el dashboard de Anthropic:
- **Cache Hit Rate**: Debe ser >80% después del 1er request
- **Token Usage**: Debe reducirse ~70% en promedio
- **Cost per Session**: Bajar de $0.20 a ~$0.06

### Fase 3: Optimización Avanzada
- Considerar pre-warming del caché (primera request dummy)
- Evaluar si cachear también `catalogo_productos` (menos frecuente)
- Analizar si el arsenal de manejo/cierre justifica caché

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### 1. Ordenamiento de Bloques Cacheados
Los bloques con `cache_control` deben estar AL FINAL del content array:
```typescript
// ✅ CORRECTO
[texto_normal, texto_cache_1, texto_cache_2]

// ❌ INCORRECTO
[texto_cache_1, texto_normal, texto_cache_2]
```

### 2. Tamaño Mínimo de Caché
Anthropic requiere mínimo **1024 tokens** para cachear un bloque.
- System Prompt: ~3,760 tokens ✅
- Arsenal Inicial: ~2,000 tokens ✅

### 3. Duración del Caché
**5 minutos** - Perfecto para sesiones conversacionales típicas de NEXUS (duran 3-8 minutos promedio)

### 4. Invalidación del Caché
El caché se invalida si:
- Cambia el contenido del bloque cacheado
- Pasan 5 minutos sin uso
- Cambias el modelo de Claude

---

## 💡 MEJORAS ADICIONALES

### Optimización 1: Comprimir System Prompt
El system prompt actual tiene **mucha repetición**. Podrías reducirlo de 15K a ~10K caracteres sin perder funcionalidad:

**Ejemplo de redundancia detectada:**
```
Línea 60-90: Instrucciones de productos (se repiten en línea 145-173)
Línea 176-302: Captura de datos (podría condensarse 30%)
```

### Optimización 2: Arsenal Dinámico Inteligente
En lugar de cachear TODO el arsenal inicial, cachear solo las **5-7 preguntas más frecuentes** y cargar el resto bajo demanda:

```typescript
const ARSENAL_TOP_QUERIES = [
  'FREQ_01', // ¿Qué es CreaTuActivo?
  'FREQ_02', // ¿Cómo funciona? (flujo 3 niveles)
  'FREQ_03', // ¿Cuál es la inversión?
  'FREQ_04', // ¿Cuándo veo retorno?
  'FREQ_11'  // ¿Cómo se gana?
];
```

Ahorro adicional: ~50% en el bloque de arsenal

### Optimización 3: Pre-warming Estratégico
Al inicio de cada sesión NEXUS, hacer un request "dummy" para calentar el caché:

```typescript
// En NEXUSFloatingButton.tsx al montar el componente
useEffect(() => {
  if (isOpen) {
    // Request de warming (no mostrar al usuario)
    fetch('/api/nexus/warm-cache', { method: 'POST' });
  }
}, [isOpen]);
```

---

## 📈 MÉTRICAS ESPERADAS

### Antes de Optimización:
- **Costo por sesión (5 requests)**: $0.19 USD
- **Costo mensual (1000 sesiones)**: $190 USD
- **Tokens por sesión**: ~32,000 tokens

### Después de Optimización:
- **Costo por sesión (5 requests)**: $0.053 USD **(72% ahorro)**
- **Costo mensual (1000 sesiones)**: $53 USD **(72% ahorro)**
- **Tokens por sesión**: ~9,000 tokens **(72% reducción)**

### ROI de Implementación:
- **Tiempo de dev**: 2-3 horas
- **Ahorro mensual**: $137 USD
- **Break-even**: Inmediato

---

## 🚦 SIGUIENTE PASO RECOMENDADO

**PRIORIDAD ALTA**: Implementar caché básico (2 bloques) en próxima sesión de desarrollo.

**Script de implementación rápida**: Ver sección de código en línea 600-700 de `route.ts`

**Testing**: Ejecutar 10 requests en una sesión y verificar en Anthropic Dashboard que cache hit rate >80%

---

**Creado por:** Claude Code
**Fecha:** 2025-10-19
**Estado:** Ready for implementation
