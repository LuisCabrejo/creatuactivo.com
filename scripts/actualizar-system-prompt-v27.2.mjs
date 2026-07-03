/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt de Queswa (nexus_main) en Supabase.
 * Lee el contenido desde knowledge_base/system-prompt-nexus-main-v27_2.md
 * (nombre de archivo legacy — el contenido es la versión indicada en VERSION_LABEL).
 *
 * Versión desplegada: v29.1 — compresión ~34KB→~21KB sin cambio doctrinal
 * + regla de moneda por país (Colombia solo COP · US USD · resto USD default).
 * Historial completo → knowledge_base/CHANGELOG-system-prompts.md
 */

const VERSION_LABEL = 'v29.1_compresion_moneda_pais';

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-nexus-main-v27_2.md'),
  'utf-8'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function actualizarSystemPrompt() {
  console.log('📡 Conectando a Supabase...');
  console.log(`📄 Prompt cargado: ${promptContent.length} caracteres`);
  console.log(`🎯 Target: nexus_main → ${VERSION_LABEL}\n`);

  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: promptContent,
      version: VERSION_LABEL,
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
  console.log('\n📋 Pruebas sugeridas:');
  console.log('   1. Visitante CO pregunta precios → solo COP (nunca USD)');
  console.log('   2. "cómo se gana?" → 12 velocidades + GEN5/Binario sin proyecciones');
  console.log('   3. NO debe aparecer "Dashboard" ni "pilares" de cara al prospecto');
}

actualizarSystemPrompt();
