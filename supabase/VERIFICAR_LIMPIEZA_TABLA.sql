-- ====================================================================
-- VERIFICACIÓN DE LIMPIEZA - VERSIÓN CON TABLA DE RESULTADOS
-- ====================================================================
-- Esta versión devuelve los resultados en una tabla visible
-- ====================================================================

WITH sistema_user AS (
    SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com'
),
verificacion AS (
    SELECT
        'prospects' as tabla,
        COUNT(*)::integer as registros,
        CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay datos' END as estado
    FROM prospects

    UNION ALL

    SELECT
        'prospect_data',
        COUNT(*)::integer,
        CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay datos' END
    FROM prospect_data

    UNION ALL

    SELECT
        'nexus_prospects',
        COUNT(*)::integer,
        CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay datos' END
    FROM nexus_prospects

    UNION ALL

    SELECT
        'nexus_conversations',
        COUNT(*)::integer,
        CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay datos' END
    FROM nexus_conversations

    UNION ALL

    SELECT
        'nexus_queue',
        COUNT(*)::integer,
        CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay datos' END
    FROM nexus_queue

    UNION ALL

    SELECT
        'pending_activations (sin sistema)',
        COUNT(*)::integer,
        CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay datos' END
    FROM pending_activations
    WHERE email != 'sistema@creatuactivo.com'

    UNION ALL

    SELECT
        'private_users (sin sistema)',
        COUNT(*)::integer,
        CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay datos' END
    FROM private_users
    WHERE email != 'sistema@creatuactivo.com'

    UNION ALL

    SELECT
        'subscriptions (sin sistema)',
        COUNT(*)::integer,
        CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay datos' END
    FROM subscriptions
    WHERE user_id != (SELECT id FROM sistema_user)

    UNION ALL

    SELECT
        'subscription_history (sin sistema)',
        COUNT(*)::integer,
        CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay datos' END
    FROM subscription_history
    WHERE user_id != (SELECT id FROM sistema_user)

    UNION ALL

    SELECT
        'magic_links (sin sistema)',
        COUNT(*)::integer,
        CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay datos' END
    FROM magic_links
    WHERE user_id != (SELECT id FROM sistema_user)

    UNION ALL

    SELECT
        'user_sessions (sin sistema)',
        COUNT(*)::integer,
        CASE WHEN COUNT(*) = 0 THEN '✅ Limpia' ELSE '⚠️ Hay datos' END
    FROM user_sessions
    WHERE user_id != (SELECT id FROM sistema_user)
),
-- Calcular totales
totales AS (
    SELECT
        SUM(registros) as total_registros,
        COUNT(*) as total_tablas,
        COUNT(*) FILTER (WHERE registros = 0) as tablas_limpias
    FROM verificacion
)
-- Mostrar resultados detallados
SELECT
    tabla as "📋 Tabla",
    registros as "🔢 Registros",
    estado as "✅ Estado"
FROM verificacion
ORDER BY tabla;

-- EJECUTA ESTA SEGUNDA QUERY PARA VER EL RESUMEN:
-- SELECT
--     CASE
--         WHEN total_registros = 0 THEN '🎉 ✅ LIMPIEZA EXITOSA'
--         ELSE '⚠️ HAY DATOS RESIDUALES'
--     END as "🎯 Resultado Final",
--     total_registros as "Total de Registros",
--     tablas_limpias || '/' || total_tablas as "Tablas Limpias"
-- FROM (
--     SELECT SUM(registros) as total_registros, COUNT(*) as total_tablas,
--            COUNT(*) FILTER (WHERE registros = 0) as tablas_limpias
--     FROM (
--         SELECT COUNT(*)::integer as registros FROM prospects
--         UNION ALL SELECT COUNT(*)::integer FROM prospect_data
--         UNION ALL SELECT COUNT(*)::integer FROM nexus_prospects
--         UNION ALL SELECT COUNT(*)::integer FROM nexus_conversations
--         UNION ALL SELECT COUNT(*)::integer FROM nexus_queue
--         UNION ALL SELECT COUNT(*)::integer FROM pending_activations WHERE email != 'sistema@creatuactivo.com'
--         UNION ALL SELECT COUNT(*)::integer FROM private_users WHERE email != 'sistema@creatuactivo.com'
--         UNION ALL SELECT COUNT(*)::integer FROM subscriptions WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')
--         UNION ALL SELECT COUNT(*)::integer FROM subscription_history WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')
--         UNION ALL SELECT COUNT(*)::integer FROM magic_links WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')
--         UNION ALL SELECT COUNT(*)::integer FROM user_sessions WHERE user_id != (SELECT id FROM private_users WHERE email = 'sistema@creatuactivo.com')
--     ) sub
-- ) totales;
