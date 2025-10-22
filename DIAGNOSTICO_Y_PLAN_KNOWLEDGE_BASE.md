# 🔍 DIAGNÓSTICO Y PLAN DE MEJORA - NEXUS KNOWLEDGE BASE

**Fecha:** 2025-10-21
**Problema reportado:** NEXUS no responde pregunta sobre "¿Cuántos productos traen los paquetes?"
**Estado:** ✅ INFORMACIÓN DISPONIBLE pero ❌ CLASIFICACIÓN DEFICIENTE

---

## 📊 HALLAZGOS DEL DIAGNÓSTICO

### 1. ESTADO ACTUAL DE SUPABASE

**Total documentos:** 6

| ID | Categoría | Título | Tamaño | Status |
|----|-----------|--------|--------|--------|
| fe6a174c... | arsenal_cierre | Arsenal Cierre | 26,449 chars | ✅ Con SIST_11 |
| 2c3e3a8b... | arsenal_inicial | Arsenal Inicial v8.5 | 18,021 chars | ✅ OK |
| d1222011... | arsenal_manejo | Arsenal Manejo | 26,445 chars | ✅ OK |
| e03f5c50... | catalogo_productos | Catálogo Productos Gano Excel 2025 | 4,905 chars | ✅ OK |
| 5faf1ca2... | escalacion_liliana | Información Escalación - Liliana | 4,908 chars | ✅ OK |
| 6c0857ea... | framework_iaa | Framework IAA | 5,260 chars | ✅ OK |

**✅ BUENAS NOTICIAS:**
- La información sobre paquetes (SIST_11) **SÍ está** en Supabase
- Documento `arsenal_cierre` contiene:
  - "Paquete Constructor Inicial (ESP 1): 7 productos"
  - "Paquete Constructor Empresarial (ESP 2): 18 productos"
  - "Paquete Constructor Visionario (ESP 3): 35 productos"
  - Detalle completo de cada producto por paquete

### 2. PROBLEMA IDENTIFICADO

**❌ CLASIFICACIÓN HÍBRIDA NO DETECTA LA PREGUNTA**

La pregunta "¿Cuántos productos traen los paquetes?" NO activa correctamente el arsenal_cierre.

**Análisis de flujo actual:**

```typescript
// route.ts líneas 440-453
const patrones_paquetes = [
  /cuánto.*cuesta/i,
  /precio.*paquete/i,
  /inversión.*inicial/i,
  /cuál.*paquete/i,
  /paquetes.*disponibles/i,
  /opciones.*paquete/i
];

if (patrones_paquetes.some(patron => patron.test(messageLower))) {
  console.log('💼 Clasificación: PAQUETES (arsenal_inicial)');
  return 'arsenal_inicial'; // ❌ PROBLEMA: Enruta a arsenal_inicial
}
```

**❌ ERRORES DETECTADOS:**

1. **Routing incorrecto:** Preguntas sobre paquetes van a `arsenal_inicial` en vez de `arsenal_cierre`
2. **Patrones incompletos:** No detecta:
   - "¿Cuántos productos traen?"
   - "¿Qué productos incluye cada paquete?"
   - "¿Qué contiene el paquete ESP 1/2/3?"
   - "¿Inventario de paquetes?"
3. **Búsqueda semántica débil:** Si la clasificación falla, el fallback no encuentra SIST_11

### 3. ANÁLISIS TÉCNICO

**Flujo actual cuando usuario pregunta "¿Cuántos productos trae ESP 1?":**

```
1. Usuario: "¿Cuántos productos trae ESP 1?"
   ↓
2. clasificarDocumentoHibrido() detecta patron /cuánto.*cuesta/i
   ❌ FALSE (pregunta productos, no cuesta)
   ↓
3. No match con patrones_paquetes
   ↓
4. No match con patrones_inicial, patrones_manejo, patrones_cierre
   ↓
5. Fallback a búsqueda semántica
   ↓
6. search_nexus_documents('productos ESP 1', match_count: 3)
   ↓
7. Si embeddings débiles → NO encuentra SIST_11
   ↓
8. RESULTADO: NEXUS responde con info genérica o "no tengo esa info"
```

---

## 🎯 PLAN DE MEJORA (3 FASES)

### FASE 1: FIX INMEDIATO (15 minutos)

**Objetivo:** Resolver la pregunta sobre paquetes HOY

**Acción 1.1:** Agregar patrones específicos

