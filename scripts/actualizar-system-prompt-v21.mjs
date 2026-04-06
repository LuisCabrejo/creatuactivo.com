/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt a v21.0 (Prompt Comprimido)
 * Lee el contenido desde knowledge_base/system-prompt-nexus-v21.0.md
 *
 * Cambios v21.0:
 * - Reducción de 59KB → 23KB (eliminación de secciones redundantes)
 * - PROTOCOLO DE CIERRE eliminado del prompt (ahora en code FSM / getMicroPromptCierre)
 * - Lista de precios eliminada del prompt (en arsenal catalogo_productos vía Voyage AI)
 * - METODOLOGÍA EAM movida a arsenal_inicial como EAM_01/EAM_02
 * - Few-shots comprimidos de 8 a 3 ejemplos (P1 verbatim + P2 dinero + P3 pirámide)
 * - Flujo 14 mensajes: solo M1-M4 completo, M5+ como reglas
 * - <prospect_state> injection en route.ts para context pinning (recency bias)
 * - EL PRINCIPIO reescrito: héroe capaz con falla estructural, no víctima
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-nexus-v21.0.md'),
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
      version: 'v21.0_prompt_comprimido',
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
  console.log(`📊 Tamaño: ${promptContent.length} chars (~${Math.round(promptContent.length / 1024)}KB)`);
}

actualizarSystemPrompt();
