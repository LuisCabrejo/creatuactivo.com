-- ========================================
-- TABLA: nexus_conversations
-- ========================================
-- Propósito: Almacenar historial completo de conversaciones NEXUS
-- Memoria a largo plazo: Usuario puede volver meses después con contexto
-- Creado: 2025-10-25 (Fix Error 500 - Memoria a largo plazo)
-- ========================================

-- 1. Crear tabla si no existe
CREATE TABLE IF NOT EXISTS nexus_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificación
  fingerprint_id TEXT NOT NULL,           -- Fingerprint del prospecto (device tracking)
  session_id TEXT NOT NULL,               -- ID de sesión (temporal, cambia cada sesión)

  -- Contenido de la conversación
  messages JSONB NOT NULL,                -- Array de mensajes [{ role: 'user', content: '...' }, { role: 'assistant', content: '...' }]

  -- Metadata de la conversación
  documents_used TEXT[],                  -- Documentos del arsenal usados en esta conversación
  search_method TEXT,                     -- Método de búsqueda usado (hibrid_classification, semantic_search, etc.)

  -- Datos del prospecto capturados en esta conversación (snapshot)
  prospect_data JSONB,                    -- Datos capturados: { name, email, phone, archetype, package, interest_level, momento_optimo, etc. }

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Índices para optimizar queries
CREATE INDEX IF NOT EXISTS idx_nexus_conversations_fingerprint
  ON nexus_conversations(fingerprint_id);

CREATE INDEX IF NOT EXISTS idx_nexus_conversations_created_at
  ON nexus_conversations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_nexus_conversations_fingerprint_created
  ON nexus_conversations(fingerprint_id, created_at DESC);

-- 3. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_nexus_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger para updated_at
DROP TRIGGER IF EXISTS trigger_update_nexus_conversations_updated_at ON nexus_conversations;
CREATE TRIGGER trigger_update_nexus_conversations_updated_at
  BEFORE UPDATE ON nexus_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_nexus_conversations_updated_at();

-- 5. Row-Level Security (RLS)
ALTER TABLE nexus_conversations ENABLE ROW LEVEL SECURITY;

-- 6. Política: Service role puede hacer todo (para API)
DROP POLICY IF EXISTS "Service role can manage all conversations" ON nexus_conversations;
CREATE POLICY "Service role can manage all conversations"
  ON nexus_conversations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 7. Política: Anon puede insertar (para logging desde API)
DROP POLICY IF EXISTS "Anon can insert conversations" ON nexus_conversations;
CREATE POLICY "Anon can insert conversations"
  ON nexus_conversations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 8. Política: Constructores pueden ver sus propias conversaciones
-- (Futuro: para Dashboard "Historial de Conversaciones")
DROP POLICY IF EXISTS "Constructors can view their prospects conversations" ON nexus_conversations;
CREATE POLICY "Constructors can view their prospects conversations"
  ON nexus_conversations
  FOR SELECT
  TO authenticated
  USING (
    fingerprint_id IN (
      SELECT fingerprint_id
      FROM nexus_prospects
      WHERE invited_by IN (
        SELECT id::text
        FROM private_users
        WHERE id = auth.uid()
      )
    )
  );

-- 9. Comentarios para documentación
COMMENT ON TABLE nexus_conversations IS 'Historial completo de conversaciones NEXUS para memoria a largo plazo';
COMMENT ON COLUMN nexus_conversations.fingerprint_id IS 'Fingerprint del prospecto (device tracking) - permite identificar usuario entre sesiones';
COMMENT ON COLUMN nexus_conversations.session_id IS 'ID de sesión temporal - cambia cada vez que abre NEXUS';
COMMENT ON COLUMN nexus_conversations.messages IS 'Array JSONB de mensajes con formato Anthropic: [{ role: "user"|"assistant", content: "..." }]';
COMMENT ON COLUMN nexus_conversations.documents_used IS 'Array de documentos del arsenal usados (arsenal_inicial, arsenal_manejo, etc.)';
COMMENT ON COLUMN nexus_conversations.search_method IS 'Método de búsqueda usado (hibrid_classification, semantic_search, catalogo_productos)';
COMMENT ON COLUMN nexus_conversations.prospect_data IS 'Snapshot de datos del prospecto al momento de esta conversación (permite ver evolución)';

-- ========================================
-- VERIFICACIÓN
-- ========================================

-- Verificar que tabla fue creada correctamente
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'nexus_conversations') THEN
    RAISE NOTICE '✅ Tabla nexus_conversations creada exitosamente';
  ELSE
    RAISE EXCEPTION '❌ Error: Tabla nexus_conversations NO fue creada';
  END IF;
END $$;

-- Mostrar información de la tabla
SELECT
  'nexus_conversations' AS tabla,
  COUNT(*) AS total_conversaciones,
  COUNT(DISTINCT fingerprint_id) AS prospectos_unicos,
  MIN(created_at) AS primera_conversacion,
  MAX(created_at) AS ultima_conversacion
FROM nexus_conversations;

-- Si la tabla está vacía (primera vez), mostrar mensaje
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM nexus_conversations;

  IF v_count = 0 THEN
    RAISE NOTICE 'ℹ️ Tabla vacía - primera instalación. Las conversaciones se guardarán automáticamente desde ahora.';
  ELSE
    RAISE NOTICE '✅ Tabla con % conversaciones existentes - memoria a largo plazo ACTIVA', v_count;
  END IF;
END $$;
