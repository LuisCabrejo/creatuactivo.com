-- ================================================================
-- MIGRACIÓN: Agregar columna 'source' a tabla prospects
-- ================================================================
-- PROPÓSITO: Diferenciar prospectos de luiscabrejo.com vs CreaTuActivo.com
-- ARQUITECTURA HÍBRIDA: Permite analytics separados con BD compartida
-- FECHA: 2025-11-23
-- AUTOR: Claude (Marketing + Dashboard)
-- ================================================================

-- ================================================================
-- PASO 1: Agregar columna 'source' con valor por defecto
-- ================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prospects'
    AND column_name = 'source'
  ) THEN
    ALTER TABLE prospects
    ADD COLUMN source TEXT NOT NULL DEFAULT 'creatuactivo';

    RAISE NOTICE '✅ Columna "source" agregada exitosamente a tabla prospects';
  ELSE
    RAISE NOTICE 'ℹ️ Columna "source" ya existe en tabla prospects';
  END IF;
END $$;

-- ================================================================
-- PASO 2: Crear índice para optimizar queries por source
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_prospects_source
  ON prospects(source);

CREATE INDEX IF NOT EXISTS idx_prospects_source_created
  ON prospects(source, created_at DESC);

RAISE NOTICE '✅ Índices creados: idx_prospects_source, idx_prospects_source_created';

-- ================================================================
-- PASO 3: Actualizar registros existentes (opcional - ya tienen default)
-- ================================================================
-- Todos los registros existentes automáticamente tienen source='creatuactivo'
-- por el DEFAULT definido en ALTER TABLE

-- ================================================================
-- PASO 4: Agregar comentarios de documentación
-- ================================================================
COMMENT ON COLUMN prospects.source IS
'Origen del prospecto: "creatuactivo" (CreaTuActivo.com) o "luiscabrejo.com" (Luis Cabrejo personal). Permite analytics separados con BD compartida.';

-- ================================================================
-- VERIFICACIÓN FINAL
-- ================================================================
DO $$
DECLARE
  v_total_prospects INTEGER;
  v_creatuactivo_count INTEGER;
  v_luiscabrejo_count INTEGER;
BEGIN
  -- Contar prospectos totales
  SELECT COUNT(*) INTO v_total_prospects FROM prospects;

  -- Contar por source
  SELECT COUNT(*) INTO v_creatuactivo_count FROM prospects WHERE source = 'creatuactivo';
  SELECT COUNT(*) INTO v_luiscabrejo_count FROM prospects WHERE source = 'luiscabrejo.com';

  RAISE NOTICE '========================================';
  RAISE NOTICE '📊 VERIFICACIÓN DE MIGRACIÓN';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total prospectos: %', v_total_prospects;
  RAISE NOTICE 'CreaTuActivo: %', v_creatuactivo_count;
  RAISE NOTICE 'Luis Cabrejo: %', v_luiscabrejo_count;
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Migración completada exitosamente';
  RAISE NOTICE 'ℹ️ Los prospectos de luiscabrejo.com se identificarán automáticamente por tracking.js';
END $$;

-- ================================================================
-- QUERY DE EJEMPLO: Ver distribución por source
-- ================================================================
-- SELECT
--   source,
--   COUNT(*) as total_prospectos,
--   COUNT(DISTINCT constructor_id) as con_referente,
--   COUNT(*) FILTER (WHERE constructor_id IS NULL) as sin_referente,
--   MIN(created_at) as primer_prospecto,
--   MAX(created_at) as ultimo_prospecto
-- FROM prospects
-- GROUP BY source
-- ORDER BY total_prospectos DESC;
