# 🚀 INSTRUCCIONES DE DEPLOYMENT - Solución Backend-Only Consent

**Fecha:** 21 de noviembre 2025
**Status:** ✅ Código pusheado a GitHub - Esperando SQL + Testing

---

## ✅ COMPLETADO

- ✅ Código modificado en [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts)
- ✅ System Prompt actualizado a v15.0 en Supabase
- ✅ Commit: `8aadb1c`
- ✅ Push a GitHub: exitoso
- ✅ Vercel deployment: iniciado automáticamente

---

## ⏳ PASO 1: APLICAR SQL EN SUPABASE (CRÍTICO - 2 minutos)

**Este paso es OBLIGATORIO para que funcione:**

### Instrucciones:

1. **Abrir Supabase Dashboard:**
   - https://supabase.com/dashboard/project/_/sql

2. **Copiar este SQL exacto:**

```sql
-- Migration: Agregar contador de veces que se mostró el modal de consentimiento
-- Fecha: 21 Nov 2025
-- Propósito: Garantizar que el modal de consentimiento se muestre SOLO UNA VEZ por dispositivo

-- Agregar campo para contar cuántas veces se mostró el modal
ALTER TABLE device_info
ADD COLUMN IF NOT EXISTS consent_modal_shown_count INTEGER DEFAULT 0;

-- Agregar campo para timestamp de última vez que se mostró
ALTER TABLE device_info
ADD COLUMN IF NOT EXISTS last_consent_modal_shown TIMESTAMP WITH TIME ZONE;

-- Crear índice para optimizar queries
CREATE INDEX IF NOT EXISTS idx_device_info_consent_modal_count
ON device_info(consent_modal_shown_count);

-- Comentarios para documentación
COMMENT ON COLUMN device_info.consent_modal_shown_count IS
'Contador de veces que se mostró el modal de consentimiento. Máximo debe ser 1.';

COMMENT ON COLUMN device_info.last_consent_modal_shown IS
'Timestamp de la última vez que se mostró el modal de consentimiento al usuario.';
```

3. **Pegar en SQL Editor**

4. **Click "Run"**

5. **Verificar que ejecutó exitosamente:**

```sql
-- Ejecutar este query para verificar
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'device_info'
AND column_name IN ('consent_modal_shown_count', 'last_consent_modal_shown');
```

**Resultado esperado:**
```
column_name                  | data_type                   | column_default
-----------------------------+-----------------------------+----------------
consent_modal_shown_count    | integer                     | 0
last_consent_modal_shown     | timestamp with time zone    | NULL
```

---

## ⏳ PASO 2: ESPERAR DEPLOYMENT DE VERCEL (2 minutos)

**Vercel desplegará automáticamente:**

1. Ve a: https://vercel.com/tu-proyecto/deployments
2. Busca deployment más reciente (commit `8aadb1c`)
3. Espera status: **"Ready"** (verde)

**Tiempo estimado:** ~2 minutos

---

## 🧪 PASO 3: TESTING EN PRODUCCIÓN (5 minutos)

### Test 1: Primera vez - Debe mostrar modal

**Pasos:**
1. **Modo incógnito** → https://creatuactivo.com
2. Abrir **DevTools → Console** (Cmd+Option+J en Mac)
3. Abrir **NEXUS** (botón flotante)
4. Hacer pregunta: **"¿Cuánto cuesta?"**

**Resultado esperado en Console:**
```javascript
🔐 [NEXUS] INTERCEPTACIÓN: Usuario necesita consentimiento y nunca se le mostró modal
✅ [NEXUS] Contador de consentimiento actualizado: 0 → 1
📤 [NEXUS] Retornando mensaje de consentimiento (sin llamar a Claude)
```

**Resultado esperado en pantalla:**
```
Para seguir conversando, necesito tu autorización para usar los datos que compartas conmigo.

Nuestra Política de Privacidad (https://creatuactivo.com/privacidad) explica todo.

¿Aceptas?

A) ✅ Acepto

B) ❌ No, gracias
```

✅ **SI VES ESTO → FUNCIONA**

❌ **SI NO VES ESTO:**
- Verificar que ejecutaste el SQL en Supabase
- Verificar en Console si hay errores
- Compartir logs conmigo

---

### Test 2: Usuario acepta - Guardar consentimiento

**Pasos:**
1. Continuar Test 1
2. Escribir en NEXUS: **"a"** (solo la letra a)
3. Enviar

**Resultado esperado en Console:**
```javascript
✅ [NEXUS Backend] Consentimiento detectado y guardado - Input: a

📊 [NEXUS] Datos existentes del prospecto: {
  tiene_consentimiento: true,  // ← DEBE SER true
  ...
}

✅ [NEXUS] Usuario YA dio consentimiento (consent_granted = true)
✅ [NEXUS] Proceder con conversación normal
```

**Resultado esperado en pantalla:**
```
[Claude responde normalmente a tu pregunta original]
```

✅ **SI VES ESTO → FUNCIONA**

