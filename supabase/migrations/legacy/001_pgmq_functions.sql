-- ========================================
-- FASE 1: Funciones RPC para pgmq
-- Permiten interactuar con la cola desde el API
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
-- FIX: Renombrado parámetro p_queue_name para evitar conflicto con columna de retorno
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
