#!/usr/bin/env node

/**
 * Script para LIMPIAR regla obsoleta del Reto de los 12 Días
 * Fecha: 10 Dic 2025
 * Razón: arsenal_compensacion v2.2 ya tiene información correcta
 *        La regla en System Prompt tiene datos desactualizados (8,190 vs $95M)
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

async function limpiarReglaObsoleta() {
  console.log('🔄 Limpiando regla obsoleta del Reto de los 12 Días...\n');

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

  // Verificar si existe la regla obsoleta
  if (!prompt.prompt.includes('RETO DE LOS 12 DÍAS - NO INVENTAR')) {
    console.log('\n✅ La regla obsoleta no existe. Nada que hacer.');
    return;
  }

  // Buscar y eliminar toda la sección
  // Patrón: desde "## 🚨 REGLA CRÍTICA: RETO DE LOS 12 DÍAS - NO INVENTAR" hasta el siguiente "---" + "## 🚫"
  const reglaRetoRegex = /---\s*\n\s*## 🚨 REGLA CRÍTICA: RETO DE LOS 12 DÍAS - NO INVENTAR[\s\S]*?(?=---\s*\n\s*## 🚫 REGLAS ANTI-ALUCINACIÓN)/;

  let newPrompt = prompt.prompt;

  if (reglaRetoRegex.test(newPrompt)) {
    newPrompt = newPrompt.replace(reglaRetoRegex, '');
    console.log('\n✅ Sección "RETO DE LOS 12 DÍAS - NO INVENTAR" eliminada');
  } else {
    // Intentar patrón alternativo
    const altRegex = /## 🚨 REGLA CRÍTICA: RETO DE LOS 12 DÍAS - NO INVENTAR[\s\S]*?(?=## 🚫 REGLAS ANTI-ALUCINACIÓN)/;
    if (altRegex.test(newPrompt)) {
      newPrompt = newPrompt.replace(altRegex, '');
      console.log('\n✅ Sección eliminada (patrón alternativo)');
    } else {
      console.log('\n⚠️  No se pudo encontrar el patrón exacto para eliminar');
      console.log('   Mostrando contexto...');
      const match = newPrompt.match(/.{0,50}RETO DE LOS 12 DÍAS - NO INVENTAR.{0,50}/);
      if (match) console.log('   ...', match[0], '...');
      return;
    }
  }

  // Limpiar posibles líneas vacías duplicadas
  newPrompt = newPrompt.replace(/\n{4,}/g, '\n\n\n');

  // Calcular diferencia
  const diff = prompt.prompt.length - newPrompt.length;
  console.log(`📉 Reducción: ${diff} caracteres eliminados`);

  // Guardar
  const { data, error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v14.5.0_arsenal_compensacion_v2.2_limpio',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')
    .select();

  if (updateError) {
    console.log('❌ Error al actualizar:', updateError);
    return;
  }

  console.log('\n✅ System Prompt actualizado a v14.5.0');
  console.log('📌 Updated at:', data[0].updated_at);
  console.log('📏 Nueva longitud:', newPrompt.length, 'caracteres');

  // Verificar
  const { data: verify } = await supabase
    .from('system_prompts')
    .select('prompt')
    .eq('name', 'nexus_main')
    .single();

  if (!verify.prompt.includes('RETO DE LOS 12 DÍAS - NO INVENTAR')) {
    console.log('\n🔍 Verificación: ✅ Regla obsoleta eliminada correctamente');
  } else {
    console.log('\n🔍 Verificación: ⚠️  Aún hay referencias a la regla');
  }

  console.log('\n🎉 Proceso completado');
  console.log('\n📋 Cambios:');
  console.log('   - Regla "RETO DE LOS 12 DÍAS - NO INVENTAR" eliminada');
  console.log('   - NEXUS ahora usará arsenal_compensacion v2.2 directamente');
  console.log('   - Sin tabla incorrecta de 8,190 personas en System Prompt');
}

limpiarReglaObsoleta().catch(console.error);
