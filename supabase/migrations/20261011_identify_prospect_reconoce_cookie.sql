-- ═══════════════════════════════════════════════════════════════════════════
-- identify_prospect (la de 4 argumentos, la que llama tracking.js):
-- el navegador que ya escribió por WhatsApp vuelve con su nombre.
-- 11 oct 2026 · Director: «si la persona vuelve así sea al año, lo saludemos
-- por el nombre». Caso Edilberto Afanador: entró el 28 sep por
-- /luis-cabrejo/estrategia, volvió el 10 oct a la presentación y el aviso dijo
-- «Un visitante».
--
-- Cómo: en el salto a WhatsApp el middleware deja la cookie de un año
-- (`nexus_prospect_id`, la misma que tracking.js manda como p_cookie) y el
-- webhook la guarda en la ficha de WhatsApp como `device_info.web_cookie`. Aquí,
-- cuando ese navegador vuelve, se busca esa ficha y la web recibe nombre, país y
-- `whatsapp_fingerprint`.
--
-- Tres cuidados:
--   1. La llave es la COOKIE, no la huella: la huella del dispositivo se repite
--      entre dos teléfonos iguales; la cookie es una por navegador. Por eso solo
--      se ata —y solo se devuelve el nombre— cuando la ficha web la creó ESTE
--      navegador (cookie_id igual) o no tiene cookie.
--   2. El orden de las escrituras sigue al Dashboard: una ficha NUEVA se crea ya
--      con el nombre (el aviso de llegada lo nombra) y el atado va después; una
--      ficha que ya existía recibe nombre y atado juntos, que el Dashboard no
--      avisa (no sale un «🙋 Se identificó» que nadie hizo).
--   3. El nombre que no es nombre («Constructor», sin letras) no se copia.
--
-- Devuelve además `nombre` (el primero) para que tracking.js lo deje como
-- `nexus_prospect_name` y el chat de la web salude por el nombre.
-- Reversa: 20261011_identify_prospect_ROLLBACK.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- La búsqueda corre en cada visita: índice parcial sobre las pocas fichas de
-- WhatsApp que tienen cookie.
CREATE INDEX IF NOT EXISTS prospects_web_cookie_idx
    ON prospects ((device_info->>'web_cookie'))
    WHERE device_info ? 'web_cookie';

