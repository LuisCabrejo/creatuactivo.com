# 🧪 TEST: Fix de Consentimiento Persistente

**Fecha:** 21 de noviembre 2025
**Issue:** `consentGiven: false` incluso después de aceptar
**Root Cause:** Regex de detección **NO capturaba "a" sola**

---

## 🐛 Problema Encontrado en Logs

```javascript
🔍 [NEXUS] Estado de usuario: {
  consentGiven: false,  // ← ❌ SIEMPRE false
  consentTimestamp: 'nunca',
  hasSeenGreeting: true
}
```

**Causa raíz:** El regex en `useNEXUSChat.ts:48` era:

```typescript
// ❌ ANTES (NO funcionaba)
const isAcceptingConsent = /acepto|aceptas|a\)/i.test(content);
```

Este regex **NO coincidía** con `"a"` sola porque busca:
- `acepto` ❌
- `aceptas` ❌
- `a)` (literal "a" + paréntesis) ❌

Cuando el usuario escribe `"a"`, **ninguna** de estas opciones coincide.

---

## ✅ Fix Aplicado

### Archivo: `src/components/nexus/useNEXUSChat.ts`

**Líneas 47-66:**

```typescript
// ✅ DESPUÉS (Mejorado)
const normalizedContent = content.trim().toLowerCase();
const isAcceptingConsent =
  /^acepto$/i.test(normalizedContent) ||      // "acepto" exacto
  /^a$/i.test(normalizedContent) ||           // "a" sola ← FIX CRÍTICO
  /^a\)$/i.test(normalizedContent) ||         // "a)" exacto
  /^si$/i.test(normalizedContent) ||          // "si" exacto
  /^sí$/i.test(normalizedContent) ||          // "sí" con acento
  /acepto/i.test(normalizedContent) ||        // contiene "acepto"
  /aceptar/i.test(normalizedContent) ||       // contiene "aceptar"
  /✅/.test(content) ||                        // emoji de check
  /opcion\s*a/i.test(normalizedContent) ||    // "opcion a"
  /opción\s*a/i.test(normalizedContent);      // "opción a" con acento

if (isAcceptingConsent) {
  localStorage.setItem('nexus_consent_given', 'true');
  localStorage.setItem('nexus_consent_timestamp', Date.now().toString());
  console.log('✅ [NEXUS] Consentimiento guardado en localStorage - Input:', content);
}
```

**Cambios clave:**
1. ✅ Normalización: `content.trim().toLowerCase()`
2. ✅ Detección de "a" sola: `/^a$/i.test(normalizedContent)`
3. ✅ Múltiples variaciones: "si", "sí", "acepto", "aceptar", etc.
4. ✅ Log mejorado: Ahora muestra el input del usuario

---

## 🧪 Test Cases

### Test 1: Usuario escribe "a"

**Input del usuario:** `"a"`

**Resultado esperado:**
```javascript
✅ [NEXUS] Consentimiento guardado en localStorage - Input: a

🔍 [NEXUS] Estado de usuario: {
  consentGiven: true,  // ← ✅ Debe ser true
  consentTimestamp: '1732204800000',
  hasSeenGreeting: true
}
```

**Verificación en localStorage:**
```javascript
localStorage.getItem('nexus_consent_given')  // → "true"
localStorage.getItem('nexus_consent_timestamp')  // → "1732204800000"
```

---

### Test 2: Usuario escribe "acepto"

**Input del usuario:** `"acepto"`

**Resultado esperado:**
```javascript
✅ [NEXUS] Consentimiento guardado en localStorage - Input: acepto

consentGiven: true  // ✅
```

---

### Test 3: Usuario escribe "si"

**Input del usuario:** `"si"` o `"sí"`

**Resultado esperado:**
```javascript
✅ [NEXUS] Consentimiento guardado en localStorage - Input: si

consentGiven: true  // ✅
```

---

### Test 4: Usuario escribe "A)" (opción A)

**Input del usuario:** `"A)"`

**Resultado esperado:**
```javascript
✅ [NEXUS] Consentimiento guardado en localStorage - Input: A)

consentGiven: true  // ✅
```

---

### Test 5: Usuario escribe con espacios " a "

**Input del usuario:** `" a "` (con espacios)

**Resultado esperado:**
```javascript
✅ [NEXUS] Consentimiento guardado en localStorage - Input:  a

consentGiven: true  // ✅ (gracias a trim())
```

---

## 🔄 Flujo Completo Después del Fix

```
┌─────────────────────────────────────────────────────┐
│ NEXUS pregunta:                                      │
│ "¿Aceptas?"                                          │
│ A) ✅ Acepto                                         │
│ B) ❌ No, gracias                                    │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ Usuario escribe: "a"                                 │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ useNEXUSChat.ts - sendMessage()                      │
│ - Normaliza: "a".trim().toLowerCase() = "a"         │
│ - Regex: /^a$/i.test("a") = TRUE ✅                 │
│ - Guarda localStorage:                               │
│   - nexus_consent_given = "true"                    │
│   - nexus_consent_timestamp = "1732204800000"       │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ Siguiente mensaje (después de limpiar pizarra)      │
│ - Lee localStorage                                   │
│ - consentGiven = true ✅                            │
│ - Envía al backend: { consentGiven: true }          │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ Backend route.ts                                     │
│ - Recibe: consentGiven = true                       │
│ - Consulta device_info.consent_granted              │
│ - tieneConsentimientoPrevio = true ✅               │
│ - System Prompt: "NO vuelvas a pedir consentimiento"│
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ Claude v12.2.1_consent_fix                          │
│ - Lee instrucción: userData.consent_granted = true  │
│ - Regla #1: "SI consent_granted = true → NO PEDIR"  │
│ - ✅ NO pide consentimiento                         │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment

### Archivo modificado:
- ✅ [src/components/nexus/useNEXUSChat.ts](src/components/nexus/useNEXUSChat.ts) (líneas 47-66)

### Verificación pre-deploy:
```bash
# 1. Verificar cambios
git diff src/components/nexus/useNEXUSChat.ts

