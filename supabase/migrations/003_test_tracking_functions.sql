-- ================================================================
-- TESTS: Verificación de funciones de tracking
-- ================================================================
-- PROPÓSITO: Validar que identify_prospect y update_prospect_data
--            funcionan correctamente con la nueva estructura
-- FECHA: 2025-10-17
-- ================================================================

-- ================================================================
-- TEST 1: Verificar que las funciones existen
-- ================================================================
SELECT
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines
WHERE routine_name IN ('identify_prospect', 'update_prospect_data')
AND routine_schema = 'public';

-- Resultado esperado: 2 filas (ambas funciones)
-- Si falta alguna, ejecutar los archivos 001 y 002 primero

-- ================================================================
-- TEST 2: Test de identify_prospect con URL válida
-- ================================================================
-- Simula una visita a /fundadores/luis-cabrejo-parra-4871288

SELECT identify_prospect(
  'test-fingerprint-001',
  'https://creatuactivo.com/fundadores/luis-cabrejo-parra-4871288',
  '{"os": "MacOS", "browser": "Chrome", "device": "desktop"}'::jsonb
) as resultado_identify_prospect;

-- Resultado esperado:
-- {
--   "success": true,
--   "prospect_id": "uuid-aqui",
--   "constructor_id": "ab4fadb9-e020-414d-a474-ff57828356c6",
--   "constructor_ref": "luis-cabrejo-parra-4871288",
--   "is_returning": false,
--   "visits": 1
-- }

-- ================================================================
-- TEST 3: Verificar que se creó el prospecto en la tabla
-- ================================================================
SELECT
  id,
  fingerprint_id,
  constructor_id,
  stage,
  visits,
  device_info,
  created_at
FROM prospects
WHERE fingerprint_id = 'test-fingerprint-001';

-- Resultado esperado:
-- - constructor_id debe tener un UUID válido (no NULL)
-- - stage debe ser 'iniciar'
-- - visits debe ser 1
-- - device_info debe tener {os, browser, device}

-- ================================================================
-- TEST 4: Test de identify_prospect con prospecto existente
-- ================================================================
-- Segunda visita del mismo usuario (incrementa visits)

SELECT identify_prospect(
  'test-fingerprint-001',
  'https://creatuactivo.com/fundadores/luis-cabrejo-parra-4871288',
  '{"os": "MacOS", "browser": "Chrome", "device": "desktop"}'::jsonb
) as resultado_segunda_visita;

-- Resultado esperado:
-- {
--   "success": true,
--   "is_returning": true,  ← TRUE ahora
--   "visits": 2             ← Incrementado
-- }

-- ================================================================
-- TEST 5: Test de update_prospect_data (etapa INICIAR → ACOGER)
-- ================================================================
-- Capturar nombre, email y teléfono para avanzar a ACOGER

SELECT update_prospect_data(
  'test-fingerprint-001',
  '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "3001234567",
    "ocupacion": "Ingeniero",
    "nivel_interes": 5
  }'::jsonb
) as resultado_captura_datos;

-- Resultado esperado:
-- {
--   "success": true,
--   "stage": "acoger",           ← Cambió de iniciar a acoger
--   "stage_updated": true,
--   "previous_stage": "iniciar",
--   "has_complete_data": true,
--   "nivel_interes": 5
-- }

-- ================================================================
-- TEST 6: Verificar cambio de stage en tabla prospects
-- ================================================================
SELECT
  fingerprint_id,
  stage,
  device_info->>'nombre' as nombre,
  device_info->>'email' as email,
  device_info->>'telefono' as telefono,
  device_info->>'nivel_interes' as nivel_interes
FROM prospects
WHERE fingerprint_id = 'test-fingerprint-001';

-- Resultado esperado:
-- - stage debe ser 'acoger'
-- - device_info debe tener todos los campos capturados

-- ================================================================
-- TEST 7: Test de update_prospect_data (etapa ACOGER → ACTIVAR)
-- ================================================================
-- Actualizar nivel de interés para avanzar a ACTIVAR

