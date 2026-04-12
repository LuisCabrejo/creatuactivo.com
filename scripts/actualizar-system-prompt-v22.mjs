/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt a v22.0 (Premium Accesible — Mercado Orgánico)
 * Lee el contenido desde knowledge_base/system-prompt-nexus-main-v22.0.md
 *
 * Cambios v22.0:
 * - M1: texto "Premium Accesible" validado por investigación + chips
 * - Eliminada captura de nombre en M2 → movida al Handoff (Principio de Reciprocidad)
 * - 3 scripts nuevos de transparencia radical: pirámide (Ley 1700), inversión, "meter gente"
 * - Manejo de 4 chips: ⚙️ Cómo funciona / 📊 Proyección / 📦 Vehículo / 👤 Evaluar viabilidad
 * - Protocolo Handoff Guante Blanco con script de reciprocidad Cialdini
 * - Tono: "Premium Accesible" (Empatía + Lujo Clínico accesible)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-nexus-main-v22.0.md'),
  'utf-8'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function actualizarSystemPrompt() {
  console.log('📡 Conectando a Supabase...');
  console.log(`📄 Prompt cargado: ${promptContent.length} caracteres`);
  console.log('🎯 Target: nexus_main → v25.0_perfil_puro\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: promptContent,
      version: 'v25.0_perfil_puro',
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
