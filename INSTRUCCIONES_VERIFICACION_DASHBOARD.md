# 🔍 Instrucciones para Verificar Datos del Dashboard

## Objetivo
Identificar de dónde vienen los datos que se muestran en `https://app.creatuactivo.com/admin`

---

## Paso 1: Verificar Network Requests (IMPORTANTE)

1. Ve a `https://app.creatuactivo.com/admin`
2. Abre DevTools: `F12` (Windows/Linux) o `Cmd+Option+I` (Mac)
3. Ve a la pestaña **Network**
4. Recarga la página: `Ctrl+R` o `Cmd+R`
5. Busca requests que contengan "supabase" en la URL
6. Anota qué endpoints se están llamando

**Busca específicamente:**
- `/rest/v1/pending_activations`
- `/rest/v1/private_users`
- `/rest/v1/prospects`
- `/rest/v1/prospect_data`

**Si NO ves ningún request a Supabase:**
→ Los datos son hardcodeados en el frontend (mock data)

**Si SÍ ves requests a Supabase:**
→ Revisa la pestaña "Response" de cada request para ver qué datos devuelve

---

## Paso 2: Verificar LocalStorage

1. En DevTools, ve a la pestaña **Application**
2. En el sidebar izquierdo, expande **Local Storage**
3. Click en `https://app.creatuactivo.com`
4. Revisa si hay datos guardados

**Común encontrar:**
- `sb-...` (datos de sesión de Supabase)
- `prospects`, `users`, etc.

---

## Paso 3: Verificar el Código Fuente (Si tienes acceso)

Ve al proyecto Dashboard:
```bash
cd /Users/luiscabrejo/CreaTuActivo-Dashboard
```

Busca el archivo de la página admin:
```bash
# Buscar archivo de admin
find src/app -name "*admin*" -type f

# O buscar en todo el proyecto
grep -r "pending_activations" src/
```

Revisa si hay datos mockeados como:
```typescript
const mockData = [...]
const placeholderProspects = [...]
const demoUsers = [...]
```

---

## Paso 4: Verificar Query SQL Real

Ejecuta en Supabase SQL Editor:

```sql
-- Ver activaciones pendientes (debería estar vacío)
SELECT COUNT(*) as total FROM pending_activations;

-- Ver prospectos (debería estar vacío)
SELECT COUNT(*) as total FROM prospects;

-- Ver prospect_data (debería estar vacío)
SELECT COUNT(*) as total FROM prospect_data;
```

**Resultado esperado:** Todos deben ser `0`

---

## 📊 Reporte de Resultados

Por favor comparte:

1. **Network tab:** ¿Qué requests ves a Supabase? (screenshot o lista)
2. **LocalStorage:** ¿Qué keys ves guardadas?
3. **Query SQL:** ¿Qué números obtuviste?
4. **Descripción de los datos:** ¿Qué información específica ves en el dashboard? (nombres, emails, etc.)

---

## 🎯 Próximos Pasos

Una vez tengas esta información, podré:
- Confirmar si son datos mock o reales
- Ayudarte a limpiar lo que sea necesario
- Proceder con las pruebas de captura de datos
