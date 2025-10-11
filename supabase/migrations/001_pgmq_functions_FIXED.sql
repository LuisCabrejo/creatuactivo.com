-- ========================================
-- FASE 1: Funciones RPC para pgmq (CORREGIDO)
-- Permiten interactuar con la cola desde el API
-- FIX: pgmq_metrics usa p_queue_name para evitar conflicto de nombres
-- ========================================

-- Función para enviar mensajes a la cola
CREATE OR REPLACE FUNCTION pgmq_send(
  queue_name TEXT,
  msg JSONB,
  delay INTEGER DEFAULT 0
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  message_id BIGINT;
BEGIN
  -- Enviar mensaje a la cola usando pgmq
  SELECT pgmq.send(
    queue_name,
    msg,
    delay
  ) INTO message_id;

  RETURN message_id;
END;
$$;

-- Función para leer mensajes de la cola (pop)
CREATE OR REPLACE FUNCTION pgmq_pop(
  queue_name TEXT,
  visibility_timeout INTEGER DEFAULT 30
)
RETURNS TABLE(
  msg_id BIGINT,
  read_ct INTEGER,
  enqueued_at TIMESTAMP WITH TIME ZONE,
  vt TIMESTAMP WITH TIME ZONE,
  message JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM pgmq.read(
    queue_name,
    visibility_timeout,
    1 -- Leer 1 mensaje a la vez
  );
END;
$$;

-- Función para eliminar mensaje procesado de la cola
CREATE OR REPLACE FUNCTION pgmq_delete(
  queue_name TEXT,
  msg_id BIGINT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted BOOLEAN;
BEGIN
  SELECT pgmq.delete(
    queue_name,
    msg_id
  ) INTO deleted;

  RETURN deleted;
END;
$$;

-- Función para obtener métricas de la cola
-- ✅ FIX APLICADO: Renombrado parámetro p_queue_name para evitar conflicto con columna de retorno
CREATE OR REPLACE FUNCTION pgmq_metrics(
  p_queue_name TEXT
)
RETURNS TABLE(
  queue_name TEXT,
  queue_length BIGINT,
  newest_msg_age_sec INTEGER,
  oldest_msg_age_sec INTEGER,
  total_messages BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p_queue_name::TEXT AS queue_name,
    pgmq.queue_length(p_queue_name) AS queue_length,
    EXTRACT(EPOCH FROM NOW() - MIN(enqueued_at))::INTEGER AS newest_msg_age_sec,
    EXTRACT(EPOCH FROM NOW() - MAX(enqueued_at))::INTEGER AS oldest_msg_age_sec,
    COUNT(*)::BIGINT AS total_messages
  FROM pgmq.q_nexus_prospect_ingestion;
END;
$$;

-- Función para archivar mensajes procesados (opcional, para auditoría)
CREATE OR REPLACE FUNCTION pgmq_archive(
  queue_name TEXT,
  msg_id BIGINT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  archived BOOLEAN;
BEGIN
  SELECT pgmq.archive(
    queue_name,
    msg_id
  ) INTO archived;

  RETURN archived;
END;
$$;

-- Conceder permisos a anon y authenticated
GRANT EXECUTE ON FUNCTION pgmq_send TO anon, authenticated;
GRANT EXECUTE ON FUNCTION pgmq_pop TO anon, authenticated;
GRANT EXECUTE ON FUNCTION pgmq_delete TO anon, authenticated;
GRANT EXECUTE ON FUNCTION pgmq_metrics TO anon, authenticated;
GRANT EXECUTE ON FUNCTION pgmq_archive TO anon, authenticated;

-- Comentarios para documentación
COMMENT ON FUNCTION pgmq_send IS 'Fase 1: Envía mensaje a la cola nexus-prospect-ingestion';
COMMENT ON FUNCTION pgmq_pop IS 'Fase 1: Lee y bloquea siguiente mensaje de la cola';
COMMENT ON FUNCTION pgmq_delete IS 'Fase 1: Elimina mensaje procesado exitosamente';
COMMENT ON FUNCTION pgmq_metrics IS 'Fase 1: Obtiene métricas de la cola para monitoring';
COMMENT ON FUNCTION pgmq_archive IS 'Fase 1: Archiva mensaje para auditoría histórica';

-- ========================================
-- VERIFICACIÓN POST-INSTALACIÓN
-- ========================================

-- Verificar que todas las funciones se crearon correctamente
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM information_schema.routines
  WHERE routine_name LIKE 'pgmq_%';

  IF v_count = 5 THEN
    RAISE NOTICE '✅ SUCCESS: Todas las 5 funciones pgmq_* creadas correctamente';
  ELSE
    RAISE WARNING '⚠️ WARNING: Se esperaban 5 funciones, se encontraron %', v_count;
  END IF;
END $$;

-- Verificar permisos
DO $$
BEGIN
  IF has_function_privilege('anon', 'pgmq_send(text, jsonb, integer)', 'EXECUTE') THEN
    RAISE NOTICE '✅ SUCCESS: Permisos anon configurados correctamente';
  ELSE
    RAISE WARNING '⚠️ WARNING: Permisos anon no configurados';
  END IF;
END $$;

-- Test rápido de la función pgmq_metrics
DO $$
DECLARE
  v_metrics RECORD;
BEGIN
  SELECT * INTO v_metrics FROM pgmq_metrics('nexus-prospect-ingestion');
  RAISE NOTICE '✅ SUCCESS: pgmq_metrics funciona correctamente';
  RAISE NOTICE 'Cola: %, Longitud: %', v_metrics.queue_name, v_metrics.queue_length;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '⚠️ WARNING: Error en pgmq_metrics: %', SQLERRM;
END $$;

-- Mensaje final
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ FASE 1 - Funciones RPC instaladas';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Funciones disponibles:';
  RAISE NOTICE '  - pgmq_send()';
  RAISE NOTICE '  - pgmq_pop()';
  RAISE NOTICE '  - pgmq_delete()';
  RAISE NOTICE '  - pgmq_metrics()  ✅ FIXED';
  RAISE NOTICE '  - pgmq_archive()';
  RAISE NOTICE '';
  RAISE NOTICE 'Próximo paso:';
  RAISE NOTICE '  1. Desplegar Edge Function: supabase functions deploy nexus-consumer';
  RAISE NOTICE '  2. Configurar secrets (ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)';
  RAISE NOTICE '  3. Configurar Cron Job (ver FASE1_DEPLOYMENT.md)';
  RAISE NOTICE '========================================';
END $$;
