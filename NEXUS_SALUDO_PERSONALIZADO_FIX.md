# 🎯 NEXUS - Saludo Personalizado y Consentimiento Persistente

**Fecha:** 2025-11-21
**Issues Reportados:**
1. ❌ Consentimiento se pedía repetidamente después de "Limpiar Pizarra"
2. ❌ Saludo siempre igual ("Hola, soy NEXUS...") incluso cuando usuario regresa
3. ❌ No saludaba por nombre aunque ya lo tenía guardado

**Status:** ✅ **IMPLEMENTADO** (Listo para testing)

---

## 🎯 Problemas Resueltos

### Problema 1: Consentimiento repetitivo

**Antes:**
```
Usuario da consentimiento → Limpia pizarra → NEXUS vuelve a pedir consentimiento ❌
```

**Después:**
```
Usuario da consentimiento → Guarda en localStorage + BD → Limpia pizarra → NO pide consentimiento ✅
```

**Causa raíz:**
- Backend consultaba tabla `prospects` incorrecta
- Debía consultar `device_info` directamente usando `fingerprint`

### Problema 2: Saludo no personalizado

**Antes:**
```
Primera vez: "Hola, soy NEXUS... Jeff Bezos..."
Limpia pizarra: "Hola, soy NEXUS... Jeff Bezos..." (igual) ❌
```

**Después:**
```
Primera vez: "Hola, soy NEXUS... Jeff Bezos..." ✅
Limpia pizarra (con nombre): "¡Hola de nuevo, Luis! ¿En qué más puedo ayudarte?" ✅
Limpia pizarra (sin nombre): "¡Hola de nuevo! ¿En qué más puedo ayudarte?" ✅
```

---

## 🔧 Solución Técnica

### Frontend: useNEXUSChat.ts

#### 1. Tracking de primer saludo (localStorage)

```typescript
// Líneas 143-151
const hasSeenGreeting = localStorage.getItem('nexus_first_greeting_shown') === 'true';

console.log('🔍 [NEXUS] Estado de usuario:', {
  consentGiven,
  consentTimestamp: consentTimestamp ? new Date(parseInt(consentTimestamp)).toISOString() : 'nunca',
  hasSeenGreeting,
  isFirstMessageOfConversation: messages.length === 0
});
```

#### 2. Envío de flag isReturningUser al backend

```typescript
// Líneas 158-169
body: JSON.stringify({
  messages: [...messages, userMessage].map(msg => ({
    role: msg.role,
    content: msg.content
  })),
  fingerprint: fingerprint,
  sessionId: sessionId,
  constructorId: constructorId,
  consentGiven: consentGiven,  // ✅ Consentimiento
  isReturningUser: hasSeenGreeting  // ✅ Usuario que regresa
}),
```

#### 3. Marcar primer saludo después de respuesta

```typescript
// Líneas 244-249 (streaming) y 291-296 (JSON)
if (messages.length === 0 && !hasSeenGreeting) {
  localStorage.setItem('nexus_first_greeting_shown', 'true');
  localStorage.setItem('nexus_first_greeting_timestamp', Date.now().toString());
  console.log('✅ [NEXUS] Primer saludo mostrado, marcado en localStorage');
}
```

### Backend: route.ts

#### 1. Consulta correcta a device_info

**ANTES (❌ INCORRECTO):**
```typescript
// Línea 1797 - Consultaba tabla incorrecta
const { data: existingProspect } = await supabase
  .from('prospects')  // ❌ Tabla incorrecta
  .select('device_info')
  .eq('fingerprint_id', fingerprint)
  .single();
```

**DESPUÉS (✅ CORRECTO):**
```typescript
// Líneas 1797-1803
const { data: deviceData } = await supabase
  .from('device_info')  // ✅ Tabla correcta
  .select('*')
  .eq('fingerprint', fingerprint)  // ✅ Campo correcto
  .order('created_at', { ascending: false })
  .limit(1)
  .single();
```

#### 2. Eliminación de código duplicado

