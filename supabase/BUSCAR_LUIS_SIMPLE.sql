-- ====================================================================
-- BÚSQUEDA SIMPLE: Luis Cabrejo Parra
-- ====================================================================

-- 1. Ver TODO en pending_activations
SELECT * FROM pending_activations
WHERE email = 'luiscabrejo7@gmail.com';

-- 2. Ver TODO en private_users
SELECT * FROM private_users
WHERE email = 'luiscabrejo7@gmail.com';

-- 3. Contar registros totales
SELECT
    'pending_activations' as tabla,
    COUNT(*) as total
FROM pending_activations
WHERE email != 'sistema@creatuactivo.com'

UNION ALL

SELECT
    'private_users' as tabla,
    COUNT(*) as total
FROM private_users
WHERE email != 'sistema@creatuactivo.com';