# 2. Compilar para verificar TypeScript
npm run build

# 3. Verificar en local
npm run dev
```

### Testing local:

**Pasos:**
1. http://localhost:3000
2. Abrir DevTools → Console
3. Abrir NEXUS widget
4. Preguntar: "¿Cuánto cuesta?"
5. NEXUS pide consentimiento
6. Escribir: **"a"** (solo la letra a)
7. **Verificar log:**
   ```
   ✅ [NEXUS] Consentimiento guardado en localStorage - Input: a
   ```
8. **Verificar localStorage:**
   ```javascript
   localStorage.getItem('nexus_consent_given')  // → "true"
   ```
9. Click "Limpiar Pizarra"
10. Hacer nueva pregunta
11. **Verificar log:**
    ```
    🔍 [NEXUS] Estado de usuario: {
      consentGiven: true,  // ← ✅ Debe ser true
      ...
    }
    ```
12. ✅ **NEXUS NO debe pedir consentimiento nuevamente**

---

## 📊 Comparación: Antes vs Después

| Input Usuario | ANTES (Regex antiguo) | DESPUÉS (Regex mejorado) |
|---------------|----------------------|--------------------------|
| `"a"` | ❌ NO detecta | ✅ DETECTA |
| `"A"` | ❌ NO detecta | ✅ DETECTA |
| `" a "` | ❌ NO detecta | ✅ DETECTA (trim) |
| `"acepto"` | ✅ DETECTA | ✅ DETECTA |
| `"a)"` | ✅ DETECTA | ✅ DETECTA |
| `"si"` | ❌ NO detecta | ✅ DETECTA |
| `"sí"` | ❌ NO detecta | ✅ DETECTA |
| `"aceptar"` | ❌ NO detecta | ✅ DETECTA |
| `"✅"` | ❌ NO detecta | ✅ DETECTA |
| `"opcion a"` | ❌ NO detecta | ✅ DETECTA |

---

## ⚠️ Edge Cases Manejados

### 1. Mayúsculas/Minúsculas
```typescript
"A" → normalizedContent = "a" → /^a$/i → ✅ Detecta
"ACEPTO" → normalizedContent = "acepto" → /^acepto$/i → ✅ Detecta
```

### 2. Espacios en blanco
```typescript
"  a  " → content.trim() = "a" → /^a$/i → ✅ Detecta
```

### 3. Acentos
```typescript
"sí" → /^sí$/i → ✅ Detecta (regex específico)
"opción a" → /opción\s*a/i → ✅ Detecta
```

### 4. Emojis
```typescript
"✅" → /✅/ → ✅ Detecta
"a ✅" → /✅/ → ✅ Detecta
```

---

## 🔍 Debugging

### Si el consentimiento NO se guarda:

**1. Verificar logs en Console:**
```javascript
// Debe aparecer al enviar "a"
✅ [NEXUS] Consentimiento guardado en localStorage - Input: a
```

**Si NO aparece:** El regex no está detectando el input.

**2. Verificar localStorage manualmente:**
```javascript
// En Console del navegador
localStorage.getItem('nexus_consent_given')
// Debe retornar: "true"
```

**Si retorna `null`:** El consentimiento no se está guardando.

**3. Test manual del regex:**
```javascript
// En Console del navegador
const content = "a";
const normalizedContent = content.trim().toLowerCase();
const isAcceptingConsent = /^a$/i.test(normalizedContent);
console.log(isAcceptingConsent);  // Debe ser: true
```

**4. Verificar versión del código:**
```bash
# Ver líneas 47-66 de useNEXUSChat.ts
head -66 src/components/nexus/useNEXUSChat.ts | tail -20
```

Debe contener el regex mejorado con múltiples condiciones.

---

## 📈 Métricas de Éxito

**KPIs a monitorear (próximas 24 horas):**

1. **Tasa de captura de consentimiento:**
   - Meta: 100% cuando usuario escribe "a"
   - Medición: Log "Consentimiento guardado" aparece

2. **Persistencia en localStorage:**
   - Meta: `nexus_consent_given = "true"` después de aceptar
   - Medición: Inspección manual de localStorage

3. **NO re-solicitud de consentimiento:**
   - Meta: 0% de usuarios ven solicitud dos veces
   - Medición: Logs "consentGiven: true" en segunda interacción

4. **Variaciones de input aceptadas:**
   - Meta: "a", "acepto", "si", "sí", "✅", etc. todas funcionan
   - Medición: Tests manuales con diferentes inputs

---

## ✅ Checklist de Testing

### Pre-deploy:
- [x] Código modificado en `useNEXUSChat.ts`
- [x] Regex mejorado implementado
- [x] Log de debugging agregado
- [ ] Build exitoso (`npm run build`)
- [ ] Test local con input "a"
- [ ] Verificación en localStorage

### Post-deploy:
- [ ] Test en producción (modo incógnito)
- [ ] Verificar log "Consentimiento guardado"
- [ ] Verificar `consentGiven: true` en segunda interacción
- [ ] Confirmar que NO pide consentimiento dos veces
- [ ] Test con diferentes variaciones ("a", "acepto", "si")

---

**Status:** 🟡 **Código modificado - Pendiente testing local**
**Próximo paso:** Ejecutar `npm run dev` y probar con input "a"