SELECT update_prospect_data(
  'test-fingerprint-001',
  '{
    "nivel_interes": 9
  }'::jsonb
) as resultado_alto_interes;

-- Resultado esperado:
-- {
--   "success": true,
--   "stage": "activar",          ← Cambió de acoger a activar
--   "stage_updated": true,
--   "previous_stage": "acoger",
--   "nivel_interes": 9
-- }

-- ================================================================
-- TEST 8: Test con URL sin constructor_id
-- ================================================================
-- Visita a página sin referente

SELECT identify_prospect(
  'test-fingerprint-002',
  'https://creatuactivo.com/',
  '{"os": "Windows", "browser": "Firefox"}'::jsonb
) as resultado_sin_referente;

-- Resultado esperado:
-- {
--   "success": true,
--   "prospect_id": "uuid-aqui",
--   "constructor_id": null,      ← NULL porque no hay referente
--   "constructor_ref": null,
--   "is_returning": false,
--   "visits": 1
-- }

-- ================================================================
-- TEST 9: Test con constructor_id inexistente
-- ================================================================
-- URL con constructor que no existe en la DB

SELECT identify_prospect(
  'test-fingerprint-003',
  'https://creatuactivo.com/fundadores/inexistente-999999',
  '{"os": "iOS", "browser": "Safari"}'::jsonb
) as resultado_constructor_inexistente;

-- Resultado esperado:
-- {
--   "success": true,
--   "prospect_id": "uuid-aqui",
--   "constructor_id": null,              ← NULL porque no se encontró
--   "constructor_ref": "inexistente-999999", ← Se extrajo pero no existe
--   "is_returning": false,
--   "visits": 1
-- }

-- ================================================================
-- TEST 10: Verificar que NO sobrescribe constructor_id existente
-- ================================================================
-- Un prospecto que ya tiene constructor NO debe cambiar de mentor

-- Primero: crear prospecto con constructor A
SELECT identify_prospect(
  'test-fingerprint-004',
  'https://creatuactivo.com/fundadores/luis-cabrejo-parra-4871288',
  '{}'::jsonb
);

-- Segundo: visitar con constructor B (diferente)
-- NOTA: Debes reemplazar 'otro-constructor-123' con un constructor_id válido de tu DB
SELECT identify_prospect(
  'test-fingerprint-004',
  'https://creatuactivo.com/fundadores/otro-constructor-123',
  '{}'::jsonb
);

-- Tercero: verificar que constructor_id NO cambió
SELECT
  fingerprint_id,
  constructor_id,
  visits
FROM prospects
WHERE fingerprint_id = 'test-fingerprint-004';

-- Resultado esperado:
-- - constructor_id debe ser el UUID de luis-cabrejo-parra-4871288 (el primero)
-- - visits debe ser 2
-- - NO debe cambiar a otro-constructor-123

-- ================================================================
-- LIMPIEZA: Eliminar datos de prueba
-- ================================================================
-- Ejecuta esto cuando termines de verificar los tests

DELETE FROM prospects
WHERE fingerprint_id LIKE 'test-fingerprint-%';

-- Verificar que se eliminaron
SELECT COUNT(*) as prospectos_prueba_restantes
FROM prospects
WHERE fingerprint_id LIKE 'test-fingerprint-%';
-- Debe retornar 0

-- ================================================================
-- RESUMEN DE TESTS
-- ================================================================
-- ✅ TEST 1: Funciones existen
-- ✅ TEST 2: identify_prospect con URL válida
-- ✅ TEST 3: Prospecto creado en tabla
-- ✅ TEST 4: Prospecto existente (visitas incrementan)
-- ✅ TEST 5: Captura datos y avanza INICIAR → ACOGER
-- ✅ TEST 6: Verificar stage en tabla
-- ✅ TEST 7: Alto interés avanza ACOGER → ACTIVAR
-- ✅ TEST 8: URL sin referente (constructor_id NULL)
-- ✅ TEST 9: Constructor inexistente (constructor_id NULL)
-- ✅ TEST 10: NO sobrescribe constructor_id existente
-- ================================================================
