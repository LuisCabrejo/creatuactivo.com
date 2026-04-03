/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt a v20.0 (Constructor Patrimonio)
 * Lee el contenido desde knowledge_base/system-prompt-nexus-v19.6_lifestyle_bienestar_v3.2.md
 *
 * Cambios v20.0: héroe = Constructor, categoría Patrimonio Paralelo, metodología EAM,
 * sub-perfiles PERFIL_01, fechas 4-12 abril, eliminado "Arquitecto" del rol del héroe
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-nexus-v19.6_lifestyle_bienestar_v3.2.md'),
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
      version: 'v20.0_constructor_patrimonio',
      updated_at: new Date().toISOString(),
    })
    .eq('name', 'nexus_main')
    .select()
    .single();

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('✅ System prompt actualizado:', data.version);
  console.log('📅 Actualizado:', data.updated_at);
}

actualizarSystemPrompt();
