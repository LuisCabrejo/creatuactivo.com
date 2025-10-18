# 🎯 IMPLEMENTACIÓN: Fix del Sistema de Tracking

**Fecha:** 2025-10-17
**Objetivo:** Corregir captura de `constructor_id` y guardado de conversaciones NEXUS
**Estado:** ✅ LISTO PARA DEPLOY

---

## 📊 RESUMEN DE CAMBIOS

### 1. Funciones SQL Creadas/Actualizadas

| Archivo | Descripción | Status |
|---------|-------------|--------|
| `001_create_identify_prospect.sql` | Nueva función para identificar prospectos | ✅ Creado |
| `002_update_prospect_data_corrected.sql` | Función actualizada con Framework IAA | ✅ Creado |
| `003_test_tracking_functions.sql` | Suite completa de tests | ✅ Creado |

### 2. Código TypeScript Actualizado

| Archivo | Cambio | Status |
|---------|--------|--------|
| `src/app/api/nexus/route.ts` | Función `logConversationHibrida` corregida | ✅ Actualizado |
| `src/app/api/nexus/route.ts` | Llamada a `logConversationHibrida` con parámetros correctos | ✅ Actualizado |

---

## 🚀 PLAN DE DEPLOYMENT

### PASO 1: Backup (Seguridad)

```sql
-- Ejecutar en Supabase SQL Editor
-- Hacer backup de datos críticos antes de aplicar cambios

CREATE TABLE prospects_backup_20251017 AS
SELECT * FROM prospects;

SELECT COUNT(*) FROM prospects_backup_20251017;
-- Anotar el número para verificar después
```

### PASO 2: Aplicar Migraciones SQL

**Orden de ejecución:**

1. **Crear `identify_prospect`:**
   - Abrir archivo: `supabase/migrations/001_create_identify_prospect.sql`
   - Copiar TODO el contenido
   - Pegar en Supabase SQL Editor
   - Ejecutar (RUN)
   - Verificar que aparece mensaje: "Success"

2. **Actualizar `update_prospect_data`:**
   - Abrir archivo: `supabase/migrations/002_update_prospect_data_corrected.sql`
   - Copiar TODO el contenido
   - Pegar en Supabase SQL Editor
   - Ejecutar (RUN)
   - Verificar mensaje: "Success"

3. **Verificar que las funciones existen:**
   ```sql
   SELECT routine_name
   FROM information_schema.routines
   WHERE routine_name IN ('identify_prospect', 'update_prospect_data')
   AND routine_schema = 'public';
   ```

   **Resultado esperado:** 2 filas

### PASO 3: Ejecutar Tests

**Importante:** Antes de deployar el código TypeScript, DEBES verificar que las funciones SQL funcionan correctamente.

1. Abrir archivo: `supabase/migrations/003_test_tracking_functions.sql`
2. Ejecutar cada test **UNO POR UNO** (no todos juntos)
3. Verificar resultados según comentarios en el archivo

**Tests críticos:**
- ✅ TEST 2: Debe retornar `constructor_id` con UUID válido
- ✅ TEST 5: Debe cambiar stage de `iniciar` a `acoger`
- ✅ TEST 7: Debe cambiar stage de `acoger` a `activar`

**Si algún test falla:** NO continúes con el deployment. Reporta el error.

### PASO 4: Deploy del Código TypeScript

**Opción A: Deploy a producción (Vercel)**
```bash
cd /Users/luiscabrejo/CreaTuActivo-Marketing
git add .
git commit -m "🔧 Fix: Corregir sistema de tracking (constructor_id + nexus_conversations)"
git push origin main
```

Vercel detectará automáticamente el push y desplegará.

**Opción B: Test local primero (recomendado)**
```bash
npm run build
npm run dev
```

Luego visitar: `http://localhost:3000/fundadores/luis-cabrejo-parra-4871288`

### PASO 5: Verificación Post-Deploy

#### 5.1 Test de Constructor ID

1. Abrir modo incógnito
2. Visitar: `https://creatuactivo.com/fundadores/luis-cabrejo-parra-4871288`
3. Abrir DevTools → Console
4. Buscar mensaje: `✅ Constructor encontrado: luis-cabrejo-parra-4871288 -> UUID: ...`
5. En Supabase, ejecutar:
   ```sql
   SELECT *
   FROM prospects
   ORDER BY created_at DESC
   LIMIT 1;
   ```
6. Verificar que `constructor_id` NO es NULL

#### 5.2 Test de Conversaciones NEXUS

1. En la misma sesión, abrir el chat NEXUS
2. Enviar mensaje: "Hola, me llamo Juan Pérez"
3. En DevTools → Console, buscar:
   ```
   ✅ [NEXUS] Conversación guardada - Session: ...
   ```
4. En Supabase, ejecutar:
   ```sql
   SELECT *
   FROM nexus_conversations
   ORDER BY created_at DESC
   LIMIT 1;
   ```
5. Verificar que existe el registro con:
   - `fingerprint_id` poblado
   - `messages` con array de 2 objetos (user + assistant)
   - `metadata` con `documents_used`, `search_method`, etc.

#### 5.3 Test de Captura de Datos

1. Continuar conversación con NEXUS
2. Proporcionar: nombre, email y teléfono
3. En Supabase:
   ```sql
   SELECT
     fingerprint_id,
     stage,
     device_info
   FROM prospects
   WHERE fingerprint_id = (
     SELECT fingerprint_id
     FROM prospects
     ORDER BY created_at DESC
     LIMIT 1
   );
   ```
