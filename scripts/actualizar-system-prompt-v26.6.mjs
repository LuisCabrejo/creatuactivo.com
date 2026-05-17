/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt a v26.6 (Jerarquía Causal Corregida — Déficit Estructural = CAUSA, no consecuencia)
 * Lee el contenido desde knowledge_base/system-prompt-nexus-main-v26_6.md
 *
 * Cambios respecto a v26.5 (corrección semántica doctrinal):
 * - Déficit Estructural de Ingresos: ahora es CAUSA RAÍZ DE DISEÑO (no consecuencia)
 * - Modelo de presencia obligada: MANIFESTACIÓN OPERATIVA del déficit (no causa raíz)
 * - Colapso del flujo de caja al detenerse: CONSECUENCIA matemática cuantificable
 * - Razón semántica: el adjetivo "estructural" denota cualidad de los cimientos → causa, no consecuencia
 *
 * Sincronizado con: arsenal_inicial v25.5 (WHY_01 + STORY_01 + PERFIL_01) + arsenal_reto v4.4
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-nexus-main-v26_6.md'),
  'utf-8'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function actualizarSystemPrompt() {
  console.log('📡 Conectando a Supabase...');
  console.log(`📄 Prompt cargado: ${promptContent.length} caracteres`);
  console.log('🎯 Target: nexus_main → v26.6_jerarquia_causal_corregida\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: promptContent,
      version: 'v26.6_jerarquia_causal_corregida',
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
