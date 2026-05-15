/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt a v26.5 (Pilar 3 = La Metodología Automatizada / Tridente EAM)
 * Lee el contenido desde knowledge_base/system-prompt-nexus-main-v26_5.md
 *
 * Cambios respecto a v26.4 (resolución de disonancia arquitectónica):
 * - Pilar 3: "El Arquitecto de Patrimonio" → "La Metodología Automatizada (Tridente EAM)"
 * - Rol del usuario (Arquitecto de Patrimonio) recategorizado: dirige los tres pilares, NO es uno de ellos
 * - Metáfora arquitectónica: tres pilares dirigidos por el Arquitecto (no tres pilares donde uno ES el Arquitecto)
 * - Sincronizado con servilleta v3.1 + arsenal_inicial v25.3
 *
 * Justificación: si Pilar 3 = el usuario, solo se entregan 2 pilares (Matriz Física + Queswa).
 * El tercer pilar debe ser un componente entregado por el sistema (Metodología Automatizada),
 * no el rol del receptor. El Arquitecto queda elevado como director, no como pieza.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-nexus-main-v26_5.md'),
  'utf-8'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function actualizarSystemPrompt() {
  console.log('📡 Conectando a Supabase...');
  console.log(`📄 Prompt cargado: ${promptContent.length} caracteres`);
  console.log('🎯 Target: nexus_main → v26.5_pilar3_metodologia_automatizada\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: promptContent,
      version: 'v26.5_pilar3_metodologia_automatizada',
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
