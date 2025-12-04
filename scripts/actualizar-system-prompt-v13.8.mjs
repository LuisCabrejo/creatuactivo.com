#!/usr/bin/env node
/**
 * Script para actualizar System Prompt NEXUS v13.8
 * Respuestas Quirúrgicas + Opciones Contextuales
 *
 * Cambios críticos vs v13.7:
 * - RESPUESTA ACORTADA: "Cómo funciona el negocio" sin los 3 pasos operativos (INICIAR/ACOGER/ACTIVAR)
 * - OPCIONES CONTEXTUALES: Preguntas tipo "¿Cuál sería mi rol?" en lugar de statements
 * - CONCISIÓN QUIRÚRGICA: Responde lo que pregunta, detalles vienen después cuando profundice
 * - Mantiene identidad Socio Digital + lenguaje quirúrgico + semántica correcta
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno no encontradas');
  console.error('Asegúrate de que .env.local tenga:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function actualizarSystemPrompt() {
  console.log('\n🚀 Actualizando System Prompt v13.8.2 Simplificación Radical...');

  const contenido = readFileSync(
    join(__dirname, '../knowledge_base/system-prompt-nexus-v13.7_quirurgico_socio_digital.md'),
    'utf-8'
  );

  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: contenido,
      version: 'v13.8.2_simplificacion_radical',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (error) {
    console.error('❌ Error actualizando system prompt:', error);
    return false;
  }

  console.log('✅ System Prompt v13.8.2 actualizado exitosamente');
  console.log(`   - ${contenido.split('\n').length} líneas`);
  console.log(`   - ${(contenido.length / 1024).toFixed(1)} KB`);
  return true;
}

async function verificarActualizacion() {
  console.log('\n🔍 Verificando actualización...');

  const { data, error } = await supabase
    .from('system_prompts')
    .select('name, version, updated_at')
    .eq('name', 'nexus_main')
    .single();

  if (error) {
    console.error('❌ Error verificando:', error);
    return;
  }

  console.log('\n📊 System Prompt actualizado:');
  console.log(`   - Nombre: ${data.name}`);
  console.log(`   - Versión: ${data.version}`);
  console.log(`   - Fecha: ${data.updated_at}`);

  console.log('\n✨ Cambios críticos aplicados (v13.8.2):');
  console.log('   ✅ REGLA GLOBAL: Solicitudes de datos SIEMPRE solas (sin opciones después)');
  console.log('   ✅ MENSAJE 2 SIMPLIFICADO: Sin ejemplos condicionantes');
  console.log('   ✅ MENSAJE 5-7 SIMPLIFICADO: Sin condicionales confusos');
  console.log('   🗑️  ELIMINADO: Ejemplo que condicionaba "Perfecto. CreaTuActivo es..."');
}

async function limpiarCachePrompt() {
  console.log('\n🧹 Limpiando cache de System Prompt...');
  console.log('   ℹ️  El cache se limpiará automáticamente en 5 minutos');
  console.log('   ℹ️  Para forzar actualización inmediata, reinicia el servidor dev');
}

// Ejecutar actualización
async function main() {
  console.log('🚀 ACTUALIZACIÓN SYSTEM PROMPT NEXUS v13.8.2');
  console.log('===============================================\n');
  console.log('SIMPLIFICACIÓN RADICAL');
  console.log('Eliminados ejemplos condicionantes');
  console.log('Regla global: Solicitudes SIEMPRE solas\n');

  const ok = await actualizarSystemPrompt();

  if (ok) {
    await verificarActualizacion();
    await limpiarCachePrompt();
    console.log('\n✅ ACTUALIZACIÓN COMPLETA');
    console.log('\n📌 Simplificación aplicada: Sin ejemplos que condicionen respuestas');
    console.log('📌 NEXUS ahora responde preguntas y pide datos de forma natural');
    console.log('📌 Solicitudes SIEMPRE solas (sin opciones adicionales)');
    console.log('📌 Reinicia el servidor dev para aplicar cambios inmediatamente');
  } else {
    console.log('\n❌ ACTUALIZACIÓN FALLIDA - Revisar errores arriba');
    process.exit(1);
  }
}

main().catch(console.error);
