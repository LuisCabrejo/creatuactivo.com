# HANDOFF: Tracking y Fiabilidad de Datos en Dashboard IAA

**Fecha:** 21 de octubre 2025
**Proyecto:** CreaTuActivo Dashboard (app.creatuactivo.com) + Marketing (creatuactivo.com)
**Prioridad:** Crítica
**Agente Asignado:** [TBD]
**Estado:** Pendiente de inicio

---

## CONTEXTO DEL PROYECTO

### Sistema de Tracking Actual

El ecosistema CreaTuActivo tiene dos proyectos interconectados:

1. **Marketing Site** (creatuactivo.com)
   - Landing pages públicas para prospectos
   - NEXUS captura datos vía `/api/nexus` route
   - Links personalizados: `/fundadores/{constructor-slug}`
   - Tabla principal: `prospects` (fingerprint-based tracking)

2. **Dashboard** (app.creatuactivo.com)
   - Portal privado para Constructores
   - Visualización de prospectos en "Mi Sistema IAA"
   - Tabla principal: `private_users` (authenticated users)
   - API: `/api/mi-sistema-iaa` route

**Problema histórico:** El tracking entre ambos proyectos ha tenido múltiples fallos que hemos ido corrigiendo. Ahora necesitamos **validar que todo funciona correctamente**.

---

## HISTORIAL DE PROBLEMAS Y FIXES APLICADOS

### Problema 1: UUID Casting Error (RESUELTO - Script 03)
**Fecha:** ~18 de octubre 2025
**Commit:** Relacionado con `7f48ed5`

**Error:**
```
invalid input syntax for type uuid: "5c2e7a04e6cf239be9e61b15487429756da541374f8f14b93ac0b77c2b6c7bbc"
```

**Causa:**
RPC `update_prospect_data` intentaba buscar prospects por `id` (UUID) usando `fingerprint` (SHA-256 hash de 64 caracteres).

**Fix aplicado (Script 03):**
- Cambio de búsqueda: `WHERE id = p_fingerprint_id` → `WHERE fingerprint_id = p_fingerprint_id`
- Generación de UUID nuevo: `gen_random_uuid()` para campo `id`
- Fingerprint se guarda como TEXT en `fingerprint_id`

**Estado:** ✅ Resuelto y desplegado

---

### Problema 2: Constructor_id NULL en pending_activations (RESUELTO)
**Fecha:** ~19 de octubre 2025
**Commit:** `7f48ed5` - "fix: Resolver guardado de prospectos en pending_activations"

**Error:**
Prospectos desde formulario `/fundadores` no se guardaban en `pending_activations` porque `invited_by` quedaba NULL (constraint NOT NULL).

**Causa:**
- URL `/fundadores/SLUG` no detectaba `constructor_id` (solo buscaba `?ref=`)
- `invited_by` quedaba NULL
- INSERT fallaba silenciosamente
- Emails se enviaban de todos modos (falsa sensación de éxito)

**Fix aplicado:**
1. Extracción mejorada de `constructor_id`:
   - Estrategia 1: Query param `?ref=SLUG`
   - Estrategia 2A: Referer con `?ref=SLUG`
   - Estrategia 2B: Referer con ruta `/fundadores/SLUG` (regex)

2. Fallback con usuario Sistema:
   - UUID: `0456e1b9-a661-4e8c-8b6e-7d1e9f4c3a2b`
   - Garantiza que `invited_by` NUNCA sea NULL

3. Bloqueo de flujo en caso de error:
   - Si INSERT falla, retorna error 500
   - NO envía emails si datos no se guardaron

**Estado:** ✅ Resuelto en proyecto Marketing

---

### Problema 3: NEXUS prospects no vinculados a constructor correcto (RESUELTO)
**Fecha:** ~20 de octubre 2025
**Commit:** `d1bbb1d` - "feat: Integrar constructor_id en tracking NEXUS"

**Error:**
Prospects creados desde NEXUS se vinculaban al usuario "Sistema" en vez del constructor que los invitó.

**Causa:**
API NEXUS (`/api/nexus` route) no recibía ni buscaba `constructor_id` desde URL.