**ANTES:**
- Consultaba `prospects` dos veces (líneas 1797 y 1824)
- Variables `existingProspectData` y `userData` separadas

**DESPUÉS:**
```typescript
// Líneas 1822-1824
const userData = existingProspectData;  // ✅ Reutiliza datos ya cargados
```

#### 3. Saludo diferenciado por contexto

```typescript
// Líneas 2169-2178
${userData.name || userData.consent_granted ? `
🎉 USUARIO CONOCIDO - SALUDO PERSONALIZADO:
- El usuario YA dio consentimiento previamente: ${userData.consent_granted ? '✅ SÍ' : 'Pendiente'}
- Su nombre es: ${userData.name || 'No capturado aún'}
- Usuario que regresa (limpia pizarra): ${isReturningUser ? '✅ SÍ' : 'No'}
- NO vuelvas a pedir consentimiento ni datos que ya tienes
${userData.name && isReturningUser ? `- SALUDO BREVE OBLIGATORIO: "¡Hola de nuevo, ${userData.name}! ¿En qué más puedo ayudarte?"` : userData.name && !isReturningUser ? `- SALUDO OBLIGATORIO: "¡Hola de nuevo, ${userData.name}! ¿En qué puedo ayudarte hoy?"` : ''}
${!userData.name && isReturningUser ? `- SALUDO BREVE SIN NOMBRE: "¡Hola de nuevo! ¿En qué más puedo ayudarte?"` : ''}
```

#### 4. Logs mejorados para debugging

```typescript
// Líneas 1807-1814
console.log('📊 [NEXUS] Datos existentes del prospecto:', {
  tiene_nombre: !!existingProspectData.name,
  tiene_email: !!existingProspectData.email,
  tiene_whatsapp: !!existingProspectData.whatsapp,
  tiene_archetype: !!existingProspectData.archetype,
  tiene_consentimiento: !!existingProspectData.consent_granted,
  consentGivenFromLocalStorage: consentGiven
});
```

---

## 🎭 Flujo de Saludos

### Caso 1: Usuario completamente nuevo

```
Usuario: "Hola"
NEXUS: "Hola, soy NEXUS.

Piénsalo así: Jeff Bezos no construyó su fortuna vendiendo libros. Construyó Amazon, el sistema.

Nosotros aplicamos esa misma filosofía. Te ayudamos a construir TU sistema.

¿Por dónde empezamos?"

→ localStorage: nexus_first_greeting_shown = 'true'
```

### Caso 2: Usuario con nombre, limpia pizarra (primera vez)

```
Usuario: "Hola" [después de limpiar pizarra]
NEXUS: "¡Hola de nuevo, Luis! ¿En qué puedo ayudarte hoy?"

Nota: isReturningUser = false (primera vez que limpia)
```

### Caso 3: Usuario con nombre, limpia pizarra (segunda vez)

```
Usuario: "Hola" [después de limpiar pizarra otra vez]
NEXUS: "¡Hola de nuevo, Luis! ¿En qué más puedo ayudarte?"

Nota: isReturningUser = true (ya había limpiado antes)
```

### Caso 4: Usuario sin nombre, pero con consentimiento previo

```
Usuario: "Hola" [después de limpiar pizarra]
NEXUS: "¡Hola de nuevo! ¿En qué más puedo ayudarte?"

