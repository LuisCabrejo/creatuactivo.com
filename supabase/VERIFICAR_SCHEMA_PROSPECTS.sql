-- ====================================================================
-- VERIFICAR SCHEMA DE LA TABLA PROSPECTS
-- ====================================================================

-- Ver estructura completa de la tabla prospects
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'prospects'
ORDER BY ordinal_position;

-- Ver ejemplo de datos (si existen)
SELECT * FROM prospects LIMIT 5;

-- Contar registros
SELECT COUNT(*) as total_prospects FROM prospects;
