-- =====================================================
-- APLICAR MANUALMENTE EN SUPABASE DASHBOARD
-- =====================================================
-- Dashboard > SQL Editor > New Query > Pegar este script
--
-- Este script:
-- 1. Habilita la extensión pg_net
-- 2. Crea la tabla nexus_queue
-- 3. Crea funciones y triggers para procesamiento asíncrono
-- =====================================================

-- PASO 1: Habilitar pg_net
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- PASO 2: Crear tabla de cola
CREATE TABLE IF NOT EXISTS nexus_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  messages JSONB NOT NULL,
  fingerprint TEXT,
  session_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT unique_session_id UNIQUE(session_id)
);

-- PASO 3: Crear índices
CREATE INDEX IF NOT EXISTS idx_nexus_queue_status ON nexus_queue(status);
CREATE INDEX IF NOT EXISTS idx_nexus_queue_created_at ON nexus_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_nexus_queue_fingerprint ON nexus_queue(fingerprint) WHERE fingerprint IS NOT NULL;

-- PASO 4: RPC para encolar mensajes
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

-- PASO 5: RPC para actualizar estado
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

-- PASO 6: Función para limpiar mensajes antiguos
CREATE OR REPLACE FUNCTION cleanup_old_nexus_queue()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM nexus_queue
  WHERE status = 'completed'
    AND processed_at < NOW() - INTERVAL '7 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  DELETE FROM nexus_queue
  WHERE status = 'failed'
    AND created_at < NOW() - INTERVAL '30 days';

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 7: Habilitar RLS
ALTER TABLE nexus_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON nexus_queue
  FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- NOTA IMPORTANTE SOBRE EL TRIGGER
-- =====================================================
-- El trigger que invoca la Edge Function se creará DESPUÉS
-- de que la Edge Function esté desplegada.
-- Ver: supabase/CREATE_TRIGGER_AFTER_FUNCTION.sql
-- =====================================================

SELECT 'Migration applied successfully!' AS status;
