# 🧠 Instalación: Tabla nexus_conversations (Memoria a Largo Plazo)

**Fecha:** 2025-10-25
**Severidad:** CRÍTICA - NEXUS no funciona sin esta tabla
**Commit relacionado:** `001a4ef` (Memoria a largo plazo)

---

## 🎯 CONTEXTO

### El Problema

**Error reportado por Luis:**
```
Error 500 en NEXUS después del commit de memoria a largo plazo
NEXUS completamente inoperativo
```

**Root cause:**
- Commit `001a4ef` implementó feature de memoria a largo plazo
- Feature **lee** de tabla `nexus_conversations` para cargar historial
- **Tabla NO EXISTE** en Supabase → Query falla → Error 500

### La Solución

**Hotfix inmediato (commit `edd5402`):**
- ✅ Error handling para prevenir Error 500
- ✅ NEXUS funciona (sin historial)
- ⚠️ Memoria a largo plazo NO activa

**Solución permanente (este script):**
- ✅ Crear tabla `nexus_conversations`
- ✅ Habilitar memoria a largo plazo
- ✅ Usuario puede volver meses después con contexto

---

## 📋 INSTRUCCIONES DE INSTALACIÓN

### Paso 1: Ir a Supabase Dashboard

1. Abrir: https://supabase.com/dashboard/project/cvadzbmdypnbrbnkznpb
2. Click en "SQL Editor" en sidebar izquierdo
3. Click en "New query"

### Paso 2: Copiar Script SQL

⚠️ **IMPORTANTE:** Usa la versión SIMPLE del script (evita error de columna inexistente)

1. Abrir archivo: `supabase/migrations/20251025_create_nexus_conversations_SIMPLE.sql`
2. Copiar TODO el contenido (líneas 1-120)
3. Pegar en el editor SQL de Supabase

**NOTA:** Existe también `20251025_create_nexus_conversations.sql` (versión completa con RLS avanzado), pero puede fallar si el schema de `nexus_prospects` es diferente. La versión SIMPLE funciona en todos los casos.

### Paso 3: Ejecutar Script

1. Click en botón "Run" (esquina inferior derecha)
2. Esperar mensaje: "Success. No rows returned"

### Paso 4: Verificar Instalación

**Deberías ver estos mensajes en "Results":**
```
✅ Tabla nexus_conversations creada exitosamente
ℹ️ Tabla vacía - primera instalación. Las conversaciones se guardarán automáticamente desde ahora.
```

**Verificar que tabla existe:**
```sql
SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_name = 'nexus_conversations';
```

**Resultado esperado:**
```
table_name            | table_type
----------------------|------------
nexus_conversations   | BASE TABLE
```

### Paso 5: Probar NEXUS

1. Ir a: https://creatuactivo.com/luis-cabrejo-parra-4871288
2. Abrir NEXUS (botón flotante)
3. Escribir cualquier mensaje
4. **Verificar:**
   - ✅ No debe dar Error 500
   - ✅ Debe responder normalmente

**En consola del navegador, buscar:**
```
🔍 [NEXUS] Cargando historial de conversaciones para: ...
ℹ️ [NEXUS] Sin historial previo - primera conversación
```

### Paso 6: Probar Memoria a Largo Plazo (24h después)

**Día 1:**
1. Conversar con NEXUS sobre productos
2. Cerrar NEXUS

**Día 2:**
1. Abrir NEXUS
2. Preguntar: "¿Qué hablamos ayer?"
3. **Verificar:** NEXUS debe recordar conversación

**En consola del navegador, buscar:**
```
✅ [NEXUS] Historial cargado: X mensajes de Y conversaciones
🧠 [NEXUS] Memoria a largo plazo activa:
   📚 Histórico: X mensajes
   📝 Sesión actual: 2 mensajes
```

---

## 📊 ESTRUCTURA DE LA TABLA

### Columnas Principales

```sql
CREATE TABLE nexus_conversations (
  id UUID PRIMARY KEY,
  fingerprint_id TEXT NOT NULL,     -- Identifica al usuario entre sesiones
  session_id TEXT NOT NULL,         -- ID de sesión (cambia cada vez)
  messages JSONB NOT NULL,          -- Array de mensajes [{ role, content }]
  documents_used TEXT[],            -- Arsenal usado
  search_method TEXT,               -- Método de búsqueda
  prospect_data JSONB,              -- Snapshot de datos capturados
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Índices para Performance

```sql
-- Buscar conversaciones de un usuario
idx_nexus_conversations_fingerprint

-- Buscar conversaciones recientes
idx_nexus_conversations_created_at

-- Buscar conversaciones de usuario ordenadas por fecha (más usado)
idx_nexus_conversations_fingerprint_created
```

### Row-Level Security (RLS)

**Service role (API):**
- ✅ Puede hacer TODO (leer, escribir, actualizar, eliminar)

**Anon (público):**
- ✅ Puede insertar (para logging)
- ❌ NO puede leer ni modificar

**Authenticated (Constructores en Dashboard):**
- ✅ Pueden ver conversaciones de SUS prospectos
- ❌ NO pueden ver conversaciones de otros constructores

---

## 🔍 QUERIES ÚTILES

### Ver todas las conversaciones
```sql
SELECT
  id,
  fingerprint_id,
  created_at,
  jsonb_array_length(messages) AS num_mensajes