Nota: consentGiven = true pero name = undefined
```

---

## 🧪 Testing Requerido

### Test Case 1: Primera interacción completa

1. Modo incógnito → CreaTuActivo.com
2. Abrir NEXUS → Hacer pregunta
3. ✅ **Verificar:** Saludo completo "Hola, soy NEXUS... Jeff Bezos..."
4. ✅ **Verificar localStorage:**
   - `nexus_first_greeting_shown` = `"true"`
   - `nexus_first_greeting_timestamp` = timestamp

### Test Case 2: Limpiar pizarra SIN dar nombre

1. Continuar Test Case 1
2. Limpiar Pizarra
3. Hacer nueva pregunta
4. ✅ **Verificar:** Saludo breve "¡Hola de nuevo! ¿En qué más puedo ayudarte?"

### Test Case 3: Dar nombre y limpiar pizarra

1. Modo incógnito → CreaTuActivo.com
2. NEXUS pregunta nombre → Responder "Luis"
3. ✅ **Verificar en Supabase:** `device_info` tiene `name = 'Luis'`
4. Limpiar Pizarra
5. Hacer nueva pregunta
6. ✅ **Verificar:** "¡Hola de nuevo, Luis! ¿En qué más puedo ayudarte?"

### Test Case 4: Consentimiento persiste

1. Modo incógnito → NEXUS pide consentimiento
2. Responder "acepto"
3. ✅ **Verificar localStorage:** `nexus_consent_given` = `"true"`
4. Limpiar Pizarra
5. Hacer nueva pregunta
6. ✅ **Verificar:** NO vuelve a pedir consentimiento

### Test Case 5: Logs de debugging

1. Abrir DevTools → Console
2. Interactuar con NEXUS
3. ✅ **Buscar logs:**
   ```
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
     tiene_consentimiento: true,
     consentGivenFromLocalStorage: true
   }
   ```

---

## 📊 Comparación: Antes vs Después

### Consentimiento

| Escenario | Antes | Después |
|-----------|-------|---------|
| Primera vez | ✅ Pide consentimiento | ✅ Pide consentimiento |
| Limpia pizarra | ❌ Vuelve a pedir | ✅ NO vuelve a pedir |
| Cierra widget | ❌ Vuelve a pedir | ✅ NO vuelve a pedir |
| Navega a otra página | ❌ Vuelve a pedir | ✅ NO vuelve a pedir |

### Saludo

| Escenario | Antes | Después |
|-----------|-------|---------|
| Primera vez | "Hola, soy NEXUS..." | "Hola, soy NEXUS..." |
| Limpia pizarra (con nombre) | ❌ "Hola, soy NEXUS..." | ✅ "¡Hola de nuevo, [NOMBRE]!" |
| Limpia pizarra (sin nombre) | ❌ "Hola, soy NEXUS..." | ✅ "¡Hola de nuevo!" |

---

## 🚀 Deploy

**Commit:** `71bbc65`
**Branch:** `main`
**Fecha:** 2025-11-21

**Archivos modificados:**
- `src/components/nexus/useNEXUSChat.ts` (+27 líneas)
- `src/app/api/nexus/route.ts` (-44 líneas, +44 líneas)

**Status:** ✅ **Pushed a GitHub**

---

## 🔍 Debugging

### localStorage Keys Creados

```typescript
// Consentimiento (ya existía)
nexus_consent_given: 'true'
nexus_consent_timestamp: '1732204800000'

// Primer saludo (NUEVO)
nexus_first_greeting_shown: 'true'
nexus_first_greeting_timestamp: '1732204800000'
```

### Verificar en DevTools

```javascript
// Console
localStorage.getItem('nexus_first_greeting_shown')  // → "true"
localStorage.getItem('nexus_consent_given')  // → "true"
```

### Limpiar estado para testing

```javascript
// Console
localStorage.removeItem('nexus_first_greeting_shown')
localStorage.removeItem('nexus_consent_given')
location.reload()
```

---

## ⚠️ Notas Importantes

### Caché de Anthropic

Los cambios al System Prompt pueden tardar **hasta 5 minutos** en aplicarse debido al caché de Anthropic. Si no ves los cambios inmediatamente:

1. Espera 5 minutos
2. Limpia localStorage
3. Recarga la página
4. Intenta nuevamente

### Base de Datos

La consulta a `device_info` require que:
- `fingerprint` exista y coincida
- Usuario haya interactuado previamente con NEXUS
- `name` y/o `consent_granted` estén guardados

Si la BD no tiene datos, NEXUS mostrará saludo completo (comportamiento correcto).

---

**Desarrollado por:** Claude Code
**Revisado por:** Luis Cabrejo
**Fecha:** 2025-11-21
**Status:** ✅ **LISTO PARA TESTING EN PRODUCCIÓN**
