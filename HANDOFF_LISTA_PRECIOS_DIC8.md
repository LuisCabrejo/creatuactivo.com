# HANDOFF: NEXUS No Muestra Lista Completa de 22 Productos

**Fecha:** 8 Diciembre 2025
**Estado:** NO RESUELTO
**Prioridad:** Alta

---

## EL PROBLEMA

Cuando un usuario pregunta "lista de precios" o "precios" en NEXUS, el chatbot **solo muestra ~13 productos** en lugar de los **22 productos** que existen en el catálogo.

La respuesta se corta a mitad de palabra, ejemplo:
```
Mangostán (60 cá
```

Esto indica que algo está truncando la respuesta antes de completarse.

---

## CAMBIOS APLICADOS (QUE NO RESOLVIERON EL PROBLEMA)

### 1. System Prompt en Supabase (v13.9.5)

**Script ejecutado:** `scripts/actualizar-system-prompt-v13.9.5-excepcion-precios.mjs`

Se agregó excepción a la regla de concisión:
```markdown
### REGLA CRÍTICA - CONCISIÓN EXTREMA:

**Máximo 150-200 palabras por respuesta**

**EXCEPCIONES (puedes usar más palabras):**
- Lista completa de precios de productos → mostrar los 22 productos
- Tablas de compensación completas → mostrar tabla completa
- Cuando el usuario pida explícitamente "lista completa" o "todos los..."
```

Se agregó tabla de precios por categorías (22 productos):
- 9 Bebidas Funcionales
- 3 Suplementos
- 6 Cuidado Personal (Piel&Brillo)
- 4 Línea Premium LUVOCO

### 2. route.ts - max_tokens dinámico

**Archivo:** `src/app/api/nexus/route.ts`
**Líneas:** ~2675-2683

```javascript
const pideListaPrecios = /lista.*precio|todos.*precio|precios.*producto|catálogo.*precio|dame.*precios|precios/i.test(lastUserMessage);

const maxTokens = pideListaPrecios
  ? 3000  // Lista completa de precios
  : searchMethod === 'catalogo_productos'
  ? 300
  : 600;
```

### 3. route.ts - sessionInstructions condicional

**Archivo:** `src/app/api/nexus/route.ts`
**Líneas:** ~2643-2659

Se hizo condicional la sección de concisión:
- Si `pideListaPreciosEarly=true` → Muestra "INSTRUCCIÓN PRIORITARIA" para 22 productos
- Si `pideListaPreciosEarly=false` → Muestra "CONCISIÓN OBLIGATORIA" normal

```javascript
${pideListaPreciosEarly ? `
🚨🚨🚨 INSTRUCCIÓN PRIORITARIA - LISTA DE PRECIOS 🚨🚨🚨
EL USUARIO PIDIÓ LA LISTA DE PRECIOS COMPLETA.
IGNORA CUALQUIER LÍMITE DE PALABRAS O REGLA DE CONCISIÓN.
MUESTRA LA TABLA COMPLETA DE 22 PRODUCTOS POR CATEGORÍAS:
- ☕ BEBIDAS FUNCIONALES (9 productos)
- 💊 SUPLEMENTOS (3 productos)
- ✨ CUIDADO PERSONAL (6 productos)
- ☕ LÍNEA PREMIUM LUVOCO (4 productos)
USA LA TABLA DEL SYSTEM PROMPT. NO OMITAS NINGÚN PRODUCTO.
` : `
🎯 CONCISIÓN OBLIGATORIA:
- Responde ÚNICAMENTE lo que el usuario preguntó
...
`}
```

### 4. useNEXUSChat.ts - Timeout aumentado

**Archivo:** `src/components/nexus/useNEXUSChat.ts`
**Línea:** 135

```javascript
// Antes: 30000 (30 segundos)
// Después: 60000 (60 segundos)
const timeoutId = setTimeout(() => controller.abort(), 60000);
```

### 5. Log de debugging agregado

**Archivo:** `src/app/api/nexus/route.ts`
**Línea:** ~2521

```javascript
console.log(`🚨🚨🚨 DETECCIÓN LISTA PRECIOS: pideListaPreciosEarly=${pideListaPreciosEarly}, mensaje="${lastUserMessageForPrices.substring(0, 50)}"`);
```

---

## ARCHIVOS RELEVANTES

| Archivo | Propósito |
|---------|-----------|
| `src/app/api/nexus/route.ts` | API principal de NEXUS, maneja Claude, tokens, instrucciones |
| `src/components/nexus/useNEXUSChat.ts` | Hook React para el chat, maneja streaming y timeout |
| `knowledge_base/catalogo_productos.txt` | Catálogo completo con 22 productos (fuente de verdad) |
| `scripts/leer-system-prompt.mjs` | Lee System Prompt actual de Supabase |
| Supabase tabla `system_prompts` (name: `nexus_main`) | System Prompt dinámico v13.9.5 |

---

## VERIFICACIONES REALIZADAS

1. **System Prompt tiene la tabla de 22 productos** - CONFIRMADO
2. **System Prompt tiene la excepción de concisión** - CONFIRMADO
3. **max_tokens se establece en 3000** - CONFIRMADO (ver logs)
4. **Nombres de productos son correctos** - CONFIRMADO (coinciden con catálogo)
5. **Frontend no trunca el contenido** - No hay límites de caracteres en useNEXUSChat.ts

---

## COMPORTAMIENTO OBSERVADO

1. Se detecta correctamente `pideListaPreciosEarly=true`
2. Se establece `max_tokens=3000`
3. Claude comienza a generar la lista correctamente
4. La respuesta se corta a mitad de palabra (ej: "Mangostán (60 cá")
5. Solo se muestran ~13 productos de 22

---

## HIPÓTESIS NO PROBADAS

- Algo más está limitando la respuesta que no hemos identificado
- Posible timeout en otro lugar del código
- Posible límite en el streaming de Anthropic
- Posible interferencia del cache de Anthropic Prompt Caching

---

## COMANDOS ÚTILES

```bash
# Leer System Prompt actual
node scripts/leer-system-prompt.mjs

# Ver logs del servidor
# (revisar la terminal donde corre npm run dev)

# Buscar "CONCISIÓN" en route.ts
grep -n "CONCISIÓN" src/app/api/nexus/route.ts

# Buscar timeouts
grep -n "timeout\|Timeout\|abort" src/components/nexus/useNEXUSChat.ts
```

---

## NOTA IMPORTANTE

Los nombres de productos como "Ganorico Latte Rico", "Ganorico Mocha Rico", "Ganorico Shoko Rico" **SON CORRECTOS** según el catálogo oficial (`knowledge_base/catalogo_productos.txt`). No son alucinaciones.
