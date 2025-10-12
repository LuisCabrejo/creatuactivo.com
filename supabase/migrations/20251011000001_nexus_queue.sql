-- =====================================================
-- NEXUS ASYNC QUEUE: DB-Based Message Queue
-- =====================================================
-- Migración de Kafka a cola basada en base de datos
-- Ventajas: Gratis, simple, latencia <2s, idempotencia nativa
-- Autor: Claude Code
-- Fecha: 2025-10-11

-- =====================================================
-- 1. TABLA DE COLA DE MENSAJES
-- =====================================================

CREATE TABLE IF NOT EXISTS nexus_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Payload del mensaje (conversación completa)
  messages JSONB NOT NULL,

  -- Identificadores de tracking
  fingerprint TEXT,
  session_id TEXT NOT NULL,

  -- Estado del procesamiento
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),

  -- Metadatos
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,

  -- Manejo de errores
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,

  -- Índices implícitos
  CONSTRAINT unique_session_id UNIQUE(session_id) -- Idempotencia: un mensaje por sesión
);

-- Índices para optimizar queries
CREATE INDEX IF NOT EXISTS idx_nexus_queue_status ON nexus_queue(status);
CREATE INDEX IF NOT EXISTS idx_nexus_queue_created_at ON nexus_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_nexus_queue_fingerprint ON nexus_queue(fingerprint) WHERE fingerprint IS NOT NULL;

-- =====================================================
-- 2. FUNCIÓN PARA INVOCAR EDGE FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION invoke_nexus_consumer()
RETURNS TRIGGER AS $$
DECLARE
  function_url TEXT;
  service_role_key TEXT;
BEGIN
  -- Obtener URL del proyecto de Supabase
  function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/nexus-queue-processor';
  service_role_key := current_setting('app.settings.supabase_service_role_key', true);

  -- Invocar Edge Function de forma asíncrona usando pg_net
  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || service_role_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'queue_id', NEW.id,
      'session_id', NEW.session_id
    )
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error pero no fallar la inserción
    RAISE WARNING 'Error invocando nexus-queue-processor: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. TRIGGER PARA PROCESAR MENSAJES NUEVOS
-- =====================================================

DROP TRIGGER IF EXISTS on_nexus_message_inserted ON nexus_queue;

CREATE TRIGGER on_nexus_message_inserted
  AFTER INSERT ON nexus_queue
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION invoke_nexus_consumer();

-- =====================================================
-- 4. FUNCIÓN PARA LIMPIAR MENSAJES ANTIGUOS
-- =====================================================

CREATE OR REPLACE FUNCTION cleanup_old_nexus_queue()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Eliminar mensajes completados con más de 7 días
  DELETE FROM nexus_queue
  WHERE status = 'completed'
    AND processed_at < NOW() - INTERVAL '7 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  -- Eliminar mensajes fallidos con más de 30 días
  DELETE FROM nexus_queue
  WHERE status = 'failed'
    AND created_at < NOW() - INTERVAL '30 days';

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. RPC PARA ENCOLAR MENSAJE (llamado desde Producer)
-- =====================================================

CREATE OR REPLACE FUNCTION enqueue_nexus_message(
  p_messages JSONB,
  p_session_id TEXT,
  p_fingerprint TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_queue_id UUID;
BEGIN
  -- Insertar mensaje en cola (idempotente por session_id)
  INSERT INTO nexus_queue (messages, session_id, fingerprint, metadata)
  VALUES (p_messages, p_session_id, p_fingerprint, p_metadata)
  ON CONFLICT (session_id) DO UPDATE
    SET messages = EXCLUDED.messages,
        fingerprint = EXCLUDED.fingerprint,
        metadata = EXCLUDED.metadata,
        created_at = NOW(),
        status = 'pending',
        retry_count = 0
  RETURNING id INTO v_queue_id;

  RETURN v_queue_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. RPC PARA ACTUALIZAR ESTADO DEL MENSAJE
-- =====================================================

CREATE OR REPLACE FUNCTION update_queue_status(
  p_queue_id UUID,
  p_status TEXT,
  p_error_message TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE nexus_queue
  SET
    status = p_status,
    processed_at = CASE WHEN p_status IN ('completed', 'failed') THEN NOW() ELSE processed_at END,
    error_message = p_error_message,
    retry_count = CASE WHEN p_status = 'failed' THEN retry_count + 1 ELSE retry_count END
  WHERE id = p_queue_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. HABILITAR ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE nexus_queue ENABLE ROW LEVEL SECURITY;

-- Policy: Solo service_role puede acceder
CREATE POLICY "Service role full access" ON nexus_queue
  FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- 8. COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE nexus_queue IS 'Cola de mensajes para procesamiento asíncrono de conversaciones NEXUS';
COMMENT ON COLUMN nexus_queue.messages IS 'Array de mensajes de la conversación en formato JSONB';
COMMENT ON COLUMN nexus_queue.session_id IS 'ID único de la sesión de chat (usado para idempotencia)';
COMMENT ON COLUMN nexus_queue.fingerprint IS 'Browser fingerprint del prospecto';
COMMENT ON COLUMN nexus_queue.status IS 'Estado: pending, processing, completed, failed';
COMMENT ON FUNCTION enqueue_nexus_message IS 'Encola un mensaje NEXUS para procesamiento asíncrono';
COMMENT ON FUNCTION update_queue_status IS 'Actualiza el estado de procesamiento de un mensaje';