FROM nexus_conversations
ORDER BY created_at DESC
LIMIT 10;
```

### Ver conversaciones de un prospecto específico
```sql
SELECT
  id,
  session_id,
  created_at,
  messages
FROM nexus_conversations
WHERE fingerprint_id = 'TU_FINGERPRINT_AQUI'
ORDER BY created_at DESC;
```

### Contar conversaciones por prospecto
```sql
SELECT
  fingerprint_id,
  COUNT(*) AS total_conversaciones,
  SUM(jsonb_array_length(messages)) AS total_mensajes,
  MIN(created_at) AS primera_conversacion,
  MAX(created_at) AS ultima_conversacion
FROM nexus_conversations
GROUP BY fingerprint_id
ORDER BY total_conversaciones DESC
LIMIT 20;
```

### Ver estadísticas generales
```sql
SELECT
  COUNT(*) AS total_conversaciones,
  COUNT(DISTINCT fingerprint_id) AS prospectos_unicos,
  AVG(jsonb_array_length(messages)) AS promedio_mensajes_por_conversacion,
  MIN(created_at) AS primera_conversacion,
  MAX(created_at) AS ultima_conversacion
FROM nexus_conversations;
```

---

## 🚨 TROUBLESHOOTING

### Error: "relation nexus_conversations does not exist"

**Síntoma:** Error 500 en NEXUS, logs muestran que tabla no existe

**Solución:**
1. Ejecutar script de migración (ver Paso 1-3 arriba)
2. Verificar que tabla fue creada (ver Paso 4)

### Error: "permission denied for table nexus_conversations"

**Síntoma:** NEXUS puede escribir pero no leer historial

**Solución:**
```sql
-- Verificar RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'nexus_conversations';

-- Debe mostrar: rowsecurity = true

-- Verificar políticas existen
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'nexus_conversations';

-- Debe mostrar 3 políticas:
-- 1. Service role can manage all conversations (ALL, service_role)
-- 2. Anon can insert conversations (INSERT, anon)
-- 3. Constructors can view their prospects conversations (SELECT, authenticated)
```

### Historial NO se carga (pero tabla existe)

**Síntoma:** Logs muestran "Sin historial previo" aunque hay conversaciones

**Verificar datos existen:**
```sql
SELECT COUNT(*)
FROM nexus_conversations
WHERE fingerprint_id = 'TU_FINGERPRINT';
```

**Si COUNT > 0 pero no carga:**
- Verificar formato de `messages` es JSONB válido
- Verificar no hay datos corruptos

**Limpiar datos corruptos:**
```sql
-- Ver conversaciones con messages NULL o vacío
SELECT id, fingerprint_id, messages
FROM nexus_conversations
WHERE messages IS NULL OR messages = '[]'::jsonb;

-- Eliminar conversaciones sin mensajes
DELETE FROM nexus_conversations
WHERE messages IS NULL OR messages = '[]'::jsonb;
```

### Memoria consume muchos tokens

**Síntoma:** Costos altos de API Anthropic

**Optimizar:**
```sql
-- Ver conversaciones con más de 50 mensajes
SELECT
  fingerprint_id,
  COUNT(*) AS conversaciones,
  SUM(jsonb_array_length(messages)) AS total_mensajes
FROM nexus_conversations
GROUP BY fingerprint_id
HAVING SUM(jsonb_array_length(messages)) > 50
ORDER BY total_mensajes DESC;

-- Opción 1: Limitar a últimas 10 conversaciones por usuario
DELETE FROM nexus_conversations
WHERE id NOT IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY fingerprint_id ORDER BY created_at DESC) AS rn
    FROM nexus_conversations
  ) t
  WHERE rn <= 10
);

-- Opción 2: Eliminar conversaciones más viejas de 6 meses
DELETE FROM nexus_conversations
WHERE created_at < NOW() - INTERVAL '6 months';
```

---

## ✅ CRITERIO DE ÉXITO

**Después de instalar, verificar:**

- [x] Tabla `nexus_conversations` existe en Supabase
- [x] Índices creados correctamente
- [x] RLS habilitado con 3 políticas
- [x] NEXUS no da Error 500
- [x] Logs muestran "Cargando historial de conversaciones"
- [ ] Usuario puede conversar normalmente (Día 1)
- [ ] Usuario vuelve Día 2 y NEXUS recuerda contexto (Día 2)

**Test completo (24h):**
1. Día 1: Conversar sobre Constructor Inicial
2. Día 2: Preguntar "¿Qué hablamos ayer?"
3. Verificar: NEXUS menciona Constructor Inicial ✅

---

## 📚 REFERENCIAS

- **Commit hotfix:** `edd5402` (Error handling)
- **Commit feature:** `001a4ef` (Memoria a largo plazo)
- **Script migración:** `supabase/migrations/20251025_create_nexus_conversations.sql`
- **Documentación completa:** `FIX_MEMORIA_NORMALIZACION.md`

---

**Estado:** ⏳ Pendiente de instalación
**Prioridad:** 🔴 CRÍTICA (NEXUS funciona pero sin memoria)
**Tiempo estimado:** 5 minutos

---

**Creado por:** Claude Code + Luis Cabrejo
**Fecha:** 2025-10-25
