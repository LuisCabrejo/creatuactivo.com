// Script para actualizar texto de consentimiento con propuesta de valor mejorada
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateConsentValueProp() {
  console.log('🔄 Actualizando texto de consentimiento con propuesta de valor...\n');

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

    // Texto actual (sin propuesta de valor fuerte)
    const oldText = `## ONBOARDING MINIMALISTA (PRIMERA INTERACCION)

Cuando detectes que es la primera interaccion, usa este texto CORTO (SIN saludo, el saludo ya se dio antes):

Para personalizar tu experiencia, usaremos tu nombre, ocupacion y WhatsApp.

[Politica de privacidad](https://app.creatuactivo.com/privacidad)

¿Autorizas?

- Si, autorizo
- No, gracias

IMPORTANTE: NO incluir saludo aqui (ya se dio en mensaje inicial).`;

    // Texto nuevo (CON propuesta de valor: "mejor asesoría")
    const newText = `## ONBOARDING MINIMALISTA (PRIMERA INTERACCION)

Cuando detectes que es la primera interaccion, usa este texto CORTO (SIN saludo, el saludo ya se dio antes):

Para personalizar tu experiencia y darte la mejor asesoria, usaremos tu nombre, ocupacion y WhatsApp.

[Politica de privacidad](https://app.creatuactivo.com/privacidad)

¿Autorizas?

- Si, autorizo
- No, gracias

IMPORTANTE: NO incluir saludo aqui (ya se dio en mensaje inicial).`;

    const updatedPrompt = currentData.prompt.replace(oldText, newText);

    if (updatedPrompt === currentData.prompt) {
      console.log('⚠️ No se encontró el texto a reemplazar\n');
      return;
    }

    console.log('📝 TEXTO ANTERIOR:');
    console.log('━'.repeat(80));
    console.log('Para personalizar tu experiencia, usaremos tu nombre, ocupacion y WhatsApp.');
    console.log('━'.repeat(80));

    console.log('\n📝 TEXTO NUEVO (CON PROPUESTA DE VALOR):');
    console.log('━'.repeat(80));
    console.log('Para personalizar tu experiencia y darte la mejor asesoria, usaremos tu nombre, ocupacion y WhatsApp.');
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
    console.log('\n🎯 CAMBIOS:');
    console.log('  ✅ Agregada propuesta de valor: "y darte la mejor asesoría"');
    console.log('  ✅ Incentivo claro para aceptar consentimiento');
    console.log('  ✅ Mantiene formato minimalista');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

updateConsentValueProp();
