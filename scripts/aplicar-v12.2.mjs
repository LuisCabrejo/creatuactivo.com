#!/usr/bin/env node

/**
 * Script para aplicar NEXUS v12.2 Jobs-Style + Legal Compliance en Supabase
 * Fecha: 17 Noviembre 2025
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer .env.local
const envPath = join(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    env[key.trim()] = values.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan credenciales de Supabase en .env.local');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

// Leer el system prompt v12.2
const promptPath = join(__dirname, '../knowledge_base/nexus-system-prompt-v12.2-jobs-style-legal.md');
const promptContent = readFileSync(promptPath, 'utf-8');

console.log('🚀 Aplicando NEXUS v12.2 en Supabase...\n');
console.log('📂 Archivo:', promptPath);
console.log('📏 Tamaño:', promptContent.length, 'caracteres');
console.log('🔗 URL Supabase:', supabaseUrl);
console.log('');

// Crear cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Leer versión actual
console.log('📖 Leyendo versión actual...');
const { data: currentData, error: readError } = await supabase
  .from('system_prompts')
  .select('name, version, updated_at')
  .eq('name', 'nexus_main')
  .single();

if (readError) {
  console.error('❌ Error al leer versión actual:', readError.message);
  process.exit(1);
}

console.log('   Versión actual:', currentData.version);
console.log('   Última actualización:', currentData.updated_at);
console.log('');

// Confirmar antes de actualizar
console.log('⚠️  Esto actualizará el system prompt a v12.2 con:');
console.log('   ✅ Consentimiento legal minimalista (Ley 1581/2012)');
console.log('   ✅ Anti-transiciones ("Mientras tanto..." prohibido)');
console.log('   ✅ Timing 2da-3ra pregunta para nombre');
console.log('   ✅ URL correcta: https://creatuactivo.com/privacidad');
console.log('');

// Actualizar
console.log('🔄 Actualizando a v12.2...');
const { data: updateData, error: updateError } = await supabase
  .from('system_prompts')
  .update({
    prompt: promptContent,
    version: 'v12.2',
    updated_at: new Date().toISOString()
  })
  .eq('name', 'nexus_main')
  .select();

if (updateError) {
  console.error('❌ Error al actualizar:', updateError.message);
  process.exit(1);
}

console.log('✅ Actualización exitosa!');
console.log('');

// Verificar
console.log('🔍 Verificando actualización...');
const { data: verifyData, error: verifyError } = await supabase
  .from('system_prompts')
  .select('name, version, updated_at, prompt')
  .eq('name', 'nexus_main')
  .single();

if (verifyError) {
  console.error('❌ Error al verificar:', verifyError.message);
  process.exit(1);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 Name:', verifyData.name);
console.log('📌 Version:', verifyData.version);
console.log('📌 Updated:', verifyData.updated_at);
console.log('📌 Prompt length:', verifyData.prompt.length, 'caracteres');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

// Verificar contenido crítico
const hasConsent = verifyData.prompt.includes('https://creatuactivo.com/privacidad');
const hasAntiTransition = verifyData.prompt.includes('NUNCA agregues transiciones antes de opciones');
const hasTiming = verifyData.prompt.includes('SEGUNDA O TERCERA pregunta');

console.log('✅ Verificación de contenido:');
console.log('   ', hasConsent ? '✓' : '✗', 'URL privacidad correcta');
console.log('   ', hasAntiTransition ? '✓' : '✗', 'Anti-transiciones presente');
console.log('   ', hasTiming ? '✓' : '✗', 'Timing 2da-3ra pregunta');
console.log('');

if (hasConsent && hasAntiTransition && hasTiming) {
  console.log('🎉 ¡TODO CORRECTO! v12.2 aplicado exitosamente.');
  console.log('');
  console.log('⏰ IMPORTANTE: Espera 5 minutos para que expire el cache.');
  console.log('   Luego prueba NEXUS en: https://creatuactivo.com');
  console.log('');
  console.log('⚠️  PENDIENTE: Crear página /privacidad en el sitio.');
  console.log('   Sin esta página, el enlace "Leer política completa" fallará.');
} else {
  console.log('⚠️  Advertencia: Algunos cambios críticos no se detectaron.');
  console.log('   Revisa manualmente el contenido en Supabase.');
}

console.log('');
console.log('✅ Script completado.');
