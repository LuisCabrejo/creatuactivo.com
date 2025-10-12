# 🚀 Despliegue del Sistema de Cola de Base de Datos NEXUS

## Resumen de la Nueva Arquitectura

Hemos migrado de **Kafka + Vercel Pro** a **Supabase Database Queue** (GRATIS).

### Ventajas:
- ✅ **$0/mes** (vs $20+/mes Vercel Pro + Confluent)
- ✅ **Latencia <2s** (vs ~30-60s con polling)
- ✅ **Más simple** (menos dependencias externas)
- ✅ **Idempotencia nativa** (UNIQUE constraint en session_id)
- ✅ **Debugging fácil** (ver cola en Supabase Dashboard)

### Arquitectura:

```
Usuario → NEXUS Widget → /api/nexus/producer → Supabase Table (nexus_queue)
                                                       ↓ (DB Trigger)
                                              Supabase Edge Function
                                                       ↓
                                        Claude API + update_prospect_data RPC
```

---

## 📋 Pasos de Despliegue

### **Paso 1: Aplicar Migración SQL en Supabase**

1. Ve a **Supabase Dashboard** → Tu Proyecto → **SQL Editor**
2. Click en **New Query**
3. Abre el archivo [`supabase/APPLY_MANUALLY.sql`](supabase/APPLY_MANUALLY.sql)
4. Copia y pega todo el contenido
5. Click en **Run**
6. Verifica que veas: `Migration applied successfully!`

**Qué hace este script**:
- Habilita extensión `pg_net`
- Crea tabla `nexus_queue`
- Crea funciones RPC: `enqueue_nexus_message`, `update_queue_status`, `cleanup_old_nexus_queue`
- Habilita Row Level Security

---

### **Paso 2: Desplegar Edge Function**

```bash
cd /Users/luiscabrejo/CreaTuActivo-Marketing

# Desplegar la Edge Function
npx supabase functions deploy nexus-queue-processor

# Verificar que se desplegó correctamente
npx supabase functions list
```

**Salida esperada**:
```
SLUG                    | VERSION | CREATED AT
------------------------|---------|------------
nexus-queue-processor   | 1       | YYYY-MM-DD
```

---

### **Paso 3: Configurar Secrets en Supabase**

```bash
# Ya deberías tener estos secrets configurados
npx supabase secrets list

# Si falta alguno, agrégalo:
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
npx supabase secrets set SUPABASE_URL=https://cvadzbmdypnbrbnkznpb.supabase.co
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

### **Paso 4: Crear Trigger de Base de Datos**

⚠️ **IMPORTANTE**: Solo ejecuta este paso DESPUÉS de completar los Pasos 1-3.

1. Ve a **Supabase Dashboard** → **SQL Editor** → **New Query**
2. Abre el archivo [`supabase/CREATE_TRIGGER_AFTER_FUNCTION.sql`](supabase/CREATE_TRIGGER_AFTER_FUNCTION.sql)
3. **REEMPLAZA** `cvadzbmdypnbrbnkznpb` con tu **Project ID real** (líneas 18 y 34)
4. Copia y pega el contenido modificado
5. Click en **Run**
6. Verifica que veas: `Trigger creado exitosamente!`

**Qué hace este script**:
- Crea función `invoke_nexus_processor()` que llama a la Edge Function
- Crea trigger `on_nexus_message_inserted` que se dispara en INSERT
- Inserta un mensaje de prueba
- Verifica que el mensaje se procesó (status = 'completed')

---

### **Paso 5: Desplegar Producer a Vercel**

El Producer ya fue actualizado para usar la cola de base de datos.

```bash
# Commit y push
git add .
git commit -m "✅ Migrar a DB Queue - Eliminar dependencia de Kafka"
git push origin main
```

Vercel desplegará automáticamente. Verifica en el Dashboard que el deployment fue exitoso.

---

### **Paso 6: Probar Flujo End-to-End**

#### 6.1. Probar Health Check del Producer

```bash
curl https://tu-dominio.vercel.app/api/nexus/producer
```

**Salida esperada**:
```json
{
  "status": "healthy",
  "version": "2.0.0-db-queue",
  "transport": "supabase-database-queue",
  "rpcTestPassed": true
}
```

#### 6.2. Enviar Mensaje de Prueba

```bash
curl -X POST https://tu-dominio.vercel.app/api/nexus/producer \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hola, me llamo Juan Pérez"},
      {"role": "assistant", "content": "Hola Juan, ¿en qué puedo ayudarte?"},
      {"role": "user", "content": "Quiero saber sobre las oportunidades de inversión"}
    ],
    "sessionId": "test-'$(date +%s)'",
    "fingerprint": "test-fingerprint-456"
  }'