**Fix aplicado:**

1. **Hook useNEXUSChat.ts:**
   - Detección automática: Extrae `constructor_id` desde URL `/fundadores/SLUG`
   - Regex: `/\/fundadores\/([a-z0-9-]+)/`
   - Request body: Incluye `constructorId` en POST a `/api/nexus`

2. **API route.ts:**
   - Nuevo parámetro: `constructorId` en request body
   - Extracción de UUID: Busca constructor en `private_users` por `constructor_id`
   - RPC actualizado: Pasa `p_constructor_id` como tercer parámetro

3. **Función captureProspectData:**
   - Nuevo parámetro: `constructorUUID` opcional
   - Propagación: Pasa UUID al RPC `update_prospect_data`
   - Fallback: Si no se provee, RPC usa Sistema (UUID hardcoded)

**Estado:** ✅ Resuelto y desplegado

---

### Problema 4: Script 03 aplicado pero prospects no aparecen en Dashboard
**Fecha:** ~20 de octubre 2025

**Error reportado por usuario:**
> "Haciendo un paréntesis entre nosotros la funcionalidad estaba mejor hace un momento cuando los datos se mostraban en la página https://app.creatuactivo.com/mi-sistema-iaa y dashboard, versus ahora donde adicional ahora tampoco se muestra en Dashboard"

**Investigación realizada:**
- Script 03 aplicado correctamente en Supabase ✅
- RPC `update_prospect_data` funcionando ✅
- Dashboard API `/api/mi-sistema-iaa` leyendo de tabla `prospects` ✅
- **Causa probable:** Cache de datos, prospectos de prueba con datos incompletos, o constructor_id no coincidiendo

**Estado:** ⚠️ Requiere validación exhaustiva (esta tarea)

---

## OBJETIVO DE LA TAREA

### Objetivo Principal
Validar end-to-end que el tracking de prospectos funciona correctamente desde captura en NEXUS hasta visualización en Dashboard, garantizando fiabilidad de datos al 100%.

### Objetivos Específicos

1. **Validar Flujo Completo:**
   - Usuario visita `/fundadores/{constructor-slug}`
   - NEXUS captura datos (nombre, arquetipo, WhatsApp)
   - Datos se guardan en tabla `prospects` con `constructor_id` correcto
   - Dashboard muestra prospect vinculado al constructor correcto

2. **Validar RPC Functions:**
   - `update_prospect_data` crea/actualiza prospects correctamente
   - `search_nexus_documents` retorna resultados (arsenal)
   - No hay errores de UUID casting
   - Fingerprints se guardan como TEXT

3. **Validar Integridad de Datos:**
   - No hay prospects duplicados (mismo fingerprint)
   - Constructor_id siempre tiene valor válido (nunca NULL ni "Sistema" cuando no debe)
   - Datos de `device_info` (JSONB) se extraen correctamente en Dashboard
   - Timestamps (`created_at`, `updated_at`) son precisos

4. **Validar Estados IAA:**
   - Prospects avanzan de INICIAR → ACOGER → ACTIVAR según lógica
   - Interest level se calcula correctamente (0-10)
   - Momento óptimo se detecta (frío/tibio/caliente)

---

## ARQUITECTURA DEL SISTEMA DE TRACKING

### Flujo de Datos (End-to-End)

