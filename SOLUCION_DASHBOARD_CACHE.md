# 🔧 Solución: Dashboard Mostrando Datos Antiguos

## 🔍 Problema Identificado

El dashboard en producción (`https://app.creatuactivo.com`) muestra:
- 10 prospectos
- 1 constructor

Pero la base de datos Supabase tiene:
- 0 prospectos
- 0 constructores (excepto sistema@creatuactivo.com)

**Causa:** Caché de servidor o deployment antiguo.

---

## ✅ Solución: Forzar Redeploy del Dashboard

### Opción 1: Redeploy en Vercel (RECOMENDADO)

1. Ve a tu dashboard de Vercel: https://vercel.com
2. Busca el proyecto **CreaTuActivo-Dashboard**
3. Ve a la pestaña **Deployments**
4. Click en el último deployment exitoso
5. Click en el botón **"Redeploy"** con la opción **"Use existing Build Cache"** DESMARCADA
6. Espera a que termine el deployment (~2-3 minutos)

### Opción 2: Push Vacío a GitHub

Si el Dashboard está conectado a GitHub y auto-deploya:

```bash
cd /Users/luiscabrejo/CreaTuActivo-Dashboard

# Hacer un commit vacío para forzar redeploy
git commit --allow-empty -m "🔄 Force redeploy - clear cache"

# Push
git push origin main
```

### Opción 3: Invalidar Cache de API Routes

Agrega headers de no-cache a las APIs del Dashboard:

1. Edita `/Users/luiscabrejo/CreaTuActivo-Dashboard/src/app/api/admin/dashboard-stats/route.ts`
2. Agrega al final del return:

```typescript
return NextResponse.json(
  { success: true, stats: { ... } },
  {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  }
)
```

3. Haz lo mismo en `/api/admin/prospectos/route.ts`
4. Commit y push

---

## 🧪 Verificación Post-Deploy

Después del redeploy:

1. Abre el dashboard en **modo incógnito**
2. Ve a `https://app.creatuactivo.com/admin`
3. Abre DevTools → Network
4. Busca el request a `/api/admin/dashboard-stats`
5. Verifica que el Response sea:

```json
{
  "success": true,
  "stats": {
    "totalProspectos": 0,
    "enIniciar": 0,
    "enAcoger": 0,
    "enActivar": 0,
    "totalConstructores": 0,
    "prospectosMes": 0
  }
}
```

---

## 📝 Alternativa: Pruebas Locales Primero

Si prefieres probar localmente antes de tocar producción:

```bash
cd /Users/luiscabrejo/CreaTuActivo-Dashboard

# Instalar dependencias (si no lo has hecho)
npm install

# Correr localmente
npm run dev
```

Abre `http://localhost:3000/admin` y verifica que muestre 0 prospectos.

Si funciona localmente, el problema es definitivamente caché de producción.

---

## 🎯 Siguiente Paso

Una vez el dashboard muestre **0 prospectos/constructores**, proceder con:

1. ✅ Prueba de captura desde formulario `/fundadores`
2. ✅ Verificar que aparezca en el dashboard
3. ✅ Prueba de captura desde NEXUS chat
4. ✅ Verificar integración completa
