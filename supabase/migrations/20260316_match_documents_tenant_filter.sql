-- ============================================================================
-- MIGRACIÓN: match_documents con filtro tenant_id (Capa 4.1)
-- Fecha: 16 Mar 2026
-- Propósito: Agregar parámetro filter_tenant_id a match_documents para
--            aislamiento multi-tenant en búsquedas vectoriales RPC.
--
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================================


-- Drop versiones anteriores (firmas distintas)
DROP FUNCTION IF EXISTS match_documents(vector(1536), float, int);
DROP FUNCTION IF EXISTS match_documents(vector(1536), float, int, text);

CREATE OR REPLACE FUNCTION match_documents(
  query_embedding   vector(1536),
  match_threshold   float   DEFAULT 0.3,
  match_count       int     DEFAULT 5,
  filter_category   text    DEFAULT NULL,
  filter_tenant_id  text    DEFAULT 'creatuactivo_marketing'
)
RETURNS TABLE (
  id          uuid,
  category    text,
  title       text,
  content     text,
  metadata    jsonb,
  similarity  float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    nd.id,
    nd.category,
    nd.title,
    nd.content,
    nd.metadata,
    1 - (nd.embedding <=> query_embedding) AS similarity
  FROM nexus_documents nd
  WHERE nd.embedding IS NOT NULL
    AND nd.tenant_id = filter_tenant_id
    AND (filter_category IS NULL OR nd.category = filter_category)
    AND 1 - (nd.embedding <=> query_embedding) > match_threshold
  ORDER BY nd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

GRANT EXECUTE ON FUNCTION match_documents TO anon, authenticated, service_role;

COMMENT ON FUNCTION match_documents IS
  'Búsqueda vectorial con aislamiento multi-tenant. '
  'filter_tenant_id default: creatuactivo_marketing. '
  'Compatible con embedding vector(1536) — ver también embedding_512 para Voyage 512-dim.';


-- ============================================================================
-- También actualizar match_documents_by_category con tenant filter
-- ============================================================================

DROP FUNCTION IF EXISTS match_documents_by_category(vector(1536), text[], float, int);

CREATE OR REPLACE FUNCTION match_documents_by_category(
  query_embedding   vector(1536),
  categories        text[],
  match_threshold   float  DEFAULT 0.3,
  match_count       int    DEFAULT 5,
  filter_tenant_id  text   DEFAULT 'creatuactivo_marketing'
)
RETURNS TABLE (
  id          uuid,
  category    text,
  title       text,
  content     text,
  metadata    jsonb,
  similarity  float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    nd.id,
    nd.category,
    nd.title,
    nd.content,
    nd.metadata,
    1 - (nd.embedding <=> query_embedding) AS similarity
  FROM nexus_documents nd
  WHERE nd.embedding IS NOT NULL
    AND nd.tenant_id = filter_tenant_id
    AND nd.category = ANY(categories)
    AND 1 - (nd.embedding <=> query_embedding) > match_threshold
  ORDER BY nd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

GRANT EXECUTE ON FUNCTION match_documents_by_category TO anon, authenticated, service_role;
