# Hotfix: Name Capture Bug Fix (Nov 22, 2025)

## 🐛 PROBLEMA REPORTADO

**User**: "Rafael Guzmán" capturado como "observación"

**Contexto**:
- Usuario escribió su nombre: "Rafael Guzmán"
- NEXUS capturó incorrectamente: "observación"
- Este bug fue previamente solucionado (commit b6890d6) pero REGRESÓ
- "esto funcionaba bien ayer tengo datos de usuarios registrados"

---

## 🔍 ROOT CAUSE ANALYSIS

### Bug #1: Supabase Undefined (HOTFIX PREVIO - 17 min antes)

**Problema**: `await supabase.rpc(...)` fallaba con "supabase is not defined"

**Causa**: Variable `supabase` no existe globalmente, solo `getSupabaseClient()`

**Fix**: Commit `1385ee9` - Reemplazar todas las instancias:
```typescript
// ❌ ANTES (broken):
await supabase.rpc('update_prospect_data', ...)

// ✅ DESPUÉS (fixed):
await getSupabaseClient().rpc('update_prospect_data', ...)
```

**Resultado**: Datos SÍ se guardan en Supabase (verificado con Rafael record)

---

### Bug #2: Name Capture Regression (ACTUAL PROBLEMA)

**Timeline de conversación con Rafael**:
1. Conversación #5: Usuario escribe "Rafael Guzmán" → ✅ Capturado correctamente como "Rafael"
2. Conversación #12: Usuario escribe "pregunta, porqué me pusiste de nombre rafael **elección**?"
3. NEXUS responde: "¡**Excelente observación**, **elección**!"
4. `extractFromClaudeResponse()` procesa respuesta de NEXUS
5. Regex captura "observación" de "Excelente observación"
6. semanticData SOBRESCRIBE nombre válido "Rafael" con "observación"

**Root Cause Técnico**:

```typescript
// route.ts:1644-1645 (ANTES del fix)
const nameConfirmationPatterns = [
  /(?:hola|perfecto|excelente|genial|encantado)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ]+)*)[!,]/i,
  //                ^^^^^^^^^ PROBLEMA: Captura "observación" de "Excelente observación,"
];

// route.ts:2335-2337 (ANTES del fix)
const finalData: ProspectData = {
  ...prospectData,  // Datos capturados del input del usuario
  ...semanticData   // ❌ PROBLEMA: semanticData tiene PRIORIDAD y sobrescribe
};
```

**Por qué capturó "observación"**:
1. Regex busca: `excelente` + espacio + palabra capitalizada + coma/exclamación
2. NEXUS dijo: "¡Excelente **observación**,"
3. Regex matched: grupo 1 = "observación"
4. Blacklist solo tenía: `constructor|visionario|inicial|estratégico|excelente|perfecto`
5. "observación" NO estaba en blacklist → Se aceptó como nombre válido
6. semanticData sobrescribió "Rafael" con "observación"

---

## ✅ SOLUCIÓN IMPLEMENTADA (Commit bc641f2)

### Fix 1: Expandir Blacklist (route.ts:1655)

```typescript
// ANTES:
const nameBlacklist = /^(constructor|visionario|inicial|estratégico|excelente|perfecto)$/i;

// DESPUÉS:
const nameBlacklist = /^(constructor|visionario|inicial|estratégico|excelente|perfecto|observación|observacion|elección|eleccion|pregunta|consulta|comentario|duda|punto)$/i;
```

**Razón**: Palabras de conversación NO son nombres válidos.

---

### Fix 2: Remover "excelente" del Pattern (route.ts:1645)

```typescript
// ANTES:
/(?:hola|perfecto|excelente|genial|encantado)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ]+)*)[!,]/i

// DESPUÉS:
/(?:hola|perfecto|genial|encantado)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ]+)*)[!,]/i
```

**Razón**: "Excelente" es palabra de NEXUS muy común, alto riesgo de falsos positivos.

---

### Fix 3: Protección contra Sobrescritura (route.ts:2334-2340)

```typescript
// NUEVO: Protección antes de merge
if (semanticData.name && prospectData.name && prospectData.name.length >= 2) {
  console.log('⚠️ [SEMÁNTICA] Ignorando nombre semántico - ya existe nombre válido:',
    prospectData.name, '(semántico:', semanticData.name, ')');
  delete semanticData.name;
}

// Merge datos: captura directa (del usuario) + semántica (de respuesta Claude)
const finalData: ProspectData = {
  ...prospectData,  // Datos capturados del input del usuario
  ...semanticData   // Datos extraídos de la respuesta de Claude (prioridad, EXCEPTO nombre)
};
```

