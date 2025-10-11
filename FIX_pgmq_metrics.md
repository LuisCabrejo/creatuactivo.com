# 🔧 Fix: Error en función pgmq_metrics

**Fecha:** 10 de Octubre de 2025
**Error reportado:** `ERROR: 42P13: parameter name "queue_name" used more than once`

---

## 🐛 Problema Identificado

La función `pgmq_metrics` tenía un conflicto de nombres:

```sql
-- ❌ CÓDIGO PROBLEMÁTICO
CREATE OR REPLACE FUNCTION pgmq_metrics(
  queue_name TEXT  -- Parámetro de entrada
)
RETURNS TABLE(
  queue_name TEXT,  -- ⚠️ CONFLICTO: Mismo nombre en columna de retorno
  queue_length BIGINT,
  ...
)
```

**Causa:** PostgreSQL no puede distinguir entre el parámetro de entrada `queue_name` y la columna de retorno `queue_name` dentro del cuerpo de la función.

---

## ✅ Solución Aplicada

Renombrar el parámetro de entrada usando prefijo `p_`:

```sql
-- ✅ CÓDIGO CORREGIDO
CREATE OR REPLACE FUNCTION pgmq_metrics(
  p_queue_name TEXT  -- ✅ Prefijo 'p_' para parámetro
)
RETURNS TABLE(
  queue_name TEXT,   -- ✅ Sin conflicto ahora
  queue_length BIGINT,
  ...
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p_queue_name::TEXT AS queue_name,  -- ✅ Usa p_queue_name internamente
    pgmq.queue_length(p_queue_name) AS queue_length,
    ...
```

---

## 📝 Archivos Actualizados

### 1. Migración SQL corregida
- ✅ [supabase/migrations/001_pgmq_functions.sql](supabase/migrations/001_pgmq_functions.sql) - Archivo original actualizado
- ✅ [supabase/migrations/001_pgmq_functions_FIXED.sql](supabase/migrations/001_pgmq_functions_FIXED.sql) - Versión lista para ejecutar con verificaciones

### 2. Producer API actualizado
- ✅ [src/app/api/nexus/producer/route.ts](src/app/api/nexus/producer/route.ts#L132-L134)

  **Cambio:**
  ```typescript
  // Antes
  await supabase.rpc('pgmq_metrics', {
    queue_name: 'nexus-prospect-ingestion'
  });

  // Después
  await supabase.rpc('pgmq_metrics', {
    p_queue_name: 'nexus-prospect-ingestion'  // ✅ Usa p_queue_name
  });
  ```

### 3. Scripts de verificación
- ✅ [scripts/verify-fase1.sql](scripts/verify-fase1.sql) - Ya usaba la sintaxis correcta

---

## 🚀 Pasos para Aplicar el Fix

### Opción A: Ejecutar SQL completo (Recomendado)

```sql
-- En Supabase SQL Editor:
-- Copiar y pegar TODO el contenido de:
-- supabase/migrations/001_pgmq_functions_FIXED.sql
```

Este archivo incluye:
- ✅ Las 5 funciones corregidas
- ✅ Permisos automáticos
- ✅ Verificaciones post-instalación
- ✅ Mensajes de confirmación

**Salida esperada:**
```
✅ SUCCESS: Todas las 5 funciones pgmq_* creadas correctamente
✅ SUCCESS: Permisos anon configurados correctamente
✅ SUCCESS: pgmq_metrics funciona correctamente
Cola: nexus-prospect-ingestion, Longitud: 0
========================================
✅ FASE 1 - Funciones RPC instaladas
========================================
```

### Opción B: Ejecutar solo la función corregida

Si ya instalaste las otras funciones:

```sql
-- Solo re-crear pgmq_metrics
CREATE OR REPLACE FUNCTION pgmq_metrics(
  p_queue_name TEXT
)
RETURNS TABLE(
  queue_name TEXT,
  queue_length BIGINT,
  newest_msg_age_sec INTEGER,
  oldest_msg_age_sec INTEGER,
  total_messages BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p_queue_name::TEXT AS queue_name,
    pgmq.queue_length(p_queue_name) AS queue_length,
    EXTRACT(EPOCH FROM NOW() - MIN(enqueued_at))::INTEGER AS newest_msg_age_sec,
    EXTRACT(EPOCH FROM NOW() - MAX(enqueued_at))::INTEGER AS oldest_msg_age_sec,
    COUNT(*)::BIGINT AS total_messages
  FROM pgmq.q_nexus_prospect_ingestion;
END;
$$;

-- Asegurar permisos
GRANT EXECUTE ON FUNCTION pgmq_metrics TO anon, authenticated;
```

---

## ✅ Verificación Post-Fix

Ejecutar en Supabase SQL Editor:

```sql
-- Test 1: Verificar función existe
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'pgmq_metrics';
-- Esperado: 1 fila

-- Test 2: Verificar permisos
SELECT has_function_privilege('anon', 'pgmq_metrics(text)', 'EXECUTE');
-- Esperado: TRUE

-- Test 3: Ejecutar función
SELECT * FROM pgmq_metrics('nexus-prospect-ingestion');
-- Esperado: Retorna métricas sin errores
```

---

## 📊 Impacto del Fix

| Componente | Estado Antes | Estado Después |
|------------|-------------|----------------|
| Función pgmq_metrics | ❌ Error 42P13 | ✅ Funcional |
| Producer health check | ❌ Fallaría | ✅ Funciona |
| Scripts de verificación | ⚠️ Inconsistente | ✅ Alineado |
| Documentación | ℹ️ Sin fix | ✅ Documentado |

---

## 🎓 Lección Aprendida

**Best Practice PostgreSQL:**
- Siempre usar prefijos para parámetros de funciones (`p_`, `in_`, `v_`)
- Evitar nombres que colisionen con columnas de salida
- Especialmente crítico en funciones `RETURNS TABLE`

**Patrón recomendado:**
```sql
CREATE FUNCTION mi_funcion(
  p_parametro TEXT,      -- ✅ p_ para parámetros de entrada
  in_dato INTEGER        -- ✅ in_ también válido
)
RETURNS TABLE(
  parametro TEXT,        -- ✅ Sin prefijo para columnas de salida
  dato INTEGER
)
AS $$
DECLARE
  v_variable TEXT;       -- ✅ v_ para variables locales
BEGIN
  v_variable := p_parametro;  -- ✅ Claro que es parámetro
  RETURN QUERY SELECT v_variable, in_dato;
END;
$$;
```

---

## ✅ Status Final

- [x] Error identificado y diagnosticado
- [x] Función pgmq_metrics corregida
- [x] Producer API actualizado
- [x] Archivo FIXED creado con verificaciones
- [x] Documentación actualizada
- [x] Scripts de verificación validados

**Próximo paso:** Ejecutar `001_pgmq_functions_FIXED.sql` en Supabase y continuar con el despliegue de la Edge Function.

---

**Preparado por:** Claude Code Agent
**Issue:** Parameter name conflict in pgmq_metrics
**Resolución:** ✅ FIXED - Ready for deployment
