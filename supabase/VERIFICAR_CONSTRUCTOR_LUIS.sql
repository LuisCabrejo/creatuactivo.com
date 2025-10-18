-- ====================================================================
-- VERIFICAR CONSTRUCTOR: Luis Cabrejo Parra (luiscabrejo7@gmail.com)
-- ====================================================================

-- 1. Verificar en pending_activations (solicitud pendiente)
SELECT
    id,
    name,
    email,
    whatsapp,
    gano_excel_id,
    plan_type,
    status,
    created_at,
    updated_at
FROM pending_activations
WHERE email = 'luiscabrejo7@gmail.com'
ORDER BY created_at DESC;

-- 2. Verificar en private_users (usuario activado)
SELECT
    id,
    name,
    email,
    constructor_id,
    role,
    status,
    plan_type,
    created_at
FROM private_users
WHERE email = 'luiscabrejo7@gmail.com'
ORDER BY created_at DESC;

-- 3. Contar total de registros (sin sistema)
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

-- 4. Ver magic links generados
SELECT
    id,
    user_id,
    email,
    token,
    expires_at,
    used_at,
    created_at
FROM magic_links
WHERE email = 'luiscabrejo7@gmail.com'
ORDER BY created_at DESC
LIMIT 3;

-- 5. Ver sesiones activas
SELECT
    id,
    user_id,
    session_token,
    expires_at,
    created_at
FROM user_sessions
WHERE user_id IN (
    SELECT id FROM private_users WHERE email = 'luiscabrejo7@gmail.com'
)
ORDER BY created_at DESC
LIMIT 3;