**Razón**: Nombre del usuario tiene PRIORIDAD sobre extracción semántica.

---

## 🧪 TESTING & VERIFICATION

### Testing Tools Creados:

#### 1. `scripts/test-name-capture.mjs`
Tests unitarios de lógica de captura de nombre:
```bash
node scripts/test-name-capture.mjs
```

**Resultados**:
- ✅ "Rafael Guzmán" → Captura "Rafael Guzmán"
- ✅ "Me llamo Rafael Guzmán" → Captura "Rafael Guzmán"
- ❌ "observación" → ~~Capturado~~ (AHORA en blacklist)
- ❌ "perfecto" → Rechazado (blacklist)
- ❌ "excelente" → Rechazado (blacklist)

#### 2. `scripts/debug-rafael-conversation.mjs`
Análisis de conversación completa de Rafael:
```bash
node scripts/debug-rafael-conversation.mjs
```

**Hallazgos**:
- Conversación #5: Usuario escribió "Rafael Guzmán" ✅
- Conversación #12: NEXUS dijo "Excelente observación, elección!" ⚠️
- device_info.name: "observación" ❌ (antes del fix)

#### 3. `scripts/verificar-registros-vacios.mjs`
Verificación de registros sin datos:
```bash
node scripts/verificar-registros-vacios.mjs
```

**Resultados**:
- Records #1-7, #9-15: 0 conversaciones → ✅ **NO es bug**, son page visits sin interacción
- Record #8 (Rafael): 14 conversaciones (28 mensajes) → Datos capturados

---

## 📊 ESTADO ACTUAL

### ✅ FUNCIONANDO:
1. Hotfix Supabase undefined (commit 1385ee9)
2. Datos SÍ se guardan en BD (verificado con Rafael record)
3. Fingerprinting tracking funciona
4. NEXUS conversaciones se loggean correctamente

### ✅ CORREGIDO:
1. Name capture bug (commit bc641f2)
2. Protección contra sobrescritura semántica
3. Blacklist expandida para palabras de conversación

### ⏳ PENDIENTE:
1. Deploy Vercel (~2 min)
2. Testing en producción con usuario real
3. Verificar que nuevas conversaciones capturen nombres correctamente

---

## 🚀 DEPLOYMENT

**Git Status**:
```bash
commit bc641f2 - 🐛 fix: Proteger nombre válido contra sobrescritura semántica
commit 1385ee9 - 🔥 HOTFIX CRÍTICO: Supabase undefined
```

**Pushed to**: `main` branch → GitHub → Vercel autodeploy

**Vercel**: Deployment automático iniciado

**Verificación Post-Deploy**:
1. Abrir https://creatuactivo.com
2. Usar NEXUS y escribir nombre (ej: "Luis Cabrejo")
3. Verificar en Supabase Dashboard:
   - Table: `prospects`
   - Campo: `device_info->name`
   - Esperado: "Luis Cabrejo" (NO "observación" ni otra palabra)

---

## 📝 COMMITS HISTORY

### bc641f2 - Name Capture Fix (ESTE HOTFIX)
```
🐛 fix: Proteger nombre válido contra sobrescritura semántica

PROBLEMA: Usuario escribió 'Rafael Guzmán' → NEXUS capturó 'observación'

SOLUCIÓN (doble protección):
1. Expandir blacklist: +observación +elección +pregunta +consulta
2. NO sobrescribir nombre si ya existe uno válido (length >= 2)
3. Removido 'excelente' de pattern (falso positivo)

Fixes regression from commit b6890d6
```

### 1385ee9 - Supabase Undefined Hotfix (PREVIO)
```
🔥 HOTFIX CRÍTICO: Supabase undefined

PROBLEMA: Health check retorna "supabase is not defined"
CAUSA: Variable supabase no existe, solo getSupabaseClient()
FIX: Reemplazar await supabase. con await getSupabaseClient().
```

---

## 🎯 CONCLUSIÓN

**Problema resuelto**: ✅
- Name capture ya NO sobrescribirá nombres válidos
- Blacklist expandida previene captura de palabras de conversación
- Protección doble: blacklist + protección contra sobrescritura

**Regresión prevenida**: ✅
- Este bug había ocurrido antes (commit b6890d6)
- Ahora hay protección adicional para evitar regresión futura
- Tests unitarios disponibles para verificación rápida

**Producción**: ⏳ Esperando deploy Vercel (~2 min)

---

**Fecha**: 22 Nov 2025 - 00:50 UTC-5
**Autor**: Claude Code (Anthropic)
**Commit**: bc641f2
**Status**: ✅ RESOLVED
