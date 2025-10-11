-- ================================================================
-- FIX FINAL: Función update_prospect_data con ESTRUCTURA REAL
-- ================================================================
-- Basado en la estructura real de nexus_prospects:
-- - session_id (TEXT) - Identificador único del prospecto
-- - conversion_stage (TEXT) - Stage actual (INICIAR, ACOGER, ACTIVAR)
-- - name, email, phone, archetype (TEXT) - Datos directos
-- - NO hay interest_score ni prospect_data (JSONB)
-- ================================================================
-- Fecha: 8 Octubre 2025
-- Versión: FINAL - Estructura Real
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
  -- Variables para datos actuales del prospecto
  v_existing_name TEXT;
  v_existing_phone TEXT;
BEGIN
  -- Extraer datos del JSONB entrante
  v_nombre := p_data->>'nombre';
  v_ocupacion := p_data->>'ocupacion';  -- Se guardará en archetype si está mapeado
  v_telefono := p_data->>'telefono';
  v_email := p_data->>'email';
  v_arquetipo := p_data->>'arquetipo';
  v_nivel_interes := COALESCE((p_data->>'nivel_interes')::NUMERIC, 0);

  RAISE NOTICE '📥 update_prospect_data - session: %, data: %', p_fingerprint_id, p_data;

  -- Buscar prospecto existente por session_id
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
      COALESCE(v_arquetipo, v_ocupacion), -- Usar arquetipo o ocupación
      NOW(),
      NOW()
    )
    RETURNING id, conversion_stage INTO v_prospect_id, v_current_stage;

    RAISE NOTICE '✅ Nuevo prospecto creado - ID: %, Stage: INICIAR', v_prospect_id;

    -- Inicializar variables de datos existentes
    v_existing_name := v_nombre;
    v_existing_phone := v_telefono;
  ELSE
    -- Prospecto existe - actualizar solo campos que vienen en p_data
    UPDATE nexus_prospects
    SET
      name = COALESCE(v_nombre, name),
      email = COALESCE(v_email, email),
      phone = COALESCE(v_telefono, phone),
      archetype = COALESCE(v_arquetipo, v_ocupacion, archetype),
      updated_at = NOW()
    WHERE id = v_prospect_id;

    RAISE NOTICE '🔄 Prospecto actualizado - ID: %, Stage actual: %', v_prospect_id, v_current_stage;

    -- Actualizar variables con datos merged
    v_existing_name := COALESCE(v_nombre, v_existing_name);
    v_existing_phone := COALESCE(v_telefono, v_existing_phone);
  END IF;

  -- ================================================================
  -- LÓGICA DE AVANCE AUTOMÁTICO DE STAGES (Framework IAA)
  -- Usar datos acumulados (existentes + nuevos)
  -- ================================================================

  v_new_stage := v_current_stage;

  -- REGLA 1: INICIAR → ACTIVAR (Salto directo)
  -- Condición: name + archetype + phone + nivel_interes >= 7
  IF v_current_stage = 'INICIAR' THEN
    IF v_existing_name IS NOT NULL
       AND COALESCE(v_arquetipo, v_ocupacion) IS NOT NULL
       AND v_existing_phone IS NOT NULL
       AND v_nivel_interes >= 7 THEN
      v_new_stage := 'ACTIVAR';
      v_should_advance := TRUE;
      RAISE NOTICE '🚀 INICIAR → ACTIVAR (datos completos + alto interés: %)', v_nivel_interes;

    -- REGLA 2: INICIAR → ACOGER
    -- Condición: name + archetype + nivel_interes >= 4
    ELSIF v_existing_name IS NOT NULL
          AND COALESCE(v_arquetipo, v_ocupacion) IS NOT NULL
          AND v_nivel_interes >= 4 THEN
      v_new_stage := 'ACOGER';
      v_should_advance := TRUE;
      RAISE NOTICE '✅ INICIAR → ACOGER (nombre + ocupación, interés: %)', v_nivel_interes;
    END IF;
  END IF;

  -- REGLA 3: ACOGER → ACTIVAR
  -- Condición: phone + nivel_interes >= 7
  IF v_current_stage = 'ACOGER' THEN
    IF v_existing_phone IS NOT NULL AND v_nivel_interes >= 7 THEN
      v_new_stage := 'ACTIVAR';
      v_should_advance := TRUE;
      RAISE NOTICE '🎯 ACOGER → ACTIVAR (WhatsApp + interés: %)', v_nivel_interes;
    END IF;
  END IF;

  -- Aplicar cambio de stage si corresponde
  IF v_should_advance THEN
    UPDATE nexus_prospects
    SET
      conversion_stage = v_new_stage,
      stage_changed_at = NOW(),
      updated_at = NOW()
    WHERE id = v_prospect_id;

    RAISE NOTICE '📊 Stage actualizado: % → %', v_current_stage, v_new_stage;
  END IF;

  -- Retornar resultado
  v_result := jsonb_build_object(
    'success', TRUE,
    'prospect_id', v_prospect_id,
    'previous_stage', v_current_stage,
    'current_stage', v_new_stage,
    'advanced', v_should_advance,
    'interest_score', v_nivel_interes,
    'has_name', v_existing_name IS NOT NULL,
    'has_archetype', COALESCE(v_arquetipo, v_ocupacion) IS NOT NULL,
    'has_phone', v_existing_phone IS NOT NULL
  );

  RETURN v_result;

EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '❌ Error en update_prospect_data: % - %', SQLERRM, SQLSTATE;
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', SQLERRM,
      'error_code', SQLSTATE
    );
END;
$$;

-- ================================================================
-- COMENTARIOS
-- ================================================================

COMMENT ON FUNCTION update_prospect_data(TEXT, JSONB) IS
'Actualiza datos de prospecto y avanza stages automáticamente según Framework IAA.
Mapeo de datos:
- p_fingerprint_id → session_id
- p_data.nombre → name
- p_data.ocupacion/arquetipo → archetype
- p_data.telefono → phone
- p_data.email → email

Reglas de avance:
- INICIAR → ACOGER: name + archetype + interés >= 4
- ACOGER → ACTIVAR: phone + interés >= 7
- INICIAR → ACTIVAR: name + archetype + phone + interés >= 7 (salto directo)';

-- ================================================================
-- TESTING
-- ================================================================

-- Test 1: Crear prospecto con solo nombre
SELECT update_prospect_data(
  'test-session-001',
  '{"nombre": "Carlos", "nivel_interes": 7}'::JSONB
);
-- Esperado: conversion_stage = 'INICIAR', advanced = false

-- Test 2: Agregar ocupación (debe avanzar a ACOGER)
SELECT update_prospect_data(
  'test-session-001',
  '{"ocupacion": "ingeniero", "nivel_interes": 8}'::JSONB
);
-- Esperado: conversion_stage = 'ACOGER', advanced = true

-- Test 3: Agregar teléfono (debe avanzar a ACTIVAR)
SELECT update_prospect_data(
  'test-session-001',
  '{"telefono": "+573001234567", "nivel_interes": 9}'::JSONB
);
-- Esperado: conversion_stage = 'ACTIVAR', advanced = true

-- Verificar resultado
SELECT
  session_id,
  conversion_stage,
  name,
  archetype,
  phone,
  stage_changed_at
FROM nexus_prospects
WHERE session_id = 'test-session-001';

-- Test 4: Salto directo INICIAR → ACTIVAR
SELECT update_prospect_data(
  'test-session-002',
  '{"nombre": "Ana", "ocupacion": "diseñadora", "telefono": "+573009876543", "nivel_interes": 9}'::JSONB
);
-- Esperado: conversion_stage = 'ACTIVAR', advanced = true

-- Verificar
SELECT
  session_id,
  conversion_stage,
  name,
  archetype,
  phone
FROM nexus_prospects
WHERE session_id LIKE 'test-session-%'
ORDER BY session_id;

-- Limpiar tests
DELETE FROM nexus_prospects WHERE session_id LIKE 'test-session-%';

-- ================================================================
-- VER PROSPECTOS REALES
-- ================================================================

SELECT
  id,
  session_id,
  conversion_stage,
  name,
  archetype,
  phone,
  email,
  created_at,
  updated_at,
  stage_changed_at
FROM nexus_prospects
ORDER BY updated_at DESC
LIMIT 5;

-- ================================================================
-- RE-PROCESAR PROSPECTO STUCK (si existe)
-- ================================================================

-- Ver prospectos en INICIAR con datos que deberían estar en ACOGER
SELECT
  session_id,
  conversion_stage,
  name,
  archetype,
  phone
FROM nexus_prospects
WHERE conversion_stage = 'INICIAR'
  AND name IS NOT NULL
  AND archetype IS NOT NULL;

-- Para re-procesar un prospecto específico:
-- SELECT update_prospect_data(
--   'SESSION_ID_AQUI',
--   jsonb_build_object(
--     'nombre', (SELECT name FROM nexus_prospects WHERE session_id = 'SESSION_ID_AQUI'),
--     'ocupacion', (SELECT archetype FROM nexus_prospects WHERE session_id = 'SESSION_ID_AQUI'),
--     'nivel_interes', 8
--   )
-- );

SELECT '✅ Función update_prospect_data FINAL instalada correctamente' as status;
