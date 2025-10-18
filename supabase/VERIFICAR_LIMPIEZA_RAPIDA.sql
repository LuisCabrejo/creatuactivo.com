-- ====================================================================
-- VERIFICACIÓN RÁPIDA DE LIMPIEZA
-- ====================================================================
-- Versión simplificada - Solo muestra conteos
-- ====================================================================

-- 1. Conteo de todas las tablas relevantes (excluyendo sistema@creatuactivo.com)
SELECT
    '📊 RESUMEN DE DATOS EN BD' as titulo,
    '' as tabla,
    0 as registros
UNION ALL
SELECT
    '',
    'prospects',
    COUNT(*)::integer
FROM prospects
UNION ALL
SELECT
    '',
    'prospect_data',
    COUNT(*)::integer
FROM prospect_data
UNION ALL
SELECT
    '',
    'nexus_prospects',
    COUNT(*)::integer
FROM nexus_prospects
UNION ALL
SELECT
    '',
    'nexus_conversations',
    COUNT(*)::integer
FROM nexus_conversations
UNION ALL
SELECT
    '',
    'nexus_queue',
    COUNT(*)::integer
FROM nexus_queue
UNION ALL
SELECT
    '',
    'pending_activations (sin sistema)',
    COUNT(*)::integer
FROM pending_activations
WHERE email != 'sistema@creatuactivo.com'
UNION ALL
SELECT
    '',
    'private_users (sin sistema)',
    COUNT(*)::integer
FROM private_users
WHERE email != 'sistema@creatuactivo.com'
UNION ALL
SELECT
    '',
    'subscriptions (sin sistema)',
    COUNT(*)::integer
FROM subscriptions
WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')
UNION ALL
SELECT
    '',
    'subscription_history (sin sistema)',
    COUNT(*)::integer
FROM subscription_history
WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')
UNION ALL
SELECT
    '',
    'magic_links (sin sistema)',
    COUNT(*)::integer
FROM magic_links
WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')
UNION ALL
SELECT
    '',
    'user_sessions (sin sistema)',
    COUNT(*)::integer
FROM user_sessions
WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')
ORDER BY tabla;

-- ✅ Si todos los conteos son 0 (excepto el título), la limpieza fue exitosa