```typescript
// Agregar a route.ts línea ~440
const patrones_paquetes_productos = [
  // Preguntas sobre CANTIDAD de productos
  /cuántos.*productos.*paquete/i,
  /cuántos.*productos.*ESP/i,
  /cuántos.*productos.*trae/i,
  /cuántos.*productos.*incluye/i,
  /cantidad.*productos.*paquete/i,

  // Preguntas sobre QUÉ productos
  /qué.*productos.*paquete/i,
  /qué.*productos.*ESP/i,
  /qué.*productos.*trae/i,
  /qué.*productos.*incluye/i,
  /qué.*contiene.*paquete/i,
  /qué.*viene.*paquete/i,

  // Preguntas sobre INVENTARIO
  /inventario.*paquete/i,
  /listado.*productos.*paquete/i,
  /desglose.*paquete/i,
  /composición.*paquete/i,
  /detalle.*paquete/i,

  // Patrones específicos por paquete
  /ESP.*1.*productos/i,
  /ESP.*2.*productos/i,
  /ESP.*3.*productos/i,
  /Inicial.*productos/i,
  /Empresarial.*productos/i,
  /Visionario.*productos/i
];
```

**Acción 1.2:** Cambiar routing

```typescript
// Cambiar línea 451 de:
return 'arsenal_inicial';

// A:
return 'arsenal_cierre'; // ✅ CORRECTO: SIST_11 está en arsenal_cierre
```

**Resultado esperado:** 90% de preguntas sobre paquetes se resuelven

---

### FASE 2: MEJORA ESTRATÉGICA (2-3 horas)

**Objetivo:** Garantizar coverage completo y prevenir futuros gaps

#### 2.1 Sistema de Auditoría Automática

**Script:** `scripts/auditoria-coverage-kb.js`

```javascript
// Verifica qué preguntas críticas puede/no puede responder NEXUS

const PREGUNTAS_CRITICAS = [
  // Paquetes
  { pregunta: "¿Cuántos productos trae ESP 1?", esperado: "arsenal_cierre" },
  { pregunta: "¿Qué contiene el paquete Inicial?", esperado: "arsenal_cierre" },

  // Productos
  { pregunta: "¿Cuánto cuesta CorDyGold?", esperado: "catalogo_productos" },

  // Sistema
  { pregunta: "¿Cómo funciona el negocio?", esperado: "arsenal_inicial" },

  // Objeciones
  { pregunta: "¿Esto es una pirámide?", esperado: "arsenal_manejo" },

  // Escalación
  { pregunta: "Quiero hablar con alguien", esperado: "arsenal_cierre" }
];

async function auditarCoverage() {
  const resultados = [];

  for (const test of PREGUNTAS_CRITICAS) {
    const clasificacion = clasificarDocumentoHibrido(test.pregunta);
    const pass = clasificacion === test.esperado;

    resultados.push({
      pregunta: test.pregunta,
      esperado: test.esperado,
      obtenido: clasificacion,
      status: pass ? '✅ PASS' : '❌ FAIL'
    });
  }

  const passRate = (resultados.filter(r => r.status === '✅ PASS').length / resultados.length) * 100;

  console.log(`\n📊 COVERAGE RATE: ${passRate.toFixed(1)}%\n`);

  if (passRate < 95) {
    console.log('⚠️ COVERAGE INSUFICIENTE - Requiere mejoras');
  } else {
    console.log('✅ COVERAGE ACEPTABLE');
  }

  return resultados;
}
```

**Resultado esperado:** Coverage mínimo 95% en preguntas críticas

#### 2.2 Script de Sincronización Local ↔ Supabase

**Script:** `scripts/sync-knowledge-base.js`

**Propósito:** Detectar diferencias entre archivos `.txt` y Supabase

```javascript
// 1. Lee todos los .txt en /knowledge_base/
// 2. Compara con documentos en Supabase
// 3. Detecta:
//    - Contenido nuevo en .txt no subido a Supabase
//    - Contenido en Supabase obsoleto vs .txt
// 4. Genera reporte de diferencias
// 5. Opción de sync automático
```

**Resultado esperado:** 100% sincronización local ↔ Supabase

#### 2.3 Mejora en Embeddings Semánticos

**Problema:** Búsqueda semántica no encuentra respuestas relacionadas

**Solución:** Re-generar embeddings con contexto

```sql
-- Actualizar función search_nexus_documents para incluir metadata en búsqueda

CREATE OR REPLACE FUNCTION search_nexus_documents_v2(
  search_query TEXT,
  match_count INT DEFAULT 5,
  similarity_threshold FLOAT DEFAULT 0.3
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    nd.id,
    nd.title,
    nd.content,
    nd.category,
    nd.metadata,
    1 - (nd.embedding <=> ai.embed('text-embedding-ada-002', search_query)::vector) AS similarity
  FROM nexus_documents nd
  WHERE 1 - (nd.embedding <=> ai.embed('text-embedding-ada-002', search_query)::vector) > similarity_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
```