```
1. Usuario visita: https://creatuactivo.com/fundadores/luis-cabrejo-parra-4871288
   ↓
2. Frontend genera fingerprint: SHA-256(userAgent + screenRes + timezone + etc.)
   Ejemplo: "5c2e7a04e6cf239be9e61b15487429756da541374f8f14b93ac0b77c2b6c7bbc"
   ↓
3. useNEXUSChat hook extrae constructor_id desde URL
   Regex: /\/fundadores\/([a-z0-9-]+)/
   Resultado: "luis-cabrejo-parra-4871288"
   ↓
4. Usuario interactúa con NEXUS
   - Acepta consentimiento
   - Proporciona nombre: "Manuel"
   - Selecciona arquetipo: "Profesional con Visión"
   - Proporciona WhatsApp: "3001234567"
   ↓
5. POST /api/nexus con body:
   {
     fingerprint: "5c2e7a04...",
     constructorId: "luis-cabrejo-parra-4871288",
     messages: [...]
   }
   ↓
6. API busca constructor UUID en private_users:
   SELECT id FROM private_users WHERE constructor_id = 'luis-cabrejo-parra-4871288'
   Resultado: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   ↓
7. captureProspectData() detecta datos en mensaje:
   - Nombre: "Manuel"
   - Arquetipo: "profesional_vision"
   - WhatsApp: "+573001234567"
   ↓
8. RPC update_prospect_data(fingerprint, device_info_json, constructor_uuid)
   ↓
9. RPC busca prospect existente:
   SELECT * FROM prospects WHERE fingerprint_id = '5c2e7a04...'
   ↓
10. Si existe: MERGE datos (mantiene antiguos + nuevos)
    Si no existe: INSERT nuevo prospect con:
    - id: gen_random_uuid()
    - fingerprint_id: '5c2e7a04...' (TEXT)
    - constructor_id: 'a1b2c3d4-...' (UUID del constructor)
    - device_info: {name, archetype, phone, ...}
    - stage: 'iniciar'
    ↓
11. Constructor accede a Dashboard:
    https://app.creatuactivo.com/mi-sistema-iaa
    ↓
12. GET /api/mi-sistema-iaa (con cookie de sesión)
    ↓
13. API extrae constructor_id de sesión autenticada
    ↓
14. Query a prospects:
    SELECT * FROM prospects
    WHERE constructor_id = 'a1b2c3d4-...'
    ORDER BY created_at DESC
    ↓
15. Extrae datos de JSONB device_info:
    - name: device_info->>'name'
    - archetype: device_info->>'archetype'
    - phone: device_info->>'phone'
    - interest_level: device_info->>'interest_level'
    ↓
16. Frontend renderiza tabla con prospectos
```

---

## PLAN DE TESTING EXHAUSTIVO

### TEST 1: Captura desde Cero (Happy Path)

**Objetivo:** Validar flujo completo sin datos previos

**Pasos:**

1. **Pre-requisito: Limpiar datos de prueba**
   ```sql
   -- Supabase SQL Editor
   DELETE FROM prospects
   WHERE device_info->>'name' = 'TestManuel'
   OR device_info->>'phone' = '+573009998888';
   ```

2. **Generar fingerprint nuevo:**
   - Abrir navegador en modo incógnito
   - Ir a: https://creatuactivo.com/fundadores/luis-cabrejo-parra-4871288
   - Abrir DevTools Console
   - Ejecutar:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

3. **Interactuar con NEXUS:**
   - Pregunta inicial: "¿Qué es CreaTuActivo?"
   - ✅ Verificar: Aparece texto de consentimiento minimalista
   - Responder: "Sí, autorizo"
   - ✅ Verificar: NEXUS pide nombre
   - Responder: "TestManuel"
   - ✅ Verificar: NEXUS confirma nombre y pide arquetipo
   - Responder: "💼 Profesional con Visión"
   - ✅ Verificar: NEXUS confirma arquetipo y pide WhatsApp
   - Responder: "3009998888"
   - ✅ Verificar: NEXUS confirma y ofrece coordinar consulta

4. **Verificar en Supabase (inmediatamente después):**
   ```sql
   SELECT
     id,
     fingerprint_id,
     constructor_id,
     device_info->>'name' as nombre,
     device_info->>'archetype' as arquetipo,
     device_info->>'phone' as whatsapp,
     stage,
     created_at
   FROM prospects
   WHERE device_info->>'name' = 'TestManuel'
   ORDER BY created_at DESC
   LIMIT 1;
   ```

   **Validaciones:**
   - ✅ `id` es UUID válido (36 caracteres)
   - ✅ `fingerprint_id` es SHA-256 (64 caracteres hex)
   - ✅ `constructor_id` es UUID de Luis Cabrejo (no Sistema)
   - ✅ `device_info.name` = "TestManuel"
   - ✅ `device_info.archetype` = "profesional_vision"
   - ✅ `device_info.phone` contiene "3009998888"
   - ✅ `stage` = "iniciar"
   - ✅ `created_at` es timestamp reciente (< 1 minuto)