```

**Salida esperada**:
```json
{
  "status": "accepted",
  "messageId": "xyz123",
  "queueId": "uuid-here",
  "estimatedProcessingTime": "<2 seconds"
}
```

#### 6.3. Verificar Procesamiento en Supabase

1. Ve a **Supabase Dashboard** → **Table Editor** → `nexus_queue`
2. Busca el mensaje con el `session_id` que usaste
3. Verifica que `status = 'completed'`
4. Verifica que `processed_at` tiene un timestamp reciente
5. Si `status = 'failed'`, revisa `error_message`

#### 6.4. Verificar Datos Guardados

1. Ve a **Table Editor** → `prospect_data`
2. Busca el registro con `fingerprint_id = 'test-fingerprint-456'`
3. Deberías ver:
   ```json
   {
     "nombre": "Juan Pérez",
     "nivel_interes": 7,
     "arquetipo": "profesional_vision",
     "momento_optimo": "caliente"
   }
   ```

---

### **Paso 7: Monitorear Logs**

#### Logs de Edge Function:
```bash
# Ver logs en tiempo real
npx supabase functions logs nexus-queue-processor --tail
```

#### Logs de Producer (Vercel):
1. Ve a **Vercel Dashboard** → Tu Proyecto → **Logs**
2. Filtra por `/api/nexus/producer`

---

## 🧹 Limpieza de Código Legacy (Opcional)

Una vez que confirmes que el sistema funciona correctamente, puedes eliminar:

```bash
# Archivos de Kafka
rm -rf src/app/api/nexus/consumer-cron
rm -rf supabase/functions/nexus-consumer
rm -rf supabase/migrations/legacy

# Eliminar dependencias de Kafka de package.json
# (kafkajs ya no es necesario)
npm uninstall kafkajs

# Commit limpieza
git add .
git commit -m "🧹 Eliminar código legacy de Kafka"
git push origin main
```

---

## 🔍 Troubleshooting

### Problema: Mensaje se queda en status = 'pending'

**Causa**: El trigger no se disparó o la Edge Function no se invocó.

**Solución**:
1. Verifica que el trigger existe:
   ```sql
   SELECT * FROM information_schema.triggers
   WHERE trigger_name = 'on_nexus_message_inserted';
   ```
2. Verifica logs de la Edge Function:
   ```bash
   npx supabase functions logs nexus-queue-processor --tail
   ```
3. Verifica que la Edge Function esté desplegada:
   ```bash
   npx supabase functions list
   ```

---

### Problema: status = 'failed' con error_message

**Causa**: Error durante el procesamiento (Claude API, RPC, etc.)

**Solución**:
1. Lee el `error_message` en la tabla `nexus_queue`
2. Si es error de Claude API: verifica ANTHROPIC_API_KEY
3. Si es error de RPC: verifica que la función `update_prospect_data` existe
4. Revisa logs completos:
   ```bash
   npx supabase functions logs nexus-queue-processor --tail
   ```

---

### Problema: Producer devuelve error 500

**Causa**: RPC `enqueue_nexus_message` no existe o falló.

**Solución**:
1. Verifica que aplicaste `APPLY_MANUALLY.sql` correctamente
2. Verifica que la función RPC existe:
   ```sql
   SELECT routine_name FROM information_schema.routines
   WHERE routine_name = 'enqueue_nexus_message';
   ```
3. Prueba el RPC manualmente en SQL Editor:
   ```sql
   SELECT enqueue_nexus_message(
     '[{"role": "user", "content": "test"}]'::jsonb,
     'test-session-123',
     'test-fingerprint',
     '{}'::jsonb
   );
   ```

---

## 📊 Monitoreo de Salud del Sistema

### Query para ver estado de la cola:

```sql
SELECT
  status,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (processed_at - created_at))) as avg_processing_time_sec
FROM nexus_queue
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY status;
```

**Salida esperada**:
```
status      | count | avg_processing_time_sec
------------|-------|------------------------
pending     |  0    | NULL
processing  |  0    | NULL
completed   | 142   | 1.8
failed      |  2    | NULL
```

---

## ✅ Checklist Final

- [ ] Paso 1: Migración SQL aplicada
- [ ] Paso 2: Edge Function desplegada
- [ ] Paso 3: Secrets configurados
- [ ] Paso 4: Trigger creado
- [ ] Paso 5: Producer desplegado en Vercel
- [ ] Paso 6.1: Health check pasa
- [ ] Paso 6.2: Mensaje de prueba enviado
- [ ] Paso 6.3: Mensaje procesado (status = completed)
- [ ] Paso 6.4: Datos guardados en prospect_data
- [ ] Paso 7: Logs monitoreados
- [ ] (Opcional) Código legacy eliminado

---

## 🎉 ¡Felicidades!

Has migrado exitosamente de Kafka + Vercel Pro a una arquitectura de cola de base de datos **100% gratuita** con mejor rendimiento y simplicidad.

**Tiempo estimado de despliegue**: 15-20 minutos

**Ahorro mensual**: $20+ USD

**Mejora de latencia**: 30-60s → <2s
