-- ========================================
-- FASE 1 - Script de Verificación
-- Ejecutar en Supabase SQL Editor
-- ========================================

-- 1. Verificar extensión pgmq
SELECT * FROM pg_extension WHERE extname = 'pgmq';
-- Esperado: 1 fila con extname = 'pgmq'

-- 2. Verificar cola creada
SELECT * FROM pgmq.list_queues();
-- Esperado: nexus-prospect-ingestion en la lista

-- 3. Verificar funciones RPC
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name LIKE 'pgmq_%'
ORDER BY routine_name;
-- Esperado: 5 funciones (send, pop, delete, metrics, archive)

-- 4. Verificar permisos de funciones
SELECT
  routine_name,
  has_function_privilege('anon', routine_name || '(text, jsonb, integer)', 'EXECUTE') as anon_can_send,
  has_function_privilege('anon', routine_name || '(text, integer)', 'EXECUTE') as anon_can_pop
FROM information_schema.routines
WHERE routine_name IN ('pgmq_send', 'pgmq_pop');
-- Esperado: TRUE para ambos roles

-- 5. Ver estado actual de la cola
SELECT * FROM pgmq_metrics('nexus-prospect-ingestion');
-- Esperado: Métricas con queue_length, etc.

-- 6. Ver mensajes en cola (si hay alguno)
SELECT * FROM pgmq.q_nexus_prospect_ingestion
LIMIT 10;
-- Esperado: Mensajes encolados pendientes de procesar

-- 7. Verificar función update_prospect_data existe
SELECT routine_name, routine_definition
FROM information_schema.routines
WHERE routine_name = 'update_prospect_data';
-- Esperado: 1 fila con la función

-- 8. Ver últimos datos de prospectos capturados
SELECT
  fingerprint_id,
  nombre,
  email,
  telefono,
  nivel_interes,
  momento_optimo,
  created_at
FROM prospect_data
ORDER BY created_at DESC
LIMIT 10;
-- Esperado: Datos de prueba si ya se testeó

-- ========================================
-- TEST DE INTEGRACIÓN RÁPIDA
-- ========================================

-- Test 1: Encolar mensaje de prueba
SELECT pgmq_send(
  'nexus-prospect-ingestion',
  '{"messages":[{"role":"user","content":"Test"}],"sessionId":"test-123","fingerprint":"test-fp-456"}'::jsonb,
  0
);
-- Esperado: Retorna un ID de mensaje (número)

-- Test 2: Ver mensaje en cola
SELECT * FROM pgmq.q_nexus_prospect_ingestion WHERE msg_id = <ID_DEL_TEST_1>;
-- Esperado: Ver el mensaje de prueba

-- Test 3: Leer mensaje (simulando Consumer)
SELECT * FROM pgmq_pop('nexus-prospect-ingestion', 30);
-- Esperado: Retorna el mensaje de test

-- Test 4: Eliminar mensaje de prueba
SELECT pgmq_delete('nexus-prospect-ingestion', <ID_DEL_TEST_1>);
-- Esperado: TRUE

-- ========================================
-- TROUBLESHOOTING QUERIES
-- ========================================

-- Ver todos los mensajes en cola
SELECT
  msg_id,
  read_ct,
  enqueued_at,
  vt,
  message->>'sessionId' as session_id,
  jsonb_array_length(message->'messages') as message_count
FROM pgmq.q_nexus_prospect_ingestion
ORDER BY enqueued_at DESC;

-- Ver mensajes que fallaron múltiples veces (read_ct > 3)
SELECT *
FROM pgmq.q_nexus_prospect_ingestion
WHERE read_ct > 3
ORDER BY read_ct DESC;

-- Ver edad de mensajes en cola
SELECT
  msg_id,
  EXTRACT(EPOCH FROM (NOW() - enqueued_at)) as age_seconds,
  message->>'sessionId' as session_id
FROM pgmq.q_nexus_prospect_ingestion
ORDER BY age_seconds DESC;

-- Limpiar cola de mensajes viejos (CUIDADO - solo en testing)
-- DELETE FROM pgmq.q_nexus_prospect_ingestion WHERE enqueued_at < NOW() - INTERVAL '1 hour';

-- Ver logs de procesamiento (si existe tabla de logs)
-- SELECT * FROM nexus_conversations ORDER BY created_at DESC LIMIT 20;
