# FIX: Formulario /fundadores → Tabla prospects

**Fecha:** 2025-10-22
**Problema:** El formulario `/fundadores` guardaba datos en `pending_activations` pero NO actualizaba la tabla `prospects`, causando que el Dashboard no mostrara los datos.
**Solución:** Modificar API `/fundadores` para actualizar `prospects` usando el RPC `update_prospect_data`

---

## PROBLEMA IDENTIFICADO

### Síntomas
Al enviar el formulario `/fundadores`:
- ✅ Datos se guardaban en `pending_activations`
- ❌ Datos NO aparecían en Dashboard `/mi-sistema-iaa`
- ❌ Prospect quedaba en stage "INICIAR" sin datos
- ❌ Nombre mostraba "Sin nombre"
- ❌ Email, WhatsApp, Arquetipo y Paquete mostraban "-"

### Causa Raíz
El API `/fundadores/route.ts` solo guardaba en `pending_activations`. La tabla `prospects` (que lee el Dashboard) no se actualizaba.

**Flujo ANTES del fix:**
```
Usuario llena formulario
  ↓
POST /api/fundadores
  ↓
INSERT en pending_activations ✅
  ↓
Envío de emails ✅
  ↓
FIN (prospects NO se actualiza ❌)
```

---

## SOLUCIÓN IMPLEMENTADA

### Cambios en `src/app/api/fundadores/route.ts`

**Líneas 239-326:** Nuevo bloque de código que:

1. **Busca prospect existente** del constructor (últimos 5)
2. **Intenta encontrar el prospect correcto** usando 3 estrategias:
   - Estrategia 1: Por email en `device_info`
   - Estrategia 2: Por nombre parcial
   - Estrategia 3: Más reciente sin datos completos (últimos 30 min)
3. **Actualiza prospect con RPC** `update_prospect_data`:
   - Nombre completo
   - Email
   - Teléfono/WhatsApp
   - Arquetipo
   - Paquete (normalizado: inicial/empresarial/visionario)
   - Interest level: 10 (máximo, debería avanzar a ACOGER)
   - Consent granted: true
   - Form submitted: true + timestamp

**Flujo DESPUÉS del fix:**
```
Usuario llena formulario
  ↓
POST /api/fundadores
  ↓
INSERT en pending_activations ✅
  ↓
🆕 BUSCAR prospect en prospects (últimos 5 del constructor)
  ↓
🆕 ACTUALIZAR prospect con RPC update_prospect_data
  ↓  (nombre, email, phone, arquetipo, paquete, interest_level=10)
  ↓
🆕 RPC avanza stage INICIAR → ACOGER (si interest_level >= 7)
  ↓
Envío de emails ✅
  ↓
✅ Dashboard muestra datos completos
```

---

## CÓDIGO AGREGADO

```typescript
// ====================================================================
// 🎯 ACTUALIZAR TABLA PROSPECTS (para Dashboard Mi Sistema IAA)
// ====================================================================
console.log('\n🔍 [PROSPECTS] Buscando prospect existente del constructor...');

// Buscar prospect existente del constructor
const { data: existingProspects, error: prospectSearchError } = await supabase
  .from('prospects')
  .select('id, fingerprint_id, device_info, stage, created_at')
  .eq('constructor_id', invitedById)
  .order('created_at', { ascending: false })
  .limit(5);

// ... (3 estrategias de búsqueda)

if (targetProspect) {
  const prospectData = {
    name: formData.nombre.trim(),
    email: formData.email.toLowerCase().trim(),
    phone: formData.telefono.trim(),
    whatsapp: formData.telefono.trim(),
    archetype: formData.arquetipo || null,
    package: normalizedPlanType,
    interest_level: 10, // Formulario = máximo interés
    consent_granted: true,
    form_submitted: true,
    form_submitted_at: new Date().toISOString()
  };

  // Llamar al RPC update_prospect_data
  const { data: rpcResult, error: rpcError } = await supabase.rpc('update_prospect_data', {
    p_fingerprint_id: targetProspect.fingerprint_id,
    p_data: prospectData,
    p_constructor_id: invitedById
  });

  // Log resultado
  console.log('✅ [PROSPECTS] Prospect actualizado exitosamente!');
  console.log('✅ [PROSPECTS] Nuevo stage:', rpcResult?.stage);
  console.log('✅ [PROSPECTS] Avanzó a ACOGER:', rpcResult?.advanced);
}
```

