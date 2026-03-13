/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt a v19.6 (Lifestyle Bienestar — Corrección v3.2)
 * Lee el contenido desde knowledge_base/system-prompt-nexus-v19.6_lifestyle_bienestar.md
 *
 * Cambios v3.2: Bienvenida sin sesgo corporativo + opciones A-D actualizadas
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-nexus-v19.6_lifestyle_bienestar.md'),
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
      version: 'v19.6_lifestyle_bienestar_v3.2',
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
