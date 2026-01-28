-- ============================================================================
-- FIX FUNNEL_LEADS SCHEMA - Agregar columnas para Reto de 5 Días
-- ============================================================================
-- Fecha: 19 de enero de 2026
-- Propósito: Agregar columnas faltantes para que el cron job funcione
--
-- INSTRUCCIONES:
-- 1. Copia este SQL completo
-- 2. Pega en Supabase Dashboard → SQL Editor
-- 3. Click "Run" (o Ctrl/Cmd + Enter)
-- ============================================================================

BEGIN;

-- Agregar columnas para tracking del Reto de 5 Días
ALTER TABLE funnel_leads
ADD COLUMN IF NOT EXISTS reto_email_day INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reto_last_email_at TIMESTAMPTZ;

-- Comentarios descriptivos
COMMENT ON COLUMN funnel_leads.reto_email_day IS 'Último día del reto enviado (0-5). 0 = no ha recibido emails';
COMMENT ON COLUMN funnel_leads.reto_last_email_at IS 'Timestamp del último email enviado del reto';

-- Verificar que las columnas se crearon
DO $$
DECLARE
    column_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO column_count
    FROM information_schema.columns
    WHERE table_name = 'funnel_leads'
    AND column_name IN ('reto_email_day', 'reto_last_email_at');

    IF column_count = 2 THEN
        RAISE NOTICE '✅ Columnas agregadas exitosamente: reto_email_day, reto_last_email_at';
    ELSE
        RAISE EXCEPTION '❌ Error: No se pudieron crear todas las columnas';
    END IF;
END $$;

COMMIT;

-- Mostrar schema actualizado
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'funnel_leads'
ORDER BY ordinal_position;
