# 🚀 Upstash Kafka Setup Guide

Esta guía te ayudará a configurar Upstash Kafka para el pipeline asíncrono de NEXUS.

---

## 📋 Paso 1: Crear cuenta y cluster Kafka en Upstash

### 1.1 Registro
1. Ve a [https://upstash.com](https://upstash.com)
2. Crea una cuenta gratuita (GitHub, Google o email)
3. Confirma tu email

### 1.2 Crear Kafka Cluster
1. En el dashboard, click en **"Create Cluster"**
2. Configuración recomendada:
   - **Name:** `nexus-production` (o el nombre que prefieras)
   - **Region:** Selecciona la región más cercana a tus usuarios
   - **Type:** Multi-region (si está disponible) o Single region
   - **Tier:** Free tier (10,000 mensajes/día gratis)
3. Click **"Create"**

### 1.3 Crear Topic
1. Una vez creado el cluster, ve a la sección **"Topics"**
2. Click **"Create Topic"**
3. Configuración:
   - **Topic Name:** `nexus-prospect-ingestion`
   - **Partitions:** 1 (puedes aumentar después si necesitas mayor throughput)
   - **Retention Time:** 3 días (72 horas)
   - **Retention Size:** 1 GB
4. Click **"Create"**

---

## 🔑 Paso 2: Obtener Credenciales

### 2.1 Credenciales REST API
1. En tu cluster, ve a la pestaña **"REST API"**
2. Verás tres valores importantes:
   - **UPSTASH_KAFKA_REST_URL** (ej: `https://your-cluster.upstash.io`)
   - **UPSTASH_KAFKA_REST_USERNAME** (ej: `your-cluster-username`)
   - **UPSTASH_KAFKA_REST_PASSWORD** (un string largo)
3. **GUARDA ESTOS VALORES** - los necesitarás en el siguiente paso

---

## ⚙️ Paso 3: Configurar Variables de Entorno

### 3.1 En Vercel (Para el Producer API)

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en **"Settings"** → **"Environment Variables"**
3. Añade estas 3 variables:

```bash
UPSTASH_KAFKA_REST_URL=https://your-cluster.upstash.io
UPSTASH_KAFKA_REST_USERNAME=your-cluster-username
UPSTASH_KAFKA_REST_PASSWORD=your-long-password-string
```

4. Aplica las variables a **Production**, **Preview** y **Development**
5. Click **"Save"**

### 3.2 En Supabase (Para el Consumer Edge Function)

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Click en **"Edge Functions"** → **"Manage secrets"**
3. Añade estas 3 variables:

```bash
UPSTASH_KAFKA_REST_URL=https://your-cluster.upstash.io
UPSTASH_KAFKA_REST_USERNAME=your-cluster-username
UPSTASH_KAFKA_REST_PASSWORD=your-long-password-string
```

4. Click **"Save"**

> **Nota:** El Consumer también necesita las variables existentes:
> - `ANTHROPIC_API_KEY`
> - `SUPABASE_URL`
> - `SUPABASE_SERVICE_ROLE_KEY`

### 3.3 Local (.env.local)

Para desarrollo local, crea/actualiza tu archivo `.env.local`:

```bash
# Upstash Kafka
UPSTASH_KAFKA_REST_URL=https://your-cluster.upstash.io
UPSTASH_KAFKA_REST_USERNAME=your-cluster-username
UPSTASH_KAFKA_REST_PASSWORD=your-long-password-string

# Supabase (ya existentes)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Anthropic (ya existente)
ANTHROPIC_API_KEY=your-anthropic-key
```

---

## 🚢 Paso 4: Desplegar el Código

### 4.1 Desplegar Producer (Vercel)

El Producer ya está adaptado para usar Upstash Kafka. Solo necesitas redesplegar:

```bash
# Desde la raíz del proyecto
git add .
git commit -m "feat: Migrar a Upstash Kafka"
git push origin main
```

Vercel detectará el push y desplegará automáticamente.

### 4.2 Desplegar Consumer (Supabase Edge Function)

```bash
# Desplegar la Edge Function
npx supabase functions deploy nexus-consumer

# Verificar que se desplegó correctamente
npx supabase functions list
```

### 4.3 Configurar Cron Job para Consumer

El Consumer debe ejecutarse periódicamente para procesar mensajes de Kafka:

**Opción A: Vercel Cron Job**

1. Crea `vercel.json` en la raíz del proyecto:

```json
{
  "crons": [
    {
      "path": "/api/nexus/consumer-trigger",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

2. Crea el endpoint trigger en `src/app/api/nexus/consumer-trigger/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Trigger Supabase Edge Function
  const response = await fetch(
    `${supabaseUrl}/functions/v1/nexus-consumer`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();

  return NextResponse.json({
    status: 'triggered',
    consumerResponse: data,
  });
}
```

**Opción B: Supabase Cron Job**

1. Ve a Supabase Dashboard → Database → Cron Jobs
2. Crea un nuevo job:

```sql
-- Ejecutar cada 10 segundos
SELECT cron.schedule(
  'nexus-consumer-trigger',
  '*/10 * * * * *', -- Cada 10 segundos
  $$
  SELECT
    net.http_post(
      url:='YOUR_SUPABASE_URL/functions/v1/nexus-consumer',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
      body:='{}'::jsonb
    );
  $$
);
```

**Opción C: Upstash QStash (Recomendada)**

QStash es el scheduler serverless de Upstash, perfecto para este caso:

1. Ve a [Upstash Console](https://console.upstash.com) → QStash
2. Crea un nuevo schedule:
   - **URL:** `YOUR_SUPABASE_URL/functions/v1/nexus-consumer`
   - **Schedule:** `*/10 * * * * *` (cada 10 segundos)
   - **Headers:** `Authorization: Bearer YOUR_ANON_KEY`
3. Click **"Create"**

---

## ✅ Paso 5: Verificar el Setup

### 5.1 Test Producer

```bash
curl https://your-app.vercel.app/api/nexus/producer \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hola, me llamo Carlos"},
      {"role": "assistant", "content": "Hola Carlos, ¿en qué puedo ayudarte?"}
    ],
    "fingerprint": "test-fp-123",
    "sessionId": "test-session-456"
  }'
