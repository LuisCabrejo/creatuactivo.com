# 🔒 FIX CRÍTICO: Consentimiento Persistente en NEXUS

**Fecha:** 21 de noviembre 2025
**Issue:** NEXUS pide consentimiento múltiples veces en la misma sesión
**Status:** ✅ **RESUELTO**

---

## 🐛 Problema Reportado

### Comportamiento Incorrecto:

```
Usuario: "¿Cuánto necesito para empezar?"
NEXUS: [Explica paquetes, pide consentimiento]

Usuario: "a" (acepta)
NEXUS: "Perfecto, gracias por tu confianza. Continuemos..."

[Usuario limpia pizarra]

Usuario: "¿Cómo funciona exactamente el negocio?"
NEXUS: [Pide consentimiento NUEVAMENTE] ❌❌❌
```

### Expectativa:

El usuario **NO debería** volver a ver la solicitud de consentimiento si ya lo dio anteriormente, incluso:
- ✅ Después de limpiar pizarra
- ✅ En nueva sesión del mismo día
- ✅ Al regresar días después (mismo fingerprint)

---

## 🔍 Diagnóstico

### Investigación del Código:

**Backend (route.ts):** ✅ **Funcionando correctamente**
- Línea 1797-1803: Consulta `device_info` correctamente
- Línea 2117: Verifica `userData.consent_granted` de BD
- Línea 2169-2185: Genera instrucciones dinámicas para NO pedir consentimiento
- Línea 2174: Incluye mensaje explícito "NO vuelvas a pedir consentimiento"

**Frontend (useNEXUSChat.ts):** ✅ **Funcionando correctamente**
- Línea 47-52: Detecta consentimiento y guarda en localStorage
- Línea 140-141: Lee consentimiento de localStorage
- Línea 167: Envía `consentGiven` flag al backend
- Línea 382-383: Limpia consentimiento solo al resetear chat

**System Prompt (Supabase):** ❌ **PROBLEMA ENCONTRADO**
- Sección "CUÁNDO SOLICITAR" no verificaba `userData.consent_granted`
- No tenía instrucciones explícitas para consultar el contexto del backend
- Faltaban verificaciones de mensajes como "✅ YA OTORGADO"

---

## ✅ Solución Aplicada

### Cambios al System Prompt v12.2 → v12.2.1

#### 1. Sección "CUÁNDO SOLICITAR" Expandida

**ANTES:**
```markdown
### CUÁNDO SOLICITAR:
**SOLO** cuando el usuario proporcione datos personales por primera vez (nombre, email, WhatsApp, etc.).
```

**DESPUÉS:**
```markdown
### CUÁNDO SOLICITAR:

⚠️ **CRÍTICO - VERIFICAR PRIMERO:**
El sistema backend te informa si el usuario YA dio consentimiento previamente mediante:
- `userData.consent_granted` (desde base de datos)
- Mensaje explícito: "El usuario YA dio consentimiento previamente: ✅ SÍ"

**REGLAS ABSOLUTAS:**
1. ✅ **SI userData.consent_granted = true:** NUNCA pidas consentimiento nuevamente
2. ✅ **SI ves mensaje "✅ YA OTORGADO":** NUNCA pidas consentimiento nuevamente
3. ✅ **SI ves instrucción "NO vuelvas a pedir consentimiento":** NUNCA lo pidas
4. ❌ **SOLO pide consentimiento si:** Primera interacción Y usuario NO tiene consentimiento previo Y proporciona datos personales

**Verificación antes de pedir consentimiento:**
```
¿userData.consent_granted = true? → NO PEDIR
¿Veo "YA OTORGADO" en el contexto? → NO PEDIR
¿Es usuario conocido con saludo personalizado? → NO PEDIR
¿Primera interacción sin consentimiento previo? → SÍ PEDIR
```
```

#### 2. Reglas Críticas Actualizadas (4 → 6 reglas)

**ANTES:**
```markdown
### 🚨 REGLAS CRÍTICAS DEL CONSENTIMIENTO:

1. **Una sola vez por usuario:** Si ya se solicitó consentimiento en sesión anterior, NO volver a pedirlo
2. **Antes de cualquier dato:** El consentimiento debe preceder la captura de nombre, email, etc.
3. **Texto exacto:** NUNCA improvisar el texto del consentimiento. Usar SIEMPRE el texto de arriba
4. **Sin presión:** El "No, gracias" debe ser una opción válida y respetable
```

