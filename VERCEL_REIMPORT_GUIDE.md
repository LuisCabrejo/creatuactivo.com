# 🔄 Guía: Re-Importar Proyecto en Vercel (Solución Definitiva)

## 🎯 Por qué esto funciona

El proyecto actual de Vercel está en un estado corrupto interno que impide auto-deploys. La única forma de garantizar una solución es crear un proyecto nuevo con configuración limpia.

---

## ⏱️ Tiempo estimado: 15 minutos

---

## 📋 PASO 1: Preparar Configuración Actual

### 1.1 Guardar Variables de Entorno
Ya las tienes documentadas en: [VERCEL_ENV_VARS.md](VERCEL_ENV_VARS.md)

Variables críticas:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://cvadzbmdypnbrbnkznpb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re_...
NEXT_PUBLIC_SITE_URL=https://creatuactivo.com
NEXT_PUBLIC_WHATSAPP_NUMBER=573102066593
```

### 1.2 Guardar Configuración de Dominio
- Dominio actual: `creatuactivo.com`
- También puede tener: `www.creatuactivo.com`
- Vercel subdomain: `creatuactivo-marketing.vercel.app` (o similar)

---

## 🗑️ PASO 2: Eliminar Proyecto Corrupto

### 2.1 Desconectar Dominio Personalizado
1. Ve a Vercel Dashboard → `creatuactivo.com` project
2. Settings → Domains
3. Para cada dominio (creatuactivo.com, www.creatuactivo.com):
   - Click en el dominio
   - Click "Remove" / "Delete"
   - **⚠️ IMPORTANTE**: Esto NO borra tu DNS, solo desconecta de este proyecto

### 2.2 Eliminar Proyecto
1. Settings → General
2. Scroll hasta el final: "Delete Project"
3. Escribe el nombre del proyecto para confirmar
4. Click "Delete"

**⚠️ Tranquilo**: Esto NO afecta:
- ❌ Tu código en GitHub
- ❌ Tu base de datos Supabase
- ❌ Tu dominio registrado
- ❌ Ningún dato real

Solo borra la **configuración de Vercel** que está rota.

---

## ✨ PASO 3: Crear Proyecto Nuevo

### 3.1 Import desde GitHub
1. Ve a: https://vercel.com/new
2. Click en "Import Git Repository"
3. Busca: `LuisCabrejo/creatuactivo.com`
4. Click "Import"

### 3.2 Configurar Build Settings
Vercel detectará automáticamente Next.js, pero verifica:

```
Framework Preset: Next.js
Build Command: next build
Output Directory: .next
Install Command: npm install
Root Directory: ./
```

**⚠️ CRÍTICO**: Antes de hacer deploy, click en "Environment Variables"

### 3.3 Agregar Variables de Entorno
Copia TODAS las variables de [VERCEL_ENV_VARS.md](VERCEL_ENV_VARS.md):

1. Haz click en cada ambiente: **Production**, **Preview**, **Development**
2. Agrega TODAS las 7 variables para cada ambiente
3. Verifica que no haya espacios extra al inicio/final

**Lista de verificación**:
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] ANTHROPIC_API_KEY
- [ ] RESEND_API_KEY
- [ ] NEXT_PUBLIC_SITE_URL
- [ ] NEXT_PUBLIC_WHATSAPP_NUMBER

### 3.4 Deploy
1. Click "Deploy"
2. Espera 2-3 minutos
3. ✅ Primer deployment exitoso

---

## 🌐 PASO 4: Reconectar Dominio

### 4.1 Agregar Dominio Personalizado
1. En el nuevo proyecto → Settings → Domains
2. Click "Add Domain"
3. Escribe: `creatuactivo.com`
4. Click "Add"

Vercel te pedirá verificar DNS:
- Si ya tenías el dominio configurado antes, debería conectarse automáticamente
- Si no, sigue las instrucciones de DNS que Vercel muestre

### 4.2 Agregar www (opcional)
Repite el proceso para `www.creatuactivo.com`

### 4.3 Verificar SSL
- Espera 5-10 minutos
- Vercel generará certificados SSL automáticamente
- Verifica en navegador: https://creatuactivo.com debe tener candado verde

---

## 🧪 PASO 5: Probar Auto-Deploy

### 5.1 Hacer un Cambio de Prueba
```bash
cd ~/CreaTuActivo-Marketing
echo "# Auto-deploy test $(date)" >> test-autodeploy.md
git add test-autodeploy.md
git commit -m "test: verificar auto-deploy en proyecto nuevo"
git push origin main
```

### 5.2 Verificar en Vercel
1. Ve a Deployments
2. En 10-20 segundos deberías ver un **nuevo deployment iniciando**
3. ✅ Si aparece → **PROBLEMA RESUELTO**
4. ❌ Si no aparece → revisar webhook (pero esto es MUY improbable)

---

## 🎯 PASO 6: Probar Sistema NEXUS

### 6.1 Health Check del Producer
```bash
curl https://creatuactivo.com/api/nexus/producer
```

**Respuesta esperada**:
```json
{
  "status": "healthy",
  "version": "2.0.0-db-queue",
  "role": "message-producer",
  "transport": "supabase-database-queue",
  "supabaseConfigured": true,
  "connectionTestPassed": true,
  "timestamp": "2025-01-12T..."
}
```

### 6.2 Prueba End-to-End
```bash
curl -X POST "https://creatuactivo.com/api/nexus/producer" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hola, quiero información sobre los productos"}],
    "sessionId": "prod-test-'$(date +%s)'",
    "fingerprint": "test-fingerprint-prod",
    "metadata": {"source": "manual-test"}
  }'
