-- ====================================================================
-- SCRIPT DE VERIFICACIÓN DE LIMPIEZA DE DATOS
-- ====================================================================
-- Propósito: Confirmar que solo existen datos del usuario sistema@creatuactivo.com
-- Uso: Ejecutar en Supabase SQL Editor después de limpieza
-- Fecha: 2025-01-15
-- ====================================================================

DO $$
DECLARE
    sistema_user_id UUID;
    count_prospects INTEGER;
    count_nexus_prospects INTEGER;
    count_conversations INTEGER;
    count_queue INTEGER;
    count_magic_links INTEGER;
    count_subscriptions INTEGER;
    count_sub_history INTEGER;
    count_sessions INTEGER;
    count_pending INTEGER;
    count_users INTEGER;
    count_prospect_data INTEGER;
    r RECORD; -- Variable para los loops
BEGIN
    -- Obtener ID del usuario sistema
    SELECT id INTO sistema_user_id
    FROM private_users
    WHERE email = 'sistema@creatuactivo.com';

    IF sistema_user_id IS NULL THEN
        RAISE EXCEPTION '❌ ERROR: No existe usuario sistema@creatuactivo.com';
    END IF;

    RAISE NOTICE '🔍 VERIFICACIÓN DE LIMPIEZA DE BASE DE DATOS';
    RAISE NOTICE '═══════════════════════════════════════════════════════';
    RAISE NOTICE '📧 Usuario Sistema ID: %', sistema_user_id;
    RAISE NOTICE '';

    -- ================================================================
    -- 1. VERIFICAR PROSPECTOS
    -- ================================================================
    SELECT COUNT(*) INTO count_prospects FROM prospects;

    RAISE NOTICE '📊 1. PROSPECTS (Tracking)';
    RAISE NOTICE '   Total registros: %', count_prospects;

    IF count_prospects = 0 THEN
        RAISE NOTICE '   ✅ Tabla limpia';
    ELSE
        RAISE NOTICE '   ⚠️  Hay % registros (esperado: 0)', count_prospects;
        -- Mostrar detalles
        FOR r IN (SELECT fingerprint, created_at FROM prospects ORDER BY created_at DESC LIMIT 5)
        LOOP
            RAISE NOTICE '      - Fingerprint: % (creado: %)', r.fingerprint, r.created_at;
        END LOOP;
    END IF;
    RAISE NOTICE '';

    -- ================================================================
    -- 2. VERIFICAR PROSPECT_DATA
    -- ================================================================
    SELECT COUNT(*) INTO count_prospect_data FROM prospect_data;

    RAISE NOTICE '📊 2. PROSPECT_DATA (Datos capturados)';
    RAISE NOTICE '   Total registros: %', count_prospect_data;

    IF count_prospect_data = 0 THEN
        RAISE NOTICE '   ✅ Tabla limpia';
    ELSE
        RAISE NOTICE '   ⚠️  Hay % registros (esperado: 0)', count_prospect_data;
        -- Mostrar detalles
        FOR r IN (
            SELECT
                fingerprint_id,
                data->>'nombre' as nombre,
                data->>'email' as email,
                created_at
            FROM prospect_data
            ORDER BY created_at DESC
            LIMIT 5
        )
        LOOP
            RAISE NOTICE '      - Nombre: %, Email: % (creado: %)', r.nombre, r.email, r.created_at;
        END LOOP;
    END IF;
    RAISE NOTICE '';

    -- ================================================================
    -- 3. VERIFICAR NEXUS_PROSPECTS
    -- ================================================================
    SELECT COUNT(*) INTO count_nexus_prospects FROM nexus_prospects;

    RAISE NOTICE '📊 3. NEXUS_PROSPECTS';
    RAISE NOTICE '   Total registros: %', count_nexus_prospects;

    IF count_nexus_prospects = 0 THEN
        RAISE NOTICE '   ✅ Tabla limpia';
    ELSE
        RAISE NOTICE '   ⚠️  Hay % registros (esperado: 0)', count_nexus_prospects;
    END IF;
    RAISE NOTICE '';

    -- ================================================================
    -- 4. VERIFICAR NEXUS_CONVERSATIONS
    -- ================================================================
    SELECT COUNT(*) INTO count_conversations FROM nexus_conversations;

    RAISE NOTICE '📊 4. NEXUS_CONVERSATIONS';
    RAISE NOTICE '   Total registros: %', count_conversations;

    IF count_conversations = 0 THEN
        RAISE NOTICE '   ✅ Tabla limpia';
    ELSE
        RAISE NOTICE '   ⚠️  Hay % registros (esperado: 0)', count_conversations;
        -- Mostrar últimas conversaciones
        FOR r IN (SELECT message, created_at FROM nexus_conversations ORDER BY created_at DESC LIMIT 3)
        LOOP
            RAISE NOTICE '      - Mensaje: % (fecha: %)', LEFT(r.message, 50), r.created_at;
        END LOOP;
    END IF;
    RAISE NOTICE '';

    -- ================================================================
    -- 5. VERIFICAR NEXUS_QUEUE
    -- ================================================================
    SELECT COUNT(*) INTO count_queue FROM nexus_queue;

    RAISE NOTICE '📊 5. NEXUS_QUEUE';
    RAISE NOTICE '   Total registros: %', count_queue;

    IF count_queue = 0 THEN
        RAISE NOTICE '   ✅ Tabla limpia';
    ELSE
        RAISE NOTICE '   ⚠️  Hay % registros (esperado: 0)', count_queue;
        -- Mostrar estados
        FOR r IN (SELECT status, COUNT(*) as count FROM nexus_queue GROUP BY status)
        LOOP
            RAISE NOTICE '      - Estado %: % mensajes', r.status, r.count;
        END LOOP;
    END IF;
    RAISE NOTICE '';

    -- ================================================================
    -- 6. VERIFICAR PENDING_ACTIVATIONS
    -- ================================================================
    SELECT COUNT(*) INTO count_pending
    FROM pending_activations
    WHERE email != 'sistema@creatuactivo.com';

    RAISE NOTICE '📊 6. PENDING_ACTIVATIONS';
    RAISE NOTICE '   Total registros (sin sistema): %', count_pending;

    IF count_pending = 0 THEN
        RAISE NOTICE '   ✅ Tabla limpia (solo sistema si existe)';
    ELSE
        RAISE NOTICE '   ⚠️  Hay % registros (esperado: 0)', count_pending;
        -- Mostrar detalles
        FOR r IN (
            SELECT name, email, status, created_at
            FROM pending_activations
            WHERE email != 'sistema@creatuactivo.com'
            ORDER BY created_at DESC
            LIMIT 5
        )
        LOOP
            RAISE NOTICE '      - Nombre: %, Email: %, Status: % (creado: %)',
                r.name, r.email, r.status, r.created_at;
        END LOOP;
    END IF;
    RAISE NOTICE '';

    -- ================================================================
    -- 7. VERIFICAR PRIVATE_USERS
    -- ================================================================
    SELECT COUNT(*) INTO count_users
    FROM private_users
    WHERE email != 'sistema@creatuactivo.com';

    RAISE NOTICE '📊 7. PRIVATE_USERS';
    RAISE NOTICE '   Total usuarios (sin sistema): %', count_users;

    IF count_users = 0 THEN
        RAISE NOTICE '   ✅ Tabla limpia (solo sistema)';
    ELSE
        RAISE NOTICE '   ⚠️  Hay % usuarios (esperado: 0)', count_users;
        -- Mostrar detalles
        FOR r IN (
            SELECT name, email, role, created_at
            FROM private_users
            WHERE email != 'sistema@creatuactivo.com'
            ORDER BY created_at DESC
            LIMIT 5
        )
        LOOP
            RAISE NOTICE '      - Nombre: %, Email: %, Role: % (creado: %)',
                r.name, r.email, r.role, r.created_at;
        END LOOP;
    END IF;
    RAISE NOTICE '';

    -- ================================================================
    -- 8. VERIFICAR SUBSCRIPTIONS
    -- ================================================================
    SELECT COUNT(*) INTO count_subscriptions
    FROM subscriptions
    WHERE user_id != sistema_user_id;

    RAISE NOTICE '📊 8. SUBSCRIPTIONS';
    RAISE NOTICE '   Total suscripciones (sin sistema): %', count_subscriptions;

    IF count_subscriptions = 0 THEN
        RAISE NOTICE '   ✅ Tabla limpia';
    ELSE
        RAISE NOTICE '   ⚠️  Hay % suscripciones (esperado: 0)', count_subscriptions;
    END IF;
    RAISE NOTICE '';

    -- ================================================================
    -- 9. VERIFICAR SUBSCRIPTION_HISTORY
    -- ================================================================
    SELECT COUNT(*) INTO count_sub_history
    FROM subscription_history
    WHERE user_id != sistema_user_id;

    RAISE NOTICE '📊 9. SUBSCRIPTION_HISTORY';
    RAISE NOTICE '   Total registros (sin sistema): %', count_sub_history;

    IF count_sub_history = 0 THEN
        RAISE NOTICE '   ✅ Tabla limpia';
    ELSE
        RAISE NOTICE '   ⚠️  Hay % registros (esperado: 0)', count_sub_history;
    END IF;
    RAISE NOTICE '';

    -- ================================================================
    -- 10. VERIFICAR MAGIC_LINKS
    -- ================================================================
    SELECT COUNT(*) INTO count_magic_links
    FROM magic_links
    WHERE user_id != sistema_user_id;

    RAISE NOTICE '📊 10. MAGIC_LINKS';
    RAISE NOTICE '   Total magic links (sin sistema): %', count_magic_links;

    IF count_magic_links = 0 THEN
        RAISE NOTICE '   ✅ Tabla limpia';
    ELSE
        RAISE NOTICE '   ⚠️  Hay % magic links (esperado: 0)', count_magic_links;
    END IF;
    RAISE NOTICE '';

    -- ================================================================
    -- 11. VERIFICAR USER_SESSIONS
    -- ================================================================
    SELECT COUNT(*) INTO count_sessions
    FROM user_sessions
    WHERE user_id != sistema_user_id;

    RAISE NOTICE '📊 11. USER_SESSIONS';
    RAISE NOTICE '   Total sesiones (sin sistema): %', count_sessions;

    IF count_sessions = 0 THEN
        RAISE NOTICE '   ✅ Tabla limpia';
    ELSE
        RAISE NOTICE '   ⚠️  Hay % sesiones (esperado: 0)', count_sessions;
    END IF;
    RAISE NOTICE '';

    -- ================================================================
    -- RESUMEN FINAL
    -- ================================================================
    RAISE NOTICE '═══════════════════════════════════════════════════════';
    RAISE NOTICE '📋 RESUMEN DE VERIFICACIÓN';
    RAISE NOTICE '═══════════════════════════════════════════════════════';

    IF count_prospects = 0
       AND count_prospect_data = 0
       AND count_nexus_prospects = 0
       AND count_conversations = 0
       AND count_queue = 0
       AND count_pending = 0
       AND count_users = 0
       AND count_subscriptions = 0
       AND count_sub_history = 0
       AND count_magic_links = 0
       AND count_sessions = 0 THEN
        RAISE NOTICE '🎉 ✅ LIMPIEZA EXITOSA - Base de datos limpia';
        RAISE NOTICE '✅ Solo existe usuario: sistema@creatuactivo.com';
        RAISE NOTICE '✅ Listo para pruebas desde cero';
    ELSE
        RAISE NOTICE '⚠️  HAY DATOS RESIDUALES:';
        IF count_prospects > 0 THEN RAISE NOTICE '   - prospects: %', count_prospects; END IF;
        IF count_prospect_data > 0 THEN RAISE NOTICE '   - prospect_data: %', count_prospect_data; END IF;
        IF count_nexus_prospects > 0 THEN RAISE NOTICE '   - nexus_prospects: %', count_nexus_prospects; END IF;
        IF count_conversations > 0 THEN RAISE NOTICE '   - nexus_conversations: %', count_conversations; END IF;
        IF count_queue > 0 THEN RAISE NOTICE '   - nexus_queue: %', count_queue; END IF;
        IF count_pending > 0 THEN RAISE NOTICE '   - pending_activations: %', count_pending; END IF;
        IF count_users > 0 THEN RAISE NOTICE '   - private_users: %', count_users; END IF;
        IF count_subscriptions > 0 THEN RAISE NOTICE '   - subscriptions: %', count_subscriptions; END IF;
        IF count_sub_history > 0 THEN RAISE NOTICE '   - subscription_history: %', count_sub_history; END IF;
        IF count_magic_links > 0 THEN RAISE NOTICE '   - magic_links: %', count_magic_links; END IF;
        IF count_sessions > 0 THEN RAISE NOTICE '   - user_sessions: %', count_sessions; END IF;
    END IF;

    RAISE NOTICE '═══════════════════════════════════════════════════════';
END $$;
