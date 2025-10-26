#!/usr/bin/env node
// Script para forzar refresh del cache de Anthropic
// Agrega un comentario invisible al final del System Prompt para cambiar el hash

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔄 Forzando refresh del cache de Anthropic...\n');

try {
  // Leer System Prompt actual
  const { data: currentPrompt, error: readError } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (readError) {
    console.error('❌ Error al leer System Prompt:', readError);
    process.exit(1);
  }

  console.log('✅ System Prompt actual leído');
  console.log(`   Versión: ${currentPrompt.version}`);
  console.log(`   Longitud: ${currentPrompt.prompt?.length || 0} caracteres\n`);

  // Agregar timestamp invisible al final para cambiar el hash
  const timestamp = new Date().toISOString();
  const invisibleComment = `\n\n---\n\n<!-- Cache Refresh: ${timestamp} -->\n`;

  let updatedPrompt = currentPrompt.prompt;

  // Remover comentarios previos de cache refresh
  updatedPrompt = updatedPrompt.replace(/\n\n---\n\n<!-- Cache Refresh:.*?-->\n/g, '');

  // Agregar nuevo comentario
  updatedPrompt = updatedPrompt + invisibleComment;

  console.log('✅ Timestamp invisible agregado al System Prompt');
  console.log(`   Nueva longitud: ${updatedPrompt.length} caracteres\n`);

  // Actualizar versión
  const newVersion = 'v12.11_memoria_largo_plazo_refresh';

  // Guardar en Supabase
  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: updatedPrompt,
      version: newVersion,
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('❌ Error al actualizar System Prompt:', updateError);
    process.exit(1);
  }

  console.log('━'.repeat(80));
  console.log('✅ CACHE DE ANTHROPIC FORZADO A REFRESCAR');
  console.log('━'.repeat(80));
  console.log(`📌 Nueva versión: ${newVersion}`);
  console.log(`📌 Timestamp: ${timestamp}`);
  console.log(`📌 Cambio: Hash del prompt modificado (comentario invisible)`);
  console.log('━'.repeat(80));
  console.log('\n⚠️  IMPORTANTE:');
  console.log('   - Anthropic detectará el prompt como "nuevo" (hash diferente)');
  console.log('   - El cache anterior será invalidado');
  console.log('   - Prueba NEXUS en 1-2 minutos');
  console.log('   - Pregunta: "¿De qué producto hablamos antes?"');
  console.log('   - Debe recordar la conversación previa');
  console.log('\n✅ Script completado exitosamente');

} catch (err) {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
}
