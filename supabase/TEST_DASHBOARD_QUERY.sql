-- ====================================================================
-- PROBAR QUERY QUE USA EL DASHBOARD
-- ====================================================================

-- Esta es la MISMA query que usa dashboard-stats/route.ts línea 25-29
SELECT COUNT(*) as total_constructores
FROM private_users
WHERE status = 'active'
  AND role = 'constructor';

-- Ver los constructores activos (detalles)
SELECT
    id,
    name,
    email,
    constructor_id,
    status,
    role,
    plan_type,
    created_at
FROM private_users
WHERE status = 'active'
  AND role = 'constructor'
ORDER BY created_at DESC;
