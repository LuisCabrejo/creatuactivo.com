/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt a v26.4 (Retrofit fricción nivel 5 + eliminación "actualización software financiero")
 * Lee el contenido desde knowledge_base/system-prompt-nexus-main-v26_4.md
 *
 * Cambios respecto a v26.3 (11 ediciones quirúrgicas):
 * - 6 instancias "actualización de software financiero" → "instalación de Estructura Patrimonial en paralelo"
 * - "apalancamiento asimétrico" → "apalancamiento estratégico" (fricción nivel 5)
 * - "gobernanza estratégica/de activos" → "dirección estratégica/dirigir activo patrimonial" (fricción nivel 5)
 * - Negaciones discursivas eliminadas: "NO es reemplazo. NO es escape." (×2) + 3 antiejemplos en Directrices de Voz
 *
 * Justificación: investigaciones canónicas (Léxico Financiero Reels + ADN Semántico Colombiano)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-nexus-main-v26_4.md'),
  'utf-8'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function actualizarSystemPrompt() {
  console.log('📡 Conectando a Supabase...');
  console.log(`📄 Prompt cargado: ${promptContent.length} caracteres`);
  console.log('🎯 Target: nexus_main → v26.4_retrofit_friccion_nivel_5_actualizacion_eliminada\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: promptContent,
      version: 'v26.4_retrofit_friccion_nivel_5_actualizacion_eliminada',
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
