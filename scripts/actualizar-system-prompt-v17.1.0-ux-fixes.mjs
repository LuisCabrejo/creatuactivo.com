#!/usr/bin/env node
/**
 * Script para actualizar el System Prompt de Queswa a v17.1.0
 * Fecha: 17 Enero 2026
 *
 * CAMBIOS v17.1.0 (UX Fixes Críticos):
 * 1. [Concepto Nuclear] NUNCA se escribe literalmente - es interno
 * 2. Respuestas a opciones situacionales A-D con reconocimiento de contexto
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer variables de entorno
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: No se encontraron las credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function actualizarSystemPrompt() {
  console.log('🔄 ACTUALIZACIÓN SYSTEM PROMPT QUESWA v17.1.0\n');
  console.log('='.repeat(60));
  console.log('');

  // Leer contenido del archivo actualizado
  const promptPath = join(__dirname, '..', 'knowledge_base', 'system-prompt-queswa-v17.1.0_ux_fixes.md');
  const contenido = readFileSync(promptPath, 'utf8');

  console.log(`📄 Archivo leído: system-prompt-queswa-v17.1.0_ux_fixes.md`);
  console.log(`📊 Tamaño: ${contenido.length} caracteres`);
  console.log('');

  // Actualizar en Supabase
  console.log('🔄 Actualizando en Supabase...\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: contenido,
      version: 'v17.1.0_ux_fixes',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')
    .select();

  if (error) {
    console.error('❌ Error al actualizar Supabase:', error);
    process.exit(1);
  }

  console.log('✅ System Prompt actualizado correctamente en Supabase\n');
  console.log('='.repeat(60));
  console.log('\n📋 CAMBIOS v17.1.0 (UX Fixes):\n');
  console.log('  ✅ [Concepto Nuclear] es INTERNO - nunca escribir en respuestas');
  console.log('  ✅ Respuestas a opciones A-D con reconocimiento de situación');
  console.log('  ✅ Tabla de empatía contextual agregada');
  console.log('  ✅ Ejemplo completo de respuesta correcta');
  console.log('  ✅ Checklist con nuevas verificaciones');
  console.log('');
  console.log('🎯 System Prompt v17.1.0 desplegado correctamente');
  console.log('');
}

actualizarSystemPrompt().catch(console.error);
