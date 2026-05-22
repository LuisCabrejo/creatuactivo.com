/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt a v27.1 (Limpieza de redundancias — Ola 1)
 * Lee el contenido desde knowledge_base/system-prompt-nexus-main-v27_1.md
 *
 * Cambios respecto a v27.0:
 *
 * Auditoría de redundancia Ola 1 (sin cambios de comportamiento esperados —
 * solo limpieza estructural). Reducción ~21% del prompt:
 *
 * #1 — Vectores técnicos de cierre repetidos 3x → 1 lugar (TONO Y VOZ).
 *      CAPA C de Pirámide McKinsey y ACTIVACIÓN QUESWA ahora hacen referencia
 *      cruzada en lugar de duplicar las 3 frases.
 *
 * #3 — Sección ACTIVACIÓN QUESWA v26.4 colapsada. Era un resumen de todo el
 *      prompt anterior (~1,800 chars de redundancia con IDENTIDAD CORE,
 *      ARQUITECTURA OPERATIVA, TONO Y VOZ, RAG, ANTI-MLM). Reducida a
 *      directrices operativas únicas (estado dinámico, principio fundamental).
 *
 * #4 — Vocabulario prohibido unificado. 3 tablas separadas con solapamiento
 *      (TONO Y VOZ → PROHIBIDO, PROTOCOLO ANTI-MLM → tabla, VOCABULARIO
 *      PROHIBIDO ADICIONAL) consolidadas en 2 tablas maestras dentro de
 *      PROTOCOLO ANTI-MLM (TÉCNICO vs DOCTRINAL). TONO Y VOZ → PROHIBIDO
 *      ahora solo formato/estilo (signos de exclamación, hype, clichés).
 *
 * #7 — Reglas A/B/C/D colapsadas con E/F/G/H. Las nuevas reglas elevadas
 *      al inicio (RECURSOS DE LEGIBILIDAD — REGLA IMPERATIVA) cubren los
 *      casos generales. Las reglas A-D del bloque histórico ahora son
 *      casos específicos del dominio Queswa con referencia cruzada a E-H.
 *
 * #8 — Changelogs históricos extraídos a knowledge_base/CHANGELOG-system-prompts.md
 *      Antes ocupaban ~3,000 chars al inicio del prompt en Supabase.
 *      El modelo no necesita el changelog histórico para generar respuestas.
 *
 * #9 — Referencias de versión sincronizadas. Líneas que decían "Eres Queswa v26.5"
 *      y "READY AS QUESWA v26.4 — 10 MAYO 2026" actualizadas a v27.1 / 22 MAY 2026.
 *
 * Tamaño: 45,940 → ~36,143 chars (~21% reducción).
 *
 * NO incluido (Ola 2 pendiente, requiere QA empírico):
 * - #2 Reglas E/F/G/H duplicación residual
 * - #5 Anti-alucinación dispersa en 5 lugares (KNOWLEDGE BASE + REGLAS ANTI-ALUCINACIÓN + KYC)
 * - #6 Doctrina canónica repetida (IDENTIDAD CORE + ARQUITECTURA OPERATIVA)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-nexus-main-v27_1.md'),
  'utf-8'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function actualizarSystemPrompt() {
  console.log('📡 Conectando a Supabase...');
  console.log(`📄 Prompt cargado: ${promptContent.length} caracteres`);
  console.log('🎯 Target: nexus_main → v27.1_limpieza_redundancias\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: promptContent,
      version: 'v27.1_limpieza_redundancias',
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
  console.log(`📏 Tamaño:    ${promptContent.length} caracteres (vs ~45,940 en v27.0, reducción ~21%)`);
  console.log('\n🔄 El caché se actualizará en los próximos 5 minutos.');
  console.log('💡 Para efecto inmediato en dev: reinicia el servidor con npm run dev');
}

actualizarSystemPrompt();
