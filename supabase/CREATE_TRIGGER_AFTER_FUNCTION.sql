-- =====================================================
-- APLICAR DESPUÉS DE DESPLEGAR LA EDGE FUNCTION
-- =====================================================
-- Este script crea el trigger que invoca automáticamente
-- la Edge Function nexus-queue-processor cuando se inserta
-- un mensaje en la cola.
--
-- PREREQUISITOS:
-- 1. Aplicar APPLY_MANUALLY.sql
-- 2. Desplegar Edge Function: npx supabase functions deploy nexus-queue-processor
-- 3. Configurar secrets en Supabase (ANTHROPIC_API_KEY, etc.)
-- 4. ENTONCES ejecutar este script
-- =====================================================

-- PASO 1: Obtener la URL de tu proyecto Supabase
-- Reemplaza XXXXX con tu project ID real
DO $$
DECLARE
  project_url TEXT := 'https://cvadzbmdypnbrbnkznpb.supabase.co';
  service_role_key TEXT := current_setting('supabase.service_role_jwt', true);
BEGIN
  -- Guardar configuración en settings para que la función la use
  PERFORM set_config('app.settings.supabase_url', project_url, false);
  PERFORM set_config('app.settings.supabase_service_role_key', service_role_key, false);

  RAISE NOTICE 'Configuración guardada: %', project_url;
END $$;

-- PASO 2: Crear función que invoca Edge Function
CREATE OR REPLACE FUNCTION invoke_nexus_processor()
RETURNS TRIGGER AS $$
DECLARE
  function_url TEXT;
  request_id BIGINT;
BEGIN
  -- Construir URL de la Edge Function
  function_url := 'https://cvadzbmdypnbrbnkznpb.supabase.co/functions/v1/nexus-queue-processor';

  -- Invocar Edge Function de forma asíncrona usando pg_net 0.14+
  BEGIN
    SELECT net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('supabase.service_role_jwt', true),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'queue_id', NEW.id,
        'session_id', NEW.session_id
      )
    ) INTO request_id;

    RAISE NOTICE 'Edge Function invocada para queue_id: % (request_id: %)', NEW.id, request_id;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log error pero no fallar la inserción
      RAISE WARNING 'Error invocando nexus-queue-processor para queue_id %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 3: Crear trigger
DROP TRIGGER IF EXISTS on_nexus_message_inserted ON nexus_queue;

CREATE TRIGGER on_nexus_message_inserted
  AFTER INSERT ON nexus_queue
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION invoke_nexus_processor();

-- Verificación
SELECT 'Trigger creado exitosamente!' AS status;

-- PASO 4: Probar el trigger
-- Insertar un mensaje de prueba
INSERT INTO nexus_queue (messages, session_id, fingerprint, metadata)
VALUES (
  '[{"role": "user", "content": "Hola, me llamo Test User"}]'::jsonb,
  'test-session-' || extract(epoch from now())::text,
  'test-fingerprint-123',
  '{"test": true}'::jsonb
);

-- Verificar que se insertó
SELECT id, status, created_at
FROM nexus_queue
WHERE session_id LIKE 'test-session-%'
ORDER BY created_at DESC
LIMIT 1;

-- Esperar 2-3 segundos y verificar que el status cambió a 'completed'
-- Si no cambia, revisa los logs de la Edge Function en Supabase Dashboard
