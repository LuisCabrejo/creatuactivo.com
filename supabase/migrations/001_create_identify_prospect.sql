-- ================================================================
-- FUNCIÓN: identify_prospect
-- ================================================================
-- PROPÓSITO: Identificar y registrar prospectos que visitan el sitio
-- CORRECCIÓN: Regex corregido para URLs tipo /fundadores/[constructor_id]
-- FECHA: 2025-10-17
-- AUTOR: Claude (Marketing + Dashboard)
-- ================================================================

CREATE OR REPLACE FUNCTION identify_prospect(
  p_fingerprint TEXT,
  p_url TEXT,
  p_device JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_prospect_id UUID;
  v_constructor_id UUID := NULL;
  v_constructor_ref TEXT;
  v_visits INT := 1;
  v_is_returning BOOLEAN := FALSE;
BEGIN
  -- ================================================================
  -- PASO 1: Extraer constructor_id desde la URL
  -- ================================================================
  -- URL esperada: https://creatuactivo.com/fundadores/luis-cabrejo-parra-4871288
  -- Regex corregido: /fundadores/([^/?#]+)
  v_constructor_ref := (regexp_matches(p_url, '/fundadores/([^/?#]+)'))[1];

  RAISE NOTICE '🔍 [identify_prospect] URL recibida: %', p_url;
  RAISE NOTICE '🔍 [identify_prospect] Constructor extraído: %', COALESCE(v_constructor_ref, 'NINGUNO');

  -- ================================================================
  -- PASO 2: Buscar UUID del constructor en private_users
  -- ================================================================
  IF v_constructor_ref IS NOT NULL THEN
    SELECT id INTO v_constructor_id
    FROM private_users
    WHERE constructor_id = v_constructor_ref
    AND status = 'active';

    IF v_constructor_id IS NULL THEN
      RAISE WARNING '⚠️ [identify_prospect] Constructor no encontrado en DB: %', v_constructor_ref;
    ELSE
      RAISE NOTICE '✅ [identify_prospect] Constructor encontrado - Ref: % -> UUID: %',
        v_constructor_ref, v_constructor_id;
    END IF;
  ELSE
    RAISE WARNING '⚠️ [identify_prospect] No se pudo extraer constructor_id de URL: %', p_url;
  END IF;

  -- ================================================================
  -- PASO 3: Verificar si el prospecto ya existe
  -- ================================================================
  SELECT id, visits INTO v_prospect_id, v_visits
  FROM prospects
  WHERE fingerprint_id = p_fingerprint;

  IF v_prospect_id IS NOT NULL THEN
    -- ================================================================
    -- PROSPECTO EXISTENTE: Incrementar visitas
    -- ================================================================
    v_is_returning := TRUE;
    v_visits := v_visits + 1;

    UPDATE prospects
    SET
      visits = v_visits,
      last_url = p_url,
      constructor_id = COALESCE(constructor_id, v_constructor_id), -- ⚠️ NO sobrescribir si ya existe
      device_info = COALESCE(device_info, '{}'::jsonb) || p_device,  -- Merge JSONB
      updated_at = NOW()
    WHERE id = v_prospect_id;

    RAISE NOTICE '🔄 [identify_prospect] Prospecto existente actualizado - ID: % (visitas: %)',
      v_prospect_id, v_visits;
  ELSE
    -- ================================================================
    -- NUEVO PROSPECTO: Crear registro
    -- ================================================================
    INSERT INTO prospects (
      fingerprint_id,
      constructor_id,
      first_url,
      last_url,
      stage,
      visits,
      device_info,
      created_at,
      updated_at
    ) VALUES (
      p_fingerprint,
      v_constructor_id,
      p_url,
      p_url,
      'iniciar',
      1,
      p_device,
      NOW(),
      NOW()
    )
    RETURNING id INTO v_prospect_id;

    RAISE NOTICE '✨ [identify_prospect] Nuevo prospecto creado - ID: %, Constructor: %',
      v_prospect_id, COALESCE(v_constructor_ref, 'SIN REFERENTE');
  END IF;

  -- ================================================================
  -- PASO 4: Retornar información del prospecto
  -- ================================================================
  RETURN jsonb_build_object(
    'success', TRUE,
    'prospect_id', v_prospect_id,
    'constructor_id', v_constructor_id,
    'constructor_ref', v_constructor_ref,
    'is_returning', v_is_returning,
    'visits', v_visits
  );

EXCEPTION WHEN OTHERS THEN
  -- ================================================================
  -- MANEJO DE ERRORES
  -- ================================================================
  RAISE WARNING '❌ [identify_prospect] Error: %', SQLERRM;
  RETURN jsonb_build_object(
    'success', FALSE,
    'error', SQLERRM,
    'fingerprint', p_fingerprint,
    'url', p_url
  );
END;
$$;

-- ================================================================
-- COMENTARIO Y PERMISOS
-- ================================================================
COMMENT ON FUNCTION identify_prospect(TEXT, TEXT, JSONB) IS
'Identifica y registra prospectos. Extrae constructor_id de URLs /fundadores/[id]. Versión corregida 2025-10-17.';

-- Otorgar permisos de ejecución al rol anon (usado desde tracking.js)
GRANT EXECUTE ON FUNCTION identify_prospect(TEXT, TEXT, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION identify_prospect(TEXT, TEXT, JSONB) TO authenticated;