4. Verificar:
   - `stage` cambió a `acoger`
   - `device_info` tiene `nombre`, `email`, `telefono`

---

## 🐛 TROUBLESHOOTING

### Problema 1: "function identify_prospect does not exist"

**Causa:** La función no se creó correctamente en Supabase.

**Solución:**
1. Verificar que ejecutaste `001_create_identify_prospect.sql`
2. Verificar permisos:
   ```sql
   GRANT EXECUTE ON FUNCTION identify_prospect(TEXT, TEXT, JSONB) TO anon;
   ```

### Problema 2: constructor_id sigue siendo NULL

**Debugging:**
1. Verificar logs en Supabase:
   - Ir a: Supabase Dashboard → Database → Logs
   - Buscar: `[identify_prospect]`
2. Verificar que `luis-cabrejo-parra-4871288` existe en `private_users`:
   ```sql
   SELECT id, constructor_id, name, status
   FROM private_users
   WHERE constructor_id = 'luis-cabrejo-parra-4871288';
   ```
3. Si no existe, el UUID será NULL (comportamiento correcto)

### Problema 3: Conversaciones no se guardan

**Debugging:**
1. Verificar logs en browser console:
   - Buscar: `❌ [NEXUS] Error guardando conversación`
2. Verificar estructura de tabla:
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'nexus_conversations';
   ```
3. Debe tener:
   - `fingerprint_id` (text)
   - `session_id` (text)
   - `messages` (jsonb)
   - `metadata` (jsonb)

### Problema 4: Stage no avanza

**Debugging:**
1. Verificar logs de RPC:
   ```sql
   SELECT * FROM update_prospect_data(
     'tu-fingerprint-aqui',
     '{"nombre": "Test", "email": "test@test.com", "telefono": "3001234567"}'::jsonb
   );
   ```
2. Revisar campo `stage_updated` en respuesta
3. Si es `false`, verificar que los 3 campos estén completos

---

## 📈 MÉTRICAS DE ÉXITO

Después del deployment, verificar estas métricas en Supabase:

### KPI 1: Tasa de captura de constructor_id

```sql
SELECT
  COUNT(*) FILTER (WHERE constructor_id IS NOT NULL) as con_constructor,
  COUNT(*) FILTER (WHERE constructor_id IS NULL) as sin_constructor,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE constructor_id IS NOT NULL) / COUNT(*),
    2
  ) as porcentaje_captura
FROM prospects
WHERE created_at > '2025-10-17';  -- Después del fix
```

**Meta:** >80% de prospectos con `constructor_id` no NULL

### KPI 2: Tasa de guardado de conversaciones

```sql
SELECT
  COUNT(DISTINCT session_id) as sesiones_nexus,
  COUNT(*) as conversaciones_guardadas,
  ROUND(AVG(jsonb_array_length(messages) / 2.0), 2) as promedio_mensajes_por_sesion
FROM nexus_conversations
WHERE created_at > '2025-10-17';
```

**Meta:** >95% de interacciones guardadas

### KPI 3: Progresión de stages

```sql
SELECT
  stage,
  COUNT(*) as total,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as porcentaje
FROM prospects
WHERE created_at > '2025-10-17'
GROUP BY stage
ORDER BY
  CASE stage
    WHEN 'iniciar' THEN 1
    WHEN 'acoger' THEN 2
    WHEN 'activar' THEN 3
  END;
```

**Meta:** Distribución natural con conversión >20% a ACOGER

---

## 🔄 ROLLBACK PLAN (Si algo sale mal)

### Restaurar funciones antiguas

```sql
-- 1. Restaurar backup de prospects
DROP TABLE prospects;
ALTER TABLE prospects_backup_20251017 RENAME TO prospects;

-- 2. Eliminar funciones nuevas
DROP FUNCTION IF EXISTS identify_prospect(TEXT, TEXT, JSONB);
DROP FUNCTION IF EXISTS update_prospect_data(TEXT, JSONB);

-- 3. Restaurar código TypeScript
git revert HEAD
git push origin main
```

---

## ✅ CHECKLIST FINAL

Antes de marcar como completo:

- [ ] Backup de tabla `prospects` creado
- [ ] Función `identify_prospect` aplicada y testeada
- [ ] Función `update_prospect_data` aplicada y testeada
- [ ] Código TypeScript actualizado y deployed
- [ ] TEST 2 pasó (constructor_id capturado)
- [ ] TEST 5 pasó (stage iniciar → acoger)
- [ ] TEST 7 pasó (stage acoger → activar)
- [ ] Test E2E en producción completado
- [ ] Conversaciones NEXUS se guardan correctamente
- [ ] Métricas de éxito verificadas
- [ ] Documentación actualizada (este archivo)

---

## 📞 CONTACTO

**Para preguntas técnicas:**
- Revisar handoff: `HANDOFF_MARKETING_TRACKING.md` (en proyecto Dashboard)
- Revisar logs de Supabase: Database → Logs
- Revisar browser console en producción

**Archivos clave:**
- SQL: `supabase/migrations/00*.sql`
- TypeScript: `src/app/api/nexus/route.ts`
- Tracking: `public/tracking.js` (no modificado)
- Tests: `supabase/migrations/003_test_tracking_functions.sql`

---

**FIN DE LA IMPLEMENTACIÓN**

¡Buena suerte con el deployment! 🚀
