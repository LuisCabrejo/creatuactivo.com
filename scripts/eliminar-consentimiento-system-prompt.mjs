#!/usr/bin/env node
/**
 * Script para ELIMINAR completamente la sección de consentimiento del System Prompt
 *
 * Razón: Cookie Banner en página maneja el consentimiento (UX mejor)
 * NEXUS ya NO pide consentimiento
 *
 * Fecha: 21 Nov 2025
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer variables de entorno desde .env.local
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
  console.log('🗑️  Eliminando sección de consentimiento del System Prompt...\n');

  // 1. Leer el prompt actual
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
  console.log(`   Versión: ${currentPrompt.version}\n`);

  let updatedPrompt = currentPrompt.prompt;

  // 2. ELIMINAR completamente la sección de consentimiento
  const consentRegex = /## 🔒 CONSENTIMIENTO LEGAL[\s\S]*?(?=##|$)/;

  if (consentRegex.test(updatedPrompt)) {
    updatedPrompt = updatedPrompt.replace(consentRegex, '');
    console.log('✅ Sección de consentimiento ELIMINADA completamente\n');
  } else {
    console.log('ℹ️  No se encontró sección de consentimiento (ya eliminada)\n');
  }

  // 3. Actualizar versión
  const newVersion = 'v16.0_no_consent_cookie_banner';

  // 4. Actualizar en Supabase
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
  console.log('📊 Cambios aplicados:');
  console.log('   🗑️  Sección de consentimiento eliminada');
  console.log('   ✅ NEXUS YA NO pide consentimiento');
  console.log('   ✅ Cookie Banner en página maneja el consentimiento');
  console.log(`   ✓ Nueva versión: ${newVersion}\n`);

  console.log('📝 Cambio de versión:');
  console.log(`   Anterior: ${currentPrompt.version}`);
  console.log(`   Nueva:    ${newVersion}\n`);

  console.log('🎯 Nueva Arquitectura:');
  console.log('   1. Usuario entra al sitio');
  console.log('   2. Cookie Banner aparece en footer');
  console.log('   3. Usuario acepta cookies');
  console.log('   4. NEXUS puede operar libremente (sin pedir consentimiento)');
  console.log('   5. UX mejorada - consentimiento profesional\n');
}

updateSystemPrompt().catch(console.error);
