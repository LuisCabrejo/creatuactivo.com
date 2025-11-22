# 🔬 DEBUG: Problema Quirúrgico de Consentimiento

**Fecha:** 21 Nov 2025
**Status:** Investigando problema profundo

---

## 🐛 Síntomas Reportados

Usuario dice:
> "El problema persiste inclusive escribí acepto"

Logs muestran:
```javascript
🔍 [NEXUS] Estado de usuario: {
  consentGiven: false,  // ← SIEMPRE false
  ...
}
```

---

## 🔍 Hipótesis #1: Regex NO está funcionando

### Test Manual del Regex

Abre Console del navegador en https://creatuactivo.com y ejecuta:

```javascript
// TEST 1: Verificar que el código nuevo está desplegado
const content = "acepto";
const normalizedContent = content.trim().toLowerCase();

// Copiar el regex exacto del código
const isAcceptingConsent =
  /^acepto$/i.test(normalizedContent) ||
  /^a$/i.test(normalizedContent) ||
  /^a\)$/i.test(normalizedContent) ||
  /^si$/i.test(normalizedContent) ||
  /^sí$/i.test(normalizedContent) ||
  /acepto/i.test(normalizedContent) ||
  /aceptar/i.test(normalizedContent) ||
  /✅/.test(content) ||
  /opcion\s*a/i.test(normalizedContent) ||
  /opción\s*a/i.test(normalizedContent);

console.log('isAcceptingConsent:', isAcceptingConsent);  // Debe ser: true
```

**Resultado esperado:** `true`
**Si es `false`:** El código viejo sigue en producción

---

## 🔍 Hipótesis #2: localStorage se limpia antes de leer

### Test del Flujo Completo

```javascript
// En Console antes de enviar mensaje
localStorage.clear();

// Escribe "acepto" en NEXUS

// Inmediatamente después, verifica:
localStorage.getItem('nexus_consent_given');  // Debe ser: "true"

// Verifica que NO fue borrado por resetChat
localStorage.getItem('nexus_consent_given');  // Debe SEGUIR siendo: "true"
```

---

## 🔍 Hipótesis #3: Caché del navegador

### Verificar versión del JavaScript

```javascript
// En Console
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('layout-'))
  .map(r => ({ url: r.name, timestamp: new Date(r.responseStart) }))
```

**Buscar:** `layout-XXXX.js`

**Versión actual en producción:** `layout-9943f28471d4f471.js`

**Si ves versión diferente:** Hard refresh (Cmd+Shift+R)

---

## 🔍 Hipótesis #4: El log está mintiendo

### Interceptar sendMessage

```javascript
// En Console ANTES de abrir NEXUS
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  console.log('📝 localStorage.setItem:', key, value);
  return originalSetItem.apply(this, arguments);
};

const originalGetItem = localStorage.getItem;
localStorage.getItem = function(key) {
  const value = originalGetItem.apply(this, arguments);
  console.log('📖 localStorage.getItem:', key, '→', value);
  return value;
};

// Luego abre NEXUS y escribe "acepto"
// Verifica que aparezcan logs:
// 📝 localStorage.setItem: nexus_consent_given true
// 📖 localStorage.getItem: nexus_consent_given → true
```

---

## 🧪 Plan de Testing Sistemático

### Paso 1: Verificar código desplegado

```bash
# En terminal local
git log --oneline -1
# Debe mostrar: 6bfb8ac 🐛 fix: Consentimiento persistente

# Verificar que GitHub tiene el commit
# https://github.com/LuisCabrejo/creatuactivo.com/commits/main
```

### Paso 2: Verificar Vercel deployment

1. https://vercel.com/deployments
2. Buscar deployment más reciente
3. Verificar que:
   - Source: `main` branch
   - Commit: `6bfb8ac`
   - Status: "Ready" (verde)

### Paso 3: Hard refresh en navegador

```
Cmd + Shift + R (Mac)
Ctrl + Shift + R (Windows)
```

### Paso 4: Test con logging manual

```javascript
// Console del navegador
window.addEventListener('storage', (e) => {
  console.log('🔔 Storage changed:', e.key, e.oldValue, '→', e.newValue);
});

// Luego envía "acepto" y verifica que aparezca:
// 🔔 Storage changed: nexus_consent_given null → true
```

---

## 🔬 Test de Aislamiento del Regex

### Test A: Verificar normalización

```javascript
const inputs = ["acepto", "ACEPTO", " acepto ", "a", "A", " a "];

inputs.forEach(input => {
  const normalized = input.trim().toLowerCase();
  const matches = /^acepto$/i.test(normalized) || /^a$/i.test(normalized);
  console.log(`Input: "${input}" → normalized: "${normalized}" → matches: ${matches}`);
});

// Todos deben ser: matches: true
```

### Test B: Verificar que se ejecuta el if

Abre Sources en DevTools:
1. Busca archivo `useNEXUSChat.ts` o `layout-xxx.js`
2. Encuentra la línea `localStorage.setItem('nexus_consent_given', 'true');`
3. Pon un breakpoint
4. Escribe "acepto" en NEXUS
5. Verifica que el breakpoint se active

**Si NO se activa:** El regex no está detectando

---

## 📊 Matriz de Diagnóstico

| Test | Resultado Esperado | Si falla = |
|------|-------------------|------------|
| Regex manual en Console | `true` | Código viejo en producción |
| localStorage después de "acepto" | `"true"` | setItem no se ejecuta |
| Breakpoint en setItem | Se activa | Regex no detecta |
| Log "Consentimiento guardado" | Aparece | If no se ejecuta |
| consentGiven en log | `true` | localStorage se limpia después |

---

## 🎯 Acción Inmediata

**Ejecutar estos comandos en Console del navegador (modo incógnito en creatuactivo.com):**

```javascript
// 1. Verificar versión
console.log('Versión layout:', document.querySelector('script[src*="layout-"]')?.src);

// 2. Test manual del regex
const testInput = "acepto";
const normalized = testInput.trim().toLowerCase();
const result = /^acepto$/i.test(normalized);
console.log('Test regex "acepto":', result);  // Debe ser true

// 3. Interceptar localStorage
const _setItem = localStorage.setItem;
localStorage.setItem = function(k, v) {
  console.log('✍️ SET:', k, '=', v);
  _setItem.apply(this, arguments);
};

// 4. Abrir NEXUS y escribir "acepto"
// Verificar que aparezca: ✍️ SET: nexus_consent_given = true
```

---

**Próximo paso:** Ejecutar test manual y reportar resultado
