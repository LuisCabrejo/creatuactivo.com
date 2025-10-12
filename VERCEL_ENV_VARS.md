# Variables de Entorno Requeridas para Vercel

Este documento lista todas las variables de entorno que deben configurarse en Vercel para que el sistema NEXUS DB Queue funcione correctamente.

## 📋 Configuración en Vercel Dashboard

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto: **creatuactivo-marketing** (o el nombre que tengas)
3. Ve a: **Settings** → **Environment Variables**
4. Agrega las siguientes variables para **Production**, **Preview**, y **Development**

---

## 🔑 Variables de Entorno Obligatorias

### Supabase (Base de datos y autenticación)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://cvadzbmdypnbrbnkznpb.supabase.co
```
- **Descripción**: URL pública de tu proyecto Supabase
- **Dónde obtenerla**: Supabase Dashboard → Project Settings → API → Project URL
- **Importante**: Debe incluir `https://` y terminar en `.supabase.co`

```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2YWR6Ym1keXBuYnJibmt6bnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4OTI3MzIsImV4cCI6MjA3MTQ2ODczMn0.PiykWLSJXvL5J6c-9WPQXf-FJ9rIwXWIIWPMbFLv6co
```
- **Descripción**: Clave pública anónima (sin permisos elevados)
- **Dónde obtenerla**: Supabase Dashboard → Project Settings → API → Project API keys → `anon` `public`
- **Uso**: Operaciones del lado del cliente (frontend)

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2YWR6Ym1keXBuYnJibmt6bnBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTg5MjczMiwiZXhwIjoyMDcxNDY4NzMyfQ.e0LTZZTFc1-cAwpdU2knfD5cCz_1LkGxNlYl2qIk7zI
```
- **Descripción**: Clave secreta con permisos administrativos
- **Dónde obtenerla**: Supabase Dashboard → Project Settings → API → Project API keys → `service_role` `secret`
- **⚠️ CRÍTICO**: NUNCA expongas esta clave públicamente, solo úsala en el servidor
- **Uso**: Operaciones del lado del servidor (API routes, Edge Functions)

---

### Anthropic Claude API (NEXUS chatbot)

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```
- **Descripción**: API key para usar Claude Sonnet 4
- **Dónde obtenerla**: https://console.anthropic.com/settings/keys
- **Uso**: Procesamiento de mensajes en Edge Function `nexus-queue-processor`
- **⚠️ IMPORTANTE**: Esta clave también debe estar configurada en Supabase Edge Functions (ya configurada)

---

### Resend (Servicio de emails)

```bash
RESEND_API_KEY=re_...
```
- **Descripción**: API key para enviar emails transaccionales
- **Dónde obtenerla**: https://resend.com/api-keys
- **Uso**: Notificaciones de nuevos prospectos, escalaciones a consultores

---

### Configuración del Sitio

```bash
NEXT_PUBLIC_SITE_URL=https://creatuactivo.com
```
- **Descripción**: URL base de tu sitio en producción
- **Uso**: Generación de enlaces absolutos, tracking, redirects

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=573102066593
```
- **Descripción**: Número de WhatsApp para escalación (Liliana Moreno)
- **Formato**: Sin `+`, solo dígitos (código país + número)
- **Uso**: Botón de escalación en NEXUS cuando el prospecto está listo

---

## 🔍 Verificación de Variables

Después de configurar las variables en Vercel:

1. **Redeploy** el proyecto desde Vercel Dashboard (Deployments → Redeploy)
2. Espera 1-2 minutos a que termine el deployment
3. Prueba el health check del Producer:

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
  "timestamp": "2025-10-12T16:30:00.000Z"
}
```

---

## ❌ Errores Comunes

### Error: "Port should be >= 0 and < 65536"
- **Causa**: `NEXT_PUBLIC_SUPABASE_URL` no está configurada o está vacía
- **Solución**: Verifica que la variable esté en **Production** environment en Vercel

### Error: "Invalid JWT"
- **Causa**: `SUPABASE_SERVICE_ROLE_KEY` incorrecta o expirada
- **Solución**: Copia nuevamente la clave desde Supabase Dashboard → API Settings

### Error: "Failed to connect"
- **Causa**: La URL de Supabase no tiene el formato correcto
- **Solución**: Debe ser `https://[tu-proyecto].supabase.co` (con https:// al inicio)

---

## 📝 Notas Adicionales

- **¿Qué ambientes configurar?** Configura las mismas variables para **Production**, **Preview**, y **Development**
- **¿Cuándo toma efecto?** Las variables se aplican en el próximo deployment, no inmediatamente
- **¿Variables sensibles?** `SUPABASE_SERVICE_ROLE_KEY` y `ANTHROPIC_API_KEY` son secretas, las demás pueden ser públicas
- **¿Actualizaciones?** Si cambias variables existentes, debes hacer redeploy manualmente

---

## 🚀 Deployment Checklist

- [ ] Todas las variables configuradas en Vercel
- [ ] Redeploy manual activado desde Dashboard
- [ ] Health check responde correctamente
- [ ] Prueba POST exitosa al Producer API
- [ ] Verificar en Supabase que mensajes llegan a `nexus_queue`
- [ ] Confirmar que Edge Function procesa mensajes (status → `completed`)

---

**Última actualización**: 2025-10-12
**Versión del sistema**: 2.0.0 (DB Queue Architecture)
