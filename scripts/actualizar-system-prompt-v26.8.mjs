/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt a v26.8 (XML tags <verbatim_lock> reemplaza [VERBATIM_LOCK])
 * Lee el contenido desde knowledge_base/system-prompt-nexus-main-v26_8.md
 *
 * Cambios respecto a v26.7 (verbatim_lock_master_responses):
 * - Migración crítica: `[VERBATIM_LOCK]` → `<verbatim_lock>` en TODA la doctrina del prompt
 *   (regla inviolable + directriz RAG en ACTIVACIÓN QUESWA).
 * - Sin cambios de fondo en el copy del Director Académico (sigue siendo el mismo texto
 *   maestro v5.0/v6.0/v5.1 en arsenal_inicial.txt v25.8).
 *
 * Razón doctrinal (investigación Gemini 18 May 2026, Hipótesis C confirmada):
 * Claude Sonnet 4.6 fue post-entrenado para activar atención sobre etiquetas XML
 * estructuradas (<context>, <instructions>, <constraints>). Los corchetes planos
 * `[VERBATIM_LOCK]` se procesan como texto de baja prioridad dentro de la secuencia
 * y NO activan los pesos de atención específicos. Esto explica por qué v26.7 falló
 * empíricamente al forzar delivery verbatim — el marcador era invisible al mecanismo
 * de atención del modelo.
 *
 * Sincronizado con arsenal_inicial.txt v25.8 (WHY_01/WHY_02/EAM_01 con <verbatim_lock>).
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-nexus-main-v26_8.md'),
  'utf-8'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function actualizarSystemPrompt() {
  console.log('📡 Conectando a Supabase...');
  console.log(`📄 Prompt cargado: ${promptContent.length} caracteres`);
  console.log('🎯 Target: nexus_main → v26.8_xml_verbatim_lock\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: promptContent,
      version: 'v26.8_xml_verbatim_lock',
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
