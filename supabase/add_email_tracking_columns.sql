-- Agregar columnas de tracking de emails a funnel_leads
-- Ejecutar en Supabase SQL Editor

-- Columna para rastrear el último email enviado (1-5)
ALTER TABLE funnel_leads
ADD COLUMN IF NOT EXISTS last_email_sent INTEGER DEFAULT 0;

-- Columna para fecha del último email
ALTER TABLE funnel_leads
ADD COLUMN IF NOT EXISTS last_email_sent_at TIMESTAMPTZ;

-- Columna para marcar secuencia completada
ALTER TABLE funnel_leads
ADD COLUMN IF NOT EXISTS email_sequence_completed BOOLEAN DEFAULT FALSE;

-- Índice para queries del CRON
CREATE INDEX IF NOT EXISTS idx_funnel_leads_email_sequence
ON funnel_leads (email_sequence_completed, created_at);

-- Verificar columnas agregadas
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'funnel_leads'
AND column_name IN ('last_email_sent', 'last_email_sent_at', 'email_sequence_completed');
