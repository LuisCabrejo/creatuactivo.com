#!/usr/bin/env node

/**
 * Script para actualizar System Prompt a v15.0 QUESWA
 * Fecha: 28 Diciembre 2025
 *
 * Cambios principales:
 * 1. Rebrand: NEXUS → Queswa
 * 2. Actualización de versión a v15.0.0
 * 3. Fecha actualizada
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env.local manualmente
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function updateSystemPrompt() {
  console.log('📤 Actualizando System Prompt a Queswa v15.0...\n');

  // Leer el nuevo system prompt
  const newPromptPath = '/tmp/system-prompt-queswa-v15.0.md';
  const newPrompt = readFileSync(newPromptPath, 'utf-8');

  console.log(`📌 Tamaño del nuevo prompt: ${newPrompt.length} caracteres`);
  console.log(`📌 Líneas: ${newPrompt.split('\n').length}`);

  // Actualizar en Supabase
  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v15.0.0_queswa_rebrand',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')
    .select();

  if (error) {
    console.error('❌ Error actualizando:', error);
    return;
  }

  console.log('\n✅ System Prompt actualizado exitosamente');
  console.log(`📌 ID: ${data[0]?.id}`);
  console.log(`📌 Versión: v15.0.0_queswa_rebrand`);
  console.log(`📌 Updated: ${data[0]?.updated_at}`);

  // Verificación
  console.log('\n🔍 Verificando contenido...');
  const nexusCount = (newPrompt.match(/NEXUS/g) || []).length;
  const queswaCount = (newPrompt.match(/Queswa/g) || []).length;
  console.log(`   - Ocurrencias "NEXUS": ${nexusCount}`);
  console.log(`   - Ocurrencias "Queswa": ${queswaCount}`);

  if (nexusCount === 0 && queswaCount > 0) {
    console.log('\n🎉 Rebrand NEXUS → Queswa completado!');
  } else if (nexusCount > 0) {
    console.log('\n⚠️ Aún hay referencias a NEXUS');
  }
}

updateSystemPrompt().catch(console.error);
