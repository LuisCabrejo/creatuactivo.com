-- ============================================================================
-- MIGRACIÓN: Multi-Tenant RLS — Aislamiento lógico por dominio (FASE C)
-- Fecha: 16 Mar 2026
-- Propósito: Implementar namespacing hermético en nexus_documents para que
--            cada dominio (creatuactivo.com, luiscabrejo.com, queswa.app,
--            ganocafe.online) solo acceda a su propio knowledge base.
--
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- Orden de ejecución: secuencial (cada bloque depende del anterior)
-- ============================================================================


-- ============================================================================
-- BLOQUE 1: COLUMNA tenant_id EN nexus_documents
-- ============================================================================

-- 1.1 Agregar columna tenant_id con default seguro
ALTER TABLE nexus_documents
  ADD COLUMN IF NOT EXISTS tenant_id TEXT NOT NULL DEFAULT 'creatuactivo_marketing';

-- 1.2 Seed: etiquetar todos los documentos existentes como creatuactivo_marketing
--     (arsenal_inicial, arsenal_avanzado, catalogo_productos, arsenal_compensacion,
--      arsenal_reto, arsenal_12_niveles y sus 108 fragmentos)
UPDATE nexus_documents
  SET tenant_id = 'creatuactivo_marketing'
  WHERE tenant_id IS NULL OR tenant_id = '';

-- 1.3 Índice B-Tree en tenant_id para filtrado eficiente pre-vector
CREATE INDEX IF NOT EXISTS nexus_documents_tenant_id_idx
  ON nexus_documents (tenant_id);

-- 1.4 Índice compuesto tenant_id + category (patrón de acceso más frecuente)
CREATE INDEX IF NOT EXISTS nexus_documents_tenant_category_idx
  ON nexus_documents (tenant_id, category);

-- 1.5 Actualizar índice HNSW en embedding_512 si no existe
--     (IVFFlat ya existe para embedding; HNSW es superior en recall para producción)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'nexus_documents'
      AND indexname  = 'nexus_documents_embedding_512_hnsw_idx'
  ) THEN
    CREATE INDEX nexus_documents_embedding_512_hnsw_idx
      ON nexus_documents
      USING hnsw (embedding_512 vector_cosine_ops)
      WITH (m = 16, ef_construction = 64);
  END IF;
END $$;

COMMENT ON COLUMN nexus_documents.tenant_id IS
  'Identificador del tenant propietario del documento. '
  'Valores válidos: creatuactivo_marketing | marca_personal | queswa_dashboard | ecommerce';


-- ============================================================================
-- BLOQUE 2: FUNCIÓN HELPER — set_app_tenant
-- Permite que el API route establezca el tenant activo para la sesión
-- antes de ejecutar queries con RLS.
-- ============================================================================

CREATE OR REPLACE FUNCTION set_app_tenant(p_tenant_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- TRUE = local a la transacción (se resetea al hacer commit/rollback)
  -- Seguro con PgBouncer en transaction mode
  PERFORM set_config('app.tenant_id', p_tenant_id, TRUE);
END;
$$;

GRANT EXECUTE ON FUNCTION set_app_tenant TO anon, authenticated, service_role;

COMMENT ON FUNCTION set_app_tenant IS
  'Establece el tenant activo para la transacción actual. '
  'Llamar antes de cualquier query sobre nexus_documents con RLS habilitado. '
  'Uso: SELECT set_app_tenant(''creatuactivo_marketing'')';


-- ============================================================================
-- BLOQUE 3: POLÍTICAS RLS EN nexus_documents (defensa en profundidad)
-- El service_role bypass RLS por defecto; estas políticas aplican al anon role.
-- ============================================================================

-- Habilitar RLS (idempotente — ya habilitado según fix-rls-seguridad-supabase.sql)
ALTER TABLE nexus_documents ENABLE ROW LEVEL SECURITY;

-- Eliminar política anon anterior (era USING (true) — sin filtro de tenant)
DROP POLICY IF EXISTS "Anon can read" ON nexus_documents;

-- Nueva política: anon solo lee documentos de su tenant
-- current_setting(..., TRUE) devuelve NULL en lugar de ERROR si no está seteado
-- Cuando es NULL, la expresión es FALSE → no devuelve filas (seguro por defecto)
DROP POLICY IF EXISTS "Tenant isolated read" ON nexus_documents;
CREATE POLICY "Tenant isolated read" ON nexus_documents
  FOR SELECT TO anon
  USING (
    tenant_id = current_setting('app.tenant_id', TRUE)
  );

-- Service role mantiene acceso total (sin cambios)
DROP POLICY IF EXISTS "Service role full access" ON nexus_documents;
CREATE POLICY "Service role full access" ON nexus_documents
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);


-- ============================================================================
-- BLOQUE 4: RPC search_nexus_documents ACTUALIZADA con filtro tenant
-- Agrega parámetro opcional p_tenant_id para filtrado explícito en la capa
-- de aplicación (complementa RLS — no depende de set_app_tenant).
-- ============================================================================

CREATE OR REPLACE FUNCTION search_nexus_documents(
  search_query   TEXT,
  match_count    INT     DEFAULT 5,
  p_tenant_id    TEXT    DEFAULT 'creatuactivo_marketing'
)
RETURNS TABLE (
  id          UUID,
  category    TEXT,
  title       TEXT,
  content     TEXT,
  metadata    JSONB,
  similarity  FLOAT,
  tenant_id   TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Búsqueda full-text con filtro de tenant
  -- La capa vectorial (Voyage AI) opera en la aplicación; esta RPC es el
  -- fallback de texto plano cuando no hay embedding disponible.
  RETURN QUERY
  SELECT
    nd.id,
    nd.category,
    nd.title,
    nd.content,
    nd.metadata,
    ts_rank(
      to_tsvector('spanish', COALESCE(nd.title, '') || ' ' || COALESCE(nd.content, '')),
      plainto_tsquery('spanish', search_query)
    )::FLOAT AS similarity,
    nd.tenant_id
  FROM nexus_documents nd
  WHERE
    nd.tenant_id = p_tenant_id
    AND (
      to_tsvector('spanish', COALESCE(nd.title, '') || ' ' || COALESCE(nd.content, ''))
      @@ plainto_tsquery('spanish', search_query)
    )
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

GRANT EXECUTE ON FUNCTION search_nexus_documents TO anon, authenticated, service_role;

COMMENT ON FUNCTION search_nexus_documents IS
  'Búsqueda full-text en nexus_documents filtrada por tenant. '
  'p_tenant_id default: creatuactivo_marketing. '
  'La búsqueda vectorial (Voyage AI cosine similarity) ocurre en la capa de aplicación '
  '(src/lib/vectorSearch.ts) y usa .eq(''tenant_id'', tenantId) explícito.';


-- ============================================================================
-- BLOQUE 5: VERIFICACIÓN (ejecutar para confirmar migración exitosa)
-- ============================================================================

-- Verificar distribución de tenant_id en nexus_documents
-- SELECT tenant_id, COUNT(*) as total
-- FROM nexus_documents
-- GROUP BY tenant_id
-- ORDER BY total DESC;

-- Verificar índices creados
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'nexus_documents'
-- ORDER BY indexname;

-- Verificar políticas RLS activas
-- SELECT policyname, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'nexus_documents';
