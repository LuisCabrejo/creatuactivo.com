-- Migración: Trigger para notificar cambios de stage
-- Fecha: 2025-10-13
-- Propósito: Enviar notificaciones automáticas cuando un prospecto avanza de etapa

-- 1. Crear tabla para registro de notificaciones enviadas
CREATE TABLE IF NOT EXISTS stage_change_notifications (
  id BIGSERIAL PRIMARY KEY,
  prospect_id BIGINT NOT NULL REFERENCES nexus_prospects(id) ON DELETE CASCADE,
  old_stage TEXT NOT NULL,
  new_stage TEXT NOT NULL,
  constructor_id UUID,
  email_sent BOOLEAN DEFAULT FALSE,
  email_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas
CREATE INDEX IF NOT EXISTS idx_notifications_prospect_id ON stage_change_notifications(prospect_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON stage_change_notifications(created_at DESC);

-- 2. Función para invocar Edge Function de notificación
CREATE OR REPLACE FUNCTION notify_stage_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_constructor_id UUID;
  v_interest_score INT;
BEGIN
  -- Solo notificar si el stage cambió Y avanzó (no retrocedió)
  IF OLD.conversion_stage IS DISTINCT FROM NEW.conversion_stage THEN

    -- Verificar que sea un avance válido
    IF (OLD.conversion_stage = 'INICIAR' AND NEW.conversion_stage IN ('ACOGER', 'ACTIVAR'))
       OR (OLD.conversion_stage = 'ACOGER' AND NEW.conversion_stage = 'ACTIVAR') THEN

      -- Obtener constructor_id del prospecto
      SELECT constructor_id INTO v_constructor_id
      FROM prospects
      WHERE fingerprint_id = NEW.session_id
      LIMIT 1;

      -- Obtener interest_score si existe
      SELECT COALESCE(interest_score, 0) INTO v_interest_score
      FROM prospects
      WHERE fingerprint_id = NEW.session_id
      LIMIT 1;

      -- Registrar intento de notificación
      INSERT INTO stage_change_notifications (
        prospect_id,
        old_stage,
        new_stage,
        constructor_id,
        email_sent
      ) VALUES (
        NEW.id,
        OLD.conversion_stage,
        NEW.conversion_stage,
        v_constructor_id,
        FALSE
      );

      -- Intentar invocar Edge Function (async, no bloqueante)
      BEGIN
        PERFORM net.http_post(
          url := current_setting('app.supabase_function_url') || '/notify-stage-change',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.supabase_anon_key')
          ),
          body := jsonb_build_object(
            'prospect_id', NEW.id,
            'session_id', NEW.session_id,
            'name', NEW.name,
            'email', NEW.email,
            'phone', NEW.phone,
            'old_stage', OLD.conversion_stage,
            'new_stage', NEW.conversion_stage,
            'archetype', NEW.archetype,
            'interest_score', v_interest_score
          )
        );
      EXCEPTION
        WHEN OTHERS THEN
          -- Si falla, solo loguear pero no bloquear el UPDATE
          RAISE WARNING 'Failed to call notify-stage-change function: %', SQLERRM;
      END;

    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Crear trigger en tabla nexus_prospects
DROP TRIGGER IF EXISTS trg_notify_stage_change ON nexus_prospects;

CREATE TRIGGER trg_notify_stage_change
AFTER UPDATE OF conversion_stage ON nexus_prospects
FOR EACH ROW
WHEN (OLD.conversion_stage IS DISTINCT FROM NEW.conversion_stage)
EXECUTE FUNCTION notify_stage_change();

-- 4. Comentarios
COMMENT ON TABLE stage_change_notifications IS 'Registro de notificaciones enviadas por cambios de stage';
COMMENT ON FUNCTION notify_stage_change IS 'Trigger function que invoca Edge Function para enviar notificaciones por email';

-- 5. Configurar variables de entorno (ejecutar manualmente después del deploy)
-- ALTER DATABASE postgres SET app.supabase_function_url = 'https://YOUR_PROJECT_ID.supabase.co/functions/v1';
-- ALTER DATABASE postgres SET app.supabase_anon_key = 'YOUR_ANON_KEY';

-- Verificar trigger creado
SELECT
  tgname as trigger_name,
  tgenabled as enabled,
  pg_get_triggerdef(oid) as definition
FROM pg_trigger
WHERE tgname = 'trg_notify_stage_change';