5. **Verificar en Dashboard (5 segundos después):**
   - Login en: https://app.creatuactivo.com/mi-sistema-iaa
   - Credenciales: luiscabrejo7@gmail.com
   - ✅ Verificar: Prospect "TestManuel" aparece en tabla
   - ✅ Verificar: Columna ARQUETIPO muestra "💼 Profesional con Visión"
   - ✅ Verificar: Columna WHATSAPP muestra número
   - ✅ Verificar: Columna ESTADO muestra "En INICIAR"
   - ✅ Verificar: Timestamp es correcto

**Criterio de éxito:** Todos los ✅ pasan sin errores

---

### TEST 2: Usuario Recurrente (Merge de Datos)

**Objetivo:** Validar que datos previos se mantienen + nuevos se agregan

**Pasos:**

1. **Usar mismo fingerprint del TEST 1:**
   - Ir a: https://creatuactivo.com/fundadores/luis-cabrejo-parra-4871288
   - Mismo navegador/sesión (NO limpiar localStorage)

2. **Interactuar con NEXUS:**
   - ✅ Verificar: NEXUS saluda con nombre ("¡Hola de nuevo, TestManuel!")
   - ✅ Verificar: NO vuelve a pedir consentimiento
   - ✅ Verificar: NO vuelve a pedir nombre ni arquetipo
   - Preguntar: "¿Cuáles son los paquetes?"
   - ✅ Verificar: NEXUS responde con paquetes (ESP1/ESP2/ESP3)
   - Responder: "Me interesa el Constructor Empresarial"
   - ✅ Verificar: NEXUS captura interés en paquete

3. **Verificar en Supabase:**
   ```sql
   SELECT
     device_info
   FROM prospects
   WHERE device_info->>'name' = 'TestManuel'
   ORDER BY created_at DESC
   LIMIT 1;
   ```

   **Validaciones:**
   - ✅ `device_info.name` sigue siendo "TestManuel" (no se borró)
   - ✅ `device_info.archetype` sigue siendo "profesional_vision"
   - ✅ `device_info.phone` sigue presente
   - ✅ `device_info.package` = "esp2" (NUEVO campo agregado)
   - ✅ `device_info.interest_level` aumentó (MERGE correcto)

**Criterio de éxito:** Datos antiguos + nuevos coexisten

---

### TEST 3: Multiple Constructores (Aislamiento de Datos)

**Objetivo:** Validar que cada constructor ve SOLO sus prospectos

**Pasos:**

1. **Crear prospect para Constructor A (Luis Cabrejo):**
   - Ya tenemos TestManuel del TEST 1 ✅

2. **Crear prospect para Constructor B (otro constructor):**
   - Limpiar localStorage y abrir modo incógnito
   - Ir a: https://creatuactivo.com/fundadores/[otro-constructor-slug]
   - Interactuar con NEXUS y dar datos: "TestCarlos"
   - ✅ Verificar en Supabase: Prospect con constructor_id diferente

3. **Verificar aislamiento en Dashboard:**
   - Login como Luis Cabrejo: https://app.creatuactivo.com/mi-sistema-iaa
   - ✅ Verificar: SOLO aparece "TestManuel" (no TestCarlos)
   - Logout
   - Login como Constructor B
   - ✅ Verificar: SOLO aparece "TestCarlos" (no TestManuel)

**Criterio de éxito:** Row-Level Security funciona correctamente

---

### TEST 4: Estados IAA (Transiciones)

**Objetivo:** Validar que prospects avanzan de INICIAR → ACOGER → ACTIVAR

**Pasos:**

1. **Prospect en INICIAR (interest_level < 7):**
   - Usar TestManuel del TEST 1
   - Verificar en Supabase: `stage = 'iniciar'`
   - Verificar en Dashboard: "En INICIAR" ✅

