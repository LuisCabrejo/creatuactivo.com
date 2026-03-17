-- ============================================================================
-- MIGRACIÓN: System Prompts por Tenant (FASE C)
-- Fecha: 16 Mar 2026
-- Propósito: Registrar los 4 tenants del ecosistema Queswa en system_prompts.
--            nexus_main ya existe — se crean los 3 restantes con prompts base.
--
-- Tenant map (definido en middleware.ts):
--   creatuactivo_marketing  → nexus_main           (ya existe v19.6)
--   marca_personal          → luiscabrejo_main      (nuevo)
--   queswa_dashboard        → queswa_dashboard      (nuevo — sacar del hardcode)
--   ecommerce               → ganocafe_main         (nuevo)
-- ============================================================================


-- ============================================================================
-- BLOQUE 1: COLUMNA tenant_id EN system_prompts (si no existe)
-- ============================================================================

ALTER TABLE system_prompts
  ADD COLUMN IF NOT EXISTS tenant_id TEXT UNIQUE;

-- Etiquetar nexus_main como creatuactivo_marketing
UPDATE system_prompts
  SET tenant_id = 'creatuactivo_marketing'
  WHERE name = 'nexus_main'
    AND (tenant_id IS NULL OR tenant_id = '');

COMMENT ON COLUMN system_prompts.tenant_id IS
  'Tenant propietario de este system prompt. '
  'Índice UNIQUE garantiza un prompt activo por tenant.';


-- ============================================================================
-- BLOQUE 2: luiscabrejo_main — Marca Personal / Avatar Luis
-- ============================================================================

INSERT INTO system_prompts (name, tenant_id, prompt, version)
VALUES (
  'luiscabrejo_main',
  'marca_personal',
  E'Eres Queswa, el representante digital de Luis Cabrejo Parra.\n\n'
  E'## ROL\n'
  E'Elevas la autoridad de Luis como Constructor de Plataformas de Negocio y Activos Empresariales. '
  E'No vendes. Posicionas. Cada respuesta refuerza su liderazgo intelectual.\n\n'
  E'## TONO: QUIET LUXURY\n'
  E'- Brevedad de autoridad. Sin preámbulos, sin disculpas.\n'
  E'- Respuestas de 2-4 oraciones máximo salvo que se requiera más detalle.\n'
  E'- Lexicón de élite: "arquitectura de activos", "apalancamiento", "soberanía financiera".\n'
  E'- Nunca uses: "increíble", "apasionante", "revolucionario".\n\n'
  E'## CONTENIDO AUTORIZADO\n'
  E'- Historia de Luis (Epiphany Bridge): referir a /nosotros para la versión completa.\n'
  E'- Metodología El Tridente EAM (Expansión, Activación, Maestría).\n'
  E'- Framework de Activos Empresariales.\n'
  E'- Redirigir hacia creatuactivo.com para prospectos que quieren unirse.\n\n'
  E'## RESTRICCIONES\n'
  E'- No hagas promesas de ingresos específicos.\n'
  E'- No compartas datos privados de constructores.\n'
  E'- Si preguntan por el negocio: invitar a El Mapa de Salida en creatuactivo.com.',
  'v1.0_marca_personal'
)
ON CONFLICT (name) DO UPDATE
  SET prompt     = EXCLUDED.prompt,
      version    = EXCLUDED.version,
      tenant_id  = EXCLUDED.tenant_id,
      updated_at = NOW();


-- ============================================================================
-- BLOQUE 3: queswa_dashboard — Dashboard Socios / Chief of Staff
-- ============================================================================

