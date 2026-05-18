/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt a v26.7 (VERBATIM_LOCK + Master Responses del Director Académico)
 * Lee el contenido desde knowledge_base/system-prompt-nexus-main-v26_7.md
 *
 * Cambios respecto a v26.6 (jerarquía causal corregida):
 * - Nueva regla [VERBATIM_LOCK]: cualquier fragmento RAG envuelto entre [VERBATIM_LOCK]...[/VERBATIM_LOCK]
 *   se entrega carácter por carácter, sin parafraseo. Sobrescribe el límite de 150 palabras.
 * - Excepción de LÍMITE DE RESPUESTA gobernada por marcador estructural (ya no enumeración).
 * - Directriz RAG (ACTIVACIÓN QUESWA) incluye excepción inviolable apuntando al VERBATIM_LOCK.
 *
 * Justificación: v26.5/v26.6 protegían solo WHY_02 verbatim por instrucción natural-language;
 * empíricamente esa protección se diluía contra los 27KB del system prompt y el modelo
 * parafraseaba igual. El marcador estructural es más resistente al drift del LLM.
 *
 * Sincronizado con arsenal_inicial.txt v25.7 (WHY_01/WHY_02/EAM_01 con [VERBATIM_LOCK]).
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-nexus-main-v26_7.md'),
  'utf-8'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function actualizarSystemPrompt() {
  console.log('📡 Conectando a Supabase...');
  console.log(`📄 Prompt cargado: ${promptContent.length} caracteres`);
  console.log('🎯 Target: nexus_main → v26.7_verbatim_lock_master_responses\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: promptContent,
      version: 'v26.7_verbatim_lock_master_responses',
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