2. **Mover a ACOGER (interest_level >= 7):**
   - Interactuar con NEXUS y mostrar interés fuerte:
     - "Me interesa empezar"
     - "¿Cuánto cuesta?"
     - "¿Cómo me registro?"
   - ✅ Verificar: Interest level aumenta en cada mensaje

   ```sql
   UPDATE prospects
   SET device_info = jsonb_set(
     device_info,
     '{interest_level}',
     '8'
   )
   WHERE device_info->>'name' = 'TestManuel';
   ```

3. **Verificar transición en Dashboard:**
   - Refrescar Dashboard
   - ✅ Verificar: TestManuel ahora muestra "En ACOGER"

4. **Mover a ACTIVAR (manual):**
   ```sql
   UPDATE prospects
   SET stage = 'activar'
   WHERE device_info->>'name' = 'TestManuel';
   ```

   - Refrescar Dashboard
   - ✅ Verificar: TestManuel muestra "Activado"

**Criterio de éxito:** Estados reflejan correctamente en Dashboard

---

### TEST 5: Fallback a Sistema (Edge Case)

**Objetivo:** Validar que cuando no se detecta constructor, usa Sistema como fallback

**Pasos:**

1. **Visitar URL sin constructor_id:**
   - Ir directamente a: https://creatuactivo.com
   - Abrir NEXUS desde botón flotante
   - Interactuar y dar datos: "TestSistema"

2. **Verificar en Supabase:**
   ```sql
   SELECT
     constructor_id,
     device_info->>'name' as nombre
   FROM prospects
   WHERE device_info->>'name' = 'TestSistema'
   ORDER BY created_at DESC
   LIMIT 1;
   ```

   **Validaciones:**
   - ✅ `constructor_id` = UUID de Sistema (`0456e1b9-a661-...`)
   - ✅ Prospect se guardó (no falló por constraint)

3. **Verificar en Dashboard:**
   - Login como Luis Cabrejo
   - ✅ Verificar: TestSistema NO aparece (correcto, no es su prospect)
   - Login como Admin/Sistema (si existe)
   - ✅ Verificar: TestSistema SÍ aparece

**Criterio de éxito:** Fallback funciona, no rompe el sistema

---

### TEST 6: Datos Incompletos (Resilencia)

**Objetivo:** Validar que el sistema maneja datos parciales sin fallar

**Pasos:**

1. **Prospect con solo nombre (sin arquetipo ni WhatsApp):**
   - Interactuar con NEXUS
   - Dar solo nombre: "TestIncompleto"
   - Cerrar conversación sin dar más datos

2. **Verificar en Supabase:**
   ```sql
   SELECT
     device_info
   FROM prospects
   WHERE device_info->>'name' = 'TestIncompleto'
   ORDER BY created_at DESC
   LIMIT 1;
   ```

   **Validaciones:**
   - ✅ `device_info.name` = "TestIncompleto"
   - ✅ `device_info.archetype` = null (sin error)
   - ✅ `device_info.phone` = null (sin error)

3. **Verificar en Dashboard:**
   - ✅ Verificar: Prospect aparece
   - ✅ Verificar: Columna ARQUETIPO muestra "-" (no causa crash)
   - ✅ Verificar: Columna WHATSAPP muestra "-" (no causa crash)

**Criterio de éxito:** Sistema es resiliente a datos incompletos

---

### TEST 7: Performance y Carga (Stress Test)

**Objetivo:** Validar que Dashboard responde rápido con muchos prospectos

**Pasos:**

1. **Insertar 100 prospects de prueba:**
   ```sql
   -- Supabase SQL Editor
   DO $$
   DECLARE
     i INTEGER;
     constructor_uuid UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'; -- UUID de Luis
   BEGIN
     FOR i IN 1..100 LOOP
       INSERT INTO prospects (
         id,
         fingerprint_id,
         constructor_id,
         device_info,
         stage,
         created_at,
         updated_at
       ) VALUES (
         gen_random_uuid(),
         md5(random()::text), -- Fingerprint aleatorio
         constructor_uuid,
         jsonb_build_object(
           'name', 'TestStress' || i::text,
           'archetype', CASE (random() * 5)::integer
             WHEN 0 THEN 'profesional_vision'
             WHEN 1 THEN 'emprendedor_dueno_negocio'
             WHEN 2 THEN 'independiente_freelancer'
             WHEN 3 THEN 'lider_hogar'
             WHEN 4 THEN 'lider_comunidad'
             ELSE 'joven_ambicion'
           END,
           'phone', '+57300' || (1000000 + (random() * 9000000)::integer)::text,
           'interest_level', (random() * 10)::integer
         ),
         CASE WHEN random() < 0.7 THEN 'iniciar'
              WHEN random() < 0.9 THEN 'acoger'
              ELSE 'activar'
         END,
         NOW() - (random() * interval '30 days'),
         NOW() - (random() * interval '30 days')
       );
     END LOOP;
   END $$;
   ```