```

**Respuesta esperada (202 Accepted):**
```json
{
  "status": "accepted",
  "messageId": "abc123xyz",
  "kafka": {
    "offset": 0,
    "partition": 0
  },
  "message": "Your message has been queued for processing",
  "estimatedProcessingTime": "2-5 seconds"
}
```

### 5.2 Verificar en Upstash Console

1. Ve a tu cluster → Topics → `nexus-prospect-ingestion`
2. Click en **"Messages"**
3. Deberías ver el mensaje que acabas de enviar
4. Verifica que el offset incrementa

### 5.3 Verificar Consumer Logs

```bash
# Ver logs del Consumer en Supabase
npx supabase functions logs nexus-consumer --tail
```

Deberías ver:
```
🟢 [CONSUMIDOR] Iniciando procesamiento de Kafka...
📨 [CONSUMIDOR] Procesando mensaje: {...}
🤖 [CONSUMIDOR] Llamando a Claude API...
✅ [CONSUMIDOR] Datos extraídos: {...}
💾 [CONSUMIDOR] Guardando datos en BD...
✅ [CONSUMIDOR] Procesamiento completado en 1234ms
```

### 5.4 Verificar Datos en Supabase

```sql
-- Verificar que los datos se guardaron
SELECT
  fingerprint_id,
  prospect_data,
  created_at,
  updated_at
FROM prospect_tracking
WHERE fingerprint_id = 'test-fp-123'
ORDER BY updated_at DESC
LIMIT 1;
```

---

## 📊 Monitoreo y Métricas

### En Upstash Console

1. **Overview Dashboard:**
   - Mensajes producidos/consumidos
   - Latencia promedio
   - Consumer lag

2. **Topic Metrics:**
   - Total messages
   - Throughput (msg/sec)
   - Disk usage

3. **Consumer Groups:**
   - `nexus-consumer-group` status
   - Current offset vs latest offset
   - Lag (mensajes pendientes)

### Comandos Útiles

```bash
# Health check del Producer
curl https://your-app.vercel.app/api/nexus/producer

# Ver logs del Consumer en tiempo real
npx supabase functions logs nexus-consumer --tail

# Ver métricas de la cola en Supabase
SELECT pgmq_metrics('nexus-prospect-ingestion');
```

---

## 🔧 Troubleshooting

### Error: "Kafka credentials not configured"

**Solución:** Verifica que las 3 variables de entorno estén configuradas en Vercel/Supabase.

```bash
# Verificar en local
echo $UPSTASH_KAFKA_REST_URL
echo $UPSTASH_KAFKA_REST_USERNAME
echo $UPSTASH_KAFKA_REST_PASSWORD
```

### Error: "Failed to produce message"

**Solución:**
1. Verifica que el topic `nexus-prospect-ingestion` existe en Upstash
2. Verifica que las credenciales sean correctas
3. Revisa los logs en Vercel: `vercel logs`

### Consumer no procesa mensajes

**Solución:**
1. Verifica que el Cron Job esté activo
2. Revisa los logs: `npx supabase functions logs nexus-consumer`
3. Verifica el consumer lag en Upstash Console
4. Asegúrate de que el Consumer tenga todas las variables de entorno

### Mensajes se procesan pero no se guardan en Supabase

**Solución:**
1. Verifica que `SUPABASE_SERVICE_ROLE_KEY` esté configurado
2. Verifica que la función RPC `update_prospect_data` existe:
   ```sql
   SELECT routine_name
   FROM information_schema.routines
   WHERE routine_name = 'update_prospect_data';
   ```
3. Revisa los logs del Consumer para ver errores específicos

---

## 💰 Pricing

### Upstash Kafka - Free Tier
- **Mensajes:** 10,000 por día
- **Throughput:** 100 KB/s
- **Retention:** 3 días
- **Consumer groups:** 10

### Upstash Kafka - Pay As You Go
- **Mensajes:** $0.20 por 100,000 mensajes
- **Throughput:** $1.00 por 1 MB/s mensual
- **Storage:** $0.25 por GB mensual

**Ejemplo:** Para 100,000 conversaciones/mes:
- Producer: 100K mensajes = $0.20
- Consumer: 100K mensajes = $0.20
- **Total:** ~$0.40/mes

---

## 📚 Recursos

- [Upstash Kafka Docs](https://docs.upstash.com/kafka)
- [Upstash Next.js Example](https://github.com/upstash/examples/tree/main/nextjs-kafka)
- [Upstash QStash Docs](https://docs.upstash.com/qstash)
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)

---

## ✅ Checklist de Despliegue

- [ ] Cluster Kafka creado en Upstash
- [ ] Topic `nexus-prospect-ingestion` creado
- [ ] Variables de entorno configuradas en Vercel
- [ ] Variables de entorno configuradas en Supabase
- [ ] Producer desplegado en Vercel
- [ ] Consumer desplegado en Supabase Edge Functions
- [ ] Cron Job configurado (Vercel/Supabase/QStash)
- [ ] Test del Producer exitoso (202 Accepted)
- [ ] Mensaje visible en Upstash Console
- [ ] Consumer procesa y guarda datos en Supabase
- [ ] Monitoreo configurado

---

**¡Listo!** Tu pipeline asíncrono con Upstash Kafka está funcionando. 🎉
