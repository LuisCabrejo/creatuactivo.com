// Script para obtener el system prompt actual de NEXUS desde Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getSystemPrompt() {
  try {
    const { data, error } = await supabase
      .from('system_prompts')
      .select('*')
      .eq('name', 'nexus_main')
      .single();

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('✅ System Prompt encontrado:');
    console.log('━'.repeat(80));
    console.log('DATA COMPLETO:', JSON.stringify(data, null, 2));
    console.log('━'.repeat(80));

    // Intentar diferentes nombres de campo
    const promptContent = data.content || data.prompt || data.system_prompt || data.text;

    if (promptContent) {
      console.log('CONTENT:');
      console.log('━'.repeat(80));
      console.log(promptContent);
      console.log('━'.repeat(80));
      console.log(`\n📊 Longitud: ${promptContent.length} caracteres`);
    } else {
      console.log('⚠️ No se encontró el campo de contenido. Estructura de la tabla:');
      console.log(Object.keys(data));
    }
  } catch (err) {
    console.error('❌ Error inesperado:', err);
  }
}

getSystemPrompt();
