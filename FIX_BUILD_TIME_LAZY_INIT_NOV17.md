# 🔧 Fix: Lazy Initialization de Clientes API para Build-Time

**Fecha:** 17 Noviembre 2025
**Problema:** Build-time errors en Vercel por inicialización temprana de clients
**Solución:** Lazy initialization pattern para Resend y Supabase

---

## 🚨 Problema Identificado

Durante el deploy a Vercel, el build fallaba con errores:

### Error 1: RESEND_API_KEY
```
Error: Missing API key. Pass it to the constructor `new Resend("re_123")`
Build error occurred
Error: Failed to collect page data for /api/fundadores
```

### Error 2: supabaseUrl is required
```
Error: supabaseUrl is required.
Build error occurred
Error: Failed to collect page data for /api/nexus/producer
```

**Causa raíz:** Los clientes se instanciaban en import-time (top-level), cuando las environment variables no están disponibles durante el build.

```typescript
// ❌ ANTES (import-time initialization)
const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

---

## ✅ Solución Aplicada

### **Patrón: Lazy Initialization**

En lugar de instanciar los clientes en import-time, los creamos en runtime (primera vez que se usan).

```typescript
// ✅ DESPUÉS (lazy initialization)
let resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseClient;
}
```

**Ventajas:**
- ✅ Build exitoso sin environment variables locales
- ✅ Singleton pattern (una sola instancia por proceso)
- ✅ Runtime initialization (cuando las variables SÍ están disponibles)
- ✅ Compatible con Edge Runtime y Node.js

---

## 📂 Archivos Modificados

### 1. **src/app/api/fundadores/route.ts**

**Cambios:**
- Lazy init de `resendClient` (línea 18-25)
- Lazy init de `supabaseClient` (línea 27-37)
- 3 usos de `resend` → `getResendClient()`
- 2 usos de `supabase` → `getSupabaseClient()`

**Commits:**
- `e4b1764`: Resend lazy init
- `7ce63ee`: Supabase lazy init

---

### 2. **src/app/api/nexus/producer/route.ts**

**Cambios:**
- Lazy init de `supabaseClient` (línea 19-29)
- 1 uso de `supabase` → `getSupabaseClient()`

**Commit:** `c930d68`

---

### 3. **src/app/api/nexus/route.ts** (legacy endpoint)

**Cambios:**
- Lazy init de `supabaseClient` (línea 28-37)
- 5 usos de `supabase` → `getSupabaseClient()`

**Commit:** `c930d68`

---

### 4. **src/app/api/nexus/consumer-cron/route.ts**

**Cambios:**
- Lazy init de `supabaseClient` (línea 29-39)
- 1 uso de `supabase` → `getSupabaseClient()`

**Commit:** `c930d68`

---

## 🎯 Resultado

### **Antes:**
```bash
npm run build
# ❌ Error: Missing API key
# ❌ Error: supabaseUrl is required
```

### **Después:**
```bash
vercel --prod
# ✅ Build exitoso
# ✅ Deploy completado: https://creatuactivo.com/
# ✅ Status: 200 OK
```

---

## 🔄 Pattern Aplicado

### **Lazy Initialization (Singleton Pattern)**

Este patrón es común en Next.js para clientes externos que requieren environment variables:

```typescript
// Generic pattern
let clientInstance: ClientType | null = null;

function getClient(): ClientType {
  if (!clientInstance) {
    clientInstance = new ClientType(process.env.SECRET_KEY!);
  }
  return clientInstance;
}

// Uso
const result = await getClient().method();
```

**Cuándo aplicar:**
- ✅ Cliente requiere API keys/secrets
- ✅ Environment variables no disponibles en build-time
- ✅ Edge Runtime o API Routes
- ✅ Singleton deseado (una instancia por proceso)

**Cuándo NO aplicar:**
- ❌ Variables públicas (`NEXT_PUBLIC_*`)
- ❌ Configuración estática sin secrets
- ❌ Client-side only (no hay build-time)

---

## 📊 Comparación

| Aspecto | ANTES (import-time) | DESPUÉS (lazy init) |
|---------|---------------------|---------------------|
| **Build local** | ❌ Falla sin env vars | ✅ Exitoso |
| **Build Vercel** | ❌ Falla | ✅ Exitoso |
| **Runtime overhead** | N/A | Mínimo (primera llamada) |
| **Instancias** | 1 por proceso | 1 por proceso (singleton) |
| **Seguridad** | ❌ Expone necesidad de keys en build | ✅ Keys solo en runtime |

---

## 🧪 Testing

### **Verificar build local:**
```bash
# Sin environment variables
rm .env.local
npm run build
# ✅ Debe pasar (antes fallaba)
```

### **Verificar runtime:**
```bash
# Con environment variables
cp .env.example .env.local
# Llenar variables requeridas
npm run dev
# ✅ Endpoints funcionan normalmente
```

### **Verificar producción:**
```bash
curl -s -o /dev/null -w "%{http_code}" https://creatuactivo.com/
# ✅ 200 OK
```

---

## 🔐 Environment Variables Requeridas

### **Build-time (NO requeridas con lazy init):**
- Ninguna ✅

### **Runtime (Vercel Production):**
- `RESEND_API_KEY` - Para emails transaccionales
- `NEXT_PUBLIC_SUPABASE_URL` - URL de Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key (público)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role (privado)
- `ANTHROPIC_API_KEY` - Para NEXUS AI

**Configuración:** Vercel Dashboard → Settings → Environment Variables

---

## 📝 Commits Relacionados

1. **e4b1764** - Resend lazy initialization
2. **7ce63ee** - Supabase lazy initialization (fundadores)
3. **c930d68** - Supabase lazy initialization (nexus endpoints)

**Branch:** `main`
**Deploy:** Vercel Production
**URL:** https://creatuactivo.com/

---

## ✅ Verificación

- [x] Build local exitoso sin env vars
- [x] Build Vercel exitoso
- [x] Deploy completado
- [x] Homepage responde 200 OK
- [x] NEXUS funcional (saludo Jobs-style visible)
- [x] 4 archivos actualizados
- [x] Patrón aplicado consistentemente
- [x] Documentación completa

**Estado:** ✅ **COMPLETADO Y DESPLEGADO**
**Próximo:** Testing de funcionalidad NEXUS en producción

---

**Documento de referencia:** FIX_BUILD_TIME_LAZY_INIT_NOV17.md
**Última actualización:** 17 Noviembre 2025
