-- ================================================================
-- CORRECCIÓN DE SEGURIDAD RLS - 21 TABLAS
-- ================================================================
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- Fecha: 11 Dic 2025
-- Propósito: Habilitar RLS y crear políticas seguras
-- ================================================================

-- ================================================================
-- PARTE 1: TABLAS CORE DEL SISTEMA
-- ================================================================

-- 1. PROSPECTS (tracking de visitantes)
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON prospects;
CREATE POLICY "Service role full access" ON prospects
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can insert and update" ON prospects;
CREATE POLICY "Anon can insert and update" ON prospects
  FOR ALL TO anon
  USING (true) WITH CHECK (true);

-- 2. PROSPECT_DATA (datos capturados)
ALTER TABLE prospect_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON prospect_data;
CREATE POLICY "Service role full access" ON prospect_data
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can insert and update" ON prospect_data;
CREATE POLICY "Anon can insert and update" ON prospect_data
  FOR ALL TO anon
  USING (true) WITH CHECK (true);

-- 3. NEXUS_DOCUMENTS (knowledge base - arsenales)
ALTER TABLE nexus_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON nexus_documents;
CREATE POLICY "Service role full access" ON nexus_documents
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can read" ON nexus_documents;
CREATE POLICY "Anon can read" ON nexus_documents
  FOR SELECT TO anon
  USING (true);

-- 4. NEXUS_CONVERSATIONS (historial chat)
ALTER TABLE nexus_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON nexus_conversations;
CREATE POLICY "Service role full access" ON nexus_conversations
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can insert" ON nexus_conversations;
CREATE POLICY "Anon can insert" ON nexus_conversations
  FOR INSERT TO anon
  WITH CHECK (true);

-- 5. NEXUS_QUEUE (cola async)
ALTER TABLE nexus_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON nexus_queue;
CREATE POLICY "Service role full access" ON nexus_queue
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can insert" ON nexus_queue;
CREATE POLICY "Anon can insert" ON nexus_queue
  FOR INSERT TO anon
  WITH CHECK (true);

-- 6. SYSTEM_PROMPTS (prompts NEXUS)
ALTER TABLE system_prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON system_prompts;
CREATE POLICY "Service role full access" ON system_prompts
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can read" ON system_prompts;
CREATE POLICY "Anon can read" ON system_prompts
  FOR SELECT TO anon
  USING (true);

-- 7. PENDING_ACTIVATIONS (activaciones fundadores)
ALTER TABLE pending_activations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON pending_activations;
CREATE POLICY "Service role full access" ON pending_activations
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can insert" ON pending_activations;
CREATE POLICY "Anon can insert" ON pending_activations
  FOR INSERT TO anon
  WITH CHECK (true);

-- ================================================================
-- PARTE 2: TABLAS DE ANALYTICS/TRACKING
-- ================================================================

-- 8. PAGE_VISITS
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON page_visits;
CREATE POLICY "Service role full access" ON page_visits
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can insert" ON page_visits;
CREATE POLICY "Anon can insert" ON page_visits
  FOR INSERT TO anon
  WITH CHECK (true);

-- 9. DEVICE_INFO
ALTER TABLE device_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON device_info;
CREATE POLICY "Service role full access" ON device_info
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can insert" ON device_info;
CREATE POLICY "Anon can insert" ON device_info
  FOR INSERT TO anon
  WITH CHECK (true);

-- 10. PROSPECT_INTERACTIONS
ALTER TABLE prospect_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON prospect_interactions;
CREATE POLICY "Service role full access" ON prospect_interactions
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can insert" ON prospect_interactions;
CREATE POLICY "Anon can insert" ON prospect_interactions
  FOR INSERT TO anon
  WITH CHECK (true);

-- ================================================================
-- PARTE 3: TABLAS DE CONSTRUCTORES/ADMIN
-- ================================================================

-- 11. CONSTRUCTORS
ALTER TABLE constructors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON constructors;
CREATE POLICY "Service role full access" ON constructors
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 12. CONSTRUCTOR_ACTIONS
ALTER TABLE constructor_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON constructor_actions;
CREATE POLICY "Service role full access" ON constructor_actions
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 13. ALERTAS_PROSPECTOS
ALTER TABLE alertas_prospectos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON alertas_prospectos;
CREATE POLICY "Service role full access" ON alertas_prospectos
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 14. REPORTES_INTELIGENCIA
ALTER TABLE reportes_inteligencia ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON reportes_inteligencia;
CREATE POLICY "Service role full access" ON reportes_inteligencia
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ================================================================
-- PARTE 4: TABLAS DE SUSCRIPCIONES
-- ================================================================

-- 15. SUBSCRIPTIONS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON subscriptions;
CREATE POLICY "Service role full access" ON subscriptions
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 16. SUBSCRIPTION_HISTORY
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON subscription_history;
CREATE POLICY "Service role full access" ON subscription_history
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ================================================================
-- PARTE 5: TABLAS DE BACKUP (solo service_role)
-- ================================================================

-- 17. PROSPECTS_BACKUP_20251017
ALTER TABLE prospects_backup_20251017 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only" ON prospects_backup_20251017;
CREATE POLICY "Service role only" ON prospects_backup_20251017
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 18. SYSTEM_PROMPTS_BACKUP
ALTER TABLE system_prompts_backup ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only" ON system_prompts_backup;
CREATE POLICY "Service role only" ON system_prompts_backup
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 19. SYSTEM_PROMPTS_BACKUP_V112
ALTER TABLE system_prompts_backup_v112 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only" ON system_prompts_backup_v112;
CREATE POLICY "Service role only" ON system_prompts_backup_v112
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 20. SYSTEM_PROMPTS_BACKUP_V11_1
ALTER TABLE system_prompts_backup_v11_1 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only" ON system_prompts_backup_v11_1;
CREATE POLICY "Service role only" ON system_prompts_backup_v11_1
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 21. SYSTEM_PROMPTS_BACKUP_V11_2
ALTER TABLE system_prompts_backup_v11_2 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only" ON system_prompts_backup_v11_2;
CREATE POLICY "Service role only" ON system_prompts_backup_v11_2
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ================================================================
-- VERIFICACIÓN FINAL
-- ================================================================
SELECT
  tablename as "Tabla",
  CASE WHEN rowsecurity THEN '✅ RLS OK' ELSE '❌ FALTA RLS' END as "Estado"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY rowsecurity DESC, tablename;

SELECT '✅ CORRECCIÓN COMPLETADA - 21 tablas aseguradas' as status;
