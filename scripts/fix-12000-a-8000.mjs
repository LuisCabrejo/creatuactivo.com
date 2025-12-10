#!/usr/bin/env node

/**
 * FIX: Cambiar 12,000 → 8,000 en System Prompt
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

async function fixSystemPrompt() {
  console.log('🔄 Corrigiendo 12,000 → 8,000 en System Prompt...\n');

  const { data: prompt, error: readError } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (readError || !prompt) {
    console.log('❌ No se encontró el System Prompt:', readError);
    return;
  }

  console.log('📖 Versión actual:', prompt.version);
  console.log('📏 Longitud:', prompt.prompt.length, 'caracteres');

  // Contar ocurrencias antes
  const countBefore = (prompt.prompt.match(/12,000/g) || []).length;
  console.log(`\n🔍 Ocurrencias de "12,000" encontradas: ${countBefore}`);

  if (countBefore === 0) {
    console.log('✅ No hay nada que corregir. El System Prompt ya está correcto.');
    return;
  }

  // Mostrar contexto
  const matches = prompt.prompt.match(/.{0,50}12,000.{0,50}/g);
  if (matches) {
    console.log('\n📋 Contextos encontrados:');
    matches.forEach((m, i) => console.log(`   ${i + 1}. ...${m}...`));
  }

  // Reemplazar 12,000 por 8,000
  let newPrompt = prompt.prompt;
  newPrompt = newPrompt.replace(/12,000 clientes y constructores/g, '8,000 clientes y constructores');
  newPrompt = newPrompt.replace(/más de 12,000 clientes/g, 'más de 8,000 clientes');
  newPrompt = newPrompt.replace(/12,000 clientes/g, '8,000 clientes');

  const countAfter = (newPrompt.match(/12,000/g) || []).length;

  console.log(`\n📝 Reemplazos realizados: ${countBefore - countAfter}`);

  // Guardar
  const { data, error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v14.2.1_fix_8000_personas',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')
    .select();

  if (updateError) {
    console.log('❌ Error al actualizar:', updateError);
    return;
  }

  console.log('\n✅ System Prompt actualizado a v14.2.1');
  console.log('📌 Updated at:', data[0].updated_at);

  // Verificar
  const { data: verify } = await supabase
    .from('system_prompts')
    .select('prompt')
    .eq('name', 'nexus_main')
    .single();

  console.log('\n🔍 Verificación final:');

  if (verify.prompt.includes('8,000 clientes')) {
    console.log('   ✅ Dice "8,000 clientes"');
  }

  const remaining = (verify.prompt.match(/12,000/g) || []).length;
  if (remaining > 0) {
    console.log(`   ⚠️  Aún hay ${remaining} referencias a "12,000"`);
  } else {
    console.log('   ✅ No hay referencias a "12,000"');
  }

  console.log('\n🎉 Proceso completado\n');
}

fixSystemPrompt().catch(console.error);