2. **Verificar en Dashboard:**
   - Ir a: https://app.creatuactivo.com/mi-sistema-iaa
   - Abrir DevTools Network tab
   - Refrescar página
   - ✅ Verificar: `/api/mi-sistema-iaa` responde en < 2 segundos
   - ✅ Verificar: Tabla renderiza todos los 100+ prospectos
   - ✅ Verificar: No hay errores en console
   - ✅ Verificar: Paginación funciona (si implementada)

3. **Limpiar datos de prueba:**
   ```sql
   DELETE FROM prospects
   WHERE device_info->>'name' LIKE 'TestStress%';
   ```

**Criterio de éxito:** Dashboard responde rápido con 100+ registros

---

## QUERIES DE DIAGNÓSTICO

### Query 1: Ver todos los prospectos de un constructor

```sql
SELECT
  id,
  fingerprint_id,
  device_info->>'name' as nombre,
  device_info->>'archetype' as arquetipo,
  device_info->>'phone' as whatsapp,
  device_info->>'interest_level' as interes,
  stage,
  created_at
FROM prospects
WHERE constructor_id = 'UUID_DEL_CONSTRUCTOR'
ORDER BY created_at DESC;
```

### Query 2: Detectar prospectos duplicados (mismo fingerprint)

```sql
SELECT
  fingerprint_id,
  COUNT(*) as duplicados,
  array_agg(id) as ids
FROM prospects
GROUP BY fingerprint_id
HAVING COUNT(*) > 1;
```

**Acción si hay duplicados:**
```sql
-- Mantener el más reciente, borrar los demás
DELETE FROM prospects
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY fingerprint_id ORDER BY created_at DESC) as rn
    FROM prospects
  ) t
  WHERE rn > 1
);
```

### Query 3: Detectar prospectos sin constructor (huérfanos)

```sql
SELECT
  id,
  fingerprint_id,
  constructor_id,
  device_info->>'name' as nombre,
  created_at
FROM prospects
WHERE constructor_id IS NULL;
```

**Acción si hay huérfanos:**
```sql
-- Asignar a Sistema
UPDATE prospects
SET constructor_id = '0456e1b9-a661-4e8c-8b6e-7d1e9f4c3a2b'
WHERE constructor_id IS NULL;
```

### Query 4: Ver prospectos con datos incompletos

```sql
SELECT
  id,
  device_info->>'name' as nombre,
  device_info->>'archetype' as arquetipo,
  device_info->>'phone' as whatsapp,
  device_info->>'consent_granted' as consentimiento,
  created_at
FROM prospects
WHERE device_info->>'name' IS NOT NULL
  AND (
    device_info->>'archetype' IS NULL
    OR device_info->>'phone' IS NULL
  )
ORDER BY created_at DESC
LIMIT 20;
```

### Query 5: Estadísticas por constructor

```sql
SELECT
  pu.name as constructor_nombre,
  pu.constructor_id as constructor_slug,
  COUNT(p.id) as total_prospectos,
  COUNT(CASE WHEN p.stage = 'iniciar' THEN 1 END) as en_iniciar,
  COUNT(CASE WHEN p.stage = 'acoger' THEN 1 END) as en_acoger,
  COUNT(CASE WHEN p.stage = 'activar' THEN 1 END) as activados,
  AVG((p.device_info->>'interest_level')::integer) as interes_promedio
FROM prospects p
JOIN private_users pu ON p.constructor_id = pu.id
GROUP BY pu.id, pu.name, pu.constructor_id
ORDER BY total_prospectos DESC;
```

