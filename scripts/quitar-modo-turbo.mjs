#!/usr/bin/env node

/**
 * Script para quitar MODO TURBO del System Prompt
 * Fecha: 10 Dic 2025
 * Razón: Los vectores hacen el trabajo de routing - MODO TURBO es innecesario
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

async function quitarModoTurbo() {
  console.log('🔄 Quitando MODO TURBO del System Prompt...\n');

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

  // Verificar si existe MODO TURBO
  if (!prompt.prompt.includes('MODO TURBO')) {
    console.log('\n✅ MODO TURBO no existe en el System Prompt. Nada que hacer.');
    return;
  }

  // Buscar y quitar la sección MODO TURBO completa
  // El patrón busca desde "## 🔥 MODO TURBO" hasta el siguiente "---" o "## " que marque otra sección
  const modoTurboRegex = /---\s*\n\s*## 🔥 MODO TURBO - RETO DE LOS 12 DÍAS[\s\S]*?(?=---\s*\n\s*## [^🔥]|---\s*\n\s*## 🚨 REGLA CRÍTICA)/;

  let newPrompt = prompt.prompt;

  if (modoTurboRegex.test(newPrompt)) {
    newPrompt = newPrompt.replace(modoTurboRegex, '');
    console.log('\n✅ Sección MODO TURBO eliminada');
  } else {
    // Intentar otro patrón más simple
    const altRegex = /## 🔥 MODO TURBO[\s\S]*?(?=## 🚨 REGLA CRÍTICA|## 📐 FORMATO)/;
    if (altRegex.test(newPrompt)) {
      newPrompt = newPrompt.replace(altRegex, '');
      console.log('\n✅ Sección MODO TURBO eliminada (patrón alternativo)');
    } else {
      console.log('\n⚠️  No se pudo encontrar el patrón MODO TURBO para eliminar');
      console.log('   Mostrando contexto...');
      const match = newPrompt.match(/.{0,100}MODO TURBO.{0,100}/);
      if (match) console.log('   ...', match[0], '...');
      return;
    }
  }

  // Calcular diferencia
  const diff = prompt.prompt.length - newPrompt.length;
  console.log(`📉 Reducción: ${diff} caracteres eliminados`);

  // Guardar
  const { data, error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v14.3.0_sin_modo_turbo_vectores_activos',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')
    .select();

  if (updateError) {
    console.log('❌ Error al actualizar:', updateError);
    return;
  }

  console.log('\n✅ System Prompt actualizado a v14.3.0');
  console.log('📌 Updated at:', data[0].updated_at);
  console.log('📏 Nueva longitud:', newPrompt.length, 'caracteres');

  // Verificar
  const { data: verify } = await supabase
    .from('system_prompts')
    .select('prompt')
    .eq('name', 'nexus_main')
    .single();

  if (!verify.prompt.includes('MODO TURBO')) {
    console.log('\n🔍 Verificación: ✅ MODO TURBO eliminado correctamente');
  } else {
    console.log('\n🔍 Verificación: ⚠️  Aún hay referencias a MODO TURBO');
  }

  console.log('\n🎉 Proceso completado');
  console.log('\n📋 Cambios:');
  console.log('   - MODO TURBO eliminado');
  console.log('   - arsenal_compensacion ahora usa búsqueda vectorial');
  console.log('   - NEXUS usará similitud semántica para encontrar respuestas del Reto');
}

quitarModoTurbo().catch(console.error);
