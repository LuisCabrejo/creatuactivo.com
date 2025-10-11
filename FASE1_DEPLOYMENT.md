# Fase 1 - Guía de Despliegue del Pipeline Asíncrono

## ✅ Completado hasta ahora:

1. ✅ Cola `nexus-prospect-ingestion` creada en Supabase
2. ✅ Endpoint Productor creado: `/api/nexus/producer`
3. ✅ Edge Function Consumidor creada: `nexus-consumer`
4. ✅ Funciones RPC de pgmq creadas

## 🚀 Pasos de Despliegue

### Paso 1: Ejecutar Migraciones SQL

Ejecuta este SQL en tu Supabase SQL Editor:

```sql
-- Copiar y pegar el contenido de:
-- supabase/migrations/001_pgmq_functions.sql
```

**Verificación:**
```sql
-- Debe retornar las 5 funciones
SELECT routine_name
FROM information_schema.routines
WHERE routine_name LIKE 'pgmq_%';
```

### Paso 2: Desplegar Edge Function

Necesitas tener instalado [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
# Instalar CLI si no lo tienes
npm install -g supabase

# Autenticarte
supabase login

# Vincular tu proyecto (usa el Reference ID de tu proyecto Supabase)
supabase link --project-ref <TU_PROJECT_REF>

# Desplegar la función
supabase functions deploy nexus-consumer

# Verificar que se desplegó
supabase functions list
```

### Paso 3: Configurar Variables de Entorno para Edge Function

En tu Supabase Dashboard → Edge Functions → nexus-consumer → Settings:

```bash
ANTHROPIC_API_KEY=<tu_key>
SUPABASE_URL=<tu_supabase_url>
SUPABASE_SERVICE_ROLE_KEY=<tu_service_role_key>
```

**O vía CLI:**

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set SUPABASE_URL=https://xxxxx.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

### Paso 4: Configurar Cron Job

En Supabase Dashboard → Database → Cron Jobs → Create a new cron job:

**Configuración:**
- **Name**: `nexus-consumer-processor`
- **Schedule**: `*/10 * * * *` (cada 10 segundos)
- **SQL Command**:

```sql
SELECT
  net.http_post(
    url := 'https://<TU_PROJECT_REF>.supabase.co/functions/v1/nexus-consumer',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || '<TU_ANON_KEY>' || '"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
```

**Nota**: Reemplaza `<TU_PROJECT_REF>` y `<TU_ANON_KEY>` con tus valores reales.

**O vía pg_cron (más eficiente):**

```sql
-- Primero habilita pg_cron si no está habilitado
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Crear el cron job
SELECT cron.schedule(
  'nexus-consumer-processor',
  '*/10 * * * *', -- Cada 10 segundos
  $$
  SELECT
    net.http_post(
      url := 'https://<TU_PROJECT_REF>.supabase.co/functions/v1/nexus-consumer',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer <TU_ANON_KEY>"}'::jsonb,
      body := '{}'::jsonb
    ) as request_id;
  $$
);

-- Verificar que se creó
SELECT * FROM cron.job;
```

### Paso 5: Testing del Pipeline

#### Test 1: Health Check del Productor

```bash
curl http://localhost:3000/api/nexus/producer
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "version": "1.0.0-producer",
  "role": "message-producer",
  "queue": {
    "name": "nexus-prospect-ingestion",
    "metrics": { ... }
  }
}
```

#### Test 2: Enviar Mensaje de Prueba

```bash
curl -X POST http://localhost:3000/api/nexus/producer \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hola"},
      {"role": "assistant", "content": "Hola, ¿en qué puedo ayudarte?"},
      {"role": "user", "content": "Me llamo Carlos y quiero información sobre los paquetes"}
    ],
    "fingerprint": "test-fingerprint-123",
    "sessionId": "test-session-456"
  }'
```

**Respuesta esperada:**
```json
{
  "status": "accepted",
  "messageId": 1234567890,
  "message": "Your message has been queued for processing",
  "estimatedProcessingTime": "2-5 seconds"
}
```

#### Test 3: Verificar Cola

En Supabase SQL Editor:

```sql
-- Ver mensajes en cola
SELECT * FROM pgmq.q_nexus_prospect_ingestion;

-- Ver métricas
SELECT * FROM pgmq_metrics('nexus-prospect-ingestion');
```

#### Test 4: Invocar Consumidor Manualmente

```bash
# Obtén tu función URL del dashboard
curl -X POST https://<TU_PROJECT_REF>.supabase.co/functions/v1/nexus-consumer \
  -H "Authorization: Bearer <TU_ANON_KEY>" \
  -H "Content-Type: application/json"
```

**Respuesta esperada (con mensaje en cola):**
```json
{
  "status": "success",
  "msgId": 1234567890,
  "sessionId": "test-session-456",
  "extractedData": {
    "nombre": "Carlos",
    "nivel_interes": 7,
    ...
  }
}
```

#### Test 5: Verificar Datos en BD

```sql
-- Ver datos del prospecto capturado
SELECT * FROM prospect_data
WHERE fingerprint_id = 'test-fingerprint-123';
```

## 🔍 Monitoreo

### Logs de Edge Function

En Supabase Dashboard → Edge Functions → nexus-consumer → Logs

Busca:
- `🟢 [CONSUMIDOR] Iniciando procesamiento`
- `✅ [CONSUMIDOR] Procesamiento completado`
- `❌ [CONSUMIDOR] Error` (si hay problemas)

### Métricas de Cola

```sql
-- Query para monitoreo continuo
SELECT
  queue_name,
  queue_length,
  oldest_msg_age_sec,
  newest_msg_age_sec,
  total_messages
FROM pgmq_metrics('nexus-prospect-ingestion');
```

### Alertas Recomendadas

1. **Cola creciendo**: Si `queue_length > 100`, aumentar frecuencia del cron
2. **Mensajes viejos**: Si `oldest_msg_age_sec > 300`, revisar consumidor
3. **Errores de procesamiento**: Monitorear logs de Edge Function

## ⚠️ Troubleshooting

### Problema: Mensajes no se encolan

**Check:**
```sql
-- Verificar permisos
SELECT has_function_privilege('anon', 'pgmq_send(text, jsonb, integer)', 'EXECUTE');
```

**Fix:**
```sql
GRANT EXECUTE ON FUNCTION pgmq_send TO anon, authenticated;
```

### Problema: Edge Function no procesa

**Check:**
1. Variables de entorno configuradas
2. Cron job activo: `SELECT * FROM cron.job;`
3. Logs de Edge Function para errores

### Problema: Datos no se guardan

**Check:**
```sql
-- Verificar función existe
SELECT routine_name FROM information_schema.routines
WHERE routine_name = 'update_prospect_data';
```

## 📊 Criterios de Éxito (Fase 1)

- [ ] Productor acepta mensajes y retorna 202 en <100ms
- [ ] Mensajes se encolan correctamente en pgmq
- [ ] Consumidor procesa mensajes sin errores
- [ ] Datos extraídos se guardan en `prospect_data`
- [ ] Cola se vacía (mensajes procesados)
- [ ] Logs muestran trazabilidad completa
- [ ] Reintentos automáticos funcionan (simular fallo)

## 🎯 Próximos Pasos

Una vez validado el pipeline backend, procederemos a:

1. **Paso 2**: Refactorizar frontend (corregir race condition)
2. **Paso 3**: Consolidar componentes UI
3. **Testing E2E**: Validar flujo completo usuario → cola → procesamiento → BD

---

**Documentación generada:** Fase 1 - Pipeline Asíncrono
**Fecha:** 2025-10-10
**Versión:** 1.0.0
