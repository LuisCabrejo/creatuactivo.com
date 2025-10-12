-- =====================================================
-- HABILITAR EXTENSIÓN pg_net
-- =====================================================
-- pg_net es necesaria para hacer HTTP requests desde triggers
-- Permite invocar Edge Functions de forma asíncrona

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Verificar que esté habilitada
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_net'
  ) THEN
    RAISE EXCEPTION 'pg_net extension not available. Please enable it in Supabase Dashboard > Database > Extensions';
  END IF;
END $$;
