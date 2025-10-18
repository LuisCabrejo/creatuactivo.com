-- ====================================================================
-- VERIFICACIÓN SIMPLE DE LIMPIEZA - UNA SOLA TABLA
-- ====================================================================
-- Ejecuta esto y verás todos los resultados en una sola tabla
-- ====================================================================

SELECT
    '📊 VERIFICACIÓN DE LIMPIEZA' as "🎯 Categoría",
    '' as "📋 Tabla",
    NULL::integer as "🔢 Registros",
    '' as "Estado"

UNION ALL

-- Header separador
SELECT '═══════════════════════════════', '', NULL, ''

UNION ALL

-- 1. prospects
SELECT
    '',
    'prospects',
    COUNT(*)::integer,
    CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay ' || COUNT(*) || ' registros' END
FROM prospects

UNION ALL

-- 2. prospect_data
SELECT
    '',
    'prospect_data',
    COUNT(*)::integer,
    CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay ' || COUNT(*) || ' registros' END
FROM prospect_data

UNION ALL

-- 3. nexus_prospects
SELECT
    '',
    'nexus_prospects',
    COUNT(*)::integer,
    CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay ' || COUNT(*) || ' registros' END
FROM nexus_prospects

UNION ALL

-- 4. nexus_conversations
SELECT
    '',
    'nexus_conversations',
    COUNT(*)::integer,
    CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay ' || COUNT(*) || ' registros' END
FROM nexus_conversations

UNION ALL

-- 5. nexus_queue
SELECT
    '',
    'nexus_queue',
    COUNT(*)::integer,
    CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay ' || COUNT(*) || ' registros' END
FROM nexus_queue

UNION ALL

-- 6. pending_activations (sin sistema)
SELECT
    '',
    'pending_activations (sin sistema)',
    COUNT(*)::integer,
    CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay ' || COUNT(*) || ' registros' END
FROM pending_activations
WHERE email != 'sistema@creatuactivo.com'

UNION ALL

-- 7. private_users (sin sistema)
SELECT
    '',
    'private_users (sin sistema)',
    COUNT(*)::integer,
    CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay ' || COUNT(*) || ' registros' END
FROM private_users
WHERE email != 'sistema@creatuactivo.com'

UNION ALL

-- 8. subscriptions (sin sistema)
SELECT
    '',
    'subscriptions (sin sistema)',
    COUNT(*)::integer,
    CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay ' || COUNT(*) || ' registros' END
FROM subscriptions
WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')

UNION ALL

-- 9. subscription_history (sin sistema)
SELECT
    '',
    'subscription_history (sin sistema)',
    COUNT(*)::integer,
    CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay ' || COUNT(*) || ' registros' END
FROM subscription_history
WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')

UNION ALL

-- 10. magic_links (sin sistema)
SELECT
    '',
    'magic_links (sin sistema)',
    COUNT(*)::integer,
    CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay ' || COUNT(*) || ' registros' END
FROM magic_links
WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')

UNION ALL

-- 11. user_sessions (sin sistema)
SELECT
    '',
    'user_sessions (sin sistema)',
    COUNT(*)::integer,
    CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay ' || COUNT(*) || ' registros' END
FROM user_sessions
WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')

UNION ALL

-- Footer separador
SELECT '═══════════════════════════════', '', NULL, ''

UNION ALL

-- RESUMEN FINAL
SELECT
    '🎯 RESULTADO FINAL',
    '',
    (
        (SELECT COUNT(*) FROM prospects) +
        (SELECT COUNT(*) FROM prospect_data) +
        (SELECT COUNT(*) FROM nexus_prospects) +
        (SELECT COUNT(*) FROM nexus_conversations) +
        (SELECT COUNT(*) FROM nexus_queue) +
        (SELECT COUNT(*) FROM pending_activations WHERE email != 'sistema@creatuactivo.com') +
        (SELECT COUNT(*) FROM private_users WHERE email != 'sistema@creatuactivo.com') +
        (SELECT COUNT(*) FROM subscriptions WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')) +
        (SELECT COUNT(*) FROM subscription_history WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')) +
        (SELECT COUNT(*) FROM magic_links WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')) +
        (SELECT COUNT(*) FROM user_sessions WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com'))
    )::integer,
    CASE
        WHEN (
            (SELECT COUNT(*) FROM prospects) +
            (SELECT COUNT(*) FROM prospect_data) +
            (SELECT COUNT(*) FROM nexus_prospects) +
            (SELECT COUNT(*) FROM nexus_conversations) +
            (SELECT COUNT(*) FROM nexus_queue) +
            (SELECT COUNT(*) FROM pending_activations WHERE email != 'sistema@creatuactivo.com') +
            (SELECT COUNT(*) FROM private_users WHERE email != 'sistema@creatuactivo.com') +
            (SELECT COUNT(*) FROM subscriptions WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')) +
            (SELECT COUNT(*) FROM subscription_history WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')) +
            (SELECT COUNT(*) FROM magic_links WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')) +
            (SELECT COUNT(*) FROM user_sessions WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com'))
        ) = 0
        THEN '🎉 ✅ LIMPIEZA EXITOSA - Listo para pruebas'
        ELSE '⚠️ HAY DATOS RESIDUALES - Revisar arriba'
    END;