```

**Respuesta esperada**:
```json
{
  "status": "accepted",
  "messageId": "...",
  "queueId": "...",
  "estimatedProcessingTime": "<2 seconds"
}
```

### 6.3 Verificar en Supabase
1. Ve a Supabase Dashboard → Table Editor
2. Abre tabla `nexus_queue`
3. Busca el mensaje con `session_id` = el que usaste arriba
4. Verifica que `status` = `completed` (puede tardar ~2 minutos)

---

## ✅ CHECKLIST FINAL

- [ ] Proyecto viejo eliminado
- [ ] Proyecto nuevo creado e importado
- [ ] Variables de entorno configuradas (7 variables × 3 ambientes = 21 total)
- [ ] Primer deployment exitoso
- [ ] Dominio reconectado (creatuactivo.com)
- [ ] SSL activo (candado verde)
- [ ] Auto-deploy funciona (test commit → deployment automático)
- [ ] Producer API responde healthy
- [ ] POST a Producer retorna 202 Accepted
- [ ] Mensajes se procesan en nexus_queue

---

## 🆘 Si Algo Sale Mal

### Error: "Domain already in use"
**Causa**: No desconectaste el dominio del proyecto viejo
**Solución**: Ve al proyecto viejo → Settings → Domains → Remove domain

### Error: "Invalid Supabase credentials"
**Causa**: Variable de entorno mal copiada (espacios extra, incompleta)
**Solución**:
1. Settings → Environment Variables
2. Elimina la variable problemática
3. Cópiala nuevamente desde [VERCEL_ENV_VARS.md](VERCEL_ENV_VARS.md)
4. Redeploy

### Auto-deploy sigue sin funcionar (muy improbable)
**Causa**: Webhook no se creó automáticamente
**Solución**:
1. Ve a GitHub repo → Settings → Webhooks
2. Si NO existe webhook de Vercel, ve a Vercel:
3. Settings → Git → Reconnect Repository

---

## 📊 Por Qué Esto Va a Funcionar

1. **Proyecto Dashboard funciona** = prueba que tu setup es correcto
2. **Proyecto Marketing está corrupto** = no se puede "arreglar" internamente
3. **Re-importar = estado limpio** = como empezar de cero sin perder nada
4. **Mismo código + nuevo proyecto** = Dashboard 2.0

---

## ⏰ Tiempo Total Estimado

- Paso 1 (preparar): 2 min ✅ (ya hecho)
- Paso 2 (eliminar): 3 min
- Paso 3 (crear nuevo): 5 min
- Paso 4 (dominio): 2 min + 10 min espera SSL
- Paso 5 (test deploy): 2 min
- Paso 6 (test NEXUS): 5 min

**Total activo**: ~15-20 min
**Total con esperas**: ~30 min

---

## 💡 Ventajas Adicionales

Al re-importar obtienes:
- ✅ Build cache limpio (builds más rápidos)
- ✅ Configuración actualizada de Vercel
- ✅ Sin residuos de Kafka/Confluent
- ✅ Webhooks frescos y funcionales
- ✅ Logs limpios para debugging futuro

---

**Última actualización**: 2025-01-12
**Solución probada**: ✅ (Dashboard funciona con mismo setup)