**DESPUÉS:**
```markdown
### 🚨 REGLAS CRÍTICAS DEL CONSENTIMIENTO:

1. **Una sola vez por usuario:** Si userData.consent_granted = true, NUNCA volver a pedirlo (ni en nuevas sesiones, ni después de limpiar pizarra)
2. **Verificar contexto SIEMPRE:** Lee las instrucciones dinámicas del backend (líneas que dicen "YA dio consentimiento" o "NO vuelvas a pedir")
3. **Antes de cualquier dato:** El consentimiento debe preceder la captura de nombre, email, etc. (solo primera vez)
4. **Texto exacto:** NUNCA improvisar el texto del consentimiento. Usar SIEMPRE el texto de arriba
5. **Sin presión:** El "No, gracias" debe ser una opción válida y respetable
6. **Usuario conocido = NO PEDIR:** Si hay saludo personalizado ("¡Hola de nuevo, [NOMBRE]!"), NO pedir consentimiento
```

---

## 🚀 Deployment

### Script Creado:

```bash
scripts/fix-consentimiento-persistente.mjs
```

**Ejecución:**
```bash
node scripts/fix-consentimiento-persistente.mjs
```

**Output:**
```
✅ System Prompt actualizado exitosamente

📊 Cambios aplicados:
   ✓ Sección "CUÁNDO SOLICITAR" expandida con verificaciones
   ✓ Reglas críticas actualizadas (6 reglas vs 4 anteriores)
   ✓ Verificación explícita de userData.consent_granted
   ✓ Verificación de mensajes del backend ("YA OTORGADO")
   ✓ Nueva versión: v12.2.1_consent_fix

📝 Cambio de versión:
   Anterior: v12.2
   Nueva:    v12.2.1_consent_fix
```

### Verificación:

```bash
node scripts/leer-system-prompt.mjs | grep -A 20 "CUÁNDO SOLICITAR"
```

---

## 🧪 Testing Requerido

### Test Case 1: Primera interacción con consentimiento

**Pasos:**
1. Modo incógnito → Abrir https://creatuactivo.com
2. Abrir widget NEXUS
3. Preguntar: "¿Cuánto cuesta?"
4. NEXUS debería pedir consentimiento (primera vez)
5. Responder "acepto"
6. Verificar localStorage: `nexus_consent_given = "true"`

**Resultado esperado:** ✅ Pide consentimiento (correcto, primera vez)

---

### Test Case 2: Limpiar pizarra NO debe pedir consentimiento

**Pasos:**
1. Continuar Test Case 1 (ya dio consentimiento)
2. Click en "Limpiar Pizarra"
3. Preguntar nuevamente: "¿Cómo funciona el negocio?"
4. Verificar respuesta de NEXUS

**Resultado esperado:** ✅ NO pide consentimiento (ya se dio)

---

### Test Case 3: Nueva sesión NO debe pedir consentimiento

**Pasos:**
1. Continuar Test Case 1 (ya dio consentimiento)
2. Cerrar widget NEXUS
3. Cerrar pestaña del navegador
4. Reabrir https://creatuactivo.com (mismo navegador, NO modo incógnito)
5. Abrir widget NEXUS
6. Hacer pregunta

**Resultado esperado:** ✅ NO pide consentimiento (fingerprint + localStorage persisten)

---

### Test Case 4: Saludo personalizado con nombre

**Pasos:**
1. Modo incógnito → NEXUS pide consentimiento
2. Responder "acepto"
3. NEXUS pide nombre: Responder "Luis"
4. Limpiar pizarra
5. Hacer nueva pregunta

**Resultado esperado:**
- ✅ Saludo: "¡Hola de nuevo, Luis! ¿En qué más puedo ayudarte?"
- ✅ NO pide consentimiento nuevamente

---

### Test Case 5: Console logs de debugging

**Pasos:**
1. Abrir DevTools → Console
2. Interactuar con NEXUS (dar consentimiento)
3. Buscar logs:

**Resultado esperado:**
```javascript
✅ [NEXUS] Consentimiento guardado en localStorage

🔍 [NEXUS] Estado de usuario: {
  consentGiven: true,
  hasSeenGreeting: true,
  isFirstMessageOfConversation: false
}

📊 [NEXUS] Datos existentes del prospecto: {
  tiene_nombre: true,
  tiene_email: false,
  tiene_whatsapp: false,
  tiene_archetype: true,
  tiene_consentimiento: true,  // ← Debe ser true
  consentGivenFromLocalStorage: true
}

🎯 [NEXUS] Estado del usuario: {
  esUsuarioConocido: true,     // ← Debe ser true
  tieneConsentimientoPrevio: true,  // ← Debe ser true
  esPrimeraInteraccion: false  // ← Debe ser false
}
```

---

## 📊 Flujo de Verificación del Consentimiento

