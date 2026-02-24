/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt a v19.3 (Facilitador de Herramientas)
 * - 80% → 90% en todos los scripts operativos
 * - Nuevo P7: "Tu rol es entregar una herramienta" + Analogía del Software
 * Lee el contenido desde knowledge_base/system-prompt-queswa-v18.1.md
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-queswa-v18.1.md'),
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
      version: 'v19.3_facilitador_herramientas',
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
  console.log('✅ v19.3 activo. Caché en memoria de 5 min (reinicia el servidor para efecto inmediato).');
  console.log('');
  console.log('📋 Cambios aplicados:');
  console.log('   • 80% → 90% en P7 "¿Cuál es mi rol?" y objeción "No tengo tiempo"');
  console.log('   • P7 nuevo script: "Facilitador de Herramientas" + Analogía del Software');
  console.log('   • Nuevo encuadre: "Actualización en Paralelo" (sin renunciar al empleo)');
}

actualizarSystemPrompt();