**Resultado esperado:** 95%+ accuracy en búsquedas semánticas

---

### FASE 3: SISTEMA INTELIGENTE (1-2 semanas)

**Objetivo:** NEXUS auto-mejora con feedback del usuario

#### 3.1 Logging de Preguntas Sin Respuesta

**Tabla:** `nexus_unanswered_queries`

```sql
CREATE TABLE nexus_unanswered_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query TEXT NOT NULL,
  fingerprint TEXT,
  context JSONB, -- Historial de conversación
  clasificacion_obtenida TEXT,
  documentos_consultados JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

**Trigger:** Cuando NEXUS dice "No tengo esa información específica", se loggea

**Resultado:** Dashboard de gaps para priorizar mejoras

#### 3.2 A/B Testing de Respuestas

**Propósito:** Validar qué respuestas generan mejor engagement

```typescript
// Trackear métricas por respuesta
- Tiempo de lectura
- Siguiente pregunta del usuario (indicador de claridad)
- Tasa de escalación (usuario pide hablar con alguien)
- Tasa de conversión (usuario activa paquete)

// Iterar respuestas basadas en data
```

#### 3.3 CI/CD para Knowledge Base

**Flujo automático:**

```
1. Developer actualiza .txt en /knowledge_base/
   ↓
2. Git commit + push
   ↓
3. GitHub Action detecta cambio en /knowledge_base/
   ↓
4. Script valida formato y contenido
   ↓
5. Si válido → Actualiza Supabase automáticamente
   ↓
6. Ejecuta tests de coverage
   ↓
7. Si coverage < 95% → Alerta en Slack
   ↓
8. Deploy a producción
```

**Resultado:** Zero-manual-sync, always up-to-date

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### HOY (Prioridad Alta)

- [x] ✅ Diagnóstico completado
- [ ] ⏳ Implementar Fase 1 (Fix inmediato)
  - [ ] Agregar patrones específicos para productos por paquete
  - [ ] Cambiar routing a arsenal_cierre
  - [ ] Testing manual: 10 variaciones de la pregunta
  - [ ] Deploy a producción

### ESTA SEMANA (Prioridad Media)

- [ ] Implementar Fase 2.1: Auditoría de coverage
- [ ] Implementar Fase 2.2: Script de sincronización
- [ ] Re-generar embeddings con mejor contexto
- [ ] Documentar lista de 50 preguntas críticas

### PRÓXIMAS 2 SEMANAS (Prioridad Baja)

- [ ] Implementar Fase 3.1: Logging de preguntas sin respuesta
- [ ] Crear dashboard de analytics NEXUS
- [ ] Diseñar flujo CI/CD para knowledge base
- [ ] A/B testing de respuestas críticas

---

## 📋 CHECKLIST DE VALIDACIÓN

**Antes de considerar el problema resuelto:**

- [ ] NEXUS responde correctamente:
  - [ ] "¿Cuántos productos trae ESP 1?" → "7 productos"
  - [ ] "¿Cuántos productos trae ESP 2?" → "18 productos"
  - [ ] "¿Cuántos productos trae ESP 3?" → "35 productos"
  - [ ] "¿Qué productos incluye el paquete Inicial?" → Lista completa
  - [ ] "¿Inventario del paquete Empresarial?" → Lista ESP 2
- [ ] Coverage rate ≥ 95% en 50 preguntas críticas
- [ ] Sistema de sync local ↔ Supabase funcional
- [ ] Documentación actualizada en CLAUDE.md
- [ ] Deploy exitoso en producción

---

## 💡 RECOMENDACIONES FINALES

### Para el equipo:

1. **Cultura de testing:** Antes de deploy, probar 10 preguntas frecuentes manualmente
2. **Documentar gaps:** Si un usuario hace una pregunta que NEXUS no puede responder, agregarla a backlog inmediatamente
3. **Versionar knowledge base:** Cada cambio en .txt debe tener commit con descripción clara

### Para futuro:

1. **Separar "paquetes info" de arsenal_cierre:** Crear categoría `info_paquetes` específica para mejor clasificación
2. **Embeddings mejorados:** Considerar fine-tuning de modelo de embeddings con conversaciones reales
3. **Feedback loop:** Agregar botón "¿Esta respuesta fue útil?" en NEXUS UI

---

**Fin del documento**
**Status:** Listo para implementación Fase 1
**Próxima acción:** Ejecutar fix inmediato
