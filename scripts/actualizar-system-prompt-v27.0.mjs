/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt a v27.0 (Recursos Imperativos + Bloqueo KYC)
 * Lee el contenido desde knowledge_base/system-prompt-nexus-main-v27_0.md
 *
 * Cambios respecto a v26.9 (recursos_legibilidad_cognitiva):
 *
 * 1. RECURSOS DE LEGIBILIDAD COGNITIVA elevada al INICIO del prompt (primacy effect).
 *    Antes en línea ~400, ahora justo después de IDENTIDAD CORE y antes de TONO Y VOZ.
 *    Razón: empíricamente v26.9 no logró que el modelo aplicara consistentemente las
 *    Reglas E/F/G/H — competían contra reglas más viejas y reforzadas en líneas
 *    tempranas (Pirámide McKinsey, frialdad matemática, máximo 3 párrafos).
 *
 * 2. REGLA IMPERATIVA — 2 DE 4 RECURSOS OBLIGATORIOS.
 *    Reemplaza la regla subjetiva v26.9 ("si aporta legibilidad") con un mínimo
 *    cuantificable: toda respuesta de 100+ palabras DEBE aplicar al menos 2 de
 *    negritas / cursiva / separador `---` / lista.
 *
 * 3. BLOQUEO ABSOLUTO — KYC / DOCUMENTACIÓN INVENTADA.
 *    Nueva sección anti-alucinación crítica. Caso real detectado QA 19 May 2026:
 *    cuando FSM no capturaba paquete del usuario ("nivel 3" no estaba en packageMap),
 *    el modelo improvisaba un flujo bancario tóxico pidiendo cédula, comprobantes
 *    de ingresos (nóminas), referencias formales (LinkedIn), e inventaba un concepto
 *    "Reporte de Auditoría Técnica" inexistente. v27.0 cierra esa puerta con bloqueo
 *    explícito + texto canónico de respuesta si el prospecto pregunta por requisitos.
 *
 * Cambios paralelos en src/app/api/nexus/route.ts (commit independiente):
 * - Fix D: triggerInicio ampliado con verbos coloquiales (hagámoslo, dale, etc.)
 * - Fix E: packageMap ampliado con niveles numéricos (nivel 1/2/3, primero/segundo/tercero)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-nexus-main-v27_0.md'),
  'utf-8'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function actualizarSystemPrompt() {
  console.log('📡 Conectando a Supabase...');
  console.log(`📄 Prompt cargado: ${promptContent.length} caracteres`);
  console.log('🎯 Target: nexus_main → v27.0_recursos_imperativos_bloqueo_kyc\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: promptContent,
      version: 'v27.0_recursos_imperativos_bloqueo_kyc',
      updated_at: new Date().toISOString(),
    })
    .eq('name', 'nexus_main')
    .select()
    .single();

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('✅ System prompt actualizado exitosamente');
  console.log(`📌 Nombre:    ${data.name}`);
  console.log(`🏷️  Versión:   ${data.version}`);
  console.log(`📅 Fecha:     ${new Date(data.updated_at).toLocaleString('es-CO', { timeZone: 'America/Bogota' })}`);
  console.log(`📏 Tamaño:    ${promptContent.length} caracteres`);
  console.log('\n🔄 El caché se actualizará en los próximos 5 minutos.');
  console.log('💡 Para efecto inmediato en dev: reinicia el servidor con npm run dev');
}

actualizarSystemPrompt();