CREATE OR REPLACE FUNCTION public.identify_prospect(p_fingerprint text, p_cookie text, p_url text, p_device jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_prospect_id UUID;
    v_constructor_id UUID;
    v_constructor_ref TEXT;
    v_is_new BOOLEAN := FALSE;
    v_visits INTEGER := 1;
    v_cookie_ficha TEXT;
    v_di JSONB;
    v_wa_fp TEXT;
    v_wa_di JSONB;
    v_nombre_wa TEXT;
    v_datos JSONB := '{}'::jsonb;
    v_es_suya BOOLEAN := FALSE;
    v_nombre TEXT;
BEGIN
    v_constructor_ref := (regexp_match(p_url, '[?&]ref=([a-z0-9-]+)'))[1];

    IF v_constructor_ref IS NULL THEN
        v_constructor_ref := (regexp_match(p_url, '/(?:fundadores|mapa-de-salida|reto-12-niveles|presentacion-empresarial|productos)/([a-z0-9-]+)'))[1];
    END IF;

    IF v_constructor_ref IS NOT NULL THEN
        SELECT id INTO v_constructor_id
        FROM private_users
        WHERE constructor_id = v_constructor_ref
        LIMIT 1;
    END IF;

    -- 🔗 ¿Este navegador ya escribió por WhatsApp desde un enlace de Queswa?
    IF p_cookie ~ '^ck_[a-z0-9]{6,12}$' THEN
        SELECT fingerprint_id, device_info INTO v_wa_fp, v_wa_di
        FROM prospects
        WHERE device_info ? 'web_cookie' AND device_info->>'web_cookie' = p_cookie AND fingerprint_id LIKE 'wa\_%'
        ORDER BY updated_at DESC
        LIMIT 1;
    END IF;

    IF v_wa_fp IS NOT NULL THEN
        v_nombre_wa := NULLIF(trim(v_wa_di->>'name'), '');
        IF v_nombre_wa IS NOT NULL AND v_nombre_wa ~ '[[:alpha:]]' AND lower(v_nombre_wa) <> 'constructor' THEN
            v_datos := v_datos || jsonb_build_object('name', v_nombre_wa);
        END IF;
        IF NULLIF(v_wa_di->>'pais', '') IS NOT NULL THEN
            v_datos := v_datos || jsonb_build_object('pais', v_wa_di->>'pais', 'pais_codigo', v_wa_di->>'pais_codigo');
        END IF;
    END IF;

    SELECT id, visits, cookie_id, device_info INTO v_prospect_id, v_visits, v_cookie_ficha, v_di
    FROM prospects
    WHERE fingerprint_id = p_fingerprint
    LIMIT 1;

    IF v_prospect_id IS NULL THEN
        -- Ficha nueva: nace con el nombre y el país (el aviso de llegada lo nombra).
        INSERT INTO prospects (
            fingerprint_id, cookie_id, first_url, last_url,
            device_info, visits, is_returning, constructor_id, stage
        )
        VALUES (
            p_fingerprint, p_cookie, p_url, p_url,
            COALESCE(p_device, '{}'::jsonb) || v_datos, 1, FALSE, v_constructor_id, 'expansion'
        )
        RETURNING id INTO v_prospect_id;
        v_is_new := TRUE;
        v_es_suya := TRUE;
        v_di := COALESCE(p_device, '{}'::jsonb) || v_datos;

        IF v_wa_fp IS NOT NULL THEN
            UPDATE prospects SET device_info = device_info || jsonb_build_object('whatsapp_fingerprint', v_wa_fp)
            WHERE id = v_prospect_id;
            UPDATE prospects SET device_info = COALESCE(device_info, '{}'::jsonb) || jsonb_build_object('web_fingerprint', p_fingerprint)
            WHERE fingerprint_id = v_wa_fp;
        END IF;
    ELSE
        v_es_suya := v_cookie_ficha IS NULL OR v_cookie_ficha = p_cookie;

        -- Ficha que ya existía: nombre, país y atado en UNA escritura, solo si es
        -- de este navegador y todavía no estaba atada a esa conversación.
        IF v_wa_fp IS NOT NULL AND v_es_suya AND (v_di->>'whatsapp_fingerprint') IS DISTINCT FROM v_wa_fp THEN
            v_datos := jsonb_build_object('whatsapp_fingerprint', v_wa_fp)
                || CASE WHEN NULLIF(trim(v_di->>'name'), '') IS NULL AND v_datos ? 'name' THEN jsonb_build_object('name', v_datos->>'name') ELSE '{}'::jsonb END
                || CASE WHEN NULLIF(v_di->>'pais', '') IS NULL AND v_datos ? 'pais' THEN jsonb_build_object('pais', v_datos->>'pais', 'pais_codigo', v_datos->>'pais_codigo') ELSE '{}'::jsonb END;
            UPDATE prospects
            SET device_info = COALESCE(device_info, '{}'::jsonb) || v_datos,
                cookie_id = COALESCE(cookie_id, p_cookie)
            WHERE id = v_prospect_id;
            UPDATE prospects SET device_info = COALESCE(device_info, '{}'::jsonb) || jsonb_build_object('web_fingerprint', p_fingerprint)
            WHERE fingerprint_id = v_wa_fp;
            v_di := COALESCE(v_di, '{}'::jsonb) || v_datos;
        END IF;

        UPDATE prospects
        SET visits = visits + 1, last_url = p_url, is_returning = TRUE,
            updated_at = NOW(), constructor_id = COALESCE(constructor_id, v_constructor_id)
        WHERE id = v_prospect_id;
        v_visits := v_visits + 1;
    END IF;

    -- El nombre solo vuelve al navegador dueño de la ficha.
    IF v_es_suya THEN
        v_nombre := NULLIF(split_part(trim(COALESCE(v_di->>'name', '')), ' ', 1), '');
        IF v_nombre IS NOT NULL AND (v_nombre !~ '[[:alpha:]]' OR lower(v_nombre) = 'constructor') THEN
            v_nombre := NULL;
        END IF;
    END IF;

    RETURN jsonb_build_array(
        jsonb_build_object(
            'prospect_id', v_prospect_id,
            'constructor_id', v_constructor_id,
            'constructor_ref', v_constructor_ref,
            'is_returning', NOT v_is_new,
            'visits', v_visits,
            'nombre', v_nombre
        )
    );
END;
$function$;
