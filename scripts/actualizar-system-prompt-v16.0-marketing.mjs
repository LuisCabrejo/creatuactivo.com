#!/usr/bin/env node

/**
 * Script para actualizar System Prompt a v16.0 MARKETING
 * Fecha: 28 Diciembre 2025
 *
 * Cambios principales:
 * 1. Fusión con recomendaciones Gemini
 * 2. Protocolo Anti-MLM explícito
 * 3. Arquetipo "Arquitecto Estoico"
 * 4. Método BRIDGE integrado
 * 5. Etimología Queswa ("El Enlace" en Quechua)
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
  console.log('📤 Actualizando System Prompt a Queswa v16.0 MARKETING...\n');

  // Leer el nuevo system prompt desde knowledge_base
  const newPromptPath = join(__dirname, '..', 'knowledge_base', 'system-prompt-queswa-v16.0.0-marketing.md');
  const newPrompt = readFileSync(newPromptPath, 'utf-8');

  console.log(`📌 Tamaño del nuevo prompt: ${newPrompt.length} caracteres`);
  console.log(`📌 Líneas: ${newPrompt.split('\n').length}`);

  // Actualizar en Supabase
  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v16.0.0_marketing_gemini_fusion',
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
  console.log(`📌 Versión: v16.0.0_marketing_gemini_fusion`);
  console.log(`📌 Updated: ${data[0]?.updated_at}`);

  // Verificación
  console.log('\n🔍 Verificando contenido...');
  const nexusCount = (newPrompt.match(/NEXUS/g) || []).length;
  const queswaCount = (newPrompt.match(/Queswa/gi) || []).length;
  const antiMLMCount = (newPrompt.match(/Anti-MLM|ANTI-MLM/g) || []).length;
  const bridgeCount = (newPrompt.match(/BRIDGE/g) || []).length;
  const estoicoCount = (newPrompt.match(/Estoico|estoico/g) || []).length;

  console.log(`   - Ocurrencias "NEXUS": ${nexusCount}`);
  console.log(`   - Ocurrencias "Queswa": ${queswaCount}`);
  console.log(`   - Protocolo Anti-MLM: ${antiMLMCount > 0 ? '✅' : '❌'}`);
  console.log(`   - Método BRIDGE: ${bridgeCount > 0 ? '✅' : '❌'}`);
  console.log(`   - Arquetipo Estoico: ${estoicoCount > 0 ? '✅' : '❌'}`);

  if (nexusCount === 0 && queswaCount > 0) {
    console.log('\n🎉 System Prompt v16.0.0 MARKETING desplegado!');
    console.log('   Fusión Gemini + CreaTuActivo completada');
  } else if (nexusCount > 0) {
    console.log('\n⚠️ Aún hay referencias a NEXUS');
  }

  console.log('\n📋 Nuevas características v16.0.0:');
  console.log('   - Etimología: Queswa = "El Enlace" (Quechua)');
  console.log('   - Arquetipo: Arquitecto Estoico');
  console.log('   - Protocolo Anti-MLM con tabla de reemplazos');
  console.log('   - Método BRIDGE para conversión');
  console.log('   - Scripts de objeciones optimizados');
}

updateSystemPrompt().catch(console.error);
