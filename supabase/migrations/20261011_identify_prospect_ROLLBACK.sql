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

    SELECT id, visits INTO v_prospect_id, v_visits
    FROM prospects
    WHERE fingerprint_id = p_fingerprint
    LIMIT 1;

    IF v_prospect_id IS NULL THEN
        INSERT INTO prospects (
            fingerprint_id, cookie_id, first_url, last_url,
            device_info, visits, is_returning, constructor_id, stage
        )
        VALUES (
            p_fingerprint, p_cookie, p_url, p_url,
            p_device, 1, FALSE, v_constructor_id, 'expansion'
        )
        RETURNING id INTO v_prospect_id;
        v_is_new := TRUE;
    ELSE
        UPDATE prospects
        SET visits = visits + 1, last_url = p_url, is_returning = TRUE,
            updated_at = NOW(), constructor_id = COALESCE(constructor_id, v_constructor_id)
        WHERE id = v_prospect_id;
        v_visits := v_visits + 1;
    END IF;

    RETURN jsonb_build_array(
        jsonb_build_object(
            'prospect_id', v_prospect_id,
            'constructor_id', v_constructor_id,
            'constructor_ref', v_constructor_ref,
            'is_returning', NOT v_is_new,
            'visits', v_visits
        )
    );
END;
$function$
;
