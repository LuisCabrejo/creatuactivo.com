-- =====================================================
-- APLICAR MANUALMENTE EN SUPABASE DASHBOARD (VERSIÓN SEGURA)
-- =====================================================
-- Este script limpia cualquier intento previo y crea todo desde cero
-- Dashboard > SQL Editor > New Query > Pegar este script
-- =====================================================

-- ========================================
-- PASO 0: LIMPIAR INTENTOS PREVIOS
-- ========================================

-- Eliminar políticas RLS si existen
DROP POLICY IF EXISTS "Service role full access" ON nexus_queue;

-- Eliminar funciones si existen
DROP FUNCTION IF EXISTS enqueue_nexus_message(JSONB, TEXT, TEXT, JSONB);
DROP FUNCTION IF EXISTS update_queue_status(UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS cleanup_old_nexus_queue();

-- Eliminar tabla si existe (esto eliminará índices automáticamente)
DROP TABLE IF EXISTS nexus_queue CASCADE;

-- ========================================
-- PASO 1: HABILITAR EXTENSIÓN PG_NET
-- ========================================

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Verificar que pg_net está habilitado
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_net'
  ) THEN
    RAISE EXCEPTION 'pg_net extension not available. Please enable it in Supabase Dashboard > Database > Extensions';
  ELSE
    RAISE NOTICE 'pg_net extension habilitada correctamente';
  END IF;
END $$;

-- ========================================
-- PASO 2: CREAR TABLA nexus_queue
-- ========================================

CREATE TABLE nexus_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Datos del mensaje
  messages JSONB NOT NULL,
  fingerprint TEXT,
  session_id TEXT NOT NULL,

  -- Estado del procesamiento
  status TEXT NOT NULL DEFAULT 'pending',

  -- Metadatos
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,

  -- Manejo de errores
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,

  -- Constraints
  CONSTRAINT nexus_queue_status_check CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  CONSTRAINT nexus_queue_session_id_unique UNIQUE(session_id)
);

-- ========================================
-- PASO 3: CREAR ÍNDICES
-- ========================================

CREATE INDEX idx_nexus_queue_status ON nexus_queue(status);
CREATE INDEX idx_nexus_queue_created_at ON nexus_queue(created_at);
CREATE INDEX idx_nexus_queue_fingerprint ON nexus_queue(fingerprint) WHERE fingerprint IS NOT NULL;

-- ========================================
-- PASO 4: FUNCIÓN RPC - enqueue_nexus_message
-- ========================================

CREATE FUNCTION enqueue_nexus_message(
  p_messages JSONB,
  p_session_id TEXT,
  p_fingerprint TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- ========================================
-- PASO 5: FUNCIÓN RPC - update_queue_status
-- ========================================

CREATE FUNCTION update_queue_status(
  p_queue_id UUID,
  p_status TEXT,
  p_error_message TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- ========================================
-- PASO 6: FUNCIÓN RPC - cleanup_old_nexus_queue
-- ========================================

CREATE FUNCTION cleanup_old_nexus_queue()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- ========================================
-- PASO 7: HABILITAR ROW LEVEL SECURITY
-- ========================================

ALTER TABLE nexus_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON nexus_queue
  FOR ALL
  USING (auth.role() = 'service_role');

-- ========================================
-- PASO 8: VERIFICACIÓN FINAL
-- ========================================

-- Verificar que todo se creó correctamente
DO $$
BEGIN
  -- Verificar tabla
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'nexus_queue'
  ) THEN
    RAISE EXCEPTION 'Tabla nexus_queue no fue creada';
  END IF;

  -- Verificar funciones
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'enqueue_nexus_message') THEN
    RAISE EXCEPTION 'Funcion enqueue_nexus_message no fue creada';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_queue_status') THEN
    RAISE EXCEPTION 'Funcion update_queue_status no fue creada';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'cleanup_old_nexus_queue') THEN
    RAISE EXCEPTION 'Funcion cleanup_old_nexus_queue no fue creada';
  END IF;

  RAISE NOTICE 'Todas las verificaciones pasaron correctamente';
END $$;

-- ========================================
-- RESUMEN FINAL
-- ========================================

SELECT 'Migration applied successfully!' AS status;

SELECT
  'Siguiente paso: Desplegar Edge Function' as next_step,
  'npx supabase functions deploy nexus-queue-processor' as command;