### Query 6: Verificar integridad de RPC

```sql
-- Test manual del RPC
SELECT update_prospect_data(
  'test-fingerprint-12345',
  '{"name": "TestRPC", "archetype": "profesional_vision", "phone": "+573001234567"}'::jsonb,
  'UUID_DEL_CONSTRUCTOR'
);

-- Verificar que se creó
SELECT * FROM prospects WHERE fingerprint_id = 'test-fingerprint-12345';

-- Limpiar
DELETE FROM prospects WHERE fingerprint_id = 'test-fingerprint-12345';
```

---

## CHECKLIST DE VALIDACIÓN COMPLETA

### Pre-requisitos
- [ ] Acceso a Supabase SQL Editor
- [ ] Acceso a Dashboard con cuenta de constructor
- [ ] Navegador con DevTools (Chrome/Firefox)
- [ ] Limpiar prospects de prueba anteriores

### Tests de Flujo
- [ ] TEST 1: Captura desde Cero (Happy Path) - TODOS los ✅ pasan
- [ ] TEST 2: Usuario Recurrente (Merge de Datos) - TODOS los ✅ pasan
- [ ] TEST 3: Multiple Constructores (Aislamiento) - TODOS los ✅ pasan
- [ ] TEST 4: Estados IAA (Transiciones) - TODOS los ✅ pasan
- [ ] TEST 5: Fallback a Sistema (Edge Case) - TODOS los ✅ pasan
- [ ] TEST 6: Datos Incompletos (Resilencia) - TODOS los ✅ pasan
- [ ] TEST 7: Performance (Stress Test) - TODOS los ✅ pasan

### Queries de Diagnóstico
- [ ] Query 1: Ver prospectos de constructor - Sin errores
- [ ] Query 2: Detectar duplicados - Cero duplicados encontrados
- [ ] Query 3: Detectar huérfanos - Cero huérfanos encontrados
- [ ] Query 4: Datos incompletos - Menos del 10% incompletos
- [ ] Query 5: Estadísticas - Números coherentes
- [ ] Query 6: Test RPC - Funciona correctamente

### Integridad de Datos
- [ ] Todos los `fingerprint_id` son TEXT de 64 caracteres
- [ ] Todos los `id` son UUID válidos de 36 caracteres
- [ ] Todos los `constructor_id` son UUID válidos (ninguno NULL)
- [ ] Todos los `device_info` son JSONB válidos (no strings)
- [ ] Todos los timestamps están en UTC
- [ ] No hay registros duplicados (mismo fingerprint)

### Dashboard UI
- [ ] Tabla renderiza sin errores de console
- [ ] Columnas formatean datos correctamente (formatArchetype, formatPackage)
- [ ] Paginación funciona (si implementada)
- [ ] Filtros funcionan (si implementados)
- [ ] Tiempos de carga < 2 segundos

---

## PROBLEMAS CONOCIDOS Y WORKAROUNDS

### Problema: Cache de Anthropic Prompt
**Síntoma:** NEXUS usa versión antigua del System Prompt
**Workaround:** Esperar 5 minutos o cambiar version number en Supabase

### Problema: localStorage persiste fingerprint
**Síntoma:** Mismo fingerprint entre tests
**Workaround:** `localStorage.clear()` antes de cada test

### Problema: Dashboard muestra datos cacheados
**Síntoma:** Prospectos nuevos no aparecen inmediatamente
**Workaround:** Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### Problema: RPC timeout en queries grandes
**Síntoma:** Error "Function execution timed out"
**Workaround:** Agregar índices en `fingerprint_id` y `constructor_id`

---

## CRITERIOS DE ÉXITO FINAL

### Mínimos Aceptables
1. ✅ Todos los 7 tests pasan sin errores
2. ✅ Cero prospectos duplicados
3. ✅ Cero prospectos huérfanos (NULL constructor_id)
4. ✅ Dashboard muestra datos correctos para cada constructor
5. ✅ RPC functions funcionan sin errores de UUID

### Ideal
1. ✅ Todo lo anterior
2. ✅ Tiempos de respuesta < 1.5 segundos
3. ✅ Menos del 5% de prospectos con datos incompletos
4. ✅ Estadísticas coherentes (no hay discrepancias)
5. ✅ Documentación de issues encontrados y resueltos