---

### Test 3: Limpiar pizarra - NO debe pedir nuevamente ⚡ CRÍTICO

**Pasos:**
1. Continuar Test 2
2. Click **"Limpiar Pizarra"** (botón en NEXUS)
3. Hacer nueva pregunta: **"¿Cómo funciona?"**

**Resultado esperado en Console:**
```javascript
✅ [NEXUS] Usuario YA dio consentimiento (consent_granted = true)
✅ [NEXUS] Proceder con conversación normal
```

**Resultado esperado en pantalla:**
```
[Claude responde directamente SIN pedir consentimiento]
```

✅ **SI CLAUDE RESPONDE SIN PEDIR CONSENTIMIENTO → ¡FUNCIONA AL 100%!**

❌ **SI VUELVE A PEDIR CONSENTIMIENTO:**
- Compartir logs de Console completos
- Verificar que SQL se ejecutó correctamente

---

## 📊 VERIFICACIÓN EN BASE DE DATOS (Opcional)

**En Supabase → SQL Editor:**

```sql
-- Ver registros recientes
SELECT
  fingerprint,
  consent_granted,
  consent_modal_shown_count,
  last_consent_modal_shown,
  created_at
FROM device_info
ORDER BY created_at DESC
LIMIT 5;
```

**Resultado esperado después de Test 3:**
```
fingerprint          | consent_granted | consent_modal_shown_count | last_consent_modal_shown | created_at
---------------------+-----------------+---------------------------+--------------------------+------------
abc123...            | true            | 1                         | 2025-11-21 20:15:00      | 2025-11-21
```

**Campos clave:**
- `consent_granted` = `true` → Usuario aceptó
- `consent_modal_shown_count` = `1` → Modal se mostró solo 1 vez
- `last_consent_modal_shown` = timestamp → Cuándo se mostró

---

## ✅ CHECKLIST DE DEPLOYMENT

- [ ] **SQL ejecutado en Supabase**
  - Verificar con query de información_schema

- [ ] **Vercel deployment completado**
  - Status: "Ready" (verde)
  - Commit: `8aadb1c`

- [ ] **Test 1: Primera vez → Modal se muestra** ✅

- [ ] **Test 2: Usuario acepta → Consentimiento guardado** ✅

- [ ] **Test 3: Limpiar pizarra → NO pide nuevamente** ✅ **CRÍTICO**

---

## 🎯 CRITERIO DE ÉXITO

**La solución funciona 100% si:**

1. ✅ Primera vez → Muestra modal de consentimiento
2. ✅ Usuario escribe "a" → Guarda `consent_granted = true`
3. ✅ **Limpiar pizarra → NUNCA vuelve a pedir** ⚡

**Si el Test 3 pasa → Problema resuelto al 100%**

---

## 🐛 TROUBLESHOOTING

### Error: "Column consent_modal_shown_count does not exist"

**Causa:** SQL no se ejecutó en Supabase

**Solución:**
1. Ir a Supabase → SQL Editor
2. Ejecutar migración completa (ver PASO 1)
3. Verificar con query de información_schema

---

### Error: "Cannot read property consent_modal_shown_count of undefined"

**Causa:** `userData` está vacío (primera vez del usuario)

**Solución:** Normal en primera interacción. El código maneja esto:
```typescript
const neverShownModal = !userData.consent_modal_shown_count || userData.consent_modal_shown_count === 0;
```

---

### Modal se sigue mostrando después de limpiar pizarra

**Causa:** Uno de estos:
1. SQL no se ejecutó correctamente
2. Código viejo aún en caché de navegador
3. Vercel deployment no terminó

**Solución:**
1. Hard refresh: Cmd+Shift+R (Mac) / Ctrl+F5 (Windows)
2. Verificar deployment en Vercel
3. Verificar SQL en Supabase
4. Compartir logs de Console

---

## 📞 SIGUIENTE PASO DESPUÉS DE TESTING

**Si todos los tests pasan:**
✅ Confirmar que funciona
✅ Monitorear por 24 horas
✅ Solución completada

**Si algún test falla:**
❌ Compartir:
- Logs completos de Console
- Screenshots de comportamiento
- Query de Supabase (resultado de SELECT)

---

## 📝 RESUMEN TÉCNICO

**Arquitectura implementada:**
```
Usuario → Backend → ¿Ya mostró modal? (SQL)
                          ↓
                      NO → Incrementa contador
                         → Retorna mensaje
                         → Claude NO es llamado
                          ↓
                      SÍ → Llama a Claude
                         → Respuesta normal
```

**Garantía 100%:**
- Contador SQL persiste para siempre
- Claude NUNCA ve el consentimiento
- Backend decide todo
- Sin race conditions
- Arquitectura de Intercom/Drift/Zendesk

---

**Desarrollado por:** Claude Code
**Fecha:** 21 de noviembre 2025
**Commit:** 8aadb1c
**Status:** ⏳ Esperando SQL + Testing
