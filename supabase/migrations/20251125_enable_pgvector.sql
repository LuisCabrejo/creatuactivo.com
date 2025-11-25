-- ============================================================================
-- MIGRACIÓN: Habilitar pgvector y crear función de búsqueda semántica
-- Fecha: 25 Nov 2025
-- Descripción: Implementa sistema de vectores para NEXUS
-- ============================================================================

-- 1. Habilitar extensión pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Verificar que la columna embedding existe (ya debería existir)
-- Si no existe, crearla:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nexus_documents' AND column_name = 'embedding'
  ) THEN
    ALTER TABLE nexus_documents ADD COLUMN embedding vector(1536);
  END IF;
END $$;

-- 3. Crear índice para búsqueda eficiente de vectores
-- Usamos ivfflat para mejor rendimiento con datasets pequeños-medianos
DROP INDEX IF EXISTS nexus_documents_embedding_idx;
CREATE INDEX nexus_documents_embedding_idx ON nexus_documents
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 10);

-- 4. Crear función de búsqueda semántica
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  category text,
  title text,
  content text,
  metadata jsonb,
  similarity float
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
    AND 1 - (nd.embedding <=> query_embedding) > match_threshold
  ORDER BY nd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 5. Crear función alternativa que busca por categorías específicas
CREATE OR REPLACE FUNCTION match_documents_by_category(
  query_embedding vector(1536),
  categories text[],
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  category text,
  title text,
  content text,
  metadata jsonb,
  similarity float
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
    AND nd.category = ANY(categories)
    AND 1 - (nd.embedding <=> query_embedding) > match_threshold
  ORDER BY nd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 6. Comentarios para documentación
COMMENT ON FUNCTION match_documents IS 'Búsqueda semántica de documentos NEXUS usando similitud coseno. Retorna documentos ordenados por relevancia.';
COMMENT ON FUNCTION match_documents_by_category IS 'Búsqueda semántica filtrada por categorías específicas (arsenal_inicial, arsenal_avanzado, catalogo_productos).';

-- 7. Permisos
GRANT EXECUTE ON FUNCTION match_documents TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION match_documents_by_category TO anon, authenticated, service_role;
