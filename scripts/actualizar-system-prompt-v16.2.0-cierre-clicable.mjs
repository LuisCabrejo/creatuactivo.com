#!/usr/bin/env node

/**
 * Script para actualizar System Prompt a v16.2.0 CIERRE CLICABLE
 * Fecha: 28 Diciembre 2025
 *
 * Cambios principales:
 * 1. Enlaces clicables en markdown para URL y WhatsApp
 * 2. CONSTRUCTOR_CONTEXT para personalizar cierre según quién refirió
 * 3. Mensajes pre-llenados en WhatsApp
 * 4. Enlace de formulario con ref del constructor
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
  console.log('📤 Actualizando System Prompt a Queswa v16.2.0 CIERRE CLICABLE...\n');

  // Leer el nuevo system prompt desde knowledge_base
  const newPromptPath = join(__dirname, '..', 'knowledge_base', 'system-prompt-nexus-v16.2.0_cierre_clicable.md');
  const newPrompt = readFileSync(newPromptPath, 'utf-8');

  console.log(`📌 Tamaño del nuevo prompt: ${newPrompt.length} caracteres`);
  console.log(`📌 Líneas: ${newPrompt.split('\n').length}`);

  // Actualizar en Supabase
  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v16.2.0_cierre_clicable',
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
  console.log(`📌 Versión: v16.2.0_cierre_clicable`);
  console.log(`📌 Updated: ${data[0]?.updated_at}`);

  // Verificación
  console.log('\n🔍 Verificando contenido...');
  const waLinkCount = (newPrompt.match(/wa\.me/g) || []).length;
  const constructorContextCount = (newPrompt.match(/CONSTRUCTOR_CONTEXT/g) || []).length;
  const markdownLinkCount = (newPrompt.match(/\[.*?\]\(https?:\/\/.*?\)/g) || []).length;
  const villanoCount = (newPrompt.match(/DIRECTRIZ DEL VILLANO/g) || []).length;

  console.log(`   - Enlaces WhatsApp (wa.me): ${waLinkCount}`);
  console.log(`   - CONSTRUCTOR_CONTEXT: ${constructorContextCount > 0 ? '✅' : '❌'}`);
  console.log(`   - Links markdown: ${markdownLinkCount}`);
  console.log(`   - Directriz Villano: ${villanoCount > 0 ? '✅' : '❌'}`);

  console.log('\n📋 Nuevas características v16.2.0:');
  console.log('   - Enlaces clicables en cierre de venta');
  console.log('   - CONSTRUCTOR_CONTEXT para personalización');
  console.log('   - WhatsApp con mensaje pre-llenado');
  console.log('   - Formulario con ref del constructor');
  console.log('\n🎉 System Prompt v16.2.0 CIERRE CLICABLE desplegado!');
}

updateSystemPrompt().catch(console.error);
