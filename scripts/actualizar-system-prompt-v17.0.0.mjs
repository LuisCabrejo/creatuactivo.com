#!/usr/bin/env node
/**
 * Script para actualizar System Prompt a v17.0.0 NAVAL/JOBS
 *
 * Cambios v17.0.0:
 * 1. RAG con prioridad de [Concepto Nuclear]
 * 2. Tono Naval Ravikant / Steve Jobs
 * 3. Framing de "Capitalización" (no "costo")
 * 4. CTA: "Auditoría de Perfil" (no "agendar llamada")
 *
 * Fecha: 17 Enero 2026
 */

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

async function updateSystemPrompt() {
  console.log('🚀 ACTUALIZANDO SYSTEM PROMPT A v17.0.0 NAVAL/JOBS\n');
  console.log('=' .repeat(60));

  // Leer el nuevo system prompt
  const promptPath = resolve(__dirname, '../knowledge_base/system-prompt-queswa-v17.0.0_naval_jobs.md');
  const newPrompt = readFileSync(promptPath, 'utf-8');

  console.log(`📄 Nuevo prompt: ${newPrompt.length} caracteres`);

  // Verificar versión actual
  const { data: current, error: readError } = await supabase
    .from('system_prompts')
    .select('version, updated_at')
    .eq('name', 'nexus_main')
    .single();

  if (readError) {
    console.error('❌ Error leyendo prompt actual:', readError);
    return;
  }

  console.log(`📌 Versión actual: ${current.version}`);
  console.log(`📌 Última actualización: ${current.updated_at}\n`);

  // Actualizar
  console.log('🔄 Actualizando a v17.0.0_naval_jobs...\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v17.0.0_naval_jobs',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')
    .select();

  if (error) {
    console.error('❌ Error actualizando:', error);
    return;
  }

  console.log('✅ System Prompt actualizado exitosamente\n');
  console.log('=' .repeat(60));
  console.log('📊 RESUMEN DE CAMBIOS v17.0.0:\n');
  console.log('1. ✅ RAG: Prioridad de [Concepto Nuclear]');
  console.log('   - Buscar etiqueta [Concepto Nuclear] en fragmentos');
  console.log('   - Usar como "punta de lanza" de respuestas');
  console.log('   - Tabla de analogías canonizadas\n');

  console.log('2. ✅ TONO: Naval Ravikant / Steve Jobs');
  console.log('   - Frases cortas, aforísticas');
  console.log('   - Máximo 3 párrafos por respuesta');
  console.log('   - Puntos finales, no exclamaciones\n');

  console.log('3. ✅ FRAMING: "Capitalización" no "costo"');
  console.log('   - Infraestructura $200K entregada gratis');
  console.log('   - ESP-3: $1,000 (17%), ESP-2: $500, ESP-1: $200\n');

  console.log('4. ✅ CTA: "Auditoría de Perfil"');
  console.log('   - Reemplaza "agendar llamada"');
  console.log('   - Frase: "Si la lógica te hace sentido..."\n');

  console.log('=' .repeat(60));
  console.log('\n🎯 Queswa v17.0.0 NAVAL/JOBS está ACTIVO\n');

  // Verificación
  const checks = [
    { name: '[Concepto Nuclear]', found: newPrompt.includes('[Concepto Nuclear]') },
    { name: 'Analogías canonizadas', found: newPrompt.includes('Baldes vs Tubería') },
    { name: 'Máximo 3 párrafos', found: newPrompt.includes('Máximo 3 párrafos') },
    { name: 'Naval Ravikant', found: newPrompt.includes('Naval Ravikant') },
    { name: 'Capitalización', found: newPrompt.includes('Capitalización de Inventario') },
    { name: 'Auditoría de Perfil', found: newPrompt.includes('Auditoría de Perfil') },
    { name: 'No "agendar llamada"', found: !newPrompt.includes('Agendar llamada') }
  ];

  console.log('🔍 Verificaciones:\n');
  let passed = 0;
  checks.forEach(check => {
    console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
    if (check.found) passed++;
  });

  console.log(`\n📊 ${passed}/${checks.length} verificaciones pasadas\n`);
}

updateSystemPrompt().catch(console.error);
