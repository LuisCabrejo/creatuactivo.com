#!/usr/bin/env node
// Script para leer System Prompt actual de NEXUS desde Supabase

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno manualmente desde .env.local
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
  console.error('Asegúrate de que .env.local tenga:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('📖 Leyendo System Prompt de NEXUS desde Supabase...\n');

try {
  const { data, error } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (error) {
    console.error('❌ Error al leer System Prompt:', error);
    process.exit(1);
  }

  if (!data) {
    console.error('❌ No se encontró System Prompt con name="nexus_main"');
    process.exit(1);
  }

  console.log('✅ System Prompt encontrado:');
  console.log('━'.repeat(80));
  console.log(`📌 Name: ${data.name}`);
  console.log(`📌 Version: ${data.version}`);
  console.log(`📌 Created: ${data.created_at}`);
  console.log(`📌 Updated: ${data.updated_at}`);
  console.log(`📌 Prompt length: ${data.prompt?.length || 0} caracteres`);
  console.log('━'.repeat(80));
  console.log('\n📄 CONTENIDO COMPLETO:\n');
  console.log(data.prompt);
  console.log('\n' + '━'.repeat(80));

  // Buscar secciones relevantes para el problema de timing
  console.log('\n🔍 ANÁLISIS DE SECCIONES RELEVANTES:\n');

  const prompt = data.prompt || '';

  // Buscar sección de captura de nombre
  const nombreMatch = prompt.match(/PASO 1[:\s\-]*NOMBRE[\s\S]{0,500}/i);
  if (nombreMatch) {
    console.log('📍 PASO 1 - NOMBRE:');
    console.log('─'.repeat(80));
    console.log(nombreMatch[0].substring(0, 500) + '...');
    console.log('─'.repeat(80) + '\n');
  }

  // Buscar sección de arquetipos
  const arquetipoMatch = prompt.match(/PASO 2[:\s\-]*ARQUETIPO[\s\S]{0,500}/i);
  if (arquetipoMatch) {
    console.log('📍 PASO 2 - ARQUETIPO:');
    console.log('─'.repeat(80));
    console.log(arquetipoMatch[0].substring(0, 500) + '...');
    console.log('─'.repeat(80) + '\n');
  }

  // Buscar sección de WhatsApp
  const whatsappMatch = prompt.match(/PASO 3[:\s\-]*WHATSAPP[\s\S]{0,500}/i);
  if (whatsappMatch) {
    console.log('📍 PASO 3 - WHATSAPP:');
    console.log('─'.repeat(80));
    console.log(whatsappMatch[0].substring(0, 500) + '...');
    console.log('─'.repeat(80) + '\n');
  }

  // Buscar instrucciones sobre timing
  const timingMatches = prompt.match(/timing|segunda.*respuesta|después.*preguntas|NUNCA.*opciones/gi);
  if (timingMatches && timingMatches.length > 0) {
    console.log('⏱️  MENCIONES DE TIMING ENCONTRADAS:', timingMatches.length);
    console.log(timingMatches.slice(0, 10));
    console.log('\n');
  }

  // Buscar instrucciones sobre opciones A/B/C
  const opcionesMatches = prompt.match(/opciones.*A\).*B\).*C\)|¿Te gustaría|profundizar/gi);
  if (opcionesMatches && opcionesMatches.length > 0) {
    console.log('🅰️  MENCIONES DE OPCIONES A/B/C:', opcionesMatches.length);
    console.log(opcionesMatches.slice(0, 10));
    console.log('\n');
  }

  console.log('✅ Lectura completada exitosamente');

} catch (err) {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
}
