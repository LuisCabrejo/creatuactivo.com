-- =====================================================================
-- Retirar el camino de 1536 dimensiones
-- Fecha: 7 de agosto de 2026
--
-- QUÉ SE VA:
--   · match_documents() y match_documents_by_category() — comparaban contra la
--     columna `embedding` vector(1536), que guarda el MISMO vector Voyage de 512
--     rellenado con 1.024 ceros. Habrían funcionado solo si la consulta también
--     se rellenara; nadie lo hacía, así que su camino de código estuvo muerto
--     desde el primer día y se retiró de vectorSearch.ts el 7 ago 2026.
--   · La columna `embedding` — sin lectores. Verificado con grep en los dos
--     repositorios: solo la ESCRIBÍAN cuatro scripts de fragmentación, y esas
--     escrituras se eliminaron antes de esta migración.
--
-- QUÉ QUEDA: `embedding_512` (nativa, sin relleno) + match_fragments_512(),
-- que es lo que usa el motor desde la migración 20260807_match_fragments_512.
--
-- ORDEN OBLIGATORIO: esta migración corre DESPUÉS de que el código dejó de
-- escribir la columna. Al revés, el fragmentador falla al insertar.
--
-- REVERSIÓN: no la hay para los datos. Los vectores de 1536 son derivables —
-- son los de 512 con ceros al final— así que se pueden reconstruir, pero no
-- hace falta: nada los lee.
-- =====================================================================

DROP FUNCTION IF EXISTS match_documents(vector(1536), float, int);
DROP FUNCTION IF EXISTS match_documents(vector(1536), float, int, text);
DROP FUNCTION IF EXISTS match_documents(vector(1536), float, int, text, text);
DROP FUNCTION IF EXISTS match_documents_by_category(vector(1536), text[], float, int);
DROP FUNCTION IF EXISTS match_documents_by_category(vector(1536), text[], float, int, text);

ALTER TABLE nexus_documents DROP COLUMN IF EXISTS embedding;