---

## CÓMO PROBAR

### Paso 1: Reiniciar servidor Marketing

```bash
cd /Users/luiscabrejo/cta/CreaTuActivo-Marketing

# Matar procesos anteriores
pkill -9 -f "next dev"

# Iniciar servidor
npm run dev
```

**Verificar:** Debe estar corriendo en `http://localhost:3000`

---

### Paso 2: Limpiar BD (opcional pero recomendado)

```bash
cd /Users/luiscabrejo/cta/CreaTuActivo-Dashboard
node scripts/ejecutar-limpieza.js
```

---

### Paso 3: Crear constructor de prueba (si limpiaste BD)

En Supabase SQL Editor:

```sql
INSERT INTO private_users (
  id,
  email,
  name,
  constructor_id,
  whatsapp,
  gano_excel_id,
  status,
  role,
  first_login,
  invited_by,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'testconstructor@creatuactivo.com',
  'Test Constructor',
  'test-constructor-0001',
  '+573001234567',
  '12340001',
  'activo',
  'constructor',
  true,
  (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com'),
  NOW(),
  NOW()
) RETURNING id, email, name, constructor_id;
```

**Copiar el `id` (UUID) generado** - lo necesitarás para crear el prospect inicial.

---

### Paso 4: Crear prospect inicial (simula visita a página)

```sql
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
  'test-fingerprint-' || md5(random()::text),
  'UUID_DEL_CONSTRUCTOR_AQUI', -- ⚠️ REEMPLAZAR con UUID del Paso 3
  '{}'::jsonb, -- Sin datos inicialmente
  'iniciar',
  NOW(),
  NOW()
) RETURNING id, fingerprint_id;
```

**Anotar el `fingerprint_id` generado** (opcional, solo para debugging).

---

### Paso 5: Llenar formulario /fundadores

1. Abrir navegador en: `http://localhost:3000/fundadores/test-constructor-0001`
2. Llenar formulario:
   - Nombre: "Prueba Formulario"
   - Email: "prueba@test.com"
   - Teléfono: "3001234567"
   - Arquetipo: (seleccionar cualquiera)
   - Inversión: (seleccionar cualquiera)
3. Enviar

---

### Paso 6: Verificar logs del servidor

En la consola donde corre `npm run dev`, deberías ver:

```
🔍 [DB] Prospecto guardado exitosamente en BD!
🔍 [PROSPECTS] Buscando prospect existente del constructor...
🔍 [PROSPECTS] Encontrados 1 prospects del constructor
✅ [PROSPECTS] Prospect encontrado, actualizando...
🔍 [PROSPECTS] Fingerprint: test-fingerprint-xxxxx
🔍 [PROSPECTS] Stage actual: iniciar
✅ [PROSPECTS] Prospect actualizado exitosamente!
✅ [PROSPECTS] Nuevo stage: acoger
✅ [PROSPECTS] Avanzó a ACOGER: true
```

---

### Paso 7: Verificar en Dashboard

1. Login en: `https://app.creatuactivo.com/mi-sistema-iaa`
2. Con cuenta: `testconstructor@creatuactivo.com` (o la cuenta de prueba)
3. **Verificar tabla:**
   - ✅ NOMBRE: "Prueba Formulario"
   - ✅ EMAIL: "prueba@test.com"
   - ✅ WHATSAPP: "3001234567"
   - ✅ STAGE: "En ACOGER" (avanzó automáticamente)
   - ✅ ARQUETIPO: (el seleccionado)
   - ✅ PAQUETE: (el seleccionado)

