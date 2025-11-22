#!/usr/bin/env node
/**
 * Script AGRESIVO para eliminar TODO rastro de consentimiento del System Prompt
 *
 * Busca y elimina TODAS las menciones de:
 * - consentimiento
 * - autorización
 * - tratamiento de datos
 * - aceptas
 * - política de privacidad
 *
 * Fecha: 21 Nov 2025
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnvFile() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    const env = {};
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        env[key] = value;
      }
    });
    return env;
  } catch (error) {
    console.error('Error leyendo .env.local:', error.message);
    return {};
  }
}

const env = loadEnvFile();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSystemPrompt() {
  console.log('🔥 ELIMINACIÓN AGRESIVA de TODO consentimiento...\n');

  const { data: currentPrompt, error: readError } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (readError) {
    console.error('❌ Error leyendo system prompt:', readError);
    process.exit(1);
  }

  console.log('📖 Prompt actual:');
  console.log(`   Versión: ${currentPrompt.version}`);
  console.log(`   Longitud: ${currentPrompt.prompt.length} caracteres\n`);

  let updatedPrompt = currentPrompt.prompt;
  let totalRemoved = 0;

  // Lista de patrones para eliminar (orden importa - de específico a general)
  const patternsToRemove = [
    // Secciones completas con headers
    /## 🔒 CONSENTIMIENTO LEGAL[\s\S]*?(?=##[^#]|$)/g,
    /### 🚨 REGLA[\s\S]*?(?=###|##[^#]|$)/g,
    /### 📊 SISTEMA DE CONTEO[\s\S]*?(?=###|##[^#]|$)/g,
    /### ✅ CUÁNDO SOLICITAR[\s\S]*?(?=###|##[^#]|$)/g,
    /### 🛑 DESPUÉS DE PEDIR[\s\S]*?(?=###|##[^#]|$)/g,
    /### 🔒 AUTO-BLOQUEO[\s\S]*?(?=###|##[^#]|$)/g,
    /### ⚠️ CASOS ESPECIALES[\s\S]*?(?=###|##[^#]|$)/g,
    /### TEXTO EXACTO[\s\S]*?(?=###|##[^#]|$)/g,
    /### MANEJO DE RESPUESTAS[\s\S]*?(?=###|##[^#]|$)/g,
    /### 🎯 REGLA DE ORO[\s\S]*?(?=###|##[^#]|$)/g,
    /### TEXTO EXACTO \(Usar SIEMPRE este texto\):[\s\S]*?```\s*B\) ❌ No, gracias\s*```/g,

    // Bloques específicos
    /\*\*VERIFICACIÓN AUTOMÁTICA[\s\S]*?(?=\*\*|###|##[^#])/g,
    /\*\*TU ÚNICA RESPONSABILIDAD:[\s\S]*?(?=\*\*|###|##[^#])/g,

    // Líneas individuales con menciones clave
    /.*consentimiento.*/gi,
    /.*autorización.*/gi,
    /.*tratamiento de datos.*/gi,
    /.*Política de Privacidad.*/gi,
    /.*¿Aceptas\?.*/gi,
    /.*consent_granted.*/gi,
  ];

  console.log('🗑️  Eliminando patrones...\n');

  patternsToRemove.forEach((pattern, index) => {
    const before = updatedPrompt.length;
    updatedPrompt = updatedPrompt.replace(pattern, '');
    const after = updatedPrompt.length;
    const removed = before - after;

    if (removed > 0) {
      totalRemoved += removed;
      console.log(`   ✓ Patrón ${index + 1}: ${removed} caracteres eliminados`);
    }
  });

  // Limpiar líneas vacías múltiples
  updatedPrompt = updatedPrompt.replace(/\n\n\n+/g, '\n\n');

  console.log(`\n📊 Total eliminado: ${totalRemoved} caracteres`);
  console.log(`📊 Longitud final: ${updatedPrompt.length} caracteres\n`);

  // Actualizar versión
  const newVersion = 'v17.0_zero_consent_aggressive_clean';

  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: updatedPrompt,
      version: newVersion,
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('❌ Error actualizando:', updateError);
    process.exit(1);
  }

  console.log('✅ System Prompt actualizado exitosamente\n');
  console.log('📊 Resultado:');
  console.log(`   🔥 ${totalRemoved} caracteres eliminados`);
  console.log(`   ✓ Nueva versión: ${newVersion}`);
  console.log(`   ✓ Longitud final: ${updatedPrompt.length} caracteres\n`);

  console.log('🎯 NEXUS ahora:');
  console.log('   ✅ NO puede pedir consentimiento (código eliminado)');
  console.log('   ✅ Cookie Banner maneja todo');
  console.log('   ✅ UX sin interrupciones\n');
}

updateSystemPrompt().catch(console.error);
