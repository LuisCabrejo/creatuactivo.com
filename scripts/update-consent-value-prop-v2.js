// Script para actualizar con propuesta de valor: "mejor asesoría"
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateConsentValueProp() {
  console.log('🔄 Actualizando con propuesta de valor...\n');

  try {
    const { data: currentData, error: fetchError } = await supabase
      .from('system_prompts')
      .select('prompt, version')
      .eq('name', 'nexus_main')
      .single();

    if (fetchError) {
      console.error('❌ Error:', fetchError);
      return;
    }

    console.log(`✅ Versión actual: ${currentData.version}\n`);

    // Buscar y reemplazar la línea específica
    const oldLine = 'Para personalizar tu experiencia, usaremos tu nombre, ocupacion y WhatsApp.';
    const newLine = 'Para personalizar tu experiencia y darte la mejor asesoria, usaremos tu nombre, ocupacion y WhatsApp.';

    if (!currentData.prompt.includes(oldLine)) {
      console.log('⚠️ El texto ya fue actualizado o no se encontró\n');
      return;
    }

    const updatedPrompt = currentData.prompt.replace(oldLine, newLine);

    console.log('📝 CAMBIO:');
    console.log('━'.repeat(80));
    console.log('ANTES:', oldLine);
    console.log('AHORA:', newLine);
    console.log('━'.repeat(80));

    const newVersion = 'v12.2_value_prop_asesoria';

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
      return;
    }

    console.log(`\n✅ Actualizado a ${newVersion}`);
    console.log('  ✅ Propuesta de valor agregada: "y darte la mejor asesoría"');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

updateConsentValueProp();
