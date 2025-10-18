-- ================================================================
-- FUNCIÓN: update_prospect_data (CORREGIDA)
-- ================================================================
-- PROPÓSITO: Actualizar datos de prospectos según Framework IAA
-- CORRECCIÓN: Stage transitions alineadas con IAA (iniciar→acoger→activar)
-- FECHA: 2025-10-17
-- AUTOR: Claude (Marketing + Dashboard)
-- ================================================================

DROP FUNCTION IF EXISTS update_prospect_data(TEXT, JSONB);

CREATE OR REPLACE FUNCTION update_prospect_data(
  p_fingerprint_id TEXT,
  p_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_prospect_id UUID;
  v_current_stage TEXT;
  v_new_stage TEXT;
  v_current_device_info JSONB;
  v_merged_data JSONB;
  v_stage_updated BOOLEAN := FALSE;
  v_has_name BOOLEAN;
  v_has_email BOOLEAN;
  v_has_phone BOOLEAN;
  v_nivel_interes INT;
BEGIN
  -- ================================================================
  -- PASO 1: Buscar prospecto
  -- ================================================================
  SELECT id, stage, COALESCE(device_info, '{}'::jsonb)
  INTO v_prospect_id, v_current_stage, v_current_device_info
  FROM prospects
  WHERE fingerprint_id = p_fingerprint_id;

  IF v_prospect_id IS NULL THEN
    RAISE WARNING '⚠️ [update_prospect_data] Prospecto no encontrado: %', p_fingerprint_id;
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'Prospecto no encontrado',
      'fingerprint', p_fingerprint_id
    );
  END IF;

  RAISE NOTICE '📥 [update_prospect_data] Prospecto encontrado - ID: %, Stage actual: %',
    v_prospect_id, v_current_stage;

  -- ================================================================
  -- PASO 2: Merge de datos (nuevo sobrescribe viejo)
  -- ================================================================
  v_merged_data := v_current_device_info || p_data;

  UPDATE prospects
  SET
    device_info = v_merged_data,
    updated_at = NOW()
  WHERE id = v_prospect_id;

  RAISE NOTICE '✅ [update_prospect_data] device_info actualizado';

  -- ================================================================
  -- PASO 3: Evaluar datos disponibles para cambio de stage
  -- ================================================================
  -- Verificar campos críticos (soporta ambos formatos: español e inglés)
  v_has_name := (v_merged_data->>'name' IS NOT NULL OR v_merged_data->>'nombre' IS NOT NULL);
  v_has_email := (v_merged_data->>'email' IS NOT NULL);
  v_has_phone := (v_merged_data->>'phone' IS NOT NULL OR v_merged_data->>'telefono' IS NOT NULL);
  v_nivel_interes := COALESCE((v_merged_data->>'nivel_interes')::INT, 0);

  RAISE NOTICE '🔍 [update_prospect_data] Datos capturados - Name: %, Email: %, Phone: %, Interés: %',
    v_has_name, v_has_email, v_has_phone, v_nivel_interes;

  -- ================================================================
  -- PASO 4: Lógica de cambio de stage (Framework IAA)
  -- ================================================================
  v_new_stage := v_current_stage;

  -- INICIAR → ACOGER: Requiere nombre + email + teléfono
  IF v_current_stage = 'iniciar' THEN
    IF v_has_name AND v_has_email AND v_has_phone THEN
      v_new_stage := 'acoger';
      RAISE NOTICE '📈 [update_prospect_data] Stage change: iniciar → acoger (datos completos capturados)';
    ELSE
      RAISE NOTICE '⏳ [update_prospect_data] Aún en INICIAR - Faltan datos (Name: %, Email: %, Phone: %)',
        v_has_name, v_has_email, v_has_phone;
    END IF;
  END IF;

  -- ACOGER → ACTIVAR: Requiere nivel de interés >= 8
  IF v_current_stage = 'acoger' THEN
    IF v_nivel_interes >= 8 THEN
      v_new_stage := 'activar';
      RAISE NOTICE '📈 [update_prospect_data] Stage change: acoger → activar (interés alto: %)', v_nivel_interes;
    ELSE
      RAISE NOTICE '⏳ [update_prospect_data] Aún en ACOGER - Interés insuficiente: % (requiere >= 8)',
        v_nivel_interes;
    END IF;
  END IF;

  -- ACTIVAR: Stage final, no hay más cambios
  IF v_current_stage = 'activar' THEN
    RAISE NOTICE '✅ [update_prospect_data] Prospecto en ACTIVAR (stage final)';
  END IF;

  -- ================================================================
  -- PASO 5: Aplicar cambio de stage si corresponde
  -- ================================================================
  IF v_new_stage != v_current_stage THEN
    UPDATE prospects
    SET
      stage = v_new_stage,
      updated_at = NOW()
    WHERE id = v_prospect_id;

    v_stage_updated := TRUE;
    RAISE NOTICE '🚀 [update_prospect_data] Stage actualizado: % → %', v_current_stage, v_new_stage;
  END IF;

  -- ================================================================
  -- PASO 6: Retornar resultado
  -- ================================================================
  RETURN jsonb_build_object(
    'success', TRUE,
    'prospect_id', v_prospect_id,
    'stage', v_new_stage,
    'stage_updated', v_stage_updated,
    'previous_stage', v_current_stage,
    'data_merged', v_merged_data,
    'has_complete_data', v_has_name AND v_has_email AND v_has_phone,
    'nivel_interes', v_nivel_interes
  );

EXCEPTION WHEN OTHERS THEN
  -- ================================================================
  -- MANEJO DE ERRORES
  -- ================================================================
  RAISE WARNING '❌ [update_prospect_data] Error: %', SQLERRM;
  RETURN jsonb_build_object(
    'success', FALSE,
    'error', SQLERRM,
    'fingerprint', p_fingerprint_id
  );
END;
$$;

-- ================================================================
-- COMENTARIO Y PERMISOS
-- ================================================================
COMMENT ON FUNCTION update_prospect_data(TEXT, JSONB) IS
'Actualiza datos de prospecto y evalúa transiciones de stage según Framework IAA.
INICIAR→ACOGER: nombre+email+teléfono. ACOGER→ACTIVAR: interés>=8. Versión corregida 2025-10-17.';

-- Otorgar permisos
GRANT EXECUTE ON FUNCTION update_prospect_data(TEXT, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION update_prospect_data(TEXT, JSONB) TO authenticated;
