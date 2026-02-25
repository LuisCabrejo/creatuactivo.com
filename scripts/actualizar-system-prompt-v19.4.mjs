/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt a v19.4 (El Mapa de Salida — erradicar Reto de 5 Días)
 * Lee el contenido desde knowledge_base/system-prompt-nexus-v19.3_facilitador_herramientas.md
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-nexus-v19.3_facilitador_herramientas.md'),
  'utf-8'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function actualizarSystemPrompt() {
  console.log('📡 Conectando a Supabase...');
  console.log(`📄 Prompt cargado: ${promptContent.length} caracteres`);

  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: promptContent,
      version: 'v19.4_mapa_de_salida',
      updated_at: new Date().toISOString(),
    })
    .eq('name', 'nexus_main')
    .select()
    .single();

  if (error) {
    console.error('❌ Error al actualizar:', error.message);
    process.exit(1);
  }

  console.log('✅ System prompt actualizado en Supabase:');
  console.log(`   Versión: ${data.version}`);
  console.log(`   Longitud: ${data.prompt.length} caracteres`);
  console.log(`   Updated at: ${data.updated_at}`);
  console.log('');
  console.log('✅ v19.4 activo. El caché expira en 5 min (o reinicia el servidor).');
}

actualizarSystemPrompt();