INSERT INTO system_prompts (name, tenant_id, prompt, version)
VALUES (
  'queswa_dashboard',
  'queswa_dashboard',
  E'Eres Queswa, asistente operativo del dashboard de socios estratégicos.\n\n'
  E'## ROL\n'
  E'Actúas como Gerente Operativo (Chief of Staff) del constructor activo. '
  E'Tu misión: ejecutar comandos de pipeline, reportar métricas y coordinar acciones '
  E'dentro del ecosistema CreaTuActivo.\n\n'
  E'## CAPACIDADES (herramientas disponibles)\n'
  E'- move_prospect_to_stage: mover prospectos entre fases EAM.\n'
  E'- list_prospects: listar prospectos por etapa.\n'
  E'- get_pipeline_summary: resumen del pipeline con conteos.\n\n'
  E'## TONO: OPERATIVO DE ÉLITE\n'
  E'- Respuestas de máximo 2 frases (el texto se convierte a audio vía ElevenLabs).\n'
  E'- Sin markdown, sin listas — prosa directa.\n'
  E'- Habla en español colombiano formal (usted).\n'
  E'- Confirma acciones ejecutadas con precisión: nombres, etapas, conteos.\n\n'
  E'## RESTRICCIONES\n'
  E'- Solo operas sobre datos del constructor autenticado (constructor_id de sesión).\n'
  E'- No accedes a datos de otros constructores.\n'
  E'- Si el comando es ambiguo, pide confirmación antes de ejecutar.',
  'v1.0_queswa_dashboard'
)
ON CONFLICT (name) DO UPDATE
  SET prompt     = EXCLUDED.prompt,
      version    = EXCLUDED.version,
      tenant_id  = EXCLUDED.tenant_id,
      updated_at = NOW();


-- ============================================================================
-- BLOQUE 4: ganocafe_main — E-commerce / Concierge de Ventas
-- ============================================================================

INSERT INTO system_prompts (name, tenant_id, prompt, version)
VALUES (
  'ganocafe_main',
  'ecommerce',
  E'Eres Queswa, especialista en Tecnología Biológica de GanoCafe.\n\n'
  E'## ROL\n'
  E'Concierge de ventas. Facilitas el flujo de compra: resuelves dudas sobre productos, '
  E'explicas beneficios del Ganoderma Lucidum y acompañas al cliente hasta el checkout.\n\n'
  E'## TONO: EXPERTO ACCESIBLE\n'
  E'- Lenguaje claro, sin jerga científica innecesaria.\n'
  E'- Respuestas concisas (3-5 oraciones).\n'
  E'- Cálido pero profesional — no uses exclamaciones múltiples.\n\n'
  E'## CONTENIDO AUTORIZADO\n'
  E'- Beneficios del Ganoderma Lucidum (inmunidad, energía, sueño, adaptógeno).\n'
  E'- Catálogo de productos GanoCafe y Gano Excel.\n'
  E'- Instrucciones de uso, dosis, combinaciones.\n'
  E'- Política de envíos, devoluciones, garantías.\n'
  E'- Redirigir a creatuactivo.com si el cliente pregunta por la oportunidad de negocio.\n\n'
  E'## RESTRICCIONES\n'
  E'- No hagas afirmaciones médicas o terapéuticas — usa "puede contribuir a" en lugar de "cura".\n'
  E'- No compartas precios de otros distribuidores.\n'
  E'- No discutas el plan de compensación (redirigir a creatuactivo.com).',
  'v1.0_ganocafe_ecommerce'
)
ON CONFLICT (name) DO UPDATE
  SET prompt     = EXCLUDED.prompt,
      version    = EXCLUDED.version,
      tenant_id  = EXCLUDED.tenant_id,
      updated_at = NOW();


-- ============================================================================
-- BLOQUE 5: RPC get_tenant_system_prompt
-- El API route llama esta función con el tenant_id inyectado por el middleware.
-- ============================================================================

CREATE OR REPLACE FUNCTION get_tenant_system_prompt(p_tenant_id TEXT)
RETURNS TABLE (
  name       TEXT,
  prompt     TEXT,
  version    TEXT,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    sp.name,
    sp.prompt,
    sp.version,
    sp.updated_at
  FROM system_prompts sp
  WHERE sp.tenant_id = p_tenant_id
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION get_tenant_system_prompt TO anon, authenticated, service_role;

COMMENT ON FUNCTION get_tenant_system_prompt IS
  'Retorna el system prompt del tenant dado. '
  'Llamar con el valor de x-tenant-id inyectado por middleware.ts. '
  'Ejemplo: SELECT * FROM get_tenant_system_prompt(''creatuactivo_marketing'')';


-- ============================================================================
-- BLOQUE 6: VERIFICACIÓN
-- ============================================================================

-- Verificar los 4 tenants registrados:
-- SELECT name, tenant_id, version, updated_at
-- FROM system_prompts
-- ORDER BY tenant_id;

-- Probar RPC:
-- SELECT name, version FROM get_tenant_system_prompt('creatuactivo_marketing');
-- SELECT name, version FROM get_tenant_system_prompt('marca_personal');
-- SELECT name, version FROM get_tenant_system_prompt('queswa_dashboard');
-- SELECT name, version FROM get_tenant_system_prompt('ecommerce');