---

### Paso 8: Verificar en Supabase

```sql
SELECT
  p.id,
  p.fingerprint_id,
  p.device_info->>'name' as nombre,
  p.device_info->>'email' as email,
  p.device_info->>'phone' as whatsapp,
  p.device_info->>'archetype' as arquetipo,
  p.device_info->>'package' as paquete,
  COALESCE((p.device_info->>'interest_level')::integer, 0) as interes,
  p.stage,
  p.created_at,
  p.updated_at
FROM prospects p
JOIN private_users pu ON p.constructor_id = pu.id
WHERE pu.constructor_id = 'test-constructor-0001'
ORDER BY p.created_at DESC;
```

**Resultado esperado:**
- nombre: "Prueba Formulario" ✅
- email: "prueba@test.com" ✅
- whatsapp: "+573001234567" ✅
- arquetipo: (el seleccionado) ✅
- paquete: "inicial" / "empresarial" / "visionario" ✅
- interes: 10 ✅
- stage: "acoger" ✅ (avanzó desde "iniciar")

---

## CASOS EDGE

### Caso 1: No hay prospect previo
**Comportamiento:** El código logea "No se encontró prospect existente para actualizar" pero NO crea uno nuevo.

**Razón:** El prospect se debe crear cuando el usuario interactúa con NEXUS, no cuando llena el formulario.

**Solución:** Está bien así. El formulario solo actualiza prospects existentes.

---

### Caso 2: Hay múltiples prospects del constructor
**Comportamiento:** El código busca en los últimos 5 y usa 3 estrategias (email, nombre, más reciente sin datos).

**Prioridad de estrategias:**
1. Match exacto por email ✅ (más confiable)
2. Match parcial por nombre ✅ (backup)
3. Más reciente sin datos (últimos 30 min) ✅ (último recurso)

---

### Caso 3: Formulario enviado múltiples veces
**Comportamiento:** `pending_activations` puede tener duplicados, pero `prospects` se actualiza con los datos más recientes.

**No es problema:** El RPC hace MERGE de datos, no sobrescribe.

---

## BENEFICIOS DEL FIX

1. ✅ **Dashboard muestra datos completos** de prospectos desde formulario
2. ✅ **Stage avanza automáticamente** INICIAR → ACOGER (interest_level = 10)
3. ✅ **Unifica flujos:** NEXUS + Formulario ambos actualizan `prospects`
4. ✅ **No duplica datos:** Busca prospect existente antes de actualizar
5. ✅ **Logging completo:** Fácil debugging con logs detallados
6. ✅ **Resiliente:** 3 estrategias de búsqueda + manejo de errores

---

## ARCHIVOS MODIFICADOS

- `/Users/luiscabrejo/cta/CreaTuActivo-Marketing/src/app/api/fundadores/route.ts`
  - Líneas agregadas: 239-326 (88 líneas)
  - Función afectada: `POST()`

---

## PRÓXIMOS PASOS

1. ✅ Reiniciar servidor Marketing
2. ✅ Probar con datos reales (constructor Luis Cabrejo)
3. ✅ Validar que stage avance a ACOGER
4. ✅ Verificar en Dashboard que datos aparezcan
5. 🔄 Aplicar mismo patrón a otras páginas si es necesario

---

## ROLLBACK (Si algo falla)

Para revertir cambios:

```bash
cd /Users/luiscabrejo/cta/CreaTuActivo-Marketing
git checkout src/app/api/fundadores/route.ts
```

O eliminar las líneas 239-326 manualmente.

---

**Última actualización:** 2025-10-22 14:30
**Autor:** Claude Code
**Status:** ✅ Implementado - Pendiente de testing
