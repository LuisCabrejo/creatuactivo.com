// Script para actualizar el system prompt a v12.1 en Supabase
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSystemPrompt() {
  try {
    console.log('🔄 [UPDATE] Leyendo system prompt v12.1 desde archivo...');

    const promptPath = join(__dirname, 'nexus-system-prompt-v12.1.md');
    const promptContent = readFileSync(promptPath, 'utf-8');

    console.log(`📄 [UPDATE] Longitud del prompt: ${promptContent.length} caracteres`);
    console.log('━'.repeat(80));

    // Actualizar el registro existente
    const { data, error } = await supabase
      .from('system_prompts')
      .update({
        prompt: promptContent,
        version: 'v12.1_timing_optimizado',
        updated_at: new Date().toISOString()
      })
      .eq('name', 'nexus_main')
      .select();

    if (error) {
      console.error('❌ [UPDATE] Error al actualizar:', error);
      return;
    }

    console.log('✅ [UPDATE] System prompt actualizado exitosamente a v12.1');
    console.log('━'.repeat(80));
    console.log('📊 RESUMEN DEL CAMBIO:');
    console.log('   Versión anterior: v12.0_compliance_legal');
    console.log('   Versión nueva:    v12.1_timing_optimizado');
    console.log('   Registro ID:      ', data[0].id);
    console.log('   Fecha:            ', data[0].updated_at);
    console.log('━'.repeat(80));
    console.log('\n🎯 CAMBIOS PRINCIPALES EN v12.1:');
    console.log('   ✅ Preguntas de captura AL FINAL (después de opciones A/B/C)');
    console.log('   ✅ Formato vertical obligatorio para listas con emojis');
    console.log('   ✅ Efecto de recencia aplicado (usuario recuerda lo último)');
    console.log('   ✅ Mantiene compliance legal total (Ley 1581/2012)');
    console.log('━'.repeat(80));
    console.log('\n⚠️ IMPORTANTE: Reinicia el servidor de desarrollo para aplicar cambios');
    console.log('   npm run dev\n');

  } catch (err) {
    console.error('❌ [UPDATE] Error inesperado:', err);
  }
}

updateSystemPrompt();
