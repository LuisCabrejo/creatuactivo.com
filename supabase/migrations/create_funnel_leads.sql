-- ============================================================================
-- TABLA: funnel_leads
-- Fallback para guardar leads del funnel Russell Brunson
-- Ejecutar en Supabase SQL Editor
-- ============================================================================

CREATE TABLE IF NOT EXISTS funnel_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  whatsapp TEXT,
  source TEXT DEFAULT 'calculadora',
  step TEXT DEFAULT 'lead_captured',

  -- Datos de la calculadora
  situation TEXT,
  monthly_expenses NUMERIC,
  passive_income NUMERIC,
  freedom_days INTEGER,

  -- Email sequence tracking
  last_email_sent INTEGER DEFAULT 0,
  last_email_sent_at TIMESTAMPTZ,
  email_sequence_completed BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_funnel_leads_email ON funnel_leads(email);
CREATE INDEX IF NOT EXISTS idx_funnel_leads_source ON funnel_leads(source);
CREATE INDEX IF NOT EXISTS idx_funnel_leads_step ON funnel_leads(step);
CREATE INDEX IF NOT EXISTS idx_funnel_leads_created ON funnel_leads(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE funnel_leads ENABLE ROW LEVEL SECURITY;

-- Política: Solo el service role puede insertar/leer
CREATE POLICY "Service role full access" ON funnel_leads
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_funnel_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_funnel_leads_updated_at
  BEFORE UPDATE ON funnel_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_funnel_leads_updated_at();

-- Comentario
COMMENT ON TABLE funnel_leads IS 'Leads del funnel Russell Brunson (Calculadora → Reto 5 Días)';