---

## REPORTE FINAL ESPERADO

Al finalizar esta tarea, debes entregar un reporte con:

### 1. Resumen Ejecutivo
- ¿El sistema de tracking funciona correctamente? (Sí/No)
- Tasa de éxito de tests: X de 7 (XX%)
- Issues críticos encontrados: X
- Issues menores encontrados: X

### 2. Resultados de Tests
- TEST 1: ✅ / ❌ (detalles si falla)
- TEST 2: ✅ / ❌ (detalles si falla)
- ... (para todos los 7 tests)

### 3. Integridad de Datos
- Total de prospectos en sistema: X
- Prospectos duplicados encontrados: X (query 2)
- Prospectos huérfanos encontrados: X (query 3)
- Prospectos con datos incompletos: X (query 4)

### 4. Performance
- Tiempo de carga Dashboard (100 prospectos): X segundos
- Tiempo de respuesta API `/api/mi-sistema-iaa`: X ms
- Tiempo de ejecución RPC `update_prospect_data`: X ms

### 5. Issues Encontrados
Para cada issue:
- **Descripción:** [Qué está mal]
- **Severidad:** Crítica / Alta / Media / Baja
- **Causa raíz:** [Por qué pasa]
- **Solución propuesta:** [Cómo arreglarlo]
- **Workaround temporal:** [Mientras se arregla]

### 6. Recomendaciones
- Mejoras de performance
- Optimizaciones de queries
- Índices faltantes
- Validaciones adicionales
- Monitoring/alertas

---

## RECURSOS Y REFERENCIAS

### Archivos Clave
- **Marketing API:** `/Users/luiscabrejo/cta/CreaTuActivo-Marketing/src/app/api/nexus/route.ts`
- **Dashboard API:** `/Users/luiscabrejo/cta/CreaTuActivo-Dashboard/src/app/api/mi-sistema-iaa/route.ts`
- **Dashboard UI:** `/Users/luiscabrejo/cta/CreaTuActivo-Dashboard/src/app/mi-sistema-iaa/page.tsx`
- **Hook NEXUS:** `/Users/luiscabrejo/cta/CreaTuActivo-Marketing/src/hooks/useNEXUSChat.ts`

### Commits Relevantes
- `7f48ed5` - Fix guardado en pending_activations
- `d1bbb1d` - Integrar constructor_id en tracking NEXUS
- `82ab460` - Ajustes integración IAA
- `10a9232` - Agregar columnas Arquetipo y Paquete

### Documentación
- `/CLAUDE.md` - Guía completa del proyecto
- `/DIAGNOSTICO_TRACKING_BUEN_HOGAR.md` - Ejemplo de diagnóstico anterior
- `/CAMBIOS_APLICADOS_TRACKING_FIX.md` - Historial de fixes

### Scripts Útiles
- `scripts/03-fix-fingerprint-rpc-CRITICAL.sql` - RPC update_prospect_data
- `scripts/check-nexus-interactions.js` - Verificar interacciones NEXUS
- `scripts/search-nexus-disipro.js` - Buscar prospectos específicos

---

## NOTAS FINALES

**Filosofía de esta tarea:**
> "Trust, but verify. No asumas que funciona porque no da error. Valida cada punto del flujo end-to-end con datos reales."

**Prioridad:**
Esta tarea es **CRÍTICA** porque sin tracking confiable:
- Constructores no pueden ver sus prospectos
- No hay métricas reales del sistema IAA
- No se puede escalar el negocio

**Timeline sugerido:**
- Setup inicial: 30 mins
- Tests 1-7: 3-4 horas
- Queries diagnóstico: 1 hora
- Reporte final: 1-2 horas
- **Total: ~6-8 horas**

**Contacto:**
Si encuentras issues críticos o bloqueadores, consulta con el agente principal que tiene contexto completo del proyecto.

---

**Última actualización:** 2025-10-21 17:45
**Estado del sistema:** En producción, con fixes previos aplicados
**Próxima revisión:** Después de validación completa
