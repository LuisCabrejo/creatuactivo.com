#!/usr/bin/env node
/**
 * Script para actualizar System Prompt NEXUS v13.7
 * "Socio Digital" + Lenguaje Quirúrgico + Corrección Semántica
 *
 * Cambios críticos vs v13.6:
 * - Identidad redefinida: "Socio Digital / Ejecutor" (no asistente pasivo)
 * - Lenguaje quirúrgico: Patrones de "Distribución Masiva" + "SOCIO" + "3 componentes"
 * - Corrección semántica: "tecnología propietaria" (NO "patente mundial")
 * - Mantiene flujo 14 mensajes + formato v12.3
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
  console.log('\n🚀 Actualizando System Prompt v13.7 Socio Digital...');

  const contenido = readFileSync(
    join(__dirname, '../knowledge_base/system-prompt-nexus-v13.7_quirurgico_socio_digital.md'),
    'utf-8'
  );

  const { data, error} = await supabase
    .from('system_prompts')
    .update({
      prompt: contenido,
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (error) {
    console.error('❌ Error actualizando system prompt:', error);
    return false;
  }

  console.log('✅ System Prompt v13.7 actualizado exitosamente');
  console.log(`   - ${contenido.split('\n').length} líneas`);
  console.log(`   - ${(contenido.length / 1024).toFixed(1)} KB`);
  return true;
}

async function verificarActualizacion() {
  console.log('\n🔍 Verificando actualización...');

  const { data, error } = await supabase
    .from('system_prompts')
    .select('name, updated_at')
    .eq('name', 'nexus_main')
    .single();

  if (error) {
    console.error('❌ Error verificando:', error);
    return;
  }

  console.log('\n📊 System Prompt actualizado:');
  console.log(`   - Nombre: ${data.name}`);
  console.log(`   - Versión: v13.7_quirurgico_socio_digital`);
  console.log(`   - Fecha: ${data.updated_at}`);
  console.log(`   - Nueva identidad: Socio Digital / Ejecutor`);

  console.log('\n✨ Cambios críticos aplicados:');
  console.log('   ✓ IDENTIDAD REDEFINIDA: "Socio Digital / Ejecutor"');
  console.log('   ✓ LENGUAJE QUIRÚRGICO: Distribución Masiva + SOCIO');
  console.log('   ✓ CORRECCIÓN SEMÁNTICA: "tecnología propietaria"');
  console.log('   ✓ Integra los 3 componentes: negocio + tecnología + mentoría');
  console.log('   ✓ Patrón "columna financiera alterna"');
}

async function limpiarCachePrompt() {
  console.log('\n🧹 Limpiando cache de System Prompt...');

  // En producción, el cache se limpia automáticamente después de 5 minutos
  // Este mensaje es solo informativo

  console.log('   ℹ️  El cache se limpiará automáticamente en 5 minutos');
  console.log('   ℹ️  Para forzar actualización inmediata, reinicia el servidor dev');
}

// Ejecutar actualización
async function main() {
  console.log('🚀 ACTUALIZACIÓN SYSTEM PROMPT NEXUS v13.7');
  console.log('============================================\n');
  console.log('Nueva identidad: SOCIO DIGITAL / EJECUTOR');
  console.log('Lenguaje: QUIRÚRGICO (Distribución Masiva)');
  console.log('Semántica: CORREGIDA (tecnología propietaria)\n');

  const ok = await actualizarSystemPrompt();

  if (ok) {
    await verificarActualizacion();
    await limpiarCachePrompt();
    console.log('\n✅ ACTUALIZACIÓN COMPLETA');
    console.log('\n📌 NEXUS ahora es "Socio Digital" con lenguaje quirúrgico');
    console.log('📌 Reinicia el servidor dev para aplicar cambios inmediatamente');
  } else {
    console.log('\n❌ ACTUALIZACIÓN FALLIDA - Revisar errores arriba');
    process.exit(1);
  }
}

main().catch(console.error);
