-- ========================================
-- UPDATE: nexus_conversations (Agregar Columnas Faltantes)
-- ========================================
-- Propósito: La tabla ya existe pero le faltan columnas
-- Este script agrega solo las columnas que no existen
-- Creado: 2025-10-25 (Fix Error: columna documents_used no existe)
-- ========================================

-- 1. Agregar columna documents_used si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nexus_conversations'
    AND column_name = 'documents_used'
  ) THEN
    ALTER TABLE nexus_conversations
    ADD COLUMN documents_used TEXT[];
    RAISE NOTICE '✅ Columna documents_used agregada';
  ELSE
    RAISE NOTICE 'ℹ️ Columna documents_used ya existe';
  END IF;
END $$;

-- 2. Agregar columna search_method si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nexus_conversations'
    AND column_name = 'search_method'
  ) THEN
    ALTER TABLE nexus_conversations
    ADD COLUMN search_method TEXT;
    RAISE NOTICE '✅ Columna search_method agregada';
  ELSE
    RAISE NOTICE 'ℹ️ Columna search_method ya existe';
  END IF;
END $$;

-- 3. Agregar columna prospect_data si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nexus_conversations'
    AND column_name = 'prospect_data'
  ) THEN
    ALTER TABLE nexus_conversations
    ADD COLUMN prospect_data JSONB;
    RAISE NOTICE '✅ Columna prospect_data agregada';
  ELSE
    RAISE NOTICE 'ℹ️ Columna prospect_data ya existe';
  END IF;
END $$;

-- 4. Verificar que tabla tiene todas las columnas necesarias
DO $$
DECLARE
  v_columns TEXT[];
BEGIN
  SELECT array_agg(column_name ORDER BY ordinal_position)
  INTO v_columns
  FROM information_schema.columns
  WHERE table_name = 'nexus_conversations';

  RAISE NOTICE '📋 Columnas en nexus_conversations: %', v_columns;
END $$;

-- 5. Agregar índices si no existen
CREATE INDEX IF NOT EXISTS idx_nexus_conversations_fingerprint
  ON nexus_conversations(fingerprint_id);

CREATE INDEX IF NOT EXISTS idx_nexus_conversations_created_at
  ON nexus_conversations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_nexus_conversations_fingerprint_created
  ON nexus_conversations(fingerprint_id, created_at DESC);

RAISE NOTICE '✅ Índices verificados/creados';

-- 6. Verificar RLS
DO $$
BEGIN
  -- Habilitar RLS si no está habilitado
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE tablename = 'nexus_conversations'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE nexus_conversations ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS habilitado';
  ELSE
    RAISE NOTICE 'ℹ️ RLS ya está habilitado';
  END IF;
END $$;

-- 7. Crear políticas RLS si no existen
DO $$
BEGIN
  -- Política para service_role
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'nexus_conversations'
    AND policyname = 'Service role can manage all conversations'
  ) THEN
    CREATE POLICY "Service role can manage all conversations"
      ON nexus_conversations
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
    RAISE NOTICE '✅ Política service_role creada';
  ELSE
    RAISE NOTICE 'ℹ️ Política service_role ya existe';
  END IF;

  -- Política para anon
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'nexus_conversations'
    AND policyname = 'Anon can insert and read conversations'
  ) THEN
    CREATE POLICY "Anon can insert and read conversations"
      ON nexus_conversations
      FOR ALL
      TO anon
      USING (true)
      WITH CHECK (true);
    RAISE NOTICE '✅ Política anon creada';
  ELSE
    RAISE NOTICE 'ℹ️ Política anon ya existe';
  END IF;
END $$;

-- 8. Crear función para updated_at si no existe
CREATE OR REPLACE FUNCTION update_nexus_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Crear trigger si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trigger_update_nexus_conversations_updated_at'
  ) THEN
    CREATE TRIGGER trigger_update_nexus_conversations_updated_at
      BEFORE UPDATE ON nexus_conversations
      FOR EACH ROW
      EXECUTE FUNCTION update_nexus_conversations_updated_at();
    RAISE NOTICE '✅ Trigger para updated_at creado';
  ELSE
    RAISE NOTICE 'ℹ️ Trigger para updated_at ya existe';
  END IF;
END $$;

-- ========================================
-- VERIFICACIÓN FINAL
-- ========================================

-- Mostrar estadísticas de la tabla
SELECT
  'nexus_conversations' AS tabla,
  COUNT(*) AS total_conversaciones,
  COUNT(DISTINCT fingerprint_id) AS prospectos_unicos,
  CASE
    WHEN COUNT(*) > 0 THEN MIN(created_at)
    ELSE NULL
  END AS primera_conversacion,
  CASE
    WHEN COUNT(*) > 0 THEN MAX(created_at)
    ELSE NULL
  END AS ultima_conversacion
FROM nexus_conversations;

-- Mensaje final
DO $$
DECLARE
  v_count INTEGER;
  v_has_documents_used BOOLEAN;
  v_has_search_method BOOLEAN;
  v_has_prospect_data BOOLEAN;
BEGIN
  -- Contar conversaciones
  SELECT COUNT(*) INTO v_count FROM nexus_conversations;

  -- Verificar columnas críticas
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nexus_conversations'
    AND column_name = 'documents_used'
  ) INTO v_has_documents_used;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nexus_conversations'
    AND column_name = 'search_method'
  ) INTO v_has_search_method;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nexus_conversations'
    AND column_name = 'prospect_data'
  ) INTO v_has_prospect_data;

  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ ACTUALIZACIÓN COMPLETADA';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Conversaciones existentes: %', v_count;
  RAISE NOTICE 'Columna documents_used: %', CASE WHEN v_has_documents_used THEN '✅' ELSE '❌' END;
  RAISE NOTICE 'Columna search_method: %', CASE WHEN v_has_search_method THEN '✅' ELSE '❌' END;
  RAISE NOTICE 'Columna prospect_data: %', CASE WHEN v_has_prospect_data THEN '✅' ELSE '❌' END;
  RAISE NOTICE '========================================';

  IF v_has_documents_used AND v_has_search_method AND v_has_prospect_data THEN
    RAISE NOTICE '🎉 NEXUS con memoria a largo plazo está LISTO';
  ELSE
    RAISE EXCEPTION '❌ Faltan columnas críticas - verificar errores arriba';
  END IF;
END $$;