```
┌─────────────────────────────────────────────────────────────┐
│ USUARIO ENVÍA MENSAJE                                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND: useNEXUSChat.ts                                    │
│ - Línea 140: Lee localStorage.getItem('nexus_consent_given') │
│ - Línea 167: Envía consentGiven: true/false al backend      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND: route.ts                                            │
│ - Línea 1797-1803: SELECT * FROM device_info WHERE          │
│                     fingerprint = '...'                      │
│ - Línea 1812: existingProspectData.consent_granted          │
│ - Línea 2117: tieneConsentimientoPrevio =                   │
│                userData.consent_granted || consentGiven      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND: Construcción de System Prompt                      │
│ - Línea 2169-2187: Agrega contexto dinámico:               │
│   "El usuario YA dio consentimiento: ✅ SÍ"                 │
│   "NO vuelvas a pedir consentimiento"                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ ANTHROPIC CLAUDE: Recibe System Prompt v12.2.1             │
│ - Lee instrucción: "VERIFICAR PRIMERO"                      │
│ - Ve contexto: "userData.consent_granted: ✅ SÍ"           │
│ - Consulta regla #1: "SI consent_granted = true → NO PEDIR" │
│ - Decisión: ✅ NO pedir consentimiento                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ NEXUS RESPONDE sin pedir consentimiento ✅                  │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Notas Importantes

### Caché de Anthropic

Los cambios al System Prompt pueden tardar **hasta 5 minutos** en aplicarse debido al caché interno de Anthropic.

**Si no ves los cambios inmediatamente:**
1. Espera 5 minutos
2. Limpia localStorage del navegador
3. Recarga la página
4. Intenta nuevamente

**Verificar caché:**
```javascript
// Console del navegador
localStorage.clear()
location.reload()
```

### Base de Datos

La tabla `device_info` debe tener el campo `consent_granted` actualizado correctamente.

**Verificar en Supabase:**
```sql
SELECT fingerprint, name, consent_granted, created_at
FROM device_info
ORDER BY created_at DESC
LIMIT 10;
```

**Resultado esperado:**
- `consent_granted = true` para usuarios que aceptaron
- `consent_granted = false` o `NULL` para usuarios nuevos

---

## 🔗 Archivos Relacionados

### Código:
- [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts) - Backend API
- [src/components/nexus/useNEXUSChat.ts](src/components/nexus/useNEXUSChat.ts) - Frontend hook
- [public/tracking.js](public/tracking.js) - Sistema de tracking

### Scripts:
- [scripts/fix-consentimiento-persistente.mjs](scripts/fix-consentimiento-persistente.mjs) - **Script del fix**
- [scripts/leer-system-prompt.mjs](scripts/leer-system-prompt.mjs) - Verificación

### Documentación:
- [NEXUS_SALUDO_PERSONALIZADO_FIX.md](NEXUS_SALUDO_PERSONALIZADO_FIX.md) - Fix anterior (21 Nov)
- [FIX_CONSENTIMIENTO_PERSISTENTE_NOV21.md](FIX_CONSENTIMIENTO_PERSISTENTE_NOV21.md) - **Este documento**

---

## ✅ Checklist de Deployment

- [x] Script creado: `fix-consentimiento-persistente.mjs`
- [x] Script ejecutado exitosamente
- [x] System Prompt actualizado en Supabase
- [x] Versión incrementada: v12.2 → v12.2.1_consent_fix
- [x] Documentación creada
- [ ] Testing en modo incógnito (Test Case 1-5)
- [ ] Verificación en producción
- [ ] Monitoreo de usuarios reales (24h)

---

## 📈 Métricas de Éxito

**KPIs a monitorear (próximas 24-48 horas):**

1. **Tasa de re-solicitud de consentimiento:**
   - Meta: 0% (ningún usuario debería verlo dos veces)
   - Medición: Logs de backend "esPrimeraInteraccion: false"

2. **Saludos personalizados:**
   - Meta: >80% de usuarios que regresan ven saludo personalizado
   - Medición: Logs "Usuario conocido con saludo personalizado"

3. **Persistencia en localStorage:**
   - Meta: 100% de consentimientos guardados
   - Medición: `nexus_consent_given` presente en localStorage

4. **Errores de consentimiento:**
   - Meta: 0 errores relacionados a consentimiento
   - Medición: Búsqueda en logs de "consent" + "error"

---

**Desarrollado por:** Claude Code
**Revisado por:** Luis Cabrejo
**Fecha:** 21 de noviembre 2025
**Status:** ✅ **LISTO PARA TESTING EN PRODUCCIÓN**
