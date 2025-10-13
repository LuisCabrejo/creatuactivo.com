-- ================================================================
-- FIX: Función update_prospect_data CON SINCRONIZACIÓN AUTOMÁTICA
-- ================================================================
-- MEJORA: Ahora sincroniza automáticamente con tabla `prospects`
-- para que el Dashboard del constructor siempre tenga datos actualizados
-- ================================================================
-- Fecha: 13 Octubre 2025
-- Versión: 2.0 - Con sincronización bidireccional
-- ================================================================

DROP FUNCTION IF EXISTS update_prospect_data(TEXT, JSONB);

CREATE OR REPLACE FUNCTION update_prospect_data(
  p_fingerprint_id TEXT,  -- Mapea a session_id
  p_data JSONB            -- Contiene: nombre, ocupacion, telefono, nivel_interes, etc.
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_prospect_id BIGINT;
  v_current_stage TEXT;
  v_new_stage TEXT;
  v_nombre TEXT;
  v_ocupacion TEXT;
  v_telefono TEXT;
  v_email TEXT;
  v_arquetipo TEXT;
  v_nivel_interes NUMERIC;
  v_should_advance BOOLEAN := FALSE;
  v_result JSONB;
  v_existing_name TEXT;
  v_existing_phone TEXT;
  v_synced_to_prospects BOOLEAN := FALSE;
BEGIN
  -- Extraer datos del JSONB entrante
  v_nombre := p_data->>'nombre';
  v_ocupacion := p_data->>'ocupacion';
  v_telefono := p_data->>'telefono';
  v_email := p_data->>'email';
  v_arquetipo := p_data->>'arquetipo';
  v_nivel_interes := COALESCE((p_data->>'nivel_interes')::NUMERIC, 0);

  RAISE NOTICE '📥 update_prospect_data - session: %, data: %', p_fingerprint_id, p_data;

  -- ================================================================
  -- PARTE 1: ACTUALIZAR nexus_prospects
  -- ================================================================

  SELECT
    id,
    conversion_stage,
    name,
    phone
  INTO
    v_prospect_id,
    v_current_stage,
    v_existing_name,
    v_existing_phone
  FROM nexus_prospects
  WHERE session_id = p_fingerprint_id;

  -- Si no existe, crear nuevo prospecto en INICIAR
  IF v_prospect_id IS NULL THEN
    INSERT INTO nexus_prospects (
      session_id,
      conversion_stage,
      name,
      email,
      phone,
      archetype,
      created_at,
      updated_at
    ) VALUES (
      p_fingerprint_id,
      'INICIAR',
      v_nombre,
      v_email,
      v_telefono,
      COALESCE(v_arquetipo, v_ocupacion),
      NOW(),
      NOW()
    )
    RETURNING id, conversion_stage INTO v_prospect_id, v_current_stage;

    RAISE NOTICE '✅ Nuevo prospecto creado en nexus_prospects - ID: %', v_prospect_id;

    v_existing_name := v_nombre;
    v_existing_phone := v_telefono;
  ELSE
    -- Prospecto existe - actualizar campos
    UPDATE nexus_prospects
    SET
      name = COALESCE(v_nombre, name),
      email = COALESCE(v_email, email),
      phone = COALESCE(v_telefono, phone),
      archetype = COALESCE(v_arquetipo, v_ocupacion, archetype),
      updated_at = NOW()
    WHERE id = v_prospect_id;

    RAISE NOTICE '🔄 Prospecto actualizado en nexus_prospects - ID: %', v_prospect_id;

    v_existing_name := COALESCE(v_nombre, v_existing_name);
    v_existing_phone := COALESCE(v_telefono, v_existing_phone);
  END IF;

  -- ================================================================
  -- LÓGICA DE AVANCE AUTOMÁTICO DE STAGES
  -- ================================================================

  v_new_stage := v_current_stage;

  -- INICIAR → ACTIVAR (Salto directo con datos completos)
  IF v_current_stage = 'INICIAR' THEN
    IF v_existing_name IS NOT NULL
       AND COALESCE(v_arquetipo, v_ocupacion) IS NOT NULL
       AND v_existing_phone IS NOT NULL
       AND v_nivel_interes >= 7 THEN
      v_new_stage := 'ACTIVAR';
      v_should_advance := TRUE;
      RAISE NOTICE '🚀 INICIAR → ACTIVAR (datos completos + alto interés: %)', v_nivel_interes;

    -- INICIAR → ACOGER
    ELSIF v_existing_name IS NOT NULL
          AND COALESCE(v_arquetipo, v_ocupacion) IS NOT NULL
          AND v_nivel_interes >= 4 THEN
      v_new_stage := 'ACOGER';
      v_should_advance := TRUE;
      RAISE NOTICE '✅ INICIAR → ACOGER (nombre + ocupación, interés: %)', v_nivel_interes;
    END IF;
  END IF;

  -- ACOGER → ACTIVAR
  IF v_current_stage = 'ACOGER' THEN
    IF v_existing_phone IS NOT NULL AND v_nivel_interes >= 7 THEN
      v_new_stage := 'ACTIVAR';
      v_should_advance := TRUE;
      RAISE NOTICE '🎯 ACOGER → ACTIVAR (WhatsApp + interés: %)', v_nivel_interes;
    END IF;
  END IF;

  -- Aplicar cambio de stage
  IF v_should_advance THEN
    UPDATE nexus_prospects
    SET
      conversion_stage = v_new_stage,
      stage_changed_at = NOW(),
      updated_at = NOW()
    WHERE id = v_prospect_id;

    RAISE NOTICE '📊 Stage actualizado: % → %', v_current_stage, v_new_stage;
  END IF;

  -- ================================================================
  -- PARTE 2: SINCRONIZAR CON TABLA prospects (NUEVO)
  -- ================================================================

  BEGIN
    UPDATE prospects
    SET
      nombre = COALESCE(v_nombre, nombre),
      email = COALESCE(v_email, email),
      telefono = COALESCE(v_telefono, telefono),
      archetype = COALESCE(v_arquetipo, v_ocupacion, archetype),
      iaa_stage = v_new_stage,
      interest_score = GREATEST(COALESCE(v_nivel_interes::INT, 0), COALESCE(interest_score, 0)),
      updated_at = NOW()
    WHERE fingerprint_id = p_fingerprint_id;

    -- Verificar si se actualizó algún registro
    IF FOUND THEN
      v_synced_to_prospects := TRUE;
      RAISE NOTICE '🔄 Sincronizado con tabla prospects - fingerprint: %', p_fingerprint_id;
    ELSE
      v_synced_to_prospects := FALSE;
      RAISE NOTICE '⚠️ No se encontró registro en prospects para fingerprint: %', p_fingerprint_id;
    END IF;

  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING '❌ Error sincronizando con prospects: %', SQLERRM;
      v_synced_to_prospects := FALSE;
  END;

  -- ================================================================
  -- RETORNAR RESULTADO
  -- ================================================================

  v_result := jsonb_build_object(
    'success', TRUE,
    'prospect_id', v_prospect_id,
    'stage', v_new_stage,
    'advanced', v_should_advance,
    'has_name', v_existing_name IS NOT NULL,
    'has_phone', v_existing_phone IS NOT NULL,
    'synced_to_prospects', v_synced_to_prospects
  );

  RETURN v_result;
END;
$$;

-- Comentario explicativo
COMMENT ON FUNCTION update_prospect_data(TEXT, JSONB) IS
'Actualiza datos de prospecto en nexus_prospects y sincroniza automáticamente con tabla prospects para Dashboard del constructor';
