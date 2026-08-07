-- =====================================================================
-- Búsqueda vectorial en la base, sobre embedding_512
-- Fecha: 7 de agosto de 2026
--
-- QUÉ PROBLEMA RESUELVE (medido, no supuesto):
--   El motor traía TODOS los fragmentos de TODOS los tenants en cada arranque
--   en frío y comparaba en memoria — 339 fragmentos, 2,83 MB, 1,58 segundos
--   antes de que el modelo empezara a pensar. Tres cuartas partes de ese peso
--   son los vectores, que se usan para calcular una similitud y se descartan.
--
--   Además, al no filtrar por tenant, el buscador cargaba 156 categorías
--   DUPLICADAS (la misma respuesta en creatuactivo_marketing y en whatsapp) y
--   las hacía competir entre sí por los tres cupos del resultado.
--
--   Con esta función solo cruzan la red los N fragmentos ganadores.
--
-- POR QUÉ NO SE REVIVIÓ match_documents:
--   Esa función compara contra la columna `embedding` vector(1536), que guarda
--   el MISMO vector de 512 rellenado con 1.024 ceros. Funcionaría solo si la
--   consulta también se rellenara — nadie lo hacía, así que su camino de código
--   estuvo muerto desde el primer día y se retiró el 7 ago 2026. Esta función
--   trabaja sobre la columna nativa, sin relleno.
--
-- APLICAR EN: Supabase → SQL Editor. Es aditiva: no toca nada existente, así
-- que se puede correr con el motor en producción sin riesgo.
-- =====================================================================

CREATE OR REPLACE FUNCTION match_fragments_512(
  query_embedding  vector(512),
  filter_tenant_id text,
  category_prefix  text  DEFAULT NULL,
  match_threshold  float DEFAULT 0.3,
  match_count      int   DEFAULT 5
)
RETURNS TABLE (
  category   text,
  title      text,
  content    text,
  similarity float,
  metadata   jsonb
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    d.category,
    d.title,
    d.content,
    1 - (d.embedding_512 <=> query_embedding) AS similarity,
    d.metadata
  FROM nexus_documents d
  WHERE d.embedding_512 IS NOT NULL
    AND d.tenant_id = filter_tenant_id
    -- Solo fragmentos: los documentos padre (arsenal_inicial completo, 84 K
    -- caracteres) también tienen embedding y arruinarían cualquier resultado.
    AND (d.metadata->>'is_fragment')::boolean IS TRUE
    AND (category_prefix IS NULL OR d.category LIKE category_prefix || '%')
    AND 1 - (d.embedding_512 <=> query_embedding) >= match_threshold
  ORDER BY d.embedding_512 <=> query_embedding
  LIMIT match_count;
$$;

GRANT EXECUTE ON FUNCTION match_fragments_512 TO anon, authenticated, service_role;

COMMENT ON FUNCTION match_fragments_512 IS
  'Búsqueda semántica sobre embedding_512 (Voyage voyage-3-lite, 512 dims nativas). Filtra por tenant y por prefijo de categoría, y devuelve solo los N ganadores. Reemplaza la búsqueda en memoria del motor. NO usar match_documents: compara contra la columna embedding de 1536 con relleno de ceros.';

-- Índice para cuando el corpus crezca. Con ~350 filas el escaneo secuencial ya
-- es instantáneo, así que hoy no cambia nada — pero crearlo después, con
-- tráfico encima, cuesta un bloqueo que ahora no cuesta.
CREATE INDEX IF NOT EXISTS nexus_documents_embedding_512_cos_idx
  ON nexus_documents
  USING hnsw (embedding_512 vector_cosine_ops);
